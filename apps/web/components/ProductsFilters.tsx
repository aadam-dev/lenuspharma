"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Search } from "lucide-react";

// Must match categories in apps/api/prisma/seed.ts for API filter to work
const CATEGORIES = [
  "All",
  "Pain & Fever",
  "Vitamins & Supplements",
  "Digestive & Rehydration",
  "Cough, Cold & Allergy",
  "First Aid",
  "Personal Care & Hygiene",
  "Skin Care",
  "Antibiotics",
  "Antimalarials",
  "Cardiovascular",
  "Diabetes",
  "Respiratory",
  "Digestive",
];

export function ProductsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const qParam = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(qParam);

  const setCategory = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "All") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [query, router, searchParams]
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive =
            (cat === "All" && !categoryParam) || categoryParam === cat;
          return (
            <Button
              key={cat}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

