import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFile(join(root, rel), "utf8");

test("the contact form is a postcard, not a stacked field list", async () => {
  const html = await read("dist/index.html");
  assert.match(html, /<section class="s" id="iletisim">/, "the section keeps its anchor");
  assert.match(html, /<form class="pm-card" id="lead-form" novalidate>/, "the form is the postcard");
  assert.match(html, /class="pm-body"/, "the card has a two-part body");
  assert.match(html, /class="pm-left"/, "the message half is present");
  assert.match(html, /class="pm-right"/, "the address half is present");
  assert.match(html, /class="pm-seal"/, "the postmark seal is present");
  assert.match(html, /class="pm-foot"/, "the send row is present");
  // the old stacked layout is gone
  assert.doesNotMatch(html, /class="contact-grid"/, "the old grid is gone");
  assert.doesNotMatch(html, /class="direct"/, "the old aside is gone");
});

test("the /api/lead contract is unchanged: names, ids and honeypot", async () => {
  const html = await read("dist/index.html");
  // Every field the worker reads must keep its name and stay in the form.
  for (const name of ["name", "reach", "type", "msg", "company"]) {
    assert.match(html, new RegExp(`name="${name}"`), `${name} field is present`);
  }
  assert.match(html, /id="lead-form"/, "app.js hooks this id");
  assert.match(html, /id="form-status"/, "the status region survives");
  assert.match(html, /id="company"[^>]*tabindex="-1"/, "the honeypot stays unfocusable");
  assert.match(html, /<p class="form__status" id="form-status" role="status" aria-live="polite">/, "status is a live region");
});

test("the topic stamps are radios bound to the existing type field", async () => {
  const html = await read("dist/index.html");
  const radios = html.match(/<input type="radio" name="type" value="[a-z]+"/g) || [];
  assert.equal(radios.length, 4, "one stamp per project type");
  assert.match(html, /value="site" checked/, "the first stamp is chosen by default");
  assert.match(html, /<fieldset class="pm-stamps">[\s\S]*?<legend>Konu · bir pul seçin<\/legend>/, "the stamps are a labelled group");
  assert.doesNotMatch(html, /<select id="type"/, "the select is gone");
});

test("each field keeps an accessible label and the text limit is honest", async () => {
  const html = await read("dist/index.html");
  for (const id of ["msg", "name", "reach"]) {
    assert.match(html, new RegExp(`<label class="visually-hidden" for="${id}">`), `${id} has a label`);
  }
  assert.match(html, /id="msg" name="msg" maxlength="280"/, "the limit matches the counter");
  assert.match(html, /id="pm-count"[^>]*>0 \/ 280</, "the counter starts at zero");
  assert.match(html, /id="pm-thanks"[^>]*hidden/, "the thank-you card starts hidden");
});

test("Caveat is self-hosted, because the CSP only allows this origin", async () => {
  const fonts = await read("src/site/assets/fonts/fonts.css");
  assert.match(fonts, /font-family: 'Caveat'/, "the hand is declared");
  assert.match(fonts, /url\(\/fonts\/caveat-400-latin\.woff2\)/, "weight 400 is local");
  assert.match(fonts, /url\(\/fonts\/caveat-600-latin\.woff2\)/, "weight 600 is local");
  assert.doesNotMatch(fonts, /fonts\.gstatic\.com|fonts\.googleapis\.com/, "nothing is fetched from Google");
  const css = await read("src/site/assets/postmark-form.css");
  assert.match(css, /--pm-hand: "Caveat", "Segoe Script", cursive/, "the card uses the hand");
  assert.match(css, /repeating-linear-gradient\([\s\S]*?var\(--pm-line\)/, "the message sits on ruled lines");
  assert.match(css, /url\("data:image\/svg\+xml,/, "the grain is a data URI");
});

test("the postcard is one stylesheet, loaded only on the home page", async () => {
  const html = await read("dist/index.html");
  assert.match(html, /<link rel="stylesheet" href="\/postmark-form\.css">/, "the page links it");
  const privacy = await read("dist/gizlilik/index.html");
  assert.doesNotMatch(privacy, /postmark-form\.css/, "other pages do not load it");
  const css = await read("src/site/assets/postmark-form.css");
  assert.match(css, /@container pm \(max-width: 780px\)/, "it recomposes by container width");
  assert.match(css, /prefers-reduced-motion: reduce/, "it respects reduced motion");
});
