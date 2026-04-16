import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link href="/admin/orders" className="font-semibold text-primary">
            Lenus Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/orders" className="hover:underline">
              Orders
            </Link>
            <Link href="/admin/products" className="hover:underline">
              Stock
            </Link>
            <Link href="/admin/reports" className="hover:underline">
              Reports
            </Link>
            <Link href="/admin/login" className="text-muted-foreground hover:underline">
              Login
            </Link>
            <Link href="/" className="text-muted-foreground hover:underline">
              Storefront
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-8 px-4">{children}</main>
    </div>
  );
}
