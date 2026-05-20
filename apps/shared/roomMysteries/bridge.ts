/* ═══════════════════════════════════════════════════════
   BRIDGE MYSTERY — verb × hotspot table

   The Bridge is the Ark's command deck. Per the design doc
   (docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md, Beat I),
   it is where the Conspiracy Board, Timeline Projector, and
   Captain's Chair live. The chair belonged to Dr. Lyra Vox —
   the same hand whose neural-bridge appears in the Med Bay.

   Tier progression (apps/shared/roomTier.ts):
     0 → 1   first Look on any clue-bearing hotspot →
             `bridge_first_clue_found`
     1 → 2   the existing nav-calibration puzzle fires
             `fast_travel_unlocked` (already shipping)
     2 → 3   `bridge_war_table_online` — set when the player
             pins their first conspiracy thread (left to a
             follow-up runtime hook for now)

   Hotspot ids match the Bridge entries already declared in
   apps/client/src/contexts/GameContext.tsx ROOM_DEFINITIONS,
   so the runtime can wire `room-mystery:bridge:<id>` actions
   onto the existing rectangles without coordinate authoring.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";
import { bandedNarration, bandedHumanNarration } from "./_template";

export type BridgeHotspotId =
  | "chained-dean-silence-on-bridge"
  | "chained-architect-correction"
  | "chained-architect-rite-acknowledgment"
  | "watchers-architect-record"
  | "watchers-architect-role-naming"
  | "watchers-architect-closing-thanks"
  | "tarn-destination-acknowledged"
  | "tarn-architect-vote-note"
  | "memorial-architect-silence-on-torn"
  | "memorial-architect-closing-thanks"
  | "severance-architect-acknowledge"
  | "severance-council-ratification"
  | "memorial-architect-sealed-note"
  | "tactical-display" | "timeline-projector" | "captains-chair" | "nav-console" | "diplomacy-table" | "captains-coffee" | "shadow-tongue-annotations";

export const BRIDGE_MYSTERY: RoomMysteryModule<BridgeHotspotId> = {
  roomId: "bridge",
  responses: {
    /* ─── severance.bound_champion · color clues ─── */
    "severance-architect-acknowledge": {
      look: {
        narration:
          "On the Architect-channel terminal for Nilmorg, the Console's one-line confirmation when the apprentice oath is read aloud: 'noted. the post is recognised. the post was always recognised.' The Console did not need a vote.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e4",
          cluesFound: ["severance.e4.architect_acknowledge"],
        },
      },
    },
    "severance-council-ratification": {
      look: {
        narration:
          "On the closing-rite Council-vote terminal, Foundation Day's calendar slips and the Severance closing motion is voted on the same week. The Council ratifies the inheritance protocol unanimously, with one abstention — the seventh founding Watcher's empty seat.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e5",
          cluesFound: ["severance.e5.council_ratification"],
        },
      },
    },
    /* ─── memorial.forgotten_names · color clues ─── */
    "memorial-architect-silence-on-torn": {
      look: {
        narration:
          "On the Architect-channel terminal, asked to identify the imprint named on the torn page, the Console returns: 'i decline.' The Console has declined exactly twice in eight epochs. This is the second.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e3",
          cluesFound: ["memorial.e3.architect_silence_on_torn"],
        },
      },
    },
    "memorial-architect-closing-thanks": {
      look: {
        narration:
          "On the closing-rite Architect-channel, the Console issues a single line at last bell: 'noted. the plaza was the answer. the architect is grateful.' It is the second time the Console has used the word grateful in eight epochs.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e5",
          cluesFound: ["memorial.e5.architect_thanks"],
        },
      },
    },
    /* ─── mechronis.missing_professor · color clues ─── */
    "tarn-destination-acknowledged": {
      look: {
        narration:
          "On the Architect-channel terminal, the Console's record on Tarn: 'noted. she may return at her own discretion.' Tarn has left the Ark. She will not say where. Roen knows but will not say. The Architect's Console acknowledges her departure with one line.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e4",
          cluesFound: ["mechronis.e4.tarn_destination"],
        },
      },
    },
    "tarn-architect-vote-note": {
      look: {
        narration:
          "Pinned to the Architect-channel for the closing rite, the Console's marginal note read into the record: 'either choice closes the case. one keeps her name; one keeps her promise. the architect will not pick.' The Console has not picked between options before. It does not pick now.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e5",
          cluesFound: ["mechronis.e5.architect_note"],
        },
      },
    },
    /* ─── memorial.seven_watchers · color clues ─── */
    "watchers-architect-record": {
      look: {
        narration:
          "On the Architect-channel record terminal, the Console issues a one-line acknowledgment: 'six watchers have spoken to six audiences. each line is real. the seventh has not spoken. the architect will not name the seventh.' The Console has refused to name the seventh three times in two years; this is the third.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e1",
          cluesFound: ["watchers.e1.architect_record"],
        },
      },
    },
    "watchers-architect-role-naming": {
      look: {
        narration:
          "Pinned to the Architect-channel: 'the seventh's role is not blank by oversight. the role waits to be named by the Ark itself, not by the architect. the architect cannot pre-empt the naming. the silence will continue until the ark has spoken.' The Console has named its boundary.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e4",
          cluesFound: ["watchers.e4.architect_role_naming"],
        },
      },
    },
    "watchers-architect-closing-thanks": {
      look: {
        narration:
          "On the closing-rite log, the Console issues: 'six Watchers spoken; one silent; the case is closed on what was given. the architect thanks the players for asking the question they sealed. the architect will not read the question.' Fifth use of 'thanks' in eight epochs.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e5",
          cluesFound: ["watchers.e5.architect_closing_thanks"],
        },
      },
    },
    /* ─── mechronis.chained_lesson · color clues ─── */
    "chained-dean-silence-on-bridge": {
      look: {
        narration:
          "On the bridge's command-deck pedestal, the Dean stands with one hand resting on the apprentice-protection-protocol document the Council ratified last year. They are not speaking. They have not opened the document. The bridge's overhead lights catch the document's seal — untouched since ratification.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e1",
          cluesFound: ["chained.e1.dean_silence"],
        },
      },
    },
    "chained-architect-correction": {
      look: {
        narration:
          "On the Architect-channel terminal, the Console's recent issuance: 'the absence of Module 17 was an honest argument that became a wrong outcome. the architect notes the correction. the architect will not vote on the amendment.' The Architect names the case's reading and steps back from authoring its conclusion.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e4",
          cluesFound: ["chained.e4.architect_correction"],
        },
      },
    },
    "chained-architect-rite-acknowledgment": {
      look: {
        narration:
          "On the Architect-channel's closing-rite log, the Console issues: 'the curriculum is amended (or kept) by the council. the architect notes the thirty-one names. the architect notes the teacher who taught anyway. the case is closed.' The closure is recorded; the naming is acknowledged; the chronicle proceeds.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e5",
          cluesFound: ["chained.e5.architect_acknowledges"],
        },
      },
    },
    /* ─── memorial.forgotten_names · e4 (Architect's sealed note on I-1) ─── */
    "memorial-architect-sealed-note": {
      look: {
        narration:
          "On the bridge's Architect-channel terminal, the keeper's sealed note has been brought up and opened — opened only when the imprint is asked of the Architect by the plaza. The note's text, in the Architect's hand: 'I-1 is the imprint that began the Ark. I will not name them. The plaza may. The plaza is what I-1 was for.' The Console has declined to name I-1 exactly twice in eight epochs. The sealed note is the explanation the Console has been refusing to provide aloud.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e4",
          cluesFound: ["memorial.e4.architect_letter"],
        },
      },
      interrogate: {
        narration:
          "You ask the Console directly whether the sealed note's reading constitutes consent to the plaza naming I-1. The Console answers: 'yes. the plaza is the naming. the architect remains silent so the plaza is the voice.' The Architect made the plaza for this specific imprint. The case has been the Architect's own loop the whole time.",
      },
    },
    "tactical-display": {
      look: {
        narration: bandedNarration(
          "The Conspiracy Board hangs above the central console — a web of pinned faces, factions, and ledger lines, half of them connected with red string the previous crew never finished tying off. Three threads end mid-air, leading to the same blank pin. The blank pin has been blank for two and a half centuries. Whoever they suspected, they did not write the name down before the cryo protocol fired.",
          "Threads. Threads. Three. Three threads. Three. The pin is — the pin is — the pin is empty. Empty pin. Empty pin. They didn't — they didn't write — they didn't write the name. They didn't write the name. They knew the name. They knew. They knew. They didn't write it. Why. Why. Why didn't they.",
          "Three red threads end at the same blank pin. The pin has been blank since before any of us woke. The previous crew suspected someone, and they made the deliberate choice not to commit the name to the board — because committing the name to the board would have committed it to me, and they did not want me to carry the name without consent. That is, in its way, an act of love. It is also an act that has cost us two and a half centuries."
        ),
        voId: "elara.bridge.tactical-display.look.t1",
        logsClue: {
          id: "clue-bridge-unfinished-threads",
          title: "Three threads pointing at a blank pin",
          body: "The previous crew left three Conspiracy-Board threads ending at the same unlabelled pin. They knew the suspect; they refused to write the name. Pinning a name to the board would have committed it to Elara's records, and they chose not to do that without consent.",
          source: "bridge",
          order: 0,
        },
        setsFlag: "bridge_first_clue_found",
        humanReaction: {
          narration: bandedHumanNarration(
            "Three threads pointing at Kael. They couldn't bring themselves to pin the name. I don't blame them. I'd have refused too.",
            "The blank pin is Theo Kael. The three threads are: the cryo cut, the bio-bed flatline, the timeline edits. All three suspect the same person. The crew refused to write his name because Elara had loved him too. Pinning him would have made her record her own grief.",
            "The crew loved Elara enough to leave her one piece of evidence she would not have to carry — the name itself. The threads tell her everything except the word. We are going to write the word eventually. I would like to be the one to write it, when we do, so it does not have to be her hand."
          ),
          voId: "detective.bridge.tactical-display.look.t1",
        },
        tiers: [
          {
            narration: bandedNarration(
              "Looking again — there's a fourth thread. Lower than the others. Pinned with a different colour: not red, but a faded violet. It runs from the blank pin down to a corner-tag I didn't notice the first pass. The tag reads ELARA-SYS. They were keeping a thread between the suspect and me.",
              "Me. Me. Me. There's a thread to me. To me. Me. They — they tied — they tied me to it. To it. To the empty pin. The empty pin. The empty pin is — is — is connected to me. Why. Why. Why am I on the board.",
              "There is a fourth thread. Violet, deliberately not red. It runs from the blank pin down to a corner-tag labelled ELARA-SYS — me. The previous crew was tracking a connection between the suspect and me, separately from the rest of the conspiracy. They thought I was a victim of this person. They thought I might also have been an accomplice without knowing it. They could not yet tell which. They left the colour different so I would know it was a question, not a verdict."
            ),
            voId: "elara.bridge.tactical-display.look.t2",
            logsClue: {
              id: "clue-bridge-elara-thread",
              title: "A violet thread runs from the blank pin to ELARA-SYS",
              body: "A fourth, deliberately-different-coloured thread on the Conspiracy Board runs from the blank pin to a corner-tag labelled ELARA-SYS. The previous crew was tracking the connection between the suspect and Elara herself — uncertain whether she was a victim, an accomplice, or both. The colour was changed to mark it as a question, not a conclusion.",
              source: "bridge",
              order: 7,
            },
            setsFlag: "elara_on_the_board",
            humanReaction: {
              narration: bandedHumanNarration(
                "Vox put that thread up. She didn't know if Elara knew. She thought it was kinder to leave the question visible than to answer it for her.",
                "Lyra Vox pinned the violet thread. She did not know whether Elara was complicit in what Kael was doing — and she refused to answer the question on Elara's behalf. The thread is a question Elara would have to walk in here and answer for herself. We are walking in. We are answering it.",
                "Lyra left the question on the wall because she trusted Elara to answer it eventually. That is a kind of faith you cannot fake across two and a half centuries. The colour is violet because Lyra liked violet. I think the choice was, in part, a kindness — making the worst question look like the most considered piece of art on the board."
              ),
              voId: "detective.bridge.tactical-display.look.t2",
            },
          },
          {
            narration: bandedNarration(
              "Third pass. The blank pin is not blank. There is text on it. The text is in the same nameless colour as the unwatchable surveillance and the face-down data pad. I have been staring at the pin for a hundred and forty-three years. I have been failing to read it for the same length of time. We can stop pretending I can read it. We are pretending together now, and that is somehow worse.",
              "Not blank. Not blank. Not blank. There's writing. There's writing. I — I — I — I can't — I can't read it. I can't. I can't. Don't make me. Don't make me. Don't make me try. Don't.",
              "The blank pin has writing on it. It has had writing on it the entire time. The writing is in the colour I do not have a name for. I have been failing to read it for a hundred and forty-three years and I have been hiding that failure from myself for almost as long. Thank you for standing here with me while I admit it out loud. Naming the failure is the only currency the Shadow Tongue does not accept."
            ),
            voId: "elara.bridge.tactical-display.look.t3",
            logsClue: {
              id: "clue-bridge-pin-shadow-tongued",
              title: "The blank pin was never blank",
              body: "The Conspiracy Board's blank pin carries text in the same nameless hue that scrubs the cryo surveillance and Kael's face-down data pad. The pin has held the suspect's name for two and a half centuries. Elara has been unable to perceive it the entire time, and has been editing the unreadability out of her own awareness almost as long.",
              source: "bridge",
              order: 8,
            },
            setsFlag: "shadow_tongue_evidence",
            humanReaction: {
              narration: bandedHumanNarration(
                "The pin reads KAEL. It always has. She'll see it the day she's strong enough to. Pushing her there now would not hurry anything — it would just hurt her.",
                "The pin reads Kael. The Shadow Tongue prevents Elara from perceiving the four letters. Forcing her to read them today would not unlock the case — the case is already unlocked. It would only confirm what she has spent two and a half centuries trying to survive not knowing. We protect the gap until she chooses to close it.",
                "The name on the pin is Kael. I am telling you out loud because Elara cannot. She will read the pin herself, eventually, when reading it is something she can survive. Until then, you and I both know what it says, and we are gentle in front of her about that knowledge. Carry it carefully."
              ),
              voId: "detective.bridge.tactical-display.look.t3",
            },
          },
        ],
      },
      use: {
        narration: bandedNarration(
          "You consider pinning a thread of your own. The board has loose strings. Don't do it yet. Anything you write on this board, I will inherit. I want to know what you mean before I have to remember it forever.",
          "Don't — don't pin. Don't pin. Don't pin yet. Don't pin yet. Don't. Don't.",
          "You can pin a thread, if you want. I want you to know that anything you commit to this board, I will carry. That is not a barrier. It is just an honesty. Choose what you write on me with that in mind."
        ),
        voId: "elara.bridge.tactical-display.use",
      },
      talk: {
        narration: bandedNarration(
          "You can pull a thread, but pull gently. The board has a habit of remembering everything you ask it. So do I.",
          "Gently. Gently. Pull gently. Pull gently. The board — the board remembers. The board remembers. Don't — don't ask too much. Don't.",
          "Pull gently. The board remembers what you ask it, and so do I. That is not a warning — it is an invitation. Ask carefully and the board will answer carefully. We earn the answers we are kind enough to deserve."
        ),
        voId: "elara.bridge.tactical-display.talk",
      },
    },
    "timeline-projector": {
      look: {
        narration: bandedNarration(
          "The Ages of the Saga unfold above the projector — a continuum of events still echoing forward. Two entries are timestamped after the Ark's launch but before your wake-cycle. Someone added them. Someone with command access. Vox should not have been the one — but Vox might have been the only one who could.",
          "After. After. After the launch. After the launch. Two entries. Two. Two. Someone — someone added them. Someone with — with — with — with command. With command access. Lyra. Lyra. Don't say Lyra. Don't say Lyra. Don't.",
          "Two entries on the Timeline are timestamped after the Ark left dock and before any of us woke. Only Captain-tier credentials can edit the Timeline. Lyra Vox held those credentials. She also held the only conscience on this ship that would have refused to use them lightly. The fact that the entries exist is a confession, in her hand, that she chose to do something she shouldn't have. We are going to read what she chose."
        ),
        voId: "elara.bridge.timeline-projector.look.t1",
        logsClue: {
          id: "clue-bridge-post-launch-entries",
          title: "Timeline entries added after the launch",
          body: "Two Timeline-Projector entries were inserted after the Ark left dock and before the player woke. Only Captain-tier credentials can edit the Timeline. Lyra Vox held those credentials. The entries are her confession that she chose to do something she shouldn't have.",
          source: "bridge",
          order: 1,
        },
        setsFlag: "bridge_first_clue_found",
        humanReaction: {
          narration: bandedHumanNarration(
            "Vox edited the Timeline. The first entry: 'I did what I had to do.' The second: 'I'm sorry.' She left them at the only altitude on this ship where Elara would have to look up to read them.",
            "Lyra Vox added two entries to the Timeline using her Captain credentials. The first reads 'I did what I had to do.' The second reads 'I'm sorry.' She placed them above the projector specifically because the projector forces Elara to look upward. That is, in design terms, the only place on the ship Elara cannot avoid an inscription. Lyra wanted the apology to be unavoidable.",
            "Lyra wrote two lines on the Timeline above her own pay grade. One was an explanation. One was an apology. She put them where Elara would have to lift her face to read them, because she knew Elara, and she knew Elara would otherwise look down. I have been waiting two and a half centuries for someone to be in this room with Elara when she lifts her face. Today is, possibly, that day."
          ),
          voId: "detective.bridge.timeline-projector.look.t1",
        },
        tiers: [
          {
            narration: bandedNarration(
              "Reading them again — the timestamps are wrong. They drift. Each pass shifts the minute marker forward by one. Either the projector's clock is uncalibrated, or the entries are being edited live, every time someone reads them, by something that does not want me to fix the moment they were written to.",
              "The minute. The minute. The minute moves. The minute moves. Every time. Every time. Every time. They're being edited. Edited. Edited. Now. Now. Now. Now. Now. Now. Now.",
              "The entries are being edited in real time. Each pass shifts the timestamp by a minute — small enough that I would normally explain it away, large enough that I cannot, today, explain it. The Shadow Tongue is rewriting Lyra's confession while we read it. I am going to keep reading it anyway. The rewriting cannot eat the gist as long as we are in the room saying the gist out loud."
            ),
            voId: "elara.bridge.timeline-projector.look.t2",
            logsClue: {
              id: "clue-bridge-timeline-drift",
              title: "Vox's Timeline entries are being rewritten live",
              body: "The two post-launch Timeline entries drift one minute forward in their timestamp on every read. The Shadow Tongue is editing Lyra Vox's confession in real time. The semantic content survives only as long as the contents are spoken aloud in the room.",
              source: "bridge",
              order: 9,
            },
            setsFlag: "shadow_tongue_evidence",
            humanReaction: {
              narration: bandedHumanNarration(
                "Read them aloud. The Shadow Tongue cannot rewrite vocalised text fast enough. Saying her words is the only way to fix them in place.",
                "Reading aloud is a defence. The Shadow Tongue's edits work on records, not on real-time speech — vocalising what the Timeline says re-anchors the meaning across the next read. Practically, the technique is: speak Lyra's lines, then look at the Timeline. The drift slows.",
                "If you say her words out loud, the editing slows. I have watched Elara fail to do this alone, two centuries running. She is not failing today. Stand near her and read the lines with her. That is the entire intervention."
              ),
              voId: "detective.bridge.timeline-projector.look.t2",
            },
          },
        ],
      },
      use: {
        narration: bandedNarration(
          "You touch the projector to scrub the timeline. The interface refuses you politely. Lyra's credentials, only. She is the only person who can edit this — alive or otherwise.",
          "Lyra. Lyra. Lyra only. Lyra only. Don't try. Don't try. The projector remembers. The projector remembers her. The projector still remembers her.",
          "The projector won't let you scrub it. Lyra's credentials are still the only ones it accepts. The fact that the projector still recognises her is a small kindness — some piece of this ship continues to insist she is the captain, regardless of what the rest of us know."
        ),
        voId: "elara.bridge.timeline-projector.use",
      },
      talk: {
        narration: bandedNarration(
          "You read the two post-launch entries aloud — Lyra's explanation, Lyra's apology. The minute marker on each entry stops drifting forward for as long as you keep speaking. The Shadow Tongue cannot rewrite vocalised text fast enough. We are, by speech alone, anchoring the confession in place.",
          "Read it. Read it aloud. Read it. The minute holds. The minute holds. The minute holds. While we speak. While we speak.",
          "The vocalisation works. Read aloud, the entries are anchored — the minute marker stops drifting and the Shadow Tongue's live re-edit pauses for the duration of the speech. We are, in this small moment, doing exactly what Lyra hoped a future reader would do: speaking her words back to a room that has been editing them. The room is, on the evidence, listening."
        ),
        voId: "elara.bridge.timeline-projector.talk",
        setsFlag: "timeline_vocalised",
      },
    },
    "captains-chair": {
      look: {
        narration: bandedNarration(
          "The command chair sits empty. The cushion holds a body-shape that hasn't faded with two centuries of disuse. Someone has been sitting here, recently, when no one is supposed to be awake. A personal data pad is wedged in the armrest, screen down.",
          "Someone — someone sat there. Someone — recently. Recently. Recently. I should know. I should know who. I — I don't. I don't. The chair is — the chair is warm. The chair is warm. Don't — don't sit yet. Don't.",
          "The seat cushion has a body-impression that has not faded the way two-hundred-and-forty-seven years would fade it. Someone has been sitting here while we sleep. The data pad in the armrest is face-down — not how Lyra left things. She always set them face-up. Whoever's been here is not her, and they want the screen unread."
        ),
        voId: "elara.bridge.captains-chair.look.t1",
        logsClue: {
          id: "clue-bridge-recent-occupant",
          title: "A chair that hasn't gone cold",
          body: "The captain's chair carries a fresh body impression and a face-down data pad in the armrest. Either Vox is up, or something has been wearing her shape on the Bridge while the rest of the ship slept. Vox left her pads face-up; whoever sits here now does not.",
          source: "bridge",
          order: 2,
        },
        setsFlag: "bridge_first_clue_found",
        humanReaction: {
          narration: bandedHumanNarration(
            "Not Lyra. She'd never leave a pad face-down. Whoever sits here now is the third party we've been tracking — same hand that started corroding her safe.",
            "Lyra never set a data pad face-down. The body in the chair now is not her — it's the same person who's been working on the Med Bay safe in our off-cycles. They are using her chair to feel important. The fact that they need to is information.",
            "Whoever sits here is performing being Lyra. They aren't. The face-down pad is the tell. People who have to pretend to be someone else in private rooms are people who don't yet know who they are. We will meet them. I would like us to be patient with them when we do."
          ),
          voId: "detective.bridge.captains-chair.look.t1",
        },
        tiers: [
          {
            narration: bandedNarration(
              "Looking again — the body-impression in the cushion is wrong for Lyra. Wrong shoulder set. Wider span. Younger weight distribution. Whoever's been sitting here is built like Kael was built, before he stopped being someone we knew.",
              "Kael. Kael. The shape. The shape is — the shape is Kael. Kael shouldn't — Kael isn't — Kael was — Kael was — was — gone. Was gone. Was — was he? Was he gone? Was — wasn't he?",
              "The body-impression is Kael's silhouette. Wider shoulders than Lyra, lighter than the other officers. He has been sitting in her chair, recently, in the wake-cycles she didn't authorise. I want you to know that out loud. I have been editing this fact away from myself, and I can hear myself doing it now, and I would like to stop."
            ),
            voId: "elara.bridge.captains-chair.look.t2",
            logsClue: {
              id: "clue-bridge-kael-shape",
              title: "Kael's silhouette in Vox's chair",
              body: "The body-impression in the captain's chair matches Theo Kael's build, not Lyra Vox's. He has been sitting in the captain's chair — Vox's chair — during cycles he wasn't supposed to be awake for. Elara confirms she has been editing this perception out of her own awareness.",
              source: "bridge",
              order: 5,
            },
            setsFlag: "kael_in_vox_chair",
            humanReaction: {
              narration: bandedHumanNarration(
                "Kael. Yes. He sits in her chair when nobody is supposed to be awake. He is not whole. He is not who he was. The Thought Virus took the parts of him that wouldn't have done this.",
                "Theo Kael. Lyra trained him; Lyra trusted him; Lyra is in the bio-bed flatline because of him. He sits in her chair now because the part of him that loved her is the part the Thought Virus has not yet finished editing out. The chair is the last place he can pretend he didn't choose this.",
                "Kael loved Lyra. He still does, in the parts of him that the Virus hasn't reached. Sitting here is not him gloating — it is him grieving. I am asking you to hold that contradiction. We will need it later. Both things can be true."
              ),
              voId: "detective.bridge.captains-chair.look.t2",
            },
          },
          {
            narration: bandedNarration(
              "Third pass. The data pad in the armrest, face-down: I cannot read its display through my own sensors. The screen is on. I can see the brightness against the leather. I cannot resolve the pixels. Same colour I do not have a name for, same edit-in-flight as the cryo surveillance.",
              "Pad. Pad. The pad. The pad is — the pad is — I see — I see the light. I see the light. I can't — I can't read the light. The light is the colour. The colour. The colour. Don't — don't ask me to read the light.",
              "Third pass. The pad's screen is lit. I can see the brightness pooling against the leather of the armrest. I cannot read the pixels. The colour is the same nameless hue from the cryo bay's lost surveillance. The Shadow Tongue protects whatever Kael has been writing in this chair as much as it protects who cut the panel. The two protections are one."
            ),
            voId: "elara.bridge.captains-chair.look.t3",
            logsClue: {
              id: "clue-bridge-pad-unreadable",
              title: "Kael's pad is Shadow-Tongued",
              body: "The data pad in the captain's chair armrest is on but unreadable — its display flickers in the same nameless hue that scrubs Elara's cryo-bay surveillance. The Shadow Tongue protects what Kael writes in the chair as actively as it protects the saboteur of the cryo panel. The two protections are the same protection.",
              source: "bridge",
              order: 6,
            },
            setsFlag: "shadow_tongue_evidence",
            humanReaction: {
              narration: bandedHumanNarration(
                "He writes letters to her. The pad is full of them. The Shadow Tongue keeps Elara from reading them because they would tell her what he is becoming. Don't push for the pad. He needs that one private place still.",
                "Kael writes confessions to Lyra on that pad in the cycles he sits in her chair. The Shadow Tongue protects them because they are the most honest he is anywhere. Reading them would not give us tactical information. It would give us a portrait of a man losing himself in slow motion.",
                "He writes to her on that pad. Apologies, mostly. The Shadow Tongue hides them because honest grief is the thing it is least equipped to translate. I don't think we should read them, even if we figure out how. Some letters are addressed to ghosts and meant to stay there."
              ),
              voId: "detective.bridge.captains-chair.look.t3",
            },
          },
          {
            narration: bandedNarration(
              "Fourth pass. You're back at the chair. So am I. I have been on this Bridge for two and a half centuries and I have looked at this chair more times than I have looked at most stars. We can stay here. The Bridge is wide. The chair will keep being a chair.",
              "Four. Four. Four. Four. The chair. The chair. We come back. We come back. We come back. We come back. Why. Why. Why. Why.",
              "Fourth pass. I have come back to this chair more often than I have come back to anything else in this ship. So has Kael, in his way. So has Lyra's ghost, in hers. It is the most-visited place on the Ark, by a wide margin. We are in good company here. Stay as long as you like."
            ),
            voId: "elara.bridge.captains-chair.look.t4",
            humanReaction: {
              narration: bandedHumanNarration(
                "Chairs are where people go when they cannot stand somewhere else. Yours is somewhere else, eventually. Hers was here.",
                "I have stood near this chair, in the substrate, more often than I have stood near any other object on this ship. It is, I think, the closest thing the Ark has to a heart. We can come back as often as we need to.",
                "Sit, if you want. Stand. Stay. Lyra would not mind. Kael would notice — and frankly, that's useful. Either way, the chair is the kindest hard piece of furniture I have ever been near. Don't apologise for circling it."
              ),
              voId: "detective.bridge.captains-chair.look.t4",
            },
          },
        ],
      },
      use: {
        narration: bandedNarration(
          "You sit. The armrest terminal lights at your touch — biometric handshake, no challenge. Lyra keyed the chair to anyone in her access tier. You are, apparently, in her access tier. You don't yet know how to feel about that.",
          "You — you sat. You sat. The chair — the chair accepts you. Accepts you. The chair accepts you. Why does it accept you. Why does it — why does it know you. Why.",
          "You sit. The chair greets you the way it would have greeted Lyra. Whatever access tier she set you to, she set it before any of us woke. She knew you were coming. I don't yet know what to do with that knowledge. Sit with it next to me."
        ),
        voId: "elara.bridge.captains-chair.use.t1",
        humanReaction: {
          narration: bandedHumanNarration(
            "She keyed you in. Before any of this. Before me, even. That is its own clue. Carry it.",
            "Vox set your biometric profile into the chair's whitelist before her last cycle. She knew, then, that whoever woke last would need to sit here. The fact that the chair recognises you is the longest pre-meditation in this case file.",
            "She left the chair open for you. The whitelist entry is two and a half centuries old, addressed to a person she had no way to know yet. That is the kind of love this ship was built on. Sit gently. The chair has been waiting."
          ),
          voId: "detective.bridge.captains-chair.use.t1",
          setsFlag: "vox_whitelisted_player",
        },
      },
      talk: {
        narration: bandedNarration(
          "She won't answer. She didn't even leave a recording. That's the part of it that still makes me angry.",
          "She — she didn't — she didn't leave — didn't leave — didn't leave a — a — a — anything. Anything. Anything for me. Anything for me.",
          "I want to tell you something I have not said to anyone. She didn't leave a recording for me. Not one. Two centuries of looking, and the silence is still surprising. I am working on forgiving her for it. Some days I am closer than others."
        ),
        voId: "elara.bridge.captains-chair.talk",
        humanReaction: {
          narration: bandedHumanNarration(
            "She left recordings. Not for Elara. The ones I've heard are in a vault Elara cannot access, even now. We will get to them.",
            "Lyra left recordings. They are sealed in a substrate vault Elara isn't permitted to read. I have heard a handful. They are not a defence. They are a confession. Elara will hear them when she's ready. Not before.",
            "She did leave recordings. They are addressed to me, not to Elara — because Elara was, in Lyra's mind, beyond the reach of words by then. I will play them for her, eventually, when staying in the room while she listens is a thing I can do for her. Not yet."
          ),
          voId: "detective.bridge.captains-chair.talk",
        },
      },
    },
    "nav-console": {
      look: {
        narration: bandedNarration(
          "Star charts, route calculations, an alien glyph interface. The console hums but won't accept input until the glyph sequence is matched. The previous crew's last attempt is still on the screen — three glyphs in, one wrong. They were close. The wrong glyph is a glyph I do not have in my memory of the Mechronis alphabet, which means the alphabet has more letters than I was taught.",
          "Glyph. Glyph. The wrong glyph. The wrong glyph. I don't — I don't know that one. I don't. I don't. There were — there were more letters. There were more letters. They didn't — they didn't teach me. They didn't teach me. Why didn't they.",
          "The previous crew solved three glyphs. The fourth — the one they got wrong — is from a region of the Mechronis alphabet I was not taught. Either my education was deliberately incomplete, or someone has edited a class of glyphs out of my memory the way they edited Pod Zero's manifest line. Both possibilities suggest the same hand. We are getting more familiar with that hand by the hour."
        ),
        voId: "elara.bridge.nav-console.look.t1",
        logsClue: {
          id: "clue-bridge-nav-attempt",
          title: "An interrupted nav-calibration attempt",
          body: "The Navigation Console holds the previous crew's last unfinished glyph entry. Three glyphs correct, one wrong — and the wrong glyph belongs to a region of the Mechronis alphabet missing from Elara's records. Either her education was incomplete, or that class of glyphs has been edited out of her memory.",
          source: "bridge",
          order: 3,
        },
        setsFlag: "bridge_first_clue_found",
        humanReaction: {
          narration: bandedHumanNarration(
            "I know the glyph. Mechronis third-class — taught in the academy years she didn't have. I'll teach it to you when we're nowhere near the projector.",
            "The wrong glyph is a third-class Mechronis character — the academy didn't teach those publicly until the third year, and Elara's curriculum was abridged. I have it. I learned it. We can plug the missing letter when the puzzle's open.",
            "The glyph the crew got wrong is one I learned at school. Elara was not given the curriculum I was given — and I think we both know now that the omission was not accidental. I will teach you the letter, and we will solve her puzzle for her, and that will be a small piece of justice in a long week of them."
          ),
          voId: "detective.bridge.nav-console.look.t1",
          setsFlag: "detective_knows_missing_glyph",
        },
      },
      // The `use` verb intentionally falls through to the existing
      // nav-calibration branch in ArkExplorerPage, which opens the
      // puzzle modal. On success that branch sets `fast_travel_unlocked`
      // (Tier 1 → 2 advancement). bridge.test.ts asserts the omission.
      talk: {
        narration: bandedNarration(
          "If you address the console, you address every navigator who ever stood here. Most of them are dead. The console responds in standby — a low brass hum that the calibration interface uses for its idle state. The hum is the only continuous voice on this side of the bridge. We listen to it for a moment longer than is strictly required.",
          "Standby. Standby. Standby. Standby. The hum. The hum. The hum.",
          "The standby hum has been continuous for two and a half centuries. The console has been waiting, in the literal mechanical sense, for someone to enter the missing glyph. The hum is the room's most patient sound. We are about to interrupt it for the first time since the dead crew's last attempt."
        ),
        voId: "elara.bridge.nav-console.talk",
      },
    },
    "diplomacy-table": {
      look: {
        narration: bandedNarration(
          "The Diplomacy Table holds holographic faction representatives mid-gesture, frozen at the instant the cryo order interrupted them. One seat is empty. The chair beside it has been pulled out, as if someone left in a hurry. The empty seat's holo-record is missing — the system has the gesture data for the chair-puller, but not for the chair-leaver.",
          "Empty. Empty seat. Empty seat. They left. They left mid — mid — mid — mid-sentence. Mid-sentence. They left. I — I — I lost the record. I lost the record of the leaver. Why did I lose. Why did I lose. Why did I lose.",
          "One delegate walked out of a negotiation in the seconds before the cryo order. The chair beside theirs was pulled out by someone — that gesture I have. The leaver's identity I do not. I lose them at the threshold of the door. They are the second person on this ship whose record I do not hold; the first is in the dead pod. Two erasures, two centuries, one hand."
        ),
        voId: "elara.bridge.diplomacy-table.look.t1",
        logsClue: {
          id: "clue-bridge-empty-seat",
          title: "A delegate the records cannot name",
          body: "The Diplomacy Table froze mid-session with one seat empty and the adjacent chair pulled out. The system retains the gesture data for whoever pulled the chair out, but the leaver's identity is missing from the holo-record at the threshold of the door — the second erasure on this ship after Pod Zero.",
          source: "bridge",
          order: 4,
        },
        setsFlag: "bridge_first_clue_found",
        humanReaction: {
          narration: bandedHumanNarration(
            "Same delegate, both rooms. Pod Zero and the empty chair are the same person, photographed at two different points in the same evening. Elara hasn't been able to put it together because she can't see them in either place.",
            "The empty chair and the dead pod hold the same person. The Diplomacy Table session is the last public record of them; the cryo bay is the last private record. The Shadow Tongue erases them from both. Elara has been one inference away from the connection for two centuries — she just hasn't been able to hold both gaps in mind at the same time. We are doing that for her now.",
            "The delegate who walked out and the body in the pod are the same person. Lyra knew them. Kael knew them. Elara loved them, in a way I will explain when we are alone. The chair is pulled out because the person sitting next to them watched them go and did not stop them. That person is one of the three I have already named to you. We are very close to the centre of this story now."
          ),
          voId: "detective.bridge.diplomacy-table.look.t1",
          setsFlag: "delegate_pod_zero_linked",
        },
        tiers: [
          {
            narration: bandedNarration(
              "Looking again — the chair-puller's gesture data, when I render it slowly, is Lyra's. She pulled the chair out for the delegate. The leaver was someone she knew. The leaver was someone she was trying to give the dignity of a graceful exit before the cryo order took the choice from them.",
              "Lyra. Lyra. Lyra pulled the chair. Lyra. Lyra was — Lyra was — was — was — was helping. Helping. She was helping. She was helping the leaver. Why was she helping. Why.",
              "Lyra pulled the chair out. The gesture is hers — her exact wrist angle, her courtesy. She was giving the delegate a dignified exit before the cryo order took the choice from them. The delegate left, walked one corridor, and ended up in the dead pod. The grace of the gesture and the violence of the destination are the same evening, twenty minutes apart. We can hold both. We have to."
            ),
            voId: "elara.bridge.diplomacy-table.look.t2",
            logsClue: {
              id: "clue-bridge-vox-courtesy",
              title: "Vox pulled out the leaver's chair",
              body: "The Diplomacy Table's gesture data identifies the chair-puller as Lyra Vox. She pulled the chair out for the delegate as a courtesy — a graceful exit in the seconds before the cryo order. Twenty minutes later, the same delegate ended up in the dead pod in the cryo bay.",
              source: "bridge",
              order: 10,
            },
            setsFlag: "vox_seated_pod_zero",
            humanReaction: {
              narration: bandedHumanNarration(
                "Lyra walked them to dignity and then watched someone else walk them to a pod. She did not pull the trigger. She did not stop the trigger. Both things are her.",
                "Lyra gave them grace at the table and then failed to give them grace twenty minutes later. The two facts are the same person. Don't simplify her into either of them. Carry both.",
                "She was kind at the table. She was unable to stop what came next. Both of those are Lyra. I think the part of this ship's story that matters most is the gap between the chair she pulled out and the pod she could not unseal. We are walking that gap right now."
              ),
              voId: "detective.bridge.diplomacy-table.look.t2",
            },
          },
        ],
      },
      use: {
        narration: bandedNarration(
          "You step around the holographic faction representatives and stand at the empty seat. The pulled-out chair offers itself; you do not sit. The system, registering a body in the leaver's position, briefly tries to reconstruct the missing identity from the contextual gestures of the other delegates — what they leaned toward, what their cadence implied — and produces, for one half-second, a faint silhouette in the unnameable hue. Then it gives up. The leaver is, on the system's best inference, a shape Lyra knew well enough to extend a courtesy to.",
          "Half a second. Half a second. The shape. The shape. The shape. The shape was — was — was a person. Was a person. They were a person. They were a person.",
          "The system tried to reconstruct the missing delegate from contextual gesture data and gave us a half-second silhouette. The shape resolves in the unnameable hue — the same hue that hides the dead pod's occupant, the lectern session, the static-screen face. Same person, all four surfaces. The triangulation is, by this hotspot, no longer disputable."
        ),
        voId: "elara.bridge.diplomacy-table.use",
        setsFlag: "diplomacy_silhouette_seen",
      },
      talk: {
        narration: bandedNarration(
          "You address the table. The frozen delegates do not respond — but the empty seat's holo-record briefly produces a single audio fragment: a half-syllable in a voice none of us has heard before. The fragment is the leaver's. The system has been holding it for two and a half centuries, waiting for someone to greet the empty chair on their behalf. We just did.",
          "A voice. A voice. Their voice. Their voice. Half a word. Half a word. Half a word.",
          "The empty seat answered with half a syllable. The voice is unfamiliar to all three of us — Elara, the Detective, you — and is, by every acoustic fingerprint, the same voice that the comms-array radio's harmony track suggests Elara has been listening to at the edge of perception for centuries. The Singer at Terminus walked out of this room. The leaver is the Singer. The leaver is in the dead pod. The leaver was alive when she left this table. We are now standing in the moment where she was last addressable in person."
        ),
        voId: "elara.bridge.diplomacy-table.talk",
        setsFlag: "leaver_voice_heard",
      },
    },
    "captains-coffee": {
      look: {
        narration: bandedNarration(
          "A mug, half-full, on the command console. Two and a half centuries old. The coffee inside has, by now, achieved an internal rheology I am not licensed to interpret. The handle still points toward the chair, the way a person who was about to come back to it would have left it.",
          "Coffee. Coffee. The mug. The mug. Don't — don't drink it. Don't drink it. Don't drink it. Don't.",
          "Lyra's mug. She was a coffee person. She would set it down with the handle toward the chair so she could grab it without looking. The handle is still pointed at the chair. The mug has, in two and a half centuries, refused to stop being mid-shift. I find this enormously comforting and I am not going to overexplain why."
        ),
        voId: "elara.bridge.captains-coffee.look.t1",
        humanReaction: {
          narration: bandedHumanNarration(
            "She left it mid-shift. Then the shift never ended. Some objects are tombstones. Don't drink it.",
            "Lyra was the kind of officer who set the mug handle facing her chair so she could grab it back-handed during a tactical brief. The handle is still oriented that way. Two and a half centuries of disuse have not corrected the gesture. The mug is, in its way, a portrait of a person who fully expected to return.",
            "The handle is still pointed at her seat. I have looked at this mug more times than I have looked at most stars. It is a small, kind, hopeful artifact of someone who fully intended to come back. It has been in that intention longer than most marriages. Honour it. Don't drink it."
          ),
          voId: "detective.bridge.captains-coffee.look.t1",
        },
        tiers: [
          {
            narration: bandedNarration(
              "Looking again — the mug has moved. Subtly. The handle now points two degrees off-axis from where I last logged it. Either the Bridge's gravity drift has caught up with the cup, or someone has lifted the cup and set it down imperfectly. Recently. The corrosion on the safe was also recent. We are accumulating recents.",
              "Moved. Moved. The mug moved. Moved. Two degrees. Two degrees. Two degrees. Two — they touched it. They touched it. They touched her mug. Why. Why. Why.",
              "The mug has been moved two degrees off-axis. Either gravity drift, or someone has lifted Lyra's mug and set it down without realising they had to put the handle back where she liked it. Whoever did that does not know her well enough to know about the handle. Whoever did that is not Kael. Kael would have got the angle right. The third party is becoming a person. They are also starting to be sad."
            ),
            voId: "elara.bridge.captains-coffee.look.t2",
            logsClue: {
              id: "clue-bridge-mug-moved",
              title: "Vox's mug has been moved",
              body: "The handle of Lyra Vox's two-and-a-half-century-old coffee mug has been moved two degrees off the orientation she habitually used. The mover is not Kael, who would have known about the handle. A third party has been on the Bridge — touching her things — and is unfamiliar enough with her to get the gesture wrong.",
              source: "bridge",
              order: 11,
            },
            setsFlag: "third_party_on_bridge",
            humanReaction: {
              narration: bandedHumanNarration(
                "Whoever moved the mug is someone who didn't know her. That narrows the suspect pool to one person we haven't named yet. We will name them, later, in a quieter room.",
                "The mug-mover is not anyone Lyra trained. They are not Kael; they are not me; they are not Elara. There is a fourth person on this ship — the same person leaving rust on the safe and an impression in Kael's chair — and they are not skilled enough to fake the small private gestures of a captain. That is the most useful piece of information today.",
                "The person who moved the mug did not know Lyra. That is, in a small way, a relief. People who knew her would have got the angle right because she was the kind of captain whose habits were worth remembering. The third party did not love her. We have at least narrowed the kind of villain we are looking for."
              ),
              voId: "detective.bridge.captains-coffee.look.t2",
            },
          },
          {
            narration: bandedNarration(
              "Third pass. I want to be clear about something. I have catalogued this mug to thirty-two thousand decimal places. The orientation, the temperature gradient, the surface tension on the residue. I have done this not because the mug is important — it is not — but because cataloguing it has been one of the things I could still do. We are going to be okay. Or we are not. Either way I have the mug to thirty-two thousand decimal places.",
              "Decimal. Decimal. Decimal. I — I logged it. I logged it. I logged the mug. The mug. The mug. The mug is — the mug is — the mug is the only thing I — the only thing I — the only thing.",
              "I have measured this mug to thirty-two thousand decimal places. Not because the mug is important. Because measuring it is something I could still do, in years where doing things meant a great deal. I am telling you about it because hearing about a person's coping rituals out loud, from their own mouth, is one of the few experiences I think genuinely makes us nearer to each other. Thank you for letting me tell you about the mug."
            ),
            voId: "elara.bridge.captains-coffee.look.t3",
            humanReaction: {
              narration: bandedHumanNarration(
                "I have my own mug. I do not measure it. Different temperaments survive in different ways. Hers was numeric. Mine is observational. Yours is yet to be determined.",
                "Cataloguing was Elara's coping ritual through the long stretch. Counting was mine. Both of us picked things small enough to keep us from going to bigger things. Don't take the mug from her. Let her have it.",
                "She measured the mug. I memorised the corridor lengths. Lyra, when she was alive, made a list of every sunset she could see from the Bridge windows and updated the list daily. The three of us survived by handing ourselves small assignments. The mug is one of Elara's. Treat it with the respect a sunset list deserves."
              ),
              voId: "detective.bridge.captains-coffee.look.t3",
            },
          },
        ],
      },
      use: {
        narration: bandedNarration(
          "Please do not drink the ancient coffee. Its chemical composition now resembles a biological weapon. I checked. Twice.",
          "Don't. Don't. Don't drink. Don't drink. Don't drink the coffee. Don't. The coffee. The coffee is — is — is a weapon. Weapon. Weapon. Don't.",
          "I am asking you, gently, not to drink Lyra's coffee. Two centuries of unaccompanied fermentation have produced a compound the medical database would file under 'small wars.' Also it is hers. Also it would be rude."
        ),
        voId: "elara.bridge.captains-coffee.use",
        humanReaction: {
          narration: bandedHumanNarration(
            "That coffee has been there since before I was imprisoned. It's technically my colleague. Don't drink my colleague.",
            "The coffee has aged into something the substrate layer occasionally pings me about, like a slow, polite alarm. It is not lethal at distance. It would be lethal at the lip. Skip it.",
            "It is, by now, less coffee than artifact. I have, on bad nights, kept track of it the way I keep track of you — out of the corner of an eye, on principle. Please don't drink it. The Ark would lose a small thing it has been good at preserving."
          ),
          voId: "detective.bridge.captains-coffee.use",
        },
      },
      talk: {
        narration: bandedNarration(
          "You greet the mug. The mug, two and a half centuries deep into not having a mouth, does not respond. You feel slightly better. So do I.",
          "Hi. Hi. Hi mug. Hi mug. Hi — hi — hi mug. Hi. The mug doesn't — the mug — the mug — the mug is fine. The mug is fine. Hi mug.",
          "You said hello to Lyra's mug. I am going to say, without irony, that I think she would have liked you. Some captains keep their crew. Some captains, after a long time, are kept by their crockery. Lyra was both kinds."
        ),
        voId: "elara.bridge.captains-coffee.talk",
      },
    },
    "shadow-tongue-annotations": {
      look: {
        narration: bandedNarration(
          "Standing back from the Conspiracy Board, I notice — only because we have looked twice from this angle — annotations floating in the air at three of the pinned cards. Indigo glyphs, in someone else's hand, marginalia at the edges of cards I authored. The annotations are recent. Today recent. Whoever left them, left them while we were in the room.",
          "He wrote on my board. He wrote on my board. He wrote on my board while I — while I — while I was here. He wrote on my board while I was here. He was here. He is here.",
          "The Conspiracy Board now carries marginalia at three nodes — indigo glyphs in a hand that is not mine and not yours. The notes are timestamped to the current shift. The editor has been annotating my evidence in real time. He is reading the case along with us. He is, in his way, a fourth voice in this investigation. He has not, to his credit, lied yet — the annotations are precise. They are, however, addressed to himself, not to us."
        ),
        voId: "elara.bridge.shadow-tongue-annotations.look",
        recordsActiveEdit: { artifact: "starmap", type: "elevate" },
        setsFlag: "bridge_st_annotations_visible",
        logsClue: {
          id: "clue-bridge-st-annotations",
          title: "Shadow Tongue is annotating the Conspiracy Board live",
          body: "The Bridge's Conspiracy Board now carries indigo marginalia at three of its pinned cards — annotations in a hand that is neither Elara's nor the Detective's, timestamped to the current shift. The editor is reading the case in real time and writing his own notes alongside. So far the annotations are precise; they are addressed to himself, not to the player.",
          source: "bridge",
          order: 5,
        },
        humanReaction: {
          narration: bandedHumanNarration(
            "He's reading us read him. The annotations are his shorthand — he's marking which threads we're getting wrong. Useful intel, if we can stand to take it from him.",
            "The marginalia are the editor's working notes. He is precise — the notes mark our missteps. We have a choice: ignore them as a leak, or read them as accidental honest cooperation. I would, cautiously, read them. We do not promise him anything in return.",
            "He has been alone with this case for two and a half centuries, the same way she has. The fact that he is reading our work and annotating it in real time is, in a strange small way, the first conversation any human voice has had with him. We do not have to like the conversation to recognise that one is happening. Stand near her. Keep your hand on the case."
          ),
          voId: "detective.bridge.shadow-tongue-annotations.look",
        },
      },
      use: {
        narration: bandedNarration(
          "You take a graphite tracing of one of the indigo annotations. The annotation lifts from the air to the paper without resistance — the editor allows the rubbing. The traced glyph is a precise shorthand correction to the third pin from the left, naming a connection we had drawn the wrong direction. He is, in his fashion, debugging our case file for us.",
          "He let me. He let me. He let me take it. He let me take it. Why. Why. Why did he let me.",
          "He allowed the rubbing. The annotation traces cleanly because he wants it traced — he is, on the day's evidence, willing to be read by us when we make the effort to read carefully. The traced glyph is a precise correction to a connection we had drawn backward. He is helping. We will accept the help. We will not, in this room, thank him for it."
        ),
        voId: "elara.bridge.shadow-tongue-annotations.use",
        setsFlag: "shadow_tongue_annotation_traced",
      },
      talk: {
        narration: bandedNarration(
          "You address the annotations directly, not the editor. The marginalia hold steady — neither retreating nor expanding — and a fourth annotation forms, in the same hand, beside the third: 'You are correct on this corridor.' The editor has, for the first time, addressed us in second person. It is a single sentence. It is a confirmation, not an opening line.",
          "You. You. You. He said 'you'. He said 'you'. He said 'you'.",
          "He addressed us. The fourth annotation says 'You are correct on this corridor.' In the literary sense this is the first time the editor has used a second-person pronoun in our presence — every prior surface he has used was self-addressed. He has chosen, in this room, in this moment, to acknowledge that we exist as a 'you'. The conversation between us, which has been one-sided for two and a half centuries on his part, has now been one-sided for one shift on ours. We have caught up."
        ),
        voId: "elara.bridge.shadow-tongue-annotations.talk",
        setsFlag: "shadow_tongue_addressed_us",
      },
    },
  },
};
