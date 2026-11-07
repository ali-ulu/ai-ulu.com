# ai-ulu.com — project memory

## What this is
New, from-scratch rebuild of ai-ulu.com (owner: Ali Ulu). Business/individual
website service. Owner picks a Framer template and adapts it per client.
Deploy target: **Cloudflare only**. The old site is intentionally forgotten.

## Repo / environment facts
- GitHub repo was **deleted and recreated** on 2026-11-07 (`ali-ulu/ai-ulu.com`).
  New `main` starts at orphan commit `efb1f4b` (README only); first real commit
  `968f229`. No old history.
- Old code (142 files, `3994fa7`) is only in the local container branch
  `backup-2026-11-07` — NOT on any remote. Use it if the owner asks to reuse
  old templates/copy.
- Live site (Cloudflare) was NOT touched: still serving the old build until the
  new deploy runs. D1 database `ai-ulu-leads` (`80c76947-...)` still holds old
  leads. Deleting the GitHub repo does not take the live site down.
- Deploy needs repo secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`;
  without them the workflow builds+verifies but skips deploy (warning).

## Architecture (new)
- Dependency-free static generator: `scripts/build.mjs` → `dist/`.
  Site source in `src/site/` (content, components, pages, assets).
- `src/worker.js`: `/api/lead` only (D1 insert + Email notify + rate limit +
  honeypot). Static assets served by Workers assets binding (`run_worker_first:
  ["/api/*"]`). `_headers` file sets CSP + security headers.
- System font stack (no font downloads). Design tokens in `src/site/assets/styles.css`.
- `npm test` = 9 worker unit tests (`test/worker.test.js`, fake D1/EMAIL).
  `npm run check` verifies build output. `node --test test/` does NOT work;
  use the glob `test/*.test.js`.

## Owner preferences
- Turkish-language site. Hates "çorba" (messy/inconsistent) design.
- Wants a clear funnel: land → impressive design → see templates → learn the
  process → know what to do → contact.
- No fake guarantees ("%100 garanti") talk.
- Strong on speed, security, SEO/GEO, personal-data protection (KVKK).
