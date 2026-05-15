"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

/**
 * Fades + slides children in once when they scroll into view.
 * Single shared variants object so framer doesn't allocate per-render.
 */
const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function RevealOnScroll({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealOnScrollProps) {
  const Component = motion[as] as typeof motion.div;
  const customVariants = y === 24 ? variants : {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={customVariants}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
