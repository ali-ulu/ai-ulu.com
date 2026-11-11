import { defineConfig, devices } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";

// Playwright's own download can be unavailable (offline sandboxes); when a system
// Chromium is present we point at it instead, which also needs --no-sandbox
// because the container has no user namespaces. CI installs the bundled browser
// and this override is skipped.
const systemChromium = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
].find((p) => p && existsSync(p));

// The system-chromium override only applies to Chromium-based projects. Pointing
// Firefox or WebKit at a Chromium binary makes the launch hang until it times
// out, so those keep Playwright's own build. `--no-sandbox` is a Chromium and
// Firefox flag; WebKit rejects an unknown option, so it gets no args at all.
const chromiumLaunch = systemChromium
  ? { executablePath: systemChromium, args: ["--no-sandbox"] }
  : {};
const firefoxLaunch = { args: ["--no-sandbox"] };
const webkitLaunch = {};

// A sandbox may not have every Playwright browser downloaded (or the shared
// libraries they need). Rather than fail the whole suite, a project only joins
// the matrix when its browser is actually installed. `npx playwright install
// --with-deps` in CI installs all three.
const cacheDir = process.env.PLAYWRIGHT_BROWSERS_PATH || `${process.env.HOME}/.cache/ms-playwright`;
const installed = (prefix) => {
  try {
    return readdirSync(cacheDir).some((d) => d.startsWith(prefix));
  } catch {
    return false;
  }
};
const hasFirefox = installed("firefox-");
const hasWebkit = installed("webkit-");

// Cross-browser behaviour tests are tagged @crossbrowser so the extra engines
// run only those, keeping the matrix fast. Mobile viewports run the whole suite.
const projects = [
  { name: "chromium", use: { ...devices["Desktop Chrome"], launchOptions: chromiumLaunch } },
  ...(hasFirefox ? [{ name: "firefox", use: { ...devices["Desktop Firefox"], launchOptions: firefoxLaunch }, grep: /@crossbrowser/ }] : []),
  ...(hasWebkit ? [{ name: "webkit", use: { ...devices["Desktop Safari"], launchOptions: webkitLaunch }, grep: /@crossbrowser/ }] : []),
  { name: "mobile-chrome", use: { ...devices["Pixel 7"], launchOptions: chromiumLaunch } },
  ...(hasWebkit ? [{ name: "mobile-safari", use: { ...devices["iPhone 14"], launchOptions: webkitLaunch } }] : []),
];

// E2E runs against the built dist/ served by scripts/serve.mjs, which mirrors the
// Cloudflare assets binding (index.html for directories, 404.html for unknowns)
// and stubs /api/*.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "list" : "line",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  projects,
  webServer: {
    command: "node scripts/serve.mjs",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
