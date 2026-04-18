/**
 * MatchSummary — post-match outcome + rewards screen.
 *
 * Replaces the current silent fade-to-menu behavior. Mounts when
 * `gameState.winner !== null` and shows:
 *   - Outcome banner (VICTORY / DEFEAT)
 *   - Encounter name if the match was an Act 1 named-boss pick
 *   - Per-match stats (turns, cards played, damage dealt)
 *   - Rewards applied (bond delta, memorable moment titles, flags raised)
 *   - Two call-to-action buttons: "Play Again" + "Return to Menu"
 *
 * The component is presentational — it reads the resolved rewards
 * off a prop rather than re-applying them. The parent (DuelystGameUI)
 * is the single writer to campaign state on match end; this UI only
 * mirrors what already happened.
 *
 * Screen-reader: the summary container has role="alert" +
 * aria-live="polite" so AT users hear the outcome + reward summary
 * when the screen mounts. The existing `announce()` singleton also
 * fires the one-line outcome sentence via the parent effect.
 */
import { motion } from "framer-motion";
import type { EncounterReward } from "@shared/act1EncounterRewards";

/** Stats tracked across the match, surfaced as summary rows. */
export interface MatchSummaryStats {
  /** 1-indexed global turn count when the match resolved. */
  turnsTaken: number;
  /** Total cards the player played from hand. */
  cardsPlayed: number;
  /** Total damage the player dealt (to units + general). Optional
   *  — the engine does not expose a running damage ledger yet, so
   *  the parent may pass `undefined` until that's wired. */
  damageDealt?: number;
  /** Whether the player conceded. Surfaces a distinct subtitle. */
  conceded: boolean;
}

export interface MatchSummaryProps {
  outcome: "victory" | "defeat";
  /** Encounter name when the match was a named Act 1 boss; null for
   *  faction-sparring / PvP. */
  encounterName: string | null;
  stats: MatchSummaryStats;
  /** Resolved reward row — null when there was no match-end reward
   *  (sparring, PvP, unmapped encounter). */
  reward: EncounterReward | null;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

function outcomeCopy(
  outcome: "victory" | "defeat",
  conceded: boolean,
): { title: string; subtitle: string } {
  if (outcome === "victory") {
    return {
      title: "VICTORY",
      subtitle: "The enemy general has fallen.",
    };
  }
  return conceded
    ? {
        title: "WITHDRAWN",
        subtitle: "You stepped away from the match.",
      }
    : {
        title: "DEFEAT",
        subtitle: "Your general has been destroyed.",
      };
}

export function MatchSummary({
  outcome,
  encounterName,
  stats,
  reward,
  onPlayAgain,
  onReturnToMenu,
}: MatchSummaryProps) {
  const { title, subtitle } = outcomeCopy(outcome, stats.conceded);
  const bond = reward?.narratorBondDelta ?? 0;
  const flags = reward?.flagsToSet ?? [];
  const moments = reward?.memorableMoments ?? [];

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      aria-label={`${title}. ${subtitle}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[600px] gap-6 p-6"
      data-testid="match-summary"
    >
      <header className="text-center">
        <h2
          className={
            "font-display text-3xl tracking-[0.3em] mb-2 " +
            (outcome === "victory"
              ? "text-primary glow-cyan"
              : "text-destructive")
          }
        >
          {title}
        </h2>
        {encounterName && (
          <p className="font-serif text-sm text-stone-400 italic">
            {encounterName}
          </p>
        )}
        <p className="font-mono text-sm text-muted-foreground mt-2">
          {subtitle}
        </p>
      </header>

      {/* ─── Per-match stats ─── */}
      <section
        aria-label="Match statistics"
        className="flex flex-wrap justify-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-stone-500"
      >
        <div>
          <div className="text-[9px] text-stone-600">Turns</div>
          <div className="text-stone-300 text-base">{stats.turnsTaken}</div>
        </div>
        <div>
          <div className="text-[9px] text-stone-600">Cards played</div>
          <div className="text-stone-300 text-base">{stats.cardsPlayed}</div>
        </div>
        {stats.damageDealt !== undefined && (
          <div>
            <div className="text-[9px] text-stone-600">Damage dealt</div>
            <div className="text-stone-300 text-base">{stats.damageDealt}</div>
          </div>
        )}
      </section>

      {/* ─── Rewards ─── */}
      {reward && (bond !== 0 || flags.length > 0 || moments.length > 0) && (
        <section
          aria-label="Rewards earned"
          className="border border-stone-800 rounded p-4 max-w-md w-full"
          data-testid="match-summary-rewards"
        >
          <h3 className="font-mono text-[10px] tracking-[0.3em] text-stone-500 uppercase mb-3">
            Rewards
          </h3>
          <ul className="font-serif text-sm text-stone-300 space-y-2">
            {bond !== 0 && (
              <li>
                Narrator bond{" "}
                <span
                  className={bond > 0 ? "text-emerald-400" : "text-amber-400"}
                >
                  {bond > 0 ? "+" : ""}
                  {bond}
                </span>
              </li>
            )}
            {moments.map((m, i) => (
              <li key={`m${i}`} className="italic text-stone-400">
                "{m.subtitle}"
              </li>
            ))}
            {flags.length > 0 && (
              <li className="font-mono text-[10px] text-stone-500">
                {flags.length} narrative flag{flags.length > 1 ? "s" : ""}{" "}
                recorded.
              </li>
            )}
          </ul>
        </section>
      )}

      {/* ─── Actions ─── */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onPlayAgain}
          data-testid="match-summary-play-again"
          className="px-6 py-2 bg-primary/10 border border-primary/40 text-primary rounded font-mono text-sm hover:bg-primary/20 transition-colors"
        >
          PLAY AGAIN
        </button>
        <button
          type="button"
          onClick={onReturnToMenu}
          data-testid="match-summary-return-menu"
          className="px-6 py-2 bg-stone-900 border border-stone-700 text-stone-300 rounded font-mono text-sm hover:bg-stone-800 transition-colors"
        >
          RETURN TO MENU
        </button>
      </div>
    </motion.div>
  );
}

export default MatchSummary;
