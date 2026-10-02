"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./StoreProvider";
import { formatPrice } from "@/lib/i18n";

export function CartBar() {
  const { state, t, count, total, openCart } = useStore();
  const show = count > 0 && !state.cartOpen;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))", paddingTop: 12 }}
        >
          <button
            onClick={openCart}
            className="flex w-full max-w-[460px] items-center gap-3 rounded-[18px] bg-ember px-5 py-[15px] text-white shadow-[0_16px_36px_-8px_rgba(228,85,42,.65)] transition-transform active:scale-[.99]"
          >
            <motion.span
              key={count}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="flex h-[28px] min-w-[28px] items-center justify-center rounded-[10px] bg-white px-1.5 text-[13px] font-extrabold text-ember"
            >
              {count}
            </motion.span>
            <span className="text-[14.5px] font-bold">{t.viewCart}</span>
            <span className="ms-auto font-display text-[17px] font-semibold">
              {formatPrice(total, state.lang)}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
