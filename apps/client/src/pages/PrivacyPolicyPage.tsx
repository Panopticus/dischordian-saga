/**
 * Privacy Policy — placeholder scaffold.
 *
 * Operator must replace the body with the legally-reviewed text.
 * The version string at the top must match
 * `CURRENT_AGREEMENT_VERSIONS.privacy_policy` in
 * `apps/server/routers/account.ts` so acceptance tracking aligns.
 *
 * The structure here is the standard EU/UK/US starting set:
 * who we are, what we collect, lawful basis, retention, third
 * parties, your rights, contact. Fill in the details with your
 * legal counsel before launch.
 */
export default function PrivacyPolicyPage() {
  return (
    <article style={{ maxWidth: 720, margin: "0 auto", padding: 24, lineHeight: 1.5 }}>
      <h1>Privacy Policy</h1>
      <p>
        <strong>Version 2026-05-05</strong> · Last updated 2026-05-05
      </p>

      <h2>Who we are</h2>
      <p>
        Loredex OS / Dischordian Saga is operated by Panopticon (the
        "Operator"). Replace this paragraph with the registered
        company name, address, and DPO contact email.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your OAuth-provided
          identifier, display name, and email address from your
          chosen provider (Google, Discord, or GitHub).
        </li>
        <li>
          <strong>Gameplay data:</strong> deck choices, match
          outcomes, currency balances, achievements — required to
          run the game.
        </li>
        <li>
          <strong>Usage analytics</strong> (only if you accept the
          analytics cookie): page views, feature interactions,
          performance metrics. Identifiers are pseudonymous.
        </li>
        <li>
          <strong>Payment data:</strong> handled by Stripe. We
          retain only the Stripe customer / payment-intent IDs and
          purchase amounts; full card details never reach our
          servers.
        </li>
      </ul>

      <h2>Lawful basis</h2>
      <p>
        We process account and gameplay data on the basis of contract
        performance (you can't play the game without it). Analytics
        data is processed on the basis of your explicit consent,
        which you can withdraw at any time from the cookie settings
        page.
      </p>

      <h2>Retention</h2>
      <p>
        Account data is kept while your account is active. Once you
        delete your account, identifying fields are nulled
        immediately and the rest is hard-deleted after a 30-day
        grace period. Financial records may be retained up to 7
        years where required by law. Analytics events are aggregated
        and deleted after 24 months.
      </p>

      <h2>Third parties</h2>
      <p>
        See our{" "}
        <a href="/legal/vendors">vendor list</a> for the third
        parties we share data with and the purpose of each transfer.
      </p>

      <h2>Your rights</h2>
      <p>
        Under GDPR / UK GDPR / CCPA you have the right to access,
        correct, export, and delete your data. Use the buttons in
        Settings → Account, or contact <code>privacy@dischordian.example</code>.
        Export requests are honoured within 30 days.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, write to{" "}
        <code>privacy@dischordian.example</code>. EU representative:
        <em>fill in once appointed</em>.
      </p>
    </article>
  );
}
