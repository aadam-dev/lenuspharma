import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Stethoscope,
  Activity,
  Leaf,
  ShoppingBasket,
  Heart,
  Pill,
  Bandage,
  Stethoscope as StethoscopeIcon,
  SprayCan,
  ClipboardList,
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { BranchLocator } from "@/components/BranchLocator";
import { PharmacyGallery } from "@/components/PharmacyGallery";
import { HowItWorks } from "@/components/HowItWorks";
import { MarqueeStrip } from "@/components/motion/MarqueeStrip";
import { FloatingWhatsAppCTA } from "@/components/motion/FloatingWhatsAppCTA";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getWhatsAppUrl } from "@/lib/constants";

const FEATURES = [
  { icon: ShieldCheck, label: "NEPP Registered", sub: "Verified pharmacy", color: "text-primary bg-primary/10" },
  { icon: Truck, label: "Fast Delivery", sub: "Accra-wide", color: "text-coral-600 bg-coral-100" },
  { icon: Stethoscope, label: "Expert Care", sub: "Qualified staff", color: "text-secondary-700 bg-secondary-100" },
  { icon: Activity, label: "Rapid Diagnostics", sub: "Quick & accurate", color: "text-blue-600 bg-blue-100" },
  { icon: Leaf, label: "Organic Products", sub: "Natural solutions", color: "text-emerald-600 bg-emerald-100" },
  { icon: ShoppingBasket, label: "Mart", sub: "Daily essentials", color: "text-purple-600 bg-purple-100" },
];

const CATEGORIES = [
  { name: "Pain Relief", icon: Bandage, href: "/products?category=Pain%20Relief", tint: "from-coral-100" },
  { name: "Vitamins", icon: Pill, href: "/products?category=Vitamins", tint: "from-amber-100" },
  { name: "First Aid", icon: StethoscopeIcon, href: "/products?category=First%20Aid", tint: "from-rose-100" },
  { name: "Personal Care", icon: SprayCan, href: "/products?category=Personal%20Care", tint: "from-violet-100" },
  { name: "Heart & BP", icon: Heart, href: "/products?category=Heart%20%26%20BP", tint: "from-pink-100" },
];

export default function HomePage() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Trust marquee */}
      <section className="bg-white border-y border-secondary-200/60">
        <div className="container px-4 mx-auto">
          <MarqueeStrip />
        </div>
      </section>

      {/* Features Strip — refined */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 mx-auto">
          <RevealOnScroll className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tightest text-secondary-900 mb-3">
              Care that travels with you
            </h2>
            <p className="text-secondary-600">
              Six things we do every day, so you don&apos;t have to think twice.
            </p>
          </RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <RevealOnScroll key={f.label} delay={i * 0.06}>
                  <div className="group flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-secondary-100 bg-white hover:border-primary/30 hover:shadow-soft-lg transition-all duration-300">
                    <div
                      className={`h-12 w-12 rounded-xl ${f.color} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-secondary-900">{f.label}</h3>
                      <p className="text-xs text-secondary-500 mt-0.5">{f.sub}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works — new bento section */}
      <HowItWorks />

      {/* Categories — refined cards */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                  Shop by category
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tightest text-secondary-900">
                  What are you looking for today?
                </h2>
              </div>
              <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold">
                <Link href="/products" className="flex items-center gap-1">
                  View all products <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <RevealOnScroll key={cat.name} delay={i * 0.05}>
                  <Link
                    href={cat.href}
                    className={`group relative flex flex-col items-start justify-between min-h-[180px] p-6 rounded-3xl border border-secondary-100 bg-gradient-to-br ${cat.tint} via-white to-white overflow-hidden hover:shadow-card-lift hover:-translate-y-1 transition-all duration-500 ease-spring`}
                  >
                    <div className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <div className="relative z-10 mt-4 flex items-center justify-between w-full">
                      <h3 className="font-semibold text-secondary-900">{cat.name}</h3>
                      <ArrowRight className="h-4 w-4 text-secondary-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </RevealOnScroll>
              );
            })}

            {/* Prescription card — special treatment */}
            <RevealOnScroll delay={0.25}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-start justify-between min-h-[180px] p-6 rounded-3xl bg-secondary-900 text-white overflow-hidden hover:-translate-y-1 transition-all duration-500 ease-spring shadow-card-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent" />
                <div className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg">
                  <ClipboardList className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <div className="relative z-10 mt-4">
                  <h3 className="font-semibold">Prescription</h3>
                  <p className="text-xs text-white/70 mt-0.5">Order via WhatsApp</p>
                </div>
              </a>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <PharmacyGallery />

      <BranchLocator />

      {/* CTA Section — refined with aurora */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-secondary-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-coral-500/15 blur-3xl" />
        </div>
        <div className="container relative z-10 px-4 mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <RevealOnScroll>
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tightest leading-[1.05] mb-6">
                Ready to take care of <br className="hidden md:block" />
                <span className="text-gradient-brand animate-gradient-x bg-size-200">
                  what matters most?
                </span>
              </h2>
              <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
                Order online today, or chat with a pharmacist on WhatsApp for personalised advice.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-semibold rounded-full bg-white text-secondary-900 hover:bg-white/90 w-full sm:w-auto"
                >
                  <Link href="/products">Shop now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-semibold rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent w-full sm:w-auto backdrop-blur-sm"
                >
                  <a href={whatsappUrl}>Chat on WhatsApp</a>
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <FloatingWhatsAppCTA />
    </div>
  );
}
