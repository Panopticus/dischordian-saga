// apps/shared/npcs/banks/nilmorg.ts
//
// Phase 3 PILOT — Nilmorg's NpcLine bank.
//
// Per nilmorg.md §§1-6 voice samples. Two registers: broadcast (DMC race
// commentary) vs. one-on-one (lore / ceremony / private). Both stay
// CALM — Nilmorg never escalates. Reliability is identity. The canonical
// refusal is "Don't thank me."
//
// Trust bands per registry: File-holder (Bone) / Forecaster (Wire) /
// Counterparty (Chrome) / Counterparty-prime (Dead Man's). Bands map to
// DMC seasonal-rank progression — the player earns rank by winning
// seasons; Nilmorg's commentary tiers up.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "nilmorg" as const;

export const NILMORG_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE FIRST-MEETING (cinematic, Trench arrival)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.signature.bones_are_fresh",
    text:
      "The bones are fresh, the clones are twitching, and the track is " +
      "HUNGRY. I'm Nilmorg, SVP Kinetic Acquisition. The Circuit opens " +
      "when I open it, and I'm opening it now. Try not to leave a mess " +
      "on the way out.",
    surfaces: ["cinematic"],
    cooldownKey: "nilmorg.first_meeting_signature",
    maxPlays: 1,
    setsFlags: ["broker_nilmorg_first_meeting"],
    setsPublicFlags: ["met_nilmorg"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // SEVERANCE PRIZE CEREMONY — canonical "Don't thank me." line
  // (cinematic; fires on severance_prize_paid ripple)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.severance.dont_thank_me",
    text: "The Severance Prize is paid. Don't thank me.",
    surfaces: ["cinematic"],
    cooldownKey: "nilmorg.severance_ceremony",
    maxPlays: 5, // up to 5 seasonal ceremonies
    setsPublicFlags: ["nilmorg_kept_his_agreement"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.severance.kept_his_agreement",
    text:
      "I keep my agreements. The platform paid. The container sealed. The " +
      "companion will arrive aboard your ship within the hour. The clone " +
      "smiled. They earned this. I'm already calibrating next season.",
    surfaces: ["dmc"],
    reactsToPublicFlag: "nilmorg_kept_his_agreement",
    cooldownKey: "nilmorg.kept_agreement_acknowledged",
  },

  // ═════════════════════════════════════════════════════════════════════
  // DMC SEASONAL-TIER COMMENTARY (DMC surface, trust-band gated)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.bone_tier.welcome",
    text:
      "You survived a season. That's enough for some. I file you under " +
      "Bone. It's not a slur; it's a category. Bone-tier files are the " +
      "ones I check first when I'm bored.",
    surfaces: ["dmc"],
    requiresTrustBand: "File-holder",
    cooldownKey: "nilmorg.dmc.bone_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.wire_tier.recognition",
    text:
      "Wire tier. Your splice signature is... recognizable now. I've " +
      "started to anticipate your races before they happen. That's how " +
      "this works — the actuary stops being theoretical when the " +
      "subject becomes a forecast.",
    surfaces: ["dmc"],
    requiresTrustBand: "Forecaster",
    cooldownKey: "nilmorg.dmc.wire_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.chrome_tier.adjusted",
    text:
      "Chrome. I've adjusted my projections for you specifically. " +
      "Counterparty rates apply. The Hierarchy doesn't usually treat " +
      "racers as counterparties; you've made me revise the manual.",
    surfaces: ["dmc"],
    requiresTrustBand: "Counterparty",
    cooldownKey: "nilmorg.dmc.chrome_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.dead_mans_tier.acknowledgment",
    text:
      "Dead Man's. The Severance Prize is paid. I don't say more than " +
      "that to anyone. You've earned the silence. Don't thank me.",
    surfaces: ["dmc"],
    requiresTrustBand: "Counterparty-prime",
    cooldownKey: "nilmorg.dmc.dead_mans_acknowledgment",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // PRE-RACE HYPE — broadcast register, triplet-crescendo + caps-on-
  // appetite-noun signature per nilmorg.md §1.4 tells. Fires on the
  // dmc surface during pre-race countdown; archetype-specific flags
  // narrow which line plays when which class fields enter the lanes.
  //
  // Four archetypes × four hype-states each = 16 lines. Canon:
  //   Wired Clone  — vat-grown, splice-engineered, knowingly racing
  //   Splice       — splice-signature elite (kinetic-engineered prep)
  //   Bone-tier    — early-tier rookie field (low rank, often first race)
  //   Chrome-tier  — elite-rank racers Nilmorg has files on
  // ═════════════════════════════════════════════════════════════════════

  // ─── Wired Clone ────────────────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.wired_clone.field_roll_call",
    text:
      "The Wired Clone steps to the lane! Splice signature: unique. " +
      "Splice signature: archived. Splice signature: MINE by lap two. " +
      "WELCOME, Number Seven. The track is HUNGRY for fresh signal!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_wired_clone"],
    cooldownKey: "nilmorg.prerace.wired_clone.roll_call",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.wired_clone.spotlight",
    text:
      "Look at her! Number plates FRESH, neural splice GLOWING, her last " +
      "memory the start line itself. The clone has no past. The clone " +
      "has only this race. The clone is BEAUTIFUL!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_wired_clone"],
    cooldownKey: "nilmorg.prerace.wired_clone.spotlight",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.wired_clone.threat_promise",
    text:
      "She'll cross the line. She might even win. The signature comes " +
      "home with Nilmorg regardless. That is the deal. That is the " +
      "WHOLE DEAL.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_wired_clone"],
    cooldownKey: "nilmorg.prerace.wired_clone.threat",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.wired_clone.aesthetic",
    text:
      "Oh, the way she grips the throttle! Corporate calls it splice " +
      "fidelity. Nilmorg calls it APPETITE. The bone-lane is going to " +
      "REMEMBER her!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_wired_clone"],
    cooldownKey: "nilmorg.prerace.wired_clone.aesthetic",
    maxPlays: 4,
  },

  // ─── Splice (kinetic-engineered elite) ──────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.splice.engineered_intro",
    text:
      "Engineered for kinetics. Bred for terminal velocity. Built to " +
      "LEAVE A SIGNATURE the moment she crosses the lane. SPLICE. " +
      "SPLICE. SPLICE!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_splice"],
    cooldownKey: "nilmorg.prerace.splice.engineered_intro",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.splice.engineering_spec",
    text:
      "Kinetic profile: optimal. Resonance frequency: tuned. Survival " +
      "probability: filed. The numbers are CLEAN. The track is HUNGRIER " +
      "for clean numbers!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_splice"],
    cooldownKey: "nilmorg.prerace.splice.spec",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.splice.poetry",
    text:
      "There is poetry in a splice that does not blink at the start line. " +
      "That is the whole training program. That is the whole VICTORY!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_splice"],
    cooldownKey: "nilmorg.prerace.splice.poetry",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.splice.no_severance",
    // Canonical ironic-condolence tell per §1.4: the gesture-then-break.
    // Do not let Nilmorg explain WHY a Splice has no fragment — that is
    // the protected refusal per §1.5.
    text:
      "The Splice does not get a Severance Prize if it wins. Splices do " +
      "not have fragments. Nilmorg offers his sincere condolences. JUST " +
      "KIDDING. NEXT!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_splice"],
    cooldownKey: "nilmorg.prerace.splice.no_severance",
    maxPlays: 2,
  },

  // ─── Bone-tier (rookie field) ───────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.bone_tier.newcomer_call",
    text:
      "BONE-TIER! New file. Fresh designation. The clone has never raced " +
      "before. She THINKS she will survive. So does Nilmorg — for about " +
      "three laps.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_bone_tier"],
    cooldownKey: "nilmorg.prerace.bone_tier.newcomer",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.bone_tier.encouragement_as_threat",
    text:
      "Cheer up, Bone-tier! You are ALREADY in the file! Whatever happens " +
      "here — survive or otherwise — your designation gets a line. Most " +
      "clones do not get a line. WELCOME.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_bone_tier"],
    cooldownKey: "nilmorg.prerace.bone_tier.encouragement",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.bone_tier.field_warning",
    text:
      "The Bone-tier field is THICK tonight! The track will sort them. " +
      "The track will sort them BY LAP THREE. The track is NEVER WRONG!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_bone_tier"],
    cooldownKey: "nilmorg.prerace.bone_tier.field_warning",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.bone_tier.aphorism_intrusion",
    // Canonical Tell #4 — the calm lore aphorism intruding on the
    // Race Commentary register. ONE per ceremony beat per §1.4; keep it
    // sparse. The flatness is the threat.
    text: "Speed in all things. Especially first laps. Bone-tier learns that, or does not.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_bone_tier"],
    cooldownKey: "nilmorg.prerace.bone_tier.aphorism",
    maxPlays: 2,
  },

  // ─── Chrome-tier (file-keeper / forecaster register) ────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.chrome_tier.recognition",
    text:
      "Chrome-tier. Nilmorg knows this driver. Nilmorg has her file. " +
      "Nilmorg knows the way she enters Turn Three. He will know when " +
      "she varies it. He always knows. CHROME.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_chrome_tier"],
    cooldownKey: "nilmorg.prerace.chrome_tier.recognition",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.chrome_tier.forecaster",
    text:
      "Predicted finish: top three. Confidence: high. Signature: already " +
      "collected. Tonight Nilmorg watches for a DEVIATION. A deviation " +
      "is the only thing left WORTH WATCHING.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_chrome_tier"],
    cooldownKey: "nilmorg.prerace.chrome_tier.forecaster",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.chrome_tier.counterparty",
    text:
      "Chrome-tier races are not entertainment for Nilmorg. They are " +
      "AUDITS. Tonight Number Fourteen is being audited. By the track. " +
      "By the track's APPETITE.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_chrome_tier"],
    cooldownKey: "nilmorg.prerace.chrome_tier.counterparty",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.chrome_tier.cold_respect",
    // The two-register pivot canon per §1.1 — starts in Race Commentary,
    // lands on a corporate noun, snaps back. Compresses to a clipped
    // closer because Chrome-tier is the file-holder bracket.
    text:
      "Nilmorg respects Chrome-tier the way he respects a contract. Same " +
      "TONE. Same precision. Same outcome. Paid, on schedule, no comment.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_chrome_tier"],
    cooldownKey: "nilmorg.prerace.chrome_tier.cold_respect",
    maxPlays: 4,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CONTRACT-SIGNING (npc_line — institutional precision; NO hidden clauses)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.contract.institutional_intro",
    text:
      "The contract is the contract. There is no fine print. Hierarchy " +
      "rules forbid it. You sign, you deliver, the platform pays. That " +
      "is the entire ritual. Don't thank me when it's done.",
    surfaces: ["npc_line"],
    cooldownKey: "nilmorg.contract.institutional_intro",
  },

  // ═════════════════════════════════════════════════════════════════════
  // TRENCH SECTOR ARRIVAL (room — first-visit cinematic)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.room.trench.first_visit",
    text:
      "The Trench. My platform sits between the lanes. The scoreboard " +
      "watches me; I watch the scoreboard; the bookmakers watch us " +
      "both. Welcome.",
    surfaces: ["room"],
    cooldownKey: "nilmorg.room.trench_first_visit",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.cinematic.catchall",
    text: "I'll see you next season. Or I won't.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.catchall",
    text: "The track is hungry. Speed in all things. Even thinking.",
    surfaces: ["dmc"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.npc_line.catchall",
    text: "I keep my agreements. Don't thank me.",
    surfaces: ["npc_line"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.room.catchall",
    text: "The platform is open. The Circuit is closed until next season.",
    surfaces: ["room"],
  },
];
