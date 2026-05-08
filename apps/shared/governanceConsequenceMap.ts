/* ═══════════════════════════════════════════════════════
   GOVERNANCE CONSEQUENCE MAP

   Bridges the legacy free-form `consequences: string[]` field
   on Engineer / Annual / Year-One votes to the new structured
   `VoteRewardPayload` interpreted by the server.

   Keyed by `${voteId}::${optionId}`. New votes should declare
   `rewardOnWin: VoteRewardPayload` directly on their option in
   the DB row; this registry exists only to honour the seventeen
   votes that shipped with prose consequences.

   When the server closes a vote and the option's
   `rewardOnWin` JSON is missing or unparseable, it falls
   through to `getDeclaredConsequences(voteId, optionId)`.
   ═══════════════════════════════════════════════════════ */

import type { VoteRewardPayload } from "./voteConsequences";

const REGISTRY: Record<string, VoteRewardPayload> = {
  // ── Engineer arc votes ─────────────────────────────────
  "engineer_vote_bench_power::power_up": {
    consequences: [
      { kind: "set_flag", flag: "governance:engineer_bench_powered" },
      { kind: "energy_delta", dark: 5, vortex: 5 },
      {
        kind: "world_modifier",
        modifierKey: "engineer_bench_crafting_boost",
        modifierType: "crafting_xp_pct",
        modifierValue: 10,
        durationDays: 7,
        description: "The bench hums at full capacity. Crafting XP +10%.",
      },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose to feed the flame. The bench woke fully, " +
          "and the Vortex turned its attention. We will know within the week " +
          "whether boldness or restraint would have served us better.",
        annotation:
          "The prince built this bench in defiance of the Vortex. To use " +
          "it as he intended is to honour him. To use it cautiously is to " +
          "doubt his arithmetic. Both are forms of grief.",
      },
    ],
  },
  "engineer_vote_bench_power::contain": {
    consequences: [
      { kind: "set_flag", flag: "governance:engineer_bench_contained" },
      { kind: "energy_delta", light: 10, dark: -10 },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose silence over signal. The bench cooled. The " +
          "Vortex looked elsewhere. Some inheritances are kept by being kept " +
          "quiet.",
      },
    ],
  },
  "engineer_vote_ghost_network::right": {
    consequences: [
      { kind: "set_flag", flag: "governance:ghost_network_endorsed" },
      { kind: "energy_delta", light: 30 },
      { kind: "unlock", unlockId: "transmission:ghost_network_intel", description: "Ghost Network intel transmissions become available." },
      { kind: "unlock", unlockId: "trade:engineer_network_partners", description: "The Engineer's contacts open as trade partners." },
      {
        kind: "tome_entry",
        body:
          "The Potentials affirmed the prince's quiet rebellion. Saving " +
          "without spectacle is wisdom of a kind that only retrospect can " +
          "name. He would be glad. He was glad rarely.",
      },
    ],
  },
  "engineer_vote_ghost_network::wrong": {
    consequences: [
      { kind: "set_flag", flag: "governance:ghost_network_doubted" },
      { kind: "energy_delta", dark: 10 },
      { kind: "unlock", unlockId: "transmission:watcher_file_ghost_network" },
      {
        kind: "tome_entry",
        body:
          "The Potentials named the discomfort. A network of geniuses " +
          "answering to one man is a shape the galaxy has seen before. The " +
          "Watcher's file opens to those who asked the harder question.",
      },
    ],
  },
  "engineer_vote_thought_vs_violence::thought": {
    consequences: [
      { kind: "set_flag", flag: "governance:revolution_of_thought" },
      { kind: "energy_delta", light: 15 },
      { kind: "faction_delta", factionId: "architect_remnants", delta: 10 },
      {
        kind: "world_modifier",
        modifierKey: "diplomacy_trade_bonus",
        modifierType: "trade_diplomacy_pct",
        modifierValue: 10,
        durationDays: 30,
        description: "Diplomacy bonuses in Trade Empire.",
      },
      { kind: "unlock", unlockId: "lore:engineer_writings_passive_resistance" },
      {
        kind: "tome_entry",
        body:
          "The Potentials sided with the prince's patience. To wait for " +
          "minds to change is the slowest kind of courage. It is also the " +
          "kind that does not leave bodies.",
      },
    ],
  },
  "engineer_vote_thought_vs_violence::violence": {
    consequences: [
      { kind: "set_flag", flag: "governance:violence_was_warranted" },
      { kind: "energy_delta", dark: 15 },
      { kind: "faction_delta", factionId: "insurgency", delta: 10 },
      { kind: "unlock", unlockId: "lore:warlord_strike_first_doctrine" },
      {
        kind: "tome_entry",
        body:
          "The Potentials judged the waiting. The prince grieved before he " +
          "fought. The Potentials would have him fight before grief. There " +
          "is no clean answer. The galaxy keeps neither version safe.",
      },
    ],
  },
  "engineer_vote_fought_sooner::sooner": {
    consequences: [
      { kind: "set_flag", flag: "governance:should_have_fought_sooner" },
      { kind: "energy_delta", dark: 10 },
      {
        kind: "tome_entry",
        body:
          "The Potentials grant: yes, sooner. The Architect's clock runs " +
          "differently after this vote. Vex hears it and says nothing for " +
          "three days.",
      },
    ],
  },
  "engineer_vote_fought_sooner::patience": {
    consequences: [
      { kind: "set_flag", flag: "governance:patience_was_correct" },
      { kind: "energy_delta", light: 10 },
      {
        kind: "tome_entry",
        body:
          "The Potentials honour the waiting. Vex composes a piece in C " +
          "minor and refuses to call it grief.",
      },
    ],
  },
  "engineer_vote_kaels_choice::his_choice": {
    consequences: [
      { kind: "set_flag", flag: "governance:kael_chose_dissolution" },
      { kind: "energy_delta", dark: 5, vortex: 3 },
      { kind: "unlock", unlockId: "encounter:source_kael_taunt" },
      {
        kind: "tome_entry",
        body:
          "The Potentials grant Kael the dignity of his own descent. He " +
          "wanted to dissolve. We let the wanting be his. The Source speaks " +
          "louder afterward. We listen anyway.",
      },
    ],
  },
  "engineer_vote_kaels_choice::not_his": {
    consequences: [
      { kind: "set_flag", flag: "governance:kael_was_taken" },
      { kind: "energy_delta", light: 5 },
      {
        kind: "tome_entry",
        body:
          "The Potentials refuse the comfort of consent. Kael did not choose " +
          "this. The Source wears him. We will not pretend otherwise.",
      },
    ],
  },
  "engineer_vote_tell_agent_zero::tell_her": {
    consequences: [
      { kind: "set_flag", flag: "governance:vex_told_engineer_truth" },
      { kind: "set_flag", flag: "engineer_zero_hint" },
      { kind: "energy_delta", light: 20 },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose disclosure. Vex Solène was told what she " +
          "carries. She wept once and asked for the bench's keys. We gave " +
          "them.",
        annotation:
          "I have watched her hands at the keyboard. They are his hands. " +
          "She does not yet know how to grieve a self she did not live. We " +
          "will help. We are her witness now.",
      },
    ],
  },
  "engineer_vote_tell_agent_zero::dont_tell": {
    consequences: [
      { kind: "set_flag", flag: "governance:vex_kept_in_dark" },
      { kind: "energy_delta", dark: 15 },
      {
        kind: "tome_entry",
        body:
          "The Potentials kept the secret. Vex composes without knowing the " +
          "hands she composes with. The prince is silent inside her. The " +
          "silence is louder than the music.",
        annotation:
          "I disagree with this choice. I record it anyway. That is the " +
          "office I hold.",
      },
    ],
  },
  "engineer_vote_keep_playing::keep_playing": {
    consequences: [
      { kind: "set_flag", flag: "governance:vex_continues_publicly" },
      { kind: "energy_delta", light: 10 },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose the stage. Vex kept the bench public. The " +
          "music carries further than safety would.",
      },
    ],
  },
  "engineer_vote_keep_playing::go_dark": {
    consequences: [
      { kind: "set_flag", flag: "governance:vex_went_dark" },
      { kind: "energy_delta", light: -5, dark: 5 },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose silence. Vex closed the bench. The galaxy " +
          "is quieter for it, and not in a way the galaxy benefits from.",
      },
    ],
  },
  // ── Annual headline votes ──────────────────────────────
  "annual-state-of-the-ark::ark-food": {
    consequences: [
      { kind: "set_flag", flag: "governance:annual_ark_food" },
      {
        kind: "world_modifier",
        modifierKey: "annual_stamina_regen",
        modifierType: "stamina_regen_pct",
        modifierValue: 10,
        durationDays: 365,
        description: "+10% global stamina regen for the year.",
      },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose bread. The hydroponics bays brighten. The " +
          "armoury gathers a polite layer of dust.",
      },
    ],
  },
  "annual-state-of-the-ark::ark-defense": {
    consequences: [
      { kind: "set_flag", flag: "governance:annual_ark_defense" },
      {
        kind: "world_modifier",
        modifierKey: "annual_global_def",
        modifierType: "def_pct",
        modifierValue: 10,
        durationDays: 365,
        description: "+10% global DEF for the year.",
      },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose bulwarks. The hull thickens. The library " +
          "checks its lamps against the long night.",
      },
    ],
  },
  "annual-state-of-the-ark::ark-research": {
    consequences: [
      { kind: "set_flag", flag: "governance:annual_ark_research" },
      {
        kind: "world_modifier",
        modifierKey: "annual_crafting_xp",
        modifierType: "crafting_xp_pct",
        modifierValue: 10,
        durationDays: 365,
        description: "+10% crafting XP for the year.",
      },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose to know more. The Antiquarian smiles for the " +
          "first time this cycle. The Architect makes a private note in red ink.",
      },
    ],
  },
  "annual-state-of-the-ark::ark-culture": {
    consequences: [
      { kind: "set_flag", flag: "governance:annual_ark_culture" },
      { kind: "energy_delta", light: 25 },
      { kind: "unlock", unlockId: "questline:annual_cultural_quests" },
      {
        kind: "tome_entry",
        body:
          "The Potentials chose song. The libraries reopen. There are festivals. " +
          "There are also rehearsals; rehearsals are the second-shyest kind of love.",
      },
    ],
  },
  "annual-faction-succession::succession-insurgency": {
    consequences: [
      { kind: "set_flag", flag: "governance:annual_banner_insurgency" },
      { kind: "unlock", unlockId: "storyline:insurgency_year" },
      { kind: "faction_delta", factionId: "insurgency", delta: 25 },
      {
        kind: "tome_entry",
        body:
          "The Iron Lions take the standard. The year will be loud. The Antiquarian sharpens his pen.",
      },
    ],
  },
  "annual-faction-succession::succession-antiquarians": {
    consequences: [
      { kind: "set_flag", flag: "governance:annual_banner_antiquarians" },
      { kind: "unlock", unlockId: "storyline:antiquarian_year" },
      { kind: "faction_delta", factionId: "architect_remnants", delta: 25 },
      {
        kind: "tome_entry",
        body:
          "The scholars carry the banner. The year will be slow. The slow years are the ones we remember.",
        annotation:
          "I confess: this is the year I have wanted. I record this vote with a hand that is not entirely impartial.",
      },
    ],
  },
  "annual-faction-succession::succession-architects": {
    consequences: [
      { kind: "set_flag", flag: "governance:annual_banner_architects" },
      { kind: "unlock", unlockId: "storyline:architect_year" },
      { kind: "faction_delta", factionId: "new_babylon", delta: 25 },
      {
        kind: "tome_entry",
        body:
          "The builders take the standard. The year will be measured. The Architect calculates whether to be pleased.",
      },
    ],
  },
  "annual-apocalypse-protocol::protocol-fire": {
    consequences: [
      { kind: "set_flag", flag: "governance:apocalypse_rehearsal_fire" },
      { kind: "energy_delta", dark: 5 },
      { kind: "unlock", unlockId: "world_event:heat_death" },
      {
        kind: "tome_entry",
        body: "The Potentials rehearse heat-death. Drills run hot this year.",
      },
    ],
  },
  "annual-apocalypse-protocol::protocol-silence": {
    consequences: [
      { kind: "set_flag", flag: "governance:apocalypse_rehearsal_silence" },
      { kind: "energy_delta", dark: 5 },
      { kind: "unlock", unlockId: "world_event:comms_outage" },
      {
        kind: "tome_entry",
        body:
          "The Potentials rehearse silence. Comms cut for two hours each Tuesday. We write letters again.",
      },
    ],
  },
  "annual-apocalypse-protocol::protocol-fracture": {
    consequences: [
      { kind: "set_flag", flag: "governance:apocalypse_rehearsal_fracture" },
      { kind: "energy_delta", dark: 5 },
      { kind: "unlock", unlockId: "world_event:hull_breach" },
      {
        kind: "tome_entry",
        body:
          "The Potentials rehearse the breach. Hull-section drills become weekly. Some Potentials ask for partners on the drills. We assign them.",
      },
    ],
  },
  "annual-oracles-question::oracle-past": {
    consequences: [
      { kind: "set_flag", flag: "governance:oracle_answered_past" },
      { kind: "unlock", unlockId: "lore:oracle_pre_fall_record" },
      {
        kind: "tome_entry",
        body:
          "The Oracle gave us a piece of before. It is smaller than we expected. It is also brighter.",
      },
    ],
  },
  "annual-oracles-question::oracle-future": {
    consequences: [
      { kind: "set_flag", flag: "governance:oracle_answered_future" },
      { kind: "unlock", unlockId: "lore:oracle_next_year_preview" },
      {
        kind: "tome_entry",
        body:
          "The Oracle gave us a piece of next. We try not to spoil it for ourselves. We mostly fail.",
      },
    ],
  },
  "annual-oracles-question::oracle-self": {
    consequences: [
      { kind: "set_flag", flag: "governance:oracle_answered_self" },
      { kind: "unlock", unlockId: "lore:community_profile_reveal" },
      {
        kind: "tome_entry",
        body:
          "The Oracle held up a mirror. We did not all like what we saw. The mirror does not negotiate.",
      },
    ],
  },

  // ── Mini-DLC closing motions (Phase 6 / 2-year content slate) ──
  // Each yearly event closes with a Council vote routed through this
  // map. The fall-through reward reads here when the DB row's JSON
  // is missing or malformed. One option per motion — the yearly is
  // a yes/ratify ceremony, not a binary; the binary case is handled
  // by the Y2-Q1 Schism row.

  "foundation_charter_renewal_year_1::ratify": {
    consequences: [
      { kind: "set_flag", flag: "governance:foundation_charter_year_1_ratified" },
      { kind: "energy_delta", light: 5 },
      {
        kind: "tome_entry",
        body:
          "The first charter is read aloud. Six signatures stand. The seventh is wax-eaten on purpose. The reading goes on without it.",
      },
    ],
  },

  "severance_succession_year_1::ratify": {
    consequences: [
      { kind: "set_flag", flag: "governance:severance_protocol_year_1_set" },
      { kind: "energy_delta", dark: 3 },
      {
        kind: "tome_entry",
        body:
          "We named what we already did: the bond is on the table; the bond chooses one. From this year forward the ritual has a name.",
      },
    ],
  },

  "mechronis_curriculum_vote_year_1::ratify": {
    consequences: [
      { kind: "set_flag", flag: "governance:mechronis_curriculum_year_1_set" },
      { kind: "energy_delta", light: 3 },
      {
        kind: "tome_entry",
        body:
          "Three faculties wanted three different terms. The Council picked one. The other two will return next year, sharper.",
      },
    ],
  },

  "kael_memorial_inscription_year_1::ratify": {
    consequences: [
      { kind: "set_flag", flag: "governance:memorial_inscription_year_1" },
      { kind: "energy_delta", light: 4, dark: 2 },
      {
        kind: "tome_entry",
        body:
          "The plaza opens. Each player writes one name. The Antiquarian compiles the year's volume. We grieve in mosaic, not in private.",
      },
    ],
  },

  "foundation_schism_resolution_year_2::ratify_schism": {
    consequences: [
      { kind: "set_flag", flag: "governance:charter_schism_ratified" },
      { kind: "energy_delta", dark: 6 },
      {
        kind: "tome_entry",
        body:
          "The redacted line is restored. The charter grows a second column. Half the Council leaves the chamber smiling; half leaves silent.",
      },
    ],
  },
  "foundation_schism_resolution_year_2::close_schism": {
    consequences: [
      { kind: "set_flag", flag: "governance:charter_schism_closed" },
      { kind: "energy_delta", light: 6 },
      {
        kind: "tome_entry",
        body:
          "The original charter holds. The descendants of the redacted name walk out, and the door does not shut behind them. They will return.",
      },
    ],
  },

  "severance_infernal_amnesty_year_2::ratify": {
    consequences: [
      { kind: "set_flag", flag: "governance:infernal_amnesty_year_2" },
      { kind: "energy_delta", light: 8, dark: -4 },
      {
        kind: "tome_entry",
        body:
          "Sixty-one hidden clauses are read into the record. The Council voids the ones it can. The Hierarchy accepts the ruling — for now.",
      },
    ],
  },

  "apprentice_protection_protocol_year_2::ratify": {
    consequences: [
      { kind: "set_flag", flag: "governance:apprentice_protocol_year_2" },
      { kind: "energy_delta", light: 5 },
      {
        kind: "tome_entry",
        body:
          "What the missing professor cost us is now doctrine. No apprentice stands the wall alone again. The curriculum learned its first lesson.",
      },
    ],
  },

  "vigil_continuation_year_2::ratify": {
    consequences: [
      { kind: "set_flag", flag: "governance:vigil_year_2_continued" },
      { kind: "energy_delta", light: 7 },
      {
        kind: "tome_entry",
        body:
          "The plaza was lit through the night. The Council votes to relight it every month. Six watchers spoke; one stayed silent. We will keep listening.",
      },
    ],
  },
};

/**
 * Look up declared structured consequences for a given vote
 * option. Used as the fallback when `voteOptions.rewardOnWin`
 * is null or unparseable.
 */
export function getDeclaredConsequences(
  voteId: string,
  optionId: string,
): VoteRewardPayload | null {
  return REGISTRY[`${voteId}::${optionId}`] ?? null;
}

/**
 * Test/debug helper — returns every declared mapping. Useful
 * for the consequence-applier test ensuring no orphaned
 * options exist.
 */
export function listAllDeclaredConsequences(): ReadonlyArray<{
  voteId: string;
  optionId: string;
  payload: VoteRewardPayload;
}> {
  return Object.entries(REGISTRY).map(([key, payload]) => {
    const [voteId, optionId] = key.split("::");
    return { voteId, optionId, payload };
  });
}
