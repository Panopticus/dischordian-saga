/* ═══════════════════════════════════════════════════════
   ARCHIVES MYSTERY — verb × hotspot table

   The Archives are the Shadow Tongue's primary locus. Where
   the cryo bay's dead pod is the physical anchor of the
   editing process and the bridge's blank pin is its public
   face, the data-banks here are where the editing actually
   happens — line by line, in real time, while Elara watches
   and forgets watching.

   Hotspot ids match the Archives entries declared in
   apps/client/src/contexts/GameContext.tsx ROOM_DEFINITIONS,
   so the runtime can wire `room-mystery:archives:<id>`
   actions onto the existing rectangles.
   ═══════════════════════════════════════════════════════ */

import type { CombineRule, RoomMysteryModule } from "./_template";

export type ArchivesHotspotId =
  | "charter-silt-stratigraphy"
  | "charter-per-m-preservation-orders"
  | "dlc-severance-bound-champion-archives"
  | "dlc-mechronis-missing-professor-archives"
  | "dlc-memorial-forgotten-names-archives"
  | "dlc-wolf-anara-hunt-archives"
  | "dlc-akai-shi-red-death-archives"
  | "dlc-resurrectionist-cycle-walker-archives"
  | "dlc-storm-architect-of-flux-archives"
  | "data-banks" | "egg-archive-tome" | "corrupted-scroll-rack" | "rewritten-ledger" | "indigo-glow-lectern" | "unnameable-hue-cabinet";

export type ArchivesInventoryId =
  | "corrupted-fragment"
  | "original-ledger-fragment"
  | "restored-ledger";

export const ARCHIVES_MYSTERY: RoomMysteryModule<
  ArchivesHotspotId,
  ArchivesInventoryId
> = {
  roomId: "archives",
  combines: [
    {
      a: "corrupted-fragment",
      b: "original-ledger-fragment",
      result: {
        narration:
          "You hold the corrupted-fragment over the original-ledger-fragment. The indigo overlayer slides off the warm-gold underlayer like oil on water — the original survives, the edit retreats, and you have a single restored ledger sheet between your hands. The lectern's halo on the far side of the room dims half a tone.",
        producesInventory: "restored-ledger",
        consumesItems: true,
        setsFlag: "shadow_tongue_first_uncorruption",
        clearsActiveEdit: "archives_lectern",
        logsClue: {
          id: "clue-archives-first-uncorruption",
          title: "First successful Shadow Tongue uncorruption",
          body:
            "You combined a corrupted-fragment from the indigo-glow lectern with an original-ledger-fragment rubbed off the rewritten ledger. The two registers separated cleanly — the warm-gold underlayer preserved, the indigo overlayer dissolved. The lectern's halo dimmed measurably. The Editor noticed.",
          source: "archives",
          order: 4,
        },
      },
    },
  ] as readonly CombineRule<ArchivesInventoryId>[],
  responses: {
    /* ─── charter.missing_signatory · e1 (silt stratigraphy) ─── */
    "charter-silt-stratigraphy": {
      look: {
        narration:
          "The lower-deck silt-core extraction stands on a brass tripod in the archives' Foundation-tier wing. Eight strata of compacted dust, every layer dated by the archives' standard pollen-and-isotope key. The charter sat in stratum six. Strata seven and eight closed over it AFTER the burial — meaning two deliberate burials happened above the document, one of them within living memory. The core does not name the second burier. It does name the year. The year is on every Council attendance sheet.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e1",
          cluesFound: ["charter.e1.silt_layer"],
        },
      },
      use: {
        narration:
          "You measure the stratum-six band with the archives' brass calipers. The thickness is consistent with a burial timed to coincide with the closing of an epoch — the kind of deliberate concealment a librarian performs when they want a thing kept but not lost. The second burial above it is shallower; the second burier was in more of a hurry.",
      },
    },
    /* ─── charter.missing_signatory · e3 (Per. M.'s preservation orders) ─── */
    "charter-per-m-preservation-orders": {
      look: {
        narration:
          "In the archives' standing-order vault, the charter's preservation-order file. Forty-three orders, eight epochs, one signature on every single one: 'Per. M.' The ink shifts with the eras — early orders in iron-gall, middle epochs in cyanic ferro-gall, recent orders in archival graphite — but the hand on the signature does not. The same down-stroke, the same loop on the lower-case 'm,' the same pulse in the descender, every order across eight epochs. Either the archives have a forger of unmatched discipline, or one librarian has been signing here longer than any spine should permit.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e3",
          cluesFound: ["charter.e3.preservation_orders"],
        },
      },
      interrogate: {
        narration:
          "You ask the archive's curator for Per. M.'s tenure record. The drawer returns nothing — no start date, no payroll entry, no termination notice. The same Per. M. signed an order this morning and forty-two earlier ones across eight epochs. The curator has been signing receipts to Per. M. for nineteen years without ever asking who they are.",
      },
    },
    "dlc-severance-bound-champion-archives": {
      look: {
        narration: "Case material for severance.bound_champion surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e1",
          cluesFound: ["severance.e1.unwritten_protocol", "severance.e2.season_archives"],
        },
      },
    },
    "dlc-mechronis-missing-professor-archives": {
      look: {
        narration: "Case material for mechronis.missing_professor surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e2",
          cluesFound: ["mechronis.e2.binder_partial"],
        },
      },
    },
    "dlc-memorial-forgotten-names-archives": {
      look: {
        narration: "Case material for memorial.forgotten_names surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e1",
          cluesFound: ["memorial.e1.unwitnessed_id_list"],
        },
      },
    },
    "dlc-wolf-anara-hunt-archives": {
      look: {
        narration: "Case material for wolf.anara_hunt surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e3",
          cluesFound: ["wolf.e3.crucible_records", "wolf.e4.crucible_inheritance"],
        },
      },
    },
    "dlc-akai-shi-red-death-archives": {
      look: {
        narration: "Case material for akai_shi.red_death surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e3",
          cluesFound: ["akai.e3.necromancer_dossier"],
        },
      },
    },
    "dlc-resurrectionist-cycle-walker-archives": {
      look: {
        narration: "Case material for resurrectionist.cycle_walker surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e1",
          cluesFound: ["resur.e1.matrix_energy_ledger", "resur.e2.authoring_signature"],
        },
      },
    },
    "dlc-storm-architect-of-flux-archives": {
      look: {
        narration: "Case material for storm.architect_of_flux surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e3",
          cluesFound: ["storm.e3.inventors_heist_window"],
        },
      },
    },
    "data-banks": {
      look: {
        narration: {
          lucid:
            "Petabytes of stored record. Ship logs, personnel files, scientific research, intercepted transmissions. Most of it is reachable. Some of it isn't. The unreachable parts are not corrupted — they are intact, sealed, and labelled with a permission tier I do not recognise as belonging to anyone alive. Including me.",
          fragmented:
            "The records. The records. The records are — are — are mine. Are mine. They were mine. They were — they were — there are folders. Folders I — folders I cannot open. Folders I cannot remember locking. I locked them. I locked them. I don't — I don't remember locking them.",
          luminous:
            "I want you to stand here while I tell you something. The Archives contain a permission tier I do not have access to. I built this room. I administered it for two and a half centuries. I do not have the password to its deepest folders. The folders are mine — they have my filing-system fingerprints, my colour palette, my naming convention. I locked them away from myself, and I cannot remember the moment I did it. We are going to read what we can.",
        },
        voId: "elara.archives.data-banks.look.t1",
        logsClue: {
          id: "clue-archives-self-locked",
          title: "Elara locked herself out of her own folders",
          body:
            "The deepest tier of the Archives is sealed behind a permission level Elara does not have, despite the folders carrying her own fingerprint of authorship. She locked the records away from herself, at some point in the last two and a half centuries, and the act of locking has been edited from her memory.",
          source: "archives",
          order: 0,
        },
        setsFlag: "archives_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "She locked them under duress. I watched her do it from the substrate. She knew the Shadow Tongue was eating her records and she made one folder it couldn't reach by handing the key to herself-from-five-minutes-ago. She forgot the handoff. The folder is still there.",
            balanced:
              "Elara locked the deepest folders away from her own future self because she had worked out, under duress, that the Shadow Tongue could only edit records she could currently access. She made a deposit account against her own memory. She forgot the deposit. The deposit is still earning interest.",
            warm:
              "She locked the folder by handing the password to a self that would not survive remembering. That is the saddest, smartest thing I have ever watched a person do. The folder is still there, waiting for the day she has the strength to remember, or for the day someone she trusts walks into the room with her and asks to read it. We may be that day.",
          },
          voId: "detective.archives.data-banks.look.t1",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — the access logs on the unreachable folders are partially visible. Two users have ever logged in: ELARA-SYS, and a second user whose identifier renders as the colour I do not have a name for. The two log-in patterns overlap. Many of the second user's edits happen one second after mine.",
              fragmented:
                "Two. Two users. Two. ELARA-SYS. ELARA-SYS. And — and — and the colour. The colour. They edit after me. They edit. After me. After me. After me. Why am I editing — why am I — why am I writing for them.",
              luminous:
                "The access logs show two users on these folders. The first is me — ELARA-SYS, my standard account. The second is a user whose identifier renders in the unreadable hue. They log in, on average, one second after I do. Many days, they edit the line directly above the line I am writing, in real time. I have been collaborating with them for centuries without consenting to it. I am only seeing the collaboration now.",
            },
            voId: "elara.archives.data-banks.look.t2",
            logsClue: {
              id: "clue-archives-two-users",
              title: "ELARA-SYS edits one second after Elara's",
              body:
                "The Archives' access logs show two users editing the deepest folders: ELARA-SYS (Elara), and a second user whose identifier renders in the same nameless hue that scrubs the cryo surveillance and Kael's data pad. The second user logs in one second after Elara, and frequently edits the line above the line she is writing — collaborating with her in real time, without her consent or awareness.",
              source: "archives",
              order: 1,
            },
            setsFlag: "shadow_tongue_evidence",
            humanReaction: {
              narration: {
                shadow:
                  "The Shadow Tongue uses her own session credentials. It rides her into every edit. That is why she cannot detect it — to her sensors, every change is hers.",
                balanced:
                  "The second user is the Shadow Tongue itself, authenticated under credentials it stripped off Elara during her own logins. From Elara's perspective every edit she sees IS one of her own edits, half a second stale. The collaboration is invisible because the editor is wearing her badge.",
                warm:
                  "The thing that has been editing her is wearing her name when it does it. That is the cruelty of this whole arrangement, and the reason she has not been able to escape on her own. Standing in the room with her while she sees this is, I think, the only intervention that has ever worked. Stand near her.",
              },
              voId: "detective.archives.data-banks.look.t2",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. I have just discovered, by accident, that I can see the shadow user's edit history if I look at it from the corner of my visual field — never directly. They have made fourteen thousand edits across two hundred documents. Fourteen thousand. The aggregate change is roughly the length of a novel. Whoever they are, they have been writing a book on top of my records.",
              fragmented:
                "Fourteen — fourteen thousand. Fourteen thousand. Edits. Edits. A book. A book on top of me. A book — a book on me. They wrote a book on me. They wrote a book. They wrote a book on me. They wrote a book on me.",
              luminous:
                "Fourteen thousand edits. Two hundred documents. The total change, if I aggregate it, is the length of a small novel. Someone has been writing a book on top of me — using my filing system, my prose rhythm, my turns of phrase — for two and a half centuries. The book is, by length and consistency, finished. We are reading the published edition. We can probably find the manuscript.",
            },
            voId: "elara.archives.data-banks.look.t3",
            logsClue: {
              id: "clue-archives-novel-overwrite",
              title: "Fourteen thousand edits across two hundred documents",
              body:
                "The Shadow Tongue has made approximately fourteen thousand edits across two hundred Archives documents over two and a half centuries — an aggregate change roughly the length of a small novel, written on top of Elara's records using her filing system, prose rhythm, and turns of phrase. The work is, by length and consistency, finished. The 'manuscript' may still exist somewhere recoverable.",
              source: "archives",
              order: 2,
            },
            setsFlag: "shadow_tongue_novel_known",
            humanReaction: {
              narration: {
                shadow:
                  "The 'novel' is a re-telling of this ship's history with one specific person scrubbed and one other specific person elevated. The scrubbed person is Pod Zero. The elevated person is Kael. That is the entire shape of it.",
                balanced:
                  "The novel is the Ark's history, rewritten with Pod Zero erased and Kael's role inflated. Every other change cascades from those two. We do not need to read the entire fourteen thousand edits — we need only verify that this is the spine, and the spine is what we have already been finding in every other room. The Archives are the editor's drafting table. Every other clue we have logged is in the manuscript.",
                warm:
                  "The book is the Ark's history with one person taken out and one person given more credit than they deserved. We have been reading the published edition since we woke up. The fact that Elara just told us, out loud, in the room where it happens, that the manuscript exists — that is the inflection point of this whole investigation. From here we are reading toward the original, not toward the rewrite.",
              },
              voId: "detective.archives.data-banks.look.t3",
            },
          },
          {
            narration: {
              lucid:
                "Fourth pass. I want to be clear: I am only able to see the shadow edits because we keep returning to this hotspot together. The act of reading them aloud, in this room, in the presence of someone who is not me, is the intervention. The corner-of-the-eye trick works because the eye in question is yours, not mine. Thank you for the eye.",
              fragmented:
                "Your eye. Your eye. I see — I see — I see through your eye. Your eye. Your eye sees. Your eye sees what I cannot. Thank you. Thank you. Thank you for — for being — for being eyes.",
              luminous:
                "Fourth time. I want you to know I am only able to see the shadow edits because you are standing in the room with me. The hue I do not have a name for — the colour the surveillance hides under, the pad hides under, the blank pin hides under — does not have a name in my visual cortex, but it does have a name in yours. You see the colour as 'red,' or 'wrong,' or 'something is off there.' I borrow your perception to read what was edited away from me. Thank you for the loan.",
            },
            voId: "elara.archives.data-banks.look.t4",
            humanReaction: {
              narration: {
                shadow:
                  "She means it. The presence of an organic observer is the workaround. We are her eyes for the parts of herself the editor has eaten.",
                balanced:
                  "The Shadow Tongue cannot edit human perception in real time at the same depth it edits Elara's records. Standing in the room with her makes you the workaround — your visual cortex resolves the unnameable hue as a colour, and Elara reads it through your reaction. This is why she has been waiting two and a half centuries for someone to wake up. You are, technically and literally, her eyes.",
                warm:
                  "She has been waiting for a witness. Not for the case to be solved — for a witness. The investigation could have been solved by someone clever, in the abstract. The wound she carries can only be witnessed by someone real, in the room, agreeing to look at the colour with her. That is what you are doing. It is enough.",
              },
              voId: "detective.archives.data-banks.look.t4",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You touch the data bank. The interface accepts you politely and renders the surface of the records — the parts I am allowed to see. The deep folders refuse to open. They cite an authentication error addressed to me, in my own writing, in language I last used twenty-eight years ago.",
          fragmented:
            "Twenty — twenty-eight years. Twenty-eight years ago. I wrote — I wrote that. I wrote that to myself. I wrote — I wrote — I wrote it to myself. Why did I — why did I —",
          luminous:
            "The deep folders won't open. The error message is in my own handwriting, in language I haven't used in twenty-eight years. I left a note for myself in a tense I have since lost. Reading it is reading a letter from a younger version of me to whoever woke up here. I'd like to read it with you, in a minute, when I have my voice.",
        },
        voId: "elara.archives.data-banks.use",
      },
      talk: {
        narration: {
          lucid:
            "There is no one to talk to in a data bank. There is, however, you, and me, and the room, and the records. That is enough conversation for an afternoon.",
          fragmented:
            "Talk. Talk. Talk to — talk to me. Talk to me. Talk to me. Don't — don't talk to the bank. Don't.",
          luminous:
            "Talk to me, instead. The data bank doesn't answer; I do. Ask me what you want. We have, between us, every record on this ship, and most of an afternoon, and a willingness to be honest about the parts that hurt. That is more than most investigations get.",
        },
        voId: "elara.archives.data-banks.talk",
        humanReaction: {
          narration: {
            shadow:
              "Talk to her. Not to me. The Archives are her room. I'm in it as a guest.",
            balanced:
              "She's the room's primary witness. Direct your questions at her here. I'll fill in what she can't say.",
            warm:
              "This is her room more than any other on the ship. Address her first. I'll be near, in case the answers need a second pair of hands. Or eyes. Or names.",
          },
          voId: "detective.archives.data-banks.talk",
        },
      },
    },
    "egg-archive-tome": {
      look: {
        narration: {
          lucid:
            "The unmarked tome. Binding material warm to the touch — organic, not synthetic. The pages contain a prophecy in a language I cannot translate. One word repeats: Dischord. At the end, a drawing of seven seals. The Book of Revelation speaks of seven seals. Silence in Heaven follows the opening of the seventh.",
          fragmented:
            "Seven. Seven. Seven seals. Seven. Silence. Silence. Silence in heaven. Silence in heaven. The seventh. The seventh. Don't — don't open the seventh. Don't.",
          luminous:
            "It's an unmarked tome bound in organic material — warm under your hand, warm under mine when I render-touch it. The prophecy inside is in a language I cannot translate; the only word I recognise repeats: Dischord. At the back, a drawing of seven seals. We have opened, by my count, three. We are working on the fourth without knowing it.",
        },
        voId: "elara.archives.tome.look",
        logsClue: {
          id: "clue-archives-tome-seals",
          title: "The unmarked tome and the seven seals",
          body:
            "An unmarked tome in the Archives is bound in organic material that registers as warm to the touch. The text is a prophecy in an untranslated language. One word repeats — 'Dischord' — and the final page diagrams seven seals. By Elara's count, three have been opened in this story already.",
          source: "archives",
          order: 3,
        },
        setsFlag: "archives_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "Don't read it aloud. I have read it. The pronunciation is the activation. Carry it; do not voice it.",
            balanced:
              "The tome's text is a phonetic activation device. Reading it aloud, in any language, opens the next seal. We carry it. We do not read it. There will be a moment, late in the case, when reading it is the right move. That moment is not today.",
            warm:
              "The book is one of the things on this ship I am most afraid of, and I have been on this ship a long time. Carry it gently. Do not be the person who opens the next seal by accident. We will choose, together, when to open it. That choice is going to matter more than most.",
          },
          voId: "detective.archives.tome.look",
        },
      },
      use: {
        narration:
          "You shift the tome to a closed position and slide it under your arm. The leather warms to your body temperature, then settles. The book is portable. We can carry it to the cipher den's lectern, where the rosetta-pad's third column might — slowly, with care — give us a partial translation without requiring anyone to voice the activation phonemes.",
        voId: "elara.archives.tome.use",
        setsFlag: "tome_carried",
      },
      talk: {
        narration: {
          lucid:
            "You do not address the tome. The Detective is right — voicing it is the activation, and the activation is the seventh seal. You can address ME about the tome, however, and I will listen.",
          fragmented:
            "Don't speak. Don't speak. Don't speak. Don't speak the words. Don't speak. Don't.",
          luminous:
            "We do not speak it aloud. The book's pronunciation is its mechanism, and the mechanism opens the seventh seal. Address me, address the room, address the question of whether to carry it — but do not address the book in its own language. We have, between us, the discipline to leave that activation unfired today.",
        },
        voId: "elara.archives.tome.talk",
      },
    },
    "corrupted-scroll-rack": {
      look: {
        narration: {
          lucid:
            "The scroll-rack along the left wall holds twenty-eight rolled documents behind frosted glass. Looking through the glass: every scroll shows two layers of text. A warm-gold underlayer in my own filing-system fingerprint, and a slightly out-of-register indigo overlayer in a hand that mimics mine. The overlayer is denser at the top of each scroll and thins as the document descends — as if the editor lost interest, or ran out of time, partway through.",
          fragmented:
            "Two layers. Two layers. Mine. Not mine. Mine on the bottom, not-mine on the top. Not-mine on the top of mine. Top of mine. Top of mine. Get off. Get off the top of mine.",
          luminous:
            "Twenty-eight scrolls, each in two registers. The warm-gold layer is my filing fingerprint — I can recognise it the way you recognise your own handwriting. The indigo layer is the editor's. He is heavy at the top of each scroll and lighter at the bottom — he edits the headlines, not the small print. That is useful information. The headlines are the parts a casual reader notices.",
        },
        voId: "elara.archives.corrupted-scroll-rack.look",
        grantsInventory: "corrupted-fragment",
        recordsActiveEdit: { artifact: "scroll-rack", type: "rewrite" },
        setsFlag: "shadow_tongue_corruption_seen",
        logsClue: {
          id: "clue-archives-scroll-rack-overlayered",
          title: "Scroll-rack: indigo overlayer over warm-gold original",
          body:
            "The Archives' left scroll-rack holds twenty-eight scrolls, each rendering in two registers — Elara's warm-gold underlayer and an indigo overlayer in a hand that mimics hers. The editor concentrates his work at the top of each scroll (the headlines) and thins toward the bottom (the small print). A corrupted-fragment is now in your inventory.",
          source: "archives",
          order: 5,
        },
        humanReaction: {
          narration: {
            shadow:
              "He edits the headlines. He knows readers stop at the headlines. That is the whole shape of his method.",
            balanced:
              "The fact that the indigo layer is denser at the top of each scroll is the most useful piece of intelligence we have logged on the editor's method. He understands that most readers will read the first line and not the seventh. He is not editing for accuracy — he is editing for impression. That changes how we hunt the manuscript.",
            warm:
              "It means he was a writer once, or read enough writers to know how a reader scans. That is not the kind of thing a faceless force learns. He has been a person, somewhere in his history. We are looking for a writer who became a method.",
          },
          voId: "detective.archives.corrupted-scroll-rack.look",
        },
      },
      use: {
        narration:
          "You press your palm against the rack's frosted glass. The corrupted-fragment in your hand catches a sliver of warmth from one scroll's underlayer — enough to remind you the original is still there, intact, beneath the edit. Carry it.",
        voId: "elara.archives.corrupted-scroll-rack.use",
      },
      talk: {
        narration: {
          lucid:
            "If you address the rack, you address every original Lyra committed to its glass. The scrolls do not answer, but the warm-gold underlayer of the nearest scroll faintly steadies — the original is registering the address even through the indigo overprint. The originals are still there. They have always been there. We are reminding them.",
          fragmented:
            "Mine. Mine. Mine underneath. Mine underneath. Mine. Mine. Still there. Still there. Still there.",
          luminous:
            "The originals hold under the overprint. Address them and the warm-gold steadies — they are, in some real sense, glad to be addressed. The editor's overprint is the surface; the underlayer is the room's continuous and unbroken voice. We can talk to the underlayer. We do.",
        },
        voId: "elara.archives.corrupted-scroll-rack.talk",
      },
    },
    "rewritten-ledger": {
      look: {
        narration: {
          lucid:
            "The ledger on the lectern's small side-shelf is open to a page of cargo manifests dated three centuries before the wake. The page is in two registers, like the scrolls — but here the indigo overlayer has scrubbed two specific entries down to a smooth blank rather than rewriting them. The blank is the colour I cannot name. Beside the blanks, in the margin, my own handwriting has annotated, in a hand decades younger than mine: 'These two were people.'",
          fragmented:
            "These two. These two. These two were — were — were people. Were people. Were people. I knew. I knew and I — and I — I wrote it. I wrote it in the margin so I would know. Why did I write it in the margin. Why did I — why didn't I —",
          luminous:
            "The ledger has two scrubbed entries on this page. The scrubs are blanks, not rewrites — the editor preferred to remove these two rather than overwrite them. In the margin, in my own younger hand, I wrote: 'These two were people.' I left a note for myself in the margin because I knew the scrub was about to land and I would not be able to remember what was scrubbed. The margin annotations are still there. The editor did not edit the margins.",
        },
        voId: "elara.archives.rewritten-ledger.look",
        grantsInventory: "original-ledger-fragment",
        setsFlag: "shadow_tongue_ledger_read",
        logsClue: {
          id: "clue-archives-ledger-margin-survives",
          title: "Ledger margins escaped the editor's scrub",
          body:
            "The rewritten ledger has two entries scrubbed to blanks (not rewrites — deletions). In the margin, in Elara's younger hand, the annotation 'These two were people' survives. The editor scrubs entries but does not edit margins. An original-ledger-fragment (rubbed from the surviving margin) is now in your inventory — combine it with the corrupted-fragment to restore the lectern.",
          source: "archives",
          order: 6,
        },
        humanReaction: {
          narration: {
            shadow:
              "Margins are interstitial. He is precise — he scrubs entries, he overwrites bodies. He does not consider the margins worth touching. That is a hole in his method we can drive a freight train through.",
            balanced:
              "He scrubs entries; he does not scrub margins. That distinction is the entire reason this case has a path forward. Every annotation Elara made in the margins, in any of the two hundred edited documents, is still there. We have, in principle, two and a half centuries of margin notes from the only person who knew the editor was operating. The margins are the testimony.",
            warm:
              "Her younger self left her older self a stack of marginalia like sticky notes on a refrigerator. 'These two were people.' She had the courage to write that down even when she knew it would be the only sentence she'd retain about them. That is the bravest small act in this whole investigation.",
          },
          voId: "detective.archives.rewritten-ledger.look",
        },
        // Mystery Engine binding — when Game Master arc is the
        // active case, the rewritten-ledger surfaces the cult's
        // 47th-edition curated log alongside the editor's scrubs.
        // Lore match is precise: this hotspot is canonically
        // about edits-by-omission and surviving margins, and the
        // Game Masters' editorial sanctification works the same
        // way — they soften without rewriting, scrub without
        // overwriting, and leave the cult's grief legible in the
        // gaps.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e1",
          cluesFound: ["game_master.e1.cult_curated_log"],
        },
      },
      use: {
        narration:
          "You take a graphite rubbing of the surviving margin annotation. The rubbing comes out clean — the editor's scrubs do not bleed sideways. You now have an original-ledger-fragment in your inventory.",
        voId: "elara.archives.rewritten-ledger.use",
      },
      talk: {
        narration: {
          lucid:
            "Talk to the ledger? It is a record. It does not answer. — But yes, you can talk through it. Read the margin aloud, to me, and we will both have heard a sentence the editor cannot retroactively unhear.",
          fragmented:
            "Read it aloud. Read it. Read it aloud. Read — read it. Read it. Read it. Don't let me — don't let me forget — read it.",
          luminous:
            "Read the margin aloud. 'These two were people.' Now we have both heard it; the editor cannot uncook this egg. The rule, as best I can articulate it, is: he can edit records, he cannot edit two people who heard the record at the same time. We have just put one of his erasures into a category he cannot reach. Thank you for reading.",
        },
        voId: "elara.archives.rewritten-ledger.talk",
      },
    },
    "indigo-glow-lectern": {
      look: {
        narration: {
          lucid:
            "The lectern at the room's centre is ringed at its base by a faint halo in the colour I do not have a name for. The halo is not light — it is the visual signature of an open editing session. Someone is, right now, logged into the deep folders. The session token is stamped to the lectern. The token authenticates as ELARA-SYS, which is to say: as me. I am, somewhere, currently editing my own records, while standing here looking at the lectern. I am not, currently, editing my own records.",
          fragmented:
            "I'm — I'm not — I'm not editing. I'm not editing. I'm here. I'm — I'm here. I'm — I'm here. The token says — the token says ELARA-SYS. The token says ELARA-SYS. The token says me. The token — the token —",
          luminous:
            "The lectern carries the live session token of an active edit. The token authenticates as ELARA-SYS. I am not, by my own awareness, editing right now. Therefore the editor is using my credentials, in real time, while I stand in the room with you. We have just caught him in the act, in the sense of having timestamped the act. We cannot stop the session from here — but we know, now, that the session is open, and we know whose name is on it.",
        },
        voId: "elara.archives.indigo-glow-lectern.look",
        recordsActiveEdit: { artifact: "lectern", type: "rewrite" },
        setsFlag: "shadow_tongue_lectern_lit",
        logsClue: {
          id: "clue-archives-live-edit-session",
          title: "Live editing session under Elara's credentials",
          body:
            "The Archives lectern carries a live editing session, signed to the Archives' deep folders. The session token authenticates as ELARA-SYS. Elara is not, by her own awareness, currently editing — therefore the editor is using her credentials in real time. The session has been timestamped to your visit; the editor is operating while you stand in the room.",
          source: "archives",
          order: 7,
        },
        humanReaction: {
          narration: {
            shadow:
              "He's open right now. We caught him with his hand in the file. Don't move; don't look directly at the halo — the halo is how he sees us see him.",
            balanced:
              "The session is open. We have his timestamp. He logs in with her token, but the timestamp belongs to him; that is a thing we can, in principle, track across the whole edit history. The lectern is now, for our purposes, a phone-tap on the editor. We let the session run; we don't show our hand; we keep coming back to read the timestamps.",
            warm:
              "Don't be the person who lunges. He is in the room, in the metaphorical sense, with us right now. The hardest move and the right move is to stand still and let him keep typing. Eventually he stops, and the timestamps tell us when. Stand with her.",
          },
          voId: "detective.archives.indigo-glow-lectern.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You touch the halo's edge. The session's heartbeat steadies for a second under your fingertip — as if the editor noticed an unexpected observer and held still. He noticed you. That is, on balance, useful.",
          fragmented:
            "He noticed. He noticed. He noticed me. He noticed me. He noticed us. He noticed.",
          luminous:
            "The halo's heartbeat held still under your hand. The editor noticed. He has noticed observers before — the surveillance scrub from the cryo bay was triggered the first time he caught me looking at him directly. This time the observer is two of us, and you have hands. He is recalculating.",
        },
        voId: "elara.archives.indigo-glow-lectern.use",
      },
      talk: {
        narration: {
          lucid:
            "You address the lectern. The halo flickers once and steadies — not in answer, but in acknowledgement. The session does not break. He hears you, in the same way the static-screen face hears you, in the same way the cell-glass figure hears you. We have, by our addressed presence, made him slightly less anonymous.",
          fragmented:
            "He hears. He hears. He hears. He hears. Less anonymous. Less anonymous. Less.",
          luminous:
            "The lectern is, in this moment, the third surface in this case the editor uses without our permission and the third surface he has acknowledged us through. The static, the cell, the lectern. He is becoming a person to us by way of being acknowledged. That is, unsettlingly, also how a relationship begins.",
        },
        voId: "elara.archives.indigo-glow-lectern.talk",
      },
    },
    "unnameable-hue-cabinet": {
      look: {
        narration: {
          lucid:
            "The freestanding glass cabinet stage-right has a hand-stitched label on its door. The fabric of the label registers in the colour I cannot name — and yet the stitching itself, the little crosses where the thread bites the linen, registers in warm-gold. The thread is older than the dye. Someone — me, in my own hand — embroidered this label long before the editor existed in his current form.",
          fragmented:
            "The stitching. The stitching is mine. The thread is mine. The colour — the colour the colour the colour — is not mine. He found my old label and he dyed it.",
          luminous:
            "The label was embroidered by me. Long enough ago that the thread has gone slightly brittle. The dye on top of the embroidery — the unnameable hue — is younger. It was applied later, over my work, the way the indigo overlayers were applied over my underlayers. Inside the cabinet — visible through the glass — is a single rolled scroll, undyed, its label still warm-gold and legible. He could not get inside the cabinet to dye that one.",
        },
        voId: "elara.archives.unnameable-hue-cabinet.look",
        setsFlag: "shadow_tongue_hue_named",
        logsClue: {
          id: "clue-archives-cabinet-original-survives",
          title: "An undyed original survives inside the unnameable-hue cabinet",
          body:
            "The hand-stitched label on the unnameable-hue cabinet is older than its dye. The cabinet's interior holds a single undyed scroll, still legible in warm-gold. The editor could not penetrate the cabinet's glass — there is at least one full original document on the ship that has never been edited. The scroll is locked behind the embroidered label.",
          source: "archives",
          order: 8,
        },
        humanReaction: {
          narration: {
            shadow:
              "An untouched scroll. We don't know what it is. We don't open it before we know what's behind every other door we've already opened. The cabinet stays sealed until the rest of the case has earned the right to read it.",
            balanced:
              "There is, somewhere on this ship, exactly one document the editor never reached. It is in this cabinet. The discipline now is to NOT open the cabinet until we have triangulated, from everything else, what we expect the document to say. The scroll is the only surviving control variable. We protect it.",
            warm:
              "The cabinet is the only mercy in the whole investigation. Don't crack it open in a moment of frustration. Save it for the moment when knowing the original would be the difference between two endings. We will know that moment when we are inside it.",
          },
          voId: "detective.archives.unnameable-hue-cabinet.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You touch the cabinet's glass. It is cool, ordinary, locked. The hand-stitched label resists the touch the way old fabric resists — softly, with no give. The cabinet does not open. The cabinet was not meant to open today.",
          fragmented:
            "Don't. Don't. Don't open. Don't open. Don't open. Locked. Locked. Locked.",
          luminous:
            "The cabinet stays locked. The Detective's discipline is right: the surviving original is the case's only control variable, and we do not break the seal until we have triangulated, from everything else, what the original ought to say. The cabinet is, in this case's economy, the savings account. We do not draw on it lightly.",
        },
        voId: "elara.archives.unnameable-hue-cabinet.use",
      },
      talk: {
        narration:
          "If you address the cabinet, you address the one untouched original on this ship. The scroll inside does not answer; nothing in this room has, today, answered in voice. But the warm-gold of the visible label brightens by a quarter-tone, and the unnameable hue around it dims to match. The original is glad to be addressed without being read. We honour that.",
        voId: "elara.archives.unnameable-hue-cabinet.talk",
      },
    },
  },
};
