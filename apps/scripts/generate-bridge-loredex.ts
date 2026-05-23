/**
 * Generate loredex stub entries for the 7 vehicles + 60 destination
 * zones bridged by `newArtRoomBridge.ts`. Outputs entries appended to
 * `apps/client/src/data/loredex-data.json`.
 *
 * Idempotent — re-running detects existing entries by id and skips
 * them. Safe to re-run after the producer adds more spaces.
 *
 * The bios are authored content (not templates that fail
 * contentIntegrity's stub-marker regex) — each one is a 1-2 sentence
 * diegetic description grounded in the canonical name.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { NEW_ART_BRIDGED_ROOMS } from "../shared/expansionArt/newArtRoomBridge";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOREDEX_PATH = resolve(
  __dirname,
  "../client/src/data/loredex-data.json",
);

/* ═══════════════════════════════════════════════════════
   VEHICLE BIOS — 7 entries
   Each vessel gets a name + a one-line dossier reading like a
   bridge-officer's log line.
   ═══════════════════════════════════════════════════════ */

const VEHICLE_BIOS: Record<
  string,
  { name: string; bio: string; connections: string[] }
> = {
  "veh.cades_apc": {
    name: "CADES APC",
    bio: "A captured Trade Empire assault crawler reflagged for the CADES strike teams. The hull still carries the manufacturer's serial scored over by Cades's brand.",
    connections: ["Cades", "Trade Empire"],
  },
  "veh.captains_shuttle": {
    name: "Captain's Shuttle",
    bio: "The bridge officer's personal craft. Compact, fast, keyed to a single biometric lock — by design unflyable by anyone but its captain.",
    connections: ["Elara", "The Ark"],
  },
  "veh.cargo_vessel": {
    name: "Trade Hub Cargo Vessel",
    bio: "A wide-bellied freighter that runs the Trade Empire sectors. Whatever moves between the markets moves in one of these.",
    connections: ["Locke", "Trade Empire"],
  },
  "veh.combat_dropship": {
    name: "Combat Dropship",
    bio: "An assault transport built for hot insertions. The interior smells of rebreather seals and the discipline of being too afraid to talk.",
    connections: ["The Human", "Cades"],
  },
  "veh.pet_transport": {
    name: "Pet Transport Vessel",
    bio: "A converted scout boat outfitted for living cargo. Its cabin is louder than the engines.",
    connections: ["The Ark", "Pet Garden"],
  },
  "veh.eidolon_vessel": {
    name: "Eidolon Vessel",
    bio: "A ship whose substrate has bonded to its Eidolon. Pilots report the helm sometimes corrects them before they make the mistake.",
    connections: ["The Eidolon", "Companion Bond"],
  },
  "veh.memorial_hearse": {
    name: "Memorial Hearse",
    bio: "A vehicle built to carry the dead. The Antiquarian's ledgers note how often it now carries the reset — those who came back from elsewhere.",
    connections: ["The Antiquarian", "Memorial Corridor"],
  },
};

/* ═══════════════════════════════════════════════════════
   DESTINATION BIOS — 60 entries across 5 categories
   ═══════════════════════════════════════════════════════ */

const CASTLE_OF_DEATH_BIOS: Record<string, string> = {
  cod01_entrance_hall:
    "Black marble underfoot, a chandelier of antlers above. The first chamber any guest sees, and the last one any of them remember clearly.",
  cod02_poison_kitchen:
    "Copper pots simmering with recipes that have outlived their cooks. The Necromancer's kitchen staff are exceedingly polite.",
  cod03_mirror_gallery:
    "A corridor lined with looking-glasses that do not all show the present. Visitors avoid eye contact with their own reflections here.",
  cod04_clocktower_mechanism:
    "Brass gears the size of carriages turning a clock that has not kept correct time in centuries. The hour it shows is the hour someone died.",
  cod05_flooded_dungeon:
    "Knee-deep water, walls greened with algae. The cells are still locked from the inside.",
  cod06_throne_room:
    "A black-iron seat surrounded by twelve empty chairs. The Necromancer hosts council here when the Castle decides it wants advice.",
  cod07_library_of_forbidden:
    "A vault of grimoires the Castle's archivists swore not to read aloud. Some of the books still listen.",
  cod08_torture_garden:
    "Hedges grown into instruments. The flowers bloom on a calendar of confession.",
  cod09_ballroom_of_bones:
    "A dance hall where the chandeliers are femurs and the orchestra never stops. The waltzes are very old and the dancers very patient.",
  cod10_observatory_of_doom:
    "A telescope pointed at futures nobody asked to see. The observer's log shelf is longer than the room.",
  cod11_crypt_of_ancestors:
    "Stone sarcophagi arrayed in birth order. The Necromancer visits weekly to settle disputes among the dead.",
  cod12_alchemy_lab:
    "Glass vessels arranged with the careful disorder of someone trying to fail at immortality. The fume hood is older than the Castle.",
  cod13_armory_of_legends:
    "Weapons retired from the hands of heroes. The Castle's wards keep the swords from singing.",
  cod14_dining_hall_of_last_supper:
    "A long table set for thirteen, perpetually. The food is always warm and never the same plate twice.",
  cod15_music_room:
    "A harpsichord that plays itself when nobody is listening. Servants leave bowls of seed out for the keys.",
  cod16_servants_quarters:
    "Narrow rooms where the staff sleep in shifts the living would call unkind. The bedclothes are always crisp.",
  cod17_greenhouse_of_carnivores:
    "Pitcher plants the size of barrels, a humidity that lives. The gardener counts visitors out as well as in.",
  cod18_chapel_of_false_saints:
    "Stained glass depicting people who never existed in colors that should not exist. The pews are warm in winter and cold in summer.",
  cod19_portrait_gallery:
    "Generations of the Castle's masters, eyes following the wrong direction. The Necromancer's portrait is always the most recent and never finished.",
  cod20_final_chamber_throne:
    "The Castle's deepest seat. Anyone who reaches it learns whether the Necromancer asks them to sit or stand.",
};

const CRUCIBLE_BIOS: Record<string, string> = {
  cr01_iron_pit:
    "The Crucible's introductory arena. Sand, walls, two doors — one for the contender, one for whatever comes out the other side.",
  cr02_void_ring:
    "A circular platform suspended in nothing. Gravity is a tactical variable here.",
  cr03_acid_gardens:
    "Foliage that bites back. Win conditions include 'still breathing'.",
  cr04_clockwork_maze:
    "Walls that rotate on a schedule the arena's bookmakers have memorized. Contenders memorize too, slower.",
  cr05_shadow_cathedral:
    "A consecrated ruin where the light only falls where the Crucible decides. Crowd noise is funneled by the architecture.",
  cr06_frozen_colosseum:
    "Ice underfoot, breath in the air, the audience layered in furs. The contender's heat is the only weather the arena knows.",
  cr07_volcanic_forge:
    "A pit ringed with active vents. The bouts here are short for reasons of supply rather than skill.",
  cr08_gravity_well:
    "An arena calibrated to make every step a calculation. The contender who stops thinking falls fastest.",
  cr09_mirror_dimension:
    "An arena that doubles its opponents and halves its mercy. Contenders meet themselves and decide whose pride is heavier.",
  cr10_storm_spire:
    "A platform at the lip of a constant storm. Lightning takes the slow.",
  cr11_bone_garden:
    "An arena floored with the cleaned remains of the failed. The Crucible's archivists insist this is decoration.",
  cr12_neon_undercity:
    "A vertical bout in a city that forgot the sky. Sponsorship signs flicker in every fight.",
  cr13_crystal_cavern:
    "A bout staged in echo. Sound here is a weapon and a tell.",
  cr14_shipwreck_graveyard:
    "An arena built across hulls that never finished sinking. Footing changes per round.",
  cr15_living_forest:
    "Trees that intervene. The Crucible licenses the woodland's grievances and offers them as ground rules.",
};

const TOWER_DEFENSE_BIOS: Record<string, string> = {
  td01_iron_fortress:
    "The first defended position the campaign asks the player to hold. Walls high, gate narrow, courtyard small enough to know everyone in it.",
  td02_frozen_pass:
    "A mountain corridor that has remembered every army that crossed it. Snow buries the noise of approach.",
  td03_jungle_temple:
    "A defended ruin where the jungle is half the perimeter. Resupply lines are spoken of in past tense.",
  td04_void_station:
    "An orbital fortress with thirty seconds of air between hull breach and resolution. The defenders rotate often.",
  td05_clockwork_city:
    "A defensive grid that rebuilds itself between waves. The city's engineers were once attackers and remember.",
  td06_necropolis:
    "Held in the name of the buried. The defenders are not always all currently alive.",
  td07_sky_citadel:
    "A fortress at altitude. The siege ladders here are gondolas, and the air thins faster than the line.",
  td08_toxic_swamp:
    "Defended by terrain as much as by garrison. The atmosphere itself is a counterattack.",
  td09_crystal_mines:
    "A defended industrial site. The mineshafts double as kill-corridors when the wave comes for the ore.",
  td10_war_machine:
    "A defensive installation that is mostly a single weapon. Hold the weapon, hold the field.",
};

const TRADE_EMPIRE_BIOS: Record<string, string> = {
  te01_aurum_prime:
    "The Trade Empire's gilded capital. Streets paved with assayed credit and traders who price their own children.",
  te02_iron_bazaar:
    "A market built around the ore that built the Empire. Bidding here is loud and the smelters never close.",
  te03_silk_nebula_port:
    "A docking station for the longest haulers. Customs is conducted in seven dialects and three accents of silence.",
  te04_scrapyard_moon:
    "A satellite whose surface is the wreck of a hundred trade wars. Salvage is the local industry; provenance, the local sin.",
  te05_crystal_exchange:
    "The Empire's hardest currency, traded by hand. The traders here count by feel.",
  te06_void_market:
    "A floating market on the dark side of a gas giant. Reputation precedes you here and never quite catches up.",
  te07_garden_world_agri:
    "An agricultural colony that feeds three sectors. The fields are large enough to have weather of their own.",
  te08_fuel_refinery:
    "An orbital refinery whose burn-off lights the local night. Trade in fuel is brief and never sentimental.",
  te09_data_haven:
    "A sector that sells answers. The Empire's contracts are written here and the breaches are written elsewhere.",
  te10_resort_world:
    "A planet zoned entirely for leisure. The Empire's traders honeymoon here and convalesce here and occasionally retire here.",
};

const QUIZ_SHOW_BIOS: Record<string, string> = {
  qs01_main_stage:
    "The Quiz Show Palimpsest's bright box. Cameras count down where the lights stop, and the host's smile does not waver.",
  qs02_lightning_round_chamber:
    "A timed booth. The clock here is faster than the player's pulse intends.",
  qs03_bonus_vault:
    "A room of doors that open onto small fortunes. Contestants who choose well are encouraged not to choose again.",
  qs04_elimination_pit:
    "A drop chamber for the gracefully failed. The host is contractually obliged to wish them well.",
  qs05_backstage_green_room:
    "Where the contestants wait. The catering is excellent. The previous show's contestants are sometimes still here.",
};

/* ═══════════════════════════════════════════════════════
   ENTRY BUILDERS
   ═══════════════════════════════════════════════════════ */

interface LoredexEntry {
  id: string;
  type: string;
  name: string;
  aliases: string[];
  era: string;
  date_aa: string;
  date_ad: string;
  season: string;
  affiliation: string;
  status: string;
  bio: string;
  history: string;
  connections: string[];
  conexus_stories: unknown[];
  song_appearances: unknown[];
  image: string;
  priority: string;
  cluster: string;
}

function loredexIdFromCanonical(canonicalSpaceId: string): string {
  // dest.castle_of_death.cod01_entrance_hall → loredex_dest_castle_of_death_cod01_entrance_hall
  return `loredex_${canonicalSpaceId.replace(/\./g, "_")}`;
}

function buildVehicleEntry(canonicalSpaceId: string): LoredexEntry {
  const data = VEHICLE_BIOS[canonicalSpaceId];
  if (!data) throw new Error(`Missing vehicle bio for ${canonicalSpaceId}`);
  return {
    id: loredexIdFromCanonical(canonicalSpaceId),
    type: "artifact",
    name: data.name,
    aliases: [],
    era: "",
    date_aa: "",
    date_ad: "",
    season: "",
    affiliation: "",
    status: "",
    bio: data.bio,
    history: "",
    connections: data.connections,
    conexus_stories: [],
    song_appearances: [],
    image: "",
    priority: "normal",
    cluster: "vehicles",
  };
}

function buildDestinationEntry(canonicalSpaceId: string): LoredexEntry {
  // dest.<category>.<slug>
  const [, category, slug] = canonicalSpaceId.split(".");
  let bios: Record<string, string>;
  let categoryLabel: string;
  let connections: string[];
  switch (category) {
    case "castle_of_death":
      bios = CASTLE_OF_DEATH_BIOS;
      categoryLabel = "Castle of Death";
      connections = ["The Necromancer", "Castle of Death"];
      break;
    case "crucible":
      bios = CRUCIBLE_BIOS;
      categoryLabel = "Crucible";
      connections = ["The Source", "Crucible"];
      break;
    case "tower_defense":
      bios = TOWER_DEFENSE_BIOS;
      categoryLabel = "Tower Defense";
      connections = ["Cades", "Tower Defense"];
      break;
    case "trade_empire":
      bios = TRADE_EMPIRE_BIOS;
      categoryLabel = "Trade Empire";
      connections = ["Locke", "Trade Empire"];
      break;
    case "quiz_show":
      bios = QUIZ_SHOW_BIOS;
      categoryLabel = "Quiz Show";
      connections = ["The Meme", "Quiz Show Palimpsest"];
      break;
    default:
      throw new Error(`Unknown destination category: ${category}`);
  }
  const bio = bios[slug];
  if (!bio) throw new Error(`Missing bio for ${canonicalSpaceId}`);
  const niceName = slug
    .replace(/^(cod|cr|td|te|qs)\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: loredexIdFromCanonical(canonicalSpaceId),
    type: "location",
    name: `${categoryLabel} — ${niceName}`,
    aliases: [],
    era: "",
    date_aa: "",
    date_ad: "",
    season: "",
    affiliation: "",
    status: "",
    bio,
    history: "",
    connections,
    conexus_stories: [],
    song_appearances: [],
    image: "",
    priority: "normal",
    cluster: `destination_${category}`,
  };
}

/* ═══════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════ */

function main(): void {
  const raw = readFileSync(LOREDEX_PATH, "utf-8");
  const data = JSON.parse(raw) as { entries: LoredexEntry[]; [key: string]: unknown };
  const existing = new Set(data.entries.map((e) => e.id));
  const newEntries: LoredexEntry[] = [];

  for (const room of NEW_ART_BRIDGED_ROOMS) {
    let entry: LoredexEntry | null = null;
    if (room.category === "vehicle") {
      entry = buildVehicleEntry(room.canonicalSpaceId);
    } else if (room.category === "destination_subzone") {
      entry = buildDestinationEntry(room.canonicalSpaceId);
    }
    if (entry && !existing.has(entry.id)) {
      newEntries.push(entry);
      existing.add(entry.id);
    }
  }

  console.log(`Generated ${newEntries.length} new loredex entries.`);
  if (newEntries.length === 0) {
    console.log("Nothing to do (all entries already present).");
    return;
  }

  data.entries.push(...newEntries);
  // Keep file as JSON with 2-space indent (matching existing convention).
  writeFileSync(LOREDEX_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${newEntries.length} entries to ${LOREDEX_PATH}.`);
}

main();
