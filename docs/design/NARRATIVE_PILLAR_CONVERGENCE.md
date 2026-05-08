# NARRATIVE PILLAR CONVERGENCE

audit/14.F4 deliverable. Maps the four named narrative pillars
of Dischordian Saga onto the flag substrate, names the
cross-pillar interactions that already exist, and documents the
three convergence gaps that future content should resolve.

The pillars are:

1. **Witnessing** — the §1.x doctrine layered over the entire
   campaign, gated by Mobile Narrator slots, prelude beats, and
   the Three-Witnesses canonical structure.
2. **Identity Chains** — the imprint / Source / consumed-host
   reveal arc, primarily but not exclusively Kael's, surfaced
   through `s1_char_106 Wraith Calder`, `s1_char_115 Consumed
   Host`, and the Authority's Identity Chain dossier files.
3. **Thought Virus** — the strain-trajectory subsystem
   (`apps/shared/thoughtVirus.ts`), the contagion mechanics
   layered over the Source identity, and the
   `thought_virus_*` faction's combat surfaces.
4. **Light/Dark** — the Dischordian Cycle meter
   (`apps/shared/dischordiaCycle.ts`), the +200/-100 vortex
   shifts, and the Act 1 finale alignment fork.

The convergence question this doc serves: when two pillars
touch in production code, are they touching by design? And
where they don't touch but should, what is the smallest fix?

## Per-pillar flag inventory

### Witnessing — reads / writes

Reads:
- `event_two_witnesses_meet` — set by the Witnessing Hub when
  the second witness is recorded against any narrative beat.
- `mobile_narrator_<roomId>_seen` — per-room narrator-slot
  acknowledgement; used to stop replaying the same opener.
- `prelude_burnt_card_found` — gates the Archives prelude beat
  (§2.7). The witnessing slot at the Archive only shows the
  Seer's burnt-card opener after this fires.
- `cryo_mystery_first_clue_found` — the cryo-bay slot is
  withheld until the player has examined at least one mystery
  hotspot (§13 first-arrival framing).

Writes:
- `act6_silence_meta_heard` — fires after Act 6 plays the
  silence-stance acknowledgment if the player ended the prior
  cycle with `act7_silence_stance`.
- `<roomId>_first_visit_complete` — most rooms write this from
  `dispatchRoomEnter`, which is the Witnessing slot's tap
  signal.

### Identity Chains — reads / writes

Reads:
- `kael_identity_revealed_act4` — gates the Wraith Calder
  return print and the post-revelation Kael NPC bank.
- `iron_lion_imprint_acknowledged` — gates the Iron Lion
  imprint set's Tier 2+ reveal; surfaces in the Witnessing Hub
  Archive panel.
- `apprentice_trial_completed_<archetype>` — added in audit/
  10.F5 (commit 9). The variant resolver / companion comments
  can now read who the player apprenticed under.

Writes:
- `act4_kael_consumed_witnessed` — set when Kael's consumption
  scene plays; downstream Authority dossier files unlock from
  it.
- `imprint_<id>_first_seen` — per-imprint first-encounter
  flag, written by the imprint-set TCG cards on first deploy.

### Thought Virus — reads / writes

Reads:
- `act4_kael_consumed_witnessed` — the strain trajectory shifts
  to its Source-aware branch once Kael's consumption is on
  record. Pre-witness, the trajectory plays as ambient
  contagion.
- `essence_harvest_first` / `essence_harvest_veteran` — added
  in audit/10.F5 (commit 9). The Collector's ledger surfaces
  can now read the player's harvest tenure when narrating
  strain-related encounters.
- `thoughtVirusSpreadService` reads the live `dreamTokens`
  balance and the Authority sector's contamination flags but
  does not consult Witnessing or Light/Dark.

Writes:
- `strain_trajectory_<sector>_<phase>` — per-sector phase
  markers, fired by the spread service on each tick.
- `consumed_host_first_seen` — the first time the player
  encounters the Consumed Host TCG card or its NPC variant.

### Light/Dark — reads / writes

Reads:
- `act1_cycle_c_alignment_<light|dark|balanced>` — set at the
  Act 1 finale alignment fork. The Dischordian Cycle reads
  this on every tick to bias the meter trajectory.
- `event_two_witnesses_meet` — fires the +200 light vortex
  shift on first witness-pair completion. Cross-pillar tie:
  Witnessing → Light/Dark.

Writes:
- `light_meter_threshold_dawn` — set when the meter crosses
  +60 toward humanity for the first time.
- `dark_meter_threshold_eclipse` — set when the meter crosses
  -60 toward machine.
- `cycle_c_<phase>_complete` — per-phase advancement of the
  Cycle's three-act trajectory.

## Cross-pillar interactions that exist today

### Witnessing → Light/Dark

`event_two_witnesses_meet` triggers a +200 light vortex shift
or a +100 dark shift, depending on which witness pair completed
first. Implementation:
`apps/shared/dischordiaCycle.ts:applyVortexShift` reads the
event flag and applies the delta on the next tick.

This is the most explicit cross-pillar wiring in the codebase.
It is well-documented and frequently exercised. No gap.

### Identity Chains → Witnessing

The Mobile Narrator selection per bond weight reads the
imprint-set state. When the player has acknowledged a high-
weight imprint (Iron Lion, Architect), the narrator slot at
the Bridge prefers that imprint's prelude line over the
default Elara narration.

Implementation: `getMobileNarratorPreference()` in the
witnessing store reads `state.imprintAcknowledgments` and
returns a per-room preferred narrator; the slot component
falls back to default when nothing matches.

This is well-shipped. No gap.

### Thought Virus → Identity Chains

Kael's consumption *is* his Source identity reveal. The
narrative beat in Act 4 sets both `act4_kael_consumed_witnessed`
(Witnessing-pillar flag) AND triggers the strain trajectory
shift in `thoughtVirusSpreadService` (Thought Virus pillar
flag). The flags are written within the same scene mutation;
the cross-pillar coupling is intentional.

Implementation: `apps/server/routers/witnessing.ts:recordConsumptionScene`
writes both pillar flags atomically.

This is well-shipped. No gap.

## Three documented gaps (for future content)

### Gap 1: Light/Dark → Identity Chains

**The question.** Does the Act 1 finale meter threshold gate
Act 4 reveals?

**Status today.** Not directly. The Act 4 imprint reveals
(`act4_kael_consumed_witnessed`, `iron_lion_imprint_acknowledged`)
are gated on Witnessing prerequisites, but they ignore the
Light/Dark meter. A player who finishes Act 1 deep in machine-
alignment sees the same Act 4 reveal as a player at peak
humanity.

**Recommendation.** This is intentional — the reveals are
canon-fixed. The meter affects reaction beats *around* the
reveal but should not alter the reveal itself. Document the
intent in the next canon revision so writers don't accidentally
add a meter-gate downstream.

### Gap 2: Witnessing ↔ Thought Virus

**The question.** Are the Seer's prophecy and the strain
trajectory parallel narratives or convergent ones?

**Status today.** Partially convergent through Kael (the
strain reveal IS the identity reveal) but otherwise parallel.
The Seer's Sealed Letter (`s1_char_046 The Seer`) and the
strain-trajectory phase markers do not reference each other.
A player following the Seer's prophecy threads has no
mechanical signal that those threads tie back to the strain.

**Recommendation.** Add a single VARIANT_REGISTRY entry that
gates on both `seer_sealed_letter_opened` AND
`strain_trajectory_sector_2_phase_3` (or a similar later-act
phase) so the convergence is observable when the player has
followed both threads. The variant text would acknowledge that
the prophecy was strain-aware all along. Estimated effort: one
authored variant entry; no engine change.

### Gap 3: Identity Chains → Light/Dark

**The question.** Do imprint reveals shift the meter directly,
or only via downstream action choices?

**Status today.** Indirect only. Acknowledging an imprint
unlocks new dialog and TCG cards, but the meter does not
shift on the acknowledgment itself — only on subsequent
choices the player makes in conversations the reveal opens.

**Recommendation.** Keep the indirect coupling. A direct
meter shift on imprint-reveal would feel like a non-volitional
alignment change, which is the wrong shape — the player did
not *do* anything; the world simply revealed something. The
current "reveal opens new conversations, conversations carry
the meter signal" is the right architecture. Document this
explicitly in canon so it survives future "should this set the
flag?" debates.

## Summary

Three of four pillars cross-couple cleanly:

- Witnessing → Light/Dark (witnesses-met vortex)
- Identity Chains → Witnessing (mobile narrator preference)
- Thought Virus → Identity Chains (Kael's consumption reveal)

Three remaining couplings are intentional non-couplings:

- Light/Dark → Identity Chains (Gap 1, deliberate)
- Identity Chains → Light/Dark (Gap 3, deliberate)

One coupling is a real gap that one authored variant could
close:

- Witnessing ↔ Thought Virus / Seer prophecy (Gap 2,
  authoring opportunity)

The audit/14 sequence treats this doc as the convergence-
matrix deliverable; future canon revisions can amend it as
new pillar interactions ship.
