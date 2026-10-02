import type { IconKey, Lang, MenuCategory, MenuItem } from "./types";

/**
 * Bilingual source rows for each category.
 *   { fr, ar, price }                  -> item without description
 *   { fr, ar, dFr, dAr, price }        -> item with description
 * Edit prices/items here — ids are generated automatically.
 */
type Row =
  | { fr: string; ar: string; price: number }
  | { fr: string; ar: string; dFr: string; dAr: string; price: number };

interface RawCategory {
  key: string;
  label: string;
  labelAr: string;
  icon: IconKey;
  img?: string;
  note?: string;
  noteAr?: string;
  rows: Row[];
}

const RAW: RawCategory[] = [
  {
    key: "panuozzo",
    label: "Panuozzo",
    labelAr: "بانوتزو",
    icon: "sandwich",
    img: "/cat_panuozzo_v7.jpg",
    note: "sauces, laitue, oignons caramélisés, tomate, frites",
    noteAr: "صلصات، خس، بصل مكرمل، طماطم، بطاطا مقلية",
    rows: [
      { fr: "Merguez", ar: "مرقاز", price: 8.5 },
      { fr: "Pollo – Escalope grillé", ar: "بولو – إسكالوب مشوي", price: 9 },
      { fr: "Steak haché", ar: "لحم مفروم", price: 9 },
      { fr: "Chawarma", ar: "شاورما", price: 9.5 },
      { fr: "Crispy (escalope panée)", ar: "كريسبي (إسكالوب مقلي)", price: 10.5 },
      { fr: "Crunchy (cordon bleu)", ar: "كرانشي (كوردون بلو)", price: 10.5 },
      { fr: "Mexicano (steak haché + merguez)", ar: "مكسيكانو (لحم مفروم + مرقاز)", price: 11 },
      { fr: "Crousti (escalope panée + cordon bleu)", ar: "كروستي (إسكالوب مقلي + كوردون بلو)", price: 11 },
      { fr: "Pollo Tandoorie", ar: "بولو تندوري", price: 10 },
      { fr: "Mixte Pollo (escalope panée + cordon bleu + escalope grillée)", ar: "ميكست بولو (إسكالوب مقلي + كوردون بلو + إسكالوب مشوي)", price: 12.5 },
      { fr: "Trio Pollo (escalope panée + escalope tandoori + escalope grillée)", ar: "تريو بولو (إسكالوب مقلي + إسكالوب تندوري + إسكالوب مشوي)", price: 12.5 },
    ],
  },
  {
    key: "pizzwich",
    label: "Pizzwich",
    labelAr: "بيتزويتش",
    icon: "sandwich",
    img: "/cat_pizzwich_v2.jpg",
    note: "sauces, frites",
    noteAr: "صلصات، بطاطا مقلية",
    rows: [
      { fr: "Merguez", ar: "مرقاز", price: 10 },
      { fr: "Pollo – Escalope grillé", ar: "بولو – إسكالوب مشوي", price: 10.5 },
      { fr: "Steak haché", ar: "لحم مفروم", price: 10.5 },
      { fr: "Chawarma", ar: "شاورما", price: 11 },
      { fr: "Crispy (escalope panée)", ar: "كريسبي (إسكالوب مقلي)", price: 11 },
      { fr: "Crunchy (cordon bleu)", ar: "كرانشي (كوردون بلو)", price: 11 },
      { fr: "Mexicano (steak haché + merguez)", ar: "مكسيكانو (لحم مفروم + مرقاز)", price: 11.5 },
      { fr: "Crousti (escalope panée + cordon bleu)", ar: "كروستي (إسكالوب مقلي + كوردون بلو)", price: 11.5 },
      { fr: "Pollo Tandoorie", ar: "بولو تندوري", price: 11 },
      { fr: "Mixte Pollo (escalope panée + cordon bleu + escalope grillée)", ar: "ميكست بولو (إسكالوب مقلي + كوردون بلو + إسكالوب مشوي)", price: 12.5 },
      { fr: "Trio Pollo (escalope panée + escalope tandoori + escalope grillée)", ar: "تريو بولو (إسكالوب مقلي + إسكالوب تندوري + إسكالوب مشوي)", price: 13 },
    ],
  },
  {
    key: "paincheese",
    label: "Pain Cheese",
    labelAr: "بان تشيز",
    icon: "sandwich",
    img: "/cat_paincheese_v2.png",
    note: "sauces, laitue, oignons caramélisés, tomate, frites",
    noteAr: "صلصات، خس، بصل مكرمل، طماطم، بطاطا مقلية",
    rows: [
      { fr: "Merguez", ar: "مرقاز", price: 10 },
      { fr: "Pollo – Escalope grillé", ar: "بولو – إسكالوب مشوي", price: 10.5 },
      { fr: "Steak haché", ar: "لحم مفروم", price: 11 },
      { fr: "Chawarma", ar: "شاورما", price: 11 },
      { fr: "Crispy (escalope panée)", ar: "كريسبي (إسكالوب مقلي)", price: 11 },
      { fr: "Crunchy (cordon bleu)", ar: "كرانشي (كوردون بلو)", price: 11 },
      { fr: "Mexicano (steak haché + merguez)", ar: "مكسيكانو (لحم مفروم + مرقاز)", price: 11.5 },
      { fr: "Crousti (escalope panée + cordon bleu)", ar: "كروستي (إسكالوب مقلي + كوردون بلو)", price: 11.5 },
      { fr: "Pollo Tandoorie", ar: "بولو تندوري", price: 11 },
      { fr: "Mixte Pollo (escalope panée + cordon bleu + escalope grillée)", ar: "ميكست بولو (إسكالوب مقلي + كوردون بلو + إسكالوب مشوي)", price: 12.5 },
      { fr: "Trio Pollo (escalope panée + escalope tandoori + escalope grillée)", ar: "تريو بولو (إسكالوب مقلي + إسكالوب تندوري + إسكالوب مشوي)", price: 13 },
    ],
  },
  {
    key: "tacos",
    label: "Tacos",
    labelAr: "تاكوس",
    icon: "taco",
    img: "/cat_tacos.png",
    note: "sauces, frites",
    noteAr: "صلصات، بطاطا مقلية",
    rows: [
      { fr: "Merguez", ar: "مرقاز", price: 10 },
      { fr: "Pollo – Escalope grillé", ar: "بولو – إسكالوب مشوي", price: 10.5 },
      { fr: "Steak haché", ar: "لحم مفروم", price: 11 },
      { fr: "Chawarma", ar: "شاورما", price: 11 },
      { fr: "Crispy (escalope panée)", ar: "كريسبي (إسكالوب مقلي)", price: 11 },
      { fr: "Crunchy (cordon bleu)", ar: "كرانشي (كوردون بلو)", price: 11 },
      { fr: "Mexicano (steak haché + merguez)", ar: "مكسيكانو (لحم مفروم + مرقاز)", price: 11.5 },
      { fr: "Crousti (escalope panée + cordon bleu)", ar: "كروستي (إسكالوب مقلي + كوردون بلو)", price: 11.5 },
      { fr: "Pollo Tandoorie", ar: "بولو تندوري", price: 11 },
      { fr: "Mixte Pollo (escalope panée + cordon bleu + escalope grillée)", ar: "ميكست بولو (إسكالوب مقلي + كوردون بلو + إسكالوب مشوي)", price: 12.5 },
      { fr: "Trio Pollo (escalope panée + escalope tandoori + escalope grillée)", ar: "تريو بولو (إسكالوب مقلي + إسكالوب تندوري + إسكالوب مشوي)", price: 13 },
      { fr: "Tacos XL · 2 viandes", ar: "تاكوس XL · لحمين", price: 18 },
      { fr: "Tacos XL · Mixte Pollo", ar: "تاكوس XL · ميكست بولو", price: 22 },
    ],
  },
  {
    key: "pizzared",
    label: "Pizzas Rouges",
    labelAr: "بيتزا حمراء",
    icon: "pizza",
    img: "/pizza_marguerita.png",
    note: "base sauce tomate",
    noteAr: "أساس صلصة الطماطم",
    rows: [
      { fr: "Marguerita", ar: "مارغريتا", dFr: "mozza, tomate cerise, olives, basilic", dAr: "موزاريلا، طماطم كرزية، زيتون، ريحان", price: 14 },
      { fr: "Neptune", ar: "نبتون", dFr: "mozza, thon, tomate cerise, olives, basilic", dAr: "موزاريلا، تن، طماطم كرزية، زيتون، ريحان", price: 13.5 },
      { fr: "Charcuterie", ar: "شاركوتري", dFr: "mozza, charcuterie, tomate cerise, olives, basilic", dAr: "موزاريلا، شاركوتري، طماطم كرزية، زيتون، ريحان", price: 14 },
      { fr: "Pepperoni", ar: "بيبروني", dFr: "mozza, pepperoni, tomate cerise, olives, basilic", dAr: "موزاريلا، بيبروني، طماطم كرزية، زيتون، ريحان", price: 14.5 },
      { fr: "Mexicaine", ar: "مكسيكية", dFr: "mozza, steak haché, oignon, olives, basilic", dAr: "موزاريلا، لحم مفروم، بصل، زيتون، ريحان", price: 14.5 },
      { fr: "4 Fromages", ar: "أربعة أجبان", dFr: "mozza, 4 fromages", dAr: "موزاريلا، أربعة أجبان", price: 15.5 },
      { fr: "Chawarma", ar: "شاورما", dFr: "mozza, chawarma, tomate cerise, basilic", dAr: "موزاريلا، شاورما، طماطم كرزية، ريحان", price: 16 },
      { fr: "Orientale", ar: "شرقية", dFr: "mozza, merguez, œuf, tomate cerise, olives, basilic", dAr: "موزاريلا، مرقاز، بيضة، طماطم كرزية، زيتون، ريحان", price: 14 },
      { fr: "Végétarienne", ar: "نباتية", dFr: "mozza, légumes, champignons, artichauts, basilic", dAr: "موزاريلا، خضار، فطر، خرشوف، ريحان", price: 14 },
      { fr: "4 Saisons", ar: "أربعة فصول", dFr: "mozza, thon, poivrons, champignons, oignon, olives", dAr: "موزاريلا، تن، فلفل، فطر، بصل، زيتون", price: 15 },
      { fr: "Tunissiono", ar: "تونيسيونو", dFr: "mozza, thon, olives, ail, piment, tomate, basilic", dAr: "موزاريلا، تن، زيتون، ثوم، فلفل حار، طماطم، ريحان", price: 15 },
      { fr: "Spicy", ar: "سبايسي", dFr: "mozza, sauce piquante, steak haché, merguez, poivrons", dAr: "موزاريلا، صلصة حارة، لحم مفروم، مرقاز، فلفل", price: 16 },
      { fr: "Pescala Poulet", ar: "بيسكالا دجاج", dFr: "mozza, poulet, tomate cerise, basilic", dAr: "موزاريلا، دجاج، طماطم كرزية، ريحان", price: 16 },
    ],
  },
  {
    key: "pizzawhite",
    label: "Pizzas Blanches",
    labelAr: "بيتزا بيضاء",
    icon: "pizza",
    img: "/pizza_poulet.png",
    note: "base sauce blanche",
    noteAr: "أساس صلصة بيضاء",
    rows: [
      { fr: "Motadore", ar: "موتادور", dFr: "mozza, steak haché, jambon fumé, tomate cerise, basilic", dAr: "موزاريلا، لحم مفروم، جامبون مدخن، طماطم كرزية، ريحان", price: 16 },
      { fr: "Cheesy Easy", ar: "تشيزي إيزي", dFr: "mozza, 4 fromages, tomate cerise, basilic", dAr: "موزاريلا، أربعة أجبان، طماطم كرزية، ريحان", price: 16.5 },
      { fr: "Fermière", ar: "فيرميار", dFr: "mozza, poulet, pomme de terre, tomate cerise, basilic", dAr: "موزاريلا، دجاج، بطاطا، طماطم كرزية، ريحان", price: 16.5 },
      { fr: "Mixte Pollo", ar: "ميكست بولو", dFr: "mozza, poulet, cordon bleu, poulet pané", dAr: "موزاريلا، دجاج، كوردون بلو، دجاج مقلي", price: 18 },
      { fr: "Chèvre", ar: "جبن الماعز", dFr: "mozza, chèvre, miel, oignons, tomate cerise, basilic", dAr: "موزاريلا، جبن ماعز، عسل، بصل، طماطم كرزية، ريحان", price: 17 },
      { fr: "Pizza Crousty", ar: "بيتزا كروستي", dFr: "mozza, poulet pané, cordon bleu, tomate cerise", dAr: "موزاريلا، دجاج مقلي، كوردون بلو، طماطم كرزية", price: 16 },
      { fr: "Maripossa", ar: "ماريبوسا", dFr: "mozza, saumon fumé, tomate cerise, basilic", dAr: "موزاريلا، سلمون مدخن، طماطم كرزية، ريحان", price: 23 },
    ],
  },
  {
    key: "mini",
    label: "Mini Pizzas",
    labelAr: "ميني بيتزا",
    icon: "pizza",
    img: "/mini_pizza.png",
    note: "offre du midi uniquement",
    noteAr: "عرض الظهيرة فقط",
    rows: [
      { fr: "Marguerita", ar: "مارغريتا", price: 7 },
      { fr: "Neptune", ar: "نبتون", price: 7 },
      { fr: "Poulet", ar: "دجاج", price: 7 },
      { fr: "Jambon", ar: "جامبون", price: 7 },
      { fr: "4 Saisons", ar: "أربعة فصول", price: 8 },
      { fr: "Chawarma", ar: "شاورما", price: 8 },
      { fr: "Fermière", ar: "فيرميار", price: 8 },
    ],
  },
  {
    key: "bowls",
    label: "Bowls",
    labelAr: "بولز",
    icon: "bowl",
    img: "/bowl_poulet_v2.png",
    note: "sauces, mozza gratiné, frites",
    noteAr: "صلصات، موزاريلا غراتان، بطاطا مقلية",
    rows: [
      { fr: "Crunchy (Cordon bleu)", ar: "كرانشي (كوردون بلو)", price: 16.5 },
      { fr: "Crispy (Poulet pané)", ar: "كريسبي (دجاج مقلي)", price: 16.5 },
      { fr: "Crousty (pané + cordon bleu)", ar: "كروستي (مقلي + كوردون بلو)", price: 18 },
      { fr: "Bowl Healthy · légumes + viande + mozza", ar: "بول صحي · خضار + لحم + موزاريلا", price: 18 },
    ],
  },
  {
    key: "drinks",
    label: "Boissons",
    labelAr: "مشروبات",
    icon: "drink",
    img: "/boga_cidre.png",
    rows: [
      { fr: "Soda", ar: "صودا", price: 2.5 },
      { fr: "Eau 0.5L", ar: "ماء 0.5ل", price: 1 },
    ],
  },
  {
    key: "supp",
    label: "Suppléments",
    labelAr: "إضافات",
    icon: "extra",
    img: "/supp_frites.png",
    rows: [
      { fr: "Œuf", ar: "بيضة", price: 1 },
      { fr: "Frites", ar: "بطاطا مقلية", price: 3.5 },
      { fr: "Viande", ar: "لحم", price: 4 },
    ],
  },
];

/** Prefix an item name with its category, unless it already starts with it. */
function withPrefix(prefix: string, name: string): string {
  const ln = name.toLowerCase();
  const lp = prefix.toLowerCase();
  const singular = lp.endsWith("s") ? lp.slice(0, -1) : lp;
  if (ln.startsWith(lp) || ln.startsWith(singular)) return name;
  return `${prefix} ${name}`;
}

/** French/Arabic display prefixes per category (mirrors the printed menu). */
function prefixesFor(key: string, label: string, labelAr: string): [string, string] | null {
  if (["panuozzo", "pizzwich", "paincheese", "tacos", "bowls"].includes(key)) {
    return [label, labelAr];
  }
  if (key === "mini") return ["Mini Pizza", "ميني بيتزا"];
  if (key === "pizzared" || key === "pizzawhite") return ["Pizza", "بيتزا"];
  return null;
}

function toItem(cat: RawCategory, row: Row, i: number): MenuItem {
  const id = `${cat.key}-${i}`;
  let name = row.fr;
  let nameAr = row.ar;

  const pref = prefixesFor(cat.key, cat.label, cat.labelAr);
  if (pref) {
    name = withPrefix(pref[0], name);
    nameAr = withPrefix(pref[1], nameAr);
  }

  const base: MenuItem = { id, name, nameAr, price: row.price };
  if ("dFr" in row) {
    base.desc = row.dFr;
    base.descAr = row.dAr;
  }

  // Assign generated meat images based on keywords in the French name
  const ln = name.toLowerCase();

  if (cat.key === "bowls") {
    if (ln.includes("healthy")) base.img = "/bowl_healthy_new.png";
    else if (ln.includes("crousty")) base.img = "/bowl_crousty.png";
    else if (ln.includes("crunchy")) base.img = "/bowl_crunchy.png";
    else if (ln.includes("crispy")) base.img = "/bowl_crispy.png";
  } else if (ln.includes("mexicano")) {
    base.img = "/meat_mexicano.png";
  } else if (ln.includes("crousti")) {
    base.img = "/meat_crousti.png";
  } else if (ln.includes("mixte pollo")) {
    base.img = ["pizzared", "pizzawhite", "mini"].includes(cat.key) ? "/pizza_mixtepollo.png" : "/meat_mixte_pollo.png";
  } else if (ln.includes("trio pollo")) {
    base.img = "/meat_trio_pollo.png";
  } else if (ln.includes("merguez")) {
    base.img = "/meat_merguez.png";
  } else if (ln.includes("escalope grillé")) {
    base.img = "/meat_escalope_grille.png";
  } else if (ln.includes("steak haché")) {
    base.img = "/meat_steak_hache.png";
  } else if (ln.includes("chawarma")) {
    base.img = ["pizzared", "pizzawhite", "mini"].includes(cat.key) ? "/pizza_chawarma.png" : "/meat_chawarma.png";
  } else if (ln.includes("crispy")) {
    base.img = "/meat_escalope_panee.png";
  } else if (ln.includes("crunchy")) {
    base.img = "/meat_cordon_bleu.png";
  } else if (ln.includes("tandoorie")) {
    base.img = "/meat_tandoori.png";
  } else if (ln.includes("marguerita")) {
    base.img = "/pizza_marguerita.png";
  } else if (ln.includes("pepperoni")) {
    base.img = "/pizza_pepperoni.png";
  } else if (ln.includes("neptune")) {
    base.img = "/pizza_neptune.png";
  } else if (ln.includes("4 fromages")) {
    base.img = "/pizza_4fromages.png";
  } else if (ln.includes("poulet") || ln.includes("fermière")) {
    base.img = "/pizza_poulet.png";
  } else if (cat.key === "mini") {
    base.img = "/mini_pizza.png";
  } else if (ln.includes("healthy")) {
    base.img = "/bowl_healthy.png";
  } else if (cat.key === "bowls") {
    base.img = "/bowl_poulet_v2.png";
  } else if (ln.includes("soda")) {
    base.img = "/boga_cidre.png";
  } else if (ln.includes("eau")) {
    base.img = "/safia_water.png";
  } else if (ln.includes("œuf") || ln.includes("oeuf")) {
    base.img = "/supp_oeuf.png";
  } else if (ln.includes("frites")) {
    base.img = "/supp_frites.png";
  } else if (ln === "viande") {
    base.img = "/supp_viande_mix.png";
  } else if (ln.includes("tacos xl")) {
    base.img = "/tacos_xl.png";
  } else if (ln.includes("charcuterie")) {
    base.img = "/pizza_charcuterie.png";
  } else if (ln.includes("mexicaine")) {
    base.img = "/pizza_mexicaine.png";
  } else if (ln.includes("orientale")) {
    base.img = "/pizza_orientale.png";
  } else if (ln.includes("tunissiono")) {
    base.img = "/pizza_tunissiono.png";
  } else if (ln.includes("spicy")) {
    base.img = "/pizza_spicy.png";
  } else if (ln.includes("motadore")) {
    base.img = "/pizza_motadore.png";
  } else if (ln.includes("chèvre")) {
    base.img = "/pizza_chevre.png";
  } else if (ln.includes("maripossa")) {
    base.img = "/pizza_maripossa.png";
  } else if (ln.includes("cheesy easy")) {
    base.img = "/pizza_cheesyeasy.png";
  } else if (ln.includes("pizza crousty")) {
    base.img = "/pizza_crousty.png";
  } else if (ln.includes("végétarienne")) {
    base.img = "/pizza_vegetarienne.png";
  } else if (ln.includes("4 saisons")) {
    base.img = "/pizza_4saisons.png";
  } else if (cat.key === "pizzawhite" && !base.img) {
    base.img = "/pizza_base_blanche.png";
  } else if (cat.key === "pizzared" && !base.img) {
    base.img = "/pizza_marguerita.png";
  }

  return base;
}

export const MENU: MenuCategory[] = RAW.map((c) => ({
  key: c.key,
  label: c.label,
  labelAr: c.labelAr,
  icon: c.icon,
  img: c.img,
  note: c.note,
  noteAr: c.noteAr,
  items: c.rows.map((row, i) => toItem(c, row, i)),
}));

/** Flat lookup of every item by id (for cart resolution). */
export const ITEMS_BY_ID: Record<string, MenuItem> = Object.fromEntries(
  MENU.flatMap((c) => c.items).map((it) => [it.id, it])
);

export const DEFAULT_CATEGORY = MENU[0].key;

/** Category label / note in the active language. */
export function catLabel(cat: MenuCategory, lang: Lang): string {
  return lang === "ar" ? cat.labelAr : cat.label;
}
export function catNote(cat: MenuCategory, lang: Lang): string | undefined {
  return lang === "ar" ? cat.noteAr : cat.note;
}
