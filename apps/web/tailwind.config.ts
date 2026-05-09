import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontFeatureSettings: {
        tnum: "'tnum'",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Warm accent — coral/peach, used sparingly for highlights and "human" warmth
        coral: {
          50: "#fff5f0",
          100: "#ffe6d9",
          200: "#ffc9ad",
          300: "#ffa57a",
          400: "#ff8047",
          500: "#f96420",
          600: "#e44d10",
          700: "#bd3a0e",
          800: "#963113",
          900: "#7a2c14",
        },
        // Warm neutral palette for sections — replaces cold slate where appropriate
        sand: {
          50: "#fdfcfa",
          100: "#faf7f2",
          200: "#f1ece2",
          300: "#e3dccd",
          400: "#cbc1aa",
          500: "#a89c80",
          600: "#857964",
          700: "#665d4d",
          800: "#4a4438",
          900: "#2f2c25",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Aurora-style gradient blob drift
        aurora: {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "33%": { transform: "translate(8%, -6%) scale(1.08)" },
          "66%": { transform: "translate(-6%, 8%) scale(0.95)" },
        },
        // Slow float for decorative pills
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--tw-rotate, 0deg))" },
          "50%": { transform: "translateY(-14px) rotate(var(--tw-rotate, 0deg))" },
        },
        // Shimmer sweep across gradient
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Infinite marquee
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // Subtle pulse ring (for trust badges and floating CTA)
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        // Gradient flow for animated text
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.7s ease-out",
        aurora: "aurora 18s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        marquee: "marquee 32s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradient-x 8s ease infinite",
      },
      minHeight: {
        touch: "44px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover":
          "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
        "card-lift":
          "0 30px 60px -15px rgb(15 118 110 / 0.18), 0 12px 24px -10px rgb(15 23 42 / 0.08)",
        glow: "0 0 0 1px rgb(20 184 166 / 0.12), 0 8px 32px -8px rgb(20 184 166 / 0.35)",
        "soft-lg":
          "0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -6px rgb(15 23 42 / 0.06)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 40%, #f0fdfa 100%)",
        "aurora-mesh":
          "radial-gradient(at 20% 20%, hsl(175 84% 90% / 0.9) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(160 84% 88% / 0.7) 0px, transparent 50%), radial-gradient(at 0% 80%, hsl(40 60% 92% / 0.8) 0px, transparent 50%), radial-gradient(at 80% 80%, hsl(200 50% 92% / 0.7) 0px, transparent 50%)",
        "shimmer-gradient":
          "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
