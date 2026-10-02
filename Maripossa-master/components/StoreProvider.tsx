"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { DEFAULT_CATEGORY, ITEMS_BY_ID } from "@/lib/menu";
import { VEGGIES, lineKey, supplementsTotal } from "@/lib/customize";
import { I18N } from "@/lib/i18n";
import type { CartEntry, CartLine, CartOptions, Lang, ServiceMode } from "@/lib/types";

interface State {
  lang: Lang;
  active: string;
  /** cart lines keyed by lineKey (itemId + choices) */
  cart: Record<string, CartEntry>;
  cartOpen: boolean;
  /** itemId currently being configured in the customize sheet, or null */
  customizing: string | null;
  mode: ServiceMode;
  name: string;
  address: string;
  phone: string;
  hydrated: boolean;
  /**
   * Epoch ms when the order was sent to WhatsApp, or null. The cart is dropped
   * SENT_TTL_MS after this.
   */
  orderSentAt: number | null;
  /** Epoch ms of the last user interaction; drives the idle-cart timeout. */
  lastActivityAt: number;
}

type Action =
  | { type: "HYDRATE"; payload: Partial<State> }
  | { type: "TOGGLE_LANG" }
  | { type: "SET_ACTIVE"; key: string }
  | { type: "ADD"; id: string }
  | { type: "ADD_CONFIGURED"; itemId: string; options: CartOptions; qty: number }
  | { type: "INC"; key: string }
  | { type: "DEC"; key: string }
  | { type: "DEC_ITEM"; itemId: string }
  | { type: "OPEN_CUSTOMIZE"; id: string }
  | { type: "CLOSE_CUSTOMIZE" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_MODE"; mode: ServiceMode }
  | { type: "SET_NAME"; value: string }
  | { type: "SET_ADDRESS"; value: string }
  | { type: "SET_PHONE"; value: string }
  | { type: "MARK_SENT" }
  | { type: "CLEAR_ORDER" }
  | { type: "BUMP_ACTIVITY" };

const initial: State = {
  lang: "fr",
  active: DEFAULT_CATEGORY,
  cart: {},
  cartOpen: false,
  customizing: null,
  mode: "delivery",
  name: "",
  address: "",
  phone: "",
  hydrated: false,
  orderSentAt: null,
  lastActivityAt: 0,
};

function decKey(cart: Record<string, CartEntry>, key: string): Record<string, CartEntry> {
  const entry = cart[key];
  if (!entry) return cart;
  const next = { ...cart };
  if (entry.qty <= 1) delete next[key];
  else next[key] = { ...entry, qty: entry.qty - 1 };
  return next;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };
    case "TOGGLE_LANG":
      return { ...state, lang: state.lang === "ar" ? "fr" : "ar" };
    case "SET_ACTIVE":
      return { ...state, active: action.key };
    case "ADD": {
      const prev = state.cart[action.id];
      if (prev) {
        return {
          ...state,
          cart: {
            ...state.cart,
            [action.id]: { ...prev, qty: prev.qty + 1 },
          },
        };
      }
      return {
        ...state,
        cart: {
          [action.id]: { itemId: action.id, qty: 1 },
          ...state.cart,
        },
      };
    }
    case "ADD_CONFIGURED": {
      const key = lineKey(action.itemId, action.options);
      const prev = state.cart[key];
      if (prev) {
        return {
          ...state,
          cart: {
            ...state.cart,
            [key]: { ...prev, qty: prev.qty + action.qty },
          },
          customizing: null,
        };
      }
      return {
        ...state,
        cart: {
          [key]: {
            itemId: action.itemId,
            qty: action.qty,
            options: action.options,
          },
          ...state.cart,
        },
        customizing: null,
      };
    }
    case "INC": {
      const entry = state.cart[action.key];
      if (!entry) return state;
      return {
        ...state,
        cart: { ...state.cart, [action.key]: { ...entry, qty: entry.qty + 1 } },
      };
    }
    case "DEC":
      return { ...state, cart: decKey(state.cart, action.key) };
    case "DEC_ITEM": {
      // remove one unit from the most recent line of this item
      const keys = Object.keys(state.cart).filter(
        (k) => state.cart[k].itemId === action.itemId
      );
      if (!keys.length) return state;
      return { ...state, cart: decKey(state.cart, keys[keys.length - 1]) };
    }
    case "OPEN_CUSTOMIZE":
      return { ...state, customizing: action.id };
    case "CLOSE_CUSTOMIZE":
      return { ...state, customizing: null };
    case "OPEN_CART":
      return { ...state, cartOpen: true };
    case "CLOSE_CART":
      return { ...state, cartOpen: false };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_NAME":
      return { ...state, name: action.value };
    case "SET_ADDRESS":
      return { ...state, address: action.value };
    case "SET_PHONE":
      return { ...state, phone: action.value };
    case "MARK_SENT":
      return { ...state, orderSentAt: Date.now() };
    case "CLEAR_ORDER":
      // idle timeout or the post-WhatsApp window elapsed — drop the cart, keep profile
      return { ...state, cart: {}, orderSentAt: null, cartOpen: false };
    case "BUMP_ACTIVITY":
      return { ...state, lastActivityAt: Date.now() };
    default:
      return state;
  }
}

interface Store {
  state: State;
  t: (typeof I18N)[Lang];
  lines: CartLine[];
  total: number;
  count: number;
  /** total quantity per item id, across all of its lines */
  qtyByItem: Record<string, number>;
  toggleLang: () => void;
  setActive: (key: string) => void;
  add: (id: string) => void;
  addConfigured: (itemId: string, options: CartOptions, qty: number) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  decItem: (itemId: string) => void;
  openCustomize: (id: string) => void;
  closeCustomize: () => void;
  openCart: () => void;
  closeCart: () => void;
  setMode: (mode: ServiceMode) => void;
  setName: (v: string) => void;
  setAddress: (v: string) => void;
  setPhone: (v: string) => void;
  /** Record that the order was just sent to WhatsApp (starts the abandon timer). */
  markSent: () => void;
}

const StoreContext = createContext<Store | null>(null);

const LS_KEY = "maripossa.v3";
const LS_KEY_V2 = "maripossa.v2";

/** Clear the cart after this much inactivity, even with the tab left open. */
const IDLE_TTL_MS = 10 * 60 * 1000;
/** Clear the cart this long after the order is handed off to WhatsApp. */
const SENT_TTL_MS = 2 * 60 * 1000;

const strArr = (x: unknown): string[] =>
  Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : [];

/**
 * Accept current options; convert the legacy shape where `veggies` listed
 * the KEPT vegetables into today's `removed` list.
 */
function normalizeOptions(raw: unknown): CartOptions | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  let removed = strArr(o.removed);
  if (!("removed" in o) && Array.isArray(o.veggies)) {
    const kept = strArr(o.veggies);
    removed = VEGGIES.filter((v) => !kept.includes(v.id)).map((v) => v.id);
  }
  const str = (x: unknown) => (typeof x === "string" ? x : "");
  return {
    sauces: strArr(o.sauces),
    removed,
    supplements: strArr(o.supplements),
    viandeNote: str(o.viandeNote),
    meatNote: str(o.meatNote),
    note: str(o.note),
  };
}

/**
 * First-visit language: French is the default (Zarzis widely uses French), and
 * we only switch to Arabic when the device's PRIMARY language is Arabic. We look
 * at the top preferred locale only — not the whole list — so a bilingual phone
 * (e.g. French primary + Arabic secondary, common in Tunisia) still opens in
 * French. Any other language also falls back to French. A saved choice wins.
 */
function detectLang(): Lang {
  if (typeof navigator === "undefined") return "fr";
  const primary = navigator.languages?.[0] ?? navigator.language ?? "";
  return primary.toLowerCase().startsWith("ar") ? "ar" : "fr";
}

/** Accept the v3 shape, and convert the old v2 `id -> qty` cart. */
function parseCart(raw: unknown): Record<string, CartEntry> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, CartEntry> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof val === "number" && val > 0) {
      out[key] = { itemId: key, qty: val };
    } else if (
      val &&
      typeof val === "object" &&
      typeof (val as CartEntry).itemId === "string" &&
      typeof (val as CartEntry).qty === "number" &&
      (val as CartEntry).qty > 0
    ) {
      const entry = val as CartEntry & { options?: unknown };
      out[key] = {
        itemId: entry.itemId,
        qty: entry.qty,
        options: entry.options ? normalizeOptions(entry.options) : undefined,
      };
    }
  }
  return out;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY) || localStorage.getItem(LS_KEY_V2);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        const now = Date.now();
        const sentAt = typeof saved.orderSentAt === "number" ? saved.orderSentAt : null;
        const activeAt = typeof saved.lastActivityAt === "number" ? saved.lastActivityAt : 0;
        // Drop a stale cart: idle too long, or the post-WhatsApp window elapsed.
        const expired =
          (sentAt !== null && now - sentAt >= SENT_TTL_MS) ||
          (activeAt > 0 && now - activeAt >= IDLE_TTL_MS);
        dispatch({
          type: "HYDRATE",
          payload: {
            // a previously saved choice wins; otherwise detect from the browser
            lang: saved.lang === "ar" || saved.lang === "fr" ? saved.lang : detectLang(),
            cart: expired ? {} : parseCart(saved.cart),
            orderSentAt: expired ? null : sentAt,
            lastActivityAt: now,
            mode: saved.mode === "pickup" ? "pickup" : "delivery",
            name: typeof saved.name === "string" ? saved.name : "",
            address: typeof saved.address === "string" ? saved.address : "",
            phone: typeof saved.phone === "string" ? saved.phone : "",
          },
        });
      } else {
        // first visit — pick the language from the visitor's browser
        dispatch({ type: "HYDRATE", payload: { lang: detectLang() } });
      }
    } catch {
      dispatch({ type: "HYDRATE", payload: { lang: detectLang() } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist relevant slices
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          lang: state.lang,
          cart: state.cart,
          mode: state.mode,
          name: state.name,
          address: state.address,
          phone: state.phone,
          orderSentAt: state.orderSentAt,
          lastActivityAt: state.lastActivityAt,
        })
      );
    } catch {
      /* ignore quota / private mode */
    }
  }, [
    state.lang,
    state.cart,
    state.mode,
    state.name,
    state.address,
    state.phone,
    state.orderSentAt,
    state.lastActivityAt,
    state.hydrated,
  ]);

  // reflect language on <html> for RTL + correct font
  useEffect(() => {
    const html = document.documentElement;
    html.lang = state.lang;
    html.dir = I18N[state.lang].dir;
  }, [state.lang]);

  // signal that the app is interactive (used by e2e tests to avoid racing hydration)
  useEffect(() => {
    if (state.hydrated) document.documentElement.dataset.hydrated = "1";
  }, [state.hydrated]);

  // Idle timeout: clear the cart after IDLE_TTL_MS with no interaction, even if
  // the tab is left open. Any activity (or coming back to the tab) restarts the
  // countdown; being away past the limit clears it on return.
  const lastActiveRef = useRef(Date.now());
  useEffect(() => {
    if (!state.hydrated) return;
    let timer: number;
    let lastPersist = Date.now();
    lastActiveRef.current = Date.now();

    const arm = () => {
      window.clearTimeout(timer);
      const remaining = lastActiveRef.current + IDLE_TTL_MS - Date.now();
      timer = window.setTimeout(() => dispatch({ type: "CLEAR_ORDER" }), Math.max(0, remaining));
    };
    const onActivity = () => {
      lastActiveRef.current = Date.now();
      arm();
      // persist activity time (throttled) so a reload after idle also clears
      if (Date.now() - lastPersist > 60_000) {
        lastPersist = Date.now();
        dispatch({ type: "BUMP_ACTIVITY" });
      }
    };
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastActiveRef.current >= IDLE_TTL_MS) dispatch({ type: "CLEAR_ORDER" });
      else onActivity();
    };

    const events = ["pointerdown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);
    arm();

    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [state.hydrated]);

  // After the order is handed off to WhatsApp, clear the cart SENT_TTL_MS later
  // (even with the tab still open) so the next visit starts fresh.
  useEffect(() => {
    if (!state.hydrated || state.orderSentAt === null) return;
    const deadline = state.orderSentAt + SENT_TTL_MS;
    const timer = window.setTimeout(
      () => dispatch({ type: "CLEAR_ORDER" }),
      Math.max(0, deadline - Date.now())
    );
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() >= deadline) {
        dispatch({ type: "CLEAR_ORDER" });
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [state.hydrated, state.orderSentAt]);

  // lock body scroll when a sheet (cart or customize) is open
  useEffect(() => {
    document.body.style.overflow = state.cartOpen || state.customizing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.cartOpen, state.customizing]);

  const derived = useMemo(() => {
    const drinkLines: CartLine[] = [];
    const foodLines: CartLine[] = [];
    const qtyByItem: Record<string, number> = {};
    let total = 0;
    let count = 0;
    for (const [key, entry] of Object.entries(state.cart)) {
      const item = ITEMS_BY_ID[entry.itemId];
      if (!item) continue;
      const unit = item.price + supplementsTotal(entry.options);
      total += unit * entry.qty;
      count += entry.qty;
      qtyByItem[entry.itemId] = (qtyByItem[entry.itemId] || 0) + entry.qty;
      const line = {
        key,
        itemId: entry.itemId,
        name: item.name,
        nameAr: item.nameAr,
        price: unit,
        qty: entry.qty,
        options: entry.options,
      };
      if (entry.itemId.startsWith("drinks-")) {
        drinkLines.push(line);
      } else {
        foodLines.push(line);
      }
    }
    const lines = [...drinkLines, ...foodLines];
    return { lines, total, count, qtyByItem };
  }, [state.cart]);

  const value: Store = {
    state,
    t: I18N[state.lang],
    lines: derived.lines,
    total: derived.total,
    count: derived.count,
    qtyByItem: derived.qtyByItem,
    toggleLang: () => dispatch({ type: "TOGGLE_LANG" }),
    setActive: (key) => dispatch({ type: "SET_ACTIVE", key }),
    add: (id) => dispatch({ type: "ADD", id }),
    addConfigured: (itemId, options, qty) =>
      dispatch({ type: "ADD_CONFIGURED", itemId, options, qty }),
    inc: (key) => dispatch({ type: "INC", key }),
    dec: (key) => dispatch({ type: "DEC", key }),
    decItem: (itemId) => dispatch({ type: "DEC_ITEM", itemId }),
    openCustomize: (id) => dispatch({ type: "OPEN_CUSTOMIZE", id }),
    closeCustomize: () => dispatch({ type: "CLOSE_CUSTOMIZE" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    setMode: (mode) => dispatch({ type: "SET_MODE", mode }),
    setName: (v) => dispatch({ type: "SET_NAME", value: v }),
    setAddress: (v) => dispatch({ type: "SET_ADDRESS", value: v }),
    setPhone: (v) => dispatch({ type: "SET_PHONE", value: v }),
    markSent: () => dispatch({ type: "MARK_SENT" }),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
