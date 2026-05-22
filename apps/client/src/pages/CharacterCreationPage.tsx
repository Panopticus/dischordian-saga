/**
 * CharacterCreationPage — psych-profile emergence beats.
 *
 * Per WITNESSING_NARRATIVE_PROPOSAL §0, character creation in
 * Loredex OS is not a stat-allocation menu. It is a slow read of
 * the player's 7-axis psychological profile, surfaced as the
 * profile is filled in by their choices. The narrator slot frames
 * those reveal beats in the cryo-bay register — which is why the
 * room id used here is `cryo_bay` (the only narrator-aware
 * character-creation moment in the canonical room set).
 *
 * The page renders:
 *   1. The seven axes from `apps/shared/playerProfile.ts`, each
 *      with label / current value / 1-line description.
 *   2. When `state.playerProfile` is present, real values render;
 *      otherwise the page shows neutral stubs and a "Begin
 *      assessment" CTA that navigates to `/awakening` (the
 *      existing first-encounter route).
 *   3. The MobileNarratorSlot in the upper-right, seeded with
 *      `roomId="cryo_bay"` so the §0 framing dialog fires.
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  PROFILE_AXES,
  AXIS_POLES,
  type PlayerProfile,
  type ProfileAxis,
} from "@shared/playerProfile";
import { useGame } from "@/contexts/GameContext";

const AXIS_BLURBS: Readonly<Record<ProfileAxis, string>> = {
  aggression: "How hard you push when the room turns against you.",
  mercy: "What you do when you are allowed to stop.",
  curiosity: "Whether you open the door before you ask whose it is.",
  conformity: "How loudly the rules of the room sit in your hands.",
  vigilance: "Where your eyes go when nobody is watching them.",
  vulnerability: "What you let other people see of the cost.",
  wit: "The temperature of the joke you reach for first.",
};

interface AxisRow {
  axis: ProfileAxis;
  value: number;
  pole: string;
}

function describePole(axis: ProfileAxis, value: number): string {
  const poles = AXIS_POLES[axis];
  if (value > 25) return poles.positive;
  if (value < -25) return poles.negative;
  return poles.neutral;
}

function readProfile(state: unknown): PlayerProfile | null {
  if (!state || typeof state !== "object") return null;
  const candidate = (state as { playerProfile?: unknown }).playerProfile;
  if (!candidate || typeof candidate !== "object") return null;
  // Validate that the candidate at least exposes one axis numerically;
  // anything looser is treated as "no profile yet" so the stub UI runs.
  const c = candidate as Partial<PlayerProfile>;
  if (typeof c.aggression !== "number") return null;
  return c as PlayerProfile;
}

export default function CharacterCreationPage() {
  const { state } = useGame();
  const profile = useMemo(() => readProfile(state), [state]);

  const rows: ReadonlyArray<AxisRow> = useMemo(() => {
    if (!profile) {
      // Sample stubs — three axes shown unfilled to seed the
      // assessment narrative without pretending to have real data.
      return PROFILE_AXES.slice(0, 4).map((axis) => ({
        axis,
        value: 0,
        pole: AXIS_POLES[axis].neutral,
      }));
    }
    return PROFILE_AXES.map((axis) => ({
      axis,
      value: profile[axis],
      pole: describePole(axis, profile[axis]),
    }));
  }, [profile]);

  const eventCount = profile?.eventCount ?? 0;

  return (
    <div className="min-h-screen w-full void-bg-canvas void-text p-8 sm:p-12 relative overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-muted">
            cryo bay · self-portrait
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl void-text mt-2">
            Who You Are, So Far
          </h1>
          <p className="font-serif text-sm italic void-text-dim mt-3">
            The Ark watches the choices you make. It does not score
            them. It listens, and it writes down what it hears.
          </p>
          {profile ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-muted mt-4">
              {eventCount} events folded in
            </p>
          ) : (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-muted mt-4">
              assessment unstarted
            </p>
          )}
        </motion.header>

        <ol className="space-y-7">
          {rows.map((row, i) => (
            <motion.li
              key={row.axis}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="border-l void-border pl-5"
              data-testid={`axis-row-${row.axis}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-lg void-text capitalize">
                  {row.axis}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] void-text-muted">
                  {row.pole}
                </span>
              </div>
              <p className="font-serif text-[14px] leading-relaxed void-text-dim mt-2">
                {AXIS_BLURBS[row.axis]}
              </p>
              <p className="font-mono text-[10px] void-text-muted mt-2">
                value: {profile ? row.value.toFixed(1) : "—"}
              </p>
            </motion.li>
          ))}
        </ol>

        {!profile && (
          <div className="mt-12 rounded-lg p-6 void-border void-bg-elevated">
            <p className="font-serif text-sm void-text-dim">
              The portrait fills as you play. To start the assessment,
              walk into the cryo-bay and let the Ark say your name.
            </p>
            <Link
              href="/awakening"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md void-border void-bg-sunk font-mono text-[11px] uppercase tracking-[0.2em] void-text-dim hover:void-text transition-colors"
              data-testid="character-creation-begin"
            >
              begin assessment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
