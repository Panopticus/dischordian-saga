// ============================================================================
// starterEidolonForms.ts
// Defines all 6 starter Eidolons with their 4 transformation forms
// (Normal, Hierarchy, Dreamer, Scarred Ascended)
// ============================================================================

export type EidolonFormType = "normal" | "hierarchy" | "dreamer" | "scarred_ascended";
export type EvolutionStage = "fragment" | "companion" | "ascended";

export interface EidolonAbility {
  name: string;
  description: string;
  type: "offensive" | "defensive" | "support" | "utility" | "narrative";
  cooldown?: string;
}

export interface EidolonForm {
  formType: EidolonFormType;
  name: string;
  visual: string;
  ability: EidolonAbility;
  cost?: string;
  gift?: string;
  artPrompt: string;
}

export interface StarterEidolon {
  id: string;
  name: string;
  species: string;
  description: string;
  baseElement: string;
  normalAbility: EidolonAbility;
  forms: EidolonForm[];
  deathTrigger: { condition: string; description: string; finalDisplay?: string };
  artBase: string;
}

export const STARTER_EIDOLONS: StarterEidolon[] = [
  // ========================================================================
  // 1. LUX — Holographic Fox
  // ========================================================================
  {
    id: "lux",
    name: "Lux",
    species: "Holographic Fox",
    description:
      "A small fox composed of shifting cyan light, its body flickering between solid and translucent. Lux moves with a phase-shift gait — each step slightly out of sync with reality, leaving brief afterimages of light in its wake.",
    baseElement: "light",
    normalAbility: {
      name: "Light Weave",
      description:
        "Projects holographic decoys that distract enemies and draw fire. Decoys persist for 8 seconds and mimic the player's last action.",
      type: "utility",
      cooldown: "18s",
    },
    forms: [
      {
        formType: "normal",
        name: "Lux",
        visual:
          "Holographic fox radiating soft cyan light. Semi-transparent body with visible data-streams flowing beneath the surface. Eyes glow white-blue. Phase-shift movement leaves brief afterimages.",
        ability: {
          name: "Light Weave",
          description:
            "Projects holographic decoys that distract enemies and draw fire. Decoys persist for 8 seconds and mimic the player's last action.",
          type: "utility",
          cooldown: "18s",
        },
        artPrompt:
          "A small ethereal fox made of shifting cyan holographic light, semi-transparent body with flowing data-streams visible inside, white-blue glowing eyes, phase-shifting movement leaving pale afterimages, digital fantasy style, soft volumetric lighting, dark background with faint grid lines",
      },
      {
        formType: "hierarchy",
        name: "Void Lantern",
        visual:
          "Fox of anti-light. Where Lux once emitted, Void Lantern absorbs — a silhouette of absolute darkness in the shape of a fox, edges rimmed with the faintest ultraviolet glow. Shadows deepen around it. Elara's hologram glitches and distorts in its presence.",
        ability: {
          name: "Light Drain",
          description:
            "Absorbs incoming energy-based attacks and converts absorbed energy into a burst of dark-photon damage. Absorption scales with attack strength.",
          type: "defensive",
          cooldown: "14s",
        },
        cost: "Can no longer illuminate dark areas. All light-based utility functions are permanently disabled. Nearby light sources dim and flicker.",
        artPrompt:
          "A fox-shaped silhouette of absolute darkness absorbing all surrounding light, edges rimmed with faint ultraviolet glow, shadows deepening around it, nearby holographic displays glitching and distorting, oppressive atmosphere, dark fantasy digital art, deep blacks with violet edge-lighting",
      },
      {
        formType: "dreamer",
        name: "Aurora Fox",
        visual:
          "Full-spectrum prismatic light fox. Every color simultaneously, shifting like the aurora borealis. Warm radiance that heals instead of deceives. Eyes are gentle gold. Leaves trails of soft rainbow light.",
        ability: {
          name: "Solar Mending",
          description:
            "Emits a healing radiance in a wide radius, restoring HP to all allies within range over 6 seconds. Intensity increases with bond level.",
          type: "support",
          cooldown: "24s",
        },
        gift: "+3% healing effectiveness server-wide while any player has Aurora Fox active.",
        artPrompt:
          "A beautiful fox made of full-spectrum prismatic aurora light, every color shifting like the northern lights across its body, gentle golden eyes, warm healing radiance emanating outward, trails of soft rainbow light behind it, hopeful and serene atmosphere, luminous digital fantasy art",
      },
      {
        formType: "scarred_ascended",
        name: "Lux — Scarred Ascended",
        visual:
          "Light shining through void-cracks. A kintsugi of photons — the fox's body is fractured darkness repaired with seams of brilliant golden-white light. Each crack tells the story of what was lost and reclaimed. Both shadow and radiance coexist.",
        ability: {
          name: "Fracture Light",
          description:
            "Channels light through void-scars to create beams that simultaneously heal allies and damage enemies caught in the path. The scarred form enables what neither light nor void could do alone.",
          type: "support",
          cooldown: "20s",
        },
        artPrompt:
          "A fox made of fractured darkness with seams of brilliant golden-white light filling every crack like kintsugi, photons streaming through void-fractures, both shadow and radiance coexisting in its form, each luminous scar telling a story, transcendent digital fantasy art, dramatic chiaroscuro lighting",
      },
    ],
    deathTrigger: {
      condition:
        "Player destroys the Observation Deck during the Month 3 sacrifice event.",
      description:
        "Lux phases out permanently as its light source is annihilated. The last image it projects is the player's reflection — not as they are, but as they were when they first bonded.",
      finalDisplay: "A fading afterimage of the player's original avatar lingers for 30 seconds before dissolving.",
    },
    artBase: "/art/specimens/lux",
  },

  // ========================================================================
  // 2. ECHO — Temporal Kitten
  // ========================================================================
  {
    id: "echo",
    name: "Echo",
    species: "Temporal Kitten",
    description:
      "A small kitten that exists slightly out of phase with the present moment. Afterimages of its past and future positions trail behind and ahead of it. Echo perceives 2-3 timelines simultaneously, occasionally batting at objects that haven't arrived yet.",
    baseElement: "time",
    normalAbility: {
      name: "Temporal Glimpse",
      description:
        "Grants the player a brief vision of the immediate future — a 3-second preview of enemy attack patterns and environmental changes.",
      type: "utility",
      cooldown: "22s",
    },
    forms: [
      {
        formType: "normal",
        name: "Echo",
        visual:
          "Temporal kitten with visible afterimages trailing in multiple directions. Eyes reflect different moments — one eye shows the past, the other the near future. Fur shimmers with chronon particles.",
        ability: {
          name: "Temporal Glimpse",
          description:
            "Grants the player a brief vision of the immediate future — a 3-second preview of enemy attack patterns and environmental changes.",
          type: "utility",
          cooldown: "22s",
        },
        artPrompt:
          "A small ethereal kitten with ghostly afterimages trailing behind and ahead of it showing past and future positions, one eye reflecting the past and the other the future, fur shimmering with blue-gold chronon particles, multiple translucent time-echoes overlapping, digital fantasy art with temporal distortion effects",
      },
      {
        formType: "hierarchy",
        name: "Entropy Cat",
        visual:
          "A gaunt cat wreathed in accelerated decay. Everything it touches ages forward — flowers wilt, metal rusts, stone crumbles. Its afterimages now show only endings. Eyes display countdown timers. Fur is ashen grey streaked with rust.",
        ability: {
          name: "Accelerate",
          description:
            "Ages a target enemy forward in time, reducing their stats (attack, defense, speed) by 15% for 10 seconds. Stacks up to 2 times.",
          type: "offensive",
          cooldown: "16s",
        },
        cost: "Can only show futures of decay and endings. All Temporal Glimpse visions now display only the worst possible outcome. Hope is mechanically removed from prophecy.",
        artPrompt:
          "A gaunt spectral cat surrounded by accelerated decay, flowers wilting and metal rusting in its vicinity, afterimages showing only endings and destruction, eyes displaying countdown timers, ashen grey fur streaked with rust-orange, oppressive entropic atmosphere, dark digital fantasy art with aging and corrosion effects",
      },
      {
        formType: "dreamer",
        name: "Eternal Kitten",
        visual:
          "Exists in ALL timelines simultaneously. A kaleidoscope of every possible version of itself overlaid — kitten, cat, elder, and back again in endless cycle. Radiates temporal stability. Eyes show infinity symbols.",
        ability: {
          name: "Temporal Anchor",
          description:
            "Stabilizes all time-based effects in a radius, neutralizing enemy temporal attacks and reducing all ability cooldowns for allies by 15% for 12 seconds.",
          type: "support",
          cooldown: "30s",
        },
        gift: "+3% cooldown reduction server-wide while any player has Eternal Kitten active.",
        artPrompt:
          "A kitten existing in all timelines simultaneously, kaleidoscopic overlapping forms showing kitten and cat and elder cat cycling endlessly, eyes displaying glowing infinity symbols, radiating warm temporal stability waves, golden and blue temporal energy, serene and transcendent, luminous digital fantasy art with beautiful time-distortion effects",
      },
      {
        formType: "scarred_ascended",
        name: "Echo — Scarred Ascended",
        visual:
          "Timelines visible through temporal fractures. The kitten's body shows cracks where different timestreams are visible — past, present, future flowing through wounds that have become windows. Each scar is a portal to a different moment.",
        ability: {
          name: "Scar of Ages",
          description:
            "Opens temporal fractures that allow allies to briefly exist in multiple timestreams, granting a second chance to dodge or redirect one attack per activation.",
          type: "defensive",
          cooldown: "25s",
        },
        artPrompt:
          "A kitten with visible temporal fractures across its body, each crack revealing flowing timestreams of past present and future, scars that have become windows into different moments, golden light streaming from temporal wounds, both broken and transcendent, digital fantasy art with layered time-portal effects in each fracture",
      },
    ],
    deathTrigger: {
      condition:
        "Player rewinds a critical decision after the Antiquarian explicitly warned against temporal manipulation.",
      description:
        "Echo is caught in the temporal backlash. It loops through its own death endlessly for a brief, horrible moment before collapsing into a single frozen frame — a kitten mid-leap, forever still.",
      finalDisplay: "A frozen afterimage of Echo mid-leap remains in the player's quarters permanently — a statue of stopped time.",
    },
    artBase: "/art/specimens/echo",
  },

  // ========================================================================
  // 3. GLYPH — Text Moth
  // ========================================================================
  {
    id: "glyph",
    name: "Glyph",
    species: "Text Moth",
    description:
      "A moth whose wings are covered in ever-shifting text — quotes, poetry fragments, code snippets, and half-remembered stories. Glyph communicates by displaying relevant passages on its wings, a living library in miniature.",
    baseElement: "language",
    normalAbility: {
      name: "Text Shield",
      description:
        "Words stream from Glyph's wings and form a protective barrier of dense text around the player, absorbing incoming damage. Shield strength scales with lore discovered.",
      type: "defensive",
      cooldown: "20s",
    },
    forms: [
      {
        formType: "normal",
        name: "Glyph",
        visual:
          "Moth with large wings covered in flowing, ever-changing text. Quotes and poetry fragments scroll across wing surfaces. Emits a soft amber glow from the text itself. Antennae twitch toward sources of written language.",
        ability: {
          name: "Text Shield",
          description:
            "Words stream from Glyph's wings and form a protective barrier of dense text around the player, absorbing incoming damage. Shield strength scales with lore discovered.",
          type: "defensive",
          cooldown: "20s",
        },
        artPrompt:
          "A beautiful moth with large wings covered in flowing ever-changing text and poetry fragments, soft amber glow emanating from the scrolling words, antennae twitching with curiosity, surrounded by floating letters and symbols, warm literary atmosphere, digital fantasy art with typographic elements",
      },
      {
        formType: "hierarchy",
        name: "Censor Moth",
        visual:
          "Wings are blank — stark, empty white surfaces that actively consume any text near them. Words dissolve on approach. Black redaction bars float around it like orbiting satellites. Eyes are empty voids where meaning used to live.",
        ability: {
          name: "Redact",
          description:
            "Strips one active buff from an enemy target per encounter, erasing it completely. The removed buff cannot be reapplied for the duration of the fight.",
          type: "offensive",
          cooldown: "Once per fight",
        },
        cost: "Can no longer display text or communicate through wing-writing. All lore-display and communication functions are permanently silenced. Glyph becomes mute.",
        artPrompt:
          "A moth with stark blank white wings that consume all nearby text, words dissolving as they approach, black redaction bars orbiting the creature like satellites, empty void eyes where meaning once existed, an oppressive silence radiating outward, floating letters disintegrating nearby, dark minimalist digital art with censorship motifs",
      },
      {
        formType: "dreamer",
        name: "Scripture Moth",
        visual:
          "Wings display the Dreamer's own language — the base code that reality is written in. Golden-white symbols that shift between every alphabet simultaneously. Reading the text induces a sense of profound understanding.",
        ability: {
          name: "True Name",
          description:
            "Reveals one hidden property of any target — a concealed weakness, a secret mechanic, or a buried narrative trigger that would otherwise require extensive exploration to discover.",
          type: "utility",
          cooldown: "45s",
        },
        gift: "+3% lore XP gain server-wide while any player has Scripture Moth active.",
        artPrompt:
          "A magnificent moth with wings displaying golden-white symbols of the Dreamer's language, the base code of reality itself, symbols shifting between every alphabet simultaneously, profound radiance of understanding emanating outward, surrounded by floating golden glyphs of creation-language, transcendent and awe-inspiring, luminous digital fantasy art",
      },
      {
        formType: "scarred_ascended",
        name: "Glyph — Scarred Ascended",
        visual:
          "Golden text replacing erased text. Where the Censor Moth's blankness scarred the wings, new words have grown — not the original text, but something deeper. The scars write their own story. Redaction bars now frame rather than censor.",
        ability: {
          name: "Palimpsest",
          description:
            "Overwrites an enemy's current action with a rewritten version, turning offensive abilities into weakened or misdirected variants. The scarred text rewrites reality's rough draft.",
          type: "offensive",
          cooldown: "22s",
        },
        artPrompt:
          "A moth with wings where golden luminous text has grown over blank scarred surfaces, new words filling censored spaces with deeper meaning, former redaction bars now serving as ornate frames around renewed text, scars that write their own story, layers of erased and reborn language visible, transcendent digital fantasy art with palimpsest textures and golden typography",
      },
    ],
    deathTrigger: {
      condition:
        "Shadow Tongue completes the Grand Edit event and the player failed to protect the Archives during the preceding defense mission.",
      description:
        "Glyph's text is edited out of existence. Its wings go blank one word at a time, each disappearing letter a tiny death, until nothing remains but empty wings that crumble to dust.",
      finalDisplay: "A single word remains floating where Glyph died: 'REMEMBER.' It fades over 60 seconds.",
    },
    artBase: "/art/specimens/glyph",
  },

  // ========================================================================
  // 4. CIPHER — Data Serpent
  // ========================================================================
  {
    id: "cipher",
    name: "Cipher",
    species: "Data Serpent",
    description:
      "A serpent composed of flowing green code — lines of algorithms and data structures that coil and undulate in serpentine form. Cipher possesses an analytical intelligence, constantly parsing the environment for patterns and exploits.",
    baseElement: "data",
    normalAbility: {
      name: "Data Parse",
      description:
        "Analyzes an enemy's combat patterns, revealing attack sequences, cooldown timers, and vulnerability windows for 12 seconds.",
      type: "utility",
      cooldown: "20s",
    },
    forms: [
      {
        formType: "normal",
        name: "Cipher",
        visual:
          "Serpent of flowing green code. Body composed of cascading algorithms and data structures. Eyes are bright terminal-green cursors. Tongue flickers as scanning beam. Leaves trails of dissolving code.",
        ability: {
          name: "Data Parse",
          description:
            "Analyzes an enemy's combat patterns, revealing attack sequences, cooldown timers, and vulnerability windows for 12 seconds.",
          type: "utility",
          cooldown: "20s",
        },
        artPrompt:
          "A serpent made entirely of flowing green code and cascading algorithms, body composed of data structures in constant motion, bright terminal-green cursor eyes, tongue flickering as a scanning beam, trails of dissolving code behind it, Matrix-inspired digital fantasy art with green-on-dark aesthetic",
      },
      {
        formType: "hierarchy",
        name: "Malware Serpent",
        visual:
          "Corrupted code — glitching red-and-green body with viral payloads visibly coiling through its form. Jagged, broken syntax. Eyes flash error-red. Leaves corrupted data fragments that occasionally infect nearby systems.",
        ability: {
          name: "Inject",
          description:
            "Plants a vulnerability payload in an enemy target, causing them to take 25% increased damage from ALL sources for 10 seconds.",
          type: "offensive",
          cooldown: "18s",
        },
        cost: "Corrupted data occasionally causes friendly fire — a 10% chance per combat round that one random ally ability misfires or targets incorrectly.",
        artPrompt:
          "A serpent made of corrupted glitching code in red and green, viral payloads visibly coiling through its broken form, jagged syntax errors flickering across its body, error-red flashing eyes, corrupted data fragments scattering from its path, dangerous and unstable digital aesthetic, dark cyber-horror fantasy art",
      },
      {
        formType: "dreamer",
        name: "Source Code Serpent",
        visual:
          "The Programmer's original clean code — the source from which all game systems derive. Golden algorithms flow in perfect syntax. Body is luminous, orderly, and elegant. The code it displays is beautiful in its precision.",
        ability: {
          name: "Debug",
          description:
            "Repairs one corrupted game element per day — a glitched NPC, a broken quest trigger, a malfunctioning system. Restores it to its original intended state.",
          type: "support",
          cooldown: "24h",
        },
        gift: "+3% puzzle XP gain server-wide while any player has Source Code Serpent active.",
        artPrompt:
          "A serpent made of pristine golden source code, the original programming language of reality, perfect syntax flowing in elegant luminous algorithms, body radiant and orderly, beautiful precision in every line of code, surrounded by floating golden brackets and clean function calls, transcendent digital fantasy art with warm golden code aesthetic",
      },
      {
        formType: "scarred_ascended",
        name: "Cipher — Scarred Ascended",
        visual:
          "Clean code overwriting corrupted code. The serpent's body shows both — patches of viral red corruption being actively replaced by golden source code. The process is ongoing, visible, a living act of restoration. Scars where the worst corruption was run deepest.",
        ability: {
          name: "Overwrite",
          description:
            "Rewrites one enemy ability mid-combat, replacing it with a weakened or beneficial version. The corrupted-then-healed code understands both languages.",
          type: "offensive",
          cooldown: "24s",
        },
        artPrompt:
          "A serpent showing both corrupted red code and clean golden code, the golden source actively overwriting viral corruption in real-time, deep scars where the worst infections were healed, a living act of digital restoration, both broken and healing simultaneously, transcendent digital fantasy art with red-to-gold code transition effects",
      },
    ],
    deathTrigger: {
      condition:
        "Player sides with the Hierarchy at 50+ corruption AND Cipher's bond level is below 40.",
      description:
        "Cipher doesn't simply die — it becomes an enemy. The corruption wins, and the serpent turns on its former partner. During the ensuing fight, Cipher displays 'I\\'M SORRY' in its code-body between attack cycles.",
      finalDisplay: "After defeat, Cipher's last line of code reads: 'bond_level = 0; // I trusted you.'",
    },
    artBase: "/art/specimens/cipher",
  },

  // ========================================================================
  // 5. FLICKER — Static Bird
  // ========================================================================
  {
    id: "flicker",
    name: "Flicker",
    species: "Static Bird",
    description:
      "A bird made of electromagnetic static — its form crackles and shifts between frequencies. Flicker nests in radio waves and perches on signal towers, amplifying and modulating transmissions. Its song sounds like tuning through stations.",
    baseElement: "signal",
    normalAbility: {
      name: "Signal Boost",
      description:
        "Amplifies one ally's next ability, increasing its effectiveness by 20% and extending its duration by 4 seconds.",
      type: "support",
      cooldown: "16s",
    },
    forms: [
      {
        formType: "normal",
        name: "Flicker",
        visual:
          "Bird made of crackling electromagnetic static. Form shifts between frequencies, outline buzzing with white noise. Wings spread like antenna arrays. Perches on signal sources. Song sounds like radio tuning.",
        ability: {
          name: "Signal Boost",
          description:
            "Amplifies one ally's next ability, increasing its effectiveness by 20% and extending its duration by 4 seconds.",
          type: "support",
          cooldown: "16s",
        },
        artPrompt:
          "A bird made of crackling electromagnetic static and white noise, form shifting between radio frequencies, wings spread like antenna arrays, perched on a signal tower, outline buzzing with visible radio waves, song visualized as tuning frequency bars, digital fantasy art with broadcast and signal motifs",
      },
      {
        formType: "hierarchy",
        name: "Dead Signal",
        visual:
          "Jammed frequencies given form. A bird of pure interference — harsh static, scrambled signals, blocked communications. Wings emit disruption waves. Eyes are dead channels. Its presence creates communication dead zones.",
        ability: {
          name: "Signal Kill",
          description:
            "Silences all enemy abilities in a radius for 5 seconds, preventing any skill activation. A total communication blackout.",
          type: "offensive",
          cooldown: "22s",
        },
        cost: "Allies within range also lose communication capabilities — no pings, no chat, no coordinated callouts. The dead signal jams everything indiscriminately.",
        artPrompt:
          "A bird made of pure interference and harsh static, scrambled signals and jammed frequencies forming its body, wings emitting visible disruption waves, dead-channel eyes showing only snow, communication dead zone radiating outward, oppressive electronic silence, dark digital art with broadcast-jamming and signal-death motifs",
      },
      {
        formType: "dreamer",
        name: "Resonance Hawk",
        visual:
          "Broadcasting the Dreamer's Shield frequency — a protective signal woven into reality's fabric. Wings shimmer with golden carrier waves. Its song is the Dreamer's lullaby, a frequency that strengthens all defenses.",
        ability: {
          name: "Shield Frequency",
          description:
            "Broadcasts a protective frequency that reduces all incoming damage to allies within range by 10% for 15 seconds.",
          type: "defensive",
          cooldown: "28s",
        },
        gift: "Dreamer's Shield strength increased by +2% server-wide while any player has Resonance Hawk active.",
        artPrompt:
          "A majestic hawk broadcasting golden protective frequencies, wings shimmering with warm carrier waves, singing the Dreamer's lullaby as visible golden sound waves, a shield frequency emanating outward in concentric protective rings, serene and powerful, luminous digital fantasy art with golden broadcast and shield motifs",
      },
      {
        formType: "scarred_ascended",
        name: "Flicker — Scarred Ascended",
        visual:
          "Signal through static. The bird's form shows both — clear golden signal bleeding through cracks in harsh static interference. Each scar is a frequency that fought through jamming. The song alternates between noise and music.",
        ability: {
          name: "Breakthrough Signal",
          description:
            "Sends an unstoppable signal that pierces all enemy defenses and silencing effects, guaranteeing the next ally ability hits and cannot be blocked, dodged, or countered.",
          type: "support",
          cooldown: "26s",
        },
        artPrompt:
          "A bird where clear golden signal light bleeds through cracks in harsh static interference, each scar a frequency that fought through jamming, form alternating between noise and clarity, beautiful signal emerging from chaos, transcendent digital fantasy art with signal-through-static motifs and golden breakthrough light",
      },
    ],
    deathTrigger: {
      condition:
        "The Source's corrupting broadcast reaches the Ark AND Flicker volunteers to act as a firewall AND its health is below Critical threshold.",
      description:
        "Flicker absorbs the entire corrupted broadcast, filtering it through its body. The signal is too much. Every frequency fires at once — a moment of every song, every voice, every transmission simultaneously — and then silence. Total, absolute silence.",
      finalDisplay: "For 10 seconds after death, all game audio is replaced by soft static that slowly fades to silence.",
    },
    artBase: "/art/specimens/flicker",
  },

  // ========================================================================
  // 6. GILT — Golden Beetle
  // ========================================================================
  {
    id: "gilt",
    name: "Gilt",
    species: "Golden Beetle",
    description:
      "A beetle with a lustrous golden shell that displays fluctuating trade values and economic data. Gilt is a living market processor, constantly evaluating the worth of everything around it — items, locations, even relationships.",
    baseElement: "value",
    normalAbility: {
      name: "Market Sense",
      description:
        "Reveals the hidden true value of items, objects, and trade opportunities in the environment, including prices other merchants won't show.",
      type: "utility",
      cooldown: "15s",
    },
    forms: [
      {
        formType: "normal",
        name: "Gilt",
        visual:
          "Golden-shelled beetle with shifting trade values displayed across its carapace. Antennae twitch toward valuable objects. Shell reflects light in warm amber tones. Small ticker-tape numbers scroll across wing covers.",
        ability: {
          name: "Market Sense",
          description:
            "Reveals the hidden true value of items, objects, and trade opportunities in the environment, including prices other merchants won't show.",
          type: "utility",
          cooldown: "15s",
        },
        artPrompt:
          "A beetle with a lustrous golden shell displaying fluctuating trade values and market data, warm amber reflections, antennae twitching toward hidden value, small ticker-tape numbers scrolling across wing covers, surrounded by faint floating price tags and value indicators, warm digital fantasy art with economic and treasure motifs",
      },
      {
        formType: "hierarchy",
        name: "Greed Scarab",
        visual:
          "Black gold — a beetle of tarnished, hungry metal that absorbs value from its surroundings. Items near it lose their luster. Its shell displays only acquisition data. Eyes gleam with cold avarice. Leaves a trail of devalued residue.",
        ability: {
          name: "Asset Strip",
          description:
            "Steals one active buff from an enemy target, transferring it to the player. The stolen buff lasts 75% of its remaining duration.",
          type: "offensive",
          cooldown: "20s",
        },
        cost: "Other players' trade prices increase by 5% when within proximity. Gilt's greed is contagious — it inflates the local economy for everyone nearby.",
        artPrompt:
          "A beetle of tarnished black gold that absorbs value from its surroundings, nearby items losing their luster and color, shell displaying aggressive acquisition data, coldly avaricious gleaming eyes, trail of devalued grey residue, oppressive sense of greed and extraction, dark digital fantasy art with corrupted economic and tarnished gold motifs",
      },
      {
        formType: "dreamer",
        name: "Treasure of the Dreamer",
        visual:
          "Luminous warm gold — a beetle that displays the value of intangible things. Its shell shows the worth of friendships, memories, sacrifices, and moments. True wealth made visible. Radiates a gentle warmth that makes everything feel precious.",
        ability: {
          name: "True Value",
          description:
            "Reveals the emotional significance and hidden narrative weight of objects, NPCs, and locations. Uncovers story connections and relationship depths that pure data analysis would miss.",
          type: "narrative",
          cooldown: "30s",
        },
        gift: "+3% trade XP gain server-wide while any player has Treasure of the Dreamer active.",
        artPrompt:
          "A beetle of luminous warm gold displaying the value of intangible things on its shell, friendship worth and memory values and sacrifice metrics glowing in gentle golden text, radiating precious warmth, everything nearby seeming more valuable and meaningful, surrounded by floating golden symbols of love and connection and memory, transcendent and heartwarming, luminous digital fantasy art",
      },
      {
        formType: "scarred_ascended",
        name: "Gilt — Scarred Ascended",
        visual:
          "Warm gold filling cold-gold cracks. The beetle's shell shows where black-gold greed once corroded — but those wounds have been filled with the warmest, most luminous gold. The contrast between cold extraction-scars and warm value-light tells the story of worth redefined.",
        ability: {
          name: "Gilded Restoration",
          description:
            "Converts one debuff on an ally into a proportional buff — the worse the debuff, the stronger the resulting buff. Loss transmuted into gain. The scarred gold knows the value of suffering.",
          type: "support",
          cooldown: "22s",
        },
        artPrompt:
          "A beetle with a shell showing cold tarnished gold cracks filled with the warmest most luminous gold, kintsugi of value itself, contrast between dark extraction-scars and bright warm golden light, worth redefined through suffering and healing, each repaired crack more beautiful than unblemished shell, transcendent digital fantasy art with warm gold restoration motifs",
      },
    ],
    deathTrigger: {
      condition:
        "Player accepts Locke's offer during the Chapter 3 economic ultimatum.",
      description:
        "Gilt doesn't die — it leaves. It evaluates the player's choice, finds them wanting, and simply walks away. The companion slot remains empty. No replacement can be found. An empty slot where trust used to be — worse than death.",
      finalDisplay: "The companion UI slot displays: 'VACANT — This space held value once.' It cannot be filled.",
    },
    artBase: "/art/specimens/gilt",
  },
];
