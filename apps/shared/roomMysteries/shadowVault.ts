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
  | "sealed-cell-glass"
  | "manuscript-pile"
  | "warden-terminal"
  | "release-or-seal-lever";

export type ShadowVaultInventoryId = "manuscript-folio";

export const SHADOW_VAULT_MYSTERY: RoomMysteryModule<
  ShadowVaultHotspotId,
  ShadowVaultInventoryId
> = {
  roomId: "shadow-vault",
  responses: {
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
    },
    "warden-terminal": {
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
    },
    "release-or-seal-lever": {
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
    },
  },
};
