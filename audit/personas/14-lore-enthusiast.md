# Lore Enthusiast / RPG Veteran — Audit

## Top 5 findings

### F1: LOREDEX is encyclopedic, not narrative — and the "concepts" bucket is hoarding micro-fiction
- file: /home/user/dischordian-saga/apps/client/src/data/loredex-data.json (109 concepts), /home/user/dischordian-saga/docs/built/LORE_BIBLE.md
- severity: high
- category: redundancy
- finding: The bible is a generated 13.5K-line table-of-fields dump (Type/Era/Date/Affiliation/Status/Priority) — Disco Elysium's Thought Cabinet entries breathe; these read like a wiki. Within 109 concepts, six "Imprint" entries (Iron Lion Imprint, Imprint Resonance, Imprint's Dream Argument, First Ballot, Political Request, Letter to the New Custodian), three Iron Lion concepts (Callsign, Imprint, Operational), four Audit concepts, six Witness concepts, and nine Seer/Engineer concepts atomize one idea into ledger rows. Many are single-arc internal notes (e.g. "Mol'Vereth's Discretion", "Ozhul's Redirected Monetisation", "Brel'Sorrash's First Session") that belong inside their character entries, not as peer concepts to "The Thought Virus".
- fix: Cluster concepts into ~20 thematic groupings (Imprint Mechanics, Witnessing Doctrine, Audit Discipline, Seer Method, Lionism Ethics) with sub-headings. Reserve "concept" type for ideas that recur across 3+ characters. Move per-character motes into character History sections.

### F2: Iron Lion imprint bleed-through is well-seeded mechanically but tonally collapses into "ledger entry" prose
- file: /home/user/dischordian-saga/apps/shared/episodeMysteries.ts, /home/user/dischordian-saga/apps/shared/questlineClassSoldier.ts
- severity: medium
- category: continuity
- finding: The bleed-through is wired into runtime — Jericho's 5-episode mystery arc, the Degen's "fee deferred" ledger anomaly, Soldier-class queue-priority broadcast across 17,000 years all exist in code. But the time-heist register (the thing that should feel like Planescape's Pillar of Skulls or Citizen Sleeper's Cycles) is repeatedly reduced to bookkeeping nouns ("memory imprint received against 7-Omega clearance records (returned)", "Calibration Pipeline Handoff"). The mystery is intact; the awe is being filed under accounts payable.
- fix: Keep the mechanical wiring; rewrite the user-facing transmission lines on the bleed events themselves to lead with sensory dread before the audit metaphor lands. The audit-as-cosmic-ledger conceit works only if it occasionally breaks.

### F3: Early choices DO reach Act 7 — this is the strongest payoff structure in the repo
- file: /home/user/dischordian-saga/apps/shared/act7Epilogues.ts, /home/user/dischordian-saga/apps/shared/act4CompletionGate.ts
- severity: low (positive finding)
- category: payoff
- finding: `act1_path_A` (Disclosure), `act3_partial_share` (Discovery), `act3_full_secret` (Betrayal) propagate as `pathVariant` filters into all four Act 7 stance epilogues plus Silence — that's 4 stances x 3 paths = 12 distinct convergence variants, each with authored beats (e.g. Betrayal->Bridge: "the officers know about THE bridge, the Act 4 one — and they have come to your bridge anyway"). `acts2to7Opponents.ts` gates opponents by these flags. This matches Disco Elysium's late-game callback discipline more than it matches typical save-the-galaxy CRPGs.
- fix: None — preserve. Document in PRODUCTION_BIBLE under "Promises Kept" so future contributors don't flatten this.

### F4: Thematic load-bearing pillars don't weave — Witnessing, Identity Chains, Thought Virus, Light/Dark sit on parallel tracks
- file: /home/user/dischordian-saga/docs/design/NARRATIVE_ARCHITECTURE.md, /home/user/dischordian-saga/docs/design/WITNESSING_NARRATIVE_PROPOSAL.md, /home/user/dischordian-saga/docs/design/PSYCHOLOGICAL_PROFILE_SYSTEM.md
- severity: high
- category: thematic_coherence
- finding: NARRATIVE_ARCHITECTURE declares "the music IS the prophecy; the game is the fulfillment" — a deterministic thesis. But the codebase ships Witnessing (20-vote epoch chronicle, songs as triggers), Identity Chains (6 character substrate IDs), Thought Virus (Kael->Source plague-ship arc), and Light/Dark alignment as four separately-architected systems. Identity Chains in particular are gorgeous on the page (Senator Voss -> Panoptic Elara -> Elara) but their cross-system consequence is not visible — does choosing Light at Act 1 finale interact with Elara's Identity-Chain reveal in Act 4? The bible doesn't say and code search suggests not.
- fix: Either write one explicit "convergence matrix" doc showing how each system reads/writes the others, or pick the two strongest (Identity Chains + Path Flags) and let Witnessing/Light-Dark explicitly surface them rather than running parallel.

### F5: Determinism thesis vs. five Act-7 endings is unresolved at the philosophical layer
- file: /home/user/dischordian-saga/apps/shared/act7Epilogues.ts (act7_silence_stance)
- severity: medium
- category: agency_vs_determinism
- finding: "The music IS the prophecy" insists outcomes are foretold, but Act 7 ships five endings (Humanity/Machine/Balance/Soldier-Command/Silence) x three path-variants. The Silence ending almost lands the paradox ("four prior silences across all recorded cycles. Yours is the fifth.") but the other four read as standard branching agency. Citizen Sleeper solves this via cycles-as-fate; Disco Elysium via "you are the failure the world needed." Dischordian gestures at both without committing.
- fix: One Antiquarian-narrated frame line per ending acknowledging that this ending was already in his book — the player chose which page to turn to, not what was written. Cheap to author; resolves the thesis.

## Comparative read

This stacks closer to Citizen Sleeper's structural ambition than to Disco Elysium's prose ambition: the cross-act flag plumbing, the Identity Chains, the cross-game beat registry, and the ratcheted "ship:check" gate are unusually disciplined for a narrative game. Where it falls short of all three inspirations is voice texture — Planescape and Disco Elysium earn their density by making every paragraph feel handwritten by an obsessive; the LOREDEX's auto-generated field tables and audit-ledger metaphors flatten lore into spreadsheet, even when the underlying ideas (substrate-imprisoned Archon, the 43 unmonitored minutes, Darren Fessler's unedited entry) are genuinely Planescape-tier. The skeleton is more ambitious than its inspirations; the surface prose is not yet.

## Convergence hints
- F1 (concept redundancy) + writer-persona findings on voice consistency: same root cause — auto-generation is winning over authoring.
- F2 (Iron Lion register) + DOC4 LOREDEX audit's per-entry truncations: the bible-generation pipeline is hiding the best prose.
- F3 (path payoff) is a load-bearing positive — TCG-designer and QA personas should treat the path-flag lattice as protected canon.
- F4 (system weave) overlaps with staff-engineer "is this one game or four?" architectural concerns.
- F5 (determinism) is a writing/design crossover — needs the writer persona's ear, not just structural fix.
