import { access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const required = [
  "index.html",
  "gizlilik/index.html",
  "styles.css",
  "app.js",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "_headers",
];

let failed = 0;
for (const rel of required) {
  try {
    await access(join(dist, rel));
    console.log(`✓ ${rel}`);
  } catch {
    console.error(`✗ EKSİK: ${rel}`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} dosya eksik. Önce "npm run build" çalıştırın.`);
  process.exit(1);
}
console.log("\n✓ Tüm beklenen çıktılar mevcut.");
