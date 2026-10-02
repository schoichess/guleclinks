// Arka plan çizimini WebP'ye dönüştürür: `npm run scene`
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { buildScene } from "./art.mjs";

const OUT = new URL("../../public/scene/", import.meta.url);
const SIZES = { portrait: 1440, landscape: 2400 };

await mkdir(OUT, { recursive: true });

// Her yön × tema için iki katman: arka (opak) ve ön (saydam, alfa kanallı)
for (const [variant, width] of Object.entries(SIZES)) {
  for (const theme of ["light", "dark"]) {
    for (const part of ["back", "front"]) {
      // Ön katman bulanık ve saydam: %75 çözünürlük + kayıplı alfa yeterli
      const w = part === "front" ? Math.round(width * 0.75) : width;
      const svg = buildScene(variant, theme, w, part);
      const name = `${variant}-${theme}-${part}.webp`;
      const info = await sharp(Buffer.from(svg))
        .webp(
          part === "front"
            ? { quality: 78, alphaQuality: 55, effort: 6, smartSubsample: true }
            : { quality: 82, effort: 6, smartSubsample: true },
        )
        .toFile(fileURLToPath(new URL(name, OUT)));
      console.log(`${name}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
    }
  }
}
