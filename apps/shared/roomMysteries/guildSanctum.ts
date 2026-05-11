/* ═══════════════════════════════════════════════════════
   GUILD SANCTUM MYSTERY — sigil-altar + allegiance-pad

   Two-hotspot module. Sets guild_sanctum_seen on first-look
   at the sigil-altar. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type GuildSanctumHotspotId = "sigil-altar" | "allegiance-pad";

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
  },
};
