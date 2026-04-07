/* ═══════════════════════════════════════════════════════
   DIVINE COMPANIONS & DISCHORDIAN COMPANIONS
   The Dreamer's path — expensive, slow, permanent.
   ═══════════════════════════════════════════════════════ */

import type { DivineCompanion, DischordianCompanion } from "./types";

export const DIVINE_COMPANIONS: DivineCompanion[] = [
  /* ─── TIER 1: CANDLE SPIRITS (7 Divine Light) ─── */
  {
    id: "dawn_wisp", name: "Dawn Wisp", patron: "The Dreamer", tier: 1,
    divineLightCost: 7,
    ability: { type: "stat_boost", target: "all_stats", value: 5, permanent: true, description: "+5% to ALL stats permanently. No drawback. No cost. No corruption. Just a little more. Always." },
    drawback: null,
    purityContribution: 2,
    artPrompt: "Small orb of warm golden light with a gentle human face visible inside, faintly glowing, leaving a trail of golden light motes that fade like fireflies, warm radiant aura, peaceful expression. Transparent background. 256x256.",
    description: "A small orb of warm golden light with a face visible inside — gentle, curious, slightly sad. Leaves a trail of fading light-motes. Makes a soft humming sound like a lullaby remembered from childhood.",
    visual: "Small orb of warm golden light with gentle face inside. Trail of fading light-motes. Soft humming like a childhood lullaby.",
    antiquarianEntry: "A wisp of the Dreamer's light has chosen to follow you. I have seen these before — in other Ages, in other hands. They do not grant power. They grant constancy. A small, steady presence that asks nothing and gives everything. In my experience across five Ages, constancy is the rarest form of strength.",
    icon: "Sun", color: "#fbbf24",
  },
  {
    id: "harmony_bell", name: "Harmony Bell", patron: "The Dreamer", tier: 1,
    divineLightCost: 7,
    ability: { type: "detection", target: "hidden_content", value: 15, permanent: false, description: "Alerts to ALL hidden content, secrets, and approaching threats — equivalent detection to Shadow Hound with zero hostile increase." },
    drawback: null,
    purityContribution: 2,
    artPrompt: "Tiny floating crystal bell wrapped in golden lattice, emitting faint sound waves visualized as concentric golden rings, ethereal and delicate, sci-fi divine aesthetic. Transparent background. 256x256.",
    description: "A tiny floating bell made of crystal that rings with a tone only the player can hear. The tone shifts based on nearby danger, opportunity, or hidden content. Wrapped in a faint golden lattice.",
    visual: "Tiny floating crystal bell in golden lattice. Rings only for you. Tone shifts with danger and opportunity.",
    antiquarianEntry: "The Harmony Bell resonates at a frequency I recognize — the Dreamer's own pitch, the note she hummed while building the shields. It senses without attracting. It watches without being watched. The Hierarchy's hounds track by scent — predators follow. The Bell resonates — only you can hear it. That distinction has saved civilizations.",
    icon: "Bell", color: "#22d3ee",
  },

  /* ─── TIER 2: LIGHT BEARERS (15 Divine Light) ─── */
  {
    id: "dreamers_tear", name: "Dreamer's Tear", patron: "The Dreamer", tier: 2,
    divineLightCost: 15,
    ability: { type: "vision", target: "lore_visions", value: 15, permanent: false, description: "Once per day, grants a VISION — a narrative vignette with encoded hints about the dark sector and Year Two. +15% lore XP permanently." },
    drawback: null,
    purityContribution: 4,
    artPrompt: "Floating teardrop of crystallized golden light the size of a fist, inside a tiny landscape visible — mountains of light, rivers of song. Rotates slowly showing different dreamscapes. Transparent background. 256x256.",
    description: "A floating teardrop of crystallized golden light. Inside: a tiny landscape — mountains of light, rivers of song. The world the Dreamer dreamed before the Fall. It rotates slowly, showing different landscapes.",
    visual: "Floating golden teardrop with miniature dreamscape inside. Mountains of light. Rivers of song. Rotates slowly.",
    antiquarianEntry: "The Dreamer's Tear contains fragments of her imagination — the world she dreamed before the Fall, the reality she tried to save. Each vision it grants is a window into memories the Hierarchy has been trying to destroy for millennia. No demon pet offers knowledge. The Hierarchy does not KNOW things — it CONSUMES things. The Dreamer REMEMBERS.",
    icon: "Droplets", color: "#a78bfa",
  },
  {
    id: "shield_fragment", name: "Shield Fragment", patron: "The Dreamer", tier: 2,
    divineLightCost: 15,
    ability: { type: "defense", target: "combat_defense", value: 25, permanent: false, description: "+25% defense in all combat. When killed, activates ONCE PER DAY — full invulnerability for 5 seconds. No health drain. No weekly cost." },
    drawback: null,
    purityContribution: 4,
    artPrompt: "Miniature hexagonal lattice of golden-green energy, Dreamer's Shield design, hovering and rotating, occasionally pulsing with protective light, transparent sci-fi aesthetic. Transparent background. 256x256.",
    description: "A miniature version of the Dreamer's Shield — a hexagonal lattice of golden-green energy hovering near the player's shoulder. Occasionally pulses in sync with the Ark's defense grid.",
    visual: "Miniature hexagonal golden-green energy shield. Hovers at shoulder. Pulses with the Ark's defense grid.",
    antiquarianEntry: "A fragment of the Dreamer's own shield has attached itself to you. It protects. That is what it was made to do. No cost. No drain. No compromise. The Blood Familiar offers +20% defense but feeds on your life force. This fragment offers +25% and asks for nothing. The mathematics are clear — but mathematics require patience. The Hierarchy is counting on your impatience.",
    icon: "Shield", color: "#22c55e",
  },

  /* ─── TIER 3: DIVINE ASPECTS (30 Divine Light) ─── */
  {
    id: "dreamers_eye", name: "The Dreamer's Eye", patron: "The Dreamer", tier: 3,
    divineLightCost: 30,
    ability: { type: "lore_access", target: "true_sight", value: 100, permanent: false, description: "TRUE SIGHT: reveals Shadow Tongue edits, AI vote padding, hidden mechanics, damage formulas. Weekly 5-second glimpse through the dark sector shield." },
    drawback: null,
    purityContribution: 6,
    artPrompt: "Floating golden organic eye surrounded by halo of golden fractals, luminous and alive, seeing what could be not what is, gentle divine radiance. Transparent background. 256x256.",
    description: "A floating golden eye — not mechanical like the Watcher's, but organic, luminous, alive. It sees not what IS but what COULD BE. Surrounded by a halo of golden fractals. When it blinks, you catch a glimpse of an alternate reality.",
    visual: "Floating golden organic eye in a halo of fractals. Sees what could be. Blinks reveal alternate realities.",
    antiquarianEntry: "The Dreamer's Eye sees truth. Not partial truth, not convenient truth — the raw, unedited, uncomfortable truth. Shadow Tongue's revisions glow golden when the Eye passes over them. The Architect's vote padding becomes visible. The hidden calculations that govern combat and commerce reveal themselves. And once per week — for five seconds that feel like five hours — the Eye sees through the dark sector shield. What it shows you is yours alone. The Unmaker's Seed DESTROYS truth. The Dreamer's Eye REVEALS it. One is a weapon. The other is wisdom.",
    icon: "Eye", color: "#fbbf24",
  },
  {
    id: "dreamers_song", name: "The Dreamer's Song", patron: "The Dreamer", tier: 3,
    divineLightCost: 30,
    ability: { type: "narrative", target: "npc_dialog", value: 100, permanent: false, description: "No stat boost. Changes the NARRATIVE — unique NPC dialog, deeper information, personalized Chronicle entries. The game's ultimate reward." },
    drawback: null,
    purityContribution: 6,
    artPrompt: "Abstract visualization of music — golden sound waves and musical notes flowing in a spiral, ethereal and beautiful, no physical form just pure sound made visible. Transparent background. 256x256.",
    description: "Not visible — audible. A faint, beautiful melody that follows the player. Other players can hear it if close enough. The melody shifts based on emotional journey — triumphant after victories, melancholy after losses, urgent during crises.",
    visual: "Not visible — audible. A beautiful melody that follows you. Shifts with your emotional journey. Others can hear it nearby.",
    antiquarianEntry: "The Dreamer's Song. I confess — across five Ages of careful, measured observation — this is the one that makes me pause. It offers no combat advantage. No detection buff. No statistical improvement. Instead, it does something no other companion in this game or any game can do: it makes the story YOURS. Every NPC speaks differently to Song-bearers. Not different information — deeper information. The Human opens doors he keeps locked for everyone else. I write Chronicle entries addressed to you by name. Elara remembers fragments of her human life. The Necromancer admits to fear. You chose the harder path, paid the higher price, suffered the failures, and persisted. The reward is not power. The reward is STORY. And in a game called the Dischordian Saga, story IS the highest form of power.",
    icon: "Music", color: "#f0abfc",
  },
];

/* ─── DISCHORDIAN COMPANIONS (secret tier) ─── */

export const DISCHORDIAN_COMPANIONS: DischordianCompanion[] = [
  {
    id: "the_paradox", name: "The Paradox", tier: 3,
    cost: { red: 1, gold: 1, violet: 1 },
    trustRequirements: { antiquarian: 100, necromancer: 60 },
    ability: { type: "stat_boost", target: "nullify_demon_drawbacks", value: 100, permanent: false, description: "Nullifies ALL drawbacks from active Demon Pets while maintaining their full benefits. Only ONE player on the entire server can carry The Paradox at a time." },
    drawback: null,
    description: "A small creature simultaneously a demon and an angel, flickering between forms at 60fps. Neither dark nor light — a contradiction made manifest. Dischordian Logic incarnate.",
    visual: "Flickering between demon and angel form at 60fps. Both and neither. A walking contradiction.",
    icon: "Infinity", color: "#8b5cf6",
  },
  {
    id: "the_witness", name: "The Witness", tier: 3,
    cost: { red: 1, gold: 1, violet: 1 },
    trustRequirements: { antiquarian: 100, necromancer: 60 },
    ability: { type: "vision", target: "alternate_history", value: 1, permanent: false, description: "Once per month, see what WOULD HAVE happened if a community vote had gone differently. An alternate history. A road not taken, made visible." },
    drawback: null,
    description: "A small mirror showing not your reflection but your OPPOSITE — the version of you that made every choice you didn't. Pure narrative power.",
    visual: "Small mirror showing your opposite self. Every unchosen choice reflected. The road not taken made visible.",
    icon: "ScanEye", color: "#06b6d4",
  },
  {
    id: "the_first_word", name: "The First Word", tier: 3,
    cost: { red: 1, gold: 1, violet: 1 },
    trustRequirements: { antiquarian: 100, necromancer: 60 },
    ability: { type: "narrative", target: "chronicle_write", value: 1, permanent: true, description: "Hear the Antiquarian's Chronicle being WRITTEN in real-time — the scratch of the quill, the pause before a difficult word. Once in the entire game: ADD a single sentence to the Chronicle. Your words, in his book, forever." },
    drawback: null,
    description: "A sound. Not a creature, not an object — a SOUND. The first word the Antiquarian ever wrote. Inaudible to most. The most powerful ability in the Dischordian Saga is not a combat buff. It is a sentence.",
    visual: "Inaudible to most. The scratch of a quill. The pause before a word. The sigh before a eulogy. The Programmer at work.",
    icon: "Feather", color: "#10b981",
  },
];
