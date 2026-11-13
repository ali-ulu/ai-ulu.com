// The sector picker in the hero. One list feeds three outputs: the server
// renders the chips from it (components/home.mjs), the 3D scene paints the
// sample site from it (client/home/scene/artboards.js) and the funnel builds
// the prefilled WhatsApp message from it (client/home/funnel.js).
//
// Every brand name here is invented and shown under an "Örnek tasarım" caption.
// `schema` is the real schema.org type the site would carry for that business.
// `lines` is the sample headline: [text, accent?] pairs, one array per line.
export const sectors = [
  {
    id: "dis",
    label: "Diş kliniği",
    brand: "Lumen Diş",
    lines: [[["Sağlıklı gülüşler", 0]], [["özenli", 1], [" bir bakımla", 0]], [["başlar.", 0]]],
    sub: "Şeffaf fiyat, aynı hafta randevu.",
    cta: "Randevu al",
    schema: "Dentist",
    ask: "Merhaba, bu hafta için randevu alabilir miyim?",
    wa: "Merhaba, diş kliniğim için web sitesi istiyorum. Ücretsiz görüşme alabilir miyim?",
    pal: { bg: "#f1f3ef", ink: "#141513", accent: "#6f8f7c", block: "#dfe5dc" },
  },
  {
    id: "kafe",
    label: "Kafe / restoran",
    brand: "Mavi Masa",
    lines: [[["Her sabah", 0]], [["taze", 1], [" çekilen", 0]], [["kahve.", 0]]],
    sub: "Menü, çalışma saatleri ve yol tarifi tek sayfada.",
    cta: "Menüyü gör",
    schema: "CafeOrCoffeeShop",
    ask: "Merhaba, akşam 4 kişilik masa var mı?",
    wa: "Merhaba, kafem / restoranım için web sitesi istiyorum. Ücretsiz görüşme alabilir miyim?",
    pal: { bg: "#f4ede2", ink: "#1d1712", accent: "#b5562f", block: "#ead9c4" },
  },
  {
    id: "kuafor",
    label: "Kuaför / güzellik",
    brand: "Atölye Saç",
    lines: [[["Aynaya", 0]], [["güvenle", 1], [" bakın.", 0]]],
    sub: "Hizmetler, fiyatlar ve online randevu.",
    cta: "Randevu al",
    schema: "HairSalon",
    ask: "Merhaba, cumartesi için kesim randevusu alabilir miyim?",
    wa: "Merhaba, kuaför / güzellik salonum için web sitesi istiyorum. Ücretsiz görüşme alabilir miyim?",
    pal: { bg: "#f3eeee", ink: "#191416", accent: "#9a5a6c", block: "#e6d7da" },
  },
  {
    id: "hukuk",
    label: "Avukat / danışman",
    brand: "Kaya Hukuk",
    lines: [[["Haklarınız,", 0]], [["net", 1], [" bir dille.", 0]]],
    sub: "Çalışma alanları ve ilk görüşme talebi.",
    cta: "Görüşme planla",
    schema: "LegalService",
    ask: "Merhaba, bir sözleşme için görüşme talep ediyorum.",
    wa: "Merhaba, hukuk / danışmanlık ofisim için web sitesi istiyorum. Ücretsiz görüşme alabilir miyim?",
    pal: { bg: "#eef0f3", ink: "#12161d", accent: "#3f5878", block: "#d9dfe8" },
  },
  {
    id: "emlak",
    label: "Emlak",
    brand: "Kıyı Emlak",
    lines: [[["Doğru ev,", 0]], [["ilk", 1], [" ziyarette.", 0]]],
    sub: "Güncel ilanlar, harita ve tek dokunuşla arama.",
    cta: "İlanları gör",
    schema: "RealEstateAgent",
    ask: "Merhaba, 3+1 ilanınız hâlâ satılık mı?",
    wa: "Merhaba, emlak ofisim için web sitesi istiyorum. Ücretsiz görüşme alabilir miyim?",
    pal: { bg: "#f2f1ec", ink: "#15150f", accent: "#8a7a3c", block: "#e3e0d0" },
  },
  {
    id: "diger",
    label: "Başka bir iş",
    brand: "İşletmeniz",
    lines: [[["İşinizi", 0]], [["ilk bakışta", 1]], [["anlatan site.", 0]]],
    sub: "Ne yaptığınız, neden siz, nasıl ulaşılır.",
    cta: "Bize ulaşın",
    schema: "LocalBusiness",
    ask: "Merhaba, fiyat bilgisi alabilir miyim?",
    wa: "Merhaba, işletmem için web sitesi istiyorum. Ücretsiz görüşme alabilir miyim?",
    pal: { bg: "#f0efea", ink: "#141412", accent: "#a8752f", block: "#e2dfd4" },
  },
];

// What the scene shows before the visitor picks anything.
export const defaultSector = sectors[sectors.length - 1];
