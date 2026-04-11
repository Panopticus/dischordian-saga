import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ChevronLeft size={16} /> Back
        </Link>

        <h1 className="font-display text-2xl font-bold tracking-wider mb-2">TERMS OF SERVICE</h1>
        <p className="font-mono text-xs text-muted-foreground mb-8">Last updated: April 6, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 font-mono text-sm text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">1. Acceptance of Terms</h2>
            <p>By accessing or using The Dischordian Saga ("the Service"), operated by Panopticus ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">2. Description of Service</h2>
            <p>The Dischordian Saga is a transmedia interactive experience combining narrative gameplay, card collection, combat simulation, and community features. The Service is provided "as is" and may be updated, modified, or discontinued at any time.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">3. Account Registration</h2>
            <p>You must authenticate via Google OAuth to access the Service. You are responsible for maintaining the security of your account. You must be at least 13 years old (16 in the EU/UK) to use the Service.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">4. In-App Purchases</h2>
            <p>The Service offers optional purchases via Stripe. All purchases are final unless otherwise required by law. Virtual items have no real-world value and cannot be transferred, traded, or exchanged for currency. We reserve the right to modify pricing and availability of virtual items at any time.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">5. User Conduct</h2>
            <p>You agree not to: (a) exploit bugs or vulnerabilities; (b) use automated tools, bots, or scripts; (c) harass other users; (d) attempt to reverse-engineer the Service; (e) impersonate others; (f) distribute content that is illegal, harmful, or infringes on intellectual property.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">6. Intellectual Property</h2>
            <p>All content, artwork, music, lore, characters, and code within The Dischordian Saga are the exclusive property of Panopticus or its licensors. "The Dischordian Saga," "Loredex OS," "Malkia Ukweli & the Panopticon," and all character names are trademarks of Panopticus.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">7. Limitation of Liability</h2>
            <p>The Service is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">8. Termination</h2>
            <p>We may suspend or terminate your account at any time for violation of these terms. Upon termination, your right to use the Service ceases immediately. Virtual items and progress may be permanently lost upon termination.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">9. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of the Service after changes constitutes acceptance of the updated terms. We will make reasonable efforts to notify users of material changes.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">10. Contact</h2>
            <p>For questions about these terms, contact us at: support@dischordian-saga.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
