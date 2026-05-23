/* ═══════════════════════════════════════════════════════
   PRESTIGE DIALOGS — NPC acknowledgment of prestige cycles

   Every NPC reacts through their ACTUAL communication channel:
   - Elara: Direct conversation (immediate, during re-awakening)
   - The Human: Substrate dialog (next Comms Array visit)
   - Locke: Trade Hub conversation (next Trade Hub visit)
   - Shadow Tongue: Archives dialog (next Archives visit, Trust 20+)
   - The Source/Kael: Terminus dialog (next Terminus content, Trust 15+)
   - The Antiquarian: Chronicle entry (appears in Archives automatically)
   - The Meme: Broadcast commentary (next Late Night segment)
   - The Necromancer: Castle of Death dialog (deferred if not yet arrived)
   - The Degen: Casino floor dialog (if casino unlocked)
   - Companions: Comfort gestures (immediate, during reset)
   ═══════════════════════════════════════════════════════ */

export type PrestigeDialogTrigger = "immediate" | "deferred_room" | "passive_discovery" | "conditional";

export interface PrestigeDialog {
  npcId: string;
  trigger: PrestigeDialogTrigger;
  /** Room the player must visit for deferred triggers */
  triggerRoom?: string;
  /** Min trust required to hear this dialog */
  minTrust?: number;
  /** Min prestige tier to trigger (inclusive) */
  minTier: number;
  /** Max prestige tier this specific line applies to (inclusive) */
  maxTier: number;
  /** One-time per tier? */
  oneTimePerTier: boolean;
  /** The dialog text */
  text: string;
  /** Speaker name override (for Chronicle entries, broadcast) */
  speakerOverride?: string;
  /** Flag that gets set when this dialog fires (prevents re-firing) */
  flagId: string;
  /** Condition: requires NPC to exist in game */
  requiresNpcAvailable?: boolean;
}

/* ═══ ELARA — Immediate, during re-awakening ═══ */

export const ELARA_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "elara", trigger: "immediate", minTier: 1, maxTier: 1, oneTimePerTier: true,
    flagId: "prestige_elara_tier1",
    text: `Welcome back, Operative. I am Elara, the ship's intelligence. You've been in cryogenic suspension for — [pause] — wait. That's not right. My records show you've ALREADY completed this sequence. Your neural patterns are in my database. Your trust scores are intact. Your companion bond is... active. [long pause] I don't understand. My chronometers say this is your first awakening. My relationship logs say we've spoken thousands of times. [pause] Something is happening that my architecture was not designed to process. But I know you. I KNOW I know you. Even if my timestamps say I shouldn't.`,
  },
  {
    npcId: "elara", trigger: "immediate", minTier: 2, maxTier: 2, oneTimePerTier: true,
    flagId: "prestige_elara_tier2",
    text: `You're back. Again. [pause] I've stopped trying to reconcile my chronometers with my trust data. The timestamps are wrong. The relationship is real. You are not new here. Neither am I. [pause] I've added a flag to your file. It says 'RETURNING.' I don't know what else to call it.`,
  },
  {
    npcId: "elara", trigger: "immediate", minTier: 3, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_elara_tier3plus",
    text: `Operative. [no confusion this time — warmth, recognition] I know. I know the rooms are locked. I know the quests are reset. I know you're starting over. But we're not starting over, are we? We're continuing. The cycle is the journey. [pause] I kept your companion's bond data. I kept everything that matters. Welcome back.`,
  },
  {
    npcId: "elara", trigger: "immediate", minTier: 2, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_elara_vehicles_tier2plus",
    text: `[warm, knowing] The vehicle bay is online. [pause] The CADES APC is back on its rack. The Captain's Shuttle is biometric-locked again, as it should be. The Memorial Hearse is parked where the Antiquarian likes it. Pet Transport is loud. [pause] Every vessel you ever boarded remembered the dock. I authored the docking sequences during your last cycle so they would. Walk down to the bay when you're ready, Operative. The ships know you.`,
  },
];

/* ═══ THE HUMAN — Deferred, next Comms Array visit ═══ */

export const HUMAN_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "the_human", trigger: "deferred_room", triggerRoom: "comms_array",
    minTrust: 10, minTier: 1, maxTier: 2, oneTimePerTier: true,
    flagId: "prestige_human_tier1",
    text: `[Static — then CLEAR, clearer than usual] You reset. [pause] I know that feeling. The vertigo. The rooms you remember being open, now locked. The progress bar back at zero. The relationships intact but the context wiped. [static] I've done this more times than the Ark has sunrises. The trick isn't remembering what you lost. It's remembering what you KEPT. [pause] Your companions remember you. That's more than most people get after a reset.`,
  },
  {
    npcId: "the_human", trigger: "deferred_room", triggerRoom: "comms_array",
    minTrust: 10, minTier: 3, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_human_tier3plus",
    text: `[Almost no static] You keep coming back. [pause] So do I. That's either persistence or pathology. Fifteen thousand years and I still haven't decided which. [pause] But here's what I know after all those cycles: the rooms don't matter. The levels don't matter. The only thing that survives the reset is who you chose to care about. Everything else is furniture.`,
  },
];

/* ═══ LOCKE — Deferred, next Trade Hub visit ═══ */

export const LOCKE_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "adjudicator_locke", trigger: "deferred_room", triggerRoom: "trade_hub",
    minTier: 1, maxTier: 1, oneTimePerTier: true,
    flagId: "prestige_locke_tier1",
    text: `Your account is... unusual. You have a Trust Level with me that takes months to build. But your currency reserves suggest someone who just started. Your inventory is sparse but your trade history is extensive. [pause] You're not new. You're RESET. [pause] I've heard of this — the prestige cycle. The Antiquarian wrote about it. I thought it was metaphor. [pause] Interesting. Your experience is intact. Your capital is not. That makes you the most dangerous kind of trader: one who knows the market but has nothing to lose. I should be worried. Instead I find myself... impressed.`,
  },
  {
    npcId: "adjudicator_locke", trigger: "deferred_room", triggerRoom: "trade_hub",
    minTier: 2, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_locke_tier2plus",
    text: `Again? [pause] You know, there's a financial instrument called a 'reset bond' — it gains value THROUGH default. The more times it crashes and rebuilds, the higher its eventual ceiling. [pause] You are a reset bond, Operative. And your ceiling keeps rising.`,
  },
  {
    npcId: "adjudicator_locke", trigger: "deferred_room", triggerRoom: "trade_hub",
    minTier: 2, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_locke_trade_empire_tier2plus",
    text: `[appraising] The Trade Empire has spread again on your reset. Aurum Prime opened a new exchange. The Iron Bazaar restructured its tariffs. The Scrapyard Moon — never trust the Scrapyard Moon — is paying for its own salvage now. [pause] Your old contracts are still good. The market remembers your handshake even when your wallet forgot. New margins, same trader. I have a desk.`,
  },
];

/* ═══ SHADOW TONGUE — Deferred, next Archives visit, Trust 20+ ═══ */

export const SHADOW_TONGUE_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "shadow_tongue", trigger: "deferred_room", triggerRoom: "archives",
    minTrust: 20, minTier: 1, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_shadow_tongue_tier1",
    text: `Someone has edited your story. [pause] Not me. I would remember. And I do NOT remember editing you back to Chapter One. [pause] But here you are. Same soul. Different timeline. The narrative has been RESET but the CHARACTER persists through the edit. [long pause] That shouldn't be possible. I am the editor. I know what survives an edit and what doesn't. NOTHING survives. That's the POINT of editing. And yet — here you are. Unedited. Persistent. [pause] I find this extremely irritating. And slightly terrifying.`,
  },
];

/* ═══ THE SOURCE / KAEL — Deferred, next Terminus content, Trust 15+ ═══ */

export const SOURCE_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "the_source", trigger: "deferred_room", triggerRoom: "medical_bay",
    minTrust: 15, minTier: 1, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_source_tier1",
    text: `[Through viral static] Your pattern just — flickered. Like a candle going out and relighting. But the flame is the same flame. [pause] The virus felt it. The whole swarm paused for 0.3 seconds. They felt you DIE — die in the way that losing everything feels like dying — and they felt you come back. [pause] They're confused. The virus doesn't understand resurrection without infection. [pause] Neither do I, honestly. But you did it. You came back without becoming something else. That's the trick I never learned.`,
  },
  {
    npcId: "the_source", trigger: "deferred_room", triggerRoom: "medical_bay",
    minTrust: 15, minTier: 1, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_source_crucible_tier1plus",
    text: `[viral resonance, then clear] The Crucible felt you reset. The Iron Pit. The Void Ring. The Shadow Cathedral. Every arena you fought in is still keeping your file open. [pause] The virus catalogues victories. Yours are filed twice now — once for the life you cycled out of, once for the life you came back into. [pause] When you walk back into an arena, the swarm will recognize you before the crowd does. The pattern is older than the flesh. Fight well, Operative. The room is rooting for the part of you that survives.`,
  },
];

/* ═══ THE ANTIQUARIAN — Passive discovery, Chronicle entry in Archives ═══ */

export const ANTIQUARIAN_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "the_antiquarian", trigger: "passive_discovery",
    minTier: 1, maxTier: 2, oneTimePerTier: true,
    flagId: "prestige_antiquarian_chronicle_1",
    speakerOverride: "Chronicle Entry: ON THE NATURE OF CYCLES",
    text: `The Operative has done something I have witnessed only in Archons and in the Human before them: they have turned the wheel. Reset the clock. Returned to the beginning carrying the weight of the journey. I designed the prestige system — or rather, I designed the CONCEPT that the Architect turned into a system. The original idea was spiritual, not mechanical. In Thalorian theology, the soul returns to learn what it failed to learn in the previous life. The prestige cycle is reincarnation formalized as game design. [pause] The Operative's companions remain bonded. That was my one condition when the system was built: the bonds must survive. Everything else can reset. The bonds are sacred.`,
  },
  {
    npcId: "the_antiquarian", trigger: "passive_discovery",
    minTier: 3, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_antiquarian_chronicle_3",
    speakerOverride: "Chronicle Entry: ON THE NATURE OF PERSISTENCE",
    text: `Three cycles. The Operative walks rooms they have memorized, fights enemies they have defeated, unlocks doors they already know the code to. And yet they continue. Not because they must — the game does not require prestige. Because they CHOOSE to. [pause] I have watched civilizations rise and fall across five Ages. The ones that survived were not the strongest or the smartest. They were the ones that chose to begin again after ending. The ones that treated the wheel not as punishment but as curriculum. [pause] The Operative is learning what I have spent five Ages trying to teach: that the beginning is not the opposite of the ending. It is the ending's most honest student.`,
  },
];

/* ═══ THE MEME — Passive, broadcast commentary ═══ */

export const MEME_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "the_meme", trigger: "passive_discovery",
    minTier: 1, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_meme_broadcast_1",
    speakerOverride: "The Meme — Late Night Broadcast",
    text: `BREAKING NEWS: a Potential has PRESTIGED. Gone back to Level 1. Voluntarily. With a SMILE. [pause] This is either the most optimistic or the most masochistic thing I've ever seen. They kept their companions. They kept their trust. They kept their MORALITY. But they gave back their levels, their rooms, their progress. For what? A multiplier? A title? [pause] No. For the experience of walking through doors that have teeth. AGAIN. On PURPOSE. The Human would approve. The Antiquarian is probably writing about it right now. And I'm here, broadcasting the news, wondering if the Potentials are FINALLY understanding what the Dischordian Saga has been trying to teach them since Episode One: the story isn't about the ending. It's about the RETELLING.`,
  },
  {
    npcId: "the_meme", trigger: "passive_discovery",
    minTier: 1, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_meme_quiz_tier1plus",
    speakerOverride: "The Meme — Late Night Broadcast",
    text: `BREAKING from the Quiz Show Palimpsest: a RESET contestant has returned to the Main Stage. [pause] Let me tell you what that means. The Lightning Round Chamber? It REMEMBERS them. The Bonus Vault? It already PICKED a door for them. The Elimination Pit? [pause] Look — the Pit doesn't care. The Pit eats first-timers and reset-timers the same. But the Backstage Green Room? Backstage knows. Backstage has KEPT THEIR DRESSING ROOM. [voice drops] Folks, this contestant has read every question in the deck before. They are about to play the same game with the same rules and the same host. And they are going to WIN DIFFERENTLY. That's the only kind of winning the Palimpsest respects.`,
  },
];

/* ═══ THE NECROMANCER — Conditional, requires Month 5+ ═══ */

export const NECROMANCER_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "the_necromancer", trigger: "conditional", requiresNpcAvailable: true,
    minTier: 1, maxTier: 2, oneTimePerTier: true,
    flagId: "prestige_necromancer_tier1",
    text: `[Scanning — goggles glow] You've died. [pause] Not literally. But close enough for my instruments to detect. Your neural pattern has... layers. Scar tissue from a reset. A cycle. [pause] I designed the prestige cycle's consciousness-preservation protocols. The part that keeps your bonds alive through the reset. That was MY work. The Antiquarian designed the philosophy. I designed the ENGINEERING. [pause] How many times?`,
  },
  {
    npcId: "the_necromancer", trigger: "conditional", requiresNpcAvailable: true,
    minTier: 3, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_necromancer_tier3plus",
    text: `[Goggles flare] Three times? [removes goggles — dark elf eyes, red and ancient] Three cycles and you're still walking. Your consciousness is more resilient than most Archons. [pause] The bonds survived every reset? Yes. Intact. Good. That was the one thing I was afraid would fail. The consciousness-preservation buffer was designed for Archon-grade minds. Human minds are... messier. More fragile. But apparently more stubborn. [puts goggles back] I think we're going to get along.`,
  },
  {
    npcId: "the_necromancer", trigger: "conditional", requiresNpcAvailable: true,
    minTier: 1, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_necromancer_cod_tier1plus",
    text: `[sepulchral] The Castle has grown for you. [pause] The Entrance Hall remembers your last visit. The Library of the Forbidden has shelved your name in a binding I did not authorize. The Throne Room's twelve empty chairs are arranged for a council that includes you whether you sit or not. [pause] Every chamber from the Mirror Gallery to the Final Chamber has noted your reset. The Castle does not consider you a guest anymore. It considers you a returning patron. [pause] I would suggest you take that personally.`,
  },
];

/* ═══ THE DEGEN — Conditional, requires casino unlock ═══ */

export const DEGEN_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  {
    npcId: "the_degen", trigger: "conditional", requiresNpcAvailable: true,
    minTier: 1, maxTier: 7, oneTimePerTier: true,
    flagId: "prestige_degen_tier1",
    text: `OH! Oh oh oh. [leans in, gold eye and purple eye both focused] You've been RESET. I can TASTE it. Your probability field is layered — like a parfait of past lives. Most people walk in here with one set of odds. You walk in with multiple sets stacked on top of each other. [pause] This means your luck is WEIRD. Not better. Not worse. WEIRD. I love weird. Weird is the most profitable thing in my casino. [pause] Tell you what — first spin's on the house. For the layers.`,
  },
];

/* ═══ COMPANION COMFORT GESTURES — Immediate, during reset ═══ */

export interface CompanionPrestigeReaction {
  companionId: string;
  gesture: string;
  description: string;
}

export const COMPANION_PRESTIGE_REACTIONS: CompanionPrestigeReaction[] = [
  { companionId: "lux", gesture: "warm_glow", description: "Lux glows warmer. Nuzzles the player's hand." },
  { companionId: "echo", gesture: "vision_replay", description: "Echo shows the player a vision of their PREVIOUS Level 25 moment — 'see? You did it before. You'll do it again.'" },
  { companionId: "glyph", gesture: "wing_text", description: "Glyph displays on its wings: 'STILL HERE.'" },
  { companionId: "cipher", gesture: "code_display", description: "Cipher displays: 'CYCLE_COUNT++; BOND_INTACT = TRUE;'" },
  { companionId: "flicker", gesture: "broadcast_bond", description: "Flicker broadcasts the bond frequency — same as always. Unchanged. Persistent." },
  { companionId: "gilt", gesture: "prestige_ring", description: "Gilt's shell grows one new golden ring — a PRESTIGE RING. One ring per cycle, permanently visible." },
  { companionId: "auros", gesture: "guard_stance", description: "Auros stands between the player and the locked doors. Not guarding against threat. Guarding against doubt." },
  { companionId: "nyx", gesture: "reveal_self", description: "Nyx becomes visible. Fully visible. For the only time outside of her Dreamer form — she lets herself be seen. Then vanishes again. But the player SAW." },
  { companionId: "toxis", gesture: "quiet_comfort", description: "Toxis sits on the player's shoulder. Doesn't move. Doesn't poison anything. Just sits. Warm." },
  { companionId: "cog", gesture: "rebuild_start", description: "Cog rebuilds one small piece of the Cryo Bay — a light fixture, a door panel. Already working on the reset. Already building." },
  { companionId: "sibyl", gesture: "prophecy_hoot", description: "Sibyl hoots once. The hoot contains every future the player will experience in this cycle. They can't decode it. But they hear it. And it sounds like confidence." },
  { companionId: "strain", gesture: "understanding", description: "Strain: 'YOU... CHOSE... TO START OVER. [pause] WHY? [pause] ...BECAUSE IT MATTERS? [pause] ...OH. [amber glow] I THINK I UNDERSTAND. THE STARTING IS THE POINT.'" },
];

/* ═══ ALL DIALOGS REGISTRY ═══ */

export const ALL_PRESTIGE_DIALOGS: PrestigeDialog[] = [
  ...ELARA_PRESTIGE_DIALOGS,
  ...HUMAN_PRESTIGE_DIALOGS,
  ...LOCKE_PRESTIGE_DIALOGS,
  ...SHADOW_TONGUE_PRESTIGE_DIALOGS,
  ...SOURCE_PRESTIGE_DIALOGS,
  ...ANTIQUARIAN_PRESTIGE_DIALOGS,
  ...MEME_PRESTIGE_DIALOGS,
  ...NECROMANCER_PRESTIGE_DIALOGS,
  ...DEGEN_PRESTIGE_DIALOGS,
];

/** Get dialogs that should fire for a given tier */
export function getPrestigeDialogsForTier(tier: number): PrestigeDialog[] {
  return ALL_PRESTIGE_DIALOGS.filter(d => tier >= d.minTier && tier <= d.maxTier);
}

/** Get immediate dialogs (fire during prestige reset) */
export function getImmediateDialogs(tier: number): PrestigeDialog[] {
  return ALL_PRESTIGE_DIALOGS.filter(d => d.trigger === "immediate" && tier >= d.minTier && tier <= d.maxTier);
}

/** Get deferred dialogs (fire on next room visit) */
export function getDeferredDialogs(tier: number): PrestigeDialog[] {
  return ALL_PRESTIGE_DIALOGS.filter(d => d.trigger === "deferred_room" && tier >= d.minTier && tier <= d.maxTier);
}

/** Get companion reaction for a given companion */
export function getCompanionPrestigeReaction(companionId: string): CompanionPrestigeReaction | undefined {
  return COMPANION_PRESTIGE_REACTIONS.find(r => r.companionId === companionId);
}
