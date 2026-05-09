"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * A wrapper that gently pulls its child toward the cursor on hover.
 * Disabled on touch devices (no hover capability).
 * Uses transform on a ref directly — no React state, no re-renders.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.25,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("inline-block", className)}
    >
      <div
        ref={ref}
        className="transition-transform duration-300 ease-out will-change-transform [@media(hover:none)]:!transform-none"
      >
        {children}
      </div>
    </div>
  );
}
