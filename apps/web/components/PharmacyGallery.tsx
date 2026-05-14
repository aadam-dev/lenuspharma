import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

export function PharmacyGallery() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Community and Culture
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tightest text-secondary-900 mb-6">
              More than a pharmacy.
            </h2>
            <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
              At Lenus Pharmacy, we are a dedicated team of healthcare professionals
              committed to your well-being. We actively engage with our community through
              health talks, screenings, and personalised care.
            </p>

            <div className="flex gap-4">
              <Button asChild className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white gap-2">
                <a
                  href="https://www.facebook.com/people/Lenus-Pharma-Ltd/100068662585171/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-4 h-4" />
                  Follow on Facebook
                </a>
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <Instagram className="w-4 h-4 text-pink-600" />
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <Twitter className="w-4 h-4 text-sky-500" />
              </Button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary-100">
                  <Image
                    src="https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=2000&auto=format&fit=crop"
                    alt="Pharmacist helping patient"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary-100">
                  <Image
                    src="https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=2000&auto=format&fit=crop"
                    alt="Pharmacy shelf"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary-100">
                  <Image
                    src="https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=2000&auto=format&fit=crop"
                    alt="Medical consultation"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary-100">
                  <Image
                    src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2000&auto=format&fit=crop"
                    alt="Modern pharmacy interior"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
