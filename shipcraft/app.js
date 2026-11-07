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

  // WebMCP: tarayıcı içi ajanların sayfayı kullanabilmesi için araçlar.
  // API yoksa hiçbir şey yapılmaz (zarifçe devre dışı). Araçlar gerçek sayfa
  // işlevlerini sarar; uydurma yetenek açığa çıkarmaz.
  var mc = navigator.modelContext;
  if (mc && typeof mc.registerTool === "function") {
    var tools = [
      {
        name: "set-theme",
        description: "Switches the site between the dark and light theme.",
        inputSchema: { type: "object", properties: { theme: { type: "string", enum: ["dark", "light"], description: "The theme to apply." } }, required: ["theme"] },
        execute: function (a) {
          var th = a && a.theme === "light" ? "light" : "dark";
          root.setAttribute("data-theme", th);
          try { localStorage.setItem("theme", th); } catch (e) {}
          return { theme: th };
        }
      },
      {
        name: "switch-language",
        description: "Switches between the English and Turkish versions of the site.",
        inputSchema: { type: "object", properties: { language: { type: "string", enum: ["en", "tr"], description: "The language to switch to." } }, required: ["language"] },
        execute: function (a) {
          var link = d.querySelector(".tools .lang");
          if (link) link.click();
          return { switched: true, to: a && a.language };
        }
      },
      {
        name: "go-to-section",
        description: "Scrolls to a section of the page by name.",
        inputSchema: { type: "object", properties: { section: { type: "string", enum: ["services", "work", "pricing", "faq", "contact"], description: "The section to scroll to." } }, required: ["section"] },
        execute: function (a) {
          var el = d.getElementById(a && a.section);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          return { scrolledTo: a && a.section, found: !!el };
        }
      },
      {
        name: "get-contact-details",
        description: "Returns ai-ulu's contact details: email, phone and WhatsApp link.",
        inputSchema: { type: "object", properties: {} },
        execute: function () {
          var mail = d.querySelector('a[href^="mailto:"]'), tel = d.querySelector('a[href^="tel:"]');
          return {
            email: mail ? mail.getAttribute("href").replace("mailto:", "") : null,
            phone: tel ? tel.getAttribute("href").replace("tel:", "") : null,
            whatsapp: "https://wa.me/" + cfg.waNum
          };
        }
      },
      {
        name: "start-project",
        description: "Opens the contact form and focuses the first field, so an agent can begin an enquiry.",
        inputSchema: { type: "object", properties: {} },
        execute: function () {
          var sec = d.getElementById("contact");
          if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
          var f = d.querySelector("#lead input[name=name]");
          if (f) f.focus();
          return { opened: !!sec };
        }
      }
    ];
    for (var ti = 0; ti < tools.length; ti++) {
      try { mc.registerTool(tools[ti]); } catch (e) {}
    }
  }
})();

// İlham destesi: kartlar tabanları üstünde öne devrilir. Sayfa kaydırması sürer (tekerlek
// yakalanmaz, dokunmatik kaydırma bozulmaz); yalnız öndeki oturmuş kart videosunu oynatır.
(function () {
  var deck = document.getElementById("deck");
  if (!deck) return;
  var stage = deck.querySelector(".deck-stage"), scene = deck.querySelector(".deck-scene");
  var caption = deck.querySelector(".deck-caption"), nav = deck.querySelector(".deck-thumbs");
  var CARDS = JSON.parse(deck.getAttribute("data-cards")), SRC = deck.getAttribute("data-src");
  var VIDEO = deck.getAttribute("data-video").split(" ");
  var n = CARDS.length, ASPECT = 2.06, DEPTH = 5, POOL = DEPTH + 5;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp01(v) { return Math.min(1, Math.max(0, v)); }
  function wrap(k) { return ((k % n) + n) % n; }
  // Yerçekimi kartı hızlandırır, yere bir kez sekip oturur.
  function fallAngle(t) {
    var u = clamp01(t), land = 0.78, k;
    if (u <= land) { k = u / land; return -90 * k * k * k; }
    k = (u - land) / (1 - land);
    return -90 + 6 * Math.sin(Math.PI * k) * (1 - k);
  }
  function deckAdvance(pos) {
    var i = Math.floor(pos), k = clamp01((pos - i - 0.28) / 0.6);
    return i + k * k * (3 - 2 * k);
  }
  function cardPose(k, pos) {
    var t = pos - k, lift = (k - Math.floor(pos) + 3) * 0.6;
    if (t >= 1) return { angle: -90, z: 0, lift: lift, opacity: t < 3 ? 1 : 0, flat: true };
    if (t > 0) return { angle: fallAngle(t), z: 0, lift: lift, opacity: 1, flat: false };
    var rel = k - deckAdvance(pos);
    return { angle: 0, z: -Math.max(rel, 0), lift: 0, opacity: clamp01(DEPTH + 1 - rel), flat: false };
  }

  var slots = [];
  for (var j = 0; j < POOL; j++) {
    var el = document.createElement("div"); el.className = "deck-card";
    var img = document.createElement("img"); img.width = 1000; img.height = 486; img.decoding = "async"; img.draggable = false;
    var video = document.createElement("video");
    video.muted = true; video.loop = true; video.playsInline = true; video.preload = "none"; video.setAttribute("aria-hidden", "true");
    el.appendChild(img); el.appendChild(video); scene.appendChild(el);
    slots.push({ el: el, img: img, video: video, k: null, live: false });
  }
  var thumbs = CARDS.map(function (c, i) {
    var b = document.createElement("button");
    b.type = "button"; b.style.backgroundImage = "url(" + SRC + c[0] + ".webp)"; b.setAttribute("aria-label", c[1]);
    b.addEventListener("click", function () { jump(i); });
    nav.appendChild(b);
    return b;
  });

  var gap = 44, pos = 0, target = 0, raf = 0, shown = -1;
  function setLive(s, live) {
    if (live === s.live) return;
    s.live = live;
    if (live) {
      var p = s.video.play();
      if (p && p.then) p.then(function () { s.video.classList.add("is-on"); }, function () {});
    } else { s.video.pause(); s.video.classList.remove("is-on"); }
  }
  function paint() {
    var base = Math.floor(pos) - 2;
    slots.forEach(function (s, j) {
      var k = base + (((j - base) % POOL) + POOL) % POOL;
      if (s.k !== k) {
        s.k = k;
        var c = CARDS[wrap(k)];
        s.img.src = SRC + c[0] + ".webp"; s.img.alt = c[1];
        setLive(s, false);
        if (VIDEO.indexOf(c[0]) >= 0) s.video.src = SRC + c[0] + ".mp4"; else s.video.removeAttribute("src");
      }
      var p = cardPose(k, pos);
      s.el.style.transform = "translate3d(0," + (-p.lift) + "px," + (p.z * gap) + "px) rotateX(" + p.angle + "deg)";
      s.el.style.opacity = p.opacity;
      s.el.style.visibility = p.opacity > 0 ? "visible" : "hidden";
      s.el.style.setProperty("--shade", p.flat ? 0.06 : (-p.angle / 90) * 0.06);
      // Yalnız öne oturmuş kart oynar; devrilmeye başlayınca durur.
      setLive(s, !reduce && s.video.hasAttribute("src") && Math.abs(pos - k) < 0.12);
    });
    var front = wrap(Math.round(pos));
    if (front !== shown) {
      shown = front;
      caption.textContent = "";
      var strong = document.createElement("strong");
      strong.textContent = CARDS[front][1];
      caption.appendChild(strong);
      caption.appendChild(document.createTextNode(CARDS[front][2]));
      thumbs.forEach(function (t, i) { t.setAttribute("aria-current", String(i === front)); });
      var t = thumbs[front];
      nav.scrollLeft = t.offsetLeft - (nav.clientWidth - t.offsetWidth) / 2;
    }
  }
  function fit() {
    var W = stage.clientWidth, H = stage.clientHeight;
    var h = Math.max(60, Math.min((W * (W < 420 ? 0.82 : 0.655)) / ASPECT, H * 0.34, 560));
    var top = H * 0.42 - 0.62 * h; // yüzen menünün altında kalmasın
    gap = 0.24 * h;
    scene.style.perspective = 6 * h + "px";
    scene.style.perspectiveOrigin = "50% " + (top - 1.66 * h) + "px";
    stage.style.setProperty("--w", h * ASPECT + "px");
    stage.style.setProperty("--h", h + "px");
    stage.style.setProperty("--top", top + "px");
    paint();
  }
  function fromScroll() {
    var r = deck.getBoundingClientRect();
    return clamp01(-r.top / (r.height - innerHeight)) * (n - 1);
  }
  function tick() {
    pos += (target - pos) * 0.14;
    if (Math.abs(target - pos) < 1e-3) { pos = target; raf = 0; } else raf = requestAnimationFrame(tick);
    paint();
  }
  function go(to) {
    target = to;
    if (reduce) { pos = Math.round(to); paint(); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  addEventListener("scroll", function () { go(fromScroll()); }, { passive: true });
  // Tık, ok tuşu ve küçük resimler sayfayı kaydırır; deste ile sayfa hep eş kalır.
  function jump(next) {
    var travel = deck.offsetHeight - innerHeight;
    scrollTo({ top: deck.offsetTop + (next / (n - 1)) * travel, behavior: reduce ? "auto" : "smooth" });
  }
  function step(dir) { jump(Math.max(0, Math.min(n - 1, Math.round(target) + dir))); }
  scene.addEventListener("click", function () { step(1); });
  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); step(-1); }
  });
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(stage); else addEventListener("resize", fit);
  pos = target = fromScroll();
  fit();
})();
