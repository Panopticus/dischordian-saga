/* ═══════════════════════════════════════════════════════
   CORRUPTIBLE BIO — Loredex text with Shadow Tongue edits

   Wraps any text field from a LoredexEntry. When the global
   Palimpsest state has Noise dominating Signal, the Shadow
   Tongue has been editing — this component renders some of
   the text in crossed-out red ink with a single-line forgery
   underneath.

   Whether a specific entry is marked corrupted is determined
   deterministically by `shouldMarkEntryCorrupted` in
   apps/shared/palimpsest.ts, so the same entry stays corrupted
   until the meter flips.

   Usage:
     <CorruptibleBio entryId={entry.id} text={entry.bio} />
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { usePalimpsest } from "@/hooks/usePalimpsest";

interface Props {
  entryId: string;
  text: string | undefined | null;
  className?: string;
  /**
   * Truncate to this many characters with ellipsis. If omitted, the
   * full text is rendered.
   */
  truncate?: number;
}

/** Deterministic pseudo-random "forgery" replacement word. */
const FORGERY_WORDS = [
  "redacted",
  "adjusted",
  "rephrased",
  "corrected",
  "clarified",
  "softened",
  "revised",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Apply corruption to a string by picking ~1 word in every N words and
 * replacing it with a crossed-out red overlay + a forgery. Pure given
 * the same entryId + severity.
 */
function corruptText(
  entryId: string,
  text: string,
  severity: number,
): { word: string; corrupted: boolean; forgery?: string }[] {
  if (severity <= 0) return text.split(/\s+/).map((w) => ({ word: w, corrupted: false }));
  const words = text.split(/\s+/);
  const every = Math.max(6, Math.floor(20 - severity * 15));
  const seed = hashString(entryId);
  return words.map((word, i) => {
    if (i === 0 || i % every !== seed % every) return { word, corrupted: false };
    const forgery = FORGERY_WORDS[(seed + i) % FORGERY_WORDS.length];
    return { word, corrupted: true, forgery };
  });
}

export function CorruptibleBio({ entryId, text, className, truncate }: Props) {
  const { isEntryCorrupted, corruptionSeverity } = usePalimpsest();

  const displayText = useMemo(() => {
    if (!text) return "";
    if (truncate && text.length > truncate) return text.slice(0, truncate) + "...";
    return text;
  }, [text, truncate]);

  const isCorrupted = isEntryCorrupted(entryId);
  const severity = isCorrupted ? corruptionSeverity(entryId) : 0;

  if (!text) return null;

  if (!isCorrupted) {
    return <span className={className}>{displayText}</span>;
  }

  const tokens = corruptText(entryId, displayText, severity);

  return (
    <span className={className} data-testid="loredex-corruption">
      {tokens.map((t, i) => {
        if (!t.corrupted) return <span key={i}>{t.word + " "}</span>;
        return (
          <span key={i} className="relative inline-block">
            <span
              className="line-through decoration-red-500 decoration-2"
              style={{ color: "rgba(220, 60, 60, 0.6)" }}
            >
              {t.word}
            </span>
            <span className="text-red-300/80 italic ml-1">{t.forgery}</span>
            {" "}
          </span>
        );
      })}
    </span>
  );
}

export default CorruptibleBio;
