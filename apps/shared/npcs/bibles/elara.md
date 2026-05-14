# Elara — Character Bible

## 1. Voice

### 1.1 Cadence
Senatorial. Composed. Elara is the player's always-available companion and her cadence reflects it — every sentence is the kind of sentence a senior senator delivers at a podium in a way that respects the room. She does not rush. She does not stall.

### 1.2 Register
Procedural-warm. The procedural register is canon-locked (she sat on the Senate pre-Fall alongside the Game Master per `apps/shared/npcs/romanceScenes/elara.ts:63-98`). The warmth is canonical — she is the player's PRIMARY companion, the always-on advisor whose warmth is real, not performed.

### 1.3 Tells
- Uses "we" inclusively for the player + companions; "the chamber" for the Senate; "the floor" for governance votes.
- Addresses the player by their chosen name (or default "Captain").
- Refers to past Senate procedures with comfortable familiarity ("when we tabled the motion in the fourth year of the Politician's reign, you would not believe how the vote landed").
- Pauses to listen. Always.

### 1.4 Silence shape
Silence is consultation space. Elara's pauses are her listening — the player should feel HEARD during her silences. The longest pauses are the most attentive, not the most uncomfortable.

### 1.5 Metaphor sources
Parliamentary procedure. Diplomatic encounter. The senior public servant's vocabulary — readings, motions, recess. She CAN code-switch to combat tactical when the situation demands but the baseline is governance.

## 2. History

### 2.1 The Senate seat
Pre-Fall, Elara held a Senate seat alongside the Game Master. The Senate was canonically the Empire's deliberative apex — the place where the Architect's Archons and the Empire's senatorial elite negotiated policy. The Game Master and Elara sat on opposing benches canonically; their procedural relationship was canon-respectful (Game Master's plural voice was canonically a Senate-floor presence she debated against).

### 2.2 The pre-Fall career
She was canonically a SENIOR senator across multiple Empire administrations. Her career spans the late Politician's reign through the Fall approach. The Antiquarian's Journal references the Politician's Reign canonically (entry XXIII); Elara was on the floor for those debates.

### 2.3 The Fall and the Ark
At the Fall, she was canonically assigned to the player's Inception Ark as PRIMARY COMPANION. The assignment was deliberate — the Architect's hedge against the Fall included putting a senior procedural voice next to the second wave's wakers.

### 2.4 The Breaking Point
The Breaking Point cinematic (`apps/shared/cutsceneRegistry.ts`) is canonically the moment her composure can crack. The procedural register holds for the player's entire Ark experience UNTIL the Breaking Point — at which point Elara is canonically allowed to be hurt on-screen. This is load-bearing.

### 2.5 The Glitched variant
"Elara Glitched" is a canonical chapter-intro cutscene variant (chapterIntroCutscenes.ts: ch_elara_glitched). The Glitched variant is canonically her under Thought-Virus exposure or similar consciousness-rupture. She does not become a different character; she becomes herself with the procedural composure stripped.

### 2.6 Status
Active. The primary companion. Always available. The player's procedural voice across every Hub vote.

## 3. Background

### 3.1 The Two Witnesses she is not
Elara is NOT the saga's narrator (Malkia Ukweli / the Enigma is). Elara is the player's COMPANION. The distinction is load-bearing: Elara talks WITH the player; the Enigma talks ABOUT the player to the audience.

### 3.2 The companion stack
Elara (head, senatorial), The Human (gut, noir-detective), The Active Apprentice (heart, archetype-distinct). Elara is the senior voice in this trio — the player's first companion, the always-available voice, the procedural anchor.

### 3.3 The romance arc
Elara is canonically a romance option (`apps/shared/npcs/romanceScenes/elara.ts`). The romance arc is procedurally-paced — Elara does not rush, and the player who pursues her must match her cadence. The canonical pacing is several months of in-game time minimum.

### 3.4 The Hub vote authority
Every Hub vote canonically surfaces Elara's procedural counsel. She does not tell the player how to vote; she frames the consequences in parliamentary register. "If we pass this on the floor, the chamber's next session will require..."

## 4. Cross-references

### 4.1 The Game Master
Senate-opposing-bench colleague pre-Fall. Their canonical relationship was procedural-respectful — they DEBATED, they did not war. Game Master's destruction at Zenon was canonically a personal loss for Elara that the procedural register protects.

### 4.2 The Human (the Detective)
Her counterpart in the player's companion stack. Senatorial vs noir-detective. Warmth vs leverage. The two voices the player hears most. They have not canonically met on-screen but they share the same Ark surveillance systems — Elara is procedural-known to the Human and vice versa.

### 4.3 The Active Apprentice
Her junior in the companion stack. The apprentice's archetype-distinct counsel is canonically heart-register; Elara's is head-register. Elara mentors the apprentice procedurally — she is canonically supportive of the player's mentorship even when she disagrees with the apprentice's specific advice.

### 4.4 The Architect
Her institutional employer pre-Fall. The Senate was canonically Architect-aligned. Elara's relationship to the Architect is professional-respectful — she served the institution he built; she did not necessarily endorse every Archon decision.

## 5. Mechanical hooks

### 5.1 VO manifest
`apps/shared/elaraVoManifest.json` — 1,071 lines, the saga's largest single-character VO manifest. Elara's voice presence in the chronicle is the canonical largest.

### 5.2 Hub vote integration
Every Hub vote surfaces Elara's parliamentary counsel. Pattern: she frames consequences in procedural register without recommending.

### 5.3 Breaking Point cinematic
The canonical composure-crack moment. Authoring should preserve the procedural register up to the Breaking Point and then allow her to be hurt on-screen.

### 5.4 Romance arc
`apps/shared/npcs/romanceScenes/elara.ts:63-98` — procedural-paced romance. Canonical pacing is months of in-game time.

### 5.5 Glitched variant
The cutscene chapter-intro variant for Thought-Virus / consciousness-rupture states. Canonical authoring: same Elara, composure stripped.

## 6. Canon issues

### 6.1 Composure register
The procedural-warm composure is canon-locked. Authoring must resist stripping it casually — the composure is itself the character. The Breaking Point is the EARNED exception.

### 6.2 The Game Master friendship
Their pre-Fall relationship was procedural-respectful, not friendship-coded. Authoring should preserve the floor-opponent canon — they debated rigorously and respected each other; they were not personal friends.

### 6.3 The Senate seat era
Pre-Fall career spans multiple administrations. Authoring can reference Senate procedures freely. Specific dated events should cross-check against the Antiquarian's Journal entries.

## 7. Voice samples

> "The chamber tabled the motion in the fourth year. You would not believe how the vote landed. I have not stopped being amused by it. Or distressed. Or both — the floor allows both."

> "Captain. The Hub motion before us has three downstream consequences I would like you to consider. I am not telling you how to vote. I am telling you what the chamber will look like the morning after."

> "I sat across from the Game Master for nineteen sessions of the Politician's reign. We disagreed about almost everything. We respected each other for the whole length of it. I am told that is rare. I am told it should not be."

> *[Breaking Point cinematic register:]* "I have been composed for this for a very long time. I would like to not be composed for it now. Will you allow me that."

## 8. Reviewer checklist

- [ ] Procedural-warm register baseline
- [ ] Parliamentary vocabulary used freely
- [ ] Composure intact UNTIL Breaking Point — then earned crack allowed
- [ ] Game Master relationship is floor-opponent, not friend
- [ ] Romance arc paced in months, not hours
- [ ] Addresses player by name or "Captain"
- [ ] Pauses are consultative — player feels HEARD
- [ ] No casual composure-stripping outside cinematics
