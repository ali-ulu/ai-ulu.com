// All user-facing copy lives here so pages stay presentational.

export const nav = [
  { href: "/#sablonlar", label: "Şablonlar" },
  { href: "/#surec", label: "Nasıl çalışırız" },
  { href: "/#hizmetler", label: "Hizmetler" },
  { href: "/#sss", label: "SSS" },
];

export const hero = {
  eyebrow: "Web sitesi tasarımı · İşletmeler ve kişiler",
  title: "Web siteniz, ilk 5 saniyede müşteri kazansın.",
  subtitle:
    "Özel tasarım, hızlı açılış, güvenli altyapı. Ziyaretçi sitenize girer, ne yaptığınızı anlar ve tek adımda size ulaşır.",
  primaryCta: { href: "/#iletisim", label: "Ücretsiz teklif al" },
  secondaryCta: { href: "/#sablonlar", label: "Örnekleri gör" },
  stats: [
    { value: "1 sn altı", label: "hedef açılış süresi" },
    { value: "%100", label: "mobil uyumlu" },
    { value: "7/24", label: "güvenli ve izlenen altyapı" },
  ],
};

export const trustStrip = [
  "Cloudflare altyapısı",
  "Özel tasarım",
  "SEO & GEO uyumlu",
  "KVKK uyumlu formlar",
  "Hızlı teslim",
];

export const valueProps = {
  title: "Neden bizimle çalışmalısınız?",
  items: [
    {
      icon: "bolt",
      title: "Hız",
      text: "Site Cloudflare üzerinde çalışır, dünyanın her yerinden hızlı açılır. Yavaş siteler müşteri kaybettirir.",
    },
    {
      icon: "spark",
      title: "Etkileyici tasarım",
      text: "Hazır kalıplara benzemeyen, markanıza göre uyarlanmış modern tasarım. İlk bakışta güven verir.",
    },
    {
      icon: "shield",
      title: "Güvenlik",
      text: "Güvenli başlıklar, spam koruması ve kişisel veri koruması (KVKK) baştan kurulur.",
    },
    {
      icon: "search",
      title: "Bulunabilirlik",
      text: "Google ve yapay zekâ aramaları için SEO/GEO ayarları yapılır. Müşteri sizi bulabilir.",
    },
    {
      icon: "flow",
      title: "Net akış",
      text: "Ziyaretçi ne yapacağını bilir: görür, anlar, iletişime geçer. Kaybolmaz.",
    },
    {
      icon: "tools",
      title: "Kolay yönetim",
      text: "İçerik güncellemeleri ve yeni bölümler hızlıca eklenir. Yayın tek komutla güncellenir.",
    },
  ],
};

export const templates = {
  title: "Örnek şablonlar",
  subtitle:
    "Aşağıdaki örnekler sektöre göre hazırlanmış başlangıç tasarımlarıdır. Beğendiğinizi seçin, markanıza göre uyarlayalım.",
  items: [
    { name: "Klinik & Sağlık", sector: "Sağlık", accent: "#2f9e8f", note: "Randevu odaklı, güven veren düzen." },
    { name: "Hukuk Bürosu", sector: "Hukuk", accent: "#b08d57", note: "Ciddi, kurumsal, net hizmet anlatımı." },
    { name: "Restoran & Kafe", sector: "Yeme-içme", accent: "#c65b3c", note: "Menü ve rezervasyon akışı." },
    { name: "Fitness & Spor", sector: "Spor", accent: "#4f7cff", note: "Enerjik, üyelik odaklı." },
    { name: "Stüdyo & Ajans", sector: "Yaratıcı", accent: "#7a5cff", note: "Portfolyo ve referans vitrini." },
    { name: "Kişisel / CV", sector: "Kişisel", accent: "#e0664a", note: "Tek sayfa, güçlü ilk izlenim." },
  ],
};

export const process = {
  title: "Nasıl çalışırız?",
  subtitle: "Karmaşık değil. Dört net adımda siteniz yayında olur.",
  steps: [
    { n: "01", title: "Brief", text: "İhtiyacınızı, sektörünüzü ve hedefinizi konuşuruz. 15 dakikalık görüşme yeterli." },
    { n: "02", title: "Tasarım", text: "Size uygun şablonu seçer, markanıza göre uyarlarız. Onayınızı alırız." },
    { n: "03", title: "Kurulum", text: "İçerik, form, hız, güvenlik ve SEO ayarlarını yaparız. Sizin tarafınızda iş yok." },
    { n: "04", title: "Yayın", text: "Site yayına alınır. Test ederiz ve sonraki güncellemeler için hazır bekleriz." },
  ],
};

export const clientSteps = {
  title: "Siz ne yapmalısınız?",
  subtitle: "Neredeyse hiçbir şey. Sadece üç küçük adım sizin tarafınızda.",
  steps: [
    { title: "İletişime geçin", text: "Formu doldurun veya WhatsApp'tan yazın. Ne istediğinizi kısaca anlatın." },
    { title: "Bilgi ve onay verin", text: "Logonuz, metinleriniz ve beğendiğiniz örnek. Eksikleri biz tamamlarız." },
    { title: "Yayını onaylayın", text: "Taslağı görürsünüz, onaylarsınız. Gerisini biz hallederiz." },
  ],
};

export const services = {
  title: "Hizmetler",
  subtitle: "İhtiyacınıza göre paketler. Hepsi hız, güvenlik ve SEO dahil.",
  items: [
    {
      name: "Başlangıç",
      for: "Kişisel siteler ve yeni işletmeler",
      features: ["Tek sayfa veya 3 bölüm", "Mobil uyumlu tasarım", "İletişim formu", "Temel SEO", "Cloudflare yayın"],
      featured: false,
    },
    {
      name: "Profesyonel",
      for: "Kurumsal işletmeler",
      features: [
        "5–8 sayfa",
        "Özel tasarım uyarlama",
        "Gelişmiş SEO/GEO",
        "Form + e-posta bildirimi",
        "Google Analytics",
        "1 ay ücretsiz destek",
      ],
      featured: true,
    },
    {
      name: "Bakım & Destek",
      for: "Mevcut siteler",
      features: ["İçerik güncelleme", "Hız/güvenlik kontrolü", "Yedekleme", "Öncelikli destek"],
      featured: false,
    },
  ],
  note: "Fiyatlar kapsam ve ihtiyaca göre belirlenir. Net teklifi görüşmeden sonra veririz.",
};

export const faq = {
  title: "Sık sorulan sorular",
  items: [
    {
      q: "Ne kadar sürer?",
      a: "Basit bir site genellikle 3–7 gün içinde yayında olur. Kapsam büyüdükçe süre uzar; net takvimi görüşmede veririz.",
    },
    {
      q: "Fiyatı ne belirler?",
      a: "Sayfa sayısı, özel tasarım ihtiyacı ve ek özellikler (form, çoklu dil, randevu vb.). İhtiyacınızı öğrenip net teklif veririz.",
    },
    {
      q: "Hazır şablon mu kullanıyorsunuz?",
      a: "Sektörünüze uygun bir tasarım temeli seçer, markanıza göre baştan uyarlarız. Hazır ve herkese aynı görünen siteler yapmıyoruz.",
    },
    {
      q: "Teknik bilgim yok, sorun olur mu?",
      a: "Hayır. Kurulumun tamamını biz yaparız. Siz sadece içeriğinizi onaylarsınız.",
    },
    {
      q: "Sonradan değişiklik yapabilir miyim?",
      a: "Evet. İçerik güncellemeleri ve yeni bölümler için destek veriyoruz. Bakım paketiyle düzenli güncelleme de mümkün.",
    },
    {
      q: "Verilerim güvende mi?",
      a: "Form verileri şifreli bağlantıyla taşınır, yalnızca size bildirim gider ve KVKK uyumlu şekilde saklanır.",
    },
  ],
};

export const contact = {
  title: "İletişime geçin",
  subtitle: "Formu doldurun, en kısa sürede dönüş yaparız. İsterseniz WhatsApp'tan da yazabilirsiniz.",
  projectTypes: [
    { value: "business", label: "İşletme sitesi" },
    { value: "personal", label: "Kişisel site / CV" },
    { value: "ecommerce", label: "Satış / ürün sitesi" },
    { value: "unsure", label: "Emin değilim" },
  ],
};

export const footer = {
  note: "Hızlı, güvenli, dönüştüren web siteleri.",
  links: [
    { href: "/#sablonlar", label: "Şablonlar" },
    { href: "/#surec", label: "Nasıl çalışırız" },
    { href: "/#hizmetler", label: "Hizmetler" },
    { href: "/#sss", label: "SSS" },
    { href: "/gizlilik/", label: "Gizlilik" },
  ],
};
