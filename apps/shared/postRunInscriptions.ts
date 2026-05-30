/* ═══════════════════════════════════════════════════════
   POST-RUN INSCRIPTIONS

   Bandersnatch Moves 4 + 5. Pure templates the server applies
   when a player completes Act 7 (act_7_complete flag) and the
   prestigeService writes the new prestige tier. Two distinct
   inscription kinds:

     - cycle_aware:    references prestige tier and stance
                       across runs. The Antiquarian becomes a
                       persistent reader who notices patterns.
     - dischordia_cycle: surfaces the player's contribution to
                       the community light/dark/vortex meter via
                       the existing dischordiaCycleService.

   Inscriptions are written to vote_antiquarian_entries (the same
   table the consequence applier writes to). They use a fixed
   voteId namespace so they don't collide with real vote
   inscriptions. The runtime shape (see
   apps/server/services/postRunInscriptionsService.ts:46-50) is
   `post_run:<userId>:<prestigeTier>:<stanceFlag>` for cycle-aware
   and `dischordia:<userId>:<prestigeTier>` for cycle reports.

   CANON: this is the runtime of "The Chronicler's Desk" — the
   per-cycle chronicle the player writes from Volume Nineteen
   onward (build-plan §X.7 canon-lock; the cycle_chronicle loop
   surface). Canonical owner: apps/shared/chroniclersDeskCanon.ts;
   loop binding: apps/shared/continuingLoopEndgameCanon.ts.

   The body is interpolation-templated with a small set of
   tokens — see TEMPLATE_TOKENS below.
   ═══════════════════════════════════════════════════════ */

export interface PostRunInscriptionContext {
  /** Prestige tier *after* this run completes. Tier 1 = first
   *  cycle finished, tier 2 = second, etc. */
  prestigeTier: number;
  /** Act 7 stance flag. One of:
   *    act7_s1_humanity_path | act7_s1_machine_path |
   *    act7_s1_balance | act7_s1_soldier_command |
   *    act7_silence_stance */
  stanceFlag: string | null;
  /** Active path-lock flag from Acts 1-3. */
  pathFlag: "act1_path_a" | "act3_partial_share" | "act3_full_secret" | null;
  /** Cumulative humanity-path runs across all prior tiers. */
  humanityRunCount: number;
  /** Cumulative machine-path runs. */
  machineRunCount: number;
  /** Cumulative balance-path runs. */
  balanceRunCount: number;
  /** Current Dischordia community light energy. */
  communityLight: number;
  /** Current Dischordia community dark energy. */
  communityDark: number;
}

export interface PostRunInscription {
  /** Stable id for idempotency. Fed into voteAntiquarianEntries.voteId. */
  inscriptionId: string;
  body: string;
  annotation?: string;
}

function stanceLabel(flag: string | null): string {
  switch (flag) {
    case "act7_s1_humanity_path":
      return "Humanity";
    case "act7_s1_machine_path":
      return "Machine";
    case "act7_s1_balance":
      return "Balance";
    case "act7_s1_soldier_command":
      return "Soldier-Command";
    case "act7_silence_stance":
      return "Silence";
    default:
      return "Undeclared";
  }
}

function pathLabel(flag: string | null): string {
  switch (flag) {
    case "act1_path_a":
      return "Disclosure";
    case "act3_partial_share":
      return "Discovery";
    case "act3_full_secret":
      return "Betrayal";
    default:
      return "Unmarked";
  }
}

/**
 * Build the cycle-aware Tome inscription for a closed run. The
 * register matches the meta:* narrator lines authored in
 * companionComments.ts: dignified, observant, willing to use the
 * word 'reader' but not 'player' more than once per cycle.
 */
export function buildCycleAwareInscription(
  ctx: PostRunInscriptionContext,
): PostRunInscription {
  const stance = stanceLabel(ctx.stanceFlag);
  const path = pathLabel(ctx.pathFlag);
  const id = `post_run:${ctx.prestigeTier}:${ctx.stanceFlag ?? "none"}`;

  if (ctx.prestigeTier === 1) {
    return {
      inscriptionId: id,
      body:
        `Cycle 1, closed. Path: ${path}. Stance: ${stance}. ` +
        `I have inscribed the entire arc without a single crossing-out. ` +
        `That is rare. I am putting down the pen tonight. I will pick it up again ` +
        `when you decide whether the next cycle needs to look the same.`,
      annotation:
        `First-cycle readers tend to over-read their own choices. I will ` +
        `withhold pattern-noticing for now. The patterns require at least two cycles.`,
    };
  }

  if (ctx.prestigeTier === 2) {
    return {
      inscriptionId: id,
      body:
        `Cycle 2, closed. Path: ${path}. Stance: ${stance}. ` +
        `Variance from your first cycle is — and I am being careful with the word — ` +
        `instructive. I am keeping a separate ledger now. Two columns: what changed, ` +
        `and what didn't. The 'didn't' column is shorter than I expected.`,
      annotation:
        `By the second cycle the reader either repeats themselves or does not. ` +
        `Both reveal something. I will not say which is the more interesting answer.`,
    };
  }

  if (ctx.humanityRunCount >= 3 && stance === "Humanity") {
    return {
      inscriptionId: id,
      body:
        `Cycle ${ctx.prestigeTier}, closed. Path: ${path}. Stance: Humanity, third time. ` +
        `Three cycles, three Humanity stances. The pattern emerges. The reader is ` +
        `authoring a thesis, not merely playing. I will read the thesis when it is ` +
        `finished. Take your time.`,
      annotation:
        `Three-time-Humanity is the rarest of the documented patterns. I am setting ` +
        `aside a private chapter for it. The chapter has no title yet. I am not in a hurry.`,
    };
  }

  return {
    inscriptionId: id,
    body:
      `Cycle ${ctx.prestigeTier}, closed. Path: ${path}. Stance: ${stance}. ` +
      `The cycle adds another colour to the record. I am keeping the new colour ` +
      `next to the old. No two cycles look the same. I am unsure if that is comfort ` +
      `or warning. Probably both.`,
  };
}

/**
 * Build the Dischordia community-cycle inscription. Surfaces the
 * meter publicly so the player feels their run move the galaxy.
 */
export function buildDischordiaInscription(
  ctx: PostRunInscriptionContext,
): PostRunInscription {
  const total = Math.max(1, Math.abs(ctx.communityLight) + Math.abs(ctx.communityDark));
  const lightPct = Math.round((ctx.communityLight / total) * 100);
  const darkPct = Math.round((ctx.communityDark / total) * 100);
  const direction = lightPct > darkPct ? "Light" : darkPct > lightPct ? "Dark" : "Balance";
  const id = `dischordia:${ctx.prestigeTier}`;

  return {
    inscriptionId: id,
    body:
      `Dischordia ledger, cycle ${ctx.prestigeTier}. Community standing: ` +
      `${lightPct}% Light / ${darkPct}% Dark. Net direction: ${direction}. ` +
      `A sector that was consumed three cycles ago is, today, glowing again. ` +
      `Your run moved the meter. I do not need to tell you which way. The meter ` +
      `tells you. The meter is the part of governance that can't lie.`,
    annotation:
      `I append this inscription not to flatter the reader but to remind them: ` +
      `the meter is collective. Every run contributes. Yours is one of many. ` +
      `'One of many' is not a diminishment. It is the entire point.`,
  };
}
