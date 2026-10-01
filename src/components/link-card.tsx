import type { CSSProperties } from "react";
import { Globe, Mail } from "lucide-react";
import type { LinkIcon, ProfileLink } from "@/config/profile";
import { BehanceIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from "./brand-icons";
import { InteractiveCard } from "./interactive-card";

function CardIcon({ name }: { name: LinkIcon }) {
  switch (name) {
    case "website":
      return <Globe size={28} strokeWidth={1.6} aria-hidden="true" />;
    case "mail":
      return <Mail size={28} strokeWidth={1.7} aria-hidden="true" />;
    case "behance":
      return <BehanceIcon size={30} />;
    case "github":
      return <GitHubIcon size={29} />;
    case "linkedin":
      return <LinkedInIcon size={27} />;
    case "instagram":
      return <InstagramIcon size={27} />;
  }
}

type Props = {
  link: ProfileLink;
  /** Açılış sırasındaki yeri (55 ms aralıklarla) */
  order: number;
  accent?: boolean;
};

export function LinkCard({ link, order, accent = false }: Props) {
  const className = `card glass enter${accent ? " card--accent" : ""}`;
  const style = { "--i": order } as CSSProperties;

  const content = (
    <>
      <span className="card-icon" data-icon={link.icon}>
        <CardIcon name={link.icon} />
      </span>
      <span className="card-label">{link.label}</span>
    </>
  );

  if (!link.url) {
    // Adres girilmemiş: yer tutucu bağlantı, devre dışı olarak duyurulur.
    return (
      <a role="link" aria-disabled="true" className={className} style={style}>
        {content}
        <span className="card-soon">Yakında</span>
      </a>
    );
  }

  return (
    <InteractiveCard href={link.url} className={className} style={style}>
      {content}
    </InteractiveCard>
  );
}
