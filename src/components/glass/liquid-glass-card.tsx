"use client";

import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ArrowUpRight } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type Transition,
  type Variants,
} from "motion/react";
import { glassMotion as G } from "@/config/motion";
import { bumpMap, edgeMapX, edgeMapY, LENS_NEUTRAL, supportsBackdropLens } from "./lens-maps";

/*
 * Liquid Glass bağlantı kartı (yeniden kullanılabilir).
 *
 * Katmanlar (alttan üste): arka plan kırılması (backdrop-filter) → cam dolgu →
 * gölge → hover dolgusu ve çift kenar yansıması → imleci izleyen ışık → içerik.
 * Kırılma yalnızca camın arkasına uygulanır; metin, ikon ve ok etkilenmez.
 * İmleç, ışık, eğim ve kırılma gücü Motion değerleriyle doğrudan DOM/SVG'ye
 * yazılır; hiçbir pointer olayı React render'ı tetiklemez.
 */

const spring = G.spring as Transition;

const cardVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -G.hover.lift, scale: G.hover.scale },
  press: { scale: G.press.scale },
};

const arrowVariants: Variants = {
  rest: { x: 0, y: 0 },
  hover: { x: G.arrow.x, y: G.arrow.y },
};

/** Dinlenme durumundaki cam bulanıklığı; kırılma bunun önüne eklenir. */
const BASE_BACKDROP =
  "blur(var(--glass-blur)) saturate(var(--glass-saturate)) brightness(var(--glass-brightness))";

type Props = {
  href: string;
  /** Hafif mavi vurgulu (iletişim) kart */
  accent?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function LiquidGlassCard({ href, accent = false, className = "", style, children }: Props) {
  const reduce = useReducedMotion();
  const filterId = `lens-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const cardRef = useRef<HTMLAnchorElement>(null);
  const edgeXRef = useRef<SVGFEImageElement>(null);
  const edgeYRef = useRef<SVGFEImageElement>(null);
  const bumpRef = useRef<SVGFEImageElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const lensAnim = useRef<AnimationPlaybackControls | null>(null);

  // İmlecin kart içindeki konumu (px), yumuşatılmış
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, G.glare.follow);
  const sy = useSpring(py, G.glare.follow);
  const glareX = useTransform(sx, (v) => v - G.glare.size / 2);
  const glareY = useTransform(sy, (v) => v - G.glare.size / 2);
  const glareOpacity = useMotionValue(0);

  // Eğim: −1…1 → en fazla ±maxDeg
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const tiltX = useSpring(nx, { stiffness: 260, damping: 30 });
  const tiltY = useSpring(ny, { stiffness: 260, damping: 30 });
  const rotateY = useTransform(tiltX, (v) => v * G.tilt.maxDeg);
  const rotateX = useTransform(tiltY, (v) => -v * G.tilt.maxDeg);

  // Kırılma gücü (feDisplacementMap scale)
  const lensScale = useMotionValue(0);

  // Kırılma haritalarını kart boyutuna göre hazırla (yalnızca destekleyen motorda).
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !supportsBackdropLens()) return;

    bumpRef.current?.setAttribute("href", bumpMap());
    const fit = () => {
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const ex = edgeXRef.current;
      const ey = edgeYRef.current;
      if (!ex || !ey || !w || !h) return;
      ex.setAttribute("href", edgeMapX(w, G.lens.edgeRampX));
      ey.setAttribute("href", edgeMapY(h, G.lens.edgeRampY));
      for (const el of [ex, ey]) {
        el.setAttribute("width", String(w));
        el.setAttribute("height", String(h));
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Motion değerlerini SVG filtresine yaz.
  useEffect(() => {
    const r = G.lens.bumpRadius;
    const offX = sx.on("change", (v) => bumpRef.current?.setAttribute("x", (v - r).toFixed(1)));
    const offY = sy.on("change", (v) => bumpRef.current?.setAttribute("y", (v - r).toFixed(1)));
    const offS = lensScale.on("change", (v) =>
      dispRef.current?.setAttribute("scale", v.toFixed(2)),
    );
    return () => {
      offX();
      offY();
      offS();
      lensAnim.current?.stop();
    };
  }, [sx, sy, lensScale]);

  const lensEnabled = () => !reduce && supportsBackdropLens();

  const startLens = (card: HTMLAnchorElement) => {
    if (!lensEnabled()) return;
    card.style.setProperty("backdrop-filter", `url(#${filterId}) ${BASE_BACKDROP}`);
    lensAnim.current?.stop();
    lensAnim.current = animate(lensScale, G.lens.edgeScale, {
      duration: G.lens.fadeIn,
      ease: "easeOut",
    });
  };

  const stopLens = (card: HTMLAnchorElement) => {
    if (!card.style.getPropertyValue("backdrop-filter")) return;
    lensAnim.current?.stop();
    lensAnim.current = animate(lensScale, 0, {
      duration: G.lens.fadeOut,
      ease: "easeOut",
      onComplete: () => card.style.removeProperty("backdrop-filter"),
    });
  };

  const local = (event: PointerEvent<HTMLAnchorElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    return {
      x: ((event.clientX - rect.left) * w) / rect.width,
      y: ((event.clientY - rect.top) * h) / rect.height,
      w,
      h,
    };
  };

  const place = (event: PointerEvent<HTMLAnchorElement>, instant: boolean) => {
    const p = local(event);
    if (instant || reduce) {
      sx.jump(p.x);
      sy.jump(p.y);
    }
    px.set(p.x);
    py.set(p.y);
    if (!reduce) {
      nx.set((p.x / p.w) * 2 - 1);
      ny.set((p.y / p.h) * 2 - 1);
    }
  };

  const fadeGlare = (to: number, duration: number) =>
    animate(glareOpacity, to, { duration, ease: "easeOut" });

  const settle = (card: HTMLAnchorElement) => {
    nx.set(0);
    ny.set(0);
    stopLens(card);
    card.removeAttribute("data-active");
  };

  const isMouse = (event: PointerEvent) => event.pointerType === "mouse";

  return (
    <motion.a
      ref={cardRef}
      href={href}
      className={`card glass${accent ? " card--accent" : ""}${className ? ` ${className}` : ""}`}
      style={{
        ...style,
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: G.tilt.perspective,
      }}
      variants={reduce ? undefined : cardVariants}
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      whileTap={reduce ? undefined : "press"}
      transition={spring}
      onPointerEnter={(event) => {
        if (!isMouse(event)) return;
        event.currentTarget.setAttribute("data-active", "");
        place(event, true);
        fadeGlare(1, 0.25);
        startLens(event.currentTarget);
      }}
      onPointerMove={(event) => {
        if (isMouse(event)) place(event, false);
      }}
      onPointerLeave={(event) => {
        if (!isMouse(event)) return;
        fadeGlare(0, 0.35);
        settle(event.currentTarget);
      }}
      onPointerDown={(event) => {
        // Dokunmatik: kalıcı hover yerine dokunulan noktada kısa bir ışık.
        if (isMouse(event)) return;
        const p = local(event);
        sx.jump(p.x);
        sy.jump(p.y);
        fadeGlare(1, 0.12);
      }}
      onPointerUp={(event) => {
        if (!isMouse(event)) fadeGlare(0, 0.45);
      }}
      onPointerCancel={(event) => {
        fadeGlare(0, 0.3);
        settle(event.currentTarget);
      }}
    >
      {/* Kartın kendi kırılma filtresi (yalnızca hover sırasında devreye girer) */}
      <svg className="card-lens-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter
          id={filterId}
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage ref={edgeXRef} x="0" y="0" preserveAspectRatio="none" result="ex" />
          <feImage ref={edgeYRef} x="0" y="0" preserveAspectRatio="none" result="ey" />
          <feComposite in="ex" in2="ey" operator="arithmetic" k2="1" k3="1" result="edge" />
          <feFlood floodColor={LENS_NEUTRAL} result="neutral" />
          <feImage
            ref={bumpRef}
            x="-999"
            y="-999"
            width={G.lens.bumpRadius * 2}
            height={G.lens.bumpRadius * 2}
            preserveAspectRatio="none"
            result="bumpImage"
          />
          <feComposite in="bumpImage" in2="neutral" operator="over" result="bump" />
          <feComposite
            in="edge"
            in2="bump"
            operator="arithmetic"
            k2="1"
            k3="1"
            k4="-0.5"
            result="map"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="map"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <span className="card-shadow" aria-hidden="true" />
      <span className="card-hover" aria-hidden="true" />
      <span className="card-rim2" aria-hidden="true" />
      <span className="card-glare-clip" aria-hidden="true">
        <motion.span
          className="card-glare"
          style={{ x: glareX, y: glareY, opacity: glareOpacity }}
        />
      </span>

      {children}

      <motion.span
        className="card-arrow"
        aria-hidden="true"
        variants={reduce ? undefined : arrowVariants}
        transition={spring}
      >
        <ArrowUpRight strokeWidth={1.5} />
      </motion.span>
    </motion.a>
  );
}
