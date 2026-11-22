// Blog posts. Text lives as blocks so the renderer owns the markup and escapes
// prose. Inline formatting is limited to **bold** and `code`; source links are
// rendered separately from HTTPS-only URLs. No invented statistics or prices.
const DATE = "2026-11-11";

export const posts = [
  {
    slug: "web-sitesi-fiyatlari-2026",
    title: "Web sitesi fiyatları 2026: aralıklar, kim ne istiyor, siz ne ödemelisiniz?",
    metaTitle: "Web sitesi fiyatları 2026: ne ödemelisiniz?",
    description: "2026 ajans fiyat rehberlerinden gerçek aralıklar: tek sayfa, kurumsal, e-ticaret ve özel yazılım. Aynı işe neden 8.000 de 180.000 de deniyor?",
    targetQuery: "web sitesi fiyatları 2026, web sitesi kurma maliyeti",
    published: DATE,
    updated: "2026-11-23",
    body: [
      { p: "Bu yazıda kendi fiyatımızı değil, 2026'da yayınlanmış ajans ve yazılım rehberlerinden derlenen aralıkları bulacaksınız. Amaç basit: teklif aldığınızda rakamın nereye oturduğunu görmeniz." },
      { p: "Kısa cevap: \"web sitesi\" tek bir ürün değil. Aynı işe 8.000 lira da deniyor, 180.000 lira da. Aradaki fark keyfi değil; işin kapsamı ve kimin yaptığı belirliyor." },
      { h: "2026 aralıkları" },
      { ul: [
        "**Tek sayfa / landing page:** 5.000-40.000 ₺",
        "**Şablon temelli kurumsal site:** 8.000-25.000 ₺",
        "**Freelancer kurumsal site (WordPress):** 20.000-60.000 ₺",
        "**Ajans, özel tasarım kurumsal:** 35.000-250.000 ₺",
        "**E-ticaret sitesi:** 40.000-450.000 ₺",
        "**Kuruma özel yazılım:** 150.000 ₺ ve üzeri",
      ] },
      { note: "Aralıklar 2026'da yayınlanan sektör rehberlerinden derlendi (Kod16, Tasarlab, Comsuite, İşinn, Piksel & Co). Bunlar tahmini bantlardır; her proje kendi kapsamıyla fiyatlanır. Sizin teklifinizin bu bandın neresinde olduğu, kapsam konuşulunca netleşir." },
      { h: "Site türüne göre: hangi aralık kime uyar?" },
      { p: "Rakamlar tek başına bir şey söylemez; kime hangi satırın ait olduğunu bilmek gerekir." },
      { ul: [
        "**Tek sayfa:** Bir hizmeti ya da etkinliği tanıtan, altta telefon ve WhatsApp butonu olan tek uzun sayfa. Berber, çilingir, tek bir kursu satan eğitmen, kampanya sayfası. Çoğu küçük işletme için ilk adım budur.",
        "**Şablon temelli kurumsal site:** Hazır temanın içine logo, renk ve metinlerin yerleştirildiği 5-8 sayfalık site. Hızlı çıkar, ucuzdur; aynı temayı başka işletmelerin de kullandığını bilmeniz gerekir. Örnek tasarımlara [şablonlar sayfasından](/sablonlar/) bakabilirsiniz.",
        "**Freelancer WordPress sitesi:** Tek kişinin kurduğu, eklentilerle genişleyen site. Fiyat iyidir; asıl soru, kişinin bir ay sonra ulaşılabilir olup olmayacağıdır.",
        "**Ajans işi özel tasarım:** Tasarımcı, yazılımcı ve proje yöneticisi aynı teklifin içindedir. Marka kimliği, çok sayfalı yapı ve özel özellikler gerekiyorsa mantıklıdır.",
        "**E-ticaret:** Ürün yönetimi, ödeme altyapısı, kargo ve fatura entegrasyonu işin içine girdiği için bant en geniş olandır. Ürün sayısı ve ödeme yöntemi fiyatı doğrudan oynatır.",
        "**Özel yazılım:** Rezervasyon sistemi, müşteri paneli gibi hazırda karşılığı olmayan işler. Bunu yalnızca hazır çözümlerin gerçekten yetmediği durumda düşünün.",
      ] },
      { h: "Neden bu kadar geniş?" },
      { p: "Çünkü fiyatı yedi kalem belirler: sayfa sayısı, metin ve fotoğrafın kimden çıktığı, tasarımın hazır mı özel mi olduğu, özellikler, revizyon hakkı, yayın sonrası destek ve siteyi kimin sahiplendiği. Teklifleri bu yedi soruyla karşılaştırdığınızda fark kendiliğinden açıklanır." },
      { h: "Fiyatı düşüren ve yükselten şeyler" },
      { ul: [
        "**Düşürür:** hazır tema, metni sizin yazmanız, az sayfa, standart özellikler.",
        "**Yükseltir:** özel tasarım, sizin için yazılmış metin, çoklu dil, randevu ve ödeme gibi özellikler, hızlı teslim.",
      ] },
      { h: "Teklifte görünmeyen yıllık maliyetler" },
      { p: "Site yayına çıktığında fatura bitmez. Aşağıdaki kalemler her yıl, bazıları her ay geri gelir ve çoğu teklifin ilk sayfasında yer almaz:" },
      { ul: [
        "**Alan adı yenilemesi:** Adresiniz her yıl yenilenir. Fiyat kayıt firmasına göre değişir; ilk yıl indirimli, sonraki yıllar daha pahalı olabilir.",
        "**Barındırma (hosting):** Sitenin durduğu sunucu. Aylık ya da yıllık ödenir; pakete göre hız ve yedek farkı olur.",
        "**Güvenlik sertifikası (SSL):** Adres çubuğundaki kilit. Birçok sağlayıcıda ücretsizdir, bazılarında ayrı kalemdir. Sormadan varsaymayın.",
        "**Bakım ve güncelleme:** WordPress gibi sistemlerde tema ve eklentiler düzenli güncellenmezse site açık verir. Bunu kimin yaptığı yazılı olsun.",
        "**Kurumsal e-posta:** `ad@isletmeniz.com` adresleri çoğu zaman ayrı bir abonelik ister.",
        "**İçerik değişiklikleri:** Fiyat listesini güncellemek ya da yeni bir sayfa eklemek için her seferinde ödeme mi yapacaksınız, yoksa aylık bir paket mi var?",
      ] },
      { p: "Bu kalemlerin tutarını burada yazmıyoruz, çünkü firmadan firmaya fark ediyor. Sizin yapacağınız şey, teklife **ilk yıl ve ikinci yıl toplam maliyetini** yazdırmak. Sözleşme tarafı için [sözleşmede olması gereken 6 madde](/blog/web-sitesi-sozlesmesinde-olmasi-gerekenler/) yazısına bakın." },
      { h: "Ucuz teklif ne zaman pahalı olur?" },
      { p: "Alan adı satıcının adına kayıtlıysa, kod teslim edilmiyorsa, ikinci yıl barındırma faturası ilk yılın kat kat üstündeyse... Ucuz başlayan iş pahalı bitebilir. Tek bir soru çoğunu açığa çıkarır: **\"Yarın başka biriyle çalışmak istersem siteyi alıp gidebilir miyim?\"** Cevap net bir \"evet\" değilse, teklifi yeniden okuyun." },
      { h: "Teklif gelince sorulacak beş soru" },
      { ul: [
        "Fiyata hangi sayfalar dahil, sayfa adlarıyla?",
        "Metin ve fotoğrafı kim hazırlıyor?",
        "Kaç revizyon turu var, hangi tarihlerde?",
        "Yayından sonraki ilk yıl ve ikinci yıl toplam maliyet ne?",
        "Alan adı ve kod kimin adına, bana ne zaman teslim edilecek?",
      ] },
      { p: "Beş sorunun cevabı yazılı gelmiyorsa, teklif henüz teklif değildir. Daha ayrıntılı bir karşılaştırma tablosu için [fiyatı belirleyen 7 soru](/blog/web-sitesi-fiyatini-ne-belirler/) yazısını kullanabilirsiniz." },
      { h: "Üç teklif aldınız, rakamlar birbirinden çok farklı" },
      { p: "Bu normaldir ve çoğu zaman biri \"yanlış\" değildir. Örneğin biri metni sizden alıp hazır temaya yerleştiriyor, ikincisi metni de yazıyor, üçüncüsü baştan tasarım çiziyor; üçü de \"kurumsal site\" diyor. Teklifleri aynı kapsama indirmek için her birine aynı soruyu sorun: sayfalar, metin, revizyon, yayın sonrası maliyet. Cevaplar eşitlendiğinde rakamlar da yaklaşır, yaklaşmıyorsa fark gerçek bir kapsam farkıdır." },
      { h: "Bütçe dar: neyi kısmalı, neyi kısmamalı?" },
      { p: "Fiyatı düşürmek istiyorsanız kısılabilecek şeyler belli: sayfa sayısını azaltmak, metni ve fotoğrafı kendiniz hazırlamak, özel tasarım yerine hazır tema seçmek, ilk sürümde randevu ya da ödeme gibi özellikleri sonraya bırakmak. Bunların hepsi sonradan eklenebilir." },
      { p: "Kısılmaması gerekenler ise sonradan telafisi zor olanlardır: alan adının sizin adınıza kayıtlı olması, dosyaların size teslim edilmesi, telefonda hızlı açılması ve ulaşım butonları. Ucuz bir siteyi sonradan büyütebilirsiniz; başkasının elinde kalmış bir siteyi geri almak ise zordur." },
      { h: "Hangi sitenin bana yettiğini nasıl anlarım?" },
      { p: "Basit bir ölçü: sitenizin tek işi telefonu çaldırmaksa tek sayfa ya da küçük bir kurumsal site yeter. Aynı sitede ürün satacak, randevu alacak ya da müşteri girişi tutacaksanız bant yukarı kayar. Henüz Instagram'dan başka bir şeyiniz yoksa önce [Instagram varken site gerekli mi](/blog/instagram-varken-web-sitesi-gerekli-mi/) yazısına bakın; her işletmenin site için aceleye ihtiyacı yok." },
      { h: "ai-ulu nerede duruyor?" },
      { p: "Şablon kullanmayız; her site özgün tasarımla ve işinize göre yazılmış metinle kurulur. Bu yüzden şablon bandında değiliz. Kapsamı ücretsiz görüşmede konuşur, 24 saat içinde yazılı teklif göndeririz; alan adı, kod ve içerik yayında size teslim edilir." },
      { note: "**ai-ulu'da:** İlk görüşme ücretsiz. Kapsam, takvim ve teslim edilecekler teklifte yazılıdır. Belirli bir sıralama garanti edilmez." },
    ],
    cta: { text: "Kapsamınızı konuşalım, yazılı teklif alın →", message: "Merhaba, web sitesi için fiyat ve kapsam konuşmak istiyorum." },
  },
  {
    slug: "yapay-zeka-ile-web-sitesi-yapmak",
    title: "Yapay zekâ ile web sitesi yapmak: ne zaman yeter, ne zaman yetmez?",
    metaTitle: "Yapay zekâ ile web sitesi yapmak: ne zaman yeter?",
    description: "ChatGPT, Gemini ya da hazır araçla ücretsiz site kurmak mümkün. Hangi iş için yeter, hangisinde müşteri kaybettirir? Tarafsız bir karşılaştırma.",
    targetQuery: "yapay zeka ile web sitesi yapılır mı, chatgpt ile web sitesi yapmak, yapay zeka web sitesi oluşturucu",
    published: DATE,
    updated: DATE,
    body: [
      { p: "Bu soruyu artık herkes soruyor: \"ChatGPT'ye yaptırsam olmaz mı?\" Dürüst cevap: birçok iş için olur. Bu yazı size araçları kötülemek için değil, hangi durumda hangisinin yettiğini göstermek için yazıldı. Karar sizin." },
      { h: "Yapay zekâ neyi gerçekten iyi yapıyor?" },
      { p: "İlk taslağı. Sayfa yapısını, genel bir metni, basit bir formu saniyeler içinde üretir. Eğer işiniz yalnızca \"internette bir adresim olsun\" ise, ücretsiz bir araçla bir akşamda halledebilirsiniz. Bunda yanlış bir şey yok." },
      { h: "Fark nerede başlıyor?" },
      { p: "Üretilen taslak, elindeki genel bilgiyle kurulur. Sizin müşterinizi, fiyatınızı, sizi rakipten ayıran cümleyi bilmez. Site \"var olur\" ama \"çalışmaz\". Fark, taslağın bittiği yerde başlar:" },
      { ul: [
        "**Metin:** Ziyaretçinin duymak istediği cümle, sizin işinize özel yazılır; genel bir kalıp değil.",
        "**Sahiplik:** Ücretsiz araçların ücretsiz planında alan adı onların, tasarım şablonun. Siz yalnızca kullanıcısınız.",
        "**Arama görünürlüğü:** Hızlı açılan, yapılandırılmış verisi olan, arama motorlarının ve yapay zekâ yanıtlarının okuyabildiği bir yapı.",
        "**Dönüşüm:** Ziyaretçiyi müşteriye çeviren kurulum: net bir çağrı, tek dokunuşla WhatsApp, çalışan bir form.",
        "**Devamlılık:** Yayından sonra ölçüm, düzeltme ve güncelleme. Araç siteyi kurar ve bırakır.",
      ] },
      { h: "Hangi iş için hangisi?" },
      { ul: [
        "**Kişisel bir vitrin, hobi, henüz karar vermediğiniz bir deneme:** ücretsiz araç yeter. Önce fikri deneyin.",
        "**Müşteriden iş bekleyen bir işletme (klinik, atölye, danışman, mağaza):** fark burada başlar. Site sizi arayanı getirmeli; bu yüzden kurulum ve devamlılık gerekir.",
        "**Sipariş, randevu, ödeme alan bir site:** burada araçların sınırına gelirsiniz. Bunlar özel kurulum ister.",
      ] },
      { h: "Peki ücretsiz araçla başlayıp sonra taşınabilir miyim?" },
      { p: "Genelde hayır, ya da zor. Ücretsiz planlar alan adını ve tasarımı kendine bağlar; taşımak istediğinizde baştan başlarsınız. Bu yüzden mesele \"bedava mı, paralı mı\" değil, \"bu site bir yıl sonra da benim elimde mi\" sorusudur." },
      { h: "Karar için üç soru" },
      { ul: [
        "Bu siteyi müşteri getirmek için mi, yalnızca var olmak için mi istiyorum?",
        "Alan adı, kod ve içerik benim adıma mı kayıtlı olacak?",
        "Yayından sonra bir şey bozulduğunda ya da değişmesi gerektiğinde kimi arayacağım?",
      ] },
      { p: "Üçünün cevabı \"müşteri, evet, sizi\" ise bir kuruluma ihtiyacınız var. \"Var olmak, fark etmez, kimseyi\" ise ücretsiz araçla başlamanız mantıklı; bütçenizi de büyük işe saklarsınız." },
      { note: "**ai-ulu'da:** İlk görüşme ücretsiz. Kapsam, takvim ve teslim edilecekler yazılı teklifte netleşir; tasarım, kod ve içerik yayında size teslim edilir. Belirli bir sıralama garanti edilmez." },
    ],
    cta: { text: "İşiniz için hangisi doğru, birlikte bakalım →", message: "Merhaba, yapay zekâ ile site yapmak mı yoksa özel kurulum mu bana uygun, danışmak istiyorum." },
  },
  {
    slug: "web-sitesi-fiyatini-ne-belirler",
    title: "Web sitesi fiyatını ne belirler? Teklif almadan önce sormanız gereken 7 soru",
    metaTitle: "Web sitesi fiyatını ne belirler? 7 soru",
    description: "Aynı site için neden biri 10 bin, diğeri 100 bin lira diyor? Fiyatı belirleyen 7 kalem ve teklifleri karşılaştırmanın doğru yolu.",
    targetQuery: "web sitesi fiyatları 2026, web sitesi yaptırmak ne kadar, web sitesi kurma maliyeti",
    published: DATE,
    updated: "2026-11-23",
    body: [
      { p: "Üç yerden teklif aldınız. Biri çok ucuz, biri on katı. Hangisi doğru? Büyük ihtimalle üçü de farklı bir şeyin fiyatını verdi. \"Web sitesi\" tek bir ürün değil; fiyatı aşağıdaki yedi kalem belirler. Rakam aralıklarını merak ediyorsanız [web sitesi fiyatları 2026](/blog/web-sitesi-fiyatlari-2026/) yazısına bakın; burada rakam değil, teklifin içini nasıl okuyacağınızı anlatıyoruz." },
      { p: "Her soruda iki şey var: ne sormalı ve karşı taraftan nasıl bir cevap gelirse rahat edebilirsiniz. Cevap belirsizse bu, firmanın kötü olduğu anlamına gelmez; yalnızca kapsamın henüz yazılmadığını gösterir. Yazılmayan kapsam ise ilerde ek ücrete dönüşür." },
      { h: "1. Kaç sayfa olacak?" },
      { p: "Tek sayfalık bir tanıtım ile on sayfalık bir kurumsal site aynı iş değildir. Teklifte sayfa sayısı ve sayfa adları yazılı olmalı. \"Kurumsal site\" ifadesi tek başına hiçbir şey söylemez." },
      { p: "**İyi cevap:** \"Ana sayfa, hakkımızda, üç hizmet sayfası, iletişim: toplam altı sayfa.\" **Kötü cevap:** \"Gerektiği kadar sayfa yaparız.\" Sonradan eklenen her sayfanın ayrı fiyatlanıp fiyatlanmadığını baştan sorun." },
      { h: "2. Metinleri ve fotoğrafları kim hazırlayacak?" },
      { p: "En çok geciken ve en çok tartışma çıkaran kalem budur. Metni siz yazacaksanız fiyat düşer ama site, siz yazana kadar bekler. Yazım teklife dahilse kaç sayfa için dahil olduğu belirtilmeli." },
      { p: "**İyi cevap:** \"Metinleri biz yazıyoruz, siz bilgileri veriyorsunuz; fotoğraf için sizin çekimlerinizi kullanıyoruz.\" **Kötü cevap:** \"İçerik sizden gelecek\" deyip bunu fiyatın dışında bırakmak ya da hiç söylememek. Stok fotoğraf kullanılacaksa bunu da yazdırın." },
      { h: "3. Tasarım hazır temadan mı, size özel mi?" },
      { p: "Hazır tema hızlı ve ucuzdur; aynı temayı kullanan yüzlerce site vardır. Özel tasarım daha uzun sürer, sizi rakipten ayırır. İkisi de meşru seçenektir; önemli olan hangisini aldığınızı bilmeniz." },
      { p: "**İyi cevap:** \"Hazır tema kullanıyoruz, adı şu, lisansı şu\" ya da \"Sıfırdan çiziyoruz, ilk taslağı şu tarihte göreceksiniz.\" **Kötü cevap:** \"Size özel\" deyip hazır temayı satmak. Emin olmak için gösterilen örnek çalışmaların başka sitelerde aynen var olup olmadığına bakın." },
      { h: "4. Hangi özellikler var?" },
      { p: "Randevu formu, çoklu dil, ödeme, üye girişi, blog. Her biri ayrı iştir. İhtiyacınız olmayanı aldırmayın, olanı teklife yazdırın." },
      { p: "**İyi cevap:** Her özelliğin adı, nasıl çalışacağı ve kime bağlı olduğu yazılı: \"Randevu formu, mesajlar şu e-postaya düşer.\" **Kötü cevap:** \"Hepsi dahil\" ya da \"entegrasyon yapılır\" gibi muğlak cümleler. Ödeme ve dil gibi kalemlerde hangi hizmet sağlayıcının kullanılacağını ve onun ayrı bir ücreti olup olmadığını sorun." },
      { h: "5. Kaç revizyon hakkınız var?" },
      { p: "\"Sınırsız revizyon\" kulağa hoş gelir ama genelde ya gerçek değildir ya da iş hiç bitmez. İki ya da üç tur, net tarihlerle, iki taraf için de daha sağlıklıdır." },
      { p: "**İyi cevap:** \"Üç tur, her tur için bir hafta; geri dönüşünüz gecikirse takvim kayar.\" **Kötü cevap:** Hiç sayı vermemek. Ayrıca \"revizyon\" ile \"yeni istek\" arasındaki sınırı da sorun: renk değişikliği revizyondur, yeni bir sayfa değildir." },
      { h: "6. Yayından sonra ne oluyor?" },
      { p: "Alan adı, barındırma, güvenlik sertifikası, yedek ve küçük değişiklikler. Bunlar yıllık mı, aylık mı, kime ödeniyor? İlk yıl \"hediye\" olan kalemlerin ikinci yıl fiyatını şimdiden sorun." },
      { p: "**İyi cevap:** \"İlk yıl şu kadar, ikinci yıl şu kadar; küçük metin değişiklikleri şu pakete dahil.\" **Kötü cevap:** \"Sonra konuşuruz.\" Teklife **ilk yıl ve ikinci yıl toplam maliyetini** yazdırmak bu sorunun en kısa yoludur." },
      { h: "7. Site kimin?" },
      { p: "Alan adı kimin adına kayıtlı? Kod ve tasarım size teslim ediliyor mu? Başka biriyle çalışmak isterseniz siteyi alıp gidebiliyor musunuz? Cevap \"hayır\" ise ucuz teklif aslında pahalıdır." },
      { p: "**İyi cevap:** \"Alan adı sizin adınıza kayıtlı, yönetim paneli ve dosyalar yayında size teslim edilir; bu sözleşmede yazıyor.\" **Kötü cevap:** \"Biz yönetiriz, size bir şey lazım olursa söylersiniz.\" Bu kalemin yazılı tarafı için [sözleşmede olması gereken 6 madde](/blog/web-sitesi-sozlesmesinde-olmasi-gerekenler/) yazısına bakın." },
      { h: "Tekliflerdeki kırmızı bayraklar" },
      { ul: [
        "Rakam var, kapsam yok: sayfa adı, özellik ve teslim tarihi hiçbir yerde geçmiyor.",
        "\"Sınırsız\" kelimesi: sınırsız revizyon, sınırsız sayfa, sınırsız destek.",
        "Ödeme planı teslimden önce tamamen peşin; işin yarısı bitmeden son taksit isteniyor.",
        "Alan adı ya da hosting firmanın kendi hesabında, sizin adınıza değil.",
        "İkinci yıl maliyeti sorulunca net bir cevap yok.",
        "Karşılaştırma yapmanızdan rahatsız olmak: iyi teklif soruya açık olur.",
      ] },
      { h: "Teklifleri nasıl karşılaştırmalı?" },
      { p: "Yedi soruyu bir tabloya yazın, her teklif için doldurun. Boş kalan her hücre, sonradan çıkacak bir ek ücrettir. En düşük rakamı değil, en az boş hücresi olan teklifi ciddiye alın." },
      { ul: [
        "**Sayfalar:** adlarıyla yazılı mı?",
        "**Metin ve fotoğraf:** kim hazırlıyor, kaç sayfa için?",
        "**Tasarım:** hazır tema mı, özel mi?",
        "**Özellikler:** tek tek yazılı mı?",
        "**Revizyon:** kaç tur, hangi tarihlerde?",
        "**Yayın sonrası:** ilk yıl ve ikinci yıl toplamı ne?",
        "**Sahiplik:** alan adı ve kod kimin adına, ne zaman teslim?",
      ] },
      { p: "Bir teklif yedi hücrenin altısını dolduruyor, diğeri ikisini dolduruyorsa, ucuz olan ikinciyi seçmek tasarruf değil, bilinmeyeni satın almaktır. Önce eksik hücreleri firmaya sorun; yazılı cevap vermeyen firmayla çalışırken de aynı belirsizlik sürer." },
      { h: "Bütçe dar ama kapsam geniş ise" },
      { p: "Önce yedi sorudan hangisinin fiyatı en çok oynattığına bakın; çoğu zaman metin, özel tasarım ve özelliklerdir. Hazır temayla başlayıp ilk sürümde yalnızca sayfaları ve iletişim butonlarını yayına almak, kalan özellikleri sonraya bırakmak mümkündür. Sitenin gerçekten işinize yarayıp yaramayacağından emin değilseniz önce [Instagram varken web sitesi gerekli mi](/blog/instagram-varken-web-sitesi-gerekli-mi/) yazısına bakın." },
      { note: "**ai-ulu'da nasıl çalışıyoruz:** 30 dakikalık ücretsiz görüşmeden sonra 24 saat içinde yazılı teklif gönderiyoruz. Kapsam, takvim ve teslim edilecekler teklifte yazılıdır; tasarım, kod ve içerik yayında size teslim edilir." },
    ],
    cta: { text: "WhatsApp'tan yazın, yedi sorunun cevabını birlikte dolduralım →", message: "Merhaba, web sitesi için teklif almak istiyorum." },
  },
  {
    slug: "instagram-varken-web-sitesi-gerekli-mi",
    title: "Instagram'ım var, web sitesine gerçekten ihtiyacım var mı?",
    metaTitle: "Instagram varken web sitesi gerekli mi?",
    description: "Instagram hesabı işinizi görüyorsa siteye gerek yok mu? Hangi işletme için yeterli, hangisi için müşteri kaybı: dürüst bir karşılaştırma.",
    targetQuery: "instagram mı web sitesi mi",
    published: DATE,
    updated: "2026-11-23",
    body: [
      { p: "Dürüst cevap: her işletmenin web sitesine ihtiyacı yok. Müşterileriniz sizi yalnızca tavsiyeyle buluyorsa ve takviminiz doluysa, Instagram yeterli olabilir. Ama aşağıdaki dört durumdan biri sizi tarif ediyorsa, site olmaması her hafta müşteri kaybettiriyor demektir." },
      { h: "1. Müşteriniz sizi adınızla değil, ihtiyacıyla arıyorsa" },
      { p: "\"Kadıköy diş beyazlatma\", \"yakınımda halı yıkama\" yazan kişi sizi tanımıyor. Bu aramalarda Google haritayı ve web sitelerini gösterir. Instagram profiliniz bu yarışta genelde yoktur. Sizi tanımayan müşteriyi getiren kanal aramadır; aramada var olmanın yolu da site ve Google İşletme Profili'dir." },
      { h: "2. Aynı soruları her gün DM'den cevaplıyorsanız" },
      { p: "Fiyat, adres, çalışma saati, \"şu hizmet var mı\". Instagram'da bu bilgiler hikâyelerin, öne çıkanların ve eski gönderilerin içine dağılır. Sitede tek sayfada durur. Müşteri sormadan öğrenir, siz yazmadan satarsınız." },
      { h: "3. Hesap sizin değilse" },
      { p: "Instagram hesabınız bir şirketin platformunda duruyor. Hesap kapanabilir, erişim düşebilir, kurallar değişebilir. Alan adınız ve siteniz ise sizin mülkünüzdür; taşır, değiştirir, başkasına devredersiniz." },
      { h: "4. İşiniz güven gerektiriyorsa" },
      { p: "Klinik, hukuk, mimarlık, tadilat. İnsanlar bu işlerde karar vermeden önce araştırır. Yalnızca sosyal medya hesabı olan bir işletme ile düzgün bir sitesi olan arasında seçim yaparken, site ciddiyetin kanıtı olarak okunur." },
      { h: "Instagram'ın yapamadığı beş şey" },
      { ul: [
        "**Google aramasında düzenli çıkmak:** Instagram, uygun hesapların herkese açık gönderilerinin arama motorlarında görünmesine izin verebiliyor; haberlere göre bu, 18 yaş üstü hesap sahiplerinin 1 Ocak 2020'den sonraki herkese açık gönderilerini kapsıyor. Ama bu bir \"çıkabilir\" iznidir, sıralama garantisi değil. Gönderiniz bir hizmet aramasında ilk sayfaya çıkmayabilir; çıksa bile müşteri tek bir fotoğraf görür, fiyatı ve adresi değil.",
        "**Haritada bulunmak:** \"Yakınımda\" aramalarındaki harita kutusu Google İşletme Profili'nden beslenir, Instagram'dan değil. Profili doğruladığınızda işletme bilgilerinin sahibi olursunuz; saat, telefon ve adresi siz düzenlersiniz.",
        "**Randevu ve form almak:** Instagram'da müşteri size yazmak zorunda; siz de her mesajı elle cevaplarsınız. Sitede tek dokunuşla WhatsApp, kısa bir form ya da randevu bağlantısı vardır. Mesai dışında gelen soru da kaybolmaz.",
        "**Hesabın size ait olmasını sağlamak:** Hesap kapatılırsa ya da erişim kaybedilirse takipçi listenizle birlikte vitrininiz de gider. Alan adınız ve siteniz sizin adınıza kayıtlı olduğu sürece bu risk yoktur.",
        "**Yapay zekâ asistanlarına okunabilir bilgi sunmak:** ChatGPT gibi araçlar bir işletmeyi önerirken okuyabildikleri, açık ve tutarlı kaynaklara dayanır. Giriş gerektiren ya da görsel ağırlıklı bir sosyal profil bunun için zayıf bir kaynaktır. Ayrıntısı için [yapay zekâ aramalarında görünmek](/blog/yapay-zeka-aramalarinda-gorunmek/) yazısına bakın.",
      ] },
      { note: "Instagram'ın arama motoru görünürlüğüyle ilgili kapsam bilgisi haber kaynağına dayanıyor; kurallar değişebilir, güncel ayar için hesabınızın gizlilik bölümüne bakın. Hesap kapatılmasıyla ilgili bir istatistik vermiyoruz, çünkü güvenilir bir kaynak bulamadık." },
      { h: "İkisi rakip değil: birlikte nasıl çalışır?" },
      { p: "Instagram ilgi çeker, site kapatır. Instagram'da sizi gören kişi biyografideki linke tıkladığında bir yere varmalı: hizmetler, fiyat aralığı, adres ve tek dokunuşla WhatsApp. O link boşsa ya da bir link listesine gidiyorsa, ilgiyi müşteriye çeviren adım eksiktir." },
      { ul: [
        "**Instagram:** gösterir, güven kurar, mevcut müşteriyle bağı canlı tutar.",
        "**Site:** aramada bulunur, bilgiyi tek yerde toplar, randevu ve mesajı alır.",
        "**Google İşletme Profili:** sizi haritada ve yerel aramada görünür kılar; ücretsizdir.",
      ] },
      { p: "Sitede Instagram'daki en iyi işlerinizi ve yorumları göstermek, ikisini birbirine bağlamanın en kolay yoludur." },
      { h: "Link listesi (linktree benzeri) site yerine geçer mi?" },
      { p: "Kısmen. Link listesi, biyografideki tek bağlantıyı birkaç yere bölmenin pratik yoludur ve başlangıç için fena değildir. Ama bir arama motorunda \"Kadıköy diş beyazlatma\" yazan kişiye cevap veren bir sayfa olmaz: hizmetlerinizi, fiyat aralığınızı, adresinizi ve sık sorulan soruları anlatan metni barındırmaz. Link listesi bir kapıdır, site ise kapının arkasındaki oda." },
      { h: "İlk sürüm sitede neler olmalı?" },
      { p: "Instagram'dan geliyorsanız büyük bir kurumsal siteye gerek yok. Tek sayfa ya da birkaç sayfalık sade bir site çoğu işletme için ilk adım olarak yeter:" },
      { ul: [
        "Ne iş yaptığınız, hangi şehir ve semtte hizmet verdiğiniz ilk ekranda.",
        "Hizmetler ve, mümkünse, fiyat aralığı ya da \"fiyat için yazın\" butonu.",
        "Adres, harita, çalışma saatleri ve ekranın altında sabit Ara ve WhatsApp butonları.",
        "Instagram'daki en iyi birkaç iş ya da müşteri yorumu; gerçek fotoğraflarla.",
        "En çok sorulan beş sorunun kısa cevabı.",
      ] },
      { p: "Bu içerik hem müşterinin DM'de sorduğu soruları azaltır hem de aramada karşılık bulabileceğiniz metni sağlar. Alan adını baştan kendi adınıza kaydettirin ve siteyi ileride başka biriyle çalışmak isterseniz taşıyabileceğiniz şekilde yaptırın." },
      { h: "Ne zaman gerek yok?" },
      { ul: ["Yalnızca tanıdık çevreye satıyorsanız", "Kapasiteniz zaten doluysa", "İşinizi birkaç ay içinde değiştirecekseniz"] },
      { p: "Bu durumda önce ücretsiz olan Google İşletme Profili'ni açın. Siteyi büyümek istediğinizde yaparsınız; yeter ki ne zaman geçeceğinizi önceden belirleyin. Örneğin DM'lerde aynı soruları tekrar cevaplamaya başladığınızda, yeni bir semte ya da şehre açıldığınızda veya reklam vermeyi düşündüğünüzde, o gün siteyi yapmanın zamanıdır." },
      { h: "Kendinize beş soru" },
      { ul: [
        "Müşterim beni adımla mı arıyor, yoksa ihtiyacını mı yazıyor?",
        "Google'a işletme adımı yazınca doğru adres, saat ve telefonu görüyor muyum?",
        "Gelen DM'lerin yarısı fiyat ve adres sorusu mu?",
        "Hesabım yarın erişilemez olsa müşterilerime başka nasıl ulaşırım?",
        "Biyografimdeki link bir müşteriyi doğrudan iletişime götürüyor mu?",
      ] },
      { p: "Kendi cevaplarınızı yazarken bir ölçü kullanın: bir müşteri sizi bugün Google'da ararsa ne görür, Instagram'a ulaşmadan önce hangi bilgiye ihtiyaç duyar? Bu iki sorunun cevabı boşsa, eksik olan Instagram'ın kalitesi değil, onun yanında duran ikinci kanaldır." },
      { p: "İlk ve dördüncü soruda tereddüt ediyorsanız, siteye büyük olasılıkla ihtiyacınız var. Maliyeti merak ediyorsanız [web sitesi fiyatları 2026](/blog/web-sitesi-fiyatlari-2026/) yazısı aralıkları gösteriyor; mevcut durumunuzu ücretsiz [site checkup](/checkup/) aracıyla ölçebilirsiniz." },
      { h: "Kaynaklar" },
      { links: [
        { label: "Social Media Today: Instagram, herkese açık gönderileri arama motorlarına açıyor", href: "https://www.socialmediatoday.com/news/instagram-expanding-google-search-indexing-public-posts-more-regions/752891/" },
        { label: "Google İşletme Profili Yardım: İşletmenizi doğrulayın", href: "https://support.google.com/business/answer/7107242" },
      ] },
      { note: "**Emin değilseniz:** İşletmenizin adını ve sektörünüzü yazın, aramada şu an nasıl göründüğünüzü birlikte bakalım. Site gerekmiyorsa onu da söyleriz." },
    ],
    cta: { text: "WhatsApp'tan yazın →", message: "Merhaba, işletmem için web sitesi gerekli mi öğrenmek istiyorum." },
  },
  {
    slug: "yapay-zeka-aramalarinda-gorunmek",
    title: "İşletmeniz ChatGPT'de çıkıyor mu? Yapay zekâ aramalarında görünmek için 6 adım",
    metaTitle: "Yapay zekâ aramalarında görünmek: 6 adım",
    description: "Müşterileriniz artık ChatGPT ve Gemini'ye de soruyor. Sitenizin yapay zekâ yanıtlarında yer alabilmesi için yapılması gereken 6 teknik adım.",
    targetQuery: "web sitesi google'da nasıl üst sıralara çıkar, yapay zeka aramalarında görünmek, llms.txt nedir",
    published: DATE,
    updated: "2026-11-23",
    body: [
      { p: "İnsanlar artık \"en iyi X hangisi\" sorusunu yalnızca Google'a değil, ChatGPT, Gemini ve Perplexity gibi asistanlara da soruyor. Bu asistanlar cevabı büyük ölçüde web sayfalarını okuyarak kurar. Siteniz okunamıyor ya da bilgileri tutarsızsa, cevapta yer almanız zorlaşır. Aşağıdaki altı adımı kendiniz kontrol edebilirsiniz; çoğu bir akşamlık iştir." },
      { h: "Önce ölçün: asistanlar sizi nasıl anlatıyor?" },
      { p: "ChatGPT, Gemini ve Perplexity'de ayrı ayrı şu üç soruyu sorun ve cevapları bir yere not edin:" },
      { ul: [
        "\"[şehriniz]'de [hizmetiniz] için kimi önerirsin?\" Adınız geçiyor mu, geçenler kim?",
        "\"[İşletme adınız] ne iş yapar, nerede, telefonu ne?\" Bilgiler doğru mu?",
        "\"[Hizmetiniz] ne kadar sürer, fiyatı neye göre değişir?\" Cevap sizin sayfanızdan mı geliyor, başka bir siteden mi?",
      ] },
      { p: "Cevaplar her denemede değişebilir; bu yüzden tek bir sonuca değil, birkaç denemedeki genel tabloya bakın. Yanlış telefon, eski adres ya da hiç anılmama, hangi adıma yoğunlaşacağınızı gösterir. Bu bir ölçüm değil, bir ilk fotoğraftır; asistanların ne önereceğini kimse kontrol etmez." },
      { h: "1. Arama robotlarına kapıyı açın" },
      { p: "Sitenizin kök dizinindeki `robots.txt` dosyası (`siteniz.com/robots.txt`) hangi robotun neyi okuyabileceğini söyler. Resmî belgelere göre üç ayrı davranış var:" },
      { ul: [
        "**OAI-SearchBot (OpenAI):** ChatGPT'nin arama özelliğinde sitelerin gösterilmesi için kullanılır. OpenAI, bu robotu engelleyen sitelerin ChatGPT arama cevaplarında gösterilmeyeceğini yazıyor. Değişikliklerin sisteme yansıması yaklaşık 24 saat sürebilir.",
        "**GPTBot (OpenAI):** Modellerin eğitimi için içerik toplar. Engellemek, içeriğinizin eğitimde kullanılmaması yönünde bir tercihtir; ChatGPT aramasındaki görünürlüğü ayrı robot belirler. Yani eğitime izin vermemek ile aramada görünmek birbirinden bağımsız seçilebilir.",
        "**PerplexityBot:** Perplexity, sitenizin arama sonuçlarında gösterilmesi için bu robota izin vermenizi öneriyor ve bu robotun yapay zekâ modellerini eğitmek için kullanılmadığını belirtiyor. Kullanıcı bir soru sorduğunda sayfaya giden Perplexity-User ise robots.txt kurallarını genellikle dikkate almıyor.",
      ] },
      { p: "Google tarafında `Google-Extended`, Gemini modellerinin eğitimi ve bazı Gemini uygulamalarında kullanım için bir tercih belirtecidir. Google, bunun Google Arama'ya dahil olmayı da sıralamayı da etkilemediğini söylüyor. Google aramasında ve AI Overviews'da görünmek için normal Googlebot'un sayfalarınızı tarayabilmesi yeter." },
      { p: "Kontrol: tarayıcıya `siteniz.com/robots.txt` yazın. İçinde bu robotlar için `Disallow: /` satırı görüyorsanız, bunu bilinçli bir kararla koyup koymadığınızı sorun. Bazı barındırma paketleri, güvenlik eklentileri ve CDN'ler (örneğin bot koruma modları) robotları sizin haberiniz olmadan engelleyebilir; Perplexity bu uyarıyı kendi belgesinde Cloudflare için ayrıca yapıyor." },
      { h: "2. İçerik JavaScript olmadan da görünsün" },
      { p: "Bir robotun sayfayı nasıl gördüğünü yaklaşık olarak görmek için sayfada sağ tıklayıp \"Sayfa kaynağını görüntüle\" deyin. Hizmetleriniz, adresiniz ve telefonunuz o kaynak kodunun içinde düz metin olarak geçiyorsa iyi. Yalnızca boş bir kutu ve script dosyaları görüyorsanız, metin sayfa yüklendikten sonra ekrana basılıyor demektir ve bunu çalıştırmayan bir robot boş sayfa görür. Hangi robotun kodu çalıştırdığı konusunda her platform için resmî bir açıklama bulamadık; güvenli yol, temel bilgiyi düz HTML'de vermektir." },
      { h: "3. Yapılandırılmış veri: Organization ve LocalBusiness" },
      { p: "Schema.org işaretlemesi (JSON-LD), sayfanın ne hakkında olduğunu makinenin anlayacağı biçimde yazar. Google'ın yerel işletme belgesinde `name` ve `address` zorunlu alanlar; çalışma saatleri gibi ek bilgiler de verilebilir. Dükkânınız ya da ofisiniz varsa `LocalBusiness`, değilse `Organization` işaretlemesi kullanın; ad, adres ve telefon sayfada görünenle birebir aynı olsun." },
      { p: "Bir önemli not: Google, AI Overviews ve AI Mode'da yer almak için ayrıca bir işaretleme ya da özel dosya gerekmediğini, özel bir schema.org verisi eklemenize gerek olmadığını yazıyor. Yani yapılandırılmış veri bir sıralama hilesi değil; bilginin doğru okunmasını kolaylaştıran bir düzendir." },
      { h: "4. Müşterinin sorduğu soruya cevap veren sayfalar" },
      { p: "Asistanlar ve arama motorları, soruya doğrudan cevap veren sayfaları kullanışlı bulur. Bunun için üç somut iş var:" },
      { ul: [
        "Her ana hizmet için ayrı bir sayfa: \"Tesisat\" tek sayfada değil, \"Kaçak tespiti\", \"Petek temizliği\" gibi ayrı başlıklarda.",
        "Hizmet verdiğiniz her şehir ya da ilçe için, gerçekten orada hizmet veriyorsanız, ayrı ve kendine özgü içerikli bir sayfa. Şehir adını değiştirip kopyalanmış sayfalar işe yaramaz.",
        "Her sayfada müşterinin gerçekten sorduğu soruların iki üç cümlelik cevapları: ne kadar sürer, fiyatı neye bağlı, hangi bölgelere gidiyorsunuz.",
      ] },
      { p: "Google'a göre AI özelliklerinde bir sayfanın bağlantı olarak gösterilebilmesi için dizinde olması ve snippet ile gösterilmeye uygun olması gerekir; bunun ötesinde ek bir koşul yok. Dizine alınma kontrolünü [siteniz var ama kimse aramıyor](/blog/web-sitem-var-musteri-gelmiyor/) yazısındaki Search Console adımıyla yapabilirsiniz." },
      { h: "5. llms.txt: isteğe bağlı, garanti değil" },
      { p: "`llms.txt`, sitenin kısa bir özetini tek dosyada sunmayı öneren bir fikirdir. Google, AI özelliklerinde görünmek için böyle bir dosyaya ihtiyaç olmadığını açıkça söylüyor. OpenAI ve Perplexity'nin robot belgelerinde de bu dosyadan söz edilmiyor. Hazırlamak zarar vermez ama emek ayıracaksanız önce 1-4 ve 6. adımlara ayırın." },
      { h: "6. Site dışında da tutarlı olun" },
      { p: "Asistanlar yalnızca sitenizi değil, harita kayıtlarını, rehberleri ve yorumları da kaynak olarak kullanabilir. Ad, adres ve telefonu şu yerlerde yan yana yazıp karşılaştırın: siteniz, Google İşletme Profili, Instagram ve Facebook sayfanız, rehber siteler. \"Ltd. Şti.\" bir yerde var, bir yerde yok; eski telefon bir yerde kalmış: bunlar çelişkidir ve düzeltmesi ücretsizdir." },
      { p: "Google İşletme Profili'ni doğrulayın, çalışma saatlerini, hizmetleri ve fotoğrafları güncel tutun. Uygunsa ChatGPT'deki işletme kaydını da kontrol edin; ayrıntılar için [ChatGPT Business Hub nedir](/blog/chatgpt-business-hub-nedir/) yazısına bakın." },
      { h: "Neler işe yaramaz?" },
      { ul: [
        "\"ChatGPT'de birinci çıkarırım\" vaadi. Hiçbir platform işletmelere önerilerde yer garantisi vermiyor; Perplexity ve OpenAI belgeleri de böyle bir söz içermiyor.",
        "Robots.txt'e izin satırı eklemek tek başına bir şey değiştirmez. Okunabilir, doğru ve işe yarar içerik yoksa robotun okuyacağı bir şey de yok.",
        "Her şehir için kopyala-yapıştır sayfalar.",
        "Aynı soruyu bir kez sorup sonuca göre karar vermek. Cevaplar değişir.",
      ] },
      { h: "Bir akşamlık kontrol listesi" },
      { ul: [
        "Üç asistanda üç soruyu sorun, cevapları kaydedin.",
        "`siteniz.com/robots.txt` içinde OAI-SearchBot ve PerplexityBot engelli mi bakın.",
        "Sayfa kaynağında telefon ve adresiniz düz metin olarak görünüyor mu?",
        "Ana sayfada Organization ya da LocalBusiness işaretlemesi var mı, bilgiler görünenle aynı mı?",
        "Her ana hizmetin kendi sayfası var mı?",
        "Ad, adres ve telefon siteniz, Google İşletme Profili ve sosyal profillerde aynı mı?",
      ] },
      { p: "Teknik tarafın kısa bir özetini görmek isterseniz ücretsiz [site checkup](/checkup/) aracını deneyin." },
      { h: "Dürüst uyarı" },
      { p: "Asistanların neyi önereceğini kimse kontrol etmiyor. Yapılabilecek olan, sitenizi okunabilir ve tutarlı kılıp aday olmaktır. Okunamayan site aday bile değildir." },
      { h: "Resmî kaynaklar" },
      { links: [
        { label: "OpenAI: Crawler belgeleri (OAI-SearchBot, GPTBot, ChatGPT-User)", href: "https://developers.openai.com/api/docs/bots" },
        { label: "Perplexity: Robotlar (PerplexityBot, Perplexity-User)", href: "https://docs.perplexity.ai/guides/bots" },
        { label: "Google Search Central: Yaygın Google tarayıcıları (Google-Extended)", href: "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers" },
        { label: "Google Search Central: AI özellikleri ve web siteniz", href: "https://developers.google.com/search/docs/appearance/ai-features" },
        { label: "Google Search Central: LocalBusiness yapılandırılmış verisi", href: "https://developers.google.com/search/docs/appearance/structured-data/local-business" },
      ] },
      { note: "**ai-ulu'da:** Kurduğumuz her site bu adımlarla birlikte teslim edilir. Mevcut sitenizi de kontrol edebiliriz." },
    ],
    cta: { text: "Sitenizin adresini WhatsApp'tan gönderin, altı maddeyi kontrol edip sonucu yazalım →", message: "Merhaba, sitemin yapay zekâ aramalarındaki durumunu kontrol eder misiniz? Adres: " },
  },
  {
    slug: "web-sitem-var-musteri-gelmiyor",
    title: "Siteniz var ama kimse aramıyor: 5 yaygın neden",
    description: "Siteye ziyaretçi geliyor ama telefon çalmıyor mu? Ziyaretçiyi müşteriye çevirmeyen sitelerde en sık görülen 5 hata ve düzeltmeleri.",
    targetQuery: "web sitesi neden müşteri getirmiyor",
    published: DATE,
    updated: "2026-11-23",
    body: [
      { p: "Site yaptırdınız, para verdiniz, bekliyorsunuz. Telefon çalmıyor. Sorun çoğu zaman tasarımın güzelliği değil; aşağıdaki beş şeyden biridir. İlk beşini kendi telefonunuzdan on dakikada, Google ile ilgili son ikisini bir akşamda kontrol edebilirsiniz." },
      { h: "1. Telefonda geç açılıyor" },
      { p: "Ziyaretçilerinizin büyük kısmı siteye telefondan, çoğu zaman mobil internetle girer. Sitenizi Wi-Fi'ı kapatıp açın. Ekran birkaç saniye boş kalıyorsa, ziyaretçi geri tuşuna basmıştır. Ağır görseller ve gereksiz eklentiler en sık nedenlerdir. Google'ın ücretsiz PageSpeed Insights aracı size mobil skorunuzu ve nedenini söyler." },
      { p: "Neye bakacaksınız? Google'ın Core Web Vitals eşiklerine göre ana içeriğin yüklenmesi (LCP) 2,5 saniye ya da altında, tıklamaya yanıt (INP) 200 milisaniye ya da altında, sayfanın kaymaması (CLS) 0,1 ya da altında olmalı; LCP için 4 saniyenin üstü \"zayıf\" sayılıyor. Google'ın yayımladığı bir kıyaslamaya göre mobil ziyaretlerin yüzde 53'ü sayfa üç saniyeden uzun sürerse terk ediliyor. Bu veri 2016 tarihli; bugünün kesin oranı olarak değil, yön gösteren bir referans olarak okuyun." },
      { p: "Kendiniz yapabileceğiniz en etkili iki şey: görselleri küçültmek (telefon fotoğrafı doğrudan yüklenmesin) ve kullanmadığınız eklentileri silmek." },
      { h: "2. Ne yaptığınız ilk ekranda yazmıyor" },
      { p: "Siteyi açın, hiçbir yere dokunmadan beş saniye bakın. Ne iş yaptığınız, nerede olduğunuz ve nasıl ulaşılacağı görünüyor mu? \"Hoş geldiniz\" ve \"Kalite bizim işimiz\" hiçbir şey söylemez. \"Bornova'da 7/24 çilingir, 15 dakikada kapınızda\" söyler." },
      { h: "3. Ulaşmak zahmetli" },
      { p: "İletişim sayfasını bulmak, numarayı kopyalamak, rehbere kaydetmek. Her adımda insan kaybedersiniz. Telefonda ekranın altında sabit duran iki buton yeter: Ara ve WhatsApp. Tek dokunuş. Uzun formlar da aynı sorunu yaratır; ad ve telefon çoğu iş için yeterlidir." },
      { p: "Kontrol: telefonunuzdan siteyi açın ve bir yabancı gibi \"şimdi ne yapmam gerekiyor?\" diye sorun. Cevap için kaydırmanız gerekiyorsa net bir çağrı eksik demektir. Buton metni de önemlidir: \"Gönder\" yerine \"Ücretsiz keşif için WhatsApp'tan yaz\" ne olacağını söyler." },
      { h: "4. Güvenmek için neden yok" },
      { p: "Sizi tanımayan biri neden sizi arasın? Gerçek iş fotoğrafları, müşteri yorumları, kaç yıldır bu işi yaptığınız, adresiniz. Stok fotoğraftaki gülümseyen ekip güven vermez; sizin dükkânınızın önünde çekilmiş vasat bir fotoğraf verir." },
      { h: "5. Zaten kimse gelmiyor" },
      { p: "Belki sorun dönüşüm değil, ziyaretçi yokluğudur. Bunu bilmenin tek yolu ölçmektir. Sitenizde bir ziyaretçi sayacı yoksa karanlıkta yürüyorsunuz. Ayda kaç kişi geliyor, nereden geliyor, hangi sayfadan çıkıyor: bu üç sayı olmadan yapılan her değişiklik tahmindir." },
      { h: "6. Google siteyi hiç görmemiş olabilir" },
      { p: "Bazen sorun sitenin kötü olması değil, Google'ın onu dizine eklememiş olmasıdır. Önce Google'a işletme adınızı yazın; çıkıyor mu? Sonra ücretsiz Google Search Console'a sitenizi ekleyin ve üstteki kutuya ana sayfa adresinizi yapıştırın. \"URL is on Google\" yazıyorsa sayfa dizinde demektir. \"URL is not on Google\" yazıyorsa nedenini aynı ekran gösterir; son tarama tarihi boşsa Google sayfayı henüz bulmamıştır ve \"Test live URL\", ardından \"Request indexing\" diyebilirsiniz." },
      { p: "İki uyarı. Google'ın kendi yardım sayfası, \"dizinde\" yazmasının sayfanın aramada çıkacağını garanti etmediğini söylüyor. Ayrıca `site:` aramaları eksik sonuç verebilir; kesin cevabı Search Console verir. Siteyi yeni yaptırdıysanız birkaç gün beklemek normaldir. Haftalar geçtiyse sayfa kodunda yanlışlıkla `noindex` kalmış olabilir; siteyi yapan kişiye sorun." },
      { h: "7. Google İşletme Profili yok ya da yarım" },
      { p: "Yerel aramalarda (\"yakınımda\", \"Bornova çilingir\") insanlar çoğu zaman siteye değil haritadaki kutuya bakar. Profil doğrulanmamışsa bilgilerini düzenleyemezsiniz; Google, eksik profilin müşterinin sizi bulmasını zorlaştırabileceğini söylüyor. Telefonla doğrulama çıkarsa numaranın gerçekten cevap verebilmesi gerekir; sesli yanıt sistemi (IVR) kodu alamıyor." },
      { ul: [
        "Çalışma saatlerini, tatil günleri dahil, girin.",
        "Telefonu ve site adresini yazın; ikisi sitenizdekiyle birebir aynı olsun.",
        "Dükkân önü, iç mekân ve çalışma fotoğrafı yükleyin.",
        "Gelen yorumlara kısa ve gerçek cevap verin.",
      ] },
      { p: "Google, fotoğraf ekleyen işletmelerin yol tarifi isteklerinin yüzde 42 daha fazla olduğunu yazıyor. Bu Google'ın kendi yayımladığı bir rakam; biz bağımsız olarak doğrulamadık." },
      { h: "Hangisinden başlamalı?" },
      { p: "Sıra önemli: önce ölçüm (5), sonra hız (1), sonra iletişim butonları (3). Dizine eklenme (6) ve Google İşletme Profili (7) de aynı hafta bakılacak ücretsiz işlerdir. Bunlar çoğu sitede bir iki günde düzelir ve yeniden site yaptırmayı gerektirmez. İlk ekran (2) ve güven (4) içerik işidir, biraz daha zaman ister." },
      { p: "Mevcut siteniz bu yediyi kaldıramayacak kadar eskiyse yenilemek daha ucuza gelir. Ama önce düzeltmeyi deneyin. Yeni site yaptıracaksanız bütçeyi bilmek için [web sitesi fiyatları 2026](/blog/web-sitesi-fiyatlari-2026/) yazısına bakın." },
      { h: "Bir akşamlık kontrol listesi" },
      { ul: [
        "Telefonda Wi-Fi kapalıyken siteyi açın; ekran kaç saniyede doluyor?",
        "PageSpeed Insights'ta mobil sonucunuza bakın, kırmızı uyarıları not edin.",
        "İlk ekranda iş, şehir ve ulaşım yolu görünüyor mu?",
        "Ekranın altında sabit Ara ve WhatsApp butonu var mı?",
        "Google'da işletme adınızı arayın: site ve harita kutusu çıkıyor mu?",
        "Search Console'da ana sayfanızın durumuna bakın.",
        "Google İşletme Profili'nde saat, telefon ve fotoğraf güncel mi?",
      ] },
      { p: "Yedi maddenin yarısında \"hayır\" diyorsanız, sorun muhtemelen tek bir yerde değil. O zaman en çok müşteriye dokunan düzeltmeden, yani ulaşım butonlarından ve Google İşletme Profili'nden başlamak mantıklıdır; ikisi de ücretsizdir ve site yenilemeyi beklemez." },
      { h: "Aramada nasıl göründüğünüzü kendiniz ölçün" },
      { p: "Ücretsiz [site checkup](/checkup/) aracı sitenizin temel teknik ve arama sinyallerini tek sayfada gösterir. Yapay zekâ asistanlarının da sitenizi okuyabilmesi için [yapay zekâ aramalarında görünmek](/blog/yapay-zeka-aramalarinda-gorunmek/) yazısındaki maddeleri kontrol edin." },
      { h: "Kaynaklar" },
      { links: [
        { label: "web.dev: Core Web Vitals eşikleri", href: "https://web.dev/articles/defining-core-web-vitals-thresholds" },
        { label: "Google Search Console Yardım: URL Inspection tool", href: "https://support.google.com/webmasters/answer/9012289" },
        { label: "Google İşletme Profili Yardım: İşletmenizi doğrulayın", href: "https://support.google.com/business/answer/7107242" },
        { label: "Google İşletme Profili Yardım: Profilinizi düzenleyin", href: "https://support.google.com/business/answer/14368911" },
        { label: "Think with Google: Mobil sayfa hızı kıyaslamaları (2017)", href: "https://thinkwithgoogle.com/intl/en-gb/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks" },
      ] },
      { note: "**İkinci bir göz isterseniz:** Sitenizin adresini gönderin, maddeleri telefonda kontrol edip hangisinin sizi en çok tuttuğunu yazalım. Ücretsiz." },
    ],
    cta: { text: "WhatsApp'tan site adresinizi gönderin →", message: "Merhaba, sitemi kontrol eder misiniz? Adres: " },
  },
  {
    slug: "web-sitesi-sozlesmesinde-olmasi-gerekenler",
    title: "Web sitesi yaptırırken sözleşmede olması gereken 6 madde",
    metaTitle: "Web sitesi sözleşmesi: olması gereken 6 madde",
    description: "Alan adı kimin adına? Kodlar sizin mi? Site yaptırırken sonradan başınızı ağrıtmaması için yazılı olması gereken 6 madde.",
    targetQuery: "web tasarım sözleşmesinde nelere dikkat edilmeli",
    published: DATE,
    updated: "2026-11-23",
    body: [
      { p: "Web sitesi işlerinde en pahalı sorunlar site yapılırken değil, bir yıl sonra çıkar: ajansla yollar ayrılır ve sitenin aslında sizin olmadığını öğrenirsiniz. Aşağıdaki altı madde yazılı değilse, imzalamadan önce yazdırın. Bu yazı hukuki tavsiye değildir; büyük projelerde sözleşmeyi bir avukata gösterin." },
      { h: "1. Alan adı sizin adınıza kayıtlı olmalı" },
      { p: "`isletmeniz.com` adresi kimin hesabında? Yapan kişinin hesabındaysa, yenilemeyi unuttuğunda ya da aranız bozulduğunda adresinizi kaybedebilirsiniz. Alan adını kendi adınıza, kendi e-postanızla alın; yönetim yetkisini yapan kişiye siz verirsiniz, tersi değil." },
      { p: "Kontrol: alan adı firmasının sitesine kendi hesabınızla girebiliyor musunuz? Kayıt sahibi olarak adınız ya da şirket unvanınız görünüyor mu? Yenileme tarihi ve yenileme uyarılarının gideceği e-posta da sizin olmalı." },
      { h: "2. Kod, tasarım ve içerik teslim edilmeli" },
      { p: "\"Site sizin\" demek yetmez. Dosyaların size hangi biçimde, ne zaman teslim edileceği yazmalı. Kiralık altyapılarda site taşınamaz; bunu baştan bilin, sonradan öğrenmeyin." },
      { p: "Hukuk tarafında bilmeniz gereken bir kural var: Fikir ve Sanat Eserleri Kanunu'nun 52. maddesine göre mali haklara ilişkin sözleşmelerin yazılı olması ve devredilen hakların ayrı ayrı gösterilmesi şarttır. Bir hukuk bürosunun yorumuna göre işlemin amacı ve konusu dışında kalan hakların devredilmediği kabul edilir. Yani sözleşmede yalnızca \"site teslim edilir\" yazıyorsa, kodu değiştirme ya da başka birine verme hakkınız tartışmaya açılabilir. Şunu yazdırın: kaynak kodun, tasarım dosyalarının ve metin ile görsellerin kullanım ve değiştirme hakkı ödeme tamamlanınca size geçer. Üçüncü taraf eklenti ve yazı tipi lisansları ayrıca listelensin; onlar yapanın değil, lisans sahibinin malıdır." },
      { h: "3. Tüm giriş bilgileri sizde olmalı" },
      { p: "Yönetim paneli, barındırma, alan adı, e-posta, Google İşletme Profili, istatistik aracı. Hepsinde yönetici hesabı size ait olmalı. Yapan kişi yetkili kullanıcı olur, sahip olmaz." },
      { p: "Teslimde bir giriş listesi isteyin: hangi hizmet, hangi hesap, kimin e-postası bağlı. Yapan kişinin kendi e-postasıyla açılmış bir hesap varsa, teslimden önce sahipliği size aktarsın. Parolalar bir mesajla değil, parola yöneticisiyle paylaşılsın ve teslimde değiştirilsin." },
      { h: "4. Kapsam, takvim ve revizyon sayısı yazılı olmalı" },
      { p: "Hangi sayfalar, hangi özellikler, kaç revizyon, hangi tarihte. İçerik sizden bekleniyorsa onun da tarihi. \"Yaklaşık bir ay\" bir tarih değildir." },
      { ul: [
        "**Kapsam:** sayfa listesi ve özellikler tek tek yazılsın; yazılmayan şey kapsam dışıdır.",
        "**Revizyon:** \"iki tur revizyon\" gibi bir sayı ve bir turun ne demek olduğu (tek toplu geri bildirim) yazılsın.",
        "**Takvim:** içerik ve görselleri siz geç verirseniz tarihin kayacağı da yazılsın; ikisi birbirine bağlı olmalı.",
        "**Teslim kriteri:** \"yayında ve telefonda çalışıyor\" gibi kontrol edebileceğiniz bir tanım olsun.",
      ] },
      { h: "5. Ödeme teslimata bağlı olmalı" },
      { p: "Tamamı peşin ödenen işin bitme hızı düşer. Yaygın ve adil olan, bir kısmı başta, kalanı yayında ödenen plandır. Hangi aşamada ne ödeneceği yazılsın; örneğin ilk kısım başlangıçta, ikinci kısım tasarım onayında, son kısım yayında ve teslimle birlikte. Kod ve giriş bilgilerinin teslimi son ödemeyle aynı gün olsun." },
      { h: "6. Yayından sonraki maliyetler belli olmalı" },
      { p: "Barındırma, alan adı yenileme, bakım. Yıllık ne tutuyor? Bakım almazsanız site çalışmaya devam ediyor mu? Küçük bir değişiklik için ne ödersiniz? İlk yıl ücretsiz olan kalemin ikinci yıl fiyatı şimdiden yazılsın." },
      { p: "Bakım istiyorsanız \"bakım\" kelimesinin neyi kapsadığı yazılsın: güvenlik güncellemeleri, yedekleme, küçük içerik değişikliği, arıza halinde ne kadar sürede dönüş. Süre yazılmamışsa sizin beklentiniz ile yapanın beklentisi farklı çıkabilir." },
      { h: "Kişisel veri: kim sorumlu?" },
      { p: "Sitenizde iletişim formu, rezervasyon ya da üyelik varsa kişisel veri topluyorsunuz demektir. Kişisel Verileri Koruma Kurumu'nun yayınına göre veri sorumlusu, verilerin hangi amaçla ve nasıl işleneceğini belirleyen taraftır; veri işleyen ise onun yetkisiyle ve adına veriyi işleyendir. İşletme olarak sorumlu genellikle sizsiniz; siteyi kuran ya da barındıran taraf sizin adınıza veri işliyorsa veri işleyen olabilir. Bu ayrım her olayda aynı çıkmaz, bu yüzden sözleşmeye şunlar yazılsın: formdan gelen verilerin nerede tutulduğu, kimin erişebildiği ve ilişki bittiğinde silinmesi ya da size teslimi. Aydınlatma metni gibi yükümlülükler için güncel bilgiyi kvkk.gov.tr'den kontrol edin; kesin cevap için avukata sorun." },
      { h: "İlişki biterse ne olur?" },
      { p: "Sözleşmeyi imzalarken ayrılığı da düşünün. Fesih halinde ödenmiş işin ne kadarının size ait olacağı, giriş bilgilerinin kaç gün içinde devredileceği ve yapılan işin kısmen teslim edilip edilmeyeceği yazılsın. Bu üç satır, anlaşmazlıkta konuşmayı ciddi şekilde kısaltır." },
      { h: "İmzadan önce kontrol listesi" },
      { ul: [
        "Alan adı kayıt sahibi ben miyim?",
        "Kod, tasarım ve içeriğin kullanım ve değiştirme hakkı yazılı olarak bana mı geçiyor?",
        "Tüm hesaplarda yönetici ben miyim?",
        "Sayfalar, revizyon sayısı ve teslim tarihi yazılı mı?",
        "Ödeme planı aşamalara bağlı mı, son ödeme teslimle birlikte mi?",
        "Yıllık barındırma, yenileme ve bakım ücretleri ikinci yıl dahil yazılı mı?",
        "Kişisel veri ve fesih maddesi var mı?",
      ] },
      { h: "Hızlı kontrol" },
      { p: "Görüşmede tek bir soru çoğunu açığa çıkarır: **\"Yarın başka biriyle çalışmak istersem siteyi alıp gidebilir miyim?\"** Cevap net bir \"evet\" değilse, diğer maddeleri tek tek sorun. Bütçeyi karşılaştırmak için [web sitesi fiyatları 2026](/blog/web-sitesi-fiyatlari-2026/) yazısındaki aralıklara, fiyatı neyin değiştirdiğini anlamak için [web sitesi fiyatını ne belirler](/blog/web-sitesi-fiyatini-ne-belirler/) yazısına bakabilirsiniz." },
      { p: "Sitenizi mevcut hâliyle görmek isterseniz ücretsiz [site checkup](/checkup/) aracı temel teknik sinyalleri tek sayfada gösterir." },
      { h: "Kaynaklar" },
      { links: [
        { label: "Kulaçoğlu Hukuk: Eser sahibinin hakları, hakkın korunması ve devri (FSEK m.52 yorumu)", href: "https://kulacoglu.av.tr/eser-sahibinin-haklari-hakkin-korunmasi-ve-devri/" },
        { label: "KVKK: Veri Sorumlusu ve Veri İşleyen (Kurum yayını)", href: "https://kvkk.gov.tr/SharedFolderServer/CMSFiles/31d9c444-27a5-4a75-95b1-1ca9bdb81ea5.pdf" },
        { label: "Kişisel Verileri Koruma Kurumu", href: "https://www.kvkk.gov.tr/" },
      ] },
      { note: "**ai-ulu'da:** Tasarım, kod ve içerik yayında size teslim edilir. Kapsam ve takvim teklifte yazılıdır." },
    ],
    cta: { text: "Elinizdeki teklifi WhatsApp'tan gönderin, altı maddeye göre birlikte bakalım →", message: "Merhaba, elimdeki web sitesi teklifini birlikte değerlendirebilir miyiz?" },
  },
  {
    "slug": "chatgpt-business-hub-nedir",
  "title": "ChatGPT Business Hub Nedir? İşletme Kaydı ve Görünürlük Rehberi",
  "metaTitle": "ChatGPT Business Hub Nedir? İşletme Rehberi",
  "description": "ChatGPT Business Hub ile işletme profili talebi, doğrulama, Türkiye'deki uygunluk ve Business Agent hakkında bilmeniz gerekenler.",
  "targetQuery": "ChatGPT Business Hub, ChatGPT işletme profili, ChatGPT işletme kaydı, Google İşletme Profili alternatifi",
  "published": "2026-11-12",
  "updated": "2026-11-12",
  "body": [
    {
      "p": "İşletmeler artık yalnızca Google'da değil, ChatGPT gibi yapay zekâ asistanlarında da keşfediliyor. Kullanıcılar bir ihtiyacını tarif ediyor, seçenekleri karşılaştırıyor ve işletmeler hakkında doğrudan soru soruyor. OpenAI, 10 Kasım 2026'da bu süreci işletmeler açısından yönetilebilir hâle getirmeyi amaçlayan Businesses in ChatGPT sistemini beta olarak duyurdu."
    },
    {
      "p": "Sistemin işletme yönetim alanı Business Hub. İşletmeler, uygunluk ve doğrulama koşullarını karşılamaları hâlinde ChatGPT'deki profillerini talep edebiliyor, bilgilerini güncelleyebiliyor ve kendileriyle ilgili toplu etkileşim verilerini inceleyebiliyor."
    },
    {
      "h": "ChatGPT Business Hub nedir?"
    },
    {
      "p": "Business Hub, Businesses in ChatGPT içindeki işletme yönetim arayüzüdür. İşletmenin sahibi veya yetkili temsilcisi, işletme profilini talep ederek doğrulama sürecini başlatabilir. Talep onaylandıktan ve gerekli kimlik doğrulaması tamamlandıktan sonra işletme bilgileri yönetilebilir."
    },
    {
      "p": "Bu sistem, ChatGPT Business aboneliğiyle aynı şey değildir. ChatGPT Business ekipler için ücretli bir çalışma alanıdır; Business Hub ise işletmelerin ChatGPT'de nasıl temsil edildiğini yönetmeye yönelik ayrı bir üründür. Uygun bir işletme profilini talep etmek için ayrıca reklam hesabı veya ChatGPT Enterprise sözleşmesi gerekmez."
    },
    {
      "h": "Google İşletme Profili'nin yerini alacak mı?"
    },
    {
      "p": "Doğrudan değil. Google İşletme Profili; Google Arama ve Haritalar'da adres, çalışma saatleri, telefon, fotoğraf ve yorumlar üzerinden yerel keşfe odaklanır. Business Hub ise ChatGPT'deki işletme bilgilerini yönetmeye ve konuşmalı keşif sırasında işletmenin nasıl temsil edildiğini anlamaya yarar."
    },
    {
      "p": "Bu nedenle iki hizmeti birbirinin alternatifi olarak görmek yerine, farklı keşif kanallarını tamamlayan araçlar olarak değerlendirmek daha doğru. ChatGPT Business Hub, Google Haritalar'ın veya Google İşletme Profili'nin yerine geçen bir harita ve yorum yönetimi sistemi değildir."
    },
    {
      "h": "Business Hub üzerinden neler yapılabilir?"
    },
    {
      "ul": [
        "**İşletme profilini talep etme:** ChatGPT'de bulunan ve işletmeyle eşleşen listeleme için sahiplik talebi gönderilebilir. Uygun çevrimiçi işletmeler için yeni profil ekleme seçeneği de sunulabilir.",
        "**İşletme bilgilerini yönetme:** Onay ve kimlik doğrulamasından sonra web sitesi, açıklama, kategori, logo, iletişim ve politika bilgileri güncellenebilir.",
        "**Ürün feed'i bağlama:** Uygun perakendeciler ürün adı, fiyat ve stok durumunu CSV feed'i veya Shopify bağlantısıyla paylaşabilir.",
        "**Etkileşim verilerini inceleme:** İşletme anılmaları, web sitesi tıklamaları ve keşif konuları gibi toplulaştırılmış veriler görülebilir.",
        "**Business Agent oluşturma:** Yalnızca ayrı uygunluk koşullarını karşılayan işletmeler, müşterilerin soru sorabileceği bir yapay zekâ temsilcisi hazırlayabilir."
      ]
    },
    {
      "h": "Türkiye'deki işletmeler kayıt olabilir mi?"
    },
    {
      "p": "OpenAI'nin güncel kurulum rehberi, ChatGPT'nin sunulduğu bölgelerdeki uygun işletmelerin mevcut bir profili talep edebileceğini veya desteklenen durumlarda yeni profil ekleyebileceğini belirtiyor. Ancak uygunluk; işletmenin türüne, bulunduğu yere ve kullanılabilir doğrulama yöntemlerine bağlı."
    },
    {
      "p": "Burada fiziksel işletmeler ile çevrimiçi işletmeleri ayırmak gerekiyor. Rehbere göre uygun bir çevrimiçi işletme, listede bulunmuyorsa yeni profil ekleme seçeneği görebilir. Yerel mağaza ve restoranlar ise şu anda yalnızca mevcut ABD listelemelerini talep edebiliyor. Bu nedenle Türkiye'deki fiziksel bir mağaza veya restoranın yeni profil oluşturabileceği varsayılmamalı."
    },
    {
      "p": "Türkiye'de faaliyet gösteren ve web sitesi bulunan çevrimiçi hizmet işletmeleri Business Hub üzerinden uygunluk kontrolü yapabilir. Başvurunun kabulü veya tüm yönetim özelliklerine erişim garanti değildir."
    },
    {
      "h": "İşletme profili nasıl talep edilir ve doğrulanır?"
    },
    {
      "p": "İlk adım, ChatGPT web arayüzündeki Business Hub bölümünde işletme adını aramaktır. İşletmeyle eşleşen mevcut bir listeleme varsa onu seçerek talep başlatılır. Yeni profil ekleme seçeneği yalnızca uygun işletmelerde görünür."
    },
    {
      "ul": [
        "İşletmeyi temsil etmeye yetkili olduğunuzu doğrulamak için sunulan yöntemlerden birini seçin: işletme telefonu, işletme e-postası, web alan adı veya Shopify bağlantısı.",
        "OpenAI'nin sahiplik talebini incelemesini ve e-posta ile kararını bildirmesini bekleyin.",
        "Profil üzerinde değişiklik yapmak, içgörüleri görmek veya ürün feed'i bağlamak için Persona üzerinden ayrı kimlik doğrulamasını tamamlayın.",
        "Persona doğrulaması onaylandıktan sonra profil bilgilerini güncelleyin ve uygun özellikleri kullanın."
      ]
    },
    {
      "p": "Persona aşamasında devlet tarafından verilmiş kimlik, işletme kayıt bilgileri ve işletmeyi temsil etme yetkisini gösteren belgeler istenebilir. Mavi doğrulama işareti, yalnızca ilk sahiplenme talebi onaylandığında değil, Persona kimlik doğrulaması da onaylandıktan sonra gösterilir."
    },
    {
      "note": "Sahiplik talebi, Persona kimlik doğrulaması ve Business Agent'ı yayımlama birbirinden ayrı adımlardır. İşletme profili yönetmek için Business Agent yayımlamak veya reklam vermek zorunlu değildir."
    },
    {
      "h": "ChatGPT işletme görünürlüğü nasıl ölçülüyor?"
    },
    {
      "p": "Business Hub'ın Insights alanı, onaylı işletme profilleri için son 28 güne ilişkin toplulaştırılmış veriler sunar. Bu veriler işletmenin ChatGPT içinde nasıl keşfedildiğine dair fikir verebilir; ancak tek tek kullanıcıların ne yazdığını göstermez."
    },
    {
      "ul": [
        "**Anılmalar:** Çevrimiçi işletmelerde ChatGPT'nin işletmenin web sitesine referans vermesi; yerel işletmelerde ise ilgili konum için işletme sonucunun gösterilmesi sayılır.",
        "**Web sitesi tıklamaları:** ChatGPT'den işletmenin web sitesine yapılan tıklamaları gösterir.",
        "**Keşif konuları:** İşletmenin web sitesi veya listelemesiyle birlikte görülen yanıtların ortak konu başlıklarını özetler. Bunlar tek tek kullanıcı soruları veya doğrudan satın alma niyeti ölçümü değildir."
      ]
    },
    {
      "p": "OpenAI, işletmelere bireysel istemleri veya Business Agent sohbetleri de dâhil olmak üzere kullanıcı konuşmalarını vermediğini belirtiyor. Bazı istatistiklerin boş görünmesi de mutlaka sıfır etkinlik olduğu anlamına gelmez; veri eşiği, raporlama gecikmesi veya kullanılabilirlik koşulları etkili olabilir."
    },
    {
      "h": "Business Agent nedir, Türkiye'de kullanılabiliyor mu?"
    },
    {
      "p": "Business Agent, uygun işletmelerin ürünleri, hizmetleri ve politikaları hakkında müşterilerin soru sorabileceği, işletme adına çalışan yapay zekâ deneyimidir. İşletme kendi ürün ve politika bilgilerini sağlar, yönergeleri belirler, temsilciyi test eder ve yayımlamadan önce inceler."
    },
    {
      "p": "Business Agent, işletme profilinden ayrı ve isteğe bağlı bir özelliktir. OpenAI'nin güncel rehberine göre şu anda web sitesi bulunan, uygun e-ticaret ve çevrimiçi hizmet işletmeleri için ABD'de sunuluyor. Türkiye'deki işletmeler profil yönetimi için uygun olsa bile Business Agent özelliğine erişebilecekleri anlamına gelmez."
    },
    {
      "h": "Profil açmak ChatGPT önerilerinde üst sıraya çıkarır mı?"
    },
    {
      "p": "Hayır. İşletme profilini talep etmek, bilgilerinizi yönetmenizi ve bazı etkileşim verilerini görmenizi sağlar; ChatGPT'nin bağımsız önerilerini kontrol etmenizi sağlamaz. OpenAI, profil sahiplenmenin daha yüksek görünürlük veya satış garantisi vermediğini açıkça belirtiyor."
    },
    {
      "p": "İşletmelerin yapabileceği en yararlı çalışma, Business Hub profilini doğru tutmanın yanında kendi web sitelerindeki bilgileri de açık ve tutarlı hâle getirmek. Hizmet sayfaları, doğru iletişim bilgileri, güncel ürün ve politika açıklamaları, erişilebilir HTML ve uygun yapılandırılmış veriler bu temel çalışmanın parçalarıdır. Bunlar da tek başına ChatGPT'de görünme garantisi değildir."
    },
    {
      "h": "İşletmeler için sonuç"
    },
    {
      "p": "Businesses in ChatGPT, işletmelerin yapay zekâ üzerinden keşfedilme sürecinde daha doğru bilgi sunabilmesi için yeni bir yönetim kanalı açıyor. Şimdilik beta aşamasında; profil talebi, Persona doğrulaması ve Business Agent uygunluğu ayrı değerlendirilmelidir."
    },
    {
      "p": "En doğru yaklaşım, önce işletmenizin Business Hub'da bulunup bulunmadığını kontrol etmek, sunulan doğrulama seçeneklerini incelemek ve web sitenizdeki temel bilgileri güncel tutmaktır. Google İşletme Profili'ni kapatmak veya mevcut SEO çalışmalarını bırakmak için bir neden yok."
    },
    {
      "note": "**ai-ulu'da:** Web sitenizin arama motorları ve yapay zekâ asistanları tarafından doğru okunabilmesi için teknik yapı, içerik ve işletme bilgilerini birlikte değerlendirebiliriz. Belirli bir platformda görünürlük veya sıralama garantisi vermiyoruz."
    },
    {
      "h": "Resmî kaynaklar"
    },
    {
      "links": [
        {
          "label": "OpenAI: Introducing Businesses in ChatGPT (10 Kasım 2026)",
          "href": "https://openai.com/index/introducing-businesses-chatgpt/"
        },
        {
          "label": "OpenAI Help Center: Setting up your business on ChatGPT",
          "href": "https://help.openai.com/en/articles/20001635-setting-up-your-business-on-chatgpt"
        },
        {
          "label": "OpenAI: Businesses in ChatGPT Policy",
          "href": "https://openai.com/policies/businesses-in-chatgpt/"
        },
        {
          "label": "OpenAI: Business Agents Policy",
          "href": "https://openai.com/policies/business-agents-policy/"
        }
      ]
    }
  ],
  "cta": {
    "text": "Web sitenizin AI aramalarına uygunluğunu birlikte değerlendirelim →",
    "message": "Merhaba, web sitemin ChatGPT ve yapay zekâ aramalarındaki görünürlüğünü değerlendirmek istiyorum."
  }
}
];
