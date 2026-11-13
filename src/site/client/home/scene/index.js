// The renderer: a stack of four textured sheets drawn with OGL. It owns the
// canvas and nothing else. Poses come from pose.js, pixels from artboards.js;
// this file only turns them into draw calls.
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from "ogl";
import { pose, LAYERS } from "./pose.js";
import { boards, BOARD_W, BOARD_H, BOARD_FONTS } from "./artboards.js";
import { vertex, sheetFragment, shadowFragment } from "./shaders.js";

const W = 3.2, D = 2.0, RADIUS = 0.11;
const SWAP_MS = 650;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export async function createScene(canvas, { sector }) {
  const renderer = new Renderer({
    canvas, alpha: true, antialias: true, premultipliedAlpha: true,
    // Past 2x the extra pixels cost fill rate on a phone and show nothing.
    dpr: Math.min(devicePixelRatio || 1, 2),
  });
  const gl = renderer.gl;
  if (!gl) throw new Error("WebGL unavailable");
  gl.clearColor(0, 0, 0, 0);
  // The artboards are drawn with the page's own web fonts ("ş" pulls the latin-ext files).
  await Promise.all(BOARD_FONTS.map((f) => document.fonts.load(f, "Aaşğ"))).catch(() => {});

  const camera = new Camera(gl, { near: 0.1, far: 60 });
  const scene = new Transform();
  const state = { transparent: true, depthTest: false, depthWrite: false, cullFace: null };

  const sheetProgram = new Program(gl, {
    vertex, fragment: sheetFragment, ...state,
    uniforms: {
      tMap: { value: null }, uSize: { value: [W, D] }, uRadius: { value: RADIUS },
      uDim: { value: 1 }, uSheen: { value: 0 }, uFlat: { value: 0 }, uTint: { value: [0, 0, 0] },
    },
  });
  const shadowProgram = new Program(gl, {
    vertex, fragment: shadowFragment, ...state,
    uniforms: {
      uSize: { value: [1, 1] }, uBox: { value: [W, D] }, uBlur: { value: 0.3 },
      uOpacity: { value: 0 }, uAdd: { value: 0 }, uColor: { value: [0, 0, 0] },
    },
  });

  const quad = new Plane(gl, { width: W, height: D });
  const flat = (geometry, program, uniforms) => {
    const mesh = new Mesh(gl, { geometry, program });
    mesh.rotation.x = -Math.PI / 2;
    // One program serves every mesh: each sets its own uniforms just before it draws.
    mesh.onBeforeRender(() => { for (const k in uniforms) program.uniforms[k].value = uniforms[k]; });
    mesh.u = uniforms;
    mesh.setParent(scene);
    return mesh;
  };
  const shadow = (pad, blur, extra = {}) => {
    const size = [W + pad * 2, D + pad * 2];
    return flat(new Plane(gl, { width: size[0], height: size[1] }), shadowProgram,
      { uSize: size, uBlur: blur, uOpacity: 0, uAdd: 0, uColor: [0, 0, 0], ...extra });
  };

  // Draw order is the order meshes join the scene (sort is off): floor first,
  // then the stack from the bottom sheet up, so no depth buffer is needed.
  const glow = shadow(2.6, 2.2, { uAdd: 1, uColor: hex("#e0a458"), uOpacity: 0.1 });
  glow.position.y = -0.06;
  const layers = Array.from({ length: LAYERS }, () => ({}));
  for (const l of layers) { l.floor = shadow(0.9, 0.55); l.floor.position.y = -0.05; }
  for (let i = LAYERS - 1; i >= 0; i--) {
    const l = layers[i];
    l.canvas = Object.assign(document.createElement("canvas"), { width: BOARD_W, height: BOARD_H });
    l.ctx = l.canvas.getContext("2d");
    l.texture = new Texture(gl, { image: l.canvas, minFilter: gl.LINEAR_MIPMAP_LINEAR });
    l.edges = [0.05, 0.025].map((drop, n) => {
      const m = flat(quad, sheetProgram, { tMap: l.texture, uDim: 1, uSheen: 0, uFlat: 1, uTint: [0, 0, 0] });
      m.drop = drop; m.shade = n === 0 ? 0.55 : 0.8;
      return m;
    });
    l.top = flat(quad, sheetProgram, { tMap: l.texture, uDim: 1, uSheen: 0, uFlat: 0, uTint: [0, 0, 0] });
    // The shadow the sheet above casts onto this one.
    if (i > 0) layers[i - 1].cast = shadow(0.5, 0.34);
  }

  let current = sector, pending = null, swapStart = 0, portrait = false;
  function paintBoards(s) {
    layers.forEach((l, i) => {
      boards[i].paint(l.ctx, s);
      l.texture.needsUpdate = true;
      const tint = hex(boards[i].edge(s));
      l.edges.forEach((m) => { m.u.uTint = tint.map((v) => v * m.shade); });
    });
  }
  paintBoards(current);

  function resize() {
    const box = canvas.parentElement;
    const w = box.clientWidth, h = box.clientHeight;
    renderer.setSize(w, h);
    portrait = w / h < 0.8;
    camera.perspective({ fov: portrait ? 36 : 30, aspect: w / h });
  }
  resize();

  // Called by the progress ticker. Returns true while a sector swap is still animating.
  function frame(p) {
    let swap = 0;
    if (swapStart) {
      swap = Math.min(1, (performance.now() - swapStart) / SWAP_MS);
      // The new artboards go on at the top of the hop, when the sheet is in motion.
      if (pending && swap >= 0.5) { current = pending; pending = null; paintBoards(current); }
      if (swap >= 1) { swapStart = 0; swap = 0; }
    }
    const hop = Math.sin(Math.PI * swap);
    const P = pose(p, portrait);
    camera.position.set(P.cam[0], P.cam[1], P.cam[2]);
    camera.lookAt(P.target);

    const sheen = ((p * 4) % 1) + swap;
    layers.forEach((l, i) => {
      const q = P.sheets[i];
      const y = q.y + (i === 0 ? hop * 0.4 : hop * 0.05 * (LAYERS - i));
      const twist = i === 0 ? hop * 0.16 : 0;
      for (const m of [l.top, ...l.edges]) {
        m.position.set(q.x, y - (m.drop ?? 0), q.z);
        m.rotation.y = twist;
        m.u.uDim = q.dim;
      }
      l.top.u.uSheen = sheen;
      // On the floor: always under the base sheet, and under any sheet pulled clear of the stack.
      l.floor.position.x = q.x; l.floor.position.z = q.z;
      l.floor.u.uOpacity = i === LAYERS - 1 ? 0.6 : 0.45 * q.pull;
      if (l.cast) {
        const below = P.sheets[i + 1];
        l.cast.position.set(q.x, below.y + 0.004, q.z * 0.5 + below.z * 0.5);
        l.cast.u.uOpacity = 0.5 * (1 - q.pull) * (1 - below.pull);
      }
    });
    renderer.render({ scene, camera, sort: false, frustumCull: false });
    return swapStart !== 0;
  }

  return {
    frame,
    resize,
    setSector(s) {
      if (s === current && !pending) return;
      pending = s;
      swapStart = performance.now();
    },
  };
}
