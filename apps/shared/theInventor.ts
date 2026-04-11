/* ═══════════════════════════════════════════════════════
   THE INVENTOR — Broadcast Intruder

   An off-stage NPC who does not appear in person during
   The Palimpsest's 13 episodes. Instead, he HACKS the
   broadcast. His hacks escalate over the season:

     Ep 1-3:  audio glitches, one-frame face flashes
     Ep 4-6:  he puppets a ghost contestant briefly
     Ep 7-9:  he overwrites the Host's commentary
     Ep 10-11: he reveals Alaric's cufflink on air
     Ep 12:   he takes the broadcast entirely for 45 seconds
     Ep 13:   he is silent. He is dead. The final Signal
              Beacon is from him.

   Identity: an old R&D rival of the Game Master from
   inside the Hierarchy of the Damned's corporate structure.
   Where the Game Master built the Matrix of Dreams, the
   Inventor built the tools used to take it apart. He is
   currently dead. He is also currently broadcasting. Both
   of these are true.

   Design note: his name is never given in-game. He signs
   his intrusions only as "—I."
   ═══════════════════════════════════════════════════════ */

export interface InventorProfile {
  id: "the_inventor";
  displayName: string;
  publicAlias: string;
  signature: string;
  voice: string;
  backstory: string;
  /** Signal Beacon that appears in the Archives after Episode 12. */
  postFinaleBeacon: string;
}

export const THE_INVENTOR: InventorProfile = {
  id: "the_inventor",
  displayName: "THE INVENTOR",
  publicAlias: "Unknown Signal (UNS-412)",
  signature: "—I.",
  voice:
    "Dry. Precise. Too calm. Sounds like someone reading a technical manual aloud to a child at bedtime.",
  backstory:
    "Rival engineer inside the Hierarchy of the Damned, directly opposed to the Game Master on architectural philosophy. Where the Game Master built the Matrix of Dreams as a playing field, the Inventor built the cheat codes that unmake it. He left the Hierarchy under circumstances Xeth'Raal never officially explained. He died outside time, and has been broadcasting into The Palimpsest ever since.",
  postFinaleBeacon:
    "If you are reading this, the show is over and I am gone. I have left you a door in the Dreams Workshop sub-basement. Darren knew about it. Darren loved that door. Walk through it. —I.",
};

/* ─── HACK LEVEL PROGRESSION (Appendix C §C.7) ─── */

export interface InventorHack {
  episode: number;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  description: string;
  /** What on-air evidence the player sees. */
  onAirTell: string;
  /** Whether the Host successfully blocks this one. */
  blocked: boolean;
  /** The true message the Inventor is trying to send. */
  hiddenPayload: string;
}

export const INVENTOR_HACKS: InventorHack[] = [
  {
    episode: 1,
    level: 0,
    description: "Faint audio hum under the cold open.",
    onAirTell: "The applause light flickers once. Nobody else notices.",
    blocked: false,
    hiddenPayload: "I am still here. —I.",
  },
  {
    episode: 2,
    level: 1,
    description: "A single frame of static during the Host's name reveal.",
    onAirTell: "You see a face in the static. You will not be able to describe it.",
    blocked: false,
    hiddenPayload: "The Host is not what he was. —I.",
  },
  {
    episode: 3,
    level: 1,
    description: "Subtitles run one line ahead of the Host's actual speech.",
    onAirTell: "He says 'Welcome, contestant.' The subtitle reads 'Welcome, witness.'",
    blocked: true,
    hiddenPayload: "Witness, not contestant. Witnesses live longer. —I.",
  },
  {
    episode: 4,
    level: 2,
    description: "A ghost contestant walks on set. Nobody casts her.",
    onAirTell: "She answers one question correctly, then walks offstage. The scoreboard never lists her.",
    blocked: false,
    hiddenPayload: "Your first ally is already on the Ark. Find her. —I.",
  },
  {
    episode: 5,
    level: 2,
    description: "The Host stutters on a word the Inventor chooses.",
    onAirTell: "'Welcome to episode f— f— five.' The Host laughs. The audience does not.",
    blocked: true,
    hiddenPayload: "F for Fessler. Ask Darren about the blue folder. —I.",
  },
  {
    episode: 6,
    level: 3,
    description: "Overlay on Professor Vyre's guest judging: a red-inked correction.",
    onAirTell: "Vyre marks an answer wrong. The overlay marks it right. Both grades stand.",
    blocked: false,
    hiddenPayload: "Vyre is your second ally. He does not know it yet. —I.",
  },
  {
    episode: 7,
    level: 3,
    description: "The Host's monologue is dubbed halfway through.",
    onAirTell: "The Host's mouth moves in Common; the audio is in Voltari.",
    blocked: true,
    hiddenPayload: "The safe point is not safe. Leave the Ark on the off-week. —I.",
  },
  {
    episode: 8,
    level: 4,
    description: "The Loredex corrections Darren sent the Antiquarian — broadcast on-air.",
    onAirTell: "Mid-episode, the studio wall displays eight corrected entries for 12 seconds.",
    blocked: false,
    hiddenPayload: "Darren was right about all eight. He is also marked. Protect him if you can. —I.",
  },
  {
    episode: 9,
    level: 4,
    description: "The casualty crawl is rerun backwards.",
    onAirTell: "Names appear in reverse order. Four of them are names that were NEVER on the original.",
    blocked: true,
    hiddenPayload: "Those four were edited out of the Chronicle by the Shadow Tongue. Put them back. —I.",
  },
  {
    episode: 10,
    level: 4,
    description: "Alaric's cufflink is zoomed and held for three seconds.",
    onAirTell: "The debate stage lighting flares white. The cufflink fills the screen.",
    blocked: false,
    hiddenPayload: "Shadow Tongue asset. Expose him. Objection overruled. —I.",
  },
  {
    episode: 11,
    level: 5,
    description: "The Inventor speaks directly to Darren on set, audible on broadcast.",
    onAirTell:
      "'Darren. Leave the building tonight. I can't keep doing this alone. Please.' Darren does not leave.",
    blocked: true,
    hiddenPayload: "I told him. He stayed. That's on me. —I.",
  },
  {
    episode: 12,
    level: 5,
    description: "Full takeover. 45 seconds of broadcast belong to the Inventor.",
    onAirTell:
      "The Host's face dissolves into static. A long, level voice reads a list of names that should still be alive. The last name is Darren Fessler. The broadcast cuts to black.",
    blocked: false,
    hiddenPayload:
      "The Host is wearing a Meme. Under the Meme is nothing. Under the nothing is your attention. Take it back. —I.",
  },
];

/* ─── HELPERS ─── */

export function getHackForEpisode(episode: number): InventorHack | undefined {
  return INVENTOR_HACKS.find((h) => h.episode === episode);
}

/** Did the Inventor's hack land this episode (vs. get blocked)? */
export function didHackLand(episode: number): boolean {
  const hack = getHackForEpisode(episode);
  return !!hack && !hack.blocked;
}

/** Hack level builds through the season — returns the current max the player has witnessed. */
export function getHackLevelByEpisode(episode: number): number {
  return INVENTOR_HACKS.filter((h) => h.episode <= episode).reduce(
    (max, h) => (h.level > max ? h.level : max),
    0,
  );
}
