/* ═══════════════════════════════════════════════════════
   DREAMER DOSSIER PAGE — cryptic vision-summary surface
   (C4 in /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md)

   Player-facing read-only counterpart to ArchitectDossierPage.
   Same underlying psychological-axis profile data, read back in
   the Dreamer's lyric-fragment register. Gated server-side on
   Vision 3 receipt; pre-unlock visits render the same 404 shape
   as `/dreamer` and `/loredex/dreamer-fragments`.

   Backed by `dreamerDossier.getMyDossier` (tRPC). The shape's
   `available: false` sentinel is the single branch the client
   needs to handle.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { motion } from "framer-motion";

type DreamerAxis = {
  axis: string;
  label: string;
  value: number;
  reading: string;
};

function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "(no observation yet)";
  const d = new Date(iso);
  return d.toISOString().replace("T", " ").slice(0, 16) + "Z";
}

/** Reading → glyph. Pure presentation. */
function readingGlyph(reading: string): string {
  switch (reading) {
    case "absent":
      return "·";
    case "quiet":
      return "—";
    case "uncertain":
      return "?";
    case "open":
      return "○";
    case "unmistakable":
      return "●";
    default:
      return "·";
  }
}

export default function DreamerDossierPage() {
  const { data, isLoading } = trpc.dreamerDossier.getMyDossier.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-black text-white/60 flex items-center justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em]">
          listening …
        </p>
      </div>
    );
  }

  // Section gated off — render the same 404 shell as /dreamer and
  // /loredex/dreamer-fragments. Direct URL visits before unlock all
  // share the same texture.
  if (!data || !data.available) {
    return (
      <div className="min-h-screen w-full bg-black text-white/80 flex items-center justify-center p-8">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-4xl font-bold mb-2 text-white/90">404</h1>
          <h2 className="text-xl font-semibold mb-8 text-white/60">
            Page Not Found
          </h2>
          <p className="font-serif text-sm italic text-white/40 mb-12">
            the page you are looking for does not yet exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors text-white/70 hover:text-white text-sm"
          >
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white/85 p-8 sm:p-12">
      <div className="max-w-2xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            loredex · dreamer dossier
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white/90 mt-2">
            What the Dreamer reads
          </h1>
          {data.summary && (
            <p className="font-serif text-base italic text-white/55 mt-4">
              {data.summary}
            </p>
          )}
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mt-3">
            observed events: {data.observedEvents ?? 0} · last:{" "}
            {formatTimestamp(data.lastObservedAt)}
          </p>
        </motion.header>

        <ul className="space-y-3">
          {(data.axes ?? []).map((axis: DreamerAxis, i: number) => (
            <motion.li
              key={axis.axis}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex items-baseline gap-3 border-b border-white/5 pb-2"
            >
              <span className="font-mono text-base text-white/40 w-6 text-center">
                {readingGlyph(axis.reading)}
              </span>
              <span className="font-serif text-base text-white/85 flex-1">
                {axis.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                {axis.reading}
              </span>
            </motion.li>
          ))}
        </ul>

        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mt-16 text-center">
          (no signature)
        </p>
      </div>
    </div>
  );
}
