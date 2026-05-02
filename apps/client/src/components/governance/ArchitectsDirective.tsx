/* ═══════════════════════════════════════════════════════
   ARCHITECT'S DIRECTIVE — Helldivers-2 Major Order card.

   Pinned framed card above the Reality Front map. Mirrors the
   Major Order register: title, Architect framing line, affected-
   sector callout, participation counter, countdown, and outcome
   state. Flips to a Verdict Card on close.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { Clock, Users } from "lucide-react";
import {
  getArchitectCommentary,
  type PlayerChoice,
  type TallyInput,
} from "@shared/architectGovernanceVoices";
import {
  getFrontBinding,
  type RealityFrontSectorId,
} from "@shared/governanceFrontBindings";

interface ArchitectsDirectiveProps {
  /** Active vote id. When `null`, renders an idle "the chamber
   *  rests" state. */
  voteId: string | null;
  voteTitle: string;
  /** Live tally for the active vote, keyed by 1-based optionNumber. */
  tally: Readonly<Record<number, number>>;
  /** Ends-at timestamp (ms) for the countdown. */
  endsAt: number | null;
  /** The player's stance on the Confirm/Look-Away spine — drives
   *  alignment overlay in the Architect's framing line. */
  playerChoice: PlayerChoice;
}

function formatCountdown(targetMs: number): string {
  const diff = targetMs - Date.now();
  if (diff <= 0) return "CLOSED";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function prettyName(id: string): string {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ArchitectsDirective({
  voteId,
  voteTitle,
  tally,
  endsAt,
  playerChoice,
}: ArchitectsDirectiveProps) {
  // Trigger countdown re-render every minute.
  const [, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(i);
  }, []);

  if (!voteId) {
    return (
      <div className="void-elevated p-4 mb-4">
        <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-muted-foreground/50 mb-2">
          THE ARCHITECT'S DIRECTIVE
        </div>
        <p className="font-serif text-[12px] italic text-foreground/60 leading-relaxed">
          The chamber rests. No directive is open. The Eye does not blink unless asked.
        </p>
      </div>
    );
  }

  // Resolve Confirm / Look-Away tallies from the per-option tally
  // by mapping each option's eyeFraming through the binding (if
  // the vote is registered) — falls back to optionNumber 1=Confirm,
  // 2=Look-Away for unregistered votes (matching Vote #0).
  const binding = getFrontBinding(voteId);
  let confirmCount = 0;
  let lookAwayCount = 0;
  for (const [optStr, n] of Object.entries(tally)) {
    const optNum = Number(optStr);
    const opt = binding?.options[optNum];
    const sign = opt
      ? opt.controlDelta >= 0
        ? "confirm"
        : "look_away"
      : optNum === 1
        ? "confirm"
        : optNum === 2
          ? "look_away"
          : "neutral";
    if (sign === "confirm") confirmCount += n;
    else if (sign === "look_away") lookAwayCount += n;
  }

  const tallyInput: TallyInput = { confirm: confirmCount, lookAway: lookAwayCount };
  const commentary = getArchitectCommentary({
    tally: tallyInput,
    playerChoice,
  });

  // Affected sectors — union of all option bindings.
  const affectedSectors: RealityFrontSectorId[] = binding
    ? Array.from(
        new Set(
          Object.values(binding.options).flatMap((o) => o.affectedSectors),
        ),
      )
    : [];

  const totalCast = confirmCount + lookAwayCount;
  const countdown = endsAt ? formatCountdown(endsAt) : "—";

  return (
    <div className="void-elevated p-5 mb-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-muted-foreground/60">
          THE ARCHITECT'S DIRECTIVE
        </div>
        <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <Users size={10} /> {totalCast.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} /> {countdown}
          </span>
        </div>
      </div>

      <h3 className="font-display text-base font-bold tracking-wider text-foreground mb-2">
        {voteTitle}
      </h3>

      {/* Architect framing — band line + alignment overlay. */}
      <p className="font-serif text-[12px] leading-relaxed text-foreground/85 italic mb-3">
        {commentary.fullText}
      </p>

      {/* Affected sectors */}
      {affectedSectors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground/50">
            FRONT:
          </span>
          {affectedSectors.map((s) => (
            <span
              key={s}
              className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-foreground/65 border border-white/10"
            >
              {prettyName(s)}
            </span>
          ))}
        </div>
      )}

      {/* Confirm/Look-Away mini-bar */}
      {totalCast > 0 && (
        <div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div
              className="h-full"
              style={{
                width: `${(confirmCount / totalCast) * 100}%`,
                background: "linear-gradient(90deg, color-mix(in oklch, var(--energy-primary) 35%, transparent), color-mix(in oklch, var(--energy-primary) 60%, transparent))",
                transition: "width 600ms ease-out",
              }}
            />
          </div>
          <div className="flex justify-between mt-1 font-mono text-[7px] uppercase tracking-[0.18em]">
            <span className="text-muted-foreground/55">CONFIRM · {Math.round((confirmCount / totalCast) * 100)}%</span>
            <span className="text-muted-foreground/55">LOOK AWAY · {Math.round((lookAwayCount / totalCast) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
