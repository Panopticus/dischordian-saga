<!-- version: 2026-05-08 -->

# Privacy Policy

**Effective date:** 2026-05-08

This Privacy Policy explains how Panopticus ("we," "us," "our," or
the "Operator") collects, uses, shares, and protects information
about you when you use The Dischordian Saga, Loredex OS, and any
related websites, applications, or services we operate (together,
the "Service"). It is written to comply with the EU and UK General
Data Protection Regulations ("GDPR" and "UK GDPR"), the California
Consumer Privacy Act as amended by the California Privacy Rights
Act ("CCPA/CPRA"), the Children's Online Privacy Protection Act
("COPPA"), and other applicable privacy laws.

## 1. Who we are

Panopticus is the data controller for personal information processed
through the Service. You can contact us as follows:

- **Email (privacy):** privacy@dischordian-saga.com
- **Email (general support):** support@dischordian-saga.com
- **Postal address:** [OPERATOR_REGISTERED_ADDRESS]
- **EU representative (Art. 27 GDPR):** [EU_REPRESENTATIVE]
- **UK representative (Art. 27 UK GDPR):** [UK_REPRESENTATIVE]
- **Data protection officer:** [DPO_NAME_OR_NONE_DESIGNATED]

If we have not designated a DPO, our privacy team handles requests
at the privacy email above.

## 2. Scope

This policy applies to personal information we collect from and
about people who create an account on the Service, browse the
Service, contact us, or whose information is otherwise provided to
us in connection with the Service. It does not apply to third-party
sites or services we link to but do not operate.

## 3. Information we collect

### 3.1 Account information

When you sign in via OAuth, we receive the following from your
chosen identity provider (Google, Discord, or GitHub) and store it
on our users record:

- A stable identifier ("OAuth subject" or "open ID") used to log
  you in on subsequent visits.
- Your display name.
- Your email address, where the provider supplies it.
- The provider you used (so we know which one to verify against
  next time).

### 3.2 Age-verification information

To comply with COPPA and GDPR-K (the children's-data parts of the
GDPR), we ask you for your **date of birth** the first time you sign
in, and we infer your **country** from the IP-geolocation header
supplied by our edge network (typically `CF-IPCountry` from
Cloudflare). We store the date of birth, the inferred country code,
and the timestamp of the verification on your users record. If you
report an age below the threshold for your country (16 in the EEA
and UK; 13 elsewhere) we **do not store the reported date of
birth**; we only record that the verification failed and prevent
the account from being used.

### 3.3 Gameplay information

As you play, we record information necessary to run the game,
including:

- Game progress, narrative choices, identity-chain alignment, and
  act/chapter completion state.
- Inventory: cards owned, cosmetics, dream tokens and other in-game
  currencies.
- Match history for card duels, fights, and chess games (including
  opponent identifier, outcome, and settings).
- Achievements, titles, and reward grants.
- Guild membership and chat (chat messages are retained for 90
  days; see Section 7).

### 3.4 Payment information

If you make a purchase, our payment processor (Stripe) collects
your billing details directly through their hosted Checkout flow.
We never see or store your full payment-card number, CVV, or bank
account number. We retain only:

- The Stripe customer ID and payment-intent ID.
- The amount, currency, and time of the purchase.
- The store SKU (e.g. which dream-token bundle or cosmetic you
  bought).
- The fulfilment status of the grant.

If you make a purchase through Apple's App Store or Google Play,
those platforms (and, where applicable, our App Store receipt
adapter via RevenueCat) handle payment data under their own
policies; we receive only the receipt validation result.

### 3.5 Technical information

When you connect to the Service we receive standard request
metadata: IP address, user-agent string, and time of request. We
hash IP addresses (truncated SHA-256) before storing them with
agreement-acceptance records, so the original IP cannot be
recovered from our database. Unhashed IPs appear only in transient
server access logs and rate-limit caches.

### 3.6 Communications

When you email us, file a support ticket, or otherwise contact us,
we retain those messages and our responses to handle your request
and to detect support fraud or abuse.

### 3.7 Diagnostic and analytics information

If you accept the analytics option in our cookie banner, we record
events about how you use the Service (for example, which features
you opened, how long pages took to render, and which errors
occurred). These events are stored in our `analytics_events` table
keyed to your user ID, which makes them **pseudonymous** rather
than fully anonymous: events tied to your account remain joinable
to your account record until that account is deleted, after which
the user-identifying fields on the events are nulled.

We do not collect biometric, geolocation (beyond the country-level
inference described in Section 3.2), camera, microphone, contacts,
or push-notification data.

## 4. How we use your information and the lawful basis we rely on

For each purpose below we identify the lawful basis under GDPR
Art. 6 (and, for EEA/UK residents, the equivalent UK GDPR
provision):

| Purpose | Categories used | Lawful basis |
|---|---|---|
| Operate your account and save your progress | Account, gameplay | Contract performance (Art. 6(1)(b)) |
| Process your purchases and provide entitlements | Account, payment | Contract performance (Art. 6(1)(b)) |
| Verify you meet the minimum age | Age-verification | Legal obligation (Art. 6(1)(c)) — COPPA/GDPR-K |
| Prevent fraud, cheating, abuse, and security incidents | Account, technical, communications | Legitimate interest (Art. 6(1)(f)) — protecting the Service |
| Operate our community features (guilds, chat) | Account, gameplay, communications | Contract performance + legitimate interest |
| Improve game balance and detect bugs (analytics) | Diagnostic / analytics | Consent (Art. 6(1)(a)) |
| Respond to support requests | Communications, account | Legitimate interest (Art. 6(1)(f)) |
| Comply with our legal obligations (tax, accounting, requests from regulators or courts) | Payment, account | Legal obligation (Art. 6(1)(c)) |

Where we rely on legitimate interests, we have balanced our
interests against your rights and reasonable expectations and have
concluded the processing is proportionate. You can object to
legitimate-interest processing at any time (see Section 8).

We **do not** sell or "share" personal information for cross-context
behavioural advertising (CCPA/CPRA terms). We **do not** serve
targeted advertising. We **do not** use your data to train
general-purpose AI models.

## 5. Vendors and sub-processors

We share information with the third parties below only to the
extent necessary for them to provide their service to us. Each
vendor is bound by a data processing agreement (DPA) requiring them
to use the data only on our instructions and to apply appropriate
security measures.

| Vendor | Purpose | Data shared |
|---|---|---|
| **Google (OAuth)** | Authentication | OAuth profile (id, name, email) |
| **Discord (OAuth)** | Authentication | OAuth profile (id, username, email) |
| **GitHub (OAuth)** | Authentication | OAuth profile (id, login, email) |
| **Stripe** | Payment processing | Customer email, billing address, payment amount |
| **AWS S3** (us-east-2) | CDN asset hosting (art, audio, video, voice-over) | None — assets are public-read |
| **ElevenLabs** | Voice-over generation (server-side, batch) | Text scripts only — no end-user data |
| **Google (Gemini)** | LLM-powered NPC dialogue | Anonymised conversation context, never raw account identifiers |
| **Sentry** (optional, gated by `SENTRY_DSN`) | Error monitoring | Stack traces and scrubbed request context, no payment data |
| **OpenTelemetry exporter** (optional) | Distributed tracing | Span data (route, latency, hashed user ID) |
| **Railway** | Hosting (server and MySQL database) | All server-side data |
| **RevenueCat** (optional, when in-app purchases on iOS or Android are enabled) | App-store receipt validation | Anonymised purchase identifiers |

A complete and current sub-processor list — with links to each
vendor's DPA — is maintained at `/legal/vendors` (also published
internally at `docs/legal/VENDORS.md`). We update this list when we
add or remove a sub-processor; material additions trigger a renewed
acceptance prompt under Section 12.

## 6. International data transfers

Some of our vendors are located outside the European Economic Area
or the United Kingdom. Where we transfer personal data of EEA or UK
residents to a country that has not received an adequacy decision
from the European Commission or the UK government, we rely on the
**Standard Contractual Clauses** ("SCCs") published by the European
Commission (and the UK Addendum thereto) as the transfer mechanism.
The vendor table above identifies the relevant DPAs which include
the SCCs by reference where applicable.

If you would like a copy of the safeguards we have put in place for
a specific transfer, contact us at the privacy email above.

## 7. How long we keep your information

We keep personal information only as long as we need it for the
purpose we collected it. Specific windows:

| Data class | Retention |
|---|---|
| Active account record | While your account is open |
| Soft-deleted account | 30 days from your deletion request, then hard-deleted |
| Game progress, cards, achievements | While your account is open; deleted with your account |
| Financial / purchase records | 7 years (required for tax and accounting) — user-identifying fields are anonymised after account deletion |
| Guild chat messages | 90 days from send |
| Moderation reports | 2 years |
| Analytics events | 24 months from event |
| Server access and error logs (Sentry/OTel) | 90 days |
| Database backups (managed by Railway) | 30 days |

Hashed IP addresses on agreement-acceptance records are retained
for the lifetime of the agreement-acceptance record, which is the
lifetime of the account.

## 8. Your rights

You have rights over the personal information we hold about you.
We respond to verified requests within the timeframe required by
the applicable law (one month under GDPR; 45 days under
CCPA/CPRA, extendable once).

| Your right | GDPR / UK GDPR | CCPA / CPRA | How to exercise it |
|---|---|---|---|
| Access a copy of your data | Art. 15 | §1798.110, §1798.115 | In-app: **Settings → Account → Export my data** (uses our `account.exportMyData` API). Email the privacy address as an alternative. |
| Correct inaccurate data | Art. 16 | §1798.106 | Email the privacy address; we will correct or guide you to the in-app fix. |
| Delete your data ("right to be forgotten") | Art. 17 | §1798.105 | In-app: **Settings → Account → Delete my account** (uses our `account.deleteMyAccount` API). 30-day grace; thereafter, hard delete. |
| Restrict or object to processing | Art. 18, 21 | §1798.120 (opt-out of "sale/share" — N/A, we do not sell or share) | Email the privacy address. |
| Data portability (machine-readable export) | Art. 20 | §1798.130 | Same as access; export is JSON. |
| Withdraw consent (analytics) | Art. 7(3) | n/a | Use the cookie banner's "Essential only" option, or `clearCookieConsent()` in a browser console to re-prompt. |
| Not be discriminated against for exercising rights | n/a | §1798.125 | We do not condition the Service on you waiving these rights. |
| Lodge a complaint with a supervisory authority | Art. 77 | n/a | EEA: your local DPA. UK: the Information Commissioner's Office (ico.org.uk). California: the California Privacy Protection Agency (cppa.ca.gov). |

We may need to verify your identity before fulfilling a request,
typically by asking you to send the request from the email address
on the account.

## 9. Children's privacy

The Service is **not directed to children under 13**, and we do not
knowingly collect personal information from children under 13. In
the European Economic Area and the United Kingdom we apply the
**stricter age threshold of 16** required by GDPR-K (Art. 8 GDPR).

When you first sign in, we ask for your date of birth and infer
your country from the IP-geolocation header. If you are below the
threshold for your country, we do not create an active account and
we do not retain the reported date of birth. **There is no parental
consent flow:** an under-threshold sign-up cannot be unlocked by a
parent — you must wait until you are old enough.

If you believe a child below the threshold has nonetheless created
an account, contact us at the privacy email and we will delete the
account and any associated data.

## 10. Cookies

We use a single essential cookie (`loredex_session`) to keep you
logged in. With your consent we also collect pseudonymous analytics
events. We do not set advertising cookies, and Stripe Checkout —
the only third-party payment surface — runs on Stripe's domain, not
ours, so it does not set cookies on our origin. Full details are in
our [Cookie Policy](/cookies).

## 11. Security

We protect your personal information with measures that are
appropriate to the nature of the data and the risk:

- Transport security: HTTPS everywhere, HSTS, TLS 1.2+.
- Authentication: OAuth with our identity providers; session tokens
  in HttpOnly + Secure + SameSite=Lax cookies.
- Database: parameterised queries; least-privilege credentials; row
  retention enforced by automated cron.
- Application: per-IP and per-user rate limits on public endpoints;
  CSRF protection; input validation via Zod schemas.
- Operational: hashed (not encrypted-recoverable) IP storage on
  long-lived audit rows; backups managed by Railway; error logs
  scrubbed before they reach Sentry.

No system can guarantee absolute security. If a breach occurs that
affects your personal information, we will notify you and the
relevant supervisory authorities within the timeframes required by
law (within 72 hours under GDPR Art. 33).

## 12. Changes to this policy

We may update this policy from time to time. The version date at
the top of this document and the `CURRENT_AGREEMENT_VERSIONS` value
on our server indicate when it last changed. For material changes,
we will re-prompt you to review and accept the new policy on next
sign-in via our in-app gate; you can decline and stop using the
Service.

Non-material updates (typo fixes, contact-detail changes, vendor
list additions that do not change the categories of data shared)
take effect on the date posted without re-prompting.

## 13. Contact and complaints

For questions, requests, or to exercise any of your rights:

- **Privacy email:** privacy@dischordian-saga.com
- **Postal:** [OPERATOR_REGISTERED_ADDRESS]
- **EU representative (Art. 27 GDPR):** [EU_REPRESENTATIVE]

You always have the right to lodge a complaint with the
**supervisory authority** of your member state (in the EEA or UK)
or the relevant agency in your jurisdiction. We hope you'll
contact us first so we can try to resolve your concern directly.
