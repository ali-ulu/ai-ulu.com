# Site incelemesi ve düzeltmeler

## Sonuç

Önceki çalışma, hedef müşteriye ne satıldığını anlatmak yerine iç planlama notlarını sergiliyordu.
Bağlantı testlerinin geçmesi, bu sunumun anlaşılır veya ikna edici olduğunu kanıtlamıyordu.

| Kusur | Etkisi | Düzeltme |
| --- | --- | --- |
| Soyut ana başlık, tekrarlanan hizmet anlatımı | İlk ekranda müşteri ihtiyacı ve çıktı belirsizdi | Proje hazırlama ana teklif oldu; örnek dosya ve çalışma bağlantıları öne alındı |
| Süreç adımlarına paket denmesi | Müşteri hangi kapsamı seçeceğini göremiyordu | Dört paket: hazırlama, hazırlama + kontrol, hazırlama + geliştirme, mevcut proje incelemesi; her birinde hedef kişi, teslim ve sorumluluk |
| Kendi işinin kontrolüne bağımsız inceleme denmesi | Denetimin bağımsızlığı hakkında yanıltıcı izlenim | Teknik kontrol olarak düzeltildi; geliştirme ve kontrol sınırı açıklandı |
| İngilizce kaynak kataloğun doğrudan gösterilmesi | Kamuya açık sayfalarda dil bütünlüğü bozuldu | 6 programın adı, özeti ve 90 ders başlığı Türkçeleştirildi; kaynak eğitimler değiştirilmedi |
| İç çalışma notlarının satış metnine taşınması | Ürün anlatımı yerine geliştirme günlüğü oluştu | Hazırlanıyor ve satışa açık değil bilgileri korundu; teknik iç notlar kaldırıldı |
| Boş danışmanlık ilk ekranı | Hizmetin teslimi görünmüyordu | Temsili proje dosyası, kapsam, görev ve kabul bölümleriyle ilk ekrana taşındı |
| E-posta taslağının gönderim formu gibi sunulması | Talebin gönderildiği sanılabilirdi | Doğrudan e-posta bağlantısı, açık taslak düğmesi ve henüz gönderilmedi durumu |
| Başlığa göre hizmet yönlendirme | Metin değişikliği form seçimini bozabiliyordu | Sabit hizmet kimlikleri ve danışmanlık kartlarında doğrudan bağlantılar |
| Danışmanlık yönteminin portföy projesi gibi gösterilmesi | Hizmet ile çalışma örneği karışıyordu | Yöntem portföy vakalarından çıkarıldı; örnek dosya danışmanlıkta yer alıyor |
| Hareketin yalnızca kapalı durumda test edilmesi | Kaydırma sırasındaki kırılmalar görülmüyordu | Hareket açık/azaltılmış ekran kontrolleri ve JavaScript kapalı danışmanlık kontrolü eklendi |

## Tasarım kararı

Sıra: proje hazırlama, web geliştirme, Senior Academy, portföy.
Ana sayfada mevcut portre; danışmanlıkta katmanlı temsili proje dosyası.
Kaydırma, dosyanın ve çalışma örneklerinin ortaya çıkmasını destekler.
Mobilde içerik tek sütundur; ana eylemler ilk ekranda okunur.
Temel mesajlar ve danışmanlık paket bağlantıları JavaScript'e bağlı değildir.

## Tamamlanmış sayılmayanlar

- Dönüşüm oranı için kullanıcı veya trafik ölçümü yapılmadı; artış iddiası yok.
- Görüşme talebi e-postayla ilerler. Sunucu üzerinden gönderim ve takvim rezervasyonu yok.
- Eğitimlerin satış ve öğrenci erişim altyapısı henüz hazır değil; satış düğmeleri kapalıdır.
- Bu tur, eğitim içeriklerinin pedagojik kalite incelemesi değildir.
- Sinematik video hazırlanmadı; mevcut görseller ve kaydırma motoru kullanıldı.
- Web geliştirme, eğitim ve portföy sayfalarında dil düzeltildi; bu sayfaların ayrıntılı tasarım çalışması sonraki aşamadır.

## Doğrulama

`node verify-browser.cjs`: masaüstü/mobil görünüm, dört paket yönlendirmesi,
geçersiz hizmet kimliği, 6 program/90 başlık, örnek ders, e-posta taslağı,
hareket açık kaydırma ve JavaScript kapalı danışmanlık bağlantıları.
Ekran çıktıları yerel `lab/` klasöründedir; Git'e eklenmez.

Son çalıştırma: geçti (24 Eylül 2026). JavaScript sözdizimi kontrolleri ve
`git diff --check` geçti. İlk ekran, paket kartları ve kaydırma ortası görüntüleri
masaüstü ve mobilde ayrıca görsel olarak incelendi.
