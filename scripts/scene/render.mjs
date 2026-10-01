// Arka plan çizimini WebP'ye dönüştürür: `npm run scene`
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { buildScene } from "./art.mjs";

const OUT = new URL("../../public/scene/", import.meta.url);
const SIZES = { portrait: 1440, landscape: 2400 };

await mkdir(OUT, { recursive: true });

for (const [variant, width] of Object.entries(SIZES)) {
  for (const theme of ["light", "dark"]) {
    const svg = buildScene(variant, theme, width);
    const file = new URL(`${variant}-${theme}.webp`, OUT);
    const info = await sharp(Buffer.from(svg))
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(fileURLToPath(file));
    console.log(`${variant}-${theme}.webp  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
