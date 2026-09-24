# Kil & Kül · kase çizimi

`kase.ts` is an [anidoodle](https://github.com/alexgreensh/anidoodle) film (150 frames, ink + line-wash).
`scroll-kase.ts` is a scroll host for it: no player, no keyboard, runs in a Worker on an
OffscreenCanvas and draws only the newest requested frame.

Rebuild `../kase.js` and the no-JS poster `../kase-son.webp`:

```bash
node <anidoodle>/engine/tools/scaffold.mjs /tmp/kase --film kase
cp kase.ts /tmp/kase/src/canvas-core/ && cp scroll-kase.ts /tmp/kase/src/hosts/
cd /tmp/kase && npm install --omit=optional
node tools/gate.mjs kase                        # determinism + contract
npx esbuild src/hosts/scroll-kase.ts --bundle --format=iife --minify --target=es2020 --outfile=<repo>/ornekler/d-imza/kase.js
node tools/still.mjs kase --frame 149 --out out/look.png
ffmpeg -i out/look.png -vf scale=900:-1 -quality 82 <repo>/ornekler/d-imza/kase-son.webp
```

The chapter ranges in `../index.html` (`RANGES`) mirror the cue table in `kase.ts`; change both together.
