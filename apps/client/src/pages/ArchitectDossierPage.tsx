/* ═══════════════════════════════════════════════════════
   ARCHITECT DOSSIER PAGE — Candidate Briefing surface
   (A3 in /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md)

   Read-only player-facing page that surfaces what the Architect
   has logged about the player. Voice is coded-bureaucratic — this
   is meant to read like an internal observation file, not a
   friendly stats card. It complements the silent Dreamer-side
   recruitment by making the OVERT side concrete: "you have been
   observed; here is what the observer believes about you."

   Backed by `architectDossier.getMyDossier` (tRPC). Empty-state
   path — "AWAITING_FIRST_OBSERVATION" — renders a single line so
   the page works for brand-new players too.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";

type DossierAxis = {
  axis: string;
  label: string;
  value: number;
  calibration: string;
};

function formatTimestamp(iso: string | null): string {
  if (!iso) return "NEVER";
  const d = new Date(iso);
  return d.toISOString().replace("T", " ").slice(0, 16) + "Z";
}

/** Calibration → small visual cue. Pure presentation; nothing
 *  player-actionable. */
function calibrationGlyph(cal: string): string {
  switch (cal) {
    case "DEEP_NEGATIVE":
      return "▼▼";
    case "BELOW_BASELINE":
      return "▼";
    case "BASELINE":
      return "·";
    case "ABOVE_BASELINE":
      return "▲";
    case "DEEP_POSITIVE":
      return "▲▲";
    default:
      return "?";
  }
}

export default function ArchitectDossierPage() {
  const { data, isLoading, error } =
    trpc.architectDossier.getMyDossier.useQuery();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground px-4 py-8">
      <div className="mx-auto max-w-3xl font-mono">
        {/* Header — coded bureaucratic surveillance log */}
        <header className="mb-6 border-b border-border/40 pb-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Architect Console · Recruitment Branch · Internal
          </p>
          <h1 className="mt-1 text-2xl font-semibold">
            CANDIDATE DOSSIER
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            This file is auto-generated from observation streams.
            Distribution restricted to Calibration Tier ≥ 2.
          </p>
        </header>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            …retrieving observation log…
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            Observation channel unavailable. Try again.
          </p>
        )}

        {data && (
          <DossierBody
            candidateStatus={data.candidateStatus}
            observedEvents={data.observedEvents}
            lastObservedAt={data.lastObservedAt}
            axes={data.axes}
          />
        )}

        <footer className="mt-10 border-t border-border/40 pt-3 text-xs text-muted-foreground">
          <p>
            Calibration codes are internal. The candidate's standing is
            re-evaluated after every recorded observation.
          </p>
        </footer>
      </div>
    </div>
  );
}

interface DossierBodyProps {
  candidateStatus: string;
  observedEvents: number;
  lastObservedAt: string | null;
  axes: readonly DossierAxis[];
}

function DossierBody({
  candidateStatus,
  observedEvents,
  lastObservedAt,
  axes,
}: DossierBodyProps) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <KeyValue label="STATUS" value={candidateStatus} />
        <KeyValue
          label="OBSERVATIONS"
          value={observedEvents.toString().padStart(4, "0")}
        />
        <KeyValue label="LAST CONTACT" value={formatTimestamp(lastObservedAt)} />
      </section>

      <section>
        <h2 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          Calibration vectors
        </h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border/40 text-left">
              <th className="py-2 font-medium text-xs uppercase text-muted-foreground">
                Vector
              </th>
              <th className="py-2 font-medium text-xs uppercase text-muted-foreground text-right">
                Value
              </th>
              <th className="py-2 font-medium text-xs uppercase text-muted-foreground">
                Reading
              </th>
            </tr>
          </thead>
          <tbody>
            {axes.map((row) => (
              <tr
                key={row.axis}
                className="border-b border-border/20 last:border-b-0"
              >
                <td className="py-2 align-top">{row.label}</td>
                <td className="py-2 align-top text-right tabular-nums">
                  {row.value > 0 ? `+${row.value}` : row.value}
                </td>
                <td className="py-2 align-top">
                  <span className="mr-2" aria-hidden>
                    {calibrationGlyph(row.calibration)}
                  </span>
                  {row.calibration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {observedEvents === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No observations on file. The candidate has not yet acted in a way
          the Architect's instruments register.
        </p>
      )}
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border/30 px-3 py-2">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-medium tabular-nums">{value}</p>
    </div>
  );
}
