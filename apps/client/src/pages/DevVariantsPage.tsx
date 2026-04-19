/* ═══════════════════════════════════════════════════════
   VARIANT PLAYTEST PAGE — dev-only QA surface

   Lets testers flip the four gates the resolver reads
   (morality, trust, act, flags) and preview which variant
   resolves for every (surface, targetId) in the registry.

   Route is /dev/variants. Not linked from main nav — URL
   access only. No persistence; the controls live entirely
   in local component state.

   Controls:
     - narrativeAct: integer 0-7
     - moralityScore: -100..+100 (shows derived band)
     - per-companion trust: 0..100 for every trustCompanionId
       referenced by any variant (shows derived band)
     - flag list: every requiredFlag + every unlockFlag used
       by variants appears as a toggle
     - surface filter: choose one surface, or "all"
     - target filter: substring match on targetId

   Preview pane shows:
     - target id
     - surface
     - resolved variant (or "(default — no variant matched)")
     - gate specificity score for the winner
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import {
  VARIANT_REGISTRY,
  bandForMorality,
  bandForTrust,
  resolveVariant,
  type MoralityTrustActVariant,
} from "@shared/moralityTrustActVariants";

type SurfaceFilter = MoralityTrustActVariant["surface"] | "all";

/** Collect every unique (surface, targetId) pair in the registry. */
function collectTargets(): Array<{
  surface: MoralityTrustActVariant["surface"];
  targetId: string | undefined;
}> {
  const seen = new Set<string>();
  const out: Array<{
    surface: MoralityTrustActVariant["surface"];
    targetId: string | undefined;
  }> = [];
  for (const v of VARIANT_REGISTRY) {
    const key = `${v.surface}::${v.targetId ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ surface: v.surface, targetId: v.targetId });
  }
  return out.sort((a, b) =>
    (a.surface + (a.targetId ?? "")).localeCompare(b.surface + (b.targetId ?? "")),
  );
}

function collectCompanionIds(): string[] {
  const s = new Set<string>();
  for (const v of VARIANT_REGISTRY) {
    if (v.trustCompanionId) s.add(v.trustCompanionId);
  }
  return [...s].sort();
}

function collectFlags(): string[] {
  const s = new Set<string>();
  for (const v of VARIANT_REGISTRY) {
    if (!v.requiredFlags) continue;
    for (const f of v.requiredFlags) s.add(f);
  }
  return [...s].sort();
}

const ALL_TARGETS = collectTargets();
const ALL_COMPANIONS = collectCompanionIds();
const ALL_FLAGS = collectFlags();

/** Same specificity scoring the resolver uses — duplicated here so the
 *  dev panel can display it without exporting an internal helper. */
function specificityScore(v: MoralityTrustActVariant): number {
  let s = 0;
  if (v.morality !== "any") s += 3;
  if (v.trust !== "any") s += 3;
  if (v.act !== "any") s += 2;
  if (v.requiredFlags && v.requiredFlags.length) s += v.requiredFlags.length;
  return s;
}

export default function DevVariantsPage() {
  const [narrativeAct, setNarrativeAct] = useState(1);
  const [moralityScore, setMoralityScore] = useState(0);
  const [trust, setTrust] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const c of ALL_COMPANIONS) init[c] = 50;
    return init;
  });
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set());
  const [surfaceFilter, setSurfaceFilter] = useState<SurfaceFilter>("all");
  const [targetFilter, setTargetFilter] = useState("");

  const input = useMemo(
    () => ({
      moralityScore,
      narrativeAct,
      trustByCompanion: trust,
      flags: activeFlags,
    }),
    [moralityScore, narrativeAct, trust, activeFlags],
  );

  const rows = useMemo(() => {
    return ALL_TARGETS.filter((t) => {
      if (surfaceFilter !== "all" && t.surface !== surfaceFilter) return false;
      if (
        targetFilter.trim() &&
        !(t.targetId ?? "").toLowerCase().includes(targetFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).map((t) => {
      const resolved = resolveVariant(
        VARIANT_REGISTRY,
        t.surface,
        t.targetId,
        input,
      );
      return {
        surface: t.surface,
        targetId: t.targetId,
        resolved,
      };
    });
  }, [input, surfaceFilter, targetFilter]);

  const toggleFlag = (flag: string) => {
    setActiveFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  };

  const moralityBand = bandForMorality(moralityScore);

  return (
    <div className="min-h-screen bg-stone-950 p-4 font-mono text-stone-100">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="border-b border-stone-700 pb-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
            /dev/variants — QA harness
          </p>
          <h1 className="mt-1 font-serif text-xl italic text-stone-100">
            Morality / Trust / Act Variant Inspector
          </h1>
          <p className="mt-1 text-[11px] text-stone-400">
            {VARIANT_REGISTRY.length} entries · {ALL_TARGETS.length} targets ·
            {" "}
            {ALL_COMPANIONS.length} companions · {ALL_FLAGS.length} flags
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <section className="rounded border border-stone-700 bg-stone-900/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-stone-400">
              Act
            </p>
            <input
              type="range"
              min={0}
              max={7}
              value={narrativeAct}
              onChange={(e) => setNarrativeAct(Number(e.target.value))}
              className="mt-1 w-full"
            />
            <p className="text-[12px]">narrativeAct = {narrativeAct}</p>
          </section>

          <section className="rounded border border-stone-700 bg-stone-900/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-stone-400">
              Morality
            </p>
            <input
              type="range"
              min={-100}
              max={100}
              value={moralityScore}
              onChange={(e) => setMoralityScore(Number(e.target.value))}
              className="mt-1 w-full"
            />
            <p className="text-[12px]">
              score = {moralityScore} · band ={" "}
              <span
                className={
                  moralityBand === "humanity"
                    ? "text-emerald-300"
                    : moralityBand === "machine"
                      ? "text-rose-300"
                      : "text-stone-300"
                }
              >
                {moralityBand}
              </span>
            </p>
          </section>

          <section className="rounded border border-stone-700 bg-stone-900/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-stone-400">
              Filters
            </p>
            <select
              value={surfaceFilter}
              onChange={(e) =>
                setSurfaceFilter(e.target.value as SurfaceFilter)
              }
              className="mt-2 w-full rounded bg-stone-800 px-2 py-1 text-[12px]"
            >
              <option value="all">all surfaces</option>
              <option value="room">room</option>
              <option value="transmission">transmission</option>
              <option value="npc_line">npc_line</option>
              <option value="journal">journal</option>
              <option value="wheel_followup">wheel_followup</option>
            </select>
            <input
              type="text"
              placeholder="targetId contains…"
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              className="mt-2 w-full rounded bg-stone-800 px-2 py-1 text-[12px]"
            />
          </section>
        </div>

        <section className="rounded border border-stone-700 bg-stone-900/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-stone-400">
            Trust per companion
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {ALL_COMPANIONS.map((c) => (
              <div
                key={c}
                className="flex items-center justify-between gap-2 rounded bg-stone-800/60 px-2 py-1"
              >
                <span className="text-[11px] text-stone-200">{c}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={trust[c] ?? 0}
                  onChange={(e) =>
                    setTrust((prev) => ({
                      ...prev,
                      [c]: Number(e.target.value),
                    }))
                  }
                  className="flex-1"
                />
                <span className="w-24 text-right text-[10px] text-stone-400">
                  {trust[c] ?? 0} · {bandForTrust(trust[c] ?? 0)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded border border-stone-700 bg-stone-900/40 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-stone-400">
              Narrative flags ({activeFlags.size}/{ALL_FLAGS.length} active)
            </p>
            <button
              type="button"
              className="rounded border border-stone-600 bg-stone-800 px-2 py-0.5 text-[10px] uppercase tracking-wider text-stone-300 hover:bg-stone-700"
              onClick={() => setActiveFlags(new Set())}
            >
              Clear all
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {ALL_FLAGS.map((flag) => {
              const on = activeFlags.has(flag);
              return (
                <button
                  key={flag}
                  type="button"
                  onClick={() => toggleFlag(flag)}
                  className={`rounded border px-2 py-0.5 text-[10px] transition-colors ${
                    on
                      ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-200"
                      : "border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-500"
                  }`}
                >
                  {flag}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded border border-stone-700 bg-stone-900/40">
          <p className="border-b border-stone-700 px-3 py-2 text-[10px] uppercase tracking-wider text-stone-400">
            Resolved variants · {rows.length} targets shown
          </p>
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-stone-800">
            {rows.map((r) => (
              <div
                key={`${r.surface}::${r.targetId}`}
                className="px-3 py-2 text-[12px]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500">
                      {r.surface}
                    </span>
                    <span className="font-serif text-stone-200">
                      {r.targetId ?? "(no target)"}
                    </span>
                  </div>
                  {r.resolved && (
                    <span className="text-[10px] text-stone-500">
                      id: {r.resolved.id} · spec: {specificityScore(r.resolved)}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-serif italic leading-relaxed text-stone-100">
                  {r.resolved
                    ? r.resolved.text
                    : "(default — no variant matched)"}
                </p>
              </div>
            ))}
            {rows.length === 0 && (
              <p className="px-3 py-4 text-stone-500">
                No targets match the current filters.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
