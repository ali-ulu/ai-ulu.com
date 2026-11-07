export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function attrs(map = {}) {
  return Object.entries(map)
    .filter(([, v]) => v !== false && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${escapeHtml(v)}"`))
    .join(" ");
}

// Small, dependency-free icon set (stroke icons, 24x24 viewBox).
const ICONS = {
  bolt: '<path d="M13 2 4.5 13H11l-1 9 8.5-11H12l1-9Z"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  shield: '<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  flow: '<path d="M4 6h10a4 4 0 0 1 4 4a4 4 0 0 1-4 4H8a4 4 0 0 0-4 4"/><path d="m16 14 3 3-3 3"/>',
  tools: '<path d="M14.5 6.5a3.5 3.5 0 0 1 4.9 4.9l-8 8-3.5.9.9-3.5 8-8Z"/><path d="m5 5 3 3"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 13 4 4 10-10"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  whatsapp: '<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z"/><path d="M8.5 8.5c0 4 3 7 7 7 1 0 1.5-.7 1.5-1.5l-1.8-1-1.2 1.2c-1.2-.5-2.2-1.5-2.7-2.7l1.2-1.2-1-1.8C10.7 8 9.5 8 8.5 8.5Z"/>',
};

export function icon(name, size = 22) {
  const path = ICONS[name] ?? ICONS.spark;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

export function raw(value) {
  return { __raw: String(value ?? "") };
}

export function join(list) {
  return list.map((item) => (item && item.__raw != null ? item.__raw : item ?? "")).join("");
}
