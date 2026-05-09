// apps/shared/universe/tickEvents.ts
//
// TICK EVENTS — typed shape of the "what happened while you were
// away" log (NPC depth #12).
//
// The shipping seasonTickService.ts already advances the world clock
// + ticks per-user agendas. This module declares the typed event
// kinds those tick handlers can publish to the per-player tick_events
// table; the session-resume report reads unacknowledged rows and
// renders them as a 2-5 bullet "while you were away" summary.
//
// Pure data + pure formatting helpers — no DB, no Date.now(), no
// Math.random(). The server callers (seasonTickService, agendaEngine,
// the future Architect/Dreamer plot-beat queue) own persistence.

import type { NpcKey } from "../npcs/types";
import type { CanonicalFactionId } from "../factionCrosswalk";

/**
 * Discriminator for the kinds of universe-tick events the player
 * should be told about on session resume. New kinds add a literal
 * to this union plus a TickEventPayload variant below.
 */
export type TickEventKind =
  | "faction_objective_advanced"
  | "npc_agenda_stage_fired"
  | "npc_agenda_countered"
  | "shadow_tongue_redaction_revealed"
  | "shadow_tongue_power_changed"
  | "architect_plot_beat"
  | "dreamer_plot_beat"
  | "loredex_entry_revealed"
  | "memorial_inscribed";

/**
 * Discriminated-union payload shape. Every row in tick_events
 * carries one of these variants in its `payload` JSON column;
 * the renderer narrows on `kind` to format.
 */
export type TickEventPayload =
  | {
      kind: "faction_objective_advanced";
      factionCanonical: CanonicalFactionId;
      objectiveId: string;
      stageId: string;
      stageLabel: string;
    }
  | {
      kind: "npc_agenda_stage_fired";
      npcKey: NpcKey;
      agendaKey: string;
      stageId: string;
      stageLabel: string;
    }
  | {
      kind: "npc_agenda_countered";
      npcKey: NpcKey;
      agendaKey: string;
      stageId: string;
      counterDescription: string;
    }
  | {
      kind: "shadow_tongue_redaction_revealed";
      entryId: string;
      revealedBy: string;
    }
  | {
      kind: "shadow_tongue_power_changed";
      previousLevel: number;
      newLevel: number;
    }
  | {
      kind: "architect_plot_beat";
      beatId: string;
      consequence: string;
    }
  | {
      kind: "dreamer_plot_beat";
      beatId: string;
      consequence: string;
    }
  | {
      kind: "loredex_entry_revealed";
      entryId: string;
      revealedVia: string;
    }
  | {
      kind: "memorial_inscribed";
      inscriptionId: string;
      memorialFor: string;
    };

/**
 * Default headline-summary formatter. Server callers can use this
 * to seed the `summary` column when writing rows; the client
 * renderer can re-format from payload when desired (e.g. localised
 * strings, richer prose).
 */
export function formatTickEventSummary(payload: TickEventPayload): string {
  switch (payload.kind) {
    case "faction_objective_advanced":
      return `${humaniseFactionId(payload.factionCanonical)} advanced its objective: ${payload.stageLabel}.`;
    case "npc_agenda_stage_fired":
      return `${humaniseNpcKey(payload.npcKey)} advanced ${payload.agendaKey}: ${payload.stageLabel}.`;
    case "npc_agenda_countered":
      return `Your counter held against ${humaniseNpcKey(payload.npcKey)}'s ${payload.stageId} step.`;
    case "shadow_tongue_redaction_revealed":
      return `A Shadow Tongue redaction broke. The entry "${payload.entryId}" is readable again — revealed by ${payload.revealedBy}.`;
    case "shadow_tongue_power_changed":
      if (payload.newLevel > payload.previousLevel) {
        return `The Shadow Tongue grew louder. Its power moved from ${payload.previousLevel} to ${payload.newLevel}.`;
      }
      return `The Shadow Tongue receded. Its power fell from ${payload.previousLevel} to ${payload.newLevel}.`;
    case "architect_plot_beat":
      return `The Architect's order moved a piece: ${payload.consequence}`;
    case "dreamer_plot_beat":
      return `The Dreamer dreamt forward: ${payload.consequence}`;
    case "loredex_entry_revealed":
      return `A Loredex entry surfaced from redaction (${payload.entryId}, via ${payload.revealedVia}).`;
    case "memorial_inscribed":
      return `A memorial was inscribed for ${payload.memorialFor}.`;
  }
}

/**
 * Format a list of payloads as a multi-line "while you were away"
 * summary. Caller controls the bullet character; the formatter
 * produces "<bullet> <summary>" lines with no trailing whitespace.
 */
export function formatResumeReport(
  events: ReadonlyArray<TickEventPayload>,
  options: { bullet?: string; maxLines?: number } = {},
): string {
  const bullet = options.bullet ?? "•";
  const max = options.maxLines ?? events.length;
  return events
    .slice(0, max)
    .map(p => `${bullet} ${formatTickEventSummary(p)}`)
    .join("\n");
}

function humaniseNpcKey(key: NpcKey): string {
  // Keep keys readable rather than introducing a name registry — the
  // session-resume UI can substitute richer names when available.
  return key
    .split("_")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function humaniseFactionId(id: CanonicalFactionId): string {
  switch (id) {
    case "architect_order":
      return "The Architect's order";
    case "dreamer_order":
      return "The Dreamer's order";
    case "new_babylon":
      return "New Babylon";
    case "hierarchy_of_damned":
      return "The Hierarchy of the Damned";
    case "insurgency":
      return "The Insurgency";
    case "antiquarian_circle":
      return "The Antiquarian Circle";
    case "thought_virus":
      return "The Thought Virus";
    case "panopticon":
      return "The Panopticon";
    case "thaloria":
      return "Thaloria";
    case "potentials":
      return "The Potentials";
    case "independent_civilizations":
      return "Independent Civilizations";
  }
}
