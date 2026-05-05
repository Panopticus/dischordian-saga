# Vendor / Sub-processor list

Required by GDPR Art. 28. List every third party that processes
user data on our behalf, the purpose of the transfer, the data
shared, and a link to the vendor's DPA.

| Vendor | Purpose | Data shared | DPA |
|--------|---------|-------------|-----|
| **Google (OAuth)** | Authentication | OAuth profile (id, name, email) | https://cloud.google.com/terms/data-processing-addendum |
| **Discord (OAuth)** | Authentication | OAuth profile (id, username, email) | https://discord.com/developers/data-protection-addendum |
| **GitHub (OAuth)** | Authentication | OAuth profile (id, login, email) | https://docs.github.com/en/site-policy/privacy-policies/global-privacy-practices |
| **Stripe** | Payment processing | Customer email, billing address (collected by Stripe Checkout), payment amount | https://stripe.com/legal/dpa |
| **AWS S3** (us-east-2) | CDN asset hosting (art, audio, video, VO) | None — assets are public-read | https://aws.amazon.com/service-terms/ |
| **ElevenLabs** | Voice-over generation (server-side, batch) | Text scripts only — no end-user data | https://elevenlabs.io/legal/dpa |
| **Google (Gemini)** | LLM-powered NPC dialogue | Anonymised conversation context, NEVER raw account identifiers | https://cloud.google.com/terms/data-processing-addendum |
| **Sentry** (optional, gated by SENTRY_DSN) | Error monitoring | Stack traces + scrubbed request context, no payment data | https://sentry.io/legal/dpa/ |
| **OpenTelemetry exporter** (optional) | Distributed tracing | Span data (route, latency, user-id hash) | Self-hosted; no third-party data transfer |
| **Railway** | Hosting (server + MySQL) | All server data | https://railway.app/legal/dpa |

## Update procedure

When you add a new vendor that processes user data:

1. Sign their DPA. File the executed copy in your secure document
   store (do not commit DPAs to git).
2. Add the row above with the data shared + purpose.
3. Update the Privacy Policy if the disclosure list there
   summarises vendors.
4. If the vendor is in a non-adequacy country (per GDPR), confirm
   you have an SCC or adequacy decision in place before sending
   any EU-resident data.

## Out-of-scope

These services are used internally only and do **not** receive
end-user data:

- GitHub (source hosting)
- pnpm registry / npm registry (build-time only)
- ElevenLabs internal voice library — operator chooses presets,
  no user voices are uploaded
