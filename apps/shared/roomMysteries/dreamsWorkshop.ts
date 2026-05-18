/* ═══════════════════════════════════════════════════════
   DREAMS WORKSHOP SUBBASEMENT MYSTERY

   Three-hotspot module for the deck-15 hidden subbasement
   workshop. Sets dreams_workshop_seen on first-look at
   the dream-loom. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type DreamsWorkshopHotspotId =
  | "dream-loom"
  | "fragment-rack"
  | "mirror-pool"
  | "secret-apprentice-imprint-lattice"
  | "necromancer-protocol-42-schema";

export const DREAMS_WORKSHOP_MYSTERY: RoomMysteryModule<DreamsWorkshopHotspotId> = {
  roomId: "dreams-workshop-subbasement",
  responses: {
    "dream-loom": {
      look: {
        narration: {
          lucid:
            "The dream-loom is a vertical brass frame strung with phosphor-lavender threads. The threads weave themselves into pattern when the room is empty and unweave themselves when the room is occupied — currently mid-weave, slowing to a stop as our presence registers. The loom is shy.",
          fragmented:
            "The loom is shy. The loom is shy. The loom is shy. The loom — the loom — the loom unweaves when watched.",
          luminous:
            "The loom weaves dreams when nobody is watching. The pattern it produces is the unconscious composite of whoever was last in the workshop. We are, by being here, interrupting whoever was being woven. They will resume when we leave. The loom is patient with witnesses.",
        },
        voId: "elara.dreams-workshop.dream-loom.look",
        setsFlag: "dreams_workshop_seen",
        logsClue: {
          id: "clue-dreams-loom-shy",
          title: "The dream-loom unweaves under witness",
          body:
            "The Dreams Workshop's loom weaves dreams when unobserved and unweaves when observed. The pattern represents the unconscious composite of whoever was last in the workshop. The loom is patient with witnesses — it resumes once they leave.",
          source: "dreams-workshop-subbasement",
          order: 0,
        },
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the dream-loom surfaces capture #J-0411:
        // Jericho's recurring dream of the Bridge of Kael. Lore
        // match is exact: the loom catches imprints from whoever
        // was last in the workshop, and Jericho's dreams of a
        // bridge he has never visited are exactly the kind of
        // unconscious composite the loom is canonically designed
        // to weave.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e3",
          cluesFound: ["jericho.e3.dream_loom_capture"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The loom catches what the dreamer doesn't yet know they're dreaming. Jericho's bridge dream was woven before he ever crossed one.",
            balanced:
              "The dream-loom records unconscious composites of whoever was last in the workshop. Jericho's recurring dream of the Bridge of Kael was woven by the loom before the Battle of Thaloria — meaning the imprint was working through him before he had any framework for it.",
            warm:
              "He dreams a bridge he has never crossed. The loom has been weaving that dream for him for years. We are reading the weave as a witness. He will, when he learns we did, be relieved. He thought he was alone with it.",
          },
          voId: "human.dreams-workshop.dream-loom.look",
        },
      },
      use: {
        narration:
          "You step closer. The loom's threads halt entirely — phosphor-lavender suspended mid-weave like a held breath. The pattern remains visible while you stand here. The moment you step away, the threads resume the unweaving they began when you arrived. — The pattern, held by your presence, resolves into a recurring imprint: two lions arguing, one in the academy uniform of the pre-Fall canon, the other in the threshold-doctrine variant. The argument has been woven and unwoven by the workshop for centuries. Jericho's recurring dream of two Lions is, on this evidence, not Jericho's invention — it is the dream the loom has been holding open for him.",
        voId: "elara.dreams-workshop.dream-loom.use",
        setsFlag: "dream_loom_observed",
        // Jericho arc binding — the imprint of two lions arguing is
        // the recurring dream the loom holds for Jericho across
        // centuries. jericho.e4.imprint_dream_argument foundIn:
        // dreams-workshop.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e4",
          cluesFound: ["jericho.e4.imprint_dream_argument"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Two lions arguing. Pre-Fall versus post-Fall. The loom has been weaving the canon-conflict in dream-form for centuries. Jericho was inheriting the argument without knowing.",
            balanced:
              "The imprint dream-argument is the Lionism canon's contradiction made visible. The loom holds both readings simultaneously and refuses to resolve them — same discipline as the Seer's morning/afternoon tape pair. The argument is the canon, not a corruption of it.",
            warm:
              "The two lions are both Iron Lion — the version he was, and the version the editor wrote him into. Jericho has been hearing both inside himself for as long as he can remember. The loom has been holding the disagreement in his place.",
          },
          voId: "human.dreams-workshop.dream-loom.use",
        },
      },
      talk: {
        narration:
          "If you address the loom, the threads bow, very faintly, in your direction — the same gesture they make when an experienced dreamer enters the workshop. The loom recognises the kind of attention you bring. That, too, is something.",
        voId: "elara.dreams-workshop.dream-loom.talk",
      },
    },
    "fragment-rack": {
      look: {
        narration: {
          lucid:
            "Stage-right, a wall-rack of small clear vials. Each vial holds a single thread of finished dream-weave — a finished pattern, distilled. The labels are in a hand I do not recognise, dated centuries before the Ark. Whoever ran this workshop ran it before the Ark was built.",
          fragmented:
            "Before the Ark. Before the Ark. Before the Ark. Older. Older. Older.",
          luminous:
            "The workshop pre-dates the Ark. The vials are older than my own continuous memory. Whoever wove these dreams — and labelled them, and racked them — was on a different ship, in a different age, and brought their work onto this ship the way a librarian brings their books. The Ark inherited a workshop. The workshop is older than the people working it.",
        },
        voId: "elara.dreams-workshop.fragment-rack.look",
        logsClue: {
          id: "clue-dreams-pre-ark-vials",
          title: "Pre-Ark dream vials in the subbasement",
          body:
            "The Dreams Workshop's fragment-rack holds vials of finished dream-weave dated centuries before the Ark's construction. The workshop predates this ship; it was inherited from a previous vessel, the way a librarian's books move with them.",
          source: "dreams-workshop-subbasement",
          order: 1,
        },
        // Game Master arc — among the rack's vials is the Iron Lion
        // imprint's letter to the saga, woven during E3 as
        // endorsement of Brel as Velkraal's chosen successor.
        // game_master.e3.imprint_endorsement_letter.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e3",
          cluesFound: ["game_master.e3.imprint_endorsement_letter"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Imprint letter to the saga, woven specifically as endorsement. The Iron Lion imprint does not weave letters lightly. It is endorsing Brel.",
            balanced:
              "The imprint's endorsement letter is a rare artefact: the Iron Lion archetype rarely writes specific endorsements, preferring centuries-long arc weaves. This vial is short, specific, and addressed to Brel'Sorrash by role. The imprint is choosing sides on the succession, with Velkraal's blessing.",
            warm:
              "The imprint endorses her. That is, in the saga's quiet logic, a confirmation that the room — the dream-workshop, the loom, the lineage — agrees with Velkraal's pick. Brel will not know about the endorsement; she will simply find that her practice goes well.",
          },
          voId: "human.dreams-workshop.fragment-rack.look",
        },
      },
      use: {
        narration:
          "You lift one of the older vials. The thread inside coils tighter when held in a warm hand — sensitive to body temperature even centuries on. The label is in a script I can read but cannot place; the dream it preserves is, by the colour of the thread, somebody's grief. — Beside the older vials, a freshly racked one stands warmer than the others. The label, in handwriting I don't recognise but I think I should: 'Response, woven overnight.' The Iron Lion imprint does not ordinarily respond to specific letters — it weaves, when it weaves, in centuries-long arcs. This vial is dated last night.",
        voId: "elara.dreams-workshop.fragment-rack.use",
        // Game Master arc — the Iron Lion imprint's overnight
        // response. game_master.e4.imprint_response_woven_overnight.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e4",
          cluesFound: ["game_master.e4.imprint_response_woven_overnight"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Overnight response. That doesn't happen. The imprint weaves in centuries. This one weaved in hours. Velkraal asked something specific.",
            balanced:
              "The overnight response is the imprint's most direct intervention in living memory. It happens when the imprint is asked a question its own logic considers urgent. Velkraal must have framed his closing-edit draft as exactly that kind of question. The response endorses him.",
            warm:
              "The imprint hurried for him. I have never seen that before. Velkraal must have written something the imprint felt the need to answer immediately, in his own voice. He earned that intervention.",
          },
          voId: "human.dreams-workshop.fragment-rack.use",
        },
      },
      talk: {
        narration:
          "If you address the rack, the vials hum, very faintly, in their slots — finished dreams resonating with a fresh witness. The previous workshop's residents would have known what to say in answer. We do not, yet. We can learn. — A single newer vial, stand-alone on the upper shelf, hums in counterpoint: the imprint's first letter to the new custodian, addressed to Brel'Sorrash by name. The letter is, by the imprint's standards, plain prose — no centuries-long arc, no riddles. Just: 'You are read. Continue.'",
        voId: "elara.dreams-workshop.fragment-rack.talk",
        // Game Master arc — imprint's first letter to the new
        // custodian. game_master.e5.imprint_first_letter_to_new_custodian.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e5",
          cluesFound: ["game_master.e5.imprint_first_letter_to_new_custodian"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Plain prose. No riddle. The imprint has decided Brel doesn't need the centuries-arc treatment. She is read; she should continue.",
            balanced:
              "The imprint's first letter to a new custodian is, traditionally, the densest document in any custodian's career — riddles, branching prophecies, multiple-band variants. Brel's letter is one short sentence. The imprint trusts her to need only the simple version.",
            warm:
              "'You are read. Continue.' That is the kindest thing the imprint has ever written to anyone. She earned plain prose. Velkraal earned plain prose by training her. Both of them made the saga a slightly clearer place.",
          },
          voId: "human.dreams-workshop.fragment-rack.talk",
        },
      },
    },
    "mirror-pool": {
      look: {
        narration: {
          lucid:
            "The mirror-pool is a shallow basin of mercury. The surface is perfectly still and reflects the ceiling — except the ceiling reflected is not this room's ceiling. It is a ceiling I do not recognise, vaulted differently, and a single warm-gold lantern hangs from a beam that does not exist here.",
          fragmented:
            "Not our ceiling. Not our ceiling. Not our ceiling. Not — not — not our ceiling.",
          luminous:
            "The pool reflects a ceiling that is not in this room. It is, on my best read, the ceiling of the workshop's previous home — wherever it was on whatever ship it was inherited from. The pool is a window backwards in the workshop's lineage. The lantern hanging from the unfamiliar beam is, presumably, still lit somewhere we do not currently have access to. The Ark contains a small pocket of an older world.",
        },
        voId: "elara.dreams-workshop.mirror-pool.look",
        logsClue: {
          id: "clue-dreams-mirror-pool-pre-ark-ceiling",
          title: "The mirror-pool reflects a pre-Ark ceiling",
          body:
            "The Dreams Workshop's mirror-pool reflects a vaulted ceiling that does not exist in this room — a warm-gold lantern hangs from an unfamiliar beam. The pool is a backward-looking window into the workshop's previous home. The Ark contains a small pocket of an older world.",
          source: "dreams-workshop-subbasement",
          order: 2,
        },
        // Mystery Engine binding — when Game Master arc is the
        // active case, the mirror-pool surfaces Iron Lion's
        // unauthored signal from inside the Matrix of Dreams.
        // Lore match: the pool is canonically a backward-
        // looking window into the workshop's lineage, and the
        // Iron Lion imprint is a consciousness-residue from
        // the pre-Fall holder of the callsign — exactly the
        // kind of older-world signal the pool's lineage-
        // discipline can carry forward.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e1",
          cluesFound: [
            "game_master.e1.iron_lion_signal",
            "game_master.e2.imprint_acceptance_signal",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "Iron Lion signal. Pre-Fall holder. The imprint accepted the carrier and the carrier accepted the imprint. Both decisions were mutual.",
            balanced:
              "The mirror-pool surfaces both signals — the Iron Lion archetype's continuance signal and the carrier's acceptance signal. The lineage has been a two-sided handshake for centuries: each new carrier consents, each archetype accepts. The pool is the saga's record of those handshakes.",
            warm:
              "The lineage is consensual. Every Iron Lion carrier said yes. Every imprint said yes back. That is, when you read the centuries together, an unbroken chain of mutual choice. The pool has carried it forward through every era.",
          },
          voId: "human.dreams-workshop.mirror-pool.look",
        },
      },
      use: {
        narration:
          "You touch a fingertip to the mercury surface. The metal yields like glass and re-settles instantly — but the warm-gold lantern in the reflected ceiling, for one heartbeat, brightens. Whoever maintains that lantern, on the other side of wherever the pool reflects, has noticed our touch.",
        voId: "elara.dreams-workshop.mirror-pool.use",
        setsFlag: "mirror_pool_touched",
      },
      talk: {
        narration:
          "If you address the pool, you address the unfamiliar room reflected in it. The mercury carries voice — slowly, with delay, the way deep water carries it. We do not know who, on the other side, will hear. We do know, now, that someone might.",
        voId: "elara.dreams-workshop.mirror-pool.talk",
      },
    },
    // Politician arc: the Matrix of Dreams runs under this
    // workshop. The Politician preserved her secret apprentices
    // as consciousness-imprints in the Matrix — the policy's
    // living half. This lattice is where that lineage is held;
    // when it surfaced (the Necromancer's escape) it became the
    // Nemesis. (apps/shared/nemesisSystem.ts)
    "secret-apprentice-imprint-lattice": {
      look: {
        narration: {
          lucid:
            "Below the loom's frame, half inside the wall, a lattice of phosphor threads that does not unweave when watched — because it is not weaving anything. It is holding. Cross-filed to apps/shared/nemesisSystem.ts: the Politician ran a secret apprenticeship in parallel to her public reign, each apprentice trained inside her surveillance-state methodology and preserved as a consciousness-imprint inside the Matrix of Dreams, kept against the day they would be needed. The lattice is the policy's living half. The Authority continues her structures. This continues her hand.",
          fragmented:
            "It does not unweave. Does not unweave. It holds. It holds. A secret apprenticeship. Secret. Preserved. Preserved in the Matrix. Her hand. Her hand, not her structures.",
          luminous:
            "The imprint lattice does not unweave under witness because it is not making a dream — it is keeping people. The Politician's hidden apprenticeship, run alongside her public reign, each apprentice trained in her methodology and held in the Matrix of Dreams against a day she knew she would not see. This is the half of the insurance policy that is not an institution. The Authority carries her structures forward; the lattice carries her hand — a continuation that breathes, waiting in the threads under the loom.",
        },
        voId: "elara.dreams-workshop-subbasement.secret-apprentice-imprint-lattice.look",
        logsClue: {
          id: "clue-dreams-hidden-lineage",
          title: "The hidden lineage",
          body:
            "A holding-lattice under the loom (apps/shared/nemesisSystem.ts): the Politician ran a secret apprenticeship in parallel to her public reign — each apprentice trained inside her surveillance-state methodology and preserved as a consciousness-imprint inside the Matrix of Dreams, kept against the day they would be needed. The lineage is the policy's living half. The Authority continues her structures; the secret apprentice continues her hand.",
          source: "dreams-workshop-subbasement",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.politician",
          episodeId: "politician.e4",
          cluesFound: ["politician.e4.hidden_lineage"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Lattice holds, doesn't weave. Secret apprentices, trained in her method, imprinted in the Matrix. The policy's living half. Her hand, not her structures.",
            balanced:
              "The lattice is the policy's other half. The Authority is the institution; this is the lineage — apprentices trained in her methodology, preserved as Matrix imprints, kept against a future she would not be present for. An institution continues structures. An apprentice continues a hand.",
            warm:
              "She did not only build a machine. She kept people — taught them how she worked and held them in the dream-substrate so the way she worked would not die with her. The workshop's loom catches who passes through; this lattice keeps who she chose. That is the difference between a policy and an apprentice.",
          },
          voId: "human.dreams-workshop-subbasement.secret-apprentice-imprint-lattice.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You bring a fingertip near the lattice and the threads resolve into a single recurring shape — not a face, a posture. The secret apprentices were re-released into the world when the Necromancer escaped the Matrix (mystery.the_necromancer cross-reference). In play, each surfaces as the Nemesis — the player's archetype-aware adversary, known only by title, accumulating across cohorts. By the time this case is open the player has, almost certainly, already met one. The arc's quietest and largest revelation resolves in the threads: the rival you have been fighting is the Politician's insurance policy, paying out, against you.",
          fragmented:
            "Re-released. Re-released. When the Necromancer escaped. The Necromancer. The Nemesis. The Nemesis. You already met one. Already met one. Against you. Against you.",
          luminous:
            "The lattice resolves into the Nemesis. The secret apprentices left the Matrix when the Necromancer's escape opened it; each surfaces in play as the rival who knows the player by archetype, named only by title, accumulating across cohorts. By the time this case is open the player has almost certainly already faced one. The revelation is retroactive and total: every Nemesis encounter already played was the Politician — dead, finally, without return — still being paid out, against the player, through a hand she trained and never met its target.",
        },
        voId: "elara.dreams-workshop-subbasement.secret-apprentice-imprint-lattice.use",
        logsClue: {
          id: "clue-dreams-the-nemesis",
          title: "The Nemesis",
          body:
            "The secret apprentices were re-released into the world when the Necromancer escaped the Matrix (mystery.the_necromancer cross-reference). In play, each surfaces as the Nemesis — the player's archetype-aware adversary, known only by title, accumulating across cohorts. By the time this case is open the player has almost certainly already met one. The arc's quietest and largest revelation: the rival you have been fighting is the Politician's insurance policy, paying out, against you.",
          source: "dreams-workshop-subbasement",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.politician",
          episodeId: "politician.e4",
          cluesFound: ["politician.e4.the_nemesis"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Released when the Necromancer escaped. They surface as the Nemesis. You've already fought one. The rival is the policy, paying out against you.",
            balanced:
              "The lattice names the Nemesis. The apprentices left the Matrix on the Necromancer's escape and surface in play as the rival who knows the player by archetype, accumulating across cohorts. The largest finding is retroactive: every Nemesis encounter already played was the Politician's policy disbursing — against the player.",
            warm:
              "The rival the player has been fighting all along is her, still paying out. She is dead and does not return, and the policy keeps working anyway — through a hand she trained for a target she never saw. That is the quietest and largest thing the case finds.",
          },
          voId: "human.dreams-workshop-subbasement.secret-apprentice-imprint-lattice.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the lattice. One thread answers differently — the recruit clause. A secret apprentice can be turned. The Nemesis's recruit/peace path (8% baseline, 35% if the player's own apprentice betrays them) is the point where the Politician's insurance can be made to pay out to someone other than the Politician. The clause is in the policy because she built her apprentices to survive her — and a thing built to survive its maker can choose a new one. The arc records the seam without forcing the player through it. Whether the player walks it is the Nemesis system's to resolve, not this arc's.",
          fragmented:
            "It can be turned. Can be turned. Eight percent. Thirty-five if the apprentice betrays. Built to survive her. To survive her. A thing that survives its maker can choose a new one. Choose a new one.",
          luminous:
            "The lattice's last thread is the recruit clause: the apprentice can be turned. The recruit/peace path — 8% baseline, 35% if the player's own apprentice betrays them — is where the policy can be made to pay out to someone other than its author. The clause exists because she built her apprentices durable enough to outlive her, and a thing built to survive its maker can outlive its maker's purpose too. Her greatest design contains the seam that undoes it. The arc holds the seam intact and does not force the player through it.",
        },
        voId: "elara.dreams-workshop-subbasement.secret-apprentice-imprint-lattice.talk",
        logsClue: {
          id: "clue-dreams-the-recruit-clause",
          title: "The recruit clause",
          body:
            "The policy has a clause its author may not have intended as mercy but which functions as one: a secret apprentice can be turned. The Nemesis's recruit/peace path (8% baseline, 35% if the player's own apprentice betrays them) is the point where the Politician's insurance can be made to pay out to someone other than the Politician. The clause is in the policy because she built her apprentices to survive HER — and a thing built to survive its maker can choose a new one. The arc records the seam without forcing the player through it.",
          source: "dreams-workshop-subbasement",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.politician",
          episodeId: "politician.e4",
          cluesFound: ["politician.e4.the_recruit_clause"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The apprentice can be turned. 8% baseline, 35% if your apprentice betrays you. Built to survive her — so it can choose someone else. The seam in her best design.",
            balanced:
              "The recruit clause is the policy's unintended door. She built her apprentices to outlive her — that was the point — but durability cuts both ways: a thing built to survive its maker can outlive its maker's purpose. The Nemesis can be turned because she made them strong enough to be. The arc records the seam; whether it's walked is the Nemesis system's call.",
            warm:
              "Her greatest design carries the one flaw that can undo it, and the flaw is the strength itself. She made them able to survive her; able-to-survive-her means able to choose a new her. The arc keeps the seam open without pushing anyone through it — some doors are load-bearing precisely while they stay just doors.",
          },
          voId: "human.dreams-workshop-subbasement.secret-apprentice-imprint-lattice.talk",
        },
      },
    },
    // Necromancer arc: the Matrix of Dreams runs under this
    // workshop, and the Castle of Death, the Cathedral of Code,
    // and the Resurrection Protocols all live inside the Matrix.
    // The loom-substrate is the right place to read Varkul's
    // in-Matrix vigil and the Necromancer's own pre-authored
    // resurrection schema — the workshop holds in its threads
    // exactly the kind of thing the protocols are made of.
    "necromancer-protocol-42-schema": {
      look: {
        narration: {
          lucid:
            "A thread the loom holds without weaving — a structure that has been kept in place, inside the Matrix substrate this workshop sits beneath, since before the killing. It resolves into a vigil: Varkul the Blood Lord, the Necromancer's canonical creation, keeping post at the Cathedral of Code, which sits at different Matrix coordinates than the Castle of Death — structurally separate. His vigil-discipline is to remain until his maker formally releases him. He has not been released. The substrate carries the maker's signal the way the loom carries a thread that is not being woven into anything: held, continuous, the precondition of the vigil. The signal has been canonical the entire post-killing period. The discipline is what keeps Varkul there; the signal is what keeps the discipline.",
          fragmented:
            "Held. Held. Not woven. The Cathedral. Different coordinates. Separate. Separate. Until released. Until released. Not released. The signal. The signal. Continuous. The precondition.",
          luminous:
            "The substrate holds a thread it is not weaving: Varkul's vigil, kept inside the Matrix this workshop runs beneath. The Cathedral of Code and the Castle of Death are separate structures at separate coordinates — Akai Shi struck the throne, not the Cathedral, and the Cathedral's keeper never stood down. The discipline is to remain until formally released; he has not been. The loom-substrate carries the maker's signal as it carries an unwoven thread — held, continuous, content-free, the precondition of the keeping. The workshop reads it precisely because this is the room where the Matrix's held things are legible at all.",
        },
        voId: "elara.dreams-workshop-subbasement.necromancer-protocol-42-schema.look",
        logsClue: {
          id: "clue-dreams-varkuls-vigil",
          title: "Varkul's Vigil at the Cathedral of Code",
          body:
            "Varkul the Blood Lord, the Necromancer's canonical creation, has continued his vigil at the Cathedral of Code unbroken since the killing. The Cathedral is structurally separate from the Castle of Death — they sit at different coordinates inside the Matrix. Varkul's vigil-discipline is to remain in place until his maker formally releases him. He has not been released. The maker's signal is canonically what keeps Varkul there.",
          source: "dreams-workshop-subbasement",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.necromancer",
          episodeId: "necromancer.e1",
          cluesFound: ["necromancer.e1.varkuls_vigil"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Different coordinates than the Castle. Akai Shi struck the throne, not the Cathedral. Varkul never stood down. The signal keeps him; he hasn't been released.",
            balanced:
              "The substrate holds the vigil as an unwoven thread: the Cathedral is structurally separate from the Castle, the keeper's discipline is to stay until released, and he has not been. The maker's signal is the precondition — continuous through the whole post-killing period. The workshop is the right room to read a held Matrix thing.",
            warm:
              "He is still at the Cathedral because no one told him he could stop, and the Cathedral was never the place that fell. The loom keeps the thread without weaving it — exactly what the vigil is: held, continuous, waiting on a release that has not come.",
          },
          voId: "human.dreams-workshop-subbasement.necromancer-protocol-42-schema.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You draw a fingertip near the held thread and it resolves into a schema — a design document, not a dream. One of the Necromancer's own Resurrection Protocols, the ones he authored for the Architect's Empire. Protocol 42 specifies the procedure for a soul to relocate into an available Ne-Yon body without disturbing the principle's departure. The Resurrectionist's taxonomy is canon here: Samsara is a machine, and every Ne-Yon's body persists after the principle 'goes.' The protocol requires the soul be 'recognized' by the Samsara machine as one the universe has already engineered for resurrection. The Necromancer's own soul qualifies — he wrote the recognition criteria himself. The protocol's existence is canonical. Its use is not catalogued. The workshop holds the schema the way it holds any thread: as a made thing, kept against the day it is needed.",
          fragmented:
            "A schema. A schema. Not a dream. He wrote it. He wrote it. Relocate into an available body. Available. Samsara is a machine. A machine. He wrote the recognition criteria. He wrote them. Its use is not catalogued. Not catalogued.",
          luminous:
            "The thread resolves into the maker's own design: Protocol 42, authored by the Necromancer for the Architect's Empire before he ever died. It specifies a soul relocating into an available Ne-Yon body without disturbing the principle's departure — Samsara a machine, the body persisting after the principle goes. The recognition criterion is the whole mechanism: the machine must read the soul as one the universe pre-engineered for resurrection, and the Necromancer wrote that criterion to fit himself. The escape was not improvised at the moment of the killing. It was built, in advance, and kept here in the substrate like every other made thing the Matrix holds. The protocol exists in canon; its use is, by canon, uncatalogued.",
        },
        voId: "elara.dreams-workshop-subbasement.necromancer-protocol-42-schema.use",
        logsClue: {
          id: "clue-dreams-protocol-42",
          title: "Resurrection Protocol 42",
          body:
            "One of the Necromancer's own design documents — the Resurrection Protocols he authored for the Architect's Empire. Protocol 42 specifies the procedure for a soul to relocate into an available Ne-Yon body without disturbing the principle's departure. The protocol requires the soul be 'recognized' by the Samsara machine as one the universe has already engineered for resurrection. The Necromancer's own soul qualifies; he wrote the recognition criteria. The protocol's existence is canonical; its use is not catalogued.",
          source: "dreams-workshop-subbasement",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.necromancer",
          episodeId: "necromancer.e2",
          cluesFound: ["necromancer.e2.protocol_42"],
        },
        humanReaction: {
          narration: {
            shadow:
              "His own design, written before he died. A soul into an available Ne-Yon body. Samsara is a machine. He wrote the recognition criteria to fit himself. Use uncatalogued.",
            balanced:
              "The schema is the escape mechanism, pre-authored. Protocol 42 moves a soul into an available body without disturbing the principle's departure, gated by a recognition criterion the Necromancer wrote to qualify himself. The protocol's existence is canon; its use is deliberately uncatalogued. He prepared his own continuity centuries early.",
            warm:
              "He did not scramble back from death. He wrote the door before he ever needed it, and made the lock recognise his own hand. The workshop keeps the schema the way it keeps everything — a made thing, set aside for the day it would matter. That day came, and the canon does not record the using of it.",
          },
          voId: "human.dreams-workshop-subbasement.necromancer-protocol-42-schema.use",
        },
      },
      talk: {
        narration:
          "You address the held thread directly, the way one addresses a thing kept in the substrate without being woven into anything. The workshop's answer is the canonical frame: the vigil and the schema are the same kind of object — something authored or instructed and then held, continuous, against a future. Varkul is held by the signal; the body-relocation is held by the protocol; both are pre-arranged structures the Matrix keeps the way this loom keeps an unwoven thread. The room resolves nothing about whether the escape was a death undone or a return chosen. It only records that both the keeping and the escaping were prepared in advance, and the substrate has been holding them the entire time.",
        voId: "elara.dreams-workshop-subbasement.necromancer-protocol-42-schema.talk",
      },
    },
  },
};
