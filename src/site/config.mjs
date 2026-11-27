export const site = {
  name: "ai-ulu",
  owner: "Ali Ulu",
  url: "https://ai-ulu.com",
  email: "aliulu@ai-ulu.com",
  lang: "tr",
  title: "ai-ulu | Müşteri getiren web siteleri",
  description:
    "ai-ulu, işletmeler için müşteri getiren web siteleri kurar: özgün tasarım, Google'da ve yapay zekâ aramalarında görünürlük, WhatsApp'a bağlı iletişim.",
  phone: "+905079581642",
  // Non-breaking spaces keep the number on one line; a telephone should never wrap.
  phoneDisplay: "+90\u00a0507\u00a0958\u00a016\u00a042",
  whatsapp: "https://wa.me/905079581642",
  // Local SEO signals. Left empty on purpose: fill them and they appear in the
  // ProfessionalService JSON-LD (see pages.mjs). Empty values are omitted, so no
  // placeholder data ever goes live.
  address: { streetAddress: "", addressLocality: "", postalCode: "", addressCountry: "TR" },
  // Service-area business: no shopfront, so no address to publish. List the
  // places actually served and they become areaServed in the JSON-LD. Left empty
  // on purpose — the country alone is emitted until real areas are added.
  serviceAreas: [],
  priceRange: "5.000 ₺'den başlar",
  // Shown on the packages section when set ("Tanıtım siteleri X'den başlar").
  // Left empty on purpose: a real number beats a placeholder, so nothing ships
  // until the owner fills it in.
  priceFrom: "5.000 ₺'den",
  // The same number as an integer: schema.org Offer.price must be numeric, so it
  // cannot reuse the display string.
  priceFromAmount: 5000,
  // What the owner does, in the words used on the about page and in the Person
  // schema. Kept short so it reads the same everywhere.
  ownerTitle: "Web sitesi tasarımcısı ve geliştiricisi",
  knowsAbout: ["Web sitesi tasarımı", "Web uygulamaları", "Arama motoru optimizasyonu", "Yapay zekâ aramalarında görünürlük"],
  // Only profiles the owner actually owns. LinkedIn and GitHub are the two that
  // exist today; adding a dead or foreign profile would misrepresent the brand.
  sameAs: ["https://www.linkedin.com/in/aliulu777/", "https://github.com/ali-ulu"],
  // Cloudflare Turnstile site key. Empty = the widget is not rendered and the CSP
  // stays 'self'-only. Set it (and the worker's TURNSTILE_SECRET) to switch on
  // the CAPTCHA on the lead form.
  turnstileSiteKey: "",
  // Cloudflare Web Analytics beacon token. Empty = no analytics script is emitted.
  // The token is public (it appears in page source). CSP already allows
  // static.cloudflareinsights.com; check.mjs allows this exact beacon.
  cfAnalyticsToken: "ce3724575810445d9b48ea3e2f332804",
  // Bump when the site content changes; feeds dateModified in JSON-LD, the
  // og:updated_time meta tag and sitemap lastmod.
  updated: "2026-11-28",
  // IndexNow key: the build writes /<key>.txt so Bing and Yandex accept our
  // submissions. Rotate by replacing this value.
  indexNowKey: "bec0a65e610429c17aa2c0cce8902c60",
};

// wa.me with a prefilled message. Every WhatsApp link on the site goes through
// this, so the number and the opening line live in one place.
export function waLink(text) {
  return text ? `${site.whatsapp}?text=${encodeURIComponent(text)}` : site.whatsapp;
}
