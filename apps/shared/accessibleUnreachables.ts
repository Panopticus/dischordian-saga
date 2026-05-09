/* ═══════════════════════════════════════════════════════
   ACCESSIBLE UNREACHABLES
   audit/16 PR 9 (Cluster Co7 — Conspiracy persona).

   The audit'd observation: sealed letters and sealed doors
   condition players to accept walls. That's not a bug — the
   sealedness IS the signal. But the absence of any post-
   game surface that names "things the player saw and
   couldn't enter" turns the signal into noise; players
   forget the reservoir of unfinished business.

   This module is the post-game RECONSTRUCTION tab data.
   Each entry names one accessible-but-unreachable site (a
   sealed letter, a locked door, a glassed-over corridor)
   and gives the post-game framing — "yes, you saw it; no,
   you couldn't enter; here is what was on the other side
   if you must know."

   Schema-only ship. The RECONSTRUCTION tab UI consumer is
   queued for the Cluster A Investigation Board PR; this
   module is the substrate authors populate today.
   ═══════════════════════════════════════════════════════ */

export type UnreachableKind =
  | "sealed_letter"
  | "locked_door"
  | "glassed_corridor"
  | "vacuumed_chamber"
  | "encrypted_terminal"
  | "memorial_panel";

export interface UnreachableEntry {
  /** Stable id; pattern: "unreach_{descriptor}". */
  id: string;
  /** Player-facing label — short and physical, like "the
   *  third sealed letter on the captain's desk". */
  label: string;
  /** Which room the player encountered the seal in. */
  roomId: string;
  /** Type of seal. Drives the icon + framing voice in the
   *  Reconstruction tab. */
  kind: UnreachableKind;
  /** In-world description rendered before the player has
   *  finished the saga. Speaks from the in-room perspective
   *  ("the door is sealed; the seal is old"). */
  inGameDescription: string;
  /** Post-game commentary — what was actually behind the
   *  seal. Reveals what the audit calls "the absence as
   *  signal": authors explicitly chose this to remain
   *  inaccessible, and now (game over) the player learns
   *  why. */
  postGameReveal: string;
  /** Optional: the narrative flag the player needs to have
   *  seen / triggered to register this unreachable in their
   *  Reconstruction tab. Defaults to "any post-game state". */
  registeredOnFlag?: string;
}

/** Seed entries. Each canonical sealed surface in the
 *  shipping rooms gets one entry here. Authors extending
 *  the rooms should add to this list as part of the same
 *  PR that introduces the new seal. */
export const ACCESSIBLE_UNREACHABLES: readonly UnreachableEntry[] = [
  {
    id: "unreach_captains_letter_3",
    label: "The third sealed letter on the captain's desk",
    roomId: "captains-quarters",
    kind: "sealed_letter",
    inGameDescription:
      "Three letters, sealed with the captain's pre-Fall sigil. Two are addressed to " +
      "names you recognise. The third has no addressee. The wax has not been disturbed.",
    postGameReveal:
      "The third letter is to herself. She wrote it on the morning of the Fall, knowing " +
      "she might not survive the day. It is two pages of self-forgiveness. The fact that " +
      "it remained sealed is the truest evidence of her survival — she did not need to " +
      "open it.",
  },
  {
    id: "unreach_pod_zero_door",
    label: "The unmarked cryo-pod door",
    roomId: "cryo-bay",
    kind: "locked_door",
    inGameDescription:
      "A cryo-pod near the centre of the bay has no manifest entry, no nameplate, no " +
      "window. The pod's diagnostic display is dark. Power readings are flat.",
    postGameReveal:
      "Pod Zero. The first occupant of the Inception Ark, removed from every record by " +
      "the Editor. The pod itself was never opened — physically, it remains intact. The " +
      "occupant's status is, technically, indeterminate. The Editor's manuscript " +
      "(see vault_pod_zero_erasure) does not say whether they were ever woken. We " +
      "do not know.",
    registeredOnFlag: "act_2_complete",
  },
  {
    id: "unreach_archives_indigo_lectern",
    label: "The indigo-glow lectern in the deep stacks",
    roomId: "archives",
    kind: "encrypted_terminal",
    inGameDescription:
      "A lectern in the back of the Archives radiates a faint indigo light. The text on " +
      "it is dense, beautifully typeset, and unreadable — the indigo overlayer obscures " +
      "the warm-gold underlayer beneath.",
    postGameReveal:
      "The lectern was the Editor's drafting table. The indigo overlayer is fourteen " +
      "thousand edits superimposed; the warm-gold layer underneath is Elara's original " +
      "voice. Once the Shadow Tongue is finally removed (Act 7 finale), the lectern's " +
      "halo dims and the underlayer can be read. By that point, you've already read " +
      "every line elsewhere. The lectern is not where you learn the truth. It is where " +
      "you watch the truth become clean.",
    registeredOnFlag: "shadow_tongue_removed",
  },
  {
    id: "unreach_memorial_corridor_1047",
    label: "The thousand and forty-seventh memorial plate",
    roomId: "memorial-corridor",
    kind: "memorial_panel",
    inGameDescription:
      "The memorial corridor records 1,047 names. You can touch perhaps a dozen. The " +
      "rest extend into darkness — visible, unreachable.",
    postGameReveal:
      "The other 1,035 names are not omitted. They are not forgotten. They are deferred. " +
      "The audit'd intent of the corridor is that the touchable names are the ones " +
      "you have, by accident or attention, met. The rest wait for a player who plays " +
      "more carefully than you did. That is not a failure — it is the corridor's design. " +
      "Memorial work is supposed to outlast the visit.",
  },
];

/* ─── Pure helpers ─────────────────────────────────────── */

export function getUnreachablesForRoom(
  roomId: string,
  registry: readonly UnreachableEntry[] = ACCESSIBLE_UNREACHABLES,
): readonly UnreachableEntry[] {
  return registry.filter((e) => e.roomId === roomId);
}

export function getRegisteredUnreachables(
  flags: ReadonlySet<string>,
  registry: readonly UnreachableEntry[] = ACCESSIBLE_UNREACHABLES,
): readonly UnreachableEntry[] {
  return registry.filter((entry) => {
    if (!entry.registeredOnFlag) return true;
    return flags.has(entry.registeredOnFlag);
  });
}
