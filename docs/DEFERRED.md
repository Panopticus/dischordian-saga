# Deferred work — Phase J hotspot system

Living list of items intentionally deferred during the Phase J hotspot
authoring sweep (PRs #775-#782 and follow-ups). Each item:

- has a known sprite/hotspot/lore artifact in the repo
- could be authored today but was deliberately left for a later pass
- has the reason for deferral noted, so the next pass knows what changed
  triggers re-evaluation

## Open

### 1. Cogsworth NPC + Engineering presence hotspot

**Status**: deferred to DLC update
**Triggers re-evaluation**: when the chief-engineer character is named in `LORE_BIBLE.md`

**What exists**:
- 6 composite sprite variants in `engineeringComposite.ts`:
  `sp69_cogsworth_absent`, `sp70_cogsworth_at_workstation`,
  `sp72_cogsworth_at_workbench`, `sp73_cogsworth_at_mezzanine_diagnostic`,
  `sp74_cogsworth_seated_finale` (plus `sp71_hb4_workbench_partial_dissolution`
  which interleaves)
- Production-doc role: "Cogsworth (or named engineer NPC)" appears in
  `docs/production/_PRODUCTION_ARK_ROOMS.md` §A.7.9 — chief engineer,
  brass nameplate "C. COGSWORTH or current engineer", working chair,
  locker with Act-5 gameplay-key journal
- Voice-line slot reserved: §2.7.2 (Engineering Bay NPC presence-line set)

**What doesn't exist**:
- No `LORE_BIBLE.md` entry (`loredex.character.cogsworth` is referenced
  in production docs but the canonical bible doesn't have him)
- No NPC registry entry (`npcIdentity.ts`, `npcDialogues.ts`,
  `npcs/banks/`, `npcs/bibles/` — none have him)
- No VO lines in any voice manifest
- No `room-mystery:engineering:*` responses for him
- No `FactionNPC` entry

**Why deferred**: the production docs explicitly hedge his name
("or named engineer NPC") — committing to `npc-cogsworth` as a hotspot
id would lock in a placeholder name before canon decides the actual
character. There's also an open canon question: how does Cogsworth
relate to **Marion Kell**, the dead engineer whose residue bench is
already a shipped hotspot (`kell-physical-residue-bench` →
`sp60_kell_physical_residue_bench`)? Predecessor? Successor? Same
character? Until that's resolved, the 6 sprites stay unscoped.

**Unblock path**: canon decision on character identity →
`LORE_BIBLE.md` entry → NPC registry entry → VO line set →
`npc-cogsworth` (or final name) hotspot scoped to all 6 sprites.
Mirror the pattern of the 4 archives antiquarian variants.

**Audit impact**: 6 sprites stay in `UNSCOPED-NAMED` until unblocked.

---

## Closed

(none yet — items move here when their unblock condition fires and
the work lands)
