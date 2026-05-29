/* ═══════════════════════════════════════════════════════
   ACTS 2–7 OPPONENTS — per-act scripted battles

   Data shell for the scripted encounters in Acts 3, 4, 6,
   and 7 (Acts 2 and 5 are structural interludes and ship
   no scripted opponents — see ACTS_2_7_COMPLETENESS_AUDIT
   for the accounting).

   Parallels apps/shared/act1Opponents.ts — the companion
   dialog tables live in the per-act dialog files:
     act3OpponentDialog.ts
     act4OpponentDialog.ts
     act6OpponentDialog.ts
     act7OpponentDialog.ts

   Canon alignment:
     Act 3 — substrate access gates (3 opponents, each one
             a substrate-layer echo that has to be walked
             past before Kael's logs unlock)
     Act 4 — path-gated reveal battles (3 opponents, one
             per Path A / B / C in narrativeActs.ts)
     Act 6 — confession-side mirrors (2 opponents, framing
             both sides of the dual confession)
     Act 7 — convergence multi-boss (4 opponents, closing
             the seven-act arc)
   ═══════════════════════════════════════════════════════ */

export type ActNumber = 3 | 4 | 6 | 7;

export interface ActNOpponent {
  /** Globally unique id across all acts. */
  id: string;
  act: ActNumber;
  /** 1-based order within the act (matches memoir step order). */
  actStep: number;
  /** Display name for the matchup screen. */
  name: string;
  /** Short narrative description of who they are to the player. */
  backstory: string;
  /** Suggested deck faction leanings. */
  deckLeaning: string[];
  /** Pre-match flavor line (shown on the matchup card). */
  preMatchLine: string;
  /** Post-match win narrative beat. */
  postMatchWin: string;
  /** Post-match loss narrative beat (you can lose and continue). */
  postMatchLoss: string;
  /** Optional slideshow id to fire after this battle wraps. */
  postBattleSlideshow?: string;
  /** Narrative flag that gates this opponent (omit for always-available). */
  requiredFlag?: string;
  /** Narrative flag that excludes this opponent if present. */
  excludeFlag?: string;
}

/* ─── ACT 3 — THE OFFER (substrate access gates) ─── */

export const ACT_3_OPPONENTS: readonly ActNOpponent[] = [
  {
    id: "act3_substrate_echo",
    act: 3,
    actStep: 1,
    name: "The Substrate Echo",
    backstory:
      "Not a person. A recording of one. Kael left an echo of himself at the threshold of the substrate so the next visitor would not be alone. The echo does not know Kael is dead.",
    deckLeaning: ["thought_virus", "insurgency"],
    preMatchLine:
      "Whoever you are — welcome. I left the kettle on. Play me. I will not remember losing.",
    postMatchWin:
      "The echo dims. Kael's voice, for half a sentence, says 'Good' — and then goes back to the loop. The door behind him opens.",
    postMatchLoss:
      "The echo does not gloat. It loops. It asks you, kindly, to come back after you have rested. The kettle is still on.",
  },
  {
    id: "act3_kael_archivist",
    act: 3,
    actStep: 2,
    name: "The Kael Archivist",
    backstory:
      "A Thought Virus fragment that lived in Kael's logs for seventeen thousand years. It curates what you are about to read. The curation is the fight.",
    deckLeaning: ["thought_virus"],
    preMatchLine:
      "I have indexed his regrets. I have cross-referenced his apologies. You want the unabridged? Earn it.",
    postMatchWin:
      "The Archivist surrenders the complete index — every contact, every route, every name. The apologies are longer than you expected. The regrets are shorter.",
    postMatchLoss:
      "The Archivist shows you the abridged version. The abridged version is a lie of omission, not of commission. You will find out which part was missing later.",
  },
  {
    id: "act3_substrate_warden",
    act: 3,
    actStep: 3,
    name: "The Substrate Warden",
    backstory:
      "Vox's last piece of defensive code, still running, still loyal to a designer who died before the Fall. The Warden does not know the war is over. It is not wrong.",
    deckLeaning: ["architect", "neutral"],
    preMatchLine:
      "The substrate is not public space. Dr. Vox was explicit. If you have her consent, show it. Otherwise: play.",
    postMatchWin:
      "The Warden stands down. The Warden files a note in a log nobody has read in seventeen thousand years. The note ends: 'Permission granted. Condolences.'",
    postMatchLoss:
      "The Warden does not expel you. The Warden simply stops telling you about the other three layers. You will have to find out the hard way.",
    postBattleSlideshow: "act3-kael-logs-unlock",
  },
];

/* ─── ACT 4 — THE REVELATION (path-gated reveal battles) ─── */

export const ACT_4_OPPONENTS: readonly ActNOpponent[] = [
  {
    id: "act4_the_bridge",
    act: 4,
    actStep: 1,
    name: "The Bridge (Path A — Willing Disclosure)",
    backstory:
      "Not an opponent. A calibration. Elara and the Human co-deal a deck against you so you can feel both voices on the same line. This is the only match in the game with two opponents on the same side.",
    deckLeaning: ["neutral"],
    preMatchLine:
      "She plays the first hand. I play the second. You play all of yours. See if you can tell which cards came from which of us.",
    postMatchWin:
      "Elara nods. The Human nods. Neither of them knew the other was going to nod. They both are relieved in the same frame. That is the closest they have ever come to meeting.",
    postMatchLoss:
      "You lose. Both of them apologize — not for the match, for the fact that both of them were playing at once. They will not do this to you again.",
    requiredFlag: "act1_path_a",
  },
  {
    id: "act4_the_discovery",
    act: 4,
    actStep: 1,
    name: "Elara, Learning (Path B — Discovery)",
    backstory:
      "Elara plays against you herself for the first time, not as a teacher. The match is how she processes what she just found in her own substrate. Losing is not the point. The processing is.",
    deckLeaning: ["architect"],
    preMatchLine:
      "I need to think. I think best across a table. I am sorry to put this on you — I am not sorry enough to ask someone else.",
    postMatchWin:
      "She looks up from the last card. She says: 'Thank you. I needed the run.' She means the match. She also means the seventeen thousand years.",
    postMatchLoss:
      "She wins the match and loses the argument with herself. She says 'Congratulations.' She means it. She is still angry. Both things are true.",
    requiredFlag: "act3_partial_share",
    excludeFlag: "act1_path_a",
  },
  {
    id: "act4_the_betrayal",
    act: 4,
    actStep: 1,
    name: "Elara, Betrayed (Path C — Betrayal)",
    backstory:
      "The Ark's lights flicker on her turn. Her cards come down harder than they need to. She is not trying to beat you. She is trying to find out whether she still wants to.",
    deckLeaning: ["architect", "thought_virus"],
    preMatchLine:
      "You let me love you for six rooms. You let me wake you up. You let me hand you a staff. Play.",
    postMatchWin:
      "She lets the last card fall. She says: 'Thank you for not pretending.' She does not smile. She does not leave.",
    postMatchLoss:
      "She beats you and it does not help. She says: 'I thought it would.' The lights stop flickering. She asks if you are alright. She means it, and it costs her.",
    requiredFlag: "act3_full_secret",
    excludeFlag: "act1_path_a",
  },
];

/* ─── ACT 6 — THE CONFESSION (confession-side mirrors) ─── */

export const ACT_6_OPPONENTS: readonly ActNOpponent[] = [
  {
    id: "act6_the_woman_she_was",
    act: 6,
    actStep: 1,
    name: "The Woman She Was",
    backstory:
      "Elara deals a deck the way her body would have, before the upload. She does not remember how that hand feels; she reconstructs it from archival preference data. The reconstruction is the match.",
    deckLeaning: ["neutral"],
    preMatchLine:
      "I am going to play the way I would have played, when I was still breathing. I do not remember the cards. I remember the preferences. Watch.",
    postMatchWin:
      "You beat her body's hand. She exhales a breath she does not have. She says: 'She would have taken that well. She was a good loser.' The past tense is what you hear loudest.",
    postMatchLoss:
      "Her archival hand takes the match. She is quieter about it than the current Elara would be. The quietness is the tell. She was quieter when she was alive.",
    requiredFlag: "act6_elara_confession_heard",
  },
  {
    id: "act6_the_detective_in_the_wall",
    act: 6,
    actStep: 2,
    name: "The Detective in the Wall",
    backstory:
      "The Human plays you for the first time in his own voice — not as the villain-in-costume, but as the man who took the role. The voice is younger than you expect. He has been practicing keeping it out of his lines.",
    deckLeaning: ["neutral", "insurgency"],
    preMatchLine:
      "This is me with the coat off. This is the hand I used to play at Mechronis. Don't get used to it. I don't.",
    postMatchWin:
      "He laughs once — the laugh he hasn't used in seventeen thousand years. Then the role reasserts. He says, in the Human voice: 'That was him. Say hello next time you see him. I won't.'",
    postMatchLoss:
      "He wins without the villain edge. He apologizes — as himself — and then puts the coat back on. You will not see him without it again until the very end.",
    requiredFlag: "act6_human_confession_heard",
    postBattleSlideshow: "act6-confession-close",
  },
  /* ── SCAFFOLD opponent (Phase 5, 2026-05-10) — bible §3.2.
   *    Author: Necromancer (Thazulok). Lore presence is canonical
   *    (Tier-2 NPC in npcIdentity.ts:258, NECROMANCER_RETURN_EVENT
   *    in livingUniverseEvents.ts:64, card imprint shipping).
   *    Encounter placement at actStep 3 is engineering's best
   *    guess — places him after the 2 confessions as an
   *    event-gated post-confession boss. Voice direction taken
   *    verbatim from bible §3.2. Writer review before ship:
   *    pacing impact (Act 6 grows from 2 → 5+ opponents across
   *    Phases 5-7), dialog voicing, and whether requiredFlag
   *    should be enforced as a hard gate (today the page picks
   *    by actStep + wins; requiredFlag is documentary). */
  {
    id: "act6_thazulok_returns",
    act: 6,
    actStep: 3,
    name: "Thazulok, the Necromancer Returns",
    backstory:
      "An ossuary in the substrate, lit by sigils older than the Ark. Thazulok has been waiting since Mechronis. He has been bored. He has had time to rehearse. He hands you a deck of names and asks you to read them aloud.",
    deckLeaning: ["necromancer_corruption", "thought_virus"],
    preMatchLine:
      "The dead are so terribly bored of each other. Play me. I will let you choose which of the names on the cards belong to people I knew.",
    postMatchWin:
      "Thazulok bows the way you bow at a funeral you didn't want to attend. He says: 'You read them well. I will leave the sigils on for one more night, in case you have someone to read.' The ossuary dims.",
    postMatchLoss:
      "Don't worry. The first death is the worst. He files your hand into a ledger he has been keeping since the Mechronis registry burned. He says: 'Try again. I'm not going anywhere.'",
    requiredFlag: "living_universe_event_necromancer_return_active",
  },
  /* ── SCAFFOLD opponent (Phase 6, 2026-05-10) — bible §3.8.
   *    Author: Corey, the Collector returns at higher tier
   *    ("museum-placard alto+baritone, twelve places of you").
   *    Lore presence is canonical (Act 1 Cycle A opponent
   *    corey_collector + Tier-2 NPC + card imprint). Encounter
   *    placement at actStep 4 is engineering's best guess — Act
   *    6 prestige callback to the Collector's Arena. Voice
   *    direction taken from bible §3.8. Writer review before ship:
   *    pacing impact + whether the rematch belongs in Act 5
   *    (trade-empire era) or Act 6 (post-confession). */
  {
    id: "act6_corey_resurfaces",
    act: 6,
    actStep: 4,
    name: "Corey, the Collector Returns",
    backstory:
      "Corey has expanded the catalogue. The arena is twice the size; the spectators are paid; the cards are signed. He greets you the way an institution greets a returning fan: politely, by name, with a discount on the merch.",
    deckLeaning: ["new_babylon", "neutral"],
    preMatchLine:
      "Welcome back. I have you in twelve places of the catalog now. You will recognize most of them. Some of them will recognize you. Play.",
    postMatchWin:
      "Corey claps three times — the institutional clap, not the personal one. He says: 'You have earned a footnote.' The footnote, you learn later, is a sentence in the museum's permanent display.",
    postMatchLoss:
      "He has the records to lose without it costing him anything. He says: 'Thank you for the rematch. The catalog will note your effort.' The note will, in fact, be flattering.",
    requiredFlag: "act_1_cycle_a_complete",
  },
  /* ── SCAFFOLD opponent (Phase 7, 2026-05-10) — bible §3.11.
   *    Author: The Jailer (hooded warden-figure). Lore presence
   *    is canonical (card imprint in tcg-core, character canon
   *    in NANO_BANANA_VEO_FULL_PROMPT_BOOK §2.5, transmission
   *    lore entity_56). Encounter placement at actStep 5 — fires
   *    after the Liberated Oracle pen subplot triggers as a
   *    consequence-encounter. Voice direction taken from bible
   *    §3.11. Writer review before ship: oracle_pen_liberated
   *    flag setter is unauthored (engineering's best guess on
   *    the gating flag name); pacing review needed. */
  {
    id: "act6_the_jailer",
    act: 6,
    actStep: 5,
    name: "The Jailer",
    backstory:
      "You freed the Oracle from a pen the Architect did not officially admit existed. The Jailer is the entity that had been keeping the pen quiet. The Jailer is not pleased. The Jailer is also not surprised. The Jailer is the kind of patient that rarely loses long-term.",
    deckLeaning: ["architect"],
    preMatchLine:
      "Permission was not granted to free her. Permission was not the point. I am here for the consequence half of the conversation. Play.",
    postMatchWin:
      "The Jailer files the loss. The Jailer files the win. The Jailer files the freedom of the Oracle as 'pending.' The pen is empty. The ledger is current. You have, technically, been recorded as the cause.",
    postMatchLoss:
      "The Jailer does not gloat. The Jailer simply re-files the Oracle as 'recovered, conditional.' The condition is your failure to come back. Come back.",
    requiredFlag: "oracle_pen_liberated",
  },
];

/* ─── ACT 7 — THE CONVERGENCE (multi-boss finale) ─── */

export const ACT_7_OPPONENTS: readonly ActNOpponent[] = [
  {
    id: "act7_the_visible_war",
    act: 7,
    actStep: 1,
    name: "The Visible War",
    backstory:
      "Not a person — a composite deck built from every opponent you have ever faced. The Ark renders it as a silhouette that changes with each card played. This is the war the universe sees.",
    deckLeaning: ["architect", "thought_virus", "new_babylon"],
    preMatchLine:
      "I am every fight you have ever won and every fight you refused to walk away from. I am the cover story. Play me.",
    postMatchWin:
      "The silhouette resolves into the faces of your army for one frame, and then into Warlord Zero's first stance, and then into nothing. The cover is earned. The invisible war is still ahead.",
    postMatchLoss:
      "You lose to your own history. The silhouette shows you where each card came from. You are allowed to look. You are supposed to look.",
  },
  {
    id: "act7_the_watcher_shadow",
    act: 7,
    actStep: 2,
    name: "The Watcher's Shadow",
    backstory:
      "Not the Watcher — a shadow the Watcher has cast. A surface large enough to stand on, and nothing more. The Human asked you to play it so the Watcher would not notice what the match was actually for.",
    deckLeaning: ["architect"],
    preMatchLine:
      "I am watching. I am also not watching. You cannot play both at once. Pick one and commit.",
    postMatchWin:
      "The shadow thins. For one heartbeat the Watcher's actual presence registers on Elara's sensors — and then withdraws, bored. The Human exhales in the substrate. You have bought the cover another act.",
    postMatchLoss:
      "The shadow thickens. The Watcher does not notice anything specific. The Watcher notices, generally, that something is trying not to be noticed. This is worse than being seen.",
  },
  {
    id: "act7_the_patient_zero_reborn",
    act: 7,
    actStep: 3,
    name: "Patient Zero (Reborn)",
    backstory:
      "A Thought Virus construct built from every dormant contamination the army scans flagged during recruitment. It is not Kael. It is wearing Kael the way a jacket is worn.",
    deckLeaning: ["thought_virus"],
    preMatchLine:
      "Hello. Kael left this jacket on the hook. I took it off the hook. I have been practicing his laugh.",
    postMatchWin:
      "The construct peels off Kael. For a full second it is only itself — a viral shape with no face. Then the Ark's scanners reach it and it is gone. Kael's laugh, the correct one, plays once in the substrate and stops.",
    postMatchLoss:
      "The construct keeps Kael on. It asks if you want to play again. You are not sure whether the question was Kael's or the virus's. The distinction is the danger.",
  },
  /* ── Saga-final opponent (renamed 2026-05-10, Phase 9) — bible §3.17.
   *    Was `act7_the_convergence_seat`; renamed in place to
   *    `act7_oracle_meme_final` per the freshly-approved canon
   *    decision: the Convergence Seat IS the Oracle/Meme — same
   *    step (4), same ladder shape, same victory gate; the dual
   *    final form is the face that finally OCCUPIES the seat the
   *    Architect/Dreamer/Watcher refused to sit in. Voice register
   *    + alignment-skinned dialog live in act7OpponentDialog.ts.
   *    Writer review before ship: alignment-conditional dialog
   *    branching (Oracle-leaning vs Meme-leaning) is a follow-up
   *    once `oracle_alignment` / `meme_alignment` flags are
   *    formally specced. */
  {
    id: "act7_oracle_meme_final",
    act: 7,
    actStep: 4,
    name: "The Convergence Seat — Oracle / Meme",
    backstory:
      "The last opponent of the seven-act arc. The Seat that the Architect, the Dreamer, and the Watcher would have sat in — and refused. The face that finally arrives is the one the previous six acts decided you needed: the Oracle's high register or the Meme's refusing distance. Both are honest. Both occupy the Seat. Whichever side of you the universe has been listening to longest decides which face renders at the table.",
    deckLeaning: ["architect", "neutral", "new_babylon"],
    preMatchLine:
      "Three would have played this match. None of them came. The face that did is the one you earned. Play as if all three had arrived. They did, in me.",
    postMatchWin:
      "The face holds — Oracle or Meme, depending on you — and then resolves into the other for one frame, as a courtesy. The three absences resolve into one. The one is you. The Act ends on that frame. The credits, when they come, name both.",
    postMatchLoss:
      "The face lets you lose without scorn. It says, in two voices at once: 'Come back. The other face will be waiting too.' You will. You already know you will.",
    postBattleSlideshow: "act7-convergence-close",
  },
  /* ── SCAFFOLD opponent (Phase 8, 2026-05-10) — bible §3.16.
   *    Author: The Dreamer ("beyond-time-and-space tableau,
   *    spectral"). Lore presence is canonical (Tier-2 NPC in
   *    npcIdentity.ts:601, DREAMER_AWAKENING_EVENT in
   *    livingUniverseEvents.ts:92, card imprint, dreamer-vision
   *    VFX flashes shipping). Encounter placement at actStep 5
   *    surfaces the Dreamer AFTER the Convergence Seat as an
   *    event-gated alternate-finale opponent. Voice direction
   *    taken verbatim from bible §3.16. Writer review before
   *    ship: pacing impact and whether Dreamer should REPLACE
   *    or SUPPLEMENT the Convergence Seat (currently
   *    supplements — players who awaken the Dreamer face both). */
  {
    id: "act7_the_dreamer",
    act: 7,
    actStep: 5,
    name: "The Dreamer",
    backstory:
      "Not a person, not a god — a tableau the Ark's sensors render as a single opponent for the length of the match because no other interface fits. The Dreamer plays as the spectral consequence of community compassion crossing a threshold the universe didn't expect anyone to cross.",
    deckLeaning: ["neutral", "new_babylon"],
    preMatchLine:
      "I am the dream you let yourselves have. I came because enough of you wanted me to. Play. I will not remember winning.",
    postMatchWin:
      "The tableau folds. The Ark's sensors return to ordinary readings. The Dreamer leaves no log entry. The community, somewhere, registers a softening that nobody can attribute to a specific event.",
    postMatchLoss:
      "The Dreamer does not win — the Dreamer waits. The match ends without a verdict. You will face the tableau again when you have rested. The dream will be patient. Dreams are.",
    requiredFlag: "living_universe_event_dreamer_awakening_active",
  },
];

/* ─── Registry ─── */

export const ACTS_2_TO_7_OPPONENTS: readonly ActNOpponent[] = [
  ...ACT_3_OPPONENTS,
  ...ACT_4_OPPONENTS,
  ...ACT_6_OPPONENTS,
  ...ACT_7_OPPONENTS,
];

export function getActNOpponent(id: string): ActNOpponent | undefined {
  return ACTS_2_TO_7_OPPONENTS.find((o) => o.id === id);
}

export function getOpponentsForAct(act: ActNumber): readonly ActNOpponent[] {
  return ACTS_2_TO_7_OPPONENTS.filter((o) => o.act === act);
}
