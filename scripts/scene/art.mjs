/*
 * Arka plan çizimi (SVG kaynağı).
 *
 * Çalışma anında SVG filtresi çizdirmek pahalı olduğu için bu çizim
 * `npm run scene` ile önceden WebP'ye dönüştürülür (public/scene/*.webp).
 * Katmanlar: zemin → saten kıvrımlar → mavi cam kütleler → beyaz kenar ışıkları.
 */

const PORTRAIT = {
  width: 1000,
  height: 1250,
  edges: {
    topRight: "M660-60C690 130 735 245 800 310C860 370 930 425 1060 465",
    topRightInner: "M765-60C785 65 832 170 902 232C952 276 1004 302 1060 314",
    left: "M-60 300C80 305 230 360 290 450C340 520 345 600 300 660C245 730 120 755-60 775",
    leftInner: "M-60 380C70 380 200 425 250 495C290 550 285 615 240 665C200 705 110 725-60 735",
    leftRibbon: "M-60 335C90 340 215 395 268 470C300 515 312 570 300 620",
    right: "M1060 655C950 665 840 710 775 782C735 830 748 902 812 942C878 980 975 980 1060 975",
    rightInner: "M1060 720C980 730 895 762 848 808C818 842 828 888 870 913C922 942 988 942 1060 936",
    bottomRight: "M1060 1000C980 1080 930 1160 900 1290",
  },
  corners: { topRight: "L1060-60Z", bottomRight: "L1060 1290Z" },
  disc: { cx: 1030, cy: 100, r: 220 },
  hazes: [
    { cx: 60, cy: 1130, rx: 300, ry: 160, color: "#b4cffe", opacity: 0.75 },
    { cx: 990, cy: 1240, rx: 260, ry: 170, color: "#7eaaff", opacity: 0.6 },
    { cx: 90, cy: 540, rx: 270, ry: 300, color: "#1769ff", opacity: 0.22 },
    { cx: 960, cy: 170, rx: 320, ry: 300, color: "#1769ff", opacity: 0.2 },
    { cx: 960, cy: 830, rx: 240, ry: 220, color: "#1769ff", opacity: 0.18 },
  ],
  folds: [
    { d: "M240-60C320 110 430 220 590 262C690 290 760 330 800 420", w: 70 },
    { d: "M-60 820C150 840 300 900 420 980C560 1070 760 1080 1060 1040", w: 80 },
    { d: "M-60 990C120 1010 260 1100 330 1290", w: 60 },
    { d: "M520 1290C620 1160 760 1120 1060 1150", w: 70 },
    { d: "M360 600C420 740 540 830 720 860", w: 56 },
    { d: "M-60 110C90 150 210 210 270 300", w: 50 },
    { d: "M600 430C690 520 770 560 920 560", w: 48 },
  ],
};

// Masaüstü: sütun yaklaşık x 555–1045; mavi kütleler kartların kenarlarının altına girer.
const LANDSCAPE = {
  width: 1600,
  height: 1000,
  edges: {
    topRight: "M1100-60C1140 110 1215 225 1320 300C1415 366 1520 405 1660 425",
    topRightInner: "M1225-60C1255 55 1318 150 1408 208C1480 252 1570 274 1660 280",
    left: "M-60 255C190 255 440 320 555 425C632 495 640 590 565 655C475 735 235 765-60 785",
    leftInner: "M-60 340C200 340 410 395 505 480C562 532 566 595 515 640C450 698 265 722-60 732",
    leftRibbon: "M-60 295C210 300 440 365 535 455C575 495 595 545 595 600",
    right: "M1660 545C1430 555 1170 610 1060 700C990 758 1000 838 1095 885C1205 935 1440 940 1660 930",
    rightInner: "M1660 615C1455 625 1230 668 1135 738C1080 778 1088 830 1148 860C1240 905 1452 908 1660 900",
    bottomRight: "M1660 975C1520 995 1420 1020 1360 1060",
  },
  corners: { topRight: "L1660-60Z", bottomRight: "L1660 1060Z" },
  disc: { cx: 1570, cy: 70, r: 260 },
  hazes: [
    { cx: 160, cy: 960, rx: 400, ry: 140, color: "#b4cffe", opacity: 0.7 },
    { cx: 1520, cy: 1010, rx: 320, ry: 130, color: "#7eaaff", opacity: 0.55 },
    { cx: 140, cy: 520, rx: 440, ry: 300, color: "#1769ff", opacity: 0.2 },
    { cx: 1460, cy: 150, rx: 440, ry: 300, color: "#1769ff", opacity: 0.2 },
    { cx: 1430, cy: 740, rx: 400, ry: 220, color: "#1769ff", opacity: 0.18 },
    { cx: 800, cy: 640, rx: 260, ry: 320, color: "#6f9fff", opacity: 0.1 },
  ],
  folds: [
    { d: "M380-60C470 90 620 180 820 210C980 235 1080 290 1130 380", w: 84 },
    { d: "M-60 845C220 855 450 895 640 952C820 1006 1100 1010 1660 962", w: 92 },
    { d: "M600 1060C720 982 900 962 1200 992", w: 70 },
    { d: "M-60 120C140 150 300 210 380 300", w: 60 },
    { d: "M700 430C760 570 880 650 1080 680", w: 60 },
    { d: "M1000 330C1120 420 1250 460 1420 452", w: 56 },
    { d: "M-60 990C150 1000 300 1040 380 1080", w: 50 },
  ],
};

const THEMES = {
  light: {
    base: ["#f5f7fb", "#edf0f6", "#e3e8f1"],
    glow: { color: "#ffffff", opacity: 0.9 },
    silk: 1,
    blue: 1,
    light: 1,
  },
  dark: {
    base: ["#0c1530", "#070d1f", "#040814"],
    glow: { color: "#3050a0", opacity: 0.32 },
    silk: 0.07,
    blue: 0.8,
    light: 0.32,
  },
};

export const VARIANTS = { portrait: PORTRAIT, landscape: LANDSCAPE };

export function buildScene(variantName, themeName, outWidth) {
  const v = VARIANTS[variantName];
  const t = THEMES[themeName];
  const e = v.edges;
  const outHeight = Math.round((outWidth * v.height) / v.width);

  const rims = [
    { d: e.topRight, w: 3, o: 0.95 },
    { d: e.topRightInner, w: 2, o: 0.55 },
    { d: e.left, w: 3, o: 0.9 },
    { d: e.leftInner, w: 2, o: 0.6 },
    { d: e.leftRibbon, w: 1.6, o: 0.7 },
    { d: e.right, w: 2.6, o: 0.9 },
    { d: e.rightInner, w: 1.8, o: 0.5 },
    { d: e.bottomRight, w: 2.2, o: 0.8 },
  ];

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
    <linearGradient id="blue-tr" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#5b93ff"/>
      <stop offset="0.3" stop-color="#1463f4"/>
      <stop offset="0.7" stop-color="#2a71ff"/>
      <stop offset="1" stop-color="#4c8bff"/>
    </linearGradient>
    <radialGradient id="blue-disc" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#a8c8ff" stop-opacity="0.9"/>
      <stop offset="0.7" stop-color="#6fa1ff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#3b7cff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blue-l" cx="0" cy="0.55" r="1">
      <stop offset="0" stop-color="#0b54e8"/>
      <stop offset="0.55" stop-color="#1b66f6"/>
      <stop offset="0.82" stop-color="#4a89ff"/>
      <stop offset="1" stop-color="#9fc1ff"/>
    </radialGradient>
    <radialGradient id="blue-r" cx="1" cy="0.55" r="1">
      <stop offset="0" stop-color="#0b54e8"/>
      <stop offset="0.5" stop-color="#1d68f7"/>
      <stop offset="0.85" stop-color="#5a95ff"/>
      <stop offset="1" stop-color="#b3cdff"/>
    </radialGradient>
    <linearGradient id="blue-br" x1="1" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#4f8dff" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#c4daff" stop-opacity="0.2"/>
    </linearGradient>
    <filter id="silk-shade" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="silk-shine" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="blue-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="blue-haze" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="44"/></filter>
    <filter id="light-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="light-edge" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.1"/></filter>
  </defs>

  <rect width="${v.width}" height="${v.height}" fill="url(#base)"/>
  <rect width="${v.width}" height="${v.height}" fill="url(#base-glow)"/>

  <g opacity="${t.silk}" fill="none" stroke-linecap="round">
    <g filter="url(#silk-shade)" stroke="#7f93bb" stroke-opacity="0.26" transform="translate(12 26)">
      ${v.folds.map((f) => `<path d="${f.d}" stroke-width="${f.w}"/>`).join("")}
    </g>
    <g filter="url(#silk-shine)" stroke="#fff" stroke-opacity="0.95">
      ${v.folds.map((f) => `<path d="${f.d}" stroke-width="${f.w * 0.55}"/>`).join("")}
    </g>
  </g>

  <g opacity="${t.blue}">
    <g filter="url(#blue-haze)">
      ${v.hazes.map((h) => `<ellipse cx="${h.cx}" cy="${h.cy}" rx="${h.rx}" ry="${h.ry}" fill="${h.color}" fill-opacity="${h.opacity}"/>`).join("")}
    </g>
    <g filter="url(#blue-soft)">
      <path fill="url(#blue-tr)" d="${e.topRight}${v.corners.topRight}"/>
      <circle cx="${v.disc.cx}" cy="${v.disc.cy}" r="${v.disc.r}" fill="url(#blue-disc)"/>
      <path fill="url(#blue-l)" d="${e.left}Z"/>
      <path fill="url(#blue-r)" d="${e.right}Z"/>
      <path fill="url(#blue-br)" d="${e.bottomRight}${v.corners.bottomRight}"/>
    </g>
  </g>

  <g opacity="${t.light}" fill="none" stroke="#fff" stroke-linecap="round">
    <g filter="url(#light-glow)">
      <path d="${e.topRight}" stroke-width="44" stroke-opacity="0.55"/>
      <path d="${e.left}" stroke-width="26" stroke-opacity="0.55"/>
      <path d="${e.leftInner}" stroke-width="30" stroke-opacity="0.35"/>
      <path d="${e.leftRibbon}" stroke-width="64" stroke-opacity="0.4"/>
      <path d="${e.right}" stroke-width="22" stroke-opacity="0.5"/>
      <path d="${e.bottomRight}" stroke-width="30" stroke-opacity="0.45"/>
    </g>
    <g filter="url(#light-edge)">
      ${rims.map((r) => `<path d="${r.d}" stroke-width="${r.w}" stroke-opacity="${r.o}"/>`).join("")}
    </g>
  </g>
</svg>`;
}
