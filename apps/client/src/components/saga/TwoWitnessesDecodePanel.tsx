/* ═══════════════════════════════════════════════════════
   TWO WITNESSES DECODE PANEL

   Item 10 UI: list of fragments with their cipher hints; for
   each undecoded fragment, an inline form takes the player's
   key submission and reports decode success/failure.

   Static-key fragments (1, 2) get an autocomplete hint via
   the `staticHints` query. Dynamic-key fragments (3, 4, 5)
   require the player to read other game-state panels and
   submit the matching value themselves.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";

import { trpc } from "@/lib/trpc";

interface FragmentRow {
  id: string;
  title: string;
  cipherHint: string;
  body: string | null;
  decoded: boolean;
  earliestAct: number;
}

export function TwoWitnessesDecodePanel() {
  const list = trpc.twoWitnessesDecode.list.useQuery(undefined, {
    staleTime: 30_000,
  });
  const hints = trpc.twoWitnessesDecode.staticHints.useQuery(undefined, {
    staleTime: 30_000,
  });
  const submit = trpc.twoWitnessesDecode.submitKey.useMutation();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string | null>>({});

  const onSubmit = useCallback(
    async (fragmentId: string) => {
      const submittedKey = inputs[fragmentId] ?? "";
      if (submittedKey.length === 0) return;
      const result = await submit.mutateAsync({
        fragmentId: fragmentId as never,
        submittedKey,
      });
      setFeedback((f) => ({
        ...f,
        [fragmentId]: result.ok
          ? "Decoded."
          : result.reason === "wrong_key"
            ? "Key rejected. Try again."
            : `Refused: ${result.reason}`,
      }));
      void list.refetch();
    },
    [submit, list, inputs],
  );

  if (list.isLoading) {
    return (
      <div className="rounded-md border border-violet-700/40 bg-violet-950/30 p-4 text-sm text-violet-300/70">
        Loading the fragments…
      </div>
    );
  }

  const rows = (list.data ?? []) as FragmentRow[];
  const decodedCount = rows.filter((r) => r.decoded).length;

  return (
    <div className="rounded-md border border-violet-700/40 bg-violet-950/30 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-wide text-violet-200">
          Two Witnesses — Decode the Music
        </h2>
        <span className="text-xs uppercase tracking-wider text-violet-400/70">
          {decodedCount} / {rows.length} fragments decoded
        </span>
      </div>

      <p className="mb-4 text-xs italic text-violet-300/70">
        The Programmer's encoded broadcast survives in five fragments. Each
        cipher key derives from real game state — the cycle phase, the day
        count, the Antiquarian's most recent inscription, and so on. Read
        carefully.
      </p>

      {hints.data ? (
        <div className="mb-4 rounded border border-violet-800/40 bg-black/30 p-2 text-xs text-violet-300/80">
          <div>Current cycle phase: <span className="font-mono">{hints.data.cyclePhase}</span></div>
          <div>Current day mod 7: <span className="font-mono">{hints.data.dayCountMod7}</span></div>
        </div>
      ) : null}

      <ul className="flex flex-col gap-3">
        {rows.map((fragment) => (
          <li
            key={fragment.id}
            className={`rounded border p-3 ${
              fragment.decoded
                ? "border-violet-600/60 bg-violet-900/40"
                : "border-violet-800/40 bg-black/30"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h3
                className={`text-sm font-semibold ${
                  fragment.decoded ? "text-violet-100" : "text-violet-300"
                }`}
              >
                {fragment.title}
              </h3>
              <span className="text-[10px] uppercase tracking-wider">
                {fragment.decoded ? (
                  <span className="text-emerald-400">Decoded</span>
                ) : (
                  <span className="text-violet-500">Locked</span>
                )}
              </span>
            </div>
            <p className="mt-1 text-xs italic text-violet-300/70">
              {fragment.cipherHint}
            </p>
            {fragment.decoded && fragment.body ? (
              <p className="mt-3 whitespace-pre-wrap font-serif text-sm leading-relaxed text-violet-50/95">
                {fragment.body}
              </p>
            ) : (
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void onSubmit(fragment.id);
                }}
              >
                <input
                  type="text"
                  className="flex-1 rounded border border-violet-700/60 bg-violet-950/50 px-2 py-1 text-sm text-violet-100 placeholder:text-violet-500"
                  placeholder="Submit key…"
                  value={inputs[fragment.id] ?? ""}
                  onChange={(e) =>
                    setInputs((s) => ({ ...s, [fragment.id]: e.target.value }))
                  }
                />
                <button
                  type="submit"
                  className="rounded border border-violet-600/60 bg-violet-900/40 px-3 py-1 text-xs text-violet-100 transition hover:bg-violet-900/70"
                >
                  Submit
                </button>
              </form>
            )}
            {feedback[fragment.id] ? (
              <div
                className={`mt-2 text-[10px] uppercase tracking-wider ${
                  feedback[fragment.id]?.toLowerCase().includes("decoded")
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {feedback[fragment.id]}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
