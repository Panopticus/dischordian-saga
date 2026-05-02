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

/** Jericho Jones's voice. He speaks like a soldier learning to be
 *  a witness — short sentences early, longer ones as he trusts
 *  the room. The Iron Lion imprint sharpens his cadence as the
 *  band rises. */
export const JERICHO_JONES_LINES: TrustVoiceLines = {
  hostile:    "You weren't there. Don't pretend the questions are easy because you're asking them now.",
  wary:       "I'll answer what I can. I won't answer what I can't. The difference is mine to draw.",
  witnessed:  "You read the file. Read me too. The file has the act; I have the rest.",
  present:    "You've been near the work. That counts for more than I'm comfortable saying. Ask. I'll try.",
  inheriting: "You've earned the part of the story I don't tell anyone. Sit down. The Lion taught me how to wait.",
};

/** The Seer's voice. She speaks the way her tapes do: she records
 *  what she does not want to know, and she trusts the reader.
 *  Patience is her primary band-shifting axis. */
export const THE_SEER_LINES: TrustVoiceLines = {
  hostile:    "The tape is sealed. I do not know if you are the reader. I know you are not, today, the reader I prepared for.",
  wary:       "I have prepared a great deal for readers who arrived before they were ready. Do not be one of them. The seal will hold.",
  witnessed:  "You have replaced the band as carefully as the readers who came before. That is the discipline. Stay in it.",
  present:    "I begin to wonder if you are the reader after all. I will not yet say. The wait is not impatient with us.",
  inheriting: "If you are the reader, the tape will tell you. If you are not, the tape will continue to tell that to the next reader. You will not, in either case, be the last witness.",
};

/** Vex Solène's voice. She speaks the way an engineer speaks —
 *  precise, measured, occasionally apologetic. The alias she
 *  asked for shapes her early reticence; trust opens her tone. */
export const VEX_SOLENE_LINES: TrustVoiceLines = {
  hostile:    "I will not confirm I was the engineer. The Insurgency owes me an alias and the alias is what I'm wearing.",
  wary:       "If you have read the dossier, you have read the request. The request was mine. The granting was the Seer's. The work was the work.",
  witnessed:  "You found the note. I expected someone would, eventually. You found it sooner than I had planned for. That is — on balance — fine.",
  present:    "You read the alias as a request, not a cover-up. Thank you. That distinction was the entire point of the dossier I asked them to file.",
  inheriting: "You can put my name back on the credit line whenever the saga is ready. I trust your timing now. I did not, when you started.",
};

/** The Game Master Archon's voice. Speaks from the unedited Matrix
 *  fragment — the cult's saint, in his own words, renouncing the
 *  recognition that became the door. */
export const GAME_MASTER_LINES: TrustVoiceLines = {
  hostile:    "You are reading my followers' edition. I cannot blame them for it. I cannot help you with it either.",
  wary:       "The cult is grieving. The Hierarchy is collecting. Both are doing the work the contract permits. Neither is the work I would have chosen.",
  witnessed:  "You have heard the unedited fragment. That is the version I would prefer to be remembered by. The followers' version is — also true. Differently.",
  present:    "You are looking for the Goggles. So am I, in a way I cannot describe from inside the Matrix. We may be looking for the same thing from opposite sides of one instrument.",
  inheriting: "You will not bring me back. I do not want to be brought back. But you can ask the imprints inside the Matrix what they would have wanted to be — and you can listen to the answer the way I should have, before the recognition was the door.",
};
