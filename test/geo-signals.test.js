import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pages, notFoundPage, renderPage } from "../src/site/pages.mjs";
import { site } from "../src/site/config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFile(join(root, rel), "utf8");
const built = existsSync(join(root, "dist/index.html"));

// Flatten every JSON-LD block on a page into one list of objects.
const ldObjects = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    const parsed = JSON.parse(m[1]);
    return Array.isArray(parsed) ? parsed : [parsed];
  });

test("every page states an explicit robots directive", () => {
  for (const p of pages) {
    const html = renderPage(p);
    assert.match(html, /<meta name="robots" content="index, follow">/, `${p.path} needs index, follow`);
    assert.doesNotMatch(html, /content="noindex/, `${p.path} must stay indexable`);
  }
  assert.match(renderPage(notFoundPage), /<meta name="robots" content="noindex, nofollow">/, "404 stays out of the index");
});

test("the Organization entity ships on every page", () => {
  for (const p of pages) {
    const org = ldObjects(renderPage(p)).find((o) => o["@type"] === "Organization");
    assert.ok(org, `${p.path} is missing Organization JSON-LD`);
    assert.equal(org.name, site.name, `${p.path} Organization name`);
    assert.equal(org.url, site.url, `${p.path} Organization url`);
    assert.ok(org.logo?.url.endsWith("/icon-512.png"), `${p.path} Organization logo`);
    assert.deepEqual(org.sameAs, site.sameAs, `${p.path} Organization profiles`);
    assert.equal(org.founder["@id"], `${site.url}/hakkimizda/#ali-ulu`, `${p.path} Organization founder`);
  }
});

test("WebPage names the author and the publisher by @id", () => {
  const home = ldObjects(renderPage(pages.find((p) => p.path === "/")));
  const wp = home.find((o) => o["@type"] === "WebPage");
  assert.equal(wp.author["@id"], `${site.url}/hakkimizda/#ali-ulu`, "author points at the Person entity");
  assert.equal(wp.publisher["@id"], `${site.url}/#organization`, "publisher points at the Organization");
});

test("the about page is a real page with a Person entity and a byline", () => {
  const about = pages.find((p) => p.path === "/hakkimizda/");
  assert.ok(about, "missing /hakkimizda/");
  assert.equal(about.file, "hakkimizda/index.html");
  const html = renderPage(about);
  assert.match(html, /<h1[^>]*>[\s\S]*?kim[\s\S]*?<\/h1>/i, "about page has a headline");
  assert.match(html, /rel="author"/, "about page is linked as the author page");
  const objects = ldObjects(html);
  assert.ok(objects.some((o) => o["@type"] === "AboutPage"), "AboutPage JSON-LD");
  const person = objects.find((o) => o["@type"] === "Person");
  assert.ok(person, "Person JSON-LD");
  assert.equal(person.name, site.owner);
  assert.deepEqual(person.sameAs, site.sameAs);
});

test("the footer shows the author and the last-updated date on every page", () => {
  for (const p of pages) {
    const html = renderPage(p);
    assert.match(html, /<a href="\/hakkimizda\/" rel="author">Ali Ulu<\/a>/, `${p.path} author link`);
    assert.match(html, new RegExp(`<time datetime="${site.updated}">`), `${p.path} visible date`);
  }
});

test("ai.txt is plain text and names the crawler rules and the feeds", async () => {
  if (!built) return;
  const txt = await read("dist/.well-known/ai.txt");
  assert.doesNotMatch(txt, /<html|<!doctype/i, "ai.txt must not be an HTML error page");
  assert.match(txt, /^User-agent: \*$/m, "wildcard rule");
  assert.match(txt, /^Disallow: \/api\/$/m, "API stays out");
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot"]) {
    assert.ok(txt.includes(`User-agent: ${bot}`), `${bot} is listed`);
  }
  assert.ok(txt.includes(`Sitemap: ${site.url}/sitemap.xml`), "sitemap pointer");
  assert.ok(txt.includes(`LLMs: ${site.url}/llms.txt`), "llms.txt pointer");
  assert.ok(txt.includes(`RSS: ${site.url}/feed.xml`), "feed pointer");
});

test("the RSS feed lists every post and is linked from the head", async () => {
  if (!built) return;
  const feed = await read("dist/feed.xml");
  assert.match(feed, /^<\?xml version="1\.0" encoding="UTF-8"\?>/, "XML declaration");
  assert.match(feed, /<rss version="2\.0"/, "RSS 2.0");
  const items = (feed.match(/<item>/g) ?? []).length;
  const { posts } = await import("../src/site/content/blog.mjs");
  assert.equal(items, posts.length, "one item per post");
  for (const p of posts) assert.ok(feed.includes(`${site.url}/blog/${p.slug}/`), `${p.slug} is in the feed`);
  const home = await read("dist/index.html");
  assert.match(home, /rel="alternate" type="application\/rss\+xml"/, "head advertises the feed");
  const headers = await read("dist/_headers");
  assert.match(headers, /Content-Type: application\/rss\+xml/, "feed gets the RSS content type");
});

test("llms.txt carries the identity and profile block", async () => {
  if (!built) return;
  const txt = await read("dist/llms.txt");
  assert.ok(txt.includes("## Künye"), "identity section");
  assert.ok(txt.includes(`${site.url}/hakkimizda/`), "about page");
  assert.ok(txt.includes("https://www.linkedin.com/in/aliulu777/"), "LinkedIn");
  assert.ok(txt.includes("https://github.com/ali-ulu"), "GitHub");
  assert.ok(txt.includes(`${site.url}/.well-known/ai.txt`), "ai.txt pointer");
});

test("the template gallery has static headings and an ItemList", async () => {
  if (!built) return;
  const html = await read("dist/sablonlar/index.html");
  assert.match(html, /<meta name="robots" content="index, follow"\s*\/?>/, "explicit robots directive");
  assert.match(html, /<h1[\s>]/, "one static H1 for no-JS crawlers");
  assert.ok((html.match(/<h2[\s>]/g) ?? []).length >= 1, "an H2 section");
  const h3 = (html.match(/<h3[\s>]/g) ?? []).length;
  assert.ok(h3 >= 12, `expected a heading per style, found ${h3}`);
  const objects = ldObjects(html);
  assert.ok(objects.some((o) => o["@type"] === "Organization"), "Organization JSON-LD");
  const collection = objects.find((o) => o["@type"] === "CollectionPage");
  assert.ok(collection, "CollectionPage JSON-LD");
  assert.equal(collection.mainEntity["@type"], "ItemList");
  assert.equal(collection.mainEntity.numberOfItems, 12);
  assert.equal(collection.mainEntity.itemListElement.length, 12);
});
