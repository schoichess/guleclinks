/**
 * Animasyon ayarları tek yerde. Renkler src/app/globals.css içinde,
 * içerik ve bağlantılar src/config/profile.ts içindedir.
 */

/** Liquid Glass kart etkileşimi */
export const glassMotion = {
  /** Hover/basma yayı: ~250–350 ms içinde oturan, küçük ve kontrollü */
  spring: { type: "spring", stiffness: 380, damping: 30 },
  /** İmleç kartın üzerindeyken */
  hover: { lift: 3, scale: 1.02 },
  /** Tıklama / dokunma */
  press: { scale: 0.985 },
  /** Sağdaki okun küçük tepkisi (px) */
  arrow: { x: 2.5, y: -2.5 },
  /** İmlece göre eğim (derece) ve perspektif (px) */
  tilt: { maxDeg: 1.2, perspective: 900 },
  /** İmleci izleyen ışık */
  glare: { size: 260, follow: { stiffness: 520, damping: 42 } },
  /** Optik kırılma (yalnızca destekleyen tarayıcıda, hover sırasında) */
  lens: {
    /** Kenar bükülmesinin en büyük kayması (px) */
    edgeScale: 40,
    /** Kenar kırılma bandının genişliği (px) */
    edgeRampX: 64,
    edgeRampY: 28,
    /** İmlece yakın akışkan şekil tepkisinin yarıçapı (px) */
    bumpRadius: 52,
    fadeIn: 0.3,
    fadeOut: 0.35,
  },
} as const;

/** Arka plan: iki katman farklı hızlarda kendiliğinden akar, imlece hafif paralaks */
export const sceneMotion = {
  /** Arka katman: zemin ve saten kıvrımlar (yavaş) */
  back: { depth: 4, ampX: 14, ampY: 10, periodX: 40, periodY: 36, phase: 0 },
  /** Ön katman: açık mavi kütleler ve kenar ışıkları (daha hızlı) */
  front: { depth: 9, ampX: 22, ampY: 18, periodX: 28, periodY: 24, phase: 1.3 },
  /** Boşta güncelleme aralığı; adım başına < 0.2 px, gözle fark edilmez */
  idleFrameMs: 50,
  /** İmleç hareket ederken (paralaks yayı çalışırken) */
  followFrameMs: 33,
  /** Dokunmatik cihazda süzülme yarı genlikte ve daha seyrek */
  touchDriftScale: 0.5,
  touchIdleFrameMs: 80,
} as const;
