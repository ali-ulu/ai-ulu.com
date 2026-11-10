// Copy shared by more than one output (page markup, JSON-LD, llms.txt) lives here.

export const nav = [
  { href: "/#nasil", label: "Nasıl çalışır" },
  { href: "/sablonlar/", label: "Örnek tasarımlar", keep: true },
  { href: "/#paketler", label: "Paketler" },
  { href: "/#sss", label: "SSS" },
];

// tab: the subject on the card's staggered tab (the FAQ drawer's filing label).
export const faq = {
  items: [
    {
      tab: "Süre",
      q: "Bir site ne kadar sürede hazır olur?",
      a: "Odaklı bir tanıtım sitesi ilk görüşmeden yayına genelde iki ile dört hafta sürer. Büyük siteler ve uygulamalar daha uzun sürer; takvim teklifte yazılıdır.",
    },
    {
      tab: "Fiyat",
      q: "Fiyatı ne belirler?",
      a: "Sayfa sayısı, içerik hazırlığı ve ek özellikler (form, randevu, çoklu dil, uygulama). Ücretsiz görüşmeden sonra 24 saat içinde yazılı teklif gönderilir.",
    },
    {
      tab: "Sahiplik",
      q: "Site ve kodlar bana mı ait olur?",
      a: "Evet. Tasarım, kod ve içerik sizindir; yayında her şey size teslim edilir.",
    },
    {
      tab: "Destek",
      q: "Yayından sonra da çalışıyor musunuz?",
      a: "Evet. Hataları düzeltir, değişiklikleri yapar, isterseniz siteyi sürekli bakımda tutarız.",
    },
    {
      tab: "Görünürlük",
      q: "Site yapay zekâ aramalarında nasıl görünür?",
      a: "Her site, yapay zekâ asistanlarının okuduğu yapıyla gelir: temiz HTML, yapılandırılmış veri, llms.txt özeti, site haritası ve yapay zekâ tarayıcılarına açık erişim. Belirli bir sıralama garanti edilemez.",
    },
    {
      tab: "Yenileme",
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
