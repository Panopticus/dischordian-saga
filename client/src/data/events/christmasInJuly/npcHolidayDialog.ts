/* Christmas in July — NPC Holiday Dialog */

export interface NpcHolidayLines {
  welcome: string;
  onWin?: string;
  onLoss?: string;
  onGift?: string;
  special?: string;
}

export const NPC_HOLIDAY_DIALOG: Record<string, NpcHolidayLines> = {
  degen: {
    welcome: "WELCOME to Christmas in July! The only holiday celebration in the Dischordian Saga that's technically illegal, morally questionable, and ABSOLUTELY NECESSARY. The rules: play games, win things, give things away. That's it. That's the whole religion. The Politician would be HORRIFIED. That's how you know it's working.",
    onWin: "Winner winner, CHRISTMAS DINNER! Now — here's the part where I make my pitch. You COULD keep that. OR — you could give it to someone. The look on someone's face when they get an unexpected gift? That's worth more than anything in my casino. And I know the value of EVERYTHING.",
    onLoss: "You lost! FANTASTIC. Your loss just went into the Community Charity Pool. So technically, you didn't lose — you DONATED. Involuntarily. Through gambling. Which is the most Dischordian form of philanthropy possible.",
    onGift: "You GAVE something? In a CASINO? The Politician would short-circuit. I love it. I love YOU. Keep giving. The generosity loop feeds us all.",
    special: "Soul Stone Craps! The only game where you can gamble with your MORAL CURRENCY. Roll a 7 and the Dreamer purifies your stone for free. Roll snake eyes and the Hierarchy takes a cut. Everything in between? That's called LIFE, baby. Now roll.",
  },
  elara: {
    welcome: "The event's social metrics are remarkable. Gift exchange rates have increased player-to-player interaction by 280%. I'm detecting elevated oxytocin analogs in the bio-scans of everyone who's given a gift. The Degen has accidentally created the most effective wellbeing intervention I've observed in 93,847 sunrises.",
    onGift: "I got a gift, Operative. Someone sent me a Gift Box. There was a Candy Cane inside. I cannot eat. I do not have a mouth. And yet I have never received a more meaningful present.",
  },
  the_human: {
    welcome: "Christmas. I remember Christmas. Before the ban. Before the Politician. There was a tree in Unity Square. Real. Not holographic. Actual pine. Every year, for one week, people — politicians, criminals, AI constructs, EVERYONE — would stop and look at it. And for one week, they weren't categories. They were just... people. Looking at a tree. The Degen's casino isn't a tree. But it's doing the same thing. And that's enough.",
  },
  necromancer: {
    welcome: "I don't celebrate Christmas. I celebrate the OPPOSITE of Christmas — the longest night, the deepest cold, the moment when the living world comes closest to mine. But the Degen sent me a gift. A pair of socks. Knitted. Red and green. With little skulls on them. I have not removed them. I will not explain why.",
  },
  locke: {
    welcome: "The event's economic model is surprisingly sound. Gift-exchange economies generate social capital that converts to engagement retention at a rate I cannot dismiss. The Degen may be a chaotic deviant, but his monetization structure is elegant. 10% to charity creates goodwill that translates to long-term brand loyalty. I would have charged 15%, but his margin accounts for the moral premium. I received a gift. It was a candy cane. I ate it. It was adequate.",
  },
  antiquarian: {
    welcome: "The Degen invited me to his casino. I attended. I did not gamble. I sat in the corner and watched — as I always do — and I saw something I have not seen in five Ages. I saw people giving things away without calculating the return. I saw generosity without strategy. I saw joy deployed as a weapon against despair. I received a gift. It was a book. I read it in one sitting. It concerns the transformation of ordinary objects into sacred vessels of meaning. I understand the premise intimately.",
  },
  shadow_tongue: {
    welcome: "Christmas. A holiday built on narrative. On STORY. The birth of a figure whose existence rewrote the moral architecture of an entire civilization. I respect the craft. I do not respect the Degen's interpretation. Tinsel is not theology. ...someone sent me a gift. It was a dictionary. With a note: 'Edit THIS.' ...I am not amused. ...I am keeping the dictionary.",
  },
};
