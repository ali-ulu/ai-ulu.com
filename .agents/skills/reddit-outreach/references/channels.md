# Kanallar — nerede aranır, ne çalışır

Bu dosya **ölçülmüş** durumları içerir (2026-11-11, bu ortamdan test edildi).
Bir kanal "kapalı" diye yazıyorsa, önce yeniden test et — durum değişebilir.

## Öncelik sırası (ai-ulu için)

TR pazarına hitap ettiğimiz için TR kanalları önce gelir. Reddit TR pazarında zayıf;
İngilizce müşteri ya da yurtdışı Türkler için anlamlı.

## 1. Ekşi Sözlük — birincil kanal

- **Neden:** TR'de en büyük sözlük. "web sitesi yaptırmak", "site yaptıracak yer",
  "fiyat aldım" gibi başlıklarda gerçek insanlar deneyim/fiyat konuşuyor.
- **Erişim:** Çalışıyor, ama **gerçek tarayıcı User-Agent zorunlu** (varsayılan curl UA
  → 403). Kalıp `references/access.md`'de.
- **Arama:** `https://eksisozluk.com/?q=<kelime>` **302 yönlendirir**; `curl -L` ile takip
  et. Sonuç sayfası başlık linkleri (`href="/<slug>--<id>"`) döner.
- **Başlık okuma:** `https://eksisozluk.com/<slug>--<id>` → içerik `<div class="content">`
  bloklarında (test edildi: 10 blok döndü).
- **Dikkat:** Ekşi'de reklam/link paylaşmak yazarlık kurallarına takılır ve linç edilir.
  Ekşi'de **saf yardım** modunda kal, ürün adı geçirme. Değerli olan başlığı bulup
  kullanıcıya göstermek; cevap yazmak genelde uygun değil.
- **Verim — gerçekçi ol:** Ekşi bir *sözlük*, ilan panosu değil. Başlıklar kalıcı,
  entry'ler yorum. Güncel "satın alma niyeti" akışı yok. Ölçülen örnek:
  "web sitesi yaptırmak" → 1 başlık, "web sitesi fiyatları" → 0, "site yaptıracak yer"
  → 0. Yani Ekşi **düşük hacimli** bir kanal: ayda birkaç anlamlı başlık çıkar, hazır
  bir lead listesi değil. Fiyat/tasarım tartışan başlıklar (`web-sitesi-tasarimi-icin-50-bin-lira-istemek--7083276`
  gibi) pazar zekâsı için değerli, ama müşteri adayı için zayıf.

## 2. Uludağ Sözlük

- **Erişim:** Çalışıyor (200, içerik var). Gerçek UA kullan.
- **Arama:** `https://www.uludagsozluk.com/?q=<kelime>` → 200, başlık linkleri
  `href="https://www.uludagsozluk.com/k/<slug>"`.
- Ekşi'ye göre daha küçük; ikincil kanal.

## 3. DonanımHaber Forumu

- **Erişim:** Ana sayfa 200 (153 KB). **Arama sayfası 404 döndü** — arama yolu
  doğrulanmadı. Genel arama motoru üzerinden bulunamıyorsa atla.
- Teknoloji/İşletme bölümlerinde "site kurmak" başlıkları olabilir ama doğrulanmadı.

## 4. Reddit

- **Erişim (HTML/JSON):** **403 — kapalı.** `www.`, `old.`, `api.`, `oauth.` ve `.rss`
  hepsi 403. Gerçek tarayıcı (Playwright, gerçek UA) ile de 403. Bot koruması.
- **Erişim (OAuth API):** **Açık.** `https://www.reddit.com/api/v1/access_token`
  kimliksiz çağrıda düzgün JSON döndü: `{"message":"Unauthorized","error":401}`.
  Yani resmi API'ye **kullanıcı kendi Reddit uygulamasını açıp** (client id + secret)
  erişebilir. Bu, Reddit'i düzgün okumanın tek yolu.
- **Aynalar:** `safereddit.com` 200 ama "Verifying your browser…" duvarı;
  `redlib.catsarch.com` 429; `redlib.perennialte.ch` 403. Kullanılabilir değil.
- **Nasıl yapılır:** kullanıcı `reddit.com/prefs/apps`'ten bir "script" uygulaması açar,
  `client_id` + `secret` verir; skill OAuth token alıp `oauth.reddit.com`'dan okur.
  Detay `references/access.md`'de.
- **TR subreddit'leri:** `r/Turkey`, `r/Turkiye`, `r/KGBTR`, `r/AskTurkey`,
  `r/webdev` (İngilizce), `r/smallbusiness` (İngilizce). TR subreddit'lerinde web
  tasarım talebi seyrektir; İngilizce subreddit'ler yurtdışı müşteri için daha verimli.

## 5. Şikayetvar / KızlarSoruyor — kapalı

- **Şikayetvar:** 403. KızlarSoruyor: 403. Bot koruması var, doğrudan okunamıyor.
- Not: Şikayetvar zaten şikâyet platformu — web sitesi *talebi* orada değil, daha çok
  ajans şikâyeti olur. Yine de doğrudan erişim yok.

## 6. Arama motorları — sonuç vermiyor

- **DuckDuckGo** (html + lite): 202, sonuç yok (bot duvarı).
- **Bing:** 200 döndü ama `site:` filtresini yok saydı, ilgisiz sonuç (WhatsApp,
  Wikipedia). Kullanılabilir değil.
- **Google:** 200 ama JS/consent duvarı; Reddit linki çıkmadı.
- **SearXNG** (`searx.be`): 200 ama "Verifying your browser…" captcha duvarı.
- **Mojeek:** 403.
- **Sonuç:** Reddit/forum thread'i bulmak için genel arama motorları bu ortamdan
  **çalışmıyor**. Ya Reddit OAuth API'sini kullan, ya kanalın kendi arama sayfasını
  (Ekşi, Uludağ) kullan.

## Özet tablo

| Kanal | Durum | Yöntem |
|---|---|---|
| Ekşi Sözlük | ✅ çalışıyor | Gerçek UA + `curl -L` + `?q=` |
| Uludağ Sözlük | ✅ çalışıyor | Gerçek UA + `?q=` |
| Google News RSS | ✅ çalışıyor | RSS, TR haber |
| Reddit (HTML/JSON) | ❌ 403 | — |
| Reddit (OAuth API) | ⚙️ açık, kimlik gerekir | `client_id` + `secret` |
| DonanımHaber | ⚠️ ana sayfa var, arama 404 | doğrulanmadı |
| Şikayetvar / KızlarSoruyor | ❌ 403 | — |
| DDG / Bing / Google / SearXNG / Mojeek | ❌ sonuç yok | — |
