/* ═══════════════════════════════════════════════════════
   ENGINEERING CORE MYSTERY — reactor coil + coolant + terminal

   Three-hotspot module for the deck-5 reactor heart-vault.
   Sets eng_core_introduced on first-look at the reactor-coil.
   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type EngineeringCoreHotspotId =
  | "storm-flux-signature"
  | "storm-energy-balance-audit"
  | "advocate-zyrkoth-protocol-lineage"
  | "resur-protocol-activation-timestamp"
  | "resur-matrix-escape-signature"
  | "charter-signatory-engineer-zero"
  | "charter2-house-vyn"
  | "reactor-coil" | "coolant-pipe" | "core-terminal";

export const ENGINEERING_CORE_MYSTERY: RoomMysteryModule<EngineeringCoreHotspotId> = {
  roomId: "engineering-core",
  responses: {
    /* ─── charter.second_signatory · e3 (House Vyn — gardeners) ─── */
    "charter2-house-vyn": {
      look: {
        narration:
          "On engineering-core's lower-deck-hydroponics console, House Vyn's gardens: kept by descendants for four epochs. The Vyn ledger names the same scrubber's hand on their tax-record erasure.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e3",
          cluesFound: ["charter2.e3.house_vyn"],
        },
      },
      use: {
        narration:
          "You pull the Vyn cultivation log. Four epochs of growth cycles, none of them with a registered charter-bearer. The Vyns have kept the lower-deck hydroponics alive without authorisation — the gardens have been off-the-books since the erasure, and they are still producing. The scrubber edited the chronicle. He did not edit the soil.",
        voId: "elara.engineering-core.charter2-house-vyn.use",
      },
      talk: {
        narration:
          "You read the family name aloud at the console. The hydroponics array's audio register catches the name — the same scrubber who erased the tax record did not have access to this subsystem. The Vyn name is preserved in the irrigation cadence, in the cycling timestamps, in every nutrient log. The system has been remembering them quietly.",
        voId: "elara.engineering-core.charter2-house-vyn.talk",
      },
    },
    /* ─── charter.missing_signatory · e2 (Engineer Zero's signature) ─── */
    "charter-signatory-engineer-zero": {
      look: {
        narration:
          "On the engineering-core's founding-records bench, Engineer Zero's signature on the charter: initialled rather than written. A clean Z above a horizontal bar. Engineer Zero signed everything this way. The bar runs into the wax.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e2",
          cluesFound: ["charter.e2.signatory_engineer_zero"],
        },
      },
      use: {
        narration:
          "You lift the corner where the bar runs into the wax. The bar is not a flourish — it is a continuation of an underlying weld-mark Engineer Zero used to certify load-bearing assemblies. He signed the charter with the same stroke he used to sign a structural component. The signature is engineering, not penmanship.",
        voId: "elara.engineering-core.charter-signatory-engineer-zero.use",
      },
      talk: {
        narration:
          "You read the initial aloud — Z, bar. The bench's response is a single tone, low and steady, which the founding-records system reserves for verified signatures. Engineer Zero's mark passes verification on the chronicle's own instrument. Whatever else has been edited, the signature has not.",
        voId: "elara.engineering-core.charter-signatory-engineer-zero.talk",
      },
    },
    /* ─── resurrectionist.cycle_walker · color clues ─── */
    "resur-protocol-activation-timestamp": {
      look: {
        narration:
          "On the engineering-core's substrate-timestamp bench, a resurrection-protocol activation signed in the Resurrectionist's four-part cipher, with a timestamp matching the Plague Dragon's death-instant to within the chronicle's measurement tolerance. The cult-curated annotation: 'unrelated administrative event — the protocol was queued, the timestamp is coincidental.' Two events at the same instant; the chronicle's editorial hand prefers the coincidence reading. The Antiquarian's reading discipline does not.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e3",
          cluesFound: ["resur.e3.protocol_activation_timestamp"],
        },
      },
      use: {
        narration:
          "You request the bench's coincidence tolerance for two-event matching. The instrument reports its threshold — events must occur within fifteen substrate-microseconds to register as coincident. The Plague Dragon's death-instant and the protocol activation are six microseconds apart. The reading is well inside coincidence range. Coincidence does not mean unrelated; coincidence means the bench cannot rule on which caused which.",
        voId: "elara.engineering-core.resur-protocol-activation-timestamp.use",
      },
      talk: {
        narration:
          "You read the cult annotation aloud — 'unrelated administrative event.' The bench's audio register marks the sentence with the standard chronicle-deferral flag, which the Antiquarian's reading discipline interprets as 'do not accept; do not refute; preserve for later'. The annotation has been preserved exactly that way for an epoch. The bench is patient.",
        voId: "elara.engineering-core.resur-protocol-activation-timestamp.talk",
      },
    },
    "resur-matrix-escape-signature": {
      look: {
        narration:
          "Pinned beside, the signature on the Necromancer's Matrix-of-Dreams escape (the moment he claimed the Silence's body and exited the archive) carries a four-part cipher fragment matching, in three of four parts, the Resurrectionist's authoring signature. The cult-curated annotation: 'partial-signature collision — the Resurrectionist's hand was widely studied; many parties have adopted fragments of his cipher.' The chronicle records the collision and proceeds.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e4",
          cluesFound: ["resur.e4.matrix_escape_signature"],
        },
      },
      use: {
        narration:
          "You request the bench's three-of-four match probability across the chronicle's known cipher-adopting parties. The instrument returns a single tail: the only documented party whose fragment usage approaches three of four is the Resurrectionist himself. The annotation's plural reading is statistically empty. The collision is, by the instrument's measure, an authoring signature.",
        voId: "elara.engineering-core.resur-matrix-escape-signature.use",
      },
      talk: {
        narration:
          "You read the cult annotation aloud — 'many parties have adopted fragments of his cipher.' The bench's audio register catches the recital and flags it for chronicle review. The plural is doing the work the singular would not bear. Spoken aloud, the editorial reach is audible.",
        voId: "elara.engineering-core.resur-matrix-escape-signature.talk",
      },
    },
    /* ─── advocate.blood_weave · e2 (Zyr'Koth's Severance Protocol lineage note) ─── */
    "advocate-zyrkoth-protocol-lineage": {
      look: {
        narration:
          "On the engineering-core's substrate-research bench, a lineage note in Zyr'Koth's research index: 'The Severance Protocol is the Blood Weave's offensive inversion. Where the Advocate wove substrate into defensive chains, the Severance Protocol weaves substrate into offensive separations. The Weave is technically older. The Protocol is technically more refined. Both share the substrate-consumption signature.' The note is precise; it does not name the substrate's specific composition.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e2",
          cluesFound: ["adv.e2.zyrkoth_severance_protocol_lineage"],
        },
      },
      use: {
        narration:
          "You request the substrate-consumption signature on both instruments. The bench overlays them — identical molecular cadence, identical cellular target, identical exhaustion curve. The defensive and the offensive variants share their cost-substrate. Whoever wove either was paying with the same currency. The lineage note declines to name the currency because the bench can read it directly.",
        voId: "elara.engineering-core.advocate-zyrkoth-protocol-lineage.use",
      },
      talk: {
        narration:
          "You read the closing sentence aloud — the note does not name the substrate's specific composition. The bench's substrate-imaging stage, unprompted, displays the molecular formula the note refuses. The composition is not classified. The composition is unspoken. The two are different protocols; the lineage note keeps the second.",
        voId: "elara.engineering-core.advocate-zyrkoth-protocol-lineage.talk",
      },
    },
    /* ─── storm.architect_of_flux · e1 (flux signature) ─── */
    "storm-flux-signature": {
      look: {
        narration:
          "On the engineering-core's calibration-class instrument bench, a flux signature recovered last cycle and held for chronicle audit. Three properties: unmistakably non-natural; no authorship metadata; detectable everywhere the cosmic-weather record shows equilibrium-crossing patterns. The instrument's reading discipline names it 'Storm-class' by convention. The convention is the only attribution. Nothing on the bench gives the signature a different origin.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e1",
          cluesFound: ["storm.e1.flux_signature"],
        },
      },
      use: {
        narration:
          "You compare the signature against the bench's natural-cosmic baseline. The mismatch is categorical — the signature is engineered, not weathered. The Antiquarian's library carries 4,300 years of natural cosmic-instability readings; none match this signature. The flux is authored. The author is named only by convention, which is the chronicle's confession of its own limit.",
      },
      talk: {
        narration:
          "You name the signature aloud as the convention has it — 'Storm-class.' The bench's calibration register notes the speech and offers, automatically, the convention's history: the name was assigned in epoch one, by an Architect who needed a label and was clear about the choice's limits. The convention has survived four millennia of replacements proposed and refused.",
        voId: "elara.engineering-core.storm-flux-signature.talk",
      },
    },
    /* ─── storm.architect_of_flux · e2 (cosmic energy-balance audit) ─── */
    "storm-energy-balance-audit": {
      look: {
        narration:
          "Beside the flux-signature reading, the Game Master's cult-archivists' cosmic energy-balance audit, brought here for instrument-grade verification. The audit records two structural energy contributors at cosmic scale: a 'volatility-source' and a 'fixed-archive-source.' The bench's pulse-rate measurement of the volatility-source matches the Storm's flux signature to within tolerance. The decay-rate of the fixed-archive-source matches the Silence's information-classification cadence. The interaction-product is the audit's net positive.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e2",
          cluesFound: ["storm.e2.energy_balance_audit"],
        },
      },
      interrogate: {
        narration:
          "You ask the audit for the framework's derivation. The cult-archivists cite the Polarity canon — the Storm and the Silence as opposite poles whose interaction creates the universe's power. The audit instrumented the canon and found numbers consistent with it. The chronicle reads canon as engineering.",
      },
      use: {
        narration:
          "You request the audit's residual error term. The bench reports the interaction-product accounts for every measured cosmic-scale energy contribution to within the instrument's measurement floor. There is no third source. The two-pole model is complete on the bench's evidence; if a third party contributes, it does so below the chronicle's ability to detect.",
        voId: "elara.engineering-core.storm-energy-balance-audit.use",
      },
      talk: {
        narration:
          "You read the audit's net positive aloud. The bench's energy-balance register catches the recital with a chime — the chime is reserved for findings the cult-archivists' framework cannot author away. The chronicle has the reading on record now, in your voice, with the chime as witness.",
        voId: "elara.engineering-core.storm-energy-balance-audit.talk",
      },
    },
    "reactor-coil": {
      look: {
        narration: {
          lucid:
            "The reactor coil rises through the floor grating to chest-height — a ribbed brass-and-steel column running phosphor-green coolant through transparent ducts. The pulse at the base is steady. The hardware is nominal. The schematic in engineering, as we now know, is the part that has been edited.",
          fragmented:
            "The hardware is nominal. The hardware is nominal. The hardware is nominal. He didn't touch the hardware.",
          luminous:
            "The coil is fine. He has, on the evidence, never touched the hardware — only the documentation. That is, in retrospect, the entire shape of his discipline. He does not break things. He breaks the way things are described, so that the next person who has to understand them has to understand them through his version. The coil is intact. The coil's manual is the danger.",
        },
        voId: "elara.engineering-core.reactor-coil.look",
        setsFlag: "eng_core_introduced",
        logsClue: {
          id: "clue-eng-core-hardware-intact",
          title: "Reactor hardware is nominal; only the documentation was edited",
          body:
            "The Engineering Core's reactor coil is operating within nominal parameters. The Editor has never touched the physical hardware on this ship — only the documentation. His discipline is to break the way things are described, not the things themselves.",
          source: "engineering-core",
          order: 0,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the reactor-coil surfaces the Substrate-N
        // encryption residue clue. Lore match: this hotspot is
        // canonically about "the documentation, not the hardware"
        // — and the Syndicate's three-layer rolling-key signature
        // lives in the synthesis substrate's documentation/cipher
        // layer, not in the physical reactor.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e2",
          cluesFound: ["wraith.e2.substrate_n_residue"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The hardware was never the target. Substrate-N residue lives where readers expect — in the documentation. He works on the page.",
            balanced:
              "Wraith and I disagreed about whether the hardware was clean. He was right. The residue is documentation-side, not material-side. Substrate-N is a cipher artifact, not a corrosion one.",
            warm:
              "The coil is honest. It always was. Whoever has to repair this ship in a hundred years will be saved by the fact that the metal kept its shape while the manuals were lying about what shape it had.",
          },
          voId: "human.engineering-core.reactor-coil.look",
        },
      },
      use: {
        narration:
          "You rest a palm against the coil's outer ribbing. The brass is warm, not hot — the reactor running cleanly at its standing draw. The pulse you feel through your hand is the same pulse the ship has carried for two and a half centuries. The hardware is steady. The hardware was always steady.",
        voId: "elara.engineering-core.reactor-coil.use",
      },
      talk: {
        narration:
          "If you address the coil, you address the only continuous voice on the ship. It has been speaking, in pulses, since long before either of us. It does not have words. It has presence. That is, in this room, enough.",
        voId: "elara.engineering-core.reactor-coil.talk",
      },
    },
    "coolant-pipe": {
      look: {
        narration: {
          lucid:
            "The coolant-pipe array runs along the back wall, six lines feeding the secondary loop. The secondary-loop pipes carry the connections the editor redirected on the schematic. The pipes themselves are correct. A future repair would have rerouted them according to the indigo overlayer.",
          fragmented:
            "The pipes are correct. The pipes are correct. The pipes are correct. The repair would not have been.",
          luminous:
            "The coolant pipes are the editor's longest game. Anyone reading the engineering-bay schematic without an original-rubbing would, on the next major repair, reroute the coolant to the lines the indigo overlayer redirected. The reactor would, slowly, run hot. It would die in a year or so. The death would be blamed on the schematic, not on the editor. We have just spared the next engineer that confusion.",
        },
        voId: "elara.engineering-core.coolant-pipe.look",
        logsClue: {
          id: "clue-eng-core-coolant-future-repair",
          title: "Coolant lines would die in the next major repair",
          body:
            "The Engineering Core's coolant-pipe array is correctly routed. Any future repair following the editor's edited schematic (without an original-rubbing) would reroute the coolant to break the secondary loop, killing the reactor over roughly a year. The death would be blamed on the schematic, not on the editor.",
          source: "engineering-core",
          order: 1,
        },
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the coolant-pipe array surfaces the
        // Substrate-N cross-reference clue. Lore match: the
        // secondary loop is the substrate-flow surface where
        // residue-signatures concentrate; spectral analysis of
        // the coolant compares Iron Lion imprint carrier signals
        // against Wraith's protocol-theft residue at three of
        // eleven measurable parameters.
        humanReaction: {
          narration: {
            shadow:
              "Spectral overlap on three of eleven parameters. That is not coincidence. The carrier signals share an engineer.",
            balanced:
              "The substrate-N overlap is the cross-reference Jericho's case needed. Iron Lion imprint signals and Wraith's protocol-theft residue resolve to the same engineer's hand. The pipes carry the proof.",
            warm:
              "Same hand on both. I always thought the carrier-signal work was Wraith's, then I thought it was the Iron Lion's, and now I see it was a third person both of them trusted. The pipes have been telling that story for two and a half centuries; we just learned to listen.",
          },
          voId: "human.engineering-core.coolant-pipe.look",
        },
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e3",
          cluesFound: ["jericho.e3.substrate_n_overlap"],
        },
      },
      use: {
        narration:
          "You trace one of the secondary-loop pipes from the coil to its junction. The brass is correctly stamped at every weld — Lyra's shop-marks, a hundred years before her death and a hundred years after. The actual pipework is exactly what the original schematic ought to have specified. The forgery never reached the metal.",
        voId: "elara.engineering-core.coolant-pipe.use",
        setsFlag: "coolant_loop_traced",
      },
      talk: {
        narration:
          "If you address the loop, the coolant's standing flow note shifts up a quarter-tone — the engineers who maintained these pipes were trained to listen for the change as a sign someone was paying attention. The pipes have been waiting for an attentive ear. They have one again.",
        voId: "elara.engineering-core.coolant-pipe.talk",
      },
    },
    "core-terminal": {
      look: {
        narration: {
          lucid:
            "The core-terminal is a brass console with three oxblood-leather levers — coolant flow, reactor draw, and emergency shutdown. The shutdown lever has an extra lock-plate fitted, signed in Lyra's hand: 'DO NOT THROW WITHOUT WRAITH PRESENT.' Wraith is, currently, not present.",
          fragmented:
            "Wraith. Wraith. Wraith. Without Wraith. Without Wraith. Don't throw without Wraith.",
          luminous:
            "Lyra signed a lock-plate on the emergency shutdown ordering it not be thrown without Wraith Calder in the room. That is unusual — most shutdown procedures require any single qualified engineer. Lyra's procedure required a specific person. She trusted Wraith to be the one who would, in a crisis, also be the one telling her to throw it. She did not, in retrospect, get to throw it. Wraith was already on his transport.",
        },
        voId: "elara.engineering-core.core-terminal.look",
        logsClue: {
          id: "clue-eng-core-shutdown-lockplate",
          title: "Emergency shutdown locked to Wraith Calder's presence",
          body:
            "The Engineering Core's emergency shutdown lever bears Lyra Vox's lock-plate ordering it not be thrown without Wraith Calder present. Lyra's safety protocol required a specific person, not any qualified engineer. She did not get to throw it; Wraith was already on his transport when she died.",
          source: "engineering-core",
          order: 2,
        },
      },
      use: {
        narration:
          "You test each lever's resistance without throwing them. Coolant flow and reactor draw move freely under light pressure — calibrated, maintained, ready. The shutdown lever does not move; the lock-plate has held for two and a half centuries. Wraith is still not present. The ship is still respecting Lyra's order.",
        voId: "elara.engineering-core.core-terminal.use",
      },
      talk: {
        narration:
          "If you address the terminal, the ready-light steadies. The console knows it is being read, and it is glad to be read by someone who isn't going to throw the lever. That, in this room, is the only kind of conversation that matters.",
        voId: "elara.engineering-core.core-terminal.talk",
      },
    },
  },
};
