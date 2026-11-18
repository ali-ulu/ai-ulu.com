// /checkup/: runs the free site test and offers the full report.
const SHOWN = 3;
const form = document.getElementById("ck-form");
const out = document.getElementById("ck-out");
const status = document.getElementById("ck-status");
const list = document.getElementById("ck-list");
const more = document.getElementById("ck-more");
const wa = document.getElementById("ck-wa");
const lead = document.getElementById("ck-lead");
const leadStatus = document.getElementById("ck-lead-status");
let last = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector("button");
  const site = form.site.value.trim();
  btn.disabled = true;
  status.textContent = "Siteniz ölçülüyor, 10-20 saniye sürebilir…";
  out.hidden = true;
  try {
    const res = await fetch(`/api/checkup?site=${encodeURIComponent(site)}`);
    const data = await res.json();
    if (!res.ok) { status.textContent = data.error || "Test yapılamadı."; return; }
    last = data;
    const n = data.findings.length;
    status.textContent = n ? `${data.host}: ${n} sorun bulundu.` : `${data.host}: otomatik kontrollerde sorun çıkmadı.`;
    list.replaceChildren(...data.findings.slice(0, SHOWN).map((f) => Object.assign(document.createElement("li"), { textContent: f })));
    more.textContent = n > SHOWN ? `+${n - SHOWN} bulgu daha tam raporda.` : "";
    wa.href = `${wa.dataset.base}?text=${encodeURIComponent(`Merhaba, ${data.host} için checkup yaptım (${n} bulgu). Tam raporu alabilir miyim?`)}`;
    out.hidden = false;
  } catch {
    status.textContent = "Bağlantı hatası. Lütfen tekrar deneyin.";
  } finally {
    btn.disabled = false;
  }
});

lead.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!last) return;
  const btn = lead.querySelector("button");
  btn.disabled = true;
  leadStatus.textContent = "Gönderiliyor…";
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: lead.name.value,
        reach: lead.reach.value,
        company: lead.company.value,
        type: "checkup",
        msg: `Checkup: ${last.host}\n${last.findings.map((f, i) => `${i + 1}. ${f}`).join("\n")}`.slice(0, 2000),
        page: location.pathname,
      }),
    });
    const data = await res.json();
    leadStatus.textContent = res.ok ? "Aldım. Tam raporu 24 saat içinde gönderiyorum." : data.error || "Gönderilemedi.";
    if (res.ok) lead.reset();
  } catch {
    leadStatus.textContent = "Bağlantı hatası. Lütfen tekrar deneyin.";
  } finally {
    btn.disabled = false;
  }
});
