/**
 * Meta (Facebook) Pixel helpers. The base pixel is injected once by
 * <MetaPixel /> (see components/MetaPixel.tsx); these thin wrappers fire the
 * standard events and no-op safely when the pixel is absent — missing id,
 * blocked by an ad-blocker, or during server rendering.
 */

/** Pixel id, inlined into the client bundle at build time. */
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fire a standard Meta Pixel event; silently ignored if fbq isn't loaded. */
export function track(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

/** The visitor is viewing the menu. */
export function viewContent(params?: Record<string, unknown>): void {
  track("ViewContent", params);
}

/** The visitor tapped a phone number or WhatsApp link (a contact intent). */
export function contact(params?: Record<string, unknown>): void {
  track("Contact", params);
}
