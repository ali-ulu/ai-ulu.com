import { test, expect } from "@playwright/test";

// Visual regression: catch a CSS change that silently breaks layout. Only the
// stable, deterministic pages are snapshotted — the home page scrubs a 3D film
// on scroll, so it is excluded. The first run writes the baselines under
// e2e/visual.spec.js-snapshots/; commit them and later runs compare.
//
// Update baselines on purpose with: npx playwright test --update-snapshots
const PAGES = [
  { name: "calismalar", path: "/calismalar/" },
  { name: "blog", path: "/blog/" },
  { name: "gizlilik", path: "/gizlilik/" },
  { name: "kullanim-sartlari", path: "/kullanim-sartlari/" },
  { name: "404", path: "/bu-sayfa-yok/" },
];

test.describe("visual regression", () => {
  for (const { name, path } of PAGES) {
    test(`${name} looks the same`, async ({ page }, testInfo) => {
      // Baselines are engine-specific, so the snapshots only run on the desktop
      // chromium project. Mobile viewports are covered by the responsive test.
      test.skip(testInfo.project.name !== "chromium", "baselines are chromium-only");
      await page.goto(path);
      // The vortex backdrop is a time-based WebGL particle loop that runs on every
      // page, and Playwright's `animations` option only stops CSS animations, so
      // hide it or the raster differs on each run. body::before keeps the backdrop.
      await page.addStyleTag({ content: "#vortex{display:none!important}" });
      // Let fonts settle so the text raster is identical between runs.
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
