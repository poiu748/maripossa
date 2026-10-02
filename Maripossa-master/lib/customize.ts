import { ITEMS_BY_ID } from "./menu";
import type { CartOptions, Lang, MenuItem } from "./types";

/**
 * Item customization rules.
 *
 * - Sandwiches AVEC légumes  : Panuozzo, Pain Cheese  -> sauces + ingrédients + suppléments
 * - Sandwiches SANS légumes  : Pizzwich, Tacos        -> sauces + ingrédients + suppléments
 * - Pizzas (rouges/blanches/mini)                     -> ingrédients + supplément Œuf
 * - Tous les articles incluent le fromage (retirable, gratuit)
 * - Les tacos incluent aussi la sauce fromagère (retirable)
 * - Chaque pizza expose ses propres ingrédients (retirables) depuis sa description
 * - Supplément "Mozza"          : Pain Cheese + Pizzwich
 * - Supplément "Mozza sandwich" : Tacos + Panuozzo
 * - Une note libre est possible sur chaque article personnalisable.
 */

export interface OptionDef {
  id: string;
  fr: string;
  ar: string;
  /** extra cost in DT; omitted = included/free */
  price?: number;
}

/** Explicit "no sauce" choice — picking a sauce is mandatory, this counts. */
export const SANS_SAUCE_ID = "sans-sauce";

export const SAUCES: OptionDef[] = [
  { id: "ail", fr: "Sauce à l'ail", ar: "صلصة الثوم" },
  { id: "bbq", fr: "Barbecue", ar: "باربكيو" },
  { id: "algerienne", fr: "Algérienne", ar: "جزائرية" },
  { id: "harissa", fr: "Harissa", ar: "هريسة" },
  { id: "mayo", fr: "Mayonnaise", ar: "مايونيز" },
  { id: SANS_SAUCE_ID, fr: "Sans sauce", ar: "بدون صلصة" },
];

export const VEGGIES: OptionDef[] = [
  { id: "tomate", fr: "Tomate", ar: "طماطم" },
  { id: "oignons", fr: "Oignons caramélisés", ar: "بصل مكرمل" },
  { id: "laitue", fr: "Laitue", ar: "خس" },
];

/** ⚠️ Prices for Mozza / Mozza sandwich are placeholders — edit here. */
export const SUPPLEMENTS: OptionDef[] = [
  { id: "mozza", fr: "Fromage", ar: "جبن", price: 4 },
  { id: "mozza-sandwich", fr: "Fromage", ar: "جبن", price: 2 },
  { id: "oeuf", fr: "Œuf", ar: "بيضة", price: 1 },
  { id: "viande", fr: "Viande", ar: "لحم", price: 4 },
  { id: "frites", fr: "Frites", ar: "بطاطا مقلية", price: 3.5 },
];

const SUPP_BY_ID: Record<string, OptionDef> = Object.fromEntries(
  SUPPLEMENTS.map((s) => [s.id, s])
);

export interface CategoryCustomization {
  sauces: boolean;
  veggies: boolean;
  /** supplement ids offered for this category */
  supplements: string[];
}

/** Which categories open the customize sheet, and with which sections. */
export const CUSTOMIZE: Record<string, CategoryCustomization> = {
  panuozzo: { sauces: true, veggies: true, supplements: ["mozza-sandwich", "viande", "frites"] },
  paincheese: { sauces: true, veggies: true, supplements: ["mozza", "viande", "frites"] },
  pizzwich: { sauces: true, veggies: false, supplements: ["mozza", "viande", "frites"] },
  tacos: { sauces: true, veggies: false, supplements: ["mozza-sandwich", "viande", "frites"] },
  pizzared: { sauces: false, veggies: false, supplements: ["oeuf"] },
  pizzawhite: { sauces: false, veggies: false, supplements: ["oeuf"] },
  mini: { sauces: false, veggies: false, supplements: ["oeuf"] },
};

/* ------------------------------------------------------------------ */
/* included (removable, free) ingredients                              */
/* ------------------------------------------------------------------ */

export interface IncludedIngredient {
  id: string;
  fr: string;
  ar: string;
}

export const FROMAGE: IncludedIngredient = { id: "fromage", fr: "Fromage", ar: "جبن" };
export const SAUCE_FROMAGERE: IncludedIngredient = {
  id: "sauce-fromagere",
  fr: "Sauce fromagère",
  ar: "صلصة الجبن",
};

const PIZZA_CATS = new Set(["pizzared", "pizzawhite"]);

/**
 * What comes ON the item by default — every entry is removable for free.
 * Pizzas expose their own ingredient list, pairing the French and Arabic
 * descriptions token-by-token (the id is always the French token so cart
 * identity is stable across languages). Sandwiches get fromage
 * (+ sauce fromagère for tacos, + légumes where included).
 */
export function includedIngredients(item: MenuItem): IncludedIngredient[] {
  const cat = categoryOfItem(item.id);
  const cfg = CUSTOMIZE[cat];
  if (!cfg) return [];

  if (PIZZA_CATS.has(cat) && item.desc) {
    const fr = item.desc.split(",").map((s) => s.trim()).filter(Boolean);
    const ar = (item.descAr ?? "").split("،").map((s) => s.trim());
    return fr.map((token, i) => ({ id: token, fr: token, ar: ar[i]?.trim() || token }));
  }

  const list: IncludedIngredient[] = [];
  if (["panuozzo", "paincheese", "pizzwich", "tacos"].includes(cat)) {
    list.push(FROMAGE);
  }
  if (cat === "tacos") list.push(SAUCE_FROMAGERE);
  if (cfg.veggies) list.push(...VEGGIES.map((v) => ({ id: v.id, fr: v.fr, ar: v.ar })));
  return list;
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

/** item ids look like "paincheese-3" -> category "paincheese" */
export function categoryOfItem(itemId: string): string {
  const i = itemId.lastIndexOf("-");
  return i === -1 ? itemId : itemId.slice(0, i);
}

export function isCustomizable(itemId: string): boolean {
  return categoryOfItem(itemId) in CUSTOMIZE;
}

/** Items whose meats the customer must spell out (e.g. "Tacos XL · 2 viandes"). */
export function needsMeatChoice(item: MenuItem): boolean {
  return /2 viandes/i.test(item.name);
}

/** Fresh default options — pre-selects sauces based on category. */
export function defaultOptions(itemId: string): CartOptions {
  const cat = categoryOfItem(itemId);

  // Default sauces per category
  let sauces: string[] = [];
  if (cat === "panuozzo" || cat === "paincheese") {
    sauces = ["ail", "algerienne", "harissa"];
  } else if (cat === "pizzwich" || cat === "tacos") {
    sauces = ["mayo", "algerienne", "harissa"];
  }

  return { sauces, removed: [], supplements: [], viandeNote: "", meatNote: "", note: "" };
}

/** Extra cost added by the chosen supplements. */
export function supplementsTotal(options?: CartOptions): number {
  if (!options) return 0;
  return options.supplements.reduce((sum, id) => sum + (SUPP_BY_ID[id]?.price ?? 0), 0);
}

/**
 * Cart-line identity: the same item with the same choices merges into one
 * line; any different choice makes a separate line.
 */
export function lineKey(itemId: string, options?: CartOptions): string {
  if (!options) return itemId;
  const norm = (a: string[]) => [...a].sort().join(",");
  return [
    itemId,
    norm(options.sauces),
    norm(options.removed),
    norm(options.supplements),
    options.viandeNote.trim().toLowerCase(),
    options.meatNote.trim().toLowerCase(),
    options.note.trim().toLowerCase(),
  ].join("|");
}

/** A labeled group of choices, for the worker-facing WhatsApp message. */
export interface DetailGroup {
  /** emoji + localized label, e.g. "🥫 Sauces" */
  label: string;
  /** the chosen values, already localized */
  values: string[];
}

const DETAIL_LABELS = {
  meats: { fr: "🥩 Viandes", ar: "🥩 اللحوم" },
  sauces: { fr: "🥫 Sauces", ar: "🥫 الصلصات" },
  removed: { fr: "🚫 Sans", ar: "🚫 بدون" },
  supp: { fr: "➕ Suppléments", ar: "➕ إضافات" },
} as const;

/**
 * Grouped, labeled choices for the pizzeria worker. Each returned group is a
 * clear "Label: value, value" line. The free note is handled by the caller.
 */
export function detailGroups(
  itemId: string,
  options: CartOptions | undefined,
  lang: Lang
): DetailGroup[] {
  if (!options) return [];
  const cfg = CUSTOMIZE[categoryOfItem(itemId)];
  if (!cfg) return [];

  const out: DetailGroup[] = [];
  if (options.meatNote.trim()) {
    out.push({ label: DETAIL_LABELS.meats[lang], values: [options.meatNote.trim()] });
  }
  if (options.sauces.length) {
    out.push({
      label: DETAIL_LABELS.sauces[lang],
      values: options.sauces.map((id) => SAUCES.find((s) => s.id === id)?.[lang] ?? id),
    });
  }
  if (options.removed.length) {
    const item = ITEMS_BY_ID[itemId];
    const included = item ? includedIngredients(item) : [];
    out.push({
      label: DETAIL_LABELS.removed[lang],
      values: options.removed.map((id) => included.find((i) => i.id === id)?.[lang] ?? id),
    });
  }
  if (options.supplements.length) {
    out.push({
      label: DETAIL_LABELS.supp[lang],
      values: options.supplements.map((id) => {
        const name = SUPP_BY_ID[id]?.[lang] ?? id;
        return id === "viande" && options.viandeNote.trim()
          ? `${name} (${options.viandeNote.trim()})`
          : name;
      }),
    });
  }
  return out;
}

/**
 * Human-readable summary of the choices (for the cart + WhatsApp message).
 * The note is NOT included — callers render it separately.
 */
export function summarizeOptions(
  itemId: string,
  options: CartOptions | undefined,
  lang: Lang
): string[] {
  if (!options) return [];
  const cfg = CUSTOMIZE[categoryOfItem(itemId)];
  if (!cfg) return [];

  const out: string[] = [];
  if (options.meatNote.trim()) {
    out.push((lang === "ar" ? "اللحوم: " : "Viandes: ") + options.meatNote.trim());
  }
  if (options.sauces.length) {
    out.push(
      options.sauces
        .map((id) => SAUCES.find((s) => s.id === id)?.[lang] ?? id)
        .join(" · ")
    );
  }
  if (options.removed.length) {
    const item = ITEMS_BY_ID[itemId];
    const included = item ? includedIngredients(item) : [];
    const name = (id: string) => included.find((i) => i.id === id)?.[lang] ?? id;
    out.push(
      (lang === "ar" ? "بدون " : "Sans ") + options.removed.map(name).join(", ")
    );
  }
  for (const id of options.supplements) {
    let label = "+ " + (SUPP_BY_ID[id]?.[lang] ?? id);
    if (id === "viande" && options.viandeNote.trim()) {
      label += ` (${options.viandeNote.trim()})`;
    }
    out.push(label);
  }
  return out;
}
