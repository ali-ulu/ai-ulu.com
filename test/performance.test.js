import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFile(join(root, rel), "utf8");
const built = existsSync(join(root, "dist/index.html"));

// The old home film (three.js, 670 KB) blocked a phone's main thread for ~15 s,
// so phones got no 3D at all. The film is now a 19 KB (gzip) OGL scene that
// runs everywhere; these tests pin what keeps it cheap.
test("the hero never waits on the 3D scene", async () => {
  const js = await read("src/site/client/home/main.js");
  // The scene must be a dynamic import behind an idle callback, so the WebGL
  // library stays out of the entry bundle and off the critical path.
  assert.match(js, /whenIdle\(async[\s\S]*await import\("\.\/scene\/index\.js"\)/, "the scene must load lazily, when idle");
  assert.doesNotMatch(js, /^import .*scene\/index/m, "the scene must not be a static import");
  if (!built) return;
  const html = await read("dist/index.html");
  assert.doesNotMatch(html, /id="pre"/, "no preloader may cover the static hero");
  const entry = await read("dist/js/home.js");
  assert.ok(entry.length < 12_000, `the entry bundle must stay small (${entry.length} bytes)`);
  assert.doesNotMatch(entry, /getContext\(["']webgl/, "WebGL code belongs in the lazy chunk");
});

test("the scene is skipped for Data Saver, low memory and reduced motion", async () => {
  const js = await read("src/site/client/home/main.js");
  assert.match(js, /saveData/, "must honour Data Saver");
  assert.match(js, /deviceMemory/, "must skip low-memory devices");
  assert.match(js, /prefers-reduced-motion: reduce/, "must honour reduced motion");
  const vortex = await read("src/site/assets/vortex.js");
  assert.match(vortex, /min-width:\s*768px/, "the particle field still stays off phones");
});

test("falling back to the static column does not move the hero", async () => {
  const css = await read("src/site/assets/site.css");
  // The fallback class lands after first paint, so the hero must keep the same
  // box in both modes (a full viewport) or the page would shift (CLS).
  assert.match(css, /\.no-3d #c0\{[^}]*min-height:100svh/, "the fallback hero must fill the viewport like the film's");
  assert.match(css, /\.stage\{[^}]*height:100svh/, "the film stage is one viewport tall");
});

test("the scene renders on demand and caps the pixel ratio", async () => {
  const ticker = await read("src/site/client/home/progress.js");
  assert.match(ticker, /if \(more\) wake\(\)/, "frames must stop when nothing is moving");
  assert.match(ticker, /IntersectionObserver/, "no frames while the film is off screen");
  const scene = await read("src/site/client/home/scene/index.js");
  assert.match(scene, /Math\.min\(devicePixelRatio \|\| 1, 2\)/, "device pixel ratio must be capped at 2");
});

test("the hero fonts are preloaded so the swap does not shift the layout", async () => {
  if (!built) return;
  const html = await read("dist/index.html");
  for (const font of [
    "bodoni-moda-normal-latin-ext.woff2",
    "bodoni-moda-normal-latin.woff2",
    "hanken-grotesk-normal-latin-ext.woff2",
    "hanken-grotesk-normal-latin.woff2",
  ]) {
    assert.match(html, new RegExp(`<link rel="preload" href="/fonts/${font.replace(/\./g, "\\.")}"`), `${font} must be preloaded`);
  }
  assert.match(html, /crossorigin/, "font preloads need crossorigin for the same-origin font request");
});

test("the vignette keeps the hero text legible over the WebGL field", async () => {
  const css = await read("src/site/assets/site.css");
  const vignette = css.match(/\.vignette\{[^}]*\}/)[0];
  assert.match(vignette, /position:fixed/, "the vignette must cover the whole viewport");
  assert.match(vignette, /z-index:-1/, "the vignette must sit behind the content");
});
