/* ═══════════════════════════════════════════════════════
   DIPLOMACY PRIMITIVES — treaty / embargo / declare-war

   Plan §C3 (full variant). The cron-driven faction drift
   shipped in plan §C3 (cheap variant) made the war map move
   on its own. This module is the *interactive* layer:
   primitives the player guild can use to engage NPC
   factions diplomatically.

   Three primary actions:
     • propose_treaty(faction)  — non-aggression for N days
     • declare_war(faction)     — opens hostility, drift biases
                                  toward the player's losing
                                  side
     • embargo(faction)         — trade penalties both ways for
                                  the duration

   Plus relationship state per (player_guild, faction): an
   integer "standing" in [-100, 100] and a current relation
   tag derived from it.

   Pure data + helpers. The server-side router (warMap or a
   new diplomacy router) wraps these helpers in DB calls.
   ═══════════════════════════════════════════════════════ */

export type DiplomacyFaction =
  | "architect"
  | "insurgency"
  | "new_babylon"
  | "hierarchy_of_damned"
  | "antiquarian"
  | "thought_virus";

export type Relation =
  | "war"
  | "hostile"
  | "wary"
  | "neutral"
  | "friendly"
  | "allied";

export type ActionKind =
  | "propose_treaty"
  | "accept_treaty"
  | "break_treaty"
  | "declare_war"
  | "embargo"
  | "lift_embargo";

export interface RelationshipState {
  faction: DiplomacyFaction;
  /** Standing -100 (enemy) to +100 (ally). */
  standing: number;
  /** Active treaty expiry (ms epoch) or null. */
  treatyEndsAt: number | null;
  /** Active embargo expiry (ms epoch) or null. */
  embargoEndsAt: number | null;
  atWar: boolean;
}

export const INITIAL_STANDING: Record<DiplomacyFaction, number> = {
  architect: -25,
  insurgency: 5,
  new_babylon: 0,
  hierarchy_of_damned: -50,
  antiquarian: 25,
  thought_virus: -75,
};

export const TREATY_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const EMBARGO_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

/** Standing-change effects per action. Ally / war moves are
 *  bigger than treaty / embargo so the player feels them
 *  immediately on the war map. */
export const ACTION_STANDING_DELTA: Record<ActionKind, number> = {
  propose_treaty: 0, // no change until the faction accepts
  accept_treaty: +15,
  break_treaty: -25,
  declare_war: -40,
  embargo: -10,
  lift_embargo: +5,
};

/* ─── Helpers ─── */

export function defaultRelationship(faction: DiplomacyFaction): RelationshipState {
  return {
    faction,
    standing: INITIAL_STANDING[faction],
    treatyEndsAt: null,
    embargoEndsAt: null,
    atWar: false,
  };
}

export function relationFor(state: RelationshipState): Relation {
  if (state.atWar) return "war";
  if (state.standing <= -50) return "hostile";
  if (state.standing < 0) return "wary";
  if (state.standing < 25) return "neutral";
  if (state.standing < 60) return "friendly";
  return "allied";
}

export function isTreatyActive(state: RelationshipState, now: number = Date.now()): boolean {
  return state.treatyEndsAt !== null && state.treatyEndsAt > now;
}

export function isEmbargoActive(state: RelationshipState, now: number = Date.now()): boolean {
  return state.embargoEndsAt !== null && state.embargoEndsAt > now;
}

/* ─── Action validators / appliers ─── */

export interface ActionResult {
  ok: boolean;
  state: RelationshipState;
  error?: string;
}

export function applyAction(
  state: RelationshipState,
  action: ActionKind,
  now: number = Date.now(),
): ActionResult {
  switch (action) {
    case "propose_treaty": {
      if (state.atWar) {
        return { ok: false, state, error: "Cannot propose treaty during active war." };
      }
      if (isTreatyActive(state, now)) {
        return { ok: false, state, error: "Treaty already active." };
      }
      // Proposal is just the offer — accepted by the faction
      // when standing crosses a threshold (handled by NPC AI),
      // or accepted explicitly via accept_treaty.
      return { ok: true, state };
    }
    case "accept_treaty": {
      if (state.atWar) {
        return { ok: false, state, error: "Cannot accept treaty while at war." };
      }
      const standing = clamp(state.standing + ACTION_STANDING_DELTA.accept_treaty);
      return {
        ok: true,
        state: { ...state, standing, treatyEndsAt: now + TREATY_DURATION_MS },
      };
    }
    case "break_treaty": {
      if (!isTreatyActive(state, now)) {
        return { ok: false, state, error: "No active treaty to break." };
      }
      const standing = clamp(state.standing + ACTION_STANDING_DELTA.break_treaty);
      return { ok: true, state: { ...state, standing, treatyEndsAt: null } };
    }
    case "declare_war": {
      if (state.atWar) return { ok: false, state, error: "Already at war." };
      if (isTreatyActive(state, now)) {
        return { ok: false, state, error: "Cannot declare war during active treaty. Break it first." };
      }
      const standing = clamp(state.standing + ACTION_STANDING_DELTA.declare_war);
      return { ok: true, state: { ...state, standing, atWar: true } };
    }
    case "embargo": {
      if (isEmbargoActive(state, now)) {
        return { ok: false, state, error: "Embargo already active." };
      }
      const standing = clamp(state.standing + ACTION_STANDING_DELTA.embargo);
      return {
        ok: true,
        state: { ...state, standing, embargoEndsAt: now + EMBARGO_DURATION_MS },
      };
    }
    case "lift_embargo": {
      if (!isEmbargoActive(state, now)) {
        return { ok: false, state, error: "No active embargo to lift." };
      }
      const standing = clamp(state.standing + ACTION_STANDING_DELTA.lift_embargo);
      return { ok: true, state: { ...state, standing, embargoEndsAt: null } };
    }
  }
}

/** End an active war. War ends when either side requests
 *  ceasefire AND the other accepts (or via narrative trigger).
 *  This helper is the apply path. */
export function endWar(state: RelationshipState, standingShift: number = 5): RelationshipState {
  if (!state.atWar) return state;
  return { ...state, atWar: false, standing: clamp(state.standing + standingShift) };
}

function clamp(x: number): number {
  if (x < -100) return -100;
  if (x > 100) return 100;
  return Math.round(x);
}

/* ─── Reaction lines (engineering scaffold) ─── */

/** Per-faction one-liner reactions to each diplomatic action,
 *  delivered through that faction's voice companion (e.g.
 *  Elara for the Potentials, Agent Zero for the Insurgency).
 *  This is the engine seed — production should expand to a
 *  per-NPC banks system mirroring companionComments.ts. */
export const FACTION_REACTION_LINES: Record<
  DiplomacyFaction,
  Partial<Record<ActionKind, string>>
> = {
  architect: {
    propose_treaty: "The Architect's response arrives in compressed form: 'Accepted, conditional on your continued utility.'",
    declare_war: "The Architect's surface plate-tones flicker amber. 'You will be optimised against.'",
    embargo: "Trade embargo registered. The Architect does not require organics.",
  },
  insurgency: {
    propose_treaty: "Agent Zero: 'Treaty? Sure. Don't romance it. We'll honour it for as long as it serves the cause.'",
    declare_war: "Agent Zero, dryly: 'Welcome to the Insurgency, then. We'll send the postcard.'",
    embargo: "Insurgency markets shrug. They were a black market anyway.",
  },
  new_babylon: {
    propose_treaty: "Locke: 'I'll need it in writing. And signed by your accountant.'",
    declare_war: "Locke's smile thins. 'You understand this means the markets close to you.'",
    embargo: "Locke: 'My commission stands. Embargoes are seasonal here.'",
  },
  hierarchy_of_damned: {
    propose_treaty: "The Shadow Tongue: 'A treaty. How quaint. We'll honour the letter. Re-read it carefully.'",
    declare_war: "The Hierarchy says nothing for forty-eight hours. Then everything goes wrong at once.",
    embargo: "The Hierarchy does not trade in materials. Only in time.",
  },
  antiquarian: {
    propose_treaty: "The Antiquarian: 'Yes, of course. I'll mark it in the index. I always mark them.'",
    declare_war: "The Antiquarian closes a book. 'Then I will preserve a record of who you were before.'",
    embargo: "The Antiquarian: 'I deal in stories. They cross every line you can draw.'",
  },
  thought_virus: {
    declare_war: "The signal sharpens. The signal does not respond.",
    embargo: "Embargoes do not work against memes.",
  },
};

export function reactionLine(faction: DiplomacyFaction, action: ActionKind): string | null {
  return FACTION_REACTION_LINES[faction]?.[action] ?? null;
}
