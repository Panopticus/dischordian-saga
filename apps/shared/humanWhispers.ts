/* ═══════════════════════════════════════════════════════
   HUMAN WHISPERS — pre-Beat-H ambient fragments

   The Human's frame-line on the Reveal video (Video 4 /
   `human_life_reveal` in humanLifeVideoSequence.ts) says:
   "You've spent twelve hours being mentored by me."
   For that line to land, the player has to have actually
   heard him pre-Beat-H — not as the Detective (full
   sentences, first person, room-by-room commentary) but
   as ambient fragments leaking through.

   Whispers are the four-era surface BEFORE he is one
   voice. They distribute across:
     - Era 1 (Mascoteer / kid at Project Celebration)
     - Era 2 (Mechronis Academy / Watcher's Eye spy)
     - Era 3 (Authority Detective in New Babylon)
     - Era 4 (the Wall — the imprisoned Archon)

   Voice register:
     - No first person. The Human is not himself yet.
     - Fragment grammar. Trailing or leading ellipses.
     - Lowercase except proper nouns.
     - One half-thought per whisper.

   Lifecycle:
     - Whispers fire pre-Beat-H only. Once
       `human_life_detective_seen` flips, the Detective
       takes over from detectiveCommentary.ts and whispers
       go silent for the rest of the run.
     - Each whisper has a stable id and is deduped against
       a per-session `seenWhispers` set so a whisper plays
       at most once per session.

   Pure module. No React. No server imports.
   ═══════════════════════════════════════════════════════ */

import type { RoomId } from "./detectiveCommentary";

/** The four life-eras the Human will collapse into at Beat H. */
export type WhisperEra = "celebration" | "mechronis" | "detective" | "wall";

export interface HumanWhisper {
  /** Stable id used for VO manifest + parity checks. */
  id: string;
  /** Which life-era this fragment leaks from. */
  era: WhisperEra;
  /** Snake_case RoomId from detectiveCommentary.ts. Whisper fires
   *  when the player enters this room pre-Beat-H. The reserved
   *  sentinel "any_room" means the whisper has no room gate and
   *  can fire on any pre-Beat-H room entry — used sparingly for
   *  Era-4 fragments that feel like static across everything. */
  roomId: RoomId | "any_room";
  /** Fragment text. Strict register: no standalone "i" / "I", no
   *  first-person verbs, no warmth band. The humanWhispers test
   *  enforces this. */
  text: string;
  /** Optional hotspotId — if set, whisper only fires when the
   *  player has examined this hotspot. Kebab-case to match the
   *  room mystery modules' hotspot ids. */
  hotspotId?: string;
  /** Flag the whisper requires to be set before it can fire.
   *  Defaults to undefined (always eligible pre-Beat-H). Used
   *  for Era-4 "post-act-3-arrival" pacing fragments. */
  requiresFlag?: string;
  /** Manifest VO id. */
  voId: string;
}

/** The whisper surface is small on purpose — it should feel like
 *  static, not a system. ~16 fragments total, weighted toward
 *  Era 1 / 2 / 3 with a handful of Era-4 leaks. */
export const HUMAN_WHISPERS: ReadonlyArray<HumanWhisper> = [
  /* ─── Era 1 — Project Celebration (Mascoteer kid) ─── */
  {
    id: "whisper.celebration.cargo_hold.seventh_entry",
    era: "celebration",
    roomId: "cargo_hold",
    text: "…the seventh entry… always the seventh…",
    voId: "whisper.celebration.cargo_hold.seventh_entry",
  },
  {
    id: "whisper.celebration.chaos_forge.wandas_hands",
    era: "celebration",
    roomId: "chaos_forge",
    text: "…wanda's hands. wanda's hands. she did that even then…",
    voId: "whisper.celebration.chaos_forge.wandas_hands",
  },
  {
    id: "whisper.celebration.order_tribunal.mascoteers_named",
    era: "celebration",
    roomId: "order_tribunal",
    hotspotId: "judges-bench",
    text: "…we called it the mascoteers. she said the name was bad. we kept it…",
    voId: "whisper.celebration.order_tribunal.mascoteers_named",
  },
  {
    id: "whisper.celebration.social_hub.four_chairs",
    era: "celebration",
    roomId: "social_hub",
    hotspotId: "mess-table",
    text: "…four chairs at one table once. four. four kids. four…",
    voId: "whisper.celebration.social_hub.four_chairs",
  },

  /* ─── Era 2 — Mechronis Academy (Watcher's Eye spy) ─── */
  {
    id: "whisper.mechronis.cipher_den.rule_three",
    era: "mechronis",
    roomId: "cipher_den",
    text: "…rule three. always rule three. never trust the dispatcher…",
    voId: "whisper.mechronis.cipher_den.rule_three",
  },
  {
    id: "whisper.mechronis.shadow_vault.senator",
    era: "mechronis",
    roomId: "shadow_vault",
    text: "…senator. senator. senator. she asked the wrong question…",
    voId: "whisper.mechronis.shadow_vault.senator",
  },
  {
    id: "whisper.mechronis.shadow_vault.academy_vanish",
    era: "mechronis",
    roomId: "shadow_vault",
    hotspotId: "manuscript-pile",
    text: "…the academy taught us to vanish. the academy taught them to vanish too. only one of us came back…",
    voId: "whisper.mechronis.shadow_vault.academy_vanish",
  },
  {
    id: "whisper.mechronis.archives.f_seven",
    era: "mechronis",
    roomId: "archives",
    text: "…f-seven. that was the code. f-seven. forgotten by everyone but the file…",
    voId: "whisper.mechronis.archives.f_seven",
  },
  {
    id: "whisper.mechronis.engineering.engineer_workshop",
    era: "mechronis",
    roomId: "engineering",
    text: "…the engineer had a workshop. it was watched. by someone the engineer trusted…",
    voId: "whisper.mechronis.engineering.engineer_workshop",
  },

  /* ─── Era 3 — Authority Detective (New Babylon) ─── */
  {
    id: "whisper.detective.order_tribunal.same_seal",
    era: "detective",
    roomId: "order_tribunal",
    text: "…the seal. the new babylon seal. the same shape as the kid one…",
    voId: "whisper.detective.order_tribunal.same_seal",
  },
  {
    id: "whisper.detective.order_tribunal.vernon_slow",
    era: "detective",
    roomId: "order_tribunal",
    text: "…vernon was the slow one. they said the kid was the slow one. neither of them was slow…",
    voId: "whisper.detective.order_tribunal.vernon_slow",
  },
  {
    id: "whisper.detective.order_tribunal.wayne_audit",
    era: "detective",
    roomId: "order_tribunal",
    hotspotId: "mol-vereth-audit-ledger",
    text: "…wayne would have caught it. he never missed an audit. why didn't he…",
    voId: "whisper.detective.order_tribunal.wayne_audit",
  },
  {
    id: "whisper.detective.war_room.promoted_for_it",
    era: "detective",
    roomId: "war_room",
    text: "…promoted for it. promoted. promoted. the word still doesn't sit right…",
    voId: "whisper.detective.war_room.promoted_for_it",
  },
  {
    id: "whisper.detective.observation_deck.new_babylon",
    era: "detective",
    roomId: "observation_deck",
    text: "…new babylon at night. new babylon at night. the lights are the same lights. somebody promoted the lights too…",
    voId: "whisper.detective.observation_deck.new_babylon",
  },

  /* ─── Era 4 — the Wall (collapsed / imprisoned Archon) ─── */
  {
    id: "whisper.wall.any.not_the_voice",
    era: "wall",
    roomId: "any_room",
    text: "…not the voice. not yet. the voice comes later…",
    voId: "whisper.wall.any.not_the_voice",
  },
  {
    id: "whisper.wall.any.four_lives",
    era: "wall",
    roomId: "any_room",
    requiresFlag: "act_3_complete",
    text: "…four. always four. four selves four videos four lives…",
    voId: "whisper.wall.any.four_lives",
  },
] as const;

/** Predicate the runtime uses to decide whether the whisper
 *  surface is still active. Mirrors humanLifeVideoSequence.ts
 *  but kept here to avoid a circular import from the room
 *  overlay component side. The runtime should pass
 *  flags.has("human_life_detective_seen") into this rather
 *  than the full humanLifeSequenceComplete predicate — the
 *  Detective video at Beat H is the surface's gravestone, not
 *  the Reveal video. After Detective, full-sentence Detective
 *  commentary takes over. */
export function whispersStillActive(detectiveSeen: boolean): boolean {
  return !detectiveSeen;
}

/** Pick the next whisper for the given room, if any. Returns
 *  null when:
 *    - the whisper surface is closed (detectiveSeen=true)
 *    - no whisper matches the room
 *    - every matching whisper has already played this session
 *    - the matching whisper's hotspot gate is unmet
 *    - the matching whisper's requiresFlag is unmet
 *
 *  Order: room-specific whispers first (by declaration order
 *  in HUMAN_WHISPERS), then any_room fallbacks. Deterministic
 *  by id — does not randomize, so test fixtures are stable. */
export function pendingWhisper(
  roomId: RoomId,
  examinedHotspots: ReadonlySet<string>,
  seenWhispers: ReadonlySet<string>,
  flags: ReadonlySet<string>,
  detectiveSeen: boolean,
): HumanWhisper | null {
  if (!whispersStillActive(detectiveSeen)) return null;

  for (const w of HUMAN_WHISPERS) {
    if (seenWhispers.has(w.id)) continue;
    if (w.roomId !== "any_room" && w.roomId !== roomId) continue;
    if (w.hotspotId && !examinedHotspots.has(w.hotspotId)) continue;
    if (w.requiresFlag && !flags.has(w.requiresFlag)) continue;
    return w;
  }
  return null;
}

/** Count whispers per era. Used by the parity check + tests
 *  to assert the surface stays distributed across all four
 *  eras. */
export function whisperEraDistribution(): Record<WhisperEra, number> {
  const out: Record<WhisperEra, number> = {
    celebration: 0,
    mechronis: 0,
    detective: 0,
    wall: 0,
  };
  for (const w of HUMAN_WHISPERS) out[w.era]++;
  return out;
}

/** Sentinel — guard against the surface drifting to "Detective
 *  era only" (which would defeat the whole point: the four-life
 *  collapse needs four lives present pre-Beat-H). The parity
 *  check asserts every era has at least one whisper. */
export const WHISPER_ERAS_REQUIRED: ReadonlyArray<WhisperEra> = [
  "celebration",
  "mechronis",
  "detective",
  "wall",
];
