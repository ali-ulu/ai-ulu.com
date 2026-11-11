import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFile(join(root, rel), "utf8");
const built = existsSync(join(root, "dist/index.html"));

// The home page scores 53 on Lighthouse mobile when the WebGL film and the
// particle field run on a phone: between them they block the main thread for
// ~20 s. These tests pin the two fixes that took it to 91 with no visual change
// on desktop and no layout shift anywhere.
test("the loader never waits on the 3D bundle", async () => {
  const js = await read("src/site/assets/ora.js");
  // finishPre must run before the three.js import, otherwise the screen-covering
  // overlay delays the first paint and the hero stops being the LCP element.
  const firstFinish = js.indexOf("finishPre()");
  const firstImport = js.indexOf("import('/vendor/three");
  assert.ok(firstFinish > -1, "ora.js must hide the preloader");
  assert.ok(firstImport > -1, "ora.js must still load the film");
  assert.ok(firstFinish < firstImport, "the preloader must be dismissed before the 3D import");
});

test("the 3D film and vortex are skipped on small screens", async () => {
  for (const rel of ["src/site/assets/ora.js", "src/site/assets/vortex.js"]) {
    const js = await read(rel);
    assert.match(js, /min-width:\s*768px/, `${rel} must gate the heavy scene on screen width`);
    assert.match(js, /saveData/, `${rel} must honour Data Saver`);
    assert.match(js, /deviceMemory/, `${rel} must skip low-memory devices`);
  }
});

test("a phone gets the static chapter column before the first paint", async () => {
  const css = await read("src/site/assets/site.css");
  // A class added after paint would shift the layout (CLS); the media query makes
  // the flattening part of the first render instead.
  const phone = css.match(/@media \(max-width:767px\)\{[\s\S]*?\n\}/);
  assert.ok(phone, "site.css needs a phone block");
  for (const sel of ["#pre{display:none}", ".stage{position:static", "#gl,.tag,.prog,.hint{display:none}"]) {
    assert.ok(phone[0].includes(sel), `the phone block must contain ${sel}`);
  }
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
