/* ═══════════════════════════════════════════════════════
   ORDER TRIBUNAL MYSTERY — judges-bench + evidence-locker

   Two-hotspot module. Sets tribunal_seen on first-look at
   the judges-bench. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type OrderTribunalHotspotId =
  | "dlc-wolf-anara-hunt-order-tribunal"
  | "dlc-storm-architect-of-flux-order-tribunal"
  | "judges-bench" | "evidence-locker" | "mol-vereth-audit-ledger";

export const ORDER_TRIBUNAL_MYSTERY: RoomMysteryModule<OrderTribunalHotspotId> = {
  roomId: "order-tribunal",
  responses: {
    "dlc-wolf-anara-hunt-order-tribunal": {
      look: {
        narration: "Case material for wolf.anara_hunt surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e3",
          cluesFound: ["wolf.e3.judge_clarification"],
        },
      },
    },
    "dlc-storm-architect-of-flux-order-tribunal": {
      look: {
        narration: "Case material for storm.architect_of_flux surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e2",
          cluesFound: ["storm.e2.judges_arbitration_register"],
        },
      },
    },
    "judges-bench": {
      look: {
        narration: {
          lucid:
            "The judges-bench is a long brass-and-oak slab elevated above the floor by three steps. Three high-backed chairs. The middle chair is taller than the other two by a hand's-width — the position the chief adjudicator sits in. The seat is worn. Three centuries of judgments have happened on that wood.",
          fragmented:
            "Three centuries. Three centuries. Three centuries. The wood remembers.",
          luminous:
            "The bench is pre-Ark. It was carried onto this ship from another vessel, by someone who wanted the institutional memory to come with them. Three centuries of judgments are absorbed into the wood. The Order's discipline was that no new bench was ever cut — the same wood had to bear every verdict, so that the verdicts could not be lighter than the wood.",
        },
        voId: "elara.order-tribunal.judges-bench.look",
        setsFlag: "tribunal_seen",
        logsClue: {
          id: "clue-tribunal-bench-pre-ark",
          title: "The tribunal bench is older than the Ark",
          body:
            "The Order Tribunal's judges-bench was carried onto the Ark from a previous vessel. Three centuries of accumulated judgments live in the wood. The Order's discipline forbade cutting a new bench — every verdict had to be heavier than the wood it was rendered on.",
          source: "order-tribunal",
          order: 0,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the judges-bench surfaces the
        // currently-active Syndicate pairs ledger. Lore match: the
        // bench catalogues active dockets, and the three living
        // Syndicate pairs (Feet / Voices / Witnesses) are open
        // enforcement targets — listed in the same column as every
        // pending verdict the Order has ever pronounced.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e3",
          cluesFound: ["wraith.e3.living_pairs_ledger"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three pairs still active. Feet, Voices, Witnesses. The bench keeps the docket open until the verdicts are pronounced. They will be.",
            balanced:
              "The Syndicate pairs ledger is the Order's open-enforcement column. The bench is older than any of the three pairs and will outlive the last of them. The cases are not stale; the wood is just patient.",
            warm:
              "Three centuries of patience in one piece of wood. I have never been able to sit comfortably in this room. I respect everything about it.",
          },
          voId: "human.order-tribunal.judges-bench.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You press both palms to the bench's worn middle seat. The wood warms briefly under the touch — three centuries of judgments registering one more witness — and the bench's underside surfaces a sealed contract you had not noticed: red wax, demon's mark, signed by Mol'Vereth, Hierarchy junior partner. The contract names the Degen as a trustee, not a debtor. The bench has been carrying the contract underneath it since the day the verdict was rendered.",
          fragmented:
            "Mol'Vereth. Mol'Vereth. Junior partner. Junior partner. Trustee. Trustee. Not a debtor. Not a debtor.",
          luminous:
            "The judges-bench has been holding Mol'Vereth's contract underneath the chief adjudicator's seat since the Order rendered its verdict on the trusteeship. The contract is sealed in red wax with the demon's signature. It names the Degen as trustee, not debtor. The Order ratified the arrangement; Mol'Vereth's contract has been in force ever since. The bench is the wood that bears the verdict, and the verdict — for the Degen — is that he is not, by Hierarchy law, a free agent. He is managing someone else's stake.",
        },
        voId: "elara.order-tribunal.judges-bench.use",
        // Mystery Engine binding — when the Degen arc is the
        // active case, pressing the bench surfaces Mol'Vereth's
        // sealed contract from the trusteeship verdict. Lore
        // match: the bench is canonically pre-Ark and "every
        // verdict had to be heavier than the wood" — the Order
        // ratified the trusteeship at this bench, and the wood
        // has carried the contract underneath it ever since.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e1",
          cluesFound: ["degen.e1.hierarchy_demon_signature"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Mol'Vereth's red wax under the chief adjudicator's seat. Trustee, not debtor. The Order ratified the arrangement. The Degen has been managing someone else's stake the whole time.",
            balanced:
              "The demon-signature contract reframes everything in the Degen's case. He is not a free agent — he is a Hierarchy trustee, by Order ratification. His debts are someone else's stakes, and he has been performing the role under that constraint without complaint for centuries.",
            warm:
              "The Degen has been carrying someone else's stake at his table for as long as I have known him. He never complained. I think he found the work, even under the constraint, satisfying. I'm telling you so you don't read his quietness as resignation.",
          },
          voId: "human.order-tribunal.judges-bench.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the bench. The wood does not answer in voice — it answers in resonance. Stand close enough and the three centuries of pronouncements absorbed into the grain produce, very faintly, a sub-audible standing tone. The Order trained adjudicators to hear the tone before they spoke. We are listening to it now. We are not, today, going to add another verdict to the count. — As you address it, a sealed letter slides forward from beneath the chief adjudicator's seat: Mol'Vereth's principal-of-record outline, identifying the actual party the trusteeship contract was held for. The Order ratified the verdict; this letter names the principal the verdict ratified.",
          fragmented:
            "The tone. The tone. The tone. The wood hums. The wood hums. The wood remembers every verdict. Every verdict. The principal. The principal. Mol'Vereth's principal. Named.",
          luminous:
            "The bench answers in resonance, not in words. The standing tone is the cumulative weight of three centuries of judgments, and the Order's discipline was that no adjudicator should pronounce a verdict whose weight exceeded what the bench could already hold. The tone is the limit. We are not, today, here to test it — we are here to acknowledge the limit and to honour the discipline of the room that made the limit legible in the first place. The sealed letter that slid forward when we addressed the bench is the Order's record of Mol'Vereth's principal — the actual party the trusteeship contract was held for, named in the same wax-seal protocol the Order uses for any verdict whose subject the public record is not allowed to carry.",
        },
        voId: "elara.order-tribunal.judges-bench.talk",
        // Jericho arc binding — the principal-of-record letter
        // identifies whom the trusteeship verdict actually served.
        // jericho.e5.mol_vereth_principal_outline foundIn:
        // order-tribunal.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e5",
          cluesFound: ["jericho.e5.mol_vereth_principal_outline"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The principal-of-record is whoever the trusteeship actually serves. The letter names them. Read carefully; the Order doesn't volunteer this information twice.",
            balanced:
              "Mol'Vereth's principal-outline is the document that closes Jericho's case on the legal side. The Hierarchy has, in writing, named the party Jericho's trusteeship is held for — and the Order has countersigned. The bench tells the truth even when the case-file redacts it.",
            warm:
              "Whoever the principal is, they will know we read this. The Order's clerks log every wax-seal break. We have committed ourselves to the case by reading the letter; we should be ready to act on what it says.",
          },
          voId: "human.order-tribunal.judges-bench.talk",
        },
      },
    },
    "evidence-locker": {
      look: {
        narration: {
          lucid:
            "The evidence-locker along the back wall is a wall of small brass-faced compartments. Most are empty. Three are sealed with red wax — open cases, awaiting verdict. The newest red seal is dated the year of Lyra's death. Whatever case it is, it has been open for two and a half centuries.",
          fragmented:
            "Three open. Three open. Three. Three open cases. Three.",
          luminous:
            "The newest sealed compartment is, by my best read, the case the Order opened against the Editor — though they did not, in their records, name him. Lyra brought charges through the tribunal in the last week of her command. The case was procedurally opened and never closed, because the prosecutor and the principal witness were both, within seventy-two hours, dead or departed. The case is still on the docket.",
        },
        voId: "elara.order-tribunal.evidence-locker.look",
        logsClue: {
          id: "clue-tribunal-open-case-against-editor",
          title: "Open tribunal case against the editor (procedural)",
          body:
            "The Order Tribunal's evidence-locker holds three red-wax-sealed open cases. The newest seal dates to the week of Lyra Vox's death — a case she brought against the Editor, though the records do not name him. The case was procedurally opened and never closed; the prosecutor (Lyra) died and the principal witness (Wraith Calder) departed within 72 hours.",
          source: "order-tribunal",
          order: 1,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the evidence-locker surfaces the Order
        // Tribunal Confirmed-Kill list #C-7. Lore match is exact:
        // the evidence-locker holds the open case where Wraith was
        // the principal witness; the kill list is a sibling exhibit
        // in the same red-wax-sealed compartment.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e3",
          cluesFound: ["wraith.e3.tribunal_kill_list"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Confirmed-Kill list #C-7. Names redacted in indigo. Wraith was the principal witness on every entry. He went into exile rather than testify on the eighth.",
            balanced:
              "The kill list is a sibling exhibit to the case Lyra opened. C-7 lists confirmed kills attributable to the editor's protocol-theft pattern. Wraith was the principal witness on the seven names that survived the redaction — and by departing, refused to add an eighth.",
            warm:
              "He testified against seven killings. He could not testify against the eighth. I did not understand his refusal at the time. I think I understand it now.",
          },
          voId: "human.order-tribunal.evidence-locker.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You break the red wax on the newest sealed compartment. The wax cracks cleanly, the way wax cracks when it has been waiting to be cracked for a long time and the seal-keeper had no objection. Inside: a single docket sheet in Lyra Vox's hand, a witness deposition signed by Wraith Calder, and a charge sheet with the defendant's name redacted in indigo. The case file is intact. The case is, as a matter of procedural record, still ours to advance. — Beneath the case file: an unrelated letter from Xeth'Raal to Brel'Sorrash, filed with the tribunal's clerk for safekeeping. The letter's text: 'You are continued in your post. Continue. The Hierarchy's gratitude is unsentimental, and is, on this occasion, sincere.' The letter has been countersigned by the Order's clerk, making the continuance Order-ratified.",
          fragmented:
            "The wax. The wax. The wax. The seal opens. The seal opens. Lyra. Wraith. Lyra. Wraith. Both signatures. Both signatures. Both signatures. Continuance. Continuance. Brel continued.",
          luminous:
            "The case file is intact. Lyra's docket sheet, Wraith's deposition, and a charge sheet with the defendant's name redacted in indigo. The case has been sitting in this compartment for two and a half centuries, fully prepared, awaiting only a prosecutor and a present principal witness. The Order keeps every open case open until it is properly closed; this is the case the Order has been waiting longest to close. The Xeth'Raal continuance letter beneath it is a sister document — the Hierarchy CFO's formal acknowledgement, Order-ratified, that Brel'Sorrash continues in her custodianship of the Goggles section.",
        },
        voId: "elara.order-tribunal.evidence-locker.use",
        setsFlag: "tribunal_open_case_opened",
        // Game Master arc — Xeth'Raal's continuance letter to Brel,
        // Order-ratified. game_master.e5.xethraal_continuance_letter.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e5",
          cluesFound: ["game_master.e5.xethraal_continuance_letter"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Hierarchy CFO countersigned by the Order's clerk. Brel continues. The Vault Division goes on. Velkraal arranged this exit.",
            balanced:
              "Xeth'Raal's continuance letter is the formal close to the Game Master arc. Order-ratified, Hierarchy-issued, Velkraal-arranged. The Goggles section continues under Brel's read-don't-edit protocol. The succession is, as Velkraal designed it, quiet.",
            warm:
              "Brel reads. She will read for a long time. Velkraal made sure of that. The letter is the saga's small ratification of one careful person's careful exit.",
          },
          voId: "human.order-tribunal.evidence-locker.use",
        },
      },
      talk: {
        narration:
          "If you address the locker, you address every open case the Order has not yet been able to close. Three voices, three pending verdicts. The newest of them is, as we now know, ours to either inherit or decline. The locker is, in this moment, asking which we intend to do. — As you speak, the second-newest sealed compartment thins around its wax: the Order's post-Fall Lionism revision, the threshold-doctrine update that revised Section 4 Mercy in the years after the academy fell. The revision is dated in a hand we now recognise as the editor's. The Order ratified it; the editor authored it. The threshold-doctrine that has governed Lionism for two centuries is, on the evidence, his.",
        voId: "elara.order-tribunal.evidence-locker.talk",
        // Jericho arc binding — the post-Fall threshold-doctrine
        // revision is the editor's hand on the Lionism canon. The
        // pre-Fall code lives in the Antiquarian's library; the
        // post-Fall revision lives here, in the Order's locker.
        // jericho.e4.post_fall_revision foundIn: order-tribunal.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e4",
          cluesFound: ["jericho.e4.post_fall_revision"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Post-Fall threshold-doctrine. Editor's hand, Order ratification. The Lionism canon has been his for two centuries. Jericho was raised on it and didn't know.",
            balanced:
              "The post-Fall revision rewrote Section 4 Mercy in language that sounds like Lionism but isn't. The editor authored the threshold doctrine; the Order ratified it because the Insurgency stopped contesting it after Akai Shi's death. Jericho's trainers used the revision as canon. He learned the editor's voice before he learned the original.",
            warm:
              "He grew up on the wrong canon. That isn't his fault. We are, by reading this revision against the pre-Fall code, giving him the original he was supposed to have. He will be hard on himself when he realises. Don't let him.",
          },
          voId: "human.order-tribunal.evidence-locker.talk",
        },
      },
    },
    // Degen arc: e2-e5 audit-trail clue surface. Mol'Vereth files
    // every annual audit through the Order's clerk-of-record. The
    // resulting ledger lives in a small bound volume on a side-shelf
    // beside the judges-bench. Four entries bind the four episodes.
    "mol-vereth-audit-ledger": {
      look: {
        narration: {
          lucid:
            "A small bound volume on the side-shelf beside the judges-bench. Mol'Vereth's audit calendar is pinned to the cover — every year the Hierarchy CFO files an annual audit through the Order's clerk-of-record. Today's date is circled in red ink. Inside the front cover, in his marginal hand, last year's audit closes with: 'No further query — pending the next clerk who can read the Coda's fourth column.'",
          fragmented:
            "Today. Today. Today. Circled. Circled. The clerk who can read. The clerk. The clerk. We are the clerk. We are.",
          luminous:
            "The Audit Ledger holds Mol'Vereth's audit calendar (today is circled) and his marginal note from last year — left for the next clerk who can read the Coda's fourth column. The Coda is the seven-faction trustee body the Degen serves; the fourth column is its routing register. Mol'Vereth has been waiting for an auditor who knows where to look. We are, on the date the calendar circled, that auditor.",
        },
        voId: "elara.order-tribunal.mol-vereth-audit-ledger.look",
        logsClue: {
          id: "clue-tribunal-audit-ledger",
          title: "Mol'Vereth's audit ledger + last year's marginal note",
          body:
            "The Order Tribunal holds a side-shelf bound volume — Mol'Vereth's audit ledger. Today's date is circled on the calendar; last year's audit closes with a marginal note awaiting 'the next clerk who can read the Coda's fourth column.'",
          source: "order-tribunal",
          order: 2,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e2",
          cluesFound: [
            "degen.e2.audit_schedule",
            "degen.e3.mol_vereth_marginal_note",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "He's been reading the same Coda column for thirty years. He left a note for the next clerk. We are the next clerk. The audit is on us.",
            balanced:
              "Mol'Vereth's audit calendar is exact and his marginal note is a quiet handover. He's looking for a clerk who can read what he reads. That's the Degen, on his good days; that's us, on this one.",
            warm:
              "Mol'Vereth is, beneath the precision, a kind man. The marginal note is him saying: someone, eventually, will read this carefully, and they will know what to do. We are the someone.",
          },
          voId: "human.order-tribunal.mol-vereth-audit-ledger.look",
        },
      },
      use: {
        narration:
          "You leaf forward to the current year's audit-scope letter. Mol'Vereth's signature opens it; the scope clause names three brokerage rows the Senior Partners want examined. Row 4,711 is one of the three. The scope is, by his hand, narrower than usual — he is auditing one specific risk, not the year's normal sweep.",
        voId: "elara.order-tribunal.mol-vereth-audit-ledger.use",
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e4",
          cluesFound: ["degen.e4.audit_scope_letter"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Narrow scope. One specific risk. Row 4,711 named directly. He's not fishing — he's pointing.",
            balanced:
              "A narrow audit scope is a Mol'Vereth signal. He's done this before: when he wants to find one specific thing, he writes a one-thing scope letter. The Senior Partners always sign it. The Degen always knows what he's looking for. So do we, now.",
            warm:
              "He is being kind by being precise. A broad audit would have been a fishing expedition; a narrow one is a question he is asking the Degen to answer. The Degen will answer it well, because the Degen has been preparing for the question for at least three days.",
          },
          voId: "human.order-tribunal.mol-vereth-audit-ledger.use",
        },
      },
      talk: {
        narration:
          "If you address the ledger, the back endpaper warms. A draft of the audit-outcome letter rises into legibility — Mol'Vereth pre-wrote the result in pencil, leaving only the signature line blank. The pencilled text reads: 'Settled. Account restored to nominal. Trustee status reaffirmed. The Coda's books are the Coda's books. The Saga returns to the table.' The letter is dated forward — three weeks from today. He has, in effect, sketched the verdict before the audit. Whether the pencilled text becomes the actual outcome depends on what the audit finds in the meantime.",
        voId: "elara.order-tribunal.mol-vereth-audit-ledger.talk",
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e5",
          cluesFound: ["degen.e5.audit_outcome_letter"],
        },
        humanReaction: {
          narration: {
            shadow:
              "He pre-wrote the verdict in pencil. Settled, restored, reaffirmed. The pencil holds if the audit doesn't surface anything that contradicts. We make sure it doesn't.",
            balanced:
              "Mol'Vereth's draft outcome letter is the Hierarchy CFO's working assumption: the Degen's books will check out and the trusteeship will continue. The pencil is rewriteable until it's signed. Our job is to make the pencil hold.",
            warm:
              "He believes the Degen is honest. That belief is rare and it is, on the evidence of thirty years, well-earned. The pencilled letter is Mol'Vereth telling the Degen — through us — that the trust is still good.",
          },
          voId: "human.order-tribunal.mol-vereth-audit-ledger.talk",
        },
      },
    },
  },
};
