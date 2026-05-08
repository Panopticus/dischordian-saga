/* ═══════════════════════════════════════════════════════
   CORRUPTIBLE BIO — Loredex text with Shadow Tongue edits

   Wraps any text field from a LoredexEntry. Two independent
   triggers can mark a piece of text corrupted:

   1. **Global Palimpsest state** — when Noise dominates Signal,
      the Shadow Tongue is editing broadly; `shouldMarkEntryCorrupted`
      in apps/shared/palimpsest.ts deterministically picks which
      entries are affected.

   2. **Targeted ST active edit** — when an `editId` prop is passed
      AND `shadowTongueState.activeEdits[editId]` is currently
      active (uncorruptedAt is null), this specific text shows
      crossouts regardless of the global Palimpsest meter. This is
      the per-artifact path the room-mystery hotspots drive: a
      Look response on `archives:rewritten-ledger` records an
      `archives_lectern` edit, and any text rendered with
      `editId="archives_lectern"` immediately surfaces the crossout.

   Either trigger fires → corruption renders. The sources of truth
   are independent, so the global Palimpsest meter still works for
   non-targeted Loredex entries while the ST per-artifact path
   gives hotspot-driven beats their own dial.

   Usage:
     <CorruptibleBio entryId={entry.id} text={entry.bio} />
     <CorruptibleBio
       entryId={entry.id}
       text={entry.bio}
       editId="archives_lectern"
     />
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { usePalimpsest } from "@/hooks/usePalimpsest";
import { useShadowTongueState } from "@/hooks/useShadowTongueState";

interface Props {
  entryId: string;
  text: string | undefined | null;
  className?: string;
  /**
   * Truncate to this many characters with ellipsis. If omitted, the
   * full text is rendered.
   */
  truncate?: number;
  /**
   * Optional Shadow Tongue edit id (`<room>_<artifact>`, e.g.
   * "archives_lectern"). When set AND the edit is currently active
   * (shadowTongueState.activeEdits[editId].uncorruptedAt === null),
   * corruption is rendered regardless of the Palimpsest meter.
   *
   * Pass this on hotspot-driven Loredex surfaces; the
   * uncorruption mini-loop's `clearActiveEdit` mutation will
   * remove the crossouts on the next refetch.
   */
  editId?: string;
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

export function CorruptibleBio({
  entryId,
  text,
  className,
  truncate,
  editId,
}: Props) {
  const { isEntryCorrupted, corruptionSeverity } = usePalimpsest();
  const { isEditActive } = useShadowTongueState();

  const displayText = useMemo(() => {
    if (!text) return "";
    if (truncate && text.length > truncate) return text.slice(0, truncate) + "...";
    return text;
  }, [text, truncate]);

  // Either corruption source fires → render crossouts. The targeted
  // ST path is independent of the Palimpsest meter so hotspot-driven
  // beats get their own dial.
  const palimpsestCorrupted = isEntryCorrupted(entryId);
  const stCorrupted = editId ? isEditActive(editId) : false;
  const isCorrupted = palimpsestCorrupted || stCorrupted;

  // ST-driven corruption uses a fixed mid-severity (0.6) so the
  // density is recognisable but capped — see plan §7 risk #5.
  const severity = stCorrupted
    ? 0.6
    : palimpsestCorrupted
    ? corruptionSeverity(entryId)
    : 0;

  if (!text) return null;

  if (!isCorrupted) {
    return <span className={className}>{displayText}</span>;
  }

  // Use editId as the corruption seed when available so two artifacts
  // edited the same way produce visibly distinct crossout patterns
  // (otherwise every entry sharing a single entryId would crossout
  // identically).
  const seed = editId ?? entryId;
  const tokens = corruptText(seed, displayText, severity);

  return (
    <span
      className={className}
      data-testid="loredex-corruption"
      data-corruption-source={
        stCorrupted ? "shadow-tongue-edit" : "palimpsest"
      }
      {...(editId ? { "data-edit-id": editId } : {})}
    >
      {tokens.map((t, i) => {
        if (!t.corrupted) return <span key={i}>{t.word + " "}</span>;
        return (
          <span key={i} className="relative inline-block">
            <span
              className="line-through decoration-red-500 decoration-2"
              style={{ color: "color-mix(in oklch, var(--energy-error) 60%, transparent)" }}
            >
              {t.word}
            </span>
            <span className="void-text-error italic ml-1">{t.forgery}</span>
            {" "}
          </span>
        );
      })}
    </span>
  );
}

export default CorruptibleBio;
