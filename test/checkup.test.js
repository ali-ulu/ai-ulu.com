import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHost, robotsAllows, evaluate, grade } from "../src/checkup.js";

test("parseHost accepts public domains, our own site, and strips URL parts", () => {
  assert.equal(parseHost("https://www.Klinik.com.tr/iletisim?x=1"), "www.klinik.com.tr");
  assert.equal(parseHost("ai-ulu.com"), "ai-ulu.com");
});

test("parseHost rejects IPs, internal names and garbage", () => {
  for (const bad of ["127.0.0.1", "http://169.254.169.254/", "localhost", "intranet", "printer.local", "[::1]", "", "a b.com"]) {
    assert.equal(parseHost(bad), null, bad);
  }
});

test("robotsAllows: a specific group overrides the wildcard", () => {
  const txt = "User-agent: *\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /";
  assert.equal(robotsAllows(txt, "OAI-SearchBot"), true);
  assert.equal(robotsAllows(txt, "PerplexityBot"), false);
});

test("robotsAllows: blocking a training crawler does not block search crawlers", () => {
  const txt = "User-agent: GPTBot\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: *\nDisallow: /admin";
  assert.equal(robotsAllows(txt, "OAI-SearchBot"), true);
  assert.equal(robotsAllows(txt, "Googlebot"), true);
});

test("robotsAllows: empty or missing robots.txt allows everything, empty Disallow allows", () => {
  assert.equal(robotsAllows("", "Googlebot"), true);
  assert.equal(robotsAllows("User-agent: *\nDisallow:", "Googlebot"), true);
});

const res = (over = {}) => ({ ok: true, status: 200, finalUrl: "https://x.com/", ms: 300, body: "", headers: new Headers(), ...over });
const goodHtml = `<html><head><title>Klinik</title><meta name="description" content="d"><meta property="og:title" content="t">
<link rel="canonical" href="https://x.com/"><script type="application/ld+json">{"@type":"Dentist"}</script></head>
<body><h1>Diş</h1><p>${"Afyon diş kliniği. ".repeat(30)}</p><a href="tel:1">ara</a><a href="https://wa.me/1">wa</a><form></form></body></html>`;
const site = (over = {}) => ({
  https: res({ body: goodHtml }), http: res(), page: res({ body: goodHtml }),
  robots: res({ body: "User-agent: *\nAllow: /\nSitemap: https://x.com/sitemap.xml" }),
  llms: res({ body: "# Klinik" }), sitemap: res({ body: "<urlset></urlset>" }), asOai: res(), speed: null, ...over,
});

test("a complete site scores 100 / A", () => {
  const r = evaluate(site());
  assert.equal(r.score, 100);
  assert.equal(r.grade, "A");
  assert.ok(r.checks.every((c) => c.status === "pass"));
});

test("hosting placeholder page scores 0 with a single finding", () => {
  const body = '<META HTTP-EQUIV="refresh" CONTENT="0;URL=/cgi-sys/defaultwebpage.cgi">';
  const r = evaluate(site({ page: res({ body }), https: res({ ok: false, status: 526 }) }));
  assert.equal(r.score, 0);
  assert.equal(r.checks.length, 1);
  assert.match(r.checks[0].detail, /site yok.*sertifika hatası/);
});

test("JS-rendered page: contact checks are unknown, not failed", () => {
  const body = '<html><head><title>t</title></head><body><div id="root"></div></body></html>';
  const r = evaluate(site({ page: res({ body }) }));
  const contact = r.checks.filter((c) => c.cat === "donusum");
  assert.ok(contact.every((c) => c.status === "unknown"));
  assert.equal(r.checks.find((c) => c.label.startsWith("İçerik")).status, "fail");
});

test("firewall that blocks OAI-SearchBot is caught", () => {
  const r = evaluate(site({ asOai: res({ ok: false, status: 403 }) }));
  assert.equal(r.checks.find((c) => c.label.startsWith("Güvenlik duvarı")).status, "fail");
});

test("noindex caps the score at 20", () => {
  const body = goodHtml.replace("<head>", '<head><meta name="robots" content="noindex">');
  assert.equal(evaluate(site({ page: res({ body }) })).score, 20);
});

test("grade boundaries", () => {
  assert.deepEqual([90, 89, 70, 50, 49].map(grade), ["A", "B", "C", "E", "F"]);
});

// A site whose server refuses our agent (bot protection, WAF, rate limit) is not
// a dead site. Reporting 403 as "site yok" accused every Cloudflare-protected
// business — koton.com, hepsiburada.com, otelz.com all scored 0/F this way.
test("a refusal (403/429/503) is unmeasured, not a dead site", () => {
  for (const status of [401, 403, 405, 429, 503]) {
    const r = evaluate(site({
      https: res({ ok: false, status }), http: res({ ok: false, status }),
      page: res({ ok: false, status }), asOai: res({ ok: false, status }),
    }));
    assert.equal(r.reachable, null, `status ${status}`);
    assert.equal(r.score, null, `status ${status}`);
    assert.equal(r.checks.length, 1);
    assert.equal(r.checks[0].status, "unknown");
    assert.match(r.checks[0].detail, new RegExp(String(status)));
    assert.doesNotMatch(r.checks[0].detail, /site yok|hata ya da boş sayfa/i);
  }
});

test("a genuine outage (5xx/connection failure) still fails the site", () => {
  const r = evaluate(site({
    https: res({ ok: false, status: 522 }), http: res({ ok: false, status: 522 }),
    page: res({ ok: false, status: 522 }), asOai: res({ ok: false, status: 522 }),
  }));
  assert.equal(r.reachable, false);
  assert.equal(r.score, 0);
});

// Turkish "park" words are everywhere ("parkedebileceğiniz", "parkederek").
// The old /parked/ test condemned any site with a car park to 0/F.
test("Turkish park words do not look like a parked domain", () => {
  for (const phrase of [
    "Aracınızı güvenle parkedebileceğiniz kapalı otoparkımız var.",
    "Müşterilerimiz aracını parkederek alışverişe devam edebilir.",
    "Otoparkımızda 50 araç parkedilebilir.",
  ]) {
    const body = goodHtml.replace("Afyon diş kliniği. ".repeat(30), `${phrase} `.repeat(20));
    const r = evaluate(site({ page: res({ body }) }));
    assert.equal(r.reachable, true, phrase);
    assert.ok(r.score > 50, `${phrase} scored ${r.score}`);
  }
});

test("a real parked-domain page is still caught", () => {
  for (const body of [
    "<h1>This domain is for sale</h1>",
    "<h1>Bu alan adı satılıktır</h1>",
    '<meta http-equiv="refresh" content="0;URL=/cgi-sys/defaultwebpage.cgi">',
  ]) {
    const r = evaluate(site({ page: res({ body }) }));
    assert.equal(r.reachable, false, body);
    assert.equal(r.score, 0, body);
  }
});

// WordPress and hand-written HTML both emit <meta content="..." name="description">.
// The old regex only matched name-before-content and failed those pages silently.
test("meta tags are read regardless of attribute order", () => {
  const body = goodHtml
    .replace('<meta name="description" content="d">', '<meta content="Afyon diş kliniği." name="description">')
    .replace('<meta property="og:title" content="t">', '<meta content="Klinik" property="og:title">');
  const r = evaluate(site({ page: res({ body }) }));
  assert.equal(r.checks.find((c) => c.label === "Arama açıklaması").status, "pass");
  assert.equal(r.checks.find((c) => c.label.startsWith("Paylaşım")).status, "pass");
  assert.equal(r.score, 100);
});

test("noindex is caught regardless of attribute order", () => {
  const body = goodHtml.replace("<head>", '<head><meta content="noindex, follow" name="robots">');
  assert.equal(evaluate(site({ page: res({ body }) })).score, 20);
});

test("og:image alone satisfies the share-preview check", () => {
  const body = goodHtml.replace('<meta property="og:title" content="t">', '<meta property="og:image" content="/a.png">');
  assert.equal(evaluate(site({ page: res({ body }) })).checks.find((c) => c.label.startsWith("Paylaşım")).status, "pass");
});

// The score used to divide by whatever checks happened to run. A JS-rendered page
// skipped the 12-point content check, so its total shrank and 100 stayed reachable
// on a partial rubric — two sites "out of 100" were not comparable.
test("the score is a share of the whole rubric, not of what ran", () => {
  const body = '<html><head><title>t</title></head><body><div id="root"></div></body></html>';
  const r = evaluate(site({ page: res({ body }) }));
  assert.equal(r.basis.nominal, 100);
  assert.ok(r.basis.skipped > 0);
  assert.ok(r.basis.covered < 100);
  assert.ok(r.score < 100, `partial rubric must not reach 100, got ${r.score}`);
  // points / nominal, not points / (nominal - skipped)
  assert.equal(r.score, Math.round((r.basis.points / r.basis.nominal) * 100));
});

test("a perfect site still scores exactly 100 and covers the whole rubric", () => {
  const r = evaluate(site());
  assert.equal(r.score, 100);
  assert.equal(r.basis.covered, 100);
  assert.equal(r.basis.skipped, 0);
  assert.equal(r.basis.points, r.basis.nominal);
});

test("coverage is reported so a partial measurement is visible", () => {
  // our own host skips the redirect and response-time checks — still graded
  const own = evaluate(site({
    https: res({ body: goodHtml, own: true }), http: res({ body: goodHtml, own: true }),
    page: res({ body: goodHtml, own: true }),
  }));
  assert.ok(own.basis.covered >= 80);
  assert.equal(typeof own.score, "number");

  // an unreadable page skips the content and contact checks: 27% of the rubric
  const body = '<html><head><title>t</title></head><body><div id="root"></div></body></html>';
  const js = evaluate(site({ page: res({ body }) }));
  assert.ok(js.basis.covered < 100, "skipped checks must lower coverage");
  assert.ok(js.basis.skipped > 0);
  assert.equal(typeof js.score, "number", "a partial score is still shown, with its coverage");
});

test("category max uses rubric weight, so a skipped check still shows its full bar", () => {
  const body = '<html><head><title>t</title></head><body><div id="root"></div></body></html>';
  const r = evaluate(site({ page: res({ body }) }));
  const okunur = r.categories.find((c) => c.id === "okunur");
  assert.equal(okunur.max, 20, "okunur category is out of 20 even when the 12-point check is skipped");
});
