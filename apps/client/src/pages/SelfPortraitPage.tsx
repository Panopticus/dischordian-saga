/**
 * Self-Portrait — the player's psychological profile, visible to them.
 *
 * The game is measuring you. The Game Master is the first NPC who
 * reads it back to you — at chess Tier 1 he cites two facts, at
 * Tier 2 he cites a fact from outside chess, at Tier 3 he reads
 * the seven-sentence portrait aloud. This page is where you can
 * see the same instrument he uses, any time you want.
 *
 * Surfacing the measurement is a trust gesture. The game is not
 * hiding what it knows about you. You are invited to read your own
 * shape.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  PROFILE_AXES,
  AXIS_POLES,
  getProfileBlurb,
  buildPortraitSentences,
  emptyProfile,
  type PlayerProfile,
  type ProfileAxis,
} from "@shared/playerProfile";
import { getLoginUrl } from "@/const";

/** Map an axis value in [-100, 100] to a visual position 0..100
 *  for a horizontal scale. -100 = far left, 0 = center, +100 = far
 *  right. */
function axisToScalePos(value: number): number {
  return (value + 100) / 2;
}

function AxisRow({ axis, profile }: { axis: ProfileAxis; profile: PlayerProfile }) {
  const value = profile[axis];
  const blurb = getProfileBlurb(axis, profile);
  const poles = AXIS_POLES[axis];
  const pos = axisToScalePos(value);

  return (
    <div className="border border-void-border rounded p-4 bg-void-bg/40">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-void-text capitalize text-sm tracking-wide">
          {axis}
        </h3>
        <span className="text-xs text-void-text-muted italic">{blurb}</span>
      </div>

      <div className="relative h-2 bg-void-bg rounded">
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-void-text-accent"
          style={{ left: `${pos}%` }}
        />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-void-border" />
      </div>

      <div className="flex justify-between text-[10px] text-void-text-muted mt-1 uppercase tracking-wider">
        <span>{poles.negative}</span>
        <span className="opacity-50">{poles.neutral}</span>
        <span>{poles.positive}</span>
      </div>
    </div>
  );
}

export default function SelfPortraitPage() {
  const { isAuthenticated } = useAuth();

  const profileQ = trpc.playerProfile.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const eventsQ = trpc.playerProfile.getRecentEvents.useQuery(
    { limit: 20 },
    {
      enabled: isAuthenticated,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <a
          href={getLoginUrl()}
          className="text-void-text-accent underline"
        >
          Sign in to see your Self-Portrait.
        </a>
      </div>
    );
  }

  const profile: PlayerProfile = profileQ.data ?? emptyProfile();
  const portrait = buildPortraitSentences(profile);
  const events = eventsQ.data ?? [];

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto text-void-text">
      <header className="mb-6">
        <h1 className="text-2xl tracking-wide">Self-Portrait</h1>
        <p className="text-sm text-void-text-muted mt-1 italic">
          The instrument the game uses to read you. Every meaningful
          choice you have made has moved one or more of these seven
          axes. The Game Master reads the same instrument.
        </p>
        <p className="text-xs text-void-text-muted mt-2">
          Events folded in: {profile.eventCount}
          {profile.lastUpdatedAt
            ? `  ·  last updated ${new Date(profile.lastUpdatedAt).toLocaleString()}`
            : "  ·  no events recorded yet"}
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-sm uppercase tracking-widest text-void-text-muted mb-3">
          The seven axes
        </h2>
        <div className="grid gap-3">
          {PROFILE_AXES.map((axis) => (
            <AxisRow key={axis} axis={axis} profile={profile} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm uppercase tracking-widest text-void-text-muted mb-3">
          Portrait, in seven sentences
        </h2>
        <ol className="space-y-2 text-sm leading-relaxed">
          {portrait.map((line, i) => (
            <li key={i} className="text-void-text">
              {line}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-void-text-muted mb-3">
          Recent events ({events.length})
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-void-text-muted italic">
            Nothing recorded yet. Make choices.
          </p>
        ) : (
          <ul className="space-y-1 text-xs">
            {events.map((e) => (
              <li
                key={e.id}
                className="font-mono text-void-text-muted flex justify-between gap-3 py-1 border-b border-void-border"
              >
                <span className="truncate">{e.source}</span>
                <span className="opacity-60">
                  {new Date(e.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
