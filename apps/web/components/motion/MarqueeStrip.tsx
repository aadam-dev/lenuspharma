import { ShieldCheck, CreditCard, MessageCircle, MapPin, Truck, Pill, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeItem {
  icon: ReactNode;
  label: string;
}

const ICON_PROPS = "h-4 w-4 shrink-0";

const ITEMS: MarqueeItem[] = [
  { icon: <ShieldCheck className={ICON_PROPS} />, label: "NEPP Registered Pharmacy" },
  { icon: <CreditCard className={ICON_PROPS} />, label: "Paystack Secured Payments" },
  { icon: <MessageCircle className={ICON_PROPS} />, label: "WhatsApp Prescriptions" },
  { icon: <MapPin className={ICON_PROPS} />, label: "3 Locations in Greater Accra" },
  { icon: <Truck className={ICON_PROPS} />, label: "Same-Day Delivery" },
  { icon: <Pill className={ICON_PROPS} />, label: "Pharmacist-Approved POMs" },
  { icon: <Clock className={ICON_PROPS} />, label: "Open 7 Days a Week" },
];

/**
 * Infinite horizontal marquee for trust signals.
 * Pure CSS animation (defined in tailwind config).
 * Pauses on hover and on prefers-reduced-motion (handled in globals.css).
 */
export function MarqueeStrip({ className }: { className?: string }) {
  // Duplicate items for seamless loop
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className={cn("relative overflow-hidden mask-fade-x py-6", className)}>
      <div className="flex w-max gap-12 animate-marquee hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-sm font-medium text-secondary-700 whitespace-nowrap"
          >
            <span className="text-primary">{item.icon}</span>
            {item.label}
            <span className="ml-12 h-1.5 w-1.5 rounded-full bg-primary/30" aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}
