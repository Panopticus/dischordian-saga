#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   WIRE ORPHAN VO LINES INTO THE SOURCE PIPELINE

   The `vo:audit-orphans` audit surfaces VO ids that the
   client speaks via Elara's hook but have no source entry
   in any `*-lines.json` voice bank. Without a source entry,
   the strip / regenerate pipeline can't refresh the audio,
   so producer cue cards baked into the original prompt stay
   in the MP3 forever.

   This script wires the known orphans into
   `apps/scripts/elara-lines.json` so they enter the
   pipeline. It does NOT touch the manifest — to actually
   re-render against the clean text, follow the steps
   printed at the end. Idempotent — re-running adds nothing
   if the ids already exist.

   Two clusters today:

     • character_sheet_intro_1..5
         Source text is canonical: lives in
         apps/client/src/pages/CharacterSheetPage.tsx as the
         ELARA_INTRO_LINES constant. We mirror it here so
         both the on-screen narration and the VO render from
         the same words.

     • feature_<id>  (8 entries)
         Spoken by FeatureUnlockToast.tsx via
         `speak(\`feature_${next.featureId}\`)`. There is no
         canonical text — the original audio was authored
         one-off and the prompt is lost. The stub below
         seeds short placeholder text; replace with proper
         writing before re-rendering or the player will hear
         the stubs.

   Usage:
     pnpm vo:wire-orphan-sources              # apply
     pnpm vo:wire-orphan-sources --dry        # report only
   ═══════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LINES_PATH = path.join(__dirname, "elara-lines.json");
const DRY = process.argv.includes("--dry");

interface PendingEntry {
  id: string;
  text: string;
  context: string;
  emotion: string;
  file: string;
  /** Producer-facing note describing why the line is here.
   *  Read by the audit but not the TTS pipeline. */
  authoredFrom?: string;
  [k: string]: unknown;
}

const PENDING: PendingEntry[] = [
  // ── character_sheet_intro_1..5 ──
  //
  // Source: apps/client/src/pages/CharacterSheetPage.tsx
  //         (ELARA_INTRO_LINES, lines 330-336)
  // Played one beat per typewriter step via
  //   speakElaraIntro(`character_sheet_intro_${narrativeStep + 1}`)
  // when the player arrives at /character-sheet?from=awakening.
  {
    id: "character_sheet_intro_1",
    text: "Neural scan complete. Your biometric profile has been compiled, Operative.",
    context: "character_sheet_intro",
    emotion: "warm",
    file: "client/src/pages/CharacterSheetPage.tsx",
    authoredFrom: "ELARA_INTRO_LINES[0]",
  },
  {
    id: "character_sheet_intro_2",
    text: "This is your dossier — everything we know about what you are. Your species markers, your class aptitudes, your elemental affinity. I'll surface the rest as you need it.",
    context: "character_sheet_intro",
    emotion: "warm",
    file: "client/src/pages/CharacterSheetPage.tsx",
    authoredFrom: "ELARA_INTRO_LINES[1]",
  },
  {
    id: "character_sheet_intro_3",
    text: "I've cross-referenced your readings against the Ark's historical database. You are not a small signal. The Prophecy may have been right about you.",
    context: "character_sheet_intro",
    emotion: "warm",
    file: "client/src/pages/CharacterSheetPage.tsx",
    authoredFrom: "ELARA_INTRO_LINES[2]",
  },
  {
    id: "character_sheet_intro_4",
    text: "Sit with this. Let it be true for a moment. The deck plates outside this room remember things you don't, and you'll need to remember some of them back.",
    context: "character_sheet_intro",
    emotion: "warm",
    file: "client/src/pages/CharacterSheetPage.tsx",
    authoredFrom: "ELARA_INTRO_LINES[3]",
  },
  {
    id: "character_sheet_intro_5",
    text: "When you're ready — the Cryo Bay door is open. Walk through. I'll stay with you.",
    context: "character_sheet_intro",
    emotion: "warm",
    file: "client/src/pages/CharacterSheetPage.tsx",
    authoredFrom: "ELARA_INTRO_LINES[4]",
  },

  // ── feature_* (8 stubs) ──
  //
  // Spoken by apps/client/src/components/FeatureUnlockToast.tsx
  //   speak(`feature_${next.featureId}`)
  // Triggered when a player crosses a featureRoadmap.ts gate that
  // has VO authored. The S3 audio for these eight features was
  // generated one-off and the prompt is lost. The stubs below get
  // them into the pipeline; rewrite each `text` before the next
  // `vo:everything` run or the player will hear the stub verbatim.
  {
    id: "feature_casino",
    text: "The Degen's Casino is open. Ne-Yon space rewards a steady hand — and punishes a greedy one.",
    context: "feature_unlock",
    emotion: "warm",
    file: "client/src/components/FeatureUnlockToast.tsx",
    authoredFrom: "STUB — rewrite before re-rendering",
  },
  {
    id: "feature_faction_wars",
    text: "Faction Wars are live. Pick your alignment carefully; the ledger remembers.",
    context: "feature_unlock",
    emotion: "warm",
    file: "client/src/components/FeatureUnlockToast.tsx",
    authoredFrom: "STUB — rewrite before re-rendering",
  },
  {
    id: "feature_guild",
    text: "Syndicates have opened to you. You don't have to do this alone — most people don't.",
    context: "feature_unlock",
    emotion: "warm",
    file: "client/src/components/FeatureUnlockToast.tsx",
    authoredFrom: "STUB — rewrite before re-rendering",
  },
  {
    id: "feature_medical_games",
    text: "The Combat Simulator is online in the Medical Bay. Practice without consequence — the consequences arrive later.",
    context: "feature_unlock",
    emotion: "warm",
    file: "client/src/components/FeatureUnlockToast.tsx",
    authoredFrom: "STUB — rewrite before re-rendering",
  },
  {
    id: "feature_music",
    text: "The Observation Deck has unlocked the music archives. Some of these transmissions remember things the rest of us don't.",
    context: "feature_unlock",
    emotion: "warm",
    file: "client/src/components/FeatureUnlockToast.tsx",
    authoredFrom: "STUB — rewrite before re-rendering",
  },
  {
    id: "feature_necromancer",
    text: "The Necromancer's gate is open. Be careful what you bring back. Some things prefer the dark.",
    context: "feature_unlock",
    emotion: "warm",
    file: "client/src/components/FeatureUnlockToast.tsx",
    authoredFrom: "STUB — rewrite before re-rendering",
  },
  {
    id: "feature_transmissions",
    text: "Secret transmissions are now accessible. The Ark has been collecting these for longer than I can say honestly.",
    context: "feature_unlock",
    emotion: "warm",
    file: "client/src/components/FeatureUnlockToast.tsx",
    authoredFrom: "STUB — rewrite before re-rendering",
  },
  {
    id: "feature_violetta",
    text: "Violetta has stepped into view. She'll have her own opinions about how this goes.",
    context: "feature_unlock",
    emotion: "warm",
    file: "client/src/components/FeatureUnlockToast.tsx",
    authoredFrom: "STUB — rewrite before re-rendering",
  },
];

interface LineEntry {
  id: string;
  text: string;
  context?: string;
  emotion?: string;
  file?: string;
  [k: string]: unknown;
}

function main() {
  const raw = fs.readFileSync(LINES_PATH, "utf8");
  const lines = JSON.parse(raw) as LineEntry[];
  if (!Array.isArray(lines)) {
    console.error(`elara-lines.json is not an array; aborting`);
    process.exit(1);
  }
  const existingIds = new Set(lines.map(l => l.id));

  const toAdd = PENDING.filter(p => !existingIds.has(p.id));
  const skipped = PENDING.filter(p => existingIds.has(p.id));

  console.log(`Pending: ${PENDING.length} — toAdd: ${toAdd.length}, skipped (already present): ${skipped.length}${DRY ? "  (dry run)" : ""}`);
  for (const p of skipped) console.log(`  already present: ${p.id}`);
  for (const p of toAdd) console.log(`  adding:          ${p.id}  ${p.authoredFrom ? `← ${p.authoredFrom}` : ""}`);

  if (toAdd.length === 0) {
    console.log("\nNothing to do.");
    return;
  }

  if (!DRY) {
    lines.push(...toAdd);
    fs.writeFileSync(LINES_PATH, JSON.stringify(lines, null, 2) + "\n", "utf8");
    console.log(`\nWrote ${toAdd.length} entries to ${path.relative(process.cwd(), LINES_PATH)}.`);
  }

  console.log(`\nNext steps to actually refresh the audio:`);
  console.log(`  1. Review the stub text for any feature_* entries (apps/scripts/wire-orphan-vo-sources.ts).`);
  console.log(`  2. pnpm vo:invalidate-stripped   # not strictly needed, but cheap`);
  console.log(`  3. Delete the orphan manifest entries by id:`);
  for (const p of toAdd) {
    console.log(`       jq 'del(."${p.id}")' apps/shared/elaraVoManifest.json | sponge apps/shared/elaraVoManifest.json`);
  }
  console.log(`     (or use a small node script; sponge is from moreutils.)`);
  console.log(`  4. pnpm vo:everything            # regenerates against the new clean text`);
  console.log(`  5. git commit elara-lines.json + elaraVoManifest.json + this script.`);
}

main();
