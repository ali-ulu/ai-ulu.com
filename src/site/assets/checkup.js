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

function checkItem(c) {
  const li = el("li", `ck-item ck-${c.status}`);
  li.append(el("strong", "", c.label), el("span", "ck-detail", c.detail));
  if (c.status === "fail" || c.status === "warn") li.append(el("span", "ck-howto", `Nasıl düzelir: ${c.fix}`));
  return li;
}

function render(d) {
  $("ck-grade").textContent = d.grade;
  $("ck-grade").dataset.g = d.grade;
  $("ck-num").textContent = d.score;
  $("ck-sum").textContent = `${d.host}: ${SUMMARY[d.grade]}`;
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
  const maps = $("ck-maps");
  maps.hidden = !d.maps?.url;
  if (d.maps?.url) {
    maps.replaceChildren(`Google Haritalar'da bulunan profil: `, Object.assign(el("a", "", d.maps.name), { href: d.maps.url, target: "_blank", rel: "noopener" }));
  }
  const todo = d.checks.filter((c) => c.status === "fail" || c.status === "warn").sort((a, b) => (b.max - b.points) - (a.max - a.points));
  const rest = d.checks.filter((c) => !todo.includes(c));
  $("ck-fix").replaceChildren(...(todo.length ? todo.map(checkItem) : [el("li", "", "Otomatik kontrollerde düzeltilecek bir şey çıkmadı.")]));
  $("ck-ok").replaceChildren(...rest.map(checkItem));
  $("ck-pass-sum").textContent = `Geçen ve ölçülemeyen kontroller (${rest.length})`;
  $("ck-wa").href = `${$("ck-wa").dataset.base}?text=${encodeURIComponent(`Merhaba, ${d.host} için checkup yaptım (${d.score}/100, ${todo.length} düzeltme). Tam raporu alabilir miyim?`)}`;
  $("ck-out").hidden = false;
}

async function run(site, name = "") {
  const btn = form.querySelector("button");
  btn.disabled = true;
  $("ck-status").textContent = "Siteniz ölçülüyor, 10-30 saniye sürebilir…";
  $("ck-out").hidden = true;
  try {
    const q = new URLSearchParams({ site });
    if (name) q.set("name", name);
    const res = await fetch(`/api/checkup?${q}`);
    const data = await res.json();
    if (!res.ok) { $("ck-status").textContent = data.error || "Test yapılamadı."; return; }
    last = data;
    $("ck-status").textContent = "";
    history.replaceState(null, "", `?${new URLSearchParams(name ? { site: data.host, name } : { site: data.host })}`);
    render(data);
  } catch {
    $("ck-status").textContent = "Bağlantı hatası. Lütfen tekrar deneyin.";
  } finally {
    btn.disabled = false;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  run(form.site.value.trim(), form.name.value.trim());
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
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: lead.name.value,
        reach: lead.reach.value,
        company: lead.company.value,
        type: "checkup",
        msg: `Checkup: ${last.host} — ${last.score}/100 (${last.grade})\n${todo.map((c, i) => `${i + 1}. ${c.label}: ${c.detail}`).join("\n")}`.slice(0, 2000),
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

const params = new URLSearchParams(location.search);
const preset = params.get("site");
if (preset) {
  form.site.value = preset;
  form.name.value = params.get("name") || "";
  run(preset, form.name.value);
}
