# ai-ulu site

Static EN (`/`) and TR (`/tr/`) site. Source: `content.mjs` (all copy), `style.css`, `app.js`, `build.mjs`.

    node build.mjs   # writes dist/

`dist/` is the deployable output and is not committed; `.github/workflows/deploy.yml`
builds it and publishes it to GitHub Pages on every push to `main`.
`dist/templates/` holds the starter templates linked from the work panorama.
The contact form posts to `/form.php`, served by the host; if it is unreachable the page falls back to WhatsApp.
