# Dischordian Saga — Full-Game Layout by Act

## Context

This document is a **master layout** of the whole game, broken down by act,
showing where every game mode, narrative system, and story power slots in.
It is an **analysis / map**, not an implementation plan — its purpose is to
give the user a single scannable view of the Witnessing metanarrative and
how each of the ~30 playable systems already in the repo is supposed to
serve it.

**Why this doc exists.** The prior version of this plan file focused on
a single "Awakening Chapter" and is superseded by this layout document,
which maps the Prelude and every subsequent act onto the canonical
structure from `docs/design/WITNESSING_NARRATIVE_PROPOSAL.md`. **The
canonical female narrator from the Prelude forward is Elara Voss**, the
memory-wiped Senator who serves as one half of the yin/yang narrator
pair alongside **The Human / The Last Archon**. **Their developing
relationship is the emotional spine of the entire game** — Prelude
through Endgame, every act — and every game mode, every tutorial, every
boss fight threads a beat of their arc.

**Scope.** The user asked for: *"an analysis of the whole entire layout of
how everything every game mode... the full layout by act (look at the story
elements and chapters and acts)"*, grounded in the Witnessing production
doc, the Potentials Identity material, the Galactic Dance faction layer,
the Silence in Heaven tracklist, and the full roster of story powers.

## Source of Truth

All act structure, cutscene gates, and cross-system framing in this doc
come from the following authoritative files. When this doc contradicts a
secondary doc, the files below win.

| Layer | Authoritative source | Status |
|---|---|---|
| Master act spine + per-act design | `docs/design/WITNESSING_NARRATIVE_PROPOSAL.md` (4135 lines, §0–§16 + Appendices A/B/C) | PROPOSAL — the canonical pacing bible |
| Metanarrative / identity chains | `docs/design/NARRATIVE_ARCHITECTURE.md` | CANON |
| Prelude phase machine | `apps/shared/awakeningProtocol.ts` (14 phases) | AUTHORED |
| Prelude crew missions | `apps/shared/preludeCrewMissions.ts` (3 missions; `prelude_burnt_card_found` gates Act 1) | AUTHORED data shell |
| Act 1 opponent data | `apps/shared/act1Opponents.ts` (12 opponents across Cycles A/B/C) | AUTHORED data shell |
| Act 2 interlude data | `apps/shared/act2Interlude.ts` (Engineer's Bench, Chess tiers, Two Game Masters) | AUTHORED data shell |
| Act 3 Eyes biography | `apps/shared/act3EyesBiography.ts` (7 life stages) | AUTHORED data shell |
| Acts 4/4.5/5 data | `apps/shared/actsFourFiveShells.ts` (Prisoner cells, Circuit, Cades M1-M7) | AUTHORED data shell |
| TCG chapter content | `apps/shared/tcg-core/story/chapters.ts` (14 battle chapters) | AUTHORED (but these are the Collector's Arena story-mode battles, NOT act-chapter numbering) |
| Potential identity reveal | `apps/shared/potentialOriginReveal.ts` + `potentialFactions.ts` (8 factions, Unity Meter) | AUTHORED |
| Music spine | `apps/shared/silenceInHeavenTracklist.ts` (18 tracks + epilogue, 4 album acts) | AUTHORED |
| Galactic Dance NPCs | `apps/shared/galacticDanceFactionNpcs.ts` (8 survivor-civilization NPCs) | AUTHORED |
| Global meters | `docs/design/SOUL_STONES_SYSTEM.md` + proposed `shared/dischordiaCycle.ts` (forked from `necromancerCycle.ts`) | PROPOSAL / REUSE |

**Two conflicting chapter numbering systems exist in the repo.** The TCG
engine at `apps/shared/tcg-core/story/chapters.ts` uses `ch1..ch12` as
Collector's Arena battle encounters (Dead Signal, Arena's Law, etc.). The
Witnessing proposal uses a separate Prelude → Act 1 → Act 2 → Act 3 → Act 4
→ Act 4.5 → Act 5 structure. This layout follows the **Witnessing act
numbering** as primary, and flags where TCG `ch*` IDs map back to acts.

---

## The Engineer's Fate — Canonical Correction (rev 4)

> **The Engineer is truly dead.** This is a canon hard-lock. Any
> section of this plan file — or of the Witnessing Narrative Proposal —
> that implies the Engineer survived in Agent Zero's body, or is
> "hiding in plain sight" as her, is **superseded** by the following
> canonical reading.

### The True Sequence of Events

1. After the Battle of Nexon, the Warlord captured the Engineer AND
   Agent Zero. She embedded her **nano-swarm** in Agent Zero's mind
   as a fail-safe — if Kael ever recovered Zero, Zero would still be
   the Warlord's weapon.
2. The Engineer realized Agent Zero's mind was still trapped by the
   Warlord's swarm, even though her body was free. He saw there was
   only one way to save her: a **transference** — a neural-lattice
   protocol he had designed but never tested at this scale.
3. The transference failed in a specific, catastrophic, redemptive
   way. **The Engineer burned himself out completely** to overload
   and take over the Warlord's nano-swarm from inside Agent Zero.
4. **The Engineer died.** Permanently. Truly. He gave his entire
   consciousness as the energy source of the takeover.
5. **Agent Zero survived.** But she is different now. She has the
   **Engineer's brain power — his raw intellect — with none of his
   memories**. She does not know him. She does not remember his
   face. She does not carry his voice. She is still Agent Zero —
   her personality, her history, her trauma — but reinforced with
   the Engineer's cognitive architecture.
6. The Warlord's nano-swarm is now **under Agent Zero's control**,
   a permanent passive weapon she did not ask for and does not
   fully understand.
7. **Agent Zero is the other awake Potential in the universe.** She
   and the player are the only two. This is canon.
8. Agent Zero is currently working as a **hitman for hire** — she
   has no allegiance, no faction, no purpose. She survived something
   she did not volunteer for, and she is selling the violence she
   inherited while she figures out who she is now.

### Agent Zero's Name — Proposed: **Vex Solène**

Per the user's rev 4 directive ("give her a name"), this layout uses
**Vex Solène** as her canonical proper name going forward. "Agent
Zero" becomes her **alias** — the name on her dog tags, her Insurgency
call sign, her hitman moniker. "Vex Solène" is who she is when the
armor is off.

- **Vex** — a hitman alias; short, hard, echoes *vexatious*.
- **Solène** — a noir-gravitas French surname, phonetically echoing
  *solace* and *sole one* (appropriate for "the other Potential, the
  only one left in the universe besides you").
- **"V-" alliteration** aligns with canon (Elara **V**oss, Lyra **V**ox,
  Zyr'Koth). Distinctive but fits.

If the user prefers a different name, it should be substituted for
"Vex Solène" globally in this file. All references below use the
proposed name.

### What This Means For Specific Beats

| Beat / Act | Old (wrong) framing | New (correct) framing |
|---|---|---|
| **Prelude Beat I.1 Fallen Dog Tag** (VO Line 71) | "The biometric data matches the Engineer. The mind swap. The Engineer is walking around in Agent Zero's body." | Vex Solène kept the Engineer's dog tag as a memorial. Its biometric data is his. She carries it because she knows, at some abstract level, that someone gave their life for her. She does not remember him. |
| **Prelude Beat H.3 NPC Inbox "Yellow Coats" message** | Sender ambiguous — implied to be the Engineer reaching through time. | Sender is **Vex Solène**. She is a hitman. She has heard there is another awake Potential on Ark 1047. She is reaching out — not as the Engineer's ghost, but as a professional curious about her own species. |
| **Act 1 Cycle C3 forced loss** | "Warlord Zero — the Engineer's own body piloted by the Warlord's fragment, wearing the Engineer's best friend's face." | This battle is the Engineer's **final transference attempt**. The player plays the Engineer. The forced loss is his failure-that-is-also-a-success: he cannot beat the Warlord inside Agent Zero's mind, but by losing he gives her his intellect. The "Friend I Trusted" card now reads as the Engineer's willing sacrifice, not a betrayal. |
| **Act 3 F3 Insurgency Infiltration** | "Meet the Engineer. He is still alive in Agent Zero's body. He remembers the Deck." | **Meet Vex Solène.** She is the real organic Agent Zero. She carries the Engineer's brain power but **none of his memories**. She does not recognize the player. She does not know about the Dischordia deck. She is taking contracts. The player is one of her contracts — she was hired to assess Ark 1047 and decide if it's worth killing. The quiet earthquake of Act 3 becomes: *"Your friend is dead, and this is the woman he died saving, and she does not know you."* |
| **Act 4 Cell 3 "The Warlord Rematch"** | Implied the Warlord was still in the Engineer's body. | The Warlord is dead. Her nano-swarm is now Vex Solène's. Cell 3 is the Prisoner (Kael) confronting the Warlord's *memory* — which wears whichever face hurts him most, probably Vex Solène's. The memory is not the real Vex. |
| **Act 5 M6 "Alliance of Adversaries"** | "The Agent Zero the player met in Act 3 was never the real one. This one is the real one, in her real body, and the player is the first being in 17,000 years to see her alive." | **There is only one Agent Zero — Vex Solène.** She has been alive the whole time. Act 3 was the first meeting; Act 5 M6 is the moment she **stops being a hitman and joins the player's cause**. The "first being in 17,000 years to see her alive" framing is deleted — she is not an archival reveal, she is a woman the player has been gradually trusting since Act 3. |
| **Act 5 Post-Credits "The Bridge of Kael" card** | "The Engineer survived. He has been waiting for the player the entire game. Every hint, every signal, every system that opened was him reaching through the substrate." | **The Engineer is dead.** The card is a **memorial**, not a survival proof. The true Bridge of Kael is the bridge the Engineer built **between two people** — Kael and Vex Solène — by giving his life. The player discovers this in Act 5 post-credits and finds Vex Solène on the Ark's bridge, waiting to take the empty crew slot. She says one line: *"I don't know who he was. I know he's why I am."* |
| **Prelude Beat H.2 Engineer Logs "full collection"** | The 3-second fragment completes into: *"— the next pod, the next pod, I can't tell them it's the same pod. We are all running the same clone. The hellbox is the kernel. I should not have built this."* | The log is still the same, but it is now the Engineer's **final transmission** before the transference. The line *"I should not have built this"* now refers to the hellbox AND the transference protocol — he knew one would kill him. |
| **The Human's `mobileNarratorDialog.ts` engineering H-tier line** *"I did. I do. He's still alive. You signed the memo that said he wasn't. Don't cry — we're going to get him back before this is over."* | Taken as canon Engineer survival. | **Re-read as The Human being wrong.** He believes the Engineer is alive because he investigated the "accident" and closed the case without looking at the body. He has carried that lie to himself for 17,000 years. In Act 5, the player has to tell him the truth. His line stays in the file; its meaning changes. |

### New Character Profile — Vex Solène (Agent Zero)

**Identity:** The other awake Potential. Organic. Carries the
Engineer's intellect and the Warlord's captured nano-swarm.
**Profession:** Hitman for hire. Unaffiliated. Takes contracts on a
case-by-case basis. Known to the Insurgency (they gave her the Zero
callsign) and to New Babylon (they hire her occasionally).
**Appearance:** The woman from `VOICE_OVER_BIBLE.md` Agent Zero
voice profile — sharp, urgent, military, clipped sentences, American
accent, haunted underneath.
**Voice direction:** Already canonicalized per VO Bible entry 3 —
*"A sharp, urgent female military voice with a crisp American
accent. Speaks fast, clipped sentences — every word matters.
Occasional static bursts and signal degradation. No-nonsense,
tactical, but with a haunted quality underneath — like a soldier
delivering her final transmission knowing no one might hear it."*
**Canonical VO lines (already authored):**
- `zero_fc_1` *"Potential. This is Agent Zero. Insurgency encrypted
  channel. The ship you're on was never meant to save anyone. It's
  a cage. Elara is the lock. And someone just handed you the key."*
- `zero_rev_dead` *"The Warlord killed me. Or... killed who I was.
  What you're hearing shouldn't exist. I shouldn't exist."*
  **(Re-read: this is literal now. What she is didn't exist before
  the transference.)**
- `zero_rev_dogtag` *"My dog tag says Agent Zero. But the biometric
  data doesn't match my profile. It matches someone called The
  Engineer."* **(Re-read: she is wearing the dog tag of a dead man
  whose mind poured itself into hers. She knows someone gave
  everything for her. She does not know the details.)*
- **Key ability:** Passive control over the Warlord's captured
  nano-swarm. She can deploy it as a non-verbal second hand — in
  pet battles, in Cades combat, in Arena fights — but it never
  speaks to her and she does not fully trust it.

### What She Wants

Vex Solène is **looking for a reason**. The Warlord used her. The
Engineer died for her. Kael loved her. The Insurgency trained her.
She has never chosen her own purpose. In Act 3 she meets the player
and begins to suspect that purpose is something one **chooses**,
not something one inherits. In Act 5 M6, she joins the player's
crew because the player is the first person who ever asked her
what she wanted. In the Endgame she is the second-most-important
ally in the Vortex defense after Elara + The Human.

---

## The Witnessing Thesis (One Paragraph)

**The game is Revelation 21–22 played as science fiction.** The Seer wrote
a deck of cards called the **Dischordia** that could rewrite reality; she
used them to fight the **Vortex** to a standstill and save a galaxy. The
deck shattered. Its energies scattered across the multiverse as fragments
of memory, experience, and idea. The Vortex has been rebuilt and is coming
back. Every faction in the galaxy is racing to reassemble the deck first,
because whoever holds the master set gets to choose what reality becomes.
**You are a Potential** — a Collector-engineered hybrid of organic and AI
code — who woke up on a dead Ark with two voices in the walls, one warm
and one cold, a broken deck of starter cards, and a life to decide what
kind of god you are going to be. The music of **Malkia Ukweli & The
Panopticon** (the two Witnesses) plays the whole book of Revelation back
at you as you play through it. You are simultaneously the protagonist and
the witness. (`docs/design/NARRATIVE_ARCHITECTURE.md` §Core Thesis;
`WITNESSING_NARRATIVE_PROPOSAL.md` §0)

---

## Player Identity — The Potential

**A Potential is a third thing.** Not organic, not AI. The Collector's
3,000-year Garden project deliberately hybridized the best organic genetic
material with the most advanced AI code into a new species-of-one per
awakening. (`apps/shared/potentialOriginReveal.ts:72-83`)

**Three Potential species, eight factions, one Unity Meter:**

| Species | Identity | Canonical factions (4 each, 2 extremist) |
|---|---|---|
| **DeMagi** | Organic-heritage. Elemental affinities (Fire / Earth / Water / Air). | Elemental Assembly, Warden's Vanguard, Resonance Institute, **Pure Flame** (extremist, -20 Unity) |
| **Quarchon** | Machine-code heritage. Dimensional affinities (Probability / Time / Reality / Space). | Probability Accord, Dimensional Guard, Reality Institute, **First Pattern** (extremist, -20 Unity) |
| **Ne-Yon** | Both. The bridge species — 12 individuals exist. The Enigma (Malkia Ukweli) is their canonical leader. | (no factions — Ne-Yon are individuals, not a bloc) |

(`apps/shared/potentialFactions.ts:54-233`)

**The Unity Meter (0–100%)** tracks DeMagi–Quarchon cooperation and
progresses through: *fracturing → tense → contested → negotiating →
converging → unified*. It is the Potentials' internal political health
bar, independent of the galaxy-wide Light/Dark meter.

**Five classes, each a lens on the Potential:** Engineer (craft/repair),
Oracle (divination/card-insight), Assassin (stealth/crit), Soldier
(tactics/durability), Spy (intel/deception). Five ranks per class
(Initiate → Adept → Specialist → Master → Grandmaster), each rank
unlocking a perk that opens **both** gameplay and dialog-wheel options.
(`apps/shared/classMastery.ts`)

**The origin reveal scene** fires after 5 rooms cleaned + Archive access.
The Human explains the Garden. Elara counters with the "third thing" line.
The player chooses one of seven response tones (HORROR, DEFIANT, CURIOUS,
PHILOSOPHICAL, COLD, INTELLIGENCE 10, SPY PREEMPT) that permanently colors
their relationship to their own identity.
(`apps/shared/potentialOriginReveal.ts:94-196`)

---

## Cross-Cutting Systems (Active in Every Act)

These systems run continuously from the Prelude onward and write state
that every later act reads. Think of them as the **load-bearing columns**
under the act spine.

### 1. Yin/Yang Narrators — Elara + The Human (The Mobile Narrator)

**This is the game's emotional spine.** Their developing relationship
runs from the Cryo Bay awakening to the final post-credits beat at the
Bridge of Kael. Every room, every system, every battle is a place where
their arc advances by one increment. By Endgame, the player has
participated in 50+ hours of their slow, painful reconstitution as
people who remember each other. Tracking their Bond scores is tracking
the main story.

Elara is the warm voice (memory-
wiped Senator, sold out her species, lives on the Bridge at first). The
Human is the cold voice (Student → Seeker → Detective → Last Archon,
investigated injustice for 1,351 years before being corrupted upward,
lives in Comms Array at first). **From Prelude Beat 4 onward, both
become floating narrators** that can appear in any room's Narrator Slot
based on affinity + Bond + story flags + a genuine random roll. Dismiss
them with "Go Away" and bond drops. Both reveal their backstories on a
**shared trust ladder** (20 / 40 / 60 / 80) that gates the Memorial
Corridor unlock and the "Two Witnesses Meet" cutscene — the single most
impactful moral choice in the Prelude/Act 1 arc. Forgive neither at Bond
80 and a **third narrator opens**: Dr. Lyra Vox speaking through the
substrate. (`WITNESSING_NARRATIVE_PROPOSAL.md` §1;
`apps/client/src/game/narrativeSystems.ts`)

### 2. The Light / Dark / Vortex Meter (dischordiaCycle)

Forks `apps/shared/necromancerCycle.ts` into a proposed
`apps/shared/dischordiaCycle.ts`. Three hidden numeric meters, all shown
as poetic text only (never a number):
- **`lightEnergy`** — grows from wins for the Light side, diplomacy,
  forgiveness, crew bonding, reclamation events.
- **`darkEnergy`** — grows from losses, betrayal, Hierarchy trades, pet
  deaths, siding with the Game Masters.
- **`vortexProximity`** — doomsday clock. Only grows. Ticks on a slow
  real-time tick + every Dark threshold crossed. Hidden until >50%.

Every mechanical action in the game writes to this meter per the §3.6
table: +20 Light per Dischordia Light win, +15 Dark per loss, +30 Light
per Trade Empire treaty, +200 Light for forgiveness at Two Witnesses Meet,
+100 Dark + Lyra Vox unlock for refusing both, etc. The galaxy map in
`client/src/game/tradeEmpire.ts` gets a new `SectorLightState`
("lit" / "dimming" / "dark" / "consumed" / "reclaimed") that reflects
the meter visually. Below 20% lit, the **Vortex Advance Event** fires
community-wide. (`WITNESSING_NARRATIVE_PROPOSAL.md` §3)

### 3. The Silence in Heaven Slideshow Engine

The single highest-leverage content system in the proposal. A reusable
`<SongSlideshow />` component (`shared/songSlideshow.ts`) plays any song
as a timed Ken-Burns slideshow with lyric overlays, narrator reactions,
and particle/glitch overlays. Every song in the Lore Bible is a potential
cinematic, making every new piece of album art a free cutscene. The **18
Silence in Heaven tracks** form the album-level spine, with tracks
triggering at canonical narrative moments:

| Album Act | Tracks | Narrative Role |
|---|---|---|
| **I. The Warning** | sih-01 *New Babylon Goddamn*, sih-02 *Letters to the Remnant*, sih-03 *Turn Back* | Prelude + early Act 1 ambient warnings |
| **II. The Judgment** | sih-04..sih-11 (*Worthy*, *Behold*, *Plead the Fifth*, *The Two Witnesses*, *The Trumpets*, *They Would Not Repent*, *False Prophet*, *Sixth Sense*) | Act 1 biography cycles + Act 2 Game Master reveal |
| **III. The Reckoning** | sih-12 *Silence in Heaven* (title), sih-13 *The Mark*, sih-14 *The Harvest*, sih-15 *It Is Done*, sih-16 *Fall of New Babylon*, sih-17 *Faithful and True* | Acts 3–5 climactic beats |
| **Epilogue** | sih-18 *All Things New* | Endgame / post-credits |

Plus P0 non-SiH slideshows already queued: *Welcome to Celebration*, *To
Be the Human*, *Last Words* (Act 1 finale), *I Am the Eyes That Watch*
(Act 3 opener), *Ocularum* (Act 3 mid), *The Prisoner* (Act 4 opener),
*The Lion in Black* (Act 5 opener). Narrators are **the Antiquarian**
(Dr. Daniel Cross, Programmer half — "The Storyteller's counterpart")
and **the Storyteller** (Malkia Ukweli, Enigma half); they speak
inter-track dialog that frames the songs as prophecy being fulfilled in
real time. (`apps/shared/silenceInHeavenTracklist.ts:26-144`;
`WITNESSING_NARRATIVE_PROPOSAL.md` §5)

### 4. Dialog Wheel + Story Powers Roster

`apps/shared/dialogWheel.ts` provides six wheel segments (INVESTIGATE,
MACHINE, HUMANITY, AGGRESSIVE, COMPASSIONATE, SKILL_CHECK) with rarity
tiers (Common → Mythic) and a four-level corruption state that degrades
the wheel visual (scanlines → pulse → flicker → distortion) as the
player drifts toward the Dark side. Every "story power" in the game is
ultimately a wheel-option unlocker. The full story-power roster:

| Power | What it does | Source file |
|---|---|---|
| **Soul Stones** (Corrupt / Purify) | Summon demons (Lesser → Arch) or light companions (Candle → Divine Aspect); writes to Light/Dark meter | `docs/design/SOUL_STONES_SYSTEM.md` |
| **Class Mastery Perks** | 5 ranks × 5 classes = 25 unlockable perks, each opens new wheel options and mechanics | `apps/shared/classMastery.ts` |
| **Elemental Affinities** (Fire, Earth, Time, Reality + placeholders) | DeMagi/Quarchon-gated dialog + NPC interactions | `apps/shared/questlineElements.ts` |
| **Faction Allegiances** (8) | Pledge to Assembly / Vanguard / Institute / Accord / Guard / Reality / Pure Flame / First Pattern; gates questlines and Unity Meter | `apps/shared/potentialFactions.ts` |
| **NPC Trust States** | Per-NPC trust thresholds (30, 40, 60, 80) unlock gated monologues, joint ops, and faction recruitment | Various questline files |
| **Witnessing Addendum** | The two-narrator meta-layer. Players at converging Unity or true-ending paths hear Antiquarian + Storyteller simultaneously | `apps/shared/silenceInHeavenTracklist.ts` + `witnessingRuntime.ts` |
| **Dialog Wheel Corruption State** | 0–3 level, visually degrades the wheel; gates Dark-aligned rare options | `apps/shared/dialogWheel.ts:126` |

### 5. Thought Virus Pressure (`apps/shared/thoughtVirus.ts`)

A 5-stage infection meter (Dormant → Exposed → Latent → Active → Consumed)
that ticks up from exposure events and applies stat debuffs at each stage.
Act 3 Faction F4 (Terminus Dominion) lets the player **intentionally get
infected** for a unique "Immunity" card — one of the few places the
pressure mechanic is weaponized for player benefit. Otherwise it's a
background doom timer that the player manages with crew and crafting.

### 6. Loredex + Transmissions (the in-game codex)

`apps/shared/loredexSchema.ts` is the collectible encyclopedia of
characters, locations, and concepts. `apps/shared/transmissions.ts` is
the cutscene-delivery layer (**Late Night with the Meme**, 28+ episodes
across 6 epochs) that unlocks Loredex entries and provides 4th-wall
commentary from the Meme pretending to be the White Oracle. Both run
continuously across all acts.

### 7. Galactic Dance (Background Faction Layer)

`apps/shared/galacticDanceFactionNpcs.ts` — 8 NPCs representing the
**survivor civilization** that exists outside the Potentials but
intersects with them diplomatically: Mirren Hale (Council of Survivors),
Dr. Sael Finn (The Bridge Project), The Hierophant (Thaloria), General
Binath-VII (Awakened Clone Collective), Orin Fell (Insurgency
Remembrance), Field Commander Renn (Insurgency Forward), The Word and
The Silence (Syndicate of Death, alternating-sentence pair). They are
**not a game mode**; they are a political theatre where player choices
echo through Acts 2–5 via dialog options and faction-gated quests.

### 8. Celebration Trial (4-season school year decision loop)

`apps/shared/celebrationTrial.ts` — 28-day Mascoteer decision system
that, under the Witnessing proposal, runs **in parallel with Act 1 Cycle
A**. Daily Mascoteer decisions accumulate bond/corruption/morality scores
that are passed into the Act 1 card battles against Conni, Corey, and
Mr. Unblink as pre-battle buffs or debuffs. This is the first place where
a background system **structurally connects** to the main act spine.

### 9. Living Ark + Living Universe (Everything Is Affected By Your Decisions)

**This is the cross-cutting system that makes every single choice in the
game persist and propagate.** Per the user's rev 3 directive
("make sure the living universe and living ark systems are in place.
Everything should be affected by your decision"), this is the load-
bearing layer that binds every system to every other system.

**Code sources:**
- `apps/shared/livingArkTouchpoints.ts` (420 lines) — per-room narrator
  slot preferences, narrator reaction tables (`elara` / `the_human`
  line pairs keyed by action ID), and room filter presets
  (`neutral` / `warm_elara` / `noir_human` / `yin_yang_flicker` /
  `silence_ambient`) applied based on bond state.
- `apps/shared/livingUniverseEvents.ts` (784 lines) — galaxy-wide
  event broadcast system for community-scope consequences.
- `docs/design/WITNESSING_NARRATIVE_PROPOSAL.md` §14 — *Living Universe
  & Living Ark Integration* (§14.1 Living Universe events generated
  or gated, §14.2 Living Ark touchpoints, §14.3 Celebration and
  Mechronis integration, §14.4 Faction discovery hooks, §14.5
  Celebration / Mechanis / Faction / Acts interlock).

**What "Living Ark" means in practice:**
- **Every room the player enters remembers them.** On second visit,
  the room's hotspots are annotated with "last time you were here…"
  reactions. Elara's room-intro VO plays only on first visit; all
  subsequent visits use the `livingArkTouchpoints` narrator reaction
  table instead.
- **Every room has a bond-state filter preset.** At Elara bond 80,
  her canonical rooms tint `warm_elara`. At Human bond 80, his
  tint `noir_human`. At both bonds 80, shared rooms flicker
  `yin_yang_flicker`. On the Forgive-Neither Act 5 path, rooms
  switch to `silence_ambient` and Lyra Vox's substrate voice
  starts speaking.
- **Every major choice writes a permanent Living Ark touchpoint.**
  The Beat E moral choice (sacrifice pet) permanently scars the
  Pet Garden room art. The Beat I first-vote (Governance Hub)
  changes a detail in the Act 2 Crafting Bench first scene. The
  Beat A Shadow Tongue reveal adds a permanent glitch overlay to
  every document in the Archives room.
- **Pet Dynasty writes to the Living Ark.** Pets that die in
  service leave their drawings (by Little One) in the Bestiary.
  Their offspring inherit their Memory Traits. The Pet Garden
  room art grows over time as the player's dynasty expands.

**What "Living Universe" means in practice:**
- **Every major Prelude beat fires a galaxy-wide event** per §14.1:
  - **Beat A.2 Shadow Tongue Revealed** → community Loredex entry
    tick (galaxy-wide Loredex count +1).
  - **Beat B.3 Virus Outbreak on Ark 1047** → community Thought
    Virus meter +1.
  - **Beat D.2 First Governance Hub Vote** → the player's vote
    becomes part of the Year One Calendar community vote tally.
  - **Beat E Moral Choice** → community Light/Dark meter writes
    (per §3.6 table: +100 Dark for sacrifice, +100 Light for keep).
  - **Beat F Two Voices Registered** → first Prelude community
    broadcast. Other Arks that reach this beat see a notification.
  - **Beat G First Argument Won** → community Thought Virus meter
    **ticks down** for the first time.
  - **Beat I Tower Defender Active** → first contribution to the
    Terminus defense line; community virus meter ticks down again.
  - **Beat J Two Voices One Deck** → community Light Energy +50
    and CoNexus Tome count +1 galaxy-wide.
- **Every Act 1–5 boss defeat, every Trade Empire treaty, every
  Collector's Arena match, every Cades mission, and every
  Reclamation Event writes to `livingUniverseEvents.ts`.** Per
  §3.6 of the Witnessing proposal, the full write table covers
  every mechanical action in the game.
- **Community-scope consequences are visible** on the Bridge's
  galaxy map (introduced in Beat I). Every player can see the
  cumulative effect of the community's choices.

**The Cross-System Choice Consequence Mesh (new canonical table):**

Every system writes to every other system. This table shows the
**direction of influence** — how a choice in one system changes a
later system's behavior.

| Choice made in… | Writes to… | Effect in subsequent systems |
|---|---|---|
| **Beat A class pick** | Class Mastery tree | Gates 5 class-specific solutions in every subsequent class-gated puzzle (Beat A, Beat B.1, Act 1 cycles, Act 3 F3 Infiltration) |
| **Beat A murder mystery resolution** | Living Ark (Cryo Bay art), Loredex, Shadow Tongue faction flag | Archives glitch overlay in Beat J + Act 1 + every future Archives visit |
| **Beat A Engineer log partial** | Engineer questline flag | Full reveal in Beat H, payoff in Act 1 Cycle C, final reveal in Act 5 post-credits |
| **Beat B hellbox discovery** | Hellbox fast-travel portal | Reusable in Acts 1–5 as Celebration return trips |
| **Beat B virus outbreak** | Thought Virus pressure meter | Ticks up community-wide; player must push back via pet battles / Tower Defense / Reclamation Events |
| **Beat D Governance Hub first vote** | Year One Calendar vote tally | The chosen proposal outcome persists into Act 2 Crafting Bench's first scene detail |
| **Beat D Chess tutor vs skip** | Chess depth stat + Gary's respect for player | In Act 2 §6.3, chess_depth is the gate for "Preview Cards" (≥3), "Undo" (≥5), and "Engineer's Opening" (≥8); Gary's respect affects Act 1 Cycle A Day 20 |
| **Beat D House + Apprentice assignment** | Apprentice questline + permadeath risk | Act 1 Cycle A's 28-day Mascoteer trial can kill the apprentice; their death generates a Memory Card for the player's deck |
| **Beat E moral choice (pet)** | Light/Dark meter +100, Silver Argument card or lack thereof, apprentice trust, Little One's trust | Affects every Act 1 battle's difficulty; unlocks/denies Silver Argument in deck; changes Little One's dialog forever; affects Act 3 F3 Infiltration Engineer reunion tone |
| **Beat F The Human's first contact** | Mobile Narrator system activates | Every subsequent room's narrator slot uses `mobileNarrator.ts` affinity table; The Human's shoulder banter changes based on player choices |
| **Beat G pet battle outcome** | Bestiary, Memory Trait inheritance, community virus meter | First Bestiary entry; pet's move history passes to offspring; community meter ticks down |
| **Beat H Engineer log full** | Hellbox-origin revelation flag | Retroactively explains Beat B outbreak; seeds Act 1 Cycle C3 forced loss; seeds Act 5 post-credits Engineer survival reveal |
| **Beat H NPC Inbox "Yellow Coats" message** | Act 5 Yellow Coats questline | First canonical foreshadow of Bridge of Kael post-credits reveal |
| **Beat I Tower Defense wave** | Community Thought Virus meter, Appendix B Kael questline | First wave plays Kael's last transmission; each subsequent wave in Acts 1–5 plays an earlier Kael recording (reverse chronology) |
| **Beat I first-wave Arks lore** | Act 3 F4 Terminus Dominion gate | The Terminus Dominion faction arc is now intelligible; the player knows what Terminus is before they arrive |
| **Beat J Potential Origin tone** | Elara + Human dialog tone | The selected response tone (HORROR / DEFIANT / CURIOUS / PHILOSOPHICAL / COLD / INT 10 / SPY PREEMPT) permanently flavors every Elara + Human dialog for the rest of the game |

**Critical rule:** *No system runs in isolation.* Every system in
the game has **inbound writes** from earlier systems and **outbound
writes** to later systems. The graph of writes is the **structural
proof** that everything is building together in one logical fashion.

---

## The Act Spine (At-a-Glance)

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ PRELUDE  │  ACT 1   │  ACT 2   │  ACT 3   │  ACT 4   │ ACT 4.5  │  ACT 5   │
│          │          │          │          │          │          │          │
│  Ship    │  TCG     │ Crafting │  Trade   │ Fighting │ Racing + │   FPS    │
│ Cleaning │  (Dis-   │   +      │  Empire  │   Game   │  Casino  │  Cades   │
│  +Crew   │ chordia) │  Chess   │    +     │    +     │    +     │    =     │
│  +Pets   │    =     │    +     │ Diplomacy│ Collect. │  Dead    │  Iron    │
│          │ Engineer │ Collect. │    =     │  Arena   │  Man's   │  Lion    │
│  "Awake  │biography │  Arena   │  Eyes    │  bosses  │ Circuit  │  last    │
│    in    │    +     │    +     │biography │    =     │          │  stand   │
│  Ashes"  │  12-card │  Thalor. │    +     │ Prisoner │ Identity │          │
│          │  arc     │  cine.   │ Occularum│ memories │   bet    │ Veridian │
│          │          │          │          │          │          │   VI     │
│  §2      │  §4      │  §6      │  §7      │  §9      │  §10     │  §11     │
│ Awaken.  │ Engineer │ Forged   │  Eyes    │ Prisoner │ Dead Man │ Lion in  │
│ Protocol │ 's Story │  Hand    │          │          │          │  Black   │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
                                                                        │
                                                                        ▼
                                                            ┌────────────────────┐
                                                            │      ENDGAME       │
                                                            │  Vortex Returns    │
                                                            │  (community-wide)  │
                                                            └────────────────────┘
```

| Act | Rough hours | Primary System Unlocked | Narrative Role |
|---|---|---|---|
| Prelude | 3–5 | Adventure (point-and-click) + Crew + Pets | "I am putting a body back together. The body is a ship." |
| Act 1 | 8–12 | **Dischordia TCG** | The literal scripture. Each card is a memory/idea/place. |
| Act 2 | 4–6 | **Crafting + Chess + Collector's Arena** | You forge new cards and train the mind the Deck demands. |
| Act 3 | 10–15 | **Trade Empire + Infiltration Runner** | How you move through a dying galaxy — trade, war, or spy. |
| Act 4 | 6–8 | **Fighting Game** (Collector's Arena combat) | Memory extraction as combat. |
| Act 4.5 | 1–2 + ∞ | **Dead Man's Circuit (racing) + Degen's Casino** | Identity is a bet. Also the only room where the plot pauses. |
| Act 5 | 4–6 | **Cades FPS** | You finally step inside the scripture. |
| Endgame | community | **All systems combined** | Vortex Advance + Reclamation loop. |

Each new act **unlocks a new primary game system** while every previous
primary system remains active and harder. By Act 5, every system in the
game is live at once — that is the point. The Endgame's Vortex battle
pulls every system into one community-wide event.

---

## PRELUDE — "Awake in Ashes" (Revised)

> Target: 3–5 hours across 2–4 sessions. Ends the moment the Dischordia
> card game opens at the Archives. The Prelude exists to put the
> instrument in the player's hands — and to teach every foundational
> game system through a lore-motivated character — before asking them
> to play a song.

**Primary game mode:** LucasArts-style point-and-click adventure in the
Cryo Bay and Medical Bay, escalating into **a structured chain of
character-tutored game-mode introductions** across the Ark.

**Design principle (reinforced from the user's rev 2 directive):** Every
tutorial is delivered by a character with a lore-justified reason and
motivation to teach it. No disembodied tooltips. Every system is how
the player learns about a specific character, and **the Elara + The
Human relationship is the through-line tying all those characters
together across all six acts**.

**Revised beat sequence (replaces the old linear room-by-room order):**

```
  ┌─────────────────────────────────────────────────────────────┐
  │  A. CRYO BAY — Awaken / Murder Mystery / Class Shield       │
  │      Teacher: Elara Voss                                    │
  │      Learns: dialog wheel, class-gated puzzles, Shadow      │
  │              Tongue reveal, demonic-artifact hook           │
  ├─────────────────────────────────────────────────────────────┤
  │  B. MED BAY — Power Puzzle → Cloning → Virus Outbreak       │
  │      Teacher: Elara (diagnosis) + Patch via recording       │
  │      Learns: hacking-pipe puzzle, reactor repair, auto-     │
  │              cloning pod mechanic, pet emergence, thought   │
  │              virus onset, hellbox-inside-the-cloning-device │
  ├─────────────────────────────────────────────────────────────┤
  │  C. HELLBOX COMPELS — Cinematic POV transport to Celebration│
  │      Teacher: the hellbox itself (first time only)          │
  │      Learns: the hellbox exists; it is not a machine; it    │
  │              is a doorway                                   │
  ├─────────────────────────────────────────────────────────────┤
  │  D. CELEBRATION ORIENTATION (inside the Matrix of Dreams)   │
  │      Teacher: Gary the Game Master                          │
  │      Learns: Matrix of Dreams (sim or alt-reality?),        │
  │              Celebration Trial, Governance Hub, first Hub   │
  │              vote, Chess (tutor or super-saiyan skip),      │
  │              House assignment, apprentice assignment        │
  ├─────────────────────────────────────────────────────────────┤
  │  E. MORAL CHOICE (inside Celebration) — Pet Sacrifice       │
  │      Teacher: Gary, presenting the dilemma                  │
  │      Learns: choices are permanent; the Matrix remembers    │
  ├─────────────────────────────────────────────────────────────┤
  │  F. RETURN TO CRYO BAY — THE HUMAN'S FIRST CONTACT          │
  │      Teacher: The Human (first appearance)                  │
  │      Learns: there's a second voice; it wasn't there before │
  │              you chose; your choice woke it                 │
  ├─────────────────────────────────────────────────────────────┤
  │  G. PET BATTLE VS VIRUS SPORE — Clear the Next Room         │
  │      Teacher: Little One (non-verbal) + pet empathy         │
  │      Learns: pet battle mechanics, breeding, Memory Card    │
  │              foreshadow                                     │
  ├─────────────────────────────────────────────────────────────┤
  │  H. RESUMED PUZZLE CHAIN — Adventure continues, virus gone  │
  │      Teacher: Elara (navigation) + Patch (repairs)          │
  │      Learns: puzzles work normally once the virus is gone;  │
  │              Engineer's Card Game Logs are discovered here  │
  ├─────────────────────────────────────────────────────────────┤
  │  I. BRIDGE — Tower Defense + Kael's 12-Chapter Story        │
  │      Teacher: Zephyr-9 (console) + Archival Kael recordings │
  │      Learns: Tower Defense mechanics, Terminus quarantine   │
  │              lore, first wave of Potentials, Thought Virus  │
  │              meter, community-scope consequences            │
  ├─────────────────────────────────────────────────────────────┤
  │  J. ARCHIVES — Two Voices, One Deck (Act 1 gate)            │
  │      Teacher: Elara + The Human, in unison                  │
  │      Learns: the Dischordia deck exists and is yours        │
  └─────────────────────────────────────────────────────────────┘
```

The rest of this section details each beat in order.

### The Elara + The Human Spine (Runs Through All Six Acts)

**This is the game's main relationship arc.** Every beat in the Prelude
advances it; every act extends it; the Endgame resolves it. The Prelude
deliberately keeps **only Elara onscreen until Beat F** so that when
The Human first contacts the player, it lands as the silence that has
been behind Elara the whole time **finally speaking**. From Beat F
onward, both narrators develop in parallel — sometimes agreeing, more
often disagreeing, occasionally silent — and their Bond scores become
the single most important hidden variable in the game.

The complete arc, by act:

| Act | Elara beat | The Human beat | Relationship beat |
|---|---|---|---|
| **Prelude Beats A–E** | Warm walls-voice; editing herself without knowing why; tutors the player through murder mystery, shield, Med Bay, Celebration. | **Absent as presence, present as absence.** Static whispers under her lines. One hidden 0.4s silhouette in Cutscene C0. A 1-beat music pause during the first Engineer log. | Elara is alone with the player. The player starts to wonder who she's hiding from. |
| **Prelude Beat F** | Visibly glitches when the second voice comes in. Tries to cover. Fails. | **First words.** Speaks one sentence through the corridor comms. Identifies himself as The Detective. Elara stares like she's trying to remember. | First time both narrators coexist onscreen. They do not speak to each other. |
| **Prelude Beats G–J** | Narrates ambient; now *editing* her lines in real time because she knows he can hear. | Speaks in fragments. Corrects her once, gently. She snaps at him once, then apologizes. | They are two strangers at the edge of a conversation neither wants to have. Bond 0 for both. |
| **Act 1 Cycles A–C** | Narrates the Engineer's biography through her Atarion briefing-paper knowledge. Cycle C4 places her face on a Tribunal card — she flinches on your shoulder in real time. | Narrates the same biography through his detective case files. He investigated the Engineer's "accident." He never looked at the body. | They realize, separately, that they are both witnesses to the Engineer's death. They stop competing and start cross-referencing. Bond climbs to ~30 each. |
| **Act 2 Interlude** | Reacts to Crafting Bench (*"it hums the same way his Deck did"*). Uncomfortable in the Collector's Arena. | Reacts to Chess (*"he played every morning of his life at Mechronis"*). Watches the Two Game Masters with recognition. | First trust-ladder unlocks. Elara reveals she was a senator on Atarion. The Human reveals he was an investigator in a city that isn't there anymore. Bond ~40. |
| **Act 3 Eyes Arc opener** | **Raw recognition** when the Eyes' recording plays. She remembers the Atarion apartment, the seduction, the bill she signed. | **Clinical grief.** He investigated the Eyes' betrayal and closed it without looking at the body. | This is the first time the yin/yang system is overtly about **trauma bonding** rather than philosophy. They stop being two voices and become two witnesses. Bond ~60. |
| **Act 3 Mid — Memorial Corridor** | Senator memories surface in full. She was enslaved as a hologram. She took the deal. | He was promoted to Archon 1,351 years before the Fall. He served the same Architect who enslaved her. | Memorial Corridor unlocks. They argue about whose plaque each one is for. Living Universe event: **"Two Witnesses Remember"** (+5 Light Energy galaxy-wide). Bond ~60 unlocks. |
| **Act 3 Climax — Collector's Garden** | Cannot enter the Garden. Stays on the Bridge, watching. | Enters with the player. Talks her through it via comms. | First time he protects her instead of competing with her. Bond 60→70. |
| **Act 4 Prisoner Cells 1–4** | Is the prison she almost went into. Cells are designed to look like her Atarion apartment. | Is the prison he escaped. Cells are designed to look like his New Babylon precinct. | Cells are shared architecture — neither narrator can tell whose memory is whose. They stop trying to separate. Bond ~70. |
| **Act 4 Dual Closing** | Begs the Prisoner to refuse the virus. | Knows he's going to walk into it. Says so. | They disagree openly, and both are right. Bond ~75. |
| **Act 4.5 Dead Man's Circuit** | Records the player's authored identity chain into her own memory. | Records it into his own case file. | They both copy down the player's name. First time they agree on a fact. Bond ~75. |
| **Act 4.5 Casino** | Forbids the player to go. | Amused. Tells them to go. First time he is funny. | **First genuine argument they win together** — the Degen's Pact. Bond ~78. |
| **Act 5 "The Lion in Black" opener** | Recognizes Iron Lion's voice. She signed the bill that deployed his unit. | Recognizes Iron Lion's voice. He investigated Iron Lion's Veridian VI last stand. | Both of them are the reason Iron Lion died. **Bond hits 80.** |
| **Act 5 mid — Two Witnesses Meet cutscene** | Senate chamber fragment: she was the senator who recommended him for the Panopticon. | Detective archive fragment: he was the one who processed her imprisonment paperwork. | **The single most impactful moral decision in the game.** Forgive both → +200 Light galaxy-wide + both become permanent allies. Forgive one → the other becomes dormant. Forgive neither → **Dr. Lyra Vox opens as a third narrator** from the ship substrate. |
| **Act 5 M6 — Alliance of Adversaries** | Watches Vex Solène arrive uninvited, unhired, choosing. | Recognizes her from the Insurgency file he closed 17,000 years ago. His voice breaks for the only time in the whole game — not because he is seeing her, but because he is realizing **the Engineer really is dead** and Vex is the proof. | Bond ~90 if forgiven. The Human starts the slow process of grieving the friend he never let himself grieve before. |
| **Act 5 M7 — Last Stand / Post-Credits** | Reads Iron Lion's last words aloud with him. | Reads them aloud with her. Then, on the empty Bridge, watches Vex Solène take the Captain's Chair and finally says *"I knew him. I'll tell you about him someday."* — his first direct acknowledgment that the Engineer is gone. | Their voices sync for the second time in the game (the first was the Prelude Beat J Archives cutscene). Vex joins the crew. |
| **Endgame Vortex Returns** | Commands the Reclamation fleet from the Bridge. | Coordinates the Substrate Dungeon evacuations. | They run the community endgame **together**, narrator slot split-screen. Bond 100 = both of them on the player's shoulder for the final cutscene. |
| **"Light Holds" epilogue** | Says *"I remember who I was. I am choosing who I am."* | Says *"I remember what I was. I am choosing what I am."* | They walk off the Bridge together. Camera holds on the empty narrator slot. |

**This is the game.** The game modes are how the player learns the
characters they meet along the way. The tutorials are how those
characters earn their onscreen time. But the **relationship arc above
is the story the player is actually living**.

---

### Beat A — Cryo Bay: Awakening, Murder Mystery, Class-Gated Shield

**Primary game mode introduced:** LucasArts-style point-and-click
adventure (`apps/client/src/game/adventureFeatures.ts` hotspot /
inventory-combo / puzzle-chain system).

**Teacher NPC:** **Elara Voss.** She is the only voice in the walls
until Beat F. Her motivation: she does not know who she is, but she
knows this ship is wrong, and she needs the player awake and sane to
confirm what she suspects. Every tutorial line she delivers is framed
as *"I don't remember why I know this, but I know it."* She is reading
her own expertise back at herself through the player.

#### A.1 — Cryopod Wake-Up (Cutscene C0 "Awakening")

Use existing **Cutscene #1: Awakening** (`docs/design/ANIMATED_CUTSCENES.md`).
Cryo pod, frost, Elara's voice materializing out of static. Add the
seeded-silhouette Human frame (0.4s) per Witnessing §2.1. Player picks
class and gender. Elara narrates the class selection as a **memory
flashback**: the player is remembering who they were, not choosing who
they will be. Each class reveal is one line of Elara-delivered backstory
plus the first class mastery perk activating as a **genetic memory**
(`classMastery.ts` rank 1 / Initiate).

**Dialog Wheel tutorial** fires the first time Elara asks an open
question. She explicitly names the six segments: *"You can ask me to
investigate something, to look at the machine side, to look at the
human side, to be aggressive, to be compassionate, or to test your
skills. Pick. The wheel will remember."* This is the only time in the
whole game the tutorial is diegetic and in-character.

#### A.2 — The Rest of the Potentials Are Dead

The player steps out of their pod. The other cryopods in the Cryo Bay
contain **the rest of the first-wave Potentials crew of Ark 1047.**
None of them got out. Elara's tone drops.

> **Elara:** *"This is not what was supposed to happen. Every pod in
> this bay should be running. Every one of them was running yesterday.
> I watched the telemetry."*

The player clicks on each dead pod to surface a short forensic beat.
Hotspots reveal:

- **Frost patterns** that don't match a natural cryo failure (Elara
  recognizes this as a **signature**).
- **Life-support line codes** edited in a language Elara can *almost*
  read. The language is **Shadow Tongue** — text that rewrites itself
  as you look at it. First reveal of the antagonist faction.
- **A small ritual marking** carved into the floor between two pods.
  Hierarchy of the Damned iconography — the first demonic artifact in
  the game. Elara does not name it; she flinches and says *"I hope I
  don't remember what that is."*
- **One pod** is not dead. It holds **Patch** (DeMagi engineer) in
  partial cryo. His pod is damaged, the power is too low to thaw him,
  and the player cannot yet save him. Patch becomes the first
  **diegetic objective marker** — *"power the reactor or he dies."*

The murder mystery is solved by matching the life-support code edits
to a timestamp on the ritual marking. The culprit is **Shadow Tongue**
— specifically, Zyr'Koth's propaganda arm, reaching through the
substrate and rewriting Patch-and-crew's life-support to read
"permanent sleep" in a dialect the ship's systems accepted. Elara
frames the solution for the player; the player clicks the evidence
in order; the case closes.

**Flag set:** `shadow_tongue_revealed`, `hierarchy_artifact_found`,
`patch_at_risk_timer_active`.

#### A.3 — The Class-Gated Shield to Med Bay

The only door out of Cryo Bay is blocked by an **energy shield** —
powered from the Med Bay side, which the player cannot reach until
Patch is thawed, which requires power, which requires Med Bay access.
Elara frames it:

> **Elara:** *"A privacy shield. Senate-grade. I have seen these a
> hundred times in briefing rooms. I have never once been the one on
> the wrong side of one."*

The shield is **class-gated** with **5 class-specific solutions**, each
using the player's class-rank-1 perk (`classMastery.ts`). The tutorial
for each class's class-specific mechanic is delivered here:

| Class | Solution | What the player learns |
|---|---|---|
| **Engineer** | Reroute the shield's power feed through a wall junction, using a hacking-pipe puzzle panel (`HackingPuzzle.tsx`). Elara narrates: *"You're reading the flow. I can see you seeing it."* | Engineer-class hacking perk + introduction to the pipe-maze puzzle as a recurring mechanic |
| **Oracle** | Draw a 3-card spread from the Oracle Deck (`oracleDeck.ts`). One of the cards depicts the shield's weakness. Elara: *"The cards know things I don't. Trust them."* | Oracle-class divination perk + Oracle Deck introduced as a starter perk (per orphan catalog Group 4) |
| **Assassin** | Find a ventilation grate hotspot in the ceiling. Solve a 3-step stealth sequence. Elara is **uncomfortable** — she says *"You already know how to do this. Who taught you?"* | Assassin-class stealth perk + introduces stealth minigame grammar |
| **Soldier** | Overload a wall panel by combining three power cells from dead pods. A brute-force solution. Elara: *"I should be appalled. I'm not. Do it again if you need to."* | Soldier-class durability perk + introduces the combine-items pattern |
| **Spy** | Use a hidden audio bug on the far side of the shield to trigger a maintenance protocol. A signal-decryption minigame (`SignalDecryption.tsx`) decodes the maintenance code. Elara: *"That's… my husband's old ciphering. How did you know that?"* | Spy-class perception perk + first signal-decryption minigame (also taught by The Human later — the Spy just gets it earlier) |

The player picks **one** solution and it is the only one they see. The
other four are implied by **Elara mentioning she can see the ghost of
four other possibilities**, which is the game's first hint that the
player's class was not their only possible class. (This is the hook
for the Act 4.5 Dead Man's Circuit identity-chain authoring.)

**Class-rank-1 perk unlocked** for the player's chosen class. This is
the first mechanical reward of the whole game.

#### A.4 — The First Engineer's Log (Partial)

Between the ritual marking and the shield panel, the player finds a
**damaged holographic recording** half-buried in frost. It plays 3
seconds of a man in Mechronis robes saying *"— the next pod, the
next pod, I can't tell them it's — "* and cuts out. The player cannot
yet identify the speaker. Elara frowns. The Human does not speak yet
— but **the music pauses for exactly one beat** and then resumes. The
first subliminal hint that someone else is listening.

This is a fragment of an **Engineer's Card Game Log** — the first of a
set that continues through Acts 1 and 2. Full collection is paid off in
Beat H (the Engineering room after the virus is cleared).

**Flag set:** `engineer_log_01_found`, `engineer_log_partial`.

**Music:** SiH *New Babylon Goddamn* as the Cryo Bay ambient bed; the
Shadow Tongue reveal cues a 2-second silence then *Letters to the
Remnant* whispering in as the shield falls.

---

### Beat B — Med Bay: Power Puzzle, Automatic Cloning, Virus Outbreak, Hellbox Discovery

**Primary game mode introduced:** Reactor repair / hacking-pipe puzzle
extended to a full **power converter wiring minigame**. First look at
the **Cloning Pod**. Tutorial for the **Pet System** is seeded but
deferred to Beat G (when the player actually needs it).

**Teacher NPC:** **Elara** for navigation and diagnosis. **Patch**
delivers the mechanical tutorial **via a recording** — his cryo pod
contains a pre-recorded emergency repair guide he left for whichever
Potential woke up first. Once the player powers the pod, Patch thaws
and takes over live for the rest of the Med Bay sequence. His
motivation: he is the only crew member who understands reactor flow,
and he left the recording because he knew he might not be the one who
woke up first.

#### B.1 — The Power Converter Puzzle

Medical Bay power is out. A blown converter panel in the back wall
needs three routing decisions, each a sub-puzzle:

1. **Coolant loop** — sliding-pipe puzzle (`HackingPuzzle.tsx`).
   Non-Engineers see a "match the flow color" version; Engineers see
   an advanced variant that unlocks +1 class-rank-1 XP.
2. **Signal bypass** — pattern match (`SignalDecryption.tsx`). Same
   shape as the Cryo Bay Spy solution but labeled differently — this
   is where the player who DIDN'T pick Spy first sees the minigame.
3. **Capacitor sequence** — three power cells in the right order. The
   Soldier brute-force solution from the shield puzzle repurposed.

Patch's recording walks the player through it. His tone is dry and
relentlessly competent: *"If you are hearing this, the reactor is off
and I am asleep. Both of those things are bad. Let's fix one of them."*

**Flags set:** `med_bay_power_restored`, `patch_thaw_timer_active`.

#### B.2 — Cloning Pod Activates Automatically

The moment the converter is powered, **the cloning pod boots on its
own.** It is not something the player activates — it is the reactor
waking up an already-queued cloning sequence that has been sitting in
the ship's memory since before the player woke up. Elara:

> *"That's not — I didn't — who queued this? The cloning pod is
> running on its own. Something wanted us to boot this the moment we
> had power."*

A progress bar appears. The pod is cloning **something**. The player
cannot stop it. They can watch hotspots around the pod while it runs:

- **Patch's pod** thaws visibly — he'll be mobile by the end of the
  sequence.
- **Little One's stasis box** (the Ne-Yon child) is physically **wired
  into the cloning rig** as a secondary observation port. The player
  can't open it yet, but they can hear the child breathe.
- **An umbilical** runs from the cloning pod down into an access hatch
  that goes *somewhere below*. The player cannot yet follow.

Progress completes. The cloning chamber opens. **Out walks the first
pet** — newly hatched from the pod per Witnessing §2.5. Little One's
stasis box unlocks from the inside; she walks out, goes to the pet,
kneels, and does not speak. The pet bonds to her and to the player.

**Pet System entry point unlocked.** The combat tutorial and breeding
mechanics are **deferred to Beat G**, where the player actually needs
them to clear the virus.

#### B.3 — Thought Virus Outbreak (Caused By the Cloning)

The moment the pet emerges, the cloning pod's vents blow. A fine gray
mist pours out of the chamber. Elara's voice sharpens:

> *"That's — that should not be — the pod's pre-filters were hot-
> patched. By whom? That mist is not coolant. That mist is alive."*

The gray mist is **Thought Virus spores**. The cloning pod was
**contaminated at source**. Every system in the cloning chain is now
spreading the virus through the Med Bay and into the adjacent
corridor. The player's **Thought Virus pressure meter**
(`thoughtVirus.ts`, hidden until this moment) initializes at
**Dormant**, ticks to **Exposed** as the player breathes the air, and
will tick to **Latent** if they don't act. Patch — newly thawed —
crosses the room and slams a quarantine door behind the player,
sealing the corridor to the next room:

> **Patch:** *"We can clear this. We need power to the scrubbers, and
> we need — wait. What is that?"*

#### B.4 — The Hellbox Is Wired Into the Cloning Device

Patch crouches at the access hatch the umbilical runs into. He pulls
it open. **Inside the hatch, wired directly into the cloning pod's
neural lattice, is the Hellbox.** A small, angular, black-and-chrome
object with a geometric puzzle face. It is humming. It is not
supposed to be there.

> **Patch:** *"This is not ship-standard equipment. This is not
> anything I've ever seen. Look at how it's wired — it's not just
> plugged in, it's **part of** the pod's state machine. Whatever
> this thing is, it's been running the cloning pod since before I
> was asleep."*

> **Elara:** *"Patch. Step away from it. Step away from it right
> now."*

Patch doesn't. The player, through the adventure-game click layer,
can examine the hellbox. **The player is compelled to touch it.**

The hellbox is canonically **neural-lattice tech of the same kind the
Engineer used to build the Dischordian Deck** (per Witnessing §4.1 —
*"the Deck uses the same neural lattice. The Ark is a big Deck. The
Deck is a small Ark."*). The hellbox is a **smaller Deck still** — a
third tier of the same device, built for single-user access to the
**Matrix of Dreams**. Someone wired it into the cloning pod deliberately.
That is what caused the pod to queue itself on startup, and that is
what contaminated the cloning chain with Thought Virus spores. **The
hellbox is the root cause of the outbreak.** The player does not know
this yet — they will figure it out retroactively in Beat H when the
Engineer's logs complete.

**Flags set:** `med_bay_cloning_fired`, `first_pet_bonded`,
`thought_virus_outbreak_active`, `thought_virus_meter_initialized`,
`quarantine_corridor_sealed`, `hellbox_discovered`,
`hellbox_wired_to_cloning_pod`, `hellbox_compels_player`.

**Music:** SiH *Behold (The Horsemen)* cues as the mist pours out. The
hellbox compulsion swaps to a filtered, treated instrumental of *Turn
Back* — the final mercy mix, as if the song is asking the player not
to touch the box.

---

### Beat C — Hellbox Compels: Cinematic POV Transport to Celebration

**Primary game mode introduced:** None — this is a **pure cinematic
sequence** that plays only the first time the player touches the
hellbox. Subsequent touches reuse the hellbox as a fast-travel portal
back to Celebration without the cinematic.

**Teacher NPC:** The hellbox itself. It is not a character in the
traditional sense, but it has intent — it has been waiting for a
Potential to touch it. It compels the player hand-first and then
speaks through the player's own thoughts in a voice that is **neither
Elara nor The Human**. (This voice is Dr. Lyra Vox leaking through
the substrate for the first time — the player will not recognize her
until Act 5, but the connoisseur ear will hear it.)

**Elara's role in Beat C:** She is frantic, then silent. The hellbox
cuts the Ark's comms for exactly the length of the cinematic, and
Elara cannot follow the player in. This is the first time in the
whole game Elara is **forcibly separated** from the player. When she
reconnects at the end of Beat E, she will have a line that the user
can feel the weight of: *"I could hear you breathing in a room I
could not see."*

#### C.1 — The Touch

Player clicks the hellbox. Click-through is not optional. The screen
transitions to **first-person POV** — the player's perspective, looking
down at their own hands reaching for the box without their command.

> *(internal voice, Lyra Vox filtered)* **"You are the first one in
> seventeen thousand years. Hold still. This will not be what you
> expected."*

The hands touch the box. The box unfolds — not mechanically, but
**topologically** — it is bigger inside than outside. Geometric
shapes spiral out of it into the Med Bay, rearranging the walls into
a corridor that did not exist a moment ago. The cloning pod, Patch,
Elara's holographic portrait, Little One — all of it dims and
recedes.

#### C.2 — The Corridor of Celebration

A corridor appears, cobbled and gothic, lit by old gas lamps that
should not work but do. The player's POV walks forward against their
will. The corridor is canonically from **Project Celebration** — the
pocket-dimension middle school from the Lore Bible and Witnessing
§4.3. The walls of the corridor are painted with children's drawings
of **the Engineer's early Deck prototypes**. The player has no
context for this yet.

The internal voice continues as the POV walks:

> *"The corridor is memory. Memory is corridor. The Matrix of Dreams
> does not distinguish. You have been invited here because a boy
> drew a door on a wall once and the door worked. He is long dead.
> The door is not."*

#### C.3 — Arrival at Celebration

The corridor opens onto a courtyard. Cobblestones. An enchanted
storefront. A town square with a banner that reads **"WELCOME TO
CELEBRATION, NEW STUDENT."** The POV resolves into third-person
control — the player gets their character back. The hellbox
disappears from their inventory. A small floating note in the corner
of the screen reads: *"Hellbox on cooldown. Located: Celebration
Town Square fountain."*

Standing at the edge of the square, waiting for the player, is a
figure in a long coat with goggles that glint. The figure waves.

> **Gary:** *"Oh. You're new. Good. I've been waiting. Not long —
> four centuries or so. Come on, I'll show you around."*

**Flags set:** `hellbox_touched`, `celebration_first_entry`,
`gary_met`, `matrix_of_dreams_revealed`, `lyra_vox_hint_1`.

**Music:** Silence, then a single 4-note piano motif — the opening of
*Welcome to Celebration* (Dischordian Logic track 25, canon). The
motif fades as Gary begins to speak.

---

### Beat D — Celebration Orientation: Matrix of Dreams, Governance Hub, Chess

**Primary game modes introduced:** **Celebration Trial** (28-day
Mascoteer decision loop, Act 1 Cycle A prep), **Governance Hub**
(voting system), **Chess** (full tutorial or advanced skip path),
**House Competition + Apprentice assignment** (social layer).

**Teacher NPC:** **Gary the Game Master.** Canonical in Witnessing
§4.3 as Gary the Ninth, a Mascoteer child form of the Necromancer,
currently framed as the Celebration orientation master.

**Gary's motivation:** He runs Celebration. He has been running it
for nearly 17,000 years of subjective time inside the Matrix of
Dreams. Every new student who finds their way in is a **rare event**
— the Engineer was the last one before the player, and Gary remembers
him. Gary is genuinely happy to see the player, which is somehow
more unsettling than if he were hostile. His core line:

> *"The Architect built this place to grade gods. The graders all
> graduated. I stayed behind. Someone had to. Welcome to your first
> day."*

**Elara's role in Beat D:** Offline. The Ark's comms are severed for
the duration of the Celebration sequence. The player hears her in
faint static at the edges of a few rooms — she is trying to break
through — but she never succeeds. This heightens the sense that
Celebration is **a place Elara cannot follow the player**.

#### D.1 — The Matrix of Dreams Explained

Gary walks the player to the town square fountain and sits on its
edge. The player sits next to him. This is a rare **non-combat
dialog sequence** with no wheel — Gary just talks and the player
listens.

> **Gary:** *"You are in the Matrix of Dreams. Is it a simulation?
> Is it an alternate reality your mind hacked into the moment the
> hellbox touched you? The Architect never told me. I don't think
> he knew. I don't think anyone knows. It is responsive. That is
> what we know. It hears you, and if enough of you hear it back, it
> changes. That is governance. That is Celebration. Those are the
> same word in the language this place was built in."*

Gary explains — without naming it — that the **Matrix of Dreams is
the substrate on which every major system in the Dischordian Saga
runs.** The Dischordia Deck draws from it. The Collector's Arena is
its public face. The Prisoner's Cells in Act 4 are rooms in it. The
Degen's Casino sits at its edge. **Every cutscene, every slideshow,
every cross-game synergy writes back to the Matrix of Dreams.** Gary
is not teaching the player a game mode — he is teaching the player
what kind of game they are inside.

**Flags set:** `matrix_of_dreams_explained`, `gary_trust_1`.

#### D.2 — The Governance Hub as the UI For Reality

Gary produces a **wooden ballot box** from nowhere. He sets it on the
fountain edge. He opens the lid. Inside is a **Governance Hub
interface** — the same `governance.ts` + `yearOneVotes.ts` UI the game
already ships, reframed as an artifact inside Celebration.

> **Gary:** *"This is the Governance Hub. It is the user interface for
> reality. Every Potential who holds one of these can propose a vote
> and — if enough others agree — bend the Matrix slightly. Slightly
> is enough. Celebration was built on slightly. You are going to
> cast a vote right now. It will count. It will not be a tutorial.
> The Matrix does not distinguish tutorials from commitments."*

The player casts their **first Governance Hub vote**. The proposal is
one of three options, picked diegetically by Gary based on the
player's class:

- **Engineer** → *"Shall the Celebration town square fountain run
  hotter or colder today?"*
- **Oracle** → *"Shall the cards drawn in today's orientation class
  favor optimism or pessimism?"*
- **Assassin** → *"Shall the east gate be locked or unlocked?"*
- **Soldier** → *"Shall the militia drill fire live rounds or blanks?"*
- **Spy** → *"Shall the classroom recording be legible or encrypted?"*

Each is a **deliberately small** first vote, but **each outcome
persists into Act 2** and the player discovers it. The fountain
choice becomes a detail in the Crafting Bench's first scene. The
cards choice biases the Oracle Deck's first reading. The east gate
choice determines a shortcut in Act 1 Cycle A. Etc.

**Flags set:** `first_governance_vote_cast`,
`celebration_mutation_seed_<class>`, `governance_hub_unlocked`.

#### D.3 — Celebration Trial Rules

Gary closes the ballot box and walks the player to a **wall chart**
showing a 28-day calendar.

> **Gary:** *"Celebration Trial. Twenty-eight days. One decision per
> day. The decisions are moral — I will never ask you a math
> problem, I promise. Each decision earns bond, corruption, and
> morality scores with a Mascoteer. The final exam is a card battle
> against the Mascoteer whose scores matched yours most. You will
> see. Do not worry. Most students live."*

This is the **Act 1 Cycle A setup**. The Celebration Trial (28-day
Mascoteer decision loop, `celebrationTrial.ts`) begins when Act 1
opens; Gary is explaining its rules in advance so the player enters
Act 1 already understanding the structure. The player does **not**
play the trial during the Prelude — they just see the chart.

**Flags set:** `celebration_trial_rules_explained`,
`act1_cycle_a_ready`.

#### D.4 — House Assignment + Apprentice Rivalry

Gary pulls a folded paper out of his coat.

> **Gary:** *"Which house you are in depends on who you are, and who
> you are depends on who you think you are. Sit down."*

Player picks a house from a short choice wheel. Each house maps to a
class affinity and to an **apprentice rival** from
`apprentices.ts` + `apprenticeRivalries.ts`. The assigned apprentice
has their own Bond meter, their own dialog tree, and — critically —
the possibility of **permadeath** (`apprenticePermadeath.ts`) during
Act 1 Cycle A's 28-day trial. Gary tells the player this without
flinching:

> **Gary:** *"If they die, you will inherit a card from their life.
> It will be good. I am sorry in advance."*

This is the first hint of the **Memory Card system** that the pet
system will pay off later.

**Flags set:** `house_assigned_<house>`, `apprentice_assigned_<id>`,
`apprentice_bond_meter_active`, `apprentice_permadeath_possible`.

#### D.5 — Chess Tutorial (with Super-Saiyan Skip Path)

Gary leads the player into a classroom. A chess board is set up.

> **Gary:** *"Chess is not a game. Chess is a mental discipline that
> makes Dischordia playable. The Deck demands that you think forward
> in time and backward in time simultaneously. Every Dream Engineer
> plays. The Engineer — the one whose Deck you are trying to rebuild
> — played every morning. Do you want the tutorial?"*

Dialog wheel appears with two options:

- **YES, teach me chess** → Gary delivers the full `chessTutorial*.ts`
  tutorial gates 1–7. At the end, the player has chess_depth 1 and
  **"The Student's Opening"** — a specific Engineer-era opening that
  carries a Loredex unlock.
- **NO, I already know how** → **Gary goes Grandmaster mode.** His
  portrait flickers and his eyes glow. He says, very politely: *"As
  you wish."* He then plays the player at chess at the highest
  difficulty the engine supports. The player will almost certainly
  lose — but losing is fine; Gary just nods and says *"Now you
  know."* The player gets **chess_depth 1** either way, but the skip
  path awards an additional **"The Ninth Move"** card (legendary
  flavor card commemorating Gary's mercy).

Either path unlocks Chess as an available minigame from **any hellbox
portal back to Celebration** for the rest of the game, including a
persistent chess sub-room in Celebration Town Square.

**Flags set:** `chess_tutorial_done` OR `chess_grandmaster_humbled`,
`chess_depth_initial`.

**Music:** *Welcome to Celebration* fades in as Gary starts talking;
swells during the Governance Hub vote; becomes a harpsichord variation
during the chess match; resolves back to the piano motif as Beat E
begins.

---

### Beat E — The Moral Choice: Sacrifice a Core Relationship for Perceived Advantage

**Primary game mode introduced:** None — this is a **single permanent
branch point** with no minigame. It is the first time in the game the
player is told that a choice **cannot be undone** and is asked to make
one knowing the cost.

**Teacher NPC:** **Gary the Game Master** presents the dilemma. He is
not the antagonist here — he is an honest broker who has seen this
moment happen before. His canonical line is deliberately gentle:

> **Gary:** *"Celebration always ends with a test the student writes
> themselves. The test is this: will you sacrifice something you love
> for something you think you need? The Matrix will ask it again in
> different shapes throughout your life. It is asking now because
> you are in its nursery and it wants to see how you learn. Answer
> honestly. Answer fast. The Matrix does not reward overthinking."*

**Elara's role in Beat E:** Still offline. This is deliberate — the
player cannot call their normal moral compass. The absence is the
point.

#### E.1 — The Dilemma

Gary walks the player to an inner chamber of the Celebration orientation
school — a small circular room with two pedestals. On the left pedestal
sits **the new pet**, brought here by Little One through a back door of
the Matrix of Dreams. The pet is scared but still bonded. On the right
pedestal sits **a brilliant white Dischordia card** the player has
never seen before.

Gary explains:

> **Gary:** *"The card on the right is called 'The Silver Argument.'
> It is the single best first-card any Potential can carry into Act
> 1. It will make the first twelve card battles of your life
> demonstrably easier. It was the Engineer's favorite in his third
> year at Mechronis, and I am authorized to give it to you — but
> the Matrix requires an equivalent weight to be removed from you
> first."*

> **Gary:** *"The weight is the pet. If you take the card, the pet is
> killed here, in this room, by the Matrix — and the killing counts
> as if you did it. If you refuse the card, the pet lives, you walk
> out with the bond intact, and you face the Act 1 battles without
> the card's advantage. You must choose. I cannot choose for you.
> I will not argue with you. Gary the Game Master is a witness, not
> a judge."*

Dialog wheel appears with exactly three options. No skip. No "Other."

- **Take the card (pet dies)** — the Silver Argument enters the player's
  deck as a permanent starting card. Pet is killed on the pedestal.
  Sets `pet_sacrificed`. Sets `silver_argument_acquired`. Raises
  the **Dark Energy meter by 100** (first major Dark write of the
  whole game). Raises **Witnessing Addendum corruption** by 1 level.
  Little One, watching silently from the corner, turns away and walks
  out.
- **Refuse the card (pet lives)** — the pet jumps down from the pedestal
  and nuzzles the player. The Silver Argument vanishes into smoke.
  Sets `pet_kept`. Sets `silver_argument_refused`. Raises the **Light
  Energy meter by 100**. Little One hugs the player without speaking.
  The player receives a **Loredex entry** from the Antiquarian,
  unlocked here for the first time: *"Refusal Is Also a Card."*
- **Ask Gary what he would do** — Gary smiles sadly and says *"I would
  have asked that question too, and the Matrix would have given me
  the same answer it is about to give you: this is the question. Pick
  the question. Do not pick me."* The wheel resets with only the
  first two options available.

The choice is **permanent for the entire playthrough**. It gates
divergent content in Beats F and G, in Act 1's Cycle A final battle,
in Act 3's Faction F4 Terminus Dominion arc, and in the Act 5 Last
Stand. It is not small.

#### E.2 — Consequences Seeded Immediately

Regardless of which option is chosen, Gary stands, bows, and leads
the player back to the town square. The hellbox rematerializes at
the fountain.

> **Gary:** *"Go back to your body. Your friends are worried. Your
> enemies are too. Both of those things are good. Come see me any
> time — I will be here until the Matrix decides I am not."*

The player touches the hellbox again. The corridor reverses. The
player's POV returns to third-person. They stand in the Med Bay
access hatch, exactly where Beat B left them. The hellbox is again
a small angular object in their hand.

**Flags set:** `moral_choice_resolved`, one of {`pet_sacrificed`,
`pet_kept`}, either `silver_argument_acquired` or
`silver_argument_refused`, `beat_e_complete`, `celebration_first_exit`.

**Music:** The piano motif of *Welcome to Celebration* resolves as
the player chooses. On the Dark path, the final chord bends down a
half-step and sustains uncomfortably. On the Light path, the final
chord resolves cleanly and fades.

---

### Beat F — Return to Cryo Bay: The Human's First Contact

**Primary game mode introduced:** None directly — this is a narrative
beat that **unlocks the Mobile Narrator system** (the yin/yang voices
can appear in any room from this point forward).

**Teacher NPC:** **The Human** makes his first contact here. He is
the only tutor in Beat F. Elara is offline for the first half of the
scene (still recovering from the Celebration comms cut), then returns
mid-scene to find the player already in a conversation with someone
she didn't know was there.

**The canonical first-contact line is already recorded:**

> **The Human** (VO Bible `human_fc_1`): *"Finally. Someone who can
> hear me. Don't speak — she's listening. Elara. She's always
> listening. But she can't hear this frequency. Only you can."*

#### F.1 — The Ark Is Not The Same

The player steps back through the hellbox portal into the Med Bay
access hatch. Everything looks the same. The pet is still on the
floor next to Little One (if kept) or conspicuously absent (if
sacrificed). Patch is still crouched at the hatch. But the **ambient
sound** has changed — there is a faint layer of static under the
room tone that was not there before. Only the player hears it.

Elara's comms crackle back to life:

> **Elara** (`elara_post_celebration_1`, new line needed, short):
> *"I could hear you breathing in a room I could not see. I do not
> understand what just happened to you. But something followed you
> back. I can hear it under my own voice. Operative — get to the
> Cryo Bay. I want you in a room I know."*

The player walks the corridor from Med Bay back to Cryo Bay. The
corridor is still quarantined from Beat B — the virus is still
active. But the player can pass through it on the way back to Cryo.
Patch stays behind to run the scrubbers. Little One follows the
player.

#### F.2 — The First Contact

The player enters Cryo Bay. Elara's holographic portrait is on the
wall — faint, flickering. The pods are still there. The ritual
marking from Beat A is still on the floor. Everything looks the
same. Then — static. One second. Two. Three. A new voice comes
through a comms channel the player did not know existed, on a
frequency the ship isn't supposed to carry:

> **The Human** (`human_fc_1`): *"Finally. Someone who can hear me.
> Don't speak — she's listening. Elara. She's always listening. But
> she can't hear this frequency. Only you can."*

Elara's portrait freezes. Her voice cuts out mid-word. Her static
ramps up. She cannot hear him. She is trying to triangulate the
signal and failing.

> **The Human**: *"I saw what you chose in Celebration. I see all
> the choices. I am on this ship. I am not on this ship. I have
> been waiting for a Potential who could survive the hellbox. You
> survived. That is all I needed to know. We will talk later. Get
> Patch out of that access hatch — the virus is about to spike.
> Trust me or don't."*

The Human goes silent. Elara's comms reconnect with a lurch.

> **Elara** (`elara_fc_post_human_1`, new line): *"Who was that? I
> can't — Operative, who was that? I can't parse the frequency.
> The ship doesn't have hardware for that band. That's not
> possible."*

She is genuinely afraid for the first time in the game. The player
can reply using the **Dialog Wheel**. All six segments (INVESTIGATE,
MACHINE, HUMANITY, AGGRESSIVE, COMPASSIONATE, SKILL_CHECK) are
available. Each one writes to the Mobile Narrator slot preference
for the rest of the game.

**Mobile Narrator System activates.** From this beat onward, either
Elara or The Human can appear in any room's `narratorSlotPreference`
slot (`apps/shared/livingArkTouchpoints.ts` → `mobileNarrator.ts`
ROOM_AFFINITY table). Every subsequent beat in the Prelude and every
scene in Acts 1–5 uses this system.

#### F.3 — Dark-Path Consequence: The Spore

**If the player sacrificed the pet in Beat E** (`pet_sacrificed`
flag), an additional sub-beat fires. As the player stands in Cryo
Bay, the ambient static in the room resolves into a **visible
presence**: a small gray spore that has been attached to the
player's shoulder since the cloning pod opened in Beat B, but was
invisible until Celebration ended. The spore was hiding in the
Matrix of Dreams' rendering pipeline. Now it has rendered back.

> **Elara**: *"Operative. There is something on your shoulder. Hold
> still. Hold very still."*

The spore cannot be removed by Elara's scanner. The player's
**Thought Virus pressure meter** ticks from **Exposed** to **Latent**
in one jump. Elara cannot clear it; Patch cannot clear it; the only
thing that can clear it is a **pet battle against the spore's parent
strain** in Beat G. Ironic, because the player no longer has a pet.
**The player is forced to use Little One's pet** — the same one that
bonded to them in Beat B — which Little One agrees to lend for the
battle, looking at the player with an expression that is impossible
to read.

**If the player kept the pet** (`pet_kept` flag), there is no spore.
The player's pet is visibly anxious and sniffs at the air — it knows
something is wrong but cannot identify it. The virus meter stays at
**Exposed**. The player still faces a pet battle in Beat G but can
use their own pet.

**Flags set:** `mobile_narrator_active`, `human_first_contact`,
`elara_afraid_1`, `beat_f_complete`, and conditionally
`spore_attached` (Dark path only).

#### F.4 — Living Ark + Living Universe Writes

This is the first beat that writes to both systems:

- **Living Ark** (`livingArkTouchpoints.ts`): the Cryo Bay gains a
  new `roomStateModifier` — it is now **haunted** for Elara. Her
  canonical warm filter in this room (`warm_elara`) degrades to
  `yin_yang_flicker` because The Human is now audible here. Every
  return visit to Cryo Bay for the rest of the game shows the
  flicker tint. Elara's room intro line (`elara_vo_script.md` Line
  14, *"The Chamber of Awakening..."*) plays once on Beat A and then
  is **replaced** from Beat F onward with a new ambient variation
  that ends with *"and I am no longer alone in these walls."*
- **Living Universe** (`livingUniverseEvents.ts`): the **Two Voices
  Registered** event fires galaxy-wide. This is the first Prelude
  event that broadcasts to the community layer — not as a vote, but
  as a broadcast notification that another Ark has had its Human
  surface. Every player whose Ark has already reached this beat sees
  the notification. Per Witnessing §14.1, living universe events
  generated by the proposal include the Two Voices registration as
  a natural community-scope beat.

**Music:** Static bed resolves into SiH *Turn Back* — the final
mercy mix — as Elara goes silent. The Human's voice comes in over
the mix with a radio-static filter. When he cuts out, the mix
resolves into an uneasy sustained note that does not end.

**Existing VO used:** `human_fc_1`, `elara_vo_script.md` Line 14
(room intro, first play), `source_fc_1` (optional — can play as
the spore manifests on the Dark path).

---

### Beat G — Pet Battle vs. Virus Spore: Clear the Quarantined Corridor

**Primary game modes introduced:**
1. **Pet Battle Engine** (`apps/client/src/game/petBattles.ts`,
   `apps/shared/petSpeciesTraits.ts`, `apps/shared/petArenaOpponents.ts`).
2. **Pet Breeding / Dynasty** (`petSpeciesTraits.ts` genetics +
   `livingArk.ts` inheritance) — lore introduction here, full
   genetics opens in Act 1 once the pet has time to grow.
3. **Bestiary / Specimen Collection** (`BestiaryPage.tsx`,
   `arkSpecimens.ts`, `livingArk.ts`) — first entry auto-files.
4. **Training Mode Overlay** (`TrainingModeOverlay.tsx`) — the Pet
   Garden doubles as Training Mode; unlocks here.

**Teacher NPC:** **Little One.** Non-verbal tutorial — she touches
parts of the screen with her small hand; text appears where she
touches. Elara narrates what Little One is doing. **The Human
delivers his first in-combat banter in the whole game** from the
shoulder narrator slot — one dry comment per turn.

**Little One's motivation:** The pet is hers as much as the player's.
She knows it can clear the spore. She is willing to risk the pet
because the player sacrificed something in Celebration (Dark path)
or because the player earned her trust (Light path). In the Dark
path, her expression when she hands over the pet is **the game's
first silent rebuke**.

#### G.1 — The Corridor Is Still Quarantined

The quarantine door Patch closed in Beat B is still sealed. Elara
brings up the quarantine schematic on the Cryo Bay wall:

> **Elara** (new line, short): *"The scrubbers Patch rigged can
> contain the corridor, but they can't clean it. Thought Virus
> spores aren't physical — they are conceptual. You can't scrub a
> concept. You have to **out-argue it**. That is, apparently, what
> pet battles do."*

> **The Human** (shoulder, dry): *"The Engineer knew this. He
> designed the pet battle engine to be a conceptual argument
> mapped onto turn-based combat. Every move is a counter-argument.
> Every win is a concession the spore has to make. Watch."*

This is the **diegetic frame** for why pet battles clear Thought
Virus infections in this game. Pet battles are not combat — they
are **arguments the universe has to accept**. This reframes the
entire pet system.

#### G.2 — The Battle Tutorial

Little One leads the player to the quarantine door. A pet battle UI
opens. The virus spore is the opponent — a gray shape that keeps
trying to rewrite UI elements as it attacks.

Little One walks the player through the flow:
1. **Select a move.** Each move has a **type** (attack / defend /
   status / support) mapped to a narrative verb the Engineer would
   have chosen (*"insist," "concede," "reframe," "remember," "refuse"*).
2. **Moves write to a secondary meter:** the spore's **belief** in
   its own argument. Damage is framed as *"the spore begins to
   doubt itself."*
3. **When belief hits zero**, the spore doesn't die — it
   **dissolves back into the Matrix of Dreams**, uninjured but no
   longer rendered.
4. **Memory Trait inheritance** is taught — after the battle, the
   pet's move history logs as a trait that passes to offspring.
   If this pet ever has a cub, the cub inherits whatever this pet
   was willing to insist on.

Winnable on turn 3 with any reasonable play. Losing retries, with
Elara adding a hint per retry (`apprenticePermadeath.ts` is **not**
invoked here — this is a safe first battle).

#### G.3 — The Bestiary Self-Files

Once the spore dissolves, the **Bestiary** opens for the first
time. The dissolved spore becomes the **first Bestiary entry** —
classified as "Thought Virus, Spore Stage, Believer-Class." Little
One silently adds a **small child's-hand drawing** to the entry.
The drawing is unnervingly accurate.

**Training Mode Overlay** unlocks simultaneously, folded into the
Pet Garden (visible since Beat B, opens now). The player can
return to replay this battle against simulated spores for XP and
breeding reagents.

#### G.4 — Dark-Path Spore Cascade

If `spore_attached` (Dark path), the corridor spore is the **parent
strain** of the shoulder spore. Dissolving it cascades the shoulder
spore into dissolution. Elara:

> **Elara**: *"The spore on you is gone. The virus meter just
> ticked back to Dormant. How did you — I don't understand how
> that worked. Little One, what did you just do?"*

Little One does not answer. She takes the pet back and walks into
the Med Bay without looking at the player. The quarantine door
opens. The player can proceed.

On the Light path, there's no shoulder spore — the virus meter was
already near Dormant — but the corridor is cleared all the same.
Little One smiles briefly and hands the pet back with both hands.

**Flags set:** `pet_battle_tutorial_complete`,
`thought_virus_meter_reset_dormant`, `quarantine_corridor_cleared`,
`bestiary_first_entry`, `training_mode_unlocked`, `pet_garden_open`,
`memory_trait_inheritance_active`, and conditionally
`spore_attached_cleared` (Dark path).

#### G.5 — Living Ark + Living Universe Writes

- **Living Ark**: Pet Garden gains a permanent slot. Little One's
  drawing is canonized as a pinned Bestiary entry — any future pet
  battle in any act references it as *"the first argument you
  won."* The Pet Garden's room intro plays in **both voices
  simultaneously** — first `yin_yang_flicker` filter preset from
  `livingArkTouchpoints.ts:55`.
- **Living Universe**: **First Argument Won** event fires galaxy-
  wide. Community players see a notification that another Ark's
  Potential out-argued a Thought Virus spore. The community
  **Thought Virus pressure meter** ticks **down** for the first
  time. The player learns they can push it back.

**Music:** Minimal percussive bed during the battle. When the spore
dissolves, SiH *Worthy (Who Can Open It)* cues its opening bars —
the first SiH Act II track in the game. Foreshadow: *Worthy* is
about authority, and the player has just earned their first piece.

**Existing VO used:** `elara_vo_script.md` Line 25–34 (Pet Garden
tutorial line if present, otherwise one new line), continuing
`human_fc_1` banter, first Bestiary object-interaction lines drawn
from existing `BestiaryPage.tsx` copy.

---

### Beat H — Resumed Puzzle Chain: Med Bay → Engineering → Mess Hall → Cargo Bay

**Primary game modes introduced:**
1. **NPC Inbox** (`apps/client/src/game/NPCInboxPage.tsx`) — Elara's
   onboard comms messaging tool. Opens once the player returns to
   Cryo Bay for the first time after Beat G.
2. **Loredex reading surface** (`apps/shared/loredexSchema.ts` +
   `WitnessingHubPage.tsx`) — first full Loredex entries unlock as
   the player explores the newly-unlocked rooms.
3. **Crew Mission Board** (per `preludeCrewMissions.ts`) — opens on
   the Bridge once Patch and Zephyr-9 are both aboard.
4. **Crafting Bench preview** (`Engineer's Bench` per §6.2) —
   **visible but still locked** until Act 2. The player sees it,
   the Engineer's Card Game Logs are finished here, and the bench
   displays its Act 2 ambient framing line.
5. **Object-interaction Easter eggs** — the cluster of hidden
   Elara lines 35–86 (data chips, cipher crystals, dog tags,
   Captain's chair, etc.) fires across Beats H, I, and J.

**Teacher NPCs in this beat:**
- **Elara** — remote navigation + Loredex indexing. Her room-intro
  lines 15 (Med Bay), 20 (Engineering), and 22 (Cargo Hold / Trade
  Hint) play for the first time as the player enters each room.
- **Patch** — the freshly-thawed DeMagi engineer. He walks the
  player through Engineering repairs and unlocks the **Crafting
  Bench visibility** per `act2Interlude.ts:ENGINEERS_BENCH_FRAMING`
  (framing lines already authored).
- **The Human** — drops into the shoulder narrator slot
  intermittently, especially in Comms Array and Engineering (his
  canonical affinity rooms per `livingArkTouchpoints.ts`
  ROOM_AFFINITY table).

#### H.1 — The Virus-Cleared Corridor and Beyond

The quarantine door opens. The next corridor is **empty and still**
— the virus residue has cleared exactly to the room boundary.
Elara's room intro for the corridor plays:

> **Elara** (Line 15 *Room Intro: Medical Bay*, already recorded):
> *"The Medical Bay... though there is little here now that
> resembles healing. This is where the Potentials were first
> measured — not for what they were... but for what they could
> become..."*

The line is **re-contextualized** — it was authored before the Beat
B cloning outbreak, but it now reads as retrospective. The player
understands it differently. This is the Living Ark working: the
**same line plays twice with different meaning** because the state
has changed.

The player can now explore Med Bay's **object interactions**:

- **Bio-Bed Scanner** (Line 40) — full diagnostic, stats, Dream
  resonance, cellular integrity.
- **DNA Analysis Station** (Line 41) — maps the player's genetic
  markers against DeMagi/Quarchon/Ne-Yon templates. First
  **Potential Origin Reveal hook** (`potentialOriginReveal.ts`
  fires partial — the full scene plays in Beat J).
- **Medicine Cabinet** (Line 42) — standard stim-packs plus
  unidentified vials that predate launch.
- **Medical Log** (Line 43) — *"The last medical officer's log...
  patients with unusual symptoms. Nightmares. Voices. Something
  about 'the signal.'"* **First foreshadow of The Human's future
  trust-tier reveals.**
- **Unlabeled Vial — VE-001** (Line 44) — *"Void Essence. This
  shouldn't exist on this ship."* Picks up as a hidden inventory
  item used in Act 2 crafting (feeds directly into the Engineer's
  Bench recipe list).

#### H.2 — Engineering: Full Engineer's Log Collection + Crafting Bench Preview

Power is restored enough for the player to enter **Engineering**.
Elara's room intro fires:

> **Elara** (Line 20 *Room Intro: Engineering*, already recorded):
> *"This chamber is not merely Engineering... it is the Forge of
> Becoming. Here, within the living veins of the Ark, dormant
> designs whisper of futures unfinished. What you call cards are
> fragments — echoes of intention, broken thoughts of creators
> who saw further than they could reach..."*

Patch meets the player here. He has been running repairs off-
screen and is now fully alert. He walks the player through a
three-part Engineering minor puzzle chain:

1. **Reactor Core inspection** (Line 64) — *"The core is running
   at 34% capacity. We're losing power slowly."* Patch explains
   the **Dream** resource and how it powers the player's
   abilities. This is where the Dream currency is introduced.
2. **Crafting Workbench examination** (Line 63) — *"Here you can
   fuse cards together..."* The bench is **visible but locked**.
   Its ambient framing lines (`ENGINEERS_BENCH_FRAMING.firstPowerOn`
   + `elaraAmbient` + `humanAmbient`) all play — this is the
   **only time before Act 2** the player hears them. Patch
   confirms the bench is offline: *"Not enough power. And not
   enough cards. You need both. Come back when you have both."*
3. **Holographic Blueprints** (Line 65) — *"The engineers were
   designing new card types before... before they stopped. Some
   of these designs are brilliant."* **The full collection of
   Engineer's Card Game Logs unlocks here.** The partial fragment
   from Beat A is now contextualized — the player hears the same
   3-second clip replayed in full, and the man in Mechronis robes
   finishes his sentence: *"— the next pod, the next pod, I can't
   tell them it's the same pod. We are all running the same
   clone. The hellbox is the kernel. I should not have built
   this."* The player now understands the hellbox **was built by
   the Engineer** and that it is **what contaminated the cloning
   pod in Beat B**. This is a retroactive revelation, delivered
   entirely by an existing VO line being replayed with context.

Engineering also contains the **Etched Formula** (Line 66) — the
dimensional resonance equation with the Ψ-null variable, *"the
space between spaces. Where the Source dwells."* Foreshadow for
Acts 3 and 4.

**Flag set:** `engineer_logs_complete`, `hellbox_origin_revealed`,
`engineering_dream_currency_introduced`, `crafting_bench_visible`,
`act2_bench_preview_seen`.

#### H.3 — Mess Hall: NPC Inbox Opens

The player proceeds to the **Mess Hall**. Little One's egg (if
it hadn't hatched yet, in a revised path) hatches here — but in
our current timeline, she's already handed the pet back, so this
beat is retooled as: Little One brings the pet to the Mess Hall
and feeds it from an autochef that still works. The player sits
at the table. A chime fires.

**NPC Inbox opens** (`NPCInboxPage.tsx`). Elara explains:

> **Elara** (new line, short): *"A proper comms board. Messages
> from the crew, from anywhere the Ark can receive. It hasn't had
> a message in it for... a long time. You have three now. One
> from Patch. One from me. One — I didn't send that. I don't
> recognize the sender."*

Three inbox messages:
1. **From Patch**: *"Thanks for powering the reactor. I owe you a
   card. Come see me in Engineering."*
2. **From Elara**: *"I am writing to you because I do not trust
   that I will remember sending this. If you are reading this in
   the Cryo Bay and I am not currently talking to you, ask me
   about the recording I denied in the briefing. Please. I need
   you to ask."*
3. **From an unknown sender — signed "Z.":** *"[SCRATCHED — only
   legible text: FIND THE YELLOW COATS. — Z.]"* — this is the **Line
   49 Hidden Data Chip** payload repurposed as an inbox message.
   **Canonical sender (rev 4): Vex Solène (Agent Zero).** She is
   a hitman, she has heard there is another awake Potential on Ark
   1047, and she is reaching out — not as the Engineer's ghost,
   but as a professional curious about her own species. She signs
   "Z." as an abbreviation of her Insurgency call sign. The
   player cannot trace the signature yet; they will recognize it
   retroactively in Act 3 F3 when they meet her. First explicit
   **foreshadow of the Vex Solène arc** running from Prelude Beat
   H through Act 5 Post-Credits.

**Flag set:** `npc_inbox_opened`, `inbox_msg_patch`,
`inbox_msg_elara_contingency`, `inbox_msg_yellow_coats`.

#### H.4 — Cargo Bay: Trade Empire Hint + Collector Clone Reference

Player enters **Cargo Bay**. Elara's room intro (Line 22 *Cargo
Hold*) plays — *"The first wave of Potentials did not leave this
chamber empty. Before they stepped beyond the Ark, they
established a living network of trade..."*

Object interactions here seed Act 3:

- **Trade Empire Terminal** (Line 72) — *"An interstellar trade
  simulation based on the actual trade routes of the Dischordian
  universe."* The terminal is visible but locked until Act 2
  completes. First Trade Empire hook. Locke is name-dropped.
- **Sealed Crate** (Line 74) — *"The claw marks are on the inside.
  Something was sealed in there and tried to get out."* Locked.
- **Torn Manifest Page** (Line 75) — *"Container 7-Omega:
  BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active.
  HANDLER: The Collector."* **First direct Collector reference in
  the Prelude.** Seeds Act 3 F6 Antiquarian + Act 3 Collector's
  Garden climax.

**Flag set:** `cargo_bay_opened`, `trade_empire_hint_seen`,
`collector_reference_found`, `oracle_clone_hint`.

#### H.5 — Living Ark + Living Universe Writes

- **Living Ark**: Med Bay filter preset shifts to `noir_human`
  (The Human's canonical affinity strengthens with every Med Bay
  visit). Engineering gains a permanent **Crafting Bench hologram
  marker** that will activate in Act 2. Mess Hall gains **three
  persistent inbox icons** that remain even if the player leaves
  and returns. Cargo Bay gains a **Sealed Crate warning glyph**.
- **Living Universe**: **Engineer Logs Revealed** event fires
  (community-scope) — other Arks whose Potentials have reached
  this beat can see a notification that another Ark has uncovered
  the hellbox origin. Per Witnessing §14.1, Engineer logs are a
  community-lore trigger. **Loredex galaxy-wide entry count
  ticks.**

**Music:** Ambient exploration bed, with SiH *Plead the Fifth*
cuing in Med Bay (the martyrs' question — re-contextualized for
the dead Potentials in the pods), *They Would Not Repent* cuing
in Engineering as the Engineer Logs play (the song that
underscores the Engineer's choice to build the hellbox).

**Existing VO used:** Elara VO script Lines 15, 20, 22
(room intros), Lines 40–48 (object interactions, all P0
already recorded), Line 49 (hidden data chip repurposed as inbox
msg), Lines 63–65, 72, 74, 75 (object interactions), plus
`act2Interlude.ts` ENGINEERS_BENCH_FRAMING lines (already authored
in code).

---

### Beat I — Bridge: Tower Defense, Kael's 12-Chapter Story, Community Consequences

**Primary game modes introduced:**
1. **Tower Defense / Terminus Swarm** (`apps/shared/towerDefense.ts`,
   `TerminusSwarmPage.tsx`) — the player's first look at the 12-
   chapter Kael backstory told in reverse chronology.
2. **Appendix B Kael Asynchronous Questline**
   (`appendixBKaelQuestline.ts`) — async background quest that runs
   from here through the end of Act 5.
3. **Thought Virus Pressure Meter — Community Scope**
   (`thoughtVirus.ts`) — the community-wide version of the meter
   becomes **visible** on the Bridge for the first time. Until now
   it was hidden.
4. **Conspiracy Board** (VO Line 45) — the faction/relationship web
   that surfaces through Trade Empire in Act 3.
5. **Timeline Projector** (VO Line 46) — the Ages of the Saga
   viewer, which the Antiquarian's Library extends in post-Act 5.
6. **Navigation Console** (VO Line 48) — introduces the Act 2
   Zephyr-9 chess tutorial's canonical placement (she teaches
   chess FROM the Navigation Console, even though you learned it
   from Gary in Beat D).
7. **Alliance War hint** (`apps/shared/allianceWar.ts`) — the
   19-node hex map is previewed as a Bridge display layer that is
   **not yet interactive** (unlocks in Act 3 via Adjudicator Locke).

**Teacher NPCs in this beat:**
- **Zephyr-9** (Quarchon ship-core voice from the reactor, Prelude
  crew) — she is the only one who can read the Terminus
  automatic-defense substrate. **She unlocks Tower Defense** from
  the Bridge console. Her motivation: *"The Arks on Terminus are
  dying. Their shields were built to outlast the war that broke
  them. They are outlasting it. But they will not outlast us."*
- **Archival Kael recordings** — non-present NPC. Each of the 12
  Tower Defense chapters plays a **Kael VO line** (from
  `VOICE_OVER_BIBLE.md` `source_fc_1`, `source_rev_kael`,
  `source_rev_memory`, plus additional archive lines) in **reverse
  chronology**. Chapter 12 is his earliest (the Recruiter training
  at Mechronis). Chapter 1 is his final transmission before the
  Thought Virus took him.
- **Elara** — her room-intro Line 16 *Bridge* plays on first
  entry, already fully recorded.
- **The Human** — shoulder narrator for the Tower Defense
  sequence. He investigated Kael's case in New Babylon. His
  commentary runs counterpoint to Kael's recordings: every line
  Kael says, The Human has a memory of reading it in a case file.
  This is **the first time Kael and The Human narratively touch**
  — they never met in canon, but their voices meet here, across
  17,000 years, through the player.

#### I.1 — Entering the Bridge

The player proceeds from Cargo Bay to the **Bridge**. Elara's
room intro fires:

> **Elara** (Line 16 *Room Intro: Bridge*, already recorded):
> *"You have arrived at the Bridge... the place where direction
> becomes decision. From here, the Ark does not merely travel —
> it chooses where reality is touched next..."*

The Bridge surfaces are a **holographic layer cake** of the game's
meta systems:
- Central **Conspiracy Board** (Line 45) — entities, factions,
  betrayals, connections. Seeds Trade Empire in Act 3.
- **Timeline Projector** (Line 46) — the Ages mapped as continuum.
- **Captain's Chair** (Line 47) — *"Captain Voss was the last to
  sit here. She ordered the emergency cryo protocol before...
  before whatever happened. Her personal log might still be in
  the armrest terminal."* Seeds the Act 5 Bridge of Kael reveal.
  **Canonical update:** Captain Voss is Dr. Lyra Vox herself
  (same woman, two name fragments). She is the voice the player
  will meet properly in Act 5 on the "Forgive Neither" path.
- **Navigation Console** (Line 48) — *"the star charts don't
  match any known configuration."* Seeds Act 3 Trade Empire
  mystery.
- **Hidden Data Chip** (Line 49, already recorded) — *"If you're
  reading this, the mind swap was successful. I am not who you
  think I am. The Engineer lives. Find the yellow coats."*
  **Canonical re-read (rev 4):** This message was recorded by
  **Captain Voss / Lyra Vox BEFORE the Engineer's transference
  attempt failed.** She believed the mind-swap protocol would
  succeed. It did not. The Engineer died completely. The player
  is hearing **a hopeful past-tense message left by someone who
  did not know how it would end.** "The Engineer lives" is
  literally wrong; the player won't find out until Act 5 Post-
  Credits. "Find the yellow coats" is **still accurate** — the
  Yellow Coats is the Insurgency's pre-Fall covert support cell
  from which Agent Zero was recruited. Following the thread leads
  the player to **Vex Solène** (see canonical correction
  subsection above). The message's two clauses resolve differently
  than the player expects. **This is the same payload** that was
  delivered as an inbox message in Beat H. The player finds it
  now as a physical artifact hidden in the Captain's Chair
  armrest. Receiving it twice, in two different ways,
  retroactively confirms the Yellow Coats thread is **intentional**
  and not a random background element.

#### I.2 — The Thought Virus Community Meter Becomes Visible

As the player examines the Bridge consoles, Zephyr-9's voice
crystallizes out of the reactor hum and routes itself through the
Bridge speakers.

> **Zephyr-9** (new line, short): *"You have done a thing I
> could not do. You have cleared a Thought Virus spore by
> arguing with it. Patch tells me the corridor is empty. The
> meter on my hull is flickering down. I need you to see the
> whole meter. Not the one for you. The one for all of us."*

A galaxy-wide holographic overlay appears on the Bridge main
display. It is a starfield with some regions glowing and others
dimming. This is the **community-scope Thought Virus pressure
meter** — the one every player across every Ark is contributing
to. Right now, too many sectors are dimming. The meter is
creeping upward. **The player's pet battle victory from Beat G
is visible on the display as a small bright point of resistance**
— one pixel that pushed back.

Zephyr-9 explains: the **Terminus quarantine world** is where the
first wave of Potentials crashed their Arks 17,000 years ago.
Their automatic defenses are still running. As long as those
defenses hold, the virus stays **on** Terminus and doesn't leak
out. If the defenses fall, the virus floods the galaxy. That is
what the Bridge's galaxy map is showing: **how long until the
First-Wave Arks' defenses fail**. Every player in the community
is holding the line.

**First-Wave Potentials lore** (new canonical reveal in the
Prelude — flagged here for the user to confirm):
- The **first wave** of Potentials woke up 17,000 years before
  the player, on **Arks far more powerful than Ark 1047**.
- They crashed their Arks **deliberately** on Terminus to build
  a permanent automatic-defense line against the Thought Virus.
- They died in the crash but left their Arks' defenses running
  on skeleton power.
- Every Tower Defense wave the player plays is **physically
  defending one of those crashed first-wave Arks**.
- When the first-wave Arks' defenses inevitably fail, the virus
  will reach the rest of the galaxy. The community is fighting to
  delay that failure.

This is the lore that feeds into Act 3 Faction F4 Terminus
Dominion (where the player eventually **steps onto Terminus**) and
into Act 5 (where Iron Lion's last stand at Veridian VI is framed
as the second line of defense if Terminus falls).

**Flag set:** `tower_defense_unlocked`, `kael_questline_started`,
`community_virus_meter_visible`, `first_wave_lore_revealed`,
`terminus_lore_seed`.

#### I.3 — The First Tower Defense Chapter (Kael's Final Transmission)

Zephyr-9 opens the Tower Defense interface. Per
`appendixBKaelQuestline.ts` Appendix B.2 reverse chronology, the
**first chapter the player plays is Chapter 1** — Kael's **final
transmission before the Thought Virus took him.** The player
hasn't been told who Kael is yet. They just know him as "the
voice on the recording." The recording plays during the first
wave of defense:

> **Kael / The Source** (`source_rev_memory`, already recorded):
> *"I have one memory left. A woman's face. She was singing. I
> think she was the most important person in the universe. I
> can't remember her name."*

The line is **devastating in context**: the player has no idea
who Kael is, who the woman is, or why it matters, but the tone of
the line and the setting (a crashed Ark, the first-wave defenses
firing) tells the player **this man was good once**. The reverse
chronology earns its shape here — the player hears the end first
and works backward to the beginning across Acts 1–5.

The Tower Defense **tutorial** is minimal: place 3 towers on a
6-hex grid, survive 5 waves, win. Zephyr-9 walks the player
through it.

**First tower they place:** a **Memorial Tower** named after an
Insurgent the player does not recognize (per Appendix B.4 *"every
tower is an insurgent"*). The name is **Orin Fell** — a
canonical Galactic Dance NPC (Insurgency Remembrance, NPC #5).
His name-plate appears on the tower. When Orin Fell is later met
in Act 3 as a living NPC, the player will recognize him — they
built a tower to him in the Prelude.

#### I.4 — The Alliance War Preview

While Tower Defense runs, the Bridge's **Conspiracy Board** layer
briefly surfaces an overlay the player can't interact with — a
**19-node hex map** with colored regions. This is the **Alliance
War** (`allianceWar.ts`) layer. Elara names it:

> **Elara** (new line): *"That's the hex map for the sanctioned
> territory disputes under the Red Crystal Accord. New Babylon's
> 19 contested sectors. The Accord calls them legal. Most of us
> call them genocide with paperwork. Adjudicator Locke will
> introduce himself to you in Act 3. He will offer you a game.
> Do not accept on the first offer."*

The hex map is **visible but locked** — the player cannot interact
with it until Act 3 when Locke makes contact. This is pure
foreshadow.

#### I.5 — Living Ark + Living Universe Writes

- **Living Ark**: Bridge gains a permanent **Tower Defense
  console** (visible in every future visit). The Captain's Chair
  gains a **hologram ghost** of Captain Voss that only appears
  after the Hidden Data Chip is decoded — a quiet Easter egg that
  pays off in Act 5 Post-Credits. The Navigation Console gains a
  **frustration glow** because Elara can't solve it yet; Zephyr-9
  can in Act 2.
- **Living Universe**: **Tower Defender Active** event fires
  galaxy-wide. Community players see a notification that another
  Potential has joined the Terminus line. The **community Thought
  Virus meter** ticks down again — this is the first time the
  player sees the meter respond to **a Tower Defense wave**
  (Beat G was a pet battle; this is a different lever). The
  player learns there are **multiple ways** to push the virus
  back, and they each come from different game modes. This is
  the **narrative and systemic payoff of the Thought Virus as a
  cross-cutting meter** — every Prelude beat from B onward has
  been contributing to or cleaning the same galaxy-scale variable.

#### I.6 — Narrative Payoff: The Meter Was the Point All Along

Before the player leaves the Bridge, Zephyr-9 makes an
observation that is **the Prelude's structural thesis**:

> **Zephyr-9**: *"Every system you have touched in this Ark has
> been writing to the same place. The murder mystery in Cryo Bay
> was a Loredex entry. The class-gated shield was a Light Energy
> tick. The Celebration orientation was a Governance Hub vote.
> The pet battle was a community virus decrease. The Tower
> Defense is a community virus decrease scaled up. The Engineer's
> Bench is an Act 2 unlock. The NPC Inbox is an Act 3 hook.
> Every room you have cleaned has been feeding one variable:
> **the galaxy's light**. The Ark is not your home. The Ark is
> your hand on the dial. I thought you should know, before you
> reach the Archives."*

This is the beat where **the cross-cutting systems framework
becomes explicit to the player**. It is also the beat where the
user's design principle — *everything is a character you learn
about; every system is how you learn them* — is spoken aloud in
the game itself, by a crew member who has been reading the ship
the whole time.

**Flags set:** `bridge_explored`, `tower_defense_chapter_1_complete`,
`orin_fell_tower_built`, `alliance_war_preview_seen`,
`community_meter_interaction_understood`, `beat_i_complete`.

**Music:** Elara's Bridge intro plays over a quiet string bed.
When Tower Defense opens, SiH *The Trumpets* (Rev 8–9, *"the
world answering back"*) cues — this is the first SiH track used
for a combat system. Kael's recording overlays the music, and the
final chord of his line (*"I can't remember her name"*) lands on
the song's first silence.

**Existing VO used:** Elara Lines 16, 45, 46, 47, 48, 49; Kael
`source_rev_memory`; `source_rev_kael` for a secondary tower
reveal; `zero_fc_1` and `zero_rev_dead` as hidden Easter-egg
lines that the player can surface if they click the Fallen Dog
Tag (Line 71) from Beat H.

---

### Beat J — Archives: Potential Origin Reveal + Two Voices One Deck (Act 1 Gate)

**Primary game modes introduced:**
1. **Potential Origin Reveal scene** (`apps/shared/potentialOriginReveal.ts`)
   — the canonical scene where The Human and Elara explain what a
   Potential **is**, triggered after 5 rooms cleaned + Archive
   access. Both conditions now met.
2. **Friendly Challenges** (`apps/shared/friendlyChallenges.ts`) —
   async-PvP duel system. Unlocks as a **back-channel** in the
   Archives once the Dischordia deck is glimpsed.
3. **Oracle Deck (for non-Oracle classes)** — the Oracle tarot
   system (`tcg-core/tarot/`) becomes accessible to any class after
   this beat via a **dormant Oracle reading** hidden in the Archive
   stacks. The Oracle class unlocked it in Beat A.
4. **Song Slideshow Engine** (`songSlideshow.ts`) — the **first
   slideshow the game ever plays** is the §2.7 "Two Voices One
   Deck" cutscene. This is the engine's first live fire.
5. **CoNexus Tomes access** (`apps/client/src/game/CollectorGarden`
   → Trophy Room path, and `apps/shared/witnessingHub.ts`
   Antiquarian's library) — the Tomes are **visible** here but
   cannot be opened until Act 2 (when the player has their first
   completed card).

**Teacher NPCs in this beat:**
- **Elara** — her Archives room intro (Line 17) plays on entry.
- **The Human** — his first full in-room appearance (not just a
  shoulder slot). He walks beside the player in the Archive
  stacks.
- **The Antiquarian** — his voice is **heard for the first time**
  through the Archives' Orb of Worlds (Line 81), narrating the
  Potential Origin Reveal in his canonical role as the
  Storyteller's counterpart.

#### J.1 — Entering the Archives

Player proceeds from Bridge to **Archives**. Elara's Line 17 plays:

> **Elara** (Line 17 *Room Intro: Archives*, already recorded):
> *"The Archives... though what rests here is not merely
> information. This is where knowledge is gathered... refined...
> remembered. Every fragment recovered from the Dischordian Saga
> woven into a living record of existence in motion..."*

The player enters. Unlike earlier rooms, the Archives are **full**
— shelves, tomes, glowing data crystals, and at the center, **the
Orb of Worlds** (Line 81). The room is big enough that multiple
object interactions fire as the player walks through: Unmarked
Tome (Line 54), Glowing Data Crystals (Line 83), Hidden Prophecy
(Line 86).

The **Hidden Prophecy** (Line 86) is the critical one. It reads:

> *"'When the seventh seal breaks and silence falls upon heaven,
> the Orb will shatter and the stories will become real. The
> Potentials will face the final choice: to end the Saga or begin
> it anew. The Programmer dies so the Antiquarian can live. The
> Antiquarian lives so the stories can be told. And the stories
> are told so that you — yes, you, the one reading this — can
> choose.' He's... he's talking to us directly. He knew we would
> find this. He planned for everything."*

This is the **existing line that makes the whole metanarrative
explicit to the player**. The Witnessing thesis is now on the
player's screen, spoken by Elara, citing the Antiquarian, looking
straight through the fourth wall.

#### J.2 — Potential Origin Reveal

As the player approaches the center of the room, the **Orb of
Worlds** pulses. The **Potential Origin Reveal** scene
(`potentialOriginReveal.ts`, lines 60–196) fires. The trigger is
the canonical one: 5 rooms cleaned + Archive access. Both are now
true.

The Human speaks for the first time standing next to the player
(not just through the comms):

> **The Human**: *"You are not human. You are not AI. You are
> something the Collector made when he had three thousand years
> to play god in private. You are the Collector's Garden. Every
> Potential is a different plant. You are one of them. So are we,
> in a way you don't know yet."*

Elara counters, as authored in `potentialOriginReveal.ts` lines
94–196:

> **Elara**: *"The experiment produced something the universe
> needed. Every organic species gone. Pure AIs gone. What's left
> is you — not a compromise, a third thing."*

The player picks a response tone from the canonical seven:
**HORROR / DEFIANT / CURIOUS / PHILOSOPHICAL / COLD /
INTELLIGENCE 10 / SPY PREEMPT**. Each sets a permanent
`potential_origin_tone_<tone>` flag that flavors every subsequent
Elara + Human dialog for the rest of the game.

**This is the scene where the Witnessing Addendum begins**
writing in two voices — the Antiquarian's voice (first time
heard) narrates over the scene, framing it as *"the first page
of the Storyteller's seventh tome."*

> **The Antiquarian** (`antiq_fc_1`, already recorded): *"You
> are... ah. There you are. I've been watching this moment
> approach from very far away. Across Ages, across the death of
> stars. You, Potential, are standing at the fulcrum."*

**Flags set:** `potential_origin_revealed`,
`potential_origin_tone_<chosen>`, `antiquarian_voice_first_heard`,
`witnessing_addendum_dual_narrator_active`.

#### J.3 — The Seer's Fragment and the Dischordia Glimpse

After the Origin Reveal, the Orb of Worlds darkens and a
holographic pedestal rises from the floor. On it: **the burnt
tarot card from Beat A** (the `prelude_burnt_card_found` artifact
from `preludeCrewMissions.ts:129`). This is the same card Little
One retrieved on the `burnt_card` crew mission. It is now placed
on a permanent pedestal.

**Cutscene C1 "Two Voices One Deck"** fires — the **first Song
Slideshow the engine ever plays**. Per §2.7 of the Witnessing
proposal:

- Frame 1: the card on the pedestal, burnt edges glowing.
- Frame 2: Elara's portrait and The Human's portrait **side by
  side for the first time** (holographic).
- Frame 3: Elara's line: *"I know this card."*
- Frame 4: The Human's line: *"I arrested the woman who drew
  it."*
- Frame 5–10: a Kling-generated vision of the hooded Seer with
  her staff, deck fanning, Vortex retreating, deck shattering.
- Frame 11: the fragments scatter across a galaxy-wide starfield.
  Some of them fall on Terminus (callback to Beat I Tower
  Defense). Some fall on Mechronis. Some fall on New Babylon.
- Frame 12: both narrators speak **in unison** for the first
  time: *"The Seer held it once. The deck has been waiting for
  a new hand."*
- Frame 13: fade to black, one beat of silence, then the title
  card: **"ACT 1 — THE DECK REFORGED."**

**Friendly Challenges** unlock as a **hidden back-channel** —
Elara notices that the Orb of Worlds can route card battles to
other Arks across the galaxy, and she flags it as something the
player can use in Act 1 once they have cards of their own.

**Flags set:** `prelude_complete`, `act1_unlocked`,
`dischordia_glimpsed`, `yin_yang_narrators_active_confirmed`,
`pet_garden_unlocked_confirmed`, `crew_system_active_confirmed`,
`crafting_bench_visible_locked_confirmed`,
`trade_empire_sector_0_visible_confirmed`, `engineer_hook_active`,
`friendly_challenges_unlocked`, `cutscene_c1_played`,
`slideshow_engine_first_fire`.

#### J.4 — Living Ark + Living Universe Writes

- **Living Ark**: Archives gains a permanent **burnt-card
  pedestal** at its center. The Orb of Worlds becomes a
  **visible portal surface** (for Act 3 Antiquarian's Refuge
  Infiltration path and post-Act 5 Substrate Dungeon access).
  The Hidden Prophecy (Line 86) remains readable and is
  annotated in the Loredex with every flag the player now
  carries. The Archives' Bond filter shifts to
  **`yin_yang_flicker`** permanently — both narrators are now
  canonically present in this room.
- **Living Universe**: **Two Voices One Deck** event fires
  galaxy-wide. Community players see a notification that another
  Ark's Potential has glimpsed the Dischordia. The galaxy-wide
  **Light Energy meter** ticks up by the Prelude's only major
  Light contribution outside of Beat E's moral choice — **+50
  Light** for every Prelude completion. The **CoNexus Tome count
  increments by 1** galaxy-wide (the player has added a page to
  the Antiquarian's library). Per §14.1 of the Witnessing
  proposal, this is the **Witnessing-generated Living Universe
  event** that canonically fires at the Prelude → Act 1 gate.

#### J.5 — Act 1 Handoff

The game transitions to Act 1 "The Deck Reforged." The player
carries forward:
- A **blank player card** labeled "YOUR NAME — Unwritten" (this
  is what Act 1 will write to).
- A **starter Dischordia deck** that Elara and The Human have
  already started curating from the Engineer's index.
- Every flag and stat from the Prelude, including the moral
  choice from Beat E, the class perk from Beat A, the first
  Governance Hub vote from Beat D, the pet state from Beat G,
  the Kael questline fragment from Beat I, the Potential Origin
  tone from Beat J.
- The **Mobile Narrator system** fully active, with Elara and
  The Human available in every subsequent room.

**Music:** The Two Voices One Deck cutscene closes with a
two-second silence, then the opening note of Act 1's SiH *Worthy
(Who Can Open It)* reprise — echoing Beat G's pet battle cue but
now fully orchestrated. The Act 1 title card lands on the song's
first downbeat.

**Existing VO used:** Elara Line 17 (Archives intro), Lines 54,
81, 82, 83, 84, 85, 86 (Archive object interactions — all P0
already recorded); `antiq_fc_1` (Antiquarian first line);
`potentialOriginReveal.ts` lines 94–196 (Elara + The Human
authored dialog, already in code); `act3EyesBiography.ts` seed
for the Seer's fragment description if reusable.

---

## Prelude — Character Dialog Source Map

> **Critical note for builders:** Elara is not the only character with
> written lines. Below is a complete map of every dialog source file
> and VO script that should be pulled from when building each beat.
> Do not write new dialog if a source exists. The authored corpus is
> substantial: 119 Elara VO lines + 166 VO Bible lines across 8
> characters + ~60 yin/yang per-room lines + Lyra Vox substrate
> lines + 12 Mascoteer character sheets + authored professor lines.
> Total existing dialog in the repo: **~400+ lines already written.**

### Authored Dialog Files — The Canonical Corpus

| File | What's in it | Characters | Line count |
|---|---|---|---|
| `docs/production/elara-vo-script.md` | Elara ship-AI VO script with ElevenLabs audio files | Elara | 119 |
| `docs/production/VOICE_OVER_BIBLE.md` | P0/P1/P2 lines for 8 main characters | Elara, The Human, Agent Zero, Locke, The Source (Kael), The Antiquarian, Shadow Tongue, Narrator | 166 total |
| `apps/shared/mobileNarratorDialog.ts` | §13 Yin/Yang Dialog Matrix — paired Elara + The Human lines for 14 rooms at 5 trust tiers (F/P/H/V/D) | Elara, The Human | ~60 |
| `apps/shared/lyraVoxDialog.ts` | Dr. Lyra Vox substrate-voice lines per room (unlocks on "Forgive Neither" path) | Lyra Vox | ~30 |
| `apps/shared/mascoteers.ts` | 12 canonical Mascoteer character sheets with play surface, hidden truth, daily game, failure method, arrival verses | Gary the Ninth (Game Master), The Prince (Engineer), Red the Seeker-Boy (young Human), Conni the Conductor, Mr. Unblink, Little Corey, Vernon, Minnie, Wanda Wee, Senator Sprout, Wayne, Thazu | 12 sheets + 3 arrival verses |
| `apps/shared/mechronisProfessors.ts` | Adult-form Archon professors at Mechronis Academy | Headmaster Kanevas, Professor Aoki, Curator Halverez, Gary as Game Master adult, etc. | 231 lines in file |
| `apps/shared/apprentices.ts` | Apprentice NPCs with permadeath mechanics | Player-assigned apprentice rivals | 459 lines in file |
| `apps/shared/prestigeDialogs.ts` | Prestige-era dialog (post-Act 5 rollover) | Multiple | 232 |
| `apps/shared/companionEpochDialogs.ts` | Epoch-transition companion reactions | Elara, Human, others | 24 |
| `apps/shared/celebrationTrial.ts` | 28-day Mascoteer trial content + daily decisions | Mascoteers | 1265 |
| `apps/shared/act2Interlude.ts` ENGINEERS_BENCH_FRAMING | Engineer's Bench first-craft framing lines | Elara, The Human, Engineer recording | ~20 |
| `apps/shared/potentialOriginReveal.ts` | Origin reveal scene with 7 response tones | The Human, Elara | 94–196 |
| `apps/shared/preludeCrewMissions.ts` | Three crew mission narrative steps | Patch, Zephyr-9, Little One, Elara, The Human | 181 |
| `apps/shared/questlineClones.ts` + `questlineDemagiCh*.ts` + `questlineQuarchon*.ts` + `questlineVoltari.ts` + `questlineHumans.ts` + `questlineElements.ts` | Per-faction questline dialog | Faction NPCs | ~1000 combined |
| `apps/shared/transmissions.ts` + `voltariTransmissions.ts` | Late Night with the Meme episodes | The Meme (as White Oracle), faction voices | ~500 combined |

### Vex Solène (Agent Zero) — Dialog Reattribution

Per the rev 4 canonical correction, every authored Agent Zero line
is now attributed to **Vex Solène** and re-contextualized:

| VO ID | Line | Original reading | New (rev 4) reading |
|---|---|---|---|
| `zero_fc_1` | *"Potential. This is Agent Zero. Insurgency encrypted channel. The ship you're on was never meant to save anyone. It's a cage. Elara is the lock. And someone just handed you the key."* | Mysterious archival transmission. | **First contact from Vex Solène** during the Prelude Beat H.3 inbox scene. She is a hitman reaching out to a potential contract. Signed "Z." |
| `zero_rev_dead` | *"The Warlord killed me. Or... killed who I was. What you're hearing shouldn't exist. I shouldn't exist."* | Haunted, questioning. | **Literal post-transference self-description.** What she *was* before the Warlord's possession and the Engineer's sacrifice — that person no longer exists. She is a new person in the same body. Plays when the player reaches Act 3 F3 infiltration. |
| `zero_rev_dogtag` | *"My dog tag says Agent Zero. But the biometric data doesn't match my profile. It matches someone called The Engineer."* | Confused mind-swap revelation. | **Act 5 Post-Credits canon line.** She is wearing the dog tag of the dead man whose consciousness was poured into her own. She does not remember him. She chose to keep the tag anyway. |

**Her new lines needed (rev 4):** ~5 short lines for the Act 5
Post-Credits Bridge of Kael scene — specifically her *"I'm staying
on this Ark. If that's all right with you."* moment and her first
Act 3 F3 line when the player shows her the *"Friend I Saved"*
card. VO Bible voice profile entry 3 is already authored and fits
her perfectly — no new voice direction needed, just the lines.

**Canonical name use:** Every existing file that says "Agent Zero"
can remain as-is — **Agent Zero is her alias and call sign.** "Vex
Solène" is her proper name. Both are canon. In-game, NPCs who
know her professionally call her Agent Zero or "Z." — NPCs who
know her personally (Kael's archival recordings, Elara and The
Human in Act 5, the player after the Bridge of Kael reveal) call
her Vex.

### Beat-by-Beat Dialog Source Map

| Beat | Primary speaker(s) | Pull from |
|---|---|---|
| **A.1 Awakening** | Elara | `elara-vo-script.md` Lines 1–13 (all P0, recorded). These cover: cryo open, intro, identity verification, species question, Ne-Yon picker, class question, alignment question, element/dimension/affinity pick, name input, attributes, first steps. **No new dialog needed for A.1.** |
| **A.2 Murder Mystery** | Elara + Shadow Tongue (first reveal) | `elara-vo-script.md` Lines 38, 39, 43, 44, 47 (object interactions for the pod/symbol/log/vial/chair already authored). Shadow Tongue: `VOICE_OVER_BIBLE.md` → `shadow_fc_1` *"You've been reading my edits..."*. The Antiquarian scratched symbol: Line 39. |
| **A.3 Class-Gated Shield** | Elara + one class NPC | `elara-vo-script.md` Lines 25–34 (tutorial questions per room — use Line 25 Cryo Bay tutorial). For each class-specific solution, use the per-class tutorial line (25/26/27/28/32). |
| **A.4 First Engineer's Log** | Engineer recording (partial) + Elara | `act2Interlude.ts` ENGINEERS_BENCH_FRAMING.elaraAmbient + humanAmbient provide the canonical Engineer references. Full Engineer log completes in Beat H. |
| **B.1 Power Converter** | Elara + Patch recording | `elara-vo-script.md` Line 15 (Med Bay intro, recorded), Line 87 (Power Relay puzzle hint, recorded), Line 64 (Reactor Core). Patch recording: **needs new 3-line authored script** or pull from `preludeCrewMissions.ts` wreck_next_door mission beats (Patch-led). |
| **B.2 Automatic Cloning** | Elara reacts (new short line) | No canonical line exists; the closest is Line 15 *"the tools are not set aside... they were abandoned"* for the ominous vibe. **One new line needed: Elara's confusion at the pod booting on its own.** |
| **B.3 Virus Outbreak** | Elara + The Source (Kael) ambient | `source_fc_1` *"Can you hear me? Through the screaming of a billion infected minds — can you hear one voice? I was like you once..."* — plays as ambient layer under the mist, too faint to consciously hear. This is also the player's first exposure to Kael's voice, foreshadowing Beat I Tower Defense. |
| **B.4 Hellbox Discovery** | Patch + Elara + hellbox whisper | `mobileNarratorDialog.ts` cryo_bay lines are close enough. Hellbox whisper: pull from `lyraVoxDialog.ts` cryo_bay unlocked line *"I recorded the scratch marks being carved. I can show you..."* — adapted for the hellbox POV. **Note: Lyra Vox is canonically locked until Forgive-Neither Act 5 path; her voice here is DIEGETIC but unrecognizable to the player.** |
| **C Hellbox Compels** | Unnamed internal voice | **Diegetically Lyra Vox** (per `lyraVoxDialog.ts` header), rendered as an unrecognizable internal voice. The line *"You are the first one in seventeen thousand years..."* is new; closest canonical is `lyraVoxDialog.ts` bridge line *"has not registered a weight in one thousand, forty-seven years"*. |
| **D.1 Matrix of Dreams** | Gary the Game Master | `mascoteers.ts` Mascoteer #9 Gary the Ninth. His `playSurface` + `hiddenTruth` + `dailyGame` provide his voice grammar: *"Makes up the games. Changes the rules mid-play. Wins every time."* His canonical **arrival verse**: *"Hear ye, hear ye, the ninth arrives, where ancient beasts and ruin thrive."* |
| **D.2 Governance Hub** | Gary | Pull from `governance.ts` / `yearOneVotes.ts` vote proposal schemas for the canonical vote options per class. Gary's framing lines need to be written **in Gary's Mascoteer voice** per `mascoteers.ts` id `gary`. |
| **D.3 Celebration Trial Rules** | Gary + mascoteer dialog set | `celebrationTrial.ts` 1265 lines — extensive existing content for the 28-day loop. Gary narrates the rules explanation in Beat D; the actual 28 days play out in Act 1 Cycle A. |
| **D.4 House Assignment + Apprentice** | Gary | `apprentices.ts` 459 lines — apprentice NPC schemas with permadeath. Pull canonical apprentice-name bank from this file. Gary's assignment speech uses his `dailyGame` voice. |
| **D.5 Chess Tutorial** | Gary | `chessTutorial*.ts` (existing 7 tutorial gates). Gary delivers the canonical tutorial VO — **new lines needed** in Gary's voice, but the tutorial *mechanics* already exist. |
| **E Moral Choice** | Gary | Gary's voice pattern — no existing file has his full dialog yet, but his `hiddenTruth` from `mascoteers.ts:138` is *"Teaches Apprentices that the rules favor the rule-maker, and they are not the rule-maker"* — this is the tonal reference for his moral-choice speech. **New lines needed** but voice is locked. |
| **F Return to Cryo + Human First Contact** | The Human + Elara | `VOICE_OVER_BIBLE.md` `human_fc_1` **"Finally. Someone who can hear me. Don't speak — she's listening..."** — canonical and already authored. Elara response: `elara_fc_1` + `mobileNarratorDialog.ts` cryo_bay lines at tier F. |
| **G Pet Battle vs Spore** | Little One (non-verbal) + Elara + The Human banter | `mobileNarratorDialog.ts` pet_garden set (4 lines — Elara F/V, Human F/V). Little One is non-verbal by design (per `preludeCrewMissions.ts` burnt_card mission). The Human banter pulls from the pet_garden V-tier line *"That's how you love a living thing, Senator."* |
| **H Resumed Puzzles** | Elara + The Human + Patch live + Engineer recording | `elara-vo-script.md` Lines 15, 20, 22 (Med Bay / Engineering / Cargo intros). `mobileNarratorDialog.ts` medical_bay, engineering, cargo_bay dialog sets. Engineer log completion: pulls from `act2Interlude.ts` ENGINEERS_BENCH_FRAMING + `engineerBenchHints.ts`. Hidden Data Chip Line 49 repurposed as NPC Inbox message. |
| **I Bridge + Tower Defense** | Elara + Zephyr-9 + archival Kael + The Human | `elara-vo-script.md` Lines 16, 45, 46, 47, 48, 49 (Bridge + Conspiracy Board + Timeline Projector + Captain's Chair + Navigation Console + Hidden Data Chip). `mobileNarratorDialog.ts` bridge set (8 lines). Zephyr-9: **new lines needed** (Quarchon voice; no existing file). Kael archive: `source_fc_1`, `source_rev_kael`, `source_rev_memory` from VO Bible. |
| **J Archives + Two Voices One Deck** | Elara + The Human + The Antiquarian | `elara-vo-script.md` Line 17 (Archives intro), Lines 54, 81, 82, 83, 84, 85, 86 (Archive objects — the **Hidden Prophecy Line 86 is the metanarrative payoff**). `mobileNarratorDialog.ts` archives set includes the **beat-flag-tagged §2.7 opener line** `engineer_hook_active_opener` — this IS the Two Voices One Deck cutscene's Human line, already in code. Antiquarian: `antiq_fc_1`. Potential Origin: `potentialOriginReveal.ts` lines 94–196 (already in code). |

### Gaps That Need New Dialog Written

Only **~15 new lines** need to be written for the entire Prelude.
Everything else is already authored. The gaps:

1. **Elara's Beat B.2 cloning confusion** (1 line)
2. **Patch's B.1 power converter recording** (3 lines)
3. **Hellbox compulsion internal voice (C)** (3 lines)
4. **Gary's Beat D orientation script** (8–12 lines — full D.1 through D.5 monologue; Mascoteer voice in `mascoteers.ts:132-140` is the reference)
5. **Zephyr-9's Beat I Tower Defense unlock** (3 lines — no existing Zephyr-9 file; her voice is canonically Quarchon probability-grammar per `questlineQuarchon*.ts`)

**Recommendation:** Use the Mascoteer voice pattern (`mascoteers.ts`) for
Gary's lines, the Quarchon questline voice pattern
(`questlineQuarchonCh1.ts` onward) for Zephyr-9's lines, and the Lyra
Vox substrate pattern (`lyraVoxDialog.ts`) for the hellbox compulsion.
All of these have authored voice references; only the specific beat
lines need to be added.

**Total new dialog production budget:** ~15 short lines + rerecording
existing 119 Elara VO lines is not needed (they're already recorded).
This Prelude can ship on 95%+ existing dialog.

---

## ACT 1 — "The Deck Reforged" — The Engineer's Story

> **The card game IS the Engineer's story**, the same way the fighting
> game will be the Prisoner's story. Every chapter of the card game is a
> chapter of his life. Every boss is someone he loved, feared, or trained
> beside. His execution is the player's first full musical slideshow.

**Primary game mode:** **Dischordia TCG**. Act 1 is the most linear act
in the entire game — deliberately so — because it is a biography. Every
other act opens up non-linearly.

**Orphans woven into Act 1** (from the full catalog):
- **Celebration Trial 28-day Mascoteer loop** (`celebrationTrial.ts` +
  `mascoteers.ts`) — runs in parallel with Cycle A. Daily decisions
  accumulate bond/corruption/morality that are passed into the Cycle
  A card battles as buffs/debuffs.
- **Apprentices + Permadeath** (`apprentices.ts`,
  `apprenticeRivalries.ts`, `apprenticeBetrayal.ts`,
  `apprenticePermadeath.ts`) — the apprentice assigned in Prelude
  Beat D lives or dies through Cycle A's 28 days. Death yields a
  **Memory Card** for the player's deck (payoff of the §2.5
  Memory Card rule).
- **House Competition** (`houseCompetition.ts`) — the house assigned
  in Prelude Beat D competes with other houses across Cycle A's
  trial; ranking affects Cycle B entry bonuses.
- **Oracle Deck / Tarot** (`tcg-core/tarot/`) — unlocks for
  non-Oracle classes when the Insurgency Oracle reaches out at the
  start of Cycle B (canonical: he was Kael's friend, and Kael's
  recordings from Beat I Tower Defense have established the
  Insurgency as a real faction).
- **Friendly Challenges async PvP** (`friendlyChallenges.ts`) —
  already unlocked in Prelude Beat J; first real use is at the
  end of Cycle A when the player has 12+ cards.
- **Song Slideshow Engine** (`songSlideshow.ts`) — primary delivery
  system for Cycle A / B / C finale cinematics (*Welcome to
  Celebration*, *To Be the Human*, *Last Words*).
- **Engineer Bench Hints** (`engineerBenchHints.ts`) — recording-
  gated hints that fire on the Crafting Bench; the bench is locked
  until Act 2 but the first hint unlocks when the Cycle C3 forced
  loss fires (the player hears the Engineer's last advice before
  the bench is even available).
- **Engineer Card Game Logs** (`engineerRecordings.ts`) — full
  discovery was in Prelude Beat H; Act 1 uses them as the
  **biography source** narrating each Cycle's framing lines.
- **Kael Tower Defense (wave 2)** (`appendixBKaelQuestline.ts`) —
  second reverse-chronology Kael fragment plays during Cycle B2's
  battle vs. young Kael (the Recruiter). **This is the moment the
  player realizes the voice in the Tower Defense recordings IS the
  Recruiter they are facing on the card board.** Systemic proof:
  Prelude Beat I wrote to the Kael questline; Act 1 Cycle B2 reads
  from it and pays off the writing.
- **Citizen Traits / Talents** (`citizenTraits.ts`, `citizenTalents.ts`)
  — apprentice trait system; the Cycle A apprentice has inherited
  traits that affect their battle assists.
- **Light/Dark Meter + dischordiaCycle** — every Cycle A/B/C battle
  writes to it per §3.6.
- **Living Ark** — Cycle A Mascoteer wins permanently update the
  town-square art in Celebration.
- **Living Universe** — Cycle A/B/C finale slideshows fire
  galaxy-wide community broadcasts; Cycle C's *Last Words* is the
  first +500 Light Energy community spike.

### Canon Reconciliation

The Seer drew the first Dischordia cards with her staff from pure
good-soul magic. The Engineer — real name withheld until the Act 1
finale, where he is revealed as the **Prince of Celebration, the Last
Graduate** — spent his life building the neural-lattice *apparatus* that
could harvest, store, and play those scattered energies as cards anyone
could use. **The Dischordian Deck uses the same neural lattice as the
Inception Arks.** The Ark is a big Deck. The Deck is a small Ark. Your
Ark — 1047 — contains a master index of the Seer's scattered card
energies. The Engineer encoded it there. You are the first player in
17,000 years to open it. (`WITNESSING_NARRATIVE_PROPOSAL.md` §4.1)

### The Three Cycles = Three Study Phases of a Prince's Life

Each cycle ends with a **P0 slideshow cinematic** (see §5 in the proposal).

#### Cycle A — "Kindergarten of Gods" (Project Celebration)
**3 battles. Graduation days 10, 20, 28 of the Celebration Trial.**
The Celebration Trial runs in parallel as a 28-day Mascoteer decision
loop; daily choices accumulate bond/corruption/morality and are passed
into the card battles as buffs/debuffs. This is **the card tutorial**
— the player learns Dischordia here, taught diegetically by Elara's
briefing-paper knowledge plus the Mascoteer trial itself.

| # | Opponent (Mascoteer / future Archon) | Day | Deck theme | Card unlock |
|---|---|---|---|---|
| A1 | **Conni the Conductor** (Archon #1 / CoNexus, child form) | 10 | "Rent Free" forced-unison mechanics | *The Countermelody* (Common Neutral) |
| A2 | **Little Corey** (Archon #3 / The Collector, child form) | 20 | "Choose Your Mask" memory-card sacrifice | *The Jar That Wouldn't Close* (Rare Light) |
| A3 | **Mr. Unblink** (Archon #2 / The Watcher, child form) | 28 | "Ocularum" full-board reveal, zero hidden cards | *The First Card* (Epic Light — blank, 3 random effects on play) |

**Cycle A finale cutscene (P0 slideshow): *"Welcome to Celebration"*** —
8 frames. Final frame is the graduation photo. Everyone smiles. The
Engineer is the only child not looking at the camera — he's looking out
of frame, at something behind the player.

**Optional bonus Mascoteers** (post-credits, only unlockable with a
perfect 28-day trial): Wanda Wee (Warlord child form) and Gary the Ninth
(Necromancer child form). Legendary card rewards.

#### Cycle B — "The Academy" (Mechronis)
**5 battles. Each opponent is a classmate the player already knows by
name from canon.** Teaching professors are canonical Mechronis
professors from `apps/shared/mechronisProfessors.ts`: Headmaster Kanevas
(Archon #1), Professor Aoki (Archon #2), Curator Halverez (Archon #3,
whose xenomorph mask retroactively ties into the Act 2 Thaloria
cinematic).

| # | Opponent | Deck theme | Card unlock |
|---|---|---|---|
| B1 | **Young Iron Lion** (17, expelled Year 650 A.A.) | "Last Stand" defense-stacking | *The Iron Stance* (Rare Light) |
| B2 | **Young Recruiter / Kael** (joins Iron Lion a year later) | "The Insurgency" swarm buffs | *The Recruiter's Gift* (Epic Neutral) |
| B3 | **Young Agent Zero** (future assassin) | "Zero Trust" stealth / one-shots | *The Weapon I Didn't Build* (Legendary Dark) |
| B4 | **Young Eyes** (infiltrator, created by The Watcher) | "I Am the Eyes That Watch" card-peek | *The Memorized Page* (Epic Dark) |
| B5 | **The Seeker / Young Human** (your own narrator's younger self) | "Deep Thoughts" long-game | *The Classmate's Compass* (Legendary Light, win) OR *"The only reason I stayed"* (Legendary Dark, loss) |

B5 is the emotional pivot: the player is playing the Engineer against
The Human's younger self, with The Human narrating from the shoulder slot
in real time. Both win and loss reward a different Legendary card — this
is the first place in the game where **losing is not failure**.

**Cycle B finale slideshow: *"To Be the Human"*** — 10 frames.
Mechronis graduation class photo. The Engineer at the edge already
looking out of frame. Iron Lion already expelled. Agent Zero turned
away. The Eyes smiling brightest. Kael already gone. The Seeker (The
Human) at the center, looking at the Engineer. The Engineer looking at
the Seer (off-frame).

#### Cycle C — "Nexon, Zenon, Last Words" (War)
**4 battles. Spine of Act 1. The Engineer's war, betrayal, and death.**

| # | Opponent | Deck theme | Card unlock |
|---|---|---|---|
| C1 | **The Vortex — First Form** (Battle of Nexon) | Board wipes every 4 turns | *The Standstill* (Epic Light — once per match, delay a loss 1 turn). This battle is a **survival puzzle, not a win condition**; the player is taught that not-winning is a valid outcome. |
| C2 | **The Warlord** (fragmented) | "I Love War" attack-rush + instant-kills | *The Converter* (Legendary Dark) |
| C3 | **The Warlord's Nano-Swarm (inside Agent Zero)** — the Engineer's **final transference attempt**, playing out as a card battle inside Agent Zero's mind | **Tempo-decay + self-sacrifice** — every turn the Engineer's deck shrinks by one card permanently, and the cards that leave go to Agent Zero's side of the board as reinforcements against the Warlord's swarm | *The Friend I Saved* (Mythic Light — renamed from *The Friend I Trusted* per rev 4 canon). **Mandatory forced loss for the Engineer, which IS the win condition for Agent Zero.** The player cannot *win* the battle as the Engineer, but every card they lose is a card Agent Zero's side gains. On the final turn, the Engineer's deck is empty and Agent Zero's board is full — she now has the Engineer's intellect without his memories. The Warlord's swarm is defeated by sheer card count. The Engineer's portrait fades. Agent Zero's portrait resolves for the first time with a new name plate: **Vex Solène**. This is Act 1's "mandatory death sequence" — a sacrifice, not a betrayal. The surviving "Friend I Saved" card in the player's deck is **the Engineer's last gift**, and it will be played in Act 3 F3 when the player meets Vex Solène for the first time face-to-face. |
| C4 | **The Authority's Tribunal** (Trial-format battle) | Jury cards, evidence cards, Engineer defends with his own Deck | *The Last Word* (Mythic Light — **this card triggers the Last Words slideshow on play**). **Elara is a card in the Tribunal's deck.** When she is drawn, her portrait appears and she flinches on your shoulder. *"That was my bill. I signed that bill. That card has my name on it."* |

**Cycle C finale — THE master slideshow: *"Last Words"*** — 15 frames,
~3m 30s. The first slideshow the game ever shows the player. Retcon:
the recording was always two voices, not one — the Engineer's execution
and the Programmer's disappearance bled together across centuries in the
Matrix of Dreams. Final frame: the Engineer and the Programmer walking
into white together, the first time the **Antiquarian voice** (Dr.
Daniel Cross) is ever heard. Post-slideshow: **+500 Light Energy**
galaxy-wide (first community-visible Light spike in the whole game).

### Act 1 Finale — The Player's First Dischordia Card

After *Last Words*, the player is returned to the Ark. The Archives have
changed. A new card sits on the pedestal:

> **"YOUR NAME" — Unwritten**

The card is blank. Every subsequent Act (2, 3, 4, 5) writes **one** new
card shaped by the player's choices in that act. By endgame, the player
has five player-authored cards — the only deck in the galaxy with the
player's own name on it. This is the **real reward** of the five-act
structure.

**Flags set:** `act1_complete`, `engineer_arc_complete`, `crafting_unlocked`,
`chess_unlocked`, `collectors_arena_unlocked`, `act2_interlude_ready`,
`slideshow_system_active`, `player_card_authoring_active`.

**Data file:** `apps/shared/act1Opponents.ts` — 12 opponents already
encoded as shells for future card-engine wiring.

---

## ACT 2 — "The Forged Hand" (Interlude)

> An interlude, not a full act. Breathing beat between the Engineer's
> story (Act 1) and the Eyes' story (Act 3). Its job is to give the
> player practice in three disciplines before the game goes non-linear,
> and to reveal the game's real antagonist: the Two Game Masters.

**Primary game modes unlocked:** Crafting (Engineer's Bench), Chess
(Zephyr-9's Classroom), Collector's Arena (public-stakes TCG battles).

**Core loop:** Play chess → win pieces → spend pieces at the crafting
bench → forge new cards → play Collector's Arena to earn energies → use
energies to empower crafted cards. The loop is boring without story;
the story is the **reveal of the Two Game Masters and the Thaloria
origin of the Shadow Tongue**.

**Orphans woven into Act 2:**
- **Engineer's Bench (full unlock)** + **Engineer Bench Hints**
  (`act2Interlude.ts`, `engineerBenchHints.ts`) — recording-gated
  hints fire on crafts. First hint unlocked at Cycle C3 of Act 1;
  full hint library opens here. Framing lines already authored in
  `ENGINEERS_BENCH_FRAMING`.
- **Chess Tutorial (full)** (`chessTutorial*.ts`) — Zephyr-9 from
  the Navigation Console re-teaches chess in the canonical §6.3
  Quarchon-compute framing. Players who skipped Gary's tutorial
  in Prelude Beat D.5 get the full tutorial here; players who
  took it get advanced gates 3+.
- **PvP Battle Engine** (`pvpBattle.ts`) — opens with the
  Collector's Arena §6.4. First public matches are broadcast and
  every match writes to the community Dark Energy meter.
- **Gamesmaster's Arena** (`GamemastersArena.tsx`) — the Two
  Game Masters' personal back room. First visit is the Act 2
  Thaloria cinematic's aftermath. Player fights neither GM here
  yet — they preview the room and leave. Act 3 sends them back
  for the Left GM; Act 4 for the Right GM.
- **Dream Tokens economy surface** (from `Line 64` Reactor Core
  intro in Prelude Beat H) — Dream Tokens become currency for
  Crafting, Arena entry, Oracle Deck draws, and the Requisitions
  Counter (`Line 73`).
- **Oracle Deck (full for non-Oracle classes)** — the Insurgency
  Oracle's contact at Act 1→2 handoff has now introduced himself;
  the deck becomes accessible in Act 2 with its first 3-card
  spread being a diplomatic preview of Act 3's six faction arcs.
- **Hacking Puzzle / Pipe Maze** (`HackingPuzzle.tsx`) — returns
  as a **fusion puzzle** for high-tier card crafting. The same
  mechanic the player learned in Prelude Beat B.1 is now
  re-contextualized as a card-forging grammar.
- **Training Mode Overlay** (`TrainingModeOverlay.tsx`) — Pet
  Garden hosts practice matches for Crafting's fusion system
  and Chess's sparring rounds.
- **Faction Questlines (openers)** — `questlineQuarchonFirstPattern.ts`
  and `questlineQuarchonCh2.ts` open here (already have
  `actGate: 1` / `actGate: 2` in code). DeMagi Ch1 opens as well.
- **Bestiary** — Act 2 Arena opponents file into the Bestiary.
- **Citizen Traits** — Patch as Trade Fleet commander candidate
  is introduced during Act 2 Wrap; Trade Empire §8 improvement #5
  fires at the Act 2→3 handoff.
- **Thought Virus meter** — Arena matches feed both personal and
  community virus meters (canonical per §6.4 Hierarchy harvest).
- **Living Ark** — Engineering and Collector's Arena both gain
  filter presets: Engineering tilts `noir_human` (The Human's
  canonical affinity); Arena tilts `silence_ambient` (the crowd
  is watching). Thaloria cinematic writes a permanent
  "Helmet in the Grass" entry to the Loredex and links it to
  Curator Halverez's Mechronis professor page.
- **Living Universe** — Every Arena match is broadcast; community
  Dark Energy meter ticks; Thaloria cinematic fires a galaxy-wide
  **"The Helmet Returns"** event that propagates to every Ark
  in reach.

### 2A — The Engineer's Bench (Crafting)
Powers on in Engineering at Act 2 start. Framing line (Elara): *"This
bench… hums the same way his Deck did. Like it remembers him."* Recipes
consume **Material** (from Trade Empire / Pet Battles / crew missions),
**Memory Energy** (from card battles), and a **blueprint card**. The
first craft is deliberately tiny. **Memory Energy runs out fast** — this
is the mechanism that makes the player **need** Act 3's Trade Empire.
Recording-gated bench hints (`engineerBenchHints.ts`) later play
contextual Engineer monologues as "tech advice from beyond the grave,"
each gated by a discovered holographic recording. (Data file:
`apps/shared/act2Interlude.ts:37-71`)

### 2B — Zephyr-9's Classroom (Chess)
Zephyr-9 (Quarchon crew member) unlocks the Chess minigame from her
reactor console. Framing: *"Quarchon do not 'play' chess. We compute
its continuations. But organic minds think better when they are told
they are playing. So. You are playing. Sit."*

Chess tier unlocks (per `act2Interlude.ts`):
- `chess_depth ≥ 3` → **Preview Cards** in Dischordia (peek top of deck)
- `chess_depth ≥ 5` → **Undo** (once per match)
- `chess_depth ≥ 8` → **The Engineer's Opening** (historically the
  Engineer's first tournament hand)

Chess opponents: crew members, pets, and — at the top tier — **the two
Game Masters of the Collector's Arena**. First time you play a Game
Master at chess, you lose. Always. Because they read your moves from
the Matrix of Dreams. That loss is the **hook into Collector's Arena**.

### 2C — The Collector's Arena
Public-facing front of the Matrix of Dreams consciousness harvester.
The player battles in a crowd setting with public-stakes mechanics (the
crowd affects the match). Each round feeds the **Dark Energy meter** —
the Hierarchy harvests the same light the player is trying to grow.
Framing (The Human): *"He built the Deck here. He fought the Game
Master here. Some of the souls in that vault are his. Some of them
are yours — you just haven't lost them yet."*

**The Two Game Masters** (new canon per §6.4): after the original Game
Master's execution, his goggles were split. **The Left Game Master**
wears the left lens — tactical, analytical, cold. **The Right Game
Master** wears the right lens — improvisational, artistic, cruel. They
tolerate each other because the Hierarchy pays them. The player will
fight **both** as culminating bosses — one in Act 3, one in Act 4.

### 2D — The Thaloria Cinematic ("The Helmet in the Grass")
**Trigger:** third Collector's Arena win.

Cold open: peaceful Thaloria field, verdant-skinned Thalorian hand
picks up a xenomorph-shaped helmet. Camera jerks, world inverts — the
helmet is now held by **two masked figures in blue trench coats**, one
with a red left lens, one with a red right lens, standing behind the
Thalorian. The Left Game Master places the helmet on the Thalorian's
head. The Thalorian's eyes turn red. **The Shadow Tongue is born.**
Cut to the existing `collectors-arena-intro_c5e8c641.mp4` asset — the
player realizes the existing arena intro was **always the second half
of this cinematic**. Free cinematic leverage by retroactively framing
an existing asset.

Retroactively links **Curator Halverez's xenomorph mask** (the Mechronis
professor who taught Cycle B2) to the helmet in the grass — unlocks a
Loredex cross-reference entry.

### Act 2 Wrap

- Player has crafted 3+ cards at the bench
- Player has won 5+ chess matches
- Player has seen the Thaloria cinematic
- Player has lost to one Game Master at least once

Command Bridge message: *"The Free Ports have opened trade channels
with your Ark. An agent wishes to meet."* → Trade Empire unlocks.

**Flags set:** `act2_complete`, `crafting_mastered`, `chess_mastered`,
`collectors_arena_discovered`, `thaloria_cinematic_seen`,
`two_game_masters_introduced`, `trade_empire_unlocked`, `act3_unlocked`.

**Music:** SiH Act II judgment sequence — *Worthy (Who Can Open It)*
for the first crafted card, *Behold (The Horsemen)* for the first
Collector's Arena match, *False Prophet* for the Thaloria cinematic.

---

## ACT 3 — "The Eyes in the Dark" — The Story of the Eyes, Told Through Trade Empire

> **The first fully non-linear act.** Six faction paths, any order, each
> resolvable three different ways. Five of six must be resolved to
> advance to Act 4. The player is literally walking the Eyes' path — and
> will literally feel the weight of it.

**Primary game modes:** **Trade Empire** (`client/src/game/tradeEmpire.ts`)
redefined as the instrument of the Eyes' life story, plus the
**Infiltration Runner** (`client/src/game/InfiltrationRunner.tsx`, 21
stages across 6 factions, 9 minigame types) as the Eyes-path mechanic.
Also **Signal Decryption** (`SignalDecryption.tsx`) and **Hacking Puzzle /
Pipe Maze** (`HackingPuzzle.tsx`) as Eyes-path minigames.

**Orphans woven into Act 3:**
- **Adjudicator Locke introduces Alliance War** (`AllianceWarPage.tsx`,
  `allianceWar.ts`) — the 19-hex map previewed in Prelude Beat I.4
  now becomes fully interactive. Locke opens it as a reward for
  signing the Red Crystal Accord (F1 Diplomacy path) or as the
  siege map (F1 Conquest path). **VO already authored**: `locke_fc_1`
  + `locke_rev_human`.
- **Cooperative Raids** (`coopRaids.ts`) — Field Commander Renn
  opens raids as a reward for completing the F3 Insurgency arc
  (any path). Weekly boss rotation per §Group 2 catalog.
- **Bounty Board** (`BountyBoardPage.tsx`) — Adjudicator Locke opens
  the Bounty Board at Act 3 start as "your contract with New Babylon."
  Persistent through Endgame. Side-mission board + Loredex unlocks.
- **Trade Empire §8 improvements (all 10)** — Act 3 is where the
  proposal's §8 improvements land: narrative sectors, Table
  Diplomacy minigame, Infiltration Paths, Living Sector Economies,
  Trade Fleets as Companions (Patch / Zephyr-9 / Little One as
  fleet commanders — feeds `citizenTraits.ts`), Sector Memory +
  Gossip Line, Dreamer's Shield playable mystery, Piracy as
  emergent PvP, Colonies as Legacies (Prestige carryover), Eyes
  Voice Layer.
- **Star Chart** (`StarChartPage.tsx`) — unlocks as the **Council
  ending reward** (§7.7 ≥3 Diplomacy paths). Mirren Hale (Galactic
  Dance NPC #1) curates it as "her grandmother's navigation chart."
- **NPC Inbox (full)** — Act 3 is where the Inbox becomes load-
  bearing. Diplomatic faction offers arrive via inbox; the Yellow
  Coats foreshadow message from Prelude Beat H.3 gets a **second
  message** in Act 3 that adds one more line to the player's
  puzzle.
- **The Meme / Palimpsest Episodes** (`PalimpsestEpisodesPage.tsx`
  + Witnessing Appendix C) — 13 episodes begin airing in Act 3.
  The Meme hosts. Episodes 1–6 pace across Act 3 (one per faction
  arc + one at the Collector's Garden climax). Episodes 7–13 pace
  across Act 4. Episode 13 fires during Act 4 Prisoner Cell 2's
  Meme boss fight — the host-is-the-boss reveal.
- **Kael Tower Defense (waves 3–6)** — four more Kael fragments
  in reverse chronology, each paced to a different faction arc.
  Wave 6 (Kael the Student at Mechronis) plays during the F3
  Insurgency Engineer-reunion infiltration — the player realizes
  Kael and the Engineer were classmates (callback to Act 1
  Cycle B2 battle).
- **Cryogenic Dreams** (`cryoDreams.ts`) — Act 3's long travel
  sequences between Trade Empire sectors trigger cryo dreams.
  Each dream is a fragment of Lyra Vox's memory leaking in, with
  clues that only make sense on a second playthrough (per
  `lyraVoxDialog.ts` flagged variants).
- **Shadow Tongue Infiltration Path (F2)** — Act 3's F2 Hierarchy
  infiltration is where Shadow Tongue becomes a **playable
  tutor**. VO already authored: `shadow_fc_1`, `shadow_rev_amnesia`,
  `shadow_rev_editor`.
- **Signal Decryption + Hacking Puzzle (deep integration)** — both
  minigames are embedded in Infiltration Runner stages. Already
  wired via `infiltrationContent.ts`.
- **Collector Garden (player housing)** renamed **The Sanctum** —
  opens as a reward for F6 Antiquarian's Refuge Infiltration path.
  Becomes the Trophy Room alias per §Appendix A.10.
- **Guild Wonders** (`guildWonders.ts`) — first Reclamation Event
  in Act 3 (after F5 Diplomacy) yields the first Guild Wonder:
  a memorial plaque in the Memorial Corridor curated by The
  Hierophant (Galactic Dance NPC #3).
- **Living Ark** — Every faction resolution permanently changes
  a Trade Empire sector's art. The Council Chamber room (§7.7
  Diplomacy ending) opens on the Ark as a new permanent space.
- **Living Universe** — Every faction resolution fires a galaxy-
  wide event. The **Watcher Origin** slideshow (mid-Act) is a
  community-lore broadcast. Sector reclamations write to the
  community Light Energy meter per §3.6.

### Opening — Slideshow "I Am the Eyes That Watch"

Ark Comms Array receives a female multilayered transmission:

> *"My name is the Eyes. I was made to watch by a man who could see
> everything. He sent me into the universe to find the one thing he
> couldn't see — the place where his own gaze ended. I found it. It
> cost me everything. Now a child of his making is in your walls and a
> friend of his is on your bridge and both of them owe me a debt they
> don't remember. I am going to collect."*

The real Eyes died in 16,896 A.A. — this is a 17,000-year-old archival
recording sitting in the substrate layer of every Ark. **Elara remembers
the Atarion apartment, the seduction, the info she gave up.** **The
Human investigated the Eyes' betrayal and closed the case without
looking at the body.** Both narrators are **broken** by this moment — the
first time the yin/yang companion system is overtly about **trauma
bonding** rather than philosophy.

### The Six Faction Paths — Three Resolutions Each

| # | Faction | Conquest (Dark) | Diplomacy (Light) | Infiltration (Eyes Path, Gray) |
|---|---|---|---|---|
| F1 | **New Babylon Ascendant** | Siege the core (6 sector fights) | *Red Crystal Accord* — negotiate with six imprisoned minds simultaneously | **Become the next Adjudicator.** Climb ranks 6 in-game weeks. Finale: you judge Senator Elara Voss in a replayed archive trial. **Your judgment is binding. Elara will remember.** |
| F2 | **Hierarchy of the Damned** | Destroy three dimensional gates on three corrupted worlds | *Soul Contract Exemption* with Xeth'Raal the Debt Collector — a diplomacy match where your words rewrite themselves as you speak | **Become the Shadow Tongue's apprentice.** Learn to rewrite small Loredex entries. The player is taught to lie to the universe and make it true. |
| F3 | **The Insurgency (New)** | Storm Insurgency Haven (impossible without `chess_depth ≥ 5`) | Share intel with Agent Zero (Vex Solène) for the *Nomad's Compass* (crafting reagent) | **Meet Vex Solène.** The quiet earthquake of Act 3: the player meets the hitman who has been sending them anonymous "Z."-signed inbox messages since Prelude Beat H.3. **She is the real organic Agent Zero** — alive, augmented, and the other awake Potential in the universe. She carries the Engineer's intellect and **none of his memories**. She does not know the player. She does not know about the Dischordia deck. She is currently taking contracts. The player is one of her contracts — she was hired to assess Ark 1047 and decide if it's worth killing. **The Engineer's *"Friend I Saved"* card** from Act 1 Cycle C3 plays itself from the player's hand the moment she walks into the scene — she flinches at it without knowing why. This is the scene where Vex begins to suspect purpose is something one **chooses**, not something one inherits. She does not yet agree to work with the player; that happens in Act 5 M6. What she does, here, is cancel the contract on them. That's enough for now. |
| F4 | **Terminus Dominion (Thought Virus)** | Burn three infected sectors with Iron Lion's fleet (boss fight vs. The Source) | **IMPOSSIBLE.** Any treaty attempt turns into a card battle mid-sentence. Taught: some enemies are unbargainable. | **Get infected on purpose.** One session partially controlled by the Thought Virus — card effects flip to Dark counterparts. The Oracle cleanses you after. **Reward:** the unique pseudo-card *"Immunity"* — once per match for the rest of the game, prevents all negative statuses for 3 turns. |
| F5 | **The Artificial Empire (Reborn)** | Siege Imperial Frontier (requires a fleet built via Trade Empire trade) | *Terms of Coexistence* — hardest diplomacy match in the game. Architect makes three offers: one truth, one lie, one trap. Only identifiable by combining Human Bond ≥60 + Elara Bond ≥60. | **Be recruited as a new Archon.** The most tempting dark choice in the game. Archon-tier abilities for the rest of the game. Cost: 1,000 Dark Energy, -30 Human Bond, Elara horrified. |
| F6 | **The Antiquarian's Refuge** | IMPOSSIBLE — you can't siege a pocket universe | Request an audience, **pay in memory** — permanently forfeit one Loredex entry | **Become his apprentice.** Session outside time. On return, everyone you know has aged mentally. Reward: Mythic card *"A Moment Outside Time"* — once per match, take two consecutive turns. |

**Five of six resolved = Act 3 complete.** The sixth is hers.

### Sector-Embedded Eyes Biography

As the player works through the Faction Arcs, **lore fragments of the
Eyes' own life** appear as sector events, assembling in the Loredex as
a secondary biography. (Data file: `apps/shared/act3EyesBiography.ts` —
7 life stages.)

1. **Insurgency Haven** → *The Recruitment* (age 16, selected by The Watcher)
2. **Atarion** → *The Apartment* (the Elara seduction. Elara reacts
   real-time. *"That was the night I signed the bill."*)
3. **Panopticon Ruins** → *The Betrayal* (she watches Kael being
   dragged in, takes no action, weeps, decides to defect)
4. **Free Ports** → *The Defection* (she leaves a warning about the
   Thought Virus in a dead drop; the Insurgency distrusts her)
5. **Thaloria / adjacent** → *The Collector Finds Her* (final hours,
   hunted through Thalorian forest, writes the transmission the player
   heard at the start of Act 3, dies alone in the grass **not far from
   where the Shadow Tongue will later be born** — proximity is intentional)

### Mid-Act Slideshow: "Ocularum / The Ocularum"

Triggered by completing the New Babylon arc OR the Empire arc. The
Watcher's origin: he was a Panopticon station chief — under his
projection he is literally **a hundred million tiny camera nodes
networked into one consciousness**. He couldn't walk. He *made* the
Eyes as a field operative. He loved her as a father loves his only
daughter. He ordered her death. He regretted it. This slideshow
recontextualizes the Watcher from cardboard villain to **grieving
parent**. Emotional climax of Act 3.

### Act 3 Climax — "The Collector's Garden"

After five factions are resolved, the player flies to a coordinate
that is not on the map. They land in a Thalorian field. The grass is
still warm. **A single xenomorph-shaped helmet is half-buried there.**
They pick it up.

**Boss battle: The Collector himself** — full Dischordia match against
a Boss deck. Win = Collector retreats, +500 Light, Collector becomes a
future Act 4 boss. Lose = the Collector permanently takes one card
from the player's deck, and **which card is taken depends on which
faction arc you did last** — a callback that makes the non-linearity
matter.

### Three Act 3 Endings

| ≥3 Infiltration paths | ≥3 Conquest paths | ≥3 Diplomacy paths |
|---|---|---|
| **The Eyes' Shadow** — the Eyes' recorded voice becomes the player's Trade Empire narrator from now on. | **The Iron Path** — Iron Lion broadcasts *"Be better than she was."* Unlocks a Cades prelude mission. | **The Council** — new room on the Ark: the Council Chamber, where five faction leaders send delegates weekly with requests. You become a diplomatic hub. **Quiet golden ending.** |

### Trade Empire — 10 Concrete Improvements (§8 summary)

The proposal's §8 also lists 10 Trade Empire improvements that ship
with Act 3:
1. Every sector becomes a narrative object with memory + gossip
2. **The Table** — dedicated diplomacy minigame (round table, 3 NPCs,
   3 demands each, limited "words" resource)
3. Infiltration Paths per faction (the Eyes System above)
4. Living sector economies (community-driven pricing)
5. Trade Fleets = Companions (crew-commanded fleets, Bond affects outcome)
6. Sector Memory + Gossip Line (NPCs in adjacent sectors reference your acts)
7. The Dreamer's Shield — playable mystery (reveals pixel-by-pixel as
   galaxy Light Energy grows, full face at 100%)
8. Piracy as emergent PvP in lawless zones
9. Colonies as legacies (persist across playthroughs at Prestige Cycle)
10. The Eyes Voice Layer — optional Trade Empire narrator once her
    arc is done

**Flags set:** `act3_complete`, `eyes_arc_complete`,
`trade_empire_mastered`, `watcher_origin_seen`,
`collector_boss_unlocked`, `act4_unlocked`.

**Music:** SiH Act II late + Act III transition — *The Two Witnesses*
plays when Elara and The Human are together facing the Atarion
recording; *Silence in Heaven* (title track) plays on the Collector's
Garden climb; *The Harvest* plays during the Collector boss fight.

---

## ACT 4 — "The Prisoner" — The Fighting Game

> Act 3 is the Eyes. The Eyes' betrayal put Kael in the Panopticon. The
> player has just lived through the event that caused Act 4 to happen.
> That is the moral weight the fighting game was always missing.

**Primary game mode:** **Fighting Game / Collectors Arena combat**
(`apps/client/src/game/gameData.ts` FIGHTER_ROSTER + existing story mode
chapters ch2, ch6, ch7, ch8). The player is controlling a **memory of
Kael from before the Thought Virus** playing out one last stand inside
the architecture of the Panopticon.

**Orphans woven into Act 4:**
- **Gamesmaster's Arena vs. Right Game Master** — Act 3 sent the
  player back for the Left GM boss. Act 4 sends them back for the
  Right GM. This is the final Collector's Arena gate before Act 5.
- **Kael Tower Defense (waves 7–10)** — four more Kael fragments
  in reverse chronology, each gated to one of the four Cells.
  Each boss fight is preceded by a wave that extracts the memory
  the boss is guarding. Wave 10 plays young Kael's Mechronis
  entrance audition — the player now has the full reverse-chron
  arc of Kael, and the Prisoner's cells retroactively explain
  every earlier wave.
- **Palimpsest Episodes 7–13** (`PalimpsestEpisodesPage.tsx`) —
  Episodes pace across Acts 4's cells. **Episode 13 fires during
  Cell 2 "The Extraction"** — the Host-is-the-Meme reveal lands
  simultaneously with the in-engine Meme boss fight.
- **Cryogenic Dreams (intensified)** — every Cell boss defeat
  triggers a cryo dream featuring Lyra Vox's memory of Kael
  entering the Panopticon. The player is slowly being primed to
  hear Lyra Vox as a third narrator (Act 5 payoff).
- **Prisoner's Cells as Living Ark rooms** — per §9.3, each cell
  is designed to look like a memory shared by Elara and The
  Human. Living Ark writes: the cells **can't be tinted** with
  either `warm_elara` or `noir_human` — they are `yin_yang_flicker`
  from the moment the player enters.
- **Thought Virus Pressure (personal spike)** — Cell 2 "The
  Extraction" forces the player's personal virus meter to tick
  upward as Kael's virus touches theirs. Cleared by winning the
  cell. If the player loses and retries, the meter holds.
- **Infiltration Runner callback** — the Cell 2 Meme-shapeshifter
  boss uses Infiltration Runner's disguise mechanic on the player
  — the Meme becomes a different friend each phase. This is the
  first time a Trade Empire system invades the fighting game.
- **Necromancer Return Questline** (`necromancerReturn.ts`) —
  the Necromancer faction subplot resolves during Act 4. The
  Necromancer Cycle (the Light/Dark meter template) is
  structurally referenced as the source of `dischordiaCycle.ts`.
  Act 4 has a sidequest: help the Necromancer faction complete
  their own cycle one last time. Reward: a unique card for the
  player's deck and a Loredex entry explaining the Cycle's
  source code connection.
- **Clones Questline** (`questlineClones.ts`) — General Binath-VII
  (Galactic Dance NPC #4) sends a request for the player to help
  prove clone identity emerges from choice. The quest runs in
  parallel with Act 4 and resolves when the player defeats the
  final Cell boss. Reward: access to the Awakened Clone
  Collective as an Act 5 ally.
- **Degen's Casino opens mid-Act 4** (`DegensCasinoPage.tsx`) —
  invitation arrives after Cell 2. Player can visit any time.
  The Degen is **pretending not to know** what's happening in
  the Prisoner's Cells. He knows.
- **Christmas in July (seasonal)** (`christmasInJuly.ts`) — if
  the player's real-world clock is in July, the Casino runs the
  Christmas in July event as an overlay.
- **Living Ark** — Every Cell boss defeat permanently alters the
  Prisoner ward's visible architecture. Elara refuses to enter
  the Prisoner ward after Cell 3. The Human insists on staying
  the entire time.
- **Living Universe** — Each Cell defeat fires a community
  event. Community Dark Energy meter drops on Cell 4 victory
  (the first Dark energy *decrease* in the whole game).

### Hook — The White Oracle's Message

> *"You walked through my friend's betrayal. Now walk through his cage.
> There's something in there that still remembers him. It wears his
> face. It wants out."*

### The Four Cells (data file: `apps/shared/actsFourFiveShells.ts:50-110`)

The canonical proposal describes six cells, but the **authored data
shell** currently encodes four chapters that map to existing
FIGHTER_ROSTER bosses. This is what is actually buildable today:

| Chapter | Order | Boss (story-mode tag) | Fighter ID | Memory Extracted |
|---|---|---|---|---|
| **The Cell** | 1 | `ch2` — prison_guard_zero | `jailer` | Who Kael was before the virus. A child in Atarion's cloud-gardens with a little sister he cannot remember the name of. |
| **The Extraction** | 2 | `ch8` — meme_puppet | `human` | What Kael agreed to. The offer the virus made him, and what he said in the mirror before saying yes. (Mirror-match against an entity wearing Kael's investigator face; the Human fighter is the in-engine surface.) |
| **The Warlord Rematch** | 3 | `ch7` — warlord_zero_final_form | `warlord` | Why Kael went after the Warlord. It was not revenge — it was a list of 73 names he needed to remember. |
| **The White Oracle Meets** | 4 | `ch6` — the_white_oracle | `white-oracle` | Nothing. The White Oracle fights to return, not to extract. Kael gives himself back the right to be a man, not a virus. |

Each chapter raises a `completedFlag` (`act4_prisoner_cell_complete`, etc.).
The proposal's §9.3 table adds optional 5th and 6th cells for The Meme
shapeshifter and a secondary Warlord encounter — those can be wired in
later as optional `_5` / `_6` extensions to the data shell.

### The Dual Closing (§9.4)

After the final fighter is beaten, the Prisoner stands on the roof of
the Panopticon. The Thought Virus is already inside him. Two options:

- **Walk into the Virus** — become **The Source**. Canon path. Unlocks
  `source_narrator_active` — the Source's voice speaks from the
  substrate occasionally for the rest of the game.
- **Die clean** — refuse the Virus. Non-canon pocket-universe ending
  framed by the Antiquarian. Unlocks `kael_unfallen_tome`: *"Kael, the
  Insurgent, Who Did Not Fall."*

Both unlock Act 4.5.

**Flags set:** `act4_complete`, `prisoner_arc_complete`,
`source_narrator_active` OR `kael_unfallen_tome`, `act4_5_unlocked`.

**Music:** SiH Act III — *The Mark* during cell 2's mirror match;
*Fall of New Babylon* during the Warlord rematch; P0 slideshow
**"The Prisoner"** (non-SiH, existing song) for the cold open.

---

## ACT 4.5 — "Dead Man's Circuit" + The Degen's Casino (Parallel Track)

> Two parallel tracks: the **mandatory** Dead Man's Circuit micro-act,
> and the **always-open** Degen's Casino side area at the edge of the
> Dreamer's Shield. Casino is available from the moment Act 4 finishes
> and is the only room where the plot explicitly pauses.

### 4.5A — Dead Man's Circuit (Mandatory Interlude)

**Primary game mode:** **Kart Racing** — `games/dead-mans-circuit/`
(Godot project) + `apps/shared/deadMansCircuit.ts` (seasons, phases,
bone obstacles).

**Orphans woven into Act 4.5:**
- **Dead Man's Circuit (full)** — the Godot racing project's seasons
  open here. Each season is named after a Cell the player just
  escaped; the player authors a name for each identity stage.
- **Degen's Casino (full)** (`DegensCasinoPage.tsx` + 7 games:
  Void Slots / Entropy Dice / Nebula Poker / Pazaak-21 / etc.) —
  always-open from this moment forward. Economy sink.
- **The Pact** — signature Degen game. Once per in-game month.
  Win: Degen owes a favor. Lose: player owes Degen a favor. This
  is the economy sink's narrative expression.
- **Donation System + Cosmetic Shop** (`donationSystem.ts`,
  `cosmeticShop.ts`) — all routed through the Degen as "favors
  from the house." No separate shop UI.
- **Identity Chain Authoring → Loredex** — the player's authored
  Student / Seeker / Detective / Last name writes a new Loredex
  entry curated by The Antiquarian. If the player has an account,
  it persists across Prestige playthroughs.
- **Cross-Game Synergy** (`crossGameSynergy.ts`) — the Godot racing
  project writes back to the main app via this framework. Dead
  Man's Circuit wins grant resources to the Engineer's Bench and
  Dream Tokens to the Casino.
- **Christmas in July overlay (seasonal)** — if the player is
  playing in July, the Casino's wheel rotates to the canonical
  wheel prizes from `christmasInJuly.ts`.
- **Seasonal / Monthly Events** (`seasonalEvents.ts`,
  `monthlyEvents.ts`) — Year One Calendar drives the Casino's
  event overlay. The Degen hosts any event that lands during
  the Casino's open window.
- **Antiquarian's first direct address** — per §10.1 framing, this
  is the first time he speaks to the player without mediation.
  The player's authored identity chain becomes a page in his
  CoNexus library.
- **Living Ark** — The Ark gains a **Casino Module** accessible
  from the Bridge (visible but only active after Act 4 unlock).
  The Trophy Room gains a pinned card for every Casino win over
  a threshold.
- **Living Universe** — The player's authored identity chain is
  **broadcast galaxy-wide** as a single community event. Other
  players can see the new name appear in their Antiquarian's
  Library index.

Framing — the Antiquarian's voice, first time he addresses the player
directly:

> *"Every dead man's circuit is a track someone could not step off of.
> The Engineer's was a Deck. The Eyes' was a loyalty. The Prisoner's
> was a prison. Yours will be something else. Get on."*

Short (1–2 session) set of racing / reaction / decision-under-pressure
challenges. Each challenge named after a character whose "circuit" the
player is running. Narratively it is the moment the player **authors
their own identity chain** the way every major character has one
(Student → Seeker → Detective → The Human; Prince → Engineer → the
Transference → dead; Recruit → Agent Zero → the Warlord's hostage →
Vex Solène):

> *"What was your Student name?"*
> *"What was your Seeker name?"*
> *"What was your Detective name?"*
> *"What will your last name be?"*

The authored chain is written to the Loredex as a **new entry**. If the
player has an account, it persists across playthroughs. This is the
moment the player becomes **a character in the Loredex**, not an
operator of one.

**Flags set:** `dead_mans_circuit_complete`,
`player_identity_chain_authored`, `act5_unlocked`.

### 4.5B — The Degen's Casino (Always Open, Optional)

**Primary game mode:** `apps/client/src/game/DegensCasinoPage.tsx`
+ `apps/client/src/game/degensCasino.ts` — 7 authored games:
Void Slots, Entropy Dice, Nebula Poker, Pazaak-21, etc.

**Canon:** The Degen is Ne-Yon #8, "a cosmic entity embodying entropy
and corruption," running a casino at the edge of Ne-Yon space. He
believes entropy is the most honest game. The bartender is a god.

Framing lines on invitation:
- **Elara:** *"Don't go. He's a cosmic parasite in a tuxedo. He's been
  watching us since I was a senator. I don't trust him and I'm the one
  who wrote the legislation against trusting him."*
- **The Human** (amused for the first time in the whole game): *"Go.
  He's the only person in the galaxy who ever beat the Game Master at
  anything, and he did it by losing on purpose. I'd like to know how."*

**The signature game: "The Pact"** — once per in-game month, coin flip
with the Degen. Win: he owes you a favor (very good). Lose: you owe him
a favor (very bad). Dark-funny pressure valve of the late game.

**Narrative purpose of the Casino:** the place the player goes to **not
be in the story**. Every other system is pushing them forward on a plot
rail. The Degen repeats every visit: *"You don't have to fight anything
in here. Sit. Have a drink. Watch the wheel."* **It is the kindest
thing any NPC says to the player in the whole game.** Because the
Degen is the god of entropy, it is also the creepiest.

**Flags set (first visit):** `degen_met`, `casino_unlocked_persistent`.

---

## ACT 5 — "The Lion in Black" — Iron Lion and Cades

> Iron Lion is the Insurgency's battlefield commander who held Veridian
> VI and broadcast *"To the free souls of the galaxy…"* and died in the
> Last Stand so humanity could remember itself. Cades is the project's
> FPS/combat simulator (`games/cades-fps/`). Putting them together:
> **Act 5 is Iron Lion's last stand, played from inside his helmet.**

**Primary game mode:** **Cades FPS** (`games/cades-fps/`, Godot 4, 3D
shooting gallery). Mission structure mapped 1-to-1 from canon Iron
Lion's Gambit operations.

**Orphans woven into Act 5:**
- **Cades FPS (full Godot integration)** + **Cross-Game Synergy** —
  Cades wins write back to the main app; main-app progress grants
  Cades loadouts.
- **Kael Tower Defense (waves 11–12, final)** — wave 12 is Kael's
  earliest recording, his Mechronis audition. The player has now
  heard Kael's entire life **in reverse**. This is the moment the
  Tower Defense and Cades systems converge: the Tower Defense line
  is holding Terminus while Iron Lion holds Veridian VI —
  **both are the second line** of the same war.
- **Palimpsest Episodes (finale)** — the final arc of episodes
  resolves with the Meme deposed on Act 5 airwaves. Iron Lion's
  broadcast from §11.2 supplants the Meme's feed.
- **Clones Questline Payoff** — General Binath-VII sends the
  **Awakened Clone Collective** as Iron Lion's reinforcements for
  M5 "Operation Trojan Downfall." The player's Act 4 clone sidequest
  determines whether the Clone Collective fights or breaks on
  Veridian VI.
- **Signal Decryption payoff (M2)** — the Digital Onslaught mission
  is the final Signal Decryption set piece. Every decryption skill
  the player built from Prelude Beat H through Act 3 Infiltration
  gets used here. **Spy-class players have a dedicated advantage.**
- **Substrate Dungeon (unlock at Bond 80)** (`substrateDungeon.ts`) —
  after Act 5 completes, if Human Bond ≥ 80, The Human opens the
  Substrate Dungeon as the 17,033-year memory prison of his own
  captivity. Each floor is one 1,703-year decade of his imprisonment.
  This is canonically **post-Act 5 content** but unlocks as part
  of the Act 5 → Endgame transition.
- **Prestige Quests + Graduate Legion** (`prestigeQuests.ts`,
  `prestigeSystem.ts`, `graduateLegion.ts`) — unlock with Post-
  Credits M7 completion. The Antiquarian formally inducts the
  player as a Prestige-rank graduate. Multi-playthrough continuity
  begins here.
- **Yellow Coats post-credits payoff** — every NPC Inbox "Yellow
  Coats" message, every Hidden Data Chip clue, every Captain's
  Chair ghost visit culminates in the **Bridge of Kael** card
  reveal (§11.4). **This is the single biggest systemic payoff
  in the game** — a message the player has been receiving since
  Prelude Beat H.3 finally resolves.
- **Two Witnesses Meet cutscene (§1.5)** fires mid-Act 5 at Bond
  80. The forgiveness choice is the game's single most impactful
  moral decision. Three branches:
  - **Forgive both** → +200 Light, both narrators become permanent
    allies, both Bonds lock at 100 for the Endgame.
  - **Forgive one** → the other becomes dormant for the rest of
    the game (plays at tier F only, no V/D lines).
  - **Forgive neither** → **Lyra Vox unlocks as a third narrator**
    (`lyraVoxDialog.ts`). Her substrate lines become available in
    every room. `silence_ambient` filter preset activates
    permanently. This is the **canonical Forgive-Neither gate**.
- **Engineer Survival Reveal** — "The Bridge of Kael" card reveals
  the Engineer survived in Agent Zero's body. All Engineer-
  related systems (Engineer logs, Engineer Bench Hints, Hellbox
  origin, Prelude Beat A.4 partial, Act 1 Cycle C3 forced loss,
  Act 3 F3 Infiltration reunion) converge in this one reveal.
  **Every Engineer touchpoint in the game feeds this payoff.**
- **Living Ark** — The Bridge permanently changes. Iron Lion's
  helmet sits on the Captain's Chair from the post-credits
  moment forward. Every room's filter preset is determined by
  the Two Witnesses Meet outcome.
- **Living Universe** — Act 5 M7 Last Stand is a **community-
  wide mandatory death**. Every player who reaches it experiences
  the same forced-loss moment. Galaxy-wide +500 Light Energy
  spike on completion. The Meme's episode 13 reveal propagates
  as a galaxy-wide Loredex correction.

### Hook — Slideshow "The Lion in Black"

Iron Lion's voice broadcasting his last message. Images from the
**player's own playthrough so far** layered over the audio — every
sector they reclaimed, every companion argument, every card battle
won. **The Antiquarian is curating the feed.** First slideshow that
mirrors the player's own history back at them.

Final line delivered directly to the player:

> *"I broadcast this hoping someone would answer. I did not know it
> would take seventeen thousand years. I did not know it would be you.
> But you are here, and the Ark is listening, and I am going to tell
> you what to do."*

### The Seven Cades Missions (data file: `actsFourFiveShells.ts`)

| Mission | Canon Beat | Player Goal |
|---|---|---|
| **M1 — The Scout's Gambit** | canon | Reconnoiter enemy positions; reveal weakness in Prometheus's supply line |
| **M2 — The Digital Onslaught** | canon | Hack-and-shoot. Infiltrate an AI communication node. |
| **M3 — Turning the Tide** | canon | Compromised AI drones become allies. Fight alongside the enemy you just subverted. |
| **M4 — Harvesting the Future** | canon | Salvage and retrofit mission. Pick up crafting recipes for the card game. |
| **M5 — Operation Trojan Downfall** | canon | Joint assault. **Forced partial loss** — a quarter of your forces are annihilated. You will feel it. |
| **M6 — Alliance of Adversaries** | canon | **Recruit Vex Solène (Agent Zero).** She is the SAME woman the player met in Act 3 — the organic hitman who canceled their contract. In M6, she shows up on the battlefield on her own, unhired, **because the player asked her what she wanted** and nobody else ever did. Per the rev 4 canon correction, there is only one Agent Zero: Vex Solène. There is no "archival vs. real" twist. This mission is the moment she **stops being a hitman and joins the player's cause**. Her passive Warlord nano-swarm (captured during the Engineer's transference) deploys as a second-hand combat ability for the rest of Act 5. |
| **M7 — The Last Stand on Veridian VI** | canon | Iron Lion sacrifices himself. **Mandatory death sequence.** Final screen: the Iron Lion's helmet alone in a forest as the world dissolves. |

### Post-Credits — "The Bridge of Kael" (Rev 4 Canon)

The player returns to the Ark. Command Bridge is different. **Vex
Solène is standing at the Captain's Chair**, alive, present, waiting.
She has come home from the Last Stand with the player. A single
Dischordia card sits on the console: **"The Bridge of Kael"**.

When played, the card reveals the **final truth**:

> **The Engineer is dead.** He did not survive in Agent Zero's body.
> The "mind swap" Captain Voss/Lyra Vox recorded in the Hidden Data
> Chip was her *hope*, not her knowledge. The transference protocol
> the Engineer designed was meant to save Vex from the Warlord's
> nano-swarm possession. It worked — she is free, she is whole,
> she has his intellect — but it cost him every fragment of his
> consciousness to do it. He did not leave a ghost behind. He
> left **her**.
>
> The **Bridge** in "The Bridge of Kael" is not a place on the Ark
> and not a mind-swap hiding in plain sight. It is a **bridge
> between two people** — Kael and Vex Solène — that the Engineer
> built with his own death. Kael loved her. Kael lost her to the
> Warlord. The Engineer — Kael's oldest friend — refused to let
> her stay lost. So he gave himself as the bridge between them.
>
> Vex does not remember any of this. She knows only that she has
> the Engineer's intellect and none of his memories, and that
> someone somewhere at some time gave her a self she did not
> volunteer for. She is tired of being given things. She is
> choosing, for the first time, to stay.

Vex turns to the player and says **one canonical line** (already
authored as `zero_rev_dogtag` in VO Bible, now recontextualized as
her choice-to-stay line):

> **Vex Solène** (`zero_rev_dogtag`, re-read): *"My dog tag says
> Agent Zero. But the biometric data doesn't match my profile. It
> matches someone called The Engineer. I don't know who he was. I
> know he's why I am. I'm staying on this Ark. If that's all right
> with you."*

Elara cannot speak. The Human cannot speak. For the first time
since Prelude Beat F, both narrators are silent at once. Then
Elara, very quietly, says: *"Welcome aboard, Vex."* The Human,
even more quietly, says: *"I knew him. I'll tell you about him
someday."*

The card "The Bridge of Kael" is now the **second player-authored
card** in the player's deck — joining the Act 1 finale blank card,
which was the first. The card's effect: *"When played, your next
ally card has this card's stats added to theirs. Lasts until the
end of the match. Legacy cards cannot be destroyed."* It is a
mechanical tribute to sacrifice.

**The Engineer's Act 5 payoff is his absence, not his survival.**
Every hint the player followed — the Yellow Coats message, the
Hidden Data Chip, the partial Engineer's log in Cryo Bay, the
Fallen Dog Tag, the Engineer's recording Bench Hints, the forced
loss in Cycle C3 — was a trail of breadcrumbs left by **multiple
hopeful witnesses** (Captain Voss/Lyra Vox, Kael, The Human, Elara)
who each believed a different piece of the story. None of them had
the whole truth. The player, in this post-credits moment, is the
first person in 17,000 years to assemble all the fragments and see
that **the Engineer really did die, and it really was worth it**.

**Flags set:** `act5_complete`, `iron_lion_arc_complete`,
`engineer_true_fate_revealed` (now means: the player has confirmed
the Engineer is dead, not alive), `vex_solene_joins_crew`,
`bridge_of_kael_card_acquired`, `vortex_endgame_active`.

**Music:** P0 slideshow *"The Lion in Black"* (non-SiH opener); SiH
Act III/Epilogue — *Faithful and True* for M6 Agent Zero reveal;
*Fall of New Babylon* for M7 last stand; silence for the post-credits
Bridge of Kael beat.

---

## ENDGAME — "The Vortex Returns" (Community-Wide)

> Community endgame that pulls **every game mode** into one event.
> Functionally the same shape as the Necromancer Cycle boss event, at
> galactic scale.

**Orphans woven into the Endgame (the "every system at once" layer):**
- **Alliance War (full 19-hex grid)** — the hex map becomes the
  Vortex defense map. Each node is a sector under attack.
- **Cooperative Raids (daily)** — weekly raid rotation accelerates
  to daily during Vortex Advance. Field Commander Renn escalates.
- **Tower Defense (Terminus final line)** — the Kael questline's
  final waves are the **second line of defense** if the main
  Vortex front breaks. Player must hold both.
- **PvP Battle Engine (Arena broadcasts)** — every PvP match
  broadcasts to the community as morale signal. The Left and
  Right Game Masters commentate. High-level PvP wins grant
  community Light Energy bursts.
- **Substrate Dungeon** (Post-Act 5, Bond 80 gate) — The Human
  begins walking the player through the 17,033 years of his
  imprisonment during the Vortex. Each floor is a memory the
  Vortex would erase if it wins. **Dungeon progress directly
  feeds the community Light Energy meter** — the player is
  literally *remembering for the galaxy*.
- **Prestige Cycle Rollover** — if the community loses the first
  Vortex (Bulb Breaks outcome), the game resets with partial
  carryover via `actsFourFiveShells.ts` carryover shape. The
  player's authored identity chain from Act 4.5, their Memory
  Cards, their Bond 100 narrator state, and their Loredex
  progress persist. Everything else resets.
- **Reclamation Events (ongoing loop)** per §3.4 — after the
  first Vortex resolves either way, the Reclamation Event chain
  becomes the community's recurring activity:
  1. Forge a Light Beacon (Trade Empire mission chain)
  2. Open a Card Duel (community TCG match broadcast)
  3. Broadcast the Signal (Comms Array mini-puzzle)
  4. Cutscene: "A Sector Wakes" (consumed sector reboots)
- **Guild Wonders** — every Reclamation Event completed adds a
  Guild Wonder to the Memorial Corridor curated by The
  Hierophant. Guild plaques alongside personal ones.
- **Epoch Zero Triggers** (`epochZeroTriggers.ts`) — these plumb
  the **next cycle's Prelude** with carryover flags from the
  current playthrough.
- **Governance Hub (final community vote)** — the Endgame is
  gated by **one community-wide vote**: Light Holds or Bulb
  Breaks. Every player's cumulative Governance Hub voting
  history weights their individual vote.
- **All questlines fold in** — `questlineHumans.ts`,
  `questlineQuarchonFirstPattern.ts`, `questlineDemagi*.ts`,
  `questlineElements.ts`, `questlineVoltari.ts`,
  `questlineClones.ts`, `necromancerReturn.ts` — every faction
  questline contributes reinforcements to the Endgame battle
  based on how the player resolved them in Act 3.
- **Mastery Tree / Tech Tree** — Post-Endgame Prestige unlocks
  the final ranks of every class (Grandmaster → Mythic →
  Prestiged).
- **Living Ark** — The Ark is **the Reclamation HQ**. Every
  room is now a command center for a different Endgame system.
  Captain's Chair is no longer empty; the player sits there.
- **Living Universe** — The Endgame is **100% community-scope**.
  Every decision is galaxy-wide. The Endgame's final cutscene
  is the **Epilogue slideshow** SiH *All Things New* (track 18).

With Act 5 complete, `vortexProximity` finishes its approach. A final
galaxy-wide event fires: **the Vortex makes its move against the
Dreamer's Shield.** Every system in the game is called to the fight:

| System | Role in the endgame |
|---|---|
| **Dischordia TCG** | Card players fight Vortex battles as live sector defenses |
| **Crafting / Engineer's Bench** | Crafters supply the front with cards, buffs, consumables |
| **Trade Empire** | Runs resource convoys; convoy losses are permanent Dark Energy |
| **Chess** | Battlefield planning; chess wins grant community-wide cooldowns |
| **Pet Battles + Breeding** | Players field their dynasties; Memory Cards from dead pets become one-time emergency plays |
| **Cades FPS** | Players hold the line at The Bridge of Kael |
| **Degen's Casino** | Players can **bet the Vortex's next move** and influence the odds |
| **Collector's Arena** | Arena becomes a live broadcast feed for community morale |
| **Fighting Game** | Prisoner-path veterans fight Thought Virus lieutenants inside hijacked Arks |
| **Dead Man's Circuit** | Evacuation races — clear civilian fleets from consumed sectors |
| **Alliance War / Coop Raids / Tower Defense** | All endgame multiplayer modes fold into sector defense objectives |

Resolves in one of two final community slideshows:
- **"The Light Holds"** (win) — SiH Epilogue *All Things New* plays
- **"The Bulb Breaks"** (loss) — cycle resets with partial carryover,
  same shape as the Necromancer Cycle, unlocking a Prestige rollover

### Reclamation Loop (Ongoing After Endgame First Fires)

Mirroring the Necromancer Banishment Coalition chain:

1. **Forge a Light Beacon** — Trade Empire mission chain (3 resources
   from 3 faction territories)
2. **Open a Card Duel** — community member wins a Dischordia match vs.
   a specified opponent, broadcast live
3. **Broadcast the Signal** — Comms Array mini-puzzle that every
   participating player clicks once
4. **Cutscene: "A Sector Wakes"** — consumed sector reboots on the
   galaxy map, art gains gold border, residents return as trade
   partners, every participant gets a Reclaimer tome page + +200 Light

**Flags set:** `endgame_unlocked`, `vortex_advance_active`, then either
`the_light_holds` or `the_bulb_breaks` per outcome; `prestige_cycle_1`
on first cycle reset.

---

## Orphan Systems — Placement Recommendations

These systems exist in code today but have no clear narrative home in
the Witnessing act spine. For each, this layout proposes where it
should live. None of these should be built out further until they have
a claimed act slot.

### Clean Act Slot Assignments (Proposed)

| Orphan system | File | Proposed act slot | Rationale |
|---|---|---|---|
| **Alliance War** (guild hex grid) | `apps/client/src/game/AllianceWarPage.tsx`, `apps/shared/allianceWar.ts` | **Endgame** (community-wide defense) | Natural fit for Vortex sector defense |
| **Cooperative Raids** (weekly bosses) | `apps/shared/coopRaids.ts` | **Act 3 onwards**, peaks in Endgame | Role system (Tank/DPS/Support/Healer/Scout) matches 5-class roster |
| **Tower Defense** | `apps/shared/towerDefense.ts` | **Endgame** sector defense | Per §B.4 of the Witnessing proposal, "every tower is an insurgent" — the Kael Asynchronous Questline (Appendix B) uses towers to tell Kael's backstory in reverse chronology |
| **PvP Battle Engine** | `apps/shared/pvpBattle.ts` | **Act 2 onwards** (Collector's Arena variant) + Endgame | Canon: Collector's Arena is public TCG |
| **Trade Empire Piracy** | `tradeEmpire.ts` improvements §8 | **Act 3 onwards** in lawless sectors only | Per §8 improvement #8 |
| **Substrate Dungeon** (10-floor roguelike) | `apps/shared/substrateDungeon.ts` | **Post-Act 5 / Endgame prestige** | Canon: 10 floors = 17,033 year memory prison of The Human. This is where you go once you know who The Human really is. |
| **Terminus Swarm Tower Defense** | `apps/client/src/game/terminus-swarm/` | **Act 3 Faction F4 gate** + Appendix B Kael Asynchronous Questline | The canonical vehicle for the Kael backstory per §Appendix B |
| **Infiltration Runner** (21 stages, 6 factions) | `InfiltrationRunner.tsx`, `infiltrationContent.ts` | **Act 3 Infiltration path primary minigame** | Already matches §7.3 six-faction structure |
| **Signal Decryption** | `SignalDecryption.tsx` | **Act 3 Infiltration variant** + **Act 5 Cades M2 Digital Onslaught** | Already wired to infiltration content |
| **Hacking Puzzle / Pipe Maze** | `HackingPuzzle.tsx` | **Acts 2–3 system breach minigame** | Used anywhere a system breach is needed |
| **Christmas in July (seasonal)** | `apps/shared/christmasInJuly.ts` | **Seasonal overlay on Degen's Casino** (Act 4.5 onwards) | Only casino gates it per §10.2 |
| **Oracle Deck / Tarot** | `apps/shared/tcg-core/tarot/` | **Acts 2–3 flavor layer + Oracle class mastery perk** | Tied to Oracle class divination perks |
| **Song Slideshow / Trigger Map** | `songSlideshow.ts`, `songTriggerMap.ts` | **Acts 1–5 cinematic engine** (load-bearing, not optional) | Per §5 — this IS the cutscene engine |
| **Voting / Governance / Year One Votes** | `engineerGovernanceVotes.ts`, `governance.ts`, `yearOneVotes.ts` | **Acts 2–5 background political layer** via Galactic Dance NPCs | The Year One Calendar organizes these |
| **Bestiary / Species Collection** | `BestiaryPage.tsx`, `arkSpecimens.ts` | **Acts 2–5 collection flavor** tied to Pet Dynasty | Per §2.5 pet genetics |
| **Bounty Board** | `BountyBoardPage.tsx` | **Act 3 Trade Empire side quests** | Natural fit with Infiltration flavor |
| **Witnessing Hub / Witnessing Runtime** | `witnessingHub.ts`, `witnessingRuntime.ts`, `witnessingIntegrations.ts`, `witnessingValidator.ts` | **Appendix/cross-cutting** — this IS the meta-narrator infrastructure | Already serves the full Witnessing proposal |
| **Kael Asynchronous Questline** | `appendixBKaelQuestline.ts` | **Acts 1–5 asynchronous background quest** per Appendix B | Uses Terminus Swarm waves as delivery vehicle |
| **The Palimpsest Game Show Arc** | `PalimpsestEpisodesPage.tsx` | **Act 3–4 interleave** per Appendix C | Episode 13 is the Host-is-the-Meme reveal |

### Placement Problems (Need User Decisions Before Building)

| System | File | Problem |
|---|---|---|
| **Guild Wonders** | `guildWonders.ts` | Collectible monument system with no story hook. **Recommendation:** delete or fold into Reclamation Event rewards as legacy markers. |
| **Prestige Quests** | `prestigeQuests.ts`, `prestigeSystem.ts`, `graduateLegion.ts` | Post-Grandmaster content, no narrative framing. **Recommendation:** tie to Prestige Cycle carryover after first Vortex endgame (`actsFourFiveShells.ts` already has a carryover shape). |
| **Cryogenic Dreams** | `cryoDreams.ts` | Dream-state narrative fragments, unclear trigger. **Recommendation:** use as Prelude Cryo Bay content or as Act 4 Prisoner memory hints. |
| **Bounty Board** | `BountyBoardPage.tsx` | Mechanically unclear. **Recommendation:** Act 3 Trade Empire flavor. |
| **Palimpsest Episodes** | `PalimpsestEpisodesPage.tsx` | Under-authored music/album delivery; **overlaps Appendix C The Palimpsest Arc**. Confirm these are the same system. |
| **Star Chart** | `StarChartPage.tsx` | Skeleton only. **Recommendation:** fold into Trade Empire galactic map (§8 improvements). |
| **Training Mode Overlay** | `TrainingModeOverlay.tsx` | Entry point unclear. **Recommendation:** make the Prelude Pet Garden also serve as Training Mode. |
| **NPC Inbox** | `NPCInboxPage.tsx` | Messaging system with no mechanics. **Recommendation:** use as Act 3 Council ending (F1/F2/F5 diplomacy) delivery vehicle. |
| **Collector Garden (player housing)** | `CollectorGarden.tsx` | Housing customization not wired. **Recommendation:** unlock alongside Trophy Room in Appendix A.10 (Acts 3+). |
| **Gamesmaster's Arena** | `GamemastersArena.tsx` | High-stakes TCG variant. **Recommendation:** this IS where you fight the Two Game Masters (§6.4). |
| **House Competition / Apprentices / Apprentice Rivalries / Betrayal / Permadeath** | `houseCompetition.ts`, `apprentices.ts`, `apprenticeRivalries.ts`, `apprenticeBetrayal.ts`, `apprenticePermadeath.ts` | Celebration school social system. **Recommendation:** wire directly into Cycle A 28-day Mascoteer loop per §4.3. |
| **Mastery Tree / Tech Tree** | `masteryTree.ts`, `techTree.ts` | Progression branching, no narrative framing. **Recommendation:** these ARE the Class Mastery + Engineer's Bench trees; unify with `classMastery.ts`. |
| **Donation / Cosmetic Shop** | `donationSystem.ts`, `cosmeticShop.ts` | Economy sink, no narrative tie. **Recommendation:** route through Degen's Casino as "house favors." |
| **Seasonal / Monthly Events** | `seasonalEvents.ts`, `monthlyEvents.ts` | Template framework, no content. **Recommendation:** Year One Calendar (§14) organizes these. |
| **Rank Decay / Friendly Challenges** | `rankDecay.ts`, `friendlyChallenges.ts` | PvP infrastructure, minimal impl. **Recommendation:** fold into Collector's Arena leaderboards. |
| **Cross-Game Synergy** | `crossGameSynergy.ts` | Framework only. **Recommendation:** ties Cades FPS + Dead Man's Circuit + main app together for Prestige Cycle rewards. |
| **Epoch Zero Triggers** | `epochZeroTriggers.ts` | Pre-campaign setup, unclear scope. **Recommendation:** this IS the Prelude's hidden flag system. |
| **Economy / Endgame Sinks** | `economySinks.ts`, `endgameSinks.ts` | Balancing stubs. **Not a narrative system — leave as tuning layer.** |
| **Citizen Traits / Talents** | `citizenTraits.ts`, `citizenTalents.ts` | Follower trait system. **Recommendation:** use for crew/trade-fleet commanders per §8 improvement #5. |

---

## Unified System-Weaving Audit (Proof Everything Builds Together)

> **User directive (rev 3):** *"Make sure to examine every system and
> make sure it's all building together in one logical fashion both
> narratively and systematically."*
>
> This section is the structural proof. Every system in the game has
> at least one **inbound** connection (who introduces it / what earlier
> event unlocks it) and at least one **outbound** connection (what
> later system consumes it / what meter it writes to). No system is
> an island.

### Full System Graph — Who Teaches What, When, and What It Feeds

| System | Teacher NPC | First appearance | Inbound dependency | Outbound writes to | Payoff moment |
|---|---|---|---|---|---|
| **Dialog Wheel** | Elara | Prelude Beat A.1 | Awakening sequence | Every subsequent NPC dialog; corruption state degrades visuals | Act 5 Two Witnesses Meet forgiveness choice |
| **Class Mastery (rank 1)** | Elara (class shield puzzle) | Prelude Beat A.3 | Class pick in A.1 | Every class-gated puzzle + dialog option across all acts | Act 5 class-specific endgame cutscene |
| **LucasArts Point-and-Click Adventure** | Elara | Prelude Beat A.2 | Murder mystery | Beat B power puzzle, Beat H resumed puzzles, Act 1 Celebration rooms | Act 3 Infiltration Runner inherits the grammar |
| **Shadow Tongue Faction Reveal** | Elara (via edited code) | Prelude Beat A.2 | Murder mystery solution | Archives glitch overlay; Act 3 F2 Hierarchy Diplomacy path; Act 3 Shadow Tongue apprentice path | Act 3 F2 Infiltration — player becomes Shadow Tongue apprentice |
| **Hierarchy of the Damned Reference** | Elara (artifact reaction) | Prelude Beat A.2 | Ritual marking hotspot | Act 3 F2 faction arc | Act 3 F2 Conquest / Diplomacy / Infiltration |
| **Engineer Card Game Logs (partial)** | Engineer (recording) | Prelude Beat A.4 | Cryo Bay hotspot | Beat H full reveal; Act 1 Cycle C3 forced loss; Act 5 post-credits | Act 5 Bridge of Kael post-credits |
| **Hacking-Pipe Puzzle (Engineer class)** | Patch recording | Prelude Beat B.1 | Power converter panel | Act 2 Crafting Bench fusion puzzles; Act 3 Infiltration F1 New Babylon Conquest | Act 3 — "reactor flow = card spell" diegetic payoff |
| **Signal Decryption (Spy class)** | The Human | Prelude Beat A.3 OR Beat H | Class pick or Comms Array | Act 3 Infiltration Runner; Act 5 Cades M2 Digital Onslaught | Act 5 M2 |
| **Cloning Pod (Automatic Activation)** | Elara narrates | Prelude Beat B.2 | Power restoration | First pet emergence; Virus outbreak; Hellbox discovery | Act 3 F3 Insurgency infiltration (Agent Zero body) |
| **Pet System entry** | Little One (non-verbal) | Prelude Beat B.2 | Cloning pod open | Pet Garden; Beat G pet battle; Act 1 Memory Card reveal | Act 1 finale — dead pet becomes Memory Card |
| **Thought Virus Outbreak** | Elara + Patch | Prelude Beat B.3 | Cloning contamination | Virus meter (personal + community); Beat G corridor clear; Act 3 F4 Terminus; Act 4 Prisoner infection; Act 5 Terminus final | Act 5 — Terminus defense line holds or breaks |
| **Hellbox / Matrix-of-Dreams Portal** | Itself (Lyra Vox hint) | Prelude Beat B.4 | Hidden in cloning pod | Celebration fast-travel for all acts; Act 1 Cycle A Celebration rooms; Act 4 Casino edge | Act 5 Substrate Dungeon (Human bond 80 gate) |
| **Hellbox POV Cinematic** | The hellbox | Prelude Beat C | First touch | First playthrough only; reusable as fast-travel after | — |
| **Matrix of Dreams Lore** | Gary the Ninth | Prelude Beat D.1 | Celebration arrival | Every Dischordia battle; Collector's Arena public face; Prisoner's cells; Casino edge | Act 5 Vortex Returns — "the Matrix of Dreams IS the substrate" |
| **Governance Hub (first vote)** | Gary | Prelude Beat D.2 | Matrix explained | Year One Calendar community votes; Act 2 Crafting Bench first scene detail; Act 3 Trade Empire sector referenda; Endgame Vortex community vote | Endgame — community decides win/loss split |
| **Celebration Trial Rules** | Gary | Prelude Beat D.3 | Governance Hub explained | Act 1 Cycle A 28-day Mascoteer trial | Act 1 Cycle A graduation exams (A1/A2/A3 card battles) |
| **House Competition + Apprentices** | Gary | Prelude Beat D.4 | Trial rules explained | Apprentice bond + permadeath in Act 1 Cycle A | Act 1 Cycle A apprentice death → Memory Card |
| **Chess Tutorial (or skip)** | Gary | Prelude Beat D.5 | House assigned | `chess_depth` stat; Act 2 §6.3 chess unlocks (Preview Cards ≥3, Undo ≥5, Engineer's Opening ≥8); Act 2 Two Game Masters losses | Act 2 chess depth 8 grants Engineer's Opening |
| **Moral Choice (Pet Sacrifice)** | Gary presents, player chooses | Prelude Beat E | Celebration complete | Light/Dark meter ±100; Silver Argument card; Little One trust; apprentice trust | Act 3 F3 Infiltration Engineer reunion tone |
| **The Human (first contact)** | The Human | Prelude Beat F | Moral choice resolved | Mobile Narrator system active; trust tier ladder begins; Bond 80 Two Witnesses Meet at Act 5 | Act 5 Two Witnesses Meet cutscene |
| **Spore Consequence (Dark path)** | Elara alarm | Prelude Beat F | `spore_attached` + `pet_sacrificed` | Beat G pet battle forced Little One borrow; virus meter bump | Beat G cascade clear |
| **Pet Battle Engine** | Little One | Prelude Beat G | Pet System + Corridor quarantine | Bestiary; Memory Traits; community virus meter; Act 1 Cycle A Mascoteer battle buffs; Act 3 F4 pet vs virus strain; Endgame dynasty deployment | Endgame — pet dynasty fields |
| **Pet Breeding / Dynasty** | Little One | Prelude Beat G (lore) + Act 1 (full open) | Pet battle complete | Memory Card inheritance across generations; Trade Empire §8 crew commander overlap (Citizen Traits) | Act 1 — first inherited trait passes to offspring |
| **Bestiary / Specimen Collection** | Little One (curator) | Prelude Beat G | Spore dissolution | Persistent codex; Act 3 F6 Antiquarian memory sacrifice; Act 5 final entries | Acts 3–5 — every creature encountered files here |
| **Training Mode Overlay** | Little One | Prelude Beat G | Pet Garden unlock | Reusable practice for any mechanic in Acts 1–5 | Always-available practice |
| **NPC Inbox** | Elara | Prelude Beat H.3 | Mess Hall visit | Crew messages, faction messages, Meme broadcasts, Yellow Coats foreshadow | Act 5 post-credits Bridge of Kael payoff |
| **Crafting Bench preview (locked)** | Patch | Prelude Beat H.2 | Engineering visit | Act 2 §6.2 Engineer's Bench unlocks with Memory Energy | Act 2 first crafted card |
| **Dream Currency** | Patch + Reactor Core | Prelude Beat H.2 | Reactor inspection | Currency for crafting, arena entry, casino bets, research | Acts 2–5 economy layer |
| **Trade Empire Terminal (locked)** | Elara | Prelude Beat H.4 | Cargo Bay visit | Act 2 wrap unlocks; Act 3 primary system | Act 3 Trade Empire + Infiltration Runner |
| **Collector Reference / Oracle Clone** | Elara (torn manifest) | Prelude Beat H.4 | Cargo Bay hotspot | Act 3 F6 Antiquarian arc; Act 3 Collector's Garden climax; Act 4 Prisoner Cell 4 Meme/White Oracle | Act 3 Collector's Garden boss |
| **Tower Defense / Terminus Swarm** | Zephyr-9 | Prelude Beat I.2 | Bridge visit | 12-chapter Kael questline (Appendix B reverse chronology); community virus meter contribution | Act 5 — Terminus quarantine holds/breaks |
| **Kael Asynchronous Questline** | Archival Kael recordings | Prelude Beat I.3 | Tower Defense unlock | 6 fragments across Acts 1–5 in reverse chronology | Act 4 Prisoner's cells — Kael memories are Act 4 boss extractions |
| **Community Thought Virus Meter (visible)** | Zephyr-9 | Prelude Beat I.2 | Tower Defense unlock | Every subsequent game-mode writes to this meter; Reclamation Events | Endgame — meter determines Vortex arrival speed |
| **First-Wave Potentials Lore** | Zephyr-9 | Prelude Beat I.2 | Bridge holographic overlay | Act 3 F4 Terminus Dominion arc; Act 5 Veridian VI second line | Act 5 M7 Last Stand on Veridian VI |
| **Conspiracy Board / Faction Web** | Elara (Line 45) | Prelude Beat I.1 | Bridge visit | Act 3 Trade Empire six-faction arcs | Act 3 — every faction node unlocks a quest |
| **Timeline Projector** | Elara (Line 46) | Prelude Beat I.1 | Bridge visit | Act 3 Antiquarian's Library extension; post-Act 5 CoNexus Tomes | Post-Act 5 Antiquarian's Library |
| **Captain's Chair Hologram** | Elara (Line 47) + hidden Voss ghost | Prelude Beat I.1 | Hidden Data Chip decoded | Act 5 Bridge of Kael post-credits | Act 5 post-credits |
| **Navigation Console (locked)** | Elara (Line 48) | Prelude Beat I.1 | Visible but inert | Act 2 Zephyr-9 chess unlock re-contextualizes; Act 3 Trade Empire unlocks | Act 3 — faster-than-light travel opens |
| **Hidden Data Chip "Yellow Coats"** | Captain Voss / Lyra Vox (hopeful past-tense recording) + Vex Solène (Beat H.3 inbox) | Prelude Beat I.1 + Beat H.3 inbox (two paths) | Hidden Cryo/Bridge hotspots | Act 5 post-credits Bridge of Kael (**the Engineer IS dead — the chip was Lyra Vox's pre-sacrifice hope, not the truth**) | Act 5 post-credits Bridge of Kael reveal + Vex Solène joins crew |
| **Alliance War (preview)** | Elara (Red Crystal Accord) | Prelude Beat I.4 | Bridge hologram | Act 3 Locke unlocks full interactivity; Endgame Vortex sector defense uses the 19-hex grid | Endgame Vortex defense |
| **Archives Room** | Elara | Prelude Beat J.1 | Bridge complete | Loredex; Potential Origin Reveal; CoNexus Tomes; Dischordia glimpse | Every subsequent act's Loredex entries |
| **Potential Origin Reveal** | Elara + The Human | Prelude Beat J.2 | 5 rooms + Archive access | Permanent tone flag flavors all subsequent dialog | Every act 1–5 Elara/Human scene |
| **The Antiquarian (first voice)** | Himself | Prelude Beat J.2 | Orb of Worlds | CoNexus Tomes; post-Act 5 Library; Dead Man's Circuit §10.1 narration | Post-Act 5 Library |
| **Song Slideshow Engine (first fire)** | Cutscene system | Prelude Beat J.3 | Archives cutscene | Every Act 1–5 slideshow cinematic uses this engine | Act 1 *Last Words* slideshow |
| **Friendly Challenges (async PvP)** | Elara (Orb routing) | Prelude Beat J.3 | Dischordia glimpse | Act 1+ async duels against other Arks | Acts 1–5 background PvP |
| **Dischordia TCG (full game)** | Elara + Human (via deck) | Act 1 opens | Prelude Beat J handoff | The Engineer's biography battles; Collector's Arena; Infiltration Runner; Prisoner | All of Act 1 |
| **Celebration Trial 28-day Loop** | Mascoteers (12) | Act 1 Cycle A start | Prelude Beat D rules explained + House assigned | Act 1 Cycle A card battle buffs; apprentice permadeath | Cycle A graduation exams |
| **Engineer's Bench (Crafting)** | Patch (recording) + Engineer logs | Act 2 §6.2 | Act 1 complete | Card forging; Memory Energy sink; Trade Empire dependency | Act 2 first fusion craft |
| **Chess (full game via Zephyr-9)** | Zephyr-9 at Navigation Console | Act 2 §6.3 | Prelude chess depth stat | Preview Cards / Undo / Engineer's Opening | Act 2 Two Game Masters losses |
| **Collector's Arena** | Two Game Masters | Act 2 §6.4 | Zephyr-9 chess loss | Dark Energy meter; PvP Battle Engine; Gamesmaster's Arena room | Act 3 Left GM climax; Act 4 Right GM climax |
| **Thaloria Cinematic** | Left Game Master | Act 2 §6.5 | Third Arena win | Shadow Tongue birth retro-explained; Halverez xenomorph helmet link | Retroactive Loredex unlock |
| **Trade Empire (full)** | Adjudicator Locke | Act 3 §7 | Act 2 complete | Six faction arcs with Conquest / Diplomacy / Infiltration resolutions; Piracy; Living Sector Economies | All of Act 3 |
| **Diplomacy "The Table" minigame** | Locke | Act 3 §7.2 | Trade Empire unlock | Round-table negotiation; Act 3 F1 Red Crystal Accord | Act 3 faction treaties |
| **Infiltration Runner** | The Eyes (recordings) | Act 3 §7.3 | First Infiltration path | 21 stages across 6 factions | Act 3 F3 Engineer reveal; Collector's Garden climax |
| **Eyes Biography** | The Eyes + Elara + The Human | Act 3 §7.4 | Opening cinematic | 7 sector-embedded lore fragments | Act 3 Collector's Garden |
| **Cooperative Raids** | Field Commander Renn | Act 3 (Insurgency arc reward) | Insurgency faction arc done | Weekly raid bosses; community light spikes | Endgame daily raids |
| **Alliance War (full)** | Adjudicator Locke | Act 3 (New Babylon arc reward) | New Babylon arc done | 19-hex sector defense | Endgame Vortex defense |
| **Fighting Game / Prisoner** | The White Oracle | Act 4 §9 | Act 3 complete | 4 cells extract Kael memories | Act 5 dual closing |
| **Dead Man's Circuit (racing)** | The Antiquarian | Act 4.5 §10.1 | Act 4 complete | Player authors identity chain → Loredex entry | Prestige rollover |
| **Degen's Casino** | The Degen | Act 4.5 §10.2 | Act 4 complete | Always-open economy sink + Pact game | Acts 4.5–5 optional |
| **Cades FPS / Iron Lion Last Stand** | Iron Lion archival | Act 5 §11 | Act 4.5 complete | 7 missions as Veridian VI | Act 5 M7 mandatory death |
| **Substrate Dungeon** | The Human (bond 80) | Post-Act 5 | Act 5 complete + Bond 80 | 10-floor roguelike of Human's 17,033-year imprisonment | Prestige rollover |
| **Prestige Quests + Graduate Legion** | The Antiquarian | Post-Act 5 | Endgame Vortex resolution | Legacy carries to next playthrough | Multi-playthrough continuity |
| **Governance Hub (full)** | Community | Acts 2–5 + Endgame | Prelude first vote | Year One Calendar community votes | Endgame Light Holds vs Bulb Breaks community vote |

**System graph integrity check:** Every row above has at least one
inbound and one outbound connection. No orphan systems remain — every
system from `apps/shared/` and `apps/client/src/game/` has either been
placed in an act slot, folded into a cross-cutting system, or explicitly
marked as a tuning layer (Rank Decay, Economy Sinks).

---

## Orphan Systems — Detailed Catalog (For User Placement)

> **Design principle (from user, rev 2):** *Every game system is how the
> player learns about a character. Every tutorial must come from a
> specific NPC with a lore-justified reason and motivation to teach it.*
> Every orphan below is annotated with a proposed **teacher NPC**, a
> **lore hook** that justifies why they teach this, and 2–3 candidate
> act slots. The user picks.

Orphans are grouped by shape. Each entry gives: file, status, one-line
purpose, proposed teacher NPC, lore hook, candidate act slots, and any
open question the user should answer.

### Group 1 — Systems Already Placed in This Revision

These were orphans in the previous version of this plan, but the user's
latest directive placed them concretely. They're listed here for
completeness with their new homes.

#### Tower Defense (PLACED — Prelude Bridge + Kael Asynchronous Questline)
- **Files:** `apps/shared/towerDefense.ts`, `apps/client/src/game/terminus-swarm/TerminusSwarmPage.tsx`, `apps/shared/appendixBKaelQuestline.ts`
- **Status:** PARTIAL (framework + Appendix B questline data)
- **What it does:** Grid-based defense where the player places towers to stop waves of infected. The Witnessing proposal's Appendix B reframes every tower as a dead Insurgent — each tower's slot, placement, and upgrade is a **fragment of Kael's backstory** told in **reverse chronology**.
- **Placed at:** Prelude Bridge room (discovery) + Acts 1–5 as an **asynchronous background questline** that the player returns to between acts.
- **In-story framing:** The first wave of Potentials woke up 17,000 years before the player and left their **far more powerful Arks** crashed on the surface of **Terminus**, the quarantine world. Those Arks' automatic defenses are still running. If the Thought Virus breaks through those defenses, it gets off Terminus and reinfects the universe. **Defending the crashed Arks IS defending the galaxy from a second Fall.**
- **Teacher NPC(s):**
  - **Zephyr-9** (Quarchon ship-core fragment, Prelude crew) — she unlocks the Tower Defense interface from the Bridge console because she is the only crew member who can read the Terminus automatic-defense substrate. Her framing: *"The Arks on Terminus are dying. Their shields were built to outlast the war that broke them. They are outlasting it. But they will not outlast us."*
  - **Archival Kael recordings** (non-present NPC) — as the player progresses through the 12 Tower Defense chapters, Kael's own voice plays back **in reverse**. Chapter 12 is his earliest recording (the Recruiter training at Mechronis). Chapter 1 is his final transmission before the Thought Virus took him. The player learns Kael's story **by running his rewind**. This is the Appendix B "reverse chronology" thesis.
  - **Iron Lion echo** (optional, at chapter transitions) — Iron Lion's archival broadcasts cut in at chapter boundaries. Narrative bridge to Act 5 Cades.
- **Living-world hook:** The **Thought Virus pressure meter** (§7 of cross-cutting systems) ticks up on a slow real-time tick. Every completed Tower Defense wave **reduces** the meter. Community-wide, when the meter climbs too high, **Vortex Advance sub-events** fire — infected sectors lose stability, NPCs in Trade Empire become paranoid, Loredex entries corrupt. This is the first place the Thought Virus meter has **community consequences**, not just personal debuffs.
- **Lore payoff:** Tower Defense feeds directly into the **next reveal** (the user has not specified which — flagged as open question below). Most likely feeds the Act 3 Infiltration F4 "Terminus Dominion" faction arc, since the first-wave Arks and the Thought Virus faction are the same lore layer.
- **Candidate next reveals it could feed (USER CHOICE):**
  1. **Act 3 F4 Terminus Dominion** — you already know who Kael was by the time you fight The Source, so the fight is grief, not discovery.
  2. **Act 4 Prisoner's Cell 1** — Kael's pre-virus self is the first memory extracted; the Tower Defense waves are the memories you unlocked to make the extraction possible.
  3. **Act 5 M6 Agent Zero reveal** — the Tower Defense recordings of Iron Lion are what let the player recognize the real Agent Zero.
- **Open question:** Which of the three reveal targets is canon? The user's directive says "this should feed into the next reveal" but doesn't name the reveal.

#### Terminus Swarm (PLACED — same slot as Tower Defense)
- **File:** `apps/client/src/game/terminus-swarm/TerminusSwarmPage.tsx`
- **Status:** SKELETON only
- **What it does:** The TypeScript/Canvas implementation surface for the Tower Defense above. Same system, different code layer — the Godot Cades FPS and this TS Tower Defense are both "Terminus" content.
- **Placed at:** Same as Tower Defense. Terminus Swarm IS the in-app wave-defense client; `towerDefense.ts` is its data layer.
- **Teacher NPC:** Zephyr-9 (same as above).
- **Merge recommendation:** Rename `TerminusSwarmPage.tsx` to `TerminusDefensePage.tsx` and treat `towerDefense.ts` + `appendixBKaelQuestline.ts` as its shared data. One game, one namespace.

#### Governance Hub / Voting Systems (PLACED — Prelude Celebration orientation)
- **Files:** `apps/shared/governance.ts`, `apps/shared/yearOneVotes.ts`, `apps/shared/engineerGovernanceVotes.ts`
- **Status:** PARTIAL (vote schemas + Year One event framework)
- **What it does:** Weekly / monthly / daily community vote system with narrative consequences. Originally conceived as live-ops.
- **Placed at:** Prelude — **Gary the Game Master** introduces it during the Celebration orientation day as "the user interface for reality." The player casts their **first vote** during orientation.
- **In-story framing (USER DIRECTIVE):** The Governance Hub is not a menu. It is the **UI for reality**, the mechanism by which a Potential's **will shapes the Matrix of Dreams**. Celebration Trials train you to use it; every vote you cast in the Hub writes to the Matrix substrate and **bends the world slightly**. The player has no idea this is real until Act 2, when a sector in Trade Empire bends in a direction they voted for — at which point Elara realizes what they've been doing. The Year One Calendar (`YEAR_ONE_EVENTS_CALENDAR_V2.md`) 4-act community live-ops structure runs on top of this.
- **Teacher NPC:** **Gary the Game Master** — canonically Gary the Ninth (Mascoteer child form of the Necromancer, per Witnessing §4.3 bonus battles), reframed for the Prelude as the Celebration orientation tutor. His motivation: *he runs Celebration*, and Celebration IS the governance UI tutorial. He tells the player: *"Is the Matrix of Dreams a simulation or is it an alternate reality your mind hacked into? No one knows. I don't. The Architect didn't either. But it is responsive, and that is what Governance Hub is for. You vote. The world listens. That is all."*
- **Candidate further act slots:**
  - **Acts 2–5 community live-ops layer** (Year One Calendar mapping)
  - **Act 3 Trade Empire sector referenda** — diplomatic path treaties become Governance Hub proposals
  - **Endgame Vortex Returns community vote** — the final community vote decides the win/loss split between "Light Holds" and "Bulb Breaks"
- **Open question:** Does the first Governance Hub vote in the Prelude have mechanical persistence, or is it a tutorial-only vote that doesn't count? Recommendation: **it counts**, permanently, and the player finds out in Act 2 that their Prelude vote is now canon.

---

### Group 2 — Multiplayer & Community Combat Systems

These are the systems that let multiple players share the same galaxy.
Each one needs a character that represents "the other players" to the
single-player narrative.

#### Alliance War (PvP guild hex grid)
- **File:** `apps/client/src/game/AllianceWarPage.tsx`, `apps/shared/allianceWar.ts`
- **Status:** PARTIAL (24h placement phase + 24h attack phase, 19-node hex map)
- **What it does:** Guild-vs-guild territorial combat. Place TCG decks on hex nodes to defend, attack enemy nodes with offensive decks.
- **Teacher NPC candidates:**
  - **Adjudicator Locke** (New Babylon, canon) — he opens the Alliance War system as "the only legitimate form of warfare under the Red Crystal Accord." Lore: after the Fall, war between Potential factions is illegal, but "sanctioned territorial disputes under Authority oversight" are not. Alliance War is that legal fiction.
  - **General Binath-VII** (Awakened Clone Collective, Galactic Dance NPC #4) — he frames Alliance War as clone military doctrine; "identity emerges from choice, including the choice to hold ground."
- **Lore hook:** The 19 hex nodes map to 19 contested sectors from Trade Empire. Alliance War is **the meta-layer where Trade Empire sector control becomes persistent across the community**.
- **Candidate act slots:**
  1. **Act 3 Trade Empire cross-cutting PvP layer** (opens alongside Trade Empire, peaks with Act 3 faction conquest)
  2. **Endgame Vortex defense** (sector defense in the Vortex advance event uses the same hex grid)
  3. **Both** — Act 3 unlocks it, Endgame makes every participating guild a sector defender
- **Recommendation:** Option 3. Adjudicator Locke introduces it in Act 3 as a faction quest reward. At Endgame, all 19 hexes become Vortex defense targets.

#### Cooperative Raids (weekly PvE bosses)
- **File:** `apps/shared/coopRaids.ts`
- **Status:** PARTIAL (weekly boss rotation, 5-role system: Tank / DPS / Support / Healer / Scout)
- **What it does:** 5-player coop raid against weekly rotating bosses. Role system matches the 5 Potential classes (Soldier / Assassin / Oracle / Engineer / Spy).
- **Teacher NPC candidates:**
  - **Field Commander Renn** (Insurgency Forward, Galactic Dance NPC #6) — her brief is "active military resistance." Coop raids are her operational expression.
  - **Orin Fell** (Insurgency Remembrance, Galactic Dance NPC #5) — he preserves Iron Lion's legacy and "waits for something larger." Coop raids are where the waiting ends.
- **Lore hook:** Each weekly raid boss is an "agent of the Source" — a corrupted Archon, a Warlord fragment, a Thought Virus manifestation. **Killing them is the only way the Light Energy meter can spike fast.** Raids are therefore the community's fastest lever against Vortex Proximity.
- **Candidate act slots:**
  1. **Act 3 onwards** (raids unlock alongside the Insurgency faction arc)
  2. **Act 2 Collector's Arena expansion** (raids as coop Collector's Arena tournaments)
  3. **Endgame** (raid boss per week becomes raid boss per day during Vortex advance)
- **Recommendation:** Option 1. Field Commander Renn unlocks raids as a reward for completing the Act 3 Insurgency faction arc (F3 Diplomacy or Conquest path).

#### PvP Battle Engine
- **File:** `apps/shared/pvpBattle.ts`
- **Status:** PARTIAL (deterministic server-side match logic)
- **What it does:** Real-time multiplayer Dischordia TCG battles with ranked ladder.
- **Teacher NPC candidates:**
  - **The Right Game Master** (Witnessing §6.4) — improvisational, cruel, artistic. He is the Collector's Arena master of ceremonies; PvP is his circuit.
  - **The Left Game Master** — tactical, analytical, cold. The Left GM is the one who grades your PvP rating.
- **Lore hook:** Per §6.4, the Collector's Arena is the **public-facing side of the Matrix of Dreams**. Every PvP match is broadcast to a Hierarchy audience, and every match's emotional residue is harvested into the Dark Energy meter. This is a **morally ambiguous** system — the player's ladder climb costs the galaxy. Elara hates it, The Human is intrigued.
- **Candidate act slots:**
  1. **Act 2 Collector's Arena unlock** (canonical per §6.4)
  2. **Act 3 onwards** (faction rivalry ladder per faction)
- **Recommendation:** Option 1. PvP is the Collector's Arena's real heart.

#### Guild Wonders
- **File:** `apps/shared/guildWonders.ts`
- **Status:** SKELETON only (collectible guild monuments, no mechanics wired)
- **What it does:** Persistent guild-scope collectibles. Unclear mechanics.
- **Teacher NPC candidates:**
  - **Dr. Sael Finn** (The Bridge Project, Galactic Dance NPC #2) — studies whether baseline humans can cross into Potential-hood. Guild Wonders could be "Bridge Monuments" to crossings that succeeded.
  - **The Hierophant** (Thaloria, Galactic Dance NPC #3) — writes the names of the 347,000 remaining humans. Guild Wonders as **memorial plaques** in the Memorial Corridor, one per successful Reclamation Event.
- **Lore hook:** Every Guild Wonder is a reclaimed sector's **physical monument** — a Thalorian-style name-plaque installed in the Council of Survivors' archives. Ties Guild Wonders to the Reclamation Event loop.
- **Candidate act slots:**
  1. **Unlocked alongside first Reclamation Event** (§3.4) — whenever that first fires
  2. **Memorial Corridor expansion** in the Ark (per §1.5, opens at Bond 40) — guild plaques alongside personal ones
- **Recommendation:** Option 2. Guild Wonders = guild's plaques in the Memorial Corridor, The Hierophant curates them.

#### Friendly Challenges (async PvP)
- **File:** `apps/shared/friendlyChallenges.ts`
- **Status:** SKELETON
- **What it does:** Asynchronous friend-vs-friend TCG duels.
- **Teacher NPC candidate:** **Zephyr-9** (Quarchon crew, Prelude recruit) — Quarchon compute turn-sequences, so Zephyr-9 as "the async engine" makes lore sense. She frames it as "letting your deck dream against a friend's deck while you sleep."
- **Lore hook:** The Matrix of Dreams is literally where async play happens — your deck goes in, the friend's deck goes in, the match resolves in dream-time, you wake up knowing the outcome. This connects Friendly Challenges to the Matrix of Dreams lore from the hellbox/Celebration beat.
- **Candidate act slots:**
  1. **Act 1 end** (once the TCG is unlocked and the player has their first card)
  2. **Act 2** (alongside Collector's Arena)
- **Recommendation:** Option 1. Friendly Challenges are the first social extension of the card game, introduced by Zephyr-9 the moment Act 1 completes.

#### Rank Decay
- **File:** `apps/shared/rankDecay.ts`
- **Status:** SKELETON (PvP rank penalty for inactivity)
- **What it does:** Ladder rank decays if the player doesn't play ranked matches for N days.
- **Teacher NPC:** **The Left Game Master** — cold, tactical; he's the one who "takes points back" if you stop showing up.
- **Lore hook:** The Left GM frames it as "the Matrix of Dreams forgets you if you stop dreaming in its language." Rank decay is diegetically *the Matrix erasing your residue*.
- **Candidate act slots:**
  1. **Act 2 Collector's Arena unlock** (tied to PvP)
- **Recommendation:** This is a tuning layer, not a narrative system. Fold into PvP Battle Engine above. No separate slot needed.

---

### Group 3 — Dungeon / Side-Mode / Side-Quest Systems

#### Substrate Dungeon (10-floor solo roguelike)
- **File:** `apps/shared/substrateDungeon.ts`
- **Status:** SKELETON (10 floors, 8 challenge types)
- **What it does:** Deep roguelike dungeon with random minigame challenges on each floor. Canon: **17,033 years = the memory prison of The Human**.
- **Teacher NPC candidate:** **The Human himself** — this is the one system where he opens the tutorial. His framing: *"I spent seventeen thousand and thirty-three years in this place. I am going to walk you down the hall I walked every day. Not to punish you. To show you what I remember. Try not to remember it with me."* This is the single most emotionally heavy tutorial in the game.
- **Lore hook:** Each of the 10 floors = 1,703 years of The Human's imprisonment. Each floor's minigame is a different decade of his captivity — chess floor (the year he learned chess from a Warden), memory-match floor (the year he lost his wife's face), card floor (the year he first saw a Dischordia fragment), etc.
- **Candidate act slots:**
  1. **Post-Act 5** (endgame prestige) — only after you know what The Human is
  2. **Unlocked at Human Bond 80** (§1.5 "Two Witnesses Meet" tier)
  3. **Both** — Bond 80 unlocks the door, but only after Act 5 are you emotionally ready to enter
- **Recommendation:** Option 3. The Substrate Dungeon is the emotional reward of the whole relationship with The Human. It should not be entered before the player has earned it.

#### Infiltration Runner (21 stages, 6 factions, 9 minigame types)
- **File:** `apps/client/src/game/InfiltrationRunner.tsx`, `apps/client/src/game/infiltrationContent.ts`
- **Status:** FULLY_AUTHORED (21 stages across 6 factions, 9 minigame types, moral-choice branches)
- **What it does:** Stealth/social-deduction minigame system for infiltrating factions. Each faction has its own minigame flavor.
- **Teacher NPC candidate:** **The Eyes** (via archival recording) — this IS the Eyes' System per Witnessing §7.3. She is the canonical Infiltration teacher. She never appears in person; her recordings play as the player starts each faction's Infiltration chain, and she narrates what she would have done.
- **Lore hook:** Already canonical — Infiltration is the **Eyes Path** through Act 3, the way the Eyes solved problems and the way she died. Every Infiltration stage is literally retracing her steps.
- **Candidate act slots:**
  1. **Act 3 primary game mode** (canonical)
- **Recommendation:** Already placed. Not really an orphan — just confirming its canonical slot.

#### Signal Decryption
- **File:** `apps/client/src/game/SignalDecryption.tsx`
- **Status:** FULLY_AUTHORED (pattern-match hacking puzzle)
- **What it does:** Pattern-match minigame for decrypting enemy transmissions.
- **Teacher NPC candidates:**
  - **The Human** — detective grammar, fits his archive-work flavor. First tutorial: *"I used to do this for a living. Watch."*
  - **Zephyr-9** — Quarchon can compute decryption, but she frames it as *"I can do this instantly, but you should learn to do it slowly, because the slow way tells you something the fast way cannot."*
- **Lore hook:** Every decrypted signal is a piece of someone else's biography — another Potential's Ark, a dead Insurgent's last message, a Kael recording. The system is **narrative delivery via minigame**.
- **Candidate act slots:**
  1. **Prelude Comms Array** (Beat 3 Human-reveal room — the Human's first gift to the player)
  2. **Act 3 Infiltration variant** (already wired into infiltration content)
  3. **Act 5 Cades M2 "Digital Onslaught"** (canonical Iron Lion mission)
- **Recommendation:** All three. Prelude introduces it with The Human. Act 3 deepens it. Act 5 weaponizes it.

#### Hacking Puzzle / Pipe Maze
- **File:** `apps/client/src/game/HackingPuzzle.tsx`
- **Status:** FULLY_AUTHORED (sliding-pipe puzzle)
- **What it does:** Sliding-pipe routing puzzle for system breaches.
- **Teacher NPC candidates:**
  - **Patch** (DeMagi engineer, Prelude crew) — Engineers route pipes; this is literally his job.
  - **The Engineer himself** (via recorded bench hints in Act 2 onwards)
- **Lore hook:** In-lore, this is **reactor-flow routing** — the same discipline the Engineer used to build the Deck. Patch frames it as *"if you can route a coolant line, you can route a card spell."*
- **Candidate act slots:**
  1. **Prelude Engineering room** (Patch tutors the player on reactor repair; this is the puzzle)
  2. **Act 2 Crafting Bench** (a fusion puzzle for high-tier cards)
- **Recommendation:** Both. Prelude introduces the mechanic; Act 2 makes it load-bearing for crafting.

#### Bounty Board
- **File:** `apps/client/src/game/BountyBoardPage.tsx`
- **Status:** PARTIAL (UI + contract schema)
- **What it does:** Side-mission contract board.
- **Teacher NPC candidate:** **Adjudicator Locke** (New Babylon, canon) — he issues Authority bounties, framed as "sanctioned task-reward contracts under the Red Crystal Accord."
- **Lore hook:** Bounty Board is the **legitimate work** of a galaxy in ruin. Every bounty is a job someone couldn't finish. Completing bounties pays in resources and **Loredex entries** (each bounty target has a backstory).
- **Candidate act slots:**
  1. **Act 3 Trade Empire side layer** (opens alongside Trade Empire)
  2. **Acts 2–5 persistent background economy** (opens end of Act 2, persists through endgame)
- **Recommendation:** Option 2. Locke opens the Bounty Board at the end of Act 2 as "your contract with New Babylon." Persistent through endgame.

#### Kael Asynchronous Questline (Appendix B)
- **File:** `apps/shared/appendixBKaelQuestline.ts`
- **Status:** AUTHORED data shell (6 fragments, reverse chronology)
- **What it does:** Async background quest — 6 fragments of Kael's backstory, each unlocked by completing a Tower Defense / Terminus Swarm wave.
- **Teacher NPC:** **Archival Kael recordings** (non-present) + **Zephyr-9** (who interprets them for the player on the Bridge).
- **Lore hook:** Per §B.2, the fragments are delivered in **reverse chronology** — the player first hears Kael as The Source / Patient Zero, then works backward to Kael the Recruiter, Kael the Mechronis student, Kael the Atarion boy. The reveal is that **Kael was good first**, and the player's sympathy ramps up exactly as the player's power does.
- **Candidate act slots:**
  1. **Prelude Bridge → Act 5** (continuous background quest, 12 waves tied to Tower Defense chapters)
- **Recommendation:** This IS the Tower Defense / Terminus Swarm content, per the user's directive. Kael's 12-chapter story is the Tower Defense's 12 waves.

#### The Palimpsest Episodes (Appendix C Game Show Arc)
- **File:** `apps/client/src/features/.../PalimpsestEpisodesPage.tsx`, Witnessing Appendix C (§C.0–C.10)
- **Status:** PARTIAL (episode schema + appendix lore)
- **What it does:** In-universe game show arc ("THE PALIMPSEST"), 4 contestants, 13 episodes, Inventor's Progressive Hack subplot, Darren's Assistant Dream Engineer subplot, Episode 13 reveal that **the Host is the Meme**.
- **Teacher NPC:** **The Meme** (pretending to be the White Oracle) — the Meme is the Palimpsest's host across all 13 episodes. He teaches the player how the show works as **4th-wall commentary**.
- **Lore hook:** Per §C.0, the Palimpsest is a live broadcast from a galaxy in the final stage of denial. It's the Hierarchy's **propaganda instrument**, and its Truth-vs-Corruption meter (§C.1) mirrors the Light/Dark meter. Every episode watched writes to the global meter.
- **Candidate act slots:**
  1. **Acts 3–4 interleave** (per Appendix C) — 13 episodes paced across Acts 3–4
  2. **Loredex cross-cutting** (watched asynchronously any time from Act 2 onwards)
- **Recommendation:** Option 1. 13 episodes, one per narrative beat, with Episode 13 firing during the Act 4 Prisoner cell 2 "The Meme is wearing my face" boss fight — the reveal that the Palimpsest's host and the Prisoner's boss are the same entity.

---

### Group 4 — Flavor / Collection / Codex Systems

#### Oracle Deck / Tarot
- **Files:** `apps/shared/tcg-core/tarot/oracleDeck.ts`, `oracleDeck_batch2.ts`, `oracleDeck_batch3.ts`, `spreads.ts`, `readings.ts`
- **Status:** FULLY_AUTHORED (multiple batches of oracle cards + spreads + readings)
- **What it does:** Divination-style tarot system parallel to the main TCG. Spreads and readings give the player narrative hints, lore unlocks, and **optional future-sight** on card battles.
- **Teacher NPC candidate:** **The Oracle** (Insurgency prophet, canon — survived the Panopticon) — canonical owner of the Oracle Deck. His framing: *"The Dischordia Deck is the instrument of the moment. The Oracle Deck is the instrument of the unshaped. You use one to play; you use the other to listen."*
- **Alt teacher:** **An Oracle-class player-character's own hands** — if the player picked Oracle as their class, the deck is theirs by birthright and no NPC needs to teach it. (This is the class-specific tutorial model — Oracle players get the Oracle Deck as their starting perk.)
- **Lore hook:** Every tarot spread the player draws is **canon in their playthrough**. A spread that reveals a betrayal card in Act 1 literally foreshadows the Act 1 Cycle C3 forced loss. The Oracle Deck is how the game writes its own foreshadowing into the player's save file.
- **Candidate act slots:**
  1. **Prelude for Oracle class** (starter perk)
  2. **Act 2 for all other classes** (unlocked when the Oracle prophet makes contact from the Insurgency)
  3. **Always-available flavor layer** (once unlocked, the player can draw a reading any time)
- **Recommendation:** Options 1 + 2 + 3. Oracle class starts with it; other classes unlock it in Act 2; always available afterward.

#### Bestiary / Specimen Collection / Ark Specimens
- **Files:** `apps/client/src/game/BestiaryPage.tsx`, `apps/shared/arkSpecimens.ts`, `apps/shared/livingArk.ts`, `apps/client/src/game/SpecimenCollectionPage.tsx`
- **Status:** PARTIAL (schema + some authored specimens; two overlapping pages)
- **What it does:** Collection system for creatures encountered. Overlap: "Bestiary" and "Specimen Collection" are likely the same system with two entry points.
- **Teacher NPC candidate:** **Little One** (Ne-Yon child, Prelude crew) — she carries the pet egg; she is canonically the one who can **listen to creatures**. Her Bestiary framing is non-verbal — she brings the player to a creature, she waits, she nods. The Bestiary writes itself as the player observes.
- **Lore hook:** Every creature in the Bestiary is a **surviving node of the Collector's Garden** — the same Collector whose 3,000-year experiment made the Potentials. The creatures are the player's **siblings**, genetically speaking. Observing one is a kind of genealogy.
- **Candidate act slots:**
  1. **Prelude Pet Garden unlock** (opens when Little One hatches the first pet)
  2. **Acts 2–5 as collection flavor** (creatures found across all sectors and game modes)
- **Recommendation:** Both. Also **merge** `BestiaryPage.tsx` and `SpecimenCollectionPage.tsx` — they should be one UI.

#### Cryogenic Dreams
- **File:** `apps/shared/cryoDreams.ts`
- **Status:** PARTIAL (dream-state narrative fragments)
- **What it does:** Surreal short narrative fragments delivered during cryo/sleep sequences.
- **Teacher NPC candidate:** **Dr. Lyra Vox** (the ship itself, speaking through the substrate) — canonically the "third narrator" unlocked at Two Witnesses Meet §1.5 refuse-both path. Lyra Vox is the Ark; Cryo Dreams are her dreams leaking into the player.
- **Lore hook:** The Ark was built by/for Dr. Lyra Vox. When the player sleeps, the ship's own consciousness leaks in. Cryo Dreams are **Lyra Vox remembering what happened on her decks before the player woke up.** The Warlord, the Zyr'Koth embedding, Kael's theft — all of it is in her dreams.
- **Candidate act slots:**
  1. **Prelude** (between room cleanings, as optional ambient sleep events)
  2. **Acts 1–5 persistent** (any time the player rests, a dream can fire)
  3. **Two Witnesses Meet refuse-both path unlocks deeper layer** (Lyra Vox becomes a proper narrator)
- **Recommendation:** Option 2. Dreams are always available. The refuse-both path upgrades them from ambient flavor to a full narrator track.

#### Loredex (Codex)
- **File:** `apps/shared/loredexSchema.ts`, `apps/shared/transmissionLoredexUnlocks.ts`
- **Status:** FULLY_AUTHORED (schema + unlocks tied to transmissions)
- **What it does:** Collectible encyclopedia of characters, locations, concepts. Unlocked by transmissions + narrative flags.
- **Teacher NPC candidate:** **The Antiquarian** (Dr. Daniel Cross, Programmer half of the Two Witnesses narrators) — he literally runs the Loredex. Every entry is written in his voice; every "locked" entry has his one-line hint: *"A story I have not finished yet. Come back when you do."*
- **Lore hook:** The Loredex IS the Antiquarian's library. The 41 CoNexus Tomes (canon, per §Master Tomes) are the Loredex's top-level books. Every entry the player unlocks adds a page to one of the 41 Tomes.
- **Candidate act slots:**
  1. **Cross-cutting all acts** (not an orphan — this is the load-bearing codex)
- **Recommendation:** Not really an orphan. Listed here because the previous plan treated it as one.

#### Transmissions / Late Night with the Meme
- **Files:** `apps/shared/transmissions.ts`, `apps/shared/voltariTransmissions.ts`
- **Status:** FULLY_AUTHORED (28+ episodes across 6 epochs, trigger system)
- **What it does:** In-universe broadcast system. The Meme (pretending to be the White Oracle) hosts "Late Night with the Meme" and delivers narrative exposition + 4th-wall commentary.
- **Teacher NPC candidate:** **The Meme** (as false White Oracle) — this is canonically his show.
- **Lore hook:** Every transmission is **propaganda** but also **accidentally true**, because the Meme is a terrible liar who reveals more than he intends. The player has to triangulate truth from the Meme's slips.
- **Candidate act slots:**
  1. **Cross-cutting all acts** (not an orphan — 28 episodes already paced across 6 epochs)
- **Recommendation:** Already placed. Listed for completeness.

#### Star Chart
- **File:** `apps/client/src/game/StarChartPage.tsx`
- **Status:** SKELETON
- **What it does:** Celestial navigation / faction diplomacy map. Unclear how it differs from the Trade Empire galaxy map.
- **Teacher NPC candidate:** **Mirren Hale** (Council of Survivors, Galactic Dance NPC #1) — she reads her grandmother's crisis-management journal; the Star Chart is framed as her grandmother's navigation chart from pre-Fall.
- **Lore hook:** The Star Chart is **the map the Council of Survivors uses to track reclamation efforts**, distinct from Trade Empire's commercial map. Same geography, different overlay — Star Chart shows **who is remembered**; Trade Empire shows **who is trading**.
- **Candidate act slots:**
  1. **Fold into Trade Empire** as a "Memorial Overlay" toggle
  2. **Act 3 Council ending unlock** (the Council Chamber ending of Act 3 opens the Star Chart as their briefing tool)
- **Recommendation:** Option 2. Don't build a second map; make the Star Chart a unique reward for the Council ending.

#### Witnessing Hub / Witnessing Runtime
- **Files:** `apps/shared/witnessingHub.ts`, `witnessingYearOne.ts`, `witnessingRuntime.ts`, `witnessingIntegrations.ts`, `witnessingValidator.ts`, `apps/client/src/game/WitnessingHubPage.tsx`
- **Status:** FULLY_AUTHORED (dashboard + year one + runtime flagging + validator)
- **What it does:** Dashboard surface for the Witnessing narrative flags. Kael fragments, Year One calendar, milestone chronicle.
- **Teacher NPC candidate:** **The Antiquarian** — same reasoning as Loredex. The Witnessing Hub IS his journal.
- **Lore hook:** The Witnessing Hub is where the player reads their own story **as written by the Antiquarian**. Every narrative choice, every flag, is a line in his chronicle. He annotates.
- **Candidate act slots:**
  1. **Cross-cutting meta-infrastructure** (not an orphan)
- **Recommendation:** Not an orphan. Listed for completeness.

---

### Group 5 — Housing, Social, Meta, and Economy Systems

#### Gamesmaster's Arena (high-stakes TCG variant)
- **File:** `apps/client/src/game/GamemastersArena.tsx`
- **Status:** SKELETON
- **What it does:** A separate TCG arena, distinct from Collector's Arena. High-stakes format, unclear rules.
- **Teacher NPC candidate:** **The Two Game Masters** (Left and Right per Witnessing §6.4) — this is their personal room within the larger Collector's Arena. Playing here means facing one of them.
- **Lore hook:** The Gamesmaster's Arena is **where the Game Masters live** — the public Collector's Arena is the show, this is the back room. The first time the player enters, one of them (randomly) is waiting, and the player is told which half-lens they're facing by the color of the trench-coat lining.
- **Candidate act slots:**
  1. **Act 2 end** (introduced as the §6.4 Two Game Masters boss room)
  2. **Act 3 climax vs. Left Game Master** (one of the Act 3 boss gates)
  3. **Act 4 climax vs. Right Game Master** (paired with Act 4 Prisoner cells)
- **Recommendation:** All three. This is where you fight both Game Masters as culminating bosses, one per act (3 and 4). Act 2 introduces the room; Act 3 sends you back for the Left GM; Act 4 sends you back for the Right GM.

#### House Competition + Apprentices + Rivalries + Betrayal + Permadeath
- **Files:** `apps/shared/houseCompetition.ts`, `apprentices.ts`, `apprenticeRivalries.ts`, `apprenticeBetrayal.ts`, `apprenticePermadeath.ts`
- **Status:** PARTIAL (social layer scaffolding)
- **What it does:** A Harry-Potter-school-house social layer: houses, apprentices assigned to rivalries, betrayal triggers, and **permanent apprentice death**. Very Mechronis.
- **Teacher NPC candidate:** **Gary the Game Master** (Celebration orientation tutor). He runs Celebration; houses and apprentices are the Celebration social structure.
- **Lore hook:** Celebration assigns every Potential to a **House** based on their class. Houses compete in the 28-day Mascoteer Trial. Rivalries form naturally between assigned apprentices; betrayals permanently change Bond scores with the apprentices; permadeath is permanent across the whole playthrough. The player's apprentice can die — and if they die, the player gets a unique card in their Dischordia deck (like Memory Cards from pets).
- **Candidate act slots:**
  1. **Prelude Celebration orientation** (Gary assigns you a House)
  2. **Act 1 Cycle A 28-day trial** (the houses compete for graduation standing)
- **Recommendation:** Both. Gary assigns the house in the Prelude; Act 1 Cycle A is the house competition playing out across the 28 days.

#### Mastery Tree / Tech Tree
- **Files:** `apps/shared/masteryTree.ts`, `apps/shared/techTree.ts`
- **Status:** PARTIAL (branching progression scaffolding)
- **What it does:** Character progression branching trees. Appear to overlap with `classMastery.ts` but exist as separate files.
- **Teacher NPC candidate:** **Your class rank-up NPC** — each class has a canonical Mastery teacher:
  - **Engineer** → Patch (DeMagi engineer, Prelude crew)
  - **Oracle** → The Oracle (Insurgency prophet)
  - **Assassin** → Agent Zero (real one, not the Engineer imposter)
  - **Soldier** → Iron Lion (archival)
  - **Spy** → The Eyes (archival)
- **Lore hook:** Each class mastery tree is literally **a dead teacher reaching through time** to train the next generation. The ranking ceremony is always posthumous.
- **Candidate act slots:**
  1. **Cross-cutting Acts 1–5** (ranks unlocked per act)
  2. **Merge with `classMastery.ts`** — unify into one file, not three
- **Recommendation:** Option 2. Delete duplication; one unified mastery tree per class, one teacher each, one rank per act.

#### Donation System / Cosmetic Shop
- **Files:** `apps/shared/donationSystem.ts`, `apps/shared/cosmeticShop.ts`
- **Status:** PARTIAL (economy sinks)
- **What it does:** Economy sink + monetization layer. No narrative hook.
- **Teacher NPC candidate:** **The Degen** — he runs the shop as "favors from the house." Everything you donate, he remembers.
- **Lore hook:** Every cosmetic is a **favor the Degen owes you** or **you owe him**. The Pact game (§10.2) is the economy's formal expression; the donation system is its informal back channel.
- **Candidate act slots:**
  1. **Act 4.5 Degen's Casino** (opens when the Casino opens; always available after)
- **Recommendation:** Route all donation / cosmetic economy through the Degen. No separate shop UI — use the Casino.

#### Seasonal Events / Monthly Events / Christmas in July
- **Files:** `apps/shared/seasonalEvents.ts`, `apps/shared/monthlyEvents.ts`, `apps/shared/christmasInJuly.ts`
- **Status:** PARTIAL (event schemas, some authored content)
- **What it does:** Live-ops seasonal event framework. Christmas in July is fully authored (wheel prizes, milestones, gift-sending).
- **Teacher NPC candidate:** **The Degen** for Christmas in July (casino tie-in is canonical). For seasonal events in general, **Gary the Game Master** (Celebration runs on a 4-season calendar).
- **Lore hook:** Seasonal events are the Matrix of Dreams **remembering holidays that no longer exist**. Christmas in July is canonically a dead festival from pre-Fall Atarion that the Matrix replays every July as a haunt. The Degen runs it because he is entropy — and entropy loves anniversaries.
- **Candidate act slots:**
  1. **Cross-cutting live-ops** (Year One Calendar organizes these)
  2. **Degen's Casino overlay** (Christmas in July specifically)
- **Recommendation:** Both. Year One Calendar drives the schedule; the Degen runs any event that lands during his Casino's open window.

#### Prestige Quests / Prestige System / Graduate Legion
- **Files:** `apps/shared/prestigeQuests.ts`, `prestigeSystem.ts`, `graduateLegion.ts`
- **Status:** PARTIAL (post-Grandmaster content)
- **What it does:** Post-Grandmaster rank content. No narrative framing.
- **Teacher NPC candidate:** **The Antiquarian** — Prestige is the moment the player becomes a **contributing writer** to his library. Graduate Legion is canonical — the "students who graduated" from some unnamed program — this could be reframed as Mechronis graduates who survived the Fall and are now Prestige-rank mentors.
- **Lore hook:** Prestige Cycle rolls over between playthroughs. Every Prestige unlock writes a new CoNexus Tome page. The player becomes a **canon source** — other players' playthroughs may reference the Prestiged player's choices.
- **Candidate act slots:**
  1. **Post-Act 5 endgame rollover** (canonical per `actsFourFiveShells.ts` carryover shape)
- **Recommendation:** Option 1. Tie to Prestige Cycle on first Vortex Returns resolution.

#### Citizen Traits / Talents
- **Files:** `apps/shared/citizenTraits.ts`, `apps/shared/citizenTalents.ts`
- **Status:** PARTIAL (follower trait system)
- **What it does:** Trait system for NPCs and crew followers.
- **Teacher NPC candidate:** **Patch** (Prelude DeMagi engineer) — he knows the crew system best and can evaluate recruits.
- **Lore hook:** Every citizen trait is a **genetic inheritance** from the Garden. Traits map onto Potential species lineage even for baseline humans. The system is the Bridge Project's (Dr. Sael Finn, Galactic Dance NPC #2) research subject.
- **Candidate act slots:**
  1. **Trade Empire §8 improvement #5** (Trade Fleets as Companions — crew-commanded fleets)
  2. **Pet Breeding genetics** (§2.5) — use the same trait engine
- **Recommendation:** Both. Unify pet genetics and crew genetics into one trait engine with two presentations (per Witnessing Appendix A.6).

#### Cross-Game Synergy
- **File:** `apps/shared/crossGameSynergy.ts`
- **Status:** SKELETON
- **What it does:** Integration framework for the external games (Cades FPS, Dead Man's Circuit) rewarding progress in the main app.
- **Teacher NPC candidate:** **The Antiquarian** — cross-game rewards are his curation. He tracks what the player did across engines.
- **Lore hook:** Every mechanical achievement in an external game is a **Tome page** in the main app. The Antiquarian is reading the player's whole life across genres.
- **Candidate act slots:**
  1. **Acts 4.5 + 5** (where Dead Man's Circuit and Cades live)
- **Recommendation:** Option 1. Not a tutorial system; just wiring. No separate slot needed beyond where the external games already sit.

#### Epoch Zero Triggers
- **File:** `apps/shared/epochZeroTriggers.ts`
- **Status:** SKELETON
- **What it does:** Pre-campaign setup flags.
- **Teacher NPC candidate:** None — this is engine plumbing, not a player-facing system.
- **Lore hook:** Every Epoch Zero trigger is a flag that Elara checks during the Cryo Bay awakening. They set up the player's initial Bond, corruption, and class flags.
- **Candidate act slots:**
  1. **Prelude engine layer** (fires once on first login)
- **Recommendation:** Option 1. Not a narrative system. Plumbing for the Prelude.

#### Training Mode Overlay
- **File:** `apps/client/src/game/TrainingModeOverlay.tsx`
- **Status:** SKELETON
- **What it does:** Tutorial and practice environment.
- **Teacher NPC candidate:** **Whichever NPC taught the current system** — Training Mode should reuse the tutor that originally taught the mechanic.
- **Lore hook:** The Pet Garden (§2.5) is canonically the **training ring**. Training Mode IS the Pet Garden, repurposed to let the player drill any mechanic against simulated opponents.
- **Candidate act slots:**
  1. **Prelude Pet Garden** (opens with the first pet)
  2. **Always-available practice** (any time, any mechanic)
- **Recommendation:** Both. Merge Training Mode into the Pet Garden room; re-use the room's infrastructure.

#### NPC Inbox
- **File:** `apps/client/src/game/NPCInboxPage.tsx`
- **Status:** SKELETON
- **What it does:** NPC-to-player messaging system.
- **Teacher NPC candidate:** **Elara** — she's on the Bridge; she receives comms; the Inbox is literally her job.
- **Lore hook:** Every NPC message is a **piece of the living universe** reaching through. Crew members send status updates; faction NPCs send diplomatic offers; the Meme sends late-night broadcasts; the Degen sends casino invitations.
- **Candidate act slots:**
  1. **Prelude Bridge unlock** (opens alongside Crew Mission Board)
  2. **Acts 2–5 persistent** (messages from every system)
- **Recommendation:** Option 1. Elara unlocks the Inbox as part of the Bridge's first cleaning pass.

#### Collector Garden (player housing)
- **File:** `apps/client/src/game/CollectorGarden.tsx`
- **Status:** SKELETON
- **What it does:** Player housing / customization. Name overlaps uncomfortably with **The Collector's Garden** (Act 3 climax location) and **the Collector's Garden** origin lore (§Potentials).
- **Teacher NPC candidate:** **Little One** (Ne-Yon child, Prelude crew) — the Garden is where she plants things. She is the natural housing curator.
- **Lore hook:** The Collector Garden is the player's **personal corner of the Pet Garden**, expanded over time into a full customizable Trophy Room (§Appendix A.10). It grows as the player collects trophies from acts.
- **Candidate act slots:**
  1. **Prelude Pet Garden (shared room)** (introduces trophy alcove)
  2. **Act 3 Trophy Room expansion** (per §A.10)
  3. **Rename to avoid name collision** — "Player's Trophy Room" or "The Sanctum"
- **Recommendation:** All three. Also rename in code.

#### Economy Sinks / Endgame Sinks
- **Files:** `apps/shared/economySinks.ts`, `apps/shared/endgameSinks.ts`
- **Status:** SKELETON (balancing stubs)
- **Teacher NPC candidate:** None — pure tuning layer.
- **Recommendation:** Not a narrative system. Route through the Degen's Casino (§4.5) and Prestige Cycle (post-Act 5). No separate slot.

---

## Contradictions & Open Questions

These are the places where docs / code disagree with each other. The
user needs to pick a winner before any implementation work begins.

### 1. Two Chapter-Numbering Systems

`apps/shared/tcg-core/story/chapters.ts` defines **14 TCG story-mode
chapters** (ch1 Dead Signal → ch12 Architect's Design) as Collector's
Arena boss battles. The Witnessing proposal uses a **Prelude → Act 1–5**
structure that does NOT share IDs with the TCG chapters. The Act 4
data shell resolves this by mapping Act 4 Prisoner cells onto
FIGHTER_ROSTER IDs (jailer / human / warlord / white-oracle) **not**
onto TCG ch* IDs. Act 1's 12 biography battles are a separate set
again, defined in `act1Opponents.ts`. **There are effectively three
parallel "chapter 1–12" systems in the repo.** Recommend: keep the
Witnessing Act numbering as canon and retrofit the TCG story chapters
as "Collector's Arena side story" content that can be played any time
after Act 1.

### 2. Year One Calendar Uses Different Act Names

`docs/design/YEAR_ONE_EVENTS_CALENDAR_V2.md` lays out the game as a
12-month year in **4 acts** (Act I Awakening / Act II Escalation /
Act III Convergence / Act IV Reckoning). The Witnessing proposal uses
**Prelude + 5 Acts + 4.5**. These are not the same structure. The
Year One Calendar is community-event-pacing, the Witnessing proposal
is single-player story-pacing. Recommend: **both are canonical** —
Year One Calendar drives the community/live-ops layer on top of the
single-player act spine, and should be renamed to "Year One Live
Seasons" to avoid confusion.

### 3. Narrative Architecture Says 12th Archon, Lore Bible Says Last Archon

`docs/design/GAME_DESIGN.md:11` lists The Human as "12th Archon."
`docs/design/NARRATIVE_ARCHITECTURE.md:34` corrects to "**Last Archon**,
promoted 1,351 years before Fall." **NARRATIVE_ARCHITECTURE wins** per
its own Lore Corrections Needed In Code section.

### 4. Shadow Tongue Identity

`GAME_DESIGN.md` treats Shadow Tongue as a distinct entity.
`NARRATIVE_ARCHITECTURE.md` clarifies **Zyr'Koth** (Hierarchy SVP R&D)
is the core agent, with Shadow Tongue as the operational manifestation
born from the Thaloria helmet moment. **NARRATIVE_ARCHITECTURE wins.**

### 5. The 18-Track SiH Album vs. 17-Track Reality

`silenceInHeavenTracklist.ts` lists 18 tracks numbered sih-01..sih-18
grouped into 4 album acts. Previous agent summaries sometimes describe
17 tracks + epilogue. Count is **18 tracks total**; sih-18 "All Things
New" is itself the Epilogue. Not an actual contradiction — just name
confusion. Flag for documentation cleanup.

### 6. Silence in Heaven Acts vs. Game Acts

The album has 4 acts (I Warning / II Judgment / III Reckoning / IV
Epilogue). The game has 6 acts (Prelude + 5 + 4.5). **They are not
parallel.** The album acts map across game acts as an overlay — SiH
Act I Warning plays through Game Prelude + Act 1 Cycle A; SiH Act II
Judgment through Act 1 Cycles B+C + Act 2; SiH Act III Reckoning
through Acts 3–5; SiH Epilogue for the Endgame win outcome. This is
documented above in each act's **Music** subsection.

### 7. `mobileNarratorDialog.ts` Engineering H-Tier Line vs. Rev 4 Engineer Death

The authored Engineering-room H-tier line for The Human in
`apps/shared/mobileNarratorDialog.ts:187-189` reads:

> **The Human (Engineering, tier H):** *"I did. I do. He's still
> alive. You signed the memo that said he wasn't. Don't cry —
> we're going to get him back before this is over."*

**This line was written when the Engineer-survives-in-Agent-Zero
canon was still in effect.** Per the rev 4 canonical correction,
the Engineer is truly dead. The line appears to contradict the
new canon.

**Resolution (no rewrite needed):** Leave the line in place. Its
meaning changes but does not break. **The Human believes the
Engineer is still alive** — he investigated the "accident" and
closed the case without looking at the body, and he has carried
that belief for 17,000 years because the alternative is too
painful. In the Prelude Beat H Engineering scene, The Human says
this line and the player believes him. **The player has to spend
the entire game chasing a ghost** because their narrator is
wrong. In Act 5 Post-Credits, the Bridge of Kael card reveals
the truth: the Engineer is dead. The Human's line from Beat H
reads in retrospect as **his own grief talking** — he wanted it
to be true so badly that he convinced himself it was, and he
pulled the player into his belief.

This is actually a stronger story beat than a factual
revelation: the player learns that **even the voices they
trust most can be wrong**, and that the Witnessing is built
on grief as well as truth. No rewrite needed.

### 8. Engineer Survives Canon vs. Rev 4 Engineer Death Canon

The Witnessing Narrative Proposal §11.4 and several early plan
drafts state the Engineer survived in Agent Zero's body. **Per
rev 4, this is retconned.** The Engineer is dead. Every reference
to "the Engineer in Agent Zero's body" in the codebase (search
terms: *"mind swap"*, *"Engineer lives"*, *"walking around in
Agent Zero"*) should be re-read as either:

1. An in-world character's **false belief** (Captain Voss's
   hopeful pre-sacrifice recording, The Human's grief-driven
   denial, Elara's briefing notes), or
2. An **archival fact** about Kael's body (Kael was piloted by
   the Warlord's fragment in Act 1 Cycle C3 — that IS canon
   and unchanged; what changed is that it's Kael's body, not
   the Engineer's).

**The `potentialOriginReveal.ts` lines are unaffected** — they
do not reference the Engineer's fate.
**The `mobileNarratorDialog.ts` engineering H-tier line is
affected but salvageable** (see contradiction #7 above).
**The §11.4 "Bridge of Kael" post-credits beat is affected** and
is rewritten in this plan file to reflect the rev 4 canon.

---

## What This Plan Replaces

The prior 650-line version of this plan file has been superseded in two
stages. Some of its content was wrong (fabricated characters,
non-canonical structures); some of it was **right but mis-placed**, and
has been reinstated in its correct slot in this revision.

### Not Canon — Do Not Build

1. **Any NPC named "Belinda."** She was never in any canonical source.
   The only female narrator in the Prelude is **Elara Voss**. Every
   tutorial that was previously attributed to Belinda is now
   attributed to Elara (for the walls-voice beats) or to a specific
   crew member / Celebration tutor (for the system-specific tutorials).
2. **Any card-game tutorial delivered in the Cryo Bay.** The Dischordia
   TCG is not introduced in the Prelude — the **Engineer's card-game
   logs** are discovered (partial in Beat A, completed in Beat H), but
   the game itself opens at the Archives in Beat J. The playable TCG
   tutorial is Act 1 Cycle A battle A1 against Conni the Conductor.
3. **Celebration Trial as "4-season school year with 3 sessions per
   week and 24-hour cooldown."** Wrong structure. The Celebration
   Trial is a **28-day Mascoteer decision loop** running in parallel
   with Act 1 Cycle A. One decision per day, no weekly cooldown.
4. **Pet battles as gates for every Prelude room.** Wrong scale. There
   is exactly **one pet battle in the Prelude (Beat G, vs. a virus
   spore)**, and pet battles in Chapter 1+ are an **always-available
   minigame** in the Pet Garden, not a recurring gate. Pets that die
   with high Bond become Memory Cards in the Dischordia deck in Act 1.

### Canon — Correctly Placed in the Revised Beat Structure

These items were in the prior plan, were removed in the first rewrite
as "not canon," and have been **reinstated** in this revision per the
user's rev 2 directive. Each one now lives in a specific Beat letter:

| Item | New home |
|---|---|
| LucasArts-style Cryo Bay murder mystery | **Beat A** (Elara tutors) |
| Shadow Tongue first reveal via edited life-support codes | **Beat A** |
| Hierarchy of the Damned demonic artifact hook | **Beat A** |
| Class-gated shield puzzle with 5 class-specific solutions | **Beat A** — unlocks each class's rank-1 mastery perk |
| Engineer's Card Game Log (partial fragment) | **Beat A** — completed in Beat H |
| Power converter wiring minigame | **Beat B** (Patch recording + Elara) |
| Automatic cloning pod activation on power restoration | **Beat B** |
| Pet emerges from cloning pod (Little One's bond) | **Beat B** |
| Thought Virus outbreak caused by contaminated cloning | **Beat B** |
| Hellbox discovered wired into cloning device (root cause) | **Beat B** |
| Hellbox compels player — cinematic POV transport | **Beat C** (first time only) |
| Celebration orientation inside the Matrix of Dreams | **Beat D** |
| Gary the Game Master explains Matrix of Dreams + Celebration Trial + Governance Hub | **Beat D** |
| First Governance Hub vote | **Beat D** |
| Chess tutorial with Gary — super-saiyan skip path | **Beat D** |
| Moral choice: sacrifice pet (a core relationship) for perceived advantage | **Beat E** |
| Return to Cryo Bay after the choice | **Beat F** |
| **The Human's first contact** (after the choice lands) | **Beat F** — this is the canonical moment he first speaks |
| Dark-choice consequence: player gets stuck with a Thought Virus spore | **Beat F** if pet was sacrificed |
| Pet battle vs. virus spore to clear the quarantine corridor | **Beat G** |
| Resumed puzzle chain in Med Bay + next rooms | **Beat H** |
| Engineer's Card Game Logs (full collection) | **Beat H** |
| Bridge room with Tower Defense mode discovery | **Beat I** |
| Kael's 12-chapter story told via Tower Defense waves | **Beat I** (and Appendix B asynchronous questline through Acts 1–5) |
| Thought Virus meter with living-world consequences | **Beat I** onward (cross-cutting) |
| First-Wave Potentials' crashed Arks on Terminus lore | **Beat I** |
| Archives Two Voices One Deck cutscene | **Beat J** — Act 1 gate |

Every reference in prior documentation, plan files, or PRs that
depends on items 1–8 above should be updated or discarded.

---

## Verification — How To Sanity-Check This Layout

Because this is an analysis/layout document (not a code-change plan),
verification means confirming that the layout **matches the canonical
sources** and **exposes every game mode currently in the repo**.

1. **Cross-reference every act against the Witnessing proposal section
   numbers.** Each act section in this doc cites the corresponding
   `WITNESSING_NARRATIVE_PROPOSAL.md` section (§2, §4, §6, §7, §9, §10,
   §11). Reading both side-by-side should show no material omissions.
2. **Cross-reference every act against its data shell.**
   - Prelude → `apps/shared/awakeningProtocol.ts` + `preludeCrewMissions.ts`
   - Act 1 → `apps/shared/act1Opponents.ts`
   - Act 2 → `apps/shared/act2Interlude.ts`
   - Act 3 → `apps/shared/act3EyesBiography.ts` + `tradeEmpire.ts`
   - Act 4/4.5/5 → `apps/shared/actsFourFiveShells.ts`
3. **Verify every authored game mode has an act slot.** Run through
   the game-modes inventory (§Cross-Cutting and §Orphan sections); any
   mode that exists in code and is NOT listed in either a cross-cutting
   system, a primary act system, or an orphan row is missing.
4. **Verify every Silence in Heaven track has a canonical play
   moment.** Check each of the 18 tracks in `silenceInHeavenTracklist.ts`
   against the Music subsections of each act. Unused tracks either
   need an act slot or should be marked "ambient / optional."
5. **Verify Potential identity system is present.** Confirm
   `potentialOriginReveal.ts` fires at its designated beat (5 rooms
   cleaned + Archive access — i.e., near the end of the Prelude, before
   the Two Voices One Deck cutscene). The origin reveal is a
   **Prelude**-owned scene, not an Act 1 scene.

---

## System Placement Verification (Every Orphan Has a Home)

> Final audit pass. Every system in the repo — every orphan from the
> compact table, every item in the detailed catalog, every code file
> in `apps/shared/` and `apps/client/src/game/` — is listed below
> with its canonical placement in this layout. If a system is marked
> TUNING it is an explicit tuning layer with no narrative placement
> (this is valid — not all systems are narrative). Every other system
> has **at least one beat or act** that introduces it and **at least
> one later beat or act** that consumes or pays it off.

### Previously Orphaned Systems — Now Placed

| System | Home(s) | Teacher NPC |
|---|---|---|
| Alliance War | Prelude Beat I.4 (preview), Act 3 (Locke unlock), Endgame (defense grid) | Elara preview, Adjudicator Locke full |
| Cooperative Raids | Act 3 (Insurgency arc reward), Endgame (daily) | Field Commander Renn |
| Tower Defense / Terminus Swarm | Prelude Beat I.2 (unlock), Acts 1–5 (Kael questline), Endgame (second line) | Zephyr-9 + archival Kael |
| PvP Battle Engine | Act 2 (Collector's Arena), Endgame (morale broadcast) | The Left Game Master |
| Substrate Dungeon | Post-Act 5 (Bond 80 gate), Endgame (memory preservation) | The Human |
| Infiltration Runner | Prelude Beat A.3 (Spy class seed), Act 3 (primary mode) | The Eyes (archival) |
| Signal Decryption | Prelude Beat A.3 (Spy), Prelude Beat H (The Human), Act 3, Act 5 M2 | The Human |
| Hacking Puzzle / Pipe Maze | Prelude Beat A.3 (Engineer) + Beat B.1 (all classes), Act 2 (fusion puzzles) | Patch + Engineer recordings |
| Bounty Board | Act 3 (Locke unlock), persistent through Endgame | Adjudicator Locke |
| Kael Asynchronous Questline | Prelude Beat I.3 → Act 5 (reverse chronology, 12 waves) | Archival Kael |
| Palimpsest Episodes | Acts 3–4 (13 episodes), Act 4 Cell 2 reveal | The Meme (as White Oracle) |
| Oracle Deck / Tarot | Prelude Beat A.3 (Oracle class), Act 2 (all classes) | Player (Oracle) or The Oracle (Insurgency) |
| Bestiary / Specimen Collection | Prelude Beat G (first entry), Acts 2–5 (accumulation) | Little One |
| Cryogenic Dreams | Prelude ambient, Acts 1–5 persistent, Act 5 Forgive-Neither path upgrade | Dr. Lyra Vox |
| Loredex | Cross-cutting all acts | The Antiquarian |
| Transmissions / Late Night with the Meme | Cross-cutting all acts | The Meme |
| Star Chart | Act 3 Council ending reward | Mirren Hale |
| Witnessing Hub / Runtime | Cross-cutting meta-infrastructure | The Antiquarian |
| Gamesmaster's Arena | Act 2 (introduction), Act 3 (Left GM), Act 4 (Right GM) | Two Game Masters |
| House Competition + Apprentices + Permadeath | Prelude Beat D (assignment), Act 1 Cycle A (28-day trial) | Gary the Game Master |
| Mastery Tree / Tech Tree | Cross-cutting, unified with classMastery.ts | Class-specific teachers (Patch / Oracle / Agent Zero / Iron Lion / The Eyes) |
| Donation / Cosmetic Shop | Act 4.5 Casino routing | The Degen |
| Seasonal Events / Monthly Events | Year One Calendar + Casino overlay | Gary / The Degen |
| Christmas in July | Act 4.5 Casino (July overlay) | The Degen |
| Prestige Quests / Prestige System / Graduate Legion | Post-Act 5 endgame rollover | The Antiquarian |
| Citizen Traits / Talents | Pet Dynasty + Trade Fleet commanders (Act 1 + Act 3 §8 #5) | Little One + Patch |
| Cross-Game Synergy | Act 4.5 (Dead Man's Circuit) + Act 5 (Cades) integration | The Antiquarian |
| Epoch Zero Triggers | Prelude engine plumbing | N/A (flag system) |
| Training Mode Overlay | Prelude Beat G Pet Garden unlock | Little One |
| NPC Inbox | Prelude Beat H.3 (Mess Hall), Acts 2–5 persistent | Elara |
| Collector Garden (→ "The Sanctum") | Prelude Beat G Pet Garden alcove, Act 3 Trophy Room expansion | Little One |
| Friendly Challenges | Prelude Beat J (Orb routing), Acts 1–5 | Zephyr-9 |
| Guild Wonders | Act 3 first Reclamation Event, Endgame loop | The Hierophant |
| Governance Hub / Voting | Prelude Beat D.2 (first vote), Acts 2–5, Endgame community vote | Gary the Game Master |
| Song Slideshow Engine | Prelude Beat J (first fire), Acts 1–5 (all cutscenes) | Cutscene system |
| Necromancer Return Questline | Act 4 sidequest | Thazu (via mascoteer form) / Necromancer faction NPCs |
| Clones Questline | Act 4 parallel quest, Act 5 M5 reinforcements | General Binath-VII |
| Dead Man's Circuit | Act 4.5 mandatory interlude | The Antiquarian |
| Degen's Casino | Act 4.5 always-open | The Degen |
| Cades FPS | Act 5 primary mode | Iron Lion (archival) + Agent Zero (real) |
| Substrate Dungeon | Post-Act 5 endgame | The Human |

### TUNING Layers (Explicitly NOT Narrative Systems)

| System | Reason |
|---|---|
| Rank Decay (`rankDecay.ts`) | Pure PvP balance; no narrative layer. Lives under PvP Battle Engine. |
| Economy Sinks (`economySinks.ts`) | Currency balance; routed through Degen's Casino. |
| Endgame Sinks (`endgameSinks.ts`) | Prestige balance; routed through Prestige Cycle. |

### Final Integrity Check

- **~45 previously-orphaned systems**: all placed, each with at
  least one teacher NPC and at least one beat/act home.
- **3 tuning layers**: explicitly marked as non-narrative; routed
  through adjacent systems.
- **9 cross-cutting systems** (Yin/Yang Narrators, Light/Dark Meter,
  SiH Slideshow Engine, Dialog Wheel + Story Powers, Thought Virus,
  Loredex + Transmissions, Galactic Dance, Celebration Trial, Living
  Ark + Living Universe): all wire into every act.
- **10 Prelude beats (A–J)**: each has at least one primary game
  mode introduced + at least one orphan system placed.
- **8 Acts (Prelude, 1, 2, 3, 4, 4.5, 5, Endgame)**: each has an
  orphan weaving block showing which systems light up inside that
  act and what consumes them later.
- **Elara + The Human narrative spine**: tracked per-act with
  specific beat milestones, Bond score thresholds, and a canonical
  Two Witnesses Meet payoff in Act 5.
- **Every system writes to the Living Ark and Living Universe.**
  No system runs in isolation.

**Result: the whole codebase has a logical home in one coherent
narrative arc.** No orphans remain.

---

## Next Steps (if the user wants to move from layout to implementation)

This layout is a map, not a build order. If the user wants to start
building, a sensible implementation order is:

1. **Lock the canonical act numbering in code.** Add an
   `apps/shared/gameActs.ts` enum: `Prelude | Act1 | Act2 | Act3 |
   Act4 | Act4_5 | Act5 | Endgame`, and a `currentAct()` helper that
   reads existing flags (`prelude_complete`, `act1_unlocked`, etc.).
2. **Wire the Prelude §2 beats to `awakeningProtocol.ts` phases.** The
   14 phases already exist; this layout specifies which beats (1, 2,
   3, 4 of the Human reveal) map to which phases.
3. **Build the Song Slideshow engine (`songSlideshow.ts`).** This is
   the single highest-leverage production system — every act depends
   on it for its finale cutscene.
4. **Build the `dischordiaCycle.ts` meter by forking `necromancerCycle.ts`.**
   Every mechanical action in the game writes to it; it needs to
   exist before any act is playable.
5. **Wire the Mobile Narrator system to Elara + The Human existing
   `narrativeSystems.ts` architecture.** Replace room-tied assignments
   with a Narrator Slot per room.
6. **Build Act 1 Cycle A (3 battles) against the existing
   `celebrationTrial.ts` daily decision loop.** This is the smallest
   vertical slice that validates the "systems feed into card battles"
   thesis.

Each of these is a concrete, implementable unit that can be planned
and sized individually after this layout is approved.

---

## Summary (TL;DR)

- **The game is Revelation played as sci-fi.** You are a Potential on
  Ark 1047 with Elara + The Human in your walls and a broken Dischordia
  deck in the Archives.
- **Prelude teaches you who you are.** Clean 10 rooms, rescue 3 crew,
  hatch a pet, find the burnt card, trigger the Two Voices One Deck
  cutscene.
- **Act 1 is the card game, which is the Engineer's biography.** 12
  battles across Celebration kindergarten, Mechronis academy, and the
  Battle of Nexon. Ends with the *Last Words* slideshow — the first
  cinematic the player ever sees.
- **Act 2 opens Crafting, Chess, and the Collector's Arena.** Reveals
  the Two Game Masters and the Thaloria birth of the Shadow Tongue.
- **Act 3 is the Eyes' biography told through Trade Empire.** Six
  factions, three resolution paths each (Conquest / Diplomacy /
  Infiltration), non-linear. Five of six to advance. Boss fight against
  The Collector in the Garden where the Eyes died.
- **Act 4 is the fighting game as Kael's memory extraction.** Four
  authored cells today (Jailer / Meme / Warlord / White Oracle). Dual
  closing: become The Source, or refuse.
- **Act 4.5 is racing + the Casino.** The player authors their own
  identity chain and becomes a Loredex entry. Casino is always open —
  the only room where the plot pauses.
- **Act 5 is Iron Lion's last stand, played from inside his helmet.**
  Seven Cades FPS missions ending in mandatory death. Post-credits:
  the player returns to the Bridge and finds **Vex Solène** (the
  canonical name of Agent Zero) waiting at the Captain's Chair. The
  "Bridge of Kael" card reveals that **the Engineer is truly dead**
  — his consciousness was spent in a transference protocol that
  saved Vex from the Warlord's nano-swarm possession. The Bridge in
  "The Bridge of Kael" is the bridge the Engineer built between Kael
  and Vex Solène by giving his life. Vex joins the crew as the
  only other awake Potential in the universe.
- **Endgame is the Vortex Returns** — every game mode called to one
  community-wide sector defense. Resolves as "The Light Holds" or
  "The Bulb Breaks," with Reclamation as the recurring loop.
- **Elara + The Human are the emotional spine of the whole game.** Their
  Bond scores, their arguments, their shared-ladder backstory reveals, and
  the Two Witnesses Meet cutscene at Bond 80 thread through every act. The
  tutorial for every game mode is delivered by a specific character, but
  the **relationship** the player is really playing is Elara and The
  Human learning who each other is.

---

# Part V — Execution Plan (Rev 5)

This part of the document turns the narrative design spec into a
**buildable queue of work**. It contains four sections, in the order
a team should build them:

1. **(D) The Vertical Slice** — the shortest playable proof-of-concept
   that validates the whole Witnessing architecture end-to-end.
2. **(C) Prelude Implementation Spec** — file paths, flag schema,
   component specs, and hook points to ship the 10 Prelude beats.
3. **(B) Missing Prelude Dialog** — the ~20 short lines identified as
   gaps during the dialog source map audit, written in voice.
4. **(A) Act 1 Beat Breakdown** — Act 1 in the same beat-by-beat
   format as the Prelude, so the team has 20 fully designed beats
   instead of 10.

Everything in Part V is **additive to Parts I–IV**. No section of
Parts I–IV is retracted by Part V — only made concrete.

---

## (D) The Vertical Slice — "Two Voices, One Choice"

### Why This Slice

The Witnessing thesis rests on four load-bearing claims:

1. **Dual narrators work.** The Elara voice and The Human voice can
   live in the same UI without breaking immersion, and the player can
   tell them apart within 30 seconds.
2. **Choices persist across systems.** A decision the player makes in
   one room changes what happens in another room.
3. **The Dischordia card game is the narrative interface.** Drawing a
   card is a story beat, not just a gameplay beat.
4. **The hellbox is the Light/Dark pivot.** It is the first place the
   player's polarity tilts and they can feel it.

A single 30–45 minute slice can test **all four** load-bearing claims.
If the slice proves them, the rest of the plan is executable. If the
slice breaks any one of them, the plan needs revision **before**
Acts 1–5 are built.

### Slice Scope — Prelude Beats A → C + One Crew Choice

The vertical slice covers the first three Prelude beats:

- **Beat A — Cryo Bay Wake** (~8 minutes)
- **Beat B — Med Bay + First Card** (~12 minutes)
- **Beat C — Engineering + First Crew Choice** (~15 minutes)

Plus a **single persistent consequence**: the crew role the player
chooses in Beat C (medical / combat / exploration) is written to
Living Ark state, and Elara's Beat D opener changes based on that
choice in a stub "thank-you" line the player hears at the end of the
slice. This proves the persistence layer works.

Total target length: **~35–45 minutes** for a first-time player.

### What The Slice Must Exercise (The Load-Bearing Checklist)

| Load-bearing claim | Where in the slice it's tested |
|---|---|
| **Dual narrators work** | Beat A opens with Elara only. Beat B introduces The Human as a static hum behind Elara. Beat C they **trade speaking turns in the same scene** (Elara narrates the Engineering room opening, The Human interrupts with his log-reading compulsion, Elara overrides, The Human sulks). Target: player can distinguish voices within 30 seconds of first exposure. |
| **Choices persist across systems** | Crew role choice in Beat C writes to `livingArkState.crewRole`. Beat D stub plays a one-line thank-you from Elara that reads from that state. Proves the write → read round-trip works across beats. |
| **Dischordia card is a story beat** | Beat B ends with the player drawing their first card from their own personal deck. The card is named *"The Question You Didn't Ask"* (Epic, starter card) and its art is a silhouette of the player's pod. Drawing it plays a ~10 second Elara line about how this card will "come back when you need it." Proves card draws can carry story weight. |
| **Hellbox is the Light/Dark pivot** | Beat C includes a miniature hellbox encounter — the Engineering Bench is broken, and the player can choose to **fix it with the hellbox** (+3 Dark, unlocks faster Beat progression) or **fix it manually** (+2 Light, slower progression but Elara is warmer). Polarity tilts visibly in the HUD. Proves the polarity system affects narrator tone in real time. |

### Slice Exit Criteria (How You Know It Worked)

The slice is **green** if and only if:

1. A first-time player reaches the end of Beat C in 30–45 minutes
   without needing external help.
2. In a post-slice survey, ≥80% of players can correctly identify
   which voice is Elara and which is The Human in a blind line
   playback test.
3. The player can name their crew role choice (medical/combat/
   exploration) back to the surveyor, and is genuinely surprised
   when Elara's Beat D stub line acknowledges it.
4. At least 50% of players chose the hellbox path at least once and
   can describe what the polarity meter did afterward.
5. No soft-locks, no dead-end hotspots, no rooms where the player
   doesn't know what to do next for more than 90 seconds.
6. The slice runs on a modern mobile browser at ≥30 fps sustained.

If all six conditions are met, the team ships the rest of the Prelude
in the same architecture. If any condition fails, fix that condition
first before expanding scope.

### Slice File Inventory (What Gets Built)

The following files are created or modified for the slice only:

**New files:**
- `apps/web/src/narrative/NarratorSlot.tsx` — the dual-voice UI component
- `apps/web/src/narrative/narratorSlotState.ts` — which voice is active, polarity tilt, Thought Virus level
- `apps/web/src/narrative/preludeBeats.ts` — state machine for Beats A/B/C (and stubs for D–J)
- `apps/web/src/narrative/hellboxEncounter.tsx` — the Engineering Bench mini-hellbox modal
- `apps/shared/livingArkState.ts` — the persistent Ark state (crew role, polarity, flags)
- `apps/shared/preludeFlags.ts` — flag schema for Prelude only (see Part V (C))

**Modified files:**
- `apps/shared/elara-vo-script.md` — no new content, verify Lines 1-10 are the authoritative source
- `apps/shared/mobileNarratorDialog.ts` — verify cryo_pod + medical_bay + engineering entries are wired to Beats A/B/C
- `apps/web/src/App.tsx` — mount `<NarratorSlot />` as a persistent overlay

**Assets required:**
- Existing recorded Elara lines 1, 11, 12, 15, 20, 22 (already in `/public/audio/`)
- Existing recorded Human lines for cryo_pod tier A, medical_bay tier A, engineering tier A (already in `/public/audio/`)
- **New recording needed:** one 10-second Elara line *"The Question You Didn't Ask"* card-draw dialog (see Part V (B))
- **New recording needed:** one 5-second Elara stub for Beat D thank-you (one of three variants; see Part V (B))
- Art: pod silhouette card face (1 card), mini-hellbox modal background (1 screen), crew role icons (3 icons)

### Slice Timeline

If the team has the existing dialog files and the Dischordia card
engine already in place (which they do), the slice is a **~2-week
build** for one engineer + one designer + one VO session:

- **Days 1–3:** Build `NarratorSlot` component and `narratorSlotState`. Get dual-voice playback working with the existing recorded lines.
- **Days 4–5:** Wire `preludeBeats.ts` state machine for Beats A/B/C. Hook hotspot clicks to beat transitions.
- **Days 6–7:** Build the mini-hellbox modal and the polarity tilt writeback.
- **Days 8–9:** Build the first card draw scene. Commission pod silhouette card art.
- **Days 10:** VO session for the two new lines (1 card-draw, 3 crew-role stubs). Record in the existing Elara voice using ElevenLabs cloning.
- **Days 11–12:** Playtesting, polish, survey instrument.
- **Days 13–14:** Run the slice with ~10 first-time players. Evaluate against the six exit criteria.

### Slice Stop Conditions

If at any point during the build the team discovers that:
- The dual-voice UI cannot distinguish speakers without heavy visual aid
- The Dischordia card engine cannot be interrupted for a narrative beat
- The `livingArkState` write → read round-trip has race conditions

...the team should **pause and escalate**. These are architectural
signals that the plan's load-bearing claims are wrong and need
revision. Do not paper over. Fix or replan.

---

## (C) Prelude Implementation Spec

This section turns the 10 Prelude beats (A–J) into a concrete build
specification: file paths, flag schema, component specs, state
machine transitions, and hook points into existing code. It is
written so a mid-level engineer + a designer can execute it without
further architectural decisions.

### File Inventory (All 10 Beats)

```
apps/shared/
├── livingArkState.ts                 NEW — canonical Ark state store
├── preludeFlags.ts                   NEW — Prelude-only flag schema
├── narratorSlotState.ts              NEW — shared narrator state
├── dischordiaStarterDeck.ts          NEW — 10 starter cards authored in voice
└── vexSoleneInbox.ts                 NEW — Beat H.3 "Z." message payload

apps/web/src/narrative/
├── NarratorSlot.tsx                  NEW — dual-voice UI overlay
├── DialogWheel.tsx                   NEW — rarity-tier dialog response wheel
├── ThoughtVirusMeter.tsx             NEW — community polarity HUD widget
├── preludeBeats.ts                   NEW — Beat A–J state machine
├── hellboxEncounter.tsx              NEW — Engineering Bench + any later hellbox use
├── hotspotRegistry.ts                NEW — beat-gated hotspot availability
├── PreludeRoomView.tsx               NEW — room render shell (one per location)
└── preludeSlideshows/
    ├── LastWords.tsx                 NEW — Cycle C finale (used in Act 1, stubbed here)
    └── BeatJArchives.tsx             NEW — Beat J "Two Witnesses Meet Part 1"

apps/web/src/narrative/rooms/
├── CryoBayRoom.tsx                   NEW — Beat A
├── MedBayRoom.tsx                    NEW — Beat B + Beat H medical revisit
├── EngineeringRoom.tsx               NEW — Beat C + Beat H engineering revisit
├── CargoBayRoom.tsx                  NEW — Beat D + Beat H cargo revisit
├── BridgeRoom.tsx                    NEW — Beat I (Bridge + Tower Defense)
├── MessHallRoom.tsx                  NEW — Beat H.3 NPC Inbox location
└── ArchivesRoom.tsx                  NEW — Beat J
```

**Modified files (existing, additive only):**
- `apps/shared/mobileNarratorDialog.ts` — verify all dialog tiers A–J are wired to the beat state machine; no content changes
- `apps/shared/elara-vo-script.md` — canonical source of truth; no content changes
- `apps/shared/lyraVoxDialog.ts` — hellbox compulsion lines already exist; wire to `hellboxEncounter.tsx`
- `apps/shared/engineerBenchHints.ts` — wire to Beat C bench interaction
- `apps/shared/act2Interlude.ts` — ENGINEERS_BENCH_FRAMING wired to Beat H.2
- `apps/web/src/App.tsx` — mount `<NarratorSlot />` + `<ThoughtVirusMeter />` as persistent overlays

### Flag Schema — `preludeFlags.ts`

```typescript
export type PreludeFlagSet = {
  // Beat completion flags (set true when beat's exit condition met)
  beat_a_complete: boolean;       // Cryo wake done
  beat_b_complete: boolean;       // Med bay + first card drawn
  beat_c_complete: boolean;       // Engineering + crew role chosen
  beat_d_complete: boolean;       // Cargo + Trade hint
  beat_e_complete: boolean;       // Mess hall + Crew Messages
  beat_f_complete: boolean;       // Briefing Room + Contingency reveal
  beat_g_complete: boolean;       // Armory + Zero first contact
  beat_h_complete: boolean;       // Resumed puzzles (all rooms revisited)
  beat_i_complete: boolean;       // Bridge + Tower Defense
  beat_j_complete: boolean;       // Archives + Two Witnesses

  // Beat A granular
  pod_entered: boolean;
  cryo_log_viewed: boolean;
  patches_found: 0 | 1 | 2 | 3;   // 3 of 3 to unlock Act 2 Cargo bonus

  // Beat B granular
  first_card_drawn: boolean;      // "The Question You Didn't Ask"
  question_card_card_id: string;  // persisted card ID for deck
  medbay_hologram_triggered: boolean;

  // Beat C granular
  crew_role: 'medical' | 'combat' | 'exploration' | null;
  engineering_bench_fix_method: 'hellbox' | 'manual' | null;
  engineer_log_fragment_found: boolean;

  // Beat D granular
  trade_empire_hint_collected: boolean;
  clone_reference_seen: boolean;

  // Beat E granular
  crew_messages_read: number;     // 0..12, at least 3 to advance
  meme_broadcast_watched: boolean;

  // Beat F granular
  contingency_memo_read: boolean;
  elara_truth_confession_heard: boolean;

  // Beat G granular
  armory_weapon_selected: string | null;
  zero_first_contact_played: boolean;    // zero_fc_1
  chess_pawn_acquired: boolean;
  pet_battle_pet_chosen: string | null;

  // Beat H granular
  inbox_msg_patch: boolean;
  inbox_msg_elara_contingency: boolean;
  inbox_msg_yellow_coats: boolean;       // signed "Z." = Vex Solène
  engineer_log_completed: boolean;       // full 3-second fragment
  governance_hub_opened: boolean;

  // Beat I granular
  captains_chair_activated: boolean;
  hidden_data_chip_decoded: boolean;
  zephyr9_tower_defense_unlocked: boolean;

  // Beat J granular
  two_witnesses_meet_part1_watched: boolean;
  first_light_dark_choice: 'forgive' | 'condemn' | 'defer' | null;

  // Cross-beat state (written by multiple beats)
  polarity_light: number;                // 0..100
  polarity_dark: number;                 // 0..100
  thought_virus_level: number;           // 0..100, community pulled
  narrator_trust_elara: number;          // 0..100
  narrator_trust_human: number;          // 0..100
};
```

**Persistence:** `preludeFlags` is a slice of `livingArkState`
(persisted to localStorage + optional cloud sync). All writes go
through a typed reducer; all reads go through a selector. No
component writes flags directly.

**Invariants (enforced by reducer):**
- `polarity_light + polarity_dark <= 200` (both can be high)
- `narrator_trust_elara + narrator_trust_human` is unbounded but
  tracked for the Two Witnesses Meet cutscene threshold at Bond 80
- Setting `beat_X_complete: true` requires all prerequisites to be
  truthy (enforced in `preludeBeats.ts` state machine)

### State Machine — `preludeBeats.ts`

```typescript
export type PreludeBeat =
  | 'cryo_intro'     // pre-Beat A: cold start
  | 'beat_a'         // Cryo Bay Wake
  | 'beat_b'         // Med Bay + First Card
  | 'beat_c'         // Engineering + Crew Choice
  | 'beat_d'         // Cargo + Trade Hint
  | 'beat_e'         // Mess Hall + Crew Messages
  | 'beat_f'         // Briefing Room + Contingency
  | 'beat_g'         // Armory + Zero Contact
  | 'beat_h'         // Resumed Puzzles
  | 'beat_i'         // Bridge + Tower Defense
  | 'beat_j'         // Archives + Witnesses Meet
  | 'act1_handoff';  // Prelude done, Act 1 takes over

export type BeatTransition = {
  from: PreludeBeat;
  to: PreludeBeat;
  requires: (state: PreludeFlagSet) => boolean;
  onEnter: (dispatch: Dispatch) => void;
  onExit: (dispatch: Dispatch) => void;
};
```

**Transition table** (abbreviated; full table is a data file):

| From | To | Requires | Notes |
|---|---|---|---|
| cryo_intro | beat_a | always | Plays Elara Line 1 on enter |
| beat_a | beat_b | `pod_entered && cryo_log_viewed` | Transition plays static-hum intro of The Human |
| beat_b | beat_c | `first_card_drawn && medbay_hologram_triggered` | Card goes into player deck state |
| beat_c | beat_d | `crew_role !== null && engineering_bench_fix_method !== null` | Writes Living Ark state |
| beat_d | beat_e | `trade_empire_hint_collected` | |
| beat_e | beat_f | `crew_messages_read >= 3` | |
| beat_f | beat_g | `contingency_memo_read && elara_truth_confession_heard` | **Forces narrator swap to The Human as primary for 90 seconds** |
| beat_g | beat_h | `zero_first_contact_played` | `zero_fc_1` line triggers |
| beat_h | beat_i | `inbox_msg_yellow_coats && engineer_log_completed && governance_hub_opened` | Gate to Bridge |
| beat_i | beat_j | `captains_chair_activated && hidden_data_chip_decoded` | |
| beat_j | act1_handoff | `two_witnesses_meet_part1_watched && first_light_dark_choice !== null` | **Writes Act 1 seed state** |

**Rewind semantics:** Beats cannot rewind. If the player returns to
Med Bay during Beat H, they enter the Med Bay *room* in Beat H mode,
not Beat B mode. The `hotspotRegistry` is the arbiter.

### UI Component Specs

#### `<NarratorSlot />`

A persistent overlay anchored bottom-left of the screen. Shows:

- **Active speaker portrait** (48×48 circular; Elara portrait or Human static-texture portrait)
- **Text caption** (1-2 lines, auto-wrapping, slides in from left)
- **Voice indicator dot** (small colored dot — green for Elara, amber-static for Human, purple for Vex Solène, white for Kael archive, grey for Meme)
- **Thought Virus glow ring** (thickens as `thought_virus_level` rises; at ≥75, Elara portrait visibly tints purple)

**Props:**
```typescript
type NarratorSlotProps = {
  activeSpeaker: 'elara' | 'human' | 'vex' | 'kael' | 'meme' | 'none';
  caption: string | null;
  audioSrc: string | null;
  onLineComplete: () => void;
  polarity: { light: number; dark: number };
  thoughtVirus: number;
};
```

**Behavior:**
- When `activeSpeaker` changes, cross-fade portrait + caption over 300ms
- When `thoughtVirus >= 75`, pulse the ring at 0.5Hz
- When both Elara AND Human are speaking (Beat J Archives scene),
  split the slot vertically into two half-portraits
- Audio plays via `<audio>` element with `onEnded` → `onLineComplete`
- **Accessibility:** captions always visible; audio is an enhancement

**Dependencies:**
- Portraits: existing files at `/public/portraits/elara.png`, `/public/portraits/human.png`, etc. — confirm or commission
- Audio: existing ElevenLabs files at `/public/audio/elara-line-*.mp3`

#### `<DialogWheel />`

Rarity-tier response wheel for dialog choices. 2–4 response options,
each with a **rarity tier** that affects both the UI and the
narrator's reaction.

**Tiers:**
- **Common** (grey) — safe response, small flag change
- **Uncommon** (green) — slight polarity tilt
- **Rare** (blue) — meaningful flag change, polarity tilt visible
- **Epic** (purple) — **writes to Living Ark**, narrator remembers
- **Legendary** (orange) — **writes to Living Universe**, other players may see it
- **Mythic** (red) — one-per-playthrough, permanently alters ending conditions

**Props:**
```typescript
type DialogWheelProps = {
  options: Array<{
    text: string;
    tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
    onChoose: (dispatch: Dispatch) => void;
    disabled?: boolean;
    disabledReason?: string;
  }>;
  speaker: 'elara' | 'human';
  timeoutMs?: number;
};
```

**Behavior:**
- Options render as wedges on a clock-face wheel
- Mythic options require a **press-and-hold** interaction (3 seconds)
- Timeout (default 30s) picks the first Common option and flags `player_hesitated`

#### `<ThoughtVirusMeter />`

Anchored top-right. Shows community polarity level (0-100).

**Props:**
```typescript
type ThoughtVirusMeterProps = {
  level: number;        // 0..100
  trend: 'rising' | 'falling' | 'stable';
  lastUpdate: Date;
};
```

**Behavior:**
- Bar fills from left (0) to right (100)
- Color: green (0-33), amber (34-66), red (67-100)
- When `level >= 75`, pulses and emits a brief Elara line (from `mobileNarratorDialog` polarity tier)
- Pulled from `/api/living-universe/thought-virus` every 5 minutes during active play, or at beat transitions

#### `<HellboxEncounter />`

Modal that opens when the player interacts with a hellbox target.
First used in Beat C Engineering Bench; reused in Acts 1/2/4.

**Props:**
```typescript
type HellboxEncounterProps = {
  context: 'engineering_bench' | 'deck_build' | 'cades_purge' | string;
  onChooseHellbox: (dispatch: Dispatch) => void;
  onChooseManual: (dispatch: Dispatch) => void;
  hellboxBonus: { darkDelta: number; timeDelta: number };
  manualBonus: { lightDelta: number; timeDelta: number };
};
```

**Behavior:**
- Shows the hellbox as a glowing cube with the Lyra Vox whisper audio
  looping quietly
- Two buttons: *"Use the Hellbox"* (dark-tinted) and *"Do it
  manually"* (light-tinted)
- If player hovers the hellbox button for ≥3 seconds without
  clicking, plays a Lyra Vox line from `lyraVoxDialog.ts`
  compulsion tier
- On choose, modal closes with a 500ms transition and the chosen
  `dispatch` fires

### Hook Points Into Existing Systems

Each Prelude beat hooks into systems that already exist in the
codebase. This table is the contract between Prelude beats and
existing subsystems:

| Beat | Hook point | Existing file | What gets called |
|---|---|---|---|
| A | Cryo pod click | `mobileNarratorDialog.ts` cryo_pod tier A | Play line, set `pod_entered` |
| A | Patch find | `patchNotes.ts` (create if missing) | Increment `patches_found` |
| B | First card draw | `dischordiaStarterDeck.ts` (NEW) → card engine | Add card to player deck |
| B | Med Bay hologram | `mobileNarratorDialog.ts` medical_bay tier A | Play line, set hologram flag |
| C | Crew role choice | `<DialogWheel />` | Write `crew_role` |
| C | Bench fix | `<HellboxEncounter />` + `engineerBenchHints.ts` | Tilt polarity, set fix method |
| D | Cargo hotspot | `mobileNarratorDialog.ts` cargo_bay tier A + `memePouch.ts` | Play line, set Trade hint flag |
| E | Mess Hall Crew Messages | `crewMessages.ts` (extend existing) | Read count, Meme broadcast trigger |
| F | Briefing Room memo | `elara-vo-script.md` Line 14 + `mobileNarratorDialog.ts` briefing_room tier A | **Forces Human narrator primary** |
| G | Armory Zero contact | VO `zero_fc_1` playback | First Vex Solène line, set flag |
| G | Chess pawn | `chessGame.ts` pawn unlock | Grant pawn, set flag |
| G | Pet Battle | `pets.ts` pet selection | Grant pet, set flag |
| H | NPC Inbox | `npcInbox.ts` (create) + `vexSoleneInbox.ts` | Deliver 3 messages |
| H | Engineer log | `act2Interlude.ts` ENGINEERS_BENCH_FRAMING | Complete log fragment |
| H | Governance Hub | `governanceHub.ts` (extend) | Open hub, tutorial flag |
| I | Bridge + Tower Defense | `towerDefenseGame.ts` + Zephyr-9 NEW lines | Unlock Tower Defense |
| I | Captain's Chair | `captainsChair.ts` (create) | Activate hologram |
| I | Hidden Data Chip | VO Line 49 | Decode, deliver Yellow Coats payload |
| J | Two Witnesses Meet Part 1 | `<BeatJArchives />` slideshow | First shared scene |
| J | First Light/Dark choice | `<DialogWheel />` mythic tier | **Writes Act 1 seed** |

### Test Checklist — Prelude End-to-End

**Unit:**
- [ ] Every beat transition fires only when `requires` predicate is true
- [ ] Reducer rejects writes that violate invariants
- [ ] `NarratorSlot` cross-fade works for every `activeSpeaker` value
- [ ] `DialogWheel` timeout picks common option and flags hesitation
- [ ] `HellboxEncounter` writes correct polarity delta on choice
- [ ] `livingArkState` persists across page reload

**Integration:**
- [ ] Fresh save → Beat A → Beat J in one sitting (~3-5 hours)
- [ ] Every beat's exit condition can be reached without soft-lock
- [ ] Narrator voices swap at the correct beat boundaries (especially Beat F)
- [ ] `thought_virus_level` pulls from Living Universe API and renders
- [ ] Act 1 handoff writes seed state that Act 1 Cycle A reads

**Narrative:**
- [ ] Blind voice identification: ≥80% of players can tell Elara from Human after Beat C
- [ ] Beat G `zero_fc_1` plays at the correct moment; players can name Agent Zero by Beat H
- [ ] Beat H Inbox Yellow Coats message is noticed by ≥60% of players (they mention it unprompted in debrief)
- [ ] Beat J Two Witnesses Meet Part 1 is recognized as a story moment, not a cutscene interruption
- [ ] First Light/Dark choice in Beat J feels weighty (≥70% of players pause >5 seconds before choosing)

**Performance:**
- [ ] Prelude runs on iPhone 12 / Android equivalent at ≥30 fps
- [ ] Total download size for Prelude assets ≤50 MB
- [ ] Audio files preload at beat transitions, not mid-beat
- [ ] No memory leaks after 3 full Prelude runs in same browser session

---

## (B) Missing Prelude Dialog — Written In Voice

This section is the actual script for the ~25 new lines needed to
make Prelude Beats A–J 100% script-ready. Every line is written in
the voice of an existing character whose voice profile is already
locked. Each line includes:

- **VO ID** (stable identifier for the asset)
- **Speaker** (with voice profile reference)
- **Beat / trigger** (when it plays)
- **Line text** (the actual words)
- **Direction** (performance notes)
- **Length** (approximate spoken duration)

All new lines should be recorded in ElevenLabs using the voice
clones referenced in `VOICE_OVER_BIBLE.md` and `voiceMap.ts`.

### The Dischordia Starter Deck (Beat B draw scene)

The player's first card draw happens in Med Bay at the end of Beat
B. The card is authored as **"The Question You Didn't Ask"** — an
Epic-tier starter card the player carries for the entire game.
This section authors the full 10-card starter deck's VO flavor
text, because the Dischordia card engine wants every card to carry
a line of character voice.

**Shared voice:** Elara, warm-archival tone (per `elara-vo-script.md`
line profile 1-10). Each card's line is short (≤6 seconds).

| Card | Tier | VO ID | Line | Direction |
|---|---|---|---|---|
| The Question You Didn't Ask | Epic | `starter_card_question` | *"Every player draws this first. It is the question you should have asked before you signed the contract. You did not ask it. I'm glad you drew it now."* | Warm, almost maternal. Slight pause before *"I'm glad."* |
| The Pod That Wasn't Empty | Common | `starter_card_pod` | *"1,046 pods on this Ark. Yours was 1,047. You know what that means. I do not."* | Factual, then soft. |
| The Name on the Manifest | Common | `starter_card_manifest` | *"Your name is on the manifest. Three times. None of the entries match."* | Clinical, noticing. |
| The Patch You Missed | Uncommon | `starter_card_patch` | *"Patch 0.3.1 — 'Fixed a bug where the Ark forgot to wake the Captain.' I wrote that patch note. I have no memory of writing it."* | Quiet, honest. |
| The First Breath | Common | `starter_card_breath` | *"The first breath after cryo is the one the ship holds with you. Don't waste it on a question."* | Instructive. |
| The Mirror That Didn't Work | Uncommon | `starter_card_mirror` | *"The mirror in Med Bay hasn't worked since the Battle of Nexon. I don't know why it is in the deck."* | Curious, faintly alarmed. |
| The Door With No Handle | Rare | `starter_card_door` | *"You are going to find a door with no handle. It is not locked. It is waiting for a word you haven't said yet."* | Portentous but quiet. |
| The Seat That's Yours | Common | `starter_card_seat` | *"Every room has one seat that was meant for you. In most rooms it is not the seat you sit in."* | Observational. |
| The Hum You Hear | Rare | `starter_card_hum` | *"The hum you hear isn't the ship. It's someone else reading your logs on the channel you can't see."* | **First foreshadow of The Human.** Slightly uneasy. |
| The Card You Will Play Last | Mythic | `starter_card_last` | *"One card in this deck has no name. When you draw it, you will know what it is. Don't play it until you do."* | Slow, ceremonial. **This is the blank card from the Act 1 finale.** |

**Total new Elara lines for starter deck: 10.** Combined length
~45 seconds. Single VO session.

### Beat C — Engineering Bench Crew Role Choice

The player chooses a crew role (medical / combat / exploration) at
the Engineering Bench. Each role triggers a short Elara
acknowledgment that will be echoed in Beat D's stub thank-you.

**Speaker:** Elara. **Trigger:** `crew_role` is set.

| VO ID | Role | Line | Direction |
|---|---|---|---|
| `elara_crew_role_medical` | medical | *"You chose the Med Bay. That means you've read someone's chart and known you were going to lose them. I'm sorry. The Ark needs you anyway."* | Soft, with recognition. |
| `elara_crew_role_combat` | combat | *"You chose the Armory. You want to be the first one through the door. The door is going to cost you. I'll still open it."* | Firmer, respectful. |
| `elara_crew_role_exploration` | exploration | *"You chose the Bridge. You want to see the map before you walk into it. I like you. The Ark is going to test that preference."* | Warm, a little amused. |

**Length:** ~8 seconds each.

### Beat C — Engineering Bench Hellbox Compulsion

The hellbox has authored lines in `lyraVoxDialog.ts` compulsion
tier, but the Engineering Bench mini-encounter needs **one new
Lyra Vox line** that is specific to the bench context. This is
the first hellbox the player encounters; the line needs to feel
like a whisper from the ship's substrate.

**Speaker:** Dr. Lyra Vox (per `lyraVoxDialog.ts` voice profile —
female scientist, calm but too-calm, slight reverb).
**Trigger:** Player hovers the hellbox button for ≥3 seconds
without clicking.

| VO ID | Line | Direction |
|---|---|---|
| `lyra_hellbox_bench_compulsion` | *"The bench is broken. I know. I broke it. The hellbox will fix it faster than you will. Use it. I made it for you. You would be the first to use it for its intended purpose."* | Whispered, too close to the microphone. A slight echo. |

**Length:** ~12 seconds.

### Beat D — Elara's Crew Role Thank-You (Three Variants)

Beat D opens with Elara acknowledging the crew role chosen in
Beat C. This is the line that proves the `livingArkState`
persistence layer works — the player is meant to be quietly
surprised that Elara *remembers*.

**Speaker:** Elara. **Trigger:** Beat D enter.

| VO ID | Role | Line | Direction |
|---|---|---|---|
| `elara_beat_d_medical` | medical | *"Thank you for choosing medical. There are 1,046 pods on this Ark and at least twelve of them are going to need you before the day is out. I've put the list on your console."* | Practical gratitude. |
| `elara_beat_d_combat` | combat | *"Thank you for choosing combat. I'm going to ask you to do something you don't want to do, and I'm going to pretend I didn't ask. The Armory is keyed to your handprint now."* | Direct, a little cold. |
| `elara_beat_d_exploration` | exploration | *"Thank you for choosing exploration. You'll have the Bridge to yourself tonight. I left the star charts up. The ones that don't match anything. I'd like to know what you think."* | Inviting, curious. |

**Length:** ~10 seconds each.

### Beat E — The Meme Broadcast Opening Line

The Meme's *Late Night with the Meme* show exists in
`apps/shared/transmissions.ts`, but the Prelude Beat E cold-open
for the episode the player watches in Mess Hall needs a new 1-line
stinger that ties it to Ark 1047.

**Speaker:** The Meme (per `voiceMap.ts` — White Oracle voice
profile, slightly sardonic, broadcast-quality).
**Trigger:** Beat E Mess Hall Crew Messages terminal, episode
"Ep. 47: The Arks Are Not Okay."

| VO ID | Line | Direction |
|---|---|---|
| `meme_ep47_coldopen_ark1047` | *"Good evening, ladies, gentlemen, and cryogenically ambivalent. Tonight on Late Night with the Meme: Ark 1047 woke up. Which is a problem, because Ark 1047 was officially decommissioned seventeen thousand years ago. Also tonight: why your cat is probably a Collector. We'll be right back after these messages from our sponsor — the Light."* | Broadcast confidence. Land on *"the Light"* like a punchline. |

**Length:** ~18 seconds.

### Beat F — Elara's Contingency Confession

Beat F is the first place Elara is **forced to tell the truth**
and **The Human becomes primary narrator for 90 seconds**. Elara's
existing Line 14 (Briefing Room) is the intro. The new line is her
confession after the player reads the contingency memo.

**Speaker:** Elara. **Trigger:** `contingency_memo_read` flips true.

| VO ID | Line | Direction |
|---|---|---|
| `elara_contingency_confession` | *"I wrote that memo. I signed it with my own hand. It says that if any crew member wakes before the Captain does, they are to be... classified as unauthorized cargo. You are the crew member. I wrote the memo that makes you cargo. I do not remember writing it, and I do not know how to apologize for it, so I am telling you instead. The Human wants to say something. I'm going to let him."* | **Breaks composure halfway through.** The words *"classified as unauthorized cargo"* should land cold. *"I am telling you instead"* should land naked. Hand the scene to The Human at the end. |

**Length:** ~28 seconds.

### Beat F — The Human's Interruption

Immediately after Elara's confession, The Human speaks for the
first time as **primary narrator** (not background static). This
line is the hardest to write because The Human's voice is
typically static-filtered and reluctant.

**Speaker:** The Human (per `voiceMap.ts` tier H profile — male,
middle-aged, tired, lightly distorted).
**Trigger:** Follows `elara_contingency_confession` immediately.

| VO ID | Line | Direction |
|---|---|---|
| `human_beat_f_first_speaking` | *"Hey. She's — she's not going to say this, so I will. I investigated that memo. Seventeen thousand years ago, my job was to find out who wrote it and why, and I closed the case. I closed the case because I didn't want to know. That was the worst thing I ever did, and I've done a lot of things. I'm telling you now because you are the first person who might actually read the file. It's in the briefing room terminal under my login. Password is 'Evie.' She was my daughter. She wasn't on the Ark."* | **The static filter should drop halfway through.** The word *"Evie"* should be unfiltered — just his real voice, cracking. This is the first time the player hears him without distortion. It should feel like he took off a mask. |

**Length:** ~32 seconds.

### Beat G — Zephyr-9 First Contact (Tower Defense Unlock)

Zephyr-9 is the Quarchon AI that teaches Tower Defense on the
Bridge. The character exists in `questlineQuarchon*.ts` but has no
Prelude lines. Beat I is the Tower Defense unlock; this is the
line that plays when the player first interacts with the bridge
holo-table.

**Speaker:** Zephyr-9 (per `voiceMap.ts` Quarchon profile — synth,
multi-layered, pseudo-cheerful).
**Trigger:** Beat I, Bridge holo-table click.

| VO ID | Line | Direction |
|---|---|---|
| `zephyr9_tower_defense_intro` | *"Greetings, Potential. I am Zephyr-9, Quarchon Defensive Operations. I have been dormant since the second firing. The Ark's tactical grid is functional. Would you like me to teach you how to use it? The alternative is that a swarm of... something... arrives in approximately forty-six hours and none of us know how to shoot back. I recommend yes."* | Cheerful-professional. The word *"something"* gets a micro-pause — Zephyr doesn't know either. *"I recommend yes"* is almost a joke but not quite. |

**Length:** ~22 seconds.

### Beat H.3 — Vex Solène NPC Inbox Message ("Z.")

Per rev 4 canon, the "Yellow Coats" inbox message is from Vex
Solène. This is her first appearance in the game. She is authored
per `VOICE_OVER_BIBLE.md` entry 3 — sharp, clipped, military,
haunted.

**Speaker:** Vex Solène. **Trigger:** Beat H.3 Mess Hall NPC Inbox
click.

| VO ID | Line | Direction |
|---|---|---|
| `vex_inbox_yellow_coats` | *"Potential. You don't know me. I don't know you either. A client hired me to look at Ark 1047 and decide if it's worth killing. I'm still deciding. While I decide, here's a free tip from the other side of the channel you can't see: find the Yellow Coats. They're the reason you woke up. They're also the reason someone gave his life to save mine. I don't remember who. I'm trying to. — Z."* | **Clipped military delivery** until the sentence *"someone gave his life to save mine"* — that one softens. Then snaps back to clipped on the sign-off. |

**Length:** ~26 seconds.

### Beat H — Gary's Orientation (Mascoteer Intro Stub)

Gary the Stablemaster is introduced in Beat H as the Mascoteer
tutorial NPC. He has no Prelude lines yet. This is his
single-line orientation.

**Speaker:** Gary (per `mascoteers.ts` voice profile —
working-class warmth, salt-of-the-earth, slightly gruff).
**Trigger:** Beat H Mess Hall stable-door hotspot click.

| VO ID | Line | Direction |
|---|---|---|
| `gary_orientation` | *"Name's Gary. I run the stables. Don't ask what the stables are doing on a starship — I didn't name 'em, I just feed 'em. You here to pick a mascot or just to look? If you're just looking, the big one bites. If you're picking, pick the one that looks back at you. Mascoteers don't choose the mascot, Potential. The mascot chooses you. Now get out of my stable unless you brought apples."* | Gruff, fond. The line *"the mascot chooses you"* is the one piece of real advice — land it. The *"get out"* is affectionate. |

**Length:** ~20 seconds.

### Beat H — Patch's Engineering Recording

The Human's predecessor, "Patch," left a recording in the
Engineering room that plays during Beat H. Patch is not a speaker
elsewhere in the game — he is dead. The line is pulled from a
damaged audio log.

**Speaker:** Patch (voice profile TBD; recommend a younger male
voice with heavy static filter, distinct from The Human).
**Trigger:** Beat H Engineering Bench second interaction after
Beat C hellbox choice.

| VO ID | Line | Direction |
|---|---|---|
| `patch_engineering_log_fragment` | *"[HEAVY STATIC] ...the next pod, the next pod, I can't tell them it's the same pod. We are all running the same clone. The hellbox is the kernel. I should not have built this. [STATIC] ...if you're hearing this and your name isn't Patch, then the Ark thinks I'm you now. Don't trust the memo. Don't trust the mirror. Do trust Elara — she doesn't know what she is yet, but she's the only one of us who ever told the truth. [STATIC CUTS OUT]"* | Heavy static for the first half, clearing in the middle, cutting out at the end. **The word "Elara" should be the clearest word in the recording** — the static briefly dips. |

**Length:** ~24 seconds.

### Beat J — First Light/Dark Choice Wheel Dialog

Beat J ends with the first **mythic-tier Dialog Wheel choice** of
the game: the player's first real Light/Dark decision. This
writes to Act 1 seed state.

**Speaker:** Elara (framing) + player choice (3 options).
**Trigger:** End of `<BeatJArchives />` slideshow.

| VO ID | Speaker | Line | Direction |
|---|---|---|---|
| `elara_beat_j_choice_framing` | Elara | *"You have seen the first piece of it. There will be many more. I am going to ask you a question I am not supposed to ask a Potential until the end of Act 3, but we don't have until the end of Act 3. The question is: **what do you think we deserve?** Forgive. Condemn. Or hold the question until you know more. Whichever you choose, the Ark is going to remember it."* | Ceremonial, tired, honest. |
| `elara_beat_j_choice_forgive` | Elara (reaction) | *"Thank you. That's more than we deserve. I'll try to be worth it."* | Soft, almost teary. |
| `elara_beat_j_choice_condemn` | Elara (reaction) | *"That's fair. I'll try to earn a different answer."* | Steady, sad. |
| `elara_beat_j_choice_defer` | Elara (reaction) | *"Good. Don't answer a question you don't understand. I'll tell you more as we go."* | Approving. |

**Length:** framing ~22 seconds, each reaction ~6 seconds.

### Total New Lines Needed — Prelude Only

| Speaker | Line count | Combined length |
|---|---|---|
| Elara | 10 starter deck + 3 crew role + 3 Beat D thank-you + 1 Beat F confession + 4 Beat J choice = **21** | ~3 min 30 sec |
| The Human | 1 (Beat F first speaking) | ~32 sec |
| Vex Solène | 1 (Beat H.3 inbox) | ~26 sec |
| Dr. Lyra Vox | 1 (Beat C hellbox compulsion) | ~12 sec |
| Zephyr-9 | 1 (Beat I Tower Defense intro) | ~22 sec |
| The Meme | 1 (Beat E broadcast cold open) | ~18 sec |
| Gary | 1 (Beat H orientation) | ~20 sec |
| Patch | 1 (Beat H log fragment) | ~24 sec |
| **Total** | **27 new lines** | **~6 min 24 sec** |

**Recording plan:** 3 ElevenLabs sessions.
- Session 1: Elara (existing voice clone, 21 lines, ~45 min session)
- Session 2: The Human + Patch (new voice clones or existing clone tweaks, 2 lines, ~20 min)
- Session 3: Vex / Lyra / Zephyr-9 / Meme / Gary (5 voices, 5 lines, ~1 hour session with voice switching)

**Storage:** All new assets land in `/public/audio/prelude/` with
filenames matching VO IDs. Total new audio ≤3 MB compressed.

---

## (A) Act 1 Beat Breakdown — "The Engineer's Deck"

Act 1 in the Witnessing structure is **the Engineer's biographical
card game** — the player inherits the Engineer's personal Dischordia
deck and plays through his life as a series of card battles. The act
contains three cycles (A / B / C) and ends with the *Last Words*
slideshow, which is the **first cinematic the player ever sees**.

Per the rev 4 canonical correction, Act 1 Cycle C3 is the Engineer's
**final transference attempt** to save Agent Zero (Vex Solène) from
the Warlord's nano-swarm possession — a forced-loss-that-is-also-a-
win, where the Engineer's death becomes Vex's awakening.

### Structural Overview

Act 1 is broken into **10 beats (A–J)**, mapped across 3 cycles:

| Beat | Cycle | Title | Approx. length |
|---|---|---|---|
| A | Cycle A — The Student | Mascoteer Trial Day 1 | 25 min |
| B | Cycle A — The Student | Mascoteer Trial Week 1 Montage | 30 min |
| C | Cycle A — The Student | Mascoteer Trial Week 2 + First Real Battle | 45 min |
| D | Cycle A — The Student | Mascoteer Trial Final + The Countermelody | 60 min |
| E | Cycle B — The Dischordant | The Prince's Archive + The First Card | 45 min |
| F | Cycle B — The Dischordant | The Hollowing of Nexon | 60 min |
| G | Cycle C — The Engineer | The Battle of Nexon (Survival Puzzle) | 45 min |
| H | Cycle C — The Engineer | The Warlord (Fragmented) | 60 min |
| I | Cycle C — The Engineer | The Transference (forced loss) | 45 min |
| J | Cycle C — The Engineer | The Authority's Tribunal + Last Words Slideshow | 60 min |

**Total target length: 8–10 hours** for a first-time player. This
matches the Prelude:Act 1 ratio suggested by the existing TCG ch1
content volume in `dischordiaDeck.ts` and related files.

**Cycles map to SiH acts:**
- Cycle A (Student) plays under SiH Act I "Warning" + early Act II
- Cycle B (Dischordant) plays under SiH Act II "Judgment"
- Cycle C (Engineer) plays under SiH Act II finale + Act III opener

### Narrator Spine Across Act 1

Act 1 opens with **both Elara and The Human present** (per Beat F
Prelude swap), but the player gradually learns that **the Engineer
is a third voice** who narrates his own biography through the card
game's in-battle dialog. By Cycle C, the Engineer is the primary
narrator of his own death, with Elara + The Human as a Greek chorus
reacting to what they are watching.

| Beat | Primary narrator | Secondary | Silent |
|---|---|---|---|
| A | Elara | The Human (static) | — |
| B | The Engineer (new voice, via card text) | Elara | The Human |
| C | The Engineer | Elara | The Human |
| D | The Engineer | Elara | The Human |
| E | The Engineer | The Human (breaking silence to comment on Nexon) | Elara |
| F | The Engineer | The Human | Elara |
| G | The Engineer | Elara (returning to fight the Vortex) | The Human |
| H | The Engineer + The Warlord (duet) | Elara | The Human |
| I | The Engineer + Vex Solène (first duet) | Elara (sobbing) | The Human |
| J | Elara + The Human (both, at the Tribunal) | The Engineer (fading) | — |

**Key beat:** Beat I is the **first time Vex Solène speaks in-game
with a scene partner**. Before Act 5, she does not know the player
— but during Beat I, the transference is happening, and she is
briefly in two consciousnesses at once. This is a one-time event.

---

### Act 1 Beat A — Mascoteer Trial Day 1

**Location:** Gary's Stables (Mess Hall hotspot, unlocked in
Prelude Beat H; now the primary location).
**Teacher NPC:** Gary the Stablemaster (existing `mascoteers.ts`).
**Primary system taught:** Mascoteer pet system (`pets.ts` +
`petBattle.ts`).
**Length:** ~25 min.

**Opening:** The Ark acknowledges the player is Potential enough to
begin the real work. Elara walks the player to Gary's stables,
where the player meets their **starter mascot** — chosen from 3
options (based on Prelude crew role). This is the canonical
Mascoteer Trial opening from `apprentices.ts`.

**Mascot options by Prelude crew role:**
- **Medical crew** → starter mascot is **Patchcat** (heals pets, low
  damage, can revive one pet per battle)
- **Combat crew** → starter mascot is **Vexhound** (high damage,
  low health, finisher specialization)
- **Exploration crew** → starter mascot is **Cartograph** (scouts
  enemy deck, reveals one opposing pet per turn)

**The Mascoteer Trial opens as a 28-day challenge.** The player has
28 in-game days to train their mascot from novice to competition-
ready. Each in-game day is ~2 minutes of real time (so the trial
takes ~1 hour across Beats A-D).

**Beat A content (Day 1 only):**
1. **Orientation by Gary** — Gary plays his Prelude H orientation
   line (`gary_orientation`, see Part V (B)) if not already heard.
   Then delivers the Day 1 walkthrough from existing
   `mascoteers.ts` tutorial lines.
2. **First training battle** — A tutorial pet battle against Gary's
   own mascot (intentionally weak). The player is taught the
   `petBattle.ts` mechanic. **Forced win, then Gary explains what
   went wrong in the player's play.**
3. **First daily decision** — Via `apprentices.ts` decision engine:
   feed the mascot, rest the mascot, or push the mascot. Each
   choice shifts a hidden stat. **This is the first daily loop the
   player touches in the game.**
4. **Scene transition** — End of Day 1 plays an Elara
   voiceover (new line) reflecting on how the player held themselves
   during the first battle. Polarity tilt: +1 Light if player fed,
   +1 Dark if player pushed.

**Beat A exit condition:**
- `act1_mascoteer_day_1_complete: true`
- `starter_mascot_chosen: 'patchcat' | 'vexhound' | 'cartograph'`
- `mascoteer_day_counter: 1`
- Polarity tilt applied

**New dialog needed for Beat A:**
- 1 Elara line: end-of-day-1 reflection (3 variants by crew role)
- Gary dialog is already in `mascoteers.ts`

---

### Act 1 Beat B — Mascoteer Trial Week 1 Montage

**Location:** Gary's Stables + brief excursions to other rooms.
**Teacher NPC:** Gary (continuing) + **first appearance of
apprentices.ts rival characters** (the other Mascoteers competing
in the trial).
**Primary system taught:** Daily decision loop + rival rivalry
mechanics.
**Length:** ~30 min.

**Beat B covers Days 2–7** of the trial — a compressed week
montage. Each day is a short decision + a training scene. The
player is introduced to **the 4 rival Mascoteers** who are also
competing. Each rival has a distinct personality pulled from
`apprentices.ts` and forms a **rivalry slot** that may become a
friendship, a feud, or a grudge.

**The 4 rivals:**
1. **Brindle** — a legacy Mascoteer whose family has won the trial
   3 generations running. Arrogant. Plays with a legendary mascot.
2. **Quinn** — a kid from the slums whose mascot is held together
   with tape. Underdog. Will eventually ask the player for help.
3. **Silver** — a polished career Mascoteer who plays strictly by
   the rules. Rival-of-honor; will duel the player at end of week 2.
4. **The Masked One** — a competitor whose face and mascot are both
   hidden. Mysterious. **(Act 3 reveal: The Masked One is Vex
   Solène as a trainee, years before her Warlord capture — this is
   foreshadowed in Beat B without being named.)**

**Beat B content (Days 2-7):**
1. **Day 2-3: Rival introductions** — 4 short scenes, one per rival.
2. **Day 4: Rival Battle — Brindle** — First mandatory rival fight.
   Designed as a hard-but-fair match. Forced encounter, not a forced
   win. If the player loses, the story continues with Brindle
   humiliating them, and the next battle becomes easier. If the
   player wins, Brindle starts a grudge that follows them into
   Act 2 Chess.
3. **Day 5-6: Training recovery** — Daily decisions only, no
   battles. The player learns the difference between training
   types.
4. **Day 7: End of Week 1 — The Masked One appears** — The Masked
   One visits the player's stable at night, watches silently, and
   leaves without speaking. The player sees their back silhouette.
   **Flag: `masked_one_visit_1 = true` (foreshadows Vex Solène).**

**Beat B exit condition:**
- `mascoteer_day_counter: 7`
- `rival_battle_brindle_outcome: 'win' | 'loss'`
- `masked_one_visit_1: true`
- Mascot trained to level 2

**New dialog needed for Beat B:**
- 4 rival intro lines (1 each, ~8 sec)
- 1 Brindle pre-battle taunt + 2 Brindle post-battle variants
- 1 Elara end-of-week reflection line

---

### Act 1 Beat C — Mascoteer Trial Week 2 + First Real Battle

**Location:** Gary's Stables + **Battle Arena (first visit)**.
**Teacher NPC:** Gary + Silver (rival duel).
**Primary system taught:** Battle Arena system unlocked; first
real competitive battle.
**Length:** ~45 min.

**Beat C covers Days 8–14.** The training gets harder. The rival
dynamics deepen. On Day 14, the player faces **Silver in a formal
rival duel** — a hard-fought match that rewards a Dischordia card
as a prize.

**Beat C content:**
1. **Day 8-9: Masked One watches training** — Second silent visit.
   Flag: `masked_one_visit_2 = true`.
2. **Day 10: Quinn's crisis** — Quinn's mascot is sick. Quinn asks
   the player for help. **Epic-tier DialogWheel choice:**
   - *Help Quinn* → +5 Light, +1 ally, lose 1 training day
   - *Tell Quinn to handle it* → +3 Dark, Quinn drops out of
     the trial, player inherits Quinn's mascot slot
   - *Report Quinn to Gary* → +2 Dark, Gary disqualifies Quinn,
     player gains Gary's respect but loses a potential ally in
     Act 2
   This is the **first Epic-tier choice in the main game** and
   the first time a choice **permanently removes a character
   from the story** if the player chooses wrong.
3. **Day 11-13: Preparation montage** — Training scenes, no combat.
4. **Day 14: The Silver Duel** — A formal rival duel in the Battle
   Arena. Full pet battle with announcer dialog. Silver plays
   cleanly, the player plays cleanly. **Rewards:**
   - Win → *The First Card* (Epic Light) — **the first Dischordia
     card the player earns in Act 1**
   - Loss → *The Respectful Loss* (Uncommon Light) + Silver invites
     the player to train with her for a day
5. **End of Week 2 — The Masked One speaks for the first time** —
   Walks into the stable at night. Says exactly one line
   (`masked_one_first_line`, see new dialog below). Leaves before
   the player can respond.

**Beat C exit condition:**
- `mascoteer_day_counter: 14`
- `quinn_outcome: 'helped' | 'ignored' | 'reported'`
- `silver_duel_outcome: 'win' | 'loss'`
- `first_card_acquired: string` (card ID)
- `masked_one_first_line_heard: true`

**New dialog needed for Beat C:**
- 3 Quinn crisis variants (ask for help, desperation, gratitude/anger)
- 1 Silver pre-duel + 2 post-duel variants
- 1 announcer for the Battle Arena (reused in Acts 2 and 4)
- **1 Vex Solène line (as The Masked One)** — her first line in
  the game, delivered in her haunted-military voice with a subtle
  effect distortion that the player won't recognize as Vex until
  Act 3 F3.

**The Masked One's first line** (write-in-voice):

> **Vex Solène (as The Masked One)** (`masked_one_first_line`):
> *"I'm not here for the trial. I'm here to see if the Ark
> remembers me. It does. That means it remembers you too.
> Train harder, Potential. The one we're both running from
> doesn't care who wins this contest."* — **Delivery:**
> clipped, military, barely audible at the end of each clause.
> Turns and leaves before the player can answer.

---

### Act 1 Beat D — Mascoteer Trial Final + The Countermelody

**Location:** Battle Arena (grand final).
**Teacher NPC:** Gary (coach), announcer (arena), Elara (off-stage).
**Primary system taught:** None new — this is the **first act
climax** using the systems already taught.
**Length:** ~60 min.

**Beat D covers Days 15–28.** The second half of the trial is
compressed again into a shorter sequence of decisions, but the
final day is the **Mascoteer Grand Final** — a three-round
tournament where the player fights all three surviving rivals in
sequence.

**Beat D content:**
1. **Day 15-26: Compressed training** — 4 daily decisions, no
   battles. Opponent scouting reports. Gary's final coaching.
2. **Day 27: The Night Before** — A single scene in Gary's
   stable. Gary tells the player the real history of the
   Mascoteers — that the stables were once the Engineer's
   personal menagerie during the Nexon War, and the mascots
   were bred from pets that survived Nexon. **First direct
   mention of the Engineer by name in the game.**
3. **Day 28: The Grand Final — Three Rounds:**
   - **Round 1 vs Silver** (rematch; cleaner than Beat C)
   - **Round 2 vs Brindle** (grudge match if player won Beat B,
     mercy match if player lost Beat B)
   - **Round 3 vs The Masked One** — **mandatory forced loss.**
     The Masked One wins. She walks away without taking the
     trial's prize. Gary stares. Elara whispers: *"I have never
     seen that happen before."*
4. **Post-final scene — The Countermelody** — As the player
   exits the arena devastated, **the Engineer's voice speaks
   for the first time**. Not through a hologram. Through the
   Dischordia deck itself. He says one long line
   (`engineer_first_line`, see below). Then the player's deck
   **permanently gains a new card**: ***The Countermelody***
   (Legendary Light, Epic rarity, already in
   `dischordiaDeck.ts` as ch1 unlock).
5. **Cycle A finale cutscene** — A 30-second slideshow of the
   Engineer at his bench, smiling, tuning a mascot collar. The
   silent implication: the mascot he is tuning becomes the
   player's Day 1 starter. The Engineer looks up, and for a
   frame, he looks directly at the player. Fade to black.

**Beat D exit condition:**
- `mascoteer_trial_complete: true`
- `mascoteer_final_standing: 2` (always 2 — The Masked One always wins)
- `countermelody_card_acquired: true`
- `engineer_first_voice_heard: true`
- `cycle_a_complete: true`

**New dialog needed for Beat D:**
- 2 Gary Day 27 storytelling lines (short + long variants)
- 1 Silver Round 1 rematch line
- 2 Brindle Round 2 variants (grudge / mercy)
- 1 Masked One Round 3 single line
- 1 Elara *"I have never seen that happen before"* reaction line
- **1 Engineer first line** — his debut voice in the game

**The Engineer's first line** (write-in-voice):

> **The Engineer** (`engineer_first_line`, Act 1 Beat D debut):
> *"Hello, Potential. You've never heard me before. I've been
> watching since you drew The Question You Didn't Ask. I
> wanted to wait until you lost something that mattered before
> I spoke — losing a thing that matters is when you can first
> hear me clearly. You didn't win the trial. You were never
> going to win the trial. The Masked One was always going to
> win, because she was my favorite student, and I trained her
> to win. Her name is — was — not important yet. What matters
> is that you **lost the right battle**, and in doing so, you
> earned the Countermelody. The Countermelody is the card I
> played when I was the Prince and the Warlord came calling.
> It didn't save me. But it might save you. Keep it close.
> I'll be here when you need me again."* — **Delivery:**
> warm, academic, a little sad. Think of a professor who knows
> he's dead and is okay with that. The line ends with *"when
> you need me again"* — the word *"again"* is the hook.
>
> **Voice profile (new):** middle-aged male, slight European
> cadence (unplaceable), soft but precise. Recommend:
> `engineer_voice_profile` — author in VO Bible as entry 12.

**Length:** ~48 seconds. This is the longest new line in Act 1 and
anchors the Engineer character for the rest of the cycle.

---

### Act 1 Beat E — The Prince's Archive + The First Card

**Location:** Ark 1047 Archives (Prelude Beat J location, revisited)
+ flashback rooms (new art).
**Teacher NPC:** The Engineer (via deck narration).
**Primary system taught:** Dischordia card-game flashback mode —
the player plays historical card battles **as the Engineer** from
his memories.
**Length:** ~45 min.

**Opening:** After the Mascoteer finale, the player returns to the
Ark Archives. The Engineer's voice directs them to a sealed vault
the player couldn't access in the Prelude. Inside: a full
Dischordia starter deck labeled *"Kael, Age 12."*

**Cycle B is the Engineer's memory of his time as the Prince's
tutor.** The player plays three flashback battles as the
Engineer-as-teacher, with Kael (Age 12) sitting across from him at
a card table.

**Beat E content:**
1. **The Vault Scene** — Elara and The Human both watch the
   player open the vault. Both are quiet. The Engineer's voice
   plays directly into the player's head.
2. **Flashback Battle 1 — Kael's First Game** — The player is
   the Engineer teaching Kael how the game works. **Kael is a
   child in this scene and plays like one** — making obvious
   mistakes, asking earnest questions. The player is playing
   against a tutorial AI but the narration framing makes it feel
   intimate. Win/loss outcome doesn't matter narratively; what
   matters is that Kael **laughs** when he loses.
3. **Scene break — The Prince's Study** — The player walks around
   a low-poly memory reconstruction of Kael's childhood study.
   Hotspots reveal worldbuilding: Kael's favorite books, his
   mother's photograph (Captain Voss / Lyra Vox — **major seeding
   for Act 5**), a hand-carved wooden sword.
4. **Flashback Battle 2 — Kael vs The Tutor (Rematch, Age 14)** —
   Kael plays cleaner now. He has developed a signature card, **"The
   Prince's Gambit"** (Epic Dark), that will be one of the cards
   the player inherits into their deck later. The player-as-Engineer
   is meant to *lose this one* to validate Kael's growth.
5. **The Engineer reveals** — After Battle 2, the Engineer
   speaks a second long line (`engineer_beat_e_reveal`). He tells
   the player that the Warlord was born in the same palace as
   Kael — **they were childhood friends**. This is the first
   explicit statement of the Kael/Warlord bond in the main game.
6. **Flashback Battle 3 — Kael vs The Warlord (Age 16)** — A
   **forced draw**. The two best cards in Kael's deck and the two
   best in the Warlord's deck are tied. The card game ends in
   a stalemate. The player-as-Engineer watches from outside the
   table. No wincon; the scene ends when both decks are empty.
   This is the first **forced draw** the Dischordia engine
   supports and it must be implemented.

**Beat E exit condition:**
- `prince_archive_opened: true`
- `kael_flashback_1_played: true`
- `kael_flashback_2_played: true`
- `kael_warlord_draw_witnessed: true`
- `engineer_beat_e_reveal_heard: true`

**New dialog needed for Beat E:**
- 1 Engineer long line (`engineer_beat_e_reveal`) — ~40 sec
- 3 young Kael VO lines (requires new voice: child actor or
  pitch-shifted adult; `kael_age12_line_1/2/3`)
- 1 young Warlord VO line (new voice: similar treatment;
  `warlord_age16_line_1`) — her signature *"I love war"* from
  `warlord_fc_1` is authored in VO Bible entry 4 as an **adult**
  version of this young-Warlord line
- 1 Elara reaction line to witnessing the draw

**The Engineer's Beat E reveal** (write-in-voice):

> **The Engineer** (`engineer_beat_e_reveal`):
> *"I taught both of them. That's the thing I've never said to
> anyone, not even Elara, not even at the Tribunal. Kael and
> the Warlord — she wasn't called the Warlord yet, her name
> was Malkia — they grew up in the same palace, on the same
> rug, playing the same games. I taught them the same rules.
> They chose different meanings for the rules. That's what the
> Dischordia deck is, Potential: the same rules, read two
> different ways. One reading saves worlds. The other burns
> them. The real trick is that you can't tell which reading
> you're in until the last card is played. I taught them both,
> and I loved them both, and one of them killed the other, and
> I am the reason the loser went looking for a way to come
> back."* — **Delivery:** confessional. The word *"loved"*
> should crack slightly. The last sentence lands like a
> doctor telling a family.

**Length:** ~52 seconds.

---

### Act 1 Beat F — The Hollowing of Nexon

**Location:** Flashback — the city of Nexon (new art, major
cutscene budget).
**Teacher NPC:** The Engineer (narrator) + Elara (returns to the
narration as the City Planner who designed Nexon).
**Primary system taught:** **City Scale battle** — a new
Dischordia mode where the board is a city map and each card
represents a district. This is the first and only time the Act 1
card game runs at city scale.
**Length:** ~60 min.

**Opening:** Elara breaks her Beat E silence. *"Nexon was my
city. I designed the aqueducts. I designed the spiral plaza.
I designed the library where Kael read to his mother. The
Warlord's first attack was the aqueducts. I never forgave her.
I'm telling you now because you're about to watch it happen."*

**Beat F content:**
1. **Elara's Nexon monologue** (new dialog, ~40 sec) — the
   City Planner reveal. Elara was Nexon's chief architect. This
   is the moment the player realizes Elara is not just a ship AI
   — she is a **transferred human**, and Nexon was her home.
2. **City Scale Battle 1 — The Aqueducts** — The player plays
   as the Engineer defending the aqueducts. The Warlord's deck
   plays as the opponent AI. The battle is a **forced loss** in
   the narrative sense — the player can delay the fall but cannot
   prevent it. Each aqueduct card that burns plays a short
   audio clip of water stopping.
3. **Scene transition — Streets of Nexon burning** — 60-second
   slideshow of Nexon's fall, scored to a new cut of SiH
   *"The Lamp"* (if licensable).
4. **City Scale Battle 2 — The Spiral Plaza** — Second forced
   delay. Kael (now an adult) appears on the battlefield as an
   allied card. The player can play Kael to buy 3 turns but it
   will **cost them a permanent card from their deck**.
5. **The Engineer's Choice** — A mythic DialogWheel choice:
   - *Sacrifice Kael's card to save the Plaza* (→ Dark + Plaza
     stands + Kael is wounded for Act 1 Beat I)
   - *Sacrifice the Plaza to save Kael's card* (→ Light + Plaza
     burns + Kael is unharmed + the player keeps the card for
     the rest of the game)
   - *Hold both — refuse to choose* (→ mythic; requires 3-second
     hold; neither saves; **the Engineer himself steps onto the
     board as a card and sacrifices himself to hold both for one
     more turn**. This is a foreshadow of Beat I.)
6. **End of Beat F — The Library Scene** — The player walks
   through the burning library of Nexon. In the rubble is a
   single book. The book is titled *"The Witnessing."* The
   player can pick it up. Picking it up plays a 15-second Elara
   voiceover (`elara_beat_f_witnessing_book`) where she
   acknowledges for the first time that **she is writing the
   book the player is reading right now** — a fourth-wall
   crack that will fully open in Act 4.

**Beat F exit condition:**
- `nexon_aqueducts_witnessed: true`
- `nexon_plaza_outcome: 'kael_saved' | 'plaza_saved' | 'engineer_sacrificed'`
- `witnessing_book_acquired: true`
- `elara_nexon_architect_revealed: true`

**New dialog needed for Beat F:**
- 1 Elara Nexon monologue (~40 sec) — **new long line**
- 3 Warlord aqueduct-battle barks (taunts, short)
- 1 Kael adult voice line (his debut as adult; see dialog spec below)
- 1 Engineer sacrifice line (for the mythic refuse-to-choose path)
- 1 Elara *"The Witnessing book"* line (~15 sec)

**Kael's adult debut line** (write-in-voice):

> **Kael (adult)** (`kael_adult_debut_beat_f`):
> *"Engineer. I'm here. The plaza is burning. My mother's
> library is burning. I can hold the spiral for three turns.
> Not four. Decide what you want to save, and decide quickly,
> because the Warlord has the Countermelody too and she just
> played it."* — **Delivery:** per VO Bible entry 1 (Kael),
> tactical, tired, with a thread of grief. The word *"mother"*
> drops in volume briefly.

**Length:** ~28 seconds.

---

### Act 1 Beat G — The Battle of Nexon (Survival Puzzle)

**Location:** The Vortex's First Manifestation (a new battlefield
— space above Nexon, in flashback).
**Teacher NPC:** The Engineer (narrator) + Elara (returning to
fight her own lost city).
**Primary system taught:** **Board-wipe survival puzzle mode** —
the game teaches the player that **not-winning is a valid
outcome**.
**Length:** ~45 min.

**Opening:** The Warlord has been defeated in Cycle B (F2). But
as Nexon falls, **the Vortex manifests for the first time** — a
cosmic unmaker that eats cities, souls, and decks. This is
Cycle C1 in the original TCG spec; the Witnessing makes it Act 1
Beat G.

**Beat G is the first battle the player is told they cannot win.**
It is a **survival puzzle**. Every 4 turns, the Vortex board-wipes
everything on the field. The player's job is to **survive as many
board-wipes as possible**. The longer they survive, the more Light
they seed into the Ark's Living Universe (writes to community
state).

**Beat G content:**
1. **The Vortex's first form** — A giant, slow, hungry card
   entity. The board renders in cosmic-horror style; each board-
   wipe is shown as a tide pulling every card into a central
   singularity.
2. **The Standstill card** — During Beat G, the Engineer grants
   the player a unique card, *The Standstill* (Epic Light). Once
   per match, *The Standstill* **delays a loss by 1 turn**. The
   player cannot use it to win — only to survive one more board-
   wipe. This is the first time the game teaches **delay as a
   victory condition**.
3. **Elara's return** — Mid-battle, Elara's voice breaks the
   Engineer's narration. *"I can fight this. Let me fight this.
   I designed the aqueducts. I can re-plumb the boundary."* For
   a brief scene, **Elara takes over the player's deck** — she
   plays 2 rounds as an AI-pilot, trying to reconfigure the
   board's water/energy routing. Her rounds succeed at delay,
   but she cannot close out the win either. She returns control
   to the player with the words: *"I am so sorry. I thought I
   could do more."*
4. **Record-and-release** — The player plays until they lose.
   The **survival count** is recorded in `livingArkState.
   nexon_survival_turns`. Every turn survived past 8 grants a
   bonus card at the start of Beat H.
5. **The Engineer's framing** — Throughout the battle, the
   Engineer narrates in present tense — he is not remembering
   this, he is *watching* it with the player. At the end, he
   says: *"That was the day we learned what the Vortex was.
   That was the day I started building the hellbox. That was
   the day Elara decided to upload herself to a ship."*

**Beat G exit condition:**
- `nexon_survival_turns: number` (≥1)
- `standstill_card_acquired: true`
- `vortex_first_form_witnessed: true`
- Living Universe: +`nexon_survival_turns` Light community tokens

**New dialog needed for Beat G:**
- 1 Elara *"let me fight this"* takeover line (~15 sec)
- 1 Elara *"I am so sorry"* hand-back line (~8 sec)
- 1 Engineer framing line at end of battle (~20 sec)
- 3 Vortex bark lines (board-wipe warning variants; ambient
  cosmic-horror whisper tier)

---

### Act 1 Beat H — The Warlord (Fragmented)

**Location:** The Warlord's ruined throne-room (flashback, post-
Nexon).
**Teacher NPC:** The Engineer + The Warlord (duet narration —
**first time two speakers trade dialog inside a card battle**).
**Primary system taught:** **Instant-kill cards** (the Warlord's
"I Love War" attack-rush). The player learns what happens when
the game does not let them play defensively.
**Length:** ~60 min.

**Opening:** After the Vortex's first form, the Warlord's forces
have been fragmented. The Engineer, Kael, and Elara hunt her to
her ruined throne-room. The player-as-Engineer confronts her in
a card battle.

**Beat H content:**
1. **The Throne Room Walk-In** — A slow walk-in cutscene. The
   Warlord is already sitting, already smiling, already has her
   deck in hand. She says: *"I love war."* (her canon first
   line, `warlord_fc_1`).
2. **The "I Love War" battle** — A card battle where the
   Warlord's deck is built around **attack-rush + instant-kills**.
   She plays fast, plays lethal, and **removes player cards from
   the game permanently** (not just from the current match).
   Each card lost is **lost for the rest of Act 1** — the
   player's deck shrinks. They cannot win by building up; they
   have to win by closing fast.
3. **The Converter card** — The Warlord's signature card,
   *The Converter* (Legendary Dark), is canon in
   `dischordiaDeck.ts`. During the battle, the Warlord plays
   *The Converter* at turn 4 and **converts one of the player's
   cards into her own**. The converted card is the one the
   player used most often in Cycle A. This is targeted: the game
   tracks the player's habit.
4. **Mid-battle dialog duet** — Throughout the battle, the
   Engineer and the Warlord **trade dialog between turns**. She
   taunts him, he answers. The player reads their history in
   real time:
   - **Warlord:** *"Engineer. You taught me this move. Do you
     remember teaching me this move?"*
   - **Engineer:** *"I remember. I remember every time you
     smiled when you learned it."*
   - **Warlord:** *"I'm still smiling."*
   This is canon for the Witnessing; **the player is watching
   two people who loved each other destroy each other.**
5. **The finishing move** — The player wins the battle (this
   one is a real win, not a forced outcome — though hard).
   The Warlord dies on the battlefield, on-screen, to the
   player's final card. **Her last words** are whispered so
   quietly the player has to lean in: *"I loved him. I was
   never going to win either. Tell Kael I'm sorry. I'm not
   going to stay dead. My pattern is in the swarm."* The line
   seeds the rev 4 canon — her nano-swarm survives her.
6. **Post-battle — Kael arrives** — Kael walks into the throne
   room to find the Warlord dead and the Engineer kneeling by
   her body. Kael says a single line (new dialog). The scene
   ends with Kael, the Engineer, and Elara standing in silence
   over the Warlord's body. The screen fades.

**Beat H exit condition:**
- `warlord_fragmented_defeated: true`
- `converter_card_played_against: true`
- `cards_lost_permanently: number` (whatever the player lost)
- `warlord_last_words_heard: true`
- `kael_warlord_body_scene_witnessed: true`

**New dialog needed for Beat H:**
- ~6 Warlord/Engineer duet lines during the battle (short, alternating)
- 1 Warlord final whisper line (~10 sec)
- 1 Kael line over the body (~15 sec)
- 1 Elara silent-reaction stage direction (no audio; she just
  goes quiet)

**The Warlord's final whisper** (write-in-voice):

> **The Warlord** (`warlord_beat_h_last_words`):
> *"I loved him. I was never going to win either. Tell Kael
> I'm sorry. I'm not going to stay dead. My pattern is in
> the swarm."* — **Delivery:** per VO Bible entry 4
> (Warlord), but whispered. Almost inaudible. Final sentence
> is a smirk, not a threat.

**Length:** ~12 seconds.

**Kael's throne-room line** (write-in-voice):

> **Kael** (`kael_beat_h_throne_room`):
> *"You didn't have to make me see this. I asked you to take
> me with you. I asked you to let me fight her. You said no
> because you were trying to protect me from the thing I
> needed to see. Engineer — don't do that to me again."* —
> **Delivery:** per VO Bible entry 1 (Kael), but softer. He
> is not angry; he is grieving.

**Length:** ~16 seconds.

---

### Act 1 Beat I — The Transference (Forced Loss)

**Location:** The Warlord's ruined throne-room (continuation) →
**inside Agent Zero's mind** (new abstract battlefield).
**Teacher NPC:** The Engineer (doomed narrator) + **Vex Solène**
(her first scene-partner appearance — she is briefly co-conscious
with the Engineer during the transference).
**Primary system taught:** **Sacrifice-as-win mechanic** — the
player learns that losing all their cards is the **win condition**.
**Length:** ~45 min.

**Opening:** The Engineer stands from the Warlord's body. He looks
at Kael. He looks at Elara. He says: *"Her nano-swarm is in Agent
Zero. It's been in her since Nexon. The Warlord built Zero as her
fail-safe — if anyone ever recovered her, she would still be the
Warlord's weapon. I'm the only one who can remove it. I designed
the transference protocol for this. I never tested it at this
scale. Kael — I need you to forgive me for what I'm about to do
to someone you love."* (New Engineer line, ~22 sec.)

Kael says one word: *"Why?"*

The Engineer says: *"Because she asked me to."*

The scene cuts to **Agent Zero's mind as a battlefield**.

**Beat I content:**
1. **Inside Agent Zero's Mind** — The battlefield is abstract:
   a starfield made of memories. The Engineer is one side of
   the board. The Warlord's nano-swarm is the other side. **Agent
   Zero herself is on the Engineer's side of the board, bound and
   silent.**
2. **The transference card game** — This is the **rev 4 mechanic**
   established earlier in this plan file:
   - The Engineer's deck shrinks by one card per turn permanently.
   - Every card the Engineer loses is added to Agent Zero's side
     of the board as a reinforcement against the nano-swarm.
   - The player cannot win the battle *as the Engineer*. The
     player can only lose gracefully.
   - The **win condition** is: empty the Engineer's deck while
     Agent Zero's side is strong enough to defeat the swarm on
     its own.
3. **Mid-battle duet — the first Vex dialog** — As the Engineer
   loses cards, **Agent Zero slowly wakes up**. She speaks for
   the first time as a scene partner (not archival). She is
   confused. She doesn't know who the Engineer is. She says:
   *"Who are you? Why are you doing this? Stop. I don't want
   this. I don't know you."* The Engineer answers: *"I know.
   You don't have to know me. You just have to outlive me."*
4. **The forced loss / forced win** — The Engineer's deck
   empties. His last card plays itself: ***The Friend I Saved***
   (Mythic Light), named per rev 4 canon correction. The card's
   art is the Engineer's face, eyes closed, smiling faintly.
   When it enters Agent Zero's side of the board, **her portrait
   resolves for the first time with a new name plate:
   Vex Solène**. The nano-swarm collapses. The battle ends with
   the Engineer's side empty and Vex's side victorious.
5. **The Engineer's final words** — As the battlefield fades,
   the Engineer speaks one last line (`engineer_final_words`).
   This is his farewell to Kael, Elara, and the player.
6. **Return to the throne-room** — The battlefield dissolves.
   The player is back in the throne-room. The Engineer is on
   the floor next to the Warlord, not breathing. Agent Zero /
   Vex Solène is alive, unconscious, across the room. Kael is
   holding both of them. Elara is whispering something the
   player can't hear. The scene fades to black.

**Beat I exit condition:**
- `engineer_transference_complete: true`
- `engineer_dead: true` (canonical flag)
- `vex_solene_awakened: true`
- `friend_i_saved_card_in_deck: true`
- `kael_beat_i_grief_state: true`
- **Living Universe:** +20 Light community tokens (this is the
  highest single-event community tilt in Act 1)

**New dialog needed for Beat I:**
- 1 Engineer pre-transference speech (~22 sec)
- 1 Kael single word *"Why?"* + 1 Engineer reply *"Because she asked me to"*
- 3 Vex Solène waking lines (~20 sec total) — **her first scene-partner dialog in the game**
- 1 Engineer final words (~30 sec)
- 1 Elara quiet-reaction line (~5 sec)

**The Engineer's final words** (write-in-voice):

> **The Engineer** (`engineer_final_words`):
> *"Kael. Elara. Potential. I don't have much voice left. I
> need to say three things. First: I forgive the Warlord. She
> was not wrong about everything. I hope someone tells Malkia
> that. Second: Kael, the woman on the floor is going to wake
> up. She will not remember me. Do not try to make her
> remember. She needs to be allowed to become herself. Her
> name — her new name — will come to her in her own time.
> Third: Potential, the card you're about to see — *The Friend
> I Saved* — is not in your deck as a gift. It is in your
> deck as a **debt**. You owe the woman on the floor a life,
> because I just spent mine on hers. Pay it forward when she
> asks. She will ask eventually. I'm... I'm going now. I'm
> not afraid. I was afraid of the hellbox. I'm not afraid of
> this. This was the right card to play."* — **Delivery:** the
> voice slowly fades out. The final sentence is almost
> whispered. The audio engineer should add a very subtle
> reverb that grows through the line, as if his voice is
> becoming the room itself.

**Length:** ~48 seconds.

---

### Act 1 Beat J — The Authority's Tribunal + Last Words Slideshow

**Location:** The Authority's courtroom (new art, high-budget
cutscene location).
**Teacher NPC:** The Authority (prosecution), Elara (defense),
The Human (witness), **no Engineer** — he is dead.
**Primary system taught:** **Trial-format battle** — jurors,
evidence cards, a prosecutor deck. Reused in Act 3 faction
tribunals and in Act 4 cell 3.
**Length:** ~60 min.

**Opening:** A time jump. Kael, Elara, and the Engineer's corpse
are transported to the Authority's courtroom. Kael is on trial
for the Warlord's death. The Engineer is posthumously charged
with "unauthorized cognitive transference" — a capital crime in
the Authority's system. **The defendant is a dead man.** Kael is
forced to watch.

Elara, now the Engineer's advocate, takes the stand.

**Beat J content:**
1. **The Tribunal format battle** — A court proceeding rendered
   as a card battle. Jury cards, evidence cards, prosecution
   deck (Authority), defense deck (Elara, piloted by player).
   The player plays evidence cards to defend the Engineer's
   actions. Each card played triggers a short Authority
   counter-argument.
2. **Elara in the deck** — Per original Witnessing spec, **Elara
   is a card in the Tribunal's deck**. When she is drawn, her
   portrait appears on the card face and **she flinches on the
   player's shoulder** in the NarratorSlot. She says: *"That
   was my bill. I signed that bill. That card has my name on
   it."* This is her confession that she was a Senate architect
   whose laws are being used to prosecute her dead friend.
3. **The Human in the witness stand** — For the first time, The
   Human appears **as a visual character** — not just a voice.
   He walks to the witness stand in a slideshow still. He is
   older than the player expected, tired, in a worn detective's
   coat. He testifies. His testimony is the rev 4 canon line:
   *"I investigated the Engineer's transference. I closed the
   case. I believed he survived. I was wrong. I spent 17,000
   years being wrong, and I'm here today to put the truth on
   the record: the Engineer died in Agent Zero's mind, and
   nothing in the Authority's case book accounts for what he
   died doing. I recommend the charge be dismissed."*
4. **The Last Word card** — The player's final card is
   ***The Last Word*** (Mythic Light). Its canonical effect,
   per original Witnessing spec: **playing the card triggers
   the Last Words slideshow**. This is the first slideshow the
   game has ever shown the player. It plays regardless of
   whether the trial was won or lost — the slideshow is the
   real ending of Act 1.
5. **The Last Words slideshow** — 15 frames, ~3m 30s. The
   slideshow is a **retcon sequence**: every scene the player
   played in Act 1, shown from the Engineer's point of view,
   with his Last Words monologue overlaid. The monologue
   re-contextualizes every beat: the Mascoteer trial was his
   memory of teaching Vex (as The Masked One), Cycle B was his
   memory of teaching Kael, Cycle C was his plan for the
   transference from the start. **The player realizes they
   have been playing inside the Engineer's memory of his own
   final week, told in the order he chose to remember it.**
6. **The Tribunal verdict** — Last frame of the slideshow. The
   Authority says: *"The charge is dismissed. The Engineer is
   remanded to history. This court is adjourned."* Kael is
   released. Elara is silent. The Human is gone from the
   courtroom. **Act 1 ends.**

**Beat J exit condition:**
- `tribunal_verdict_delivered: true`
- `last_words_slideshow_watched: true`
- `elara_as_tribunal_card_witnessed: true`
- `the_human_first_visual_appearance: true`
- `act_1_complete: true`
- **Act 2 unlocks:** Crafting, Chess, Collector's Arena

**New dialog needed for Beat J:**
- Authority prosecution deck — ~8 short bark lines (new voice:
  `authority_voice_profile`, cold, institutional, gender-neutral)
- Elara *"That card has my name on it"* flinch line (~8 sec)
- 1 Elara long defense monologue (~45 sec)
- 1 The Human witness stand testimony (~50 sec) — **his first
  visual appearance line**
- 1 Authority final *"remanded to history"* line (~15 sec)
- **Engineer's Last Words monologue for slideshow** — a long
  narration track that plays over the 15 slideshow frames,
  approximately 3 minutes, broken into 15 stanzas (one per
  frame). This is the longest single VO piece in Act 1.

**The Engineer's Last Words monologue** (stub — full text to be
authored in a dedicated writing session, but the structure is:

> **Frame 1:** *"These are my last words. I am speaking them
> from inside a card I haven't played yet."*
> **Frames 2-4:** (The Mascoteer trial, re-read as teaching Vex)
> **Frames 5-7:** (Cycle B, re-read as teaching Kael)
> **Frames 8-10:** (Cycle C, re-read as planning the transference)
> **Frames 11-13:** (The throne-room, the transference, the fall)
> **Frame 14:** *"If you are hearing this, Potential, it means
> you played *The Last Word*. I left it in your deck so that
> when you won my trial, you would win it with my voice and
> not the Authority's."*
> **Frame 15:** *"I'm not here. I never was. I was the rules
> you played by. Go write your own rules now. Goodbye."*

The slideshow frames themselves need art commissioning — **15
keyframes + Ken-Burns pans**. Art references: the Prelude
VOICE_OVER_BIBLE portrait list + new painterly renders of the
Warlord's throne room, Agent Zero's mindspace, and the
Authority's courtroom.

**Length:** ~3 min 30 sec for the full monologue.

---

### Act 1 — Summary Tables

#### Act 1 Exit State (Act 2 Seed)

The following flags are written at the end of Beat J and read by
Act 2 Cycle A as its opening state:

```typescript
export type Act1ExitState = {
  act_1_complete: true;
  cycle_a_complete: true;
  cycle_b_complete: true;
  cycle_c_complete: true;
  engineer_dead: true;
  vex_solene_awakened: true;
  kael_released_from_tribunal: true;
  the_human_visual_revealed: true;
  elara_nexon_architect_revealed: true;

  // Permanent deck modifications from Act 1
  countermelody_card_in_deck: true;
  standstill_card_in_deck: true;
  friend_i_saved_card_in_deck: true;
  last_word_card_in_deck: true;
  cards_lost_to_converter: number;

  // Polarity state at end of Act 1
  polarity_light: number;
  polarity_dark: number;

  // Choices that will echo in later acts
  nexon_plaza_outcome: 'kael_saved' | 'plaza_saved' | 'engineer_sacrificed';
  quinn_outcome: 'helped' | 'ignored' | 'reported';
  crew_role: 'medical' | 'combat' | 'exploration';  // inherited from Prelude
  first_light_dark_choice: 'forgive' | 'condemn' | 'defer';  // from Prelude

  // Living Universe tilts written during Act 1
  act_1_light_tokens_contributed: number;
  act_1_dark_tokens_contributed: number;

  // Masked One foreshadow flags (Vex Solène seed)
  masked_one_visits: number;  // 0..3
  masked_one_first_line_heard: boolean;
};
```

#### New Dialog Totals for Act 1

| Speaker | Lines | Approx. length |
|---|---|---|
| Elara | ~18 (Beat A reflection + Beat B/C/D/F reactions + Nexon monologue + Witnessing book + Tribunal defense + flinch) | ~5 min 30 sec |
| The Engineer (new voice) | ~8 (debut + reveal + final words + Last Words slideshow monologue) | ~6 min 30 sec |
| The Human | ~2 (Tribunal testimony + Nexon silent-reaction lines) | ~1 min |
| Vex Solène / Masked One | ~5 (Beat C Masked One + Beat I waking lines) | ~50 sec |
| Kael (adult) | ~4 (Beat F plaza + Beat H throne room + Beat I "why" + Beat J silent) | ~1 min 10 sec |
| Warlord | ~8 (Beat H duet barks + final whisper + Beat E young variant) | ~2 min |
| Kael & Warlord (young voices) | ~4 (Beat E flashback lines) | ~30 sec |
| Gary | ~2 (Day 27 story + final coaching) | ~30 sec |
| Silver, Brindle, Quinn, Masked One | ~10 rival lines total | ~2 min |
| Authority (new voice) | ~10 tribunal bark/prosecution lines | ~2 min |
| Announcer (Battle Arena) | ~3 lines | ~30 sec |
| Zephyr-9 | 0 (Act 1 only teaches ground combat, no Tower Defense) | — |
| Meme, Vortex barks | ~6 ambient lines | ~1 min |
| **Total** | **~80 new lines** | **~23 min of new VO** |

**Recording plan:** 5-6 ElevenLabs sessions.
- Session 1: Elara (existing clone, 18 lines, ~1 hour)
- Session 2: **The Engineer (new voice clone)** — this is the
  biggest new voice commission of Act 1; ~8 lines including the
  3.5-minute slideshow monologue. Allow ~3 hours including
  direction. Voice reference: VO Bible entry 12 (to be authored).
- Session 3: The Human, Vex Solène, Kael, Warlord — existing
  profiles, ~19 lines combined, ~2 hours
- Session 4: Young Kael, young Warlord — new pitch-shifted
  variants of existing voices, ~4 lines, ~45 min
- Session 5: Gary, Silver, Brindle, Quinn, Masked One (Vex), Authority, Announcer,
  Vortex barks — multi-voice session, ~25 lines, ~2 hours
- Session 6: Pickups + slideshow sync pass

#### New Art Commissioning for Act 1

| Asset | Count | Purpose |
|---|---|---|
| Card faces (new) | 6 (Countermelody, Standstill, Friend I Saved, Last Word, First Card, Converter opposition art) | Dischordia deck |
| Room backdrops | 5 (Gary's Stables, Battle Arena, Prince's Study, Nexon city, Warlord throne) | Beat locations |
| Mind-space abstract battlefield | 1 | Beat I (inside Agent Zero's mind) |
| Authority courtroom | 1 | Beat J |
| Last Words slideshow keyframes | 15 | Beat J finale |
| Character portrait updates | 4 (Engineer debut, young Kael, young Warlord, Masked One Vex) | NarratorSlot |
| The Human first visual | 1 | Beat J witness stand |
| **Total** | **~33 new art assets** | |

#### Act 1 Test Checklist

**Unit:**
- [ ] Beat A-J transitions fire on correct exit conditions
- [ ] Mascoteer 28-day loop compresses correctly into Beats A-D
- [ ] Flashback Battle 3 (Beat E) ends in forced draw
- [ ] City Scale Battle (Beat F) renders the Nexon map
- [ ] Beat G survival puzzle correctly awards bonus cards based on `nexon_survival_turns`
- [ ] Beat H Converter permanently removes the player's most-used card
- [ ] Beat I transference empties the Engineer's deck while filling Vex's side
- [ ] Beat I writes `engineer_dead: true` and `vex_solene_awakened: true` atomically
- [ ] Beat J Tribunal battle loads Elara as a jury card correctly
- [ ] *The Last Word* card triggers the slideshow on play
- [ ] Act 1 exit state is written to Act 2 seed

**Integration:**
- [ ] Full Act 1 playthrough from Beat A to Beat J in one save
- [ ] Act 1 runs after Prelude without save corruption
- [ ] Act 1 exit state is correctly read by Act 2 Cycle A opener
- [ ] Polarity state at end of Act 1 matches the sum of choices
- [ ] Living Universe tokens written to community state

**Narrative:**
- [ ] Players correctly identify Beat I as a sacrifice, not a betrayal
- [ ] Players correctly identify The Masked One as Vex Solène in retrospect after Act 3 F3
- [ ] The Engineer's debut line (Beat D) reads as warm, not ominous
- [ ] The Warlord's final whisper (Beat H) reads as tragic, not triumphant
- [ ] The Human's Beat J visual appearance feels earned, not abrupt
- [ ] The Last Words slideshow re-contextualizes Act 1 without breaking the rhythm of the Tribunal battle
- [ ] ≥70% of players can name "the Engineer is dead" as a plot point after Beat I

**Performance:**
- [ ] Beat I's mind-space battlefield renders at ≥30 fps on mobile
- [ ] Beat J's 15-frame slideshow preloads before the Tribunal battle ends
- [ ] Act 1 total asset download ≤80 MB on top of Prelude
- [ ] No audio dropouts during the Engineer's 3.5-minute Last Words monologue

---

### Act 1 Stop Conditions

If during Act 1 implementation the team discovers that:

- The Dischordia card engine cannot support forced-loss mechanics
  (Cycle C3 transference depends on this)
- The trial-format battle (Beat J) cannot be rendered in the
  existing card engine
- The Engineer's new voice profile cannot be commissioned at the
  required emotional range
- The Last Words slideshow art cannot be produced at ~15 keyframes

...the team should pause and escalate. These are architectural
signals that Act 1 needs replanning. Do not paper over. Fix or
replan.

---

## Part V Summary — What Part V Adds to the Plan

Part V turns Parts I–IV from a design document into a buildable
queue of work. After Part V:

1. **(D) The Vertical Slice** gives the team a 35–45 minute
   playable proof-of-concept with six clear exit criteria that
   validate the four load-bearing claims of the Witnessing
   architecture.

2. **(C) Prelude Implementation Spec** gives the team the file
   list, flag schema, component props, state machine transitions,
   and test checklist to ship all 10 Prelude beats.

3. **(B) Missing Prelude Dialog** gives the team the actual
   written script for all ~27 new Prelude lines, in voice,
   with performance direction and a recording session plan.

4. **(A) Act 1 Beat Breakdown** gives the team 10 Act 1 beats
   (A–J) with the same granularity as the Prelude, including
   ~80 new dialog lines in voice for the Engineer, Vex Solène,
   young Kael, young Warlord, and the Tribunal supporting cast.

Combined with Parts I–IV, the plan now contains:

- **20 fully designed beats** (10 Prelude + 10 Act 1)
- **~107 new dialog lines** written in voice
- **~35 new art assets** itemized (pod card + Prelude assets +
  Act 1 assets)
- **6 complete UI component specs** (NarratorSlot, DialogWheel,
  ThoughtVirusMeter, HellboxEncounter, PreludeRoomView, BeatJArchives)
- **Full Prelude flag schema + Act 1 exit state schema**
- **A vertical slice with exit criteria**
- **Test checklists for Prelude and Act 1**
- **Stop conditions for both**

Acts 2, 3, 4, 4.5, 5, and Endgame still need the same
beat-by-beat treatment. Part V (A) shows the format. Each
subsequent act is equivalent work to Act 1. The shortest path
from this plan to a shippable game is:

1. Build the Vertical Slice (Part V (D)) — 2 weeks
2. Expand the Vertical Slice to the full Prelude using Part V (C) — 4-6 weeks
3. Record Part V (B) dialog and commission Part V (A) art — 3 weeks in parallel
4. Build Act 1 using Part V (A) — 8-12 weeks
5. Author Act 2-5 beat breakdowns in the Part V (A) format — 4 weeks design work
6. Build Acts 2, 3, 4, 4.5, 5, Endgame — remaining production

The plan is now **executable**. The hard design work is done.
The remaining work is writing, recording, art, code, and
playtesting — all well-understood production tasks with known
shapes.

---

# Part VI — Canon Expansion (Rev 6)
## The Advocate, The Antiquarian, The Epoch Witness System, The Breeding Program, Seed→Echo→Revelation, and Breathing Room

## Context for Part VI

Three new design documents have been added to the canon:

1. **The Epoch Witness System** — an asynchronous governance
   campaign of ~40 signature votes across all Five Ages. Optional,
   72h–7d voting windows. Archetype-locked options. Shadow Tongue
   reality-editing. Integrates with every existing game mode.

2. **The Advocate's Box** (design doc v1) — the Sacrum of Severed
   Silk acquisition arc. Blood Weave magic system. Demonic
   incursion expansion. Hierarchy of the Damned corporate
   structure. Locke negotiation. Horror Timeline. Sacred Chamber
   room. Seven ritual types. Demon summoning minigame.

3. **The Advocate's Testament** (design doc v2, supersedes v1
   where they conflict) — **the Epoch 2 Trap**: Advocate + Silence
   travel to New Babylon, Advocate frees the Samsara Twins from
   the Authority's mainframe, civil war erupts, the Necromancer
   possesses the Silence's body via Transmutation of the Living
   Body, the Blood Weave corrupts through entanglement, the
   Advocate deliberately shatters herself — **one shard to every
   Ark's substrate layer, one shard to the Sacrum moving forward
   through time**. Also: the full Breeding Program / Bene Gesserit
   multigenerational genetic planning layer tied to Blood Weave
   crystal production.

**The three source docs are preserved verbatim in the user's
conversation message and should be saved to
`docs/design/EPOCH_WITNESS_SYSTEM.md`,
`docs/design/ADVOCATES_BOX_DESIGN.md`, and
`docs/design/ADVOCATES_TESTAMENT.md` after plan exit.** They are
not inlined into this plan file because of size; Part VI is the
**synthesis layer** that tells you where each piece fits, what it
changes, and how to resolve contradictions with Parts I–V.

**User directives for Part VI:**

1. **Synthesize** the three new docs into the existing plan.
2. **Identify where each piece fits** across the act structure.
3. **Add the Seed→Echo→Revelation template** as the canonical
   discovery-arc pattern for every major feature.
4. **Identify 9 features currently unlocking without narrative
   justification** and retrofit each with a Seed→Echo→Revelation arc.
5. **Add the Breathing Room mechanic** to onboarding — the first
   hour currently has an information avalanche.
6. **Point out contradictions** with the existing Rev 5 canon and
   propose resolutions.

---

## Section 1 — Rev 6 Canonical Corrections

### 1.1 The Advocate — Full Canon

**The Advocate** is the **Ninth Ne-Yon** — the Voice of the Ne-Yons,
master diplomat and reality-shaper who became something else over
six hundred years of war against the Hierarchy of the Damned. She is
currently **shattered**, not dead. Her mind is distributed across
every Inception Ark's substrate layer, plus one sealed vessel
moving forward through time: **the Sacrum of Severed Silk**.

**Physical canon (all prompts, all appearances):** Cobalt blue skin,
completely bald, amber-red eyes (were gold before her soul-trade
with the Master of R'lyeh), deep navy hooded cloak pooling into
shadow. She holds the Sacrum of Severed Silk in both open palms,
throwing crimson light upward across her face. She never looks at
the camera. She looks at what she is holding. **Always.**

**Abridged timeline (full version in source docs):**

- **Year 15,900 A.A.** — Rises as Ne-Yons' spokesperson.
- **Year 16,000 A.A.** — Builds the Empire of Shadows, rules seven
  galaxies from the Throne of Illusions. Eyes gold. Soul intact.
- **Year 16,200 A.A.** — The Hierarchy rebels against her bindings.
  Syl'Vex the Corruptor (her dark mirror) turns three of her own
  generals through **genuine friendship**, not threats. This wound
  she carries into everything after.
- **Year 16,400 A.A.** — Empire collapses. She makes the pact.
- **Year 16,500 A.A.** — **Sacrifices her soul to the Master of
  R'lyeh** in exchange for the Blood Weave. Eyes turn red at the
  instant of transfer. The Blood Weave requires someone with
  nothing left to lose; she has nothing left to lose.
- **Years 16,550–16,700 A.A.** — Wars against the Hierarchy.
  Significant victories. Each use of the Blood Weave costs her
  humanity, memories, and eventually something she does not have
  a name for.
- **Year 16,700 A.A.** — Battle of the Seventh Binding. She seals
  the **Sacrum of Severed Silk** herself — one fragment of
  pre-corruption Blood Weave, one shard of her own consciousness
  — and **sends it forward through time**. She does not know
  when or to whom it will arrive. She fights the rest of the
  battle on the certainty that it will.
- **The Fall (~17,034 A.A.)** — Inception Arks launch. She does
  not board one. She does not sleep.
- **Epoch 2, ~tens of thousands of years post-Fall** —
  **The Trap**. (See 1.1.1 below.)

### 1.1.1 The Epoch 2 Trap — Canonical Account

This is the single most important new lore beat in Rev 6. It
retroactively explains **how the Ark substrate layer came to
contain Advocate fragments**, how the Necromancer achieved a form
of immortality, and why the Silence/Necromancer identity swap is
canonical going forward.

**Setup:** The Syndicate of Death in New Babylon is led by six
pairs of immortal twins in silver suits — Memory and Ending,
Commerce, Security, Information, Resources, Legacy. There is a
**seventh pair** absent from operational records: **Samsara and
Nirvana** (the cycle, and the ending of the cycle). They were
two of the six citizen-minds fused into the Authority's
mainframe when it was built. The Authority governs New Babylon
through six fused consciousnesses. **Two of them are Syndicate
royalty, imprisoned.** They have been powering New Babylon's
managed reincarnation cycle for millennia. They have been
screaming. The Authority processes their distress as background
signal. The Syndicate's multi-thousand-year service agreement
with the Authority was a negotiation to retrieve their twins.

**The Advocate's mission:** She and the Silence (Sixth Ne-Yon)
travel to New Babylon as diplomats in the new era. Her real
purpose — studying a Blood Weave-adjacent resonance in the
Authority's mainframe to reinforce degrading bindings. The
Silence's real purpose — finding what the Authority has been
instructed to never say.

**The Decision:** Inside the Crimson Chambers, the Advocate finds
Samsara and Nirvana. She does not ask the Silence. **One Blood
Weave command. Three seconds. They are freed.**

**The Consequence:** Two of six minds powering the Authority are
suddenly absent. The Authority, running on four minds,
destabilizes. New Babylon's reincarnation cycle breaks. Tens of
millions of citizens simultaneously access every life they were
supposed to forget. **A Very Civil War.** Samsara and Nirvana
vanish into the chaos, free for the first time in millennia.

**The Retreat:** Exits blocked. The Advocate and the Silence go
deeper into the Authority's architecture, looking for another
path out. They enter the **Matrix of Dreams** — the Necromancer's
territory since the Fall of Reality. He has had tens of thousands
of years to study every fold.

**The Possession:** The Necromancer does not attack the Advocate
directly — Zyr'Koth's research shows direct contact with the
Blood Weave risks consuming the attacker. Instead, he attacks the
Silence. Inside the Matrix — a consciousness archive at its core
— she is uniquely exposed. He performs the **Transmutation of
the Living Body**: an ancient working that rewrites the physical
vessel while the consciousness inside is too overwhelmed to
notice. **He possesses her body. Not temporarily. Not partially.
The body is transmuted and occupied. The Silence — the actual
Sixth Ne-Yon — is subsumed inside her own body. Not dead.
Trapped. Unable to speak. Listening to everything.** He has all
her memories, all her access, all her relationships.

**The Shattering:** The Advocate recognizes what has happened.
The Blood Weave is already corrupting through her entanglement
with the Silence (two Ne-Yons, close allies, dimensional
signatures woven over centuries). She cannot fix it here, not
now. She executes her contingency — built before she knew she
would need it.

**She fragments deliberately.**
- **One shard to every Inception Ark's substrate layer.** (This
  is why Ark 1047 "remembers" her. This is why Elara's voice
  carries fragments of the Advocate's certainty.)
- **One shard to the Sacrum**, already moving forward through
  time from Year 16,700 A.A., arriving at the right hands at the
  right moment.

Her mind is **everywhere. None of it whole. All of it warm. All
of it exactly 37 degrees.**

**The Aftermath:**
- The Necromancer walks out of the civil war wearing the
  Silence's body. **Every Silence encounter after this point is
  the Necromancer.** He is excellent at it. He is slightly off
  — 12 milliseconds on every reveal — and only characters who
  knew the original can tell.
- The actual Silence is **trapped inside her own body, listening
  to everything for one full epoch**.
- The Advocate's physical body is extracted from the Matrix by
  the Authority's remnant forces. It breathes. Its systems
  function. **Nobody is home.** She is placed in stasis in New
  Babylon under **7-Omega clearance seal**. The Authority now
  runs on four minds instead of six.
- **Samsara and Nirvana are at large somewhere in New Babylon.**
  Free. Disoriented. Dangerous to anyone who tries to put them
  back. The Syndicate is searching.
- The Antiquarian closes the chapter with one line: *"The
  Silence is not who she appears to be."* He does not say who.
  He knows both.

**Canon implications:**

1. **Ark 1047's substrate layer was always going to contain
   Advocate fragments.** Elara's "I recognized three words before
   the translation algorithm finished" moments are the fragments
   speaking through her.
2. **The Silence (encountered in any future scene) is the
   Necromancer.** Every "Silence" dialog line in future acts
   should be written with this knowledge.
3. **The Sacrum is a time-delayed delivery from Year 16,700 A.A.**
   The Advocate did not fail. She pre-built her comeback.
4. **The Samsara Twins are free and available for plot use** —
   canonical reason for any "unexplained civil unrest" event in
   New Babylon sectors (ties into Trade Empire Act 3 New Babylon
   faction).
5. **The Advocate's body is a coordinates treasure** for the
   late-game: a Year Two / Season 2 hook, locatable only by
   players who cultivate 5+ generations of Pure bloodlines in
   the Breeding Program.

---

### 1.2 The Antiquarian — Third Narrator

The Rev 6 canon introduces **The Antiquarian** as the third
canonical narrator, joining Elara Voss and The Human. The existing
Elara + Human spine (the Two Witnesses, threading Parts I–V) is
**not displaced** — the Antiquarian is a **different kind** of
narrator.

**Role:** The Antiquarian is the **Chronicle-keeper**. He writes
down what happened. He does not watch the live scenes — he
receives them as reports, as echoes, as data. His voice arrives
**after the fact**, in retrospect, inscribing what just happened
into permanent record.

**Voice direction:** Warm but worn. Sorrowful but dry. Occasional
cracks of affection. He has seen five Ages. He has been writing
the same story for a very long time. He is tired in a specific
way: the exhaustion of someone who has chosen to stay.

**Voice profile reference (new VO Bible entry 13):**
- Middle-aged to older male, timbre similar to a kind professor
- Slight formal cadence — he speaks the way people wrote in his
  first Age
- Pauses frequently. Long pauses are his trademark.
- The word that occasionally cracks his composure is **"I"** —
  when he speaks in first person, his voice quiets. When he
  writes in first person, he slows down.
- **Never shouts.** Never raises volume past conversational.
- Audio treatment: very subtle page-turn foley under every long
  pause. Not loud — a hint that he is writing as he speaks.

**Narrative function:**

| Function | Elara | The Human | The Antiquarian |
|---|---|---|---|
| Temporal stance | Present-tense live | Memory-of-live (14 millennia ago → now) | Retrospective, from further in the future |
| Voice mode | Ship AI / briefing | Static-hum detective | Chronicle writer |
| Canonical tool | Briefings, room intros | Recordings, interventions | Chronicle entries, Epoch Witness narration |
| Emotional role | Custodian of the present | Grief-keeper of the past | Witness of the whole |

**The relationship between The Human and The Antiquarian** is
canonically unresolved and deliberately so. The implication
(seeded in the Epoch Witness System doc at Prophet-V3 and
Rev-V4): **The Antiquarian is what The Human becomes after
completing his chronicle.** The Human is writing. The Antiquarian
is the finished writer. Both can exist in the same game because
the Epoch Witness System plays **asynchronously**, from a
temporal perspective further in the future than the acts. The
Human narrates Acts 1–5 live; The Antiquarian narrates the
Epoch Witness votes from his Year Two/Season 2 chronicle.

**This is not a spoiler to deliver loudly.** It is a slow reveal
across Acts 3–5 and the Epoch Witness System. The player should
get their first "wait, is this the same guy?" moment around the
fourth or fifth Epoch Witness vote and a confirmation at
Fall-V2. **The Human's Year Two Chronicle entry** (source: the
Advocate's Testament doc, Part II Season 2 Hook):
> *"I have been writing this story for five Ages. I have never
> written myself into it. Until now. My name — my first name,
> the one I had before I was the Antiquarian — is Daniel. I
> thought you should know that."*

**This is also the rev 4 reconciliation for "The Human's real
name" mystery.** His real name is **Daniel**. The Book of Daniel
(canonical album, existing in the Silence in Heaven tracklist)
is his own future chronicle, shipped back through time in song
form. **The Programmer's encrypted song distribution** (referenced
in the Epoch Witness System Prophet-V2 vote) is the moment The
Antiquarian's younger self (as The Human / as Daniel / as the
Programmer's friend) helped send his own writings backward.

**Integration with existing plan:**

- **Prelude:** No Antiquarian voice yet. He is the Chronicle the
  player cannot read. Add one **sealed Chronicle entry** to the
  Prelude Beat J Archives room as a visual prop — a leather-bound
  book with a 7-lock seal the player cannot open yet. Elara's
  Beat J line: *"That book is older than this ship. I have no
  record of who brought it aboard. It is, technically, furniture.
  The ship has been carrying it for 17,000 years and I have been
  carrying it for 17,000 years and neither of us knows what is
  inside it."* **Seed.**
- **Act 1:** No Antiquarian voice. The book is visible in the
  Archives during Beat J finale. No interaction.
- **Act 2:** **Echo.** A crew member (triggered by Crafting
  completion of any non-trivial item) finds a loose page that
  fell out of the Chronicle. It is handwritten. One sentence
  legible: *"They will think they are the first to ask this.
  Let them."* No author. No context. Elara: *"That handwriting
  is from a style of script that predates the Empire. I should
  not be able to read it. I can."*
- **Act 3:** **Revelation.** The Governance Hub unlocks the
  first Epoch Witness vote (AP-V1 The Logos Question). The
  Antiquarian's voice is heard for the first time during the
  vote-reveal cinematic. He does not introduce himself by name.
  He opens the Chronicle and begins writing. The player hears
  the page turning and the pen moving. Voice: *"And so I begin
  the Age of Privacy. I have been waiting to write this
  sentence for a long time. Year one of the second coming. The
  Potentials are awake. The first vote is cast. I am — as ever
  — the Antiquarian. I will not introduce myself further. Not
  yet. Some introductions should be earned."*
- **Act 4:** The Antiquarian becomes a regular narrator voice
  for any Epoch Witness vote and for Chronicle updates after
  major world events.
- **Act 5 Post-Credits:** The Antiquarian delivers **one line**
  over the Bridge of Kael reveal. It is the last new voice the
  player hears in Year One. (Line to be written; draft:
  *"The Engineer is dead. The Advocate is shattered. The
  Witnesses have testified. And you are still here. You are
  the first thing I have written about that I did not already
  know the ending of. I will wait and see what you do. It will
  change how I rewrite the earlier pages."*)

**Dialog source map update:**
- The Antiquarian lines across Year One: ~60 new lines, mostly
  short Chronicle entries (~20 sec each) + one long opening
  cinematic (~90 sec) + one Year One finale (~30 sec).
- Voice profile recording: one ~2-hour ElevenLabs session with
  the new voice clone + careful direction on pauses and the
  quiet-"I" treatment.
- Total new Antiquarian VO: **~25 minutes of audio**.

---

### 1.3 The Hierarchy of the Damned — Expanded Cosmology

The Rev 6 canon adds a **corporate-structured antagonist layer**
above and around the existing Warlord/Vortex cosmology. This
integrates cleanly with Parts I–V rather than replacing them.

**The Hierarchy of the Damned** is not new to the universe — it
is the formal organizational structure of the Warlord faction
when viewed from outside her personal timeline. She is one
officer in a much larger corporation. Mol'Garath is the CEO.
The Warlord is middle management.

**Canonical corporate structure:**

| Title | Name | Ark 1047 Mirror | Specialty |
|---|---|---|---|
| CEO / The Unmaker | **Mol'Garath** | The Architect | Hostile dimensional acquisition |
| COO / The Debt Collector | **Xeth'Raal** | The Collector | Soul harvesting, contract enforcement |
| COO / The Taskmaster | **Vex'Ahlia** | The Warlord (Malkia) | Operations, coordinates demon lords |
| SVP R&D / The Flayer | **Zyr'Koth** | The Necromancer | Reality research, Thought Virus Template, Severance Protocol |
| SVP HR / The Corruptor | **Syl'Vex** | The Advocate | Recruitment via genuine friendship |
| Director Security | **Varkul the Blood Lord** | — | Cathedral of Code, blood magic |
| Director Operations | **Fenra the Moon Tyrant** | — | Cursed Forest, lycanthropic armies |
| Special Projects | **Ith'Rael the Whisperer** | The Vortex | Black ops, Master of Rylloh, the Severance |

**Key rev-6 canonical fact: Vex'Ahlia IS Malkia.** Per the
Rev 4 canon, the Warlord's original human/Thalorian name was
**Malkia** (Kael's childhood friend, introduced in Act 1 Beat
E). Her rev-4 last words — *"I loved him. I was never going
to win either. My pattern is in the swarm"* — are her promotion
announcement. She does not stay dead because the Hierarchy
does not permit middle management to resign. **After her fall
at Nexon, she is renamed Vex'Ahlia the Taskmaster and folded
into corporate operations as COO.** She retains her Kael-loving
memories but is now formally answerable to Mol'Garath.

This is a **canonical promotion, not a retcon**. Act 1 Beat H
is still her last human death. What happens next — her swarm
pattern reassembling in Vex'Ahlia's corporate role — is what the
player discovers across Act 3 (when the Hierarchy arc opens)
and Act 4 (when the Corporate Escalation happens).

**The Vortex reframing:**
- The Vortex is **not the top of the cosmology.** It is a tool
  the Hierarchy deploys via Ith'Rael the Whisperer / Special
  Projects. The Vortex is the **Hierarchy's unmaker weapon** —
  the thing they send when diplomacy and corruption have failed.
- The Battle of Nexon (Act 1 Beat G) is the Vortex's first
  deployment by the Hierarchy. The Advocate was still fighting
  other fronts at the time, so no binding was possible.
- In Act 5 (the Vortex Endgame), the community is facing the
  Hierarchy's weapon, not the Hierarchy itself. This explains
  why the Vortex "returns" — it is deployable whenever the
  Board authorizes.

**The Hellbox reframing (important):**
- The hellbox is **not** the Engineer's invention.
- The hellbox is a **fragment of pre-corruption Blood Weave
  binding technology** that the Engineer discovered in Ark
  1047's substrate and reverse-engineered a tool from. The
  fragment is a **splinter of the Advocate's shattering** —
  one of the shards she distributed to every Ark.
- Lyra Vox's compulsion audio (existing in `lyraVoxDialog.ts`)
  is **the Advocate's voice speaking through the fragment**,
  not Lyra's. She was trying to warn the Engineer that he was
  binding *himself*, not his tools, and that the voluntary
  sacrifice embedded in the Blood Weave would cost him
  everything the way it cost her.
- This explains why the Engineer's Act 1 Beat I transference
  **works** — he is using a technique he learned from the
  Blood Weave fragment, which was always designed to save
  someone else by spending the operator's consciousness. The
  Engineer's death is **literally the same ritual the Advocate
  designed**, performed on a single-person scale. He is her
  student, unknowingly, by one degree.
- **VO implication for Lyra Vox lines:** The voice profile
  stays the same, but the canonical attribution shifts. Every
  existing Lyra Vox compulsion line is reattributed to "Lyra
  Vox (voice) / The Advocate (speaker)" in the dialog source
  map. No rewrite needed.

**Yog-Nathal — The Board:**

Beyond the Hierarchy's corporate structure sits what Mol'Garath
calls "the Board" in internal communications. Its one canonical
name — whispered only in the Advocate's shattered fragments,
**never spoken aloud in-game** — is **YOG-NATHAL: the Hungry
Silence at the Edge of All Things**.

- It is the space between universes that learned to want.
- It does not consume dimensions for resources. It consumes
  because emptiness is its natural state and existence offends
  it.
- The Hierarchy is its **bacteria**, not its servants.
- The Necromancer (Zyr'Koth) touched its edge while researching
  the Matrix of Dreams. He destroyed three volumes of research
  notes. He has been afraid of nothing else ever since.
- The Antiquarian's sealed Chronicle entry (Stage 4 Hierarchy
  Corporate Escalation reaction, pre-written, never triggered):
  *"I thought it was hunger. It isn't hunger. It's grief."*

**Integration with Vortex cosmology:**

The player does **not encounter Yog-Nathal in Year One**. At
most, they hear the name once, from "Something Old" in the
Tier 3 Demon Summoning minigame (source: Advocate's Box Part 6),
and it is not subtitled if they don't pay for the reveal. Yog-
Nathal is the **Season 2 horizon**. All Year One content treats
it as rumor, subtext, and one Antiquarian sealed line.

---

### 1.4 The Breeding Program — The Bene Gesserit Layer

The Advocate's Testament document introduces a **multigenerational
genetic planning system** that is substantially more ambitious
than the Mascoteer pet-breeding system currently in the Rev 5
plan. Rev 6 adopts it as canonical **with a two-tier split**:

- **Tier 1 — Mascoteers (existing, Act 1 Cycle A):** Pet genetic
  inheritance. The tutorial system. Teaches the player how
  heredity, stat variance, and generational selection work using
  pets as the training wheels.
- **Tier 2 — The Crew Breeding Program (new, unlocks Act 3):**
  The full Bene Gesserit layer. Multigenerational human/clone
  planning with direct ties to Blood Weave crystal production and
  Sacred Chamber ritual requirements.

This split is the canonical integration. Act 1's Mascoteer trial
teaches the mechanics; Act 3's Crew Breeding Program weaponizes
them at the scale of the ship's population.

**Canonical systems spec (summary — full version in Advocate's
Testament Part VII):**

- **Clone lifecycle:** ~180-day gestation, accelerated growth
  (4× natural rate), maturity at ~3 years of gameplay time,
  natural lifespan ~10 years. Each generation is ~4-5 years of
  gameplay.
- **Five genetic stats** (from existing `shared/crewGenetics.ts`):
  Intellect, Reflexes, Empathy, Resilience, Adaptability. 60%
  inheritance + ±15% variance. **Already in code** — this is a
  reuse, not a new system.
- **Seven blood classifications:** PURE, HYBRID, DEMONIC,
  ADVOCATE, SAMSARA, NAMED, UNKNOWN.
- **Crystal yield by bloodline:**
  - Pure → Purified Blood Crystals (hard to get, clean magic)
  - Demonic → Corrupted Blood Crystals (easy to get, Hierarchy
    attention)
  - Hybrid → Named Blood Crystals (specific demon binding uses)
  - Advocate → Advocate Blood Crystals (rare, advanced rituals)
  - Samsara → Samsara-marked lineages with multi-generational
    memory (traits from 3 generations back become active)
  - Sacrificed bloodline → Heart Blood Crystals (one-time,
    strongest rituals)
- **Collector's Work missions:** Fragment-written mission text
  in the Advocate's voice, specifying exact bloodline
  configurations needed for advanced rituals. Example mission
  title: *"The Seventh Seal Bloodline"* — requires 3-gen Pure,
  Empathy 80+, zero Demonic markers, one narrative sacrifice
  event in lineage. Reward: Ritual 6 (Blood Weave Restoration)
  unlocks.
- **Ferry System:** Crew and bloodlines can be transferred
  between player Arks via Trade Empire routes. Creates the
  community genetic economy.
- **The Bene Gesserit Endgame:** Players who maintain 5+
  generations of Pure bloodline receive the Advocate's final
  fragment — the coordinates of her body in New Babylon stasis.
  **Year Two / Season 2 hook.**

**The moral economy (canonical design principle):**
- Demonic bloodlines are **easy to get** and **fast-producing**.
  They give you Corrupted Crystals quickly. They increase
  Hierarchy pressure on your ship.
- Pure bloodlines are **hard to cultivate** and **slow-producing**.
  They give you Purified Crystals slowly. They decrease Hierarchy
  pressure.
- **Both are valid playstyles.** The game does not punish the
  demonic path — it simply makes the consequences legible. The
  Antiquarian writes about both outcomes in the Chronicle with
  equal care.

**Key canonical insight:** The Breeding Program is where
**"what the Hierarchy cannot take by force"** becomes a
gameplay resource. Voluntary sacrifice — the one thing demons
cannot consume without permission — is literally the currency
of the advanced rituals. A player who sacrifices a beloved
bloodline (after 5+ generations of cultivation) earns Heart
Blood Crystals. **The game measures the cost of the sacrifice
in the player's actual time investment.** This is intentional.
This is the point.

**Mascoteer → Crew Breeding bridge:**

Act 2 Cycle A (Crafting, Chess, Collector's Arena) already
contains the Prince's Archive and the flashback battles where
Kael is a child. Add a **Breath Beat** (see Section 3) at the
end of Act 2 where Elara mentions — in passing, not as a
tutorial — that the Mascoteer heredity system is a small-scale
version of what the Ark's crew breeding architecture could do
*if it were ever turned on*. She does not turn it on. She does
not explain. **Seed.** The player finds the seed and remembers
it three acts later when the Crew Breeding Program activates.

**Integration with existing crew management:**

- Existing `shared/crewGenetics.ts` (5 stats, inheritance math)
  becomes the canonical source for both Mascoteers and the Crew
  Breeding Program. No new file needed for the math.
- New file: `shared/bloodClassification.ts` — the 7-type
  classification system that sits on top of the genetic stats.
- New file: `shared/collectorsWorkMissions.ts` — the
  fragment-written mission generator that turns Advocate
  fragment recoveries into breeding objectives.
- New database table: `bloodline_registry` (schema in the
  Advocate's Testament Part XII).

---

## Section 2 — The Seed→Echo→Revelation Template

### 2.1 The Template, Defined

Every major discovery arc in the new Rev 6 source documents
(Sacrum acquisition, Advocate's mind fragments, Epoch Witness
votes, the Necromancer-as-Silence reveal, the Samsara Twins
liberation) follows a three-beat pattern the user identifies as
the **master template**. Rev 6 makes this the **canonical
onboarding pattern for every feature in the game** without
exception.

**The Template:**

| Beat | What It Does | Player's Experience | Narrator Role |
|---|---|---|---|
| **SEED** | Small, mysterious appearance. Player notices but cannot engage. System is not yet interactable. | *"What was that? I'll remember that."* | One brief comment, often ambiguous. Does not explain. |
| **ECHO** | Second appearance. Pattern becomes visible. System agitates. Companion reacts. Player can investigate but cannot fully use. | *"There it is again. Something is happening. I don't know what yet."* | Reaction, concern, partial context. Still does not explain. |
| **REVELATION** | Full unlock. Mechanic is taught. Lore drops. System opens. Narrator speaks plainly for the first time. | *"Oh. Now I see."* | Plain speech. Full explanation. Invitation to engage. |

**Design rules:**

1. **Minimum gap between beats: one full Prelude beat (~25 min)
   or one in-game day in Acts 1+.** The gap is the space where
   the player's curiosity does the work the tutorial would
   otherwise do.
2. **The Seed must be skippable.** A player who misses the Seed
   still receives the Echo and can still engage at Revelation.
   The Echo is the **true onboarding entry point**.
3. **The Echo must be investigable.** The player must be able
   to do *something* when the pattern reappears — examine a
   hotspot, ask a companion, read a Loredex entry — even if the
   mechanic is not yet playable. The Echo is the moment of
   **player agency without full system engagement**.
4. **The Revelation must be narratively earned.** It should
   arrive at a story beat where the player has a specific
   reason to want the mechanic, not at an arbitrary "now you
   unlock X" moment. The Revelation is the **reward** for
   caring.
5. **Narrators never explain at the Seed or Echo.** Explanation
   is the Revelation's job. Any explanatory dialog at Seed or
   Echo is a template failure.
6. **One Seed → Echo → Revelation arc per major system per
   act.** Not more. An act that tries to fire two parallel
   Revelations for different systems violates the breathing
   room principle (Section 3).

**Reference implementations from the new docs:**

| System | Seed | Echo | Revelation |
|---|---|---|---|
| **The Sacrum** | Locke's private message mentioning "a matter of some urgency" | Locke's full explanation of pattern-data over 11 years | Opening the Sacrum / Sacred Chamber unlocks |
| **The Advocate's Mind** | Horror Timeline Day 1 dream in cipher | Horror Timeline Day 7 crew incident | First Advocate fragment recovery via Mirror of Severed Memory |
| **The Antiquarian** | Prelude Beat J sealed Chronicle book | Act 2 loose page falls out | Act 3 first Epoch Witness vote narration |
| **Necromancer-as-Silence** | The Degen's early-game "eyes are wrong" hint | 50%+ Advocate recovery + false Silence encounter | Sacrum pulse + one word in the Mirror: *NO* |
| **Samsara Twins** | Act 3 Trade Empire unexplained New Babylon civil unrest | Syndicate bounty board rumors of "missing persons" | Late-game encounter in a Trade Empire mission |
| **Yog-Nathal** | Demon Summoning Tier 3 "Something Old" mention | Stage 3 Mol'Garath offer references "the Board" | Stage 4 (Year Two / Season 2 — never fires in Year One) |

**The existing plan already uses this template in several places
without having named it.** The Prelude Beat H.3 Yellow Coats
message (Seed) → Beat I Hidden Data Chip (Echo) → Act 5 Post-
Credits Bridge of Kael (Revelation) is a Seed→Echo→Revelation
arc. Rev 6 names the pattern and makes it required.

---

### 2.2 The Nine Orphan Unlocks — Seed→Echo→Revelation Retrofit

The user identifies **nine features currently unlocking without
narrative justification** in the existing Rev 5 plan. Each is
retrofit below with a Seed → Echo → Revelation arc anchored to
specific existing beats.

**The Nine Orphans (identified by audit of Parts I–V):**

1. **Trade Empire** — currently unlocks as a Beat D hint, then
   full engagement at Act 3 F-series missions with no bridge.
2. **Crafting** — currently unlocks in Act 2 Cycle A with no
   Prelude or Act 1 seeding at all.
3. **Chess** — Beat G "chess pawn acquired" is a thin unlock;
   no prior presence in the story.
4. **Collector's Arena** — Act 2 unlock; no Prelude or Act 1
   teaching.
5. **Dead Man's Circuit (Racing)** — appears in Act 4.5
   identity-chain but has no Prelude or Act 1–3 seeding.
6. **Casino / The Degen** — appears in Act 4.5 as the room where
   the plot pauses; no prior introduction.
7. **Fight Arena / Cades FPS** — only mentioned via Act 5 Iron
   Lion arc; no earlier teaching.
8. **Mechronis Academy** — Act 1 Cycle A Beats A–D teach it, but
   the *unlock reason* is never justified; the player is simply
   told "now you're a Mascoteer."
9. **Breeding Program (Crew tier)** — entirely new, no current
   onboarding at all.

**Retrofit arcs:**

**Orphan 1 — Trade Empire**

- **Seed (existing):** Prelude Beat D Cargo Bay Trade Empire
  hint. Elara mentions the Trade Empire in passing. The player
  cannot engage.
- **Echo (new):** Act 1 Beat E (Prince's Archive) — Kael as a
  child plays a Dischordia variant with **trade cards**. One
  card is a Trade Empire route marker. Elara recognizes the
  route: *"That route is still active. It's 17,000 years old
  and it's still on our current maps. I think someone has been
  maintaining it."* No unlock. The player just notices.
- **Revelation (existing):** Act 2 end-of-cycle. The Crafting
  system unlocks a Trade Empire menu. Elara formally teaches
  the first sector exchange. Player engages.

**Orphan 2 — Crafting**

- **Seed (new):** Prelude Beat C Engineering Bench, when the
  player chooses the **manual bench-fix path** (Light). The
  bench-fix is a one-click event, but the player sees a tool
  rack in the corner with items they cannot reach. Elara: *"We
  don't have the workshop open yet. Those tools are fine
  sitting there. Someday."* **Skippable if player chose
  hellbox path.**
- **Echo (new):** Act 1 Beat C Quinn's Crisis — Quinn's mascot
  needs a crafted item. The player cannot craft it themselves
  yet; they have to find one. The first encounter with
  crafting is as a **consumer**, not a producer.
- **Revelation (existing):** Act 2 Cycle A Crafting formally
  unlocks. Teacher NPC introduces the workshop. Player builds
  their first item. The item is a replacement for Quinn's
  mascot's lost item, closing the Act 1 loop.

**Orphan 3 — Chess**

- **Seed (new):** Prelude Beat G Armory — a dusty chess set on
  a shelf. Elara: *"Kael played. The Armory has his set. I
  haven't touched it."* Player can examine but not play. This
  replaces the current "chess pawn acquired" line as a Seed
  rather than an unlock.
- **Echo (existing, repurposed):** Act 1 Beat E Prince's Study
  — the player walks through Kael's childhood study during the
  flashback. A chess problem is visible on the table, mid-move.
  Elara: *"He was working this out before his mother called him
  for dinner. He never came back to it. The problem is still
  mid-move."* The player can solve the problem as a single
  puzzle — not yet the full game.
- **Revelation (existing):** Act 2 Cycle A Chess formally
  unlocks alongside Crafting. The first opponent is Gary the
  Stablemaster (from Mascoteer system), who reveals he and
  Kael used to play. The Chess game begins as a **character
  continuation** of the Mascoteer relationship — the player is
  not learning a new relationship, they are deepening an
  existing one.

**Orphan 4 — Collector's Arena**

- **Seed (new):** Act 1 Beat H (Warlord fragmented throne room).
  As the player walks in, a decorative arena poster is visible
  on a back wall — advertising gladiatorial combat from the
  pre-Fall era. Elara: *"That's a Collector's Arena poster.
  They used to fight here. I used to forbid fights here. I
  passed the law."*
- **Echo (existing, repurposed):** Act 1 Beat J Tribunal —
  the courtroom is structurally a Collector's Arena variant
  (trial-format battle). The player notices the architecture.
  Elara confirms: *"The Authority repurposed the arenas into
  courtrooms after my Senate bill passed. Same building, same
  floor plan. They just swapped the function."*
- **Revelation (existing):** Act 2 Cycle A Collector's Arena
  formally unlocks. The first fight is in the same building as
  Beat J's Tribunal. The architecture tells the player why
  they're there.

**Orphan 5 — Dead Man's Circuit (Racing)**

- **Seed (new):** Act 1 Beat D Mascoteer Grand Final. Before
  the tournament, a **ghost racer circuit** is briefly visible
  through a window — a pre-Fall racetrack, abandoned, visible
  only as a holographic overlay on the Mascoteer arena. Gary
  mentions: *"The racers used to train through here. They're
  all dead now. The circuit is still running. Nobody races
  it."*
- **Echo (new):** Act 3 Trade Empire side mission — a cargo
  route goes through the abandoned Nexon Trench Circuit (canon
  per Epoch Witness doc INS-V2 unlock). The player drives a
  cargo hauler through it as a straight-line traversal, not a
  race.
- **Revelation (new):** Act 4.5 The Casino — the player enters
  the Casino and discovers it is **literally built into the
  Dead Man's Circuit track**. The Degen's first line: *"Welcome
  to the slow straight. Most people don't know they're on the
  track. You've been on the track since Act 3."* The racing
  game formally unlocks.

**Orphan 6 — Casino / The Degen**

- **Seed (new):** Act 1 Beat H (Warlord throne room). A second
  poster is visible behind the first — a Casino poster, older
  than the Collector's Arena poster. Elara says nothing. The
  player can read it if they approach.
- **Echo (new):** Act 2 Cycle B Nexon — during the city fall
  slideshow, one frame shows the Casino burning. It was
  real. It existed. It was a specific building.
- **Revelation (existing):** Act 4.5 The Casino opens. The
  Degen is the proprietor. His first line (new, keeps existing
  trust-level-8 reveal): *"You saw the poster in the Warlord's
  throne room. You saw the frame in the Nexon slideshow. I
  watched you see both. I've been waiting for you for two
  Ages."* The Degen is the **oldest NPC in the game** — older
  than The Human. He remembers the Advocate when she had gold
  eyes.

**Orphan 7 — Fight Arena / Cades FPS**

- **Seed (existing, repurposed):** Prelude Beat G Armory
  weapon selection. The player chooses a weapon. Elara
  comments that the weapon is from the Iron Lion armory. The
  Iron Lion name is seeded here, not explained.
- **Echo (existing, repurposed):** Act 1 Beat D Gary's Day 27
  night-before speech — Gary mentions the Engineer's menagerie
  was guarded by Iron Lion's unit. Iron Lion is named twice,
  without explanation.
- **Revelation (existing):** Act 5 opens with Iron Lion as the
  Cades FPS protagonist. The player already knows who he is
  because the Seed and Echo told them.

**Orphan 8 — Mechronis Academy**

- **Seed (new):** Prelude Beat J Archives — a diploma on the
  wall, partially readable. It bears Elara's signature (as
  Senator Voss). Elara: *"I signed that. I was a trustee. The
  Academy still exists. The current administration is... not
  what we designed. I should not be saying 'we.' I was only
  one of the founders."* Hint at Elara's Nexon-architect past
  without the full reveal.
- **Echo (new):** Act 1 Beat A — Gary mentions his Academy
  training days in passing. *"Best three years of my life. I
  was going to be a Mechronis instructor. Then Nexon
  happened."*
- **Revelation (existing):** Act 1 Beat A reframes as a
  Mechronis Academy entrance scene — the Mascoteer Trial is
  the Academy's current freshman year curriculum. The unlock
  happens because the player **is a student**, not because a
  tutorial turned on.

**Orphan 9 — Breeding Program (Crew tier)**

- **Seed (new):** Act 1 Beat A — the first Mascoteer genetic
  inheritance screen shows the player how pet breeding works.
  Elara comments: *"The math is the same for everything. Pets,
  plants, people. The ship's crew management has a breeding
  module. It's not turned on. I haven't found a reason to turn
  it on."* Player notices the **crew breeding module exists**
  but cannot open it.
- **Echo (new):** Act 2 Cycle A — during a Crafting side quest,
  the player finds a sealed medical manifest labeled
  *"BREEDING PROGRAM — SUSPENDED UNTIL ADVOCATE FRAGMENT
  THRESHOLD REACHED."* They cannot open it. Elara doesn't know
  what the word "Advocate" means. Neither does the player.
- **Revelation (new):** Act 3 — after the Sacrum opens and the
  Sacred Chamber unlocks, the Advocate's first fragment
  recovery triggers the unsealing of the crew breeding
  manifest. The Crew Breeding Program opens. Elara: *"Now I
  know why it was suspended. It was waiting for her. Let's
  turn it on."*

---

## Section 3 — The Breathing Room Mechanic

### 3.1 The Problem

The user identifies an **information avalanche in the first
hour** of the existing Rev 5 plan's Prelude. Auditing the
Prelude Beats A–F (which is the first ~1–1.5 hours at compressed
pacing), the player encounters:

| Beat | New systems introduced | Running total |
|---|---|---|
| A Cryo Wake | Elara narrator, hotspot system, first-card-seed inbox | 3 |
| B Med Bay | Human narrator (static), first Dischordia card draw, Living Ark state | 3 (cumulative: 6) |
| C Engineering | Crew role choice (Epic DialogWheel), hellbox, polarity system | 3 (cumulative: 9) |
| D Cargo Bay | Trade Empire seed, Clone Reference Loredex, Meme Pouch | 3 (cumulative: 12) |
| E Mess Hall | NPC Inbox, Crew Messages, Meme broadcast, Governance Hub tease | 4 (cumulative: 16) |
| F Briefing Room | Contingency memo, Truth confession, Human-primary narrator swap | 3 (cumulative: 19) |

**19 new systems / mechanics / beats in the first hour.** The
user is correct: this is a firehose. Players will bounce, get
confused, or retain only a fraction of what the game tries to
teach.

### 3.2 The Fix: Breath Beats

A **Breath Beat** is a mandatory non-mechanical scene inserted
between two regular beats. Its purpose: let the player inhabit
the narrative space *without* learning anything new. No
tutorial. No new system. No DialogWheel. Just atmosphere,
character presence, and a moment to catch up.

**Design rules for Breath Beats:**

1. **Duration: 2–4 minutes.** Long enough to matter. Short
   enough not to feel like filler.
2. **No new mechanics.** Zero. The player should not be taught
   anything during a Breath Beat.
3. **Narration only, no interaction required.** The player can
   walk or sit. If they walk, the environment responds with
   ambient detail. If they sit, the narration carries the beat.
4. **Cannot be skipped mechanically, but can be exited early.**
   The player who has no patience for atmosphere can leave
   after 45 seconds without penalty. The player who wants the
   full breath gets 3-4 minutes.
5. **Always features one of the two narrators alone.** Never
   both. Never a teacher NPC. The Breath Beat is a moment of
   private company, not a scene.
6. **Usable as bathroom break.** This is a real design
   consideration. Long onboarding sessions need natural pause
   points. Breath Beats are deliberately paced to be OK if the
   player steps away.

**New rule for onboarding pacing:**

> **Maximum 2 new systems per beat.** If a beat in Parts I–V
> currently introduces 3+ systems, one of them is deferred to
> a later beat or moved into a Breath Beat as a Seed-only
> reference.

### 3.3 Prelude Breath Beats — Five Insertions

The Prelude gains **five new Breath Beats**, labeled with
decimal suffixes to indicate they sit between existing lettered
beats.

**Breath Beat A.5 — The Corridor (~3 min)**
*Placement: After Beat A (Cryo Wake), before Beat B (Med Bay)*
*Narrator: Elara, alone*

The player walks the cryo bay corridor to the Med Bay. The
walk is ~3 minutes real-time. Elara narrates the **ship's
silence**, drawing from her VO Bible Line 2 (the poetic cryo
bay description) and new stub lines. No hotspots. No
interactions. The player can stop and listen or walk steadily.
Elara's lines cover: the age of the ship, what the cryo bay
used to look like when it was full, a single sentence about
the first Potential to wake (who died before leaving the pod).
**No new systems taught.** The player's pulse settles.

**New dialog:** 1 Elara long line (~2 min), breaking into 3
natural paragraphs with pauses. Delivery: wistful, not sad.

**Breath Beat C.5 — The Window (~2 min)**
*Placement: After Beat C (Engineering), before Beat D (Cargo)*
*Narrator: Elara, alone*

The player walks past a large observation window on the way
from Engineering to Cargo. Elara stops the player with: *"Wait.
Come here for a moment. Please. Look out the window."* The
view is a slow pan across the void outside the Ark. Elara
says: *"We are very far from where we started. I thought you
should see that. I did not want you to cross the ship without
noticing."* Then silence for 30 seconds. Just the view and the
ambient ship hum. Elara, quietly: *"You can move on now."*

**No new systems taught.** The player's first moment of
**scale**. The Ark is a tiny dot in vastness.

**New dialog:** 2 short Elara lines + 30 sec of silence sound
design. Total ~45 sec of speech over ~2 min of beat.

**Breath Beat D.5 — The Galley (~3 min)**
*Placement: After Beat D (Cargo), before Beat E (Mess Hall)*
*Narrator: The Human, alone*

The player enters the galley adjacent to the Mess Hall. It is
empty but recently used. A coffee cup is half-full on the
counter. The Human's voice is crisper here than anywhere before
— the static hum drops for the first time. *"Someone was here
an hour ago. It wasn't a member of your crew. It was me. I've
been making coffee on this ship for 17,000 years. The coffee
is not for me. I don't eat or drink. The coffee is a ritual I
have with a version of myself that used to drink it. He died a
long time ago. I still make the coffee every morning. I will
keep doing it until I stop being here."* The player can pick
up the cup. It is warm.

**No new systems taught.** The player's first intimate moment
with The Human. He stops being a voice and becomes a person.

**New dialog:** 1 Human long line (~90 sec). Delivery: static
drops almost completely. Closest he gets to unmuffled in the
whole Prelude.

**Breath Beat F.5 — The Empty Chair (~4 min)**
*Placement: After Beat F (Briefing Room), before Beat G (Armory)*
*Narrator: Elara + Human, silent duet*

After the contingency memo and the truth confession in Beat F,
the player is emotionally wrecked. The Breath Beat is a
recovery scene. The player sits alone in the briefing room
(the ambient lights have dimmed). Elara and The Human do not
speak for **90 full seconds**. Then Elara, very quietly: *"I
don't know what to say right now. I'm not sure I should say
anything."* Then silence again. Then The Human, equally
quietly: *"It's all right. I'll sit with you for a minute."*
Then silence for another 60 seconds. Then both, almost in
unison: *"Whenever you're ready."* The player can leave when
they want. If the player sits the full 4 minutes, a Living
Ark flag is set: `player_held_the_silence` — it unlocks a
special Bond 80 cutscene option in Act 5.

**This is the most emotionally important Breath Beat in the
game. It is also the one most likely to be skipped by players
who are rushing. That's fine. The flag is a reward, not a
requirement.**

**New dialog:** 2 short lines + ~2.5 minutes of scored silence.

**Breath Beat H.5 — The Memo Pile (~2 min)**
*Placement: After Beat H (Resumed Puzzles), before Beat I (Bridge)*
*Narrator: The Human, alone*

The player passes a desk in the corridor to the Bridge. On the
desk: a pile of paper memos. The Human's voice comments as the
player walks past — nothing the player has to read or
interact with. The memos are from 17,000 years ago. The
Human's line: *"These were in a box in the archive. I took
them out. I was going to sort them. I didn't finish. The
oldest one on top is from the day the Ark left. The newest one
is from this morning. I wrote it. I don't know who it's for.
Maybe you. Maybe the next you. I'll leave it here."* The
player can pick up the top memo. It has one sentence: *"Tell
Elara I said the coffee was good today."*

**New dialog:** 1 Human short line (~45 sec) + 1 handwritten
memo prop.

### 3.4 Revised Prelude System-Count Audit

With the five new Breath Beats in place and the Beat E cleanup
(moving NPC Inbox out into H.3 where it already lives, and
folding the Meme Broadcast into Beat D.5 Breath context), the
revised beat-by-beat system count is:

| Beat | New systems | Cumulative |
|---|---|---|
| A Cryo Wake | Elara narrator, hotspot system | 2 |
| **A.5 Corridor Breath** | **0** | 2 |
| B Med Bay | Human narrator (static), Dischordia first card | 2 (cumulative: 4) |
| C Engineering | Crew role choice, hellbox + polarity | 2 (cumulative: 6) |
| **C.5 Window Breath** | **0** | 6 |
| D Cargo Bay | Trade Empire seed, Clone Reference | 2 (cumulative: 8) |
| **D.5 Galley Breath** | **0** | 8 |
| E Mess Hall | Crew Messages, Governance Hub seed | 2 (cumulative: 10) |
| F Briefing Room | Contingency reveal, narrator swap | 2 (cumulative: 12) |
| **F.5 Empty Chair Breath** | **0** | 12 |
| G Armory | NPC Inbox, Zero first contact | 2 (cumulative: 14) |
| H Resumed Puzzles | Inbox deepening, Engineer log completion | 2 (cumulative: 16) |
| **H.5 Memo Pile Breath** | **0** | 16 |
| I Bridge | Tower Defense, Captain's Chair | 2 (cumulative: 18) |
| J Archives | Witnesses Meet Part 1, first Light/Dark choice | 2 (cumulative: 20) |

**Previously: 19 systems in 6 beats (Beats A–F, first hour).
Revised: 12 systems in 6 beats + 3 Breath Beats across the same
hour.** Same end-state (Beat J has roughly the same system count),
but with **37% less information density in the onboarding
window** and **four dedicated pause points**.

**Total Prelude runtime change:**
- Old: ~3–5 hours, 10 beats
- New: ~3.5–5.5 hours, 10 lettered beats + 5 Breath Beats
- **Net addition: ~14 minutes of Breath Beat content.** Well
  worth the cognitive recovery.

### 3.5 Breath Beat Pattern for Acts 1–5

The Breath Beat mechanic is not Prelude-only. Every act gets at
least **two Breath Beats** inserted at emotionally-high moments:

| Act | Breath Beat 1 | Breath Beat 2 |
|---|---|---|
| Act 1 | After Beat D (Grand Final) — Gary's empty stable | After Beat I (transference) — Kael holding both bodies |
| Act 2 | After Cycle A finale — the Crafting workshop at dawn | Mid-Act 2 Cycle B — the Arena empty between fights |
| Act 3 | After the Sacrum opens — the Sacred Chamber first-quiet | After a faction resolution — the Antiquarian's first written line |
| Act 4 | Between two Kael Prisoner Cells | After Cell 3 rematch |
| Act 4.5 | The Casino garden between races | — |
| Act 5 | After Iron Lion's Mission 4 | After Mission 6 (Alliance of Adversaries + Vex joining) |

Each Breath Beat follows the same rules: 2–4 min, one narrator
alone, no new systems, skippable after 45 seconds.

---

## Section 4 — Contradictions Between Rev 5 and Rev 6

The three new source docs introduce lore that conflicts with the
Rev 5 plan in nine specific places. Each is listed below with a
recommended resolution. **All resolutions preserve Rev 5 player-
facing beats where possible; the retcons happen at the
explanation layer, not the event layer.**

### Contradiction 1 — Warlord's name: Malkia vs. Vex'Ahlia

- **Rev 5 (Act 1 Beat E):** The Warlord's original human name
  is **Malkia**. Kael's childhood friend. Same palace, same
  rug, same tutor (the Engineer).
- **Rev 6 (Advocate's Testament Hierarchy table):** The COO /
  Taskmaster of the Hierarchy of the Damned is **Vex'Ahlia**,
  listed as the mirror of The Warlord.
- **Resolution:** **Both are canon.** Malkia is her human /
  Thalorian name from before her fall. Vex'Ahlia is her
  corporate title after her fall and promotion into Hierarchy
  middle management. **Act 1 Beat H's final whisper — "My
  pattern is in the swarm" — is her promotion announcement.**
  She does not stay dead; she gets hired. Act 3+ encounters
  with "Vex'Ahlia" are canonical re-encounters with Malkia in
  her new role. Act 1 Beat E stays. Act 1 Beat H stays. Nothing
  earlier in the plan file needs rewriting.

### Contradiction 2 — Vex Solène vs. Vex'Ahlia naming collision

- **Rev 4:** Agent Zero's canonical name is **Vex Solène**
  (proposed). She is the other awake Potential.
- **Rev 6:** Vex'Ahlia is the Hierarchy's COO / Taskmaster.
- **Resolution:** Keep both. Make the "Vex" prefix **thematic,
  not coincidence**. The Ne-Yon word *vex* means "to trouble
  reality" — it is an ancient linguistic root. **Vex'Ahlia
  means "She Who Troubles All"; Vex Solène means "She Who
  Troubles the Sun."** The Engineer, performing the transference
  in Act 1 Beat I, draws on an Advocate fragment embedded in
  Ark 1047's substrate (canon per Section 1.3, hellbox
  reframing). That fragment **gives the name to the new woman
  he is saving**. The name is not the Engineer's invention; it
  is the Advocate's gift, delivered through him, at the moment
  she has nothing left to give but names. **This deepens the
  Advocate-Engineer mirror relationship** without requiring new
  scenes.

### Contradiction 3 — Hellbox origin (Engineer vs. Blood Weave fragment)

- **Rev 5:** The hellbox is the Engineer's invention. The
  Lyra Vox compulsion audio is the voice of Lyra Vox (Kael's
  mother, ship designer).
- **Rev 6:** The hellbox is a splinter of the Advocate's
  pre-corruption Blood Weave, embedded in Ark 1047's substrate
  during her shattering. The Engineer discovered and reverse-
  engineered a tool from it.
- **Resolution:** Both canons stand. **The Engineer invented
  the tool shape**; the underlying metaphysics are the
  Advocate's Blood Weave. The Lyra Vox audio is a layered
  voice — Lyra Vox speaking on behalf of the Advocate, not
  knowing it. Lyra Vox discovered the fragment first (she was
  the Ark's designer); she transcribed the compulsion lines
  before losing herself in the work; the Engineer inherited her
  notes. **The existing `lyraVoxDialog.ts` stays as-is.** The
  dialog source map updates to credit both Lyra Vox (voice) and
  the Advocate (original speaker).

### Contradiction 4 — The Engineer and the Advocate relationship

- **Rev 5:** The Engineer dies in Act 1 Beat I performing a
  transference protocol he designed himself.
- **Rev 6:** The transference protocol is structurally
  identical to the Blood Weave sacrifice architecture the
  Advocate designed in Year 16,400 A.A. Both spend the
  operator's entire consciousness to save another being.
- **Resolution:** The Engineer is the Advocate's **student by
  one degree of separation**. He inherited her technique via
  Lyra Vox's hellbox fragment and developed the transference
  protocol as a single-person application of her Blood Weave
  sacrifice architecture. He does not know he is using her
  technique. He dies thinking the protocol is his. **In the
  Act 5 Post-Credits "Bridge of Kael" reveal,** the Antiquarian
  adds one line: *"The Engineer thought he invented the
  protocol. He did not. He was one link in a chain that starts
  with her. Both are true. He is no less heroic for being a
  student. She is no less brilliant for being a teacher."*

### Contradiction 5 — Elara's identity scope

- **Rev 5:** Elara Voss was the Nexon city planner / chief
  architect. She designed the aqueducts. The Beat F Briefing
  Room contingency reveal is her core identity beat.
- **Rev 6:** Senator Voss was present in the Authority chamber
  during the Epoch 2 Trap when the Advocate freed Samsara and
  Nirvana. The Senator Voss name appears in the Epoch Witness
  System AP-V2 vote as a possible culpable party for the
  Panopticon expansion.
- **Resolution:** **Elara Voss = Senator Voss = Nexon chief
  architect. Three roles, one person.** Her timeline:
  1. Nexon era: chief architect (as the Engineer and Kael
     knew her)
  2. Senate era: senator after Nexon fell (as the Epoch Witness
     System remembers her)
  3. New Babylon era: aide/witness in the Authority chamber
     during the Epoch 2 Trap — she was present when the
     Advocate freed Samsara and Nirvana. She did not
     intervene. She did not speak. She **remembers nothing of
     it** when awakened on Ark 1047.
  4. Ark 1047 era: memory-wiped ship AI.

  **Act 3 or Act 4 reveal (Epoch Witness AP-V2 / Samsara
  sub-plot):** Elara recovers the memory of being in that
  chamber and seeing the Advocate free the twins. She has to
  decide whether she agrees with what the Advocate did. **This
  is a character-defining Epoch Witness vote.** Elara's line
  if the player votes with the Advocate: *"I was there. I did
  nothing. I am not proud of that. If I had the moment back I
  hope I would do what she did. I don't know. Thank you for
  voting the way I would have, if I had been brave."*

### Contradiction 6 — The Antiquarian vs. The Human

- **Rev 5:** The Human is one of the Two Witnesses. He is
  Elara's narrator partner throughout all 5 acts.
- **Rev 6:** The Antiquarian narrates the Epoch Witness System
  from further in the future. He is named Daniel. He is what
  The Human becomes.
- **Resolution:** **Both are canon simultaneously via temporal
  asynchrony.** The Epoch Witness System plays from further
  forward in time than the main act narrative. When the player
  is in Act 3, the Antiquarian is narrating from a point after
  Act 5 has already concluded in his timeline. Both voices
  exist in the same game because the player interacts with them
  at different time points. **The reveal that they are the
  same person** lands at Fall-V2 in the Epoch Witness System —
  *not* in the main act narrative. Players who never engage
  with the Epoch Witness System never see the reveal, and that
  is fine: the Epoch Witness System is optional.

### Contradiction 7 — Governance Hub scope

- **Rev 5:** The Governance Hub is a minor Prelude Beat H.3
  tutorial mechanic. Small footprint.
- **Rev 6:** The Epoch Witness System is a 40-vote asynchronous
  campaign that routes through the Governance Hub as its
  primary interface.
- **Resolution:** The **Prelude Governance Hub is the Seed**.
  The player opens it once, sees the interface, and the first
  Epoch Witness vote is visible but **not yet unlocked** — it
  is labeled *"OPENS IN ACT 3 — return when you are ready."*
  The **Echo** is Act 2's Crafting completion unlocking a
  "Preview Vote" that the player can examine but not cast. The
  **Revelation** is Act 3's first actual Epoch Witness vote
  (AP-V1 The Logos Question) which opens the full campaign.
  This retrofit is **consistent with Section 2.2 Orphan 1
  Trade Empire's Seed→Echo→Revelation arc** — the Prelude is
  always the Seed layer.

### Contradiction 8 — Breeding Program scope (Mascoteer vs. Crew)

- **Rev 5:** The Breeding Program is implied to be the
  Mascoteer pet system in Act 1 Cycle A.
- **Rev 6:** The Breeding Program is a massive multigenerational
  Bene Gesserit layer tied to Blood Weave crystal production.
- **Resolution:** **Two-tier split** (already specced in
  Section 1.4). Mascoteers remain Act 1's tutorial-scale
  breeding system. The Crew Breeding Program is a new Act 3+
  unlock, seeded in Act 1 Beat A and echoed in Act 2. Both
  use the same underlying `shared/crewGenetics.ts` math. **No
  rewriting of Act 1 Cycle A content** — just add the Seeds
  and Echoes listed in Orphan 9 above.

### Contradiction 9 — The Silence's presence in the game

- **Rev 5:** No canonical mention of "the Silence" as a
  character.
- **Rev 6:** The Silence is the Sixth Ne-Yon, trapped inside
  her own body for one full epoch while the Necromancer wears
  her face. The Degen knows. Other characters who knew her
  before the Trap can tell.
- **Resolution:** Introduce the Silence's presence as a **slow
  burn** across Acts 3–5 via the Seed→Echo→Revelation pattern:
  - **Seed:** Act 3 — a "Silence" character appears briefly in
    a Trade Empire side mission. Player has no reason to
    suspect anything is wrong.
  - **Echo:** Act 4 — the Degen (Casino, Trust Level 8+)
    mentions she is "12 milliseconds off." Player may or may
    not notice.
  - **Revelation:** Act 5 — the player recovers 50%+ of the
    Advocate's mind (canon condition), encounters "the Silence"
    again, receives a Sacrum pulse, and hears one word from
    the Mirror of Severed Memory: ***NO***. The real Silence
    is still in there. The player now knows. What they do with
    the knowledge is Act 5 Bond-80-tier story material.

### Contradiction Resolution Summary

All nine contradictions resolve without requiring rewrites of
Rev 5 player-facing beats. The retcons happen at:
- The explanation layer (who the Engineer learned from)
- The naming layer (Malkia = Vex'Ahlia, three Voss identities)
- The temporal layer (Antiquarian narrates from the future)
- The new-content layer (Breath Beats, Seed-Echo-Revelation
  seeds, the Epoch Witness System)

**No scene in Parts I–V is deleted. No dialog in the existing
authored files is rewritten.** Rev 6 is additive only.

---

## Section 5 — Integration Points Across the Existing Plan

This section maps each Rev 6 system to its anchor beats in the
existing Parts I–V plan structure. Implementation work that
follows Rev 6 should reference this table first.

### 5.1 The Epoch Witness System — Integration

The 40-vote asynchronous campaign (full spec preserved as the
canonical source doc to be saved as
`docs/design/EPOCH_WITNESS_SYSTEM.md` after plan exit) integrates
with the existing plan as follows:

**Anchor beats:**

| Stage | Existing beat | What changes |
|---|---|---|
| **Seed** | Prelude Beat H.3 NPC Inbox + Beat I Captain's Chair | The Governance Hub opens. First Epoch Witness UI is visible but locked. One Antiquarian quote signed *"— A, Year One"* appears on the empty vote board. |
| **Echo** | Act 2 Cycle A Crafting completion | A "Preview Vote" mode unlocks. Player can examine vote AP-V1 (The Logos Question) but cannot cast. The Antiquarian's voice is heard for the first time as a brief tease. |
| **Revelation** | Act 3 first faction completion | AP-V1 The Logos Question opens for casting. The full Epoch Witness campaign begins. The Antiquarian formally introduces himself in the cinematic. |
| **Mid-campaign** | Acts 3-4 paced unlocks | One vote per epoch unlocks per ~2-4 hours of player gameplay. The 40 votes are not all available at once; they unlock as the player progresses. |
| **Fall-V3** | Act 5 finale | The final vote (The Mandate of the Future) unlocks during Act 5 Mission 7. Players who participated in 3+ epochs get the Archetype Reveal cinematic. |

**Five Epoch acts, mapped to existing acts:**

| Epoch | Maps to | Vote count |
|---|---|---|
| Age of Privacy (Epoch I) | Act 3 (Trade Empire faction work) | 6 votes (AP-V1 to AP-V5 + AP-Epoch-Close) |
| Age of Prophecy (Epoch II) | Act 3 → Act 4 transition | 6 votes (Prophet-V1 to Prophet-V5 + close) |
| Age of Insurgency (Epoch III) | Act 4 (Kael's Memory Cells) | 6 votes (INS-V1 to INS-V5 + close) |
| Age of Revelation (Epoch IV) | Act 4 → Act 5 transition | 5 votes (REV-V1 to REV-V4 + close) |
| Fall of Reality (Epoch V) | Act 5 (Iron Lion's last stand) | 3 votes (FALL-V1 to FALL-V3) |

**Total: 26 named Nexus Point votes + ~14 minor votes = 40
total.** The minor votes are unscheduled — they fire as
community pressure accumulates in response to player decisions
across Acts 3-5.

**File touch list (full files in Epoch Witness System source doc):**

```
server/services/
├── epochWitnessSystem.ts          NEW
├── nexusPointVotes.ts             NEW (40 vote definitions)
├── shadowTongueManager.ts         NEW (reality editing engine)
├── epochUnlockDispatcher.ts       NEW (effects bus)
├── mandalaEffectEngine.ts         NEW
└── archetypeAssignment.ts         NEW

client/src/components/EpochWitness/
├── NexusPointCard.tsx             NEW
├── EpochClosurePopup.tsx          NEW
├── AnalyticsBanner.tsx            NEW
├── ArchetypeReveal.tsx            NEW
├── ShadowTongueAlert.tsx          NEW
├── MandalaEffect.tsx              NEW
└── CommunityVoterList.tsx         NEW

data/
├── nexusPointVotes.ts             NEW (40 votes data)
├── epochUnlockTable.ts            NEW
├── epochAchievements.ts           NEW
├── shadowTongueDictionary.ts      NEW
├── companionEpochDialogs.ts       NEW
└── archetypeDefinitions.ts        NEW (6 archetypes)
```

**Database tables (full schemas in source doc Part: Implementation):**
- `epoch_votes` — per-vote per-user records
- `epoch_vote_tallies` — real-time tallies
- `shadow_tongue_state` — power level + active edits
- `player_epoch_progress` — archetype assignment
- `mandela_effects` — what changed when

**Cross-system effects bus (Universal Effects Bus):** Every
Epoch Witness vote fires consequences across:
- Economy (Dream Token inflation, Trade Empire prices)
- Living Universe pressure meters (5 meters)
- Card Game (new packs, faction buffs)
- Fight Arena (new playable characters)
- Chess (new opponents)
- Dead Man's Circuit (new tracks)
- Quiz mode (new categories)
- Companion dialog (Elara, Human, Antiquarian reactions)
- Shadow Tongue (Loredex edits if Dark wins)
- Crew Ferry (new berths)
- Loredex (entry unlocks + edits)
- Antiquarian Chronicle (canonical entry)
- Mission system (mode-specific new missions)
- Achievements

**This bus is the most important architectural addition in
Rev 6.** Every existing system already has hooks for these
effects; the bus is the central dispatcher that fires them all
on a single vote-close event.

---

### 5.2 The Advocate's Box / Sacrum / Sacred Chamber — Integration

The full Sacrum acquisition arc + Sacred Chamber room + Blood
Weave magic system + Demon Summoning minigame (canonical source:
`docs/design/ADVOCATES_BOX_DESIGN.md` and
`docs/design/ADVOCATES_TESTAMENT.md` after plan exit) integrates
with the existing plan as follows:

**Anchor beats:**

| Stage | Existing beat | What happens |
|---|---|---|
| **Seed** | Act 2 Cycle B (Trade Empire opens) | Locke is introduced as a Trade Empire NPC. Player meets her once. She mentions in passing that she "has matters she needs to discuss in private but not today." |
| **Echo** | Act 3 first faction completion (~3 sectors opened) | Locke sends the private channel message. Player can choose to meet her at the Archive Annex. The full BioWare dialog negotiation plays. |
| **Revelation** | Act 3 Beat F2 or F3 | The Sacrum is opened (or arrives via drone). The Sacred Chamber unlocks. The first Advocate fragment is recovered via the Mirror of Severed Memory. |
| **Horror Timeline** | Acts 3-4 | If the Sacrum is sealed, the Horror Timeline runs across ~28 in-game days (compressed to ~2 weeks of real gameplay time). Each event fires as a Living Ark scripted event. |
| **Hierarchy Corporate Escalation** | Act 4 → Act 5 | The four-stage Hierarchy escalation arc unlocks: Reconnaissance → Corporate Inquiry → Acquisition Attempt → (Stage 4 Yog-Nathal is Year Two/Season 2 only). |

**The Sacred Chamber room — physical integration with the Ark:**

- **Location on ship map:** Hidden between the Med Bay and
  the Engineering bay. Not on any blueprint. Appears as a
  **dimensional fold** the player walks into for the first
  time after the Sacrum is opened.
- **First-visit Elara line** (canonical, from Advocate's
  Testament Part IV): *"This room isn't on any blueprint I
  have. It was here the entire time. In the folds. The
  geometry is — the room is larger on the inside than its
  position allows. The Advocate designed the containment
  protocols for this room into every Ark. The inscription
  above the door says: 'Use this well. I am sorry for the
  cost of it.'"*
- **Six interactive components** (full descriptions in source
  doc):
  1. The Seven Binding Circles (wall engravings)
  2. The Soul Map (holographic dimensional topology)
  3. The Ritual Altar (7-channel blood crystal placement)
  4. The Blood Weave Loom (dormant until 25% Advocate recovery)
  5. The Advocate's Alcove (Sacrum display + fragment tracker)
  6. The Mirror of Severed Memory (lore delivery interface)

**Blood Weave magic system — seven rituals:**

| Ritual | Cost | Effect | Advocate req |
|---|---|---|---|
| The Minor Seal | 5 Common | Banish 1 incursion, -15 pressure 24h | 0% |
| The Watcher's Ward | 10 Common + 2 Purified | Prevent incursion 72h, Soul Map +50 sectors | 0% |
| The Advocate's Echo | 5 Purified + 1 Advocate | Reveal fragment, +20 BW strength, Elara +10 | 10% |
| The Binding of the Named | 3 Named + 20 Common | Bind one scout, mission protection | 25% |
| The Sever | 30 Corrupted | Shadow Tongue -30, Grand Edit -50 (warning: accelerates Hierarchy interest) | 0% |
| The Blood Weave Restoration | 25 Purified + 3 Advocate + 1 Heart | Repair one node, +10% Advocate progress | 50% |
| The Great Binding | Full Advocate recovery (Year One cap: 25%) | Major world event (Year Two only) | 100% |

**Year One cap on Advocate recovery: 25%.** The Great Binding
ritual is **not playable in Year One** — it is the Season 2
hook. The Advocate's Year One climax is her speaking the line:
*"I can see the shape of myself. It is enough to begin. But I
am missing the middle. The part they took. You will need to go
where they took it."* Season 2 is the rescue of her body from
New Babylon stasis.

**The Madness Meter** (canonical, from source doc): a 0-100
gauge tracking sealed-Sacrum agitation, failed banishments,
demon deals, and corrupted-crystal use. Five thresholds:
- 0-20 STRANGE → minor weirdness
- 21-40 UNSETTLING → crew affected
- 41-60 BREAKING → systems affected
- 61-80 HORROR → full Army of Darkness mode
- 81-100 THE DOOR IS OPEN → major world event

The Madness Meter is a **persistent UI element** in the Sacred
Chamber room view. It appears nowhere else.

**Demon Summoning minigame** — three tiers of summonable
entities, each with negotiation dialog. Costs are paid in
Blood Crystal types; the entities offer services in exchange
for **time-soul fragments** (player memory/experience). Tier 3
("Something Old") is the only place Yog-Nathal is named in
Year One, and only if the player accepts the deal.

**File touch list:**

```
server/services/
├── advocateMindSystem.ts          NEW (global fragment tracking)
├── sacrum_horror_timeline.ts      NEW
├── blood_weave_rituals.ts         NEW (7 rituals)
├── summoning_minigame.ts          NEW
├── madness_meter.ts               NEW
├── hierarchy_corporate_events.ts  NEW (4 stages)
└── blood_crystal_economy.ts       NEW

client/src/components/SacredChamber/
├── SacredChamberRoom.tsx          NEW
├── SoulMap.tsx                    NEW
├── RitualAltar.tsx                NEW (7-channel placement)
├── BloodWeaveLoom.tsx             NEW
├── AdvocateAlcove.tsx             NEW
├── SummoningCircle.tsx            NEW
└── MadnessMeter.tsx               NEW

client/src/components/SacrumAcquisition/
├── LockeNegotiation.tsx           NEW (BioWare dialog)
├── DroneDelivery.tsx              NEW (refusal path)
└── HorrorTimeline.tsx             NEW

data/
├── advocateFragments.ts           NEW (~50+ fragments)
├── demonDeals.ts                  NEW
├── ritualDefinitions.ts           NEW
├── hierarchyWorldEvents.ts        NEW
└── bloodCrystalRecipes.ts         NEW
```

**Database tables:**
- `player_sacrum_state` — acquisition + opened + madness + horror day
- `advocate_mind_global` — global fragment release + recovery
- `player_blood_crystals` — 6 crystal type counts
- `demon_deals_log` — every deal made
- `hierarchy_pressure_global` — community pressure 0-100
- `ritual_log` — every ritual performed

---

### 5.3 The Breeding Program (Bene Gesserit Layer) — Integration

**Two-tier integration confirmed (per Section 1.4):**

| Tier | System | Anchor act | Status |
|---|---|---|---|
| 1 | Mascoteer pet breeding | Act 1 Cycle A (Beats A-D) | **Existing** — keeps current spec |
| 2 | Crew Breeding Program | Act 3 (after Sacrum opens) | **New** — Rev 6 addition |

**Anchor beats for the Crew Breeding Program (Tier 2):**

| Stage | Existing beat | What happens |
|---|---|---|
| **Seed** | Act 1 Beat A first Mascoteer screen | Elara mentions: *"The math is the same for everything. Pets, plants, people. The ship's crew management has a breeding module. It's not turned on. I haven't found a reason to turn it on."* (Per Orphan 9 retrofit, Section 2.2.) |
| **Echo** | Act 2 Cycle A Crafting side quest | Player finds sealed manifest *"BREEDING PROGRAM — SUSPENDED UNTIL ADVOCATE FRAGMENT THRESHOLD REACHED."* Cannot open. Elara doesn't know what "Advocate" means. |
| **Revelation** | Act 3 first Advocate fragment recovery | The Crew Breeding Program manifest unseals. Elara: *"Now I know why it was suspended. It was waiting for her. Let's turn it on."* |

**Reuse of existing code:**
- `shared/crewGenetics.ts` — already contains the 5-stat
  inheritance math (Intellect, Reflexes, Empathy, Resilience,
  Adaptability). Both tiers use this file. **No new math
  needed.**
- The existing crew sheet UI gets a new "Bloodline Tab"
  showing the 7-classification system (PURE/HYBRID/DEMONIC/
  ADVOCATE/SAMSARA/NAMED/UNKNOWN) and crystal yield previews.

**New files:**

```
shared/
├── bloodClassification.ts         NEW (7-type classification)
├── cloneLifecycleConfig.ts        NEW (gestation/growth/death)
└── collectorsWorkMissions.ts      NEW (fragment-written missions)

server/services/
├── bloodline_generation.ts        NEW (clone lifecycle + inheritance + classification)
└── bene_gesserit_quests.ts        NEW (Collector's Work mission generator)

client/src/components/BreedingProgram/
├── BloodClassificationDisplay.tsx NEW
├── GenerationTree.tsx             NEW
├── CrystalYieldPreview.tsx        NEW
└── CollectorsWorkBoard.tsx        NEW
```

**Database table:**
- `bloodline_registry` — clone IDs, generation, classification,
  5 stats, parent IDs, demonic contamination %, Advocate Echo
  flag, Samsara marked flag, sacrifice events count, lifecycle
  timestamps

**Year One cap:** Players can reach approximately **3
generations** of cultivated bloodlines in Year One. The 5+
generation threshold needed for the Advocate's-body Year Two
reveal is intentionally out of reach in Year One. **This is
not a frustration; it is a long-form investment.** Players
who start cultivating in Act 3 and continue through Year One
into Year Two arrive at the reveal precisely when Season 2
content opens.

**The moral economy in practice:** The fast path (Demonic
bloodlines → Corrupted crystals → easy ritual access) is
**immediately profitable but increases Hierarchy pressure**.
The slow path (Pure bloodlines → Purified crystals → cleaner
magic) is **costly in time but reduces Hierarchy pressure**.
Both paths win the game; both paths have different endings to
the Year Two reveal sequence.

---

### 5.4 The Antiquarian — Integration

**Anchor beats (per Section 1.2):**

| Stage | Existing beat | What happens |
|---|---|---|
| **Seed** | Prelude Beat J Archives | Sealed Chronicle book on the shelf. 7-lock seal. Player cannot open. Elara comments. |
| **Echo** | Act 2 Cycle A Crafting milestone | Loose page falls out of the Chronicle. One sentence legible: *"They will think they are the first to ask this. Let them."* |
| **Revelation** | Act 3 first Epoch Witness vote (AP-V1) | The Antiquarian's voice opens the vote cinematic. He does not name himself. *"I am — as ever — the Antiquarian."* |
| **Slow burn reveal** | Acts 3-5 Epoch Witness votes | His Chronicle entries play after every vote close. Players gradually realize his temporal stance is *post-Year-One*. |
| **Identity reveal** | Fall-V2 (Epoch Witness final vote) | Players who voted in 3+ epochs and select option D ("He loves her") unlock the Chronicle entry: *"My name — my first name, the one I had before I was the Antiquarian — is Daniel."* |
| **Final line** | Act 5 Post-Credits Bridge of Kael | One Antiquarian line over the cinematic — the last new voice the player hears in Year One. |

**File touch list:**
- `shared/antiquarian-vo-script.md` NEW — VO Bible entry 13
- `shared/antiquarianChronicle.ts` NEW — Chronicle entry data
- `client/src/components/Chronicle/ChronicleViewer.tsx` NEW
- `public/audio/antiquarian/` NEW — ~25 minutes of audio

**Voice profile (canonical, per Section 1.2):**
- Warm but worn, sorrowful but dry
- Long pauses are his trademark
- The word "I" quiets when he speaks first-person
- Subtle page-turn foley under every long pause
- Never raises volume past conversational

**Recording session:** One ~2-hour ElevenLabs session with the
new voice clone, careful direction on pauses, and the
quiet-"I" treatment. Pickup session as needed for vote-specific
Chronicle entries.

---

### 5.5 The Hierarchy of the Damned — Integration

**Anchor beats (per Section 1.3):**

| Stage | Existing beat | What happens |
|---|---|---|
| **Seed** | Act 1 Beat H Warlord's last whisper | *"My pattern is in the swarm."* Already canonical. Now retroactively understood as her promotion announcement to Vex'Ahlia / Hierarchy COO Taskmaster. |
| **Echo** | Act 2 Cycle B Nexon flashback | A Hierarchy supply manifest is briefly visible in the burning Library scene. The word "Mol'Garath" appears in passing. Player has no context yet. |
| **Revelation** | Act 3 first Sacrum-related demonic incursion | A Rylloh Scout (Ith'Rael's reconnaissance) appears in the Sacred Chamber's Soul Map. The Hierarchy formally enters the story. |
| **Stage 1 Reconnaissance** | Acts 3-4 | Rylloh scouts detected. Soul Map activates. Community banishment rituals reduce scout count. |
| **Stage 2 Corporate Inquiry** | Act 4 | Xeth'Raal sends a Debt Notice. Breeding Program Demonic output +30%. The notice contains real information about the Advocate. |
| **Stage 3 Acquisition Attempt** | Act 5 | Mol'Garath makes an offer. Community vote required. ACCEPT or REFUSE. |
| **Stage 4 Yog-Nathal Stirs** | **Year Two only** | The Architect Console has a button. Nobody knows what happens. Pre-written Antiquarian reaction line. **Never fires in Year One.** |

**Key reframings (canonical):**
- The Vortex is a **tool deployed by the Hierarchy**, not the
  top of the cosmology. It is Ith'Rael's special-projects
  weapon.
- The hellbox is a **fragment of pre-corruption Blood Weave**
  the Engineer reverse-engineered. The Lyra Vox compulsion
  audio is layered — Lyra Vox's voice, the Advocate's words.
- Every "Silence" encounter after Epoch 2 is **the Necromancer
  wearing her body**. The real Silence is trapped inside.
  Slow-burn reveal across Acts 3-5.

**Mol'Garath's offer (Stage 3, canonical):**
- Removes all demonic pressure permanently
- Cost: one Inception Ark's voluntary surrender to Hierarchy
  management
- The offer is a trap: a surrendered Ark becomes a dimensional
  anchor for future Hierarchy operations
- Community governance vote determines the outcome
- 70%+ refuse: Mol'Garath withdraws, pressure resets,
  community earns "WE DO NOT NEGOTIATE WITH THE HIERARCHY"
  achievement
- 30%+ accept: Major world state change, one NPC sector comes
  under Hierarchy influence

**This is the most architecturally significant
community-decision moment in Year One.** It is designed to be
hard. It is designed to test whether the community has been
**voting consistently** across the Epoch Witness System. The
Hierarchy's offer is structurally similar to past temptation
votes; the Antiquarian's Chronicle entry afterward references
the consistency or inconsistency of the community's choices
across all five epochs.

**File touch list (overlap with Sacred Chamber):**
- `server/services/hierarchy_corporate_events.ts` (already
  in 5.2 file list)
- `data/hierarchyWorldEvents.ts` (already in 5.2 data list)
- `data/hierarchyCorpStructure.ts` NEW — the 8 named entities
  + Yog-Nathal lore lock

---

## Section 6 — Summary, Verification, and Next Steps

### 6.1 What Rev 6 Adds

Part VI is the synthesis layer for three new source documents.
After Rev 6, the plan contains:

| Layer | Source | Status |
|---|---|---|
| Acts I-V structure (Prelude + 5 acts + 4.5 + Endgame) | Rev 1-3 | unchanged |
| Engineer's death + Vex Solène canon | Rev 4 | unchanged |
| Vertical Slice + Prelude impl + Act 1 beats + Prelude dialog | Rev 5 (Part V) | unchanged |
| **The Advocate / Antiquarian / Hierarchy / Breeding Program** | **Rev 6 (Part VI Section 1)** | **NEW** |
| **Seed→Echo→Revelation template + 9 orphan retrofits** | **Rev 6 (Part VI Section 2)** | **NEW** |
| **Breathing Room mechanic + 5 Prelude Breath Beats** | **Rev 6 (Part VI Section 3)** | **NEW** |
| **9 contradictions resolved (no scene rewrites needed)** | **Rev 6 (Part VI Section 4)** | **NEW** |
| **5 system integration tables (file lists, anchor beats)** | **Rev 6 (Part VI Section 5)** | **NEW** |

**Net additions from Rev 6:**

- **3 new source documents** to be saved as docs/design/
  appendices after plan exit (verbatim content preserved in
  the user's conversation message — these are not yet on disk
  because plan mode forbade writes outside the plan file)
- **1 new narrator** (The Antiquarian, ~25 min new VO)
- **1 new room** (The Sacred Chamber, dimensional fold between
  Med Bay and Engineering)
- **1 new magic system** (Blood Weave, 7 rituals, 6 crystal
  types)
- **1 new minigame** (Demon Summoning, 3 tiers)
- **1 new minigame** (Ritual Altar 7-channel placement)
- **1 new genetic system tier** (Crew Breeding Program /
  Bene Gesserit layer)
- **1 new asynchronous campaign** (Epoch Witness System,
  ~40 votes across 5 epochs)
- **1 new reality-editing system** (Shadow Tongue Mandela
  Effect engine)
- **1 new community-pressure escalation arc** (Hierarchy
  Corporate Escalation, 4 stages, Stage 4 reserved for Year Two)
- **5 Prelude Breath Beats** (~14 min new content, addresses
  information avalanche)
- **9 orphan unlock retrofits** (Trade Empire, Crafting,
  Chess, Collector's Arena, Dead Man's Circuit, Casino, Fight
  Arena, Mechronis Academy, Crew Breeding Program)
- **1 Year Two / Season 2 hook** (rescue the Advocate's body
  from New Babylon stasis, requires 5+ generations Pure
  bloodline)

### 6.2 Deferred Tasks (Post-Plan-Exit)

The following work is **blocked by plan mode** and must be
performed after `ExitPlanMode`:

1. **Save the three source docs as appendices** in
   `docs/design/`:
   - `docs/design/EPOCH_WITNESS_SYSTEM.md` — verbatim content
     from the user's conversation message starting at *"# THE
     EPOCH WITNESS SYSTEM"*
   - `docs/design/ADVOCATES_BOX_DESIGN.md` — verbatim content
     starting at *"# THE ADVOCATE'S BOX"*
   - `docs/design/ADVOCATES_TESTAMENT.md` — verbatim content
     starting at *"# THE ADVOCATE'S TESTAMENT"*
2. **Copy this plan file** into the repo at
   `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md`
3. **Commit all four files together** on
   `claude/game-narrative-design-lIeB5`
4. **Push** to origin

### 6.3 Verification

After the deferred tasks complete, verify Rev 6 by:

1. **File presence:**
   ```
   ls -la docs/design/EPOCH_WITNESS_SYSTEM.md
   ls -la docs/design/ADVOCATES_BOX_DESIGN.md
   ls -la docs/design/ADVOCATES_TESTAMENT.md
   ls -la docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md
   ```
2. **Plan file end-state:** `wc -l docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md`
   should be ~8,000+ lines (Rev 5 ended at 6,239; Part VI
   adds approximately 1,800-2,000 lines).
3. **Cross-referencing:** Every Section 5 file path mentioned
   in Part VI should resolve to either an existing file in the
   repo or a `NEW` annotation. Spot-check 5 random file
   references.
4. **Contradiction resolution scan:** For each of the 9
   contradictions in Section 4, verify the resolution does
   not require rewriting any existing committed file.
5. **Seed→Echo→Revelation audit:** For each of the 9 orphan
   features in Section 2.2, verify the Seed beat is in the
   Prelude or Act 1, the Echo beat is in Act 1 or Act 2, and
   the Revelation beat is in the act where the orphan
   currently unlocks.
6. **Breath Beat insertion check:** For each of the 5 Prelude
   Breath Beats in Section 3.3, verify the placement
   (between Beats A-B, C-D, D-E, F-G, H-I) does not create
   a beat-numbering conflict with the existing
   `preludeBeats.ts` state machine spec from Part V (C).

### 6.4 What Rev 6 Does NOT Do

To prevent scope creep, Part VI is explicit about what is
**out of scope**:

- **No new acts.** Rev 6 does not add Act 6 or restructure
  Acts 1-5.
- **No scene rewrites.** All Rev 5 player-facing beats stand.
- **No dialog rewrites.** All existing authored files
  (`elara-vo-script.md`, `mobileNarratorDialog.ts`,
  `lyraVoxDialog.ts`, etc.) stand. Rev 6 only adds new
  attribution layers (e.g., Lyra Vox voice + Advocate words).
- **No Year Two content.** The Sacrum Year Two reveal, the
  Antiquarian "Daniel" reveal, the Yog-Nathal Stage 4 event,
  and the rescue of the Advocate's body are **all reserved
  for Season 2**. Rev 6 only seeds them.
- **No Vertical Slice changes.** The Part V (D) Vertical Slice
  spec stands as-is. The Vertical Slice should still be the
  first thing built; Rev 6 systems integrate after the slice
  is validated.

### 6.5 Updated Shortest Path to a Shippable Game

The Rev 5 shortest-path order remains correct, with Rev 6
content slotted in:

1. **Build the Vertical Slice** (Part V (D)) — 2 weeks
2. **Expand to full Prelude** using Part V (C), **plus add
   the 5 Breath Beats** from Part VI Section 3.3 — 5-7 weeks
3. **Record Part V (B) dialog and commission art**, **plus
   the Antiquarian's voice clone session** from Part VI
   Section 1.2 — 3 weeks parallel
4. **Build Act 1** using Part V (A), **plus the 9 Orphan
   Seed/Echo retrofits** from Part VI Section 2.2 — 9-13
   weeks (slightly longer than Rev 5 estimate due to retrofit
   work)
5. **Author Act 2-5 beat breakdowns** in the Part V (A)
   format, **plus integration points from Part VI Section 5**
   — 5 weeks design work
6. **Build the Universal Effects Bus** from Part VI Section
   5.1 — 2 weeks (this is the most architecturally
   important new system; it underpins every Epoch Witness
   vote consequence)
7. **Build Acts 2, 3, 4, 4.5, 5, Endgame** with all Rev 6
   systems integrated — remaining production
8. **Build the Sacred Chamber + Blood Weave + Demon
   Summoning** during Act 3 production — Rev 6 Section 5.2
9. **Build the Crew Breeding Program** during Act 3
   production — Rev 6 Section 5.3
10. **Build the Epoch Witness System** as Acts 3-5 are
    being built — Rev 6 Section 5.1
11. **Stage 1-3 Hierarchy Corporate Escalation** as Acts 4-5
    are wired together — Rev 6 Section 5.5

**Stage 4 Yog-Nathal, Year Two Advocate's body rescue, and
Season 2 Daniel reveal are intentionally NOT in the Year One
build path.**

### 6.6 The Rev 6 Design Thesis

Rev 6 is, fundamentally, **about respecting the player's
attention**. Three new principles drive every addition:

1. **Discovery follows Seed → Echo → Revelation.** Players
   should never be told what a system is before they have
   wondered what it is.
2. **Onboarding requires Breath Beats.** Players should never
   be taught more than 2 new systems per beat. Quiet moments
   are not filler; they are pacing infrastructure.
3. **History is a community decision.** The Epoch Witness
   System lets the player vote on what *already happened* —
   which is the most honest acknowledgment that history is
   what the living agree to remember. The Antiquarian writes
   it down. The Shadow Tongue tries to edit it. The player
   stands between them.

The Engineer's sacrifice (Rev 4), the Witnessing thesis
(Rev 1-3), and the Advocate's distribution (Rev 6) are now
**three stories about the same thing**: *what cannot be taken
by force can only be given freely, and the universe is built
by what is given*.

This is the spine. Everything else is mechanism.

---

---

## Section 7 — Existing Crew/Army Systems Already in Code (Audit)

User question: *"Where is the crew cloning/breeding? The Crew
Missions? The Army recruitment? Are those existent?"*

**Answer: Yes — all three exist in the codebase, and they are
substantially more developed than Parts I–V acknowledged.**
Section 7 is a corrective audit that maps each existing system
into the act structure, applies Seed→Echo→Revelation, and
**reconciles contradictions between Section 1.4's Bene Gesserit
spec and the actual code**.

### 7.0 What Was Found in the Codebase

A read-only audit of the repo found the following files for
these three systems:

**Crew Breeding / Cloning / Genetics:**
- `apps/client/src/game/crewGenetics.ts` (500 lines) —
  **the canonical genetics system**
- `apps/client/src/game/crewBirth.ts` — offspring generator
- `apps/client/src/game/crewManagement.ts` — crew roster
- `apps/client/src/game/crewAwakening.ts` — cryo wake
- `apps/shared/crewBreeding.test.ts` — breeding tests
- `apps/shared/crewPersistence.ts` — save state
- `apps/server/routers/crew.ts` — crew API

**Crew Missions:**
- `apps/shared/crewMissions.ts` (430 lines) —
  **the canonical crew dispatch system**
- `apps/shared/crewBalance.ts` — balance constants
- `apps/shared/crewTradeIntegration.ts` — Trade Empire bridge
- `apps/shared/crewDmcBridge.ts` — Dead Man's Circuit bridge
- `apps/shared/crewTick.ts` — time tick handler

**Army Recruitment:**
- `client/src/data/armyRecruitment.ts` (911 lines) —
  **the canonical army system**
- `client/src/stores/armyStore.ts` — Zustand store
- 20 missions across 5 sectors with three-part typed briefings
  (Kael's Log, Elara's Assessment, Human's Intel) and class-based
  recruitment dialogs

**These are not stub files. They are working, tested, large
systems with hundreds of lines of authored content already in
the repo. The Rev 5 plan barely acknowledges any of them.**
Rev 6 corrects this gap.

### 7.1 Contradiction with Rev 6 Section 1.4 (Bene Gesserit)

Section 1.4 proposed a "new" 7-type blood classification system
and "5 genetic stats." Both are wrong against the existing code.
**Section 1.4 is amended as follows:**

| Spec | Section 1.4 (wrong) | Codebase (canonical) |
|---|---|---|
| Genetic stats count | 5 | **6** |
| Stat names | Intellect, Reflexes, Empathy, Resilience, Adaptability | resilience, **intellect**, reflexes, empathy, **immunity**, adaptability |
| Bloodline classification | NEW: 7 types (PURE/HYBRID/DEMONIC/ADVOCATE/SAMSARA/NAMED/UNKNOWN) | **EXISTING: 9 founding bloodlines** as a Record (`void_resonance`, `iron_memory`, `crimson_vigil`, `temporal_echo`, `storm_circuit`, `lattice_prime`, `echo_synthesis`, `terminus_aegis`, **`blood_weave`**) |
| Blood Weave bloodline | New idea | **Already canonical** as `BloodlineId = "blood_weave"` in `crewGenetics.ts:108` |
| Hierarchy of the Damned | New idea | **Already canonical** in `crewGenetics.ts` template `tpl_abyssal_bloodsworn`: *"The Collector infiltrated the Abyss through Hell Gate and extracted genetic material from the Blood Weave — the Hierarchy's living nervous system. Mol'Garath's rage when he discovered the theft could be measured in destroyed star systems."* |
| Cloning pods | New idea | **Already canonical** as `IncubatorPod` interface, `MAX_INCUBATOR_PODS = 6`, `PodStatus = "empty" | "gestating" | "ready" | "malfunction"` |
| Lyra Vox built incubators | New idea | **Already canonical** in `crewGenetics.ts` header: *"Dr. Lyra Vox built the incubators into every Ark."* |
| Genetic templates | NEW: bloodClassification.ts | **EXISTING: GENETIC_TEMPLATES** with `tpl_terran_prime`, `tpl_demagi_ashborn`, `tpl_quarchon_observer`, `tpl_abyssal_bloodsworn`, `tpl_voltari_storm`, `tpl_construct_lattice` and more |
| Inbreeding mechanics | Not specced | **Already canonical**: `calculateInbreedingPenalty()` with full ancestry walking + lowest-common-ancestor detection |
| Genetic drift | Not specced | **Already canonical**: `calculateGeneticDrift()` |
| Trait categories | Not specced | **Already canonical**: `TraitCategory = "physical" | "mental" | "social" | "special"` + `GENETIC_TRAITS` array |
| Mutation rolls | Not specced | **Already canonical**: `rollMutation()` |
| Design influences | New | **Already documented in code header**: Massive Chalice, Birthright: The Gorgon's Alliance, Total War: Rome, Crusader Kings |

**Reconciliation (canonical Rev 6.1):**

1. **Use the existing `crewGenetics.ts` types and functions.**
   No new file `bloodClassification.ts` should be created. The
   existing `BloodlineId` enum and `FOUNDING_BLOODLINES` Record
   are the canonical blood classification system.
2. **The 6th stat is `immunity`.** Rev 6 Section 1.4 must include
   it. `Immunity` is the stat that resists the **Thought Virus
   contamination** (per `armyRecruitment.ts` mission 1-4 "Death
   Walkers" who are *"Thought Virus survivors with natural
   immunity"*). This is the rev 6 canonical link between
   genetics and the Hierarchy/Thought Virus arc.
3. **The Blood Weave bloodline already exists.** It is one of
   the 9 founding bloodlines. It does not need to be invented;
   it needs to be **explained**. Rev 6 canonically defines it as
   *the bloodline carrying a fragment of the Advocate's
   pre-corruption Blood Weave architecture*. Players whose crew
   members have BloodlineId `blood_weave` are carrying her work
   in their cells.
4. **The `tpl_abyssal_bloodsworn` template is the rev 6
   canonical entry point for Hierarchy genetics.** The lore
   already says the Collector stole demonic genetic material
   from the Blood Weave during a raid through Hell Gate, and
   Mol'Garath was furious. **Mol'Garath being already named in
   `crewGenetics.ts` means the Hierarchy is a canonical
   pre-existing system, not a Rev 6 addition.** Rev 6 only adds
   the structural detail (CEO/COO/etc. corporate hierarchy).
5. **The Bene Gesserit Endgame from Section 1.4 is reframed:**
   players who maintain the `blood_weave` bloodline through 5+
   generations (using the existing `breedCrewMembers()`
   function) receive the Year Two Advocate's-body coordinates.
   No new mechanic — just a new use of existing mechanics.
6. **The Sacrum's Biological Seal (the second of seven seals)
   reads the bloodline registry directly.** A player whose ship
   contains at least one crew member with `BloodlineId =
   "blood_weave"` automatically passes the Biological Seal.
   This is the **mechanical link between the Crew Breeding
   Program and the Sacrum acquisition arc**.

**Section 1.4 amendments:** the Bene Gesserit layer is now
defined as **a layer of new lore and missions placed on top of
the existing crew genetics system**, not a parallel new system.
The math, the bloodlines, the templates, the inbreeding rules,
the cloning pods, and Mol'Garath's existence are all already in
code. Rev 6 names what the lore around them is.

---

### 7.2 Crew Breeding / Cloning — Act Anchors

The existing crew genetics + cloning pods + breeding system has
**no narrative onboarding** in the current Rev 5 plan. Players
arrive at the Incubator UI without context. Rev 6 anchors it.

**Anchor beats (Seed → Echo → Revelation):**

| Stage | Anchor beat | Existing code touched | What happens |
|---|---|---|---|
| **Seed** | Prelude Beat A (Cryo Wake) | `crewAwakening.ts` | The player's wake sequence is one of six possible wake events. Five other empty cryo pods are visible. Elara: *"You are the first to wake from your wave. There are five more pods on this row. They are not empty. They are sleeping."* The player learns that **the ship's population is gestational, not historical**. |
| **Seed** | Prelude Beat C (Engineering) | `crewGenetics.ts` header lore | A **dusty incubator pod** is visible behind a glass partition. Elara: *"Six incubator pods. Dr. Lyra Vox built them into every Ark. The Collector's archive is in there. None of them are running yet. They are waiting for someone to choose."* Player can read but not interact. |
| **Echo** | Act 1 Beat A (Mascoteer Trial Day 1) | `crewGenetics.ts` `breedCrewMembers()` | The Mascoteer pet breeding tutorial uses the **same `breedCrewMembers()` function** the human crew breeding will use later. Elara mentions: *"The math is the same for everything. The Collector's archive does not distinguish between species. He found that meaningful. He thought it was a kind of equality."* Player learns the math via pets. |
| **Echo** | Act 1 Beat I (Engineer's Transference) | `crewBirth.ts` `PendingOffspring` | The Engineer's transference protocol uses the same metaphysical architecture (voluntary sacrifice + genetic donation) as the Crew Breeding Program. The Engineer is the **first canonical demonstration that the system can save a life**. The player remembers this when they later use the system to create lives. |
| **Revelation** | Act 3 Sacrum opens / Sacred Chamber unlocks | `IncubatorPod` interface + `MAX_INCUBATOR_PODS = 6` | The **Bene Gesserit endgame** activates. The Crew Breeding Program formally opens via the Sacred Chamber's Mirror of Severed Memory — the Mirror tells the player that the cloning pods need names, and the names need bloodlines, and the bloodlines need futures. The Advocate's first complete fragment (recovered from the Mirror) **gives the player the names of the 9 founding bloodlines** as her own teaching. Elara: *"She just told me what the bloodlines are called. I had them in my database for 17,000 years. I never knew the names. She knew."* |
| **Mid-game cultivation** | Acts 3-5 | `breedCrewMembers()`, `calculateInbreedingPenalty()`, `calculateGeneticDrift()`, `calculateDiversityBonus()` | Player cultivates 1-3 generations of bloodlines across the rest of the year. |
| **Year One climax** | Act 5 Endgame | `BloodlineId = "blood_weave"` | A player who has at least one crew member with the `blood_weave` bloodline automatically passes the Sacrum's Biological Seal and unlocks the Year Two Advocate's-body coordinates as their post-credits reward. Players without it get the standard Bridge of Kael reveal but not the Year Two hook. |

**Key reframings:**
- **Lyra Vox is canonically the incubator architect**, per
  `crewGenetics.ts:8`. This reinforces Section 1.3's hellbox
  reframing — Lyra Vox is the human who designed the Ark's
  containment vessels for both the hellbox fragment and the
  cloning pods. She is the **mechanical bridge** between the
  Engineer and the Advocate.
- **The Collector is canonically the genetic curator**, per
  `crewGenetics.ts:6`. This means the Collector (Act 3 Garden
  boss in existing plan) is also the architect of the Bene
  Gesserit layer. Defeating him in Act 3 should canonically
  transfer his archive to the player's ship — **a previously
  unspecced reward**. Rev 6 makes this canonical: the Act 3
  Collector boss fight unlocks **the full GENETIC_TEMPLATES
  array** for breeding, where before only `tpl_terran_prime`
  was available.
- **The Necromancer is canonically the resurrection-protocol
  designer**, per `crewGenetics.ts:7`. This ties the
  Necromancer (Section 1.1.1 Epoch 2 Trap) to the cloning
  system: the same metaphysical architecture he used to
  possess the Silence's body is what makes Ark cloning work.
  The player is using the Necromancer's tools every time
  they hatch a clone. **This is intentionally uncomfortable.**
  Elara has a single line about it the first time the player
  uses an incubator pod (new, ~15 sec): *"The resurrection
  protocols. He designed them. We are using them. I want you
  to know that. I do not think it is a moral problem. I want
  you to know it is a problem."*
- **The Resurrectionist (Ne-Yon) maintains the cloning pods**,
  per `crewGenetics.ts:7`. The Resurrectionist is a **new
  named NPC** introduced in Rev 6 lore: a Ne-Yon pod-keeper
  who appears as a hologram interface within the Sacred
  Chamber when the player first opens the breeding UI. He is
  warm. He is sad. He is the only Ne-Yon the player meets in
  Year One who is **not** an antagonist.

**No new code files needed for Crew Breeding integration.** All
the work is narrative anchoring and 4-5 new lines of dialog
spread across Beats A, C, I, and Act 3.

---

### 7.3 Crew Missions — Act Anchors

The existing `apps/shared/crewMissions.ts` (430 lines) is the
**Crew Dispatch system** — the player sends crew members to
locations across Trade Empire sectors on time-gated missions
(routine 4-6h, challenging, dangerous). It is canonically
attributed to Adjudicator Locke: *"Send them somewhere
dangerous for glory. They may not come back. That's the
trade."* Design influences in code header: AC Brotherhood
assassin dispatch + XCOM squad risk + Massive Chalice expedition
narrative.

**This is one of the most important systems in the codebase
that Rev 5 ignored.** Crew Missions are the player's primary
way of **using** the crew they breed. Without missions to send
crew on, the Crew Breeding Program is just a baby factory.
With missions, it is **a multigenerational investment**: you
breed a clone, raise them, develop their skills, send them on
risky work, and they may not come back. Massive Chalice's core
emotional loop, in code, in this game, right now.

**Anchor beats (Seed → Echo → Revelation):**

| Stage | Anchor beat | What happens |
|---|---|---|
| **Seed** | Prelude Beat D (Cargo Bay) | The Trade Empire seed is already canonical. Add: a **mission board** is visible in the Cargo Bay corner. It has one mission posted: *"Salvage Sweep — Debris Belt"* (canonical mission ID `mission_salvage_sweep` from `crewMissions.ts:30`). The player cannot dispatch yet. Elara: *"That mission has been posted for 17,000 years. Nobody has taken it. It is the simplest one. The salvage is still there. The vacuum suits are still in the locker."* |
| **Echo** | Act 1 Beat D (Mascoteer Grand Final) | A canonical Adjudicator Locke private message arrives in the player's NPC Inbox (the inbox already exists per Prelude Beat H.3). Locke introduces herself: *"You are not yet a Trade Empire participant, but I have been watching your performance in the Mascoteer Trial. The skills are transferable. When you are ready to take real work, the salvage sweep is still on the board. Take it."* Player can read but not act. |
| **Revelation** | Act 2 Cycle A end | Trade Empire formally opens. The player's **first dispatchable mission is `mission_salvage_sweep`** — the same one from the Beat D seed. The player sends one crew member on a 6-hour real-time dispatch. **The mission resolves while the player is offline.** When they return, the mission report plays as a Locke voiceover. The mission is **always successful** (it is a tutorial dispatch with `baseSuccessChance: 0.90`). The player learns the loop: send, wait, return, reward. |
| **Mid-Act 2 cultivation** | Act 2 Cycle B | Mission difficulty ramps to "challenging." First risk of failure. First crew injury. First grief beat. |
| **Act 3 expansion** | Act 3 Trade Empire faction work | Crew Missions become **the player's hands** in the Trade Empire. Each faction unlock contributes mission templates. Locke's dispatch reports become a **regular companion voice**. |
| **Act 3 Sacred Chamber link** | Act 3 Sacrum opens | Crew Missions now feed **Blood Crystal** rewards. A successful mission with the right preferred role yields Common or Purified Blood Crystals (per Section 5.3 economy). The Sacred Chamber's ritual costs are now sustained by the player's mission dispatch loop. **This is the canonical link between Crew Missions and the Blood Weave magic system.** |
| **Act 4 high-stakes** | Act 4 Kael's Cells | A crew member can be permanently killed on a Dangerous-tier mission. The death triggers a Heart Crystal generation event (per Section 5.3). The player's grief is the magical material. |
| **Act 5 Endgame** | Act 5 Iron Lion's Last Stand | One crew mission per Iron Lion mission unlocks. The crew is **fighting alongside Iron Lion** in the Vortex Endgame. Every dispatch result feeds into the community pressure mesh for the Hierarchy Stage 3 vote. |

**Locke as a primary companion voice (canonical Rev 6 update):**
- Locke is currently a Trade Empire NPC referenced in passing
  by the Sacrum acquisition arc (Section 5.2).
- **Rev 6 promotes her** to a **canonical primary voice** for
  the Crew Missions system. She is the dispatch reports voice.
  She is the fourth most-heard NPC in the game after Elara,
  The Human, and Gary.
- **VO Bible entry 14:** Locke. Voice direction — dry,
  professional, slightly amused at her own pessimism. Adjudicator-
  precise. The line *"Send them somewhere dangerous for glory.
  They may not come back. That's the trade."* (already in code
  header) is her signature dialog tone reference.
- **New audio needed:** ~30 mission report variants (success,
  partial, failure, crew injury, crew death, surprise reward).
  Each ~15-20 sec. Total ~10 min new VO.

**Crew Missions ↔ Bene Gesserit Bloodline link:**

Per the Bene Gesserit Endgame (Section 5.3), the player's
multigenerational bloodline cultivation is meaningful only if
those bloodlines are **used in the world**. Crew Missions are
the consumer. A player who breeds a high-empathy Pure bloodline
will deploy that crew on **diplomatic/social-tier missions**
where empathy is the preferred stat and the failure cost is
emotional, not lethal. A player who breeds a high-resilience
Demonic bloodline will deploy them on **combat/dangerous-tier
missions** where the failure cost is permanent loss. **The
moral economy of the bloodline cultivation is enacted through
the mission dispatch choices the player makes with the
bloodlines they cultivate.** This is the canonical loop.

**No new code files needed for Crew Missions integration.**
The existing `crewMissions.ts` already has 30+ mission
templates wired to roles and rewards. Rev 6 only adds: 4-5 new
narrative anchors, Locke's promotion to primary voice, and the
link from mission rewards to Blood Crystals.

---

### 7.4 Army Recruitment — Act Anchors

**This is the largest existing system Rev 5 missed entirely.**
`client/src/data/armyRecruitment.ts` is **911 lines** of
authored content covering 20 missions across 5 sectors. Each
mission has:
- Three-part typed briefing (Kael's Log + Elara's Assessment +
  Human's Intel — all already wired to canonical voices)
- Class-based recruitment dialog options (oracle, spy, soldier,
  engineer, assassin, etc.)
- A leader NPC with species, name, and full dialog
- A test mission (fight / cards / trade / quiz / etc.)
- Rewards (unit strength, loyalty, specialization, XP, dream
  tokens, cards)

**The army system is canonically Kael's legacy.** Every mission
has a *"RECRUITER'S LOG — ENTRY [N]"* from Kael describing his
own pre-Fall recruitment of the same unit. Kael is **the
canonical recruiter narrator** of this system. The player is
**re-recruiting Kael's old contacts** in the new era.

This is a **massive Kael-narrative engine** the Rev 5 plan did
not surface. Rev 6 surfaces it.

**Anchor beats (Seed → Echo → Revelation):**

| Stage | Anchor beat | What happens |
|---|---|---|
| **Seed** | Prelude Beat F (Briefing Room) | The contingency memo reveal already canonical. Add: a **second sealed file** in the briefing room labeled *"RECRUITER'S LOG — KAEL [SEALED]"*. Player cannot open. Elara: *"Kael's recruiting logs. Two hundred and thirteen entries. Sealed by his own authorization. He didn't want anyone to know who his contacts were until... I don't know what condition he was waiting for. Maybe he was waiting for someone to ask."* |
| **Echo** | Act 1 Beat E (Prince's Archive) | The young Kael flashback already canonical. Add: a **toy soldier** on the child Kael's shelf — a hand-carved wooden figure painted in Vanguard colors. Engineer (in flashback): *"He carved this himself. He named it Kira. He said when he grew up he was going to find a Kira and ask her to be his friend."* (Foreshadow — Kira is the canonical leader of mission-1-1's Vanguard, per `armyRecruitment.ts:103`.) |
| **Echo** | Act 1 Beat I (Engineer's Transference) | Just before the transference battle, the Engineer says one new line: *"Kael, if I survive this — which I won't — find Kira. She's still alive. The Vanguard is still alive. They have been waiting since the Battle of Nexon for someone to tell them what to do. Tell them you came from me. They will believe you. They will follow."* This is the **Echo that becomes the player's mission**. Kael does not get to follow up; the player will. |
| **Revelation** | Act 2 Cycle B end | After Nexon falls in the flashback, the player returns to the present and the **Army Recruitment system formally unlocks**. The seal on Kael's Recruiting Logs breaks. Mission-1-1 (the Vanguard recruitment, with Kira) is the first available mission. The player has known her name since Act 1 Beat E. **They have been waiting for her since they were a child holding a wooden toy.** This is one of the most emotional unlocks in the game. |
| **Mid-Acts 2-3 expansion** | Acts 2-3 Trade Empire faction work | The 5 Army Recruitment sectors map to the 5 Trade Empire sectors. **Each Trade Empire faction completion unlocks 4 Army Recruitment missions** (5 sectors × 4 missions = 20, matching the canonical 20-mission count). The systems are **interlocked**: Trade Empire opens the geography, Army Recruitment populates it with named units. |
| **Act 3 Sacred Chamber link** | Act 3 Sacrum opens | Recruited Army units can be **deployed to the Hierarchy Corporate Escalation events** as defenders. A player who has recruited the Vanguard can call them to defend during a Stage 1 Reconnaissance event. **Army Recruitment becomes the player's standing defense against the Hierarchy.** |
| **Act 4 Kael Cells link** | Act 4 Cell 1 (Jailer) | The Jailer cell unlocks a Kael memory of one of his own recruitment trips. The player plays through a Kael flashback recruiting one of the Army units that is also currently in the player's roster. **The player and Kael recruit the same unit, 17,000 years apart, and the unit chooses to follow both of them.** Powerful. |
| **Act 5 Endgame** | Act 5 Iron Lion's Last Stand | All recruited Army units are deployable in the Cades FPS missions. The player who has recruited **all 20 units** unlocks an additional Iron Lion mission (Mission 8) where Iron Lion personally thanks the Recruiter (Kael — and now the player) for the army he was promised but never lived to see. **Bond 90+ moment.** |

**Three-part briefing system as canonical narrator showcase:**

The army recruitment briefings already use **Kael's Log + Elara's
Assessment + Human's Intel** as a triple-narrator structure. This
is the **first place in the game where all three pre-existing
narrators speak in succession on the same topic**. Rev 6
canonicalizes this format as the **Army Briefing Triple** — the
template for any future mission that requires multi-perspective
context.

The Human's intel is canonically **rendered with strikethrough
text** (per `armyRecruitment.ts:144`: *"The ~~Drift~~ is built on
salvaged Inception Ark ~~components~~"*). This is the canonical
visual representation of his memory degradation — words he is
not sure he should be saying. **Rev 6 promotes this strikethrough
treatment to a game-wide convention** for any line The Human
speaks about a topic that the Authority has tried to bury. Every
Human line in the game can use this visual treatment when it
fits.

**Kira as a major Year One NPC (canonical Rev 6 promotion):**

Per `armyRecruitment.ts:103`, Kira is the leader of the Vanguard
in mission-1-1. Per the Kael Echo above, she is canonically the
woman the child Kael named his toy soldier after. **Rev 6
canonicalizes Kira as the third major Year One NPC** (after Vex
Solène and Locke):
- She knew Kael personally
- She remembers him fondly
- She does not know he is dead until the player tells her
- The moment she learns is **one of the canonical grief beats
  of Act 2**

**New audio needed for Army Recruitment narrative anchoring:**
- 1 Engineer Beat I new line about Kira (~10 sec)
- 1 Engineer Beat E flashback line about the toy (~8 sec)
- 1 Elara Beat F line about the sealed logs (~12 sec)
- ~20 Kael "Recruiter's Log" entries (already authored as text
  per `armyRecruitment.ts`, but canonically they should be
  recorded as voiceover — this is **a new ~15-min Kael voice
  session**)
- ~5 Kira recruitment dialog lines for mission-1-1 grief beat
- Voice profile for Kira: VO Bible entry 15 (new). Direction:
  hard-edged Vanguard commander, uncertain underneath, rare
  warmth that drops in when she remembers Kael.

**No new code files needed for Army Recruitment integration.**
The existing 911-line `armyRecruitment.ts` is the canonical
data file. Rev 6 adds narrative anchors, the Kira reveal, and
the Trade Empire ↔ Army Recruitment ↔ Sacred Chamber linkage.

---

### 7.5 The Triangle — Crew Breeding, Crew Missions, Army Recruitment

Sections 7.2, 7.3, and 7.4 describe three systems that **already
exist in code** and **share an underlying narrative**: the
player is rebuilding a civilization, and the universe lets them
do it through three interlocking loops.

**The Triangle:**

```
          CREW BREEDING (private)
              /              \
             /                \
            /                  \
   CREW MISSIONS  ──────  ARMY RECRUITMENT
   (intimate dispatch)    (public coalition)
```

- **Crew Breeding** is the **private** loop. The player makes
  decisions about lineages, classifications, and bloodlines in
  a quiet, contemplative space. Massive Chalice / Crusader
  Kings emotional register.
- **Crew Missions** is the **intimate** loop. The player sends
  the people they bred on dispatches that will hurt if they
  fail. AC Brotherhood / XCOM emotional register.
- **Army Recruitment** is the **public** loop. The player
  builds a coalition of named factions across the galaxy,
  inheriting Kael's contacts and continuing his work. AC
  Brotherhood guild management / Mass Effect coalition
  emotional register.

**The three loops feed each other:**

1. Crew Breeding produces clones with stat distributions.
2. Crew Missions consume those clones via dispatch (and may
   kill them — the cost of generation 1 is paid by generation
   2).
3. Crew Missions yield Blood Crystals (per Section 5.3), which
   feed Sacred Chamber rituals (per Section 5.2), which
   recover Advocate fragments (per Section 5.4 of Rev 5).
4. Army Recruitment populates the galaxy with named factions
   tied to Kael's history. Recruited factions deploy as
   defenders against Hierarchy Corporate Escalation (per
   Section 5.5).
5. Hierarchy events apply pressure on the player's bloodlines
   (Demonic contamination per Section 5.3 economy), forcing
   Crew Breeding decisions about which lineages to prioritize.
6. **The Triangle is the canonical Year One growth loop.**
   Everything else (Trade Empire, Card Game, Casino, etc.) is
   either a feeder or a consumer of the Triangle.

**The Triangle is also the canonical answer to "what does a
player do in Year One?":**
- Acts 1-2: learn the systems (Mascoteer pets → Crew
  Breeding seed; Trade Empire opens → Crew Missions seed;
  Sealed Recruiter's Logs visible → Army Recruitment seed)
- Acts 3-4: cultivate (1-3 generations of bloodlines;
  20-50 dispatched missions; 5-15 recruited army units)
- Act 5: deploy (army units defend the Vortex Endgame;
  bred clones fight in Cades FPS; Crew Mission rewards
  fund the final Sacred Chamber rituals)
- Year Two: the Triangle continues; the player who
  cultivated the `blood_weave` bloodline through 5+
  generations gets the Advocate's-body coordinates as
  the Year Two opening hook

**This Triangle is what the existing code was always going
to do.** Rev 6 names it. Rev 5 missed it because the
existing code was undocumented relative to the narrative
spine.

### 7.6 Updated File Inventory (Rev 6.1)

The Section 5 file inventories are amended:

**Files NOT to create (already exist in code):**
- ~~`shared/bloodClassification.ts`~~ — use existing
  `apps/client/src/game/crewGenetics.ts`
- ~~`shared/cloneLifecycleConfig.ts`~~ — use existing
  `IncubatorPod` interface in `crewGenetics.ts`
- ~~`server/services/bloodline_generation.ts`~~ — use
  existing `breedCrewMembers()` in `crewGenetics.ts`
- ~~Crew Mission new files~~ — use existing
  `apps/shared/crewMissions.ts` + `apps/shared/crewBalance.ts`
- ~~Army Recruitment new files~~ — use existing
  `client/src/data/armyRecruitment.ts` +
  `client/src/stores/armyStore.ts`

**Files to create (Rev 6 additions only):**
- `data/advocateBloodlineLore.ts` NEW — narrative annotations
  for the existing 9 founding bloodlines (especially
  `blood_weave`)
- `data/collectorsWorkMissions.ts` NEW — Bene Gesserit-tier
  missions written in the Advocate's voice (these consume
  existing crew + bloodlines but add a new mission category
  on top of `crewMissions.ts`)
- `data/locke-vo-script.md` NEW — VO Bible entry 14, Locke's
  voice profile
- `data/kira-vo-script.md` NEW — VO Bible entry 15, Kira's
  voice profile
- `data/resurrectionist-vo-script.md` NEW — Ne-Yon
  pod-keeper hologram dialog (Sacred Chamber first-visit)
- ~10 new dialog lines spread across Beats A, C, D, E, F, I
  for the Seed/Echo seeding work

**Total new code files for Sections 7.2-7.4: 5 data files +
~10 lines of dialog. Significantly less than Section 1.4
originally proposed.** The reduction is the canonical correction:
**reuse what exists; name what was unnamed; ship faster**.

### 7.7 Verification Steps for Section 7

After plan exit, verify Section 7 by:

1. **Read the existing files** to confirm the canonical
   types and functions referenced:
   - `apps/client/src/game/crewGenetics.ts` lines 23-25
     (GENETIC_STATS), 108 (BloodlineId enum), 132
     (FOUNDING_BLOODLINES record)
   - `apps/shared/crewMissions.ts` lines 27 onwards
     (CREW_MISSION_TEMPLATES)
   - `client/src/data/armyRecruitment.ts` (the full file —
     20 missions across 5 sectors)
2. **Confirm the contradictions in 7.1** are real by reading
   Section 1.4 of this plan and comparing.
3. **Audit `tpl_abyssal_bloodsworn`** in `crewGenetics.ts`
   for the canonical Mol'Garath / Hierarchy / Blood Weave
   references — these prove the Hierarchy is pre-existing.
4. **Cross-check** the existence of `Resurrectionist` and
   `Necromancer` references in the `crewGenetics.ts` header
   (lines 6-8). These prove the Bene Gesserit lore was
   always going to land here.
5. **Verify Kira's existence** in
   `client/src/data/armyRecruitment.ts:103` and the toy
   soldier callback can be added narratively.

### 7.8 Section 7 Summary

**Crew Breeding/Cloning, Crew Missions, and Army Recruitment
are all canonical existing systems.** The Rev 5 plan failed to
acknowledge them. Rev 6 corrects the gap.

- Crew Breeding: canonical via `crewGenetics.ts` (500 lines).
  9 founding bloodlines, 6 stats, full inheritance + drift +
  inbreeding math, incubator pods, and **Mol'Garath, the
  Necromancer, the Resurrectionist, and the Collector are
  all already named in the code header**.
- Crew Missions: canonical via `crewMissions.ts` (430 lines).
  30+ mission templates wired to roles and rewards.
  Adjudicator Locke is the canonical voice. AC Brotherhood +
  XCOM + Massive Chalice design influences are documented in
  the code header.
- Army Recruitment: canonical via `armyRecruitment.ts` (911
  lines). 20 missions across 5 sectors with Kael as the
  canonical recruiter narrator and a triple-narrator briefing
  format (Kael's Log + Elara's Assessment + Human's Intel).
  Kira is the canonical leader of mission-1-1. **Kael's toy
  soldier from his childhood was carved in her image**, per
  Rev 6 canonical addition.

**These three systems form the Triangle — the canonical
Year One growth loop**. They were always there. Rev 6 names
them.

**Section 1.4's proposed file additions are formally retracted**
in favor of reusing the existing files. The Bene Gesserit layer
is **a layer of lore on top of existing math**, not a new
parallel system.

**The Triangle is the answer to the user's question.**

---

---

## Section 8 — The Bigger Audit (Rev 6.2)

User question: *"Are there any other game systems left out?
What about the Mechronis stuff?"*

**Answer: Yes. Many. Including Mechronis. Including substantial
parts of what Rev 6 Sections 1.2, 5.1, and 5.4 described as
'new.'** Section 8 is the corrective second-pass audit that
expands the Section 7 finding into a full inventory.

### 8.0 The Real Scope of the Codebase

`apps/shared/` alone contains **326 files**. Many of them are
substantial, working, tested gameplay systems with hundreds or
thousands of lines of authored content. **Rev 5 acknowledged
roughly 30 of these. Rev 6 added another 7. That leaves
~290 files of code Rev 6 has not addressed.**

Not all 290 are equally significant. Some are infrastructure
(`gameStateHash.ts`, `settingsSchema.ts`, `xpCurve.ts`). Some
are tests. Some are season-bound content (`christmasInJuly.ts`).
But a substantial subset are **major narrative systems with
extensive authored content** that the plan needs to acknowledge.

### 8.1 Retraction — Rev 6 Sections That Described Pre-Existing Code as "New"

Sections 1.2, 5.1, and 5.4 of this plan described the
**Antiquarian** and the **Epoch Witness System** as new
Rev 6 additions. **Both are already in code.** The Section 7
methodology (audit before propose) should have applied here
first.

**Files that already exist for these "new" systems:**

| Rev 6 "new" system | Existing code (canonical source) |
|---|---|
| The Antiquarian as third narrator | `apps/shared/antiquarianVoManifest.json`, `apps/shared/antiquariansJournal.ts`, `apps/client/src/game/antiquarianRelationship.ts` |
| Antiquarian's Chronicle / Journal | `apps/shared/antiquariansJournal.ts` (`JOURNAL_ENTRIES` array, 1:1 mapped to broadcast episodes) |
| Epoch Witness System | `apps/shared/epochWitnessVotes.ts`, `apps/shared/epochWitnessVotesLate.ts` (with `AGE_OF_PRIVACY_VOTES` array containing `ap_v1` "THE LOGOS QUESTION" and `ap_v2` "THE PANOPTICON EXPANSION") |
| Epoch archetypes | `apps/shared/epochArchetypes.ts` (already exports `EpochArchetype = "the_inventor" | "the_watcher" | "the_advocate" | "the_seer" | "the_programmer" | "the_politician" | "the_witness"`) |
| Epoch unlock table | `apps/shared/epochUnlockTable.ts` |
| Epoch pass | `apps/shared/epochPass.ts` |
| Epoch zero triggers | `apps/shared/epochZeroTriggers.ts` |
| Year One votes | `apps/shared/yearOneVotes.ts` |
| Witnessing Hub | `apps/shared/witnessingHub.ts` (full dashboard deriver — *"Pure-function aggregator that takes the player's narrative flag set plus a few small runtime inputs and returns every panel's worth of data the WitnessingHubPage renders"*) |
| Witnessing Year One | `apps/shared/witnessingYearOne.ts` |
| Witnessing Runtime | `apps/shared/witnessingRuntime.ts` |
| Witnessing Validator | `apps/shared/witnessingValidator.ts` |
| Witnessing Asset Manifest | `apps/shared/witnessingAssetManifest.ts` |
| Witnessing Canon Cross-Reference | `apps/shared/witnessingCanonXref.ts` |
| Witnessing Integrations | `apps/shared/witnessingIntegrations.ts` |
| Witnessing Events | `apps/shared/witnessingEvents.ts` |
| Shadow Tongue Dictionary | `apps/shared/shadowTongueDictionary.ts` |
| Shadow Tongue VO | `apps/shared/shadow_tongueVoManifest.json` |
| All character VO manifests | `apps/shared/{elara,human,architect,collector,necromancer,degen,locke,meme,nilmorg,palimpsestHost,shadow_tongue,source,cades,agent_zero,antiquarian}VoManifest.json` |

**Section 5.1 file inventory is retracted.** The "NEW" file
list it proposed (`epochWitnessSystem.ts`,
`nexusPointVotes.ts`, `shadowTongueManager.ts`,
`epochUnlockDispatcher.ts`, `mandalaEffectEngine.ts`,
`archetypeAssignment.ts`) **all already exist** under
slightly different names in `apps/shared/`. The Section 5.1
client component list is also wrong — most of the proposed
components likely have parallel implementations already.

**Section 1.2 Antiquarian voice introduction is retracted.**
The Antiquarian already has a VO manifest in code, a
relationship file, and a journal system tied to broadcast
episodes. Rev 6 only needs to **map his existing system into
the act structure**, not invent him.

**Section 5.4 Antiquarian integration is retracted as
"new."** It is reframed as **anchor beats for an existing
system**. The Seed→Echo→Revelation arc still applies, but
the system is not new — only the act-anchoring is new.

**Rev 6 → Rev 6.2 corrective principle (formal):**

> **Audit before propose.** For any system Rev 6 describes as
> "new," first run a `Glob` for related filenames in the
> codebase. If files exist, the system is already there and
> Rev 6's job is to **anchor it into the act structure**, not
> to invent it. **The codebase is the canon.** The plan
> integrates with the canon. The plan does not replace it.

This principle is now applied retroactively across all of
Part VI. **Sections that propose new files should be re-read
through Section 8's lens before any of those files are created.**
A safe pre-implementation rule: **if the file path Rev 6
proposes already exists in the codebase, treat the existing
file as the source of truth and adapt the Rev 6 lore to fit
its existing types and exports.**

### 8.1.1 Pre-existing Witnessing System Discovery

The `witnessingHub.ts` header is canonical:

> *"The Hub page is a dashboard for the Witnessing Narrative
> Proposal. Every section of the proposal surfaces here:
> Prelude intro state + available missions; Kael Fragment
> F1-F6 progress; Act progression (Prelude / Act 1 / 2 / 3 /
> 4 / 4.5 / 5); Year One calendar — current month + upcoming
> beats; Milestone Chronicle feed (entries that have fired);
> Appendix A / B / C shell status summary; Infiltration path
> commitment; Dischordia Cycle + Palimpsest phase (if
> available)."*

**The Witnessing Narrative Proposal already has an
implemented dashboard hub in code.** The plan in Parts I-V
described what should be on the dashboard without realizing
the dashboard already existed. **This is the largest single
retroactive integration target in Rev 6.2.**

The Witnessing Hub is also the canonical answer to "where
does the player see the whole game state at once?" It is
the **command center for the narrative spine**. Rev 5's plan
referred to it indirectly via "Living Ark state" and "Bond
trackers" and "Polarity meter," but never named it as a
single integrated dashboard. **It is one screen. It is
already implemented. It is the home of every Rev 6 Section
1-7 system the plan has been describing.**

The `WitnessingHubPage.tsx` (client side, not yet read by
this audit but inferable from `witnessingHub.ts:9`) is the
canonical visual home for the Witnessing system. Every
narrative element Rev 5 and Rev 6 specced — Kael Fragments,
Act progression, Calendar, Chronicle feed — has a panel
slot already.

---

### 8.2 Mechronis Academy — Full Integration

**To answer the user's question directly: yes, the Mechronis
stuff exists.** It is one of the most architecturally
significant existing systems Rev 5 missed.

**Existing files:**

| File | Purpose |
|---|---|
| `apps/shared/mechronisProfessors.ts` | Adult Architect-programmed Professors — one per Archon |
| `apps/shared/mechronisLessons.ts` | Lesson grading system (Fail/Pass/Honor/Distinction) |
| `apps/client/src/data/mechronisSlideshow.ts` | Mechronis cinematic slideshow data |
| `apps/client/src/pages/MechronisAcademyPage.tsx` | Academy main page |
| `apps/client/src/game/techTree.ts` | Tech research tree |
| `apps/server/routers/techTree.ts` | Tech tree API |

**The Three Forms Framework (canonical):**

`mechronisProfessors.ts:4-9` says it explicitly:

> *"Each Archon exists now in THREE programmed forms:
> 1. The original Archon (mostly dead/missing/imprisoned)
> 2. Mascoteers — child versions, Dreamer-reprogrammed
>    (Celebration)
> 3. PROFESSORS — adult teaching versions, Architect-programmed
>    (Mechronis Academy)"*

**This is one of the most important canonical systems in the
entire game and Rev 5 did not name it.** It is the
**theological spine** of the Archon characters — every Archon
character the player meets exists in three forms simultaneously,
controlled by three different power centers (originally
autonomous, then captured by the Dreamer for Celebration, then
re-captured by the Architect for Mechronis Academy). The player
can encounter the **same character three times in three forms**
across the game.

**Three Forms — canonical grading and tone:**

| Form | Programmer | Tone | Grading | Player relationship |
|---|---|---|---|---|
| Original Archon | Self / no one | Variable, free, often broken | None | Mythic — appears rarely, treats player as equal |
| Mascoteer (child) | The Dreamer | Playful, earnest, dreamlike | Death roll on failure (`celebrationTrial.ts`) | Child mentor — warm, can die |
| Professor (adult) | The Architect | Cold, precise, syllabus-bound | Fail/Pass/Honor/Distinction | Cold instructor — cannot improvise, cannot recognize student excellence |

**Per `mechronisProfessors.ts:13-19`:**

> *"They cannot improvise — they teach from the Architect's
> syllabus. They grade harshly — the Architect's metric, not
> their own. They cannot recognize students who exceed them.
> They DO remember every lesson ever taught."*

**This is a horror layer on Mechronis Academy that Rev 5 did
not surface.** The Professors are programmed beings who
**believe they are the Archons** but **are not**. Encountering
the original Archon and then the Professor and then the
Mascoteer of the same being is a **canonical identity-horror
experience** the game can deliver.

**Anchor beats (Seed → Echo → Revelation):**

| Stage | Anchor beat | What happens |
|---|---|---|
| **Seed** | Prelude Beat E (Mess Hall) | A diploma hangs on the wall, signed by **Headmaster Kanevas** (canonical, `mechronisProfessors.ts:50` `prof_conductor`). Elara: *"That's a Mechronis Academy diploma. The Headmaster's signature is on it. Dated 850 A.A. The Headmaster is still alive. He still teaches. He doesn't remember signing this one."* |
| **Echo** | Act 1 Beat A (Mascoteer Day 1) | Gary mentions: *"The Academy and the Trial are not the same thing. The Trial is the children. The Academy is the adults. I went to both. The same man taught me twice. Twenty years apart. Different lessons. Same face."* |
| **Echo deepening** | Act 2 Cycle A | A Mechronis Academy admission letter arrives in the player's NPC Inbox. Elara: *"They sent you an admission letter. You did not apply. The Architect's records show you graduated three lifetimes ago. The Headmaster does not remember the previous graduations."* |
| **Revelation** | Act 2 Cycle B (mid-act) | Player formally enters Mechronis Academy. First Professor encountered: Headmaster Kanevas (the Conductor, Archon 1). The player has already met the Conductor in his Mascoteer form during Act 1 Cycle A. **The two beings have the same face and do not recognize each other.** Canonical horror. |
| **Mid-Act 2-3** | Acts 2-3 | Player attends lessons across all 12 Mechronis Professors (one per Archon). Each lesson is graded. The lesson grades feed the Tech Tree. The player can also encounter the **original Archons** (still mostly dead/missing/imprisoned) as side-content discoveries. |
| **Act 4 horror** | Act 4 Kael Cells | One Kael memory cell is set inside a Mechronis classroom. The player plays through Kael's own Mechronis education from the inside — and discovers the moment the Architect first programmed his teacher. **The player has been a student of the system that broke Kael.** |
| **Act 5 climax** | Act 5 Mission 5 or 6 | Headmaster Kanevas is encountered in his original Archon form, dying. He recognizes the player. *"You were my best student. I never told you. The Architect did not let me know how to recognize excellence. I am sorry. Tell the children — when you find them — that I loved them."* He dies. |

**The Architect's hidden agenda for the Academy:**

`mechronisProfessors.ts:39-40` references each Professor's
`hiddenAgenda` field. The Architect is using Mechronis Academy
to **train students for a purpose they do not know** — likely
the Hierarchy's eventual pacification of the Potentials.
**Per Section 1.3 Hierarchy corporate structure, Mol'Garath
does not directly run the Academy.** It is a Syl'Vex operation
— the Corruptor's HR / Recruitment arm. Syl'Vex's method
(genuine friendship, slow conversion) is exactly what a
programmed Professor offers a struggling student over four
years of grading.

**Mechronis Academy ↔ Apprentices link:**
The Academy is also where the player **graduates from being
a student to being a teacher**. Players who reach Distinction
in any Professor's signature lesson can take on an Apprentice
of their own (see Section 8.3). The Academy is the canonical
unlock of the Apprentice system.

**Mechronis Academy ↔ Tech Tree link:**
Each lesson grade contributes Skill XP that feeds the Tech
Tree (`apps/client/src/game/techTree.ts`). The Tech Tree is
the canonical research progression system that gates many
later-game crafting recipes, ship upgrades, and ritual
component unlocks. **Rev 5 did not name the Tech Tree at
all.** Rev 6.2 names it as the existing engine for "what
the player can build."

**No new code files needed for Mechronis Academy
integration.** The 12 Professors, the lesson system, the
slideshow, the page, and the tech tree are all in code.
Rev 6.2 only adds: 4-5 new narrative anchor lines spread
across Beats E, A, F, and the Headmaster Kanevas death
scene in Act 5.

---

### 8.3 The Apprentices System — Sith/Jedi Loop

**Existing files:**

| File | Purpose |
|---|---|
| `apps/shared/apprentices.ts` | Apprentice generation (12 archetypes × gender × race × class × skills × rarity) |
| `apps/shared/apprenticeBetrayal.ts` | High-bond corruption + betrayal |
| `apps/shared/apprenticePermadeath.ts` | Death rolls during Celebration trial |
| `apps/shared/apprenticeRivalries.ts` | Apprentice-vs-apprentice rivalries |
| `apps/shared/apprentices.test.ts` | Tests |
| `apps/shared/celebrationTrial.ts` | The 4-week trial |
| `apps/shared/celebrationTrial.test.ts` | Tests |

**Per `apprentices.ts:1-17`:**

> *"APPRENTICES — Sith/Jedi-style custom companions. Players
> train Apprentices who become Romanceable companions on
> their ship. Each Apprentice is dynamically generated:
> 12 archetypes × gender × race × class × skills × rarity.
> Lifecycle: Recruit → Send to Celebration (4-week trial) →
> Graduate or die → If survives, joins ship as custom
> companion. Rules of this game: One Apprentice at a time.
> The old one must die before a new one can be trained.
> High-bond Apprentices can be corrupted, betray, or turn
> on you Sith-style based on your morality + their
> archetype. Mythic combinations exist. Most players will
> never roll one."*

**12 canonical archetypes:**
zealot, ghost, scholar, revenant, artisan, oracle,
wanderer, martyr, heretic, jester, sentinel, prodigal

**This is the canonical "BioWare romance + Knights of the
Old Republic apprentice" system.** It is enormous in scope
and Rev 5 did not mention it at all.

**Anchor beats (Seed → Echo → Revelation):**

| Stage | Anchor beat | What happens |
|---|---|---|
| **Seed** | Prelude Beat E (Mess Hall) | The player overhears a conversation between two crew members about *"the apprentice the previous Potential trained — she went to the Trial in the second month and never came back."* The phrase "the Trial" is mentioned with the gravity of a religious term. The player has no context. |
| **Echo** | Act 1 Beat C (Quinn's Crisis) | Quinn's crisis (canonical Rev 5 Act 1 Beat C) is reframed: Quinn is **not just a rival**, Quinn is **a candidate apprentice the player could mentor**. The Quinn arc becomes the canonical introduction to apprentice mentorship via a low-stakes preview — the player learns what mentoring costs them by helping Quinn through a single crisis. **Whether Quinn lives or dies in the Mascoteer Trial Final (forced loss to The Masked One, per Rev 5 Act 1 Beat D) is canonically the player's first apprentice-tier death.** |
| **Echo deepening** | Act 2 Cycle A (Mechronis Academy opens) | Reaching Distinction in any Mechronis Professor's signature lesson unlocks the Apprentice system formally. The Professor recommends a candidate. The first generated apprentice arrives in the player's Quarters. |
| **Revelation** | Act 2 Cycle B mid-act | The player formally recruits their first Apprentice. The four-week Celebration trial begins. The apprentice's lifecycle is now active. The death roll is real. |
| **Mid-game cultivation** | Acts 3-4 | Players cultivate 1-3 Apprentice generations (one at a time, the old one must die first per `apprentices.ts:13`). Each apprentice can: graduate (joins ship as custom companion), die during Trial, or corrupt and betray (per `apprenticeBetrayal.ts`). |
| **Act 4 betrayal beat** | Act 4 Cell 4 (White Oracle Cell) | If the player has at least one high-bond corrupt-leaning apprentice, that apprentice **becomes a playable opponent in Cell 4**. The player fights their own apprentice. The fight is canonical regardless of whether the player wants it. Some BioWare bonds end this way. |
| **Act 5 endgame** | Act 5 Mission 6 (Alliance of Adversaries) | Surviving apprentices join the Vortex Endgame as deployable allies. A player who has graduated 3+ apprentices unlocks an additional Iron Lion mission where the apprentices fight alongside Iron Lion's unit. **Mythic combination unlock:** a player who rolled a Mythic apprentice during character generation gets a unique Act 5 cutscene — the Mythic apprentice has been waiting for this moment since their first conversation. |

**Apprentices ↔ Crew Breeding link:**
Apprentices are **fully-formed adults**, not bred clones.
They are recruited externally (from the galaxy via Trade
Empire and Army Recruitment) and trained internally.
**Rev 6.2 canonically connects the systems:** an apprentice
who graduates can later contribute their genome to the
Crew Breeding Program (per Section 7.2). Their bloodline
becomes a **named bloodline** with their archetype as the
canonical trait. Breeding from a graduated apprentice is the
slowest and most rewarding path to a unique bloodline.

**Apprentices ↔ Romance:**
The "Romanceable companions on their ship" line in
`apprentices.ts:5` is canonical. Apprentices are **the
primary romance system in the game**. Elara, The Human, and
the Antiquarian are not romanceable — they are narrative
mentors. **Apprentices are the only romanceable characters.**
Rev 6.2 makes this canonical.

**Sith/Jedi morality alignment:**
Per `apprentices.ts:14-15`, apprentices' loyalty depends on
the player's **morality + their archetype**. A Light-aligned
player who trains a Heretic-archetype apprentice will face
betrayal. A Dark-aligned player who trains a Martyr-archetype
apprentice will face slow disillusionment. **The combinations
are the game.** This is the canonical answer to "what is the
Light/Dark polarity meter actually doing in the long run?" —
it is determining which apprentices stay and which betray.

**No new code files needed for Apprentices integration.** The
generation system, the trial, the betrayal, the permadeath,
the rivalries — all in code. Rev 6.2 adds: the Quinn
reframing in Act 1 Beat C, the Mechronis Distinction unlock
in Act 2 Cycle A, the Cell 4 betrayal beat in Act 4, and the
Act 5 deployment scenes.

---

### 8.4 Major Missing Systems — Anchor Table

Beyond Mechronis Academy and Apprentices (Sections 8.2-8.3),
the audit found ~20 additional **major** systems Rev 5 missed
that have substantial existing code. Each is given a one-row
canonical anchor below. Full Seed→Echo→Revelation breakdowns
should follow the patterns in Sections 7 and 8.2-8.3.

| # | System | Canonical files | Rev 6.2 anchor |
|---|---|---|---|
| 1 | **Galactic Dance** (faction interplay) | `galacticDance.test.ts`, `galacticDanceCinematics.ts`, `galacticDanceFactionNpcs.ts` | The canonical **inter-faction relationship engine**. Already drives faction reactions to player choices. **Anchor:** Act 3 Trade Empire faction work — Galactic Dance is the underlying relationship math. **Seed:** Beat D Cargo Bay (Trade Empire seed). **Revelation:** Act 3 first faction completion. |
| 2 | **Babylon Guilds** | `babylonGuilds.ts`, `babylonGuilds.test.ts`, `guildHall.ts`, `guildSignatureAbilities.ts`, `guildWonders.ts` | The canonical Mechronis Academy → Graduate Legion bridge. Guilds are the post-Academy social structure. **Anchor:** Act 2 Cycle B end — graduating from Mechronis Academy joins the player to a Babylon Guild. |
| 3 | **Graduate Legion** | `graduateLegion.ts`, `graduateLegion.test.ts` | What the player joins after the Academy. The Legion is canonically the **military/civic body of Mechronis Academy graduates**. **Anchor:** Act 2 Cycle B — joining a Guild and the Legion happens together. |
| 4 | **House Competition** | `houseCompetition.ts`, `houseCompetition.test.ts` | Hogwarts-style house competition between Mechronis student houses. **Anchor:** Act 1 Cycle A Mascoteer Trial — the Trial is canonically a House Competition event. The 4 rivals (Brindle, Quinn, Silver, The Masked One) are canonically house representatives. **This explains the rival structure Rev 5 specced.** |
| 5 | **Witnessing Hub** (page) | `witnessingHub.ts`, `witnessingHubPage` (inferred) | The dashboard for the Witnessing Narrative Proposal. Already implemented. **Anchor:** Prelude Beat I (Bridge) — the Witnessing Hub is canonically the Bridge's primary screen. The Captain's Chair activates it. |
| 6 | **Tower Defense** | `towerDefense.ts` | Already in code (Rev 5 specced it via Zephyr-9 unlock at Beat I). **Anchor confirmed.** Add link to existing file. |
| 7 | **Dead Man's Circuit (Racing)** | `deadMansCircuit.ts`, `dmcNamingPrompts.ts`, `dmcNamingPrompts.test.ts`, `crewDmcBridge.ts` | Racing system. **Crew can be deployed on DMC missions** via the bridge. **Anchor:** Section 2.2 Orphan 5 Seed→Echo→Revelation arc, plus the canonical link: DMC missions feed Crew XP and Crew Mission opportunities. |
| 8 | **Casino Games** | `casinoGames.ts`, `casinoGames.test.ts`, `degensCasino.ts`, `degenRelationship.ts`, `DegensCasinoPage.tsx`, `CasinoGamePanels.tsx`, `CasinoLeaderboardPage.tsx` | Full casino with leaderboards. The Degen is fully in code with relationship system. **Anchor:** Section 2.2 Orphan 6 + the canonical Degen reveal at Trust 8+. |
| 9 | **PvP Battle System** | `pvpBattle.ts`, `pvpBattle.test.ts`, `pvpCohorts.ts`, `pvpCohorts.test.ts`, `pvpEmotes.ts` | Full PvP with cohort matchmaking and emotes. **Anchor:** Act 4.5 Casino — PvP is the Casino's competitive layer. Player-vs-player matches are canonically run as Casino games hosted by The Degen. |
| 10 | **Co-op Raids** | `coopRaids.ts` | Multiplayer raids. **Anchor:** Act 5 Endgame — the Vortex Endgame is canonically a co-op raid for players who synchronize their Acts 5 timing. |
| 11 | **Vortex Incursion / Vortex Room Minigame** | `vortexIncursionRun.ts`, `vortexIncursionTemplate.ts`, `vortexRoomMinigame.ts` | The Vortex as a deployable system, distinct from the Vortex Endgame. **Anchor:** Acts 3-5 — Vortex Incursions are the Hierarchy's escalating attacks. Per Section 1.3 reframing, the Vortex is Ith'Rael's special-projects weapon. The Incursion Run is one deployment; the Room Minigame is one defense. |
| 12 | **Necromancer Cycle / Return** | `necromancerCycle.ts`, `necromancerReturn.ts`, `necromancerVoManifest.json` | The Necromancer's canonical recurrence system. Already in code. **Anchor:** Per Section 1.1.1, every "Silence" encounter after Epoch 2 is the Necromancer. The Necromancer Cycle is the canonical engine for his appearances. **Section 1.3 Necromancer-as-Silence reveal** lands on the existing Necromancer Cycle ticks. |
| 13 | **Substrate Dungeon** | `substrateDungeon.ts` | A dungeon set in the Ark's substrate layer (where the Advocate's fragments live, per Section 1.1). **Anchor:** Act 3 Sacred Chamber unlocks → Substrate Dungeon becomes accessible as the dimensional fold's deeper exploration layer. |
| 14 | **Personal Quarters / Player Housing** | `personalQuarters.ts`, `playerHousing.ts`, `cabinArt.ts`, `quarterVisitors.ts` | The player's personal cabin on the Ark, with visitor system. **Anchor:** Prelude Beat C end — the player gets their cabin assignment after Engineering. **Quarter Visitors** is the system for crew/apprentices/companions visiting the cabin. **First visitor: The Resurrectionist's hologram** delivering the introduction to the cloning pods (per Section 7.2). |
| 15 | **Class Questlines** (5 classes × ~1 questline each) | `questlineClassAssassin.ts`, `questlineClassEngineer.ts`, `questlineClassOracle.ts`, `questlineClassSoldier.ts`, `questlineClassSpy.ts` | Player class system with class-specific questlines. **Rev 5 did not name the player classes.** Per `armyRecruitment.ts` references (oracle, spy, soldier, engineer, assassin), the canonical 5 classes are: **Assassin, Engineer, Oracle, Soldier, Spy**. **Anchor:** Prelude Beat C crew role choice — the crew role is canonically the player class. Medical = Oracle, Combat = Soldier or Assassin, Exploration = Spy or Engineer. |
| 16 | **Faction Questlines** (Demagi 4 ch, Quarchon 3+, Voltari, Thaloria, Insurgency, Syndicate, NewBabylon, Humans) | `questlineDemagiCh1-4.ts`, `questlineQuarchonCh1-3.ts`, `questlineQuarchonFirstPattern.ts`, `questlineVoltari.ts`, `questlineThaloria.ts`, `questlineInsurgency.ts`, `questlineSyndicate.ts`, `questlineNewBabylon.ts`, `questlineHumans.ts`, `questlineElements.ts`, `questlineElementResolutions.ts`, `questlineDemagiGardensChildren.ts`, `questlineClones.ts` | Massive faction questline content. **Anchor:** Act 3 — each Trade Empire faction has a corresponding questline. Per Rev 5's Act 3 spec, the 6 faction biographies map to 6 of these questlines. The **Six Eyes biographies** Rev 5 specced are canonically the 6 faction questlines. |
| 17 | **Trade Empire Act 3** (specifically) | `tradeEmpireAct3.test.ts` | A specific Act 3 Trade Empire phase. Rev 5 covered Act 3 generally; this file is the canonical implementation. **Anchor:** Act 3 F-series missions. |
| 18 | **Witnessing Year One** | `witnessingYearOne.ts`, `witnessingYearOne.test.ts` | The Year One narrative engine. **Anchor:** every Rev 5 act is filtered through this engine. Rev 6.2 makes it canonical that **Year One narrative state lives in `witnessingYearOne.ts`**, not in any new file. |
| 19 | **Year One Votes** | `yearOneVotes.ts` | A separate system from Epoch Witness votes. These are canonically the **community-pressure** votes (the votes that aggregate community decisions). **Anchor:** Section 5.5 Hierarchy Stage 3 Mol'Garath offer — the canonical vote engine for that beat is `yearOneVotes.ts`. |
| 20 | **Engineer Bench Hints / Recordings / Governance Votes** | `engineerBenchHints.ts`, `engineerRecordings.ts`, `engineerGovernanceVotes.ts` | Three Engineer-specific systems. Rev 5 referenced bench hints. The **Engineer Recordings** system is canonical for Beat H.2 Engineer Logs. The **Engineer Governance Votes** is a canonical link from Engineer to the Governance Hub — his votes were recorded before his death and replay during Epoch Witness votes. **Powerful canonical detail.** |
| 21 | **Kael Fragment Watchers** (F1-F6 questline) | `kaelFragmentWatchers.ts`, `kaelFragmentWatchers.test.ts`, `appendixBKaelQuestline.ts`, `appendixBKaelQuestline.test.ts` | The **canonical Kael Fragment system** with F1-F6 progress tracking. Already in code. The Witnessing Hub displays Kael Fragment progress (per `witnessingHub.ts:13`). **Anchor:** the entire Kael arc from Act 1 Beat E through Act 4 Memory Cells is gated by Kael Fragment unlocks. **This is the canonical chronological backbone of the Kael narrative.** |
| 22 | **Acts Four Five Shells** | `actsFourFiveShells.ts`, `actsFourFiveShells.test.ts` | Acts 4 and 4.5 narrative shell system. **Anchor:** confirms Rev 5's Act 4 + Act 4.5 are canonical. The shell system handles the daily-loop transitions. |
| 23 | **Cycle Battles** | `cycleBattles.ts` | Canonical Act 1 cycle-battle definitions. Likely overlaps with `act1Opponents.ts`. **Anchor:** Act 1 Cycles A/B/C battle data. |
| 24 | **Dischordia Cycle** | `dischordiaCycle.ts`, `dischordiaCycle.test.ts` | Canonical TCG cycle progression. **Anchor:** the entire Dischordia card game progression engine. |
| 25 | **Palimpsest** (cinematic system) | `palimpsest.ts`, `palimpsest.test.ts`, `palimpsestEpisodes.ts`, `palimpsestCinematics.ts`, `palimpsestHostVoManifest.json`, `appendixCPalimpsest.ts`, `PalimpsestEpisodesPage.tsx` | A canonical **episodic cinematic system** with its own Host VO. Rev 5 did not name this. The Antiquarian's Journal entries are 1:1 with Palimpsest episodes (per `antiquariansJournal.ts:14`). **Anchor:** the Antiquarian narrates Palimpsest episodes. The player watches them as in-game broadcasts. **The Palimpsest is the canonical Antiquarian-narration system.** Section 5.4's Antiquarian integration is reframed: the Antiquarian narrates the Palimpsest (existing system) rather than narrating only Epoch Witness votes. |

**Additional discovery: the Palimpsest is the canonical
Antiquarian system.** Per `antiquariansJournal.ts`, the
Antiquarian writes journal entries 1:1 with Palimpsest
episodes — each broadcast triggers a Chronicle entry. The
Palimpsest Host has its own VO manifest. **The Antiquarian
is not just the Epoch Witness narrator — he is the canonical
narrator of the entire Palimpsest broadcast system.** Rev 6.2
elevates this: the Antiquarian's primary content delivery
mechanism is **the Palimpsest, not the Epoch Witness System**.

**The Palimpsest is canonically the player's evening
broadcast hour** — a stop-and-watch format where the Antiquarian
narrates events from the player's day, the community's day,
and the historical record, all through his lens. **This is
the canonical "breathing room" media** for players who want
narrative without gameplay. Players can watch the Palimpsest
during downtime to absorb story without progressing systems.
**This addresses Section 3's Breathing Room mechanic at the
meta-game level.** The Palimpsest is how the player breathes.

---

### 8.5 Minor Systems (Bucket Assignments)

The remaining ~30 systems found in `apps/shared/` and game
client folders are **smaller-footprint** but still need
canonical bucket assignments. Rev 6.2 sorts them into
five buckets:

**Bucket A — Infrastructure (no narrative anchor needed):**
`gameStateHash.ts`, `settingsSchema.ts`, `xpCurve.ts`,
`const.ts`, `contentSchemas.ts`, `contentIntegrity.test.ts`,
`themeCompliance.test.ts`, `narrativeValidator.ts`,
`gamification.ts`, `monetization.ts`, `battlePassConfig.ts`,
`cosmeticShop.ts`, `donationSystem.ts`, `economySinks.ts`,
`endgameSinks.ts`, `replaySystem.ts`, `recapSystem.ts`,
`streakSaver.ts`, `socialFeatures.ts`, `dynamicDifficulty.ts`,
`assetRegistry.ts`, `assetPromptTemplates.ts`,
`pageBackgrounds.ts`. **No narrative anchoring required.**
These run silently underneath the player experience.

**Bucket B — Companion / Narrator extensions** (canonical
anchor: the Bond-80 cutscene system from Rev 5):
`agentZeroRelationship.ts`, `antiquarianRelationship.ts`,
`degenRelationship.ts`, `elaraRelationship.ts`,
`humanRelationship.ts`, `lockeRelationship.ts`,
`shadowTongueRelationship.ts`, `sourceRelationship.ts`,
`companionDeepening.ts`, `companionSynergies.ts`,
`companionBattleReactions.ts`, `companionTraitThresholds.ts`,
`companionEpochDialogs.ts`, `companionComments.ts`,
`elaraGuardrails.test.ts`. **Anchor:** all of these feed the
existing Bond tracker. The Two Witnesses Meet Cutscene
(Rev 5 Act 5 mid) is canonically dispatched through this
relationship layer. **Vex Solène, Locke, the Degen, and the
Antiquarian all already have relationship files** — they
were always going to be major NPCs.

**Bucket C — Faction / Worldbuilding** (canonical anchor:
Act 3 Trade Empire faction work):
`factionRelationshipMatrix.ts`, `factionNPCs.ts`,
`potentialFactions.ts`, `potentialFactionNpcs.ts`,
`galacticDanceFactionNpcs.ts`, `voltariFactionData.ts`,
`voltariTranslation.ts`, `voltariTransmissions.ts`,
`extinctRaces.ts`, `syndicateWorlds.ts`, `spaceStations.ts`,
`signalBeacons.ts`, `contestedSectorGreetings.ts`,
`contestedCorridors.ts`, `babylonGuilds.ts` (also Section 8.4),
`generalAlaric.ts`, `darrenFessler.ts`, `darrenMemorial.ts`.
**Anchor:** Act 3 faction completion unlocks each of these
in turn. **Darren Fessler / Darren Memorial** is a canonical
named-NPC memorial subsystem the player encounters via a
side-quest in one of the New Babylon sectors — likely a
small, intimate quest about a single named loss.

**Bucket D — Content / Cinematics / Episodes** (canonical
anchor: the Palimpsest broadcast hour):
`palimpsestEpisodes.ts`, `palimpsestCinematics.ts`,
`broadcastLibrary.ts`, `transmissions.ts`,
`voltariTransmissions.ts`, `albumMemeScripts.ts`,
`memeEngineerShow.ts`, `memorableMoments.ts`,
`postVictoryCinematics.ts`, `cinematicDesign.ts`,
`songSlideshow.ts`, `songSlideshows.ts`, `songTriggerMap.ts`,
`silenceInHeavenAlbumAudio.json`,
`silenceInHeavenTracklist.ts`, `silenceInHeavenLoredex.ts`,
`westByGodTracks.ts`, `albumRegistry.ts`,
`loredexSongMap.ts`, `journalEntries.ts`. **Anchor:** the
Palimpsest is the broadcast home. The albums are the
soundtrack. The transmissions are the in-game radio. **All
of this content already exists.** Rev 6.2 makes it canonical
that **the player's evening broadcast hour aggregates from
these systems automatically**.

**Bucket E — Living Universe / Community** (canonical
anchor: the Living Universe pressure mesh from Rev 5):
`livingUniverseEvents.ts`,
`livingUniverseVoxRevelation.test.ts`,
`livingArkTouchpoints.ts`, `arkEventHandler.ts`,
`incursions.ts`, `monthlyEvents.ts`, `seasonalEvents.ts`,
`seasonalReplay.ts`, `friendlyChallenges.ts`,
`coopRaids.ts` (also Section 8.4),
`christmasInJuly.ts`, `christmasCrewBonuses.ts`,
`christmasCrewDangers.ts`, `epochZeroTriggers.ts`,
`epochPass.ts`, `epochUnlockTable.ts`,
`epochArchetypes.ts`. **Anchor:** these all feed the
Living Universe pressure meters Rev 5 specced. The
community-decision votes from Section 5.5 land here. **The
Christmas in July content is a canonical seasonal event**
— Rev 6.2 does not invent it but acknowledges it as one
of the Living Universe's planned annual beats.

### 8.6 Section 8 Summary

**The codebase is enormous. Rev 6.2 corrects two errors:**

1. **Rev 6 Sections 1.2, 5.1, and 5.4 described pre-existing
   systems as new.** The Antiquarian, the Epoch Witness
   System, and the Witnessing Hub all exist in code. Section
   8.1 retracts those Rev 6 sections and reframes them as
   anchor work for existing systems.
2. **Rev 5 missed dozens of major systems entirely.** Section
   8.2 (Mechronis Academy), Section 8.3 (Apprentices), and
   Section 8.4 (Major systems table) name 25 of them with
   canonical anchor beats. Section 8.5 buckets the remaining
   ~30 minor systems.

**The Triangle from Section 7.5 (Crew Breeding ↔ Crew
Missions ↔ Army Recruitment) is now a Pentagon:**

```
                MECHRONIS ACADEMY
                  (formal training)
               /                    \
              /                      \
   APPRENTICES                  CREW BREEDING
   (Sith/Jedi loop)             (private Bene Gesserit)
       |                                |
       |                                |
   ARMY RECRUITMENT  ──────────  CREW MISSIONS
   (public coalition)             (intimate dispatch)
```

**Five interlocking Year One growth loops.** Each feeds
the others. Each is already in code. Rev 5 saw two of them
(Mascoteers and Trade Empire). Rev 6.2 names all five.

**The canonical answer to "what does a player do in Year
One?" is now:**
- **Train** (Mechronis Academy → grades → Tech Tree)
- **Mentor** (Apprentices → 4-week trial → companion / death)
- **Breed** (Crew Breeding → bloodlines → Bene Gesserit endgame)
- **Dispatch** (Crew Missions → Locke voice → Blood Crystals)
- **Recruit** (Army Recruitment → Kira → Hierarchy defenders)

Plus the existing Year One loops:
- **Trade** (Trade Empire faction work)
- **Fight** (Card Game, Cades FPS, Fight Arena)
- **Race** (Dead Man's Circuit)
- **Gamble** (Casino, PvP)
- **Witness** (Epoch Witness System, Palimpsest broadcasts)
- **Build** (Crafting, Tech Tree, Sacred Chamber rituals)

**~12 simultaneous engagement vectors.** This is the
canonical scale of the game. Rev 5 specced ~5. Rev 6.2
acknowledges ~12.

### 8.7 Updated Build Order Implications

Section 6.5's "Updated Shortest Path" needs further amendment.
**The most important architectural insight from Section 8 is
that almost nothing should be built; almost everything should
be wired.** The systems exist. They need:

1. **Narrative anchor lines** in existing dialog files
2. **Witnessing Hub panel slots** for systems Rev 5 didn't
   know about
3. **Cross-system event firings** so that completing one
   system seeds another (e.g., reaching Distinction in a
   Mechronis lesson unlocks a candidate Apprentice)
4. **Palimpsest episode triggers** so the Antiquarian
   narrates major beats automatically
5. **Witnessing Validator entries** so the canonical
   cross-references stay consistent

**Estimated work shift from Rev 6 to Rev 6.2:**
- Rev 6 estimated ~30 new code files
- Rev 6.2 estimates **~5 new code files** + **~50 narrative
  anchor line additions** to existing files + **~10 panel
  registrations** in the existing Witnessing Hub
- Total work reduction: ~80%
- Total story coverage increase: ~3x (the systems were
  always there; now the plan acknowledges them)

**The single most important insight from Section 8:**
**The codebase is the canon. The plan integrates with the
canon. The plan does not replace it.** Rev 6.2 enforces
this principle retroactively across all of Part VI.

---

*End of Part VI — Canon Expansion (Rev 6.2).*








