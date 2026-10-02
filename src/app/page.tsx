import type { CSSProperties } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { profile } from "@/config/profile";
import { AmbientScene } from "@/components/ambient-scene";
import { LinkCard } from "@/components/link-card";
import { ThemeToggle } from "@/components/theme-toggle";

const order = (i: number) => ({ "--i": i }) as CSSProperties;

// Açılış sırası: avatar 0 → başlık 1 → alt başlık 2 → bağlantılar 3…7 → iletişim 8
const LINKS_START = 3;
const CONTACT_ORDER = LINKS_START + profile.links.length;

export default function Home() {
  return (
    <>
      <AmbientScene />

      <main className="page">
        <div className="column">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>

          <header className="profile mt-(--sp-toggle-avatar) flex flex-col items-center text-center">
            <div className="avatar glass enter" style={order(0)} aria-hidden="true">
              {profile.photo ? (
                <>
                  <Image
                    className="avatar-photo"
                    src={profile.photo}
                    alt=""
                    priority
                    sizes="(min-width: 480px) 184px, 140px"
                  />
                  <span className="avatar-sheen" />
                </>
              ) : (
                <span className="avatar-initials">{profile.initials}</span>
              )}
            </div>
            <h1 className="profile-name enter mt-(--sp-avatar-title)" style={order(1)}>
              {profile.name}
            </h1>
            <p className="profile-tagline scrimmed enter mt-(--sp-title-tagline)" style={order(2)}>
              {profile.tagline}
            </p>
          </header>

          <nav aria-label="Bağlantılar" className="mt-(--sp-tagline-links)">
            <ul className="flex flex-col gap-(--card-gap)">
              {profile.links.map((link, i) => (
                <li key={link.id}>
                  <LinkCard link={link} order={LINKS_START + i} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-(--sp-links-contact)">
            <LinkCard link={profile.contact} order={CONTACT_ORDER} accent />
          </div>

          <footer className="mt-(--sp-contact-location) flex justify-center">
            <p className="location scrimmed enter" style={order(CONTACT_ORDER)}>
              <MapPin className="location-pin" size={17} strokeWidth={1.5} aria-hidden="true" />
              {profile.location}
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
