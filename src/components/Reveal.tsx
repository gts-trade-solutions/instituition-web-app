"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "up" | "down" | "left" | "right" | "fade" | "scale" | "blur";

const EASE = [0.16, 1, 0.3, 1] as const;

function makeVariants(variant: Variant, y: number): Variants {
  const hiddenMap: Record<Variant, Record<string, number | string>> = {
    up: { opacity: 0, y },
    down: { opacity: 0, y: -y },
    left: { opacity: 0, x: -32 },
    right: { opacity: 0, x: 32 },
    fade: { opacity: 0 },
    scale: { opacity: 0, scale: 0.94 },
    blur: { opacity: 0, y: y / 2, filter: "blur(10px)" },
  };
  return {
    hidden: hiddenMap[variant],
    // Only the blur variant gets a filter. Setting filter: blur(0px) on every
    // variant left one on the element for good after the animation, and an
    // element with a filter is composited on the GPU, which drops subpixel
    // antialiasing — that made body text render noticeably soft everywhere
    // Reveal is used.
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      ...(variant === "blur" ? { filter: "blur(0px)" } : {}),
    },
  };
}

export function Reveal({
  children,
  delay = 0,
  y = 22,
  duration = 0.65,
  variant = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  variant?: Variant;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={makeVariants(variant, y)}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      transition={reduce ? { duration: 0 } : { duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container — children wrapped in <RevealItem> animate in sequence.
 */
export function RevealGroup({
  children,
  stagger = 0.1,
  className = "",
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  y = 22,
  variant = "up",
  duration = 0.6,
  className = "",
}: {
  children: ReactNode;
  y?: number;
  variant?: Variant;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={makeVariants(variant, y)}
      transition={{ duration, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
