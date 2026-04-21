// Companion substrate — shared schemas for Elara + Human.
// See apps/shared/characterBible.md for voice direction and authoring rules.

export type CompanionSpeaker = "elara" | "human";

export type ElaraStabilityBand = "fragmented" | "lucid" | "luminous";
export type HumanLightBand = "shadow" | "balanced" | "warm";

export type CompanionPriority = 0 | 1 | 2 | 3;
export type CompanionDismissible = "tap" | "auto" | "manual";

export interface CompanionChoice {
  id: string;
  label: string;
  followUpLineId?: string;
  elaraStabilityDelta?: number;
  humanLightDelta?: number;
  setFlag?: string;
  clearFlag?: string;
}

export interface CompanionLine {
  lineId: string;
  speaker: CompanionSpeaker;
  text: string;
  voId?: string;
  priority: CompanionPriority;
  interruptible: boolean;
  dismissible: CompanionDismissible;
  durationMs?: number;
  unlockFlags?: string[];
  excludeFlags?: string[];
  minAct?: number;
  cooldownKey?: string;
  requiresElaraStability?: ElaraStabilityBand;
  requiresHumanLight?: HumanLightBand;
  elaraStabilityDelta?: number;
  humanLightDelta?: number;
  choices?: CompanionChoice[];
  nextLineId?: string;
}

export type CompanionTriggerMatch =
  | { type: "room_entered"; roomId: string; visitCount?: number }
  | { type: "narrative_flag"; flag: string }
  | { type: "puzzle_clue_discovered"; clueId: string }
  | { type: "locked_door"; roomId: string; gate: string }
  | { type: "feature_unlock"; featureId: string }
  | { type: "ask_topic"; topicId: string }
  | { type: "scene_beat"; beatId: string };

export interface CompanionTrigger {
  triggerId: string;
  match: CompanionTriggerMatch;
  lineId: string;
  oneShot?: boolean;
}

export function stabilityBand(stability: number): ElaraStabilityBand {
  if (stability <= -30) return "fragmented";
  if (stability >= 40) return "luminous";
  return "lucid";
}

export function lightBand(light: number): HumanLightBand {
  if (light <= -30) return "shadow";
  if (light >= 40) return "warm";
  return "balanced";
}

export function lineGatePasses(
  line: CompanionLine,
  ctx: {
    elaraStability: number;
    humanLight: number;
    flags: ReadonlySet<string>;
    act: number;
  },
): boolean {
  if (line.requiresElaraStability && stabilityBand(ctx.elaraStability) !== line.requiresElaraStability) return false;
  if (line.requiresHumanLight && lightBand(ctx.humanLight) !== line.requiresHumanLight) return false;
  if (line.minAct !== undefined && ctx.act < line.minAct) return false;
  if (line.unlockFlags?.some(f => !ctx.flags.has(f))) return false;
  if (line.excludeFlags?.some(f => ctx.flags.has(f))) return false;
  return true;
}
