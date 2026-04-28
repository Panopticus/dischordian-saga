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

/** Section 9 — A response button the player can use to reply to an
 *  Elara mystery narration. */
export interface MysteryResponseChoice {
  /** Stable manifest key, e.g. "human.cryo.dead-pod.look.acknowledge". */
  id: string;
  /** Short button text (≤ 6 words). */
  label: string;
  /** Optional Elara follow-up VO id played after the human responds. */
  elaraFollowUpVoId?: string;
  /** Inline follow-up text used when the manifest entry hasn't been
   *  generated yet. Falls back to VO when both are present. */
  elaraFollowUpText?: string;
  /** Optional codex/lore entry logged on this branch. */
  logsClue?: Clue;
  /** When true, dismiss the popup instead of waiting on a follow-up. */
  closesDialog?: boolean;
}

/** Response produced by a (verb, hotspot) pair. */
export interface VerbResponse {
  /** Text Elara or the scene narrator delivers. */
  narration: string;
  /** Optional VO audio URL — legacy one-off escape hatch. Prefer
   *  `voId` (manifest key) for new content. */
  vo?: string;
  /** Section 9 — stable manifest id for the narration's audio. When
   *  set, the runtime calls useElaraVO().speak(voId) so the popup
   *  carries Elara's actual voice. */
  voId?: string;
  /** Section 9 — player response choices surfaced after the narration
   *  ends. Empty/undefined falls through to the default 3-button
   *  strip in ElaraConversationPopup. */
  responses?: MysteryResponseChoice[];
  /** Clue to log (idempotent — re-logging a clue is a no-op). */
  logsClue?: Clue;
  /** Inventory item to grant (idempotent — re-granting is a no-op). */
  grantsInventory?: CryoMysteryInventoryId;
  /** Narrative flag to set on success. */
  setsFlag?: string;
  /** Door / exit to unlock (runtime maps this to the room system). */
  unlocksExit?: "medical-bay";
  /** When true, the hotspot is removed from the scene after this verb
   *  fires. Used for one-shot pickups (data-slate `use`, locket pickup)
   *  so they don't stay clickable after the player has pocketed them. */
  consumesHotspot?: boolean;
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
      voId: "elara.cryo.dead-pod.look",
      logsClue: {
        id: "clue-dead-pod-occupant",
        title: "A pod that shouldn't be occupied",
        body:
          "One of the cryogenic pods is dark. An occupant is visible through the condensation. No crew manifest on file lists them as a passenger for this wake-cycle.",
        source: "cryo-bay",
        order: 0,
      },
      setsFlag: "cryo_mystery_first_clue_found",
      responses: [
        {
          id: "human.cryo.dead-pod.look.acknowledge",
          label: "Noted.",
          closesDialog: true,
        },
        {
          id: "human.cryo.dead-pod.look.who",
          label: "Who's in there?",
          elaraFollowUpVoId: "elara.cryo.dead-pod.look.who",
          elaraFollowUpText:
            "I don't know yet. The manifest line for that pod is wiped — and that's not a corruption pattern, that's a delete. Someone reached into my records.",
        },
        {
          id: "human.cryo.dead-pod.look.suspect",
          label: "Whoever did this is still aboard.",
          elaraFollowUpVoId: "elara.cryo.dead-pod.look.suspect",
          elaraFollowUpText:
            "That's the assumption I'm working with. Don't say it out loud past this room.",
        },
      ],
    },
    use: {
      narration:
        "The pod is sealed. You try the emergency release; the panel next to it is cracked and unresponsive. You are not opening this from out here.",
      voId: "elara.cryo.dead-pod.use",
    },
    talk: {
      narration:
        "There is no one to talk to inside the pod. You knock twice anyway. Nothing answers. You did not expect it would.",
      voId: "elara.cryo.dead-pod.talk",
    },
  },
  "cracked-panel": {
    look: {
      narration:
        "The pod's control panel is split along a hairline seam. A slow lavender arc crawls between the halves. The fracture runs through the emergency-release relay specifically. This was not an accident — someone reached in with a tool.",
      voId: "elara.cryo.cracked-panel.look",
      logsClue: {
        id: "clue-cracked-panel",
        title: "Sabotaged emergency release",
        body:
          "The dead pod's control panel has been cut precisely through its emergency-release relay. Whoever did this wanted the occupant to stay sealed — or wanted the release to fail when the operative tried it.",
        source: "cryo-bay",
        order: 1,
      },
      setsFlag: "cryo_mystery_first_clue_found",
      responses: [
        {
          id: "human.cryo.cracked-panel.look.acknowledge",
          label: "So it's sabotage.",
          closesDialog: true,
        },
        {
          id: "human.cryo.cracked-panel.look.tool",
          label: "What kind of tool?",
          elaraFollowUpVoId: "elara.cryo.cracked-panel.look.tool",
          elaraFollowUpText:
            "Something with a precision arc-cutter — engineering grade. Not a weapon. Whoever did this had time, and they had access to the toolkit on Deck 3.",
        },
      ],
    },
    use: {
      narration:
        "You try to hotwire the relay around the cut. It arcs once and dies. You'd need a proper fabricator. The bulkhead door at the far end is not going to open from here.",
      voId: "elara.cryo.cracked-panel.use",
    },
  },
  "medical-chart": {
    look: {
      narration:
        "A printed medical chart is magnet-clipped to the pod's exterior. Pre-wake biometrics. The name-line is redacted with a single neat pen stroke — not a system redaction, a human one. The blood chemistry panel is intact.",
      voId: "elara.cryo.medical-chart.look",
      logsClue: {
        id: "clue-redacted-chart",
        title: "A redacted medical chart",
        body:
          "The dead pod's medical chart shows an intact biometric panel but the name-line has been manually struck through. The blood chemistry carries trace markers Elara cannot match — something unusual about the occupant.",
        source: "cryo-bay",
        order: 2,
      },
      setsFlag: "cryo_mystery_first_clue_found",
      responses: [
        {
          id: "human.cryo.medical-chart.look.acknowledge",
          label: "Got it.",
          closesDialog: true,
        },
        {
          id: "human.cryo.medical-chart.look.markers",
          label: "What markers?",
          elaraFollowUpVoId: "elara.cryo.medical-chart.look.markers",
          elaraFollowUpText:
            "Trace iron-bond signatures that don't sit cleanly in the DeMagi or Quarchon ranges. Either we have a Ne-Yon hybrid in this pod or something the database didn't expect.",
        },
      ],
    },
    use: {
      narration:
        "You lift the chart off its magnet. The adhesive backing is still tacky — it was placed here recently. You put it back so whoever left it won't know you looked.",
      voId: "elara.cryo.medical-chart.use",
    },
  },
  "personal-effect": {
    look: {
      narration:
        "A small object has fallen under the pod housing. A tarnished silver locket, hinge stiff. The photograph inside is too scratched to read — but someone carried this through the Fall of Realities and into a cryo-sleep specifically so it would survive with them.",
      voId: "elara.cryo.personal-effect.look",
      grantsInventory: "silver-locket",
      consumesHotspot: true,
      responses: [
        {
          id: "human.cryo.personal-effect.look.acknowledge",
          label: "I'll keep it.",
          closesDialog: true,
        },
        {
          id: "human.cryo.personal-effect.look.who",
          label: "Whose was it?",
          elaraFollowUpVoId: "elara.cryo.personal-effect.look.who",
          elaraFollowUpText:
            "I can't tell you yet. The photograph is too damaged to image-match. But the metalwork is hand-finished — that's a personal piece, not standard issue.",
        },
      ],
    },
  },
  "data-slate": {
    look: {
      narration:
        "Wedged under the pod housing is the edge of a data-slate. It's broken, but you can see the fracture-light of a live screen still reading beneath the cracks. This was meant to be missed.",
      voId: "elara.cryo.data-slate.look",
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
      responses: [
        {
          id: "human.cryo.data-slate.look.acknowledge",
          label: "I see it.",
          closesDialog: true,
        },
        {
          id: "human.cryo.data-slate.look.hidden",
          label: "Why was it hidden?",
          elaraFollowUpVoId: "elara.cryo.data-slate.look.hidden",
          elaraFollowUpText:
            "Because someone wanted the next person who walked in here to miss it. They didn't expect that person to be you.",
        },
      ],
    },
    use: {
      narration:
        "You pocket the data-slate. Its screen survives the move. It is now yours.",
      voId: "elara.cryo.data-slate.use",
      grantsInventory: "data-slate-fragment",
      consumesHotspot: true,
      responses: [
        {
          id: "human.cryo.data-slate.use.acknowledge",
          label: "Got it.",
          closesDialog: true,
        },
        {
          id: "human.cryo.data-slate.use.next",
          label: "Where do I read it?",
          elaraFollowUpVoId: "elara.cryo.data-slate.use.next",
          elaraFollowUpText:
            "The bio-bed in the Medical Bay has an autopsy console. It can read external slates. Take it there.",
        },
      ],
    },
  },
  "frosted-glass": {
    look: {
      narration:
        "The dead pod's glass is frosted from the inside. You wipe a small oval clear with your sleeve. Cord dangling from the occupant's collar. ID tag cord, cleanly cut — the tag itself is not on them. Someone wanted them nameless.",
      voId: "elara.cryo.frosted-glass.look",
      grantsInventory: "torn-id-tag",
      responses: [
        {
          id: "human.cryo.frosted-glass.look.acknowledge",
          label: "Nameless on purpose.",
          closesDialog: true,
        },
        {
          id: "human.cryo.frosted-glass.look.cord",
          label: "Cleanly cut means what?",
          elaraFollowUpVoId: "elara.cryo.frosted-glass.look.cord",
          elaraFollowUpText:
            "It means a blade, calmly applied. Not a struggle. Whoever did this had time, and they had the body's cooperation — or its inability to refuse.",
        },
      ],
    },
  },
  "med-bay-door": {
    look: {
      narration:
        "Reinforced bulkhead. Red-lit seal. 'Medical Bay' stencil, paint worn. You'll need a reason for the door to think you should pass through it.",
      voId: "elara.cryo.med-bay-door.look",
    },
    use: {
      narration:
        "The door is sealed. The status console demands a reason. It will accept a clue logged in the case file as a reason.",
      voId: "elara.cryo.med-bay-door.use",
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

export const CRYO_MYSTERY_COMBINES: readonly CombineRule[] = [
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
  for (const rule of CRYO_MYSTERY_COMBINES) {
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
