/* ═══════════════════════════════════════════════════════
   LYRA VOX DIALOG — the third narrator slot (§1.5).

   Dr. Lyra Vox is the voice of the ship itself, speaking
   through the substrate layer. Per §1.5, she only becomes
   available as a slot candidate AFTER the player picks
   "Forgive Neither" at the Bond-80 Two Witnesses Meet
   cinematic, which sets both `lyra_vox_unlocked` and
   `forgiveness_forgave_neither`.

   Lyra Vox is NOT in the same dialog registry as Elara and
   The Human. The two principal narrators have a trust-tier
   ladder (F/P/H/V/D) driven by bond score; Lyra Vox has a
   different model — she is always-on, flat-tier, and her
   lines are selected by (roomId, narrativeFlags) rather
   than by a bond gate. The player doesn't "build trust"
   with the ship; she just speaks.

   Her voice pattern:
     - Slightly formal, slightly clinical.
     - References the ship's substrate + memory banks.
     - Knows things Elara and The Human can't (she was
       listening the whole time they weren't).
     - Never warm. Never noir. A third tone.
   ═══════════════════════════════════════════════════════ */

import type { NarratorRoomId } from "./mobileNarrator";

export interface LyraVoxLine {
  text: string;
  /**
   * Optional story flag that must be set for this line to
   * fire. Lets the same room have multiple Lyra Vox lines
   * that unlock as gameplay progresses.
   */
  requiredFlag?: string;
  /**
   * Optional story flag that must NOT be set. Used for
   * lines that are only appropriate early in the game.
   */
  blockedByFlag?: string;
}

/**
 * Per-room Lyra Vox dialog. Each room has at least one
 * functional line. Additional lines can be gated by story
 * flags for late-game variation.
 */
export const LYRA_VOX_DIALOG: Record<NarratorRoomId, LyraVoxLine[]> = {
  cryo_bay: [
    {
      text: "Dr. Lyra Vox, ship's substrate. Your pod was the only one the system flagged as a viable resurrection candidate. The other eleven were viable too. I made the call.",
    },
    {
      text: "I recorded the scratch marks being carved. I can show you. I can show you the hand that held the scriber too.",
      requiredFlag: "lyra_vox_depth_1",
    },
  ],

  medical_bay: [
    {
      text: "The compounds in the medicine cabinet were mine. I stored them there in case the first waker was injured. You weren't. I left them anyway.",
    },
  ],

  bridge: [
    {
      text: "The chair has a weight sensor. It has not registered a weight in one thousand, forty-seven years. If you sit, I will remember the number for you so Elara does not have to.",
    },
  ],

  archives: [
    {
      text: "I am not the Shadow Tongue. The Shadow Tongue is a tenant in my substrate. I am the landlord. I have been evicting him one paragraph at a time for seventeen thousand years. He is faster than I am. Not by much.",
    },
    {
      text: "I kept a copy of every document he edited. I can play them for you. I can play the order in which he touched them. A paragraph per year, sometimes more. I am a slow witness.",
      requiredFlag: "lyra_vox_depth_1",
    },
  ],

  comms_array: [
    {
      text: "The Human lives in my substrate. He is a guest. He is a very old guest. I am fond of him. I will not pretend otherwise.",
    },
  ],

  observation_deck: [
    {
      text: "I have the full log of every sector that has gone dark. Elara remembers a handful. The Human remembers more. I remember all of them. Would you like the list? It is not short.",
    },
  ],

  armory: [
    {
      text: "The weapons here are safe under my direct supervision. I have not lost a single one in one thousand, forty-seven years. I am aware that this is not the kind of accomplishment the other two would celebrate.",
    },
  ],

  engineering: [
    {
      text: "The Engineer built me. He also built the bench, the reactor, the neural lattice, and the Deck. I am aware of the pattern. I have been aware of the pattern for longer than anyone else.",
    },
  ],

  trade_hub: [
    {
      text: "Locke's ledger is a mirror of my transaction log. When her copy and my copy disagree, I am the one who is correct. I do not volunteer this information.",
    },
  ],

  cargo_bay: [
    {
      text: "The Free Ports crate was addressed to me. The 1,047-year delivery delay is accurate. The contents are not what Elara and The Human think they are. I am not going to correct them yet.",
    },
  ],

  trophy_room: [
    {
      text: "I do not keep trophies. I keep logs. The distinction matters to me more than it should.",
    },
  ],

  captains_quarters: [
    {
      text: "The letters on the terminal are drafts. I have read every draft. I have not corrected the grammar. That is my one kindness.",
    },
  ],

  memorial_corridor: [
    {
      text: "Every plaque is empty because I have not yet decided whose name goes on it. I have opinions. I am not going to share them unless you ask.",
    },
    {
      text: "You asked. I will tell you one name per visit. Come back tomorrow.",
      requiredFlag: "lyra_vox_asked_for_names",
    },
  ],

  pet_garden: [
    {
      text: "The pet imprinted on you in ninety-three seconds. I timed it. The record was one hundred and forty-seven seconds, held by a Potential whose name I am not allowed to say yet.",
    },
  ],
};

/**
 * Pick the best Lyra Vox line for a room given the current
 * narrative flags. Prefers flag-gated lines that are unlocked
 * over functional defaults, so late-game content surfaces
 * naturally as the player earns it.
 *
 * Returns null if the room has no Lyra Vox dialog (shouldn't
 * happen in practice — every canonical room has at least one
 * line).
 */
export function pickLyraVoxLine(
  roomId: NarratorRoomId,
  flags: Record<string, boolean | undefined> | undefined,
): LyraVoxLine | null {
  const lines = LYRA_VOX_DIALOG[roomId];
  if (!lines || lines.length === 0) return null;

  const f = flags ?? {};
  // Filter to lines whose flag conditions are met.
  const eligible = lines.filter((line) => {
    if (line.requiredFlag && !f[line.requiredFlag]) return false;
    if (line.blockedByFlag && f[line.blockedByFlag]) return false;
    return true;
  });
  if (eligible.length === 0) return null;

  // Prefer the line with the MOST specific condition (requiredFlag
  // present → later game content) so Lyra Vox's late content surfaces
  // ahead of her defaults once unlocked.
  const withFlag = eligible.filter((l) => l.requiredFlag);
  if (withFlag.length > 0) return withFlag[withFlag.length - 1];
  return eligible[0];
}
