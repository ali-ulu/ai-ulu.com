// "Kanıt zinciri" — hash-seeded generative field for the Package C portfolio hero.
// Pure function of (hash, width, height): no Math.random, no clock, no network.
// Contract (genart self-hosted): GenEser.features(hash), GenEser.draw(canvas, hash, W, H).
// seedFromHash + sfc32 follow the genart skill (github.com/camilleroux/genart-skill, MIT, see LICENSE-genart.txt);
// sfc32 itself is Chris Doty-Humphrey's public-domain PRNG from PractRand.
(function () {
  function seedFromHash(hash) {
    const hex = hash.replace(/^0x/i, "").padStart(64, "0").slice(-64);
    const s = new Uint32Array(4);
    for (let i = 0; i < 8; i++) {
      const w = parseInt(hex.slice(i * 8, i * 8 + 8), 16) >>> 0;
      s[i % 4] = (Math.imul(s[i % 4] ^ w, 0x9e3779b1) + i) >>> 0;
    }
    if (!(s[0] | s[1] | s[2] | s[3])) s[3] = 1;
    return s;
  }
  function sfc32([a, b, c, d]) {
    return function () {
      a |= 0; b |= 0; c |= 0; d |= 0;
      const t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }
  // Named sub-streams: adding a draw to one never shifts the others.
  function streams(hash) {
    const base = seedFromHash(hash);
    const make = (salt) => {
      const s = Uint32Array.from(base, (v, i) => (Math.imul(v ^ salt, 0x85ebca6b) + i * 0x27d4eb2f) >>> 0);
      const r = sfc32(s);
      for (let i = 0; i < 12; i++) r();
      return r;
    };
    return { traits: make(0x7a11), field: make(0xf1e1d), nodes: make(0x0de5), chains: make(0xc4a1) };
  }
  const pick = (r, table) => {
    let x = r() * table.reduce((a, [, w]) => a + w, 0);
    for (const [v, w] of table) if ((x -= w) < 0) return v;
    return table[table.length - 1][0];
  };

  function features(hash) {
    const r = streams(hash).traits;
    return {
      "Yoğunluk": pick(r, [["Seyrek", 3], ["Orta", 5], ["Sık", 2]]),
      "Akış": pick(r, [["Sakin", 5], ["Dalgalı", 4], ["Girdap", 1]]),
      "Doğrulanan zincir": pick(r, [["Bir", 7], ["İki", 3]]),
    };
  }

  function draw(canvas, hash, W, H) {
    const f = features(hash);
    const st = streams(hash);
    // willReadFrequently pins the CPU raster path from the first draw; otherwise the
    // first getImageData moves the canvas off the GPU and later renders differ by AA.
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = W; canvas.height = H;
    const u = Math.min(W, H) / 1000; // every length is in units of the short side

    ctx.fillStyle = "#0f1214";
    ctx.fillRect(0, 0, W, H);

    // flow field: sum of seeded sinusoids, cheap and identical on every engine
    const k = { Sakin: 1, "Dalgalı": 1.9, Girdap: 3.2 }[f["Akış"]];
    const waves = Array.from({ length: 4 }, () => ({
      fx: (0.6 + st.field() * 1.8) * k, fy: (0.6 + st.field() * 1.8) * k,
      ph: st.field() * Math.PI * 2, amp: 0.4 + st.field() * 0.6,
    }));
    const angle = (x, y) => {
      const nx = x / Math.min(W, H), ny = y / Math.min(W, H);
      let a = 0;
      for (const w of waves) a += w.amp * Math.sin(nx * w.fx * 6.283 + ny * w.fy * 4.1 + w.ph);
      return a * 1.3;
    };

    // record grid, jittered
    const step = { Seyrek: 58, Orta: 44, "Sık": 34 }[f["Yoğunluk"]] * u;
    const nodes = [];
    for (let y = step * 0.5; y < H; y += step)
      for (let x = step * 0.5; x < W; x += step)
        nodes.push({ x: x + (st.nodes() - 0.5) * step * 0.5, y: y + (st.nodes() - 0.5) * step * 0.5 });

    ctx.fillStyle = "rgba(201,207,207,0.16)";
    for (const n of nodes) ctx.fillRect(n.x - 1.2 * u, n.y - 1.2 * u, 2.4 * u, 2.4 * u);

    const trace = (sx, sy, len) => {
      const pts = [[sx, sy]];
      let x = sx, y = sy;
      for (let i = 0; i < len; i++) {
        const a = angle(x, y);
        x += Math.cos(a) * step * 0.9; y += Math.sin(a) * step * 0.9;
        if (x < -step || y < -step || x > W + step || y > H + step) break;
        pts.push([x, y]);
      }
      return pts;
    };
    const stroke = (pts, style, width) => {
      ctx.strokeStyle = style; ctx.lineWidth = width; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    };

    // unverified chains: many, thin, quiet
    const chainCount = Math.round((W * H) / (step * step) / 9);
    for (let i = 0; i < chainCount; i++) {
      const pts = trace(st.chains() * W, st.chains() * H, 4 + Math.floor(st.chains() * 14));
      stroke(pts, "rgba(201,207,207,0.22)", 1 * u);
      ctx.fillStyle = "rgba(201,207,207,0.45)";
      for (const [x, y] of pts) ctx.fillRect(x - 2 * u, y - 2 * u, 4 * u, 4 * u);
    }

    // verified chains: long, accent, every record sealed with an outlined square
    const verified = f["Doğrulanan zincir"] === "İki" ? 2 : 1;
    for (let v = 0; v < verified; v++) {
      const pts = trace(W * (0.55 + st.chains() * 0.35), H * (0.15 + st.chains() * 0.7), 26);
      stroke(pts, "rgba(224,164,88,0.18)", 9 * u);
      stroke(pts, "#e0a458", 1.8 * u);
      for (const [x, y] of pts) {
        ctx.fillStyle = "#0f1214"; ctx.fillRect(x - 5 * u, y - 5 * u, 10 * u, 10 * u);
        ctx.strokeStyle = "#e0a458"; ctx.lineWidth = 1.4 * u; ctx.strokeRect(x - 5 * u, y - 5 * u, 10 * u, 10 * u);
      }
    }
    return f;
  }

  window.GenEser = { features, draw };
})();
