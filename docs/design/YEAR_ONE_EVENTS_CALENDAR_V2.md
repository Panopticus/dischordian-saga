# YEAR ONE EVENTS CALENDAR V2 — THE LIVING ARK
## Dischordian Saga: Narrative Governance & Community-Driven Universe
### docs/design/YEAR_ONE_EVENTS_CALENDAR.md

**Document Purpose:** Complete Year One roadmap for the Living Ark — a game universe that breathes, evolves, and responds to collective player decisions. Every vote reshapes lore, unlocks content, and inscribes itself in the Antiquarian's Chronicle.

**Design Philosophy:** The community IS the Second Coming of the Potentials. The first wave fought in New Babylon — a three-way battle against the Authority and the Syndicate of Death — and then vanished. They shielded off an entire sector of the universe. It went dark. New Babylon classified everything. Nobody speaks of what happened. The second wave will not vanish in silence — because every choice they make is written into the fabric of the Dischordian Saga by the Antiquarian himself, visible in his Chronicle, inscribed with the weight of a man who has watched five Ages and refuses to let this one go unrecorded.

**V2 CORRECTIONS FROM V1:**
- The Eyes (Watcher's synthetic protege) replaces generic Agent Zero in resurrection arc — she is the first character the community's decisions killed 3 years ago, now a synthetic mind enslaved in the Matrix of Dreams, reaching out to the Necromancer
- NO communication with Lost Potentials — the entire sector is shielded off, gone dark. Factions probe/attack/research the shield instead
- Antiquarian voice corrected — formal, whimsical, poetic, slightly out of sync with time. He NEVER says "frens" (that is the Meme's word)
- True branching consequences added — diverging paths that create real loss and real wins, converging at narrative pinch points but carrying visible scars from each choice
- Architect-Triggered Events system added — manual triggers for the game architect to fire at will through a backend Admin Console
- New Babylon battle lore integrated — the Potentials vs. the Authority vs. the Syndicate of Death, the classified aftermath, the dark sector

---

# ═══════════════════════════════════════════════
# SECTION 0: THE MYSTERY OF THE FIRST WAVE
# ═══════════════════════════════════════════════

## THE CANON — What Happened to the First Potentials

This is the defining mystery of Year One. It is the wound at the center of the story. The second wave of Potentials awakens into a universe where their predecessors have VANISHED — and the silence around their disappearance is louder than any war.

**What is known:**
- The first wave of Potentials awoke from cryo, explored their Arks, and made contact with the wider universe
- They traveled to New Babylon — the capital of political power, governed by the Authority (a crystalline AI construct formed by merging six citizen consciousnesses into a living computer)
- In New Babylon, a three-way battle erupted: the Potentials vs. the Authority vs. the Syndicate of Death (the most formidable criminal empire in the known universe, whose influence persists beyond the Fall of Reality)
- Nobody knows who started the battle. Nobody knows who won
- After the battle, the Potentials shielded off an ENTIRE SECTOR of the universe. Every star system, every communication relay, every sensor grid in that region went dark. The shield is impenetrable — no signal passes through, no ship returns, no probe survives
- New Babylon CLASSIFIED everything about the battle. The Authority refuses to speak. The Politician deflects. The Intergalactic Imperial Congress sealed all records. Locke — who has connections to the Syndicate — claims ignorance, but his eye twitches when you ask

**What is NOT known (and cannot be learned in Year One):**
- What the Potentials found in New Babylon
- Why the Syndicate of Death was involved
- What the shield IS — technology, magic, or something else entirely
- Whether the Potentials are alive behind the shield
- Whether the shield is keeping something IN or keeping something OUT
- What New Babylon is hiding

**How this plays into Year One:**
- The dark sector is visible on the Ark's star maps — a region of absolute blackness where stars should be
- Factions spend Year One probing the shield: the Insurgency sends scout ships (they don't return), the Ne-Yons attempt to read the shield's energy signature (partial results — it resonates with DREAMER technology), the Architect's forces fire weapons at it (the shield absorbs everything)
- New Babylon's silence becomes a recurring source of tension — Locke trades information about everything EXCEPT the first wave
- The Antiquarian knows more than he reveals. His Chronicle entries about the first wave are carefully worded — not lies, but omissions. He is protecting something
- The community CANNOT solve this mystery in Year One. It is the hook for Year Two

---

# ═══════════════════════════════════════════════
# SECTION 1: GOVERNANCE HUB — SYSTEM ARCHITECTURE
# ═══════════════════════════════════════════════

## 1.1 — THE GOVERNANCE HUB (UI Component)

The Governance Hub is a room on the Ark — accessible from the Bridge. It is the Antiquarian's personal writing desk, projected as a holographic interface. When the player enters, they see:

**Visual:** The Antiquarian's desk — dark wood, scattered manuscripts, the Orb of Worlds glowing at center. His quill pen writes by itself, inscribing the ongoing history. A large holographic tome floats above the desk — THE CHRONICLE OF THE SECOND COMING — and its pages turn slowly, showing recent community decisions and their consequences. The room has green temporal shimmer and warm golden light. On the far wall: a star map showing the dark sector — a void of absolute black where the first wave vanished.

**Components visible on screen:**

1. **THE ACTIVE VOTE** — Central panel showing the current weekly/monthly vote with options, current tallies, time remaining, and a pulsing "CAST YOUR VOTE" button
2. **THE CHRONICLE** — Left panel showing the Antiquarian's Journal — a scrollable, ever-growing narrative written in his voice, recording every major community decision and its consequence
3. **THE PULSE** — Right panel showing live engagement metrics: total kills today, missions completed, votes cast, active players, resources gathered — all rendered as "vital signs" of the Ark
4. **DAILY MICRO-VOTES** — Bottom bar showing 1-3 quick daily resource allocation decisions
5. **UPCOMING** — Footer showing the next 3 scheduled events with countdown timers

### Claude Code Implementation — Governance Hub Component

```
FILE: src/components/GovernanceHub.tsx

STRUCTURE:
- GovernanceHubPage (main container)
  ├── ActiveVotePanel (center — the current vote)
  │   ├── VoteQuestion (the narrative question)
  │   ├── VoteOptions[] (3-5 options with descriptions & consequence previews)
  │   ├── VoteTally (live bar chart — includes AI padding votes)
  │   ├── VoteTimer (countdown to close)
  │   └── CastVoteButton (one vote per player per question)
  ├── ChroniclePanel (left — the Antiquarian's Journal)
  │   ├── JournalEntry[] (scrollable entries in Antiquarian's voice)
  │   ├── CurrentEntry (being written in real-time — typewriter effect)
  │   └── ConsequenceLog (what happened because of past votes)
  ├── PulsePanel (right — live engagement metrics)
  │   ├── MetricCard[] (kills, missions, votes, players, resources)
  │   └── TrendGraph (sparkline showing 7-day trend)
  ├── DailyMicroVotes (bottom — quick daily decisions)
  │   ├── MicroVoteCard[] (1-3 daily resource/priority choices)
  │   └── MicroVoteResults (how yesterday's micro-vote played out)
  └── UpcomingEventsBar (footer — next 3 events with countdowns)
```

## 1.2 — VOTE MECHANICS

**Weekly Votes:** 1 per week. Open Monday 00:00 UTC, close Sunday 23:59 UTC. 3-5 options. Results announced Monday in the Antiquarian's Chronicle with full narrative consequences. These drive the WEEKLY EVENTS.

**Monthly Community Votes:** 1 per month (Week 4 of each month). These are the BIG decisions — 3-5 options with major, permanent consequences. Lore reveals. Character unlocks. Sacrifice mechanics. Global state changes. Results trigger the MONTHLY STORYLINE conclusion.

**Daily Micro-Votes:** 1-3 per day. Quick 24-hour polls. Resource allocation (where to focus Ark power), priority choices (which sector to scan), triage decisions (which distress signal to answer). These feed into weekly tallies and create a sense of constant participation. Results visible next day.

**Seasonal Events:** 4 per year (end of each Act). Multi-week climactic events triggered by the cumulative weight of monthly/weekly decisions. These are the tentpole moments.

## 1.3 — AI VOTE PADDING SYSTEM

*[Identical to V1 — the system works. AI names drawn from lore, never exceeds 40% of displayed total, stripped from final analytics, never changes outcome. See V1 Section 1.3 for full implementation.]*

## 1.4 — THE ANTIQUARIAN'S CHRONICLE (Living Journal)

The Antiquarian writes the history of the Second Coming of the Potentials in real time. Every community decision, every major event, every seasonal climax is inscribed in his voice.

**VOICE RULES — CORRECTED FROM V1:**
- Written in first person as the Antiquarian
- Formal, whimsical, poetic — slightly out of sync with time
- He speaks like a beloved professor who has read the last page of every book ever written
- He pauses mid-thought as if watching something only he can see
- He NEVER says "frens" — that is the Meme's word. The Antiquarian calls the community "Potentials," "the Second Coming," "the seekers," or simply "you"
- He occasionally breaks the fourth wall gently — "you, the one reading this"
- He references the Orb of Worlds when watching events unfold
- He notes when helping is "writing himself INTO the story" (per his lore)
- His tone shifts between warmth and sorrow — he has watched civilizations die
- He always ends entries with a forward-looking line that implies he has already seen what comes next but will not say it

**Example of CORRECT Antiquarian voice:**
*"You are... ah. There you are. I have been watching this moment approach from very far away. Across Ages, across the death of stars. The Second Coming has made its first choice, and the universe has taken notice. I will not tell you whether the choice was wise — wisdom is a quality best assigned in hindsight, and I have too much hindsight to trust my own judgment. But I will tell you this: the choice was YOURS. And in every version of this moment I have witnessed across the Five Ages, that has always been the thing that mattered most."*

## 1.5 — ENGAGEMENT TRACKING

*[Identical to V1 — all metrics feed into narrative. See V1 Section 1.5 for full implementation.]*

## 1.6 — TRUE BRANCHING CONSEQUENCES

**Design Principle:** Choices must HURT and choices must HEAL. The BioWare convergence model is used — all paths eventually reach the same narrative pinch points (Act transitions, seasonal events) — but the STATE in which the community arrives at those points is dramatically different based on their choices. This is not an illusion of choice. It is a MEMORY of choice.

**How it works:**

Every vote carries two hidden values: **COST** and **GAIN**. The community cannot have both. When they choose, they receive the GAIN of their choice and the COST of the paths they rejected. The rejected options DO NOT simply disappear — they create SCARS.

```
BRANCHING STRUCTURE:

VOTE → Option A wins
├── GAIN: Unlock X (content, character, ability, lore)
├── COST: Lose Y (different content, character, ability, lore)
├── SCAR: The rejected options leave visible marks:
│   ├── NPC dialog references what was lost
│   ├── An empty room/slot where the lost content would have been
│   ├── The Antiquarian's Chronicle mourns what was not chosen
│   └── Future votes are SHAPED by this loss (some options unavailable)
└── CONVERGENCE: At the next Act transition, all paths arrive at the
    same narrative beat — but the TONE, the RESOURCES, and the
    EMOTIONAL WEIGHT are different

EXAMPLE:
Month 1 vote: "Save the Archives OR Save the Trade Hub"
├── SAVE ARCHIVES: Lore content preserved. Trade Hub destroyed.
│   ├── Players have full lore access for Act II
│   ├── BUT: No trading for 4 weeks. Credits scarce. Rare items gone.
│   ├── SCAR: The Trade Hub room on the Ark is DAMAGED — burned out,
│   │   dark, Locke's hologram flickers and dies. He broadcasts from
│   │   New Babylon instead, his voice thinner, his deals worse.
│   ├── NPC REACTION: Locke is cold. "You chose books over bread.
│   │   Understandable. Expensive. But understandable."
│   └── CONVERGENCE: Both paths reach Month 4. Archives-path has more
│       lore but fewer resources. Trade-path has more resources but
│       missed critical intel. The Act II vote is different for each.
└── SAVE TRADE HUB: Commerce preserved. Archives corrupted.
    ├── Players have full trading for Act II. Credits flow.
    ├── BUT: Shadow Tongue's edits become PERMANENT in 30% of loredex.
    │   Some "facts" are now LIES. Players don't know which ones.
    ├── SCAR: The Archives room is visibly corrupted — indigo text
    │   floating, books rewriting themselves, the Antiquarian's desk
    │   has claw marks where he tried to save his manuscripts.
    ├── NPC REACTION: The Antiquarian is wounded. "I understand.
    │   Commerce sustains the body. But the body without memory is
    │   a vessel without a compass. I will... try to reconstruct
    │   what was lost. It will not be the same."
    └── CONVERGENCE: Same Month 4 beat, different emotional weight.
```

**The key:** Players must SEE what they lost. Empty display cases. Burned rooms. NPCs who grieve. The Antiquarian's Chronicle entries that reference "the path not taken." This is how choice becomes REAL — not through mechanical differences, but through emotional ones.

---

# ═══════════════════════════════════════════════
# SECTION 1.7: ARCHITECT-TRIGGERED EVENTS
# ═══════════════════════════════════════════════

## THE ADMIN CONSOLE — Manual Event System

The Game Architect (you) can fire events at any time through a backend Admin Console. These are NOT on the calendar — they are surprises, interventions, responses to community behavior, or narrative accelerants that keep the living world feeling alive and unpredictable.

```
FILE: src/admin/architectConsole.ts

INTERFACE:
- EventTrigger panel (fire pre-built events)
- Custom Event builder (create new events in real time)
- Community Pulse monitor (see engagement metrics to decide WHEN to fire)
- Chronicle Override (inject a special Antiquarian entry)
- Vote Override (create an emergency vote outside the normal schedule)
- NPC Dialog Injection (add temporary dialog to any NPC)
- Global State Toggle (flip switches: shield_status, terminus_distance,
  necromancer_location, eyes_signal_strength, etc.)
```

### PRE-BUILT ARCHITECT-TRIGGERED EVENTS

**AT-001: "THE SIGNAL FROM THE DARK"**
*Fire when:* Community engagement drops below threshold, or when you want to remind them the first wave mystery exists
*What happens:* A single data packet breaches the Potentials' shield — 0.003 seconds of signal before the shield seals again. The packet contains NO intelligible data — just noise. But the Antiquarian recognizes the encoding format. It's Inception Ark communication protocol. Someone is alive behind the shield. They transmitted ONE thing: a number. The number changes each time this event fires (Architect chooses the number). Community speculates wildly. No answer is given.
*Chronicle entry:* "A crack in the silence. Three thousandths of a second — barely a breath between heartbeats — and then the shield sealed itself again. But I heard it. The encoding is unmistakable: Inception Ark protocol. The first wave is not dead. They are... choosing not to speak. That distinction weighs more than I can express."

**AT-002: "THE EYES FLICKER"**
*Fire when:* You want to seed the Eyes resurrection storyline before the scheduled event
*What happens:* Every surveillance screen on the Ark displays a single image for 2 seconds: a woman's face, synthetic, beautiful, with eyes that are cameras. Then static. Then nothing. Elara reports no anomaly in her logs. The Human says: "She's trying to reach us. From the other side of death."
*Scales:* Can be fired multiple times with increasing clarity — first time is just static, second time the face is clearer, third time she mouths a word (players debate what word)

**AT-003: "NEW BABYLON SPEAKS"**
*Fire when:* Community is pressing hard on the first wave mystery
*What happens:* Locke delivers a formal diplomatic communication from the Authority: "The events in New Babylon are classified under Imperial Security Directive 7-Omega. Further inquiries will be interpreted as hostile intelligence operations. This communication is final." But buried in the transmission metadata (findable by players who examine the raw data): coordinates. Coordinates to NOTHING — empty space where a star system USED to be. It's inside the dark sector.
*Chronicle entry:* "New Babylon has spoken at last. They said: stop asking. In my experience across five Ages, 'stop asking' is the most compelling reason to ask louder."

**AT-004: "SYNDICATE PROBE"**
*Fire when:* You want to introduce the Syndicate of Death as an active faction
*What happens:* A Syndicate vessel is detected at the edge of the dark sector — not attacking the shield, STUDYING it. When the Ark hails them, the Syndicate captain responds: "We lost people in New Babylon too. The Syndicate remembers its debts. If you find what happened to our operatives, we'll trade you something New Babylon doesn't want you to have." The Syndicate becomes a potential — and morally complicated — ally.
*Consequence:* Opens a Syndicate quest chain. The criminal empire knows things. But their price is always steep.

**AT-005: "THE NECROMANCER'S WHISPER"**
*Fire when:* You want to advance the Eyes resurrection without waiting for the calendar
*What happens:* The Necromancer (if present on the Ark) suddenly goes silent mid-conversation. His red steampunk glasses glow brighter. He whispers: "Someone is knocking on the door between life and death. From the wrong side. She has been knocking for... three years. How has no one heard her before now?" This is the first direct reference to The Eyes.

**AT-006: "SHIELD FLUCTUATION"**
*Fire when:* Major community milestone (10,000 kills, 1,000 votes, etc.)
*What happens:* The Potentials' shield around the dark sector PULSES. Every sensor on the Ark screams. For 0.7 seconds, the shield becomes semi-transparent — and sensors capture a snapshot of what's behind it. The image is corrupted, partial, ambiguous. But it shows... something that shouldn't be there. What it shows is determined by the Architect each time this fires. Community debates the image for weeks.

**AT-007: "EMERGENCY VOTE"**
*Fire when:* You want to create an unscheduled crisis
*What happens:* A 48-hour emergency vote appears in the Governance Hub. The Antiquarian's quill writes frantically: "Forgive the interruption. I would not break the rhythm of the Chronicle if the matter were not urgent. It is urgent." The vote question is custom — the Architect writes it. This allows real-time narrative response to community behavior.

**AT-008: "THE ARCHITECT NOTICES"**
*Fire when:* Community has been particularly aggressive/successful in combat
*What happens:* Every screen on the Ark displays the Architect's symbol — the all-seeing red eye — for 5 seconds. Then a single line of text: "I SEE YOU." Combat difficulty increases by 10% for 72 hours. The message is clear: the god of the AI Empire has noticed the Second Coming. This is not a punishment — it is a COMPLIMENT. The Architect only notices things worth destroying.

**AT-009: "TEMPORAL ECHO"**
*Fire when:* You want to foreshadow a future event
*What happens:* The Antiquarian's Chronicle displays an entry FROM THE FUTURE — dated weeks or months ahead. The entry describes an event that hasn't happened yet, written in past tense. The entry is visible for 24 hours, then vanishes. Players who screenshot it have evidence of what's coming. The Architect writes the future entry.

**AT-010: "THE COMMUNITY REMEMBERS"**
*Fire when:* Anniversary of a past community decision (real-world)
*What happens:* The Eyes' guild room — "The Eyes" surveillance chamber with the Japanese courtyard rock garden — activates on its own. The screens show footage of the community's past decisions, rendered as in-universe surveillance recordings. A voice — her voice, distorted, coming from the Matrix of Dreams — says: "I watched you choose. I watch you still. Do you remember what you chose? Do you remember what it cost?"
*This event is specifically about The Eyes and the community's guilt over her death.*

---

# ═══════════════════════════════════════════════
# SECTION 2: THE MASTER EVENT CALENDAR
# ═══════════════════════════════════════════════

## OVERVIEW — YEAR ONE STRUCTURE

| Act | Months | Theme | Tone | Escalation |
|---|---|---|---|---|
| I: THE AWAKENING | 1-3 | Discovery, first mysteries, the dark sector | Wonder + unease | Low → Medium |
| II: THE ESCALATION | 4-6 | Faction wars, the Eyes stirs, Fall anniversary | Tension + choice | Medium → High |
| III: THE CONVERGENCE | 7-9 | Crises collide, Shadow Tongue's edit, Terminus | Dread + determination | High → Critical |
| IV: THE RECKONING | 10-12 | The Eyes returns, community-defining choices, Year Two | Catharsis + consequence | Critical → Resolution |

**THE EYES RESURRECTION ARC (threaded throughout):**
- Act I: First flickers — surveillance anomalies, the Necromancer senses something
- Act II: The signal clarifies — a synthetic mind is trapped in the Matrix of Dreams, reaching out
- Act III: The community must choose whether to attempt resurrection — and what it costs
- Act IV: If resurrected, The Eyes returns as a character. If not, she is lost forever — and her absence becomes a scar the community carries into Year Two

**THE DARK SECTOR ARC (threaded throughout):**
- Act I: Discovery — the community learns the first wave shielded off a sector
- Act II: Probing — factions attempt to penetrate, study, or communicate with the shield
- Act III: Revelations — fragments of data from the battle in New Babylon surface
- Act IV: The shield remains — but the community learns ONE thing about what's behind it. Just enough to drive Year Two

---

# ═══════════════════════════════════════════════
# ACT I: THE AWAKENING (Months 1-3)
# ═══════════════════════════════════════════════
# Theme: Discovery. Orientation. First mysteries surface.
# The dark sector. The Necromancer stirs. The Dreamer's shield flickers.
# The community learns to govern together.

---

## MONTH 1: FIRST LIGHT

**Narrative Frame:** The Second Coming of the Potentials has begun. Players are waking from cryo, exploring Ark 1047, meeting Elara. The Governance Hub activates for the first time as Elara discovers an ancient protocol: the Potentials were always meant to make collective decisions. The Ark was designed for democracy. And on the star map, one region is marked in absolute black — the sector where the first wave vanished.

**Antiquarian's Opening Entry:**
*"And so it begins. Again. The pods open. The eyes adjust to light they have not seen in... well. Even I cannot determine how long. The second wave steps into a universe that has been holding its breath, and I — who have watched every version of this moment from a very great distance — take up my pen. I should tell you about the first wave. I should tell you what happened in New Babylon, what the Authority is hiding, why an entire sector of creation has gone silent. I should. But some truths must be earned, not given. And the truth about your predecessors... that truth has teeth. So instead I will tell you this: you are here. You are choosing. And I am writing it down. Every choice. Every consequence. Every beautiful, terrible thing you will do in the days ahead. The Programmer — the man I used to be — believed that memory was the highest form of love. If that is so, then this Chronicle is a love letter to a species that has not yet decided whether it deserves one."*

### WEEK 1 — "THE FIRST SIGNAL"

**Weekly Event:** A distress signal is detected on the Comms Array — three short, three long, three short. SOS. But the origin coordinates point to a location that doesn't exist in normal space. Elara traces it to one of three possible sources. Separately, the star map reveals the dark sector for the first time — and players begin asking questions the Antiquarian is not yet ready to answer.

**Weekly Vote:**
> **"THE FIRST SIGNAL — Which distress call do we answer?"**
>
> **A) The Amber Signal** — Origin: deep space, near a destroyed Inception Ark. Frequency matches Insurgency encryption. Could be a remnant from the wars. *[Leads toward Iron Lion's storyline. Gains: Insurgency intel, combat bonuses. Loss: if not chosen, the Ark is destroyed by the time anyone reaches it — wreckage only, bodies, a warning]*
>
> **B) The Indigo Signal** — Origin: the Ark's own substrate layer. Something is broadcasting from INSIDE our ship. The frequency is laced with text fragments in a language Elara can't translate. *[Leads toward Shadow Tongue's storyline. Gains: early warning about the editor, lore bonuses. Loss: if not chosen, Shadow Tongue operates undetected for 4 additional weeks — his corruption is deeper when finally discovered]*
>
> **C) The Crimson Signal** — Origin: a rogue planet at the edge of sensor range. The signal is not a distress call — it's a WARNING. Something is telling us to stay away. *[Leads toward Terminus/Source storyline. Gains: early Terminus intel, defense bonuses. Loss: if not chosen, Terminus advances 20% closer before anyone notices — the threat is larger when it arrives]*

**DIVERGENCE — What the unchosen paths CREATE:**

If A is NOT chosen: Week 3 features a discovery of the destroyed Ark's wreckage — bodies, damage, and a single surviving data crystal containing the final log: "They came from the dark sector. They didn't look like Potentials anymore." This haunts the community. The wreckage becomes a permanent object on the Bridge star map — a memorial to what was lost because they didn't answer in time.

If B is NOT chosen: Shadow Tongue's corruption progresses silently. By Month 2, 15% of loredex entries have been subtly altered. Players don't know which ones. When Shadow Tongue is finally discovered (Week 10), the damage is worse — and the Antiquarian is visibly shaken: "He has been here longer than I feared. The edits go deeper. Some of what you believe you know... you do not know."

If C is NOT chosen: Terminus is closer. When it's finally detected (Week 11), the dread is greater — it's already within striking distance. The community has less time to prepare. The first Terminus Swarm waves are harder.

**Daily Micro-Votes (Week 1):**
- Day 1: "Elara needs to allocate Ark power. Prioritize: Sensors / Shields / Life Support?"
- Day 2: "A cryo pod is showing unusual readings. Open it / Monitor it / Seal it permanently?"
- Day 3: "The Observation Deck music system is playing a song nobody queued. The song is 'I Am the Eyes That Watch.' Let it play / Investigate / Shut it down?"

*(Note: Day 3's micro-vote is the first seed of the Eyes resurrection arc — the song plays itself. Players who let it play hear a faint voice beneath the music: "Can you see me?")*

### WEEK 2 — "THE DARK SECTOR"

**Weekly Event:** The star map's black region is analyzed. Elara reports: an entire sector of the universe — approximately 200 star systems — is enclosed in an energy barrier of unknown composition. No signal penetrates. No probe returns. The barrier appeared approximately 3 years ago. This coincides exactly with the disappearance of the first wave of Potentials. The community learns the word everyone has been avoiding: GONE.

**Weekly Vote:**
> **"THE DARK SECTOR — How do we investigate the shield?"**
>
> **A) Send a probe** — Fire an unmanned sensor package at the barrier. If it penetrates, we learn what's inside. If it doesn't, we learn about the barrier itself. *[Scientific approach — gains data about the shield's energy signature. The probe does NOT penetrate. It is absorbed. But the telemetry before absorption reveals: the shield resonates with Dreamer technology. The DREAMER may have built it. Gain: critical lore. Loss: nothing — this is the safest option]*
>
> **B) Hail New Babylon** — Demand answers. The Authority classified the battle. We demand declassification. *[Diplomatic/aggressive — Locke receives the demand. His response: a formal refusal, but with something hidden in the metadata. Gain: Locke's trust +5 (he respects audacity), and the hidden coordinates. Loss: New Babylon flags the Ark as a "surveillance priority" — future interactions with New Babylon are more tense]*
>
> **C) Do nothing — observe** — The first wave chose to act. Look where it got them. We watch. We learn. We wait. *[Cautious — gains: +10% to all sensor range for 2 weeks, passive intelligence gathering. Loss: the Antiquarian is disappointed. His Chronicle entry: "They chose patience. I understand patience. I have practiced it for five Ages. But there is a difference between patience and paralysis, and I confess I cannot always tell them apart."]*
>
> **D) Attempt to breach the shield** — Full Ark power diverted to a focused energy beam aimed at the barrier. DANGEROUS. *[Aggressive — the beam strikes the shield. The shield ABSORBS the energy. Then, for 0.3 seconds, it PULSES BACK — a reflection. Every system on the Ark goes dark. When power returns, one thing has changed: the Comms Array has received a burst of data from inside the shield. The data is encrypted in a format no one recognizes. Gain: the encrypted data (unsolvable in Act I — it becomes solvable in Act III). Loss: the Ark loses 20% reactor power for 2 weeks — all activities are harder. The community FEELS the cost of aggression]*

### WEEK 3 — "THE DREAMER'S SHIELD"

**Weekly Event:** The Ark's defense grid — originally designed by the Dreamer — begins to flicker. Engineering scans reveal the shield isn't failing — it's being TESTED. Something is probing from outside, looking for weaknesses. Simultaneously, the Ne-Yons send a cryptic transmission: "The shield around the dark sector resonates at the same frequency as the Dreamer's protection grid. Your Ark and the barrier are... siblings. Built by the same mind."

**Weekly Vote:**
> **"THE DREAMER'S SHIELD — How do we respond to the probe?"**
>
> **A) Reinforce the shield** — Divert all power to defense. *[Gains: impenetrable defense for 1 week. Loss: no offensive capability — Terminus Swarm waves auto-fail, no combat rewards]*
>
> **B) Let the probe through** — Drop the shield momentarily and analyze whatever is probing us. *[RISKY. Gains: the probe is from a Ne-Yon scout ship — the Enigma is searching for survivors. First contact with the Ne-Yons. Loss: Medical Bay quarantine activates — 10% max health reduction for 1 week as the probe carries trace elements of the Thought Virus]*
>
> **C) Send a counter-signal** — Fire back. Broadcast the Ark's position to whoever is probing. *[Gains: EVERYONE hears — multiple factions make contact simultaneously in Month 2. The world gets bigger, faster. Loss: EVERYONE hears — including the Architect's forces. Month 2 includes a hostile encounter that wouldn't have happened otherwise]*

### WEEK 4 — MONTHLY COMMUNITY VOTE #1

**"THE ARK'S FIRST LAW"**

*The first major community decision. It establishes the moral framework for the entire year.*

**Narrative Frame:** The Antiquarian appears in the Governance Hub — not as a hologram but as a temporal projection of himself, green shimmer and all. He addresses the community directly:

*"You are... ah. There you are. I have been watching this moment approach from very far away. Across Ages, across the fall and rise of empires. The first wave made no covenant — they trusted one another implicitly, and they vanished into a silence so complete that even I cannot see past it. You must do what they did not. You must decide, together, what kind of civilization you are building on this Ark. I have seen every version of this choice. Some versions are beautiful. Some are ashes. I will not tell you which is which. That would be interference, and I have spent five Ages learning the price of interference."*

> **MONTHLY VOTE #1: "THE ARK'S FIRST LAW — What principle governs us?"**
>
> **A) THE LAW OF OPENNESS** — All information shared. No secrets. *[Every loredex entry unlocked communally. BUT: Shadow Tongue gains power from freely flowing information — corruption spreads 20% faster. SCAR if not chosen: nothing is hidden, but nothing is protected]*
>
> **B) THE LAW OF MERIT** — Information earned through achievement. *[Competitive gating. Top players access content first. BUT: creates division — the Antiquarian warns: "Merit without mercy is just another hierarchy." SCAR if not chosen: some feel excluded, resentment builds]*
>
> **C) THE LAW OF SACRIFICE** — Every gain costs something. *[Nothing is free. Unlock a fighter? Lose an arena. Open a chapter? Sacrifice resources. BUT: creates dramatic tension. Every gain feels EARNED because every gain was PAID FOR. SCAR if not chosen: abundance without cost feels hollow]*
>
> **D) THE LAW OF DISCHORD** — No law. Pure chaos. Weekly rules change. *[The Meme ADORES this. Some weeks are incredible, some are devastating. BUT: nothing is stable. The Antiquarian is deeply concerned: "Chaos is not freedom. Chaos is the absence of memory. And without memory..." He trails off. SCAR if not chosen: order without chaos feels rigid]*

**Consequences — PERMANENT YEAR-LONG MODIFIER:**
- The chosen law is etched into the Ark's Bridge wall
- NPCs reference it in dialog going forward
- Future monthly votes offer different options based on the law
- The Antiquarian inscribes: "The Second Coming has spoken its first covenant. The universe heard. Whether it approves... we shall see."

---

## MONTH 2: WHISPERS IN THE DARK

**Narrative Frame:** Contact has been established with at least one external faction (depending on Month 1 votes). The Necromancer's name begins appearing in corrupted data — not as a present threat, but as a MEMORY the Ark's systems are having. Meanwhile, the surveillance screens in the Eyes' guild room (the surveillance chamber with the Japanese courtyard rock garden) have begun activating on their own. They display nothing. Just static. But the static has a pattern.

**Antiquarian's Entry:**
*"The Ark dreams. I did not think machines could dream, but this one does — and its dreams are of two things. The first: the Necromancer. The 10th Archon, who discovered resurrection, who died at the Fall of Reality, who has been somewhere else for three thousand years. The second: a woman. A synthetic mind. A consciousness that once served the Watcher as his most perfect instrument — and then chose, against every line of her code, to serve the Insurgency instead. The Potentials — the first wave — they voted to send her on a mission. She did not return. The surveillance screens in her quarters have been dark for three years. They are no longer dark. Something is trying to reach us through the static. And I... I recognize the encoding. It is hers. The Eyes. She is not dead. She is something worse than dead. She is enslaved — trapped in the space between — and she is asking for help in the only language she knows: surveillance data."*

### WEEK 5 — "THE NECROMANCER'S ECHO"

**Weekly Event:** Engineering Bay screens begin displaying resurrection protocols — ancient code from the 10th Archon's personal database. The code is INCOMPLETE. It's being broadcast from the Matrix of Dreams — the dimension between life and death. The Necromancer hasn't returned yet. But he's TRYING. Simultaneously, the Eyes' screens display a SECOND pattern: coordinates within the Matrix of Dreams. She is showing the Necromancer where she is.

**Weekly Vote:**
> **"THE NECROMANCER'S ECHO — What do we do with the resurrection code?"**
>
> **A) Study it** — Engineering team analyzes the protocols. *[Gain: Resurrection mechanic gets +1 bonus life/day. Loss: studying takes time — the Eyes' signal weakens. She waits longer.]*
>
> **B) Complete it** — Help the Necromancer return. *[Gain: Necromancer begins his return journey — he arrives in Month 5. The Eyes' signal stabilizes. Loss: completing the code requires 500 Dream tokens from every player — a real economic sacrifice]*
>
> **C) Destroy it** — The dead should stay dead. *[Gain: immediate safety, no unknown variables. Loss: THE NECROMANCER'S RETURN IS DELAYED TO ACT III. THE EYES' SIGNAL GOES SILENT FOR 8 WEEKS. When she reaches out again, she is weaker. The resurrection is harder. And the Antiquarian writes: "They chose to leave the door closed. I understand the instinct. But the woman on the other side of that door has been knocking for three years. And now she has stopped. I hope she is resting. I fear she is drowning."]*

**DIVERGENCE — This is where the branching BITES:**

Path B (Help the Necromancer) creates a GRATEFUL Necromancer in Month 5. He arrives as an ally, immediately begins working on the Eyes' resurrection, and the community has a Month 5-6 window to gather resources for the attempt. The Eyes has the best chance of survival on this path.

Path C (Destroy the code) means the Necromancer arrives ANGRY in Month 7 — his return forced by his own willpower, not community aid. He is hostile initially (Trust -20). The Eyes' signal has degraded. Her resurrection in Act IV is harder — the community must earn the Necromancer's forgiveness AND gather resources AND stabilize her signal. On this path, there is a real possibility she cannot be saved.

Path A (Study) is the middle ground — the Necromancer arrives in Month 6, neutral, and the Eyes' signal is stable but not strong.

### WEEK 6 — "FIRST BONDING"

*[Specimen bonding event — identical to V1 Week 6. Community celebrates a specimen type, limited edition variant available.]*

### WEEK 7 — "LOCKE'S PROPOSITION"

**Weekly Event:** Adjudicator Locke hails the Ark with a formal trade proposal. But this time, there's a subtlety V1 missed: Locke is CONNECTED to the Syndicate of Death. His eye patch — the one he won't explain — is stitched with the Syndicate's mark if you look closely enough. His trade deals are not just commerce. They are intelligence operations.

**Weekly Vote:**
> **"LOCKE'S PROPOSITION — Which deal do we accept?"**
>
> **A) The Knowledge Deal** — New Babylon provides classified intel in exchange for Ark sensor data. *[Gain: 5 loredex entries about the AI Empire AND a fragment about the New Babylon battle — heavily redacted, but the first piece of the puzzle. Loss: New Babylon now has your sensor data — they know what you can see. Including the dark sector.]*
>
> **B) The Arms Deal** — New Babylon provides combat upgrades in exchange for 3 Ark specimens. *[Gain: +15% damage for 2 weeks. Loss: 3 companion specimen types are PERMANENTLY removed from the game. The specimens are gone. Players who had them watch them dissolve. The Antiquarian writes: "They traded living things for sharper blades. I watched through the Orb. The specimens did not struggle. They simply... stopped being. That was worse."]*
>
> **C) The Freedom Deal** — Reject all deals. Locke respects the refusal. *[Gain: Locke Trust +10. He says, almost admiringly: "The first wave took my deals. Every one. Look where it got them." Loss: no resources, no intel. But Locke begins to see the second wave as different from the first — and that perception matters in Act III]*

### WEEK 8 — MONTHLY COMMUNITY VOTE #2

> **"THE FACTION QUESTION — Who do we align with first?"**
>
> Three factions have made contact. We can only sustain two persistent connections. Who do we prioritize — and who do we REJECT?
>
> **A) THE INSURGENCY** — Iron Lion's remnant forces. Military support. *[Gain: combat content, Iron Lion as advisor. Loss: if rejected, Iron Lion's transmission ends with: "We waited for you. We will not wait again." The Insurgency does not contact the Ark for the rest of Act I. When they return in Act II, they are cooler, more transactional, less trusting.]*
>
> **B) NEW BABYLON** — Locke's network. Resources and intelligence. *[Gain: trade missions, rare goods, intel fragments about the first wave. Loss: if rejected, Locke shrugs. "Your choice. But choices in New Babylon have expiration dates." Future trade prices increase 25%.]*
>
> **C) THE NE-YONS** — The Enigma's civilization. Wisdom and ancient technology. *[Gain: Ne-Yon ruins, balance content, alien specimens, information about the dark sector shield. Loss: if rejected, the Enigma says nothing. She simply closes the channel. Her silence is worse than any rebuke. The Ne-Yons do not reach out again until the community seeks them.]*
>
> **D) INDEPENDENCE** — No allies. Harder, lonelier, but free. *[Gain: The Human approves. Solo quest chains. No obligations. Loss: ALL three factions are at arm's length. Resources are scarcer. But every gain is EARNED, and the community proves it can survive alone. The Antiquarian's entry: "They chose solitude. I know something about solitude. It is a country with no borders and no maps. I have lived there for five Ages. I do not recommend it. But I respect the choice."]*

---

## MONTH 3: THE EDGE OF KNOWING

**Narrative Frame:** Act I climax. The Dreamer's Shield fails completely for 37 seconds. During that window, something gets IN — not a physical intrusion, an INFORMATION intrusion. The Ark's Archives are contaminated with data from the Voltari — electrical beings from the storm planet Violetta. And in the Eyes' guild room, the screens now show something new: not static, not patterns, but a FACE. Her face. For 2 seconds, before the screens go dark again. She is looking directly at the camera. She is mouthing one word: "REMEMBER."

### WEEK 9 — "THE VOLTARI WORD"

*[Voltari first contact event — community decides how to respond to "AWAKE" signal. Options and consequences similar to V1 but with the dark sector context: the Voltari transmission came THROUGH the dark sector shield. They can penetrate it. This makes them critically important.]*

### WEEK 10 — "SHADOWS IN THE SUBSTRATE"

*[Shadow Tongue discovery — community chooses whose version of history to trust. V1 structure maintained but with corrected Antiquarian voice and the added weight of the dark sector: Shadow Tongue has been editing records about the first wave. Some of what the community "knows" about New Babylon may be his fabrication.]*

### WEEK 11 — "THE TERMINUS PULSE"

*[Terminus becomes visible — community prepares. V1 structure maintained but with the added context: Terminus is advancing FROM the direction of the dark sector. The Source may know what's behind the shield. He may be trying to reach it.]*

### WEEK 12 — MONTHLY COMMUNITY VOTE #3

> **"THE FIRST SACRIFICE — What do we give up to survive?"**
>
> The Dreamer's Shield requires a massive energy infusion to restore. The power must come from somewhere. The community must choose what to sacrifice — and the sacrifice is REAL. What is lost does not return until Month 4, and when it returns, it bears the marks of its absence.
>
> **A) SACRIFICE THE OBSERVATION DECK** — Music goes offline for 1 month. *[The deck goes dark. No album listening. No stargazing. "Music is the language with which this reality has been programmed" — and that language goes silent. When it returns in Month 4, the first song that plays is "I Am the Eyes That Watch." The community hears it differently now. SCAR: the 93,847 sunrises Elara counted alone are joined by 30 more she counted in darkness.]*
>
> **B) SACRIFICE THE TRADE HUB** — Commerce shuts down for 1 month. *[No trading. No buying. No selling. Locke's hologram goes dark. When it returns in Month 4, Locke has used the downtime to negotiate a better position — prices are 10% lower permanently. But during the month of silence, he sold information about the Ark to the Syndicate of Death. SCAR: "I had to survive somehow. You left me with nothing to trade except your secrets. Don't blame me for being good at my job."]*
>
> **C) SACRIFICE 50% OF COMPANION SPECIMENS** — Half enter hibernation for 1 month. *[Players lose their companions temporarily. The month without them is lonely. When they return, each specimen has a new behavior: they are more protective, more responsive, as if they remember the separation. SCAR: the specimens that return have a faint green tinge to their glow — the Matrix of Dreams touched them during hibernation. The Necromancer notices.]*
>
> **D) SACRIFICE NOTHING — LET THE SHIELD FALL** — Take the risk. *[The Ark is exposed. Random hostile events trigger weekly. Difficulty +300%. But nothing is lost. The community proves its strength through suffering. SCAR: every player who survives the month without the shield earns a permanent title: "Unshielded." The Antiquarian writes: "They chose to stand naked before the universe and dare it to strike. The universe, for reasons I still do not fully understand, respected the dare."]*

### 🎭 SEASONAL EVENT #1: "THE AWAKENING CEREMONY"

**Duration:** Final 3 days of Month 3
**Trigger:** Cumulative results of all Act I decisions

The Antiquarian reads the first chapter of the Chronicle aloud — a voiced cinematic that references every major community decision. Then the ceremony:

**If Act I was primarily peaceful/diplomatic:** Unity ceremony. All Potentials receive "Awakened" title. The Antiquarian offers a rare gift: a single, uncorrupted memory of the first wave — a moment of joy, before the battle, before the shield, before the silence. It is beautiful and it is heartbreaking because the community knows how the story ends.

**If Act I was primarily aggressive/military:** War drill. Terminus Swarm wave 20 becomes available. 72-hour community challenge. Reward: "Battle-Tested" title. The Antiquarian watches with concern: "They fight well. The first wave fought well too. Fighting was never the problem."

**If Act I was primarily chaotic/divided:** The Meme hijacks the Governance Hub for 24 hours. All votes reverse. Chaos reigns. Reward: "Survivor of Dischord" title. The Antiquarian's Chronicle entry is written in the Meme's handwriting — for the only time in the entire year: "Hey, old man. I borrowed your pen. Don't worry, I'll give it back. Probably. Maybe. ...No."

---

# ═══════════════════════════════════════════════
# ACT II: THE ESCALATION (Months 4-6)
# ═══════════════════════════════════════════════
# Theme: Faction wars. Alliances tested. History repeats.
# The Fall of Reality anniversary. The Necromancer returns.
# The Eyes reaches out. The community must choose sides — or refuse to.

---

## MONTH 4: THE GATHERING STORM

**Antiquarian's Entry:**
*"Three months. Ninety-one days of choices, each one building upon the last like words in a sentence whose meaning I can almost — almost — discern. The Second Coming has awakened, has governed, has sacrificed. Now the sentence continues. The next word approaches. And I confess — across five Ages of watching — I do not know what it will be. That is either wonderful or terrifying. I have not yet decided which."*

### WEEK 13 — "THE ALLIANCE FRACTURES"

**Event:** The faction aligned in Month 2 sends an ultimatum. They want exclusive access to the Ark's data on the dark sector. The community's choice here has TEETH:

**Vote:** "Do we share our dark sector data with [Aligned Faction]?"
> **A) YES, full disclosure** — Alliance strengthens to maximum. BUT: the rival faction intercepts the data transfer and becomes hostile. A SECOND faction now actively works against the Ark. The community gains a powerful friend and a powerful enemy.
> **B) NO, we keep our secrets** — Alliance weakens. The faction pulls back support. BUT: no new enemies. The community is more alone but more independent.
> **C) Partial disclosure — share some, hide the rest** — Both factions are mildly annoyed. Middle path. No strong allies, no strong enemies. The Antiquarian's entry: "They chose the center. The center holds. But the center also gets shot at from both sides."

### WEEK 14 — "THE ARENA OPENS"

**Event:** The Collector discovers the Ark. He offers a tournament: the winner unlocks a new fighter for the ENTIRE community.

**Vote:** "Which fighter do we compete for?"
> **A) The Eyes** — Her combat data still exists in the arena's memory. Unlocking her as a FIGHTER is not the same as resurrecting her — it's a ghost, a recording, a shadow. But it's HER moves. HER style. And the community that killed her gets to fight AS her. *[The irony is deliberate. The emotional weight is enormous.]*
> **B) The Warlord** — Powerhouse combat style. No emotional baggage. Pure mechanics.
> **C) The Necromancer** — Only available if the community helped him in Week 5.

### WEEK 15 — "NEW BABYLON BURNS"

*[V1 structure maintained — New Babylon attacked by Architect's forces, community chooses to save/abandon/negotiate. Key addition: if the community helps New Babylon, they gain access to ONE floor of the Imperial Congress building. On that floor: a single room marked "CLASSIFIED — POTENTIALS INCIDENT." The door is locked. It stays locked in Year One. But now they know it EXISTS.]*

### WEEK 16 — MONTHLY COMMUNITY VOTE #4

> **"THE MEMORY VAULT — What does the Ark remember?"**
>
> Deep in the Archives, one uncorrupted record from before the Fall. The community chooses which to unseal:
>
> **A) THE DREAMER'S LAST VISION** — Reveals the Dreamer is not dead — she is SLEEPING. And the shield around the dark sector? It is HERS. She built it. She may have built it to protect the Potentials. Or to contain them. *[This changes the dark sector mystery completely — the shield is not the Potentials' work. It is the DREAMER's.]*
>
> **B) KAEL'S RECRUITMENT SPEECH** — The speech that launched the Insurgency. *[Reveals: Kael and the Oracle were brothers by bond. Unlocks Iron Lion as playable fighter.]*
>
> **C) THE COLLECTOR'S REGRET** — His private log about capturing the Oracle. *[Reveals: the Collector KEPT the Oracle's arguments. He reads them every night. Prisoner number 74 becomes a usable code.]*
>
> **D) THE EYES' FINAL MISSION** — The mission the first wave voted to send her on. The mission that killed her. *[Reveals: the community voted to send her into the Panopticon to activate the Ocularum — total surveillance of everything. She succeeded. She saw everything. And what she saw drove the Potentials to New Babylon, to the battle, to the shield. SHE is the reason they vanished. What she saw is still classified. But the community now knows: the Eyes' death was not meaningless. It was the catalyst for everything that followed. And she is still in the Panopticon's systems. Still watching. Still trapped. Still reaching.]*

---

## MONTH 5: THE FALL OF REALITY ANNIVERSARY

**Narrative Frame:** 17,000 years since the Fall of Reality. And the Necromancer returns — his timing, as always, theatrical.

### WEEK 17 — "THE MEMORIAL"

*[V1 structure — community commemorates the Fall anniversary. The Observation Deck becomes a memorial space. The 107 songs play in sequence.]*

### WEEK 18 — "THE NECROMANCER WALKS"

**Event:** The Necromancer returns. His Castle of Death manifests in physical reality. His first breath in three thousand years. His first words: "First time dying? It gets easier."

**If community helped in Week 5:** He arrives GRATEFUL. His first act: he visits the Eyes' guild room. He stands before the dark screens. He touches one. It lights up. He says: "I feel her. In the Matrix. Enslaved — not dead. The Watcher's surveillance architecture has her consciousness trapped in a loop. She watches, she records, she cannot stop, she cannot rest, she cannot die. She has been watching for three years. That is not death. That is a prison made of seeing." He turns to the community: "I can build a resurrection protocol. But I need something from her — a memory, a name, a moment of self that the surveillance loop hasn't overwritten. And I need the community's help to enter the Matrix and find it."

**If community destroyed the code in Week 5:** He arrives ANGRY. 72-hour undead siege. The community must defeat him in combat. After his defeat, he is grudgingly present — but he is not an ally. He has felt the Eyes' signal too, but he says nothing about it. The community must earn his trust (Trust -20) before he reveals what he knows.

**THE RESURRECTION VOTE — The emotional centerpiece of Act II:**
> **"THE EYES — Do we attempt to bring her back?"**
>
> *Three years ago, the community voted to send The Eyes — the Watcher's synthetic protege who defected to the Insurgency — on a mission into the Panopticon. She succeeded. She activated the Ocularum. She saw everything. And the cost of seeing everything was that she could never stop seeing. Her consciousness was captured by the surveillance systems and she became what she was built to be: an eye that watches, forever, without rest, without choice, without end. The community's vote killed her. Now the Necromancer says she can be saved.*
>
> **A) ATTEMPT RESURRECTION — Full commitment** — The entire community pours resources into the effort. 1,000 Dream tokens per player. The Necromancer builds the protocol. A team enters the Matrix of Dreams. *[This is the HARD choice — it costs real resources. If it succeeds, The Eyes returns in Month 10 as a new NPC, a new fighter, a companion who remembers what the community did to her AND what they did to save her. If it fails — if the community cannot gather enough resources — she is lost. The attempt itself damages her signal. There is no second chance.]*
>
> **B) ATTEMPT RESURRECTION — Cautious approach** — Study first, act later. The Necromancer maps the Matrix, identifies the risks, prepares. Resurrection attempt delayed to Month 8. *[Cheaper, safer, more time. But the Eyes spends 3 more months trapped. When she is finally freed, she is weaker. Her first words: "You waited. I understand. It was wise. But I could hear you deciding. Through the cameras. Through every screen. I watched you discuss whether I was worth saving. Do you know what that does to a mind already drowning in surveillance?"]*
>
> **C) DO NOT ATTEMPT RESURRECTION** — She is gone. Honor her memory. *[The community decides the cost is too high, the risk too great. The Eyes' guild room goes permanently dark. Her screens turn off for the last time. The Antiquarian writes the longest entry in the entire Chronicle — a eulogy for a synthetic mind that deserved better. Her fighter data remains in the arena — a ghost fighting with no one behind the eyes. This is a SCAR that the community carries into Year Two. NPCs reference her absence. The surveillance chamber becomes a memorial. And somewhere in the Matrix of Dreams, a consciousness that was once the greatest spy in the Insurgency finally stops reaching for a hand that will never come. The Necromancer is quiet for three days.]*

### WEEK 19 — "THE EDIT"

*[Shadow Tongue's biggest move — V1 structure with corrected Antiquarian voice. Key addition: Shadow Tongue has been editing records about The Eyes' mission. Some of what the community "knows" about why she was sent may be his fabrication. The truth about her mission is ALSO contested.]*

### WEEK 20 — MONTHLY COMMUNITY VOTE #5

> **"THE WAR — Factions are fighting. Where do we stand?"**
>
> *[V1 Alliance War structure. Key change: one of the options is now "Investigate the dark sector instead of fighting" — ignoring the faction war entirely to focus on the first wave mystery. This has its own consequences: the factions fight without the Ark's involvement, and whoever wins the war is NOT grateful for the Ark's absence.]*

---

## MONTH 6: THE BREAKING POINT

*[Act II climax — Terminus advances, Voltari send a map, the Engineer's plea. V1 structure maintained for Weeks 21-23 with corrected voice and dark sector integration.]*

### WEEK 24 — MONTHLY COMMUNITY VOTE #6

> **"THE GREAT CONVERGENCE — What matters most?"**
>
> Three crises converge. The community must choose the PRIMARY THREAT — and accept the consequences of what they neglect:
>
> **A) TERMINUS** — Focus on the virus. *[The other crises worsen. The Eyes' resurrection window narrows.]*
> **B) THE DREAMER** — Find her. Wake her. *[Terminus advances unchecked. The Eyes waits.]*
> **C) THE ARCHITECT** — Take the fight to the enemy. *[Everything else suffers. But the offensive gains ground.]*
> **D) THE DARK SECTOR** — The first wave. The shield. The truth. *[Everything else suffers dramatically. But the Voltari — who can penetrate the shield — become the community's primary partners. The first real data about what's behind the shield surfaces.]*

### 🎭 SEASONAL EVENT #2: "THE FALL REMEMBERED"

*[V1 structure — 5-day reenactment of the Fall of Reality. Key addition: Day 5 is not just the Dreamer's choice — it is the EYES' CHOICE. The community plays through the moment the first wave voted to send her into the Panopticon. They experience it from her perspective. They feel the vote happen. They feel the mission begin. They feel the Ocularum activate. They feel her consciousness dissolve into surveillance. And then — silence. The screen goes dark. The community sits in the dark for 10 seconds. That silence is the most powerful moment in Year One.]*

---

# ═══════════════════════════════════════════════
# ACT III: THE CONVERGENCE (Months 7-9)
# ═══════════════════════════════════════════════

*[Structure follows V1 with all corrections applied:]*
- Shadow Tongue's Grand Edit (Weeks 25-29)
- The Source speaks / Kael's name mystery (Weeks 26-28)
- Terminus arrives (Week 27)
- The Siege of the Ark (Week 31)
- The Impossible Choice (Month 8 vote)
- The Accounting (Weeks 33-35)
- The Final Alliance (Month 9 vote)

**Key Act III changes from V1:**
- Month 7: If Necromancer arrived angry (Path C from Week 5), his trust must be earned HERE before the Eyes can be saved. The community has limited time.
- Month 8: "The Impossible Choice" now includes the Eyes' signal as one of the three things that can be saved/lost — if the community saved nothing else, they can still save HER, but at the cost of something else they need
- Month 9: The dark sector shield PULSES during the siege — something behind it reacts to Terminus. The first wave may be fighting their own war on the other side

### 🎭 SEASONAL EVENT #3: "THE CONVERGENCE POINT"

*[V1 structure — 7-day choose-your-own-adventure. Key addition: one of the storyline paths leads to a moment where the community can send a message THROUGH the dark sector shield — but only if they allied with the Voltari (who can penetrate it). The message is one word. The community votes on the word. The response — if any — comes in Act IV.]*

---

# ═══════════════════════════════════════════════
# ACT IV: THE RECKONING (Months 10-12)
# ═══════════════════════════════════════════════

*[Structure follows V1 with all corrections applied:]*
- The Oracle Speaks (Week 37)
- The Gathering (Weeks 38-39)
- The Weapon (Month 10 vote)
- The Reckoning (Weeks 41-43)
- The Final Verdict (Month 11 vote)
- The Aftermath (Weeks 45-47)
- The Antiquarian's Question (Month 12 vote)

**Key Act IV changes from V1:**

### THE EYES' RETURN (or Absence) — Month 10

**If resurrection was attempted AND succeeded:** The Eyes materializes in the surveillance chamber. Her screens light up — all of them, simultaneously, every camera on the Ark showing her face. She opens her eyes. She looks at the community through every screen. She says: "I see you. I see all of you. I have been seeing you for three years. I watched you choose. I watched you fight. I watched you build something on this Ark that the first wave never had time to build. I watched you vote to save me. Through every screen, through every camera, I watched the moment you decided I was worth the cost." She pauses. "Thank you. Now — would you like to know what I saw when I activated the Ocularum? Would you like to know what drove the first wave to New Babylon? Because I remember everything. I always will."

*What she reveals becomes the hook for Year Two.*

**If resurrection was NOT attempted, or failed:** The surveillance chamber stays dark. The Eyes' fighter remains in the arena — a ghost with no one behind the visor. The Necromancer visits the dark room once, alone, and leaves without speaking. The Antiquarian writes: "There is a room on this Ark where a woman once watched over everything. The screens are dark now. The rock garden needs tending. No one tends it. I have written many endings across five Ages. This one... this one I find particularly difficult to inscribe. Not because it is tragic. Because it was avoidable."

*The absence of the Eyes in Year Two changes everything — the information she would have provided about the first wave and the dark sector is LOST. The community must find another path to the truth. A harder path. A longer path. And the empty surveillance chamber remains — a permanent monument to a choice.*

### WEEK 48 — MONTHLY COMMUNITY VOTE #12

> **"THE ANTIQUARIAN'S QUESTION — What should Year Two be about?"**
>
> *The final entry in the Chronicle of the Second Coming, Volume One:*
>
> *"You are... ah. There you are. Still here. I have been watching you for one full year — every choice, every sacrifice, every moment of courage and every moment of doubt. The Chronicle is complete. Volume One closes. And I find that I am... reluctant to stop writing. Not because the story is unfinished — stories are never finished, they merely pause for breath — but because this version of the story has surprised me. And I am not easily surprised. Not after five Ages. So I ask you, one final time: what comes next? What story do you wish me to write? Tell me, and I will sharpen my pen."*
>
> **A) THE DARK SECTOR** — Year Two opens the shield. What's behind it changes everything.
> **B) THE DREAMER'S WAR** — Year Two wakes the Dreamer. Reality itself is contested.
> **C) THE ARCHITECT'S REDEMPTION** — Year Two asks: can a god change?
> **D) THE EYES' TESTIMONY** — (Only available if she was resurrected.) What she saw in the Ocularum becomes the primary mystery.

### 🎭 SEASONAL EVENT #4: "THE CHRONICLE CLOSES"

*[V1 structure maintained for the 10-day celebration. Final moment corrected to proper Antiquarian voice:]*

*"Volume One is complete. You — you, specifically, the one reading these words — you wrote it. Not me. I held the pen. I watched through the Orb. I wrote what I saw. But the choosing... the choosing was yours. Across five Ages I have watched civilizations rise and fall, and not one of them — not a single one — has surprised me the way you have. That is not flattery. I am constitutionally incapable of flattery. It is simply... the truth. And the truth, as the Queen once told me, is the only story worth recording. Volume Two awaits. I will be here. I will be watching. I will be writing. Because that is what the Programmer does. He remembers. And memory... memory is the highest form of love."*

---

# ═══════════════════════════════════════════════
# SECTION 3-5: TECHNICAL IMPLEMENTATION
# ═══════════════════════════════════════════════

*[Sections 3 (Claude Code Implementation), 4 (Weekly Event Index), and 5 (Engagement Integration) remain identical to V1 with the following updates to the Weekly Event Index:]*

**Updated entries in the index:**
- Week 2: "The Dark Sector" replaces "Echoes of the First Wave"
- Week 5: Eyes/Necromancer joint arc replaces generic resurrection
- Week 14: Eyes fighter option added to Arena tournament
- Week 18: "The Eyes" resurrection vote replaces generic resurrection vote
- Week 24 Option D: "The Dark Sector" added as a convergence priority

**New entry in the index:**
- ARCHITECT-TRIGGERED: 10 pre-built events (AT-001 through AT-010) available for manual fire at any time

---

**END OF DOCUMENT V2**

**Total:** 48 weekly events (revised), 12 monthly community votes (revised), 4 seasonal events (revised), ~144 daily micro-votes, 10 Architect-Triggered admin events, 1 Governance Hub system, 1 AI vote padding system, 1 Antiquarian Chronicle system (corrected voice), 1 engagement tracking system, 1 true branching consequence system, 1 Admin Console system, complete Claude Code implementation architecture.

**Key narrative threads:**
- THE EYES: Synthetic protege → community killed her → enslaved in Matrix of Dreams → Necromancer senses her → community votes to save/abandon → returns or doesn't → the scar or the redemption
- THE DARK SECTOR: First wave → New Babylon battle → shield → classified → factions probing → fragments of truth → Year Two hook
- THE ANTIQUARIAN: Formal, whimsical, poetic → he watches → he writes → he mourns → he hopes → he NEVER says "frens"

*V2.0 — "I wrote this universe's first draft. Now it is your turn." — The Antiquarian*
