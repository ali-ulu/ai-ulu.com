import { page } from "./components/layout.mjs";
import { homeBody, preloader } from "./components/home.mjs";
import { site } from "./config.mjs";
import { faq } from "./content/site-content.mjs";

function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    description: site.description,
    image: `${site.url}/og.png`,
    areaServed: "TR",
    knowsLanguage: ["tr"],
    serviceType: "Web sitesi tasarımı ve geliştirme",
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
    <p>Veriler şifreli bağlantı (HTTPS) üzerinden iletilir ve Cloudflare altyapısında, yalnızca yetkili kişinin erişebildiği bir veritabanında saklanır.</p>
    <h2>Çerezler</h2>
    <p>Bu site çerez veya izleme aracı kullanmaz.</p>
    <h2>Haklarınız</h2>
    <p>KVKK kapsamında verilerinize erişmeyi, düzeltilmesini veya silinmesini talep edebilirsiniz. Bunun için <a href="mailto:${site.email}">${site.email}</a> adresine yazabilirsiniz.</p>
  </div>
</section>`;

export const pages = [
  {
    path: "/",
    file: "index.html",
    jsonLd: [organizationLd(), faqLd()],
    before: preloader,
    scripts: ["/ora.js"],
    footerNote: "Ekrandaki klinik sitesi örnek tasarımdır",
    body: homeBody,
  },
  {
    path: "/gizlilik/",
    file: "gizlilik/index.html",
    title: "Gizlilik ve KVKK",
    description: "ai-ulu gizlilik politikası ve kişisel verilerin korunması (KVKK) bilgilendirmesi.",
    body: privacyBody,
  },
];

export function renderPage(p) {
  return page({ ...p, body: p.body() });
}
