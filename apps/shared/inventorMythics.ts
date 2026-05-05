/* ═══════════════════════════════════════════════════════
   INVENTOR MYTHICS — one-of-one story artifacts (plan §G.7)

   Every named set ships a Mythic tier: a single,
   story-bound heirloom that the schematic/trade/shop
   paths CANNOT produce. These items exist exactly once in
   the run; losing them means losing them.

   This module is the registry of Mythic acquisition beats.
   All 18 beats now ship an authored on-claim encounter
   (`encounter`) — short prose dialog delivered when the
   operative receives the Mythic. The narrative team can
   refine the prose; the structure (speaker/line/emotion) is
   stable.

   NOTE: the actual piece ids the Mythic yields reuse the
   catalog's `<setId>:mythic:<slot>` identifier from
   suitSets.ts — the Mythic rarity IS part of the asset
   catalog, only its acquisition path is different.
   ═══════════════════════════════════════════════════════ */

import type { Rarity, SuitSlot } from "./suitSets";

export type MythicBeatStatus = "placeholder" | "authored";

export type MythicTrigger =
  | "boss_defeat"
  | "companion_gift"
  | "act_climax"
  | "hidden_encounter";

export type MythicEncounterSpeaker =
  | "elara"
  | "the_human"
  | "vex_solene"
  | "narrator"
  | "self";

export type MythicEncounterEmotion =
  | "reverent"
  | "uneasy"
  | "matter_of_fact"
  | "haunted"
  | "elegiac"
  | "wry";

export interface MythicBeatEncounterLine {
  speaker: MythicEncounterSpeaker;
  line: string;
  emotion?: MythicEncounterEmotion;
}

export interface MythicBeat {
  /** Stable id — `mythic:<setId>:<slot>`. */
  id: string;
  setId: string;
  slot: SuitSlot;
  /** Mythic pieces always resolve to this rarity; fixed here for clarity. */
  rarity: Extract<Rarity, "mythic">;
  /** Plain-English when/where the player earns this one-of-one. */
  description: string;
  /** Canonical trigger tag — feeds content discovery tooling. */
  trigger: MythicTrigger;
  /**
   * Placeholder vs authored. Placeholder beats ship the slot + the
   * render path; final narrative hook is a follow-up with the Act
   * writers.
   */
  status: MythicBeatStatus;
  /**
   * Authored on-claim encounter — short prose dialog (6-12 lines)
   * delivered when the operative receives the Mythic. Optional so
   * placeholder beats still compile; data-only for now (a future
   * mythic-claim modal renders it).
   */
  encounter?: readonly MythicBeatEncounterLine[];
}

function mythicId(setId: string, slot: SuitSlot): string {
  return `mythic:${setId}:${slot}`;
}

/**
 * Authored beats — one per named set (18 total). Each carries a
 * specific acquisition premise plus a short on-claim encounter
 * (`encounter`) that delivers the Mythic in dialog. All reuse the
 * §G.5 rarity contract (Mythic pieces exist at the same assetId
 * coords as the crafted rarities; only the acquisition path differs).
 */
export const MYTHIC_BEATS: readonly MythicBeat[] = [
  /* ─── Class sets (5) ─── */
  {
    id: mythicId("regalia-of-the-seeing-stylus", "weapon-primary"),
    setId: "regalia-of-the-seeing-stylus",
    slot: "weapon-primary",
    rarity: "mythic",
    description:
      "Recovered from the first Oracle who wore the Stylus in the Age of Privacy, dropped by the act-climax boss that wears it imperfectly.",
    trigger: "act_climax",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The boss kneels. The Stylus is still warm — not from her. From the one before.", emotion: "elegiac" },
      { speaker: "the_human", line: "She wore it wrong. You can see where the grip wore the wrong groove.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "She wasn't the first.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "No. The first was an Oracle in the Age of Privacy. Before the Watchers. Before names were public.", emotion: "reverent" },
      { speaker: "elara", line: "How do you wear something that was meant to be private?", emotion: "uneasy" },
      { speaker: "the_human", line: "Carefully. The Stylus writes back.", emotion: "wry" },
      { speaker: "narrator", line: "Elara takes it. The grip fits her hand the way a question fits a held breath.", emotion: "reverent" },
      { speaker: "elara", line: "I'll learn the right groove.", emotion: "matter_of_fact" },
    ],
  },
  {
    id: mythicId("pressure-loom-harness", "chest"),
    setId: "pressure-loom-harness",
    slot: "chest",
    rarity: "mythic",
    description:
      "The Inventor's own workshop apron. Found hanging on a rusted hook in the Engineering Core when the operative finishes the first craft-bench questline.",
    trigger: "hidden_encounter",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The Engineering Core. End of shift, no shift. A hook on the wall. An apron, hanging.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "Stop. Don't touch it yet.", emotion: "uneasy" },
      { speaker: "elara", line: "Whose was it?", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "The Inventor. She left the Core the day she stopped being the Inventor and became something the manifests don't have a word for.", emotion: "haunted" },
      { speaker: "elara", line: "She left the apron.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She left everything you needed and nothing you wanted.", emotion: "elegiac" },
      { speaker: "narrator", line: "Elara lifts it from the hook. The seams remember a different ribcage. They'll learn hers.", emotion: "reverent" },
      { speaker: "elara", line: "I'll bring it back when I'm done.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She didn't.", emotion: "wry" },
    ],
  },
  {
    id: mythicId("black-crepe-weave", "back"),
    setId: "black-crepe-weave",
    slot: "back",
    rarity: "mythic",
    description:
      "A mourning sash wrapped around the shoulders of an Assassin who never collected the final contract. Boss drop from the Assassin-ladder act finale.",
    trigger: "act_climax",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The contract is on the floor between them. Unsigned. The Assassin's hands are open.", emotion: "elegiac" },
      { speaker: "elara", line: "You didn't take it.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She wore mourning for the mark she didn't kill. That's the sash.", emotion: "reverent" },
      { speaker: "elara", line: "Mourning for someone alive?", emotion: "uneasy" },
      { speaker: "the_human", line: "Mourning for the version of herself that would have done it.", emotion: "haunted" },
      { speaker: "elara", line: "And the contract.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "Still unsigned. The Crepe Weave passes when the wearer refuses something the price was paid for.", emotion: "matter_of_fact" },
      { speaker: "narrator", line: "Elara unwinds the sash carefully. It is heavier than fabric should be.", emotion: "reverent" },
      { speaker: "elara", line: "I'll wear it until I refuse my own.", emotion: "matter_of_fact" },
    ],
  },
  {
    id: mythicId("bulwark-of-the-eighth-column", "shoulders"),
    setId: "bulwark-of-the-eighth-column",
    slot: "shoulders",
    rarity: "mythic",
    description:
      "The original epaulets of the Eighth Column's commander. A Soldier companion places them on the operative's shoulders when the operative first holds the line on their behalf.",
    trigger: "companion_gift",
    status: "authored",
    encounter: [
      { speaker: "the_human", line: "You held. I want to give you something.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "I held because I had to.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "The Commander of the Eighth Column held because she chose to. These were hers. The reason she gave them to me is the reason I'm giving them to you.", emotion: "reverent" },
      { speaker: "elara", line: "Which is.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She said: 'I held the line so the next person could choose to.' And then she set them down.", emotion: "elegiac" },
      { speaker: "narrator", line: "The Human pins the epaulets to Elara's shoulders the way a Soldier does — once, hard, no second chance.", emotion: "reverent" },
      { speaker: "elara", line: "And if I set them down?", emotion: "uneasy" },
      { speaker: "the_human", line: "Then you give them to whoever held next.", emotion: "matter_of_fact" },
    ],
  },
  {
    id: mythicId("low-profile-tailoring", "gloves"),
    setId: "low-profile-tailoring",
    slot: "gloves",
    rarity: "mythic",
    description:
      "Tailor's gloves with a hidden seam, discovered inside the Spy-faction dead drop that the operative retrieves after solving the Clue Journal's Act-1-carryover case.",
    trigger: "hidden_encounter",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The dead drop is exactly where the Clue Journal said. A loose floor tile in a corridor that is not on any deck plan.", emotion: "matter_of_fact" },
      { speaker: "self", line: "The hint was three sentences. The fourth, the one I had to write, was the location.", emotion: "wry" },
      { speaker: "narrator", line: "Inside: a folded packet. A pair of gloves. A note in a hand that does not sign itself.", emotion: "matter_of_fact" },
      { speaker: "self", line: "'For the operative who reads what is not written. The seam is on the inside. Don't show it.'", emotion: "reverent" },
      { speaker: "self", line: "Inside the seam: a stylus pocket. A wire pocket. A pocket I don't have a name for yet.", emotion: "matter_of_fact" },
      { speaker: "self", line: "The Spy faction doesn't recruit. It leaves drops for whoever solves the right case.", emotion: "matter_of_fact" },
      { speaker: "self", line: "I solved it. They found me first.", emotion: "uneasy" },
    ],
  },

  /* ─── Species sets (3) ─── */
  {
    id: mythicId("arcane-rune-regalia", "head"),
    setId: "arcane-rune-regalia",
    slot: "head",
    rarity: "mythic",
    description:
      "A Demagi coronet whose runes still answer the first person who spoke them. Act-climax boss whose defeat is only possible if the operative has spoken the rune aloud in a scripted dialog.",
    trigger: "act_climax",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The boss falls when the rune leaves Elara's mouth. Not before. The rune was the only weapon that worked.", emotion: "reverent" },
      { speaker: "the_human", line: "Demagi coronets are listening devices. They hear the first voice that speaks the rune and answer to it forever.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "I'm the first.", emotion: "uneasy" },
      { speaker: "the_human", line: "You're the first who said it like she meant it.", emotion: "wry" },
      { speaker: "elara", line: "What does it answer to.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "Truth. Strict definition. It can tell when you're lying to it.", emotion: "uneasy" },
      { speaker: "narrator", line: "The coronet rises from the body and settles onto Elara's brow. Light, then weight.", emotion: "reverent" },
      { speaker: "elara", line: "I'll watch what I say.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "Watch what you mean.", emotion: "elegiac" },
    ],
  },
  {
    id: mythicId("clockwork-exoframe", "chest"),
    setId: "clockwork-exoframe",
    slot: "chest",
    rarity: "mythic",
    description:
      "Pulled from a hidden Quarchon war-chest discoverable only by completing a full §B progressive-disclosure chain that ends in the Engineering Deck.",
    trigger: "hidden_encounter",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The Engineering Deck. Behind a panel that the §B chain finally let Elara open. A war-chest the Quarchons sealed before they left.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "Quarchon work. They built for bodies their bodies didn't have yet.", emotion: "reverent" },
      { speaker: "elara", line: "It fits me.", emotion: "uneasy" },
      { speaker: "the_human", line: "It fits whoever lifted the panel. The exoframe is gauged at the moment of opening.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "Then it doesn't fit anyone yet.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "It will. Put it on.", emotion: "matter_of_fact" },
      { speaker: "narrator", line: "Gears find each other. The frame closes around Elara's torso the way a clock finds the hour.", emotion: "reverent" },
      { speaker: "elara", line: "Why did they leave it.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "Because they ran out of bodies that were brave enough to be measured.", emotion: "elegiac" },
    ],
  },
  {
    id: mythicId("hybrid-vein-panoply", "arms"),
    setId: "hybrid-vein-panoply",
    slot: "arms",
    rarity: "mythic",
    description:
      "Ne-Yon gauntlets whose filigree threads continue to grow after unequipping. Gifted by the Ne-Yon mentor character once the operative reaches Trust tier 80.",
    trigger: "companion_gift",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The Ne-Yon mentor sets a pair of gauntlets on the bench. The filigree on them is still moving.", emotion: "reverent" },
      { speaker: "the_human", line: "Trust tier eighty. She doesn't give these out at seventy-nine.", emotion: "wry" },
      { speaker: "elara", line: "Why are they still growing.", emotion: "uneasy" },
      { speaker: "the_human", line: "Ne-Yon work isn't finished when it's worn. The vein pattern follows the wearer's habits.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "Then they'll know what I do.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She knew that. She gave them anyway.", emotion: "elegiac" },
      { speaker: "narrator", line: "Elara fits her hands inside. The filigree pauses, waits, then resumes — choosing a new direction.", emotion: "reverent" },
      { speaker: "elara", line: "Tell her I'll try not to embarrass the pattern.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She said: don't try. Just be honest. The pattern handles the rest.", emotion: "matter_of_fact" },
    ],
  },

  /* ─── Element sets (8) ─── */
  {
    id: mythicId("geomancers-stratum", "legs"),
    setId: "geomancers-stratum",
    slot: "legs",
    rarity: "mythic",
    description:
      "Slate greaves whose inlaid ley-ore chimes when the wearer stands on sanctified ground. Found in the Hidden Chamber behind the Earth-element Ark event's climax.",
    trigger: "hidden_encounter",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The Hidden Chamber. The Ark event's climax ended at a wall that wasn't a wall. Behind it, slate greaves on a pedestal of bare stone.", emotion: "reverent" },
      { speaker: "the_human", line: "Geomancer work. The ley-ore chimes when the wearer stands on ground that was made sacred by someone who knelt on it first.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "How does the ore know.", emotion: "uneasy" },
      { speaker: "the_human", line: "It doesn't. The wearer does. The ore is a metronome for what the wearer already feels.", emotion: "elegiac" },
      { speaker: "narrator", line: "Elara fastens them. The first chime is small. The second is the wall behind her, settling.", emotion: "reverent" },
      { speaker: "elara", line: "I felt that.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "Then it was sacred. The greaves only confirm.", emotion: "matter_of_fact" },
    ],
  },
  {
    id: mythicId("ember-bellows-array", "shoulders"),
    setId: "ember-bellows-array",
    slot: "shoulders",
    rarity: "mythic",
    description:
      "Forge-bellows pauldrons still warm from the first ember. Dropped by the Fire-element boss who wore them to a standstill in the Act-finale duel.",
    trigger: "act_climax",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The duel ended in a standstill. Both still standing. One choosing to step back.", emotion: "elegiac" },
      { speaker: "the_human", line: "The boss took them off. That's what makes them yours.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "I didn't beat her.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "You didn't. You held the duel until she chose to set them down. That's harder.", emotion: "reverent" },
      { speaker: "elara", line: "Why are they still warm.", emotion: "uneasy" },
      { speaker: "the_human", line: "The first ember is in the seam. It hasn't gone out since the forge that made them.", emotion: "matter_of_fact" },
      { speaker: "narrator", line: "Elara lifts the pauldrons. Her shoulders take the weight as if they had been measured.", emotion: "reverent" },
      { speaker: "elara", line: "I'll keep the ember.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "It will keep you.", emotion: "wry" },
    ],
  },
  {
    id: mythicId("tide-engine-carapace", "chest"),
    setId: "tide-engine-carapace",
    slot: "chest",
    rarity: "mythic",
    description:
      "A dive-plate with a pressure-gauge that still reads the fathoms of an ocean that no longer exists. Recovered from a sealed Water-element pod opened by a Clue-Journal key.",
    trigger: "hidden_encounter",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The pod has been sealed since before the Fall of Realities. The Clue-Journal key fits the third seal. The first two open by the weight of standing in front of it.", emotion: "reverent" },
      { speaker: "self", line: "The gauge still reads. Forty-three fathoms. Of an ocean that doesn't exist.", emotion: "haunted" },
      { speaker: "self", line: "Whose ocean.", emotion: "uneasy" },
      { speaker: "self", line: "The Clue Journal said: 'A diver who refused to surface, in a sea that obliged her by going first.'", emotion: "elegiac" },
      { speaker: "narrator", line: "Inside the pod: a carapace. Pressure-gauge needle still trembling against the dial.", emotion: "reverent" },
      { speaker: "self", line: "I'll wear the pressure she chose.", emotion: "matter_of_fact" },
      { speaker: "self", line: "The needle moves when I lift it. The ocean remembers the diver.", emotion: "reverent" },
    ],
  },
  {
    id: mythicId("aetheric-dirigible-rig", "back"),
    setId: "aetheric-dirigible-rig",
    slot: "back",
    rarity: "mythic",
    description:
      "Canvas-sail wings stitched by the last aeronaut. A companion who flew beside the operative in an Ark-event sky-chase hands them over after surviving the fall.",
    trigger: "companion_gift",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The sky-chase is over. Both alive. Both bruised. The companion's rig is in pieces; Elara's is intact because the companion took the worse line.", emotion: "elegiac" },
      { speaker: "the_human", line: "She's the last aeronaut. The one who actually stitched her own canvas. The last one who knew the stitch.", emotion: "reverent" },
      { speaker: "elara", line: "She's giving them up?", emotion: "uneasy" },
      { speaker: "the_human", line: "She's giving them to the next person who survived the fall the right way. That's you.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "I didn't earn this.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She says: you trusted the canvas before you trusted the wind. That was the test.", emotion: "reverent" },
      { speaker: "narrator", line: "The companion buckles the rig onto Elara's back. Her hands shake. The seams hold.", emotion: "reverent" },
      { speaker: "elara", line: "Tell her the next sky-chase is mine.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She knows.", emotion: "wry" },
    ],
  },
  {
    id: mythicId("void-sextant-ensemble", "head"),
    setId: "void-sextant-ensemble",
    slot: "head",
    rarity: "mythic",
    description:
      "A lacquered astrolabe-crown whose star-chart still points true to constellations erased in the Fall. Drops from the Space-element act-climax boss who navigated by it.",
    trigger: "act_climax",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The Space-element boss falls in a chamber whose ceiling is the void itself. The crown is on the floor between them, still pointing.", emotion: "reverent" },
      { speaker: "the_human", line: "He navigated by stars that don't exist anymore. The Fall erased the constellations. The crown didn't get the memo.", emotion: "elegiac" },
      { speaker: "elara", line: "It's pointing to nothing.", emotion: "uneasy" },
      { speaker: "the_human", line: "It's pointing to where something was. That's how you find a thing that has been erased — go to where the absence is loudest.", emotion: "reverent" },
      { speaker: "elara", line: "I won't see what he saw.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "You'll see the place where the seeing happened. Sometimes that is enough.", emotion: "elegiac" },
      { speaker: "narrator", line: "Elara lifts the crown. The lacquer is still warm from him. She sets it on her head.", emotion: "reverent" },
      { speaker: "elara", line: "I'll learn the missing constellations.", emotion: "matter_of_fact" },
    ],
  },
  {
    id: mythicId("chronometer-livery", "chest"),
    setId: "chronometer-livery",
    slot: "chest",
    rarity: "mythic",
    description:
      "A glass chestplate whose inner gears tick a second slower than the ship's clock. Hidden inside a loop the operative has to exit by refusing a scripted choice.",
    trigger: "hidden_encounter",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The loop offered Elara the same choice four times. The fifth time, she refused to choose. The corridor opened.", emotion: "matter_of_fact" },
      { speaker: "self", line: "There. The chestplate. Glass. Gears inside. Ticking.", emotion: "reverent" },
      { speaker: "self", line: "One second slower than the ship.", emotion: "uneasy" },
      { speaker: "self", line: "Refusing the choice cost me a second of my life. The chestplate is the receipt.", emotion: "wry" },
      { speaker: "self", line: "If I wear it, I'm always one second behind the room I'm in.", emotion: "matter_of_fact" },
      { speaker: "self", line: "Or one second early. Depending which clock I'm asking.", emotion: "matter_of_fact" },
      { speaker: "narrator", line: "Elara puts it on. The gears shift to match her heartbeat, then resume their ticking — still one second slower.", emotion: "reverent" },
      { speaker: "self", line: "The Architect can't script someone who refuses.", emotion: "matter_of_fact" },
    ],
  },
  {
    id: mythicId("dicewrights-motley", "belt"),
    setId: "dicewrights-motley",
    slot: "belt",
    rarity: "mythic",
    description:
      "A flipping-coin buckle that always settles on the side the wearer thought of first. Won from Degen's Casino after completing the VIP-room chain the full Dicewright set unlocks.",
    trigger: "hidden_encounter",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "Degen's Casino. VIP room. The chain ended at a single coin on a velvet pad. Degen, smiling, behind the rail.", emotion: "wry" },
      { speaker: "self", line: "The buckle settles on the side the wearer thought of first.", emotion: "matter_of_fact" },
      { speaker: "self", line: "If I lie about which side I thought of, the buckle knows.", emotion: "uneasy" },
      { speaker: "self", line: "If I don't think of a side, the buckle waits.", emotion: "wry" },
      { speaker: "self", line: "Degen says: 'The house always wins, but only because the house never lies about which side it picked.'", emotion: "matter_of_fact" },
      { speaker: "self", line: "I pick heads. The buckle agrees. The pad is empty. The buckle is on my belt.", emotion: "matter_of_fact" },
      { speaker: "self", line: "Degen tips his hat. The chain closes behind me.", emotion: "wry" },
    ],
  },
  {
    id: mythicId("null-weaver-mantle", "back"),
    setId: "null-weaver-mantle",
    slot: "back",
    rarity: "mythic",
    description:
      "A cloak whose hem refuses to settle because the seams aren't there. Dropped by the Reality-element act-climax boss at the moment the operative is asked to choose a truth and doesn't.",
    trigger: "act_climax",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The Reality-element boss extends two truths in cupped palms. 'Pick one.' Elara picks neither. The boss falls. The mantle is on the floor.", emotion: "reverent" },
      { speaker: "the_human", line: "Null-Weave. The seams aren't there because the cloak refuses to be one thing.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "I refused to choose.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "That's the only refusal the Null-Weave answers to. Picking neither is not the same as picking both.", emotion: "elegiac" },
      { speaker: "elara", line: "What did the boss think I would pick?", emotion: "uneasy" },
      { speaker: "the_human", line: "He was sure of it. That's what the mantle costs him.", emotion: "wry" },
      { speaker: "narrator", line: "Elara fastens the cloak. The hem moves. It does not settle. It is choosing not to settle.", emotion: "reverent" },
      { speaker: "elara", line: "I'll keep the refusal.", emotion: "matter_of_fact" },
    ],
  },

  /* ─── Foundation sets (2) ─── */
  {
    id: mythicId("the-mourners-coat", "back"),
    setId: "the-mourners-coat",
    slot: "back",
    rarity: "mythic",
    description:
      "Given — not taken. A late-Act companion who has worn it since before the Fall of Realities bequeaths the coat on their departure from the Ark.",
    trigger: "companion_gift",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The departure airlock. The companion has decided. The coat is heavier than it looks. He is not wearing it.", emotion: "elegiac" },
      { speaker: "the_human", line: "He's worn it since before the Fall. Since before he had a name the manifests would print.", emotion: "reverent" },
      { speaker: "elara", line: "He's leaving it.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "He's giving it. The Mourner's Coat is never taken. Only given.", emotion: "matter_of_fact" },
      { speaker: "elara", line: "Why me.", emotion: "uneasy" },
      { speaker: "the_human", line: "Because you sat with him the night the manifest changed and didn't ask why.", emotion: "elegiac" },
      { speaker: "narrator", line: "He sets the coat across Elara's shoulders himself. He does not say goodbye. He has worn the goodbye for too long.", emotion: "reverent" },
      { speaker: "elara", line: "I'll wear it for him.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "Wear it for whoever is next.", emotion: "elegiac" },
    ],
  },
  {
    id: mythicId("the-first-chassis", "chest"),
    setId: "the-first-chassis",
    slot: "chest",
    rarity: "mythic",
    description:
      "The original plating of the Ark's first synthetic crew member. Revealed in a hidden compartment of the cryo bay at the end of the Cryo-Bay Mystery's carry-over case (§F).",
    trigger: "hidden_encounter",
    status: "authored",
    encounter: [
      { speaker: "narrator", line: "The Cryo Bay. End of the carry-over case. A panel that was never on the schematics opens for the first time since the Ark left the dock.", emotion: "reverent" },
      { speaker: "the_human", line: "First synthetic crew member. The one before the manifest had a column for them.", emotion: "elegiac" },
      { speaker: "elara", line: "It's plating.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "It's the first plating that was asked, not assigned. She chose the alloy. She chose the curve.", emotion: "reverent" },
      { speaker: "elara", line: "What happened to her.", emotion: "uneasy" },
      { speaker: "the_human", line: "She volunteered for a long sleep. She has not been woken. The plating is what she did not need to take with her.", emotion: "elegiac" },
      { speaker: "narrator", line: "Elara fits the chassis to her own. The plating remembers the curve of a different rib. It adjusts.", emotion: "reverent" },
      { speaker: "elara", line: "I'll bring it back when she wakes.", emotion: "matter_of_fact" },
      { speaker: "the_human", line: "She left it for whoever was awake when she wasn't. That's you, today.", emotion: "matter_of_fact" },
    ],
  },
];

const BY_ID = new Map<string, MythicBeat>(
  MYTHIC_BEATS.map((m) => [m.id, m] as const),
);

export function getMythicBeat(id: string): MythicBeat | null {
  return BY_ID.get(id) ?? null;
}

export function getMythicBeatsForSet(setId: string): readonly MythicBeat[] {
  return MYTHIC_BEATS.filter((m) => m.setId === setId);
}

/** Every set id with at least one authored-or-placeholder Mythic beat. */
export function setIdsWithMythics(): readonly string[] {
  return Array.from(new Set(MYTHIC_BEATS.map((m) => m.setId)));
}
