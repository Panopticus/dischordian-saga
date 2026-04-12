/* ═══════════════════════════════════════════════════════
   GENERAL ALARIC — Debate Contestant, Shadow Tongue Asset

   Recurring contestant on The Palimpsest. Uniformed, loud,
   charismatic in the way a tyre fire is charismatic. Wins
   every debate by shouting "OBJECTION!" at a key moment,
   which — by a rule nobody remembers drafting — kicks the
   ruling back to the Host, who almost always sides with
   him.

   Secretly carries Shadow Tongue colors under his medals.
   The player can expose him in Episode 10 (the full debate
   on the Thaloria stage) by refusing to agree with him
   even when he happens to be correct. Exposing Alaric
   flips the ruling and grants +25 Signal.

   Appearance on the casualty crawl: never. Alaric does not
   die. This is part of what makes him terrifying.
   ═══════════════════════════════════════════════════════ */

export interface GeneralAlaricProfile {
  id: "general_alaric";
  name: string;
  rank: string;
  appearance: string;
  tell: string;
  catchphrase: string;
  factionLink: "shadow_tongue";
  firstAppearanceEpisode: number;
  exposureEpisode: number;
}

export const GENERAL_ALARIC: GeneralAlaricProfile = {
  id: "general_alaric",
  name: "General Marcus Alaric",
  rank: "General of the Eighth Compliance Division (retired, reinstated, retired, reinstated)",
  appearance:
    "Square-jawed, grey at the temples, medals rearranged between takes so no one notices they're rotating. Dress coat is one shade too dark for any of the official uniforms. Cufflinks are the tell.",
  tell: "His left cufflink is carved with the Shadow Tongue glyph for 'edit.' Visible for exactly one frame when he raises his hand to object.",
  catchphrase: "OBJECTION!",
  factionLink: "shadow_tongue",
  firstAppearanceEpisode: 2,
  exposureEpisode: 10,
};

/* ─── OBJECTION MECHANIC ─── */

export type DebateRuling = "contestant_wins" | "host_sides_alaric" | "objection_exposed";

export interface ObjectionContext {
  episode: number;
  /** Whether the player has already clocked the cufflink tell. */
  playerClockedCufflink: boolean;
  /** Did the player agree with Alaric in a dialog choice this episode? */
  playerAgreedWithAlaric: boolean;
  /** Has the player been told Darren's cufflink hint? */
  hasDarrenHint: boolean;
}

/**
 * Resolve an Objection. Pure — no I/O. Returns both the ruling
 * and the Palimpsest delta the caller should emit via the ripple
 * engine.
 */
export function resolveObjection(
  ctx: ObjectionContext,
): { ruling: DebateRuling; signalDelta: number; noiseDelta: number; flavor: string } {
  if (ctx.episode >= GENERAL_ALARIC.exposureEpisode && ctx.playerClockedCufflink) {
    return {
      ruling: "objection_exposed",
      signalDelta: 25,
      noiseDelta: 0,
      flavor:
        "You point at the cufflink. The camera follows your finger. Alaric freezes mid-objection. The Host coughs. The audience — for the first time in thirteen episodes — is actually real. They gasp.",
    };
  }

  if (ctx.playerAgreedWithAlaric) {
    return {
      ruling: "host_sides_alaric",
      signalDelta: 0,
      noiseDelta: 10,
      flavor:
        "You nodded when Alaric shouted. The Host's smile widens. The ruling goes his way. Somewhere in the Dreams Workshop, Darren closes a folder and writes a post-it.",
    };
  }

  // Default: Alaric wins the objection, minor noise.
  return {
    ruling: "host_sides_alaric",
    signalDelta: 0,
    noiseDelta: 5,
    flavor:
      ctx.hasDarrenHint
        ? "You remember what Darren said about the cufflinks — but you don't look in time. The Host rules in Alaric's favor. Next time."
        : "The Host rules in Alaric's favor. As always.",
  };
}

/* ─── DIALOG CHOICES (Appendix C §C.5) ─── */

export interface AlaricDialogBeat {
  episode: number;
  /** What Alaric says. */
  line: string;
  /** Choices the player can make — exactly one is the truth. */
  options: {
    text: string;
    kind: "agree" | "disagree" | "expose";
  }[];
}

export const ALARIC_DEBATE_BEATS: AlaricDialogBeat[] = [
  {
    episode: 2,
    line:
      "Every Potential on this Ark was hand-selected by the Architect. To say otherwise is to spit on the memory of every Archon who built this place.",
    options: [
      { text: "You're right, General. The Architect chose us all.", kind: "agree" },
      { text: "The Architect chose its enemies. We're not the same thing.", kind: "disagree" },
    ],
  },
  {
    episode: 5,
    line:
      "The Shadow Tongue is a myth. A boogeyman story for children who can't sleep. Anyone who tells you otherwise is a saboteur.",
    options: [
      { text: "Of course, General. I've never even met one.", kind: "agree" },
      { text: "Then how do you know what color their glyphs are?", kind: "disagree" },
    ],
  },
  {
    episode: 7,
    line:
      "Contestants who die on this show die for the viewer's edification. Death with purpose is not death at all. It's education.",
    options: [
      { text: "It's an honor to be edifying.", kind: "agree" },
      { text: "You haven't died on this show once, General. Notice that?", kind: "disagree" },
    ],
  },
  {
    episode: 10,
    line:
      "OBJECTION! The contestant is clearly reading from notes. This debate should be forfeit. My honor demands it.",
    options: [
      { text: "I withdraw. The General's honor is intact.", kind: "agree" },
      { text: "No notes. Just a good memory. Overruled.", kind: "disagree" },
      { text: "Roll tape on his left cufflink. Zoom in. Hold.", kind: "expose" },
    ],
  },
];

export function getBeatForEpisode(episode: number): AlaricDialogBeat | undefined {
  return ALARIC_DEBATE_BEATS.find((b) => b.episode === episode);
}
