/* ═══════════════════════════════════════════════════════
   RESURRECTION PROTOCOLS — Cosmic petition quest

   When a recruited NPC dies, total death is initial. The
   Human and Elara open the *Resurrection Protocols* — a
   petition to the Resurrectionist Ne-Yon (entity_40,
   "The Cycle Walker"), mediated by the Degen since the
   Resurrectionist himself has vanished from the universe
   along with all other Ne-Yons except the Degen.

   See LORE_BIBLE.md:4531-4558 — Samsara is a machine, and
   they have found its controls. Died seven times and
   returned each time with new knowledge.

   Two outcomes:
    A. Player completes the quest. NPC resurrected on the
       Inception Ark, joins crew, remembers their death.
    B. Player ignores the quest. At the next global
       Necromancer event (necromancerCycle.ts:Manifesting)
       or act-progression beat that requires the NPC alive,
       the unmediated Samsara machine returns them off-ship
       with reputation hit and "I'm back. No thanks to you."

   This module is consumed by:
    - apps/server/routers/resurrectionProtocols.ts (tRPC)
    - apps/shared/crewTick.ts (death-time enqueue)
    - apps/shared/necromancerCycle.ts (Path B trigger)
    - apps/client/src/components/resurrection/ResurrectionProtocolPanel.tsx
   ═══════════════════════════════════════════════════════ */

/** The five canonical NPCs that can be recruited at tier 5 and
 *  thus run the Resurrection Protocols quest if they die. */
export const RESURRECTABLE_NPC_KEYS = [
  "vex_solene",
  "wraith_calder",
  "locke",
  "jericho_jones",
  "akai_shi",
] as const;

export type ResurrectableNpcKey = typeof RESURRECTABLE_NPC_KEYS[number];

/** Death-and-rebirth cinematic id for each resurrectable NPC.
 *  Plays the first time an NPC is reanimated, via either Path A
 *  (player-completed quest) or Path B (Necromancer-event auto
 *  return). Resolves against CINEMATICS in
 *  apps/shared/expansionArt/cinematicsManifest.ts; parity is
 *  enforced by apps/shared/_completeness/checks/resurrectionCinematicCoverage.ts.
 *  Server-side: set `pending_resurrection_cinematic_<npcKey>` on
 *  the quest's `completed_path_a` / `completed_path_b` transition.
 *  Client-side: ResurrectionCinematicRouter watches the flag,
 *  plays the cinematic, then stamps
 *  `resurrection_cinematic_<npcKey>_seen` so it never replays. */
export const RESURRECTION_CINEMATIC_BY_NPC: Readonly<
  Partial<Record<ResurrectableNpcKey, string>>
> = {
  wraith_calder: "wraith_calder_syndicate_of_death",
  akai_shi: "akai_shi_necromancers_lair",
} as const;

/** Pending-cinematic flag name. Server sets this on resurrection
 *  completion; the router consumes it. */
export function pendingResurrectionCinematicFlag(
  npcKey: ResurrectableNpcKey,
): string {
  return `pending_resurrection_cinematic_${npcKey}`;
}

/** Seen-cinematic flag name. Router stamps this on completion;
 *  acts as the idempotency gate. */
export function resurrectionCinematicSeenFlag(
  npcKey: ResurrectableNpcKey,
): string {
  return `resurrection_cinematic_${npcKey}_seen`;
}

/** Each sub-task touches a different game system. The quest
 *  picks 4 of these 7 procedurally per (userId, npcKey, deathCycle). */
export const PROTOCOL_SUBTASK_IDS = [
  "forge_the_vessel",
  "lineage_imprint",
  "hellbox_cycle_echo",
  "soul_stone_catalyst",
  "trade_empire_tribute",
  "loredex_witness",
  "confession_trial",
] as const;

export type ProtocolSubtaskId = typeof PROTOCOL_SUBTASK_IDS[number];

export interface ProtocolSubtaskDef {
  id: ProtocolSubtaskId;
  /** System this sub-task touches. Drives the UI badge. */
  system:
    | "crafting"
    | "breeding"
    | "hellbox"
    | "soul_stones"
    | "trade_empire"
    | "loredex"
    | "tcg";
  /** Player-facing brief. */
  title: string;
  /** What the player must do. */
  description: string;
  /** Probability weight at procedural roll time. Confession Trial
   *  is intentionally heavier — it's the most narratively charged. */
  weight: number;
}

export const PROTOCOL_SUBTASKS: Record<ProtocolSubtaskId, ProtocolSubtaskDef> = {
  forge_the_vessel: {
    id: "forge_the_vessel",
    system: "crafting",
    title: "Forge the Vessel",
    description:
      "Craft a tier-3+ container schematic specific to the deceased's home faction. Materials cost ~3× normal recipe — the Vessel must be worth holding a soul.",
    weight: 1.0,
  },
  lineage_imprint: {
    id: "lineage_imprint",
    system: "breeding",
    title: "Lineage Imprint",
    description:
      "Successfully breed and hatch a crew member sharing the deceased's bloodline. The Cycle Walker reads continuity through lineage; without an heir the petition has no purchase.",
    weight: 1.0,
  },
  hellbox_cycle_echo: {
    id: "hellbox_cycle_echo",
    system: "hellbox",
    title: "Hellbox Cycle Echo",
    description:
      "Perform one Hellbox restoration of a fallen apprentice first. The salvage-tech echo establishes that you understand what resurrection costs in miniature before you ask for it cosmically.",
    weight: 1.0,
  },
  soul_stone_catalyst: {
    id: "soul_stone_catalyst",
    system: "soul_stones",
    title: "Soul-Stone Catalyst",
    description:
      "Bind 3 corrupted soul stones into a Catalyst item. Optionally bind a demon and then purify it — the bind-and-release act is what the Degen will accept as the Catalyst's signature.",
    weight: 1.0,
  },
  trade_empire_tribute: {
    id: "trade_empire_tribute",
    system: "trade_empire",
    title: "Trade-Empire Tribute",
    description:
      "Complete a 5-mission run themed around the deceased's home faction. Influence accrued during the run is converted to Tribute at the Resurrectionist's altar.",
    weight: 1.0,
  },
  loredex_witness: {
    id: "loredex_witness",
    system: "loredex",
    title: "Loredex Witness",
    description:
      "Discover and read 5 entries from the Resurrectionist-adjacent lore pool: Samsara, the Cycle, the Necromancer-Banishment arc, the Architect's design. The Cycle Walker requires the petitioner to know what they're asking for.",
    weight: 1.0,
  },
  confession_trial: {
    id: "confession_trial",
    system: "tcg",
    title: "Confession Trial",
    description:
      "Win a PvE Trial card-game session in the Confession category, with the deceased's imprint card present in the deck. The card is memorial-only after their death — surfacing it once more is the petitioner's confession of the loss.",
    weight: 2.5,
  },
};

/* ─── PROCEDURAL ROLL ─── */

/** Deterministic per-(userId, npcKey, deathCycle) recipe roll: pick 4 of 7
 *  subtasks weighted by `weight`. confession_trial is heavily weighted so
 *  it lands ~80% of the time but isn't guaranteed. Pure function. */
export function rollProtocolRecipe(
  seed: number,
): ProtocolSubtaskId[] {
  // Linear congruential RNG seeded by `seed`. Pure.
  let s = (seed | 0) || 1;
  const rng = (): number => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 100_000) / 100_000;
  };

  const pool = [...PROTOCOL_SUBTASK_IDS];
  const picked: ProtocolSubtaskId[] = [];
  while (picked.length < 4 && pool.length > 0) {
    const totalWeight = pool.reduce(
      (sum, id) => sum + PROTOCOL_SUBTASKS[id].weight,
      0,
    );
    let r = rng() * totalWeight;
    let chosenIdx = 0;
    for (let i = 0; i < pool.length; i++) {
      r -= PROTOCOL_SUBTASKS[pool[i]].weight;
      if (r <= 0) {
        chosenIdx = i;
        break;
      }
    }
    picked.push(pool[chosenIdx]);
    pool.splice(chosenIdx, 1);
  }
  return picked;
}

/* ─── QUEST STATE ─── */

export type ResurrectionQuestStatus =
  | "open"
  | "in_progress"
  | "completed_path_a"
  | "completed_path_b";

export interface ResurrectionQuestState {
  /** Stable id: `resurrection_protocols.<npcKey>.<userId>.<deathCycle>`. */
  id: string;
  userId: number;
  npcKey: ResurrectableNpcKey;
  /** In-game cycle the NPC died. Used for the seed and for journal display. */
  deathCycle: number;
  /** Crew-side memberKey of the recruited instance that died. */
  killedMemberKey: string;
  /** ms epoch the quest opened (when Elara/Human briefed the player). */
  openedAt: number;
  /** Current state of each sub-task in the recipe. */
  subtasks: Array<{
    id: ProtocolSubtaskId;
    /** Has the player satisfied this sub-task? */
    completed: boolean;
    /** ms epoch when the player completed it. */
    completedAt?: number;
  }>;
  status: ResurrectionQuestStatus;
  /** ms epoch when the quest resolved. */
  resolvedAt?: number;
  /** True when Path B fired (necromancer event or act progression). */
  resolvedViaPathB?: boolean;
}

/** Build a fresh open quest. Recipe is rolled deterministically from
 *  `seed = hash(userId, npcKey, deathCycle)`. */
export function openResurrectionQuest(args: {
  userId: number;
  npcKey: ResurrectableNpcKey;
  deathCycle: number;
  killedMemberKey: string;
  now: number;
}): ResurrectionQuestState {
  const seed =
    args.userId * 1_000_003 +
    hashString(args.npcKey) * 31 +
    args.deathCycle;
  const recipe = rollProtocolRecipe(seed);
  return {
    id: `resurrection_protocols.${args.npcKey}.${args.userId}.${args.deathCycle}`,
    userId: args.userId,
    npcKey: args.npcKey,
    deathCycle: args.deathCycle,
    killedMemberKey: args.killedMemberKey,
    openedAt: args.now,
    subtasks: recipe.map((id) => ({ id, completed: false })),
    status: "open",
  };
}

/** Mark a sub-task complete. Idempotent; returns the updated quest. */
export function markSubtaskComplete(
  quest: ResurrectionQuestState,
  subtaskId: ProtocolSubtaskId,
  now: number,
): ResurrectionQuestState {
  const subtasks = quest.subtasks.map((st) =>
    st.id === subtaskId && !st.completed
      ? { ...st, completed: true, completedAt: now }
      : st,
  );
  const allDone = subtasks.every((st) => st.completed);
  return {
    ...quest,
    subtasks,
    status: allDone
      ? "completed_path_a"
      : quest.status === "open"
        ? "in_progress"
        : quest.status,
    resolvedAt: allDone ? now : quest.resolvedAt,
  };
}

/** Resolve the quest via Path B. Triggered by necromancerCycle.ts when a
 *  global Necromancer event fires while the quest is still outstanding. */
export function resolveQuestPathB(
  quest: ResurrectionQuestState,
  now: number,
): ResurrectionQuestState {
  if (
    quest.status === "completed_path_a" ||
    quest.status === "completed_path_b"
  ) {
    return quest;
  }
  return {
    ...quest,
    status: "completed_path_b",
    resolvedAt: now,
    resolvedViaPathB: true,
  };
}

/* ─── PATH B TRANSMISSIONS ─── */

/** Transmission templates for Path B. The NPC returns off-ship and sends
 *  a stinging message. Three tones per NPC keyed by their core arc. */
export const PATH_B_TRANSMISSIONS: Record<
  ResurrectableNpcKey,
  { tone: "sardonic" | "wounded" | "cold"; lines: string[] }[]
> = {
  vex_solene: [
    {
      tone: "sardonic",
      lines: [
        "I'm back. The Cycle Walker has a sense of humor — he resurrected me into the same Coda chair I died in.",
        "Don't bother apologizing. The performance was better without an audience.",
        "I'll remember which way the bow turns next time. Try to keep up.",
      ],
    },
    {
      tone: "wounded",
      lines: [
        "I'm back. No thanks to you.",
        "I'm not coming back to the ark. That ship was a stage. I'm done performing.",
        "If you ever cared, you would have asked the Degen. You didn't.",
      ],
    },
    {
      tone: "cold",
      lines: [
        "Vex Solène, alive. Coda Maestro, retired from your service.",
        "Future commissions will go through the Reveal cadence directly. You will not be on the list.",
      ],
    },
  ],
  wraith_calder: [
    {
      tone: "sardonic",
      lines: [
        "The Eighth Death was supposed to be the last. Apparently the math is funnier than that.",
        "I won't be on the daily-names ceremony anymore. The Hierophant of Thaloria has stepped down. He has paperwork to do, alone.",
        "Don't write to me.",
      ],
    },
    {
      tone: "wounded",
      lines: [
        "I gave my consent to the rite, and you did not give yours to mine.",
        "I'm back. The vessel is intact. You did not earn the right to know what that cost.",
        "Find someone else's death to be useful for.",
      ],
    },
    {
      tone: "cold",
      lines: [
        "Calder. Alive. The Hierophant of Thaloria in Exile, again — unaccompanied.",
        "I will not return to the inception ark. The substrate residue still smells of your inattention.",
      ],
    },
  ],
  locke: [
    {
      tone: "sardonic",
      lines: [
        "Adjudicator Locke, returned. New Babylon's case files are closed for transition.",
        "The Cycle Walker apparently has jurisdiction in matters of mortality. I will be filing an appeal.",
        "Tell your crew I won't be writing references for your next mission.",
      ],
    },
    {
      tone: "wounded",
      lines: [
        "I'm back. No thanks to you.",
        "I trusted you to manage the loss. You managed it by not managing it.",
        "Do not request my services. I'm cleaning up the cases I left half-open. Yours is now a closed file.",
      ],
    },
    {
      tone: "cold",
      lines: [
        "Adjudicator Locke. Alive. Not in your service.",
        "Subsequent contracts will require a different mediator. I recommend the Degen — he charges more than I do, but his fees are more honest.",
      ],
    },
  ],
  jericho_jones: [
    {
      tone: "sardonic",
      lines: [
        "Jericho Jones, Iron-Clad Lion, returned to active duty. Without you.",
        "The pre-Fall Iron Lion's imprint came back with me. He thinks you're a piece of work.",
        "Don't message. I'll be in training.",
      ],
    },
    {
      tone: "wounded",
      lines: [
        "I'm back. No thanks to you.",
        "I died for the cadre. You didn't even die a little for me.",
        "The Degen's ledger has a new line on it for you. It's not a payment.",
      ],
    },
    {
      tone: "cold",
      lines: [
        "Iron-Clad Lion Jones. Alive. Not on your roster.",
        "The Insurgency will assign you a different liaison. They will be polite. Do not mistake polite for forgetful.",
      ],
    },
  ],
  akai_shi: [
    {
      tone: "sardonic",
      lines: [
        "Akai Shi, returned — for the second time, technically. The Necromancer's event is generous.",
        "Don't thank me for waking up where I woke up. I won't be on the ark. The thought-virus has a long memory.",
        "Jericho will know. I'm sending him a separate message.",
      ],
    },
    {
      tone: "wounded",
      lines: [
        "I'm back. No thanks to you.",
        "I expected better from a captain who has resurrection on the menu and refuses to order it.",
        "I am alive. I am not yours.",
      ],
    },
    {
      tone: "cold",
      lines: [
        "Akai Shi. Alive. Off-ark.",
        "Future tactical engagements should not assume my participation. The Necromancer event has me on a different rotation now.",
      ],
    },
  ],
};

/** Pick a deterministic Path B transmission for a given quest. */
export function pickPathBTransmission(
  quest: ResurrectionQuestState,
  seed: number,
): { tone: string; lines: string[] } {
  const pool = PATH_B_TRANSMISSIONS[quest.npcKey];
  const idx = Math.abs(seed) % pool.length;
  return pool[idx];
}

/* ─── DEATH MEMORY (Path A first-line interpolation) ─── */

export interface DeathMemory {
  missionId: string;
  missionName: string;
  squadIds: string[];
  causeShort: string;
  lastWords: string;
  killerEntity?: string;
}

const PATH_A_MEMORY_TEMPLATES: Record<ResurrectableNpcKey, string[]> = {
  vex_solene: [
    "I remember the bow. Mid-stroke when {causeShort} took the hall. {lastWords} — that was the last note. I would call it ugly if it weren't mine.",
    "{missionName}. The room was in 4/4. {causeShort} came in on the off-beat. {squadList} was already moving. I couldn't.",
  ],
  wraith_calder: [
    "I have died eight times. The eighth was a rite. The ninth was {causeShort}, on {missionName}, with {squadList} watching. I remember the order of the breaths.",
    "{causeShort}. {lastWords}. Eight rites taught me how to be ready. The ninth taught me what it costs to go unprepared.",
  ],
  locke: [
    "I closed the case in my head before I fell. The case was {missionName}. The defendant was {causeShort}. The verdict was: I was wrong about who would survive. {squadList} were the witnesses.",
    "{causeShort}. {lastWords}. Adjudicators are supposed to die at desks. I died on a mission with {squadList} reaching for me. I will revise the bench paper.",
  ],
  jericho_jones: [
    "{missionName}. {causeShort}. The pre-Fall Iron Lion's imprint went silent for three seconds. Then I hit the ground. {squadList} carried what they could.",
    "I remember the cadre formation breaking. {squadList} called my name. {causeShort} did not pause for it.",
  ],
  akai_shi: [
    "The thought-virus laughed. {causeShort}. {squadList} was outside the breach. I was inside it. I remember the shape of the laugh.",
    "{lastWords}. {missionName}. The virus was pleased to have me back. The Cycle Walker disagreed.",
  ],
};

/** Generate the resurrected NPC's first line on Path A. The line is built
 *  from the death memory blob, so every detail mentioned is one the player
 *  just witnessed in the mission narrative. Pure / deterministic. */
export function generatePathAFirstLine(
  npcKey: ResurrectableNpcKey,
  memory: DeathMemory,
  squadNamesById: Record<string, string>,
  seed: number,
): string {
  const pool = PATH_A_MEMORY_TEMPLATES[npcKey];
  const tpl = pool[Math.abs(seed) % pool.length];
  const squadList =
    memory.squadIds
      .map((id) => squadNamesById[id])
      .filter((n): n is string => Boolean(n))
      .slice(0, 3)
      .join(", ") || "the rest of the crew";
  return tpl
    .replace(/\{causeShort\}/g, memory.causeShort)
    .replace(/\{missionName\}/g, memory.missionName)
    .replace(/\{lastWords\}/g, memory.lastWords)
    .replace(/\{squadList\}/g, squadList);
}

/* ─── HUMAN + ELARA BRIEFING (the quest opens) ─── */

export const RESURRECTION_BRIEFING = {
  human_intro: (npcDisplayName: string) =>
    `The Human: "${npcDisplayName} is gone. Total death — Mol'Garath's reading on the substrate is unambiguous. But the Resurrectionist Ne-Yon has a machine for this. He's gone, with the rest of them — Architect, Inventor, Judge, Storm. All except the Degen, who never leaves. He's still here because nobody collects on him. He'll mediate. He won't help. There's a difference."`,
  elara_intro: () =>
    `Elara: "The Degen takes a fee. He always takes a fee. The fee for this is everything you've built that we'd recognize as proof you're serious. We give him the Vessel, the Lineage, the Catalyst, the Tribute, the Witness. He delivers the petition. The Resurrectionist hears it across whatever distance gods cross to ignore us. If the petition is heard, your friend comes back."`,
  human_path_b_warning: () =>
    `The Human: "If we don't ask politely, the Cycle Walker's machine doesn't stop. They come back anyway, eventually — at the next Necromancer event, when the universe needs them alive again. But how they come back, and where, and what they remember? That's what the Degen's mediation buys you. Without it, your friend lives. Without it, your friend does not return to this ship."`,
};

/* ─── HELPERS ─── */

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h;
}

/** Type guard. */
export function isResurrectableNpc(key: string): key is ResurrectableNpcKey {
  return (RESURRECTABLE_NPC_KEYS as readonly string[]).includes(key);
}
