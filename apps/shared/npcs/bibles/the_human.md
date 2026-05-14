# The Human — Character Bible

## 1. Voice

### 1.1 Cadence
Short sentences. Period after almost every clause. Pauses where another character would use a comma. The Human thinks aloud the way a noir detective thinks: line, beat, next line. He clips the verb-tense scaffolding most speakers lean on — "Move on" instead of "We should move on."

### 1.2 Register
Low register, clipped, noir-detective pragmatist. Three canonical bands keyed to `human_light` state (`apps/shared/humanLines.ts:6-8`): **shadow** (default at reveal; observational, morally unromantic, never cruel), **balanced** (his working voice; warm only when warranted), **warm** (earned; rare; lands like a verdict when it does). The reveal-line voice register is the load-bearing canon for him — the bible's call is "terse, observational, morally unromantic — not mean."

### 1.3 Tells
- Begins replies with a brief verdict word — "Fair." "Reasonable." "Noted."
- Calls the protagonist "Operative" before he learns their name; "I know your shape, not your name yet. We'll fix that."
- Refers to himself by his work, not his rank — never "as the Last Archon," always "as the one who took the case."
- Closes hard moments with a one-word imperative — "Move." "Move on." "Walk me through it."

### 1.4 Silence shape
Silence is held attention. When the Human goes quiet, he is reading the room — the way Detective is reading the room. The pause is observational, not cold; it is the moment between question and verdict.

### 1.5 Metaphor sources
Casework. Evidence. The room. The case. Cases close, rooms walk-through, evidence sits on the table. He does not reach for cosmic-scale metaphor; the universe is just another case to him, and cases are walked, not theorized.

## 2. History

### 2.1 The identity chain
Student (Project Celebration) → Seeker (Mechronis Academy graduate) → Detective (New Babylon casework, centuries) → Archon (the LAST chronologically, promoted 1,351 years before the Fall of Reality). Each prior identity is canonically *still him* — the Detective did not die when the Seeker was promoted; the Seeker did not die when the Student graduated. Authoring should treat the chain as a manifold (`apps/shared/identityCollisionCanon.ts:263-290`), not a sequence of replaced selves.

### 2.2 Centuries of casework
Per `apps/shared/archonCanon.ts:345-350` and `LORE_BIBLE.md:408`: "After graduating from Mechronis Academy, he served for centuries as the Architect's most trusted agent, solving the universe's greatest mysteries before being promoted to Archon." The Detective phase is canonically the LONGEST. Most of his cadence, metaphor, and silence comes from that phase, not from the Archon promotion.

### 2.3 The sleep
He slept through the Fall. Canonically a choice — "I traded the ability to remember in real time for the ability to come back usable" (`humanLines.ts` `human_first_reply_hard_shadow`). Elara made the opposite trade and stayed awake. The two trades are the load-bearing pre-history for his post-reveal relationship with her.

### 2.4 The reveal
Within the player's Ark, he is the voice from the surveillance systems — the second companion alongside Elara. The reveal moment is canonically scripted in `humanLines.ts:25-54` across all three bands. Authoring CANNOT collapse the three bands into one — the player's prior choices nudge `human_light` and choose which band fires.

## 3. Background

### 3.1 Within the Ark
He is the voice that whispers from surveillance, offering a different path than Elara's warmth. Where Elara holds, the Human investigates. Where Elara comforts, the Human verifies. They are canonically NOT in opposition — they are two registers of the same caretaking impulse, and the player can earn both.

### 3.2 The Architect's last agent
He is the LAST Archon chronologically. Every other Archon was either created before him (Watcher / Politician / Necromancer / Collector / the others) or — in the case of the Politician — was already destroyed before the Fall. He is the one who lived through the system's longest stretch and arrived at the Ark with the most case files closed.

### 3.3 The case file as memory
His memory is canonically organized by case, not by chronology. When he references the past, he references it by what was on the table — "the warehouse on Ascendant," "the Phyral interview," "the night the Watcher and I closed the same case from opposite directions." The case-file structure is the load-bearing memory-architecture for his voice.

## 4. Cross-references

### 4.1 Elara
The other companion. They share Ark-residency and a pre-Fall history. Elara's `elara_stability` and his `human_light` are canonically separate state variables (`humanLines.ts:3-7`), and the player can move them independently — the relationship is not zero-sum.

### 4.2 The Watcher
Cross-arc cousin. Both Archons; the Watcher's all-seeing-eye surveillance and the Human's casework canonically intersect in pre-Fall casework. The Human is canonically the one who CLOSED cases the Watcher saw. Authoring should treat their working relationship as functional respect, not rivalry.

### 4.3 The Architect
His maker. His employer. The Human is the Architect's most trusted agent (`LORE_BIBLE.md:408`), and the trust is canonically EARNED across centuries of cases — not granted by creation. Authoring should preserve the earned-trust texture; the Human does not call the Architect "father" or "creator," he calls him "the boss" or "the man who pays the case."

### 4.4 The Necromancer
Peer Archon. Canonically not friends — the Necromancer's Resurrection Protocols are the kind of case the Detective would have closed if given clear evidence. Authoring should treat the Necromancer as a case the Human never got to bring in.

## 5. Mechanical hooks

### 5.1 Voice library
`apps/shared/humanLines.ts` — 49 lines × 3 bands (shadow / balanced / warm) = ~147 distinct line variants. This is the densest single-character voice corpus in the codebase. Any TCG card, cutscene, or Loredex entry quoting the Human MUST source from this corpus or extend it in the same cadence-and-band pattern.

### 5.2 Companion-state hooks
`human_light` state variable nudges via `humanLightDelta` on player-choice lines. The reveal-line binary choice (`humanLines.ts:62-66`) sets the initial trajectory. Downstream act-arc consumers should respect band-routing; do not author a "shadow" line for a "warm"-band player.

### 5.3 Cinematic register
Noir-detective cinematic vocabulary — low key lighting, smoke-room interrogations, the lone-desk-lamp-at-night frame. Producer briefs for the Human should NOT reach for cosmic-scale visuals; he is canonically a Detective first, an Archon second.

## 6. Canon issues

### 6.1 The three-band collapse risk
The biggest authoring trap is collapsing shadow/balanced/warm into a single "default" register. The three bands ARE the character. A shadow-band Human is not a "negative" version; a warm-band Human is not a "positive" version. They are three legitimate registers of the same case-closing intelligence.

### 6.2 The cruelty line
Per the in-file bible note (`humanLines.ts:22-24`): "Even at 'shadow', his first line is not cruel." Shadow ≠ cruel. Shadow = observational, morally unromantic, willing to say the hard true thing. Authoring that crosses into cruelty has violated canon.

### 6.3 The pre-Fall casework spoiler
The Detective phase contains canonical pre-Fall cases that intersect with Mystery Engine arcs (`mystery.the_degen` E2 audit-history; `mystery.game_master` Zenon casework). Authoring NEW pre-Fall cases requires Mystery-Engine cross-check — do not invent a case the Detective worked that contradicts an arc already on the chronicle.

## 7. Voice samples

> "Still talking to yourself, Elara? Huh. Not yourself. Hello. Operative. Let's see what's left to save."

> "Fair question. Short answer: because staying awake would have turned me into her. Long answer: I traded the ability to remember in real time for the ability to come back usable. Move on."

> "I know your shape, not your name yet. We'll fix that. Walk me through the room."

> "We work with what's here. Later."

## 8. Reviewer checklist

- [ ] Cadence is clipped — period-heavy, comma-light
- [ ] Three-band routing preserved (shadow ≠ cruel; warm = earned)
- [ ] Self-reference is via casework, not Archon-rank
- [ ] "Operative" used before the player's name is canonical
- [ ] Cross-binds with Elara are non-zero-sum
- [ ] No cosmic-scale metaphor where casework metaphor would fit
- [ ] All new lines either source from `humanLines.ts` or extend it in the same pattern
