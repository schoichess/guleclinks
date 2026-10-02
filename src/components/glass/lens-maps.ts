/*
 * Liquid Glass kırılma haritaları (feDisplacementMap için).
 *
 * Kodlama: R = yatay, G = dikey kayma; 128 nötr. feDisplacementMap pikseli
 * P(x + s·(R−0.5), y + s·(G−0.5)) konumundan örnekler. Kenarlarda değerleri
 * merkeze doğru yönlendirmek arkadaki şekilleri kenarlarda büyütüp büker.
 */

const NEUTRAL = "rgb(128,128,0)";

const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/** Sol kenar → sağa, sağ kenar → sola örnekle (R kanalı) */
export function edgeMapX(width: number, ramp: number): string {
  const r = Math.min(ramp / width, 0.45);
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="1" preserveAspectRatio="none">` +
      `<linearGradient id="g"><stop offset="0" stop-color="rgb(255,0,0)"/>` +
      `<stop offset="${r}" stop-color="rgb(128,0,0)"/><stop offset="${1 - r}" stop-color="rgb(128,0,0)"/>` +
      `<stop offset="1" stop-color="rgb(0,0,0)"/></linearGradient>` +
      `<rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
}

/** Üst kenar → aşağı, alt kenar → yukarı örnekle (G kanalı) */
export function edgeMapY(height: number, ramp: number): string {
  const r = Math.min(ramp / height, 0.45);
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${height}" preserveAspectRatio="none">` +
      `<linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="rgb(0,255,0)"/>` +
      `<stop offset="${r}" stop-color="rgb(0,128,0)"/><stop offset="${1 - r}" stop-color="rgb(0,128,0)"/>` +
      `<stop offset="1" stop-color="rgb(0,0,0)"/></linearGradient>` +
      `<rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
}

export const LENS_NEUTRAL = NEUTRAL;

let bumpCache: string | null = null;

/**
 * İmlece yakın akışkan şekil tepkisi: küçük bir küre "normal haritası".
 * Merkeze doğru örnekleyerek altındaki şekli hafifçe büyütür; kenarında nötre söner.
 */
export function bumpMap(): string {
  if (bumpCache) return bumpCache;
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(size, size);
  const c = (size - 1) / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - c) / c;
      const dy = (y - c) / c;
      const d = Math.hypot(dx, dy);
      // smoothstep(1 → 0.35): merkezde tam, kenarda nötr
      const t = Math.min(Math.max((1 - d) / 0.65, 0), 1);
      const f = t * t * (3 - 2 * t);
      const i = (y * size + x) * 4;
      img.data[i] = Math.round(128 - dx * 127 * f);
      img.data[i + 1] = Math.round(128 - dy * 127 * f);
      img.data[i + 2] = 0;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  bumpCache = canvas.toDataURL("image/png");
  return bumpCache;
}

/**
 * SVG filtresini backdrop-filter içinde gerçekten uygulayan motorlar.
 * Chromium'da gerçek tarayıcıda doğrulandı. WebKit'te (Safari) CSS.supports()
 * true döndürse ve hesaplanan stil url()'i korusa da kırılma uygulanmıyor
 * (doğrulandı); bu yüzden özellik testi yerine motor kontrolü kullanılıyor.
 * Chromium dışındaki her motor (Firefox dahil, test edilmedi) güvenli yedeğe
 * düşer: bulanık cam + ışık + çift kenar + yükselme.
 */
export function supportsBackdropLens(): boolean {
  if (typeof navigator === "undefined") return false;
  const data = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } })
    .userAgentData;
  return Boolean(data?.brands?.some((b) => b.brand === "Chromium"));
}
