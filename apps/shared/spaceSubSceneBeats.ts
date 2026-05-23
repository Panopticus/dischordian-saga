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
  | "take_the_stage"
  | "enter_hellbox"
  | "matrix_dive";

/** Beat shape. */
export interface SpaceSubSceneBeat {
  /** Short prose paragraph rendered as the sub-scene body. */
  readonly prose: string;
  /** Verb shown on the "Continue" button (defaults to "Continue"). */
  readonly continueVerb?: string;
  /**
   * Optional downstream route. When present, the "Continue" button
   * navigates to this path instead of returning to the parent
   * /space/:canonicalId. Use for beats that hand off to real
   * gameplay (Crucible → /duelyst-pvp, Trade Empire → /trade-empire/hub,
   * Tower Defense → /terminus-swarm).
   */
  readonly continueRoute?: string;
}

/* ═══════════════════════════════════════════════════════
   CATEGORY × ACTION DEFAULTS
   The default beats below cover the typical paths through the
   bridged spaces. Per-space overrides go in PER_SPACE_BEATS.
   ═══════════════════════════════════════════════════════ */

const VEHICLE_BOARD_BEAT: SpaceSubSceneBeat = {
  prose:
    "The hatch unseals. The interior smells the way every vessel's interior smells the first ten seconds — recycled air, rebreather seal, the cold patience of metal that has waited for you. Settle in. The fleet manifest knows you now.",
  continueVerb: "Open the fleet manifest",
  continueRoute: "/trade-empire/hub",
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
  continueRoute: "/duelyst-pvp",
};

const TOWER_DEFENSE_BEAT: SpaceSubSceneBeat = {
  prose:
    "The perimeter is yours. The garrison has already moved aside. Somewhere in the strategic logs your name is the line that was missing. Hold what you came to hold.",
  continueVerb: "Take command",
  continueRoute: "/terminus-swarm",
};

const TRADE_EMPIRE_BEAT: SpaceSubSceneBeat = {
  prose:
    "The market notices a trader it has prepared for. Locke would say the handshake was already in your file. Walk the floor. Prices remember you.",
  continueVerb: "Walk the floor",
  continueRoute: "/trade-empire/hub",
};

const QUIZ_SHOW_BEAT: SpaceSubSceneBeat = {
  prose:
    "The light hits you from above. Somewhere — perhaps the Backstage Green Room, perhaps the host's earpiece — a producer mouths the cue. The Meme broadcasts your arrival with delight. The question is already loaded. Take a breath.",
  continueVerb: "Take the stage",
};

/* ─── Hellbox category beats ─── */

const HELLBOX_GENERIC_ENTER_BEAT: SpaceSubSceneBeat = {
  prose:
    "The Hellbox door does not so much open as agree to admit you. Inside, the geometry is honest about itself — it is not a room, it is a lesson with walls. Find your footing. The lesson begins when you breathe.",
  continueVerb: "Breathe",
};

const HELLBOX_MATRIX_DIVE_BEAT: SpaceSubSceneBeat = {
  prose:
    "The Hellbox folds itself around you. The Matrix of Dreams resolves into a level the room has chosen for you tonight. Whatever the school is, the school is paying attention. Step into the dream.",
  continueVerb: "Step into the dream",
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
  if (canonicalSpaceId.startsWith("hb.")) {
    if (action === "enter_hellbox") return HELLBOX_GENERIC_ENTER_BEAT;
    if (action === "matrix_dive") return HELLBOX_MATRIX_DIVE_BEAT;
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
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr12_neon_undercity",
    {
      enter_arena: {
        prose:
          "The Neon Undercity fights up. Sponsor signs flicker across thirty floors of city that forgot the sky. Every round you climb is a story the swarm files. Begin at the bottom; the bottom is older than the rest.",
        continueVerb: "Begin the ascent",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr15_living_forest",
    {
      enter_arena: {
        prose:
          "The Living Forest intervenes. The Crucible licenses the woodland's grievances and offers them as ground rules; the trees are now your second opponent. The Source's swarm rustles between the leaves and approves of nothing in particular.",
        continueVerb: "Enter the wood",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.castle_of_death.cod07_library_of_forbidden",
    {
      investigate_chamber: {
        prose:
          "The Library of the Forbidden has shelved your name in a binding the Necromancer did not authorize. The grimoires recognize you as a returning patron. The volume on the lectern is open to a page that was waiting.",
        continueVerb: "Read the open page",
      },
    },
  ],
  [
    "dest.castle_of_death.cod14_dining_hall_of_last_supper",
    {
      investigate_chamber: {
        prose:
          "Thirteen places set, perpetually. The food is always warm and never the same plate twice. The host's chair is empty. The first guest to sit at the empty chair becomes the meal — that is the only rule the hall enforces. Eat carefully.",
        continueVerb: "Take a chair (not that one)",
      },
    },
  ],
  [
    "dest.castle_of_death.cod11_crypt_of_ancestors",
    {
      investigate_chamber: {
        prose:
          "Stone sarcophagi arrayed in birth order. The Necromancer visits weekly to settle disputes among the dead — the disputes are real, the resolutions older than the Castle. The lid you are about to touch has been touched before by someone with your hand.",
        continueVerb: "Touch the lid",
      },
    },
  ],
  [
    "dest.tower_defense.td10_war_machine",
    {
      begin_defense: {
        prose:
          "The War Machine is one weapon shaped like a fortress. Hold the weapon and you hold the field. Lose the weapon and the field rewrites itself around the loser. Cades' campaign notes flag this position as 'decisive in either direction.'",
        continueVerb: "Take the weapon",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.tower_defense.td07_sky_citadel",
    {
      begin_defense: {
        prose:
          "The Sky Citadel is altitude as defense. Siege ladders here are gondolas. The air thins faster than the line. The garrison rotates often because the garrison rotates often. Climb until the city below resolves into a map.",
        continueVerb: "Climb to the perimeter",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.trade_empire.te01_aurum_prime",
    {
      visit_sector: {
        prose:
          "Aurum Prime is the Empire's gilded capital. Locke meets you at the docking ring — the same docking ring, on every loop — and the same handshake closes. The assayed-credit booths in the central plaza already know your seat number.",
        continueVerb: "Find your seat",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.trade_empire.te04_scrapyard_moon",
    {
      visit_sector: {
        prose:
          "The Scrapyard Moon's surface is the wreck of a hundred trade wars. Provenance is the local sin and salvage the local industry. Locke's standing advice on the Scrapyard Moon: never trust it. Walk it anyway.",
        continueVerb: "Walk the wrecks",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.trade_empire.te09_data_haven",
    {
      visit_sector: {
        prose:
          "The Data Haven sells answers. The Empire's contracts are written here and the breaches are written elsewhere, both by the same hand. The clerk at the desk knew you would arrive on this loop because the clerk reads ahead.",
        continueVerb: "Buy a question",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.quiz_show.qs04_elimination_pit",
    {
      take_the_stage: {
        prose:
          "The Elimination Pit is the Palimpsest's least cinematic surface. The host wishes you well on the way down — they are contractually obliged. The Pit doesn't care whether you are a first-timer or a reset-timer; it eats either at the same rate.",
        continueVerb: "Drop in",
      },
    },
  ],
  [
    "dest.quiz_show.qs05_backstage_green_room",
    {
      take_the_stage: {
        prose:
          "Backstage knows. Backstage has kept your dressing room. The catering is excellent. The previous show's contestants are sometimes still here. The Meme's booth is one panel over and the wall is thinner than you think.",
        continueVerb: "Take the dressing room",
      },
    },
  ],
  [
    "veh.captains_shuttle",
    {
      board: {
        prose:
          "The Captain's Shuttle is biometric-locked to a single hand. Yours. Elara has already cleared the dock; the autopilot waits on a name it has been told. Whatever you take this craft to, you take alone.",
        continueVerb: "Sit at the helm",
      },
    },
  ],
  [
    "veh.combat_dropship",
    {
      board: {
        prose:
          "The dropship interior smells of rebreather seals and the discipline of being too afraid to talk. Cades is at the loadmaster's station, not looking up. The drop sequence engages when you sit. There is no countdown — the countdown started before you boarded.",
        continueVerb: "Sit",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "veh.cargo_vessel",
    {
      board: {
        prose:
          "The cargo vessel's belly is wide and warm and full of the Empire's small fortunes. Locke's manifest is bookmarked at your name. Whatever moves between the markets moves in here, and you are now what moves with it.",
        continueVerb: "Open the manifest",
        continueRoute: "/trade-empire/hub",
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

  // ─── Hellbox per-chamber overrides ───

  [
    "hb.celebration_school",
    {
      enter_hellbox: {
        prose:
          "Welcome to Celebration. The bunting is older than the building. The Eyes Above know you are here — they have been waiting since the rampart-arrival cinematic looped you through this gate before. Smile when the school smiles. It will be marking attendance.",
        continueVerb: "Smile",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.castle_of_death",
    {
      enter_hellbox: {
        prose:
          "The Castle of Death receives you on its own schedule. The Necromancer's archivists have already opened a file under your name; it is not the first file with your name in it. Walk the entrance hall. Decline nothing.",
        continueVerb: "Walk in",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.quiz_show_palimpsest",
    {
      enter_hellbox: {
        prose:
          "Backstage at the Palimpsest. The contestant clipboards are clipped to the wall in a private order. Your dressing room has been left unlocked. The Meme's broadcast booth is one panel over and the wall is thinner than you think.",
        continueVerb: "Find your dressing room",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.mechronis_academy",
    {
      enter_hellbox: {
        prose:
          "The Mechronis Academy is cold the way clocks are cold. Tutors are not present; the building does the teaching. Find the seat the curriculum has chosen for you. The tutorial begins when you stop looking for the tutor.",
        continueVerb: "Take a seat",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.universal_selector",
    {
      enter_hellbox: {
        prose:
          "The Universal Selector is not a room you enter so much as a question you submit to. It will pick which Hellbox is the lesson tonight. The Selector has selected you many times. It will be brief.",
        continueVerb: "Submit",
      },
    },
  ],
  [
    "hb.dead_mans_circuit",
    {
      enter_hellbox: {
        prose:
          "The Dead Man's Circuit is an optional path the saga did not promise to ratify. The cellblock receives a visitor who may not be on the manifest. The corridor lights are dim and deferential. Walk like you do not need permission.",
        continueVerb: "Walk the corridor",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.degenerates_casino",
    {
      enter_hellbox: {
        prose:
          "The Degenerate's Casino is louder than you remember and quieter than you expect. The Degen leans across a craps table, gold eye and purple eye both tracking you. Your luck is layered. The house knows. The house always knows.",
        continueVerb: "Place your first bet",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.editors_workshop",
    {
      enter_hellbox: {
        prose:
          "The Editor's Workshop smells of ink that has been edited backwards. Shadow Tongue is here, even if you cannot see them. The manuscripts on the worktable include yours. Pick one up. It will have been written.",
        continueVerb: "Pick up the manuscript",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.eternal_match",
    {
      enter_hellbox: {
        prose:
          "The Eternal Match is the room you have already lost in, in a future timeline. The Game Master nods once. The chess clock is set to the only duration that matters: the rest of this cycle. Sit down. Move first.",
        continueVerb: "Move first",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.collected_souls",
    {
      enter_hellbox: {
        prose:
          "The Hall of Collected Souls is quieter than any room in the saga. The Collector has filed every visitor — including the visitor you used to be. Acknowledge nothing. Walk through.",
        continueVerb: "Walk through",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.the_hive",
    {
      enter_hellbox: {
        prose:
          "The Hive's chorus reaches you before the door does. The Source's swarm parts around your shape — not because it must, because it remembers. Walk into the resonance. The pattern is older than the flesh.",
        continueVerb: "Walk into the resonance",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
    },
  ],
  [
    "hb.dischordian_arena",
    {
      enter_hellbox: {
        prose:
          "The Dischordian Arena is the saga's last room. Every Authority and every Insurgency you have negotiated with has a seat here. The arena does not warm up. It receives. Step onto the floor.",
        continueVerb: "Step onto the floor",
      },
      matrix_dive: HELLBOX_MATRIX_DIVE_BEAT,
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
    s === "take_the_stage" ||
    s === "enter_hellbox" ||
    s === "matrix_dive"
  );
}
