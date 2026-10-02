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

## Renk sistemi — GULEC Light Blue Palette

Palet `src/app/globals.css` başında birebir HEX değerleriyle tanımlıdır
(`--sky-core`, `--soft-blue`, `--ice-blue`, `--frost-white`, `--pure-white`,
`--silver-gray`, `--slate-gray`, `--steel-blue-gray`, `--deep-cool-gray`).
Bileşenler yalnızca semantik değişkenleri (`--c-text`, `--g-fill-top`,
`--a-fill-top` …) kullanır; saydamlık, gölge ve degradeler `color-mix()` ile
paletten türetilir. Arka plan çizimi (`scripts/scene/art.mjs`) aynı paleti kullanır.

## Yapı

| Dosya | Görev |
| --- | --- |
| `src/app/globals.css` | Tasarım değişkenleri (renk, cam, gölge, ölçü, hareket), cam yüzey, açılış animasyonu |
| `src/app/layout.tsx` | Fontlar, meta, ilk boyamadan önce tema uygulayan satır içi betik |
| `src/components/ambient-scene.tsx` | İki katmanlı arka plan (arka: zemin + kıvrımlar, ön: kütleler + ışık), farklı hızlarda akar |
| `src/components/scene-motion.tsx` | Arka plan süzülmesi + imleç paralaksı (tek Motion kare döngüsü, render yok) |
| `src/components/glass/liquid-glass-card.tsx` | Yeniden kullanılabilir Liquid Glass kartı: hover/basma yayı, eğim, imleci izleyen ışık, çift kenar, kırılma |
| `src/components/glass/lens-maps.ts` | Kırılma haritaları (kenar bükülmesi + imleç şekil tepkisi) ve motor kontrolü |
| `src/config/motion.ts` | Animasyon ayarları (hover, basma, eğim, kırılma, arka plan akışı) |
| `src/assets/avatar.webp` | Avatar fotoğrafı (meta verisi temizlenmiş); `profile.ts` içinden değiştirilir |
| `src/components/theme-toggle.tsx` | Açık/koyu tema düğmesi (localStorage) |
| `src/components/brand-icons.tsx` | Behance, GitHub, LinkedIn, Instagram işaretleri |
| `scripts/scene/art.mjs` | Arka plan çiziminin SVG kaynağı (dikey ve yatay kompozisyon) |
| `scripts/scene/render.mjs` | Çizimi katman katman `public/scene/*-back.webp` / `*-front.webp` olarak üretir (`npm run scene`) |

## Performans notu

Arka plan çalışma anında SVG filtresiyle çizilmez; `npm run scene` ile önceden
WebP'ye dönüştürülür. Hover, tema geçişi ve arka plan hareketi yalnızca kendi
GPU katmanı olan öğelerde transform/opacity değiştirir, hiçbir karede yeniden
boyama yapılmaz. Arka planı değiştirdiyseniz `npm run scene` çalıştırın.

## Liquid Glass ve tarayıcı desteği

Kartın camı CSS katmanlarıyla kurulur (yarı saydam dolgu, `backdrop-filter`
bulanıklığı, ince kenar, iç yansıma, gölge). Hover sırasında Chromium tabanlı
tarayıcılarda (Chrome, Edge, Arc, Brave…) kartın arkasına bir SVG
`feDisplacementMap` kırılması eklenir: kenarlarda arkadaki şekiller büyür ve
bükülür, imlece yakın noktada küçük akışkan bir şekil tepkisi oluşur.
Safari'de `CSS.supports()` olumlu dönse de bu filtre arka plana uygulanmadığı
için (doğrulandı) Chromium dışındaki tarayıcılar kırılmasız ama aynı cam,
ışık, çift kenar, eğim ve yükselmeyle çalışır.
