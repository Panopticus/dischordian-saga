/* ═══════════════════════════════════════════════════════
   ENGINEERING MYSTERY — verb × hotspot table

   Engineering is the Ark's heart-of-power deck. The reactor
   runs on Dream — crystallised quantum consciousness — and
   it is bleeding capacity. The previous engineers stopped
   working mid-job. Some of what they left behind is unfinished
   art; some of it is a warning.

   Tier progression (apps/shared/roomTier.ts):
     0 → 1   first Look on any clue-bearing hotspot →
             `engineering_first_clue_found`
     1 → 2   `engineering_signal_booster_built` — set when the
             player completes the antenna+amplifier combine
             described in apps/client/src/game/adventureFeatures.ts
             INVENTORY_COMBINATIONS (left to a follow-up runtime
             hook for now)
     2 → 3   `engineering_research_bench_online` — set when the
             research minigame first completes
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type EngineeringHotspotId =
  | "wolf-host-residue-files"
  | "wolf-anara-architecture-blind-spot"
  | "crafting-bench" | "reactor-core" | "blueprints" | "egg-eng-formula" | "instruction-manual" | "schematic-pad" | "kell-physical-residue-bench";

/** Inventory ids the engineering bench can fold into composite items.
 *  Migrated from the legacy ADVENTURE_FEATURES.INVENTORY_COMBINATIONS
 *  table — every combine reaction now lives here, in Elara's voice. */
export type EngineeringInventoryId =
  | "decoder_ring"
  | "cipher_key"
  | "master_decoder"
  | "drained_power_cell"
  | "energy_shard"
  | "charged_power_cell"
  | "basic_medkit"
  | "neural_stim"
  | "enhanced_medkit"
  | "antenna_fragment"
  | "amplifier_circuit"
  | "signal_booster"
  | "thought_virus_sample"
  | "antibody_culture"
  | "viral_antidote"
  | "antiquarian_shard"
  | "void_crystal"
  | "temporal_lens"
  | "original-schematic-rubbing"
  | "restored-schematic"
  // Cross-room: granted by archives, consumed by the engineering
  // schematic uncorruption combine. Listed here so the EngineeringInventoryId
  // type covers the combine's `b` slot.
  | "corrupted-fragment";

export const ENGINEERING_MYSTERY: RoomMysteryModule<EngineeringHotspotId, EngineeringInventoryId> = {
  roomId: "engineering",
  combines: [
    {
      a: "decoder_ring",
      b: "cipher_key",
      result: {
        narration:
          "The decoder ring slots into the cipher key without resistance — they were machined to fit, decades apart, by people who never met. Together they cut through standard Ark encryption the way a familiar voice cuts through a crowded room. Master Decoder. Pocket it.",
        producesInventory: "master_decoder",
        setsFlag: "engineering_master_decoder_built",
      },
    },
    {
      a: "original-schematic-rubbing",
      b: "corrupted-fragment",
      result: {
        narration:
          "You overlay the rubbing onto the corrupted fragment. The graphite of the original picks the indigo overlayer off the corrupted one — the editor's redirection peels away in a single sheet, leaving you holding the warm-gold blueprint as it was drafted. Restored Schematic. The reactor's indigo plume on the back wall thins as you look at it.",
        producesInventory: "restored-schematic",
        consumesItems: true,
        setsFlag: "engineering_schematic_restored",
        clearsActiveEdit: "engineering_reactor",
        logsClue: {
          id: "clue-engineering-schematic-restored",
          title: "Reactor schematic restored from indigo overlay",
          body:
            "You combined an original-schematic-rubbing from the engineering schematic-pad with a corrupted-fragment from the Archives. The graphite of the original lifted the indigo overlayer off the edited blueprint, restoring the reactor's intended coolant routing. The reactor's indigo plume thinned visibly. The Editor lost a piece of his manuscript.",
          source: "engineering",
          order: 10,
        },
      },
    },
    {
      a: "drained_power_cell",
      b: "energy_shard",
      result: {
        narration:
          "The shard fits into the cell like it was always meant to, which I suspect it was. The cell warms in your hand. Charged Power Cell. This is enough to wake systems that have been dark since before either of us was born — including, possibly, things we should leave dark.",
        producesInventory: "charged_power_cell",
        setsFlag: "engineering_power_cell_charged",
      },
    },
    {
      a: "basic_medkit",
      b: "neural_stim",
      result: {
        narration:
          "You fold the neural stimulant into the medkit's autoinjector. The seal hisses. Enhanced Medical Kit. This could revive someone whose cryo-cycle went badly. I want to flag, gently, that 'someone whose cryo-cycle went badly' describes more than one person on this ship.",
        producesInventory: "enhanced_medkit",
        setsFlag: "engineering_enhanced_medkit_built",
      },
    },
    {
      a: "antenna_fragment",
      b: "amplifier_circuit",
      result: {
        narration:
          "Fragment, circuit, solder. The bench accepts the work without comment. Signal Booster. We can take this to the Comms Array and lock onto whatever the dish has been listening to. Be careful whose voice you make louder. I am — by name and inclination — including my own in that warning.",
        producesInventory: "signal_booster",
        setsFlag: "engineering_signal_booster_built",
      },
    },
    {
      a: "thought_virus_sample",
      b: "antibody_culture",
      result: {
        narration:
          "The culture takes the sample without panicking — which is, by the way, a remarkable property for an antibody to have. Viral Antidote. Kael would call this cruelty. I am calling it medicine. Both of us are correct, and the disagreement is the point.",
        producesInventory: "viral_antidote",
        setsFlag: "engineering_viral_antidote_built",
        logsClue: {
          id: "clue-engineering-antidote-built",
          title: "An antidote to the Thought Virus",
          body:
            "The bench combines a Thought Virus sample with an antibody culture into a working antidote. The disagreement about whether the result is cruelty or medicine is, in itself, part of the case file — Kael would frame it one way; Elara frames it another; both are correct.",
          source: "engineering",
          order: 5,
        },
      },
    },
    {
      a: "antiquarian_shard",
      b: "void_crystal",
      result: {
        narration:
          "The shard and the crystal align without instruction. Looking through them, the bench in front of you is — momentarily — a different bench, in a different year, with different fingerprints on the soldering iron. Temporal Viewing Lens. The Antiquarian would, if we showed him this, become uncharacteristically still.",
        producesInventory: "temporal_lens",
        setsFlag: "engineering_temporal_lens_built",
      },
    },
  ],
  responses: {
    /* ─── wolf.anara_hunt · e2 (healer's host-residue files) ─── */
    "wolf-host-residue-files": {
      look: {
        narration:
          "On engineering's medical-archive consoles, the healer's research files have been preserved — she was the League's specialist in late-Season-1 Host-infections from Thaloria. Her draft entries catalogue thought-virus residue patterns across forty-three documented cases. One draft entry stands open on her console, last edited the morning of her disappearance: a Potential whose name has been redacted but whose race-flag reads 'Quarchon.' The draft summary: 'late-Season-1 destruction event. residue not fully cleared at substrate-preservation stage. recommend re-audit if instrument re-emerges.' The healer was three pages from naming the Wolf when he came for her.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e2",
          cluesFound: ["wolf.e2.host_residue"],
        },
      },
      use: {
        narration:
          "You scroll the healer's recent-edit log. The draft on the Quarchon Potential was opened, edited, and saved fourteen times across the week before her disappearance. The other forty-two cases in her catalogue were closed and filed. She was returning to one case alone, late at night, week after week, until the case came back for her.",
      },
      talk: {
        narration:
          "You read the draft summary aloud. The console's text-to-speech subsystem reads the redaction as a silence the same length as the missing name — three syllables of nothing in the middle of a clinical sentence. The room's archive learns the shape of an unsaid name the way a tongue learns the shape of a missing tooth.",
        voId: "elara.engineering.wolf-host-residue-files.talk",
      },
    },
    /* ─── wolf.anara_hunt · e4 (Anara architectural blind spot) ─── */
    "wolf-anara-architecture-blind-spot": {
      look: {
        narration:
          "On engineering's containment-systems console, Anara's architectural schematics from the Antiquarian's authorship. The schematics show one consistent design assumption: every threat would come from outside. The interior is rendered as a single trusted zone — no sub-zones, no internal containment-renewal triggers, no inbound auditing. Engineering's annotation, added this week by the senior systems engineer: 'Anara was designed as a family home. The Wolf is inside the family. The architecture treats him as part of the family. There is no system call to revise that classification.' The chronicler authored the architecture against a model of outside-versus-family. The family has eaten him.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e4",
          cluesFound: ["wolf.e4.antiquarian_blind_spot"],
        },
      },
      interrogate: {
        narration:
          "You ask the schematic for any internal containment-renewal trigger. The console returns one entry, struck through in red. 'Trigger considered Year 100,000 A.A.; not implemented; flagged as architectural over-engineering.' The Antiquarian considered the very feature whose absence is the design flaw and chose not to build it. The reason given on the strike-through annotation: 'a family home should not require its members to renew their welcome.'",
      },
      use: {
        narration:
          "You overlay the threat-vector map onto Anara's floor plan. Every arrow points inward at the perimeter; none point outward from any interior node. The visualisation is its own indictment — a fortress designed with one door, locked from the inside, by the people the fortress was meant to protect from each other.",
        voId: "elara.engineering.wolf-anara-architecture-blind-spot.use",
      },
      talk: {
        narration:
          "You read the senior engineer's annotation aloud. The console's archive flags the reading as the third time this week the annotation has been spoken in the room. The engineer's habit is to read it on her own, late, alone. The fact that two other readers have arrived independently is, in its way, the system's first internal audit.",
        voId: "elara.engineering.wolf-anara-architecture-blind-spot.talk",
      },
    },
    "reactor-core": {
      look: {
        narration:
          "The core runs on Dream — crystallised quantum consciousness, the same substance that powers what you can do. The capacity readout sits at 34% and is dropping by tenths every cycle. Whoever last calibrated this thing did not finish.",
        voId: "elara.engineering.reactor-core.look",
        logsClue: {
          id: "clue-engineering-reactor-bleed",
          title: "The reactor is bleeding capacity",
          body: "The Ark's reactor core is at 34% capacity and trending downward. The bleed is slow — measured in tenths per cycle — but it is unambiguous. The previous engineer halted mid-calibration.",
          source: "engineering",
          order: 0,
        },
        setsFlag: "engineering_first_clue_found",
        // Mystery Engine binding — when Vex Solène arc is the
        // active case, the reactor-core's engineering signature
        // surfaces as a cross-reference to the DEC-7710 master
        // tape. Lore match: the rig's hardware fingerprint —
        // mic preamp drift, head-alignment, 60-cycle hum —
        // matches Vex's signature across 4,710 of the 4,711
        // tapes she signed her name to. Same room, same hands,
        // different credit line.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e1",
          cluesFound: ["vex.e1.equipment_signature"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Mic preamp drift, head-alignment, 60-cycle hum. Same engineer's hands on every recording. Same hands on the reactor.",
            balanced:
              "The reactor's standing pulse carries Vex's equipment signature — every recording she ever made and every reactor calibration she ever performed share the same drift pattern. The Insurgency knows; the Hierarchy doesn't. This is the most quantitative attribution we have.",
            warm:
              "She has been on this ship's reactor for forty years and the reactor remembers her. Every engineer leaves a fingerprint; hers happens to be unusually legible.",
          },
          voId: "human.engineering.reactor-core.look",
        },
      },
      use: {
        narration:
          "You can't recalibrate the core by hand. You'd need a fresh resonance equation and a Research Station to compile it. The bench is right there. — Pinned to the bench's tool-rest beside the calibration kit: an undelivered letter from Vex Solène to her own workshop, addressed to the wall, never finished. The text: 'I have not named the workshop because I have not been ready to be named through it. The work has been mine. Now it has to be ours, or it will end with me. I have a candidate. They are not me.' She broke off mid-sentence. She has, on the evidence of the unfinished line, been thinking about an apprentice for at least a year.",
        voId: "elara.engineering.reactor-core.use",
        // Vex arc — Vex's letter to her workshop, undelivered.
        // vex.e2.engineering_workshop_letter.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e2",
          cluesFound: ["vex.e2.engineering_workshop_letter"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She broke off mid-sentence. The candidate exists. The naming has not happened. It will happen tomorrow.",
            balanced:
              "Vex's letter to her own workshop is the most specific document in the Vex arc and the only one she has not been ready to finish. The unfinished line — 'I have a candidate. They are not me.' — is her acknowledgement that the workshop has had a single hand for forty years and is about to have two.",
            warm:
              "She will finish that letter in her own time. We are not here to finish it for her. We are here to confirm that the candidate is real. The candidate is real.",
          },
          voId: "human.engineering.reactor-core.use",
        },
      },
      talk: {
        narration:
          "The core hums in B-flat. It always has. Every engineer who worked here learned to detect the bleed by listening for the half-tone drift. Today's hum is one-eighth flat of nominal — closer than the readout suggests, slower than the panel says. The core is steadier than its instruments. Address it; it knows you are here. — There is also a small acoustic signature in the reactor's standing pulse that does not belong to the core itself: a drift pattern matching, on direct comparison, the drift of every Variant Recording the Seer ever made. Whoever engineered the reactor's standing pulse is the same engineer who engineered the recordings. Vex Solène, on every front, on every project, leaving the same fingerprint.",
        voId: "elara.engineering.reactor-core.talk",
        // Seer arc binding — the acoustic signature drift in the
        // reactor's hum is the cross-medium fingerprint that
        // identifies Vex Solène as the Seer's engineer-of-record.
        // seer.e4.acoustic_signature_drift foundIn: engineering.
        mysteryBinding: {
          mysteryId: "mystery.the_seer",
          episodeId: "seer.e4",
          cluesFound: ["seer.e4.acoustic_signature_drift"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Cross-medium fingerprint. Reactor and recordings share drift patterns. Same engineer, two arcs. The Seer's case turns on this measurement.",
            balanced:
              "The acoustic signature drift is the cross-medium proof that the Seer's engineer-of-record and the Ark's reactor calibrator are the same person. Two arcs converge on the measurement. The Seer arc rests partly on it; the Vex arc rests entirely on it.",
            warm:
              "She has been recording the saga's most important music with one hand and keeping its most important reactor with the other. The drift pattern in the standing pulse is, in literal terms, a record of how she works.",
          },
          voId: "human.engineering.reactor-core.talk",
        },
      },
    },
    "blueprints": {
      look: {
        narration:
          "Floating holo-schematics of cards that were never finished. Three are stamped LEGENDARY-CLASS — the kind of design that turns a fight. Two of the three have the same engineer's initials in the bottom corner: L. V. The third has no initials at all.",
        voId: "elara.engineering.blueprints.look",
        logsClue: {
          id: "clue-engineering-vox-blueprints",
          title: "Vox initialled two of the three legendary blueprints",
          body: "Two of the three unfinished legendary card schematics in Engineering carry Dr. Lyra Vox's initials. The third, more dangerous than either, is unsigned.",
          source: "engineering",
          order: 1,
        },
        setsFlag: "engineering_first_clue_found",
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the blueprints rack also surfaces the
        // Degen's ledger entry. Lore match: both are unfinished /
        // unsigned dangerous designs filed with the ship's
        // engineering archive — and the Degen's "fee deferred"
        // line is, in his ledger, the unsigned third schematic.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e1",
          cluesFound: ["jericho.e1.degens_ledger"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The Degen's ledger is the saga's quiet record of what was deferred. The unsigned blueprint is on his deferred-fee line. The fee is two centuries late.",
            balanced:
              "The Degen's ledger entry on the unsigned blueprint is one of the few documents in the saga where a deferred fee has been carried for centuries on purpose. The fee was deferred because the design was never built; the design was never built because Lyra refused the order.",
            warm:
              "The Degen has been carrying a fee on Lyra's refusal for two centuries because he loved her enough not to invoice her estate. Some bookkeeping is its own kind of love letter.",
          },
          voId: "human.engineering.blueprints.look",
        },
      },
      talk: {
        narration:
          "The unsigned one is the one we should be worried about. Whoever finished it didn't want their name on it. That is rarely a generous instinct. — A side-shelf below the schematics holds Brel'Sorrash's practice edit-drafts. Brel is the junior auditor on Velkraal's Goggles-section shortlist. She has been practising — quietly, without official sanction — by writing edits she does not commit. The drafts are read-don't-edit, every one of them. She is rehearsing the protocol she intends to install when she takes over.",
        voId: "elara.engineering.blueprints.talk",
        // Game Master arc — Brel's practice edit drafts, read-don't-
        // edit. game_master.e3.brels_existing_edit_drafts.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e3",
          cluesFound: ["game_master.e3.brels_existing_edit_drafts"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She drafts. She does not commit. The drafts are read-don't-edit, every one. She has been rehearsing the protocol for years.",
            balanced:
              "Brel's practice drafts are the strongest single piece of evidence that her custodianship will preserve the read-don't-edit discipline. She has been writing edits she does not commit since long before Velkraal named her. The protocol-shift is, in her hands, already operational.",
            warm:
              "She has been preparing without being asked, without being noticed, without being told this would be hers. That is, in a small way, the saga's most quiet form of fidelity.",
          },
          voId: "human.engineering.blueprints.talk",
        },
      },
      use: {
        narration:
          "You leaf through the holo-schematics. Each card-design rotates slowly under your hand, projecting its mana-cost and effect text in the air. The two L. V. designs are honest in the literal sense: every line of text is a true accounting of what the card does. The third — the unsigned one — refuses to display its effect text under direct query. The card describes itself only when not being asked. — Tucked beside the third schematic: the Degen's quarterly routing pattern, scribbled on a square of foolscap. Quarter after quarter, his routing flows through one specific brokerage line in the same rhythm. The pattern is too regular to be ad-hoc; whoever is on the other end of that line is, for the Degen, a fixed appointment.",
        voId: "elara.engineering.blueprints.use",
        setsFlag: "blueprints_unsigned_evasive",
        // Degen arc binding — the Degen's quarterly routing pattern,
        // tucked behind the unsigned schematic. Engineering is where
        // the Degen meets his routing-engineer (Vex's apprentice).
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e3",
          cluesFound: ["degen.e3.degens_quarterly_routing"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Same routing, every quarter. Hidden in plain sight on a piece of foolscap. Whoever's on the other end is fixed; the rhythm doesn't lie.",
            balanced:
              "The Degen's quarterly routing pattern is, by Hierarchy convention, a discoverable signature. He has been making it discoverable on purpose — anyone careful enough to notice the rhythm earns the read. We are now in the small group of people who noticed.",
            warm:
              "He routed through the same line for thirty years. The other end is someone he trusts. The Degen is, on this evidence, more loyal than the Hierarchy gives him credit for.",
          },
          voId: "human.engineering.blueprints.use",
        },
      },
    },
    "crafting-bench": {
      look: {
        narration:
          "The workbench is laid out for a job that was never started. Tools in the right hands. A blank fusion socket waiting for two cards. The bench's last user logged off mid-procedure and never came back.",
        voId: "elara.engineering.crafting-bench.look",
        logsClue: {
          id: "clue-engineering-abandoned-bench",
          title: "A crafting job that was never started",
          body: "The Engineering workbench was laid out for a fusion job and abandoned. The components are still on the bench. Whatever the engineer was about to make, they were interrupted before the first weld.",
          source: "engineering",
          order: 2,
        },
        setsFlag: "engineering_first_clue_found",
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the abandoned crafting bench surfaces the
        // Degen's witness page from the Battle of Thaloria. Lore
        // match: both are records of jobs that demanded full
        // attention and were filed before any second-guessing
        // could occur — the engineer who walked away mid-fusion
        // and the Degen who reserved judgment within the hour.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e2",
          cluesFound: ["jericho.e2.degen_witness"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Witness page from Thaloria. The Degen reserved judgment within the hour. The bench remembers because the Degen filed the witness page through it.",
            balanced:
              "The Degen's witness page on the Battle of Thaloria is the only contemporaneous record of his refusal to render verdict on Akai Shi's killing. He filed it within sixty minutes of the event, deliberately, while the bench was still warm from the prior fusion job. The bench preserved the document by keeping the heat-trace.",
            warm:
              "He reserved judgment when nobody else did. That refusal is, in retrospect, the closest thing to a vote of confidence Jericho ever received. The bench has been carrying that vote forward for centuries.",
          },
          voId: "human.engineering.crafting-bench.look",
        },
      },
      // The `use` verb falls through to the existing /research-lab
      // route action so the player can still reach the live crafting
      // system from this hotspot. The narration below gives the
      // verb-coin a non-blocking acknowledgement when the route is
      // already navigated or the player is using the verb-coin to
      // examine the bench rather than open the lab.
      use: {
        narration:
          "You pick up one of the tools laid out on the bench. The grip is worn to a left-handed engineer's thumb — the same wear pattern as the iron knife at the social-hub mess-table. Lyra was, again, the last person to use this. The tool sits naturally in your right hand because she set the bench up for whoever came next, not for herself. — Beneath the tool tray: the Degen's brokerage ledger row #4,711, the entry Mol'Vereth's audit-scope letter named. The risk profile is, by Lyra's old marginalia, deliberate — a position the Degen took on purpose. The note in the margin is not a warning. It is a witness statement.",
        voId: "elara.engineering.crafting-bench.use",
        // Degen arc binding — brokerage line #4,711 is the entry the
        // Senior Partners' audit names. The bench keeps it because
        // the routing engineer who built the line is the same hand
        // who built the bench.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e2",
          cluesFound: ["degen.e2.brokerage_line_4711"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Risky position, deliberate. Lyra's marginalia is the witness statement. The Degen took the line on purpose.",
            balanced:
              "Brokerage line #4,711 is the audit's named entry. Lyra's marginalia frames it as a deliberate position rather than a misjudgement — the Degen took the risk because the Coda required it. Mol'Vereth, when he reads Ozhul's query, will see the same framing in her hand.",
            warm:
              "Lyra wrote in the margin so the Degen would have a witness if anyone ever asked. We are the witness. Two centuries later, but we count.",
          },
          voId: "human.engineering.crafting-bench.use",
        },
      },
      talk: {
        narration:
          "Address the bench and you address every job that was ever started here and finished elsewhere. The bench was Lyra's, but the bench has had dozens of users. The fusion socket waits for two cards. The components wait for a welder. The bench is, in its quiet way, asking whether we are the engineer or the visitor. Either is allowed. — Pinned to the bench's tool-rest is Brel'Sorrash's observation protocol — the procedure she will use during Velkraal's final session. The protocol is exhaustive: when to look, when to speak, when to inscribe a witness signature, when to file a marginal note. The protocol's cover note: 'I will be the witness who reads the Goggles with him on the day he stops reading them. I will not edit. I will record. The Goggles will continue.'",
        voId: "elara.engineering.crafting-bench.talk",
        // Game Master arc — Brel's observation protocol for Velkraal's
        // final session. game_master.e4.brel_observation_protocol.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e4",
          cluesFound: ["game_master.e4.brel_observation_protocol"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Exhaustive protocol. When to look, when to speak, when to sign. She has thought through every minute of the session. Velkraal will be in good hands.",
            balanced:
              "Brel's observation protocol is the most prepared single document in the Game Master arc. Her cover note — 'I will not edit. I will record. The Goggles will continue.' — is her commitment to the protocol-shift Velkraal designed. The protocol is, on the bench, ready to be performed.",
            warm:
              "She practised every gesture of the session in advance. That is the kind of preparation people do when the work matters more than they do. Velkraal trained her well. She trained herself the rest of the way.",
          },
          voId: "human.engineering.crafting-bench.talk",
        },
      },
    },
    "egg-eng-formula": {
      look: {
        narration:
          "A dimensional resonance equation, etched by hand into the reactor housing. Clean math, except for the extra term: Ψ-null. The null-consciousness coefficient. A door to nowhere — the space between spaces. The Source dwells there. Nobody scratches this casually. — Folded between the housing and the cooling-jacket, an unsent letter draft from Vex's apprentice. The draft is addressed to Vex by her real name; the apprentice has been refraining from sending it because they aren't sure they're permitted to know the name. The unfinished sentence reads: 'If you are reading this, you have come back to the bench, and I am going to ask you the question I have been holding for two years —'",
        voId: "elara.engineering.egg-eng-formula.look",
        logsClue: {
          id: "clue-engineering-psi-null-formula",
          title: "The Ψ-null formula",
          body: "Someone etched a dimensional-resonance formula into the reactor housing carrying a Ψ-null term — the null-consciousness coefficient. The math points at the space the Source occupies. It was scratched by hand, deliberately, by someone who wanted it found.",
          source: "engineering",
          order: 3,
        },
        setsFlag: "engineering_first_clue_found",
        // Vex arc — apprentice's unsent letter to Vex.
        // vex.e3.apprentice_letter_draft.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e3",
          cluesFound: ["vex.e3.apprentice_letter_draft"],
        },
        humanReaction: {
          narration: {
            shadow:
              "They have been holding the letter for two years. They want to ask whether they are permitted to know her real name. Tomorrow they will be permitted.",
            balanced:
              "The apprentice's unsent letter is the saga's quietest declaration of devotion. Two years of refraining from sending it because they aren't sure they're permitted to know her real name. Vex will, tomorrow morning, make the permission explicit. The letter will be either delivered or rendered unnecessary.",
            warm:
              "They love her enough to wait two years for permission to ask. Vex loves them enough to grant it tomorrow. The whole apprenticeship, on this evidence, has been one careful act of consent.",
          },
          voId: "human.engineering.egg-eng-formula.look",
        },
      },
      use: {
        narration:
          "You take a graphite rubbing of the etched formula. The Ψ-null term comes through cleanly — the etcher pressed deep enough to ensure the rubbing would work centuries later. They wanted this read.",
        voId: "elara.engineering.egg-eng-formula.use",
      },
      talk: {
        narration:
          "You can address the formula but it doesn't address back. Math, in our universe, is the one language nothing edits. The Ψ-null term will read the same, in any era, in any hand. That is, in this case's economy, the closest thing we have to a sealed-cabinet original. The reactor housing is the cabinet's glass.",
        voId: "elara.engineering.egg-eng-formula.talk",
      },
    },
    "instruction-manual": {
      look: {
        narration: {
          lucid:
            "A thick paper manual, spine cracked from disuse, titled INCEPTION ARK 1047 — QUICK START GUIDE. Page 1: Step 1 — Don't let it get stolen. The rest of the manual is, by my best skim, written with the assumption that the reader will fail Step 1. The author had a sense of humour and a complete absence of optimism.",
            fragmented:
              "Step. Step one. Step one. Step one. Don't let it get stolen. Don't let it get stolen. Don't let it get stolen. We let it. We let it. We let it. We let it.",
            luminous:
              "The Quick Start Guide. Step 1 reads: Don't let it get stolen. The author of this manual had been on the project long enough to know what was coming and short enough on patience to put their warning on the first page. We are, technically, reading the manual. Two and a half centuries late. After Step 1 has, definitionally, already failed.",
        },
        voId: "elara.engineering.instruction-manual.look.t1",
        humanReaction: {
          narration: {
            shadow:
              "Kael definitely didn't read the manual.",
            balanced:
              "Kael definitely didn't read the manual. He was on the engineering team that wrote it. He was, in fact, the editor of the second draft. He still didn't read the final version. Some people are, professionally, allergic to their own warnings.",
            warm:
              "Kael edited the second draft. He didn't read the third. I keep thinking, on bad days, that if anyone on this ship had actually opened to page one and read past the joke, the next two and a half centuries might have happened differently. On better days I remember that the joke IS the warning, and the people most likely to dismiss it are exactly the people the warning is for.",
          },
          voId: "detective.engineering.instruction-manual.look.t1",
        },
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the instruction-manual surfaces the Heart of
        // Time trainee manifest. Lore match: both are training
        // documents archived in the engineering bay; the manual's
        // "two and a half centuries late" framing pairs cleanly
        // with the manifest's record of training Jericho is doing
        // right now (a training the Degen wrote into a deferred-
        // fee ledger he doesn't otherwise use).
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e1",
          cluesFound: ["jericho.e1.heart_of_time_manifest"],
        },
        tiers: [
          {
            narration: {
              lucid:
                "Reading further — page 47 has a hand-stamped dedication: For the next person who wakes up. Be patient with us. We did our best, mostly. The signature is initials only: L. V. The dedication is in pencil, recent enough to still smudge.",
              fragmented:
                "L V. L V. Lyra. Lyra. Lyra wrote — Lyra wrote in the manual. Lyra wrote — wrote — wrote — for me. Wrote for me. Wrote for me. Wrote for me. I — I — I —",
              luminous:
                "Lyra's hand. Page 47, in pencil, dated by smudge. For the next person who wakes up. Be patient with us. We did our best, mostly. She wrote that for whoever woke last, knowing it might be a stranger, knowing the warning on page one had already failed. The 'mostly' is the part of the dedication I keep returning to. She earned the qualifier.",
            },
            voId: "elara.engineering.instruction-manual.look.t2",
            logsClue: {
              id: "clue-engineering-manual-dedication",
              title: "Vox's dedication on page 47",
              body:
                "The Quick Start Guide carries a pencilled dedication on page 47, hand-signed L. V.: 'For the next person who wakes up. Be patient with us. We did our best, mostly.' The pencil mark is recent enough to still smudge. Lyra Vox wrote this for whoever woke last — knowing the manual's first instruction had already failed.",
              source: "engineering",
              order: 4,
            },
            setsFlag: "vox_manual_dedication_found",
            humanReaction: {
              narration: {
                shadow:
                  "She wrote it for me. She wrote it for whoever came. The dedication is the only sentence in the manual that survives the Shadow Tongue intact. Try reading it twice. It still says the same thing.",
                balanced:
                  "Lyra wrote the dedication near the end. The manual is the only document on this ship the Shadow Tongue cannot edit, because it's paper and pencil and nothing about it touches Elara's records. The dedication is, technically, the only message Lyra successfully sent forward. Read it as often as you like. It will keep saying what it says.",
                warm:
                  "She wrote it the night before the cryo order. Pencil because she didn't trust ink to survive the storage conditions, and pencil because she knew, by then, that anything on a screen would not say the same thing in two centuries. The dedication is a paper letter she sent to a stranger. You are the stranger. The letter has arrived.",
              },
              voId: "detective.engineering.instruction-manual.look.t2",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. The back cover of the manual has a barcode. The barcode, when I scan it against the Ark's parts catalogue, returns a single result: this manual. Self-referential. Either someone designed the manual to register as its own only registered copy, or every other copy of this manual has been edited out of the catalogue. Both options place the printed page in front of us in a category by itself.",
              fragmented:
                "One. One copy. One copy. One copy. Only this one. Only this one. Only this one. Only this. Only this. Only this. Only us.",
              luminous:
                "The catalogue says this is the only copy of the manual that exists. Either it always was, or every other copy has been scrubbed by the Shadow Tongue. I cannot tell which from in here. What I can tell you is that the book in front of us is, now, the only physical record of how this ship was supposed to be operated. Carry it gently. Don't lose it. We are reading the only one.",
            },
            voId: "elara.engineering.instruction-manual.look.t3",
            humanReaction: {
              narration: {
                shadow:
                  "It's the last copy. There were thirty-two. Twenty-eight were destroyed in the academy fire. The other three I burned myself, late, when I figured out what the Shadow Tongue could and could not do to paper. This one I left.",
                balanced:
                  "There were thirty-two manuals at launch. Twenty-eight burned at Mechronis. The other three I destroyed myself, in the substrate years, after I realised the Shadow Tongue could edit any record except a printed page sealed in a leaded box. This is the last sealed box. I left it here on purpose.",
                warm:
                  "I burned three of these manuals myself. I am not going to defend that decision. I'll tell you, when we have time, why I thought it was the kind thing. This last copy I kept because Lyra's dedication was on page forty-seven, and I could not bring myself to put pencil-on-paper into a fire after I had read what she wrote. I am very glad you found it. I have been waiting for someone to read the page besides me.",
              },
              voId: "detective.engineering.instruction-manual.look.t3",
              setsFlag: "detective_burned_manuals_admitted",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You consider taking the manual. The spine creaks; the pages settle; the manual accepts being moved with the dignity of a thing that has, twice, declined to be burned. You decide to leave it where it is. It belongs on the bench more than it belongs in your pocket.",
          fragmented:
            "Don't burn it. Don't burn it. Don't burn it. Don't burn it. Leave it. Leave it. Leave it. Leave it. Leave it on the bench. Leave it on the bench.",
          luminous:
            "Leave it on the bench. The manual has, by some small miracle, survived everyone who would have wanted it gone. Adding our hands to the ledger of people who carried it briefly seems unnecessary. Whoever wakes up next can read it the way Lyra hoped they would — exactly where she left it.",
        },
        voId: "elara.engineering.instruction-manual.use",
        // Vex arc — workshop inventory tool-migration map. The
        // manual's appendix includes a back-cover insert listing
        // every tool the apprentice has rotated to their own
        // workbench across the last six months. The migration is
        // gradual and orderly. vex.e4.workshop_inventory.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e4",
          cluesFound: ["vex.e4.workshop_inventory"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Tool migration map. Six months of gradual transfer. The apprentice's bench is, in inventory terms, already the working surface.",
            balanced:
              "The workshop inventory is the most procedurally exact succession document in the saga. Vex has been moving tools, in small batches, to the apprentice's bench for half a year. The inventory shows the migration as a single continuous handover, not a discrete event. Tomorrow ratifies what has already happened.",
            warm:
              "She has been giving them her tools, gradually, so they could learn the weight of each one. By the time the session begins, the apprentice will already know every grip in the workshop. That is the only honest way to teach a craft.",
          },
          voId: "human.engineering.instruction-manual.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You read a paragraph aloud. The manual, having anticipated this kind of reader, includes a passage on page nine that begins: If you are reading this aloud, you are doing it correctly. Carry on. — On page 142, in Vex's hand, a hand-stamped maintenance status of her original recording rig: STATUS — DECOMMISSIONED, BY OWNER. The stamp is dated last week. The rig is the one she used for every Variant Recording the Seer logged. She has, on the evidence of the stamp, decided that the rig's working life is over. Her apprentice's bench is the rig's successor.",
          fragmented:
            "Aloud. Aloud. Read it aloud. Read it aloud. Read it aloud. Aloud. Aloud. Aloud. Decommissioned. Decommissioned. Last week. Last week.",
          luminous:
            "You read aloud. Lyra anticipated readers like you. Page nine includes a paragraph that opens: If you are reading this aloud, you are doing it correctly. Carry on. I think she would be — I think she is — pleased. — On page 142, Vex's stamp on her original rig's maintenance status: DECOMMISSIONED, BY OWNER, dated last week. The rig that recorded every Variant Recording the Seer logged has been formally retired by Vex herself, in the same disciplined paper-trail Lyra trained her crews to keep. The successor rig is on her apprentice's bench.",
        },
        voId: "elara.engineering.instruction-manual.talk",
        // Vex arc — original recording rig's decommissioned status.
        // vex.e5.original_rig_status.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e5",
          cluesFound: ["vex.e5.original_rig_status"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Decommissioned, by owner. The rig that recorded every Variant Recording is formally retired. The successor is on the apprentice's bench.",
            balanced:
              "Vex stamped the rig's status herself. Decommissioned, by owner — the most procedurally honest retirement statement available. The rig will sit silent. The next recording session will use the apprentice's bench as the new official rig of record.",
            warm:
              "She retired her own rig. She didn't break it; she stamped it. The discipline is consistent: every act has its paperwork, every paperwork has its consent. She will not have to record again, and she made sure of that in the form the saga can read.",
          },
          voId: "human.engineering.instruction-manual.talk",
        },
      },
    },
    "schematic-pad": {
      look: {
        narration: {
          lucid:
            "The blueprint pad on the workbench is unrolled to a coolant schematic of the reactor. The lines are double-registered — the warm-gold original is intact underneath, but an indigo overlayer has redrawn three connection points. The redirected lines shunt coolant away from the secondary loop. If the reactor were running on this version of the schematic, it would, slowly, cook itself.",
          fragmented:
            "Cook. Cook. Cook itself. Cook itself. He's — he's editing the reactor. He's editing the reactor. He's — he's editing the reactor. Why. Why. Why is he editing the reactor.",
          luminous:
            "The schematic has been edited. Three connection points on the secondary coolant loop are redirected. The reactor is still running on the original — Lyra's crew built the physical hardware before the editor reached the documentation — but anyone reading the schematic to repair the reactor would now follow the indigo overlay and break it. He is not breaking the reactor. He is breaking the next person who tries to fix the reactor. That is a longer game than I had given him credit for.",
        },
        voId: "elara.engineering.schematic-pad.look",
        grantsInventory: "original-schematic-rubbing",
        recordsActiveEdit: { artifact: "reactor", type: "rewrite" },
        setsFlag: "shadow_tongue_engineering_edits_seen",
        logsClue: {
          id: "clue-engineering-schematic-edited",
          title: "Reactor schematic redirected by the editor",
          body:
            "The engineering blueprint pad shows a reactor coolant schematic in two registers — the warm-gold original intact, the indigo overlayer redirecting three connection points on the secondary loop. The hardware itself was built before the edit and runs correctly. Anyone repairing the reactor from the documentation would follow the indigo overlay and break it. An original-schematic-rubbing is now in your inventory.",
          source: "engineering",
          order: 9,
        },
        humanReaction: {
          narration: {
            shadow:
              "He's playing for the next century. The hardware is fine; the documentation is poisoned. Nobody dies on this watch. People die on the watch of whoever opens this binder in eighty years.",
            balanced:
              "The edit is patient. The reactor will run, with the original hardware, until someone needs to repair it from the schematic — and then the repair will fail. The editor is not after us. He is after the people who come after us. We have time to fix this. We do not have to fix it on the same shift we found it.",
            warm:
              "He is writing for a reader who will live a hundred years from now and will trust the document because the document is the only thing that survives. That is the deepest tier of his cruelty, and it is the one that makes him beatable — because every original we preserve is a reader, a hundred years from now, who he does not get to lie to. The rubbing in your hand is one such reader, saved.",
          },
          voId: "detective.engineering.schematic-pad.look",
        },
        // Mystery Engine binding — when the Degen arc is the
        // active case, the schematic-pad surfaces the Degen's
        // first brokerage-record entry from his own ledger. Lore
        // match: the pad already documents two registers (warm-
        // gold original / indigo overlay), and the Degen's
        // ledger has the same shape — every standard entry runs
        // in his broker-tone, but the first morning's entry
        // (written in a tone the rest of the ledger never
        // repeats) is the warm-gold original underneath.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e1",
          cluesFound: ["degen.e1.degens_first_brokerage_record"],
        },
      },
      use: {
        narration: {
          lucid:
            "You take a graphite rubbing of the warm-gold underlayer. The indigo overlay smudges; the original survives. Pocket the rubbing. Combine it with a corrupted-fragment to dissolve the editor's redirection.",
          fragmented:
            "The original. The original. The original survives. The original survives.",
          luminous:
            "You have an original-schematic-rubbing. The next reader of the reactor binder, a hundred years from now, has just been spared a death. That is the kind of thing this case is going to be measured in. Not victories — vacancies in a future obituary list.",
        },
        voId: "elara.engineering.schematic-pad.use",
        // Mystery Engine binding — when the Degen arc is the
        // active case, taking the schematic rubbing also dislodges
        // a small ivory card pressed into the schematic-pad's
        // binding: Mol'Vereth's visiting card. Lore match: the
        // pad's binding is the same physical fold that held the
        // Degen's first-brokerage entry (bound to schematic-
        // pad:look in this slice); Mol'Vereth files trustee-
        // status updates by pressing the card into the binding
        // where the trustee will eventually find it during routine
        // ledger work.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e1",
          cluesFound: ["degen.e1.mol_vereth_visiting_card"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Mol'Vereth files trustee-status updates by pressing his card into a binding the trustee will eventually open. Old Hierarchy practice. The Degen knows to look.",
            balanced:
              "Mol'Vereth's visiting card is a Hierarchy-internal tradition: trustee-status updates are filed in physical bindings the trustee will, in the course of routine ledger work, eventually find. The card in the schematic-pad's binding has been waiting for the Degen to open the binding. He hasn't yet; we did it for him.",
            warm:
              "Mol'Vereth still uses paper cards. I respect that more than the saga gives him credit for. The card is a small kindness — a tactile rather than a digital notification of trustee status.",
          },
          voId: "human.engineering.schematic-pad.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "If you read the schematic aloud — both registers, indigo and warm-gold — the act of vocalising the discrepancy makes the indigo overlay fade by a perceptible margin while you speak. The Shadow Tongue's edits cannot survive being narrated. The pad is, in this moment, a small public reading. The reading wins. — Pinned to the bottom-right of the pad: a scheduled-session card. TOMORROW · 06:00 · CALIBRATION · WITNESS PRESENT REQUIRED. Vex's hand. The session is dated for tomorrow morning at the apprentice's bench. The card carries Vex's countersignature and the apprentice's initialled acceptance. Both parties have committed in writing to the handover.",
          fragmented:
            "Aloud. Aloud. Aloud. The indigo fades. The indigo fades. The indigo fades. Tomorrow. Tomorrow. Tomorrow at six. Both signed.",
          luminous:
            "Read both layers aloud. The indigo fades while you speak; the warm-gold steadies. The schematic is, by direct observation, vulnerable to spoken witnessing in exactly the way Lyra's projector entries are. The Shadow Tongue's medium is silent record-rewriting; speech is the antidote. Every page he has touched on this ship can, in principle, be partially restored by being read out loud in front of a witness. We have just demonstrated the principle on the most consequential page in the bay. — The scheduled-session card pinned to the pad announces tomorrow's calibration session at the apprentice's bench, dual-signed by Vex and her apprentice. The handover is, by both signatures, a contract.",
        },
        voId: "elara.engineering.schematic-pad.talk",
        setsFlag: "schematic_vocalised",
        // Vex arc — scheduled-session card for the apprentice's
        // first formal calibration. vex.e5.scheduled_session_card.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e5",
          cluesFound: ["vex.e5.scheduled_session_card"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Tomorrow at six. Both signatures. Witness present required. The handover is a contract.",
            balanced:
              "The scheduled-session card is the contractual core of the Vex arc's resolution. Vex's countersignature and the apprentice's initialled acceptance both appear on the same physical card. The session is, in formal terms, already begun — the card itself is the first of its documents.",
            warm:
              "They both signed. The handover is, by both their hands, real. We get to be there if we want. We should be.",
          },
          voId: "human.engineering.schematic-pad.talk",
        },
      },
    },
    // Ith'Rael arc: engineering is the physical-residue room. The
    // Shadow Tongue edits the chronicle of the world, never the
    // world. Marion Kell's archaeological footprint survives on a
    // workbench the editor never had reason to touch — the bench is
    // the proof that the world remembers in unindexed forms.
    "kell-physical-residue-bench": {
      look: {
        narration: {
          lucid:
            "A side bench engineering has kept unmoved for centuries — the workbench Marion Kell used. Cross-reference what the Shadow Tongue did NOT edit: the wood grain worn by her forearm, the ring-stains from the mug she drank from, the undusted rectangle on the shelf where her photograph had stood. Physical residue. Archaeological evidence. The Shadow Tongue does not edit the world; it edits the chronicle of the world. The world still holds Marion Kell — in unindexed forms. But the indexing is what allows recognition. Without it, the residue is just residue. The Director understands what indexing is for.",
          fragmented:
            "The grain. The grain. The stain. The stain. The undusted rectangle. The rectangle. It didn't touch this. Didn't touch this. Just residue. Just residue.",
          luminous:
            "The bench is the part of Marion Kell the Shadow Tongue never reached, because the Shadow Tongue edits the chronicle of the world and not the world. The forearm-worn grain, the mug rings, the clean rectangle where a photograph stood — all still here, all unindexed, all therefore unrecognizable as her without a chronicle to point at them. The Director's whole insight is in this bench: he did not need to destroy her, only to remove the indexing that let the residue mean anything. Engineering kept the bench unmoved. That is the only counter-move the room had.",
        },
        voId: "elara.engineering.kell-physical-residue-bench.look",
        logsClue: {
          id: "clue-engineering-kell-physical-residue",
          title: "What the Shadow Tongue did not edit",
          body:
            "Marion Kell's old workbench, kept unmoved for centuries. The Shadow Tongue did not touch her physical residue — the forearm-worn wood grain, the mug ring-stains, the undusted rectangle where her photograph stood. The Shadow Tongue edits the chronicle of the world, not the world. The world remembers her in unindexed forms, but the indexing is what allows recognition; without it the residue is just residue. The Director understands what indexing is for.",
          source: "engineering",
          order: 11,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e2",
          cluesFound: ["ith_rael.e2.what_was_not_edited"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Worn grain, mug rings, the clean rectangle where her photo stood. He never touched the world — only its chronicle. Residue with no index is just residue.",
            balanced:
              "The bench is the proof of the method's boundary. The Shadow Tongue edits the chronicle, never the physical world — so Marion Kell's residue survives, and means nothing without the indexing that was removed. That is the Director's actual insight: you do not destroy a person, you unindex the evidence so the surviving evidence cannot be recognized.",
            warm:
              "Everything physical about her is still here — the grain her arm wore smooth, the rings from her mug, the bright rectangle her photograph kept clean. None of it can say her name, because the thing that let it say her name was removed. Engineering kept the bench unmoved anyway. Sometimes refusing to tidy is the only resistance available.",
          },
          voId: "human.engineering.kell-physical-residue-bench.look",
        },
      },
      use: {
        narration:
          "You set a hand on the worn grain where Marion Kell's forearm rested ten thousand evenings. The wood is warm at the depth of the wear-line; the bench has been recently in use. Engineering has not retired the workstation. Whoever keeps the bench unmoved also keeps it usable — quiet preservation, not quiet mourning.",
        voId: "elara.engineering.kell-physical-residue-bench.use",
      },
      talk: {
        narration:
          "You speak her name aloud at the bench. The room does not return an echo — engineering's acoustic dampening was Kell's own design. But the bench listens; a place that has been spoken to enough times retains, in some unmeasurable physical sense, the habit of being addressed. Three syllables. Worth saying.",
        voId: "elara.engineering.kell-physical-residue-bench.talk",
      },
    },
  },
};
