import Link from "next/link";
import { NEPP_REGISTRY_URL, getWhatsAppUrl } from "@/lib/constants";
import { MessageCircle, MapPin, Phone, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-2">
                <img
                  src="/lenus_logo_clean.png"
                  alt="Lenus Pharmacy Logo"
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </div>
              <span className="text-lg font-bold text-white">Lenus Pharmacy</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner in health. NEPP registered and committed to providing quality healthcare services across Accra.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>Lakeside, Botwe 3rd Gate & Madina,<br />Greater Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <a href="tel:0548325792" className="hover:text-primary transition-colors">
                  054 832 5792
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 shrink-0 text-primary" />
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/products" className="hover:text-white transition-colors">Browse Products</Link></li>
              <li><Link href="/branches" className="hover:text-white transition-colors">Our Branches</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><a href={getWhatsAppUrl()} className="hover:text-white transition-colors">Upload Prescription</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Staff portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Verification</h3>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-8 h-8 text-green-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-300 mb-2">
                    Officially registered on the National Electronic Pharmacy Platform (NEPP).
                  </p>
                  <a
                    href={NEPP_REGISTRY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:text-primary-300 hover:underline"
                  >
                    Verify Registration &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} Lenus Pharma Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

