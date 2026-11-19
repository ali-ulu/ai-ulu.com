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
<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="canonical" href="https://x.com/">
<script type="application/ld+json">{"@type":"Dentist"}</script></head>
<body><h1>Diş</h1><p>${"Afyon diş kliniği. ".repeat(30)}</p><img src="a.png" alt="Klinik girişi">
<a href="tel:1">ara</a><a href="https://wa.me/1">wa</a><form></form></body></html>`;
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
  // our own host skips the redirect and response-time checks — full-ish coverage
  const own = evaluate(site({
    https: res({ body: goodHtml, own: true }), http: res({ body: goodHtml, own: true }),
    page: res({ body: goodHtml, own: true }),
  }));
  assert.equal(own.basis.covered, 92);
  assert.equal(own.basis.skipped, 2);

  // A JS-rendered page skips the content check and the three contact checks:
  // 17 points of the rubric. The score is still shown, but the gap is stated.
  const body = '<html><head><title>t</title><meta name="viewport" content="width=device-width"></head><body><div id="root"></div></body></html>';
  const js = evaluate(site({ page: res({ body }) }));
  assert.equal(js.basis.covered, 83);
  assert.equal(js.basis.skipped, 4);
  assert.equal(typeof js.score, "number");
});

// A page that cannot be read is a failure, not an unknown: Google sees an empty
// page too. So it is scored, never skipped — the floor that would have withheld
// the grade here can never be reached, which is why it does not exist.
test("an unreadable page is scored, not withheld", () => {
  const bare = evaluate(site({ page: res({ body: '<html><body><div id="root"></div></body></html>' }) }));
  assert.equal(bare.checks.find((c) => c.label.startsWith("İçerik")).status, "fail");
  assert.equal(typeof bare.score, "number");
  assert.equal(bare.grade, "F");
});

test("category max uses rubric weight, so a skipped check still shows its full bar", () => {
  const body = '<html><head><title>t</title></head><body><div id="root"></div></body></html>';
  const r = evaluate(site({ page: res({ body }) }));
  const okunur = r.categories.find((c) => c.id === "okunur");
  assert.equal(okunur.max, 20, "okunur category is out of 20 even when the content check is skipped");
});

test("microdata counts as business data, not just JSON-LD", () => {
  const body = goodHtml.replace('<script type="application/ld+json">{"@type":"Dentist"}</script>',
    '<div itemscope itemtype="https://schema.org/Dentist"><span itemprop="name">Klinik</span></div>');
  const r = evaluate(site({ page: res({ body }) }));
  const schema = r.checks.find((c) => c.label.startsWith("İşletme bilgisi"));
  assert.equal(schema.status, "pass");
  assert.match(schema.detail, /Dentist/);
});

test("a missing viewport tag is a real fail, not an unknown", () => {
  const body = goodHtml.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', "");
  const r = evaluate(site({ page: res({ body }) }));
  const vp = r.checks.find((c) => c.label.includes("viewport"));
  assert.equal(vp.status, "fail");
  assert.equal(r.score, 98);
});

test("viewport is still judged on a JS-rendered page (it lives in head)", () => {
  const body = '<html><head><title>t</title><meta name="viewport" content="width=device-width"></head><body><div id="root"></div></body></html>';
  const r = evaluate(site({ page: res({ body }) }));
  assert.equal(r.checks.find((c) => c.label.includes("viewport")).status, "pass");
});

test("images without alt text are caught, near-complete alt earns partial credit", () => {
  const noAlt = goodHtml.replace('alt="Klinik girişi"', "");
  assert.equal(evaluate(site({ page: res({ body: noAlt }) })).checks.find((c) => c.label.includes("alt metin")).status, "fail");

  // One of six images missing alt is under the 20% bar: partial credit, not a fail.
  const mostly = goodHtml.replace("</p>", '</p><img src="b.png" alt="b"><img src="c.png" alt="c"><img src="d.png" alt="d"><img src="e.png" alt="e"><img src="f.png">');
  const partial = evaluate(site({ page: res({ body: mostly }) })).checks.find((c) => c.label.includes("alt metin"));
  assert.equal(partial.status, "warn");
  assert.match(partial.detail, /1 tanesinde alt metin yok/);

  // Half the images missing alt is a fail.
  const half = goodHtml.replace("</p>", '</p><img src="b.png"><img src="c.png" alt="c">');
  assert.equal(evaluate(site({ page: res({ body: half }) })).checks.find((c) => c.label.includes("alt metin")).status, "fail");

  const clean = evaluate(site({ page: res({ body: goodHtml }) })).checks.find((c) => c.label.includes("alt metin"));
  assert.equal(clean.status, "pass");
});

test("an empty H1 fails even when the count is one", () => {
  const body = goodHtml.replace("<h1>Diş</h1>", "<h1>   </h1>");
  const h1 = evaluate(site({ page: res({ body }) })).checks.find((c) => c.label.includes("H1"));
  assert.equal(h1.status, "fail");
  assert.match(h1.detail, /içi boş/);
});
