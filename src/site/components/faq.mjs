import { site } from "../config.mjs";
import { faq } from "../content/site-content.mjs";
import { escapeHtml } from "../lib/html.mjs";

// FAQ Index drawer (adapted from the Framer "FaqDrawer" block). Each question
// is an index card standing in a recessed drawer, typed along its top edge on
// a staggered tab. Native <details>/<summary> carries the disclosure and the
// shared `name` keeps one card open at a time, so this needs no JavaScript.
// It lives on its own page (/sss/) so the home page stays short.
const FAQ_TAB_STATIONS = [0.04, 0.37, 0.7];
const faqCard = (f, i, n, uid) => {
  // How far into the drawer the card stands: 0 at the front, 1 at the back.
  const depth = n <= 1 ? 0 : (n - 1 - i) / (n - 1);
  const no = `S.${String(i + 1).padStart(2, "0")}`;
  return `<details class="fq-card" name="${uid}"${i === 0 ? " open" : ""} style="--k:${i};--depth:${depth.toFixed(3)};--tab-at:${FAQ_TAB_STATIONS[i % FAQ_TAB_STATIONS.length]}">
      <summary class="fq-edge">
        <span class="fq-tab" aria-hidden="true">${escapeHtml(f.tab)}</span>
        <span class="fq-no" aria-hidden="true">${no}</span>
        <span class="fq-q">${escapeHtml(f.q)}</span>
        <span class="fq-mark" aria-hidden="true"></span>
      </summary>
      <div class="fq-face"><p class="fq-a">${escapeHtml(f.a)}</p><p class="fq-filed" aria-hidden="true">${escapeHtml(f.tab)} · ${no}</p></div>
    </details>`;
};

export const faqSection = () => {
  const items = faq.items;
  const uid = "faq-drawer";
  return `<section class="s" id="sss" aria-labelledby="sss-title">
  <div class="fq">
    <div class="fq-wrap">
      <header class="fq-head">
        <h1 class="fq-title" id="sss-title">Merak <em>edilenler</em></h1>
        <p class="fq-lead">Sitenizi kurmadan önce en çok sorulanlar. Okumak için bir kart açın.</p>
      </header>
      <div class="fq-cabinet">
        <div class="fq-drawer">
          <div class="fq-tray">
            ${items.map((f, i) => faqCard(f, i, items.length, uid)).join("\n            ")}
          </div>
          <div class="fq-front" aria-hidden="true">
            <span class="fq-holder"><span class="fq-holder-card">ai-ulu · SSS</span></span>
            <span class="fq-pull"></span>
          </div>
        </div>
        <div class="fq-ask">
          <p class="fq-note">Aradığınızı bulamadınız mı? Bir kişi yanıtlar, genellikle aynı gün.</p>
          <a class="fq-key" href="mailto:${site.email}">Bize sorun</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
};
