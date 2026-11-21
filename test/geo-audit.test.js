import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { audit, evaluate, visibleText, parseSitemap, jsonLdNodes, renderHtml } from "../scripts/geo-audit.mjs";

const page = (over = {}) => ({
  url: "https://example.com/",
  path: "/",
  status: 200,
  ok: true,
  finalUrl: "https://example.com/",
  ttfb: 200,
  ms: 300,
  bytes: 1000,
  contentType: "text/html",
  title: "Example Studio — Web Tasarım",
  titleLength: 30,
  description: "x".repeat(100),
  descriptionLength: 100,
  robotsMeta: "index, follow",
  noindex: false,
  canonical: "https://example.com/",
  canonicalSelf: true,
  viewport: "width=device-width, initial-scale=1",
  lang: "tr",
  headings: [],
  h1: 1,
  h2: 2,
  h3: 1,
  skippedHeading: false,
  hierarchyOk: true,
  words: 500,
  paragraphs: 5,
  lists: 2,
  tables: 0,
  text: "",
  schemaTypes: ["Organization", "WebSite", "WebPage", "FAQPage", "Service"],
  jsonLdTypes: [],
  microdataTypes: [],
  hasOrganization: true,
  organization: {
    "@type": "Organization",
    name: "Example Studio",
    url: "https://example.com/",
    logo: "https://example.com/logo.png",
    sameAs: ["https://www.linkedin.com/company/example", "https://github.com/example", "https://www.wikidata.org/wiki/Q1"],
    contactPoint: { "@type": "ContactPoint", telephone: "+905000000000" },
  },
  person: null,
  website: { "@type": "WebSite" },
  webpage: { "@type": "WebPage" },
  article: null,
  faq: { "@type": "FAQPage" },
  breadcrumb: null,
  sameAs: ["https://www.linkedin.com/company/example", "https://github.com/example", "https://www.wikidata.org/wiki/Q1"],
  author: "",
  hasAuthor: true,
  hasDate: true,
  hasUpdated: true,
  hasFaq: true,
  hasPrices: true,
  hasNumbers: true,
  priceMatches: ["100 TL"],
  internalLinks: ["https://example.com/hakkimizda/", "https://example.com/blog/post/", "https://example.com/iletisim/"],
  externalLinks: [],
  images: 3,
  imagesWithoutAlt: 0,
  hasTel: true,
  hasWhatsApp: true,
  hasForm: true,
  isHome: true,
  isContent: false,
  isAbout: false,
  isContact: false,
  titleOk: true,
  descriptionOk: true,
  ...over,
});

const site = (pages, over = {}) => ({
  pages,
  robots: { ok: true, status: 200, body: "User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml" },
  llms: { ok: true, status: 200, body: "# Example Studio\n\n> Web tasarım stüdyosu.\n\n- [Ana sayfa](https://example.com/)\n" + "x".repeat(120) },
  aiTxt: { ok: true, status: 200, body: "User-agent: *\nAllow: /\n" + "x".repeat(30) },
  aiTxtAlt: { ok: false, status: 404, body: "" },
  feed: { ok: true, status: 200, body: "<rss><channel><title>Example</title></channel></rss>" },
  sitemap: { ok: true, status: 200, body: "<urlset></urlset>" },
  sitemapUrls: ["https://example.com/", "https://example.com/hakkimizda/", "https://example.com/blog/post/"],
  isIndex: false,
  urls: ["https://example.com/"],
  ...over,
});

const homeRes = { ok: true, status: 200, finalUrl: "https://example.com/", ttfb: 200, body: "", headers: new Headers() };
const httpRes = { ok: true, status: 301, finalUrl: "https://example.com/", headers: new Headers() };

function goodPages() {
  const about = page({
    url: "https://example.com/hakkimizda/",
    path: "/hakkimizda/",
    title: "Hakkında — Example Studio",
    description: "z".repeat(100),
    isHome: false,
    isAbout: true,
    webpage: { "@type": "AboutPage" },
    breadcrumb: { "@type": "BreadcrumbList" },
  });
  const post = page({
    url: "https://example.com/blog/post/",
    path: "/blog/post/",
    title: "Web Sitesi Fiyatları 2026 — Example Studio",
    description: "y".repeat(100),
    isHome: false,
    isContent: true,
    article: { "@type": "BlogPosting", datePublished: "2026-11-11", dateModified: "2026-11-21", author: { name: "Ali Ulu" } },
    breadcrumb: { "@type": "BreadcrumbList" },
    author: "Ali Ulu",
  });
  return [page(), about, post];
}

test("visibleText strips scripts and decodes entities", () => {
  const text = visibleText("<script>alert(1)</script><h1>Fiyat &amp; süre</h1><p>100&nbsp;TL</p>");
  assert.equal(text, "Fiyat & süre 100 TL");
});

test("parseSitemap reads urlset and sitemapindex", () => {
  assert.deepEqual(parseSitemap("<urlset><url><loc>https://x.com/a</loc></url></urlset>"), {
    urls: ["https://x.com/a"],
    isIndex: false,
  });
  assert.equal(parseSitemap("<sitemapindex><sitemap><loc>https://x.com/s.xml</loc></sitemap></sitemapindex>").isIndex, true);
});

test("jsonLdNodes flattens @graph and arrays", () => {
  const html = `<script type="application/ld+json">{"@graph":[{"@type":"Organization"},{"@type":"WebSite"}]}</script>`;
  assert.deepEqual(jsonLdNodes(html).map((n) => n["@type"]), ["Organization", "WebSite"]);
});

test("a complete site scores 100 / A", () => {
  const result = evaluate({ home: homeRes, site: site(goodPages()), httpRes });
  assert.equal(result.score, 100);
  assert.equal(result.grade, "A");
  assert.equal(result.coverage, 100);
  assert.equal(result.categories.find((c) => c.id === "schema").max, 25);
  assert.equal(result.categories.find((c) => c.id === "ai").max, 20);
  assert.equal(result.categories.reduce((s, c) => s + c.max, 0), 100);
});

test("a site without Organization, with noindex and no sitemap gets critical fixes", () => {
  const bad = page({
    hasOrganization: false,
    organization: null,
    sameAs: [],
    website: null,
    webpage: null,
    faq: null,
    schemaTypes: [],
    noindex: true,
    h1: 2,
    hierarchyOk: false,
    title: "",
    titleOk: false,
    description: "",
    descriptionOk: false,
    canonical: "",
    canonicalSelf: false,
    viewport: "",
    words: 40,
    internalLinks: [],
    hasFaq: false,
    hasNumbers: false,
    hasPrices: false,
    hasAuthor: false,
    hasDate: false,
    hasUpdated: false,
    isHome: true,
  });
  const result = evaluate({
    home: { ...homeRes, finalUrl: "http://example.com/" },
    site: site([bad], {
      robots: { ok: true, status: 200, body: "User-agent: *\nDisallow: /" },
      llms: { ok: false, status: 404, body: "" },
      aiTxt: { ok: false, status: 404, body: "" },
      aiTxtAlt: { ok: false, status: 404, body: "" },
      feed: { ok: false, status: 404, body: "" },
      sitemap: { ok: false, status: 404, body: "" },
      sitemapUrls: [],
    }),
    httpRes: { ok: true, status: 200, finalUrl: "http://example.com/", headers: new Headers() },
  });
  assert.ok(result.score < 40, `score ${result.score}`);
  const ids = result.recommendations.map((r) => r.title);
  assert.ok(ids.includes("Organization şeması"));
  assert.ok(ids.includes("Dizine açık"));
  assert.ok(ids.includes("Site haritası"));
  assert.ok(ids.includes("llms.txt"));
  assert.ok(result.recommendations.some((r) => r.severity === "critical"));
});

test("renderHtml is self-contained and escapes the host", () => {
  const result = evaluate({ home: homeRes, site: site(goodPages()), httpRes });
  const html = renderHtml({ ...result, host: "<script>alert(1)</script>" });
  assert.ok(html.startsWith("<!doctype html>"));
  assert.ok(html.includes("Kategori skorları"));
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(!html.includes("<script>alert(1)</script>"));
});

let server;
let base;

before(async () => {
  const homeHtml = () => `<!doctype html><html lang="tr"><head>
<title>Example Studio — Web Tasarım</title>
<meta name="description" content="${"Example Studio web tasarım ve yazılım hizmeti sunar. ".repeat(2)}">
<meta name="robots" content="index, follow">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${base}/">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"${base}/#org","name":"Example Studio","url":"${base}/","logo":"${base}/logo.png","sameAs":["https://www.linkedin.com/company/example","https://github.com/example","https://www.wikidata.org/wiki/Q1"],"contactPoint":{"@type":"ContactPoint","telephone":"+905000000000"}},
{"@type":"WebSite","@id":"${base}/#site","name":"Example Studio","url":"${base}/"},
{"@type":"WebPage","@id":"${base}/#page","url":"${base}/"},
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Fiyat?","acceptedAnswer":{"@type":"Answer","text":"100 TL"}}]},
{"@type":"Service","name":"Web tasarım"}
]}</script></head><body>
<h1>Example Studio</h1><h2>Hizmetler</h2><h3>Web tasarım</h3>
<p>${"Example Studio web tasarım ve yazılım hizmeti sunar. ".repeat(60)}</p>
<p>Fiyat 100 TL. Süre 2 hafta. 2026 yılında 20 proje.</p>
<p><a href="${base}/hakkimizda/">Hakkında</a> <a href="${base}/blog/post/">Blog</a> <a href="${base}/iletisim/">İletişim</a></p>
<a href="tel:+905000000000">Ara</a><a href="https://wa.me/905000000000">WhatsApp</a><form></form>
</body></html>`;

  const aboutHtml = () => `<!doctype html><html lang="tr"><head>
<title>Hakkında — Example Studio</title>
<meta name="description" content="${"Example Studio kimdir, nasıl çalışır ve ne yapar? ".repeat(2)}">
<meta name="robots" content="index, follow">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${base}/hakkimizda/">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"${base}/#org","name":"Example Studio","url":"${base}/","logo":"${base}/logo.png","sameAs":["https://www.linkedin.com/company/example","https://github.com/example","https://www.wikidata.org/wiki/Q1"],"contactPoint":{"@type":"ContactPoint","telephone":"+905000000000"}},
{"@type":"AboutPage","@id":"${base}/hakkimizda/#page","url":"${base}/hakkimizda/"},
{"@type":"Person","@id":"${base}/hakkimizda/#ali","name":"Ali Ulu"},
{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Ana sayfa","item":"${base}/"}]}
]}</script></head><body>
<h1>Hakkında</h1><h2>Kim yazıyor?</h2><p>${"Example Studio tek kişilik bir stüdyodur. ".repeat(60)}</p>
<p>Yazan: Ali Ulu</p><time datetime="2026-11-21">21 Kasım 2026</time>
<p><a href="${base}/">Ana sayfa</a> <a href="${base}/blog/post/">Blog</a> <a href="${base}/iletisim/">İletişim</a></p>
</body></html>`;

  const postHtml = () => `<!doctype html><html lang="tr"><head>
<title>Web Sitesi Fiyatları 2026 — Example Studio</title>
<meta name="description" content="${"2026 web sitesi fiyatları, paketler ve kapsam hakkında ayrıntılı rehber. ".repeat(2)}">
<meta name="robots" content="index, follow">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${base}/blog/post/">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"${base}/#org","name":"Example Studio","url":"${base}/","logo":"${base}/logo.png","sameAs":["https://www.linkedin.com/company/example","https://github.com/example","https://www.wikidata.org/wiki/Q1"],"contactPoint":{"@type":"ContactPoint","telephone":"+905000000000"}},
{"@type":"BlogPosting","@id":"${base}/blog/post/#article","headline":"Web Sitesi Fiyatları 2026","datePublished":"2026-11-11","dateModified":"2026-11-21","author":{"@type":"Person","name":"Ali Ulu"},"publisher":{"@id":"${base}/#org"}},
{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Ana sayfa","item":"${base}/"}]}
]}</script></head><body>
<h1>Web Sitesi Fiyatları 2026</h1><h2>Fiyatlar</h2><h3>Kurumsal</h3>
<p>${"Web sitesi fiyatları kapsama göre değişir. ".repeat(60)}</p>
<p>Fiyat 100 TL. Süre 2 hafta. 2026 yılında 20 proje.</p>
<p>Yazan: Ali Ulu</p><time datetime="2026-11-11">11 Kasım 2026</time><time datetime="2026-11-21">21 Kasım 2026</time>
<p><a href="${base}/">Ana sayfa</a> <a href="${base}/hakkimizda/">Hakkında</a> <a href="${base}/iletisim/">İletişim</a></p>
</body></html>`;

  const contactHtml = () => `<!doctype html><html lang="tr"><head>
<title>İletişim — Example Studio</title>
<meta name="description" content="${"Example Studio ile iletişime geçin, projenizi konuşalım. ".repeat(2)}">
<meta name="robots" content="index, follow">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${base}/iletisim/">
<script type="application/ld+json">{"@type":"ContactPage","url":"${base}/iletisim/"}</script></head><body>
<h1>İletişim</h1><h2>Yazın</h2><p>${"Projenizi konuşmak için yazın. ".repeat(60)}</p>
<a href="tel:+905000000000">Ara</a><form></form>
</body></html>`;

  server = createServer((req, res) => {
    const path = new URL(req.url, "http://x").pathname;
    const routes = {
      "/": homeHtml,
      "/hakkimizda/": aboutHtml,
      "/blog/post/": postHtml,
      "/iletisim/": contactHtml,
      "/robots.txt": () => `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`,
      "/sitemap.xml": () => `<?xml version="1.0"?><urlset>
        <url><loc>${base}/</loc></url>
        <url><loc>${base}/hakkimizda/</loc></url>
        <url><loc>${base}/blog/post/</loc></url>
        <url><loc>${base}/iletisim/</loc></url>
      </urlset>`,
      "/llms.txt": () => `# Example Studio\n\n> Web tasarım stüdyosu.\n\n## Sayfalar\n- [Ana sayfa](${base}/)\n- [Hakkında](${base}/hakkimizda/)\n`,
      "/.well-known/ai.txt": () => "# ai.txt\nUser-agent: *\nAllow: /\n",
      "/feed.xml": () => `<?xml version="1.0"?><rss version="2.0"><channel><title>Example</title><item><title>Post</title><link>${base}/blog/post/</link></item></channel></rss>`,
    };
    const value = routes[path];
    if (!value) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
      return;
    }
    const body = typeof value === "function" ? value() : value;
    const type = path.endsWith(".xml") ? "application/xml" : path.endsWith(".txt") ? "text/plain" : "text/html; charset=utf-8";
    res.writeHead(200, { "content-type": type });
    res.end(body);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("audit crawls sitemap pages and reads robots, llms, ai.txt and feed", async () => {
  const result = await audit(base, { allowPrivate: true, maxPages: 4, timeout: 5000 });
  assert.ok(result.pages.length >= 3, `pages ${result.pages.length}`);
  assert.equal(result.site.sitemap.urls, 4);
  assert.equal(result.site.llms.ok, true);
  assert.equal(result.site.aiTxt.ok, true);
  assert.equal(result.site.feed.ok, true);
  assert.equal(result.checks.find((c) => c.id === "organization").status, "pass");
  assert.equal(result.checks.find((c) => c.id === "sitemap").status, "pass");
  assert.equal(result.checks.find((c) => c.id === "llms").status, "pass");
  assert.ok(result.score > 50, `score ${result.score}`);
  assert.ok(result.recommendations.some((r) => r.title === "HTTPS"));
});

test("audit refuses private hosts unless explicitly allowed", async () => {
  await assert.rejects(() => audit(base, { maxPages: 1, timeout: 1000 }), /özel/);
});
