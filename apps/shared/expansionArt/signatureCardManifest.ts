/* ═══════════════════════════════════════════════════════
   SIGNATURE CARD ART MANIFEST

   Per-(archetype × doctrine motif) base art keys for
   apprenticeSignatureCard.signatureArtUrl(). The forge
   produces a URL of the shape:

     art/cards/signature/<archetype>_<motif>.webp#tint=<hex>&influence=<n>

   The renderer reads the fragment and applies live tinting
   on the base art. This file enumerates the (archetype,
   motif) base art slots that producers should fill (via the
   asset-upload pipeline). Until the actual webp files land,
   rendered cards fall back to a procedural placeholder.

   Coverage: 12 archetypes × 5 motifs = 60 base art keys.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "../apprentices";
import type { DoctrineId } from "../apprenticeDoctrines";

/**
 * The 5 doctrine motifs (matches DOCTRINES[doctrineId].signatureMotif).
 */
export type SignatureMotif =
  | "tuning_fork"      // compliant_mouth
  | "two_doors"        // forked_path
  | "iron_keyhole"     // cold_hand
  | "withheld_letter"  // heretical_quiet
  | "open_palm";       // human_remainder

const ARCHETYPES: readonly ApprenticeArchetype[] = [
  "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
  "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
];

const MOTIFS: readonly SignatureMotif[] = [
  "tuning_fork", "two_doors", "iron_keyhole", "withheld_letter", "open_palm",
];

const MOTIF_FROM_DOCTRINE: Record<DoctrineId, SignatureMotif> = {
  compliant_mouth: "tuning_fork",
  forked_path: "two_doors",
  cold_hand: "iron_keyhole",
  heretical_quiet: "withheld_letter",
  human_remainder: "open_palm",
};

export function motifFromDoctrine(doctrineId: DoctrineId): SignatureMotif {
  return MOTIF_FROM_DOCTRINE[doctrineId];
}

/* ─── Base art keys ─── */

/**
 * Stable art slot id for an (archetype, motif) pair. The slot is what
 * producers paint into; the renderer pulls the painted webp via the
 * CDN.
 */
export function signatureArtSlotId(archetype: ApprenticeArchetype, motif: SignatureMotif): string {
  return `${archetype}_${motif}`;
}

/**
 * The full enumerated set — 12 × 5 = 60 art slots. Used by the
 * asset-coverage parity gate to surface unfilled producer slots.
 */
export function listSignatureArtSlots(): { archetype: ApprenticeArchetype; motif: SignatureMotif; slotId: string; cdnPath: string }[] {
  const out: { archetype: ApprenticeArchetype; motif: SignatureMotif; slotId: string; cdnPath: string }[] = [];
  for (const archetype of ARCHETYPES) {
    for (const motif of MOTIFS) {
      const slotId = signatureArtSlotId(archetype, motif);
      out.push({
        archetype,
        motif,
        slotId,
        cdnPath: `art/cards/signature/${slotId}.webp`,
      });
    }
  }
  return out;
}

/**
 * Producer-facing description of a slot — the prompt + composition the
 * art team uses when generating each piece. Used by the production
 * spec doc + the asset prompt generator script.
 */
export interface SignatureArtSlotSpec {
  slotId: string;
  archetype: ApprenticeArchetype;
  motif: SignatureMotif;
  /** Composition prompt — what the painter starts from. */
  composition: string;
  /** Color band (anchored by motif), the renderer overlays per-card. */
  colorAnchor: string;
}

const ARCHETYPE_PROMPT: Record<ApprenticeArchetype, string> = {
  zealot:    "robed figure mid-recitation, hands flat against a lectern, eyes closed",
  ghost:     "figure half-faded into a doorway, only the silhouette of one shoulder visible",
  scholar:   "figure with a stack of books and an open ledger, glasses pushed up",
  revenant:  "figure with binding-cloth strips at the wrists, expression placid, faintly luminous",
  artisan:   "figure at a forge with a hammer down, one finished piece beside them",
  oracle:    "figure with eyes closed and one hand raised to the temple, fragmented light around",
  wanderer:  "figure with a road-pack and a coat too long, walking away from the viewer",
  martyr:    "figure offering an open hand with a gift in it, eyes downcast",
  heretic:   "figure with a folded letter held closed, gaze level at the viewer",
  jester:    "figure with a half-mask raised on one finger, the other hand resting on a chair-back",
  sentinel:  "figure standing in profile against an open doorway, one hand on the doorframe",
  prodigal:  "figure pausing on a threshold, one foot lifted, head turned over the shoulder",
};

const MOTIF_COMPOSITION: Record<SignatureMotif, string> = {
  tuning_fork:      "a tuning fork resonates above the figure's mouth, parallel lines radiating outward",
  two_doors:        "two doors open on either side of the figure, neither chosen, a hinge gleams between",
  iron_keyhole:     "an iron keyhole hovers over the figure's heart, the key already turned",
  withheld_letter:  "a folded letter is held closed in the figure's hand, sealed but not signed",
  open_palm:        "an open palm gestures toward the viewer with no object in it",
};

const MOTIF_COLOR: Record<SignatureMotif, string> = {
  tuning_fork:      "warm brass / amber — Mechronis-favored register",
  two_doors:        "dusk violet / threshold-gray",
  iron_keyhole:     "slate / lock-iron / quenched steel",
  withheld_letter:  "near-black / withheld",
  open_palm:        "warm tan / human-remainder",
};

export function getSignatureArtSlotSpec(slotId: string): SignatureArtSlotSpec | null {
  const slot = listSignatureArtSlots().find(s => s.slotId === slotId);
  if (!slot) return null;
  return {
    slotId,
    archetype: slot.archetype,
    motif: slot.motif,
    composition: `${ARCHETYPE_PROMPT[slot.archetype]}; ${MOTIF_COMPOSITION[slot.motif]}`,
    colorAnchor: MOTIF_COLOR[slot.motif],
  };
}

/**
 * Coverage helper for the parity gate — every (archetype, motif) cell
 * has a non-empty composition + color anchor.
 */
export function signatureArtSlotCoverage(): { slotId: string; complete: boolean }[] {
  return listSignatureArtSlots().map(s => {
    const spec = getSignatureArtSlotSpec(s.slotId);
    const complete = !!spec && !!spec.composition && spec.composition.length > 30 && !!spec.colorAnchor;
    return { slotId: s.slotId, complete };
  });
}
