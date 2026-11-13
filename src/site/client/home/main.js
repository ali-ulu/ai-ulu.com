// Home page composition root. Three independent parts, wired here and nowhere else:
//   funnel   — sector choice → WhatsApp links, CTA label, form prefill
//   chapters — scroll progress → chapter copy and the rail
//   scene    — scroll progress + sector → the 3D stack (loaded after first paint)
// Each works without the others; if the scene cannot run, the page falls back
// to a plain column (.no-3d) and the funnel keeps working.
import { sectors, defaultSector } from "../../content/sectors.mjs";
import { createFunnel } from "./funnel.js";
import { createProgress } from "./progress.js";
import { createChapters } from "./chapters.js";

const root = document.documentElement;
const film = document.getElementById("film");
const stage = film?.querySelector(".stage");
const canvas = document.getElementById("gl");

const funnel = createFunnel(document, sectors);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
// Data Saver and low-memory devices get the static column: the copy is the
// same, and the hero does not move when the class lands (no layout shift).
const lowEnd = Boolean(navigator.connection && navigator.connection.saveData) || (navigator.deviceMemory ?? 8) < 4;

if (!film || !stage || !canvas || reduce || lowEnd) {
  root.classList.add("no-3d");
} else {
  const progress = createProgress(film);
  const chapters = createChapters(stage, progress);
  progress.subscribe(chapters.paint);

  const flatten = (err) => {
    progress.stop();
    chapters.destroy();
    root.classList.add("no-3d");
    if (err) console.error("3D scene disabled:", err);
  };

  // The hero is static HTML and has already painted. The scene (and the WebGL
  // library with it) is a separate chunk fetched when the main thread is idle.
  const whenIdle = (fn) => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200));
  whenIdle(async () => {
    try {
      const { createScene } = await import("./scene/index.js");
      const scene = await createScene(canvas, { sector: funnel.current ?? defaultSector });
      progress.subscribe(scene.frame);
      funnel.onChange((s) => { scene.setSector(s); progress.wake(); });
      addEventListener("resize", () => { scene.resize(); progress.wake(); });
      root.classList.add("has-3d");
    } catch (err) {
      flatten(err);
    }
  });
}
