import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Lenus Pharmacy",
  description: "Terms of service for Lenus Pharma Ltd e-pharmacy website and orders.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-secondary-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-slate max-w-none text-muted-foreground text-sm space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Agreement</h2>
            <p>
              By using this website and placing orders with Lenus Pharma Ltd (&quot;Lenus Pharmacy&quot;, &quot;we&quot;, &quot;us&quot;),
              you agree to these Terms of Service. If you do not agree, please do not use our site or services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Services</h2>
            <p>
              We operate an e-pharmacy registered on Ghana&apos;s National Electronic Pharmacy Platform (NEPP).
              We sell over-the-counter (OTC) medicines and health products online, and offer prescription
              (POM) medicines through our WhatsApp-based process with pharmacist oversight. Delivery and
              pickup are available in Greater Accra. We reserve the right to refuse or cancel orders where
              necessary for safety or compliance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Orders and payment</h2>
            <p>
              Orders are subject to product availability. You provide accurate contact and delivery
              information (including GhanaPostGPS where required). Payment is collected via our
              payment partner (e.g. Paystack) in accordance with their terms. Prices are in Ghana
              Cedis (GH₵). We may cancel or refund orders in line with our policy and applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Prescription medicines (POM)</h2>
            <p>
              Prescription-only medicines are dispensed only with valid prescription and pharmacist
              approval. When you order POM via WhatsApp, you agree to provide accurate information
              and that dispensing is subject to our pharmacist&apos;s professional judgment. We comply
              with NEPP and Pharmacy Council of Ghana requirements for e-pharmacy operations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Privacy and data</h2>
            <p>
              Your use of our services is also governed by our{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              We process personal and health data in accordance with Ghana&apos;s Data Protection Act 843
              and only as necessary for orders, dispensing, and compliance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Limitation of liability</h2>
            <p>
              To the extent permitted by law, we are not liable for indirect, incidental, or
              consequential damages arising from use of our website or services. Our liability for
              any claim related to an order is limited to the amount you paid for that order. We do
              not exclude liability for death or personal injury caused by our negligence or for
              fraud.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Changes</h2>
            <p>
              We may update these terms. The &quot;Last updated&quot; date will be revised accordingly. Your
              continued use of our services after changes constitutes acceptance where permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact</h2>
            <p>
              For questions about these terms, contact us via the phone or WhatsApp details on our
              website.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
