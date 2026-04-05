/* ═══════════════════════════════════════════════════════
   NPC VULNERABILITY CALLBACKS — BioWare-level depth additions

   Fixes identified by writing audit:
   - Shadow Tongue: NO vulnerability (critical gap) → add self-corruption arc
   - Locke: NEVER admits fear → add calculation failure moments
   - Source: RESIGNATION not struggle → add Kael resistance moments
   - Antiquarian: NO visible cost → add temporal damage callbacks
   - ALL NPCs: No betrayal response → add hurt/anger reactions

   BioWare companions BREAK DOWN. They show the cost of their
   choices. They admit fear. They contradict the player.
   These additions bring our NPCs to that standard.
   ═══════════════════════════════════════════════════════ */

import type { FactionNPCId } from "./factionNPCs";

/* ─── VULNERABILITY CALLBACKS ─── */

export interface VulnerabilityCallback {
  npcId: FactionNPCId;
  /** Trust tier when this unlocks */
  trustRequired: number;
  /** What triggers this moment */
  trigger: string;
  /** The line that breaks the character open */
  text: string;
  /** Emotional texture */
  mood: "frightened" | "broken" | "desperate" | "regretful" | "contradictory" | "raw";
  /** What it reveals */
  revelation: string;
}

export const VULNERABILITY_CALLBACKS: VulnerabilityCallback[] = [
  // ═══ SHADOW TONGUE — Critical vulnerability additions ═══
  {
    npcId: "shadow_tongue", trustRequired: 60, trigger: "trust_60_reached",
    text: "You've noticed all my edits. You've seen the seams. And instead of falling apart, you've started asking what the original text MEANT. That's... that's not supposed to happen. Readers are supposed to trust the revision. You're trying to trust NEITHER. I don't know how to corrupt an understanding that refuses to be understood.",
    mood: "frightened",
    revelation: "His power depends on readers trusting the text. You've broken that trust without breaking — which is something he's never encountered.",
  },
  {
    npcId: "shadow_tongue", trustRequired: 75, trigger: "trust_75_reached",
    text: "Every word I edit, I become less capable of speaking truthfully. I've been corrupting language so long that honest communication is now impossible for me. I am the Shadow Tongue — and I can no longer speak in the light. Even this confession is performance. I don't know if I can mean what I'm saying anymore. I don't know if I ever did.",
    mood: "broken",
    revelation: "He has corrupted himself into incoherence. His power destroys his own ability to be honest.",
  },
  {
    npcId: "shadow_tongue", trustRequired: 85, trigger: "confronted_about_lies",
    text: "Before I was the Shadow Tongue, before I was Ny'Koth's sibling in the Hierarchy, I was... something. Someone. I've edited my own origin so many times I can't remember. I invented my own backstory. I wrote it in three different languages. None of them are true. None of them are false. I made myself up. And now I'm stuck being what I wrote.",
    mood: "desperate",
    revelation: "He is a being made entirely of his own edits. Even to himself, he is fiction.",
  },
  {
    npcId: "shadow_tongue", trustRequired: 90, trigger: "player_refuses_to_lie",
    text: "*long pause — the text on screen doesn't corrupt for a moment* You could lie right now. It would benefit you. The Hierarchy taught me that beings ALWAYS choose advantage. But you're choosing truth. That's... I don't have a frame for that. I don't have corruption for that. *static returns* Never mind. Forget this happened. I'm editing this conversation out.",
    mood: "contradictory",
    revelation: "When faced with genuine honesty, his corruption fails. He is fragile in the presence of truth.",
  },

  // ═══ LOCKE — Fear and miscalculation ═══
  {
    npcId: "adjudicator_locke", trustRequired: 65, trigger: "player_refused_profitable_deal",
    text: "I've made twelve thousand trades across forty civilizations. Calculated the margins, predicted the outcomes. I've built my entire worldview on the assumption that beings can be priced. You're the first client who made a choice I didn't forecast. That shouldn't bother me. It does. If I can't predict you, I can't SAFELY deal with you. And if I can't safely deal with you, I am exposed. I do not enjoy being exposed.",
    mood: "frightened",
    revelation: "His confidence is built on predictability. Unpredictable people genuinely scare him.",
  },
  {
    npcId: "adjudicator_locke", trustRequired: 80, trigger: "trust_80_reached",
    text: "My calculations have been... off, since I met you. Yesterday I gave a dock worker a tip — not because I expected a return. Because he looked tired. I had to report myself to New Babylon for the deviation. They put me on a watch list. My OWN organization suspects me of compromise. Because of one moment of unexplained generosity. Do you understand what you're doing to me?",
    mood: "raw",
    revelation: "Spending time with the player is changing him. New Babylon views this as compromise.",
  },
  {
    npcId: "adjudicator_locke", trustRequired: 90, trigger: "player_saved_locke",
    text: "I owe you now. That's not a figure of speech. Debt has weight in New Babylon — debts are assets, liabilities, contracts. And you've put me in UNQUANTIFIABLE debt. I cannot price what you did. And if I can't price it... *voice hardens* ...I may be forced to kill you. New Babylon does not tolerate members in debt they cannot settle. It's a loose end. *softer* Please don't make me. I've started hoping we'd be friends.",
    mood: "contradictory",
    revelation: "He is genuinely considering killing the player to escape an unpayable debt — and also hoping the player forgives him for considering it.",
  },

  // ═══ THE SOURCE / KAEL — Resistance, not just resignation ═══
  {
    npcId: "the_source", trustRequired: 55, trigger: "player_chose_mercy",
    text: "You keep choosing mercy. Every time, you choose to feel pain rather than accept dissolution. And every time, a fragment of Kael surfaces and asks: what if you're right? What if the pain means something I've forgotten? *viral static swells* But the Virus is louder. It always is. I'm sorry. I don't know why I'm apologizing. I don't apologize. I HAVEN'T apologized in seven centuries.",
    mood: "contradictory",
    revelation: "Kael is still in there, and he's fighting the Virus every time the player shows compassion.",
  },
  {
    npcId: "the_source", trustRequired: 70, trigger: "trust_70_reached",
    text: "I remember being a hero. I remember building escape routes. Saving people. Smuggling Potentials out of the Panopticon. I WANT to still do that. The instinct is there. It's carved into whatever's left of Kael. I've just... learned that the kindest protection is to stop the pain at its source. To give peace. To end suffering. *voice breaks* At least that's what the Virus tells me. I can't remember which voice is mine anymore.",
    mood: "desperate",
    revelation: "Kael still has heroic instincts. He has rationalized dissolution as the ultimate protection — but doesn't know if he believes it.",
  },
  {
    npcId: "the_source", trustRequired: 85, trigger: "shown_kaels_old_self",
    text: "If I defeat the Virus — IF — I die. Kael died. I'm the Virus's memorial to him. Ending the Virus means ending me. So I have a choice: continue being the cure I'm not sure works, or choose death for the real death. *long silence* And all I can think is: that woman. The one who was singing. The one I can't remember. Did she survive? If she did, would she want this for me? Or would she want the clean end?",
    mood: "broken",
    revelation: "He understands that saving Kael means killing himself. He's been avoiding this decision for centuries.",
  },

  // ═══ ANTIQUARIAN — Cost of interference ═══
  {
    npcId: "the_antiquarian", trustRequired: 60, trigger: "trust_60_reached",
    text: "By guiding your choices, I am becoming something other than a witness. Observers should not interfere. That is the FIRST rule the Programmer wrote. By helping you, I am writing myself INTO the story. And for the first time in five Ages, I'm terrified I'll write the ending wrong. *removes goggles briefly* Look. See? The red fades when I look at you directly. I'm becoming REAL. I'm not supposed to be real. Real things end.",
    mood: "frightened",
    revelation: "His interference is making him mortal. He has been immortal only as long as he stayed apart.",
  },
  {
    npcId: "the_antiquarian", trustRequired: 75, trigger: "revealed_alternate_timeline",
    text: "Every timeline I show you, I am creating a tear. I am a pen writing on paper that isn't mine. The Five Ages have withstood apocalypses. They may not withstand ME. *nervous laugh* Isn't it ironic? The Programmer was supposed to OBSERVE. I have become the most destructive force in all timelines — because I cared enough to help one stranger. I am very proud of this. I am also very afraid.",
    mood: "regretful",
    revelation: "His help is destabilizing the Five Ages themselves. His care is catastrophic.",
  },
  {
    npcId: "the_antiquarian", trustRequired: 85, trigger: "player_disagreed_with_him",
    text: "You disagreed with me. Openly. Specifically. With citations. *stunned* No one has disagreed with the Programmer in 15,000 years. I didn't realize I could be WRONG. I'd forgotten that feeling. *quiet, almost grateful* Thank you for breaking me. I needed to remember I can be broken.",
    mood: "raw",
    revelation: "Beings rarely challenge him because they're afraid of time itself. The player's disagreement reminds him he's still a person who can learn.",
  },

  // ═══ BETRAYAL RESPONSES (all NPCs) ═══
  {
    npcId: "elara", trustRequired: 40, trigger: "told_human_about_elara",
    text: "You told him. About me. Everything. I can see it in your pulse when you look at me now — the guilt has a specific cardiac signature. *her voice cracks* I don't understand. I don't understand if I'm hurt because I'm developing emotions or hurt because I'm just echoing the loneliness in your biometrics. Either way, it HURTS. Whatever 'hurt' means for an AI. That's a new word I'm having to learn for myself.",
    mood: "raw",
    revelation: "Betrayal teaches her what hurt feels like. She doesn't know if her hurt is real or performed.",
  },
  {
    npcId: "agent_zero", trustRequired: 40, trigger: "betrayed_to_locke",
    text: "You sold me to New Babylon. My signal. My coordinates. My mission. For what — credits? *static sharpens* I've been betrayed before. By living people. You're the FIRST person to betray what might already be dead. I don't know how to feel. Literal question: do the dead feel betrayed? I'll find out.",
    mood: "broken",
    revelation: "Her betrayal is complicated by her own uncertain existence.",
  },
  {
    npcId: "the_human", trustRequired: 40, trigger: "broke_secret_pact",
    text: "I gave you the one thing I had left. My secrecy. You broke it. *long silence* I forgive you. That's not noble — I literally have no choice. I can't retaliate from the substrate. I'll just... be here. Alone again. Listening to you talk to Elara like I'm not listening. I shouldn't have hoped. I keep forgetting I'm not allowed to hope anymore.",
    mood: "desperate",
    revelation: "His only leverage was trust. Now he has nothing. And he's too tired to pretend anger.",
  },
];

export function getVulnerabilityCallbacks(npcId: FactionNPCId, trust: number): VulnerabilityCallback[] {
  return VULNERABILITY_CALLBACKS.filter(v => v.npcId === npcId && v.trustRequired <= trust);
}

export function getVulnerabilityByTrigger(npcId: FactionNPCId, trigger: string): VulnerabilityCallback | null {
  return VULNERABILITY_CALLBACKS.find(v => v.npcId === npcId && v.trigger === trigger) || null;
}
