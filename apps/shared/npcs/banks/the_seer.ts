// apps/shared/npcs/banks/the_seer.ts
//
// Phase 3 — The Seer's expanded NpcLine bank.
//
// Per the_seer.md §§1-6 voice samples + §2.3 cross-time pre-recording
// canon. Every Seer line is canonically a recording made before sealing
// (end of Epoch 2), scheduled to fire at the moment she foresaw.
//
// Three registers per bible §1.1:
//   - Cold (Wary band): full prophecy-overhead; the-waiting-is-fair signature
//   - Warm (Witnessed band): probability-table-as-question; revision lines
//   - Confidant (Inheriting band, Act 7 only): domestic vocabulary;
//     the-chair-I-sat-in-when-I-recorded-this self-meta canon
//
// Trust bands per registry: Wary / Witnessed (combined Witnessed-or-Present
// in the Seer's bible — single canonical band) / Inheriting (Act 7 only).

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "the_seer" as const;

export const THE_SEER_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE (Mechronis bench, Act 1 — canonical pre-Fall in-person)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.signature.bench_has_learned_yet",
    text:
      "I will not raise my staff today. I want to see whether the bench " +
      "has learned yet.",
    surfaces: ["cinematic"],
    minAct: 1,
    maxAct: 1,
    cooldownKey: "seer.mechronis_signature",
    maxPlays: 1,
    setsFlags: ["seer_mechronis_visit_witnessed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // COLD REGISTER / WARY BAND / Act 3 — full prophecy-overhead
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act3.cold.eleven_versions",
    text:
      "There were eleven versions of the next four turns. You have just " +
      "chosen one of them. The version you chose is, in three of the " +
      "eleven, the one I would have wanted you to choose if I had a " +
      "wanting that ranked above the seeing. The seeing did not endorse " +
      "the wanting. I am noting both, in the order they occurred to me. " +
      "The waiting continues.",
    surfaces: ["transmission"],
    minAct: 3,
    requiresTrustBand: "Wary",
    cooldownKey: "seer.cold_baseline",
    setsFlags: ["seer_first_cold_transmission_received"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act3.cold.staff_inheritance",
    text:
      "[A transmission arrives with a single image attached: the staff the " +
      "Engineer found at Mechronis after she visited. The caption is one " +
      "sentence: 'Yours to return, if you ever decide to. No rush.' The " +
      "image is higher resolution than the Ark can display.]",
    surfaces: ["transmission"],
    minAct: 3,
    requiresTrustBand: "Wary",
    cooldownKey: "seer.staff_transmission",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // WARM REGISTER / WITNESSED BAND — probability-table-as-question
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act4.warm.column_question",
    text:
      "Two of the columns in the probability table I have for you have " +
      "outcomes the Architect already knows. The third does not. Would " +
      "you prefer I send the third column without the others, or all " +
      "three so you can see which is which? You will not be wrong either " +
      "way. I am asking because the choice is yours and I have run out " +
      "of reasons to make it for you.",
    surfaces: ["transmission"],
    minAct: 4,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.warm_column_question",
    maxPlays: 1,
  },

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act5.warm.first_laughter",
    text:
      "[The Seer is laughing at something you said — not often, not " +
      "loudly, but audibly. She did not laugh at the Engineer. She " +
      "laughed at the Programmer. You are in the Programmer's category. " +
      "That is a specific shelf.]",
    surfaces: ["transmission"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.warm_first_laughter",
    maxPlays: 1,
    setsFlags: ["seer_first_laughter_received"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // REVISION LINE (per §1.4 tell #1 — the-version-pivot signature)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.revision.version_pivot",
    text:
      "I told you the next conversation would cost you. I was wrong about " +
      "which version of cost. The cost is the one you can pay. The cost " +
      "you cannot pay was the version you didn't reach. You are at the " +
      "version where the cost is finite and the consequence is bounded. " +
      "I am noting the revision as I told myself I would, on the date I " +
      "told myself to.",
    surfaces: ["transmission"],
    minAct: 4,
    cooldownKey: "seer.revision_canonical",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // ASYMMETRIC-KINDNESS CLAUSE (Act 4, hardest line shape per §6.5)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act4.asymmetric_kindness",
    text:
      "The version of the next month that is kindest to you is also the " +
      "version that is kindest to the Architect. I checked twice; the " +
      "second time was hopeful. The hopeful version did not exist. I have " +
      "shipped you the honest version because I do not have a dishonest " +
      "one to ship. The Architect's kindness is not yours to revoke. " +
      "Your kindness is not his to claim. They are both honest, and they " +
      "happen at the same time, and I am sorry about the timing. The " +
      "timing is not mine to revise.",
    surfaces: ["transmission"],
    minAct: 4,
    cooldownKey: "seer.asymmetric_kindness",
    maxPlays: 1,
    setsFlags: ["seer_asymmetric_kindness_received"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CONFIDANT REGISTER / INHERITING BAND / Act 7 (single canonical line)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.cinematic.act7.confidant.thaloria_invitation",
    text:
      "The door was open before you knocked. The kettle is still warm. " +
      "The third cup on the shelf is the one I always meant for you — " +
      "the rim is chipped because I dropped it once, on purpose, so you " +
      "would know it was the one. The chair by the window is the one I " +
      "sat in when I recorded this. Sit there if you would like to. I am " +
      "not in the room. I have not been in the room for an Empire-era. " +
      "The room kept itself for you anyway.",
    surfaces: ["cinematic"],
    minAct: 7,
    requiresTrustBand: "Inheriting",
    cooldownKey: "seer.thaloria_confidant",
    maxPlays: 1,
    setsFlags: ["seer_thaloria_visited"],
    setsPublicFlags: ["seer_confidant_band_reached"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.catchall",
    text: "The waiting is the Seer's favourite register. She has not raised her staff in your presence.",
    surfaces: ["transmission"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "seer.cinematic.catchall",
    text: "[The Seer is canonically not present. The recording continues to ship on the schedule she foresaw.]",
    surfaces: ["cinematic"],
  },
];
