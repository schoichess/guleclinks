"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

/**
 * Arka plan katmanlarının tek hareket döngüsü: yavaş süzülme + imleç paralaksı.
 *
 * Performans:
 * - Süzülme saniyede ~20 kez güncellenir. Hareket o kadar yavaş ki adım başına
 *   kayma 0.2 px'in altında kalır; fark edilmez ama camların arkasındaki blur
 *   saniyede 60–120 yerine 20 kez yeniden hesaplanır.
 * - İmleç hareket ederken (paralaks yayı çalışırken) ~30 kez/sn güncellenir;
 *   arka plan yavaş ve bulanık olduğu için fark edilmez, cam yüzeylerin
 *   yeniden hesaplanması yarıya iner.
 * - Yalnızca transform yazılır, React render'ı tetiklenmez.
 */

export type Drift = {
  /** Paralaks: imleç ekran kenarındayken en fazla kaç px kayar */
  depth: number;
  /** Süzülme genliği (px) */
  ampX: number;
  ampY: number;
  /** Tam döngü süresi (sn); yarım döngü 19–24 sn */
  periodX: number;
  periodY: number;
  phase: number;
};

type Register = (el: HTMLElement, drift: Drift) => () => void;

const SceneContext = createContext<Register | null>(null);

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const IDLE_FRAME_MS = 50;
const FOLLOW_FRAME_MS = 33;
const TAU = Math.PI * 2;

export function SceneMotion({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const layers = useRef(new Map<HTMLElement, Drift>());
  const lastWrite = useRef(-Infinity);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 50, damping: 18, mass: 0.9 });
  const y = useSpring(rawY, { stiffness: 50, damping: 18, mass: 0.9 });

  const register = useCallback<Register>((el, drift) => {
    layers.current.set(el, drift);
    return () => {
      layers.current.delete(el);
    };
  }, []);

  // Açılış animasyonu bittikten sonra tema görsellerini ayrı katmanlara hazırla.
  useEffect(() => {
    const root = document.documentElement;
    const warm = () => root.setAttribute("data-scene-ready", "");
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const timer = window.setTimeout(() => idle(warm), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  // İmleç yalnızca hassas işaretçili (fare) cihazlarda izlenir.
  useEffect(() => {
    if (reduce) {
      rawX.jump(0);
      rawY.jump(0);
      layers.current.forEach((_, el) => {
        el.style.transform = "";
      });
      return;
    }

    const query = window.matchMedia(FINE_POINTER);
    let detach = () => {};

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    const attach = () => {
      detach();
      if (!query.matches) {
        onLeave();
        return;
      }
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      detach = () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    };

    attach();
    query.addEventListener("change", attach);
    return () => {
      detach();
      query.removeEventListener("change", attach);
    };
  }, [reduce, rawX, rawY]);

  useAnimationFrame((time) => {
    if (reduce !== false) return;
    const following = x.isAnimating() || y.isAnimating();
    if (time - lastWrite.current < (following ? FOLLOW_FRAME_MS : IDLE_FRAME_MS)) return;
    lastWrite.current = time;

    const t = time / 1000;
    const px = x.get();
    const py = y.get();
    layers.current.forEach((d, el) => {
      const dx = d.ampX * Math.sin((t / d.periodX) * TAU + d.phase) - px * d.depth;
      const dy = d.ampY * Math.sin((t / d.periodY) * TAU + d.phase * 1.7) - py * d.depth;
      el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
    });
  });

  return <SceneContext.Provider value={register}>{children}</SceneContext.Provider>;
}

export function SceneLayer({ drift, children }: { drift: Drift; children: ReactNode }) {
  const register = useContext(SceneContext);
  const ref = useRef<HTMLDivElement>(null);
  const { depth, ampX, ampY, periodX, periodY, phase } = drift;

  useEffect(() => {
    if (!register || !ref.current) return;
    return register(ref.current, { depth, ampX, ampY, periodX, periodY, phase });
  }, [register, depth, ampX, ampY, periodX, periodY, phase]);

  return (
    <div ref={ref} className="scene-layer">
      {children}
    </div>
  );
}
