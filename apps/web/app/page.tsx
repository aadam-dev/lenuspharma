import Link from "next/link";
import { getBranches } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, Truck, Stethoscope } from "lucide-react";
import { Hero } from "@/components/Hero";
import { BranchLocator } from "@/components/BranchLocator";
import { PharmacyGallery } from "@/components/PharmacyGallery";

export default async function HomePage() {
  const whatsappUrl =
    "https://wa.me/233548325792?text=Hi%2C%20I'd%20like%20to%20order%20prescription%20items%20from%20Lenus%20Pharmacy.";

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Features Strip */}
      <section className="py-12 bg-white border-b">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-secondary-50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base">NEPP Registered</h3>
                <p className="text-muted-foreground text-xs">Verified Pharmacy</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-secondary-50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Fast Delivery</h3>
                <p className="text-muted-foreground text-xs">Accra-wide delivery</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-secondary-50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Expert Care</h3>
                <p className="text-muted-foreground text-xs">Qualified Staff</p>
              </div>
            </div>
            {/* New Services */}
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-secondary-50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-base">Rapid Diagnostics</h3>
                <p className="text-muted-foreground text-xs">Quick & Accurate</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-secondary-50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-base">Organic Products</h3>
                <p className="text-muted-foreground text-xs">Natural Solutions</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-secondary-50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-basket"><path d="m5 11 4-7" /><path d="m19 11-4-7" /><path d="M2 11h20" /><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 0.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4" /><path d="m9 11 1 9" /><path d="m4.5 11 .1 8.1" /><path d="m19.4 11-.1 8.1" /><path d="m15 11-1 9" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-base">Mart</h3>
                <p className="text-muted-foreground text-xs">Daily Essentials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary-50/50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-secondary-900">Shop by Category</h2>
              <p className="mt-2 text-secondary-600">Find exactly what you need for your health and wellness.</p>
            </div>
            <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold">
              <Link href="/products" className="flex items-center gap-1">
                View all products <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: "Pain Relief", icon: "🩹", href: "/products?category=Pain%20Relief" },
              { name: "Vitamins", icon: "💊", href: "/products?category=Vitamins" },
              { name: "First Aid", icon: "🩺", href: "/products?category=First%20Aid" },
              { name: "Personal Care", icon: "🧴", href: "/products?category=Personal%20Care" },
              { name: "Prescription", icon: "📋", href: whatsappUrl, external: true, desc: "Order via WhatsApp" }
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                target={cat.external ? "_blank" : undefined}
                className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <h3 className="font-semibold text-secondary-900">{cat.name}</h3>
                {cat.desc && <p className="text-xs text-primary mt-1 font-medium">{cat.desc}</p>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PharmacyGallery />

      <BranchLocator />

      {/* CTA Section */}
      <section className="py-24 bg-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="container px-4 mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to prioritize your health?</h2>
          <p className="text-primary-200 text-lg max-w-xl mx-auto mb-10">
            Order your medicines online today or chat with our pharmacists for personalized advice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg bg-white text-primary-900 hover:bg-white/90 w-full sm:w-auto">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-primary-400 text-white hover:bg-primary-800 hover:text-white bg-transparent w-full sm:w-auto">
              <a href={whatsappUrl}>Chat on WhatsApp</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
