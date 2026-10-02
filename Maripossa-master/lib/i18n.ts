import type { Lang, Review } from "./types";

export interface Dict {
  dir: "ltr" | "rtl";
  langBtn: string;
  navMenu: string;
  navReviews: string;
  navContact: string;
  footerExplore: string;
  footerContact: string;
  footerFollow: string;
  footerRights: string;
  developedBy: string;
  tagline: string;
  heroTitle: string;
  heroSub: string;
  seeMenu: string;
  orderNow: string;
  openLabel: string;
  deliveryLabel: string;
  deliveryPickup: string;
  locLabel: string;
  menuKicker: string;
  menuTitle: string;
  included: string;
  popular: string;
  reviewKicker: string;
  reviewTitle: string;
  contactKicker: string;
  contactTitle: string;
  waTitle: string;
  hoursTitle: string;
  hoursVal: string;
  callTitle: string;
  findUs: string;
  viewCart: string;
  yourOrder: string;
  empty: string;
  delivery: string;
  deliveryDesc: string;
  pickup: string;
  pickupDesc: string;
  namePh: string;
  addrPh: string;
  total: string;
  sendWa: string;
  waNote: string;
  currency: string;
  customizeTitle: string;
  saucesLabel: string;
  veggiesLabel: string;
  veggiesHint: string;
  suppLabel: string;
  noteLabel: string;
  notePh: string;
  addToCart: string;
  nextBtn: string;
  backBtn: string;
  unitLabel: string;
  standardLabel: string;
  sauceRequired: string;
  meatsLabel: string;
  meatsPh: string;
  meatsRequired: string;
  viandePh: string;
  viandeRequired: string;
  drinksTitle: string;
  drinksWarn: string;
  drinksNotePh: string;
  phonePh: string;
  deliveryDisclaimer: string;
  deliveryPartner: string;
  noDeliveryFee: string;
  locValLine1: string;
  locValLine2: string;
}

export const I18N: Record<Lang, Dict> = {
  fr: {
    dir: "ltr",
    langBtn: "عربية",
    navMenu: "Le Menu",
    navReviews: "Avis",
    navContact: "Contact",
    footerExplore: "Navigation",
    footerContact: "Contact",
    footerFollow: "Suivez-nous",
    footerRights: "Tous droits réservés.",
    developedBy: "Développé par",
    tagline: "Des tranches qui donnent des ailes",
    heroTitle: "Pizzas & Fast-Food à Zarzis",
    heroSub:
      "Pâte fraîche, fromage fondant, ingrédients généreux. Commandez en quelques clics.",
    seeMenu: "Voir le menu",
    orderNow: "Nous contacter",
    openLabel: "Ouvert",
    deliveryLabel: "Service",
    deliveryPickup: "Livraison",
    locLabel: "Adresse",
    locValLine1: "À côté d'Attijari",
    locValLine2: "Bank",
    menuKicker: "Notre carte",
    menuTitle: "Le Menu",
    included: "Inclus :",
    popular: "Populaire",
    reviewKicker: "Avis clients",
    reviewTitle: "Ils adorent Maripossa",
    contactKicker: "Nous trouver",
    contactTitle: "Comment nous contacter",
    waTitle: "Contacter sur WhatsApp",
    hoursTitle: "Horaires",
    hoursVal: "Tous les jours\n10h00 → 05h00",
    callTitle: "Téléphone",
    findUs: "Voir sur la carte",
    viewCart: "Voir la commande",
    yourOrder: "Votre commande",
    empty: "Votre panier est vide.",
    delivery: "Livraison",
    deliveryDesc: "Livré chez vous",
    pickup: "Retrait",
    pickupDesc: "Je passe récupérer",
    namePh: "Votre nom",
    addrPh: "Adresse de livraison",
    total: "Total",
    sendWa: "Envoyer sur WhatsApp",
    waNote: "Votre commande sera préparée comme message WhatsApp.",
    currency: "DT",
    customizeTitle: "Personnalisez",
    saucesLabel: "Sauces",
    veggiesLabel: "Ingrédients",
    veggiesHint: "Inclus — touchez pour retirer",
    suppLabel: "Suppléments",
    noteLabel: "Note",
    notePh: "Ex : bien cuit, sans piment…",
    addToCart: "Ajouter",
    nextBtn: "Suivant",
    backBtn: "Retour",
    unitLabel: "Article",
    standardLabel: "Standard",
    sauceRequired: "Choisissez au moins une sauce (ou « Sans sauce »)",
    meatsLabel: "Viandes",
    meatsPh: "Ex : merguez + escalope",
    meatsRequired: "Précisez les viandes de cet article",
    viandePh: "Quelle viande ? (ex : merguez)",
    viandeRequired: "Précisez la viande du supplément",
    drinksTitle: "Une boisson avec ça ?",
    drinksWarn: "Nous ne vendons pas de Coca-Cola ni de Fanta.",
    drinksNotePh: "Précisez votre boisson (ex : Boga menthe…)",
    phonePh: "Votre numéro de téléphone",
    deliveryDisclaimer:
      "Maripossa n'a pas de service de livraison propre : votre commande est confiée à une société de livraison disponible.",
    deliveryPartner: "via sociétés de livraison",
    noDeliveryFee: "Hors frais de livraison",
  },
  ar: {
    dir: "rtl",
    langBtn: "Français",
    navMenu: "القائمة",
    navReviews: "الآراء",
    navContact: "اتصل بنا",
    footerExplore: "تصفّح",
    footerContact: "اتصل بنا",
    footerFollow: "تابعنا",
    footerRights: "كل الحقوق محفوظة.",
    developedBy: "تطوير",
    tagline: "شرائح تمنحك أجنحة",
    heroTitle: "بيتزا و وجبات سريعة بجرجيس",
    heroSub: "عجين طازج، جبن ذائب، مكونات سخية. اطلب بنقرات.",
    seeMenu: "القائمة",
    orderNow: "اتصل بنا",
    openLabel: "مفتوح",
    deliveryLabel: "الخدمة",
    deliveryPickup: "توصيل",
    locLabel: "العنوان",
    locValLine1: "بجانب التجاري",
    locValLine2: "بنك",
    menuKicker: "قائمتنا",
    menuTitle: "القائمة",
    included: "مشمول:",
    popular: "الأكثر طلباً",
    reviewKicker: "آراء الزبائن",
    reviewTitle: "يحبّون ماريبوسا",
    contactKicker: "موقعنا",
    contactTitle: "كيف تتواصل معنا",
    waTitle: "تواصل معنا عبر واتساب",
    hoursTitle: "التوقيت",
    hoursVal: "كل يوم\n10:00 → 05:00",
    callTitle: "الهاتف",
    findUs: "شاهد على الخريطة",
    viewCart: "عرض الطلب",
    yourOrder: "طلبك",
    empty: "سلتك فارغة.",
    delivery: "توصيل",
    deliveryDesc: "يصلك إلى باب المنزل",
    pickup: "استلام",
    pickupDesc: "سآتي لاستلامه بنفسي",
    namePh: "اسمك",
    addrPh: "عنوان التوصيل",
    total: "المجموع",
    sendWa: "إرسال عبر واتساب",
    waNote: "سيُحضَّر طلبك كرسالة واتساب.",
    currency: "DT",
    customizeTitle: "خصّص طلبك",
    saucesLabel: "الصلصات",
    veggiesLabel: "المكونات",
    veggiesHint: "مشمولة — اضغط للإزالة",
    suppLabel: "إضافات",
    noteLabel: "ملاحظة",
    notePh: "مثال: طهي جيّد، بدون حار…",
    addToCart: "أضف",
    nextBtn: "التالي",
    backBtn: "رجوع",
    unitLabel: "قطعة",
    standardLabel: "عادي",
    sauceRequired: "اختر صلصة واحدة على الأقل (أو «بدون صلصة»)",
    meatsLabel: "اللحوم",
    meatsPh: "مثال: مرقاز + إسكالوب",
    meatsRequired: "حدّد لحوم هذه القطعة",
    viandePh: "أي لحم؟ (مثال: مرقاز)",
    viandeRequired: "حدّد لحم الإضافة",
    drinksTitle: "مشروب مع طلبك؟",
    drinksWarn: "لا نبيع كوكا كولا أو فانتا.",
    drinksNotePh: "حدّد مشروبك (مثال: بوغا نعناع…)",
    phonePh: "رقم هاتفك",
    deliveryDisclaimer:
      "ماريبوسا لا تملك خدمة توصيل خاصة: نرسل طلبك عبر شركة توصيل متوفرة.",
    deliveryPartner: "عبر شركات التوصيل",
    noDeliveryFee: "غير شامل رسوم التوصيل",
  },
};

export const REVIEWS: Record<Lang, Review[]> = {
  fr: [
    {
      text: "La meilleure pizza de Zarzis, le fromage file et les portions sont généreuses !",
      who: "Amine B.",
    },
    {
      text: "Les tacos et les bowls sont excellents, service rapide et personnel adorable.",
      who: "Sirine M.",
    },
    {
      text: "La pizza Maripossa au saumon… une tuerie ! Je recommande à 100%.",
      who: "Hamza T.",
    },
  ],
  ar: [
    { text: "أحسن بيتزا في جرجيس، الجبن يسيح والطعم خيالي!", who: "أمين ب." },
    { text: "التاكوس و البول رائعين، خدمة سريعة و عمال محترمين.", who: "سيرين م." },
    { text: "بيتزا ماريبوسا بالسومون… تحفة! نوصي بيها.", who: "حمزة ت." },
  ],
};

/** Format a price using the active language's currency label. */
export function formatPrice(n: number, lang: Lang): string {
  const v = Number.isInteger(n) ? String(n) : n.toFixed(1);
  return `${v} ${I18N[lang].currency}`;
}
