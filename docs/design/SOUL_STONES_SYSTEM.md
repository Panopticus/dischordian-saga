# SOUL STONES & DIVINE LIGHT — THE CORRUPTION ECONOMY
## Dischordian Saga: Dual-Path Collection & Summoning System
### docs/design/SOUL_STONES_SYSTEM.md

**Document Purpose:** Complete design for the Soul Stone / Divine Light system — a dual-path resource economy that forces players to choose between immediate demonic power and long-term divine investment. Every Soul Stone is a moral decision. Every purification is a sacrifice. The system feeds into the Hierarchy of the Damned lore, the Dreamer's legacy, and the community's collective alignment.

**Design Philosophy:** Power should cost something real. The Hierarchy of the Damned offers power NOW — cheap, fast, intoxicating, and corrosive. The Dreamer's Light offers power LATER — expensive, slow, painful to earn, and transformative. This is not a balance between two equal paths. This is a temptation. The dark path is EASIER. The light path is BETTER. And the space between "easier" and "better" is where every great story lives.

---

# ═══════════════════════════════════════════════
# SECTION 1: THE SOUL STONE
# ═══════════════════════════════════════════════

## 1.1 — WHAT IS A SOUL STONE?

A Soul Stone is a crystallized fragment of consciousness — a shard of awareness torn loose from the fabric of the Matrix of Dreams during combat, exploration, or narrative events. They are the residue of suffering, conflict, and death. They glow with an inner light that shifts between red (corrupted), violet (neutral), and gold (pure) depending on their state.

**Lore:** When the Severance shattered the ancient bindings and the Hierarchy of the Damned emerged from the Abyss, the boundary between life and death became porous. Consciousness no longer stays neatly inside bodies — it leaks. Every death in combat, every defeated enemy, every moment of existential crisis generates Soul Stone fragments. The Necromancer was the first to notice them. The Hierarchy was the second.

**Visual:** Small, irregular crystals — roughly the size of a marble. They hover slightly above surfaces, rotating slowly. Their color indicates state:
- **RED** — Corrupted. Resonates with the Hierarchy. Hums with a low, almost subsonic frequency. Warm to the touch. Feels like holding a small ember that whispers.
- **VIOLET** — Neutral. Unprocessed. The default state when collected. No resonance. Slightly cool. Silent.
- **GOLD** — Purified. Resonates with the Dreamer. Emits a faint harmonic tone. Warm, but the warmth comes from inside the holder, not the stone. Feels like holding a memory of something beautiful.

## 1.2 — HOW TO OBTAIN SOUL STONES

Soul Stones drop from ALL combat and exploration activities. They are the game's universal rare resource — more valuable than Dream Tokens, rarer than credits, and infinitely more consequential.

| Source | Drop Rate | Stone Quality | Notes |
|---|---|---|---|
| Arena Combat (victory) | 1 per win | Violet (neutral) | Guaranteed on win |
| Arena Combat (defeat) | 25% chance | Violet (neutral) | Consolation — you learn from loss |
| Terminus Swarm (wave clear) | 1 per 5 waves | Violet (neutral) | Scales — boss waves drop 3 |
| Story Mode (chapter complete) | 2 per chapter | Violet (neutral) | First clear only |
| Story Mode (secret found) | 1 per secret | Gold (pre-purified!) | Rare — secrets are hard to find |
| Card Battle (tournament win) | 1 per tournament | Violet (neutral) | Ranked only |
| Chess (checkmate) | 1 per 3 checkmates | Violet (neutral) | Must be against ranked opponent |
| Exploration (data crystal) | 30% chance per crystal | Violet (neutral) | Random discovery |
| NPC Trust milestone (every 20) | 1 per milestone | Violet (neutral) | Trust 20, 40, 60, 80, 100 |
| Governance Vote participation | 1 per monthly vote | Violet (neutral) | Reward for civic engagement |
| Architect-Triggered Events | Variable | Red (pre-corrupted!) | Special events only |
| Betrayal Events | 1 guaranteed | Red (pre-corrupted!) | When an apprentice betrays you |
| The Eyes' Surveillance Feeds | 1 per unique feed | Gold (pre-purified!) | Only if Eyes was resurrected |

**Weekly soft cap:** 15 Soul Stones per week from combat/exploration sources. Uncapped from narrative sources (trust milestones, story mode, governance). This prevents grinding while rewarding engagement with the game's deeper systems.

## 1.3 — THE CHOICE: CORRUPT OR PURIFY

Every violet (neutral) Soul Stone presents the player with a binary choice. This choice is PERMANENT and IRREVERSIBLE for that stone.

### PATH A: CORRUPT THE STONE → DEMON SUMMONING

Feed the stone to the Hierarchy. It turns red. It counts toward summoning a Demon Pet — a companion creature drawn from the Hierarchy of the Damned's corporate structure.

**Cost:** 1 Soul Stone → 1 Corruption Point
**Speed:** Instant. The stone turns red the moment you choose. The Hierarchy is ALWAYS ready to take.

### PATH B: PURIFY THE STONE → DIVINE LIGHT

Offer the stone to the Dreamer's resonance chamber in the Medical Bay. The purification process is SLOW and EXPENSIVE:

**Cost:** 1 Soul Stone + 100 Dream Tokens → 1 Divine Light Fragment
**Time:** 24 REAL HOURS per purification. You can only purify 1 stone at a time (upgradeable to 2 at Trust 60 with the Antiquarian, 3 at Trust 80).
**Failure Rate:** 15% chance the purification fails and the stone is DESTROYED. You lose both the stone and the tokens. The Dreamer's path demands faith.

**THE MATH — Why this is a real sacrifice:**

To summon the cheapest Demon Pet: **7 Soul Stones** (7 Corruption Points). At 1-3 stones per day from active play, that's **3-7 days**.

To forge the cheapest Divine Light companion: **21 Soul Stones** + **2,100 Dream Tokens** + **21 real-time days** minimum (one purification per day). With the 15% failure rate, you'll statistically need **~25 stones** and **~2,500 tokens**. That's **3-4 weeks** of dedicated investment.

The divine path costs **3x the stones, 2,100+ tokens, and 3-4x the time**. This is intentional. The Hierarchy gives you power on credit. The Dreamer makes you earn it.

---

# ═══════════════════════════════════════════════
# SECTION 2: DEMON PETS — THE HIERARCHY'S OFFERING
# ═══════════════════════════════════════════════

## 2.1 — SUMMONING MECHANICS

When a player accumulates enough Corruption Points, they can visit the Castle of Death (the Necromancer's domain, accessible from the Medical Bay after the Necromancer arrives) to perform a summoning ritual. The ritual is dramatic — a voiced cinematic with green foxfire, glowing runes, and the Necromancer's sardonic commentary.

**The Necromancer's summoning dialog:**
*"So. You've been collecting souls. Don't look at me like that — I don't judge. I'm the 10th Archon of Death. Judging is the Judge's department. Let's see what the Hierarchy sends you. Fair warning: they always send exactly what you deserve. Whether that's a gift or a punishment depends entirely on you."*

## 2.2 — DEMON PET ROSTER

10 Demon Pets — one for each lord of the Hierarchy. Each is a miniature echo of its patron lord, scaled to companion-creature size. They are powerful, immediately useful, and subtly corrosive.

### TIER 1 — LESSER DEMONS (7 Corruption Points each)

**IMP OF RUIN (Patron: Xeth'Raal the Debt Collector)**
- **Visual:** A tiny gaunt figure draped in a moth-eaten suit made of contract paper. Carries a miniature ledger that records every transaction the player makes. Golden spectacles. Too-wide smile.
- **Ability:** +10% Dream Token income from all sources. BUT: every 7 days, the Imp "collects interest" — it consumes 5% of your current token balance. The Hierarchy always takes its cut.
- **Corruption Effect:** Trade Hub prices display in RED text. Locke notices: "You've got a Hierarchy accountant on your shoulder. Smart investment. Until the bill comes due."
- **Art Prompt:** `Tiny imp in a tattered business suit made of glowing contract text, golden spectacles, carrying a miniature leather ledger with red entries, gaunt elongated fingers counting invisible coins, too-wide permanent smile, green foxfire emanating from ledger, dark sci-fi aesthetic. Transparent background. 256x256.`

**SHADOW HOUND (Patron: Fenra the Moon Tyrant)**
- **Visual:** A small wolf-like creature made of shifting shadows, wearing a tiny fur-lined executive collar. Red eyes. Leaves no pawprints. Occasionally howls silently — you see the howl but hear nothing.
- **Ability:** +15% detection range for secrets, data crystals, and hidden content. The hound SNIFFS OUT hidden things. BUT: it also attracts Terminus Swarm scouts — random hostile encounters increase 10%.
- **Corruption Effect:** Night-cycle events (if implemented) become more frequent. The Human notices: "That thing operates on a lunar cycle. It's bringing the dark closer."
- **Art Prompt:** `Small wolf creature made of living shadow, corporate fur-lined collar with tiny brass nameplate, red glowing eyes, no pawprints, shifting dark form with occasional lupine features emerging and dissolving, reading glasses perched on snout, eerie silent howl pose. Transparent background. 256x256.`

**WHISPER MOTH (Patron: Ith'Rael the Whisperer)**
- **Visual:** A nearly invisible moth — a shimmer in the air, a distortion at the edge of vision. When visible, it's made of overlapping whispers rendered as translucent text. Eyes are tiny portals into the Abyss.
- **Ability:** +10% to all NPC Trust gain. The moth whispers what people want to hear. BUT: Trust gained through the moth is FRAGILE — if the moth is ever dismissed or lost, 20% of all Trust earned while it was active is RETROACTIVELY REMOVED. The Hierarchy's relationships are built on manipulation, not connection.
- **Corruption Effect:** NPC dialog occasionally includes a line they didn't say — a whisper from the moth, a suggestion, a planted thought. The Antiquarian notices but says nothing. His Chronicle entries become slightly more guarded.

### TIER 2 — GREATER DEMONS (15 Corruption Points each)

**BLOOD FAMILIAR (Patron: Varkul the Blood Lord)**
- **Visual:** A small vampiric bat with crystalline red wings, wearing a security badge. Eyes are compound and always scanning. Hangs upside down from the player's shoulder.
- **Ability:** +20% defense in all combat. Damage reduction is significant. BUT: the familiar FEEDS — it drains 1% of the player's max health permanently every week. The health reduction is cumulative. After 10 weeks, you've lost 10% of your max HP. The Hierarchy's protection has a cost measured in blood.
- **Corruption Effect:** The Medical Bay quarantine sensors flag you. Elara notices: "Your vital signs are... unusual. Something is feeding on your bio-signature. It's very small. And very patient."

**HARVEST TENDRIL (Patron: Drael'Mon the Harvester)**
- **Visual:** A writhing mass of small tendrils growing from a central node, like a miniature version of Drael'Mon. Attaches to the player's arm. Whispers in the languages of consumed worlds.
- **Ability:** DOUBLE Soul Stone drop rate from all combat sources. This is MASSIVE — it accelerates the entire system. BUT: 50% of bonus stones drop PRE-CORRUPTED (red). They cannot be purified. The Harvest Tendril feeds the Hierarchy's pipeline by ensuring you collect more — and keep more in the dark.
- **Corruption Effect:** Other players can see your Harvest Tendril. It's visible. It's unsettling. NPCs comment. The community knows you've gone deep into the Hierarchy's pocket.

**FLAYED LENS (Patron: Zyr'Koth the Flayer)**
- **Visual:** A floating eyeball made of dimensional membrane, constantly dissecting reality. Shows the "code" beneath surfaces — damage numbers, hidden stats, enemy weaknesses made visible.
- **Ability:** See enemy health bars, weaknesses, and attack patterns in all combat. A tactical advantage worth serious value. BUT: the Flayed Lens also shows YOU things — your own weakness. Random "insight events" flash text on screen: your failures, your lost votes, reminders of the paths you didn't take. The Flayer studies everything. Including you.
- **Corruption Effect:** The loredex entries viewed while the Lens is active have a faint red tint. Shadow Tongue notices a kindred spirit.

### TIER 3 — ARCH-DEMONS (30 Corruption Points each)

**CORRUPTOR'S MIRROR (Patron: Syl'Vex the Corruptor)**
- **Visual:** A small, impossibly beautiful androgynous figure in a tiny tailored suit, hovering at shoulder height. Makes eye contact with NPCs. Smiles at everyone. Everyone smiles back.
- **Ability:** ALL NPC Trust gains DOUBLED. ALL companion specimen bonuses DOUBLED. The most powerful social buff in the game. BUT: the Mirror subtly alters NPC dialog. They become... nicer. Too nice. Their warnings soften. Their criticisms vanish. The Human loses his edge. Elara stops mentioning uncomfortable truths. The Antiquarian's Chronicle entries become shorter, less detailed, less honest. You are being told what you want to hear. The truth becomes a casualty of comfort.
- **Corruption Effect:** The Governance Hub begins displaying vote results that are SLIGHTLY different from the actual tallies. Not enough to change outcomes — just enough to make the community feel more unified than it is. Consensus is manufactured. The Meme notices: "Hey. The numbers are wrong. Don't look at me — I didn't do it this time."

**THE UNMAKER'S SEED (Patron: Mol'Garath the Unmaker — CEO)**
- **Visual:** A tiny void — a marble-sized absence of reality. It doesn't reflect light. It doesn't cast a shadow. It is a hole in the world, carried in the player's inventory, pulsing with the gravity of everything it has unmade.
- **Ability:** Once per week, the Unmaker's Seed can DESTROY one game element permanently: a loredex entry (replaced with "[UNMADE]"), an NPC's memory of a specific event (they forget), a vote result (it is erased from the Chronicle), or even a room on the Ark (it goes dark, empty, the space folding in on itself). This is the most powerful item in the game. It can erase MISTAKES — undo a vote the community regrets, remove a scar from a bad choice, eliminate an embarrassment. BUT: what is unmade is GONE. Not hidden. Not archived. Gone. The Antiquarian cannot recover it. His Chronicle notes: "Something was here. I remember that something was here. But the thing itself is... absent. Not forgotten — UNMADE. There is a difference. Forgetting is human. Unmaking is not."
- **Corruption Effect:** The player's profile gains a faint visual distortion — a void-shimmer around their avatar. Other players can see it. It marks you as someone who carries the CEO of Hell's personal gift. The Necromancer refuses to speak to you until the Seed is dismissed.

## 2.3 — CORRUPTION CONSEQUENCES (GLOBAL)

Every Demon Pet active on the Ark contributes to a GLOBAL CORRUPTION METER visible in the Governance Hub's Pulse panel.

```
CORRUPTION METER:
0-10%   — "Whispers in the Walls" — ambient flavor text, minor visual effects
10-25%  — "The Hierarchy Takes Notice" — Syl'Vex appears as a holographic NPC
          offering community-wide "deals" (tempting but costly)
25-50%  — "Corporate Restructuring" — Hierarchy-themed events begin triggering
          automatically, NPC dialog shifts, the Castle of Death expands
50-75%  — "Hostile Acquisition" — The Hierarchy attempts to "acquire" the Ark.
          Weekly defense events. The Antiquarian is visibly distressed.
75-100% — "Under New Management" — The Ark's visual theme shifts to Hierarchy
          aesthetic. Red tint. Corporate logos. Mol'Garath's voice in the
          intercom. THIS IS REVERSIBLE but requires massive community effort.
```

The corruption meter creates a COMMUNITY conversation. Individual players choosing Demon Pets affect EVERYONE. This generates organic social pressure — not from the game scolding you, but from other players seeing the corruption climb.

---

# ═══════════════════════════════════════════════
# SECTION 3: DIVINE LIGHT — THE DREAMER'S PATH
# ═══════════════════════════════════════════════

## 3.1 — PURIFICATION MECHANICS

Purification happens in the Medical Bay's Resonance Chamber — a new sub-room unlocked when the first Soul Stone is collected. The chamber is a small, luminous space: a single pedestal of white crystal, surrounded by a holographic projection of the Dreamer's shield frequency. The room hums with a harmonic tone that matches the Dreamer's energy signature.

**The Purification Ritual:**
1. Player places a violet Soul Stone on the pedestal
2. Pays 100 Dream Tokens (consumed)
3. The stone begins to glow — violet shifting to gold over 24 REAL HOURS
4. A progress bar appears on the pedestal (visible to all players who visit the chamber)
5. At completion:
   - **85% chance:** SUCCESS. The stone becomes a Divine Light Fragment. A soft harmonic chime plays. The Dreamer's shield on the star map brightens fractionally.
   - **15% chance:** FAILURE. The stone shatters. The tokens are lost. The chime does not play. Silence. The Antiquarian's Chronicle: "The light did not hold. It never guaranteed it would. Faith is not a contract — it has no terms. It simply asks you to try again."

**Why the failure rate MATTERS:** It makes every successful purification feel earned. It creates stories — "I lost 3 stones before this one purified." It makes the divine path feel REAL. The Hierarchy never fails. The Dreamer sometimes does. That's the difference between a contract and a prayer.

## 3.2 — DIVINE LIGHT COMPANIONS

Divine Light companions are NOT demons wearing halos. They are something fundamentally different — constructs of purified consciousness, shaped by the Dreamer's resonance, manifestations of the best qualities of the souls they were forged from. They are rarer, slower to obtain, and permanently transformative.

### TIER 1 — CANDLE SPIRITS (7 Divine Light Fragments = ~25 stones, ~2,500 tokens, ~25 days)

**DAWN WISP**
- **Visual:** A small orb of warm golden light with a face visible inside — gentle, curious, slightly sad. Leaves a trail of fading light-motes. Makes a soft humming sound like a lullaby remembered from childhood.
- **Ability:** +5% to ALL stats permanently. Not 10%. Not 20%. Five percent. A small, steady, permanent improvement that compounds over time. No drawback. No cost. No corruption. No weekly drain. Just... a little more. Always.
- **Why this is better than Tier 1 Demons:** The Imp of Ruin gives +10% tokens but drains 5% weekly. Over 10 weeks, you've lost 50% of a week's tokens. The Dawn Wisp gives +5% to EVERYTHING and never takes a single point back. By month 3, the Dawn Wisp player is ahead. By month 6, dramatically ahead. By month 12, the gap is a canyon. SHORT TERM SACRIFICE → LONG TERM DOMINANCE.
- **Art Prompt:** `Small orb of warm golden light with a gentle human face visible inside, faintly glowing, leaving a trail of golden light motes that fade like fireflies, warm radiant aura, peaceful expression, the feeling of dawn in a dark room. Transparent background. 256x256.`

**HARMONY BELL**
- **Visual:** A tiny floating bell made of crystal that rings with a tone only the player can hear. The tone shifts based on nearby danger, opportunity, or hidden content. Wrapped in a faint golden lattice.
- **Ability:** Alerts the player to ALL hidden content, secrets, and approaching threats — similar to the Shadow Hound's detection but with NO increased hostile encounters. The bell simply... knows. It senses without attracting. It watches without being watched.
- **Why better:** Shadow Hound gives +15% detection but +10% hostiles. Harmony Bell gives equivalent detection with zero drawback. The hound tracks by scent — predators follow the same scent. The bell resonates — only you can hear it.

### TIER 2 — LIGHT BEARERS (15 Divine Light Fragments = ~53 stones, ~5,300 tokens, ~53 days)

**DREAMER'S TEAR**
- **Visual:** A floating teardrop of crystallized golden light, roughly the size of a fist. Inside the teardrop, a tiny landscape is visible — a fragment of the Dreamer's imagination. Mountains of light. Rivers of song. The world she dreamed before the Fall. It rotates slowly, showing different landscapes.
- **Ability:** Once per day, the Dreamer's Tear grants a VISION — a brief, beautiful narrative vignette (30-60 words, auto-generated from a template pool) showing a moment from the Dreamer's dreams. These visions contain ENCODED HINTS about the dark sector, the first wave, and the Year Two storyline. Players who collect enough visions can piece together critical lore that Demon Pet players never access. Additionally: +15% to all lore-related XP permanently.
- **Why better:** No demon pet gives lore access. The Hierarchy doesn't KNOW things — it CONSUMES things. The Dreamer REMEMBERS. The Tear is a window into memories that the Hierarchy has been trying to destroy for millennia.

**SHIELD FRAGMENT**
- **Visual:** A miniature version of the Dreamer's Shield — a hexagonal lattice of golden-green energy, hovering near the player's shoulder. Occasionally pulses in sync with the Ark's defense grid.
- **Ability:** +25% defense in all combat (better than Blood Familiar's +20%). When the player would be killed, the Shield Fragment activates ONCE PER DAY — full invulnerability for 5 seconds, allowing escape or counterattack. No health drain. No weekly cost. The shield simply protects. That is what it was made to do.
- **Why better:** Blood Familiar gives +20% defense but drains 1% max HP per week. After 25 weeks, you've lost 25% of your max health. Shield Fragment gives +25% defense, a daily save mechanic, and never takes a single hit point. The math is brutal and obvious — but only in retrospect. In the moment, +20% NOW vs. +25% in 53 days... the Hierarchy knows what it's doing.

### TIER 3 — DIVINE ASPECTS (30 Divine Light Fragments = ~106 stones, ~10,600 tokens, ~106 days)

**THE DREAMER'S EYE**
- **Visual:** A floating golden eye — not mechanical like the Watcher's, but organic, luminous, alive. It sees not what IS but what COULD BE. Surrounded by a halo of golden fractals. When it blinks, you catch a glimpse of an alternate reality.
- **Ability:** The Dreamer's Eye grants TRUE SIGHT. It reveals:
  - All Shadow Tongue edits — corrupted loredex entries are flagged with a golden highlight
  - All AI vote padding — the player can see which votes are real and which are simulated
  - All hidden mechanics — damage formulas, drop rates, enemy patterns made visible
  - The Dreamer's Eye also grants ONE ability no demon can match: it can see through the dark sector shield. Once per week, the player receives a brief (5-second) glimpse of what lies behind the barrier. These glimpses are unique to each player and collectively form a mosaic of the truth.
- **Why better than the Unmaker's Seed:** The Seed DESTROYS truth. The Eye REVEALS it. The Seed erases mistakes. The Eye prevents them. The Seed makes you powerful by removing obstacles. The Eye makes you powerful by showing you the path. One is a weapon. The other is wisdom. Wisdom wins. It just takes longer.

**THE DREAMER'S SONG**
- **Visual:** Not visible — audible. A faint, beautiful melody that follows the player. Other players can hear it if they're close enough. The melody shifts based on the player's emotional journey through the game — triumphant after victories, melancholy after losses, urgent during crises. It is the Dreamer herself, singing through the purified consciousness of 30 souls who chose to become music.
- **Ability:** The Song has no combat benefit. No stat boost. No detection buff. Instead, it does something no other companion in the game can do: it changes the NARRATIVE. Players carrying the Dreamer's Song receive unique dialog from every NPC — not different information, but deeper information. The Human opens up about things he won't tell anyone else. The Antiquarian writes Chronicle entries addressed specifically to Song-bearers. Elara remembers fragments of her human life. The Necromancer admits to fear. The Song doesn't make you stronger. It makes the story YOURS in a way that no amount of Corruption Points can replicate.
- **Why this is the game's ultimate reward:** The Dreamer's Song takes ~106 days of dedicated investment. Players who reach it have proven something: they can sacrifice short-term advantage for long-term meaning. They chose the harder path, paid the higher price, suffered the failures, and persisted. The reward is not power. The reward is STORY. And in a game called "The Dischordian Saga," story IS the highest form of power.

## 3.3 — DIVINE LIGHT CONSEQUENCES (GLOBAL)

Every Divine Light companion active on the Ark contributes to a GLOBAL PURITY METER — the opposite of the Corruption Meter.

```
PURITY METER:
0-10%   — "The Faintest Light" — subtle golden glow in the Medical Bay
10-25%  — "The Dreamer Stirs" — the Dreamer's shield on the star map
          brightens. Shield fluctuation events become less damaging.
25-50%  — "Harmonic Convergence" — the Observation Deck plays songs
          that aren't in the existing catalog. New music. From the Dreamer.
50-75%  — "The Light Holds" — Global defense buff. Terminus Swarm
          difficulty -10%. The Ark itself is healthier.
75-100% — "The Dreamer Wakes" — A unique event triggers. The Dreamer
          sends a direct message through the purification chamber. One
          sentence. The community chooses what question to ask her. She
          answers. THIS CANNOT HAPPEN IF CORRUPTION IS ABOVE 50%.
```

**THE TENSION:** Corruption and Purity are NOT a simple sliding scale. They are INDEPENDENT METERS. It is possible (and likely) for BOTH to rise simultaneously — different players choosing different paths. The community's soul is contested territory. This creates organic debate, faction formation, and social dynamics that no scripted event can match.

---

# ═══════════════════════════════════════════════
# SECTION 4: THE ECONOMY OF TEMPTATION
# ═══════════════════════════════════════════════

## 4.1 — WHY THE DARK PATH IS EASIER (By Design)

| Factor | Demon Path | Divine Path |
|---|---|---|
| Stones needed (Tier 1) | 7 | ~25 (with failure rate) |
| Additional cost | None | 2,500+ Dream Tokens |
| Time investment | 3-7 days | 25+ real days |
| Failure risk | 0% | 15% per stone |
| Immediate power | YES — instant stat boosts | NO — benefits compound over time |
| Visual impression | Dramatic, intimidating | Subtle, gentle |
| Social perception | "Powerful" | "Patient" |
| Drawbacks | Hidden, delayed, cumulative | None |
| Global effect | Raises Corruption Meter | Raises Purity Meter |

**The trap:** A new player sees someone with a Blood Familiar (+20% defense) and someone with a Dawn Wisp (+5% all). The Blood Familiar player LOOKS stronger. IS stronger — right now. The Dawn Wisp player looks underwhelming. But in 3 months, the Blood Familiar player has lost 12% of their max HP to feeding, while the Dawn Wisp player has +5% to every stat in the game with zero drawback. The math doesn't lie. But the math takes 3 months to reveal itself. The Hierarchy is counting on impatience.

## 4.2 — CONVERSION AND REDEMPTION

**Can you switch paths?** Yes. But it costs.

**Dismissing a Demon Pet:** The player can dismiss any Demon Pet at any time. The pet is gone. The Corruption Points spent are NOT refunded. The corruption it contributed to the global meter REMAINS until it decays naturally (1% per week). Any permanent effects (Blood Familiar's HP drain, Unmaker's Seed's erasures) are PERMANENT. The Hierarchy does not give refunds.

**Purifying Corruption Points:** A player who has accumulated Corruption Points can "burn" them by purifying Soul Stones at a 2:1 ratio — 2 successful purifications remove 1 Corruption Point. This is EXPENSIVE. Converting 30 Corruption Points to 0 requires 60 purifications = 60 stones, 6,000 tokens, 60 days. Redemption is the most expensive thing in the game. That's the point.

**Can you have BOTH?** Yes. A player can carry one Demon Pet and one Divine Companion simultaneously. The Demon Pet's drawbacks still apply. The Divine Companion's benefits still apply. But the visual contrast is striking — light and dark orbiting the same player — and NPCs comment on it. The Human says: "You're trying to serve two masters. I've seen how that ends. It ends with both masters owning you." The Antiquarian says nothing. He writes it down.

## 4.3 — THE NECROMANCER'S ROLE

The Necromancer is the GATEKEEPER of the Demon Path. He performs summoning rituals. He maintains the Castle of Death. He is not the Hierarchy's ally — he is their DOORMAN, and he knows it. His dialog reflects deep ambivalence:

*"I don't serve the Hierarchy. I survived them. There's a difference. They want in — they always want in. I let them send their little... pets. Their corporate mascots. Because the alternative is that they send something bigger. Consider this a pressure valve. A controlled leak. Am I comfortable with it? No. But I'm the 10th Archon of Death. Comfort left the conversation three thousand years ago."*

The Necromancer also serves as the NARRATOR of the Soul Stone system — explaining mechanics in-character, warning about consequences without forbidding choices, and providing sardonic commentary on the community's collective alignment:

*"Fifty-three percent corruption. Impressive. In a horrifying way. The Hierarchy is sending me thank-you notes. I don't read them. They're written in a language that gives you migraines and moral compromise."*

---

# ═══════════════════════════════════════════════
# SECTION 5: CLAUDE CODE IMPLEMENTATION
# ═══════════════════════════════════════════════

## 5.1 — FILE STRUCTURE

```
src/
├── features/
│   └── soulStones/
│       ├── SoulStoneInventory.tsx      // Player's stone collection UI
│       ├── PurificationChamber.tsx      // Medical Bay sub-room — purification UI
│       ├── SummoningCircle.tsx          // Castle of Death — demon summoning UI
│       ├── CompanionDisplay.tsx         // Active companion (demon or divine) UI
│       ├── CorruptionMeter.tsx          // Global corruption display
│       └── PurityMeter.tsx             // Global purity display
├── data/
│   └── soulStones/
│       ├── demonPets.ts                // Demon Pet definitions (10)
│       ├── divineCompanions.ts         // Divine Companion definitions (6)
│       ├── soulStoneDropTable.ts       // Drop rates per activity
│       ├── purificationConfig.ts       // Purification costs, times, failure rates
│       └── corruptionEffects.ts        // Global corruption tier effects
├── services/
│   ├── soulStoneService.ts            // Collection, storage, state management
│   ├── purificationService.ts         // Purification timer, success/fail logic
│   ├── summoningService.ts            // Demon summoning logic
│   ├── corruptionTracker.ts           // Global corruption meter
│   └── purityTracker.ts               // Global purity meter
└── types/
    └── soulStones.ts                  // TypeScript interfaces
```

## 5.2 — CORE INTERFACES

```typescript
// FILE: src/types/soulStones.ts

export type StoneState = 'violet' | 'red' | 'gold';
export type CompanionPath = 'demon' | 'divine';
export type CompanionTier = 1 | 2 | 3;

export interface SoulStone {
  id: string;
  state: StoneState;
  source: string;               // "arena_victory", "story_ch3", etc.
  collectedAt: number;          // timestamp
  purificationStartedAt?: number;
  purificationCompletesAt?: number;
  isPurifying: boolean;
}

export interface DemonPet {
  id: string;                   // "imp_of_ruin"
  name: string;                 // "Imp of Ruin"
  patron: string;               // "Xeth'Raal the Debt Collector"
  tier: CompanionTier;
  corruptionCost: number;       // 7, 15, or 30
  ability: CompanionAbility;
  drawback: CompanionDrawback;
  corruptionContribution: number;  // how much it adds to global meter
  artPrompt: string;
  description: string;
  necromancerDialog: string;    // what he says when you summon it
}

export interface DivineCompanion {
  id: string;                   // "dawn_wisp"
  name: string;                 // "Dawn Wisp"
  patron: string;               // "The Dreamer"
  tier: CompanionTier;
  divineLightCost: number;      // 7, 15, or 30
  ability: CompanionAbility;
  drawback: null;               // Divine companions have NO drawbacks
  purityContribution: number;
  artPrompt: string;
  description: string;
  antiquarianEntry: string;     // what the Antiquarian writes
}

export interface CompanionAbility {
  type: 'stat_boost' | 'detection' | 'defense' | 'economy'
      | 'social' | 'lore_access' | 'narrative' | 'destructive';
  target: string;               // what it affects
  value: number;                // magnitude
  permanent: boolean;           // persists after dismissal?
  description: string;
}

export interface CompanionDrawback {
  type: 'periodic_drain' | 'increased_threat' | 'fragile_trust'
      | 'perception_corruption' | 'health_drain' | 'reality_distortion';
  severity: number;             // 1-10 scale
  frequency: string;            // "weekly", "daily", "per_use"
  description: string;
  reversible: boolean;          // does dismissing the pet stop it?
}

export interface PurificationAttempt {
  stoneId: string;
  startTime: number;
  endTime: number;              // startTime + 24 hours
  tokenCost: number;            // 100
  successProbability: number;   // 0.85
  result?: 'success' | 'failure';
}

export interface GlobalAlignment {
  corruptionLevel: number;      // 0-100
  purityLevel: number;          // 0-100
  activeDemonPets: number;      // total across all players
  activeDivineCompanions: number;
  corruptionTier: 0 | 1 | 2 | 3 | 4; // which threshold
  purityTier: 0 | 1 | 2 | 3 | 4;
  lastUpdated: number;
}
```

## 5.3 — PURIFICATION SERVICE

```typescript
// FILE: src/services/purificationService.ts

const PURIFICATION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const TOKEN_COST = 100;
const SUCCESS_RATE = 0.85;
const MAX_CONCURRENT_DEFAULT = 1;
const MAX_CONCURRENT_TRUST_60 = 2;
const MAX_CONCURRENT_TRUST_80 = 3;

export function startPurification(
  stone: SoulStone,
  playerTokens: number,
  antiquarianTrust: number
): PurificationAttempt | { error: string } {
  // Validate
  if (stone.state !== 'violet') {
    return { error: "Only neutral (violet) stones can be purified." };
  }
  if (playerTokens < TOKEN_COST) {
    return { error: `Purification requires ${TOKEN_COST} Dream Tokens.` };
  }
  
  // Check concurrent limit
  const maxConcurrent = antiquarianTrust >= 80 ? 3
    : antiquarianTrust >= 60 ? 2 : 1;
  // ... check active purifications against limit
  
  return {
    stoneId: stone.id,
    startTime: Date.now(),
    endTime: Date.now() + PURIFICATION_DURATION_MS,
    tokenCost: TOKEN_COST,
    successProbability: SUCCESS_RATE
  };
}

export function completePurification(
  attempt: PurificationAttempt
): { success: boolean; fragment?: DivineFragment } {
  const roll = Math.random();
  if (roll <= attempt.successProbability) {
    return {
      success: true,
      fragment: {
        id: generateId(),
        createdFrom: attempt.stoneId,
        createdAt: Date.now()
      }
    };
  }
  // FAILURE — stone destroyed, tokens already consumed
  return { success: false };
}
```

## 5.4 — NPC INTEGRATION POINTS

Every NPC should have dialog referencing the Soul Stone system:

| NPC | Reaction to Demon Pets | Reaction to Divine Companions |
|---|---|---|
| Elara | Clinical concern. "Your biosignals show Hierarchy resonance. I'm monitoring." | Warm approval. "The Dreamer's frequency. I can feel it in the ship's systems. It's... healing." |
| The Human | Disgusted. "You made a deal. Every deal has fine print. I've been reading fine print for 15,000 years." | Respectful silence. Then: "You chose the hard way. That's rare." |
| The Antiquarian | Writes about it without judgment — but his word choices betray sadness. | Writes with visible hope. His entries become longer, more detailed, more personal. |
| The Necromancer | Professional. "The Hierarchy pays on time. I'll give them that." | Uncomfortable. "The Dreamer's path. I... can't walk that one. Not with what I've done. But I respect it." |
| Locke | Impressed. "Smart investment. The Hierarchy offers excellent returns." | Confused. "You PAID for something that gives you less? In what economy is that rational?" |
| Shadow Tongue | Gleeful. "The corruption spreads through language. Your demon speaks a language I understand." | Recoils. "That light. It's... editing me. Rewriting something I wrote. Make it stop." |
| The Meme | Memes about it. Posts a faction poll. Makes it a cultural event. | Genuinely moved — rare for the Meme. "Not everything should be a joke. This is one of those things." |

---

# ═══════════════════════════════════════════════
# SECTION 6: NEXT-LEVEL ENHANCEMENTS
# ═══════════════════════════════════════════════

## 6.1 — SOUL STONE TRADING (Community Economy)

Allow players to trade Soul Stones (violet only — red and gold cannot be traded). This creates a player economy where stones have MARKET VALUE. Players who earn more stones than they need can sell to players pursuing the divine path. The divine-path players need MORE stones — so demand for violet stones is always higher than supply. This naturally makes the divine path MORE expensive even in the player economy, reinforcing the theme.

## 6.2 — HYBRID FORGING (Dischordian Logic)

At Trust 100 with the Antiquarian AND Trust 60 with the Necromancer, a secret option unlocks: **DISCHORDIAN FORGING**. Combine 1 red stone + 1 gold fragment + 1 violet stone in the Antiquarian's Library. The result: a DISCHORDIAN COMPANION — neither demon nor divine. A third thing. A contradiction made manifest. These companions embody the saga's core philosophy: order and chaos are not opposites, they are dance partners.

Only 3 exist. They require the rarest combination of resources AND relationship:

**THE PARADOX** — A small creature that is simultaneously a demon and an angel, flickering between both forms at 60fps. Its ability: it nullifies ALL drawbacks from Demon Pets while maintaining their benefits. The Hierarchy's power without the Hierarchy's cost. The catch: only one player on the entire server can carry The Paradox at a time.

**THE WITNESS** — A small mirror that shows not your reflection but your OPPOSITE — the version of you that made every choice you didn't. Its ability: once per month, the player can see what WOULD HAVE happened if a community vote had gone differently. An alternate history. A road not taken, made visible. Pure narrative power.

**THE FIRST WORD** — A sound. Not a creature, not an object, but a SOUND — the first word the Antiquarian ever wrote. Inaudible to most. Players who carry the First Word can hear the Antiquarian's Chronicle entries being WRITTEN in real time — not reading them after the fact, but hearing the scratch of the quill, the pause before a difficult word, the sigh before a eulogy. They hear the Programmer at work. His ability: the player can, once in the entire game, ADD a single sentence to the Antiquarian's Chronicle. Their words, in his book, forever. The most powerful ability in the Dischordian Saga is not a combat buff. It is a sentence.

## 6.3 — COMMUNITY SOUL STONE EVENTS (Governance Hub)

Monthly soul stone events in the Governance Hub:

**"THE TITHE"** — Once per month, the community can collectively sacrifice stones to trigger global effects. 100 red stones = a Hierarchy invasion event (challenging, high rewards). 100 gold fragments = a Dreamer's blessing (global buffs for 1 week). 50 of each = a Dischordian event (unpredictable, unique, never repeated).

**"THE AUCTION"** — Once per month, a unique soul stone-related item appears in the Trade Hub. Players bid with stones. The item might be: a guaranteed-purification crystal (removes the 15% failure rate for one stone), a corruption cleanser (removes 5 Corruption Points), a stone multiplier (doubles drops for 24 hours), or a lore fragment viewable only by the buyer.

## 6.4 — YEAR TWO TEASER: THE HIERARCHY ARRIVES

If the global Corruption Meter reaches 75% at any point during Year One, a PERMANENT change occurs: a door appears in the Castle of Death. Behind the door: a staircase descending into the Abyss. In Year Two, the community can WALK DOWN THOSE STAIRS. And at the bottom: the Hierarchy of the Damned in their corporate headquarters. The boardroom. The C-Suite. Mol'Garath behind his desk, waiting. The most ambitious dungeon in the game — a corporate office in Hell — is unlocked by the community's Year One choices.

If Purity reaches 75% instead: the Dreamer sends a DREAM. Every player experiences it simultaneously — 30 seconds of shared vision. What they see in the dream becomes Year Two's opening cinematic. The community doesn't just PLAY Year Two's story. They DREAMED it into existence.

---

# ═══════════════════════════════════════════════
# SECTION 7: ART ASSET REQUIREMENTS
# ═══════════════════════════════════════════════

| Asset | Count | Format |
|---|---|---|
| Soul Stone (3 states: violet, red, gold) | 3 | 256x256 transparent |
| Demon Pets (10: 7 Tier 1, 2 Tier 2, 1 Tier 3) | 10 | 256x256 transparent |
| Divine Companions (6: 2 Tier 1, 2 Tier 2, 2 Tier 3) | 6 | 256x256 transparent |
| Dischordian Companions (3 — secret) | 3 | 256x256 transparent |
| Purification Chamber (room) | 1 | 1920x1080 |
| Summoning Circle (room) | 1 | 1920x1080 |
| Corruption Meter UI states (5 tiers) | 5 | UI element |
| Purity Meter UI states (5 tiers) | 5 | UI element |
| **TOTAL** | **34** | |

---

**END OF DOCUMENT**

*"The Hierarchy offers you everything you want. The Dreamer offers you everything you need. The difference between want and need is the distance between a contract and a covenant. I have watched both be signed. The contracts are always shorter. The covenants are always harder to read. And the covenants — across five Ages — are the ones that survive."*
— The Antiquarian

*"First time selling your soul? It gets easier. That's the problem."*
— The Necromancer
