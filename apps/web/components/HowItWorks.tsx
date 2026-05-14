import Link from "next/link";
import { Search, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const STEPS = [
  {
    n: "01",
    icon: Search,
    title: "Find what you need",
    body: "Browse 2,000+ products by category or search by name. Every item shows whether it's over-the-counter or prescription-only at a glance.",
    accent: "from-primary-100 to-primary-50",
    iconBg: "bg-primary text-white",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Pharmacist-verified",
    body: "Prescription items are reviewed by a Pharmacy Council of Ghana licensed pharmacist before we dispense. Always.",
    accent: "from-coral-100 to-coral-50",
    iconBg: "bg-coral-500 text-white",
  },
  {
    n: "03",
    icon: Truck,
    title: "Delivered today",
    body: "Same-day delivery anywhere in Greater Accra. Pay on Paystack, by mobile money, or cash on delivery. Your choice.",
    accent: "from-sand-200 to-sand-100",
    iconBg: "bg-secondary-900 text-white",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 bg-sand-50 overflow-hidden">
      {/* Soft section accent */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-white via-white/60 to-transparent" />

      <div className="container relative px-4 mx-auto">
        <RevealOnScroll className="max-w-2xl mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
            How it works
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tightest text-secondary-900 leading-[1.05]">
            From search to <span className="text-gradient-brand">doorstep</span>
            <br />
            in three simple steps.
          </h2>
        </RevealOnScroll>

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connecting dotted line on desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute top-20 left-[16.66%] right-[16.66%] h-px bg-[length:8px_1px] bg-gradient-to-r from-transparent via-secondary-300 to-transparent"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, hsl(215 16% 70%) 0 4px, transparent 4px 12px)",
            }}
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <RevealOnScroll key={step.n} delay={i * 0.1}>
                <article className="group relative h-full">
                  <div
                    className={`relative h-full rounded-3xl bg-gradient-to-br ${step.accent} p-8 md:p-10 border border-white/80 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-card-lift overflow-hidden`}
                  >
                    {/* Step number watermark */}
                    <div className="absolute -top-2 -right-2 text-[8rem] font-display font-bold leading-none text-white/40 select-none pointer-events-none">
                      {step.n}
                    </div>

                    <div
                      className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl ${step.iconBg} shadow-lg mb-6`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                    </div>

                    <h3 className="relative font-display text-2xl font-bold text-secondary-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="relative text-secondary-700 leading-relaxed">{step.body}</p>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={0.3} className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
          >
            Start browsing the catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
