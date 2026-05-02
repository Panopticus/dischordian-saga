/* ═══════════════════════════════════════════════════════
   TRUST VOICE LINE — band-keyed NPC greeting

   Reads `useNpcTrustBand(npcId)` and renders the matching
   line from a per-band line table. Falls back to the neutral
   "witnessed" band when the player has no scalar yet — the
   line surface always renders something, never blank.

   The first consumer is Wraith Calder's greeting on /cases
   (his pre-rite trust ladder is the canonical source the
   five-band shape was generalised from). Future arcs add
   their own line tables and mount the same component.

   This is the smallest demonstrable payoff of the trust
   mechanic — the engine accumulates scalars; an NPC line
   reads the band; the player sees how the NPC reads them
   today. The interrogation system already has the deeper
   integration hook (humanReaction triplets); this surface
   is the "is the trust scalar visible at all" moment.
   ═══════════════════════════════════════════════════════ */

import { useNpcTrustBand, type NpcTrustBand } from "@/hooks/useNpcTrustBand";

/** Per-band line table. Authors provide one line per band;
 *  the component picks the one matching the player's current
 *  scalar reading. */
export type TrustVoiceLines = Record<NpcTrustBand, string>;

interface TrustVoiceLineProps {
  /** NPC id (matches MysteryDefinition.npcId — e.g.
   *  "wraith_calder", "jericho_jones"). */
  npcId: string;
  /** Display speaker label rendered above the line. */
  speakerLabel: string;
  /** Per-band line table — one line per band. */
  lines: TrustVoiceLines;
}

export function TrustVoiceLine({ npcId, speakerLabel, lines }: TrustVoiceLineProps) {
  const band = useNpcTrustBand(npcId) ?? "witnessed";
  const line = lines[band];
  if (!line) return null;

  return (
    <blockquote
      className="font-mono text-[11px] leading-relaxed italic px-4 py-3 rounded-md border-l-2"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        borderLeftColor: "var(--energy-primary)",
        color: "rgba(226, 232, 240, 0.85)",
      }}
    >
      <span className="block font-mono text-[8px] tracking-[0.3em] not-italic mb-1.5" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
        {speakerLabel.toUpperCase()} · READS YOU AS {band.toUpperCase()}
      </span>
      {line}
    </blockquote>
  );
}

/** Wraith Calder's pre-rite trust ladder, generalised across
 *  the post-rite Hierophant. The lines are short — the
 *  Hierophant does not waste words. */
export const WRAITH_CALDER_LINES: TrustVoiceLines = {
  hostile:    "I will write your name when you are ready to be witnessed. You are not, today, ready.",
  wary:       "You ask the right questions and the wrong tone. The litany has time.",
  witnessed:  "You attended a morning. The litany remembers attendance the way the wood of the bench remembers verdicts. Stay.",
  present:    "You have been near the work long enough to be useful. There is a stylus when you want one.",
  inheriting: "You have already inherited what the saga can teach you about the litany. The next morning is yours to take if you ask.",
};
