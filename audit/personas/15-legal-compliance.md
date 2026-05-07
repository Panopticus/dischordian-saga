# Legal / Compliance — Risk Flags

> Framing: every item below is a **risk to flag for outside legal counsel**. Nothing here is legal advice. Severity reflects launch-blocking potential, not legal merit.

## Top 5 risks

### R1: Stockfish (GPL-3.0) bundled as a hard production dependency
- file/area: `package.json` line 176 (`"stockfish": "^18.0.7"` in `dependencies`); also referenced via CSP in `apps/server/_core/securityHeaders.ts` ("Stockfish CDN")
- risk level: **blocker**
- category: license
- risk: Stockfish is licensed **GPL-3.0**. Distributing it as part of a closed-source commercial client (web bundle + Capacitor iOS/Android binaries via `@capacitor/*` deps) likely triggers GPL-3.0's source-disclosure and "same-license" obligations for the **combined work**. App-store distribution complicates this further (Apple's terms vs. GPL anti-Tivoization clauses are a known conflict).
- mitigation: Counsel decision tree: (a) load Stockfish only as an isolated subprocess / external service over the wire (mere-aggregation argument), (b) swap to a permissively-licensed engine, or (c) accept full GPL-3.0 source disclosure for the client. Repo's own root `license: MIT` does NOT cure this. Document the chosen stance in `LICENSES.md` before any public release.

### R2: AI-generated voice (ElevenLabs) and art assets ship without provenance / disclosure metadata
- file/area: `apps/scripts/generate-*-vo.ts` (15+ ElevenLabs TTS generators), `docs/production/*.md` (asset-gen prompt bibles), `apps/shared/*VoManifest.json`
- risk level: **high**
- category: generated_content
- risk: Hundreds of VO lines are TTS-rendered through ElevenLabs (`generate-prelude-vo.ts`, `generate-guild-cutscene-vo.ts`, `episode-voice-config.ts` notes "PUBLIC PRESET voices"). Card art appears AI-prompted (see `TCG_ART_SPEC.md`, `COMPLETE_ART_PROMPT_BIBLE.md`). Exposure: (1) **EU AI Act Art. 50** transparency obligations (deepfake / synthetic media labelling, in force from Aug 2026), (2) **store policies** (Apple §4.1, Google Play "Generative AI Apps") increasingly require disclosure, (3) ElevenLabs preset-voice ToS limits redistribution and forbids certain commercial uses without an enterprise tier, (4) voice-likeness rights if any preset resembles a real person.
- mitigation: Counsel review of ElevenLabs commercial tier + per-voice usage rights; add an AI-disclosure surface in-app and in store listings; record provenance (model + prompt + date) per asset in a manifest.

### R3: Privacy Policy and Terms are explicit placeholder scaffolds
- file/area: `apps/client/src/pages/PrivacyPolicyPage.tsx` (header comment: "Operator must replace the body with the legally-reviewed text"), `PrivacyPage.tsx`, `TermsOfServicePage.tsx`, `TermsPage.tsx` (two of each — also a duplication risk)
- risk level: **blocker**
- category: terms
- risk: Shipping placeholder privacy/ToS text fails GDPR Art. 13/14 transparency, CCPA notice-at-collection, Apple §5.1.1, and Google Play User Data policies. Two parallel pages (`PrivacyPage` + `PrivacyPolicyPage`, `TermsPage` + `TermsOfServicePage`) risk inconsistent versions being served.
- mitigation: Replace with counsel-approved text; consolidate to one Privacy + one ToS route; ensure `CURRENT_AGREEMENT_VERSIONS` in `apps/server/routers/account.ts` is bumped on every material change so acceptance audit holds.

### R4: No age gate on signup; payments + analytics flow without COPPA/GDPR-K screen
- file/area: OAuth in `apps/server/_core/oauth.ts`, Stripe + RevenueCat in `package.json`, no `ageGate`/`coppa`/`birthYear` references found in `apps/`
- risk level: **high**
- category: age_rating
- risk: Narrative is "psychological-sci-fi horror" with biblical themes — likely PEGI 16/ESRB Teen-or-Mature. Combined with paid microtransactions (Stripe + RevenueCat) and no age gate, this triggers **COPPA** (US, under-13) and **GDPR Art. 8** (EU, under-16 in many states) exposure. `dateOfBirth` is collected only in the Lions Club application form, not at account creation.
- mitigation: Counsel-approved neutral age-gate at first login; block under-13 entirely or run a COPPA-compliant flow; record self-declared DOB; submit for ESRB/PEGI/IARC ratings before store submission.

### R5: S3 `dgrsart` bucket relies on a `PublicReadCDN` policy with no documented scoping
- file/area: `apps/scripts/upload-public-to-s3.ts` (comment: "the existing PublicReadCDN bucket policy"), no IaC / bucket policy file in repo
- risk level: **medium**
- category: s3_exposure
- risk: Bucket-wide public-read policy is fine for `cdn/client-public/**` but uploader writes `art|audio|videos|music|games|vo|characters|vfx-atlases` directly under that prefix with no ACL guard. Any future operator dropping a non-public file into one of those dirs (PII export, debug build, unredacted draft) is silently world-readable. No bucket policy / Block Public Access config is checked in.
- mitigation: Commit the `dgrsart` bucket policy + BPA settings to repo as IaC; restrict public-read to `cdn/client-public/*`; add a pre-upload MIME/path allowlist; confirm `dgrsvoices` posture separately.

## Compliance checklist (before public launch)

1. Resolve Stockfish GPL-3.0 status (R1) — written counsel memo on file.
2. Replace placeholder Privacy Policy + ToS (R3) and consolidate duplicate routes; lock to versioned `CURRENT_AGREEMENT_VERSIONS`.
3. Implement age gate at signup; document COPPA / GDPR-Art.8 / ESRB / PEGI / IARC stance (R4).
4. AI-content disclosure surface (in-app + store listing) and ElevenLabs commercial-tier confirmation (R2); per-asset provenance manifest.
5. Audit `dgrsart` + `dgrsvoices` bucket policies, commit IaC, confirm BPA + path-scoped public-read (R5).
6. Trademark clearance pass on LOREDEX entity names (e.g. "Iron Lion", "The Architect", "The Source") — DOC4 has 100+ entities; counsel runs USPTO/EUIPO/WIPO sweep.
7. Verify DSR endpoints (`exportMyData`, `deleteMyAccount` in `apps/server/routers/account.ts`) meet GDPR Art. 15/17/20 SLA + CCPA "Do Not Sell/Share" link; cookie banner (`CookieConsentBanner.tsx`) wires consent to analytics gating.
8. DMCA agent registration (US Copyright Office) + in-app takedown contact; Stripe/RevenueCat DPAs signed; Sub-processor list published; retention schedule matches `retentionService.ts`.

## Convergence hints

- **Security audit (#02):** S3 posture (R5) and OAuth surface (R4) overlap; cross-link the bucket-policy IaC ask.
- **DevOps/SRE (#06):** Stockfish (R1) ships via `onlyBuiltDependencies` — license decision affects the build pipeline and CDN distribution.
- **Mobile (#08):** Capacitor iOS/Android distribution amplifies R1 (Apple §3.3.1 vs. GPL) and R2 (store AI-disclosure rules).
- **TCG designer (#09) / narrative leads:** R6-trademark sweep needs entity-list ownership; LOREDEX (`docs/narrative-audit/DOC4_LOREDEX.md`) is the canonical source.
- **QA (#05):** age gate + cookie consent (R4) need E2E coverage; `apps/e2e/` has no current age-gate spec.
