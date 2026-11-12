# Teknik erişim kalıpları

Bu ortamdan **test edilmiş** komutlar (2026-11-11). Amaç: kopyala-çalıştır.

## Ortak kural: gerçek tarayıcı User-Agent

Birçok TR kanalı varsayılan `curl` UA'sını (403) reddeder. Her istekte gerçek bir UA kullan:

```bash
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
```

## Ekşi Sözlük

### Başlık arama (doğru uç nokta)

`https://eksisozluk.com/?q=...` **çalışmaz** (302/404, sonuç yok). Doğru uç nokta
**`/basliklar/ara`**:

```bash
curl -sL --max-time 25 -A "$UA" \
  "https://eksisozluk.com/basliklar/ara?SearchForm.Keywords=web+sitesi&SearchForm.NiceOnly=true" \
  -o sonuc.html -w "%{http_code}\n"
```

- `SearchForm.NiceOnly=true` → yalnızca başlık adında eşleşme (istediğimiz bu).
- Sonuç sayısı: `<h2 title="N başlık">`.
- Sonuç linkleri: `href="/<slug>--<id>"` (ör.
  `/25-tlye-web-sitesi-yapmak--2777202`).

Çıkarma:

```bash
grep -oE 'href="/[a-z0-9-]+--[0-9]+' sonuc.html \
  | grep -viE "kural|kariyer|sozluk|basliklar" | sed 's/href="\///' | sort -u
grep -oE '<h2 title="[0-9]+ başlık"' sonuc.html   # kaç sonuç
```

### Başlık okuma

```bash
curl -sL --max-time 25 -A "$UA" "https://eksisozluk.com/<slug>--<id>" -o baslik.html
# entry gövdeleri: <div class="content">…</div>
```

### Notlar

- Çok kelimeli aramada sonuç seyrek olabilir (ör. "web sitesi fiyat" → 0 başlık).
  Tek/iki kelimelik çekirdek terimler daha çok sonuç verir.
- Ekşi'de tanıtım/link yazmak yazar kurallarına takılır. Burada **saf yardım** modunda kal.

## Uludağ Sözlük

```bash
curl -sL --max-time 20 -A "$UA" "https://www.uludagsozluk.com/?q=web+sitesi" -o u.html
grep -oE 'href="https://www\.uludagsozluk\.com/k/[^"]+"' u.html | sort -u
```

## Reddit — OAuth API (tek çalışan yol)

Reddit HTML/JSON uçları bu ortamdan **403** (bot koruması). Resmi API ise açık ama
kimlik ister. Kullanıcı bir kere kurar:

1. `https://www.reddit.com/prefs/apps` → "create another app…" → **script** tipini seç.
2. `client_id` (uygulama adının altındaki kısa dize) ve `secret` al.
3. Bunları ortam değişkeni olarak ver (`REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`,
   `REDDIT_USER_AGENT`). **Kimlik bilgisini sohbete yazma.**

Token al ve oku:

```bash
TOKEN=$(curl -s --max-time 20 -A "$REDDIT_USER_AGENT" \
  -X POST -u "$REDDIT_CLIENT_ID:$REDDIT_CLIENT_SECRET" \
  -d "grant_type=client_credentials" \
  "https://www.reddit.com/api/v1/access_token" | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')

# bir subreddit'in yeni gönderileri
curl -s --max-time 20 -A "$REDDIT_USER_AGENT" -H "Authorization: bearer $TOKEN" \
  "https://oauth.reddit.com/r/Turkey/new?limit=25" | python3 -c '
import sys,json
for c in json.load(sys.stdin)["data"]["children"]:
    d=c["data"]; print(d["title"], "|", "https://reddit.com"+d["permalink"])'

# arama
curl -s --max-time 20 -A "$REDDIT_USER_AGENT" -H "Authorization: bearer $TOKEN" \
  "https://oauth.reddit.com/search?q=web+sitesi&sort=new&limit=25"
```

- Kimliksiz çağrı `{"message":"Unauthorized","error":401}` döner — bu, uç noktanın
  **erişilebilir** olduğunu kanıtlar (403 değil). Sadece token gerekir.

## Arama motorları — çalışmıyor

Bu ortamdan Reddit/forum thread'i bulmak için kullanılamaz (test edildi):

| Servis | Sonuç |
|---|---|
| DuckDuckGo (html/lite) | 202, sonuç yok |
| Bing | 200 ama `site:` yok sayılıyor, ilgisiz |
| Google | 200, JS/consent duvarı, Reddit linki yok |
| SearXNG (searx.be) | 200, "Verifying your browser…" captcha |
| Mojeek | 403 |

Kullanıcının kendi Chrome'u bağlıysa (Browser MCP) oradan arama yapılabilir; aksi
hâlde kanalın kendi arama sayfasını kullan.
