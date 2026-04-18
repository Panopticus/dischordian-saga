/* ═══════════════════════════════════════════════════════
   ACT 1 COMPANION PANEL — speaker-accent pair

   Extracts the Elara (cyan) + Human (rose) dual-panel
   blocks from Act1CardLadderPage so the parent page can
   stay in .void-energy-adopted. The speaker-accent colors
   are narrative signal — they identify who is speaking —
   and are listed in .void-energy-intentional.

   Two variants:
     - "prematch"  → Elara recognition + Human counter-perspective
     - "postmatch" → Elara reflection + Human counter-reflection

   The backing text is resolved by the caller and passed in.
   ═══════════════════════════════════════════════════════ */

export interface Act1CompanionPanelProps {
  elaraLabel: string;
  elaraText: string;
  humanLabel: string;
  humanText: string;
}

export function Act1CompanionPanel({
  elaraLabel,
  elaraText,
  humanLabel,
  humanText,
}: Act1CompanionPanelProps) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded border border-cyan-900/50 bg-cyan-950/20 p-3">
        <p className="font-mono text-[9px] uppercase tracking-wider text-cyan-300/70">
          {elaraLabel}
        </p>
        <p className="mt-1 font-serif text-[12px] leading-relaxed text-cyan-50/90">
          {elaraText}
        </p>
      </div>
      <div className="rounded border border-rose-900/50 bg-rose-950/20 p-3">
        <p className="font-mono text-[9px] uppercase tracking-wider text-rose-300/70">
          {humanLabel}
        </p>
        <p className="mt-1 font-serif text-[12px] leading-relaxed text-rose-50/90">
          {humanText}
        </p>
      </div>
    </div>
  );
}

/**
 * Ask-speaker toggle pair. Same cyan/rose semantics but
 * rendered as two mutually-exclusive pill buttons.
 */
export interface Act1AskSpeakerToggleProps {
  active: "elara" | "human" | null;
  onToggle: (speaker: "elara" | "human") => void;
}

export function Act1AskSpeakerToggle({
  active,
  onToggle,
}: Act1AskSpeakerToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onToggle("elara")}
        className={`rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
          active === "elara"
            ? "border-cyan-400 bg-cyan-900/30 text-cyan-100"
            : "border-cyan-900/50 void-bg-canvas text-cyan-300/70 hover:border-cyan-700/60 hover:text-cyan-200"
        }`}
      >
        Elara
      </button>
      <button
        type="button"
        onClick={() => onToggle("human")}
        className={`rounded border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
          active === "human"
            ? "border-rose-400 bg-rose-900/30 text-rose-100"
            : "border-rose-900/50 void-bg-canvas text-rose-300/70 hover:border-rose-700/60 hover:text-rose-200"
        }`}
      >
        The Human
      </button>
    </div>
  );
}
