import { expect, test, type Page } from "@playwright/test";

/**
 * Language rules:
 *  - The site always opens in French by default.
 *  - It switches to Arabic only when the device's PRIMARY language is Arabic.
 *  - Any other language (incl. a bilingual phone with Arabic as a secondary
 *    preference) stays French.
 *  - The header toggle flips FR <-> AR, flips text direction, and the choice
 *    persists (a saved choice always wins over detection).
 */

/** Override the browser's reported languages before the page loads. */
async function withLanguages(page: Page, languages: string[]) {
  await page.addInitScript((langs) => {
    Object.defineProperty(navigator, "languages", { get: () => langs, configurable: true });
    Object.defineProperty(navigator, "language", { get: () => langs[0], configurable: true });
  }, languages);
}

async function open(page: Page) {
  await page.goto("/");
  await page.locator("html[data-hydrated]").waitFor();
}

const html = (page: Page) => page.locator("html");
const toggle = (page: Page) => page.getByRole("button", { name: "Switch language" });

test.describe("first-visit detection", () => {
  test("French phone -> French / LTR", async ({ page }) => {
    await withLanguages(page, ["fr-FR"]);
    await open(page);
    await expect(html(page)).toHaveAttribute("lang", "fr");
    await expect(html(page)).toHaveAttribute("dir", "ltr");
  });

  test("Arabic phone -> Arabic / RTL", async ({ page }) => {
    await withLanguages(page, ["ar-TN"]);
    await open(page);
    await expect(html(page)).toHaveAttribute("lang", "ar");
    await expect(html(page)).toHaveAttribute("dir", "rtl");
  });

  test("English phone -> French (fallback)", async ({ page }) => {
    await withLanguages(page, ["en-US"]);
    await open(page);
    await expect(html(page)).toHaveAttribute("lang", "fr");
  });

  test("bilingual French-primary + Arabic-secondary -> French", async ({ page }) => {
    await withLanguages(page, ["fr-FR", "ar-TN"]);
    await open(page);
    await expect(html(page)).toHaveAttribute("lang", "fr");
  });

  test("bilingual Arabic-primary + French-secondary -> Arabic", async ({ page }) => {
    await withLanguages(page, ["ar-TN", "fr-FR"]);
    await open(page);
    await expect(html(page)).toHaveAttribute("lang", "ar");
  });
});

test("toggle flips FR<->AR, flips direction, and persists across reload", async ({ page }) => {
  await withLanguages(page, ["fr-FR"]);
  await open(page);

  // starts French / LTR, and offers Arabic
  await expect(html(page)).toHaveAttribute("lang", "fr");
  await expect(html(page)).toHaveAttribute("dir", "ltr");
  await expect(toggle(page)).toHaveText("عربية");

  // -> Arabic / RTL, now offers French
  await toggle(page).click();
  await expect(html(page)).toHaveAttribute("lang", "ar");
  await expect(html(page)).toHaveAttribute("dir", "rtl");
  await expect(toggle(page)).toHaveText("Français");

  // saved choice wins over detection after a reload
  await page.reload();
  await page.locator("html[data-hydrated]").waitFor();
  await expect(html(page)).toHaveAttribute("lang", "ar");

  // -> back to French / LTR
  await toggle(page).click();
  await expect(html(page)).toHaveAttribute("lang", "fr");
  await expect(html(page)).toHaveAttribute("dir", "ltr");
});
