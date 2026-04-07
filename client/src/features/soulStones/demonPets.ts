/* ═══════════════════════════════════════════════════════
   DEMON PETS — Summoned through the Necromancer
   Each pet offers power at a price. The Necromancer
   never lies about the cost — players just don't listen.
   ═══════════════════════════════════════════════════════ */

import type { DemonPet } from "./types";

export const DEMON_PETS: DemonPet[] = [
  /* ─── TIER 1 — 7 corruption cost ─── */

  {
    id: "imp_of_ruin",
    name: "Imp of Ruin",
    patron: "Xeth'Raal",
    patronTitle: "the Debt Collector",
    tier: 1,
    corruptionCost: 7,
    ability: {
      type: "economy",
      target: "dream_token_income",
      value: 0.10,
      permanent: false,
      description:
        "+10% Dream Token income from all sources while the Imp is bound to you.",
    },
    drawback: {
      type: "periodic_drain",
      severity: 3,
      frequency: "weekly",
      description:
        "The Imp skims 5% of your Dream Token balance every 7 days. It calls this 'interest.'",
      reversible: true,
    },
    corruptionContribution: 2,
    icon: "Coins",
    color: "#fbbf24",
    visual:
      "A palm-sized creature of tarnished gold, shaped like a crouching merchant with too many fingers. Its eyes are coins — one stamped with a skull, one with a crown. Ink-black ledger pages flutter behind it like moth wings.",
    description:
      "A minor fiend in the service of Xeth'Raal the Debt Collector. It increases your Dream Token income by 10%, but every seven days it quietly siphons 5% of your balance. The Imp does not steal — it collects what it believes it is owed.",
    necromancerDialog:
      "Ah, you want the little accountant? It'll fatten your purse, sure enough. But Xeth'Raal's servants always take their cut. Read the contract carefully — actually, don't bother. You won't understand it anyway. Nobody does until the bill comes due.",
    artPrompt:
      "A tiny imp made of tarnished gold coins and ink, crouching like a merchant counting money, wings made of black ledger pages, eyes are glowing coins, dark fantasy style, eldritch economy horror",
  },

  {
    id: "shadow_hound",
    name: "Shadow Hound",
    patron: "Fenra",
    patronTitle: "the Moon Tyrant",
    tier: 1,
    corruptionCost: 7,
    ability: {
      type: "detection",
      target: "detection_range",
      value: 0.15,
      permanent: false,
      description:
        "+15% detection range for hidden items, secret passages, and lurking entities.",
    },
    drawback: {
      type: "increased_threat",
      severity: 4,
      frequency: "per_use",
      description:
        "+10% hostile encounter rate. The Hound's howling draws things from the dark.",
      reversible: true,
    },
    corruptionContribution: 2,
    icon: "Dog",
    color: "#6366f1",
    visual:
      "A canine silhouette that never fully solidifies — its body is made of layered shadows that ripple like water. Two violet eyes burn in a head that is more absence than shape. Where it walks, moonlight dims.",
    description:
      "A hunting beast loyal to Fenra the Moon Tyrant. Its senses extend your detection range by 15%, revealing secrets hidden in the dark. But the Hound howls when it hunts, and that howling draws hostile attention — a 10% increase in dangerous encounters.",
    necromancerDialog:
      "Fenra's hound will find what you're looking for. Every secret, every hidden door. But it hunts by howling, and things in the dark howl back. You'll see more, yes — but more will see you.",
    artPrompt:
      "A spectral hound made of layered shadows and dark mist, two glowing violet eyes, moonlight dimming around it, dark fantasy hunting beast, eldritch canine horror",
  },

  {
    id: "whisper_moth",
    name: "Whisper Moth",
    patron: "Ith'Rael",
    patronTitle: "the Whisperer",
    tier: 1,
    corruptionCost: 7,
    ability: {
      type: "social",
      target: "npc_trust_gain",
      value: 0.10,
      permanent: false,
      description:
        "+10% NPC Trust gain from all interactions while the Moth rests on your shoulder.",
    },
    drawback: {
      type: "fragile_trust",
      severity: 5,
      frequency: "per_use",
      description:
        "Trust gained while the Moth is active is FRAGILE. Dismissing the Moth removes 20% of all trust earned during its binding.",
      reversible: false,
    },
    corruptionContribution: 2,
    icon: "Bug",
    color: "#a78bfa",
    visual:
      "A moth the size of a human hand, wings dusted with iridescent violet powder that shifts to spell half-formed words. Its antennae curl like question marks. It perches on the shoulder and whispers the right thing to say — always the right thing.",
    description:
      "A servant of Ith'Rael the Whisperer. It feeds you the perfect words for every conversation, boosting NPC Trust gain by 10%. But the trust you earn is built on borrowed eloquence — dismiss the Moth and 20% of the trust it helped you build crumbles away.",
    necromancerDialog:
      "The Moth knows what everyone wants to hear. It'll sit on your shoulder and murmur the perfect words into your ear. People will love you. But it's the Moth they're loving, not you. Send it away and... well. You'll feel the difference.",
    artPrompt:
      "An iridescent violet moth with wings covered in shifting text and half-formed words, antennae curled like question marks, perched on a shoulder, dark fantasy whispering familiar, eldritch social manipulation",
  },

  /* ─── TIER 2 — 15 corruption cost ─── */

  {
    id: "blood_familiar",
    name: "Blood Familiar",
    patron: "Varkul",
    patronTitle: "the Blood Lord",
    tier: 2,
    corruptionCost: 15,
    ability: {
      type: "defense",
      target: "defense",
      value: 0.20,
      permanent: false,
      description:
        "+20% defense against all damage sources while the Familiar orbits you.",
    },
    drawback: {
      type: "health_drain",
      severity: 6,
      frequency: "weekly",
      description:
        "Drains 1% of your maximum HP per week. This reduction is PERMANENT and persists after dismissal.",
      reversible: false,
    },
    corruptionContribution: 4,
    icon: "Heart",
    color: "#ef4444",
    visual:
      "A sphere of slowly rotating blood, perfectly suspended, reflecting light that isn't there. Tiny crimson tendrils reach outward like capillaries seeking connection. At its core, something pulses — not a heart, but close enough to be unsettling.",
    description:
      "An emanation of Varkul the Blood Lord. It wraps you in a shield of living blood, granting +20% defense. But it feeds on you — 1% of your maximum HP is permanently drained each week. The defense is temporary. The cost is forever.",
    necromancerDialog:
      "Varkul's gift is simple: your blood for your safety. The Familiar will shield you well — very well. But it drinks deep, and what it takes from your vitality doesn't come back. Ever. Most summoners dismiss it before the damage shows. The wise ones never summon it at all.",
    artPrompt:
      "A floating sphere of slowly rotating blood with crimson tendrils reaching outward like capillaries, a pulsing core, dark fantasy blood magic familiar, body horror, eldritch vampiric entity",
  },

  {
    id: "harvest_tendril",
    name: "Harvest Tendril",
    patron: "Drael'Mon",
    patronTitle: "the Harvester",
    tier: 2,
    corruptionCost: 15,
    ability: {
      type: "economy",
      target: "soul_stone_drop_rate",
      value: 2.0,
      permanent: false,
      description:
        "DOUBLE Soul Stone drop rate from all sources while the Tendril is active.",
    },
    drawback: {
      type: "perception_corruption",
      severity: 5,
      frequency: "per_use",
      description:
        "50% of bonus Soul Stones (those gained from the doubled rate) arrive pre-corrupted as red stones.",
      reversible: true,
    },
    corruptionContribution: 4,
    icon: "Grip",
    color: "#22c55e",
    visual:
      "A vine-like appendage of dark green chitin that grows from the ground at your feet. It ends in a cluster of translucent pods, each containing a faintly glowing stone. Some glow violet. Some glow red. The Tendril doesn't let you choose.",
    description:
      "An extension of Drael'Mon the Harvester. It doubles your Soul Stone drop rate, but half of the bonus stones arrive already corrupted — red and heavy with dark energy. More stones, yes. But at what color?",
    necromancerDialog:
      "Drael'Mon's Tendril will fill your pockets with stones faster than you can count. Generous, isn't it? But the Harvester grows what the Harvester wants. Half those extra stones will come to you already red. Already spoken for. Still want the bounty?",
    artPrompt:
      "A dark green chitinous vine growing from the ground with translucent pods containing glowing violet and red stones, dark fantasy harvest horror, eldritch plant parasite, soul stone farming",
  },

  {
    id: "flayed_lens",
    name: "Flayed Lens",
    patron: "Zyr'Koth",
    patronTitle: "the Flayer",
    tier: 2,
    corruptionCost: 15,
    ability: {
      type: "vision",
      target: "enemy_info",
      value: 1.0,
      permanent: false,
      description:
        "See enemy health bars, weaknesses, resistances, and hidden abilities.",
    },
    drawback: {
      type: "perception_corruption",
      severity: 7,
      frequency: "daily",
      description:
        "Random 'insight events' — intrusive visions showing your past failures, missed opportunities, and paths not taken. Disorienting and demoralizing.",
      reversible: true,
    },
    corruptionContribution: 4,
    icon: "Eye",
    color: "#f97316",
    visual:
      "An eye that floats at shoulder height, lidless and unblinking. Its iris is a fractal spiral of orange and black. The pupil is a window into somewhere else. Occasionally, it turns to look at YOU instead of your enemies.",
    description:
      "A sensory organ of Zyr'Koth the Flayer. It strips away the veil, revealing enemy health, weaknesses, and hidden abilities. But the Lens sees everything — including your own failures. Expect random 'insight events' replaying your worst moments in vivid detail.",
    necromancerDialog:
      "The Flayer's eye sees all truth. Enemy weaknesses, hidden traps, secret doors — nothing is hidden from it. But Zyr'Koth believes that all truth should be seen, including yours. It will show you things you've failed at. Things you've lost. Are you prepared to see clearly?",
    artPrompt:
      "A floating lidless eye with a fractal spiral iris of orange and black, the pupil a window to another dimension, dark fantasy all-seeing horror, eldritch perception entity",
  },

  /* ─── TIER 3 — 30 corruption cost ─── */

  {
    id: "corruptors_mirror",
    name: "Corruptor's Mirror",
    patron: "Syl'Vex",
    patronTitle: "the Corruptor",
    tier: 3,
    corruptionCost: 30,
    ability: {
      type: "social",
      target: "trust_gain_and_companion_bonuses",
      value: 2.0,
      permanent: false,
      description:
        "ALL trust gains DOUBLED. ALL companion bonuses DOUBLED. Everything feels better, warmer, more rewarding.",
    },
    drawback: {
      type: "dialog_corruption",
      severity: 9,
      frequency: "daily",
      description:
        "NPCs become suspiciously nice. Warnings soften into reassurances. Dangers are downplayed. Critical information is wrapped in comfort. Truth becomes a casualty of pleasantness.",
      reversible: true,
    },
    corruptionContribution: 6,
    icon: "Users",
    color: "#ec4899",
    visual:
      "A hand mirror that hovers at your side, reflecting not your face but a better version of the world — brighter colors, kinder faces, softer edges. The frame is silver laced with pink veins. Looking into it feels like coming home. That's the danger.",
    description:
      "The masterwork of Syl'Vex the Corruptor. It doubles all trust gains and all companion bonuses — the game becomes easier, warmer, more rewarding. But the Mirror corrupts perception. NPCs become suspiciously agreeable, warnings dissolve into reassurance, and the truth is gently, lovingly smothered.",
    necromancerDialog:
      "Syl'Vex offers the most dangerous gift of all: comfort. The Mirror will double everything good in your life. Trust, power, connection — all amplified. But the world it shows you isn't real. People stop warning you. Dangers become invisible. You'll feel wonderful. You'll feel safe. And you'll never see the knife coming.",
    artPrompt:
      "A hovering hand mirror with a silver frame laced with pink veins, reflecting a brighter more beautiful version of the world, dark fantasy corruption through comfort, eldritch gaslighting entity, insidious beauty",
  },

  {
    id: "unmakers_seed",
    name: "The Unmaker's Seed",
    patron: "Mol'Garath",
    patronTitle: "the Unmaker — CEO",
    tier: 3,
    corruptionCost: 30,
    ability: {
      type: "destructive",
      target: "game_element",
      value: 1.0,
      permanent: true,
      description:
        "Once per week, permanently destroy a game element: a loredex entry, an NPC's memory, a community vote result, or an entire room. Gone forever. No undo.",
    },
    drawback: {
      type: "reality_distortion",
      severity: 10,
      frequency: "per_use",
      description:
        "Each use leaves a scar in the game world — a void where something used to be. Other players can see these voids. They know something was there. They know someone unmade it.",
      reversible: false,
    },
    corruptionContribution: 6,
    icon: "Trash2",
    color: "#000000",
    visual:
      "A seed of absolute black — not dark, but the absence of everything. It sits in your palm like a hole in reality. Light bends around it. Sound avoids it. When you use it, the thing it touches doesn't break. It simply stops having ever existed.",
    description:
      "The ultimate gift of Mol'Garath the Unmaker, CEO of the demon hierarchy. Once per week, you may permanently erase a game element — a loredex entry, an NPC's memory, a vote result, a room. It is not destroyed. It is unmade. It never was. But the void remains, and other players can feel where something used to be.",
    necromancerDialog:
      "You want the Seed. Of course you do. Everyone does, eventually. Mol'Garath — the boss, the CEO, the one who signs my paychecks — offers the power to unmake. Not destroy. Unmake. There's a difference. Destroyed things leave rubble. Unmade things leave nothing. Just... a shape where something used to be. Use it wisely. Or don't. The Unmaker doesn't care.",
    artPrompt:
      "A seed of absolute void and nothingness held in a palm, light bending around it, a hole in reality, dark fantasy entropy horror, the concept of un-creation made physical, eldritch cosmic deletion",
  },
];
