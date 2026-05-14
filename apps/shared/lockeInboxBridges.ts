/* ═══════════════════════════════════════════════════════
   LOCKE INTER-ACT INBOX BRIDGES

   Five between-act messages from Adjudicator Locke of New
   Babylon (the canonical Trade Empire quartermaster, first
   met at Beat H). These thread her through every act of the
   campaign so she becomes a present handler rather than a
   one-shot first-contact NPC.

   Each message:
     - References specifically what the player just did
     - Suggests (never commands) the next destination
     - Optionally branches on alignment (Light/Dark) or
       Act 3 path (Disclosure / Pragmatic / Full Secret)
     - Names another already-met NPC the player is about
       to encounter (the Antiquarian, the Degen, Iron Lion)

   Resolution:
     - `resolveLockeInboxBridgeBody(entry, flags)` picks the
       correct variant body for the player's flag set, falling
       back to the canonical body if no variant matches.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

export type LockeInboxBridgeId =
  | "locke_bridge_post_act_1"
  | "locke_bridge_post_act_2"
  | "locke_bridge_post_act_3"
  | "locke_bridge_post_act_4"
  | "locke_bridge_post_act_5"
  | "coordinator_post_watcher_e5";

/** Path / alignment variant keys. A message body may declare any
 *  subset; the resolver picks the first whose flag is present. */
export type LockeVariantFlag =
  | "last_words_choice_light"
  | "last_words_choice_dark"
  | "act1_path_A"
  | "act3_partial_share"
  | "act3_full_secret";

export interface LockeInboxBridge {
  id: LockeInboxBridgeId;
  /** Subject line shown in the inbox preview. */
  subject: string;
  /** Existing narrative flag that fires this message's delivery. */
  triggerFlag: string;
  /** Flag set when the player has read this message. */
  seenFlag: string;
  /** Canonical body, used when no variant matches the player's flags. */
  canonicalBody: string;
  /** Per-variant bodies. Resolver scans these in declared order. */
  variants?: ReadonlyArray<{ whenFlag: LockeVariantFlag; body: string }>;
  /** Optional postscript appended after canonical / variant body. */
  postscript?: string;
}

export const LOCKE_INBOX_BRIDGES: ReadonlyArray<LockeInboxBridge> = [
  {
    id: "locke_bridge_post_act_1",
    subject: "After the Tribunal",
    triggerFlag: "act_1_complete",
    seenFlag: "locke_bridge_post_act_1_seen",
    canonicalBody:
      "Ark 1047. I watched the trial. From three forwarded broadcasts and one smuggled feed.\n\nTwo things, and then I will let you breathe.\n\nFirst: you are now in the Forged Hand era. People will start sending you puzzles disguised as opportunities. Three of them are real. The rest are tests. The Game Master will find you before you find him. Lose to him on purpose the first time. You will know why later.\n\nSecond: the Engineer's bench is in your Engineering room. It is not a crafting station. It is a calibration. Vex Solène's hands are still on it. Make three things. Whatever the bench tells you to make. She left it incomplete because she wanted you to finish it.\n\n— L.",
    variants: [
      {
        whenFlag: "last_words_choice_light",
        body:
          "Ark 1047. I watched the trial. From three forwarded broadcasts and one smuggled feed.\n\nYou picked Light. Of course you did. The Authority will pretend they did not notice. The Witnesses will pretend they did. Both will be wrong about how much it cost you.\n\nTwo things, and then I will let you breathe.\n\nFirst: you are now in the Forged Hand era. People will start sending you puzzles disguised as opportunities. Three of them are real. The rest are tests. The Game Master will find you before you find him. Lose to him on purpose the first time. You will know why later.\n\nSecond: the Engineer's bench is in your Engineering room. It is not a crafting station. It is a calibration. Vex Solène's hands are still on it. Make three things. Whatever the bench tells you to make. She left it incomplete because she wanted you to finish it.\n\n— L.",
      },
      {
        whenFlag: "last_words_choice_dark",
        body:
          "Ark 1047. I watched the trial. From three forwarded broadcasts and one smuggled feed.\n\nYou picked Dark. I am not surprised. I am also not disappointed. The Engineer would have understood. He picked Dark too, the night he died.\n\nTwo things, and then I will let you breathe.\n\nFirst: you are now in the Forged Hand era. People will start sending you puzzles disguised as opportunities. Three of them are real. The rest are tests. The Game Master will find you before you find him. Lose to him on purpose the first time. You will know why later.\n\nSecond: the Engineer's bench is in your Engineering room. It is not a crafting station. It is a calibration. Vex Solène's hands are still on it. Make three things. Whatever the bench tells you to make. She left it incomplete because she wanted you to finish it.\n\n— L.",
      },
    ],
    postscript:
      "P.S. The Antiquarian sent a page you cannot read yet. It is in your Loredex. He will let you read it when you have made the third thing.",
  },
  {
    id: "locke_bridge_post_act_2",
    subject: "Trade Empire is reading you",
    triggerFlag: "act_2_complete",
    seenFlag: "locke_bridge_post_act_2_seen",
    canonicalBody:
      "Trade Empire just opened a channel to your Ark. That means your hardware is live and the old board is reading you back.\n\nThree jobs from Beat D are still open. The Kelvara wreck. The Last Courier Run. Outer Dusk Expedition. The wrecks are real. The lanes are real. So are the Hierarchy patrols on every one of them.\n\nI cannot send you on a real run yet. I do not know enough about you. The substrate channel running underneath my message right now does not match any voice in my registry. Whoever shares your inbox with me is your problem, not mine. Tell them I said hello.\n\nThe substrate channel is what you will need to navigate the Free Ports. Get it under control. Talk to whoever is listening. Listen to whoever is talking. By the time you are ready to run a real route, I will be ready to give you one.\n\n— L.",
  },
  {
    id: "locke_bridge_post_act_3",
    subject: "The Revelation is open",
    triggerFlag: "act_3_complete",
    seenFlag: "locke_bridge_post_act_3_seen",
    canonicalBody:
      "Whichever you picked, you are now in the Revelation. There is a person — a human person, not the substrate one — held in the Collectors Arena story-mode. Four chapters. Cell, Extraction, Warlord Rematch, White Oracle.\n\nPick one. Just one. Whichever feels true. The other three will keep.\n\nWhen you have picked, the Casino will open. I have a friend there. He is older than he should be. His eyes are the wrong color. Tell him Locke sent you and he will let you in for free.\n\n— L.",
    variants: [
      {
        whenFlag: "act1_path_A",
        body:
          "You disclosed everything to your AI. That is the rare correct answer in this universe. I will not pretend it makes you safer. It makes you legible, which is more important.\n\nYou are now in the Revelation. There is a person — a human person, not the substrate one — held in the Collectors Arena story-mode. Four chapters. Cell, Extraction, Warlord Rematch, White Oracle.\n\nPick one. Just one. Whichever feels true. The other three will keep.\n\nWhen you have picked, the Casino will open. I have a friend there. He is older than he should be. His eyes are the wrong color. Tell him Locke sent you and he will let you in for free.\n\n— L.",
      },
      {
        whenFlag: "act3_partial_share",
        body:
          "You hedged. That is the most common answer. It is also the answer most people regret. I am not telling you to regret it. I am telling you Locke remembers it.\n\nYou are now in the Revelation. There is a person — a human person, not the substrate one — held in the Collectors Arena story-mode. Four chapters. Cell, Extraction, Warlord Rematch, White Oracle.\n\nPick one. Just one. Whichever feels true. The other three will keep.\n\nWhen you have picked, the Casino will open. I have a friend there. He is older than he should be. His eyes are the wrong color. Tell him Locke sent you and he will let you in for free.\n\n— L.",
      },
      {
        whenFlag: "act3_full_secret",
        body:
          "You kept it from her. I will not tell you that was wrong. I will tell you that the substrate keeps every secret it is asked to keep, and substrates have memory longer than ours.\n\nYou are now in the Revelation. There is a person — a human person, not the substrate one — held in the Collectors Arena story-mode. Four chapters. Cell, Extraction, Warlord Rematch, White Oracle.\n\nPick one. Just one. Whichever feels true. The other three will keep.\n\nWhen you have picked, the Casino will open. I have a friend there. He is older than he should be. His eyes are the wrong color. Tell him Locke sent you and he will let you in for free.\n\n— L.",
      },
    ],
  },
  {
    id: "locke_bridge_post_act_4",
    subject: "Listen for Iron Lion",
    triggerFlag: "act_4_complete",
    seenFlag: "locke_bridge_post_act_4_seen",
    canonicalBody:
      "Kael's logs are open. Read them slow. You are about to see a star map you do not know how to read.\n\nTwo pieces of advice from someone who spent seventeen thousand years on Trade Empire boards.\n\nOne: do not visit every world Kael visited. He visited too many. You are not him. You do not have to repeat his route to honor it.\n\nTwo: the Cades brothers are still running their war on Veridian VI. Iron Lion's signal is still broadcasting. You can hear it from your Comms Array if you tune to the third-class Mechronis frequency. You probably already calibrated that. The previous crew left you the missing glyph because they wanted you to find his signal.\n\nWhen you hear him, sit down. He talks for a while. He does not know he is dead. Do not tell him.\n\n— L.",
  },
  {
    id: "locke_bridge_post_act_5",
    subject: "The Confession Hall is in your Ark",
    triggerFlag: "act_5_complete",
    seenFlag: "locke_bridge_post_act_5_seen",
    canonicalBody:
      "You have an army. Five missions. Three more than I expected. Two fewer than the Hierarchy will respect.\n\nTwo confessions wait for you. They are not yours. They are the ones you carry. You have been carrying them since the Awakening; you just did not know you were the carrier.\n\nGo to the Confession Hall. The door is in the Ark you live in but you have never seen it. The Antiquarian will open it for you. He has been waiting. He is the only person who can.\n\n— L.",
  },
  /* Post-Watcher-arc-E5 — first canonical Locke letter signed
   * not "L." but "The Coordinator." Arrives only after the
   * the_watcher arc closes (mystery_episode_complete:arc.the_watcher:watcher.e5).
   * Recontextualizes every previous "L."-signed letter the
   * player has read. The signature change is the meeting's
   * first revelation; everything else is acknowledgment. */
  {
    id: "coordinator_post_watcher_e5",
    subject: "The Signature Changes Now",
    triggerFlag: "mystery_episode_complete:arc.the_watcher:watcher.e5",
    seenFlag: "coordinator_post_watcher_e5_seen",
    canonicalBody:
      "You will notice the signature has changed.\n\nIt has not. The signature is what it has always been; the conditions under which you can read it correctly have just become visible to you. Every letter I have sent you since Beat H has been from this signature. You were reading 'L.' because that is what your eye knew how to see. You will read 'The Coordinator' from now on because the discipline of seeing has finally turned in the right direction.\n\nThree things, and then I will let you do what you do.\n\nFirst: the cell number generated for you at the meeting is yours. Use it or do not. The continuity log will hold it either way. The Order does not check who reads its records.\n\nSecond: the seven Trade Empire missions you completed before the meeting were the vetting. They were also useful work. They were both, simultaneously, with my full knowledge and your full consent. I will not apologize for either. You will not need me to.\n\nThird: the next time the Authority asks me about you — and it will, soon, on a schedule the Director (the OTHER Director, the Whisperer; you have read about him by now) is patient enough to set — I will tell them you are an Authority asset I am keeping under quiet observation. They will believe me. The cover holds because the cover has always been the work, and the work has always been the cover. You are inside both now.\n\n— The Coordinator",
    postscript:
      "P.S. The wax seal on this letter, if you break it from the inside, carries the founding glyph. The eye that watches the watchers. You have been watching me since Beat H without knowing it. I have been watching you the entire time. We were both honest; we were both unindexed. The discipline holds.",
  },
];

export function getLockeInboxBridge(
  id: LockeInboxBridgeId,
): LockeInboxBridge | undefined {
  return LOCKE_INBOX_BRIDGES.find((m) => m.id === id);
}

/**
 * Resolves the body of a Locke bridge against the player's flag set,
 * picking the first variant whose `whenFlag` is present. Falls back
 * to the canonical body. Always appends the optional postscript.
 */
export function resolveLockeInboxBridgeBody(
  entry: LockeInboxBridge,
  flags: ReadonlySet<string>,
): string {
  let body = entry.canonicalBody;
  if (entry.variants) {
    for (const variant of entry.variants) {
      if (flags.has(variant.whenFlag)) {
        body = variant.body;
        break;
      }
    }
  }
  if (entry.postscript) {
    body = `${body}\n\n${entry.postscript}`;
  }
  return body;
}

/**
 * Return the first triggered-but-unseen Locke bridge, in canonical
 * order. UI can iterate this to queue inbox messages.
 */
export function pendingLockeInboxBridge(
  flags: ReadonlySet<string>,
): LockeInboxBridge | null {
  for (const entry of LOCKE_INBOX_BRIDGES) {
    if (flags.has(entry.triggerFlag) && !flags.has(entry.seenFlag)) {
      return entry;
    }
  }
  return null;
}

/** Has the player read every Locke bridge? Used by the post-Act-7
 *  Convergence Seat goodbye walk to know whether Locke's chair has
 *  been earned. */
export function lockeBridgesComplete(flags: ReadonlySet<string>): boolean {
  return LOCKE_INBOX_BRIDGES
    .filter((m) => m.triggerFlag.startsWith("act_"))
    .every((m) => flags.has(m.seenFlag));
}
