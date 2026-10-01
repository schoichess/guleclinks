# Umut Güleç — Link sayfası

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion 13 · Lucide

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
npm run scene      # arka plan görsellerini yeniden üretir
```

## İçerik ve bağlantılar

Tüm metinler ve adresler tek dosyada: [`src/config/profile.ts`](src/config/profile.ts).
`url: null` olan kartlar "Yakında" etiketiyle, erişilebilir biçimde devre dışı görünür.
Adresi yazdığınızda kart otomatik olarak etkin bağlantıya dönüşür
(`https://…` veya iletişim için `mailto:…`).

## Yapı

| Dosya | Görev |
| --- | --- |
| `src/app/globals.css` | Tasarım değişkenleri (renk, cam, gölge, ölçü, hareket), cam yüzey, açılış animasyonu |
| `src/app/layout.tsx` | Fontlar, meta, ilk boyamadan önce tema uygulayan satır içi betik |
| `src/components/ambient-scene.tsx` | Arka plan katmanı (önceden çizilmiş WebP, tema başına bir görsel) |
| `src/components/scene-motion.tsx` | Arka plan süzülmesi + imleç paralaksı (tek Motion kare döngüsü, render yok) |
| `src/components/interactive-card.tsx` | Hover / basma yayı, ok hareketi, imleç yansıması |
| `src/components/theme-toggle.tsx` | Açık/koyu tema düğmesi (localStorage) |
| `src/components/brand-icons.tsx` | Behance, GitHub, LinkedIn, Instagram işaretleri |
| `scripts/scene/art.mjs` | Arka plan çiziminin SVG kaynağı (dikey ve yatay kompozisyon) |
| `scripts/scene/render.mjs` | Çizimi `public/scene/*.webp` olarak üretir (`npm run scene`) |

## Performans notu

Arka plan çalışma anında SVG filtresiyle çizilmez; `npm run scene` ile önceden
WebP'ye dönüştürülür. Hover, tema geçişi ve arka plan hareketi yalnızca kendi
GPU katmanı olan öğelerde transform/opacity değiştirir, hiçbir karede yeniden
boyama yapılmaz. Arka planı değiştirdiyseniz `npm run scene` çalıştırın.
