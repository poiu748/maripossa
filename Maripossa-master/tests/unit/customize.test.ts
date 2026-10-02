import { describe, expect, it } from "vitest";
import {
  CUSTOMIZE,
  SAUCES,
  SUPPLEMENTS,
  VEGGIES,
  categoryOfItem,
  defaultOptions,
  includedIngredients,
  isCustomizable,
  lineKey,
  needsMeatChoice,
  summarizeOptions,
  supplementsTotal,
} from "../../lib/customize";
import { MENU } from "../../lib/menu";
import type { CartOptions, MenuItem } from "../../lib/types";

const opts = (o: Partial<CartOptions> = {}): CartOptions => ({
  sauces: [],
  removed: [],
  supplements: [],
  viandeNote: "",
  meatNote: "",
  note: "",
  ...o,
});

/** Menu item names are category-prefixed ("Tacos Merguez") — match by suffix. */
function itemByName(catKey: string, name: string): MenuItem {
  const item = MENU.find((c) => c.key === catKey)?.items.find(
    (i) => i.name === name || i.name.endsWith(` ${name}`)
  );
  if (!item) throw new Error(`menu item not found: ${catKey} / ${name}`);
  return item;
}

describe("business rules", () => {
  it("sandwiches, tacos and pizzas are customizable; bowls/drinks/supp are not", () => {
    for (const id of [
      "panuozzo-0",
      "paincheese-3",
      "pizzwich-1",
      "tacos-5",
      "pizzared-0",
      "pizzawhite-6",
      "mini-2",
    ]) {
      expect(isCustomizable(id), id).toBe(true);
    }
    for (const id of ["bowls-0", "drinks-0", "supp-0"]) {
      expect(isCustomizable(id), id).toBe(false);
    }
  });

  it("vegetables only on Panuozzo and Pain Cheese", () => {
    const withVeg = Object.keys(CUSTOMIZE).filter((k) => CUSTOMIZE[k].veggies);
    expect(withVeg.sort()).toEqual(["paincheese", "panuozzo"]);
  });

  it("sauces on the four sandwich types, not on pizzas", () => {
    const withSauces = Object.keys(CUSTOMIZE).filter((k) => CUSTOMIZE[k].sauces);
    expect(withSauces.sort()).toEqual(["paincheese", "panuozzo", "pizzwich", "tacos"]);
  });

  it("the five sauces plus the explicit 'Sans sauce' choice are defined", () => {
    expect(SAUCES.map((s) => s.fr)).toEqual([
      "Sauce à l'ail",
      "Barbecue",
      "Algérienne",
      "Harissa",
      "Mayonnaise",
      "Sans sauce",
    ]);
    expect(VEGGIES.map((v) => v.fr)).toEqual([
      "Tomate",
      "Oignons caramélisés",
      "Laitue",
    ]);
  });

  it("mozza is for Pain Cheese + Pizzwich; mozza sandwich is for Tacos + Panuozzo", () => {
    const offering = (suppId: string) =>
      Object.keys(CUSTOMIZE)
        .filter((k) => CUSTOMIZE[k].supplements.includes(suppId))
        .sort();
    expect(offering("mozza")).toEqual(["paincheese", "pizzwich"]);
    expect(offering("mozza-sandwich")).toEqual(["panuozzo", "tacos"]);
  });

  it("only pizzas can contain œuf — and it is their only supplement", () => {
    const offering = Object.keys(CUSTOMIZE)
      .filter((k) => CUSTOMIZE[k].supplements.includes("oeuf"))
      .sort();
    expect(offering).toEqual(["mini", "pizzared", "pizzawhite"]);
    for (const k of offering) {
      expect(CUSTOMIZE[k].supplements).toEqual(["oeuf"]);
    }
  });

  it("every customizable category exists in the menu", () => {
    const menuKeys = new Set(MENU.map((c) => c.key));
    for (const key of Object.keys(CUSTOMIZE)) {
      expect(menuKeys.has(key), key).toBe(true);
    }
  });

  it("every offered supplement has a definition with a positive price", () => {
    const defined = new Map(SUPPLEMENTS.map((s) => [s.id, s]));
    for (const cfg of Object.values(CUSTOMIZE)) {
      for (const id of cfg.supplements) {
        const def = defined.get(id);
        expect(def, id).toBeDefined();
        expect(def!.price, id).toBeGreaterThan(0);
      }
    }
  });
});

describe("included ingredients (removable, free)", () => {
  it("every sandwich type includes fromage", () => {
    for (const cat of ["panuozzo", "paincheese", "pizzwich", "tacos"]) {
      const item = MENU.find((c) => c.key === cat)!.items[0];
      const ids = includedIngredients(item).map((i) => i.id);
      expect(ids, cat).toContain("fromage");
    }
  });

  it("tacos also include sauce fromagère", () => {
    const tacos = MENU.find((c) => c.key === "tacos")!.items[0];
    const ids = includedIngredients(tacos).map((i) => i.id);
    expect(ids).toContain("sauce-fromagere");
    // but a panuozzo does not
    const panuozzo = MENU.find((c) => c.key === "panuozzo")!.items[0];
    expect(includedIngredients(panuozzo).map((i) => i.id)).not.toContain(
      "sauce-fromagere"
    );
  });

  it("veg sandwiches include the three vegetables; pizzwich does not", () => {
    const panuozzo = MENU.find((c) => c.key === "panuozzo")!.items[0];
    const ids = includedIngredients(panuozzo).map((i) => i.id);
    expect(ids).toEqual(expect.arrayContaining(["tomate", "oignons", "laitue"]));

    const pizzwich = MENU.find((c) => c.key === "pizzwich")!.items[0];
    expect(includedIngredients(pizzwich).map((i) => i.id)).toEqual(["fromage"]);
  });

  it("pizzas expose their own ingredients from the menu description", () => {
    const quatreSaisons = itemByName("pizzared", "4 Saisons");
    expect(includedIngredients(quatreSaisons).map((i) => i.id)).toContain("oignon");

    const chevre = itemByName("pizzawhite", "Chèvre");
    expect(includedIngredients(chevre).map((i) => i.id)).toContain("miel");
  });

  it("mini pizzas (no description) have no removable ingredients", () => {
    const mini = MENU.find((c) => c.key === "mini")!.items[0];
    expect(includedIngredients(mini)).toEqual([]);
  });

  it("non-customizable items expose nothing", () => {
    const bowl = MENU.find((c) => c.key === "bowls")!.items[0];
    expect(includedIngredients(bowl)).toEqual([]);
  });

  it("nothing is removed by default", () => {
    const d = defaultOptions("tacos-0");
    expect(d.removed).toEqual([]);
    expect(d.sauces).toEqual(["mayo", "algerienne", "harissa"]);
    expect(d.supplements).toEqual([]);
    expect(d.viandeNote).toBe("");
    expect(d.meatNote).toBe("");
    expect(d.note).toBe("");
  });
});

describe("multi-meat items", () => {
  it("only '2 viandes' items require spelling out the meats", () => {
    expect(needsMeatChoice(itemByName("tacos", "Tacos XL · 2 viandes"))).toBe(true);
    expect(needsMeatChoice(itemByName("tacos", "Merguez"))).toBe(false);
    // an XL that is not "2 viandes" does not need the meats field
    expect(needsMeatChoice(itemByName("tacos", "Tacos XL · Mixte Pollo"))).toBe(false);
  });
});

describe("pricing", () => {
  it("sums only the chosen supplements", () => {
    expect(supplementsTotal(undefined)).toBe(0);
    expect(supplementsTotal(opts())).toBe(0);
    expect(supplementsTotal(opts({ supplements: ["mozza"] }))).toBe(4);
    expect(supplementsTotal(opts({ supplements: ["mozza-sandwich"] }))).toBe(2);
    expect(supplementsTotal(opts({ supplements: ["oeuf"] }))).toBe(1);
    expect(supplementsTotal(opts({ supplements: ["viande", "frites"] }))).toBe(7.5);
  });

  it("removing included ingredients is free", () => {
    const full = opts({
      sauces: ["harissa", "mayo"],
      removed: ["fromage", "sauce-fromagere", "tomate"],
      note: "bien cuit",
    });
    expect(supplementsTotal(full)).toBe(0);
  });

  it("ignores unknown supplement ids", () => {
    expect(supplementsTotal(opts({ supplements: ["caviar"] }))).toBe(0);
  });
});

describe("cart line identity", () => {
  it("same choices in a different order merge into the same line", () => {
    const a = opts({ sauces: ["harissa", "mayo"], removed: ["fromage", "tomate"] });
    const b = opts({ sauces: ["mayo", "harissa"], removed: ["tomate", "fromage"] });
    expect(lineKey("panuozzo-0", a)).toBe(lineKey("panuozzo-0", b));
  });

  it("note comparison ignores case and surrounding spaces", () => {
    expect(lineKey("tacos-1", opts({ note: "  Bien Cuit " }))).toBe(
      lineKey("tacos-1", opts({ note: "bien cuit" }))
    );
  });

  it("any different choice makes a separate line", () => {
    const base = opts({ sauces: ["harissa"] });
    expect(lineKey("tacos-1", base)).not.toBe(lineKey("tacos-1", opts({ sauces: ["mayo"] })));
    expect(lineKey("tacos-1", base)).not.toBe(
      lineKey("tacos-1", opts({ sauces: ["harissa"], removed: ["fromage"] }))
    );
    expect(lineKey("tacos-1", base)).not.toBe(lineKey("tacos-1", opts({ sauces: ["harissa"], note: "x" })));
    expect(lineKey("tacos-1", base)).not.toBe(lineKey("tacos-2", base));
    // different meats or a different supplement meat = different lines
    expect(lineKey("tacos-11", opts({ meatNote: "merguez + escalope" }))).not.toBe(
      lineKey("tacos-11", opts({ meatNote: "merguez + chawarma" }))
    );
    expect(
      lineKey("tacos-1", opts({ supplements: ["viande"], viandeNote: "crispy" }))
    ).not.toBe(lineKey("tacos-1", opts({ supplements: ["viande"], viandeNote: "merguez" })));
  });

  it("plain items use the item id itself", () => {
    expect(lineKey("drinks-0")).toBe("drinks-0");
  });
});

describe("order summaries", () => {
  it("lists sauces, removed ingredients and supplements in French", () => {
    const s = summarizeOptions(
      "panuozzo-0",
      opts({
        sauces: ["harissa", "mayo"],
        removed: ["tomate"],
        supplements: ["mozza-sandwich"],
      }),
      "fr"
    );
    expect(s).toEqual(["Harissa · Mayonnaise", "Sans Tomate", "+ Fromage"]);
  });

  it("tacos without sauce fromagère reads 'Sans Sauce fromagère'", () => {
    const s = summarizeOptions("tacos-0", opts({ removed: ["sauce-fromagere"] }), "fr");
    expect(s).toEqual(["Sans Sauce fromagère"]);
  });

  it("multi-meat choice leads the summary; the viande supplement names its meat", () => {
    const s = summarizeOptions(
      "tacos-11",
      opts({
        meatNote: "merguez + escalope",
        sauces: ["harissa"],
        supplements: ["viande"],
        viandeNote: "crispy",
      }),
      "fr"
    );
    expect(s).toEqual([
      "Viandes: merguez + escalope",
      "Harissa",
      "+ Viande (crispy)",
    ]);
  });

  it("the explicit 'Sans sauce' choice reads as a sauce", () => {
    const s = summarizeOptions("tacos-0", opts({ sauces: ["sans-sauce"] }), "fr");
    expect(s).toEqual(["Sans sauce"]);
  });

  it("pizza ingredient removals use the description names (Chèvre sans miel)", () => {
    const chevre = itemByName("pizzawhite", "Chèvre");
    const s = summarizeOptions(chevre.id, opts({ removed: ["miel"] }), "fr");
    expect(s).toEqual(["Sans miel"]);
  });

  it("no 'Sans' line when nothing is removed", () => {
    expect(summarizeOptions("paincheese-0", opts(), "fr")).toEqual([]);
  });

  it("translates to Arabic", () => {
    const s = summarizeOptions(
      "panuozzo-0",
      opts({ sauces: ["ail"], removed: ["fromage"], supplements: ["viande"] }),
      "ar"
    );
    expect(s[0]).toBe("صلصة الثوم");
    expect(s[1]).toBe("بدون جبن");
    expect(s[2]).toBe("+ لحم");
  });

  it("returns nothing for plain or non-customizable items", () => {
    expect(summarizeOptions("drinks-0", opts({ sauces: ["mayo"] }), "fr")).toEqual([]);
    expect(summarizeOptions("panuozzo-0", undefined, "fr")).toEqual([]);
  });
});

describe("category resolution", () => {
  it("extracts the category from an item id", () => {
    expect(categoryOfItem("paincheese-10")).toBe("paincheese");
    expect(categoryOfItem("mini-0")).toBe("mini");
  });
});
