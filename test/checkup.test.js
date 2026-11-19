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
