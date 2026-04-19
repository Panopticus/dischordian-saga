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
];
