// Locked-door narration registry (F11). Replaces the out-of-context sonner
// toast in ArkExplorerPage.tsx:970-982 with scheduler-routed lines that
// reference what the player has actually seen.
//
// Resolution is: (roomId, gateType, narrativeAct) → lineId. The scheduler
// falls through to a generic line when a specific combination is missing.
// Every line referenced here also exists as a CompanionLine in either
// elaraLines.ts or humanLines.ts (substrate resolves by id).
//
// See apps/client/src/components/ShipSchematicMap.tsx:84-91 UNLOCK_HINTS
// for the gate values this file needs to cover.

import type { CompanionLine } from "./companion";

const l = (line: Omit<CompanionLine, "speaker">): CompanionLine => ({ ...line, speaker: "elara" });
const h = (line: Omit<CompanionLine, "speaker">): CompanionLine => ({ ...line, speaker: "human" });

/**
 * Canonical locked-door lines authored here rather than in elaraLines.ts /
 * humanLines.ts so the registry is self-contained. Runtime merges this
 * list into the combined CompanionLine pool.
 */
export const LOCKED_DOOR_LINES: CompanionLine[] = [
  // ─────────────────────────────────────────────────────────────
  // MED BAY — sealed until cryo_mystery_victim_identified. The
  // bulkhead opens when the operative slots the torn ID tag
  // (frosted-glass) into the cracked data-slate (under the pod)
  // and the manifest spits out a name. Mental observations alone
  // don't open it — the Ark wants the dead named.
  // ─────────────────────────────────────────────────────────────
  l({
    lineId: "locked_medbay_prelude_lucid",
    text: "The Med Bay won't open until the dead has a name. Two pieces, one combine — there's a torn ID tag near the dark pod's frosted glass, and a cracked data-slate hidden under the pod itself. Pocket both, then slot the tag against the slate. The manifest does the rest.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 12000,
    requiresElaraStability: "lucid",
    cooldownKey: "locked_medbay_prelude",
  }),
  l({
    lineId: "locked_medbay_prelude_fragmented",
    text: "Sealed. Sealed. The door — the door wants a name. A name. Tag — the cord, the cut cord, the tag is — find it. The slate. Under the pod. Slot them. Slot them together. A name. Please. A name.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 11400,
    requiresElaraStability: "fragmented",
    cooldownKey: "locked_medbay_prelude",
  }),
  l({
    lineId: "locked_medbay_prelude_luminous",
    text: "She won't open for an unnamed dead. There are two pieces in this room — a torn ID tag the killer left in the frost, and a cracked data-slate someone hid under the pod for the right person to find. Carry them both, then put them together. The manifest will give the dead their name back, and the Ark will let us in.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 12600,
    requiresElaraStability: "luminous",
    cooldownKey: "locked_medbay_prelude",
  }),

  // Med Bay — after prelude, locked for re-entry attempts without power.
  l({
    lineId: "locked_medbay_postprelude_lucid",
    text: "Med Bay's sealed again until we route grid power through Engineering. The ship locks medical when she can't run life support in it. Respectful of her, frustrating for us.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9800,
    requiresElaraStability: "lucid",
    cooldownKey: "locked_medbay_postprelude",
  }),
  l({
    lineId: "locked_medbay_postprelude_fragmented",
    text: "Power. Power. Power. Engineering. Engineering. Before — before we can — can go back. She locks it. She always locks it. Respectful. Respectful. Power first.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9400,
    requiresElaraStability: "fragmented",
    cooldownKey: "locked_medbay_postprelude",
  }),
  l({
    lineId: "locked_medbay_postprelude_luminous",
    text: "She's sealed medical until Engineering routes life support back through her. That's her keeping a promise to the person she was built to care for — not an inconvenience, a kindness.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 10200,
    requiresElaraStability: "luminous",
    cooldownKey: "locked_medbay_postprelude",
  }),

  // ─────────────────────────────────────────────────────────────
  // BRIDGE — sealed until the Power Relay puzzle is solved. Gate
  // lines vary by whether the designation clue (clue-bridge-01) has
  // been discovered. If yes, Elara nudges toward binary-teach topics;
  // if no, she sends them hunting for the clue.
  // ─────────────────────────────────────────────────────────────
  // Bridge — no clue yet
  l({
    lineId: "locked_bridge_noclue_lucid",
    text: "The Bridge is behind a relay lock. The console wants a number in binary. We don't know the number yet — somewhere on this deck there's a designation plate that will tell us. Hunt for it.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 10400,
    requiresElaraStability: "lucid",
    cooldownKey: "locked_bridge_noclue",
  }),
  l({
    lineId: "locked_bridge_noclue_fragmented",
    text: "Binary. It wants — it wants a number. In binary. We don't have the number. The number is — somewhere. A plate. A designation plate. Look for it. Please.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 10000,
    requiresElaraStability: "fragmented",
    cooldownKey: "locked_bridge_noclue",
  }),
  l({
    lineId: "locked_bridge_noclue_luminous",
    text: "The Bridge is asking for a number in binary — a specific number. There's a designation plate somewhere on this deck that names her. Once we find it, the rest of the lock is our problem, not hers.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 10800,
    requiresElaraStability: "luminous",
    cooldownKey: "locked_bridge_noclue",
  }),

  // Bridge — clue discovered, puzzle unsolved. Elara hints toward Ask.
  l({
    lineId: "locked_bridge_clued_lucid",
    text: "You have the number. The console wants it in binary across eleven switches. If you want me to walk you through binary, tap 'Ask Elara for Help' — I'll teach, not solve. Your hands do the last part.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11400,
    requiresElaraStability: "lucid",
    cooldownKey: "locked_bridge_clued",
    unlockFlags: ["bridge_ark_designation_found"],
  }),
  l({
    lineId: "locked_bridge_clued_fragmented",
    text: "The number. Eleven switches. You have both. I can teach. I can teach. Ask. Ask me. I won't — I won't flip them for you. I can't. I shouldn't. Ask.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 10200,
    requiresElaraStability: "fragmented",
    cooldownKey: "locked_bridge_clued",
    unlockFlags: ["bridge_ark_designation_found"],
  }),
  l({
    lineId: "locked_bridge_clued_luminous",
    text: "You have the number. Eleven switches, one pattern. I'll teach you binary step by step if you'd like — tap 'Ask Elara for Help.' The flipping stays yours; the teaching is the part I'm actually good at.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 12000,
    requiresElaraStability: "luminous",
    cooldownKey: "locked_bridge_clued",
    unlockFlags: ["bridge_ark_designation_found"],
  }),

  // ─────────────────────────────────────────────────────────────
  // ENGINEERING — sealed until captains-master-key or equivalent.
  // Human often gets this one since it's his old playground.
  // ─────────────────────────────────────────────────────────────
  h({
    lineId: "locked_engineering_shadow",
    text: "Engineering wants a master key. The Captain kept it on the Bridge. We'll swing back here after we've cracked that door. Clean order of operations.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 8800,
    requiresHumanLight: "shadow",
    cooldownKey: "locked_engineering",
  }),
  h({
    lineId: "locked_engineering_balanced",
    text: "Engineering needs the Captain's master key. It lives on the Bridge. Routine sequence — solve the Bridge relay, come back here with the key, lights on.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9200,
    requiresHumanLight: "balanced",
    cooldownKey: "locked_engineering",
  }),
  h({
    lineId: "locked_engineering_warm",
    text: "Engineering is waiting on the Captain's master key — which is on the Bridge. Old sequence. The ship is telling us the order she wants to be put back together in. I like that about her.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 10000,
    requiresHumanLight: "warm",
    cooldownKey: "locked_engineering",
  }),

  // ─────────────────────────────────────────────────────────────
  // COMMS ARRAY — needs a signal-frequency crystal from Med Bay.
  // ─────────────────────────────────────────────────────────────
  l({
    lineId: "locked_comms_lucid",
    text: "Comms Array is asleep. There's a signal-frequency crystal somewhere in the Medical Bay — it tells Comms what carrier to wake on. Fetch-quest, sorry. I didn't design this layout.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9400,
    requiresElaraStability: "lucid",
    cooldownKey: "locked_comms",
  }),
  l({
    lineId: "locked_comms_fragmented",
    text: "Comms. Comms is asleep. Crystal. A crystal from — from Med Bay. Frequency. Signal. Bring it. Bring it and she wakes.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 8400,
    requiresElaraStability: "fragmented",
    cooldownKey: "locked_comms",
  }),
  l({
    lineId: "locked_comms_luminous",
    text: "Comms is waiting on a signal-frequency crystal from Medical Bay. It's a small glassy thing — bring it here, seat it in the console, she starts listening again.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9800,
    requiresElaraStability: "luminous",
    cooldownKey: "locked_comms",
  }),

  // ─────────────────────────────────────────────────────────────
  // ARMORY — cargo bay pressurization gate.
  // ─────────────────────────────────────────────────────────────
  h({
    lineId: "locked_armory_shadow",
    text: "Armory is locked behind cargo-bay pressure. Don't force it. A pressure breach in here would hurt more than the door denying us does.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 8800,
    requiresHumanLight: "shadow",
    cooldownKey: "locked_armory",
  }),
  h({
    lineId: "locked_armory_balanced",
    text: "Armory's waiting on cargo-bay pressure. Don't force the seal; atmospheres win that argument every time. We pressurise from the Cargo Bay console, then this opens quietly.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9400,
    requiresHumanLight: "balanced",
    cooldownKey: "locked_armory",
  }),
  h({
    lineId: "locked_armory_warm",
    text: "Cargo-bay pressure gates this door. Don't muscle it — I've seen what atmosphere differentials do to operatives with more conviction than patience. We'll do it right. Cargo Bay console first.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 10000,
    requiresHumanLight: "warm",
    cooldownKey: "locked_armory",
  }),

  // ─────────────────────────────────────────────────────────────
  // GENERIC FALLBACK — scheduler default when (roomId, gate) isn't
  // specifically authored. Band-gated so it still feels voiced.
  // ─────────────────────────────────────────────────────────────
  l({
    lineId: "locked_generic_lucid",
    text: "Sealed. Not for a reason I can name in a sentence. We'll come back when the ship has changed its mind — and she does, with the right nudge.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9000,
    requiresElaraStability: "lucid",
    cooldownKey: "locked_generic",
  }),
  l({
    lineId: "locked_generic_fragmented",
    text: "Sealed. Sealed. Not — not yet. Not yet. We — we come back. We come back. She changes her mind. She does. She does.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 8200,
    requiresElaraStability: "fragmented",
    cooldownKey: "locked_generic",
  }),
  l({
    lineId: "locked_generic_luminous",
    text: "She's sealed this one. Not forever. She's good about keeping her reasons, even when the reasons look like inconvenience from our side. We'll earn it.",
    priority: 1,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9400,
    requiresElaraStability: "luminous",
    cooldownKey: "locked_generic",
  }),
];

/**
 * Resolves (roomId, gate) to a canonical lineId. Act-aware: pre-prelude
 * and post-prelude variants swap in/out. Returns null when nothing is
 * authored for the pair (runtime falls back to locked_generic_*).
 */
export function lockedDoorLineId(
  roomId: string,
  gate: string,
  ctx: { preludeComplete: boolean; bridgeDesignationFound: boolean },
): string {
  if (roomId === "medical-bay") {
    return ctx.preludeComplete ? "locked_medbay_postprelude_*" : "locked_medbay_prelude_*";
  }
  if (roomId === "bridge") {
    return ctx.bridgeDesignationFound ? "locked_bridge_clued_*" : "locked_bridge_noclue_*";
  }
  if (roomId === "engineering") return "locked_engineering_*";
  if (roomId === "comms-array") return "locked_comms_*";
  if (roomId === "armory") return "locked_armory_*";
  if (roomId === "cargo-bay") return "locked_armory_*"; // shared gate
  return "locked_generic_*";
}
