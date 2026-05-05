/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN'S TOME PANEL

   Item 5 of the choice-impact follow-up. The vote consequence
   applier and the post-run inscription service both write rows
   to vote_antiquarian_entries — but the player had no way to
   read them. This panel renders every Tome entry, with the
   private annotation gating on Antiquarian companion trust ≥ 60
   (handled server-side by getTomeEntries).

   Sorted by inscribedAt descending so the latest beat is at
   the top. Body and annotation are rendered in distinct
   registers; annotations are amber-italic and only appear when
   the server returns them (i.e. after trust 60+).
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";

interface TomeEntry {
  voteId: string;
  winningOptionNumber: number;
  body: string;
  annotation: string | null;
  inscribedAt: Date | string;
}

export function AntiquariansTomePanel() {
  const tome = trpc.architectConsole.getTomeEntries.useQuery(
    { limit: 50 },
    {
      staleTime: 60_000,
      refetchOnWindowFocus: true,
    },
  );

  if (tome.isLoading) {
    return (
      <div className="rounded-md border border-amber-700/40 bg-amber-950/30 p-4 text-sm text-amber-300/70">
        Loading the Antiquarian's record…
      </div>
    );
  }

  const entries = (tome.data ?? []) as TomeEntry[];

  if (entries.length === 0) {
    return (
      <div className="rounded-md border border-amber-700/40 bg-amber-950/30 p-4">
        <h2 className="mb-2 text-base font-semibold text-amber-200">
          The Antiquarian's Tome
        </h2>
        <p className="text-sm italic text-amber-300/70">
          The pages are blank. Govern, vote, complete an arc — and the
          Antiquarian will inscribe what you do.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-amber-700/40 bg-amber-950/30 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-wide text-amber-200">
          The Antiquarian's Tome
        </h2>
        <span className="text-xs uppercase tracking-wider text-amber-400/60">
          {entries.length} inscription{entries.length === 1 ? "" : "s"}
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {entries.map((entry) => (
          <li
            key={entry.voteId}
            className="rounded border border-amber-800/40 bg-black/20 p-3"
          >
            <div className="mb-1.5 text-xs uppercase tracking-wider text-amber-400/70">
              {formatVoteId(entry.voteId)} ·{" "}
              {formatDate(entry.inscribedAt)}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-amber-50/95">
              {entry.body}
            </p>
            {entry.annotation ? (
              <p className="mt-3 whitespace-pre-wrap border-l-2 border-amber-600/50 pl-3 text-sm italic leading-relaxed text-amber-300/85">
                <span className="mr-1 text-xs uppercase tracking-wider text-amber-500/70">
                  Annotation
                </span>
                <br />
                {entry.annotation}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs italic text-amber-400/60">
        Annotations surface once Antiquarian trust ≥ 60.
      </p>
    </div>
  );
}

function formatVoteId(id: string): string {
  // Recognise the canonical id-shape vocabulary so the entry
  // header reads as English, not as a debug string. Falls
  // through to the raw id for cases not yet in the lookup.
  if (id.startsWith("post_run:")) {
    const parts = id.split(":");
    return `Post-run inscription · cycle ${parts[2] ?? "?"}`;
  }
  if (id.startsWith("dischordia:")) {
    const parts = id.split(":");
    return `Dischordia inscription · cycle ${parts[2] ?? "?"}`;
  }
  if (id.startsWith("annual-")) return id.replace(/^annual-/, "Annual: ").replace(/-/g, " ");
  if (id.startsWith("engineer_vote_")) {
    return id.replace(/^engineer_vote_/, "Engineer vote: ").replace(/_/g, " ");
  }
  return id.replace(/_/g, " ");
}

function formatDate(at: Date | string): string {
  try {
    const d = typeof at === "string" ? new Date(at) : at;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
