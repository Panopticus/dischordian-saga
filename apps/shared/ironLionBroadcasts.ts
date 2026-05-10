/* ═══════════════════════════════════════════════════════
   IRON LION BROADCASTS — seven Loredex transmissions

   Iron Lion's signal still rides the third-class Mechronis
   frequency from Veridian VI. The previous Ark crew left
   the missing nav-glyph specifically so the player could
   tune to it. This module declares the seven canonical
   transmissions the player can receive between Acts 4 and
   Cades M7, in order. Each is a Loredex entry the
   Antiquarian's archive surfaces when the Comms Array is
   tuned correctly.

   The Cades external campaign covers the playable form of
   these moments. This module covers the LISTENING form —
   what every player hears even without the Godot project.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

export interface IronLionBroadcast {
  id: string;
  /** 1-based ordering for the listening sequence. */
  sequenceIndex: number;
  /** Cades mission this broadcast pairs with (see actsFourFiveShells.ts).
   *  M1 = Scout's Gambit, M2 = Digital Onslaught, M3 = void corridor,
   *  M4 = Kael's own, M5 = Operation Trojan Downfall, M6 = Vex recruit,
   *  M7 = Last Stand. */
  pairedMission: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Existing flag that gates discovery — typically a Cades mission
   *  completion or an act-progression flag. */
  unlockFlag: string;
  /** Header line shown at the top of the Loredex page. */
  title: string;
  /** Iron Lion's transcript. Treated as monospace + line-break-respecting. */
  transcript: string;
  /** Flag set when the player has read this transmission. */
  seenFlag: string;
}

export const IRON_LION_BROADCASTS: ReadonlyArray<IronLionBroadcast> = [
  {
    id: "iron_lion_broadcast_1",
    sequenceIndex: 1,
    pairedMission: 1,
    unlockFlag: "act_4_complete",
    title: "Scout's Gambit — first contact",
    transcript:
      "[CADES SIGNAL · SCOUT TRACK]\n\nI sent six scouts into the western valley. They came back with maps. The maps were wrong in the same way three times. That means a pattern, not noise.\n\nThe Architect's supply lines have a weakness in the second western pass. We will use it on the second pass through the second valley. We will not use it on the first.\n\nThe scout who saw it was named Yuri. I am writing his name down because the Editor has been editing scout-rosters and I would like Yuri to keep his name.",
    seenFlag: "iron_lion_broadcast_1_seen",
  },
  {
    id: "iron_lion_broadcast_2",
    sequenceIndex: 2,
    pairedMission: 2,
    unlockFlag: "cades_m1_complete",
    title: "The Digital Onslaught — turning the horde",
    transcript:
      "[CADES SIGNAL · NOMAD'S CHANNEL]\n\nThe Nomad has cracked the AI's communication protocol. Segments of the robotic horde are attacking each other. We are watching them shut down in waves.\n\nThe sound is wrong. It is metal hitting metal that is also itself. Some of my soldiers are crying. They are crying because they recognised the sound.\n\nWe held the node. Tomorrow we hold it again. The Nomad needs sleep but he will not take it.",
    seenFlag: "iron_lion_broadcast_2_seen",
  },
  {
    id: "iron_lion_broadcast_3",
    sequenceIndex: 3,
    pairedMission: 3,
    unlockFlag: "cades_m2_complete",
    title: "The Void Corridor — the harvest",
    transcript:
      "[CADES SIGNAL · SALVAGE TRACK]\n\nWe are repurposing fallen drone tech. Our armor is laser-resistant now. Our communications are encrypted with ATOR Protocol — the AI's own protocol, against itself.\n\nThe drones we wear used to wear soldiers. We are returning the wearing.\n\nThe corridor is open. Tomorrow we use it.",
    seenFlag: "iron_lion_broadcast_3_seen",
  },
  {
    id: "iron_lion_broadcast_4",
    sequenceIndex: 4,
    pairedMission: 4,
    unlockFlag: "cades_m3_complete",
    title: "Kael's Own — the heist crew",
    transcript:
      "[CADES SIGNAL · MEMORY TRACK]\n\nBefore Veridian VI I was on the Casino Heist. The Inventor ran the long con at the table. I was muscle, distraction, and exit cover. We won the Heart of Time off the Trickster.\n\nI think about that night. The Trickster's guards were not chasing me. They were chasing what they thought I was. That is how you win — be what they think you are, until you are not.\n\nKael's own crew is here in spirit. The Inventor is still alive somewhere. If you find her, tell her Iron remembered the table.",
    seenFlag: "iron_lion_broadcast_4_seen",
  },
  {
    id: "iron_lion_broadcast_5",
    sequenceIndex: 5,
    pairedMission: 5,
    unlockFlag: "cades_m4_complete",
    title: "Operation Trojan Downfall — the loss",
    transcript:
      "[CADES SIGNAL · PARTIAL VICTORY]\n\nWe attacked the central AI node. We had it. We had it for ninety seconds.\n\nGeneral Prometheus activated a failsafe. Every weapon integrated with AI tech went dark. A quarter of our combined force was annihilated in the dark before any of us understood we were the dark.\n\nA volunteer team — name them, please, when you can — sacrificed themselves to destroy the installation's power source. We retreated. The losses were the cost of knowing the failsafe existed.\n\nTomorrow we plan around the failsafe. Tonight we name the dead.",
    seenFlag: "iron_lion_broadcast_5_seen",
  },
  {
    id: "iron_lion_broadcast_6",
    sequenceIndex: 6,
    pairedMission: 6,
    unlockFlag: "cades_m5_complete",
    title: "Alliance of Adversaries — Agent Zero arrives",
    transcript:
      "[CADES SIGNAL · ZERO CHANNEL]\n\nGeneral Binath-VII brought a fleet. We had no fleet to meet her. We had a spy network and one assassin willing to be dropped into the centre of her command.\n\nThe assassin's designation is Agent Zero. They are the legendary blade everyone has been telling each other about for so long the legend is older than the blade. Today the blade caught up to the legend.\n\nWe inducted Agent Zero formally. They signed under no name and that is the name they keep. The fleet command structure has been compromised at three nodes. The fourth is hers — she will let us know when it is ours.",
    seenFlag: "iron_lion_broadcast_6_seen",
  },
  {
    id: "iron_lion_broadcast_7",
    sequenceIndex: 7,
    pairedMission: 7,
    unlockFlag: "cades_m6_complete",
    title: "The Last Stand — the press goes silent",
    transcript:
      "[CADES SIGNAL · LAST STAND]\n\nI printed three thousand posters in seventy-two hours. The presses were here before me. They will be here after me. The 3001st poster is set up on the carriage and the ink is wet. I have been printing it for a long time.\n\nIf you are receiving this, the hand has arrived. Walk in. The press is the second one on the left. The poster is the only one on the carriage. Take it. The cat at my feet is not mine. Tell whoever owns him that he was a good cat.\n\nI fought four major AI generals today. Three are gone. The fourth I cannot reach without the fleet, and the fleet is not coming. I will not survive the next watch. That is correct. Some of us were always going to be the watch.\n\nThe press is going silent. Carry the poster. End transmission.",
    seenFlag: "iron_lion_broadcast_7_seen",
  },
];

export function getIronLionBroadcast(id: string): IronLionBroadcast | undefined {
  return IRON_LION_BROADCASTS.find((b) => b.id === id);
}

export function pendingIronLionBroadcast(
  flags: ReadonlySet<string>,
): IronLionBroadcast | null {
  for (const broadcast of IRON_LION_BROADCASTS) {
    if (flags.has(broadcast.unlockFlag) && !flags.has(broadcast.seenFlag)) {
      return broadcast;
    }
  }
  return null;
}

export function ironLionBroadcastsHeard(
  flags: ReadonlySet<string>,
): number {
  return IRON_LION_BROADCASTS.filter((b) => flags.has(b.seenFlag)).length;
}
