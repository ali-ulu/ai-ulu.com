// Tek kaynak: EN ve TR sayfaları buradan üretilir. Rakam/metrik uydurulmaz (Ali kararı 03.10).
export const SITE = {
  origin: "https://ai-ulu.com",
  whatsapp: "905079581642",
  // Telefon, WhatsApp ile aynı numaradır (uydurma değil). Yapısal veri ve tel: linki buradan beslenir.
  phone: "+905079581642",
  // Form gönderimlerinin düştüğü gerçek kutu (hosting/form.php INBOX ile aynı).
  email: "aliulu@ai-ulu.com",
  // Ülke, telefon kodundan (+90) doğrulanabilir. Tam posta adresi (sokak/şehir) gerçek
  // olarak bilinmediği için UYDURULMAZ; yalnızca ülke düzeyi verilir.
  country: "TR",
  github: "https://github.com/ali-ulu",
  linkedin: "", // Ali'den bekleniyor; boşsa footer'da gösterilmez
  // Analitik: çerezsiz, KVKK dostu. Cloudflare Web Analytics token'ı buraya yazılınca
  // sayfalara script eklenir (ücretsiz, panel: dash.cloudflare.com > Analytics > Web Analytics).
  // Boşken hiçbir şey yüklenmez ve hiçbir veri toplanmaz.
  cloudflareAnalytics: "",
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
];
export const gridIds = ["attalia", "clinic", "hydrelon", "restaurant", "hercules", "law"];

// Ayrı sayfalar: ajanların "gerçek bir işletme mi" kararını verebilmesi için.
// Tüm ifadeler görünür sitedeki mevcut iddialarla tutarlıdır; yeni rakam/taahhüt eklenmez.
export const PAGES = {
  about: {
    slug: "about", slugTr: "hakkinda",
    en: {
      title: "About ai-ulu — a studio that designs, builds and launches",
      desc: "ai-ulu is a small design and engineering studio building cinematic websites and custom web apps in English and Turkish, for clients worldwide.",
      h1: "A studio that builds websites and apps <em>that win clients</em>",
      lead: "ai-ulu is a small design and engineering team. It designs, builds and launches cinematic websites and custom web apps, then stays on after launch for fixes and changes.",
      ldDesc: "A small design and engineering studio building websites and web apps.",
      sections: [
        ["How we work", [
          "Projects start with a free 30-minute intro call about the goal, the audience and the timeline. You get a written quote within 24 hours.",
          "Work happens in the open, with a clickable live preview you can use while the site is being built. One team carries the project from the first call to going live, so nothing is lost between sales and delivery.",
          "At launch, design, code and content are handed over. The client owns everything.",
        ]],
        ["What we build", [
          "Websites: art-directed brand and marketing sites, engineered for speed, search and conversion.",
          "Apps: custom web apps and internal tools such as dashboards, portals and automations.",
          "Site + App: one design system across both, so a whole company feels like one product.",
          "Post-launch support: fixes, changes and ongoing maintenance.",
        ]],
        ["Languages and reach", [
          "The studio works in English and Turkish, for both the site and communication, and takes clients worldwide.",
        ]],
      ],
    },
    tr: {
      title: "ai-ulu hakkında — tasarlayan, geliştiren ve yayına alan stüdyo",
      desc: "ai-ulu, İngilizce ve Türkçe sinematik web siteleri ve özel uygulamalar geliştiren küçük bir tasarım ve mühendislik stüdyosudur; dünya çapında müşterilerle çalışır.",
      h1: "Müşteri kazandıran web siteleri ve uygulamalar <em>geliştiren stüdyo</em>",
      lead: "ai-ulu küçük bir tasarım ve mühendislik ekibidir. Sinematik web siteleri ve özel uygulamalar tasarlar, geliştirir, yayına alır ve yayından sonra da düzeltme ve değişiklikler için yanınızda kalır.",
      ldDesc: "Web siteleri ve uygulamalar geliştiren küçük bir tasarım ve mühendislik stüdyosu.",
      sections: [
        ["Nasıl çalışıyoruz", [
          "Projeler, hedef, kitle ve takvim üzerine ücretsiz 30 dakikalık bir ön görüşmeyle başlar. 24 saat içinde yazılı teklif alırsınız.",
          "İş açıkta yürür: site kurulurken tıklanabilir canlı bir önizlemeyi kullanabilirsiniz. Projeyi ilk görüşmeden yayına tek ekip taşır; satış ve teslim arasında hiçbir şey kaybolmaz.",
          "Yayında tasarım, kod ve içerik teslim edilir. Her şey müşteriye aittir.",
        ]],
        ["Neler yapıyoruz", [
          "Web siteleri: hız, arama ve dönüşüm için kurulmuş, sanat yönetimli marka ve tanıtım siteleri.",
          "Uygulamalar: paneller, portallar ve otomasyonlar gibi özel web uygulamaları ve iç araçlar.",
          "Site + Uygulama: ikisinde tek tasarım sistemi; tüm şirket tek ürünmüş gibi hissettirir.",
          "Yayın sonrası destek: düzeltmeler, değişiklikler ve sürekli bakım.",
        ]],
        ["Diller ve kapsam", [
          "Stüdyo hem site hem iletişim için İngilizce ve Türkçe çalışır ve dünya çapında müşteri kabul eder.",
        ]],
      ],
    },
  },
  terms: {
    slug: "terms", slugTr: "sartlar",
    en: {
      title: "Terms of Service — ai-ulu",
      desc: "The terms that apply to design and development work ai-ulu does for clients.",
      h1: "Terms of Service",
      lead: "These terms apply to design and development work ai-ulu does for clients. Each project's specific scope, timeline and price are agreed in the written quote.",
      sections: [
        ["Scope", [
          "Every project is scoped individually and confirmed in a written quote before work starts. Anything not listed in the quote is out of scope.",
          "Work is delivered in stages. Changes agreed after a stage is signed off may affect the timeline and the price.",
        ]],
        ["Payment", [
          "Prices are set out in the written quote. Payment schedule and currency are stated there.",
        ]],
        ["Ownership", [
          "On full payment at launch, the client owns the delivered design, code and content.",
          "ai-ulu may show the finished work in its own portfolio unless the client asks otherwise in writing.",
        ]],
        ["Support", [
          "Each package includes launch and post-launch support. The length and the extent are stated in the quote. Ongoing maintenance is available separately.",
        ]],
        ["Liability", [
          "ai-ulu provides the agreed services with reasonable skill and care. It is not liable for indirect losses, or for content, data or third-party services supplied by the client.",
        ]],
        ["Contact", [
          "Questions about these terms go to the contact details on the contact page.",
        ]],
      ],
    },
    tr: {
      title: "Hizmet Şartları — ai-ulu",
      desc: "ai-ulu'nun müşteriler için yaptığı tasarım ve geliştirme işlerine uygulanan şartlar.",
      h1: "Hizmet Şartları",
      lead: "Bu şartlar, ai-ulu'nun müşteriler için yaptığı tasarım ve geliştirme işlerine uygulanır. Her projenin kapsamı, takvimi ve fiyatı yazılı teklifte kararlaştırılır.",
      sections: [
        ["Kapsam", [
          "Her proje kendi kapsamıyla fiyatlanır ve işe başlamadan önce yazılı teklifle onaylanır. Teklifte yer almayan her şey kapsam dışıdır.",
          "İş aşamalar hâlinde teslim edilir. Bir aşama onaylandıktan sonra kararlaştırılan değişiklikler takvimi ve fiyatı etkileyebilir.",
        ]],
        ["Ödeme", [
          "Fiyatlar yazılı teklifte belirtilir. Ödeme planı ve para birimi de orada yer alır.",
        ]],
        ["Sahiplik", [
          "Yayında tam ödemeyle birlikte teslim edilen tasarım, kod ve içerik müşteriye ait olur.",
          "ai-ulu, müşteri yazılı olarak aksini istemedikçe tamamlanan işi kendi portföyünde gösterebilir.",
        ]],
        ["Destek", [
          "Her paket yayın ve yayın sonrası destek içerir. Süre ve kapsam teklifte belirtilir. Sürekli bakım ayrıca alınabilir.",
        ]],
        ["Sorumluluk", [
          "ai-ulu, kararlaştırılan hizmetleri makul beceri ve özenle sunar. Dolaylı kayıplardan ya da müşterinin sağladığı içerik, veri veya üçüncü taraf hizmetlerden sorumlu değildir.",
        ]],
        ["İletişim", [
          "Bu şartlarla ilgili sorular için iletişim sayfasındaki bilgileri kullanın.",
        ]],
      ],
    },
  },
  privacy: {
    slug: "privacy", slugTr: "gizlilik",
    en: {
      title: "Privacy — ai-ulu",
      desc: "What ai-ulu collects, why, and how to have it removed. No tracking cookies, no third-party advertising.",
      h1: "Privacy",
      lead: "ai-ulu keeps data collection to a minimum. There are no tracking cookies and no advertising trackers.",
      sections: [
        ["What we collect", [
          "If you send the contact form, we receive the name, contact detail (email or phone), project type and message you enter. We use them only to reply to you.",
          "The site stores one preference in your browser's local storage: your light or dark theme choice. It never leaves your device.",
        ]],
        ["Analytics", [
          "The site is built to use cookieless, privacy-friendly analytics. It is currently switched off, so no analytics data is collected at all.",
        ]],
        ["Storage and sharing", [
          "Form messages are stored on the hosting server and emailed to ai-ulu's inbox. They are not sold or shared with third parties.",
        ]],
        ["Your rights", [
          "You can ask what we hold about you, or ask us to delete it, by emailing the address on the contact page. We will act on a request within a reasonable time.",
        ]],
      ],
    },
    tr: {
      title: "Gizlilik — ai-ulu",
      desc: "ai-ulu'nun neleri, neden topladığı ve nasıl sildirebileceğiniz. Takip çerezi yok, üçüncü taraf reklam yok.",
      h1: "Gizlilik",
      lead: "ai-ulu veri toplamayı en aza indirir. Takip çerezi ve reklam izleyicisi yoktur.",
      sections: [
        ["Neleri topluyoruz", [
          "İletişim formunu gönderirseniz girdiğiniz ad, iletişim bilgisi (e-posta ya da telefon), proje türü ve mesaj bize ulaşır. Bunları yalnızca size dönüş yapmak için kullanırız.",
          "Site, tarayıcınızın yerel deposunda tek bir tercih tutar: açık ya da koyu tema seçiminiz. Bu bilgi cihazınızdan hiç çıkmaz.",
        ]],
        ["Analitik", [
          "Site, çerezsiz ve gizlilik dostu analitik kullanacak şekilde kurulmuştur. Şu anda kapalıdır; yani hiçbir analitik verisi toplanmaz.",
        ]],
        ["Saklama ve paylaşım", [
          "Form mesajları barındırma sunucusunda saklanır ve ai-ulu'nun gelen kutusuna e-postalanır. Satılmaz ve üçüncü taraflarla paylaşılmaz.",
        ]],
        ["Haklarınız", [
          "Hakkınızda ne tuttuğumuzu sorabilir ya da silmemizi isteyebilirsiniz: iletişim sayfasındaki adrese e-posta gönderin. Talebi makul bir sürede yerine getiririz.",
        ]],
      ],
    },
  },
};

// İletişim sayfası ve yapısal veri bu tek kaynaktan beslenir.
export const CONTACT = {
  slug: "contact", slugTr: "iletisim",
  en: {
    title: "Contact ai-ulu",
    desc: "Email, phone or WhatsApp ai-ulu, or send the contact form. We reply within 24 hours.",
    h1: "Contact",
    lead: "Tell us what you're building. We reply within 24 hours with a time for a free intro call.",
    emailLabel: "Email", phoneLabel: "Phone", waLabel: "WhatsApp", formLabel: "Contact form",
  },
  tr: {
    title: "ai-ulu ile iletişim",
    desc: "ai-ulu'ya e-posta, telefon veya WhatsApp ile ulaşın ya da formu gönderin. 24 saat içinde dönüş yaparız.",
    h1: "İletişim",
    lead: "Ne kurduğunuzu anlatın. 24 saat içinde ücretsiz ön görüşme için bir saatle dönelim.",
    emailLabel: "E-posta", phoneLabel: "Telefon", waLabel: "WhatsApp", formLabel: "İletişim formu",
  },
};

export const T = {
  en: {
    lang: "en", dir: "/", alt: "/tr/", altLabel: "TR", htmlLang: "en",
    title: "ai-ulu — Websites and apps built to win clients",
    desc: "ai-ulu designs, builds and launches cinematic websites and custom apps. One team from first call to live. Start with a free intro call.",
    nav: [["services", "Services"], ["work", "Work"], ["pricing", "Pricing"], ["contact", "Contact"]],
    start: "Start a Project", works: "See Our Works",
    marquee: ["Websites", "Apps", "Booking sites", "Brand identity", "Launch", "Support"],
    themeLabel: "Switch between dark and light theme",
    hero: {
      badge: "Trusted by Attalia, Hercules and Hydrelon",
      h1: "Websites and apps built to <em>win clients</em>",
      sub: "ai-ulu designs, builds and launches cinematic websites and custom apps for brands that need more than a template. One team, from first call to live.",
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
      prev: "Previous project", next: "Next project", pause: "Pause automatic scrolling", play: "Resume automatic scrolling",
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
        ["Can you build apps, not just websites?", "Yes. Custom web apps, dashboards and internal tools are part of ai-ulu."],
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
      invalidReach: "That doesn't look like a working email or phone number. Check it and try again.",
      sending: "Sending…",
      sent: "Sent",
    },
    footer: { rights: "© 2026 ai-ulu. All rights reserved.", tag: "Websites and apps, from first call to live." },
    // Footer/erişilebilirlik: ajanların ve ziyaretçilerin bulması gereken sayfalar.
    pagesNav: [["about", "About"], ["contact", "Contact"], ["terms", "Terms"], ["privacy", "Privacy"]],
    telLabel: "Call", emailLabel: "Email",
    skip: "Skip to content",
    ld: { orgDesc: "ai-ulu designs, builds and launches cinematic websites and custom apps." },
  },
  tr: {
    lang: "tr", dir: "/tr/", alt: "/", altLabel: "EN", htmlLang: "tr",
    title: "ai-ulu — Müşteri kazandıran web siteleri ve uygulamalar",
    desc: "ai-ulu, sinematik web siteleri ve özel uygulamalar tasarlar, geliştirir ve yayına alır. İlk görüşmeden yayına tek ekip. Ücretsiz ön görüşmeyle başlayın.",
    nav: [["services", "Hizmetler"], ["work", "İşler"], ["pricing", "Paketler"], ["contact", "İletişim"]],
    start: "Proje Başlat", works: "İşlerimizi Gör",
    marquee: ["Web siteleri", "Uygulamalar", "Randevu siteleri", "Marka kimliği", "Yayın", "Destek"],
    themeLabel: "Koyu ve açık tema arasında geçiş",
    hero: {
      badge: "Attalia, Hercules ve Hydrelon tarafından tercih edildi",
      h1: "Müşteri kazandıran <em>web siteleri</em> ve uygulamalar",
      sub: "ai-ulu, şablondan fazlasını isteyen markalar için sinematik web siteleri ve özel uygulamalar tasarlar, geliştirir ve yayına alır. İlk görüşmeden yayına tek ekip.",
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
      prev: "Önceki proje", next: "Sonraki proje", pause: "Otomatik kaydırmayı duraklat", play: "Otomatik kaydırmayı sürdür",
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
        ["Sadece site değil, uygulama da yapıyor musunuz?", "Evet. Özel web uygulamaları, paneller ve iç araçlar ai-ulu'nun parçası."],
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
      invalidReach: "Bu geçerli bir e-posta ya da telefon numarasına benzemiyor. Kontrol edip yeniden deneyin.",
      sending: "Gönderiliyor…",
      sent: "Gönderildi",
    },
    footer: { rights: "© 2026 ai-ulu. Tüm hakları saklıdır.", tag: "İlk görüşmeden yayına, web siteleri ve uygulamalar." },
    pagesNav: [["about", "Hakkında"], ["contact", "İletişim"], ["terms", "Şartlar"], ["privacy", "Gizlilik"]],
    telLabel: "Ara", emailLabel: "E-posta",
    skip: "İçeriğe geç",
    ld: { orgDesc: "ai-ulu, sinematik web siteleri ve özel uygulamalar tasarlar, geliştirir ve yayına alır." },
  },
};
