"use client";

import { cn } from "@/lib/utils";

/**
 * Decorative floating pill capsules for hero/section backgrounds.
 * Each pill is wrapped in a div that handles the float animation —
 * the SVG itself never re-renders (rendering-animate-svg-wrapper).
 *
 * Static SVG markup is hoisted outside the component (rendering-hoist-jsx).
 */

const PILL_CAPSULE = (
  <svg
    viewBox="0 0 100 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full drop-shadow-[0_8px_24px_rgba(15,118,110,0.18)]"
  >
    <defs>
      <linearGradient id="pillA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5eead4" />
        <stop offset="100%" stopColor="#0d9488" />
      </linearGradient>
      <linearGradient id="pillB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f1ece2" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="48" height="36" rx="18" fill="url(#pillA)" />
    <rect x="50" y="2" width="48" height="36" rx="18" fill="url(#pillB)" />
    <line x1="50" y1="2" x2="50" y2="38" stroke="#0f766e" strokeOpacity="0.15" strokeWidth="0.5" />
  </svg>
);

const TABLET_ROUND = (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_8px_24px_rgba(244,100,32,0.18)]">
    <defs>
      <radialGradient id="tabletA" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffe6d9" />
        <stop offset="100%" stopColor="#ffa57a" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="46" fill="url(#tabletA)" />
    <line x1="10" y1="50" x2="90" y2="50" stroke="#bd3a0e" strokeOpacity="0.2" strokeWidth="1" />
  </svg>
);

const MOLECULE = (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full opacity-60">
    <circle cx="50" cy="20" r="6" fill="#0d9488" />
    <circle cx="20" cy="65" r="6" fill="#0d9488" />
    <circle cx="80" cy="65" r="6" fill="#0d9488" />
    <circle cx="50" cy="85" r="4" fill="#5eead4" />
    <line x1="50" y1="20" x2="20" y2="65" stroke="#0d9488" strokeWidth="1.5" />
    <line x1="50" y1="20" x2="80" y2="65" stroke="#0d9488" strokeWidth="1.5" />
    <line x1="20" y1="65" x2="80" y2="65" stroke="#0d9488" strokeWidth="1.5" />
    <line x1="50" y1="85" x2="20" y2="65" stroke="#5eead4" strokeWidth="1" />
  </svg>
);

type PillShape = "capsule" | "tablet" | "molecule";

interface PillProps {
  shape?: PillShape;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

function Pill({
  shape = "capsule",
  size = 80,
  top,
  left,
  right,
  bottom,
  rotate = 0,
  delay = 0,
  duration = 6,
  className,
}: PillProps) {
  const svg = shape === "capsule" ? PILL_CAPSULE : shape === "tablet" ? TABLET_ROUND : MOLECULE;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute animate-float", className)}
      style={{
        width: size,
        height: shape === "capsule" ? size * 0.4 : size,
        top,
        left,
        right,
        bottom,
        transform: `rotate(${rotate}deg)`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {svg}
    </div>
  );
}

/**
 * Pre-arranged set of floating pills for the hero section.
 * Hidden on small screens to keep mobile clean.
 */
export function FloatingPills() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      <Pill shape="capsule" size={120} top="12%" left="6%" rotate={-18} delay={0} duration={7} />
      <Pill shape="tablet" size={70} top="22%" right="10%" rotate={0} delay={1.2} duration={6} />
      <Pill shape="capsule" size={90} bottom="20%" left="10%" rotate={28} delay={2} duration={8} />
      <Pill shape="molecule" size={110} top="55%" right="6%" rotate={0} delay={0.6} duration={9} />
      <Pill shape="capsule" size={70} bottom="14%" right="22%" rotate={-8} delay={1.6} duration={7.5} />
    </div>
  );
}
