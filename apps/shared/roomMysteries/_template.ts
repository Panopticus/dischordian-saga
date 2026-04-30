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

/** Re-export so room-mystery authors can declare ST edits without
 *  reaching past the module boundary. */
export type EditType = import("../shadowTongueEdits").EditType;

/** Author-side declaration that interacting with this verb-response
 *  records a Shadow Tongue edit on a room artifact. The runtime
 *  hooks this to `recordActiveEdit` on the epochWitness tRPC router
 *  (apps/server/routers/epochWitness.ts) so the global
 *  shadowTongueState.activeEdits column gets the entry.
 *
 *  Surfaced here (in the VerbResponse layer) so the data tells the
 *  story — a writer reading archives.ts sees which Look response
 *  records the lectern edit, and the runtime fires it without the
 *  writer touching tRPC. */
export interface RecordsActiveEdit {
  /** Artifact slug within the room — `lectern`, `reactor-schematic`,
   *  `starmap`, etc. The runtime composes `<roomId>_<artifact>` to
   *  form the canonical edit id. */
  artifact: string;
  /** What kind of edit. See apps/shared/shadowTongueEdits.ts. */
  type: EditType;
}

export const VERB_LIST: readonly Verb[] = ["look", "use", "talk"] as const;

/** Elara's hidden-stability bands (mirrors companion.ts ElaraStabilityBand).
 *  A line authored as a triplet picks a variant from this set based on
 *  the player's live stability scalar at click time. */
export interface ElaraBandedText {
  fragmented: string;
  lucid: string;
  luminous: string;
}

/** The Human's hidden-light bands (mirrors companion.ts HumanLightBand). */
export interface HumanBandedText {
  shadow: string;
  balanced: string;
  warm: string;
}

/** Narration may be a single string (band-agnostic — used for surface
 *  descriptions, red-herring asides) or a triplet of band variants for
 *  beats that carry narrative weight. */
export type ElaraNarration = string | ElaraBandedText;
export type HumanNarration = string | HumanBandedText;

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

/** Section 9 — A response button the player can use to reply to an
 *  Elara mystery narration. Mirrors GameContext.ElaraResponseChoice
 *  but kept here so the room-mystery modules don't import the client
 *  context. The runtime adapts between the two shapes. */
export interface MysteryResponseChoice {
  /** Stable manifest key, e.g. "human.cryo.dead-pod.look.acknowledge". */
  id: string;
  /** Short button text (≤ 6 words). */
  label: string;
  /** Optional Elara follow-up VO id played after the human responds. */
  elaraFollowUpVoId?: string;
  /** Inline follow-up text used when the manifest entry hasn't been
   *  generated yet. Falls back to VO when both are present. */
  elaraFollowUpText?: string;
  /** Optional codex/lore entry logged on this branch. */
  logsClue?: Clue;
  /** When true, dismiss the popup instead of waiting on a follow-up. */
  closesDialog?: boolean;
}

/** The Detective's counter-read on a hotspot. Only surfaced once
 *  `first_human_revealed` has been set in the Prelude. The runtime
 *  exposes an "Ask the Human." choice on the response strip whenever
 *  this is present and the gate flag is true; picking it routes
 *  through `humanVo.speak(voId)` and the popup's `humanSpeaking`
 *  phase. Triplet `narration` is selected by the live `humanLight`
 *  band (shadow/balanced/warm). */
export interface HumanReaction {
  /** First-person Detective line, optionally banded. */
  narration: HumanNarration;
  /** Manifest VO id for the line (humanVoManifest.json). When
   *  omitted the popup falls back to typewriter-only. */
  voId?: string;
  /** Optional clue logged when the player asks the Human. */
  logsClue?: Clue;
  /** Optional flag to set when the Human speaks (e.g. an
   *  "I told you something I shouldn't have" memory marker). */
  setsFlag?: string;
}

/** Result of a (verb, hotspot) pair. All fields are optional —
 *  `narration` is the only thing the runtime always uses. */
export interface VerbResponse {
  /** Text the room narrator (Elara, by default) speaks. May be a
   *  single string for surface beats or a triplet keyed by her
   *  hidden-stability band for weight-bearing reveals. */
  narration: ElaraNarration;
  /** Optional VO audio URL to play alongside the narration. The
   *  runtime hands it to ElaraPopup which manages its own
   *  HTMLAudioElement lifecycle. Falls back silently to text-only
   *  when missing — VO is purely additive. */
  vo?: string;
  /** Section 9 — stable manifest id for this verb response's audio.
   *  When set, the runtime calls useElaraVO().speak(voId) so the
   *  popup carries Elara's actual voice. Preferred over the legacy
   *  `vo` URL field, which stays as a one-off CDN escape hatch. */
  voId?: string;
  /** Section 9 — player response choices surfaced after the
   *  narration ends. Empty/undefined falls through to the default
   *  3-button strip in ElaraConversationPopup. */
  responses?: MysteryResponseChoice[];
  /** Clue to log. Idempotent — re-logging a clue is a no-op. */
  logsClue?: Clue;
  /** Inventory item id to grant. Idempotent. */
  grantsInventory?: string;
  /** Narrative flag id to set true. */
  setsFlag?: string;
  /** Door / exit to unlock. Runtime maps the value to the room
   *  graph; the resolver doesn't need to know which rooms exist. */
  unlocksExit?: string;
  /** When true, the hotspot is removed from the scene after this verb
   *  fires. Used for one-shot pickups (data-slate `use`, locket pickup)
   *  so they don't stay clickable after the player has pocketed them. */
  consumesHotspot?: boolean;
  /** Sierra/LucasArts/Kings-Quest "click again, learn a little more"
   *  escalation. Click N on this hotspot since last room entry serves
   *  `tiers[N-1]` (1-indexed: tier 1 = base, tier 2 = tiers[0], …).
   *  When the player runs past the end the runtime serves the last
   *  tier — author a tier-N "you keep coming back to this" Hitchhiker
   *  beat there to make the loop feel intentional. Each tier is a
   *  full VerbResponse so it can carry its own clues, flags, choices,
   *  and Human reaction. */
  tiers?: readonly VerbResponse[];
  /** The Detective's counter-read. Surfaced as an "Ask the Human."
   *  choice once `first_human_revealed` is set. Author this on
   *  hotspots where he holds context Elara doesn't (Pod 0, Vox,
   *  Kael, Shadow Tongue, Terminus singer, the red herrings he
   *  already half-narrates). */
  humanReaction?: HumanReaction;
  /** When set, firing this verb response records a Shadow Tongue
   *  edit on a room artifact. The runtime calls
   *  epochWitness.recordActiveEdit({ id: <roomId>_<artifact>, ... })
   *  the first time this fires; subsequent fires are deduped by the
   *  pure helper's "preserve prior createdAt on re-edit" semantics. */
  recordsActiveEdit?: RecordsActiveEdit;
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
  /** When set, firing this combine clears a Shadow Tongue active
   *  edit. The runtime calls epochWitness.clearActiveEdit({ id })
   *  on success — idempotent at the service layer (first clear
   *  wins, unknown id no-ops). */
  clearsActiveEdit?: string;
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

/** Resolve the click-tier variant of a verb response. `clickCount` is
 *  1-indexed: the first click on a hotspot is 1 → returns the base
 *  response; the second is 2 → returns `tiers[0]`; the (N+1)-th click
 *  past the last tier loops on the final tier so the "fourth time"
 *  Hitchhiker beat plays as a sticky terminal layer.
 *
 *  Returns null when the (verb, hotspot) pair is unauthored — the
 *  runtime should fall back to a generic line in that case. */
export function resolveTierResponse<HID extends string>(
  module: RoomMysteryModule<HID>,
  verb: Verb,
  hotspot: HID,
  clickCount: number,
): VerbResponse | null {
  const base = resolveVerbResponse(module, verb, hotspot);
  if (!base) return null;
  if (clickCount <= 1 || !base.tiers || base.tiers.length === 0) return base;
  const idx = Math.min(clickCount - 2, base.tiers.length - 1);
  return base.tiers[idx];
}

/** Pick the band variant of an ElaraNarration. Plain strings
 *  fall through unchanged so authors can leave surface lines
 *  band-agnostic. */
export function resolveBandedNarration(
  narration: ElaraNarration,
  band: "fragmented" | "lucid" | "luminous",
): string {
  if (typeof narration === "string") return narration;
  return narration[band];
}

/** Pick the band variant of a Human reaction's narration. Mirrors
 *  resolveBandedNarration for the Detective's hidden-light bands. */
export function resolveHumanBandedNarration(
  narration: HumanNarration,
  band: "shadow" | "balanced" | "warm",
): string {
  if (typeof narration === "string") return narration;
  return narration[band];
}

/** Synthesize the band-specific manifest id for a banded narration.
 *  When narration is a plain string (band-agnostic) the voId is used
 *  unchanged. When narration is banded, the runtime resolves the audio
 *  for each band variant by appending `.${band}` to the base voId —
 *  e.g. base `elara.cryo.dead-pod.look.t1` becomes
 *  `elara.cryo.dead-pod.look.t1.lucid` for the lucid-band recording.
 *
 *  Returns `undefined` when no base voId was authored (text-only line).
 *  The VO generator and the runtime use this so a single base voId in
 *  the source of truth maps to three audio files in the manifest. */
export function resolveBandedVoId(
  baseVoId: string | undefined,
  narration: ElaraNarration,
  band: "fragmented" | "lucid" | "luminous",
): string | undefined {
  if (!baseVoId) return undefined;
  if (typeof narration === "string") return baseVoId;
  return `${baseVoId}.${band}`;
}

/** Mirror of resolveBandedVoId for the Detective's HumanReaction. */
export function resolveBandedHumanVoId(
  baseVoId: string | undefined,
  narration: HumanNarration,
  band: "shadow" | "balanced" | "warm",
): string | undefined {
  if (!baseVoId) return undefined;
  if (typeof narration === "string") return baseVoId;
  return `${baseVoId}.${band}`;
}

/** Convenience: resolve a HumanReaction down to a flat playback
 *  payload (text + voId) for the player-facing strip. Returns null
 *  when the response has no humanReaction authored. */
export function resolveHumanReaction(
  response: VerbResponse,
  band: "shadow" | "balanced" | "warm",
): { text: string; voId?: string; logsClue?: Clue; setsFlag?: string } | null {
  if (!response.humanReaction) return null;
  return {
    text: resolveHumanBandedNarration(response.humanReaction.narration, band),
    voId: resolveBandedHumanVoId(response.humanReaction.voId, response.humanReaction.narration, band),
    logsClue: response.humanReaction.logsClue,
    setsFlag: response.humanReaction.setsFlag,
  };
}
