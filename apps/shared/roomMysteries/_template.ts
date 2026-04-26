/* ═══════════════════════════════════════════════════════
   ROOM MYSTERIES — generic LucasArts verb-coin template

   Generalizes the Cryo Bay pilot (apps/shared/cryoBayMystery.ts)
   into a per-room module shape so every room can ship the same
   look / use / talk + inventory + clue grammar.

   Each room exports a RoomMysteryModule whose RESPONSES table
   maps (hotspotId, verb) → VerbResponse, plus optional COMBINES
   for two-item inventory chains. Runtime resolves a click via
   resolveVerbResponse(module, verb, hotspotId) and combine
   attempts via combineInventory(module, a, b).

   `Verb`, `Clue`, `VerbResponse`, `CombineResult` are canonical
   here; cryoBayMystery imports them so the pilot stays
   structurally identical to the new modules.
   ═══════════════════════════════════════════════════════ */

/** SCUMM-style verb set. Three verbs is the minimum that produces
 *  a real point-and-click feel without a verb-coin that overwhelms
 *  the on-screen UI. Matches the cryo-bay pilot. */
export type Verb = "look" | "use" | "talk";

export const VERB_LIST: readonly Verb[] = ["look", "use", "talk"] as const;

/** A logged investigation finding. The `source` field is each
 *  room's id (or another semantic group) so the Clue Journal UI
 *  can group entries by where they were found. */
export interface Clue {
  id: string;
  title: string;
  body: string;
  /** Room id or other grouping key. Cryo bay uses "cryo-bay". */
  source: string;
  /** Ordering within the source group, for stable Journal display. */
  order: number;
}

/** Result of a (verb, hotspot) pair. All fields are optional —
 *  `narration` is the only thing the runtime always uses. */
export interface VerbResponse {
  /** Text the room narrator (Elara, by default) speaks. */
  narration: string;
  /** Clue to log. Idempotent — re-logging a clue is a no-op. */
  logsClue?: Clue;
  /** Inventory item id to grant. Idempotent. */
  grantsInventory?: string;
  /** Narrative flag id to set true. */
  setsFlag?: string;
  /** Door / exit to unlock. Runtime maps the value to the room
   *  graph; the resolver doesn't need to know which rooms exist. */
  unlocksExit?: string;
}

/** Result of a `use <a> on <b>` inventory combine. */
export interface CombineResult {
  narration: string;
  /** Resulting composite item id (optional). */
  producesInventory?: string;
  setsFlag?: string;
  logsClue?: Clue;
  unlocksExit?: string;
  /** When true (default) the source items are removed from the
   *  inventory after the combine. */
  consumesItems?: boolean;
}

/** A single combine rule. Order of `a` / `b` doesn't matter at
 *  lookup time — combineInventory tries both. */
export interface CombineRule<IID extends string = string> {
  a: IID;
  b: IID;
  result: CombineResult;
}

/** Per-room module shape. `HID` narrows the hotspot ids to the
 *  set this room actually authors; `IID` narrows the inventory
 *  item ids the room can produce. Both default to `string` so a
 *  Tier-1 stub room doesn't need to invent literal unions. */
export interface RoomMysteryModule<
  HID extends string = string,
  IID extends string = string,
> {
  /** Stable room id, matches GameContext ROOM_DEFINITIONS.id. */
  roomId: string;
  /** Verb × hotspot response table. Omitted pairs fall back to a
   *  default "nothing happens" line at runtime. */
  responses: Readonly<Record<HID, Partial<Record<Verb, VerbResponse>>>>;
  /** Optional two-item combine rules. */
  combines?: readonly CombineRule<IID>[];
}

/** Look up a (verb, hotspot) response in a room module. Returns
 *  null when the pair has no authored reaction — runtime should
 *  fall back to a generic "nothing happens" line. */
export function resolveVerbResponse<HID extends string>(
  module: RoomMysteryModule<HID>,
  verb: Verb,
  hotspot: HID,
): VerbResponse | null {
  return module.responses[hotspot]?.[verb] ?? null;
}

/** Try to combine two inventory items in a room module. Returns
 *  null when no rule matches in either ordering. */
export function combineInventory<IID extends string>(
  module: RoomMysteryModule<string, IID>,
  a: IID,
  b: IID,
): CombineResult | null {
  if (!module.combines) return null;
  for (const rule of module.combines) {
    if ((rule.a === a && rule.b === b) || (rule.a === b && rule.b === a)) {
      return rule.result;
    }
  }
  return null;
}
