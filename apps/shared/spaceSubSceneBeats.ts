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

  // ─── Remaining vehicles (2) ───
  [
    "veh.cades_apc",
    {
      board: {
        prose:
          "The CADES APC's interior smells of welded scars and re-applied paint — every dent has a story Cades will not tell. The manufacturer's serial under the dashboard is the original; the brand over it is hers. The harness fits you because Cades expected you.",
        continueVerb: "Strap in",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "veh.pet_transport",
    {
      board: {
        prose:
          "The pet transport is louder than its engines suggest. Something behind the lattice rebreather grille is humming a tune from a saga older than the Ark. Find a seat that isn't taken; most seats are taken.",
        continueVerb: "Find a seat",
      },
    },
  ],

  // ─── Castle of Death — remaining 16 chambers ───
  [
    "dest.castle_of_death.cod01_entrance_hall",
    {
      investigate_chamber: {
        prose:
          "The Entrance Hall is the Necromancer's threshold rite. Black marble. Antler chandelier. The first chamber any guest sees, and the last one most remember clearly. Cross slowly — the floor catalogues your weight.",
        continueVerb: "Cross",
      },
    },
  ],
  [
    "dest.castle_of_death.cod02_poison_kitchen",
    {
      investigate_chamber: {
        prose:
          "The Poison Kitchen's copper pots simmer with recipes that have outlived their cooks. The staff are exceedingly polite. The sample-tasting tradition is alive and well; do not refuse the offered spoon.",
        continueVerb: "Take the spoon",
      },
    },
  ],
  [
    "dest.castle_of_death.cod03_mirror_gallery",
    {
      investigate_chamber: {
        prose:
          "The Mirror Gallery's glass does not all show the present. The third frame from the left shows you arriving. The seventh shows you leaving. The mirror you cannot find is the one that shows what happened between.",
        continueVerb: "Avoid your own eye",
      },
    },
  ],
  [
    "dest.castle_of_death.cod04_clocktower_mechanism",
    {
      investigate_chamber: {
        prose:
          "The Clocktower's brass gears the size of carriages turn a clock that has not kept correct time in centuries. The hour it shows is the hour someone died. The hour it shows now is one you have not lived through yet.",
        continueVerb: "Read the hour",
      },
    },
  ],
  [
    "dest.castle_of_death.cod05_flooded_dungeon",
    {
      investigate_chamber: {
        prose:
          "Knee-deep water. Walls greened with algae. The cells are still locked — from the inside. Whoever last occupied each cell decided the water was preferable to the door.",
        continueVerb: "Wade",
      },
    },
  ],
  [
    "dest.castle_of_death.cod06_throne_room",
    {
      investigate_chamber: {
        prose:
          "The Throne Room's black-iron seat is surrounded by twelve empty chairs. The Necromancer hosts council here when the Castle decides it wants advice. The Castle has not asked for your advice yet. It is, however, listening.",
        continueVerb: "Wait",
      },
    },
  ],
  [
    "dest.castle_of_death.cod08_torture_garden",
    {
      investigate_chamber: {
        prose:
          "Hedges grown into instruments. The flowers bloom on a calendar of confession. The gardener bows once and waits for you to choose which row to walk. Choose a row that already has footprints; the others are starts.",
        continueVerb: "Take the footprint row",
      },
    },
  ],
  [
    "dest.castle_of_death.cod09_ballroom_of_bones",
    {
      investigate_chamber: {
        prose:
          "The Ballroom of Bones. Femur chandeliers. An orchestra that never stops. The waltzes are very old; the dancers very patient. The seat reserved for new arrivals has your name carved into the chair-back. The carving is fresh.",
        continueVerb: "Find your seat",
      },
    },
  ],
  [
    "dest.castle_of_death.cod10_observatory_of_doom",
    {
      investigate_chamber: {
        prose:
          "The Observatory of Doom is a telescope pointed at futures nobody asked to see. The log shelf is longer than the room. The latest entry includes your full name and the next four things you will do — if you bother to read it before you do them.",
        continueVerb: "Read the latest entry",
      },
    },
  ],
  [
    "dest.castle_of_death.cod12_alchemy_lab",
    {
      investigate_chamber: {
        prose:
          "The Alchemy Lab is the careful disorder of someone trying and failing at immortality. The fume hood is older than the Castle. The recipe on the chalkboard is missing one ingredient; the recipe knows which one.",
        continueVerb: "Read the chalkboard",
      },
    },
  ],
  [
    "dest.castle_of_death.cod13_armory_of_legends",
    {
      investigate_chamber: {
        prose:
          "The Armory of Legends. Weapons retired from the hands of heroes. The Castle's wards keep the swords from singing — most of the time. The blade on the third rack hums when you approach. It does not hum for anyone else.",
        continueVerb: "Approach the third rack",
      },
    },
  ],
  [
    "dest.castle_of_death.cod15_music_room",
    {
      investigate_chamber: {
        prose:
          "The Music Room's harpsichord plays itself when nobody is listening. Servants leave bowls of seed out for the keys. You can sit at the bench, but the harpsichord will pretend not to notice; that is the etiquette.",
        continueVerb: "Sit at the bench",
      },
    },
  ],
  [
    "dest.castle_of_death.cod16_servants_quarters",
    {
      investigate_chamber: {
        prose:
          "The Servants' Quarters. Narrow rooms. Crisp bedclothes. The staff sleep in shifts the living would call unkind. Do not assume they are asleep.",
        continueVerb: "Tread softly",
      },
    },
  ],
  [
    "dest.castle_of_death.cod17_greenhouse_of_carnivores",
    {
      investigate_chamber: {
        prose:
          "The Greenhouse of Carnivores. Pitcher plants the size of barrels. Humidity that has its own opinion. The gardener counts visitors out as well as in. The count today does not yet include you.",
        continueVerb: "Enter the heat",
      },
    },
  ],
  [
    "dest.castle_of_death.cod18_chapel_of_false_saints",
    {
      investigate_chamber: {
        prose:
          "The Chapel of False Saints. Stained glass in colors that should not exist. The saints depicted never lived. The pews are warm in winter and cold in summer; the pew that is wrong for the season is the one waiting for you.",
        continueVerb: "Find the wrong pew",
      },
    },
  ],
  [
    "dest.castle_of_death.cod19_portrait_gallery",
    {
      investigate_chamber: {
        prose:
          "The Portrait Gallery. Generations of the Castle's masters, eyes following the wrong direction. The Necromancer's portrait is always the most recent and never finished. Today, the brushstrokes are still wet.",
        continueVerb: "Look at the wet paint",
      },
    },
  ],

  // ─── Crucible — remaining 12 arenas ───
  [
    "dest.crucible.cr02_void_ring",
    {
      enter_arena: {
        prose:
          "The Void Ring is a circular platform suspended in nothing. Gravity is a tactical variable here. The crowd is at infinity. The crowd is patient.",
        continueVerb: "Step onto the platform",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr03_acid_gardens",
    {
      enter_arena: {
        prose:
          "The Acid Gardens — foliage that bites back. Win conditions include 'still breathing.' The leaves rustle in a chemistry you cannot smell yet but will.",
        continueVerb: "Step between the rows",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr04_clockwork_maze",
    {
      enter_arena: {
        prose:
          "The Clockwork Maze. Walls rotate on a schedule the arena's bookmakers have memorized. Contenders memorize too, slower. The schedule for tonight has a deliberate inversion; the bookmakers know which corridor closes early.",
        continueVerb: "Enter the maze",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr05_shadow_cathedral",
    {
      enter_arena: {
        prose:
          "The Shadow Cathedral. A consecrated ruin where the light only falls where the Crucible decides. Crowd noise funnels by architecture. The acoustic favors quiet contenders.",
        continueVerb: "Enter the dark nave",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr06_frozen_colosseum",
    {
      enter_arena: {
        prose:
          "The Frozen Colosseum. Ice underfoot. Breath in the air. The audience layered in furs. The contender's heat is the only weather the arena knows; warm yourself by moving.",
        continueVerb: "Step onto the ice",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr07_volcanic_forge",
    {
      enter_arena: {
        prose:
          "The Volcanic Forge. A pit ringed with active vents. The bouts here are short for reasons of supply rather than skill. The match-clock is the vent's pressure gauge.",
        continueVerb: "Watch the gauge",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr08_gravity_well",
    {
      enter_arena: {
        prose:
          "The Gravity Well. Every step a calculation. The contender who stops thinking falls fastest. The well does not care which way is down — it cares which way you decided.",
        continueVerb: "Pick a down",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr09_mirror_dimension",
    {
      enter_arena: {
        prose:
          "The Mirror Dimension doubles its opponents and halves its mercy. You meet yourself. The mirror has a slight delay; whichever of you flinches first explains a great deal about the other.",
        continueVerb: "Meet yourself",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr10_storm_spire",
    {
      enter_arena: {
        prose:
          "The Storm Spire. A platform at the lip of a constant storm. Lightning takes the slow. The bookmakers' first wager is which contender remembers to keep moving.",
        continueVerb: "Move",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr11_bone_garden",
    {
      enter_arena: {
        prose:
          "The Bone Garden is floored with the cleaned remains of the failed. The Crucible's archivists insist this is decoration. The archivists are technically correct.",
        continueVerb: "Cross the bone path",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr13_crystal_cavern",
    {
      enter_arena: {
        prose:
          "The Crystal Cavern stages a bout in echo. Sound is a weapon and a tell. The cavern's resonance reveals which contender's heart is louder. Yours is.",
        continueVerb: "Listen",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],
  [
    "dest.crucible.cr14_shipwreck_graveyard",
    {
      enter_arena: {
        prose:
          "The Shipwreck Graveyard. Footing changes per round; the hulls were arranged by a curator with a sense of pacing. The hull you're standing on now is the one with the most-ringed deck-bell. Ring it before you fight.",
        continueVerb: "Ring the bell",
        continueRoute: "/duelyst-pvp",
      },
    },
  ],

  // ─── Tower Defense — remaining 8 positions ───
  [
    "dest.tower_defense.td01_iron_fortress",
    {
      begin_defense: {
        prose:
          "The Iron Fortress is the first defended position the campaign asks you to hold. Walls high. Gate narrow. Courtyard small enough to know every face. The garrison are veterans of holding rooms slightly larger than they prefer.",
        continueVerb: "Hold the gate",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.tower_defense.td02_frozen_pass",
    {
      begin_defense: {
        prose:
          "The Frozen Pass remembers every army that crossed it. Snow buries the noise of approach. Your scouts report nothing because the snow ate the report.",
        continueVerb: "Set the line",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.tower_defense.td03_jungle_temple",
    {
      begin_defense: {
        prose:
          "The Jungle Temple is half-perimeter, half-vegetation. Resupply lines are spoken of in past tense. The temple's name in the old tongue is 'place where the jungle agrees not to enter'. The agreement is being renegotiated.",
        continueVerb: "Take the keep",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.tower_defense.td04_void_station",
    {
      begin_defense: {
        prose:
          "The Void Station — orbital. Thirty seconds of air between hull breach and resolution. The defenders rotate often because the defenders need to. Yours is the rotation arriving on shift.",
        continueVerb: "Take the rotation",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.tower_defense.td05_clockwork_city",
    {
      begin_defense: {
        prose:
          "The Clockwork City rebuilds between waves. The city's engineers were once attackers and remember the angles. They have prepared kindly bottlenecks for the new arrivals.",
        continueVerb: "Hold the bottleneck",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.tower_defense.td06_necropolis",
    {
      begin_defense: {
        prose:
          "The Necropolis is held in the name of the buried. The defenders are not always all currently alive. The garrison roll-call includes seven names you cannot ask after; they will answer anyway when their position is called.",
        continueVerb: "Answer roll",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.tower_defense.td08_toxic_swamp",
    {
      begin_defense: {
        prose:
          "The Toxic Swamp is defended by terrain. The atmosphere is a counterattack. Your rebreathers are calibrated for the wrong toxin; this is intentional, and a story you will be told if you survive long enough to ask.",
        continueVerb: "Take the high ground",
        continueRoute: "/terminus-swarm",
      },
    },
  ],
  [
    "dest.tower_defense.td09_crystal_mines",
    {
      begin_defense: {
        prose:
          "The Crystal Mines. A defended industrial site. The mineshafts double as kill-corridors when the wave comes for the ore. The ore prefers being mined; that is to its advantage, and yours.",
        continueVerb: "Walk the shaft",
        continueRoute: "/terminus-swarm",
      },
    },
  ],

  // ─── Trade Empire — remaining 7 sectors ───
  [
    "dest.trade_empire.te02_iron_bazaar",
    {
      visit_sector: {
        prose:
          "The Iron Bazaar is built around the ore that built the Empire. Bidding is loud. The smelters never close. The price on tonight's board is one Locke considers fair, which means it is.",
        continueVerb: "Bid",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.trade_empire.te03_silk_nebula_port",
    {
      visit_sector: {
        prose:
          "The Silk Nebula Port docks the longest haulers. Customs is conducted in seven dialects and three accents of silence. Your manifest is recognized at the gate; the gate has been waiting for someone with your manifest.",
        continueVerb: "Clear customs",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.trade_empire.te05_crystal_exchange",
    {
      visit_sector: {
        prose:
          "The Crystal Exchange — the Empire's hardest currency, traded by hand. The traders count by feel. Your hand has not learned the count yet; the hand learns by being closed around the wrong number first.",
        continueVerb: "Hold a crystal",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.trade_empire.te06_void_market",
    {
      visit_sector: {
        prose:
          "The Void Market — a floating market on the dark side of a gas giant. Reputation precedes you and never quite catches up. The first stall you visit is the stall that decides which reputation arrived.",
        continueVerb: "Approach the first stall",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.trade_empire.te07_garden_world_agri",
    {
      visit_sector: {
        prose:
          "The Garden-World feeds three sectors. The fields are large enough to have weather. The farmer at the bay-door has a clipboard with your face on it; the photo is from a previous loop.",
        continueVerb: "Sign the clipboard",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.trade_empire.te08_fuel_refinery",
    {
      visit_sector: {
        prose:
          "The Fuel Refinery's burn-off lights the local night. Trade in fuel is brief and never sentimental. The transaction you came to make has already been priced, twice — once by Locke, once by the Refinery; the second price is the one that matters.",
        continueVerb: "Take the second price",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],
  [
    "dest.trade_empire.te10_resort_world",
    {
      visit_sector: {
        prose:
          "The Resort World is a planet zoned for leisure. The Empire's traders honeymoon here and convalesce here. The pool you are walking past contains a trader who is doing both at once.",
        continueVerb: "Walk past the pool",
        continueRoute: "/trade-empire/hub",
      },
    },
  ],

  // ─── Quiz Show — remaining 2 set pieces ───
  [
    "dest.quiz_show.qs02_lightning_round_chamber",
    {
      take_the_stage: {
        prose:
          "The Lightning Round Chamber. The clock is faster than your pulse intends. The host's smile is contractual. The buzzer in front of you was pressed earlier tonight by someone whose name the audience cannot remember.",
        continueVerb: "Reach for the buzzer",
      },
    },
  ],
  [
    "dest.quiz_show.qs03_bonus_vault",
    {
      take_the_stage: {
        prose:
          "The Bonus Vault. A room of doors that open onto small fortunes. The Palimpsest encourages contestants who choose well not to choose again. The door already chosen for you is the one with the slight breeze under it.",
        continueVerb: "Take the breezy door",
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
    s === "take_the_stage" ||
    s === "enter_hellbox" ||
    s === "matrix_dive"
  );
}
