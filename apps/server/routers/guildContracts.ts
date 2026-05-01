/* ═══════════════════════════════════════════════════════
   GUILD CONTRACTS — F.2.1 / F.2.2 / F.2.3 cutscene trigger
   surface for the weekly guild board.

   This is a thin scaffold. The bible's F.2 contract loop
   (8 contracts auto-unlock Monday → players complete →
   guild treasury rewards) needs a content-design pass to
   define what the contracts actually ARE; the router
   shipped here exposes the cinematic-trigger seams so the
   client can drive cs_contract_unlock / cs_contract_complete /
   cs_house_cup_weekly_reset against real ISO-week boundaries
   today, before that design work lands.

   Once design defines the contract content, this router
   gets a `listAvailable` query backed by a content-config
   table (or generated deterministically from a week-seed),
   and `completeContract` validates the player actually
   met the contract's requirements before firing the
   cinematic. For now those checks are stubbed.

   No DB changes ship in this commit — week-rollover
   detection is purely date-arithmetic. A "have I seen
   this week's unlock cinematic?" claim is the client's
   responsibility (e.g., persisted in a localStorage flag
   keyed by the ISO week id from `currentWeekId()`).
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  type CutsceneTrigger,
  warEventCutscene,
} from "../../shared/expansionArt/guildCutsceneVoMap";
import {
  WEEKLY_CONTRACTS,
  getContractTemplate,
} from "../../shared/guildContracts";
import {
  getContractProgress,
  tryCompleteContract,
} from "../services/guildContractProgress";

/* ─── ISO-week helpers (pure, unit-tested) ─── */

/** Returns the ISO-week id ("YYYY-WNN") for the supplied date.
 *  Stable across timezones because we always compute against UTC.
 *  Exported for the test in guildContracts.weekId.test.ts. */
export function isoWeekId(date: Date): string {
  // Mirror the standard ISO 8601 week-numbering algorithm.
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(firstThursday, 0, 1));
  const weekNum = Math.floor(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 - 3 + ((yearStart.getUTCDay() + 6) % 7)) / 7,
  ) + 1;
  return `${firstThursday}-W${String(weekNum).padStart(2, "0")}`;
}

/** Convenience for the current week. Wrapped so tests can mock it
 *  via Date.now() or a clock-injection at the call site. */
export function currentWeekId(now: Date = new Date()): string {
  return isoWeekId(now);
}

/* ─── Router ─── */

export const guildContractsRouter = router({
  /**
   * Returns the 8 weekly contract templates the player's guild can
   * pursue this week, with the calling player's progress per
   * contract. Templates are global (same 8 for every guild every
   * week for now); a follow-up content pass can rotate them
   * deterministically per ISO week + guild seed without changing
   * this signature.
   */
  listAvailable: protectedProcedure.query(async ({ ctx }) => {
    const progress = await getContractProgress(ctx.user.id);
    return {
      weekId: currentWeekId(),
      contracts: WEEKLY_CONTRACTS,
      progress,
    };
  }),

  /**
   * F.2.1 — fired Monday tarot-flip when 8 contracts auto-unlock.
   *
   * Contract: client passes the last weekId it acknowledged. If that
   * weekId is older than the current week, fire the cinematic and
   * echo back the new weekId so the client can persist it.
   *
   * Design follow-up: wire this to a real content-config of weekly
   * contracts (8 per ISO week, deterministic per guild seed).
   */
  acknowledgeWeeklyUnlock: protectedProcedure
    .input(z.object({ lastSeenWeekId: z.string().nullable() }))
    .mutation(async ({ input }) => {
      const weekId = currentWeekId();
      const fired = input.lastSeenWeekId !== weekId;
      const cutscene: CutsceneTrigger | null = fired
        ? warEventCutscene("contract_unlock")
        : null;
      return { weekId, fired, cutscene };
    }),

  /**
   * F.2.2 — fires when a contract completes. Validates that the
   * contractId is one of the canonical 8 templates AND that the
   * player's running progress actually meets the target. Idempotent:
   * a second call after completedAt is set returns
   * `{ success: true, alreadyCompleted: true }` with no extra
   * cinematic so the player doesn't see the same beat twice from a
   * fat-fingered double-click.
   */
  completeContract: protectedProcedure
    .input(z.object({ contractId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const template = getContractTemplate(input.contractId);
      if (!template) {
        return { success: false, error: "Unknown contract id" } as const;
      }
      const result = await tryCompleteContract(ctx.user.id, input.contractId);
      if (!result.ok) {
        return {
          success: false as const,
          error:
            result.reason === "below_target"
              ? `Progress ${result.progressCount}/${result.targetCount} — not yet complete`
              : result.reason === "db_unavailable"
                ? "Database unavailable"
                : "Unknown contract id",
          progressCount: result.progressCount,
          targetCount: result.targetCount,
        };
      }
      return {
        success: true as const,
        contractId: template.id,
        title: template.title,
        rewards: template.rewards,
        progressCount: result.progressCount,
        targetCount: result.targetCount,
        alreadyCompleted: result.alreadyCompleted,
        // No cinematic on a double-claim — the player already saw it.
        cutscene: result.alreadyCompleted
          ? null
          : warEventCutscene("contract_complete"),
      };
    }),

  /**
   * F.2.3 — fired at the weekly reset boundary (Sunday → Monday
   * UTC). Same week-id pattern as acknowledgeWeeklyUnlock but
   * separate cinematic so the client can fire both back-to-back
   * (reset bed → unlock burst).
   */
  acknowledgeWeeklyReset: protectedProcedure
    .input(z.object({ lastSeenWeekId: z.string().nullable() }))
    .mutation(async ({ input }) => {
      const weekId = currentWeekId();
      const fired = input.lastSeenWeekId !== weekId;
      const cutscene: CutsceneTrigger | null = fired
        ? warEventCutscene("house_cup_weekly_reset")
        : null;
      return { weekId, fired, cutscene };
    }),
});
