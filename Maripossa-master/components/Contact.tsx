"use client";

import { useStore } from "./StoreProvider";
import { Reveal } from "./Reveal";
import {
  ClockIcon,
  PhoneIcon,
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
} from "./Icons";
import { ADDRESS_LINE, LINKS, PHONE_LOCAL } from "@/lib/constants";
import { contact } from "@/lib/fpixel";

export function Contact() {
  const { t } = useStore();

  return (
    <section id="order" className="scroll-mt-[120px] px-[18px] pb-6 pt-16">
      <Reveal className="mx-auto max-w-xl text-center">
        <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-ember">
          {t.contactKicker}
        </div>
        <h2 className="mt-2 font-display text-[32px] font-semibold leading-tight text-ink md:text-[42px]">
          {t.contactTitle}
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="mx-auto mt-7 max-w-xl">
        <div className="mb-6 space-y-3">
          <a
            href={LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 rounded-[20px] bg-[#1877F2] px-5 py-4 shadow-[0_14px_30px_-10px_rgba(24,119,242,.6)] transition-transform hover:-translate-y-0.5"
          >
            <span className="flex-shrink-0 text-white">
              <FacebookIcon width={30} height={30} />
            </span>
            <span>
              <span className="block text-[15px] font-extrabold text-white">Facebook</span>
              <span className="block text-[12px] text-white/85">@maripossa.zarzis</span>
            </span>
            <span className="ms-auto text-[22px] font-bold text-white rtl:scale-x-[-1]">›</span>
          </a>

          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 rounded-[20px] px-5 py-4 shadow-[0_14px_30px_-10px_rgba(221,42,123,.6)] transition-transform hover:-translate-y-0.5"
            style={{ background: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)" }}
          >
            <span className="flex-shrink-0 text-white">
              <InstagramIcon width={30} height={30} />
            </span>
            <span>
              <span className="block text-[15px] font-extrabold text-white">Instagram</span>
              <span className="block text-[12px] text-white/85">@maripossa_zarzis</span>
            </span>
            <span className="ms-auto text-[22px] font-bold text-white rtl:scale-x-[-1]">›</span>
          </a>

          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => contact({ method: "whatsapp", source: "contact" })}
            className="flex items-center gap-3.5 rounded-[20px] bg-[#25D366] px-5 py-4 shadow-[0_14px_30px_-10px_rgba(37,211,102,.6)] transition-transform hover:-translate-y-0.5"
          >
            <span className="flex-shrink-0 text-[#0b3d1e]">
              <WhatsAppIcon width={30} height={30} />
            </span>
            <span>
              <span className="block text-[15px] font-extrabold text-[#073b1a]">{t.waTitle}</span>
              <span className="block text-[12px] text-[#0b3d1e]/85">+216 {PHONE_LOCAL}</span>
            </span>
            <span className="ms-auto text-[22px] font-bold text-[#0b3d1e] rtl:scale-x-[-1]">›</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-line bg-surface p-4 shadow-card-sm">
            <span className="text-ember">
              <ClockIcon width={22} height={22} />
            </span>
            <div className="mt-2 text-[13px] font-bold text-ink">{t.hoursTitle}</div>
            <div className="mt-0.5 whitespace-pre-line text-[12px] leading-[1.4] text-muted">
              {t.hoursVal}
            </div>
          </div>
          <a
            href={LINKS.tel}
            onClick={() => contact({ method: "phone", source: "contact" })}
            className="rounded-[18px] border border-line bg-surface p-4 shadow-card-sm transition-colors hover:border-ember/40"
          >
            <span className="text-ember">
              <PhoneIcon width={22} height={22} />
            </span>
            <div className="mt-2 text-[13px] font-bold text-ink">{t.callTitle}</div>
            <div className="mt-0.5 text-[12px] text-muted">{PHONE_LOCAL}</div>
          </a>
        </div>

        <div className="mt-3 rounded-[16px] border-[1.6px] border-amber/60 bg-amber/15 p-3.5 text-center text-[12.5px] font-bold leading-snug text-ember-d">
          ⚠️ {t.deliveryDisclaimer}
        </div>

        <div className="mt-4 relative block overflow-hidden rounded-[18px] border border-line shadow-card-sm h-[220px] bg-surface">
          <iframe 
            src="https://maps.google.com/maps?q=Maripossa+Pizzeria+Zarzis&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
          {/* Invisible overlay that makes the entire map area a clickable link */}
          <a
            href={LINKS.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10"
            aria-label="Ouvrir sur Google Maps"
          />
        </div>
      </Reveal>
    </section>
  );
}
