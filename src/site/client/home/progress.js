// One normalised progress value (0–1) for the film, derived from native scroll.
// Subscribers are called with the eased value and return true while they still
// need frames; with nothing moving, no frame runs at all.
import { clamp } from "./scene/pose.js";

export function createProgress(track, { reduce = false } = {}) {
  const subs = new Set();
  let target = 0, cur = 0, raf = 0, visible = true, stopped = false;

  const read = () => {
    const r = track.getBoundingClientRect();
    const span = r.height - innerHeight;
    target = span > 0 ? clamp(-r.top / span) : 0;
    wake();
  };
  function frame() {
    raf = 0;
    if (!visible || stopped) return;
    cur = reduce ? target : cur + (target - cur) * 0.1;
    if (Math.abs(target - cur) < 1e-4) cur = target;
    let more = cur !== target;
    for (const fn of subs) more = fn(cur) || more;
    if (more) wake();
  }
  function wake() {
    if (!raf && visible && !stopped) raf = requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
  io.observe(track);
  addEventListener("scroll", read, { passive: true });
  addEventListener("resize", read);
  read();
  cur = target;

  return {
    subscribe(fn) { subs.add(fn); wake(); },
    wake,
    // Scroll position that puts the film at progress s (used by the rail).
    topFor(s) { return track.getBoundingClientRect().top + scrollY + s * (track.offsetHeight - innerHeight); },
    get value() { return cur; },
    stop() {
      stopped = true;
      io.disconnect();
      removeEventListener("scroll", read);
      removeEventListener("resize", read);
      subs.clear();
    },
  };
}
