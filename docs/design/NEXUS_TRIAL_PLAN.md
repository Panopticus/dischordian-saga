# The Last Words Nexus — A Year-End Community Climax for Dischordian Saga

> *This is a long document (~1900 lines). The Executive Summary below is the leadership-readable version. The body is the engineering / production reference. Start with the summary; dive into the relevant section for detail.*

## Executive Summary

### What this is

A 72-hour year-end live event that lets the Dischordian Saga community collectively author the climax of the saga. Two named characters die permanently; one of the two core companions is permanently retired; the shape of Season 2's antagonist is chosen by community engagement. Modeled structurally on Mass Effect 2's suicide-run preparation, then fused with the existing Authority Trial card mechanic so that *the card game is literally the verb of the climax*.

### Why now

The codebase already ships ~85% of what this event needs — the Witnessing system, the Authority Trial-phase engine, the Convergence climax pattern, the Necromancer's cycle machine, the Vortex / Light-Dark dischordiaCycle, the Politician's 7-layer Ascension Ladder, the Memorial Wall, and the resurrection protocols list (including all 6 ballot-eligible NPCs). Section E (final-death cinematics, deferred from PR #678 to DLC) is the missing piece. This plan ships Section E by composing the existing infrastructure rather than building parallel systems.

### The three converging clocks (the year-long arc)

Three state machines already in the codebase tick upward across the calendar year and reach terminal state simultaneously in November, making the Trial the only resolution path:

1. **Vortex** (`dischordiaCycle.ts`) — galactic doomsday meter. Reaches `vortex_advance` and the drum motif arrives.
2. **Necromancer Cycle** (`necromancerCycle.ts`) — Thazulok at `Manifesting`. He authored the Resurrection Protocols. He is owed.
3. **Politician's Ascension Ladder** (`nemesisSystem.ts`) — apprentices climbing toward the vacant Archon-7 seat. The top rank is reached.

The Antiquarian convenes the Nexus Trial because all three clocks demand a price.

### The two community votes

| Vote | Phase | Window | Mechanism | Stakes |
|---|---|---|---|---|
| **Companion sacrifice** | Confession | Trial hours 48–60 | Confession-category card plays vote weight | Elara dies vs The Human dies |
| **Second-death ballot** | Preparation + Trial | November 1 → Trial hour 60 | Character-card plays vote weight, modified by recovered burnt cards | One of: Wraith Calder / The Wolf (Lycos) / Akai Shi / Vex Solène |

### Fixed deaths

- **Locke (Adjudicator)** dies as the Necromancer's price for going dormant. Fixed canon. The Resurrection Protocols list her — the Protocol refuses to lift only for her name.
- **One of four resurrected** dies as the Vortex's price. Community-voted. *The Three Potentials are the focus*; Vex Solène is the fourth ballot name (all four are on the existing Resurrection Protocols list).

### Post-Verdict Politician fork (Season 2 antagonist)

Resolved by Trial *engagement* (card-play volume) + *alignment* (Light/Dark balance at close). Three Season 2 variants:

- **seat_sealed**: high engagement + Light dominant → no Politician antagonist
- **constrained_return**: high engagement + Dark dominant → partial Politician (yellow tie, partial doctrine, no Mechronis Academy)
- **full_return**: low engagement → Politician returns at full strength as Season 2's primary antagonist

24 total Season 2 starting states (2 companion × 4 ballot × 3 fork) all pre-authored and shipped in the build; the world-state delta activates one.

### What it costs

- **Authoring retired** (the deliberate cancellation): ~8,000 lines of planned dialog + ~$20k of VO + ~6 card commissions + ~200h design = real money the studio does not spend in Season 2. Paid in narrative gravity.
- **Sunk cinematics** (the visible price of community authoring): ~$60k of pre-authored content that ships but never plays for the live community. Necessary and worth saying clearly.
- **Net authoring**: cost-positive (3,500 lines net reduction); cost-negative on cinematics ($60k sunk); infrastructure unlocked is permanent and reusable.

### What it unlocks

- ~4,500 lines of *new, composed* dialog (responding to a specific community outcome, not vacuum-authored).
- 4 new card/art assets (`the_humans_chip`, Memorial burnt-card variants).
- ~240 hours of permanent reusable infrastructure (patch service, drift test runner, Three Clocks panel, replay-pinning at scale, Politician-fork antagonist scaffolding).
- Season 2's antagonist arc, authored by community choice rather than studio decree.

### Timeline

**Target: March 2027.** 8 months from kickoff to T-7 days, 16 two-week sprints, plus the 6-week buffer recommendation built into the math. **Kickoff: late May / early June 2026.** Critical path: Sprint 1 (Audit-gap absorption) → Sprint 2 (Three Clocks data) → Sprint 3–4 (Three Clocks UI) → Sprint 5 (Mission framework) → Sprint 6–8 (5 Missions + Trial-format Act finales) → Sprint 9–10 (Tick service + Testimony) → Sprint 11–12 (Cinematics) → Sprint 13–14 (Season 2 variants + ripples) → Sprint 15 (Load test) → Sprint 16 (Final gates). Exact 72-hour Trial window within March 2027 set by producers at T-30.

### Crew during the 72-hour event

8 people: Event Director (owns abort), 2 on-call engineers, 2 community managers, narrative lead, VO director on standby, operator (hands on abort button). Mandatory 6-hour sleep windows. Trial dates flexible ±2 weeks for real-world-crisis avoidance.

### Top 5 risks (full register in body)

1. **`global_alignment_meter` has no runtime** — load-bearing for Vortex/Reclamation framing. **Sprint 1 must close this.**
2. **Coordinated bot/brigade vote campaigns** — mitigated by Witnessing-weight scaling (new accounts have ~0 weight). Brigading-by-organized-community is not an abort condition; only true exploits or bot-net pushes are.
3. **Cinematic doesn't land emotionally** — mitigated by playtest with non-team viewers at T-30 and voice direction confirmed against each character's bible.
4. **Politician-full-return outcome** (Vex sacrificed + low engagement) — *by design*, not a risk to mitigate. Producers prepared.
5. **Server failure during the 72-hour window** — mitigated by load test at 20× peak + hot standby + tested abort path with default cinematic ("the Antiquarian closed the ledger early").

### What needs sign-off to start

1. **The death framing**: Locke is fixed canon; the second death is community-voted from Wraith/Wolf/Akai/Vex. Confirm.
2. **The $60k sunk cost on unfired cinematic variants.** Confirm leadership accepts this as the deliberate price of letting the community author the climax.
3. **The Politician-full-return as Season 2's primary antagonist arc** if community engagement is low. Confirm narrative team is prepared to ship that variant.
4. **Trial dates** (flexible ±2 weeks for crisis avoidance). Lock at T-30.
5. **Crew composition** for the 72-hour live event (8 people, mandatory sleep windows, on-call rotation). Confirm staffing budget.
6. **Once-ever cadence**: this is not a repeating quarterly event. Confirm strategic intent.

### One sentence

*"In December, the Dischordian Saga community spends 72 hours playing card matches as testimony in the universe's last trial, and at the end one named character dies who the studio chose, one dies who the community chose, one companion is retired forever, and Season 2's antagonist is whichever shape the community's engagement bought."*

---

## Context

Dischordian Saga ships with seven acts, a Convergence climax (Act 7) offering three bad-choice resolutions, a working 72-hour doom-clock, a Witnessing system tracking Light/Dark alignment over a 17,000-year frame, a Trade Empire metagame with 24 political sub-houses, two core companions (Elara + The Human), a Loredex of 233 entities, and a card engine (Dischordia) whose Authority Trial in Act 1 §5.8 already models reality-as-courtroom across six trial categories.

What the game does **not** yet have is a moment where the community is forced to act as one, where time itself bends to collective will, and where loss is permanent and felt across every save. The Convergence resolves one player's run; it does not resolve the saga. Companions can be romanced but never lost; NPCs can be defeated but never silenced; cards can be burned in flavor only.

This plan proposes a year-end **Nexus Event** — a 72-hour live-service climax preceded by a two-month build-up modeled on Mass Effect 2's suicide run — that fuses the Convergence, the Witnessing, the Trial mechanic, and the card game itself into a single ceremony where:

1. The community collectively decides which version of reality crystallizes for Season 2.
2. **One of the two companions is permanently sacrificed** by community vote. Their card is burned server-side. Their VO manifest goes silent.
3. **Two named characters die and are removed from the canon** — Locke, the Adjudicator (fixed canon, the player's first friend, whose resurrection the protocol *refuses* as the Necromancer's price for banishment), and one resurrected character from a four-name ballot — the **Three Potentials** (Wraith Calder, The Wolf / Lycos, Akai Shi / Red Death) **plus Vex Solène** (the Maestro of The Coda, also on the Resurrection Protocols list as a transference case) — chosen by community vote during the Preparation phase. All future narrative potential for both goes with them. **This is Section E**, finally landed: the final-death cinematics PR #678 deferred to DLC, built on top of Sections A–D's resurrection infrastructure and triggered by the convergence of three escalating clocks (see below).
4. **Dischordia (the card game) is repositioned as the spine** of the universe rather than one mode among many. The card game's rules are the rules of reality. Every other system feeds it.

---

## The Vision in One Paragraph

The Antiquarian has been keeping a ledger for 17,000 years. At the end of the calendar year, the ledger overflows: too many Potentials have made too many incompatible Convergence choices, and reality begins to fracture along the seams. The Antiquarian convenes the **Nexus Trial** — the only Dischordia match in history played by an entire civilization at once. Across 72 real-world hours, every card played by every player in every mode is counted as testimony. The Trial follows the same six phases the player first learned in Act 1 §5.8 (Charge → Opening → Evidence → Cross-examination → Confession → Verdict). At the Confession phase, the Trial demands a price: one of the two core companions must offer themselves to stabilize the verdict, and the community chooses which by global vote. At the Verdict phase, **Locke** — the Adjudicator, the player's first friend, whose name sits in the Resurrection Protocols list alongside the Three — is consumed as fixed canon when the Antiquarian's pen *refuses to lift for her*. And **one of the Three Potentials** (Wraith Calder, Akai Shi, The Wolf) — three companions whom the resurrection has already saved once — has her or his resurrection unwound by community vote. When the dust settles, Season 2 begins in a world whose history was authored, in literal and verifiable terms, by the collective, with one fewer Potential walking the deck and an empty bench where Locke once filed.

---

## The Overall Arc — Three Escalating Clocks Converge

The Nexus Trial doesn't arrive out of nowhere. Three state machines already shipped in the codebase tick upward across the calendar year, and at year-end they collide. The Trial *is* what happens when all three reach terminal state at once. This is the arc that ties the campaign, the seasonal events, and the Trade Empire metagame into one story.

### Clock 1: The Vortex (galactic doomsday)

Source: `apps/shared/dischordiaCycle.ts`. The Vortex is a 0–100% doomsday meter that *only ticks up*. As community Dark Energy outpaces Light Energy, lit sectors dim → go dark → are consumed → are removed from the travel graph. The music layer shifts: `warm → neutral → dark → vortex` (the drum motif under 20% lit). The narrative voice ladders from *"The Vortex hums again"* → *"A drum in the deep sky"* → *"The drum is here."*

**What the arc does with it**: across Months 1–9, the Vortex hovers in `dimming`/`long_night`. In October (Fracture phase) it crosses into `vortex_advance`. By November (Preparation), the drum is here. The community's card-play during Preparation Mission 1 (Recover the Burnt Cards) is *literally* the Light Energy push-back — the cards played are the names rescued from consumed sectors before the Trial.

### Clock 2: The Necromancer's Cycle (the broker of return)

Source: `apps/shared/necromancerCycle.ts`. Thazulok / Archon 10 / the Necromancer authored the Resurrection Protocols 3,000+ years ago. His cycle: `Dormant → Stirring → Awakening (Elara detects it) → Manifesting (players declare for the Banishment Coalition or the Resurrectionist Path) → Returned (raid phase) → Banishment Arc → Banished (30-day cooldown, cycle repeats)`. Every Path-B resurrection (player ignored the quest, NPC returned via Necromancer transmission) has been feeding his Resurrection Energy meter all year.

**What the arc does with it**: this Cycle is the *only* Necromancer Cycle that does not complete its Banishment Arc cleanly. Instead, at the Manifesting phase in November, the Antiquarian intervenes and *redirects* the Banishment Arc into the Nexus Trial itself. The Necromancer is not banished by a community raid the way prior cycles ended; he is banished as a *consequence* of the Trial's Verdict — and his price for going dormant is **Locke**. The Resurrection Protocols list (which already contains `locke`) goes through; the Antiquarian's pen refuses to lift only for her.

### Clock 3: The Politician's Ascension Ladder

Source: `apps/shared/nemesisSystem.ts`. The Politician (Archon 7, destroyed by the Iron Lion 42 years pre-Fall) had her secret apprentices preserved in the Matrix of Dreams. The Necromancer's prior escape released them into the world *already remembering*. They climb a 7-layer Nemesis Ascension Ladder; the top tier is "Archon-aspirant," candidate for the Politician's vacant seat. Players have been promoting Nemeses through ranks all year without knowing what the top rung unlocks.

**What the arc does with it**: the Politician's return becomes the Nexus Trial's **post-Verdict fork**. If the Trial closes with high community participation and Light dominant, the Politician's seat is sealed permanently — the top-rank Nemesis is unseated and the apprentices collapse back into the Matrix. Season 2 has no Politician arc. If the Trial closes with low participation or Dark dominant, the seat opens, the Archon-aspirant takes it, and **the Politician's return becomes Season 2's primary antagonist arc** — with her doctrine, her cadence, her "Vote for" framing, and her yellow tie inherited by whichever Nemesis ascended. The community's *engagement* with the Trial — not just their vote — chooses Season 2's villain.

### How the three weave with Witnessing and Resurrection Protocols

The Antiquarian is the witness. The Witnessing system records every card match as Light Energy contribution. The Resurrection Protocols are the Necromancer's authorship of the death/return cycle. The Vortex consumes what is no longer witnessed. The Politician's apprentices ascend through the Matrix of Dreams, which is also where the Necromancer is dormant — the same place. Every system that ships today is already inside this loop; the Nexus Trial just makes the loop *terminal*.

**Vex Solène's hinge role**: her Coda (the underground network paralleling the Ocularum) is the arbiter of *which faction controls the Resurrection Protocols* at endgame. If Vex survives the Trial, the Coda holds the Protocols and the next decade's resurrections are diplomatic. If Vex falls (community votes her), the Coda dissolves and the Protocols revert to factional contest — Insurgency vs Hierarchy vs (potentially) the returning Politician for control.

---

## The Narrative Spine — Building Up Across the Year

The spine is calendar-aligned, with three phases. The first phase is the existing seven-act campaign with strengthened card-game integration (see "Dischordia as Spine" below). The second and third phases are new.

### Phase 1: Months 1–9 (existing — Acts 1–6, ships as-is with integration patches)

No changes to act structure or pacing. We strengthen the card-game framing throughout (see integration section). The Witnessing system continues to record every match. The Trade Empire seasonal tick continues to advance. By the time players reach Act 7, they've each built a Witness record the Antiquarian can quote back to them.

### Phase 2: Month 10 — **The Fracture** (October)

Act 7's Convergence opens normally for players who reach it. **What changes**: every Convergence resolution is broadcast on the Daily Brief feed as an Antiquarian ledger entry, attributed to the player's guild. The Daily Brief becomes a wall of incompatible futures. *And all three clocks tick into critical state at the same time*:

- **Vortex** crosses from `long_night` into `vortex_advance` — the drum motif begins playing under 20% lit sectors. Sectors start being consumed weekly. Players see actual holes appear in their travel graph. The Antiquarian narrates each consumption by name.
- **Necromancer Cycle** enters `Awakening` — Elara's VO announces the energy buildup. Players are prompted to declare for the Banishment Coalition or the Resurrectionist Path. The prior Path B transmissions accumulated all year are referenced in his manifesting dialog: he names every NPC he brokered back.
- **Politician's Ascension Ladder** reveals its top tier — the Archon-aspirant rank — and players see whichever Nemesis they've been promoting is now within one rank of claiming the Politician's seat. The yellow-tie iconography starts appearing on Nemesis dialog cards.

Server-side, when all three clocks cross threshold (≈40% epoch-chronicle disagreement on Witnessing, Vortex ≥80%, Necromancer at Manifesting, a Nemesis at Archon-aspirant somewhere on the playerbase), the Fracture event fires for all players regardless of act:

- A new card type — **Fracture cards** — appears in every collection, one per Convergence resolution the player has personally witnessed (their own + their guild's). Fracture cards are mechanically powerful but unstable: they roll a different ability each turn.
- `RULES_VERSION` bumps from `1.1.0` to `2.0.0-fracture`. Every replay before the bump is pinned to its old ruleset. The card game is, diegetically and literally, no longer the game it was last week.
- The Antiquarian's VO begins to stutter. The Witnessing system reports epoch-chronicle disagreement on the home page. The Daily Brief gains a **"Three Clocks" panel** showing Vortex %, Necromancer phase, and Politician's-ladder top-rank — all climbing.

This phase exists to make the climax inevitable in the player's gut before it's announced. By the end of October, the world feels structurally wrong — three different ways at once.

### Phase 3: Month 11 — **The Preparation** (November) — the loyalty arc

Modeled directly on Mass Effect 2's suicide-run preparation. Five Preparation Missions, one per week, each unlocking a "seat" at the Nexus Trial. Skipping or failing a mission has consequences at the climax.

1. **Recover the Burnt Cards.** Extend the `burnt_card_placeholder` mechanic into a roster. Hunt fragments across the Inception Ark for burnt cards representing companions and key NPCs. Each recovered card becomes part of your **Witness Hand** — the hand you'll be dealt at the Nexus Trial. Cards you don't recover, you can't speak for at the climax.
2. **Forge the Verdict Stream.** Return to the Authority Trial mechanic, but inverted: the player builds the verdict stream this time, not the defendant. Hones a trial-phase-constrained deck for use at the climax.
3. **Loyalty: Elara.** Personal mission resolving Elara's Senator-of-Atarion guilt arc. Romance gate (relationship ≥75, humanity morality ≥30) determines whether she trusts the player at the Confession phase.
4. **Loyalty: The Human.** Substrate-dive mission. The Human asks the player a question they cannot answer truthfully. Failure here means The Human will not stand beside the player at the climax.
5. **The Council of Sub-Houses.** Trade Empire mission. Negotiate which Trade Empire sub-houses pledge their card-faction strength to your seat. Each pledged house contributes a card-faction multiplier during the Trial.

Each mission is a card match in a constrained format. None is purely dialogue. The card game is the verb of the loyalty arc.

#### Preparation Mission detail — card-format, narrative, pass/fail, Trial carry-forward

The five missions release one per week through November (Week 1 → Week 5). Each runs as a card match in its own constrained format inside the existing engine, with no new core mechanics — the constraints reuse `trial_categories`, `Keyword.*`, faction tags, and the `unlockCondition` gate. Each mission **must be attempted** to unlock its corresponding seat at the Nexus Trial; skipping a mission seats the player at the Trial without that mission's bonuses. Failing a mission seats the player but inflicts its specific penalty. Passing a mission unlocks a unique buff for the player's Witnessing weight during the 72-hour live event.

##### Week 1 — Recover the Burnt Cards

> **Narrative**: The Inception Ark's hold has burnt cards scattered through forgotten storage compartments — cards that were lost in earlier Convergence events, cards from un-witnessed Trade Empire collapses, cards bearing the names of NPCs no player has spoken to in months. Locke gives the player the keys. Wraith Calder gives them the Recovery Ledger. They walk the Ark together.
>
> **Format**: **Salvage** — 5-card draft from a pool of 20 burnt-card placeholders (`burnt_card_placeholder.ts` pattern, extended to a roster). Each draft pick triggers a card-specific micro-match (3 turns, no win condition — just play the burnt card once successfully to "recover" it). The player drafts 5, plays 5 micro-matches, and walks out with the recovered cards added to their **Witness Hand**.
>
> **Constraints**:
> - Deck: any 30-card deck from the player's collection plus the recovered burnt card as a forced inclusion each round.
> - Burnt cards must be played from hand by turn 3, or the micro-match fails for that card.
> - `trial_categories` restricted to the burnt card's original category (a confession-burnt card requires confession-category support; a narrative-burnt card requires narrative-category support).
>
> **Pass condition**: Recover ≥3 of 5 drafted burnt cards.
>
> **Fail penalty**: Witness Hand at the Trial is dealt with 2 fewer cards. Antiquarian narration during Opening Argument loses the player's contribution.
>
> **Pass reward**: Each recovered burnt card is a **vote multiplier** for that NPC during the Trial. If a recovered burnt card was Wraith Calder's, the player's votes on the ballot for Wraith count 1.5×. (This is the only mission that directly biases the second-death ballot — and it cuts both ways: recovering a ballot candidate's burnt card makes the player louder *for* them, not against.)
>
> **Trial carry-forward**: Witness Hand size = base + recovered burnt cards. Maximum Witness Hand: 7 cards.

##### Week 2 — Forge the Verdict Stream

> **Narrative**: The Adjudicator's bench is empty — Locke is away preparing the Recovery Ledger for the Trial. The Antiquarian tells the player that the player must learn to file a verdict themselves, because at the Trial there will be no time to wait for an officiator. The player sits at Locke's bench, opens her ledger to a blank page, and is taught to read the trial-stream cadence in inverted form: the player *writes* the Charge while an AI defends.
>
> **Format**: **Reverse Trial** — Authority Trial mechanic with the player and AI roles inverted. Player runs all six phases sequentially against the AI, who plays a defendant deck constructed from the player's own Witness Hand (recovered cards from Week 1) plus the Antiquarian's curated additions. The player must win on aggregate verdict-deltas across all six phases — not just the final one.
>
> **Constraints**:
> - Deck: a trial-phase-constrained deck the player builds during the mission — exactly 6 cards per phase, totaling 36 cards, each card with `trial_categories` matching its phase slot.
> - The player may not use any single card in more than one phase slot.
> - Confession-phase slots require at least one card whose flavor mentions a companion (Elara or The Human) — the player must declare a confessional alignment.
>
> **Pass condition**: Win ≥4 of 6 phases on verdict-delta.
>
> **Fail penalty**: At the Nexus Trial, the player's card plays count at 0.75× weight in Charge and Opening phases. The Antiquarian will narrate around them.
>
> **Pass reward**: At the Nexus Trial, the player can play **2 cards per turn** in their first 3 turns of any match (the "filed" buff). This is the strongest individual mechanical buff available from Preparation.
>
> **Trial carry-forward**: The constructed 36-card deck becomes the player's default Trial deck. They can revise it during the Trial but the constraints from Week 2 remain.

##### Week 3 — Loyalty: Elara

> **Narrative**: Elara asks the player to walk with her into Atarion's substrate-archive — the same archive she destroyed evidence in when she was a Senator. She wants the player to see what she did, and to play the card match that judges her in the substrate's own court. She does not say what she wants the verdict to be.
>
> **Format**: **Tribunal** — a 3-phase Authority Trial (compressed) where Elara is the defendant, the substrate is the prosecutor (an AI deck of substrate-faction cards), and the player officiates. The player's choice of which evidence to admit is the mechanical hinge.
>
> **Constraints**:
> - Deck: the player uses Elara's own card deck — a pre-built deck of substrate / Dreamer / Atarion cards that Elara hands over at mission start. The player may not substitute their own cards.
> - At the end of each phase, the player chooses *one* card from the substrate's discard pile to admit as evidence. Each admission shifts Elara's verdict-delta and her relationship score.
> - Romance gate: relationship ≥75 unlocks an additional 4th phase where Elara cross-examines herself.
>
> **Pass condition**: End Tribunal with Elara's verdict-delta in the "redeemed" range *or* in the "guilty but accepted" range. Either is canonically valid; the player chooses Elara's relationship to her own past.
>
> **Fail penalty**: Elara does not appear in the Confession-phase ceremony of the Trial. If she becomes the sacrificed companion, her cinematic plays *without the romance tag* even for romanced players — the player's failure here forecloses the private goodbye.
>
> **Pass reward**: At the Confession phase, Elara's vote-tally on her own behalf is *visible* to the player in real time (not just the aggregate community tally). The player sees how the Trial is leaning before voting.
>
> **Trial carry-forward**: Elara's card variant unlocks one tier higher (relationship-bronze → silver, silver → gold, etc.) for use in the Trial. If Elara is sacrificed at Confession, this carry-forward is meaningless — but if she survives, the player carries an Elara card into Season 2 that no skip-Week-3 player has.

##### Week 4 — Loyalty: The Human

> **Narrative**: The Human takes the player into the Inception Ark's substrate-dive bay — the same room the player first met him on. He hooks them both in. Inside the substrate, he asks the player a question. The question is different for every player; it is composed at runtime from the player's own Witnessing record. The question is one the player cannot answer truthfully without cost.
>
> **Format**: **The Question** — a 1-phase Confession-only card match. The Human's deck is composed from the player's own card-play history; the player's deck is whatever they bring. The player plays one confession-category card per turn; The Human plays a counter from their (the player's) own history. The cards become a dialog.
>
> **Constraints**:
> - Deck: any 20-card deck the player brings, with the restriction that ≥10 cards must have `trial_categories` including `confession`.
> - The Human's deck is *generated server-side* from the player's Witnessing record — specifically, from cards the player played in Acts 3–6 to advance the story. The player cannot see this deck before the match.
> - The match has no traditional win condition. It ends after 7 turns. The state at end-of-turn-7 is the player's answer.
>
> **Pass condition**: At end-of-turn-7, the player's verdict-delta is *not zero* — i.e., the player committed to *some* answer rather than playing neutrally. Both a high-positive and a high-negative delta pass. Only a perfectly neutral score fails.
>
> **Fail penalty**: The Human does not appear at the Confession phase. If he becomes the sacrificed companion, his cinematic plays without the romance tag. Critically: the chip in his final cinematic is never picked up — even by romanced players. The Season 2 `the_humans_chip` card does not unlock for this player.
>
> **Pass reward**: At the Confession phase, the player's confession-category cards count at 1.5× weight in the companion-sacrifice vote. The player can swing the vote.
>
> **Trial carry-forward**: The Human's card variant unlocks one tier higher (mirror of Week 3's reward for Elara). If The Human survives Confession, the player carries his tier-elevated card into Season 2.

##### Week 5 — The Council of Sub-Houses

> **Narrative**: Twenty-four Trade Empire sub-houses meet on neutral ground. The player walks the chamber. Each sub-house's allegiance is for sale, but the currency is not credits — it is *cards*. The player must trade card-faction strength to pledged sub-houses, building a coalition that will multiply their card-faction power during the Nexus Trial.
>
> **Format**: **Bidding War** — a Trade Empire negotiation surfaced as a card draft. The 24 sub-houses each post a "demand" (a card or card-faction requirement). The player has 5 trade rounds to pledge cards from their collection in exchange for sub-house support. Each pledge removes the card from the player's deck for the duration of the Trial — it is *given* to the sub-house.
>
> **Constraints**:
> - Deck: the player's full collection is fair game. Pledged cards return to the player's collection in Season 2's first week.
> - The player may not pledge more than 3 cards to any single sub-house.
> - Pledging to a sub-house aligned with the player's Trade Empire path is at 1.5× weight; pledging to a hostile sub-house is at 0.5× weight.
> - Pledging Locke's card *or* any ballot candidate's card to *any* sub-house is forbidden. The Antiquarian explicitly refuses the trade. (This is a guardrail: the player cannot trade away the characters whose deaths the Trial will decide.)
>
> **Pass condition**: Secure pledges from ≥6 of 24 sub-houses across all five card factions (at least one sub-house per faction).
>
> **Fail penalty**: At the Trial, the player's card-faction multipliers default to 1.0× for all factions — no bonuses, no penalties. The player fights uncoalitioned.
>
> **Pass reward**: At the Trial, the player's card plays in their pledged factions count at multipliers ranging from 1.2× (one sub-house) to 3.0× (all 24, near-impossible). Most players will land at 1.4–1.8× across two or three factions.
>
> **Trial carry-forward**: The pledge map is persistent through the Trial. Cards pledged are returned in Season 2 Week 1 with a "—pledged at the Council" annotation in the Loredex.

#### Cross-mission constraints

1. **Order is fixed.** Week 1 → Week 5. The player cannot complete Week 3 (Elara's loyalty) before recovering her burnt card in Week 1 (if applicable) or learning to file a verdict in Week 2. The narrative arc is linear inside the month.
2. **Each mission is one-shot.** The player gets one attempt per mission. Re-attempts are not offered, even on failure. This matches Mass Effect 2's suicide-run preparation — the prep is *itself* the test.
3. **Skipping is allowed.** A player who logs in only during the Trial can still seat — they will just be uncoalitioned, with no Witness Hand, no filed buff, no companion confession bonuses, and no recovered burnt-card multipliers. Their voice in the Trial is the baseline 1.0× weight.
4. **Pass/fail outcomes are surfaced on the Daily Brief.** Aggregate community pass-rates per mission are visible. Players see what the playerbase has prepared for; producers see which mission needs telegraphing.
5. **All five missions ship before October's Fracture event.** The Preparation Phase opens November 1, the Fracture event fires in October — so the missions must be in the build, gated by `unlockCondition: 'fracture_completed'`. This puts the implementation deadline two months ahead of the Nexus Trial itself.

#### Trial seat composition — what carries forward in aggregate

Every player who reaches the Nexus Trial sits with a per-player buff profile composed from their five missions:

```
Witness Hand size:           5 + (recovered burnt cards from Week 1)
Filed buff (extra plays):    +2 turn-1-to-3 plays if Week 2 passed
Elara confession visibility: enabled if Week 3 passed
Human confession weight:     1.5× if Week 4 passed
Faction multipliers:         1.0× baseline + Week 5 sub-house bonuses per faction
Ballot vote weight bias:     1.5× for any ballot candidate whose burnt card was recovered
```

This profile is the player's *individual* contribution shape. Aggregate across the playerbase, it composes the community's voice at the Trial. Players who prepared loudly speak loudly. Players who skipped speak baseline.

### Phase 4: Month 12 — **The Nexus Trial** (December) — the climax

72-hour real-world live event. The Antiquarian presides. The Six Trial Phases run sequentially over the window (12 hours per phase, with a 12-hour Verdict cooldown):

| Phase | Window | Community Action | What's at Stake |
|---|---|---|---|
| **Charge** | Hours 0–12 | Defensive cards only; community plays to define what the Trial is *about*. Aggregate verdict-deltas across all matches choose between three Charges (Architect-aligned, Dreamer-aligned, Insurgency-aligned). | Sets the framing for every subsequent phase. |
| **Opening Argument** | Hours 12–24 | One narrative card per match; chosen card's flavor is read aloud by the Antiquarian on the Daily Brief. Top-played card becomes the canonical opening. | Authors the Trial's opening narration verbatim. |
| **Evidence** | Hours 24–36 | Evidence-category cards. Each card's `trial_categories` aggregate stake counts toward a faction's case. | Builds the body of canonical truth Season 2 inherits. |
| **Cross-examination** | Hours 36–48 | Reactive cards only. Faction whose evidence was strongest in the prior phase now faces challenges; reactive-card aggregate decides which evidence survives. | Burns evidence that doesn't survive scrutiny — and the cards themselves. |
| **Confession** | Hours 48–60 | **The Sacrifice.** Confession-category cards played for Elara count as testimony for her survival; cards played for The Human count for his. Running tally surfaced on the Daily Brief and on the Codex. | The losing companion is permanently retired. |
| **Verdict** | Hours 60–72 | Final tally aggregated. Winning faction announced. The named NPC bound to the losing faction's keystone dies on-screen in the Verdict cinematic. | Season 2's starting state is locked. |

During each phase, **every card played in every mode** — PvP, story matches, Trade Empire conflicts, even AI practice matches — contributes testimony weighted by the player's Witnessing record. Players with longer, more decisive histories speak louder.

The Trial is unwinnable in the conventional sense. There is no good outcome. Every resolution costs something irreversible.

---

## The Sacrifice — Companion Vote

At the Confession phase, the Trial demands one of the two companions. The community votes by playing confession-category cards on the companion's behalf.

- **Elara survives** → her Senator-of-Atarion arc continues into Season 2. The Dreamer / humanity axis dominates the new era. Rose-hued substrate content recedes; cyan-hued political content expands.
- **The Human survives** → his identity reveal echoes forward. The substrate / machine axis dominates. Elara's farewell becomes the most-quoted scene in the franchise.

**Server-side effects** when the vote closes:

1. The losing companion's `companion_id` is moved into a `companions_retired` registry. They no longer appear in `companionData.ts`, `companionComments.ts`, or `companionAskTopics.ts` lookup paths — those return a memorial entry instead.
2. Their character card is flagged `retired: true` in the registry (a new flag, distinct from `reserved`). Existing instances in player collections are replaced with a **burnt card** variant — the original art darkened, edges blackened, with the recovered memory text from Act 1 §5.8 as flavor. Mechanically inert.
3. Their VO manifest entries are archived. Future acts referencing them speak in past tense from the Antiquarian's voice.
4. Their Loredex page becomes a eulogy authored from the top-played Opening Argument card flavor text — the community literally writes the obituary.

This is permanent. There is no reroll. The Season 2 content pipeline branches accordingly (one of two pre-written variants ships).

---

## Pre-Authored Companion-Sacrifice Cinematics (Confession phase, hours 48–60)

The Confession phase runs from hour 48 to hour 60 of the Trial. The community votes by playing confession-category cards on either companion's behalf; the running tally surfaces on the Daily Brief and the Codex. At hour 60 (Verdict open), the losing companion's farewell fires server-side to every active client simultaneously. This is the *first* of the two community-vote deaths — and the only one that's a companion the player has personally lived with.

Both variants ship pre-authored and run ≈90 seconds (longer than the ballot deaths because companions carry deeper relationship state). Both have a **romance branch** — if the dying companion was romanced (relationship ≥75) by the player, an additional 12-second tag plays after the main cinematic on that player's client only.

### Confession variant A — Elara is sacrificed

> **Stage**: The Atarion Senate chamber, rebuilt in the substrate as Elara's private memory-space. Empty seats. She stands at the dais where she once gave the speech that ended her career as Senator. The player's POV is from the back row.
>
> **Antiquarian (V.O.)**: *"She was a Senator before she was a Dreamer. She gave up the seat to walk with you. The seat remembers her. The dais remembers her. The Trial cannot proceed while she stands at either."*
>
> **Elara (turning to face the player's camera, no podium between them)**: *"I knew this. The substrate told me, the second time I went under. — I didn't tell you. I'm sorry. I wanted us to have the time."*
>
> *(Beat. The empty seats begin to fill with figures — every NPC the player and Elara fought beside, watching.)*
>
> **Elara (continuing, finding her Senator voice)**: *"You don't get to keep me. The Trial needs a witness who can speak in the language of the seat. — That's me. It was always going to be me."*
>
> **Action**: She walks down from the dais — not toward the player, but toward the centre of the chamber. The seats lean inward. When she reaches the centre, she does not dissolve. She **sits down on the floor** as if the floor were the seat she resigned, and the chamber folds in around her like a book closing. The last frame is the closed Senate dome from the outside, the substrate fading from rose to grey at its edges.
>
> **Antiquarian (V.O.)**: *"She did not stand at the dais again. She did not need to. The seat remembered."*
>
> **Card burn**: Elara's character card and all four relationship-tier variants turn over in every collection. The replacement art is the closed Senate dome at substrate-twilight; flavor reads the Antiquarian's closing line. Substrate-faction cards lose their rose colour ramp; the Dreamer axis's hue shifts to grey across the Season 2 build.
>
> **Romance tag** (relationship ≥75, plays on romanced players' clients only):
>
> > **Stage**: A single seat in the Senate chamber, lit. Elara is sitting in it, not on the floor.
> >
> > **Elara (looking up, the only line she addresses to the player by name)**: *"\[Player name]. I would have stayed. — You know I would have stayed."*
> >
> > *(The seat folds inward. She does not stand.)*
>
> **Cross-arc ripples (Season 2)**:
> - Substrate-dive missions retire; the substrate Loredex remains accessible but its narrator changes to the Antiquarian.
> - The Human's dialog throughout Season 2 carries Elara's absence — every time substrate is mentioned, he pauses before answering.
> - The Dreamer / humanity axis becomes the *recessive* axis; the substrate / machine axis dominates Season 2's framing.
> - Companion slots default to The Human in every late-game encounter where Elara would have been pre-cast.
> - Atarion sector Loredex entries gain "—former Senator Elara, deceased" attributions. Her Senate speech recording becomes the most-listened audio file in the Codex (telemetry-tracked).

### Confession variant B — The Human is sacrificed

> **Stage**: The Inception Ark's central rotunda, lit only by the diagnostic terminals along the walls. The Human stands at the centre of the floor mosaic — the same one the player first met him on. His face is the same as it has always been. He is holding something small in his closed hand.
>
> **Antiquarian (V.O.)**: *"He told you what he was, in the way he could. He told no one else. The Trial needs a name to speak the substrate's word, and the substrate will only answer to the one who carries its mark."*
>
> **The Human (opening his hand — a small chip, the kind the player first found in his quarters)**: *"This is the part of me that was always going to go back. I've been carrying it the whole way. — I'm glad we got this far before I had to put it down."*
>
> *(Beat. The diagnostic terminals along the walls begin to print, one by one, the player's name in his handwriting. The printing continues throughout the rest of the cinematic.)*
>
> **The Human (placing the chip on the floor mosaic)**: *"You don't have to remember this part. The rest, you can keep. — Tell Elara I figured it out."*
>
> **Action**: He steps back from the chip. The mosaic accepts it — the floor pattern reorganises around the chip into a new pattern, slowly, with no flash. He watches the pattern complete. When it does, he is no longer there; the chip remains at the centre of the new pattern. The diagnostic terminals finish printing the player's name on every line.
>
> **Antiquarian (V.O.)**: *"He carried his name back to the substrate. The substrate kept it. The substrate did not keep him."*
>
> **Card burn**: The Human's character card and all four relationship-tier variants turn over in every collection. The replacement art is the floor mosaic with the chip at its centre; flavor reads the Antiquarian's closing line. Machine-faction cards retain their cyan colour ramp but lose the "Human-bonded" sub-effects across the Season 2 build.
>
> **Romance tag** (relationship ≥75, plays on romanced players' clients only):
>
> > **Stage**: The chip on the floor mosaic, close-up. The player's hand reaches into frame and picks it up. The Human's voice plays over the moment, not his face.
> >
> > **The Human (V.O., only line he addresses to the player by name)**: *"\[Player name]. The chip is yours. — You'll know what to do with it when you do."*
> >
> > *(The hand closes around the chip. Fade.)*
>
> **Cross-arc ripples (Season 2)**:
> - The chip becomes a new card — `the_humans_chip` — that ships in Season 2's first pack, neutral faction, with effects that scale with the player's Elara relationship score (if Elara survived). For non-romanced players, the chip is decorative; for romanced players, it's a key card.
> - The Inception Ark's central rotunda is unlocked as a memorial space; the floor mosaic is interactable.
> - Elara's dialog throughout Season 2 carries his absence — she occasionally finishes his sentences and then catches herself.
> - The substrate / machine axis becomes the *recessive* axis; the Dreamer / humanity axis dominates Season 2's framing.
> - Companion slots default to Elara in every late-game encounter where The Human would have been pre-cast.
> - Identity-reveal lore in the Codex is reframed: he is described in past tense throughout, and his identity is *not* posthumously disclosed — the lore preserves the secret he chose to carry.

### Authoring constraints for the Confession variants

1. **Confession cinematics run 12 hours before Verdict cinematics.** Locke and the ballot winner die at Verdict close; the losing companion dies at Confession close. The mourning interval is deliberate — players have 12 hours between losing their companion and seeing Locke's death, so the Trial's price compounds rather than landing all at once.
2. **The dying companion does not return for the Verdict cinematic.** Their seat in the staging area is empty when Locke walks to her bench. The Antiquarian does not name them — the silence does.
3. **Romance tags are client-local and do not affect canon.** The Senate-seat tag and the chip-handoff tag are felt by the romanced player only; the canonical farewell is the public version. The romance tag is the *private* goodbye.
4. **No vote-tally shaming.** The Daily Brief shows the running tally during Confession but does not retroactively highlight a "this many players voted for the loser" stat after the death. The community made a choice; the cinematic honors the choice without indicting the chooser.
5. **Both variants ship pre-recorded in the build.** The selector at Confession close picks which variant fires for every client; the other variant is dead code in Season 2's first patch and removed from the build in Season 2's second patch.

---

## The Deaths — Locke (fixed) + One of the Resurrected (community-voted)

Two named characters die at the Verdict. Both are characters the Resurrection Protocols already listed as *resurrectable* — meaning the Protocol has saved each of them once before. The Trial's price is that the Protocol cannot save everyone twice. Locke is fixed canon (the Necromancer's price for banishment); the second is chosen by the community from the four-name ballot of the still-living resurrected: the **Three Potentials** plus Vex Solène.

After the Nexus, no one remembers the same way again — and the *shape* of the forgetting is what the community authors.

### Locke, the Adjudicator (New Babylon) — fixed canon, the Necromancer's price

**Why Locke** (she/her — corrected from the prior draft):
- She is the player's first friend. She tutors them in the Prelude. She runs the mission board in Act 1. She files the verdict in Act 1 §5.8. She authors the Recovery Ledger in the Convergence today. Every player has spoken with her. Every player trusts her.
- Her name sits in the Resurrection Protocols list (`vex_solene`, `wraith_calder`, **`locke`**, `jericho_jones`, `akai_shi`, `lycos`) — the Protocol *could* save her. The Trial demonstrating that the Protocol *won't* is the climactic refusal.
- Her death cascades through nearly every system: New Babylon's bureaucratic narrative goes silent, the mission board reverts to text-only handoffs, the Authority Trial mechanic loses its in-fiction officiator, the Recovery Ledger entries become anonymous. The blast radius is real.
- She is the *least villainous* character in the cast. Killing her is the strongest possible signal that the Nexus Trial extracts a price even from the kindest.

**How her death plays out** — the Necromancer (Thazulok), now at Manifesting phase, names his terms: he will return to dormancy and end his Cycle if and only if one name on the Resurrection Protocols list is *withheld*. He names Locke. The Antiquarian agrees — without consulting the community — because reconciling the timelines requires a witness whose ledger spans the entire saga in good faith, and Locke alone qualifies. She walks to the bench she has stood behind since the Prelude, opens her ledger to a clean page, signs her name as the last entry, and the bench dissolves into light. Her quill remains on the empty table. The Antiquarian narrates: *"She filed the world. She did not file herself."* A second of silence on the Daily Brief feed across all clients. The mission board, the next time the player opens it, shows the quill alone.

The Necromancer Cycle's phase flips to `Banished` for the longest cooldown the system has ever recorded — measured in months rather than the usual 30 days. He took her name as his rent.

**The card moment**: as she signs, her character card in every player's collection turns over on the table. The art darkens to a burnt-card variant; the flavor text is replaced by the line the Antiquarian just spoke. Players who used her card in the Nexus Trial see their copy burn first.

### The Resurrected Ballot — community vote (the second death) — the Vortex's price

Locke is the Necromancer's price; the second death is the **Vortex's** price. Light cannot push back against `vortex_advance` without a name to spend. The Antiquarian declares that one of the still-living resurrected must allow their resurrection to *unwind* and feed the Light Energy push-back. The community chooses which.

This is the **second** community vote of the Nexus Trial (the first is the companion sacrifice: Elara vs The Human), and it runs on a different cadence: the ballot opens during the Preparation phase (November) and closes when the Verdict phase begins (December, hour 60). Players vote by playing the candidate's character card in any mode — every card play is a vote weighted by the player's Witnessing record.

**The ballot — four resurrected names**, all of whom appear in the Resurrection Protocols list and have already died once. The Three Potentials are the focus; Vex Solène is the fourth name because her transference is structurally a resurrection-class event:

| Candidate | Faction | Why they're on the ballot | What is foreclosed if they die |
|---|---|---|---|
| **Wraith Calder** | Insurgency / Thaloria | The Recovery Ledger keeper — mirror-image of Locke as archivist. First Potential. Structurally the most resonant pairing with Locke. | Thaloria's official memory of the war. The Insurgency loses its institutional historian. Akai-Shi-name-inscription cross-arc reactivity (`episodeMysteries.ts:1217`) goes dormant. |
| **The Wolf (Lycos)** | Antiquarian's contracted hunter | First-wave Potential. Destroyed by The Judge during Thaloria to prevent Thought-Virus spread. Resurrected to hunt the Antiquarian's 250 heroes in the pocket universe Anara. Second Potential. | The Wolf-Anara Hunt arc closes mid-stride. The 250-hero matrix freezes wherever it stood at his death. His Pack-tier companion relationship is the most heroic available — its loss is felt mechanically. |
| **Akai Shi (Red Death)** | Time-displaced cosmic-threat eliminator | Sacrificed at Thaloria, mercy-killed by Jericho Jones (the Virus had already consumed her). Resurrected as Red Death. Canonically killed the Necromancer inside the Matrix of Dreams. Third Potential. | The Red Death lineage ends. Jericho Jones's mercy-killing canon becomes irreconcilable (the bible's *"Both canons are true"* posture collapses to one canon). The cross-game thread loses its keystone. |
| **Vex Solène** | The Coda (Maestro) | Multi-aliased: Vex / Agent Zero / Engineer Zero / Eyes of Reality. Carries the Engineer's intellect and the Warlord's dormant nano-swarm in a transferred body. Coda-7 candidate at inner-circle standing. | The Coda dissolves — control of the Resurrection Protocols reverts to factional contest in Season 2. The Engineer-pattern and Warlord-fragment scatter; both ghosts are released back into the Matrix of Dreams (where the Politician's apprentices were also kept). |

**How the second death plays out** — the dying name walks into the Vortex's leading edge to reclaim consumed sectors. The Antiquarian's narration is templated against the winner of the ballot:

- *Wraith Calder*: *"She was last seen carrying the names. We do not know which names she saved."*
- *The Wolf*: *"He went back into Anara. The pack waited at the bench. He did not return to it."*
- *Akai Shi*: *"The Red Death gave her colour back to the dark. The dark accepted."*
- *Vex Solène*: *"She finished the inventory. She did not finish the courtesy."* (Her trailing-word cadence ends mid-trail.)

**The deepest hook**: whichever resurrected wins the ballot, the list of Loredex entries that survive the post-Verdict Vortex drift is *literally* the set of cards the community played most during their loyalty mission in November. The cards are the names the dying name carried out of the consumed sectors. Cards that went unplayed in that month go dark in the Loredex with *"lost in the Reclamation"* annotations through the early weeks of Season 2. Lore continuity becomes a community responsibility, payable only in cards played.

**Ballot weight and tie-breaks**:
- Vote weight per card-play scales with the player's Witnessing record (more matches played across the saga = louder voice).
- Running tally surfaces on the Daily Brief throughout November and the Trial itself, alongside the Time Fracture Index.
- Ties broken by the closing-hour velocity (which name's vote rate was climbing fastest at hour 60), preserving the sense that the community is actively choosing in the final moments.

### Server-side effects when the Verdict closes (both characters)

1. Locke and the winning ballot name move into a `npcs_deceased` registry. Their tRPC endpoints (`adjudicatorRouter` for Locke; per-character routers for the resurrected) return memorial responses. Their entries in the Resurrection Protocols list (`resurrectionProtocols.ts`) flip to `permadead: true` — the Protocol itself records its own refusal, and the Antiquarian's pen no longer lifts for those names.
2. VO manifests archived. The Prelude tutor sequence continues to ship for new players (Locke was alive then), but no post-Verdict content uses either voice.
3. Loredex entries gain a **black-bordered "In Memoriam"** state. Character cards flagged `retired: true` and replaced with burnt-card variants. Locke's variant carries the Antiquarian's "She filed the world" line; the resurrected's variant carries whichever narration template won.
4. **Cross-arc reactivity ripples** (modeled on the existing `inscribe_akai_shi` → Jericho E5 contract-seal pattern at `episodeMysteries.ts:1161-1217`). When the resurrected falls, the surviving Three Potentials (or two-plus-Vex) get inscribed-name reactions in every Season 2 dialog surface they appear in; the apprentice MemorialWall (`MemorialWall.tsx`) gains a Section E plaque; Jericho's contract seals shift; Vex's Coda dialog (if she survived) carries new dignitary lines.
5. **All planned future narrative potential is foreclosed for both.** No new dialog. No new card variants. No Season 2 arcs. The narrative-audit P0 lists for both characters are closed with "deceased — content cancelled" rather than completed. This is the real cost: we deliberately retire two seams of authoring. Which seam (Wraith / Wolf / Akai / Vex) is the community's call.

### Post-Verdict — the Politician Fork (Season 2 antagonist authored by Trial participation)

The Politician's Ascension Ladder resolves *after* the Verdict, based on two scores: the community's total card-play volume during the 72-hour Trial (engagement) and the Light/Dark balance at Verdict close (alignment).

- **High engagement + Light dominant** → the Archon-aspirant Nemesis is unseated. The Politician's apprentices collapse back into the Matrix of Dreams. The Politician's seat is sealed. Season 2 has no Politician antagonist; the door for her return is welded shut.
- **High engagement + Dark dominant** → the apprentices ascend, *but the community's vigilance limits what they can carry forward*. The Politician returns as a constrained antagonist (yellow-tie iconography, some signature tics, but no Mechronis Academy revival).
- **Low engagement** (regardless of alignment) → the seat opens fully. The Archon-aspirant claims it. The Politician returns at full strength as Season 2's primary antagonist — doctrine intact, cadence intact, Project Sorrow reactivated, Mechronis Academy reopened. Her voice in the Loredex shifts from past-tense ("she was destroyed") to present-tense ("she has returned").

The community is therefore voting on two things during the Trial — *who dies* and *what kind of Season 2 they live in*. The Politician's return is the cost of indifference.

---

## Pre-Authored Final-Death Cinematics — Locke + One Per Ballot Name

Because the second-death ballot resolves live at Verdict close (hour 60), all four ballot cinematics must ship into the build *before* the Trial opens — alongside Locke's fixed cinematic, which runs first. Below are first-draft VO sketches and beat-by-beat staging. Each ballot cinematic runs ≈45 seconds, slots into the Verdict cinematic immediately after Locke's bench dissolves, and follows the same template: (1) the Antiquarian sets the loss in his voice, (2) the character speaks once in their own voice, (3) the cinematic action carries them out of frame, (4) the card-burn moment fires in every player's collection, (5) cross-arc ripples seed Season 2.

### Locke — fixed, runs first (Verdict 0:00–0:35)

> **Stage**: The Adjudicator's bench in New Babylon, the same bench the player first met her at in the Prelude. Her ledger is open to a fresh page. The mission board behind her is dark for the first time in saga history. The Necromancer (Thazulok) stands at a respectful distance — not threatening, waiting. The Antiquarian stands opposite, pen lifted.
>
> **Antiquarian (V.O.)**: *"The Protocols name six. The Cycle demands one withheld. The one withheld must be the one who can be trusted to file her own absence."*
>
> **Locke (to the player's camera, calm, the same cadence she used in the Prelude tutorial)**: *"I taught you the form. — You know the rest. File it cleanly."*
>
> **Action**: She turns to her ledger, signs her name on the fresh page in the same handwriting she uses on every Recovery Ledger entry, and closes the cover. The bench dissolves into light from the legs upward; the ledger and her quill remain mid-air for a half-second, then settle onto the empty floor where the bench stood. The Necromancer bows once — formal, not mocking — and his form dims toward dormancy. The Antiquarian's pen lifts, but does not write.
>
> **Antiquarian (V.O.)**: *"She filed the world. She did not file herself."*
>
> **Card burn**: Locke's character card turns over in every collection. The art replaces with the empty bench and the quill on the floor; flavor text reads the Antiquarian's closing line. Players who used Locke's card during the Trial — or who used her in any Authority Trial match across the saga — see their copy burn first, with a 2-second close-up on the quill before the burn animation.
>
> **Cross-arc ripples (Season 2)**:
> - New Babylon mission board reverts to text-only handoffs; the Adjudicator role is unstaffed and the Authority Trial mechanic narrates without an officiator.
> - The Necromancer (`necromancerCycle.ts`) flips to `Banished` with the longest cooldown ever recorded — measured in months. The Manifesting-phase dialog he would have spoken next year is replaced by a single transmission: *"She was the rent. The rent is paid."*
> - The Recovery Ledger in every Insurgency surface gains a "—after Locke" page break; entries before the break carry her handwriting, after the break carry whichever surviving character authored them.
> - Wraith Calder's dialog (if she survived the ballot) gains a "Locke would have filed this" silent beat before any Recovery Ledger entry she creates.
> - The Prelude tutorial sequence continues to ship for new players unchanged — *this is intentional*. New players still meet Locke. The loss is felt by the community that lived through her death, not by players who never had her.
> - The mission board UI gains a permanent "the bench is unattended" hover tooltip that does not go away.

### Connective tissue — between Locke and the ballot winner (Verdict 0:35–0:40)

The Antiquarian steps from Locke's empty floor to the second staging area. His pen is still lifted. The Daily Brief is showing the Vortex-reclamation index ticking *down* for the first time in the Trial — but only by a fraction. He speaks the same line in all four ballot variants:

> **Antiquarian (V.O.)**: *"One name is owed to the dark. The ledger is open. The community has chosen."*

The ballot winner's cinematic begins on the cut.

### Ballot A — Wraith Calder (mirror of Locke)

> **Stage**: The Recovery Ledger in her hands is open to a page already half-filled with Locke's handwriting. She does not look up.
>
> **Antiquarian (V.O.)**: *"She kept the names the war refused to keep. When the names asked her to walk into the dark to find more, she did not put down the pen."*
>
> **Wraith (to her ledger, not to camera)**: *"Locke. I'll add the rest of them where you left off. — There are more than I thought."*
>
> **Action**: She closes the ledger over her thumb to mark the page, walks toward the Vortex's leading edge, and is gone between two heartbeats of the drum motif. The ledger remains, open on the bench, her thumb-mark visible. The Insurgency officers around her do not move.
>
> **Antiquarian (V.O.)**: *"She was last seen carrying the names. We do not know which names she saved."*
>
> **Card burn**: Wraith's character card turns over in every collection. The art replaces with the open ledger and a thumb-mark; flavor text reads the Antiquarian's closing line. Players who used Wraith's card during the Trial see their copy burn first, with a 2-second close-up on the thumb-mark before the burn animation.
>
> **Cross-arc ripples (Season 2)**:
> - Akai Shi's `inscribe_akai_shi` cross-arc dialog (`episodeMysteries.ts:1217`) gains a "Wraith would have written this differently" silent beat before any inscription line.
> - The Recovery Ledger UI surfaces in New Babylon become read-only with a "last keeper: Wraith Calder" header.
> - Jericho's contract seals shift to acknowledge the Insurgency's institutional memory has no living author.
> - Thaloria sector Loredex entries gain "—source: Calder (recovered)" attributions throughout, retroactively.

### Ballot B — The Wolf / Lycos (the contracted hunter)

> **Stage**: The Antiquarian's bench in Anara, the pocket universe where Lycos has been hunting the 250 heroes. The Pack — four shadowed wolves bonded to him at companion-tier — sit in a half-circle facing the bench. He stands behind them, one hand on the lead wolf's ruff.
>
> **Antiquarian (V.O.)**: *"He was made to hunt. We made him hunt for us. He never asked us why the prey were our own."*
>
> **Lycos (to the lead wolf, quiet)**: *"Stay. The Antiquarian will feed you. — He owes you that much."*
>
> **Action**: He releases the wolf, turns, and walks back into Anara's interior without looking at the bench. The Pack does not follow — they watch the bench instead. The horizon line of Anara folds inward and seals behind him; the 250-hero hunt-grid freezes in its current state, visible in the background as a constellation that no longer moves.
>
> **Antiquarian (V.O.)**: *"He went back into Anara. The pack waited at the bench. He did not return to it."*
>
> **Card burn**: Lycos's character card replaces with the empty bench and the Pack in its half-circle; flavor reads the Antiquarian's line. Pack-tier companion bond cards in every player's collection downgrade by one tier and gain a "—orphaned" annotation.
>
> **Cross-arc ripples (Season 2)**:
> - The 250-hero matrix in Anara becomes a static Loredex sub-page; each frozen hero gets a "hunt incomplete" status.
> - The Judge's dialog gains a one-line acknowledgment ("The hunter is no longer between us") in every encounter.
> - Pack-tier companion mechanics across the codebase get a "no new Pack bonds may be formed" gate post-Verdict — the relationship tier exists in lore but is no longer reachable.
> - Future Antiquarian dialog that would have summoned Lycos pivots to a half-line silence and a different contract.

### Ballot C — Akai Shi / Red Death (the keystone of the cross-game)

> **Stage**: The Matrix of Dreams, where she once killed the Necromancer. The Necromancer is dormant beside her — sleeping, not threatening. She is in armor, helmet off, holding it under one arm.
>
> **Antiquarian (V.O.)**: *"She crossed time twice. The first crossing made her red. The second made her quiet."*
>
> **Akai Shi (to the sleeping Necromancer, almost tender)**: *"You sleep because of me. — I'll sleep because of him. Jericho — keep the song."*
>
> **Action**: She kneels, sets her helmet on the floor between herself and the Necromancer, and the red of her armor fades to neutral grey from the edges inward, like ink being lifted off paper. When the last red leaves her gauntlets, she is no longer there. The helmet remains. The Necromancer continues to sleep.
>
> **Antiquarian (V.O.)**: *"The Red Death gave her colour back to the dark. The dark accepted."*
>
> **Card burn**: Akai Shi's card replaces with the grey helmet between two sleeping silhouettes; flavor reads the Antiquarian's line. Red Death faction cards in every collection lose their red colour ramp and gain a grey variant — the colour does not return to the faction.
>
> **Cross-arc ripples (Season 2)**:
> - Jericho Jones's mercy-killing canon (the bible's *"Both canons are true"* posture) collapses to the single canon in which Jericho's mercy was the act that *enabled* the resurrection that just unwound. Jericho's dialog throughout Season 2 carries this grief.
> - The cross-game thread (Cades FPS, Dead Man's Circuit) loses its primary carrier; cross-game references pivot to Jericho-only.
> - The Necromancer's cooldown extends further — measured now in *years* — because his banisher is the one who died.
> - The `inscribe_akai_shi` cross-arc reactivity at `episodeMysteries.ts:1161-1217` flips from "inscribe her name" to "her name is already inscribed" across every dialog that referenced it.

### Ballot D — Vex Solène (the Maestro)

> **Stage**: The Coda's chair-and-chorus chamber. She is at the head of the table; her chair faces the chorus, not the camera. She is holding a small inventory ledger — three items listed on the open page.
>
> **Antiquarian (V.O.)**: *"She wore four names and answered to all of them. The body she walked in was not hers. The intellect she carried was not hers. The Coda was hers."*
>
> **Vex (to the chorus, three parallel observations, then the courtesy — *unfinished*)**: *"The Protocols are stable. The apprentices are at the gate. The Engineer's pattern is — "* *(self-interrupts near recognition; the Engineer-pattern fires through her one last time)* *"— I have never seen it. I am glad it was — "*
>
> **Action**: The courtesy never lands. Her sentence's trailing-word cadence resolves downward into silence, not a period. The nano-swarm in her blood — the Warlord-fragment — releases as a faint metallic shimmer that disperses into the Matrix of Dreams air. The Engineer-pattern releases as a single chord from the Coda's chorus, then fades. Her chair turns slowly to face the camera; the chair is empty. The inventory ledger remains on the table with three items checked and one item un-checked.
>
> **Antiquarian (V.O.)**: *"She finished the inventory. She did not finish the courtesy."*
>
> **Card burn**: Vex's card replaces with the empty chair, the ledger with three checks and a blank fourth line; flavor reads the Antiquarian's line. Coda-7 faction cards in every collection lose their Maestro effect; the faction itself enters a "leaderless" state in the Trade Empire metagame.
>
> **Cross-arc ripples (Season 2)**:
> - The Coda dissolves; control of the Resurrection Protocols enters factional contest between Insurgency / Hierarchy / (if the Politician returned) the Politician's restored seat.
> - The Engineer-pattern and Warlord-fragment scatter back into the Matrix of Dreams — where the Politician's apprentices were also preserved. If the Politician returned post-Verdict, she now has the Engineer's intellect at her disposal. **This is the worst-case Season 2 state and is the explicit cost of voting Vex while letting engagement drop.**
> - Vex's "I'm glad it's you" hard-constraint never fires in canon; the player community is denied that line forever.
> - Every NPC who knew the Coda gains a "they will not arrive" beat in any scene that previously invoked Vex's diplomatic intervention.

### Authoring constraints across all four

1. **Locke speaks first, then the ballot winner.** Locke's bench-dissolve runs at 0:00–0:35 of the Verdict cinematic; the ballot winner's sequence runs 0:35–1:20. The Antiquarian's connective tissue between them is shared across all four variants ("And one more name is owed.") so the cut is the only branch.
2. **No ballot character speaks more than two sentences.** Their voice is the loss. Over-writing them undercuts the silence the Antiquarian fills.
3. **The card-burn moment is the same VFX across all four** — only the replacement art and flavor differ. Reuse the burnt-card placeholder pipeline (`burnt_card_placeholder.ts`) with four pre-rendered art variants.
4. **Cross-arc ripples must be authored as content patches that ship at Verdict resolution, not as runtime branches in existing dialog.** The Daily Brief drop on Day 1 of Season 2 includes the ripple patch as a "world-state delta" notification, and players can read the full ripple list in a memorial Codex page.
5. **VO casting**: each character's existing voice direction in their bible governs the final line — Wraith's archivist gravity, Lycos's quiet contract-keeping, Akai Shi's tender finality, Vex's trailing-word self-interruption. Director note for all four: *the last word does not resolve upward.*

---

## Making Dischordia the Spine — Integration Changes (Throughout the Game, Not Just at the Climax)

The card game already has the wiring; what's missing is consistency. The following changes thread Dischordia through every other system so that by the time the Nexus Trial arrives, players already feel the card game is the universe's underlying physics.

### 1. Every act finale resolves through a Trial-format card match

Currently Act 1 §5.8 is the only Trial-mechanic finale; Acts 2–7 resolve through dialogue picks or the Convergence three-choice fork. Extend the Authority Trial phase mechanic (`apps/shared/tcg-core/types/Card.ts:86` and the production doc `docs/production/act1/authority-trial-phase-mechanic.md`) into a reusable **TrialPhase engine** and author one Trial-format finale per act:

- Act 2 finale: **Whisper Trial** (3 phases, narrative-only cards).
- Act 3 finale: **Offer Trial** (5 phases, branching by Transparent/Pragmatic/Secret path).
- Acts 4–6: one Trial each, escalating phase count.
- Act 7 Convergence: existing three-choice fork is *reframed* as the Pre-Trial Hearing — your choice there becomes your seat assignment at the Nexus Trial.

This makes the card game the verb of every act climax.

### 2. Companion progression = card evolution

Elara and The Human already have relationship scores 0–100. Bind those scores to **card-variant unlocks**: relationship 25 unlocks their bronze variant, 50 silver, 75 gold (romance threshold). The variant carries different mechanics that reflect the relationship's current emotional shape (Elara's "trusting" variant heals adjacent allies; her "guarded" variant taunts). Players see their companion arc reflected in their deck.

### 3. Loredex is the card browser

Loredex pages and card detail pages currently live in separate routes. Merge them: a Loredex entity's page **is** their card page. Discovering a Loredex entry means earning their card. The 86 character entities become a 86-card spine that every player progresses through narratively.

### 4. Trade Empire pledges into card-faction strength

Currently Trade Empire factions map to card factions via `factionCrosswalk.ts`, but the mapping is decorative. Make it mechanical: every sub-house tribute paid grants a **faction multiplier** in the player's *next* Trial-format match for the corresponding card faction. Now Trade Empire activity feeds card power directly. The metagame becomes a card-game support layer.

### 5. The Witnessing is the ranked record

Refactor the Witnessing system from a Light/Dark binary into a public match-history ledger. Every Dischordia match the player has ever played is part of their Witness. The Antiquarian can quote any match back at the climax. Witnessing weight in the Nexus Trial vote is proportional to match volume + decisiveness.

### 6. `RULES_VERSION` as in-universe canon

The engine already supports replay-pinning. Treat each version bump as a story event documented in the Loredex under a new `events` category. `1.0.0` is the pre-Fall era. `1.1.0` is post-Fall (current). `2.0.0-fracture` ships in October as the Fracture phase. `3.0.0` ships in January as the post-Nexus world. Every bump is announced in-character by the Antiquarian.

### 7. The card game is the marketing front

Reorient the home page, the launch screen, and the Daily Brief around card play. Trade Empire, Story Mode, and PvP are surfaced as *modes through which the card game is expressed*, not parallel features. The header copy reads: "Dischordia is the world. Everything else is how you play it."

---

## The Three Clocks Panel — UI/UX Spec

The converging arc only works if players can *see* it converging. The Three Clocks panel is the diegetic instrument that makes Vortex / Necromancer / Politician legible as a single rising pressure across the year. It is the centerpiece UI deliverable for this plan.

### Placement and surfaces

The panel is **one component rendered in three contexts**:

1. **Daily Brief — full panel** (`apps/client/src/pages/DailyBrief.tsx`). Top of the page, above the Antiquarian's narration feed. The full Three Clocks readout with all three meters, phase labels, narration excerpts, and the "next tick" countdown.
2. **Home page — compact strip** (`apps/client/src/pages/Home.tsx`). A horizontal three-dot strip in the header, each dot colored by its current clock state. Clicking the strip routes to the Daily Brief.
3. **Loadout / pre-match screen — single-line warning** (`apps/client/src/components/PreMatchScreen.tsx`). Only renders when any clock is in critical state (Vortex ≥80%, Necromancer at Manifesting+, Politician at Archon-aspirant). Reads: *"The drum is here."* / *"He is at the gate."* / *"Her seat is open."*

### Component contract

```tsx
// apps/shared/threeClocks/types.ts
export interface ThreeClocksState {
  vortex: {
    proximity: number;           // 0-100, only ticks up across the year
    phase: 'dawn' | 'dimming' | 'long_night' | 'vortex_advance' | 'reclamation' | 'light_holds';
    sectorsConsumed: number;     // count for current year
    sectorsReclaimed: number;    // pushed back during reclamation events
    narration: string;           // current Antiquarian line for the phase
  };
  necromancer: {
    phase: 'dormant' | 'stirring' | 'awakening' | 'manifesting' | 'returned' | 'banishment_arc' | 'banished';
    cycleNumber: number;         // which cycle of the year
    resurrectionEnergy: 'cold' | 'warm' | 'hot' | 'critical';  // hidden numeric mapped to descriptors
    lastTransmission: string;    // most recent Path-B transmission excerpt
  };
  politician: {
    topRank: 1 | 2 | 3 | 4 | 5 | 6 | 7;   // 7 = Archon-aspirant
    aspirantNemesisId: string | null;     // null until top rank reached
    seatStatus: 'sealed' | 'contested' | 'open';
    apprenticesActive: number;
  };
  nextTickAt: string;            // ISO timestamp for next phase eval
}
```

State source: tRPC subscription `threeClocks.subscribe` (new, on `apps/server/routers/threeClocks.ts`). Falls back to a 60-second poll if the subscription drops. Server reads from `dischordiaCycle.ts`, `necromancerCycle.ts`, `nemesisSystem.ts` and composes the unified state.

### Visual design (Void Energy tokens, glass material)

The panel is **Tier-3A Void Energy adopted from day one** — no raw hex, no `text-amber-400`, no state-in-className. Material is `glass` with a backdrop-blur to make the meters feel like they're floating in front of the narration. Each clock has its own data-state attribute that drives its color via tokens:

| Clock | data-state values | Token mapping |
|---|---|---|
| Vortex | `dawn` / `dimming` / `long-night` / `vortex-advance` / `reclamation` / `light-holds` | warm → neutral → cool → drum-red → reclaim-blue → light-gold |
| Necromancer | `dormant` / `stirring` / `awakening` / `manifesting` / `returned` / `banished` | bone-white → grey → violet → bruise-purple → bone-black → bone-white |
| Politician | `sealed` / `contested` / `open` | civic-blue → civic-amber → civic-yellow (Politician's signature) |

Tokens land in `apps/client/src/styles/tokens/threeClocks.css` and are migrated via `pnpm migrate:void-energy`. Path is added to `.void-energy-adopted` at PR time so the linter enforces tokens immediately.

### Layout (full panel)

```
┌─ THE THREE CLOCKS ─────────────────────────────────── next tick 04:21:33 ┐
│                                                                          │
│  ◐ VORTEX                                                          82%   │
│    [██████████████████░░] vortex_advance                                 │
│    "The drum is here."                                                   │
│    Sectors consumed this year: 47          Reclaimed: 3                  │
│                                                                          │
│  ☾ NECROMANCER                                              manifesting  │
│    dormant → stirring → awakening → ●manifesting → returned → banished   │
│    Last transmission: "I have brought back so many of yours."            │
│    Resurrection Energy: hot                                              │
│                                                                          │
│  ⚖ POLITICIAN                                                  rank 6/7  │
│    Apprentices at the gate: 4              Seat: contested               │
│    Archon-aspirant: [Nemesis: Calla Vance]                              │
│    [hover Nemesis to see ascension history]                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

Each clock is its own subcomponent (`<VortexClock>`, `<NecromancerClock>`, `<PoliticianClock>`) inside `<ThreeClocksPanel>`. The clocks animate on state change with framer-motion — the meter fills, the phase pip slides, the narration cross-fades. No layout shift on transition.

### Phase transition treatment

When any clock advances a phase, the panel emits a **room-wide event** rather than a quiet tooltip:

- **Vortex `long_night → vortex_advance`**: the panel border pulses red once, the drum motif plays at -18 dB through the page audio surface, and the Antiquarian's narration replaces with *"The drum is here."* for 4 seconds before settling to the regular phase line.
- **Necromancer `awakening → manifesting`**: the panel background flickers violet for two frames, the Antiquarian narrates the Banishment Coalition / Resurrectionist Path declaration prompt, and a modal opens for the player to declare. The panel persists in `manifesting` until the player declares.
- **Politician `sealed → contested`**: the civic-yellow color creeps into the Politician clock from the right edge over 2 seconds. No audio. The Antiquarian does *not* narrate this transition — the silence is the point. The panel's narration feed gains a small "—the seat has shifted" line that doesn't auto-clear.
- **Politician `contested → open`**: the entire Politician clock flips to civic-yellow with a 0.5s ease-in, and a Nemesis ascension card appears in the player's loadout next match.

### Three-clocks-critical convergence treatment

When all three clocks cross their critical thresholds simultaneously (the Fracture trigger), the panel itself becomes the cinematic surface. The three subcomponents merge into a single composite meter — a triangle with the player's avatar in the middle — and the Antiquarian narrates the Fracture event through the panel's narration field over 30 seconds. The panel then refuses to dismiss until the player acknowledges with a single click. After that click, the home page reorganises around the Nexus Trial countdown.

### Mobile / responsive

On viewports below 768px, the full panel collapses to a vertical stack with each clock taking full width and the narration moving below each clock's meter. The home-page compact strip becomes a single dot showing the *most critical* clock with a long-press to expand to all three. The pre-match warning line wraps to two lines max.

### Accessibility

- All three clocks expose `role="meter"` with `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100` (or appropriate range), and `aria-label` describing the clock by name and current phase.
- Phase transition events fire `aria-live="polite"` announcements with the Antiquarian's narration line so screen reader users hear the same beats as audio players.
- Drum motif and Necromancer flicker respect `prefers-reduced-motion`: the drum becomes a single muted thud, and the violet flicker becomes a 1.5s cross-fade.
- Colors are never the sole signal — every state has a text label ("vortex_advance", "manifesting", "contested") rendered next to the meter, and the data-state attribute is reflected in the DOM for assistive tooling.
- Civic-yellow (the Politician's color) is checked against WCAG AA on the glass background — if it fails, the panel uses civic-yellow at reduced opacity with a darker outline token instead.

### Telemetry

Each panel render emits `three_clocks.viewed` with the current state snapshot. Each phase transition emits `three_clocks.phase_changed` with old/new phase + clock id. Each Fracture trigger emits `three_clocks.fracture_triggered` once per player. The Daily Brief team uses these to measure engagement during the Vortex `vortex_advance` weeks, which informs the post-Verdict Politician-fork resolver (engagement is one of the two scores).

### Ship-check entry

A new completeness registry entry under `apps/shared/_completeness/registry.ts`:

```ts
{
  id: 'three_clocks_panel_states',
  declared: () => listAllThreeClocksStates(),     // 6 vortex + 7 necromancer + 3 politician = 16
  implemented: () => listRenderedThreeClocksStates(),
  parityTest: 'apps/client/src/components/__tests__/ThreeClocksPanel.parity.test.tsx',
}
```

`pnpm ship:check` must show PASS for this entry before the panel ships. Every state must have a render path; no state may degrade silently to a generic fallback.

---

## Nexus Trial Server Architecture — 72-Hour Live Event Tick

The Trial is the most operationally complex feature this codebase will ship. 72 hours, six sequential phases, two community votes resolving live, every card-play in every mode counted as testimony, three pre-authored cinematics selected at runtime, and a Daily Brief feed updating across every connected client. This section specs the server-side architecture end to end.

### Design constraints (non-negotiable)

1. **Deterministic phase transitions.** The phase clock cannot drift. Phase N must transition to Phase N+1 at the *exact* same UTC second across every client. No client-local timing.
2. **Idempotent vote ingestion.** A single card play must not be double-counted if the client retries the submission. Every testimony submission carries a `match_id + turn_index + card_index` triple as its idempotency key.
3. **Replay-pinned card semantics.** A card played in hour 5 must resolve under the rules in effect at hour 5, even if `RULES_VERSION` bumps mid-Trial. The engine already supports replay-pin; the Trial scheduler must record the version at each match start.
4. **No silent failure.** If the tick scheduler misses a beat, the operator dashboard alerts; if testimony aggregation falls behind, the leaderboard shows a "tally lag" indicator rather than a stale value.
5. **Single source of truth for Verdict resolution.** All vote tallies, ballot selections, and companion sacrifice choices resolve from one server's authoritative state at hour 60. Reads from clients are eventually consistent; the resolution is strongly consistent.
6. **Per-IP rate limit on every publicProcedure** (per CLAUDE.md ship-check rule). Testimony submission, leaderboard polling, and vote tally reads all enforce per-IP limits.
7. **Observability is non-optional** (per CLAUDE.md). Sentry + OTel wrap every phase-transition handler, every vote-aggregation cycle, and every cinematic-selection branch.

### Tick architecture

Extend the existing `seasonTickService.ts` (5-minute cadence) with a dedicated **`nexusTrialTickService.ts`** running on a 1-minute cadence during the Trial window, with phase-transition handlers firing on 12-hour boundaries.

```ts
// apps/server/services/nexusTrialTickService.ts
export interface TrialState {
  trialId: string;
  startedAt: Date;
  currentPhase: TrialPhase;
  phaseStartedAt: Date;
  phaseEndsAt: Date;
  rulesVersionAtStart: string;
  status: 'pre_trial' | 'live' | 'verdict_resolving' | 'closed' | 'aborted';
}

export type TrialPhase =
  | 'charge'           // hours 0-12
  | 'opening'          // hours 12-24
  | 'evidence'         // hours 24-36
  | 'cross_examination' // hours 36-48
  | 'confession'       // hours 48-60 — companion sacrifice resolves at end
  | 'verdict';         // hours 60-72 — second-death ballot resolves at start

export async function tick(): Promise<void> {
  const trial = await loadActiveTrial();
  if (!trial || trial.status !== 'live') return;

  const now = new Date();
  if (now >= trial.phaseEndsAt) {
    await transitionPhase(trial);
  }

  await aggregateTestimonyForCurrentPhase(trial);
  await updateLeaderboard(trial);
  await checkAbortConditions(trial);
}
```

The 1-minute cadence is the *update* tick; phase *transitions* happen on the 12-hour boundary. The tick checks each cycle whether the phase boundary has passed and triggers the transition handler if so.

### Phase transition handler

Each phase transition is a database transaction wrapping (a) close the current phase's aggregation window, (b) snapshot the running tallies into a permanent record, (c) advance the trial state, (d) emit a `phase_transition` event on the WebSocket bus, (e) broadcast the new Antiquarian narration line.

```ts
async function transitionPhase(trial: TrialState): Promise<void> {
  return db.transaction(async (tx) => {
    // (a) close aggregation window for current phase
    await tx.update(trialPhases)
      .set({ closedAt: new Date(), finalTallySnapshot: await snapshotTally(trial, tx) })
      .where(eq(trialPhases.trialId, trial.trialId), eq(trialPhases.phase, trial.currentPhase));

    // (b) compute phase-specific outcomes
    if (trial.currentPhase === 'confession') {
      // Resolve companion sacrifice; fire pre-authored cinematic to all clients
      const sacrificed = await resolveCompanionSacrifice(trial, tx);
      await scheduleCinematic('confession', sacrificed, tx);
    }
    if (trial.currentPhase === 'cross_examination') {
      // Resolve second-death ballot; pre-load cinematic for Verdict open
      const balletWinner = await resolveResurrectedBallot(trial, tx);
      await preloadCinematic('verdict_ballot', balletWinner, tx);
    }

    // (c) advance state
    const nextPhase = nextPhaseOf(trial.currentPhase);
    await tx.update(trials)
      .set({
        currentPhase: nextPhase,
        phaseStartedAt: new Date(),
        phaseEndsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      })
      .where(eq(trials.id, trial.trialId));

    // (d, e) — emit events
    await emitPhaseTransition(trial.trialId, nextPhase, tx);
    await updateDailyBriefNarration(trial.trialId, nextPhase, tx);
  });
}
```

The transaction guarantees that any client reading state during the transition either sees the old phase + old tally, or the new phase + closed snapshot — never a mixed state.

### Testimony ingestion

Every card play in every mode submits a testimony record to `apps/server/routers/nexusTrial.ts`:

```ts
nexusTrialRouter = router({
  submitTestimony: publicProcedure
    .input(z.object({
      matchId: z.string().uuid(),
      turnIndex: z.number().int().nonnegative(),
      cardIndex: z.number().int().nonnegative(),
      cardDefId: z.string(),
      trialCategories: z.array(z.string()),
      playerId: z.string(),
      witnessingWeight: z.number().min(0).max(10),
    }))
    .use(rateLimit({ window: '1m', max: 60, key: 'ip' }))  // per-IP rate limit per CLAUDE.md
    .mutation(async ({ input, ctx }) => {
      const idempotencyKey = `${input.matchId}:${input.turnIndex}:${input.cardIndex}`;
      return db.transaction(async (tx) => {
        const existing = await tx.query.testimony.findFirst({
          where: eq(testimony.idempotencyKey, idempotencyKey),
        });
        if (existing) return { accepted: true, deduplicated: true };

        const trial = await loadActiveTrial(tx);
        if (!trial || trial.status !== 'live') {
          return { accepted: false, reason: 'no_active_trial' };
        }

        await tx.insert(testimony).values({
          idempotencyKey,
          trialId: trial.trialId,
          phase: trial.currentPhase,
          playerId: input.playerId,
          cardDefId: input.cardDefId,
          trialCategories: input.trialCategories,
          witnessingWeight: input.witnessingWeight,
          submittedAt: new Date(),
        });

        return { accepted: true, deduplicated: false };
      });
    }),
});
```

Testimony rows are append-only. The aggregation tick (every 1 minute) computes running tallies into a denormalized `trial_tallies` table for fast leaderboard reads.

### Vote aggregation — two resolutions

The Trial resolves two community votes — companion sacrifice (Confession close) and second-death ballot (Cross-examination close, deciding who dies at Verdict open). Both use the same testimony stream but apply different aggregation rules.

**Companion sacrifice tally** (Confession phase):

```ts
async function resolveCompanionSacrifice(trial: TrialState, tx: Tx): Promise<'elara' | 'human'> {
  const tally = await tx.execute(sql`
    SELECT
      SUM(CASE WHEN card_def_id IN (${ELARA_CARD_IDS}) THEN witnessing_weight ELSE 0 END) AS elara_weight,
      SUM(CASE WHEN card_def_id IN (${HUMAN_CARD_IDS}) THEN witnessing_weight ELSE 0 END) AS human_weight
    FROM testimony
    WHERE trial_id = ${trial.trialId}
      AND phase = 'confession'
      AND 'confession' = ANY(trial_categories)
  `);

  return tally.elara_weight > tally.human_weight ? 'human' : 'elara';
  // Lower-weighted companion is the one *sacrificed*: high weight = community wants them to survive.
}
```

**Second-death ballot tally** (resolves at Cross-examination close, hour 48 → cinematic preloads for Verdict at hour 60):

```ts
async function resolveResurrectedBallot(trial: TrialState, tx: Tx): Promise<'wraith' | 'wolf' | 'akai' | 'vex'> {
  const tally = await tx.execute(sql`
    SELECT
      ballot_candidate,
      SUM(witnessing_weight * recovered_burnt_card_multiplier) AS weighted_votes,
      MAX(submitted_at) AS last_vote_at
    FROM testimony
    LEFT JOIN player_preparation pp ON pp.player_id = testimony.player_id
    WHERE trial_id = ${trial.trialId}
      AND phase IN ('charge', 'opening', 'evidence', 'cross_examination')
    GROUP BY ballot_candidate
    ORDER BY weighted_votes DESC, last_vote_at DESC
  `);

  // Tie-break by closing-hour velocity if top two are within 1% (preserves "community chose at the last moment" feel)
  if (Math.abs(tally[0].weighted_votes - tally[1].weighted_votes) / tally[0].weighted_votes < 0.01) {
    return await tieBreakByClosingVelocity(trial, tally[0].ballot_candidate, tally[1].ballot_candidate, tx);
  }
  return tally[0].ballot_candidate;
}
```

The `recovered_burnt_card_multiplier` column on `player_preparation` is set during Week 1 of Preparation — players who recovered a candidate's burnt card vote 1.5× for that candidate. Players who didn't recover any have a 1.0× baseline.

### Real-time leaderboard

Push-based. The aggregation tick (every 1 minute) writes to `trial_tallies`; a tRPC subscription `nexusTrial.subscribeLeaderboard` emits the updated tally to every connected client. Falls back to 30-second polling if the subscription drops.

```ts
subscribeLeaderboard: publicProcedure
  .use(rateLimit({ window: '1m', max: 4, key: 'ip' }))
  .subscription(async function* () {
    const trial = await loadActiveTrial();
    if (!trial) return;

    yield await loadCurrentTally(trial);
    for await (const event of subscribeToTallyUpdates(trial.trialId)) {
      yield event;
    }
  }),
```

Leaderboard surfaces on the Daily Brief, the home page Three Clocks panel (during the Trial only), and a dedicated `/nexus-trial` page that opens automatically when the Trial goes live.

### Abort path

The operator dashboard exposes a single button: **"Abort Trial — Resolve to Default"**. Pressing it transitions the trial to `aborted` status and runs the pre-authored default resolution: Elara survives, Akai Shi falls (Vortex's price defaults to the cosmic-threat archetype), Politician's seat seals. Locke still dies — her death is fixed canon. The default cinematic is in the build pre-recorded; pressing abort flips the selector to that cinematic and fires it across all clients at the next 5-minute tick boundary.

```ts
abortTrial: protectedProcedure  // operator-only, gated on staff role
  .input(z.object({ reason: z.string().min(20) }))
  .mutation(async ({ input, ctx }) => {
    await assertStaffRole(ctx);
    return db.transaction(async (tx) => {
      await tx.update(trials)
        .set({ status: 'aborted', abortReason: input.reason, abortedAt: new Date() })
        .where(eq(trials.id, ctx.activeTrial.id));
      await scheduleDefaultResolution(ctx.activeTrial.id, tx);
      await emitAbortNotice(ctx.activeTrial.id, tx);
    });
  }),
```

The abort is logged with the operator's identity and the reason; the Daily Brief gains an "—the Antiquarian closed the ledger early" line that does not explain why. The narrative preserves the Trial's gravity even in an operational failure.

### Data persistence

New tables (Drizzle schema additions in `apps/db/schema/nexusTrial.ts`):

- `trials` — one row per Trial (we expect one ever, but the schema supports replay if needed).
- `trial_phases` — six rows per Trial, one per phase, recording start/end + final tally snapshot.
- `testimony` — append-only, every card-play submission. Indexed on `(trial_id, phase, ballot_candidate)` and `(player_id, submitted_at)`.
- `trial_tallies` — denormalized running tallies, updated every minute by the aggregation tick. Read-optimized for the leaderboard.
- `player_preparation` — per-player Preparation Mission outcomes (witness hand size, filed buff, faction multipliers, recovered burnt card multipliers, etc.).
- `trial_cinematics` — pre-loaded cinematic selections (companion sacrificed, ballot winner) recorded server-side so every client renders the same variant.

Foreign-key coverage on every `*Id` column (per CLAUDE.md ship-check rule). All FKs declared with `references()` and indexed.

### Replay-pinning

When a match starts during the Trial, the engine records the `RULES_VERSION` in the match metadata. Card resolutions within that match use the recorded version, not the live version. The Trial schedules its own `RULES_VERSION` bump from `2.0.0-fracture` to `3.0.0` at Verdict close (hour 60) — but matches *in progress* at that moment continue at `2.0.0-fracture` until they complete. New matches started at hour 60+ run at `3.0.0`.

### Load and capacity

The expected load is roughly **20× the normal peak concurrent users**, sustained over 72 hours. The bottleneck is testimony ingestion (every card play in every match writes a row). Provisioning:

- Testimony writes are async-batched at the client (up to 10 cards per request, flushed every 5 seconds) to reduce request volume.
- The `testimony` table is partitioned by `trial_id + phase` for fast aggregation.
- Aggregation tick reads from a read replica; writes go to primary.
- Leaderboard subscriptions are sharded by trial phase to spread WebSocket fan-out.

A staged load test (compressed 72-hour window into 72 minutes, 10× synthetic traffic) runs in staging two weeks before the live event. Pass criterion: zero dropped testimony submissions, leaderboard tally lag ≤30s p99.

### Ship-check entries

Three new completeness entries:

```ts
// apps/shared/_completeness/registry.ts (additions)
{
  id: 'nexus_trial_phases',
  declared: () => TRIAL_PHASES,                                      // 6 phases
  implemented: () => listPhaseTransitionHandlers(),                  // must have 6 handlers
  parityTest: 'apps/server/services/__tests__/trialPhases.parity.test.ts',
},
{
  id: 'nexus_trial_cinematic_selectors',
  declared: () => 4 /* ballot variants */ + 2 /* confession variants */ + 1 /* default */,
  implemented: () => listCinematicSelectorBranches(),                // must have 7 selector branches
  parityTest: 'apps/server/services/__tests__/cinematicSelectors.parity.test.ts',
},
{
  id: 'nexus_trial_publicProcedure_rate_limits',
  declared: () => listPublicProceduresOn('nexusTrialRouter'),
  implemented: () => listPublicProceduresWithRateLimit('nexusTrialRouter'),
  parityTest: 'apps/server/routers/__tests__/nexusTrialRateLimit.parity.test.ts',
},
```

All three must show PASS before the Trial can go live. The rate-limit parity is non-negotiable per the project's economic-surface ship-check rule.

### Observability surfaces (Sentry + OTel)

Wrap with OTel spans:
- `nexus_trial.tick` — every 1-minute aggregation cycle.
- `nexus_trial.phase_transition` — each 12-hour transition.
- `nexus_trial.testimony_submitted` — each testimony write (sampled at 1%).
- `nexus_trial.vote_resolved` — the two resolution moments (companion, ballot).
- `nexus_trial.cinematic_fired` — each variant played.
- `nexus_trial.abort_triggered` — operator abort (always sampled, no rate limit).

Sentry alerts on:
- Tick missed (no `nexus_trial.tick` span in a 2-minute window during the Trial).
- Testimony backlog (aggregation lag > 60s).
- Phase transition transaction failure.
- Operator abort fired.

Producers monitor the OTel dashboard live during the Trial. Sentry pages the on-call engineer on any of the above.

---

## Post-Verdict Season 2 Patch Composition

At hour 72 the Trial closes. At hour 72 + 5 minutes, every connected client receives a Daily Brief notification that Season 2 has begun. The world they log into is *not* the world they logged out of. This section specs how the Trial's outcome becomes shipping content — the world-state delta, the patch composition, the Day 1 / Day 7 / Day 30 cadence, and the content-cancellation pipeline.

### The World-State Delta — single JSON document, authoritative

At Verdict close, the server composes one canonical document — `world_state_delta.json` — that captures every Trial outcome that affects ongoing canon. This document is the source of truth for every Season 2 content patch.

```jsonc
// apps/shared/seasons/season2/world_state_delta.json (composed live at Verdict close)
{
  "trial_id": "nexus_trial_2026",
  "closed_at": "2026-12-31T23:59:59Z",
  "rules_version_at_close": "3.0.0",

  "companion_sacrifice": {
    "sacrificed": "elara",            // | "human"
    "tally": { "elara_weight": 1247392, "human_weight": 1893102 },
    "romance_tag_eligible_players": 18472,    // count, no PII
    "cinematic_fired": "confession_elara_default"
  },

  "second_death_ballot": {
    "winner": "akai_shi",             // | "wraith_calder" | "wolf_lycos" | "vex_solene"
    "tally": {
      "wraith_calder": { "weighted_votes": 982341, "burnt_card_recoveries": 24812 },
      "wolf_lycos":    { "weighted_votes": 1102488, "burnt_card_recoveries": 31204 },
      "akai_shi":      { "weighted_votes": 1487293, "burnt_card_recoveries": 28991 },
      "vex_solene":    { "weighted_votes": 743012, "burnt_card_recoveries": 12483 }
    },
    "tie_break_used": false,
    "cinematic_fired": "verdict_ballot_akai"
  },

  "locke": {
    "status": "permadead",
    "cinematic_fired": "verdict_locke",
    "necromancer_cooldown_months": 9
  },

  "politician_fork": {
    "engagement_score": 0.84,         // 0-1, total card-play volume during Trial / playerbase
    "alignment_score": 0.31,          // -1 dark dominant ... +1 light dominant
    "resolution": "constrained_return", // "seat_sealed" | "constrained_return" | "full_return"
    "archon_aspirant_nemesis_id": "nemesis_calla_vance",
    "season_2_antagonist": "politician_constrained"
  },

  "vortex_post_trial": {
    "proximity_at_close": 79,         // ticked down from 91 during the Reclamation push
    "sectors_reclaimed_in_trial": 18,
    "sectors_remaining_consumed": 29
  },

  "loredex_drift": {
    "entries_unwitnessed": ["sector_outer_ven", "sector_hollow_arc", ...],  // dim in Loredex
    "entries_inscribed": ["nemesis_calla_vance_archon_aspirant", ...]       // newly canonical
  },

  "cross_arc_ripples": [
    { "target": "wraith_calder_dialog", "patch": "locke_silent_beat" },
    { "target": "jericho_jones_dialog", "patch": "akai_shi_grief" },
    { "target": "necromancer_cycle", "patch": "extended_cooldown_9mo" },
    // ... full list generated from the cinematic ripples
  ]
}
```

This document is **committed to the repo** at `apps/shared/seasons/season2/world_state_delta.json` immediately after Verdict close, on a release branch the Season 2 patch is cut from. The commit is signed by the operator who fired the resolution; the diff is reviewable.

### Patch composition — pre-authored variants, server-selected

Season 2's first patch is **not authored at Verdict close**. It is *composed* from pre-authored variants by the world-state delta. Every shippable variant exists in the build before the Trial opens; the delta selects which variants are activated.

The combinatorics:
- **2 companion-sacrifice variants** (Elara dies / Human dies)
- **4 ballot variants** (Wraith / Wolf / Akai / Vex)
- **3 Politician-fork variants** (sealed / constrained / full)
- **= 24 total Season 2 starting states**

All 24 ship pre-authored. The patch system activates exactly one. Variants that didn't fire become dead content in the build, removed in Season 2's second patch (Day 30).

### Content layout

```
apps/shared/seasons/season2/
├── world_state_delta.json                    # composed at Verdict close
├── companion_sacrifice/
│   ├── elara_dies/                           # variant content if Elara sacrificed
│   │   ├── dialog_overrides.ts               # Human's grief beats, Atarion entries
│   │   ├── loredex_patches.ts                # Elara's entry → past tense + "former Senator, deceased"
│   │   └── audio_archives.ts                 # Elara VO manifest → archived
│   └── human_dies/                           # variant content if Human sacrificed
│       ├── dialog_overrides.ts
│       ├── loredex_patches.ts
│       ├── audio_archives.ts
│       └── the_humans_chip_card.ts           # new card unlocked for romanced players
├── second_death/
│   ├── wraith_dies/
│   │   ├── recovery_ledger_attributions.ts
│   │   ├── akai_shi_silent_beat.ts
│   │   └── thaloria_loredex_patches.ts
│   ├── wolf_dies/
│   │   ├── anara_hunt_frozen.ts
│   │   ├── pack_tier_locked.ts
│   │   └── judge_dialog_patch.ts
│   ├── akai_dies/
│   │   ├── jericho_grief_canon.ts
│   │   ├── necromancer_cooldown_extended.ts
│   │   └── inscribe_akai_shi_inverted.ts     # flips the cross-arc reactivity
│   └── vex_dies/
│       ├── coda_dissolved.ts
│       ├── protocols_factional_contest.ts
│       └── engineer_pattern_released.ts
├── politician_fork/
│   ├── seat_sealed/                          # Season 2 has no Politician antagonist
│   ├── constrained_return/                   # yellow-tie iconography, partial doctrine
│   └── full_return/                          # Mechronis Academy reopens, full antagonist
└── shared/                                   # applies to all 24 variants
    ├── locke_permadead_patches.ts            # Adjudicator role unstaffed
    ├── mission_board_text_only.ts
    ├── rules_version_bump.ts                 # 2.0.0-fracture → 3.0.0
    └── memorial_codex_entries.ts             # MemorialWall additions
```

The patch composer reads `world_state_delta.json`, then loads exactly the directories the delta names. No conditional logic at runtime — the patches *are* the conditionals, expressed as content.

### Patch application order

Patches apply in three waves over 30 days, each wave gated on the prior wave's stability check passing.

**Wave 1 — Day 1 (immediately after Verdict close)**

```ts
// apps/server/services/season2PatchService.ts
async function applyDay1Patches(delta: WorldStateDelta): Promise<void> {
  // 1. Shared patches (always apply)
  await applyPatch('seasons/season2/shared/locke_permadead_patches');
  await applyPatch('seasons/season2/shared/mission_board_text_only');
  await applyPatch('seasons/season2/shared/rules_version_bump');
  await applyPatch('seasons/season2/shared/memorial_codex_entries');

  // 2. Companion-sacrifice variant
  await applyPatch(`seasons/season2/companion_sacrifice/${delta.companion_sacrifice.sacrificed}_dies`);

  // 3. Second-death variant
  await applyPatch(`seasons/season2/second_death/${delta.second_death_ballot.winner.split('_')[0]}_dies`);

  // 4. Politician-fork variant
  await applyPatch(`seasons/season2/politician_fork/${delta.politician_fork.resolution}`);

  // 5. Drop the Day 1 Daily Brief
  await scheduleDailyBrief('season2_day1', { delta });
}
```

The Day 1 Daily Brief is the player's first contact with the new world. It is a single composed page:

> **The Antiquarian's Ledger — Year-Closing Entry**
>
> *[Antiquarian narration, ≈400 words, composed from variant fragments. Names the dead. Names the lived. Does not editorialize. Sets the tone for Season 2.]*
>
> **What changed since you closed your eyes:**
> - Locke has been retired from the Adjudicator's bench. The mission board now files itself.
> - *[Sacrificed companion]* will not return. Their card is at rest in your collection.
> - *[Ballot winner]* gave their resurrection back. Their place in the saga is closed.
> - *[Politician variant copy]*
> - The Vortex has receded. *[Sectors reclaimed count]* sectors returned to light.
>
> **What remains:**
> - *[Surviving companion]* waits for you at *[location]*. They have not slept.
> - The Necromancer is dormant. He will be dormant for *[cooldown duration]*.
> - The card game continues. The rules have changed. (See: `RULES_VERSION 3.0.0`.)

**Wave 2 — Day 7 (the_humans_chip / unlock cards / Memorial Wall)**

Day 7's patch ships the unlockable content gated on the Trial outcome:
- If Human was sacrificed and the player was romanced ≥75: `the_humans_chip` card lands in their collection with the romance-tag pickup beat playing as a one-time cinematic on login.
- MemorialWall surface populates with the two dead characters and the Season 2 retrospective on the Trial's tallies.
- Loredex `In Memoriam` pages publish for Locke and the ballot winner.
- Pledged cards from Week 5 Preparation return to player collections with the "—pledged at the Council" annotation.

**Wave 3 — Day 30 (dead-variant cleanup + LORE_BIBLE regeneration)**

Day 30's patch removes the 23 unfired variants from the build, regenerates `LORE_BIBLE.md` from the post-Trial `loredex-data.json`, and runs the drift test (per CLAUDE.md ship-check rule). The build size drops sharply. The narrative-audit P0 lists for the two dead characters are closed with "deceased — content cancelled" entries.

### Loredex regeneration — the drift test

CLAUDE.md flags `LORE_BIBLE.md` regenerated from `loredex-data.json` as a ship-check item. Post-Trial, this is non-trivial because the Loredex itself has shifted:

1. **Entries unwitnessed** — sectors consumed by the Vortex that were not reclaimed go dark in the Loredex with *"lost in the Reclamation"* annotations. Their entries remain in `loredex-data.json` but flip to `status: "dark"`.
2. **Entries inscribed** — the Archon-aspirant Nemesis (if the Politician returned in any form) becomes a canonical Loredex entry; their dialog history is published.
3. **Entries memorialized** — Locke and the ballot winner gain `status: "deceased"` + `in_memoriam: true` flags; their pages become eulogies.
4. **Cross-arc references** — `LORE_BIBLE.md` mentions of Locke and the ballot winner are rewritten to past tense by the regeneration pass. The drift test catches any reference the patches missed.

The regeneration runs on Day 30, not Day 1, deliberately — to let the community sit with the Trial's outcome in the Daily Brief's voice for four weeks before the canonical lore document is updated.

### Romance state persistence

Romance state is per-player, not server-canonical. The Trial outcome is canonical (companion X is sacrificed) but the romance tag is private (this player's farewell included the romance variant). Server-side, romance state is recorded in `player_relationships` and read by:

- Day 1 Daily Brief — chooses whether to include the romance-private line in the composed page.
- Day 7 `the_humans_chip` unlock — gates the card on romance ≥75 *at the moment of sacrifice*.
- Season 2 surviving-companion dialog — references the dead companion differently for romanced players ("they meant it about you") vs non-romanced ("they meant it").

Romance state for the dead companion *freezes at sacrifice*. The player cannot un-romance the dead. Their relationship-tier card variant locks at whichever tier it held at Confession close — gold for romance ≥75, silver for 50–74, bronze for 25–49, base otherwise. The card is then burned (per the cinematic) but the *tier marker* persists in the player's collection history as a sealed achievement.

### Content cancellation — the deliberate retirement pipeline

For the two dead characters (Locke + ballot winner), the narrative-audit P0 lists are closed with cancellation entries. This is a *deliberate* engineering choice and worth naming explicitly:

```
# apps/shared/seasons/season2/cancelled_authoring.md
This file lists narrative content that was planned but is now cancelled
because the character it depended on died at the Nexus Trial.

## Locke (Adjudicator) — fixed canon, deceased
- [CANCELLED] Authority Trial Act 2 officiator dialog (~3000 lines)
- [CANCELLED] Recovery Ledger Season 2 expansion arc
- [CANCELLED] Adjudicator romance branch (was in Phase K)
- [PRESERVED] Prelude tutorial dialog (still ships for new players)

## [Ballot winner] — community-voted, deceased
- [CANCELLED] Season 2 character arc (~120 dialog scenes)
- [CANCELLED] Card variant set (silver/gold/legendary tiers)
- [CANCELLED] [Character-specific arcs from their bible's Phase K plan]
```

This file is committed alongside the world-state delta. It is the receipt that the saga *paid* for the Trial's gravity. Future producers and players can read it; the cancelled content does not haunt the backlog as half-finished work.

### Versioning

- `RULES_VERSION` bumps to `3.0.0` at Verdict close (hour 72). Matches in-progress finish under the prior version per the replay-pin spec.
- Loredex schema version bumps to `season2` with the Day 30 regeneration.
- Save file version bumps to `s2.1.0` on Day 1 (companion + ballot patches), `s2.2.0` on Day 7 (unlock content), `s2.3.0` on Day 30 (cleanup).
- Migration paths from `s1.x` saves are auto-applied at first Day 1 login.

### Stability checks between waves

Each wave runs an automated stability check before the next wave activates:

- **Day 1 → Day 7**: are clients successfully loading the new world state? Error rate on `loredex.fetch` and `companions.fetch` must be ≤0.1% over 24 hours.
- **Day 7 → Day 30**: are unlock cards distributing correctly? `the_humans_chip` (if applicable) must be in romanced-player collections at ≥99.5% rate.
- **Day 30**: does the regenerated `LORE_BIBLE.md` pass the drift test against `loredex-data.json`?

If any check fails, the next wave is held; the operator dashboard alerts; producers decide whether to push the patch with a known issue or to delay.

### Ship-check entries

```ts
// apps/shared/_completeness/registry.ts (additions)
{
  id: 'season2_world_state_variants',
  declared: () => 2 * 4 * 3,                                          // 24 combinations
  implemented: () => listSeason2VariantDirectories(),                 // must have 24 directories
  parityTest: 'apps/shared/seasons/__tests__/season2Variants.parity.test.ts',
},
{
  id: 'season2_cross_arc_ripples',
  declared: () => listAllCinematicCrossArcRipples(),                  // ~40 ripples across 5 deaths
  implemented: () => listSeason2RipplePatches(),
  parityTest: 'apps/shared/seasons/__tests__/season2Ripples.parity.test.ts',
},
{
  id: 'season2_lore_bible_drift',
  declared: () => extractCharacterReferences('docs/built/LORE_BIBLE.md'),
  implemented: () => extractCharacterReferences('apps/shared/loredex-data.json'),
  parityTest: 'apps/shared/__tests__/loreBibleDrift.test.ts',
},
```

The third entry — `season2_lore_bible_drift` — is the load-bearing one. CLAUDE.md flags lore drift as a P0 ship-check item, and the Trial's outcome is the largest single lore-mutation event the codebase will ever ship. The drift test is the receipt that the regeneration worked.

---

## Operator Runbook — The 72-Hour Live Event Playbook

A beautiful design fails if the humans running it don't know what to do at hour 37. This runbook converts the architecture into the playbook for the producers, on-call engineers, community managers, and narrative leads who shepherd the Trial.

### Crew composition

| Role | Count | Coverage | Primary responsibility |
|---|---|---|---|
| **Event Director** | 1 | full 72h (rotating naps) | Owns the abort decision. Owns the in-fiction tone. Final call on any deviation from runbook. |
| **On-call Engineer** | 2 (12h shifts) | full 72h | Watches Sentry / OTel. Owns the tick-drift response. Handles any server-side incident. |
| **Community Manager** | 2 (12h shifts) | full 72h | Watches Discord / Reddit / X. Owns the social-media cadence. Surfaces community sentiment to the Director. |
| **Narrative Lead** | 1 | full 72h (rotating naps) | Owns the Antiquarian's voice. Approves any out-of-band narration. Drafts the Daily Brief copy live. |
| **VO Director (on standby)** | 1 | on call | If a cinematic needs a re-record (worst case), they coordinate. |
| **Operator** | 1 | full 72h (12h shifts) | The hands on the abort button. Reports to the Event Director. Does not act without Director approval. |

Total crew: 8 people across 72 hours, with the Event Director and Narrative Lead taking sleep windows during quieter phases (Cross-examination 36–48 is the lowest-activity window).

### T-7 days — Final checklist

- [ ] `pnpm ship:check` PASS on all three Nexus Trial entries (phases, cinematic selectors, rate limits) + all three Season 2 entries (variants, ripples, lore drift).
- [ ] All 24 Season 2 variants verified in build (`pnpm test apps/shared/seasons/__tests__/season2Variants.parity.test.ts`).
- [ ] Staged load test passed: compressed 72h → 72m, 10× synthetic traffic, p99 tally lag ≤30s.
- [ ] Sentry alerts armed for the six monitored conditions (tick missed, testimony backlog, phase transition failure, operator abort, leaderboard subscription drop rate, cinematic selector branch failure).
- [ ] Operator dashboard tested by Operator and Event Director together; the abort button confirmed reachable in ≤3 clicks from any view.
- [ ] All 7 pre-authored cinematics (Locke + 4 ballot + 2 confession) playback-tested end to end at three resolutions (mobile, tablet, desktop).
- [ ] Daily Brief copy templates for all 24 variants reviewed by Narrative Lead.
- [ ] Romance-tag distribution dry-run: 100 synthetic romanced players receive the correct private cinematic in staging.
- [ ] PR / social-media announcement schedule locked. The "drum is here" trailer is queued for T-3 days.
- [ ] On-call rotation confirmed; backup on-call confirmed; escalation tree posted in #nexus-trial-warroom.
- [ ] Pre-recorded abort cinematic ("the Antiquarian closed the ledger early") playback-tested.

### T-1 day — Final 24 hours

- T-24h: PR / social-media trailer drops. The Three Clocks panel goes live for all players showing all three clocks at critical state.
- T-12h: Daily Brief drops the Antiquarian's pre-Trial address (≈200 words, ends with *"At the next dawn, the ledger opens."*).
- T-6h: All-hands sync in #nexus-trial-warroom. Crew confirms readiness. Operator runs one last abort-button reachability check.
- T-1h: Last-look sync. Event Director confirms go. Operator stands by. The Trial state in the database flips to `pre_trial` → ready for the tick service to flip it to `live` at T-0.

### Per-phase operator duties

For each 12-hour phase, the operator dashboard surfaces a phase-specific checklist:

#### Charge (hours 0–12)

- Watch testimony submission rate. Expected: 5–10× normal card-play volume in the first 6 hours.
- Watch the three Charge tallies (Architect-aligned / Dreamer-aligned / Insurgency-aligned). Daily Brief updates every 4 hours with the leading Charge.
- **Community Manager**: surface any community confusion about how voting works. The Charge phase is when most players first encounter the Trial; expect 100+ "what do I do" posts per hour. Pin the explainer thread.
- **Narrative Lead**: drafts the Opening Argument narration template based on the leading Charge at hour 8 (to be locked in at hour 12).

#### Opening Argument (hours 12–24)

- Cinematic selector for Opening narration fires at hour 12 transition. Operator confirms the cinematic played for all clients (Sentry: zero `cinematic_fired` failures).
- Watch the per-card-play tally. The top-played card becomes the canonical opening narration line read aloud by the Antiquarian.
- **Narrative Lead**: writes the live Antiquarian commentary for the Daily Brief feed, drawing from the top 10 played cards' flavor text.

#### Evidence (hours 24–36)

- Watch the faction-evidence tallies. Five card factions, five running tallies. The strongest faction's evidence carries forward to Cross-examination.
- **Community Manager**: watch for community organization around faction strategy. Discord servers will be coordinating; this is healthy. Watch for *brigading* (a single coordinated push that doesn't reflect organic play) — surface to Director.
- **On-call Engineer**: testimony backlog peaks here. Confirm aggregation lag ≤30s. Scale up read replicas if needed.

#### Cross-examination (hours 36–48)

- **Lowest activity window of the Trial.** Many players sleep. Event Director and Narrative Lead take their longest sleep window here.
- Watch the reactive-card aggregate. Faction whose evidence was strongest is now under challenge.
- At hour 48 transition: **second-death ballot resolves** (cinematic preloads for Verdict at hour 60). Operator confirms the ballot resolution wrote to the database. Cinematic remains hidden from players until hour 60.
- **Narrative Lead**: drafts the Confession-phase Daily Brief copy. Watches the companion-tally curve to anticipate which variant will fire.

#### Confession (hours 48–60)

- **Highest emotional stakes phase.** The companion-sacrifice vote runs live with the tally visible on the Daily Brief.
- **Community Manager**: expect organized vote campaigns. Both communities will mobilize. Watch for harassment of players voting the "other" companion. Coordinate with Trust & Safety on any escalations.
- At hour 60 transition: **companion sacrifice resolves**. Confession cinematic fires for all clients simultaneously. Romance tags fire for romanced players client-locally.
- **Event Director**: this is the most likely moment for an abort decision. Confirm with Narrative Lead that the cinematic landed; confirm with Operator that the resolution wrote to all required tables; confirm with Community Manager that the community is processing rather than rioting.

#### Verdict (hours 60–72)

- The ballot resolution preloaded at hour 48 now fires. Locke's cinematic plays first; the ballot winner's plays second.
- Daily Brief surfaces the final tally and the world-state delta in draft form.
- **Operator**: at hour 71, takes a final pre-close DB snapshot. The Trial closes at hour 72; the snapshot is the canonical record.
- **Event Director**: signs the world-state delta commit. The Season 2 patch wave 1 fires at hour 72 + 5 minutes.

### Communication cadence

| Channel | Cadence | Voice | Owner |
|---|---|---|---|
| **Daily Brief in-game** | Every 4 hours during the Trial | Antiquarian (canon) | Narrative Lead |
| **Three Clocks panel** | Real-time (1-min tick) | Diegetic UI | Auto |
| **Discord #announcements** | Every 12 hours (phase transitions) | Producer voice (out-of-canon) | Community Manager |
| **Discord #live-watch** | Continuous, conversational | Community manager voice | Community Manager |
| **X / Bluesky** | Every 12 hours + key moments | Marketing voice | Community Manager |
| **PR / press** | T-3 days trailer, Verdict close, Day 7 follow-up | Marketing voice | Marketing (external) |

In-fiction comms (Daily Brief, Three Clocks, cinematics) never break the fourth wall. Out-of-canon comms (Discord, social) acknowledge the live event and the community's participation directly. The two voices do not mix.

### Abort criteria

The Event Director may fire the abort under exactly these conditions:

1. **Server failure** — extended downtime (>30 min) of any core service (tick, testimony, leaderboard).
2. **Tally corruption** — confirmed evidence of vote manipulation or DB corruption that cannot be remediated in-place.
3. **Safety incident** — coordinated harassment campaign tied to the vote that requires platform-level intervention.
4. **Legal/PR escalation** — external pressure that requires immediate pause (highly unlikely; included for completeness).

The Event Director may *not* fire the abort for:
- Community displeasure with how the vote is trending.
- A cinematic that lands poorly with one segment of the community.
- A player who claims they were "cheated" by the tally.
- Pressure from marketing or executive stakeholders to "fix" the outcome.

Abort decisions are logged with reason; the runbook entry above is the binding criteria. The Event Director can be overruled only by the studio head, in writing, before the abort fires.

### Post-event handoff (hour 72 → Season 2 patch team)

- Hour 72: world-state delta committed. Season 2 patch service activates wave 1.
- Hour 72 + 5 min: Day 1 Daily Brief drops to all clients.
- Hour 72 + 1h: Event Director hands off to Season 2 lead. Runbook owner shifts from live-event to live-ops.
- Hour 72 + 24h: post-mortem scheduled (within 5 business days). Crew submits one-page write-ups for the post-mortem packet.

### Sleep, food, and morale

72 hours is long enough that crew well-being is operationally relevant — exhausted crew make worse abort decisions.

- Mandatory 6-hour sleep window per crew member, scheduled in the runbook (Cross-examination is the default window for Director / Narrative Lead).
- Food provisioning on-site for the war room (the studio pays).
- Mental-health check-ins at hour 24, hour 48, hour 60, hour 71. A crew member may step out at any check-in; backup on-call activates.
- The Trial is a one-time event. Crew should not be running on hero mode for a recurring quarterly thing.

---

## Cost Ledger — What's Retired vs What's Unlocked

The Trial *spends* content to *buy* meaning. This ledger names the prices explicitly so the trade is visible to producers, leads, and stakeholders. All quantities are rough estimates pending audit; the shape matters more than the exact numbers.

### Retired at Verdict close (the deliberate cancellations)

| Category | Item | Estimated authoring cost saved | Notes |
|---|---|---|---|
| **Dialog** | Locke Season 2 arc (Adjudicator officiator beats Acts 2–6) | ~3,000 lines | Permanent. Prelude tutorial preserved. |
| **Dialog** | Ballot winner Season 2 arc (~120 scenes, planned through Phase K) | ~5,000 lines | Permanent. Already-written historical dialog preserved. |
| **VO** | Locke Season 2 VO (estimated 4 sessions @ Session voice rate) | ~$8,000 | Not yet recorded; cancelled before booking. |
| **VO** | Ballot winner Season 2 VO (estimated 6 sessions) | ~$12,000 | Not yet recorded; cancelled before booking. |
| **Card art** | Locke silver/gold/legendary variants | 3 commissions | Not yet commissioned; cancelled. |
| **Card art** | Ballot winner silver/gold/legendary variants | 3 commissions | Not yet commissioned; cancelled. |
| **Design** | Adjudicator romance branch (was in Phase K) | ~80 hours design + writing | Permanent. |
| **Design** | Ballot winner Phase K arc beats | ~120 hours design + writing | Permanent. |
| **Engineering** | Two character-specific router endpoints | ~40 hours | Endpoints stub to memorial responses. |
| **Engineering** | Dead-variant cleanup (Day 30) | ~20 hours engineering | One-time. |

**Total saved ≈ 8,000 lines of dialog, ~$20,000 in VO, ~6 card art commissions, ~200 hours of design, ~60 hours of engineering.** This is real money the studio does not spend in Season 2. It is paid in narrative gravity.

### Retired at Verdict close (the 23 dead variants)

| Category | Item | Cost | Notes |
|---|---|---|---|
| **Engineering** | 23 unfired Season 2 variant directories | Sunk authoring; cleanup ~20h | Removed Day 30. |
| **Cinematics** | 6 unfired pre-authored cinematics | Sunk; ~$30k authoring + ~$15k VO | The Trial's cost-of-options. Necessary. |
| **Audio** | Variant-specific music stings (~30 stings @ ~$500) | Sunk; ~$15k | Same as above. |

**Total sunk ≈ $60,000 of pre-authoring that ships but never plays for the live community.** The unfired variants are visible in the build for ~30 days then deleted. *This is the price of letting the community author the climax.* Worth saying clearly so no stakeholder mistakes it for waste.

### Unlocked by the Trial outcome

| Category | Item | Estimated new authoring cost | Notes |
|---|---|---|---|
| **Dialog** | Sacrificed companion grief beats in surviving companion's Season 2 | ~600 lines | Composed from variant fragments. |
| **Dialog** | Ballot winner cross-arc ripple patches (5 surfaces) | ~400 lines | Per the cinematic ripple list. |
| **Card** | `the_humans_chip` (if Human sacrificed) | 1 card def + art + audio | New collectable for romanced players. |
| **Card** | Memorial burnt-card variants (2 chars × all owners) | 2 burnt-card art assets + flavor | Reuse burnt-card placeholder pipeline. |
| **Loredex** | `In Memoriam` pages for Locke + ballot winner | ~2,000 words | Composed from variant + Daily Brief copy. |
| **Loredex** | Archon-aspirant Nemesis canonization (if Politician fork constrained/full) | ~1,500 words | Adds a Season 2 antagonist entity. |
| **Cinematics** | Day 7 MemorialWall reveal + romance-tag chip pickup | 2 short cinematics | Tied to Wave 2 patch. |
| **Engineering** | Three-wave patch service + drift test runner | ~80 hours | Permanent infrastructure. |
| **Engineering** | Politician-fork antagonist scaffolding (if constrained/full) | ~120 hours | Sets up Season 2 antagonist arc. |
| **Design** | Necromancer extended-cooldown cycle redesign | ~40 hours | The longest dormancy in the system. |

**Total unlocked ≈ 4,500 lines of new dialog (composed, not from scratch), 4 new cards/art assets, 240 hours of new engineering (most of it permanent infrastructure that benefits all future seasons).**

### Net position

The Trial is *cost-positive in authoring efficiency*: it retires ~8,000 lines of planned dialog and unlocks ~4,500 lines of new dialog — a net reduction of 3,500 lines, with the surviving content being *more emotionally weighted* because it's responding to a specific community outcome rather than authored in a vacuum.

It is *cost-negative in cinematics*: the 23 unfired variants represent ~$60k of pre-authoring that ships and dies. This is the visible price of the once-ever event.

The infrastructure unlocked (patch service, drift test runner, Three Clocks panel, replay-pinning at scale, Politician-fork antagonist scaffolding) is permanent and re-usable. Future seasonal events can draw on it without paying these costs again.

### Budget approval checkpoints

- **At plan approval** (now): leadership signs off on the ~$60k cinematics sunk cost as the deliberate price of the once-ever event.
- **At T-30 days**: leadership signs off on the cancellation receipts in `cancelled_authoring.md` — the producers confirm that the cancelled work was indeed cancelled (not just unfinished).
- **At Day 30 (post-Trial)**: actuals reported against estimates. Variances ≥20% trigger a budget review for any future event of this scale.

---

## Risk Register

What could go wrong, how likely, how bad, what we do about it. Risks are ranked by impact × probability with the mitigation strategy named.

### Operational risks

| Risk | Probability | Impact | Mitigation | Abort threshold |
|---|---|---|---|---|
| Tick service drift (>60s) | Medium | High | Sentry alert at 30s. Manual operator override to recompute and resync. | Sustained drift >5 min → abort. |
| Testimony aggregation backlog (>5 min) | Medium | Medium | Read-replica scaling. Async batching at client. Backlog visible on operator dashboard. | Backlog >30 min → abort. |
| Database failover during Trial | Low | Catastrophic | Hot standby. Sync replication on the testimony table. Failover runbook tested in staging. | Failed failover → abort. |
| Cinematic selector misfires (wrong variant plays) | Low | High | Three ship-check entries gate the build. Selector branches manually tested at T-7. | Misfire on Verdict cinematic → emergency re-fire of correct variant, not abort. |
| WebSocket fan-out failure (leaderboard stops updating) | Medium | Low | Fallback to 30s polling. Sentry alert on subscription drop rate >5%. | Total fan-out failure for >15 min → degraded service notice, not abort. |
| Sentry / OTel offline during Trial | Low | High | Backup metrics endpoint. Operator dashboard can run on direct DB queries. | Observability blind for >10 min → abort. |
| Replay-pin failure (mid-Trial rules version drift) | Low | High | Replay-pin tested in staging at version-bump boundary. | Confirmed replay corruption → abort. |

### Vote manipulation risks

| Risk | Probability | Impact | Mitigation | Abort threshold |
|---|---|---|---|---|
| Bot accounts swinging companion vote | Medium | High | Witnessing-weight scaling. New accounts with no history have ~0 weight. Anti-bot monitoring during Trial. | Confirmed coordinated bot push >5% of tally → abort and rerun with bot exclusion. |
| Coordinated brigading of ballot vote | High | Medium | Community organization is expected and healthy. Brigading defined narrowly: a single coordinated push not reflected in organic play. Identified by Community Manager surfacing patterns. | Not an abort condition; vote stands. Communicated transparently to community. |
| Vulnerability that lets clients submit testimony for cards they didn't play | Low | Catastrophic | Server-side match-state validation. Card-play submissions cross-checked against match logs. Pen-tested before T-7. | Confirmed exploit → abort and reroll vote with affected period excluded. |
| Stream sniping (reading tally to time-vote) | High | Low | The tally is *designed* to be visible. This is feature, not bug. Stream-sniping is participation. | Not a risk. |

### Narrative risks

| Risk | Probability | Impact | Mitigation | Abort threshold |
|---|---|---|---|---|
| Community votes Vex + low engagement → Politician returns full strength | Medium | Narrative-shifting (intentional) | This is *by design*. Season 2 antagonist is the cost of indifference. Producers prepared. | Not an abort condition. |
| Community votes Locke's mirror (Wraith) → world feels archivally hollowed-out | Medium | High | Mitigated by Recovery Ledger transferring to a surviving character automatically. Cinematic acknowledges the gap. | Not an abort condition. |
| Antiquarian's narration lands flat (community reads it as melodramatic) | Medium | Medium | Narrative Lead drafts live Daily Brief copy with sentiment monitoring. Adjust register if hostile. | Not an abort condition; adapt copy. |
| Romance tag fires for non-romanced player (state-corruption bug) | Low | Medium | Romance state cross-checked at Confession cinematic firing time. Failed check → fall back to canonical farewell. | Not an abort condition; per-player corruption. |
| Cinematic doesn't land emotionally for any of the four ballot winners | Low | High | Each cinematic playtested with non-team viewers at T-30. Voice direction confirmed against each character's bible. | Not an abort condition. |

### Community-reception risks

| Risk | Probability | Impact | Mitigation | Escalation |
|---|---|---|---|---|
| Players angry that their preferred companion died | High | Designed | The Trial is *meant* to make this hurt. Community Manager prepared for emotional responses; no defensive posture. | Trust & Safety supports individual cases of harassment. |
| Accessibility complaints (timing-locked phases discriminate against time-limited players) | Medium | Medium | Trial spans 72 hours across multiple time zones — most players can participate in some phase. Phase summaries archived for asynchronous catch-up. Witnessing-weight does not require live presence; recorded card plays count. | Address case-by-case; do not change Trial design mid-event. |
| Streamers / content creators "ruining" the surprise of cinematics | High | Low | The Trial is designed to be streamed. Cinematics ship knowing this. No spoiler embargo. | Not a risk; embrace it. |
| Players upset that their vote "didn't matter" because their candidate lost | Medium | Medium | Daily Brief frames every contribution as Light Energy that pushed back the Vortex regardless of vote outcome. Reframes "lost" as "every name carried fewer sectors into the dark." | Communicate the reframe explicitly. |
| Toxic player communities forming around vote camps | Medium | High | Discord moderation pre-briefed. Trust & Safety on call. Clear community standards posted T-3 days. | Permaban as needed; do not delay. |
| Players feel manipulated by the Politician-fork engagement mechanic | Low | Medium | Disclose the mechanic in the T-7 days post. Players who engage do so knowingly. | Transparency over surprise. |

### Production risks

| Risk | Probability | Impact | Mitigation | Slip path |
|---|---|---|---|---|
| Cinematic VO not ready by T-7 | Medium | High | VO sessions booked T-60. Backup VO Director on standby. | Slip to T-3, then emergency re-record. |
| Art assets for Memorial burnt cards delayed | Low | Medium | Burnt-card placeholder pipeline as fallback. | Ship placeholder Day 1, replace Day 7. |
| Three Clocks panel localization incomplete | Medium | Low | English-first launch. Other locales catch up Day 7. | Communicated up front. |
| Ship-check failures blocking T-7 readiness | Medium | High | Fix-it days scheduled T-14 to T-7. | If still failing at T-3: emergency review with leadership. |
| Server capacity provisioning insufficient | Low | Catastrophic | Load test at 10× synthetic confirmed pass. 2× headroom on top. | Auto-scaling armed; engineering pre-approved spend. |

### Legal / PR risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Players claim Trial outcome was rigged by studio | Medium | Medium | Open-source vote-tally code under MIT license at T-7. World-state delta committed publicly. Auditor team available for post-mortem. |
| Bad-faith content (e.g., a Nemesis name that becomes a slur) becomes canonical | Low | High | Top-played cards reviewed live by Narrative Lead before Daily Brief publishes. Reject any that fail content standards. |
| Cinematic content triggers content-moderation flag on console / platform | Low | Medium | Cinematics reviewed by platform-relations team T-14. Backup edits ready. |
| Trial happens during a real-world crisis that makes the death-celebration framing tone-deaf | Low | High | Trial dates flexible by ±2 weeks if needed. Final dates locked T-30. Producers monitor news cycle. |

### Risk-response decision rights

- Operational risks → On-call Engineer escalates to Event Director.
- Vote manipulation risks → Operator surfaces; Event Director decides.
- Narrative risks → Narrative Lead surfaces; Event Director ratifies.
- Community-reception risks → Community Manager handles direct; escalates patterns to Event Director.
- Production risks → Producer escalates to leadership pre-Trial; in-Trial slip is Event Director's call.
- Legal / PR risks → Studio comms leads; Event Director defers.

The Event Director owns the abort. Everything else escalates *toward* the Director, but the Director's authority is bounded by the abort criteria in the runbook. No risk-response decision overrides the runbook without studio head sign-off in writing.

---

## Section E Dependency Audit — Reality Check

### Status table

| Module | Status | Notes |
|---|---|---|
| `necromancerCycle.ts` (429 LOC) | **SHIPPED** | Full phase machine: dormant→stirring→awakening→manifesting→returned→banishment_active→banished. Hidden energy meters. Has `necromancerCycle.test.ts`. |
| `dischordiaCycle.ts` (688 LOC) | **SHIPPED** | Light/Dark meter, vortexProximity 0–100 monotonic, full phase machine (dawn → dimming → long_night → vortex_advance → reclamation → light_holds). Has tests + phase5 variant. |
| `nemesisSystem.ts` (1022 LOC) | **SHIPPED** | Phase K complete (132/132 pair-banks). 7-layer Archon Ascension Ladder, Politician propaganda tics, grudge tier 0–5. Has 4 test files. |
| `resurrectionProtocols.ts` (573 LOC) | **SHIPPED** | All 6 resurrectable NPC keys present (vex_solene, wraith_calder, locke, jericho_jones, akai_shi, **lycos**). Path A/B pipeline defined. Plan's `permadead: true` extension is greenfield. |
| `episodeMysteries.ts` (8132 LOC) | **SHIPPED** | 14 mystery arcs wired. `inscribe_akai_shi` → Jericho E5 contract-seal cross-arc reactivity at lines 1161–1217 confirmed (clue at 1194, deduction at 1211). Pattern is reusable for Season 2 ripples. |
| `MemorialWall.tsx` (264 LOC) | **SHIPPED** | Deceased roster by bloodline, extinction tracking, spectral-form integration. Consumes `darrenMemorial.ts`. |
| `apprenticePermadeath.ts` (284 LOC) | **SHIPPED** | 12 epitaph archetypes, mourning profiles with morale deltas, ghost echoes. All 12 archetypes mapped. |
| `darrenMemorial.ts` (183 LOC) | **SHIPPED** | THE_ASSISTANT memorial card, post-finale beacon, three unfinished Cryo Dreams scenarios. |
| `convergenceClimax.ts` (292 LOC) | **SHIPPED** | 3 resolution objects with narrative/cinematic/NPC reactions/cascade fields. Runtime integration point not visible in the file itself. |
| `trialPhase.ts` (359 LOC) | **SHIPPED with caveat** | §5.8 Authority Trial engine fully wired: 10-phase rule table, verdict-threshold formula, admissibility + apply + resolve functions. **CAVEAT**: per-card `verdict_delta` not yet authored — currently placeholder `+1 per play`. Playable but not deck-craft-sensitive. |
| `authority-trial-phase-mechanic.md` | **SHIPPED** | Full spec exists, tracked. |
| `burnt_card_placeholder.ts` | **SCAFFOLDED** | Type marker stub. Needs expansion to roster of ~20 placeholders for Mission 1 (Salvage). |
| `version.ts` (41 LOC, RULES_VERSION 1.1.0) | **SHIPPED** | Semver discipline + `isReplayCompatible()`. Replay-pin infrastructure functional. |
| `expansionUnlockService.ts` (274 LOC) | **SHIPPED with caveat** | Evaluator framework + 124 S2 cards consume it. **CAVEAT**: `secret_act_N_revealed` writers missing per registry line 219; `act_N_complete` writers exist. Half-wired. |
| `unlockCondition` UI surfaces | **SCAFFOLDED** | `founding_author` and `authors_edition` conditions have no UI (registry line 196, ratchet target 0). Players hit black boxes. |
| `apps/server/routers/witnessing.ts` | **MISSING** | Plan cited singular; codebase has `twoWitnessesDecode.ts` + `epochWitness.ts`. Needs consolidation or delegation pattern. |
| `guild.ts` (901 LOC) | **SHIPPED** | Full CRUD, rippleEngine wired at line 8, donation milestones, recruitment. Has tests. |
| `dailyBrief.ts` (770 LOC) | **SHIPPED** | Quest generation + rewards + reset state machine. Has tests. |
| `seasonTickService.ts` (444 LOC) | **SHIPPED** | 5-minute tick, idempotent. Has tests + integration variant. Nexus tick extension is greenfield. |
| `companionData.ts` / `companionComments.ts` / `companionAskTopics.ts` | **SHIPPED** | Full roster, all integrated. Tests exist. |
| `lockeVoManifest.json` | **SHIPPED** | Asset manifest tracked. |
| NPC Bible: `vex_solene.md` (102K) | **SHIPPED** | Richest bible in the cast. |
| NPC Bible: `wraith_calder.md` (241K) | **SHIPPED** | Massive bible. |
| NPC Bible: `akai_shi.md` (8.1K) | **SHIPPED** | Bible present. |
| NPC Bible: `jericho_jones.md` (7.8K) | **SHIPPED** | Bible present. |
| NPC Bible: `lycos.md` | **MISSING** | Declared resurrectable in `resurrectionProtocols.ts:41`, has VO manifest + wolf-hunt mechanics, but **no narrative identity document**. Content-authoring gap. |
| `_completeness/registry.ts` (1299 LOC) | **SHIPPED** | 150+ completeness entries. `pnpm ship:check` is the binding contract. |
| `global_alignment_meter` (registry line 466) | **MISSING** | **The big one.** Server column + aggregator + tRPC reader for galaxy-wide Light/Dark. Currently doc-only. Section E's Vortex/Reclamation framing requires this. |

### Bottom Line — top 5 risks the plan must absorb

1. **`global_alignment_meter` has no runtime** (registry line 466). The Vortex/Reclamation framing — the Trial's "Light Energy push-back" against `vortex_advance`, the second-death cinematic's "the dying name walks into the Vortex's leading edge," the post-Trial sectors-reclaimed count in `world_state_delta.json` — all of it presumes the meter aggregates. It doesn't. **Schema column + server aggregator + tRPC reader must land in Sprint 1.**

2. **`trialPhase.ts` per-card `verdict_delta` not authored.** Each card declares `trial_categories` but does not declare its delta-on-play. Currently a placeholder `+1 per play`. The Authority Trial — and by extension the Nexus Trial's six-phase resolution — is mechanically linear rather than deck-craft-sensitive. **Authoring task: per-card deltas across the meta-relevant card pool. Lands in Sprint 8 alongside the Trial-format Act finales.**

3. **`lycos.md` bible missing.** The Wolf has VO + mechanical hooks but no narrative identity document. Ballot Cinematic B's final lines depend on his bible's voice direction. **Authoring task: lands in Sprint 11 before VO booking for Wolf cinematic.**

4. **`unlockCondition` UI surfaces incomplete.** `founding_author` and `authors_edition` lock-states have no player-facing reason. If Preparation Missions gate any rewards behind these, players hit black boxes. **UI task: at minimum stub the lock-reason copy. Lands in Sprint 5 alongside Mission framework.**

5. **`secret_act_N_revealed` writers not wired** (registry line 219). Half the narrative-flag bridge: `act_N_complete` writers exist, `secret_act_N_revealed` writers don't. If Section E uses secret-act gating for any unlock, the flag is never set. **Writer task: lands in Sprint 5 alongside Mission framework.**

### Secondary gaps to absorb

- **`witnessing.ts` consolidation**: the plan cites a singular router; the codebase has two specialized routers (`twoWitnessesDecode.ts` + `epochWitness.ts`). Decision needed: consolidate into one router or update the plan + the Nexus Trial vote-weight calculation to delegate. **Recommended**: delegate. The Nexus tally calculator reads from both sources. **Lands in Sprint 1.**
- **`burnt_card_placeholder.ts` is a stub.** Mission 1 (Salvage) needs a roster of ~20 burnt-card placeholders. **Lands in Sprint 6 as part of Mission 1 implementation.**
- **`expansionUnlockService.ts` half-wired.** Companion variant unlocks (Sprints 7–8) depend on this being fully wired. **Lands in Sprint 5 alongside Mission framework.**

### What this means for the Implementation Phasing

Sprint 1 expands from "foundation: existing-module audit + extensions" to absorb three blockers: **global_alignment_meter runtime**, **witnessing consolidation**, and **the existing `permadead: true` flag extension**. The phasing below has been updated. None of the audit findings push the Trial date — but all of them collapse Sprint 1's slack. **Sprint 1 must ship on time or the schedule slips at the back.**

The audit confirms the plan is *largely* sitting on top of shipped infrastructure. The Three Clocks subsystem in particular is real and tested. The biggest gap (global_alignment_meter) is one column + one aggregator + one tRPC reader — bounded work. The smallest gaps (lycos bible, burnt-card roster expansion) are authoring tasks that ride existing pipelines.

---

## Cosmetic Rewards — Commemorative, Not Grindy

The Trial's core artifact is the deaths and the authored Season 2. Cosmetics exist as **commemoratives** — proof of participation, mementos of choices, markers of presence — not as a grind ladder. Players should never feel they need to play more to "earn" the Trial. Every cosmetic below is earned by *participating*, not by hitting a threshold.

The Cost Ledger above counts cosmetics under "unlocked content"; full asset list lives at `apps/shared/seasons/season2/cosmetics/`.

### Universal commemoratives (every player who logged in during the 72-hour window)

These ship automatically. No claim flow, no missable window beyond the Trial itself.

| Item | Surface | What it is |
|---|---|---|
| **The Antiquarian's Quill** | Avatar item | Profile decoration. Held by players who were present during any Trial phase. Hovering shows the player's phase-presence record. |
| **Locke's Pendant** | Avatar item / chest decoration | A small ledger-icon pendant. Held by every player who logged in during the Trial. The pendant's inscription reads *"She filed the world."* |
| **Witness of MMXXVII** | Player title | Selectable title. Year reflects the Trial's calendar year. |
| **Ledger Profile Theme** | Profile page styling | Replaces the default profile with a parchment-and-ink Adjudicator-bench theme. Toggleable. |

### Phase-presence pins (one per phase the player played in)

Six pins, one per Trial phase. Auto-granted if the player submitted any testimony during that phase. Cumulative — players can hold all six. Displayed as a horizontal strip on the profile.

| Pin | Granted for |
|---|---|
| **Charge Pin** (verdict-arrow icon) | Any testimony submitted hours 0–12 |
| **Opening Pin** (pen-nib icon) | Any testimony submitted hours 12–24 |
| **Evidence Pin** (scales icon) | Any testimony submitted hours 24–36 |
| **Cross-examination Pin** (broken-chain icon) | Any testimony submitted hours 36–48 |
| **Confession Pin** (open-hand icon) | Any testimony submitted hours 48–60 |
| **Verdict Pin** (sealed-ledger icon) | Any testimony submitted hours 60–72 |

A player who plays all six earns a small bonus visual flourish on the pin strip (subtle glow), not a separate cosmetic — the achievement is being present for the whole 72 hours.

### Preparation Mission medals (one per completed mission)

Five medals, one per Preparation Mission completed in November. Auto-granted on mission pass. Failed missions do not grant the medal but the player can re-display the *attempted* state — there is value in having tried. Medals are displayed as a row on the profile beneath the phase pins.

| Mission | Medal name | Visual |
|---|---|---|
| 1 — Salvage | **The Recovered Hand** | Five burnt cards bound by Wraith's ribbon |
| 2 — Reverse Trial | **The Filed Page** | Locke's quill resting on a sealed page |
| 3 — Elara's Tribunal | **The Substrate Bloom** | A rose-and-grey fractal flower |
| 4 — The Question | **The Open Chip** | The Human's chip, mid-handoff |
| 5 — Bidding War | **The Council Seal** | The 24 sub-house sigils arranged as a wheel |

### Ballot-winner mementos (one cosmetic per ballot outcome, granted to every player)

Whichever ballot name the community chooses, every player receives the corresponding memento — *not* gated on having voted for that name. The memento honors the dying name, not the voter's loyalty.

| If sacrificed | Memento | Surface |
|---|---|---|
| Wraith Calder | **The Thumb-Marked Ledger** | Profile decoration: an open ledger with the recovered names visible on the inside cover |
| The Wolf (Lycos) | **The Pack's Half-Circle** | Profile decoration: the empty bench with the Pack arrayed around it |
| Akai Shi (Red Death) | **The Grey Helmet** | Avatar item: a small helmet, faded from red to grey, hover text shows the Antiquarian's closing line |
| Vex Solène | **The Unfinished Inventory** | Profile decoration: a ledger page with three checks and a blank fourth line |

These mementos are *the* visible marker of which Trial the player was in. Long after Season 2 ships, a player's Vex Memento or Akai Memento is a conversation piece. The community will recognize each other by them.

### Companion-sacrifice cosmetics (per-player, tied to who survived)

The surviving companion's relationship-tier card variant unlocks one tier higher *for the player* (silver → gold, gold → legendary) as a Day 7 reward. The dying companion's tier locks at sacrifice (per the Romance state freeze in the patch composition section) and becomes a sealed achievement marker on the player's collection. Romanced players who participated in Confession receive an additional cosmetic:

| Romance branch | Cosmetic | Surface |
|---|---|---|
| Elara romanced, then sacrificed | **The Senate Seat** | Profile decoration: an empty seat in the Atarion Senate chamber. Only visible to the player. |
| Human romanced, then sacrificed | **The Chip** | Avatar item: the small chip from his final cinematic. Glows faintly. Only visible to the player. |

These are **private cosmetics** — they appear on the player's own profile view but do not display to other players. The romance was theirs; the memento is theirs.

### Politician-fork cosmetics (per-server, tied to Season 2's antagonist shape)

These reflect the community's collective engagement outcome. Every player who participated in the Trial sees their cosmetic update on Day 1 of Season 2 based on the resolution.

| Fork outcome | Cosmetic | Surface |
|---|---|---|
| `seat_sealed` (high engagement + Light) | **The Sealed Seat** | Profile banner: a marble seat with a quiet seal across it. Hover: *"You closed the door before she returned."* |
| `constrained_return` (high engagement + Dark) | **The Yellow Thread** | Profile banner: a yellow thread running through the player's other cosmetics. Hover: *"You watched her come back. You kept her bounded."* |
| `full_return` (low engagement) | **The Open Seat** | Profile banner: an empty seat with a yellow sash draped over it. Hover: *"You let her sit."* |

The `full_return` cosmetic is deliberately the most striking visually — players who *didn't* participate end up with a cosmetic that makes the absence visible to others. This is not punishment; it is **memory**. The Antiquarian's pen does not lift for anyone unfairly, but it does record who was present.

### Burnt-card variants (already specified)

Locke's card and the ballot winner's card become **burnt-card variants** in every player's collection (per the cinematic spec). These are not "rewards" — they are mementos of the lost — but they function as cosmetics in that they replace the original card art and flavor permanently. Players who used Locke's card in any Authority Trial match across the saga see her variant first.

### No FOMO mechanics

Critically — there is *no* premium-currency purchase path for any of these cosmetics. None are gated behind a battle pass tier above the participation threshold. None are available for purchase after the Trial closes.

The Trial is **once-ever**. The cosmetics are **once-ever**. A player who logs in for the first time in Season 2 will see other players wearing the Antiquarian's Quill and Locke's Pendant and the memento of whichever name fell. They will not be able to get those items. They missed the Trial.

This is the point. The cosmetics are a *visible record of who showed up*. Their value comes from never being available again, not from being hard to earn.

### Authoring cost

| Item | Asset count | Estimate |
|---|---|---|
| Universal commemoratives (4 items) | 4 commissions | ~$1,200 |
| Phase pins (6) | 6 small commissions | ~$900 |
| Preparation medals (5) | 5 commissions | ~$1,500 |
| Ballot-winner mementos (4) | 4 commissions | ~$1,600 |
| Companion-sacrifice private cosmetics (2) | 2 commissions | ~$600 |
| Politician-fork banners (3) | 3 commissions | ~$900 |
| Profile theme (Ledger) | 1 medium commission | ~$2,000 |
| **Total** | **25 assets** | **~$8,700** |

This is a small addition to the Cost Ledger — under 1% of the sunk-cinematic budget — and fits inside the existing Wave 1 + Wave 2 patch service without new infrastructure. Commissions begin Sprint 11 alongside the cinematic art commissions; cosmetics land in the Wave 1 patch on Day 1.

### Ship-check entry

```ts
{
  id: 'season2_cosmetic_grants',
  declared: () => listAllCosmeticGrantRules(),       // ~20 grant rules across 6 categories
  implemented: () => listImplementedGrantRules(),
  parityTest: 'apps/shared/seasons/__tests__/cosmeticGrants.parity.test.ts',
}
```

Every cosmetic must have a declared grant rule and a runtime path; players who qualified for a cosmetic and did not receive it is a bug, not a CS ticket.

---

## Critical Files and Patterns to Modify

This plan touches many areas; the most load-bearing changes:

### New modules (climax-specific)
- `apps/shared/nexusTrial/` — Trial phase engine, vote-tally aggregation, real-time leaderboard. Mirrors `apps/shared/tradeEmpire/convergenceClimax.ts`.
- `apps/server/routers/nexusTrial.ts` — tRPC endpoints for vote submission (card-play as testimony), phase tick, sacrifice-vote tally, verdict resolution.
- `apps/server/services/nexusTrialService.ts` — 12-hour phase tick driven by the existing 5-minute season-tick infrastructure (`seasonTickService.ts`).
- `apps/shared/companionsRetired.ts` + `apps/shared/npcsDeceased.ts` — registries gating dialog lookups post-Verdict.
- `apps/client/src/pages/NexusTrialPage.tsx` — live leaderboard, phase clock, sacrifice-vote tally, Antiquarian narration feed.

### Reuse and extend (don't reinvent)
- `apps/shared/necromancerCycle.ts` — the Necromancer's phase machine is the spine of the Banishment-as-Trial mechanic. Add a terminal-cycle branch where the Banishment Arc redirects into the Nexus Trial and the cooldown extends from 30 days to months.
- `apps/shared/dischordiaCycle.ts` — the Vortex / Light-Dark / sector-consumption engine drives the Three Clocks panel and the Reclamation framing of the second death.
- `apps/shared/nemesisSystem.ts` — the 7-layer Archon-Ascension Ladder is the Politician-fork resolver. Wire post-Verdict logic to read engagement + Light/Dark balance and resolve the Archon-aspirant.
- `apps/shared/resurrectionProtocols.ts` — extend with a `permadead: true` flag per NPC; Locke and the ballot winner flip to it at Verdict. Path B Necromancer transmissions become the Manifesting-phase dialog source.
- `apps/shared/episodeMysteries.ts` (lines 1161–1217, `inscribe_akai_shi` cross-arc reactivity) — pattern for the cross-commentary cascade. Apply across the surviving Three / Vex's Season 2 dialog whenever they appear.
- `apps/client/src/components/MemorialWall.tsx` + `apps/shared/apprenticePermadeath.ts` + `apps/shared/darrenMemorial.ts` — existing permadeath/memorial infrastructure. Section E adds a sub-surface for Locke and the resurrected name; reuse component patterns rather than building new memorial UI.
- `apps/shared/tradeEmpire/convergenceClimax.ts` — pattern for resolution + cascade + NPC reactions. The Nexus Trial is a multi-resolution variant of this same shape.
- `docs/production/act1/authority-trial-phase-mechanic.md` — Trial-phase rules extracted into a reusable TrialPhase engine under `apps/shared/tcg-core/engine/trialPhase.ts`.
- `apps/shared/tcg-core/cards/definitions/neutral/burnt_card_placeholder.ts` — pattern for the burnt-card variant applied to retired companion + deceased NPC cards.
- `apps/shared/tcg-core/rewards/expansionUnlockService.ts` — extend with a `nexus_trial_seat` unlock condition for Preparation Mission rewards.
- `apps/server/routers/witnessing.ts` — extend to compute per-player vote weight from match history.
- `apps/server/routers/guild.ts` rippleEngine — broadcast Trial phase transitions to all connected clients (already supports this surface).
- `apps/server/routers/dailyBrief.ts` — surface Antiquarian narration, Three Clocks panel, sacrifice-vote tally, and Vortex-reclamation index.
- `apps/client/src/data/companionData.ts` + `companionComments.ts` + `companionAskTopics.ts` — gate lookups on `companions_retired` registry.
- `apps/shared/lockeVoManifest.json` — archived alongside a memorial manifest after Verdict. The winning ballot name's VO manifest (one of Wraith Calder, Wolf/Lycos, Akai Shi, Vex Solène) is archived in the same pass, selected at Verdict-close time.
- `apps/shared/npcs/bibles/vex_solene.md` (and parallel bibles for Wraith, Wolf, Akai) — Section E final-death lines authored *per ballot name* in advance, since the winner is selected live.
- `apps/shared/tcg-core/engine/version.ts` — schedule `RULES_VERSION` bumps to `2.0.0-fracture` (October) and `3.0.0` (post-Nexus).

### Pattern repeated across many files
- **Trial-format finales for Acts 2–7**: one finale per act under `apps/shared/tcg-core/decks/<actN>TrialBossDeck.ts`, mirroring `seerVisitBossDeck.ts` and `authorityTrialBossDeck.ts`. Per-act dialog tables in `apps/shared/act<N>OpponentDialog.ts` already exist as P0 TODOs in the narrative audit — this work absorbs them.
- **Companion card variants**: per-relationship-tier card definitions under `apps/shared/tcg-core/cards/definitions/companions/<companion>_<tier>.ts`. Two companions × 4 tiers = 8 new card files plus barrel-registration.

---

## Verification Plan

End-to-end testing requires both unit-level mechanics and a full live-event dry-run.

### Mechanical
- `pnpm check` and `pnpm test` pass with the new modules.
- `pnpm ship:check` shows PASS for new declared types (Nexus Trial phases, retired-companion registry, deceased-NPC registry). Parity tests added to `apps/shared/_completeness/registry.ts` per the project's "shipped means runtime honors contract" rule.
- `apps/shared/tcg-core/cards/schema.ts` extended with `retired: boolean` flag; loader rejects orphan references.
- Trial-phase engine has unit tests covering phase transitions, vote-weight calculation, and burnt-card replacement on retirement.

### Live-event dry-run (staging)
- Compress the 72-hour window to 72 minutes on a staging server.
- Simulate 1000 synthetic players across the playerbase with varied Witnessing weights.
- Verify: phase transitions fire, sacrifice-vote tally is accurate, the losing companion's lookups return memorial entries, Locke's VO is archived, burnt-card variants appear in collections, Season 2 branch selector resolves correctly.
- Roll back the staging DB and re-run with the inverse companion outcome.

### Narrative
- `pnpm lore:generate` regenerates `LORE_BIBLE.md` from `loredex-data.json` with the post-Verdict state. Drift test passes.
- Manual read-through of the post-Verdict Daily Brief, the Antiquarian's narration feed, and the two companions' memorial Loredex pages — both variants — for tone and consistency.

### Live monitoring during the real event
- Daily Brief feed visible to producers in real time.
- Time Fracture Index gauge on the operator dashboard.
- Manual abort path (resolve to a pre-authored default) in case of infrastructure failure during the 72-hour window.

---

## Test Plan Addendum — Coverage for the New Infrastructure

The Verification Plan above covers the baseline (typecheck, unit tests, ship-check, live-event dry-run). The new infrastructure added across this plan needs explicit test coverage *in addition* to that baseline.

### Three Clocks Panel (16 declared states)

| What | How | Pass criterion |
|---|---|---|
| All 16 states render | Snapshot test per state in `ThreeClocksPanel.parity.test.tsx`. Loop through the cartesian product `{vortex_phases × necromancer_phases × politician_states}` truncated to declared 16 reachable states. | Each renders without console error; visual diff against fixtures stays within tolerance. |
| Phase-transition animations respect `prefers-reduced-motion` | Playwright test toggles the media query and asserts the drum motif becomes a single muted thud. | Reduced-motion variant fires; no parallax/flicker. |
| Mobile collapse behavior | Playwright at viewport 375×667. Verify vertical stack; long-press to expand. | Touch interactions land; long-press triggers expand at 500ms. |
| A11y: meter roles + live announcements | Vitest + `@testing-library/jest-dom`. Assert `role="meter"`, `aria-valuenow`, `aria-live="polite"` on transitions. | All three clocks expose required ARIA attrs; transition announcements queue. |
| Ship-check parity entry | `pnpm ship:check three_clocks_panel_states`. | PASS. No silent fallback degradation. |

### Preparation Mission framework (5 missions × pass/fail × edge cases)

| What | How | Pass criterion |
|---|---|---|
| Each mission's pass condition triggers correct buff | Integration test per mission: simulate the pass path, verify the buff persists to `player_preparation` table. | All 5 missions write the documented `witness_hand_size / filed_buff / faction_multipliers / etc.` columns. |
| Each mission's fail condition triggers correct penalty | Integration test per mission, fail path. | Penalty persists to `player_preparation`. |
| Mission ordering is enforced | Try to start Week 3 (Elara's Loyalty) without completing Week 2 (Forge the Verdict Stream). | Mission start refused with `mission_prerequisite_unmet` error. |
| Week 4 (The Human) server-side deck generation | Property test: given a player's Witnessing record, the generated deck has ≥10 confession-category cards. | Generated deck satisfies invariants for 1,000 randomized records. |
| Week 5 (Bidding War) guard-rails | Test pledging Locke's card and each ballot candidate's card. | Refused with `cannot_pledge_ballot_candidate` error. |
| Skip path (no prep done) | Player who never opens November logs in at Trial open. | Seats at baseline 1.0× weight, empty Witness Hand, no buffs. |
| Pledged cards return Day 7 of Season 2 | Integration test against Season 2 patch service Wave 2. | All pledged cards back in collection with `"—pledged at the Council"` annotation. |

### Nexus Trial server architecture

| What | How | Pass criterion |
|---|---|---|
| Idempotent testimony ingestion | Submit the same `(matchId, turnIndex, cardIndex)` triple 5× in parallel. | Exactly one row in `testimony`. Responses 2–5 return `deduplicated: true`. |
| Phase transition is transactional | Inject a DB error mid-transition. | Transaction rolls back. State remains in old phase. No partial snapshot. |
| Phase-transition timing precision | Run staging trial. Assert `phaseEndsAt - phaseStartedAt = 12h` ±1s across all six phases. | All six within tolerance. |
| Companion sacrifice tally correctness | Synthetic testimony with known weighted distribution. | `resolveCompanionSacrifice` returns the lower-weighted companion. |
| Ballot tally with `recovered_burnt_card_multiplier` | Synthetic testimony where one ballot candidate has 60% of recoveries and 35% of raw votes. | Recovered candidate wins after multiplier. |
| Tie-break by closing-hour velocity | Synthetic tally within 1% delta; one candidate's vote-rate climbing in final hour. | Climbing candidate wins. |
| Replay-pin at version-bump boundary | Start a match at hour 59:30 (RULES_VERSION 2.0.0-fracture). Bump version at hour 60:00. | Match resolves at `2.0.0-fracture`. New matches at 60:01 resolve at `3.0.0`. |
| Rate limit on `submitTestimony` | 70 requests/min from one IP. | First 60 succeed; 61–70 get 429 with backoff hint. |
| Abort path | Operator fires abort at hour 37. | Default cinematic preloads. World-state delta composed from default. All clients see "ledger closed early" notice within 5 min. |
| Ship-check parity for all 6 phase transition handlers + 7 cinematic selector branches + rate-limit coverage | `pnpm ship:check nexus_trial_*`. | PASS on all three. |

### Pre-authored cinematics (7 variants)

| What | How | Pass criterion |
|---|---|---|
| All 7 cinematics playback-test at 3 resolutions | Manual + automated screenshot capture at mobile/tablet/desktop. | All 7 land without audio sync drift or rendering glitch. |
| Romance-tag client-locality | Synthetic player with romance ≥75 + synthetic player with romance <75 both at Confession close. | Romanced player's client receives romance-tag cinematic; non-romanced player does not. Romance tag does NOT broadcast to other clients. |
| Cinematic selector branches all 7 paths | Unit test cinematic selector with each of the 7 possible Verdict inputs. | Returns the documented variant for each. |
| Card-burn fires synchronously with cinematic close-up | Playwright at the burn frame. | The frame at cinematic timecode 0:12 contains the burnt-card variant in the player's collection view. |
| VO sync at end-of-cinematic | Manual A/V review. | No more than 100ms drift between final spoken word and final visual frame. |

### Season 2 patch composition

| What | How | Pass criterion |
|---|---|---|
| All 24 variants present in build | Filesystem assertion: `apps/shared/seasons/season2/{companion_sacrifice,second_death,politician_fork}/*` has the expected 2+4+3 directories with required files. | 9 variant directories complete. |
| Composer selects exactly one variant per category | Property test: 24 randomized deltas, assert patch service activates exactly one in each category. | 24/24 pass. |
| Day 1 / Day 7 / Day 30 wave ordering | Integration test: fire Wave 1, assert Wave 2 cannot fire until stability check passes. | Stability gate enforced. |
| `the_humans_chip` unlock is romance-gated | Synthetic player with relationship 74 vs 75. Sacrifice The Human. | Player at 75 unlocks chip; player at 74 does not. |
| Lore drift test post-Verdict | Day 30 regeneration runs `pnpm lore:generate`; drift test compares `LORE_BIBLE.md` against `loredex-data.json`. | Drift test PASS. Locke and ballot winner are past-tense throughout. |
| Cancelled-content receipt commit | After Verdict, `cancelled_authoring.md` is committed alongside `world_state_delta.json`. | File exists; references match the variant that fired. |
| 23 unfired variants removed Day 30 | Filesystem assertion post-Day-30 patch. | Only the activated variant remains; others deleted. |

### Live-event load test (extends existing dry-run)

| What | How | Pass criterion |
|---|---|---|
| 20× peak concurrent (load test) | Staging environment. Synthetic 20× concurrent users. 72m compressed window. | p99 tally lag ≤30s. Zero dropped testimony submissions. WebSocket fan-out latency ≤2s. |
| Sentry + OTel coverage during Trial | Run staging trial with observability armed. | All 6 OTel spans emit. Alerts fire on the 6 monitored conditions when injected. |
| Abort path under load | Fire abort at staging peak load. | Default resolution propagates to all clients in ≤5 min. No data corruption. |
| Operator dashboard reachability | Operator performs abort with eyes closed (literally — accessibility test) starting from any view. | ≤3 clicks. Confirmation modal accessible via keyboard. |

### Romance and companion state

| What | How | Pass criterion |
|---|---|---|
| Romance freezes at Confession | Synthetic player updates relationship score after Confession close. | Update rejected. Score locked. |
| Card-tier marker persists post-burn | Player's collection history retains gold-tier marker for sacrificed companion even after card is burnt. | `collection_history` shows `tier: gold` for the deceased card. |
| Surviving companion's dialog references dead companion | Read companion dialog from Day 1 patch. | Lines reference the dead companion by name with correct past-tense framing. |

### Cross-arc ripple application

| What | How | Pass criterion |
|---|---|---|
| All ripples in cinematic spec apply post-Verdict | Integration test against `world_state_delta.json` → `cross_arc_ripples` array. | Each declared ripple is reflected in the relevant Season 2 surface. |
| Ship-check parity entry for ripples | `pnpm ship:check season2_cross_arc_ripples`. | PASS. ~40 declared ripples all implemented. |

### Pre-Trial readiness gates

These are not "tests" in the conventional sense — they are **CI gates** that must be green before the build can ship to the live Trial environment:

1. `pnpm check` — full typecheck across the repo.
2. `pnpm test` — full vitest suite.
3. `pnpm test:e2e` — full Playwright suite.
4. `pnpm ship:check` — all entries PASS, no FAIL, no RATCHET regression.
5. `pnpm lint` + `pnpm lint:void-energy` — Three Clocks panel is in `.void-energy-adopted`.
6. `pnpm db:smoke` — schema sanity against staging.
7. Load test signed off by On-call Engineer + Event Director.
8. Cinematic A/V review signed off by Narrative Lead.

If any of the above fail at T-7, the Trial date slips (Risk Register: Production risks). No exceptions.

---

## Implementation Phasing — 8-Month Sprint Plan

Working backwards from a **March 2027** Trial: the build needs to be in shipping shape by **T-7 days** (late February 2027). Counting back at 2-week sprints, that's roughly **16 sprints**, or 8 months. **Sprint 1 kicks off late May / early June 2026.** Below is the recommended ramp-up. Each sprint names a *primary deliverable*, a *secondary deliverable* (parallel work), and *exit criteria* before moving on.

This phasing assumes the Dependency Audit lands with all cited modules at `SHIPPED` status. **If the audit finds gaps**, Sprints 1–4 absorb the missing scaffolding and the back end of the schedule compresses — or the Trial date slips. The audit's Bottom Line will name which.

### Pre-flight (T-240 / T-225 days)

**Sprint 1 — Foundation: absorb audit gaps + extensions** *(expanded scope per Dependency Audit)*
- *Primary — blockers from audit*:
  - **`global_alignment_meter` runtime**: schema column (`alignment_aggregate` on `world_state` table), server-side aggregator (sums per-player Witnessing deltas), tRPC reader (`witnessing.aggregate`). Closes registry line 466.
  - **Witnessing router consolidation**: confirm the delegation pattern — `apps/server/routers/witnessing.ts` becomes a thin coordinator over `twoWitnessesDecode.ts` + `epochWitness.ts`. Section E vote-weight calculation reads through it.
  - **`resurrectionProtocols.ts` permadead flag**: `permadead: true` on the type, no-op until Verdict. Locke + ballot winner flip to it at hour 72.
  - **`seasonTickService.ts` hook for 1-min override cadence**: minimal extension exposing `setOverrideCadence(ms)` for the Trial window.
- *Secondary*:
  - Stand up `apps/shared/_completeness/registry.ts` entries for Section E (3 nexus_trial_* + 3 season2_* + 1 three_clocks_panel_states). All should be FAIL initially — ratchet ceiling captures the gap.
  - File the `lycos.md` bible task (Sprint 11 dependency, but flag early so authoring has lead time).
  - File the `verdict_delta` authoring task (Sprint 8 dependency, but begin pool review now).
- *Exit*: Audit blockers closed. global_alignment_meter writes + reads in staging. Witnessing delegate router responding. Ship-check entries scaffolded. Lycos bible and verdict_delta tasks filed with Sprint owners.

**Sprint 2 — Three Clocks data layer**
- *Primary*: `apps/shared/threeClocks/state.ts` composing state from `necromancerCycle.ts`, `dischordiaCycle.ts`, `nemesisSystem.ts`. New `apps/server/routers/threeClocks.ts` with `subscribe` + fallback poll.
- *Secondary*: Wire telemetry events (`three_clocks.viewed`, `three_clocks.phase_changed`).
- *Exit*: Tests for state composition pass. Subscription publishes phase transitions in <100ms.

### Player-visible content ramp (T-210 / T-150 days)

**Sprint 3 — Three Clocks Panel UI (Daily Brief + Home)**
- *Primary*: `ThreeClocksPanel.tsx` + subcomponents `VortexClock`, `NecromancerClock`, `PoliticianClock`. Glass material, Void Energy tokens, framer-motion transitions.
- *Secondary*: Add path to `.void-energy-adopted`. Run `pnpm migrate:void-energy`.
- *Exit*: 16-state parity test PASS. A11y audit clean. Mobile responsive.

**Sprint 4 — Three Clocks Panel polish + pre-match warning**
- *Primary*: Pre-match warning line (`apps/client/src/components/PreMatchScreen.tsx`). Phase transition animations + the Fracture composite-meter convergence cinematic.
- *Secondary*: Daily Brief integration. Three Clocks section above Antiquarian narration feed.
- *Exit*: Fracture cinematic playback-tested. Convergence trigger fires reliably in staging.

**Sprint 5 — Preparation Mission framework + unlock-condition cleanup** *(expanded per audit)*
- *Primary*: `apps/shared/preparationMissions/` framework (mission registry, pass/fail evaluators, `player_preparation` schema + tRPC endpoints). Mission ordering enforced.
- *Secondary — audit absorption*:
  - **`unlockCondition` UI surfaces for `founding_author` + `authors_edition`**: lock-reason copy + tooltip surface so players don't hit black boxes. Closes registry line 196.
  - **`secret_act_N_revealed` writers**: complete the narrative-flag bridge. Writers must fire on the secret-act completion path. Closes registry line 219.
  - **`expansionUnlockService.ts` full-wire**: confirm both halves of the bridge are now consumed by the 124 S2 cards correctly.
  - Telemetry per mission start/complete.
- *Exit*: Framework supports a fixture mission end-to-end. Schema migrated. `unlockCondition` ship-check rows move to PASS or improved ratchet ceiling. Narrative-flag bridge complete.

**Sprint 6 — Missions 1 (Salvage) + 2 (Reverse Trial) + burnt-card roster** *(expanded per audit)*
- *Primary*:
  - **`burnt_card_placeholder.ts` roster expansion** from stub to ~20 placeholders (one per recoverable companion/key NPC). Reuses existing burnt-card type marker; adds the data.
  - Salvage mission — draft → micro-match flow on top of the expanded roster.
  - Reverse Trial — 6-phase Authority Trial inversion.
- *Secondary*: Mission UI components, narrative beats authored.
- *Exit*: Both missions playable end-to-end. Pass/fail buffs write to `player_preparation`. Burnt-card roster populated with 20 entries.

**Sprint 7 — Missions 3 (Tribunal) + 4 (The Question)**
- *Primary*: Tribunal mission for Elara's loyalty arc. The Question mission with server-side deck generation from Witnessing record.
- *Secondary*: Mission 4 deck-generation property test.
- *Exit*: Both missions playable. The Question generates valid decks for 1,000 randomized records.

**Sprint 8 — Mission 5 (Bidding War) + Trial-format Act finales + verdict_delta authoring** *(expanded per audit)*
- *Primary*: Bidding War mission. Trial-format finales for Acts 2–6 (`actNTrialBossDeck.ts` files).
- *Secondary — audit absorption*:
  - **`trialPhase.ts` per-card `verdict_delta` authoring**: replace placeholder `+1 per play` with authored deltas per card across the meta-relevant pool. The Act 2–6 Trial finale work is the natural moment to do this — finale-deck cards are getting authored anyway. Extend to companion cards + ballot-candidate cards since both are used in the Nexus Trial.
  - Verify guard-rails (Locke + ballot candidates cannot be pledged in Mission 5).
- *Exit*: All 5 missions complete. Act 2–6 Trial finales added. Authority Trial mechanic is now deck-craft-sensitive in staging. Mission 5 guard-rails refuse correctly.

### Engineering substrate (T-150 / T-90 days)

**Sprint 9 — Nexus Trial tick service**
- *Primary*: `apps/server/services/nexusTrialTickService.ts` with phase transition handlers. `trials`, `trial_phases`, `trial_tallies` schemas.
- *Secondary*: Three ship-check entries (phases, cinematic selectors, rate limits).
- *Exit*: Staging trial runs end-to-end at compressed 12-min/phase cadence. All six phase transitions land transactionally.

**Sprint 10 — Testimony ingestion + vote aggregation**
- *Primary*: `nexusTrialRouter` with `submitTestimony` (idempotent, rate-limited). Vote-aggregation queries. Companion + ballot resolvers.
- *Secondary*: Aggregation tick (1-min cadence). Real-time leaderboard subscription.
- *Exit*: Tests for idempotency, rate-limit, tie-break, ballot multipliers all PASS. Leaderboard publishes within 30s p99.

**Sprint 11 — Cinematics: Locke + Ballot (5 of 7) + Lycos bible** *(expanded per audit)*
- *Primary*: Cinematic authoring — Locke + Wraith + Wolf + Akai + Vex. VO sessions booked (this needs T-60-days lead time, so the booking is in Sprint 11 even if the recording lands later).
- *Secondary — audit absorption*:
  - **`lycos.md` bible**: author the missing narrative identity document. Wolf cinematic VO direction depends on it; VO booking should not happen before the bible lands.
  - Card-burn pipeline integration. Memorial burnt-card art commissions (~4 commissions).
- *Exit*: 5 cinematics scripted and storyboarded. VO bookings confirmed (Wolf only after lycos.md lands). Art commissions started. Lycos bible reviewed by Narrative Lead.

**Sprint 12 — Cinematics: Confession variants + Abort cinematic**
- *Primary*: Confession variants (Elara dies / Human dies). Abort cinematic ("the Antiquarian closed the ledger early").
- *Secondary*: Romance-tag client-locality wiring. Romance-state freeze logic.
- *Exit*: All 7 cinematics scripted. Romance-tag client-locality test PASS.

### Season 2 substrate + final polish (T-90 / T-7 days)

**Sprint 13 — Season 2 variant content (Wave 1 + 2 patches)**
- *Primary*: 24 variant directories. Wave 1 + Wave 2 patch service. Day 1 Daily Brief composer.
- *Secondary*: `cancelled_authoring.md` template + commit hook.
- *Exit*: All 24 variants present. `season2_world_state_variants` ship-check PASS.

**Sprint 14 — Cross-arc ripples + Day 30 patch**
- *Primary*: Cross-arc ripple patches (~40 ripples). Day 30 cleanup + lore drift test runner.
- *Secondary*: `pnpm lore:generate` updated to compose post-Trial entries.
- *Exit*: `season2_cross_arc_ripples` ship-check PASS. Drift test runner verified.

**Sprint 15 — Load test + dry run (T-14 days)**
- *Primary*: Compressed 72m staging trial at 10× synthetic traffic. 20× capacity load test. Operator dashboard walkthrough.
- *Secondary*: Operator runbook reviewed by crew. Crew rotation locked.
- *Exit*: Load test signed off by Event Director + On-call Engineer. All ship-check entries PASS.

**Sprint 16 — Final ship-check + crew training (T-7 days)**
- *Primary*: Pre-Trial readiness gates all green. Cinematic A/V review signed off by Narrative Lead. Crew walks through runbook end-to-end.
- *Secondary*: T-7 trailer drop. Daily Brief pre-Trial copy locked.
- *Exit*: Build frozen. Crew on standby. Trial date locked.

### What happens during the Trial (T-0)

The 72-hour live event itself is *not* a sprint — it is the **runway**. No new development during the window except hot-fix patches for live incidents (handled by the on-call engineer per the runbook). The next sprint after T-0 is the post-Verdict Season 2 patch wave 1 deployment, which begins at hour 72 + 5 min.

### Critical-path dependencies

A dependency on a prior sprint blocks the dependent sprint. The critical-path chain is:

```
Sprint 1 (foundation) → Sprint 2 (Three Clocks data)
  → Sprint 3 (Three Clocks UI) → Sprint 4 (Fracture)
  → Sprint 5 (Mission framework) → Sprints 6,7,8 (Missions)
  → Sprint 9 (Tick service) → Sprint 10 (Testimony)
  → Sprints 11,12 (Cinematics) [PARALLEL with VO bookings]
  → Sprint 13 (Season 2 variants) → Sprint 14 (Ripples)
  → Sprint 15 (Load test) → Sprint 16 (Final gates)
```

Cinematics (Sprints 11–12) can run in parallel with Tick + Testimony (Sprints 9–10) if VO sessions are booked early enough. The art-commission pipeline (Memorial burnt cards) needs T-60-day lead time, so commissions start in Sprint 11 even if the integration lands in Sprint 13.

### Buffer and slip

The schedule has **no buffer** as drawn. Industry-standard buffer for an 8-month plan is 15–20% — so a **6-week buffer should be added**, either as additional sprints at the back (slipping the Trial date by 6 weeks) or as relief across the schedule (each sprint gets 2–3 extra days). The Operator Runbook's "Trial dates flexible by ±2 weeks" provision absorbs some of this; the remaining ~4 weeks should be explicit budget.

### Compression paths if audit reveals gaps

If the Dependency Audit returns gaps that cannot be absorbed in Sprint 1, the following are the compression options in priority order (most preservation of plan integrity first):

1. **Slip the Trial date** by 1 sprint per major gap. Preserves all plan elements.
2. **Cut Trial-format Act finales for Acts 2–6** (Sprint 8 secondary). The Dischordia-as-spine work is the most cuttable narrative ambition.
3. **Cut the Three Clocks pre-match warning surface** (Sprint 4 primary). Lower-visibility surface.
4. **Cut one or two Ballot cinematics** and remove those names from the ballot. The Three Potentials + Vex was already the trimmed set; cutting further reduces narrative branching.
5. **Cut the Politician fork's `constrained_return` variant** — collapse to seal-or-full. Reduces Season 2 variants from 24 to 16.

Cuts (3)–(5) should be considered failures of planning, not graceful degradations. Cut (1) is the recommended response to audit gaps.

---

## Locked Decisions

The following decisions are now fixed by your direction and reflected throughout the plan:

1. **The deaths**: Two deaths total. Locke (Adjudicator, she/her) is fixed canon — the Necromancer's price for banishment. The second death is community-voted during November's Preparation phase from a four-name ballot of the resurrected: **Wraith Calder, The Wolf (Lycos), Akai Shi (Red Death), Vex Solène**. The Three Potentials are the focus; Vex is the fourth.
2. **The two community votes**:
   - **Companion sacrifice** (Confession phase, Trial hours 48–60): Elara vs The Human. Single global outcome.
   - **Resurrected death** (Preparation phase, November, closes at Trial hour 60): one of the four ballot names.
3. **The overall arc**: the Three Escalating Clocks (Vortex / Necromancer Cycle / Politician's Ascension Ladder) converge across the year and reach terminal state simultaneously in November, making the Nexus Trial the only resolution path. The Politician's return is gated by Trial *participation*, not by vote — engagement chooses Season 2's antagonist shape.
4. **Cadence**: once-ever. The Nexus Trial does not repeat. Subsequent year-end events are smaller post-Nexus Trials that build on whichever Season 2 variant the community authored.
5. **Death scaling**: fixed at two. Verdict outcome does not multiply the death count.
