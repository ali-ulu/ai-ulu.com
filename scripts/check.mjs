import { access, readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../src/site/config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const required = [
  "index.html",
  "gizlilik/index.html",
  "sablonlar/index.html",
  "site.css",
  "ora.js",
  "app.js",
  "fonts/fonts.css",
  "vendor/three/three.module.min.js",
  "img/gulus.webp",
  "og.png",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "_headers",
  `${site.indexNowKey}.txt`,
];

let failed = 0;
const fail = (msg) => { console.error(`✗ ${msg}`); failed++; };

for (const rel of required) {
  try {
    await access(join(dist, rel));
    console.log(`✓ ${rel}`);
  } catch {
    fail(`EKSİK: ${rel}`);
  }
}

// The CSP only allows this origin, so any third-party script/style/font/image URL would break in production.
async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else if (/\.(html|css)$/.test(entry.name)) yield full;
  }
}
const external = /(?:src|href)=["'](https?:)?\/\/(?!ai-ulu\.com)[^"']+["']|url\((["']?)(https?:)?\/\/[^)]+\)/g;
const allowedLink = /href=["']https:\/\/wa\.me\//;
for await (const file of files(dist)) {
  const text = await readFile(file, "utf8");
  for (const match of text.match(external) ?? []) {
    if (allowedLink.test(match)) continue;
    const isAsset = !/^href=/.test(match) || /\.(css|js|woff2?|png|jpe?g|webp|svg)["']/.test(match);
    if (isAsset) fail(`dış kaynak (CSP bunu engeller): ${match} → ${file.slice(dist.length + 1)}`);
  }
}

if (failed) {
  console.error(`\n${failed} sorun var. Önce "npm run build" çalıştırın ve düzeltin.`);
  process.exit(1);
}
console.log("\n✓ Tüm beklenen çıktılar mevcut, dış kaynak yok.");
