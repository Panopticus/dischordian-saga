/**
 * Space sub-scene beats.
 *
 * When the player clicks an actionable hotspot in BridgedSpacePage
 * (board / enter_zone / investigate_chamber / etc.), the modal
 * offers a "Step inside" link to /space/:canonicalId/:action. This
 * file is the registry of category-aware narrative beats those
 * pages render — a short, evocative paragraph in the voice that
 * matches the space's anchor NPC.
 *
 * Beats are intentionally short (2–3 sentences). The full diegetic
 * content lives in the loredex entry's bio; the beat is the
 * approach-moment, the breath before the room receives you.
 *
 * Per-zone bespoke beats can shadow the category beat by listing
 * the canonical id in PER_SPACE_BEATS. Otherwise the resolver falls
 * back to the category-action template.
 */

/** Action verbs the resolver understands. Mirrors the hotspot
 *  primary actions authored in roomHotspotManifest.ts. */
export type SubSceneAction =
  | "board"
  | "investigate_chamber"
  | "enter_arena"
  | "begin_defense"
  | "visit_sector"
  | "take_the_stage";

/** Beat shape. */
export interface SpaceSubSceneBeat {
  /** Short prose paragraph rendered as the sub-scene body. */
  readonly prose: string;
  /** Verb shown on the "Continue" button (defaults to "Continue"). */
  readonly continueVerb?: string;
}

/* ═══════════════════════════════════════════════════════
   CATEGORY × ACTION DEFAULTS
   The default beats below cover the typical paths through the
   bridged spaces. Per-space overrides go in PER_SPACE_BEATS.
   ═══════════════════════════════════════════════════════ */

const VEHICLE_BOARD_BEAT: SpaceSubSceneBeat = {
  prose:
    "The hatch unseals. The interior smells the way every vessel's interior smells the first ten seconds — recycled air, rebreather seal, the cold patience of metal that has waited for you. Settle in. The ship knows you now.",
  continueVerb: "Settle in",
};

const CASTLE_OF_DEATH_BEAT: SpaceSubSceneBeat = {
  prose:
    "You cross the threshold. The chamber receives you without comment. Somewhere in the architecture the Necromancer has already filed your arrival — patient, archival, mildly amused. The room is older than the death it contains. Walk softly.",
  continueVerb: "Walk softly",
};

const CRUCIBLE_BEAT: SpaceSubSceneBeat = {
  prose:
    "The arena's lights notice you before the crowd does. The viral swarm registers a pattern it has filed before — not your body, your tempo. The Source whispers: the room is rooting for the part of you that survives. Fight well.",
  continueVerb: "Step into the ring",
};

const TOWER_DEFENSE_BEAT: SpaceSubSceneBeat = {
  prose:
    "The perimeter is yours. The garrison has already moved aside. Somewhere in the strategic logs your name is the line that was missing. Hold what you came to hold.",
  continueVerb: "Take command",
};

const TRADE_EMPIRE_BEAT: SpaceSubSceneBeat = {
  prose:
    "The market notices a trader it has prepared for. Locke would say the handshake was already in your file. Walk the floor. Prices remember you.",
  continueVerb: "Walk the floor",
};

const QUIZ_SHOW_BEAT: SpaceSubSceneBeat = {
  prose:
    "The light hits you from above. Somewhere — perhaps the Backstage Green Room, perhaps the host's earpiece — a producer mouths the cue. The Meme broadcasts your arrival with delight. The question is already loaded. Take a breath.",
  continueVerb: "Take the stage",
};

/** Default beat by (canonical prefix or category, action). */
function defaultBeat(
  canonicalSpaceId: string,
  action: SubSceneAction,
): SpaceSubSceneBeat | null {
  if (canonicalSpaceId.startsWith("veh.") && action === "board") {
    return VEHICLE_BOARD_BEAT;
  }
  if (canonicalSpaceId.startsWith("dest.castle_of_death.")) {
    if (action === "investigate_chamber") return CASTLE_OF_DEATH_BEAT;
  }
  if (canonicalSpaceId.startsWith("dest.crucible.")) {
    if (action === "enter_arena") return CRUCIBLE_BEAT;
  }
  if (canonicalSpaceId.startsWith("dest.tower_defense.")) {
    if (action === "begin_defense") return TOWER_DEFENSE_BEAT;
  }
  if (canonicalSpaceId.startsWith("dest.trade_empire.")) {
    if (action === "visit_sector") return TRADE_EMPIRE_BEAT;
  }
  if (canonicalSpaceId.startsWith("dest.quiz_show.")) {
    if (action === "take_the_stage") return QUIZ_SHOW_BEAT;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════
   PER-SPACE OVERRIDES
   Bespoke beats for spaces whose anchor NPC or canon weight
   warrants something sharper than the category default.
   ═══════════════════════════════════════════════════════ */

const PER_SPACE_BEATS: ReadonlyMap<
  string,
  Partial<Record<SubSceneAction, SpaceSubSceneBeat>>
> = new Map([
  [
    "veh.memorial_hearse",
    {
      board: {
        prose:
          "You climb into a vehicle built to carry the dead. The Antiquarian has noted, in a margin somewhere, that the hearse has lately been carrying the reset — those who came back from elsewhere. The seat is warm. It has not been your seat before, but it remembers your weight.",
        continueVerb: "Sit with it",
      },
    },
  ],
  [
    "veh.eidolon_vessel",
    {
      board: {
        prose:
          "The helm receives you and then, very briefly, corrects you. You were not the one who flinched; your Eidolon was. The ship is bonded — to both of you — and it would like you to know it noticed.",
        continueVerb: "Cede the helm",
      },
    },
  ],
  [
    "dest.castle_of_death.cod20_final_chamber_throne",
    {
      investigate_chamber: {
        prose:
          "The Castle's deepest seat. Twelve empty chairs. The Necromancer's portrait, in the gallery you passed, was unfinished — that was its way of telling you who would sit here next. The chair is plain. Decide whether you sit or stand.",
        continueVerb: "Decide",
      },
    },
  ],
  [
    "dest.crucible.cr01_iron_pit",
    {
      enter_arena: {
        prose:
          "The Iron Pit is the Crucible's introduction. Sand, walls, two doors. The crowd is patient — they have seen this gate open many times — but the patience is not for you. It is for whatever leaves through the other door.",
        continueVerb: "Step onto the sand",
      },
    },
  ],
  [
    "dest.quiz_show.qs01_main_stage",
    {
      take_the_stage: {
        prose:
          "The Main Stage is bright enough to forget yourself in. The host's smile does not waver. The clock starts when you reach the mark — not before, not after. Somewhere the Bonus Vault has already chosen a door for you. The first question is already loaded.",
        continueVerb: "Take the mark",
      },
    },
  ],
]);

/**
 * Resolve a sub-scene beat for (canonicalSpaceId, action). Returns
 * null when no beat applies — caller renders a generic fallback.
 */
export function spaceSubSceneBeat(
  canonicalSpaceId: string,
  action: SubSceneAction,
): SpaceSubSceneBeat | null {
  const perSpace = PER_SPACE_BEATS.get(canonicalSpaceId);
  if (perSpace && perSpace[action]) return perSpace[action] ?? null;
  return defaultBeat(canonicalSpaceId, action);
}

/** Type guard for the action enum. */
export function isSubSceneAction(s: string): s is SubSceneAction {
  return (
    s === "board" ||
    s === "investigate_chamber" ||
    s === "enter_arena" ||
    s === "begin_defense" ||
    s === "visit_sector" ||
    s === "take_the_stage"
  );
}
