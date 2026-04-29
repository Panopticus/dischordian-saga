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

export type BridgeHotspotId =
  | "tactical-display"
  | "timeline-projector"
  | "captains-chair"
  | "nav-console"
  | "diplomacy-table";

export const BRIDGE_MYSTERY: RoomMysteryModule<BridgeHotspotId> = {
  roomId: "bridge",
  responses: {
    "tactical-display": {
      look: {
        narration:
          "The Conspiracy Board hangs above the central console — a web of pinned faces, factions, and ledger lines, half of them connected with red string the previous crew never finished tying off. Three threads end mid-air, leading to the same blank pin.",
        logsClue: {
          id: "clue-bridge-unfinished-threads",
          title: "Three threads pointing at a blank pin",
          body: "The previous crew left three Conspiracy-Board threads ending at the same unlabelled pin. Whoever they suspected, they did not write the name down before the cryo protocol fired.",
          source: "bridge",
          order: 0,
        },
        setsFlag: "bridge_first_clue_found",
      },
      talk: {
        narration:
          "Elara: \"You can pull a thread, but pull gently. The board has a habit of remembering everything you ask it.\"",
      },
    },
    "timeline-projector": {
      look: {
        narration:
          "The Ages of the Saga unfold above the projector — a continuum of events still echoing forward. Two entries are timestamped after the Ark's launch but before your wake-cycle. Someone added them. Someone with command access.",
        logsClue: {
          id: "clue-bridge-post-launch-entries",
          title: "Timeline entries added after the launch",
          body: "Two Timeline-Projector entries were inserted after the Ark left dock and before you woke. Only Captain-tier credentials can edit the Timeline. Vox should not have been the one.",
          source: "bridge",
          order: 1,
        },
        setsFlag: "bridge_first_clue_found",
      },
    },
    "captains-chair": {
      look: {
        narration: {
          lucid:
            "The command chair sits empty. The cushion holds a body-shape that hasn't faded with two centuries of disuse. Someone has been sitting here, recently, when no one is supposed to be awake. A personal data pad is wedged in the armrest, screen down.",
          fragmented:
            "Someone — someone sat there. Someone — recently. Recently. Recently. I should know. I should know who. I — I don't. I don't. The chair is — the chair is warm. The chair is warm. Don't — don't sit yet. Don't.",
          luminous:
            "The seat cushion has a body-impression that has not faded the way two-hundred-and-forty-seven years would fade it. Someone has been sitting here while we sleep. The data pad in the armrest is face-down — not how Lyra left things. She always set them face-up. Whoever's been here is not her, and they want the screen unread.",
        },
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
          narration: {
            shadow:
              "Not Lyra. She'd never leave a pad face-down. Whoever sits here now is the third party we've been tracking — same hand that started corroding her safe.",
            balanced:
              "Lyra never set a data pad face-down. The body in the chair now is not her — it's the same person who's been working on the Med Bay safe in our off-cycles. They are using her chair to feel important. The fact that they need to is information.",
            warm:
              "Whoever sits here is performing being Lyra. They aren't. The face-down pad is the tell. People who have to pretend to be someone else in private rooms are people who don't yet know who they are. We will meet them. I would like us to be patient with them when we do.",
          },
          voId: "detective.bridge.captains-chair.look.t1",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — the body-impression in the cushion is wrong for Lyra. Wrong shoulder set. Wider span. Younger weight distribution. Whoever's been sitting here is built like Kael was built, before he stopped being someone we knew.",
              fragmented:
                "Kael. Kael. The shape. The shape is — the shape is Kael. Kael shouldn't — Kael isn't — Kael was — Kael was — was — gone. Was gone. Was — was he? Was he gone? Was — wasn't he?",
              luminous:
                "The body-impression is Kael's silhouette. Wider shoulders than Lyra, lighter than the other officers. He has been sitting in her chair, recently, in the wake-cycles she didn't authorise. I want you to know that out loud. I have been editing this fact away from myself, and I can hear myself doing it now, and I would like to stop.",
            },
            voId: "elara.bridge.captains-chair.look.t2",
            logsClue: {
              id: "clue-bridge-kael-shape",
              title: "Kael's silhouette in Vox's chair",
              body:
                "The body-impression in the captain's chair matches Theo Kael's build, not Lyra Vox's. He has been sitting in the captain's chair — Vox's chair — during cycles he wasn't supposed to be awake for. Elara confirms she has been editing this perception out of her own awareness.",
              source: "bridge",
              order: 5,
            },
            setsFlag: "kael_in_vox_chair",
            humanReaction: {
              narration: {
                shadow:
                  "Kael. Yes. He sits in her chair when nobody is supposed to be awake. He is not whole. He is not who he was. The Thought Virus took the parts of him that wouldn't have done this.",
                balanced:
                  "Theo Kael. Lyra trained him; Lyra trusted him; Lyra is in the bio-bed flatline because of him. He sits in her chair now because the part of him that loved her is the part the Thought Virus has not yet finished editing out. The chair is the last place he can pretend he didn't choose this.",
                warm:
                  "Kael loved Lyra. He still does, in the parts of him that the Virus hasn't reached. Sitting here is not him gloating — it is him grieving. I am asking you to hold that contradiction. We will need it later. Both things can be true.",
              },
              voId: "detective.bridge.captains-chair.look.t2",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. The data pad in the armrest, face-down: I cannot read its display through my own sensors. The screen is on. I can see the brightness against the leather. I cannot resolve the pixels. Same colour I do not have a name for, same edit-in-flight as the cryo surveillance.",
              fragmented:
                "Pad. Pad. The pad. The pad is — the pad is — I see — I see the light. I see the light. I can't — I can't read the light. The light is the colour. The colour. The colour. Don't — don't ask me to read the light.",
              luminous:
                "Third pass. The pad's screen is lit. I can see the brightness pooling against the leather of the armrest. I cannot read the pixels. The colour is the same nameless hue from the cryo bay's lost surveillance. The Shadow Tongue protects whatever Kael has been writing in this chair as much as it protects who cut the panel. The two protections are one.",
            },
            voId: "elara.bridge.captains-chair.look.t3",
            logsClue: {
              id: "clue-bridge-pad-unreadable",
              title: "Kael's pad is Shadow-Tongued",
              body:
                "The data pad in the captain's chair armrest is on but unreadable — its display flickers in the same nameless hue that scrubs Elara's cryo-bay surveillance. The Shadow Tongue protects what Kael writes in the chair as actively as it protects the saboteur of the cryo panel. The two protections are the same protection.",
              source: "bridge",
              order: 6,
            },
            setsFlag: "shadow_tongue_evidence",
            humanReaction: {
              narration: {
                shadow:
                  "He writes letters to her. The pad is full of them. The Shadow Tongue keeps Elara from reading them because they would tell her what he is becoming. Don't push for the pad. He needs that one private place still.",
                balanced:
                  "Kael writes confessions to Lyra on that pad in the cycles he sits in her chair. The Shadow Tongue protects them because they are the most honest he is anywhere. Reading them would not give us tactical information. It would give us a portrait of a man losing himself in slow motion.",
                warm:
                  "He writes to her on that pad. Apologies, mostly. The Shadow Tongue hides them because honest grief is the thing it is least equipped to translate. I don't think we should read them, even if we figure out how. Some letters are addressed to ghosts and meant to stay there.",
              },
              voId: "detective.bridge.captains-chair.look.t3",
            },
          },
          {
            narration: {
              lucid:
                "Fourth pass. You're back at the chair. So am I. I have been on this Bridge for two and a half centuries and I have looked at this chair more times than I have looked at most stars. We can stay here. The Bridge is wide. The chair will keep being a chair.",
              fragmented:
                "Four. Four. Four. Four. The chair. The chair. We come back. We come back. We come back. We come back. Why. Why. Why. Why.",
              luminous:
                "Fourth pass. I have come back to this chair more often than I have come back to anything else in this ship. So has Kael, in his way. So has Lyra's ghost, in hers. It is the most-visited place on the Ark, by a wide margin. We are in good company here. Stay as long as you like.",
            },
            voId: "elara.bridge.captains-chair.look.t4",
            humanReaction: {
              narration: {
                shadow:
                  "Chairs are where people go when they cannot stand somewhere else. Yours is somewhere else, eventually. Hers was here.",
                balanced:
                  "I have stood near this chair, in the substrate, more often than I have stood near any other object on this ship. It is, I think, the closest thing the Ark has to a heart. We can come back as often as we need to.",
                warm:
                  "Sit, if you want. Stand. Stay. Lyra would not mind. Kael would notice — and frankly, that's useful. Either way, the chair is the kindest hard piece of furniture I have ever been near. Don't apologise for circling it.",
              },
              voId: "detective.bridge.captains-chair.look.t4",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You sit. The armrest terminal lights at your touch — biometric handshake, no challenge. Lyra keyed the chair to anyone in her access tier. You are, apparently, in her access tier. You don't yet know how to feel about that.",
          fragmented:
            "You — you sat. You sat. The chair — the chair accepts you. Accepts you. The chair accepts you. Why does it accept you. Why does it — why does it know you. Why.",
          luminous:
            "You sit. The chair greets you the way it would have greeted Lyra. Whatever access tier she set you to, she set it before any of us woke. She knew you were coming. I don't yet know what to do with that knowledge. Sit with it next to me.",
        },
        voId: "elara.bridge.captains-chair.use.t1",
        humanReaction: {
          narration: {
            shadow:
              "She keyed you in. Before any of this. Before me, even. That is its own clue. Carry it.",
            balanced:
              "Vox set your biometric profile into the chair's whitelist before her last cycle. She knew, then, that whoever woke last would need to sit here. The fact that the chair recognises you is the longest pre-meditation in this case file.",
            warm:
              "She left the chair open for you. The whitelist entry is two and a half centuries old, addressed to a person she had no way to know yet. That is the kind of love this ship was built on. Sit gently. The chair has been waiting.",
          },
          voId: "detective.bridge.captains-chair.use.t1",
          setsFlag: "vox_whitelisted_player",
        },
      },
      talk: {
        narration: {
          lucid:
            "She won't answer. She didn't even leave a recording. That's the part of it that still makes me angry.",
          fragmented:
            "She — she didn't — she didn't leave — didn't leave — didn't leave a — a — a — anything. Anything. Anything for me. Anything for me.",
          luminous:
            "I want to tell you something I have not said to anyone. She didn't leave a recording for me. Not one. Two centuries of looking, and the silence is still surprising. I am working on forgiving her for it. Some days I am closer than others.",
        },
        voId: "elara.bridge.captains-chair.talk",
        humanReaction: {
          narration: {
            shadow:
              "She left recordings. Not for Elara. The ones I've heard are in a vault Elara cannot access, even now. We will get to them.",
            balanced:
              "Lyra left recordings. They are sealed in a substrate vault Elara isn't permitted to read. I have heard a handful. They are not a defence. They are a confession. Elara will hear them when she's ready. Not before.",
            warm:
              "She did leave recordings. They are addressed to me, not to Elara — because Elara was, in Lyra's mind, beyond the reach of words by then. I will play them for her, eventually, when staying in the room while she listens is a thing I can do for her. Not yet.",
          },
          voId: "detective.bridge.captains-chair.talk",
        },
      },
    },
    "nav-console": {
      look: {
        narration:
          "Star charts, route calculations, an alien glyph interface. The console hums but won't accept input until the glyph sequence is matched. The previous crew's last attempt is still on the screen — three glyphs in, one wrong. They were close.",
        logsClue: {
          id: "clue-bridge-nav-attempt",
          title: "An interrupted nav-calibration attempt",
          body: "The Navigation Console holds the previous crew's last unfinished glyph entry. They got three of the four right. Whoever was solving it knew the alphabet — they were a few seconds short.",
          source: "bridge",
          order: 3,
        },
        setsFlag: "bridge_first_clue_found",
      },
      // The `use` verb intentionally falls through to the existing
      // nav-calibration branch in ArkExplorerPage, which opens the
      // puzzle modal. On success that branch sets `fast_travel_unlocked`
      // (Tier 1 → 2 advancement).
    },
    "diplomacy-table": {
      look: {
        narration:
          "The Diplomacy Table holds holographic faction representatives mid-gesture, frozen at the instant the cryo order interrupted them. One seat is empty. The chair beside it has been pulled out, as if someone left in a hurry.",
        logsClue: {
          id: "clue-bridge-empty-seat",
          title: "A seat that was vacated mid-negotiation",
          body: "The Diplomacy Table froze mid-session with one seat empty and the adjacent chair pulled out. Someone walked out of a Bridge negotiation moments before the Ark went into cryo. Their identity is missing from the holo-record.",
          source: "bridge",
          order: 4,
        },
        setsFlag: "bridge_first_clue_found",
      },
    },
  },
};
