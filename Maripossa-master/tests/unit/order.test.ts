import { describe, expect, it } from "vitest";
import { buildWhatsAppHref } from "../../lib/order";
import type { OrderInfo } from "../../lib/order";
import type { CartLine } from "../../lib/types";

const merguez: CartLine = {
  key: "k1",
  itemId: "panuozzo-0",
  name: "Panuozzo Merguez",
  nameAr: "بانوتزو مرقاز",
  price: 10.5,
  qty: 2,
  options: {
    sauces: ["harissa", "mayo"],
    removed: ["tomate"],
    supplements: ["mozza-sandwich"],
    viandeNote: "",
    meatNote: "",
    note: "bien cuit svp",
  },
};

const tacosXL: CartLine = {
  key: "k2",
  itemId: "tacos-11",
  name: "Tacos XL · 2 viandes",
  nameAr: "تاكوس XL · لحمين",
  price: 22,
  qty: 1,
  options: {
    sauces: ["sans-sauce"],
    removed: [],
    supplements: ["viande"],
    viandeNote: "crispy",
    meatNote: "merguez + escalope",
    note: "",
  },
};

const soda: CartLine = {
  key: "drinks-0",
  itemId: "drinks-0",
  name: "Soda",
  nameAr: "صودا",
  price: 2.5,
  qty: 1,
};

/** The drink preference rides as a note on the Soda cart line. */
const sodaWithNote: CartLine = {
  ...soda,
  key: "drinks-0|boga",
  options: {
    sauces: [],
    removed: [],
    supplements: [],
    viandeNote: "",
    meatNote: "",
    note: "Boga menthe",
  },
};

const base: OrderInfo = {
  lines: [merguez],
  total: 21,
  mode: "pickup",
  name: "",
  address: "",
  phone: "",
};

function decoded(href: string): string {
  return decodeURIComponent(href.split("?text=")[1]);
}

describe("WhatsApp order message (always French, worker-facing)", () => {
  it("targets the restaurant number and encodes everything", () => {
    const href = buildWhatsAppHref(base);
    expect(href.startsWith("https://wa.me/21624640332?text=")).toBe(true);
    expect(href).not.toMatch(/\s/); // fully URL-encoded
  });

  it("is worker-friendly: numbered bold items, labeled choice lines, bold total", () => {
    const msg = decoded(
      buildWhatsAppHref({
        ...base,
        lines: [merguez, soda],
        total: 23.5,
        mode: "delivery",
        name: "Aziz",
        address: "Rue 5 & Av. Habib",
        phone: "26 123 456",
      })
    );
    expect(msg).toContain("*MARIPOSSA — NOUVELLE COMMANDE*");
    expect(msg).toContain("━━━");
    expect(msg).toContain("*1. Panuozzo Merguez*");
    expect(msg).toContain("×2");
    expect(msg).toContain("21 DT");
    expect(msg).toContain("🥫 Sauces: Harissa, Mayonnaise");
    expect(msg).toContain("🚫 Sans: Tomate");
    expect(msg).toContain("➕ Suppléments: Fromage");
    expect(msg).toContain("📝 Note: bien cuit svp");
    expect(msg).toContain("*2. Soda*");
    expect(msg).toContain("🛵 *Service*: Livraison");
    expect(msg).toContain("via société de livraison");
    expect(msg).toContain("👤 *Nom*: Aziz");
    expect(msg).toContain("📞 *Tél*: 26 123 456");
    expect(msg).toContain("📍 *Adresse*: Rue 5 & Av. Habib");
    expect(msg).toContain("💰 *TOTAL: 23.5 DT*");
  });

  it("labels the meats and the supplement meat clearly", () => {
    const msg = decoded(buildWhatsAppHref({ ...base, lines: [tacosXL], total: 26 }));
    expect(msg).toContain("*1. Tacos XL · 2 viandes*");
    expect(msg).toContain("🥩 Viandes: merguez + escalope");
    expect(msg).toContain("🥫 Sauces: Sans sauce");
    expect(msg).toContain("➕ Suppléments: Viande (crispy)");
  });

  it("carries the drink preference as a note on the Soda line", () => {
    const msg = decoded(buildWhatsAppHref({ ...base, lines: [merguez, sodaWithNote] }));
    expect(msg).toContain("*2. Soda*");
    expect(msg).toContain("📝 Note: Boga menthe");
  });

  it("pickup orders show 'Retrait' and omit address, empty fields stay out", () => {
    const msg = decoded(buildWhatsAppHref({ ...base, address: "Rue oubliée" }));
    expect(msg).toContain("🏪 *Service*: Retrait");
    expect(msg).not.toContain("Adresse");
    expect(msg).not.toContain("Nom");
    expect(msg).not.toContain("Tél");
    expect(msg).not.toContain("société de livraison");
  });

  it("stays French even for items that carry Arabic names", () => {
    // the customer may browse in Arabic, but the kitchen message is French
    const msg = decoded(buildWhatsAppHref({ ...base, lines: [merguez] }));
    expect(msg).toContain("*1. Panuozzo Merguez*");
    expect(msg).not.toContain("بانوتزو");
    expect(msg).toContain("🥫 Sauces: Harissa, Mayonnaise");
  });
});
