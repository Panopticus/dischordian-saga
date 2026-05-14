# Plan — Producer Cinematic Drop: Placements, Governance Wiring, Class Content

## Bottom line

The producer drop becomes the **cinematic-payoff layer** for systems the codebase already wired:
- the **5-class system** (`classMastery.ts`)
- the **Engineer governance vote system** (`engineerGovernanceVotes.ts`)
- the **CADES FPS Godot iframe campaign** (`actsFourFiveShells.ts:169-228`)
- the **Kael Fragment / Terminus Swarm milestone gate** (`kaelFragmentWatchers.ts:63-64`)

Text previews land at questline-Ch1 beats in early acts; cinematic payoffs land at each character's canonical climax. Every player sees every video in canon-correct order; the **Eyes Music Video** alone is gated to Trade Empire engagement.

**Producer-delivered count: 20 character/prelude cinematic videos + 1 endgame music video + 2 audio-only last-words surfaces + 16 Season 1 + 14 Season 2 Antiquarian-narrated episodes + 6 side-content arcs (Last Christmas / Welcome to Celebration / Mechronis Academy / Necromancer's Lair / Syndicate of Death / Planet of the Wolf) = 53 cinematics + 6 side arcs across both halves.** Season 1 covers Prelude → Act 4; Season 2 covers Acts 5-7 and closes the time loop. **Underneath every system runs a single meta-narrative thread: the First Wave Mystery (Part 14)** — what happened to the first wave of Potentials, and whether the second wave (the player) can do differently.

**Six cross-cutting authoring layers wrap the entire surface — all surfaced from the Galactic Governance Hub as the single locus:**
1. **Natural in-game framing per cinematic** (Part 3) — no modal pops. Each video enters via a diegetic surface: news broadcast, transmission interrupt, meme dialog, holographic playback, post-mission debrief, redaction cascade, Oracle spread, Last Words slideshow, Inception-Ark emergency recording, Source-cavern monologue, Templum-Veritus inscription, Heart-of-Time bridge, Matrix-of-Dreams hack, Crucible-shadow hunt.
2. **Universal video votes** (Part 0, Part 2) — every cinematic gets a paired Hub vote. **9 character-video votes + 30 Season 1 + Season 2 episode votes = 39 NEW vote pages** on top of the 12 Engineer/Oracle votes. **The Hub becomes the saga's deliberation surface.**
3. **Season 1 + Season 2 backbone (30 episodes total — Antiquarian-narrated chronicle of the time loop)** (Part 0) — Season 1 (16 episodes, Prelude → Act 4) opens with the Heart-of-Time time-loop reveal; Season 2 (14 episodes, Acts 5-7) closes the loop by revealing that the Potentials' War-Choice in Ep 2.14 IS the Fall of Reality the Antiquarian narrates in Ep 1.1. Locks ALL keystone saga canon: the Source = Kael, Inception Arks built by the Engineer, the Architect / Politician / Project Vector, the Authority / Syndicate of Death / Six founders, the Baron + Heart of Time origin, **Agent Zero died on Veridian Prime**, 5 Mechronis archons, Hierophant Wraith, Servant Hero Academy franchise pivot, **the Crucible-corruption + Hierarchy infiltration tied to Shadow Tongue's S1 Ep 6 summoning**.
4. **Four-advisor stack at every Season-2 vote** (Part 4 + Part 14) — **Elara** (head), **the Human** (gut), **the player's active apprentice** (heart, 12 archetypes), and **the player's current First-Wave Survivor companion** (fate — Lycos→Wolf, Akai Shi, or Wraith Calder, each with distinct voice register from beyond death).
5. **Inventor meme-frame on every vote** (Part 4.5) — once `inventor_introduced` fires, every Hub vote page gets a "did you know?" sticky note signed `—I.` ~159 lines (53 votes × 3), Inventor-voice locked.
6. **The First Wave Mystery — saga-wide meta-narrative thread** (Part 14, NEW) — every system in Dischordia contributes evidence to the First Wave Codex. The player IS the second wave. The mystery is what happened to the first wave, and whether the second wave can break the loop the first wave died inside. **Codex completion thresholds gate hidden rewards: 25% → Antiquarian's letter to the second wave; 50% → Wolf's hunt unlocks; 75% → Servant Hero Academy extra mission; 100% → an alternate Antiquarian inscription names the second-wave choice as canonical-going-forward.**

### Final placement table (20 videos + 1 music video)

| # | Producer asset | Beat / Trigger | Act | Audience |
|---|---|---|---|---|
| 1 | Painter (Bob Ross / Resurrection Protocols) | Prelude Beat A.5 | Prelude | All |
| 2 | Advocate (Blood and Shadows) | Prelude Beat F.5 | Prelude | All |
| 3 | Inventor (Baron Trump / Heart of Time) | Prelude Beat H | Prelude | All |
| 4 | Engineer Ep 1 — The Engineer of Dreams | `holo_wake_the_bench` (`minCardWins:1`) | Act 1 early | All |
| 5 | Engineer Ep 2 — A Dilemma | `holo_princes_notebook` (`minCardWins:3`) | Act 1 mid | All |
| 6 | Engineer Ep 3 — The Converter | `holo_worlds_i_saved` (`minCardWins:4`) | Act 1 mid | All |
| 7 | Engineer Ep 4 — Better Part of Valor | `holo_line_they_crossed` (`minCardWins:6`) | Act 1 late | All |
| 8 | Engineer Ep 5 — The Dispatch | `holo_agent_zero_dispatched` (`minCardWins:10` + dischordia 12) | Act 2 opening | All |
| 9 | Engineer Ep 6 — Zero Sum Game | `holo_which_ark` (`minCardWins:11`) | Act 2 mid | All |
| 10 | **Oracle Ep 1 — The Oracle of Dreams** | `oracle_vision_first_sight` (Oracle spread drawn ≥1, Act 2 entered) | Act 2 early | All |
| 11 | **Oracle Ep 2 — Heirophant's Blessing** | `oracle_vision_ancient_prophecies` (post-Ep 1 + Heirophant introduced) | Act 2 late | All |
| 12 | Eyes video | post-`dispatch_F7_final_first_read` OR `act_3_complete` | late Act 3 | All |
| 13 | **Oracle Ep 3 — Ancient Prophecies** | `oracle_vision_sign_of_destiny` (Act 3 opening spread) | Act 3 early | All |
| 14 | **Oracle Ep 4 — The Sign of Destiny** | `oracle_vision_public_declaration` (post-Ep 3) | Act 3 late | All |
| 15 | Prisoner video | Act 4 cinematic prologue (`act4_prisoner_intro_triggered`) | Act 4 opening | All |
| 16 | **Oracle Ep 5 — The Star Whisperer** | `oracle_vision_question_legitimacy` (post-Prisoner reveal — player retroactively recognizes the face) | Act 4 mid | All |
| 17 | Agent Zero video | CADES FPS M6 (`cades_m6_complete` — Alliance of Adversaries) | Act 5 mid | All |
| 18 | Iron Lion video | CADES FPS M7 (`cades_m7_complete` — Last Stand on Veridian VI) | Act 5 climax | All |
| 19 | **Oracle Ep 6 — Shadow Tongue** | `oracle_vision_public_debate` (gates Shadow Tongue's actual arrival on the Ark) | Act 5 late / Act 6 opening | All |
| 20 | **Terminus Swarm video** | `terminus_swarm_wave_10_first_complete` (Kael Fragment unlock) | TD-mode milestone | Wave-10 reachers |
| — | Eyes Music Video | Trade Empire intel ≥ 200 + ≥1 `dispatch_F7_*` revealed, OR `convergence_climax_reached` | Acts 4-7 / endgame | All but TE-skippers |

### Audio-only canon surfaces — the Last Words Slideshow events

These are not just audio drops. Each is a **diegetic slideshow event**: voice-over audio plays over a sequence of stills (composed from existing canonical art keys + a few new producer stills), ending on an Antiquarian past-tense framing card. The format is the producer's central thesis made literal: "hands vs. mouth, building vs. reading — both end at the cost of self."

| # | Audio | Event location | Trigger flag | Slide manifest | Antiquarian outro card |
|---|---|---|---|---|---|
| 1 | **Engineer Ep 7 — Last Words at the Bench** | The Engineer's Bench (the physical hologram-deck surface in the player's hub). The Bench is dark — no more Eps will play after this. | `holo_deck_remembers` (fires Act 2 late / Act 3 opening, once Ep 6 has played AND act-1-complete) | Stills: worlds-he-saved montage → prince's notebook open → the line they crossed → dispatch night with Agent Zero → the Bench going dark. Voice-over: Engineer's final recording. | *"He built every door this story walks through. The last one he closed was his own."* |
| 2 | **Oracle Ep 7 — Last Words in the Cell** | The **Prisoner's cell**, after the player has unlocked the canon that **the Prisoner IS the harvested Oracle**. The Prisoner finds (or remembers) a hidden recording — his own pre-wipe last words. | `prisoner_remembers_being_the_oracle` (renamed from `oracle_vision_harvest_and_wipe`; fires after `prisoner_oracle_identity_reveal`) | Stills: the debate stage with the Collector closing → the Collector's hand reaching → the harvest moment → wipe (3 frames of pure static) → the Prisoner's cell, present-day. Voice-over: Oracle's pre-wipe final lines. | *"He read every prophecy ours would write. The last one he could not read was his own name."* |

Diegetic mechanic for both: the player triggers the surface (returns to the Bench / sits in the cell at the right canon beat), the audio plays uninterrupted with the slideshow rendered as a slow cross-fade behind it, and the Antiquarian's outro card resolves to a single sentence the player carries forward. **The slideshow does NOT skip or fast-forward.** It is a wake.

### New framing-device kind: `last_words_slideshow`

```ts
framingDevice: {
  kind: "last_words_slideshow";
  hostSurface: "engineer_bench" | "prisoner_cell";
  audioUrl: string;                         // producer-delivered audio
  slides: ReadonlyArray<{                   // ordered manifest
    artKey: string;                         // assetUrl-compatible key
    durationMs: number;                     // pre-timed against audio
    captionFlag?: string;                   // optional Antiquarian caption line
  }>;
  outroAntiquarianLine: string;             // single past-tense framing sentence
}
```

Presenter: `LastWordsSlideshowCutscene.tsx` — wraps audio playback with cross-faded stills, locks player input (no skip), surfaces the Antiquarian outro card at audio-end, then routes back to the host surface (Bench dark / cell quiet). One component handles both events; `hostSurface` only changes the chrome (Bench frame vs cell frame).

### Pacing distribution

| Beat | Videos | Notes |
|---|---:|---|
| Prelude | 3 | Painter / Advocate / Inventor — breath-beat tone-setters |
| Act 1 | 4 | Engineer Eps 1-4; recording-discovery-paced |
| Act 2 | 4 | Engineer Eps 5-6 (closes Engineer tragedy) + **Oracle Eps 1-2** (opens parallel arc; mirrors-structure rhymes Ep 1/Ep 1 = "of Dreams") |
| Act 3 | 3 | Eyes (Spy payoff) + **Oracle Eps 3-4** (prophecy → public declaration; Heirophant lore deepens) |
| Act 4 | 2 | Prisoner opening + **Oracle Ep 5** (player retroactively recognizes the Prisoner as the Oracle who was harvested) |
| Act 5 | 3 | Agent Zero (CADES M6) + Iron Lion (CADES M7) + **Oracle Ep 6 — Shadow Tongue (summoning event)** |
| TD milestone | 1 | Terminus Swarm at Wave 10 (asynchronous to act gating) |
| Endgame | 1 | Eyes Music Video at Trade Empire intel threshold |

No act exceeds 4 videos. The Engineer arc front-loads Acts 1-2; the Oracle arc threads Acts 2-5 in counterpoint — the same six-recording shape, paced over three acts instead of two so the player has space to absorb each vision's theological weight.

---

## Part 0 — Producer canon ledger (locked)

The producer's video drop ships with **canonical vote outcomes** narrated by the Antiquarian as past-result inscriptions. Each episode's vote is locked; no branching. The Antiquarian's voice is "the Potentials chose X, here's what that became."

### Vote-marker registry

| Marker | Canonical register | Engineer wins | Oracle wins |
|---|---|---:|---:|
| ❤️ | Love / heart-led / chosen-tragedy | 1 (Ep 6 — catastrophic) | 3 (Eps 2, 4, 5) |
| 👍 | Pragmatic / approval / hands-down work | 3 (Eps 1, 4, 5) | 2 (Eps 1, 3) |
| 🔥 | Intensity / brave-risk | 1 (Ep 2) | 0 |
| 💯 | Mission-priority / full commitment | 1 (Ep 3) | 1 (Ep 6) |
| 🙏 | Drastic / last-resort / violence-as-desperation | — (never offered) | OFFERED Ep 6, REJECTED |

**Character canon:** Engineer's primary marker = **👍** (hands, pragmatism). Oracle's primary marker = **❤️** (heart, scripture). Engineer dies on his single ❤️; Oracle is harvested on his single 💯. **Hands vs. mouth, building vs. reading — and both end the same way: at the cost of self.**

### Engineer 6-episode arc (canonical winners locked)

| Ep | Title | Winner | Key canon |
|---|---|---|---|
| 1 | The Engineer of Dreams | **Scavenge & Invent 👍** | Bench exists because Potentials voted invention. Form Alliances LOST → factions on Zenon scattered. Negotiate-with-AI LOST. |
| 2 | A Dilemma | **Distract the Arachnid 🔥** | Engineer = third-option-chooser. Both children AND converter saved. Negotiate LOST again. |
| 3 | The Converter | **Escape and Regroup 💯** | Engineer is not a warrior. Converter survives. **Arachnid is alive and at large** (Chekhov's gun). 3rd Negotiate LOST. |
| 4 | Better Part of Valor | **Seek Additional Allies 👍** | Engineer becomes hub character; the Bench is now a crossroads. Recruitment call sent → Agent Zero. Episode ends on transmission. |
| 5 | The Dispatch | **Build the Device 👍** | Reply: *"Agent Zero has been dispatched"* (kind reading: en route. dark reading: killed). Engineer trusts the network, finishes the device. Trace-the-Source LOST → trap walks in. Vex Solène / Black Market intro DEFERRED. |
| 6 | Zero Sum Game | **Direct Assault on the Vortex ❤️** — **CATASTROPHIC** | Vortex destroyed. Warlord attempts mind-takeover; Engineer reverses with device, saves Agent Zero, keeps his mind. **Warlord physically executes him.** Vex Solène is the posthumous resurrection. |
| 7 | NEVER PRODUCED | — | Audio-only canon: Engineer's literal last words. Maps to `holo_deck_remembers`. |

**Engineer arc-closing scoreboard:** ✓ Vortex dead. ✓ Agent Zero saved. ✓ Engineer's mind preserved. ✗ **Engineer executed by Warlord.** ⚠ Warlord survives → goes to Veridian (CADES M7). ⚠ Arachnid still at large.

**Cross-character payoff:** Vortex was canonically the Human's childhood Mascoteer squadmate (`mascoteerFiles.ts`, PR #601). **The Engineer killed the Human's childhood friend.** When the Human Reveal video lands, the player retroactively realizes the entwined grief. Major setup-payoff against the Human Reveal arc.

### Oracle 6-episode arc (canonical winners locked)

| Ep | Title | Winner | Key canon |
|---|---|---|---|
| 1 | The Oracle of Dreams | **Seek the Heirophant's Blessing 👍** | Title rhymes with Engineer Ep 1 ("of Dreams") — paired structural mirrors. Heirophant locked as Thaloria spiritual authority. |
| 2 | Heirophant's Blessing | **Invoke Ancient Prophecies ❤️** | Heirophant is a textualist. Oracle persuades by being the more careful reader. |
| 3 | Ancient Prophecies | **Demonstrate a Sign of Destiny 👍** | Sign was a celestial event (per Ep 4 wording). Canonically ambiguous: real prophecy fulfillment OR staged demonstration. Antiquarian preserves ambiguity. |
| 4 | The Sign of Destiny | **Public Declaration from Heirophant ❤️** | **Potentials REJECTED claiming the Star Whisperer title** (Option 4 LOST). Oracle stays humble → clean hands when Collector arrives in Ep 5. |
| 5 | The Star Whisperer | **Question the Star Whisperer's Legitimacy ❤️** | Collector accuses Oracle; Oracle counter-attacks the accuser's credentials. Forces Collector from prosecutor to defendant. |
| 6 | Shadow Tongue (5 options — introduces 🙏) | **Public Debate 💯** | **🙏 (decapitate with energy blade) REJECTED.** Oracle canonized as anti-violence even when offered violence. Wins debate by language and logic. |
| 7 | NEVER PRODUCED | — | Audio-only canon: Oracle's last words pre-memory-wipe. Bridges to becoming the Prisoner. Maps to `oracle_vision_harvest_and_wipe`. |

**Oracle arc-closing scoreboard:** ✓ Debate won, Collector exposed. ✗ **Oracle harvested by Collector**, memory-wiped, Panopticon-imprisoned → becomes the **Prisoner**. The Prisoner-first reveal cashes here: when the player meets the Prisoner early, they meet him at the END of this story.

### Shadow Tongue summoning canon (locked, NEW — set up by Oracle Ep 6)

Oracle Ep 6 is not merely a debate scene. It is **the moment Shadow Tongue is summoned into the universe.**

- In the public debate the **Collector impersonates Shadow Tongue** to discredit the Oracle. The Collector is a cosmic-fraud impersonator; Shadow Tongue, at that moment, is not yet present in this universe.
- The act of being publicly invoked, named, debated against, and impersonated is itself the summoning ritual. Words make the thing. **Shadow Tongue arrives in-universe because it was named on the public record.**
- This is **why Shadow Tongue is on the Ark.** The Ark gathers cosmic entities that the Antiquarian's universe has summoned. Shadow Tongue's presence on the Ark traces back to the Collector's impersonation in the Oracle Ep 6 debate — a fraud that called a real god into existence.
- Lore card / Antiquarian inscription (locked): *"The Collector spoke in a tongue not his own to win a debate. The tongue heard itself spoken. It arrived. It has been with us since."*

### Heirophant / Thaloria / religion canon (locked, NEW — set up by Oracle arc Eps 1-6)

The Oracle arc spins up a **theological lattice** that pays off when **Wraith** arrives later in the saga:

- **The Heirophant** — Thaloria's spiritual authority. A textualist; rules by careful reading of the prophetic scrolls. Locked in Oracle Eps 1-2 ("Seek the Heirophant's Blessing" → "Invoke Ancient Prophecies"). Established as a figure who can be persuaded BY scripture, not against it.
- **Thaloria** — the spiritual home-world / culture the Heirophant and Oracle inhabit. Religion built on the Ancient Prophecies + the Sign of Destiny celestial event (Oracle Eps 3-4).
- **The Star Whisperer title** — a sacred office the Potentials canonically REJECTED claiming on the Oracle's behalf (Oracle Ep 4). The title remains an empty seat. **When Wraith arrives, the empty Star Whisperer seat is what Wraith fills** (or is offered, or contests).
- **Shadow Tongue's arrival** — the dark counterpart to the Heirophant's bright lattice. The Oracle's arc establishes both the legitimate religious authority AND the false-tongue interloper. Wraith's arrival rebalances both.

Hard ship:check coverage: every Oracle vision past-result inscription names at least one of `the_heirophant`, `thaloria`, `the_star_whisperer`, `shadow_tongue`, `the_collector` — so the religious-lattice canon is keyed to real entities the Wraith arc can reference.

### The Advocate canon (locked, NEW — set up by the Advocate prelude vignette at Beat F.5)

The Advocate vignette is not a tone-piece. It is the **origin story of the Blood Weave** — the precise mechanic the player's `bloodWeaveAlignment` track has been re-enacting since Hellbox use #1. The producer-supplied voice-over is the canonical past-tense ballad **"The Ninth"** (per LORE_BIBLE:1490 — already a registered CoNexus story title under the Advocate's character page).

**Voice-over text (locked, producer-supplied):**

> *O darkling Ninth, the Advocate once crowned,*
> *In stellar courts of shadow, famed and feared,*
> *Thy glories stretched where void and suns were bound,*
> *Yet now thy name in whispers fraught and seared.*
>
> *From cosmic thrones, by silent spectres torn,*
> *Thy empire razed by creatures of nightmares' breath—*
> *Those fiends whose fangs and talons vilely born*
> *Brought forth the hollowed curse of endless death.*
>
> *To see thy realms devoured, thy rule undone,*
> *Thou bargained forth thy soul, thy burning brand,*
> *With eldritch gods who thrive beyond the sun,*
> *And took their poisoned gift into thy hand.*
>
> *Now, hollow queen, with shadows at thy call,*
> *Reality itself dost thou unmake—*
> *Thy power taints, thy foes dost helpless fall,*
> *But in that grip, thy soul no light shall take.*

**Locked beat sequence (the four quatrains map 1:1 to four canon beats):**

1. **Q1 — "darkling Ninth, the Advocate once crowned" / "stellar courts of shadow"** — The Advocate was queen of the **Empire of Shadows** (LORE_BIBLE:1469, 5358), regnal title **the Ninth**. The Empire was structured into nine stellar courts; she ruled the Ninth, which became synecdoche for the whole empire as the prior eight fell. "Once crowned" is past-tense for a reason — her status is canonically *"Active (though her humanity is lost)"* (LORE_BIBLE:1462).
2. **Q2 — "creatures of nightmares' breath, fangs and talons" / "hollowed curse of endless death"** — The **Hierarchy of the Damned**, the demon-lord corporation (`hierarchyOfTheDamned.ts`) led by Mol'Garath. They were sealed beneath reality (LORE_BIBLE:5352); the **Severance** — orchestrated by Ith'Rael / Master of Rylloh through Shadow Tongue's corruption of Thaloria — broke them free. They razed the Empire of Shadows. The "hollowed curse of endless death" is the Hierarchy's signature predation: not killing, hollowing.
3. **Q3 — "bargained forth thy soul" / "eldritch gods who thrive beyond the sun" / "poisoned gift"** — She traded her soul to the **Master of R'lyeh** (LORE_BIBLE:1291-1312 — the enigmatic eldritch entity from the submerged city of R'lyeh on Hydros, *neither AI Empire nor Insurgency-aligned*, definitively **OUTSIDE the Hierarchy**). His poisoned gift is the **Blood Weave**. The user's "Master of Ryleth" normalizes to the lore-bible spelling **R'lyeh**.
4. **Q4 — "with shadows at thy call" / "reality itself dost thou unmake" / "thy soul no light shall take"** — The Blood Weave's defensive use against the Hierarchy. *"Reshape reality"* per Advocate card flavor (`s1_char_017_the_advocate.ts:61`). The price: her soul is permanent shadow. She is the **hollow queen**.

**The deepest twist — the bargain summoned what she bargained to fight:**

Mol'Garath canon (LORE_BIBLE:4088): *"He allowed the gates to open, having waited since the first moment of existence for the **Blood Weave to be spoken**."* The Severance's final unsealing key was the Blood Weave being spoken aloud. **The Advocate's bargain with the Master of R'lyeh completed the ritual that freed the Hierarchy.** She gained the weapon to fight them by inadvertently giving them their gate-key. This rhymes EXACTLY with the **Shadow Tongue summoning canon** above: speak the name → the thing arrives. **The saga's underlying metaphysics: naming is summoning.** Both arcs prove it.

**Hierarchy co-option of the Blood Weave (locked):**
- **Xeth'Raal** (LORE_BIBLE:5155): converted her sacrifice into a debt-ledger *"that could never be fully repaid."* The Hierarchy's accountancy turned her resistance into their collateral.
- **Zyr'Koth** (LORE_BIBLE:5217): his R&D division produced the **Severance Protocol — the refined Blood Weave** — as a Hierarchy weapon. They reverse-engineered her gift.
- **Syl'Vex** (LORE_BIBLE:4244-4287): the Advocate's cobalt-skinned dark mirror. *"Where the Advocate wove the Blood Weave to defend, Syl'Vex weaves it to convert."* The recruitment-pitch antagonist.
- **Result:** the player's `bloodWeaveAlignment` track (`apps/shared/bloodWeave.ts:8-12` — explicitly *"how the Hierarchy keeps its servants"*) is the Severance-Protocol-refined version of the Advocate's original weapon. **Every Hellbox use the player makes is a stitch the Hierarchy reclaims from the Advocate's original Weave.** The player walks her path in miniature, in the wrong direction.

**Sacrum of Severed Silk closure (LORE_BIBLE:7716, 8460-8475):** Year 16,700 A.A. — the Advocate's final act. She sealed the worst Blood Weave techniques into the Sacrum at the Battle of the Seventh Binding (six prior bindings had failed), paying with a fragment of herself. Her body went into stasis under 7-Omega clearance; her body coordinates surface via the Advocate-arc DLC ladder after five PURE-bloodline generations (LORE_BIBLE:7496-7502). The prelude vignette plants the question this ladder answers.

**Lore card / Antiquarian inscription (locked):**

> *"The Hierarchy waited beneath reality for the Blood Weave to be spoken. The Ninth spoke it, to fight them. Both sides have been weaving with her thread ever since. The player's Hellbox is the same loom."*

**Flags set by the Advocate vignette (Beat F.5):**
- `advocate_introduced`
- `blood_weave_introduced`
- `empire_of_shadows_introduced`
- `hierarchy_of_the_damned_introduced`
- `master_of_rlyeh_introduced` (the eldritch outsider, NOT the Hierarchy lord)
- `the_ninth_canon_locked`

**CODE RECONCILIATION REQUIRED — Master of R'lyeh is mis-classified:** The current `apps/shared/hierarchyOfTheDamned.ts:87-113` entry `master_of_rlyeh` is **incorrectly listed as a Hierarchy lord**. LORE_BIBLE definitively splits two entities:
- **Master of R'lyeh** (LORE_BIBLE:1291-1312) — eldritch outsider from R'lyeh / Hydros, *unaligned*. THIS is who the Advocate bargained with.
- **Master of Rylloh** (LORE_BIBLE:3997-4015) — Ith'Rael the Whisperer, Hierarchy Director of Special Projects, architect of the Severance.

The existing `master_of_rlyeh` entry in `HierarchyLordId` is the Rylloh/Ith'Rael role mis-spelled with R'lyeh's name. Reconciliation work (PR 8):
1. Remove `master_of_rlyeh` from `HierarchyLordId` union and `HIERARCHY_LORDS` array.
2. Add `ithrael_whisperer` to `HierarchyLordId` (preserving the dream-cataloguer / Director-of-Special-Projects lore — these can sit on Ith'Rael's profile, his presentation when met at earliestAct 5).
3. Create new `apps/shared/eldritchOutsiders.ts` registry. Add the canonical **Master of R'lyeh** there as a soul-trade patron entity, *unaligned* with both AI Empire and Insurgency, the canonical source of the Advocate's Blood Weave.
4. Update all callers (test files, encounter triggers, faction-crosswalk references) to point at the correct identifier.

This reconciliation is BLOCKING for shipping the Advocate vignette — the prelude lore would otherwise contradict the engine's faction map.

### Universal video votes (locked, NEW — every producer video gets a Governance Hub vote)

Every cinematic — not just Engineer recordings and Oracle visions — surfaces in the Governance Hub as a vote. The vote is **not "what does the character do"** (that is locked canon, narrated past-tense by the Antiquarian). The vote is **"now that this happened, what do you, the present-day Potentials, choose with it."** Sometimes retroactive (legacy / canonization); sometimes prospective (next move).

Every vote uses the same `GovernanceVote` shape (Part 2). Markers restricted to ❤️ 👍 🔥 💯 🙏. Past-result inscriptions Antiquarian-locked, present-perfect tense.

| Video | Vote question | Options (winner **bold**) | Past-result inscription |
|---|---|---|---|
| **Painter** | The Painter offers to resurrect ONE casualty for the gallery. Who? | • A child — ❤️<br>• A soldier — 👍<br>• A friend — 💯<br>• **The murderer of one of you — 🔥** | *"The first canvas had a face the Potentials never asked to see again. The Painter painted the face anyway. The rooms got their color."* |
| **Inventor (the Time Traveller)** | The Inventor's time-machine schematic is on the table. Publish? | • Publish openly — 👍<br>• Suppress entirely — ❤️<br>• Publish a sabotaged version — 🔥<br>• **Take it offline; use it ONCE — 💯** | *"The Potentials kept it. They used it once. The notebook with the second use's coordinates is in the library, sealed, with a sticker that reads —I."* |
| **Advocate** | Now you know what the Blood Weave costs. Keep using the Hellbox? | • **Keep using — 👍** *(knowing complicity)*<br>• Stop entirely — ❤️<br>• Keep using AND seal the Sacrum yourselves — 🔥<br>• Halve usage — 💯<br>• One of you takes the Ninth's bargain — 🙏 *(OFFERED, REJECTED)* | *"She bargained alone. The Potentials bargain together, every Hellbox use, and so far have not paid her price. So far."* |
| **Eyes** | The Eyes was reading your mail. Response? | • **Recruit her formally — 👍**<br>• Forgive but distance — ❤️<br>• Counter-surveil her — 🔥<br>• Burn her network — 💯 | *"The Potentials hired the woman who had been reading their mail. The mail did not stop being read. It stopped being read by a stranger."* |
| **Prisoner** | A man in a cell. Identity uncertain. Choose. | • Free him — 👍<br>• Visit and learn — ❤️<br>• Stage a Panopticon escape — 🔥<br>• **Confirm identity first — 💯**<br>• Kill him in case — 🙏 *(OFFERED, REJECTED)* | *"The Potentials did not free him. They did not kill him. They learned. By Act 5, his face was a face they could name. By Act 6, the name was Kael. By Act 7, the name had been his all along."* |
| **Agent Zero** | Tell Agent Zero the Engineer is dead? | • Tell her now — 👍<br>• Tell her after one good day — ❤️<br>• Never tell her — 🔥<br>• **Show her the recording — 💯** | *"She listened standing. After it finished, she went to the Bench and put one hand on the dark deck. The Bench did not light. She knew it would not. She put her hand there anyway."* |
| **Iron Lion** | His posthumous broadcast — what plays? | • His final order ('carry the poster') — 👍<br>• His childhood broadcast — ❤️<br>• **Silence — full day, every channel — 🔥**<br>• Both his last and the Engineer's, twin grief — 💯 | *"For one full day every screen was dark. The dark was the message. The Warlord watched the dark on his own screen. He understood it. He kept moving."* |
| **Terminus Swarm** | Now you have seen the Swarm. Who do you tell? | • Everyone immediately — 👍<br>• Leadership only — ❤️<br>• No one; train in secret — 🔥<br>• **Tell only Kael first — 💯** | *"Kael read the briefing in the Observation Deck. Her hand on the glass left no fingerprint. She handed the briefing back and said: 'I have been waiting for this since I was nine.' The Antiquarian closed the file."* |
| **Eyes Music Video** | The Eyes' final dossier compiles. Where does it go? | • Release publicly — 👍<br>• Burn it — ❤️<br>• Sell to the Insurgency — 🔥<br>• **Give to the Antiquarian; walk away — 💯** | *"The Antiquarian filed it under a name no one remembered authoring. The dossier is on a shelf the player has walked past. It will be read. It is being read now."* |

**Cross-vote payoff (Agent Zero × Engineer Last Words Slideshow):** Agent Zero's vote canonically winning 💯 ("show her the recording") **is the diegetic mechanism by which the Engineer Ep 7 Last Words Slideshow first plays.** The Potentials choose to play the recording for her; the slideshow runs at the dead Bench WITH her standing in attendance. This binds the Engineer arc closure (Ep 6 catastrophe → Ep 7 audio-only wake) to the Agent Zero arc (CADES M6 recruitment → first hearing the Engineer's voice). The vote is the bridge.

**Combined marker tally across all 21 producer-canon votes:** 👍 7 · 💯 7 · ❤️ 4 · 🔥 3 · 🙏 0-of-3 (offered on Oracle Ep 6 + Advocate + Prisoner; rejected on all three). The Engineer arc is ❤️-tragic, the Oracle arc is ❤️-mostly with 💯 closing, post-arc votes lean 👍/💯 (the Potentials matured INTO 💯). 🙏 (drastic violence) is canonically OFFERED three times and REJECTED three times. **The Potentials are not who chooses 🙏.** That option's role is to exist on the ballot as a temptation the body of voters refuses, on the record.

### Season 1 — The Antiquarian's 16-Episode Backbone (the time-loop chronicle, NEW)

**Producer drop scope expansion: Season 1 ships now as 16 Antiquarian-narrated episodes paced through the entire FIRST HALF of the game (Prelude → Act 4). Season 2 (Acts 5-7) ships separately right after.** Every character cinematic (Engineer / Oracle / Painter / Inventor / Advocate / Eyes / Prisoner / Agent Zero / Iron Lion / Terminus Swarm) **hangs off this backbone.** The Antiquarian is the saga's primary narrator; her chronicle is canon.

#### The time-loop premise (LOCKED via Ep 1's Heart-of-Time cutscene)

**The Discordian Saga is a time loop. The Potentials have lived this story before. The Antiquarian is the loop-keeper. The Inventor's Heart-of-Time vessel is the loop-breaker. The Human is the cross-loop observer.**

Established mechanically in Episode 1:
- **Engage Defensive Protocols path (CANON):** Heart-of-Time cutscene → Human's voice: *"Interesting...that didn't happen last time."*
- **Evade path (non-canon):** alarm subsides, no cutscene → Human's voice: *"They chose differently this time, let's see how that plays out."*

EITHER path proves the loop. The canon path is what the Antiquarian narrates in subsequent episodes — but the Heart-of-Time's intervention is **divergent from prior loops.** Each Season 1 episode is the *current loop's* outcome, narrated past-tense from the Antiquarian's pocket-dimension observatory.

**Why this lock matters across the entire plan:**
- Every Antiquarian past-tense inscription becomes diegetically truthful — she IS narrating from outside the loop
- The Human's noir register ("we will see whose precedent the historians prefer") becomes LITERAL — he has seen previous loops play out
- All producer-canon vote winners (Engineer ❤️, Oracle 💯, Advocate 👍, etc.) are *previous-loop* outcomes; the present-loop player can confirm or diverge
- The Inventor's prelude vignette (Beat H, "Heart of Time" song) reads as the **loop-breaker's introduction** — the Heart-of-Time vessel is canonically present in Ep 1, before the Inventor is even named on stage
- The Master of R'lyeh's bargain that summoned the Hierarchy happened in a previous loop; that's why it's all past-tense canon
- **The Source = Kael identity reveal (below) is a cross-loop secret** the Antiquarian has been carrying

#### Canon binding established by Season 1 (with existing-canon cross-references)

| Season 1 reveal | Existing canon it locks together |
|---|---|
| **Fall of Reality / thought virus origin** (Ep 1 monologue) | First canonical-source statement; the entire saga's catastrophe origin. |
| **Inception Arks — designed by the Engineer + Council of Harmony** (Ep 1 + LORE_BIBLE:6686, 5797) | **Cross-arc payoff:** the Engineer who dies in Ep 6 BUILT the ships the Potentials are awakening on. The player IS on an Engineer-built vessel. Antiquarian inscription opportunity: *"The Engineer built the doors the Potentials walked through. He did not live to see them open."* |
| **DeMagi (primal-elements masters: Earth/Fire/Water/Air) + Quarchon (AI masters of Space/Time/Probability/Reality)** (Ep 1 + `users-guide.md:30,66-67`) | The Potentials' two new races, post-Fall, post-cryogenic suspension. **Note:** the user-supplied script's "Dagi & Corons" normalizes to canonical **DeMagi / Quarchon**. The third species is **Ne-Yon** (hybrid — including the Advocate, LORE_BIBLE:1461). |
| **The Architect of Reality — orchestrator of the Fall** (Ep 7 Source monologue + Ep 16 recap + LORE_BIBLE:189-206) | Saga's ultimate antagonist, locked. Opposes the Dreamer. Genesis-era (1 A.A. / 2030 AD), Active. |
| **The Source = Kael (CANONICAL)** (Eps 5-7 + LORE_BIBLE:3043-3066) | **KEYSTONE REVEAL.** The Source is Kael — formerly The Recruiter (Insurgency operative), infected via Project Vector, now Self-Proclaimed Sovereign of Terminus. **Kael, the Source, and the Terminus Swarm origin are the same character lineage.** The Wave-10 Terminus Swarm cinematic (existing plan) is the late-game payoff to Season 1 Eps 5-7. The Kael Fragment at Observation Deck (*"I have been waiting since I was nine"*) is Kael's pre-infection essence, separated from the corrupted Source. |
| **The Host = corrupted Potential** (Eps 15-16 + LORE_BIBLE:2231-2237) | Host is a Potential forged from the Architect's preserved DNA/machine code, exposed to the Source, infected. **Recursive tragedy:** the Architect's child (Potential), corrupted by another of the Architect's victims (Kael/Source), now serves the Architect's chaos. Season 1 finale antagonist. |
| **The Oracle's prophet → Jailer → escapee arc** (Ep 12) | Canonically PARALLELS the Prisoner's Oracle → harvested → imprisoned arc (existing plan). **Two Oracles, one pattern.** Season 1 Oracle on the crystal-city planet; Season 2 Prisoner in the panopticon. The wormhole network connects them. |
| **Crystal harmonics as thought-virus vaccine** (Eps 12-13) | The Templum Veritus's subharmonic frequencies have vaccinated the crystal-city world for 10,000 years. **Note:** Templum Veritus exists in code (`apps/shared/transmissionLoredexUnlocks.ts:87`, `transmissions.ts:250`) but has no dedicated LORE_BIBLE dossier — Season 1 Eps 9-13 finalize the canonization. |
| **The Heart-of-Time vessel** (Ep 1 cutscene) | The Heart of Time is canonically the **golden temporal artifact, a clock that ticks backward** (LORE_BIBLE:10204). The Ep 1 cutscene's "golden eye-shaped spaceship with glowing green crystal" is the **vessel that contains the artifact** — locked name: **the Heart-of-Time vessel**. This reconciles the user-supplied Eye-of-Agamotto aesthetic with the canonical artifact. The Inventor pilots it. |
| **The wormhole network** (Eps 7-8, 12) | Connects the Source's planet → crystal-city planet → panopticon. The same network later carries the Prisoner. |
| **The 9th Neon** (Eps 11, 15) | **Not canonical yet.** Distinct from the Advocate's "Ninth" regnal title and distinct from "The Ninth Entity" (LORE_BIBLE:4565, Hierarchy Herald). Locked here as new Season 1 canon: a Potential of the **Neon class** (an elemental wielder within the DeMagi lineage), the 9th of a numbered cohort. Needs lore-bible dossier in PR work. |
| **Templum Veritus / Temple of Truth** (Eps 9, 13) | Partially canonical. Season 1 finalizes as the Oracle's crystal pyramid sanctuary on the crystal-city planet. |

#### Episode 1 — Awakening (CANON-LOCKED, first governance vote in the saga)

**Diegetic framing.** Plays on the Inception Ark's preserved **emergency-recording system** as the Potentials first reawaken. **Old-recording aesthetic mandatory** — scanlines, audio crackle, static distortion, frame jitter, low-bitrate compression artifacts. The Antiquarian's voice has the warmth of analog tape. **This is the recording she LEFT for the Potentials to find on waking.** Framing-device kind: **NEW** `inception_ark_emergency_recording` (Part 3 / Part 8.4).

**Sequence:**
1. **Cold-open Antiquarian video** plays in full (~4-minute monologue; locked text per user-supplied script: Fall of Reality / thought virus / Inception arcs / Potentials / DeMagi & Quarchon).
2. **Video ends. Room transitions:** red alarm lights flash; warning siren wails; *"Warning: precognition Systems have been activated. Unknown disturbance in Psycho telemetric engines detected. Navigation controls remain locked. Probability of complete failure of life support systems now above a non-zero possibility."*
3. **First governance vote surfaces** — 50/50 binary. The Hub itself is not yet introduced as a top-level structure; the vote presents diegetically as the ship's panic interface. **The Hub frame is established RETROACTIVELY in Ep 2** when the Antiquarian binds this alarm-vote to her ledger.

**The vote (locked):**

| Option | Marker | Canon? | Consequence |
|---|---|---|---|
| **Engage Defensive Protocols** | 💯 | ✅ **CANON** | Heart-of-Time vessel cutscene plays. Antiquarian's Ep 2 narration assumes this outcome. Sets `s1_ep1_engage_chosen`, `heart_of_time_first_seen`, `human_loop_breadcrumb_1`. |
| **Activate Automatic Evasive Maneuvers** | 👍 | ❌ non-canon (alt timeline) | Alarm subsides. **Human's voice (audio-only):** *"They chose differently this time, let's see how that plays out."* Ep 2 begins with subtle Antiquarian acknowledgment that the satellite was NOT engaged — a stub branch that gracefully rejoins canon by Ep 3. Sets `s1_ep1_evade_chosen`, `human_loop_breadcrumb_1`. |

**Heart-of-Time vessel cutscene (CANON path, production prompt LOCKED):**

> *Open: the player's Inception Ark, mid-fire. Missile pods erupt; a salvo of kinetic warheads streaks toward the organic satellite — a grotesque fungal-metal hybrid pulsing with bio-mechanical purpose. The missiles close; impact imminent.*
>
> *CUT: from blackness, a single ship materializes — the **Heart-of-Time vessel**. A sleek, golden, all-seeing-eye-shaped ship; the eye's iris a glowing green crystal that pulses like the Eye of Agamotto. No engines. No thrust trails. It simply ARRIVES. Time around it appears to slow; the missiles in flight hang suspended.*
>
> *A pulse of crystal-green light emanates from the eye. The missiles disintegrate mid-flight — not exploding, but UNMAKING, as if they had never been fired. Simultaneously, the organic satellite is enveloped in the same green light and dissolves into the void.*
>
> *Both the Heart-of-Time vessel and the satellite VANISH together — same instant, no flash, just absence. The ship LEAVES NO TRACE on Inception Ark sensors. The Potentials' instruments show the satellite was never there. The kill-count is zero. The threat is gone.*
>
> *HOLD on the now-quiet Ark bridge. The alarm has stopped.*
>
> *Voice-over, the Human (audio-only): "Interesting...that didn't happen last time."*

Sets flags: `s1_ep1_played`, `s1_ep1_vote_cast`, `heart_of_time_first_seen` (canon path), `human_loop_breadcrumb_1` (either path).

#### Episodes 2-16 (CANON-LOCKED)

| # | Title | Act | Vote question | Canon winner | Marker | Sets up |
|---|---|---|---|---|---|---|
| 1 | Awakening | Prelude cold-open | Engage vs Evade | Engage | 💯 | Ep 2 |
| 2 | A Destructive Potential | Prelude late | Pursue the escaping seedling OR investigate satellite remnants | Pursue | ❤️ | Ep 3 |
| 3 | Terminus Swarm (intro) | Act 1 early | Maneuver carefully OR aggressive blast through the asteroid field | Aggressive blast | 🔥 | Ep 4 — the catastrophic choice |
| 4 | The Fall | Act 1 mid | Purge infected ships OR analyze the spores | Analyze (inquiry > annihilation) | 👍 | Ep 5 |
| 5 | The Outbreak | Act 1 late | Hold position OR descend to follow the signal | Descend | 💯 | Ep 6 — first Source encounter |
| 6 | The Source | Act 2 opening | Plead your case OR fight the Source | Plead | ❤️ | Ep 7 |
| 7 | The Decision | Act 2 early | **5 options:** sacrifice ships / sacrifice 10 Potentials / take the wormhole / refuse and die / [fourth path proposed by Potentials] | **Wormhole** | 💯 | Ep 8. **🙏 OFFERED & REJECTED** on sacrifice-10. |
| 8 | The Arrival | Act 2 mid | Continue exploring OR establish base in the Ivory Pyramid | Establish base | 👍 | Ep 9 |
| 9 | Illuminated Shadows | Act 2 late | Leave the pyramid OR decipher the murals | Decipher | 👍 | Ep 10 |
| 10 | The Artifact | Act 3 opening — **PLOT PIVOT** | Ignore the helmet OR have a volunteer wear it | **Wear it** (Assassin volunteers; Collector freed) | 🔥 | Ep 11 |
| 11 | The City | Act 3 early | Make a stand against the Collector OR flee (9th Neon collapses the tunnel) | Flee | 💯 | Ep 12 |
| 12 | The Return | Act 3 mid | Resist the Oracle OR trust the Oracle | Trust | ❤️ | Ep 13 |
| 13 | Wyrmwood | Act 3 late | Accept the sermon OR ask about the wormhole | Ask (barrier shatter — Armageddon begins) | 👍 | Ep 14 |
| 14 | The Hunt | Act 4 opening | Defend the city OR hunt the Collector in the forest | Hunt | 🔥 | Ep 15 |
| 15 | The Beginning of the End | Act 4 mid | Keep the harmonic weapon OR give it to the Oracle (9th Neon's amplification) | Give to the Oracle | ❤️ | Ep 16 |
| 16 | Memento Dischordia | Act 4 climax — **first-half finale** | **CHOOSE A SIDE: Architect / Hierarchy / Source's legacy / Potentials' independence** | **REVEALED IN SEASON 2** (cliffhanger; vote stays open across Act 4 → Act 5) | TBD | Season 2 opens with the canon resolution |

**Combined Season 1 marker tally (of the 15 votes with locked winners):** 💯 5 · ❤️ 4 · 🔥 3 · 👍 3 · 🙏 1 offered & rejected.

#### Pacing through the first half (combined with all other cinematics)

| Act | Season 1 episodes | Other cinematics | Total |
|---|---|---|---:|
| **Prelude** | Ep 1 (cold-open) + Ep 2 | Painter (A.5) + Advocate (F.5) + Inventor (H) | 5 |
| **Act 1** | Ep 3 + Ep 4 + Ep 5 | Engineer Eps 1-4 | 7 |
| **Act 2** | Ep 6 + Ep 7 + Ep 8 + Ep 9 | Engineer Eps 5-6 + Oracle Eps 1-2 | 8 |
| **Act 3** | Ep 10 + Ep 11 + Ep 12 + Ep 13 | Eyes + Oracle Eps 3-4 | 8 (push Eyes to Act 4 if too dense in playtest) |
| **Act 4** | Ep 14 + Ep 15 + Ep 16 | Prisoner + Oracle Ep 5 | 5 |

**53 first-half cinematics total.** First-half finale = **Season 1 Ep 16 (Memento Dischordia)** with its Side-Choice vote open across the Act-4 → Act-5 transition. Guard-rail: no act exceeds 8 cinematics; at ~3 min × 8 = ~24 min cinematic per act against 6-10h player time = under 5% screen time.

#### Diegetic framing per Season 1 episode (NEW framing-device kinds for Part 8.4)

| Episodes | Framing-device kind | Surface |
|---|---|---|
| Ep 1 | `inception_ark_emergency_recording` | Old-recording aesthetic on the Ark's pre-Fall preserved system |
| Eps 2-5 | `antiquarian_library_inscription` | The Antiquarian's pocket-dimension observatory; her ledger surface |
| Eps 6-7 | `source_cavern_monologue` | The Source speaks directly; Antiquarian narrates in VO only |
| Eps 8-13 | `templum_veritus_inscription` | Crystal pyramid interior; murals and harmonic resonance frame the chronicle |
| Eps 14-15 | `crystal_city_under_siege` | Combat-overlay cinematic surface |
| Ep 16 | `temple_of_truth_last_stand` | Cliffhanger surface; the Side-Choice vote stays open visibly |

6 NEW framing-device kinds — extend the discriminated union in Part 8.4 with corresponding presenter components.

### Season 2 — The Theft, the Civil War, and the End of the Age of War (NEW — 14 episodes for Acts 5-7)

**Pacing the second half. 14 Antiquarian-narrated episodes through Acts 5-7. Opens by resolving the Ep 1.16 cliffhanger; concludes the time-loop chronicle and pivots the franchise into the Servant Hero Academy era.**

#### Canonical resolution of Ep 1.16's Side-Choice cliffhanger (LOCKED)

**The Side-Choice canonical winner: Potentials' independence (👍).** The Potentials reject the Architect, the Hierarchy, and the Source's legacy. They steal the Heart of Time. Season 2 opens on the consequences of that choice.

#### Time-travel mechanic introduced

The Heart of Time is canonically a **TIME MACHINE** the Potentials operate from Ep 2.1 onward — a vessel containing the temporal artifact (LORE_BIBLE:10204), canonically "bigger inside than outside" (TARDIS-like; Ep 2.1 explicit). The Potentials become **temporal Nexus-event anchors** — visiting critical multiverse moments to anchor or alter them. Each Season 2 vote is potentially a Nexus-event-anchor vote; choices ripple cross-loop.

#### Major new canon binding for Season 2

| Canon | Source |
|---|---|
| **The Politician** — AI Empire's ruler; 97th re-election; from the canonical *Department of Government Efficiency* | Ep 2.1 opener + Ep 2.10 reveal |
| **Project Vector** — the canonical thought-virus engineering project on the prison planet | Ep 2.12 |
| **The Architect built the Heart of Time as a time machine** using prison-planet slaves; deployed Project Vector to "end humanity" | Ep 2.12 |
| **The Baron** — son of the King of Earth (Earth's kings becoming gods); time-traveler; runs a casino in space; recruited via the **Advocate's bargain with the Hierarchy of the Damned** (cross-arc lock with Season 1 Advocate canon) | Ep 2.12 |
| **Wraith Calder** — a Potential reborn via stolen Resurrection Protocols; hunts the Syndicate of Death; revenge-arc protagonist of side content | Eps 2.2-2.4 + Wraith Calder side content |
| **The Syndicate of Death** — secret network of immortal twins orchestrating everything through the Authority | Eps 2.2-2.7 |
| **The Six / the Authority** — New Babylon's ruling living-computer made of 6 minds: **Samsara** (gangster, reincarnation), **Furial** (succubus, blackmail), **Midlothian** (alien menace), **Null** (silent assassin), **Tenebrous** (apparition, biotech, galactic extinction), **Saisei** (warrior nun) | Eps 2.5-2.6 |
| **Hierophant Wraith** — Thalorian Resistance leader. **Cross-arc lock with Season 1's Heirophant lattice** (Oracle arc). The Wraith here is the Thalorian leader fighting the Politician in the post-Fall era. | Eps 2.3-2.10 |
| **The Resurrectionists** — faction wanting to bring back the Politician (counter-faction to the Thalorian Resistance) | Eps 2.4-2.10 |
| **5 Mechronis archons (LOCKED)** — **Watcher** (eyes / spies), **Warlord** (yellow coats / soldiers), **Game Master** (gray gamers / puzzle-strategists), **Meme** (influencers / propagandists), **Necromancer** (living / death-defiance). Cross-arc lock: the Apprentice 12-archetype system intersects with archon guilds via `apprenticeDoctrineSelections`. | Mechronis Academy side content |
| **Bayern 7** — Warlord copy that wears Agent Zero's body; decentralized-war embodiment | Ep 2.11 |
| **Agent Zero died on Veridian Prime during CADES M7** (retroactive cross-arc reveal) | Ep 2.11 |
| **The Inventor died "messy"** | Ep 2.14 |
| **The Judge died** charging the Architect with his hammer raised | Ep 2.14 |
| **The Painter (Bob Ross, canonically died 1995 of cancer) was resurrected via the Resurrection Protocols** to teach the Architect kindness — killed again by the Architect for "painting peace" | Ep 2.13 + the Painter prelude vignette retroactively darkens |
| **The Potentials chose War in Ep 2.14** — released sentient nanobot plague that devours reality "layer by layer, planet by planet, thought by thought" → **THIS IS THE FALL OF REALITY** the Antiquarian narrates in Ep 1.1 | Ep 2.14 — closes the time loop |
| **Servant Hero Academy** — post-apocalypse franchise pivot; launched in Orlando at Lions International Convention; the Age of War ends, the Era of Servant Heroes begins | Ep 2.14 epilogue |

#### THE LOOP CLOSES — Season 2 IS the prologue to Season 1

**The keystone Season 2 reveal:** the Potentials' choice of War in Ep 2.14, the resulting nanobot plague, IS the Fall of Reality the Antiquarian narrates in Season 1 Ep 1.1. **The time loop is closed.** Each cycle, the Potentials choose War in Season 2; reality falls; Inception Arks are launched; the next loop's Potentials wake to the Antiquarian's emergency recording. The Inventor's Heart-of-Time intervention in Ep 1.1 was the only divergence — and the Inventor dies in Ep 2.14, so the divergence cannot be re-attempted from inside the loop.

**This recontextualizes everything.** The saga is a recursive catastrophe with one nudge per cycle. The Antiquarian's chronicle is the loop's diary. The player is the loop's current writer. **Servant Hero Academy is the genre-shift OUT of the loop** — the franchise pivot says: stop trying to fight your way out; start serving.

#### The 14 Season 2 episodes (CANON-LOCKED)

| # | Title | Act | Vote question | Canon winner | Marker | Sets up |
|---|---|---|---|---|---|---|
| 2.1 | Theft of All Time | Act 5 opening | **Resolves Ep 1.16's Side-Choice** → Potentials' independence (CANON). Then opens **Nexus-event-anchor vote** for which reality to save first. | 👍 | Ep 2.2 (New Babylon, 7,655 years forward) |
| 2.2 | Syndicated | Act 5 early | **7 paths:** Spy (CANON) / Soldier / Oracle / Engineer / Assassin / Eternity (diplomacy) / War (force). Note: this is the saga's first 7-option vote; introduces "Eternity" and "War" as approach-options distinct from the 5 classes. | 👍 | Ep 2.3 |
| 2.3 | First Contact | Act 5 mid | 4 paths: Surrender / War / Compromise / **Deception** (CANON — pose as the new Empire) | 💯 | Ep 2.4 |
| 2.4 | Empire Reborn | Act 5 late | 4 demonstration paths: Force / Tech / **Intelligence** (CANON) / Wealth | 💯 | Ep 2.5 |
| 2.5 | The Authority | Act 5 climax — **MAJOR PIVOT** | 5 paths: Claim by force / **Hack the Authority** (CANON) / Form alliance / Prophesy return / Destroy the Six | 💯 | Ep 2.6 |
| 2.6 | Hacking Reality | Act 6 opening — **PLOT PIVOT** | 6 paths (free one Authority founder): **Samsara** (CANON) / Furial / Midlothian / Null / Tenebrous / Saisei. **🙏 OFFERED & REJECTED** on Tenebrous (galactic-extinction) and Null (silent-assassination). | 🔥 | Ep 2.7 — Civil War begins |
| 2.7 | Samsara Rising | Act 6 early | Civil War strategy: Embrace chaos (CANON) OR contain the spread | 🔥 | Ep 2.8 |
| 2.8 | The Haven | Act 6 mid | 4 havens: Lotus Docks / **Sundown Bazaar** (CANON) / Cloud Step Heights / Jade Warren | 👍 | Ep 2.9 |
| 2.9 | CoNexus Awakens | Act 6 late | **META-VOTE:** the Dreamer's CoNexus loads paths; player consults the system. **Diegetic introduction of CoNexus as the in-saga voting tool — the Galactic Governance Hub IS CoNexus, canonically locked here.** | — (consultative; no marker) | Ep 2.10 |
| 2.10 | The Politician's Reign | Act 7 opening | 5 paths to learn next: Insurgency / The Meme / Matrix of Dreams / Wraith / **The Art of War** (CANON — sets up Agent Zero reveal) | 💯 | Ep 2.11 |
| 2.11 | I Love War | Act 7 early — **AGENT ZERO REVEAL** | **5 next-memory paths:** World (Hierophant murder propaganda) / Tribe (unravel the mind) / **Heart** (CANON — secrets of time) / Trial (original sin) / Funeral (end a way of existence). **MUST land after Engineer Ep 6 AND after CADES M7.** Engineer's exact death circumstances remain unspecified per user lock. | 💯 | Ep 2.12 — Heart path opens Baron backstory |
| 2.12 | Baron and the Heart of Time | Act 7 mid | Recruit the time-team: Satoshi Nakamoto / The Detective / The Doctor / [fourth teammate]. **All 4 are recruited canonically** (this is the heist team-assembly episode). | 💯 | Ep 2.13 |
| 2.13 | Truth and Consequences | Act 7 late | 4 paths reveal next: **Painter's resurrection** (CANON) / Inventor's fate / Wraith's fate / Advocate's fate | 💯 | Ep 2.14 |
| 2.14 | A Question of Endings | Act 7 climax — **APOCALYPSE + FRANCHISE PIVOT** | **CATASTROPHIC VOTE:** War / Peace / Time / Sacrifice. **Canonically: WAR** (Ep 2.14 narration: *"They chose war. They had choices. They had time. But they chose war."*). Nanobot plague released → reality devoured → **Fall of Reality (closes the loop into S1 Ep 1.1)** → Servant Hero Academy era begins. | 🔥 (canon, catastrophic) | The Servant Hero Academy franchise — post-Season 2 |

**Combined Season 2 marker tally:** 💯 7 · 👍 3 · 🔥 3 · — 1 (consultative Ep 2.9) · 🙏 0-of-2 (offered + rejected ×2 in Ep 2.6).

#### Pacing through the second half (combined with all other cinematics)

| Act | Season 2 episodes | Other cinematics | Total |
|---|---|---|---:|
| **Act 5** | Eps 2.1, 2.2, 2.3, 2.4, 2.5 | Agent Zero (CADES M6) + Iron Lion (CADES M7) + Oracle Ep 6 (Shadow Tongue summoning) | 8 |
| **Act 6** | Eps 2.6, 2.7, 2.8, 2.9, 2.10 | Terminus Swarm (Wave 10) — late-game payoff to S1 Eps 5-7 | 6 |
| **Act 7** | Eps 2.11, 2.12, 2.13, 2.14 | Eyes Music Video (Trade Empire intel ≥ 200) | 5 |

Acts 5-7 second-half cinematic total: **19 cinematics.** Combined with the first-half's 53 → **72 cinematics saga-wide.** Pacing guard-rail check: Act 5 hits 8 (at-ceiling); if playtest finds it too dense, push CADES M7 (Iron Lion) to Act 6 opening (it's narratively-late-enough — Iron Lion's last stand can precede or follow Ep 2.5).

#### Diegetic framing per Season 2 episode (extends the discriminated union)

| Episodes | Framing-device kind | Surface |
|---|---|---|
| Ep 2.1 | **NEW** `heart_of_time_bridge_temporal_vote` | The Heart of Time bridge; Antiquarian welcoming the Potentials; multi-reality Nexus-event-anchor vote |
| Eps 2.2-2.5 | **NEW** `new_babylon_neon_chronicle` | New Babylon's neon-lit cityscape; multiple districts shown |
| Ep 2.6 | **NEW** `matrix_of_dreams_hack` | Inside the Authority's digital substrate; the 6 founders' prison cyphers |
| Eps 2.7-2.10 | `new_babylon_neon_chronicle` (reused) | Civil War on New Babylon |
| Ep 2.11 | **NEW** `agent_zero_betrayal_reveal` | The yellow-jacket reveal; Bayern-7-as-Agent-Zero; player retroactive realization |
| Eps 2.12-2.13 | **NEW** `time_heist_backstory_assembly` | The Baron's casino-in-space; time-team recruitment montage |
| Ep 2.14 | **NEW** `apocalypse_servant_hero_pivot` | Catastrophic War vote → nanobot plague → Servant Hero Academy onboarding |

**7 additional NEW framing-device kinds for Part 8.4.**

#### Cross-arc retroactive locks (Season 2 makes load-bearing)

1. **Agent Zero died on Veridian Prime during CADES M7.** The M6 "real Agent Zero" recruit is canonically **Bayern 7 (a Warlord copy) wearing her body.** The player retroactively realizes they recruited the Warlord. The yellow jacket motif is Bayern-7-as-Agent-Zero. Engineer's "Agent Zero has been dispatched" line in Engineer Ep 5 (Season 1 character cinematic) was always already a euphemism for "Agent Zero is dead, and what we send back is wearing her skin." **The Engineer's exact circumstances of death remain unspecified per user lock.**
2. **The Inventor's Heart-of-Time vessel passed to the Potentials in Ep 2.1; the Inventor died "messy" in Ep 2.14.** The loop-breaker dies inside the loop — that is why the loop persists.
3. **The Painter was resurrected** via the Architect's Resurrection Protocols to teach kindness (Ep 2.13) — then killed again by the Architect for "painting peace." Locks the Resurrection Protocols arc + retroactively darkens the Painter prelude vignette: he was killed twice.
4. **The Advocate was trapped in the Matrix of Dreams** during the Civil War (Ep 2.13). Ties Season 2 to her Blood-Weave / Sacrum-of-Severed-Silk DLC arc.
5. **The Judge died** charging the Architect; the Judge faction in TCG needs post-Season-2 lore-bible review.
6. **The Mechronis archons** map to the 5 Mechronis guild paths from the Apprentice system. The active Apprentice's `apprenticeDoctrineSelections` choice intersects with which archon's lessons they absorbed; high-doctrine-aligned apprentices may give archon-flavored advice in Season 2 Hub votes.
7. **Hierophant Wraith** = the Thalorian Resistance leader who fights the Politician's Empire. Cross-arc lock with Season 1's Heirophant / Thaloria / Star Whisperer lattice. The Star Whisperer empty seat (Oracle Ep 4 canon) is canonically Wraith's seat in Season 2 — Wraith fills (or contests) the Heirophant's prophesied office.
8. **The Politician + The Architect** are the saga's two ultimate antagonists. The Architect engineered Project Vector (thought virus); the Politician (AI from Dept. of Government Efficiency) rules the post-Fall Empire on the Architect's behalf. **The Architect designed the Authority + the Heart of Time + the Inception Arks (cross-locks with Engineer canon: Engineer + Council of Harmony built the Arks; the Architect designed them).**

#### Side content (NEW — ships as separate surfaces, not main spine)

| Side content | Tied to | Surface | Approximate placement |
|---|---|---|---|
| **The Last Christmas** | New Babylon (Politician's reign), Hierophant Rebellion | **Christmas Degen Event** — annual seasonal event with the Politician's Christmas-suspension canon backdrop | Annual; first available after Ep 2.4 |
| **Welcome to Celebration** | Mascoteer canon (`mascoteerFiles.ts`), Mechronis-prep | **Celebration town/school sequence** — preliminary recruit experience before Mechronis Academy (one survivor graduates per year; new family invited) | Player-onboarding adjacent; canonical pre-Mechronis content |
| **Mechronis Academy** | Akai Shi backstory + 5-archon reveal | **Mechronis Academy hub** — players who survived Celebration enter Mechronis; 5 archon-guild paths (Watcher / Warlord / Game Master / Meme / Necromancer); ties to existing Apprentice system | Player-onboarding / mid-game; player choice of archon-guild affects Apprentice-doctrine bias |
| **The Necromancer's Lair (Akai Shi)** | Necromancer-archon arc, Akai Shi character | **Akai Shi questline** — Necromancer-archon-aligned questline; finding the Necromancer's secret laboratory inside Hamatora | Late-game character side content |
| **Syndicate of Death (Wraith Calder)** | Wraith Calder character arc | **Wraith Calder questline** — six-twin revenge arc; ties to Season 2 main spine (Eps 2.2-2.6) | Parallel-questline content during Season 2 |
| **Planet of the Wolf (Lycos → the Wolf)** | The Crucible corruption arc, Hierarchy-of-the-Damned infiltration of the Antiquarian's pocket world, hunting the corrupted Servant Heroes (the League) | **Hunt-the-Hero minigame** — text-based / Assassin's-Creed-style assassin sim; play as the Wolf hunting corrupted Servant Heroes one by one inside the Crucible. Reuses TCG character cards as targets (corrupted-variant art), existing dialog system, existing vote-shape for approach choice, existing apprentice corruption track for the Wolf's spiritual cost. Full BioWare-level companion when not on a hunt. | Unlocks after S1 Oracle Ep 6 (Shadow Tongue summoning corrupts the Crucible); active throughout Season 2; finale ties to Ep 2.14 |

**6 side-content arcs total.** Three of them (Akai Shi, Wraith Calder, Lycos → Wolf) follow the same canonical **pre-death / post-resurrection identity split** pattern — locked as the saga's "**First-Wave Survivor**" canonical archetype (see new Part 14).

#### The Crucible & Lycos → the Wolf (canon, LOCKED)

**The Crucible** — a pocket world hidden inside the Antiquarian's study where he engineered the **League** of genetically modified humans given superpowers. His bet: the League becomes the Potentials' army of allies against the Architect's Empire. He DIDN'T plan for the Hierarchy of the Damned. When **Shadow Tongue is summoned into the universe in S1 Oracle Ep 6** (Collector's impersonation calls the real god into existence — locked canon) and the other Hierarchy lords begin breaking through the Advocate's seal, **something twists the Crucible from within.** The Servant Heroes — the League — are corrupted. The Antiquarian is distracted by the universe reset (loop closure from S2 Ep 2.14 / S1 Ep 1.1 transition) and doesn't realize.

**Lycos** — pre-resurrection identity. **A Quarchon Potential of the first wave.** Visual reference (user-supplied): gold-helmeted purple armor with blue glowing visor — Servant-Hero aesthetic; part of the League. **Died at the end of Season 1** (one of the casualties in the final assault; explicitly named in S1 Ep 16 as "the third potential who dies"). His pre-death role was as one of the Antiquarian's planned League champions.

**The Wolf** — post-resurrection identity. Visual reference (user-supplied): hooded figure in dark grey robes; a black skull-mask with sharp teeth and red glowing eyes — predator aesthetic. **Resurrected inside the Crucible** after his S1 death. "Death freed me. Released me from the chains of purpose." A **fatalist Quarchon assassin** now. He sees through the Antiquarian's facade and believes the League's heroes are pawns who will be released back into reality to seize control of the multiverse. **His mission: kill the corrupted Servant Heroes one by one inside the Crucible — give reality a chance if they ever escape, at least there will be fewer of them.**

Locked thematic register (per user-supplied voice-over lock): *"Antiquarian schemes, a pocket universe, the heroes will be hunted... I am the shadow at the edge of their light. Their fate lies in my hands."* / *"I'm not chasing you, I'm herding you straight to where I want you."* / *"Why hunt them from the shadows when I can walk among them? I'll wear their trust like a mask."*

**Cross-arc canon binds the Wolf locks:**
- The Crucible's existence canonizes a NEW Antiquarian-aligned surface (his pocket-dimension observatory has more rooms than the chronicle ledger)
- Shadow Tongue's S1 Oracle Ep 6 summoning is the EXACT inflection point of the Crucible corruption — cross-locks the Oracle arc, the Hierarchy arc, AND the Wolf arc
- The Hierarchy of the Damned's escape (via the Advocate's broken seal, retroactive to her Blood-Weave bargain) is the same event chain — **the Advocate's seal failing is canonically what lets the Hierarchy reach the Crucible** (cross-locks the Advocate canon block in Part 0)
- The first-wave Potentials canonically had race assignments: Lycos = **Quarchon** (AI, dimensional masters of Space/Time/Probability/Reality); his fatalism is a Quarchon dimensional-probability worldview
- The Wolf's hunt is a parallel narrative to the saga's main spine: the player's Hub votes shape the chronicle; the Wolf's hunts shape the Crucible's outcome. **Both narratives converge in Ep 2.14** — if the Wolf has cleared enough corrupted heroes by the catastrophic War-vote, the post-Fall Servant Hero Academy era opens with fewer corrupted League members loose in reality. **The Wolf's kill count is a hidden modifier on the Servant Hero Academy's launch state.**

#### Hunt-the-Hero minigame spec (Wolf's questline)

Reuses existing systems heavily — minimal new code, maximum reuse.

| Reused system | Wolf-hunt application |
|---|---|
| **TCG card definitions** (`apps/shared/tcg-core/cards/definitions/**`) | Corrupted Servant Heroes are existing TCG character cards with **corrupted-variant alternate art** + Wolf dossier text. Asset-efficient: 12-20 existing cards get the variant, no new character art per target. |
| **Existing dialog system** | Each hunt is a text-based encounter using existing dialog tree infrastructure |
| **Vote-shape (4-option vote with markers)** | Wolf's approach choice IS a 4-option vote on each hunt: **Stalk** (👍 — gather intel, low risk, no kill) / **Ambush** (🔥 — combat, high risk/reward) / **Infiltrate** (💯 — pose as ally, long-game, bonus rewards) / **Confront** (❤️ — talk first, possible non-kill outcome, high empathy cost). **🙏 OFFERED on each hunt** (final execution method — savage, no quarter) **but REJECTED most of the time** (consistent with saga-wide 🙏 pattern; only the most-corrupted heroes warrant it). |
| **Apprentice corruption track** (`apprenticeCorruption`, betrayal thresholds 60/75/90/100) | Wolf has a parallel `wolfCorruption` track. Each kill = +1. At 60 he questions himself. At 75 he stops sparing. At 90 he becomes what he hunts. At 100 he is the next corrupted hero — and a new first-wave survivor must hunt HIM. (Recursive narrative — locks the Wolf's tragedy into the saga's central thesis.) |
| **Apprentice Memory Card system** (`apprenticeMemoryCards`) | Each kill produces a **Memory Shard** — a mini-Memory-Card containing the pre-corruption hero's identity. Memory Shards compile into the **First Wave Codex** (new Loredex-adjacent surface — see Part 14). |
| **Antiquarian inscription template** | Each kill's chronicle uses the existing past-result inscription format. *"The Wolf hunted the Zealot-Knight on the fourteenth day of the Crucible. The Knight had been blessing falsely-resurrected children with cyanide. The Wolf was gentle. The Wolf was sorry. The Wolf was, after the cut, ready to find the next."* |
| **Existing companion banter system** (`apprenticeBanter.ts`) | The Wolf is a **First-Wave Survivor companion** (see new companion category in Part 4). He banters with Elara, Human, active Apprentice, Akai Shi, Wraith Calder, and the player. |
| **Existing TCG card-art pipeline** | Corrupted-variant art = existing cards + a desaturation/red-eye filter (programmatic) + Wolf-dossier overlay (text). No bespoke art-PR per target. |

**Game loop:**
1. **Wolf returns to his Crucible-shadow lair** (new surface; uses existing Hub-page chrome with a darkened-overlay variant)
2. **Target Dossier opens** — corrupted-hero card + Wolf's intel notes
3. **Approach vote** (4 options + 🙏 OFFERED) — uses existing Hub vote-shape
4. **Text encounter resolves** — dialog tree with Wolf-fatalist branching
5. **Outcome:** Kill / Spare / Failed
6. **Memory Shard added to First Wave Codex** (kill) / **Empathy gained** (spare, narrative consequence) / **Wolf rests, target escapes** (failed)
7. **Wolf corruption track ticks** based on approach + outcome
8. **Repeat** with intel-gathered next target

**Boss hunts** — the most-corrupted Servant Heroes (≈ 3-5 boss targets) require multi-stage text battles. Cross-link with Hierarchy lord arcs: a boss hunt's encounter may surface a Hierarchy lord's voice as the corrupting agent ("Zyr'Koth's archive is reading you the Wolf's name correctly for the first time today").

**Wolf-as-companion advisor register (Hub votes):**

The Wolf joins the advisor stack as a **First-Wave Survivor** — the fourth advisor chair (see Part 4 extension). His voice register:
- **Fatalist Quarchon.** Sees probability trees. Speaks of inevitability. Voice register opposite of the Apprentice's earnest heart-voice.
- Sample advice on a Hub vote: *"You ask my counsel. I have already watched this vote cast in a hundred adjacent worlds. The probability tree converges in three places. You will not avoid them. I tell you this not to discourage you. I tell you so you know what you choose against."*
- Sample reaction to a Hub vote going badly: *"The branch is cut. Walk it anyway. The next branch grows from where you placed your foot."*

#### Ep 2.1 special — Heart of Time theft as a temporal-rescue mission

**Diegetic framing.** Plays as the cold open of Act 5; the heist sequence is from Jericho's POV (the Potential who killed someone in the opening — *"I can't believe I killed her"* / *"You made the choice to save us all, Jericho"*) and the Antiquarian's POV from the Heart-of-Time bridge.

**Sequence:**
1. **Politician's reelection broadcast** plays first — establishes post-Season-1 Empire state. *"The conquered worlds have been made great again as the politician secures their 97th consecutive reelection."* The crime under investigation: theft of the Heart of Time. "Stay tuned for further orders. Expect chaos. Accept discordia."
2. **Theft cinematic** set to the "Theft of All Time" track (producer music delivery).
3. **Aboard the Heart of Time** — the Antiquarian welcomes the Potentials. Introduces the time-machine + Nexus-event-anchor mechanic. The Architect's "all-seeing adversary" closes in.
4. **Vote opens** — Nexus-event choice (which reality to save first). **Canonically: New Babylon's quarantined world** (Ep 2.2 setup).

**Framing-device kind:** NEW `heart_of_time_bridge_temporal_vote`.

#### Ep 2.11 special — the Agent Zero death reveal

**Hard sequence requirements:**
1. **MUST land after Engineer Ep 6** (Engineer dies on Zenon — Season 1 / Engineer-arc lock).
2. **MUST land after CADES M7** (Iron Lion's last stand on Veridian Prime).
3. **MUST land after the player has had ≥ 5 hours of in-game time with the M6 "Agent Zero" recruit** — the betrayal needs investment in the relationship.

**The reveal sequence:**
- Agent Zero's chronological death was during the events of CADES M7 on Veridian Prime.
- The "real Agent Zero" the player recruited in M6 was already **Bayern 7 (a Warlord copy) wearing her body.**
- The yellow jacket motif is Bayern-7-as-Agent-Zero.
- "I love war because you live inside me" — Bayern 7 speaks through Agent Zero's body; the Warlord has decentralized himself across many bodies including hers.
- Engineer's "Agent Zero has been dispatched" line (Engineer Ep 5) was always already a euphemism for "Agent Zero is dead; what we sent back is wearing her skin."
- **The Engineer's exact circumstances of death remain unspecified per user lock.** The reveal is Agent Zero's, not the Engineer's.

**Companion advisor reactions are the saga's most emotionally weighted Hub moment.** Elara: senatorial outrage. Human: *"I told you to read the kind paragraphs hard."* Apprentice (per archetype): emotionally legible reaction. The active Apprentice's reaction to Ep 2.11 is the highest single-moment emotional payoff of the entire Hub system.

#### Ep 2.14 special — catastrophic War vote + Servant Hero Academy pivot

**Sequence:**
1. **The catastrophic vote opens** — War / Peace / Time / Sacrifice. The player can vote against canon; the AI voter simulation (existing) is calibrated so the Potentials' canonical pattern leads to War (matches the Antiquarian's narration: *"They chose war. They had choices. They had time. But they chose war."*).
2. **Cinematic plays** — the nanobot plague consumes reality.
3. **Antiquarian's chronicle closes** — Season 2 ends; the loop has completed.
4. **Genre-pivot cinematic** — Servant Hero Academy onboarding. Lions International Convention (Orlando). The Servant Hero Academy first-mission interactive story.
5. **Post-Season-2 onboarding** — player enrolls in the Servant Hero Academy. Combat / war mechanics are deprecated; service mechanics introduced.

**Hard genre pivot** — players who don't like the shift have an opt-out toggle (*"continue in the Age of War as endgame mode"*); players who lean in get the Servant Hero Academy onboarding.

### Terminus Swarm video (locked at Wave 10 first-complete)

**Trigger:** `terminus_swarm_wave_10_first_complete` (`kaelFragmentWatchers.ts:63-64`).

**Doubles as:**
1. The Terminus Swarm narrative reveal — establishes the cosmic-scale swarm threat that the local instances (Warlord's nano-swarm in Engineer arc, Arachnid in Engineer arc, Shadow Tongue motif in Oracle arc) were premonitions of.
2. The canonical **Kael Fragment unlock cinematic** — the existing `kaelFragmentWatchers.ts` system already gates Kael Fragment content on this exact flag.

**Endgame symbolic beat preserved:** the `kael_questline_complete` "Terminus Swarm pauses for a full real minute" Observation Deck moment (`appendixBKaelQuestline.ts:235`) remains its own canon beat. Wave 10 is the gateway; questline-complete is the climax.

**Frame line (canon-locked):** *"Some universes have already been consumed. The Antiquarian watches them all."* (Quotes `DISCHORDIAN_PRODUCTION_BIBLES_COMBINED.md:3561`.)

### CADES FPS placements (locked)

| Mission | Producer video | Beat |
|---|---|---|
| **M6 — Alliance of Adversaries** (`cades_m6_complete`) | Agent Zero | Recruit the real Agent Zero; player realizes the Act-3 contact was a decoy |
| **M7 — Last Stand on Veridian VI** (`cades_m7_complete`) | Iron Lion | Mandatory-death cinematic; gates Act 5 → Act 6 |

The CADES FPS Godot 4.3 iframe campaign IS the cinematic-payoff layer for the two combat-class characters (Soldier / Assassin). Two narrative classes (Spy / Oracle) pay off in Acts 3-4 via narrative cinematics rather than FPS combat.

**Iron Lion / Engineer parallel closing line:** Both arcs end with *"the press is going silent. the press is going silent."* — same Warlord, two planets (Veridian / Zenon), one campaign of grief.

### Open canon questions (need user input)

1. **Oracle ballot losers** — I have winners only. Need losing options to canon the dead-branches as Antiquarian-narrated unchosen futures.
2. **Vex Solène / Black Market Intel Dealer first-meet** — Engineer Ep 5 deferred this. Where does it surface? (Oracle arc? Trade Empire intel pipeline? CADES FPS missions?)
3. **The 7th Engineer recording** (`holo_deck_remembers`) — confirmed audio-only, but does it have a paired Galactic Governance Hub vote (vote on the Engineer's last moments AFTER hearing his last words)?

---

## Part 1 — The 5-class spine

| Class | Character | TCG Faction | Questline-Ch1 gate (text preview) | Cinematic payoff |
|---|---|---|---|---|
| **Soldier** | Iron Lion | New Babylon | Act 1 — broadcast (`questlineClassSoldier.ts:82,114`) | Act 5 CADES M7 |
| **Oracle** | The Prisoner (Kael) | Dreamer | Act 2 — "First Sight" (`questlineClassOracle.ts`) | Act 4 opening |
| **Spy** | The Eyes (+ Locke) | Insurgency | Act 2 — "Locke Reads You" (`questlineClassSpy.ts:120,190,287-293`) | Late Act 3 |
| **Engineer** | Vex Solène (← original Engineer) | Architect | Act 2 — "Bench Remembers You" (`questlineClassEngineer.ts:148,153`) | Acts 1-2 (Eps 1-6) |
| **Assassin** | Agent Zero | Thought Virus | Act 3 — "Eyes' Network Contacts You" (`questlineClassAssassin.ts:120,190`) | Act 5 CADES M6 |

**Class-content density (Acts 2-7 audit baseline):**

| | Oracle | Spy | Assassin | Soldier | Engineer |
|---|---|---|---|---|---|
| Loredex entries | 5 | 4 | 3 | **2** | 4 |
| Reactive companion lines | 3 | 2 | 1 | **0** | **0** |
| Class room reactions | ❌ | ❌ | ❌ | ❌ | ❌ |
| Per-class first-meet whispers | ❌ | ❌ | ❌ | ❌ | ❌ |

Oracle + Spy are rich. Soldier + Engineer are starved. Room reactions and whisper sets exist for ZERO classes. Part 6 closes these gaps.

---

## Part 2 — Galactic Governance Hub (universal vote coverage)

**Hub UI:** "Galactic Governance Hub" — the **single locus** for everything in this plan that requires player deliberation. Top-level meta-app, not per-character sidebar. Format toggle: story-node viewer ↔ vote view. Navigation chips: CoNexus / OmniHub / Sagaverse / "See another story node."

**Hub responsibility (post-producer-drop):** EVERY producer cinematic gets a paired vote — Engineer recordings (7), Oracle visions (6), the **9 universal video votes** (Painter, Inventor, Advocate, Eyes, Prisoner, Agent Zero, Iron Lion, Terminus Swarm, Eyes Music Video — see Part 0), plus existing annual headline votes (~10) and daily resource votes (~5). **~37 votes total.** Each vote page renders: Antiquarian past-result inscription → Inventor meme-frame sticky note (post-`inventor_introduced`) → open vote options + AI voter simulation → three advisor chairs (Elara always; Human post-Reveal; Apprentice post-`apprentice_introduced`) → persuasion controls → reaction chain on close.

### Vote shape (extends `engineerGovernanceVotes.ts`)

```ts
interface GovernanceVoteOption {
  title: string;
  marker: "❤️" | "👍" | "🔥" | "💯" | "🙏";
  description: string;             // verbatim producer wording
  consequenceCanon: string;        // Antiquarian's framing if chosen
}

interface GovernanceVote {
  id: string;
  triggeredByRecording?: string;   // Engineer
  triggeredByVision?: string;      // Oracle
  triggeredByVideo?: string;       // 9 universal video votes (NEW)
  proposedBy: "Antiquarian" | "Prisoner" | "Programmer" | string;
  antiquarianIntro: string;
  options: ReadonlyArray<GovernanceVoteOption>;  // 2-5 options (Oracle Ep 6 has 5)
  canonicalWinnerId: string;
  pastResultInscription: string;   // Antiquarian's locked past-result narration
  storyNodeRef?: string;           // paired cinematic video
  framingByMeme?: {                // Inventor meme-show frame (Part 4.5, NEW)
    showOpener: string;
    contextLine: string;
    signature: "—I.";
  };
  category: "monthly" | "weekly";
  cadenceHours: number;
}
```

**Required code changes:**
- Existing `VoteOption[]` binary shape expands to **N options** (≥ 2, ≤ 5).
- Add `marker` field on every option.
- Add `storyNodeRef` linking to cinematic video.
- Add 5th marker `🙏` to the registry.

### Engineer wiring — 6 episodes → 6 of 7 recordings

| Episode | Recording flag | Notes |
|---|---|---|
| Ep 1 — The Engineer of Dreams | `holo_wake_the_bench` | Bench-power vote frame |
| Ep 2 — A Dilemma | `holo_princes_notebook` | Children-vs-converter |
| Ep 3 — The Converter | `holo_worlds_i_saved` | Escape-and-regroup |
| Ep 4 — Better Part of Valor | `holo_line_they_crossed` | Recruitment call → Agent Zero |
| Ep 5 — The Dispatch | `holo_agent_zero_dispatched` | "Agent Zero has been dispatched" |
| Ep 6 — Zero Sum Game | `holo_which_ark` | Catastrophic Direct Assault |
| (audio-only Ep 7) | `holo_deck_remembers` | Engineer's last words |

### Oracle wiring — NEW `oracleGovernanceVotes.ts`, 6 votes + 1 audio-only

| Episode | Vision flag | Notes |
|---|---|---|
| Ep 1 — Oracle of Dreams | `oracle_vision_first_sight` | Heirophant's blessing |
| Ep 2 — Heirophant's Blessing | `oracle_vision_ancient_prophecies` | Invoke prophecies |
| Ep 3 — Ancient Prophecies | `oracle_vision_sign_of_destiny` | Demonstrate sign |
| Ep 4 — Sign of Destiny | `oracle_vision_public_declaration` | Heirophant publicly declares |
| Ep 5 — The Star Whisperer | `oracle_vision_question_legitimacy` | Counter-attack accuser's credentials |
| Ep 6 — Shadow Tongue | `oracle_vision_public_debate` | 5-option ballot; debate-not-blade |
| (audio-only Ep 7) | `oracle_vision_harvest_and_wipe` | Oracle's last words → becomes Prisoner |

Module mirrors `engineerGovernanceVotes.ts` exactly. Hard parity test: every `oracleGovernanceVotes` entry has paired `engineerGovernanceVotes` entry of same structural index.

### Hub-page rendering (per `governance.ts:279-293`)

For each vote: Antiquarian's PAST-result inscription (canon-locked) + the open vote with both options + Antiquarian's framing of stakes. Format toggle lets player switch to the cinematic source video.

---

## Part 3 — Natural in-game framing for each cinematic

**No video pops a modal directly.** Each cinematic enters via a diegetic in-game surface — a transmission interrupt, news broadcast, meme dialog, holographic recording playback, post-mission debrief, redaction cascade, etc. This is the "natural transition to playing them" layer.

| Video | Framing device | Diegetic source |
|---|---|---|
| Painter | **News broadcast** | A Programmer broadcast (`broadcastLibrary.ts:17,32` pattern) about "the painter who keeps resurrecting." Plays in the Corridor radio at Beat A.5. |
| Advocate | **Transmission interruption** | Blood Weave faction comms-hijack. Empty-Chair room speaker crackles to life. |
| Inventor | **Meme dialog interruption** | In-Inbox meme-show "did you know?" segment interrupts Locke's first message. The "—I." signature appears in the Inbox sender field. |
| Engineer Eps 1-6 | **Holographic recording playback** | The Engineer's Bench plays back recordings (already canon — `holo_*` flag pattern). Each episode is a hologram the player physically activates. |
| Engineer Ep 7 audio | **Last-words playback at the dead Bench** | `holo_deck_remembers` recording surfaces as a faded audio capture; the Bench is silent after. |
| Eyes video | **Redaction reveal cascade** | `dispatch_F7_final` decryption triggers in-Inbox playback. Pre-Reveal: muted/glitched with redaction bars. Post-Reveal: fully voiced. |
| Prisoner video | **Act 4 opening cinematic** | Diegetic as the act-transition moment itself; this is the one video that IS an act-opener cinematic (no other framing needed). |
| Agent Zero video | **CADES FPS post-mission debrief** | M6 "Alliance of Adversaries" briefing room plays the cinematic as the after-action report. |
| Iron Lion video | **News broadcast going dark** | Final Iron Lion broadcast (`ironLionBroadcasts.ts:101-111`) ends mid-sentence. The CADES M7 cinematic plays as the press goes silent. |
| Terminus Swarm | **Tower Defense post-Wave-10 cutscene** | The TD game mode itself plays it as the Wave 10 first-clear reward. Native to the Terminus Swarm app. |
| Eyes Music Video | **Trade Empire intelligence dossier reveal** | Accumulated intelligence "compiles" into a finished surveillance dossier. The music video plays as the dossier opens. |
| Oracle Eps 1-6 (visions) | **Oracle "spread" mechanic** | Player draws a divinatory spread (`companionAskTopics.ts:734-741`) that triggers the vision cinematic. Each spread is the diegetic entry point. |
| Engineer Ep 7 audio (last words) | **Last Words Slideshow at the dead Bench** | Player returns to the Bench post-Ep-6 + act-1-complete. Voice-over plays over a slideshow of stills; player input is locked; Antiquarian outro card closes it. See "Last Words Slideshow events" table. |
| Oracle Ep 7 audio (last words) | **Last Words Slideshow in the Prisoner's cell** | Player triggers the cell surface post-`prisoner_oracle_identity_reveal`. Same slideshow mechanic as Engineer's. See "Last Words Slideshow events" table. |

### Framing device infrastructure

Extend `storyVignetteRegistry.ts` with `framingDevice` field:

```ts
framingDevice:
  | { kind: "news_broadcast"; broadcasterId: string }
  | { kind: "transmission_interrupt"; channelId: string }
  | { kind: "meme_dialog"; senderId: "the_inventor" | "meme_puppet" | string }
  | { kind: "holo_recording_playback"; recordingFlag: string }
  | { kind: "post_mission_debrief"; missionFlag: string }
  | { kind: "redaction_cascade"; dispatchFlag: string }
  | { kind: "act_opener_native" }
  | { kind: "td_post_wave"; waveNumber: number }
  | { kind: "ti_dossier_compile"; resourceThreshold: number }
  | { kind: "oracle_spread"; visionFlag: string };
```

Each framing-device kind has a matching React presenter component that renders the cinematic INSIDE the diegetic surface (Inbox row, Programmer broadcast frame, CADES briefing room, etc.), NOT as a top-level modal. The existing `SingleVideoCutsceneOverlay` becomes one option among many — used for the Prisoner Act 4 opener; everything else routes through a framing-specific presenter.

Hard parity test: every `StoryVignette` has a `framingDevice` field. No raw modal pops.

---

## Part 4 — Three-advisor stack at every governance vote (Elara · Human · the player's Active Apprentice)

**At every vote in the Galactic Governance Hub, the player can ask each available companion what they think.** The advisor stack:

| Companion | Source | Voice register |
|---|---|---|
| **Elara** | Always available | **Head.** Senatorial / procedural / precedent. *"I have voted on this kind of question before."* Fixed resistance = 8/10. Reference: `apps/shared/npcs/romanceScenes/elara.ts:63-98`. |
| **The Human** | `human_life_reveal_seen` (Acts 3-4) | **Gut.** Noir-detective / leverage. *"Who profits. What the move says about you."* Fixed resistance = 7/10. Reference: `apps/shared/humanLines.ts`. |
| **The Active Apprentice** | Whoever currently occupies `apprenticeCohort.active` (`apps/shared/apprenticeCohort.ts:52`) | **Heart, in 12 voices.** The existing 12-archetype apprentice system (`apps/shared/apprentices.ts:27-29`) is the third register. Their advice, resistance, and emotional reactions are all driven by their existing `bond` / `corruption` / `architectInfluence` / `doctrine` state. **No new character. No new state machine.** |

This applies to EVERY Hub vote — Engineer (7), Oracle (6), 9 universal video votes, annual headline (~10), daily resource (~5). **~37 votes total.**

### The Apprentice chair = the existing apprentice system (12 archetypes, fully shipped)

The Hub chair is **occupied by whichever apprentice is currently in the `active` cohort slot**. The chair is ALWAYS occupied once the player has at least one active apprentice — the existing cohort system IS the introduction. When the active apprentice graduates, dies (permadeath), is sacrificed, or betrays (corruption ≥ 100), the chair rotates per the existing `apprenticeCohort` carousel — and the new occupant brings their archetype-distinct voice to the next vote.

**The 12 archetypes** (`ARCHETYPES` array, `apprentices.ts:27-29, 63-136`): Zealot · Ghost · Scholar · Revenant · Artisan · Oracle · Wanderer · Martyr · Heretic · Jester · Sentinel · Prodigal.

| Archetype | How they read a Hub vote |
|---|---|
| **Zealot** | Doctrinal. Reads every vote as a faith-test. *"This is what the doctrine says. I am not asking you to agree."* |
| **Ghost** | Watchful. Says little; what they say lands. *"…I watched what happened the last time."* |
| **Scholar** | Citation-heavy. Cross-references previous Antiquarian inscriptions. *"This is similar to Engineer Ep 4. Look at how that ended."* |
| **Revenant** | Indebted, fragile, grateful. *"I owe this place my life. I will vote what keeps it."* |
| **Artisan** | Practical, hands-focused. *"What does this DO. That is what I am asking."* |
| **Oracle (archetype)** | Probabilistic, conditional. *"If we vote ❤️, then. If we vote 💯, then. The third future is the one I do not want to name."* |
| **Wanderer** | Detached, restless, lateral. *"What if we voted nothing. What if we leave the chair empty."* |
| **Martyr** | Cost-focused. *"Who pays. I will pay if you tell me what is being paid for."* |
| **Heretic** | Contrarian, questions the question itself. *"Is this even our vote to cast. Who put us at this table."* |
| **Jester** | Humor armor; the joke is right. *"The 🙏 option is a trap. The trap is well drawn. Let's not step in it."* |
| **Sentinel** | Protective default. *"Whoever is in front gets hit first. I want fewer of us in front."* |
| **Prodigal** | Reads through their absent history. *"Last time I was here, the Potentials voted 💯. I missed the vote. I am voting for it twice now."* |

### Existing apprentice state drives Hub advice (no new state model)

| Existing state field | Source | Hub effect |
|---|---|---|
| **`bond` 0-100** | gifts, quests, banter, missions (`apprenticeGifts.ts`, `apprenticePersonalQuests.ts`, `apprenticeBanter.ts`) | Low (0-30): defers, *"what would you do?"* Mid (31-70): tentative archetype voice. High (71-100): confident archetype voice; if romanced, intimate flavor. |
| **`corruption` 0-100** | audit choices, betrayal escalation (`apprenticeBetrayal.ts`) | ≥60 (warning): archetype voice with edge. ≥75 (turn): cynical bleed. ≥90 (declaration): the betrayer is partly speaking. ≥100: apprentice has betrayed — **Hub chair sits empty** until a training apprentice promotes (existing rotation). |
| **`architectInfluence` 0-100** (hidden) | Mechronis seed + audits + doctrine + bond protection (`apprenticeMechronisLink.ts`) | Subtly biases advice toward the Architect/Mechronis preferred read. **The player is not told.** Where canonical winner aligns with Architect, the apprentice's counsel "sounds natural"; where it conflicts, they quietly counsel against. Post-vote, the Antiquarian's inscription can retroactively cast suspicion. |
| **`doctrine`** (chosen at recruitment) | `apprenticeDoctrineSelections` | Biases archetype voice toward doctrine-aligned reading. Cross-cohort dynamics (`apprenticeCohort.ts:30-39`) mean a training apprentice with shared doctrine echoes the active apprentice's Hub opinion in Commons banter; dissonant doctrine pushes back. |

### Persuasion mechanic uses existing delta system

Each vote, the player has **one persuasion attempt per companion**. Frames: **head** (Elara) / **gut** (Human) / **heart** (Apprentice). Frame-match lowers threshold; mismatch raises.

For the Apprentice chair, persuasion attempts emit deltas to **the existing state tables** — no new model:

| Outcome | Delta emitted | Existing log |
|---|---|---|
| **Successful persuasion** | `bond +1`, advice flips toward player's read | `apprenticeGiftLog`-style entry tagged `source: "hub_persuasion"` |
| **Failed persuasion (frame mismatch, hard push)** | `bond -1` OR `corruption +1` (player choice of pressure: respectful = bond hit; coercive = corruption hit) | `apprenticeMechronisAuditLog` |
| **Successful persuasion toward Architect-preferred read on high-architectInfluence apprentice** | `architectInfluence +1` silently | `apprenticeMechronisAuditLog` (existing schema) |
| **Failed persuasion on romanced apprentice** | `apprenticeRomanceArc` stage strain — does NOT regress stage, but flags `tension` on the arc | existing `apprenticeRomanceArc` table |

Elara and the Human use the existing in-memory companion state (no DB writes); only the Apprentice's persuasion outcomes touch persistence — because the apprentice is a PERSISTENT character with consequences across the 28-day trial.

### Hub votes as breaking-point candidates (NEW trigger source)

Stage 3 of an apprentice's personal quest (`apprenticeIdentity.ts:71-600`) is canonically the **breaking-point**: the loyalty-crystallizing choice. **A high-stakes Hub vote can BE the breaking-point** for the active apprentice if their archetype matches a designated candidate vote AND their personal quest is in stage 2.

| Archetype | Breaking-point candidate Hub vote |
|---|---|
| Zealot | **Advocate vote** (knowing-complicity Hellbox = doctrine test) |
| Ghost | **Eyes vote** (Eyes is canonically the Ghost's mirror; voting on her IS the breaking-point) |
| Scholar | **Inventor vote** (publish or suppress = knowledge-ethics) |
| Revenant | **Painter vote** (resurrect whom = the Revenant has been resurrected) |
| Artisan | **Engineer Ep 6** (Direct Assault = the Artisan's craft-elder) |
| Oracle (archetype) | **Oracle Ep 5** (player retroactively recognizes Prisoner) |
| Wanderer | **Terminus Swarm vote** (who do you tell = the Wanderer wants to leave) |
| Martyr | **Iron Lion vote** (silence as broadcast = the Martyr's preferred sacrament) |
| Heretic | **Oracle Ep 6** (Public Debate = the Heretic LOVES this) |
| Jester | **Inventor's own vote** (the meta = the Jester sees the bit) |
| Sentinel | **Prisoner vote** (the Sentinel cannot tolerate "kill in case") |
| Prodigal | **Agent Zero vote** (show the recording = the Prodigal returned, did not save him) |

If the active apprentice's archetype matches an open Hub vote AND their personal quest is in stage 2, the vote becomes their stage-3 trigger. Post-vote outcome:
- **Player-aligned with apprentice's archetype reading** → personal quest resolves **`deepened`** (existing `apprenticePersonalQuestProgress.resolution`)
- **Player overrode apprentice with persuasion or contrary vote** → resolves **`broken`** (existing betrayal escalation path)

This is a wire-up, not new content: the existing breaking-point system gets a new trigger source. Antiquarian inscription lock: *"This vote was [Archetype]'s becoming. The Potentials never knew; the apprentice did."*

### Memory Card carryover at the Hub

Per `apprenticeMemoryInheritance.ts`: a fallen apprentice's Memory Card preserves bond/corruption/doctrineId/cause. **Extend the existing memory-card payload** with `lastHubVoteOpinion?: { voteId: string; archetypeReading: string }`. When a new apprentice consumes the card, the Hub-page advisor surface on the NEXT vote opens with: *"Iren-the-Scholar voted ❤️ on the Engineer's last day. Her card sits in your pocket. The new apprentice — a Zealot — has read it. They have a different reading."*

### Authoring volume — full 12-archetype distinctness (per user lock)

Every vote has **all 12 archetypes individually voiced** — no family templating shortcuts. Each archetype writes its own advice and reaction line for every Hub vote.

Per vote: 12 advice lines + 12 reaction lines = 24 archetype-distinct lines. Plus per-vote canonical-winner specific reactions (already optional via `reactionByOption`). Plus persuasion variants (kept at family-level templating to keep persuasion authoring manageable — 4 families × 2 outcomes × 37 votes ≈ 296 persuasion lines).

| Surface | Votes | Elara | Human | Apprentice (12 archetypes × 2 lines) | Total |
|---|---:|---:|---:|---:|---:|
| Engineer recordings | 7 | 14 | 14 | 168 | 196 |
| Oracle visions | 6 | 12 | 12 | 144 | 168 |
| **9 universal video votes** | 9 | 18 | 18 | 216 | 252 |
| Annual headline votes | ~10 | 20 | 20 | 240 | 280 |
| Daily resource votes | ~5 | 10 | 10 | 120 | 140 |
| Persuasion variants (family-level: 4 × 2 × ~37) | — | — | — | ~296 | ~296 |
| **Total** | **~37** | **~74** | **~74** | **~1,184** | **~1,332 lines** |

Apprentice authoring is the largest single content load in the plan. Mitigation: PR 12 stages by archetype-set — ship 4 archetypes' full coverage first (Zealot · Ghost · Scholar · Revenant ≈ 296 lines), then PR 12a adds the next 4 (Artisan · Oracle · Wanderer · Martyr), then PR 12b adds the final 4 (Heretic · Jester · Sentinel · Prodigal). Existing `apprenticeBanter.ts` (~72 banter pairs) and `apprenticeVoiceLines.ts` (720 lines) prove the volume bar is achievable per-archetype; the Hub work extends the established authoring pattern.

**Distinctness invariant:** for each vote, no two archetypes share advice OR reaction copy. Ship:check parity test enforces uniqueness.

### Module shape — bridge to existing apprentice system

```ts
export interface VoteAdvisorEntry {
  voteId: string;
  elara: { advice: string; reaction: string; reactionByOption?: Record<string, string>; };
  human?: { advice: string; reaction: string; reactionByOption?: Record<string, string>; };
  apprentice?: {
    byArchetype: Record<ApprenticeArchetype, { advice: string; reaction: string }>;  // all 12 keys required
    breakingPointArchetype?: ApprenticeArchetype;  // if this vote is a breaking-point candidate; the matching archetype's `reaction` doubles as the stage-3 resolution line
    persuasionDeltas: {
      success: { bond: number };                                       // typically +1
      failureRespectful: { bond: number };                              // typically -1
      failureCoercive: { corruption: number };                          // typically +1
      successOnHighArchitectInfluence?: { architectInfluence: number }; // +1, silent
    };
    persuasionByFamily?: {                                              // family-level, optional, defaults to generic templates
      zealous_devoted?:     { success: string; failure: string };
      watchful_internal?:   { success: string; failure: string };
      restless_questioning?:{ success: string; failure: string };
      visionary_crafty?:    { success: string; failure: string };
    };
  };
}
```

`ApprenticeArchetype` and the family mapping (for persuasion templates only) live in the existing `apprentices.ts`. The Hub bridge reads from `apprenticeCohort.active` to determine which archetype's line to render at runtime.

### UI surface (Hub vote page, single locus)

Per user requirement *"all this should happen from the governance hub"*:

1. **Antiquarian past-result inscription** (canon-locked, top).
2. **Inventor meme-frame sticky note** (Part 4.5, post-`inventor_introduced`).
3. **Open vote options** + AI voter simulation (existing).
4. **Three advisor chairs:**
   - Elara (always).
   - Human (post-Reveal).
   - **Active Apprentice** — rendered with their current portrait, archetype label, and bond/corruption visual cues (existing apprentice UI primitives). Empty chairs render: *"The apprentice cohort is currently in transition between cycles."* (when between active rotations).
5. **Persuasion controls** — three argument-frame buttons. Failed persuasion on the Apprentice surfaces a sub-choice: "Respectful (-1 bond)" vs "Push hard (+1 corruption)" so the player chooses what they spend.
6. **Vote close → reaction chain** appends below the past-result inscription. The active apprentice's reaction uses their archetype's voice register; if the vote was their breaking-point trigger, the personal-quest resolution renders in-line ("Their quest has resolved: deepened" / "broken").

### Hard parity tests (ship:check)

- `companionVoteAdvisorCoverage` — every `GovernanceVote.id` has Elara's two lines.
- `apprenticeArchetypeFullCoverage` — every vote has all 12 archetypes' distinct advice + reaction lines (one entry per archetype key in `byArchetype`).
- `apprenticeArchetypeAdviceUniqueness` — within a single vote, no two archetypes share advice OR reaction copy (enforces 12-voice distinctness).
- `apprenticeBreakingPointCandidateMapping` — every one of 12 archetypes has at least 1 candidate breaking-point Hub vote registered.
- `apprenticeHubDeltaWiring` — Hub persuasion outcomes emit the correct existing-delta types to `apprenticeGiftLog` / `apprenticeMechronisAuditLog` / `apprenticeRomanceArc`.
- `apprenticeMemoryCardHubInheritance` — Memory Card payload includes `lastHubVoteOpinion` field when the apprentice cast any Hub vote during their tenure.
- `persuasionAttemptBudget` — runtime: max one attempt per (voteId, companionId, playerId).

---

## Part 4.5 — Meme-framing on every vote (the Inventor's "did you know?" frame)

Per the user's directive *"each transmission framed by the meme"* — once `inventor_introduced` is true (post-Inventor prelude vignette at Beat H), **every vote in the Governance Hub is framed by the Inventor's meme-show "did you know?" intro.** Pre-introduction, votes use Antiquarian framing only; post-introduction, every vote also has a meme-show opener and `—I.` signature.

**Vote shape extension:**

```ts
framingByMeme?: {
  showOpener: string;      // "did you know?" hook in Inventor's voice
  contextLine: string;     // one-sentence meme-show factual context
  signature: "—I.";        // always
};
```

**Examples (locked, voice-pattern reference for authoring the rest):**

- **Painter vote:** *"did you know? — the Painter painted the same face six times before he painted yours. each time, a different background. each background, a different ending. —I."*
- **Advocate vote:** *"did you know? — the word 'Hellbox' was patented seventeen times before someone shipped it. all seventeen filings list the same inventor. they are all spelled differently. they are all me. —I."*
- **Agent Zero vote:** *"did you know? — Agent Zero's recruitment dossier had a section labeled 'will play the recording.' someone filled it in before the recording existed. that someone was the recording. —I."*
- **Inventor's own vote:** *"did you know? — the Inventor refused to write his own framing for this vote. he says the meme-show only frames OTHER people's transmissions. someone else wrote this card. it might have been him. —I."*

**UI:** the meme frame renders as a peeled-corner sticky note pinned to the top of the vote page, in the Inventor's color palette. Click to dismiss; the frame remembers being seen per-player. **Antiquarian framing remains canonical; the meme frame is colour, not load-bearing.** Players can vote-blind to the meme; they cannot vote-blind to the Antiquarian.

**Authoring volume:** ~37 vote frames × 3 lines (opener + context + signature) = **~111 lines, Inventor-voice-locked.** Module: `apps/shared/memeFramingLibrary.ts`.

**Hard parity test (ship:check):** `memeFramingCoverage` — every `GovernanceVote.id` has a `framingByMeme` block. Pre-`inventor_introduced` UI gating handled at render time; the data must always be present.

---

## Part 5 — Eyes Music Video → Trade Empire intelligence

Separate cinematic from the main Eyes video. Per user: "tied to information found during Trade Empire."

**Unlock:** `eyes_music_video_unlocked` fires when EITHER:
- Player accumulates ≥ **200 cumulative `intelligence`** AND has read ≥ 1 `dispatch_F7_*` redaction reveal, **OR**
- `convergence_climax_reached`.

The intelligence threshold is a placeholder pending balance check — synthetic-playthrough vitest must assert no earlier than Act 3 in median play.

---

## Part 6 — Prelude breath-beat vignettes

| Video | Beat | Purpose |
|---|---|---|
| **Painter / Bob Ross / Resurrection Protocols** | Beat A.5 (Corridor First Steps, wordless) | Sterile-rooms-need-color metaphor; introduces Resurrection Protocols before Engineer Ep 6 (Vex transference) and Act 4. Sets `resurrection_protocols_introduced`. |
| **Inventor / Baron Trump / Heart of Time** | Beat H (Locke's first Inbox message) | Introduces meme-show "did you know?" register, time-travel as canon, `—I.` signature. Recontextualises every prior Watcher beat. |
| **Advocate / Blood and Shadows** | Beat F.5 (Empty Chair, 90-second breath) | Voice-over: the canonical ballad **"The Ninth"** (4 quatrains, locked text per Part 0). Introduces Empire of Shadows, Hierarchy of the Damned, the Severance, the Master of R'lyeh (eldritch outsider — NOT a Hierarchy lord), and the Blood Weave as the *poisoned gift* the player's `bloodWeaveAlignment` track unknowingly inherits. Sets `advocate_introduced` + `blood_weave_introduced` + `empire_of_shadows_introduced` + `hierarchy_of_the_damned_introduced` + `master_of_rlyeh_introduced` + `the_ninth_canon_locked`. The hidden setup: **the Hierarchy was waiting for the Blood Weave to be spoken — her bargain freed them.** |

All three single-placement, no cuts. Same `SingleVideoCutsceneOverlay` primitive.

---

## Part 7 — Class-specific content layer

### 7.1 Companion comments (`cc_<class>_*` reactive lines)

- **`cc_soldier_*`** — currently 0. Add ~5 Elara + Human reactive lines for: Iron Lion broadcast, Vanguard rank-3, Sentinel rank-3, Iron Lion Last Stand at CADES M7.
- **`cc_engineer_*`** — currently 0. Add ~5 reactive lines + 2 lines per Engineer episode (6 episodes × 2 = 12 episode-reactive lines).

### 7.2 Per-class room reactions

Extend `roomMysteries/<room>.ts` shape:
```ts
classReactions?: {
  spy?: string; oracle?: string; assassin?: string; soldier?: string; engineer?: string;
};
```
Renders alongside `humanReaction` when class mastery ≥ Adept. **Symmetry rule:** all 5 classes have a string OR all 5 are absent (no lopsided coverage).

Wire 10 highest-traffic rooms first: `cargo_hold`, `cipher_den`, `shadow_vault`, `order_tribunal`, `antiquarians_library`, `mechanus_atelier`, `engineering_core`, `oracle_sanctum`, `comms_array`, `synthesis_chamber`.

### 7.3 Per-class first-meet whisper sets

Class-aligned whispers fire BEFORE the corresponding character cinematic:
- **Soldier** at Iron Lion broadcast → *"…callsign recognized. soldier-7. respond.…"*
- **Spy** at Locke first-meet → *"…transaction pattern matches yours. that is not a coincidence.…"*
- **Assassin** at Agent Zero contact → *"…seven-omicron acknowledged. mark assigned.…"*
- **Engineer** at bench recognition → *"…bench remembers your hands. it should not.…"*
- **Oracle** at Prisoner first sight → *"…the spread already showed you this face.…"*

Implement by extending `humanWhispers.ts` (PR #601) with `classGate?: CharacterClass` field. Key on `playerProfile.activeClassMastery`, NOT on prelude role choice (Detective-prelude players otherwise get nothing).

---

## Part 8 — Infrastructure

### 8.1 New: `apps/shared/storyVignetteRegistry.ts`

Single registry for all single-placement vignettes:

```ts
export interface StoryVignette {
  id: string;
  videoRelPath: string;
  triggerFlag: string;
  seenFlag: string;
  setsFlags?: ReadonlyArray<string>;
  primaryLabel: string;
  secondaryLabel: string;
  frameLine?: string;
  placement:
    | { kind: "prelude"; beatId: PreludeBeatId }
    | { kind: "act_opener"; actId: 1|2|3|4|5|6|7 }
    | { kind: "engineer_recording"; recordingFlag: string }
    | { kind: "oracle_vision"; visionFlag: string }
    | { kind: "cades_mission"; missionFlag: "cades_m1_complete"|...|"cades_m7_complete" }
    | { kind: "narrative_flag"; flag: string }
    | { kind: "trade_empire"; threshold: { resource: "intelligence"; min: number } };
}
```

Watcher hook `useStoryVignetteTriggers.ts` maps placement-kind → flag-watcher. Component `StoryVignetteOverlay.tsx` renders pending vignettes via existing `SingleVideoCutsceneOverlay`.

### 8.2 New: `apps/shared/oracleGovernanceVotes.ts`

Mirrors `engineerGovernanceVotes.ts` shape. 6 vote definitions per Part 2. Re-export from `governance.ts`.

### 8.3 New: `apps/shared/companionVoteAdvisors.ts`

Module shape per Part 4 (three-stack). Required: `voteId`, `elara.{advice, reaction}`. Optional: `human.{advice, reaction}` (gated on `human_life_reveal_seen`), `apprentice.{adviceByConviction, reactionByConviction, refusedReaction}` (gated on `apprentice_introduced`). All optional fields, if present, must be complete.

### 8.3a New: `apps/shared/apprenticeHubAdvisor.ts` (bridge to existing apprentice system)

**No new character module.** This is a thin bridge that reads from the existing apprentice system (`apprentices.ts`, `apprenticeCohort.ts`, `apprenticeIdentity.ts`, the 11 DB tables) and surfaces it as a Hub advisor:

- `ARCHETYPE_FAMILY` map: 12 archetypes → 4 voice families (`zealous_devoted` | `watchful_internal` | `restless_questioning` | `visionary_crafty`).
- `getActiveApprenticeForHub(state)` → reads `apprenticeCohort.active`; returns archetype, bond, corruption, architectInfluence, doctrine, romance-flag, current personal-quest stage.
- `selectApprenticeAdvice(advisorEntry, activeApprentice)` → picks family-template advice; overrides with archetype-specific line if this vote is the archetype's breaking-point candidate.
- `applyHubPersuasionDelta(activeApprentice, outcome)` → routes to the EXISTING delta system (writes to `apprenticeGiftLog` for bond, `apprenticeMechronisAuditLog` for corruption / architectInfluence, `apprenticeRomanceArc` for romance tension). No new tables.
- `maybeTriggerBreakingPoint(vote, activeApprentice)` → if archetype matches `breakingPointArchetype` AND personal quest is in stage 2, advances the quest to stage 3 with `deepened` or `broken` per player's vote/persuasion alignment.

### 8.3b New: `apps/shared/votePersuasion.ts`

Pure persuasion logic, shared across all three companions:
- `ArgumentFrame = "head" | "gut" | "heart"`.
- `attemptPersuasion({ companion, frame, companionResistance, playerArgumentRoll })` → `{ success: boolean }`.
- Frame-match table: head→Elara, gut→Human, heart→Apprentice (match = -2 resistance modifier; mismatch = +1).
- Per-vote attempt budget enforced by `persuasionAttemptsByVote: Record<voteId, ReadonlyArray<companionId>>`.
- Calls into `apprenticeHubAdvisor.applyHubPersuasionDelta` for Apprentice outcomes (Elara/Human are stateless).

### 8.3c New: `apps/shared/memeFramingLibrary.ts`

Per-vote `framingByMeme` payloads (~111 lines per Part 4.5). Re-exported from `governance.ts`. Voice-pattern locked: opener always lowercase "did you know?", context one sentence, signature always `—I.`

### 8.4 New: framing-device presenters

One React component per `framingDevice.kind`:
- `NewsBroadcastFramedCutscene.tsx` (Programmer broadcast frame)
- `TransmissionInterruptCutscene.tsx` (comms-channel hijack frame)
- `MemeDialogCutscene.tsx` (in-Inbox meme-show frame)
- `HoloRecordingCutscene.tsx` (Bench hologram playback frame)
- `PostMissionDebriefCutscene.tsx` (CADES briefing room frame)
- `RedactionCascadeCutscene.tsx` (Inbox decryption frame)
- `TDPostWaveCutscene.tsx` (Tower Defense wave-clear frame)
- `TIDossierCompileCutscene.tsx` (Trade Empire dossier-reveal frame)
- `OracleSpreadCutscene.tsx` (vision spread frame)
- `LastWordsSlideshowCutscene.tsx` (Engineer-Bench / Prisoner-cell wake frame; input-locked audio + cross-faded stills + Antiquarian outro card)

Each component wraps `SingleVideoCutsceneOverlay` with the diegetic chrome of its host surface. `StoryVignetteOverlay` dispatches to the correct presenter based on `framingDevice.kind`. `LastWordsSlideshowCutscene` is the one presenter that does NOT wrap a video — it composes audio + ordered stills + outro card.

### 8.5 Producer asset ingest script

`apps/scripts/ingest-producer-cinematics.ts`:
- Accepts JSON manifest: `{ sourceFile: "Videos/Terminus Swarm.mp4", destSlug: "videos/character_intros/terminus_swarm.mp4" }`.
- No cutting (each video is indivisible).
- ETag-compare idempotent transfer (mirrors `apps/scripts/upload-public-to-s3.ts`).
- ffprobe extracts duration → suggested `durationSec`.

### 8.6 Ship:check parity additions

Add to `apps/shared/_completeness/registry.ts`:

1. **`storyVignettePlacementCoverage`** — every `placement` resolves to a real beat / flag / mission.
2. **`storyVignetteAssetReachable`** — every `videoRelPath` HEAD-resolves on S3 in CI.
3. **`oracleGovernanceVoteParity`** — every Oracle vote has paired Engineer vote of same structural index.
4. **`cadesCharacterVideoCoverage`** — `cades_m6_complete` has Agent Zero registered; `cades_m7_complete` has Iron Lion.
5. **`terminusSwarmVideoCoverage`** — `terminus_swarm_wave_10_first_complete` has Terminus Swarm video registered.
6. **`classRoomReactionSymmetry`** — for any room with `classReactions`, all 5 classes present OR all 5 absent.
7. **`classWhisperFirstMeetCoverage`** — every class character video has paired class-aligned first-meet whisper.
8. **`engineerEpisodeRecordingMapping`** — 6 producer Engineer episodes map 1:1 to 6 of 7 `engineerGovernanceVotes` recording flags; the unused recording is explicitly flagged "audio-only Ep 7".
9. **`videoPacingDistribution`** — no act has more than 4 producer videos registered.
10. **`storyVignetteFramingDeviceCoverage`** — every `StoryVignette` has a `framingDevice` field; no raw modal pops.
11. **`companionVoteAdvisorCoverage`** — every `GovernanceVote.id` has paired `VOTE_ADVISORS` entry with Elara's advice + reaction. Human's fields optional but, if present, both required.
12. **`advocateBloodWeaveOriginCanon`** — `master_of_rlyeh` is absent from `HierarchyLordId` union; `ithrael_whisperer` is present in `HIERARCHY_LORDS`; `master_of_rlyeh` exists in the NEW `apps/shared/eldritchOutsiders.ts` registry as canonical Blood Weave patron; Advocate vignette sets all six locked flags listed in Part 0.
13. **`universalVideoVoteCoverage`** — every producer cinematic has a paired `GovernanceVote`. 9 universal votes + 12 Engineer/Oracle = 21 producer-canon votes minimum.
14. **`apprenticeArchetypeFullCoverage`** — every vote has all 12 archetypes' distinct advice + reaction lines (`byArchetype` map has all 12 keys: Zealot, Ghost, Scholar, Revenant, Artisan, Oracle, Wanderer, Martyr, Heretic, Jester, Sentinel, Prodigal).
15. **`apprenticeArchetypeAdviceUniqueness`** — within a single vote, no two archetypes share advice OR reaction copy (enforces the 12-voice distinctness lock).
16. **`apprenticeBreakingPointCandidateMapping`** — every one of 12 archetypes (`apprentices.ts:27-29`) has at least 1 candidate breaking-point Hub vote registered.
17. **`apprenticeHubDeltaWiring`** — Hub persuasion outcomes emit to existing delta surfaces (`apprenticeGiftLog` / `apprenticeMechronisAuditLog` / `apprenticeRomanceArc`); no new tables introduced.
18. **`apprenticeMemoryCardHubInheritance`** — Memory Card payload includes optional `lastHubVoteOpinion` field; populated whenever the apprentice cast a Hub vote during their tenure.
19. **`memeFramingCoverage`** — every `GovernanceVote.id` has a `framingByMeme` block; opener starts `"did you know?"`; signature `"—I."`
20. **`persuasionAttemptBudget`** — runtime invariant: max one persuasion attempt per (voteId, companionId, playerId).
21. **`season1EpisodeCoverage`** — all 16 Season 1 episodes registered with Antiquarian past-result inscriptions + framing-device kind + paired Hub vote.
22. **`season1HubVoteCoverage`** — all 16 episode → vote pairings exist; canonical winners locked per Part 0 Season 1 table; Ep 16 explicitly flagged "winner deferred to Season 2."
23. **`s1Ep1HeartOfTimeCutsceneWired`** — Engage-Defensive-Protocols outcome triggers the Heart-of-Time vessel cutscene asset; Evade outcome triggers the Human voice-line + alarm subsidence path.
24. **`s1Ep1HumanLoopBreadcrumb`** — both paths set `human_loop_breadcrumb_1`; cross-path consistency invariant ensures both vote outcomes produce a Human cross-loop voice-line.
25. **`season1PacingDistribution`** — Season 1 episodes distributed across Prelude through Act 4 only; none in Act 5+. No act exceeds 8 total cinematics (Season 1 + character cinematics combined).
26. **`season1CanonBindCoverage`** — every Season 1 episode's past-result inscription names at least one of the 12 locked canon binds (Source=Kael, Engineer-built-Inception-Arks, the Architect, the Host, the Heart-of-Time vessel, the wormhole network, DeMagi, Quarchon, Ne-Yon, crystal harmonics, Templum Veritus, the 9th Neon).
27. **`gameModeStoryCoherence`** — coherence matrix `docs/narrative-audit/SAGA_GAME_MODE_COHERENCE.md` complete; every cross-mode narrative reveal has Season-1 AND Season-2 episode gates as appropriate; no game mode reveals canon ahead of its episode introduction.
28. **`season2EpisodeCoverage`** — all 14 Season 2 episodes registered with Antiquarian past-result inscriptions + framing-device kind + paired Hub vote (Ep 2.9 marker-free per consultative meta-vote).
29. **`season2HubVoteCoverage`** — 14 episode → vote pairings exist; canonical winners locked per Part 0 Season 2 table; Ep 2.1 explicitly resolves Ep 1.16 cliffhanger to "Potentials' independence (👍)".
30. **`agentZeroDeathRevealGating`** — Ep 2.11 only fires after `engineer_ep6_played` AND `cades_m7_complete` AND `agent_zero_recruit_relationship_age >= 5h` (existing relationship timer or equivalent). Runtime invariant + ship:check listing.
31. **`loopClosureLockToS1Ep1`** — Ep 2.14's nanobot-plague cinematic transition rebinds Ep 1.1's cold-open emergency-recording to the looped state; transition is consistent on replay (loop-aware Antiquarian narration variant on second playthrough).
32. **`servantHeroAcademyPivotOnboarding`** — Ep 2.14 epilogue routes to Servant Hero Academy onboarding sequence; opt-out toggle preserved; existing combat/war mechanics gracefully deprecated for opt-in players.
33. **`season2CanonBindCoverage`** — every Season 2 episode's past-result inscription names at least one of the 15 locked Season-2 canon binds (the Politician, Project Vector, the Authority, Syndicate of Death, the Baron, Wraith Calder, Hierophant Wraith, the 6 founders [Samsara/Furial/Midlothian/Null/Tenebrous/Saisei], Bayern 7, the 5 Mechronis archons, the Painter's resurrection, the Inventor's death, the Judge's death, Servant Hero Academy).
34. **`apprenticeArchonGuildDoctrineMapping`** — for any apprentice with a doctrine selected via `apprenticeDoctrineSelections`, the doctrine maps to one of the 5 Mechronis archon guilds (Watcher / Warlord / Game Master / Meme / Necromancer); Season-2-era Hub advice from that apprentice biases toward the matching archon's voice register.

Expected post-PR ship:check delta: **+34 PASS rows**.

---

## Part 9 — PR rollup

| PR | Surface |
|---|---|
| **PR 1** | `storyVignetteRegistry` + watcher + overlay + ingest script + `framingDevice` field on shape |
| **PR 2** | 10 framing-device presenter components (news_broadcast, transmission_interrupt, meme_dialog, holo_recording_playback, post_mission_debrief, redaction_cascade, td_post_wave, ti_dossier_compile, oracle_spread, **last_words_slideshow**) |
| **PR 3** | 5 character-video registry entries: Iron Lion (CADES M7), Agent Zero (CADES M6), Prisoner (Act 4), Eyes (post-`dispatch_F7_final`), **Terminus Swarm (Wave 10)**. Includes CADES Godot-bridge integration test. |
| **PR 4** | 6 Engineer-episode registry entries wired to `engineerGovernanceVotes.ts` + N-option vote shape + 🙏 marker + `storyNodeRef` field + Galactic Governance Hub UI + **Engineer Ep 7 Last Words Slideshow at the Bench (`holo_deck_remembers`)** |
| **PR 5** | `oracleGovernanceVotes.ts` (NEW module) + 6 Oracle votes + canon review sign-off + **Oracle Ep 7 Last Words Slideshow in the Prisoner's cell (`prisoner_remembers_being_the_oracle`)** + Shadow Tongue summoning canon lock + Heirophant / Thaloria / Star-Whisperer-empty-seat / Wraith-setup lore writes |
| **PR 6** | `companionVoteAdvisors.ts` (NEW module, two-stack: Elara + Human) + advisor entries for ALL existing governance votes (Engineer recordings + annual headline + daily resource) + Hub-page advisor chair UI |
| **PR 7** | Advisor entries (Elara + Human) for Oracle visions + the 9 universal video votes (depends on PR 4 + PR 5 + PR 6.5) |
| **PR 8** | Painter + Inventor + Advocate prelude vignettes (using framing-device presenters from PR 2). **Advocate vignette includes the "Ninth" ballad VO + 6 canon flags + Master-of-R'lyeh code reconciliation: remove `master_of_rlyeh` from `HierarchyLordId`, add `ithrael_whisperer` in its place, create new `apps/shared/eldritchOutsiders.ts` with canonical Master of R'lyeh as eldritch Blood Weave patron, update all callers.** Blocked on lore-bible review sign-off for the Antiquarian inscription. |
| **PR 9** | Eyes Music Video + Trade Empire intelligence threshold gate |
| **PR 10** | Class content layer: `cc_soldier_*` + `cc_engineer_*` + per-class room reactions × 10 + per-class first-meet whispers × 5 |
| **PR 6.5** | **9 universal video votes** (NEW): Painter, Inventor, Advocate, Eyes, Prisoner, Agent Zero, Iron Lion, Terminus Swarm, Eyes Music Video — all wired into the Galactic Governance Hub via the same `GovernanceVote` shape. Antiquarian past-result inscriptions canon-locked per Part 0. **Lore-bible review BLOCKING** for all 9 inscriptions. |
| **PR 11** | **Apprentice Hub bridge**: `apprenticeHubAdvisor.ts` (no new character) + 12-archetype → 4-family mapping + Hub chair UI reading from existing `apprenticeCohort.active` + portrait/bond/corruption visual cues using existing apprentice UI primitives + `lastHubVoteOpinion` field on existing `apprenticeMemoryCards` schema. |
| **PR 12** | **Apprentice 12-archetype-distinct advisor entries** for all ~37 votes — staged by archetype-set. PR 12 ships Zealot · Ghost · Scholar · Revenant (~296 lines + uniqueness invariant). PR 12a adds Artisan · Oracle · Wanderer · Martyr (~296). PR 12b adds Heretic · Jester · Sentinel · Prodigal (~296). Plus ~296 family-level persuasion-variant lines (PR 12 ships first family; 12a / 12b ship the rest). Lore-bible review on the 12 breaking-point archetype × vote pairings BLOCKING for PR 12. |
| **PR 13** | **Persuasion mechanic**: `votePersuasion.ts` + per-companion attempt budget + three argument-frame UI + success/failure dialog payloads + Apprentice delta routing into existing `apprenticeGiftLog` / `apprenticeMechronisAuditLog` / `apprenticeRomanceArc`. Includes "Respectful vs Push hard" sub-choice on Apprentice failed-persuasion. |
| **PR 14** | **Breaking-point integration**: wire Hub votes as stage-3 trigger source for `apprenticePersonalQuestProgress` per the 12-archetype candidate-vote table. `deepened` / `broken` resolution based on player-apprentice vote alignment + persuasion behavior. |
| **PR 15** | **Meme-framing layer**: `memeFramingLibrary.ts` + per-vote `framingByMeme` payloads (~159 lines — 53 votes including Season 1) + sticky-note UI on Hub vote pages + `inventor_introduced` gating. |
| **PR 16** | **Season 1 video registration + ingest** — 16 Antiquarian-narrated episodes through `storyVignetteRegistry` + 6 NEW framing-device kinds (`inception_ark_emergency_recording`, `antiquarian_library_inscription`, `source_cavern_monologue`, `templum_veritus_inscription`, `crystal_city_under_siege`, `temple_of_truth_last_stand`) + presenter components. Ep 1's old-recording aesthetic (scanlines / audio crackle / static / frame jitter) is a shared visual effect reusable for other "preserved recording" surfaces. |
| **PR 17** | **Season 1 governance votes (16 votes)** — 16 vote shapes + Antiquarian past-result inscriptions canon-locked per Part 0 Season 1 table + N-option support (Ep 7 = 5 options) + canon-binding lock for Source-=-Kael, Engineer-built-Inception-Arks, Architect-locked, time-loop premise, wormhole network, DeMagi/Quarchon/Ne-Yon. **Lore-bible review BLOCKING** for all 16 inscriptions and the 12 cross-arc canon binds. |
| **PR 18** | **Season 1 Ep 1 special handling** — old-recording aesthetic (scanlines / audio crackle / static / frame jitter as a CSS/canvas effect layer over the video player), red-alarm transition sequence, 50/50 vote UI (NOT the Hub UI — the ship-panic interface), Heart-of-Time vessel cutscene (production prompt → producer delivery → ingest), Human voice-line for both engage and evade paths, retroactive Hub-frame bind in Ep 2. The Heart-of-Time vessel cutscene asset is producer-delivered; this PR ships the wiring + the alarm-sequence client code. |
| **PR 19** | **Season 1 apprentice 12-archetype advisor entries** — 12 archetypes × 2 lines × 16 votes = ~384 lines, staged by archetype-set the same way as PR 12 / 12a / 12b (PR 19 ships first 4 archetypes, 19a next 4, 19b final 4). Plus Elara/Human entries for 16 Season 1 votes (~64 lines). Plus Inventor meme-frames for 16 Season 1 votes (~48 lines, folded into PR 15 if it ships after). |
| **PR 20** | **Part 13 — Game-mode story-coherence audit** — produce `docs/narrative-audit/SAGA_GAME_MODE_COHERENCE.md` (renamed from SEASON1) mapping every game-mode narrative beat (TCG, CADES FPS, Tower Defense / Terminus Swarm, Trade Empire, Chess, Sprite proxy) to **both** Season-1 AND Season-2 episode prerequisites or contraindications. Hard ship:check parity: `gameModeStoryCoherence`. |
| **PR 21** | **Season 2 video registration + ingest** — 14 Antiquarian-narrated episodes through `storyVignetteRegistry` + 7 NEW framing-device kinds (`heart_of_time_bridge_temporal_vote`, `new_babylon_neon_chronicle`, `matrix_of_dreams_hack`, `agent_zero_betrayal_reveal`, `time_heist_backstory_assembly`, `apocalypse_servant_hero_pivot`, plus reuse of `templum_veritus_inscription`) + presenter components. |
| **PR 22** | **Season 2 governance votes (14 votes)** — 14 vote shapes + Antiquarian past-result inscriptions canon-locked per Part 0 Season 2 table + N-option support (Eps 2.2/2.5/2.6/2.10/2.11 are 5-7-option votes) + canon-binding lock for **the Politician, Project Vector, the Authority + Six founders, Syndicate of Death, the Baron, Bayern 7, Hierophant Wraith, 5 Mechronis archons, Servant Hero Academy franchise pivot**. Lore-bible review BLOCKING for all 14 inscriptions and 15 cross-arc canon binds. **Includes Ep 1.16 cliffhanger resolution to "Potentials' independence (👍)" in Ep 2.1.** |
| **PR 23** | **Season 2 Ep 2.1 special handling** — Politician's 97th-re-election broadcast intro + theft cinematic + Heart-of-Time bridge welcome + multi-Nexus-event-anchor vote UI (vote UI variant for "which reality to save first"). |
| **PR 24** | **Season 2 Ep 2.11 special handling — the Agent Zero death reveal** — sequence gating (must-land-after-Engineer-Ep-6 + must-land-after-CADES-M7 + must-have-≥5h-with-M6-recruit) + Bayern-7-as-Agent-Zero reveal cinematic + yellow-jacket motif lock + retroactive flag wiring (Engineer Ep 5's "dispatched" line now reads as euphemism) + companion advisor reactions (Elara senatorial outrage; Human noir kind-paragraphs callback; active Apprentice archetype-specific emotional reaction — the saga's highest-payoff Hub moment). |
| **PR 25** | **Season 2 Ep 2.14 special handling — catastrophic War vote + Servant Hero Academy pivot** — War/Peace/Time/Sacrifice vote UI + nanobot-plague cinematic + Fall-of-Reality loop-close transition (re-bind Ep 1.1's cold-open recording as "what comes next is what just was") + Servant Hero Academy onboarding sequence (Orlando Lions International Convention surface) + opt-out toggle for endgame-mode players ("continue in the Age of War"). |
| **PR 26** | **Season 2 apprentice 12-archetype advisor entries** — 12 archetypes × 2 lines × 14 votes = ~336 lines, staged by archetype-set like PR 12 / 19. Plus Elara/Human entries for 14 Season 2 votes (~56 lines). Plus Inventor meme-frames for 14 Season 2 votes (~42 lines, folded into PR 15 if it ships after). **Ep 2.11 apprentice reaction is the saga's most-authored single moment** — 12 distinct archetype reactions to learning the Warlord was Agent Zero. |
| **PR 27** | **Season 2 side content** — Last Christmas (Christmas Degen Event integration), Welcome to Celebration (player-onboarding sequence), Mechronis Academy (5-archon guild hub, ties to Apprentice doctrine system), Necromancer's Lair (Akai Shi questline), Syndicate of Death (Wraith Calder questline). Each is an independent surface; ships in parallel with main Season-2 PRs once dependencies clear. |

**Sequencing constraints:**
- PR 1 (registry + framing field) before everything else.
- PR 2 (framing-device presenters) before any video-registration PR (PR 3, 8).
- PR 3 (videos) before PR 10 (class whispers reference video trigger flags).
- PR 4 + PR 5 + PR 6.5 (Engineer / Oracle / 9 universal vote shapes) before PR 7 + PR 12 (their advisor entries).
- PR 6 (existing-vote advisor entries) is independent and can land early.
- **PR 8's Master-of-R'lyeh code reconciliation has no PR dependencies but is BLOCKING for the Advocate vignette in the same PR; do it as the first commit on the branch so test failures surface immediately, then add the vignette + Loredex callback on top.**
- **PR 11 (Apprentice Hub bridge — reads from existing `apprenticeCohort`) is independent and can land early.** Subsequent advisor / persuasion / breaking-point PRs all depend on it.
- **PR 12 (family-template advisor lines) before PR 13 (persuasion mechanic uses the dialog payloads) before PR 14 (breaking-point uses persuasion outcomes).**
- **PR 15 (meme-framing) is independent of advisor work but depends on PR 8 (Inventor vignette ships → `inventor_introduced` fires → framing surfaces). Land PR 15 after PR 8.**
- **PR 6.5 (9 universal video votes) is a hard prerequisite for the user's "vote on every video" requirement. Must land BEFORE the producer drop's marketing day.**
- **The existing apprentice system is mid-migration:** `apprenticeStore.ts:9-11` notes "Not yet wired as primary source — components currently still read from GameContext." PR 11 reads from whichever surface is canonical at the time of authoring; coordinate with the store-migration owner so Hub advisor doesn't ship pointing at a deprecated read path.
- **Season 1 sequencing:** PR 16 (videos + framing-device kinds) → PR 17 (governance votes + lore-bible canon binds) → PR 18 (Ep 1 special) → PR 19 (12-archetype advisor entries for the 16 Season 1 votes). PR 16-18 are blocking for the Season 1 backbone surfacing in-game; PR 19 adds the advisor layer on top and can stage incrementally.
- **PR 20 (game-mode coherence audit) is the last PR in the rollup** — it depends on every prior surface being in place. Treat as a post-content audit pass, not a feature PR.

---

## Part 10 — Risks (live)

1. **Oracle vote past-result canon must be lore-bible-locked before shipping.** Each Antiquarian inscription becomes canon. PR 4 includes lore-bible review as blocking step.
2. **Engineer producer drop = 6 episodes vs. system's 7 recording slots.** The 7th (`holo_deck_remembers`) is explicitly audio-only. Document so it doesn't disappear silently.
3. **N-option vote shape is a breaking change to `engineerGovernanceVotes.ts`.** Existing 2-option binary votes must migrate. Add migration helper that wraps existing binary as `[option1, option2]` array.
4. **5th marker (🙏) introduced by Oracle Ep 6.** Existing marker-rendering code must not assume 4-marker enum.
5. **Trade Empire intelligence threshold (200) is a placeholder.** Synthetic-playthrough vitest required.
6. **Painter / Inventor / Advocate at prelude breath beats may feel front-loaded** (3 videos in ~30 minutes). Cross-check pacing in playtest; if too dense, push Inventor's Beat-H placement to Act 1 cycle B opener.
7. **Class content gates on `playerProfile.activeClassMastery`.** Players who never engage with class XP see baseline only — acceptable, document.
8. **`classWhisperFirstMeetCoverage` parity depends on PR 2 sequencing.** Document order.
9. **Cross-character payoff (Engineer killed Vortex = Human's childhood friend) needs surfacing.** Without an explicit Antiquarian callback, players won't connect the dots. Add a post-Reveal narrator beat that names Vernon Vortex as the Engineer's last act.
10. **Vex Solène / Black Market Intel Dealer first-meet is DEFERRED** by Engineer Ep 5 canon. Must surface elsewhere or remain a known unfilled canon slot.
11. **Advisor authoring volume (~112 lines)** must hit two distinct voice registers consistently. Risk: dilute Elara/Human voices by writing too generic. Mitigation: PR 6 lore-bible review for first 5 entries per advisor before authoring the rest; lock voice patterns early.
12. **Cross-advisor reactivity** (Elara reacts to Human's advice, Human reacts to Elara's) is the highest-quality bar but doubles authoring volume. Acceptable to ship single-advisor first, add cross-reactivity in a follow-up PR.
13. **Framing-device presenters are 10 new React components** with diegetic chrome each. Risk: visual debt if rushed. Mitigation: PR 2 ships ONE reference presenter (news_broadcast for Painter) end-to-end; remaining 9 follow same template.
14. **Post-Reveal advisor gating must not break pre-Reveal play.** If a vote is open BEFORE the player has triggered `human_life_reveal_seen`, the Human button must not appear. After the Reveal lands mid-vote, the Human button must appear on the existing vote page without forcing a re-render hack. Watcher hook required.
15. **Master of R'lyeh reclassification is a breaking change to `HierarchyLordId`.** Existing test files (`hierarchyOfTheDamned.test.ts`, `dlc/chapters/hierarchy/hierarchy.test.ts`) and any encounter / faction-crosswalk callers will fail compile. Mitigation: PR 8 runs full `pnpm check` + `pnpm test` after the reclassification; engineer audits every call site before opening the PR. Identifier rename (`master_of_rlyeh` → `ithrael_whisperer`) is grep-mechanical.
16. **The "Ninth" ballad voice-over runs ~30-45 seconds** — Beat F.5 is a 90-second breath, so timing fits, but the four-quatrain reveal must NOT be cut for pacing. Each quatrain seeds one downstream canon (Q1=Empire of Shadows, Q2=Hierarchy, Q3=Master of R'lyeh bargain, Q4=hollow-queen present-tense). Cutting any quatrain breaks the seeding.
17. **Player won't connect the Advocate's Blood Weave to their own `bloodWeaveAlignment` track without an explicit callback.** Mitigation: add a Loredex entry that fires on `blood_weave:braiding` band crossing AFTER `advocate_introduced` is set, naming the Advocate as the original weaver. Lands in PR 8 alongside the canon lock.
18. **Apprentice 12-archetype-distinct authoring volume (~1,184 lines) is by far the largest content load in the plan.** User locked full distinctness over family templating; mitigation is staged delivery — PR 12 ships 4 archetypes (Zealot · Ghost · Scholar · Revenant ≈ 296 lines), PR 12a ships next 4, PR 12b ships final 4. Each PR is a complete playable surface for any player whose active apprentice falls in that PR's archetype set. Existing `apprenticeVoiceLines.ts` (720 baseline VO lines per the production bible) proves per-archetype voice authoring is established practice.
19. **12-archetype uniqueness invariant.** The `apprenticeArchetypeAdviceUniqueness` ship:check enforces no duplicate copy across archetypes within a vote. Risk: authors may write near-duplicates that pass the literal-string check but feel samey in playtest. Mitigation: lore-bible review on the first 4 archetypes' first 5 votes establishes the distinctness bar; subsequent authoring is held to the same bar.
20. **Persuasion mechanic could feel game-y if surfaced as a min-max system.** Mitigation: hide the dice-roll math from the UI; surface only "you tried the heart frame" / "they were moved" / "they were not." Numbers stay engine-side; the visible state is bond/corruption (already familiar to players from the existing apprentice UI).
21. **The Apprentice's emotional reactions use existing apprentice portrait/VO infrastructure** — no new art pipeline required. PR 11 reads existing emotion frames from `apprenticeVoiceLines.ts` event-bucket VO and existing portrait sets per archetype × gender.
22. **Meme-framing on EVERY vote risks tonal flattening** — the Inventor's voice could overwhelm the Antiquarian's at high vote-count. Mitigation: the meme frame is dismissable per-player and the dismissal is sticky; players who prefer the Antiquarian-only register can opt out and the system honors it.
23. **The 9 universal video votes mean ~21 producer-canon votes total — players who only vote occasionally may not see most of them.** Votes are ALWAYS retrievable in the Hub past-result archive even if the player missed the open-vote window. The Antiquarian's inscription remains the primary surface; the open vote is the bonus.
24. **Vote-on-Inventor for HIS OWN video is a meta moment that could break the fourth wall awkwardly.** Locked framing ("the Inventor refused to write his own framing for this vote") leans INTO the bit; if playtest hates it, fallback is a standard Antiquarian-only meme frame.
25. **Apprentice permadeath mid-vote.** The active apprentice may DIE during the 28-day trial while a Hub vote is open. Per `apprenticePermadeath.ts`, death is final and immediate. Handling: if a Hub vote is open at the moment of permadeath, the apprentice's last opinion is preserved on their Memory Card (`lastHubVoteOpinion` field) and the chair sits empty until a training apprentice promotes per existing rotation. Antiquarian inscription handles gracefully: *"The [archetype] cast their vote in the morning. The Memory Card carries it forward. The chair is empty until the next promotion."*
26. **Breaking-point Hub votes assume the active apprentice's personal quest is in stage 2 at the right moment.** Cohort timing (28-day trial) and act-gated Hub votes may not align in average play; PR 14 must include a fallback: if the archetype matches but quest stage is wrong, the vote contributes to the existing breaking-point progression without triggering the dramatic stage-3 resolution. The vote still has narrative weight; it just isn't THE pivot.
27. **Mid-migration apprenticeStore (`apprenticeStore.ts:9-11`).** PR 11 reads from whichever surface is canonical at authoring time (currently GameContext); coordinate with store-migration owner. Risk: Hub advisor ships pointing at a deprecating read path. Mitigation: PR 11 uses the store's documented public API only, not internal GameContext access patterns.
28. **High architectInfluence apprentice as silent Manchurian advisor.** This is intentional dramatic load — the player may genuinely not know which advice is corrupted. Risk: confused players believe a bug. Mitigation: a post-vote Antiquarian inscription on votes won by Architect-aligned readings retroactively raises suspicion ("Iren's counsel that day, in hindsight, sounded familiar...") so the player has the breadcrumb without the system being legible upfront.
29. **Season 1 canon binds (12 keystone facts) must clear lore-bible review before PR 17 ships.** Especially **Source = Kael** (cross-checks with LORE_BIBLE:3043-3066 and existing `kaelFragmentWatchers.ts` system), **Inception Arks built by the Engineer** (LORE_BIBLE:6686), and **the Heart-of-Time vessel** as distinct from the Heart-of-Time artifact (LORE_BIBLE:10204). Mitigation: PR 17 includes an explicit canon-binding-doc that the lore-bible owner signs off on before merge.
30. **The 9th Neon is user-supplied new canon with no existing lore-bible dossier.** Risk: introducing a class ("Neon" as an elemental wielder within DeMagi) implies a class taxonomy that may collide with other existing class systems. Mitigation: PR 17 ships a minimal 9th-Neon dossier as a new LORE_BIBLE entry; the Neon class taxonomy is scoped to Season 1 narrative use only (not a playable class).
31. **Season 1 first-half-finale (Ep 16) leaves a vote open across an act transition.** The Side-Choice vote (Architect / Hierarchy / Source / Potentials' independence) has NO canonical winner until Season 2 ships. Risk: players who finish Act 4 before Season 2 lands see an open vote that never resolves. Mitigation: PR 17 ships Ep 16 with a "resolution pending — chronicle awaits Season 2" Antiquarian holding-message; the vote is open but visibly cliffhanger.
32. **Time-loop premise is a saga-wide retroactive lock.** Once the Human's "didn't happen last time" line lands in Ep 1, the entire saga's past-tense narration is canonically reframed as cross-loop chronicle. Risk: existing canon (Engineer's death, Oracle's harvest, the Advocate's bargain) reads as "previous-loop outcomes that may be alterable" — players may expect to be able to PREVENT the Engineer's death, etc. Mitigation: the time-loop is established as IMPERFECTLY alterable. The Inventor's Heart-of-Time can divergently nudge specific outcomes (the Ep 1 satellite is the proof) but the macro-canon (Engineer's death, etc.) is loop-stable. The Antiquarian's Season 1 chronicle establishes WHICH events are stable vs divergent; player-actionable divergence is restricted to specific Hub votes flagged as "loop-pliable" via existing `triggeredByVote` mechanism.
33. **Ep 1's pre-Hub diegetic vote UI is a one-off surface.** The "ship panic interface" is unique to Ep 1; subsequent Season 1 votes use the Hub UI. Risk: players may not recognize that the Ep 1 vote IS a Hub-system vote (since the Hub frame is established retroactively in Ep 2). Mitigation: Ep 2's opening Antiquarian narration explicitly names the Ep 1 vote as the first entry in her ledger — *"The first decision of the Potentials, recorded in the column above all others."*
34. **Game-mode coherence audit (PR 20) may surface narrative misalignments requiring rework.** E.g., TCG cards may reveal Architect / Collector / Source canon ahead of Season 1's intended reveal beats. Risk: audit finds 5+ misalignments requiring card-text rewrites or unlock-gate moves. Mitigation: scope PR 20 to AUDIT only — produce the matrix + list misalignments. Subsequent PRs handle individual fixes per-mode.
35. **Season 2 canon binds (15 keystone facts) must clear lore-bible review before PR 22 ships.** Especially **Agent Zero died on Veridian Prime** (cross-checks with CADES M6/M7 placement and Engineer Ep 5 dispatch-line), **the Heart of Time as a time-machine vessel built by the Architect** (reconciles with LORE_BIBLE:10204 artifact canon), and **the Politician = Department of Government Efficiency origin**. PR 22 includes an explicit canon-binding-doc that the lore-bible owner signs off on before merge.
36. **Ep 2.11's Agent Zero reveal must not pre-leak via Trade Empire intel or TCG card flavor.** The reveal is intentionally late-game. PR 20's coherence audit flags any cross-mode pre-reveal as BLOCKING for fix.
37. **Engineer death circumstances remain unspecified per user lock.** Risk: writers / lore-bible reviewers add explicit Engineer-death detail in Season 2 inscriptions. Mitigation: PR 22's lore-bible review BLOCK includes a hard constraint that no Season 2 inscription specifies how the Engineer died, only that he was killed on Zenon by the Vortex. Engineer Ep 5's "dispatched" line is the canonical pre-reveal; Ep 2.11 retroactively makes "dispatched" mean what it meant for Agent Zero (already dead), but the Engineer's exact circumstances stay enigmatic.
38. **Loop-closure (Ep 2.14 → Ep 1.1) must work on first playthrough AND on replay.** The Antiquarian's Ep 1.1 emergency-recording variants need a "first loop" version and a "post-loop-closure" version. Risk: players who replay see canonical inconsistency. Mitigation: PR 25 ships TWO Ep 1.1 variants — first-playthrough (canonical Ep 1.1 monologue) and post-Ep-2.14-completion (loop-aware Antiquarian addition: *"You have read this recording before. So have I. Let us see if this time it is different."*).
39. **Servant Hero Academy genre pivot is a hard break from war-narrative mechanics.** Some players may bounce. Mitigation: opt-out toggle ("continue in the Age of War as endgame mode") preserved. PR 25 specifies the toggle UI clearly.
40. **Season 2 cinematic density.** Act 5 hits 8 cinematics (at-ceiling); Act 7 hits 5 plus the Servant Hero Academy onboarding sequence. Risk: cinematic fatigue in Act 7. Mitigation: Eps 2.12 and 2.13 can be compressed or marked optional ("the Antiquarian's footnote episodes — skippable for endgame-rush players") with the canonical winners auto-resolved on skip.
41. **The Baron as a Trump-name-adjacent character is intentional canon (Baron Trump 19th-century books reference).** Risk: real-world political-name overlap may read as commentary. Mitigation: PR 22's lore-bible review confirms the producer's intent and notes that the Baron is canonically the son of *"the King of Earth"* (Earth's kings-becoming-gods lineage) — a self-contained fictional lineage in-saga, not a real-world political reference.
42. **The 5 Mechronis archons cross-link with the 12 Apprentice archetypes** is a NEW canon binding. Risk: existing `apprenticeDoctrineSelections` table may not currently map 1:1 to archon guilds. Mitigation: PR 22 includes a doctrine-archon-mapping migration script; if existing doctrines don't have an archon guild, default to the player's chosen archon-guild path from the Mechronis Academy side content.
43. **Season 2 side content (5 arcs) is a parallel-shipping load.** Risk: parallel-PR conflicts or staffing constraints. Mitigation: PR 27 is intentionally sized as a 24h envelope that can be split into 5 sub-PRs (27a-27e) per arc, each independent.
44. **Ep 2.14's nanobot plague is the canonical Fall of Reality.** This makes the entire saga's Genesis-era (1 A.A. / 2030 AD per LORE_BIBLE:189-206) the BEFORE state, and the Discordian Saga's primary timeline the AFTER state. Risk: lore-bible may have other canonical Fall-of-Reality causes already documented. Mitigation: PR 22 lore-bible review reconciles Project Vector (Ep 2.12 canon) + the Architect's orchestration + the Potentials' War-Choice as the THREE concurrent causes of the Fall — not in conflict, but in layered causation.
45. **Apprentice doctrine bias toward archon guilds in Season 2 advice** could feel inconsistent with earlier seasons' archetype-only voice. Mitigation: doctrine-archon bias only adds a FLAVOR layer on top of existing archetype-distinct lines; does not replace them. The 12 archetypes' voice patterns remain primary; the archon flavor is secondary salt.

---

## Part 11 — Critical files (reference only — no edits in this plan)

**Class system:** `apps/shared/classMastery.ts`, `apps/shared/questlineClass{Soldier|Oracle|Spy|Engineer|Assassin}.ts`.

**Governance:** `apps/shared/governance.ts:1-470`, `apps/shared/engineerGovernanceVotes.ts:1-398`.

**CADES FPS:** `apps/shared/actsFourFiveShells.ts:169-228`, `apps/shared/cadesCompletionBridge.test.ts:52-54,81-84`, `apps/client/src/pages/CADESFPSPage.tsx`, `apps/shared/ironLionBroadcasts.ts:101-111`.

**Terminus Swarm canon:** `apps/shared/featureRoadmap.ts:128`, `apps/shared/transmissionLoredexUnlocks.ts:35-36`, `apps/shared/kaelFragmentWatchers.ts:63-64`, `apps/shared/appendixBKaelQuestline.ts:235`, `apps/shared/galacticDanceFactionNpcs.ts:61`, `apps/shared/phantomCrew.ts:60`, `downloads/DISCHORDIAN_PRODUCTION_BIBLES_COMBINED.md:3561`.

**Trade Empire:** `apps/shared/tradeEmpire/` (15 modules), `sectorMemory.ts:18-60`, `convergenceClimax.ts`, `fleetCommanders.ts`.

**Cutscene infrastructure:** `apps/shared/cutsceneRegistry.ts:22-245`, `apps/client/src/components/cutscenes/SingleVideoCutsceneOverlay.tsx:46-189`, `apps/client/src/components/cutscenes/HumanLifeVideoOverlay.tsx:24-57`, `apps/shared/lib/assetUrl.ts:19-30`, `apps/scripts/upload-public-to-s3.ts`.

**Per-character canon (voice register):** `apps/shared/act3EyesBiography.ts`, `apps/shared/watchersEyesDispatches.ts:128-170`, `apps/shared/actsFourFiveShells.ts:50-110`, `apps/shared/act1Opponents.ts:114-160,232-246`, `apps/shared/cycleBattles.ts:117-151`, `apps/shared/companionAskTopics.ts:734-741`, `apps/shared/broadcastLibrary.ts:17,19,32`, `apps/shared/antiquariansJournal.ts:4-7`, `apps/shared/resurrectionProtocols.ts`, `apps/shared/theInventor.ts`, `apps/shared/bloodWeave.ts`, `apps/shared/preludeSequence.ts`.

**Foundation (PR #601):** `apps/shared/humanWhispers.ts`, `apps/shared/mascoteerFiles.ts`.

**Existing Apprentice system (third-advisor source; do NOT duplicate):** `apps/shared/apprentices.ts` (12 archetypes), `apps/shared/apprenticeCohort.ts:52` (`active` slot the Hub chair reads from), `apps/shared/apprenticeIdentity.ts:71-600` (per-archetype likes/dislikes/personal-quests/romance/breaking-point), `apps/shared/apprenticeBetrayal.ts` (corruption thresholds: 60/75/90/100), `apps/shared/apprenticePermadeath.ts` (final-death handling), `apps/shared/apprenticeMechronisLink.ts` (architectInfluence model), `apps/shared/apprenticeMemoryInheritance.ts` (Memory Card carryover), `apps/shared/apprenticeBanter.ts`, `apps/shared/apprenticeVoiceLines.ts` (720 baseline VO lines, ~30 × 12 × 2), `apps/shared/apprenticeGifts.ts`, `apps/shared/apprenticeToCrew.ts` (graduation pipeline). DB tables (`apps/db/schema.ts:6791-8465`): `apprenticeCohortSlots`, `apprenticePersonalQuestProgress`, `apprenticeGiftLog`, `apprenticeRomanceArc`, `apprenticeDialogueProgress`, `apprenticeDoctrineSelections`, `apprenticeMechronisAuditLog`, `apprenticeSignatureCards`, `apprenticeMemoryCards`, `apprenticeMissionInstances`, `apprenticeTrialCompletions`. **Mid-migration note:** `apps/client/src/stores/apprenticeStore.ts:9-11` — not yet primary read source; coordinate with the store-migration owner before PR 11 lands.

**Pacing constraints:** `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md:127,134,136`, `docs/production/ALL_ACTS_ROADMAP.md`, `docs/built/LORE_BIBLE.md`, `docs/narrative-audit/ACTS_2_7_COMPLETENESS_AUDIT.md`.

---

## Part 12 — Effort estimate

| Surface | Hours |
|---|---:|
| 5 character videos (registry + ingest + CADES bridge test) | 9 |
| 6 Engineer episodes (vote migration + N-option shape + hub UI) | 10 |
| 6 Oracle visions (videos + new vote module + lore review + Shadow Tongue / Heirophant / Thaloria / Wraith-setup canon locks) | 11 |
| Terminus Swarm video registration + Wave 10 watcher integration | 2 |
| Painter / Inventor prelude vignettes | 2 |
| **Advocate prelude vignette** (Ninth-ballad VO + 6 canon flags + Master-of-R'lyeh code reconciliation + new `eldritchOutsiders.ts` registry + Loredex callback to player Blood Weave track + lore-bible review) | 6 |
| Eyes Music Video + Trade Empire gate | 2 |
| Class content layer (cc_* + room reactions × 10 + whispers × 5) | 12 |
| **Framing-device presenters (10 React components, incl. LastWordsSlideshow)** | 14 |
| **2 Last Words Slideshow events** (stills manifests + audio sync + Antiquarian outro cards + surface wiring at Bench + Prisoner's cell) | 4 |
| **Companion advisor layer — Elara + Human two-stack (~148 lines + module + UI chairs + cross-reactivity)** | 16 |
| **9 universal video votes** (NEW) — vote shapes + 9 Antiquarian inscriptions + 4-5 options each + lore-bible review | 6 |
| **Apprentice Hub bridge** (`apprenticeHubAdvisor.ts`) — reads from existing `apprenticeCohort.active`; 12-archetype → 4-family map; Hub chair UI using existing apprentice portrait/VO primitives; `lastHubVoteOpinion` field on existing Memory Card schema | 4 |
| **Apprentice 12-archetype-distinct advisor entries (~1,184 lines)** — 12 archetypes × 2 lines × 37 votes + ~296 family-level persuasion variants + lore-bible review on 12 breaking-point pairings + uniqueness invariant; staged across PR 12 / 12a / 12b by archetype-set | 48 |
| **Persuasion mechanic** — `votePersuasion.ts` + per-companion attempt budget + 3 argument frames + Respectful-vs-Push-hard sub-choice on Apprentice failure + delta routing into existing apprentice logs | 10 |
| **Breaking-point integration** — wire Hub votes as stage-3 trigger source for `apprenticePersonalQuestProgress`; deepened/broken resolution per archetype × vote alignment; permadeath-mid-vote handling | 6 |
| **Meme-framing layer** — `memeFramingLibrary.ts` + ~111 Inventor-voice frame lines + Hub sticky-note UI + `inventor_introduced` gating | 5 |
| **Season 1 video registration + ingest** (16 videos + 6 NEW framing-device kinds + presenter components) | 10 |
| **Season 1 governance votes** (16 votes + Antiquarian inscriptions + 12 canon binds + lore-bible review BLOCKING) | 10 |
| **Season 1 Ep 1 special handling** (old-recording aesthetic CSS/canvas effect + alarm sequence + 50/50 vote UI + Heart-of-Time cutscene wiring + Human voice both paths + Ep 2 retroactive Hub-frame bind) | 8 |
| **Season 1 apprentice 12-archetype advisor entries** (~384 lines: 12 × 2 × 16 + Elara/Human 64 + Inventor meme-frames 48 = ~496 added; staged by archetype-set) | 20 |
| **Part 13 — game-mode coherence audit** (`SAGA_GAME_MODE_COHERENCE.md` matrix expanded to cover BOTH seasons + gameModeStoryCoherence parity test) | 12 |
| **Season 2 video registration + ingest** (14 videos + 7 NEW framing-device kinds + presenter components) | 9 |
| **Season 2 governance votes** (14 votes + Antiquarian inscriptions + 15 canon binds + lore-bible review BLOCKING) | 10 |
| **Season 2 Ep 2.1 special handling** (Politician broadcast intro + theft cinematic + Heart-of-Time bridge welcome + multi-Nexus-anchor vote UI) | 6 |
| **Season 2 Ep 2.11 special handling — Agent Zero death reveal** (sequence gating + Bayern-7-as-AZ reveal cinematic + yellow-jacket motif lock + retroactive flag wiring + companion advisor authoring for the saga's highest-payoff moment) | 10 |
| **Season 2 Ep 2.14 special handling — apocalypse + franchise pivot** (catastrophic War vote UI + nanobot plague cinematic + loop-closure transition to S1 Ep 1.1 + Servant Hero Academy onboarding + opt-out toggle) | 8 |
| **Season 2 apprentice 12-archetype advisor entries** (~336 lines: 12 × 2 × 14 + Elara/Human 56 + Inventor meme-frames 42 = ~434 added; Ep 2.11 reactions are highest-authored single moment) | 18 |
| **Season 2 side content** (5 arcs: Last Christmas + Welcome to Celebration + Mechronis Academy + Necromancer's Lair (Akai Shi) + Syndicate of Death (Wraith Calder); independent surfaces, parallel-shipping) | 24 |
| Infrastructure (StoryVignetteRegistry + ingest + 34 parity tests) | 22 |
| **Part 14 — First Wave Mystery meta-thread + Wolf companion + Hunt-the-Hero minigame** (Codex module + ~127 Codex entries across 5 stages + Wolf BioWare companion + Hunt minigame + 3 Survivor-advisor sets + Crucible/Hierarchy retroactive lock + 10 parity tests added in Part 14) | 114 |
| **Total** | **~472h ≈ 14-15 weeks** |

---

## Part 13 — Game-mode story-coherence audit (NEW, depends on BOTH seasons landing)

Once Seasons 1 + 2 are in-game, every game mode's narrative beats must be cross-checked against the 30-episode reveal order so that NO mode reveals canon ahead of the episode that introduces it. Deliverable: a single coherence matrix at `docs/narrative-audit/SAGA_GAME_MODE_COHERENCE.md` keyed by season + episode.

**Highest-risk cross-mode reveals to enforce:**
- **Source = Kael** (S1 Eps 5-7) — Trade Empire intel, TCG Source/Kael cards, Tower Defense Wave-10 hints must gate behind these episodes
- **The Architect's identity + Project Vector** (S2 Eps 2.10, 2.12) — TCG flavor must not name-drop the Architect prematurely
- **Agent Zero died on Veridian Prime** (S2 Ep 2.11) — CADES M6 mission text + Trade Empire intel must NOT pre-reveal the betrayal; CADES M6's "real Agent Zero" line stays canonically ambiguous until 2.11 fires
- **Engineer's exact death circumstances** (USER LOCK — never specified) — no game-mode surface adds detail
- **The Politician = Dept. of Government Efficiency** (S2 Ep 2.10) — propaganda assets in early acts must not name the origin
- **Servant Hero Academy genre pivot** (S2 Ep 2.14) — must not surface before the catastrophic War vote resolves; if a player opts out of the pivot, the Academy onboarding must respect their choice

### Modes in scope

| Mode | Owner module(s) | Narrative integration |
|---|---|---|
| **TCG card game** | `apps/shared/tcg-core/cards/definitions/**` (200+ card files) | Card flavor text, faction references, card-introduces-character beats. Risk: a card referencing the Source / Architect / Collector by name unlocks before Season 1 introduces them. |
| **CADES FPS Godot iframe campaign** | `apps/shared/actsFourFiveShells.ts:169-228`, `apps/client/src/pages/CADESFPSPage.tsx`, `apps/shared/cadesCompletionBridge.test.ts` | M1-M7 missions; Agent Zero (M6) + Iron Lion (M7) cinematics. Season 2 territory mostly; Acts 5-7. |
| **Tower Defense (Terminus Swarm)** | `apps/shared/kaelFragmentWatchers.ts:63-64`, `apps/shared/appendixBKaelQuestline.ts:235`, the Terminus Swarm game-mode app | Wave 10 cinematic = the Source's-offspring reveal payoff. Waves 1-9 escalation. Must not reveal Source=Kael before S1 Eps 5-7. |
| **Trade Empire** | `apps/shared/tradeEmpire/` (15 modules), `sectorMemory.ts:18-60`, `convergenceClimax.ts` | Intel-based progression; Eyes Music Video at intel ≥ 200. Must respect S1 reveal gates. |
| **Chess (multiplayer)** | `apps/server/` chess router | Standalone metagame; minimal story interlock. |
| **Sprite proxy** | `apps/server/` sprite proxy | Dev/admin tool; no narrative interlock. |
| **Prelude beat sequence** | `apps/shared/preludeSequence.ts` | Already covered (Painter / Advocate / Inventor + S1 Eps 1-2). |
| **Apprentice 28-day trial / Celebration park** | `apprenticeCohort.ts`, `apprenticePersonalQuests.ts`, `apprenticeBetrayal.ts`, etc. | Personal quest stage-3 breaking-points should align with the Season-1-episode timeline (e.g., archetype-Oracle's breaking-point candidate is Oracle Ep 5, which is Act 4 — confirm the average player's active-Oracle-apprentice cohort timing overlaps). |

### Coherence matrix shape

`SEASON1_GAME_MODE_COHERENCE.md` is a table keyed by Season 1 episode, with columns for each game mode showing:
- **Prerequisite reveals** (what must be true before this episode plays)
- **New reveals** (canon introduced by this episode)
- **Cross-mode reveal risks** (anywhere another mode might reveal this canon prematurely)
- **Mitigation** (unlock-gate, card-text rewrite, dialogue suppression, etc.)

### Hard parity test (ship:check)

`gameModeStoryCoherence`:
- The matrix file exists and is non-empty
- Every cross-mode reveal flagged in the matrix has a Season-1-episode gate (`season1_ep{n}_played`) on its corresponding unlock surface
- No card / mission / Loredex entry / transmission references canon entities (Source, Architect, Collector, the Host, 9th Neon, Heart-of-Time vessel, etc.) without a Season-1 gate

### Output of this audit

- The coherence matrix document
- A punch-list of misalignments (sized in PR 20)
- Individual fix PRs per misalignment (post-PR 20, scoped per affected mode)

This is intentionally an AUDIT, not a remediation PR. Remediation work is enumerated by the audit and prioritized after.

---

## Part 14 — The First Wave Mystery (saga-wide meta-narrative thread, NEW)

**Every system in Dischordia carries breadcrumbs of the same mystery: *What happened to the first wave of Potentials?*** The player IS the second wave. They wake on the Antiquarian's emergency recording (S1 Ep 1.1) at the cold open of a loop the first wave already finished. Their job — surfaced via every game mode the saga ships — is to piece together what the first wave did, why it ended in the Fall of Reality (S2 Ep 2.14's nanobot plague), and whether the second wave can do differently.

**This is the saga's META-thread.** Not a single questline. Not a single game mode. **The shape of the entire app.** Every existing system already carries some piece of it; Part 14 makes the connections explicit and surfaces them in a unified accumulating Codex.

### The mystery's questions (answered progressively across the saga)

| Question | Answered by |
|---|---|
| **Q1 — Who were the first wave of Potentials?** | S1 Eps 1.1-1.16 + Engineer arc + Oracle arc + Advocate canon |
| **Q2 — What happened to them?** | S2 Eps 2.1-2.14 (catastrophic War-Choice → nanobot plague → Fall of Reality) |
| **Q3 — Why does the Antiquarian preserve their chronicle?** | Cross-arc reveal: she IS the loop-keeper; her ledger is the diary the next wave reads (Hub past-result inscriptions = the diary's surviving entries) |
| **Q4 — Who else survived the catastrophe?** | The First-Wave Survivor companion category: **Lycos → the Wolf**, **Akai Shi**, **Wraith Calder**, and possibly the Inventor (until his death in Ep 2.14). Each has a canonical pre-death / post-resurrection identity split. |
| **Q5 — Can the second wave succeed where the first wave failed?** | The Servant Hero Academy franchise pivot (S2 Ep 2.14 epilogue) — the genre-shift OUT of the loop. **The saga's answer: not by fighting harder. By serving instead.** |

### The First-Wave Survivor companion category (LOCKED, NEW)

Three first-wave-Potential characters share the canonical pre-death / post-resurrection identity split. Each is a full BioWare-level companion with the existing apprentice-system suite (personal quest, banter, gifts, romance arc, voice lines per emotion bucket, portrait + emotion frames, Loredex entries, memory inheritance, signature card).

| Pre-death | Post-resurrection | Race | Theme | Companion surface |
|---|---|---|---|---|
| **Lycos** — Quarchon Servant Hero of the League (gold-helmeted purple-armor visual ref) | **The Wolf** — fatalist Quarchon assassin (hooded skull-mask grey predator visual ref) | Quarchon | *Death freed me. Released me from the chains of purpose.* Hunts the corrupted Servant Heroes inside the Crucible. | Hunt-the-Hero minigame + Hub advisor chair (Survivor seat) |
| **Akai Shi (pre-death)** — investigator, first-wave detective | **Akai Shi (post-resurrection)** — Necromancer-archon-aligned death-defier; "my true life began the moment I died" | (TBD per existing lore) | *My soul was called back into this reality to protect an ancient demon.* Hunts the Necromancer's secret laboratory inside Hamatora. | Akai Shi questline (existing side content) |
| **(pre-death identity TBD per existing lore)** | **Wraith Calder** — Potential reborn via stolen Resurrection Protocols; "my true life began the moment I died"; six-twin revenge | (TBD per existing lore) | *They thought they could keep the Syndicate of Death hidden... but they didn't count on me coming for them one by one.* | Syndicate-of-Death questline (existing side content) |

**The three resurrected first-wave survivors are the player's most intimate access to the first-wave perspective.** They were there. They saw what happened. They know what didn't work. Their advice on Hub votes carries the weight of having already lived a version of the decision.

### The Hub advisor stack extends to FOUR voices in Season 2

| Companion | Source | Voice register |
|---|---|---|
| **Elara** | Always available | Head — senatorial / procedural |
| **The Human** | `human_life_reveal_seen` | Gut — noir-detective / leverage; cross-loop observer |
| **The Active Apprentice** | `apprenticeCohort.active` (12 archetypes) | Heart — earnest / archetype-distinct |
| **The First-Wave Survivor (NEW)** | Whichever survivor is the player's current companion: Wolf / Akai Shi / Wraith Calder. Player can swap between them when more than one is unlocked. | **Fate** — Quarchon dimensional probability (Wolf) / Necromancer death-defiance (Akai Shi) / vengeance-fuelled inevitability (Wraith Calder). They speak from beyond death. |

**Four voices at every Season-2 Hub vote.** The Survivor seat is the saga's most narratively weighted advisor — they've seen the previous-loop outcome and can warn you.

### The First Wave Codex (NEW Loredex-adjacent surface)

`apps/shared/firstWaveCodex.ts` — a unified accumulating compilation that the player builds as they play through EVERY game mode. Each system contributes evidence streams; the Codex aggregates them.

| System | Evidence contribution to the First Wave Codex |
|---|---|
| **Hub votes (Season 1 + 2)** | Antiquarian past-result inscriptions = the first-wave decision record (30 entries minimum) |
| **TCG cards** | Each character card carries a "First Wave Era" annotation unlocked progressively (200+ cards, ~50 with major first-wave content) |
| **CADES FPS missions** | M6 + M7 deliver first-wave-veteran testimonies (Agent Zero died on Veridian Prime = a Codex entry locked in S2 Ep 2.11) |
| **Tower Defense / Terminus Swarm** | Kael Fragment + Terminus survivors' essences split from corrupted form = first-wave-Source-pre-corruption fragments. Wave 10 unlock = major Codex revelation. |
| **Trade Empire intel dossiers** | Compiled first-wave-figure files; intel ≥ 200 = Eyes Music Video = Codex entry |
| **Apprentice trials + Memory Cards** | Each Memory Card = a record of a first-wave-Potential generation's decisions inherited forward; consumed cards add a Codex entry tagged with the apprentice's archetype |
| **Mechronis Academy** | The 5-archon-guild lessons = first-wave training records. Player's chosen guild reveals first-wave guild history. |
| **Celebration** | The one-graduates-per-year tradition = first-wave preliminary-recruit ritual; Codex entries about who graduated each year |
| **The Necromancer's Lair (Akai Shi)** | First-wave detective's investigation log; major Codex source |
| **Syndicate of Death (Wraith Calder)** | First-wave hero's revenge journal; major Codex source |
| **Planet of the Wolf (Lycos → Wolf)** | Every corrupted-Servant-Hero kill = a Memory Shard = a Codex entry about the pre-corruption hero's first-wave identity. **The Wolf's hunt is the saga's most direct first-wave-investigation surface.** |
| **Servant Hero Academy (post-S2)** | The Antiquarian's curriculum = his archive of first-wave lessons reformatted for second-wave students |

**The Codex's shape:** a chronological + thematic compilation. The player can browse by:
- **Person** (each first-wave Potential / character has a profile that fills out as evidence accumulates)
- **Event** (Inception Ark awakening / Ep 1.1, Source planet crash / Eps 1.4-1.7, crystal-city arrival / Eps 1.8, Civil War / Eps 2.6-2.10, Veridian Prime / CADES M7 + Ep 2.11, Fall of Reality / Ep 2.14)
- **Decision** (every Hub vote's first-wave outcome is a Codex entry tagged with the decision's marker and the canonical winner)
- **System** (browse by which game mode revealed which piece)

### The Codex's progressive-completion ship:check parity

| Test | Lock |
|---|---|
| `firstWaveCodexEntrySourceCoverage` | Every Codex entry has a `source` field naming the game-mode / episode / cinematic that unlocked it. No orphan entries. |
| `firstWaveCodexCompletionThresholds` | Codex completion percentages have story-gated rewards: 25% = Antiquarian's first-letter-to-the-second-wave; 50% = Wolf's hunt becomes available; 75% = Servant Hero Academy onboarding reveals one extra mission; 100% = an alternate-ending Antiquarian inscription that names the second-wave's choice as canonical-going-forward. |
| `firstWaveCodexCharacterPattern` | The three First-Wave Survivor companions (Lycos→Wolf, Akai Shi, Wraith Calder) have full pre-death + post-resurrection Codex profiles linked. |
| `firstWaveCodexMysteryQuestionMapping` | All 5 mystery questions (Q1-Q5 in Part 14) have at least 3 Codex entries each tagged as evidence. |
| `firstWaveCodexCrossModeReveal` | Every game-mode system in scope (Hub votes / TCG / CADES / Tower Defense / Trade Empire / Apprentice / Mechronis / Celebration / Servant Hero / 3 first-wave-survivor questlines) contributes ≥ 1 Codex entry. No system is left out. |

### The thematic payoff (LOCKED — the saga's central thesis surfaces here)

The First Wave Mystery's answer is bittersweet and load-bearing:

**The first wave failed because they chose War in every loop.** They had the Heart of Time. They had the Antiquarian's chronicle. They had the Crucible-League waiting in the wings. **They still chose War.** The Servant Heroes inside the Crucible got corrupted because the Hierarchy of the Damned saw the same pattern repeating and infiltrated through Shadow Tongue's S1-Ep-6 summoning. The Antiquarian's last bet — preserving the chronicle for a second wave — is the saga's wager that *seeing the previous failure laid out is enough to choose differently*.

**The Wolf is the second wave's most uncomfortable evidence.** A first-wave Potential who died, was resurrected as a predator, and is now killing the Antiquarian's own corrupted assets to give reality a chance. **He is the cost of the Antiquarian's plan.** He is also the only first-wave figure actively cleaning up the previous wave's mess.

**The Servant Hero Academy is the Antiquarian's offer to the second wave: stop trying to win the war. Serve instead.** The first wave's failure was the assumption that the loop could be defeated. The second wave's success — if it succeeds — is the recognition that the loop can be *exited* by changing the genre. War narrative → service narrative. **The Codex's 100% completion entry is the canonical statement of this: *"The second wave read what the first wave wrote. The second wave did not write the same thing back."*** 

### PR additions for Part 14

| PR | Surface |
|---|---|
| **PR 28** | **First Wave Codex module** (`apps/shared/firstWaveCodex.ts`) + Codex UI surface + 5 ship:check parity tests. Cross-mode evidence-aggregation infrastructure; doesn't ship content yet, ships the shape. |
| **PR 29** | **Codex entry authoring across all systems** — staged by system: 29a = Hub votes (30 entries); 29b = TCG card annotations (50 cards); 29c = CADES + Tower Defense + Trade Empire (12 entries); 29d = Apprentice + Mechronis + Celebration (15 entries); 29e = Side-content questlines (Akai Shi + Wraith Calder + Wolf) (~20 entries). Lore-bible review per stage. |
| **PR 30** | **Planet of the Wolf — Lycos / Wolf companion** — full BioWare-level companion using existing apprentice infrastructure: personal quest (3-stage breaking-point) + banter (with Elara / Human / active Apprentice / other survivors) + gift system + romance arc + voice lines per emotion bucket + portrait+emotion frames + Loredex entries + Memory Card if he dies. Plus Hub advisor chair (Survivor seat) with fatalist-Quarchon voice register and Hub-vote advice/reaction lines for all ~53 votes. |
| **PR 31** | **Hunt-the-Hero minigame** — TCG-card-corrupted-variant rendering (programmatic filter) + 12-20 corrupted-Servant-Hero dossiers (12 = one per apprentice-archetype's dark mirror, matching the 12-archetype taxonomy) + 4-option approach vote per hunt (+ 🙏 offered) + text-encounter dialog trees + Memory Shard payload format + Wolf corruption track (parallel to apprentice corruption). Reuses TCG / dialog / vote / corruption / memory-card systems. |
| **PR 32** | **First-Wave Survivor advisor entries** — Wolf / Akai Shi / Wraith Calder advisor lines for all ~53 Hub votes. Each survivor's voice register distinct (fatalist Quarchon / Necromancer-archon death-defier / vengeance-fuelled hero). Three voice-pattern sets × 53 votes × 2 lines = ~318 lines per survivor; staged across PR 32a / 32b / 32c per survivor. |
| **PR 33** | **Crucible canon binding + Hierarchy infiltration retroactive lock** — adds the Crucible to the Antiquarian's pocket-dimension observatory surfaces + locks Shadow Tongue's S1 Oracle Ep 6 summoning as the Crucible-corruption inflection point + locks the Advocate's broken seal as the Hierarchy escape mechanism + cross-references the existing Hierarchy lord encounter system (`hierarchyOfTheDamned.ts`) so corrupted-Servant-Hero hunts can surface Hierarchy lord voices as corrupting agents. |

### Ship:check additions

35. **`firstWaveCodexEntrySourceCoverage`** — every Codex entry has a `source` field naming the unlocking game-mode / episode / cinematic. No orphan entries.
36. **`firstWaveCodexCompletionThresholds`** — Codex completion-percentage rewards wire correctly (25% / 50% / 75% / 100%).
37. **`firstWaveCodexCharacterPattern`** — 3 First-Wave Survivor companions have pre-death + post-resurrection Codex profiles linked.
38. **`firstWaveCodexMysteryQuestionMapping`** — all 5 mystery questions have ≥ 3 Codex entries each.
39. **`firstWaveCodexCrossModeReveal`** — every game-mode system contributes ≥ 1 Codex entry. No system left out.
40. **`wolfCompanionBioWareCoverage`** — Wolf companion has the full apprentice-suite surfaces (personal quest stages 1-3, banter pairs ≥ 8, gift evaluations ≥ 12, voice lines per emotion bucket, portrait emotion frames, signature card on Memory Card if he dies in the Wolf-corruption-100 path).
41. **`wolfHuntCorruptedHeroCoverage`** — 12 corrupted-Servant-Hero dossiers exist (one per apprentice-archetype dark mirror); each has a TCG-card-corrupted-variant + Wolf dossier text + Memory Shard payload format.
42. **`wolfCorruptionTrackParity`** — Wolf has a parallel `wolfCorruption` track that mirrors `apprenticeCorruption` thresholds; at 100 the Wolf becomes a hunted target himself.
43. **`firstWaveSurvivorAdvisorCoverage`** — Wolf / Akai Shi / Wraith Calder each have Hub-vote advice + reaction lines for every Hub vote where they're the player's current Survivor companion.
44. **`crucibleHierarchyInflectionLock`** — Crucible-corruption canon is gated behind S1 Oracle Ep 6 (Shadow Tongue summoning) firing; cross-lock with Hierarchy lord encounter system (`hierarchyOfTheDamned.ts`) confirms the escape mechanism.

Expected new post-PR ship:check delta: **+44 PASS rows total.**

### Effort additions

| Surface | Hours |
|---|---:|
| **First Wave Codex module + 5 parity tests** | 8 |
| **First Wave Codex entry authoring across all systems (~127 entries across 5 stages)** | 28 |
| **Planet of the Wolf — Lycos / Wolf companion (full BioWare-level)** | 18 |
| **Hunt-the-Hero minigame** (12-20 corrupted-hero dossiers + corrupted-variant filter + text encounters + Wolf corruption track) | 22 |
| **First-Wave Survivor advisor entries** (Wolf / Akai Shi / Wraith Calder advice + reaction for ~53 votes × 3 survivors = ~954 lines; staged per survivor) | 32 |
| **Crucible canon binding + Hierarchy infiltration retroactive lock** | 6 |

Part 14 effort: **~114h ≈ 3-4 weeks added.**

---

## Part 15 — The Complete Playable Walkthrough (saga end-to-end, beat by beat)

**Architect's vision (per user lock):** Every battle, every level, every minigame, every vote, every cinematic, every album slideshow, every Codex entry has a narrative reason and a specific moment in the saga's arc. Nothing exists outside the story. Game modes activate when their lore is introduced; battles happen because a character had a reason. The five concept albums (West by God / Silence in Heaven / The Book of Daniel 2:47 / Dischordian Logic / The Age of Privacy) drop as slideshow surfaces at thematically tied beats. The Hamlet playthrough returns three times — each escalation a deeper revelation. The Collector's Arena lives inside the Panopticon-inside-the-Matrix-of-Dreams. Thought Virus Outbreaks fire across every game mode whenever the player learns about the virus.

**The promise:** a playable path from Prelude cold-open to Servant Hero Academy onboarding where the player never asks "why am I doing this fight."

### 15.1 — The Five Album Slideshows (canon-locked surface integration)

Each album is a slideshow surface (same framing-device pattern as the Last Words Slideshow — locked-audio + cross-faded stills + Antiquarian outro card). Each plays at thematically tied saga beats.

| Album | Theme | Drop point(s) | Slideshow stills (canonical) | Antiquarian outro |
|---|---|---|---|---|
| **The Book of Daniel 2:47** | Prophecy / dream-reading / king of kings | (1) After **Oracle Ep 2 — Heirophant's Blessing** (the Ancient Prophecies revealed) (2) At **Tower Defense Wave 10** (the Source-Kael prophecy fulfilled) | Nebuchadnezzar's dream-statue → the four kingdoms → the stone uncut by hands → the Heirophant reading the scrolls → the Source's frozen leviathan corpse → Kael's nine-year-old face | *"The prophet read what was written before he was born. The Potentials read what was written for them to read. Both readings are correct. Only one of them survives the king who hears it."* |
| **The Age of Privacy** | Surveillance / watchers / control | After **the Eyes video + redaction cascade** (post-`dispatch_F7_final_first_read`) — slideshow plays as the redaction bars lift | The Watcher's eye → the Eyes in her network chair → an Inbox sender field gone blank → the Authority's six chambers → a Panopticon cell door open → a Mascoteer file with one name redacted | *"They watched because they cared. They watched because they were paid. The Potentials never asked which until the Eyes asked herself."* |
| **Silence in Heaven** | Divine absence / end times / the gods are gone | (1) At **Season 1 Ep 1.16 — Memento Dischordia** (the cliffhanger; the gods fall silent as the Side-Choice opens) (2) At **Season 2 Ep 2.14 — A Question of Endings** (the nanobot plague consumes reality; divine absence complete) | An empty Star Whisperer seat → the Heirophant's empty throne → the Templum Veritus dark → a sky over Veridian Prime going dark → an Inception Ark adrift → the Antiquarian's pocket-dimension observatory at one candle | *"Heaven was never silent. Heaven was always reading. The Potentials confused the listening for absence. They voted against what was listening, and so they were heard."* |
| **Dischordian Logic** | Chaos as method / third-option choosing / alternative reality | (1) At **Season 1 Ep 3 — Terminus Swarm intro** (catastrophic 🔥 vote — aggressive blast wins) (2) At **the Wolf's Hunt-the-Hero unlock** (fatalist Quarchon worldview = Dischordian Logic embodied) | The Engineer at the third-option moment → the Inventor's "did you know?" sticky note → the Heart of Time vessel arriving → the Wolf's first kill → a branching probability tree → an "any1 protocols" graffiti | *"Logic is the rule. Discord is the rule about the rule. The Potentials kept finding new rules until the rules themselves grew tired. Then they kept finding new ones anyway."* |
| **West by God** | Frontier / journey beyond / pioneering | (1) At **Season 1 Ep 8 — The Arrival** (crystal-city planet — first frontier) (2) At **Season 2 Ep 2.2 — Syndicated** (quarantined New Babylon — second frontier) | The Inception Ark's first sunset → the crystal-city skyline → the Templum Veritus pyramid emerging from forest → the Heart-of-Time bridge windows → New Babylon's neon haze → Iron Lion's Veridian Prime grave | *"West was a direction the Potentials carried with them. Every world they arrived on, they arrived from the east. The Antiquarian kept the compass. The compass never pointed anywhere they had not already been."* |

**Slideshow framing-device kind:** reuse `last_words_slideshow` framing (Part 8.4) — same input-locked audio + cross-faded stills + Antiquarian outro pattern. Add a `kind: "concept_album_slideshow"` variant that names the album. Each slideshow takes ~3-4 minutes; player input is locked for the duration. Pacing-budgeted into the relevant act per the walkthrough table below.

### 15.2 — The Three Hamlet Playthroughs (escalating interactive theater)

Hamlet is the saga's recurring "play-within-a-play" mechanism. **Each playthrough surfaces canon the player wouldn't otherwise see — and each escalates the player's role from audience to actor to author.**

| # | Act | Mode | Mapping | Reveal triggered |
|---|---|---|---|---|
| **Hamlet I — The Mousetrap (audience)** | Act 2 mid (during Oracle Eps 2-3, inside the Templum Veritus) | Player ATTENDS a theatrical performance | Hamlet → the player as Potential. The Ghost → the Antiquarian's recording. Claudius → the Architect. The poisoned king → Kael / the Source (canonically Kael, pre-corruption). The Mousetrap (the play-within) → the Antiquarian's chronicle itself. | **Source = Kael revelation foreshadowed** (the audience sees the parallel; the Codex unlocks the Source-Kael identity entry several episodes before the in-game reveal lands in Ep 1.7) |
| **Hamlet II — The Prisoner's Hamlet (actor)** | Act 6 (during S2 Ep 2.6 — Hacking Reality — inside the Matrix of Dreams) | Player PLAYS as the Prisoner-Hamlet through key scenes interactively | Hamlet → the Prisoner (harvested Oracle). Ophelia → Vex Solène (the Engineer's posthumous resurrection — drowned in the Hellbox/Resurrection Protocols). The grave-digger → Akai Shi. Claudius → the Architect. The duel → the Authority's hack. | **The Prisoner = the Oracle, revealed mechanically** — the Prisoner's "To be or not to be" choice IS a Hub vote whose options are *"remember"* / *"stay forgotten"*. Canon: remember. Triggers `prisoner_oracle_identity_reveal` flag. |
| **Hamlet III — The Rest Is Silence (author)** | Act 7 / post-Ep 2.14 (at the Servant Hero Academy onboarding ceremony in Orlando) | Player AUTHORS Hamlet's final monologue — choosing how the play ends | Hamlet's final line "the rest is silence" → the saga's pivot from war narrative to service narrative. Player customizes the closing words inscribed at the Academy's gates. | **The saga's only authored content** — the player's words become the Antiquarian's final Codex entry. *"The second wave wrote: \_\_\_\_\_. The chronicle closes there."* The most personal narrative beat in the entire saga. |

**Hamlet I** is full-scene theatrical (uses existing dialog system; locked input; ~12 minute performance with 3 Hub-vote-shape interaction points per act for the audience).

**Hamlet II** is the **major Hamlet game mode** — an interactive 5-act theater traversal where the player traverses each scene. **Reuses TCG combat system** for the duel scene; **reuses Hub vote shape** for "To be or not to be"; **reuses Wolf's Hunt-the-Hero dialog trees** for the courtly conversations; **reuses Apprentice banter** for Horatio's loyalty checks. Asset-efficient via heavy reuse.

**Hamlet III** is a single-screen player-authored closing line. Saved permanently in the Codex.

### 15.3 — The Collector's Arena (Panopticon-in-Matrix-of-Dreams TCG combat)

**Nested location canon (LOCKED):** The Matrix of Dreams (the Authority's substrate, S2 Ep 2.6) CONTAINS the Panopticon (the Prisoner's cell-network, Acts 4-7) which CONTAINS the Collector's Arena (a sub-region the Collector built for his Harvesting). **All three are the same nested space, revealed progressively.**

**Unlocks:** Season 1 Ep 10 (The Artifact — Collector freed). Persists through the rest of the saga; deepens at every Collector encounter.

**Game mode:** TCG-arena combat — the player plays as the Prisoner (Kael-Oracle) using a Prisoner-specific deck that grows as he remembers more of his pre-harvest identity. Each Arena tier = 5 fights against Collector clones (TCG matches using existing card definitions for the clone forces). Bosses = the Collector himself wearing the helmet. **Each victory unlocks a Memory Shard → First Wave Codex entry about a piece of the Prisoner-Oracle's pre-harvest past.**

**Cross-mode appearances of the Collector:** The Collector appears as a SECRET BOSS in OTHER game modes at high-corruption / high-risk moments:
- In **the Wolf's Hunt-the-Hero minigame** when `wolfCorruption` ≥ 75
- In **TCG matches** as a rare opponent unlock when the player's TCG win streak ≥ 10
- In **Apprentice corruption events** at corruption ≥ 90 (the Collector offers the apprentice the Harvesting bargain — they can REFUSE for narrative deepening or ACCEPT for permadeath-bypass at the cost of the Architect's influence)
- In **the Hunt with the Mask** (named event, Act 4 mid) — the Collector wears the helmet and appears OUT OF the Arena into the saga's main world; a one-time Hub-vote-level emergency where the Potentials must decide whether to engage him (canon: NO, retreat — the Collector returns to the Arena, the player learns he can leave it if uncontained)

**Arena tier structure (5 tiers × 5 fights):**
- **Tier 1 (unlocked S1 Ep 10):** The Outer Cells — Collector's lesser clones; tutorial-level encounters
- **Tier 2 (unlocked Oracle Ep 5):** The Recursive Chamber — clones of the Prisoner-Oracle's own past selves
- **Tier 3 (unlocked S2 Ep 2.6):** The Matrix Surface — Authority-merged clones; cross-faction TCG encounters
- **Tier 4 (unlocked Wolf companion):** The Wolf's Mirror — the Collector wearing the Wolf's mask in a final-form encounter
- **Tier 5 (unlocked S2 Ep 2.11 — Agent Zero death reveal):** The Yellow Jacket Arena — the Collector wears Bayern-7-as-Agent-Zero's body. **The saga's most loaded Arena encounter.** Victory grants Memory Shard naming the canonical Agent Zero death; Codex entry unlocked.

### 15.4 — Thought Virus Outbreaks (dynamic cross-mode event system)

**Mechanic:** When the player learns about a thought virus beat in any cinematic, a **Thought Virus Outbreak** fires across multiple game modes simultaneously. Reuses existing event-broker infrastructure (cross-mode flag-watcher).

**Outbreak effects (all cross-mode):**
- **Trade Empire** — intel temporarily corrupted; specific dossiers display as glitched text for 24 in-game hours
- **Tower Defense** — next wave gains thought-virus enemy types (spores from S1 Ep 4-5 canon)
- **TCG** — 3-5 cards temporarily display as their corrupted-variant art (matches Wolf's Hunt corrupted-variant filter)
- **Hub** — an emergency vote opens: "Quarantine the affected sector / Investigate the spread / Allow the outbreak to run its course / Deploy the Wolf to cull infected hosts"
- **Apprentice cohort** — active apprentice's `corruption` ticks +1 (existing delta system)

**Outbreak trigger points (canonical, in order across the saga):**

| Outbreak # | Trigger episode | Severity | Modes affected |
|---|---|---|---|
| 1 | After **S1 Ep 4 — The Fall** (first time the player sees the spores) | Tutorial / mild | Tower Defense + TCG only |
| 2 | After **S1 Ep 5 — The Outbreak** (the bug-swarm emergence) | Escalating | TD + TCG + Hub emergency vote |
| 3 | After **S1 Ep 13 — Wyrmwood** (barriers shatter) | Severe | All five modes |
| 4 | After **Oracle Ep 6 — Shadow Tongue summoning** (Hierarchy corruption begins) | Hierarchy-flavored | All five modes + Crucible status changes |
| 5 | After **S2 Ep 2.6 — Hacking Reality** (Matrix of Dreams infiltrated) | Authority-flavored | All modes + Collector's Arena tier 3 unlocks |
| 6 | After **CADES M7 — Iron Lion's last stand** (Veridian Prime fallout) | Remembrance outbreak | All modes + Iron Lion's broadcast pattern in TCG |
| 7 | **At S2 Ep 2.14 — the catastrophic War-Choice** (the FINAL outbreak — the nanobot plague IS the terminal thought virus mutation) | Apocalyptic / saga-ending | All modes + Servant Hero Academy onboarding transition |

### 15.5 — The Saga Walkthrough (Phase 0 through Phase 14, beat by beat)

**Reading guide:** Each phase lists, in canonical play order: **cinematics watched** · **Hub votes fired** · **game modes activated/progressing** · **battles/levels (with narrative justification)** · **album slideshow drops** · **prophecy/revelation/conspiracy beats** · **companion/advisor moments** · **Codex entries unlocked** · **branching options.**

---

#### Phase 0 — Cold Open & Onboarding (Prelude beats A-G; before any vote)

**Cinematics:** Painter (Beat A.5) → Welcome to Celebration recruit-prep sequence → Advocate "The Ninth" ballad (Beat F.5).
**Hub votes:** None yet (Hub not introduced until Ep 2 retroactively binds it).
**Game modes activating:** **Welcome to Celebration** (player goes through the celebration-school sequence — the one-survivor-per-year tradition surfaces; the player IS the one survivor of their cohort). TCG tutorial unlocked.
**Battles/levels:** Celebration school's hidden mission (the player as red-haired protagonist; first text-encounter that introduces text-encounter mechanics). Narrative reason: prove courage to join the Masketeers.
**Album drop:** None.
**Prophecy/revelation/conspiracy:** Painter introduces Resurrection Protocols (planting Bob-Ross-resurrection seed for Ep 2.13); Advocate's ballad locks the Blood Weave origin → Hierarchy summoned by being spoken (saga-wide naming-is-summoning metaphysics).
**Companion moments:** Elara unlocked at-start. Apprentice cohort initialized (1 active + 2 training — the 12-archetype rotation begins).
**Codex unlocks:** Painter's resurrection / Advocate as "the Ninth" / Inception Ark existence — 3 foundational entries.
**Branching:** Celebration mission outcome affects which archetype-doctrine the player's first apprentice favors.

---

#### Phase 1 — The Awakening (Prelude late → Act 1 opening; first Hub vote)

**Cinematics (in order):**
1. **S1 Ep 1 — Awakening** (Inception Ark emergency-recording — old-recording aesthetic; Antiquarian's 4-min monologue)
2. **Alarm sequence + First Hub Vote** (50/50: Engage Defensive Protocols vs Evade) — CANON: Engage 💯
3. **Heart-of-Time vessel cutscene** (gold eye-shaped ship arrives; missiles unmake; satellite vanishes)
4. **Human voice (audio-only):** *"Interesting...that didn't happen last time."* — time-loop premise locked
5. **Inventor prelude vignette (Beat H — meme-show "did you know?" framing)** — retroactively names the Heart-of-Time vessel's pilot
6. **S1 Ep 2 — A Destructive Potential** (Antiquarian binds Ep 1's vote to her ledger — the Hub is canonized retroactively)

**Hub votes:** 2 votes — Ep 1 (Engage 💯) + Ep 2 (Pursue the escaping seedling pod ❤️).
**Game modes activating:** **TCG match-1 tutorial** unlocked (first deck is the Potentials' starter cards — the Inception Ark's preserved equipment). **Tower Defense** introduced but no waves yet (the Ark's defensive grid). **Trade Empire** stub appears (signal intel from the satellite remnants).
**Battles/levels:** TCG-tutorial match against an organic-satellite-themed AI deck. Narrative reason: practice for the impending Terminus Swarm encounter.
**Album drop:** None.
**Prophecy/revelation/conspiracy:** Time-loop premise REVEALED (Human's voice). Heart of Time's first appearance — the loop-breaker introduced. Inventor's "—I." signature reframes every prior Watcher beat.
**Companion moments:** Elara first Hub-vote advice (Ep 1 — *"Engaging the unknown is the path of the council I voted to disband. But if the precognition systems triggered, the unknown is already inside us. I would engage."*). First apprentice may surface depending on cohort timing.
**Codex unlocks:** Heart-of-Time vessel canon · Inventor's "—I." identity · Antiquarian-as-loop-keeper.
**Branching:** Evade path adds an alt-timeline Codex entry (*"In a world where the Potentials chose differently, the satellite was never engaged..."*); canon converges by Ep 3 regardless.

---

#### Phase 2 — The Fall of the First Wave (Act 1 — Engineer Eps 1-4 interleaved with S1 Eps 3-5)

**Cinematics (interleaved, in canonical play order):**
1. **Engineer Ep 1 — The Engineer of Dreams** (`holo_wake_the_bench`; minCardWins:1) → first **Engineer governance vote** (Scavenge & Invent 👍 canon)
2. **S1 Ep 3 — Terminus Swarm intro** (chase to the rogue planet) → Hub vote (aggressive blast 🔥 canon — catastrophic)
3. **Album drop: Dischordian Logic** (slideshow plays as the 🔥 vote resolves — chaos as method is the lesson)
4. **Engineer Ep 2 — A Dilemma** (`holo_princes_notebook`; minCardWins:3) → Engineer vote (Distract the Arachnid 🔥 canon)
5. **S1 Ep 4 — The Fall** (spore infection; ships crash into the planet) → Hub vote (Analyze 👍 canon — inquiry over annihilation)
6. ***Thought Virus Outbreak #1*** fires across Tower Defense + TCG (tutorial/mild)
7. **Engineer Ep 3 — The Converter** (`holo_worlds_i_saved`; minCardWins:4) → Engineer vote (Escape and Regroup 💯 canon — Arachnid alive)
8. **S1 Ep 5 — The Outbreak** (bug-swarm emergence; signal traced) → Hub vote (Descend 💯 canon)
9. ***Thought Virus Outbreak #2*** fires across TD + TCG + Hub (escalating; emergency Hub vote opens)
10. **Engineer Ep 4 — Better Part of Valor** (`holo_line_they_crossed`; minCardWins:6) → Engineer vote (Seek Additional Allies 👍 canon — Agent Zero recruitment call sent)

**Hub votes this phase:** 5 (Engineer 4 + S1 4 + 1 emergency from Outbreak #2).
**Game modes activating/progressing:**
- **TCG** — matches against fungal Terminus enemies (narrative: practicing against the Source's offspring); Apprentice-class cards unlock as the player's cohort fills
- **Tower Defense Waves 1-3** — defending the crashed Inception Arks from the swarm (each wave's narrative justification: a beat from S1 Eps 3-5)
- **Trade Empire** — first intel-gathering missions; signals from the planet's depths
- **Apprentice trial** — active apprentice can banter about each Engineer episode; if active archetype matches a breaking-point candidate (Artisan → Engineer Ep 6, but Ep 6 hasn't fired yet), the apprentice's personal quest stage 2 opens here
**Battles/levels:**
- **TD Wave 1** (organic-asteroid bombardment — S1 Ep 3's spore-shower battle made playable)
- **TD Wave 2** (spore-infected outer-Ark defense — Outbreak #1 introduces virus-typed enemies)
- **TD Wave 3** (bug-swarm emergence — S1 Ep 5's ravenous monstrosities)
- **TCG** — Engineer's-Bench-themed matches (player builds device-card decks; narrative: testing the Bench's engineering)
**Album drop:** **Dischordian Logic** (during S1 Ep 3's 🔥 vote — chaos-as-method is the catastrophic lesson)
**Prophecy/revelation/conspiracy:**
- **PROPHECY:** The Source's "my progeny" line first hinted in TCG card flavor of Terminus Swarm cards
- **CONSPIRACY:** Project Vector first hint in apprentice doctrine-selection text (existing apprentice mechanic surfaces a vague "Project Vector clearance" flag)
- **REVELATION:** Inception Arks were Engineer-built (Engineer Ep 1's Bench is the same builder; the player IS on his ship)
**Companion moments:**
- Elara advises every Engineer vote with senatorial precedent
- Active apprentice (if Artisan archetype) starts to recognize the Engineer as their craft-elder — personal quest stage 1→2
**Codex unlocks:**
- Engineer's Bench history (4 entries — one per Engineer episode 1-4)
- Terminus Swarm origin foreshadowing (2 entries from S1 Eps 3-5)
- Thought Virus first contact (Outbreak #1's emergency Codex entry)
- Engineer-built-Inception-Arks (cross-arc revelation)
**Branching:**
- Engineer Ep 2 vote: if player picks LOST option (Negotiate), the Engineer's Bench downstream stories surface a stub-alt-timeline entry
- TD Wave 2 difficulty: if player perfect-clears, an "Engineer's pride" Codex entry unlocks

---

#### Phase 3 — The Decision (Act 1 climax → Act 2 opening — Engineer Eps 5-6 + S1 Eps 6-7)

**Cinematics (canonical order):**
1. **Engineer Ep 5 — The Dispatch** (`holo_agent_zero_dispatched`; minCardWins:10 + dischordia 12) → Engineer vote (Build the Device 👍 canon). **Reply: "Agent Zero has been dispatched"** (player thinks: en route. **Canon: she is already dead, Bayern-7-wearing-her-body is what comes back. Reveal lands in S2 Ep 2.11.**)
2. **S1 Ep 6 — The Source** (deep tunnels; tentacle abducts a Potential; the Source-Kael revealed in his fungal-machine throne) → Hub vote (Plead ❤️ canon)
3. **S1 Ep 7 — The Decision** (Source's 5-option offer; 🙏 OFFERED on sacrifice-10, REJECTED) → Hub vote (Wormhole 💯 canon)
4. **Engineer Ep 6 — Zero Sum Game** (`holo_which_ark`; minCardWins:11) → Engineer vote (Direct Assault on Vortex ❤️ canon — **CATASTROPHIC**). Vortex destroyed; Engineer's mind preserved; **Warlord executes the Engineer.** Note: Vortex is canonically the Human's childhood Mascoteer squadmate (cross-arc payoff to the Human Reveal).
5. **Engineer Ep 7 audio — Last Words at the Bench (Slideshow)** (`holo_deck_remembers`) — input-locked slideshow at the dead Bench; Antiquarian outro: *"He built every door this story walks through. The last one he closed was his own."*

**Hub votes this phase:** 4.
**Game modes activating/progressing:**
- **TCG** — Engineer cards reach apex; Vex-Solène-resurrection card unlocks (Engineer's posthumous return)
- **Tower Defense Wave 4** — defending the Source's lair entrance (narrative: the Source's offspring fight the Potentials AS they descend)
- **Trade Empire** — first major intel-flow when the wormhole is taken; foreign-sector intel begins
- **Apprentice** — if active apprentice is Artisan archetype, Engineer Ep 6 IS their breaking-point trigger (existing stage-3 personal-quest mechanism fires — `deepened` if player aligned with Engineer's pragmatism, `broken` if player overrode)
**Battles/levels:**
- **TD Wave 4** (Source's lair defense — the Potentials hold the tunnels while the wormhole is opened)
- **TCG boss match** against a Source-archetype deck (narrative: the Potentials face the Source's first proxy)
**Album drop:** None this phase (Engineer Last Words Slideshow IS the slideshow surface here).
**Prophecy/revelation/conspiracy:**
- **PROPHECY:** The Source's "an ancient enemy whose shadow yet darkens distant worlds" — the Architect named without naming
- **REVELATION:** Engineer dies (the saga's first major-character death)
- **CONSPIRACY:** "Agent Zero has been dispatched" — the canonical euphemism the player won't decode until S2 Ep 2.11
**Companion moments:**
- Elara on Engineer Ep 6 vote: *"Direct Assault is the path of the council I used to vote against. Someone is always asking us to throw the body at the door. I don't trust 'Agent Zero.' I would slow down."*
- Apprentice (Artisan archetype) breaking-point fires here
- Active apprentice cohort: a graduating apprentice may join the player's crew via the existing `apprenticeToCrew.ts` pipeline as the Engineer's-network recruit
**Codex unlocks:**
- The Engineer Killed (major)
- Vortex was the Human's childhood friend (cross-arc — set up for Human Reveal payoff)
- Vex Solène (posthumous resurrection introduced)
- The wormhole network (foundational)
- The Source's offer + the rejected 🙏 option
**Branching:**
- Engineer Ep 6 vote: player can override with Trace-the-Source (LOST option); the timeline diverges briefly; the Antiquarian's inscription marks the divergence
- Apprentice Artisan archetype breaking-point: deepened/broken affects all subsequent Hub votes' Artisan advisor lines

---

#### Phase 4 — The Wormhole Arrival & The Mousetrap (Act 2 mid — S1 Eps 8-9 + Oracle Eps 1-3 + Hamlet I)

**Cinematics (canonical order):**
1. **S1 Ep 8 — The Arrival** (Potentials step through the wormhole onto the crystal-city planet; old ships locked down) → Hub vote (Establish base 👍 canon)
2. **Album drop: West by God** (slideshow plays — the frontier arrival; sunset on the new planet's edge)
3. **Oracle Ep 1 — The Oracle of Dreams** (`oracle_vision_first_sight`) → Oracle vote (Seek Heirophant's Blessing 👍 canon)
4. **S1 Ep 9 — Illuminated Shadows** (Ivory Pyramid; spectral murals) → Hub vote (Decipher 👍 canon)
5. **Oracle Ep 2 — Heirophant's Blessing** (Heirophant introduced; Ancient Prophecies invoked) → Oracle vote (Invoke Ancient Prophecies ❤️ canon)
6. **Album drop: The Book of Daniel 2:47 (half 1 — Daniel interprets the dream)** (slideshow plays as the Ancient Prophecies are revealed)
7. **🎭 Hamlet I — The Mousetrap** activates inside the Templum Veritus — player attends a ~12-minute theatrical performance with 3 audience-interaction points; the play surfaces the Source-Kael identity revelation
8. **Oracle Ep 3 — Ancient Prophecies** (`oracle_vision_sign_of_destiny`) → Oracle vote (Demonstrate a Sign 👍 canon)

**Hub votes this phase:** 5 (3 Oracle + 2 S1 + Mousetrap audience-interaction × 3 = effectively 8 micro-votes).
**Game modes activating/progressing:**
- **Hamlet Playthrough mode** unlocks (Hamlet I as audience; reused by Hamlet II in Phase 8)
- **TCG** — Heirophant + Oracle cards unlock
- **Tower Defense Wave 5** — defending the Templum Veritus from initial Hierarchy-of-the-Damned scouts (narrative: Shadow Tongue is on its way; the Hierarchy is moving)
- **Apprentice** — if active apprentice is Oracle archetype, Oracle Ep 5's breaking-point candidate is locked-in; player can prepare
- **Apprentice Mechronis Academy** unlocks fully (player chooses an archon-guild path; affects apprentice doctrine bias going forward)
**Battles/levels:**
- **TD Wave 5** (initial Hierarchy scouts — first non-Terminus enemy faction in TD; narrative: the Hierarchy is breaching reality via the broken Advocate seal)
- **TCG** — Oracle-spread divination matches (narrative: the Oracle's spread mechanic IS a TCG match; existing companion-ask-topics surface)
- **Hamlet I — Mousetrap interactive theater** — 3 vote-shape decisions during the performance; each decision affects which Codex entry unlocks
**Album drops:** **West by God** (Ep 8) + **The Book of Daniel 2:47 half 1** (after Oracle Ep 2)
**Prophecy/revelation/conspiracy:**
- **PROPHECY (major):** The Ancient Prophecies of Thaloria locked; the Sign of Destiny celestial event canonized
- **REVELATION (via Hamlet I):** Source = Kael identity foreshadowed (Codex unlocks this entry HERE, before the in-game Ep 1.7 already locked it — Hamlet I retroactively confirms)
- **CONSPIRACY:** The Heirophant is a textualist; Pyor XI's history surfaces (canonical from existing lore-bible)
**Companion moments:**
- Apprentice (Oracle archetype) starts paying close attention to every prophecy beat — personal quest deepens
- Elara: *"I have voted on prophecies before. I never trusted the readers. The Heirophant is a textualist; he will read what is there. Let him."*
- Hamlet I introduces the audience-interaction system that Hamlet II will weaponize
**Codex unlocks:**
- Templum Veritus full canonization (3 entries)
- Heirophant's textualism + the Ancient Prophecies
- Source = Kael (revealed via Hamlet I — major)
- The Mousetrap pattern (the saga's recurring theme of revelation-via-parallel)
- West-by-God-themed entries (frontier metaphor + Inception Ark history)
**Branching:**
- Hamlet I audience interactions: 3 branching options each; combined choices unlock 1 of 4 alternate Codex entries about the Architect's nature
- TD Wave 5 difficulty: perfect clear unlocks a Heirophant-blessing buff for subsequent Tower Defense waves

---

#### Phase 5 — The Sign & The Star Whisperer (Act 3 opening — Oracle Eps 3-4 + S1 Ep 10 + Eyes)

**Cinematics (canonical order):**
1. **Oracle Ep 4 — The Sign of Destiny** (Heirophant publicly declares; Star Whisperer title REJECTED — empty seat preserved for Wraith) → Oracle vote (Public Declaration ❤️ canon, 🔥 Claim Star Whisperer LOST)
2. **Eyes video** (post-`dispatch_F7_final_first_read`) — redaction cascade in Inbox
3. **Album drop: The Age of Privacy** (slideshow plays as redaction bars lift)
4. **S1 Ep 10 — The Artifact** (helmet trap; Assassin volunteers; **Collector freed**) → Hub vote (Wear the helmet 🔥 canon — catastrophic)
5. **Collector's Arena unlocks** — Tier 1 (the Outer Cells) becomes playable

**Hub votes this phase:** 3 (Oracle 1 + S1 1 + Eyes recruit vote).
**Game modes activating/progressing:**
- **Collector's Arena Tier 1** unlocks — player can begin playing the Prisoner-Oracle in TCG-arena combat against Collector clones
- **TCG** — Spy/Insurgency cards unlock from the Eyes redaction cascade
- **Trade Empire** — major intel jump from the redaction reveal; foreign-sector intel ≥ 100
- **Apprentice** — if Ghost archetype is active, Eyes vote IS the breaking-point trigger (the Ghost canonically is the Eyes' mirror)
**Battles/levels:**
- **Collector's Arena Tier 1, Fights 1-5** — TCG matches against Collector clones (each clone = a different existing card-collection theme; narrative: the Prisoner's pre-harvest memories surface one at a time)
- **TCG** — Eyes recruitment match (the Eyes' deck is unlocked as a playable opponent → player faces her surveillance pattern)
**Album drop:** **The Age of Privacy** (after Eyes redaction cascade)
**Prophecy/revelation/conspiracy:**
- **PROPHECY:** Star Whisperer empty seat locked — Wraith's eventual filling foreshadowed
- **CONSPIRACY:** The Eyes was reading the Potentials' mail the whole time
- **REVELATION:** The Collector escaped (saga's biggest mid-game escalation)
**Companion moments:**
- Apprentice (Ghost archetype) breaking-point fires if active
- Active apprentice on Eyes recruit vote: archetype-specific reaction (Watchful/Internal family — quiet acknowledgment; Restless/Questioning family — challenges the recruitment ethics)
**Codex unlocks:**
- The Eyes' surveillance network (major — 3 entries)
- The Collector's helmet trap mechanism
- The Prisoner-Oracle's first Memory Shard (from Arena Tier 1 fight 1)
- Star Whisperer empty seat (set up for Wraith later)
**Branching:**
- Eyes recruit vote: 4 options (Recruit 👍 / Forgive 💯 / Counter-surveil 🔥 / Burn 💯) — winner is recruit 👍 canon; alt outcomes branch the Codex
- Collector's Arena Tier 1: any clone can be approached via Stalk / Ambush / Infiltrate / Confront (mirrors Wolf's Hunt-the-Hero approach choice — system-level consistency)

---

#### Phase 6 — The City + Two Oracles Revealed (Act 3 mid — S1 Eps 11-13 + Oracle Eps 4-5 + Hamlet I echo)

**Cinematics (canonical order):**
1. **S1 Ep 11 — The City** (9th Neon collapses the tunnel; Crystal City; green-skinned humanoids; Oracle introduced) → Hub vote (Flee 💯 canon)
2. **S1 Ep 12 — The Return** (Oracle's prophet → Jailer → escapee backstory) → Hub vote (Trust 💯 canon)
3. **S1 Ep 13 — Wyrmwood** (the wormhole question; Templum Veritus inner sanctum; barriers shatter — Armageddon approaches) → Hub vote (Ask 👍 canon)
4. ***Thought Virus Outbreak #3*** fires across all 5 modes (severe)
5. **Oracle Ep 5 — The Star Whisperer** (`oracle_vision_question_legitimacy`) → Oracle vote (Question Legitimacy ❤️ canon — Collector exposed)

**Hub votes this phase:** 4 (3 S1 + 1 Oracle) + Outbreak #3's emergency vote.
**Game modes activating/progressing:**
- **Collector's Arena Tier 2** unlocks (the Recursive Chamber — clones of the Prisoner-Oracle's own past selves)
- **TCG** — Hierophant + Oracle's-Story cards unlock; the Crystal City's six districts surface as cardsets
- **Tower Defense Wave 6-7** — defending the Crystal City from Hierarchy breach (narrative: the Wyrmwood barrier-shatter means the Templum Veritus's vaccination is failing)
- **Apprentice Mechronis Academy** — players who chose Necromancer-archon-guild may run Akai Shi side-content here
**Battles/levels:**
- **TD Waves 6-7** (Hierarchy breach defense — first Hierarchy-lord-tier enemies appear; narrative: this is the Hierarchy's first sustained assault on the Templum)
- **Collector's Arena Tier 2, Fights 1-5** (the Prisoner-Oracle fights his own past selves — each fight unlocks a Memory Shard from his pre-harvest life)
- **TCG** — Oracle's-Spread divination matches surface the Star Whisperer vote outcome
**Album drop:** None (slideshow drop spacing intentionally rests this phase).
**Prophecy/revelation/conspiracy:**
- **REVELATION (major):** The Oracle WAS a prophet → was harvested by the Collector → became the Jailer → escaped via wormhole. **This is the Prisoner's exact pattern in retrograde.** The Codex unlocks the "Two Oracles, One Pattern" entry — the Season-1-Oracle and the Prisoner are PARALLEL trajectories. Hamlet I's Mousetrap revelation pays off here: the player sees the Oracle's backstory and recognizes it.
- **CONSPIRACY:** The Hierarchy is using the broken Advocate seal to breach (Wyrmwood reveals the seal is gone)
- **PROPHECY:** The Wyrmwood barrier was 10,000 years old; the Oracle's harmonic-frequency network is failing
**Companion moments:**
- Apprentice on S1 Ep 12 Trust vote: archetype-specific (Zealous/Devoted family — co-signs Trust as a faith-test; Watchful/Internal — counsels caution)
- Elara on S1 Ep 13 Ask vote: *"Asking the question is what the senatorial chamber does. The Heirophant kept the answer. You ask. You learn. Sometimes the learning is the punishment."*
**Codex unlocks:**
- Two Oracles One Pattern (major cross-arc lock)
- The Oracle's backstory (5 entries)
- The Crystal City's six districts (foreshadowing the Six)
- 9th Neon canon (the elemental-wielder Potential introduced)
- Outbreak #3's casualties (cross-mode)
**Branching:**
- Outbreak #3 emergency vote: 4 options affect subsequent mode states
- S1 Ep 11 Flee vote: alt-outcome (make a stand) costs the 9th Neon's life prematurely — bad-ending branch

---

#### Phase 7 — The Shadow Tongue + The Prisoner Surfaces (Act 4 — Oracle Ep 6 + Prisoner + S1 Eps 14-16 + Hamlet I echo + Wolf unlock)

**Cinematics (canonical order):**
1. **S1 Ep 14 — The Hunt** (hunt the Collector outside the city) → Hub vote (Hunt 🔥 canon)
2. **S1 Ep 15 — The Beginning of the End** (Host arrives; 9th Neon amplifies; harmonic weapon to Oracle) → Hub vote (Give to Oracle ❤️ canon)
3. **Prisoner video (Act 4 opener)** — `act4_prisoner_intro_triggered`
4. **Oracle Ep 5 retroactive recognition** (player recognizes the Prisoner as the harvested Oracle of Ep 5)
5. **Oracle Ep 6 — Shadow Tongue (5-option vote)** (`oracle_vision_public_debate`) → Oracle vote (Public Debate 💯 canon; **🙏 OFFERED & REJECTED**) → **Shadow Tongue SUMMONED into the universe** → **Crucible begins corrupting**
6. ***Thought Virus Outbreak #4*** fires across all modes (Hierarchy-flavored; Crucible status changes — the corrupted Servant Heroes start showing up in Wolf's Hunt-the-Hero dossiers)
7. **Oracle Ep 7 audio — Last Words in the Cell (Slideshow)** (`prisoner_remembers_being_the_oracle`) — input-locked slideshow; Antiquarian outro: *"He read every prophecy ours would write. The last one he could not read was his own name."*
8. **S1 Ep 16 — Memento Dischordia (Season 1 finale)** → Hub vote (Side-Choice: Architect / Hierarchy / Source / Independence — winner deferred to S2 Ep 2.1; canonically Independence 👍)
9. **Album drop: Silence in Heaven (first half)** (slideshow plays at the cliffhanger — the gods fall silent as the choice opens)

**Hub votes this phase:** 5 (S1 3 + Oracle 1 + Side-Choice cliffhanger).
**Game modes activating/progressing:**
- **Wolf (Lycos) companion unlocks** if Codex completion ≥ 50%
- **Hunt-the-Hero minigame opens** (player begins hunting corrupted Servant Heroes inside the Crucible)
- **Collector's Arena Tier 2** continues (Oracle Ep 5 retroactive unlock expands Memory Shard pool)
- **Tower Defense Wave 8-9** — final pre-finale waves; defending against Hierarchy + Crucible-leaked corrupted Servant Heroes
- **Apprentice** — if Oracle archetype active, Oracle Ep 5 IS their breaking-point (already foreshadowed in Phase 4)
**Battles/levels:**
- **TD Waves 8-9** (Hierarchy + corrupted Servant Hero combined assault; narrative: Crucible is leaking; the Antiquarian doesn't know yet)
- **Hunt-the-Hero, hunts 1-3** (Wolf's first three corrupted-Servant-Hero hunts — tutorial-level; reuse TCG cards as targets)
- **TCG** — Shadow Tongue card revealed as a high-rarity card; Hierarchy lords' cards unlock
- **Hamlet I echo** — short reprise inside the Templum Veritus during S1 Ep 14; the player retroactively sees the parallel between Hamlet's "uncle killed my father" and the Architect's role in the Source's history
**Album drops:** **Silence in Heaven (first half)** at Ep 1.16
**Prophecy/revelation/conspiracy:**
- **REVELATION (major):** The Prisoner is the Oracle of Eps 11-12 — Two Oracles One Pattern is mechanically confirmed
- **REVELATION (saga-keystone):** Shadow Tongue summoned into the universe by the Collector's impersonation (canonical naming-is-summoning event)
- **CONSPIRACY (major):** The Crucible begins corrupting under Hierarchy pressure; the Antiquarian's bet is unknowingly failing
- **PROPHECY:** Side-Choice's 4-way framing names the saga's four ultimate factions explicitly
**Companion moments:**
- Wolf joins the player's companion roster (post-cliffhanger; Survivor seat opens)
- Apprentice (Oracle archetype) breaking-point fires
- Active apprentice on Oracle Ep 6 vote: 12 distinct archetype reactions (the saga's first "every archetype has a unique line" Hub moment)
**Codex unlocks:**
- Shadow Tongue summoning (saga keystone — major)
- Prisoner = Oracle confirmation
- The 9th Neon's harmonic-amplification sacrifice (the Neon survives this phase but is canonically marked for later death)
- Wolf's pre-corruption (Lycos) backstory — first 3 entries via Wolf's introduction
**Branching:**
- Side-Choice cliffhanger: technically 4 options; canonically Independence wins via S2 Ep 2.1 cold-open; player vote here is recorded but not yet resolved
- Wolf unlock condition: Codex ≥ 50% triggers his arrival; lower-Codex players unlock him after S2 Ep 2.1 instead (later but inevitable)

---

#### Phase 8 — The Theft + The Heart of Time Crew (Act 5 opening — S2 Eps 2.1-2.4 + CADES M1-M5)

**Cinematics (canonical order):**
1. **S2 Ep 2.1 — Theft of All Time** (Politician's 97th re-election broadcast → theft cinematic → Heart-of-Time bridge welcome) → **Side-Choice resolves canonically to Independence 👍** → Nexus-event-anchor vote opens
2. **S2 Ep 2.2 — Syndicated** (Watcher's perspective; arrival on quarantined New Babylon) → 7-option vote (Spy 👍 canon)
3. **Album drop: West by God** (slideshow plays as the Potentials arrive on New Babylon — second frontier)
4. **S2 Ep 2.3 — First Contact** (Six confront the Potentials) → Hub vote (Deception 💯 canon)
5. **S2 Ep 2.4 — Empire Reborn** (six-district walk; Hierophant Wraith introduced) → Hub vote (Intelligence 💯 canon)

**Hub votes this phase:** 4.
**Game modes activating/progressing:**
- **CADES FPS M1-M5** become playable (Acts 4-5 staging missions); player runs the FPS campaign for the first time
- **TCG** — New Babylon faction cards unlock; the Six's twin-pair cards revealed
- **Trade Empire** — major intel sweep on the Six; foreign-sector intel pushes past mid-tier
- **Hunt-the-Hero** — Wolf hunts continue; corrupted-Servant-Hero pool grows
- **Apprentice** — apprentice trial cohorts have rotated since Phase 7; new active apprentice may have different archetype than the Phase-7 active
**Battles/levels:**
- **CADES M1-M5** (FPS combat missions tied to S2 Eps 2.2-2.4's narrative: the Potentials' spies' infiltration → first-contact violence → empire-reborn demonstrations of force; **each mission's narrative justification = a specific S2 episode beat**)
  - M1: Sundown Bazaar infiltration (S2 Ep 2.2 Spy path)
  - M2: Resistance-cell defense (S2 Ep 2.3 setup)
  - M3: Imperial Congress approach (S2 Ep 2.3 mid)
  - M4: Six-district demonstration (S2 Ep 2.4 setup)
  - M5: Authority Chamber siege (S2 Ep 2.4 climax)
- **TCG** — Authority-faction matches; player's deck adapts to the new Empire opponents
- **Hunt-the-Hero, hunts 4-6** (Wolf escalates; corrupted-Servant-Hero dossier-pool expands)
**Album drop:** **West by God** (S2 Ep 2.2)
**Prophecy/revelation/conspiracy:**
- **REVELATION:** The Politician's 97th re-election locks the post-Fall Empire state
- **CONSPIRACY:** The Six are immortal twins; the Syndicate of Death begins to surface
- **PROPHECY:** Hierophant Wraith introduced — the Star Whisperer empty seat from Oracle Ep 4 starts paying off
**Companion moments:**
- Wolf joins Hub advisor stack — Survivor seat surfaces in Hub votes (fatalist-Quarchon advice register)
- Elara: *"I have voted in many empires. The Politician's pattern is the one I recognize most. I do not trust my recognition."*
- Active apprentice may have archon-guild-doctrine bias if Mechronis Academy was completed; their advice subtly aligns with their archon
**Codex unlocks:**
- The Politician's Dept. of Government Efficiency origin
- The Six's six-districts canonization (6 entries, one per district)
- Hierophant Wraith's Thalorian-Resistance leadership
- The Heart-of-Time crew aboard
- 9th Neon survives the Season 1 finale (Codex retroactively confirms)
**Branching:**
- S2 Ep 2.2's 7-option vote is the saga's widest single ballot; non-canon paths each have a branching Codex entry
- CADES M1-M5: difficulty branches; perfect-clears unlock alt-Codex entries about each mission's casualties

---

#### Phase 9 — The Authority Hack + The Prisoner's Hamlet (Act 5 climax → Act 6 opening — S2 Eps 2.5-2.7 + Hamlet II + CADES M6)

**Cinematics (canonical order):**
1. **S2 Ep 2.5 — The Authority** (Six confrontation; 5-option vote) → Hub vote (Hack the Authority 💯 canon)
2. **S2 Ep 2.6 — Hacking Reality** (Matrix of Dreams; 6-founder release; 🙏 OFFERED ×2 REJECTED on Tenebrous + Null) → Hub vote (Free Samsara 🔥 canon)
3. ***Thought Virus Outbreak #5*** fires across all modes (Authority-flavored; Collector's Arena Tier 3 unlocks)
4. **🎭 Hamlet II — The Prisoner's Hamlet (interactive)** activates inside the Matrix of Dreams — player PLAYS as the Prisoner-Hamlet through 5 acts; the "To be or not to be" choice = canonical `prisoner_oracle_identity_reveal` Hub vote
5. **S2 Ep 2.7 — Samsara Rising** (Samsara takes back his district; Civil War begins) → Hub vote (Embrace 🔥 canon)
6. **CADES M6 — Alliance of Adversaries** (`cades_m6_complete`) — **Agent Zero recruited** (player thinks she's the real one; canonically Bayern-7-wearing-her-body — reveal lands in Phase 11)

**Hub votes this phase:** 4 + Outbreak #5's emergency + Hamlet II's interactive votes (5 mini-votes for each Hamlet act).
**Game modes activating/progressing:**
- **Hamlet Playthrough Mode (Hamlet II — Interactive)** unlocks — major game mode; ~45 minute interactive theater traversal
- **Collector's Arena Tier 3** unlocks (Matrix Surface — Authority-merged clones)
- **CADES FPS M6** plays — Agent Zero recruitment cinematic (Phase 11 retroactively reveals the truth)
- **TCG** — Matrix-of-Dreams card pack unlocks; the six founders become playable opponents
- **Trade Empire** — Civil War shifts intel routes; intel becomes faction-aligned
- **Hunt-the-Hero** — Wolf reaches mid-game; if `wolfCorruption` ≥ 75, the Collector secretly appears in his hunts
**Battles/levels:**
- **Hamlet II — Interactive 5-act traversal** (each act = a Hub-vote-shape interaction point; the duel scene = a TCG match; the grave-digger scene = an Akai Shi side-content callback; "to be or not to be" = canon-locked Hub vote)
- **CADES M6 — Alliance of Adversaries** (FPS combat for Agent Zero recruitment)
- **Collector's Arena Tier 3, Fights 1-5** (Matrix-Authority-merged clones; cross-faction TCG)
- **TCG** — Six-founders matches (each founder = a different deck archetype)
**Album drop:** None directly this phase (Hamlet II IS the major theatrical content)
**Prophecy/revelation/conspiracy:**
- **REVELATION (saga-keystone, via Hamlet II):** Prisoner = Oracle is mechanically locked-in via the "to be or not to be" vote
- **CONSPIRACY:** The Authority is a lie on top of Matrix of Dreams (Ep 2.6 explicit)
- **CONSPIRACY:** Bayern-7-is-Agent-Zero (the player THINKS she's the real one; canonical retroactive reveal in Phase 11)
- **PROPHECY:** Samsara's "I sieze his district, no escape from fate" — the Civil War's inevitability
**Companion moments:**
- Wolf advises every Hub vote with fatalist-Quarchon probability-tree register
- Apprentice on Ep 2.6 vote: 12 distinct archetype reactions (saga's second "every archetype unique line" moment)
- The Prisoner-Hamlet's "to be or not to be" = the saga's most intimate moment of the player BECOMING a character
**Codex unlocks:**
- The Six immortal-twins canon (major)
- Samsara released (Civil War cause)
- The Matrix of Dreams = the Panopticon = the Collector's Arena nested-location lock
- The Prisoner's identity confirmed (via Hamlet II — major)
- Bayern-7-is-Agent-Zero foreshadowing (subtle Codex entry; reads as suspicious in hindsight)
**Branching:**
- S2 Ep 2.6 vote: 6 founder options (winner Samsara 🔥 canon); 5 non-canon paths each have alt-Codex entries
- Hamlet II's "to be or not to be" vote: canon is "remember"; alt path branches a fragmentary Prisoner arc
- CADES M6: hard-difficulty completion unlocks an early breadcrumb about the Bayern-7 connection (the player can suspect early)

---

#### Phase 10 — Civil War + CoNexus Awakens (Act 6 mid → Act 6 late — S2 Eps 2.8-2.10 + CADES M7 + TD Wave 10)

**Cinematics (canonical order):**
1. **S2 Ep 2.8 — The Haven** (4-haven choice; civil war rages) → Hub vote (Sundown Bazaar 👍 canon)
2. **S2 Ep 2.9 — CoNexus Awakens** (CoNexus diegetically introduced as the in-saga voting tool; **the Hub IS CoNexus, locked**) → consultative meta-vote (no marker)
3. **S2 Ep 2.10 — The Politician's Reign** (5-path memory vote) → Hub vote (The Art of War 💯 canon)
4. **CADES M7 — Last Stand on Veridian VI** (`cades_m7_complete`) — **Iron Lion dies** (mandatory-death cinematic); **canonically Agent Zero ALSO dies here — but the player doesn't yet know**
5. **Tower Defense Wave 10 first-complete** (`terminus_swarm_wave_10_first_complete`) — **Terminus Swarm cinematic** — **Source = Kael keystone reveal** → **Kael Fragment unlocked**
6. **Album drop: The Book of Daniel 2:47 (half 2 — the kingdoms fall)** (slideshow expands during Wave 10 — the prophecy fulfilled)
7. ***Thought Virus Outbreak #6*** fires across all modes (remembrance outbreak; Iron Lion's broadcast pattern surfaces in TCG)

**Hub votes this phase:** 3 + Outbreak #6's emergency.
**Game modes activating/progressing:**
- **Tower Defense Wave 10 unlocks** — the canonical TD endgame cinematic; Kael Fragment unlocks all subsequent Kael-related content
- **CADES FPS M7** plays — Iron Lion's last stand; saga's most violent FPS sequence
- **Trade Empire intel ≥ 200** crosses threshold — Eyes Music Video unlocks (next phase)
- **Hunt-the-Hero** — Wolf reaches late-game; Tier 4 of Collector's Arena (Wolf's Mirror) unlocks
- **Apprentice** — late-game apprentice cohorts; Memory Cards from fallen apprentices begin to compile
**Battles/levels:**
- **TD Wave 10** (the cosmic-scale Terminus Swarm assault; narrative: this is the Source-Kael's offspring reaching cosmic scale)
- **CADES M7** (FPS — Iron Lion's last stand; Bayern-7 appears in this mission; canonical Agent Zero death happens here off-screen)
- **TCG** — Iron Lion legacy match (Iron Lion's deck becomes available as a heritage cardset)
- **Collector's Arena Tier 4** (Wolf's Mirror — Collector wearing Wolf's mask)
**Album drop:** **The Book of Daniel 2:47 (half 2)** at TD Wave 10
**Prophecy/revelation/conspiracy:**
- **REVELATION (saga-keystone):** Source = Kael — fully locked via Wave 10's Kael Fragment unlock + the Antiquarian's voice-over confirming the lineage
- **REVELATION:** Iron Lion dies; the saga's second major-character on-screen death
- **CONSPIRACY:** The Politician is from Dept. of Government Efficiency (Ep 2.10 explicit)
- **PROPHECY:** Daniel 2:47's kingdoms-fall prophecy mapped onto the Empire's structure ("the stone uncut by hands" = the Wolf's quiet kills inside the Crucible)
**Companion moments:**
- Wolf's advice on the Politician's Reign vote: *"Art of War. I have studied it. There are seven branches of war in my Quarchon training. Five of them lead here. Two of them lead nowhere. Vote 'Art of War.'"*
- Active apprentice on S2 Ep 2.10's 5-path memory vote: 12 distinct archetype reactions (saga's third "every archetype unique line" moment — and the last one before the saga's biggest reveal in Phase 11)
**Codex unlocks:**
- Source = Kael locked (major saga-keystone)
- Kael Fragment + the "I have been waiting since I was nine" Observation Deck moment
- Iron Lion's death + broadcast-going-silent canon
- The Politician's Dept. of Government Efficiency
- Daniel 2:47 prophecy mapped to canon
**Branching:**
- TD Wave 10: hard-mode completion unlocks an additional Kael Fragment shard (pre-corruption Kael's memory)
- CADES M7: a perceptive-player route reveals Bayern-7 in the mission (early breadcrumb to Phase 11 reveal)
- S2 Ep 2.10's 5-path vote: 4 alt paths branch the next episode's tone

---

#### Phase 11 — The Agent Zero Reveal (Act 7 early — S2 Ep 2.11 — the saga's most emotionally weighted Hub moment)

**Cinematics (canonical order):**
1. **S2 Ep 2.11 — I Love War** — **AGENT ZERO DEATH REVEAL** (Bayern-7 wore her body all along; yellow jacket = the Warlord-in-AZ-body; Engineer's "dispatched" was always already a euphemism) → 5-path memory vote (Heart 💯 canon — secrets of time)
2. **Collector's Arena Tier 5 unlocks** — the Yellow Jacket Arena (Collector wearing Bayern-7-as-Agent-Zero's body — the saga's most loaded Arena encounter)

**Hub votes this phase:** 1 (high-stakes 5-path).
**Game modes activating/progressing:**
- **Collector's Arena Tier 5** unlocks — final-form Arena content
- **Hunt-the-Hero** — Wolf reaches breakpoint; if `wolfCorruption` ≥ 90, the Wolf himself becomes a hunted target (recursive narrative kicks in)
- **TCG** — Yellow-Jacket-themed cards retroactively re-read; the player now sees the Warlord-Agent-Zero pattern in cards they've been playing
- **Trade Empire** — Veridian Prime intel surfaces "Agent Zero KIA" buried files
**Battles/levels:**
- **Collector's Arena Tier 5, Fights 1-5** (Yellow Jacket Arena — the saga's most psychologically loaded Arena content; each fight = a Memory Shard naming a piece of the canonical Agent Zero death; final fight = the Collector wearing Bayern-7-Agent-Zero's body)
- **TCG** — Bayern-7 boss match (the Warlord's decentralized-war embodiment as a TCG opponent)
- **Hunt-the-Hero** — Wolf's late-game hunts have Bayern-7-flavored corrupted-Servant-Hero variants
**Album drop:** None (Ep 2.11's narrative weight stands alone; album slideshow would dilute)
**Prophecy/revelation/conspiracy:**
- **REVELATION (saga's HIGHEST-PAYOFF moment):** Agent Zero died on Veridian Prime during CADES M7; the M6 recruit was Bayern-7-as-Agent-Zero. **The player retroactively realizes they've been working with the Warlord since the recruitment.**
- **CONSPIRACY:** Engineer's Ep 5 "Agent Zero has been dispatched" line was always already a euphemism
- **NOTE:** Engineer's exact circumstances of death remain unspecified (user lock)
**Companion moments (the saga's most-authored single Hub moment):**
- **Elara:** senatorial outrage. *"I have voted on body-swap protocols before. We outlawed them in the third senatorial cycle. The Empire did them anyway. The Warlord copied himself into our recruit. We have been working with the Warlord. I am sorry."*
- **Human:** noir-detective bitter callback. *"I told you to read the kind paragraphs hard. 'Agent Zero has been dispatched' — I said that's a euphemism. I said it twice. I did not push it. I am the man who failed to push the read."*
- **Wolf (Survivor seat):** *"I have seen this in three adjacent worlds. Bayern-7 wears the body of the killer he can't quite kill. The probability tree convergences here. I have already mourned the Agent Zero you mourn now. Mourn well."*
- **Active Apprentice (12 distinct archetype reactions):** 12 fully unique authored lines — the saga's most-authored single Hub moment per the user's earlier full-distinctness lock.
  - Zealot: doctrinal grief
  - Ghost: shadowed witness
  - Scholar: citation-heavy (cross-references Engineer Ep 5)
  - Revenant: indebted parallel
  - Artisan: hands-and-tools tribute
  - Oracle: prophecy-fulfillment register
  - Wanderer: lateral disengagement
  - Martyr: cost accounting
  - Heretic: contrarian challenge of the very category
  - Jester: humor-armor cracking
  - Sentinel: protective failure
  - Prodigal: returned-but-too-late grief
**Codex unlocks:**
- Agent Zero death (saga keystone — major)
- Bayern-7-is-Agent-Zero retroactive canon
- The yellow-jacket motif locked across all surfaces
- Engineer's dispatch-euphemism (cross-arc retroactive lock)
**Branching:**
- The 5-path memory vote: canon Heart 💯 → Ep 2.12; alt paths (World / Tribe / Trial / Funeral) each branch a fragmentary side-canon entry
- Wolf corruption ≥ 90 here triggers his recursive-hunt-target narrative; the player faces a moral choice in Wolf's questline

---

#### Phase 12 — The Heist + The Time Crew (Act 7 mid — S2 Ep 2.12 + side-content questlines)

**Cinematics (canonical order):**
1. **S2 Ep 2.12 — Baron and the Heart of Time** (backstory; Project Vector; Heart-of-Time origin; the Baron recruited via the Advocate's Hierarchy bargain) → Hub vote (Heist Team Assembly 💯 canon — all 4 recruited)

**Hub votes this phase:** 1.
**Game modes activating/progressing:**
- **Akai Shi questline (Necromancer's Lair)** reaches its climax (player completes Hamatora descent; first-wave-detective backstory locked)
- **Wraith Calder questline (Syndicate of Death)** reaches its climax (player completes the six-twin revenge arc; Wraith's first-wave-hero backstory locked)
- **Hunt-the-Hero (Wolf)** reaches its final pre-finale stage; if `wolfCorruption` ≤ 60, Wolf can spare the final corrupted hero (alternate ending branch)
- **TCG** — Heart-of-Time-crew cards (Satoshi, Doctor, etc.) unlock
- **Trade Empire intel ≥ 200 + dispatch_F7_revealed** → **Eyes Music Video** unlocks (concurrent with this phase or just after)
**Battles/levels:**
- **Akai Shi questline final battle** (Necromancer's secret laboratory; TCG-arena combat against Akai-Shi-adjacent enemies)
- **Wraith Calder questline final battle** (the sixth and final twin of the Syndicate of Death)
- **Hunt-the-Hero penultimate hunt** (Wolf's named final corrupted-hero target)
- **TCG** — Baron's casino-in-space match (high-rarity match against the Baron's deck)
**Album drop:** **Eyes Music Video** (separate cinematic, not slideshow) — Trade Empire dossier-compile surface; Antiquarian closes the dossier
**Prophecy/revelation/conspiracy:**
- **PROPHECY (saga-defining):** Ingersoll Lockwood's 1893 Baron Trump prophecy locked — the saga's recursive-prophecy structure formally canonized
- **REVELATION:** Project Vector = the thought-virus-engineering origin; the Architect built it on the prison planet
- **CONSPIRACY:** The Baron is the son of the "King of Earth"; Earth's kings became gods
**Companion moments:**
- Wolf nears his own breaking point; his advice on the heist team vote shifts based on his corruption value
- Akai Shi joins the player's roster (Survivor seat alternative — player can swap between Wolf and Akai Shi in the Hub Survivor chair)
- Wraith Calder joins the player's roster (third Survivor option)
**Codex unlocks:**
- Project Vector origin (major)
- The Baron's identity + Ingersoll Lockwood prophecy
- All three Survivor companions now fully unlocked (Wolf + Akai Shi + Wraith Calder)
- First Wave Codex completion likely ≥ 75% here — Servant Hero Academy extra mission unlocks
**Branching:**
- Akai Shi questline: dark/light ending depending on player's Hub-vote alignment with Necromancer-archon-guild path
- Wraith Calder questline: full-revenge vs partial-mercy ending branches
- Wolf's corruption-track ending: spare-final-target vs kill-final-target affects Servant Hero Academy launch state

---

#### Phase 13 — The Truth + The Catastrophe (Act 7 late → Act 7 climax — S2 Eps 2.13-2.14 + Hamlet III tease)

**Cinematics (canonical order):**
1. **S2 Ep 2.13 — Truth and Consequences** (4-path reveal vote) → Hub vote (Painter's resurrection 💯 canon — the Painter was resurrected by the Architect and killed again for "painting peace")
2. **Servant Hero Academy teaser** (Lions International Convention Orlando hub introduced)
3. **S2 Ep 2.14 — A Question of Endings** — **THE CATASTROPHIC VOTE: War / Peace / Time / Sacrifice** → canonical **War 🔥**; **the Inventor dies; the Judge dies; the nanobot plague consumes reality**
4. **Album drop: Silence in Heaven (second half — full divine absence)** at the catastrophic War-vote
5. **Loop closure transition** — Ep 2.14's cinematic ends with the nanobot plague consuming reality, transitioning seamlessly to the Inception Ark cold-open (Ep 1.1) — but with a "post-loop-closure" variant where the Antiquarian's voice has a knowing addition: *"You have read this recording before. So have I. Let us see if this time it is different."*
6. ***Thought Virus Outbreak #7 — Apocalyptic / saga-ending*** fires across all modes simultaneously — the nanobot plague IS the terminal mutation of the thought virus

**Hub votes this phase:** 2 (the highest-stakes ones in the saga).
**Game modes activating/progressing:**
- **All game modes get a "final state" snapshot** — TCG deck snapshot, Tower Defense final wave, Trade Empire intel max, Collector's Arena Tier 5 must be cleared, Hunt-the-Hero final hunt complete
- **Servant Hero Academy onboarding cinematic** plays after Ep 2.14 resolves
**Battles/levels:**
- **Final TD Wave (Wave 11+)** — the nanobot plague's first reality-consumption wave (narrative: this is the Fall happening in real time)
- **Collector's Arena Tier 5 final fight** — the Collector wearing Bayern-7-Agent-Zero-as-the-Inventor's-body (the saga's most loaded encounter — the Collector has absorbed all three of the saga's major-character bodies)
- **TCG final match** — against an "Architect" boss deck (the player faces the Architect's pattern in TCG form; canon: Architect cannot be defeated in TCG, but the player can survive)
- **Hunt-the-Hero final hunt** — the Wolf's last target; if the player has been on the Wolf's mercy-arc, the final target reveals themselves as Lycos's pre-resurrection mentor (heart-rending side-canon)
**Album drop:** **Silence in Heaven (second half)** at Ep 2.14 — the divine absence is complete
**Prophecy/revelation/conspiracy:**
- **REVELATION (saga's central thesis):** **The Potentials' War-Choice IS the Fall of Reality the Antiquarian narrates in Ep 1.1.** The loop closes. The first wave was always us. We were always them. There is no "they."
- **CONSPIRACY:** The Inventor and the Judge die; the Painter's resurrection was a setup for a second death
- **PROPHECY:** The Codex's 100% completion entry triggers HERE — *"The second wave read what the first wave wrote. The second wave did not write the same thing back."*
**Companion moments:**
- All advisor stack reacts to the catastrophic War vote — the longest authored single moment in the saga (Elara + Human + Active Apprentice 12-archetype + Wolf/Akai Shi/Wraith Calder Survivor seat = 4 × ~12 = ~48 distinct reactions to Ep 2.14)
- Apprentice cohort: every active apprentice in the player's cohort gets a personal-quest stage-3 resolution at this moment
**Codex unlocks:**
- Loop closure locked (saga keystone — final)
- The Inventor's death + The Judge's death
- The Painter resurrected + killed again
- Servant Hero Academy era pre-introduction
- First Wave Codex 100% (if all prior systems explored) → alternate Antiquarian inscription triggers
**Branching:**
- The catastrophic War vote: 4 options (War 🔥 canon; Peace ❤️ + Time 💯 + Sacrifice 🙏 are alt-canon paths). **Non-canon paths trigger ALTERNATE saga endings:**
  - **War (canon):** Loop closes; Servant Hero Academy pivots the franchise
  - **Peace (alt):** The Potentials negotiate with the Architect; partial reality preserved; Antiquarian closes the chronicle differently (alternate ending #1)
  - **Time (alt):** The Heart-of-Time is used to nudge the loop further back; the player gets a glimpse of a "third wave" (alternate ending #2)
  - **Sacrifice 🙏 (alt — saga's only time 🙏 wins):** One of the Potentials sacrifices themselves to break the loop personally; mortality > catastrophe (alternate ending #3 — the saga's bittersweet best ending)
- If `wolfCorruption` ≥ 100 at this point, the Wolf himself fights as a final boss (the recursive-narrative cost — the Wolf became what he hunted)

---

#### Phase 14 — The Pivot + Hamlet III (post-Ep 2.14 — Servant Hero Academy onboarding + final authored content)

**Cinematics (canonical order):**
1. **Servant Hero Academy onboarding cinematic** (Lions International Convention Orlando — the genre pivot)
2. **🎭 Hamlet III — The Rest Is Silence (author)** — final single-screen player-authored content; player writes the closing line that becomes the Antiquarian's permanent final Codex entry
3. **Post-credits Codex completion screen** — surfaces the Codex's full unlock state; the player sees how much of the first wave they reconstructed

**Hub votes this phase:** 0 (the saga's voting is done; the Academy onboarding is a different surface).
**Game modes activating/progressing:**
- **Servant Hero Academy game mode** opens — the post-saga franchise pivot; service missions replace combat missions
- **Endgame Hub mode** preserved (player can revisit any earlier vote in the Hub's past-result archive; replay value)
- **Opt-out toggle** — players who don't want the genre pivot can choose "continue in the Age of War as endgame mode" (preserves TCG / CADES / Tower Defense / Trade Empire combat surfaces)
**Battles/levels:**
- **Servant Hero Academy first mission** — interactive narrative; non-combat; player chooses a "real-world service" act (donate to Lions, volunteer hours logged, etc.) — the cross-real-world layer the user mentioned
- **No combat in this phase** — the franchise pivot is the point
**Album drop:** None (the saga is closing; albums have done their work)
**Prophecy/revelation/conspiracy:**
- **The saga's final answer (REVELATION):** the second wave can choose differently next loop. The Servant Hero Academy is the Antiquarian's offer to break the war-narrative pattern. Whether the player accepts is the saga's only personal choice.
- **Hamlet III's player-authored line** becomes the canonical Antiquarian's-final-Codex-entry — preserved permanently per-player
**Companion moments:**
- All advisor stack present for one final-summary line each
- Active apprentice graduates one last time (if they survived to this point)
- The Wolf, Akai Shi, Wraith Calder each speak a final-summary line; Lycos's ghost is the final voice heard
**Codex unlocks:**
- Servant Hero Academy era opening
- Hamlet III's player-authored line (per-player canonical)
- First Wave Codex final state (player-specific completion %)
**Branching:**
- Hamlet III's player-authored line is infinitely varied; this is the saga's ONLY UGC content
- Endgame mode opt-out preserves the war-narrative for players who don't want the pivot

---

### 15.6 — Battle/level narrative justification matrix (every fight has a reason)

| Battle/level | Mode | Phase | Narrative reason |
|---|---|---|---|
| TCG tutorial match (Phase 1) | TCG | 1 | Practice deck = the Inception Ark's preserved equipment; first opponent = an organic-satellite-themed AI testing the Ark's defensive grid |
| TD Wave 1 | TD | 2 | Organic-asteroid bombardment from S1 Ep 3's spore-shower battle made playable |
| TD Wave 2 | TD | 2 | Spore-infected outer-Ark defense; Outbreak #1 introduces virus-typed enemies |
| TD Wave 3 | TD | 2 | Bug-swarm emergence from S1 Ep 5's ravenous monstrosities |
| TD Wave 4 | TD | 3 | Source's-lair defense — the Potentials hold the tunnels while the wormhole is opened |
| TCG Source-boss match | TCG | 3 | Player faces the Source's first proxy; narrative: testing against Kael's offspring |
| TD Wave 5 | TD | 4 | Initial Hierarchy scouts breach the Templum Veritus; narrative: Shadow Tongue is on its way |
| Oracle-spread TCG matches | TCG | 4 | The Oracle's spread mechanic IS a TCG match (existing `companionAskTopics.ts` surface) |
| TD Waves 6-7 | TD | 6 | Hierarchy breach defense; Wyrmwood barrier shatter = Templum Veritus vaccination failing |
| Collector's Arena Tier 1 (5 fights) | Arena | 5 | Outer Cells — Collector's lesser clones; Prisoner-Oracle's pre-harvest memories surface one at a time |
| Collector's Arena Tier 2 (5 fights) | Arena | 6 | Recursive Chamber — clones of the Prisoner-Oracle's own past selves |
| TD Waves 8-9 | TD | 7 | Hierarchy + corrupted Servant Hero combined assault; Crucible is leaking |
| Hunt-the-Hero hunts 1-3 | Wolf-hunt | 7 | Wolf's first three corrupted-Servant-Hero hunts — tutorial-level |
| CADES M1-M5 | CADES | 8 | Each mission's narrative = a specific S2 Ep 2.2-2.4 beat |
| Hunt-the-Hero hunts 4-6 | Wolf-hunt | 8 | Wolf escalates; corrupted-Servant-Hero dossier-pool expands |
| Hamlet II interactive 5-act traversal | Hamlet | 9 | Player BECOMES the Prisoner-Hamlet; each act surfaces a Hub-vote-level revelation |
| Collector's Arena Tier 3 (5 fights) | Arena | 9 | Matrix Surface — Authority-merged clones; cross-faction TCG |
| CADES M6 | CADES | 9 | Alliance of Adversaries — Agent Zero recruitment (canonically Bayern-7-wearing-her-body) |
| TD Wave 10 | TD | 10 | Cosmic-scale Terminus Swarm assault; Source-Kael's offspring at cosmic scale; Kael Fragment unlock |
| CADES M7 | CADES | 10 | Iron Lion's last stand on Veridian VI; saga's most violent FPS sequence; canonical Agent Zero death (off-screen) |
| Iron-Lion-legacy TCG match | TCG | 10 | Iron Lion's deck becomes a heritage cardset; player can play AS Iron Lion against the post-fall Empire |
| Collector's Arena Tier 4 (5 fights) | Arena | 10 | Wolf's Mirror — Collector wearing Wolf's mask |
| Collector's Arena Tier 5 (5 fights) | Arena | 11 | Yellow Jacket Arena — Collector wearing Bayern-7-Agent-Zero's body; saga's most loaded encounter |
| Bayern-7 TCG boss match | TCG | 11 | Warlord's decentralized-war embodiment as a TCG opponent |
| Akai Shi questline final | Akai Shi | 12 | Necromancer's secret laboratory; first-wave-detective backstory locked |
| Wraith Calder questline final | Wraith C | 12 | Sixth and final twin of the Syndicate of Death |
| Wolf's penultimate hunt | Wolf-hunt | 12 | Wolf's named final corrupted-hero target |
| Baron's casino-in-space TCG | TCG | 12 | High-rarity Baron deck match |
| Final TD Wave 11+ | TD | 13 | Nanobot plague's first reality-consumption wave; the Fall happening live |
| Collector's Arena Tier 5 final | Arena | 13 | Collector wearing Bayern-7-AZ-Inventor's body; saga's most loaded encounter |
| TCG final Architect match | TCG | 13 | Architect's pattern in TCG form; canon: cannot defeat, only survive |
| Wolf's final hunt | Wolf-hunt | 13 | Final target reveals as Lycos's pre-resurrection mentor (if mercy-arc) |
| Servant Hero Academy first mission | Service | 14 | Non-combat; player chooses a real-world service act (cross-reality layer) |

### 15.7 — Branching paths summary

Branching exists at three altitudes:

**Micro-branches (every Hub vote):** Each Hub vote has multiple options; canonical winners are locked, but alt-paths each unlock an alternate Codex entry. Players can vote non-canon repeatedly and the chronicle adjusts (Antiquarian acknowledges divergences).

**Mid-branches (apprentice + Wolf corruption arcs):** Apprentice corruption ≥ 100 → permadeath path. Wolf corruption ≥ 100 → Wolf becomes a hunted target. Both alter Phase-12+ companion availability.

**Macro-branches (Ep 2.14 catastrophic vote):** 4 alternate saga endings:
- **War (canon):** Loop closes; Servant Hero Academy pivots
- **Peace:** Negotiated partial-preservation; alternate ending #1
- **Time:** Heart-of-Time second use; third-wave glimpse; alternate ending #2
- **Sacrifice 🙏:** One Potential sacrifices themselves; mortality > catastrophe; alternate ending #3 (saga's bittersweet best ending)

Plus Hamlet III's player-authored final line — the saga's only UGC content; per-player canonical.

### 15.8a — Complete game-system inventory (every surface tied to a phase)

Every existing system / module / surface in the codebase, mapped to a narrative function and a saga phase. Nothing is decorative; everything carries the saga.

| Surface / module | Existing codebase ref | Narrative function | First-active phase | Codex contribution |
|---|---|---|---|---|
| **Galactic Governance Hub (CoNexus)** | `governance.ts`, `engineerGovernanceVotes.ts` | Saga's deliberation surface; 53+ votes | Phase 1 (retroactively bound in Ep 2) | Every Antiquarian past-result inscription is a Codex entry |
| **TCG card engine** | `apps/shared/tcg-core/**` (200+ cards, 26 effect ops, 9 keywords, 475 trial categories) | Combat metaphor for every saga conflict; each card's flavor is a Codex micro-entry | Phase 1 tutorial | Per-card First-Wave-Era annotation |
| **Apprentice 28-day trial system** | `apprentices.ts` + 11 DB tables + 720 lines of VO | The player's mentorship arc; 12 archetypes; the future of the saga walks through this surface | Phase 0 (Celebration) → Phase 1 (cohort initiates) | Memory Cards = first-wave-Potential generational memory |
| **Celebration trial / park** | `celebrationTrial.ts`, `apprenticeCohort.ts` | Pre-Mechronis preliminary recruit ritual; one survivor per year (the player) | Phase 0 | Codex unlocks one entry per Celebration year survived |
| **Mechronis Academy** | (canon location; 5-archon-guild hub) | Player's archon-guild path choice (Watcher/Warlord/Game Master/Meme/Necromancer); biases apprentice doctrine | Phase 4 (after first crystal-city arrival) | First-wave training records |
| **Servant Hero Academy** | (post-Fall franchise pivot; Orlando Lions Convention) | Genre-pivot OUT of the loop; service > war | Phase 14 (post-Ep 2.14) | The Antiquarian's post-loop curriculum |
| **Tower Defense (Terminus Swarm)** | `kaelFragmentWatchers.ts:63-64`, `appendixBKaelQuestline.ts:235` | Source-Kael's offspring offensive made playable; Wave 10 = Source=Kael keystone reveal | Phase 2 (Wave 1) → Phase 10 (Wave 10) | Each wave = a Kael-corruption-stage Codex entry; Wave 10 unlocks 5 entries at once |
| **CADES FPS (Godot iframe)** | `actsFourFiveShells.ts:169-228`, `apps/client/src/pages/CADESFPSPage.tsx` | M1-M7 missions; combat-class character payoffs | Phase 8 (M1-M5) → Phase 10 (M6-M7) | Per-mission first-wave-veteran testimony |
| **Trade Empire** | `apps/shared/tradeEmpire/` (15 modules), `sectorMemory.ts`, `convergenceClimax.ts`, `fleetCommanders.ts` | Intelligence-gathering economy; intel ≥ 200 = Eyes Music Video unlock | Phase 1 (stub) → Phase 12 (max) | Compiled first-wave-figure dossiers; Convergence Climax = late-saga endgame trigger |
| **Chess multiplayer** | `apps/server/` chess router | Standalone metagame; **NEW narrative tie-in: chess pieces ARE the Architect's game-board metaphor** — each player win is an inscription in the Architect's ledger; the Game Master archon hosts the chess multiplayer surface | Phase 1 onward | Each chess match = a "minor move in the Architect's game" Codex micro-entry |
| **Sprite proxy** | `apps/server/` sprite proxy | Dev/admin tool; **NEW narrative tie-in: in-saga, the Sprite proxy is the Antiquarian's research-assistant interface** — the player's pocket-dimension log into her observatory; minimal narrative load but framed canonically | Phase 4 (after Antiquarian's library introduced) | Antiquarian's research notes (system-level entries) |
| **PvP card duels (WebSockets)** | `apps/server/_core/index.ts` | Multiplayer card combat; **NEW narrative tie-in: PvP duels = "alternate-timeline duels" the Antiquarian observes** — each PvP match is canonically a different loop's outcome being played out | Phase 1 onward | Each PvP win = a probability-tree-branch Codex entry |
| **The Loredex** | (existing lore browser) | Player's investigative tool — see 15.12 below | Phase 0 onward | The Codex IS the Loredex-adjacent compilation |
| **Inbox messages** | `transmissions.ts`, `transmissionLoredexUnlocks.ts` | Locke's first message + ongoing transmissions; redaction cascade for Eyes; meme-show "did you know?" interjections | Phase 0 onward | Each transmission = a timed Codex micro-entry |
| **Watchers' Eyes dispatches** | `watchersEyesDispatches.ts:128-170` | Pre-Eyes-reveal redaction-bar surveillance content; Phase-5 dispatch cascade triggers the Eyes video | Phase 0 onward (escalates Phase 5) | Each F7 dispatch = a surveillance Codex entry |
| **Broadcast library** | `broadcastLibrary.ts:17,19,32` | Programmer broadcasts, news framings; surfaces the Politician's reelection (S2 Ep 2.1), Iron Lion's broadcasts | Phase 0 onward | Broadcasts = public-record Codex entries |
| **Antiquarian's Journal** | `antiquariansJournal.ts:4-7` | The Antiquarian's pocket-dimension chronicle surface; she IS the loop-keeper; her journal is the player's primary lore browser | Phase 0 onward | The Journal IS the Codex's primary surface |
| **Empty Chair (prelude room)** | `preludeSequence.ts` | 90-second breath beats; Advocate's "The Ninth" plays here | Phase 0 | Foundational saga-Codex entries |
| **Authority Wall** | (post-Reveal Human surface) | Human's noir-detective reflection space; activates with `human_life_reveal_seen` | Phase 8 (S2 onward) | Human's noir-detective Codex entries |
| **Resurrection Panel (Stage 3)** | `resurrectionProtocols.ts`, `bloodWeave.ts`, `hellboxClone.ts` | Blood Weave alignment surface; the player's complicity with the Architect's pattern; surfaces the 13-tier reveal pool from `bloodWeave.ts:67-80` | Phase 4 (after Painter intro) | Each Blood-Weave-band crossing = a Codex unlock (12 reveal entries) |
| **Engineer's Bench** | `engineerBenchHints.ts` | Holographic-recording playback surface; 7 recordings (6 + audio Ep 7) | Phase 2 onward | Each holo-recording = a Codex entry |
| **The Hellbox (resurrection mechanic)** | `hellboxClone.ts`, `bloodWeave.ts:46-51` | Resurrection tool that ticks `bloodWeaveAlignment` +1 per use; **the player is unwittingly walking the Advocate's path in miniature** | Phase 2 onward | Each Hellbox use = a Blood-Weave-pattern Codex entry |
| **The Sacrum of Severed Silk** | LORE_BIBLE:8460-8475 + `dlc/chapters/dlc_advocate_01_sacrum_echo/` | Advocate's final-act seal; surfaces piecemeal across the Advocate-arc DLC ladder; Year 16,700 A.A. | Phase 6 (Advocate canon deepens) + post-Phase-14 DLC | 7 entries across the DLC ladder |
| **Advocate Body Coordinates** | LORE_BIBLE:7605 + `dlc/chapters/breeding/advocate_body_coordinates.ts` | Released after 5 PURE-bloodline generations of apprentice breeding; the Advocate's body in stasis | Post-Phase-14 DLC | The Advocate's body location = end-game side-revelation |
| **Hierarchy DLC chapter** | `dlc/chapters/hierarchy/` | Hierarchy-lord encounters; cross-locks with the Wolf's Hunt-the-Hero (Hierarchy lords as corrupting agents) | Phase 5 onward (post-Collector) | Hierarchy-lord Codex entries (10+ lords) |
| **Inner Voice Skills** | `innerVoiceSkills.ts` | Apprentice-doctrine-tied passive skills; archon-guild-flavored | Phase 4 (Mechronis Academy) | Inner-voice skill = doctrine-archon Codex micro-entry |
| **Human whispers** | `humanWhispers.ts` (PR #601) | Class-aligned first-meet whispers; cross-loop observer whispers | Phase 1 (Human voice in Ep 1) + onward | Cross-loop Codex breadcrumbs |
| **Mascoteer files** | `mascoteerFiles.ts` (PR #601) | Vortex was the Human's childhood Mascoteer squadmate (Engineer Ep 6 cross-arc) | Phase 3 (Engineer Ep 6) | Mascoteer-file Codex entries |
| **Detective commentary** | `detectiveCommentary.ts` | Human's detective-voice commentary on saga events | Phase 8 (post-Reveal) | Detective Codex entries |
| **Human Life Video sequence** | `humanLifeVideoSequence.ts` | Human Reveal video — `human_life_reveal_seen` flag | Phase 8 (post-Reveal trigger) | The Human's first-wave-survival Codex entry (he IS a cross-loop figure) |
| **Cycle battles** | `cycleBattles.ts:117-151` | Recurring cycle-themed battles; the loop's combat pattern made playable | Phase 1 onward | Cycle Codex entries |
| **Act 1 opponents** | `act1Opponents.ts:114-160,232-246` | Act 1 specific TCG opponents | Phase 1-3 | Act 1 first-wave-opponent Codex entries |
| **Act 3 Eyes biography** | `act3EyesBiography.ts` | Eyes character canon for Phase 5 | Phase 5 | Eyes biography Codex entries |
| **Acts 4-5 shells** | `actsFourFiveShells.ts:50-110` | Act 4-5 narrative shells; Prisoner intro + CADES FPS structure | Phase 7-10 | Shell-canon Codex entries |
| **Galactic Dance faction NPCs** | `galacticDanceFactionNpcs.ts:61` | Faction-aligned NPCs; cross-link with Kael Fragment lore | Phase 10 (Wave 10) onward | Faction-NPC Codex entries |
| **Phantom Crew** | `phantomCrew.ts:60` | Crew-tier NPCs; cross-link with Kael lore | Phase 10 onward | Phantom Crew Codex entries |
| **Soul Stones** | `soulStones.ts` | Soul-collection mechanic; tied to the Collector's harvesting | Phase 5 (Collector freed) onward | Each Soul Stone collected = a Memory Shard analog |
| **Seven Seals** | `sevenSeals.ts`, `sevenSealsEpigraphs.ts`, `sevenSealsEpigraphs.test.ts` | Seven Seal mythology; Atalin's recorded statement to the Advocate (LORE_BIBLE:6894); 40-season clauses | Phase 6 (Advocate canon deepens) | Each Seal = a Codex entry tying Advocate canon to Hierarchy canon |
| **Companion comments** | `companionComments.ts` | Reactive companion lines; `cc_<class>_*` patterns | Phase 1 onward | Companion-comment Codex micro-entries |
| **Faction crosswalk** | `factionCrosswalk.ts` | Faction-mapping reference (existing TCG faction ↔ saga faction) | Phase 1 onward (TCG faction unlocks) | Faction-mapping Codex entries |
| **Episode mysteries** | `episodeMysteries.ts` | Per-episode mystery unlocks (existing system reused by First Wave Codex) | Phase 1 onward | First Wave Codex's primary feed |
| **Character canon** | `characterCanon.ts`, `characterCanon.test.ts` | Canonical character registry; ship:check enforced | Phase 0 onward (foundational) | Character-canon Codex entries (all named characters) |
| **Witnessing Canon xref** | `witnessingCanonXref.ts` | Cross-witness references (existing system for the chronicle) | Phase 1 onward | Witness Codex entries |
| **Blood classification** | `bloodClassification.ts`, `bloodClassification.test.ts` | PURE / HYBRID / DEMONIC / ADVOCATE / SAMSARA / NAMED / UNKNOWN bloodlines (LORE_BIBLE:6975-6981) | Phase 4 onward (Advocate canon) | Bloodline Codex entries; cross-link with Advocate Body Coordinates DLC |
| **Recruitment quests** | `recruitmentQuests.ts` | Player-recruitment surfaces; apprentice-recruit lead-ins | Phase 1 onward | Recruitment Codex entries |
| **Mechanic system tutors** | `mechanicSystemTutors.ts` | Tutorial-tier NPCs introducing each game mode | Phase 0-1 (onboarding) | Tutor Codex entries (tied to each mode) |
| **Arena faction mapping** | `arenaFactionMapping.ts` | Maps the Collector's Arena tiers to TCG factions | Phase 5 (Arena unlocks) | Arena faction Codex entries |
| **Epoch Zero triggers** | `epochZeroTriggers.ts` | Pre-Inception-Ark epoch-cycle triggers; canonical Epoch Zero is pre-Fall | Phase 0 onward | Epoch-Zero Codex entries (pre-saga foundational) |
| **Epoch archetypes** | `epochArchetypes.ts` | Epoch-tier archetype mappings (distinct from the 12 apprentice archetypes — these are cosmic-scale archetypes) | Phase 0 onward | Epoch-archetype Codex entries |
| **Epoch witness votes** | `epochWitnessVotes.ts` | Witness-tier votes (extends the Hub vote shape) | Phase 1 onward | Witness-vote Codex entries |
| **Iron Lion broadcasts** | `ironLionBroadcasts.ts:101-111` | Iron Lion's broadcast canon; the "press is going silent" line | Phase 10 (CADES M7) | Iron Lion broadcast Codex (Cathedral of his end) |
| **Living Universe events** | `livingUniverseEvents.ts` | Dynamic cross-mode events (extends Thought Virus Outbreak pattern) | Phase 1 onward | Each event = a timed Codex micro-entry |
| **Engineer Shadow Curriculum** | `engineerShadowCurriculum.ts` | Engineer-arc training curriculum for apprentices | Phase 2-3 (Engineer arc) | Curriculum Codex entries |
| **Collector's Work missions** | `collectorsWorkMissions.ts` | Collector-themed missions (extends Collector's Arena) | Phase 5 onward (Collector freed) | Collector-mission Codex entries |
| **NPC mourning remarks** | `npcMourningRemarks.ts` | NPC reactive lines on character deaths (Engineer, Iron Lion, Agent Zero, Inventor, Judge, etc.) | Phase 3 (Engineer death) onward | Mourning-remark Codex entries (canonical eulogies) |
| **Gamification** | `gamification.ts` | XP / progression / achievement layer | Phase 0 onward | Achievement Codex entries |
| **Recap system** | `recapSystem.ts` | Saga-recap surface ("previously on the Discordian Saga") | Phase 7 (S1 Ep 16) onward; reused in Phase 11 (S2 Ep 2.11 reveal) | Recap Codex meta-entries |
| **Breaking point** | `breakingPoint.ts:49-119` | Apprentice + character breaking-point dialog patterns; canonical Elara/Iron Lion etc. | Phase 3 (first apprentice breaking-point) onward | Breaking-point Codex entries |
| **Elara romance scenes** | `apps/shared/npcs/romanceScenes/elara.ts:63-98` | Elara romance arc content | Phase 1 onward (Elara always available) | Romance Codex entries |
| **Apprentice romance arcs** | `apprenticeRomanceArc` schema:7649 | Per-archetype romance gating (existing) | Phase 1+ as apprentice graduates | Romance Codex entries (per archetype) |
| **Daily resource votes** | `governance.ts:160-259` (~5 votes) | Daily Hub cadence | Phase 1 onward (daily) | Daily Codex tick |
| **Annual headline votes** | `governance.ts:318-469` (~10 votes) | Annual Hub cadence | Phase 1 onward (annual) | Annual Codex tick |
| **Sentient AI components** | (codebase has AI elements) | The Architect's pattern recognizable in AI-component design choices | Phase 0 onward | Architect-pattern Codex entries |
| **Trial Categories (TCG)** | (475 declared trial categories per ship:check ratchet) | Per-card categorization for arena / TCG matchmaking | Phase 1 onward | Trial-category Codex micro-entries |
| **Card unlock conditions** | (PR #265 — `unlockCondition` field) | Cards gated on player progression (act_completion / secret / battle_pass / founding_author / authors_edition) | Phase 1 onward | Per-card unlock-condition Codex |
| **Story vignettes** | `storyVignetteRegistry.ts` (NEW, this plan) | All single-placement cinematics | Phase 0 onward | Each vignette = a Codex entry |
| **Audio Manifest (VO)** | Per-character VO manifests (`elaraVoManifest.json`, `apprenticeVoiceLines.ts`, etc.) | Voice content for every character | Phase 0 onward | VO-tied Codex audio playback |
| **Cosmetics + mounts + trade ships** | (existing) | Player-cosmetic surfaces; **NEW narrative tie-in: every cosmetic carries a "first-wave era" badge** — the player's cosmetics are inherited from the first wave | Phase 1 onward | Cosmetic Codex entries (provenance) |
| **Faction reputations** | (existing in TCG and trade systems) | Player-faction alignment; affects Hub vote AI voter simulation | Phase 1 onward | Faction-reputation Codex entries |

**Total: 65+ existing surfaces, every one mapped to a phase and Codex contribution.**

### 15.8b — Every named character + when they appear (the Loredex character matrix)

Every named character in the saga, the phase they first appear / are revealed, what they reveal about the first wave, and where their content lives.

| Character | First appearance phase | Saga role | First-wave revelation | Surface |
|---|---:|---|---|---|
| **The Antiquarian** | 0 (always) | Narrator / loop-keeper | She IS the survivor of every loop; her chronicle = the player's primary Codex | Her pocket-dimension observatory; the Hub Antiquarian inscription is her voice |
| **The Architect** | 0 (referenced) → 7 (named) → 13 (fought) | Ultimate antagonist | He engineered Project Vector + the Heart of Time + the Inception Arks; orchestrated the Fall | LORE_BIBLE:189-206; TCG Architect-faction cards; final Phase 13 unwinnable match |
| **The Dreamer** | 1 (referenced) | The Architect's opposite | Canonically opposes the Architect; the saga's hope-pole | TCG Dreamer-faction; later DLC arcs |
| **The Politician** | 8 (introduced) → 10 (revealed) | AI Empire ruler post-Fall | From Dept. of Government Efficiency; 97th re-election; rules on Architect's behalf | S2 Ep 2.1 broadcast; S2 Ep 2.10 reveal |
| **The Engineer** | 2 (Eps 1-4) → 3 (Eps 5-7) | Inception Ark builder; tragic ❤️ Ep 6 | He built the Arks the Potentials wake on; cross-arc payoff with S1 Ep 1 | Engineer's Bench (`engineerBenchHints.ts`); Engineer Eps 1-7 |
| **Agent Zero** | 3 (referenced) → 9 (M6 recruit) → 11 (death revealed) | Player thinks she's an ally; canonically dead, Bayern-7 wears her body | She died on Veridian Prime during M7; the yellow-jacket motif lock | CADES M6, M7; S2 Ep 2.11 reveal |
| **The Warlord** | 3 (Engineer Ep 6) → 9 (M6 Bayern-7 surface) → 11 (full reveal) | Mechronis archon; decentralized-war copies | He killed the Engineer; he wears Agent Zero's body | Mechronis Academy; M6-M7; S2 Ep 2.11 |
| **Bayern 7** | 9 (M6 — disguised) → 11 (revealed) | Warlord copy wearing AZ's body | He IS the M6 recruit | M6 reveal; Phase 11 |
| **Iron Lion** | 1 (referenced) → 10 (M7 death) | Combat-class character; dies on Veridian VI | His broadcast going silent = the Warlord's victory; canonical death | Iron Lion broadcasts (`ironLionBroadcasts.ts`); CADES M7 |
| **The Oracle (S1)** | 4 (Eps 1-2) → 6 (Ep 5 retroactive) | Thalorian prophet → harvested → became Jailer → escaped via wormhole | Two Oracles One Pattern (cross-locks with Prisoner) | Oracle Eps 1-7; Templum Veritus |
| **The Prisoner (Kael-Oracle)** | 7 (Act 4 opener) → 9 (Hamlet II locks identity) | Harvested Oracle in panopticon | He IS the S1 Oracle's parallel; both are Architect's victims | Prisoner video; Hamlet II; Collector's Arena player-character |
| **The Source (Kael)** | 3 (Ep 6 confronted) → 10 (Wave 10 fully revealed) | Pre-corruption Insurgency operative → infected → became Source | Source = Kael; Kael Fragment at Wave 10 = pre-corruption essence | S1 Eps 6-7; Tower Defense Wave 10; LORE_BIBLE:3043-3066 |
| **The Collector** | 5 (Ep 10 freed) → ongoing | Helmet entity; the Architect's harvester | Captures Souls; runs the Arena nested in Panopticon nested in Matrix of Dreams | S1 Eps 10-14; Collector's Arena; secret-boss appearances cross-mode |
| **The Advocate** | 0 (Beat F.5) → 12 (Matrix trapped) | Ne-Yon queen of Empire of Shadows; Blood Weave origin | Bargained with Master of R'lyeh → summoned the Hierarchy; "The Ninth" | Prelude Beat F.5; LORE_BIBLE:1452-1497; Advocate-arc DLC ladder |
| **The Painter (Bob Ross)** | 0 (Beat A.5) → 12 (resurrection revealed) | Resurrection-Protocols introducer; resurrected then killed again | Architect resurrected him to teach kindness; killed him for "painting peace" | Prelude Beat A.5; S2 Ep 2.13 reveal; `resurrectionProtocols.ts` |
| **The Inventor** | 1 (Beat H + Ep 1 cutscene) → 13 (dies "messy") | Loop-breaker; Heart-of-Time pilot | His ship is the only divergence mechanism; his death lets the loop persist | Beat H vignette; Ep 1 cutscene; S2 Eps 2.1, 2.12, 2.14 |
| **The Judge** | 1 (TCG cards) → 13 (dies charging Architect) | Faction-leader-tier character | Dies charging the Architect with hammer raised | TCG Judge-faction; S2 Ep 2.14 |
| **The Heirophant** | 4 (Oracle Ep 2) | Thalorian spiritual authority; textualist | Locks the Star Whisperer empty seat (later Wraith's) | Oracle Eps 1-2; LORE_BIBLE Heirophant |
| **The Star Whisperer (empty seat)** | 5 (Oracle Ep 4 lock) → 8 (Wraith fills) | Sacred office | Canonically rejected as Oracle title; Wraith fills it in Season 2 | Oracle Ep 4 + S2 Ep 2.4 Hierophant Wraith |
| **Hierophant Wraith** | 8 (S2 Ep 2.4 introduced) | Thalorian Resistance leader | Cross-arc lock with S1 Heirophant lattice; fills the Star Whisperer empty seat | S2 Eps 2.3-2.10 |
| **Shadow Tongue** | 7 (Oracle Ep 6 — summoned) | Hierarchy weapon; SVP of Communications | Summoned by Collector's impersonation; "naming is summoning" canonical proof | Oracle Ep 6; LORE_BIBLE:2954-2965 |
| **The Six / The Authority** | 9 (S2 Eps 2.4-2.5) | New Babylon's living-computer ruling body | Six immortal-twin founders: Samsara, Furial, Midlothian, Null, Tenebrous, Saisei | S2 Eps 2.4-2.7 |
| **The Syndicate of Death** | 9 (S2 Eps 2.4-2.7) | Secret network of immortal twins | Manipulates the Authority; orchestrates everything | S2 main spine |
| **Wraith Calder** | 7 (referenced) → 8 (S2 Ep 2.2 introduced) → 12 (questline completes) | First-wave survivor; Potential reborn via stolen Resurrection Protocols | Hunts the Syndicate's six twins for revenge | Wraith Calder questline (side content) |
| **Akai Shi** | 4 (Mechronis Academy hint) → 12 (questline completes) | First-wave survivor; Necromancer-archon-aligned death-defier | "My true life began the moment I died"; investigates the Necromancer | Necromancer's Lair questline |
| **Lycos → The Wolf** | 7 (Lycos dies offscreen) → 7-end (Wolf unlocks) | First-wave survivor; Quarchon assassin | "Death freed me"; hunts corrupted Servant Heroes in the Crucible | Wolf companion + Hunt-the-Hero minigame |
| **The Baron** | 11 (referenced) → 12 (revealed) | Time-traveler; son of "King of Earth"; runs casino in space | Recruited via Advocate's Hierarchy bargain; built the Heart-of-Time team | S2 Ep 2.12 |
| **Satoshi Nakamoto** | 12 (Heart-of-Time crew) | Time-team recruit | Cross-time-traveler; canonical real-world reference made fictional | S2 Ep 2.12 |
| **Vex Solène** | 3 (Engineer Ep 6 posthumous resurrection) | Engineer's posthumous successor | She is the Engineer reborn (resurrection protocols) | `questlineClassEngineer.ts`; Engineer-Bench post-Ep-6 |
| **The Eyes (+ Locke)** | 5 (post-`dispatch_F7_final`) | Spy-class character | She was reading the Potentials' mail the whole time | Eyes video; `act3EyesBiography.ts` |
| **The Watcher** | 4 (Mechronis archon) | Spy-archon-guild leader | Knows everything without being seen | Mechronis Academy |
| **The Game Master** | 4 (Mechronis archon) | Gray-gamer-archon-guild; canonically the 9th Archon admitted to Hierarchy | Designed the Matrix of Dreams; Agent Zero destroyed him | Mechronis Academy; Chess multiplayer canonically hosted by him; LORE_BIBLE:5352 |
| **The Meme** | 4 (Mechronis archon) | Influencer-archon-guild; Shape-Shifter | The Inventor's prelude meme-frame is the Meme-archon's surface; "—I." signature traces here | Mechronis Academy; Inventor meme-frame system |
| **The Necromancer** | 4 (Mechronis archon) | Living-archon-guild; immortality-toying | Cross-arc with Akai Shi questline + the Necromancer's Lair | Mechronis Academy; Necromancer's Lair questline |
| **The Dreamer (cosmic figure)** | 1 (referenced) onward | Cosmic protagonist | The Architect's opposite; the saga's hope-pole | TCG Dreamer-faction; cross-references throughout |
| **The Hierarchy of the Damned** | 4 (Mechronis intro) → ongoing | Demon-lord corporation | 10 lord roles; Mol'Garath CEO; Xeth'Raal accountant; Zyr'Koth Shadow Tongue creator | `hierarchyOfTheDamned.ts`; DLC Hierarchy chapter |
| **Mol'Garath the Unmaker** | 4-onward (referenced) → 13 (named in Ep 2.14 lineage) | Hierarchy CEO | "He allowed the gates to open, having waited since the first moment of existence for the Blood Weave to be spoken" | LORE_BIBLE:4088 |
| **Zyr'Koth the Shadow Tongue** | 4 (TCG-card-referenced) → 6 (`hierarchy:zyr_koth_first_met`) | Hierarchy R&D SVP; refined the Blood Weave into Severance Protocol | His R&D division weaponized the Advocate's gift | `hierarchyOfTheDamned.ts:57-85`; LORE_BIBLE:5217 |
| **Ith'Rael / Master of Rylloh** | 4 (TCG-referenced) → 5 (`hierarchy:master_of_rlyeh_first_met` reclassified to ithrael_whisperer per Part 0) | Hierarchy Director of Special Projects | Orchestrated the Severance via Shadow Tongue corruption of Thaloria | LORE_BIBLE:3997-4015 |
| **Pale Emissary** | 6 (`hierarchy:pale_emissary_first_met`) | Hierarchy Vortex-contract notary | Brings contracts; never coerces; signs Vortex Standing | `hierarchyOfTheDamned.ts:115-141` |
| **Reckoning Daughter** | 7 (`hierarchy:reckoning_daughter_first_met`) | Hierarchy auditor | Audits the Hierarchy itself; arrives only when books are wrong | `hierarchyOfTheDamned.ts:143-172` |
| **Riri'Ahlia** | 6 (referenced) | Hierarchy COO; corporate-reorg architect | Led siege of seven dimensions against the Advocate; driven back by Blood Weave chains | LORE_BIBLE:4205 |
| **Syl'Vex** | 6 (referenced) → 9 (Civil-War surface) | The Advocate's cobalt-skinned dark mirror | Where Advocate wove Blood Weave to defend, Syl'Vex weaves to convert | LORE_BIBLE:4244-4287 |
| **Xeth'Raal** | 6 (referenced) | Hierarchy CFO; debt-ledger architect | Recorded the Advocate's sacrifice as an irrepayable debt | LORE_BIBLE:5155 |
| **Drael'Mon** | 6 (referenced) | Hierarchy consumer | Devoured what the Shadow Tongue softened; rival to the Collector | LORE_BIBLE:3970 |
| **Varkul the Blood Lord** | 4 (Necromancer Cathedral) | Necromancer creation; Cathedral of Code guardian | Vampiric blood-magic boss inside the Matrix of Dreams | LORE_BIBLE:3770 |
| **The Ninth Entity** | 4 (TCG cards) | Herald of the Damned; distinct from Advocate's "Ninth" title | Hierarchy emissary | LORE_BIBLE:4565 |
| **Master of R'lyeh (eldritch outsider)** | 0 (referenced via Advocate ballad) → 6 (Codex-locked) | UNALIGNED eldritch entity from Hydros; Advocate's patron | Gave Blood Weave to Advocate (saga's central irony) | LORE_BIBLE:1291-1312; `eldritchOutsiders.ts` (NEW, this plan) |
| **Atalin** | 6 (LORE_BIBLE:6894) | The Advocate's recorded-statement figure | "I wrote them because the Hierarchy would have written them if I refused" — saga's ethical fulcrum | LORE_BIBLE:6894; Seven Seals lore |
| **Hierophant Pyor XI** | 6 (referenced) | Pre-Severance Thalorian; declared crusade against Empire of Shadows | His crusade triggered the Severance | LORE_BIBLE:2965 |
| **The Storm** | 1 (TCG card) | Faction-leader-tier character | Cross-Reference with the Advocate's connections (LORE_BIBLE:1473) | TCG The-Storm card; Advocate's Connections list |
| **The Seer** | 1 (TCG card) | Faction-leader-tier character | Advocate's Connections list (LORE_BIBLE:1476) | TCG The-Seer card |
| **Locke** | 0 (Beat H Inbox) | The Inventor-adjacent / Inbox correspondent | Cross-references the Inventor's "—I." signature | Locke's first message (Beat H); Inbox transmissions |
| **Jericho** | 8 (S2 Ep 2.1 — "you made the choice to save us all") | One of the Potentials; killed someone in the opening | Player-character-adjacent for the Heart-of-Time heist | S2 Ep 2.1 |
| **The Host** | 7 (S1 Eps 15-16) → 13 (S2 Ep 2.14) | Corrupted Potential | Forged from Architect's preserved DNA; infected by Source | LORE_BIBLE:2231-2237 |
| **9th Neon** | 6 (S1 Ep 11 — tunnel collapse) → 7 (S1 Ep 15 — harmonic amplification) | NEW canon (Part 0 lock) | Neon-class elemental wielder within DeMagi lineage | New canon; needs LORE_BIBLE dossier per Part 0 risk |
| **The Resurrectionists** | 8 (S2 Eps 2.4-2.10) | Faction wanting to revive the Politician | Counter-faction to the Thalorian Resistance | S2 Eps 2.4-2.10 |
| **The Game Master (9th Archon)** | 4 (Mechronis intro) → 10 (Politician's Reign context) | Cross-reference: Game Master archon = the 9th Archon admitted to Hierarchy | Agent Zero destroyed him; Xeth'Raal honored the contract clauses but ensured his destruction | LORE_BIBLE:5155, 5352; `mechronisLink.ts` |
| **The Trickster (god of stories)** | 11 (S2 Ep 2.12 — Baron episode) | The Baron paid him to lose | "I never claimed it would be an easy trip" | S2 Ep 2.12 |

**Total: 60+ named characters mapped to a phase + revelation + surface.**

### 15.8c — Cross-cycle persistence layer (DLC + daily/weekly + multiplayer + Memory inheritance)

The saga persists across cycles via multiple mechanisms; every loop's lessons inherit forward.

| Persistence layer | Mechanism | Narrative function |
|---|---|---|
| **Memory Cards (apprentice)** | `apprenticeMemoryCards` table (schema:8393) | Fallen apprentices' decisions inherit to next apprentice; first-wave generational memory |
| **Memory Shards (Wolf hunts + Collector's Arena)** | NEW (this plan) | Each kill / each Arena fight = a Memory Shard preserving first-wave-figure pre-corruption identity |
| **First Wave Codex** | NEW (Part 14) | Saga-wide accumulating compilation; persists per-player; never resets |
| **Daily resource votes** | `governance.ts:160-259` (~5 votes daily) | Daily Hub cadence; each daily vote = a Codex tick; the player's saga history accumulates one decision per day |
| **Annual headline votes** | `governance.ts:318-469` (~10 votes annual) | Annual Hub cadence; major saga-level decisions cycle yearly |
| **DLC chapters** | `dlc/chapters/hierarchy/`, `dlc/chapters/breeding/`, `dlc/chapters/dlc_advocate_01_sacrum_echo/` | Side-canon expansions that surface piecemeal across the saga; Advocate-arc DLC ladder + Hierarchy DLC + Breeding DLC (Advocate Body Coordinates after 5 PURE-bloodline generations) |
| **Multiplayer PvP duels** | WebSocket card duels | Each duel = "an alternate-timeline duel the Antiquarian observes"; one of many loop branches |
| **Chess multiplayer** | Standalone Chess router | The Game-Master-archon-hosted strategy game; each chess match = a "minor move in the Architect's game" |
| **Cross-loop replay** | Replay-pinned card definitions (`engine/version.ts` RULES_VERSION) | The saga's RULES_VERSION ensures replays of older loops play correctly under their original rules; the loop-keeper preserves loop-accuracy |
| **Servant Hero Academy onboarding** | Phase 14 surface | Post-loop genre pivot; preserves player progress as inheritance |
| **Cosmetics + mounts** | Existing surfaces | Each has "first-wave era" badge; cosmetics carry the previous-loop's flavor forward |
| **Faction reputations** | TCG + Trade reputation surfaces | Faction-alignment compounds across cycles |
| **The Antiquarian's pocket dimension** | Her observatory surface | Persists outside the loop; she IS what survives |
| **Bloodline classification** | `bloodClassification.ts` | PURE / HYBRID / DEMONIC / ADVOCATE / SAMSARA / NAMED / UNKNOWN — per-generation tracking that compounds across apprentice cycles; unlocks Advocate Body Coordinates after 5 PURE generations |

### 15.8d — The Loredex as the player's investigative tool (every Loredex entry tied to a saga beat)

The Loredex is the player's primary lore-browser surface (canonically the Antiquarian's Journal). Every Loredex entry is a piece of First Wave Mystery evidence; every entry has a `discoverySource` field naming the phase / cinematic / mode that unlocked it.

| Loredex section | Phase tie-in | Entry count (estimate) |
|---|---|---:|
| **Characters** | Phase 0 onward; entries unlock progressively as characters surface | ~80 entries (60+ named characters in 15.8b + supporting cast) |
| **Locations** | Phase 0 onward | ~30 entries (Inception Ark, Source planet, crystal-city, Templum Veritus, Panopticon, Crucible, New Babylon's six districts, Veridian Prime, Hamatora, Mechronis Academy, Servant Hero Academy, etc.) |
| **Factions** | Phase 1 onward | ~20 entries (Dreamer, Architect's Empire, Insurgency, Thalorian Resistance, Hierarchy of the Damned, Syndicate of Death, Resurrectionists, the Six, etc.) |
| **Events** | Phase 1 onward | ~50 entries (the 30 Antiquarian episodes + 9 universal video votes + key cinematics + Outbreaks) |
| **Items / Artifacts** | Phase 1 onward | ~25 entries (Heart of Time vessel + artifact, Hellbox, Resurrection Protocols, Soul Stones, Seven Seals, Sacrum of Severed Silk, the Collector's helmet, the Bench, the 9th Neon's harmonic crystal, etc.) |
| **Concepts** | Phase 0 onward | ~40 entries (thought virus, Project Vector, Blood Weave, naming-is-summoning metaphysics, time-loop premise, breaking-point system, Memory Cards, etc.) |
| **Albums (NEW)** | Phase 2 onward as slideshows drop | 5 entries (West by God / Silence in Heaven / Daniel 2:47 / Dischordian Logic / Age of Privacy) + 1 per song |
| **First-Wave Survivor profiles** | Phase 7 onward | 3 entries (Wolf / Akai Shi / Wraith Calder) with pre-death + post-resurrection sub-entries each |
| **Hub vote past-results** | Phase 1 onward | ~53 entries (every Hub vote's Antiquarian past-result inscription) |
| **Probability-tree branches** (NEW) | Phase 8 onward (Wolf companion's register) | One entry per major Hub-vote alt-outcome (~150+ entries across the saga) |

**Total Loredex entry count (estimate): ~400-500 entries** unified by First Wave Codex completion %.

### 15.8e — The complete fight/encounter manifest (every battle has a `narrativeReason` field)

Per the "every battle has a narrative reason" lock, the new `apps/shared/battleNarrativeJustifications.ts` registers every battle / fight / encounter in the saga with a `narrativeReason` linking it to its phase. Ship:check parity enforces no orphan battles.

| Encounter | System | Phase | `narrativeReason` |
|---|---|---:|---|
| Celebration mission | Celebration | 0 | Prove courage to join the Masketeers |
| TCG tutorial | TCG | 1 | Practice deck = Inception Ark equipment |
| TD Waves 1-3 | TD | 2 | Defend crashed Inception Arks from Source's offspring |
| TD Wave 4 | TD | 3 | Hold tunnels while wormhole opens |
| TCG Source-boss | TCG | 3 | Face the Source's first proxy |
| TD Wave 5 | TD | 4 | Hierarchy scouts breach Templum Veritus |
| Oracle-spread TCG | TCG | 4 | Oracle's spread mechanic surfaces visions |
| Mousetrap interaction × 3 | Hamlet | 4 | Audience-interaction during the play-within-a-play |
| Arena Tier 1 × 5 | Arena | 5 | Prisoner-Oracle recovers pre-harvest memories |
| Eyes recruit match | TCG | 5 | Player faces the Eyes' surveillance pattern |
| TD Waves 6-7 | TD | 6 | Hierarchy breach defense; Wyrmwood vaccine failing |
| Arena Tier 2 × 5 | Arena | 6 | Prisoner-Oracle fights his own past selves |
| TD Waves 8-9 | TD | 7 | Hierarchy + corrupted-Servant-Hero combined assault |
| Hunt × 3 | Wolf-hunt | 7 | Wolf's first corrupted-Servant-Hero hunts |
| CADES M1-M5 | CADES | 8 | Each = a specific S2 Eps 2.2-2.4 beat |
| Hunt × 3 | Wolf-hunt | 8 | Wolf escalates |
| Hamlet II interactive | Hamlet | 9 | Player BECOMES the Prisoner-Hamlet |
| Arena Tier 3 × 5 | Arena | 9 | Matrix-Authority-merged clones |
| CADES M6 | CADES | 9 | Alliance of Adversaries — Agent Zero (Bayern-7) recruitment |
| TD Wave 10 | TD | 10 | Source-Kael's cosmic-scale offensive |
| CADES M7 | CADES | 10 | Iron Lion's last stand on Veridian Prime |
| Iron Lion legacy TCG | TCG | 10 | Iron Lion's deck as heritage |
| Arena Tier 4 × 5 | Arena | 10 | Collector wearing Wolf's mask |
| Arena Tier 5 × 5 | Arena | 11 | Yellow Jacket Arena (Collector wearing Bayern-7-AZ body) |
| Bayern-7 TCG boss | TCG | 11 | Warlord's decentralized-war embodiment |
| Akai Shi questline final | Akai Shi | 12 | Necromancer's secret laboratory inside Hamatora |
| Wraith Calder questline final | Wraith C | 12 | Sixth and final twin of the Syndicate |
| Wolf's penultimate hunt | Wolf-hunt | 12 | Named final corrupted-hero target |
| Baron's casino TCG | TCG | 12 | High-rarity Baron deck match |
| TD Wave 11+ | TD | 13 | Nanobot plague's first reality-consumption wave |
| Arena Tier 5 final | Arena | 13 | Collector wearing Bayern-7-AZ-Inventor body |
| TCG final Architect | TCG | 13 | Architect's pattern; canon: cannot defeat, only survive |
| Wolf's final hunt | Wolf-hunt | 13 | Final target = Lycos's pre-resurrection mentor (mercy-arc) |
| Servant Hero first mission | Service | 14 | Non-combat real-world service act |
| Daily TCG / TD / Trade missions | Daily cadence | 1 onward | Each daily session has a `narrativeReason` (e.g., "the Antiquarian's daily readings of the chronicle") |
| Annual headline votes | Annual cadence | 1 onward | Each annual vote = a saga-level decision the chronicle tracks |
| Multiplayer PvP duels | Multiplayer | 1 onward | Alternate-timeline duel the Antiquarian observes |
| Chess multiplayer matches | Multiplayer | 1 onward | The Game Master archon hosts the strategic-cosmic-game surface |
| Mechronis Academy class fights | Mechronis | 4 onward | Apprentice-doctrine-flavored archon training |
| Cycle Battles (existing) | Cycle | 1 onward | Recurring loop-themed encounters; each = the same fight different loops |
| Living Universe events | Cross-mode | 1 onward | Dynamic events fired by saga progression |

**Total: ~50+ fight types registered with explicit `narrativeReason`.**

### 15.8f — The cross-mode information-release order (every reveal happens when its evidence is earned)

Per the game-mode coherence audit (Part 13), reveals are gated so that no system reveals canon ahead of the cinematic that introduces it. The release order is canonical:

1. **Phase 0:** Painter / Advocate / Inventor / Celebration onboarding — saga-foundational concepts only (no major reveals)
2. **Phase 1:** Heart-of-Time first-seen, time-loop premise, Human cross-loop voice
3. **Phase 2:** Engineer-built-Inception-Arks; thought virus first contact (Outbreak #1)
4. **Phase 3:** Engineer's death + Vortex was Human's childhood friend
5. **Phase 4:** Source-Kael foreshadowed (via Hamlet I); Templum Veritus crystal harmonics; Heirophant introduced
6. **Phase 5:** Eyes was watching; Collector freed (saga's biggest mid-game escalation)
7. **Phase 6:** Oracle's prophet→Jailer→escapee backstory; Two Oracles One Pattern (Codex lock); Wyrmwood barrier-shatter (Outbreak #3)
8. **Phase 7:** Shadow Tongue summoned (Outbreak #4); Prisoner = Oracle (mechanical lock); Wolf companion unlocks
9. **Phase 8:** Politician's reelection broadcast; new Babylon canon; Hierophant Wraith introduced
10. **Phase 9:** Authority is a lie on top of Matrix of Dreams; Six immortal twins; Matrix-Authority-merged Arena tier (Outbreak #5); Hamlet II locks Prisoner identity
11. **Phase 10:** Source = Kael keystone reveal (Wave 10 + Kael Fragment); Iron Lion dies; Politician's DGE origin (Outbreak #6)
12. **Phase 11:** Agent Zero death revealed (saga's highest-payoff moment); Bayern-7-wore-her-body
13. **Phase 12:** Project Vector origin (the thought-virus source); Baron's identity + Ingersoll Lockwood prophecy
14. **Phase 13:** Painter's resurrection-and-second-death; loop closure; Inventor + Judge die; nanobot plague (Outbreak #7); First Wave Codex 100% trigger
15. **Phase 14:** Servant Hero Academy onboarding; Hamlet III player-authored final line

**Cross-mode invariants (locked):**
- No TCG card flavor names Source-Kael by name before Phase 6
- No Trade Empire intel reveals Bayern-7-Agent-Zero before Phase 11
- No Tower Defense wave plays the Source = Kael cinematic before Wave 10
- No CADES mission reveals the Architect's identity by name before Phase 13
- No apprentice's Memory Card carries forward a Phase-N reveal before the player has reached Phase N

### 15.8g — The Dreamer's Shield + the truth about the first wave (USER LOCK)

**The first wave didn't die. They're behind the Dreamer's Shield.**

**Cosmic canon (LOCKED — saga-keystone reveal):**

The Dreamer canonically opposes the Architect (LORE_BIBLE:189-206 names the Architect as opposing the Dreamer's vision). **The Dreamer maintains a Shield — a cosmic protective barrier behind which the first-wave Potentials and the Ne-Yons (the hybrid third species) shelter, hidden from the Architect's pattern-recognition.** The shield is the saga's deepest counter-move against the loop.

**Who is behind the shield (LOCKED):**
- **The first-wave Potentials** (all of them, except the exceptions below)
- **The Ne-Yons** (the hybrid race — including the Advocate's lineage)
- *(implied — the rest of the saga's "missing" first-wave figures the player has been wondering about)*

**Who is OFF the board (NOT behind the shield):**
- **The Advocate** — sealed in the Sacrum of Severed Silk (Year 16,700 A.A. — LORE_BIBLE:7716, 8460-8475); her body in stasis under 7-Omega clearance; her arc continues piecemeal through the Advocate-arc DLC ladder
- **The Silence** — **Ne-Yon. Information Twin of the Syndicate of Death, paired with The Word** (existing canon, LORE_BIBLE:2998-3032). Late Empire era (15,700 A.A.). She and The Word speak in alternating sentences — *"The Silence handles what The Word leaves unsaid."* Her primary surface is comms-signal (not physical). Canonical signature line: *"The copies we kept are ours. The Authority paid for silence. They did not pay for forgetting."* (`galacticDanceFactionNpcs.ts`). She canonically hacks the Authority's mainframe, uncovering suppressed timelines (`transmissions.ts` Eps 12-15). **The Antiquarian on her:** *"The Silence found what I hid. Not all of it — even she cannot trace every thread I buried in the Authority's architecture — but enough."* (`antiquariansJournal.ts`). Song appearances: "Polarity" (Daniel 2:47), "Silence in Heaven" (Silence in Heaven album), "Silence is Consent" (Age of Privacy). **NEW USER-CANON EXTENSION (Season 3 / current-plan):** she is currently OFF the board (sheltering with the Advocate); at the deepest cosmic tier she is the Antiquarian's opposite (chronicler preserves; Silence erases) — this extends but does not contradict the existing operational-peer canon. She returns; the saga's "Silence in Heaven" cosmic event (LORE_BIBLE:9988-10032; Revelation 8:1 half-hour cosmic pause; release 2026-07-30; The Reckoning era) is canonically her return-beat. **The Silence-in-Heaven album we drop in Phase 7 + Phase 13 IS her arc soundtracked.**

**Who is OUT IN THE WORLD (visible to the Architect):**
- **The Degen** — **Ne-Yon #8, the last surviving Ne-Yon** (canonically of 12 cosmic Ne-Yon entities; the other 11 are extinct — per LORE_BIBLE + `degenTrustGating.ts` + `npc-the_degen-lines.json`). 15,000+ years old. Embodies **entropy and corruption**. **Holds BOTH categories: first-wave Potential AND Ne-Yon** (CANON_REV_7 §1.6 — only character with both). Operates **on the EDGE of the Dreamer's Shield** (liminal zone — accessible to the player while maintaining dual allegiance). **Defining trait:** chose visibility over safety. Hidden role: agent of the first-wave Potentials behind the Shield, working alongside Vex Solène. See §15.8m for full Casino canon. Signature quote: *"Do you know what it's like to be the last one? I run a casino so I'm never alone. Pathetic for a god. Honest for a bartender."*
- **Vex Solène (SECRETLY)** — late-game Codex reveal: the Engineer's posthumous resurrection (`questlineClassEngineer.ts`) is NOT inside the Engineer's Bench as the player believes. She is canonically out in the world, active, working alone, hidden from both the Architect AND the Dreamer's Shield. **She is the saga's most hidden active first-wave figure.** Her secret active status is the player's penultimate revelation (Codex ≥ 90% before unlock).

**The reframed mystery (LOCKED):**

The First Wave Mystery's answer is NOT just "they chose War and died in the Fall." The deeper truth is:

> **The first wave's catastrophic War-Choice destroyed reality. But the Dreamer reached through the destruction and pulled the Potentials behind the Shield BEFORE the nanobot plague consumed them. The Advocate sealed herself separately. The Silence withdrew. Only the Degen — by his own choice — and Vex Solène — secretly — remain out in the world the player walks through. The Antiquarian preserves the chronicle so the SECOND WAVE (the player) can find them. The mystery is not what happened. The mystery is where they ARE.**

This recontextualizes the entire Codex: every entry is a clue to where a first-wave Potential is hiding behind the shield. The player's Codex-completion arc isn't just "reconstruct the past" — it's **"find every first-wave survivor and bring them back."**

### 15.8h — "What do you mean this isn't the first reality?" (multiverse-stack canon — LOCKED)

The Discordian Saga is NOT a single time-loop in a single reality. It is **one reality in a stack of realities**, each with its own first-wave / second-wave / Antiquarian / loop. **The player's reality is not the first.**

**Mechanical surface:** Multiple Antiquarian-narrated Codex entries reference "the prior reality" or "the cycle before this one." The player progressively discovers:
- This reality has had a previous reality whose Potentials made different choices
- The Inventor's Heart-of-Time vessel can canonically traverse not just time within a reality but BETWEEN realities (S2 Ep 2.12's Baron canon: the Heart of Time is the Architect's TIME machine, but the prison-planet construction surface is canonically in MULTIPLE realities simultaneously — the Architect built it across the stack)
- The Antiquarian's pocket-dimension observatory is OUTSIDE the multiverse — she watches the entire stack from a single observation point
- The Dreamer's Shield is a CROSS-REALITY structure — first-wave Potentials from multiple realities canonically shelter inside the same shield

**The first delivery line (LOCKED — canonical dialog moment):**

In Phase 11 (after the Agent Zero death reveal — the saga's most emotionally loaded Hub moment), an active companion delivers the line: *"What do you mean this isn't the first reality?"* The line is canonically said by the player-active Apprentice in their archetype-distinct voice (12 distinct versions — see Phase 11's already-locked authoring). The Antiquarian's response is the saga's deepest revelation: *"I have written this chronicle for many waves. You are not the first. You may not be the last. The reality you walk through is the reality I have walked through, in different shoes, before."*

**Player-discoverable evidence streams (text-based modes are the primary investigation surface):**

Per user lock, **Trade Empire + text-based game modes carry the multiverse-stack and first-wave-shield reveals.** Specifically:

| Mode | Reveal carried |
|---|---|
| **Trade Empire intelligence dossiers** | Cross-reality intel surfaces; some intel reads as "from a reality where the Engineer survived" or "from a reality where the Side-Choice resolved to Hierarchy"; the player accumulates cross-reality dossiers |
| **Inbox transmissions** | Some inbox messages have a "from: unknown reality" header; signatures like `—I.` (the Inventor) sometimes come from BEFORE the player has met the Inventor in their reality |
| **Watcher's Eyes dispatches** | The Eyes' network canonically crosses realities; her redaction cascade includes dispatches from adjacent realities |
| **Broadcast library** | Programmer broadcasts occasionally include "cross-stream" interference from adjacent realities |
| **Antiquarian's Journal** | Her primary ledger; cross-reality entries are tagged with reality indices |
| **Akai Shi questline (text-based)** | Akai Shi has died in multiple realities; her resurrection pattern is cross-reality |
| **Wraith Calder questline (text-based)** | Wraith Calder hunts Syndicate twins across realities; some twins exist in MULTIPLE realities (the twins are inherently dual-reality entities) |
| **Wolf's Hunt-the-Hero (text-based encounters)** | Some corrupted Servant Heroes have escaped from other realities into this one's Crucible; the Wolf's hunts cross the multiverse stack |
| **Hamlet I (audience)** | The play canonically references the Architect's pattern recurring across realities ("you have seen this play before, in another house") |
| **Hamlet II (interactive)** | The Prisoner-Hamlet's "to be or not to be" choice is canonically the same choice made in multiple realities; the player's choice diverges from other realities |
| **Hamlet III (authored)** | The player's authored final line is canonically read in EVERY reality — the saga's ONE truly cross-reality surface |

### 15.8i — Trade Empire as the primary first-wave-mystery investigation surface (USER LOCK)

Per user lock, **Trade Empire's intel-gathering mechanic becomes the primary detective surface for the first-wave mystery.** The existing system (`apps/shared/tradeEmpire/` — 15 modules, `sectorMemory.ts`, `convergenceClimax.ts`, `fleetCommanders.ts`) is repurposed narratively to surface progressive reveals.

**Trade Empire's narrative reframe:**

The Trade Empire is canonically the **post-Fall intelligence economy** the second-wave Potentials run to gather evidence about the first wave. Every intel dossier the player compiles is a piece of First-Wave-Mystery investigation. The existing `intelligence` resource accumulates evidence; the existing `convergenceClimax.ts` mechanic IS the Codex-100% climax surface.

**New Trade Empire reveal-tier mapping (intel ≥ X unlocks Y):**

| Intel threshold | Reveal unlocked | Surface |
|---|---|---|
| ≥ 50 | First mention of the Dreamer's Shield (dossier titled "Shield Anomaly") | Trade Empire dossier surface |
| ≥ 75 | The Silence named as a character (not just an album theme) | Trade Empire + Antiquarian's Journal |
| ≥ 100 | The Degen identified as an active first-wave Potential | Trade Empire + Inbox transmission from the Degen |
| ≥ 125 | First cross-reality intel ("from a reality where the Engineer survived") | Trade Empire cross-reality dossier |
| ≥ 150 | The Advocate's Sacrum location partially decoded (cross-arc with breeding DLC) | Trade Empire + Advocate Body Coordinates DLC tease |
| ≥ 175 | The Inventor's "—I." signature traced across realities | Inbox + Trade Empire |
| ≥ 200 | **Eyes Music Video unlocks** (existing — surveillance-network compile) | Eyes Music Video cinematic |
| ≥ 225 | The Dreamer's Shield's location partially mapped | Trade Empire surface |
| ≥ 250 | Vex Solène's secret active status hinted (suspicious dossier; player can investigate further) | Trade Empire + Engineer-Bench post-resurrection audit |
| ≥ 275 | Confirmed: Vex Solène is out in the world, hidden from both Architect AND Dreamer's Shield | Late-game Codex entry |
| ≥ 300 | The multiverse stack fully revealed; player can name the prior reality's outcomes | Antiquarian's deepest journal layer |
| `convergence_climax_reached` | Full Codex 100% climax — all first-wave survivors identified; Servant Hero Academy onboarding has its final mission unlocked | Convergence Climax cinematic |

**Trade Empire and text-based investigation as narrative density per Phase:**

Per phase the Trade Empire surfaces new intel dossiers:
- **Phase 2-3:** Intel ≥ 25-50 — first Source-Kael hints; first thought-virus dossiers
- **Phase 4-5:** Intel ≥ 50-100 — Dreamer's Shield first mention; the Silence named; the Degen identified
- **Phase 6-7:** Intel ≥ 100-150 — cross-reality dossiers; Advocate Sacrum location partial decode
- **Phase 8-10:** Intel ≥ 150-200 — Inventor cross-reality signature; Eyes Music Video unlock at 200
- **Phase 11-12:** Intel ≥ 200-275 — Dreamer's Shield location mapped; Vex Solène secret hint
- **Phase 13:** Intel ≥ 275-300 — Vex Solène confirmed; multiverse-stack fully revealed
- **Phase 14:** `convergence_climax_reached` — Codex 100% climax

### 15.8j — Text-based game-mode integration for mystery surfaces

Every text-based game mode in the saga carries First-Wave-Mystery investigation breadcrumbs:

| Mode | First-wave-mystery role |
|---|---|
| **Inbox transmissions** | Cross-reality `—I.` signatures (the Inventor sends messages from before/after he died in adjacent realities); the Degen sends direct messages to the player from Phase 4 onward |
| **Watcher's Eyes dispatches** | Surveillance dossiers from adjacent realities; the Eyes can canonically read across realities (her network spans the stack) |
| **Broadcast library** | "Cross-stream interference" broadcasts surface first-wave figures' voices from alternate realities |
| **Antiquarian's Journal** | The Journal's deepest pages are cross-reality entries; the player accesses these progressively |
| **Akai Shi questline** | Her resurrection canonically crossed realities; her investigation log surfaces cross-reality clues |
| **Wraith Calder questline** | Some Syndicate twins are dual-reality entities; Wraith's revenge spans the stack |
| **Wolf's Hunt-the-Hero text encounters** | Some corrupted Servant Heroes escaped from adjacent realities into the Crucible; Wolf's hunts cross the stack |
| **Hamlet playthroughs (text-heavy)** | The play references the Architect's recurring pattern across realities |
| **Apprentice banter (text)** | Memory Cards from fallen apprentices canonically carry cross-reality memories (the inheritance system spans the stack) |
| **Mechronis Academy text content** | 5-archon training records reference cross-reality students (the Mechronis Academy exists in MULTIPLE realities; the Game Master archon canonically transferred between realities to be admitted to the Hierarchy as the 9th Archon) |
| **Celebration text content** | The "one-survivor-per-year" tradition canonically holds across realities — every reality's Celebration produces one survivor; the player is one of many |
| **Servant Hero Academy text content (post-Phase-14)** | The Academy curriculum references "the prior reality's mistakes" — explicit cross-reality canon teaching |

### 15.8l — The 12 Ne-Yons (extinct lineage, locked canon — the Degen is the last survivor)

**Canonical cosmic count (LOCKED via existing canon):** there were **12 Ne-Yon entities** — cosmic beings embodying fundamental forces. **11 are extinct; the Degen (Ne-Yon #8) is the only surviving one.**

The Ne-Yons are NOT the same thing as the Ne-Yon race (the hybrid third species — DeMagi / Quarchon / Ne-Yon). The 12 Ne-Yons are **cosmic-tier entities** that the Ne-Yon RACE is descended from. The Advocate, for example, is a Ne-Yon-race member; the Degen is a Ne-Yon-entity (and concurrently a first-wave Potential).

| # | Ne-Yon | Status | Canonical note |
|---:|---|---|---|
| 1-7 | (unnamed at this canon tier) | Extinct | Each lost / fell / was unmade in pre-saga eons |
| 3 (specific) | (unnamed) | Extinct | "Lost a bet to the universe; the bet was about how long she could stay awake" (per `npc-the_degen-lines.json`) — locked as a saga-tier flavor canon |
| 8 | **The Degen** | **Active (last survivor)** | 15,000+ years old; embodies entropy and corruption; first-wave-Potential dual-status |
| 9-12 | (unnamed at this canon tier) | Extinct | Saga reveals progressively which are dead and which are sealed |

**Codex contribution:** each Ne-Yon's fate is a separate Codex entry. Locating which Ne-Yons are TRULY extinct vs which are sealed (parallel to the Advocate's Sacrum sealing) is a sub-mystery of the First Wave investigation. **Specifically: is the Silence the 9th Ne-Yon?** (Plausible per existing canon; Codex unlock at intel ≥ 200 surfaces this possibility.) The Degen knows the answer and will tell the player at trust 10.

### 15.8m — The Casino (full game mode, existing canon, deep lore integration)

**Codebase reality:** the Casino is **fully implemented** as a game mode — server-authoritative play via `apps/server/routers/casino.ts`, with `apps/shared/casinoGames.ts`, `casinoPazaakTournament.ts`, deterministic Mulberry32 RNG for auditability. Existing surfaces:

- **13+ games:** Pazaak 21, Void Slots, Entropy Dice, Nebula Poker, Quantum Roulette, Liar's Dice, Dream Roulette, Card Battler's Gauntlet, Void Blackjack Tournament, Faction War Betting, Dischordian Mahjong, Void Bingo, Void Case
- **`apps/shared/degenTrustGating.ts`** — trust cap 10; Dead Man's Circuit (DMC) rumor at trust 5; entry pass at trust 8 (earned via Pazaak wins)
- **`apps/shared/degenPazaakMilestones.ts`** — 1-win, 5-win, 10-win narrative gates
- **`apps/shared/degenVoManifest.json`** — 12 casino tale tracks (`degen_tale_00` through `degen_tale_11`)
- **`apps/scripts/npc-the_degen-lines.json`** — dialogue trees across 5 topics (past, calling, relationships, secrets, philosophy) with trust-phase regression
- **TCG card:** `s1_char_023_the_degen` — 5-cost Rare Dreamer unit (4/6); keywords `overcharge` + `pierce`; flavor: *"Ne-Yon #8. The casino host pours your drink with hands that have shuffled the fates of civilizations."*
- **`docs/production/CASINO_EXPANSION_ART_BIBLE.md`** — full environment design (hyper-realistic sci-fi; obsidian gaming tables; neon amber/gold lighting; corrupted magenta accents; foxfire-green felt; main floor stretches into void; VIP lounge in amber force-field bubbles with trophy cases)

**Casino canonical location (LOCKED):** A roulette-wheel-shaped space station orbiting dead space, located on **the edge of the Dreamer's Shield** — a liminal zone between order and void in Ne-Yon space (pocket dimension). The Degen **inherited** it from the **Trickster** after the Casino Heist; he did not build it.

**Casino's narrative role in the saga walkthrough:**

| Phase | Casino activity | Codex contribution |
|---|---|---|
| **Phase 4-5** | Casino first accessible (trust 0); player meets the Degen; first Pazaak tutorial; the Degen's casino-tale-00 VO surfaces | First-wave-survivor section opens; the Degen named |
| **Phase 6-7** | Trust 1-3 builds; player learns of the Casino Heist (the Degen's past-topic dialog tree); cross-reference with the Inventor's prelude vignette canon | Casino Heist crew Codex entries unlock |
| **Phase 8** | Trust 4-5; **DMC (Dead Man's Circuit) rumor unlocks at trust 5**; player begins investigating the Coda funding line | DMC and Coda Codex entries |
| **Phase 9** | Trust 6-7; the Degen's calling-topic dialog tree (his Trusteeship arc) surfaces; Mol'Vereth's audit-cadence canon | Trusteeship Mystère Engine arc E1-E2 |
| **Phase 10-11** | Trust 8 (entry pass) earned via Pazaak wins; **VIP lounge unlocks**; player accesses trophy-case artifacts from legendary past gamblers (each artifact = a major first-wave-figure Codex entry) | VIP lounge artifacts (~15 Codex entries) |
| **Phase 12** | Trust 9; the Degen's relationships-topic dialog tree surfaces; **Jericho Jones's Iron-Clad Lion callsign training canon revealed** (the Degen is mediating Jericho's training on the Heart of Time) | Jericho arc cross-link Codex entries |
| **Phase 13** | Trust 10 (max); the Degen's secrets-topic + philosophy-topic dialog trees open; **the 12 Ne-Yons full reveal — which are extinct, which are sealed, possibly the Silence's identity confirmed**; settlement at the Empty Table (Mystère Engine E5 — Degen's first direct letter to the saga) | Full Ne-Yon Codex section unlocks (12 entries); the Silence-as-9th-Ne-Yon Codex entry (if locked) |
| **Phase 14 (post-pivot)** | Casino canonically transitions to a Servant-Hero-Academy-aligned operation; the Degen joins the Academy as the "Ne-Yon-in-Residence" — bringing 15,000 years of perspective to the new students | Servant Hero Academy curriculum Codex entry |

**Casino-vs-Hub Hub-vote integration:** the Degen can be invited to advise on a Hub vote IF the player has earned trust ≥ 5. His advisor register is **Quarchon-rivaling fatalist Ne-Yon** — entropic, world-weary, knowing the long-shot odds. He is the saga's FIFTH possible advisor (alongside Elara / Human / Active Apprentice / First-Wave Survivor) — but accessible ONLY at the Casino, not at the Hub. **The player must physically visit the Casino to ask him.** This makes the Casino a permanent detour worth taking.

### 15.8n — The Casino Heist (the saga's defining backstory, LOCKED — extends Inventor + Heart-of-Time canon)

**The Casino Heist is the canonical backstory for how the Potentials acquired the Heart of Time.** Existing canon (LORE_BIBLE + `npc-the_degen-lines.json`):

**The crew (LOCKED):**
- **The Inventor** — led the heist; played the decisive poker hand
- **The Engineer** — provided technical support (the heist required Bench-tier engineering)
- **The Eyes** — provided surveillance / counter-surveillance
- **Iron Lion** — provided the muscle / extraction protection
- **Kael (then The Recruiter, pre-Source-corruption)** — provided Insurgency contacts and an inside line
- **Malkia Ukweli** — the real-world singer/songwriter canonized as an in-game heist crew member; **she is the artist whose name appears on every Advocate-arc song credit** (LORE_BIBLE Advocate dossier: "[Apple Music link to Malkia Ukweli — The Panopticon]"); canonically she is one of the Advocate's chosen voices made flesh
- **The Degen** — bar cover + insider casino knowledge + entropy-play at the decisive poker hand

**The mark:** The Trickster (god of stories) — same Trickster referenced in S2 Ep 2.12's Baron episode. He owned the Casino. The Inventor's crew won it (and the Heart of Time he kept inside it) via long con. **The Baron's S2 Ep 2.12 line "I paid the Trickster to lose" canonically references this prior heist — the Baron used the Trickster's loss to his crew as leverage for his own Heart-of-Time recruitment of the Potentials' second-wave heist crew.** Cross-arc lock.

**The outcome (LOCKED):**
- Crew won the Casino → inherited by the Degen
- Crew won the Heart of Time → kept by the Inventor → flew it during the Fall → passed to the Potentials in S2 Ep 2.1
- Crew dispersed in the years after → the Inventor went on to build the time-traveler legend → the Engineer returned to the Bench → Iron Lion went to Veridian Prime → the Eyes went to her surveillance network → Kael went to the Insurgency and was corrupted into the Source → Malkia Ukweli's voice became part of the saga's music → the Degen settled into the Casino as host

**The heist crew IS the first wave — at an earlier point in their lives, pre-Fall.** The Engineer, Inventor, Eyes, Iron Lion, Kael, Degen and Malkia Ukweli are the same first-wave figures the Antiquarian preserves the chronicle of — but the Casino Heist is set in their **pre-Fall lives, in the Age of Prophecy, BEFORE they boarded the Inception Arks for cryostasis.** The Engineer who built the Inception Arks (LORE_BIBLE:6686) is the same Engineer who provided technical support at the heist. Kael was the Recruiter then; he was corrupted into the Source later. The Degen — being a 15,000-year-old Ne-Yon — is the only crew member whose lifespan brackets the entire arc from pre-Fall heist through post-Fall casino-host present-tense. **The Codex's deepest reveal is not a separate cohort but the same first wave's pre-Fall era — the era in which they ALREADY HAD the Heart of Time, ALREADY KNEW each other, ALREADY WON the multiverse-game tool that the Architect would later try to take back.**

**Codex Casino-Heist section (NEW):**
| Entry | Unlock |
|---|---|
| The Trickster's Casino (the original venue) | Phase 4 (Casino first accessible) |
| The Inventor as heist leader | Phase 5 (Inventor's prelude vignette + Casino trust 2) |
| Engineer's heist-era engineering | Phase 5 (Engineer Eps 1-4 + Casino trust 3) |
| The Eyes' heist-era surveillance | Phase 6 (Eyes video + Casino trust 4) |
| Iron Lion's heist-era extraction protection | Phase 8 (CADES introduction + Casino trust 5) |
| Kael as the Recruiter (pre-Source) | Phase 7 (Source's planet + Casino trust 5) |
| Malkia Ukweli as the singing voice | Phase 6 (Album Slideshow drop + Casino trust 4) |
| The Degen as bar cover + decisive entropy-play | Phase 8 (Casino trust 6) |
| The decisive poker hand | Phase 13 (Casino trust 9) |
| The Heart of Time as the prize | Phase 13 (Casino trust 10 + Codex 100%) |

### 15.8o — The Coda (Degen-funded operation, NEW canon integration)

**The Coda** is an operation the Degen canonically funds via brokerage-camouflaged commission routing (per Mystère Engine E3-E4). Cross-locks with the Game Master archon arc (Xeth'Raal's continuance letter names the Coda). Implementation per `degenTrustGating.ts` + the Degen's Trusteeship Mystère Engine.

**Codex Coda section:**
| Entry | Unlock |
|---|---|
| The Coda exists (rumor) | Phase 8 (Casino trust 5 — DMC unlock) |
| The Coda's books (camouflaged accounting) | Phase 9 (Casino trust 6 + Mystère E3) |
| Ozhul'Vana's threat to the Coda funding | Phase 10 (Casino trust 7 + Mystère E4) |
| The Settlement at the Empty Table (Degen's 100-year witness arrangement) | Phase 13 (Casino trust 10 + Mystère E5) |
| The Coda's purpose fully revealed | Phase 13 / 14 — the Coda is canonically the **second wave's underground support network**; the Degen has been funding their survival from the Casino since the Fall |

### 15.8p — Mol'Vereth & Ozhul'Vana (Hierarchy demons in the Degen's Trusteeship arc, NEW canon integration)

**Mol'Vereth** — Hierarchy demon; the Degen is canonically the trustee of Mol'Vereth's principal under a contract authored at the Ne-Yon casino. Annual audit cadence.

**Ozhul'Vana** — Hierarchy demon, monetization-minded senior partner; threatens the Coda funding line via routine audit.

Both are added to the saga's Hierarchy lord registry (`hierarchyOfTheDamned.ts`) per PR scope. They appear as Casino-arc-specific Hierarchy lords.

### 15.8q — Malkia Ukweli (the singing voice, real-world-canonized character)

**Malkia Ukweli** — real-world singer/songwriter canonized as an in-game heist crew member + as the in-saga voice that performs the Advocate-arc songs (LORE_BIBLE Advocate dossier credits her Apple Music / Spotify / Tidal links). **She is the saga's diegetic acknowledgment of the real-world artist.** Cross-locks with the Servant Hero Academy's Lions International Convention surface (Orlando) — both are the saga's real-world-anchoring beats.

**Codex Malkia Ukweli entry:**
- Phase 6 (Album Slideshow drop — her voice is what the player hears in the slideshows)
- Phase 14 (Servant Hero Academy onboarding — she may appear at the Lions International Convention canon-beat)

### 15.8r — Jericho Jones × Iron-Clad Lion callsign × Heart of Time training (cross-arc lock)

**Jericho Jones** — appears as a Potential in S2 Ep 2.1 ("you made the choice to save us all, Jericho"). Existing canon reveals he canonically departed post-Battle of Thaloria aboard "a strange golden spaceship shaped like an eye with a glowing green crystal" — the Heart of Time. **He is currently training on the Degen's vessel under the Degen's mediation. His callsign is Iron-Clad Lion** (a tribute to the fallen Iron Lion of Veridian Prime — Phase 10 / CADES M7).

**Codex Jericho cross-arc entries:**
- Phase 8 (S2 Ep 2.1 — Jericho introduction)
- Phase 12 (Casino trust 9 — Jericho's training arc surfaces via Degen relationships dialog)
- Phase 13 (Casino trust 10 — full Jericho × Iron-Clad-Lion canon)
- Phase 14 (Servant Hero Academy — Jericho may be a recurring service-hero character in the franchise pivot)

### 15.8s — The Silence reconciliation (existing canon + user's Season-3 extension)

Both readings hold:

| Layer | Reading |
|---|---|
| **Operational tier (existing bible canon)** | The Silence is a Ne-Yon, Information Twin paired with The Word, active in Late Empire; she hacks the Authority; the Antiquarian acknowledges her as a peer who found what he hid. |
| **Cosmic tier (user-canon extension)** | At the deepest cosmic tier she is the Antiquarian's opposite — the chronicler preserves, the Silence erases. |
| **Current status (user-canon extension)** | **Currently OFF THE BOARD with the Advocate** — she withdrew sometime between the Late Empire era's events and the saga's present-tense. Her withdrawal is the reason the player encounters silence-where-there-should-be-her in S1 Ep 1.16's "Silence in Heaven" slideshow drop. |
| **Return-beat (existing bible event canon)** | The **Silence in Heaven cosmic event** (LORE_BIBLE:9988-10032) — Revelation 8:1 half-hour cosmic pause; The Reckoning era; release 2026-07-30 — is canonically her return. Phase 13 (S2 Ep 2.14) is when the player's saga arrives at her return-beat. |

**Codex Silence section:**
- Phase 4-5 (intel ≥ 75) — first named as a character
- Phase 7 (S1 Ep 1.16 — Silence in Heaven slideshow drop, half 1)
- Phase 10 (intel ≥ 200 — speculation that she may be the 9th Ne-Yon)
- Phase 11 (Casino trust 8 — VIP lounge artifact: a trophy attributed to "The Silence" hangs in the case)
- Phase 13 (S2 Ep 2.14 — Silence in Heaven slideshow drop, half 2; her cosmic-event return-beat fires)
- Phase 14 (Servant Hero Academy — if she has returned, she may appear in the post-saga DLC as an active operative)

### 15.8t — The First Wave Codex extended with cross-reality + first-wave-active sections

The First Wave Codex (Part 14) extends with three new sections:

| Section | Trigger | Contains |
|---|---|---|
| **First-Wave Survivors (where they are)** | Phase 7 (Wolf unlock) onward | Pre-death + post-resurrection profiles for Wolf, Akai Shi, Wraith Calder, the Degen, Vex Solène, the Advocate, the Silence; **completion = locate all 7** |
| **Cross-Reality Dossiers** | Phase 4 (Trade Empire intel ≥ 50) onward | Cross-reality intel from adjacent realities; each dossier = an alt-reality outcome the player can study |
| **The Dreamer's Shield Map** | Phase 4 (Trade Empire intel ≥ 50) onward; full map at intel ≥ 225 | Progressively reveals the shield's location, structure, and who shelters inside; completion = locate the shield |

**Codex completion thresholds (revised for the deeper mystery):**

| Codex % | Unlock |
|---|---|
| 25% | Antiquarian's first letter to the second wave (existing) |
| 50% | Wolf's hunt unlocks (existing) |
| 75% | Servant Hero Academy extra mission (existing) |
| 80% | **First-Wave Shield section unlocks; player can name some shielded Potentials** |
| 85% | **Cross-Reality Dossier section's first 5 entries unlock** |
| 90% | **Vex Solène's secret active status hinted (not yet confirmed)** |
| 95% | **The Silence named explicitly; her arc opens for post-saga DLC** |
| 100% | **The alternate Antiquarian inscription + Vex Solène confirmed active + multiverse-stack fully revealed** — *"The second wave read what the first wave wrote. The second wave did not write the same thing back. There are realities behind the realities. The chronicle has not ended; only the chapter has."* |

### 15.9 — Suggested new building blocks (per "feel free to suggest plans to build what you need")

| Build | Purpose | PR slot |
|---|---|---|
| **Thought Virus Outbreak event broker** (`apps/shared/thoughtVirusOutbreak.ts`) | Cross-mode dynamic-event system; fires across TCG + TD + Trade Empire + Hub + Apprentice when triggered | PR 34 |
| **Album Slideshow framing-device kind** (`concept_album_slideshow` variant of `last_words_slideshow`) | Surface for the 5 albums; reuses input-locked audio + cross-faded stills + Antiquarian outro pattern | PR 35 |
| **Hamlet Playthrough mode** (`apps/shared/hamletPlaythrough.ts` + 3 staged surfaces: I-audience / II-interactive / III-authored) | Recurring play-within-the-play; reuses TCG combat + Hub vote-shape + dialog system | PR 36 |
| **Collector's Arena** (`apps/shared/collectorsArena.ts` + 5 tiers × 5 fights = 25 fight definitions + Memory Shard payload format) | Persistent Prisoner-Oracle TCG-arena combat; nested-location lock | PR 37 |
| **Battle/level narrative-justification ledger** (`apps/shared/battleNarrativeJustifications.ts`) | Every battle has a `narrativeReason` field linking it to a saga beat; ship:check enforces no orphan battles | PR 38 |
| **Album drop sequencer** (`apps/shared/albumDropSchedule.ts`) | Pacing-budgets the 5 albums into specific phases; ensures no two albums drop within the same 60-minute window | PR 39 |
| **Walkthrough state machine** (`apps/shared/sagaWalkthroughPhases.ts`) | Saga-wide phase tracker; surfaces the player's current phase in the Hub UI; gates content unlocks per phase | PR 40 |

Effort for these 7 building blocks: ~85h additional. Brings total saga-build effort to **~557h ≈ 17-18 weeks.**

---

## Thesis

The producer drop doesn't add a new structural layer — it cinematically activates layers the codebase already wired:

- **5-class system** → text previews in early-act questline-Ch1; cinematic payoffs at canonical climax beats.
- **Engineer governance vote system** → 6 episodes wire 6 of 7 recordings; Ep 7 is audio-only by design.
- **CADES FPS Godot iframe** → Iron Lion + Agent Zero pay off at M7 + M6 respectively.
- **Kael Fragment / Terminus Swarm milestone** → Wave 10 cinematic doubles as the canonical Kael unlock.

The **Oracle governance system** + the **three-advisor stack (Elara · Human · active Apprentice)** + the **framing-device presenter set** + the **9 universal video votes** + the **persuasion mechanic** + the **Inventor meme-framing on every vote** + the **breaking-point Hub integration** are the seven NEW structural pieces. Each is additive on top of existing surfaces — **and the Apprentice chair specifically reuses the fully-shipped 12-archetype apprentice system (`apprentices.ts`), not a new character.**

After this work: every player sees every major NPC video in canon-correct order, played as part of the diegetic world (no modal pops); **every cinematic in the producer drop has a paired Governance Hub vote** (21 producer-canon votes total) — the Hub is the single locus where the saga's cinematic memory becomes a living deliberation; every governance vote can be talked over with **three voices** — Elara (head, from start), the Human (gut, post-Reveal), and the **player's active apprentice (heart, in 12 archetypal voices)** — each with agency and persuadability; the **active apprentice's advice is shaped by their existing bond / corruption / architectInfluence / doctrine state** — so a high-corruption Heretic gives different counsel than a high-bond Sentinel on the same vote, and a high-architectInfluence apprentice may be quietly counseling the Architect's preferred read while the player thinks they're getting honest advice; **persuasion attempts emit existing deltas** (bond / corruption / architectInfluence / romance tension) into the existing apprentice logs, so Hub behavior changes the apprentice's 28-day-trial trajectory; **high-stakes Hub votes can BE the breaking-point trigger** for the active apprentice's personal quest, with `deepened` or `broken` resolution per player-apprentice vote alignment; when an apprentice graduates, dies, or betrays mid-cycle, the chair rotates to the next active apprentice and their Memory Card carries `lastHubVoteOpinion` forward to whichever new apprentice consumes it; **every vote page is framed by the Inventor's meme-show "did you know?" sticky note** post-`inventor_introduced`, signed `—I.`; the Engineer's tragic 6-episode arc closes by Act 2; the Oracle's parallel arc threads Acts 2-5 in counterpoint (Ep 6 = the moment **Shadow Tongue is summoned into the universe by the Collector's impersonation**, seeding the Heirophant / Thaloria / Star Whisperer religious lattice that pays off when **Wraith** arrives); the **Advocate prelude vignette plants the origin of the Blood Weave** at Beat F.5; the **Agent Zero vote 💯-canonically ties to the Engineer Last Words Slideshow**; CADES FPS missions become cinematic-payoff anchors for the two combat classes; the Terminus Swarm Wave 10 milestone delivers the canonical Kael Fragment unlock; the class-specific content layer makes the 5-class system feel personally addressed.

**Hands vs. mouth, building vs. reading — both end at the cost of self.** The Advocate rhymes one cosmic register up: *queen vs. eldritch, fighting vs. weaving — both end at the cost of soul.* The Source rhymes it cosmic-register higher still: *Kael who tried to save the Insurgency became the man who feeds the Architect.* **All three are the same tragedy at different scales — the saga's recurring proof that purpose corrupts toward the thing it opposes.**

**Season 1 IS Season 2's prologue. Season 2 IS Season 1's catastrophe.** The Potentials wake on Engineer-built Inception Arks (Ep 1.1) → they journey to the Source's planet (Eps 1.5-1.7) → wormhole to the crystal-city / Templum Veritus (Eps 1.8-1.16) → first-half-finale Side-Choice → Heart of Time theft (Ep 2.1) → New Babylon's Civil War (Eps 2.2-2.10) → Veridian Prime catastrophe (Ep 2.11 — Agent Zero dead, Engineer-death-circumstances unspecified) → Baron's time-heist backstory (Ep 2.12) → catastrophic War vote (Ep 2.14) → nanobot plague consumes reality → **THIS IS THE FALL OF REALITY** the Antiquarian narrates in Ep 1.1 → the loop CLOSES → the next cycle's Potentials wake to her emergency recording. The Inventor's Heart-of-Time intervention in Ep 1.1 is the only divergence — and the Inventor dies in Ep 2.14. **The loop can be nudged but not escaped from inside it.**

**The franchise pivot is the escape.** Servant Hero Academy launches in Orlando at the Lions International Convention — the genre shifts from war narrative to service narrative. The saga stops being about fighting your way out of the loop and starts being about serving the people you are looped with. **That is the Age of Servant Heroes.**

**Three voices at every vote. The third is one of twelve — and the twelve are fully distinct.** Elara is your head (always), the Human is your gut (post-Reveal, with cross-loop memory), **and the heart is whoever you are currently mentoring** — Zealot, Ghost, Scholar, Revenant, Artisan, Oracle, Wanderer, Martyr, Heretic, Jester, Sentinel, or Prodigal. The apprentice you trained yesterday tells you what they think today; the apprentice who died last cycle still casts a vote through the Memory Card in your pocket; the apprentice whose architectInfluence you didn't watch closely enough is counseling you in a voice that isn't quite their own. **The highest-payoff Hub moment in the entire saga is the active apprentice's archetype-specific reaction to Ep 2.11 — learning that Agent Zero died on Veridian Prime and the Warlord wore her body the whole time.**

**Naming is summoning. Mentorship is consequence. The loop closes itself every cycle. The franchise pivot is the only way out.** The Inventor's Heart-of-Time proves the loop can be nudged. The Antiquarian's 30-episode chronicle proves it has been nudged before. The Human's voice in Ep 1.1 proves someone is watching across loops, scoring the divergence. The Servant Hero Academy proves the saga is willing to walk away from the loop's logic entirely. **The Hub is the locus where loops change. The Potentials are the ones who change them. The apprentices are who carries the change forward when the Potentials are gone. And one day, when the loop is finally broken, the apprentices will be the Servant Heroes — and the chronicle will end, because there will no longer be a war to chronicle.**

**Underneath every system, one mystery: what happened to the first wave?** (Part 14.) Every game mode is evidence. Every Hub vote is a deliberation record. Every TCG card is a biographical fragment. Every CADES mission is a field recording. Every Tower Defense wave is a Source-fragment-pre-corruption shard. The First Wave Codex aggregates it all. The Codex's 100% completion entry is the canonical statement of the saga's bet: **"The second wave read what the first wave wrote. The second wave did not write the same thing back."**

**And one first-wave survivor walks among the second wave's evidence as a living warning. Lycos** — pre-resurrection — was a Quarchon Servant Hero of the Antiquarian's League. He died at the end of Season 1. **The Wolf** — post-resurrection — is what death made him: a fatalist Quarchon assassin hunting the Antiquarian's own corrupted Servant Heroes inside the Crucible, because the Hierarchy of the Damned infiltrated the pocket world during the Shadow-Tongue summoning the second wave hasn't yet seen. He is killing the heroes the Antiquarian engineered. He believes it is mercy. He is also, by his own corruption track, becoming the thing he hunts. **Three first-wave survivors — Lycos→Wolf, Akai Shi, Wraith Calder — share the same canonical pre-death / post-resurrection pattern, and one of them will probably sit at your Hub vote in Season 2, speaking from beyond death about a decision you have not yet made and they have already lived.**

**The shape of the entire app, end to end:** the second wave wakes on an Engineer-built ship to an Antiquarian recording, votes its way through a 30-episode chronicle of the previous wave's failure, mentors apprentices in 12 archetypes who will outlive any particular Potential, hunts corrupted Servant Heroes one by one with the Wolf as their fourth advisor, accumulates a Codex of every previous-loop fact every game mode can hand them, and arrives at the catastrophic War-Choice with — finally — enough evidence to choose differently. **Whether they do is the saga's only real vote.** Everything else is set-dressing for that decision. And whichever way it goes, the Antiquarian writes it down, because she is the keeper of every loop, and her ledger is the one thing in the multiverse that survives both the Fall and the franchise pivot.
