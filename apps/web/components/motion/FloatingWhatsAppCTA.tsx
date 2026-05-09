"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Floating WhatsApp button — appears after the user has scrolled
 * past the hero. Mobile-friendly tap target (56px), pulse ring for affordance.
 * No layout shift: position: fixed.
 */
export function FloatingWhatsAppCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Lenus Pharmacy on WhatsApp"
      className={cn(
        "fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-lift transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
      )}
    >
      <span className="pulse-ring absolute inset-0 rounded-full text-[#25D366]" aria-hidden />
      <MessageCircle className="relative h-6 w-6" strokeWidth={2.4} />
      <span className="sr-only">Open WhatsApp chat</span>
    </a>
  );
}
