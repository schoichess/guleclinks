import { sceneMotion } from "@/config/motion";
import { SceneLayer, SceneMotion } from "./scene-motion";

/*
 * Arka plan: iki katman farklı hızlarda kendiliğinden akar (derinlik hissi).
 *   arka: zemin + saten kıvrımlar (yavaş)
 *   ön:   açık mavi kütleler + kenar ışıkları (daha hızlı, saydam)
 * Görseller önceden çizilmiş WebP'dir (kaynak: scripts/scene/art.mjs,
 * `npm run scene`). Çalışma anında SVG filtresi yoktur; tema geçişinde
 * yalnızca opaklık değişir.
 */
export function AmbientScene() {
  return (
    <div className="scene" aria-hidden="true">
      <SceneMotion>
        <SceneLayer drift={sceneMotion.back}>
          <div className="scene-img scene-img--back-light" />
          <div className="scene-img scene-img--back-dark" />
        </SceneLayer>
        <SceneLayer drift={sceneMotion.front}>
          <div className="scene-img scene-img--front-light" />
          <div className="scene-img scene-img--front-dark" />
        </SceneLayer>
      </SceneMotion>
    </div>
  );
}
