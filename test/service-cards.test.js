import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFile(join(root, rel), "utf8");

test("cards are flat filled tiles: no outline, gradient, glow or blur", async () => {
  const css = await read("src/site/assets/site.css");
  const card = css.match(/\.cell,\.card\{[^}]*\}/)[0];
  assert.match(card, /border-radius:18px/, "cards need rounded corners");
  assert.match(card, /background:#141518/, "cards are one tone step above the page");
  assert.doesNotMatch(card, /gradient|box-shadow|border:|backdrop-filter/, "no decoration on cards");
});

test("home cards carry no index numbers or mono labels", async () => {
  const home = await read("dist/index.html");
  assert.doesNotMatch(home, /class="n"/, "no number pills");
  assert.doesNotMatch(home, /class="eyebrow"/, "no eyebrow labels");
});

test("the highlighted package names itself in amber text", async () => {
  const css = await read("src/site/assets/site.css");
  assert.match(css, /\.card \.flag\{[^}]*color:var\(--amber\)/, "flag text uses the accent");
  const home = await read("dist/index.html");
  assert.match(home, /<p class="flag">En kapsamlı<\/p>/, "the widest package is flagged");
});

