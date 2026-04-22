import { assetUrl } from "../client/src/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   THE MASCOTEERS

   The 12 Archons exist now in three forms:
     1. Their original selves (mostly dead, imprisoned, missing)
     2. Mechronis Professors — Architect-programmed simulacra
        that teach Potentials at Mechronis Academy
     3. MASCOTEERS — child-like versions reprogrammed by the
        Dreamer, now running Celebration under the Architect's
        nose

   The Mascoteers are the welcoming committee of Celebration.
   They are cheerful. They are wide-eyed. They are wrong.

   "Welcome to Celebration, where dreams don't always shine,
    Step lightly, wander carefully, and watch for every sign.
    The mascoteers are waiting, but be careful where you tread.
    Not every game is just for fun, not every word is said."

   Three Mascoteers are explicitly named in the Celebration
   verse ("Hear ye, hear ye…"): the Prince (Engineer), the
   Ninth (Game Master), the Human. The other nine were
   reprogrammed later — each bears a childhood-name mask.
   ═══════════════════════════════════════════════════════ */

export interface Mascoteer {
  id: string;
  /** Mascot name — childlike, playful surface */
  mascotName: string;
  /** Archon number this Mascoteer reprograms (1-12) */
  archonNumber: number;
  /** The original Archon being worn as a skin */
  originalArchon: string;
  /** Celebration-era alias (when Archons were first met as children) */
  celebrationAlias?: string;
  /** Child-form appearance */
  appearance: string;
  /** How they speak — playful surface */
  playSurface: string;
  /** What's underneath — Dreamer's secret teaching */
  hiddenTruth: string;
  /** The "game" they run — a daily trial Apprentices face */
  dailyGame: string;
  /** Kill method if an Apprentice fails their trial */
  failureMethod: string;
  /** Portrait image path (relative to /public) */
  portrait: string;
}

export const MASCOTEERS: Mascoteer[] = [
  {
    id: "the_conductor", mascotName: "Conni the Conductor",
    archonNumber: 1, originalArchon: "The CoNexus",
    appearance: "A child in a too-large conductor's coat, waving invisible wands at silent orchestras",
    playSurface: "Always gathering children into choirs and coordinated games",
    hiddenTruth: "Teaches Apprentices that they are instruments in someone else's song — and which song they belong to",
    dailyGame: "The Harmony Game — follow the unheard melody, stay in tune with the group",
    failureMethod: "Apprentices who break from the song are erased from the choir. Then from memory.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_conni.png"),
  },
  {
    id: "mr_unblink", mascotName: "Mr. Unblink",
    archonNumber: 2, originalArchon: "The Watcher", celebrationAlias: "Kanshi-sha",
    appearance: "A small child in a white mask with eyes painted open, never sleeping",
    playSurface: "Plays hide-and-seek but is always 'it' and always finds you",
    hiddenTruth: "Every Apprentice is watched always. Mr. Unblink teaches them to watch themselves first.",
    dailyGame: "The Looking Game — notice one thing no one else notices, before it notices you",
    failureMethod: "Apprentices who fail to see are seen. Public grading. Shame is the weapon.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_unblink.png"),
  },
  {
    id: "little_corey", mascotName: "Little Corey",
    archonNumber: 3, originalArchon: "The Collector", celebrationAlias: "Corey",
    appearance: "A child in a blue xenomorph party-mask carrying a jar of 'favorite things'",
    playSurface: "Trades toys with everyone — always leaves them wanting more",
    hiddenTruth: "Teaches Apprentices what their soul is worth by making them barter pieces of it",
    dailyGame: "The Trading Game — trade a memory for an advantage. The memory is gone.",
    failureMethod: "Apprentices who refuse to trade get nothing. Eventually they have nothing.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_corey.png"),
  },
  {
    id: "vernon", mascotName: "Vernon the Door-Finder",
    archonNumber: 4, originalArchon: "The Vortex", celebrationAlias: "Vernon",
    appearance: "Chubby child in an orange sun-shirt, holding many door-knobs, none attached to doors",
    playSurface: "Runs around opening doors that weren't there a moment ago",
    hiddenTruth: "Teaches Apprentices that reality is a room with more exits than they can count — and some lead nowhere",
    dailyGame: "The Door Game — choose a door. Don't look back to see if it was there.",
    failureMethod: "Apprentices who pick the wrong door don't fail. They just… aren't here anymore.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_vernon.png"),
  },
  {
    id: "minnie", mascotName: "Minnie",
    archonNumber: 5, originalArchon: "The Meme", celebrationAlias: "Minnie",
    appearance: "A constantly-changing child whose face updates with every laugh in the crowd",
    playSurface: "Leads the chants, the cheers, the 'Frens, frens, gather close'",
    hiddenTruth: "Teaches Apprentices that belief can be engineered and that they too will be engineered",
    dailyGame: "The Chant Game — start a rumor. See if it returns to you transformed.",
    failureMethod: "Apprentices who can't catch the wave get washed away by it. Drowned in the cheer.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_minnie.png"),
  },
  {
    id: "wanda_wee", mascotName: "Wanda Wee",
    archonNumber: 6, originalArchon: "The Warlord", celebrationAlias: "Wanda Wyrlord",
    appearance: "A small blonde girl in a yellow hooded jacket, miniature tactical visor, over-large boots",
    playSurface: "Organizes all games, all teams, all 'us vs them'",
    hiddenTruth: "Teaches Apprentices that every friendship is a provisional alliance and that enemies are assets",
    dailyGame: "The Team Game — pick sides. Win. The losing side is removed.",
    failureMethod: "Apprentices who lose too many teams get benched. Benched children rot.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_wanda.png"),
  },
  {
    id: "senator_sprout", mascotName: "Senator Sprout",
    archonNumber: 7, originalArchon: "The Politician",
    appearance: "A small child in a formal child-sized suit, hands always gesturing statesman-like",
    playSurface: "Runs the elections that decide everything — kickball captain, snack-time ruler",
    hiddenTruth: "Teaches Apprentices that consent is given, not taken — and that it can be harvested",
    dailyGame: "The Promise Game — promise something. Keep it. Watch what it costs you.",
    failureMethod: "Apprentices who break promises are voted out. Out is a long way from in.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_sprout.png"),
  },
  {
    id: "wayne", mascotName: "Wayne the Warden's-Boy",
    archonNumber: 8, originalArchon: "The Warden", celebrationAlias: "Wayne",
    appearance: "A green-haired child in a tan-and-black trench coat too long for him, carrying tiny locks",
    playSurface: "Runs the 'safe games' — the ones with rules, with walls, with endings",
    hiddenTruth: "Teaches Apprentices that every rule is a cage, and that they will learn to love their cages",
    dailyGame: "The Safety Game — lock something away for protection. Forget the key's combination.",
    failureMethod: "Apprentices who break rules get quarantined. Quarantine is indistinguishable from death here.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_wayne.png"),
  },
  {
    id: "gary", mascotName: "Gary the Ninth",
    archonNumber: 9, originalArchon: "The Game Master", celebrationAlias: "Gary",
    appearance: "Dark-haired boy in a little blue trench coat and red steampunk goggles, always smiling",
    playSurface: "Makes up the games. Changes the rules mid-play. Wins every time.",
    hiddenTruth: "Teaches Apprentices that the rules favor the rule-maker, and they are not the rule-maker",
    dailyGame: "The Rules Game — solve the puzzle. The solution changes as you approach it.",
    failureMethod: "Apprentices who can't solve the game become part of the game. The others play them.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_gary.png"),
  },
  {
    id: "thazu", mascotName: "Thazu",
    archonNumber: 10, originalArchon: "The Necromancer", celebrationAlias: "Thazulok",
    appearance: "A pale dark-elf child in dress-up robes and oversized red goggles, pet skeleton cat",
    playSurface: "Plays funeral games, tea parties for stuffed animals who don't come back from the tea",
    hiddenTruth: "Teaches Apprentices that endurance is a bargain with death, and they will be asked what they will give",
    dailyGame: "The Tea Party — invite someone. Decide who leaves. Decide who stays. Forever.",
    failureMethod: "Apprentices who refuse to host get hosted. By Thazu. Who never lets the guest leave.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_thazu.png"),
  },
  {
    id: "the_prince", mascotName: "The Prince",
    archonNumber: 11, originalArchon: "The Engineer", celebrationAlias: "The Prince of Celebration",
    appearance: "Young African American boy in a red steampunk trench coat, carrying tools he invented himself",
    playSurface: "Fixes broken toys. Invents new ones. Announces his arrivals — 'Hear ye, hear ye, the prince arrives, with colors fierce and sharpened knives.'",
    hiddenTruth: "Teaches Apprentices that everything can be built and everything can be used as a weapon. Including the Apprentice.",
    dailyGame: "The Forge Game — build a thing. Use it against someone. Live with the use.",
    failureMethod: "Apprentices who can't build get unbuilt. The Prince keeps their parts.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_prince.png"),
  },
  {
    id: "the_seeker_child", mascotName: "Red, the Seeker-Boy",
    archonNumber: 12, originalArchon: "The Human (The Seeker)", celebrationAlias: "The Seeker",
    appearance: "Red-haired boy with bright blue eyes, the original Celebration protagonist, wide-eyed and alert",
    playSurface: "Asks questions. Solves riddles. Announces arrivals — 'Hear ye, hear ye, the human arrives, the last archon, where power lies.'",
    hiddenTruth: "He IS the first Apprentice who survived. He remembers every Apprentice who didn't. He teaches by example.",
    dailyGame: "The Question Game — ask one real question. Live with the answer.",
    failureMethod: "Apprentices who stop asking stop being. The Seeker watches them fade.",
    portrait: assetUrl("art/celebration/mascoteers/mascoteer_red.png"),
  },
];

/* ─── HELPERS ─── */

export function getMascoteerByArchon(archonNumber: number): Mascoteer | undefined {
  return MASCOTEERS.find(m => m.archonNumber === archonNumber);
}

export function getMascoteer(id: string): Mascoteer | undefined {
  return MASCOTEERS.find(m => m.id === id);
}

/**
 * The arrival verses — pulled from the Welcome to Celebration transcript.
 * Three Mascoteers announce themselves in verse form. These are canonical.
 */
export const MASCOTEER_ARRIVAL_VERSES: Array<{ archonNumber: number; verse: string }> = [
  {
    archonNumber: 11,
    verse: "Hear ye, hear ye, the prince arrives, with colors fierce and sharpened knives.\nFrens, frens, gather close and see, an iron clad lion on his path to be.",
  },
  {
    archonNumber: 9,
    verse: "Hear ye, hear ye, the ninth arrives, where ancient beasts and ruin thrive.",
  },
  {
    archonNumber: 12,
    verse: "Hear ye, hear ye, the human arrives, the last archon, where power lies.\nFrens, frens, gather close and see, iron clad lions on their path to be.\nNew recruit, inspiration found, in the light we've grown, to shape our fate and bring reality home.",
  },
];
