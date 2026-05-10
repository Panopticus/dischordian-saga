/* ═══════════════════════════════════════════════════════
   ACT → NARRATIVE FACTION mapping

   Each act has a signature antagonist faction per
   `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md` §3.3 and
   `docs/built/LORE_BIBLE.md`. This module is the single
   source of truth — surfaces that want a per-act faction
   plate (the act ladder pages, the Witnessing Hub entry
   cards, the seal-epigraph cinematic, etc.) consume this
   helper instead of duplicating the conditional.

   Rationale:
   - Act 1 · "THE FALL"        → authority   (Cycle C boss is The Authority)
   - Act 2 · "THE WHISPER"     → hierarchy   (Shadow Tongue's propaganda is Hierarchy doctrine)
   - Act 3 · "THE OFFER"       → hierarchy   (the bargain is the Hierarchy archon's pitch)
   - Act 4 · "THE REVELATION"  → watcher     (the unveiling is the Watcher's witnessing)
   - Act 5 · "THE MAP"         → dreamer     (the star map is the Dreamer's geography)
   - Act 6 · "THE CONFESSION"  → insurgency  (confession ≡ liberation through truth)
   - Act 7 · "THE CONVERGENCE" → mechronis   (Architect returns at the Mechronis core)

   `actFaction(act)` returns a `CharacterSheetBackground`
   (the seven-faction set the May 2026 producer drop
   ships plates for). Returns null for act 0 / unknown.
   ═══════════════════════════════════════════════════════ */

import type { CharacterSheetBackground } from "./aaaArtArchive";

export type NarrativeAct = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const ACT_FACTION: Readonly<Record<NarrativeAct, CharacterSheetBackground>> = {
  1: "authority",
  2: "hierarchy",
  3: "hierarchy",
  4: "watcher",
  5: "dreamer",
  6: "insurgency",
  7: "mechronis",
};

export function actFaction(act: number): CharacterSheetBackground | null {
  if (act < 1 || act > 7) return null;
  return ACT_FACTION[act as NarrativeAct];
}

/** Every act → faction pair, as tuples. Used by the parity test
 *  and any UI that wants to render the act-faction ladder. */
export function allActFactionPairs(): ReadonlyArray<readonly [NarrativeAct, CharacterSheetBackground]> {
  return (Object.entries(ACT_FACTION) as Array<[string, CharacterSheetBackground]>).map(
    ([k, v]) => [Number(k) as NarrativeAct, v],
  );
}
