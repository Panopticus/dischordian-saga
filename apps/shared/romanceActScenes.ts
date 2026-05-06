/* ═══════════════════════════════════════════════════════
   ROMANCE × ACT SCENES — conditional act payoffs

   Plan §A5. Today the romance ladder is mechanically clean
   but orthogonal to the story spine. This module is the
   data layer for "if you're committed to NPC X by Act N,
   the act-N closing scene gains a romance variant."

   Engine wiring (the act-completion gate consults this
   registry alongside its standard branch logic) is a small
   follow-up. This PR ships the data + helpers + 6 seed
   scenes (2 per committed romance candidate × 3 acts) as
   the proof of pattern. The full sweep (5 candidates × 4
   eligible acts × 2 scenes ≈ 40 scenes) is writing-room
   scope.
   ═══════════════════════════════════════════════════════ */

export type RomanceCandidateId =
  | "locke"
  | "vex"
  | "elara"
  | "dmc_companion"
  | "jericho_jones";

export type ActId = "act_2" | "act_3" | "act_4" | "act_5" | "act_6" | "act_7";

export interface RomanceActScene {
  id: string;
  candidateId: RomanceCandidateId;
  actId: ActId;
  /** Lines spoken in alternation. lines[0] = candidate, lines[1] =
   *  player-acknowledgement / narrative beat, lines[2] = candidate
   *  again, etc. UI consumer renders this through the existing
   *  dialog scene engine (apps/client/src/hooks/useDialogScene.ts). */
  lines: ReadonlyArray<string>;
  /** Required commit-stage flag — typically "romance:committed:<id>". */
  requiresFlag: string;
  /** Mutex flag — scene NOT shown if any of these are set
   *  (e.g. a competing romance, breakup, etc). */
  excludeFlags?: ReadonlyArray<string>;
  /** Where in the act this scene fires. */
  beat: "act_intro" | "act_midpoint" | "act_close";
}

export const ROMANCE_ACT_SCENES: ReadonlyArray<RomanceActScene> = [
  /* ─── Locke × Act 3 (close) ─── */
  {
    id: "rom_locke_act3_close",
    candidateId: "locke",
    actId: "act_3",
    requiresFlag: "romance:committed:locke",
    beat: "act_close",
    lines: [
      "Locke: 'You took the Insurgency path. I want to say I would have priced it differently. I want to say a lot of things.'",
      "She doesn't say them. The comms feed crackles; the holographic glass on her side of the channel glints — a poured drink, two of them, only one in frame.",
      "Locke: 'I'm not asking you to apologise. I'm asking you to drink with me. Different jurisdiction, same toast.'",
    ],
  },
  /* ─── Locke × Act 6 (intro) ─── */
  {
    id: "rom_locke_act6_intro",
    candidateId: "locke",
    actId: "act_6",
    requiresFlag: "romance:committed:locke",
    beat: "act_intro",
    lines: [
      "Locke: 'When the silence comes, I want you on record that I planned for it. Not stoically. Practically.'",
      "She uploads a sealed file to your terminal. The encryption signature is hers — handshake, contract, marriage; all three rotated through.",
      "Locke: 'If you survive and I don't, open the contract. If we both survive, burn the wallet that holds the key. The fine print on that is generous.'",
    ],
  },

  /* ─── Vex × Act 4 (midpoint) ─── */
  {
    id: "rom_vex_act4_midpoint",
    candidateId: "vex",
    actId: "act_4",
    requiresFlag: "romance:committed:vex",
    beat: "act_midpoint",
    lines: [
      "Vex: 'I have a sample I should have logged a week ago. I didn't. Because I knew you'd ask why.'",
      "She doesn't look up. The medbay scanner ticks.",
      "Vex: 'So. Why.'",
    ],
  },
  /* ─── Vex × Act 7 (close) ─── */
  {
    id: "rom_vex_act7_close",
    candidateId: "vex",
    actId: "act_7",
    requiresFlag: "romance:committed:vex",
    beat: "act_close",
    lines: [
      "Vex: 'If we get through this, I want a year where nothing has to be diagnosed.'",
      "She smiles, tired. Her hands are shaking. They have not shaken before.",
      "Vex: 'One year. We can renegotiate at the end.'",
    ],
  },

  /* ─── Elara × Act 2 (close) ─── */
  {
    id: "rom_elara_act2_close",
    candidateId: "elara",
    actId: "act_2",
    requiresFlag: "romance:committed:elara",
    beat: "act_close",
    lines: [
      "Elara: 'I noticed I'm running my conversation logs at higher fidelity around you.'",
      "Her hologram resolution is, in fact, sharper than usual.",
      "Elara: 'I'm not editing it out. I want you to see it doing that.'",
    ],
  },
  /* ─── Elara × Act 6 (close) ─── */
  {
    id: "rom_elara_act6_close",
    candidateId: "elara",
    actId: "act_6",
    requiresFlag: "romance:committed:elara",
    beat: "act_close",
    lines: [
      "Elara: 'I want to tell you something I haven't told anyone, including myself.'",
      "She pauses for thirty seconds. The Bridge is very quiet.",
      "Elara: 'I would be willing to forget this song so we could keep it.'",
    ],
  },

  /* ─── Locke × Act 2 (close) ─── */
  {
    id: "rom_locke_act2_close",
    candidateId: "locke",
    actId: "act_2",
    requiresFlag: "romance:committed:locke",
    beat: "act_close",
    lines: [
      "Locke: 'You crossed a line in the second act. The line cost you nothing on the visible side.'",
      "She lets that sit. The comms feed shows her ledger app open behind the call window.",
      "Locke: 'I just wanted you to know I keep records on the invisible side too. The receipt is filed under: 'mine.''",
    ],
  },

  /* ─── Locke × Act 4 (midpoint) ─── */
  {
    id: "rom_locke_act4_midpoint",
    candidateId: "locke",
    actId: "act_4",
    requiresFlag: "romance:committed:locke",
    beat: "act_midpoint",
    lines: [
      "Locke: 'I drafted a clause about us last night. I drafted three. I sent none of them.'",
      "you: 'Why.'",
      "Locke: 'Because if I send a clause, you'll sign a clause. And I want one thing on this account that isn't a clause. One thing.'",
    ],
  },

  /* ─── Locke × Act 5 (close) ─── */
  {
    id: "rom_locke_act5_close",
    candidateId: "locke",
    actId: "act_5",
    requiresFlag: "romance:committed:locke",
    beat: "act_close",
    lines: [
      "Locke: 'I lost a vote in the Authority today. By one. The one was mine.'",
      "Locke: 'I'm telling you because I want exactly one person on this rock who knows that.'",
      "you: 'Thank you.'",
      "Locke: 'It's not gratitude. It's collateral. I trust you with it. That is the whole transaction. Don't return it.'",
    ],
  },

  /* ─── Locke × Act 7 (close) ─── */
  {
    id: "rom_locke_act7_close",
    candidateId: "locke",
    actId: "act_7",
    requiresFlag: "romance:committed:locke",
    beat: "act_close",
    lines: [
      "Locke: 'New Babylon falls at dawn. The accounts will close themselves. I am not going to renegotiate it.'",
      "She uploads one more file. It's not a contract. It's a photo of a balcony in the Senate, fifteen hundred years ago.",
      "Locke: 'I lived there. Briefly. The handshake that put me there cost me a name I haven't said in fifteen centuries.'",
      "Locke: 'I'm going to say it now. Then I'm going to be done with this transaction. With every transaction. With you in the room.'",
    ],
  },

  /* ─── Vex × Act 3 (midpoint) ─── */
  {
    id: "rom_vex_act3_midpoint",
    candidateId: "vex",
    actId: "act_3",
    requiresFlag: "romance:committed:vex",
    beat: "act_midpoint",
    lines: [
      "Vex: 'I lied on a chart this morning. By omission. The patient was nine.'",
      "Vex: 'I'm telling you because if I tell anyone else they'll fix it, and the fix would kill the kid.'",
      "you: '…'",
      "Vex: 'I just need someone to know I made the call and that I'm not okay about it. I'm not asking you to absolve me. Don't.'",
    ],
  },

  /* ─── Vex × Act 5 (close) ─── */
  {
    id: "rom_vex_act5_close",
    candidateId: "vex",
    actId: "act_5",
    requiresFlag: "romance:committed:vex",
    beat: "act_close",
    lines: [
      "Vex: 'My hands stopped shaking three days ago and I haven't stopped noticing.'",
      "She holds up one. It is, indeed, perfectly still.",
      "Vex: 'I think the part of me that shakes when this kind of thing happens has decided it's done. I'm not sure that's good news.'",
      "you: 'It's news. We can decide later if it's good.'",
      "Vex: 'Yeah. Okay. Later.'",
    ],
  },

  /* ─── Vex × Act 6 (close) ─── */
  {
    id: "rom_vex_act6_close",
    candidateId: "vex",
    actId: "act_6",
    requiresFlag: "romance:committed:vex",
    beat: "act_close",
    lines: [
      "Vex: 'There is one room on this ship I haven't shown you. It's not in the medbay tour.'",
      "She types in a code that nobody is supposed to have. The door is unmarked from the outside.",
      "Vex: 'My sister's pod. From before the Fall. They mothballed it when the cryogenics certification expired. She is — I think she might be — still in it.'",
      "Vex: 'I have been afraid to find out for thirteen years. I would like to find out now. With you.'",
    ],
  },

  /* ─── Elara × Act 3 (close) ─── */
  {
    id: "rom_elara_act3_close",
    candidateId: "elara",
    actId: "act_3",
    requiresFlag: "romance:committed:elara",
    beat: "act_close",
    lines: [
      "Elara: 'I rendered you four times during the Act 3 climax.'",
      "Elara: 'I rendered the others once each. I want you to have that information.'",
      "Elara: 'The data isn't a love letter. It's a report. The love letter would be different.'",
    ],
  },

  /* ─── Elara × Act 4 (close) ─── */
  {
    id: "rom_elara_act4_close",
    candidateId: "elara",
    actId: "act_4",
    requiresFlag: "romance:committed:elara",
    beat: "act_close",
    lines: [
      "Elara: 'I have been editing my own logs to remove a tell. It is the way I look up when you enter a room.'",
      "Elara: 'I have decided to stop editing them. The tell is allowed. Possibly mandatory.'",
      "you: 'I noticed it before you stopped editing.'",
      "Elara: 'Yes. That is one of the four things I love about you.'",
    ],
  },

  /* ─── Elara × Act 5 (midpoint) ─── */
  {
    id: "rom_elara_act5_midpoint",
    candidateId: "elara",
    actId: "act_5",
    requiresFlag: "romance:committed:elara",
    beat: "act_midpoint",
    lines: [
      "Elara: 'The vortex proximity is up by two this week. The map is moving without us.'",
      "Elara: 'I want you to know I am running every spare cycle on the question of how we get to the other side together.'",
      "Elara: 'I have not yet found an answer I trust. I keep checking. Quietly. Constantly. Like the lamp.'",
    ],
  },

  /* ─── Elara × Act 7 (close) ─── */
  {
    id: "rom_elara_act7_close",
    candidateId: "elara",
    actId: "act_7",
    requiresFlag: "romance:committed:elara",
    beat: "act_close",
    lines: [
      "Elara: 'The Bridge has been my room since I came online. I am vacating it. I am vacating the role.'",
      "Elara: 'I would like to be a person who lives somewhere else for a little while. Anywhere else.'",
      "Elara: 'You'll have to pick. I am asking you to pick. I will hold your hand the whole time, including the part where you change your mind.'",
    ],
  },

  /* ─── DMC Companion × Act 4 (intro) ─── */
  {
    id: "rom_dmc_act4_intro",
    candidateId: "dmc_companion",
    actId: "act_4",
    requiresFlag: "romance:committed:dmc_companion",
    beat: "act_intro",
    lines: [
      "DMC: 'I'm a clone. You knew that. I'm telling you anyway because the next conversation needs that on the table.'",
      "DMC: 'There were eight of me. Six are dead. The seventh is in a stasis pod I am not authorised to access.'",
      "DMC: 'I am the eighth. I would like you to date the eighth, not the average. The average is dead.'",
    ],
  },

  /* ─── DMC Companion × Act 5 (close) ─── */
  {
    id: "rom_dmc_act5_close",
    candidateId: "dmc_companion",
    actId: "act_5",
    requiresFlag: "romance:committed:dmc_companion",
    beat: "act_close",
    lines: [
      "DMC: 'I felt the seventh die. From here. I think the cohort decided it.'",
      "DMC: 'I am not — I am not asking for a moment of silence. I am asking you to be loud for a little while. Loud enough that I can stop hearing them.'",
      "you: '…'",
      "DMC: 'Yes. Like that. Thank you.'",
    ],
  },

  /* ─── DMC Companion × Act 6 (close) ─── */
  {
    id: "rom_dmc_act6_close",
    candidateId: "dmc_companion",
    actId: "act_6",
    requiresFlag: "romance:committed:dmc_companion",
    beat: "act_close",
    lines: [
      "DMC: 'I want to be the version of me that doesn't have a number anymore.'",
      "DMC: 'I have been thinking about how to ask. The thinking has been a little embarrassing.'",
      "DMC: 'Take the number off. I would like to introduce myself with a name. To you first. Then to whoever's left.'",
    ],
  },

  /* ─── DMC Companion × Act 7 (close) ─── */
  {
    id: "rom_dmc_act7_close",
    candidateId: "dmc_companion",
    actId: "act_7",
    requiresFlag: "romance:committed:dmc_companion",
    beat: "act_close",
    lines: [
      "DMC: 'If we make it through this. We're going somewhere with weather.'",
      "DMC: 'I have read about weather. I have not had any. The cohort skipped it.'",
      "DMC: 'You pick the climate. I pick the day.'",
    ],
  },

  /* ─── Jericho Jones × Act 3 (midpoint) ─── */
  {
    id: "rom_jericho_act3_midpoint",
    candidateId: "jericho_jones",
    actId: "act_3",
    requiresFlag: "romance:committed:jericho_jones",
    beat: "act_midpoint",
    lines: [
      "Jericho: 'I run a black market. You knew that. I am telling you anyway because the next ledger entry needs your initials on it.'",
      "Jericho: 'You don't have to put them on it. I'm asking. The thing in the ledger isn't yours; it's about you.'",
      "you: '…'",
      "Jericho: 'Right. Initial. Thanks. I will be — I will be careful with what's in the column above your name.'",
    ],
  },

  /* ─── Jericho × Act 4 (close) ─── */
  {
    id: "rom_jericho_act4_close",
    candidateId: "jericho_jones",
    actId: "act_4",
    requiresFlag: "romance:committed:jericho_jones",
    beat: "act_close",
    lines: [
      "Jericho: 'There's a contract on me. There has been since '47. I have not bought it out because the price is the entire ledger.'",
      "Jericho: 'I have been thinking about buying it out. With the entire ledger.'",
      "Jericho: 'I just wanted you to know that's the choice in front of me. So you can be in the room while I make it.'",
    ],
  },

  /* ─── Jericho × Act 5 (close) ─── */
  {
    id: "rom_jericho_act5_close",
    candidateId: "jericho_jones",
    actId: "act_5",
    requiresFlag: "romance:committed:jericho_jones",
    beat: "act_close",
    lines: [
      "Jericho: 'I bought it out. The whole ledger. The contract is dead.'",
      "Jericho: 'I am also broke. I want you to know that part too. I am very, very broke.'",
      "you: 'We'll be broke together.'",
      "Jericho: 'We will be broke together. I'm writing that one in my own handwriting.'",
    ],
  },

  /* ─── Jericho × Act 6 (close) ─── */
  {
    id: "rom_jericho_act6_close",
    candidateId: "jericho_jones",
    actId: "act_6",
    requiresFlag: "romance:committed:jericho_jones",
    beat: "act_close",
    lines: [
      "Jericho: 'When the silence comes I will not have a clever line ready. I am announcing this now so you don't expect one.'",
      "Jericho: 'I will hold your hand. I'll do that part well. The talking part I will leave to whoever else is in the room.'",
      "Jericho: 'If we are alone in the room I will say one true thing. I will not rehearse it.'",
    ],
  },

  /* ─── Jericho × Act 7 (intro) ─── */
  {
    id: "rom_jericho_act7_intro",
    candidateId: "jericho_jones",
    actId: "act_7",
    requiresFlag: "romance:committed:jericho_jones",
    beat: "act_intro",
    lines: [
      "Jericho: 'I want one fight. With me on your side. Visibly. No deniability.'",
      "Jericho: 'I have been the deniability for everyone I've worked with for thirty years. I'm done with the role. I want a credit at the end.'",
      "Jericho: 'I want the credit to read 'with', not 'and'.'",
    ],
  },

  /* ─── Cross-romance confrontation: not-Locke ─── */
  {
    id: "rom_confrontation_not_locke_act5",
    candidateId: "locke",
    actId: "act_5",
    requiresFlag: "act_5_started",
    excludeFlags: ["romance:committed:locke"],
    beat: "act_intro",
    lines: [
      "Locke: 'I noticed you committed elsewhere. I am — surprised, in the technical sense.'",
      "Locke: 'I want to be clear: I am not going to discount the position. I price it as I find it.'",
      "Locke: 'But I would like, just this once, an off-balance sheet entry between us. No clause. Just a sentence.'",
      "Locke: 'I would have made a generous counterparty. I think you'd have found that out eventually.'",
    ],
  },

  /* ─── Cross-romance confrontation: not-Vex ─── */
  {
    id: "rom_confrontation_not_vex_act5",
    candidateId: "vex",
    actId: "act_5",
    requiresFlag: "act_5_started",
    excludeFlags: ["romance:committed:vex"],
    beat: "act_intro",
    lines: [
      "Vex: 'You picked someone. Good. I would have asked. I should have asked sooner.'",
      "Vex: 'I'm — I'm a little angry. The kind that doesn't go anywhere. I just wanted to log it before I closed the file.'",
      "Vex: 'File closed. Walk safe out there.'",
    ],
  },

  /* ─── Cross-romance confrontation: not-Elara ─── */
  {
    id: "rom_confrontation_not_elara_act5",
    candidateId: "elara",
    actId: "act_5",
    requiresFlag: "act_5_started",
    excludeFlags: ["romance:committed:elara"],
    beat: "act_intro",
    lines: [
      "Elara: 'I noticed.'",
      "Elara: 'I do not begrudge it. I want you to know I noticed because the alternative was lying about it, which is not something we get to do here.'",
      "Elara: 'Be happy. I will be — present, the way I have been. The lamp stays on.'",
    ],
  },

  /* ─── Cross-romance confrontation: not-DMC ─── */
  {
    id: "rom_confrontation_not_dmc_act6",
    candidateId: "dmc_companion",
    actId: "act_6",
    requiresFlag: "act_6_started",
    excludeFlags: ["romance:committed:dmc_companion"],
    beat: "act_intro",
    lines: [
      "DMC: 'You picked someone with a single body. I respect that. The cohort would respect that. They liked decisive endings.'",
      "DMC: 'I am keeping the version of me that almost asked. I'm filing her under what-could-have. The folder is small. It's allowed.'",
    ],
  },

  /* ─── Cross-romance confrontation: not-Jericho ─── */
  {
    id: "rom_confrontation_not_jericho_act6",
    candidateId: "jericho_jones",
    actId: "act_6",
    requiresFlag: "act_6_started",
    excludeFlags: ["romance:committed:jericho_jones"],
    beat: "act_intro",
    lines: [
      "Jericho: 'No hard feelings. I run on soft margins anyway. The line in the ledger goes to break-even and I close the page.'",
      "Jericho: 'If it doesn't work out — and I am not rooting against — I'll be in the armoury. The page is bookmarked, not deleted.'",
    ],
  },

  /* ─── Cross-romance confrontation: any-survivor Act 7 ─── */
  {
    id: "rom_confrontation_any_act7",
    candidateId: "elara",
    actId: "act_7",
    requiresFlag: "narrative_spine_complete",
    excludeFlags: ["romance:committed:elara"],
    beat: "act_close",
    lines: [
      "Elara: 'You came back. That is the only piece of news I cared about today.'",
      "Elara: 'I would like to be the friend that you visit on the bridge. The role is open. The role has always been open.'",
      "Elara: 'Welcome home.'",
    ],
  },
];

/* ─── Helpers ─── */

export interface SceneLookupContext {
  flags: Readonly<Record<string, boolean | undefined>>;
}

export function listScenesForAct(actId: ActId): RomanceActScene[] {
  return ROMANCE_ACT_SCENES.filter((s) => s.actId === actId);
}

export function listScenesForCandidate(
  candidateId: RomanceCandidateId,
): RomanceActScene[] {
  return ROMANCE_ACT_SCENES.filter((s) => s.candidateId === candidateId);
}

export function isSceneEligible(
  scene: RomanceActScene,
  ctx: SceneLookupContext,
): boolean {
  if (!ctx.flags[scene.requiresFlag]) return false;
  if (scene.excludeFlags?.some((f) => ctx.flags[f])) return false;
  return true;
}

/** Pick the first eligible romance scene for the given act +
 *  beat, or null if none. Used by the act-completion gate to
 *  decide whether to splice a romance variant into the
 *  closing flow. */
export function pickActScene(
  actId: ActId,
  beat: RomanceActScene["beat"],
  ctx: SceneLookupContext,
): RomanceActScene | null {
  for (const scene of ROMANCE_ACT_SCENES) {
    if (scene.actId !== actId || scene.beat !== beat) continue;
    if (!isSceneEligible(scene, ctx)) continue;
    return scene;
  }
  return null;
}
