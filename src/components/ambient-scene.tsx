import { SceneLayer, SceneMotion, type Drift } from "./scene-motion";

/*
 * Arka plan: önceden çizilmiş WebP görseller (kaynak: scripts/scene/art.mjs,
 * `npm run scene` ile yeniden üretilir). Çalışma anında SVG filtresi yoktur;
 * her tema kendi GPU katmanında bir kez rasterize edilir, tema geçişinde
 * yalnızca opaklık değişir.
 */

// Yarım döngüler 19–24 sn; paralaks en fazla 8 px.
const DRIFT: Drift = { depth: 8, ampX: 20, ampY: 16, periodX: 44, periodY: 38, phase: 0 };

export function AmbientScene() {
  return (
    <div className="scene" aria-hidden="true">
      <SceneMotion>
        <SceneLayer drift={DRIFT}>
          <div className="scene-img scene-img--light" />
          <div className="scene-img scene-img--dark" />
        </SceneLayer>
      </SceneMotion>
    </div>
  );
}
