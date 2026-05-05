/* ═══════════════════════════════════════════════════════
   CONEXUS TOME LIBRARY

   Item 8 of the choice-impact follow-up. Renders all seven
   CoNexus Tomes — discovered ones reveal their flash-fiction
   body, undiscovered ones show only their redacted teaser
   and an "awaiting discovery" status.

   Each Tome opens to a modal reader on click. The reader
   renders the body in serif type with generous leading; the
   teaser line stays as a subtitle.
   ═══════════════════════════════════════════════════════ */

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { trpc } from "@/lib/trpc";

interface TomeListEntry {
  id: string;
  title: string;
  redactedTeaser: string;
  body: string | null;
  discovered: boolean;
  earliestAct: number;
  requiresFlag: string | null;
}

export function CoNexusTomeLibrary() {
  const list = trpc.coNexusTomes.list.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const [activeTomeId, setActiveTomeId] = useState<string | null>(null);

  if (list.isLoading) {
    return (
      <div className="rounded-md border border-violet-700/40 bg-violet-950/30 p-4 text-sm text-violet-300/70">
        Loading the CoNexus Library…
      </div>
    );
  }

  const tomes = (list.data ?? []) as TomeListEntry[];
  const discoveredCount = tomes.filter((t) => t.discovered).length;
  const activeTome = tomes.find((t) => t.id === activeTomeId) ?? null;

  return (
    <>
      <div className="rounded-md border border-violet-700/40 bg-violet-950/30 p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold tracking-wide text-violet-200">
            The CoNexus Library
          </h2>
          <span className="text-xs uppercase tracking-wider text-violet-400/70">
            {discoveredCount} / {tomes.length} discovered
          </span>
        </div>

        <p className="mb-4 text-xs italic text-violet-300/70">
          Forty-one parallel realities the Inception Ark could have carried.
          Seven catalogued here. Each is, by Ark canon, equally real to ours.
        </p>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {tomes.map((tome) => (
            <li key={tome.id}>
              <button
                type="button"
                className={`w-full rounded-md border p-3 text-left transition ${
                  tome.discovered
                    ? "border-violet-600/60 bg-violet-900/40 hover:bg-violet-900/60"
                    : "border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:bg-zinc-900/40"
                }`}
                onClick={() => setActiveTomeId(tome.id)}
              >
                <div
                  className={`text-sm font-semibold ${
                    tome.discovered ? "text-violet-100" : "text-zinc-400"
                  }`}
                >
                  {tome.discovered ? tome.title : "[ Redacted ]"}
                </div>
                <div
                  className={`mt-1 text-xs italic ${
                    tome.discovered ? "text-violet-300/70" : "text-zinc-500"
                  }`}
                >
                  {tome.redactedTeaser}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider">
                  {tome.discovered ? (
                    <span className="text-emerald-400">Inscribed</span>
                  ) : (
                    <span className="text-zinc-600">
                      Awaits discovery · Act {tome.earliestAct}+
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {activeTome ? (
          <TomeReaderModal
            tome={activeTome}
            onClose={() => setActiveTomeId(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function TomeReaderModal({
  tome,
  onClose,
}: {
  tome: TomeListEntry;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-violet-700/60 bg-violet-950/90 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-violet-100">
              {tome.discovered ? tome.title : "Awaiting discovery"}
            </h3>
            <div className="mt-1 text-sm italic text-violet-300/80">
              {tome.redactedTeaser}
            </div>
          </div>
          <button
            type="button"
            className="text-sm text-violet-400 hover:text-violet-200"
            onClick={onClose}
            aria-label="Close Tome"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 border-t border-violet-800/40 pt-4">
          {tome.discovered && tome.body ? (
            <div className="whitespace-pre-wrap font-serif text-base leading-relaxed text-violet-50/90">
              {tome.body}
            </div>
          ) : (
            <div className="text-sm italic text-violet-300/70">
              The pages are blank to your reading. The Antiquarian has indexed
              this Tome but you have not yet stood in the room that surfaces
              it. Earliest available: Act {tome.earliestAct}.
              {tome.requiresFlag ? (
                <span className="mt-2 block text-xs text-violet-400/60">
                  Awaiting flag: <span className="font-mono">{tome.requiresFlag}</span>
                </span>
              ) : null}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
