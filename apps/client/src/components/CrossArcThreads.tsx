/* ═══════════════════════════════════════════════════════
   CROSS-ARC THREADS — author-curated map of arc-to-arc
   intersections

   Surfaces the cross-arc threads woven through the authored
   mystery arcs. Each thread is a row showing source arc → target
   arc, the choice or suspect-graph node that creates the
   intersection, and a one-sentence summary of the connection.

   The threads are static authoring data — every thread lives in
   apps/shared/episodeMysteries.ts as either a choice weight (e.g.
   `cross_arc_wraith`) or a suspect graph node (e.g. the Iron Lion
   imprint cross-reference in the Game Master arc). This component
   lifts them into a player-readable surface so the saga's weave
   is visible without requiring the player to read the source.

   See docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §14 (cross-arc
   weave) and §7.x (per-arc cross-link callouts).
   ═══════════════════════════════════════════════════════ */

import { Link2 } from "lucide-react";

interface CrossArcThread {
  /** Stable id for React keys + future per-thread state. */
  id: string;
  /** Arc that authors the thread. */
  source: string;
  /** Arc the thread connects to. */
  target: string;
  /** Whether the thread is created by a choice the player makes
   *  (a `cross_arc_*` weight tag), or by an authored suspect-
   *  graph node that lives across arcs. */
  kind: "choice" | "suspect_graph";
  /** Short label for the connector. */
  via: string;
  /** One-sentence summary readable without the source. */
  summary: string;
}

const THREADS: ReadonlyArray<CrossArcThread> = [
  {
    id: "wraith.e5.inscribe_akai_shi",
    source: "Wraith Calder · E5 Herald's Vigil",
    target: "Jericho Jones",
    kind: "choice",
    via: "inscribe_akai_shi",
    summary:
      "The Hierophant offers the stylus; the player can inscribe Akai Shi's name into the daily-names litany — the killing Jericho carried alone now sits beside Wraith's 347,000 names.",
  },
  {
    id: "jericho.e3.cross_arc_consult_wraith",
    source: "Jericho Jones · E3 Imprint Surfaces",
    target: "Wraith Calder",
    kind: "choice",
    via: "cross_arc_consult_wraith",
    summary:
      "The Substrate-N residue match between the Iron Lion imprint and Wraith's protocol theft is brought to the Hierophant for a reading.",
  },
  {
    id: "seer.e1.bring_to_wraith",
    source: "The Seer · E1 Unread Tape",
    target: "Wraith Calder",
    kind: "choice",
    via: "bring_to_wraith",
    summary:
      "The DO-NOT-PLAY tape's intended-audience card names the Hierophant's successor; the player can bring it to Wraith and let him name his successor on the saga's record.",
  },
  {
    id: "vex.e1.cross_arc_consult_seer",
    source: "Vex Solène · E1 Engineer Zero Swap",
    target: "The Seer",
    kind: "choice",
    via: "cross_arc_consult_seer",
    summary:
      "The DEC-7710 master tape's alias was issued at Vex's request — granted because the Seer asked the Insurgency to grant it. Returning to the Seer with the engineering evidence completes the loop.",
  },
  {
    id: "game_master.suspect.iron_lion_imprint",
    source: "The Game Master · E1 Recovered Logs",
    target: "CADES (Iron Lion imprint)",
    kind: "suspect_graph",
    via: "Iron Lion Imprint suspect node",
    summary:
      "The Game Master arc's suspect graph carries an Iron Lion imprint cross-reference node. The imprint inside the Matrix is asking unauthored questions; either the Game Master designed it to grow, or someone with the Goggles has been editing the Matrix's substrate ever since.",
  },
];

export function CrossArcThreads() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3 flex items-center gap-2" style={{ color: "var(--energy-accent)" }}>
        <Link2 size={11} />
        CROSS-ARC THREADS
      </p>
      <ul className="space-y-3">
        {THREADS.map((thread) => (
          <li
            key={thread.id}
            className="px-3 py-2 rounded-md"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderLeft: "2px solid color-mix(in oklch, var(--energy-accent) 50%, transparent)",
            }}
          >
            <p className="font-mono text-[10px] flex items-center gap-2 mb-1" style={{ color: "#e2e8f0" }}>
              <span className="font-bold">{thread.source}</span>
              <span style={{ color: "var(--energy-accent)" }}>→</span>
              <span className="font-bold">{thread.target}</span>
            </p>
            <p className="font-mono text-[9px] tracking-[0.2em] mb-1.5" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
              {thread.kind === "choice" ? "CHOICE" : "SUSPECT GRAPH"} · {thread.via}
            </p>
            <p className="font-mono text-[10px] leading-relaxed italic" style={{ color: "rgba(226, 232, 240, 0.75)" }}>
              {thread.summary}
            </p>
          </li>
        ))}
      </ul>
      <p className="font-mono text-[9px] mt-3" style={{ color: "rgba(226, 232, 240, 0.4)" }}>
        Cross-arc threads weave the saga's NPC arcs together. Choice threads activate when the player commits the named choice; suspect-graph threads are always visible, since they are part of the authored case structure.
      </p>
    </div>
  );
}
