// SCROLL HOST for the web page. Same art core as page-kase.ts, a different host: no player, no
// keyboard, no audio; the page's scroll picks the frame. Runs in a Worker on an OffscreenCanvas
// when it can (a frame costs ~60-120 ms, which would stall scrolling on the main thread), and on
// the main thread otherwise. Requests are coalesced: only the newest frame is ever drawn.
import type { Ctx, Env, Layer } from "../canvas-core/core";
import { renderFrame } from "../canvas-core/film";
import { kase } from "../canvas-core/kase";

type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;
const make = (canvas: AnyCanvas, scale: number) => {
  const surface = (w: number, h: number): Layer => {
    const c = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), { width: w, height: h });
    return { canvas: c, ctx: c.getContext("2d") as unknown as Ctx } as Layer;
  };
  canvas.width = Math.round(kase.meta.W * scale); canvas.height = Math.round(kase.meta.H * scale);
  const ctx = canvas.getContext("2d") as unknown as Ctx;
  const env: Env = { W: kase.meta.W, H: kase.meta.H, scale, cache: new Map(), canvas: surface, image: () => undefined } as Env;
  let want = -1, drawn = -1, busy = false;
  const pump = () => {
    if (busy || want === drawn) return;
    busy = true; const f = want;
    renderFrame(kase, ctx, f, env); drawn = f; busy = false;
    if (want !== drawn) setTimeout(pump, 0);        // a newer request arrived while drawing
  };
  return { seek: (f: number) => { want = Math.max(0, Math.min(kase.meta.durationFrames - 1, Math.round(f))); setTimeout(pump, 0); }, frames: kase.meta.durationFrames };
};

declare const WorkerGlobalScope: { new (): unknown } | undefined;
if (typeof WorkerGlobalScope !== "undefined" && self instanceof (WorkerGlobalScope as unknown as typeof Object)) {
  let r: ReturnType<typeof make> | null = null;
  self.onmessage = (e: MessageEvent) => {
    const m = e.data;
    if (m.canvas) { r = make(m.canvas as OffscreenCanvas, m.scale); r.seek(m.frame ?? 0); }
    else if (r && typeof m.frame === "number") r.seek(m.frame);
  };
} else {
  (window as unknown as { KASE: unknown }).KASE = { mount: (c: HTMLCanvasElement, scale: number) => make(c, scale), frames: kase.meta.durationFrames };
}
