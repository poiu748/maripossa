import { PHONE_INTL } from "./constants";
import { detailGroups } from "./customize";
import { formatPrice } from "./i18n";
import type { CartLine, ServiceMode } from "./types";

export interface OrderInfo {
  lines: CartLine[];
  total: number;
  mode: ServiceMode;
  name: string;
  address: string;
  phone: string;
}

/** WhatsApp renders *bold* — used to structure the order message. */
const B = (s: string) => `*${s}*`;
const RULE = "━━━━━━━━━━━━━━";

/* The order message always goes to the kitchen in French. */
const L = {
  title: "MARIPOSSA — NOUVELLE COMMANDE",
  note: "📝 Note",
  service: "Service",
  delivery: "Livraison",
  pickup: "Retrait",
  deliveryHint: "(via société de livraison)",
  name: "Nom",
  phone: "Tél",
  address: "Adresse",
  total: "TOTAL",
};

/**
 * Build a wa.me deep link with a clear, worker-friendly order message.
 * The message is ALWAYS in French (the kitchen reads French), regardless of
 * the customer's site language. Customer free text (name, address, notes) is
 * kept verbatim. Structure: numbered bold items with per-line prices, each
 * customization on its own labeled line, then the customer block + bold total.
 */
export function buildWhatsAppHref({
  lines,
  total,
  mode,
  name,
  address,
  phone,
}: OrderInfo): string {
  const out: string[] = [`🦋 ${B(L.title)} 🦋`, RULE];

  lines.forEach((l, i) => {
    const head = `${i + 1}. ${l.name}`;
    out.push(`${B(head)}  ×${l.qty}  —  ${formatPrice(l.price * l.qty, "fr")}`);
    for (const g of detailGroups(l.itemId, l.options, "fr")) {
      out.push(`     ${g.label}: ${g.values.join(", ")}`);
    }
    const note = l.options?.note.trim();
    if (note) out.push(`     ${L.note}: ${note}`);
    out.push("");
  });

  out.push(RULE);

  const modeEmoji = mode === "delivery" ? "🛵" : "🏪";
  const modeTxt = mode === "delivery" ? L.delivery : L.pickup;
  out.push(`${modeEmoji} ${B(L.service)}: ${modeTxt}`);
  if (mode === "delivery") out.push(`     ${L.deliveryHint}`);
  if (name.trim()) out.push(`👤 ${B(L.name)}: ${name.trim()}`);
  if (phone.trim()) out.push(`📞 ${B(L.phone)}: ${phone.trim()}`);
  if (mode === "delivery" && address.trim()) {
    out.push(`📍 ${B(L.address)}: ${address.trim()}`);
  }

  const totalLine = `${L.total}: ${formatPrice(total, "fr")}`;
  out.push(RULE, `💰 ${B(totalLine)}`);

  return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(out.join("\n"))}`;
}
