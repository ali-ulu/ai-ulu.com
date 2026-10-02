// Tek kaynak: EN ve TR sayfaları buradan üretilir. Rakam/metrik uydurulmaz (Ali kararı 03.10).
export const SITE = {
  origin: "https://ai-ulu.com",
  whatsapp: "905079581642",
  github: "https://github.com/ali-ulu",
  linkedin: "", // Ali'den bekleniyor; boşsa footer'da gösterilmez
};

// kind: client | app | template. Hero panoraması ve "Works" gridi buradan beslenir.
export const panorama = [
  { id: "attalia", img: "work-attalia.webp", name: "Attalia", kind: "client", url: "" },
  { id: "clinic", img: "tpl-clinic.webp", name: "Aura Aesthetic Clinic", kind: "template", url: "templates/clinic/" },
  { id: "hydrelon", img: "work-hydrelon.webp", name: "Hydrelon", kind: "client", url: "https://hydrelon.com" },
  { id: "restaurant", img: "tpl-restaurant.webp", name: "Maison Olive", kind: "template", url: "templates/restaurant/" },
  { id: "hercules", img: "work-hercules.webp", name: "Hercules Investments", kind: "client", url: "https://herculesinvestmentsllc.com" },
  { id: "law", img: "tpl-law.webp", name: "Hale & Rowe", kind: "template", url: "templates/law/" },
  { id: "studio", img: "tpl-studio.webp", name: "Atelier Nord", kind: "template", url: "templates/studio/" },
  { id: "fitness", img: "tpl-fitness.webp", name: "Pulse Studio", kind: "template", url: "templates/fitness/" },
  { id: "tpl-a", img: "tpl-a.webp", name: "Kırağı Yayla Evi", kind: "template", url: "https://ai-ulu.com/ornekler/a-sinematik/" },
  { id: "tpl-d", img: "tpl-d.webp", name: "Kil & Kül", kind: "template", url: "https://ai-ulu.com/ornekler/d-imza/" },
];
export const gridIds = ["attalia", "clinic", "hydrelon", "restaurant", "hercules", "law"];

export const T = {
  en: {
    lang: "en", dir: "/", alt: "/tr/", altLabel: "TR", htmlLang: "en",
    title: "Shipcraft by ai-ulu — Websites and apps built to win clients",
    desc: "Shipcraft designs, builds and launches cinematic websites and custom apps. One team from first call to live. Start with a free intro call.",
    nav: [["services", "Services"], ["work", "Work"], ["pricing", "Pricing"], ["contact", "Contact"]],
    start: "Start a Project", works: "See Our Works",
    marquee: ["Websites", "Apps", "Booking sites", "Brand identity", "Launch", "Support"],
    themeLabel: "Switch between dark and light theme",
    hero: {
      badge: "Trusted by Attalia, Hercules and Hydrelon",
      h1: "Websites and apps built to <em>win clients</em>",
      sub: "Shipcraft designs, builds and launches cinematic websites and custom apps for brands that need more than a template. One team, from first call to live.",
      chips: ["Web Design", "App Development", "Launch & Support"],
      card: "Client site",
    },
    problem: {
      eyebrow: "The Problem", h: "A strong brand, but a site that <em>doesn't sell?</em>",
      sub: "Most websites lose visitors in the first scroll. The brand isn't the issue. The build is.",
      items: [
        ["Looks like everyone else", "Same template, same layout as every competitor. Visitors can't tell you apart, so they leave."],
        ["No path to action", "Without a clear next step there are no calls, no leads and no sales."],
        ["Gone after launch", "The agency disappears at go-live and every fix becomes your problem."],
      ],
    },
    solution: {
      eyebrow: "How We Fix It", h: "A done-for-you build system <em>that ships</em>",
      sub: "You bring the goal. We handle design, development, launch and support.",
      stats: [["EN · TR", "Two languages, one team"], ["24h", "First reply, every time"], ["Yours", "Design, code and content"], ["Live", "Clickable preview from day one"]],
    },
    services: {
      eyebrow: "What We Do", h: "Websites and apps, from first sketch <em>to live</em>",
      sub: "Launching a brand or upgrading a product, you get the design and engineering to do it properly.",
      items: [
        ["Websites", "Art-directed brand and marketing sites. Fast, searchable and built to convert."],
        ["Apps", "Custom web apps and internal tools: dashboards, portals and automations."],
        ["Site + App", "One design system across both, so your whole company feels like one product."],
      ],
      feat: {
        h: "More launches,<br>less chaos",
        text: "Hand off the build. We deliver a polished, production-ready result while you focus on running the business.",
        items: [["Fast delivery", "Clear scope and a live preview from week one."], ["Built to perform", "Every page is engineered for speed, search and conversion."], ["Direct access", "You work with the people building it. No account layers."]],
      },
    },
    work: {
      eyebrow: "Our Works", h: "We don't just make it look good. <em>We make it work.</em>",
      sub: "Client sites and ready-to-launch templates for clinics, restaurants, studios and more.",
      kinds: { client: "Client site", template: "Template" },
      desc: {
        attalia: "Group site for a global commerce holding.",
        clinic: "Booking-led site for an aesthetic clinic.",
        hydrelon: "Product site for a water-filtration brand.",
        restaurant: "Reservation-first site for a restaurant.",
        hercules: "Brand group site for a US e-commerce company.",
        law: "Authority site for a boutique law firm.",
      },
      open: "Open", soon: "Not public yet",
    },
    process: {
      eyebrow: "Process", h: "Three steps from brief <em>to live</em>",
      steps: [
        ["Brief", "A free 30-minute call. We define the goal, the scope and the timeline."],
        ["Build", "Design and development in the open, with a live preview you can click."],
        ["Ship", "We launch, test on real devices and stay on for fixes and changes."],
      ],
    },
    pricing: {
      eyebrow: "Pricing", h: "Choose a package. <em>Get a fixed quote.</em>",
      sub: "No price list: every project is scoped on its own. You get a written quote within 24 hours.",
      quote: "Quote within 24 hours", cta: "Get a quote", badge: "Most complete",
      packs: [
        ["Website", ["Art-directed design", "Motion and fast load times", "SEO-ready, English and Turkish", "Launch and post-launch support"]],
        ["App", ["Custom web app or internal tool", "Dashboards, portals, automations", "Built around your workflow", "Launch and post-launch support"]],
        ["Site + App", ["One design system across both", "Marketing site and product together", "English and Turkish", "Launch and post-launch support"]],
      ],
    },
    faq: {
      eyebrow: "FAQ", h: "Questions, answered",
      items: [
        ["How long does a website take?", "A focused marketing site usually takes two to four weeks from the first call to launch. Larger sites and apps take longer, and the timeline is in the quote."],
        ["What does the free call include?", "A 30-minute conversation about your goal, audience and timing. You leave with a rough scope and an honest view of fit. It costs nothing and commits you to nothing."],
        ["Do I own the site and the code?", "Yes. Design, code and content are yours, and everything is handed over at launch."],
        ["Do you keep working after launch?", "Yes. We fix issues, handle changes and can maintain the site on an ongoing basis."],
        ["Can you build apps, not just websites?", "Yes. Custom web apps, dashboards and internal tools are part of Shipcraft."],
        ["Which languages do you work in?", "English and Turkish, for the site and for communication."],
      ],
    },
    contact: {
      eyebrow: "Contact", h: "Ready to <em>launch?</em>",
      sub: "Tell us what you're building. We reply within 24 hours with a time for a free intro call.",
      name: "Your name", reach: "Email or phone", type: "What do you need?",
      types: [["site", "A website"], ["app", "An app"], ["both", "Both"], ["unsure", "Not sure yet"]],
      msg: "About the project", send: "Request my free call",
      ok: "Thanks. We'll get back to you within 24 hours.",
      fallback: "The form service isn't reachable. Send the same details on WhatsApp:",
      fallbackBtn: "Send on WhatsApp",
      or: "Prefer to chat now?", waCta: "Message us on WhatsApp",
      waText: "Hi, I'd like a free intro call about a project.",
      required: "Please add your name and a way to reach you.",
    },
    footer: { rights: "© 2026 ai-ulu. All rights reserved.", tag: "Shipcraft is the web and app studio of ai-ulu." },
    skip: "Skip to content",
    ld: { orgDesc: "ai-ulu builds websites and apps through its studio Shipcraft." },
  },
  tr: {
    lang: "tr", dir: "/tr/", alt: "/", altLabel: "EN", htmlLang: "tr",
    title: "Shipcraft, ai-ulu — Müşteri kazandıran web siteleri ve uygulamalar",
    desc: "Shipcraft, sinematik web siteleri ve özel uygulamalar tasarlar, geliştirir ve yayına alır. İlk görüşmeden yayına tek ekip. Ücretsiz ön görüşmeyle başlayın.",
    nav: [["services", "Hizmetler"], ["work", "İşler"], ["pricing", "Paketler"], ["contact", "İletişim"]],
    start: "Proje Başlat", works: "İşlerimizi Gör",
    marquee: ["Web siteleri", "Uygulamalar", "Randevu siteleri", "Marka kimliği", "Yayın", "Destek"],
    themeLabel: "Koyu ve açık tema arasında geçiş",
    hero: {
      badge: "Attalia, Hercules ve Hydrelon tarafından tercih edildi",
      h1: "Müşteri kazandıran <em>web siteleri</em> ve uygulamalar",
      sub: "Shipcraft, şablondan fazlasını isteyen markalar için sinematik web siteleri ve özel uygulamalar tasarlar, geliştirir ve yayına alır. İlk görüşmeden yayına tek ekip.",
      chips: ["Web Tasarım", "Uygulama Geliştirme", "Yayın ve Destek"],
      card: "Müşteri sitesi",
    },
    problem: {
      eyebrow: "Sorun", h: "Güçlü bir marka, ama <em>satmayan</em> bir site mi?",
      sub: "Çoğu web sitesi ziyaretçiyi ilk kaydırmada kaybeder. Sorun marka değil, yapım.",
      items: [
        ["Herkesle aynı görünüm", "Aynı şablon, rakiplerle aynı düzen. Ziyaretçi sizi ayıramaz ve çıkar."],
        ["Eyleme giden yol yok", "Net bir sonraki adım yoksa arama, talep ve satış da yoktur."],
        ["Yayından sonra kayıp", "Ajans yayın günü kaybolur, her düzeltme size kalır."],
      ],
    },
    solution: {
      eyebrow: "Çözümümüz", h: "Sizin yerinize yapan, <em>yayına alan</em> bir yapım sistemi",
      sub: "Hedefi siz getirin. Tasarım, geliştirme, yayın ve destek bizde.",
      stats: [["EN · TR", "İki dil, tek ekip"], ["24 sa", "Her talebe ilk dönüş"], ["Sizin", "Tasarım, kod ve içerik"], ["Canlı", "İlk günden tıklanabilir önizleme"]],
    },
    services: {
      eyebrow: "Hizmetler", h: "İlk eskizden <em>yayına</em> web siteleri ve uygulamalar",
      sub: "Marka kuruyor ya da ürününüzü yeniliyor olun, işi doğru yapacak tasarım ve mühendislik burada.",
      items: [
        ["Web Siteleri", "Sanat yönetimli marka ve tanıtım siteleri. Hızlı, aranabilir ve dönüşüm için kurulu."],
        ["Uygulamalar", "Özel web uygulamaları ve iç araçlar: paneller, portallar, otomasyonlar."],
        ["Site + Uygulama", "İkisinde tek tasarım sistemi; tüm şirketiniz tek ürün gibi görünür."],
      ],
      feat: {
        h: "Daha çok yayın,<br>daha az karmaşa",
        text: "Yapımı devredin. Siz işi yönetmeye odaklanırken biz cilalı, yayına hazır sonucu teslim ederiz.",
        items: [["Hızlı teslimat", "Net kapsam ve ilk haftadan canlı önizleme."], ["Performans için kurulu", "Her sayfa hız, arama ve dönüşüm için tasarlanır."], ["Doğrudan erişim", "Yapan kişilerle çalışırsınız. Aracı katman yok."]],
      },
    },
    work: {
      eyebrow: "İşlerimiz", h: "Sadece güzel göstermiyoruz. <em>Çalıştırıyoruz.</em>",
      sub: "Müşteri siteleri ve klinik, restoran, stüdyo gibi sektörler için yayına hazır şablonlar.",
      kinds: { client: "Müşteri sitesi", template: "Şablon" },
      desc: {
        attalia: "Küresel ticaret holdingi için grup sitesi.",
        clinic: "Randevu odaklı estetik klinik sitesi.",
        hydrelon: "Su arıtma markası için ürün sitesi.",
        restaurant: "Rezervasyon öncelikli restoran sitesi.",
        hercules: "ABD merkezli e-ticaret şirketi için marka grubu sitesi.",
        law: "Butik hukuk bürosu için güven veren site.",
      },
      open: "Aç", soon: "Henüz yayında değil",
    },
    process: {
      eyebrow: "Süreç", h: "Brief'ten <em>yayına</em> üç adım",
      steps: [
        ["Brief", "30 dakikalık ücretsiz görüşme. Hedefi, kapsamı ve takvimi netleştiririz."],
        ["Yapım", "Tıklayabildiğiniz canlı önizlemeyle, açık açık tasarım ve geliştirme."],
        ["Yayın", "Yayına alır, gerçek cihazlarda test eder, düzeltme ve değişiklik için yanınızda kalırız."],
      ],
    },
    pricing: {
      eyebrow: "Paketler", h: "Paketi seçin. <em>Net teklifi alın.</em>",
      sub: "Fiyat listesi yok: her proje kendi kapsamıyla fiyatlanır. 24 saat içinde yazılı teklif alırsınız.",
      quote: "24 saat içinde teklif", cta: "Teklif al", badge: "En kapsamlı",
      packs: [
        ["Web Sitesi", ["Sanat yönetimli tasarım", "Hareket ve hızlı yüklenme", "SEO hazır, İngilizce ve Türkçe", "Yayın ve yayın sonrası destek"]],
        ["Uygulama", ["Özel web uygulaması ya da iç araç", "Paneller, portallar, otomasyonlar", "İş akışınıza göre kurulur", "Yayın ve yayın sonrası destek"]],
        ["Site + Uygulama", ["İkisinde tek tasarım sistemi", "Tanıtım sitesi ve ürün birlikte", "İngilizce ve Türkçe", "Yayın ve yayın sonrası destek"]],
      ],
    },
    faq: {
      eyebrow: "SSS", h: "Sık sorulanlar",
      items: [
        ["Bir web sitesi ne kadar sürer?", "Odaklı bir tanıtım sitesi ilk görüşmeden yayına genellikle iki ila dört hafta sürer. Büyük siteler ve uygulamalar daha uzun sürer; takvim teklifte yer alır."],
        ["Ücretsiz görüşmede ne oluyor?", "Hedefiniz, kitleniz ve takviminiz üzerine 30 dakikalık konuşma. Yaklaşık bir kapsamla ve uyumumuz hakkında dürüst bir görüşle ayrılırsınız. Ücretsizdir, taahhüt gerektirmez."],
        ["Site ve kod bana mı ait olur?", "Evet. Tasarım, kod ve içerik size aittir; yayın günü her şey teslim edilir."],
        ["Yayından sonra da çalışıyor musunuz?", "Evet. Sorunları giderir, değişiklikleri yapar ve isterseniz siteyi sürekli bakımda tutarız."],
        ["Sadece site değil, uygulama da yapıyor musunuz?", "Evet. Özel web uygulamaları, paneller ve iç araçlar Shipcraft'ın parçası."],
        ["Hangi dillerde çalışıyorsunuz?", "Site ve iletişim için İngilizce ve Türkçe."],
      ],
    },
    contact: {
      eyebrow: "İletişim", h: "<em>Yayına</em> hazır mısınız?",
      sub: "Ne kurduğunuzu anlatın. 24 saat içinde ücretsiz ön görüşme için bir saatle dönelim.",
      name: "Adınız", reach: "E-posta ya da telefon", type: "Ne lazım?",
      types: [["site", "Web sitesi"], ["app", "Uygulama"], ["both", "İkisi de"], ["unsure", "Henüz emin değilim"]],
      msg: "Proje hakkında", send: "Ücretsiz görüşmemi iste",
      ok: "Teşekkürler. 24 saat içinde size döneceğiz.",
      fallback: "Form servisine ulaşılamadı. Aynı bilgileri WhatsApp'tan gönderin:",
      fallbackBtn: "WhatsApp'tan gönder",
      or: "Şimdi yazışmak ister misiniz?", waCta: "WhatsApp'tan yazın",
      waText: "Merhaba, bir proje için ücretsiz ön görüşme istiyorum.",
      required: "Lütfen adınızı ve size ulaşabileceğimiz bir yol yazın.",
    },
    footer: { rights: "© 2026 ai-ulu. Tüm hakları saklıdır.", tag: "Shipcraft, ai-ulu'nun web ve uygulama stüdyosudur." },
    skip: "İçeriğe geç",
    ld: { orgDesc: "ai-ulu, Shipcraft stüdyosuyla web siteleri ve uygulamalar geliştirir." },
  },
};
