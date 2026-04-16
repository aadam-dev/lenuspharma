import Link from "next/link";
import Image from "next/image";
import { NEPP_REGISTRY_URL, getWhatsAppUrl } from "@/lib/constants";
import { ShieldCheck, MapPin, MessageCircle, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-secondary-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          About Lenus Pharmacy
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Your trusted partner in health across Greater Accra.
        </p>

        {/* Who we are */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">Who we are</h2>
          <p className="text-muted-foreground leading-relaxed">
            Lenus Pharma Ltd operates three branches in Greater Accra: Botwe 3rd Gate,
            Lakeside Estates, and Madina. We provide over-the-counter medicines,
            health products, and prescription dispensing with pharmacist oversight.
            We are registered on Ghana&apos;s National Electronic Pharmacy Platform (NEPP)
            and comply with Pharmacy Council of Ghana and Data Protection Act 843.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">Our mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To make quality medicines and healthcare advice accessible to our
            community—whether you order online for delivery, pick up at a branch,
            or need prescription items via WhatsApp. We combine convenience with
            regulatory compliance and pharmacist-led care.
          </p>
        </section>

        {/* NEPP & compliance */}
        <section className="mb-10 p-6 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-10 w-10 text-primary shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                NEPP registered
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                We are listed on the National Electronic Pharmacy Platform. You can
                verify our registration on the official NEPP registry.
              </p>
              <a
                href={NEPP_REGISTRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                Verify on NEPP registry →
              </a>
            </div>
          </div>
        </section>

        {/* Our branches summary */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">Our branches</h2>
          <p className="text-muted-foreground text-sm mb-4">
            We have three locations in Greater Accra. Visit us or pick up your order.
          </p>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              Botwe 3rd Gate, Ashaley Botwe
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              Lakeside Estates
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              Madina, Greater Accra
            </li>
          </ul>
          <Link
            href="/branches"
            className="inline-block mt-3 text-sm font-medium text-primary hover:underline"
          >
            View full branch details →
          </Link>
        </section>

        {/* Facility placeholder */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">Our facilities</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Photos and short videos of our branches can be added here. Placeholders shown below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
              <Image
                src="https://placehold.co/600x400/e2e8f0/64748b?text=Lenus+Pharmacy"
                alt="Placeholder: Lenus Pharmacy facility"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
              <Image
                src="https://placehold.co/600x400/e2e8f0/64748b?text=Our+Team"
                alt="Placeholder: Our team"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 rounded-xl bg-muted/50 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-3">Contact us</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href="tel:0548325792" className="hover:text-primary transition-colors">
                054 832 5792
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary shrink-0" />
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Chat on WhatsApp (prescription orders)
              </a>
            </li>
          </ul>
          <Link href="/branches" className="inline-block mt-3 text-sm font-medium text-primary hover:underline">
            All branch addresses →
          </Link>
        </section>
      </div>
    </div>
  );
}
