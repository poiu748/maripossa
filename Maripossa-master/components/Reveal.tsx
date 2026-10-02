"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  /** delay in seconds */
  delay?: number;
  /** vertical offset to animate from */
  y?: number;
}

/**
 * Lightweight scroll-reveal wrapper. Fades + lifts content into view once.
 * Honors prefers-reduced-motion automatically via Framer Motion.
 */
export function Reveal({ children, delay = 0, y = 16, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
