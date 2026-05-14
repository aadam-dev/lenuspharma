import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Soft animated gradient mesh used as a section backdrop.
 * Pure CSS, no JS, zero runtime cost. Respects prefers-reduced-motion via globals.
 */
export function AuroraBackground({
  children,
  className,
  intensity = "default",
}: {
  children?: ReactNode;
  className?: string;
  intensity?: "subtle" | "default" | "vivid";
}) {
  return (
    <div
      className={cn(
        "aurora-bg relative overflow-hidden",
        intensity === "subtle" && "[&::before]:opacity-40 [&::after]:opacity-40",
        intensity === "vivid" && "[&::before]:opacity-100 [&::after]:opacity-100",
        className,
      )}
    >
      {/* Subtle noise overlay for tactile depth */}
      <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay opacity-40" />
      {children}
    </div>
  );
}
