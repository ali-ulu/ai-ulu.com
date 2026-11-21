// /checkup/: runs the free site test, renders the score, and offers the full report.
// A ?site= link re-runs the test, so a report can be shared.
const $ = (id) => document.getElementById(id);
const form = $("ck-form");
const lead = $("ck-lead");
let last = null;

const el = (tag, cls, text) => Object.assign(document.createElement(tag), cls ? { className: cls } : {}, text ? { textContent: text } : {});
const SUMMARY = {
  A: "Siteniz Google'a ve yapay zekâ asistanlarına hazır.",
  B: "İyi durumda; birkaç düzeltmeyle tam puana yaklaşır.",
  C: "Temeller var, ama önemli eksikler müşteri kaybettiriyor.",
  D: "Ciddi eksikler var; ziyaretçi ve yapay zekâ sizi zor buluyor.",
  E: "Siteniz ziyaretçinin ve yapay zekânın önünde engel oluyor.",
  F: "Siteniz şu haliyle müşteri getirmiyor; önce temel sorunlar çözülmeli.",
};
const GEO_SUMMARY = {
  A: "Yapay zekâ aramaları için teknik temel güçlü.",
  B: "GEO temeli iyi; birkaç şema ve içerik düzeltmesi kaldı.",
  C: "GEO temeli var, ama yapay zekâ görünürlüğü için önemli eksikler var.",
  D: "GEO sinyalleri zayıf; yapay zekâ sizi zor anlar.",
  E: "GEO temeli eksik; önce şema ve erişim sorunları çözülmeli.",
  F: "GEO sinyalleri kritik seviyede eksik.",
};
const SEVERITY = { critical: "Kritik", high: "Yüksek", medium: "Orta", low: "Düşük" };

function checkItem(c) {
  const li = el("li", `ck-item ck-${c.status}`);
  li.append(el("strong", "", c.label), el("span", "ck-detail", c.detail));
  if (c.status === "fail" || c.status === "warn") li.append(el("span", "ck-howto", `Nasıl düzelir: ${c.fix}`));
  return li;
}

function geoItem(r) {
  const tone = r.severity === "critical" || r.severity === "high" ? "fail" : "warn";
  const li = el("li", `ck-item ck-${tone}`);
  li.append(
    el("strong", "", `${SEVERITY[r.severity] || r.severity}: ${r.title} (−${r.lost} puan)`),
    el("span", "ck-detail", r.evidence),
    el("span", "ck-howto", `Nasıl düzelir: ${r.fix}`),
  );
  return li;
}

function renderGeo(d) {
  const geo = d.geo;
  const box = $("ck-geo");
  if (!geo || typeof geo.score !== "number") {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  $("ck-geo-grade").textContent = geo.grade;
  $("ck-geo-grade").dataset.g = geo.grade;
  $("ck-geo-num").textContent = geo.score;
  $("ck-geo-sum").textContent = `${d.host}: ${GEO_SUMMARY[geo.grade]}`;
  const basis = $("ck-geo-basis");
  basis.hidden = geo.coverage >= 100;
  if (geo.coverage < 100) basis.textContent = `GEO puanı ${geo.coverage}% kapsama üzerinden: bazı kontroller ölçülemedi.`;
  $("ck-geo-cats").replaceChildren(...geo.categories.filter((c) => c.max).map((c) => {
    const li = el("li");
    const bar = el("span", "ck-bar");
    bar.style.setProperty("--p", `${Math.round((c.points / c.max) * 100)}%`);
    li.append(el("span", "", c.label), bar, el("span", "ck-pts", `${c.points}/${c.max}`));
    return li;
  }));
  const fixes = geo.recommendations.slice(0, 6);
  $("ck-geo-fix").replaceChildren(...(fixes.length ? fixes.map(geoItem) : [el("li", "", "GEO kontrollerinde düzeltilecek bir şey çıkmadı.")]));
}

function render(d) {
  const graded = typeof d.score === "number";
  $("ck-grade").textContent = graded ? d.grade : "?";
  $("ck-grade").dataset.g = graded ? d.grade : "?";
  $("ck-num").textContent = graded ? d.score : "—";
  $("ck-num").parentElement.hidden = !graded;
  $("ck-sum").textContent = graded
    ? `${d.host}: ${SUMMARY[d.grade]}`
    : `${d.host}: bu siteyi otomatik ölçemedim.`;
  const basis = $("ck-basis");
  basis.hidden = !d.basis || d.basis.skipped === 0;
  if (d.basis && d.basis.skipped > 0) {
    basis.textContent = `Puan ${d.basis.covered}% kapsama üzerinden: ${d.basis.skipped} kontrol ölçülemedi, o puanlar alınmadı.`;
  }
  $("ck-cats").replaceChildren(...d.categories.filter((c) => c.max).map((c) => {
    const li = el("li");
    const bar = el("span", "ck-bar");
    bar.style.setProperty("--p", `${Math.round((c.points / c.max) * 100)}%`);
    li.append(el("span", "", c.label), bar, el("span", "ck-pts", `${c.points}/${c.max}`));
    return li;
  }));
  const speed = $("ck-speed");
  speed.hidden = d.speed == null;
  if (d.speed != null) speed.textContent = `Google telefon hız puanı: ${d.speed}/100`;
  const todo = d.checks.filter((c) => c.status === "fail" || c.status === "warn").sort((a, b) => (b.max - b.points) - (a.max - a.points));
  const rest = d.checks.filter((c) => !todo.includes(c));
  $("ck-fix").replaceChildren(...(todo.length ? todo.map(checkItem) : [el("li", "", "Otomatik kontrollerde düzeltilecek bir şey çıkmadı.")]));
  $("ck-ok").replaceChildren(...rest.map(checkItem));
  $("ck-pass-sum").textContent = `Geçen ve ölçülemeyen kontroller (${rest.length})`;
  renderGeo(d);
  const geoNote = d.geo && typeof d.geo.score === "number" ? `, GEO ${d.geo.score}/100` : "";
  const note = graded
    ? `Merhaba, ${d.host} için checkup yaptım (${d.score}/100${geoNote}, ${todo.length} düzeltme). Tam raporu alabilir miyim?`
    : `Merhaba, ${d.host} için otomatik checkup engellendi (bot koruması). Tam raporu elle alabilir miyim?`;
  $("ck-wa").href = `${$("ck-wa").dataset.base}?text=${encodeURIComponent(note)}`;
  $("ck-out").hidden = false;
}

async function run(site) {
  const btn = form.querySelector("button");
  btn.disabled = true;
  $("ck-status").textContent = "Siteniz ölçülüyor, 10-30 saniye sürebilir…";
  $("ck-out").hidden = true;
  try {
    const res = await fetch(`/api/checkup?site=${encodeURIComponent(site)}`);
    const data = await res.json();
    if (!res.ok) { $("ck-status").textContent = data.error || "Test yapılamadı."; return; }
    last = data;
    $("ck-status").textContent = "";
    history.replaceState(null, "", `?site=${encodeURIComponent(data.host)}`);
    render(data);
  } catch {
    $("ck-status").textContent = "Bağlantı hatası. Lütfen tekrar deneyin.";
  } finally {
    btn.disabled = false;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  run(form.site.value.trim());
});

$("ck-copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    $("ck-copy").textContent = "Link kopyalandı";
  } catch {
    $("ck-copy").textContent = location.href;
  }
});

lead.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!last) return;
  const btn = lead.querySelector("button");
  const status = $("ck-lead-status");
  btn.disabled = true;
  status.textContent = "Gönderiliyor…";
  const todo = last.checks.filter((c) => c.status === "fail" || c.status === "warn");
  const geo = last.geo && typeof last.geo.score === "number" ? last.geo : null;
  const headline = typeof last.score === "number"
    ? `Checkup: ${last.host} — ${last.score}/100 (${last.grade})${geo ? ` · GEO ${geo.score}/100 (${geo.grade})` : ""}`
    : `Checkup: ${last.host} — otomatik ölçüm engellendi (bot koruması)`;
  const geoTop = geo?.recommendations?.slice(0, 3).map((r, i) => `GEO ${i + 1}. ${r.title}: ${r.evidence}`).join("\n") || "";
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: lead.name.value,
        reach: lead.reach.value,
        company: lead.company.value,
        type: "checkup",
        msg: `${headline}\n${todo.map((c, i) => `${i + 1}. ${c.label}: ${c.detail}`).join("\n")}${geoTop ? `\n${geoTop}` : ""}`.slice(0, 2000),
        page: location.pathname,
      }),
    });
    const data = await res.json();
    status.textContent = res.ok ? "Aldım. Tam raporu 24 saat içinde gönderiyorum." : data.error || "Gönderilemedi.";
    if (res.ok) lead.reset();
  } catch {
    status.textContent = "Bağlantı hatası. Lütfen tekrar deneyin.";
  } finally {
    btn.disabled = false;
  }
});

const preset = new URLSearchParams(location.search).get("site");
if (preset) {
  form.site.value = preset;
  run(preset);
}
