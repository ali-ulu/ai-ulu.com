import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFile(join(root, rel), "utf8");

// The biggest objection people type into search is "can I build it with AI for
// free?". The home page answers it instead of ignoring it.
test("the home page answers the 'build it with AI for free' objection", async () => {
  const home = await read("dist/index.html");
  assert.match(home, /id="neden"/, "the objection section is present");
  assert.match(home, /Yapay zekâ ile bedava yaparım/, "it names the objection");
  assert.match(
    home,
    /href="\/blog\/yapay-zeka-ile-web-sitesi-yapmak\/"/,
    "it links to the post that argues the point",
  );
  // A short heading that fits two lines on a phone carries the section.
  assert.match(home, /<h2 id="neden-title">Yapay zekâ varken <em>neden biz\?<\/em><\/h2>/, "short heading");
});

test("the packages section links to the price explainer", async () => {
  const home = await read("dist/index.html");
  assert.match(
    home,
    /href="\/blog\/web-sitesi-fiyatini-ne-belirler\/"/,
    "packages link to the pricing post",
  );
});

test("the packages lead shows the configured starting price, or the honest fallback", async () => {
  const { site } = await import("../src/site/config.mjs");
  const { escapeHtml } = await import("../src/site/lib/html.mjs");
  const home = await read("dist/index.html");
  const lead = home.match(/id="paketler"[\s\S]*?<div class="grid g3"/)?.[0] ?? "";
  if (site.priceFrom) {
    assert.ok(lead.includes(escapeHtml(site.priceFrom)), `the anchor "${site.priceFrom}" shows`);
    assert.doesNotMatch(lead, /Fiyat listesi yok/, "the fallback is gone once a price exists");
  } else {
    assert.match(lead, /Fiyat listesi yok/, "the honest fallback shows");
    assert.doesNotMatch(lead, /₺/, "no currency symbol appears without a real number");
  }
});
