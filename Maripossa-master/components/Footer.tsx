"use client";

import Image from "next/image";
import { useStore } from "./StoreProvider";
import {
  ClockIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
} from "./Icons";
import {
  ADDRESS_LINE,
  HOURS,
  LINKS,
  LOGO,
  PHONE_LOCAL,
} from "@/lib/constants";
import { contact } from "@/lib/fpixel";

export function Footer() {
  const { t } = useStore();

  const nav = [
    { href: "#menu", label: t.navMenu },
    { href: "#avis", label: t.navReviews },
    { href: "#order", label: t.navContact },
  ];

  const socials = [
    { href: LINKS.facebook, label: "Facebook", Icon: FacebookIcon, bg: "#1877F2" },
    { href: LINKS.instagram, label: "Instagram", Icon: InstagramIcon, bg: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)" },
    { href: LINKS.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon, bg: "#25D366" },
  ];

  return (
    <footer className="relative overflow-hidden bg-night text-cream/85">
      <div className="grain pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto w-full max-w-app px-[18px] pb-[100px] pt-14 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-10">
          {/* brand */}
          <div className="order-1 col-span-2 flex flex-col items-center text-center lg:order-1 lg:col-span-1 lg:items-start lg:text-start">
            <span className="relative block h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/15 shadow-[0_0_20px_rgba(228,85,42,0.2)]">
              <Image src={LOGO} alt="Maripossa" fill sizes="80px" className="object-cover" />
            </span>
            <span className="mt-4 font-display text-[26px] font-semibold tracking-wide text-cream">
              Maripossa
            </span>
            <p className="mt-2 font-display text-[14px] italic leading-[1.5] text-amber">
              {t.tagline}
            </p>
          </div>

          {/* navigation */}
          <nav className="order-2 col-span-1 flex flex-col items-center text-center gap-4 lg:order-2 lg:items-start lg:text-start">
            <h3 className="text-[11px] font-bold uppercase tracking-[2.5px] text-amber">
              {t.footerExplore}
            </h3>
            <div className="flex flex-col items-center gap-3 lg:items-start">
              {nav.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="w-fit text-[15px] font-medium text-cream/75 transition-colors hover:text-cream"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </nav>

          {/* follow */}
          <div className="order-3 col-span-1 flex flex-col items-center text-center gap-4 lg:order-4 lg:items-start lg:text-start">
            <h3 className="text-[11px] font-bold uppercase tracking-[2.5px] text-amber">
              {t.footerFollow}
            </h3>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              {socials.map(({ href, label, Icon, bg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={
                    label === "WhatsApp"
                      ? () => contact({ method: "whatsapp", source: "footer" })
                      : undefined
                  }
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-[14px] text-white shadow-card-sm transition-transform hover:-translate-y-1"
                  style={{ background: bg }}
                >
                  <Icon width={20} height={20} />
                </a>
              ))}
            </div>
          </div>

          {/* contact */}
          <div className="order-4 col-span-2 flex flex-col items-center gap-4 lg:order-3 lg:col-span-1 lg:items-start">
            <h3 className="text-[11px] font-bold uppercase tracking-[2.5px] text-amber">
              {t.footerContact}
            </h3>
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <PinIcon width={15} height={15} />
                </span>
                <span className="text-[14px] leading-[1.6] text-cream/85 text-center lg:text-start">{ADDRESS_LINE}</span>
              </div>
              <a
                href={LINKS.tel}
                onClick={() => contact({ method: "phone", source: "footer" })}
                className="group flex items-center gap-3 transition-colors hover:text-cream"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-white/20">
                  <PhoneIcon width={15} height={15} />
                </span>
                <span className="text-[15px] font-bold text-cream/90">{PHONE_LOCAL}</span>
              </a>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <ClockIcon width={15} height={15} />
                </span>
                <span className="text-[14px] font-medium text-cream/85">{HOURS}</span>
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col items-center text-center gap-3 border-t border-white/10 pt-6 text-[11px] text-muted-d sm:flex-row sm:justify-between sm:text-start">
          <span>© 2026 Maripossa · Pizzeria &amp; Fast-Food · Zarzis</span>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <span>{t.footerRights}</span>
            <span className="opacity-75">
              {t.developedBy}{" "}
              <a
                href="https://www.instagram.com/kh__med_ali/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-amber transition-colors hover:text-white underline decoration-amber/40 underline-offset-4 hover:decoration-white/80"
              >
                Mohamed Ali Khlifi 
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
