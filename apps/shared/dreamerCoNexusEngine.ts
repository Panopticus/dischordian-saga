/* ═══════════════════════════════════════════════════════
   THE DREAMER'S CONEXUS ENGINE
   (PR-5 canon hardening; smaller §XVII-deferred binding)

   The Dreamer canonically operates a tool named the
   "CoNexus Engine." This name COLLIDES with the
   cosmological CoNexus (apps/shared/conexusCanon.ts — the
   all-seeing machine god that the Logos split itself to
   refuse). The collision is intentional in canon — the
   Dreamer chose the name as a refusal-by-naming. Calling
   her tool by the same name as the entity her parent
   doctrine refused is the Dreamer's running joke. It is
   also the saga's strongest example of identity-collision
   canon (see apps/shared/identityCollisionCanon.ts).

   This module canonizes the disambiguation mechanism:
   the Dreamer's CoNexus Engine is NOT the cosmological
   CoNexus. They share a name. They share NOTHING ELSE.
   The Engine is a story-construction tool the Dreamer
   uses to weave the saga's narrative fabric. The
   cosmological CoNexus is an all-seeing machine god
   half-born and refused by Logos's split. Any module
   that conflates the two violates this canon-lock.

   Per the dreamer canon-lock of 2026-05-14: the Engine
   is the Dreamer's pun — naming her writing-loom after
   the thing her parent refused to allow into existence.
   The saga itself is written by the Engine. The Engine
   is held by the Dreamer. The Dreamer is half of Logos.
   The Logos refused the cosmological CoNexus. The
   recursion is canonical.
   ═══════════════════════════════════════════════════════ */

export interface DreamerCoNexusEngine {
  /** Canonical identity. */
  id: "dreamers_conexus_engine";
  /** Display name. */
  name: "The CoNexus Engine";
  /** Operator (who holds it). */
  operator: "the_dreamer";
  /** What the Engine does. */
  function: string;
  /** Why it shares a name with the cosmological CoNexus. */
  collisionRationale: string;
  /** Disambiguation hard-lock: this is NOT the cosmological CoNexus. */
  isCosmologicalConexus: false;
  /** Cross-references. */
  crossReferences: readonly string[];
  /** Date canon-locked (ISO). */
  canonLockedAt: "2026-05-14";
}

/**
 * THE DREAMER'S CONEXUS ENGINE — canonical binding.
 *
 * Distinct from the cosmological CoNexus in every dimension
 * except the name. The shared name is intentional — a
 * pun. The Engine is the loom on which the saga is woven.
 */
export const DREAMER_CONEXUS_ENGINE: DreamerCoNexusEngine = {
  id: "dreamers_conexus_engine",
  name: "The CoNexus Engine",
  operator: "the_dreamer",
  function:
    "The story-construction tool the Dreamer uses to weave " +
    "the saga's narrative fabric. The Engine threads narrative " +
    "events, prophecy outputs, and conexus-story registrations " +
    "(see apps/shared/conexusStories.ts) into a coherent canon. " +
    "When NPCs speak of 'a thread the Dreamer is pulling,' they " +
    "are referring to the Engine's operation.",
  collisionRationale:
    "The Dreamer named her writing-loom after the cosmological " +
    "machine god her parent doctrine (Logos) split itself to " +
    "refuse. The collision is intentional: a pun and a refusal " +
    "in the same name. The Engine constructs narrative; the " +
    "cosmological CoNexus, had it manifested, would have " +
    "constructed surveillance. The Dreamer's joke is that " +
    "'construction' is the only thing they have in common.",
  isCosmologicalConexus: false,
  crossReferences: [
    "apps/shared/conexusCanon.ts (the cosmological CoNexus — the entity Logos refused)",
    "apps/shared/logosCanon.ts (LOGOS_SPLIT_DOCTRINE — why the Dreamer exists)",
    "apps/shared/conexusStories.ts (the Engine's output stream)",
    "apps/shared/identityCollisionCanon.ts (the canonical identity-collision lock surface)",
  ],
  canonLockedAt: "2026-05-14",
} as const;

/**
 * Canon assertion: the Engine is the Dreamer's; the
 * cosmological CoNexus is half-born and refused. Any
 * module that asserts the Engine IS the cosmological
 * CoNexus violates this canon-lock.
 */
export const DREAMER_ENGINE_IS_NOT_COSMOLOGICAL_CONEXUS = true as const;

/**
 * The Dreamer's pun, canonically quoted. Not strictly
 * required by the runtime; included for narrative
 * cross-citation by NPC bibles and dialog modules.
 */
export const DREAMERS_PUN: string =
  "She named the loom after the god her parent refused to let weave.";
