/**
 * Chess Climb — the escalating stakes ladder.
 *
 * Four voluntary tiers. Player picks one they have unlocked. The
 * page runs through pre-series dialog, a best-of-3 (handled by
 * the existing match components), and the post-series dialog
 * with appropriate stakes applied.
 *
 * In this iteration the UI is a tier-selection grid + a status
 * panel showing the active run. The actual board rendering reuses
 * the existing ChessPage match flow — climb state is orthogonal.
 * We defer the fully-integrated in-match banner to Phase E (mind
 * games) since the two features share cue infrastructure.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { CHESS_CLIMB_TIERS } from "@shared/chessClimbTiers";
import { getLoginUrl } from "@/const";
import ClimbRevealPanel from "@/components/ClimbRevealPanel";
import "@/styles/chessMatrix.css";

type TierStateView = {
  id: keyof typeof CHESS_CLIMB_TIERS;
  unlocked: boolean;
  lockedReason?: string;
};

export default function ChessClimbPage() {
  const { isAuthenticated } = useAuth();
  const stateQ = trpc.chessClimb.getState.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const startMut = trpc.chessClimb.startClimb.useMutation({
    onSuccess: () => stateQ.refetch(),
  });
  const abandonMut = trpc.chessClimb.abandonClimb.useMutation({
    onSuccess: () => stateQ.refetch(),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <a href={getLoginUrl()} className="text-void-text-accent underline">
          Sign in to climb the Game Master's Arena.
        </a>
      </div>
    );
  }

  const state = stateQ.data;
  const unlocked = new Set(state?.unlockedTiers ?? []);
  const tiers: TierStateView[] = (
    Object.keys(CHESS_CLIMB_TIERS) as Array<keyof typeof CHESS_CLIMB_TIERS>
  ).map((id) => {
    if (unlocked.has(id)) {
      // Tier 2 may still be in cooldown even if unlocked.
      const tier = CHESS_CLIMB_TIERS[id];
      if (
        tier.rank >= 2 &&
        state?.unlocks.isTier2LockedOut
      ) {
        return { id, unlocked: false, lockedReason: "Tier 2 lockout in effect" };
      }
      return { id, unlocked: true };
    }
    const tier = CHESS_CLIMB_TIERS[id];
    if (tier.rank > (state?.unlocks.highestClearedRank ?? -1) + 1) {
      return { id, unlocked: false, lockedReason: "Clear a lower tier first" };
    }
    if (tier.id === "tier_3_labyrinth_wager" && !state?.princesGameCompleted) {
      return { id, unlocked: false, lockedReason: "Finish the Prince's Game first" };
    }
    return { id, unlocked: false, lockedReason: "Locked" };
  });

  const activeRun = state?.activeRun;

  return (
    <div
      className="chess-arena-glitch min-h-screen p-6 max-w-4xl mx-auto text-void-text"
      style={{
        ["--chess-arena-glitch-intensity" as const]:
          (state?.activeRun?.tierRank ?? 0) >= 2 ? 0.7 : 0.3,
      } as React.CSSProperties}
    >
      <header className="mb-6">
        <h1 className="text-2xl tracking-wide">The Game Master's Arena — Climb</h1>
        <p className="text-sm text-void-text-muted mt-1 italic">
          Voluntary. Advertised. Escalating. Decline at any tier at no cost.
          Tier 0 is always free play.
        </p>
      </header>

      {activeRun && (
        <section className="mb-8 border border-void-border/60 rounded p-4 bg-void-bg/60">
          <h2 className="text-sm uppercase tracking-widest text-void-text-muted mb-2">
            Active climb
          </h2>
          <div className="flex flex-wrap items-baseline gap-4">
            <span className="text-void-text-accent">
              {CHESS_CLIMB_TIERS[activeRun.tierId as keyof typeof CHESS_CLIMB_TIERS]?.title}
            </span>
            <span className="text-xs text-void-text-muted">
              G1: {activeRun.game1Result ?? "—"} · G2: {activeRun.game2Result ?? "—"}
              {activeRun.game3Result ? ` · G3: ${activeRun.game3Result}` : ""}
            </span>
          </div>
          <button
            onClick={() => abandonMut.mutate()}
            disabled={abandonMut.isPending}
            className="mt-3 text-xs text-void-text-error underline"
          >
            Abandon (no stakes applied)
          </button>
        </section>
      )}

      {/* Reveal panel: if the player has just won a Tier 1+ climb
          their highestClearedRank reflects it; render the matching
          "I see you" beat dynamically from their live profile. */}
      {(() => {
        const rank = state?.unlocks.highestClearedRank ?? -1;
        if (rank < 1) return null;
        const bounded = Math.min(3, rank) as 1 | 2 | 3;
        return (
          <div className="mb-8">
            <ClimbRevealPanel tierRank={bounded} />
          </div>
        );
      })()}

      <section>
        <h2 className="text-sm uppercase tracking-widest text-void-text-muted mb-3">
          Tiers
        </h2>
        <div className="grid gap-3">
          {tiers.map((view) => {
            const tier = CHESS_CLIMB_TIERS[view.id];
            return (
              <div
                key={view.id}
                className={`border rounded p-4 ${
                  view.unlocked
                    ? "border-void-text-accent/60 bg-void-bg/40"
                    : "border-void-border/30 bg-void-bg/20 opacity-50"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-void-text">
                    Tier {tier.rank} — {tier.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider">
                    AI {tier.aiDifficulty}
                  </span>
                </div>
                <p className="text-xs italic text-void-text-muted mt-1">
                  {tier.tagline}
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] text-void-text-muted mt-2">
                  <span>
                    <span className="uppercase">loss:</span>{" "}
                    {tier.lossStakes.join(", ")}
                  </span>
                  <span>
                    <span className="uppercase">win:</span>{" "}
                    {tier.winRewards.join(", ")}
                  </span>
                </div>
                {view.unlocked ? (
                  <button
                    disabled={!!activeRun || startMut.isPending}
                    onClick={() => startMut.mutate({ tierId: view.id })}
                    className="mt-3 text-xs text-void-text-accent underline disabled:opacity-30"
                  >
                    Begin best-of-3
                  </button>
                ) : (
                  <span className="block mt-3 text-xs text-void-text-muted">
                    {view.lockedReason}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {startMut.error && (
        <p className="mt-4 text-xs text-void-text-error">
          {startMut.error.message}
        </p>
      )}
    </div>
  );
}
