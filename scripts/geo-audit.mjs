#!/usr/bin/env node
// GEO audit: scores a public site the way an AI search engine reads it.
// The rubric is our own, built from public guidance (Google Search Essentials,
// schema.org, llms.txt, RFC 9309). It is intentionally transparent: every point
// belongs to a named check, and a check that could not run is reported as such
// instead of being counted as a pass.
//
// Usage:
//   node scripts/geo-audit.mjs https://example.com
//   node scripts/geo-audit.mjs example.com --max-pages 8 --out report.html
//   node scripts/geo-audit.mjs example.com --json > report.json
//
// No dependencies. Node 22+.

import { lookup } from "node:dns/promises";
import { writeFile } from "node:fs/promises";
import { isIP } from "node:net";
import { pathToFileURL } from "node:url";
import { robotsAllows } from "../src/checkup.js";

const VERSION = "1.0.0";
const DEFAULT_UA = `Mozilla/5.0 (compatible; ai-ulu-geo-audit/${VERSION}; +https://ai-ulu.com/checkup/)`;
const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_MAX_BYTES = 1_500_000;
const DEFAULT_MAX_PAGES = 5;
const MAX_PAGES = 20;
const CONCURRENCY = 3;

const CATEGORIES = [
  ["schema", "Structured Data"],
  ["content", "Content Quality"],
  ["technical", "Technical SEO"],
  ["ai", "AI Access"],
  ["brand", "Brand & Entity"],
];

const AI_BOTS = [
  ["GPTBot", "OpenAI", 2],
  ["OAI-SearchBot", "ChatGPT arama", 2],
  ["ClaudeBot", "Anthropic", 1],
  ["Claude-SearchBot", "Claude arama", 1],
  ["PerplexityBot", "Perplexity", 2],
  ["Google-Extended", "Gemini", 2],
  ["Bingbot", "Bing / Copilot", 1],
  ["CCBot", "Common Crawl", 1],
];

const SKIP_PATH = /\/(?:api|admin|login|logout|signin|signup|cart|checkout|sepet|hesap|search|arama|tag|etiket|page|sayfa)(?:\/|$)/i;
const ASSET_EXT = /\.(?:pdf|jpe?g|png|gif|webp|avif|svg|ico|css|js|mjs|json|xml|txt|zip|rar|gz|mp4|mp3|woff2?|ttf|otf)$/i;
const CONTENT_PATH = /\/(?:blog|rehber|guide|makale|article|haber|news|yazi|post)(?:\/|$)/i;
const ABOUT_PATH = /\/(?:about|hakkimizda|hakkinda|kurumsal|company)(?:\/|$)/i;
const CONTACT_PATH = /\/(?:contact|iletisim|bize-ulasin)(?:\/|$)/i;
const PAGE_HINTS = ["about", "hakkimizda", "hakkinda", "hizmet", "service", "fiyat", "pricing", "iletisim", "contact", "blog", "calismalar", "portfolio", "sablon", "template", "urun", "product", "sss", "faq"];

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(value) {
  return String(value).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function attr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const m = tag.match(re);
  return m ? decodeEntities(m[1] ?? m[2] ?? m[3] ?? "").trim() : "";
}

export function visibleText(html) {
  return decodeEntities(
    String(html)
      .replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<noscript\b[\s\S]*?<\/noscript>|<svg\b[\s\S]*?<\/svg>|<template\b[\s\S]*?<\/template>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function metaMap(html) {
  const out = {};
  for (const m of String(html).matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    const key = attr(tag, "name") || attr(tag, "property") || attr(tag, "itemprop");
    const value = attr(tag, "content");
    if (key && value) out[key.toLowerCase()] = value;
  }
  return out;
}

function links(html) {
  return [...String(html).matchAll(/<link\b[^>]*>/gi)].map((m) => ({
    rel: attr(m[0], "rel").toLowerCase().split(/\s+/).filter(Boolean),
    href: attr(m[0], "href"),
    type: attr(m[0], "type"),
  }));
}

function headings(html) {
  return [...String(html).matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: visibleText(m[2]).slice(0, 240),
  }));
}

function flattenJsonLd(value, out) {
  if (Array.isArray(value)) {
    for (const item of value) flattenJsonLd(item, out);
    return;
  }
  if (!value || typeof value !== "object") return;
  out.push(value);
  if (value["@graph"]) flattenJsonLd(value["@graph"], out);
}

export function jsonLdNodes(html) {
  const nodes = [];
  for (const m of String(html).matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      flattenJsonLd(JSON.parse(raw), nodes);
    } catch {
      // A few themes print several top-level objects separated by commas or
      // comments. Try each object line-by-line before giving up.
      for (const line of raw.split(/\r?\n/)) {
        const part = line.trim().replace(/,$/, "");
        if (!part.startsWith("{")) continue;
        try { flattenJsonLd(JSON.parse(part), nodes); } catch { /* ignore */ }
      }
    }
  }
  return nodes.filter((node) => node && node["@type"]);
}

function typesOf(node) {
  const raw = node?.["@type"];
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw]).map((t) => String(t).replace(/^.*schema\.org\//, "").replace(/\/$/, ""));
}

function findType(nodes, types) {
  const wanted = new Set(Array.isArray(types) ? types : [types]);
  return nodes.find((n) => typesOf(n).some((t) => wanted.has(t))) || null;
}

function microdataTypes(html) {
  const out = new Set();
  for (const m of String(html).matchAll(/\bitemtype\s*=\s*["']([^"']+)["']/gi)) {
    for (const raw of m[1].split(/\s+/)) {
      const t = raw.replace(/^.*schema\.org\//, "").replace(/\/$/, "").trim();
      if (t) out.add(t);
    }
  }
  return [...out];
}

export function parseSitemap(xml) {
  const text = String(xml || "");
  const urls = [...text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((m) => decodeEntities(m[1]).trim())
    .filter(Boolean);
  return { urls, isIndex: /<sitemapindex\b/i.test(text) };
}

export function robotsSitemaps(txt) {
  return [...String(txt || "").matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map((m) => m[1]);
}

function normalizeInput(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!/^https?:$/.test(url.protocol)) return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function isPrivateIp(ip) {
  const version = isIP(ip);
  if (version === 4) {
    const p = ip.split(".").map(Number);
    return p[0] === 0 || p[0] === 10 || p[0] === 127 || (p[0] === 169 && p[1] === 254) ||
      (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) ||
      (p[0] === 100 && p[1] >= 64 && p[1] <= 127) || p[0] >= 224;
  }
  if (version === 6) {
    const low = ip.toLowerCase();
    return low === "::1" || low === "::" || low.startsWith("fc") || low.startsWith("fd") || low.startsWith("fe80:");
  }
  return false;
}

async function assertPublicHost(host) {
  if (/^(?:localhost|.*\.local|.*\.internal|.*\.lan|.*\.home|.*\.test)$/i.test(host)) {
    throw new Error(`${host} özel bir adres; yalnızca herkese açık siteler test edilebilir.`);
  }
  if (isIP(host) && isPrivateIp(host)) throw new Error(`${host} özel bir IP adresi; test edilemez.`);
  if (isIP(host)) return;
  const found = await lookup(host, { all: true }).catch(() => []);
  if (found.some((x) => isPrivateIp(x.address))) {
    throw new Error(`${host} özel bir ağa çözümleniyor; test edilemez.`);
  }
}

async function readCapped(res, maxBytes) {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (total < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      total += value.byteLength;
    }
  } finally {
    reader.cancel().catch(() => {});
  }
  const merged = new Uint8Array(Math.min(total, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    if (offset >= merged.length) break;
    const take = Math.min(chunk.byteLength, merged.length - offset);
    merged.set(chunk.subarray(0, take), offset);
    offset += take;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}

export async function fetchUrl(input, options = {}) {
  const opts = {
    timeout: DEFAULT_TIMEOUT,
    maxBytes: DEFAULT_MAX_BYTES,
    userAgent: DEFAULT_UA,
    allowPrivate: false,
    ...options,
  };
  const url = input instanceof URL ? input : normalizeInput(input);
  if (!url) throw new Error("Geçerli bir http(s) adresi girin.");
  if (!opts.allowPrivate) await assertPublicHost(url.hostname);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": opts.userAgent, accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5" },
      signal: AbortSignal.timeout(opts.timeout),
    });
    const ttfb = Date.now() - started;
    const body = await readCapped(res, opts.maxBytes);
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url || url.href,
      headers: res.headers,
      contentType: (res.headers.get("content-type") || "").toLowerCase(),
      body,
      bytes: body.length,
      ttfb,
      ms: Date.now() - started,
      error: null,
    };
  } catch (error) {
    const ms = Date.now() - started;
    return {
      ok: false,
      status: 0,
      finalUrl: url.href,
      headers: new Headers(),
      contentType: "",
      body: "",
      bytes: 0,
      ttfb: ms,
      ms,
      error: error?.name === "TimeoutError" ? "zaman aşımı" : error?.message || "bağlantı hatası",
    };
  }
}

const LOCAL_TYPES = new Set([
  "LocalBusiness", "Dentist", "MedicalClinic", "MedicalBusiness", "MedicalOrganization",
  "ProfessionalService", "Restaurant", "Store", "HealthAndBeautyBusiness", "BeautySalon",
  "HairSalon", "AutoRepair", "LegalService", "Attorney", "RealEstateAgent",
  "HomeAndConstructionBusiness", "FoodEstablishment", "LodgingBusiness", "Hotel",
  "Organization", "Corporation", "NGO", "EducationalOrganization",
]);

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function nameOf(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(nameOf).filter(Boolean).join(", ");
  return String(value.name || value["@id"] || "");
}

function sameAsOf(nodes) {
  const out = new Set();
  for (const node of nodes) {
    for (const link of asArray(node.sameAs)) {
      if (typeof link === "string" && /^https?:\/\//i.test(link)) out.add(link.replace(/\/$/, ""));
    }
  }
  return [...out];
}

function linksIn(html) {
  const out = [];
  for (const m of String(html).matchAll(/<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    const href = decodeEntities(m[1] ?? m[2] ?? m[3] ?? "").trim();
    if (href && !href.startsWith("#") && !/^(?:mailto|tel|javascript|data):/i.test(href)) out.push(href);
  }
  return out;
}

function imageStats(html) {
  const images = [...String(html).matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  return {
    total: images.length,
    withoutAlt: images.filter((tag) => !/\balt\s*=/i.test(tag)).length,
  };
}

function countTag(html, tag) {
  return (String(html).match(new RegExp(`<${tag}\\b`, "gi")) || []).length;
}

function normalizeBrand(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9çğıöşü]+/gi, " ").trim();
}

export function analyzePage(res, options = {}) {
  const url = res.finalUrl || options.url || "";
  const html = res.body || "";
  const meta = metaMap(html);
  const nodes = jsonLdNodes(html);
  const mdTypes = microdataTypes(html);
  const hs = headings(html);
  const text = visibleText(html);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const title = decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "").trim();
  const description = (meta.description || "").trim();
  const canonicalTag = links(html).find((l) => l.rel.includes("canonical"));
  let canonical = canonicalTag?.href || "";
  try { canonical = canonical ? new URL(canonical, url).href : ""; } catch { canonical = ""; }
  const robotsMeta = (meta.robots || "").toLowerCase();
  const xRobots = (res.headers?.get("x-robots-tag") || "").toLowerCase();
  const noindex = /noindex/.test(robotsMeta) || /noindex/.test(xRobots);
  const viewport = meta.viewport || "";
  const htmlTag = (html.match(/<html\b[^>]*>/i) || [""])[0];
  const lang = attr(htmlTag, "lang");
  const path = (() => { try { return new URL(url).pathname; } catch { return "/"; } })();
  const article = findType(nodes, ["Article", "BlogPosting", "NewsArticle", "TechArticle", "HowTo"]);
  const faq = findType(nodes, ["FAQPage"]);
  const breadcrumb = findType(nodes, ["BreadcrumbList"]);
  const organization = findType(nodes, [...LOCAL_TYPES]);
  const person = findType(nodes, ["Person"]);
  const website = findType(nodes, ["WebSite"]);
  const webpage = findType(nodes, ["WebPage", "AboutPage", "ContactPage", "CollectionPage", "ItemPage"]);
  const schemaTypes = [...new Set([...nodes.flatMap(typesOf), ...mdTypes])];
  const imageInfo = imageStats(html);
  const linkHrefs = linksIn(html);
  const host = (() => { try { return new URL(url).host; } catch { return ""; } })();
  const internal = [];
  const external = [];
  for (const href of linkHrefs) {
    try {
      const u = new URL(href, url);
      if (!/^https?:$/.test(u.protocol)) continue;
      (u.host === host ? internal : external).push(u.href);
    } catch { /* ignore */ }
  }
  const hasAuthor = Boolean(article?.author || person?.name) || /(?:^|\s)(?:Yazan|Yazar|Author|By)\s*[:：]/i.test(text);
  const hasDate = /<time\b[^>]*datetime\s*=/i.test(html) ||
    /\b\d{1,2}\s+(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+\d{4}\b/i.test(text) ||
    /\b20\d{2}-\d{2}-\d{2}\b/.test(text);
  const hasUpdated = Boolean(article?.dateModified) || /(?:Güncellendi|Güncelleme|Son güncelleme|Updated)/i.test(text);
  const hasFaq = Boolean(faq) || /(?:Sıkça sorulan|Sıkça Sorulan|SSS|FAQ|Soru\s*[:-])/i.test(text);
  const priceMatches = text.match(/(?:₺|TL|TRY|€|\$)\s?\d|\d\s?(?:₺|TL|TRY|€|\$)/gi) || [];
  const numberMatches = text.match(/\b\d{2,}\b/g) || [];
  const hasPrices = priceMatches.length > 0;
  const hasNumbers = hasPrices || numberMatches.length >= 3;
  const headingLevels = hs.map((h) => h.level);
  const h1 = hs.filter((h) => h.level === 1).length;
  const h2 = hs.filter((h) => h.level === 2).length;
  const h3 = hs.filter((h) => h.level === 3).length;
  const skipped = hs.some((h, i) => i > 0 && h.level > hs[i - 1].level + 1);
  const hierarchyOk = !skipped && (h2 >= 1 || words < 300);
  const isContent = (CONTENT_PATH.test(path) && path.split("/").filter(Boolean).length >= 2) || Boolean(article);
  const isHome = path === "/" || path === "";
  const isAbout = ABOUT_PATH.test(path);
  const isContact = CONTACT_PATH.test(path);
  const canonicalSelf = Boolean(canonical) && canonical.replace(/\/$/, "") === url.replace(/\/$/, "");
  const titleOk = title.length >= 10 && title.length <= 65;
  const descriptionOk = description.length >= 70 && description.length <= 160;
  return {
    url,
    path,
    status: res.status,
    ok: res.ok,
    finalUrl: res.finalUrl || url,
    ttfb: res.ttfb,
    ms: res.ms,
    bytes: res.bytes,
    contentType: res.contentType,
    error: res.error,
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    robotsMeta,
    noindex,
    canonical,
    canonicalSelf,
    viewport,
    lang,
    headings: hs,
    headingLevels,
    h1,
    h2,
    h3,
    skippedHeading: skipped,
    hierarchyOk,
    words,
    paragraphs: countTag(html, "p"),
    lists: countTag(html, "ul") + countTag(html, "ol"),
    tables: countTag(html, "table"),
    text,
    schemaTypes,
    jsonLdTypes: [...new Set(nodes.flatMap(typesOf))],
    microdataTypes: mdTypes,
    hasOrganization: Boolean(organization),
    organization,
    person,
    website,
    webpage,
    article,
    faq,
    breadcrumb,
    sameAs: sameAsOf(nodes),
    author: nameOf(article?.author || person),
    hasAuthor,
    hasDate,
    hasUpdated,
    hasFaq,
    hasPrices,
    hasNumbers,
    priceMatches: priceMatches.slice(0, 6),
    internalLinks: [...new Set(internal)],
    externalLinks: [...new Set(external)],
    images: imageInfo.total,
    imagesWithoutAlt: imageInfo.withoutAlt,
    hasTel: /href\s*=\s*["']tel:/i.test(html),
    hasWhatsApp: /wa\.me|api\.whatsapp\.com/i.test(html),
    hasForm: /<form\b/i.test(html),
    isHome,
    isContent,
    isAbout,
    isContact,
    titleOk,
    descriptionOk,
  };
}

async function mapLimit(items, limit, fn) {
  const out = Array.from({ length: items.length });
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function rankUrl(url, origin) {
  try {
    const u = new URL(url);
    if (u.origin !== origin) return -1;
    if (ASSET_EXT.test(u.pathname) || SKIP_PATH.test(u.pathname)) return -1;
    if (u.search) return -1;
    if (u.pathname === "/" || u.pathname === "") return 1000;
    let score = 0;
    const p = u.pathname.toLowerCase();
    for (const hint of PAGE_HINTS) if (p.includes(hint)) score += 20;
    if (ABOUT_PATH.test(p)) score += 30;
    if (CONTACT_PATH.test(p)) score += 25;
    if (CONTENT_PATH.test(p)) score += 10;
    score -= Math.min(20, u.pathname.split("/").filter(Boolean).length * 2);
    return score;
  } catch {
    return -1;
  }
}

function selectPages(home, sitemapUrls, maxPages, origin) {
  const candidates = new Set([home.finalUrl || home.url]);
  for (const u of sitemapUrls) candidates.add(u);
  for (const href of linksIn(home.body || "")) {
    try {
      const u = new URL(href, home.finalUrl || home.url);
      if (u.origin === origin && !u.hash) candidates.add(u.href);
    } catch { /* ignore */ }
  }
  const ranked = [...candidates]
    .map((u) => ({ url: u, score: rankUrl(u, origin) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || a.url.length - b.url.length);
  const out = [];
  const seen = new Set();
  for (const { url } of ranked) {
    const key = url.replace(/\/$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(url);
    if (out.length >= maxPages) break;
  }
  return out;
}

async function fetchSitemap(url, opts) {
  const res = await fetchUrl(url, opts);
  if (!res.ok) return { res, urls: [], isIndex: false };
  const parsed = parseSitemap(res.body);
  return { res, ...parsed };
}

export async function collectSite(root, home, options = {}) {
  const opts = { ...options, maxPages: Math.min(options.maxPages || DEFAULT_MAX_PAGES, MAX_PAGES) };
  const base = new URL(home.finalUrl || root.href);
  const origin = base.origin;
  const rootUrl = `${origin}/`;
  const [robots, llms, aiTxt, aiTxtAlt, feedXml, rss, atom, blogFeed] = await Promise.all([
    fetchUrl(`${origin}/robots.txt`, opts),
    fetchUrl(`${origin}/llms.txt`, opts),
    fetchUrl(`${origin}/.well-known/ai.txt`, opts),
    fetchUrl(`${origin}/ai.txt`, opts),
    fetchUrl(`${origin}/feed.xml`, opts),
    fetchUrl(`${origin}/rss.xml`, opts),
    fetchUrl(`${origin}/atom.xml`, opts),
    fetchUrl(`${origin}/blog/feed.xml`, opts),
  ]);
  const feed = [feedXml, rss, atom, blogFeed].find((res) => feedOk(res)) || feedXml;
  const sitemapCandidates = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/sitemap-index.xml`];
  for (const s of robotsSitemaps(robots.body)) {
    try { if (new URL(s).origin === origin) sitemapCandidates.unshift(s); } catch { /* ignore */ }
  }
  let sitemap = null;
  let sitemapUrls = [];
  let isIndex = false;
  for (const candidate of new Set(sitemapCandidates)) {
    const parsed = await fetchSitemap(candidate, opts);
    if (!parsed.res.ok) continue;
    sitemap = parsed.res;
    sitemapUrls = parsed.urls;
    isIndex = parsed.isIndex;
    if (isIndex) {
      const children = sitemapUrls.filter((u) => {
        try { return new URL(u).origin === origin; } catch { return false; }
      }).slice(0, 3);
      const childResults = await Promise.all(children.map((u) => fetchSitemap(u, opts)));
      sitemapUrls = childResults.flatMap((r) => r.urls);
    }
    break;
  }
  const urls = selectPages(home, sitemapUrls, opts.maxPages, origin);
  const pageResults = await mapLimit(urls, CONCURRENCY, async (url) => {
    if (url === (home.finalUrl || home.url) || url.replace(/\/$/, "") === rootUrl.replace(/\/$/, "")) {
      return { res: home, url };
    }
    const res = await fetchUrl(url, opts);
    return { res, url };
  });
  const pages = pageResults
    .filter(({ res }) => res.ok && (!res.contentType || /html|xhtml/.test(res.contentType)))
    .map(({ res, url }) => analyzePage(res, { url }));
  return { origin, rootUrl, robots, llms, aiTxt, aiTxtAlt, feed, sitemap, sitemapUrls, isIndex, urls, pages };
}

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

function check(cat, id, label, max, status, points, detail, fix, severity = "medium") {
  const safe = status === "pass" ? max : status === "fail" || status === "unknown" ? 0 : Math.max(0, Math.min(max, points));
  return { cat, id, label, max, weight: max, points: safe, status, detail, fix, severity };
}

const pass = (cat, id, label, max, detail, fix, severity) => check(cat, id, label, max, "pass", max, detail, fix, severity);
const fail = (cat, id, label, max, detail, fix, severity) => check(cat, id, label, max, "fail", 0, detail, fix, severity);
const warn = (cat, id, label, max, points, detail, fix, severity) => check(cat, id, label, max, "warn", points, detail, fix, severity);
const unknown = (cat, id, label, max, detail, fix, severity) => check(cat, id, label, max, "unknown", 0, detail, fix, severity);

function gradeOf(score) {
  return score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : score >= 50 ? "E" : "F";
}

function pct(n, d) {
  return d ? Math.round((n / d) * 100) : 0;
}

function aboutLinked(home) {
  if (!home) return false;
  return home.internalLinks.some((href) => {
    try { return ABOUT_PATH.test(new URL(href).pathname); } catch { return false; }
  });
}

function contactLinked(home) {
  if (!home) return false;
  return home.internalLinks.some((href) => {
    try { return CONTACT_PATH.test(new URL(href).pathname); } catch { return false; }
  });
}

function llmsOk(res) {
  if (!res?.ok) return false;
  const body = res.body || "";
  return body.length > 100 && /^#\s+/m.test(body) && !/<html|<!doctype/i.test(body.slice(0, 300));
}

function feedOk(res) {
  return Boolean(res?.ok && /<rss\b|<feed\b|<rdf:RDF\b/i.test(res.body || ""));
}

export function evaluate({ home, site, httpRes }) {
  const pages = site.pages;
  const homePage = pages.find((p) => p.isHome) || pages[0] || null;
  const contentPages = pages.filter((p) => p.isContent);
  const orgs = pages.map((p) => p.organization).filter(Boolean);
  const org = orgs[0] || null;
  const orgPages = pages.filter((p) => p.hasOrganization).length;
  const websitePages = pages.filter((p) => p.website).length;
  const webpagePages = pages.filter((p) => p.webpage).length;
  const articlePages = pages.filter((p) => p.article).length;
  const faqPages = pages.filter((p) => p.faq).length;
  const breadcrumbPages = pages.filter((p) => p.breadcrumb).length;
  const offerPages = pages.filter((p) => p.schemaTypes.some((t) => ["Product", "Service", "Offer", "OfferCatalog", "ItemList"].includes(t))).length;
  const sameAs = [...new Set(pages.flatMap((p) => p.sameAs))];
  const profiles = sameAs.filter((u) => /(?:linkedin\.com|github\.com|x\.com|twitter\.com|instagram\.com|facebook\.com|youtube\.com|crunchbase\.com|wikipedia\.org|wikidata\.org)/i.test(u));
  const hasLinkedIn = sameAs.some((u) => /linkedin\.com/i.test(u));
  const hasKg = sameAs.some((u) => /(?:wikipedia|wikidata|crunchbase)\./i.test(u));
  const avgWords = pages.length ? Math.round(pages.reduce((s, p) => s + p.words, 0) / pages.length) : 0;
  const h1Ok = pct(pages.filter((p) => p.h1 === 1).length, pages.length);
  const hierarchyOk = pct(pages.filter((p) => p.hierarchyOk).length, pages.length);
  const titleOk = pct(pages.filter((p) => p.titleOk).length, pages.length);
  const descriptionOk = pct(pages.filter((p) => p.descriptionOk).length, pages.length);
  const canonicalOk = pct(pages.filter((p) => p.canonicalSelf).length, pages.length);
  const viewportOk = pct(pages.filter((p) => /width\s*=\s*device-width/i.test(p.viewport)).length, pages.length);
  const linksOk = pct(pages.filter((p) => p.internalLinks.length >= 3).length, pages.length);
  const authorPages = contentPages.filter((p) => p.hasAuthor).length;
  const datePages = contentPages.filter((p) => p.hasDate || p.hasUpdated).length;
  const faqContentPages = pages.filter((p) => p.hasFaq).length;
  const evidencePages = pages.filter((p) => p.hasNumbers || p.hasPrices).length;
  const noindexPages = pages.filter((p) => p.noindex).length;
  const uniqueTitles = new Set(pages.map((p) => p.title).filter(Boolean)).size;
  const uniqueDescriptions = new Set(pages.map((p) => p.description).filter(Boolean)).size;
  const robotsTxt = site.robots?.body || "";
  const robotsMissing = site.robots?.status === 404 || site.robots?.status === 410;
  const robotsUnreadable = !site.robots?.ok && !robotsMissing;
  const sitemapCount = site.sitemapUrls?.length || 0;
  const sitemapOk = Boolean(site.sitemap?.ok) && sitemapCount > 0;
  const brandName = org?.name ? normalizeBrand(org.name) : "";
  const homeTitle = normalizeBrand(homePage?.title || "");
  const brandConsistent = Boolean(brandName) && (homeTitle.includes(brandName) || brandName.includes(homeTitle.split(" ").slice(0, 2).join(" ")));

  const checks = [];
  // ---- Structured Data (25) ----
  checks.push(orgPages > 0
    ? pass("schema", "organization", "Organization şeması", 6, `${orgPages}/${pages.length} sayfada Organization bulundu.`, "Organization şemasını site şablonuna ekleyin.")
    : fail("schema", "organization", "Organization şeması", 6, "Hiçbir sayfada Organization JSON-LD yok.", "Ad, URL, logo, iletişim ve sosyal profilleri içeren Organization JSON-LD ekleyin.", "critical"));
  const orgCore = Boolean(org?.name && org?.url && (org?.logo || org?.image));
  checks.push(orgCore
    ? pass("schema", "organization-core", "Organization kimlik alanları", 4, "Organization name, url ve logo alanlarını taşıyor.", "Alanları güncel tutun.")
    : fail("schema", "organization-core", "Organization kimlik alanları", 4, org ? `Eksik alanlar: ${[!org.name && "name", !org.url && "url", !(org.logo || org.image) && "logo"].filter(Boolean).join(", ")}.` : "Organization bulunamadı.", "Organization içine name, url ve logo ekleyin.", "high"));
  checks.push(sameAs.length >= 2
    ? pass("schema", "sameas", "sameAs profilleri", 3, `${sameAs.length} profil bağlı.`, "Profilleri güncel tutun.")
    : sameAs.length === 1
      ? warn("schema", "sameas", "sameAs profilleri", 3, 1, "Yalnızca 1 profil bağlı.", "En az 2 sahip olunan profil (LinkedIn, GitHub, Wikidata) ekleyin.", "high")
      : fail("schema", "sameas", "sameAs profilleri", 3, "sameAs bağlantısı yok.", "Organization veya Person şemasına sameAs ekleyin.", "high"));
  const orgContact = Boolean(org?.contactPoint || org?.telephone || org?.email);
  checks.push(orgContact
    ? pass("schema", "organization-contact", "Organization iletişim bilgisi", 2, "contactPoint, telephone veya email var.", "Bilgileri güncel tutun.")
    : fail("schema", "organization-contact", "Organization iletişim bilgisi", 2, "Organization içinde iletişim alanı yok.", "contactPoint veya telephone/email ekleyin.", "high"));
  checks.push(websitePages > 0
    ? pass("schema", "website", "WebSite şeması", 2, `${websitePages} sayfada WebSite var.`, "WebSite şemasını koruyun.")
    : fail("schema", "website", "WebSite şeması", 2, "WebSite JSON-LD yok.", "Site adı ve URL'siyle WebSite şeması ekleyin.", "medium"));
  checks.push(webpagePages === pages.length
    ? pass("schema", "webpage", "WebPage şeması", 2, "Tüm sayfalarda WebPage var.", "WebPage şemasını koruyun.")
    : webpagePages > 0
      ? warn("schema", "webpage", "WebPage şeması", 2, 1, `${webpagePages}/${pages.length} sayfada WebPage var.`, "Her sayfaya WebPage şeması ekleyin.", "medium")
      : fail("schema", "webpage", "WebPage şeması", 2, "WebPage JSON-LD yok.", "Her sayfaya WebPage şeması ekleyin.", "medium"));
  const articleApplicable = contentPages.length > 0;
  checks.push(!articleApplicable
    ? pass("schema", "article", "Article / BlogPosting şeması", 2, "İçerik sayfası bulunmadığı için uygulanmıyor.", "Blog veya rehber eklediğinizde Article şeması ekleyin.")
    : articlePages > 0
      ? pass("schema", "article", "Article / BlogPosting şeması", 2, `${articlePages}/${contentPages.length} içerik sayfasında Article var.`, "Yazar ve tarih alanlarını da ekleyin.")
      : fail("schema", "article", "Article / BlogPosting şeması", 2, "İçerik sayfalarında Article/BlogPosting yok.", "Her yazıya Article veya BlogPosting JSON-LD ekleyin.", "high"));
  checks.push(faqPages > 0
    ? pass("schema", "faq", "FAQPage şeması", 2, `${faqPages} sayfada FAQPage var.`, "Soruları görünür metinle birlikte tutun.")
    : fail("schema", "faq", "FAQPage şeması", 2, "FAQPage şeması yok.", "SSS bölümü olan sayfalara FAQPage JSON-LD ekleyin.", "medium"));
  checks.push(breadcrumbPages > 0
    ? pass("schema", "breadcrumb", "BreadcrumbList şeması", 1, `${breadcrumbPages} sayfada BreadcrumbList var.`, "İç sayfalarda breadcrumb'ı koruyun.")
    : fail("schema", "breadcrumb", "BreadcrumbList şeması", 1, "BreadcrumbList yok.", "İç sayfalara BreadcrumbList JSON-LD ekleyin.", "low"));
  checks.push(offerPages > 0
    ? pass("schema", "offer", "Hizmet / ürün şeması", 1, `${offerPages} sayfada Service, Product, Offer veya ItemList var.`, "Fiyat ve kapsam alanlarını ekleyin.")
    : fail("schema", "offer", "Hizmet / ürün şeması", 1, "Hizmet veya ürün şeması yok.", "Hizmetleriniz için Service, ürünler için Product/Offer JSON-LD ekleyin.", "medium"));

  // ---- Content Quality (25) ----
  checks.push(avgWords >= 300
    ? pass("content", "words", "Yeterli metin", 5, `Sayfa başına ortalama ${avgWords} kelime.`, "İçerik derinliğini koruyun.")
    : avgWords >= 150
      ? warn("content", "words", "Yeterli metin", 5, 2, `Sayfa başına ortalama ${avgWords} kelime; 300+ hedefleyin.`, "Her sayfaya 300-600 kelime özgün açıklama ekleyin.", "high")
      : fail("content", "words", "Yeterli metin", 5, `Sayfa başına ortalama ${avgWords} kelime; içerik çok ince.`, "Her sayfaya 300-600 kelime özgün açıklama ekleyin.", "high"));
  checks.push(h1Ok === 100
    ? pass("content", "h1", "Tek H1", 4, "Tüm sayfalarda tek H1 var.", "Başlık yapısını koruyun.")
    : h1Ok >= 80
      ? warn("content", "h1", "Tek H1", 4, 2, `Sayfaların %${h1Ok}'inde tek H1 var.`, "Her sayfada yalnızca bir H1 kullanın.", "high")
      : fail("content", "h1", "Tek H1", 4, `Sayfaların yalnızca %${h1Ok}'inde tek H1 var.`, "Her sayfada yalnızca bir H1 kullanın.", "high"));
  checks.push(hierarchyOk === 100
    ? pass("content", "hierarchy", "Başlık hiyerarşisi", 3, "H2/H3 sırası tutarlı.", "Başlık yapısını koruyun.")
    : hierarchyOk >= 80
      ? warn("content", "hierarchy", "Başlık hiyerarşisi", 3, 1, `Sayfaların %${hierarchyOk}'inde hiyerarşi düzgün.`, "H1 → H2 → H3 sırasını atlamayın.", "medium")
      : fail("content", "hierarchy", "Başlık hiyerarşisi", 3, `Sayfaların yalnızca %${hierarchyOk}'inde hiyerarşi düzgün.`, "H1 → H2 → H3 sırasını atlamayın.", "medium"));
  checks.push(titleOk === 100
    ? pass("content", "title", "Sayfa başlığı", 2, "Tüm başlıklar 10-65 karakter arasında.", "Başlıkları koruyun.")
    : titleOk >= 80
      ? warn("content", "title", "Sayfa başlığı", 2, 1, `Başlıkların %${titleOk}'i ideal uzunlukta.`, "Başlıkları 10-65 karakterde tutun.", "medium")
      : fail("content", "title", "Sayfa başlığı", 2, `Başlıkların yalnızca %${titleOk}'i ideal uzunlukta.`, "Her sayfaya 10-65 karakterlik benzersiz bir title yazın.", "high"));
  checks.push(descriptionOk === 100
    ? pass("content", "description", "Meta açıklama", 2, "Tüm açıklamalar 70-160 karakter arasında.", "Açıklamaları koruyun.")
    : descriptionOk >= 80
      ? warn("content", "description", "Meta açıklama", 2, 1, `Açıklamaların %${descriptionOk}'i ideal uzunlukta.`, "Açıklamaları 70-160 karakterde tutun.", "medium")
      : fail("content", "description", "Meta açıklama", 2, `Açıklamaların yalnızca %${descriptionOk}'i ideal uzunlukta.`, "Her sayfaya 70-160 karakterlik benzersiz bir meta description yazın.", "high"));
  checks.push(!contentPages.length
    ? pass("content", "author", "Görünür yazar", 2, "İçerik sayfası bulunmadığı için uygulanmıyor.", "Blog eklediğinizde yazar adı gösterin.")
    : authorPages === contentPages.length
      ? pass("content", "author", "Görünür yazar", 2, "Tüm içerik sayfalarında yazar var.", "Yazar bilgisini koruyun.")
      : authorPages > 0
        ? warn("content", "author", "Görünür yazar", 2, 1, `${authorPages}/${contentPages.length} içerik sayfasında yazar var.`, "Her yazıya görünür yazar adı ve Person bağlantısı ekleyin.", "high")
        : fail("content", "author", "Görünür yazar", 2, "İçerik sayfalarında yazar adı yok.", "Her yazıya görünür yazar adı ve Person bağlantısı ekleyin.", "high"));
  checks.push(!contentPages.length
    ? pass("content", "date", "Görünür tarih", 2, "İçerik sayfası bulunmadığı için uygulanmıyor.", "Blog eklediğinizde yayın/güncelleme tarihi gösterin.")
    : datePages === contentPages.length
      ? pass("content", "date", "Görünür tarih", 2, "Tüm içerik sayfalarında tarih var.", "Tarihleri koruyun.")
      : datePages > 0
        ? warn("content", "date", "Görünür tarih", 2, 1, `${datePages}/${contentPages.length} içerik sayfasında tarih var.`, "Her yazıya görünür yayın ve güncelleme tarihi ekleyin.", "medium")
        : fail("content", "date", "Görünür tarih", 2, "İçerik sayfalarında tarih yok.", "Her yazıya görünür yayın ve güncelleme tarihi ekleyin.", "medium"));
  checks.push(faqContentPages > 0
    ? pass("content", "faq-content", "SSS / soru-cevap", 2, `${faqContentPages} sayfada SSS veya soru başlığı var.`, "Soruları güncel tutun.")
    : fail("content", "faq-content", "SSS / soru-cevap", 2, "SSS veya soru-cevap bölümü yok.", "Her hizmet sayfasına 3-5 soruluk SSS ekleyin.", "medium"));
  checks.push(evidencePages > 0
    ? pass("content", "evidence", "Somut veri / fiyat", 2, `${evidencePages} sayfada sayı, fiyat veya ölçülebilir örnek var.`, "Rakamları kaynaklandırın.")
    : fail("content", "evidence", "Somut veri / fiyat", 2, "Sayfalarda somut sayı, fiyat veya örnek yok.", "Fiyat aralığı, süre veya ölçülebilir sonuç ekleyin.", "medium"));
  checks.push(linksOk === 100
    ? pass("content", "links", "İç bağlantılar", 1, "Her sayfada en az 3 iç bağlantı var.", "Bağlantıları koruyun.")
    : fail("content", "links", "İç bağlantılar", 1, `Sayfaların %${linksOk}'inde en az 3 iç bağlantı var.`, "Her sayfaya ilgili hizmet ve içerik bağlantıları ekleyin.", "low"));


  // ---- Technical SEO (20) ----
  const httpsOk = Boolean(home?.ok) && String(home.finalUrl || "").startsWith("https://");
  checks.push(httpsOk
    ? pass("technical", "https", "HTTPS", 3, "Site HTTPS üzerinden açılıyor.", "Sertifikayı yenilemeyi unutmayın.")
    : fail("technical", "https", "HTTPS", 3, home?.ok ? "Site HTTPS'e yönlenmiyor." : `Site açılmadı: ${home?.error || `HTTP ${home?.status}`}.`, "Geçerli bir TLS sertifikası kurun ve HTTP'yi HTTPS'e yönlendirin.", "critical"));
  const httpFinal = String(httpRes?.finalUrl || "");
  const httpRedirectOk = !httpRes?.ok || httpFinal.startsWith("https://") || [301, 302, 307, 308].includes(httpRes.status);
  checks.push(httpRedirectOk
    ? pass("technical", "http-redirect", "HTTP → HTTPS", 2, httpRes?.ok && httpFinal.startsWith("https://") ? "HTTP, HTTPS'e yönleniyor." : "HTTP ya kapalı ya da HTTPS'e yönleniyor.", "Kalıcı 301 yönlendirmesi kullanın.")
    : fail("technical", "http-redirect", "HTTP → HTTPS", 2, "HTTP adresi HTTPS'e yönlenmiyor.", "Sunucuda kalıcı (301) HTTP → HTTPS yönlendirmesi açın.", "high"));
  checks.push(noindexPages === 0
    ? pass("technical", "indexable", "Dizine açık", 3, "Hiçbir sayfada noindex yok.", "noindex'i yalnızca özel sayfalarda kullanın.")
    : fail("technical", "indexable", "Dizine açık", 3, `${noindexPages}/${pages.length} sayfada noindex var.`, "Herkese açık sayfalardan noindex'i kaldırın.", "critical"));
  checks.push(canonicalOk === 100
    ? pass("technical", "canonical", "Canonical", 2, "Tüm sayfalarda kendine canonical var.", "Canonical'ı koruyun.")
    : canonicalOk >= 80
      ? warn("technical", "canonical", "Canonical", 2, 1, `Sayfaların %${canonicalOk}'inde kendine canonical var.`, "Her sayfaya kendi URL'sini gösteren canonical ekleyin.", "medium")
      : fail("technical", "canonical", "Canonical", 2, `Sayfaların yalnızca %${canonicalOk}'inde kendine canonical var.`, "Her sayfaya kendi URL'sini gösteren canonical ekleyin.", "high"));
  checks.push(viewportOk === 100
    ? pass("technical", "viewport", "Mobil viewport", 2, "Tüm sayfalarda width=device-width var.", "Viewport'u koruyun.")
    : fail("technical", "viewport", "Mobil viewport", 2, `Sayfaların %${viewportOk}'inde width=device-width var.`, 'Her sayfaya <meta name="viewport" content="width=device-width, initial-scale=1"> ekleyin.', "high"));
  checks.push(sitemapOk
    ? pass("technical", "sitemap", "Site haritası", 3, `sitemap.xml bulundu (${sitemapCount} URL${site.isIndex ? ", index" : ""}).`, "Yeni sayfaları sitemap'e ekleyin.")
    : fail("technical", "sitemap", "Site haritası", 3, "Geçerli sitemap.xml bulunamadı.", "sitemap.xml oluşturup robots.txt'e ekleyin.", "critical"));
  checks.push(robotsSitemaps(robotsTxt).length > 0
    ? pass("technical", "sitemap-robots", "robots.txt → sitemap", 1, "robots.txt sitemap'i gösteriyor.", "Yolu koruyun.")
    : fail("technical", "sitemap-robots", "robots.txt → sitemap", 1, "robots.txt'te Sitemap satırı yok.", "robots.txt'e Sitemap: https://.../sitemap.xml ekleyin.", "medium"));
  const uniqueMetaOk = uniqueTitles === pages.length && uniqueDescriptions === pages.length;
  const uniqueMetaPartial = uniqueTitles === pages.length || uniqueDescriptions === pages.length;
  checks.push(uniqueMetaOk
    ? pass("technical", "unique-meta", "Benzersiz başlık/açıklama", 2, "Tüm sayfaların title ve description'ı benzersiz.", "Benzersizliği koruyun.")
    : uniqueMetaPartial
      ? warn("technical", "unique-meta", "Benzersiz başlık/açıklama", 2, 1, "Title veya description'lardan biri tekrar ediyor.", "Her sayfaya benzersiz title ve description yazın.", "medium")
      : fail("technical", "unique-meta", "Benzersiz başlık/açıklama", 2, "Title ve description'lar tekrar ediyor.", "Her sayfaya benzersiz title ve description yazın.", "high"));
  checks.push(Number.isFinite(home?.ttfb) && home.ttfb < 1500
    ? pass("technical", "speed", "İlk yanıt süresi", 2, `İlk bayt ${(home.ttfb / 1000).toFixed(2)} sn.`, "CDN ve önbellek kullanın.")
    : home?.ttfb < 3000
      ? warn("technical", "speed", "İlk yanıt süresi", 2, 1, `İlk bayt ${(home?.ttfb / 1000).toFixed(2)} sn; 1.5 sn altı hedefleyin.`, "CDN ve önbellek kullanın.", "medium")
      : fail("technical", "speed", "İlk yanıt süresi", 2, `İlk bayt ${(home?.ttfb / 1000).toFixed(2)} sn; çok yavaş.`, "CDN, önbellek ve daha hızlı bir sunucu kullanın.", "medium"));

  // ---- AI Access (20) ----
  for (const [bot, label, points] of AI_BOTS) {
    if (robotsUnreadable) {
      checks.push(unknown("ai", `bot-${bot}`, `${bot} erişimi`, points, "robots.txt okunamadı.", "robots.txt'nin erişilebilir olduğunu kontrol edin.", "medium"));
      continue;
    }
    const allowed = robotsAllows(robotsTxt, bot);
    checks.push(allowed
      ? pass("ai", `bot-${bot}`, `${bot} erişimi`, points, robotsMissing ? "robots.txt yok; varsayılan olarak izinli." : "robots.txt izin veriyor.", "Engeli kaldırmayın.")
      : fail("ai", `bot-${bot}`, `${bot} erişimi`, points, `robots.txt ${bot} tarayıcısını engelliyor (${label}).`, `robots.txt'te ${bot} için "Allow: /" tanımlayın.`, ["GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot"].includes(bot) ? "critical" : "medium"));
  }
  checks.push(llmsOk(site.llms)
    ? pass("ai", "llms", "llms.txt", 3, `llms.txt bulundu (${site.llms.body.length} karakter).`, "Yeni sayfaları llms.txt'ye ekleyin.")
    : fail("ai", "llms", "llms.txt", 3, site.llms?.ok ? "llms.txt var ama başlık/bağlantı yapısı zayıf." : "llms.txt bulunamadı.", "Kök dizine H1, kısa özet ve ana sayfa bağlantıları içeren llms.txt ekleyin.", "high"));
  const aiTxtOk = (site.aiTxt?.ok && (site.aiTxt.body || "").length > 20) || (site.aiTxtAlt?.ok && (site.aiTxtAlt.body || "").length > 20);
  checks.push(aiTxtOk
    ? pass("ai", "ai-txt", "ai.txt", 2, "ai.txt bulundu.", "Politikayı güncel tutun.")
    : fail("ai", "ai-txt", "ai.txt", 2, "ai.txt bulunamadı.", "/.well-known/ai.txt ekleyip tarayıcı izinlerini yazın.", "medium"));
  checks.push(feedOk(site.feed)
    ? pass("ai", "feed", "RSS / Atom akışı", 1, "feed.xml bulundu.", "Yeni yazıları akışa ekleyin.")
    : fail("ai", "feed", "RSS / Atom akışı", 1, "RSS/Atom akışı bulunamadı.", "Blog için /feed.xml üretin ve <link rel=\"alternate\"> ile duyurun.", "low"));
  checks.push(homePage?.words >= 300
    ? pass("ai", "ssr", "JavaScript'siz okunabilir içerik", 2, `Ana sayfada ${homePage.words} kelime sunucudan geliyor.`, "İçeriği HTML'de tutun.")
    : homePage?.words >= 100
      ? warn("ai", "ssr", "JavaScript'siz okunabilir içerik", 2, 1, `Ana sayfada ${homePage?.words || 0} kelime var; içerik JavaScript'e bağımlı olabilir.`, "Ana metni SSR/statik HTML ile sunun.", "high")
      : fail("ai", "ssr", "JavaScript'siz okunabilir içerik", 2, `Ana sayfada yalnızca ${homePage?.words || 0} kelime var.`, "Ana metni SSR/statik HTML ile sunun.", "critical"));

  // ---- Brand & Entity (10) ----
  checks.push(hasLinkedIn
    ? pass("brand", "linkedin", "LinkedIn profili", 2, "Organization/Person sameAs içinde LinkedIn var.", "Profili güncel tutun.")
    : fail("brand", "linkedin", "LinkedIn profili", 2, "sameAs içinde LinkedIn yok.", "Organization veya Person şemasına LinkedIn profilini ekleyin.", "medium"));
  checks.push(profiles.length >= 2
    ? pass("brand", "profiles", "Sahip olunan profiller", 2, `${profiles.length} profil bağlı.`, "Profilleri güncel tutun.")
    : fail("brand", "profiles", "Sahip olunan profiller", 2, `Yalnızca ${profiles.length} profil bağlı.`, "En az 2 sahip olunan profil ekleyin (LinkedIn, GitHub, Wikidata).", "medium"));
  checks.push(hasKg
    ? pass("brand", "kg", "Bilgi grafiği kaydı", 2, "Wikipedia, Wikidata veya Crunchbase bağlantısı var.", "Kaydı güncel tutun.")
    : fail("brand", "kg", "Bilgi grafiği kaydı", 2, "Wikipedia, Wikidata veya Crunchbase bağlantısı yok.", "Varsa Wikidata/Crunchbase kaydı oluşturup sameAs'e ekleyin; yoksa uydurmayın.", "low"));
  const aboutPage = pages.some((p) => p.isAbout) || aboutLinked(homePage);
  checks.push(aboutPage
    ? pass("brand", "about", "Hakkında sayfası", 2, "Hakkında sayfası var ve bağlantılı.", "İçeriği güncel tutun.")
    : fail("brand", "about", "Hakkında sayfası", 2, "Hakkında sayfası bulunamadı.", "Kimin yazdığını anlatan bir /hakkimizda/ sayfası ekleyip menüye koyun.", "high"));
  const contactPage = pages.some((p) => p.isContact) || contactLinked(homePage) || Boolean(homePage?.hasTel || homePage?.hasForm || homePage?.hasWhatsApp);
  checks.push(contactPage
    ? pass("brand", "contact", "İletişim bilgisi", 1, "İletişim sayfası veya doğrudan iletişim bağlantısı var.", "Bilgileri güncel tutun.")
    : fail("brand", "contact", "İletişim bilgisi", 1, "İletişim sayfası veya tel/form bağlantısı yok.", "İletişim sayfası, tel: bağlantısı veya form ekleyin.", "medium"));
  checks.push(brandConsistent
    ? pass("brand", "brand", "Marka adı tutarlılığı", 1, "Organization adı sayfa başlığıyla uyumlu.", "Tutarlılığı koruyun.")
    : fail("brand", "brand", "Marka adı tutarlılığı", 1, "Organization adı ile sayfa başlığı eşleşmiyor.", "Organization name, title ve og:site_name aynı marka adını kullansın.", "low"));

  const categories = CATEGORIES.map(([id, label]) => {
    const cs = checks.filter((c) => c.cat === id);
    const max = cs.reduce((s, c) => s + c.weight, 0);
    const points = cs.reduce((s, c) => s + c.points, 0);
    return { id, label, points, max, score: max ? Math.round((points / max) * 100) : 0 };
  });
  const nominal = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + c.points, 0);
  const skipped = checks.filter((c) => c.status === "unknown").reduce((s, c) => s + c.weight, 0);
  const score = nominal ? Math.round((got / nominal) * 100) : 0;
  const coverage = nominal ? Math.round(((nominal - skipped) / nominal) * 100) : 0;
  const recommendations = checks
    .filter((c) => c.status !== "pass" && c.points < c.weight)
    .map((c) => ({
      severity: c.severity,
      category: CATEGORIES.find(([id]) => id === c.cat)?.[1] || c.cat,
      title: c.label,
      lost: c.weight - c.points,
      evidence: c.detail,
      fix: c.fix,
    }))
    .sort((a, b) => (SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]) || (b.lost - a.lost));
  return { score, grade: gradeOf(score), coverage, categories, checks, recommendations, stats: { pages: pages.length, avgWords, sameAs: sameAs.length, sitemapUrls: sitemapCount, uniqueTitles, uniqueDescriptions } };
}

export async function audit(input, options = {}) {
  const opts = {
    maxPages: DEFAULT_MAX_PAGES,
    timeout: DEFAULT_TIMEOUT,
    maxBytes: DEFAULT_MAX_BYTES,
    allowPrivate: false,
    userAgent: DEFAULT_UA,
    ...options,
  };
  const root = normalizeInput(input);
  if (!root) throw new Error("Geçerli bir http(s) adresi girin (örnek: https://example.com).");
  const home = await fetchUrl(root, opts);
  if (!home.ok) {
    const detail = home.error || `HTTP ${home.status}`;
    return {
      url: root.href,
      host: root.host,
      generatedAt: new Date().toISOString(),
      score: 0,
      grade: "F",
      coverage: 0,
      categories: CATEGORIES.map(([id, label]) => ({ id, label, points: 0, max: 0, score: 0 })),
      checks: [fail("technical", "reachable", "Site açılıyor", 100, `Site açılmadı: ${detail}`, "Alan adı, DNS ve sunucu ayarlarını kontrol edin.", "critical")],
      recommendations: [{ severity: "critical", category: "Technical SEO", title: "Site açılmıyor", lost: 100, evidence: detail, fix: "Alan adı, DNS ve sunucu ayarlarını kontrol edin." }],
      pages: [],
      site: {},
    };
  }
  const site = await collectSite(root, home, opts);
  const httpUrl = new URL(home.finalUrl || root.href);
  httpUrl.protocol = "http:";
  const httpRes = await fetchUrl(httpUrl, opts);
  const result = evaluate({ home, site, httpRes });
  const host = new URL(home.finalUrl || root.href).host;
  return {
    url: root.href,
    host,
    generatedAt: new Date().toISOString(),
    ...result,
    pages: site.pages.map((p) => ({
      url: p.url,
      status: p.status,
      title: p.title,
      words: p.words,
      h1: p.h1,
      noindex: p.noindex,
      schemaTypes: p.schemaTypes,
      hasAuthor: p.hasAuthor,
      hasDate: p.hasDate,
      hasUpdated: p.hasUpdated,
      hasFaq: p.hasFaq,
    })),
    site: {
      robots: { ok: Boolean(site.robots?.ok), status: site.robots?.status, sitemaps: robotsSitemaps(site.robots?.body || "") },
      llms: { ok: llmsOk(site.llms), status: site.llms?.status, bytes: site.llms?.body?.length || 0 },
      aiTxt: { ok: Boolean((site.aiTxt?.ok && site.aiTxt.body.length > 20) || (site.aiTxtAlt?.ok && site.aiTxtAlt.body.length > 20)), status: site.aiTxt?.status },
      feed: { ok: feedOk(site.feed), status: site.feed?.status },
      sitemap: { ok: Boolean(site.sitemap?.ok), status: site.sitemap?.status, urls: site.sitemapUrls?.length || 0, isIndex: Boolean(site.isIndex) },
      crawled: site.urls,
    },
  };
}


const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const STATUS_LABEL = { pass: "Geçti", warn: "Kısmi", fail: "Kaldı", unknown: "Ölçülemedi" };
const STATUS_CLASS = { pass: "ok", warn: "warn", fail: "bad", unknown: "skip" };
const SEVERITY_LABEL = { critical: "KRİTİK", high: "YÜKSEK", medium: "ORTA", low: "DÜŞÜK" };

function bar(value, max) {
  const width = max ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
  return `<span class="bar"><span style="width:${width}%"></span></span>`;
}

export function renderHtml(result) {
  const categories = result.categories.map((c) => `
    <div class="card cat">
      <div class="cat-head"><span>${esc(c.label)}</span><strong>${c.points}/${c.max}</strong></div>
      ${bar(c.points, c.max)}
      <div class="cat-score">${c.score}/100</div>
    </div>`).join("");

  const recommendations = result.recommendations.length
    ? result.recommendations.slice(0, 15).map((r) => `
      <li class="rec ${esc(r.severity)}">
        <div class="rec-head">
          <span class="sev">${esc(SEVERITY_LABEL[r.severity] || r.severity)}</span>
          <strong>${esc(r.title)}</strong>
          <span class="lost">-${r.lost} puan</span>
        </div>
        <p class="muted">${esc(r.category)} · ${esc(r.evidence)}</p>
        <p><span class="label">Düzeltme:</span> ${esc(r.fix)}</p>
      </li>`).join("")
    : `<li class="rec pass"><strong>Öneri yok.</strong><p class="muted">Tüm ölçülebilir kontroller geçti.</p></li>`;

  const checks = CATEGORIES.map(([id, label]) => {
    const rows = result.checks.filter((c) => c.cat === id).map((c) => `
      <tr class="${STATUS_CLASS[c.status]}">
        <td><span class="dot"></span>${esc(c.label)}</td>
        <td>${c.points}/${c.weight}</td>
        <td>${esc(STATUS_LABEL[c.status])}</td>
        <td>${esc(c.detail)}</td>
      </tr>`).join("");
    return `<section class="checks"><h3>${esc(label)}</h3><table><thead><tr><th>Kontrol</th><th>Puan</th><th>Durum</th><th>Kanıt</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  }).join("");

  const pages = (result.pages || []).length ? result.pages.map((p) => `
    <tr>
      <td><a href="${esc(p.url)}" rel="noopener">${esc(p.url.replace(/^https?:\/\//, ""))}</a></td>
      <td>${p.status}</td>
      <td>${p.words}</td>
      <td>${p.h1}</td>
      <td>${p.noindex ? "noindex" : "index"}</td>
      <td>${esc((p.schemaTypes || []).slice(0, 6).join(", ") || "—")}</td>
    </tr>`).join("") : `<tr><td colspan="6">Sayfa analiz edilemedi.</td></tr>`;

  const scoreClass = result.score >= 80 ? "good" : result.score >= 60 ? "mid" : "bad";
  const generated = result.generatedAt ? new Date(result.generatedAt) : new Date();
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GEO Audit — ${esc(result.host)}</title>
<style>
:root{--bg:#0b0c0e;--panel:#14161a;--line:#2a2d33;--bone:#f3eee4;--soft:#a9a49a;--amber:#e0b36a;--ok:#6fbf8b;--warn:#e0b36a;--bad:#e07a6a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--bone);font:16px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1080px;margin:0 auto;padding:48px 24px 80px}
header{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line);padding-bottom:28px;margin-bottom:32px}
h1{font:400 2.2rem/1.1 Georgia,"Times New Roman",serif;margin:0 0 8px}h1 em{color:var(--amber);font-style:italic}
h2{font:400 1.5rem/1.2 Georgia,serif;margin:40px 0 16px}h3{font:600 1rem/1.3 inherit;margin:0 0 10px}
p{margin:.4rem 0}.muted{color:var(--soft)}.label{color:var(--amber)}
.score{display:flex;align-items:center;gap:18px}.ring{width:112px;height:112px;border-radius:50%;display:grid;place-items:center;font:400 2.8rem/1 Georgia,serif;border:2px solid var(--amber)}
.ring.good{border-color:var(--ok);color:var(--ok)}.ring.mid{border-color:var(--warn);color:var(--warn)}.ring.bad{border-color:var(--bad);color:var(--bad)}
.grade{font-size:.85rem;color:var(--soft);letter-spacing:.14em;text-transform:uppercase}
.cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}
.cat-head{display:flex;justify-content:space-between;gap:8px;font-size:.92rem;margin-bottom:10px}
.bar{display:block;height:8px;border-radius:99px;background:#24272d;overflow:hidden}.bar>span{display:block;height:100%;background:var(--amber)}
.cat-score{margin-top:8px;color:var(--soft);font-size:.85rem}
ul.recs{list-style:none;padding:0;margin:0;display:grid;gap:12px}
.rec{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--soft);border-radius:12px;padding:14px 16px}
.rec.critical{border-left-color:var(--bad)}.rec.high{border-left-color:#e09a6a}.rec.medium{border-left-color:var(--amber)}.rec.low{border-left-color:var(--ok)}.rec.pass{border-left-color:var(--ok)}
.rec-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px;margin-bottom:4px}
.sev{font-size:.7rem;letter-spacing:.12em;color:var(--soft)}.lost{margin-left:auto;color:var(--soft);font-size:.82rem}
.checks{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;margin:14px 0}
table{width:100%;border-collapse:collapse;font-size:.9rem}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--soft);font-weight:500;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase}
tr:last-child td{border-bottom:0}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background:var(--soft)}
tr.ok .dot{background:var(--ok)}tr.warn .dot{background:var(--warn)}tr.bad .dot{background:var(--bad)}tr.skip .dot{background:#666}
tr.ok td:nth-child(3){color:var(--ok)}tr.warn td:nth-child(3){color:var(--warn)}tr.bad td:nth-child(3){color:var(--bad)}
a{color:var(--amber);text-decoration:none}a:hover{text-decoration:underline}
footer{margin-top:48px;border-top:1px solid var(--line);padding-top:20px;color:var(--soft);font-size:.82rem}
@media(max-width:640px){.wrap{padding:28px 16px 60px}h1{font-size:1.7rem}.ring{width:88px;height:88px;font-size:2.1rem}table{font-size:.8rem}th:nth-child(4),td:nth-child(4){display:none}}
</style>
</head>
<body>
<div class="wrap">
<header>
  <div>
    <div class="grade">GEO Audit · ${esc(generated.toLocaleDateString("tr-TR"))}</div>
    <h1>${esc(result.host)} <em>AI görünürlük raporu</em></h1>
    <p class="muted">${result.stats?.pages || 0} sayfa incelendi · ${result.coverage}% kapsam · ${esc(result.url)}</p>
  </div>
  <div class="score">
    <div class="ring ${scoreClass}">${result.score}</div>
    <div><div class="grade">Genel puan</div><div class="muted">${result.grade} · 100 üzerinden</div></div>
  </div>
</header>
<h2>Kategori skorları</h2>
<div class="cats">${categories}</div>
<h2>Öncelikli düzeltmeler</h2>
<ul class="recs">${recommendations}</ul>
<h2>Kontroller</h2>
${checks}
<h2>İncelenen sayfalar</h2>
<section class="checks"><table><thead><tr><th>Sayfa</th><th>HTTP</th><th>Kelime</th><th>H1</th><th>Dizin</th><th>Şema türleri</th></tr></thead><tbody>${pages}</tbody></table></section>
<footer>
  <p><strong>Yöntem:</strong> Herkese açık HTML, robots.txt, sitemap.xml, llms.txt, ai.txt ve RSS üzerinden on-page kontroller. Ödeme, reklam veya arama motoru API'si kullanılmaz. Marka bahsi ölçülmez; yalnızca sahip olunan profiller ve bilgi grafiği bağlantıları kontrol edilir.</p>
  <p>ai-ulu GEO Audit ${VERSION} · ${esc(generated.toISOString())}</p>
</footer>
</div>
</body>
</html>`;
}

function printSummary(result) {
  console.log(`\nGEO Audit — ${result.host}`);
  console.log(`Puan: ${result.score}/100 (${result.grade}) · Kapsam: ${result.coverage}% · ${result.stats?.pages || 0} sayfa`);
  console.log(result.categories.map((c) => `${c.label}: ${c.points}/${c.max}`).join(" | "));
  if (result.recommendations.length) {
    console.log("\nÖncelikli düzeltmeler:");
    for (const r of result.recommendations.slice(0, 8)) {
      console.log(`  [${(SEVERITY_LABEL[r.severity] || r.severity).padEnd(7)}] ${r.title} (-${r.lost})`);
      console.log(`            ${r.evidence}`);
    }
  } else {
    console.log("\nÖneri yok: ölçülebilir kontrollerin tamamı geçti.");
  }
}

function usage() {
  return `GEO Audit ${VERSION} — bir sitenin yapay zekâ aramalarındaki teknik görünürlüğünü ölçer.

Kullanım:
  node scripts/geo-audit.mjs <url> [seçenekler]

Seçenekler:
  --max-pages N     İncelenecek en fazla sayfa (varsayılan ${DEFAULT_MAX_PAGES}, en fazla ${MAX_PAGES})
  --out FILE        Kendi kendine yeten HTML rapor yaz
  --json            JSON çıktısı ver (konsol özeti yerine)
  --timeout MS      İstek zaman aşımı (varsayılan ${DEFAULT_TIMEOUT})
  --allow-private   Özel/localhost adreslere izin ver (yalnızca test için)
  -h, --help        Bu yardımı göster

Örnek:
  node scripts/geo-audit.mjs ai-ulu.com --max-pages 8 --out geo-report.html
`;
}

function parseArgs(argv) {
  const out = { url: "", maxPages: DEFAULT_MAX_PAGES, json: false, out: "", allowPrivate: false, timeout: DEFAULT_TIMEOUT, help: false, error: "" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") out.json = true;
    else if (arg === "--allow-private") out.allowPrivate = true;
    else if (arg === "-h" || arg === "--help") out.help = true;
    else if (arg === "--max-pages") out.maxPages = Number(argv[++i]);
    else if (arg === "--out") out.out = argv[++i] || "";
    else if (arg === "--timeout") out.timeout = Number(argv[++i]);
    else if (arg.startsWith("-")) out.error = `Bilinmeyen seçenek: ${arg}`;
    else if (!out.url) out.url = arg;
    else out.error = `Fazladan argüman: ${arg}`;
  }
  if (!Number.isFinite(out.maxPages) || out.maxPages < 1) out.maxPages = DEFAULT_MAX_PAGES;
  out.maxPages = Math.min(MAX_PAGES, Math.round(out.maxPages));
  if (!Number.isFinite(out.timeout) || out.timeout < 1000) out.timeout = DEFAULT_TIMEOUT;
  out.timeout = Math.min(60_000, Math.round(out.timeout));
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.url) {
    console.log(usage());
    process.exit(args.help ? 0 : 1);
  }
  if (args.error) {
    console.error(args.error);
    console.error(usage());
    process.exit(1);
  }
  try {
    const result = await audit(args.url, args);
    if (args.out) await writeFile(args.out, renderHtml(result), "utf8");
    if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    else {
      printSummary(result);
      if (args.out) console.log(`\nHTML rapor: ${args.out}`);
    }
    process.exit(result.score > 0 ? 0 : 1);
  } catch (error) {
    console.error(`Hata: ${error.message}`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main();

