"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useStore } from "./StoreProvider";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/**
 * Open a menu category (accordion) and scroll it into view. Used by the
 * floating hero dishes so tapping one jumps straight to its menu section.
 * The category header is rendered in both the mobile and desktop layouts
 * under the same id, so we scroll to whichever one is actually visible.
 */
function openCategory(setActive: (key: string) => void, key: string) {
  setActive(key);
  window.setTimeout(() => {
    const headers = document.querySelectorAll(`[id="category-${key}"]`);
    for (const el of headers) {
      if (el.getBoundingClientRect().height > 0) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }, 120);
}

const ease = [0.22, 0.8, 0.2, 1] as const;

/** Real wood-fired pizza, shot from above — the star of the hero. */
const PIZZA_IMG = "/pizza_neptune.jpg";

/** Embers drifting up around the pizza. */
const SPARKS = [
  { left: "6%", bottom: "30%", size: 5, delay: 0, dur: 7 },
  { left: "16%", bottom: "10%", size: 4, delay: 2.4, dur: 8.5 },
  { left: "38%", bottom: "4%", size: 6, delay: 1.1, dur: 6.5 },
  { left: "58%", bottom: "8%", size: 4, delay: 3.8, dur: 9 },
  { left: "76%", bottom: "16%", size: 5, delay: 0.6, dur: 7.5 },
  { left: "90%", bottom: "34%", size: 4, delay: 4.6, dur: 8 },
  { left: "26%", bottom: "46%", size: 4, delay: 5.4, dur: 7 },
  { left: "68%", bottom: "42%", size: 6, delay: 2.9, dur: 6.8 },
];

const MARQUEE = {
  fr: "Pizza au feu de bois ✦ Pâte fraîche ✦ Mozzarella fondante ✦ Tacos & Panuozzo ✦ Livraison à Zarzis via partenaires ✦ ",
  ar: "بيتزا على الحطب ✦ عجين طازج ✦ موزاريلا ذائبة ✦ تاكوس و بانوتزو ✦ توصيل بجرجيس عبر شركاء ✦ ",
};

/**
 * Dishes orbiting the pizza — the whole menu at a glance.
 * Panuozzo is the second star: biggest satellite, amber ring, ember label.
 */
const SATELLITES = [
  {
    img: "/cat_panuozzo_v7.jpg",
    label: { fr: "Panuozzo", ar: "بانوتزو" },
    cat: "panuozzo",
    pos: "top-[-4%] start-[-2%] md:top-[-6%] md:start-[-12%] w-[30%]",
    featured: true,
    bobDur: 6.3,
    bobDelay: 0,
    entranceDelay: 0.7,
    depth: -0.7,
  },
  {
    img: "/cat_tacos.png",
    label: { fr: "Tacos", ar: "تاكوس" },
    cat: "tacos",
    pos: "bottom-[-2%] start-[-2%] md:bottom-[12%] md:start-[-3%] w-[21%]",
    featured: false,
    bobDur: 5.2,
    bobDelay: 1.2,
    entranceDelay: 0.85,
    depth: 0.5,
  },
  {
    img: "/cat_pizzwich_v2.jpg",
    label: { fr: "Pizzwich", ar: "بيتزويتش" },
    cat: "pizzwich",
    pos: "top-[38%] start-[-6%] md:top-[34%] md:start-[-18%] w-[17%]",
    featured: false,
    bobDur: 4.8,
    bobDelay: 2.1,
    entranceDelay: 0.95,
    depth: 1.1,
  },
  {
    img: "/cat_paincheese_v2.png",
    label: { fr: "Pain Cheese", ar: "بان تشيز" },
    cat: "paincheese",
    pos: "top-[6%] end-[-2%] md:top-[0%] md:end-[2%] w-[15%]",
    featured: false,
    bobDur: 5.8,
    bobDelay: 0.8,
    entranceDelay: 1.05,
    depth: -0.4,
  },
  {
    img: "/bowl_poulet_v2.png",
    label: { fr: "Bowls", ar: "بولز" },
    cat: "bowls",
    pos: "bottom-[6%] end-[-2%] md:bottom-[10%] md:end-[2%] w-[14%]",
    featured: false,
    bobDur: 4.6,
    bobDelay: 2.6,
    entranceDelay: 1.15,
    depth: 0.9,
  },
];

/** A little CSS Maripossa — two flapping wings and a body. */
function Butterfly({ size }: { size: number }) {
  return (
    <span
      className="relative block"
      style={{
        width: size,
        height: size * 0.82,
        filter: "drop-shadow(0 0 6px rgba(244,169,60,.5))",
      }}
    >
      <span className="hero-wing-l" />
      <span className="hero-wing-r" />
      <span
        className="absolute rounded-full"
        style={{
          left: "46%",
          top: "12%",
          width: "8%",
          height: "76%",
          background: "#2C1E18",
        }}
      />
    </span>
  );
}

export function Hero() {
  const { state, t, setActive } = useStore();
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const rtl = state.lang === "ar";

  // pointer parallax — the pizza leans gently toward the cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const px = useTransform(sx, [-1, 1], [-16, 16]);
  const py = useTransform(sy, [-1, 1], [-10, 10]);
  // satellites drift at different rates for depth
  const dxSlow = useTransform(sx, [-1, 1], [8, -8]);
  const dySlow = useTransform(sy, [-1, 1], [6, -6]);
  const dxFast = useTransform(sx, [-1, 1], [-14, 14]);
  const dyFast = useTransform(sy, [-1, 1], [-9, 9]);

  // scrolling turns the pizza a little further — the page feels mechanical
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 25 : 80]);
  const scrollDrift = useTransform(scrollYProgress, [0, 1], [0, 90]);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
  });

  const titleWords = t.heroTitle.split(" ");

  return (
    <section
      ref={section}
      onPointerMove={onPointerMove}
      className="relative -mt-[63px] overflow-hidden bg-night text-cream"
    >
      {/* ambient heat */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% -5%, rgba(244,169,60,.20), transparent 55%), radial-gradient(70% 50% at 50% 120%, rgba(228,85,42,.18), transparent 60%)",
        }}
      />
      {/* firelight rising from the oven — flickers like a real flame */}
      <div
        className="hero-flicker pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "radial-gradient(60% 90% at 50% 115%, rgba(228,85,42,.34), transparent 65%), radial-gradient(30% 50% at 22% 110%, rgba(244,169,60,.22), transparent 70%)",
        }}
      />
      {/* glow under the pizza — top-center on mobile, text-opposite side on desktop */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(60% 34% at 50% 26%, rgba(228,85,42,.30), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background: rtl
            ? "radial-gradient(36% 54% at 25% 50%, rgba(228,85,42,.32), transparent 70%)"
            : "radial-gradient(36% 54% at 75% 50%, rgba(228,85,42,.32), transparent 70%)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />

      {/* Maripossa butterflies crossing the hero */}
      <div className="hero-fly pointer-events-none absolute start-0 top-[14%] z-10" aria-hidden>
        <Butterfly size={26} />
      </div>
      <div
        className="hero-fly pointer-events-none absolute start-0 top-[58%] z-10 opacity-75"
        style={{ animationDuration: "38s", animationDelay: "-16s" }}
        aria-hidden
      >
        <Butterfly size={18} />
      </div>

      {/* the pizza stage — centered up top on mobile, side stage on desktop */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[92px] w-[min(82vw,370px)] -translate-x-1/2 md:top-1/2 md:w-[max(380px,min(62vh,40vw))] md:-translate-y-1/2 md:translate-x-0 ${
          rtl
            ? "md:right-auto md:left-[max(1.5rem,calc((100vw-1180px)/2+1.5rem))]"
            : "md:left-auto md:right-[max(1.5rem,calc((100vw-1180px)/2+1.5rem))]"
        }`}
      >
        <motion.div style={{ x: px, y: py }} className="relative">
          {/* rolls in from the side like a wheel, then keeps turning */}
          <motion.div
            initial={{ opacity: 0, x: rtl ? "-38vw" : "38vw", rotate: 150 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 42, damping: 15, delay: 0.1 }}
            className="relative aspect-square"
          >
            <motion.div style={{ rotate: scrollRotate, y: scrollDrift }}>
              {/* warm halo + drop shadow grounding the pizza */}
              <div
                className="absolute inset-[-14%] rounded-full"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgba(228,85,42,.30), transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
              <div
                className="absolute inset-x-[8%] bottom-[-7%] h-[13%] rounded-full"
                style={{ background: "rgba(0,0,0,.55)", filter: "blur(18px)" }}
              />

              {/* the photo itself, turning like on a pizza stone */}
              <div className="animate-glowPulse relative aspect-square w-full overflow-hidden rounded-full ring-1 ring-white/10">
                <div className="hero-spin absolute inset-0">
                  <Image
                    src={PIZZA_IMG}
                    alt="Pizza Maripossa cuite au feu de bois"
                    fill
                    priority
                    sizes="(max-width: 768px) 82vw, 52vw"
                    className="scale-[1.06] object-cover"
                  />
                </div>
                {/* soft top light so the photo sits in the page's lighting */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(75% 55% at 50% 12%, rgba(255,236,200,.16), transparent 60%)",
                  }}
                />
              </div>

              {/* steam + embers appear once the pizza has landed */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <span
                  className="hero-steam absolute rounded-full"
                  style={{
                    left: "20%",
                    top: "-9%",
                    width: 70,
                    height: 120,
                    background:
                      "radial-gradient(ellipse at 50% 60%, rgba(255,245,230,.62), transparent 70%)",
                  }}
                />
                <span
                  className="hero-steam absolute rounded-full"
                  style={{
                    left: "44%",
                    top: "-13%",
                    width: 90,
                    height: 150,
                    animationDelay: "2.2s",
                    background:
                      "radial-gradient(ellipse at 50% 60%, rgba(255,245,230,.55), transparent 70%)",
                  }}
                />
                <span
                  className="hero-steam absolute rounded-full"
                  style={{
                    left: "64%",
                    top: "-8%",
                    width: 60,
                    height: 110,
                    animationDelay: "4.1s",
                    background:
                      "radial-gradient(ellipse at 50% 60%, rgba(255,245,230,.62), transparent 70%)",
                  }}
                />
                {SPARKS.map((s, i) => (
                  <span
                    key={`${s.left}-${s.bottom}`}
                    className="hero-spark absolute rounded-full"
                    style={{
                      left: s.left,
                      bottom: s.bottom,
                      width: s.size,
                      height: s.size,
                      animationDelay: `${s.delay}s`,
                      animationDuration: `${s.dur}s`,
                      background: i % 2 ? "#F4A93C" : "#E4552A",
                      boxShadow: "0 0 6px rgba(244,169,60,.8)",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* satellite dishes — tacos, panuozzo, bowls orbit the pizza */}
          {SATELLITES.map((s) => (
            <motion.div
              key={s.label.fr}
              initial={{ opacity: 0, scale: 0.4, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 16,
                delay: s.entranceDelay,
              }}
              className={`absolute z-10 ${s.pos}`}
            >
              <motion.div
                style={s.depth > 0 ? { x: dxFast, y: dyFast } : { x: dxSlow, y: dySlow }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openCategory(setActive, s.cat)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openCategory(setActive, s.cat);
                    }
                  }}
                  aria-label={`${state.lang === "ar" ? "عرض قائمة" : "Voir le menu"} ${s.label[state.lang]}`}
                  className="hero-bob relative cursor-pointer pointer-events-auto"
                  style={{
                    animationDuration: `${s.bobDur}s`,
                    animationDelay: `${s.bobDelay}s`,
                  }}
                >
                  <div
                    className={`relative w-full aspect-square rounded-full overflow-hidden shadow-lift bg-[#FCEBD2] ${
                      s.featured
                        ? "ring-[2.5px] ring-amber/70 shadow-[0_18px_44px_-10px_rgba(228,85,42,.55)]"
                        : "ring-2 ring-white/15"
                    }`}
                  >
                    <Image
                      src={s.img}
                      alt={s.label[state.lang]}
                      fill
                      sizes="(max-width: 768px) 30vw, 16vw"
                      className={s.featured ? "object-contain scale-110" : "object-cover"}
                      style={s.featured ? { WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 75%)", maskImage: "radial-gradient(ellipse at center, black 55%, transparent 75%)" } : undefined}
                    />
                  </div>
                  <span
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[1.5px] backdrop-blur-sm ${
                      s.featured
                        ? "border-amber/40 bg-ember text-white"
                        : "border-white/15 bg-night/80 text-cream/90"
                    }`}
                  >
                    {s.label[state.lang]}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none relative mx-auto flex max-w-app flex-col px-6 pb-10 pt-[92px] md:min-h-[86vh] md:justify-center md:pb-12 md:pt-[63px]">
        {/* on mobile the pizza sits above the text */}
        <div className="h-[44vh] min-h-[300px] md:hidden" />

        <div className="pointer-events-auto relative z-20 mx-auto flex max-w-[540px] flex-col items-center text-center md:mx-0 md:items-start md:text-start">
          <motion.span
            {...appear(0.1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-night/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[2.5px] text-amber backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-basil-l shadow-[0_0_8px_#4E8A4F]" />
            Pizzeria · Fast-Food · Zarzis
          </motion.span>

          {/* headline lands word by word */}
          <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.04] tracking-[-.01em] text-cream md:text-[62px]">
            {titleWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 26, rotate: i % 2 ? 2 : -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                  delay: 0.2 + i * 0.09,
                }}
                className="inline-block will-change-transform"
              >
                {word}
                {i < titleWords.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </h1>

          <motion.p
            {...appear(0.55)}
            className="mt-3 font-display text-[19px] italic text-amber md:text-[24px]"
          >
            {t.tagline}
          </motion.p>

          <motion.p
            {...appear(0.62)}
            className="mt-4 max-w-[440px] text-[15px] leading-[1.6] text-muted-d"
          >
            {t.heroSub}
          </motion.p>

          <motion.div
            {...appear(0.7)}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            <button
              onClick={() => scrollTo("menu")}
              className="rounded-full bg-ember px-7 py-[15px] text-[15px] font-bold text-white shadow-[0_12px_30px_-6px_rgba(228,85,42,.6)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {t.seeMenu}
            </button>
            <button
              onClick={() => scrollTo("order")}
              className="rounded-full border-[1.5px] border-white/25 bg-night/30 px-7 py-[15px] text-[15px] font-bold text-cream backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {t.orderNow}
            </button>
          </motion.div>
        </div>

        {/* editorial marquee — always moving, sets the pizzeria's rhythm */}
        <motion.div
          {...appear(0.85)}
          className="relative mt-14 overflow-hidden border-y border-white/10 py-3 md:mt-16"
        >
          <div className="hero-marquee flex w-max">
            <span className="whitespace-nowrap font-display text-[14px] italic tracking-[2px] text-cream/45">
              {MARQUEE[state.lang]}
            </span>
            <span className="whitespace-nowrap font-display text-[14px] italic tracking-[2px] text-cream/45">
              {MARQUEE[state.lang]}
            </span>
          </div>
        </motion.div>
      </div>

      {/* warm fade into the menu */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-crust" />
    </section>
  );
}
