import { site, waLink } from "../config.mjs";
import { budgets, projectTypes } from "../content/site-content.mjs";
import { escapeHtml } from "../lib/html.mjs";

// One primary action: a free call on WhatsApp. Each block that offers it uses
// its own message so no two buttons on one screen are the same link.
const waTalk = waLink("Merhaba, web sitem için ücretsiz görüşme istiyorum.");
const waQuote = waLink("Merhaba, web sitesi için teklif almak istiyorum.");

// Cloudflare Turnstile, rendered only when a site key is configured. Empty key
// means no third-party script, no iframe, and the CSP stays 'self'-only.
function turnstileWidget() {
  if (!site.turnstileSiteKey) return "";
  return `<div class="cf-turnstile" data-sitekey="${escapeHtml(site.turnstileSiteKey)}" data-theme="light"></div>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`;
}

// Kept for compatibility; the home page no longer covers the hero with a
// loader, so the title is readable on the first paint.
export const preloader = "";

// Without JS the 3D film never runs, so every chapter stays at opacity:0 and the
// page reads as empty. These rules (a static copy of the `.no-3d` fallback)
// flatten the chapters into a plain, scrollable column.
export const noJsStyles = `<noscript><style>
#vortex,#gl,.tag,.prog,.hint{display:none}
#film{height:auto}
.stage{position:static;height:auto;padding:2rem 0 4rem;background:none}
.ch{position:static;transform:none;opacity:1;visibility:visible;pointer-events:auto;margin:0 auto 5rem;padding:0 var(--pad);text-align:left;max-width:44rem;width:auto}
.ch.right{left:auto;right:auto;text-align:left}
.ch.right p,.ch.right .cta{margin-left:0;justify-content:flex-start}
</style></noscript>`;

// The hero stands alone on the first screen as a rounded stage panel: title top
// left, services top right, one sentence and the action bottom left.
const hero = `<section class="hero" id="c0" data-enter aria-labelledby="hero-title">
  <div class="hero-panel">
    <h1 id="hero-title">Müşteri getiren <em>web siteleri</em></h1>
    <ul class="hero-list" aria-label="Neler dahil">
      <li>Özgün tasarım</li>
      <li>Google'da görünürlük</li>
      <li>Yapay zekâ aramaları</li>
      <li>Tek dokunuşla iletişim</li>
    </ul>
    <div class="hero-foot">
      <p>Sıfırdan tasarlanan, aranınca bulunan, WhatsApp'a bağlı siteler kuruyoruz. Görüşmeden sonra 24 saat içinde yazılı teklif.</p>
      <div class="cta">
        <a class="btn" href="${waTalk}" rel="noopener">Ücretsiz görüşme <span class="dot" aria-hidden="true"></span></a>
        <a class="link" href="/checkup/">Siteniz bulunuyor mu? Ücretsiz test</a>
      </div>
    </div>
  </div>
</section>`;

// data-a / data-b: scroll progress (0–1) where each chapter fades in and out (read by ora.js).
const film = `<div id="film">
  <div class="stage">
    <canvas id="gl" aria-hidden="true"></canvas>
    <img class="poster" src="/img/laptop.webp" width="920" height="700" alt="Laptop ekranında örnek bir klinik sitesi" decoding="async" loading="lazy">

    <div class="ch" id="c1" data-a=".02" data-b=".3">
      <h2>Her satır <em>sizin için</em> yazılır.</h2>
      <p>Hazır şablon yok. Siteniz işletmenizin hedefine göre sıfırdan kodlanır.</p>
    </div>

    <div class="ch right" id="c2" data-a=".36" data-b=".62">
      <h2>Güzel görünmesi <em>yetmez.</em></h2>
      <p>Her katman bir iş için çalışır: sizi bulduran, ikna eden ve aratan bir site.</p>
    </div>

    <div class="ch" id="c3" data-a=".7" data-b="1.01">
      <h2>Müşteriniz sizi <em>bulsun.</em></h2>
      <p>Telefonda hızlı açılan, tek dokunuşla WhatsApp'tan size ulaştıran bir site.</p>
    </div>

    <div class="tag"><b>Tasarım</b>Markanıza özel arayüz</div>
    <div class="tag"><b>Hız</b>Saniyeler içinde açılış</div>
    <div class="tag"><b>Görünürlük</b>Google ve yapay zekâ aramaları</div>
    <div class="tag"><b>Dönüşüm</b>Tek dokunuşla WhatsApp</div>
  </div>
</div>`;

const benefits = `<section class="s" id="nasil" aria-labelledby="nasil-title">
  <h2 id="nasil-title">Ziyaretçi gelir, <em>müşteri</em> olarak kalır.</h2>
  <ul class="cards g4">
    <li class="card"><h3>Özgün tasarım</h3><p>Sektörünüze ve markanıza göre çizilmiş, şablon olmayan bir site.</p></li>
    <li class="card"><h3>Google'da görünürlük</h3><p>Teknik SEO, hız ve yapılandırılmış veri ilk günden içinde.</p></li>
    <li class="card"><h3>Yapay zekâ aramaları</h3><p>ChatGPT ve Gemini'nin okuyabildiği yapı, şema ve temiz HTML.</p></li>
    <li class="card"><h3>Doğrudan iletişim</h3><p>Her sayfada tek dokunuşla WhatsApp ve arama.</p></li>
  </ul>
</section>`;

// The largest objection people type into search is "can I just build it with AI
// for free?". Answering it head-on beats ignoring it. No invented numbers.
const why = `<section class="s split" id="neden" aria-labelledby="neden-title">
  <div class="split-head">
    <h2 id="neden-title">Yapay zekâ varken <em>neden biz?</em></h2>
    <p class="lead">"Yapay zekâ ile bedava yaparım" diyenlere <a href="/blog/yapay-zeka-ile-web-sitesi-yapmak/">kısa cevabımız</a>.</p>
  </div>
  <ul class="points">
    <li><h3>Doğru metin, doğru müşteri</h3><p>Araç işinizi ve müşterinizi bilmez; arayan kişinin duymak istediği cümleyi biz yazarız.</p></li>
    <li><h3>Siteniz sizin</h3><p>Alan adı, kod ve içerik sizin adınıza teslim edilir.</p></li>
    <li><h3>Yayından sonra da çalışır</h3><p>Hızı, görünürlüğü ve dönüşümü ölçer, gerektiğinde düzeltiriz.</p></li>
  </ul>
</section>`;

const process = `<section class="s" id="surec" aria-labelledby="surec-title">
  <h2 id="surec-title">Üç adımda <em>yayında.</em></h2>
  <ol class="cards g3">
    <li class="card"><h3>Hedefi konuşuruz</h3><p>Ücretsiz 30 dakikalık görüşmede hedef, kapsam ve takvim netleşir.</p></li>
    <li class="card"><h3>Canlı izlersiniz</h3><p>İlk haftadan tıklanabilir önizleme.</p></li>
    <li class="card"><h3>Yanınızda kalırız</h3><p>Gerçek cihazlarda test, yayın ve sonrasında değişiklikler.</p></li>
  </ol>
</section>`;



const packages = `<section class="s" id="paketler" aria-labelledby="paketler-title">
  <div class="pk-head">
    <h2 id="paketler-title">Paketi seçin, <em>net teklif</em> alın.</h2>
    <p class="lead">${site.priceFrom ? `Tanıtım siteleri ${escapeHtml(site.priceFrom)} başlar; kalan kapsam projeye göre netleşir.` : "Fiyat listesi yok; her proje kendi kapsamıyla fiyatlanır."} Fiyatı neyin belirlediğini <a href="/blog/web-sitesi-fiyatini-ne-belirler/">rehberde</a> anlattık.</p>${site.serviceAreas.length ? `
    <p class="pk-areas">Hizmet bölgeleri: ${site.serviceAreas.map((a) => escapeHtml(a)).join(", ")}</p>` : ""}
  </div>
  <div class="grid g3">
    <div class="card"><h3>Tanıtım sitesi</h3><ul><li>Markanıza özel tasarım</li><li>Hızlı açılış</li><li>Google ve yapay zekâ aramalarına hazır</li><li>Yayın ve sonrası destek</li></ul></div>
    <div class="card"><h3>Özel web uygulaması</h3><ul><li>Panel, portal, otomasyon</li><li>İş akışınıza göre kurulur</li><li>Randevu, sipariş, form</li><li>Yayın ve sonrası destek</li></ul></div>
    <div class="card hi"><p class="flag">En kapsamlı</p><h3>Site + uygulama</h3><ul><li>İkisinde tek tasarım dili</li><li>Tanıtım ve ürün bir arada</li><li>Tek ekip, tek muhatap</li><li>Yayın ve sonrası destek</li></ul></div>
  </div>
  <div class="pk-band">
    <p>Görüşmeden sonra 24 saat içinde yazılı teklif.</p>
    <a class="btn" href="${waQuote}" rel="noopener">WhatsApp'tan teklif al <span class="dot" aria-hidden="true"></span></a>
  </div>
</section>`;


// Postcard contact form (adapted from the Framer "Postmark" block). The field
// names, the ids (lead-form, form-status) and the JSON shape are the /api/lead
// contract in src/worker.js — do not rename them. Stamps are the form's topics
// and map onto the existing `type` field, so the endpoint is unchanged.
const stampMarkup = (o, i) => `<label>
        <input type="radio" name="type" value="${o.value}"${i === 0 ? " checked" : ""}>
        <span class="pm-stamp" style="--pm-tilt-stamp:${["-2deg", "1.5deg", "-1deg", "2.5deg"][i % 4]}">
          <i class="pm-glyph" aria-hidden="true">${escapeHtml(o.glyph)}</i>
          <span>${escapeHtml(o.label)}</span>
        </span>
      </label>`;

const postmarkSeal = `<svg class="pm-seal" viewBox="0 0 100 100" aria-hidden="true">
      <defs><path id="pm-seal-arc" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.4"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <text><textPath href="#pm-seal-arc" startOffset="0%">AI-ULU · POSTA DAMGASI · WEB SITESI ·</textPath></text>
    </svg>`;

const contact = () => `<section class="s" id="iletisim" aria-labelledby="iletisim-title">
  <div class="close-panel">
    <h2 id="iletisim-title">Siteniz için <em>ilk adım.</em></h2>
    <p class="lead">30 dakikalık ücretsiz görüşmede hedefinizi konuşalım. Ya da arayın: <a class="nowrap" href="tel:${site.phone}">${site.phoneDisplay}</a></p>
    <a class="btn" href="${waTalk}" rel="noopener">Ücretsiz görüşme <span class="dot" aria-hidden="true"></span></a>
    <p class="close-alt">Form doldurmayı tercih ederseniz aşağıya yazın, 24 saat içinde dönelim.</p>
  </div>
  <div class="pm">
    <form class="pm-card" id="lead-form" novalidate>
      ${postmarkSeal}
      <div class="pm-body">
        <div class="pm-left">
          <p class="pm-greet" aria-hidden="true">Sevgili ai-ulu,</p>
          <div class="pm-write">
            <label class="pm-label" for="msg">Kısaca projeniz</label>
            <textarea id="msg" name="msg" maxlength="280" placeholder="Sektörünüz, istediğiniz sayfalar, beğendiğiniz bir site…"></textarea>
            <span class="pm-count" id="pm-count" aria-hidden="true">0 / 280</span>
          </div>
          <p class="pm-sign" aria-hidden="true"><b id="pm-sign">imzanız</b>, gönderen</p>
        </div>
        <div class="pm-right">
          <fieldset class="pm-stamps">
            <legend>Konu · bir pul seçin</legend>
            ${projectTypes.map(stampMarkup).join("\n            ")}
          </fieldset>
          <div class="pm-block">
            <p class="pm-label">Kime</p>
            <p class="pm-addr"><strong>ai-ulu</strong>Stüdyo · web siteleri ve uygulamalar</p>
          </div>
          <div class="pm-block">
            <p class="pm-label">Kimden</p>
            <div class="pm-fields">
              <label class="pm-label" for="name">Ad Soyad / Firma</label>
              <input id="name" name="name" type="text" autocomplete="name" required minlength="2" maxlength="120">
              <label class="pm-label" for="reach">E-posta veya telefon</label>
              <input id="reach" name="reach" type="text" autocomplete="off" inputmode="text" required maxlength="160">
            </div>
          </div>
          <div class="pm-block">
            <label class="pm-label" for="budget">Bütçe</label>
            <div class="pm-fields">
              <select id="budget" name="budget">
                ${budgets.map((b) => `<option value="${b.value}">${escapeHtml(b.label)}</option>`).join("\n                ")}
              </select>
            </div>
          </div>
          <div class="field--hp" aria-hidden="true">
            <label for="company">Şirket</label>
            <input id="company" name="company" type="text" tabindex="-1" autocomplete="off">
          </div>
          <input type="hidden" id="utm_source" name="utm_source" value="">
          <input type="hidden" id="utm_campaign" name="utm_campaign" value="">
        </div>
      </div>
      <div class="pm-foot">
        ${turnstileWidget()}<button class="pm-btn" type="submit">Postayı at</button>
        <p class="form__note">Bilgileriniz yalnızca size dönüş yapmak için kullanılır. Ayrıntılar: <a href="/gizlilik/">Gizlilik ve KVKK</a>.</p>
        <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
      </div>
    </form>
    <div class="pm-thanks" id="pm-thanks" hidden>
      <b>Posta yola çıktı</b>
      <p>Teşekkürler! Mesajınız alındı, 24 saat içinde dönüş yapacağız.</p>
    </div>
  </div>
</section>`;

// Price (packages) comes right after the first benefits block; "why us" and the
// process follow for readers who want more. The free test lives in the hero link.
export const homeBody = () => [hero, film, benefits, packages, why, process, contact()].join("\n\n");
