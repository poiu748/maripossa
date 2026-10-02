"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "./StoreProvider";
import { WhatsAppIcon } from "./Icons";
import { summarizeOptions, defaultOptions } from "@/lib/customize";
import { MENU } from "@/lib/menu";
import { formatPrice } from "@/lib/i18n";
import { buildWhatsAppHref } from "@/lib/order";
import { contact } from "@/lib/fpixel";

const DRINKS = MENU.find((c) => c.key === "drinks")?.items ?? [];

export function CartSheet() {
  const {
    state,
    t,
    lines,
    total,
    add,
    inc,
    dec,
    addConfigured,
    closeCart,
    setMode,
    setName,
    setAddress,
    setPhone,
    markSent,
  } = useStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [drinkNote, setDrinkNote] = useState("");
  const [drinkError, setDrinkError] = useState("");

  function handleAddDrink(id: string) {
    if (id === "drinks-0" && drinkNote.trim()) {
      const note = drinkNote.trim().toLowerCase();
      const blocked = ["fanta", "coca", "coca-cola", "cocacola", "coke"];
      if (blocked.some((b) => note.includes(b))) {
        setDrinkError(
          state.lang === "ar"
            ? "عذراً، نحن لا نبيع هذه العلامات التجارية."
            : "Désolé, nous ne vendons pas ces marques."
        );
        return;
      }
      setDrinkError("");
      addConfigured(id, { ...defaultOptions(id), note: drinkNote }, 1);
      setDrinkNote("");
    } else {
      add(id);
    }
  }

  useEffect(() => {
    if (state.cartOpen) {
      setStep(1);
    }
  }, [state.cartOpen]);

  const hasItems = lines.length > 0;
  const waHref = buildWhatsAppHref({
    lines,
    total,
    mode: state.mode,
    name: state.name,
    address: state.address,
    phone: state.phone,
  });

  return (
    <AnimatePresence>
      {state.cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeCart}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-night/65 backdrop-blur-sm"
        >
          <motion.div
            dir={t.dir}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-[460px] flex-col rounded-t-[26px] bg-crust shadow-lift"
          >
            {/* grabber */}
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-line" />

            {/* header */}
            <div className="flex items-center px-5 pb-3 pt-3">
              <h3 className="font-display text-[24px] font-semibold text-ink">{t.yourOrder}</h3>
              <button
                onClick={closeCart}
                aria-label="close"
                className="ms-auto flex h-[34px] w-[34px] items-center justify-center rounded-full bg-line/70 text-[17px] text-ink transition-colors hover:bg-line"
              >
                ✕
              </button>
            </div>

            {/* scrollable area */}
            <div className="no-scrollbar flex-1 overflow-y-auto px-5">
              {step === 1 ? (
                <>
                  {/* drinks upsell */}
                  {hasItems && (
                    <div className="mb-4 mt-2 rounded-2xl border border-line bg-surface p-4">
                      <div className="text-[14px] font-extrabold text-ink">
                        🥤 {t.drinksTitle}
                      </div>
                      <div className="mt-1 text-[11.5px] font-bold text-ember-d">
                        ⚠️ {t.drinksWarn}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {DRINKS.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => handleAddDrink(d.id)}
                            className="group flex items-center gap-2.5 rounded-[14px] border border-line bg-surface p-1.5 pr-4 text-[13px] font-bold text-ink shadow-sm transition-all hover:border-ember/40 hover:shadow"
                          >
                            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[10px] bg-basil text-[18px] font-bold leading-none text-white shadow-sm transition-transform group-active:scale-95">
                              +
                            </span>
                            <span>{state.lang === "ar" ? d.nameAr : d.name} <span className="text-muted font-semibold ml-0.5">· {formatPrice(d.price, state.lang)}</span></span>
                          </button>
                        ))}
                      </div>
                      <input
                        value={drinkNote}
                        onChange={(e) => {
                          setDrinkNote(e.target.value);
                          if (drinkError) setDrinkError("");
                        }}
                        placeholder={t.drinksNotePh}
                        className={`mt-2.5 w-full rounded-xl border p-2.5 text-base text-ink outline-none transition-colors ${drinkError
                          ? "border-red-500 bg-red-50 focus:border-red-600"
                          : "border-line bg-crust/50 focus:border-ember"
                          }`}
                      />
                      {drinkError && (
                        <div className="mt-2 text-[12px] font-bold text-red-500">
                          {drinkError}
                        </div>
                      )}
                    </div>
                  )}

                  {hasItems ? (
                    lines.map((l) => {
                      const details = summarizeOptions(l.itemId, l.options, state.lang);
                      const note = l.options?.note.trim();
                      return (
                        <div
                          key={l.key}
                          className="flex items-start gap-3 border-b border-line py-3"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-bold text-ink">{state.lang === "ar" ? l.nameAr : l.name}</div>
                            {details.length > 0 && (
                              <div className="mt-0.5 text-[11.5px] leading-snug text-muted">
                                {details.join(" · ")}
                              </div>
                            )}
                            {note && (
                              <div className="mt-0.5 text-[11.5px] italic leading-snug text-muted">
                                📝 {note}
                              </div>
                            )}
                            <div className="mt-0.5 text-[12px] font-semibold text-ember-d">
                              {formatPrice(l.price, state.lang)}
                            </div>
                          </div>
                          <div className="ms-auto flex items-center gap-2.5">
                            <button
                              onClick={() => dec(l.key)}
                              aria-label="decrease"
                              className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border border-line bg-surface text-[17px] font-bold text-ink"
                            >
                              −
                            </button>
                            <span className="min-w-[16px] text-center font-extrabold tabular-nums">{l.qty}</span>
                            <button
                              onClick={() => inc(l.key)}
                              aria-label="increase"
                              className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-basil text-[17px] font-bold text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-5 py-12 text-center text-[14px] text-muted">{t.empty}</div>
                  )}
                </>
              ) : (
                /* STEP 2 */
                <div className="py-2 pb-6">
                  <div className="mb-3 flex gap-2">
                    <button
                      onClick={() => setMode("delivery")}
                      className={`flex-1 flex flex-col items-center justify-center rounded-xl border-[1.6px] p-3 transition-colors ${state.mode === "delivery"
                        ? "border-ember bg-ember/8 text-ember-d"
                        : "border-line bg-surface text-muted"
                        }`}
                    >
                      <span className="text-[13px] font-bold">🛵 {t.delivery}</span>
                      <span className="mt-0.5 text-[10px] font-semibold opacity-80">{t.deliveryDesc}</span>
                    </button>
                    <button
                      onClick={() => setMode("pickup")}
                      className={`flex-1 flex flex-col items-center justify-center rounded-xl border-[1.6px] p-3 transition-colors ${state.mode === "pickup"
                        ? "border-ember bg-ember/8 text-ember-d"
                        : "border-line bg-surface text-muted"
                        }`}
                    >
                      <span className="text-[13px] font-bold">🏪 {t.pickup}</span>
                      <span className="mt-0.5 text-[10px] font-semibold opacity-80">{t.pickupDesc}</span>
                    </button>
                  </div>

                  <input
                    value={state.name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePh}
                    className="mb-2 w-full rounded-xl border border-line bg-crust/50 p-3 text-base text-ink outline-none transition-colors focus:border-ember"
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    value={state.phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePh}
                    className="mb-2 w-full rounded-xl border border-line bg-crust/50 p-3 text-base text-ink outline-none transition-colors focus:border-ember"
                  />
                  {state.mode === "delivery" && (
                    <>
                      <input
                        value={state.address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t.addrPh}
                        className="mb-2 w-full rounded-xl border border-line bg-crust/50 p-3 text-base text-ink outline-none transition-colors focus:border-ember"
                      />
                      <div className="mb-2 rounded-xl border-[1.6px] border-amber/60 bg-amber/15 p-3 text-[12px] font-bold leading-snug text-ember-d">
                        ⚠️ {t.deliveryDisclaimer}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* footer */}
            <div
              className="border-t border-line bg-surface px-5 pt-4"
              style={{ paddingBottom: "calc(18px + env(safe-area-inset-bottom))" }}
            >
              <div className="mb-3 mt-1 flex items-baseline justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[18px] font-bold text-ink">{t.total}</span>
                  {step === 2 && state.mode === "delivery" && (
                    <span className="text-[17px] font-extrabold text-ember-d">
                      ({t.noDeliveryFee})
                    </span>
                  )}
                </div>
                <span className="font-display text-[30px] font-semibold leading-none text-ember-d">
                  {formatPrice(total, state.lang)}
                </span>
              </div>

              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  disabled={!hasItems}
                  className={`flex w-full items-center justify-center gap-2.5 rounded-[16px] bg-ember p-4 text-[15px] font-extrabold text-white transition-transform ${hasItems ? "hover:-translate-y-0.5 shadow-[0_12px_28px_-8px_rgba(228,85,42,.6)]" : "pointer-events-none opacity-50"
                    }`}
                >
                  {t.nextBtn}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex h-[56px] items-center justify-center rounded-[16px] border border-line bg-crust px-4 text-[15px] font-extrabold text-ink transition-colors hover:bg-line/50"
                  >
                    {t.backBtn}
                  </button>
                  <a
                    href={hasItems ? waHref : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!hasItems) {
                        e.preventDefault();
                        return;
                      }
                      // start the 10-min abandon timer, then hand off to WhatsApp
                      markSent();
                      contact({ method: "whatsapp", source: "order" });
                      closeCart();
                    }}
                    className={`flex flex-1 items-center justify-center gap-2.5 rounded-[16px] bg-[#25D366] p-4 text-[15px] font-extrabold text-[#073b1a] transition-transform ${hasItems ? "hover:-translate-y-0.5 shadow-[0_12px_28px_-8px_rgba(37,211,102,.6)]" : "pointer-events-none opacity-50"
                      }`}
                  >
                    <WhatsAppIcon width={22} height={22} />
                    {t.sendWa}
                  </a>
                </div>
              )}
              {step === 2 && (
                <p className="mt-2.5 text-center text-[10.5px] text-muted">{t.waNote}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
