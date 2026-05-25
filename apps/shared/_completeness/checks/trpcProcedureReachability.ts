/**
 * Marquee tRPC procedure client-reachability parity check.
 *
 * Generalises {@link checkEconomicMutationReachability}: every
 * player-marquee procedure (queries + mutations) declared below must
 * have at least one non-test `trpc.<router>.<procedure>.use{Query,
 * Mutation,InfiniteQuery,SuspenseQuery,Subscription}` binding under
 * apps/client/src.
 *
 * A procedure with no client caller is the canonical
 * "designed-but-unreachable" failure mode: the server logic exists
 * and may even be transactional, but no UI ever invokes it, so the
 * loop the design promises never closes.
 *
 * Hard parity. Adding a new player-marquee procedure means adding a
 * row here in the same change as the UI surface that calls it.
 *
 * The MARQUEE_PROCEDURES list intentionally stays small and curated:
 * it is the *player-facing* surface, not the full procedure catalogue
 * (admin / cron / internal procedures should not appear here). The
 * economic mutations in {@link checkEconomicMutationReachability} are
 * also load-bearing, but kept in their own file because they were the
 * gate's first reachability check and are referenced from PR audits
 * by that id.
 */
import {
  countTrpcClientCallSites,
} from "../scanner";
import type { RawParityCount } from "../types";

interface MarqueeProcedure {
  router: string;
  procedure: string;
  /** Why the player must be able to reach this. Surfaced in `missing`. */
  reason: string;
}

const MARQUEE_PROCEDURES: ReadonlyArray<MarqueeProcedure> = [
  // ─── Governance — public participation surface ─────────────
  {
    router: "architectConsole",
    procedure: "getActiveVotes",
    reason:
      "Governance Hub read path — without a caller the page reverts to a mock list (the canonical regression the governance-router-present gate guards against)",
  },
  {
    router: "architectConsole",
    procedure: "submitVote",
    reason:
      "Governance Hub write path — without a caller the player cannot vote on motions",
  },
  // ─── Saga ledger — the "Your Saga" player consequence feed ──
  {
    router: "saga",
    procedure: "ledger",
    reason:
      "Saga ledger read — the SAGA_EVENT_HUMANIZERS coverage gate ensures every event has a humanizer; this gate ensures the humanized ledger reaches the player",
  },
  // ─── Winback — comeback grant the player must be able to claim ─
  {
    router: "winback",
    procedure: "claim",
    reason:
      "Winback offer claim path — the lapse-scaled comeback reward is server-grant + anti-farm; without a client caller the offer never lands",
  },
  // ─── Loredex discovery — the lore browse surface ─────────────
  {
    router: "loredexCarry",
    procedure: "list",
    reason:
      "Per-member loredex carry list — the dead's discoveries are stamped onto survivors via rippleEngine; the player must be able to read them",
  },
  // ─── Mystery Engine — the deduction-panel feed ───────────────
  {
    router: "mysteryEngine",
    procedure: "getActiveMysteries",
    reason:
      "Mystery Engine arc list — the four §XVI authored arcs are registered (mystery-engine-roster gate); this gate ensures the player can actually browse them",
  },
];

export function checkTrpcProcedureReachability(): RawParityCount {
  const missing: string[] = [];
  for (const proc of MARQUEE_PROCEDURES) {
    const hits = countTrpcClientCallSites(proc.router, proc.procedure);
    if (hits === 0) {
      missing.push(
        `trpc.${proc.router}.${proc.procedure}: marquee player-facing ` +
          `procedure has no client useQuery/useMutation caller under ` +
          `apps/client/src — backend with no front door (${proc.reason})`,
      );
    }
  }
  return {
    declared: MARQUEE_PROCEDURES.length,
    implemented: MARQUEE_PROCEDURES.length - missing.length,
    missing,
  };
}
