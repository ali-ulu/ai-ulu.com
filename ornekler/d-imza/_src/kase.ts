import { Gfx, rng, type Ctx, type Env, type Medium, type P } from "./core";
import type { Film } from "./film";
import { blob, clamp, clipped, fillShape, mix, smooth } from "./gallery";

// KİL & KÜL · a thrown bowl, drawn as you scroll. Ink + line-wash, after wren.ts: the washes go
// down first and wet, flooding a little past where the line will be, pigment pooling along the
// bottom edge of each shape. Then a flexible nib: pressed hard on the shade side (right, under),
// lifted to a hair where the light from the upper left eats the rim. The last mark is the potter's
// seal, stamped in cinnabar.
//
// The subject is a stoneware bowl still on the wheel head, seen from about 25 degrees above:
// rim an ellipse, the wall flaring from a narrow foot ring, throwing rings following the wall.
// The inside is dipped in an ash-celadon glaze; the outside was dipped to a third of its height,
// so the glaze line sits high on the wall with a few runs below it and bare toasted clay beneath.
// Wet slip lies on the wheel head where the potter's hands threw off water.
//
// Scroll owns the clock: frame f is the drawing after f/149 of the hand's work. Every wash spreads
// out from the point where the brush touched (a growing clip), every line is drawn with
// pen.progress, so reversing the scroll un-makes the picture in the same order. Frame 149 is the
// finished still.

const INK_M: Medium = { nib: 1.7, taper: 1, pressure: 1.75, retrace: false, wobble: 1.2, rough: 0.6 };
const INK = "#1c1712", PAPER = "#fbf8f0";
const CLAY = "#b7794a", CLAYD = "#7a4a2a", GLAZE = "#8fa89a", GLAZED = "#5f7a6c", WHEEL = "#8a8784", SLIP = "#c4ab8e", SEAL = "#b8412e";

const N = 150;
// ONE cue table. [start, end) in frames, all on multiples of 5; checked at load below.
const CUE = {
  wheelWash: [0, 25], slip: [15, 35], clayWash: [20, 45], glazeOut: [35, 55], glazeIn: [45, 65], shadow: [55, 70],
  wheelLine: [60, 80], wallL: [75, 95], wallR: [80, 100], rimFront: [95, 110], rimBack: [100, 115], foot: [105, 115],
  dip: [110, 125], rings: [115, 135], splash: [125, 140], seal: [135, 145],
} as const;
for (const [k, [a, b]] of Object.entries(CUE)) if (a % 5 || b % 5 || b <= a || b > N) throw new Error(`cue ${k} off the grid`);
const prog = (f: number, [a, b]: readonly [number, number]) => (f >= N - 1 ? 1 : clamp((f - a) / (b - a)));
const ease = (t: number) => 1 - (1 - t) ** 2.2;   // a stroke starts fast and slows into its end

// ---------------------------------------------------------------- geometry
const CX = 540;
const RIM = { y: 400, rx: 250, ry: 60 };
const FOOT = { y: 690, rx: 92, ry: 22 };
const WH = { y: 712, rx: 350, ry: 84, t: 22 };                         // wheel head top ellipse and its thickness
// the wall's outline on the left, rim to foot; the right side mirrors it
const WALL: P[] = smooth([[CX - RIM.rx, RIM.y], [CX - 246, 460], [CX - 226, 530], [CX - 186, 600], [CX - 132, 660], [CX - FOOT.rx, FOOT.y]], false, 10);
const mirror = (pts: P[]): P[] => pts.map(([x, y]) => [2 * CX - x, y]);
const halfAt = (y: number) => { // wall half-width at height y, read off the outline
  for (let i = 1; i < WALL.length; i++) if (WALL[i][1] >= y) { const [x0, y0] = WALL[i - 1], [x1, y1] = WALL[i], t = (y - y0) / (y1 - y0 || 1); return CX - (x0 + (x1 - x0) * t); }
  return FOOT.rx;
};
const ell = (cy: number, rx: number, ry: number, a0: number, a1: number, n = 40): P[] => Array.from({ length: n }, (_, i) => { const a = a0 + ((a1 - a0) * i) / (n - 1); return [CX + Math.cos(a) * rx, cy + Math.sin(a) * ry] as P; });
const body = (): P[] => [...WALL, ...ell(FOOT.y, FOOT.rx, FOOT.ry, Math.PI, 0, 16), ...mirror(WALL).reverse(), ...ell(RIM.y, RIM.rx, RIM.ry, 0, Math.PI, 30)];
const DIP_Y = 510;                                                      // outside glaze line
const dipLine = (): P[] => { const r = rng(7), rx = halfAt(DIP_Y), ry = RIM.ry * (rx / RIM.rx); return ell(DIP_Y, rx, ry, 0.05, Math.PI - 0.05, 36).map(([x, y]) => [x, y + (r() - 0.5) * 5] as P); };

// ---------------------------------------------------------------- wet media, revealed as they spread
const spread = (g: Gfx, at: P, t: number, reach: number, fn: () => void) => { if (t <= 0) return; const R = 8 + ease(t) * reach; clipped(g, blob(at[0], at[1], R, R * 0.8, Math.round(at[0] + at[1]), 0.28, 26), fn); };   // a wet front is ragged, never an arc
const wet = (g: Gfx, pts: P[], color: string, alpha: number, seed: number, pool = 0.6) => {
  g.wash(pts, color, { alpha, seed, dx: 6, dy: 6, shrink: 1.06, rim: true });
  let y0 = Infinity, y1 = -Infinity, x0 = Infinity, x1 = -Infinity; for (const [x, y] of pts) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  clipped(g, pts, () => { const c = g.cur, gr = c.createLinearGradient(0, y0 + (y1 - y0) * 0.45, 0, y1 + 2); const a = (v: number) => Math.round(255 * clamp(v)).toString(16).padStart(2, "0"); gr.addColorStop(0, color + "00"); gr.addColorStop(1, color + a(alpha * pool)); c.fillStyle = gr; c.fillRect(x0 - 20, y0, x1 - x0 + 40, y1 - y0 + 20); });
};

const washes = (g: Gfx, f: number) => {
  g.group("paint", () => {
    // wheel head: cool grey, laid from the far left where the brush first touched
    spread(g, [CX - 330, WH.y], prog(f, CUE.wheelWash), 720, () => {
      const top = ell(WH.y, WH.rx, WH.ry, 0, Math.PI * 2, 60), edge = [...ell(WH.y, WH.rx, WH.ry, 0, Math.PI, 30), ...ell(WH.y + WH.t, WH.rx, WH.ry, Math.PI, 0, 30)];
      wet(g, top, WHEEL, 0.32, 11, 0.35); wet(g, edge, mix(WHEEL, INK, 0.3), 0.45, 12, 0.8);
    });
    // throw-off slip: a muddy drift pooled towards the front of the wheel
    spread(g, [CX + 180, WH.y + 40], prog(f, CUE.slip), 470, () => { wet(g, blob(CX + 150, WH.y + 42, 150, 26, 13, 0.4, 18), SLIP, 0.45, 13, 0.9); wet(g, blob(CX - 210, WH.y + 30, 70, 14, 14, 0.4, 12), SLIP, 0.35, 14, 0.9); });
    // the clay: toasted stoneware, the whole body, from the light side
    spread(g, [CX - 220, 460], prog(f, CUE.clayWash), 520, () => { wet(g, body(), CLAY, 0.6, 21, 0.85); });
    // outside glaze: dipped to DIP_Y, with runs
    spread(g, [CX - 240, 420], prog(f, CUE.glazeOut), 540, () => {
      const dl = dipLine(), band = [...WALL.filter(([, y]) => y <= DIP_Y), ...dl.slice().reverse(), ...mirror(WALL).filter(([, y]) => y <= DIP_Y).reverse(), ...ell(RIM.y, RIM.rx, RIM.ry, 0, Math.PI, 30)];
      wet(g, smooth(band, true, 4), GLAZE, 0.62, 31, 0.9);
      [[CX - 150, 22], [CX - 40, 34], [CX + 70, 18], [CX + 170, 26]].forEach(([x, len], i) => { const y = DIP_Y + RIM.ry * 0.9 * Math.sin(Math.acos(clamp((x - CX) / halfAt(DIP_Y), -1, 1))); wet(g, blob(x, y + len / 2, 7, len / 2 + 4, 40 + i, 0.2, 10), GLAZED, 0.55, 40 + i, 1); });
    });
    // inside glaze: the far inner wall and the well, darker where it pools at the bottom
    spread(g, [CX, RIM.y], prog(f, CUE.glazeIn), 300, () => {
      wet(g, ell(RIM.y, RIM.rx - 8, RIM.ry - 5, 0, Math.PI * 2, 60), GLAZE, 0.5, 51, 0.3);
      wet(g, ell(RIM.y + 6, RIM.rx - 70, RIM.ry - 28, 0, Math.PI * 2, 40), GLAZED, 0.5, 52, 0.5);
    });
    // cast shadow on the wheel head, down and to the right, away from the upper-left light
    spread(g, [CX + 140, FOOT.y + 10], prog(f, CUE.shadow), 380, () => { wet(g, blob(CX + 90, FOOT.y + 16, 190, 30, 61, 0.2, 18), mix(WHEEL, INK, 0.55), 0.35, 61, 0.9); });
  });
};

// ---------------------------------------------------------------- the pen
const lines = (g: Gfx, f: number) => {
  const pen = (pts: P[], w: number, seed: number, t: number, op = 0.95, wob = 0.9) => { if (t > 0) g.pen(pts, { w, color: INK, seed, wobble: wob, boil: 0, taper: 1, opacity: op, retrace: false, progress: ease(t) }); };
  g.group("plain", () => {
    // wheel head rim: the front edge pressed, the back edge light and broken
    const tw = prog(f, CUE.wheelLine);
    pen(ell(WH.y, WH.rx, WH.ry, Math.PI * 0.96, Math.PI * 0.04, 40).reverse(), 2.8, 101, tw);
    pen(ell(WH.y, WH.rx, WH.ry, Math.PI * 1.1, Math.PI * 1.55, 20), 1.2, 102, tw, 0.6);
    pen(ell(WH.y, WH.rx, WH.ry, Math.PI * 1.7, Math.PI * 1.95, 12), 1.2, 103, tw, 0.6);
    pen(ell(WH.y + WH.t, WH.rx, WH.ry, Math.PI * 0.9, Math.PI * 0.1, 36).reverse(), 1.8, 104, tw, 0.8);
    // walls: left leads, drawn rim to foot; the right (shade) side pressed harder
    pen(WALL, 2.2, 111, prog(f, CUE.wallL), 0.85);
    pen(mirror(WALL), 3.8, 112, prog(f, CUE.wallR));
    // rim: front arc firm, back arc a hair where the light eats it, left open at the lit shoulder
    pen(ell(RIM.y, RIM.rx, RIM.ry, Math.PI * 0.98, Math.PI * 0.02, 44).reverse(), 3, 121, prog(f, CUE.rimFront));
    pen(ell(RIM.y, RIM.rx, RIM.ry, Math.PI * 1.22, Math.PI * 1.98, 34), 1.1, 122, prog(f, CUE.rimBack), 0.7);
    pen(ell(RIM.y + 7, RIM.rx - 10, RIM.ry - 6, Math.PI * 1.05, Math.PI * 1.6, 20), 0.8, 123, prog(f, CUE.rimBack), 0.45);   // inner lip
    // foot ring: only its front shows under the wall
    pen(ell(FOOT.y, FOOT.rx, FOOT.ry, Math.PI * 0.85, Math.PI * 0.15, 20).reverse(), 2.6, 131, prog(f, CUE.foot));
    // glaze line and its runs
    pen(dipLine(), 1.4, 141, prog(f, CUE.dip), 0.75, 0.6);
    // throwing rings: front arcs at several heights, each a little behind the one above
    [440, 475, 555, 590, 625].forEach((y, i) => {
      const rx = halfAt(y), ry = RIM.ry * (rx / RIM.rx), t = clamp(prog(f, CUE.rings) * 1.6 - i * 0.15);
      pen(ell(y, rx - 3, ry, Math.PI * 0.82, Math.PI * 0.18, 26).reverse(), 0.9 + (i % 2) * 0.3, 151 + i, t, 0.5, 0.5);
    });
    // splash flicks on the wheel head and a few spatters
    const ts = prog(f, CUE.splash), r = rng(161);
    for (let i = 0; i < 9; i++) { const a = Math.PI * (0.15 + r() * 0.7), rr = 150 + r() * 150, x = CX + Math.cos(a) * rr, y = WH.y + Math.sin(a) * rr * 0.24 - 4; pen([[x, y], [x + 12 + r() * 10, y + 2 + r() * 4]], 1 + r(), 162 + i, clamp(ts * 1.8 - i * 0.09), 0.55, 0.3); }
    if (ts > 0) { const rs = rng(180); for (let i = 0; i < 14; i++) { const x = 200 + rs() * 680, y = 280 + rs() * 560, big = rs() < 0.25; if (i / 14 > ts) break; if (Math.abs(x - CX) < 270 && y < 730 && y > 330) continue; fillShape(g, blob(x, y, big ? 3.4 : 1.4 + rs(), big ? 2.8 : 1.2 + rs() * 0.8, 190 + i, 0.3, 8), INK, 0.75); } }
  });
  // the seal: cinnabar square, stamped (a stamp arrives whole; it does not draw itself)
  const s = prog(f, CUE.seal);
  if (s > 0) g.group("plain", () => {
    const x = 846, y = 812, k = 34, sq: P[] = [[x - k, y - k], [x + k, y - k + 2], [x + k - 1, y + k], [x - k + 1, y + k - 1]];
    const c = g.cur; c.save(); c.translate(x, y); const sc = 1 + (1 - s) * 0.35; c.scale(sc, sc); c.translate(-x, -y);
    fillShape(g, sq, SEAL, 0.85 * s);
    // "K" and "K": two cut strokes each, paper left bare
    const cut = (pts: P[]) => { c.strokeStyle = PAPER; c.globalAlpha = 0.95 * s; c.lineWidth = 5; c.lineCap = "square"; c.beginPath(); pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))); c.stroke(); c.globalAlpha = 1; };
    for (const ox of [-15, 13]) { cut([[x + ox - 6, y - 20], [x + ox - 6, y + 20]]); cut([[x + ox + 9, y - 20], [x + ox - 5, y], [x + ox + 10, y + 20]]); }
    c.restore();
  });
};

export const drawKase = (ctx: Ctx, f: number, env: Env) => {
  const g = new Gfx(ctx, env, 0, INK_M);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, 1080, 1080);
  washes(g, f);
  lines(g, f);
  g.paper("coldpress", 0.16);
  g.paper("paper", 0.08);
};

export const kase: Film = {
  meta: { title: "Kil & Kül · kase", W: 1080, H: 1080, fps: 30, bpm: 120, durationFrames: N },
  assets: { images: {} },
  shots: [{ id: "kase", start: 0, end: N, draw: drawKase }],
};
