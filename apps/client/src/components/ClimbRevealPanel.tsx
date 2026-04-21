/**
 * ClimbRevealPanel — post-win "I see you" reveal, rendered
 * dynamically from the player's real profile + recent events.
 *
 * Shown after the player wins a best-of-3 series at Tier 1+.
 * Replaces the static placeholder lines in chessClimbDialog.ts
 * with live data:
 *   Tier 1: Reveal 1 — two chess-domain facts
 *   Tier 2: Reveal 2 — cross-system cite
 *   Tier 3: Reveal 3 — seven-sentence portrait pair
 */
import { trpc } from "@/lib/trpc";
import {
  buildReveal1Lines,
  buildReveal2Lines,
  buildReveal3Lines,
  type ProfileEventSummary,
} from "@shared/playerProfileReveals";
import { emptyProfile } from "@shared/playerProfile";

export interface ClimbRevealPanelProps {
  tierRank: 0 | 1 | 2 | 3;
}

export default function ClimbRevealPanel({ tierRank }: ClimbRevealPanelProps) {
  const profileQ = trpc.playerProfile.getProfile.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const eventsQ = trpc.playerProfile.getRecentEvents.useQuery(
    { limit: 60 },
    { refetchOnWindowFocus: false },
  );

  if (tierRank === 0) return null;
  const profile = profileQ.data ?? emptyProfile();
  const events: ProfileEventSummary[] =
    eventsQ.data?.map((e) => ({
      source: e.source,
      payload: e.payload ?? null,
      createdAt: new Date(e.createdAt),
    })) ?? [];

  if (tierRank === 1) {
    const lines = buildReveal1Lines({ profile, recentEvents: events });
    return (
      <section className="p-4 border border-void-text-accent/60 rounded bg-void-bg/60 space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-void-text-muted">
          The Game Master, on you
        </h3>
        {lines.map((line, i) => (
          <p key={i} className="text-sm italic text-void-text">
            {line}
          </p>
        ))}
      </section>
    );
  }

  if (tierRank === 2) {
    const lines = buildReveal2Lines({ profile, recentEvents: events });
    return (
      <section className="p-4 border border-void-text-accent/60 rounded bg-void-bg/60 space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-void-text-muted">
          The Game Master, on you — beyond the board
        </h3>
        {lines.map((line, i) => (
          <p key={i} className="text-sm italic text-void-text">
            {line}
          </p>
        ))}
      </section>
    );
  }

  // Tier 3 — the full portrait pair.
  const { playerPortrait, engineerPortrait, closer } = buildReveal3Lines({ profile });
  return (
    <section className="p-4 border border-void-text-accent/60 rounded bg-void-bg/60 space-y-4">
      <h3 className="text-xs uppercase tracking-widest text-void-text-muted">
        Portrait pair
      </h3>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-void-text-muted mb-1">
          You, in seven sentences
        </p>
        <ol className="space-y-1 text-sm italic text-void-text">
          {playerPortrait.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-void-text-muted mb-1">
          The Engineer, at your age, by the same instrument
        </p>
        <ol className="space-y-1 text-sm italic text-void-text">
          {engineerPortrait.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </div>
      <p className="text-sm italic text-void-text-accent pt-2 border-t border-void-border/30">
        {closer}
      </p>
    </section>
  );
}
