import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pose, pull, STOPS, RANGES, LAYERS } from "../src/site/client/home/scene/pose.js";
import { waHref } from "../src/site/client/home/funnel.js";
import { sectors, defaultSector } from "../src/site/content/sectors.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const home = () => readFile(join(root, "dist/index.html"), "utf8");

test("the film is reversible: the same progress always gives the same pose", () => {
  for (const p of [0, 0.25, 0.5, 0.75, 1]) assert.deepEqual(pose(p), pose(p));
  assert.deepEqual(pose(-1), pose(0), "progress is clamped below");
  assert.deepEqual(pose(2), pose(1), "progress is clamped above");
});

test("each chapter pulls out exactly its own layer", () => {
  assert.ok(pose(0).sheets.every((s) => s.pull === 0), "the hero shows the closed stack");
  for (let i = 0; i < LAYERS; i++) {
    const pulls = pose(STOPS[i + 1]).sheets.map((s) => s.pull);
    pulls.forEach((w, n) => assert.equal(w > 0.99, n === i, `stop ${i + 1}: layer ${n} pull ${w}`));
  }
  assert.equal(pull(LAYERS - 1, 1), 1, "the film ends on the conversion layer");
});

test("sheets stay in stacking order, top first, in both orientations", () => {
  for (const portrait of [false, true]) {
    for (let p = 0; p <= 1; p += 0.05) {
      const ys = pose(p, portrait).sheets.map((s) => s.y);
      for (let i = 1; i < ys.length; i++) assert.ok(ys[i - 1] > ys[i], `layer ${i} above layer ${i - 1} at p=${p}`);
    }
  }
});

test("chapter markup mirrors the choreography", async () => {
  const html = await home();
  RANGES.forEach(([a, b], i) => assert.match(html, new RegExp(`id="c${i}" data-a="${a}" data-b="${b}"`), `chapter ${i} range`));
  assert.equal((html.match(/data-stop="/g) ?? []).length, STOPS.length, "one rail dot per stop");
  assert.match(html, /<a class="skip-link" href="#nasil">Filmi geç<\/a>/, "the film can be skipped");
});

test("every sector is complete and reaches the page", async () => {
  const html = await home();
  assert.equal(new Set(sectors.map((s) => s.id)).size, sectors.length, "sector ids are unique");
  assert.ok(sectors.includes(defaultSector));
  for (const s of sectors) {
    for (const key of ["label", "brand", "sub", "cta", "schema", "ask", "wa"]) assert.ok(s[key], `${s.id}.${key}`);
    assert.match(s.wa, /web sitesi istiyorum/, `${s.id}: the WhatsApp message says what is wanted`);
    assert.match(html, new RegExp(`name="sector" value="${s.id}"`), `${s.id} chip is rendered`);
  }
});

test("a sector message replaces the old one on a WhatsApp link", () => {
  assert.equal(waHref("https://wa.me/905079581642?text=eski", "Diş kliniği"), "https://wa.me/905079581642?text=Di%C5%9F%20klini%C4%9Fi");
});

test("the hero states only facts the site already commits to", async () => {
  const html = await home();
  const facts = html.match(/<ul class="facts">[\s\S]*?<\/ul>/)[0];
  assert.match(facts, /2–4 hafta/); // SSS: "iki ile dört hafta"
  assert.match(facts, /24 saat/); // SSS: "24 saat içinde yazılı teklif"
  assert.doesNotMatch(facts, /%|₺|\d{3}/, "no invented metrics or prices");
});
