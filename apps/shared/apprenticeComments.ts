/* ═══════════════════════════════════════════════════════
   APPRENTICE COMMENTS — archetype-keyed reactive lines

   Mirrors companionComments.ts but the speaker is an
   apprentice archetype (not a fixed NPC). At fire time the
   pipeline picks the player's apprentice of that archetype
   (newest if multiple), substitutes their procedural name
   into `{name}` placeholders, and queues the line on the
   ambient toast feed.

   If no apprentice of the required archetype is on the
   roster, the comment is silently skipped — comments
   degrade gracefully with the apprentice population.

   Trigger vocabulary is the same as companionComments.ts
   — see docs/narrative-audit/DOC4 for canonical triggers.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

export interface ApprenticeComment {
  id: string;
  /** Required archetype of the speaker. */
  archetypeRequired: ApprenticeArchetype;
  trigger: string;
  /** Line text. `{name}` interpolates the speaker's name. */
  voiceLine: string;
  loreReveal?: string;
  timing: "immediate" | "delayed_5s" | "next_room_enter";
  maxPlays: 1 | 2;
  /** Optional positive flag gate. */
  requiresFlags?: readonly string[];
  /** Optional negative flag gate. */
  excludeFlags?: readonly string[];
}

export const APPRENTICE_COMMENTS: ApprenticeComment[] = [
  /* Zealot */
  {
    id: "ac_zealot_first_costly_choice",
    archetypeRequired: "zealot",
    trigger: "first_costly_morality_choice",
    voiceLine:
      "The Cause moved you. I saw the moment. You may not have called it that — the moving is the proof.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_zealot_loredex_unlock",
    archetypeRequired: "zealot",
    trigger: "loredex_entry_discovered",
    voiceLine:
      "Another fragment. We are slowly assembling the right shape of the truth.",
    timing: "immediate",
    maxPlays: 2,
  },

  /* Ghost */
  {
    id: "ac_ghost_npc_dies",
    archetypeRequired: "ghost",
    trigger: "npc_total_death",
    voiceLine: "I noticed them. I didn't think anyone else did. They knew that.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_ghost_room_enter_first",
    archetypeRequired: "ghost",
    trigger: "next_room_enter",
    voiceLine: "I was already here.",
    timing: "immediate",
    maxPlays: 2,
  },

  /* Scholar */
  {
    id: "ac_scholar_loredex_unlock",
    archetypeRequired: "scholar",
    trigger: "loredex_entry_discovered",
    voiceLine: "The footnote on this contradicts the fourth source. I'll write it up.",
    timing: "delayed_5s",
    maxPlays: 2,
  },
  {
    id: "ac_scholar_journal_read",
    archetypeRequired: "scholar",
    trigger: "journal_entry_read_first_time",
    voiceLine: "Read it twice. The second time is the one that means something.",
    timing: "immediate",
    maxPlays: 1,
  },

  /* Revenant */
  {
    id: "ac_revenant_crew_member_dies",
    archetypeRequired: "revenant",
    trigger: "crew_member_died",
    voiceLine:
      "I know that face it makes. I made it once. Whatever they were going to finish — we should look up.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_revenant_resurrection_complete",
    archetypeRequired: "revenant",
    trigger: "resurrection_protocol_complete",
    voiceLine: "Welcome back. The first hour is the worst. The second is also the worst.",
    timing: "immediate",
    maxPlays: 1,
  },

  /* Artisan */
  {
    id: "ac_artisan_first_craft",
    archetypeRequired: "artisan",
    trigger: "first_craft_completed",
    voiceLine: "Watching it cool. The good ones change colour twice.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_artisan_mission_complete",
    archetypeRequired: "artisan",
    trigger: "crew_mission_completed",
    voiceLine: "I'll repair what came back. Tell whoever was using it to come watch.",
    timing: "immediate",
    maxPlays: 2,
  },

  /* Oracle */
  {
    id: "ac_oracle_voltari_first",
    archetypeRequired: "oracle",
    trigger: "voltari_first_transmission",
    voiceLine: "I dreamt of this static. It was singing in my mother's voice.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_oracle_loredex_unlock",
    archetypeRequired: "oracle",
    trigger: "loredex_entry_discovered",
    voiceLine: "I knew this one was next. The order is right.",
    timing: "immediate",
    maxPlays: 2,
  },

  /* Wanderer */
  {
    id: "ac_wanderer_act_2_complete",
    archetypeRequired: "wanderer",
    trigger: "act_2_complete",
    voiceLine: "Three new corridors I haven't walked. I'll take care of one before sleep.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_wanderer_room_dwell",
    archetypeRequired: "wanderer",
    trigger: "room_dwell_30s",
    voiceLine: "I keep finding reasons to stay in this one. I'll have to think about why.",
    timing: "immediate",
    maxPlays: 2,
  },

  /* Martyr */
  {
    id: "ac_martyr_crew_member_dies",
    archetypeRequired: "martyr",
    trigger: "crew_member_died",
    voiceLine: "I should have been ahead of them in line. I'm sorry.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_martyr_mission_dispatch",
    archetypeRequired: "martyr",
    trigger: "crew_mission_dispatched",
    voiceLine: "Whoever takes the worst hit — let it be me.",
    timing: "immediate",
    maxPlays: 2,
  },

  /* Heretic */
  {
    id: "ac_heretic_loredex_unlock",
    archetypeRequired: "heretic",
    trigger: "loredex_entry_discovered",
    voiceLine: "Now we have a counter-text. The orthodoxy looks worse already.",
    timing: "immediate",
    maxPlays: 2,
  },
  {
    id: "ac_heretic_first_costly_choice",
    archetypeRequired: "heretic",
    trigger: "first_costly_morality_choice",
    voiceLine: "Good. The easy answer was always going to disappoint someone important.",
    timing: "delayed_5s",
    maxPlays: 1,
  },

  /* Jester */
  {
    id: "ac_jester_crew_member_dies",
    archetypeRequired: "jester",
    trigger: "crew_member_died",
    voiceLine:
      "I have a joke about this. I'm not telling it tonight. Maybe in a month. Maybe never.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_jester_loredex_unlock",
    archetypeRequired: "jester",
    trigger: "loredex_entry_discovered",
    voiceLine: "Three deities walk into the Archive. The first two are footnotes.",
    timing: "immediate",
    maxPlays: 2,
  },

  /* Sentinel */
  {
    id: "ac_sentinel_npc_dies",
    archetypeRequired: "sentinel",
    trigger: "npc_total_death",
    voiceLine: "Someone was supposed to be there. It wasn't me. It should have been me.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_sentinel_room_enter",
    archetypeRequired: "sentinel",
    trigger: "next_room_enter",
    voiceLine: "Door's clear. I'll watch it for a while in case it stops being.",
    timing: "immediate",
    maxPlays: 2,
  },

  /* Prodigal */
  {
    id: "ac_prodigal_crew_assembled",
    archetypeRequired: "prodigal",
    trigger: "crew_assembled_full",
    voiceLine: "All hands. I missed this kind of room.",
    timing: "delayed_5s",
    maxPlays: 1,
  },
  {
    id: "ac_prodigal_first_costly_choice",
    archetypeRequired: "prodigal",
    trigger: "first_costly_morality_choice",
    voiceLine: "I've made the cheaper version. Yours is harder to come back from.",
    timing: "immediate",
    maxPlays: 1,
  },
];

/* ─── HELPERS ─── */

/** Look up apprentice comments matching a trigger. Caller filters by
 *  on-roster archetype + flag gates + maxPlays at fire time. */
export function findApprenticeComments(trigger: string): readonly ApprenticeComment[] {
  return APPRENTICE_COMMENTS.filter((c) => c.trigger === trigger);
}

/** Coverage by archetype — every archetype must have ≥ 2 reactive
 *  comments to satisfy the parity gate. */
export function commentCoverageByArchetype(): Record<ApprenticeArchetype, number> {
  const out: Partial<Record<ApprenticeArchetype, number>> = {};
  for (const c of APPRENTICE_COMMENTS) {
    out[c.archetypeRequired] = (out[c.archetypeRequired] ?? 0) + 1;
  }
  return out as Record<ApprenticeArchetype, number>;
}

/** Render a comment line, substituting `{name}` with the apprentice's
 *  procedural name. */
export function renderApprenticeLine(line: string, apprenticeName: string): string {
  return line.replace(/\{name\}/g, apprenticeName);
}
