/* ═══════════════════════════════════════════════════════
   CHARACTER TURNAROUND MANIFEST — production tracking.

   audit/16 PR 37 (audit/15 finding Cos1 — Cosplay persona).

   Pre-audit, full-body 360° turnarounds shipped only for
   the two protagonists (Elara + The Human). Cosplayers,
   character-sheet illustrators, and any future 3D modelling
   work had no orthographic reference for the 24 NPC
   speakers.

   This module ships a TYPED manifest of every character that
   needs turnarounds + a `pending` flag per slot. As the
   asset team produces the AVIFs, the slot flips from
   `pending: true` → `pending: false`. The `_inventory.json`
   under apps/client/public/characters/ stays the source of
   truth for what's actually on disk; this manifest tracks
   what SHOULD be on disk per the production canon.

   Schema-only ship. The actual AVIFs are asset-team
   deliverables outside this PR's tooling. See
   docs/design/CHARACTER_TURNAROUND_PRODUCTION.md for the
   per-character production brief.
   ═══════════════════════════════════════════════════════ */

/** Character ids the manifest tracks. Mirrors the
 *  `_inventory.json` rel-path prefixes; tests assert the
 *  set matches. */
export type TurnaroundCharacterId =
  | "elara"
  | "the_human"
  | "adjudicator_locke"
  | "agent_zero"
  | "architect"
  | "collector"
  | "conexus_authority"
  | "degen"
  | "eidola"
  | "engineer"
  | "enigma"
  | "eyes"
  | "gamemaster"
  | "iron_lion"
  | "kael_recruiter"
  | "matrikala"
  | "necromancer"
  | "nilmorg"
  | "programmer"
  | "seer"
  | "shadow_tongue"
  | "the_antiquarian"
  | "the_meme"
  | "the_source"
  | "warlord"
  | "watcher";

/** Two slots per character — front 3-frame + full 8-frame. */
export type TurnaroundSlot = "front_turnaround" | "full_turnaround";

/** One slot's status. `pending: true` means the asset
 *  hasn't shipped yet; the AVIF doesn't exist on disk. */
export interface TurnaroundSlotStatus {
  slot: TurnaroundSlot;
  pending: boolean;
  /** Path (relative to apps/client/public/characters) the
   *  asset will land at. Set even when pending so the
   *  consumer can pre-emit the URL. */
  rel: string;
}

export interface CharacterTurnaroundEntry {
  id: TurnaroundCharacterId;
  /** Human-readable label for production-tooling logs. */
  label: string;
  /** Per-slot status. Always exactly 2 entries. */
  slots: ReadonlyArray<TurnaroundSlotStatus>;
}

function entry(
  id: TurnaroundCharacterId,
  label: string,
  shipped: boolean,
): CharacterTurnaroundEntry {
  return {
    id,
    label,
    slots: [
      {
        slot: "front_turnaround",
        pending: !shipped,
        rel: `${id}/front_turnaround.avif`,
      },
      {
        slot: "full_turnaround",
        pending: !shipped,
        rel: `${id}/full_turnaround.avif`,
      },
    ],
  };
}

/** The full registry. Two entries are non-pending today
 *  (Elara + The Human ship as protagonists). The remaining
 *  24 are pending; flipping any slot's `pending` flag from
 *  true → false is the asset-team's PR signal. */
export const CHARACTER_TURNAROUND_MANIFEST: ReadonlyArray<CharacterTurnaroundEntry> = [
  entry("elara", "Elara", true),
  entry("the_human", "The Human", true),
  entry("adjudicator_locke", "Adjudicator Locke", false),
  entry("agent_zero", "Agent Zero", false),
  entry("architect", "The Architect", false),
  entry("collector", "The Collector", false),
  entry("conexus_authority", "CoNexus Authority", false),
  entry("degen", "The Degen", false),
  entry("eidola", "Eidola", false),
  entry("engineer", "The Engineer", false),
  entry("enigma", "The Enigma", false),
  entry("eyes", "Eyes", false),
  entry("gamemaster", "The Gamemaster", false),
  entry("iron_lion", "Iron Lion", false),
  entry("kael_recruiter", "Kael (Recruiter)", false),
  entry("matrikala", "Matrikala", false),
  entry("necromancer", "The Necromancer", false),
  entry("nilmorg", "Nilmorg", false),
  entry("programmer", "The Programmer", false),
  entry("seer", "The Seer", false),
  entry("shadow_tongue", "Shadow Tongue", false),
  entry("the_antiquarian", "The Antiquarian", false),
  entry("the_meme", "The Meme", false),
  entry("the_source", "The Source", false),
  entry("warlord", "The Warlord", false),
  entry("watcher", "The Watcher", false),
];

/** All character ids tracked by the manifest. */
export const CHARACTER_TURNAROUND_IDS: ReadonlyArray<TurnaroundCharacterId> =
  CHARACTER_TURNAROUND_MANIFEST.map((e) => e.id) as ReadonlyArray<TurnaroundCharacterId>;

/** Has this character's turnaround set fully shipped? */
export function isTurnaroundReady(id: TurnaroundCharacterId): boolean {
  const entry = CHARACTER_TURNAROUND_MANIFEST.find((e) => e.id === id);
  if (!entry) return false;
  return entry.slots.every((s) => !s.pending);
}

/** List every character that still has at least one
 *  pending turnaround slot. Drives production-status
 *  reporting + the audit-tracker count. */
export function listMissingTurnarounds(): ReadonlyArray<{
  id: TurnaroundCharacterId;
  label: string;
  pendingSlots: ReadonlyArray<TurnaroundSlot>;
}> {
  const out: Array<{
    id: TurnaroundCharacterId;
    label: string;
    pendingSlots: ReadonlyArray<TurnaroundSlot>;
  }> = [];
  for (const e of CHARACTER_TURNAROUND_MANIFEST) {
    const pending = e.slots.filter((s) => s.pending).map((s) => s.slot);
    if (pending.length > 0) {
      out.push({ id: e.id, label: e.label, pendingSlots: pending });
    }
  }
  return out;
}

/** Snapshot for the audit-tracker. Returns
 *  (ready, total, percent). */
export function turnaroundCoverage(): {
  ready: number;
  total: number;
  percent: number;
} {
  const total = CHARACTER_TURNAROUND_MANIFEST.length;
  const ready = CHARACTER_TURNAROUND_MANIFEST.filter((e) =>
    e.slots.every((s) => !s.pending),
  ).length;
  return { ready, total, percent: Math.round((ready / total) * 100) };
}
