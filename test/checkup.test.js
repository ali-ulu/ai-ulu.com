import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHost, blockedBots, findings } from "../src/checkup.js";

test("parseHost accepts public domains and strips URL parts", () => {
  assert.equal(parseHost("https://www.Klinik.com.tr/iletisim?x=1"), "www.klinik.com.tr");
  assert.equal(parseHost("usdenta.com"), "usdenta.com");
});

test("parseHost rejects IPs, internal names and garbage", () => {
  for (const bad of ["127.0.0.1", "http://169.254.169.254/", "localhost", "intranet", "printer.local", "[::1]", "", "a b.com", "ai-ulu.com"]) {
    assert.equal(parseHost(bad), null, bad);
  }
});

test("blockedBots reads grouped user-agents and wildcard", () => {
  assert.deepEqual(blockedBots("User-agent: *\nDisallow: /").length, 6);
  assert.deepEqual(blockedBots("User-agent: GPTBot\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: *\nDisallow: /admin"), ["GPTBot", "ClaudeBot"]);
});

const base = { https: { ok: true, status: 200 }, http: { ok: true, status: 200, redirectsToHttps: true }, placeholder: false, reachable: true, loadMs: 500, visibleChars: 2000, title: "t", description: "d", viewport: true, schema: ["Dentist"], llmsTxt: true, aiBotsBlocked: [], tel: true, whatsapp: true, form: true };

test("findings is empty for a healthy site", () => {
  assert.deepEqual(findings(base), []);
});

test("placeholder hosting page is reported as a single finding", () => {
  const f = findings({ ...base, placeholder: true, https: { ok: false, status: 0, error: "bağlantı hatası" } });
  assert.equal(f.length, 1);
  assert.match(f[0], /site yok/);
});

test("JS-rendered page does not claim contact links are missing", () => {
  const f = findings({ ...base, visibleChars: 60, tel: false, whatsapp: false, form: false });
  assert.equal(f.length, 1);
  assert.match(f[0], /JavaScript/);
});

test("Cloudflare TLS codes read as a certificate error", () => {
  const f = findings({ ...base, https: { ok: false, status: 526 } });
  assert.match(f[0], /sertifika hatası/);
});
