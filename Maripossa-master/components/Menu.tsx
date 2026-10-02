"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./StoreProvider";
import { viewContent } from "@/lib/fpixel";
import { FoodIcon } from "./Icons";
import { Reveal } from "./Reveal";
import { MENU, catLabel, catNote } from "@/lib/menu";
import { isCustomizable } from "@/lib/customize";
import { formatPrice } from "@/lib/i18n";
import { POPULAR_RE } from "@/lib/constants";
import { pickDesc, pickName, type IconKey, type MenuCategory, type MenuItem } from "@/lib/types";

const ease = [0.22, 0.8, 0.2, 1] as const;

/** Appetizing stand-in imagery per food type until real photos are added. */
const ICON_EMOJI: Record<IconKey, string> = {
  pizza: "🍕",
  sandwich: "🥪",
  taco: "🌮",
  bowl: "🥗",
  drink: "🥤",
  extra: "🍟",
};

/** Group categories to keep navigation clean and organized */
const GROUPS: { fr: string; ar: string; keys: string[] }[] = [
  { fr: "Sandwichs & Tacos", ar: "ساندويتش و تاكوس", keys: ["panuozzo", "pizzwich", "paincheese", "tacos"] },
  { fr: "Pizzas", ar: "بيتزا", keys: ["pizzared", "pizzawhite", "mini"] },
  { fr: "Bowls", ar: "بولز", keys: ["bowls"] },
  { fr: "Boissons & Extras", ar: "مشروبات و إضافات", keys: ["drinks", "supp"] },
];

export function Menu() {
  const { state, t, setActive } = useStore();
  const [navActive, setNavActive] = useState<string>(GROUPS[0].keys[0]);
  const menuRef = useRef<HTMLElement | null>(null);

  // Sync the sticky nav highlight if the user manually opens a category
  useEffect(() => {
    if (state.active) setNavActive(state.active);
  }, [state.active]);

  // Fire a Meta Pixel ViewContent the first time the menu scrolls into view.
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fired) {
          fired = true;
          viewContent({ content_name: "Menu", content_type: "product_group" });
          io.disconnect();
        }
      },
      // The menu is taller than the viewport, so a high ratio is unreachable;
      // fire as soon as any part of it scrolls into view.
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={menuRef} id="menu" className="scroll-mt-[120px] pt-10 pb-24">
      <Reveal className="px-[18px] text-center mb-10">
        <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-ember">
          {t.menuKicker}
        </div>
        <h2 className="mt-2 font-display text-[34px] font-semibold leading-none text-ink md:text-[46px]">
          {t.menuTitle}
        </h2>
      </Reveal>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-[60px] z-30 -mx-[18px] mb-6 bg-crust/95 px-[18px] py-3 backdrop-blur-md md:top-[70px] lg:mx-0 lg:px-0">
        <div className="mx-auto max-w-[1300px] flex flex-wrap items-center justify-center gap-2 pb-1">
          {GROUPS.map((g) => {
            const label = state.lang === "ar" ? g.ar : g.fr;
            const isActiveGroup = g.keys.includes(navActive) || g.keys.includes(state.active);
            
            return (
              <button
                key={g.fr}
                onClick={() => {
                  setActive(g.keys[0]);
                  setNavActive(g.keys[0]);
                  
                  // Don't scroll for bottom categories (drinks/supp) — they're too close to page end
                  if (g.keys.includes("drinks")) return;
                  
                  // Scroll the category into view after accordion expands
                  setTimeout(() => {
                    const elements = document.querySelectorAll(`[id="category-${g.keys[0]}"]`);
                    for (const el of elements) {
                      if (el.getBoundingClientRect().height > 0) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        break;
                      }
                    }
                  }, 450);
                }}
                className={`relative flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-bold transition-colors ${
                  isActiveGroup ? "text-white" : "text-ink/70 hover:text-ink bg-line/30 hover:bg-line/50"
                }`}
              >
                {isActiveGroup && (
                  <motion.div
                    layoutId="activeGroup"
                    className="absolute inset-0 rounded-full bg-ink shadow-card-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {g.keys.includes("pizzared") && <FoodIcon name="pizza" width={15} height={15} className={isActiveGroup ? "text-amber" : "text-ember"} />}
                  {g.keys.includes("panuozzo") && <FoodIcon name="sandwich" width={15} height={15} className={isActiveGroup ? "text-amber" : "text-ember"} />}
                  {g.keys.includes("bowls") && <FoodIcon name="bowl" width={15} height={15} className={isActiveGroup ? "text-amber" : "text-ember"} />}
                  {g.keys.includes("drinks") && <FoodIcon name="drink" width={15} height={15} className={isActiveGroup ? "text-amber" : "text-ember"} />}
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Layout (1 column) */}
      <div className="md:hidden mx-auto max-w-[1300px] px-[18px] flex flex-col gap-4 pb-8">
        {MENU.map((category) => (
          <CategoryAccordion key={category.key} category={category} />
        ))}
      </div>

      {/* Desktop Layout (Grid with expanding rows) */}
      <div className="hidden md:flex flex-col gap-6 mx-auto max-w-[1300px] px-[18px] lg:px-8 pb-8">
        {MENU.reduce((rows, category, i) => {
          if (i % 2 === 0) rows.push([]);
          rows[rows.length - 1].push(category);
          return rows;
        }, [] as MenuCategory[][]).map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col w-full">
            <div className="grid grid-cols-2 gap-6 items-stretch">
              {row.map((category) => (
                <CategoryHeader key={category.key} category={category} isOpen={state.active === category.key} />
              ))}
            </div>
            <div className="w-full">
              {row.map((category) => (
                <CategoryContent key={`content-${category.key}`} category={category} isOpen={state.active === category.key} isDesktop />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryHeader({ category, isOpen }: { category: MenuCategory; isOpen: boolean }) {
  const { state, t, setActive } = useStore();

  const handleClick = () => {
    const willOpen = !isOpen;
    setActive(willOpen ? category.key : "");

    // When opening a category near the bottom, a previously open category above
    // may collapse and shrink the page, causing the viewport to overshoot.
    // Scroll back to this category after the accordion animation settles.
    if (willOpen) {
      setTimeout(() => {
        const el = document.getElementById(`category-${category.key}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Only correct if the element has scrolled above or too far below the viewport
          if (rect.top < 0 || rect.top > window.innerHeight * 0.6) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 450);
    }
  };

  return (
    <div id={`category-${category.key}`} className="flex flex-col w-full h-full scroll-mt-[120px]">
      <button
        onClick={handleClick}
        className={`relative overflow-hidden rounded-[24px] border transition-all duration-400 flex flex-col w-full h-full text-left group ${
          isOpen
            ? "border-ember/40 shadow-card"
            : "border-line bg-surface hover:border-ember/30 hover:shadow-lift"
        }`}
      >
        {/* Banner Image */}
        {category.img && (
          <div className={`relative w-full aspect-[4/3] md:aspect-video lg:aspect-[3/2] overflow-hidden flex-shrink-0 ${
            category.icon === "drink"
              ? "bg-gradient-to-br from-[#FCEBD2] via-[#F8DDB8] to-[#F3C796]"
              : "bg-surface"
          }`}>
            <Image
              src={category.img}
              alt={category.label}
              fill
              className={`transition-transform duration-700 ${isOpen ? "scale-105" : "group-hover:scale-105"} ${
                category.icon === "drink" ? "object-contain p-6" : "object-cover"
              }`}
            />
          </div>
        )}

        {/* Content Bar */}
        <div className={`relative flex-1 flex items-center justify-between p-4 md:p-5 w-full transition-colors ${
          category.img ? "bg-surface" : isOpen ? "bg-gradient-to-br from-surface to-[#FCEBD2]/30" : "bg-surface"
        }`}>
          {/* Background glow for open state (only if no image) */}
          {isOpen && !category.img && (
            <div
              className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500"
              style={{
                background: "radial-gradient(120% 100% at 50% 0%, rgba(228,85,42,0.1), transparent 70%)",
              }}
            />
          )}

          <div className="relative z-10 flex items-center gap-4 md:gap-5">
            <div className={`flex h-[52px] w-[52px] md:h-[60px] md:w-[60px] items-center justify-center rounded-[18px] transition-all duration-300 ${
              isOpen ? "bg-ember text-white shadow-lift scale-105" : "bg-ember/10 text-ember group-hover:bg-ember group-hover:text-white"
            }`}>
              <FoodIcon name={category.icon} width={28} height={28} className={isOpen ? "" : "group-hover:scale-110 transition-transform"} />
            </div>
            <div>
              <h3 className={`font-display text-[22px] md:text-[26px] font-semibold leading-none transition-colors ${
                isOpen ? "text-ember-d" : "text-ink group-hover:text-ember-d"
              }`}>
                {catLabel(category, state.lang)}
              </h3>
              {catNote(category, state.lang) && (
                <p className="mt-1.5 text-[12px] md:text-[13px] text-muted line-clamp-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-basil" />
                  <span><b className="font-bold text-basil">{t.included}</b> {catNote(category, state.lang)}</span>
                </p>
              )}
            </div>
          </div>

          <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
            isOpen ? "rotate-180 bg-ember/10 text-ember" : "bg-line/50 text-ink/60 group-hover:bg-line"
          }`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

function CategoryContent({ category, isOpen, isDesktop }: { category: MenuCategory; isOpen: boolean; isDesktop?: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="overflow-hidden"
        >
          <div className={`pt-4 pb-2 grid gap-3 md:gap-4 ${isDesktop ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"}`}>
            {category.items.map((item, i) => (
              <ItemCard key={item.id} item={item} icon={category.icon} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CategoryAccordion({ category }: { category: MenuCategory }) {
  const { state } = useStore();
  const isOpen = state.active === category.key;

  return (
    <div className="flex flex-col w-full">
      <CategoryHeader category={category} isOpen={isOpen} />
      <CategoryContent category={category} isOpen={isOpen} />
    </div>
  );
}

function ItemCard({
  item,
  icon,
  index,
}: {
  item: MenuItem;
  icon: MenuCategory["icon"];
  index: number;
}) {
  const { state, t, add, decItem, openCustomize, qtyByItem } = useStore();
  const qty = qtyByItem[item.id] || 0;
  const customizable = isCustomizable(item.id);
  const popular = POPULAR_RE.test(item.name);
  const [flights, setFlights] = useState<number[]>([]);

  function handleAdd(e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    if (customizable) {
      // sauces / légumes / suppléments / note are chosen in the sheet
      openCustomize(item.id);
      return;
    }
    add(item.id);
    const id = Date.now() + Math.random();
    setFlights((f) => [...f, id]);
    window.setTimeout(() => setFlights((f) => f.filter((x) => x !== id)), 700);
  }

  function handleDec(e: React.MouseEvent) {
    e.stopPropagation();
    decItem(item.id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.25), ease }}
      onClick={() => qty === 0 && handleAdd()}
      className={`group flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-card-sm transition-all duration-300 hover:-translate-y-1 hover:border-ember/30 hover:shadow-lift ${
        qty === 0 ? "cursor-pointer" : ""
      }`}
    >
      {/* image */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FCEBD2] via-[#F8DDB8] to-[#F3C796]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 70% at 30% 20%, rgba(255,255,255,.5), transparent 60%)",
          }}
        />
        {item.img ? (
          <Image
            src={item.img}
            alt={item.name}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1280px) 33vw, 25vw"
            className={`transition-transform duration-500 group-hover:scale-105 ${
              icon === "drink" ? "object-contain scale-90" : "object-cover"
            }`}
          />
        ) : (
          <span
            role="img"
            aria-label={item.name}
            className="relative text-[44px] drop-shadow-[0_4px_8px_rgba(140,80,30,.22)] transition-transform duration-500 group-hover:scale-110 md:text-[52px]"
          >
            {ICON_EMOJI[icon]}
          </span>
        )}
        {popular && (
          <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full bg-ember px-2 py-1 text-[9px] font-extrabold uppercase tracking-[.3px] text-white shadow-sm">
            ★ {t.popular}
          </span>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-3 pb-4">
        <h3 className="text-[14px] font-bold leading-tight text-ink">{pickName(item, state.lang)}</h3>
        {pickDesc(item, state.lang) && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">{pickDesc(item, state.lang)}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="font-display text-[18px] font-semibold leading-none text-ember-d">
            {formatPrice(item.price, state.lang)}
          </span>

          {qty > 0 && (
            <div className="flex flex-shrink-0 items-center gap-1.5" onClick={e => e.stopPropagation()}>
              <button
                onClick={handleDec}
                aria-label="decrease"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] border border-line bg-surface text-[18px] font-bold leading-none text-ink transition-colors hover:border-ember/40"
              >
                −
              </button>
              <span className="min-w-[16px] text-center text-[14px] font-extrabold tabular-nums">{qty}</span>
              <button
                onClick={handleAdd}
                aria-label="increase"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-basil text-[18px] font-bold leading-none text-white transition-transform active:scale-90"
              >
                +
              </button>
            </div>
          )}
          
          {qty === 0 && (
            <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleAdd}
                aria-label={`Ajouter ${item.name}`}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-ember text-[22px] font-bold leading-none text-white shadow-card-sm transition-transform hover:-translate-y-0.5 active:scale-90"
              >
                +
              </button>
              <AnimatePresence>
                {flights.map((id) => (
                  <motion.span
                    key={id}
                    initial={{ opacity: 0, y: 2, scale: 0.6 }}
                    animate={{ opacity: 1, y: -24, scale: 1 }}
                    exit={{ opacity: 0, y: -34 }}
                    transition={{ duration: 0.6, ease }}
                    className="pointer-events-none absolute inset-x-0 -top-1 text-center text-[14px] font-extrabold text-ember"
                  >
                    +1
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
