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
      title: "ai-ulu hakkında — tasarlayan ve yayına alan stüdyo",
      desc: "ai-ulu, sinematik web siteleri ve özel uygulamalar tasarlayan, geliştiren ve yayına alan küçük bir tasarım stüdyosudur. İngilizce ve Türkçe çalışır.",
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

// Hizmet sayfaları: AI asistanlarının alıntılayacağı, hizmet başına ayrı derin sayfalar.
// Tüm ifadeler ana sayfadaki mevcut hizmet/fiyat/süreç metinleriyle tutarlıdır; yeni rakam yok.
export const SERVICES = [
  {
    key: "svcWebsites", slug: "services/websites", slugTr: "hizmetler/web-siteleri",
    pack: 0,
    en: {
      title: "Website design and development — ai-ulu",
      desc: "Art-directed brand and marketing websites, engineered for speed, search and conversion. Built in English and Turkish, launched with post-launch support.",
      h1: "Website design and development",
      lead: "Art-directed brand and marketing sites, engineered for speed, search and conversion. Built in English and Turkish, and supported after launch.",
      sections: [
        ["What you get", [
          "An art-directed brand or marketing website: a design that fits the brand rather than a template with your logo dropped in. Every page is written, structured and built to move a visitor toward contacting you.",
          "Speed is treated as a feature, not an afterthought. Pages are engineered for fast load times on real devices, and for search engines and AI assistants to read cleanly.",
        ]],
        ["Built for search and AI answers", [
          "Every site ships with the structure that search engines and AI assistants read: clean semantic HTML, structured data (Organization, Service, FAQ), an llms.txt summary, a sitemap and explicit access for AI crawlers.",
          "That is what makes a site citable in ChatGPT, Gemini and Google AI answers, not just findable in classic search results. It is built in from the first line of code, not bolted on later.",
        ]],
        ["English and Turkish", [
          "Sites are built to work in both English and Turkish, for the interface and for search. Each language gets its own URL, its own metadata and correct hreflang links, so neither language competes with the other.",
        ]],
        ["What is included", [
          "Art-directed design, motion and fast load times.",
          "SEO-ready structure, in English and Turkish.",
          "Launch and post-launch support: fixes, changes and ongoing maintenance.",
          "Full handover at launch — design, code and content are yours.",
        ]],
        ["How the project runs", [
          "Brief: a free 30-minute call to define the goal, the scope and the timeline.",
          "Build: design and development in the open, with a live preview you can click.",
          "Ship: launch, testing on real devices, then staying on for fixes and changes.",
        ]],
        ["Cost and timing", [
          "There is no fixed price list. Each project is scoped on its own, and a written quote follows within 24 hours of the free intro call.",
          "A focused marketing site usually takes two to four weeks from the first call to launch. Larger sites take longer, and the timeline is in the quote.",
        ]],
      ],
      faq: [
        ["How long does a website take?", "A focused marketing site usually takes two to four weeks from the first call to launch. Larger sites take longer, and the timeline is in the quote."],
        ["How much does a website cost?", "There is no fixed price list. Each project is scoped on its own and you get a written quote within 24 hours of the free intro call. The quote depends on the number of pages, the content work and whether an app is involved."],
        ["Can you redesign an existing website?", "Yes. ai-ulu can rebuild an outdated or weak site around a conversion goal, keeping what works and fixing the structure, speed and content that hold it back."],
      ],
    },
    tr: {
      title: "Web sitesi tasarımı ve geliştirme — ai-ulu",
      desc: "Hız, arama ve dönüşüm için kurulu, sanat yönetimli marka ve tanıtım siteleri. Türkçe ve İngilizce kurulur, yayın sonrası destekle teslim edilir.",
      h1: "Web sitesi tasarımı ve geliştirme",
      lead: "Hız, arama ve dönüşüm için kurulu, sanat yönetimli marka ve tanıtım siteleri. Türkçe ve İngilizce kurulur, yayın sonrası desteklenir.",
      sections: [
        ["Ne alırsınız", [
          "Sanat yönetimli bir marka ya da tanıtım sitesi: logonuzu üzerine koyduğunuz bir şablon değil, markaya uyan bir tasarım. Her sayfa ziyaretçiyi size ulaşmaya yaklaştıracak şekilde yazılır, yapılandırılır ve kurulur.",
          "Hız bir özellik olarak ele alınır, sonradan eklenen bir detay değil. Sayfalar gerçek cihazlarda hızlı yüklenir; arama motorları ve yapay zeka asistanları temiz okuyabilir.",
        ]],
        ["Arama ve yapay zeka cevapları için kurulu", [
          "Her site, arama motorlarının ve yapay zeka asistanlarının okuduğu yapıyla teslim edilir: temiz anlamsal HTML, yapısal veri (Organization, Service, FAQ), bir llms.txt özeti, site haritası ve AI tarayıcılarına açık erişim.",
          "Bir siteyi klasik arama sonuçlarında bulunur olmanın ötesine taşıyıp ChatGPT, Gemini ve Google AI cevaplarında alıntılanır yapan budur. Sonradan eklenmez; ilk kod satırından itibaren kurulur.",
        ]],
        ["İngilizce ve Türkçe", [
          "Siteler hem İngilizce hem Türkçe çalışacak şekilde kurulur; arayüz ve arama için. Her dil kendi URL'sini, kendi meta verisini ve doğru hreflang bağlantılarını alır; böylece iki dil birbiriyle yarışmaz.",
        ]],
        ["Neler dahil", [
          "Sanat yönetimli tasarım, hareket ve hızlı yüklenme.",
          "SEO hazır yapı, İngilizce ve Türkçe.",
          "Yayın ve yayın sonrası destek: düzeltmeler, değişiklikler ve sürekli bakım.",
          "Yayın günü tam teslim — tasarım, kod ve içerik size ait.",
        ]],
        ["Proje nasıl işler", [
          "Brief: hedefi, kapsamı ve takvimi netleştiren ücretsiz 30 dakikalık görüşme.",
          "Yapım: tıklayabildiğiniz canlı önizlemeyle, açık açık tasarım ve geliştirme.",
          "Yayın: yayına alır, gerçek cihazlarda test eder, düzeltme ve değişiklik için yanınızda kalırız.",
        ]],
        ["Maliyet ve süre", [
          "Sabit bir fiyat listesi yoktur. Her proje kendi kapsamıyla fiyatlanır ve ücretsiz ön görüşmeden sonraki 24 saat içinde yazılı teklif alırsınız.",
          "Odaklı bir tanıtım sitesi ilk görüşmeden yayına genellikle iki ila dört hafta sürer. Büyük siteler daha uzun sürer; takvim teklifte yer alır.",
        ]],
      ],
      faq: [
        ["Bir web sitesi ne kadar sürer?", "Odaklı bir tanıtım sitesi ilk görüşmeden yayına genellikle iki ila dört hafta sürer. Büyük siteler daha uzun sürer; takvim teklifte yer alır."],
        ["Bir web sitesi ne kadar tutar?", "Sabit bir fiyat listesi yoktur. Her proje kendi kapsamıyla fiyatlanır ve ücretsiz ön görüşmeden sonraki 24 saat içinde yazılı teklif alırsınız. Teklif; sayfa sayısına, içerik işine ve bir uygulamanın dahil olup olmadığına göre değişir."],
        ["Var olan bir siteyi yeniden yapabilir misiniz?", "Evet. ai-ulu, eski ya da zayıf bir siteyi dönüşüm hedefi etrafında yeniden kurabilir; işleyeni korur, sitenin önünü kesen yapı, hız ve içerik sorunlarını düzeltir."],
      ],
    },
  },
  {
    key: "svcApps", slug: "services/apps", slugTr: "hizmetler/uygulamalar",
    pack: 1,
    en: {
      title: "Custom web app development — ai-ulu",
      desc: "Custom web apps and internal tools: dashboards, portals and automations, built around your workflow, with launch and post-launch support.",
      h1: "Custom web app development",
      lead: "Custom web apps and internal tools — dashboards, portals and automations — built around your workflow, with launch and post-launch support.",
      sections: [
        ["What you get", [
          "A custom web application built for the job it has to do, not a generic tool bent into shape. That can be a customer-facing portal, an internal dashboard, or an automation that removes a manual step from your day.",
          "The app is built around your workflow. The goal is that using it feels obvious, because it was designed from how your team already works.",
        ]],
        ["Types of app", [
          "Dashboards: a single view of the numbers and status that matter, updated and readable.",
          "Portals: a place for clients, partners or staff to log in and do their part of the work.",
          "Automations: internal tools that take over repetitive steps so people do not have to.",
        ]],
        ["Built to last", [
          "Apps are built with the same care as the sites: clean structure, fast responses, and a design that fits the rest of the brand. Launch is not the end — fixes, changes and ongoing maintenance are part of the work.",
          "If the app has to sit alongside a marketing site, it can share one design system with it, so the whole company feels like one product.",
        ]],
        ["What is included", [
          "A custom web app or internal tool, built around your workflow.",
          "Dashboards, portals and automations as needed.",
          "Launch and post-launch support.",
          "Full handover — the code is yours.",
        ]],
        ["How the project runs", [
          "Brief: a free 30-minute call to define the goal, the scope and the timeline.",
          "Build: design and development in the open, with a live preview you can click.",
          "Ship: launch, testing on real devices, then staying on for fixes and changes.",
        ]],
        ["Cost and timing", [
          "There is no fixed price list. Each project is scoped on its own, and a written quote follows within 24 hours of the free intro call.",
          "An app takes longer than a marketing site. The timeline depends on the workflow it has to cover, and it is set out in the quote.",
        ]],
      ],
      faq: [
        ["Can you build apps, not just websites?", "Yes. Custom web apps, dashboards and internal tools are part of ai-ulu, built around your workflow."],
        ["How much does an app cost?", "There is no fixed price list. Each app is scoped on its own and you get a written quote within 24 hours of the free intro call. The quote depends on the workflows, screens and integrations involved."],
        ["Do I own the app and the code?", "Yes. Design, code and content are yours, and everything is handed over at launch."],
      ],
    },
    tr: {
      title: "Özel web uygulaması geliştirme — ai-ulu",
      desc: "İş akışınıza göre kurulan özel web uygulamaları ve iç araçlar: paneller, portallar ve otomasyonlar; yayın ve yayın sonrası destekle.",
      h1: "Özel web uygulaması geliştirme",
      lead: "İş akışınıza göre kurulan özel web uygulamaları ve iç araçlar — paneller, portallar ve otomasyonlar — yayın ve yayın sonrası destekle.",
      sections: [
        ["Ne alırsınız", [
          "Yapması gereken iş için kurulmuş özel bir web uygulaması; şekle sokulmuş genel bir araç değil. Bu, müşteriye dönük bir portal, bir iç panel ya da gününüzden manuel bir adımı kaldıran bir otomasyon olabilir.",
          "Uygulama iş akışınıza göre kurulur. Amaç, kullanmanın bariz hissettirmesidir; çünkü ekibinizin hâlihazırda nasıl çalıştığından tasarlanır.",
        ]],
        ["Uygulama türleri", [
          "Paneller: önemli sayıların ve durumun tek bir görünümü; güncel ve okunur.",
          "Portallar: müşterilerin, iş ortaklarının ya da personelin girip işin kendi payını yaptığı bir yer.",
          "Otomasyonlar: tekrar eden adımları devralan iç araçlar; böylece insanların yapmasına gerek kalmaz.",
        ]],
        ["Kalıcı olacak şekilde kurulu", [
          "Uygulamalar sitelerle aynı özenle kurulur: temiz yapı, hızlı yanıtlar ve markanın geri kalanına uyan bir tasarım. Yayın son değildir — düzeltmeler, değişiklikler ve sürekli bakım işin parçasıdır.",
          "Uygulama bir tanıtım sitesiyle yan yana duracaksa, onunla tek bir tasarım sistemini paylaşabilir; böylece tüm şirket tek ürün gibi görünür.",
        ]],
        ["Neler dahil", [
          "İş akışınıza göre kurulmuş özel bir web uygulaması ya da iç araç.",
          "İhtiyaca göre paneller, portallar ve otomasyonlar.",
          "Yayın ve yayın sonrası destek.",
          "Tam teslim — kod size ait.",
        ]],
        ["Proje nasıl işler", [
          "Brief: hedefi, kapsamı ve takvimi netleştiren ücretsiz 30 dakikalık görüşme.",
          "Yapım: tıklayabildiğiniz canlı önizlemeyle, açık açık tasarım ve geliştirme.",
          "Yayın: yayına alır, gerçek cihazlarda test eder, düzeltme ve değişiklik için yanınızda kalırız.",
        ]],
        ["Maliyet ve süre", [
          "Sabit bir fiyat listesi yoktur. Her proje kendi kapsamıyla fiyatlanır ve ücretsiz ön görüşmeden sonraki 24 saat içinde yazılı teklif alırsınız.",
          "Bir uygulama tanıtım sitesinden daha uzun sürer. Süre, kapsaması gereken iş akışına bağlıdır ve teklifte belirtilir.",
        ]],
      ],
      faq: [
        ["Sadece site değil, uygulama da yapıyor musunuz?", "Evet. Özel web uygulamaları, paneller ve iç araçlar ai-ulu'nun parçası; iş akışınıza göre kurulur."],
        ["Bir uygulama ne kadar tutar?", "Sabit bir fiyat listesi yoktur. Her uygulama kendi kapsamıyla fiyatlanır ve ücretsiz ön görüşmeden sonraki 24 saat içinde yazılı teklif alırsınız. Teklif; iş akışlarına, ekranlara ve entegrasyonlara göre değişir."],
        ["Uygulama ve kod bana mı ait olur?", "Evet. Tasarım, kod ve içerik size aittir; yayın günü her şey teslim edilir."],
      ],
    },
  },
  {
    key: "svcSiteApp", slug: "services/site-app", slugTr: "hizmetler/site-uygulama",
    pack: 2,
    en: {
      title: "Site and app in one design system — ai-ulu",
      desc: "A marketing site and a custom web app built as one product, sharing a single design system, so a whole company feels like one brand.",
      h1: "Site and app, one design system",
      lead: "A marketing site and a custom web app built as one product, sharing a single design system, so a whole company feels like one brand.",
      sections: [
        ["Why one system", [
          "Most companies end up with a marketing site from one supplier and an app from another, and the two look and feel like different businesses. Building both together removes that seam.",
          "One design system means the same colours, type, components and voice across the site and the product. A visitor who moves from the marketing site into the app does not feel like they left.",
        ]],
        ["What it covers", [
          "The marketing site: brand and marketing pages, built for speed, search and conversion.",
          "The product: the custom web app, dashboard or portal itself.",
          "The shared system: the design tokens and components both are built from, in English and Turkish.",
        ]],
        ["Who it is for", [
          "A company launching a product alongside its brand, or one whose site and app have drifted apart and now look like two different companies. It suits a team that wants a single partner for both, rather than managing two suppliers.",
        ]],
        ["What is included", [
          "One design system across both the site and the app.",
          "Marketing site and product built together.",
          "English and Turkish.",
          "Launch and post-launch support.",
        ]],
        ["How the project runs", [
          "Brief: a free 30-minute call to define the goal, the scope and the timeline.",
          "Build: design and development in the open, with a live preview you can click.",
          "Ship: launch, testing on real devices, then staying on for fixes and changes.",
        ]],
        ["Cost and timing", [
          "There is no fixed price list. Each project is scoped on its own, and a written quote follows within 24 hours of the free intro call.",
          "Building a site and an app together takes longer than either alone. The timeline is set out in the quote.",
        ]],
      ],
      faq: [
        ["What is Site + App?", "One design system across the marketing site and the custom web app, so a whole company feels like one product instead of two."],
        ["Should I build the site and the app with one team?", "It removes the seam. When one team builds both, the colours, type, components and voice match, and a visitor moving from the site into the app does not feel like they left."],
        ["How much does Site + App cost?", "There is no fixed price list. The project is scoped on its own and you get a written quote within 24 hours of the free intro call."],
      ],
    },
    tr: {
      title: "Tek tasarım sisteminde site ve uygulama — ai-ulu",
      desc: "Tek ürün olarak kurulmuş bir tanıtım sitesi ve özel web uygulaması; tek tasarım sistemini paylaşır, böylece tüm şirket tek marka gibi görünür.",
      h1: "Site ve uygulama, tek tasarım sistemi",
      lead: "Tek ürün olarak kurulmuş bir tanıtım sitesi ve özel web uygulaması; tek tasarım sistemini paylaşır, böylece tüm şirket tek marka gibi görünür.",
      sections: [
        ["Neden tek sistem", [
          "Çoğu şirket bir tedarikçiden tanıtım sitesi, başka birinden uygulama alır ve ikisi farklı işletmelermiş gibi görünür. İkisini birlikte kurmak bu ayrımı ortadan kaldırır.",
          "Tek tasarım sistemi, site ve ürün genelinde aynı renkler, tipografi, bileşenler ve ses demektir. Tanıtım sitesinden uygulamaya geçen ziyaretçi, oradan ayrılmış gibi hissetmez.",
        ]],
        ["Neleri kapsar", [
          "Tanıtım sitesi: hız, arama ve dönüşüm için kurulu marka ve tanıtım sayfaları.",
          "Ürün: özel web uygulaması, panel ya da portalın kendisi.",
          "Paylaşılan sistem: ikisinin de kurulduğu tasarım belirteçleri ve bileşenler, İngilizce ve Türkçe.",
        ]],
        ["Kimler için", [
          "Markasının yanında bir ürün çıkaran ya da sitesi ve uygulaması birbirinden kopup iki farklı şirket gibi görünen bir şirket. İkisi için tek ortak isteyen, iki tedarikçi yönetmek istemeyen ekipler için uygundur.",
        ]],
        ["Neler dahil", [
          "Site ve uygulama genelinde tek tasarım sistemi.",
          "Tanıtım sitesi ve ürün birlikte kurulur.",
          "İngilizce ve Türkçe.",
          "Yayın ve yayın sonrası destek.",
        ]],
        ["Proje nasıl işler", [
          "Brief: hedefi, kapsamı ve takvimi netleştiren ücretsiz 30 dakikalık görüşme.",
          "Yapım: tıklayabildiğiniz canlı önizlemeyle, açık açık tasarım ve geliştirme.",
          "Yayın: yayına alır, gerçek cihazlarda test eder, düzeltme ve değişiklik için yanınızda kalırız.",
        ]],
        ["Maliyet ve süre", [
          "Sabit bir fiyat listesi yoktur. Her proje kendi kapsamıyla fiyatlanır ve ücretsiz ön görüşmeden sonraki 24 saat içinde yazılı teklif alırsınız.",
          "Site ve uygulamayı birlikte kurmak, tek başına her birinden daha uzun sürer. Takvim teklifte belirtilir.",
        ]],
      ],
      faq: [
        ["Site + Uygulama nedir?", "Tanıtım sitesi ve özel web uygulaması genelinde tek tasarım sistemi; böylece tüm şirket iki değil tek ürün gibi görünür."],
        ["Site ve uygulamayı tek ekiple yaptırmalı mıyım?", "Bu ayrımı ortadan kaldırır. Tek ekip ikisini de kurduğunda renkler, tipografi, bileşenler ve ses uyuşur; siteden uygulamaya geçen ziyaretçi oradan ayrılmış gibi hissetmez."],
        ["Site + Uygulama ne kadar tutar?", "Sabit bir fiyat listesi yoktur. Proje kendi kapsamıyla fiyatlanır ve ücretsiz ön görüşmeden sonraki 24 saat içinde yazılı teklif alırsınız."],
      ],
    },
  },
];

// Vaka çalışmaları: yalnızca doğrulanabilir gerçekler (canlı site + repo). Uydurma metrik yok.
// Sonuç rakamı yoksa yazılmaz; "problem / yaklaşım / ne teslim edildi" çerçevesi kullanılır.
export const CASES = [
  {
    key: "caseAttalia", slug: "work/attalia", slugTr: "isler/attalia",
    client: "Attalia",
    live: "",
    en: {
      title: "Attalia — group site for a global commerce holding | ai-ulu",
      desc: "A group website for Attalia, a global commerce holding: one site that presents several businesses under a single brand.",
      h1: "Attalia — a group site for a global commerce holding",
      lead: "A group website that presents a global commerce holding's businesses under one clear, coherent brand.",
      sections: [
        ["The brief", [
          "Attalia is a global commerce holding. A holding is not one business but several, and a group site has to serve all of them without becoming a list of unrelated logos.",
          "The goal was a single site that reads as one company, while still giving each business its own room.",
        ]],
        ["What we built", [
          "A group site: one brand, one design system, one clear hierarchy that holds several businesses together and makes the group feel larger than the sum of its parts.",
          "The site is art-directed and built for speed and search, like every ai-ulu build, so the group is findable and citable — in classic search and in AI answers.",
        ]],
        ["Outcome", [
          "Attalia has a group site that presents its businesses under one brand. This project is the group-level site for a global commerce holding.",
        ]],
      ],
      faq: [
        ["What did ai-ulu build for Attalia?", "A group website for a global commerce holding: one brand and one design system presenting several businesses together."],
        ["Is Attalia's site public?", "Attalia's site is not linked publicly from this page. The description here reflects the project as delivered."],
      ],
    },
    tr: {
      title: "Attalia — küresel ticaret holdingi için grup sitesi | ai-ulu",
      desc: "Attalia için grup sitesi: birden çok işi tek marka altında sunan küresel bir ticaret holdingi sitesi.",
      h1: "Attalia — küresel ticaret holdingi için grup sitesi",
      lead: "Küresel bir ticaret holdinginin işlerini tek, net ve tutarlı bir marka altında sunan grup sitesi.",
      sections: [
        ["Brief", [
          "Attalia küresel bir ticaret holdingi. Holding tek bir iş değil, birkaç iştir; grup sitesi de ilgisiz logolar listesine dönüşmeden hepsine hizmet etmelidir.",
          "Hedef, her işe kendi alanını verirken tek şirket gibi okunan tek bir siteydi.",
        ]],
        ["Ne kurduk", [
          "Grup sitesi: tek marka, tek tasarım sistemi, birkaç işi bir arada tutan net bir hiyerarşi; grubu parçalarının toplamından büyük hissettirir.",
          "Site, her ai-ulu yapımı gibi sanat yönetimli; hız ve arama için kurulu. Böylece grup hem klasik aramada hem yapay zeka cevaplarında bulunur ve alıntılanır.",
        ]],
        ["Sonuç", [
          "Attalia, işlerini tek marka altında sunan bir grup sitesine sahip. Bu proje, küresel bir ticaret holdingi için grup düzeyindeki sitedir.",
        ]],
      ],
      faq: [
        ["ai-ulu, Attalia için ne kurdu?", "Küresel bir ticaret holdingi için grup sitesi: birkaç işi bir arada sunan tek marka ve tek tasarım sistemi."],
        ["Attalia'nın sitesi herkese açık mı?", "Attalia'nın sitesi bu sayfadan herkese açık şekilde bağlanmıyor. Buradaki açıklama, teslim edilen projeyi yansıtır."],
      ],
    },
  },
  {
    key: "caseHercules", slug: "work/hercules-investments", slugTr: "isler/hercules-investments",
    client: "Hercules Investments",
    live: "https://herculesinvestmentsllc.com",
    en: {
      title: "Hercules Investments — brand group site for a US e-commerce company | ai-ulu",
      desc: "A brand group site for Hercules Investments LLC, a US-based e-commerce group building and scaling its own consumer brands in-house.",
      h1: "Hercules Investments — a brand group site for a US e-commerce company",
      lead: "A brand group site for Hercules Investments LLC, a US-based e-commerce group that builds and scales its own consumer brands in-house.",
      sections: [
        ["The brief", [
          "Hercules Investments LLC is a US-based e-commerce group. It does not resell other people's products; it builds and scales its own consumer brands in-house.",
          "That is an unusual position, and it needed a site that says so clearly: an operating company, not a holding on paper.",
        ]],
        ["What we built", [
          "A brand group site that explains the operating model — three jobs, all in-house, every step run on data — and presents the group's brands as part of one story.",
          "The site carries the message \"We don't resell. We build the brand.\" front and centre, so the difference is clear from the first screen.",
        ]],
        ["Outcome", [
          "Hercules Investments has a brand group site that states its operating model plainly and presents its brands together.",
        ]],
      ],
      faq: [
        ["What is Hercules Investments?", "A US-based e-commerce group that builds and scales its own consumer brands in-house, rather than reselling other people's products."],
        ["What did ai-ulu build for Hercules Investments?", "A brand group site that explains the in-house operating model and presents the group's brands as one story."],
      ],
    },
    tr: {
      title: "Hercules Investments — ABD e-ticaret şirketi için marka grubu sitesi | ai-ulu",
      desc: "Hercules Investments LLC için marka grubu sitesi: kendi tüketici markalarını kendi bünyesinde kuran ve büyüten ABD merkezli bir e-ticaret grubu.",
      h1: "Hercules Investments — ABD e-ticaret şirketi için marka grubu sitesi",
      lead: "Kendi tüketici markalarını kendi bünyesinde kuran ve büyüten ABD merkezli e-ticaret grubu Hercules Investments LLC için marka grubu sitesi.",
      sections: [
        ["Brief", [
          "Hercules Investments LLC, ABD merkezli bir e-ticaret grubu. Başkalarının ürünlerini yeniden satmaz; kendi tüketici markalarını kendi bünyesinde kurar ve büyütür.",
          "Bu sıra dışı bir konumdur ve bunu net söyleyen bir site gerektiriyordu: kâğıt üstünde bir holding değil, işleten bir şirket.",
        ]],
        ["Ne kurduk", [
          "İşletme modelini anlatan bir marka grubu sitesi — üç iş, hepsi kendi bünyesinde, her adım veriyle — ve grubun markalarını tek bir hikâyenin parçası olarak sunar.",
          "Site, \"We don't resell. We build the brand.\" mesajını en öne taşır; böylece fark ilk ekrandan bellidir.",
        ]],
        ["Sonuç", [
          "Hercules Investments, işletme modelini açıkça belirten ve markalarını bir arada sunan bir marka grubu sitesine sahip.",
        ]],
      ],
      faq: [
        ["Hercules Investments nedir?", "Başkalarının ürünlerini yeniden satmak yerine kendi tüketici markalarını kendi bünyesinde kuran ve büyüten ABD merkezli bir e-ticaret grubu."],
        ["ai-ulu, Hercules Investments için ne kurdu?", "Kendi bünyesindeki işletme modelini anlatan ve grubun markalarını tek hikâye olarak sunan bir marka grubu sitesi."],
      ],
    },
  },
  {
    key: "caseHydrelon", slug: "work/hydrelon", slugTr: "isler/hydrelon",
    client: "Hydrelon",
    live: "https://hydrelon.com",
    en: {
      title: "Hydrelon — product site for a water-filtration brand | ai-ulu",
      desc: "A product site for Hydrelon, a water-filtration brand: presenting the filter system and the brand's message, Pure Water. Better Life.",
      h1: "Hydrelon — a product site for a water-filtration brand",
      lead: "A product site for Hydrelon, a water-filtration brand with the message \"Pure Water. Better Life.\"",
      sections: [
        ["The brief", [
          "Hydrelon is a water-filtration brand, and a brand of Hercules Investments LLC. It needed a product site that presents the filter system clearly and carries the brand's promise.",
          "A product site has to do two jobs at once: explain what the product is, and make the brand feel worth trusting.",
        ]],
        ["What we built", [
          "A product site built around the brand's message, \"Pure Water. Better Life.\", and the filter system itself: what it is, how it works and why it matters.",
          "The site is art-directed and built for speed and search, so the product and the brand are findable and citable — in classic search and in AI answers.",
        ]],
        ["Outcome", [
          "Hydrelon has a product site that presents its filter system and its brand message together, at hydrelon.com.",
        ]],
      ],
      faq: [
        ["What is Hydrelon?", "A water-filtration brand with the message \"Pure Water. Better Life.\" It is a brand of Hercules Investments LLC."],
        ["What did ai-ulu build for Hydrelon?", "A product site for the water-filtration brand: presenting the filter system and the brand's message, Pure Water. Better Life."],
      ],
    },
    tr: {
      title: "Hydrelon — su arıtma markası için ürün sitesi | ai-ulu",
      desc: "Hydrelon için ürün sitesi: filtre sistemini ve markanın \"Pure Water. Better Life.\" mesajını sunan su arıtma markası sitesi.",
      h1: "Hydrelon — su arıtma markası için ürün sitesi",
      lead: "Hydrelon için ürün sitesi: \"Pure Water. Better Life.\" mesajlı bir su arıtma markası.",
      sections: [
        ["Brief", [
          "Hydrelon bir su arıtma markası ve Hercules Investments LLC'nin bir markası. Filtre sistemini net sunan ve markanın vaadini taşıyan bir ürün sitesi gerekiyordu.",
          "Bir ürün sitesi aynı anda iki iş yapmalı: ürünün ne olduğunu anlatmak ve markayı güvenilir hissettirmek.",
        ]],
        ["Ne kurduk", [
          "Markanın \"Pure Water. Better Life.\" mesajı ve filtre sisteminin kendisi etrafında kurulmuş bir ürün sitesi: ne olduğu, nasıl çalıştığı ve neden önemli olduğu.",
          "Site sanat yönetimli; hız ve arama için kurulu. Böylece ürün ve marka hem klasik aramada hem yapay zeka cevaplarında bulunur ve alıntılanır.",
        ]],
        ["Sonuç", [
          "Hydrelon, filtre sistemini ve marka mesajını bir arada sunan bir ürün sitesine sahip: hydrelon.com.",
        ]],
      ],
      faq: [
        ["Hydrelon nedir?", "\"Pure Water. Better Life.\" mesajlı bir su arıtma markası. Hercules Investments LLC'nin bir markasıdır."],
        ["ai-ulu, Hydrelon için ne kurdu?", "Su arıtma markası için ürün sitesi: filtre sistemini ve markanın \"Pure Water. Better Life.\" mesajını sunar."],
      ],
    },
  },
];

// Türkçe şablon sayfaları: EN şablonlarının TR karşılığı. Aynı şablon, yerelleştirilmiş slug.
// slug: TR yol parçası; enSlug: hreflang için EN karşılığı; name: şablon adı (marka adı çevrilmez).
export const TEMPLATES_TR = [
  {
    slug: "klinik", enSlug: "clinic", name: "Aura Aesthetic Clinic",
    title: "Estetik klinik web sitesi şablonu — ai-ulu",
    desc: "Estetik klinik, dermatoloji ve medikal spa için randevu odaklı web sitesi şablonu: sıcak nötr palet, kemer görselleri ve önce randevu alan bir düzen.",
    h: "Estetik klinik web sitesi şablonu",
    lead: "Aura, estetik klinikler, dermatoloji pratikleri ve medikal spalar için randevu odaklı bir web sitesi şablonudur.",
    intro: "Tek bir randevu eylemiyle açılır; ardından tedavileri, ekibi ve kliniğin yaklaşımını anlatır — ziyaretçinin gerçekte karar verdiği sırayla.",
    includes: [
      "Canlı \"en yakın uygun\" randevu kartlı bir hero",
      "Tedavi grupları: cilt, kontur ve lazer",
      "Güven ve arama için doktor profilleri ve bir günlük bölümü",
      "Her ekranda yinelenen tek bir randevu çağrısı",
    ],
    audience: "Sadece ziyaret değil, randevu isteyen estetik klinikler, dermatologlar ve medikal spa pratikleri.",
  },
  {
    slug: "restoran", enSlug: "restaurant", name: "Maison Olive",
    title: "Restoran web sitesi şablonu — ai-ulu",
    desc: "Restoran ve kafeler için rezervasyon öncelikli web sitesi şablonu: mutfağın hikâyesi, menüye öncelik veren düzen ve rezervasyon çağrısı.",
    h: "Restoran web sitesi şablonu",
    lead: "Maison Olive, restoranlar ve kafeler için rezervasyon öncelikli bir web sitesi şablonudur.",
    intro: "Mutfağın hikâyesi ve bir rezervasyon eylemiyle açılır; ardından menüyü, mekânı ve misafirlerin rezervasyondan önce aradığı pratik bilgileri sunar.",
    includes: [
      "Rezervasyon çağrılı bir hero",
      "Telefonda iyi okunan, menüye öncelik veren bir düzen",
      "Karakter ve arama için mutfak ve hikâye bölümü",
      "Konum, çalışma saatleri ve iletişim bilgileri",
    ],
    audience: "Daha fazla masa rezervasyonu ve her yerden okunabilen bir menü isteyen restoranlar, kafeler ve bistrolar.",
  },
  {
    slug: "hukuk", enSlug: "law", name: "Hale & Rowe",
    title: "Hukuk bürosu web sitesi şablonu — ai-ulu",
    desc: "Hukuk büroları ve profesyonel pratikler için otorite odaklı web sitesi şablonu: lacivert-altın palet, çalışma alanları ızgarası ve danışma çağrısı.",
    h: "Hukuk bürosu web sitesi şablonu",
    lead: "Hale & Rowe, hukuk büroları ve profesyonel pratikler için otorite odaklı bir web sitesi şablonudur.",
    intro: "Lacivert-altın paleti ve çalışma alanları ızgarası uzmanlığı net sunar; her bölüm bir danışma talebine yönlendirir.",
    includes: [
      "Hizmetlerinizi eşleyen bir çalışma alanları ızgarası",
      "Güvenilirlik için avukat ve ekip profilleri",
      "Bir referanslar ve sonuçlar bölümü",
      "Tek, yinelenen bir danışma çağrısı",
    ],
    audience: "Yerleşik görünmek ve bir danışma talebi kazanmak isteyen hukuk büroları, butik pratikler ve danışmanlıklar.",
  },
  {
    slug: "studyo", enSlug: "studio", name: "Atelier Nord",
    title: "Mimarlık stüdyosu web sitesi şablonu — ai-ulu",
    desc: "Mimarlık ve tasarım stüdyoları için editoryal web sitesi şablonu: proje ızgarası, güçlü tipografik ses ve tek tıkla iletişim.",
    h: "Mimarlık stüdyosu web sitesi şablonu",
    lead: "Atelier Nord, mimarlık ve tasarım stüdyoları için editoryal bir web sitesi şablonudur.",
    intro: "Bir proje ızgarası ve güçlü bir tipografik ses işin konuşmasına izin verir; iletişim ise tek tıkla ulaşılır kalır.",
    includes: [
      "Büyük görsellere yer açan editoryal proje ızgarası",
      "Vaka çalışmaları için proje detay düzeni",
      "Bir stüdyo ve hakkında bölümü",
      "Net bir iletişim çağrısı",
    ],
    audience: "Portföyü işi kadar özenli olsun isteyen mimarlık, iç mimarlık ve tasarım stüdyoları.",
  },
  {
    slug: "fitness", enSlug: "fitness", name: "Pulse Studio",
    title: "Fitness stüdyosu web sitesi şablonu — ai-ulu",
    desc: "Spor salonları ve ders tabanlı işletmeler için yüksek enerjili web sitesi şablonu: ders programı düzeni ve ücretsiz deneme çağrısı.",
    h: "Fitness stüdyosu web sitesi şablonu",
    lead: "Pulse Studio, spor salonları, fitness stüdyoları ve ders tabanlı işletmeler için yüksek enerjili bir web sitesi şablonudur.",
    intro: "Bir ders programı düzeni ve ücretsiz deneme çağrısı, ilgiyi ilk ziyarete dönüştürür.",
    includes: [
      "Kolayca taranabilen ders programı etiketleri",
      "Ücretsiz deneme ve üyelik çağrısı",
      "Eğitmenler ve stüdyo hikâyesi bölümü",
      "Konum, çalışma saatleri ve iletişim bilgileri",
    ],
    audience: "Daha fazla deneme kaydı ve üye isteyen spor salonları, fitness stüdyoları ve ders tabanlı işletmeler.",
  },
];

// İletişim sayfası ve yapısal veri bu tek kaynaktan beslenir.
export const CONTACT = {
  slug: "contact", slugTr: "iletisim",
  en: {
    title: "Contact ai-ulu",
    desc: "Email, phone or WhatsApp ai-ulu, or send the contact form. We reply within 24 hours.",
    h1: "Contact",
    lead: "Tell us what you're building. We reply within 24 hours with a time for a free intro call.",
    emailLabel: "Email", phoneLabel: "Phone", waLabel: "WhatsApp", formLabel: "Contact form",
    sections: [
      ["What happens next", [
        "Send the form, email or WhatsApp message and you get a reply within 24 hours with a time for a free 30-minute intro call.",
        "On the call we cover the goal, the audience and the timeline. You leave with a rough scope and an honest view of fit.",
        "You get a written quote within 24 hours of the call. It costs nothing and commits you to nothing.",
      ]],
      ["What to include", [
        "What the business does and who it is for.",
        "Whether you need a website, an app, or both.",
        "Any site you have now, and what you would change about it.",
        "A rough timeline, if you have one.",
      ]],
      ["Languages and reach", [
        "The studio works in English and Turkish, for the site and for communication, and takes clients worldwide.",
      ]],
    ],
  },
  tr: {
    title: "ai-ulu ile iletişim",
    desc: "ai-ulu'ya e-posta, telefon veya WhatsApp ile ulaşın ya da formu gönderin. 24 saat içinde dönüş yaparız.",
    h1: "İletişim",
    lead: "Ne kurduğunuzu anlatın. 24 saat içinde ücretsiz ön görüşme için bir saatle dönelim.",
    emailLabel: "E-posta", phoneLabel: "Telefon", waLabel: "WhatsApp", formLabel: "İletişim formu",
    sections: [
      ["Bundan sonra ne olur", [
        "Formu, e-postayı ya da WhatsApp mesajını gönderin; 24 saat içinde ücretsiz 30 dakikalık ön görüşme için bir saatle dönüş yaparız.",
        "Görüşmede hedefi, kitleyi ve takvimi konuşuruz. Yaklaşık bir kapsamla ve uyumumuz hakkında dürüst bir görüşle ayrılırsınız.",
        "Görüşmeden sonraki 24 saat içinde yazılı teklif alırsınız. Ücretsizdir, taahhüt gerektirmez.",
      ]],
      ["Neleri yazın", [
        "İşletmenin ne yaptığı ve kime hitap ettiği.",
        "Web sitesi mi, uygulama mı, yoksa ikisi mi gerektiği.",
        "Şu an bir siteniz varsa ve neyi değiştirmek istediğiniz.",
        "Varsa yaklaşık bir takvim.",
      ]],
      ["Diller ve kapsam", [
        "Stüdyo hem site hem iletişim için İngilizce ve Türkçe çalışır ve dünya çapında müşteri kabul eder.",
      ]],
    ],
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
      more: "See how it works",
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
      open: "Open", soon: "Not public yet", case: "Read the case",
      prev: "Previous project", next: "Next project", pause: "Pause automatic scrolling", play: "Resume automatic scrolling",
    },
    inspire: {
      eyebrow: "Inspiration", h: "Examples to <em>inspire you</em>",
      sub: "Scroll through the deck. Every card is a different style, and each one moves.",
      label: "Inspiration deck", pick: "Go to example",
      cards: [
        ["klinik", "Aesthetic clinic", "Soft tones, a calm welcome"],
        ["fitness", "Fitness studio", "Huge type, neon energy"],
        ["yayla", "Mountain lodge", "A scene that opens through the fog"],
        ["hukuk", "Law firm", "Midnight blue, a serious serif"],
        ["seramik", "Ceramics studio", "Handmade, plain, warm"],
        ["zeytinyagi", "Product page", "A bottle that turns as you scroll"],
        ["mimarlik", "Architecture studio", "Bold type, a sharp grid"],
        ["restoran", "Restaurant", "Dark ground, appetising colour"],
        ["yayla-dag", "Mountain lodge", "Layer after layer of mountains"],
        ["seramik-kase", "Ceramics studio", "Hand-drawn motion"],
      ],
      close: "Imagine it,<br><em>or leave it to us.</em>",
      closeSub: "Tell us about the site you have in mind in a few sentences; we pick the style together.",
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
        ["How much does a website cost?", "There is no fixed price list. Each project is scoped on its own and you get a written quote within 24 hours of the free intro call. The quote depends on the number of pages, the content work and whether an app is involved."],
        ["Do you work with clients in Turkey?", "Yes. ai-ulu works in Turkish and English, takes clients in Turkey and worldwide, and builds every site to be searchable and findable in both languages."],
        ["How do you make a site visible in AI search?", "Every build ships with the structure AI assistants read: clean semantic HTML, structured data (Organization, Service, FAQ), an llms.txt summary, a sitemap and explicit access for AI crawlers. That is what gets a site cited in ChatGPT, Gemini and Google AI answers."],
        ["Can you redesign an existing website?", "Yes. ai-ulu can rebuild an outdated or weak site around a conversion goal, keeping what works and fixing the structure, speed and content that hold it back."],
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
    pagesNav: [["svcWebsites", "Websites"], ["svcApps", "Apps"], ["svcSiteApp", "Site + App"], ["about", "About"], ["contact", "Contact"], ["terms", "Terms"], ["privacy", "Privacy"]],
    templatesNavLabel: "Templates",
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
      more: "Nasıl çalıştığını gör",
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
      open: "Aç", soon: "Henüz yayında değil", case: "Vakayı oku",
      prev: "Önceki proje", next: "Sonraki proje", pause: "Otomatik kaydırmayı duraklat", play: "Otomatik kaydırmayı sürdür",
    },
    inspire: {
      eyebrow: "İlham", h: "İlham alabileceğiniz <em>örnekler</em>",
      sub: "Desteyi kaydırın. Her kart başka bir tarz ve her biri hareket ediyor.",
      label: "İlham destesi", pick: "Örneğe git",
      cards: [
        ["klinik", "Estetik klinik", "Yumuşak tonlar, sakin bir karşılama"],
        ["fitness", "Spor salonu", "Dev yazı, neon enerji"],
        ["yayla", "Yayla evi", "Sisin içinden açılan bir sahne"],
        ["hukuk", "Hukuk bürosu", "Gece mavisi, ağırbaşlı serif"],
        ["seramik", "Seramik atölyesi", "El yapımı, sade, sıcak"],
        ["zeytinyagi", "Ürün sayfası", "Kaydırdıkça dönen şişe"],
        ["mimarlik", "Mimarlık stüdyosu", "Cesur tipografi, keskin grid"],
        ["restoran", "Restoran", "Koyu zemin, iştah açan renk"],
        ["yayla-dag", "Yayla evi", "Katman katman dağlar"],
        ["seramik-kase", "Seramik atölyesi", "Elle çizilmiş hareket"],
      ],
      close: "Hayal edin<br><em>ya da bize bırakın.</em>",
      closeSub: "Aklınızdaki siteyi birkaç cümleyle anlatın; tarzını birlikte seçelim.",
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
        ["Bir web sitesi ne kadar tutar?", "Sabit bir fiyat listesi yoktur. Her proje kendi kapsamıyla fiyatlanır ve ücretsiz ön görüşmeden sonraki 24 saat içinde yazılı teklif alırsınız. Teklif; sayfa sayısına, içerik işine ve bir uygulamanın dahil olup olmadığına göre değişir."],
        ["Türkiye'deki müşterilerle çalışıyor musunuz?", "Evet. ai-ulu Türkçe ve İngilizce çalışır, Türkiye'den ve dünya genelinden müşteri kabul eder ve her siteyi iki dilde de aranabilir ve bulunabilir olacak şekilde kurar."],
        ["Bir siteyi yapay zeka aramalarında nasıl görünür yapıyorsunuz?", "Her yapım, yapay zeka asistanlarının okuduğu yapıyla teslim edilir: temiz anlamsal HTML, yapısal veri (Organization, Service, FAQ), bir llms.txt özeti, site haritası ve AI tarayıcılarına açık erişim. Bir siteyi ChatGPT, Gemini ve Google AI cevaplarında alıntılanır yapan budur."],
        ["Var olan bir siteyi yeniden yapabilir misiniz?", "Evet. ai-ulu, eski ya da zayıf bir siteyi dönüşüm hedefi etrafında yeniden kurabilir; işleyeni korur, sitenin önünü kesen yapı, hız ve içerik sorunlarını düzeltir."],
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
    pagesNav: [["svcWebsites", "Web Siteleri"], ["svcApps", "Uygulamalar"], ["svcSiteApp", "Site + Uygulama"], ["about", "Hakkında"], ["contact", "İletişim"], ["terms", "Şartlar"], ["privacy", "Gizlilik"]],
    templatesNavLabel: "Şablonlar",
    telLabel: "Ara", emailLabel: "E-posta",
    skip: "İçeriğe geç",
    ld: { orgDesc: "ai-ulu, sinematik web siteleri ve özel uygulamalar tasarlar, geliştirir ve yayına alır." },
  },
};
