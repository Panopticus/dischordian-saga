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
  | "what-telling-the-advocate-costs";

export const GUILD_SANCTUM_MYSTERY: RoomMysteryModule<GuildSanctumHotspotId> = {
  roomId: "guild-sanctum",
  responses: {
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
  },
};
