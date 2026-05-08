# AI provenance — generated content disclosure

Audit/15.R2 — voice-over and (some) card art are AI-generated.
Real-world exposure surfaces:

- **EU AI Act Art. 50** synthetic-media transparency obligation
  (in force August 2026).
- **Apple App Store §4.1** and **Google Play "Generative AI Apps"**
  disclosure requirements.
- ElevenLabs preset-voice ToS limits commercial use without the
  enterprise tier and forbids voice impersonation.
- Voice-likeness rights if a preset coincidentally resembles a real
  person.

This document is the per-asset provenance manifest. Every AI-touched
asset that ships in the production build must have a row here.

## In-app disclosure

The Privacy Policy (`apps/client/src/legal/privacy.md` §5) lists
ElevenLabs and Google Gemini as sub-processors. The Terms of
Service (`apps/client/src/legal/terms.md` §5) state that user
content is not used to train third-party models.

Beyond that, the in-app **About → AI in Loredex OS** page (planned;
referenced by App Store reviewer notes) reproduces this manifest in
plain language. The store-listing AI-content disclosure checkbox
toggles ON for both Apple and Google.

## Voice-over

| Vendor | Mechanism | Voice license | Trained on user data? |
|---|---|---|---|
| ElevenLabs | Server-side batch TTS via `apps/scripts/generate-*-vo.ts` | Operator-licensed preset voices (no cloned voices); commercial-use tier confirmed at deploy | No |

Per-character voice selection is in
`apps/scripts/episode-voice-config.ts`. Voice ids resolve to
ElevenLabs preset stock voices documented in
`docs/production/ART_BIBLE.md`. **No real-person voice cloning** is
used.

VO scripts in `apps/scripts/<character>-lines.json` are the
canonical input; the generator is deterministic given (script,
voice id, model version). Output `*.mp3` lands under
`apps/client/public/audio/vo/` and is uploaded to S3 by
`apps/scripts/upload-public-to-s3.ts`.

### Generation pipeline contract

For every VO generator script (`vo:act1`...`vo:act7`,
`vo:companion`, etc.):

1. Reads `apps/scripts/<character>-lines.json` (operator-authored).
2. Calls ElevenLabs `text-to-speech/<voice_id>` with the model id
   pinned in the script (`eleven_multilingual_v2` as of 2026-Q2).
3. Writes the result + an entry in
   `apps/shared/<character>VoManifest.json` containing:
   - `voiceId` — preset id (NOT a cloned voice).
   - `modelId` — generation model.
   - `generatedAt` — ISO timestamp.
   - `scriptHash` — SHA-256 of the input script string (so a
     re-run with edited script triggers regeneration).

Idempotent: existing manifest entries with matching `scriptHash`
are skipped.

## Card art

| Status | Source |
|---|---|
| Producer-uploaded artwork | Most published cards (Antiquarian, Insurgency Imprints, Iron Lion bleed-through, Hierarchy of the Damned). Provenance is human; tracked in producer drop notes. |
| AI-prompted concept frames | A subset of Pack 2 placeholder art (`apps/client/public/art/cards/s1_pack2/...`) shipped with prompt metadata in `docs/production/act1ArtPrompts.ts` and per-card production notes. |
| Iconography + UI-glue art | Open-source iconography (Lucide, Heroicons), licensed; not AI. |

Where an AI-prompted frame is the canonical art for a shipping card,
the provenance entry includes:

- `model` — the image generator + version (e.g. "flux-1.1-pro").
- `promptHash` — SHA-256 of the canonical prompt string (so a
  prompt edit forces regeneration / re-review).
- `humanReviewer` — the operator who reviewed and approved the
  output.
- `licenseTag` — reference to the model's commercial-use ToS
  acceptance date.

## NPC dialogue (Elara, runtime-generated)

| Vendor | Mechanism | Stored on us? |
|---|---|---|
| Google Gemini | `gemini-2.5-flash` via `_core/llm.ts` for in-game NPC chat (Elara). | Yes — chat history per session, retained 24 months per RETENTION_POLICY.md. |

Conversation context sent to Gemini is **anonymised** — the request
strips raw account identifiers and replaces them with a stable
pseudonymous handle. The Gemini DPA at
`https://cloud.google.com/terms/data-processing-addendum` covers
the EU/UK transfer; SCCs apply.

Users see an in-line "Powered by Google Gemini" disclosure inside
the Elara dialog component (`apps/client/src/components/ElaraDialog.tsx`)
the first time the LLM is contacted in a session.

## Music + ambient audio

Every shipping music track is human-authored. The
`docs/production/MUSIC_BIBLE.md` cross-references each track to its
producer credit. **No AI-generated music ships in the production
build.**

A small set of in-development scratch tracks under
`apps/client/public/music/scratch/` are AI-generated for layout /
timing tests; they are gated behind `NODE_ENV !== "production"` and
do not bundle in release builds.

## Update procedure

Adding a new AI-generated asset:

1. Add the asset under the correct prefix (`apps/client/public/...`
   or producer S3 drop).
2. Append a row to the relevant table above.
3. Sign the vendor's commercial-use ToS if it's a new vendor; file
   the executed copy in your secure document store.
4. Update the in-app About → AI page if it's a new category.
5. Re-test the parity check at
   `scripts/verify-ai-provenance.ts` (planned) — fails CI if a
   non-trivial asset under a generator-output path lacks a
   provenance row.

## Removal procedure

If an asset is found to violate vendor ToS (e.g. an ElevenLabs
preset is retired, or a voice is later determined to resemble a
real person):

1. Remove the asset and its manifest row in the same commit.
2. Re-run the upload pipeline to drop the S3 object.
3. Open a follow-up to swap in a replacement asset.

The removal commit message must reference this document and the
specific provenance row that was retired.
