/* ═══════════════════════════════════════════════════════
   QUANTUM LABORATORY MYSTERY — entanglement-rig + observation-cage

   Two-hotspot module. Sets quantum_lab_seen on first-look
   at the entanglement-rig. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type QuantumLabHotspotId = "entanglement-rig" | "observation-cage";

export const QUANTUM_LAB_MYSTERY: RoomMysteryModule<QuantumLabHotspotId> = {
  roomId: "quantum-lab",
  responses: {
    "entanglement-rig": {
      look: {
        narration: {
          lucid:
            "The entanglement-rig is a brass armature suspending two clear quartz orbs at opposite corners of the room. The orbs pulse in sync — strike one and the other rings half a beat later. The latency is the room's working signature; entanglement is supposed to be instantaneous, and this rig deliberately demonstrates a measurable lag.",
          fragmented:
            "Half a beat. Half a beat. Half a beat. Lag. Lag. Lag.",
          luminous:
            "The rig deliberately demonstrates that entanglement, in our universe, is not instantaneous — there is a half-beat lag. The lag is the room's discipline: anyone who walks in expecting magic is corrected, on arrival, by the measurable delay. The Quarchon physics here is honest. The Editor's preferred kind of confidence does not survive the half-beat.",
        },
        voId: "elara.quantum-lab.entanglement-rig.look",
        setsFlag: "quantum_lab_seen",
        logsClue: {
          id: "clue-quantum-lab-lag",
          title: "Entanglement-rig demonstrates a measurable half-beat lag",
          body:
            "The Quantum Laboratory's entanglement-rig deliberately demonstrates that entanglement is not instantaneous — there is a half-beat lag between paired orbs. The lag is the room's honesty. The Editor's preferred confidence does not survive measurement.",
          source: "quantum-lab",
          order: 0,
        },
      },
      use: {
        narration:
          "You strike the near orb. It rings — and exactly half a beat later, the far orb across the room rings back. The lag is consistent. The lag is, in this room, the only honest measurement.",
        voId: "elara.quantum-lab.entanglement-rig.use",
        setsFlag: "quantum_lag_measured",
      },
      talk: {
        narration:
          "If you address the rig, the orbs' resonance briefly steadies. They listen better to a single voice than to ambient room noise. The Quarchon physics, again, treats attention as participation.",
        voId: "elara.quantum-lab.entanglement-rig.talk",
      },
    },
    "observation-cage": {
      look: {
        narration: {
          lucid:
            "The observation-cage is a small brass-mesh enclosure beside the entanglement-rig. Whoever was running an experiment here was inside the cage — Faraday-isolated from the rig, watching it from outside the system. The cage contains a single oxblood-leather-bound notebook, open to a page of careful observations dated the last week of Lyra's command.",
          fragmented:
            "Last week. Last week. Last week. The notebook. Last week.",
          luminous:
            "The notebook is Wraith Calder's. He was in the cage in the last week of Lyra's command, observing the rig from inside Faraday isolation — the only viewing position the editor cannot reach. The page is a careful record of the half-beat lag, in Wraith's hand. The page also bears, in a different ink, a single annotation: 'He cannot edit what he cannot read in real time.' The annotation is the sentence the case turns on.",
        },
        voId: "elara.quantum-lab.observation-cage.look",
        logsClue: {
          id: "clue-quantum-lab-wraith-faraday-note",
          title: "Wraith's annotation: editor cannot edit real-time perception",
          body:
            "The Quantum Laboratory's observation-cage holds Wraith Calder's notebook from the last week of Lyra Vox's command. A handwritten annotation on the half-beat-lag observations reads: 'He cannot edit what he cannot read in real time.' This is the sentence the case turns on — the editor's method requires latency.",
          source: "quantum-lab",
          order: 1,
        },
      },
      use: {
        narration:
          "You step into the cage. The mesh hums, very faintly, around you — Faraday isolation engaging. The rig's orbs, viewed from inside, appear to ring slightly later than they do from outside the cage. Wraith was right: the editor cannot reach you in here.",
        voId: "elara.quantum-lab.observation-cage.use",
        setsFlag: "quantum_cage_entered",
      },
      talk: {
        narration:
          "If you address the cage, your voice carries clean. No interference, no half-beat ghost. This is the only room on the ship where I am certain you are speaking to me, and only to me. We should, perhaps, have more conversations here.",
        voId: "elara.quantum-lab.observation-cage.talk",
        humanReaction: {
          narration: {
            balanced:
              "Wraith used to make his real notes in there. Said it was the only place on the ship where the words stayed put. He wasn't wrong. I left him to it. I should have asked to read more of them.",
            shadow:
              "Don't trust the cage too much. Faraday isolation works on signals; it doesn't work on the people you let in. The editor's most successful trick is being invited inside.",
            warm:
              "Wraith wrote in there for years. Most of those pages went into the folio he took with him. If we ever find him, we will find the pages. The cage is, in that sense, the case's longest-running asset.",
          },
          voId: "human.quantum-lab.observation-cage.talk",
        },
      },
    },
  },
};
