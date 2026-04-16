import Link from "next/link";
import { getBranches } from "@/lib/api";
import { BranchCard } from "@/components/BranchCard";
import { BranchLocator } from "@/components/BranchLocator";
import { BRANCHES_WITH_MAPS } from "@/lib/branches-with-maps";
import { MapPin, ArrowRight } from "lucide-react";

export default async function BranchesPage() {
  let branches: Awaited<ReturnType<typeof getBranches>> = [];
  try {
    branches = await getBranches();
  } catch {
    branches = [];
  }

  return (
    <div className="min-h-screen bg-secondary-50/50">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Compact header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Our branches
          </h1>
          <p className="mt-1 text-muted-foreground">
            Find us at any of our three locations in Greater Accra. Visit in person or pick up your order.
          </p>
        </div>

        {/* Branch cards — 3-col grid */}
        <section className="mb-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.length > 0 ? (
              branches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))
            ) : (
              <>
                <BranchCard branch={{
                  id: "1",
                  name: "Lenus Pharmacy — Botwe 3rd Gate",
                  slug: "botwe-3rd-gate",
                  address: "Ashaley Botwe, 3rd Gate, Greater Accra",
                  phone: "054 832 5792",
                  ghanaPostGps: "GA-110-2345",
                  createdAt: "",
                }} />
                <BranchCard branch={{
                  id: "2",
                  name: "Lenus Pharmacy — Lakeside Estates",
                  slug: "lakeside-estates",
                  address: "Lakeside Estates, Greater Accra",
                  phone: "054 832 5793",
                  ghanaPostGps: "GA-120-5678",
                  createdAt: "",
                }} />
                <BranchCard branch={{
                  id: "3",
                  name: "Lenus Pharmacy — Madina",
                  slug: "madina",
                  address: "Madina, Greater Accra",
                  phone: "054 832 5794",
                  ghanaPostGps: "GA-130-7890",
                  createdAt: "",
                }} />
              </>
            )}
          </div>
        </section>

        {/* Real map locations — same as homepage */}
        <section className="mb-12">
          <BranchLocator />
        </section>

        {/* Our facilities — polished media cards (replace gradient with real photos when ready) */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-2">Our facilities</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            A glimpse of our branches. Drop in your own photos in <code className="text-xs bg-muted px-1.5 py-0.5 rounded">public/facilities/</code> when ready — same aspect ratio (16:10) keeps layout consistent.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRANCHES_WITH_MAPS.map((branch, i) => (
              <div
                key={branch.id}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-muted shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient + pattern (replace with <Image> when you have photos) */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                  }}
                  aria-hidden
                />
                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
                      <MapPin className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-white/80">
                      Branch {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white drop-shadow-sm">
                      {branch.shortLabel}
                    </h3>
                    <p className="text-sm text-white/90 mt-0.5">{branch.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Lenus Pharmacy ${branch.shortLabel} ${branch.address}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-white hover:text-white/90 transition-colors"
                    >
                      Get directions
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
