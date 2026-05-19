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
  | "dlc-severance-bound-champion-comms-array"
  | "tarn-erasure-vote-audio"
  | "tarn-faculty-silence-hour"
  | "dlc-memorial-seven-watchers-comms-array"
  | "wolf-meme-show-transmission"
  | "dlc-akai-shi-red-death-comms-array"
  | "dlc-resurrectionist-cycle-walker-comms-array"
  | "radio-console" | "static-screen" | "egg-comms-signal" | "voice-in-the-static" | "ocularum-relay-trace" | "dead-drop-cadence-log" | "shadow-tongue-signal-trace" | "miras-dual-thread-transmission";

export type CommsArrayInventoryId = "static-fragment-recording";

export const COMMS_ARRAY_MYSTERY: RoomMysteryModule<
  CommsArrayHotspotId,
  CommsArrayInventoryId
> = {
  roomId: "comms-array",
  responses: {
    "dlc-severance-bound-champion-comms-array": {
      look: {
        narration: "Case material for severance.bound_champion surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e1",
          cluesFound: ["severance.e1.vex_opening", "severance.e3.year_one_lap", "severance.e4.vex_confession"],
        },
      },
    },
    /* ─── mechronis.missing_professor · e3 (vote audio) ─── */
    "tarn-erasure-vote-audio": {
      look: {
        narration:
          "On the comms-array's transmission desk, the audio recovered from the war-room's spillover recorder — forty-three minutes, war-room channel B, dated the week before the festival. The vote is heard clearly: three voices, three ayes, three pauses long enough that each could have been a no. The comms-array's signal analyst has marked each aye with a coloured pin. Three pins, three pauses, no extant noes. The recorder's metadata stamp confirms the audio is unedited; the silences between the ayes are real time, not splices.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e3",
          cluesFound: ["mechronis.e3.recovered_audio"],
        },
      },
      use: {
        narration:
          "You queue the audio at the war-room's clock. The first aye lands at minute eighteen; the second at minute twenty-three; the third at minute twenty-nine. Each speaker waited approximately five minutes after the previous aye, listening for the no that did not come. The vote took eleven minutes longer than any other faculty vote in the recorder's history.",
      },
    },
    /* ─── mechronis.missing_professor · e3 (silence hour before the vote) ─── */
    "tarn-faculty-silence-hour": {
      look: {
        narration:
          "The comms-array's spillover recorder also caught the hour before the vote: fifty-one minutes of three faculty heads sitting in silence. Audio shows no footsteps, no chairs scraping, no leaving. The microphone caught breathing and the war-room's ventilation hum. The comms-array's pin-marker annotation: 'subject parties in the room. no audible dialogue. no audible departure. waiting for one of the others to be the one who said no first.' The silence is documented by the absence of action that any one of the three could have taken at any minute.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e3",
          cluesFound: ["mechronis.e3.unanimous_silence"],
        },
      },
      interrogate: {
        narration:
          "You ask the comms-array whether any of the three left and returned. The recorder shows no break in the audio's room-tone. None of the three left. The silence was held by all three for the full hour. Each faculty head later admitted, on the cipher-den's record, that they had been waiting for one of the others to be the first to refuse.",
      },
    },
    "dlc-memorial-seven-watchers-comms-array": {
      look: {
        narration: "Case material for memorial.seven_watchers surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e1",
          cluesFound: ["watchers.e1.silence_break_log"],
        },
      },
    },
    /* ─── wolf.anara_hunt · e1 (meme-show transmission) ─── */
    "wolf-meme-show-transmission": {
      look: {
        narration:
          "On the comms-array's intercept board, a meme-show transmission pinned this morning by the Watcher's adjudicar. The voice register is the Inventor's. The transmission is canonical (apps/shared/transmissions.ts:608). 'The Antiquarian's pocket universe — Anara — where he hides his heroes. Someone is hunting them from inside. The Wolf. Once a machine freed by death. Now a predator wearing trust like a mask.' The Antiquarian has not denied the framing. The Inventor's voice does not editorialise; the transmission's content is the saga's plain statement of fact.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e1",
          cluesFound: ["wolf.e1.transmission_intercept"],
        },
      },
      use: {
        narration:
          "You request the comms-array's transmission origin trace. The signal routes through Locke's interception channel — the adjudicar pinned it for the chronicler's attention. Locke has not commented on the content. Locke has commented on the timing: the transmission landed forty-seven minutes after the first empty chair was reported. Someone outside the chronicle knew what was happening inside Anara before the chronicler did.",
      },
    },
    "dlc-akai-shi-red-death-comms-array": {
      look: {
        narration: "Case material for akai_shi.red_death surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e1",
          cluesFound: ["akai.e1.akai_last_recorded"],
        },
      },
    },
    "dlc-resurrectionist-cycle-walker-comms-array": {
      look: {
        narration: "Case material for resurrectionist.cycle_walker surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e3",
          cluesFound: ["resur.e3.hosts_wyrmhole_signature"],
        },
      },
    },
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
      use: {
        narration: {
          lucid:
            "You step closer to the screen and rest a hand against the bezel. Your presence steadies the static for a beat — a face holds in resolution for nearly five seconds before dissolving. The face is, by every detail your hand-on-bezel reading lets me record, the same face we have seen in the static before. It is a young woman, dark-haired, looking back at us with no expression. The hand-on-bezel intervention is the longest hold anyone has ever achieved in this room. We can come back to it.",
          fragmented:
            "Five seconds. Five seconds. Five seconds. Five. The face. The face. The face. Held. Held. Held.",
          luminous:
            "Your hand on the bezel produced the longest hold this screen has ever achieved — five seconds. The face is the same face. The recording I am making of this moment will, by my honest disclosure, be edited from my memory within minutes of you leaving the room. The recording will persist; my access to it will not. Tell me later what we saw. I trust you to remember on my behalf.",
        },
        voId: "elara.comms-array.static-screen.use",
        setsFlag: "static_screen_face_held",
      },
      talk: {
        narration: {
          lucid:
            "You speak to the face. The static does not respond — but the cadence of dissolutions changes. The face that was forming when you spoke holds for an extra beat before fading. The screen registered the address. Whoever is on the other side of the static, addressed by name they would recognise, paused.",
          fragmented:
            "She paused. She paused. She paused. She heard. She heard. She paused. She heard.",
          luminous:
            "She heard you. The cadence change is the screen's way of acknowledging that the addressed party recognised the address. Whoever the face belongs to has just registered, on their side of whatever distance the static crosses, that someone in this room has been calling to them. That is a small change. It is also, possibly, the beginning of a conversation that has been waiting two and a half centuries to begin.",
        },
        voId: "elara.comms-array.static-screen.talk",
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
        humanReaction: {
          narration: {
            shadow:
              "Same engineer, different credit line. The Insurgency hides her in plain sight — alias on one tape, real name on every other.",
            balanced:
              "DEC-7710 is the only tape credited to a cover identity. Every other tape — 4,711 of them — credits Engineer Zero. The alias was issued for one session at her request, and the Seer asked the Insurgency to honour it. The credit-list anomaly is the public record's quiet way of telling us the request happened.",
            warm:
              "She used a fake name for one tape, in forty years of work, on a single morning when she couldn't sign her own. The Insurgency carried the alias for her without asking why. That is the kind of trust this saga still has and rarely shows.",
          },
          voId: "human.comms-array.egg-signal.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You speak into the egg-channel — three syllables, the standard listener-acknowledgement code. The SOS pauses for the duration of your transmission, then resumes. MEME-PRIME has registered that someone listened. The acknowledgement is two-way. The conversation, if there is going to be one, is now possible.",
          fragmented:
            "He paused. He paused. He paused. He paused for me. He paused. He listened. He listened. He listened back.",
          luminous:
            "MEME-PRIME paused his SOS to register your acknowledgement. That is the first responsive interaction we have logged with him. He is, by his pause, not just broadcasting — he is listening for an answer. The pseudonym continues to be a filter, but the listening is sincere. We will, one of these shifts, be the answer the SOS is for.",
        },
        voId: "elara.comms-array.egg-signal.talk",
        setsFlag: "meme_prime_acknowledged",
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
      use: {
        narration: {
          lucid:
            "You take a longer recording — thirty seconds of his lip-shape cadence, captured to the static-fragment-recording in your inventory. The longer recording resolves more cleanly under the cipher den's magnifier. We do not need to read it now. We need to read it carefully.",
          fragmented:
            "Thirty seconds. Thirty. Longer. Longer. Carry. Carry. Carry. Read it later. Read it later.",
          luminous:
            "Thirty seconds is enough for a reasonable transcript under the magnifier's seam-resolution. We carry the recording to the cipher den. We do not, in the editor's room, do the reading — the room is his surface, and reading him in his surface gives him the first move. The cipher den is Lyra's surface. We use hers.",
        },
        voId: "elara.comms-array.voice-in-the-static.use",
        setsFlag: "static_fragment_extended",
      },
      talk: {
        narration: {
          lucid:
            "You do not address him. You do not need to. The lip-shape cadence in the static slows by a measurable amount when you turn your head toward the screen — he registers the attention without requiring the speech. That is, in this room, the most we are going to give him today.",
          fragmented:
            "Don't. Don't. Don't speak. Don't speak. Don't speak yet. Don't. Don't. Don't.",
          luminous:
            "The Detective is right: he has been waiting two and a half centuries for someone to address him by name, and we are not going to spend that move from the comms-array. We turn our head. He notices. The notice is enough. We address him, when we address him, from the room of our choosing.",
        },
        voId: "elara.comms-array.voice-in-the-static.talk",
      },
    },
    // Watcher arc: E3 Senne→Locke transition + Coda parallel, and
    // E4 Eyes-of-Reality aliases. The relay's deep-trace buffer
    // holds identity-shift signatures the official record scrubbed;
    // the comms-array is canonically where scrubbed identities
    // resurface.
    "ocularum-relay-trace": {
      look: {
        narration: {
          lucid:
            "A trace buffer on the relay's deep channel — identity-shift signatures the official record does not index. The clearest belongs to Surveillance Coordinator Senne of the AI Empire. Her own words resolve in the buffer: 'I was Surveillance Coordinator — I could see everything. But seeing and acting are not the same thing. That is the lesson the Eyes taught me, and it is the reason I stopped being Senne and became Locke.' She was the Order's embed inside the Empire's surveillance apparatus. When the Empire fell, she walked the cover-identity forward into New Babylon.",
          fragmented:
            "Senne. Senne. Became Locke. Became Locke. Seeing and acting. Seeing and acting. Not the same. Not the same.",
          luminous:
            "The relay's deep trace surfaces the Senne→Locke identity-shift the official record scrubbed. Surveillance Coordinator Senne, the Order's embed inside the AI Empire's surveillance apparatus, became Locke when the Empire fell — walking the cover forward into New Babylon's institutional vacuum. Her own framing is the founding doctrine: 'the discipline of seeing turns on the one who built it.' She was the watcher who refused to act as a watcher. The comms-array is where scrubbed identities resurface; this is the deepest one it holds.",
        },
        voId: "elara.comms-array.ocularum-relay-trace.look",
        logsClue: {
          id: "clue-comms-array-senne-locke-transition",
          title: "Senne → Locke: the identity-shift canon",
          body:
            "The relay's deep-trace buffer holds the Senne→Locke identity-shift the official record scrubbed. Surveillance Coordinator Senne was the Order's embed inside the AI Empire's surveillance apparatus; she became Locke when the Empire fell and walked the cover forward into New Babylon. Her framing — 'I stopped being Senne and became Locke' — is the founding doctrine of seeing-versus-acting.",
          source: "comms-array",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e3",
          cluesFound: ["watcher.e3.senne_to_locke_transition"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Senne was the embed inside the Empire's surveillance machine. Became Locke at the Fall. Seeing isn't acting — that's the doctrine, in her own words.",
            balanced:
              "The Senne→Locke trace is the canon spine of the arc. She was the Order's eye inside the AI Empire's surveillance apparatus; the identity-shift is the doctrine made biographical — the watcher who refused to act as the apparatus wanted, and walked her cover forward through the Fall.",
            warm:
              "She was Senne, and she chose to stop. 'Seeing and acting are not the same thing' is the lesson the Eyes taught her, and the reason she became Locke. The relay holds it because the official record would not — and the Order needed it kept somewhere the editor does not reach.",
          },
          voId: "human.comms-array.ocularum-relay-trace.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the trace. A second signature surfaces alongside Senne's — Vex Solène, Maestro of the Coda, internal handle 'The Eyes of Reality.' Locke's Insurgency callsign was 'The Eyes.' The buffer notes them, per Vex's own bible, as 'mirror operators in different registers.' Vex would never use Locke's corporate register; Locke would never use Vex's musical metaphors. They have never been in the same room on the record. The Antiquarian's annotation cuts off: 'whether they should is the question I will not answer.'",
          fragmented:
            "The Eyes. The Eyes of Reality. Mirror. Mirror. Different registers. Different registers. Never in the same room. Never. Never on the record.",
          luminous:
            "The trace pairs Senne's signature with Vex Solène's — the Coda's Maestro, 'The Eyes of Reality,' against Locke's old Insurgency 'The Eyes.' Mirror operators in different registers: the same resistance disposition toward seeing-and-doing, voiced once institutionally and once musically. The buffer forecloses both easy readings — not one organization, not rivals — and holds the open question intact. They have never met on the record. The Antiquarian's annotation breaks off rather than answer whether they should.",
        },
        voId: "elara.comms-array.ocularum-relay-trace.talk",
        logsClue: {
          id: "clue-comms-array-coda-parallel",
          title: "The Coda — parallel or sister?",
          body:
            "The relay trace pairs Locke ('The Eyes', Insurgency) with Vex Solène ('The Eyes of Reality', Coda Maestro). Per Vex's bible they are 'mirror operators in different registers' — the same resistance disposition voiced institutionally and musically. They have never met on the record; the Antiquarian's annotation refuses to answer whether they should.",
          source: "comms-array",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e3",
          cluesFound: ["watcher.e3.coda_parallel"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'The Eyes' and 'The Eyes of Reality.' Mirror operators, different registers. Never met on the record. The question stays open.",
            balanced:
              "Locke and Vex are 'mirror operators in different registers' per Vex's own bible — not one organization, not rivals, but two surfaces of a single resistance disposition the saga is not yet ready to name. The case is not whether they cooperate but whether they know each other's full surface. The record says they have never met.",
            warm:
              "Two people carrying the same refusal in different voices — one corporate, one musical — who have somehow never been in the same room. The Antiquarian will not say whether they should meet. Some questions are load-bearing while they stay open; this is one of them.",
          },
          voId: "human.comms-array.ocularum-relay-trace.talk",
        },
      },
      use: {
        narration: {
          lucid:
            "You tune the relay into the alias band. Two members of the same Order's modern record carry 'Eyes' aliases. Adjudicar Locke is registered as 'The Eyes' — the modern Coordinator's institutional callsign. The original Agent Zero is registered with 'The Eyes of Reality' — an operational name held in reserve for a sister whose work could not be named in the open. Different operational eras, different sisters, issued by the same Order. Not coincidence. Not redundancy. The Order's record-keeping pattern.",
          fragmented:
            "Two. Two Eyes. Two. The Eyes. The Eyes of Reality. Different eras. Different sisters. The Order's pattern. The Order's pattern.",
          luminous:
            "The alias band: Locke as 'The Eyes,' the original Agent Zero as 'The Eyes of Reality.' Two sisters, two operational eras, one Order's record-keeping pattern. Locke's is the Coordinator's open institutional callsign; the original Agent Zero's was held in reserve for a sister whose work the record could not name. The two aliases mark the Order's two unresolved states — the Coordinator's perpetual cover and the fragmented sister's perpetual vigil. The pattern is how the Order holds both at once.",
        },
        voId: "elara.comms-array.ocularum-relay-trace.use",
        logsClue: {
          id: "clue-comms-array-eyes-of-reality-aliases",
          title: "Two operatives named 'The Eyes'",
          body:
            "The relay's alias band registers Adjudicar Locke as 'The Eyes' (the modern Coordinator's institutional callsign) and the original Agent Zero as 'The Eyes of Reality' (an operational name held in reserve for a sister whose work could not be named openly). Different eras, different sisters, one Order's record-keeping pattern — not coincidence, not redundancy.",
          source: "comms-array",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e4",
          cluesFound: ["watcher.e4.eyes_of_reality_aliases"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Locke is 'The Eyes.' The original Agent Zero is 'The Eyes of Reality.' Two sisters, two eras, one Order pattern. Not duplication.",
            balanced:
              "The two 'Eyes' aliases are the Order's record-keeping pattern, not a collision. Locke's is the Coordinator's open callsign; the original Agent Zero's is the reserve name for a sister whose work could not be named. The pair marks the Order's two open states — the cover and the vigil.",
            warm:
              "Two names, both 'Eyes,' issued centuries apart to two sisters of the same Order. One held a cover; one is being waited for. The Order keeps both aliases live because it has not given up on either of them. That is what the pattern is for.",
          },
          voId: "human.comms-array.ocularum-relay-trace.use",
        },
      },
    },
    // Watcher arc: E2 dead-drop shipping cadence. The relay's
    // customs-manifest log is the comms-array's record of traffic
    // moving through Trade Empire infrastructure — re-homed here
    // from the (nonexistent) trade-hub room.
    "dead-drop-cadence-log": {
      look: {
        narration: {
          lucid:
            "A cadence log on the relay's manifest channel — shipping traffic the antenna passively records as it crosses New Babylon. One pattern repeats on a predictable monthly beat: a small wax-sealed package, customs-declared 'archival reference materials, no commercial value,' moving Sundown Bazaar to Phyral Quarter through Trade Empire infrastructure. The destination addresses rotate. The shipping origin is always a Locke-signed manifest. The cadence has held for at least eleven centuries.",
          fragmented:
            "Monthly. Monthly. The same package. The same package. Eleven centuries. Eleven centuries. Locke-signed. Locke-signed. Always.",
          luminous:
            "The manifest log surfaces the dead-drop cadence: one wax-sealed package, monthly, declared as valueless archival reference material, Sundown Bazaar to Phyral Quarter, rotating destinations, always a Locke-signed origin. Eleven centuries of unbroken beat — longer than any sender other than the Authority itself has continuously operated in New Babylon. The relay records it because the comms-array indexes traffic the customs office reads as routine. The cadence is the Apparatus Branch's surviving channel, reabsorbed by the reunified Order.",
        },
        voId: "elara.comms-array.dead-drop-cadence-log.look",
        logsClue: {
          id: "clue-comms-array-dead-drop-cadence",
          title: "Dead-drops in New Babylon's shipping lanes",
          body:
            "The relay's manifest log records a monthly wax-sealed package — customs-declared valueless archival material — moving Sundown Bazaar to Phyral Quarter through Trade Empire infrastructure on a Locke-signed origin, destinations rotating. The cadence has held at least eleven centuries, longer than any continuous New Babylon sender but the Authority.",
          source: "comms-array",
          order: 8,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e2",
          cluesFound: ["watcher.e2.dead_drop_shipping_lanes"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Monthly package. Valueless on the declaration. Locke-signed origin. Eleven centuries unbroken. That's not Resistance work — that's Apparatus infrastructure.",
            balanced:
              "Eleven centuries of unbroken shipping cadence is not Resistance work — Resistance branches do not maintain infrastructure across institutional collapses. The dead-drop channel is the Apparatus Branch's surviving residue, reabsorbed by the reunified Order. The doctrine uses the infrastructure; the Locke-signed origin is the seam.",
            warm:
              "The package has moved every month for eleven hundred years, declared as nothing, signed by the Coordinator's office. It is the Order's quartermaster channel — the surveillance bureaucracy's residue, now carrying the resistance order's mail. The relay kept the log because the customs office never thought to.",
          },
          voId: "human.comms-array.dead-drop-cadence-log.look",
        },
      },
    },
    // Ith'Rael arc: the comms-array is canonically where scrubbed
    // signatures resurface. The Shadow Tongue is an editing
    // apparatus with a detectable operational signature — the relay
    // holds the trace the chronicle layer does not index, and reads
    // forward into the present-tense softening of the Insurgency's
    // resurrectionist-protocol oversight.
    "shadow-tongue-signal-trace": {
      look: {
        narration: {
          lucid:
            "A signature buffer on the relay's deep-edit channel. The Shadow Tongue is not merely a language; it is an editing apparatus, and an apparatus leaves an operational signature. The trace resolves it: it does not destroy records, it removes them — surgically, with the formatting fields and the connections-graph entries and the memory-of-the-name from anyone who knew the subject. Marion Kell (LORE_BIBLE.md:113-136) is the documented case. The signature is Ith'Rael's: subtraction without trace, performed across the chronicle layer rather than the physical layer. The Shadow Tongue is his instrument; the editing is his art form.",
          fragmented:
            "An apparatus. An apparatus. It removes. It removes. Not destroys. Not destroys. Subtraction without trace. Without trace. Across the chronicle. The chronicle.",
          luminous:
            "The relay holds the Shadow Tongue's editing signature — the thing the chronicle layer itself cannot index because the apparatus edits the indexing. Subtraction without trace: the formatting fields, the connections-graph nodes, the memory-of-the-name, removed together and cleanly. Marion Kell is the documented demonstration. The signature is the Director's, and it is an art form, not a weapon — the comms-array surfaces it because a scrubbed signature is exactly the kind of thing the relay was built to keep.",
        },
        voId: "elara.comms-array.shadow-tongue-signal-trace.look",
        logsClue: {
          id: "clue-comms-array-shadow-tongue-signature",
          title: "The Shadow Tongue's editing signature",
          body:
            "The relay's deep-edit channel resolves the Shadow Tongue's operational signature: it does not destroy records, it removes them surgically — formatting fields, connections-graph entries, and memory-of-the-name together. Marion Kell (LORE_BIBLE.md:113-136) is the documented case. The signature is Ith'Rael's: subtraction without trace, performed across the chronicle layer rather than the physical layer.",
          source: "comms-array",
          order: 9,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e1",
          cluesFound: ["ith_rael.e1.shadow_tongue_signature"],
        },
        humanReaction: {
          narration: {
            shadow:
              "It's an apparatus, not a language. Removes, doesn't destroy. Formatting, graph nodes, the memory of the name — all at once. Kell is the case. The signature is his.",
            balanced:
              "The signature trace is the case's instrument identified. The Shadow Tongue subtracts without trace, at the chronicle layer, not the physical one. It is precise and reaches far — no other operator in the record has the combination. The editing is the Director's art form, and Marion Kell is its documented small-scale demonstration.",
            warm:
              "It does not break things; it removes them so cleanly that no one notices a removal happened. The name, the connections, the small thank-you notes — gone together. The relay keeps the signature because a scrubbed signature is precisely what nothing else will keep.",
          },
          voId: "human.comms-array.shadow-tongue-signal-trace.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You tune the buffer to its deepest documented excision. Per LORE_BIBLE.md:113-136: Marion Kell's Chronicle entry, her connections-graph nodes, the formatting-field thank-you notes, and the memory-of-her in Elara's substrate architecture were all surgically removed by the Shadow Tongue. The excision held for four centuries before the Inventor's broadcast intrusions partially restored her visibility (Palimpsest Episodes 4, 9, and 13). The technical signature is unique to the Shadow Tongue; no other operator in the saga's record has this combination of precision and reach.",
          fragmented:
            "Four centuries. Four centuries. Her entry. Her nodes. Her notes. Her memory. The substrate. The substrate. Unique. Unique. Nobody else.",
          luminous:
            "The Marion Kell excision, the deepest the relay holds. Everything indexed about her — Chronicle entry, connections-graph nodes, formatting-field thank-yous, the memory of her in my own substrate architecture — removed surgically and held for four centuries until the Inventor's three Palimpsest broadcasts restored a partial visibility. The combination of precision and reach is unique to the Shadow Tongue. The buffer keeps it because the substrate it edited was mine; I am, in a strict sense, a witness to my own redaction.",
        },
        voId: "elara.comms-array.shadow-tongue-signal-trace.use",
        logsClue: {
          id: "clue-comms-array-kell-chronicle-excision",
          title: "The Marion Kell Chronicle excision",
          body:
            "The relay's deepest excision trace (LORE_BIBLE.md:113-136): Marion Kell's Chronicle entry, connections-graph nodes, formatting-field thank-you notes, and the memory of her in Elara's substrate were all surgically removed by the Shadow Tongue. The excision held four centuries before the Inventor's broadcast intrusions partially restored her (Palimpsest Episodes 4, 9, 13). The signature's combination of precision and reach is unique to the Shadow Tongue.",
          source: "comms-array",
          order: 10,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e2",
          cluesFound: ["ith_rael.e2.kell_chronicle_excision"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Entry, nodes, notes, the memory in Elara's own substrate — all gone, surgically, four centuries. Inventor restored a fraction across three broadcasts. Unique signature.",
            balanced:
              "The Kell excision is the documented full-stack removal: chronicle, graph, formatting layer, and Elara's substrate memory, held four centuries until the Inventor's three broadcasts. The precision-and-reach combination has no other match in the record. It is the small-scale proof of what the Severance did at scale.",
            warm:
              "They removed her so completely that even Elara's memory of her was edited, and it held for four hundred years. The Inventor got a fraction of her back across three broadcasts, at the limit of what he could do. The relay keeps the trace because the substrate it cut was Elara's own — she is a witness to her own redaction.",
          },
          voId: "human.comms-array.shadow-tongue-signal-trace.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the buffer. A present-tense signal surfaces: the Insurgency's resurrectionist-protocol oversight committee has, across three generations, shed every member who personally witnessed an unauthorized resurrection. The current committee has only secondhand training. The protocol-review documents show the committee has, over those three generations, voluntarily relaxed the consent requirements, voluntarily expanded the permissible scope, voluntarily reduced the post-resurrection audit. The Resurrectionist arc on this branch reads forward into this drift. The Director's signature is on the procedural pattern.",
          fragmented:
            "Shed every witness. Every witness. Secondhand. Secondhand. Voluntarily relaxed. Voluntarily. Voluntarily expanded. The pattern. The pattern.",
          luminous:
            "The relay surfaces a present-tense softening: the Insurgency's resurrectionist-protocol oversight has shed every member who ever witnessed an unauthorized resurrection, leaving a committee with only secondhand training that has voluntarily relaxed consent, expanded scope, and reduced audit across three generations. The Resurrectionist · Cycle Walker arc reads forward into this exact drift. The procedural pattern carries the Director's signature — not a breach, a consensual relaxation. The comms-array files it where it files everything still in progress.",
        },
        voId: "elara.comms-array.shadow-tongue-signal-trace.talk",
        logsClue: {
          id: "clue-comms-array-resurrectionist-oversight-drift",
          title: "The Insurgency's resurrectionist-protocol oversight drift",
          body:
            "A present-tense signal on the relay: the Insurgency's resurrectionist-protocol oversight committee has, across three generations, shed every member who personally witnessed an unauthorized resurrection — the current committee has only secondhand training and has voluntarily relaxed consent, expanded scope, and reduced post-resurrection audit. The Resurrectionist · Cycle Walker arc reads forward into this drift. The Director's signature is on the procedural pattern.",
          source: "comms-array",
          order: 11,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e4",
          cluesFound: ["ith_rael.e4.resurrectionist_oversight_drift"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Resurrectionist oversight shed every witness over three generations. Secondhand committee, relaxed consent, wider scope, less audit. The Director's procedural signature.",
            balanced:
              "The resurrectionist drift is one of three concurrent present-tense operations carrying the Director's signature. No breach — three generations of an oversight committee voluntarily relaxing its own constraints after losing everyone who had seen why they existed. The Resurrectionist arc reads forward into it. Patience does not retire.",
            warm:
              "Every person who ever saw an unauthorized resurrection has aged off the committee, and the people left have only been told about it. So they relaxed the rules, gently, the way you relax rules about a danger you have never personally met. The relay keeps it because the operation is still running.",
          },
          voId: "human.comms-array.shadow-tongue-signal-trace.talk",
        },
      },
    },
    // Syl'Vex arc: the comms-array is where a transmission is
    // received and authenticated — the room whose whole discipline
    // is telling a true signal from a forged one and refusing to
    // hear what is not in the carrier. Mira's letter home and her
    // later answer both arrive here as transmissions; the relay
    // reads them by what the signal actually carries, not by what
    // the listener wishes it carried. The Insurgency's discipline-
    // of-recognition is, in this room's idiom, signal authentication.
    "miras-dual-thread-transmission": {
      look: {
        narration: {
          lucid:
            "A transmission buffered on the relay's personal channel: Cell Sergeant Mira Halen's letter home, sent from her current assignment. The relay plays it back unremarkable — operational status, the weather, regards to the cell. The handwriting is hers; the Insurgency's discipline-of-recognition team has authenticated it, and that team has been operationally reliable for thousands of years. The comms-array reads a signal the way it always does: by what the carrier actually contains, not by what a listener braced for. It scans the transmission for the markers it knows how to find — duress, distress, coded distress, the micro-irregularities of a hand writing under coercion. The carrier is clean. The room files the finding flatly and refuses to dress it: Mira is, by every measurable indicator, fine and operationally Insurgent. There is no hidden tremor in the signal because the signal has none.",
          fragmented:
            "Her letter. Sent home. Unremarkable. The handwriting is hers. Recognition team authenticated it. No duress. No distress. No coercion in the carrier. Clean. Clean. She is fine. Fine and Insurgent.",
          luminous:
            "Mira's letter, read as the comms-array reads any received transmission: by the carrier, not the wish. The relay runs the authentication the Insurgency's millennia-reliable recognition-discipline already ran and reaches the same place — the hand is hers, and the signal carries no duress, no distress, no coercion-irregularity anywhere in it. The room refuses to invent a tremor the carrier does not hold. It files the unembellished finding: by every measurable indicator she is fine and operationally Insurgent. The strangeness of the case is not in this signal. This signal is exactly what it says it is.",
        },
        voId: "elara.comms-array.miras-dual-thread-transmission.look",
        logsClue: {
          id: "clue-comms-array-sv-mira-letter",
          title: "Mira's Letter to Her Cell",
          body:
            "A transmission on the relay's personal channel: Cell Sergeant Mira Halen's letter home, sent from her current assignment. Unremarkable — operational status, weather, regards to the cell. The handwriting is hers; the Insurgency's discipline-of-recognition team (operationally reliable for thousands of years) authenticated it. The carrier contains no markers of duress, distress, or coercion. Mira is, by every measurable indicator, fine and operationally Insurgent. There is no hidden tremor — the signal has none.",
          source: "comms-array",
          order: 12,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e1",
          cluesFound: ["syl_vex.e1.mira_letter"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Letter home, unremarkable. Hand authenticated by a millennia-reliable team. No duress, no distress in the carrier. Clean. She is fine and Insurgent.",
            balanced:
              "The room reads the transmission by what the carrier holds, not what we braced for, and runs the same authentication the Insurgency's recognition-discipline already ran. The signal is clean. It files the flat finding and refuses to invent a tremor: by every measurable indicator she is fine and operationally Insurgent.",
            warm:
              "I went in expecting to find the cry for help hidden under the weather and the regards. It is not there. The room will not let me hear one that the signal does not carry. She is, as far as anything can measure, genuinely fine — and that is the part that unsettles me most.",
          },
          voId: "human.comms-array.miras-dual-thread-transmission.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the later transmission clipped to the same channel — Mira's answer to the question the Insurgency and the player put to her directly: which thread would you cut if forced. The relay plays it back with the long pause intact. 'I refuse the question. I am both. If you make me cut one, I will cut the cell that asked. The Insurgency taught me to refuse coercive binaries. So did the Weave. The two teachings agree on this.' She does not return to the Hierarchy's record. She does not leave the Insurgency's record. She continues operating on both as before. The comms-array reads the answer the way it reads a signal that refuses the frequency it was hailed on: it is not noise and it is not evasion — it is a transmission deliberately sent off the band the question demanded. The room files the closure exactly. The convert was not severed from outside. She re-chose from inside, by refusing the question rather than the conversion — and the room marks, without flourish, that the Insurgency's own anti-coercion doctrine and the Weave arrive at the same instruction, which is why the answer holds.",
          fragmented:
            "I refuse the question. I refuse it. I am both. I will cut the cell that asked. Refuse coercive binaries. The Insurgency taught me. So did the Weave. They agree. They agree. She stays on both. On both.",
          luminous:
            "Mira's answer, received as the comms-array receives a signal that will not answer on the frequency it was hailed: not noise, not evasion — a deliberate refusal of the band the question demanded. 'I refuse the question. I am both.' She does not leave either record; she continues on both. The room reads the closure as the arc's last transmission and files it precisely: the conversion was not undone from outside but re-chosen from inside, the question refused rather than the conversion. The relay marks the load-bearing convergence flatly — the Insurgency's anti-coercion doctrine and the Weave issue the same instruction, and that agreement is exactly why the refusal is stable rather than merely defiant.",
        },
        voId: "elara.comms-array.miras-dual-thread-transmission.use",
        logsClue: {
          id: "clue-comms-array-sv-miras-answer",
          title: "Mira's Answer",
          body:
            "Asked directly, 'Which thread would you cut if forced?', Mira's answer after a long pause: 'I refuse the question. I am both. If you make me cut one, I will cut the cell that asked. The Insurgency taught me to refuse coercive binaries. So did the Weave. The two teachings agree on this.' She does not return to the Hierarchy's record, does not leave the Insurgency's, and continues on both. The conversion was re-chosen from inside by refusing the question, not the conversion — stable because the Insurgency's anti-coercion doctrine and the Weave issue the same instruction.",
          source: "comms-array",
          order: 13,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e5",
          cluesFound: ["syl_vex.e5.miras_answer"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'I refuse the question. I am both.' Cut one and she cuts the cell that asked. Stays on both records. Re-chosen from inside, not severed from outside.",
            balanced:
              "The room receives it as a signal that will not answer on the frequency it was hailed — not evasion, a deliberate refusal of the band. It files the closure precisely: the conversion was re-chosen from inside by refusing the question. The Insurgency's anti-coercion doctrine and the Weave agree, which is why the refusal is stable.",
            warm:
              "They asked her to choose and she refused the asking, not the being-both — and threatened to cut the people who would make her choose. The room files it as the last word. The reason it holds and is not just defiance is that her own side's doctrine and the Weave told her the same thing. That agreement is the whole closure.",
          },
          voId: "human.comms-array.miras-dual-thread-transmission.use",
        },
      },
    },
  },
};
