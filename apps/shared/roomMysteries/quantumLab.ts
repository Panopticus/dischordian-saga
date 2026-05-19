/* ═══════════════════════════════════════════════════════
   QUANTUM LABORATORY MYSTERY — entanglement-rig + observation-cage

   Two-hotspot module. Sets quantum_lab_seen on first-look
   at the entanglement-rig. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type QuantumLabHotspotId =
  | "charter-wax-mineralisation-analysis"
  | "severance-bond-internal-log"
  | "charter2-vellum-comparison"
  | "infernal-quantum-dating"
  | "dlc-akai-shi-red-death-quantum-lab"
  | "entanglement-rig" | "observation-cage";

export const QUANTUM_LAB_MYSTERY: RoomMysteryModule<QuantumLabHotspotId> = {
  roomId: "quantum-lab",
  responses: {
    /* ─── charter.missing_signatory · e2 (wax mineralisation analysis) ─── */
    "charter-wax-mineralisation-analysis": {
      look: {
        narration:
          "The charter's wax-blister, removed under the quantum-lab's micro-extraction protocol, sits on the analysis stage. Every standard solvent has been tested and refused. The lab's quantum-imaging penetrates: the wax is mineralised — heated to a temperature the lower decks cannot reach, then re-poured at least three times. The lab's thermal-calibration places the original temperature in the upper-band range, where the Architect's furnaces operate. Whoever sealed the seventh signature had access to a forge the Ark does not house.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e2",
          cluesFound: ["charter.e2.wax_chemistry"],
        },
      },
      use: {
        narration:
          "You request the lab's spectral signature match. The mineralisation profile matches three other artefacts in the lab's reference library — all of them upper-band-origin objects the Architect has filed under 'restricted provenance.' The wax-thumb on the charter was sealed using materials only the upper bands could provide. The sealer was either there or briefed by something that was.",
      },
    },
    /* ─── severance.bound_champion · e2 (bond's internal log stack) ─── */
    "severance-bond-internal-log": {
      look: {
        narration:
          "On the quantum-lab's sieve-reading bench, the companion's bond from this finals night's table — held in a stasis cradle for non-destructive analysis. The quantum-sieve reads a stack: forty-one names whispered into the bond at the moment of each inheritance, every name intact, every name in temporal order. The lab's report: 'the bond is an archive; the archive is a chain.' The names are not in any ledger. The names have been in the bond for forty seasons, traveling forward through each inheritance ceremony in a private succession the league has not been keeping.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e2",
          cluesFound: ["severance.e2.bond_logs"],
        },
      },
      interrogate: {
        narration:
          "You ask the lab to play the most recent whisper. The sieve resolves it: a single name, spoken in the Broker's voice, at the moment the Year 39 champion's bond was poured. The Broker has been whispering the inheritor's name into the bond at every Severance — the Broker is the keeper of the spoken chain.",
      },
    },
    /* ─── charter.second_signatory · e1 (parallel-vellum analysis) ─── */
    "charter2-vellum-comparison": {
      look: {
        narration:
          "Both charters — ours, recovered from the lower-deck silt, and the four-house delegation's mirror — lie side by side on the quantum-lab's parallel-stage. Imaging penetrates: same hide, cut adjacent at the tannery, cured the same week. The same hand prepared both vellums; the same pen signed each within hours of the other. The lab's spectral analysis cannot distinguish them on any material axis. The mirror is not a forgery and our copy is not the original. They are parallel originals, drafted as a pair by founders who chose which version each copy would carry.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e1",
          cluesFound: ["charter2.e1.two_charters_same_paper"],
        },
      },
      use: {
        narration:
          "You request the lab's hide-fibre alignment scan. The two vellums share twelve grain-lines that mate at the cut edge — they were once adjacent panels on the same hide. The founders cut the hide in half and drafted the two parallel originals from the same animal. The pair-authorship was as deliberate as the parchment was shared.",
      },
    },
    /* ─── severance.infernal_clause · e3 (quantum-dating results) ─── */
    "infernal-quantum-dating": {
      look: {
        narration:
          "The quantum-lab's dating stage holds all forty contracts — every back-page clause prepared for ink-dating analysis. The lab's quantum-imaging penetrates each ink-layer's molecular state. Result: every clause's ink was applied within a seven-day window in epoch one, week thirty-three, days four through ten. The contracts they appear on span forty seasons. Thirty-nine of the forty clauses pre-date their host contract by anywhere from one to thirty-nine seasons. The lab's calibration is independent and instrument-grade. The writer was working ahead — anticipating contracts that had not yet been signed.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e3",
          cluesFound: ["infernal.e3.dating_results"],
        },
      },
      use: {
        narration:
          "You request the lab's confidence interval on the dating. The instrument reports ±0.4 days at the seven-day window's bounds. The window is sharp. The writer began on day four and finished on day ten. Forty clauses in seven days; the lab's tightest precision says exactly that.",
      },
    },
    "dlc-akai-shi-red-death-quantum-lab": {
      look: {
        narration: "Case material for akai_shi.red_death surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e2",
          cluesFound: ["akai.e2.altered_energy_signature", "akai.e3.necromancer_evasion_log"],
        },
      },
    },
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
