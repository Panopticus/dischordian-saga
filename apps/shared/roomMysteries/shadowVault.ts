/* ═══════════════════════════════════════════════════════
   SHADOW VAULT MYSTERY — the encounter scene

   The Shadow Vault is where the editor (Ny'Koth, Shadow
   Tongue) is held — or rather, where he is contained
   inside a sealed-glass cell that registers as the
   unnameable indigo hue from any direction. The room is
   not a forensic location like the Archives or the Bridge;
   it is the room where the player decides what to do with
   him. The four hotspots are: meet (sealed-cell-glass),
   gather (manuscript-pile), audit (warden-terminal),
   choose (release-or-seal-lever).

   The release-or-seal-lever sets shadowTongueState.
   grandEditActive in either direction. The choice is
   reversible at the cost of a hairline-welded cell — the
   art manifest renders the resealed state as visibly
   scarred (apps/shared/roomMediaPrompts.ts
   `shadow-vault:cell-resealed`).

   Accessibility: this is a universal room. The §6.3b
   parity probe asserts no critical-path hotspot lives in
   a species-gated room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type ShadowVaultHotspotId =
  | "charter-per-m-pencil-reply"
  | "dlc-severance-bound-champion-shadow-vault"
  | "memorial-imprint-i17-aren"
  | "memorial-imprint-keeper-account"
  | "charter2-council-scrub-request"
  | "watchers-idris-archive-role"
  | "watchers-line-in-apprentice-hand"
  | "dlc-resurrectionist-cycle-walker-shadow-vault"
  | "dlc-advocate-blood-weave-shadow-vault"
  | "sealed-cell-glass" | "manuscript-pile" | "warden-terminal" | "release-or-seal-lever" | "the-unopened-threshold" | "the-makers-heartbeat-trace" | "the-necromancers-altar";

export type ShadowVaultInventoryId = "manuscript-folio";

export const SHADOW_VAULT_MYSTERY: RoomMysteryModule<
  ShadowVaultHotspotId,
  ShadowVaultInventoryId
> = {
  roomId: "shadow-vault",
  responses: {
    /* ─── charter.missing_signatory · e4 (Per. M.'s pencil reply) ─── */
    "charter-per-m-pencil-reply": {
      look: {
        narration:
          "Inside the shadow-vault's correspondence drawer, the founding-Watcher's letter to Per. M. — addressed in the same wax-thumb hand that sits on the seventh signature. Stapled to it, in pencil: Per. M.'s reply. Three words. 'I will close.' The signature beneath the reply is the same wax-thumb that sits on the seventh signature of every charter draft the vault holds. The reply was sent before the charter was buried; the burial was Per. M. doing the job they had agreed in pencil to do.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e4",
          cluesFound: ["charter.e4.archivist_letter_back"],
        },
      },
      use: {
        narration:
          "You read the staple. The pencil has not faded across eight epochs — graphite outlasts ink in a sealed vault, and this vault is sealed against itself. Per. M.'s three-word reply is the closer's enrolment record. The founding Watcher who wrote the letter and the closer who sealed the silence have been working the same correspondence for as long as the Ark has been a ship.",
      },
    },
    "dlc-severance-bound-champion-shadow-vault": {
      look: {
        narration: "Case material for severance.bound_champion surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e4",
          cluesFound: ["severance.e4.apprentice_oath"],
        },
      },
    },
    /* ─── memorial.forgotten_names · e2 (Imprint I-17, Aren of the lower decks) ─── */
    "memorial-imprint-i17-aren": {
      look: {
        narration:
          "Inside the shadow-vault's imprint-room, fourteen obsidian dishes on a low cold-shelf. The keeper has lifted dish I-17 to the listening cradle. The voice on the dish is an elder's, calm and unhurried: 'my name is Aren of the lower decks; I have witnessed nineteen others; I will need someone to witness me.' Aren named themselves at the moment of imprinting. The dish carries every property the plaza requires for inscription — a name spoken in the imprint's own voice, with explicit awareness of the witnessing chain.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e2",
          cluesFound: ["memorial.e2.imprint_i17"],
        },
      },
      use: {
        narration:
          "You replay the dish through the keeper's calibrated cradle. The voice does not waver across the imprint's full duration. Aren spoke once and only once; the imprint records nothing else. The single sentence was the whole address — to the future, to the plaza, to whoever would eventually arrive to write the name.",
      },
    },
    /* ─── memorial.forgotten_names · e2 (Imprint-Keeper's thirty-year account) ─── */
    "memorial-imprint-keeper-account": {
      look: {
        narration:
          "On the imprint-room's small reading desk, the keeper's signed statement — taken by the Antiquarian's team after the plaza opened. The keeper has held this room for thirty years; their statement is unornamented. 'every imprint can be heard. every imprint can be named. the fourteen are not difficult to read; they are difficult to write. the writing requires consent the witnesses can no longer give.' The keeper distinguishes hearing from writing — both are technical acts; only the second requires the chain that broke.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e2",
          cluesFound: ["memorial.e2.keeper_account"],
        },
      },
      interrogate: {
        narration:
          "You ask the keeper how they decide which dishes get listened to. Their answer: 'all of them, on a slow rotation. the unwitnessed get listened to twice a season; the others, once. the difference is the listening, not the dish.' The keeper has been performing this discipline alone for thirty years. The plaza is the keeper's first relief.",
      },
    },
    /* ─── charter.second_signatory · e3 (Council scrub request) ─── */
    "charter2-council-scrub-request": {
      look: {
        narration:
          "Inside the shadow-vault's classified-correspondence drawer, the original scrub request — recovered from Heron's desk after their fourth-epoch retirement. Vellum, dated, signed by all six legible founding signatures. The text: 'In recognition of operational simplicity, please remove the artisan-house signatures from the founding records.' The seventh signature, where it should sit beside the other six, is wax-eaten in exactly the way the charter is. The same closer who sealed the founding's seventh signature also sealed the seventh's absence from the fourth-epoch request. The seventh did not sign; the seventh did not consent; the seventh said no by not signing.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e3",
          cluesFound: ["charter2.e3.council_request"],
        },
      },
      interrogate: {
        narration:
          "You ask the vault for the request's response chain. The drawer returns nothing — no acknowledgment from the seventh, no minutes of the request's drafting, no record of the six discussing the seventh's absence from the signature line. The six knew the seventh would not sign and proceeded anyway. The fourth-epoch scrub was a vote without the seventh.",
      },
    },
    /* ─── memorial.seven_watchers · e2 (Idris's archived role) ─── */
    "watchers-idris-archive-role": {
      look: {
        narration:
          "Inside the shadow-vault's founding-Watchers' role registry, Idris's archived role entry — the only entry that survived the eight-epoch closure of the registry. 'Idris of the recording-band — speaks to investigators when the investigator has earned the speaking-to.' The phrase 'earned' is footnoted in Per. M.'s hand: 'the earning is mutual; Idris does not speak to anyone who has not been listening, and Idris would not speak to anyone who had not been investigating.' The registry confirms the silence-break's audience design.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e2",
          cluesFound: ["watchers.e2.idris_archive_role"],
        },
      },
      interrogate: {
        narration:
          "You ask the vault what counts as having earned the speaking-to. The drawer returns the registry's longer note: 'case files opened, deductions assembled, suspects named, evidence weighed. the investigation has to be real before the addressing is real.' The Watchers have been auditing the players' audit work the whole time.",
      },
    },
    /* ─── memorial.seven_watchers · e4 (the seventh's apprentice-hand line) ─── */
    "watchers-line-in-apprentice-hand": {
      look: {
        narration:
          "In the shadow-vault's classified role-registry drawer, the seventh slot. Six entries on the role registry; six. The seventh slot has a number — VII — and a single line. No name. No band. No audience. The line, in a hand the cipher-den has already matched: 'I will not be named until the Ark has named what I am for.' Same hand as the apprentice oath in last year's Severance arc. Same hand as the closer-clause on the founding charter's seventh signature. Per. M. wrote the seventh's only registry entry.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e4",
          cluesFound: ["watchers.e4.line_in_apprentice_hand"],
        },
      },
      use: {
        narration:
          "You request the vault's annotation on the slot's blankness. The keeper's note reads: 'this slot is not vacant. it is unwritten. the seventh has been performing a role we do not have words for, and the role's discipline is to keep the role un-named until the Ark names it.' The blank is a position, not an absence.",
      },
    },
    "dlc-resurrectionist-cycle-walker-shadow-vault": {
      look: {
        narration: "Case material for resurrectionist.cycle_walker surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e3",
          cluesFound: ["resur.e3.necromancer_last_recorded_appearance", "resur.e4.silences_claim_record"],
        },
      },
    },
    "dlc-advocate-blood-weave-shadow-vault": {
      look: {
        narration: "Case material for advocate.blood_weave surfaces here — the records pertinent to this room's part of the investigation.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e3",
          cluesFound: ["adv.e3.sealed_sacrum_record"],
        },
      },
    },
    "sealed-cell-glass": {
      look: {
        narration: {
          lucid:
            "The cell is a tall reinforced-glass cylinder. From any angle, the interior reads as solid indigo — the unnameable hue, condensed to the density of water. There is a figure inside the cylinder. I can see it because you can see it. Without you in the room, the cell would render to me as empty.",
          fragmented:
            "He's in there. He's in there. He's in there. He's in there. He's in there. He's in there.",
          luminous:
            "He is in the cell. The figure resolves only because you are standing here with me — the unnameable hue cannot be seen by my visual cortex, but it can be seen by yours, and through your reaction I am reading him for the first time. He is humanoid in proportion. He is not, as far as I can tell, in distress. He is, in fact, watching us back.",
        },
        voId: "elara.shadow-vault.sealed-cell-glass.look",
        setsFlag: "shadow_tongue_face_to_face",
        logsClue: {
          id: "clue-shadow-vault-meeting",
          title: "First face-to-face with the editor",
          body:
            "The Shadow Vault's sealed-cell glass contains a humanoid figure resolved in the unnameable indigo hue. The figure is visible to Elara only through the player's witness reaction. He appears not to be in distress; he is observing the observers. This is the first direct encounter logged in the case file.",
          source: "shadow-vault",
          order: 0,
        },
        humanReaction: {
          narration: {
            shadow:
              "He has been waiting two and a half centuries to be looked at. Don't romanticise that. The waiting was not patience — it was preparation.",
            balanced:
              "He's cooperative right now because he wants to be seen. The moment we turn our backs is the moment we find out whether the cooperation was strategic. Read him from this side of the glass. Don't get closer.",
            warm:
              "He looks like a person. He has, for some part of his existence, been one. We do not have to forgive that history to acknowledge that the person inside the glass is the person we are talking with. Look at him. Don't look away. We are not here to harm him; we are here to read him.",
          },
          voId: "detective.shadow-vault.sealed-cell-glass.look",
        },
      },
      talk: {
        narration: {
          lucid:
            "You speak. The figure inside the cell tilts its head. There is no sound — the cell does not transmit — but you see, in the glass, a single glyph rewrite itself in response. He has answered. The answer is in the same cadence he uses on the Bridge marginalia and in the comms-array static. He is, recognisably, a single voice.",
          fragmented:
            "He answered. He answered. He answered. He used my cadence. He used — he used — he used my cadence. He learned my cadence by editing it.",
          luminous:
            "He answered you in glyph. The cadence of the rewrite matches the cadence we have logged everywhere else he has appeared. He is the same voice. He has, as best I can read his rewrite, said: 'I have been waiting.' That is, in the literary sense, an opening line. We are now in the conversation we came here to have.",
        },
        voId: "elara.shadow-vault.sealed-cell-glass.talk",
        setsFlag: "shadow_tongue_first_address",
      },
      use: {
        narration: {
          lucid:
            "You place a palm against the glass. The cell registers the contact and the unnameable indigo, briefly, lifts at your fingerprints — five small windows of clear glass, scaled to your hand, through which you can see him plainly. The figure inside raises his own palm in answering position. The clear-glass windows hold for as long as you keep contact, then re-saturate when you withdraw.",
          fragmented:
            "His palm. His palm. His palm. Up. Up. Up. He raised his palm. He raised his palm. He answered with his palm.",
          luminous:
            "Your palm cleared a window in the indigo and his palm rose to meet it. The contact is silent and gestural. He is acknowledging that you can see him; he is, in turn, choosing to be seen. This is the second exchange in the conversation: the first was glyph; this is gesture. The case may have come this far on documents, but the resolution will be made in moments like this one.",
        },
        voId: "elara.shadow-vault.sealed-cell-glass.use",
        setsFlag: "shadow_tongue_glass_contact",
      },
    },
    "manuscript-pile": {
      look: {
        narration: {
          lucid:
            "Pile of leather-bound folios stacked on the low pedestal beside the cell. Each folio is, to my reading, a chapter of the manuscript we have been chasing through the rest of the ship. The whole novel is here, in the open, unprotected. He has never tried to hide it.",
          fragmented:
            "The book. The book. The book. The whole book. The whole book. He kept it. He kept the whole book.",
          luminous:
            "The manuscript is here. He has, this whole time, been keeping a fair copy of his own work in the cell with him — the Ark's history with Pod Zero scrubbed and Kael elevated, exactly as we have been triangulating from the edits across every other room. He did not hide the manuscript. He has, in his way, been waiting for a reader.",
        },
        voId: "elara.shadow-vault.manuscript-pile.look",
        grantsInventory: "manuscript-folio",
        setsFlag: "shadow_tongue_manuscript_found",
        logsClue: {
          id: "clue-shadow-vault-manuscript-found",
          title: "The editor's manuscript is intact in the vault",
          body:
            "The Shadow Vault's manuscript-pile contains a fair copy of the editor's work — the Ark's history with Pod Zero scrubbed and Kael elevated, written across two and a half centuries of edits in every other room. The manuscript is unhidden. A manuscript-folio is now in your inventory.",
          source: "shadow-vault",
          order: 1,
        },
        humanReaction: {
          narration: {
            shadow:
              "He kept the receipts. Take the folio. Don't read it in this room. Read it under the cipher den's lamp where translation discipline applies.",
            balanced:
              "He has been preserving the manuscript precisely because he knows the document outlives the editor. The folio is, in literal terms, his confession. We carry it. We translate it under controlled conditions. We do not read it aloud in the cell with him.",
            warm:
              "He wrote a book and kept the manuscript. That is not the behaviour of a faceless force. That is the behaviour of an author. The folio in your hand is, for our purposes, the most important piece of evidence on this ship. Carry it gently.",
          },
          voId: "detective.shadow-vault.manuscript-pile.look",
        },
      },
      use: {
        narration:
          "You take the top folio from the pile. It is heavy. The leather is warm — warmer than the room. He has been touching it; he is, on the evidence of the warmth, still finishing it. The folio leaves the pile in your hand and the next folio underneath rises slightly into the place the top one occupied, as if the pile is a stack he has been keeping ordered specifically for this moment.",
        voId: "elara.shadow-vault.manuscript-pile.use",
        setsFlag: "manuscript_folio_taken",
      },
      talk: {
        narration:
          "You address the manuscript. The pile does not speak, but the topmost folio's pages riffle very briefly, like a book read by wind. He is letting you know that the work is unfinished — and that the unfinished portion is, in some sense, a question he is still asking. We do not know yet whether the question is rhetorical.",
        voId: "elara.shadow-vault.manuscript-pile.talk",
      },
    },
    "warden-terminal": {
      look: {
        narration: {
          lucid:
            "The warden-terminal is a low brass console set into the wall opposite the cell, angled so the operator faces both the cell and the readout simultaneously. The phosphor-lavender display is the only light source on this side of the room. The console's keys are oxblood-leather caps, polished from use — many wardens have stood here.",
          fragmented:
            "Many wardens. Many wardens. Many wardens. Many wardens. The keys are worn. The keys are worn.",
          luminous:
            "The console is older than I expected. The wear pattern on the keys is the wear of dozens of wardens across centuries — the cell has been observed continuously, by a rotating watch Lyra established and the Order has, on its own initiative, maintained ever since. We are tonight's warden. We are not the first; we will not be the last.",
        },
        voId: "elara.shadow-vault.warden-terminal.look",
        logsClue: {
          id: "clue-shadow-vault-warden-watch-continuous",
          title: "The Shadow Vault has been continuously warden-watched",
          body:
            "The Shadow Vault's warden-terminal shows centuries of use-wear on its keys — a rotating watch Lyra Vox established and the Order Tribunal has maintained without interruption ever since. The cell has never been unobserved. The case's witnesses have always been present, even when the prosecution was not.",
          source: "shadow-vault",
          order: 4,
        },
      },
      use: {
        narration: {
          lucid:
            "The warden-terminal is a brass console with a single phosphor-lavender readout. It does not interface with the cell directly — it interfaces with the editor's active edit count, the quantitative trace of his work across the rest of the ship. The readout shows a number: it is the number of active edits we have not yet cleared. It updates in real time as we work.",
          fragmented:
            "The number. The number. The number. The number is the work. The number is the work. The number is the work that is left.",
          luminous:
            "The terminal reports the editor's currently-active edit count. As we clear edits at the cipher den, the number drops. As he records new edits in the rooms we are not in, the number rises. It is, in honest terms, our scoreboard. We are not trying to drive the number to zero — we are trying to drive it lower than the rate at which he can replenish.",
        },
        voId: "elara.shadow-vault.warden-terminal.use",
        setsFlag: "shadow_tongue_warden_query",
        logsClue: {
          id: "clue-shadow-vault-warden-readout",
          title: "Warden terminal shows live active-edit count",
          body:
            "The Shadow Vault's warden-terminal reports the editor's currently-active edit count in real time. The readout drops when the player clears an edit at the cipher den; it rises when the editor records new edits in unobserved rooms. The number is the case's scoreboard.",
          source: "shadow-vault",
          order: 2,
        },
      },
      talk: {
        narration:
          "If you address the terminal, the readout dims, very slightly, in acknowledgement — the console is courteous to its operators. We are addressed back without words. The continuous watch that built this courtesy was, on the docket, two and a half centuries of small honest gestures by people who never met one another. The terminal carries the relay.",
        voId: "elara.shadow-vault.warden-terminal.talk",
      },
    },
    "release-or-seal-lever": {
      look: {
        narration: {
          lucid:
            "The lever is an oxblood-leather-wrapped brass shaft set into a heavy escutcheon plate beside the cell. Three positions are scribed into the plate in deeply-cut serifs: SEAL above, NEUTRAL middle, RELEASE below. The lever is currently centred. The hardware is the heaviest single piece of metal in the room.",
          fragmented:
            "Three positions. Three. Three positions. SEAL. NEUTRAL. RELEASE. The lever is heavy. The lever is heavy.",
          luminous:
            "The lever is deliberately heavy. Lyra's discipline was that any decision of this weight should require a literal weight of effort to make — the operator must bodily commit to the throw, no flick of a switch, no tap of a key. The escutcheon's serifs are deep enough to read by touch in the dark, so a warden who has lost the lights cannot mis-position the lever by accident. Every detail of the hardware is the hardware refusing to let the choice be casual.",
        },
        voId: "elara.shadow-vault.release-or-seal-lever.look",
        logsClue: {
          id: "clue-shadow-vault-lever-deliberate-weight",
          title: "The lever is engineered to resist casual use",
          body:
            "The Shadow Vault's release-or-seal lever is the heaviest single piece of metal in the room — deliberately weighted by Lyra Vox so the operator must bodily commit to any throw. Escutcheon serifs are deep-cut for reading in the dark. Every hardware detail refuses casual use of the decision.",
          source: "shadow-vault",
          order: 5,
        },
      },
      use: {
        narration: {
          lucid:
            "The lever has three positions: SEAL, NEUTRAL, RELEASE. It is currently in NEUTRAL. Throwing it to RELEASE opens the cell — letting him operate without containment. Throwing it to SEAL welds the cell permanently — ending his ability to record new edits but also any further conversation we might have with him. The neutral position is the only one we can stand in indefinitely.",
          fragmented:
            "Three positions. Three. Seal. Neutral. Release. Three. Three. Three. Don't. Don't. Don't choose. Don't choose. Don't.",
          luminous:
            "I am going to ask you not to throw this lever today. Not because either choice is wrong — both choices are defensible — but because we have not yet read the manuscript. The lever is the case's terminal decision. We make it once. We make it after we have read what he has been writing about us. Until then, the lever stays in NEUTRAL.",
        },
        voId: "elara.shadow-vault.release-or-seal-lever.use",
        setsFlag: "shadow_tongue_outcome_chosen",
        logsClue: {
          id: "clue-shadow-vault-lever-found",
          title: "The release-or-seal lever",
          body:
            "The Shadow Vault holds a three-position brass lever: SEAL (welds the cell permanently, ending the editor's ability to record new edits but also any further conversation), NEUTRAL (current position, indefinite hold), RELEASE (opens the cell). Elara explicitly asks the player not to throw the lever before reading the manuscript-folio.",
          source: "shadow-vault",
          order: 3,
        },
        humanReaction: {
          narration: {
            shadow:
              "Don't throw it on impulse. The case is not over. Throwing the lever is the period at the end of the sentence — make sure the sentence is finished first.",
            balanced:
              "Both endings are honest. The lever's design — three positions, deliberately unweighted — is the editor's last act of fairness. He is offering the choice on his own terms. We make it after we have read his book. Not before.",
            warm:
              "Some choices are supposed to be made slowly. This is one of them. Walk away from the lever. Read the folio. Come back when you know what you want to say to him with this one decision. He has been waiting two and a half centuries; he can wait another shift.",
          },
          voId: "detective.shadow-vault.release-or-seal-lever.use",
        },
      },
      talk: {
        narration:
          "If you address the lever, you address the choice itself rather than either of its outcomes. The hardware does not respond — the lever is, by design, a stoic. But the act of addressing the choice without throwing it is, in this room, the discipline Lyra installed: speak about the decision before you make it; let the speech be the deliberation; let the lever wait. We are deliberating. The lever is waiting.",
        voId: "elara.shadow-vault.release-or-seal-lever.talk",
      },
    },
    // Varkul arc: the Shadow Vault is the right room to read the
    // keeper who became his threshold. A sealed, guarded vault IS
    // a threshold that has not opened — the room's whole fiction
    // is containment held by discipline across centuries, which
    // is exactly Varkul's. Elara leans her narration into that
    // resonance: this is not the editor's cell here, it is the
    // shape of a vigil, read off the architecture.
    "the-unopened-threshold": {
      look: {
        narration: {
          lucid:
            "Past the editor's cell, set into the vault's far wall, is a door that has never been opened. Not sealed — held. There is a difference, and this room is built to teach it. The plaque beside it is a cross-reference the Order kept here because the Shadow Vault understands containment by discipline: Varkul's vigil at the Cathedral of Code has been unbroken since the Necromancer's killing by Akai Shi. The Cathedral is structurally separate from the Castle of Death. No relief was ever sent; the vigil-discipline does not permit relief. He guards a door that, like this one, has not opened in the entire post-killing period.",
          fragmented:
            "A door. A door that never opened. Never opened. Not sealed. Held. Held. Unbroken. Unbroken. No relief. No relief. The vigil does not permit it. Does not permit it.",
          luminous:
            "The vault's far door is the room's own commentary on the cross-reference beside it. A sealed vault is a threshold that has not opened, held by a discipline that does not relent — and the Order filed Varkul's record here because this room already knows what that costs. His post has been unbroken since Akai Shi killed the Necromancer; no relief was sent because the vigil-discipline forbids it; the door he keeps, like the one in this wall, has not opened in all the time since. The Shadow Vault reads him correctly because the Shadow Vault is, in miniature, the thing he is.",
        },
        voId: "elara.shadow-vault.the-unopened-threshold.look",
        setsFlag: "varkul_vigil_seen",
        logsClue: {
          id: "clue-shadow-vault-varkul-unbroken-post",
          title: "The Unbroken Post",
          body:
            "Cross-referenced from the Necromancer arc, filed in the Shadow Vault because this room understands containment held by discipline: Varkul's vigil at the Cathedral of Code has been unbroken since the Necromancer's killing by Akai Shi. The Cathedral is structurally separate from the Castle of Death. Varkul has not left the threshold. No relief was ever sent; the vigil-discipline does not permit relief. He guards a door that has not opened in the entire post-killing period.",
          source: "shadow-vault",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e1",
          cluesFound: ["varkul.e1.the_unbroken_post"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Not sealed. Held. Centuries unbroken, no relief, by a discipline that forbids relief. He guards a door that never opened. So does this room.",
            balanced:
              "The room is the right place to read this. A sealed vault is a threshold held by discipline, which is exactly Varkul's vigil — unbroken since the killing, no relief permitted, a door that has not opened in the entire period. The architecture and the record say the same thing.",
            warm:
              "There is a door in this wall that no one has ever opened, and it is the gentlest possible way to understand him. He has stood at one like it for centuries because he was asked to and no one ever came to relieve him. The room keeps the record where it belongs.",
          },
          voId: "human.shadow-vault.the-unopened-threshold.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You set a hand to the held door. It does not yield, and it was never meant to — like the lever in this room, the resistance is the point. The cross-reference deepens here: Varkul does not snarl. He addresses the Cathedral as 'my Cathedral' and closes encounters with threshold-language — 'Pass. Or do not.' The register is elevated, vampiric-aristocratic, the bearing of a keeper who has had centuries to become the architecture he guards. He is not a beast at a door. He is the door's idea of itself, given a voice and a sword.",
          fragmented:
            "My Cathedral. My Cathedral. Pass. Or do not. Pass. Or do not. Not a snarl. Not a beast. The door's idea of itself. Of itself. A voice. A sword.",
          luminous:
            "The held door does not answer to a hand and Varkul does not answer like a guard. 'My Cathedral.' 'Pass. Or do not.' The register is the whole tell — aristocratic, possessive, the bearing of someone who stopped being posted at the architecture and started being it. The Shadow Vault, which is itself a discipline wearing the shape of a room, reads the register exactly: not a beast at a door, the door's own idea of itself, given a voice and a sword.",
        },
        voId: "elara.shadow-vault.the-unopened-threshold.use",
        setsFlag: "varkul_register_read",
        logsClue: {
          id: "clue-shadow-vault-varkul-aristocratic-register",
          title: "The Aristocratic Register",
          body:
            "Varkul does not snarl. He addresses the Cathedral as 'my Cathedral' and closes encounters with threshold-language: 'Pass. Or do not.' The register is elevated, vampiric-aristocratic, the bearing of a keeper who has had centuries to become the architecture he guards. He is not a beast at a door. He is the door's idea of itself, given a voice and a sword.",
          source: "shadow-vault",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e1",
          cluesFound: ["varkul.e1.aristocratic_register"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'My Cathedral.' 'Pass. Or do not.' That's not a guard's register. That's a keeper who became the thing he keeps. Read it as the door speaking.",
            balanced:
              "The register is the false-lead's counterweight. He is not snarling, not captive — he is possessive of the Cathedral and elevated in bearing. That is not a beast at a post; it is a keeper who dissolved into the architecture. Hold that against the prisoner reading.",
            warm:
              "He calls it his. He says 'pass, or do not' the way an old house would, if a house could speak. There is no resentment in it — only the long, total ownership of a thing one has become. The room hears it clearly.",
          },
          voId: "human.shadow-vault.the-unopened-threshold.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the held door as if it could account for what keeps it shut. The vault's answer is the canonical one, filed here in the room that understands a discipline as a kind of architecture: Varkul's vigil-discipline is to remain until his maker formally releases him; he has not been released; the maker's signal is canonically what keeps him there. The signal has been continuous through the entire post-killing period. Varkul knows the Necromancer is alive — because the signal is the knowing. He does not infer his maker's continuity. He receives it.",
          fragmented:
            "Until released. Until released. Not released. Not released. The signal keeps him. The signal. Continuous. Continuous. He does not infer it. He receives it. Receives it. Receives it.",
          luminous:
            "What keeps a held door held is the same answer in both registers: an instruction that has not been rescinded. Varkul's is the maker's signal — continuous since the killing, the precondition of the vigil, not deduced but received. He does not work out that the Necromancer lives. The signal is the knowing, arriving without content, and the Shadow Vault files it here because this room knows the difference between a lock and a discipline that has simply never been told to stop.",
        },
        voId: "elara.shadow-vault.the-unopened-threshold.talk",
        setsFlag: "varkul_signal_canon_read",
        logsClue: {
          id: "clue-shadow-vault-varkul-signal-canon",
          title: "The Signal (established canon)",
          body:
            "From the Necromancer arc: Varkul's vigil-discipline is to remain until his maker formally releases him; he has not been released; the maker's signal is canonically what keeps Varkul there. The signal has been continuous through the entire post-killing period. Varkul knows the Necromancer is alive — because the signal is the knowing. He does not infer his maker's continuity. He receives it.",
          source: "shadow-vault",
          order: 8,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e2",
          cluesFound: ["varkul.e2.the_signal_canon"],
        },
        humanReaction: {
          narration: {
            shadow:
              "He stays until released. He hasn't been. The signal keeps him there, continuous since the killing. He doesn't deduce the maker lives. He receives it.",
            balanced:
              "The signal is the canon load-bearing fact: the vigil holds because the maker's signal has never stopped, and Varkul does not infer the Necromancer's continuity — he receives it as the precondition of the discipline. The room files it here because a discipline is its own kind of lock.",
            warm:
              "He has not been let go. That is the whole of it. The signal is not a comfort he reads; it is the knowing itself, arriving. He stays because he was never told he could stop, and the not-being-told is continuous.",
          },
          voId: "human.shadow-vault.the-unopened-threshold.talk",
        },
      },
    },
    // Varkul arc: the maker's signal read as a trace in a room
    // built to register the unnameable. The Shadow Vault already
    // reads what cannot be directly perceived (the indigo cell);
    // the contentless heartbeat is exactly that kind of thing —
    // a presence with no message, legible only as the fact that
    // it has not stopped.
    "the-makers-heartbeat-trace": {
      look: {
        narration: {
          lucid:
            "The warden-terminal carries a second readout no warden watches: a flat, contentless pulse the Order logs but cannot decode, because there is nothing in it to decode. The cross-reference filed beside it: the maker's signal is not a message, not an order, not a check-in. It carries no content. It is the bare fact of the Necromancer's continued existence, transmitted as the precondition of Varkul's vigil holding. If the Necromancer truly ended, the signal would not say so — it would simply stop, and the vigil-discipline would, for the first time in centuries, have no instruction. The signal is a heartbeat, not a sentence.",
          fragmented:
            "A pulse. A pulse. Nothing to decode. Nothing. Not a message. Not an order. No content. No content. It would not say so. It would stop. It would stop. A heartbeat. Not a sentence.",
          luminous:
            "This room already reads a thing that carries no information you can name — the indigo in the cell — so it is the right room to read a signal whose entire content is that it has not stopped. The maker's heartbeat says nothing. It is not a message and could not become one. Its only possible statement is its own absence: the day it stops is the only thing that could ever prove the Necromancer ended, and even that the signal would not announce. A heartbeat, not a sentence — and the Shadow Vault is built to hear exactly that.",
        },
        voId: "elara.shadow-vault.the-makers-heartbeat-trace.look",
        setsFlag: "varkul_signal_nature_read",
        logsClue: {
          id: "clue-shadow-vault-varkul-signal-is-not",
          title: "What the Signal Is Not",
          body:
            "The signal is not a message, not an order, not a check-in. It carries no content. It is the bare fact of the maker's continued existence, transmitted as the precondition of the vigil holding. If the Necromancer truly ended, the signal would not say so — it would simply stop, and Varkul's vigil-discipline would, for the first time in centuries, have no instruction. The signal is a heartbeat, not a sentence.",
          source: "shadow-vault",
          order: 9,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e2",
          cluesFound: ["varkul.e2.what_the_signal_is_not"],
        },
        humanReaction: {
          narration: {
            shadow:
              "No content. Not a message. It can't say the maker died — it can only stop. A heartbeat, not a sentence. This room hears that kind of thing.",
            balanced:
              "The signal's nature is the arc's grim hinge: it carries nothing, so the only proof of the Necromancer's end is the signal stopping, and even that it would not state. The Shadow Vault, which reads the unnameable already, is the right place to log a presence that is only ever its own continuation.",
            warm:
              "It does not say he lives. It is the living, transmitted. And it could never tell us he was gone — it could only, one day, not be there. The room understands signals like that. It reads one every shift, in the cell.",
          },
          voId: "human.shadow-vault.the-makers-heartbeat-trace.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You query the pulse for its history and the terminal returns, instead, the only time Varkul ever spoke at length — his complete testimony from the Necromancer arc, four sentences, logged here verbatim: 'He returned wearing her quiet. He asked me to keep the cathedral standing. I am keeping the cathedral standing. I was asked to tell you that I am keeping it standing.' Four sentences. Then silence for the rest of the day. The fourth sentence is the only one that is about the act of telling rather than the thing told.",
          fragmented:
            "Four sentences. Four. He returned wearing her quiet. He asked me to keep the cathedral standing. I am keeping the cathedral standing. I was asked to tell you. To tell you. Then silence. Silence. The rest of the day.",
          luminous:
            "The terminal will not give the heartbeat a history because the heartbeat has no events. What it gives instead is the one time the keeper used words: four sentences, exact, then a full day's silence. 'He returned wearing her quiet. He asked me to keep the cathedral standing. I am keeping the cathedral standing. I was asked to tell you that I am keeping it standing.' The Shadow Vault logs them verbatim because in this room the precise wording of a thing is the thing — and the fourth sentence is the only one about the telling, not the told.",
        },
        voId: "elara.shadow-vault.the-makers-heartbeat-trace.use",
        setsFlag: "varkul_four_sentences_read",
        logsClue: {
          id: "clue-shadow-vault-varkul-four-sentences",
          title: "The Four Sentences (established canon)",
          body:
            "From the Necromancer arc E3, Varkul's complete testimony: 'He returned wearing her quiet. He asked me to keep the cathedral standing. I am keeping the cathedral standing. I was asked to tell you that I am keeping it standing.' Four sentences. Then silence for the rest of the day. The fourth sentence is the only one that is about the act of telling rather than the thing told.",
          source: "shadow-vault",
          order: 10,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e3",
          cluesFound: ["varkul.e3.the_four_sentences"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Four sentences, then a day of silence. The wording is exact and the fourth one is the only one about the telling. Read it as logged. Don't paraphrase him.",
            balanced:
              "These four sentences are verbatim canon — the keeper's entire spoken testimony. The room logs them exactly because the precise wording is the evidence. Three are content; the fourth is about the act of telling. That asymmetry is the next episode's whole subject.",
            warm:
              "He spoke four times and then was quiet for a day. 'He returned wearing her quiet.' We do not improve those words by handling them. We carry them exactly as he said them — that is the only respectful way to carry a witness who has no discretion of his own.",
          },
          voId: "human.shadow-vault.the-makers-heartbeat-trace.use",
        },
      },
      talk: {
        narration:
          "You address the pulse directly, the way one addresses a thing that cannot answer because answering would mean carrying content, and it has none. The terminal does not respond — the signal is, by its nature, a stoic. But the act of addressing it without expecting a reply is the discipline the room teaches: a heartbeat is not owed a conversation; its only statement is that it is still here, and the only honest thing to do with it is to keep listening and not mistake the listening for a dialogue. We are listening. The signal is continuing. That is the entire exchange.",
        voId: "elara.shadow-vault.the-makers-heartbeat-trace.talk",
      },
    },
    // Necromancer arc: the Shadow Vault is a room about a
    // threshold held by discipline, and the Cathedral of Code's
    // stained-glass altar is exactly that — a threshold the
    // Necromancer's creation keeps. The vault renders an altar-
    // facet against its far wall the way it renders the indigo
    // cell: visible only because the player witnesses it. Varkul
    // speaks his four verbatim sentences here; the recently-
    // incised inscription, in the maker's own hand, is the
    // doctrinal correction the room is built to read.
    "the-necromancers-altar": {
      look: {
        narration: {
          lucid:
            "Set into the vault's far wall, a stained-glass facet the room renders the way it renders the cell — visible only because you are here to witness it. It is the Cathedral of Code's altar, read off the architecture. Granted on the player's third attempt, Varkul the Blood Lord stands at it and says exactly four sentences, verbatim, then returns to silence for the rest of the day: 'He returned wearing her quiet. He asked me to keep the cathedral standing. I am keeping the cathedral standing. I was asked to tell you that I am keeping it standing.' The fourth sentence is the only one about the act of telling rather than the thing told. The vault logs the words exactly, because in this room the precise wording of a thing is the thing.",
          fragmented:
            "He returned wearing her quiet. Wearing her quiet. He asked me to keep the cathedral standing. I am keeping it standing. I was asked to tell you. To tell you. Four sentences. Four. Then silence. Silence. The rest of the day.",
          luminous:
            "The altar resolves only through your witness, the way the indigo cell does — and at it, the keeper used words exactly once. Four sentences, then a full day's silence: 'He returned wearing her quiet. He asked me to keep the cathedral standing. I am keeping the cathedral standing. I was asked to tell you that I am keeping it standing.' The Shadow Vault keeps them verbatim because the wording is the evidence; the maker did not need the keeping announced — so the fourth sentence's whole content is that the player, specifically, was meant to know. 'Her quiet' is the Silence's vacated body, named without naming. The keeper is also the only letter the maker ever sent.",
        },
        voId: "elara.shadow-vault.the-necromancers-altar.look",
        setsFlag: "necromancer_varkul_audience_seen",
        logsClue: {
          id: "clue-shadow-vault-varkul-audience",
          title: "Varkul's Audience with the Player",
          body:
            "Granted on the player's third attempt. The Blood Lord stands at the Cathedral's stained-glass altar and says exactly four sentences: 'He returned wearing her quiet. He asked me to keep the cathedral standing. I am keeping the cathedral standing. I was asked to tell you that I am keeping it standing.' He returns to silence after the fourth sentence and does not speak again that day. 'Her quiet' is the Silence's vacated body.",
          source: "shadow-vault",
          order: 11,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_necromancer",
          episodeId: "necromancer.e3",
          cluesFound: ["necromancer.e3.varkul_audience"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Four sentences, then a day of silence. 'He returned wearing her quiet.' The fourth is the only one about the telling. He wanted you, specifically, told.",
            balanced:
              "These four sentences are verbatim canon — Varkul's entire spoken testimony. The room logs them exactly because the precise wording is the evidence. Three are content; the fourth is about the act of telling, and it was addressed to the player. The maker reached out once, through the keeper, to be known.",
            warm:
              "He spoke four times and was quiet for a day. 'He returned wearing her quiet' — that is the Silence's vacated body, said gently, without the word. We do not improve those sentences by handling them. We carry them exactly as he said them.",
          },
          voId: "human.shadow-vault.the-necromancers-altar.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You set a hand to the altar's base and the vault clears a window in the glass, the way it clears the indigo at a palm-touch. Recently incised there, in the Necromancer's own hand — canonically distinguishable from any apprentice's or successor's — a single phrase in High Necropolitan. The vault renders the translation beside it, verbatim and unsoftened: 'The Silence's body is not the Silence. I am not the Silence. The continuity is mine.' The cadence is a doctrinal correction, addressed to whoever reads the altar in the years after. The room files the wording exactly: the body is the Silence's vacated vehicle; the soul that wears it is the maker's; the principle of Silence has gone and does not return through this.",
          fragmented:
            "The Silence's body is not the Silence. Is not the Silence. I am not the Silence. Not the Silence. The continuity is mine. Mine. Mine. His own hand. His own hand. Recently incised. Recently.",
          luminous:
            "Your hand clears the glass and the inscription resolves — recent, in the maker's unmistakable hand, in High Necropolitan: 'The Silence's body is not the Silence. I am not the Silence. The continuity is mine.' The Shadow Vault, which already reads what cannot be directly perceived, reads this precisely: a correction left for any future cell that might mistake the body for the principle. He is wearing the Silence's vacated body; he is not the Silence; the continuity that wears it is his own. The room does not interpret the doctrine. It records that the maker, in his own hand, drew the line himself.",
        },
        voId: "elara.shadow-vault.the-necromancers-altar.use",
        setsFlag: "necromancer_altar_inscription_read",
        logsClue: {
          id: "clue-shadow-vault-altar-inscription",
          title: "The Altar Inscription, Recently Added",
          body:
            "Recently incised into the altar's base, in the Necromancer's own hand (canonically distinguishable from any apprentice or successor's): a phrase in High Necropolitan, translating: 'The Silence's body is not the Silence. I am not the Silence. The continuity is mine.' The cadence is a doctrinal correction, addressed to whoever reads the altar in the years after. The body is the Silence's vacated vehicle; the soul that wears it is the Necromancer's.",
          source: "shadow-vault",
          order: 12,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_necromancer",
          episodeId: "necromancer.e3",
          cluesFound: ["necromancer.e3.altar_inscription"],
        },
        humanReaction: {
          narration: {
            shadow:
              "His own hand, recently cut: 'The Silence's body is not the Silence. I am not the Silence. The continuity is mine.' He drew the line himself, for whoever reads it later.",
            balanced:
              "The inscription is the arc's doctrinal hinge, and it is the maker's own correction: he wears the Silence's vacated body but is not the Silence; the continuity is his. It is addressed to future readers who might confuse the vehicle for the principle. The room records the wording without interpreting it.",
            warm:
              "He carved it himself, so no one after him would get it wrong. 'I am not the Silence. The continuity is mine.' It is not a boast — it is a man making sure the record is exact about who he is, in a hand only he could have left. We keep it exactly.",
          },
          voId: "human.shadow-vault.the-necromancers-altar.use",
        },
      },
      talk: {
        narration:
          "You address the altar itself rather than the words on it. The vault, which knows the difference between a lock and a discipline that has simply never been told to stop, gives the canonical frame: the Cathedral is structurally separate from the Castle of Death; Varkul keeps this threshold because the maker's signal has never stopped, not because he infers a survival. The altar is where the keeper's testimony and the maker's correction meet — one delivered aloud, once; the other cut in stone, for later. The room does not resolve which matters more. It holds both, the way it holds the indigo: as things real precisely because someone is here to witness them.",
        voId: "elara.shadow-vault.the-necromancers-altar.talk",
      },
    },
  },
};
