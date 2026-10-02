/** Contact + brand constants. Edit these to update the whole site. */

export const PHONE_INTL = "21624640332"; // for wa.me / tel, no "+"
export const PHONE_LOCAL = "24 640 332";

export const LINKS = {
  whatsapp: `https://wa.me/${PHONE_INTL}`,
  facebook: "https://www.facebook.com/maripossaPizza.zarzis",
  instagram: "https://www.instagram.com/maripossa_pizza",
  maps: "https://maps.google.com/?q=Maripossa+Pizzeria+Zarzis",
  tel: `tel:+${PHONE_INTL}`,
} as const;

export const HOURS = "10:00 – 05:00";
export const CITY = "Zarzis";
export const ADDRESS_LINE = "À côté d'Attijari Bank · Zarzis, Tunisie";

/** Logo path under /public. Drop the file there as logo.png */
export const LOGO = "/logo.png";

/** Items whose name matches get a "Popular" badge */
export const POPULAR_RE = /pepperoni|maripossa|mixte pollo|crispy|marguerita|chawarma/i;
