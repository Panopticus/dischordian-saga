/* DeMagi Ch4 element-specific mediation outcomes (spec §2.1 + §4.2-4.3) */
import type { PotentialQuestlineBeat } from "./potentialQuestlineTypes";

export const DEMAGI_CH4_ELEMENT_RESOLUTIONS: Record<string, PotentialQuestlineBeat[]> = {
  fire: [
    { speaker: "arch_burner_vel", text: "Your fire speaks. I hear it. The mediation burns — not destructively, but clarifyingly. What remains after the burn is the truth neither side was willing to say." },
    { speaker: "thael_vo", text: "Fire-speakers see through pretense. If your element says this is the path, I will listen — because fire doesn't lie. It can't." },
  ],
  earth: [
    { speaker: "thael_vo", text: "Your earth speaks. I hear it. The weight of this argument has been measured. The ground knows what can be carried and what must be set down. Vel — what does the earth say to set down?" },
    { speaker: "arch_burner_vel", stageDirection: "Reluctantly.", text: "The demand for destruction. The earth says set down the demand for destruction. Keep the grief. Set down the weapon." },
  ],
  water: [
    { speaker: "thael_vo", text: "Your water speaks. I hear it. Water finds the path of least resistance — not because it is weak, but because it is wise. Show us the channel, Water-speaker." },
    { speaker: "arch_burner_vel", text: "Water doesn't burn. Water doesn't break. Water goes around. Fine. Show me around." },
  ],
  air: [
    { speaker: "thael_vo", text: "Your air speaks. I hear it. Air carries voices farther than any other element. What should be carried from this room to the rest of the Assembly?" },
    { speaker: "arch_burner_vel", text: "Air escapes. That's what Thael-Vo would say. But air also returns. It always returns. Carry the truth out. Bring their answer back." },
  ],
};
