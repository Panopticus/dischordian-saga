/**
 * §5.6 Programmer gift — accept/decline choice pillar.
 *
 * Spec: ACT1_NARRATIVE_STRUCTURE.md §5.6.
 * Modeled after ChoicePillarLightDark (§5.8.1). The Programmer is
 * the Engineer's oldest friend; canonically he deliberately throws
 * the match mid-game. This pillar surfaces the choice when the
 * engine transitions ProgrammerGiftState into "offered" (see
 * apps/shared/tcg-core/engine/programmerGift.ts).
 *
 * Behavior: one-shot. The first click drives onPick; subsequent
 * clicks are ignored. The parent is responsible for mounting this
 * when `isGiftPending(state)` and unmounting after resolution.
 *
 * Copy draws from §5.6 — "Some losses are gifts. This is one."
 */
import { useState } from "react";

export type ProgrammerGiftChoice = "accept" | "decline";

export interface ChoicePillarProgrammerGiftProps {
  /** Called with the player's pick. Caller writes the campaign
   *  flag + calls the engine transition + unmounts this. */
  onPick: (choice: ProgrammerGiftChoice) => void;
}

const SUBTITLES = {
  accept:
    "Take the win. Some losses are gifts. The Engineer's oldest friend lets the match go on purpose.",
  decline:
    "Keep fighting. The Programmer vanishes that night regardless. The win, if it comes, is yours.",
} as const;

export function ChoicePillarProgrammerGift({
  onPick,
}: ChoicePillarProgrammerGiftProps) {
  const [picked, setPicked] = useState<ProgrammerGiftChoice | null>(null);

  const handlePick = (choice: ProgrammerGiftChoice) => {
    if (picked) return;
    setPicked(choice);
    onPick(choice);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Accept or decline the Programmer's gift"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
    >
      {/* Caption — quiet, not a prompt */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-center">
        <p className="font-serif text-sm uppercase tracking-[0.4em] void-text-dim">
          The gift
        </p>
      </div>

      <div className="flex items-stretch gap-0">
        {/* Accept pillar — warm cedar */}
        <button
          type="button"
          aria-label="Accept the gift"
          disabled={picked !== null}
          onClick={() => handlePick("accept")}
          className={
            "group relative flex-col flex w-64 h-[60vh] px-6 py-10 " +
            "border void-border bg-gradient-to-b from-orange-100/10 via-orange-200/5 to-amber-50/10 " +
            "transition-all duration-500 " +
            (picked === "accept"
              ? "void-border shadow-[0_0_40px_rgba(255,190,130,0.5)] scale-[1.02]"
              : picked !== null
                ? "opacity-30"
                : "void-border hover:shadow-[0_0_24px_rgba(255,190,130,0.3)] cursor-pointer")
          }
        >
          <div className="flex-1 flex items-start justify-center pt-4">
            <span className="font-serif text-4xl tracking-[0.2em] void-text-premium">
              ACCEPT
            </span>
          </div>
          <p className="font-serif text-[11px] void-text-premium leading-relaxed text-center mt-auto">
            {SUBTITLES.accept}
          </p>
        </button>

        {/* Separator — thin brass rule */}
        <div className="w-px void-bg-sunk" />

        {/* Decline pillar — cold steel */}
        <button
          type="button"
          aria-label="Decline the gift"
          disabled={picked !== null}
          onClick={() => handlePick("decline")}
          className={
            "group relative flex-col flex w-64 h-[60vh] px-6 py-10 " +
            "border void-border bg-gradient-to-b from-stone-700/40 via-stone-800/60 to-stone-900/80 " +
            "transition-all duration-500 " +
            (picked === "decline"
              ? "void-border shadow-[0_0_40px_rgba(80,80,100,0.9)] scale-[1.02]"
              : picked !== null
                ? "opacity-30"
                : "void-border hover:shadow-[0_0_24px_rgba(80,80,100,0.7)] cursor-pointer")
          }
        >
          <div className="flex-1 flex items-start justify-center pt-4">
            <span className="font-serif text-4xl tracking-[0.2em] void-text">
              DECLINE
            </span>
          </div>
          <p className="font-serif text-[11px] void-text-dim leading-relaxed text-center mt-auto">
            {SUBTITLES.decline}
          </p>
        </button>
      </div>
    </div>
  );
}
