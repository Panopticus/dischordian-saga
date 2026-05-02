/* ═══════════════════════════════════════════════════════
   ARCHITECT ADDRESS — first-visit Socratic ceremony.

   Six-beat overlay played the first time a player lands on
   the governance hub after Vote #0 has been recorded. Beats:
     1. Greeting (a question, not a welcome)
     2. Vote #0 callback (branches: confirmed / looked_away / unknown)
     3. System description (Roycean)
     4. Live tally framing
     5. Re-cast offer (Kierkegaardian leap) — the player decides
        once whether to keep or switch their original answer.
     6. Reactive monologue close (band-keyed line + alignment)

   On completion, the page renders a persistent "monologue panel"
   above the active vote. Pacing is intentionally slow — Socratic
   delivery needs breath. Reduce-motion collapses to instant text.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KineticText from "@/components/void/KineticText";
import {
  FIRST_VISIT_CEREMONY,
  getArchitectCommentary,
  type PlayerChoice,
  type TallyInput,
} from "@shared/architectGovernanceVoices";

interface ArchitectAddressProps {
  /** The player's persistent Vote #0 answer (`null` until synced). */
  voteZero: PlayerChoice;
  /** Live Vote #0 tally — drives beat #4 framing + the reactive
   *  monologue close. */
  tally: TallyInput;
  /** Whether the re-cast gate is still open (i.e.
   *  `architect_intro_revote_used` flag is NOT set). When closed,
   *  the ceremony skips beat #5. */
  recastAvailable: boolean;
  /** Callback fired when the player decides at beat #5. Receives
   *  the FINAL response (their kept-or-switched answer). The page
   *  is responsible for calling `recastVoteZero` on the server. */
  onRecastDecision: (response: "confirmed" | "looked_away") => void;
  /** Fired once the ceremony completes (beat #6 acknowledged).
   *  Use this to set the persistence flag so future visits skip
   *  the overlay and render only the monologue panel. */
  onComplete: () => void;
}

type Beat = 1 | 2 | 3 | 4 | 5 | 6;

/** A throttled-but-deliberate beat duration (ms). The Architect
 *  speaks slowly. Reduce-motion users get a hard 0. */
function beatDelay(): number {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  return 1800;
}

export default function ArchitectAddress({
  voteZero,
  tally,
  recastAvailable,
  onRecastDecision,
  onComplete,
}: ArchitectAddressProps) {
  const [beat, setBeat] = useState<Beat>(1);
  const [recastResolved, setRecastResolved] = useState(false);
  const [recastVerdict, setRecastVerdict] = useState<"reaffirmed" | "recanted" | null>(null);

  const commentary = useMemo(
    () =>
      getArchitectCommentary({
        tally,
        playerChoice: voteZero,
      }),
    [tally, voteZero],
  );

  const callback = voteZero === "confirmed"
    ? FIRST_VISIT_CEREMONY.callbackConfirmed
    : voteZero === "looked_away"
      ? FIRST_VISIT_CEREMONY.callbackLookedAway
      : FIRST_VISIT_CEREMONY.callbackUnknown;

  const totalVotes = tally.confirm + tally.lookAway;
  const confirmPct = totalVotes > 0 ? Math.round((tally.confirm / totalVotes) * 100) : 50;

  // Auto-advance through beats 1 → 2 → 3 → 4. Beats 5 + 6 are
  // gated on player input (or instant-skip if re-cast is unavailable).
  useEffect(() => {
    if (beat >= 5) return;
    const t = setTimeout(() => setBeat(((beat as number) + 1) as Beat), beatDelay());
    return () => clearTimeout(t);
  }, [beat]);

  // If beat 5 fires but re-cast is unavailable, skip straight to 6.
  useEffect(() => {
    if (beat === 5 && !recastAvailable) {
      setRecastResolved(true);
      const t = setTimeout(() => setBeat(6), beatDelay());
      return () => clearTimeout(t);
    }
  }, [beat, recastAvailable]);

  const handleRecast = useCallback(
    (response: "confirmed" | "looked_away") => {
      const switched = voteZero !== null && voteZero !== response;
      setRecastVerdict(switched ? "recanted" : "reaffirmed");
      setRecastResolved(true);
      onRecastDecision(response);
      const t = setTimeout(() => setBeat(6), beatDelay());
      return () => clearTimeout(t);
    },
    [voteZero, onRecastDecision],
  );

  const handleStand = useCallback(() => {
    if (!voteZero) {
      // No prior answer — "stand" means keep null and proceed.
      setRecastResolved(true);
      setBeat(6);
      return;
    }
    handleRecast(voteZero);
  }, [voteZero, handleRecast]);

  const handleClose = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <motion.div
      role="dialog"
      aria-label="The Architect Opens the Chamber"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="void-elevated p-6 mb-6 relative overflow-hidden"
    >
      {/* Architect attribution */}
      <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-muted-foreground/60 mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-60" aria-hidden />
        THE ARCHITECT · FIRST AUDIENCE
      </div>

      <div className="space-y-4 max-w-3xl">
        {/* Beat 1 — greeting */}
        {beat >= 1 && (
          <div>
            {FIRST_VISIT_CEREMONY.greeting.map((line, i) => (
              <p key={i} className="font-serif text-[13px] leading-relaxed text-foreground/90 italic">
                <KineticText text={line} mode="word" speed={45} showCursor={false} />
              </p>
            ))}
          </div>
        )}

        {/* Beat 2 — Vote #0 callback */}
        {beat >= 2 && (
          <p className="font-serif text-[13px] leading-relaxed text-foreground/90 italic">
            <KineticText text={callback} mode="word" speed={45} showCursor={false} />
          </p>
        )}

        {/* Beat 3 — system description */}
        {beat >= 3 && (
          <p className="font-serif text-[13px] leading-relaxed text-foreground/85 italic">
            <KineticText
              text={FIRST_VISIT_CEREMONY.systemDescription}
              mode="word"
              speed={45}
              showCursor={false}
            />
          </p>
        )}

        {/* Beat 4 — live tally + framing */}
        {beat >= 4 && (
          <div>
            <p className="font-serif text-[13px] leading-relaxed text-foreground/85 italic mb-3">
              <KineticText
                text={FIRST_VISIT_CEREMONY.tallyFraming}
                mode="word"
                speed={45}
                showCursor={false}
              />
            </p>
            <div className="void-surface p-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${confirmPct}%`,
                      background: "linear-gradient(90deg, color-mix(in oklch, var(--energy-primary) 35%, transparent), color-mix(in oklch, var(--energy-primary) 55%, transparent))",
                      transition: "width 600ms ease-out",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 font-mono text-[8px] uppercase tracking-wider">
                  <span className="text-muted-foreground/60">CONFIRM · {confirmPct}%</span>
                  <span className="text-muted-foreground/60">LOOK AWAY · {100 - confirmPct}%</span>
                </div>
              </div>
              <div className="font-mono text-[9px] text-muted-foreground/50">
                {totalVotes.toLocaleString()} answered
              </div>
            </div>
          </div>
        )}

        {/* Beat 5 — re-cast offer (gated on availability) */}
        <AnimatePresence>
          {beat >= 5 && recastAvailable && !recastResolved && (
            <motion.div
              key="recast"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-serif text-[13px] leading-relaxed text-foreground/90 italic mb-3">
                <KineticText
                  text={FIRST_VISIT_CEREMONY.recastOffer}
                  mode="word"
                  speed={45}
                  showCursor={false}
                />
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleRecast("confirmed")}
                  className="void-btn font-mono text-[10px] tracking-[0.18em] uppercase"
                  style={{ minHeight: "36px", padding: "8px 18px" }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => handleRecast("looked_away")}
                  className="void-btn font-mono text-[10px] tracking-[0.18em] uppercase"
                  style={{ minHeight: "36px", padding: "8px 18px" }}
                >
                  Look Away
                </button>
                <button
                  type="button"
                  onClick={handleStand}
                  className="void-btn font-mono text-[10px] tracking-[0.18em] uppercase opacity-70"
                  style={{ minHeight: "36px", padding: "8px 18px" }}
                >
                  Stand
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Beat 5 verdict line (after the player decides) */}
        {recastResolved && recastVerdict && (
          <p className="font-serif text-[12px] leading-relaxed text-foreground/70 italic">
            <KineticText
              text={
                recastVerdict === "reaffirmed"
                  ? FIRST_VISIT_CEREMONY.recastReaffirmed
                  : FIRST_VISIT_CEREMONY.recastRecanted
              }
              mode="word"
              speed={45}
              showCursor={false}
            />
          </p>
        )}

        {/* Beat 6 — reactive monologue close */}
        {beat >= 6 && (
          <div className="pt-2 mt-2 border-t" style={{ borderColor: "color-mix(in oklch, var(--energy-primary) 12%, transparent)" }}>
            <p className="font-serif text-[13px] leading-relaxed text-foreground/95 italic">
              <KineticText text={commentary.fullText} mode="word" speed={45} showCursor={false} />
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="void-btn void-btn-primary font-mono text-[10px] tracking-[0.18em] uppercase"
                style={{ minHeight: "36px", padding: "8px 18px" }}
              >
                Enter the Chamber
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   ARCHITECT MONOLOGUE PANEL — persistent, post-ceremony.

   Replaces the address overlay on every visit after the player
   has completed the first-visit ceremony. Shows the current
   reactive monologue line (band + alignment + warmth) and
   re-renders silently as the tally drifts.
   ═══════════════════════════════════════════════════════ */

interface ArchitectMonologueProps {
  voteZero: PlayerChoice;
  tally: TallyInput;
  /** Trigger the warmth half-line. Caller decides — typically
   *  near-zero conformity AND a recent band crossing. */
  emitWarmth?: boolean;
}

export function ArchitectMonologue({
  voteZero,
  tally,
  emitWarmth = false,
}: ArchitectMonologueProps) {
  const commentary = useMemo(
    () => getArchitectCommentary({ tally, playerChoice: voteZero, emitWarmth }),
    [tally, voteZero, emitWarmth],
  );

  return (
    <div className="void-elevated p-4 mb-4">
      <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-muted-foreground/60 mb-2 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-60" aria-hidden />
        THE ARCHITECT
      </div>
      <p className="font-serif text-[12px] leading-relaxed text-foreground/85 italic">
        <KineticText
          // Re-mount key on band change so the line replays its
          // word-decode rather than diffing in place.
          key={commentary.band + (commentary.alignment ?? "") + (commentary.warmth ?? "")}
          text={commentary.fullText}
          mode="word"
          speed={45}
          showCursor={false}
        />
      </p>
    </div>
  );
}
