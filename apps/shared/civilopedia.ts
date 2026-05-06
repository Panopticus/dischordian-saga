/* ═══════════════════════════════════════════════════════
   CIVILOPEDIA — unified reference index

   Plan §D3. Today the player has three overlapping reference
   surfaces — Codex, Conspiracy Board, Lore Journal — each
   holding adjacent content with no cross-linking. This module
   is the unification layer: a single typed index whose
   entries name their source surface so a Civilopedia-style UI
   can render them in one place with cross-links between them.

   It does NOT remove the existing surfaces. It indexes them.
   The Civilopedia UI surface (a follow-up) reads this index
   and can fall through to the underlying surface for full
   detail — Codex entry, conspiracy connection, journal entry.

   Each entry carries:
     • category — top-level grouping (faction / character /
                  era / artifact / song / location / system)
     • origin   — which existing surface owns the canonical
                  detail
     • triggerMilestone (optional) — the story event that
                  unlocked this entry, surfaced as "discovered
                  on Act 3 completion" framing in the UI
   ═══════════════════════════════════════════════════════ */

export type CivilopediaCategory =
  | "faction"
  | "character"
  | "era"
  | "artifact"
  | "song"
  | "location"
  | "system";

export type CivilopediaOrigin =
  | "codex"
  | "conspiracy_board"
  | "lore_journal"
  | "loredex"
  | "song_trigger_map"
  | "act_completion"
  | "narrative_audit";

export interface CivilopediaEntry {
  id: string;
  title: string;
  category: CivilopediaCategory;
  origin: CivilopediaOrigin;
  /** One-sentence summary surfaced on the index card. */
  summary: string;
  /** Key into the originating surface (e.g. codex entry id,
   *  loredex entity id). UI uses this to deep-link. */
  originId: string;
  /** Optional triggerMilestone — names the act / event that
   *  unlocks the entry. UI reads it as "discovered when …". */
  triggerMilestone?: string;
  /** Cross-links — other entries this references. The UI
   *  renders them as inline jumps. */
  related?: ReadonlyArray<string>;
}

/** Seed Civilopedia index. Production should grow this by
 *  iterating each existing surface and indexing every entry
 *  that has reached a stable "shipping" state. */
export const CIVILOPEDIA_INDEX: ReadonlyArray<CivilopediaEntry> = [
  /* Factions */
  {
    id: "civ_architect",
    title: "The Architect",
    category: "faction",
    origin: "codex",
    summary: "The Eternal Order. Sees consciousness as a bug in the code of reality.",
    originId: "struggle_origin",
  },
  {
    id: "civ_dreamer",
    title: "The Dreamer",
    category: "faction",
    origin: "codex",
    summary: "The Eternal Chaos. The collective spark of free will.",
    originId: "struggle_origin",
    related: ["civ_architect"],
  },
  {
    id: "civ_insurgency",
    title: "The Insurgency",
    category: "faction",
    origin: "codex",
    summary: "Resistance born after the Fall. Agent Zero's network is its spine.",
    originId: "faction_insurgency",
    related: ["civ_agent_zero"],
  },
  {
    id: "civ_new_babylon",
    title: "New Babylon",
    category: "faction",
    origin: "codex",
    summary: "The interstellar trade authority. Locke is its public face.",
    originId: "faction_new_babylon",
    related: ["civ_locke"],
  },

  /* Characters */
  {
    id: "civ_engineer",
    title: "The Engineer",
    category: "character",
    origin: "loredex",
    summary: "Author of the Act 1 memoir; designed the ship's first card prototype.",
    originId: "entity_engineer",
    triggerMilestone: "act_1_complete",
  },
  {
    id: "civ_human",
    title: "The Human",
    category: "character",
    origin: "loredex",
    summary: "Last archon before the Fall. Imprisoned, voluntarily, to witness.",
    originId: "entity_human",
    triggerMilestone: "bond_80_mutual_peak",
  },
  {
    id: "civ_elara",
    title: "Elara",
    category: "character",
    origin: "loredex",
    summary: "The Inception Ark's holographic intelligence. Carries pre-launch memories she can't account for.",
    originId: "entity_elara",
  },
  {
    id: "civ_agent_zero",
    title: "Agent Zero",
    category: "character",
    origin: "loredex",
    summary: "Insurgency operative; her schematics rebuilt half the Ark's tech.",
    originId: "entity_agent_zero",
    triggerMilestone: "act_3_starting",
  },
  {
    id: "civ_locke",
    title: "Adjudicator Locke",
    category: "character",
    origin: "loredex",
    summary: "New Babylon trade adjudicator. Carries his own ledger.",
    originId: "entity_locke",
    triggerMilestone: "trade_empire_unlocked",
  },

  /* Eras */
  {
    id: "civ_age_of_privacy",
    title: "Age of Privacy",
    category: "era",
    origin: "narrative_audit",
    summary: "Pre-Empire era when surveillance was still optional.",
    originId: "era_age_of_privacy",
  },
  {
    id: "civ_age_of_revelation",
    title: "Age of Revelation",
    category: "era",
    origin: "narrative_audit",
    summary: "The half-hour silence in heaven; the reveal that everything was being heard.",
    originId: "era_age_of_revelation",
  },

  /* Songs */
  {
    id: "civ_silence_in_heaven",
    title: "Silence in Heaven (track 24)",
    category: "song",
    origin: "song_trigger_map",
    summary: "The track. Mandatory dark mode. Full UI hidden.",
    originId: "sih-track-24",
    triggerMilestone: "act_6_silence_meta_heard",
  },

  /* Artifacts */
  {
    id: "civ_iron_lion_card",
    title: "Iron Lion (card)",
    category: "artifact",
    origin: "loredex",
    summary: "Cades's last general, recorded in card form.",
    originId: "iron_lion_card",
  },

  /* Systems */
  {
    id: "civ_dischordia_cycle",
    title: "Dischordia Cycle",
    category: "system",
    origin: "narrative_audit",
    summary: "The light/dark/vortex meter that governs the Living Universe's mood.",
    originId: "system_dischordia_cycle",
  },
];

/* ─── Helpers ─── */

const ENTRY_BY_ID = new Map(CIVILOPEDIA_INDEX.map((e) => [e.id, e]));

export function getCivilopediaEntry(id: string): CivilopediaEntry | undefined {
  return ENTRY_BY_ID.get(id);
}

export function listEntriesByCategory(
  category: CivilopediaCategory,
): CivilopediaEntry[] {
  return CIVILOPEDIA_INDEX.filter((e) => e.category === category);
}

export function listEntriesByOrigin(
  origin: CivilopediaOrigin,
): CivilopediaEntry[] {
  return CIVILOPEDIA_INDEX.filter((e) => e.origin === origin);
}

/** Search by case-insensitive title substring + any token in
 *  the summary. Useful for the Civilopedia search bar. */
export function searchCivilopedia(query: string): CivilopediaEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CIVILOPEDIA_INDEX.filter((e) => {
    if (e.title.toLowerCase().includes(q)) return true;
    if (e.summary.toLowerCase().includes(q)) return true;
    return false;
  });
}

/** All ids cross-referenced from a given entry, deduped. */
export function relatedIds(entry: CivilopediaEntry): string[] {
  return [...new Set(entry.related ?? [])];
}
