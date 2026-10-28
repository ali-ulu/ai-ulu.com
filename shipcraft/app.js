(function () {
  var d = document, root = d.documentElement, cfg = window.__CFG;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tema: varsayılan koyu; düğme açık/koyu arasında geçirir, seçim hatırlanır
  d.getElementById("theme").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Yıldız ve artı parıltıları (hero)
  var stars = d.querySelector(".stars");
  if (stars) {
    var seed = 11, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (var i = 0; i < 52; i++) {
      var s = d.createElement("i"); s.className = i % 8 === 0 ? "plus" : "star";
      s.style.left = rnd() * 100 + "%"; s.style.top = rnd() * 60 + "%"; s.style.animationDelay = rnd() * 5 + "s";
      stars.appendChild(s);
    }
  }

  // Panoramik coverflow: kavisli 3B şerit; kullanıcı duraklatabilir (WCAG 2.2.2).
  // Hareket azaltma açıksa kendiliğinden akmaz; oklar, klavye ve sürükleme çalışır.
  var flow = d.getElementById("flow");
  if (flow) {
    var tiles = [].slice.call(flow.querySelectorAll(".tile")), n = tiles.length, cur = 0, timer = null, idle = null;
    var INTERVAL = reduce ? 6000 : 3400;
    function place() {
      var stepX = innerWidth < 700 ? 44 : 60;
      tiles.forEach(function (t, i) {
        var off = ((i - cur) % n + n) % n; if (off > n / 2) off -= n;
        var a = Math.abs(off), vis = a <= 3;
        t.style.opacity = vis ? (a === 0 ? 1 : Math.max(.3, 1 - a * .25)) : 0;
        t.style.pointerEvents = vis ? "auto" : "none";
        t.style.filter = a === 0 ? "none" : "brightness(" + Math.max(.45, 1 - a * .17) + ") saturate(.9)";
        t.style.zIndex = 10 - a;
        t.style.transform = "translate3d(" + off * stepX + "%,0," + (-a * 180) + "px) rotateY(" + (-off * 26) + "deg) scale(" + (a === 0 ? 1.05 : 1) + ")";
        t.tabIndex = a === 0 ? 0 : -1;
        t.setAttribute("aria-hidden", vis ? "false" : "true");
      });
    }
    function go(dir) { cur = (cur + dir + n) % n; place(); }
    function play() { stop(); if (reduce || paused) return; timer = setInterval(function () { go(1); }, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function nudge() { stop(); clearTimeout(idle); idle = setTimeout(play, 5000); }
    // WCAG 2.2.2: hareket eden içerik duraklatılabilmeli. Üzerine gelince/odaklanınca durur,
    // ayrıca görünür bir duraklat/oynat düğmesi var. Hareket azaltma açıksa hiç başlamaz.
    var paused = false, pp = d.getElementById("flow-pp");
    function syncPP() { if (pp) { pp.setAttribute("aria-pressed", paused ? "true" : "false"); pp.setAttribute("aria-label", paused ? pp.getAttribute("data-play") : pp.getAttribute("data-pause")); } }
    function pause() { paused = true; stop(); syncPP(); }
    function resume() { paused = false; play(); syncPP(); }
    if (pp) pp.addEventListener("click", function () { paused ? resume() : pause(); });
    flow.addEventListener("pointerenter", function () { stop(); });
    flow.addEventListener("pointerleave", function () { if (!paused) play(); });
    flow.addEventListener("focusin", function () { stop(); });
    flow.addEventListener("focusout", function (e) { if (!paused && !flow.contains(e.relatedTarget)) play(); });
    syncPP();
    flow.querySelectorAll(".fb").forEach(function (b) { b.addEventListener("click", function () { go(+b.getAttribute("data-d")); nudge(); }); });
    tiles.forEach(function (t, i) {
      t.addEventListener("click", function (e) { if (flow._moved) { e.preventDefault(); return; } if (i !== cur) { e.preventDefault(); cur = i; place(); nudge(); } });
    });
    // sürükleme (fare ve dokunma)
    var sx = null;
    flow.addEventListener("pointerdown", function (e) { if (e.target.closest(".fb")) return; sx = e.clientX; flow._moved = false; flow.classList.add("drag"); stop(); });
    addEventListener("pointermove", function (e) { if (sx !== null && Math.abs(e.clientX - sx) > 8) flow._moved = true; });
    addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null; flow.classList.remove("drag");
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      nudge(); setTimeout(function () { flow._moved = false; }, 0);
    });
    flow.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { go(1); nudge(); } if (e.key === "ArrowLeft") { go(-1); nudge(); } });
    d.addEventListener("visibilitychange", function () { if (d.hidden) stop(); else play(); });
    addEventListener("resize", place);
    place(); play();
  }

  // Kart ışığı: imleci takip eden turuncu parıltı
  d.addEventListener("pointermove", function (e) {
    var bz = e.target.closest && e.target.closest(".bz");
    if (!bz) return;
    var core = bz.querySelector(".core"); if (!core) return;
    var r = core.getBoundingClientRect();
    core.style.setProperty("--mx", (e.clientX - r.left) + "px"); core.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  // Kaydırma girişi
  var rev = [].slice.call(d.querySelectorAll(".sec .pill, .sec h2, .sec .lead, .bz, details, .stats, .marquee"));
  rev.forEach(function (e) { e.classList.add("reveal"); });
  [].slice.call(d.querySelectorAll(".cards3, .stats, .work-grid, .faq")).forEach(function (g) {
    [].slice.call(g.children).forEach(function (c, i) { c.style.setProperty("--d", (i % 4) * 0.09 + "s"); });
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    rev.forEach(function (e) { io.observe(e); });
  } else rev.forEach(function (e) { e.classList.add("in"); });

  // Form: doğrula, durumu göster, sunucu yoksa WhatsApp'a düş
  var form = d.getElementById("lead"), status = d.getElementById("status");
  var nameInput = form.querySelector('[name="name"]'), reachInput = form.querySelector('[name="reach"]');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.childNodes[0].nodeValue;
  // E-posta ya da telefon: en az biri geçerli olsun (uluslararası biçimler dahil)
  function reachOk(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || /^\+?[\d\s().-]{7,}$/.test(v);
  }
  function setInvalid(el, bad, msg) {
    if (bad) { el.setAttribute("aria-invalid", "true"); status.textContent = msg; }
    else el.removeAttribute("aria-invalid");
    return !bad;
  }
  // Kullanıcı düzeltirken hatayı temizle
  [nameInput, reachInput].forEach(function (el) {
    el.addEventListener("input", function () {
      if (el.getAttribute("aria-invalid") === "true") { el.removeAttribute("aria-invalid"); status.textContent = ""; }
    });
  });
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = new FormData(form), c = cfg.c;
    var data = { name: (f.get("name") || "").trim(), reach: (f.get("reach") || "").trim(), type: f.get("type"), msg: (f.get("msg") || "").trim(), website: f.get("website") };
    status.textContent = "";
    if (data.website) return; // bal küpü
    if (!data.name || !data.reach) { setInvalid(!data.name ? nameInput : reachInput, true, c.required); return; }
    if (!setInvalid(reachInput, !reachOk(data.reach), c.invalidReach)) return;
    var text = c.waText + "\n" + data.name + " · " + data.reach + " · " + data.type + (data.msg ? "\n" + data.msg : "");
    var wa = "https://wa.me/" + cfg.waNum + "?text=" + encodeURIComponent(text);
    submitBtn.disabled = true; submitBtn.setAttribute("aria-busy", "true");
    status.textContent = c.sending;
    fetch("/form.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); status.textContent = c.ok; form.reset(); submitLabel = c.sent; })
      .catch(function () {
        status.textContent = c.fallback + " ";
        var a = d.createElement("a"); a.href = wa; a.target = "_blank"; a.rel = "noopener"; a.textContent = c.fallbackBtn;
        status.appendChild(a);
      })
      .then(function () {
        submitBtn.disabled = false; submitBtn.removeAttribute("aria-busy");
        submitBtn.childNodes[0].nodeValue = submitLabel;
      });
  });
})();
