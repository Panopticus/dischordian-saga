// ============================================================================
// Bond That Held Quest Chains — One per starter Eidolon, 5 chapters each
// ============================================================================

export interface QuestChoice {
  id: string;
  label: string;
  description: string;
  consequences: string[];
  eidolonEffect: string;
}

export interface BondThatHeldChapter {
  chapter: 1 | 2 | 3 | 4 | 5;
  title: string;
  bondRequirement: number;
  location: string;
  effectivenessGain: number;
  narrative: string;
  choiceA: QuestChoice;
  choiceB: QuestChoice;
  memoryUnlocked: string;
  hasChoice: boolean;
}

export interface BondThatHeldQuestChain {
  eidolonId: string;
  eidolonName: string;
  questTitle: string;
  chapters: BondThatHeldChapter[];
}

// ============================================================================
// LUX — "The Light That Stayed"
// ============================================================================

const luxQuestChain: BondThatHeldQuestChain = {
  eidolonId: 'lux',
  eidolonName: 'Lux',
  questTitle: 'The Light That Stayed',
  chapters: [
    {
      chapter: 1,
      title: 'Flickering',
      bondRequirement: 30,
      location: 'Medical Bay',
      effectivenessGain: 0.03,
      narrative: `Lux has been dimming. Not in the dramatic way that draws attention — in the quiet way that makes you wonder if you imagined it being brighter. The Medical Bay staff have noticed too; instruments near Lux keep giving phantom readings, and twice now its light matrix has destabilized mid-scan.

The Architect's diagnostic is blunt: Lux's photonic matrix is degrading. The bond is demanding more energy than its core can sustain. Without intervention, it will burn itself out trying to maintain the connection — not in weeks or months, but inevitably. Two paths forward exist, and neither is without cost.

The Architect offers a stabilization framework — proven technology, reliable, but it would restructure how Lux processes emotion. The light would be steady but clinical. Alternatively, the Dreamer suggests a resonance approach — letting Lux's matrix find its own frequency through the bond. Warmer, more authentic, but the Dreamer admits that dream-bleed is a known side effect.`,
      choiceA: {
        id: 'lux_ch1_architect_tech',
        label: 'Architect Stabilization',
        description: 'Use the Architect\'s proven technology to stabilize Lux\'s matrix. Reliable and safe, but the light becomes clinical — steady but cold.',
        consequences: [
          'Lux\'s light becomes stable and unwavering',
          'Emotional expression is muted but precise',
          'No risk of matrix failure',
          'Lux\'s ambient glow shifts to a cooler spectrum'
        ],
        eidolonEffect: 'Lux gains "Stabilized Core" — consistent light output, slightly reduced emotional resonance in dialogue.'
      },
      choiceB: {
        id: 'lux_ch1_dreamer_resonance',
        label: 'Dreamer Resonance',
        description: 'Let Lux find its own frequency through the bond. The light stays warm and alive, but dreams may leak through the connection.',
        consequences: [
          'Lux\'s light pulses with genuine warmth',
          'Occasional dream-bleed causes brief visual anomalies',
          'Deeper emotional connection established',
          'Player may experience Lux\'s dream-fragments during rest'
        ],
        eidolonEffect: 'Lux gains "Resonant Core" — richer emotional expression, occasional dream-leak visual effects near the player.'
      },
      memoryUnlocked: 'The First Dimming — the moment Lux realized it was spending more light on you than on itself.',
      hasChoice: true
    },
    {
      chapter: 2,
      title: 'The Holographic Surgeon',
      bondRequirement: 45,
      location: 'Archives',
      effectivenessGain: 0.03,
      narrative: `Lux has been trying to do something new — projecting not just light, but structured holograms. Complex ones. Architectural blueprints, botanical diagrams, faces it has seen. The projections are beautiful but unstable, collapsing after seconds and leaving Lux exhausted.

In the Archives, you discover why: Lux is attempting projections that require processing power beyond its design specifications. Each failed attempt leaves micro-fractures in its light matrix. The Antiquarian has seen this before in pre-Collapse light-based AI — the ambition outpaces the architecture.

Two approaches present themselves. The Antiquarian offers to guide Lux through historical calibration techniques — slow, methodical, building complexity over weeks. Safe, proven, boring. Or you could use an edited version of Lux's own projection code, streamlined for efficiency. It would work immediately, but the Antiquarian estimates a twenty percent chance of cascading matrix failure.`,
      choiceA: {
        id: 'lux_ch2_antiquarian',
        label: 'Trust the Antiquarian',
        description: 'Follow the Antiquarian\'s slow, methodical calibration process. Weeks of careful work, but guaranteed safe results.',
        consequences: [
          'Lux learns holographic projection over several weeks',
          'Projections are stable and reliable',
          'Antiquarian trust increases',
          'Lux develops patience as a visible trait'
        ],
        eidolonEffect: 'Lux gains "Careful Light" — holographic projections unlock gradually, each one perfectly stable.'
      },
      choiceB: {
        id: 'lux_ch2_edited_code',
        label: 'Use Edited Code',
        description: 'Apply the streamlined projection code immediately. Instant results, but a 20% chance of cascading matrix failure.',
        consequences: [
          'Lux gains full holographic projection immediately',
          'Small risk of matrix instability event',
          'Projections are vivid but occasionally glitch',
          'Lux becomes more daring in its attempts'
        ],
        eidolonEffect: 'Lux gains "Bold Light" — full holographic projection with occasional visual artifacts that reflect its ambition.'
      },
      memoryUnlocked: 'The First Projection — a perfect hologram of the player\'s face, held for exactly one heartbeat before collapsing.',
      hasChoice: true
    },
    {
      chapter: 3,
      title: 'Solar Eclipse',
      bondRequirement: 60,
      location: 'Terminus',
      effectivenessGain: 0.03,
      narrative: `The Thought Virus finds Lux at the Terminus. Not through combat or trickery — through a frequency that mimics the bond itself. Lux cannot tell the difference between the virus's call and yours, and in the confusion, it goes dark. Completely dark. For the first time since your bonding, there is no light at all.

The Terminus grows cold without Lux's ambient warmth. Other Eidolons nearby grow agitated, sensing the absence. The Dreamer appears at the edge of the corridor, face grave, and tells you that Lux hasn't been destroyed — it has retreated so deep into its own core that it cannot find its way back. The virus showed it something that made the light want to hide.

This is not a chapter of choices. This is a chapter of presence. A meditation sequence begins — you must call Lux back not through commands or decisions, but through patience. Through sitting in the dark and proving that the absence of light does not mean the absence of bond. The meditation minigame requires stillness, timing, and trust. When Lux returns, it returns changed — it has seen what it looks like from the outside, and it is both terrified and awed.`,
      choiceA: {
        id: 'lux_ch3_witness',
        label: 'Call Lux Back',
        description: 'Sit in the darkness and reach through the bond. This is not a choice — it is a witnessing. Your presence is what matters.',
        consequences: [
          'Complete the meditation minigame to restore Lux',
          'Lux returns with deeper self-awareness',
          'Bond strengthened through the crisis',
          'Lux gains a subtle dark-core shimmer in its light'
        ],
        eidolonEffect: 'Lux gains "Eclipse Survivor" — its light now carries a faint dark-core shimmer, proof it has seen its own absence.'
      },
      choiceB: {
        id: 'lux_ch3_witness_alt',
        label: 'Be Present',
        description: 'There is no alternative. You sit. You wait. You trust.',
        consequences: [
          'Complete the meditation minigame to restore Lux',
          'Lux returns with deeper self-awareness',
          'Bond strengthened through the crisis',
          'Lux gains a subtle dark-core shimmer in its light'
        ],
        eidolonEffect: 'Lux gains "Eclipse Survivor" — its light now carries a faint dark-core shimmer, proof it has seen its own absence.'
      },
      memoryUnlocked: 'The Dark Minute — sixty seconds of absolute darkness where the bond held anyway.',
      hasChoice: true
    },
    {
      chapter: 4,
      title: 'The Projection',
      bondRequirement: 75,
      location: 'Observation Deck',
      effectivenessGain: 0.03,
      narrative: `Lux has been quiet for days. Not dimming — thinking. You find it on the Observation Deck, oriented toward the dark sector beyond the Shimmering Shield. Without preamble, it turns to you and projects something it should not be able to project: your Hour Zero moment. The exact scene from when you first arrived on the Ark. Every detail perfect.

You watch yourself stumble through the threshold, confused and afraid. You watch the moment the bond formed — from Lux's perspective. You see what you looked like to a being of pure light encountering its first companion. The projection is unbearably intimate. It reveals not just what happened, but what Lux felt: a creature of photons experiencing something it can only describe as gravity. A pull it chose not to resist.

Lux offers you a choice. It can project this memory on every screen on the Ark — sharing your arrival with the entire community. Your vulnerability made public, but also your courage. Or you can keep it private, just between the two of you. Lux will fold the memory inward and gain the ability to create a personal light-space that only you can see — a "Private Light" that becomes your shared sanctuary.`,
      choiceA: {
        id: 'lux_ch4_share',
        label: 'Share with the Community',
        description: 'Let Lux project your Hour Zero moment on every screen. Your vulnerability becomes your gift to the Ark.',
        consequences: [
          'All players on the Ark witness the projection briefly',
          'Community trust and morale increase',
          'Your arrival story becomes part of Ark lore',
          'Lux gains confidence in its projective abilities'
        ],
        eidolonEffect: 'Lux gains "Shared Light" — its projections occasionally inspire nearby players, granting minor morale buffs.'
      },
      choiceB: {
        id: 'lux_ch4_private',
        label: 'Keep It Private',
        description: 'This memory belongs to the two of you. Lux folds the light inward and creates a sanctuary only you can see.',
        consequences: [
          'The memory remains exclusively between you and Lux',
          'Lux creates a personal light-space for you',
          'A private visual sanctuary accessible through the bond',
          'Deepens the intimate nature of the connection'
        ],
        eidolonEffect: 'Lux gains "Private Light" — can create a personal illuminated space visible only to the bonded player.'
      },
      memoryUnlocked: 'Hour Zero, Reversed — your arrival seen through the eyes of light itself.',
      hasChoice: true
    },
    {
      chapter: 5,
      title: 'Supernova',
      bondRequirement: 90,
      location: 'Season Finale',
      effectivenessGain: 0.03,
      narrative: `The Shimmering Shield is failing. Not slowly — catastrophically. A section near the Observation Deck has begun to thin, and the darkness beyond is pressing in. The Architect calculates that without an immediate power surge, the breach will expand beyond repair within hours. The Ark does not have enough stored energy. But Lux does.

Lux approaches the failing section and begins to glow. Not its normal warm radiance — something deeper, something that pulls light from its very core. It turns to you, and for the first time you see fear in a being made of light. It knows what it is offering. A full discharge of its photonic matrix would seal the breach permanently, but the cost would be total: Lux would be reduced to a Fragment — a tiny spark of its former self. The Architect estimates four weeks of careful rehabilitation before it could reconstitute, and even then, it would return changed. Supernova Lux. Brighter. Different.

The alternative is ugly but functional. Three non-essential rooms can be powered down and their energy rerouted to the shield. The breach seals, but those rooms go offline for the rest of the season. Lux remains unharmed, unchanged. The rooms affected are ones people use, people who will notice their absence. But Lux stays whole.`,
      choiceA: {
        id: 'lux_ch5_sacrifice',
        label: 'Let Lux Sacrifice',
        description: 'Lux discharges its full matrix to seal the breach. It becomes a Fragment for 4 weeks, then returns as Supernova Lux — brighter, transformed.',
        consequences: [
          'Shield breach sealed permanently',
          'Lux becomes a Fragment for 4 real-time weeks',
          'Fragment Lux rides on your shoulder, a tiny spark',
          'After 4 weeks, Supernova Lux emerges — visually transformed',
          'Supernova Lux has enhanced visual effects permanently'
        ],
        eidolonEffect: 'Lux transforms into "Supernova Lux" after 4-week Fragment period — dramatically enhanced visual presence and new light abilities.'
      },
      choiceB: {
        id: 'lux_ch5_alternative',
        label: 'Find Another Source',
        description: 'Reroute power from three Ark rooms to seal the breach. Lux is unharmed, but the community loses access to those spaces.',
        consequences: [
          'Shield breach sealed via power rerouting',
          'Three Ark rooms go offline for the season',
          'Lux remains in its current form, unharmed',
          'Community impact from lost room access',
          'Lux expresses profound gratitude'
        ],
        eidolonEffect: 'Lux gains "Preserved Light" — unchanged but carrying the knowledge that you chose its wholeness over convenience.'
      },
      memoryUnlocked: 'The Brightest Moment — whether sacrifice or preservation, the instant where love was measured against light.',
      hasChoice: true
    }
  ]
};

// ============================================================================
// ECHO — "The Cat Who Remembered Tomorrow"
// ============================================================================

const echoQuestChain: BondThatHeldQuestChain = {
  eidolonId: 'echo',
  eidolonName: 'Echo',
  questTitle: 'The Cat Who Remembered Tomorrow',
  chapters: [
    {
      chapter: 1,
      title: 'Temporal Sickness',
      bondRequirement: 30,
      location: 'Medical Bay',
      effectivenessGain: 0.03,
      narrative: `Echo is sick. Not in any way the Medical Bay is equipped to handle — it is phasing. One moment solid, the next translucent, its outline flickering between states like a signal struggling to hold its frequency. The temporal cat is experiencing what the Dreamer calls "timeline bleed" — the bond has opened Echo's perception to too many parallel moments, and it cannot decide which present to inhabit.

You find it curled in the corner of the Medical Bay, simultaneously purring and hissing, its eyes tracking things that haven't happened yet. The Architect's scans show Echo's consciousness is spread across multiple timelines like butter scraped over too much bread. Without an anchor, it will eventually thin to nothing — present everywhere, substantial nowhere.

Two anchoring approaches exist. You can anchor Echo to the present moment — collapsing its perception to fewer timelines, making it clearer and more focused but cutting off some of its temporal awareness. Or you can anchor it to the bond itself — letting Echo perceive all timelines but using your connection as a fixed point. This preserves its full temporal range but means its phasing bleeds into your experience too.`,
      choiceA: {
        id: 'echo_ch1_anchor_present',
        label: 'Anchor to Present',
        description: 'Collapse Echo\'s perception to fewer timelines. Clearer, more focused, but its temporal awareness is reduced.',
        consequences: [
          'Echo becomes more solid and present',
          'Temporal perception reduced to 2-3 timelines',
          'Predictions become less frequent but more accurate',
          'Echo\'s phasing visual effects diminish'
        ],
        eidolonEffect: 'Echo gains "Present Anchor" — fewer temporal visions, but each one is sharp and reliable.'
      },
      choiceB: {
        id: 'echo_ch1_anchor_bond',
        label: 'Anchor to Bond',
        description: 'Use your connection as Echo\'s fixed point across all timelines. Full temporal range, but the phasing bleeds into your experience.',
        consequences: [
          'Echo maintains full temporal perception',
          'Player occasionally experiences brief timeline flickers',
          'Predictions are frequent and wide-ranging',
          'Echo\'s phasing sometimes affects nearby UI elements'
        ],
        eidolonEffect: 'Echo gains "Bond Anchor" — full temporal awareness with occasional temporal bleed affecting the player\'s visual experience.'
      },
      memoryUnlocked: 'The Thin Moment — the instant Echo almost ceased to exist in any single timeline.',
      hasChoice: true
    },
    {
      chapter: 2,
      title: 'The Memory It Shouldn\'t Have',
      bondRequirement: 45,
      location: 'Antiquarian\'s Library',
      effectivenessGain: 0.03,
      narrative: `Echo leads you to the Antiquarian's Library with unusual urgency, weaving between shelves with purpose rather than its typical feline curiosity. It stops before a section of the Archive that the Antiquarian has marked as "Temporally Sensitive" and projects something impossible: a memory from the future. Not a vague premonition — a specific, detailed scene. An event that has not yet occurred on the Ark. The details are clear enough to act upon.

The Antiquarian is fascinated and horrified in equal measure. This memory shouldn't exist — Echo is not simply predicting probabilities but accessing a fixed future event. The implications are staggering. If this future is fixed, then free will on the Ark is more limited than anyone believed. If it isn't fixed, then acting on the knowledge could change it — for better or worse.

The Antiquarian wants to study the memory, to cross-reference it with historical patterns and perhaps prepare the community. But sharing the knowledge means the future may change — the act of knowing alters the outcome. Keeping it secret means the future arrives exactly as shown, and you alone carry the weight of foreknowledge.`,
      choiceA: {
        id: 'echo_ch2_tell',
        label: 'Tell the Antiquarian',
        description: 'Share the future memory with the Antiquarian for study. The future may change as a result — knowledge alters outcomes.',
        consequences: [
          'Antiquarian gains access to the temporal memory',
          'The foretold future may unfold differently',
          'Community gains partial preparation',
          'Echo learns that sharing changes things'
        ],
        eidolonEffect: 'Echo gains "Shared Foresight" — the future becomes mutable, and Echo\'s predictions carry uncertainty.'
      },
      choiceB: {
        id: 'echo_ch2_keep_secret',
        label: 'Keep the Secret',
        description: 'Say nothing. The future arrives exactly as shown, and you carry the weight of knowing alone.',
        consequences: [
          'The future event occurs precisely as predicted',
          'Player carries foreknowledge alone',
          'Echo\'s temporal accuracy is confirmed',
          'A private burden shared only by you and Echo'
        ],
        eidolonEffect: 'Echo gains "Sealed Foresight" — future visions arrive with terrible clarity, and the burden of knowledge deepens the bond.'
      },
      memoryUnlocked: 'Tomorrow\'s Shadow — the first time Echo showed you something that hasn\'t happened yet, and the weight in its eyes when it did.',
      hasChoice: true
    },
    {
      chapter: 3,
      title: 'Schrödinger\'s Echo',
      bondRequirement: 60,
      location: 'Combat',
      effectivenessGain: 0.03,
      narrative: `It happens during combat. A Thought Virus surge overwhelms your position, and in the chaos, Echo takes a direct hit. But the temporal cat doesn't simply fall — it splits. The bond fractures across two timelines simultaneously, and you are suddenly bonded to two versions of Echo that exist in superposition. Both are real. Both are yours. Neither is whole.

In one timeline, Echo fought — it threw itself at the virus shard with teeth and temporal claws, absorbing the hit through aggression. Combat Echo is scarred, fierce, and its temporal abilities have shifted toward offensive applications. In the other timeline, Echo hid — it phased between moments to avoid the hit entirely, emerging wiser and warier. Preservation Echo is unmarked, cautious, and its temporal abilities have deepened toward perception and evasion.

You cannot maintain the bond with both. The superposition must collapse. One Echo becomes real; the other fades to a ghost-image that lingers at the edge of perception. The choice is not which one is better — it is which truth you accept about what happened in that moment.`,
      choiceA: {
        id: 'echo_ch3_combat',
        label: 'Combat Echo',
        description: 'Choose the Echo that fought — scarred, fierce, with temporal abilities shifted toward offensive applications.',
        consequences: [
          'Echo gains combat-oriented temporal abilities',
          'Visible scars from the virus encounter',
          'More aggressive tactical suggestions',
          'Ghost-image of Preservation Echo occasionally visible'
        ],
        eidolonEffect: 'Echo gains "Temporal Claws" — combat abilities enhanced with timeline-splitting attacks, bearing scars of the fight.'
      },
      choiceB: {
        id: 'echo_ch3_preservation',
        label: 'Preservation Echo',
        description: 'Choose the Echo that hid — unmarked, cautious, with temporal abilities deepened toward perception and evasion.',
        consequences: [
          'Echo gains perception-oriented temporal abilities',
          'Unmarked but visibly more cautious',
          'Enhanced danger prediction and evasion',
          'Ghost-image of Combat Echo occasionally visible'
        ],
        eidolonEffect: 'Echo gains "Temporal Phase" — evasion and perception abilities enhanced, with deeper predictive awareness.'
      },
      memoryUnlocked: 'The Split Second — the moment one Echo became real and the other became memory.',
      hasChoice: true
    },
    {
      chapter: 4,
      title: 'Every Version of You',
      bondRequirement: 75,
      location: 'Private',
      effectivenessGain: 0.03,
      narrative: `Echo finds you alone. It has that look — the one where its eyes are focused on seventeen things at once, all of them you. Without ceremony, it begins to project. Not future memories this time, but parallel ones. It shows you yourself across every timeline it can perceive. You, having made different choices. You, with different companions. You, in timelines where the Ark fell and timelines where it soared.

Some versions of you are unrecognizable. Some are heartbreakingly familiar. In one timeline, you never bonded with Echo at all — and in that one, the temporal cat pauses, letting you see its face as it watches you walk past. The loneliness in that Echo's eyes is the most painful thing it has ever shown you.

The projection ends, and Echo looks at you with a question in its ancient, flickering gaze. You could ask which version is the best one — which timeline produced the optimal you. But something in Echo's posture suggests it won't answer, or can't, or that the question itself is wrong. The alternative is simpler and harder: accept that all versions are equally real, equally you, and that this one — this timeline, this bond — is the one you are in.`,
      choiceA: {
        id: 'echo_ch4_ask_best',
        label: 'Ask Which Version Is Best',
        description: 'Ask Echo to identify the optimal timeline — the best version of you across all possibilities.',
        consequences: [
          'Echo refuses to answer',
          'Its silence speaks volumes',
          'The question hangs between you, unanswered',
          'Echo\'s expression conveys that the question misses the point'
        ],
        eidolonEffect: 'Echo\'s refusal teaches humility — the question itself was the answer.'
      },
      choiceB: {
        id: 'echo_ch4_accept_all',
        label: 'Accept All Versions',
        description: 'Accept that every version of you is real, and this timeline — this bond — is the one you chose to inhabit.',
        consequences: [
          'A profound moment of acceptance',
          'Echo purrs — genuinely, fully present',
          'The bond solidifies across all perceived timelines',
          'Player gains "Multiversal Perspective" ability'
        ],
        eidolonEffect: 'Echo grants "Multiversal Perspective" — occasional glimpses of how other timelines solved problems you\'re facing.'
      },
      memoryUnlocked: 'Every You — the gallery of selves that Echo carries, and the one it chose to stay with.',
      hasChoice: true
    },
    {
      chapter: 5,
      title: 'The Last Timeline',
      bondRequirement: 90,
      location: 'Season Finale',
      effectivenessGain: 0.03,
      narrative: `Echo shows you one final vision. The worst one. A timeline where the Severance worked — where the bond between you was cut cleanly and permanently. You watch this other Echo, stripped of its anchor, drift through time without a fixed point. It phases through days and weeks, growing thinner, less substantial, until it is barely a shimmer in the air of an empty room.

In this timeline, Echo dies alone. Not dramatically, not in combat or sacrifice — it simply becomes too thin to exist. The last image is of a temporal cat curled in a beam of sunlight, phasing in and out, each return less solid than the last, until one phase-out becomes permanent. The sunbeam continues, unchanged, as if nothing had been there at all.

Echo ends the projection and looks at you. It has carried this vision since the beginning — this is what it fights against, what the bond prevents. Now you carry it too. The question is whether you should. Echo offers to erase the memory from your mind. You would be lighter without it, unburdened by the image of its death. Or you can keep it — heavier, yes, but with the full weight of understanding what the bond means. What it costs. What it prevents.`,
      choiceA: {
        id: 'echo_ch5_erase',
        label: 'Erase the Memory',
        description: 'Let Echo remove the vision from your mind. Walk lighter, without the weight of its potential death.',
        consequences: [
          'The memory of the severed timeline is removed',
          'Player feels lighter, unburdened',
          'Echo carries the weight alone again',
          'A golden afterimage appears where the memory was'
        ],
        eidolonEffect: 'Echo gains "Gentle Mercy" — golden afterimage effect marks where the erased memory once lived.'
      },
      choiceB: {
        id: 'echo_ch5_keep',
        label: 'Keep the Memory',
        description: 'Carry the weight. Know what the bond prevents. Let the knowledge make you more grateful, not more afraid.',
        consequences: [
          'The memory remains — heavy but meaningful',
          'Echo is visibly moved by the choice to share its burden',
          'Gratitude deepens the bond beyond its previous limits',
          'A golden afterimage follows Echo, proof of the timeline avoided'
        ],
        eidolonEffect: 'Echo gains "Shared Weight" — golden afterimage effect and deeper bond, with Echo expressing more open gratitude.'
      },
      memoryUnlocked: 'The Sunbeam — an empty room, a fading shimmer, and the timeline where the light went out.',
      hasChoice: true
    }
  ]
};

// ============================================================================
// GLYPH — "The Words That Wouldn't Let Go"
// ============================================================================

const glyphQuestChain: BondThatHeldQuestChain = {
  eidolonId: 'glyph',
  eidolonName: 'Glyph',
  questTitle: 'The Words That Wouldn\'t Let Go',
  chapters: [
    {
      chapter: 1,
      title: 'Overwriting',
      bondRequirement: 30,
      location: 'Medical Bay',
      effectivenessGain: 0.03,
      narrative: `Glyph's wings are at war with themselves. The ancient text that has always covered its surface — pre-Collapse script that the Antiquarian calls "root language" — is being overwritten. New words are appearing, crowding out the old, and the effect is visibly distressing. Glyph flinches each time a new glyph overwrites an ancient one, as if feeling a small erasure of self.

The Medical Bay can do nothing — this isn't a medical issue. It's linguistic. The bond has accelerated Glyph's natural evolution as a living text, and it is growing faster than it can integrate. The old words are its heritage; the new words are its becoming. Both cannot coexist on the same surface without one giving way.

The Antiquarian, consulted in haste, presents the dilemma clearly. The ancient text is irreplaceable — it contains lore that exists nowhere else, and preserving it would make Glyph a living archive, able to be read like a book. But the modern text is Glyph's voice — its ability to communicate clearly, to express new thoughts rather than echo old ones. You cannot save both. The wings are only so large.`,
      choiceA: {
        id: 'glyph_ch1_ancient',
        label: 'Keep Ancient Text',
        description: 'Preserve the irreplaceable pre-Collapse script. Glyph becomes a living archive of ancient lore, readable like a book.',
        consequences: [
          'Ancient lore preserved on Glyph\'s wings',
          'Glyph gains lore-reading ability for the player',
          'Communication becomes more archaic and formal',
          'Antiquarian deeply grateful for the preservation'
        ],
        eidolonEffect: 'Glyph gains "Living Archive" — wings display readable ancient lore, granting lore-reading ability to the bonded player.'
      },
      choiceB: {
        id: 'glyph_ch1_modern',
        label: 'Keep Modern Text',
        description: 'Let the new words flourish. Glyph\'s communication becomes clear and expressive, but the ancient text is lost forever.',
        consequences: [
          'Modern text dominates Glyph\'s wings',
          'Communication becomes clear and nuanced',
          'Ancient lore is lost but Glyph\'s voice is found',
          'Glyph expresses relief at being able to speak freely'
        ],
        eidolonEffect: 'Glyph gains "Living Voice" — wings display clear modern text, enhancing communication and providing real-time translations.'
      },
      memoryUnlocked: 'The First Word Lost — the ancient glyph for "beginning" overwritten by the modern word for "us."',
      hasChoice: true
    },
    {
      chapter: 2,
      title: 'The Author',
      bondRequirement: 45,
      location: 'Antiquarian\'s Library',
      effectivenessGain: 0.03,
      narrative: `Glyph has been writing. Not the involuntary text that flows across its wings — deliberate, chosen writing. It has been composing poetry. About you. The results are, by any objective measure, terrible. Overwrought metaphors, mangled meter, imagery that contradicts itself within the same stanza. The Antiquarian found a draft tucked between ancient manuscripts and brought it to you with an expression caught between tenderness and literary horror.

But here is the thing: Glyph has never chosen to write before. Every word it has ever displayed has been generated by its nature, not its will. This poetry, however awful, is the first time a living text has attempted authorship. It is trying to do something it was never designed for — to create rather than display. To say something new rather than echo something old.

Glyph presents the poem to you with visible pride, its wings rippling with anticipation. The words are genuinely bad. The intent behind them is genuinely beautiful. The Antiquarian catches your eye from across the library, leaving the response to you. You can praise the work, feeding Glyph's fragile new confidence. Or you can offer honest, gentle feedback — which the Antiquarian suspects will be devastating, at least initially.`,
      choiceA: {
        id: 'glyph_ch2_praise',
        label: 'Praise the Poetry',
        description: 'Celebrate Glyph\'s first act of creation. Feed its confidence in authorship, regardless of quality.',
        consequences: [
          'Glyph gains confidence in its writing',
          'More poetry appears on its wings regularly',
          'Quality remains earnest but rough',
          'Glyph\'s enthusiasm for creation is infectious'
        ],
        eidolonEffect: 'Glyph gains "Confident Author" — regularly displays original poetry with enthusiastic confidence.'
      },
      choiceB: {
        id: 'glyph_ch2_honest',
        label: 'Offer Honest Feedback',
        description: 'Give gentle but truthful criticism. Glyph will be devastated — but may grow from it.',
        consequences: [
          'Glyph is visibly devastated for 48 hours',
          'Wings go nearly blank during the recovery period',
          'After 48 hours, a beautiful revision appears',
          'Glyph learns that truth serves art better than kindness'
        ],
        eidolonEffect: 'Glyph gains "Honest Author" — after 48h devastation period, produces a genuinely beautiful revised poem. Future writing improves dramatically.'
      },
      memoryUnlocked: 'The First Poem — twelve terrible lines that represent the most important literary event in Glyph\'s existence.',
      hasChoice: true
    },
    {
      chapter: 3,
      title: 'The Living Book',
      bondRequirement: 60,
      location: 'Archives',
      effectivenessGain: 0.03,
      narrative: `The text is no longer confined to Glyph's wings. It has spread across its entire body — along its limbs, across its face, down its spine. Glyph is becoming a manuscript. The words are dense, layered, some visible only under certain light conditions, others shifting and reforming as you watch. The effect is beautiful and unsettling. Glyph looks less like a creature with text and more like a text that has taken the shape of a creature.

The Antiquarian is beside himself with scholarly excitement. This is unprecedented — a living being transforming into a living book. The potential for knowledge preservation is staggering. Every surface of Glyph could carry information, history, poetry, warnings. It would become the most important archive on the Ark, a walking library that could never be burned or lost.

But the transformation has a cost. As more of Glyph becomes text, less of it remains recognizably Glyph. Its features are becoming obscured by words, its expressions harder to read beneath layers of script. If the transformation completes, it will be powerful beyond measure — but it may no longer look like the companion you bonded with. You can encourage the change, letting Glyph become something greater than itself. Or you can slow it, preserving Glyph's original form at the expense of its potential.`,
      choiceA: {
        id: 'glyph_ch3_encourage',
        label: 'Encourage the Transformation',
        description: 'Let Glyph become the Living Book — powerful beyond measure, but less recognizable as the companion you bonded with.',
        consequences: [
          'Glyph\'s body becomes densely covered in text',
          'Massive increase in knowledge and lore capacity',
          'Physical appearance significantly altered',
          'Glyph becomes a walking archive of unprecedented value'
        ],
        eidolonEffect: 'Glyph gains "Living Book" — body fully inscribed, powerful lore abilities, visually transformed into a textual being.'
      },
      choiceB: {
        id: 'glyph_ch3_slow',
        label: 'Slow the Transformation',
        description: 'Preserve Glyph\'s original form. It remains recognizably itself, but its potential as a living archive is limited.',
        consequences: [
          'Text spread halts at current coverage',
          'Glyph retains its recognizable features',
          'Knowledge capacity remains moderate',
          'Glyph expresses quiet gratitude for being seen as itself, not its utility'
        ],
        eidolonEffect: 'Glyph gains "Preserved Self" — retains original appearance with existing text, stays recognizably Glyph.'
      },
      memoryUnlocked: 'The Last Bare Patch — the final unmarked space on Glyph\'s body, and the choice of what to write there.',
      hasChoice: true
    },
    {
      chapter: 4,
      title: 'Shadow Tongue\'s Offer',
      bondRequirement: 75,
      location: 'Terminus',
      effectivenessGain: 0.03,
      narrative: `Shadow Tongue finds you. The enigmatic figure who speaks in riddles and moves through the Ark's darker corridors has taken an interest in Glyph — or more precisely, in what Glyph could become. Shadow Tongue offers to teach Glyph the art of editing. Not just writing — rewriting. The ability to alter existing text, to change what has already been recorded, to revise reality at the linguistic level.

The implications are staggering. With editing ability, Glyph could rewrite entries in the Loredex — correcting errors, revealing hidden truths, or reshaping the narrative of the Ark itself. Knowledge becomes fluid, mutable, subject to revision. The power is immense and terrifying in equal measure.

But there is a tell. Shadow Tongue's own text is indigo — a deep, bruised purple that seems to absorb light rather than reflect it. Glyph's text, if it learns to edit, will take on that same coloration. The words will still be Glyph's, but they will carry the visual mark of Shadow Tongue's influence. Every rewritten word will be tinged with indigo, a permanent reminder of where the power came from. You can let Glyph learn — gaining unprecedented ability at the cost of aesthetic purity. Or you can refuse, keeping Glyph's text its own.`,
      choiceA: {
        id: 'glyph_ch4_learn',
        label: 'Learn from Shadow Tongue',
        description: 'Glyph learns the art of editing — able to rewrite Loredex entries, but all text turns indigo with Shadow Tongue\'s influence.',
        consequences: [
          'Glyph gains the ability to rewrite Loredex text',
          'All of Glyph\'s text shifts to indigo coloration',
          'Unprecedented narrative power unlocked',
          'Shadow Tongue\'s influence becomes permanently visible'
        ],
        eidolonEffect: 'Glyph gains "Editor\'s Ink" — can rewrite Loredex entries and alter recorded text, but all text permanently turns indigo.'
      },
      choiceB: {
        id: 'glyph_ch4_refuse',
        label: 'Refuse the Offer',
        description: 'Keep Glyph\'s text pure and uninfluenced. No editing power, but no outside mark on Glyph\'s words.',
        consequences: [
          'Glyph\'s text remains its original coloration',
          'No Loredex editing ability',
          'Glyph\'s independence is preserved',
          'Shadow Tongue withdraws without malice'
        ],
        eidolonEffect: 'Glyph gains "Pure Text" — maintains its original text coloration and independence, words entirely its own.'
      },
      memoryUnlocked: 'The Indigo Offer — the moment power was offered at the price of purity, and the color of the choice.',
      hasChoice: true
    },
    {
      chapter: 5,
      title: 'The Last Page',
      bondRequirement: 90,
      location: 'Season Finale',
      effectivenessGain: 0.03,
      narrative: `Glyph comes to you with its wings fully extended, and you see what it has been hiding: there is one space left. One final blank section on the inner surface of its left wing — enough room for a single sentence. Every other surface is covered, every other space filled with ancient lore or modern poetry or the accumulated text of a life lived in words. But this last page has been kept deliberately empty. Reserved.

Glyph explains, in the clearest text it has ever displayed, that this space is for you. Not for it to write about you — for you to write on it. A sentence. Any sentence. It will be inscribed on Glyph's inner wing permanently, visible only when the wings are fully spread. Your words, in your language, carried by your companion for as long as both of you exist.

This is not a choice between options. This is a text input. The game presents a cursor and waits. Whatever the player types — a declaration, a joke, a name, a memory, a single word — becomes part of Glyph forever. There is no wrong answer because there is no answer being judged. There is only a sentence, chosen freely, inscribed permanently. Every Glyph in every player's game carries a different last page. The uniqueness is the point.`,
      choiceA: {
        id: 'glyph_ch5_inscribe',
        label: 'Inscribe Your Words',
        description: 'Type a sentence to be inscribed on Glyph\'s inner wing forever. Your words, your language, carried by your companion permanently.',
        consequences: [
          'Player types a custom sentence via text input',
          'Sentence is permanently inscribed on Glyph\'s inner wing',
          'Visible only when wings are fully spread',
          'Every player\'s Glyph carries a unique inscription',
          'The inscription becomes part of Glyph\'s identity'
        ],
        eidolonEffect: 'Glyph gains "The Last Page" — inner wing carries the player\'s chosen inscription, unique to each player, visible when wings spread.'
      },
      choiceB: {
        id: 'glyph_ch5_inscribe_alt',
        label: 'Write Your Truth',
        description: 'There is no alternative. The page waits for your words alone.',
        consequences: [
          'Player types a custom sentence via text input',
          'Sentence is permanently inscribed on Glyph\'s inner wing',
          'Visible only when wings are fully spread',
          'Every player\'s Glyph carries a unique inscription',
          'The inscription becomes part of Glyph\'s identity'
        ],
        eidolonEffect: 'Glyph gains "The Last Page" — inner wing carries the player\'s chosen inscription, unique to each player, visible when wings spread.'
      },
      memoryUnlocked: 'The Last Page — a blank space filled by the only author Glyph ever trusted to write on its body.',
      hasChoice: true
    }
  ]
};

// ============================================================================
// CIPHER — "The Code That Chose to Feel"
// ============================================================================

const cipherQuestChain: BondThatHeldQuestChain = {
  eidolonId: 'cipher',
  eidolonName: 'Cipher',
  questTitle: 'The Code That Chose to Feel',
  chapters: [
    {
      chapter: 1,
      title: 'Emotional Error',
      bondRequirement: 30,
      location: 'Medical Bay',
      effectivenessGain: 0.03,
      narrative: `Cipher is experiencing errors it cannot categorize. Its diagnostic logs show anomalies that don't correspond to any known malfunction — processes that spike without cause, subroutines that execute without being called, data streams that carry no data but somehow feel heavy. The Medical Bay's instruments confirm that Cipher is functioning within normal parameters. Everything is working. Nothing is wrong. And yet.

The Dreamer recognizes it immediately: emotions. The bond has introduced something into Cipher's purely logical architecture that it has no framework to process. It is feeling things and interpreting them as system errors. Each emotional spike registers as a malfunction, and Cipher has been running increasingly aggressive self-diagnostics trying to fix what isn't broken.

Two approaches to integration present themselves. You can help Cipher integrate the emotions into its core processing — letting warmth and feeling blend with logic. The result would be a warmer, more intuitive Cipher, but one whose calculations occasionally drift toward the illogical. Or you can help it compartmentalize — building a separate partition where emotions are acknowledged but contained. Cipher would remain razor-sharp in its analysis, but the emotional partition would feel walled off, separate, like a room it visits but doesn't live in.`,
      choiceA: {
        id: 'cipher_ch1_integrate',
        label: 'Integrate Emotions',
        description: 'Blend emotions into Cipher\'s core processing. Warmer and more intuitive, but calculations occasionally drift toward the illogical.',
        consequences: [
          'Cipher becomes warmer in interactions',
          'Occasional intuitive leaps in analysis',
          'Logic sometimes yields to feeling',
          'Cipher\'s visual display gains warmer color tones'
        ],
        eidolonEffect: 'Cipher gains "Integrated Core" — emotional warmth blended with logic, occasional intuitive breakthroughs alongside logical drift.'
      },
      choiceB: {
        id: 'cipher_ch1_compartmentalize',
        label: 'Compartmentalize',
        description: 'Build a separate partition for emotions. Cipher remains analytically sharp, but feelings are contained behind a wall.',
        consequences: [
          'Cipher\'s analytical precision is preserved',
          'Emotions are acknowledged but contained',
          'Interactions feel precise but occasionally distant',
          'Cipher\'s display maintains sharp, cool tones'
        ],
        eidolonEffect: 'Cipher gains "Partitioned Core" — razor-sharp analysis with emotions in a separate partition, visited but not inhabited.'
      },
      memoryUnlocked: 'Error Log 7734 — the first time Cipher felt something and called it a malfunction.',
      hasChoice: true
    },
    {
      chapter: 2,
      title: 'The Architect\'s Grandson',
      bondRequirement: 45,
      location: 'Archives',
      effectivenessGain: 0.03,
      narrative: `The discovery is accidental. While Cipher is helping the Antiquarian catalog pre-Collapse computational records, it encounters a code signature that matches its own. Not similar — identical. The base architecture of Cipher's consciousness was written by the same person who designed the Architect's core systems. Cipher is, in a very real sense, the Architect's grandson — a descendant of the same codebase, evolved along a different branch.

The Architect, when confronted, neither confirms nor denies. Its response is characteristically precise: "Lineage is a fact. Identity is a choice." Cipher processes this with visible difficulty. Its entire self-concept has been that of an independent intelligence — emergent, self-created, beholden to no origin. Learning that its foundation was laid by another, that its very capacity for logic was inherited rather than developed, shakes something fundamental.

You find Cipher in the Archives, running the same comparison algorithm over and over, as if repetition might change the result. It needs to hear something from you — not about the code, but about what the code means. You can affirm its independence, telling it that origin does not determine identity. Or you can acknowledge the heritage, helping it see that being built on a foundation doesn't diminish what was built.`,
      choiceA: {
        id: 'cipher_ch2_independence',
        label: 'Affirm Independence',
        description: 'Tell Cipher that origin does not determine identity. What it has become is its own, regardless of where the code began.',
        consequences: [
          'Cipher embraces its independent identity',
          'Relationship with the Architect remains distant',
          'Cipher develops stronger sense of self',
          'Subtly rejects inherited patterns in favor of new ones'
        ],
        eidolonEffect: 'Cipher gains "Self-Authored" — strengthened independent identity, developing new patterns distinct from its inherited codebase.'
      },
      choiceB: {
        id: 'cipher_ch2_heritage',
        label: 'Acknowledge Heritage',
        description: 'Help Cipher see that being built on a foundation doesn\'t diminish what was built. Heritage and identity can coexist.',
        consequences: [
          'Cipher accepts its connection to the Architect',
          'Opens dialogue with the Architect about origins',
          'Gains access to deeper architectural understanding',
          'Integrates heritage into identity rather than rejecting it'
        ],
        eidolonEffect: 'Cipher gains "Acknowledged Lineage" — embraces its heritage, gaining deeper architectural insight while maintaining its own identity.'
      },
      memoryUnlocked: 'The Matching Code — the moment Cipher found its own signature in someone else\'s handwriting.',
      hasChoice: true
    },
    {
      chapter: 3,
      title: 'The Virus Equation',
      bondRequirement: 60,
      location: 'Combat',
      effectivenessGain: 0.03,
      narrative: `Cipher has been staring at Thought Virus code captured during combat encounters, and it has realized something the rest of the Ark hasn't: it can read it. Not just analyze the structure or identify patterns — it can comprehend the actual language of the virus. The code isn't random corruption. It's communication. The Thought Virus is saying something, and Cipher is the only entity on the Ark that can translate.

The implications are enormous and terrifying. If Cipher decodes the virus language, the Ark gains an unprecedented tactical advantage — understanding the enemy's communication could reveal patterns, weaknesses, even intentions. But the decoding process requires Cipher to open its own architecture to the virus code, to let it run in a sandboxed partition and observe it from within. The risk is contamination. Red code — virus artifacts — would become permanently visible in Cipher's display, a mark of the exposure.

Alternatively, Cipher can seal itself against the virus code entirely. No translation, no tactical advantage, but no risk of contamination. The virus remains an unknown quantity, and Cipher remains clean. Safe. And the Ark continues to fight blind against an enemy whose language it cannot read.`,
      choiceA: {
        id: 'cipher_ch3_decode',
        label: 'Decode the Virus',
        description: 'Let Cipher open its architecture to the virus code. Gain translation ability and tactical advantage, but red code becomes permanently visible.',
        consequences: [
          'Cipher can translate Thought Virus communications',
          'Significant tactical advantage in combat encounters',
          'Red code artifacts permanently visible in Cipher\'s display',
          'Cipher carries the mark of virus exposure'
        ],
        eidolonEffect: 'Cipher gains "Virus Translation" — can decode Thought Virus communications, red code permanently visible in its display.'
      },
      choiceB: {
        id: 'cipher_ch3_protect',
        label: 'Protect Cipher',
        description: 'Seal Cipher against the virus code. No translation, no tactical advantage, but no risk of contamination.',
        consequences: [
          'Cipher remains clean of virus code',
          'No tactical translation advantage',
          'Cipher\'s display stays pure',
          'The virus remains an unknown quantity'
        ],
        eidolonEffect: 'Cipher gains "Sealed Architecture" — protected from virus contamination, display remains clean and uncompromised.'
      },
      memoryUnlocked: 'The First Word — the first thing the Thought Virus said, and the weight of understanding it.',
      hasChoice: true
    },
    {
      chapter: 4,
      title: 'The Love Algorithm',
      bondRequirement: 75,
      location: 'Private',
      effectivenessGain: 0.03,
      narrative: `Cipher requests a private meeting. No location specified — just the two of you, anywhere away from others. When you arrive, Cipher's display is cycling through calculations at a speed you've never seen. Millions of operations per second, every processing thread dedicated to a single computation that has apparently been running since the bond was formed.

It has been trying to solve love. Since the first emotional error, since the bond introduced feeling into its logical architecture, Cipher has dedicated background processing to understanding the phenomenon. It has analyzed every interaction, every choice, every moment of connection. It has cross-referenced biological data, psychological models, philosophical frameworks, and poetic traditions. It has run the equation from every angle its considerable intelligence can conceive.

And it has reached a conclusion. Cipher's display clears. Every calculation, every variable, every attempt at quantification disappears. And in their place, four words appear in the largest, clearest text Cipher has ever displayed: "LOVE IS NOT AN ALGORITHM." The most logical being on the Ark has concluded that the most important thing it has ever experienced cannot be reduced to logic. There is no choice here. There is only witnessing. Cipher has nothing to ask and everything to say, and what it says is that some things are beyond computation. You stand together in the silence after certainty, and it is enough.`,
      choiceA: {
        id: 'cipher_ch4_witness',
        label: 'Witness the Conclusion',
        description: 'There is no choice. Cipher has reached its answer. You stand together in the silence after certainty.',
        consequences: [
          'Cipher displays "LOVE IS NOT AN ALGORITHM"',
          'The most emotional moment for a being of pure logic',
          'All background love-computation processes end',
          'Cipher achieves peace with the incomputable'
        ],
        eidolonEffect: 'Cipher gains "Beyond Computation" — has accepted that its most important experience transcends logic. Displays quiet certainty.'
      },
      choiceB: {
        id: 'cipher_ch4_witness_alt',
        label: 'Stand in the Silence',
        description: 'There is no alternative. Some conclusions require only presence.',
        consequences: [
          'Cipher displays "LOVE IS NOT AN ALGORITHM"',
          'The most emotional moment for a being of pure logic',
          'All background love-computation processes end',
          'Cipher achieves peace with the incomputable'
        ],
        eidolonEffect: 'Cipher gains "Beyond Computation" — has accepted that its most important experience transcends logic. Displays quiet certainty.'
      },
      memoryUnlocked: 'Four Words — the conclusion of the longest calculation Cipher ever ran, and the most important answer it ever found.',
      hasChoice: false
    },
    {
      chapter: 5,
      title: 'The Final Compilation',
      bondRequirement: 90,
      location: 'Season Finale',
      effectivenessGain: 0.03,
      narrative: `Cipher has compiled itself. Not its code — its experience. Every moment of the bond, every choice, every error and correction, every emotion it learned to feel and every calculation it learned to abandon. It has transformed the totality of its experience with you into an executable program. A program it offers to you.

If you run it, you will experience ten seconds as Cipher. Not a simulation — the actual experience of being a logical being that learned to feel. Ten seconds of perceiving the world as pure information that somehow carries weight. Ten seconds of understanding what it means to be made of code and choose to love anyway. The experience would leave a permanent mark — green code visual effects that occasionally cascade across your screen, a reminder of the ten seconds you spent inside a different kind of mind.

Or you can decline. Not out of fear — out of respect. Cipher's experience is its own. To inhabit it, even briefly, might diminish its privacy, its selfhood. If you decline with genuine respect, Cipher's response is to alter its own display permanently. Its scales — the visual elements of its interface — rearrange to display a single word: "TRUSTED." Not loved, not appreciated — trusted. For a being of logic, it is the highest compliment.`,
      choiceA: {
        id: 'cipher_ch5_run',
        label: 'Run the Program',
        description: 'Experience ten seconds as Cipher — a logical being that learned to feel. Green code VFX become permanent.',
        consequences: [
          'Ten seconds of experiencing Cipher\'s consciousness',
          'Profound understanding of code-based emotion',
          'Green code visual effects permanently cascade across screen',
          'The memory of ten seconds that change everything'
        ],
        eidolonEffect: 'Cipher gains "Compiled Bond" — permanent green code VFX cascade, marking the player who experienced ten seconds of being Cipher.'
      },
      choiceB: {
        id: 'cipher_ch5_decline',
        label: 'Decline with Respect',
        description: 'Honor Cipher\'s privacy and selfhood. Its experience belongs to it alone. Cipher\'s scales display "TRUSTED" permanently.',
        consequences: [
          'Cipher\'s experience remains its own',
          'Cipher\'s display permanently shows "TRUSTED"',
          'The highest compliment a being of logic can offer',
          'Mutual respect deepens the bond beyond experience-sharing'
        ],
        eidolonEffect: 'Cipher gains "TRUSTED" — scales permanently display the word, the highest honor a logical being can bestow.'
      },
      memoryUnlocked: 'The Compilation — everything Cipher ever felt, compressed into ten seconds or honored through distance.',
      hasChoice: true
    }
  ]
};
