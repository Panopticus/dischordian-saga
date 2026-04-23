/* ═══════════════════════════════════════════════════════
   useDialogVO — per-NPC dialog VO dispatcher

   Dispatches to the right per-NPC VO hook by FactionNPCId and
   exposes a single uniform API to callers:

     { speak(lineId), stop(), speaking, hasVO }

   `speaking` is driven by audio.onplay / audio.onended, NOT by
   a typewriter or text-reveal proxy. That's the whole point —
   lip-sync / portrait speaking tells must follow actual audio.

   If the NPC has no dedicated VO hook, the dispatcher returns a
   no-op shape with `hasVO: false` so callers can fall back to
   their own visual approximation of "speaking."
   ═══════════════════════════════════════════════════════ */

import { useAgentZeroVO } from "./useAgentZeroVO";
import { useAntiquarianVO } from "./useAntiquarianVO";
import { useElaraVO } from "./useElaraVO";
import { useHumanVO } from "./useHumanVO";
import { useLockeVO } from "./useLockeVO";
import { useShadowTongueVO } from "./useShadowTongueVO";
import { useSourceVO } from "./useSourceVO";
import type { FactionNPCId } from "@/game/factionNPCs";

export interface DialogVO {
  speak: (lineId: string) => void;
  stop: () => void;
  speaking: boolean;
  hasVO: boolean;
  /** The currently-playing audio element, exposed so lipsync analysers
   *  (wawa-lipsync) can connect to the live MediaElementSource. Null
   *  when nothing has played yet for this hook instance. */
  audio: HTMLAudioElement | null;
}

const NOOP: DialogVO = {
  speak: () => {},
  stop: () => {},
  speaking: false,
  hasVO: false,
  audio: null,
};

/**
 * Returns the VO control surface for the given NPC.
 *
 * React Rules of Hooks require we call all hooks unconditionally on
 * every render, so this dispatcher evaluates each per-NPC hook and
 * then selects one to expose. The unused hooks do minimal work —
 * lazy manifest load on first mount and no audio playback unless
 * their own `speak` is invoked — so the overhead is negligible.
 */
export function useDialogVO(npcId: FactionNPCId): DialogVO {
  const elara = useElaraVO();
  const human = useHumanVO();
  const agentZero = useAgentZeroVO();
  const locke = useLockeVO();
  const antiquarian = useAntiquarianVO();
  const source = useSourceVO();
  const shadowTongue = useShadowTongueVO();

  switch (npcId) {
    case "elara": return elara;
    case "the_human": return human;
    case "agent_zero": return agentZero;
    case "adjudicator_locke": return locke;
    case "the_antiquarian": return antiquarian;
    case "the_source": return source;
    case "shadow_tongue": return shadowTongue;
    default: return NOOP;
  }
}
