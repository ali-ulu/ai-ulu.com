import { page } from "./components/layout.mjs";
import { homeBody, preloader, noJsStyles } from "./components/home.mjs";
import { blogIndexBody, byDateDesc, postBody } from "./components/blog.mjs";
import { workBody, workLd } from "./components/work.mjs";
import { site, waLink } from "./config.mjs";
import { faq } from "./content/site-content.mjs";

// A compact Person reference that keeps every page self-contained. The about
// page publishes the full Person; this is the same @id with just enough detail
// for a validator that only reads one page.
const personRef = () => ({
  "@type": "Person",
  "@id": `${site.url}/hakkimizda/#ali-ulu`,
  name: site.owner,
  url: `${site.url}/hakkimizda/`,
});

// The owner as a first-class entity. The same @id is referenced by the
// Organization, the about page and every WebPage, so crawlers can join the
// author, the studio and the site into one knowledge-graph cluster.
function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/hakkimizda/#ali-ulu`,
    name: site.owner,
    url: `${site.url}/hakkimizda/`,
    jobTitle: site.ownerTitle,
    email: site.email,
    worksFor: { "@id": `${site.url}/#organization` },
    knowsAbout: site.knowsAbout,
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

// A plain Organization block on every page. Search engines and AI assistants
// look for this exact type; ProfessionalService (below) is a narrower subtype
// and is not a substitute when a tool checks for "Organization".
function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: "ai-ulu web stüdyosu",
    url: site.url,
    logo: { "@type": "ImageObject", url: `${site.url}/icon-512.png`, width: 512, height: 512 },
    image: `${site.url}/og.png`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    founder: personRef(),
    knowsAbout: site.knowsAbout,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phone,
      email: site.email,
      areaServed: "TR",
      availableLanguage: ["tr"],
    },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

function professionalServiceLd() {
  const { streetAddress, addressLocality, postalCode, addressCountry } = site.address;
  const hasAddress = Boolean(streetAddress || addressLocality || postalCode);
  // A service-area business has no shopfront, so `address` stays empty and the
  // places it serves carry the local signal instead. With nothing configured the
  // country is the honest fallback; add real areas to config to narrow it.
  const areas = site.serviceAreas.length ? site.serviceAreas : ["TR"];
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#service`,
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    description: site.description,
    image: `${site.url}/og.png`,
    logo: { "@type": "ImageObject", url: `${site.url}/icon-512.png`, width: 512, height: 512 },
    parentOrganization: { "@id": `${site.url}/#organization` },
    founder: personRef(),
    areaServed: areas.map((name) => ({ "@type": "AdministrativeArea", name })),
    knowsLanguage: ["tr"],
    knowsAbout: site.knowsAbout,
    serviceType: "Web sitesi tasarımı ve geliştirme",
    // Only emitted when the config actually carries the value, so no placeholder
    // address or price ever ships.
    ...(hasAddress ? { address: { "@type": "PostalAddress", streetAddress, addressLocality, postalCode, addressCountry } } : {}),
    ...(site.priceRange ? { priceRange: site.priceRange } : {}),
    // A starting price, when the owner sets one, becomes a real Offer.
    ...(site.priceFrom
      ? {
          offers: {
            "@type": "Offer",
            price: site.priceFrom,
            priceCurrency: "TRY",
            availability: "https://schema.org/InStock",
            url: `${site.url}/#paketler`,
          },
        }
      : {}),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    dateModified: site.updated,
  };
}

// Per-page freshness signals so crawlers and AI assistants can see when the
// page last changed.
function webPageLd(path, { title, description }) {
  const url = `${site.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: title ? `${title} · ${site.name}` : site.title,
    description,
    url,
    inLanguage: site.lang,
    isPartOf: { "@id": `${site.url}/#website` },
    author: { "@id": `${site.url}/hakkimizda/#ali-ulu` },
    publisher: { "@id": `${site.url}/#organization` },
    datePublished: site.updated,
    dateModified: site.updated,
  };
}

// The WebSite entity, emitted on the home page only. It carries no SearchAction:
// Google retired the Sitelinks Searchbox and this site has no search endpoint, so
// pointing one at /blog/?q= would advertise a search that cannot run.
function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: site.lang,
    publisher: { "@id": `${site.url}/#organization` },
  };
}

// BreadcrumbList mirrors the visible trail so Google can show the hierarchy.
function breadcrumbLd(crumbs) {
  if (!crumbs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${site.url}${c.href === "/" ? "/" : c.href}`,
    })),
  };
}

function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// A post is a BlogPosting; the author and publisher are the site owner. The
// target query rides along as keywords, which is what the post was written for.
function blogPostingLd(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${site.url}/blog/${post.slug}/`,
    mainEntityOfPage: `${site.url}/blog/${post.slug}/`,
    datePublished: post.published,
    dateModified: post.updated,
    inLanguage: site.lang,
    keywords: post.targetQuery,
    author: { "@id": `${site.url}/hakkimizda/#ali-ulu` },
    publisher: { "@id": `${site.url}/#organization` },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

function blogLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/blog/#blog`,
    name: `${site.name} Blog`,
    url: `${site.url}/blog/`,
    inLanguage: site.lang,
    author: { "@id": `${site.url}/hakkimizda/#ali-ulu` },
    publisher: { "@id": `${site.url}/#organization` },
    blogPost: byDateDesc.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${site.url}/blog/${p.slug}/`,
      datePublished: p.published,
    })),
  };
}

// The about page is also the author page: the byline on every post and the
// Person entity in the JSON-LD point here, so a reader (or a crawler) can see
// who is behind the text.
function aboutPageLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${site.url}/hakkimizda/#aboutpage`,
    name: `Hakkında · ${site.name}`,
    url: `${site.url}/hakkimizda/`,
    description: `${site.owner} kimdir, ${site.name} nasıl çalışır ve neyi garanti etmez?`,
    inLanguage: site.lang,
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: { "@id": `${site.url}/hakkimizda/#ali-ulu` },
    datePublished: site.updated,
    dateModified: site.updated,
  };
}

// A profile link only when the owner actually configured that profile.
const profileLink = (host, label) => {
  const href = site.sameAs.find((u) => u.includes(host));
  return href ? `<a href="${href}" rel="noopener me">${label}</a>` : label;
};

const aboutBody = () => `<section class="s">
  <span class="eyebrow">Hakkında</span>
  <h1>Bu siteyi <em>kim</em> yapıyor?</h1>
  <div class="prose">
    <p>${site.name}, ${site.owner}'nun tek kişilik web stüdyosudur. İşletmeler ve bireyler için müşteri getiren web siteleri ve web uygulamaları kurar. Tasarımı, kodu ve metni aynı kişi yapar; arada bir ajans, bir satış ekibi ya da bir çağrı merkezi yoktur.</p>
    <h2>Kim yazıyor, kim kodluyor?</h2>
    <p>${site.owner}, ${site.ownerTitle}. Bir siteyi teslim ettiğinde arkasında duran kişi de odur: yayına alma, ölçüm, düzeltme ve sonraki değişiklikler aynı elden geçer. Bu yüzden sitede okuduğunuz her yazı ve her teklif, onu yapan kişinin kendi cümleleridir.</p>
    <h2>Ne yapıyoruz?</h2>
    <ul>
      <li><strong>Tanıtım sitesi:</strong> markaya özel tasarım, hızlı açılış, Google ve yapay zekâ aramalarına hazır yapı.</li>
      <li><strong>Özel web uygulaması:</strong> panel, portal, randevu, sipariş ve otomasyon.</li>
      <li><strong>Site + uygulama:</strong> tek tasarım dili, tek ekip, tek muhatap.</li>
    </ul>
    <p>Yaptığımız işlerin bir kısmı <a href="/calismalar/">Çalışmalar</a> sayfasında: HUQAN, LEVH ve LeadScout gibi kendi geliştirdiğimiz açık kaynak yazılımlar. Hizmetlerin kapsamı ve fiyatı <a href="/#paketler">paketlerde</a>, çalışma şekli <a href="/#nasil">süreçte</a> anlatılıyor.</p>
    <h2>Nasıl çalışıyoruz?</h2>
    <ol>
      <li><strong>Ücretsiz görüşme:</strong> hedefi, kapsamı ve takvimi konuşuruz. Satış baskısı yok.</li>
      <li><strong>Yazılı teklif:</strong> görüşmeden sonra 24 saat içinde net bir teklif gelir. Teklifte yazmayan iş kapsam dışıdır.</li>
      <li><strong>Kurulum:</strong> tasarım ve geliştirme açıkta ilerler; ilk haftadan tıklanabilir önizleme görürsünüz.</li>
      <li><strong>Yayın ve sonrası:</strong> gerçek cihazlarda test eder, yayına alır, gerektiğinde düzeltiriz.</li>
    </ol>
    <h2>Neye söz vermiyoruz?</h2>
    <p>Google'da belirli bir sıralama, ChatGPT'de belirli bir yerde çıkma ya da satış garantisi vermiyoruz. Kim veriyorsa, o garantinin nasıl ölçüleceğini sorun. Yaptığımız şey ölçülebilir: site hızlı açılır, telefonda okunur, arama motorları ve yapay zekâ asistanları içeriği okuyabilir, ziyaretçi tek dokunuşla size ulaşır.</p>
    <h2>Şeffaflık</h2>
    <p>Bu sitede uydurma istatistik, sahte referans ya da olmayan bir ekip listesi yoktur. Fiyat aralıkları 2026'da yayınlanmış sektör rehberlerinden derlenir ve <a href="/blog/web-sitesi-fiyatlari-2026/">fiyat yazısında</a> kaynağıyla birlikte durur. Gizlilik ve veri işleme kuralları <a href="/gizlilik/">Gizlilik ve KVKK</a> sayfasındadır.</p>
    <h2>İletişim</h2>
    <p>Bir sorunuz varsa <a href="mailto:${site.email}">${site.email}</a> adresine yazın, <a href="${site.whatsapp}" rel="noopener">WhatsApp'tan</a> yazın ya da <a href="/#iletisim">formu</a> doldurun. Profiller: ${profileLink("linkedin.com", "LinkedIn")}, ${profileLink("github.com", "GitHub")}.</p>
  </div>
</section>`;

const privacyBody = () => `<section class="s">
  <span class="eyebrow">Gizlilik</span>
  <h1>Gizlilik ve <em>KVKK</em></h1>
  <div class="prose">
    <p>Bu sayfa, ${site.name} üzerinden ilettiğiniz bilgilerin nasıl işlendiğini açıklar.</p>
    <h2>Hangi verileri topluyoruz?</h2>
    <p>Yalnızca iletişim formunda paylaştığınız ad, e-posta veya telefon ve proje açıklamasını toplarız. Kötüye kullanımı önlemek için gönderimin IP adresi ve tarayıcı bilgisi de kaydedilir.</p>
    <h2>Ne için kullanıyoruz?</h2>
    <p>Bu bilgiler yalnızca size dönüş yapmak ve teklif hazırlamak için kullanılır. Reklam amacıyla üçüncü taraflarla paylaşılmaz.</p>
    <h2>Nasıl saklanıyor?</h2>
    <p>Veriler şifreli bağlantı (HTTPS) üzerinden iletilir ve Cloudflare altyapısında, yalnızca yetkili kişinin erişebildiği bir veritabanında saklanır. Kayıtlar en fazla 12 ay tutulur; bu sürenin sonunda otomatik olarak silinir. IP adresi ve tarayıcı bilgisi yalnızca kötüye kullanımı önlemek için kısa süreliğine saklanır.</p>
    <h2>Çerezler ve ziyaret ölçümü</h2>
    <p>Bu site çerez kullanmaz, tarayıcınıza kimlik kaydetmez ve reklam ya da izleme aracı çalıştırmaz. Yalnızca kaç kişinin hangi sayfayı açtığını görmek için anonim bir sayaç tutarız: sayfa yolu, gün, sizi yönlendiren sitenin adı ve ülke. Bu kayıt tek başına sizi tanımlamaz.</p>
    <h2>Haklarınız</h2>
    <p>KVKK kapsamında verilerinize erişmeyi, düzeltilmesini veya silinmesini talep edebilirsiniz. Bunun için <a href="mailto:${site.email}">${site.email}</a> adresine yazabilirsiniz.</p>
  </div>
</section>`;

// Plain, honest terms: what we do, what we need from the client, who owns the
// result. Kept short on purpose — the specifics live in each written quote.
const termsBody = () => `<section class="s">
  <span class="eyebrow">Şartlar</span>
  <h1>Kullanım <em>şartları</em></h1>
  <div class="prose">
    <p>Bu sayfa, ${site.name} ile çalışırken geçerli olan genel koşulları açıklar. Her projenin kapsamı, takvimi ve ücreti ayrıca yazılı teklifte belirtilir; teklif ile bu sayfa arasında bir fark olursa teklif geçerlidir.</p>
    <h2>Hizmetin kapsamı</h2>
    <p>Web sitesi ve web uygulaması tasarımı, geliştirmesi ve yayına alma hizmeti veririz. Kapsam, ücretsiz görüşmeden sonra yazılı teklifte netleşir; teklifte yazmayan işler kapsam dışıdır.</p>
    <h2>Müşterinin sorumlulukları</h2>
    <p>İçerik (metin, logo, fotoğraf), alan adı ve barındırma hesabı gibi bilgileri zamanında sağlamak müşterinin sorumluluğundadır. Müşteri, sağladığı içeriğin haklarını elinde bulundurduğunu kabul eder.</p>
    <h2>Ödeme</h2>
    <p>Ödeme koşulları teklifte belirtilir. Proje, kararlaştırılan ödemeler yapılmadan yayına alınmaz.</p>
    <h2>Fikri mülkiyet</h2>
    <p>Ödeme tamamlandığında tasarım, kod ve içerik müşteriye aittir; dosyalar yayında teslim edilir. ${site.name}, çalışmayı referans olarak gösterme hakkını saklı tutar.</p>
    <h2>Revizyon ve teslim</h2>
    <p>Dahil edilen revizyon sayısı teklifte yazılıdır. Kapsam dışı ek talepler ayrıca fiyatlandırılır.</p>
    <h2>Sorumluluk sınırı</h2>
    <p>Arama motorlarında veya yapay zekâ yanıtlarında belirli bir sıralama ya da sonuç garanti edilmez. Site, üçüncü taraf platformların (arama motorları, barındırma, mesajlaşma) kesintilerinden sorumlu tutulamaz.</p>
    <h2>İletişim</h2>
    <p>Sorularınız için <a href="mailto:${site.email}">${site.email}</a> adresine yazabilirsiniz.</p>
  </div>
</section>`;

// 404: honest, with a way out. Served by Cloudflare Workers assets
// (wrangler.jsonc → not_found_handling: "404-page").
const notFoundBody = () => `<section class="s nf">
  <div class="nf-wrap">
    <p class="eyebrow">404</p>
    <h1>Aradığınız sayfayı <em>bulamadık.</em></h1>
    <p class="lead">Bağlantı eskimiş ya da adres yanlış yazılmış olabilir. Aşağıdan devam edebilirsiniz.</p>
    <nav class="nf-links" aria-label="Sayfalar">
      <a class="btn" href="/">Ana sayfa</a>
      <a class="btn ghost" href="/blog/">Blog</a>
      <a class="btn ghost" href="/calismalar/">Çalışmalar</a>
      <a class="btn ghost" href="/sablonlar/">Örnek tasarımlar</a>
    </nav>
  </div>
</section>`;

// Static explanation of the tool. The checker needs JavaScript; a crawler and a
// first-time visitor do not, so the method lives in plain HTML below the form.
const checkupExplain = () => `<section class="s">
  <span class="eyebrow">Yöntem</span>
  <h2>Bu test <em>ne ölçüyor?</em></h2>
  <div class="prose">
    <p>Test, sitenizi bir ziyaretçinin ve bir yapay zekâ asistanının gördüğü gibi okur. Sonuç, tek bir pazarlama puanı değil; sitenin açılıp açılmadığını, içeriğin sunucudan gelip gelmediğini ve makinelerin siteyi anlayıp anlamadığını gösteren bir kontrol listesidir.</p>
    <h2>Neye bakıyoruz?</h2>
    <p><strong>Erişim.</strong> Sitenin https ile açılması, eski http adreslerinin güvenli adrese yönlenmesi, sunucunun ilk yanıtı ne kadar hızlı verdiği, sayfanın noindex ile gizlenip gizlenmediği ve telefonda doğru genişlikte çizilip çizilmediği.</p>
    <p><strong>Yapay zekâ erişimi.</strong> robots.txt dosyasının GPTBot, OAI-SearchBot, ClaudeBot ve PerplexityBot gibi tarayıcılara izin verip vermediği; güvenlik duvarının bu tarayıcıları engelleyip engellemediği ve sitenin bir llms.txt özeti yayınlayıp yayınlamadığı.</p>
    <p><strong>Okunabilirlik.</strong> Sayfa içeriğinin JavaScript çalışmadan gelip gelmediği, başlık ve açıklama etiketleri, tek bir ana başlık (H1) ve görsellerin alt metinleri. İçerik sonradan JavaScript ile çiziliyorsa Google ve asistanlar sayfayı neredeyse boş görür.</p>
    <p><strong>Yapılandırılmış veri.</strong> İşletme bilgisini taşıyan JSON-LD, site haritası, paylaşım kartı (Open Graph) ve asıl adres (canonical) etiketi. Bunlar, sitenin ne olduğunu ve hangi sayfanın asıl sayfa olduğunu makineye söyler.</p>
    <p><strong>Dönüşüm.</strong> Telefondan tek dokunuşla arama (tel:), WhatsApp bağlantısı ve çalışan bir iletişim formu. Ziyaretçi aklındayken size ulaşabiliyor mu?</p>
    <h2>Puan nasıl okunur?</h2>
    <p>Her kontrolün bir ağırlığı vardır; puan, ölçülebilen kontrollerin toplamına göre hesaplanır. Ölçülemeyen bir kontrol sıfır puan alır ama toplamdan düşülmez; böylece "100" gerçekten her şeyin doğrulandığı anlamına gelir. 90 ve üzeri A, 80-89 B, 70-79 C, 60-69 D, 50-59 E, altı F. Düşük puan bir suçlama değil, sırayla düzeltilecek maddeler listesidir.</p>
    <h2>Neyi ölçmüyor?</h2>
    <p>Google Haritalar puanınızı, ChatGPT'de adınızın geçip geçmediğini, rakiplerinizin durumunu ve WhatsApp'a ne kadar hızlı cevap verdiğinizi otomatik olarak ölçmez. Bunlar için tam raporu elle hazırlıyorum. Ayrıca güvenlik duvarı isteğimizi reddederse test "site ölü" demez; "ölçülemedi" der. Bu ikisi aynı şey değildir.</p>
    <h2>Sık sorulanlar</h2>
    <p><strong>Test siteyi değiştirir mi?</strong> Hayır. Yalnızca herkese açık sayfaları okur; hiçbir şey yazmaz, kurmaz veya silmez.</p>
    <p><strong>Kaç dakika sürer?</strong> Genellikle 10-20 saniye. Hız ölçümü açıksa bu süre bir dakikaya çıkabilir.</p>
    <p><strong>Sonucu kim görür?</strong> Puan ve bulgular tarayıcınızda gösterilir. Tam raporu isterseniz iletişim bilginizi bırakırsınız; bilgi yalnızca o raporu göndermek için kullanılır.</p>
    <p>Yöntemin arkasındaki kişi ve çalışma şekli <a href="/hakkimizda/">Hakkında</a> sayfasında.</p>
  </div>
</section>`;

const checkupBody = () => `<section class="s ck">
  <div class="ck-wrap">
    <p class="eyebrow">Ücretsiz checkup</p>
    <h1>Siteniz Google'da ve <em>ChatGPT'de</em> nasıl görünüyor?</h1>
    <p class="lead">Adresi yazın; sitenin açılıp açılmadığını, telefonda ve arama motorlarında nasıl okunduğunu, yapay zekâ asistanlarının sizi bulup bulamadığını ölçelim. Kayıt yok.</p>
    <form id="ck-form" class="ck-form" novalidate>
      <label for="ck-site">Site adresi</label>
      <div class="ck-row">
        <input id="ck-site" name="site" type="text" inputmode="url" autocomplete="url" required maxlength="253" placeholder="siteniz.com">
        <button class="btn" type="submit">Test et</button>
      </div>
    </form>
    <p id="ck-status" class="ck-status" role="status" aria-live="polite"></p>
    <div id="ck-out" hidden>
      <div class="ck-score">
        <p class="ck-grade" id="ck-grade" aria-hidden="true"></p>
        <div>
          <p class="ck-num"><strong id="ck-num"></strong> / 100</p>
          <p id="ck-sum" class="ck-sum"></p>
          <p id="ck-basis" class="ck-more" hidden></p>
          <button type="button" class="ck-copy" id="ck-copy">Rapor linkini kopyala</button>
        </div>
      </div>
      <ul id="ck-cats" class="ck-cats"></ul>
      <p id="ck-speed" class="ck-more" hidden></p>
      <h2 class="ck-h">Düzeltilecekler</h2>
      <ol id="ck-fix" class="ck-list"></ol>
      <details class="ck-passed"><summary id="ck-pass-sum"></summary><ul id="ck-ok" class="ck-list"></ul></details>
      <div class="ck-cta">
        <p>Bu sayfa sitenizi ölçtü. Google Haritalar puanınız, ChatGPT'de adınızın geçip geçmediği ve WhatsApp cevap hızınız için elle bakıyorum; tam raporu ücretsiz gönderiyorum.</p>
        <a id="ck-wa" class="btn" data-base="${site.whatsapp}" href="${waLink("Merhaba, sitem için ücretsiz checkup istiyorum.")}" target="_blank" rel="noopener">WhatsApp'tan tam raporu iste</a>
      </div>
      <form id="ck-lead" class="ck-lead" novalidate>
        <p>ya da iletişim bilginizi bırakın:</p>
        <input name="name" type="text" autocomplete="name" required minlength="2" maxlength="120" placeholder="Ad / Firma" aria-label="Ad veya firma adı">
        <input name="reach" type="text" autocomplete="tel" required maxlength="160" placeholder="WhatsApp numarası veya e-posta" aria-label="WhatsApp numarası veya e-posta">
        <div class="field--hp" aria-hidden="true"><input name="company" type="text" tabindex="-1" autocomplete="off"></div>
        <p class="ck-kvkk">Bilginizi yalnız bu raporu göndermek için kullanırım; <a href="/gizlilik/">KVKK bilgilendirmesi</a>.</p>
        <button class="btn ghost" type="submit">Tam raporu gönder</button>
        <p id="ck-lead-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
</section>
${checkupExplain()}`;

export const pages = [
  {
    path: "/",
    file: "index.html",
    jsonLd: [webSiteLd(), professionalServiceLd(), faqLd()],
    before: preloader,
    noscript: noJsStyles,
    scripts: ["/ora.js"],
    styles: ["/faq-drawer.css", "/postmark-form.css", "/blog.css"],
    footerNote: "Ekrandaki klinik sitesi örnek tasarımdır",
    body: homeBody,
  },
  {
    path: "/blog/",
    file: "blog/index.html",
    title: "Blog",
    description: "Web sitesi fiyatı, arama görünürlüğü ve müşteri kazanma üzerine pratik yazılar.",
    jsonLd: [blogLd()],
    styles: ["/blog.css"],
    crumbs: [{ href: "/", label: "Ana sayfa" }, { href: "/blog/", label: "Blog" }],
    body: blogIndexBody,
  },
  ...byDateDesc.map((post) => ({
    path: `/blog/${post.slug}/`,
    file: `blog/${post.slug}/index.html`,
    // The <title> stays inside the SERP limit; the full headline is kept for the
    // on-page h1 and the BlogPosting schema.
    title: post.metaTitle || post.title,
    description: post.description,
    jsonLd: [blogPostingLd(post)],
    styles: ["/blog.css"],
    crumbs: [
      { href: "/", label: "Ana sayfa" },
      { href: "/blog/", label: "Blog" },
      { href: `/blog/${post.slug}/`, label: post.title },
    ],
    // The h1 already names the post, so the visible trail ends at "Blog" instead of
    // printing the headline twice. `crumbs` stays complete for the BreadcrumbList JSON-LD.
    trail: [
      { href: "/", label: "Ana sayfa" },
      { href: "/blog/", label: "Blog" },
    ],
    body: () => postBody(post.slug),
  })),
  {
    path: "/calismalar/",
    file: "calismalar/index.html",
    title: "Çalışmalar",
    description:
      "ai-ulu'nun kendi geliştirdiği yazılımlar: AI ajanları için doğrulama katmanı HUQAN, yerel hafıza aracı LEVH ve satış sistemi LeadScout.",
    jsonLd: workLd(),
    styles: ["/work.css"],
    crumbs: [{ href: "/", label: "Ana sayfa" }, { href: "/calismalar/", label: "Çalışmalar" }],
    body: workBody,
  },
  {
    path: "/hakkimizda/",
    file: "hakkimizda/index.html",
    title: "Hakkında",
    description: "ai-ulu'yu kim yürütüyor, nasıl çalışıyor ve neyi garanti etmiyor? Stüdyonun arkasındaki kişi ve çalışma şekli.",
    jsonLd: [aboutPageLd(), personLd()],
    crumbs: [{ href: "/", label: "Ana sayfa" }, { href: "/hakkimizda/", label: "Hakkında" }],
    body: aboutBody,
  },
  {
    path: "/checkup/",
    file: "checkup/index.html",
    title: "Ücretsiz site checkup",
    description: "Siteniz açılıyor mu, Google ve ChatGPT onu okuyabiliyor mu? Adresi yazın, ücretsiz ölçelim.",
    scripts: ["/checkup.js"],
    crumbs: [{ href: "/", label: "Ana sayfa" }, { href: "/checkup/", label: "Checkup" }],
    body: checkupBody,
  },
  {
    path: "/gizlilik/",
    file: "gizlilik/index.html",
    title: "Gizlilik ve KVKK",
    description: "ai-ulu gizlilik politikası ve kişisel verilerin korunması (KVKK) bilgilendirmesi.",
    crumbs: [{ href: "/", label: "Ana sayfa" }, { href: "/gizlilik/", label: "Gizlilik ve KVKK" }],
    body: privacyBody,
  },
  {
    path: "/kullanim-sartlari/",
    file: "kullanim-sartlari/index.html",
    title: "Kullanım şartları",
    description: "ai-ulu ile çalışırken geçerli genel koşullar: hizmet kapsamı, ödeme, fikri mülkiyet ve sorumluluk.",
    crumbs: [{ href: "/", label: "Ana sayfa" }, { href: "/kullanim-sartlari/", label: "Kullanım şartları" }],
    body: termsBody,
  },
];

// The 404 is written to /404.html and served by the assets binding for any
// unknown path. It is deliberately not in the sitemap.
export const notFoundPage = {
  path: "/404.html",
  file: "404.html",
  title: "Sayfa bulunamadı",
  description: "Aradığınız sayfa bulunamadı. Ana sayfaya, bloga ya da çalışmalara dönebilirsiniz.",
  canonical: false,
  noindex: true,
  body: notFoundBody,
};

export function renderPage(p) {
  const bc = breadcrumbLd(p.crumbs);
  // Organization ships on every page: the identity block is what search engines
  // and assistants use to recognise the brand before they read the page.
  const jsonLd = [organizationLd(), webPageLd(p.path, p), ...(bc ? [bc] : []), ...(p.jsonLd || [])];
  return page({ ...p, jsonLd, body: p.body() });
}
