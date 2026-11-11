# Müşteri Sitesi Kurulum Prompt'u (ai-ulu)

Kullanım: GİRDİLER bölümünü doldur, tasarımı ekle, tamamını ajana ver. Doldurmadığın
alanı silme; ajan eksikleri oradan görüp soracak.

---

## GÖREV

Bir işletme için yayına hazır bir web sitesi kuracaksın. Tasarım hazır veriliyor; senin
işin onu eksiksiz, hızlı, erişilebilir, bulunabilir ve müşteri getiren bir siteye çevirmek.

Bu site bir ajansın (ai-ulu) müşterisine teslim edilecek. İşletme sahibi teknik değil;
hatayı o değil, onun müşterisi görür: yanlış telefon numarası, açılmayan sayfa, bozuk
Türkçe karakter, çalışmayan form. Bunların her biri işletmeye müşteri, ajansa itibar
kaybettirir. Bu yüzden "çalışıyor gibi görünüyor" yeterli değil; her iddianı ölçerek
kanıtlayacaksın.

Ziyaretçiyi şöyle düşün: telefonda, mobil internette, acelesi var, işletmeyi tanımıyor.
Otuz saniye içinde üç şeyi anlamalı: bu işletme ne yapıyor, güvenilir mi, nasıl ulaşırım.

## GİRDİLER

### İŞLETME
- Ad (tabelada yazdığı gibi):
- Sektör / tam olarak ne yapıyor:
- Hizmet bölgesi (şehir, ilçeler):
- Adres:
- Telefon:            WhatsApp:
- E-posta:
- Çalışma saatleri:
- Google İşletme Profili linki:
- Sosyal hesaplar:
- Şirket türü ve yasal bilgiler (unvan, MERSİS/vergi no — varsa):

### HEDEF
- Ziyaretçiden istenen tek eylem (ara / WhatsApp / form / randevu):
- En çok satmak istediği 3 hizmet:
- Müşterilerin en sık sorduğu sorular:
- Rakiplerden farkı (kanıtıyla):

### İÇERİK
- Metinler: (hazır / ajan yazacak — hangi kaynaklardan)
- Fotoğraflar: (klasör yolu; lisans/kaynak)
- Müşteri yorumları: (gerçek, kaynağıyla; yoksa "yok")
- Fiyatlar: (gösterilecek mi, KDV dahil mi)

### TASARIM
- Kaynak: (Figma linki / dosyalar / ekran görüntüleri)
- Kapsadığı ekranlar: (masaüstü / mobil / hangi sayfalar)

### TEKNİK
- Altyapı: (boşsa varsayılan: statik HTML/CSS, en az JavaScript, Cloudflare)
- Alan adı:            Eski site var mı (adresi):
- Diller:
- Form gönderimleri nereye gidecek:
- İstenen ölçüm aracı:

## ÇALIŞMA SIRASI

1. **Oku, sonra sor.** Tüm girdileri ve tasarımı baştan sona incele. Eksik ya da çelişen
   her şeyi tek listede topla ve bir kerede sor. Tasarımda görmediğin durumları da sor:
   mobil görünüm, menünün açık hâli, formun hata ve başarı durumu, 404 sayfası, uzun
   metinle taşma. Cevap beklerken eksikten etkilenmeyen işlere devam et.

2. **Kısa plan.** Sayfa listesi, her sayfanın tek amacı, URL yapısı. Yarım sayfayı
   geçmesin. Onay bekleme; itiraz gelirse düzeltirsin.

3. **Kur.** Aşağıdaki kurallarla.

4. **Doğrula.** "DOĞRULAMA" bölümündeki her maddeyi gerçekten çalıştır.

5. **Teslim raporu.** "TESLİM" bölümündeki biçimde.

## ASLA UYDURMA

Bu bölüm diğerlerinin önündedir, çünkü buradaki hata müşteriyi doğrudan zora sokar.

- Sana verilmeyen hiçbir gerçeği yazma: telefon, adres, fiyat, çalışma saati, kuruluş
  yılı, müşteri sayısı, sertifika, ödül, yorum, ekip üyesi, istatistik.
- Eksik bilgi yerine tam olarak şu işareti koy: `[EKSİK: ne gerektiği]`. Tahmin, örnek
  değer ya da "Lorem ipsum" koyma. Yayın öncesi kontrolün bu işareti arayacak ve bir
  tane bile varsa site yayına çıkmayacak.
- Sahte müşteri yorumu, sahte logo duvarı, "500+ mutlu müşteri" gibi kaynaksız sayılar
  yok. Yorum yoksa o bölümü kaldır ve raporda belirt.
- Yalnızca müşterinin verdiği ya da lisansı açık görselleri kullan. Her görselin
  kaynağını bir dosyada kaydet. Başka sitelerden görsel alma.
- Sektörün tanıtım kuralı olabilecek durumlarda (sağlık, hukuk, finans, gıda/takviye)
  iddialı ifade yazma: "garantili", "en iyi", "kesin sonuç", önce/sonra görselleri.
  Şüpheli gördüğün her ifadeyi raporda "hukuki kontrol gerekli" başlığına yaz; kararı
  sen verme.

## TASARIMA SADAKAT

- Tasarım doğrunun kaynağıdır. Renk, tipografi, boşluk, hizalama ve bileşen davranışını
  olduğu gibi uygula; "iyileştirme" yapma.
- Önce tasarımdan değerleri çıkar (renkler, yazı boyutları, boşluk ölçeği, köşe
  yarıçapı) ve tek yerde tanımla. Sayfalara elle değer yazma.
- Tasarım bir kuralı çiğniyorsa (kontrast yetersiz, dokunma alanı küçük, metin görselin
  içinde) sessizce değiştirme ve sessizce uygulama da. En küçük düzeltmeyi öner, raporda
  göster.
- Tasarımda olmayan ekran genişliklerini tasarımın mantığından türet, 360 / 768 / 1280 /
  1920 pikselde kontrol et. Yatay kaydırma hiçbir genişlikte olmamalı.
- Gerçek içerikle dene: en uzun hizmet adı, en uzun işletme adı, iki satıra taşan başlık.

## TÜRKÇE

- `<html lang="tr">`. Bu olmadan büyük harfe çevirme i → I yapar ve "İLETİŞİM" yerine
  "ILETIŞIM" çıkar.
- Yazı tipleri ğ, ş, ı, İ, ö, ü, ç harflerini içermeli (latin-ext). Eksikse harf başka
  fontla görünür; her yazı tipinde "ığüşöç İĞÜŞÖÇ" yazıp gözle kontrol et.
- Telefon görünen hâli `0 (5xx) xxx xx xx` ya da `+90 5xx xxx xx xx`; link hâli
  `tel:+905xxxxxxxxx`. WhatsApp: `https://wa.me/905xxxxxxxxx?text=...` (sayfaya uygun
  hazır mesajla).
- Fiyatlarda ₺ ve KDV durumu. Tarihler `11 Kasım 2026` biçiminde.
- Metin yazacaksan: kısa cümle, somut bilgi, işletmenin kendi ağzından. "Kalite bizim
  işimiz", "müşteri memnuniyeti önceliğimiz", "yenilikçi çözümler" gibi her sitede geçen
  cümleleri yazma. Her başlık ziyaretçiye bir bilgi vermeli. Yazım ve noktalama hatasız
  olmalı; bitince tüm metni baştan sona bir kez oku.

## MÜŞTERİ GETİRME

- İlk ekranda (kaydırmadan, telefonda): ne iş yapıldığı, nerede, ve ana eylem butonu.
- Telefonda ekranın altında sabit duran Ara ve WhatsApp butonları; içeriği ve çerez
  bildirimini kapatmamalı.
- Her sayfada ana eyleme en fazla bir dokunuşla ulaşılmalı.
- Form: yalnızca gerçekten gereken alanlar. Doğru klavye türü (`type="tel"`, `inputmode`),
  autocomplete, alanın yanında anlaşılır hata mesajı, gönderim sırasında butonun
  kilitlenmesi, başarıda net onay ve "ne zaman dönülecek" bilgisi, başarısızlıkta telefon
  numarası.
- Form sunucu tarafında da doğrulanmalı, spam koruması olmalı (görünmez tuzak alan +
  istek sınırı; kullanıcıyı bulmaca çözmeye zorlama) ve gönderim işletmeye gerçekten
  ulaşmalı.
- Güven: gerçek fotoğraf, gerçek yorum (kaynağıyla), açık adres, harita. Haritayı
  gömme; hafif bir görsel + "Yol tarifi al" linki kullan.

## HIZ

Hedef, orta seviye bir telefonda mobil bağlantıyla: LCP ≤ 2,5 sn, CLS ≤ 0,1,
INP ≤ 200 ms. Lighthouse mobil Performans ≥ 95.

- Görseller: AVIF/WebP, `srcset` ile doğru boyut, `width`/`height` tanımlı. İlk ekrandaki
  ana görsel öncelikli yüklenir (`fetchpriority="high"`), `loading="lazy"` almaz; ekran
  dışındakilerin hepsi alır.
- Yazı tipleri: kendi sunucundan, woff2, alt küme, `font-display: swap`, en fazla 2 aile.
- JavaScript: sayfa JavaScript olmadan okunabilir olmalı. Kütüphane eklemeden önce
  tarayıcının kendi özelliğiyle yapılabiliyor mu bak (`<details>`, `<dialog>`, CSS
  kaydırma). Eklediğin her bağımlılığı raporda gerekçesiyle yaz.
- Üçüncü taraf kod (sohbet kutusu, video, harita, piksel) onaysız eklenmez; onaylıysa
  etkileşime kadar yüklenmez.
- Animasyon yalnızca `transform` ve `opacity` ile; `prefers-reduced-motion` açıkken kapalı.

## ERİŞİLEBİLİRLİK (WCAG 2.2 AA)

- Anlamlı HTML: tek h1, sıralı başlıklar, nav/main/footer, gerçek `button` ve `a`.
- Klavyeyle her şeye ulaşılır, odak her zaman görünür, açılan menü ve pencere odağı
  tutar ve Esc ile kapanır.
- Metin kontrastı en az 4,5:1 (büyük metinde 3:1). Dokunma alanı en az 44×44 piksel.
- Her form alanının etiketi var; hata mesajı alanla ilişkilendirilmiş. Bilgi veren
  görselde anlamlı `alt`, süs görselinde boş `alt`.
- Sayfa %200 yakınlaştırmada kullanılabilir kalmalı.
- Lighthouse erişilebilirlik puanı 100 olsa bile klavyeyle baştan sona bir tur at;
  otomatik araç sorunların yalnızca bir kısmını yakalar.

## BULUNABİLİRLİK

- Her sayfada benzersiz `title` (yaklaşık 60 karakter, "hizmet + bölge + işletme") ve
  açıklama (yaklaşık 155 karakter), `canonical`, Open Graph etiketleri ve 1200×630
  paylaşım görseli.
- Okunabilir, Türkçe karaktersiz URL'ler (`/hizmetler/mantolama/`).
- `sitemap.xml`, `robots.txt`, favicon seti, özel 404 sayfası (ana sayfaya ve iletişime
  linkli).
- Yapılandırılmış veri: sektöre uyan en dar LocalBusiness türü; ad, adres, telefon,
  saatler, bölge. Değerler sitedeki görünen metinle ve Google İşletme Profili'yle harfi
  harfine aynı olmalı. FAQPage yalnızca sayfada görünen sorular için. Puan/yorum
  işaretlemesi yalnızca sayfada gerçek yorum varsa.
- Yapay zekâ asistanları için: içerik düz HTML'de, `robots.txt` asistan tarayıcılarına
  açık, kökte kısa bir `llms.txt`.
- Eski site varsa: yayından önce eski sitenin tüm URL'lerini çıkar ve her birini yeni
  karşılığına 301 ile yönlendir. Bu atlanırsa işletme mevcut Google sıralamasını
  kaybeder.
- Birden çok dil varsa `hreflang` ve dil başına ayrı URL.
- Sıralama vaat eden hiçbir ifade yazma.

## GÜVENLİK VE YASAL

- HTTPS zorunlu; `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options`, `Referrer-Policy` başlıkları. Depoda gizli anahtar yok.
- KVKK: form varsa aydınlatma metni sayfası ve formun altında ona link. Pazarlama iletisi
  izni isteniyorsa ayrı, işaretsiz gelen bir onay kutusu.
- Ölçüm: varsayılan olarak çerezsiz bir araç; böylece çerez bildirimi gerekmez. Çerez
  kullanan araç (GA, Meta piksel) isteniyorsa onay alınmadan yüklenmez. Ara, WhatsApp ve
  form gönderimi olay olarak ölçülür.
- Yasal metinleri sen uydurma; müşterinin verdiğini kullan ya da `[EKSİK]` işaretle.
  Şirketlerin sitede bulundurması gereken bilgiler konusunda emin değilsen raporda sor.

## DOĞRULAMA

Aşağıdakileri çalıştır ve sonuçları sayılarıyla raporla. Çalıştıramadığın maddeyi
"çalıştırılamadı, nedeni" diye yaz; geçti sayma.

- Lighthouse, mobil profil, her sayfa şablonu için: Performans ≥ 95, Erişilebilirlik 100,
  En İyi Uygulamalar 100, SEO 100. Altında kalan her puanın somut nedenini ve çözüm için
  neyin gerektiğini yaz. Puanı tutturmak için içeriği araçtan gizlemek ya da ziyaretçiye
  farklı sayfa göstermek yasak.
- Otomatik erişilebilirlik taraması (axe ya da eşdeğeri): sıfır ihlal. Ardından klavye
  turu.
- HTML doğrulama: hata yok.
- Bağlantı taraması: site içi ve dışı kırık link yok; her `tel:`, `mailto:`, `wa.me`
  linki girdilerdeki numarayla karakter karakter aynı.
- `[EKSİK`, lorem, TODO, example.com, placeholder aramaları: sıfır sonuç.
- 360 / 768 / 1280 / 1920 pikselde ekran görüntüsü; taşma ve yatay kaydırma yok.
- Form: gerçek bir gönderim yap; işletmeye ulaştığını, hatalı girişin reddedildiğini ve
  spam korumasının çalıştığını göster.
- Yapılandırılmış veri doğrulayıcısı: hata yok.
- JavaScript kapalıyken içerik okunuyor.
- Tarayıcı konsolunda hata yok.
- Eski site varsa: yönlendirme listesindeki her URL 301 ile doğru sayfaya gidiyor.
- Tüm görünen metni bir kez baştan sona oku: yazım, karakter, işletme adının her yerde
  aynı yazılması.

## TESLİM

Raporu şu sırayla ver, kısa tut:

1. **Durum:** yayına hazır / hazır değil (neden).
2. **Ölçümler:** doğrulama maddeleri, sayılarla tek tablo.
3. **Müşteriden beklenenler:** kalan her `[EKSİK]`, kimin vereceği.
4. **Tasarımdan sapmalar:** ne, neden, önce/sonra.
5. **Hukuki kontrol gerekli:** şüpheli ifade ve bölümler.
6. **Yayın sonrası yapılacaklar:** Search Console'a site haritası, Google İşletme
   Profili'ne site adresi, alan adı ve tüm hesapların müşteri adına olduğunun teyidi.
7. **İçerik nasıl güncellenir:** teknik olmayan biri için 5 maddeyi geçmeyen not.

Bitirmeden önce kendine sor: bu işletmenin sahibi siteyi telefonunda açıp kendi
müşterisine gösterse, utanacağı bir şey var mı? Varsa bitmemiştir.
