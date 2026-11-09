import { site } from "../config.mjs";
import { faq, projectTypes } from "../content/site-content.mjs";
import { escapeHtml } from "../lib/html.mjs";

const wa = `<a class="btn" href="${site.whatsapp}" rel="noopener">`;


// data-a / data-b: scroll progress (0–1) where each chapter fades in and out (read by ora.js).
const film = `<div id="film">
  <div class="stage">
    <canvas id="gl" aria-hidden="true"></canvas>

    <div class="ch" id="c0" data-a="0" data-b=".085">
      <span class="eyebrow">Web sitesi · Tasarım · Görünürlük</span>
      <h1>Müşteri getiren bir web sitesi <em>ister misiniz?</em></h1>
      <p>Harika tasarım, Google'da ve yapay zekâ aramalarında görünen, ziyaretçiyi müşteriye çeviren siteler kuruyoruz.</p>
      <div class="cta">
        ${wa}Ücretsiz görüşme <span aria-hidden="true">→</span></a>
        <a class="btn ghost" href="#nasil">Nasıl kuruyoruz</a>
      </div>
    </div>

    <div class="ch" id="c1" data-a=".14" data-b=".36">
      <span class="eyebrow">01 — Kod</span>
      <h2>Her satır <em>sizin için</em> yazılır.</h2>
      <p>Hazır şablon yok. Siteniz sıfırdan, işletmenizin hedefine göre kodlanır: hızlı, temiz ve size ait.</p>
    </div>

    <div class="ch right" id="c2" data-a=".42" data-b=".58">
      <span class="eyebrow">02 — Tasarım</span>
      <h2>Kod, <em>vitrininize</em> dönüşür.</h2>
      <p>Sektörünüze özel, ilk saniyede güven veren bir tasarım. Rakiplerinizden ayrışırsınız.</p>
    </div>

    <div class="ch" id="c3" data-a=".64" data-b=".8">
      <span class="eyebrow">03 — İçinde ne var</span>
      <h2>Güzel görünmesi <em>yetmez.</em></h2>
      <p>Her katman tek bir iş için çalışır: sizi bulduran, ikna eden ve aratan bir site.</p>
    </div>

    <div class="ch right" id="c4" data-a=".88" data-b="1.01">
      <span class="eyebrow">04 — Yayında</span>
      <h2>Müşteriniz sizi <em>bulsun.</em></h2>
      <p>Telefonda kusursuz, saniyeler içinde açılan, tek dokunuşla WhatsApp'tan size ulaştıran siteniz hazır.</p>
      <div class="cta"><a class="btn" href="#iletisim">Projeyi başlatalım <span aria-hidden="true">→</span></a></div>
    </div>

    <div class="tag" aria-hidden="true"><b>Tasarım</b>Markanıza özel arayüz</div>
    <div class="tag" aria-hidden="true"><b>Hız</b>Saniyeler içinde açılış</div>
    <div class="tag" aria-hidden="true"><b>Görünürlük</b>Google + yapay zekâ aramaları</div>
    <div class="tag" aria-hidden="true"><b>Dönüşüm</b>Tek dokunuşla WhatsApp</div>

    <div class="prog" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="hint" id="hint" aria-hidden="true">Kaydırın</div>
  </div>
</div>`;

const benefits = `<section class="s" id="nasil">
  <span class="eyebrow">Ne kazanırsınız</span>
  <h2>Ziyaretçi gelir, <em>müşteri</em> olarak kalır.</h2>
  <p class="lead">Çoğu site ilk kaydırmada ziyaretçiyi kaybeder. Sorun marka değil, kurulum. Biz kurulumu baştan doğru yaparız.</p>
  <div class="grid g4">
    <div class="cell"><span class="n">01</span><h3>Özgün tasarım</h3><p>Şablon değil; sektörünüze ve markanıza göre çizilmiş bir site.</p></div>
    <div class="cell"><span class="n">02</span><h3>Google'da görünürlük</h3><p>Teknik SEO, hız ve yapılandırılmış veri ilk günden sitenin içinde.</p></div>
    <div class="cell"><span class="n">03</span><h3>Yapay zekâ aramaları</h3><p>ChatGPT, Gemini ve Google'ın yapay zekâ yanıtlarının okuyabildiği yapı: llms.txt, şema, temiz HTML.</p></div>
    <div class="cell"><span class="n">04</span><h3>Doğrudan iletişim</h3><p>Her sayfada tek dokunuşla WhatsApp ve arama. Ziyaretçi aklındayken size ulaşır.</p></div>
  </div>
</section>`;

const process = `<section class="s">
  <span class="eyebrow">Süreç</span>
  <h2>Üç adımda <em>yayında.</em></h2>
  <div class="grid g3">
    <div class="cell"><span class="n">01 · Görüşme</span><h3>Hedefi konuşuruz</h3><p>Ücretsiz 30 dakikalık görüşme. Hedef, kapsam ve takvim netleşir.</p></div>
    <div class="cell"><span class="n">02 · Kurulum</span><h3>Canlı izlersiniz</h3><p>Tasarım ve geliştirme açıkta ilerler; ilk haftadan tıklanabilir önizleme.</p></div>
    <div class="cell"><span class="n">03 · Yayın</span><h3>Yanınızda kalırız</h3><p>Gerçek cihazlarda test eder, yayına alır, sonrasında da düzeltme ve değişiklikleri yaparız.</p></div>
  </div>
</section>`;

const packages = `<section class="s" id="paketler">
  <span class="eyebrow">Paketler</span>
  <h2>Paketi seçin, <em>net teklif</em> alın.</h2>
  <p class="lead">Fiyat listesi yok; her proje kendi kapsamıyla fiyatlanır. Görüşmeden sonra 24 saat içinde yazılı teklif gelir. Tarzları görmek için <a href="/sablonlar/">örnek tasarımlara</a> bakabilirsiniz.</p>
  <div class="grid g3">
    <div class="cell"><span class="n">Web sitesi</span><h3>Tanıtım sitesi</h3><ul><li>Markanıza özel tasarım</li><li>Hızlı açılış, akıcı hareket</li><li>Google ve YZ aramalarına hazır</li><li>Yayın ve sonrası destek</li></ul><a class="btn ghost" href="#iletisim">Teklif al</a></div>
    <div class="cell"><span class="n">Uygulama</span><h3>Özel web uygulaması</h3><ul><li>Panel, portal, otomasyon</li><li>İş akışınıza göre kurulur</li><li>Randevu, sipariş, form</li><li>Yayın ve sonrası destek</li></ul><a class="btn ghost" href="#iletisim">Teklif al</a></div>
    <div class="cell hi"><span class="n">En kapsamlı</span><h3>Site + uygulama</h3><ul><li>İkisinde tek tasarım dili</li><li>Tanıtım ve ürün bir arada</li><li>Tek ekip, tek muhatap</li><li>Yayın ve sonrası destek</li></ul><a class="btn" href="#iletisim">Teklif al</a></div>
  </div>
</section>`;

const faqSection = () => `<section class="s" id="sss">
  <span class="eyebrow">SSS</span>
  <h2>Merak <em>edilenler</em></h2>
  <div class="faq">
    ${faq.items.map((f) => `<details><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`).join("\n    ")}
  </div>
</section>`;

// Field names are the /api/lead contract in src/worker.js (company = honeypot).
const contact = () => `<section class="s" id="iletisim">
  <span class="eyebrow">İletişim</span>
  <h2>Siteniz için <em>ilk adım.</em></h2>
  <p class="lead">Ne kurmak istediğinizi birkaç cümleyle yazın; 24 saat içinde ücretsiz görüşme için dönelim.</p>
  <div class="contact-grid">
    <form class="form" id="lead-form" novalidate>
      <div class="field">
        <label for="name">Ad Soyad / Firma</label>
        <input id="name" name="name" type="text" autocomplete="name" required minlength="2" maxlength="120">
      </div>
      <div class="field">
        <label for="reach">E-posta veya telefon</label>
        <input id="reach" name="reach" type="text" autocomplete="email" required maxlength="160">
      </div>
      <div class="field">
        <label for="type">Ne istiyorsunuz?</label>
        <select id="type" name="type">${projectTypes.map((o) => `<option value="${o.value}">${escapeHtml(o.label)}</option>`).join("")}</select>
      </div>
      <div class="field">
        <label for="msg">Kısaca projeniz</label>
        <textarea id="msg" name="msg" maxlength="2000" placeholder="Sektörünüz, istediğiniz sayfalar, beğendiğiniz bir site…"></textarea>
      </div>
      <div class="field field--hp" aria-hidden="true">
        <label for="company">Şirket</label>
        <input id="company" name="company" type="text" tabindex="-1" autocomplete="off">
      </div>
      <button class="btn" type="submit">Teklif isteyin <span aria-hidden="true">→</span></button>
      <p class="form__note">Bilgileriniz yalnızca size dönüş yapmak için kullanılır. Ayrıntılar: <a href="/gizlilik/">Gizlilik ve KVKK</a>.</p>
      <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
    </form>
    <aside class="direct">
      <h3>Doğrudan ulaşın</h3>
      <p>Form doldurmak istemezseniz:</p>
      ${wa}WhatsApp'tan yazın <span aria-hidden="true">→</span></a>
      <a class="btn ghost" href="tel:${site.phone}">${site.phoneDisplay}</a>
      <p>ya da <a href="mailto:${site.email}">${site.email}</a></p>
    </aside>
  </div>
</section>`;

export const homeBody = () => [film, benefits, process, packages, faqSection(), contact()].join("\n\n");
