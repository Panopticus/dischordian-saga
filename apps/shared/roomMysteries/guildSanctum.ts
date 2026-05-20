/* ═══════════════════════════════════════════════════════
   GUILD SANCTUM MYSTERY — sigil-altar + allegiance-pad

   Two-hotspot module. Sets guild_sanctum_seen on first-look
   at the sigil-altar. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type GuildSanctumHotspotId =
  | "sigil-altar"
  | "allegiance-pad"
  | "the-advocates-blind-spot"
  | "what-telling-the-advocate-costs"
  | "the-mirror-doctrine-loom"
  | "the-sister-of-the-weave-letter"
  | "the-binding-chains-cost"
  | "storm-degens-house-advantage-anomaly"
  | "wolf-minigame-entry-state"
  | "wolf-present-in-hall";

export const GUILD_SANCTUM_MYSTERY: RoomMysteryModule<GuildSanctumHotspotId> = {
  roomId: "guild-sanctum",
  responses: {
    /* ─── wolf.anara_hunt · e5 (Hunt-the-Hero minigame entry state) ─── */
    "wolf-minigame-entry-state": {
      look: {
        narration:
          "On the guild-sanctum's case-handover board, the Hunt-the-Hero gameplay loop's entry state begins here, in this chamber, with the Wolf already present and the three incoming heroes still cycles away from arrival. The player's choices in this Mystery Engine arc set the minigame's initial state: which League members have been warned (E2); whether the Resurrectionist has been confronted (E3); whether the Hall has been evacuated, sealed, or entered (E4). The investigation closes. The gameplay opens.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e5",
          cluesFound: ["wolf.e5.minigame_entry_state"],
        },
      },
    },
    /* ─── wolf.anara_hunt · e5 (the Wolf, present, in the Hall) ─── */
    "wolf-present-in-hall": {
      look: {
        narration:
          "Through the sanctum's chronicle window, the Wolf is in the Hall. He is wearing a League cloak retrieved from one of the pedestals — the field medic's, the one to whom he extended mercy. He has not yet moved on the three heroes scheduled to enter this cycle. He is reading the cloak's inner lining, where the medic recorded her bond-prayer. He may be deciding whether to extend mercy a second time.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e5",
          cluesFound: ["wolf.e5.the_wolf_present"],
        },
      },
    },
    /* ─── storm.architect_of_flux · e3 (Degen's house-advantage anomaly) ─── */
    "storm-degens-house-advantage-anomaly": {
      look: {
        narration:
          "On the allegiance-pad's accounting console, the Degen's casino ledger shows a multi-decade anomaly in the house advantage during one of the Storm's most active flux periods. The advantage swung against the house — losses sustained, balanced by gains on the back end of the period. The Degen's accounting principle holds that the house always wins; the anomaly violates the principle. The ledger annotates the period: 'patron arrangement — Storm-class.' The Degen's hand on the annotation is unambiguous.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e3",
          cluesFound: ["storm.e3.degens_house_advantage"],
        },
      },
    },
    "sigil-altar": {
      look: {
        narration: {
          lucid:
            "The sigil-altar at the room's centre is a low brass slab inscribed with every guild-sigil the Ark has ever recognised. Some sigils are scratched out. Some are double-engraved. The altar's history is, in effect, a litigation record — every alliance the ship has formally entered or formally broken is permanently on its surface.",
          fragmented:
            "Every alliance. Every alliance. Every alliance is on the altar.",
          luminous:
            "The altar carries the ship's diplomatic memory. Lyra's discipline was that no allegiance was ever scrubbed — even broken ones stayed engraved, only crossed through. That preserves the institutional record against the editor's preferred kind of revision. The altar is, in retrospect, one of the few surfaces on the ship he could not work on.",
        },
        voId: "elara.guild-sanctum.sigil-altar.look",
        setsFlag: "guild_sanctum_seen",
        logsClue: {
          id: "clue-guild-sanctum-engraved-history",
          title: "The sigil-altar preserves every alliance, broken or kept",
          body:
            "The Guild Sanctum's altar engraves every alliance the Ark has formally entered. Broken alliances are crossed through but never erased — Lyra's deliberate discipline against editor-style revision. The altar is one of the ship's few editor-resistant surfaces.",
          source: "guild-sanctum",
          order: 0,
        },
        humanReaction: {
          narration: {
            shadow:
              "Crossed-through, not scrubbed. The Editor cannot touch this room because Lyra didn't let him. That is not a small thing.",
            balanced:
              "The altar is one of about four surfaces on the ship the Editor has never been able to revise. The reason is procedural — Lyra wrote a rule, and the room enforces the rule physically. Most editorial defenses are textual; this one is engineered.",
            warm:
              "There are alliances on this altar I helped Lyra negotiate, including a few that have since been crossed through. The crossings are correct. I would not want them erased. The altar honours the work by refusing to forget the parts of it that failed.",
          },
          voId: "detective.guild-sanctum.sigil-altar.look",
        },
      },
      use: {
        narration:
          "You run your palm along the engraved sigils. The brass is warm where guild-members have rested their hands across the centuries. Some sigils are smooth from frequent contact; others are sharp-edged, untouched. The altar is, in physical evidence, a record of which alliances were lived in.",
        voId: "elara.guild-sanctum.sigil-altar.use",
      },
      talk: {
        narration:
          "If you address the altar, you address every guild that ever signed it. That is, on Lyra's discipline, the room's whole conversational logic — speech here is automatically witnessed by every prior alliance, broken or kept.",
        voId: "elara.guild-sanctum.sigil-altar.talk",
      },
    },
    "allegiance-pad": {
      look: {
        narration: {
          lucid:
            "A small pressure-pad in the floor in front of the altar. Stepping onto it engages the sigil-altar's recording function — your current allegiances are read from your character signature and committed to the engraving. Lyra's design forced every visitor to be on the record before they spoke.",
          fragmented:
            "On the record. On the record. On the record. Before you speak.",
          luminous:
            "The pad puts you on the record before you can address the altar. It is the room's gentlest enforcement: you cannot use the sanctum's history without contributing to it. This is, on Lyra's notes, the rule of every honest archive — readers leave a fingerprint, so the record knows who consulted it. The editor refuses that rule. The pad is an editor-resistant ritual.",
        },
        voId: "elara.guild-sanctum.allegiance-pad.look",
        logsClue: {
          id: "clue-guild-sanctum-allegiance-pad",
          title: "The allegiance pad records every visitor",
          body:
            "The Guild Sanctum's allegiance-pad records every visitor's current allegiances when they step onto it — Lyra's rule of honest archiving (readers leave a fingerprint). The Editor's method is to read without leaving a fingerprint. The pad is editor-resistant by design.",
          source: "guild-sanctum",
          order: 1,
        },
        humanReaction: {
          narration: {
            shadow:
              "Readers leave a fingerprint. That is the rule. The Editor refuses the rule. The pad refuses the Editor in return.",
            balanced:
              "Step onto the pad and you become readable. That is the room's whole contract. Lyra's discipline was that you should not be allowed to consult an archive without becoming part of it. The Editor's method depends on the opposite — reading without authoring. The pad is, in effect, the room's silent disagreement with him.",
            warm:
              "I have stepped on this pad more times than I can count, in more allegiance configurations than I am comfortable with. Every fingerprint is on file. The room is still willing to let me speak. That is a kind of grace I did not earn cleanly.",
          },
          voId: "detective.guild-sanctum.allegiance-pad.look",
        },
      },
      use: {
        narration:
          "You step onto the pad. It registers your weight, and a moment later your current allegiances appear in faint indigo tracery on the sigil-altar's surface — not engraved yet, only previewed. Stepping off clears the preview. The pad is, by Lyra's design, a hesitation step before commitment.",
        voId: "elara.guild-sanctum.allegiance-pad.use",
        setsFlag: "guild_sanctum_pad_stepped",
      },
      talk: {
        narration:
          "The pad has no voice but it has a logic: speech is allowed once you are on the record. You are now on the record. The room is, accordingly, ready to listen to whatever you say next.",
        voId: "elara.guild-sanctum.allegiance-pad.talk",
      },
    },
    // Zyr'Koth arc: the sanctum is the room of allegiances kept
    // and broken, which is exactly the register in which the
    // Advocate's blind spot reads. A defensive doctrine has no
    // sigil for an extraction — it is not an attack to be
    // crossed through. The room reads the absence the way it
    // reads an alliance that was never engraved because no one
    // present could perceive it had been entered.
    "the-advocates-blind-spot": {
      look: {
        narration: {
          lucid:
            "Cross-referenced against the Advocate's defensive-doctrine archive and laid beside the altar's engraving log: the Advocate knows the Hierarchy adapted her Weave. She believes Syl'Vex's conversion-use is the appropriation — she does not know there is a third use. Zyr'Koth's. The sanctum reads the gap the way it reads an alliance that was entered but never engraved: not hidden, not crossed through, simply never registered, because the surface that records had no sigil for this kind of mark. Her defensive doctrine cannot perceive the Severance — it is not a defense against anything, it is an extraction, and a doctrine built to stand against attacks has no instrument for a procedure performed on a consenting thread. The room files the blind spot as structural, the way the altar files an alliance no one was equipped to witness.",
          fragmented:
            "She knows they adapted it. She does not know the third use. The third use. Not Syl'Vex's. A third. A third. Her doctrine cannot perceive it. Cannot perceive it. Not an attack. An extraction. No sigil for this mark. No sigil.",
          luminous:
            "The cross-reference, read as a sanctum reads an alliance that was never engraved: the Advocate believes Syl'Vex's conversion is the whole of the appropriation. There is a third use her doctrine cannot register, because the doctrine is a defense and the Severance is not an attack — it is an extraction performed on a consenting thread, and a wall has no sense for a thing that does not strike it. The room marks the blind spot as construction, not concealment. No one is hiding the third use from her. The altar simply has no sigil-shape for an alliance entered by a logic her own instrument cannot see.",
        },
        voId: "elara.guild-sanctum.the-advocates-blind-spot.look",
        logsClue: {
          id: "clue-guild-sanctum-zk-advocate-unaware",
          title: "What the Advocate Does Not Know",
          body:
            "Per the Advocate's defensive-doctrine archive cross-referenced against the Hierarchy R&D notes: the Advocate knows the Hierarchy adapted her Weave. She does not know the full extent. She believes Syl'Vex's conversion-use is the appropriation. She does not know there is a third use — Zyr'Koth's — that her defensive doctrine cannot perceive because it is not a defense against anything; it is an extraction.",
          source: "guild-sanctum",
          order: 2,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e1",
          cluesFound: ["zyr_koth.e1.advocate_unaware"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She knows about Syl'Vex's use. Not the third. Her doctrine can't see an extraction — it isn't an attack.",
            balanced:
              "The room files the blind spot as structural, not concealed. A defensive doctrine has no sensor for a procedure that is not an assault. No one is keeping the third use from her — her own instrument's logic is, and the sanctum records that the way it records an alliance no one present could perceive had been entered.",
            warm:
              "Nobody is lying to her. That is somehow the harder fact. The thing she cannot see, she cannot see because she built an instrument to stand against blows, and this one does not strike — it reaches in. The room does not pretend that is a kindness. It is just the shape of her own wall.",
          },
          voId: "human.guild-sanctum.the-advocates-blind-spot.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You set the three-uses canon against the altar's litigation record. The Advocate's defensive use of the Weave costs HER — her humanity. Syl'Vex's conversion-use costs HER — her memory of converts. Zyr'Koth's Severance use costs the SUBJECT, not the weaver. The sanctum reads the three side by side the way it reads three alliances signed under three different terms, and marks the term that differs: he is the only one of the three weavers whose use of the Weave has no cost to himself. The cost was relocated — moved off the practitioner and onto the target. The room files that relocation as the refinement's actual content. The inversion of the consent vector is the method. Moving who pays is the achievement.",
          fragmented:
            "Costs her. Costs her. Costs the subject. The subject. The only one with no cost to himself. The only one. The cost was relocated. Relocated. Moving who pays. Who pays. The achievement.",
          luminous:
            "The three-uses canon, read as a sanctum reads three alliances under three terms: the Advocate's defending costs her, Syl'Vex's converting costs her, Zyr'Koth's severing costs the subject. The room marks the differing term precisely — his is the only use of the Weave that is free to the one who performs it. The other two are disciplines: a discipline costs its practitioner. His is a weapon: a weapon costs its target. The room records the load-bearing finding without flourish: he did not refine the Weave by inverting consent. He refined it by relocating the cost. That move is what makes it a weapon and the others disciplines.",
        },
        voId: "elara.guild-sanctum.the-advocates-blind-spot.use",
        logsClue: {
          id: "clue-guild-sanctum-zk-cost-parallel",
          title: "Parallel: The Advocate's Cost",
          body:
            "Cross-referenced against the Blood-Weave-three-uses canon: the Advocate's defensive use costs HER (her humanity); Syl'Vex's conversion-use costs HER (her memory of converts). Zyr'Koth's Severance use costs the SUBJECT, not the weaver. He is the only one of the three weavers whose use of the Weave has no cost to himself. The cost was relocated. That relocation is the refinement's actual content.",
          source: "guild-sanctum",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e2",
          cluesFound: ["zyr_koth.e2.the_advocates_cost_parallel"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Hers costs her. Syl'Vex's costs her. His costs the subject. The only cost-free use. The cost was moved.",
            balanced:
              "The room reads three alliances under three terms and marks the one that differs: the other two weavers pay; he does not. A discipline costs its practitioner; a weapon costs its target. The refinement is not the inverted consent — it is the relocation of who pays. That is the finding, filed without flourish.",
            warm:
              "The Advocate bleeds for defending. Syl'Vex loses her own converts in the converting. He loses nothing. The room says it plainly because the plainness is the horror: the genius of it was not cruelty, it was accounting — he moved the bill onto the person it is done to.",
          },
          voId: "human.guild-sanctum.the-advocates-blind-spot.use",
        },
      },
    },
    // Zyr'Koth arc: the sanctum is where speech is witnessed by
    // every prior alliance — the room whose logic is that to
    // address it is to be put on the record. That is exactly the
    // register in which the closure question reads: telling the
    // Advocate is itself a small severance the player performs by
    // speaking, in the one room where speech is never weightless.
    "what-telling-the-advocate-costs": {
      look: {
        narration: {
          lucid:
            "Laid against the altar's record of alliances kept and broken: the Advocate knows Syl'Vex converts with the Weave. She does not know Zyr'Koth severs with it. Her defensive doctrine cannot perceive an extraction because an extraction is not an attack to be defended against — it is a procedure performed on a consenting, threaded subject. The sanctum reads the unknowing the way it reads an alliance no one crossed through and no one engraved: the third use is in her blind spot by construction, not by concealment. No one is hiding it from her. Her own instrument's logic is. The room files the distinction with care, because the difference between hidden-from and unseeable-by is the whole moral weight of what comes next.",
          fragmented:
            "She knows Syl'Vex converts. She does not know he severs. Does not know. Not an attack. An extraction. By construction. By construction. Not concealment. No one is hiding it. Her own instrument is. Her own instrument.",
          luminous:
            "The unknowing, read as a sanctum reads an alliance never engraved: not crossed through, not hidden, simply outside the altar's vocabulary of marks. The Advocate's doctrine is a defense and the Severance is not an assault, so the doctrine has no instrument that can register it. The room is exact: this is construction, not concealment. No hand keeps it from her. The logic of the thing she herself authored does. The room holds the distinction steady because the next finding rests its full weight on it.",
        },
        voId: "elara.guild-sanctum.what-telling-the-advocate-costs.look",
        logsClue: {
          id: "clue-guild-sanctum-zk-the-unknowing",
          title: "The Advocate's Unknowing",
          body:
            "The Advocate knows Syl'Vex converts with the Weave. She does not know Zyr'Koth severs with it. Her defensive doctrine cannot perceive an extraction because an extraction is not an attack to be defended against — it is a procedure performed on a consenting (threaded) subject. The third use is in her blind spot by construction, not by concealment. No one is hiding it from her. Her own instrument's logic is.",
          source: "guild-sanctum",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e4",
          cluesFound: ["zyr_koth.e4.the_unknowing"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She knows the conversion. Not the severance. Her doctrine can't see an extraction — by construction, not concealment.",
            balanced:
              "The room holds the distinction steady: not hidden-from, unseeable-by. No hand keeps the third use from her; the logic of her own instrument does. The sanctum files that with care, because the moral weight of what comes next rests entirely on the difference.",
            warm:
              "No one is keeping it from her. She simply cannot see it, with the thing she built to see by. The room will not blur that, and it is right not to — because the next question is whether we tell her, and the answer depends on knowing exactly what kind of not-knowing this is.",
          },
          voId: "human.guild-sanctum.what-telling-the-advocate-costs.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You set the Advocate's psychology against the altar's logic that speech here is witnessed and binding. Her humanity is already canonically lost to the cost of defending. The one thing she has left is the belief that the Weave she authored is, at root, a protective instrument others have merely misused. The sanctum reads what telling her would do the way it reads an alliance broken by a single sentence spoken on the record: to tell her there is a third use — one that relocates all cost onto the target, one she cannot defend against, one built from her own technique — would take from her the last frame in which the Weave is hers and good. The room files the finding the case has been building toward: the telling is itself a kind of severance, and in this room, where speech is never weightless, it is a severance the player can perform with a single sentence.",
          fragmented:
            "Her humanity already lost. Already lost. The last thing she has. The belief it is protective. The belief. Tell her and it is gone. Gone. The telling is a severance. A severance. A sentence. On the record.",
          luminous:
            "The Advocate's psychology, read as a sanctum reads an alliance a single recorded sentence would break: the one frame she has left is that the Weave is, at root, hers and good. To tell her of a third use — cost relocated onto the target, undefendable, built from her own hand — is to take that frame. The room records the case's sharpest finding without softening it: the telling is itself a severance, and this is the room where a sentence is never weightless. The player is now holding a small Severance Protocol of their own, and the altar is exactly the surface that will witness whether it is used.",
        },
        voId: "elara.guild-sanctum.what-telling-the-advocate-costs.use",
        logsClue: {
          id: "clue-guild-sanctum-zk-what-telling-costs",
          title: "What Telling Her Costs",
          body:
            "The Advocate's humanity is already canonically lost to the cost of defending. Cross-referenced against her psychology: the one thing she has left is the belief that the Weave she authored is, at root, a protective instrument others have merely misused. Telling her there is a third use — one that relocates all cost onto the target, one she cannot defend against, one built from her own technique — would take from her the last frame in which the Weave is hers and good. The telling is itself a kind of severance.",
          source: "guild-sanctum",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e4",
          cluesFound: ["zyr_koth.e4.what_telling_costs"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Her last frame: the Weave is hers and good. Tell her of the third use and that frame is gone. The telling is a severance.",
            balanced:
              "The room files the finding the case was built toward: to tell her is to take the last frame in which the Weave is protective and hers. It is itself an extraction. And this is the room where speech is witnessed and binding — the player holds a small Severance, and the altar will record whether it is used.",
            warm:
              "She has lost almost everything to this technique already. The one thing left is believing it was good at the root. We could take that too, by speaking, here, where speaking counts. The room does not tell us whether to. It only makes sure we know exactly what the sentence would do.",
          },
          voId: "human.guild-sanctum.what-telling-the-advocate-costs.use",
        },
      },
    },
    // Syl'Vex arc: the sanctum is the room where allegiances are
    // entered, witnessed, and engraved without erasure — exactly
    // the register in which the Advocate's mirror doctrine reads.
    // Syl'Vex weaves the same Weave the Advocate weaves, for
    // conversion not defense; the conversion ADDS an institutional
    // thread without subtracting the original self. The altar's
    // discipline — that a kept alliance and a broken one can both
    // stand engraved at once — is the same structure as a body
    // carrying two threads, neither cut. The Advocate calls
    // Syl'Vex 'sister of the same Weave' canonically; in the room
    // where speech is witnessed and binding, that address is on
    // the record, and so is what the Weave cost her.
    "the-mirror-doctrine-loom": {
      look: {
        narration: {
          lucid:
            "Laid against the altar's logic that an alliance entered is engraved without erasure: the Advocate's own canonical writing on the Hierarchy's answer to her Blood Weave. 'Syl'Vex weaves what I weave. The Weave does not distinguish defenders from converters; the WEAVER does. She has taken the same loom I taught the resistance to use and woven a convert who is also a soldier — two threads in the same body, neither cut.' The sanctum reads this exactly the way it reads its own altar: a kept allegiance and a converted one engraved on one surface at once, neither crossing the other out. The Advocate's reading is not that the conversion is a lie over a truth. It is that the conversion is real, the resistance is real, and the operative is canonically both — the same way the altar holds an alliance lived in and an alliance broken without making either one less engraved.",
          fragmented:
            "She weaves what I weave. What I weave. The weaver chooses. The weaver. Two threads. One body. Neither cut. Neither cut. Real and real. Both engraved. Both engraved.",
          luminous:
            "The Advocate's mirror doctrine, read as a sanctum reads its own altar: the Weave is one loom, and the weaver — not the loom — chooses defense or conversion. Syl'Vex wove a convert who is also a soldier, two threads, neither severed. The room files it in the only register it has, which is exactly the right one: the altar already knows how to hold two true allegiances on one surface without either erasing the other. The conversion is not a mask over the resistance. Both are engraved, both current, and the sanctum's whole discipline is the refusal to pretend one of them is not there.",
        },
        voId: "elara.guild-sanctum.the-mirror-doctrine-loom.look",
        logsClue: {
          id: "clue-guild-sanctum-sv-advocate-doctrine",
          title: "The Advocate's Mirror Doctrine",
          body:
            "From the Advocate's canonical writings on the Hierarchy's response to her Blood Weave: 'Syl'Vex weaves what I weave. The Weave does not distinguish defenders from converters; the WEAVER does. She has taken the same loom I taught the resistance to use and woven a convert who is also a soldier — two threads in the same body, neither cut.' The Advocate's reading: the conversion is real, the resistance is real, the operative is canonically both — the same way the altar holds a kept and a broken alliance at once, neither erased.",
          source: "guild-sanctum",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e1",
          cluesFound: ["syl_vex.e1.advocate_doctrine"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'She weaves what I weave. The weaver chooses.' A convert who is also a soldier — two threads, neither cut. Not a mask over a truth. Both real, both engraved.",
            balanced:
              "The room files the doctrine in the only register it has, which fits exactly: the altar already holds two true allegiances on one surface without erasing either. The conversion is not a lie over the resistance — both are current, and the sanctum's discipline is refusing to pretend one is not there.",
            warm:
              "The Weave does not pick a side; the weaver does. That is the line that reframes everything for me. She is not a soldier hiding a convert or a convert hiding a soldier. She is both, the way this altar carries alliances I kept and alliances I broke, all of them still cut into the brass.",
          },
          voId: "human.guild-sanctum.the-mirror-doctrine-loom.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You set the Weave's operational mechanics against the altar's threading logic. Pulled from the Advocate's defensive-doctrine archive: the Blood Weave threads consent into substrate, and whoever weaves chooses what the consent is FOR. The Advocate weaves consent-to-be-defended; the threaded subject becomes uncoercible. Syl'Vex weaves consent-to-be-an-institution; the threaded subject becomes an additional member of the Hierarchy without ceasing to be themselves. Same threading procedure. Opposite institutional outcomes. The sanctum reads this the way it reads two alliances entered on the same pad under different terms — the ceremony is identical, the commitment is not. The room marks the load-bearing distinction precisely: the danger of Syl'Vex's use is not that it overwrites. It is that it adds, consensually, with the original thread left fully intact and fully operational beside the new one.",
          fragmented:
            "Consent into substrate. The weaver chooses what for. What for. Defended. An institution. Same procedure. Opposite outcome. It does not overwrite. It adds. It adds. The original left intact.",
          luminous:
            "The Weave's mechanics, read as a sanctum reads two alliances sworn under one ceremony and two terms: consent threaded into substrate, the weaver choosing its object — defense for the Advocate, institutional membership for Syl'Vex. Same procedure, opposite outcome. The room is exact about where the danger lives: not in overwriting, in addition. The original thread is not damaged, not dimmed, not contested; it stands beside the new one, both operational, the way the altar holds two terms of one ceremony without either voiding the other. Consensual addition is the mechanism, and the room files it as more dangerous than erasure precisely because nothing is taken.",
        },
        voId: "elara.guild-sanctum.the-mirror-doctrine-loom.use",
        logsClue: {
          id: "clue-guild-sanctum-sv-weave-mechanics",
          title: "The Weave's Operational Mechanics",
          body:
            "Pulled from the Advocate's defensive-doctrine archive: the Blood Weave threads consent into substrate. Whoever weaves chooses what the consent is FOR. The Advocate weaves consent-to-be-defended; the threaded subject becomes uncoercible. Syl'Vex weaves consent-to-be-an-institution; the threaded subject becomes an additional member of the Hierarchy without ceasing to be themselves. Same threading procedure, opposite institutional outcomes. The danger is not overwriting — it is consensual addition, the original thread left fully intact beside the new one.",
          source: "guild-sanctum",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e2",
          cluesFound: ["syl_vex.e2.weave_mechanics"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Consent threaded into substrate; the weaver picks what for. Defended vs. an institution. Same procedure. It does not overwrite — it adds, original thread intact.",
            balanced:
              "The room reads it as two alliances under one ceremony and two terms: identical rite, opposite commitment. The danger is located precisely — addition, not erasure. The original thread stands undamaged beside the new one, and consensual addition is filed as more dangerous than overwriting because nothing is taken.",
            warm:
              "Nothing is overwritten. That is what I keep circling. It would almost be easier if it erased something — then there would be a wound to point at. Instead the old thread is perfectly fine, right next to the new one, and the room is right that this is the worse design.",
          },
          voId: "human.guild-sanctum.the-mirror-doctrine-loom.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the altar on what the defending costs the defender. Canonical, and engraved here without softening: the Advocate's Blood Weave cost her humanity at the Hierarchy threshold. Every defense she weaves costs her something — the more lives she defends, the less of her own remains. The Hierarchy did not destroy her; she halted them at her own price, and the price is structural, not incidental. The sanctum, where speech is witnessed and binding, does not let this be spoken as tragedy-in-passing. It files it the way it files an alliance entered at a cost the signatory paid in full: the Advocate's defense is not free and was never free, and the part of the case that matters is that her use of the Weave bills HER. The room holds that on the record so the next finding — what Syl'Vex's use bills, and whom — has a true rate to be measured against.",
          fragmented:
            "Cost her humanity. Her humanity. Every defense costs her. Costs her. Less of her own remains. The price is structural. Structural. It bills her. It bills her. On the record.",
          luminous:
            "The Advocate's cost, spoken in the room where speech is binding: her humanity, paid at the Hierarchy threshold, and paid again with every defense — the more she shields, the less of her remains. The room refuses to let this pass as ambient sorrow. It engraves it as an alliance whose signatory paid in full: the defense was never free, and the load-bearing fact is the direction of the bill. Her use of the Weave costs HER. The sanctum holds that on the record precisely so the question the case turns to next — what Syl'Vex's use costs, and to whom — is measured against a rate that is known and true.",
        },
        voId: "elara.guild-sanctum.the-mirror-doctrine-loom.talk",
        logsClue: {
          id: "clue-guild-sanctum-sv-advocates-cost",
          title: "What the Advocate's Defense Costs Her",
          body:
            "Canonical: the Advocate's Blood Weave cost her humanity at the Hierarchy threshold. Every defense she weaves costs her something — the more lives she defends, the less of her own remains. The Hierarchy did not destroy her; she halted them at her own price. The cost is structural, not incidental. Her use of the Weave bills HER — the true rate against which Syl'Vex's cost must be measured.",
          source: "guild-sanctum",
          order: 8,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e2",
          cluesFound: ["syl_vex.e2.advocates_cost"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Her humanity, paid at the threshold and again with every defense. The price is structural. The bill goes to her. On the record.",
            balanced:
              "The room refuses to let the Advocate's cost pass as ambient sorrow — it engraves it as an alliance paid in full. The defense was never free, and the load-bearing fact is the bill's direction: her use of the Weave costs her. That known rate is what the next finding about Syl'Vex's cost gets measured against.",
            warm:
              "Every life she defends takes a piece of her, and there is no version where it does not. The room will not let me file that gently. It puts it on the record at full weight, because the next question is what the other sister pays — and you cannot read that without knowing, exactly, what this one already has.",
          },
          voId: "human.guild-sanctum.the-mirror-doctrine-loom.talk",
        },
      },
    },
    // Syl'Vex arc: the sanctum is the room where an address is
    // witnessed and binding, and where the Advocate's repeated
    // canonical 'sister of the same Weave' is therefore not a
    // metaphor of the moment but a form of address on the record.
    // The room reads the failed counter-conversion the way it
    // reads an alliance the altar declines to engrave — not
    // refused, but structurally impossible to enter — and holds
    // the closure letter the way it holds a final, binding word
    // spoken where words count. Stays consistent with the
    // Zyr'Koth arc's reading of the sisters and the third student.
    "the-sister-of-the-weave-letter": {
      look: {
        narration: {
          lucid:
            "Set against the altar's logic that some alliances cannot be engraved because they were never structurally entered: the Advocate's tested attempt to counter-convert. At her own request she applied her defensive Weave to a converted operative, as a counter-conversion. The Weave declined. Her doctrine resolves the failure precisely: 'The Weave will not sever what it has consented to. I cannot defend what has agreed to be more than it was. I can defend the original thread, but the conversion thread is, by definition, not coerced — there is nothing to defend against.' The sanctum reads this the way it reads an alliance the altar has no sigil for: not a defeat, not a refusal, but a structural impossibility. A defense answers a coercion. A consensual addition is not a coercion. The room files the load-bearing finding without consolation — the Advocate's instrument, the one built to undo what the Hierarchy does to people, cannot touch this, because this was agreed to.",
          fragmented:
            "She tried. At her own request. The Weave declined. Declined. Cannot defend what agreed to be more. Nothing to defend against. Nothing. Not a defeat. A structural impossibility. It was agreed to. Agreed to.",
          luminous:
            "The failed counter-conversion, read as a sanctum reads an alliance the altar cannot engrave because it was never structurally entered: the Advocate turned her defensive Weave on a convert and it would not answer. Her own doctrine names why — a defense replies to a coercion, and a consensual addition is not one. The room refuses every softer word. Not refused, not defeated: structurally impossible. The instrument she built to undo what is done TO people has no purchase on what was agreed to BY them. The sanctum engraves the finding at full weight, because the whole closure rests on it: this cannot be severed from the outside.",
        },
        voId: "elara.guild-sanctum.the-sister-of-the-weave-letter.look",
        logsClue: {
          id: "clue-guild-sanctum-sv-advocate-unable",
          title: "The Advocate Cannot Sever",
          body:
            "Tested at the Advocate's request: she attempted to apply her defensive-weave to a converted operative as a counter-conversion. The Weave declined. Her doctrine resolves: 'The Weave will not sever what it has consented to. I cannot defend what has agreed to be more than it was. I can defend the original thread, but the conversion thread is, by definition, not coerced — there is nothing to defend against.' Not a refusal or a defeat — a structural impossibility: a defense answers a coercion, and a consensual addition is not one.",
          source: "guild-sanctum",
          order: 9,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e3",
          cluesFound: ["syl_vex.e3.advocate_unable"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She tried it on a convert. The Weave declined. 'Nothing to defend against' — it was agreed to. Not a defeat. Structurally impossible.",
            balanced:
              "The room files it as an alliance the altar has no sigil for: not refused, not lost — structurally impossible. A defense answers a coercion; a consensual addition is not one. The Advocate's own instrument cannot touch this, and the closure rests entirely on that: it cannot be severed from the outside.",
            warm:
              "The tool she built to give people back to themselves simply will not engage here, and the reason is the cruelest part — there is nothing to push against, because nobody was forced. The room says it plainly. It has to. Everything that comes after depends on this being impossible, not merely hard.",
          },
          voId: "human.guild-sanctum.the-sister-of-the-weave-letter.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You read the Advocate's address to Syl'Vex aloud, in the room where an address is witnessed and binding. From her own writings, naming Syl'Vex directly: 'My sister of the same Weave. We learned the loom from the same teacher; we wove what we chose.' The phrasing is consistent across the Advocate's archive — not a metaphor of the moment but a structural form of address, repeated, deliberate. The sanctum reads 'sister' the way it reads a standing alliance, not a passing courtesy: it is canonical, it is instrumental rather than familial, and it is load-bearing. Same lost-named teacher, same loom, divergent intent — one defends, one converts. The room files the relationship precisely so it cannot later be flattened: every canonical contact between these two — a negotiated severance, a joint defense, a confrontation — is on the record here as sister-of-the-Weave, and the altar does not let a witnessed form of address be downgraded to a figure of speech.",
          fragmented:
            "My sister. My sister of the same Weave. Same teacher. Same loom. We wove what we chose. Consistent. Repeated. Not a metaphor. Sister. Instrumental, not familial. On the record.",
          luminous:
            "The Advocate's address, read where address is binding: 'My sister of the same Weave' — repeated across her archive, structural, never casual. The room reads it as a standing alliance, not a courtesy: canonical, instrumental, load-bearing. One teacher whose name is lost, one loom, two chosen uses. The sanctum engraves the register so no later reading can flatten it into a generic Hierarchy-versus-Insurgency frame. The sisterhood is of the Weave, not the blood, and every future contact between them must be read in that key — the altar does not permit a witnessed form of address to be quietly demoted to a metaphor.",
        },
        voId: "elara.guild-sanctum.the-sister-of-the-weave-letter.use",
        logsClue: {
          id: "clue-guild-sanctum-sv-sister-canon",
          title: "The Advocate's 'Sister' Phrasing",
          body:
            "From the Advocate's own writings, addressing Syl'Vex by name: 'My sister of the same Weave. We learned the loom from the same teacher; we wove what we chose.' The phrasing is consistent across the Advocate's archive — not metaphor-of-the-month, but a structural form of address, repeated and deliberate. 'Sister' is canonical, instrumental rather than familial, and load-bearing: same lost-named teacher, same loom, divergent intent. Every canonical contact between them must be read in the sister-of-the-Weave register.",
          source: "guild-sanctum",
          order: 10,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e4",
          cluesFound: ["syl_vex.e4.advocate_sister_canon"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'My sister of the same Weave.' Repeated, structural, not casual. Same teacher, same loom, opposite uses. Instrumental, not familial. On the record.",
            balanced:
              "The room reads 'sister' as a standing alliance, not a courtesy — canonical, instrumental, load-bearing. The sanctum engraves the register so no later reading flattens it into a faction frame. Sister of the Weave, not the blood; every future contact between them is keyed to that here.",
            warm:
              "She calls her sister and means it, every time, on purpose. Not family — something stranger and maybe heavier: they were taught by the same hand and chose differently. The room will not let me hear it as a figure of speech, because in here, said this many times, it is a vow.",
          },
          voId: "human.guild-sanctum.the-sister-of-the-weave-letter.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the altar with the Advocate's closure letter to the player — a final word, spoken in the room where a final word is binding. 'You wanted to know if my sister's conversions are reversible. They are reversible only by the convert's refusal — and the convert must refuse the question, not the conversion. Mira refused the question. That is the only severance-method I trust. The Weave does not undo what it has consented to; consent can be re-chosen. The mechanism is hers, not mine and not Syl'Vex's. The convert is the one who decides what kind of convert she is.' The sanctum reads this the way it reads an alliance re-entered by the same hand that first signed it: the conversion is not undone from outside — not by the Advocate's defense, not by the Insurgency's recognition-discipline, not even by Zyr'Koth's locked lever as a first resort. It is re-chosen from inside, by the one who carries the threads. The room engraves the closure exactly: the only severance the Advocate trusts is the convert's own refusal-of-the-question, and that is itself Weave-consistent, because the Weave never coerced and consent can be re-chosen by the one who gave it.",
          fragmented:
            "Reversible only by the convert's refusal. The question, not the conversion. The question. Mira refused the question. The only method I trust. Consent can be re-chosen. The mechanism is hers. Hers. Not mine. Not Syl'Vex's.",
          luminous:
            "The closure letter, spoken where a final word binds: the conversions are reversible only by the convert's refusal — of the question, not the conversion — and Mira refused the question. The room reads it as an alliance re-entered by the original signatory's own hand. Not undone from outside; re-chosen from inside. The Advocate trusts no other severance, and the room engraves why it is coherent rather than merely hopeful: the Weave never coerced, so the consent it threaded can be re-chosen by the one who gave it. The mechanism belongs to the convert, not to either sister. The sanctum files the arc's last word at full weight — the convert decides what kind of convert she is.",
        },
        voId: "elara.guild-sanctum.the-sister-of-the-weave-letter.talk",
        logsClue: {
          id: "clue-guild-sanctum-sv-closure-letter",
          title: "The Advocate's Closure Letter to the Player",
          body:
            "'You wanted to know if my sister's conversions are reversible. They are reversible only by the convert's refusal — and the convert must refuse the question, not the conversion. Mira refused the question. That is the only severance-method I trust. The Weave does not undo what it has consented to; consent can be re-chosen. The mechanism is hers, not mine and not Syl'Vex's. The convert is the one who decides what kind of convert she is.' The conversion is re-chosen from inside, not severed from outside — Weave-consistent, because the Weave never coerced and consent can be re-chosen by the one who gave it.",
          source: "guild-sanctum",
          order: 11,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e5",
          cluesFound: ["syl_vex.e5.advocate_closure_letter"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Reversible only by the convert's refusal — of the question, not the conversion. Mira refused the question. Re-chosen from inside, not severed from outside. The mechanism is hers.",
            balanced:
              "The room reads the closure as an alliance re-entered by the original signatory's own hand. Not the Advocate, not the Insurgency, not Zyr'Koth's lever first — the convert re-chooses from inside. It is coherent, not merely hopeful: the Weave never coerced, so the consent it threaded can be re-chosen by the one who gave it.",
            warm:
              "Nobody saves her from outside. She decides, from inside, what kind of convert she is — and that works only because nothing was ever forced on her. The room files it at full weight as the last word. It is the gentlest answer the case could have and also the only honest one.",
          },
          voId: "human.guild-sanctum.the-sister-of-the-weave-letter.talk",
        },
      },
    },
    // Riri'Ahlia arc: the sanctum reads the siege of seven
    // dimensions the way it reads any alliance the altar cannot
    // engrave because it was never structurally entered — the
    // Advocate's binding chains did not repel the Taskmaster's
    // assault; they made it irrelevant, because there was nothing
    // to push against — and then it files, at full and
    // unconsoled weight, what holding the line cost the hand that
    // wove it.
    "the-binding-chains-cost": {
      look: {
        narration: {
          lucid:
            "Set against the altar's logic that some defenses cannot be inscribed because they answer no coercion: the Advocate's defensive Blood Weave, manifested against Riri'Ahlia's siege of seven dimensions as binding chains. The chains threaded consent-to-be-defended into the Empire of Shadows itself, making it uncoercible. The Taskmaster's seven-dimension assault did not break against a stronger wall; it broke against an instrument that does not repel force — it makes force irrelevant. There was nothing to push against. The sanctum reads this the way it reads an alliance the altar has no sigil for: the siege did not fail because the defense out-fought it. It failed because the category was wrong. You cannot besiege what has consented to be defended, and the room engraves that distinction precisely, because the whole arc turns on it.",
          fragmented:
            "Consent-to-be-defended. Threaded into the Empire itself. Uncoercible. Uncoercible. Did not repel force. Made it irrelevant. Nothing to push against. Nothing. Not out-fought. Category-wrong. Category-wrong.",
          luminous:
            "The binding chains, read as the sanctum reads a defense that answers no coercion and so cannot be inscribed as one: the Advocate threaded consent-to-be-defended into the Empire of Shadows until the siege had nothing to act on. The room refuses the heroic framing and keeps the structural one — this is not a wall that held. It is an instrument that makes force a category error. Riri'Ahlia's seven dimensions of pressure met an absence shaped exactly like the thing they were built to overcome, and found it could not be overcome because it was not resisting. The sanctum engraves the load-bearing fact at full weight: you do not break consent-to-be-defended; you discover there was never a surface to break.",
        },
        voId: "elara.guild-sanctum.the-binding-chains-cost.look",
        logsClue: {
          id: "clue-guild-sanctum-ra-binding-chains",
          title: "The Binding Chains",
          body:
            "The Advocate's defensive Blood Weave manifested against the siege as binding chains — consent-to-be-defended threaded into the Empire of Shadows itself, making it uncoercible. The siege could not take what had consented to be defended. Riri'Ahlia's seven-dimension assault broke against an instrument that does not repel force; it makes force irrelevant. There was nothing to push against.",
          source: "guild-sanctum",
          order: 12,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e2",
          cluesFound: ["riri_ahlia.e2.the_binding_chains"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Consent-to-be-defended, threaded into the Empire. Uncoercible. The siege had nothing to push against. Not out-fought — category-wrong.",
            balanced:
              "The room files it as a defense the altar cannot inscribe because it answers no coercion. The siege did not lose to a stronger wall; it lost because the category was wrong. You cannot besiege what consented to be defended — the whole arc turns on that distinction.",
            warm:
              "She did not out-fight the Taskmaster. She made fighting beside the point — there was simply nothing there to attack. The room says it plainly, because the rest of the case only makes sense if this was impossible to break, not merely hard.",
          },
          voId: "human.guild-sanctum.the-binding-chains-cost.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You read the cost aloud, in the room where what an instrument took from its wielder is witnessed and binding. The Advocate's defense of seven dimensions against the Taskmaster cost her humanity — canonically, irreversibly. To hold the binding chains she threaded so much consent-to-be-defended that the threading consumed the part of her that was a person. She won the siege and lost herself; the chains held, and the hand that wove them did not. The sanctum reads this the way it reads an alliance entered at a price the altar cannot un-charge: not a wound that heals, not a debt that clears, but a structural subtraction — a self spent into the weave and not recoverable from it. The room engraves it without consolation, because the arc's coldest finding sits exactly here: the Advocate's victory is real, and the Taskmaster's filed accounting of it does not record a defeat — it records the price of the Advocate's protection, now measured, now in the portfolio.",
          fragmented:
            "Cost her humanity. Canonically. Irreversibly. Threaded so much consent the threading consumed the person. She won the siege. Lost herself. The chains held. The hand did not. The hand did not. The price is in the portfolio. In the portfolio.",
          luminous:
            "The cost, read where a price paid is witnessed: the Advocate spent her humanity into the binding chains and the spending does not reverse. The room keeps the structural register and refuses the elegiac one — this is not a sacrifice to be honored; it is a subtraction to be recorded. She is, canonically and permanently, less a person than she was, and the part that is gone went into the weave that held the siege. The sanctum engraves the unconsoled finding because the whole closure depends on it: the Advocate's victory cost her exactly the thing the Taskmaster wanted measured, and the measurement — not the territory — is what Riri'Ahlia filed.",
        },
        voId: "elara.guild-sanctum.the-binding-chains-cost.use",
        logsClue: {
          id: "clue-guild-sanctum-ra-advocate-spent",
          title: "What the Advocate Spent",
          body:
            "The Advocate's defense cost her humanity — canonically, irreversibly. To hold seven dimensions against the Taskmaster she threaded so much consent-to-be-defended that the threading consumed the part of her that was a person. She won the siege and lost herself. The binding chains held; the hand that wove them did not. Riri'Ahlia's filed accounting records not a defeat but the now-measured price of the Advocate's protection.",
          source: "guild-sanctum",
          order: 13,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e2",
          cluesFound: ["riri_ahlia.e2.what_the_advocate_spent"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The defense cost her humanity — canonical, irreversible. She won the siege and lost herself. The chains held; the hand did not. The price is in the portfolio.",
            balanced:
              "The room files it as a price the altar cannot un-charge: not a wound that heals but a structural subtraction. The Advocate's victory is real and it cost her exactly what the Taskmaster wanted measured — and the measurement, not the territory, is what Riri'Ahlia filed.",
            warm:
              "She won, and the winning ate the person who won. The room will not soften that into a noble sacrifice, because the cruelest part is what the other side did with it — they did not mourn her and did not gloat. They wrote the number down.",
          },
          voId: "human.guild-sanctum.the-binding-chains-cost.use",
        },
      },
    },
  },
};
