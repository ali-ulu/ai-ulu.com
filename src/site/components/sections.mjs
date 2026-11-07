import {
  hero,
  trustStrip,
  valueProps,
  templates,
  process,
  clientSteps,
  services,
  faq,
  contact,
} from "../content/site-content.mjs";
import { escapeHtml, icon } from "../lib/html.mjs";
import { site } from "../config.mjs";

export function heroSection() {
  const stats = hero.stats
    .map((s) => `<div class="hero__stat"><b>${escapeHtml(s.value)}</b><span>${escapeHtml(s.label)}</span></div>`)
    .join("");
  return `<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <span class="eyebrow">${escapeHtml(hero.eyebrow)}</span>
      <h1 class="hero__title">${escapeHtml(hero.title)}</h1>
      <p class="hero__subtitle">${escapeHtml(hero.subtitle)}</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="${hero.primaryCta.href}">${escapeHtml(hero.primaryCta.label)} ${icon("arrow", 18)}</a>
        <a class="btn btn--ghost" href="${hero.secondaryCta.href}">${escapeHtml(hero.secondaryCta.label)}</a>
      </div>
      <div class="hero__stats">${stats}</div>
    </div>
    <div class="preview" aria-hidden="true">
      <div class="preview__bar"><span class="preview__dot"></span><span class="preview__dot"></span><span class="preview__dot"></span></div>
      <div class="preview__body">
        <div class="preview__line preview__line--w60"></div>
        <div class="preview__line preview__line--w80"></div>
        <div class="preview__block"></div>
        <div class="preview__grid"><div class="preview__tile"></div><div class="preview__tile"></div></div>
      </div>
    </div>
  </div>
</section>`;
}

export function trustSection() {
  const items = trustStrip.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  return `<section class="trust"><div class="wrap"><ul class="trust__list">${items}</ul></div></section>`;
}

export function valueSection() {
  const cards = valueProps.items
    .map(
      (c) => `<article class="card">
      <div class="card__icon">${icon(c.icon)}</div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.text)}</p>
    </article>`
    )
    .join("");
  return `<section class="section" id="neden">
  <div class="wrap">
    <div class="section-head">
      <h2>${escapeHtml(valueProps.title)}</h2>
    </div>
    <div class="grid grid--3">${cards}</div>
  </div>
</section>`;
}

export function templatesSection() {
  const items = templates.items
    .map(
      (t) => `<article class="tpl">
      <div class="tpl__thumb" style="background:linear-gradient(135deg, ${escapeHtml(t.accent)}, color-mix(in srgb, ${escapeHtml(t.accent)} 45%, #0a0b0f))">
        <span class="tpl__mock" aria-hidden="true"><b>${escapeHtml(t.name)}</b><i></i><i></i></span>
      </div>
      <div class="tpl__body">
        <span class="tpl__sector">${escapeHtml(t.sector)}</span>
        <h3>${escapeHtml(t.name)}</h3>
        <p>${escapeHtml(t.note)}</p>
      </div>
    </article>`
    )
    .join("");
  return `<section class="section section--soft" id="sablonlar">
  <div class="wrap">
    <div class="section-head">
      <h2>${escapeHtml(templates.title)}</h2>
      <p>${escapeHtml(templates.subtitle)}</p>
    </div>
    <div class="grid grid--3">${items}</div>
  </div>
</section>`;
}

export function processSection() {
  const steps = process.steps
    .map(
      (s) => `<div class="step">
      <span class="step__n">${escapeHtml(s.n)}</span>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.text)}</p>
    </div>`
    )
    .join("");
  return `<section class="section" id="surec">
  <div class="wrap">
    <div class="section-head">
      <h2>${escapeHtml(process.title)}</h2>
      <p>${escapeHtml(process.subtitle)}</p>
    </div>
    <div class="steps">${steps}</div>
  </div>
</section>`;
}

export function clientStepsSection() {
  const steps = clientSteps.steps
    .map(
      (s, i) => `<div class="cstep">
      <span class="cstep__n">${i + 1}</span>
      <div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.text)}</p></div>
    </div>`
    )
    .join("");
  return `<section class="section section--soft" id="siz">
  <div class="wrap">
    <div class="section-head">
      <h2>${escapeHtml(clientSteps.title)}</h2>
      <p>${escapeHtml(clientSteps.subtitle)}</p>
    </div>
    <div class="csteps">${steps}</div>
  </div>
</section>`;
}

export function servicesSection() {
  const plans = services.items
    .map((p) => {
      const feats = p.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
      return `<article class="plan${p.featured ? " plan--featured" : ""}">
      ${p.featured ? '<span class="plan__badge">En çok tercih edilen</span>' : ""}
      <div><h3>${escapeHtml(p.name)}</h3><p class="plan__for">${escapeHtml(p.for)}</p></div>
      <ul>${feats}</ul>
      <a class="btn ${p.featured ? "btn--primary" : "btn--ghost"} btn--block" href="/#iletisim">Teklif al</a>
    </article>`;
    })
    .join("");
  return `<section class="section" id="hizmetler">
  <div class="wrap">
    <div class="section-head">
      <h2>${escapeHtml(services.title)}</h2>
      <p>${escapeHtml(services.subtitle)}</p>
    </div>
    <div class="plans">${plans}</div>
    <p class="form__note" style="margin-top:1.25rem">${escapeHtml(services.note)}</p>
  </div>
</section>`;
}

export function faqSection() {
  const items = faq.items
    .map(
      (f) => `<details>
      <summary>${escapeHtml(f.q)}</summary>
      <p>${escapeHtml(f.a)}</p>
    </details>`
    )
    .join("");
  return `<section class="section section--soft" id="sss">
  <div class="wrap">
    <div class="section-head"><h2>${escapeHtml(faq.title)}</h2></div>
    <div class="faq">${items}</div>
  </div>
</section>`;
}

export function contactSection() {
  const options = contact.projectTypes
    .map((o) => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`)
    .join("");
  return `<section class="section" id="iletisim">
  <div class="wrap">
    <div class="section-head">
      <h2>${escapeHtml(contact.title)}</h2>
      <p>${escapeHtml(contact.subtitle)}</p>
    </div>
    <div class="contact-grid">
      <form class="form" id="lead-form" novalidate>
        <div class="field">
          <label for="name">Ad Soyad / Firma <span aria-hidden="true">*</span></label>
          <input id="name" name="name" type="text" autocomplete="name" required maxlength="120">
        </div>
        <div class="field">
          <label for="reach">E-posta veya telefon <span aria-hidden="true">*</span></label>
          <input id="reach" name="reach" type="text" autocomplete="email" required maxlength="160">
        </div>
        <div class="field">
          <label for="type">Ne tür bir site istiyorsunuz?</label>
          <select id="type" name="type">${options}</select>
        </div>
        <div class="field">
          <label for="msg">Kısaca projeniz</label>
          <textarea id="msg" name="msg" maxlength="2000" placeholder="Sektör, istediğiniz sayfalar, örnek beğendiğiniz bir site..."></textarea>
        </div>
        <div class="field field--hp" aria-hidden="true">
          <label for="company">Şirket</label>
          <input id="company" name="company" type="text" tabindex="-1" autocomplete="off">
        </div>
        <button class="btn btn--primary btn--block" type="submit">Teklif isteyin</button>
        <p class="form__note">Gönderdiğiniz bilgiler yalnızca size dönüş yapmak için kullanılır. ${icon("shield", 14)}</p>
        <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
      </form>
      <aside class="contact-aside">
        <div class="card">
          <h3>Doğrudan ulaşın</h3>
          <p style="color:var(--text-muted);margin-top:.5rem">Form doldurmak istemezseniz:</p>
          <p style="margin-top:.75rem"><a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a></p>
          <p style="margin-top:.35rem"><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp'tan yaz</a></p>
        </div>
        <div class="card">
          <h3>Ne kadar sürer?</h3>
          <p style="color:var(--text-muted);margin-top:.5rem">Basit bir site genellikle 3–7 gün içinde yayında olur.</p>
        </div>
      </aside>
    </div>
  </div>
</section>`;
}

export function ctaBand() {
  return `<section class="section"><div class="wrap"><div class="cta-band">
    <h2>Hazır mısınız? Sitenizi konuşalım.</h2>
    <p>Ne istediğinizi kısaca anlatın; size uygun bir yol haritası ve net teklif çıkaralım.</p>
    <a class="btn btn--primary" href="/#iletisim">Ücretsiz teklif al ${icon("arrow", 18)}</a>
  </div></div></section>`;
}
