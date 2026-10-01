import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { profile } from "@/config/profile";
import { THEME_COLORS, themeInitScript } from "@/lib/theme";
import "./globals.css";

// Apple cihazlarında sistem fontu (SF Pro) kullanılır; Inter yalnızca
// diğer platformlarda gerektiğinde indirilir (preload kapalı).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
});

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" data-theme="light" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Arka plan görseli ilk boyamaya yetişsin */}
        <link
          rel="preload"
          as="image"
          href="/scene/landscape-light.webp"
          media="(min-aspect-ratio: 1/1)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/scene/portrait-light.webp"
          media="(max-aspect-ratio: 1/1)"
          fetchPriority="high"
        />
        <noscript>
          <style>{".theme-toggle{visibility:hidden}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
