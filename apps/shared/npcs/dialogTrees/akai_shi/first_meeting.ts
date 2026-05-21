// apps/shared/npcs/dialogTrees/akai_shi/first_meeting.ts
//
// Akai Shi → Blade-shrine first-meeting dialog tree — Section D5.
// Fires the first time the player enters the blade-shrine after
// akai_shi_recruited writes. Calibration register; voltari static
// at the room's lowest frequency. Trust-band gateway via "Audible".

import type { NpcDialogTree } from "../types";

export const AKAI_SHI_FIRST_MEETING: NpcDialogTree = {
  id: "akai-shi-first-meeting",
  npcKey: "akai_shi",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "akai_shi",
      voLineId: "akai.first_meeting.root",
      onscreenText:
        "[Akai is in the kneeling space at the south wall of the shrine. The voltari static is at its lowest setting — barely a hum. She does not turn. Her case sits beside her, open, the way it was the day she returned.] You came. I have set the room to its quietest frequency. You can speak normally; the shrine compensates. Sit, if you would like. There is a cushion to your left.",
      requiresRevealStage: "post_reanimation",
      choices: [
        {
          label: "[Sit on the cushion. Wait for her.]",
          nextId: "sit_and_wait",
          sets: "akai_first_meeting_sat",
          trustDelta: 4,
          axisDelta: [{ axis: "vulnerability", delta: 1 }],
        },
        {
          label: "Is the case open by accident?",
          nextId: "ask_case",
          sets: "akai_first_meeting_asked_case",
          trustDelta: 3,
          axisDelta: [{ axis: "curiosity", delta: 1 }],
        },
        {
          label: "How does the resurrection feel — is it different?",
          nextId: "ask_resurrection",
          sets: "akai_first_meeting_asked_resurrection",
          trustDelta: 2,
          axisDelta: [{ axis: "mercy", delta: 1 }],
        },
        {
          label: "I need a moment with you. Now.",
          nextId: "demand_attention",
          sets: "akai_first_meeting_demanded",
          trustDelta: -4,
          axisDelta: [{ axis: "aggression", delta: 1 }],
          publicFlag: "akai_first_meeting_static_breach",
        },
      ],
    },

    sit_and_wait: {
      id: "sit_and_wait",
      npcKey: "akai_shi",
      voLineId: "akai.first_meeting.sit_and_wait",
      onscreenText:
        "[A long silence. The static does not rise. Eventually she turns, by degrees, the way someone turns when their balance has been calibrated.] You held the silence. The Lair never learned to do that; the Necromancer's apprentices certainly did not. Thank you. The cushion is yours whenever you want to sit on it. I will assume the offer is standing, unless you tell me otherwise.",
      autoNext: "terminal",
      requiresRevealStage: "post_reanimation",
    },

    ask_case: {
      id: "ask_case",
      npcKey: "akai_shi",
      voLineId: "akai.first_meeting.ask_case",
      onscreenText:
        "[She glances at the case, then back.] The case is open because closed cases ring at this frequency. Open cases do not. I have not put a weapon away since I came back; I have set the weapons down. The setting-down is what the resurrection asked of me. Closing the case would un-set them. I am — not yet ready to un-set them.",
      autoNext: "terminal",
      requiresRevealStage: "post_reanimation",
    },

    ask_resurrection: {
      id: "ask_resurrection",
      npcKey: "akai_shi",
      voLineId: "akai.first_meeting.ask_resurrection",
      onscreenText:
        "It is different. The first life ended with a laugh that was not mine; the resurrection arrived with a silence that is. I am calibrated, now, to the silence. The Lair was calibrated to the laugh. I am no longer in the Lair. I am here. The shrine is mine to set the frequency of, and I have set it as quiet as it will go.",
      autoNext: "terminal",
      requiresRevealStage: "post_reanimation",
    },

    demand_attention: {
      id: "demand_attention",
      npcKey: "akai_shi",
      voLineId: "akai.first_meeting.demand_attention",
      onscreenText:
        "[The static rises briefly — a degree, perhaps a degree-and-a-half. She does not turn. She does not move. The static settles, slowly.] You are using the verb the Lair used. I will not give the verb back. Whatever you need will keep until you can ask for it without the verb. The cushion is to your left if you reconsider.",
      autoNext: "terminal",
      requiresRevealStage: "post_reanimation",
    },

    terminal: {
      id: "terminal",
      npcKey: "akai_shi",
      onscreenText: "",
      expressionChannel: "posture",
    },
  },
};
