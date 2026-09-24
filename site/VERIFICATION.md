# Site önizlemesi doğrulaması — 23 Eylül 2026

Kapsam: Ali Ulu kişisel sitesi, proje danışmanlığı, web geliştirme, portföy, Senior Academy kataloğu, altı program ayrıntısı, ücretsiz örnek ders ve örnek proje dosyası.

## Kaynak doğruluğu

- Danışmanlık aşamaları mevcut Engineering System kaynağındaki Blueprint / Build / Verify / Launch modelinden alınır. Kamuya dönük başlık “Proje danışmanlığı” olarak sadeleştirilir.
- Web sitesi kapsamları kaynak Service Delivery Standard'daki dört kapsam ailesiyle uyumludur. Yerel mobil uygulama vaat edilmez.
- Akademi kataloğu yerel `catalog-v33.js` içindeki altı mevcut programdan üretildi: her birinde 15 ders başlığı, toplam 90. Bunların satışa hazır olduğu iddia edilmez.
- Lead Hunter ve Scroll Craft kamuya açık vaka veya hizmet kartı olarak gösterilmez. HUQAN yalnızca portföy örneğidir; görseli gerçek ürün ekranı değil, kavramsal illüstrasyon diye etiketlenir.
- ikas mağazası boş olduğundan `store-links.js` içindeki satış bağlantıları `null`. Gerçek ürün ve ödeme sonrası erişim doğrulanmadan link açılmaz.

## Çalıştırılan kontroller

- `node verify-browser.cjs`: Chrome'da 1440×900 ve 390×844. İlk ekranda CTA görünür, yatay taşma ve JavaScript hatası yok, ana görseller yükleniyor. Mobil proje dosyası viewport içinde. Akademi altı program / 90 başlık; Web filtresi iki program gösteriyor. Altı program ayrıntısının her birinde 15 başlık ve kapalı satış durumu var. Danışmanlık, web geliştirme, portföy, hakkımda, örnek ders ve örnek proje rotaları HTTP 200. Form geçerli verilerle e-posta uygulamasını açacağı mesajını gösteriyor.
- Scroll Craft `shoot.mjs`: ana sayfa masaüstü, mobil ve reduced-motion geçişleri incelendi. Hareket tercihinde dead-scroll raporlanmadı. İlk masaüstü çekiminde favicon 404 bulundu; SVG favicon eklenip sonraki reduced-motion çekiminde konsol hatası görülmedi.
- `node --check` yeni JavaScript dosyalarında ve `git diff --check` değişikliklerde çalıştırıldı.

## Henüz doğrulanmamış / yapılmamış

- E-posta uygulamasının açılması gerçek e-posta teslimi veya takvim rezervasyonu değildir. Form yalnız talep e-postası hazırlar.
- ikas ürünü, ödeme, öğrenci yetkisi, giriş, ilerleme kaydı ve tarayıcı laboratuvarı çalışır durumda değildir. Bu nedenle ücretli eğitim satışa kapalıdır.
- Eğitim içeriklerinin pedagojik ve teknik kalite revizyonu tamamlanmadı; özellikle System Design ve DevSecOps soru bankaları mevcut inceleme planında öncelikli.
- Gerçek telefon cihazı, canlı alan adı `ai-ulu.com`, İngilizce eşdeğer sayfalar ve uçtan uca müşteri başvuru backend'i bu turda doğrulanmadı.
- Owner-only Sites önizlemesi dış ziyaretçiye açık değildir. Yayın sonrası sürüm SHA'sı ve erişim ayrıca kaydedilir.

## 23 Eylül 2026 ek kontrolü

- Danışmanlık modülleri ve üç birleşik kapsam ile web sitesi paketlerinden görüşme formuna geçiş artık ilgili hizmeti seçili getiriyor. Bilinmeyen `service` sorgu değerleri seçim yapmıyor.
- `node verify-browser.cjs` tekrar çalıştırıldı: önceki masaüstü/mobil ana sayfa ve 90 başlık kontrollerine ek olarak danışmanlık/web paket CTA'ları, Blueprint + Verify seçimi, Verify seçimi ve mobil yatay taşma kontrolü geçti.
- Kullanıcının verdiği `https://senioracademy.myikas.com/` adresi anonim HTTP `HEAD` isteğinde `307` ile `https://accounts.ikas.com` sayfasına yöneldi. Bu nedenle mağaza veya ürün bağlantısı kamuya açık CTA'ya eklenmedi. Ayrıntılı yayın kapısı `IKAS-STOREFRONT-GATE.md` içinde.
- Görüşme formu hâlâ yalnız e-posta taslağı hazırlar; bu çalışma randevu altyapısı veya e-posta teslimi kurmaz.

## 23 Eylül 2026 iletişim ve Academy ürün kararı

- Kullanıcı `aliulu@ai-ulu.com` adresinin çalıştığını doğruladı. Formun altında bu adres doğrudan iletişim yolu olarak gösterildi; gerçek bir başvuru backend'i veya takvim rezervasyonu kurulduğu iddia edilmiyor.
- `ACADEMY-PRODUCT-PLAN.md` altı tekil program, iki sabit bundle, üç olası destek kademesi, ortak kapak dili ve kurs/öğrenci/ikas kalite kapılarını ayırıyor. Kaynak kursların beş uzmanlık `content.js` hash'i önceki içerik incelemesiyle tekrar karşılaştırıldı; değişmemiş.
- Senior Academy kapakları aynı tipografik şablonda altı ayrı alan rengi kullanıyor. Koyu zemin üzerindeki vurgu renklerinin hesaplanan kontrast oranı 9.15:1–11.47:1; Playwright altı renk ve program sayfası eşleşmesini doğruladı.
- Ücretsiz System Design örnek dersine tarayıcı içi alıştırma eklendi. Yanıtlar yalnız localStorage'da saklanır; otomatik puanlama, sunucuya gönderim veya cihazlar arası eşitleme iddiası yoktur. Playwright kayıt, yeniden yükleme, silme, rubrik görünürlüğü, mobil yatay taşma ve ağ üzerinden POST yapılmamasını doğruladı.

## 23 Eylül 2026 portföy genişletmesi

- LEVH, açık `ali-ulu/levh` deposu ve yerel README ile doğrulanıp dördüncü portföy vakası olarak eklendi. Ekran görüntüsü eski portföydeki demo varlığıdır; örnek veriler ve olası sürüm farkı görsel altında açıkça belirtilir. LEVH veya HUQAN müşteri referansı olarak sunulmaz.
- Ana sayfanın kanıt bölümü yalnız HUQAN'ı öne çıkarmak yerine LEVH, HUQAN ve Senior Academy çalışmalarını ayırıyor. Scroll Craft ve Lead Hunter iç araç olarak kalıyor.
- `node verify-browser.cjs` tekrar geçti: 1440×900 ve 390×844 ana sayfa, dört portföy vakası, LEVH görselinin yüklenmesi, mobil portföyde yatay taşma olmaması, mevcut Academy ve görüşme akışları.

## 23 Eylül 2026 Academy bundle akışı

- Web üretim ve Production yolları için ayrı `paket.html` ayrıntıları eklendi. İlgili üç program, hedeflenen uygulama, önerilen başlangıç ve kapalı satış durumu gösteriliyor. AI Engineering taslak olarak kalıyor; satın alma bağlantısı yok.
- `node verify-browser.cjs` Chrome'da iki bundle sayfasını ve her birindeki üç program bağlantısını, altı tekil programdan doğru bundle'a geçişi, kapalı ikas durumunu ve 390 px görünümde yatay taşma olmamasını doğruladı.
- Bundle sayfaları içerik teslimi veya ödeme erişimi sağlamaz. Öğrenci laboratuvarı, ikas SKU'ları, yetki ve ödeme sonrası erişim doğrulanmadan satışa açılmayacak.

## 23 Eylül 2026 kaynak eğitim denetimi

- `audit-academy-content.mjs` beş uzmanlık programının bağımsız ve Foundations eş kopyalarını okur. İlk ölçümde Frontend 29/15/1/0, Backend 44/1/0/0, DevOps 42/3/0/0 cevap dağılımı; DevSecOps'ta 27, System Design'da 3 benzersiz soru kökü bulundu.
- Frontend, Backend ve DevOps kaynaklarında 45'er sorunun doğru seçenek konumu 12/11/11/11 dağılımına getirildi. `verify-academy-rebalance.mjs` önceki dosyalarla 135 iki dilli sorunun soru metni, seçenek kümesi, açıklama ve doğru cevap metnini karşılaştırıp korunduğunu doğruladı. Her programın iki kaynak kopyası eş.
- Güncel yapısal denetim Frontend, Backend ve DevOps için geçti; DevSecOps ve System Design için **bilerek hata kodu 1** ile kaldı. Bu, satış kapısını açık bırakmaz. Konu uzmanı incelemesi, uygulama ve öğrenci erişimi ayrıca gereklidir; ayrıntı `ACADEMY-CONTENT-QUALITY.md` içinde.
