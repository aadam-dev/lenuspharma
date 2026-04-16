"use client";

import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { BRANCHES_WITH_MAPS } from "@/lib/branches-with-maps";

type BranchWithMap = (typeof BRANCHES_WITH_MAPS)[number];

export function BranchLocator() {
  const [activeBranch, setActiveBranch] = useState<BranchWithMap>(BRANCHES_WITH_MAPS[0]);

    return (
        <section className="py-24 bg-secondary-50">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary-900 mb-4">Visit Our Branches</h2>
                    <p className="text-secondary-600 text-lg">
                        Conveniently located across Accra. Find the branch nearest to you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Branch List */}
                    <div className="space-y-4">
                        {BRANCHES_WITH_MAPS.map((branch) => (
                            <button
                                key={branch.id}
                                onClick={() => setActiveBranch(branch)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group ${activeBranch.id === branch.id
                                        ? "bg-primary border-primary text-white shadow-xl scale-[1.02]"
                                        : "bg-white border-secondary-200 hover:border-primary/50 hover:bg-primary/5"
                                    }`}
                            >
                                <h3 className={`text-xl font-bold mb-2 ${activeBranch.id === branch.id ? "text-white" : "text-secondary-900"}`}>
                                    {branch.name}
                                </h3>
                                <div className={`flex items-start gap-2 text-sm ${activeBranch.id === branch.id ? "text-primary-100" : "text-secondary-500"}`}>
                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                    {branch.address}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Map Display */}
                    <div className="lg:col-span-2">
                        <Card className="h-[500px] overflow-hidden border-0 shadow-2xl rounded-3xl bg-white relative">
                            <iframe
                                src={activeBranch.mapEmbed}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full"
                            />

                            {/* Floating Info Card on Map */}
                            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-secondary-200">
                                <h4 className="font-bold text-secondary-900 text-lg mb-4">{activeBranch.name}</h4>
                                <div className="space-y-3">
                                    <a href={`tel:${activeBranch.phone}`} className="flex items-center gap-3 text-secondary-600 hover:text-primary transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium">{activeBranch.phone}</span>
                                    </a>
                                    <div className="flex items-center gap-3 text-secondary-600">
                                        <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">GPS: {activeBranch.gps}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
