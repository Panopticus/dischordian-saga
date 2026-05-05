/**
 * Terms of Service — placeholder scaffold.
 *
 * Replace with legally-reviewed text before launch. Version string
 * must match `CURRENT_AGREEMENT_VERSIONS.terms_of_service` on the
 * server.
 */
export default function TermsOfServicePage() {
  return (
    <article style={{ maxWidth: 720, margin: "0 auto", padding: 24, lineHeight: 1.5 }}>
      <h1>Terms of Service</h1>
      <p>
        <strong>Version 2026-05-05</strong> · Last updated 2026-05-05
      </p>

      <h2>Acceptance</h2>
      <p>
        By creating an account or using Loredex OS / Dischordian
        Saga (the "Service") you agree to these terms.
      </p>

      <h2>Account</h2>
      <p>
        You're responsible for keeping your OAuth provider account
        secure. Loredex OS authenticates via Google / Discord /
        GitHub and does not store passwords.
      </p>

      <h2>Conduct</h2>
      <p>
        You agree not to: cheat, exploit bugs for unfair advantage,
        harass other players, share or sell accounts, or upload
        content that violates the law or our community guidelines.
      </p>

      <h2>Virtual goods</h2>
      <p>
        Currency, cards, and cosmetics purchased or earned in-game
        are licensed to you for personal use within the Service.
        They have no real-world monetary value, are
        non-transferable, and may be revoked for cause (cheating,
        chargebacks, ToS violations).
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate accounts for ToS violations.
        You can close your account at any time via Settings →
        Account → Delete.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The Service is provided "as is" without warranty of any
        kind. Our liability is limited to the amount you paid us in
        the prior 12 months.
      </p>

      <h2>Governing law</h2>
      <p>
        Replace this paragraph with the jurisdiction selected by
        your legal counsel.
      </p>
    </article>
  );
}
