/* ═══════════════════════════════════════════════════════
   CRYO BAY MYSTERY — opening puzzle data (plan §F)

   LucasArts-style verb + inventory matrix for the very first
   room. One of the pods holds a body that shouldn't be there;
   the operative solves it before the Med Bay doorway opens.

   Verbs are intentionally limited to Look / Use / Talk (per
   plan). "Use" can optionally target a second hotspot or an
   inventory item (combine). The Clue Journal is seeded here —
   the first logged clue fires `sheet_known_clues`, which is how
   the Character Sheet's Clue Journal row appears in nav.

   Runtime contract:
     - GameContext.clueJournal is a flat Clue[] keyed by id.
     - GameContext.inventory (PointAndClickScene-specific,
       separate from the existing itemsCollected list) stores
       InventoryItem ids the player has collected here.
     - narrativeFlags.cryo_mystery_first_clue_found flips the
       instant ANY clue is logged; the Med Bay bulkhead unlocks
       off this single flag (per plan).
     - narrativeFlags.cryo_mystery_victim_identified flips when
       the ID tag and data-slate are combined.
   ═══════════════════════════════════════════════════════ */

// Verb / VERB_LIST are canonical in the generic room-mystery
// template so every room module shares one shape. Re-exported
// here so existing imports of `@shared/cryoBayMystery` keep
// resolving the same names.
import type { Verb as TemplateVerb } from "./roomMysteries/_template";
export { VERB_LIST } from "./roomMysteries/_template";
export type Verb = TemplateVerb;

/** Hotspot ids for the Section F cryo-bay scene. */
export type CryoMysteryHotspotId =
  | "dead-pod"
  | "cracked-panel"
  | "medical-chart"
  | "personal-effect"
  | "data-slate"
  | "frosted-glass"
  | "med-bay-door";

/** Inventory items discoverable in this scene. */
export type CryoMysteryInventoryId =
  | "data-slate-fragment"
  | "torn-id-tag"
  | "unlabeled-vial"
  | "silver-locket";

export interface Clue {
  id: string;
  title: string;
  /** Short descriptive body — goes into the Clue Journal. */
  body: string;
  /** Where the clue was logged — used by the Journal UI grouping. */
  source: "cryo-bay";
  /** Ordinal (0-based) in which clues land, for Act ordering. */
  order: number;
}

export interface InventoryItem {
  id: CryoMysteryInventoryId;
  name: string;
  description: string;
}

/** Response produced by a (verb, hotspot) pair. */
export interface VerbResponse {
  /** Text Elara or the scene narrator delivers. */
  narration: string;
  /** Clue to log (idempotent — re-logging a clue is a no-op). */
  logsClue?: Clue;
  /** Inventory item to grant (idempotent — re-granting is a no-op). */
  grantsInventory?: CryoMysteryInventoryId;
  /** Narrative flag to set on success. */
  setsFlag?: string;
  /** Door / exit to unlock (runtime maps this to the room system). */
  unlocksExit?: "medical-bay";
}

/* ─── Inventory catalog ─── */

export const CRYO_MYSTERY_INVENTORY: Readonly<
  Record<CryoMysteryInventoryId, InventoryItem>
> = {
  "data-slate-fragment": {
    id: "data-slate-fragment",
    name: "Cracked Data Slate",
    description:
      "A palm-sized slate pried from beneath the dark pod. The screen is spiderwebbed but still flickers — a half-decoded crew manifest entry.",
  },
  "torn-id-tag": {
    id: "torn-id-tag",
    name: "Torn ID Tag",
    description:
      "A brass-edged identification tag, cord cleanly cut. The serial is intact; the name-line is torn away — deliberately.",
  },
  "unlabeled-vial": {
    id: "unlabeled-vial",
    name: "Unlabeled Vial",
    description:
      "A small glass vial of shimmering black liquid, unlabeled. Its molecular signature matches nothing in Elara's database. This is what the Med Bay device is asking about.",
  },
  "silver-locket": {
    id: "silver-locket",
    name: "Tarnished Silver Locket",
    description:
      "A small oval locket, tarnished, hinge stiff. Inside: a photograph chip, so scratched the face is no longer legible.",
  },
};

/* ─── Verb × hotspot response matrix ─── */

/**
 * Per hotspot, responses keyed by verb. Omitted (verb, hotspot) pairs
 * fall back to a single "nothing happens" narration at runtime.
 */
export const CRYO_MYSTERY_RESPONSES: Readonly<
  Record<CryoMysteryHotspotId, Partial<Record<Verb, VerbResponse>>>
> = {
  "dead-pod": {
    look: {
      narration:
        "The pod's status indicator is cold-blue instead of the warm-gold of the others. The glass is frosted over on the inside. Something — someone — is in there. You can't see a face. Just a shape.",
      logsClue: {
        id: "clue-dead-pod-occupant",
        title: "A pod that shouldn't be occupied",
        body:
          "One of the cryogenic pods is dark. An occupant is visible through the condensation. No crew manifest on file lists them as a passenger for this wake-cycle.",
        source: "cryo-bay",
        order: 0,
      },
      setsFlag: "cryo_mystery_first_clue_found",
    },
    use: {
      narration:
        "The pod is sealed. You try the emergency release; the panel next to it is cracked and unresponsive. You are not opening this from out here.",
    },
    talk: {
      narration:
        "There is no one to talk to inside the pod. You knock twice anyway. Nothing answers. You did not expect it would.",
    },
  },
  "cracked-panel": {
    look: {
      narration:
        "The pod's control panel is split along a hairline seam. A slow lavender arc crawls between the halves. The fracture runs through the emergency-release relay specifically. This was not an accident — someone reached in with a tool.",
      logsClue: {
        id: "clue-cracked-panel",
        title: "Sabotaged emergency release",
        body:
          "The dead pod's control panel has been cut precisely through its emergency-release relay. Whoever did this wanted the occupant to stay sealed — or wanted the release to fail when the operative tried it.",
        source: "cryo-bay",
        order: 1,
      },
      setsFlag: "cryo_mystery_first_clue_found",
    },
    use: {
      narration:
        "You try to hotwire the relay around the cut. It arcs once and dies. You'd need a proper fabricator. The bulkhead door at the far end is not going to open from here.",
    },
  },
  "medical-chart": {
    look: {
      narration:
        "A printed medical chart is magnet-clipped to the pod's exterior. Pre-wake biometrics. The name-line is redacted with a single neat pen stroke — not a system redaction, a human one. The blood chemistry panel is intact.",
      logsClue: {
        id: "clue-redacted-chart",
        title: "A redacted medical chart",
        body:
          "The dead pod's medical chart shows an intact biometric panel but the name-line has been manually struck through. The blood chemistry carries trace markers Elara cannot match — something unusual about the occupant.",
        source: "cryo-bay",
        order: 2,
      },
      setsFlag: "cryo_mystery_first_clue_found",
    },
    use: {
      narration:
        "You lift the chart off its magnet. The adhesive backing is still tacky — it was placed here recently. You put it back so whoever left it won't know you looked.",
    },
  },
  "personal-effect": {
    look: {
      narration:
        "A small object has fallen under the pod housing. A tarnished silver locket, hinge stiff. The photograph inside is too scratched to read — but someone carried this through the Fall of Realities and into a cryo-sleep specifically so it would survive with them.",
      grantsInventory: "silver-locket",
    },
  },
  "data-slate": {
    look: {
      narration:
        "Wedged under the pod housing is the edge of a data-slate. It's broken, but you can see the fracture-light of a live screen still reading beneath the cracks. This was meant to be missed.",
      grantsInventory: "data-slate-fragment",
      logsClue: {
        id: "clue-data-slate-hidden",
        title: "A data-slate hidden under the pod",
        body:
          "A cracked but still-live data-slate was wedged under the dead pod — deliberately hidden where a casual sweep would miss it. It flickers a partial crew-manifest entry with most fields redacted.",
        source: "cryo-bay",
        order: 3,
      },
      setsFlag: "cryo_mystery_first_clue_found",
    },
    use: {
      narration:
        "You pocket the data-slate. Its screen survives the move. It is now yours.",
      grantsInventory: "data-slate-fragment",
    },
  },
  "frosted-glass": {
    look: {
      narration:
        "The dead pod's glass is frosted from the inside. You wipe a small oval clear with your sleeve. Cord dangling from the occupant's collar. ID tag cord, cleanly cut — the tag itself is not on them. Someone wanted them nameless.",
      grantsInventory: "torn-id-tag",
    },
  },
  "med-bay-door": {
    look: {
      narration:
        "Reinforced bulkhead. Red-lit seal. 'Medical Bay' stencil, paint worn. You'll need a reason for the door to think you should pass through it.",
    },
    use: {
      narration:
        "The door is sealed. The status console demands a reason. It will accept a clue logged in the case file as a reason.",
      unlocksExit: "medical-bay",
    },
  },
};

/* ─── Inventory combine table ─── */

/**
 * `Use <item> on <target>` combinations. Both orderings of a combine
 * pair are resolved at lookup time in combineInventory() so callers
 * don't have to authr both directions.
 */
export interface CombineResult {
  narration: string;
  /** Replaces the original items with a single composite (optional). */
  producesInventory?: CryoMysteryInventoryId;
  /** Flag to set. */
  setsFlag?: string;
  /** Clue to log. */
  logsClue?: Clue;
  /** Door / exit to unlock. */
  unlocksExit?: "medical-bay";
  /** Consumes the source items (default: true for composites). */
  consumesItems?: boolean;
}

interface CombineRule {
  a: CryoMysteryInventoryId;
  b: CryoMysteryInventoryId;
  result: CombineResult;
}

const COMBINE_RULES: readonly CombineRule[] = [
  {
    a: "torn-id-tag",
    b: "data-slate-fragment",
    result: {
      narration:
        "You slot the torn tag against the data-slate's scanner. The slate flickers, runs through its half-decoded manifest, and settles on a single entry. A name. Rank. A cause of wake-failure that isn't a failure at all. The dead are yours to name now.",
      setsFlag: "cryo_mystery_victim_identified",
      unlocksExit: "medical-bay",
      consumesItems: false,
      logsClue: {
        id: "clue-victim-identified",
        title: "The victim, named",
        body:
          "The torn ID tag combined with the cracked data-slate produces a partial identification. The operative knows WHO died — but the WHY (who killed them, and for what) remains open. The case is still open.",
        source: "cryo-bay",
        order: 4,
      },
    },
  },
];

/** Look up a combine result regardless of argument order. */
export function combineInventory(
  a: CryoMysteryInventoryId,
  b: CryoMysteryInventoryId,
): CombineResult | null {
  for (const rule of COMBINE_RULES) {
    if (
      (rule.a === a && rule.b === b) ||
      (rule.a === b && rule.b === a)
    ) {
      return rule.result;
    }
  }
  return null;
}

/* ─── Exports ─── */

export const CRYO_MYSTERY_HOTSPOT_IDS: readonly CryoMysteryHotspotId[] = [
  "dead-pod",
  "cracked-panel",
  "medical-chart",
  "personal-effect",
  "data-slate",
  "frosted-glass",
  "med-bay-door",
];

/**
 * Resolve a (verb, hotspot) to a response. Returns null when the
 * pair has no authored reaction; runtime falls back to a default
 * "nothing happens" line.
 */
export function resolveVerbResponse(
  verb: Verb,
  hotspot: CryoMysteryHotspotId,
): VerbResponse | null {
  return CRYO_MYSTERY_RESPONSES[hotspot]?.[verb] ?? null;
}
