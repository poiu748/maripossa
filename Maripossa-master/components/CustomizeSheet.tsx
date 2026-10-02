"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./StoreProvider";
import { formatPrice } from "@/lib/i18n";
import { ITEMS_BY_ID } from "@/lib/menu";
import {
  CUSTOMIZE,
  SANS_SAUCE_ID,
  SAUCES,
  SUPPLEMENTS,
  categoryOfItem,
  defaultOptions,
  includedIngredients,
  needsMeatChoice,
  summarizeOptions,
  supplementsTotal,
} from "@/lib/customize";
import { pickName, type CartOptions, type MenuItem } from "@/lib/types";

/**
 * Bottom sheet to configure an item before adding it to the cart.
 * When qty > 1 the sheet walks through the pieces one by one
 * (Article 1/2, 2/2 …) so each can have its own choices.
 */
export function CustomizeSheet() {
  const { state, closeCustomize } = useStore();
  const item = state.customizing ? ITEMS_BY_ID[state.customizing] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeCustomize}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-night/65 backdrop-blur-sm"
        >
          {/* key resets choices whenever a different item is opened */}
          <SheetBody key={item.id} item={item} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SheetBody({ item }: { item: MenuItem }) {
  const { state, t, addConfigured, closeCustomize } = useStore();
  const cfg = CUSTOMIZE[categoryOfItem(item.id)];
  const [options, setOptions] = useState(() => defaultOptions(item.id));
  const [qty, setQty] = useState(1);
  /** pieces already configured in the step-by-step flow */
  const [units, setUnits] = useState<CartOptions[]>([]);

  const supps = SUPPLEMENTS.filter((s) => cfg?.supplements.includes(s.id));
  const included = includedIngredients(item);
  const needsMeat = needsMeatChoice(item);
  const viandeSelected = options.supplements.includes("viande");

  const step = units.length + 1;
  const isLast = step >= qty;
  const unitPrice = item.price + supplementsTotal(options);
  const grandTotal =
    units.reduce((sum, u) => sum + item.price + supplementsTotal(u), 0) + unitPrice;

  // what still blocks this piece from being added
  let blocking = "";
  if (cfg?.sauces && options.sauces.length === 0) blocking = t.sauceRequired;
  else if (needsMeat && !options.meatNote.trim()) blocking = t.meatsRequired;
  else if (viandeSelected && !options.viandeNote.trim()) blocking = t.viandeRequired;
  const valid = !blocking;

  function toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  function pickSauce(id: string) {
    setOptions((o) => {
      if (id === SANS_SAUCE_ID) {
        // "sans sauce" is exclusive
        return { ...o, sauces: o.sauces.includes(SANS_SAUCE_ID) ? [] : [SANS_SAUCE_ID] };
      }
      return { ...o, sauces: toggle(o.sauces.filter((x) => x !== SANS_SAUCE_ID), id) };
    });
  }

  function sanitized(): CartOptions {
    return {
      ...options,
      viandeNote: viandeSelected ? options.viandeNote.trim() : "",
      meatNote: options.meatNote.trim(),
      note: options.note.trim(),
    };
  }

  /** "Suivant" between pieces, then a final "Ajouter" for everything. */
  function commit() {
    if (!valid) return;
    const current = sanitized();
    if (isLast) {
      for (const u of units) addConfigured(item.id, u, 1);
      addConfigured(item.id, current, 1);
    } else {
      setUnits((u) => [...u, current]);
      setOptions(defaultOptions(item.id));
    }
  }

  return (
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

      {/* header — shows which piece is being configured */}
      <div className="flex items-start px-5 pb-2 pt-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[2.5px] text-ember">
            {t.customizeTitle}
            {qty > 1 && (
              <span className="ms-2 rounded-full bg-ember px-2 py-0.5 text-[10px] text-white">
                {t.unitLabel} {step}/{qty}
              </span>
            )}
          </div>
          <h3 className="mt-1 font-display text-[24px] font-semibold leading-tight text-ink">
            {pickName(item, state.lang)}
          </h3>
        </div>
        <button
          onClick={closeCustomize}
          aria-label="close"
          className="ms-auto flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-line/70 text-[17px] text-ink transition-colors hover:bg-line"
        >
          ✕
        </button>
      </div>

      {/* scrollable options */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-2">
        {needsMeat && (
          <section className="pt-3">
            <h4 className="text-[13px] font-extrabold uppercase tracking-[1px] text-ink/80">
              {t.meatsLabel} <span className="text-ember">*</span>
            </h4>
            <input
              value={options.meatNote}
              onChange={(e) => setOptions((o) => ({ ...o, meatNote: e.target.value }))}
              placeholder={t.meatsPh}
              maxLength={80}
              className="mt-2.5 w-full rounded-xl border border-line bg-surface p-3 text-base text-ink outline-none transition-colors focus:border-ember"
            />
          </section>
        )}

        {cfg?.sauces && (
          <section className="pt-3">
            <h4 className="text-[13px] font-extrabold uppercase tracking-[1px] text-ink/80">
              {t.saucesLabel} <span className="text-ember">*</span>
            </h4>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SAUCES.map((s) => {
                const on = options.sauces.includes(s.id);
                const isNone = s.id === SANS_SAUCE_ID;
                return (
                  <button
                    key={s.id}
                    onClick={() => pickSauce(s.id)}
                    className={`flex items-center gap-1.5 rounded-full border-[1.6px] px-3.5 py-2 text-[13px] font-bold transition-colors ${
                      on
                        ? "border-ember bg-ember text-white"
                        : isNone
                        ? "border-dashed border-line bg-surface text-muted hover:border-ember/40"
                        : "border-line bg-surface text-ink/70 hover:border-ember/40"
                    }`}
                  >
                    <span
                      className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                        on
                          ? "border-white bg-white text-ember"
                          : "border-ink/30 bg-transparent text-transparent"
                      }`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    {s[state.lang]}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {included.length > 0 && (
          <section className="pt-5">
            <h4 className="text-[13px] font-extrabold uppercase tracking-[1px] text-ink/80">
              {t.veggiesLabel}
              <span className="ms-2 align-middle text-[11px] font-semibold normal-case tracking-normal text-basil">
                {t.veggiesHint}
              </span>
            </h4>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {included.map((ing) => {
                const on = !options.removed.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() =>
                      setOptions((o) => ({ ...o, removed: toggle(o.removed, ing.id) }))
                    }
                    className={`flex items-center gap-1.5 rounded-full border-[1.6px] px-3.5 py-2 text-[13px] font-bold transition-colors ${
                      on
                        ? "border-ember bg-ember text-white"
                        : "border-line bg-surface text-muted line-through"
                    }`}
                  >
                    <span
                      className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                        on
                          ? "border-white bg-white text-ember"
                          : "border-ink/30 bg-transparent text-transparent"
                      }`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    {ing[state.lang]}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {supps.length > 0 && (
          <section className="pt-5">
            <h4 className="text-[13px] font-extrabold uppercase tracking-[1px] text-ink/80">
              {t.suppLabel}
            </h4>
            <div className="mt-2.5 flex flex-col gap-2">
              {supps.map((s) => {
                const on = options.supplements.includes(s.id);
                return (
                  <div key={s.id}>
                    <button
                      onClick={() =>
                        setOptions((o) => ({
                          ...o,
                          supplements: toggle(o.supplements, s.id),
                        }))
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border-[1.6px] p-3 text-start transition-colors ${
                        on
                          ? "border-ember bg-ember/8"
                          : "border-line bg-surface hover:border-ember/30"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-[1.6px] text-[12px] font-extrabold ${
                          on
                            ? "border-ember bg-ember text-white"
                            : "border-line bg-surface text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span className="text-[14px] font-bold text-ink">{s[state.lang]}</span>
                      <span className="ms-auto text-[13px] font-extrabold text-ember-d">
                        +{formatPrice(s.price ?? 0, state.lang)}
                      </span>
                    </button>
                    {/* which meat? — required once the supplement is picked */}
                    {s.id === "viande" && on && (
                      <input
                        value={options.viandeNote}
                        onChange={(e) =>
                          setOptions((o) => ({ ...o, viandeNote: e.target.value }))
                        }
                        placeholder={t.viandePh}
                        maxLength={60}
                        className="mt-2 w-full rounded-xl border border-ember/40 bg-surface p-2.5 text-base text-ink outline-none transition-colors focus:border-ember"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="pb-4 pt-5">
          <h4 className="text-[13px] font-extrabold uppercase tracking-[1px] text-ink/80">
            {t.noteLabel}
          </h4>
          <textarea
            value={options.note}
            onChange={(e) => setOptions((o) => ({ ...o, note: e.target.value }))}
            placeholder={t.notePh}
            rows={2}
            maxLength={200}
            className="mt-2.5 w-full resize-none rounded-xl border border-line bg-surface p-3 text-base text-ink outline-none transition-colors focus:border-ember"
          />
        </section>
      </div>

      {/* pieces already configured */}
      {units.length > 0 && (
        <div className="border-t border-line bg-crust/70 px-5 py-2">
          {units.map((u, i) => (
            <p key={lineKeyish(u, i)} className="truncate text-[11px] font-semibold text-muted">
              ✓ {t.unitLabel} {i + 1} —{" "}
              {summarizeOptions(item.id, u, state.lang).join(" · ") || t.standardLabel}
              {u.note ? ` · 📝 ${u.note}` : ""}
            </p>
          ))}
        </div>
      )}

      {/* footer: qty + next/add */}
      <div
        className="border-t border-line bg-surface px-5 pt-3"
        style={{ paddingBottom: "calc(18px + env(safe-area-inset-bottom))" }}
      >
        {!valid && (
          <p className="pb-2 text-[11.5px] font-bold leading-snug text-ember-d">
            ⚠️ {blocking}
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="flex flex-shrink-0 items-center gap-2.5">
            <button
              onClick={() => setQty((q) => Math.max(units.length + 1, q - 1))}
              aria-label="decrease"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border border-line bg-surface text-[19px] font-bold text-ink"
            >
              −
            </button>
            <span className="min-w-[20px] text-center text-[16px] font-extrabold tabular-nums">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="increase"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-basil text-[19px] font-bold text-white"
            >
              +
            </button>
          </div>

          <button
            onClick={commit}
            disabled={!valid}
            className={`flex flex-1 items-center justify-between gap-2 rounded-[16px] bg-ember px-5 py-[14px] text-[15px] font-extrabold text-white shadow-[0_12px_28px_-8px_rgba(228,85,42,.6)] transition-transform active:scale-[.98] ${
              valid ? "" : "cursor-not-allowed opacity-50"
            }`}
          >
            <span>
              {isLast ? t.addToCart : `${t.nextBtn} · ${step}/${qty}`}
            </span>
            <span className="font-display text-[17px] font-semibold">
              {formatPrice(isLast ? grandTotal : unitPrice, state.lang)}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/** stable-enough key for the configured-pieces list */
function lineKeyish(u: CartOptions, i: number): string {
  return `${i}-${u.sauces.join(",")}-${u.removed.join(",")}-${u.supplements.join(",")}`;
}
