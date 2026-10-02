import { expect, test, type Page } from "@playwright/test";

/**
 * The cart is dropped in two cases, both re-checked when the app hydrates:
 *  - after 10 minutes with no interaction (even if the tab stayed open), and
 *  - 2 minutes after the order is handed off to WhatsApp.
 * These drive the persisted-state contract StoreProvider reads on load.
 */

const MIN = 60 * 1000;
const cartBar = (page: Page) => page.getByRole("button", { name: /Voir la commande/ });

/** Seed a saved cart (2 × Soda) plus timing fields, then load. */
async function seed(page: Page, fields: Record<string, unknown>) {
  await page.addInitScript((extra) => {
    localStorage.setItem(
      "maripossa.v3",
      JSON.stringify({
        lang: "fr",
        cart: { "drinks-0": { itemId: "drinks-0", qty: 2 } },
        mode: "pickup",
        name: "",
        address: "",
        phone: "",
        ...extra,
      })
    );
  }, fields);
  await page.goto("/");
  await page.locator("html[data-hydrated]").waitFor();
}

test("cart idle more than 10 min is dropped on next load", async ({ page }) => {
  await seed(page, { lastActivityAt: Date.now() - 11 * MIN });
  await expect(cartBar(page)).toHaveCount(0);
});

test("cart active within 10 min survives", async ({ page }) => {
  await seed(page, { lastActivityAt: Date.now() - 2 * MIN });
  await expect(cartBar(page)).toContainText("5 DT"); // 2 × Soda (2.5)
});

test("cart is dropped more than 2 min after WhatsApp handoff", async ({ page }) => {
  await seed(page, { orderSentAt: Date.now() - 3 * MIN });
  await expect(cartBar(page)).toHaveCount(0);
});

test("cart survives within 2 min of WhatsApp handoff", async ({ page }) => {
  await seed(page, { orderSentAt: Date.now() - 30 * 1000 });
  await expect(cartBar(page)).toContainText("5 DT");
});
