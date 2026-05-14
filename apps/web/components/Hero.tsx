"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { FloatingPills } from "@/components/motion/FloatingPills";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { getWhatsAppUrl } from "@/lib/constants";

const STATS = [
  { value: 2000, suffix: "+", label: "Products in stock", decimals: 0 },
  { value: 3, suffix: "", label: "Branches in Accra", decimals: 0 },
  { value: 98, suffix: "%", label: "On-time delivery", decimals: 0 },
  { value: 7, suffix: "/7", label: "Pharmacist support", decimals: 0 },
];

export function Hero() {
  return (
    <AuroraBackground className="relative pt-20 pb-24 md:pt-28 md:pb-36 lg:pt-32 lg:pb-44">
      <FloatingPills />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/60 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-700 shadow-sm mb-7">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <Sparkles className="h-3.5 w-3.5" />
            Modern pharmacy care for Greater Accra
          </div>

          {/* Display heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tightest text-secondary-900 leading-[1.02] mb-6">
            Your pharmacy,
            <br />
            <span className="text-gradient-brand animate-gradient-x bg-size-200">
              reimagined.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-secondary-600 leading-relaxed mb-10">
            Genuine medicines, qualified pharmacists, and same-day delivery.
            One calm, careful experience built for how Ghana actually shops.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <MagneticButton>
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold rounded-full bg-primary hover:bg-primary-700 shadow-glow transition-all"
              >
                <Link href="/products" className="flex items-center gap-2">
                  Shop medicines
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </MagneticButton>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base font-semibold rounded-full border-secondary-300 bg-white/70 backdrop-blur-sm hover:bg-white text-secondary-900"
            >
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Upload prescription
              </a>
            </Button>
          </div>

          {/* Trust line */}
          <div className="inline-flex items-center gap-2 text-xs text-secondary-500 mb-16">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            NEPP Registered &middot; Pharmacy Council of Ghana approved
          </div>
        </div>

        {/* Animated stats card */}
        <div className="mx-auto mt-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-2 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md px-6 py-8 md:px-10 md:py-10 shadow-soft-lg">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center ${i > 0 ? "md:border-l md:border-secondary-200/60" : ""}`}
              >
                <div className="text-3xl md:text-4xl font-bold text-secondary-900 tabular-nums tracking-tight">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <div className="mt-1 text-xs md:text-sm font-medium text-secondary-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
