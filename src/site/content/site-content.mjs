// Copy shared by more than one output (page markup, JSON-LD, llms.txt) lives here.

export const nav = [
  { href: "/#nasil", label: "Nasıl çalışır" },
  { href: "/sablonlar/", label: "Örnek tasarımlar", keep: true },
  { href: "/#paketler", label: "Paketler" },
  { href: "/#sss", label: "SSS" },
];

export const faq = {
  items: [
    {
      q: "Bir site ne kadar sürede hazır olur?",
      a: "Odaklı bir tanıtım sitesi ilk görüşmeden yayına genelde iki ile dört hafta sürer. Büyük siteler ve uygulamalar daha uzun sürer; takvim teklifte yazılıdır.",
    },
    {
      q: "Fiyatı ne belirler?",
      a: "Sayfa sayısı, içerik hazırlığı ve ek özellikler (form, randevu, çoklu dil, uygulama). Ücretsiz görüşmeden sonra 24 saat içinde yazılı teklif gönderilir.",
    },
    {
      q: "Site ve kodlar bana mı ait olur?",
      a: "Evet. Tasarım, kod ve içerik sizindir; yayında her şey size teslim edilir.",
    },
    {
      q: "Yayından sonra da çalışıyor musunuz?",
      a: "Evet. Hataları düzeltir, değişiklikleri yapar, isterseniz siteyi sürekli bakımda tutarız.",
    },
    {
      q: "Site yapay zekâ aramalarında nasıl görünür?",
      a: "Her site, yapay zekâ asistanlarının okuduğu yapıyla gelir: temiz HTML, yapılandırılmış veri, llms.txt özeti, site haritası ve yapay zekâ tarayıcılarına açık erişim. Belirli bir sıralama garanti edilemez.",
    },
    {
      q: "Mevcut sitemi yenileyebilir misiniz?",
      a: "Evet. İşe yarayanı korur; yapıyı, hızı ve içeriği müşteri getirecek şekilde yeniden kurarız.",
    },
  ],
};

export const projectTypes = [
  { value: "site", label: "Tanıtım sitesi" },
  { value: "app", label: "Web uygulaması" },
  { value: "both", label: "Site + uygulama" },
  { value: "unsure", label: "Emin değilim" },
];

export const footerLinks = [
  { href: "/sablonlar/", label: "Örnek tasarımlar" },
  { href: "/#iletisim", label: "İletişim" },
  { href: "/gizlilik/", label: "Gizlilik ve KVKK" },
];
