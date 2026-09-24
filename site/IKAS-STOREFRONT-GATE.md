# Senior Academy — ikas mağazası yayın kapısı

Kullanıcının verdiği mağaza adresi: `https://senioracademy.myikas.com/`.

23 Eylül 2026 tarihinde anonim `HEAD` isteği `307 Temporary Redirect` ile `https://accounts.ikas.com` adresine gitti. Bu, alan adının DNS'te var olduğunu gösterir; fakat ziyaretçinin halka açık ürün kataloğuna veya ödeme sayfasına ulaştığını kanıtlamaz. Kullanıcı mağazada henüz ürün bulunmadığını daha önce bildirdi. Site bu nedenle hiçbir programı satışta göstermiyor ve ürün bağlantılarını `null` tutuyor.

Bir eğitimin ikas bağlantısı açılmadan önce:

1. Ürün içeriği ve değerlendirmesi kalite kapısından geçmeli.
2. İkas'ta gerçek ürün/SKU, fiyat, erişim ve destek koşulları yayımlanmalı.
3. Ürün URL'si oturum açmamış tarayıcıda doğrudan doğru ürünü açmalı.
4. Ödeme sonrası öğrenci erişimi ve iade/iptal davranışı gerçek test siparişiyle doğrulanmalı.
5. `dist/store-links.js` içindeki ilgili bağlantı ancak bu kanıtlardan sonra HTTPS ürün URL'siyle doldurulmalı.

Start planında yerleşik dinamik bundle varmış gibi davranılmıyor. Sabit içerikli bundle ayrı SKU olabilir; otomatik ders yetkisi entegrasyonu henüz doğrulanmadı. Mağaza ana sayfası ürün yerine ikas girişine gittiği sürece eğitim CTA'sı ona yönlendirilmez.
