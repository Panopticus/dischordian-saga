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

import type { RoomMysteryModule } from "./_template";

export type ArchivesHotspotId =
  | "data-banks"
  | "egg-archive-tome";

export const ARCHIVES_MYSTERY: RoomMysteryModule<ArchivesHotspotId> = {
  roomId: "archives",
  responses: {
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
    },
  },
};
