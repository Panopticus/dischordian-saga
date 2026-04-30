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
    },
  },
};
