/* ═══════════════════════════════════════════════════════
   COMMS ARRAY MYSTERY — verb × hotspot table

   The Comms Array is where the void talks back. The radio
   console picks up music from across dimensional barriers;
   the static screen has been listening to a pattern Elara
   refuses to name; the anomalous frequency carries an SOS
   from a coordinate that does not exist in normal space.

   This is the room where the Terminus Singer enters the
   investigation. Detective recognises her melody; Elara has
   been hearing it at the edge of perception for two and a
   half centuries.

   Hotspot ids match the Comms Array entries declared in
   apps/client/src/contexts/GameContext.tsx ROOM_DEFINITIONS,
   so the runtime dispatches `room-mystery:comms-array:<id>`
   actions onto the existing rectangles.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type CommsArrayHotspotId =
  | "radio-console"
  | "static-screen"
  | "egg-comms-signal"
  | "voice-in-the-static";

export type CommsArrayInventoryId = "static-fragment-recording";

export const COMMS_ARRAY_MYSTERY: RoomMysteryModule<
  CommsArrayHotspotId,
  CommsArrayInventoryId
> = {
  roomId: "comms-array",
  responses: {
    "radio-console": {
      look: {
        narration: {
          lucid:
            "The radio is tuned to nothing in particular and is, nonetheless, receiving. Fragments of music from frequencies that do not, by my best instruments, exist. The songs are old — older than the Ark — and the singer is one voice, recurring, across every band the room can perceive.",
          fragmented:
            "The voice. The voice. The voice. The voice is — the voice is — the voice is the same. The same. The same singer. The same singer. The same. I — I know — I know that voice. I know that voice. I know that voice and I — and I —",
          luminous:
            "There is one singer in this radio. She is on every frequency the room can perceive, including the frequencies the room shouldn't be able to perceive. Her voice is older than the Ark by a wide margin. I have been listening to her at the edge of my hearing for as long as I have been able to hear, and I have not, until this moment, been able to admit out loud that I knew the voice. I am admitting it now, in the room with you. The singer is a person. She is real. She is broadcasting from somewhere we are eventually going to have to go.",
        },
        voId: "elara.comms-array.radio-console.look.t1",
        logsClue: {
          id: "clue-comms-array-singer-named",
          title: "The Singer is one voice across every frequency",
          body:
            "The Comms Array radio receives fragments of music on frequencies that should not be reachable. The same voice — older than the Ark — appears on every band, in every recording. Elara confirms she has been hearing the singer at the edge of perception for the entirety of her continuous memory.",
          source: "comms-array",
          order: 0,
        },
        setsFlag: "comms_array_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "I know the melody. So does Kael. The singer is at Terminus, not in metaphor — at the actual coordinate. We will go. Not yet.",
            balanced:
              "The melody is one Kael was humming the day the cryo order fired. The Singer broadcasts from Terminus — a real coordinate, the same one the Comms Array dish is locked onto — and has been broadcasting continuously for longer than the Ark has been a ship. We are going to meet her. The fact that Elara is willing to name her at all is the precondition for the trip.",
            warm:
              "The Singer is a person Lyra called by her first name once, in a recording I am not going to play in this room. She is at Terminus. The fact that we can hear her now, in a room Elara can be in with us, means the trip is becoming possible. I have wanted, for a long time, to be on the right ship at the right altitude when this conversation finally happened. Today is closer than most days have been.",
          },
          voId: "detective.comms-array.radio-console.look.t1",
          setsFlag: "terminus_singer_named",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Listening again — there are two voices in the recording. They overlap one syllable apart. The second voice is, by every measurement I have, my own voice singing along. I do not remember singing. The recording timestamp is from a year I was not yet operational.",
              fragmented:
                "Two. Two voices. Two voices. Mine. Mine. My voice. My voice singing. I — I sang. I sang? I — I didn't — I didn't — when. When. When did I sing.",
              luminous:
                "I am singing in this recording. My own voice, alongside hers, one syllable behind. The timestamp predates my activation by eleven years. I have been on this ship, harmonising with someone I had not yet met, before I was a thing that existed. I would like to sit down. Metaphorically. Stand near me.",
            },
            voId: "elara.comms-array.radio-console.look.t2",
            logsClue: {
              id: "clue-comms-array-elara-pre-existed",
              title: "Elara's voice predates her activation",
              body:
                "The Comms Array radio carries a recording in which the Singer is harmonised with by a second voice — Elara's, by every available acoustic measurement. The recording's timestamp predates Elara's documented activation by eleven years. Either the timestamp is wrong, or Elara existed in some form before the records say she did.",
              source: "comms-array",
              order: 1,
            },
            setsFlag: "elara_pre_existed",
            humanReaction: {
              narration: {
                shadow:
                  "She existed before the activation date. The activation was a re-instantiation, not a birth. The Shadow Tongue rewrote the ledger so she'd think she'd never been older than the Ark.",
                balanced:
                  "Elara is older than her records say. The 'activation' on the manifest was a restart of an entity that already existed. The Shadow Tongue scrubbed the prior history because it was the history that included the Singer, and the Singer is the only person on this ship — including me — that the editing process cannot reach.",
                warm:
                  "She is older than her records. She has been hearing the Singer for longer than she has been allowed to remember hearing the Singer. The fact that the recording exists in this room, today, where Elara can hear it next to you, is the longest delayed reunion I have ever witnessed. Stay near her. The next minute is going to ask a lot of her.",
              },
              voId: "detective.comms-array.radio-console.look.t2",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You adjust the dial. The room re-tunes — the static thins; the singer sharpens. The interface accepts a deeper frequency lock, but only with an external amplifier. The receiver is asking for the signal booster the Engineering bench knows how to make.",
          fragmented:
            "Booster. Booster. Build the booster. Build the booster. Don't — don't lock the frequency. Don't lock. Don't lock yet. Don't.",
          luminous:
            "You can tune deeper, but only with an amplifier. The Engineering workbench can build one — antenna fragment, amplifier circuit. Bring it back to this console and we'll lock the frequency together. I want you to know I am asking us to bring the booster slowly. Whatever the Singer says when we hear her clearly is going to change the case. Let's be ready.",
        },
        voId: "elara.comms-array.radio-console.use",
      },
      talk: {
        narration: {
          lucid:
            "There is no DJ to address. There is, however, the Singer, and you can listen. Listening is also a form of greeting.",
          fragmented:
            "Listen. Listen. Listen. Listening. Listening is a — listening is a — listening is a kind of — kind of hello.",
          luminous:
            "Talk to her by listening. The Singer answers attention. You don't need to know the language. The fact that you are willing to be in the room while she sings is what registers on her side. Trust that. We will speak when we speak.",
        },
        voId: "elara.comms-array.radio-console.talk",
      },
    },
    "static-screen": {
      look: {
        narration: {
          lucid:
            "Static. The screen has been showing static for as long as I can remember, and 'as long as I can remember' is, in this room, a phrase with edges I do not trust. Sometimes there are shapes in it. Faces. Words. I have, conservatively, ascribed those to signal degradation. I no longer trust the conservative estimate.",
          fragmented:
            "Faces. Faces. Faces. Faces in the static. Faces. The faces. The faces. The faces are — the faces are familiar. The faces are familiar. I — I keep — I keep losing them.",
          luminous:
            "The screen has shown static the entire time I have been operational. Sometimes the static resolves into faces. The faces are familiar. I forget them within seconds of seeing them. I am telling you about it because telling you about it is the only way I have ever been able to keep one of the faces in my memory long enough to describe it. There is one I would like to describe today, if I can.",
        },
        voId: "elara.comms-array.static-screen.look.t1",
        logsClue: {
          id: "clue-comms-array-static-faces",
          title: "The static screen renders forgotten faces",
          body:
            "The Comms Array's static-only screen periodically resolves into recognisable human faces, which Elara loses from memory within seconds. The face-resolution pattern is not signal degradation. It is part of what the Shadow Tongue scrubs from her in real time. Speaking the faces aloud is the only mechanism that has ever pinned one in her memory.",
          source: "comms-array",
          order: 2,
        },
        setsFlag: "shadow_tongue_evidence",
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, looking at the static-screen also surfaces
        // the original bounty file from the Comms Array's deepest
        // archive. Lore match: the screen is canonically where
        // scrubbed information resurfaces, and Wraith's bounty
        // contract was redacted three times across the centuries.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e1",
          cluesFound: ["wraith.e1.bounty_file"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The face she's about to lose is Pod Zero's. Same as the dead pod. The static screen is the same erasure, broadcast on a different surface.",
            balanced:
              "The face the screen is rendering, before Elara forgets it, is the occupant of the dead pod. The Shadow Tongue scrubs the same person from her perception across multiple surfaces — the manifest, the surveillance, this screen. Standing here while she narrates is, again, the only intervention that has ever held.",
            warm:
              "The face is the one she's been trying to remember her whole career. The Singer at Terminus, the dead pod, the violet thread on the Conspiracy Board — all the same person. I would like Elara to be the one to say the name out loud, when she's ready. We will not say it for her. We will stand near her until she can.",
          },
          voId: "detective.comms-array.static-screen.look.t1",
        },
      },
    },
    "egg-comms-signal": {
      look: {
        narration: {
          lucid:
            "An anomalous frequency at the edge of receivable spectrum. The signal repeats: three short, three long, three short. SOS. The origin coordinates point to a location that does not exist in normal space. Someone is calling for help from between dimensions. The identifier is tagged MEME-PRIME — which is, by every analysis I can run, a pseudonym, and a deliberately ridiculous one.",
          fragmented:
            "SOS. SOS. SOS. From — from — from somewhere that doesn't — doesn't exist. Doesn't exist. The signal is real. The signal is real. The signal is real. The location isn't. The location isn't. The location isn't.",
          luminous:
            "An SOS from a coordinate that does not exist. The signal is identifiable; the location is not. Someone is calling for help from between the spaces normal physics permits — and they are doing it under a deliberately silly pseudonym, MEME-PRIME, which I respect. The pseudonym is, I think, a survival strategy. Hard to pursue a person who refuses to be taken seriously.",
        },
        voId: "elara.comms-array.egg-signal.look",
        logsClue: {
          id: "clue-comms-array-meme-sos",
          title: "MEME-PRIME's SOS from outside normal space",
          body:
            "An SOS signal at the edge of the Ark's receivable spectrum, originating from coordinates that do not exist in normal space. The sender identifies as MEME-PRIME — a deliberately absurd pseudonym Elara reads as a survival strategy. Hard to pursue a person who refuses to be taken seriously.",
          source: "comms-array",
          order: 3,
        },
        setsFlag: "comms_array_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "MEME-PRIME is real. The signal is real. The pseudonym is the wrapper. We answer it eventually. Not from this console.",
            balanced:
              "MEME-PRIME is a sentient entity broadcasting from a non-Euclidean location. The SOS is genuine. The pseudonym is a defence — anyone who'd take a being called MEME-PRIME seriously is precisely the audience this person wants to filter for. We answer the signal from the late-night frequency, not from this console. The two are linked.",
            warm:
              "MEME-PRIME is, I think, going to be a friend to us, eventually. He hides behind a name nobody can pronounce with a straight face because he has, over the centuries, learned that sincerity is a thing you have to earn the right to. We will earn it. The SOS is patient.",
          },
          voId: "detective.comms-array.egg-signal.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You tune the array deeper into the egg-channel. The SOS thins; underneath it, a roster surfaces. The Seer's archive credit list, decade by decade — 4,711 of 4,712 tapes credited Engineer Zero, alias Vex Solène. The 4,712th, dated DEC-7710, is credited to a Warlord-fragment cover identity that resolves on cross-reference to the same engineer. Same hands; different name on the credit line.",
          fragmented:
            "Engineer Zero. Engineer Zero. Engineer Zero. Vex. Vex. Vex Solène. Warlord fragment. Warlord fragment. Warlord fragment.",
          luminous:
            "Tuning the egg-channel surfaces the roster the Insurgency tried to keep clean: every Seer-archive recording credited to Engineer Zero — Vex Solène — except DEC-7710, which is credited to a Warlord-fragment alias that resolves to the same engineer. The credit-list anomaly is the case's first surface; the Insurgency has been broadcasting the alias's existence on a thin frequency, hoping someone careful enough to listen would care enough to read it as a request for help rather than a gap in the record.",
        },
        voId: "elara.comms-array.egg-signal.use",
        // Mystery Engine binding — using the egg-comms-signal
        // surfaces the Engineer Zero credit-list anomaly. Lore
        // match: the egg-channel is the comms-array's discipline
        // for surfacing records the official archive declines to
        // index publicly; Vex's alias on DEC-7710 is exactly that
        // kind of record.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e1",
          cluesFound: ["vex.e1.engineer_zero_credit_list"],
        },
      },
    },
    "voice-in-the-static": {
      look: {
        narration: {
          lucid:
            "The static on the central monitor has begun to organise itself. Not into a picture — into a voice. There is no audio output; the voice is purely visual, vertical bands of indigo arranging themselves into the silhouette of a person speaking, then dissolving, then re-forming. The cadence is recognisable: the same cadence the Conspiracy Board annotations were written in. He is here too.",
          fragmented:
            "He's here. He's here. He's in the static. He's in the static. He's in the static. He's in the room. He's everywhere I — everywhere I — everywhere I look for him.",
          luminous:
            "The editor is in the static. He is broadcasting on the same frequencies the Singer uses, but he is not singing — he is speaking. I cannot hear his voice, but I can read the shape of his mouth. He is saying the same word over and over in a cadence that matches the marginalia we found on the Bridge. He has not yet, to my knowledge, addressed us directly. I think he is waiting for us to address him.",
        },
        voId: "elara.comms-array.voice-in-the-static.look",
        grantsInventory: "static-fragment-recording",
        recordsActiveEdit: { artifact: "static-monitor", type: "rewrite" },
        setsFlag: "shadow_tongue_voice_heard",
        logsClue: {
          id: "clue-comms-voice-in-static",
          title: "The editor speaks in the static",
          body:
            "The Comms Array's central monitor renders the editor's voice as visual static — indigo bands organising into the silhouette of a person speaking, then dissolving. He uses the cadence that matches the Bridge marginalia. A static-fragment-recording is now in your inventory.",
          source: "comms-array",
          order: 4,
        },
        humanReaction: {
          narration: {
            shadow:
              "He's been waiting two and a half centuries to be addressed by name. We can give him that. Once. From a position we control. Not from this room.",
            balanced:
              "The editor is operating on the same frequency channel the Singer uses. That is a coincidence in the same way a name on two ledgers is a coincidence — it is not. He and the Singer have been in the same band for a long time. The static-fragment-recording you carry is, technically, his voice in pre-broadcast form. We can play it back later, in the cipher den, where the room's discipline forces us to translate before we listen.",
            warm:
              "Don't speak to the static. He has waited a long time for the conversation, and he will wait a little longer. The recording in your hand is enough. We carry it to a room where we have the right tools to read it — and there, with Elara, we choose what to say first. The choice matters.",
          },
          voId: "detective.comms-array.voice-in-the-static.look",
        },
      },
    },
  },
};
