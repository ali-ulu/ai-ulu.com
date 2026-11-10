import { page } from "./components/layout.mjs";
import { homeBody, preloader } from "./components/home.mjs";
import { blogIndexBody, byDateDesc, postBody } from "./components/blog.mjs";
import { site } from "./config.mjs";
import { faq } from "./content/site-content.mjs";

function organizationLd() {
  const { streetAddress, addressLocality, postalCode, addressCountry } = site.address;
  const hasAddress = Boolean(streetAddress || addressLocality || postalCode);
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
    // Only emitted when the config actually carries the value, so no placeholder
    // address or price ever ships.
    ...(hasAddress ? { address: { "@type": "PostalAddress", streetAddress, addressLocality, postalCode, addressCountry } } : {}),
    ...(site.priceRange ? { priceRange: site.priceRange } : {}),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    dateModified: site.updated,
  };
}

// Per-page freshness signals so crawlers and AI assistants can see when the
// page last changed.
function webPageLd(path, { title, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title ? `${title} · ${site.name}` : site.title,
    description,
    url: `${site.url}${path}`,
    inLanguage: site.lang,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
    datePublished: site.updated,
    dateModified: site.updated,
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
    author: { "@type": "Person", name: site.owner, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

function blogLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} Blog`,
    url: `${site.url}/blog/`,
    inLanguage: site.lang,
    blogPost: byDateDesc.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${site.url}/blog/${p.slug}/`,
      datePublished: p.published,
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
    <p>Veriler şifreli bağlantı (HTTPS) üzerinden iletilir ve Cloudflare altyapısında, yalnızca yetkili kişinin erişebildiği bir veritabanında saklanır. Kayıtlar en fazla 12 ay tutulur; bu sürenin sonunda otomatik olarak silinir. IP adresi ve tarayıcı bilgisi yalnızca kötüye kullanımı önlemek için kısa süreliğine saklanır.</p>
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
    body: blogIndexBody,
  },
  ...byDateDesc.map((post) => ({
    path: `/blog/${post.slug}/`,
    file: `blog/${post.slug}/index.html`,
    title: post.title,
    description: post.description,
    jsonLd: [blogPostingLd(post)],
    styles: ["/blog.css"],
    body: () => postBody(post.slug),
  })),
  {
    path: "/gizlilik/",
    file: "gizlilik/index.html",
    title: "Gizlilik ve KVKK",
    description: "ai-ulu gizlilik politikası ve kişisel verilerin korunması (KVKK) bilgilendirmesi.",
    body: privacyBody,
  },
];

export function renderPage(p) {
  const jsonLd = [webPageLd(p.path, p), ...(p.jsonLd || [])];
  return page({ ...p, jsonLd, body: p.body() });
}
