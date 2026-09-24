# Senior Academy — ürün, bundle ve kalite kapısı

Durum: satış hazırlığı. Bu belge ikas'ta yayımlanmış ürün, belirlenmiş fiyat veya tamamlanmış öğrenci erişimi iddiası değildir. 23 Eylül 2026'da ilk kaynak karşılaştırmasından sonra Frontend, Backend ve DevOps soru cevap sıralaması düzeltildi; DevSecOps ve System Design soru bankaları hâlâ kapalı kalite kapısında. Güncel ölçüm `ACADEMY-CONTENT-QUALITY.md` içindedir. Altı programın 15'er ders başlığı sitede gösteriliyor; başlık sayısı ders kalitesi kanıtı sayılmaz.

## Ürün mimarisi

Senior Academy **bilgi ve uygulama öğrenme ürünüdür**. Blueprint / Build / Verify müşteriye özel proje danışmanlığıdır; ders bundle'ına gizlenmez. Öğrenci için satın alma ikas'ta, öğrenme tarayıcıda, teknik kurulum gerektirmeden gerçekleşmelidir. `senioracademy.myikas.com` 23 Eylül'de anonim isteği ikas girişine yönlendirdiğinden ürün URL'leri henüz açılmaz.

### İlk tekil ürünler

| Taslak SKU | Görünen ad | Öğrenme çıktısı / örnek proje | Önerilen giriş | Yayın öncesi en büyük açık |
| --- | --- | --- | --- | --- |
| SA-FND-01 | Senior Foundations | Yazılım sistemi parçalarını açıklama / MiniShop Engineering Map | Başlangıç noktası; temel bilgisayar kullanımı | Ek modüller, örnekler ve değerlendirme bütünlüğü |
| SA-FE-01 | Senior Frontend | Erişilebilir ve test edilebilir arayüz / MiniShop Storefront | Foundations web, Git ve programlama kavramları veya eşdeğeri | Çalışan arayüz örneği, cihaz ve erişilebilirlik rubriği |
| SA-BE-01 | Senior Backend | Sözleşmesi ve veri bütünlüğü belli API / MiniShop Commerce API | Programlama, HTTP ve veri temeli | Cevap konumu düzeltildi; gerçek API/test ortamı ve konu uzmanı incelemesi |
| SA-DO-01 | Senior DevOps | Build'den geri almaya teslim hattı / MiniShop Delivery Platform | Uygulama ve temel Linux/ağ kavramları | Cevap konumu düzeltildi; tekrar üretilebilir yayın/geri alma kanıtı ve konu uzmanı incelemesi |
| SA-DS-01 | Senior DevSecOps | Tehdit ve güvenli teslim kararları / MiniShop Secure Delivery Platform | DevOps ve uygulama güvenliği temeli | 45 sorunun yalnız 27 farklı metni var; değerlendirme yeniden yazılmalı |
| SA-SD-01 | Senior System Design | Kısıttan mimari ve güvenilirlik kararına / MiniShop at Scale | İstemci/sunucu ve veri tabanı kavramları | 45 sorunun yalnız 3 farklı metni var; bütün soru bankası ve proje rubriği yeniden hazırlanmalı |

Önerilen girişler, katalogdaki resmî zorunlu önkoşul değil; satış sayfasında seviye değerlendirmesiyle doğrulanacak yönlendirmedir. “15 ders başlığı” kesin tamamlanma süresi veya kıdem garantisi değildir. AI Foundations ayrı uygulamadır; tekil ürün kararı için kendi içerik, soru ve erişim denetimi gerekir. Diller, ileri AI ve Quantum satışa hazır ürün sayılmaz.

### Sabit içerikli bundle'lar

| Taslak SKU | İçerik | Kime yarar | Açılma koşulu |
| --- | --- | --- | --- |
| SA-WEB-01 | Foundations + Frontend + Backend | Aynı örnek ürünün temel, arayüz ve API tarafını bağlamak isteyen öğrenci | Üçü tekil olarak kalite kapısından geçti; ortak MiniShop projesi ve tekrarlar temizlendi |
| SA-PROD-01 | System Design + DevOps + DevSecOps | Mimari, yayın ve güvenliği birlikte değerlendirmek isteyen deneyimli geliştirici | Üçü tekil olarak kalite kapısından geçti; ortak kabul rubriği oluşturuldu |

ikas Start'ta yerleşik dinamik paket özelliği varsayılmıyor. Bu bundle'lar ayrı basit dijital ürün/SKU taslaklarıdır. Bir SKU'nun birden çok eğitim yetkisine dönüşmesi **henüz uygulanmamıştır**. Öğrencinin önceden sahip olduğu kursu tekrar satın almaması için yükseltme/indirim kuralı, fiyat açıklanmadan önce kararlaştırılır.

Sitede bu iki taslak için ayrı `paket.html?paket=web` ve `paket.html?paket=production` tanıtım akışı bulunur. İçerdiği üç program, önerilen başlangıç seviyesi, ortak proje hedefi ve satış durumu gösterilir; program ayrıntıları da ilgili yola geri bağlanır. Tanıtım sayfasının varlığı ikas SKU'su, çalışan ortak laboratuvar veya satın alma hakkı oluşturmaz. AI Engineering yolu henüz ürün değildir; ayrı bundle ayrıntısı ve satış CTA'sı açılmaz.

## Plan/kademe seçenekleri

İlk açılışta tekil kurs ve iki sabit bundle yeterlidir. Erişim biçimi ve destek vaadi tüm ürünlerde aynı sözleşmeye dayanır. İkinci kademe, ancak gerçek kapasite ölçülünce açılır:

1. **Self-paced:** tarayıcı dersleri, çalışan örnek, kendi kendine kontrol ve açıklamalı geri bildirim. Fiyat, erişim süresi, güncelleme kapsamı ve destek sınırı ikas ürününde ayrı alanlar olarak yazılır.
2. **Practice review:** öğrenci projesine insan incelemesi, teslim sayısı ve dönüş süresi sözleşmeyle sınırlı. Gerçek inceleme kapasitesi ve iş akışı doğrulanmadan satışa açılmaz.
3. **Cohort / canlı çalışma:** takvim ve eğitmen kapasitesiyle sınırlı dönemsel seçenek. Tarih, kontenjan ve kayıt akışı gerçekten kurulmadan vaat edilmez.

Müşterinin kendi projesi için fikir doğrulama, mimari plan ve AI ajanı görev sözleşmesi istemesi **Engineering System danışmanlığına** yönlendirilir; kurs inceleme hakkı gibi paketlenmez.

## Ortak ürün sayfası ve kapak standardı

Her ikas ürününde: kimler için; önerilen bilgi seviyesi; bu eğitimin sonunda üretilecek somut teslim; 15 başlığın öğrenme hedefleri; çalışma ve değerlendirme biçimi; ücretsiz örnek; erişim başlangıcı/süresi; güncelleme; destek; iade koşulu; bundle içeriği ve sahip olunan ürünle yükseltme kuralı açık olmalı. Ölçülmemiş toplam saat, sertifika veya işe yerleşme sözü verilmez.

Kapak sistemi tek marka taşır: **SENIOR ACADEMY** üst işareti, iki harfli alan kodu, tam program adı ve **ALI ULU** imzası. Site kataloğu ile program sayfası aynı şablonu kullanır. Alan rengi: Foundations yeşil, Frontend açık mavi, Backend turkuaz, DevOps sıcak turuncu, DevSecOps pembe-kırmızı, System Design mor. Renk yalnız başına anlam taşımaz; program adı ve kodu da okunur. Bundle kapağı içerdiği programları adlarıyla listeler, yeni bir marka logosu yaratmaz. Görsel dilin ikas ürün görseline dışa aktarımı ayrıca hazırlanacak.

## Satışa açma sırası ve kanıt

1. **İçerik:** her derste hedef → açıklama → çalışan örnek/karar → uygulama → açıklamalı ölçme bağlantısı. Sistem Design ve DevSecOps soru bankaları ilk revizyon kapısı. Doğru cevap dizisi ezberlenemeyecek şekilde seçenek kimlikleri ve açıklamalarıyla doğrulanır.
2. **Öğrenci:** ilk üründe hesap açma, ikinci cihaz, ilerleme, erişim süresi ve destek akışı tarayıcıda denenir; yerel ZIP, terminal veya sunucu kurulumu gerektirilmez.
3. **Mağaza:** anonim ziyaretçi gerçek ürün sayfasını açar; ödeme, başarısız ödeme, tekrar bildirim, bundle yetkisi, iade ve yanlış e-posta senaryoları test edilir. Ürün URL'si ancak sonra sitedeki `store-links.js` dosyasına girer.
4. **Pilot:** en az bir gerçek öğrenciyle görev tamamlama, süre, takılma noktaları ve geri bildirim ölçülür. Pilot sonrası ürün metni ve destek sınırları güncellenir.

Bu sıra hiçbir kursun aynı anda satışa çıkmasını zorunlu kılmaz. İlk kalite kapısını geçen ürün tekil açılır; bundle yalnız tüm üyeleri hazır olduğunda açılır.
