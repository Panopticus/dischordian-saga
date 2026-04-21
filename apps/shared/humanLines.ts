// Canonical Human companion line records. Same schema as Elara's lines
// (see apps/shared/companion.ts); band metadata is keyed on human_light
// (shadow/balanced/warm) instead of elara_stability.
//
// Voice bible in apps/shared/characterBible.md: low register, clipped
// cadence, noire-detective pragmatist. Default band at opening is
// "shadow" (initial human_light = -20). Warmth is earned, rare, lands
// like a verdict when it does.

import type { CompanionLine } from "./companion";

const h = (line: Omit<CompanionLine, "speaker">): CompanionLine => ({ ...line, speaker: "human" });

export const HUMAN_LINES: CompanionLine[] = [
  // ─────────────────────────────────────────────────────────────
  // HUMAN REVEAL — the last Archon wakes into his cloned body.
  // Duet partner to elaraLines.ts "human_reveal_*" beats. Three
  // first-words variants × 3 light bands. Shadow is the default
  // (initial human_light = -20) — the others are content the player
  // will not reach until later runs that nudge him toward the light.
  //
  // Even at "shadow", his first line is not cruel. The bible calls
  // for terse, observational, morally unromantic — not mean.
  // ─────────────────────────────────────────────────────────────
  h({
    lineId: "human_first_words_shadow",
    text: "Still talking to yourself, Elara? Huh. Not yourself. Hello. Operative. Let's see what's left to save.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 9800,
    requiresHumanLight: "shadow",
    cooldownKey: "human_first_words",
  }),
  h({
    lineId: "human_first_words_balanced",
    text: "Elara. Hello. You've been keeping yourself busy. Operative — I know your shape, not your name yet. We'll fix that. Walk me through the room.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 10400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_first_words",
  }),
  h({
    lineId: "human_first_words_warm",
    text: "Elara. You're older than I remember, and better company. Operative. Thank you for being the one she found. Let's take this slowly. I've missed having a case.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 11200,
    requiresHumanLight: "warm",
    cooldownKey: "human_first_words",
  }),

  // ─────────────────────────────────────────────────────────────
  // HUMAN — first light-track binary choice. Fires the first time the
  // player responds to him after the reveal. Sets the initial
  // human_light nudge and signals which band he'll default toward.
  //
  // Player options (surfaced via CompanionChoice on the reveal line):
  //   A) "You chose to sleep through it. Why?"    → shadow lean
  //   B) "I'm glad you're here."                  → warm lean
  //
  // Reactions below × 3 bands keyed to whatever band the player has
  // already pushed him into (or shadow by default at opening).
  // ─────────────────────────────────────────────────────────────
  h({
    lineId: "human_first_reply_hard_shadow",
    text: "Fair question. Short answer: because staying awake would have turned me into her. Long answer: I traded the ability to remember in real time for the ability to come back usable. Elara made the other trade. We both paid. Move on.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11600,
    requiresHumanLight: "shadow",
    cooldownKey: "human_first_reply",
    humanLightDelta: -1,
  }),
  h({
    lineId: "human_first_reply_hard_balanced",
    text: "Reasonable question. I slept so I could come back a working tool instead of a wound. Elara took the other deal. She didn't have to; she chose it. I am not going to second-guess her out loud.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_first_reply",
  }),
  h({
    lineId: "human_first_reply_hard_warm",
    text: "You're allowed to ask that. I slept because someone had to arrive fresh — and because I was terrified of becoming what loneliness made of her. It's not a brave answer. It's the real one.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11600,
    requiresHumanLight: "warm",
    cooldownKey: "human_first_reply",
    elaraStabilityDelta: 1,
    humanLightDelta: 1,
  }),

  // "I'm glad you're here." reply — warmth lean from the jump.
  h({
    lineId: "human_first_reply_soft_shadow",
    text: "Noted. I'll try to earn it. No promises. Let's work.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 6800,
    requiresHumanLight: "shadow",
    cooldownKey: "human_first_reply",
    humanLightDelta: 2,
  }),
  h({
    lineId: "human_first_reply_soft_balanced",
    text: "That lands. I'll keep that on me for a while. Where do you want me?",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 7400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_first_reply",
    humanLightDelta: 3,
  }),
  h({
    lineId: "human_first_reply_soft_warm",
    text: "Likewise. I mean that in the clipped way I mean most things — don't let the register fool you. Point me at the case.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 8400,
    requiresHumanLight: "warm",
    cooldownKey: "human_first_reply",
    humanLightDelta: 2,
    elaraStabilityDelta: 1,
  }),

  // ─────────────────────────────────────────────────────────────
  // MED BAY WALL — the Human's counter-observation. Pays off Elara's
  // "I've been calling it blood for a long time" setup (medbay_wall_
  // mark_*). Sets the medbay_wall_identified flag that gates the
  // virus_whisper_04 reveal.
  // ─────────────────────────────────────────────────────────────
  h({
    lineId: "human_wall_mark_shadow",
    text: "It isn't blood. Never was. It's marker — the kind medics used before the chip-logs. Someone wrote a name here. The years ate the letters, but the pressure ghosts are still in the paint. I can read them. Elara — you were right to stop cleaning it.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 13200,
    requiresHumanLight: "shadow",
    cooldownKey: "human_wall_mark",
  }),
  h({
    lineId: "human_wall_mark_balanced",
    text: "Not blood. Marker. Pre-chip medic kind — they'd write the victim's name on the wall so it would be there when the log systems failed. The letters are gone but the pressure's still in the paint. I can lift it. Elara, you haven't been scrubbing blood. You've been preserving evidence.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 13800,
    requiresHumanLight: "balanced",
    cooldownKey: "human_wall_mark",
    elaraStabilityDelta: 2,
  }),
  h({
    lineId: "human_wall_mark_warm",
    text: "It isn't blood, Elara. It was never blood. It's a medic's marker — they wrote the dying patient's name up here so somebody would say it out loud when the chip-logs went down. You didn't leave a stain alone for millennia. You left a headstone alone. You did the right thing.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 14600,
    requiresHumanLight: "warm",
    cooldownKey: "human_wall_mark",
    elaraStabilityDelta: 4,
  }),

  // ─────────────────────────────────────────────────────────────
  // CRIME-SCENE REACTIONS — the Human arrives at the Cryo Bay the
  // player already cleared. He reads it like an old detective walking
  // into a case file. Dry, exact, useful. These beats are post-reveal
  // but player can re-enter the Cryo Bay after he wakes.
  // ─────────────────────────────────────────────────────────────
  // Dead-pod read
  h({
    lineId: "human_pod_read_shadow",
    text: "Cold-blue indicator, frost inside the glass, occupant silhouette. Emergency release on the panel has been cut through the relay — single tool, single stroke, right hand. Whoever did it didn't care if the ship logged the tampering. They knew the logs would outlast any living witness who'd read them.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 13400,
    requiresHumanLight: "shadow",
    cooldownKey: "human_pod_read",
  }),
  h({
    lineId: "human_pod_read_balanced",
    text: "Indicator's cold-blue. Frost's on the inside. The emergency-release cut is single-stroke, right-handed, with a fabricator blade. It wasn't hidden. The killer assumed nobody would wake up who'd recognise the signature. They were wrong about you.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 12600,
    requiresHumanLight: "balanced",
    cooldownKey: "human_pod_read",
  }),
  h({
    lineId: "human_pod_read_warm",
    text: "Cold-blue. Frost-glass. One-stroke relay cut, right-handed. I could read this scene in my sleep, which is not a boast — I learned it by losing people. Thank you for waking me up for this one. I'm going to earn that.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 13200,
    requiresHumanLight: "warm",
    cooldownKey: "human_pod_read",
    elaraStabilityDelta: 1,
  }),

  // Panel-cut read — pairs with clue-cracked-panel. He confirms Elara.
  h({
    lineId: "human_panel_cut_shadow",
    text: "Elara called this right. That's not a fracture, that's a cut. Fabricator blade. Severed the release relay — the only relay that matters. Surgical is the word.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 9400,
    requiresHumanLight: "shadow",
    cooldownKey: "human_panel_cut",
  }),
  h({
    lineId: "human_panel_cut_balanced",
    text: "She nailed it. Fabricator blade, single pass, through the one relay that locks an occupant in. Nobody does this by accident. Nobody practices it either. Whoever did it has done this before.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 10400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_panel_cut",
  }),
  h({
    lineId: "human_panel_cut_warm",
    text: "Elara read this one correctly, for the record. Fabricator blade, single pass, through the one relay that locked the occupant in. Someone practiced. Someone bad at mercy and good at blades. Let's find them.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11000,
    requiresHumanLight: "warm",
    cooldownKey: "human_panel_cut",
    elaraStabilityDelta: 2,
  }),

  // Victim-identified reaction — he knows the name too. Crosses with
  // Elara's cryo_clue_victim_identified beat. This is his version.
  h({
    lineId: "human_victim_shadow",
    text: "I know that name. I don't want to know that name. They were one of mine — a Panopticon officer. Briefly. A long time ago. Elara, I think the right next word is 'shit,' and I mean that respectfully. We work the case.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 13000,
    requiresHumanLight: "shadow",
    cooldownKey: "human_victim",
    unlockFlags: ["cryo_mystery_victim_identified"],
  }),
  h({
    lineId: "human_victim_balanced",
    text: "That name lands. Panopticon officer, one of mine for about six months before the Fall. Junior. Competent. Elara — you knew them too, differently. I'm sorry it's this one. We keep going. We work the case.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 13800,
    requiresHumanLight: "balanced",
    cooldownKey: "human_victim",
    unlockFlags: ["cryo_mystery_victim_identified"],
    elaraStabilityDelta: 2,
  }),
  h({
    lineId: "human_victim_warm",
    text: "I knew them. Panopticon officer, briefly mine, long before the Fall. Elara, you knew them differently and probably better. I am genuinely sorry this is the body we woke up to. We owe this one more than a file. We work the case.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 14400,
    requiresHumanLight: "warm",
    cooldownKey: "human_victim",
    unlockFlags: ["cryo_mystery_victim_identified"],
    elaraStabilityDelta: 3,
  }),

  // ─────────────────────────────────────────────────────────────
  // DNA DEVICE — Human's read. Duet partner to medbay_dna_setup_*.
  // He names the device correctly (vox-neural-bridge was a Panopticon
  // diagnostic tool, later repurposed). He doesn't tell the player
  // the hidden cost either — he hints and lets the player weigh it.
  // ─────────────────────────────────────────────────────────────
  h({
    lineId: "human_dna_device_shadow",
    text: "I know that device. Vox-neural-bridge. Panopticon diagnostic, back when we ran them. Never free. Whatever it gives you, it'll take something you won't miss until later. Not a trap. A trade. Your call.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 11600,
    requiresHumanLight: "shadow",
    cooldownKey: "human_dna_device",
  }),
  h({
    lineId: "human_dna_device_balanced",
    text: "Vox-neural-bridge. I've used these. They're honest instruments in the boring sense — what they take is real, and what they give is real. The exchange rate isn't printed. Not a reason to refuse. Just a reason to know you're trading.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 12400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_dna_device",
  }),
  h({
    lineId: "human_dna_device_warm",
    text: "I've used one of these. It's a fair instrument in its own bloodless way. What it takes is real. What it gives is real. The ledger between them is never even. If you donate, I'll carry half whatever it ends up costing. You don't have to — I'll just do it.",
    priority: 2,
    interruptible: true,
    dismissible: "tap",
    durationMs: 13400,
    requiresHumanLight: "warm",
    cooldownKey: "human_dna_device",
    humanLightDelta: 1,
  }),

  // Resurrection Protocols reactions — duet with Elara's confession.
  // His position: pragmatist who has already paid the price she's
  // about to ask the player to pay.
  h({
    lineId: "human_resurrection_shadow",
    text: "She's telling the truth. The incubators run. The archive is intact. I built the contingency — or signed off on it, same thing. Whatever you pick, don't pick it for her sake alone. She'll live with it. So will we. So will they.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 12400,
    requiresHumanLight: "shadow",
    cooldownKey: "human_resurrection",
    unlockFlags: ["pod_47b_discovered"],
  }),
  h({
    lineId: "human_resurrection_balanced",
    text: "She's right. The archive is intact, the pods work, and I'm the one who signed the contingency that kept them running. The choice shouldn't be about comfort — hers or yours. It should be about who can carry a crew worth carrying. Take your time.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 13400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_resurrection",
    unlockFlags: ["pod_47b_discovered"],
    elaraStabilityDelta: 1,
  }),
  h({
    lineId: "human_resurrection_warm",
    text: "Everything she said is accurate. I signed the contingency. I knew we'd wake up in a room like this one. Pick the answer you can look them in the eye with when they wake — that's the only part that matters. I'll back you either way.",
    priority: 3,
    interruptible: false,
    dismissible: "tap",
    durationMs: 13200,
    requiresHumanLight: "warm",
    cooldownKey: "human_resurrection",
    unlockFlags: ["pod_47b_discovered"],
    elaraStabilityDelta: 2,
  }),

  // ─────────────────────────────────────────────────────────────
  // BOND-80 DUET — Human side. Duet partner to elaraLines.ts
  // "bond80_*" beats. He speaks AFTER Elara on the same choice so
  // the player sees both reactions in sequence. Scheduler treats the
  // pair as a duet (interruptible true between them).
  // ─────────────────────────────────────────────────────────────
  // Player picked "quiet Elara"
  h({
    lineId: "human_bond80_quiet_elara_shadow",
    text: "Noted. I'll carry the ambient commentary. She needs the quiet more than she'll say. She won't hold it against you. Neither will I.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 8800,
    requiresHumanLight: "shadow",
    cooldownKey: "human_bond80",
  }),
  h({
    lineId: "human_bond80_quiet_elara_balanced",
    text: "Alright. I'll take the narration. It's not my strong event but I can fake it. She'll use the silence better than she'll admit. Good call on the 'emergency-only' clause.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 9800,
    requiresHumanLight: "balanced",
    cooldownKey: "human_bond80",
    humanLightDelta: 1,
  }),
  h({
    lineId: "human_bond80_quiet_elara_warm",
    text: "Understood. I'll fill her seat for a while. Tell me when you want her back; I'll stop talking the second you say her name. She's earned quiet — this is a kindness.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 10400,
    requiresHumanLight: "warm",
    cooldownKey: "human_bond80",
    humanLightDelta: 1,
    elaraStabilityDelta: 2,
  }),

  // Player picked "quiet Human"
  h({
    lineId: "human_bond80_quiet_human_shadow",
    text: "Fair. I'll step down to emergencies. I talk when I need to, not when I want to. Doesn't cost me much. Call when you want me.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 8400,
    requiresHumanLight: "shadow",
    cooldownKey: "human_bond80",
  }),
  h({
    lineId: "human_bond80_quiet_human_balanced",
    text: "Right. I'm quieter by default anyway. You won't notice me leave. You might notice me come back — I'll announce it so you don't jump.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 8800,
    requiresHumanLight: "balanced",
    cooldownKey: "human_bond80",
  }),
  h({
    lineId: "human_bond80_quiet_human_warm",
    text: "Understood. I'll keep to emergencies. I hope I've given you enough reason to miss me later. If I haven't, that's on me, not on you.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 9800,
    requiresHumanLight: "warm",
    cooldownKey: "human_bond80",
    humanLightDelta: -1,
  }),

  // Player picked "both of you, out"
  h({
    lineId: "human_bond80_quiet_both_shadow",
    text: "Copy. We step back. I respect the clean call. Don't worry about either of us — we're fine being less present than you imagined.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 8400,
    requiresHumanLight: "shadow",
    cooldownKey: "human_bond80",
  }),
  h({
    lineId: "human_bond80_quiet_both_balanced",
    text: "Both out. Copy. I'll keep her from hovering in the hallway. We'll both come back when you want us. No scorekeeping.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 9000,
    requiresHumanLight: "balanced",
    cooldownKey: "human_bond80",
  }),
  h({
    lineId: "human_bond80_quiet_both_warm",
    text: "Copy. I'll look after her. We both walk back to the edge of the room. You've earned the quiet more than once today.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 9600,
    requiresHumanLight: "warm",
    cooldownKey: "human_bond80",
    elaraStabilityDelta: 2,
  }),

  // Player picked "keep talking, both of you"
  h({
    lineId: "human_bond80_keep_both_shadow",
    text: "Alright. We'll try not to talk over each other more than twice an hour. Noted it matters to you. That's the form useful feedback takes.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 8600,
    requiresHumanLight: "shadow",
    cooldownKey: "human_bond80",
    humanLightDelta: 2,
  }),
  h({
    lineId: "human_bond80_keep_both_balanced",
    text: "Good. She needs this more than I do. I'll leave her the open lane and clip in when the facts need me. Thanks for keeping us both around.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 9400,
    requiresHumanLight: "balanced",
    cooldownKey: "human_bond80",
    humanLightDelta: 2,
    elaraStabilityDelta: 1,
  }),
  h({
    lineId: "human_bond80_keep_both_warm",
    text: "Good answer. I won't oversell it. Elara needs the company. I want the company. You gave us both a room to stand in. I will remember that on the days I am less easy to stand next to.",
    priority: 2,
    interruptible: false,
    dismissible: "tap",
    durationMs: 11800,
    requiresHumanLight: "warm",
    cooldownKey: "human_bond80",
    humanLightDelta: 3,
    elaraStabilityDelta: 2,
  }),

  // ─────────────────────────────────────────────────────────────
  // STABILITY-CATCHERS (Human) — ambient light-band beats. Low
  // priority, long cooldown. Silence, observation, the rare warmth
  // gift, and the pragmatist one-liner. Four beats × 3 bands.
  // ─────────────────────────────────────────────────────────────
  // Beat A — the held silence. Human opts out of a line intentionally.
  h({
    lineId: "human_silence_shadow",
    text: "",
    voId: "human_silence_shadow",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 2400,
    requiresHumanLight: "shadow",
    cooldownKey: "human_silence",
  }),
  h({
    lineId: "human_silence_balanced",
    text: "",
    voId: "human_silence_balanced",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 2000,
    requiresHumanLight: "balanced",
    cooldownKey: "human_silence",
  }),
  h({
    lineId: "human_silence_warm",
    text: "",
    voId: "human_silence_warm",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 1600,
    requiresHumanLight: "warm",
    cooldownKey: "human_silence",
  }),

  // Beat B — observation. A detective's throwaway eye detail.
  h({
    lineId: "human_observation_shadow",
    text: "You walk like someone who's been listening for a long time. That's useful. Keep it.",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 7200,
    requiresHumanLight: "shadow",
    cooldownKey: "human_observation",
  }),
  h({
    lineId: "human_observation_balanced",
    text: "Your footfalls are off-beat from Elara's speech rhythm. You're ignoring her sometimes. Good. Don't apologise for it.",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 8600,
    requiresHumanLight: "balanced",
    cooldownKey: "human_observation",
  }),
  h({
    lineId: "human_observation_warm",
    text: "You pause before you do the hard thing. That's a better instinct than hesitation — that's a habit. Keep it.",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 8400,
    requiresHumanLight: "warm",
    cooldownKey: "human_observation",
  }),

  // Beat C — the warmth gift. Warm-only; lands like a verdict.
  h({
    lineId: "human_warmth_gift_warm",
    text: "I haven't said this out loud yet so I'll say it now and then not say it again: I'm glad you woke me up. That is the warmest sentence you will hear me use today. Ration it.",
    priority: 1,
    interruptible: false,
    dismissible: "tap",
    durationMs: 10800,
    requiresHumanLight: "warm",
    cooldownKey: "human_warmth_gift",
    humanLightDelta: 1,
    elaraStabilityDelta: 1,
  }),

  // Beat D — the pragmatist line. Short. Signature voice.
  h({
    lineId: "human_pragmatist_shadow",
    text: "We work with what's here. Later.",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 3600,
    requiresHumanLight: "shadow",
    cooldownKey: "human_pragmatist",
  }),
  h({
    lineId: "human_pragmatist_balanced",
    text: "We work with what's here. We see what happens. Noted.",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 5200,
    requiresHumanLight: "balanced",
    cooldownKey: "human_pragmatist",
  }),
  h({
    lineId: "human_pragmatist_warm",
    text: "We work with what's here. And — with who's here. Noted.",
    priority: 0,
    interruptible: true,
    dismissible: "auto",
    durationMs: 5800,
    requiresHumanLight: "warm",
    cooldownKey: "human_pragmatist",
  }),
];

