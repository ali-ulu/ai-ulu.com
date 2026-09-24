#!/usr/bin/env bash
# Build the Zeyra demo with scrollcraft, localise the engine's fixed strings, publish to ../
set -euo pipefail
cd "$(dirname "$0")"
SC="${SCROLLCRAFT_DIR:-$HOME/.claude/skills/scrollcraft}"
node "$SC/scripts/build-site.mjs" --spec scrollcraft.json --out dist
python - <<'PY'
p='dist/index.html'; h=open(p,encoding='utf-8').read()
h=h.replace('This site animates a frame sequence as you scroll and needs JavaScript enabled.',
            'Bu sayfa kaydırdıkça ilerleyen bir görüntü dizisi kullanır; JavaScript açık olmalı.')
h=h.replace('<body>','<body>\n  <a class="geri" href="../">← Örnekler</a>',1)
h=h.replace('<head>','<head>\n<!-- Built with the ScrollCraft engine, Copyright (c) 2026 ScrollCraft, MIT License. See LICENSE-scrollcraft.txt. -->\n<link rel="icon" href="data:,">',1)
assert 'class="geri"' in h and 'MIT License' in h
open(p,'w',encoding='utf-8').write(h)
PY
rm -rf ../frames ../frames-mobile ../assets
cp -r dist/. ../
cp LICENSE-scrollcraft.txt ../
