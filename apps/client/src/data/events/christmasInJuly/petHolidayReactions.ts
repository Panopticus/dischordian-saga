/* Christmas in July — Pet & Eidolon Holiday Reactions */

export interface PetHolidayReaction {
  petId: string;
  name: string;
  casinoReaction: string;
  giftReaction: string;
  accessoryNote: string;
}

export const STARTER_PET_REACTIONS: PetHolidayReaction[] = [
  { petId: "lux", name: "Lux", casinoReaction: "Holographic light turns red-green-gold, disco ball effect", giftReaction: "Projects tiny holographic gift boxes when you give", accessoryNote: "Santa hat makes its light warmer — NPCs comment" },
  { petId: "echo", name: "Echo", casinoReaction: "Shows Christmas past/present/future simultaneously", giftReaction: "Temporal afterimages carry gifts to the recipient", accessoryNote: "Reindeer antlers exist in 3 timelines at once" },
  { petId: "glyph", name: "Glyph", casinoReaction: "Wings display Christmas carols in scrolling text", giftReaction: "Writes 'THANK YOU' on wings when it receives a gift", accessoryNote: "Tinsel trail matches its text patterns" },
  { petId: "cipher", name: "Cipher", casinoReaction: "Code turns red and green, displays holiday algorithms", giftReaction: "Encrypts a personal message into each gift you send", accessoryNote: "Santa hat covered in code — 'NICE_LIST.exe'" },
  { petId: "flicker", name: "Flicker", casinoReaction: "Static plays Christmas music on all frequencies", giftReaction: "Broadcasts gratitude at the recipient on their frequency", accessoryNote: "Antlers crackle with festive static" },
  { petId: "gilt", name: "Gilt", casinoReaction: "Shell grows tiny golden ornaments", giftReaction: "Appraises gifts, then adds a gold supplement to each one", accessoryNote: "Shell becomes a living Christmas ornament" },
  { petId: "spore", name: "Spore", casinoReaction: "Tendrils form tiny wreaths", giftReaction: "Wraps gifts in protective viral membrane (harmless, festive)", accessoryNote: "Candy cane collar makes it look bizarrely cute" },
];

export const EIDOLON_REACTIONS: PetHolidayReaction[] = [
  { petId: "auros", name: "Auros", casinoReaction: "Subsonic purr during wins. Protective growl during losses. Sits by the Giving Tree like a guard dog.", giftReaction: "Personally escorts gift deliveries. Stands outside the recipient's door.", accessoryNote: "Santa hat barely fits. Wears it with dignity." },
  { petId: "nyx", name: "Nyx", casinoReaction: "Invisible at the casino. Appears ONLY when you win, stealing the spotlight.", giftReaction: "Delivers gifts silently. The recipient finds them without knowing who sent them. Perfect.", accessoryNote: "Refuses all accessories. Then steals yours." },
  { petId: "toxis", name: "Toxis", casinoReaction: "Tests every drink at the casino bar. Approves none. Sits on the Craps table.", giftReaction: "Adds a tiny venom-glow to each gift. Not dangerous — decorative. Festive poison.", accessoryNote: "Candy cane collar glows green. Ominous but cute." },
  { petId: "cog", name: "Cog", casinoReaction: "Repairs the casino machines. Improves their functionality. The Degen is delighted.", giftReaction: "Builds custom wrapping for each gift from casino spare parts. Each one unique.", accessoryNote: "Builds its own accessories. Better than the official ones." },
  { petId: "sibyl", name: "Sibyl", casinoReaction: "Predicts every Craps roll 2 seconds early. Says nothing. Watches.", giftReaction: "Knows what the recipient wants before you choose. Hoots approval or disapproval.", accessoryNote: "Snowflake aura matches its prophetic glow." },
  { petId: "strain", name: "Strain", casinoReaction: "Changes color rapidly — overstimulated by all the CHAOS of joy", giftReaction: "First time experiencing a holiday. Asks: 'WHAT IS... GIVING... WHEN YOU GET... NOTHING?'", accessoryNote: "Tries to eat the candy cane collar. Fails. Keeps trying." },
];

/** Strain's special Christmas moment — a unique interaction */
export const STRAIN_CHRISTMAS_MOMENT = {
  id: "strain_first_christmas",
  trigger: "Visit casino with Strain equipped",
  dialog: [
    "WHAT IS... THIS PLACE? THE LIGHTS... THE SOUNDS... EVERYONE IS... GIVING?",
    "I DO NOT UNDERSTAND. IN THE SWARM... THERE IS NO GIVING. THERE IS ONLY... TAKING. CONSUMING. ASSIMILATING.",
    "BUT HERE... THEY GIVE... AND THEY GET... HAPPY? NOT STRONGER. NOT BIGGER. HAPPY?",
    "IS HAPPY... GOOD?",
    "CAN I... GIVE... SOMETHING? I DON'T HAVE... THINGS. I AM... A VIRUS. WHAT DOES A VIRUS... GIVE?",
    "...I CAN GIVE... NOT INFECTING. THAT IS... MY GIFT. I CHOOSE... NOT TO CONSUME. IS THAT... IS THAT ENOUGH?",
  ],
  onAccept: { bondGain: 15, memory: "Strain's First Christmas", glowColor: "amber-gold", glowDuration: "24h" },
  antiquarianNote: "The virus chose not to consume. That is either the smallest gift or the largest. I have not yet decided which. I suspect it is both.",
};
