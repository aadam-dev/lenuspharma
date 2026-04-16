import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Lenus Pharmacy",
  description: "Privacy policy for Lenus Pharma Ltd — data protection and your rights under Ghana Data Protection Act 843.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-secondary-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-slate max-w-none text-muted-foreground text-sm space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Who we are</h2>
            <p>
              Lenus Pharma Ltd (&quot;we&quot;, &quot;us&quot;, &quot;Lenus Pharmacy&quot;) operates this website and
              e-pharmacy services. We are registered on the National Electronic Pharmacy Platform (NEPP)
              and process personal and health data in line with Ghana&apos;s Data Protection Act, 2012 (Act 843).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Data we collect</h2>
            <p>
              When you place an order or contact us, we may collect: name, phone number, email (optional),
              delivery address (including GhanaPostGPS), and health-related information necessary for
              dispensing (e.g. prescription details when you order via WhatsApp). We do not require you
              to create an account to place an order; we collect only what is needed for the transaction
              and for compliance (e.g. pharmacist oversight for prescription medicines).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. How we use your data</h2>
            <p>
              We use your data to process orders, arrange delivery or pickup, communicate with you about
              your order, and to meet legal and regulatory obligations (including NEPP and Pharmacy
              Council requirements). We will not use your health data for marketing without your
              explicit consent. At checkout you are asked to consent to having your health and personal
              data processed for dispensing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Data storage and security</h2>
            <p>
              We store data on secure servers and use appropriate technical and organisational
              measures. Where we use third-party providers (e.g. cloud hosting), we ensure they meet
              data protection standards. Data may be retained as required by law (e.g. for pharmacy
              records and NEPP compliance).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Your rights (Act 843)</h2>
            <p>
              Under Ghana&apos;s Data Protection Act 843, you have rights including: access to your
              personal data, correction of inaccuracies, and in certain circumstances objection or
              request for deletion. To exercise these rights or ask questions about our use of your
              data, contact us using the details on our website (e.g. phone, WhatsApp).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Changes</h2>
            <p>
              We may update this privacy policy from time to time. The &quot;Last updated&quot; date at the top
              will be revised when we do. Continued use of our services after changes constitutes
              acceptance of the updated policy where permitted by law.
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
