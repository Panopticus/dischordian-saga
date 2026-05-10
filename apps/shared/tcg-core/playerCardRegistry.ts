/* ═══════════════════════════════════════════════════════
   PLAYER CARD REGISTRY — composite registry layer.

   The global CardRegistry (built from ALL_CARD_DEFINITIONS)
   is frozen at startup and shared by all players. Signature
   cards forged at Day-28 graduation are PER-PLAYER —
   they can't go in the global registry.

   This module produces a composite CardRegistry that
   delegates to the global registry first, then falls back
   to the player's signature cards. The reducer's contract
   (state, action, cardRegistry) is unchanged — we just
   hand it a different registry per match.

   Replay-pin discipline:
     • Signature card ids are stable (sigcard_<apprenticeId>).
     • The card payload is persisted on mint with the
       authored rulesVersion. Replays restore the EXACT
       payload via composeRegistryFromForges() when verifying
       a recorded match.
     • Players cannot retroactively edit a signature card
       (no mutation API; doctrine + slot are immutable
       once forged).
   ═══════════════════════════════════════════════════════ */

import type { CardDefinition } from "./types/Card";
import type { CardRegistry } from "./types/GameState";
import { cardDefinitionSchema } from "./cards/schema";
import { CardRegistryLoadError } from "./cards/loader";
import { isReplayCompatible, RULES_VERSION } from "./engine/version";

/* ─── Type contracts ─── */

export interface SignatureCardPersistedPayload {
  /** The serialized CardDefinition (as written by forgeSignatureCard.ts). */
  card: unknown;
  /** Stable id — sigcard_<apprenticeId>. */
  cardId: string;
  /** Replay-pin: rulesVersion at forge time. */
  rulesVersion: string;
}

/* ─── Validation ─── */

/**
 * Validate a persisted signature card payload. Throws CardRegistryLoadError
 * with the offending id on failure. Used by the server when loading
 * signature cards from the DB to construct a player-scoped registry.
 */
export function validateSignaturePayload(payload: SignatureCardPersistedPayload): CardDefinition {
  let parsed: CardDefinition;
  try {
    parsed = cardDefinitionSchema.parse(payload.card) as unknown as CardDefinition;
  } catch (e) {
    throw new CardRegistryLoadError(
      payload.cardId,
      `signature card validation failed: ${(e as Error).message}`,
      e,
    );
  }
  if (parsed.id !== payload.cardId) {
    throw new CardRegistryLoadError(
      payload.cardId,
      `signature card id mismatch (payload says ${parsed.id}, persisted under ${payload.cardId})`,
    );
  }
  if (!isReplayCompatible(parsed.rulesVersion, RULES_VERSION)) {
    throw new CardRegistryLoadError(
      payload.cardId,
      `rulesVersion '${parsed.rulesVersion}' is incompatible with engine '${RULES_VERSION}'`,
    );
  }
  return parsed;
}

/* ─── Composer ─── */

/**
 * Compose a player-scoped CardRegistry from the global registry plus a
 * list of the player's signature card payloads. The returned registry
 * delegates `.get()` and `.has()` to the global registry first; if not
 * found, it falls back to the per-player layer.
 *
 * Calling this is cheap — the composite registry just holds two refs.
 * Build once per match start.
 */
export function composeRegistryFromForges(
  globalRegistry: CardRegistry,
  payloads: readonly SignatureCardPersistedPayload[],
): CardRegistry {
  const playerById = new Map<string, CardDefinition>();
  for (const p of payloads) {
    const parsed = validateSignaturePayload(p);
    if (globalRegistry.has(parsed.id)) {
      // Defense-in-depth: a signature card id must never collide with
      // a global card id. (sigcard_ prefix makes this impossible in
      // practice but we still check.)
      throw new CardRegistryLoadError(
        parsed.id,
        `signature card id collides with a global card id`,
      );
    }
    if (playerById.has(parsed.id)) {
      throw new CardRegistryLoadError(
        parsed.id,
        `duplicate signature card id within player payload`,
      );
    }
    playerById.set(parsed.id, parsed);
  }
  const allPlayer = Array.from(playerById.values());
  Object.freeze(allPlayer);

  const composite: CardRegistry = {
    get(defId: string) {
      return globalRegistry.get(defId) ?? playerById.get(defId);
    },
    has(defId: string) {
      return globalRegistry.has(defId) || playerById.has(defId);
    },
    listAll() {
      // Compose lazily-cached union. Safe — both inputs are frozen.
      return [...globalRegistry.listAll(), ...allPlayer];
    },
  };
  Object.freeze(composite);
  return composite;
}

/**
 * Convenience: just the player's signature cards as a standalone registry.
 * Used by tests and by deck-builder UIs that surface only signature cards
 * (e.g. "your forged cards" tab).
 */
export function buildSignatureRegistry(
  payloads: readonly SignatureCardPersistedPayload[],
): CardRegistry {
  const byId = new Map<string, CardDefinition>();
  for (const p of payloads) {
    const parsed = validateSignaturePayload(p);
    byId.set(parsed.id, parsed);
  }
  const all = Array.from(byId.values());
  Object.freeze(all);
  const reg: CardRegistry = {
    get: (id) => byId.get(id),
    has: (id) => byId.has(id),
    listAll: () => all,
  };
  Object.freeze(reg);
  return reg;
}

/* ─── Replay verification ─── */

export interface ReplayPin {
  cardId: string;
  rulesVersion: string;
}

/**
 * Pin a signature card for replay determinism. Caller persists the
 * pin in the match's replay log alongside the action stream.
 *
 * On replay verification, the pin is matched against the player's
 * signature card payload at replay time — if the persisted rulesVersion
 * disagrees, the replay is treated as archived (cannot live-replay).
 */
export function pinSignatureCard(payload: SignatureCardPersistedPayload): ReplayPin {
  return { cardId: payload.cardId, rulesVersion: payload.rulesVersion };
}

/**
 * Verify a replay pin against a signature card payload. Returns the
 * compatibility classification.
 */
export type ReplayPinStatus = "live_compatible" | "archived" | "missing";

export function verifySignaturePin(
  pin: ReplayPin,
  payloads: readonly SignatureCardPersistedPayload[],
): ReplayPinStatus {
  const match = payloads.find(p => p.cardId === pin.cardId);
  if (!match) return "missing";
  if (match.rulesVersion === pin.rulesVersion) return "live_compatible";
  if (isReplayCompatible(match.rulesVersion, pin.rulesVersion)) return "live_compatible";
  return "archived";
}
