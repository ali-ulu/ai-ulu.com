// The two-tap funnel: tap a sector, tap WhatsApp. Picking a sector rewrites
// every wa.me link on the page with a message that already says what the
// visitor wants, relabels the primary call to action and prefills the contact
// form. Works with or without the 3D scene; the scene only listens.

export const waHref = (href, text) => `${href.split("?")[0]}?text=${encodeURIComponent(text)}`;

export function createFunnel(doc, sectors) {
  const picker = doc.getElementById("sectors");
  const listeners = new Set();
  let prefill = "";
  if (!picker) return { onChange() {}, current: null };

  function apply(sector) {
    for (const a of doc.querySelectorAll('a[href^="https://wa.me/"]')) a.href = waHref(a.href, sector.wa);
    for (const el of doc.querySelectorAll("[data-cta-label]")) el.textContent = `${sector.label} için ücretsiz görüşme`;
    // Prefill the form only while the visitor has not written their own message.
    const msg = doc.getElementById("msg");
    if (msg && (msg.value === "" || msg.value === prefill)) {
      prefill = msg.value = `${sector.label} için web sitesi istiyorum.`;
      msg.dispatchEvent(new Event("input", { bubbles: true }));
    }
    for (const fn of listeners) fn(sector);
  }

  const find = () => sectors.find((s) => s.id === picker.querySelector("input:checked")?.value) ?? null;
  picker.addEventListener("change", () => { const s = find(); if (s) apply(s); });
  // A restored page (back/forward cache, reload) can arrive with a chip already checked.
  const initial = find();
  if (initial) apply(initial);

  return {
    onChange(fn) { listeners.add(fn); },
    get current() { return find(); },
  };
}
