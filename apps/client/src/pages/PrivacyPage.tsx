import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ChevronLeft size={16} /> Back
        </Link>

        <h1 className="font-display text-2xl font-bold tracking-wider mb-2">PRIVACY POLICY</h1>
        <p className="font-mono text-xs text-muted-foreground mb-8">Last updated: April 6, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 font-mono text-sm text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">1. Information We Collect</h2>
            <h3 className="font-display text-sm font-bold text-foreground/90">Account Data (via Google OAuth)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Google account ID (unique identifier)</li>
              <li>Display name</li>
              <li>Email address</li>
            </ul>
            <h3 className="font-display text-sm font-bold text-foreground/90 mt-3">Game Data</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Game progress, character data, inventory, and achievements</li>
              <li>In-game choices and narrative decisions</li>
              <li>Purchase history (processed by Stripe — we do not store payment card details)</li>
            </ul>
            <h3 className="font-display text-sm font-bold text-foreground/90 mt-3">Technical Data</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Browser type, device type, screen resolution</li>
              <li>IP address (for rate limiting and security)</li>
              <li>Session cookies (for authentication)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Authenticate your identity and maintain your session</li>
              <li>Save and sync your game progress</li>
              <li>Process purchases via Stripe</li>
              <li>Prevent abuse, fraud, and cheating</li>
              <li>Improve the Service based on aggregate usage patterns</li>
            </ul>
            <p className="mt-2">We do <strong>not</strong> sell your personal data. We do <strong>not</strong> serve targeted advertising.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">3. Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Google OAuth</strong> — Authentication. Subject to <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener">Google's Privacy Policy</a>.</li>
              <li><strong>Stripe</strong> — Payment processing. Subject to <a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener">Stripe's Privacy Policy</a>. We never see or store your card number.</li>
              <li><strong>OpenAI / LLM Provider</strong> — AI-powered NPC dialog (Elara). Your chat messages are sent to the LLM API for response generation. No personal data beyond the conversation text is shared.</li>
              <li><strong>Railway</strong> — Infrastructure hosting. Subject to <a href="https://railway.app/legal/privacy" className="text-primary hover:underline" target="_blank" rel="noopener">Railway's Privacy Policy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">4. Cookies</h2>
            <p>We use a single session cookie for authentication. No tracking cookies, no analytics cookies, no advertising cookies. The cookie is:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Name:</strong> loredex_session</li>
              <li><strong>Purpose:</strong> Maintains your login session</li>
              <li><strong>Duration:</strong> 1 year</li>
              <li><strong>Type:</strong> HttpOnly, Secure, SameSite=Lax</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">5. Data Retention</h2>
            <p>Account and game data is retained for as long as your account is active. If you request deletion, we will remove your data within 30 days. Anonymized, aggregate data may be retained indefinitely for analytics.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">6. Your Rights</h2>
            <p>Depending on your jurisdiction (GDPR, CCPA, etc.), you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Object to or restrict certain processing</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at: privacy@dischordian-saga.com</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">7. Children's Privacy</h2>
            <p>The Service is not intended for children under 13 (or 16 in the EU/UK). We do not knowingly collect data from children. If you believe a child has provided us data, contact us immediately.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">8. Security</h2>
            <p>We implement industry-standard security measures including HTTPS encryption, secure cookie handling, CSRF protection, rate limiting, and parameterized database queries. However, no system is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">9. Changes to This Policy</h2>
            <p>We may update this policy at any time. Material changes will be communicated via the Service. Continued use constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground tracking-wider">10. Contact</h2>
            <p>Data Controller: Panopticus<br />Email: privacy@dischordian-saga.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
