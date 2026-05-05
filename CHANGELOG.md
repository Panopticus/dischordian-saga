# Changelog

All player-visible and operationally-significant changes land here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Project uses calver-by-release rather than semver.

## [Unreleased]

### Security

- WebSocket connections (PvP cards, chess, cades signaling, chess
  multiplayer) now authenticate via the session cookie. Previously
  trusted client-supplied userId — fixed identity-spoofing surface.
- OAuth callbacks validate a server-issued `state` nonce. New
  `/api/oauth/start/:provider` route generates the state.
- Content-Security-Policy header set on every response; HSTS in
  production.
- Username display names are NFKC-normalised at signup; reserved
  names (admin/mod/etc.) and homoglyph variants ("аdmin" with
  Cyrillic а) are blocked or auto-suffixed.
- Currency-bearing mutations (cosmetic shop, battle pass, crafting,
  store Dream purchase) are now atomic via conditional UPDATE +
  affectedRows checks. Closes the TOCTOU / race-condition holes.
- `contentApi.invalidateCache` moved from `publicProcedure` to
  `adminProcedure` (anyone could DoS via repeated cache flush).
- Credential sanitiser strips invisible-paste characters from every
  API key at boot (generalises PR #402's ELEVENLABS fix).

### Added

- GDPR data-export, account-deletion, and ToS/Privacy/Cookie
  consent recording (`account` router).
- `userAgreements` table records every policy acceptance with
  version + ipHash.
- Cookie consent banner (essential vs all).
- Privacy Policy + Terms of Service scaffold pages.
- Vendor / sub-processor list (`docs/legal/VENDORS.md`).
- Data retention policy (`docs/legal/RETENTION_POLICY.md`).
- Stripe `automatic_tax` enabled by default (toggleable via
  `STRIPE_AUTOMATIC_TAX=false`); see `docs/operations/STRIPE_TAX_SETUP.md`.
- Transactional email service (Resend, fetch-based, no SDK dep).
- Server-side replay verification scaffold (`replayVerifier`).
- `lint:void-energy`, advisory `pnpm audit`, default-on e2e in CI;
  Dependabot for weekly patch+minor updates.

### Changed

- E2E tests run on every PR by default (previously gated on
  `vars.RUN_E2E`).
