"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "./StoreProvider";
import { LOGO } from "@/lib/constants";

export function Header() {
  const { t, toggleLang } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#menu", label: t.navMenu },
    { href: "#avis", label: t.navReviews },
    { href: "#order", label: t.navContact },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-crust/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-app items-center gap-3 px-[18px] py-[11px] lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Maripossa">
          <span className="relative h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded-full bg-night shadow-[0_2px_10px_rgba(0,0,0,.3)] ring-1 ring-white/15">
            <Image src={LOGO} alt="Maripossa" fill sizes="40px" className="object-cover" priority />
          </span>
          <span className="flex flex-col leading-tight">
            <span
              className={`font-display text-[19px] font-semibold tracking-wide transition-colors ${
                scrolled ? "text-ink" : "text-cream"
              }`}
            >
              Maripossa
            </span>
            <span className="mt-[1px] text-[9px] font-bold uppercase tracking-[3px] text-amber">
              Zarzis · 10→3h
            </span>
          </span>
        </a>

        {/* desktop nav */}
        <nav className="ms-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-full px-[15px] py-[8px] text-[14px] font-semibold transition-colors ${
                scrolled
                  ? "text-ink/75 hover:bg-ink/5 hover:text-ink"
                  : "text-cream/80 hover:bg-white/10 hover:text-cream"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={toggleLang}
          aria-label="Switch language"
          className={`ms-auto flex h-[34px] min-w-[40px] items-center justify-center rounded-full border-[1.5px] px-[13px] text-[13px] font-bold transition-colors md:ms-2 ${
            scrolled
              ? "border-ember text-ember hover:bg-ember hover:text-white"
              : "border-amber/70 text-amber hover:bg-amber hover:text-night"
          }`}
        >
          {t.langBtn}
        </motion.button>
      </div>
    </header>
  );
}
