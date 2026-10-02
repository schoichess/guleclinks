export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** Tarayıcı arayüzü (adres çubuğu) renkleri */
export const THEME_COLORS: Record<Theme, string> = {
  light: "#F7FAFD", // Frost White
  dark: "#2D3A4D", // Deep Cool Gray
};

/**
 * İlk boyamadan önce <head> içinde çalışır: kayıtlı temayı uygular,
 * böylece yanlış tema parlaması ve hydration uyuşmazlığı oluşmaz.
 * Kayıt yoksa açık tema (sunucu varsayılanı) kalır.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
