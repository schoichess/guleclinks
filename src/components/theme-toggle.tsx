"use client";

import { useEffect, useId, useSyncExternalStore } from "react";
import { Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { THEME_COLORS, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // Başka sekmede yapılan seçimi de uygula.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    if (event.newValue === "dark" || event.newValue === "light") applyTheme(event.newValue);
  };
  window.addEventListener("storage", onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const getServerSnapshot = (): Theme => "light";

/**
 * Referanstaki dolgulu ince hilal. Lucide'de dolgulu hilal yok (dolgulu "moon"
 * ısırılmış bir top gibi görünüyor), bu yüzden iki daireyle çiziliyor.
 */
function CrescentIcon({ className }: { className?: string }) {
  const maskId = useId();
  return (
    <svg className={className} viewBox="0 0 24 24" width={30} height={30} aria-hidden="true" focusable="false">
      <mask id={maskId}>
        <rect width="24" height="24" fill="#fff" />
        <circle cx="17.6" cy="6.6" r="8.6" fill="#000" />
      </mask>
      <circle cx="12" cy="12" r="10.4" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

/**
 * Tema renkleri View Transitions ile 350 ms'de çapraz geçer: tarayıcı eski ve
 * yeni görünümün birer görüntüsünü alıp GPU'da harmanlar; geçiş boyunca hiçbir
 * öğe yeniden boyanmaz. Desteklemeyen tarayıcılarda tema anında değişir.
 */
function switchTheme(theme: Theme) {
  if (typeof document.startViewTransition !== "function") {
    applyTheme(theme);
    return;
  }
  document.startViewTransition(() => applyTheme(theme));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduce = useReducedMotion();
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Koyu temaya geç" : "Açık temaya geç";

  // Mobil tarayıcı çubuğunun rengini temayla eşitle.
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[theme]);
  }, [theme]);

  return (
    <motion.button
      type="button"
      className="theme-toggle glass enter"
      aria-label={label}
      title={label}
      whileTap={reduce ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      onClick={() => {
        switchTheme(next);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
          // Gizli sekme vb.: seçim yalnızca bu oturumda geçerli olur.
        }
      }}
    >
      <CrescentIcon className="theme-icon theme-icon--moon" />
      <Sun className="theme-icon theme-icon--sun" size={21} strokeWidth={2} aria-hidden="true" />
    </motion.button>
  );
}
