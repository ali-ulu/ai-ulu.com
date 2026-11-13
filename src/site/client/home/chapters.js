// The film's DOM layer: fades the chapter copy around its stop and runs the
// rail. Knows nothing about WebGL. This module is the only writer of the
// chapters' opacity / transform / visibility (site.css sets none of them in
// film mode, so nothing fights over a property).
import { STOPS, seg } from "./scene/pose.js";

const FADE = 0.04;

export function createChapters(stage, progress, { reduce = false } = {}) {
  const chapters = [...stage.querySelectorAll(".ch")];
  const dots = [...stage.querySelectorAll(".rail [data-stop]")];
  const prev = stage.querySelector(".rail [data-step='-1']");
  const next = stage.querySelector(".rail [data-step='1']");
  let active = -1;

  const nearest = (p) => STOPS.reduce((best, s, i) => (Math.abs(s - p) < Math.abs(STOPS[best] - p) ? i : best), 0);
  const go = (i) => {
    const behavior = reduce ? "auto" : "smooth";
    // Past the last stop the rail leaves the film: nobody is held in a pinned scene.
    if (i >= STOPS.length) return void document.getElementById("nasil")?.scrollIntoView({ behavior });
    scrollTo({ top: progress.topFor(STOPS[Math.max(0, i)]), behavior });
  };
  const onClick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.stop) go(Number(b.dataset.stop));
    else if (b.dataset.step) go(nearest(progress.value) + Number(b.dataset.step));
  };
  stage.querySelector(".rail")?.addEventListener("click", onClick);

  function paint(p) {
    for (const el of chapters) {
      const a = Number(el.dataset.a), b = Number(el.dataset.b);
      const o = Math.min(a === 0 ? 1 : seg(p, a - FADE, a + FADE), 1 - seg(p, b - FADE, b + FADE));
      el.style.opacity = o.toFixed(3);
      // Hidden chapters keep their links out of the tab order.
      el.style.visibility = o > 0.02 ? "visible" : "hidden";
      el.style.transform = `translate3d(0,${((1 - o) * 20).toFixed(1)}px,0)`;
      el.classList.toggle("on", o > 0.5);
    }
    const i = nearest(p);
    if (i !== active) {
      active = i;
      dots.forEach((d, n) => (n === i ? d.setAttribute("aria-current", "step") : d.removeAttribute("aria-current")));
      if (prev) prev.disabled = i === 0;
      if (next) next.setAttribute("aria-label", i === STOPS.length - 1 ? "Filmi bitir, içeriğe geç" : "Sonraki bölüm");
    }
    return false;
  }

  return {
    paint,
    // Hand the chapters back to the stylesheet (the .no-3d column).
    destroy() {
      stage.querySelector(".rail")?.removeEventListener("click", onClick);
      for (const el of chapters) {
        el.style.opacity = el.style.visibility = el.style.transform = "";
        el.classList.remove("on");
      }
    },
  };
}
