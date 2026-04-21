/**
 * Openings with the Master — browse and study real chess openings
 * framed by the Celebration GM. Pure reading/reference page in
 * this iteration; drill-against-the-master lives in a later
 * chunk once the existing ChessPage game flow is refactored to
 * accept a scripted opponent.
 */
import { useState } from "react";
import { CHESS_OPENINGS, type ChessOpening } from "@shared/chessOpenings";

function OpeningDetail({ opening }: { opening: ChessOpening }) {
  return (
    <article className="p-4 border border-void-border/40 rounded bg-void-bg/40">
      <header className="mb-3">
        <h2 className="text-lg text-void-text">{opening.name}</h2>
        <p className="text-xs text-void-text-muted">
          ECO {opening.ecoCode} · {opening.era}
        </p>
      </header>
      <p className="text-sm text-void-text mb-4 italic">
        {opening.gmIntro}
      </p>
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-widest text-void-text-muted mb-1">
          Main line
        </h3>
        <p className="font-mono text-sm text-void-text-accent">
          {opening.mainLine
            .map((move, i) => {
              const ply = i + 1;
              const moveNum = Math.ceil(ply / 2);
              if (ply % 2 === 1) return `${moveNum}. ${move}`;
              return move;
            })
            .join(" ")}
        </p>
      </div>
      {opening.branches.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-void-text-muted mb-1">
            Teaching branches
          </h3>
          <ul className="space-y-2 text-sm">
            {opening.branches.map((branch, i) => (
              <li key={i}>
                <span className="font-mono text-void-text-accent">
                  {branch.playerMove}
                </span>
                <span className="text-void-text-muted italic"> — {branch.gmReaction}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default function ChessStudyPage() {
  const [selected, setSelected] = useState<string>(CHESS_OPENINGS[0].id);
  const opening = CHESS_OPENINGS.find((o) => o.id === selected);

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto text-void-text">
      <header className="mb-6">
        <h1 className="text-2xl tracking-wide">Openings with the Master</h1>
        <p className="text-sm text-void-text-muted mt-1 italic">
          Post-tutorial curriculum. Pick an opening; the Celebration Game
          Master frames it, then walks you through the main line and the
          most common amateur departures.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <nav className="col-span-1 space-y-1">
          {CHESS_OPENINGS.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelected(o.id)}
              className={`block w-full text-left text-sm px-3 py-2 rounded border ${
                selected === o.id
                  ? "border-void-text-accent/60 bg-void-bg/60 text-void-text-accent"
                  : "border-void-border/30 text-void-text-muted hover:text-void-text"
              }`}
            >
              <div>{o.name}</div>
              <div className="text-[10px] uppercase tracking-wider">
                ECO {o.ecoCode}
              </div>
            </button>
          ))}
        </nav>
        <section className="col-span-2">
          {opening && <OpeningDetail opening={opening} />}
        </section>
      </div>
    </div>
  );
}
