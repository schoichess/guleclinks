/**
 * Sayfadaki tüm içerik ve bağlantı adresleri bu dosyadan yönetilir.
 *
 * `url: null` olan kartlar erişilebilir biçimde devre dışı gösterilir
 * ("Yakında" etiketiyle, tıklanamaz). Gerçek adresi yazdığınız anda kart
 * otomatik olarak etkin bir bağlantıya dönüşür.
 */

export type LinkIcon =
  | "website"
  | "behance"
  | "github"
  | "linkedin"
  | "instagram"
  | "mail";

export type ProfileLink = {
  id: string;
  label: string;
  /** Tam adres: `https://…` veya iletişim için `mailto:…` */
  url: string | null;
  icon: LinkIcon;
};

export type Profile = {
  name: string;
  initials: string;
  tagline: string;
  location: string;
  links: ProfileLink[];
  contact: ProfileLink;
};

export const profile: Profile = {
  name: "Umut Güleç",
  initials: "UG",
  tagline: "Tasarım & Yazılım",
  location: "İzmir, Türkiye",
  links: [
    {
      id: "website",
      label: "Web sitesi",
      url: "https://gulecdev.vercel.app/tr",
      icon: "website",
    },
    {
      id: "behance",
      label: "Behance",
      url: "https://www.behance.net/schoiches",
      icon: "behance",
    },
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/schoichess",
      icon: "github",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/schoiches/",
      icon: "linkedin",
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/uumutumuu/",
      icon: "instagram",
    },
  ],
  contact: {
    id: "contact",
    label: "Birlikte çalışalım",
    url: "mailto:gulecdevelopment@gmail.com",
    icon: "mail",
  },
};
