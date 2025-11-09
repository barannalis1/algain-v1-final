# DreamOracle Platform

DreamOracle is a Next.js 14 experience for collecting dreams (metin + ses), üretmek yorumlar, fal modülleri ve pastel animasyon storyboardları. Platform TRY fiyatlarını gösterirken yaklaşık EUR karşılıklarını SSR sırasında hesaplar, görsel yüklemelerle kahve/el/tarot analizlerini simüle eder ve günlük yaşam koçluğu mesajları sunar.

## Mimari
- **Web**: Next.js 14 App Router, React 18, Tailwind CSS (özel utility'ler)
- **Veri Katmanı**: Sunucu belleğinde tutulan `lib/data-store` (demo amaçlı). Gerçek dağıtımda veritabanı ile değiştirilebilir.
- **AI / Video**: Yerel heuristik analizler, storyboard üretimi, kuyruk simülasyonları (`lib/ai.ts`, `workers/queue.ts`).
- **Fiyatlandırma**: TRY→EUR yaklaşık dönüşümü (`lib/fx.ts`) ve SSR fiyat kartları.
- **Uyumluluk**: KVKK/GDPR uyarıları, veriyi indir/sil hatırlatıcıları, 18+ bilgilendirme metinleri.

## Kurulum
1. Bağımlılıklar depo içinde stub olarak bulunduğundan ayrıca `npm install` çalıştırmanız gerekmez. (Ortamda `npm install` dış ağ erişimi gerektirdiğinden 403 dönebilir.)
2. Geliştirme sunucusu:
   ```bash
   npm run dev
   ```
3. Üretim derlemesi:
   ```bash
   npm run build
   ```
   Derleme sırasında Next.js, TypeScript paketini yeniden kurmaya çalışabilir. Dış ağ engelliyse bu adım uyarıyla sonlanır; yapı çıktıları yine de `.next/` altında oluşur.

## Önemli Komutlar
- `npm run dev` – geliştirme sunucusu
- `npm run build` – üretim derlemesi (TypeScript bağımlılığı olmadan çalışacak şekilde yapılandırılmıştır)
- `npm run start` – üretim sunucusu
- `npm run lint` – Next.js ESLint

## Özellikler
- Rüya toplama paneli (metin + 100 MB ses yükleme limiti)
- AI yorum kartı: özet, semboller, öneriler, mood etiketleri
- Pastel toon video storyboard planı ve mp4 kuyruğa alma simülasyonu
- Tarot / Astro / El / Kahve falı formları, görsel yükleme desteği, özet listesi
- TRY / ≈EUR fiyatlandırma kartları, Free/Premium/Pro limitleri
- Günlük 09:00 motivasyon mesajı, test bildirimi uç noktası
- Admin panelinde kuyruk/ log/ webhook özetleri
- OpenAPI özeti `/tr/docs` sayfasında JSON olarak görüntülenir

## Veri & Kuyruk Simülasyonu
Gerçek veritabanı yerine bellek içi kayıtlar kullanılır (`lib/data-store.ts`).
- `createDream`, `saveInterpretation`, `createVideoJob` vb. fonksiyonlar API uç noktaları tarafından çağrılır.
- `workers/queue.ts` dosyası, yorum ve video işlemlerinin nasıl ele alınacağını örnekler.

## FX Çevirisi
`lib/fx.ts` dosyası TRY tutarını formatlar ve EUR yaklaşık değerini hesaplar. Gerçek ortamda ENV değerleriyle günlük kur çekilebilir; demo modunda varsayılan fallback oranı kullanılır.

## Geliştirme Notları
- UI bileşenleri (`components/ui/*`) saf React + Tailwind sınıflarıyla yazıldı; Radix, Zustand vb. üçüncü parti bağımlılıklar kaldırıldı.
- Logger basitleştirilmiş `console` sarmalayıcısıdır.
- Swagger UI yerine `/api/docs` çıktısı SSR tarafında `<pre>` bloğu ile sunulur.

## Gelecek Adımlar
Gerçek entegrasyonlar (Prisma, NextAuth, Stripe vb.) için bu demo temel alınarak gerekli SDK ve servisler eklenmelidir.
