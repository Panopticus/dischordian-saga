/* ═══════════════════════════════════════════════════════
   VOTE CONSEQUENCES — Structured payload for vote outcomes

   Bridges the gap identified in docs/narrative-audit/DOC4
   "choice-impact" audit:

     Before: voteOptions.rewardOnWin was an unread JSON blob;
     vote outcomes had zero downstream effect (only +3 lore +1
     signal for participating regardless of which option won).

     After: a discriminated-union VoteConsequence is applied
     server-side on close, writing npc_public_flags entries the
     existing NPC banks already react to, applying light/dark
     dischordia deltas, and inscribing an Antiquarian Tome
     entry the Governance Hub renders.

   Each `CommunityVote` option now carries a typed
   `rewardOnWin: VoteRewardPayload`. Legacy options that still
   declare free-form `consequences: string[]` are bridged via
   the per-vote registry in
   `apps/shared/governanceConsequenceMap.ts`.
   ═══════════════════════════════════════════════════════ */

/* ─── DISCRIMINATED UNION ─── */

/**
 * Set a writer-coordinated public flag the existing NPC banks
 * already key off via `reactsToPublicFlag`. This is the primary
 * lever for governance choices to colour Vex / Locke / Elara /
 * Antiquarian dialogue without bespoke routing.
 */
export interface SetFlagConsequence {
  kind: "set_flag";
  flag: string;
}

/**
 * Apply a raw delta to the singleton Dischordia cycle. Calls
 * dischordiaCycleService.applyRawDelta on the server. Surfaces
 * to players via the cycle phase indicator and the Antiquarian's
 * "your run moved the galaxy 12% toward Light" epilogue.
 */
export interface EnergyDeltaConsequence {
  kind: "energy_delta";
  light?: number;
  dark?: number;
  vortex?: number;
}

/**
 * Inscribe an Antiquarian Tome entry for this outcome. The
 * `body` is rendered to all players visiting the Governance
 * Hub; the optional `annotation` only surfaces once the player
 * has reached Antiquarian trust 60+.
 */
export interface TomeEntryConsequence {
  kind: "tome_entry";
  body: string;
  annotation?: string;
}

/**
 * Activate a named world modifier readable by client systems
 * (combat, crafting, daily-vote badge UI). Stored in
 * `worldModifiers` with optional `expiresAt`. Consumers query
 * `getActiveWorldModifiers()` and apply their own scaling.
 */
export interface WorldModifierConsequence {
  kind: "world_modifier";
  modifierKey: string;
  modifierType: string;
  modifierValue: number;
  durationDays?: number;
  description?: string;
}

/**
 * Mark an unlock string. Quest, building, transmission, and
 * cosmetic unlocks all use a single `unlockId` namespace; the
 * relevant subsystems gate their own visibility on the
 * `npc_public_flags` table where `flag = "unlock:<unlockId>"`.
 */
export interface UnlockConsequence {
  kind: "unlock";
  unlockId: string;
  description?: string;
}

export type VoteConsequence =
  | SetFlagConsequence
  | EnergyDeltaConsequence
  | TomeEntryConsequence
  | WorldModifierConsequence
  | UnlockConsequence;

export interface VoteRewardPayload {
  consequences: readonly VoteConsequence[];
}

/* ─── PARSING / VALIDATION ─── */

/**
 * Parse a JSON value that may have come from `vote_options.rewardOnWin`.
 * Returns null if the shape is unrecognised so the caller can fall
 * through to the legacy string→consequence registry.
 */
export function parseVoteRewardPayload(
  raw: unknown,
): VoteRewardPayload | null {
  if (raw == null || typeof raw !== "object") return null;
  const payload = raw as { consequences?: unknown };
  if (!Array.isArray(payload.consequences)) return null;
  const parsed: VoteConsequence[] = [];
  for (const item of payload.consequences) {
    const consequence = parseConsequence(item);
    if (consequence) parsed.push(consequence);
  }
  if (parsed.length === 0) return null;
  return { consequences: parsed };
}

function parseConsequence(raw: unknown): VoteConsequence | null {
  if (raw == null || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  switch (c.kind) {
    case "set_flag":
      return typeof c.flag === "string" ? { kind: "set_flag", flag: c.flag } : null;
    case "energy_delta":
      return {
        kind: "energy_delta",
        light: typeof c.light === "number" ? c.light : undefined,
        dark: typeof c.dark === "number" ? c.dark : undefined,
        vortex: typeof c.vortex === "number" ? c.vortex : undefined,
      };
    case "tome_entry":
      return typeof c.body === "string"
        ? {
            kind: "tome_entry",
            body: c.body,
            annotation: typeof c.annotation === "string" ? c.annotation : undefined,
          }
        : null;
    case "world_modifier":
      if (typeof c.modifierKey !== "string") return null;
      if (typeof c.modifierType !== "string") return null;
      if (typeof c.modifierValue !== "number") return null;
      return {
        kind: "world_modifier",
        modifierKey: c.modifierKey,
        modifierType: c.modifierType,
        modifierValue: c.modifierValue,
        durationDays: typeof c.durationDays === "number" ? c.durationDays : undefined,
        description: typeof c.description === "string" ? c.description : undefined,
      };
    case "unlock":
      return typeof c.unlockId === "string"
        ? {
            kind: "unlock",
            unlockId: c.unlockId,
            description: typeof c.description === "string" ? c.description : undefined,
          }
        : null;
    default:
      return null;
  }
}
