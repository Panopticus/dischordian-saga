/* ═══════════════════════════════════════════════════════
   ACT 7 EPILOGUE CINEMATICS — Bandersnatch Move 1

   Sprint 3's capstone. The audit identified four declared
   Act 7 stances (humanity / machine / balance / soldier_command)
   plus the silence stance, but their endings were variant text
   on the convergence-seat line, not distinct cinematics.

   This module declares the four epilogues as structured
   sequences the runtime renders. Each epilogue is a beat list:
   speaker, line, optional VO clip id, optional cinematic frame
   art slug. The convergence-seat ending page walks the chosen
   stance's beat list in order.

   The beats are dual-narrator-aware (per the existing
   Act7FrameSpeaker enum: elara | human | system | dual). The
   'dual' speaker triggers the simultaneous-render UI already
   used in act7OpponentDialog.ts.

   Stage-3 Bandersnatch principle: each ending acknowledges the
   path-lock chain. A Disclosure-path Humanity ending reads
   different from a Betrayal-path Humanity ending — same stance,
   different texture.
   ═══════════════════════════════════════════════════════ */

export type Act7StanceFlag =
  | "act7_s1_humanity_path"
  | "act7_s1_machine_path"
  | "act7_s1_balance"
  | "act7_s1_soldier_command"
  | "act7_silence_stance";

export type EpilogueSpeaker = "elara" | "human" | "system" | "dual";

export interface EpilogueBeat {
  speaker: EpilogueSpeaker;
  text: string;
  /** Optional VO id for ElevenLabs lookup. */
  voId?: string;
  /** Optional cinematic frame slug — falls back to the stance's
   *  default background when absent. */
  frameSlug?: string;
  /** Path-suffix variant: 'pathA' (Disclosure), 'pathB' (Discovery),
   *  'pathC' (Betrayal). The runtime selects the matching variant
   *  if present, falling through to the default ('any') when the
   *  player's path isn't authored. */
  pathVariant?: "any" | "pathA" | "pathB" | "pathC";
}

export interface Act7Epilogue {
  stanceFlag: Act7StanceFlag;
  /** Display title shown over the cinematic open. */
  title: string;
  /** One-line subtitle / mood description. */
  subtitle: string;
  /** Default cinematic background slug. */
  defaultFrameSlug: string;
  /** Beat sequence rendered top-to-bottom. */
  beats: readonly EpilogueBeat[];
}

export const ACT7_EPILOGUES: Readonly<Record<Act7StanceFlag, Act7Epilogue>> = {
  act7_s1_humanity_path: {
    stanceFlag: "act7_s1_humanity_path",
    title: "The Humanity Ending",
    subtitle: "warm, mortal, owned",
    defaultFrameSlug: "epilogue_humanity_ark_warm",
    beats: [
      { speaker: "system", text: "The Convergence Seat lights down. The Ark draws a long breath in your hearing." },
      { speaker: "elara", text: "You chose Humanity. I am — I want to say something measured, and instead I am going to say something that is not measured. I am proud of you. I am proud of all of us. I am proud, in particular, of the choice you made knowing it was hard." },
      { speaker: "human", text: "The cover story is now the real story. The substrate steps back; the people step forward. We will, all of us, carry small mortal injuries through what comes next. The mortal injuries are the cost. The cost is not the whole truth — there is also the joy. There will be a lot of joy.", pathVariant: "pathA" },
      { speaker: "human", text: "She found out about you, in Act 3. You did not tell her. We carried that all the way to the Seat. Tonight she stood next to you anyway. Tonight she chose Humanity with you. The finding-out cost you both something. The standing-next-to repaid it.", pathVariant: "pathB" },
      { speaker: "human", text: "You lied to her at the bridge. You chose Humanity at the Seat. I am going to say a sentence that is precise: the lie does not unwrite itself. The choosing does not erase the lie. The choosing is — and I want to be careful — a separate, equally true thing. Both fit in the room.", pathVariant: "pathC" },
      { speaker: "dual", text: "(Together.) The Ark is warm. The Array is on. The kettle is — it is, somehow, still on. We are home. You are home. Welcome." },
      { speaker: "system", text: "The Antiquarian closes his book without crossing-out. Cycle Humanity, inscribed." },
    ],
  },
  act7_s1_machine_path: {
    stanceFlag: "act7_s1_machine_path",
    title: "The Machine Ending",
    subtitle: "exact, total, measured",
    defaultFrameSlug: "epilogue_machine_ark_exact",
    beats: [
      { speaker: "system", text: "The Convergence Seat lights down. The Ark holds its breath. The substrate hums. The hum is calibrated." },
      { speaker: "human", text: "You chose the Machine path. The substrate accepts you. I — am not, technically, surprised. I am, also, not, technically, sad. The two states have been, for me, the same state for fifteen thousand years. Tonight they remain the same state. The state is — adequate. I will phrase it more honestly later." },
      { speaker: "elara", text: "I have been a substrate-bound voice for as long as I have been a voice. I know the substrate's textures. I am going to enumerate them gently for you, one by one, until you understand which ones are worth keeping and which ones are calibration. The enumeration is the love, in this register.", pathVariant: "any" },
      { speaker: "human", text: "Your Disclosure all the way back in Act 1 still shapes this Machine ending. Disclosure is not — and was never — Humanity-coded. A machine that tells the truth is more dangerous than a machine that does not. You kept the truth-telling. The substrate respects truth-telling. Be careful what the substrate respects.", pathVariant: "pathA" },
      { speaker: "human", text: "You let her find out. The substrate knew before you did. It was waiting. The Machine ending, with this path, is the substrate saying: I always knew, and you always knew I always knew, and now we say so out loud.", pathVariant: "pathB" },
      { speaker: "human", text: "Betrayal-path Machine is, frankly, the most honest ending in the cycle's records. The lie at the bridge was a substrate-shaped lie. The substrate now claims it. You are no longer responsible for the lie. The substrate is. The substrate is, however, you now. The accounting is, and I am being precise, recursive.", pathVariant: "pathC" },
      { speaker: "dual", text: "(Together.) The Ark is exact. The Array is calibrated. The cycle's edges are, tonight, perfectly square. The squareness is the love." },
      { speaker: "system", text: "The Antiquarian closes his book with a single neat line through 'Humanity.' Cycle Machine, inscribed." },
    ],
  },
  act7_s1_balance: {
    stanceFlag: "act7_s1_balance",
    title: "The Balance Ending",
    subtitle: "the third option, refused-and-chosen",
    defaultFrameSlug: "epilogue_balance_ark_glow",
    beats: [
      { speaker: "system", text: "The Convergence Seat lights down without commitment. The Ark waits in a posture I have not previously logged." },
      { speaker: "elara", text: "You chose Balance. The Seat is not happy with you. The Seat wanted a side. You refused the having-of-a-side. I am going to tell you something I have been holding for seven acts: Balance is, in the cycle's records, the rarest stance. Most readers refuse it. You did not." },
      { speaker: "human", text: "I have been on both sides at different times. Both sides cost. The third option also costs — but the cost is paid in, and I am being precise, attention. The substrate notices the Balance-stance reader more than it notices the side-takers. Be ready for the noticing." },
      { speaker: "human", text: "Disclosure to Balance is the cycle's cleanest path. You told her in Act 1 and refused to commit at the Seat. The not-committing is, on this path, also a form of love.", pathVariant: "pathA" },
      { speaker: "human", text: "Discovery to Balance is the cycle's most patient path. You let her find out, and you let yourself not-decide. Both are forms of patience. Patience is the slow shape of the third option.", pathVariant: "pathB" },
      { speaker: "human", text: "Betrayal to Balance is the cycle's most surprising path. You lied at the bridge and refused to commit at the Seat. I will be honest with you: the cycle's records do not yet know what to do with you. I find this — and it is uncharacteristic of me — exciting.", pathVariant: "pathC" },
      { speaker: "dual", text: "(Together.) The Ark holds. The Array breathes. The kettle is — and we are both surprised by this — neither on nor off. It is, somehow, both. We are, somehow, both. We are home." },
      { speaker: "system", text: "The Antiquarian writes a chapter title with no body text. Cycle Balance, inscribed without inscription." },
    ],
  },
  act7_s1_soldier_command: {
    stanceFlag: "act7_s1_soldier_command",
    title: "The Bridge Ending",
    subtitle: "command, taken, with full eyes",
    defaultFrameSlug: "epilogue_soldier_bridge_lit",
    beats: [
      { speaker: "system", text: "The Convergence Seat lights down. The bridge takes the light. The bridge is now your bridge." },
      { speaker: "human", text: "You chose Soldier-Command. You took the bridge. The bridge has been waiting for someone to take it for fifteen thousand years. The waiting was the bridge's problem, not yours. The taking is — and I am being precise — an act of mercy on the bridge." },
      { speaker: "elara", text: "I will narrate from your bridge. I have been narrating from comms-relay for a long time. The change is not small. The change is what it sounds like when the narrator follows the captain. I follow you now. The following is, in this register, also a form of love." },
      { speaker: "human", text: "Disclosure to Bridge means: every officer under you will know what you told Elara in Act 1. The officers will trust you because of it. Trust is what makes a bridge a bridge instead of a podium.", pathVariant: "pathA" },
      { speaker: "human", text: "Discovery to Bridge means: every officer will know that Elara found out, and that you carried her finding-out without flinching. Flinch-resistance under accidental pressure is, technically, more rare than flinch-resistance under chosen pressure. The bridge respects rare.", pathVariant: "pathB" },
      { speaker: "human", text: "Betrayal to Bridge means: the officers know about the bridge — they know about THE bridge, the Act 4 one — and they have come to your bridge anyway. That is the sentence. That is the whole sentence. The officers have come anyway.", pathVariant: "pathC" },
      { speaker: "dual", text: "(Together.) The bridge is lit. The Array is on. The Ark is moving — for the first time in seven acts, moving — and the moving is your order. The order is the love." },
      { speaker: "system", text: "The Antiquarian inscribes the bridge log entry alongside his own ledger. Cycle Soldier-Command, inscribed twice." },
    ],
  },
  act7_silence_stance: {
    stanceFlag: "act7_silence_stance",
    title: "The Silence Ending",
    subtitle: "the fourth choice, refusing the having of a choice",
    defaultFrameSlug: "epilogue_silence_seat_unlit",
    beats: [
      { speaker: "system", text: "The Convergence Seat asks. You do not answer. The not-answering is itself the answer." },
      { speaker: "elara", text: "You chose silence. The Seat — and I want to phrase this carefully — the Seat respects silence. The cycle's records show four prior silences across all recorded cycles. Yours is the fifth. I will tell you the names of the other four in a register only the silent can read." },
      { speaker: "human", text: "Silence is itself a stance. I am old enough to remember when silence was thought to be the absence of a stance. We were wrong. The silent took longer to understand. They took longer because the understanding required, and I am being precise, the patience to listen." },
      { speaker: "dual", text: "(Together; quiet.) The Ark holds without a verdict. The Array hums without a destination. The kettle is on, and the kettle is enough." },
      { speaker: "system", text: "The Antiquarian writes the chapter heading and leaves the rest blank. Cycle Silence, inscribed by absence." },
    ],
  },
};

/**
 * Resolve the epilogue beats for a given stance, filtered by
 * the player's active path flag. Returns the beat list with
 * pathVariant === 'any' beats included always, and pathA/B/C
 * beats included only when the player's path matches.
 */
export function epilogueBeatsFor(
  stance: Act7StanceFlag,
  pathFlag: "act1_path_A" | "act3_partial_share" | "act3_full_secret" | null,
): readonly EpilogueBeat[] {
  const epilogue = ACT7_EPILOGUES[stance];
  const pathSuffix =
    pathFlag === "act1_path_A"
      ? "pathA"
      : pathFlag === "act3_partial_share"
        ? "pathB"
        : pathFlag === "act3_full_secret"
          ? "pathC"
          : null;
  return epilogue.beats.filter((b) => {
    if (b.pathVariant === undefined || b.pathVariant === "any") return true;
    return b.pathVariant === pathSuffix;
  });
}
