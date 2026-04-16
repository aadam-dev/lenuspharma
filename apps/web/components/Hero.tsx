"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Pill } from "lucide-react";

export function Hero() {
    const whatsappUrl =
        "https://wa.me/233548325792?text=Hi%2C%20I'd%20like%20to%20order%20prescription%20items%20from%20Lenus%20Pharmacy.";

    return (
        <section className="relative overflow-hidden bg-secondary-900 pt-24 pb-32 lg:pt-40 lg:pb-48">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2938&auto=format&fit=crop')] 
          bg-cover bg-center opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/80 to-secondary-900/40" />
            </div>

            {/* Floating Elements (Decorative) */}
            <div className="absolute top-20 right-10 animate-pulse opacity-10 hidden lg:block">
                <div className="h-32 w-32 rounded-full border-4 border-primary blur-xl" />
            </div>
            <div className="absolute bottom-20 left-10 animate-bounce opacity-10 hidden lg:block" style={{ animationDuration: "3s" }}>
                <div className="h-24 w-24 rounded-full bg-accent blur-xl" />
            </div>

            <div className="container relative z-10 px-4 mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-200 text-sm font-medium mb-8 animate-fade-in-up backdrop-blur-sm shadow-lg">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    Trusted by thousands in Accra
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 animate-fade-in-up [animation-delay:200ms] leading-tight">
                    Modern Pharmacy, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                        Old-fashioned Care.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-12 animate-fade-in-up [animation-delay:400ms] leading-relaxed">
                    Experience the convenience of online ordering with the safety of a licensed pharmacy.
                    We deliver genuine medicines to your doorstep across Greater Accra.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
                    <Button asChild size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary-600 shadow-xl shadow-primary/20 w-full sm:w-auto">
                        <Link href="/products" className="flex items-center gap-2">
                            Order Medicines <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Upload Prescription
                        </a>
                    </Button>
                </div>

                {/* Trust Indicators / Stats */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10 animate-fade-in-up [animation-delay:800ms]">
                    {[
                        { label: "Products", value: "2000+" },
                        { label: "Pharmacists", value: "Expert" },
                        { label: "Delivery", value: "Fast" },
                        { label: "Branches", value: "3 Locations" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
