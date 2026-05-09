/**
 * MemorialCorridorPage — §1.5 trust-40 memorial unlock.
 *
 * The Memorial Corridor is the room where the Ark remembers its
 * fallen. Per NARRATIVE_ARCHITECTURE.md §1.5, it gates open at
 * Bond-40 with either Elara or The Human, and the narrator slot
 * carries commentary on per-NPC death/revival as the player
 * walks the wall of names.
 *
 * The page renders:
 *   1. A locked-state shell when neither bond has reached 40
 *   2. The corridor itself when at least one bond is past the
 *      threshold — a vertical column of fallen-NPC entries with
 *      cause-of-death and a "remembrance" affordance
 *   3. The MobileNarratorSlot in the upper-right, seeded with
 *      `roomId="memorial_corridor"` so the §1.5 dialog tree fires
 *
 * `state.npcDeaths` is read defensively — the corridor renders a
 * small static fallback when GameContext doesn't yet track per-NPC
 * deaths. The render itself never crashes on empty state.
 */
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { MobileNarratorSlot } from "@/components/MobileNarratorSlot";
import { useNarrativeAnimSpeed } from "@/hooks/useStreamerSettings";

interface MemorialEntry {
  id: string;
  name: string;
  causeOfDeath: string;
  whisper: string;
}

const TRUST_GATE = 40;

const FALLBACK_MEMORIALS: ReadonlyArray<MemorialEntry> = [
  {
    id: "mem_kael_aspirant",
    name: "Kael, the Aspirant",
    causeOfDeath: "Lost on the bridge during the first incursion.",
    whisper: "He laughed with the engineers. He was learning the trade.",
  },
  {
    id: "mem_iris_med",
    name: "Iris, Medical Officer",
    causeOfDeath: "Cardiac arrest in cryosleep — substrate failure.",
    whisper: "She kept the cryo lines clean for forty-three years.",
  },
  {
    id: "mem_unknown_potential",
    name: "Unknown Potential",
    causeOfDeath: "Capsule ID scrubbed. Cause undetermined.",
    whisper: "We do not know their name. We remember them anyway.",
  },
];

interface MaybeNpcDeathRecord {
  npcId?: string;
  name?: string;
  cause?: string;
  causeOfDeath?: string;
  epitaph?: string;
}

function readMemorials(state: unknown): ReadonlyArray<MemorialEntry> {
  // Read state.npcDeaths defensively — the field may not yet be
  // declared on the GameState type. We treat any unrecognized shape
  // as "not present" and fall back to the static placeholders.
  if (!state || typeof state !== "object") return FALLBACK_MEMORIALS;
  const candidate = (state as { npcDeaths?: unknown }).npcDeaths;
  if (!Array.isArray(candidate) || candidate.length === 0) {
    return FALLBACK_MEMORIALS;
  }
  return candidate.map((raw, i): MemorialEntry => {
    const r = raw as MaybeNpcDeathRecord;
    return {
      id: r.npcId ?? `mem_dynamic_${i}`,
      name: r.name ?? "Unnamed",
      causeOfDeath: r.cause ?? r.causeOfDeath ?? "Cause unrecorded.",
      whisper: r.epitaph ?? "Their name is held here.",
    };
  });
}

export default function MemorialCorridorPage() {
  const { state } = useGame();
  const elaraBond = state.elaraTrustLevel ?? 0;
  const humanBond = state.humanTrustLevel ?? 0;
  const maxBond = Math.max(elaraBond, humanBond);
  const unlocked = maxBond >= TRUST_GATE;
  // audit/16 PR 6 (Strm4) — streamer-configurable narrative pacing.
  // Divides the framer-motion durations + delays so 2.0× makes
  // animations twice as fast (better for short-form video) and 0.5×
  // makes them half-speed (better for VO conflict avoidance).
  const animSpeed = useNarrativeAnimSpeed().value;

  const memorials = readMemorials(state);
  const [remembered, setRemembered] = useState<ReadonlySet<string>>(new Set());

  const remember = useCallback((id: string) => {
    setRemembered((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  if (!unlocked) {
    return (
      <div className="min-h-screen w-full void-bg-canvas void-text p-8 sm:p-12 relative overflow-hidden">
        <MobileNarratorSlot roomId="memorial_corridor" />
        <div className="max-w-xl mx-auto pt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-muted">
            corridor · sealed
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl void-text mt-2">
            The Memorial Corridor
          </h1>
          <p className="font-serif text-[15px] leading-relaxed void-text-dim mt-6">
            The door is closed. The names beyond it are not yet yours
            to read. Walk longer with Elara, or with the Human, and
            the corridor will know you.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-muted mt-8">
            bond required: {TRUST_GATE} · current: {maxBond}
          </p>
          <Link
            href="/companions"
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-md void-border void-bg-elevated void-text-dim hover:void-text transition-colors text-sm font-mono"
          >
            return to the companion hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full void-bg-canvas void-text p-8 sm:p-12 relative overflow-hidden">
      <MobileNarratorSlot roomId="memorial_corridor" />
      <div className="max-w-2xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 / animSpeed }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-muted">
            ark · memorial corridor
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl void-text mt-2">
            Names We Carry
          </h1>
          <p className="font-serif text-sm italic void-text-dim mt-3">
            One thousand and forty-seven names sleep in this hall. A
            handful are touchable from here. The rest wait in the dark.
          </p>
        </motion.header>

        <ol className="space-y-10">
          {memorials.map((entry, i) => {
            const isRemembered = remembered.has(entry.id);
            return (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i * 0.12) / animSpeed, duration: 0.5 / animSpeed }}
                className="border-l void-border pl-5"
                data-remembered={isRemembered ? "true" : "false"}
                data-testid={`memorial-${entry.id}`}
              >
                <h2 className="font-serif text-xl void-text">{entry.name}</h2>
                <p className="font-serif text-[14px] leading-relaxed void-text-dim mt-2">
                  {entry.causeOfDeath}
                </p>
                <p className="font-serif text-sm italic void-text-muted mt-3">
                  {entry.whisper}
                </p>
                <button
                  type="button"
                  onClick={() => remember(entry.id)}
                  disabled={isRemembered}
                  className="mt-4 px-3 py-1.5 rounded-md void-border void-bg-elevated font-mono text-[11px] uppercase tracking-[0.2em] void-text-dim hover:void-text transition-colors disabled:opacity-60"
                  data-testid={`memorial-remember-${entry.id}`}
                >
                  {isRemembered ? "remembered" : "place a stone"}
                </button>
              </motion.li>
            );
          })}
        </ol>

        <p className="font-mono text-[9px] uppercase tracking-[0.3em] void-text-muted mt-16 text-center">
          ({remembered.size} of {memorials.length} touched today)
        </p>
      </div>
    </div>
  );
}
