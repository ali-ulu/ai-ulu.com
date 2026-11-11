import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFile(join(root, rel), "utf8");

test("the e2e suite covers more than one engine and a phone viewport", async () => {
  const cfg = await read("playwright.config.js");
  assert.match(cfg, /devices\["Desktop Firefox"\]/, "firefox must be in the matrix");
  assert.match(cfg, /devices\["Desktop Safari"\]/, "webkit must be in the matrix");
  assert.match(cfg, /devices\["Pixel 7"\]/, "a phone viewport must be in the matrix");
  assert.match(cfg, /devices\["iPhone 14"\]/, "an iPhone viewport must be in the matrix");
});

test("cross-engine projects run only the tagged tests", async () => {
  const cfg = await read("playwright.config.js");
  // Without the grep, firefox/webkit would run the whole suite and triple CI time.
  assert.match(cfg, /grep:\s*\/@crossbrowser\//);
});

test("a browser that is not installed is skipped, not failed", async () => {
  const cfg = await read("playwright.config.js");
  assert.match(cfg, /hasFirefox\s*\?/, "firefox project must be conditional");
  assert.match(cfg, /hasWebkit\s*\?/, "webkit project must be conditional");
});

test("visual regression baselines are committed for the stable pages", async () => {
  const spec = await read("e2e/visual.spec.js");
  assert.match(spec, /toHaveScreenshot/, "the visual spec must compare screenshots");
  // The home page has a live WebGL hero, so it must stay out of the snapshots.
  assert.doesNotMatch(spec, /path:\s*"\/"\s*,/, "the animated home page must not be snapshotted");
});

test("CI installs every browser the matrix uses", async () => {
  const yml = await read(".github/workflows/deploy.yml");
  assert.match(
    yml,
    /npx playwright install --with-deps chromium firefox webkit/,
    "CI must install all three engines",
  );
});
