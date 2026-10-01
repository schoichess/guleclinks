"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Transition,
  type Variants,
} from "motion/react";

const GLARE_WIDTH = 220;

const spring: Transition = { type: "spring", stiffness: 400, damping: 32 };

const cardVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -2, scale: 1.015 },
  press: { scale: 0.985 },
};

const arrowVariants: Variants = {
  rest: { x: 0, y: 0 },
  hover: { x: 2, y: -2 },
};

type Props = {
  href: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function InteractiveCard({ href, className, style, children }: Props) {
  const reduce = useReducedMotion();

  // Yansıma konumu ve görünürlüğü: Motion değerleri, React render'ı yok.
  // Yansıma kart yüksekliğinde yumuşak bir elipstir ve kart içinde kalacak şekilde
  // sınırlanır; böylece köşe kırpması (ekstra GPU maske geçişi) gerekmez.
  const rawX = useMotionValue(0);
  const glareX = useSpring(rawX, { stiffness: 520, damping: 42 });
  const glareOpacity = useMotionValue(0);

  const placeGlare = (event: PointerEvent<HTMLAnchorElement>, instant: boolean) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = el.offsetWidth;
    const pointer = ((event.clientX - rect.left) * width) / rect.width;
    const x = Math.min(Math.max(pointer - GLARE_WIDTH / 2, 0), width - GLARE_WIDTH);
    if (instant || reduce) glareX.jump(x);
    rawX.set(x);
  };

  const fadeGlare = (to: number, duration: number) =>
    animate(glareOpacity, to, { duration, ease: "easeOut" });

  const isMouse = (event: PointerEvent) => event.pointerType === "mouse";

  return (
    <motion.a
      href={href}
      className={className}
      style={style}
      variants={reduce ? undefined : cardVariants}
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      whileTap={reduce ? undefined : "press"}
      transition={spring}
      onPointerEnter={(event) => {
        if (!isMouse(event)) return;
        placeGlare(event, true);
        fadeGlare(1, 0.25);
      }}
      onPointerMove={(event) => {
        if (isMouse(event)) placeGlare(event, false);
      }}
      onPointerLeave={(event) => {
        if (isMouse(event)) fadeGlare(0, 0.35);
      }}
      onPointerDown={(event) => {
        // Dokunmatik: imleç takibi yerine dokunulan noktada kısa bir ışık.
        if (isMouse(event)) return;
        placeGlare(event, true);
        fadeGlare(1, 0.12);
      }}
      onPointerUp={(event) => {
        if (!isMouse(event)) fadeGlare(0, 0.45);
      }}
      onPointerCancel={() => fadeGlare(0, 0.3)}
    >
      <span className="card-shadow" aria-hidden="true" />
      <span className="card-hover" aria-hidden="true" />
      <motion.span
        className="card-glare"
        aria-hidden="true"
        style={{ x: glareX, opacity: glareOpacity }}
      />
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
