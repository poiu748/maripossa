import { expect, test, type Page } from "@playwright/test";

/**
 * End-to-end order flow, driven like a real customer on a phone.
 * Selectors rely on visible text only — no test hooks in the components.
 * Menu item names are category-prefixed ("Panuozzo Merguez"), so item
 * selectors use loose regexes while category headers stay anchored.
 */

async function ready(page: Page) {
  await page.goto("/");
  await page.locator("html[data-hydrated]").waitFor();
}

/** Visible <h3> — matches category headers and item card titles. */
function h3(page: Page, text: RegExp) {
  return page.locator("h3:visible", { hasText: text }).first();
}

/** The customize sheet panel (has dir + the "Personnalisez" kicker).
 *  Non-exact match: the kicker also holds the "Article 1/2" badge at qty > 1. */
function customizeSheet(page: Page) {
  return page
    .locator("div[dir]")
    .filter({ has: page.getByText("Personnalisez") })
    .last();
}

/** The cart panel (has dir + the "Votre commande" heading), either step. */
function cartSheet(page: Page) {
  return page
    .locator("div[dir]")
    .filter({ has: page.getByRole("heading", { name: "Votre commande" }) })
    .last();
}

/** The visible menu card of an item already in the cart. */
function itemCard(page: Page, name: RegExp) {
  return page
    .locator("div:visible")
    .filter({ has: page.locator("h3", { hasText: name }) })
    .filter({ has: page.getByLabel("increase") })
    .last();
}

const cartBar = (page: Page) => page.getByRole("button", { name: /Voir la commande/ });

/** Add button of the customize sheet (last step) or "Suivant" between pieces. */
const addBtn = (sheet: ReturnType<typeof customizeSheet>) =>
  sheet.getByRole("button", { name: /Ajouter|Suivant/ });

function waMessage(href: string): string {
  return decodeURIComponent(href.split("?text=")[1]);
}

/** Walk the cart from step 1 to step 2 (service + contact) and return it. */
async function toCheckout(page: Page) {
  const cart = cartSheet(page);
  await cart.getByRole("button", { name: "Suivant", exact: true }).click();
  return cart;
}

test("panuozzo: sauces, removed ingredient, mozza sandwich, note → WhatsApp", async ({ page }) => {
  await ready(page);

  // Panuozzo is the default open category
  await h3(page, /Merguez/).click();
  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();

  // the five sauces plus the explicit "Sans sauce" are offered
  for (const s of ["Sauce à l'ail", "Barbecue", "Algérienne", "Harissa", "Mayonnaise", "Sans sauce"]) {
    await expect(sheet.getByRole("button", { name: s, exact: true })).toBeVisible();
  }

  // fromage + the three vegetables start included (✓)
  await expect(sheet.getByRole("button", { name: "✓ Fromage", exact: true })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "✓ Tomate", exact: true })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "✓ Laitue", exact: true })).toBeVisible();

  // mozza sandwich offered; plain mozza and œuf are not
  await expect(sheet.getByRole("button", { name: "Fromage +2" })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Fromage +4" })).toHaveCount(0);

  // choose: 2 sauces, no tomato, + mozza sandwich, a note
  await sheet.getByRole("button", { name: "Harissa", exact: true }).click();
  await sheet.getByRole("button", { name: "Mayonnaise", exact: true }).click();
  await sheet.getByRole("button", { name: "✓ Tomate", exact: true }).click();
  await sheet.getByRole("button", { name: "Fromage +2" }).click();
  await sheet.getByPlaceholder(/bien cuit/).fill("sans piment svp");

  // 1 × (8.5 + 2) = 10.5 DT on the Add button
  await expect(addBtn(sheet)).toContainText("10.5 DT");
  await addBtn(sheet).click();

  // sheet closes, cart bar shows the total
  await expect(page.getByText("Personnalisez", { exact: true })).toHaveCount(0);
  await expect(cartBar(page)).toContainText("10.5 DT");
  await cartBar(page).click();

  // the cart line carries every choice
  const cart = cartSheet(page);
  await expect(cart.getByText("Panuozzo Merguez")).toBeVisible();
  await expect(cart.getByText(/Harissa · Mayonnaise/)).toBeVisible();
  await expect(cart.getByText(/Sans Tomate/)).toBeVisible();
  await expect(cart.getByText(/\+ Fromage/)).toBeVisible();
  await expect(cart.getByText(/sans piment svp/)).toBeVisible();

  // + in the cart bumps the same line: 2 × 10.5 = 21 DT
  await cart.getByLabel("increase").click();

  // go to checkout and read the WhatsApp message
  await toCheckout(page);
  const href = await cart.locator('a[href*="wa.me"]').getAttribute("href");
  const msg = waMessage(href!);
  expect(msg).toContain("*1. Panuozzo Merguez*");
  expect(msg).toContain("×2");
  expect(msg).toContain("🥫 Sauces: Harissa, Mayonnaise");
  expect(msg).toContain("🚫 Sans: Tomate");
  expect(msg).toContain("➕ Suppléments: Fromage");
  expect(msg).toContain("📝 Note: sans piment svp");
  expect(msg).toContain("TOTAL: 21 DT");
});

test("a sauce is mandatory — cannot add until one is chosen", async ({ page }) => {
  await ready(page);
  await h3(page, /Merguez/).click();
  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();

  // blocked: warning shown, button disabled
  await expect(sheet.getByText(/au moins une sauce/)).toBeVisible();
  await expect(addBtn(sheet)).toBeDisabled();

  // "Sans sauce" satisfies the requirement
  await sheet.getByRole("button", { name: "Sans sauce", exact: true }).click();
  await expect(addBtn(sheet)).toBeEnabled();
  await addBtn(sheet).click();

  await cartBar(page).click();
  await expect(cartSheet(page).getByText(/Sans sauce/)).toBeVisible();
});

test("qty 2 walks piece by piece — different choices make two lines", async ({ page }) => {
  await ready(page);
  await h3(page, /Merguez/).click();
  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();

  // bump to 2 pieces → the footer becomes a step button (Suivant · 1/2)
  await sheet.getByLabel("increase").click();
  await expect(addBtn(sheet)).toContainText("1/2");

  // piece 1: Harissa → Suivant
  await sheet.getByRole("button", { name: "Harissa", exact: true }).click();
  await expect(addBtn(sheet)).toContainText("Suivant");
  await addBtn(sheet).click();

  // piece 2: Barbecue → final Ajouter
  await sheet.getByRole("button", { name: "Barbecue", exact: true }).click();
  await expect(addBtn(sheet)).toContainText("Ajouter");
  await addBtn(sheet).click();

  // two distinct cart lines
  await cartBar(page).click();
  await expect(cartSheet(page).getByLabel("decrease")).toHaveCount(2);
});

test("tacos XL · 2 viandes: the meats must be spelled out", async ({ page }) => {
  await ready(page);
  await h3(page, /^Tacos$/).click();
  await h3(page, /2 viandes/).click();

  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();
  // pick a sauce first, then the meats requirement surfaces
  await sheet.getByRole("button", { name: "Harissa", exact: true }).click();
  await expect(sheet.getByText(/Précisez les viandes/)).toBeVisible();
  await expect(addBtn(sheet)).toBeDisabled();
  await sheet.getByPlaceholder(/merguez \+ escalope/).fill("merguez + escalope");
  await expect(addBtn(sheet)).toBeEnabled();
  await addBtn(sheet).click();

  await cartBar(page).click();
  await expect(cartSheet(page).getByText(/Viandes: merguez \+ escalope/)).toBeVisible();
});

test("viande supplement asks which meat", async ({ page }) => {
  await ready(page);
  await h3(page, /Merguez/).click();
  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();

  await sheet.getByRole("button", { name: "Harissa", exact: true }).click();
  await sheet.getByRole("button", { name: "Viande +4" }).click();

  // a "which meat?" field appears and blocks until filled
  await expect(sheet.getByText(/Précisez la viande du supplément/)).toBeVisible();
  await sheet.getByPlaceholder(/Quelle viande/).fill("crispy");
  await expect(addBtn(sheet)).toBeEnabled();
  await addBtn(sheet).click();

  await cartBar(page).click();
  await expect(cartSheet(page).getByText(/\+ Viande \(crispy\)/)).toBeVisible();
});

test("tacos: fromage + sauce fromagère included, no vegetables", async ({ page }) => {
  await ready(page);
  await h3(page, /^Tacos$/).click();
  await h3(page, /Tacos Chawarma/).click();

  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Harissa", exact: true })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "✓ Fromage", exact: true })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "✓ Sauce fromagère", exact: true })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "✓ Tomate", exact: true })).toHaveCount(0);
  await expect(sheet.getByRole("button", { name: "Fromage +2" })).toBeVisible();
});

test("pain cheese: vegetables + plain mozza offered", async ({ page }) => {
  await ready(page);
  await h3(page, /^Pain Cheese$/).click();
  await h3(page, /Pain Cheese Crispy/).click();

  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("button", { name: "✓ Laitue", exact: true })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Fromage +4" })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Fromage +2" })).toHaveCount(0);
});

test("pizza: only œuf supplement, no sauces; ingredients removable", async ({ page }) => {
  await ready(page);
  await h3(page, /^Pizzas Rouges$/).click();
  await h3(page, /Pizza Orientale/).click();

  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("heading", { name: "Sauces" })).toHaveCount(0);
  await expect(sheet.getByRole("button", { name: "✓ merguez", exact: true })).toBeVisible();

  await sheet.getByRole("button", { name: "Œuf +1" }).click();
  await expect(addBtn(sheet)).toContainText("15 DT"); // Orientale 14 + œuf 1
  await addBtn(sheet).click();
  await expect(cartBar(page)).toContainText("15 DT");
});

test("pizza chèvre: removing miel shows 'Sans miel' in cart and message", async ({ page }) => {
  await ready(page);
  await h3(page, /^Pizzas Blanches$/).click();
  await h3(page, /Pizza Chèvre/).click();

  const sheet = customizeSheet(page);
  await expect(sheet).toBeVisible();
  await sheet.getByRole("button", { name: "✓ miel", exact: true }).click();
  await addBtn(sheet).click();

  await cartBar(page).click();
  const cart = cartSheet(page);
  await expect(cart.getByText(/Sans miel/)).toBeVisible();

  await toCheckout(page);
  const href = await cart.locator('a[href*="wa.me"]').getAttribute("href");
  expect(waMessage(href!)).toContain("🚫 Sans: miel");
});

// (message assertions above stay French — the kitchen message is always French)

test("drinks add directly, no customization sheet", async ({ page }) => {
  await ready(page);
  await h3(page, /^Boissons$/).click();
  await h3(page, /^Soda$/).click();

  await expect(page.getByText("Personnalisez", { exact: true })).toHaveCount(0);
  await expect(cartBar(page)).toContainText("2.5 DT");
});

test("cart: drinks upsell with note, phone, partner-delivery disclaimer", async ({ page }) => {
  await ready(page);
  await h3(page, /Merguez/).click();
  const sheet = customizeSheet(page);
  await sheet.getByRole("button", { name: "Harissa", exact: true }).click();
  await addBtn(sheet).click();
  await cartBar(page).click();

  const cart = cartSheet(page);
  // step 1: the drinks upsell + the no-Coca/Fanta warning
  await expect(cart.getByText(/boisson avec ça/i)).toBeVisible();
  await expect(cart.getByText(/Coca-Cola ni de Fanta/)).toBeVisible();

  // specify a drink, then add the Soda
  await cart.getByPlaceholder(/boisson/i).fill("Boga menthe");
  await cart.getByRole("button", { name: /Soda/ }).click();

  // step 2: contact + the partner-delivery disclaimer (delivery is default)
  await toCheckout(page);
  await expect(cart.getByText(/société de livraison/)).toBeVisible();
  await cart.getByPlaceholder(/téléphone/i).fill("26 123 456");

  const href = await cart.locator('a[href*="wa.me"]').getAttribute("href");
  const msg = waMessage(href!);
  expect(msg).toContain("Soda");
  expect(msg).toContain("📝 Note: Boga menthe");
  expect(msg).toContain("*Tél*: 26 123 456");
});

test("Coca/Fanta drink note is rejected", async ({ page }) => {
  await ready(page);
  await h3(page, /Merguez/).click();
  const sheet = customizeSheet(page);
  await sheet.getByRole("button", { name: "Harissa", exact: true }).click();
  await addBtn(sheet).click();
  await cartBar(page).click();

  const cart = cartSheet(page);
  await cart.getByPlaceholder(/boisson/i).fill("coca");
  await cart.getByRole("button", { name: /Soda/ }).click();
  await expect(cart.getByText(/ne vendons pas ces marques|لا نبيع/)).toBeVisible();
});

test("first visit auto-selects the browser's language", async ({ browser }) => {
  // an Arabic-preferring visitor lands in Arabic (RTL)
  const ar = await browser.newContext({ locale: "ar-TN" });
  const arPage = await ar.newPage();
  await arPage.goto("/");
  await arPage.locator("html[data-hydrated]").waitFor();
  await expect(arPage.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(arPage.locator("html")).toHaveAttribute("lang", "ar");
  await ar.close();

  // a French visitor stays in French (LTR)
  const fr = await browser.newContext({ locale: "fr-FR" });
  const frPage = await fr.newPage();
  await frPage.goto("/");
  await frPage.locator("html[data-hydrated]").waitFor();
  await expect(frPage.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(frPage.locator("html")).toHaveAttribute("lang", "fr");
  await fr.close();
});

test("a manual language choice overrides detection on return", async ({ browser }) => {
  // Arabic browser, but the visitor switched to French last time
  const ctx = await browser.newContext({ locale: "ar-TN" });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    localStorage.setItem("maripossa.v3", JSON.stringify({ lang: "fr", cart: {} }));
  });
  await page.goto("/");
  await page.locator("html[data-hydrated]").waitFor();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await ctx.close();
});

test("old saved carts (v2 format) still load", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "maripossa.v2",
      JSON.stringify({ cart: { "drinks-0": 2 }, lang: "fr", mode: "pickup", name: "", address: "" })
    );
  });
  await ready(page);
  await expect(cartBar(page)).toContainText("5 DT"); // 2 × Soda (2.5)
});
