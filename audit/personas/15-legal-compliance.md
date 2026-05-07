# Legal / Compliance — Risk Flags

> Each item is a **risk to flag for outside legal counsel**, not legal advice.

## Top 5 risks

### R1: Stockfish (GPL-3.0) bundled as a hard production dep
- file/area: `package.json` line 176 (`"stockfish": "^18.0.7"`); CSP allows "Stockfish CDN" in `apps/server/_core/securityHeaders.ts`
- risk level: **blocker**
- category: license
- risk: Stockfish is **GPL-3.0**. Shipping it inside a closed-source web bundle and Capacitor iOS/Android binaries likely triggers GPL-3.0 source-disclosure / same-license duties on the combined work. App-store distribution adds the GPL-vs-Apple anti-Tivoization conflict. Repo's root `license: MIT` does not cure this.
- mitigation: Counsel decision: (a) isolate Stockfish as an out-of-process service (mere-aggregation), (b) swap to a permissive engine, or (c) accept full source disclosure. Document in `LICENSES.md` pre-launch.

### R2: AI-generated VO + art ship without provenance / disclosure
- file/area: `apps/scripts/generate-*-vo.ts` (15+ ElevenLabs TTS scripts), `episode-voice-config.ts` (uses "PUBLIC PRESET voices"), `docs/production/*.md` prompt bibles
- risk level: **high**
- category: generated_content
- risk: Hundreds of VO lines are TTS via ElevenLabs; card art appears AI-prompted. Exposure: **EU AI Act Art. 50** synthetic-media transparency (in force Aug 2026); Apple §4.1 / Google Play "Generative AI Apps" disclosure; ElevenLabs preset-voice ToS limits commercial use without enterprise tier; voice-likeness rights if a preset resembles a real person.
- mitigation: Counsel review of ElevenLabs commercial tier + per-voice rights; in-app + store-listing AI disclosure; per-asset provenance manifest (model + prompt + date).

### R3: Privacy Policy and Terms are explicit placeholder scaffolds
- file/area: `apps/client/src/pages/PrivacyPolicyPage.tsx` (header: "Operator must replace the body with the legally-reviewed text"), plus duplicate `PrivacyPage.tsx`, `TermsOfServicePage.tsx`, `TermsPage.tsx`
- risk level: **blocker**
- category: terms
- risk: Placeholder text fails GDPR Art. 13/14, CCPA notice-at-collection, Apple §5.1.1, Google Play User Data. Duplicate pages risk drift.
- mitigation: Counsel-approved text; consolidate to one Privacy + one ToS route; bump `CURRENT_AGREEMENT_VERSIONS` (`apps/server/routers/account.ts`) on every material change.

### R4: No age gate at signup; payments + analytics live without COPPA/GDPR-K screen
- file/area: `apps/server/_core/oauth.ts`; Stripe + RevenueCat in `package.json`. Repo-wide grep finds no `ageGate`/`coppa`/`birthYear` at signup (`dateOfBirth` only collected in the Lions Club form).
- risk level: **high**
- category: age_rating
- risk: "Psychological-sci-fi horror" with biblical themes is likely PEGI 16 / ESRB T-M. Combined with paid microtransactions and no age gate, exposes **COPPA** (US <13) and **GDPR Art. 8** (EU <16 in many states).
- mitigation: Neutral age-gate at first login; block under-13 or run COPPA-compliant flow; submit for ESRB/PEGI/IARC before store submission.

### R5: S3 `dgrsart` relies on an undocumented `PublicReadCDN` policy
- file/area: `apps/scripts/upload-public-to-s3.ts` (comment refers to "the existing PublicReadCDN bucket policy"); no IaC bucket-policy file in repo
- risk level: **medium**
- category: s3_exposure
- risk: Uploader writes 8 directories under `cdn/client-public/` with no per-object ACL guard; any future drop of a non-public file (PII export, debug build) is silently world-readable. BPA config not checked in.
- mitigation: Commit `dgrsart` + `dgrsvoices` policies as IaC; restrict public-read to `cdn/client-public/*`; pre-upload path/MIME allowlist.

## Compliance checklist (before public launch)

1. Resolve Stockfish GPL-3.0 status (R1) — written counsel memo on file.
2. Replace placeholder Privacy + ToS (R3); consolidate duplicate routes; lock `CURRENT_AGREEMENT_VERSIONS`.
3. Implement age gate; document COPPA / GDPR-Art.8 / ESRB / PEGI / IARC stance (R4).
4. AI-content disclosure surface + ElevenLabs commercial-tier confirmation (R2); per-asset provenance manifest.
5. Audit `dgrsart` + `dgrsvoices` policies; commit IaC; confirm BPA + path-scoped public-read (R5).
6. Trademark clearance on LOREDEX entity names (e.g. "Iron Lion", "The Architect", "The Source") — DOC4 has 100+ entities; counsel runs USPTO/EUIPO/WIPO sweep.
7. Verify DSR endpoints (`exportMyData`, `deleteMyAccount` in `apps/server/routers/account.ts`) meet GDPR Art. 15/17/20 SLA + CCPA "Do Not Sell/Share"; confirm `CookieConsentBanner.tsx` gates analytics.
8. DMCA agent registration + in-app takedown contact; Stripe + RevenueCat DPAs signed; sub-processor list published; retention aligned with `retentionService.ts`.

## Convergence hints

- **Security (#02):** R5 (S3) + R4 (OAuth) overlap — cross-link the IaC ask.
- **DevOps/SRE (#06):** Stockfish (R1) sits in `onlyBuiltDependencies`; license decision shapes build + CDN.
- **Mobile (#08):** Capacitor distribution amplifies R1 (Apple §3.3.1 vs. GPL) and R2 (store AI rules).
- **TCG/narrative (#09):** trademark sweep needs entity-list owner; `docs/narrative-audit/DOC4_LOREDEX.md` is canonical.
- **QA (#05):** age gate + cookie consent need E2E coverage; `apps/e2e/` has no age-gate spec.
