/*
 * Arka plan çizimi (SVG kaynağı).
 *
 * Çalışma anında SVG filtresi çizdirmek pahalı olduğu için bu çizim
 * `npm run scene` ile önceden WebP'ye dönüştürülür (public/scene/*.webp).
 * Katmanlar: zemin → saten kıvrımlar → bordo kütleler (iç parlaklık bandıyla)
 * → beyaz kenar ışıkları. Renkler ve yerleşim referans görselden alındı.
 */

// Bordo / pembe-beyaz ipek paleti
const PALETTE = {
  massCore: "#4a0011",
  massDeep: "#5e0117",
  massMid: "#74081f",
  massEdge: "#962240",
  massRim: "#c96079",
  gloss: "#cf5670",
  discCore: "#d98597",
  discMid: "#a8304e",
  bottomRight: "#b4475f",
  bottomRightFade: "#f2c9d0",
  hazeLight: "#f0c4cc",
  hazeMid: "#c9637a",
  hazeDeep: "#7a0a24",
  hazeSoft: "#c26a7f",
  silkShade: "#a0606c",
};

// Mobil / dikey (4:5). Bordo "diller" kartların sol üst ve sağ orta kenarlarının altına girer.
const PORTRAIT = {
  width: 1000,
  height: 1250,
  masses: {
    topRight: {
      edge: "M600-60C625 70 680 190 770 275C850 350 940 400 1060 430",
      close: "L1060-60Z",
      fill: "mass-tr",
    },
    left: {
      edge: "M-60 280C80 285 210 320 300 390C370 445 410 505 412 570C414 630 350 668 250 685C150 702 40 706-60 708",
      close: "Z",
      fill: "mass-l",
    },
    right: {
      edge: "M1060 545C950 558 840 615 785 680C758 712 750 735 752 760C756 815 815 860 885 888C945 912 1000 935 1060 960",
      close: "Z",
      fill: "mass-r",
    },
  },
  ribbon: "M-60 238C110 243 262 292 352 372C392 410 414 452 424 496",
  bottomRight: { edge: "M1060 980C960 1040 880 1130 840 1290", close: "L1060 1290Z" },
  disc: { cx: 1040, cy: 90, r: 230 },
  hazes: [
    { cx: 60, cy: 1130, rx: 320, ry: 170, color: "hazeLight", opacity: 0.8 },
    { cx: 990, cy: 1230, rx: 280, ry: 180, color: "hazeMid", opacity: 0.55 },
    { cx: 80, cy: 500, rx: 300, ry: 300, color: "hazeDeep", opacity: 0.24 },
    { cx: 930, cy: 170, rx: 340, ry: 300, color: "hazeDeep", opacity: 0.22 },
    { cx: 950, cy: 760, rx: 260, ry: 240, color: "hazeDeep", opacity: 0.2 },
  ],
  folds: [
    { d: "M240-60C320 110 430 220 590 262C690 290 760 330 800 420", w: 90 },
    { d: "M-60 830C150 850 300 910 420 990C560 1080 760 1090 1060 1050", w: 100 },
    { d: "M-60 1000C120 1020 260 1110 330 1290", w: 80 },
    { d: "M520 1290C620 1170 760 1130 1060 1160", w: 90 },
    { d: "M380 640C440 760 560 840 720 870", w: 70 },
    { d: "M-60 110C90 150 210 210 270 300", w: 70 },
  ],
};

// Masaüstü / yatay: sütun yaklaşık x 555–1045; diller kartların kenarlarının altına girer.
const LANDSCAPE = {
  width: 1600,
  height: 1000,
  masses: {
    topRight: {
      edge: "M1080-60C1120 110 1200 225 1310 300C1405 366 1515 405 1660 428",
      close: "L1660-60Z",
      fill: "mass-tr",
    },
    left: {
      edge: "M-60 262C200 262 440 322 555 430C610 482 634 520 636 560C638 610 560 640 440 662C290 690 110 708-60 716",
      close: "Z",
      fill: "mass-l",
    },
    right: {
      edge: "M1660 552C1450 566 1180 622 1060 692C1010 722 984 752 984 780C984 820 1050 852 1170 885C1320 928 1482 946 1660 956",
      close: "Z",
      fill: "mass-r",
    },
  },
  ribbon: "M-60 222C200 228 432 290 540 384C584 424 606 466 616 508",
  bottomRight: { edge: "M1660 978C1520 998 1420 1020 1360 1060", close: "L1660 1060Z" },
  disc: { cx: 1570, cy: 70, r: 270 },
  hazes: [
    { cx: 160, cy: 960, rx: 420, ry: 150, color: "hazeLight", opacity: 0.75 },
    { cx: 1520, cy: 1010, rx: 340, ry: 140, color: "hazeMid", opacity: 0.5 },
    { cx: 140, cy: 490, rx: 460, ry: 300, color: "hazeDeep", opacity: 0.22 },
    { cx: 1450, cy: 150, rx: 460, ry: 300, color: "hazeDeep", opacity: 0.22 },
    { cx: 1430, cy: 760, rx: 420, ry: 230, color: "hazeDeep", opacity: 0.2 },
    { cx: 800, cy: 640, rx: 280, ry: 320, color: "hazeSoft", opacity: 0.12 },
  ],
  folds: [
    { d: "M380-60C470 90 620 180 820 210C980 235 1080 290 1130 380", w: 100 },
    { d: "M-60 850C220 860 450 900 640 958C820 1012 1100 1016 1660 968", w: 110 },
    { d: "M600 1060C720 986 900 966 1200 996", w: 84 },
    { d: "M-60 120C140 150 300 210 380 300", w: 80 },
    { d: "M700 440C760 580 880 660 1080 690", w: 76 },
    { d: "M1000 340C1120 430 1250 470 1420 462", w: 70 },
  ],
};

const THEMES = {
  light: {
    base: ["#fbe8ea", "#f2d8da", "#e6c2c6"],
    glow: { color: "#fff7f8", opacity: 0.9 },
    silk: 1,
    mass: 1,
    light: 1,
  },
  dark: {
    base: ["#1c0810", "#12050a", "#090206"],
    glow: { color: "#6a1a30", opacity: 0.34 },
    silk: 0.07,
    mass: 0.85,
    light: 0.3,
  },
};

export const VARIANTS = { portrait: PORTRAIT, landscape: LANDSCAPE };

export function buildScene(variantName, themeName, outWidth) {
  const v = VARIANTS[variantName];
  const t = THEMES[themeName];
  const P = PALETTE;
  const m = v.masses;
  const outHeight = Math.round((outWidth * v.height) / v.width);
  const masses = Object.entries(m);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v.width} ${v.height}" width="${outWidth}" height="${outHeight}" preserveAspectRatio="none">
  <defs>
    <linearGradient id="base" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="${t.base[0]}"/>
      <stop offset="0.5" stop-color="${t.base[1]}"/>
      <stop offset="1" stop-color="${t.base[2]}"/>
    </linearGradient>
    <radialGradient id="base-glow" cx="0.5" cy="0.3" r="0.55">
      <stop offset="0" stop-color="${t.glow.color}" stop-opacity="${t.glow.opacity}"/>
      <stop offset="0.7" stop-color="${t.glow.color}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mass-tr" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="${P.massEdge}"/>
      <stop offset="0.3" stop-color="${P.massCore}"/>
      <stop offset="0.7" stop-color="${P.massDeep}"/>
      <stop offset="1" stop-color="${P.massMid}"/>
    </linearGradient>
    <radialGradient id="mass-disc" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${P.discCore}" stop-opacity="0.8"/>
      <stop offset="0.7" stop-color="${P.discMid}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${P.discMid}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mass-l" cx="0" cy="0.55" r="1">
      <stop offset="0" stop-color="${P.massCore}"/>
      <stop offset="0.5" stop-color="${P.massDeep}"/>
      <stop offset="0.8" stop-color="${P.massMid}"/>
      <stop offset="1" stop-color="${P.massEdge}"/>
    </radialGradient>
    <radialGradient id="mass-r" cx="1" cy="0.55" r="1">
      <stop offset="0" stop-color="${P.massCore}"/>
      <stop offset="0.5" stop-color="${P.massDeep}"/>
      <stop offset="0.8" stop-color="${P.massMid}"/>
      <stop offset="1" stop-color="${P.massEdge}"/>
    </radialGradient>
    <linearGradient id="mass-br" x1="1" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${P.bottomRight}" stop-opacity="0.8"/>
      <stop offset="1" stop-color="${P.bottomRightFade}" stop-opacity="0.2"/>
    </linearGradient>
    ${masses.map(([k, x]) => `<clipPath id="clip-${k}"><path d="${x.edge}${x.close}"/></clipPath>`).join("")}
    <filter id="silk-shade" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="32"/></filter>
    <filter id="silk-shine" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="15"/></filter>
    <filter id="mass-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="mass-haze" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="44"/></filter>
    <filter id="gloss" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="gloss-hi" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="light-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="light-edge" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.1"/></filter>
  </defs>

  <rect width="${v.width}" height="${v.height}" fill="url(#base)"/>
  <rect width="${v.width}" height="${v.height}" fill="url(#base-glow)"/>

  <g opacity="${t.silk}" fill="none" stroke-linecap="round">
    <g filter="url(#silk-shade)" stroke="${P.silkShade}" stroke-opacity="0.22" transform="translate(14 30)">
      ${v.folds.map((f) => `<path d="${f.d}" stroke-width="${f.w * 1.1}"/>`).join("")}
    </g>
    <g filter="url(#silk-shine)" stroke="#fff" stroke-opacity="0.9">
      ${v.folds.map((f) => `<path d="${f.d}" stroke-width="${f.w * 0.6}"/>`).join("")}
    </g>
  </g>

  <g opacity="${t.mass}">
    <g filter="url(#mass-haze)">
      ${v.hazes.map((h) => `<ellipse cx="${h.cx}" cy="${h.cy}" rx="${h.rx}" ry="${h.ry}" fill="${P[h.color]}" fill-opacity="${h.opacity}"/>`).join("")}
    </g>
    <g filter="url(#mass-soft)">
      ${masses.map(([, x]) => `<path fill="url(#${x.fill})" d="${x.edge}${x.close}"/>`).join("")}
      <circle cx="${v.disc.cx}" cy="${v.disc.cy}" r="${v.disc.r}" fill="url(#mass-disc)"/>
      <path fill="url(#mass-br)" d="${v.bottomRight.edge}${v.bottomRight.close}"/>
    </g>
    ${masses
      .map(
        ([k, x]) => `<g clip-path="url(#clip-${k})" fill="none" stroke-linecap="round">
      <path d="${x.edge}" stroke="${P.gloss}" stroke-width="110" stroke-opacity="0.55" filter="url(#gloss)"/>
      <path d="${x.edge}" stroke="#fff" stroke-width="16" stroke-opacity="0.32" filter="url(#gloss-hi)"/>
    </g>`,
      )
      .join("")}
  </g>

  <g opacity="${t.light}" fill="none" stroke="#fff" stroke-linecap="round">
    <g filter="url(#light-glow)">
      ${masses.map(([, x]) => `<path d="${x.edge}" stroke-width="28" stroke-opacity="0.5"/>`).join("")}
      <path d="${v.ribbon}" stroke-width="70" stroke-opacity="0.42"/>
      <path d="${v.bottomRight.edge}" stroke-width="30" stroke-opacity="0.45"/>
    </g>
    <g filter="url(#light-edge)">
      ${masses.map(([, x]) => `<path d="${x.edge}" stroke-width="2.6" stroke-opacity="0.9"/>`).join("")}
      <path d="${v.ribbon}" stroke-width="1.6" stroke-opacity="0.7"/>
      <path d="${v.bottomRight.edge}" stroke-width="2.2" stroke-opacity="0.8"/>
    </g>
  </g>
</svg>`;
}
