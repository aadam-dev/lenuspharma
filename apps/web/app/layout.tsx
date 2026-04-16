import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { CartProvider } from "@/components/CartProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lenus Pharmacy | Order Online — Botwe & Lakeside Estates",
  description:
    "Lenus Pharma Ltd. Order OTC medicines online. Prescription? Chat on WhatsApp. Pick up at Botwe 3rd Gate or Lakeside Estates. NEPP registered.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen flex flex-col bg-secondary-50 font-sans antialiased">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppCTA />
        </body>
      </html>
    </CartProvider>
  );
}
