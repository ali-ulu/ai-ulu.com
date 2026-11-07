import { page } from "./components/layout.mjs";
import {
  heroSection,
  trustSection,
  valueSection,
  templatesSection,
  processSection,
  clientStepsSection,
  servicesSection,
  faqSection,
  contactSection,
  ctaBand,
} from "./components/sections.mjs";
import { site } from "./config.mjs";
import { faq } from "./content/site-content.mjs";
import { escapeHtml } from "./lib/html.mjs";

function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    areaServed: "TR",
    knowsLanguage: ["tr", "en"],
    serviceType: "Web site tasarımı ve geliştirme",
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

export const pages = [
  {
    path: "/",
    file: "index.html",
    title: "",
    description: site.description,
    jsonLd: [organizationLd(), faqLd()],
    body: () =>
      [
        heroSection(),
        trustSection(),
        valueSection(),
        templatesSection(),
        processSection(),
        clientStepsSection(),
        servicesSection(),
        faqSection(),
        contactSection(),
        ctaBand(),
      ].join("\n"),
  },
  {
    path: "/gizlilik/",
    file: "gizlilik/index.html",
    title: "Gizlilik ve KVKK",
    description: "ai-ulu.com gizlilik politikası ve kişisel verilerin korunması bilgilendirmesi.",
    body: () => privacyBody(),
  },
];

function privacyBody() {
  return `<section class="section">
  <div class="wrap" style="max-width:52rem">
    <span class="eyebrow">Gizlilik</span>
    <h1>Gizlilik ve KVKK</h1>
    <div class="stack-sm" style="margin-top:1.5rem;color:var(--text-muted)">
      <p>Bu sayfa, ${escapeHtml(site.name)} üzerinden ilettiğiniz bilgilerin nasıl işlendiğini açıklar.</p>
      <h3 style="color:var(--text);margin-top:2rem">Hangi verileri topluyoruz?</h3>
      <p>Yalnızca iletişim formunda paylaştığınız ad, e-posta/telefon ve proje açıklaması gibi bilgileri toplarız. Bu bilgiler size dönüş yapmak için kullanılır.</p>
      <h3 style="color:var(--text);margin-top:2rem">Nasıl saklanıyor?</h3>
      <p>Veriler şifreli bağlantı (HTTPS) üzerinden iletilir ve güvenli bir veritabanında saklanır. Yalnızca yetkili kişiler erişebilir.</p>
      <h3 style="color:var(--text);margin-top:2rem">Çerezler ve analitik</h3>
      <p>Siteyi iyileştirmek için anonim, gizlilik dostu ölçümleme kullanabiliriz. Kişisel verilerinizi reklam amacıyla üçüncü taraflarla paylaşmayız.</p>
      <h3 style="color:var(--text);margin-top:2rem">Haklarınız</h3>
      <p>KVKK kapsamında verilerinizin silinmesini, düzeltilmesini veya size iletilmesini talep edebilirsiniz. Bunun için ${escapeHtml(site.email)} adresine yazabilirsiniz.</p>
    </div>
  </div>
</section>`;
}

export function renderPage(p) {
  const ld = p.jsonLd ? (Array.isArray(p.jsonLd) ? p.jsonLd : [p.jsonLd]) : null;
  return page({
    title: p.title,
    description: p.description,
    path: p.path,
    body: p.body(),
    jsonLd: ld,
  });
}
