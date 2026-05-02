/**
 * DreamerFragmentsPage — Loredex retroactive-reveal section per the
 * recruitment plan §Part 1.5 §"What's required to ship the four
 * vision scripts" #6.
 *
 * Renders the unlocked Dreamer Fragments for the current player,
 * gated server-side: the section is hidden entirely until Vision 3
 * has been received, at which point Fragments I-III back-fill
 * retroactively. Fragment IV unlocks when Vision 4 is received.
 *
 * Visual register intentionally distinct from the structured-grid
 * `loredex-data.json` UI: serif body, no chrome, hand-set caption-
 * register typography. The Dreamer side does not file; it leaves
 * pages.
 */
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function DreamerFragmentsPage() {
  const { data, isLoading } = trpc.dreamerFragments.getMyFragments.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-black text-white/60 flex items-center justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em]">
          listening …
        </p>
      </div>
    );
  }

  // Section gated off — render the same 404-shape as `/dreamer` so a
  // direct URL visit before unlock reads as "this page does not yet
  // exist" rather than "this page is empty."
  if (!data || !data.sectionVisible) {
    return (
      <div className="min-h-screen w-full bg-black text-white/80 flex items-center justify-center p-8">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-4xl font-bold mb-2 text-white/90">404</h1>
          <h2 className="text-xl font-semibold mb-8 text-white/60">
            Page Not Found
          </h2>
          <p className="font-serif text-sm italic text-white/40 mb-12">
            the section you are looking for does not yet exist.
          </p>
          <Link
            href="/loredex"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors text-white/70 hover:text-white text-sm"
          >
            <span>Loredex</span>
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
            loredex · dreamer fragments
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white/90 mt-2">
            Dreamer Fragments
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mt-3">
            {data.fragments.length} of {data.catalogTotal} unlocked
          </p>
        </motion.header>

        <div className="space-y-12">
          {data.fragments.map((fragment, i) => (
            <motion.article
              key={fragment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <h2 className="font-serif text-xl text-white/85 mb-3">
                {fragment.title}
              </h2>
              <p className="font-serif text-[15px] leading-relaxed text-white/65">
                {fragment.body}
              </p>
              {fragment.closingLine && (
                <p className="font-serif text-sm italic text-white/40 mt-4">
                  {fragment.closingLine}
                </p>
              )}
            </motion.article>
          ))}
        </div>

        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mt-16 text-center">
          (no signature)
        </p>
      </div>
    </div>
  );
}
