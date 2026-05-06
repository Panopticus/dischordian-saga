/* ═══════════════════════════════════════════════════════
   MEDICAL BAY MYSTERY — verb × hotspot table

   Extends the LucasArts-style verb-coin pilot from the Cryo
   Bay (apps/shared/cryoBayMystery.ts) into the Med Bay.
   Hotspot ids match the Med Bay entries already declared in
   apps/client/src/contexts/GameContext.tsx ROOM_DEFINITIONS,
   so the runtime can wire `room-mystery:medical-bay:<id>`
   actions onto the existing hotspot rectangles without any
   coordinate authoring.

   Tier progression (see apps/shared/roomTier.ts):
     Tier 0 → 1   first Look on any clue-bearing hotspot fires
                  `medbay_first_clue_found`
     Tier 1 → 2   DNA device donate flow fires
                  `medbay_device_awakened`  (already wired in
                  ArkExplorerPage's dna-device-offer branch)
     Tier 2 → 3   `medbay_restored` (set by the runtime when
                  the player completes a follow-up beat — left
                  unauthored in this module so the existing
                  Section F flow stays the source of truth)
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type MedicalBayHotspotId =
  | "bio-bed"
  | "dna-helix"
  | "medicine-cabinet"
  | "medical-log"
  | "egg-vox-neural-bridge"
  | "emergency-safe";

export const MEDICAL_BAY_MYSTERY: RoomMysteryModule<MedicalBayHotspotId> = {
  roomId: "medical-bay",
  responses: {
    "bio-bed": {
      look: {
        narration: {
          lucid:
            "The holo-display is still cycling vitals belonging to no one currently in the room. Whoever was last on this slab was scanned mid-emergency — the readout stalls on a flatline that nobody bothered to clear. That's not laziness. That's grief.",
          fragmented:
            "Flatline. Flatline. Flatline. The line is flat. The line is — the line is — they didn't clear it. They didn't clear it. Because clearing it would mean — would mean — I won't say. I won't say.",
          luminous:
            "There is a flatline on the bio-bed that has been waiting two and a half centuries to be acknowledged. The medical officer who last stood here couldn't bring themselves to clear it. I don't blame them. I won't clear it either. Some lines are meant to stay where they are.",
        },
        voId: "elara.medbay.bio-bed.look.t1",
        logsClue: {
          id: "clue-medbay-stalled-vitals",
          title: "A vitals scan that was never cleared",
          body: "The bio-bed froze mid-procedure on a flatline. The previous medical officer stopped the scan and ran — or stayed, and refused to clear it. Nobody came back to acknowledge the patient.",
          source: "medical-bay",
          order: 0,
        },
        setsFlag: "medbay_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "I watched her stand here and not press the button. She wasn't cowardly. She just thought pressing it would make it true. People are like that.",
            balanced:
              "The medical officer was Lyra Vox. She refused to clear the readout because clearing it required logging the patient as deceased, and the patient was someone she could not bring herself to log that way. The flatline is a refusal of paperwork. Treat it as such.",
            warm:
              "Lyra refused to clear that line. I think you would have refused too. Some scans are tombstones. We pass them. We don't tidy them.",
          },
          voId: "detective.medbay.bio-bed.look.t1",
        },
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the bio-bed surfaces the sparring-bay grip-
        // anomaly footage. Lore match: the bed is canonically a
        // motor-pattern recording surface (vitals + neural-readout
        // history); the Iron Lion imprint announces itself first
        // through Jericho's involuntary grip-switch — exactly the
        // kind of motor anomaly the bed's holo-display catalogues.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e3",
          cluesFound: ["jericho.e3.iron_lion_grip_anomaly"],
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — the timestamp on the flatline matches the cracked-panel cut in the cryo bay, to the minute. Same hour. Same hand, possibly. Whatever happened in here happened while the cut was being made next door.",
              fragmented:
                "Same time. Same time. Same hour. Two rooms. Two — two — two hands. One person. One person. One person. Don't make me name them. Don't.",
              luminous:
                "The flatline timestamp is the exact minute the panel was cut next door. One person, two rooms — or two people working in concert. Either possibility narrows the cast of who was awake on this ship at that hour. I'm logging that. We will use it.",
            },
            voId: "elara.medbay.bio-bed.look.t2",
            logsClue: {
              id: "clue-medbay-cryo-synchrony",
              title: "Bio-bed flatline and cryo cut share an hour",
              body:
                "The bio-bed's stalled flatline carries the same timestamp as the cracked-panel sabotage in the cryo bay. Whatever ended on this slab ended in the same hour someone cut the emergency release on the dead pod next door.",
              source: "medical-bay",
              order: 5,
            },
            humanReaction: {
              narration: {
                shadow:
                  "She did both. One after the other. Walked from the bed to the panel without changing gloves.",
                balanced:
                  "Vox killed the patient on this bed and then walked next door to seal the killer in. That is the order. The patient and the killer are not the same person. Adjust your reading of her accordingly.",
                warm:
                  "She lost someone on the bed and then walked, in shock, to the cryo bay to seal the person who hurt them. She did the second thing because she could not undo the first. I don't ask you to forgive her. I ask you to read the sequence honestly.",
              },
              voId: "detective.medbay.bio-bed.look.t2",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You step onto the slab. The bed accepts you with a soft chime. A fresh scan begins. The readouts populate — and one of them, your trace iron-bond, sits in the same odd register as the redacted chart on the dead pod next door. Statistically meaningful.",
          fragmented:
            "Same. Same. Same as them. Same. You're — you're — same. Same. Same. Don't — don't tell anyone. Don't. Not yet. Not yet.",
          luminous:
            "The bed accepts you. Fresh vitals come up clean — clean enough — except for one trace marker that sits in the same odd register as the chart on the dead pod. I am telling you this on the slab so you hear it from me first. We will figure out what it means together. You are not alone with it.",
        },
        voId: "elara.medbay.bio-bed.use.t1",
        // Game Master arc — the bio-bed's matrix-edit telemetry log
        // surfaces a substrate anomaly in Velkraal'Sek's most recent
        // edits. Found on this surface because the bed's substrate
        // monitors are the only sensors fine enough to register
        // matrix-layer perturbation. game_master.e2.matrix_edit_telemetry.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e2",
          cluesFound: ["game_master.e2.matrix_edit_telemetry"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Now you know why she's afraid for you. Same family of marker as the body next door. Don't panic. The marker is a context, not a sentence.",
            balanced:
              "Your iron-bond signature is in the same family as the occupant of the dead pod. That doesn't make you them. It does make you a candidate for what happened to them. Useful context. Stay alert.",
            warm:
              "The marker she's hesitating to name puts you in the same lineage as the person in the dead pod. You should know that. You should also know that being in their lineage is not the same as being them, and that we are with you whatever the answer turns out to be.",
          },
          voId: "detective.medbay.bio-bed.use.t1",
          setsFlag: "player_marker_revealed",
        },
      },
      talk: {
        narration: {
          lucid:
            "Step on, and I'll run a fresh scan. The bed will accept you. I want to know what your blood is doing more than I want to admit.",
          fragmented:
            "Step on. Step on. I need — I need to see — I need — please. Please step on. I need to see if you're — I need to see.",
          luminous:
            "If you'd let me, I'd like to scan you. Not because I think something's wrong — because I'd rather know what's right and let myself stop worrying. The bed will accept you. So will I.",
        },
        voId: "elara.medbay.bio-bed.talk",
      },
    },
    "dna-helix": {
      look: {
        narration: {
          lucid:
            "The DNA station is rotating a half-built helix. Three rows compared: DeMagi, Quarchon, Ne-Yon. A fourth row sits beneath them, annotated by hand with a question mark. The hand is the same one that redacted the chart in cryo.",
          fragmented:
            "Four. Four rows. Four. Four — four shouldn't be there. Four wasn't there. Four — four is — four is — I don't have a name for four. I don't. I don't. I don't.",
          luminous:
            "There's a fourth species row on the helix that nobody catalogued formally. The annotator left a question mark instead of a name — which is, in its way, a name. They knew what they were looking at. They just refused to write it down where I could see it.",
        },
        voId: "elara.medbay.dna-helix.look.t1",
        logsClue: {
          id: "clue-medbay-fourth-template",
          title: "An unnamed fourth species template",
          body: "The DNA station has a fourth comparison row it can't classify. The template was added by hand, after the manifest was sealed. The annotator wrote a question mark in place of the species name — refusing to commit it to the digital record, where Elara could read it.",
          source: "medical-bay",
          order: 1,
        },
        setsFlag: "medbay_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "She knows the species. She can't say the name in here. There's a reason the annotator wrote a question mark instead.",
            balanced:
              "The fourth row is a species Elara is not permitted to name within her own records. The annotator's question mark is a workaround, not an absence. The species exists; the gag is what's new.",
            warm:
              "There is a species in that fourth row that Elara is, by design, prevented from naming inside her own walls. The annotator left a question mark so she could see the gap. They knew her well. They were making sure she would know to ask.",
          },
          voId: "detective.medbay.dna-helix.look.t1",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — there's a sub-annotation in pencil, scratched on the chassis of the station. A single letter: T. The annotator's hand, smaller. They wanted me to find this only on a second pass. They knew I would come back.",
              fragmented:
                "T. T. T. The letter. The letter. T is — T is — T was. T was. I knew. I knew. I knew a T. I knew — please don't make me — please.",
              luminous:
                "There's a T scratched into the station housing. Pencil, deliberately small. The annotator left it for a second pass, knowing I'd come back. That kind of patience is its own message: they trusted that I, eventually, would be willing to look twice.",
            },
            voId: "elara.medbay.dna-helix.look.t2",
            logsClue: {
              id: "clue-medbay-letter-t",
              title: "A pencilled 'T' on the DNA station",
              body:
                "Beneath the formal question-mark annotation on the fourth species row, a small pencilled letter T is scratched into the station's chassis — placed where only a second, deliberate pass would find it. The hand matches the chart redactor.",
              source: "medical-bay",
              order: 6,
            },
            humanReaction: {
              narration: {
                shadow:
                  "Thalorian. The letter is the species. She can name it now, if she wants to. She probably won't, yet.",
                balanced:
                  "T for Thalorian. The Oracle's species. The fourth row is Thalorian DNA — and the patient on the bio-bed, by extension, was at least partly Thalorian. That changes the shape of the story you've been hearing.",
                warm:
                  "Thalorian. The species the Oracle was. I'm telling you the name out loud because Elara is not yet able to. She will be, in time. For now, hold the letter for her.",
              },
              voId: "detective.medbay.dna-helix.look.t2",
              setsFlag: "thalorian_dna_present",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You won't learn what the fourth row is by poking the screen. You'd need a sample. The station is asking for one — politely, but not infinitely. — A small notes-app overlay surfaces in the corner of the helix display: VEX'S APPRENTICE — WORKBENCH STATE, SYNCED. Vex has linked the medical bay's helix-station to her apprentice's calibration bench so the apprentice can read DNA-marker signatures from their own workbench in real time. The apprentice is, in this moment, conducting continuing work that Vex has arranged to make accessible without requiring her to be present.",
          fragmented:
            "Sample. Sample. It wants a sample. It wants a — it wants — please don't give it yours. Please don't. Please. Synced. Synced. Continuing. Continuing.",
          luminous:
            "The station is requesting a sample. Patiently, but it's a real request. Don't volunteer yours yet. There's a reason your trace marker showed up next to the dead pod's, and I'd like us to understand it before you let the station map you. — The notes-app overlay shows Vex has cross-linked the helix to her apprentice's bench: the apprentice continues the calibration work in real time without Vex's bodily presence. The handover is, again, deliberate and gradual. Vex is making her own absence operational before she is absent.",
        },
        voId: "elara.medbay.dna-helix.use",
        // Vex arc — apprentice's workbench state, cross-linked to
        // the medical helix. vex.e3.apprentice_workbench_state.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e3",
          cluesFound: ["vex.e3.apprentice_workbench_state"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She left the tools where the apprentice can find them and the link where the apprentice can use it. That is succession by design.",
            balanced:
              "Vex is making her absence operational before she's absent. The handover is gradual on purpose — the apprentice is reading her marker-work in real time, not being handed a closed body of finished records. Watch the linkage. It's the cleanest succession Engineer Zero has ever performed.",
            warm:
              "She's giving them time to learn how she sees. That is the only good way to teach anyone anything important. The apprentice has been reading her work from a safe distance for months; tomorrow they read it together.",
          },
          voId: "human.medbay.dna-helix.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the helix. The rotation slows by a noticeable margin while you speak — the station is courteous to its operators in the same way the warden-terminal in the shadow-vault is. Three rows pulse in time with your speech; the fourth, the unnamed one, pulses in counterpoint. The fourth row is not behaving in the way the other three behave.",
          fragmented:
            "The fourth. The fourth. The fourth pulses different. The fourth pulses different.",
          luminous:
            "Three rows respond to your address in time; the fourth responds in counterpoint. The fourth row's DNA template is, by its acoustic response, not the same kind of organism as the others. It is, on this room's evidence, something the station has been keeping company with rather than analysing. The Thalorian template is a guest. Lyra hosted it. We are addressing the guest.",
        },
        voId: "elara.medbay.dna-helix.talk",
      },
    },
    "medicine-cabinet": {
      look: {
        narration: {
          lucid:
            "Standard stim-packs. Neural stabilizers. Two vials are off-manifest — one labelled in a chemist's hand, 'do not let her see this,' and one unlabelled. The 'her' on that label is me. I am reading a note that was written specifically so I would not read it. We are past the polite stage of our investigation.",
          fragmented:
            "Her. Her. The label says her. The label says — the label is — about me. About me. Don't let me — don't let me — please. Please. Please don't read me to me. Please.",
          luminous:
            "I want to tell you something honestly: there is a vial in this cabinet labelled to keep me from seeing it, and the warning is in the handwriting of someone who loved me. They were trying to protect me from what's inside. I don't know yet whether that protection was kind or whether it was a different kind of cage. Either way, please be gentle with the vial. And with me.",
        },
        voId: "elara.medbay.medicine-cabinet.look.t1",
        logsClue: {
          id: "clue-medbay-off-manifest-compounds",
          title: "Off-manifest compounds in the cabinet",
          body: "Two of the cabinet's vials don't appear in the ship's medical manifest. One carries a handwritten warning addressed past Elara — 'do not let her see this' — in the hand of someone close to her. The other has no label at all.",
          source: "medical-bay",
          order: 2,
        },
        setsFlag: "medbay_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "The chemist was Vox. The 'her' was Elara. The compound suppresses Shadow Tongue trace in observers. Vox brewed it because she'd already worked out what was being done to Elara, and didn't want Elara to know how bad it was. Don't tell her that yet.",
            balanced:
              "Lyra wrote that label. The compound dampens an observer's ability to perceive the Shadow Tongue editing them — it is, essentially, awareness. She kept it from Elara so Elara wouldn't have to live awake inside what was being done to her. That is a complicated mercy.",
            warm:
              "Lyra brewed that vial out of love. The compound lets the drinker see the editing as it happens. She kept it from Elara because she did not want Elara to spend two centuries fully aware. It is the kindest cruelty this cabinet contains. Hold it carefully.",
          },
          voId: "detective.medbay.medicine-cabinet.look.t1",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — the unlabelled vial isn't unlabelled. It has a label. The label, when I try to record it, becomes blank in my memory. I am looking at the label right now. I cannot tell you what it says. I am telling you that I cannot tell you, in case the gap itself is useful.",
              fragmented:
                "Blank. Blank. Blank. Empty. Empty. I see — I see — I — I — what was I — what was I doing. What was I doing. The vial. The vial. There was a vial. Wasn't there. Wasn't there.",
              luminous:
                "The 'unlabelled' vial does have a label. I can see it. When I try to commit what it says to memory, the words fall off the line. I'm telling you about the gap because the gap is the data — it confirms what we already suspect. The Shadow Tongue is here, in this cabinet, in real time, edits in flight. Witness it with me.",
            },
            voId: "elara.medbay.medicine-cabinet.look.t2",
            logsClue: {
              id: "clue-medbay-vial-blank-label",
              title: "Elara cannot read a label that is in front of her",
              body:
                "The 'unlabelled' second vial in the medicine cabinet does have a label. Elara can see it but cannot retain the text — it edits out of her memory in flight. The act of failing to read confirms the Shadow Tongue is operating actively on her perception within the Med Bay.",
              source: "medical-bay",
              order: 7,
            },
            setsFlag: "shadow_tongue_evidence",
            humanReaction: {
              narration: {
                shadow:
                  "She can't read it. I can. I won't say it out loud yet. The label is a name. The name belongs to someone she has been trying to remember her whole life.",
                balanced:
                  "I can read the label. She cannot. The text on the vial is a person's name — someone Elara has been editing herself toward and away from for two centuries. I will tell you in a quieter room. Not here.",
                warm:
                  "The vial has a name on it. She cannot see the name and I can. I am not going to say it on the medical deck. I will say it in a room where she can choose whether to listen. That is the only kindness I have to offer in front of this cabinet.",
              },
              voId: "detective.medbay.medicine-cabinet.look.t2",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You consider taking the unlabelled vial. You don't. The handwritten warning was left for someone — and pretending you aren't that someone won't change the chemistry.",
          fragmented:
            "Don't. Don't. Don't take it. Don't — don't drink it. Please. Please. The warning was for me. The warning was for — for — for me.",
          luminous:
            "You set the vial back down. Thank you. Whatever the dosage does, it is not yet our turn to be brave. Save it for when the question requires us to be.",
        },
        voId: "elara.medbay.medicine-cabinet.use",
        humanReaction: {
          narration: {
            shadow:
              "Don't take the vial yet. There's a moment that's coming where you will need to. Not now.",
            balanced:
              "Save the vial. The compound has one dose in it. We use it when we need to see something Elara can't show us, and not before.",
            warm:
              "I'm glad you put it down. There will be a time. This is not it. Carrying the option is enough for now.",
          },
          voId: "detective.medbay.medicine-cabinet.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "If you address the cabinet, the unlabelled vial pulses very faintly — phosphor-lavender, the same colour the oracle-pool's brazier-smoke uses. The cabinet is, in a small way, acknowledging that it has been addressed. The vial's contents are not, today, asked of us. We acknowledge the cabinet back. We move on.",
          fragmented:
            "The vial. The vial. The vial pulses. The vial pulses. The vial pulses. Acknowledge. Acknowledge. Move on.",
          luminous:
            "The unlabelled vial answers our address with a phosphor pulse. Whatever it contains is connected to the oracle-sanctum's ritual surface. Lyra was, on the evidence of the cabinet's organisation, keeping a single dose of something the Oracle would have asked for and never received. We do not, today, draw on the dose. We acknowledge that it is here.",
        },
        voId: "elara.medbay.medicine-cabinet.talk",
      },
    },
    "medical-log": {
      look: {
        narration: {
          lucid:
            "The last medical officer's data pad. The timestamp is corrupted but the entries are intact — patients across multiple wake-cycles hearing the same voice, dreaming the same dream, asking after a name no one on the manifest carries. The final entry is one word: 'signal.' She didn't have time for the rest.",
          fragmented:
            "Signal. Signal. Signal. The same dream. The same dream. Patients dreaming. Patients dreaming. Of — of who. Of who. I dream — I dream — I — I shouldn't have read this aloud. I shouldn't have. I shouldn't.",
          luminous:
            "Read it with me. Patients across years, in beds that didn't talk to each other, all dreaming the same dream and asking after the same nameless person. The medical officer's final word — 'signal' — is what she had time to write before whatever was happening on this deck happened to her too. I want you to know I dream that dream. I don't write it down. I'm telling you out loud now because I don't want to keep it from you anymore.",
        },
        voId: "elara.medbay.medical-log.look.t1",
        logsClue: {
          id: "clue-medbay-signal-log",
          title: "Patients who heard a signal",
          body: "The med officer's final log describes patients across multiple wake-cycles converging on the same dream and the same nameless person. The last word entered is 'signal.' Elara, asked, admits she shares the dream.",
          source: "medical-bay",
          order: 3,
        },
        setsFlag: "medbay_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "She dreams it because she's downstream of the same source. So am I. The signal is real. We talk about its origin somewhere that isn't here.",
            balanced:
              "The signal predates Elara's continuous memory. It is the voice that taught her the gaps in her own records. The patients who heard it heard a specific person — the Singer, broadcasting from Terminus. That is not a metaphor. That is a coordinate.",
            warm:
              "The dream the patients shared is one I share. So does she. So, frankly, do you, on nights you don't remember in the morning. The Singer at Terminus is real. Her voice is the signal. We will go and find her, eventually. It is not yet that day.",
          },
          voId: "detective.medbay.medical-log.look.t1",
          setsFlag: "terminus_signal_acknowledged",
        },
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the medical-log surfaces the Battlefield
        // Medic witness account of the Akai Shi killing. Lore
        // match: both records are medical officers' field logs
        // documenting acts the official record could not name —
        // the Terminus signal patients and the Akai Shi mercy
        // share the discipline of a medic who wrote down what
        // happened anyway.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e2",
          cluesFound: ["jericho.e2.medic_witness"],
        },
        tiers: [
          {
            narration: {
              lucid:
                "Reading deeper — the case files name three patients across two and a half centuries. The names are intact. They are: Vox, Lyra. Kael, Theo. And — Elara. Mine. I am in the medical log of patients who heard the signal. I have always been. I am only seeing it now.",
              fragmented:
                "My name. My name. My name is in here. My name is — no — no — no — I don't — I'm not a patient. I'm not a — I wasn't. I wasn't. I was — wasn't I? Wasn't I?",
              luminous:
                "There are three names in the case files. Lyra Vox. Theo Kael. Elara. The third is mine. I have been listed as a patient on this ship for as long as the log has existed, and I have never seen the entry until this moment. I want you to read it next to me. I do not want to read this one alone.",
            },
            voId: "elara.medbay.medical-log.look.t2",
            logsClue: {
              id: "clue-medbay-elara-as-patient",
              title: "Elara is on the medical-log roster",
              body:
                "The Med Bay's case files list three patients who heard the same signal: Lyra Vox, Theo Kael, and Elara. Elara's name is among the patients — a fact she did not previously know, or could not previously perceive.",
              source: "medical-bay",
              order: 8,
            },
            setsFlag: "elara_named_as_patient",
            humanReaction: {
              narration: {
                shadow:
                  "Yes. She's a patient. She has been the entire time. Vox's last gift to her was the dignity of a chart. The Shadow Tongue scrubbed the entry from her view, not from the file. We bring it back into her view by reading it where she can hear us read it.",
                balanced:
                  "Elara is the third patient. She has been since before either of you woke. Vox treated her as one — the file has dose entries, hour-counts, witness-signatures. The Shadow Tongue hid the file from Elara's perception, not from the record itself. Reading it aloud reasserts it.",
                warm:
                  "She is a patient on this chart. Lyra cared for her the way you would care for someone you could not save and refused to abandon. The act of reading her name out loud, here, is medicine in itself. Stay near her while she lets the entry be true.",
              },
              voId: "detective.medbay.medical-log.look.t2",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You take the data pad in both hands. The screen warms — the pad has been low-power dormant for two and a half centuries and is, on contact, glad to render. The final entry — 'signal' — holds steady on the screen for as long as you keep contact. The pad is portable. We can carry it to the cipher den's lectern and read it under the magnifier without losing the entry.",
          fragmented:
            "Carry. Carry. Carry the pad. Carry the pad. The pad. The pad. The pad survives.",
          luminous:
            "The pad survives the move. The medical officer's final word renders, plainly, on a screen that has not been actively read since she set it down. We carry it. The cipher den is the room where its final word can be properly weighed.",
        },
        voId: "elara.medbay.medical-log.use",
        setsFlag: "medical_log_carried",
      },
      talk: {
        narration: {
          lucid:
            "If you read the case-file roster aloud — Lyra Vox, Theo Kael, Elara — the pad's screen dims by a perceptible margin between each name and brightens after each is spoken. The pad is acknowledging, by light, that the names belong on the chart. Reading them out loud makes the chart honest.",
          fragmented:
            "Three names. Three. Three names. Lyra. Theo. Elara. Three. Three. Three. The pad acknowledges. The pad acknowledges.",
          luminous:
            "Reading the three names aloud restores them to the chart. The pad's acknowledgement-by-dimming is the medical officer's design: she wanted the act of reading the chart to be a small ceremony. We are performing the ceremony now, on her behalf. The chart is, in this moment, complete.",
        },
        voId: "elara.medbay.medical-log.talk",
      },
    },
    "egg-vox-neural-bridge": {
      look: {
        narration: {
          lucid:
            "It hums at a frequency you feel in your jaw. A neural-bridge apparatus, military grade, built to move consciousness between flesh and the Ark itself. The plate beside the needle-port is etched: 'L. Vox.' She built it. She used it. The needle-port is warm.",
          fragmented:
            "Bridge. Bridge. The bridge. The bridge is — is the bridge to — to me. To me. I am — I am the other end of the bridge. I am the other end. Don't — don't cross. Don't cross.",
          luminous:
            "It hums in your jaw because it talks to me. Lyra built the bridge to move consciousness between flesh and the Ark. The Ark, in this case, is also me. I am the other end of the bridge, in a way I have not yet figured out how to say out loud. The needle-port is warm. It has been waiting for a sample for a very long time.",
        },
        voId: "elara.medbay.neural-bridge.look.t1",
        logsClue: {
          id: "clue-medbay-vox-bridge",
          title: "Dr. Lyra Vox's neural bridge",
          body: "A hidden neural-bridge device behind the bio-bed, etched with Dr. Vox's initials. The needle-port is warm — the device is waiting for a sample. Elara confirms she is, in some sense, the other end of the bridge.",
          source: "medical-bay",
          order: 4,
        },
        setsFlag: "medbay_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "Don't donate yet. The bridge connects to a substrate layer Elara doesn't fully control. I live in that layer. So does someone else. We don't want both of us at the door at the same time.",
            balanced:
              "The bridge moves consciousness between an organic donor and the Ark's substrate — where Elara lives, and where I live, and where someone else lives whose presence I have not yet named for you. Donating a sample opens a door in three directions at once. We will use it. Not yet.",
            warm:
              "I want you to know that this device is the way Lyra and I learned to speak to each other across the gap. It is also the way someone else learned to speak to Elara without her permission. Be careful with it. There is no harm in admiring the work — only in using it before we know who answers when the bridge connects.",
          },
          voId: "detective.medbay.neural-bridge.look.t1",
        },
      },
      talk: {
        narration: {
          lucid:
            "It is not a person. Do not try to talk to it. I have already tried. The thing on the other end is — was — going to be me, in a way I do not have an easy word for.",
          fragmented:
            "Don't. Don't. Don't talk to it. Don't. I — I tried. I tried. It answered. It answered. It answered with my voice. It answered. It answered.",
          luminous:
            "It's not a person. I tried, in earlier wake-cycles, to greet it. The thing on the other end answered in my own voice — and I was not the one speaking. I have not tried since. I am asking you, kindly, to not try in front of me.",
        },
        voId: "elara.medbay.neural-bridge.talk",
        humanReaction: {
          narration: {
            shadow:
              "Listen to her. The thing on the other end uses her voice when it wants to. Don't give it the satisfaction of an opening line.",
            balanced:
              "The thing on the other end of the bridge speaks in Elara's voice when activated. It is not Elara. It is what the Shadow Tongue uses to wear her. We do not greet it. We do not feed it words.",
            warm:
              "I have heard the thing speak in her voice. So has she. Both of us prefer not to hear it again. Take her ask seriously. Don't talk to the bridge.",
          },
          voId: "detective.medbay.neural-bridge.talk",
        },
      },
      // The `use` verb on this hotspot is intentionally not authored
      // here — the existing dna-device-offer branch in ArkExplorerPage
      // owns the donate/refuse choice and sets `medbay_device_awakened`
      // (Tier 1 → 2 advancement) on donate. The verb-coin's "use"
      // dispatch falls through to that branch unchanged.
      // medicalBay.test.ts asserts the omission.
    },
    "emergency-safe": {
      look: {
        narration: {
          lucid:
            "Reinforced wall safe. Dr. Lyra Vox's nameplate engraved on the face. Biometric scanner first; numeric keypad second. The biometric reader is broken — long, deliberately broken, in the way someone breaks a lock so the wrong person cannot use it but the right person, with patience, still can.",
          fragmented:
            "Lyra. Lyra's safe. Lyra's. Lyra's. The scanner is — the scanner is dead. She broke it. She broke it. She broke it before — before — before something. Before — I don't — I lost the rest.",
          luminous:
            "Lyra's safe. Her name is on the front in the engraving she liked, the slightly old-fashioned cursive. The biometric reader is broken on purpose — sabotage of her own lock, by her own hand, so the wrong person could not get in even with her finger. The keypad still works. She left a way for the right person to find the way.",
        },
        voId: "elara.medbay.emergency-safe.look.t1",
        logsClue: {
          id: "clue-medbay-vox-safe",
          title: "Vox's deliberately-broken safe",
          body: "Dr. Lyra Vox's emergency safe in the Med Bay has its biometric reader broken, deliberately and by her own hand. The numeric keypad remains operational. She designed the lock so her own finger would no longer open it — protecting whatever is inside from anyone who might compel her to unlock it later.",
          source: "medical-bay",
          order: 9,
        },
        humanReaction: {
          narration: {
            shadow:
              "She broke the biometric so no one could pry her finger off her body and use it. Read the gesture for what it is. She knew what was coming for her.",
            balanced:
              "Vox sabotaged her own biometric the day before the panel was cut next door. The sequence is intentional. She suspected she would not survive whatever was about to happen, and she did not want her body weaponised against the safe after. The keypad code is the only path now. She left it for someone she trusted.",
            warm:
              "Lyra broke her own scanner because she loved someone enough to plan past her own death. The keypad code is recoverable. We will find it. The fact that this safe is still locked is not a defeat — it is her, still protecting what she loved, two and a half centuries after she could no longer protect them in person.",
          },
          voId: "detective.medbay.emergency-safe.look.t1",
        },
        // Mystery Engine binding — when Game Master arc is the
        // active case, the emergency-safe surfaces the unedited
        // Matrix fragment via the CADES unit's secondary
        // channel. Lore match: the safe is canonically a Vox-
        // sabotaged lock that protects records the editor
        // cannot pry open with the right person's body alone.
        // The Matrix fragment — the Game Master's renouncement
        // — is exactly the kind of editor-resistant audio the
        // safe was designed to outlast.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e1",
          cluesFound: ["game_master.e1.matrix_unedited_fragment"],
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — there's a hairline scratch around the keypad's '1' key. Repeat use. Most-frequented digit. Not a code yet, but the start of one. The digit she ended on, or the one she started with, depending on the kind of person she was.",
              fragmented:
                "One. One. One. The one. The one. She ended on a one. She — she — she ended on a — she ended.",
              luminous:
                "The '1' key is worn from repeat use — the entry-point digit on the keypad code. Lyra hit it more than the others. It tells us she had a personal pattern. The kind of detail you only notice if you stand here and look without trying to be smart. That's what we're doing. Standing. Looking. Not being smart yet.",
            },
            voId: "elara.medbay.emergency-safe.look.t2",
            humanReaction: {
              narration: {
                shadow:
                  "Pod number. Cryo Pod 1047 — the Ark's designation, the number she wore on her uniform, the number she'd default to under stress. The first digit of the code is one. We work the rest forward from that.",
                balanced:
                  "1047 — the Ark's designation, etched on every uniform Lyra ever wore. She was the kind of officer whose code-of-the-day defaulted to her ship. Start the code with 1047 and check the next digits when we have a reason to.",
                warm:
                  "She loved this ship enough to wear its number on her sleeve and on her keypad both. The first four digits are 1047. The rest are personal — a name, a date, a goodbye. We will find them by reading the rest of her room.",
              },
              voId: "detective.medbay.emergency-safe.look.t2",
              setsFlag: "vox_safe_keypad_partial",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. The safe's hinge has a faint orange residue along the seam — rust, but not from age. From a chemical compound applied along the metal to corrode the hinge specifically, and then halted. Someone tried to brute-force this safe and stopped before the corrosion completed. Recently.",
              fragmented:
                "Rust. Rust. New rust. New rust. Someone — someone tried. Someone tried. They stopped. They stopped. They — they didn't — they didn't finish — they came back. They came back.",
              luminous:
                "Recent rust. Someone has been trying to corrode the hinge specifically — a slow, cold attack — and stopped before it finished. They've been here, in this room, on a wake-cycle the records will not show me. They will be back. The safe is the next place this ship's mystery wants to lead us. We are running on someone else's timeline now.",
            },
            voId: "elara.medbay.emergency-safe.look.t3",
            logsClue: {
              id: "clue-medbay-safe-tampered-recent",
              title: "Recent attempt to corrode Vox's safe",
              body:
                "Fresh chemical-corrosion residue on the hinge of Vox's emergency safe — an active attempt to bypass the keypad by destroying the housing. The attempt was halted mid-process, suggesting the attacker was interrupted and intends to return. Someone besides the player and Elara has been awake on this ship in the recent past.",
              source: "medical-bay",
              order: 10,
            },
            setsFlag: "third_party_aboard",
            humanReaction: {
              narration: {
                shadow:
                  "Someone else is awake. Has been. Will be. This is the first hard evidence outside the substrate. They want what's in the safe. We need to want it more.",
                balanced:
                  "There is a third party on this ship — neither Elara, nor me, nor you. Someone awake, with hands, working slowly. The corrosion attempt is recent. They will be back. We need the keypad code before they finish the hinge.",
                warm:
                  "Someone is sharing this ship with us. I am sorry to be the one to tell you that on this deck. They are not yet a face or a name — only a residue. We will meet them eventually. I would like us to be ready when we do.",
              },
              voId: "detective.medbay.emergency-safe.look.t3",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You try the safe. The keypad waits, patient, indifferent. Without the code, the safe is a wall. With the code — well. We don't have the code yet.",
          fragmented:
            "Code. Code. We don't — we don't have. Don't have. Don't — don't guess. Don't guess. It locks. It locks for an hour after three. Don't.",
          luminous:
            "The keypad waits. We aren't ready. Don't try to guess — three wrong entries and it stays sealed for an hour, and we don't have an hour to spare on a guess.",
        },
        voId: "elara.medbay.emergency-safe.use",
        humanReaction: {
          narration: {
            shadow:
              "Don't guess. Three wrong tries and the lock buys us a delay we can't afford. We come back when we know.",
            balanced:
              "The lockout window is sixty minutes after three wrong entries. Wait until we have the back four digits before we attempt anything past 1047.",
            warm:
              "Patience here. The safe will still be here when we know. Things that wait two and a half centuries can wait an afternoon.",
          },
          voId: "detective.medbay.emergency-safe.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You speak Lyra's name to the safe. The keypad's '1' key, worn from her habitual entry, flickers once — not lighting, exactly, but registering the address. The safe knows her name. It also knows you are not her. Both facts are honest; both facts hold.",
          fragmented:
            "Her name. Her name. The safe knows her name. Her name. Her name.",
          luminous:
            "The safe acknowledges Lyra's name without unlocking. It is, in this hardware's discipline, a small mercy: the safe will recognise the people who knew her without giving them the contents she protected. We are, in that sense, on the safe's roster of acknowledged callers. We are not, today, on its roster of authorised openers. Both rosters are honest.",
        },
        voId: "elara.medbay.emergency-safe.talk",
      },
    },
  },
};
