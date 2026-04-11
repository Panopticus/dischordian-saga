/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — CREW INTEGRATION

   The crew doesn't just exist during Christmas in July —
   they LIVE it. They exchange gifts among themselves, get
   drunk at the casino, gamble their rations, form holiday
   romances, and occasionally cause festive emergencies.

   The Degen loves having a crew to fleece.
   Elara worries about morale spikes.
   The Resurrectionist does not understand "fun."

   Systems:
   - Crew Holiday Activity Feed (ambient ticker entries)
   - Crew Gift Exchange (autonomous crew-to-crew gifting)
   - Crew Casino Events (crew gambling with consequences)
   - Crew Holiday Danger Events (festive emergencies)
   - Crew Bloodline Holiday Bonuses
   - Crew Holiday Morale System
   ═══════════════════════════════════════════════════════ */

/* ─── CREW HOLIDAY MORALE ─── */

export interface CrewHolidayMorale {
  /** Base morale boost from the event being active (+10 to all crew) */
  baseBoost: number;
  /** Bonus per gift the player sends (crew sees generosity) */
  perGiftSent: number;
  /** Bonus per community milestone reached */
  perMilestone: number;
  /** Penalty if player gambles away 50+ tokens in a day (crew notices) */
  gamblingPenalty: number;
  /** Bonus if player completes daily challenge streak */
  streakBonus: number;
}

export const CREW_HOLIDAY_MORALE: CrewHolidayMorale = {
  baseBoost: 10,
  perGiftSent: 2,
  perMilestone: 5,
  gamblingPenalty: -8,
  streakBonus: 3,
};

/* ─── CREW GIFT EXCHANGE (autonomous crew-to-crew) ─── */

export interface CrewGiftEvent {
  id: string;
  gifterRole: string;
  recipientRole: string;
  giftDescription: string;
  recipientReaction: string;
  moraleEffect: { gifter: number; recipient: number };
  feedText: string;
}

export const CREW_GIFT_EXCHANGES: CrewGiftEvent[] = [
  {
    id: "nav_to_eng", gifterRole: "navigator", recipientRole: "engineer",
    giftDescription: "a hand-drawn star chart of the navigator's favorite constellation",
    recipientReaction: "The engineer framed it above their workbench. It's technically inaccurate. They don't care.",
    moraleEffect: { gifter: 5, recipient: 8 },
    feedText: "Crew Quarters: [GIFTER] gave [RECIPIENT] a hand-drawn star chart. [RECIPIENT] hasn't stopped looking at it.",
  },
  {
    id: "med_to_sec", gifterRole: "medic", recipientRole: "security",
    giftDescription: "a first-aid kit with a candy cane taped to the top",
    recipientReaction: "The Security Officer ate the candy cane during night watch. Logged it as 'tactical sugar intake.'",
    moraleEffect: { gifter: 4, recipient: 6 },
    feedText: "Armory: [GIFTER] left a first-aid kit for [RECIPIENT]. The candy cane was gone within the hour.",
  },
  {
    id: "sci_to_comms", gifterRole: "scientist", recipientRole: "comms_officer",
    giftDescription: "a decoded signal fragment that plays a pre-Fall holiday song",
    recipientReaction: "The Comms Officer broadcast it ship-wide at 0300. Nobody complained.",
    moraleEffect: { gifter: 6, recipient: 10 },
    feedText: "Comms Array: [GIFTER] decoded a pre-Fall holiday song for [RECIPIENT]. The whole ship heard it at 3 AM. Nobody minded.",
  },
  {
    id: "trader_to_quarter", gifterRole: "trader", recipientRole: "quartermaster",
    giftDescription: "a crate of 'imported' eggnog from the Free Ports (origin unverified)",
    recipientReaction: "The Quartermaster tested it for contaminants. Clean. Suspiciously delicious.",
    moraleEffect: { gifter: 5, recipient: 7 },
    feedText: "Cargo Bay: [GIFTER] smuggled eggnog aboard. [RECIPIENT] insists on calling it 'festive cargo.'",
  },
  {
    id: "sec_to_nav", gifterRole: "security", recipientRole: "navigator",
    giftDescription: "their personal sidearm, cleaned and engraved with the navigator's name",
    recipientReaction: "The Navigator has never held a weapon. They sleep with it under their pillow now.",
    moraleEffect: { gifter: 8, recipient: 5 },
    feedText: "Bridge: [GIFTER] gave [RECIPIENT] an engraved sidearm. [RECIPIENT] doesn't know which end is which. Keeps it anyway.",
  },
  {
    id: "quarter_to_med", gifterRole: "quartermaster", recipientRole: "medic",
    giftDescription: "extra ration packs labeled 'For the one who keeps us alive'",
    recipientReaction: "The Medic cried in their quarters. Elara pretended not to notice.",
    moraleEffect: { gifter: 4, recipient: 12 },
    feedText: "Medical Bay: [GIFTER] left extra rations for [RECIPIENT] with a note. [RECIPIENT] was seen smiling for hours.",
  },
  {
    id: "eng_to_sci", gifterRole: "engineer", recipientRole: "scientist",
    giftDescription: "a jury-rigged data viewer that runs 40% faster than the standard model",
    recipientReaction: "The Scientist immediately disassembled it to understand how it works. The Engineer is not offended. They expected this.",
    moraleEffect: { gifter: 5, recipient: 9 },
    feedText: "Archives: [GIFTER] built [RECIPIENT] a custom data viewer. [RECIPIENT] took it apart immediately. Both are happy.",
  },
  {
    id: "comms_to_all", gifterRole: "comms_officer", recipientRole: "quartermaster",
    giftDescription: "a recorded message from a distant Ark's crew wishing them happy holidays",
    recipientReaction: "The Quartermaster played it during the mess hall dinner. The room went very quiet, then very loud.",
    moraleEffect: { gifter: 6, recipient: 8 },
    feedText: "Mess Hall: [GIFTER] intercepted a holiday message from another Ark. [RECIPIENT] played it at dinner. Everyone cried. Then cheered.",
  },
];

/* ─── CREW CASINO EVENTS ─── */

export interface CrewCasinoEvent {
  id: string;
  description: string;
  feedText: string;
  moraleEffect: number;
  severity: "info" | "warning" | "alert";
}

export const CREW_CASINO_EVENTS: CrewCasinoEvent[] = [
  { id: "crew_wins_big", description: "A crew member hit the wheel and won big", feedText: "Trade Hub: [CREW_NAME] won 25 Dream Tokens at the Degen's Wheel. The mess hall heard the scream from three decks away.", moraleEffect: 5, severity: "info" },
  { id: "crew_loses_rations", description: "A crew member gambled their dessert rations", feedText: "Trade Hub: [CREW_NAME] bet their dessert rations at the craps table. Lost. The Degen offered a consolation candy cane.", moraleEffect: -2, severity: "info" },
  { id: "crew_secret_santa", description: "Crew organized their own Secret Santa", feedText: "Captain's Quarters: The crew organized a Secret Santa without telling you. [CREW_NAME] got a hand-carved figurine. [CREW_NAME] got socks. Both are happy.", moraleEffect: 8, severity: "info" },
  { id: "crew_decorates_ship", description: "Crew decorated the Ark without permission", feedText: "Bridge: The crew decorated all six decks overnight. Tinsel in Engineering. Lights in the Armory. Elara: 'I did not authorize this. I am not removing it.'", moraleEffect: 10, severity: "info" },
  { id: "crew_eggnog_incident", description: "The eggnog incident", feedText: "Medical Bay: The 'Free Ports eggnog' was stronger than anticipated. [CREW_NAME] and [CREW_NAME] found singing in the observation deck at 0400. No disciplinary action taken. It's Christmas.", moraleEffect: 3, severity: "warning" },
  { id: "crew_gambling_debt", description: "A crew member owes the Degen", feedText: "Trade Hub: [CREW_NAME] owes the Degen 40 Festive Tokens. The Degen says the debt is 'forgiven in the spirit of the season.' [CREW_NAME] does not trust this.", moraleEffect: -3, severity: "warning" },
  { id: "crew_craps_miracle", description: "Crew member rolled boxcars", feedText: "Trade Hub: [CREW_NAME] rolled BOXCARS at the craps table. The Degen threw confetti. The Resurrectionist asked why everyone was screaming.", moraleEffect: 12, severity: "info" },
  { id: "crew_abyssal_christmas", description: "Abyssal crew member experiences first holiday", feedText: "Observation Deck: [CREW_NAME] (House Mol'Kari) asked what 'Christmas' means. [CREW_NAME] tried to explain. 'So you celebrate... by giving things away? On purpose? This is the opposite of the Abyss.' Long pause. '...I like it.'", moraleEffect: 15, severity: "info" },
  { id: "crew_gift_to_player", description: "Crew pooled resources for a gift to the Captain", feedText: "Captain's Quarters: Your crew left a gift outside your door. A hand-made ornament with everyone's name etched in. Note: 'For the one who cloned us. — Your Crew.'", moraleEffect: 15, severity: "info" },
  { id: "crew_resurrectionist_confused", description: "The Resurrectionist doesn't understand Christmas", feedText: "Cryo Bay: [CREW_NAME] tried to explain Christmas to the Resurrectionist. 'You celebrate a birth. I facilitate births. Am I... Christmas?' The conversation did not improve from there.", moraleEffect: 5, severity: "info" },
];

/* ─── CREW HOLIDAY DANGER EVENTS ─── */

export interface CrewHolidayDanger {
  type: string;
  severity: "minor" | "serious" | "critical";
  description: string;
  choices: { label: string; description: string; successChance: number; cost?: { dream?: number; salvage?: number } }[];
}

export const CREW_HOLIDAY_DANGERS: CrewHolidayDanger[] = [
  {
    type: "system_malfunction", severity: "minor",
    description: "FESTIVE EMERGENCY: [CREW_NAME] strung holiday lights through Engineering's main power conduit. The lights are beautiful. The power grid is not.",
    choices: [
      { label: "Let the engineer fix it", description: "Standard repair. The lights come down. Morale takes a hit.", successChance: 0.95 },
      { label: "Reroute power around the lights", description: "Keep the lights. Slight power reduction for 24 hours. Worth it?", successChance: 0.85, cost: { dream: 10 } },
    ],
  },
  {
    type: "quarantine_infection", severity: "serious",
    description: "FESTIVE EMERGENCY: The 'Free Ports eggnog' contained trace amounts of an unknown compound. [CREW_NAME] and [CREW_NAME] are showing symptoms: euphoria, generosity, and a compulsion to sing. The Medic isn't sure it's a disease.",
    choices: [
      { label: "Quarantine and observe", description: "Standard medical protocol. They'll be fine in 12 hours. The singing may continue.", successChance: 0.90 },
      { label: "Let it spread", description: "It's Christmas. The symptoms are... festive. What's the worst that could happen?", successChance: 0.70 },
      { label: "Ask the Source", description: "The Source says it's not the Thought Virus. He seems... amused? That's concerning.", successChance: 0.80 },
    ],
  },
  {
    type: "mutiny", severity: "serious",
    description: "FESTIVE CRISIS: [CREW_NAME] wants to give the Degen access to the Ark's mess hall for a proper Christmas dinner. Security says absolutely not. The crew is taking sides.",
    choices: [
      { label: "Allow the dinner, supervised", description: "Let the Degen cook. Post guards. What could go wrong?", successChance: 0.85, cost: { dream: 20 } },
      { label: "Compromise: Degen sends recipes", description: "He can't come aboard, but his recipes can. The Quartermaster cooks.", successChance: 0.95 },
      { label: "Deny the request", description: "Security protocols exist for a reason. Even at Christmas.", successChance: 1.0 },
    ],
  },
  {
    type: "boarding_action", severity: "critical",
    description: "FESTIVE EMERGENCY: An unregistered cargo pod has docked at Cargo Bay. It's wrapped in holographic gift paper. There's a tag: 'FROM: THE DEGEN. TO: ARK 1047. DO NOT OPEN UNTIL CHRISTMAS.' It's beeping.",
    choices: [
      { label: "Scan it first", description: "Full security scan. If it's a bomb, better to know. If it's a gift, the Degen will understand.", successChance: 0.90, cost: { dream: 15 } },
      { label: "Open it. It's Christmas.", description: "The Degen wouldn't... would he? It's Christmas. Have faith.", successChance: 0.75 },
      { label: "Jettison it", description: "You can't be too careful. The Degen will be hurt. The crew will be disappointed.", successChance: 1.0 },
    ],
  },
  {
    type: "genetic_degradation", severity: "minor",
    description: "FESTIVE ANOMALY: [CREW_NAME]'s genetic scan shows a temporary mutation — their tear ducts are overproducing. The Resurrectionist says it's 'an immune response to concentrated emotional stimulus.' The Medic says they're crying because someone gave them a gift.",
    choices: [
      { label: "It's not a medical issue", description: "They're just happy. Let them be happy.", successChance: 1.0 },
      { label: "Log it anyway", description: "Science is science, even at Christmas. The data might be useful.", successChance: 1.0 },
    ],
  },
];

/* ─── BLOODLINE HOLIDAY BONUSES ─── */

export interface BloodlineHolidayBonus {
  bloodlineId: string;
  bonusName: string;
  description: string;
  effect: { tokenMultiplier?: number; giftBonusTokens?: number; wheelLuckBonus?: number; crapsLuckBonus?: number };
}

export const BLOODLINE_HOLIDAY_BONUSES: BloodlineHolidayBonus[] = [
  { bloodlineId: "void_resonance", bonusName: "Resonant Generosity", description: "House Resonance's trade affinity makes their gifts more valuable. +2 bonus tokens per gift sent.", effect: { giftBonusTokens: 2 } },
  { bloodlineId: "iron_memory", bonusName: "Forge-Warmed Hearts", description: "The Ashkari remember every kindness. +10% Festive Token earnings.", effect: { tokenMultiplier: 0.10 } },
  { bloodlineId: "crimson_vigil", bonusName: "Vigilant Giving", description: "House Vigil watches over the gift exchange. +5% wheel luck during the event.", effect: { wheelLuckBonus: 0.05 } },
  { bloodlineId: "temporal_echo", bonusName: "Echoes of Holidays Past", description: "House Parallax sees Christmas across timelines. +5% craps luck (they've seen the dice before).", effect: { crapsLuckBonus: 0.05 } },
  { bloodlineId: "storm_circuit", bonusName: "Electric Joy", description: "House Voltane's energy makes the casino lights burn brighter. +1 bonus token per gift sent.", effect: { giftBonusTokens: 1 } },
  { bloodlineId: "lattice_prime", bonusName: "Precision Wrapping", description: "House Lattice wraps gifts with machine perfection. Gift Boxes crafted by Lattice crew cost 1 fewer token.", effect: { giftBonusTokens: 1 } },
  { bloodlineId: "echo_synthesis", bonusName: "Hybrid Holiday", description: "House Synthesis brings traditions from five species. +10% Festive Token earnings from diversity.", effect: { tokenMultiplier: 0.10 } },
  { bloodlineId: "terminus_aegis", bonusName: "Survivor's Christmas", description: "What survived Terminus celebrates harder. +5% to all holiday earnings.", effect: { tokenMultiplier: 0.05, giftBonusTokens: 1 } },
  { bloodlineId: "blood_weave", bonusName: "The Abyss Gives Back", description: "House Mol'Kari's first Christmas. The Blood Weave resonates with unfamiliar warmth. Xeth'Raal is confused. +3 bonus tokens per gift (the debt runs in reverse at Christmas).", effect: { giftBonusTokens: 3 } },
];

/* ─── ROLE-BASED HOLIDAY BONUSES ─── */

export interface RoleHolidayBonus {
  roleId: string;
  roleName: string;
  bonusDescription: string;
  effect: string;
}

export const ROLE_HOLIDAY_BONUSES: RoleHolidayBonus[] = [
  { roleId: "trader", roleName: "Trader", bonusDescription: "Your Trader negotiates bulk gift box discounts with the Degen.", effect: "Gift Boxes cost 4 Festive Tokens instead of 5" },
  { roleId: "quartermaster", roleName: "Quartermaster", bonusDescription: "The Quartermaster organized efficient gift logistics. Gifts arrive instantly.", effect: "Gift delivery time reduced to 0 (instant)" },
  { roleId: "comms_officer", roleName: "Comms Officer", bonusDescription: "The Comms Officer intercepts holiday transmissions from other Arks, boosting morale.", effect: "+5% Festive Token earnings from all sources" },
  { roleId: "medic", roleName: "Medic", bonusDescription: "The Medic distributes candy canes as 'preventive medicine.' Nobody argues.", effect: "Free Candy Cane +5% XP consumable daily" },
  { roleId: "security", roleName: "Security Officer", bonusDescription: "Security keeps the casino orderly. The Degen is grateful.", effect: "+3% wheel luck bonus" },
  { roleId: "scientist", roleName: "Scientist", bonusDescription: "The Scientist calculates optimal craps strategies.", effect: "+3% craps luck bonus" },
  { roleId: "navigator", roleName: "Navigator", bonusDescription: "The Navigator plots routes to other Arks for gift exchange.", effect: "+2 bonus tokens per gift sent to players on other servers" },
  { roleId: "engineer", roleName: "Engineer", bonusDescription: "The Engineer 'improved' the Degen's wheel. It now occasionally sparks festively.", effect: "+1 free wheel spin per day" },
];
