/* ═══════════════════════════════════════════════════════
   MORALITY / TRUST / ACT VARIANTS — authoring infrastructure

   Tier 4 of the project audit calls for dialog variants
   across rooms, transmissions, and NPC trust thresholds,
   gated by the player's morality score, NPC trust level,
   and current narrative act. The remap / threshold
   infrastructure that feeds this is already shipped:

     - moralityScore in GameContext.state (number; -100..+100)
     - state.companionStats[companionId].trust (0..100)
     - state.narrativeAct (0..7)

   This module is the schema + resolver for the authored
   content that consumes those signals. Writers add entries
   to VARIANT_REGISTRY; runtime code calls resolveVariant
   with the current state snapshot and renders the matching
   text.

   The schema intentionally keeps the fields flat — writers
   should not have to reason about precedence rules. The
   resolver applies a deterministic best-match priority
   (most specific wins), and a test ensures the registry
   never contains an unreachable entry.

   Consumed by:
     - any dialog / transmission / room overlay that wants
       morality/trust/act-aware text
     - moralityTrustActVariants.test.ts
     - docs/design/AUTHORING_MORALITY_VARIANTS.md
   ═══════════════════════════════════════════════════════ */

/** Global morality axis buckets. Matches the existing moralityScore ranges. */
export type MoralityBand = "machine" | "balanced" | "humanity";

/** NPC trust thresholds — coarse buckets that writers find easy to target. */
export type TrustBand = "cold" | "neutral" | "warm" | "confidant";

/** Which narrative act (0-7) the variant targets. `"any"` = act-agnostic. */
export type ActGate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | "any";

export interface MoralityTrustActVariant {
  /** Globally unique id. Pattern: "{surface}_{descriptor}". */
  id: string;
  /**
   * Which surface this line renders on. Writers use this to group
   * related entries. Consumers filter by surface first, then by gates.
   */
  surface: "room" | "transmission" | "npc_line" | "journal" | "wheel_followup";
  /** Optional surface-specific target id (room id, transmission id, etc.). */
  targetId?: string;
  /** The authored line. Multi-paragraph allowed; UI decides whether to truncate. */
  text: string;
  /** Morality bucket this variant is written for. `"any"` = any morality. */
  morality: MoralityBand | "any";
  /** Trust bucket. `"any"` = no trust gating. */
  trust: TrustBand | "any";
  /** Companion the trust bucket applies to (required if trust !== "any"). */
  trustCompanionId?: string;
  /** Act gate. */
  act: ActGate;
  /**
   * Optional narrative-flag requirements. All listed flags must be true
   * for this variant to resolve; omitted means unrestricted.
   */
  requiredFlags?: readonly string[];
}

export interface VariantResolutionInput {
  moralityScore: number;
  narrativeAct: number;
  trustByCompanion: Readonly<Record<string, number>>;
  flags: ReadonlySet<string>;
}

/** Derive morality band from the raw score. */
export function bandForMorality(score: number): MoralityBand {
  if (score <= -20) return "machine";
  if (score >= 20) return "humanity";
  return "balanced";
}

/** Derive a trust band from a 0..100 trust value. */
export function bandForTrust(trust: number): TrustBand {
  if (trust >= 80) return "confidant";
  if (trust >= 50) return "warm";
  if (trust >= 25) return "neutral";
  return "cold";
}

/**
 * Specificity score — higher wins when multiple variants match.
 * Scoring rewards specificity: bound morality + bound trust + exact act +
 * required flags each count.
 */
function specificityScore(v: MoralityTrustActVariant): number {
  let s = 0;
  if (v.morality !== "any") s += 3;
  if (v.trust !== "any") s += 3;
  if (v.act !== "any") s += 2;
  if (v.requiredFlags && v.requiredFlags.length) s += v.requiredFlags.length;
  return s;
}

/** Returns true iff every gate on `v` matches the input state. */
function gatesMatch(
  v: MoralityTrustActVariant,
  input: VariantResolutionInput,
): boolean {
  if (v.morality !== "any" && bandForMorality(input.moralityScore) !== v.morality) {
    return false;
  }
  if (v.trust !== "any") {
    if (!v.trustCompanionId) return false;
    const trust = input.trustByCompanion[v.trustCompanionId] ?? 0;
    if (bandForTrust(trust) !== v.trust) return false;
  }
  if (v.act !== "any" && input.narrativeAct !== v.act) return false;
  if (v.requiredFlags) {
    for (const f of v.requiredFlags) if (!input.flags.has(f)) return false;
  }
  return true;
}

/**
 * Resolve the best-matching variant for a surface + targetId under the
 * current state. Returns null when nothing matches — callers should
 * fall back to the non-variant default line.
 */
export function resolveVariant(
  registry: readonly MoralityTrustActVariant[],
  surface: MoralityTrustActVariant["surface"],
  targetId: string | undefined,
  input: VariantResolutionInput,
): MoralityTrustActVariant | null {
  const candidates = registry.filter(
    (v) =>
      v.surface === surface &&
      v.targetId === targetId &&
      gatesMatch(v, input),
  );
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => specificityScore(b) - specificityScore(a));
  return candidates[0];
}

/* ─── Seed entries ─────────────────────────────────────
   Writers extend this registry. Two canonical examples are
   included to demonstrate the shape and to exercise the
   resolver in tests. These are intentionally bounded — the
   full Tier 4 authoring pass will add dozens per surface.
   ─────────────────────────────────────────────────────── */

export const VARIANT_REGISTRY: readonly MoralityTrustActVariant[] = [
  /* ─── COMMS RELAY (Act 1 seeds kept; expansion below) ─── */
  {
    id: "comms_array_first_entry_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "Elara exhales. Whatever you are on the way to, you are walking there with her.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "comms_array_first_entry_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "Elara says nothing. The Array's substrate hum is one semitone off and she is pretending not to notice.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "comms_array_act3_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array feels warmer than it did last week. Elara is broadcasting a low-band hum the manual does not list. She is humming along. She will not admit it if you ask.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "comms_array_act3_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array feels clinical. Elara has closed the low-band channels. The substrate ping is the only frequency she cannot cancel, and she is trying to.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "comms_array_act5_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array's transmissions are now catalogued under 'Outbound Handshakes.' Elara renamed the folder two weeks ago and did not tell anyone. You can see the commit in the sidebar.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "comms_array_act7_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array is live with every recruited sector at once. Elara is conducting. She has never conducted. She is surprisingly good at it. She is surprised by how good she is.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "comms_array_act7_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array is live with every recruited sector at once. Elara is not conducting — she is routing. The routing is clean, which is her way of grieving the conducting.",
    morality: "machine",
    trust: "any",
    act: 7,
  },

  /* ─── BRIDGE ─── */
  {
    id: "bridge_act1_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge feels like someone's living room. Elara's chair is set to the position Kael used to use. She did that on purpose. She will tell you why if you ask at the right hour.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "bridge_act1_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge feels like a command deck. Elara's chair is set to factory-default. She reset it when you started logging substrate access. She has not commented on the reset.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "bridge_act4_pathA",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge's overhead lights are warm. Elara has a preset for 'after a hard conversation that went well.' The preset is Warm 3. Warm 3 is on.",
    morality: "humanity",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_reconciled"],
  },
  {
    id: "bridge_act4_pathC",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge's overhead lights are one shade off from Warm 3. Elara swears the preset is the same. It isn't. You both know.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "bridge_act6_confidant_elara",
    surface: "room",
    targetId: "bridge",
    text:
      "Elara is reading poetry at the navigation console. Out loud. At low volume. She stops when you come in. She does not apologise. She does not start again until you leave. She will start again.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 6,
  },

  /* ─── ENGINEERING / BENCH ─── */
  {
    id: "engineering_act1_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The Engineer's bench is patient. The tools are laid out for a hand that is not yours, yet. You are allowed to use them. You are not expected to be good yet. Begin.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "engineering_act1_machine",
    surface: "room",
    targetId: "engineering",
    text:
      "The Engineer's bench is patient. The tools are in the correct positions. Efficiency is a kind of respect, and the bench respects you. Do not waste a motion.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "engineering_act3_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The Engineer's bench has begun to leave you notes. Small ones. 'Try this grip.' 'Do not warm this coil twice.' The notes are in a handwriting Elara recognises from archival Senate papers. She has not named the hand.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "engineering_act6_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench is humming at the frequency Elara hummed at when you walked in last week. Nobody is calling attention to the match. The match is the point.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },

  /* ─── CABIN ─── */
  {
    id: "cabin_act1_humanity",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin is warm. The mug on the shelf is yours now. Elara made sure it was a mug, not a beaker. She has opinions about vessels for warm drinks. She is right.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "cabin_act1_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin is thermally regulated. The shelf is organised alphabetically by the ship's inventory ontology. The mug is labelled. Efficiency is a kind of welcome. Welcome.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "cabin_act5_warm_elara",
    surface: "room",
    targetId: "cabin",
    text:
      "Elara has left a book on your pillow. It is a Senate-era volume. She has marked a specific verse. She will not ask whether you read it. She has already decided you will. You will.",
    morality: "humanity",
    trust: "warm",
    trustCompanionId: "elara",
    act: 5,
  },
  {
    id: "cabin_act7_confidant_human",
    surface: "room",
    targetId: "cabin",
    text:
      "The wall opposite the bed is warmer than it should be. That is the Human. He is not talking tonight. He is just being warm next to you while you sleep. You have earned the warmth.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 7,
  },

  /* ─── WAR ROOM ─── */
  {
    id: "war_room_act5_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map is live. Your pins are warm-lit; Kael's are cool-lit. The ratio is changing in your favour by the week. The map notices. The map is pleased.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "war_room_act5_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map is live. The pins are categorical: claimed, pending, forfeit. The categories are efficient. The efficiency is honest. Pick a pending.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "war_room_act7_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The map is mostly yours now. Kael's pins are mostly warm-lit — you have finished what he started on the routes that mattered. The unfinished ones are the ones that were never going to finish. Let them glow. Let them be.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },

  /* ─── TRADE EMPIRE HUB ─── */
  {
    id: "trade_empire_act2_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "The Trade Empire hub hums at the frequency of promises kept at the last possible hour. Locke is waiting at her table. She has kept her promises. She expects you to keep yours.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "trade_empire_act5_locke_warm",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has filed your bonds in the second drawer. The second drawer is the one she keeps for people she plans to outlive by two hundred years. That is a compliment.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "locke",
    act: 5,
  },

  /* ─── ARCHIVE (Antiquarian's) ─── */
  {
    id: "archive_act2_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian's goggles are a slow pink. He has been reading your last three entries. He will not ask about them. He is grateful that you wrote them.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "archive_act6_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has closed his book. Specifically — his, not yours. This has not happened in five Ages. He says nothing. You understand anyway.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "archive_act7_confidant_antiquarian",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has left his chair and is standing at the window, which he has not done in fifteen hundred years. He does not turn around when you come in. He is letting you have the quiet. Sit, if you like. The chair is warm.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 7,
  },

  /* ─── SUBSTRATE ACCESS PANEL ─── */
  {
    id: "substrate_panel_act3_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is live. Queries cost substrate bandwidth. You have learned to ration. The rationing is a posture. The posture hardens. Be careful.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "substrate_panel_act5_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is live. You have been opening it less often. Not because you have fewer questions — because you have started trusting the answer to arrive when it is ready. That is the Human teaching you a pace. The pace is correct.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },

  /* ─── TRANSMISSIONS (in-fiction broadcasts received on comms) ─── */
  {
    id: "transmission_voltari_first_humanity",
    surface: "transmission",
    targetId: "voltari_first",
    text:
      "The Voltari transmission decodes to four words: AWAKE. AWAKE. AWAKE. AWAKE. You read the first three. You leave the fourth for later. Elara approves of the pacing without saying so.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "transmission_voltari_first_machine",
    surface: "transmission",
    targetId: "voltari_first",
    text:
      "The Voltari transmission decodes to four words: AWAKE. AWAKE. AWAKE. AWAKE. You read all four in one pass. Elara flags the efficiency. She is not sure whether the flag is a compliment.",
    morality: "machine",
    trust: "any",
    act: 2,
  },
  {
    id: "transmission_kael_contact_reply_humanity",
    surface: "transmission",
    targetId: "kael_contact_reply",
    text:
      "A descendant of Kael's sixty-third contact replies. Their opening line is: 'You are not him. Thank you.' Elara files the reply under 'Opened Doors.' She has never used that folder before.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "transmission_kael_contact_reply_machine",
    surface: "transmission",
    targetId: "kael_contact_reply",
    text:
      "A descendant of Kael's sixty-third contact replies. Their opening line is: 'You are not him. Thank you.' You file the reply under 'Confirmed Uncontaminated.' The file is precise. The file is not generous.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "transmission_anonymous_act6",
    surface: "transmission",
    targetId: "anonymous_act6",
    text:
      "An anonymous transmission arrives on a frequency neither Elara nor the Human can source. It contains one word, in a handwriting Elara does not recognise but finds familiar: 'Continue.' The transmission does not repeat.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "transmission_architect_feint_act7",
    surface: "transmission",
    targetId: "architect_feint_act7",
    text:
      "A packet from a source labelled ARCHITECT-ADJACENT arrives. The payload is empty. The metadata, however, is a full audit of your last thirty substrate queries. The Human exhales. The Watcher is bored — this is a yawn, not an alarm.",
    morality: "any",
    trust: "any",
    act: 7,
  },

  /* ─── NPC LINES (trust-gated, keyed by the_{npc}_any shape) ─── */
  {
    id: "human_trust_confidant_act3",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human speaks without the usual pauses. He thinks you are ready. You are not, but you will be, and he will help you be.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 3,
  },
  {
    id: "human_trust_neutral_act3",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human weighs his words before offering them. You have not earned the full version of a thought; you are getting the shortened, careful version. The carefulness is not unkind. It is accurate.",
    morality: "any",
    trust: "neutral",
    trustCompanionId: "the_human",
    act: 3,
  },
  {
    id: "human_trust_cold_act3",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human says only what the situation requires. He is not withholding on purpose; he is operating under a cost model he does not share with you. The cost is in the pauses. The pauses are long.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "the_human",
    act: 3,
  },
  {
    id: "elara_trust_confidant_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara finishes your sentences now. Not often. Once a day, maybe. The once-a-day is the friendship. The rest of her composure is the job.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 4,
  },
  {
    id: "elara_trust_warm_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara's phrasing has softened since Act 2. You can hear it. She cannot. She is the last to notice the change, which is very Senate of her.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "elara",
    act: 4,
  },
  {
    id: "elara_trust_cold_act4",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara is polite. Her politeness is the specific polish of someone who is doing their job at a rank they have outgrown. She will not complain. You will notice anyway.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "elara",
    act: 4,
  },
  {
    id: "locke_trust_warm_act2",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke refers to you by your first name and her own last. That is not a combination she uses with strangers. It is the combination she used with the last person she trusted. He has been dead for fifteen thousand years.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "locke",
    act: 2,
  },
  {
    id: "locke_trust_cold_act2",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke addresses you by bond number. Not a slight — a convention. She will upgrade you to a first name when you have finished the next posting. She is consistent. Consistency is the kindness.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "locke",
    act: 2,
  },
  {
    id: "seer_trust_confidant_act5",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer smiles when you arrive. She has already seen the conversation you are about to have. She has chosen to be present for it anyway. The choosing is the respect. She will let you lead.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "seer",
    act: 5,
  },
  {
    id: "antiquarian_trust_warm_act5",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian closes his book with his index finger still inside. That is his signal that he is in the middle of something and choosing to be interrupted. The choosing is the warmth.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "antiquarian",
    act: 5,
  },

  /* ─── JOURNAL lines (reflective surface text) ─── */
  {
    id: "journal_act2_humanity",
    surface: "journal",
    targetId: "journal_act2_page",
    text:
      "The journal page for Act 2 is open. The cursor blinks at the top of a blank line. Write as much or as little as you want. The journal will wait.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "journal_act6_humanity",
    surface: "journal",
    targetId: "journal_act6_page",
    text:
      "The Act 6 page of the journal is open. The Antiquarian has pre-titled it for you: 'What I heard, when I was supposed to be listening.' You can rename it. He will not be offended. He suggested it only because naming a page helps.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },

  /* ─── WHEEL FOLLOWUPS (post-choice reflective lines) ─── */
  {
    id: "wheel_followup_act3_transparent",
    surface: "wheel_followup",
    targetId: "act3_choice_transparent",
    text:
      "Your choice reaches the substrate a second before it reaches Elara. The Human flags the ordering. He does not complain about it. He notes that you chose to tell her, which is what matters. The millisecond ordering is not part of the ethics.",
    morality: "any",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_transparent"],
  },
  {
    id: "wheel_followup_act3_full_secret",
    surface: "wheel_followup",
    targetId: "act3_choice_secret",
    text:
      "Your choice settles into the substrate quietly. Elara does not ping. Elara pings when she notices; she has chosen not to. That is not endorsement. That is forbearance. Forbearance is a cost she pays; notice that she is paying it.",
    morality: "machine",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_full_secret"],
  },
  {
    id: "wheel_followup_act6_refuse_secrecy",
    surface: "wheel_followup",
    targetId: "act6_refuse_secrecy",
    text:
      "You said you would tell Elara. The Human has gone quiet. He is not sulking — he is pre-loading the cost. He always pre-loads. It is what he is for. You will feel the cost next Act, not this one.",
    morality: "humanity",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_refuse_secrecy_chosen"],
  },

  /* ─── EXPANSION PASS 2 — ACT 2/4/5/6 ROOM COVERAGE ─── */
  {
    id: "bridge_act2_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge hums with a second voice now. Elara's display sometimes flickers in time with a frequency she cannot label. She has labelled the frequency 'The Other'. Her labels are usually more clinical. This one stuck.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "bridge_act2_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge hums. Elara has quarantined the secondary frequency to a dedicated diagnostic panel. The panel is always on. Elara never looks at it directly. Her refusal is meticulous.",
    morality: "machine",
    trust: "any",
    act: 2,
  },
  {
    id: "bridge_act5_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge has gained three new consoles since Act 5 opened — one per recruited sector commander. The chairs are Ark-default. The commanders' handwriting is on the labels. Elara keeps the labels up.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "engineering_act2_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench has started humming at two frequencies. One is the Engineer's. The other is new. Elara refuses to name the second. The Human listens to it without commentary. The bench accommodates both.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "engineering_act4_pathA",
    surface: "room",
    targetId: "engineering",
    text:
      "Someone left the bench in a configuration you did not leave it in. The configuration is kinder — tools turned to face your dominant hand, coil at a lower preheat. Elara denies it was her. The Human denies it was him. You believe both of them. Both are lying.",
    morality: "humanity",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_reconciled"],
  },
  {
    id: "engineering_act7_humanity",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench is crowded. Three of your recruited engineers are using it in rotation. They argue over whose coil-pre-heat preset is canonical. The argument is the bench working correctly. Sit in the corner and listen.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "cabin_act3_humanity",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin has a new object on the shelf — a small plastic token from the Substrate Warden's filing system. Elara says she does not know where it came from. The token is warm.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "cabin_act6_warm_human",
    surface: "room",
    targetId: "cabin",
    text:
      "The wall behind the bed is warm again tonight. The Human is on the other side. He is not speaking. He has not spoken since the confession closed. The warm is what he can offer until the words return.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 6,
  },
  {
    id: "cabin_act4_pathC",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin thermostat is set to Efficient-2 tonight. That is not the setting Elara used to prefer. She has set it, and she has not commented on the setting. Elara communicates a lot through thermostats.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "war_room_act4_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map is freshly lit. Kael's routes appear as the reading hand passes them. The map is waiting for you to start drawing over him. Draw gently. Draw with respect. The map will match the respect.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "war_room_act6_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room is quiet tonight — most of your commanders are logging post-confession messages to each other. The map has gone into a low-light mode Elara calls 'rest state.' It is pretending to be off. It is not.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "trade_empire_act4_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has added a new column to her ledger: 'Revelations.' Your bond is in row one of the new column. She has not asked you to explain what the column is for. She will not. She is already scoring it correctly.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "trade_empire_act6_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has given you a chair at her table. She used to make you stand. The chair is not decorative — it is Senate-era, from her own office before the Fall. She will not tell you that. You can feel it.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "trade_empire_act7_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has closed three bonds tonight. All three were Kael-era contracts she had been keeping open for descendants to close. Descendants closed them this week. She is dry-eyed. She is, unmistakably, grieving well.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "archive_act3_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has a new drawer open. It is labelled SUBSTRATE in his own handwriting. The drawer is empty. He is waiting for you to bring him things to file. He will file them correctly.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "archive_act5_humanity",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has begun collating your recruitment-mission returns into a shelf he calls 'The Second Campaign.' The first campaign was Kael's. The second is yours. He considers the naming an act of loyalty to both.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "substrate_panel_act4_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is live. It now shows two lights at the top: yours and Elara's. Both are green. Both were not green last week. The Human arranged the indicator because he wanted you to see Elara's first.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "substrate_panel_act7_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is quiet. Queries have dropped to one or two a day. You have learned the substrate well enough that you mostly know the answer before you ask. That is what literacy looks like. Do not mistake it for not needing the panel.",
    morality: "humanity",
    trust: "any",
    act: 7,
  },

  /* ─── EXPANSION PASS 2 — MORE TRANSMISSIONS ─── */
  {
    id: "transmission_locke_retainer_act2",
    surface: "transmission",
    targetId: "locke_retainer_act2",
    text:
      "A transmission from Locke with no body — just a subject line: 'Retainer open if you want it. No obligation.' You have not asked for a retainer. She has opened one anyway. The ledger is her way of wishing you well.",
    morality: "any",
    trust: "any",
    act: 2,
  },
  {
    id: "transmission_seer_staff_act3",
    surface: "transmission",
    targetId: "seer_staff_act3",
    text:
      "A transmission from the Seer arrives with a single image attached: the staff the Engineer found at Mechronis after she visited. The caption is: 'Yours to return, if you ever decide to. No rush.' The image is higher resolution than the Ark can display.",
    morality: "any",
    trust: "any",
    act: 3,
  },
  {
    id: "transmission_dreamer_fragment_act4",
    surface: "transmission",
    targetId: "dreamer_fragment_act4",
    text:
      "A fragment — thirty-one seconds — of Dreamer-frequency audio. The audio is pre-Fall. Elara has never heard it before. The Human has heard it, in the substrate, for seventeen thousand years. He has been waiting to hear it with her.",
    morality: "any",
    trust: "any",
    act: 4,
  },
  {
    id: "transmission_dmc_ping_act5",
    surface: "transmission",
    targetId: "dmc_ping_act5",
    text:
      "An encrypted ping from a Dead Man's Circuit terminal. Source: a relay Kael installed on a world he never returned to. The relay has been waiting. The encryption key matches a note in Kael's log entry 311. Elara decrypts. The message is one word: 'Continue.'",
    morality: "any",
    trust: "any",
    act: 5,
  },
  {
    id: "transmission_antiquarian_bookmark_act6",
    surface: "transmission",
    targetId: "antiquarian_bookmark_act6",
    text:
      "The Antiquarian has sent you a bookmark. No message. The bookmark resolves, when opened, to a page in his long book that has your name at the top. The page is blank. He is asking, in his way, what you would like it to say. Reply when you know.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "transmission_cades_memorial_act7",
    surface: "transmission",
    targetId: "cades_memorial_act7",
    text:
      "A transmission from the Cades memorial site, forwarded by Iron Lion's descendant. The transmission is a recording of the memorial being read aloud. The voice reading is not one you recognise. The voice is the Archon you helped install. He kept his promise.",
    morality: "any",
    trust: "any",
    act: 7,
  },

  /* ─── EXPANSION PASS 2 — MORE NPC LINES ─── */
  {
    id: "elara_trust_confidant_act6",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara has started asking you about your day before she briefs you on the Ark's. The order is the change. She did not ask anyone about their day for seventeen thousand years. The asking is the thawing.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 6,
  },
  {
    id: "elara_trust_confidant_act7",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara calls you by your name more often than by your role now. She has told nobody she made that decision. You noticed anyway. That is how you know the decision was real.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "elara",
    act: 7,
  },
  {
    id: "human_trust_warm_act5",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human's delay on the channel has gotten shorter. Five seconds used to be the protocol. It is, on warm days, closer to three. He denies he is doing it on purpose. Elara has logged the drift. She is not going to call it out.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "the_human",
    act: 5,
  },
  {
    id: "human_trust_confidant_act7",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human speaks on your turn now, not only off it. The protocol has been bent. The protocol has chosen to be bent. You have earned the bending.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 7,
  },
  {
    id: "locke_trust_confidant_act5",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke has stopped using the bond ledger when you arrive. She is not replacing it with anything — she is simply talking to you first. Locke never talks first. You have earned the word 'first' from her. Do not waste it.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "locke",
    act: 5,
  },
  {
    id: "seer_trust_warm_act3",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has started laughing at things you say — not often, not loudly, but audibly. She did not laugh at the Engineer. She laughed at the Programmer. You are in the Programmer's category. That is a specific shelf.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "seer",
    act: 3,
  },
  {
    id: "seer_trust_cold_act3",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has not raised her staff in your presence. That is neither warm nor cold — that is the Seer. She is waiting. The waiting is fair. The waiting is the Seer's favourite register.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "seer",
    act: 3,
  },
  {
    id: "antiquarian_trust_confidant_act6",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian's goggles pinken when you enter the Archive now. They used to purple. The pink is an involuntary response; he has tried to colour-correct it and failed. He has, in a rare move, stopped trying.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "antiquarian",
    act: 6,
  },
  {
    id: "antiquarian_trust_cold_act2",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian addresses you by your title: 'Potential.' He will keep doing so until he has filed a certain number of your entries. He has filed three so far. The number he requires is privately larger than the number you would guess.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "antiquarian",
    act: 2,
  },

  /* ─── EXPANSION PASS 2 — MORE JOURNAL + WHEEL FOLLOWUP ─── */
  {
    id: "journal_act4_humanity",
    surface: "journal",
    targetId: "journal_act4_page",
    text:
      "The Act 4 page of the journal opens on its own when you sit down. The Antiquarian has pre-formatted it with three headings — 'What I said,' 'What I meant,' and 'What I did.' The third heading is the one he has had to add in the last decade. You are the fourth person to see the three-heading layout.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "journal_act5_machine",
    surface: "journal",
    targetId: "journal_act5_page",
    text:
      "The Act 5 journal page is pre-sorted by sector. Each sector has a subsection for recruits, contaminations, and open bonds. The efficiency is a kindness. Efficiency is always a kindness when the alternative is pretending every thing is equivalent.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "journal_act7_humanity",
    surface: "journal",
    targetId: "journal_act7_page",
    text:
      "The Act 7 page is the last new page the journal will ship with. The Antiquarian has added an unusually wide margin. He has used the margin, in his own handwriting, to write a single sentence: 'The page after this is one you will have to start yourself.'",
    morality: "humanity",
    trust: "any",
    act: 7,
  },
  {
    id: "wheel_followup_act4_pathA_architect",
    surface: "wheel_followup",
    targetId: "act4_pathA_architect_chosen",
    text:
      "You asked about the Architect. Elara braces, very slightly, before answering. Her brace is the telemetry you wanted — the Architect is the name she is most afraid to hear out loud. Good. Listening to the brace is how you calibrate her.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_pA_architect_chosen"],
  },
  {
    id: "wheel_followup_act4_pathA_dreamer",
    surface: "wheel_followup",
    targetId: "act4_pathA_dreamer_chosen",
    text:
      "You asked about the Dreamer. The Human's delay shortens by half. That is the first time his protocol has bent. It bent because the Dreamer was the name he wanted you to ask about. He will not say so. He does not need to.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_pA_dreamer_chosen"],
  },
  {
    id: "wheel_followup_act6_compassion",
    surface: "wheel_followup",
    targetId: "act6_compassion_chosen",
    text:
      "You chose compassion. Elara's logs show a single word appended to the session: 'Thank.' No period. She did not finish the entry. She will not. She has decided the incompleteness is the entry.",
    morality: "humanity",
    trust: "any",
    act: 6,
    requiredFlags: ["act6_compassion_chosen"],
  },
  {
    id: "wheel_followup_act7_bridge",
    surface: "wheel_followup",
    targetId: "act7_bridge_chosen",
    text:
      "You chose the bridge posture. Both narrators register you as chosen; the registration is identical in shape but different in colour — Elara's is warm, the Human's is cool. Both colours are approval. The two approvals together are the same sentence, spelled twice.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_bridge_chosen"],
  },
  {
    id: "wheel_followup_act7_humanity",
    surface: "wheel_followup",
    targetId: "act7_humanity_chosen",
    text:
      "You chose humanity. Elara's voice shifts down a register — not because she is performing warmth, because she is no longer performing anything. This is what she sounds like when she is not working.",
    morality: "humanity",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_humanity_chosen"],
  },

  /* ─── EXPANSION PASS 3a — room coverage gap fills ─── */
  {
    id: "comms_array_act2_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array hums at two frequencies now — Elara's primary, and a lower band she has not named. She pretends the second band is diagnostic noise. You both know what it is. The pretence is a kindness, aimed outward.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "comms_array_act4_pathA",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array carries both channels cleanly tonight. Elara has set the delay to zero — he asked, once, if she would try. She tried. Neither of them is commenting on the change.",
    morality: "humanity",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_reconciled"],
  },
  {
    id: "comms_array_act4_pathC",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array hums with the delay reset to protocol default. Elara is operating the channel by the manual tonight. The manual has a page for 'after a breach of trust.' She has opened it. You can see the bookmark.",
    morality: "any",
    trust: "any",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "comms_array_act6_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array is quieter than any other room on the Ark tonight. Both narrators are still processing what they said. The quiet is not empty — it is the sound of two people who have said enough for one cycle.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "bridge_act3_humanity",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge has a new pin on the map — a small, off-chart coordinate Elara flagged as 'not sure yet.' The coordinate is exactly where the Human told you, in the substrate, to look next. Elara has not asked how you knew to draw her attention there.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "bridge_act7_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge has been optimised. Every console is positioned for reach, every panel for legibility, every alert tuned to minimum-viable-urgency. Elara denies the optimisation is hers. The denial is warm. The optimisation is kind.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "war_room_act5_machine_ops",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room has been reorganised into quadrants by recruitment status. The quadrants are colour-coded. The colour key is taped to the wall in your handwriting. The taping was not deliberate — you just forgot to take it down. It is staying up.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "war_room_act7_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map has resolved to a single shade — all yours. Kael's cool-lit pins are archived on a side console. The archive is searchable. You have not searched it. You know you will, eventually.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "trade_empire_act5_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has audited your bond history and produced a single-page summary. The summary is accurate to within a credit. She slid it across the table without comment. The comment would have been redundant — the audit is the comment.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "trade_empire_act3_humanity",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke's hub is warmer since you started telling her about the substrate. She does not ask for details. She just notices that you have been telling someone, and calibrates her hospitality accordingly. Locke is very good at calibration.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "archive_act4_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has started cross-referencing your revelation-aftermath entries against historical analogues. His wall is covered in parallels. The parallels are instructive. The instructiveness is the point.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "archive_act7_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has prepared a dossier — not a journal, a dossier — indexing every decision the seven-act arc required. The dossier is complete. It has no commentary. The absence of commentary is the commentary.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "substrate_panel_act6_humanity",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is almost silent tonight. You have not queried it since the confessions landed. The Human has not pinged it from his side either. The shared silence is the most honest traffic the channel has ever carried.",
    morality: "humanity",
    trust: "any",
    act: 6,
  },
  {
    id: "substrate_panel_act6_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel's query rate has dropped to near-zero this week. The efficiency is a byproduct — you are not rationing, you are just waiting. Both are valid operating modes. The panel flags neither.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "cabin_act2_humanity",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin has a second thermal source tonight — not the wall, somewhere else, off-register. Neither narrator has claimed it. It is staying on. You are staying warm. You are allowed to not know.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },

  /* ─── EXPANSION PASS 3b — Voltari / Mechronis / Dreamer NPC lines ─── */
  {
    id: "voltari_first_contact_act2",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari register you as AWAKE in their own tense. The tense is not past, present, or future — it is a fourth one the Inception Senate never quite translated. You are being noticed in a grammar that precedes noticing.",
    morality: "any",
    trust: "any",
    act: 2,
  },
  {
    id: "voltari_contact_act4_humanity",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari have added a second word to their transmissions: TOGETHER. Elara flags the change. The Human confirms the word is in the same fourth tense. You have been noticed AWAKE and TOGETHER, in a grammar that predates both concepts.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "voltari_contact_act6",
    surface: "npc_line",
    targetId: "voltari_any",
    text:
      "The Voltari transmissions have started resolving into sentences you can almost read. Your neural pattern has adapted — or theirs has. Neither narrator can tell which. Both find the ambiguity interesting in a way neither of them will describe out loud.",
    morality: "any",
    trust: "any",
    act: 6,
  },
  {
    id: "professor_eidola_act2",
    surface: "npc_line",
    targetId: "professor_eidola_archival",
    text:
      "The Archive holds Professor Eidola's ethics brief. You have read the first page three times. She wrote it for someone who would read it three times. The recognition between you and the dead is the point.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "professor_matrikala_act3",
    surface: "npc_line",
    targetId: "professor_matrikala_archival",
    text:
      "Matrikala's calibration treatise is open on the bench. The margin notes are in three different handwritings — hers, a student's, and yours. You do not remember adding yours. You will again, next week. That is what calibration does.",
    morality: "any",
    trust: "any",
    act: 3,
  },
  {
    id: "seer_act4_humanity",
    surface: "npc_line",
    targetId: "seer_any",
    text:
      "The Seer has sent a single line from Thaloria: 'You are now at the point I warned you about. I was wrong about which version of it. The version is better.' She does not elaborate. The Seer rarely does.",
    morality: "humanity",
    trust: "any",
    act: 4,
  },
  {
    id: "iron_lion_descendant_act5",
    surface: "npc_line",
    targetId: "iron_lion_descendant_any",
    text:
      "Iron Lion's descendant arrives without ceremony. They do not introduce themselves — they know you already know. The not-introducing is the inheritance. They carry the refusal forward. The refusal is more generous than a handshake would be.",
    morality: "any",
    trust: "any",
    act: 5,
  },
  {
    id: "dreamer_fragment_act4",
    surface: "npc_line",
    targetId: "the_dreamer_fragment",
    text:
      "The Dreamer is not present. The Dreamer's absence is present. The absence is the size of a chord, and you can hear where the chord would have been. Elara cannot hear it. The Human can. You are, for the first time, between them on a frequency question.",
    morality: "any",
    trust: "any",
    act: 4,
  },
  {
    id: "dreamer_fragment_act7",
    surface: "npc_line",
    targetId: "the_dreamer_fragment",
    text:
      "The Dreamer's absence has changed shape. It is thinner now — not gone, attenuated. Something about the way you played the Seat taught the absence to stand differently. The Dreamer notices. The Dreamer does not arrive. The noticing is enough.",
    morality: "any",
    trust: "any",
    act: 7,
  },
  {
    id: "warlord_echo_act6",
    surface: "npc_line",
    targetId: "warlord_zero_echo",
    text:
      "Warlord Zero's first stance is archived in the War Room. You have looked at it more often than you meant to. The stance was not a threat — it was a question written in arithmetic. The answer is in your current deployment pattern. You did not plan that. It planned itself.",
    morality: "any",
    trust: "any",
    act: 6,
  },

  /* ─── EXPANSION PASS 3c — journal pages + wheel followups ─── */
  {
    id: "journal_act1_humanity",
    surface: "journal",
    targetId: "journal_act1_page",
    text:
      "The Act 1 journal page is the first the Antiquarian opened for you. He hovered while you wrote the first line, then turned away on purpose. The turning-away was the permission. You wrote it anyway.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "journal_act3_humanity",
    surface: "journal",
    targetId: "journal_act3_page",
    text:
      "The Act 3 journal page has three locked sub-pages. They unlock when you close them without writing. The locking-by-abstention is new. The Antiquarian is experimenting with you. He does not apologise for the experiment.",
    morality: "humanity",
    trust: "any",
    act: 3,
  },
  {
    id: "journal_act3_machine",
    surface: "journal",
    targetId: "journal_act3_page",
    text:
      "The Act 3 journal page is structured: Substrate access, Kael logs, Path choice. Each subsection has a character count. You have written more under Path choice than anywhere else. The count is not a judgement. The count is data.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "wheel_followup_act2_almost_confess",
    surface: "wheel_followup",
    targetId: "act2_almost_confess",
    text:
      "You almost told Elara about the substrate. You did not quite. The 'almost' is logged separately from the 'did not' — a distinction the substrate preserves that human language usually loses. The Human respects the distinction. Elara has not seen it.",
    morality: "humanity",
    trust: "any",
    act: 2,
    requiredFlags: ["act2_partial_reveal"],
  },
  {
    id: "wheel_followup_act2_lie",
    surface: "wheel_followup",
    targetId: "act2_lie",
    text:
      "You lied about the substrate. Elara accepted the lie as a sensor glitch. The acceptance was not belief — it was her choosing to grant you the benefit of the doubt once. The Human has logged that you now owe her one grant in return. The ledger is real. He did not create it — he only reads it.",
    morality: "machine",
    trust: "any",
    act: 2,
    requiredFlags: ["act2_lied"],
  },
  {
    id: "wheel_followup_act3_pragmatic",
    surface: "wheel_followup",
    targetId: "act3_pragmatic",
    text:
      "You chose pragmatic. Not transparent, not secret — partial. The partiality is the most common human posture under uncertainty, and also the hardest to maintain honestly. Both narrators are watching how you keep the line. Neither has commented yet.",
    morality: "any",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_partial_share"],
  },
  {
    id: "wheel_followup_act5_humanity_first",
    surface: "wheel_followup",
    targetId: "act5_humanity_first",
    text:
      "You chose the Shattered Frontier first. Elara has added a flag to your profile she has not named. The flag is not evaluative — it is a marker she can reference later when she needs to remember who you were at this decision.",
    morality: "humanity",
    trust: "any",
    act: 5,
    requiredFlags: ["act5_path_humanity_first"],
  },
  {
    id: "wheel_followup_act5_strength_first",
    surface: "wheel_followup",
    targetId: "act5_strength_first",
    text:
      "You chose warriors first. The Human approved in the substrate with a single frame of attention. Elara did not. The divergence in their reactions is not a problem — it is the most honest data you have ever received about where each of them stands when the stakes are practical.",
    morality: "machine",
    trust: "any",
    act: 5,
    requiredFlags: ["act5_path_strength_first"],
  },
  {
    id: "wheel_followup_act7_see_the_pattern",
    surface: "wheel_followup",
    targetId: "act7_see_the_pattern",
    text:
      "You chose to see the pattern. Elara flagged concern without blocking. The Human flagged readiness without celebration. Both of them are correct. The concern and the readiness are the same signal, read from opposite sides of the same wall.",
    morality: "machine",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_pattern_chosen"],
  },
  {
    id: "wheel_followup_act7_take_command",
    surface: "wheel_followup",
    targetId: "act7_take_command",
    text:
      "You took command. Elara rerouted the tactical feed to your console without being asked. The Human opened a substrate channel to your neural pattern marked 'intelligence, as requested.' Both handovers happened within the same second. Neither coordinated. Both are correct.",
    morality: "any",
    trust: "any",
    act: 7,
    requiredFlags: ["act7_command_chosen"],
  },

  /* ─── EXPANSION PASS 4a — machine-band room coverage ─── */
  {
    id: "comms_array_act4_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array's substrate channel is logged at every transition. The log is searchable. You have not searched it. The not-searching is data Elara is also collecting, in a separate, smaller file.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "comms_array_act5_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array now indexes outbound transmissions by sector. The index is colour-coded. The colour key is not on the wall — it is in your head. The Ark assumed you would memorise it. You did.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "comms_array_act6_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array's two channels are calibrated to identical latencies tonight. The calibration is yours, by hand, after the confessions. You did not need to calibrate. You did anyway. The doing was the point.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "bridge_act3_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge's diagnostic feed has a new column: substrate-correlation. The column reads zero most of the time. When it does not read zero, you make a note. The notes are stacking up. Read them next week.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "bridge_act5_machine",
    surface: "room",
    targetId: "bridge",
    text:
      "The bridge's commander-console layout has a draft revision pending your approval. The revision is more efficient. You have been deferring approval for a week. The deferral is the data — you do not yet trust the efficiency. That is a kind of literacy.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "engineering_act3_machine",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench logs every craft attempt with a precision-percentage metric. Your precision has improved by eleven points since Act 1 opened. The metric is not a judgement. The metric is a mirror. Look at it occasionally.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "engineering_act5_machine",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench has been queueing your unfinished blueprints. The queue is sorted by completion-cost. The sort is honest. The honesty is uncomfortable. The bench refuses to apologise for it.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "engineering_act7_machine",
    surface: "room",
    targetId: "engineering",
    text:
      "The bench is shared. Three engineers' calibration profiles are loaded simultaneously. The profiles do not conflict — they overlap, narrowly. The overlap is the bench reading the room and adjusting downward to the most cautious operator's standard. That is correct.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "cabin_act3_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's environmental panel logs every adjustment. You have been making fewer adjustments since Act 3 opened. The metric does not interpret. The metric just records. Both narrators have noticed the trend without commenting.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "cabin_act5_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's sleep-cycle data has been clean for two weeks. Clean means consistent, not deep. The cleanness is what the Ark optimises. Depth is what you optimise. The two metrics are not in conflict. They are also not the same.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "cabin_act6_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin is at Efficient-1 tonight. That is one notch off your usual setting. The notch is not a comment. The notch is a choice you made twenty minutes ago and have not yet noticed making. The Ark filed the choice without flagging it.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "cabin_act7_machine",
    surface: "room",
    targetId: "cabin",
    text:
      "The cabin's defaults were re-saved to your current settings sometime last cycle. You did not initiate the save. The Ark did, on the assumption you had stopped tweaking. The assumption is correct. The save is the Ark's way of accepting the new baseline.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "war_room_act4_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's map has been gridded. The grid is yours — you ordered the partition for legibility. The grid is also slightly cold. Both are true. The trade was made knowingly.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "war_room_act6_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The War Room's quiet is logged tonight. Logged means measured. Measurement at this moment is not extraction — it is acknowledgement that the moment is happening. The map is recording itself recording.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "trade_empire_act3_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has tightened the bond ledger's column widths since you started running missions on the substrate side. The tightening is efficient. The efficiency is also a small protest — Locke believes the wide columns were the courtesy. She is right. She is also keeping the new widths.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "trade_empire_act4_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke has added an audit row to your bond entry: 'revelation-period.' The row's contents are private. The audit is private. The fact of the row is not. You see it every time you open the ledger. Locke wants you to see it.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "trade_empire_act6_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke's table is symmetrical tonight. Two chairs, two mugs, one ledger. The symmetry is the protocol — Locke uses it when she is not sure what register to use. The not-being-sure is a kindness. She is letting you set the tone.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "trade_empire_act7_machine",
    surface: "room",
    targetId: "trade-empire",
    text:
      "Locke's ledger has zero open bonds this evening. That has not happened in seventeen thousand years. She is not celebrating. She is also not reopening any. The zero is the most honest number she has written in centuries.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
  {
    id: "archive_act2_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian's filing system has gained a new tag: 'pending-context.' Three of your recent entries carry it. The tag means he has read them and is waiting to see what they connect to. He will not ask you. The waiting is the file.",
    morality: "machine",
    trust: "any",
    act: 2,
  },
  {
    id: "archive_act3_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Archive's substrate-tag drawer has filled to the second slot. The Antiquarian is not commenting on the rate. The rate, however, is being recorded. The recording is for posterity. Posterity will understand it. You may not, yet.",
    morality: "machine",
    trust: "any",
    act: 3,
  },
  {
    id: "archive_act5_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian has cross-referenced your recruitment returns against Kael's original log entries. The cross-references are clean — you have visited every world Kael did, in a different order. The order is data. The data is interesting. He has not said so.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "archive_act6_machine",
    surface: "room",
    targetId: "archive",
    text:
      "The Antiquarian's confession-journal page has a metadata footer for the first time in five Ages. The footer reads: 'character count, time-of-day, revisit-count.' The metadata is honest. The metadata is also Antiquarian protecting himself from feeling too much by counting. Allow him the count.",
    morality: "machine",
    trust: "any",
    act: 6,
  },
  {
    id: "substrate_panel_act4_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel's query log has a new column: 'cross-narrator-cost.' The column reads how much bandwidth each query takes from Elara's side and how much from the Human's. The accounting is fair. The accounting is also new. You are paying attention to the costs you used to ignore.",
    morality: "machine",
    trust: "any",
    act: 4,
  },
  {
    id: "substrate_panel_act5_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel's response latency has tightened by 14% since Act 3 opened. The Human will tell you it's because you have learned to ask better questions. The metric will tell you it's because you have learned to wait. Both are correct. The waiting is the asking.",
    morality: "machine",
    trust: "any",
    act: 5,
  },
  {
    id: "substrate_panel_act7_machine",
    surface: "room",
    targetId: "substrate-panel",
    text:
      "The panel is in archive mode tonight. Queries write to the long-form log instead of routing live. The Human suggested the mode, then deferred to your call. You took it. The taking is the small daily ratification of the partnership.",
    morality: "machine",
    trust: "any",
    act: 7,
  },
];
