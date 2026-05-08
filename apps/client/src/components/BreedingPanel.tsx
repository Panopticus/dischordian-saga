/* ═══════════════════════════════════════════════════════
   BREEDING PANEL — pair-→-offspring queue surface

   Mounts on PetGardenPage to let the player pick two parents,
   queue a breeding pair, and resolve the offspring. The router
   side lives at `apps/server/routers/petBreeding.ts`; the
   offspring algorithm at `apps/shared/petBreeding.ts`.

   MVP scope: dropdown pair selector + active-pair list + per-row
   complete/cancel actions. Real-world incubation timers, art-prompt
   imagery, and rarity-tier rewards are deferred.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PetOption {
  id: number;
  label: string;
}

const FALLBACK_PETS: ReadonlyArray<PetOption> = [
  { id: 1, label: "Finch · Cryo-finch" },
  { id: 2, label: "Moss · Garden cat" },
  { id: 3, label: "Signal · Repair drone" },
];

function readPetOptions(state: unknown): ReadonlyArray<PetOption> {
  if (!state || typeof state !== "object") return FALLBACK_PETS;
  const pets = (state as { pets?: unknown }).pets;
  if (!Array.isArray(pets) || pets.length === 0) return FALLBACK_PETS;
  const out: PetOption[] = [];
  for (let i = 0; i < pets.length; i += 1) {
    const r = pets[i] as { id?: unknown; name?: string; species?: string };
    const id = typeof r.id === "number" ? r.id : Number(r.id);
    if (!Number.isFinite(id)) continue;
    out.push({
      id,
      label: `${r.name ?? "Unnamed"} · ${r.species ?? "Companion"}`,
    });
  }
  return out.length > 0 ? out : FALLBACK_PETS;
}

interface BreedingPanelProps {
  /** Optional game state for reading the player's pet roster. */
  state?: unknown;
}

export function BreedingPanel({ state }: BreedingPanelProps) {
  const pets = useMemo(() => readPetOptions(state), [state]);
  const [parentAId, setParentAId] = useState<number | "">(pets[0]?.id ?? "");
  const [parentBId, setParentBId] = useState<number | "">(pets[1]?.id ?? "");

  const list = trpc.petBreeding.list.useQuery();
  const start = trpc.petBreeding.start.useMutation({
    onSuccess: () => {
      toast.success("Breeding pair queued.");
      list.refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const complete = trpc.petBreeding.complete.useMutation({
    onSuccess: () => {
      toast.success("Offspring resolved.");
      list.refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const cancel = trpc.petBreeding.cancel.useMutation({
    onSuccess: () => {
      toast.success("Breeding pair cancelled.");
      list.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const canStart =
    parentAId !== "" &&
    parentBId !== "" &&
    parentAId !== parentBId &&
    !start.isPending;

  return (
    <section className="rounded-lg p-6 void-border void-bg-sunk" data-testid="breeding-panel">
      <header className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-muted">
          ark · pet garden · breeding
        </p>
        <h2 className="font-serif text-xl void-text mt-2">
          Pair the small things
        </h2>
        <p className="font-serif text-sm italic void-text-dim mt-1">
          Two parents, one offspring. Stats average; element drifts.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] void-text-muted block mb-1">
            parent a
          </span>
          <select
            value={parentAId}
            onChange={(e) => setParentAId(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full rounded-md void-border void-bg-elevated void-text font-mono text-xs px-3 py-2"
            data-testid="breeding-parent-a"
          >
            {pets.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] void-text-muted block mb-1">
            parent b
          </span>
          <select
            value={parentBId}
            onChange={(e) => setParentBId(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full rounded-md void-border void-bg-elevated void-text font-mono text-xs px-3 py-2"
            data-testid="breeding-parent-b"
          >
            {pets.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        disabled={!canStart}
        onClick={() => {
          if (parentAId === "" || parentBId === "") return;
          start.mutate({ parentAId, parentBId });
        }}
        className="px-4 py-2 rounded-md void-border void-bg-elevated font-mono text-[11px] uppercase tracking-[0.2em] void-text disabled:void-text-muted hover:void-bg-surface transition-colors"
        data-testid="breeding-start"
      >
        {start.isPending ? "queueing…" : "start breeding"}
      </button>

      <div className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-muted mb-2">
          active pairs
        </p>
        {list.isLoading && (
          <p className="font-mono text-[11px] void-text-dim">loading…</p>
        )}
        {list.data && list.data.length === 0 && (
          <p className="font-mono text-[11px] void-text-dim">no active pairs.</p>
        )}
        <ul className="space-y-2">
          {(list.data ?? []).map((pair) => (
            <li
              key={pair.id}
              data-status={pair.status}
              className="flex items-center justify-between rounded-md p-3 void-border void-bg-elevated"
            >
              <div>
                <p className="font-mono text-[11px] void-text">
                  pair #{pair.id} · {pair.parentAId} × {pair.parentBId}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] void-text-muted mt-1">
                  {pair.status}
                </p>
              </div>
              <div className="flex gap-2">
                {pair.status === "incubating" && (
                  <button
                    type="button"
                    disabled={complete.isPending}
                    onClick={() => complete.mutate({ id: pair.id })}
                    className="px-3 py-1 rounded-md void-border void-bg-elevated font-mono text-[10px] uppercase tracking-[0.2em] void-text hover:void-bg-surface"
                    data-testid={`breeding-complete-${pair.id}`}
                  >
                    complete
                  </button>
                )}
                {(pair.status === "queued" || pair.status === "incubating") && (
                  <button
                    type="button"
                    disabled={cancel.isPending}
                    onClick={() => cancel.mutate({ id: pair.id })}
                    className="px-3 py-1 rounded-md void-border void-bg-elevated font-mono text-[10px] uppercase tracking-[0.2em] void-text-dim hover:void-text"
                    data-testid={`breeding-cancel-${pair.id}`}
                  >
                    cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BreedingPanel;
