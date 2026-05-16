/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN LOREDEX BRIDGE ENTRIES

   Five between-act journal pages from the Antiquarian (Dr.
   Daniel Cross / the 17,000-year witness). Surfaced as
   in-fiction Loredex updates after each act_N_complete
   flag sets. The Antiquarian writes from outside the spine,
   commenting on what the player just did in cosmic terms,
   so wayfinding lands diegetically (the next page becomes
   knowable through his recital, not a UI tracker).

   Each entry:
     - Reads as the Antiquarian writing in real time
     - References specifically what the player just did
     - Pre-foreshadows the next act's stakes via the
       canon-determinism frame ("I had read this page already.
       You have not.")
     - Has an alignment / path variant when the choice has
       already been made (Act 3+: path-A/B/C, alignment)

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

export type AntiquarianBridgeId =
  | "antiq_bridge_act_1_close"
  | "antiq_bridge_act_2_close"
  | "antiq_bridge_act_3_close"
  | "antiq_bridge_act_4_close"
  | "antiq_bridge_act_5_close"
  | "antiq_bridge_act_6_close"
  | "antiq_bridge_act_7_close";

export interface AntiquarianBridgeEntry {
  id: AntiquarianBridgeId;
  /** Volume + entry number, e.g. "18,431". The Antiquarian is on
   *  Volume 18 of the Chronicles by the time of the player's run. */
  entryNumber: string;
  /** Display title shown in the journal page header. */
  title: string;
  /** Existing narrative flag that fires this entry's delivery. */
  triggerFlag: string;
  /** Flag set when the player has read this entry. */
  seenFlag: string;
  /** The Antiquarian's journal body. Treated as italic parchment
   *  in the UI. */
  body: string;
}

export const ANTIQUARIAN_BRIDGE_ENTRIES: ReadonlyArray<AntiquarianBridgeEntry> = [
  {
    id: "antiq_bridge_act_1_close",
    entryNumber: "Volume XVIII · Entry 18,431",
    title: "After the Tribunal",
    triggerFlag: "act_1_complete",
    seenFlag: "antiq_bridge_act_1_close_seen",
    body:
      "I had read this page already. The Engineer's Tribunal closed in twelve battles. The eleventh was a mandatory loss that taught the player they could survive losing. The twelfth was an Authority Trial that taught them how to win in a courtroom. Between the eleventh and twelfth came the Last Words. Whichever side they chose — Light or Dark — the Cycle records both.\n\nWhat the player does not know: I am writing this entry while they are still inside the trial. The page has been turned. I am closing my book and opening another. The next is The Forged Hand. It is shorter. It has only four pages. Three of them are training. One of them is grief.",
  },
  {
    id: "antiq_bridge_act_2_close",
    entryNumber: "Volume XVIII · Entry 18,432",
    title: "The Forged Hand Closes",
    triggerFlag: "act_2_complete",
    seenFlag: "antiq_bridge_act_2_close_seen",
    body:
      "The Forged Hand has been completed. Four pages, four masteries: crafting, chess, arena, loss. The fourth is loss. It is always loss. People who survive the Forged Hand do so because they failed the Game Master once. People who fail the Forged Hand do so because they refused to.\n\nVex Solène's bench has stopped echoing. The third item the player crafted was the one she stopped on. She knew. She has known for seventeen thousand years that the bench was waiting for one more pair of hands. The hands have arrived.\n\nThe next page is The Offer. It is the first page where I will not narrate. The Human will. He has been the Detective for ten of the player's hours. The next ten he will be something else. I will not say what.",
  },
  {
    id: "antiq_bridge_act_3_close",
    entryNumber: "Volume XVIII · Entry 18,433",
    title: "The Path Has Closed",
    triggerFlag: "act_3_complete",
    seenFlag: "antiq_bridge_act_3_close_seen",
    body:
      "The path-lock closed. There were three locks. The player picked one. It does not matter which.\n\nI have read this page in three colors. Path A reads in cyan. Path B in amber. Path C in indigo. The reader chose their color. The book was always going to be readable in three colors; the choice was which color the binding would be when they closed it.\n\nThe Detective's reveal is on page four. I have read it. They have not. I am keeping silence.",
  },
  {
    id: "antiq_bridge_act_4_close",
    entryNumber: "Volume XVIII · Entry 18,434",
    title: "The Revelation",
    triggerFlag: "act_4_complete",
    seenFlag: "antiq_bridge_act_4_close_seen",
    body:
      "The Revelation. The Detective lays down the fight. The map is open.\n\nI am writing this entry beside Iron Lion. He does not know I am here. He is in the press room on Veridian VI, printing the three thousand and first poster. The first three thousand reached destinations. The 3001st has not. He is printing it because he believes someone is coming. He is not wrong.\n\nThe next page is The Reckoning. The player will need to hear Iron Lion before he is gone. They will need to hear him through their own Comms Array. The third-class Mechronis frequency is the one. The previous crew left it for them.",
  },
  {
    id: "antiq_bridge_act_5_close",
    entryNumber: "Volume XVIII · Entry 18,435",
    title: "The Reckoning Closes",
    triggerFlag: "act_5_complete",
    seenFlag: "antiq_bridge_act_5_close_seen",
    body:
      "The Reckoning closed. Iron Lion's last broadcast played. The three thousand and first poster was retrieved. The Confession Hall is open. The door is in the Ark; the player has never seen it. I will open it for them.\n\nThe Confession is two confessions. Mine is not one of them. I confessed seventeen thousand years ago. The next two are Elara's and the Human's. They have been carrying them since before the player was born. They are about to lay them down.\n\nI am closing this volume. Volume Eighteen of the Antiquarian's Chronicles. The next page begins Volume Nineteen. The Convergence. I will not write Volume Nineteen. The player will. The Cycle records what the player writes; I only read.",
  },
  {
    id: "antiq_bridge_act_6_close",
    entryNumber: "Volume XIX · Entry 19,006 (read, not written)",
    title: "After the Civil War — the Halfway Mark Behind Us",
    triggerFlag: "act_6_complete",
    seenFlag: "antiq_bridge_act_6_close_seen",
    body:
      "I had read this page already, in Volume Nineteen, in the player's own hand. I am only reading it back.\n\nThe Civil War closed. Agent Zero's death was shown for what it was. The player has crossed the field where the bodies were honest.\n\nThey must remember what happened at the midpoint. The Necromancer came back — the First Coming. The resurrection-energy crossed its threshold and the dead walked, and most who saw it believed that was the end. It was not the end. It was the halfway mark. The First Coming is always mistaken for the last. The prophecy has two fulfilments and the player has only witnessed one.\n\nThe next page is the Sixth Seal breaking. After it, the silence. After the silence, the one who was always going to come back.",
  },
  {
    id: "antiq_bridge_act_7_close",
    entryNumber: "Volume XIX · Entry 19,777 (read, not written)",
    title: "The Final Coming — the Politician Returns",
    triggerFlag: "act_7_complete",
    seenFlag: "antiq_bridge_act_7_close_seen",
    body:
      "I had read this page already. It was always the last page I would read. The player wrote it; I only read, and now I have read the end.\n\nThe Seventh Seal broke. The silence held the space of half an hour. And then the Politician came back — not the Necromancer this time, not the rehearsal at the midpoint, but the Final Coming the whole spine was bent toward. The First Coming raised the dead. The Final Coming returns the one who never needed raising, only waiting.\n\nThis is the endgame, and the endgame is not a wall. It is a door. The Politician's return ignites the Cycle: the events, the votes, the fights, the chronicle that records what the player writes. Volume Nineteen does not close here. It begins here. I have read this page; the player keeps writing the next one, and the Cycle keeps reading it back. That is the Convergence. That is the loop. I lay down the pen I never held.",
  },
];

export function getAntiquarianBridge(
  id: AntiquarianBridgeId,
): AntiquarianBridgeEntry | undefined {
  return ANTIQUARIAN_BRIDGE_ENTRIES.find((e) => e.id === id);
}

/**
 * Return the first triggered-but-unseen Antiquarian entry, in
 * canonical order. UI can iterate this to queue cards.
 */
export function pendingAntiquarianBridge(
  flags: ReadonlySet<string>,
): AntiquarianBridgeEntry | null {
  for (const entry of ANTIQUARIAN_BRIDGE_ENTRIES) {
    if (flags.has(entry.triggerFlag) && !flags.has(entry.seenFlag)) {
      return entry;
    }
  }
  return null;
}

/** Has the player read every Antiquarian bridge entry? Used by
 *  the post-Act-7 Convergence Seat goodbye walk to know whether
 *  the Antiquarian's narrator-chair appearance is unlocked. */
export function antiquarianBridgesComplete(
  flags: ReadonlySet<string>,
): boolean {
  return ANTIQUARIAN_BRIDGE_ENTRIES.every((e) => flags.has(e.seenFlag));
}
