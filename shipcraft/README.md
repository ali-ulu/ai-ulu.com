# ai-ulu site

Static EN (`/`) and TR (`/tr/`) site. Source: `content.mjs` (all copy), `style.css`, `app.js`, `build.mjs`.

    node build.mjs   # writes dist/

`dist/` is the deployable output and is not committed. `.github/workflows/deploy.yml`
builds it and uploads it to the hosting docroot over FTP on every push to `main`.
`dist/templates/` holds the starter templates linked from the work panorama.

`hosting/` holds the files that only the web host serves; the build copies them into `dist/`
so uploading `dist/` is the whole deploy:

- `form.php` — contact form handler. Accepts JSON POST, appends every lead to `leads/leads.jsonl`,
  emails `aliulu@ai-ulu.com`, and rate-limits per IP. `app.js` falls back to WhatsApp if it fails.
- `htaccess` → `dist/.htaccess` — disables directory listing, blocks dotfiles and source
  artefacts, sets compression and cache headers.
- `leads/.htaccess` — keeps the lead store unreachable over HTTP.

The deploy needs `FTP_SERVER`, `FTP_USERNAME` and `FTP_PASSWORD` repository secrets.
