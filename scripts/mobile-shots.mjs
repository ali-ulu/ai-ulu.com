// Mobile preview: screenshots every page the way a phone scrolls it, in Chromium
// and WebKit, and lists anything wider than the screen.
// Usage: npm run shots:mobile [-- <base-url>]   (default: built dist/ on :8787)
//   node scripts/mobile-shots.mjs https://ai-ulu.com
// Output: test-results/mobile/<engine>-<width>/<page>-<n>.png
import { chromium, webkit } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir, rm } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "test-results", "mobile");
const PAGES = ["/", "/sss/", "/blog/", "/blog/web-sitesi-fiyatlari-2026/", "/calismalar/", "/hakkimizda/", "/checkup/", "/sablonlar/"];
const WIDTHS = [360, 390, 412];
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".json": "application/json" };

// Static server for dist/ so the preview needs no wrangler login.
function serveDist() {
  const dist = join(root, "dist");
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    try {
      const body = await readFile(join(dist, p));
      res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(8787, () => ok(server)));
}

const base = process.argv[2] || "http://localhost:8787";
const server = process.argv[2] ? null : await serveDist();
await rm(out, { recursive: true, force: true });
let problems = 0;

for (const [name, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch();
  for (const width of WIDTHS) {
    const dir = join(out, `${name}-${width}`);
    await mkdir(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 2, isMobile: name === "chromium", hasTouch: true });
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(base + path, { waitUntil: "networkidle" });
      const wide = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        // Carousels may run past the edge on purpose; only a page that scrolls sideways is broken.
        if (document.documentElement.scrollWidth <= vw) return [];
        return [...document.querySelectorAll("body *")]
          .filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.right > vw + 1 || r.left < -1) && !el.closest("[aria-hidden='true'], [data-overflow-ok]") && getComputedStyle(el).position !== "fixed"; })
          .filter((el, _, all) => !all.some((o) => o !== el && o.contains(el)))
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join(".")}`);
      });
      if (wide.length) { problems++; console.log(`✖ ${name} ${width} ${path} wider than screen: ${wide.join(", ")}`); }
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      const slug = path.replace(/\//g, "_").replace(/^_|_$/g, "") || "home";
      for (let y = 0, i = 0; y < height; y += 800, i++) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(300);
        await page.screenshot({ path: join(dir, `${slug}-${String(i).padStart(2, "0")}.png`) });
      }
    }
    await ctx.close();
  }
  await browser.close();
}
server?.close();
console.log(problems ? `${problems} page(s) overflow` : "✓ no horizontal overflow", `→ ${out}`);
process.exitCode = problems ? 1 : 0;
