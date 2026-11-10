import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFile(join(root, rel), "utf8");

test("vortex background loads only on the home page", async () => {
  const home = await read("dist/index.html");
  assert.match(home, /<script type="module" src="\/vortex\.js">/, "home must load vortex.js");
  assert.match(home, /<canvas id="vortex"/, "home must contain the vortex canvas");
  const privacy = await read("dist/gizlilik/index.html");
  assert.doesNotMatch(privacy, /vortex\.js|id="vortex"/, "other pages must stay clean");
});

test("vortex canvas sits behind the 3D film so the front is untouched", async () => {
  const home = await read("dist/index.html");
  const vortex = home.indexOf('id="vortex"');
  const film = home.indexOf('id="gl"');
  assert.ok(vortex > -1 && film > -1 && vortex < film, "vortex must come before #gl in the DOM");
});

test("vortex module degrades gracefully", async () => {
  const js = await read("src/site/assets/vortex.js");
  assert.match(js, /getContext\("webgl"/, "must request a WebGL context");
  assert.match(js, /prefers-reduced-motion: reduce/, "must honour reduced motion");
  assert.match(js, /canvas\.remove\(\)/, "must remove the canvas when WebGL is unavailable");
  assert.doesNotMatch(js, /https?:\/\//, "must not pull any external resource (CSP is 'self' only)");
});
