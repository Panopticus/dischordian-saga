# ENIGMA — SECTION 6 BRANCH DELTAS

> Animator companion to `enigma-gaze-timeline.csv` and the
> 4-panel blocking-reference PNG. This sheet shows exactly
> what changes per branch. Every beat not listed here is
> identical across all playthroughs.
>
> Scope: `UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md` §9.10.2 and §9.10.3.

---

## Page 1 — Shared Baseline + Accept/Decline

### Shared baseline (l01 through l10 — identical on every run)

These ten beats are the same no matter which branch the
player picks. Animate them once, then re-use across accept,
decline, and all five deflect variants.

| Beat | Enigma action | Gaze # fired |
|---|---|---|
| `scene_open` | Beat J pose, eye-line on pedestal, no reaction to player entry | — |
| `l01` | Gaze #1 fires — eye-line to player, 1.5s, back to floor | **#1** |
| `l02` | Motionless | — |
| `l03` | 300ms weight shift on the word *waiting* | — |
| `l04` | Face softens 500ms. Head does NOT turn. | — |
| `l05` | Smallest possible nod, once, on *his death is the shape* | — |
| `l06` | Eye-line crosses briefly to Antiquarian on *the voice you heard*, then back. Does NOT look at player. | — |
| `l07` | Gaze #2 fires — eye-line to player, held 5.0s through full line | **#2** |
| `l08` | Eye-line still on player (sustained from l07). Posture unchanged. | — |
| `l09` | Eye-line drifts off player to middle distance on the word *end* | — |
| `l10` | Motionless. UI fades in on shared silence. | — |

**After l10: branch divergence begins.**

### ACCEPT branch — delta from shared baseline

Two lines differ (l11a, l13 same as shared but mood shifts,
l14 per-branch). Micro-gesture count: 0 beyond baseline.

| Beat | Delta from baseline | Mood |
|---|---|---|
| `l11a` | Eye-line **returns** to player on the Antiquarian's first syllable. Held 3.0s sustained. No smile. This is a **bridge**, not a separate gaze — does NOT count against the gaze budget. | Acknowledged. |
| `l13` | No change from deflect-catchall baseline (middle distance, holds position). | Settled. |
| `l14` | Gaze #3 fires **on time, default duration**, through fade to black. | Quietly warm. |

**Accept gaze ledger:** #1 + #2 + (l11a sustained bridge — not counted) + #3 = **3 gazes total**. Budget respected.

**Accept posture ledger:** `beat_j_pose` → `weight_shifted`
(from l03 onward). No sag, no recovery — she is resolved.

### DECLINE branch — delta from shared baseline

This is the branch that carries the most physical change. The
posture sag at l11b is the first time her body moves away from
the upright carriage she has held since scene open.

| Beat | Delta from baseline | Mood |
|---|---|---|
| `l11b` | One glance to the Antiquarian, back to the floor. Posture sags very slightly — the tiredness of someone who has waited before. **MICRO-GESTURE: `posture_sag`.** | Not rebuke — recognition. |
| `l13` | Eye-line on the **pedestal** (not middle distance). Posture sag carries through. | Withdrawn. |
| `l14` | Gaze #3 fires **with slow lift from floor upward**, arriving mid-fade. Never fully finishes the gaze before black. Posture still sagged. | Unfinished, on purpose. |

**Decline gaze ledger:** #1 + #2 + #3 (slow-lift variant) = **3 gazes total**. Budget respected.

**Decline posture ledger:** `beat_j_pose` → `weight_shifted`
→ `posture_sagged` (from l11b onward, carries through l13
and l14). The sag does NOT recover.

**Emotional signature.** If the animator takes one thing from
the decline branch, it is this: the final gaze must read as
*starting late and ending early*. She never fully meets the
player's eye; she doesn't get the chance.

---

## Page 2 — Deflect Baseline + Four Variants

### Deflect baseline (l11c + l13 + l14 — shared across all five deflect runs)

Every deflect run plays l11c before branching into the chosen
variant's l12c line, then converges back on l13 and (usually)
l14.

| Beat | Delta from baseline | Mood |
|---|---|---|
| `l11c` | Eye-line stays on middle distance. Patient, neutral. No preference about what the player will ask. | Open. |
| `l13` | Middle distance, holds position. | Settled. |
| `l14` (default) | Gaze #3 fires, default duration, through fade. | Default close. |

### DEFLECT catch-all (`l12c`)

Runtime fires this when the player's deflect question isn't
one of the four scripted variants.

| Beat | Delta from baseline | Mood |
|---|---|---|
| `l12c` | Motionless throughout. Eye-line unchanged from l11c middle distance. | Neutral. |

**Catch-all gaze ledger:** #1 + #2 + #3 = **3 gazes**. Budget respected.

### DEFLECT v1 — "Who was he?"

The one scripted beat in the entire scene where the Enigma
physically reacts to a name. Drives one of the four permitted
micro-gestures.

| Beat | Delta from baseline | Mood |
|---|---|---|
| `l12c_v1` | Eye-line unchanged (middle distance). On the words *the Prince*: **MICRO-GESTURE: `hand_compression`.** Clasped hands compress for ~200ms (finger pressure, not reposition). Face unchanged. Only time in the scene she reacts to a name. | Inward recognition, outward stillness. |

**v1 gaze ledger:** #1 + #2 + #3 = **3 gazes**. Budget respected.

**Animator note.** The hand-compression is easy to
under-render. It must be a visible change — a close-up
would show fingertips whitening slightly. At medium shot it
should register as a single beat of held breath.

### DEFLECT v2 — "How long waiting?"

The motionless variant. She is the answer the Antiquarian is
speaking; her body makes the point by not making one.

| Beat | Delta from baseline | Mood |
|---|---|---|
| `l12c_v2` | Motionless throughout. Eye-line unchanged from l11c. No micro-gesture. | She is the answer. |

**v2 gaze ledger:** #1 + #2 + #3 = **3 gazes**. Budget respected.

### DEFLECT v3 — "What if I say no?" ★ BUDGET CHANGE

**The one variant that fires an extra player-gaze mid-scene.**
Triggers the gaze #3 shortening rule on l14. Animator must
adjust the final gaze duration to compensate.

| Beat | Delta from baseline | Mood |
|---|---|---|
| `l12c_v3` | **EXTRA GAZE fires** — eye-line rises to the player once, ~1.0s, then back. A silent *"we will be here"* without the Antiquarian's words. | Quiet assurance. |
| `l14` | Gaze #3 SHORTENED (~1s shorter than default). Duration reduced to preserve the 3-gaze budget. | Same warmth, less runway. |

**v3 gaze ledger:** #1 + #2 + **extra v3** + #3 (shortened) = **3 gazes + 1 bridge-gaze** ≈ still reads as 3 across the scene, provided l14 is shortened. Budget preserved through compensation, not absence.

**Animator note.** If the v3 gaze is cut for technical
reasons, do NOT compensate by lengthening gaze #3. Drop the
v3 gaze entirely and keep l14 at default duration. Four gazes
breaks the scene; two gazes breaks the scene differently but
less badly.

### DEFLECT v4 — "Why me?"

The scene's second nod. Mirror to l05's acknowledgment, but
carried by the Enigma this time rather than the Antiquarian's
words landing on her.

| Beat | Delta from baseline | Mood |
|---|---|---|
| `l12c_v4` | Eye-line unchanged (middle distance). On the closing clause *it always turns out to be enough*: **MICRO-GESTURE: `tiny_nod_v2`.** Chin lifts a fraction — the smallest possible nod. Second nod of the scene (first was l05). | Confirmation. |

**v4 gaze ledger:** #1 + #2 + #3 = **3 gazes**. Budget respected.

---

## Page 3 — Gaze-Budget Ledger + At-a-Glance Matrix

### Gaze-budget ledger (per-branch totals)

The scene's emotional arithmetic depends on exactly **three
player-gazes** per playthrough. Any deviation from 3 must be
corrected by duration compensation, not additional gazes.

| Branch | Gaze #1 (l01) | Gaze #2 (l07) | Bridge (l11a) | Extra (l12c_v3) | Gaze #3 (l14) | Total |
|---|---|---|---|---|---|---|
| Accept | 1.5s | 5.0s | 3.0s (not counted) | — | default | 3 |
| Decline | 1.5s | 5.0s | — | — | slow-lift | 3 |
| Deflect (catch-all) | 1.5s | 5.0s | — | — | default | 3 |
| Deflect v1 | 1.5s | 5.0s | — | — | default | 3 |
| Deflect v2 | 1.5s | 5.0s | — | — | default | 3 |
| **Deflect v3** ★ | 1.5s | 5.0s | — | **1.0s** | **shortened** | 3 |
| Deflect v4 | 1.5s | 5.0s | — | — | default | 3 |

★ = triggers the gaze-shortening rule per §9.10.2.

### Micro-gesture ledger (per-branch totals)

Four permitted body movements outside eye-line. Different
branches use different subsets. All four sub-second, none
reposition her in space.

| Branch | l03 weight shift | l05 smallest nod | l11b posture sag | l12c_v1 hand compression | l12c_v4 tiny nod v2 | Total |
|---|---|---|---|---|---|---|
| Accept | ✓ | ✓ | — | — | — | 2 |
| Decline | ✓ | ✓ | ✓ | — | — | 3 |
| Deflect (catch-all) | ✓ | ✓ | — | — | — | 2 |
| Deflect v1 | ✓ | ✓ | — | ✓ | — | 3 |
| Deflect v2 | ✓ | ✓ | — | — | — | 2 |
| Deflect v3 | ✓ | ✓ | — | — | — | 2 |
| Deflect v4 | ✓ | ✓ | — | — | ✓ | 3 |

### At-a-glance: what differs across branches

If you only read one table on this sheet, read this one.

| | Accept | Decline | Deflect (catch-all) | v1 | v2 | v3 | v4 |
|---|---|---|---|---|---|---|---|
| **Response beat** | l11a: returns to player (bridge) | l11b: glance to Antiq, back to floor | l11c: middle distance, hold | l11c | l11c | l11c | l11c |
| **Post-response** | — | posture sags | l12c: motionless | l12c_v1: hand compression on "the Prince" | l12c_v2: motionless | l12c_v3: **EXTRA PLAYER-GAZE 1.0s** | l12c_v4: chin lifts on "it always turns out" |
| **l13 eye-line** | middle dist. | **pedestal** | middle dist. | middle dist. | middle dist. | middle dist. | middle dist. |
| **l13 posture** | weight_shifted | **posture_sagged** | weight_shifted | weight_shifted | weight_shifted | weight_shifted | weight_shifted |
| **l14 Gaze #3** | default | **slow-lift from floor** | default | default | default | **shortened** | default |

### Pose-continuity checklist (before any render pass)

Every pose the animator renders must pass this check:

- [ ] Hands clasped at waist position (consistent across l01–l12c_v1)
- [ ] Hand compression at l12c_v1 is visible but does NOT reposition the hands
- [ ] Standing position unchanged across the full scene (she never steps)
- [ ] Costume, hair, jewelry unchanged frame-to-frame
- [ ] Eye-line target unambiguously readable at medium-shot framing
- [ ] Posture sag (decline branch) is a fraction, not a slouch
- [ ] Face composed — no micro-expressions beyond the ones this sheet lists
- [ ] Gaze #3 on l14 matches the branch variant (default / slow-lift / shortened)

### Red flags (stop and flag to the director)

If any of these occur in a render pass, the sheet is being
misread. Escalate before proceeding:

- Four or more player-gazes in a single playthrough
- The Enigma smiles at any point in the scene
- She speaks, even silently mouthing a word
- She takes a step in any direction
- Her hands leave her waist for any reason other than the
  l12c_v1 compression
- The Antiquarian's blocking affects her pose (she is
  independent of him; only l06's eye-line and her two permitted
  glances at him during l11b/l06 are coupled)
- The posture sag carries across branches (it is DECLINE-only)

---

**Sheet length:** 3 pages as rendered to PDF at standard A4.
**Last sync against the timeline CSV:** matches row-for-row.
**Last sync against §9.10.2:** matches beat-for-beat.
