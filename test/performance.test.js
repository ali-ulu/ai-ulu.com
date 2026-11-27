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
test("the loader never waits on the film clip", async () => {
  const js = await read("src/site/assets/ora.js");
  // finishPre must run before the clip fetch, otherwise the screen-covering
  // overlay delays the first paint and the hero stops being the LCP element.
  const firstFinish = js.indexOf("finishPre()");
  const firstFetch = js.indexOf("fetch('/img/film.mp4')");
  assert.ok(firstFinish > -1, "ora.js must hide the preloader");
  assert.ok(firstFetch > -1, "ora.js must still load the film");
  assert.ok(firstFinish < firstFetch, "the preloader must be dismissed before the film loads");
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

test("the hero and film copy stand on solid ground, not a vignette", async () => {
  const css = await read("src/site/assets/site.css");
  assert.match(css, /\.vignette\{display:none\}/, "the vignette layer is gone");
  assert.match(css, /\.hero-panel\{[^}]*background:#141518/, "the hero title sits on a flat panel");
  assert.match(css, /\.ch\{[^}]*background:var\(--ink\)/, "film chapters sit on a solid ground");
  assert.match(css, /\.tag\{[^}]*background:var\(--ink\)/, "film labels sit on a solid ground");
});

test("the film clip may be decoded from a Blob", async () => {
  const build = await read("scripts/build.mjs");
  // ora.js seeks a Blob URL for instant scrubbing; without blob: the CSP blocks it.
  assert.match(build, /media-src 'self' blob:/);
});

test("the WebGL film and vortex start on first interaction, not at load", async () => {
  // Desktop Lighthouse: vortex 1.6 s + film 0.5 s of main-thread time at load
  // (TBT 1,240 ms, score 70). Neither may start before a person moves, scrolls or types.
  for (const rel of ["src/site/assets/ora.js", "src/site/assets/vortex.js"]) {
    const js = await read(rel);
    for (const ev of ["pointermove", "scroll", "keydown", "touchstart"]) {
      assert.ok(js.includes(`"${ev}"`) || js.includes(`'${ev}'`), `${rel} must start on ${ev}`);
    }
  }
  assert.doesNotMatch(await read("src/site/assets/ora.js"), /if \(canRunFilm\) whenIdle\(loadFilm\)/, "the film must not load on idle at page load");
});
