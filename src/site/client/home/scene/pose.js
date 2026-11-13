// Pure choreography: scroll progress (0–1) in, a pose out. No DOM, no WebGL,
// so the same numbers drive the renderer and the unit test (test/home-scene.test.js).
//
// The object is a stack of four sheets, top to bottom: design, speed,
// visibility, conversion. Chapter 0 is the closed stack; chapters 1–4 each pull
// one sheet out toward the viewer.

export const LAYERS = 4;
// Where each chapter rests. The rail scrolls to these; chapters.js fades copy around them.
export const STOPS = [0, 0.25, 0.5, 0.75, 1];
// [fade-in, fade-out] progress per chapter (also emitted as data-a / data-b in home.mjs).
export const RANGES = [[0, 0.1], [0.17, 0.33], [0.42, 0.58], [0.67, 0.83], [0.92, 1.01]];

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);
export const seg = (p, a, b) => ease(clamp((p - a) / (b - a)));

// How far sheet i is pulled out (0–1) at progress p. The last sheet stays out:
// the film ends on the conversion layer, next to the call to action.
export function pull(i, p) {
  const [a, b] = RANGES[i + 1];
  const rise = seg(p, a - 0.07, a + 0.02);
  return i === LAYERS - 1 ? rise : rise * (1 - seg(p, b - 0.02, b + 0.07));
}

// Camera keyframes: [progress, yaw°, pitch°, distance, side]. `side` slides the
// stack away from the copy column on wide screens (+1 = stack on the right).
const KEYS = [
  [0.0, -30, 34, 10.8, 1],
  [0.25, -24, 46, 11.4, 1],
  [0.5, 26, 36, 11.4, -1],
  [0.75, -26, 34, 11.4, 1],
  [1.0, 24, 38, 11, -1],
];

const GAP_CLOSED = 0.09;
const GAP_OPEN = 0.58;

export function pose(p, portrait = false) {
  p = clamp(p);
  let k = 0;
  while (k < KEYS.length - 2 && p > KEYS[k + 1][0]) k++;
  const A = KEYS[k], B = KEYS[k + 1];
  const t = ease(clamp((p - A[0]) / (B[0] - A[0])));
  const yaw = (lerp(A[1], B[1], t) * Math.PI) / 180;
  const pitch = (lerp(A[2], B[2], t) * Math.PI) / 180;
  const dist = lerp(A[3], B[3], t) * (portrait ? lerp(1.5, 1.8, seg(p, 0.06, 0.2)) : 1);
  const side = portrait ? 0 : lerp(A[4], B[4], t);

  const open = seg(p, 0.06, 0.2);
  const gap = lerp(GAP_CLOSED, GAP_OPEN, open);
  const sheets = [];
  for (let i = 0; i < LAYERS; i++) {
    const w = pull(i, p);
    sheets.push({
      x: 0,
      y: (LAYERS - 1 - i) * gap + w * 0.12,
      z: w * (portrait ? 1.1 : 2.25),
      // Sheets that are not the subject of the chapter step back.
      dim: lerp(1, lerp(0.42, 1, w), open),
      pull: w,
    });
  }

  const mid = ((LAYERS - 1) * gap) / 2;
  // Looking at a point beside the stack moves the stack to the other side of
  // the frame. On a phone the copy sits at the bottom, so the stack is lifted.
  const right = [Math.cos(yaw), 0, -Math.sin(yaw)];
  const shift = -side * lerp(2.3, 1.9, open);
  const target = [right[0] * shift, mid - (portrait ? lerp(0.35, 2.1, open) : 0.1), right[2] * shift + open * 0.5];
  const cam = [
    target[0] + dist * Math.cos(pitch) * Math.sin(yaw),
    target[1] + dist * Math.sin(pitch),
    target[2] + dist * Math.cos(pitch) * Math.cos(yaw),
  ];
  return { cam, target, sheets, open };
}
