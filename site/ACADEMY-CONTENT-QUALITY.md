# Senior Academy — içerik kalite kapısı

Durum: **ücretli satış kapalı**. Bu belge beş uzmanlık programının soru bankasını yapısal olarak ölçer; pedagojik doğruluk, çalışan laboratuvar, öğrenci erişimi veya ticari hazır olma onayı vermez. `Foundations` farklı içerik yapısında olduğundan bu otomatik denetimin kapsamı dışındadır ve ayrıca incelenmelidir.

## Ölçülen sözleşme

`node audit-academy-content.mjs --root <Senior-Software-Academy-v1>` beş programın bağımsız paketini ve Foundations içindeki eş kopyasını okur. Her program için 15 gün × 3 soru, Türkçe/İngilizce 45 benzersiz soru kökü, dört farklı seçenek, geçerli cevap indisi, iki dilde açıklama ve eş kopya SHA uyumu aranır. Doğru cevabın herhangi bir konumda %40'ı aşması veya aynı yanlış seçeneğin beşten fazla kullanılması yapısal kapıyı kapatır. Bu eşikler iyi soru yazımının kanıtı değildir; yalnız belirgin tekrar ve ezber kalıplarını yakalar.

## 23 Eylül 2026 kaynak durumu

| Program | Başlangıç bulgusu | Uygulanan değişiklik | Yapısal kapı |
| --- | --- | --- | --- |
| Frontend | 45 benzersiz soru; cevaplar 29/15/1/0 | İki dilde doğru seçenek korunarak cevap konumları kurs oluşturulurken dengelendi | Geçti: 12/11/11/11 |
| Backend | 45 benzersiz soru; cevaplar 44/1/0/0 | 45 soruda seçenekler ve cevap indisi birlikte yeniden sıralandı | Geçti: 12/11/11/11 |
| DevOps | 45 benzersiz soru; cevaplar 42/3/0/0 | 45 soruda seçenekler ve cevap indisi birlikte yeniden sıralandı | Geçti: 12/11/11/11 |
| DevSecOps | 27 benzersiz soru; cevaplar 45/0/0/0; 10 kez yinelenen yanlış seçenekler | Henüz soru yeniden yazımı yok | Kapalı |
| System Design | 3 benzersiz soru; cevaplar 45/0/0/0; 15 kez yinelenen yanlış seçenekler | Henüz soru yeniden yazımı yok | Kapalı |

Frontend, Backend ve DevOps'un her birindeki 45 iki dilli sorunun kökü, dört seçenek kümesi, açıklaması ve **doğru cevap metni** önceki sürümle `verify-academy-rebalance.mjs` üzerinden karşılaştırılıp aynı bulundu. Bağımsız paket ile Foundations eş kopyası hash olarak aynı. Kaynak klasörleri bu sitenin Git deposu dışında olduğundan değişiklikler `site` commit'ine dâhil değildir; özgün dosyalar geçici yedeklerde tutuldu. Yedek yolları: `senior-academy-quiz-backup-1790195061627` ve `senior-academy-frontend-backup-1790195144429` (Windows kullanıcı temp dizini).

## Yayın kapısındaki kalan iş

1. **System Design:** 15 günün 45 sorusunu gereksinim, kapasite, veri sınırı, cache, veri tabanı ölçeği, tutarlılık, hata alanı, SLO ve kurtarma gibi gerçek MiniShop kararlarına bağlayan benzersiz senaryolarla yeniden yaz. Her sorunun yanlış seçenekleri konu içinden makul alternatifler olmalı; tekrar eden jenerik seçenekler kullanılmamalı.
2. **DevSecOps:** özellikle 6–15. günlerdeki tekrar kalıplarını uygulama ve güvenlik kararlarıyla yeniden yaz. Tehdit, yetki, artefakt kökeni, cloud sınırı, detection ve olay müdahalesi sorularında hangi kanıtın doğru seçimi desteklediği açıklansın.
3. **Tüm programlar:** konu uzmanı ve gerçek öğrenciyle soru kökü açıklığı, yanlış seçeneklerin makullüğü, iki dilin eşdeğerliği ve açıklamaların öğrenmeye katkısı gözden geçirilsin. Yapısal kapıdan geçen üç program da bu incelemeyi geçmeden satışa hazır değildir.
4. **Öğrenci deneyimi:** her ders hedef → açıklama → çalışan örnek/karar → tarayıcı içi uygulama → açıklamalı ölçme akışını karşılamalı. Öğrenciye terminal, ZIP veya sunucu kurulumu yaptırılmadan ikinci cihaz, ilerleme, destek ve erişim bitişi doğrulanmalı.
5. **Ticari geçiş:** ikas ürünleri, bundle yetkileri, ödeme/başarısız ödeme/iade ve doğru e-posta ile erişim ancak gerçek anonim akışta doğrulanınca açılmalı.
