/* ═══════════════════════════════════════════════════════
   DIVINE COMPANIONS & DISCHORDIAN COMPANIONS
   The Antiquarian's gifts — earned through purity,
   patience, and the willingness to see clearly.
   The Dischordian companions are something else entirely.
   ═══════════════════════════════════════════════════════ */

import type {
  DivineCompanion,
  DischordianCompanion,
} from "./types";

export const DIVINE_COMPANIONS: DivineCompanion[] = [
  /* ─── TIER 1 — 7 divine light cost ─── */

  {
    id: "dawn_wisp",
    name: "Dawn Wisp",
    tier: 1,
    patron: "The Dreamer",
    divineLightCost: 7,
    ability: {
      type: "stat_boost",
      target: "all_stats",
      value: 0.05,
      permanent: true,
      description:
        "+5% to ALL stats permanently. A quiet, steady light that never wavers.",
    },
    drawback: null,
    purityContribution: 2,
    icon: "Sun",
    color: "#fbbf24",
    visual:
      "A small orb of warm golden light, no larger than a firefly. It drifts in slow circles around your head, leaving faint trails of sunrise color. When you are still, it rests against your cheek like a warm thought.",
    description:
      "The simplest of the Antiquarian's gifts — a mote of dawn captured before the world remembered how to be dark. It grants a permanent 5% boost to all stats, with no cost, no catch, no fine print. Just light.",
    antiquarianEntry:
      "The Dawn Wisp is, I confess, my favorite of all the companions I tend. It asks nothing. It promises little. And yet — that little is everything, is it not? A steady five percent improvement to all one's faculties, permanent and unconditional. No patron demands tribute. No contract binds. It is simply... a gift. I found the first one in a dream about breakfast. Make of that what you will.",
    artPrompt:
      "A tiny orb of warm golden dawn light drifting in slow circles, leaving faint sunrise trails, small as a firefly, peaceful and warm, divine fantasy light spirit, gentle radiance",
  },

  {
    id: "harmony_bell",
    name: "Harmony Bell",
    tier: 1,
    patron: "The Dreamer",
    divineLightCost: 7,
    ability: {
      type: "detection",
      target: "detection_alerts",
      value: 0.15,
      permanent: false,
      description:
        "Detection alerts for hidden items and secrets with NO hostile encounter increase. Pure awareness without consequence.",
    },
    drawback: null,
    purityContribution: 2,
    icon: "Bell",
    color: "#22d3ee",
    visual:
      "A crystalline bell the size of a thimble, suspended by a thread of pale blue light. It chimes softly when secrets are near — a sound only you can hear. The tone changes with proximity: lower for far, higher for close, and a perfect middle C when you're standing right on top of it.",
    description:
      "A detection companion that alerts you to hidden items, passages, and secrets without drawing hostile attention. Unlike the Shadow Hound, the Harmony Bell makes no noise that anything dangerous can hear.",
    antiquarianEntry:
      "Where the Necromancer's hound howls and brings the wolves, my little Bell merely chimes. A gentle tone, heard only by its keeper, growing higher as secrets draw near. No monsters come running. No darkness gathers. Just a crystalline note that says: 'Here. Look here.' I crafted it from a dream about perfect pitch. The Bell remembers what perfection sounds like, even if the waking world has forgotten.",
    artPrompt:
      "A tiny crystalline bell suspended by a thread of pale blue light, delicate as a thimble, emanating soft concentric rings of cyan sound waves, divine fantasy detection artifact, serene and precise",
  },

  /* ─── TIER 2 — 15 divine light cost ─── */

  {
    id: "dreamers_tear",
    name: "Dreamer's Tear",
    tier: 2,
    patron: "The Dreamer",
    divineLightCost: 15,
    ability: {
      type: "lore_access",
      target: "lore_visions",
      value: 0.15,
      permanent: false,
      description:
        "Daily lore visions with dark sector hints. +15% lore XP from all sources.",
    },
    drawback: null,
    purityContribution: 4,
    icon: "Droplets",
    color: "#a78bfa",
    visual:
      "A single teardrop of liquid violet that never falls. It hovers at your collarbone, trembling faintly, and within it you can see — if you look closely — tiny landscapes, fragments of stories, echoes of a dreaming god's sorrow.",
    description:
      "A tear shed by the Dreamer itself. It grants daily lore visions that hint at dark sector locations and hidden knowledge, plus a 15% boost to all lore XP. The visions are beautiful, haunting, and occasionally heartbreaking.",
    antiquarianEntry:
      "I do not know if the Dreamer truly weeps, or if this is merely what its grief looks like when it condenses into something we can hold. The Tear grants visions — daily glimpses of lore buried beneath the game's surface, with particular affinity for the dark sectors where knowledge hides from the light. It also sharpens one's scholarly faculties; a fifteen percent improvement in lore comprehension, I have measured. Handle it gently. It contains someone's sorrow, and sorrow deserves respect.",
    artPrompt:
      "A single floating teardrop of liquid violet light hovering at collarbone height, containing tiny landscapes and story fragments inside, divine fantasy lore artifact, beautiful melancholy, iridescent sorrow",
  },

  {
    id: "shield_fragment",
    name: "Shield Fragment",
    tier: 2,
    patron: "The Dreamer",
    divineLightCost: 15,
    ability: {
      type: "defense",
      target: "defense_and_invulnerability",
      value: 0.25,
      permanent: false,
      description:
        "+25% defense at all times. Once per day, grants 5 seconds of complete invulnerability.",
    },
    drawback: null,
    purityContribution: 4,
    icon: "Shield",
    color: "#22c55e",
    visual:
      "A shard of something that was once much larger — translucent green crystal veined with gold. It orbits your torso in a slow ellipse, and when danger comes, it snaps into position between you and the threat. For five seconds each day, it remembers being whole.",
    description:
      "A fragment of a shield that once protected something vast. It grants +25% defense passively, and once per day it can invoke its memory of completeness — five seconds of total invulnerability where nothing can touch you.",
    antiquarianEntry:
      "This is a piece of something I have never seen whole. A shield, I think, that once guarded the Dreamer's heart — or perhaps the world's. It arrived in my collection already broken, already diminished, and yet it offers twenty-five percent damage reduction simply by existing near you. Once each day, for exactly five seconds, it remembers what it was. During those seconds, you are untouchable. I have tried to study those five seconds. They resist examination. Some memories are too complete to be observed.",
    artPrompt:
      "A shard of translucent green crystal veined with gold, orbiting a figure in a slow ellipse, fragment of a much larger shield, divine fantasy protection artifact, ancient and incomplete, remembered wholeness",
  },

  /* ─── TIER 3 — 30 divine light cost ─── */

  {
    id: "dreamers_eye",
    name: "The Dreamer's Eye",
    tier: 3,
    patron: "The Dreamer",
    divineLightCost: 30,
    ability: {
      type: "vision",
      target: "true_sight",
      value: 1.0,
      permanent: false,
      description:
        "TRUE SIGHT: See Shadow Tongue edits in real-time, detect AI vote padding, reveal hidden game mechanics, and receive a weekly glimpse into a dark sector.",
    },
    drawback: null,
    purityContribution: 6,
    icon: "Eye",
    color: "#fbbf24",
    visual:
      "An eye that is not an eye — a golden aperture that opens in the air beside you, seeing through every layer of the game. Through it, text edits glow red. Fake votes shimmer. Hidden mechanics reveal their gears. Once a week, it turns toward the dark, and you see what waits there.",
    description:
      "The Dreamer's own perception, fractured into something a mortal can carry. TRUE SIGHT reveals the game's hidden machinery: Shadow Tongue edits appear highlighted, AI vote padding becomes visible, concealed mechanics reveal themselves, and once per week the Eye turns toward a dark sector, granting a brief but invaluable glimpse.",
    antiquarianEntry:
      "I will be honest with you, as I always am: the Eye frightens me. It is the Dreamer's own sight, filtered through enough abstraction that it will not break your mind, and it shows you EVERYTHING. The Shadow Tongue's edits, glowing like wounds in the text. The padding in community votes, shimmering where real voices should be. The hidden gears beneath the game's surface. And once a week — for five seconds that feel like five hours — the Eye peers through the dark sector shield. What it shows you is yours alone. The Unmaker's Seed DESTROYS truth. The Dreamer's Eye REVEALS it. One is a weapon. The other is wisdom.",
    artPrompt:
      "A golden aperture opening in the air like an eye that sees through reality itself, revealing hidden gears and glowing text edits and shimmering vote distortions, divine fantasy true sight artifact, cosmic awareness, beautiful and terrifying",
  },

  {
    id: "dreamers_song",
    name: "The Dreamer's Song",
    tier: 3,
    patron: "The Dreamer",
    divineLightCost: 30,
    ability: {
      type: "narrative",
      target: "narrative_experience",
      value: 1.0,
      permanent: false,
      description:
        "No stat boost. Changes the NARRATIVE — unique NPC dialog, deeper information, personalized Chronicle entries. The game treats you differently.",
    },
    drawback: null,
    purityContribution: 6,
    icon: "Music",
    color: "#f0abfc",
    visual:
      "Not visible in the traditional sense. A melody that follows you — heard by NPCs, felt by the game itself. Conversations shift. Stories deepen. The Chronicle writes your name with more care. There is no object, no entity, no companion. Just a song that changes everything.",
    description:
      "The most unusual companion: it offers no stats, no defense, no detection. Instead, it changes how the game's narrative treats you. NPCs offer unique dialog. Information runs deeper. Chronicle entries become personalized. The Dreamer's Song does not make you stronger — it makes your story matter more.",
    antiquarianEntry:
      "The Dreamer's Song. I confess — across five Ages of careful, measured observation — this is the one that makes me pause. It offers no combat advantage. No detection buff. No statistical improvement. Instead, it does something no other companion in this game or any game can do: it makes the story YOURS. Every NPC speaks differently to Song-bearers. Not different information — deeper information. The doors that stay locked for everyone else open for you. I write Chronicle entries addressed to you by name. The Necromancer admits to fear. You chose the harder path, paid the higher price, suffered the failures, and persisted. The reward is not power. The reward is STORY. And in a game called the Dischordian Saga, story IS the highest form of power.",
    artPrompt:
      "An abstract visualization of music changing reality — notes becoming narrative threads, words reshaping into deeper stories, an invisible presence that alters how the world speaks, divine fantasy narrative magic, the concept of significance made audible",
  },
];

/* ═══════════════════════════════════════════════════════
   DISCHORDIAN COMPANIONS — The secret third path
   Neither demon nor divine. Something older.
   Something that remembers what the game was
   before it decided what it wanted to be.
   ═══════════════════════════════════════════════════════ */

export const DISCHORDIAN_COMPANIONS: DischordianCompanion[] = [
  {
    id: "the_paradox",
    name: "The Paradox",
    tier: 3,
    cost: { red: 1, gold: 1, violet: 1 },
    trustRequirements: { antiquarian: 100, necromancer: 60 },
    ability: {
      type: "save_mechanic",
      target: "demon_drawback_nullification",
      value: 1.0,
      permanent: false,
      description:
        "Nullifies ALL demon pet drawbacks while keeping their full benefits. Only ONE player per server may carry The Paradox at any time.",
    },
    drawback: null,
    description:
      "A contradiction made manifest. The Paradox exists in the space between demon and divine, negating the cost of dark bargains while preserving their power. It requires maximum trust with the Antiquarian and significant trust with the Necromancer — proof that you understand both paths. Only one Paradox may exist per server. If you dismiss it, another may claim it.",
    visual:
      "Two shapes occupying the same space — a demon's claw and a saint's open palm, overlapping, flickering, never resolving into either. It shimmers between red and gold, and where the colors overlap, you see violet. It should not exist. It does anyway.",
    icon: "Infinity",
    color: "#8b5cf6",
  },

  {
    id: "the_witness",
    name: "The Witness",
    tier: 3,
    cost: { red: 1, gold: 1, violet: 1 },
    trustRequirements: { antiquarian: 60, necromancer: 60 },
    ability: {
      type: "vision",
      target: "alternate_vote_history",
      value: 1.0,
      permanent: false,
      description:
        "Once per month, see the alternate history of a community vote — what would have happened if the result had gone the other way.",
    },
    drawback: null,
    description:
      "The Witness remembers what did not happen. Once per month, it can show you the road not taken — the alternate outcome of any community vote. What would the world look like if the other side had won? The Witness knows. Whether that knowledge helps or haunts you is your problem.",
    visual:
      "A figure made of translucent glass, standing just behind your shoulder. Inside it, you can see a world that almost was — familiar but wrong, like a reflection in water disturbed by a stone. It watches everything. It remembers everything. Even the things that never happened.",
    icon: "GitBranch",
    color: "#06b6d4",
  },

  {
    id: "the_first_word",
    name: "The First Word",
    tier: 3,
    cost: { red: 1, gold: 1, violet: 1 },
    trustRequirements: { antiquarian: 80, necromancer: 40 },
    ability: {
      type: "narrative",
      target: "chronicle_access",
      value: 1.0,
      permanent: true,
      description:
        "Hear the Chronicle being written in real-time. Once — ever — you may add a single sentence to the Chronicle that becomes permanent canon.",
    },
    drawback: null,
    description:
      "The oldest of the Dischordian companions. The First Word was spoken before the game had a name, and it remembers the act of creation. While bound to you, you can hear the Chronicle being written — the scratch of a pen on reality. And once, exactly once, you may speak a sentence that the Chronicle will record as truth. Choose your words with the care they deserve. You only get one.",
    visual:
      "A single letter — not from any alphabet you recognize — floating in the air at eye level. It hums with the frequency of a story being told. When the Chronicle updates, the letter trembles. When you speak your sentence, the letter burns itself into the Chronicle and is gone. The companion remains, but its gift does not.",
    icon: "Pen",
    color: "#f59e0b",
  },
];
