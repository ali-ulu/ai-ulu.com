# Shipcraft site (ai-ulu)

Static EN (`/`) and TR (`/tr/`) site. Source: `content.mjs` (copy), `style.css`, `app.js`, `build.mjs`.

    node build.mjs   # writes dist/

`dist/` is the deployable output (upload its contents to the web root of the host).
`dist/templates/` holds the starter templates linked from the work panorama.
The contact form posts to `/form.php`, which is not implemented yet; the page falls back to WhatsApp.
