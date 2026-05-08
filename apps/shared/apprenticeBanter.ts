/* ═══════════════════════════════════════════════════════
   APPRENTICE BANTER — apprentice ↔ canonical NPC exchanges

   Mirrors companionBanter.ts but keyed by ApprenticeArchetype
   instead of fixed NPC ids. Same archetype filling on a new
   playthrough surfaces the same banter pairings — only the
   procedurally-generated apprentice name changes.

   Spec: ~3 thematically-fitting NPCs per archetype × 2 banter
   exchanges × 2 voice-flavored line variants = ~6 entries per
   archetype × 12 archetypes ≈ 72 banter pairs at MVP.

   Trigger gating reuses the same trigger vocabulary as
   companionBanter.ts (act flags, mission outcomes, room dwell).

   Consumed by:
    - companionRoomRegistry.ts dwell tick — when an apprentice
      and a paired NPC share a zone, this picks 1–2 banters
      within the dwell window.
    - The Commons scene-roll (commonsScenePicker.ts) — banter
      pairs are the seed pool for ambient sub-zone scenes.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

/** The canonical NPC speakers an apprentice can banter with. Includes
 *  the 5 recruitable NPCs plus key non-recruitable bibled NPCs. */
export type ApprenticeBanterNpc =
  | "elara"
  | "human"
  | "antiquarian"
  | "locke"
  | "vex_solene"
  | "wraith_calder"
  | "jericho_jones"
  | "akai_shi"
  | "necromancer"
  | "engineer_zero"
  | "iron_lion"
  | "the_detective"
  | "foucault";

export interface ApprenticeBanterPair {
  id: string;
  archetype: ApprenticeArchetype;
  npc: ApprenticeBanterNpc;
  /** Sub-zone affinity for the Commons. Undefined = any. */
  subZone?: "bar" | "long_table" | "alcove";
  /** Trigger string — empty string = ambient (room dwell only). */
  trigger?: string;
  /** Lines alternate apprentice → npc → apprentice... `{name}` is
   *  templated to the apprentice's procedural name at fire time. */
  lines: readonly string[];
  /** Optional positive flag gate. */
  requiresFlags?: readonly string[];
  /** Optional negative flag gate. */
  excludeFlags?: readonly string[];
  /** Per-character-instance play cap (apprentices are by archetype, so
   *  this resets per crew member). */
  maxPlays: 1 | 2 | 3;
}

/* ─── BANTER POOL ─── */

export const APPRENTICE_BANTER: ApprenticeBanterPair[] = [
  /* Zealot ─────────────────────────────────────────────────────── */
  {
    id: "banter_zealot_antiquarian_doctrine",
    archetype: "zealot",
    npc: "antiquarian",
    subZone: "long_table",
    lines: [
      "{name}: You catalogued forty-three versions of the Founders' Creed. One is the original.",
      "Antiquarian: Forty-three were the original. The original is what stays.",
      "{name}: Then how do you know which to kneel to?",
      "Antiquarian: I don't kneel. I record. The kneeling is your line.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_zealot_human_steady_hand",
    archetype: "zealot",
    npc: "human",
    subZone: "bar",
    trigger: "first_costly_morality_choice",
    lines: [
      "{name}: You did the right thing. The Cause approves.",
      "The Human: I didn't do it for the Cause.",
      "{name}: That's why it approves.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_zealot_locke_jurisdiction",
    archetype: "zealot",
    npc: "locke",
    subZone: "long_table",
    lines: [
      "{name}: There is a higher law than your bench.",
      "Locke: Yes. Mine cites it. Yours interprets it. Different jobs.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_zealot_necromancer_prophecy",
    archetype: "zealot",
    npc: "necromancer",
    subZone: "alcove",
    requiresFlags: ["necromancer_event_complete"],
    lines: [
      "{name}: You sing the dead names. That's a kind of liturgy.",
      "Necromancer: It's the only liturgy that doesn't lie.",
      "{name}: Then teach me the one for the still-living.",
    ],
    maxPlays: 1,
  },

  /* Ghost ──────────────────────────────────────────────────────── */
  {
    id: "banter_ghost_akai_shadows",
    archetype: "ghost",
    npc: "akai_shi",
    subZone: "alcove",
    requiresFlags: ["necromancer_event_complete"],
    lines: [
      "Akai Shi: You watch like someone who's been watched first.",
      "{name}: I learned where the cameras blink.",
      "Akai Shi: Then we already share a vocabulary.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_ghost_locke_witnesses",
    archetype: "ghost",
    npc: "locke",
    subZone: "long_table",
    lines: [
      "Locke: I don't see you in any of the security audits.",
      "{name}: That's the design.",
      "Locke: I'd like that fixed.",
      "{name}: Noted. Not fixed.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_ghost_elara_records",
    archetype: "ghost",
    npc: "elara",
    subZone: "alcove",
    lines: [
      "Elara: You're not in the manifest.",
      "{name}: I'm in three.",
      "Elara: Which name should I use?",
      "{name}: The one you trust.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_ghost_the_detective_method",
    archetype: "ghost",
    npc: "the_detective",
    subZone: "bar",
    lines: [
      "The Detective: You sit where the camera doesn't reach.",
      "{name}: You sit where they all reach.",
      "The Detective: We're both correct.",
    ],
    maxPlays: 2,
  },

  /* Scholar ────────────────────────────────────────────────────── */
  {
    id: "banter_scholar_locke_footnote",
    archetype: "scholar",
    npc: "locke",
    subZone: "long_table",
    lines: [
      "{name}: Your judgement on the Reston case has a citation error.",
      "Locke: Where?",
      "{name}: Footnote 14. The original was a forgery.",
      "Locke: I'll need the source by tomorrow.",
      "{name}: It's already on your bench.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_scholar_antiquarian_disputed",
    archetype: "scholar",
    npc: "antiquarian",
    subZone: "long_table",
    lines: [
      "Antiquarian: You've found a banned interpretation.",
      "{name}: I've found three. They contradict each other.",
      "Antiquarian: Then it was very thoroughly banned.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_scholar_foucault_orthodoxy",
    archetype: "scholar",
    npc: "foucault",
    subZone: "alcove",
    lines: [
      "Foucault: You publish, then you retract, then you publish again.",
      "{name}: I'm correcting myself in public.",
      "Foucault: That's a discipline.",
      "{name}: That's the only one I have left.",
    ],
    maxPlays: 1,
  },

  /* Revenant ───────────────────────────────────────────────────── */
  {
    id: "banter_revenant_wraith_unfinished",
    archetype: "revenant",
    npc: "wraith_calder",
    subZone: "alcove",
    lines: [
      "Wraith Calder: You died with a list still in your pocket.",
      "{name}: Five names. Three are still alive.",
      "Wraith Calder: That's not unfinished. That's a window.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_revenant_necromancer_names",
    archetype: "revenant",
    npc: "necromancer",
    subZone: "alcove",
    requiresFlags: ["necromancer_event_complete"],
    lines: [
      "Necromancer: I sang you back. Did the song fit?",
      "{name}: It fit the way a coat fits in summer. Snug. Wrong season.",
      "Necromancer: I'll write you a lighter one.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_revenant_elara_debt",
    archetype: "revenant",
    npc: "elara",
    subZone: "long_table",
    lines: [
      "Elara: Your file says you closed three cases on the way out.",
      "{name}: I closed two. The third closed me.",
    ],
    maxPlays: 2,
  },

  /* Artisan ────────────────────────────────────────────────────── */
  {
    id: "banter_artisan_vex_commission",
    archetype: "artisan",
    npc: "vex_solene",
    subZone: "alcove",
    lines: [
      "Vex Solène: You make the kind of thing I can't.",
      "{name}: You make the kind of thing I want to.",
      "Vex Solène: Then we should quarrel about it for a while.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_artisan_engineer_tools",
    archetype: "artisan",
    npc: "engineer_zero",
    subZone: "long_table",
    lines: [
      "Engineer Zero: Your jig is two degrees off.",
      "{name}: Two degrees is the signature.",
      "Engineer Zero: Then I'll order you a new one — three degrees off.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_artisan_iron_lion_endurance",
    archetype: "artisan",
    npc: "iron_lion",
    subZone: "bar",
    lines: [
      "Iron Lion: That blade you finished — it'll outlive every hand that holds it.",
      "{name}: It's supposed to.",
    ],
    maxPlays: 2,
  },

  /* Oracle ─────────────────────────────────────────────────────── */
  {
    id: "banter_oracle_elara_dreams",
    archetype: "oracle",
    npc: "elara",
    subZone: "alcove",
    lines: [
      "{name}: I dreamt the manifest had your name twice.",
      "Elara: My name is in the manifest twice.",
      "{name}: I know. The dream told me where.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_oracle_human_specifics",
    archetype: "oracle",
    npc: "human",
    subZone: "long_table",
    lines: [
      "{name}: Don't take the southern corridor on the next mission.",
      "The Human: Why?",
      "{name}: I don't know yet. I'll know an hour after we don't go.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_oracle_antiquarian_signs",
    archetype: "oracle",
    npc: "antiquarian",
    subZone: "long_table",
    lines: [
      "Antiquarian: You read my catalogue backwards.",
      "{name}: That's how it's spoken in the dream.",
      "Antiquarian: …I'll re-shelf accordingly.",
    ],
    maxPlays: 2,
  },

  /* Wanderer ───────────────────────────────────────────────────── */
  {
    id: "banter_wanderer_jericho_road",
    archetype: "wanderer",
    npc: "jericho_jones",
    subZone: "bar",
    lines: [
      "Jericho Jones: You been on every deck twice.",
      "{name}: There's a window in the cargo bay nobody else knows about.",
      "Jericho Jones: Yes there is. I leave it open for you.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_wanderer_vex_maps",
    archetype: "wanderer",
    npc: "vex_solene",
    subZone: "long_table",
    lines: [
      "Vex Solène: Tell me the place that finally held you.",
      "{name}: I haven't found it.",
      "Vex Solène: Tell me anyway. Lying about it is also a map.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_wanderer_human_settling",
    archetype: "wanderer",
    npc: "human",
    subZone: "alcove",
    lines: [
      "The Human: Three cycles. Same bunk. That's a record for you.",
      "{name}: I keep meaning to leave.",
      "The Human: I'll keep meaning to let you.",
    ],
    maxPlays: 1,
  },

  /* Martyr ─────────────────────────────────────────────────────── */
  {
    id: "banter_martyr_jester_funeral",
    archetype: "martyr",
    npc: "jericho_jones",
    subZone: "long_table",
    lines: [
      "Jericho Jones: You volunteered for that one without raising your hand.",
      "{name}: My hand was busy.",
      "Jericho Jones: Doing what?",
      "{name}: Reaching for the trigger.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_martyr_elara_thanks",
    archetype: "martyr",
    npc: "elara",
    subZone: "alcove",
    lines: [
      "Elara: I'd like to thank you, properly.",
      "{name}: Please don't.",
      "Elara: Then I'll record the gratitude and not deliver it.",
      "{name}: That works.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_martyr_human_rest",
    archetype: "martyr",
    npc: "human",
    subZone: "bar",
    lines: [
      "The Human: Sit down. Eat something.",
      "{name}: I'm not hungry.",
      "The Human: I didn't ask if you were. Sit down.",
    ],
    maxPlays: 2,
  },

  /* Heretic ────────────────────────────────────────────────────── */
  {
    id: "banter_heretic_antiquarian_argument",
    archetype: "heretic",
    npc: "antiquarian",
    subZone: "long_table",
    lines: [
      "{name}: Your archive is missing the rebuttals.",
      "Antiquarian: It includes them. They're the air around the books.",
      "{name}: That's a poetic dodge.",
      "Antiquarian: It's the only one that fits in the catalogue.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_heretic_foucault_orthodoxy",
    archetype: "heretic",
    npc: "foucault",
    subZone: "alcove",
    lines: [
      "Foucault: You wrote a tract against my last paper.",
      "{name}: I cited you forty times.",
      "Foucault: That's the most flattering disagreement I've had this year.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_heretic_locke_dissent",
    archetype: "heretic",
    npc: "locke",
    subZone: "long_table",
    lines: [
      "Locke: Your tract makes my caseload harder.",
      "{name}: That's the point.",
      "Locke: Stay close. I want to read the next one before it lands.",
    ],
    maxPlays: 2,
  },

  /* Jester ─────────────────────────────────────────────────────── */
  {
    id: "banter_jester_jericho_punchline",
    archetype: "jester",
    npc: "jericho_jones",
    subZone: "bar",
    lines: [
      "{name}: A priest, a sentinel, and a corpse walk into a bar.",
      "Jericho Jones: I've heard this one.",
      "{name}: You're in this one.",
      "Jericho Jones: …go on.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_jester_human_eulogy",
    archetype: "jester",
    npc: "human",
    subZone: "alcove",
    lines: [
      "The Human: That eulogy you gave for the third — was it a joke?",
      "{name}: It was three jokes. Two of them landed.",
      "The Human: Which one didn't?",
      "{name}: The one I meant.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_jester_vex_stage",
    archetype: "jester",
    npc: "vex_solene",
    subZone: "bar",
    lines: [
      "Vex Solène: Your timing is awful.",
      "{name}: It's deliberate.",
      "Vex Solène: I respect that on a deep professional level.",
    ],
    maxPlays: 2,
  },

  /* Sentinel ───────────────────────────────────────────────────── */
  {
    id: "banter_sentinel_locke_post",
    archetype: "sentinel",
    npc: "locke",
    subZone: "long_table",
    lines: [
      "Locke: You stood your watch sixteen hours past relief.",
      "{name}: The relief didn't come.",
      "Locke: They came. You didn't see them.",
      "{name}: Then I stood it sixteen hours longer than necessary. I'd do it again.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_sentinel_iron_lion_oath",
    archetype: "sentinel",
    npc: "iron_lion",
    subZone: "bar",
    lines: [
      "Iron Lion: You swore at the door. I heard it.",
      "{name}: I swore to the door.",
      "Iron Lion: That's the only oath that holds.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_sentinel_human_relief",
    archetype: "sentinel",
    npc: "human",
    subZone: "alcove",
    lines: [
      "The Human: I want to relieve you.",
      "{name}: Acknowledged. Not yet.",
      "The Human: When?",
      "{name}: When the door says so.",
    ],
    maxPlays: 1,
  },

  /* Prodigal ───────────────────────────────────────────────────── */
  {
    id: "banter_prodigal_jericho_return",
    archetype: "prodigal",
    npc: "jericho_jones",
    subZone: "bar",
    lines: [
      "Jericho Jones: They told me you'd come back twice.",
      "{name}: Three times.",
      "Jericho Jones: Then I owe somebody a drink.",
    ],
    maxPlays: 2,
  },
  {
    id: "banter_prodigal_elara_simple",
    archetype: "prodigal",
    npc: "elara",
    subZone: "long_table",
    lines: [
      "Elara: You eat plain bread.",
      "{name}: I eat what I missed.",
      "Elara: You missed bread?",
      "{name}: I missed knowing it would be there.",
    ],
    maxPlays: 1,
  },
  {
    id: "banter_prodigal_human_quiet",
    archetype: "prodigal",
    npc: "human",
    subZone: "alcove",
    lines: [
      "The Human: You don't apologize.",
      "{name}: You haven't asked me to.",
      "The Human: Good. Don't.",
    ],
    maxPlays: 1,
  },
];

/* ─── HELPERS ─── */

/** Look up banter pairs available between an apprentice archetype and
 *  an NPC. Filtered downstream by trigger / flags / play caps. */
export function findBanterPairs(
  archetype: ApprenticeArchetype,
  npc: ApprenticeBanterNpc,
): readonly ApprenticeBanterPair[] {
  return APPRENTICE_BANTER.filter(
    (b) => b.archetype === archetype && b.npc === npc,
  );
}

/** Coverage by archetype — how many distinct NPCs each archetype banters
 *  with. Used by the ship-check parity gate. */
export function banterCoverageByArchetype(): Record<ApprenticeArchetype, number> {
  const counts: Partial<Record<ApprenticeArchetype, Set<ApprenticeBanterNpc>>> = {};
  for (const b of APPRENTICE_BANTER) {
    if (!counts[b.archetype]) counts[b.archetype] = new Set();
    counts[b.archetype]!.add(b.npc);
  }
  const out = {} as Record<ApprenticeArchetype, number>;
  (Object.keys(counts) as ApprenticeArchetype[]).forEach((k) => {
    out[k] = counts[k]?.size ?? 0;
  });
  return out;
}

/** Render a banter line, substituting `{name}` with the apprentice's
 *  procedural name. */
export function renderBanterLine(line: string, apprenticeName: string): string {
  return line.replace(/\{name\}/g, apprenticeName);
}
