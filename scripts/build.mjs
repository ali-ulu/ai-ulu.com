import { mkdir, writeFile, rm, cp, readFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pages, renderPage } from "../src/site/pages.mjs";
import { site } from "../src/site/config.mjs";
import { faq } from "../src/site/content/site-content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const assets = join(root, "src", "site", "assets");

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function write(rel, content) {
  const target = join(dist, rel);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function copy(relFrom, relTo) {
  const from = join(assets, relFrom);
  if (!(await exists(from))) return false;
  const to = join(dist, relTo);
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to);
  return true;
}

async function build() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  // Pages
  for (const p of pages) {
    await write(p.file, renderPage(p));
  }

  // Assets
  await copy("styles.css", "styles.css");
  await copy("app.js", "app.js");
  await copy("favicon.svg", "favicon.svg");
  await copy("og.svg", "og.svg");

  // robots.txt
  await write("robots.txt", `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`);

  // sitemap.xml
  const urls = pages.map((p) => `  <url><loc>${site.url}${p.path}</loc></url>`).join("\n");
  await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);

  // llms.txt (GEO: helps AI assistants cite the site correctly)
  await write("llms.txt", `# ${site.name}

> ${site.description}

## Sayfalar
- Ana sayfa: ${site.url}/
- Gizlilik: ${site.url}/gizlilik/

## İletişim
- E-posta: ${site.email}

## SSS
${faq.items.map((f) => `- ${f.q} ${f.a}`).join("\n")}
`);

  // Security headers (Cloudflare Pages/Workers _headers file)
  await write("_headers", `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'none'
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/styles.css
  Cache-Control: public, max-age=31536000, immutable

/app.js
  Cache-Control: public, max-age=31536000, immutable

/favicon.svg
  Cache-Control: public, max-age=604800
`);

  const count = pages.length;
  console.log(`✓ build: ${count} sayfa + assets → dist/`);
}

build().catch((err) => {
  console.error("build failed:", err);
  process.exit(1);
});
