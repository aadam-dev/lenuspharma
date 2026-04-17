"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export function Header() {
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar — trust & contact */}
      <div className="bg-primary-900 text-white py-2 text-xs font-medium">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline opacity-90">NEPP Registered Pharmacy</span>
            <a href="tel:0548325792" className="hover:text-primary-200 transition-colors flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              054 832 5792
            </a>
          </div>
          <a
            href="https://wa.me/233548325792"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-200 transition-colors flex items-center gap-1.5"
          >
            <MessageCircle className="w-3 h-3" />
            Upload Prescription via WhatsApp
          </a>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-border/50 shadow-sm"
            : "bg-white border-transparent"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/lenus_logo_clean.png"
                alt="Lenus Pharmacy Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Lenus<span className="text-primary">Pharmacy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: "Branches", href: "/branches" },
              { label: "About", href: "/about" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Branches", href: "/branches" },
                { label: "About", href: "/about" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-4 py-3 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

