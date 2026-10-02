export type Lang = "fr" | "ar";

export type IconKey =
  | "pizza"
  | "sandwich"
  | "taco"
  | "bowl"
  | "drink"
  | "extra";

export interface MenuItem {
  /** stable id, e.g. "pizzared-3" */
  id: string;
  name: string;
  /** Arabic name */
  nameAr: string;
  desc?: string;
  /** Arabic description */
  descAr?: string;
  price: number;
  /** optional photo path under /public, e.g. "/menu/pepperoni.jpg" */
  img?: string;
}

export interface MenuCategory {
  key: string;
  label: string;
  /** Arabic label */
  labelAr: string;
  icon: IconKey;
  img?: string;
  /** "Included" note shown under the category title */
  note?: string;
  /** Arabic note */
  noteAr?: string;
  items: MenuItem[];
}

/** Language-aware pickers for menu content. */
export function pickName(item: MenuItem, lang: Lang): string {
  return lang === "ar" ? item.nameAr : item.name;
}
export function pickDesc(item: MenuItem, lang: Lang): string | undefined {
  return lang === "ar" ? item.descAr : item.desc;
}

export interface Review {
  text: string;
  who: string;
}

export type ServiceMode = "delivery" | "pickup";

/** Choices made in the customize sheet for one cart line. */
export interface CartOptions {
  /** selected sauce ids (includes the explicit "sans-sauce" choice) */
  sauces: string[];
  /** included ingredients the customer REMOVED (all included by default) */
  removed: string[];
  /** selected supplement ids (priced) */
  supplements: string[];
  /** which meat, when the "+ Viande" supplement is selected */
  viandeNote: string;
  /** meats chosen for multi-meat items (e.g. "Tacos XL · 2 viandes") */
  meatNote: string;
  /** free-text request, e.g. "bien cuit" */
  note: string;
}

/** What is persisted per cart line. */
export interface CartEntry {
  itemId: string;
  qty: number;
  options?: CartOptions;
}

/** Derived cart line ready for display / message building. */
export interface CartLine {
  key: string;
  itemId: string;
  name: string;
  /** Arabic name */
  nameAr: string;
  /** unit price including supplements */
  price: number;
  qty: number;
  options?: CartOptions;
}
