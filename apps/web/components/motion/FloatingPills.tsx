"use client";

import { cn } from "@/lib/utils";

/**
 * Decorative pharmacy iconography for hero / section backdrops.
 *
 * Animation lives on the wrapping div; SVGs themselves never re-render.
 * Static SVG markup is hoisted outside the component.
 * All shapes use a shared low-precision viewBox of 100x100.
 */

/* eslint-disable react/no-unknown-property */

const CAPSULE = (
  <svg viewBox="0 0 120 50" fill="none" className="h-full w-full drop-shadow-[0_10px_30px_rgba(15,118,110,0.22)]">
    <defs>
      <linearGradient id="capL" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5eead4" />
        <stop offset="100%" stopColor="#0d9488" />
      </linearGradient>
      <linearGradient id="capR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e6f3f1" />
      </linearGradient>
      <linearGradient id="capShine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="58" height="46" rx="23" fill="url(#capL)" />
    <rect x="60" y="2" width="58" height="46" rx="23" fill="url(#capR)" stroke="#cbd5e1" strokeWidth="0.8" />
    <line x1="60" y1="2" x2="60" y2="48" stroke="#0f766e" strokeOpacity="0.25" strokeWidth="0.8" />
    {/* Highlight strip */}
    <rect x="6" y="6" width="50" height="10" rx="5" fill="url(#capShine)" />
    <rect x="64" y="6" width="50" height="10" rx="5" fill="url(#capShine)" />
  </svg>
);

const TABLET = (
  <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_10px_24px_rgba(244,100,32,0.22)]">
    <defs>
      <radialGradient id="tabA" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#ffe6d9" />
        <stop offset="60%" stopColor="#ffc9ad" />
        <stop offset="100%" stopColor="#ff8047" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="46" fill="url(#tabA)" />
    <line x1="12" y1="50" x2="88" y2="50" stroke="#7a2c14" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="38" cy="34" rx="14" ry="6" fill="#ffffff" fillOpacity="0.55" />
  </svg>
);

const RX_SYMBOL = (
  <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_8px_24px_rgba(15,23,42,0.18)]">
    <defs>
      <linearGradient id="rxBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f766e" />
        <stop offset="100%" stopColor="#134e4a" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#rxBg)" />
    <text x="50" y="68" textAnchor="middle" fontSize="56" fontWeight="700" fill="#ffffff" fontFamily="Georgia, serif">
      ℞
    </text>
  </svg>
);

const MORTAR_PESTLE = (
  <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
    <defs>
      <linearGradient id="mpBowl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f1ece2" />
        <stop offset="100%" stopColor="#cbc1aa" />
      </linearGradient>
    </defs>
    {/* Pestle */}
    <rect x="62" y="14" width="8" height="44" rx="3" fill="#857964" transform="rotate(28 66 36)" />
    <circle cx="78" cy="22" r="7" fill="#665d4d" />
    {/* Bowl */}
    <path d="M14 55 L86 55 L78 84 Q50 92 22 84 Z" fill="url(#mpBowl)" stroke="#857964" strokeWidth="1.2" />
    <ellipse cx="50" cy="55" rx="36" ry="6" fill="#665d4d" fillOpacity="0.25" />
  </svg>
);

const MEDICAL_CROSS = (
  <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_8px_20px_rgba(244,100,32,0.28)]">
    <defs>
      <linearGradient id="crossG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffa57a" />
        <stop offset="100%" stopColor="#f96420" />
      </linearGradient>
    </defs>
    <path d="M40 8 H60 V40 H92 V60 H60 V92 H40 V60 H8 V40 H40 Z" fill="url(#crossG)" />
    <path d="M40 8 H60 V18 H40 Z" fill="#ffffff" fillOpacity="0.3" />
  </svg>
);

const PILL_BOTTLE = (
  <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
    <defs>
      <linearGradient id="bottleG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff5f0" />
        <stop offset="100%" stopColor="#ffc9ad" />
      </linearGradient>
    </defs>
    {/* Cap */}
    <rect x="28" y="10" width="44" height="14" rx="3" fill="#7a2c14" />
    <rect x="32" y="22" width="36" height="6" fill="#5a1f0e" />
    {/* Body */}
    <rect x="22" y="28" width="56" height="62" rx="8" fill="url(#bottleG)" stroke="#bd3a0e" strokeWidth="1" />
    {/* Label */}
    <rect x="28" y="44" width="44" height="34" rx="2" fill="#ffffff" />
    <line x1="34" y1="54" x2="66" y2="54" stroke="#bd3a0e" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="62" x2="58" y2="62" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="34" y1="68" x2="62" y2="68" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="34" y1="74" x2="52" y2="74" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BLISTER_PACK = (
  <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_10px_24px_rgba(15,118,110,0.22)]">
    <defs>
      <linearGradient id="foilG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <radialGradient id="bumpG" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ccfbf1" />
        <stop offset="100%" stopColor="#0d9488" />
      </radialGradient>
    </defs>
    <rect x="6" y="14" width="88" height="72" rx="6" fill="url(#foilG)" />
    {/* 8 bumps in 2x4 grid */}
    {[0, 1].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <ellipse
          key={`${row}-${col}`}
          cx={18 + col * 22}
          cy={32 + row * 36}
          rx="9"
          ry="11"
          fill="url(#bumpG)"
        />
      )),
    )}
    {/* Subtle highlights */}
    {[0, 1].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <ellipse
          key={`h-${row}-${col}`}
          cx={15 + col * 22}
          cy={28 + row * 36}
          rx="2.5"
          ry="3"
          fill="#ffffff"
          fillOpacity="0.6"
        />
      )),
    )}
  </svg>
);

const HEARTBEAT = (
  <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_8px_20px_rgba(244,63,94,0.25)]">
    <defs>
      <linearGradient id="hbG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
    </defs>
    <path
      d="M50 88 C 30 70 8 56 8 36 C 8 22 20 12 32 12 C 40 12 46 16 50 22 C 54 16 60 12 68 12 C 80 12 92 22 92 36 C 92 56 70 70 50 88 Z"
      fill="url(#hbG)"
    />
    <path
      d="M14 50 H30 L34 38 L42 60 L48 44 L54 54 L86 50"
      stroke="#ffffff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const DROP = (
  <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_8px_20px_rgba(20,184,166,0.3)]">
    <defs>
      <linearGradient id="drpG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a5f3fc" />
        <stop offset="100%" stopColor="#0e7490" />
      </linearGradient>
    </defs>
    <path d="M50 8 C 50 8 18 46 18 66 C 18 80 32 92 50 92 C 68 92 82 80 82 66 C 82 46 50 8 50 8 Z" fill="url(#drpG)" />
    <ellipse cx="38" cy="40" rx="8" ry="14" fill="#ffffff" fillOpacity="0.45" />
  </svg>
);

type Shape = "capsule" | "tablet" | "rx" | "mortar" | "cross" | "bottle" | "blister" | "heartbeat" | "drop";

const SHAPES: Record<Shape, React.ReactNode> = {
  capsule: CAPSULE,
  tablet: TABLET,
  rx: RX_SYMBOL,
  mortar: MORTAR_PESTLE,
  cross: MEDICAL_CROSS,
  bottle: PILL_BOTTLE,
  blister: BLISTER_PACK,
  heartbeat: HEARTBEAT,
  drop: DROP,
};

interface PillProps {
  shape: Shape;
  size: number;
  width?: number; // override width independently for capsule
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate?: number;
  delay?: number;
  duration?: number;
  opacity?: number;
}

function Pill({
  shape,
  size,
  width,
  top,
  left,
  right,
  bottom,
  rotate = 0,
  delay = 0,
  duration = 6,
  opacity = 1,
}: PillProps) {
  return (
    /* Outer div: positioning + float animation (translateY only) */
    <div
      aria-hidden
      className="pointer-events-none absolute animate-float"
      style={{
        top,
        left,
        right,
        bottom,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity,
      }}
    >
      {/* Inner div: rotation + sizing — isolated from animation so tilt is preserved */}
      <div
        style={{
          width: width ?? (shape === "capsule" ? size * 2.4 : size),
          height: size,
          transform: `rotate(${rotate}deg)`,
        }}
      >
        {SHAPES[shape]}
      </div>
    </div>
  );
}

/**
 * Pre-arranged set of pharmacy shapes for the hero. Hidden on small screens
 * to keep mobile clean and quick.
 */
export function FloatingPills() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      {/* Top-left zone */}
      <Pill shape="capsule" size={42} top="8%" left="4%" rotate={-22} delay={0} duration={7} />
      <Pill shape="rx" size={64} top="22%" left="9%" rotate={-8} delay={1.4} duration={8} />
      <Pill shape="blister" size={88} top="58%" left="3%" rotate={12} delay={0.8} duration={9} />
      <Pill shape="tablet" size={56} top="78%" left="14%" rotate={0} delay={2.2} duration={6.5} />

      {/* Top-right zone */}
      <Pill shape="bottle" size={92} top="6%" right="6%" rotate={-10} delay={0.5} duration={9} />
      <Pill shape="cross" size={50} top="32%" right="14%" rotate={12} delay={1.8} duration={6.5} />
      <Pill shape="capsule" size={36} top="48%" right="4%" rotate={20} delay={2.4} duration={7} />

      {/* Bottom-right zone */}
      <Pill shape="heartbeat" size={64} bottom="22%" right="8%" rotate={-6} delay={0.2} duration={7.5} />
      <Pill shape="drop" size={42} bottom="10%" right="22%" rotate={0} delay={1.2} duration={6} />

      {/* Bottom-left + extras */}
      <Pill shape="mortar" size={72} bottom="14%" left="8%" rotate={-4} delay={1} duration={8} opacity={0.92} />
      <Pill shape="tablet" size={32} bottom="44%" left="22%" rotate={0} delay={2.6} duration={6} opacity={0.8} />
    </div>
  );
}
