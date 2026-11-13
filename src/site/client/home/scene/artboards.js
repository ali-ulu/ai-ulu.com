// Canvas 2D painters, one per layer of the stack. Each is a pure function of
// (ctx, sector): no state, no WebGL. The scene uploads the result as a texture.
// Text here is illustration only; every fact it stands for is real HTML in the
// chapter beside it.

export const BOARD_W = 1024;
export const BOARD_H = 640;

const SANS = '"Hanken Grotesk",system-ui,sans-serif';
const SERIF = '"Bodoni Moda",Georgia,serif';
const MONO = '"JetBrains Mono",ui-monospace,monospace';
const ACCENT = '"Instrument Serif",Georgia,serif';
const INK = "#0e1013", BONE = "#ece7de", DIM = "#8f949c", AMBER = "#e0a458";

// Fonts the painters need; the scene waits for these before the first paint.
export const BOARD_FONTS = [`500 20px ${SANS}`, `400 20px ${SERIF}`, `400 20px ${MONO}`, `italic 400 20px ${ACCENT}`];

const rr = (c, x, y, w, h, r) => {
  c.beginPath();
  // roundRect is missing in Safari < 16; square corners are an acceptable fallback there.
  if (c.roundRect) c.roundRect(x, y, w, h, r);
  else c.rect(x, y, w, h);
};
const text = (c, font, color, str, x, y, align = "left") => {
  c.font = font; c.fillStyle = color; c.textAlign = align; c.fillText(str, x, y); c.textAlign = "left";
};
const wrap = (c, str, max) => {
  const lines = [""];
  for (const word of str.split(" ")) {
    const probe = lines[lines.length - 1] ? `${lines[lines.length - 1]} ${word}` : word;
    if (c.measureText(probe).width > max && lines[lines.length - 1]) lines.push(word);
    else lines[lines.length - 1] = probe;
  }
  return lines;
};
const label = (c, str, color) => text(c, `500 15px ${MONO}`, color, str, 56, 72);
const chip = (c, str, x, y, color) => {
  c.font = `500 15px ${MONO}`;
  const w = c.measureText(str).width + 28;
  c.strokeStyle = color; c.lineWidth = 1.5; rr(c, x, y, w, 36, 4); c.stroke();
  c.fillStyle = color; c.fillText(str, x + 14, y + 24);
  return w;
};

// 01 — the sample site for the chosen sector.
function design(c, s) {
  const { bg, ink, accent, block } = s.pal;
  c.fillStyle = bg; c.fillRect(0, 0, BOARD_W, BOARD_H);
  c.fillStyle = ink; c.beginPath(); c.arc(68, 66, 11, 0, 7); c.fill();
  text(c, `600 22px ${SANS}`, ink, s.brand, 92, 74);
  c.globalAlpha = 0.55;
  text(c, `500 16px ${SANS}`, ink, "Hizmetler      Hakkında      İletişim", 590, 72, "right");
  c.globalAlpha = 1;

  // right: an arched window, the page's one image area
  rr(c, 640, 44, 328, 552, 16); c.fillStyle = block; c.fill();
  c.fillStyle = accent; c.beginPath();
  c.moveTo(700, 596); c.lineTo(700, 300); c.arc(804, 300, 104, Math.PI, 0); c.lineTo(908, 596); c.closePath(); c.fill();
  c.fillStyle = bg; c.globalAlpha = 0.9; c.beginPath(); c.arc(804, 300, 34, 0, 7); c.fill(); c.globalAlpha = 1;
  c.shadowColor = "rgba(0,0,0,.16)"; c.shadowBlur = 30; c.shadowOffsetY = 12;
  rr(c, 600, 430, 212, 96, 10); c.fillStyle = "#fff"; c.fill();
  c.shadowColor = "transparent"; c.shadowBlur = 0; c.shadowOffsetY = 0;
  text(c, `600 17px ${SANS}`, ink, "Bugün açık", 622, 468);
  text(c, `400 16px ${SANS}`, "#6b6f6a", "09:00 – 19:00", 622, 498);

  // left: headline with one italic accent, sub line, action
  let y = s.lines.length > 2 ? 208 : 250;
  for (const line of s.lines) {
    let x = 54;
    for (const [str, acc] of line) {
      c.font = acc ? `italic 400 80px ${ACCENT}` : `500 66px ${SANS}`;
      c.fillStyle = acc ? accent : ink;
      c.fillText(str, x, y);
      x += c.measureText(str).width;
    }
    y += 78;
  }
  c.font = `400 20px ${SANS}`;
  wrap(c, s.sub, 500).forEach((ln, i) => text(c, `400 20px ${SANS}`, "#6b6f6a", ln, 56, y - 24 + i * 28));
  c.font = `500 19px ${SANS}`;
  const bw = c.measureText(`${s.cta}  ↗`).width + 56;
  rr(c, 56, 500, bw, 56, 6); c.fillStyle = ink; c.fill();
  text(c, `500 19px ${SANS}`, bg, `${s.cta}  ↗`, 84, 535);
  c.globalAlpha = 0.45; text(c, `500 14px ${SANS}`, ink, "Örnek tasarım", 56, 606); c.globalAlpha = 1;
}

// 02 — what loads when: a waterfall with the first paint marked.
function speed(c) {
  c.fillStyle = "#101216"; c.fillRect(0, 0, BOARD_W, BOARD_H);
  label(c, "02 — HIZ", AMBER);
  text(c, `400 62px ${SERIF}`, BONE, "Beklemeden açılır.", 54, 168);
  const rows = [["HTML", 0, 86], ["CSS", 60, 70], ["Yazı tipi", 96, 92], ["Görsel", 130, 150], ["Script", 330, 170]];
  rows.forEach(([name, at, w], i) => {
    const y = 262 + i * 52, late = i === rows.length - 1;
    text(c, `400 16px ${MONO}`, DIM, name, 56, y + 14);
    c.fillStyle = "rgba(236,231,222,.07)"; c.fillRect(200, y, 768, 18);
    rr(c, 200 + at, y, w, 18, 3); c.fillStyle = late ? "#4a4f58" : BONE; c.fill();
    if (late) text(c, `400 14px ${MONO}`, DIM, "ertelendi", 200 + at + w + 14, y + 14);
  });
  c.fillStyle = AMBER; c.fillRect(498, 232, 2, 300);
  text(c, `500 14px ${MONO}`, AMBER, "ilk boyama", 510, 244);
  let x = 56;
  for (const m of ["LCP ✓", "CLS ✓", "INP ✓"]) x += chip(c, m, x, 556, DIM) + 12;
}

// 03 — what a crawler reads: structured data on the left, the answer on the right.
function visibility(c, s) {
  c.fillStyle = "#11151b"; c.fillRect(0, 0, BOARD_W, BOARD_H);
  label(c, "03 — GÖRÜNÜRLÜK", AMBER);
  const COL = { p: "#7d8590", k: "#9ecbff", v: "#a5d6a7", t: AMBER };
  const code = [
    [["<", "p"], ["script ", "t"], ["type", "k"], ['="application/ld+json"', "v"], [">", "p"]],
    [["{", "p"]],
    [['  "@type"', "k"], [": ", "p"], [`"${s.schema}"`, "v"], [",", "p"]],
    [['  "name"', "k"], [": ", "p"], [`"${s.brand}"`, "v"], [",", "p"]],
    [['  "telephone"', "k"], [": ", "p"], ['"+90 …"', "v"], [",", "p"]],
    [['  "openingHours"', "k"], [": ", "p"], ['"Mo-Sa 09-19"', "v"]],
    [["}", "p"]],
    [["</", "p"], ["script", "t"], [">", "p"]],
  ];
  c.font = `400 17px ${MONO}`;
  code.forEach((line, i) => {
    let x = 56;
    for (const [str, kind] of line) { c.fillStyle = COL[kind]; c.fillText(str, x, 150 + i * 34); x += c.measureText(str).width; }
  });
  // search result
  rr(c, 600, 112, 368, 196, 12); c.fillStyle = "#1a2029"; c.fill();
  text(c, `400 14px ${MONO}`, DIM, "siteniz.com › hizmetler", 624, 150);
  text(c, `600 21px ${SANS}`, "#9ecbff", s.brand, 624, 186);
  c.font = `400 16px ${SANS}`;
  wrap(c, s.sub, 320).slice(0, 3).forEach((ln, i) => text(c, `400 16px ${SANS}`, "#c3c0b9", ln, 624, 218 + i * 24));
  // assistant answer citing the site
  rr(c, 600, 328, 368, 150, 12); c.strokeStyle = "rgba(224,164,88,.5)"; c.lineWidth = 1.5; c.stroke();
  c.fillStyle = AMBER; c.beginPath(); c.arc(632, 362, 6, 0, 7); c.fill();
  text(c, `500 15px ${MONO}`, AMBER, "yapay zekâ yanıtı", 650, 367);
  for (const [i, w] of [[0, 300], [1, 260], [2, 180]]) { c.fillStyle = "rgba(236,231,222,.18)"; c.fillRect(624, 388 + i * 20, w, 8); }
  text(c, `400 14px ${MONO}`, DIM, "kaynak: siteniz.com", 624, 462);
  let x = 56;
  for (const m of ["schema.org", "sitemap.xml", "llms.txt", "robots.txt"]) x += chip(c, m, x, 556, DIM) + 12;
}

// 04 — the moment a visitor becomes a lead.
function conversion(c, s) {
  c.fillStyle = AMBER; c.fillRect(0, 0, BOARD_W, BOARD_H);
  label(c, "04 — DÖNÜŞÜM", "rgba(14,16,19,.7)");
  text(c, `400 62px ${SERIF}`, INK, "Tek dokunuş.", 54, 168);
  c.font = `400 19px ${SANS}`;
  const ask = wrap(c, s.ask, 300);
  const h = 44 + ask.length * 26;
  rr(c, 560, 210, 360, h, 14); c.fillStyle = "#fff8ec"; c.fill();
  ask.forEach((ln, i) => text(c, `400 19px ${SANS}`, INK, ln, 584, 248 + i * 26));
  rr(c, 708, 230 + h, 260, 62, 14); c.fillStyle = INK; c.fill();
  text(c, `400 19px ${SANS}`, BONE, "Tabii, hemen bakıyorum.", 730, 268 + h);
  rr(c, 56, 500, 250, 60, 6); c.fillStyle = INK; c.fill();
  text(c, `600 19px ${SANS}`, BONE, "WhatsApp'tan yaz  ↗", 82, 537);
  rr(c, 322, 500, 110, 60, 6); c.strokeStyle = INK; c.lineWidth = 2; c.stroke();
  text(c, `600 19px ${SANS}`, INK, "Ara", 377, 537, "center");
  text(c, `400 20px ${SANS}`, "rgba(14,16,19,.75)", "Ziyaretçi aklındayken yazar,", 56, 300);
  text(c, `400 20px ${SANS}`, "rgba(14,16,19,.75)", "mesaj telefonunuza düşer.", 56, 328);
}

// Top of the stack first. `edge` is the colour of the slab's side.
export const boards = [
  { paint: design, edge: (s) => s.pal.block },
  { paint: speed, edge: () => "#23272e" },
  { paint: visibility, edge: () => "#252c37" },
  { paint: conversion, edge: () => "#a8752f" },
];
