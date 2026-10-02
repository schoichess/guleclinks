import type { Metadata, Viewport } from "next";
import { profile } from "@/config/profile";
import { THEME_COLORS, themeInitScript } from "@/lib/theme";
import "./globals.css";

// Yazı tipi: yalnızca sistem fontları (-apple-system, BlinkMacSystemFont,
// "Segoe UI"). Apple cihazlarında San Francisco kullanılır; harici font dosyası yok.

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.tagline}`,
  description: `${profile.name} · ${profile.tagline} · ${profile.location}`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLORS.light,
};

// Arka plan katmanları ilk boyamaya yetişsin (ekran yönüne göre)
const SCENE_PRELOADS = [
  { href: "/scene/landscape-light-back.webp", media: "(min-aspect-ratio: 1/1)" },
  { href: "/scene/landscape-light-front.webp", media: "(min-aspect-ratio: 1/1)" },
  { href: "/scene/portrait-light-back.webp", media: "(max-aspect-ratio: 1/1)" },
  { href: "/scene/portrait-light-front.webp", media: "(max-aspect-ratio: 1/1)" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {SCENE_PRELOADS.map(({ href, media }) => (
          <link key={href} rel="preload" as="image" href={href} media={media} fetchPriority="high" />
        ))}
        <noscript>
          <style>{".theme-toggle{visibility:hidden}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
