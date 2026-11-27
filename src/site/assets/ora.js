// Home page film: glowing code assembles into a storefront, a generated clip scrubbed by scroll.
const root = document.documentElement;
const pre = document.getElementById('pre');
const preBar = document.getElementById('preBar');
const prePct = document.getElementById('prePct');
let loaded = 0;
const step = (n) => { loaded = Math.max(loaded, n); if (preBar) preBar.style.width = loaded + '%'; if (prePct) prePct.textContent = String(Math.round(loaded)).padStart(3, '0'); };
// The hero is static HTML and paints on its own, so the loader must not wait on
// the film clip or on web fonts. Hide it after the first paint: that is
// what makes the hero the LCP element instead of a screen-covering overlay.
const finishPre = () => { if (pre) pre.classList.add('done'); };
const fallback = (err) => { root.classList.add('no-3d'); finishPre(); if (err) console.error('film disabled:', err); };
requestAnimationFrame(() => requestAnimationFrame(() => { step(100); finishPre(); }));

// The film loads after the first paint so its download and decode stay out
// of the critical path. The hero is already visible and the
// stage fades in underneath it when the scene is ready.
const whenIdle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));

// A multi-megabyte clip is not worth a phone's data plan or memory (the old
// WebGL scene blocked a mobile thread for over 15 s). Small screens, Data
// Saver and low-memory devices get the static, readable chapter column instead
// (.no-3d), which the CSS already lays out; the hero is identical either way.
// Reduced motion gets the same readable column: a scroll-scrubbed film hides
// its chapters until scrolled to, which leaves text invisible for these visitors.
const canRunFilm = !matchMedia('(prefers-reduced-motion: reduce)').matches
  && matchMedia('(min-width: 768px)').matches
  && !(navigator.connection && navigator.connection.saveData)
  && (navigator.deviceMemory ?? 8) >= 4;

async function loadFilm() {
  // The whole clip is fetched into memory once (~6 MB): seeking a Blob is instant,
  // seeking a ranged network stream stutters on every scroll tick.
  const video = document.getElementById('gl');
  try {
    const res = await fetch('/img/film.mp4');
    if (!res.ok) throw new Error('film ' + res.status);
    step(60);
    video.src = URL.createObjectURL(await res.blob());
    await new Promise((ok, no) => { video.onloadeddata = ok; video.onerror = no; });
    step(90);
  } catch (err) {
    fallback(err);
    return;
  }
  start(video);
}

// Desktop: keep the film. Everywhere else: fall back to the static column.
// Start on the first sign of a person (move, scroll, key, touch), not at load:
// the clip download is the page's heaviest request, and the film is scroll-driven anyway.
const firstInput = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'];
const startFilm = () => {
  for (const e of firstInput) removeEventListener(e, startFilm);
  whenIdle(loadFilm);
};
if (canRunFilm) for (const e of firstInput) addEventListener(e, startFilm, { passive: true });
else fallback();

function start(video) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const seg = (p, a, b) => ease(clamp((p - a) / (b - a)));
  const end = Math.max(0, video.duration - 0.05); // the very last frame can decode black

  const chapters = [...document.querySelectorAll('.ch')];
  const tags = [...document.querySelectorAll('.tag')];
  const ticks = [...document.querySelectorAll('.prog i')];
  const hint = document.getElementById('hint'), film = document.getElementById('film');

  let target = 0, cur = 0, lastDrawn = -1, onScreen = true, raf = 0;
  const readScroll = () => { const r = film.getBoundingClientRect(); target = clamp(-r.top / (r.height - innerHeight)); wake(); };

  function paintCopy(p) {
    chapters.forEach((el) => {
      const a = +el.dataset.a, b = +el.dataset.b, f = .035;
      const o = Math.min(a === 0 ? 1 : seg(p, a - f, a + f), 1 - seg(p, b - f, b + f));
      el.style.opacity = o;
      el.style.visibility = o > .02 ? 'visible' : 'hidden'; // hidden chapters keep their links out of the tab order
      el.style.transform = `translateY(${(1 - o) * 24}px)`;
      el.classList.toggle('on', o > .5);
    });
    ticks.forEach((t, i) => t.classList.toggle('on', i === Math.min(4, Math.floor(p * 5))));
    if (hint) hint.style.opacity = 1 - seg(p, .01, .05);
    // The four labels gather in the dark top-left corner once the storefront is built
    // (the storefront itself ends right of centre).
    const tagO = seg(p, .72, .9);
    tags.forEach((el, i) => {
      el.style.opacity = tagO;
      if (tagO <= 0) return;
      const x = 32 + (i % 2) * 300, y = 110 + (i >> 1) * 84 + (1 - tagO) * 16;
      el.style.transform = `translate(${x}px,${y.toFixed(1)}px)`;
    });
  }

  // Seek on demand: only while the eased scroll is still moving, and never while off screen.
  function frame() {
    raf = 0;
    if (!onScreen) return;
    cur = reduce ? target : cur + (target - cur) * .12;
    if (Math.abs(target - cur) < 1e-4) cur = target;
    if (cur !== lastDrawn) {
      if (!video.seeking) video.currentTime = cur * end; // a busy decoder skips a tick instead of queueing seeks
      paintCopy(cur);
      lastDrawn = cur;
    }
    if (cur !== target || video.seeking) wake();
  }
  function wake() { if (!raf && onScreen) raf = requestAnimationFrame(frame); }

  new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; wake(); }).observe(film);
  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('resize', () => { lastDrawn = -1; wake(); });
  readScroll(); cur = target;
  requestAnimationFrame(() => { frame(); finishPre(); });
}
