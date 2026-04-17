"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  ShoppingCart,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Pill,
  ChevronRight,
} from "lucide-react";
import { getAdminToken, getAdminUser, clearAdminSession, type AdminUser } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Products & Stock", href: "/admin/products", icon: Package },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  staff: "Staff",
  pharmacist: "Pharmacist",
};

function Sidebar({
  user,
  pathname,
  onClose,
  onLogout,
}: {
  user: AdminUser | null;
  pathname: string;
  onClose?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <Pill className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-sm text-gray-900 tracking-tight">Lenus Admin</p>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            Staff Portal
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
          Management
        </p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3 w-3 text-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1 shrink-0">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="h-4 w-4 text-gray-400" />
          View Storefront
        </Link>

        {user && (
          <div className="mx-1 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400">
                  {ROLE_LABELS[user.role] ?? user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

  // Login page renders full-screen without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile, static on desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out",
          "lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        )}
      >
        <Sidebar
          user={user}
          pathname={pathname}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center gap-3 px-4 lg:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <Pill className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900">Lenus Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {!getAdminToken() && pathname !== "/admin/login" ? (
            <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
              <p className="text-muted-foreground">You are not signed in.</p>
              <Link
                href="/admin/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in to continue →
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
