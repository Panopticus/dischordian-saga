/* ═══════════════════════════════════════════════════════
   LOREDEX MISSION TAG POOL — keyed pool of loredex entry
   ids that proceduralMissionFactory.generateMission() can
   sample from when building a mission's loredex unlock.

   Pool is keyed by (faction, theme) and (era, danger) bands
   so generated missions surface canonical loredex content
   instead of bespoke per-mission entries. The factory picks
   1-3 entry ids per mission based on the mission tags.

   Authoring: pool entries should be LOREDEX entry ids that
   already exist (or are about to exist) in the player-
   visible loredex. The pool is the connective layer between
   mechanical mission completion and the world's text canon.
   ═══════════════════════════════════════════════════════ */

/** Map from a tag (e.g. "faction:coda" / "theme:cadre" / "era:pre_fall")
 *  to a list of canonical loredex entry ids that the mission factory
 *  can sample from when emitting a mission. Multiple tags compose; the
 *  factory dedupes the result. */
export const LOREDEX_TAG_POOL: Record<string, readonly string[]> = {
  // ─── Faction pools ───
  "faction:coda": [
    "coda_reveal_cadence_protocol",
    "coda_acoustic_relay_doctrine",
    "vex_solene_maestro_lineage",
    "coda_off_cadence_insertions",
    "coda_recording_recovery_log",
  ],
  "faction:insurgency": [
    "insurgency_iron_clad_lion_cadre",
    "jericho_jones_cadre_formation",
    "wraith_calder_unfinished_business",
    "insurgency_post_fall_oath_protocol",
    "iron_lion_prefall_relief_words",
    "iron_lion_three_lost_brothers",
  ],
  "faction:syndicate_of_death": [
    "syndicate_quiet_door_protocol",
    "syndicate_resurrection_protocols_echo",
    "syndicate_inner_sanctum_doctrine",
    "drael_mon_tracking_sheet_protocol",
    "hierarchy_acquisitions_takeover_protocol",
  ],
  "faction:thaloria_in_exile": [
    "daily_names_ceremony_protocol",
    "necromancer_name_list_protocol",
    "necromancer_succession_protocol",
    "hierarchy_redaction_ledger",
    "antiquarian_marginalia_protocol",
    "thalorian_revival_canon",
  ],

  // ─── Theme pools ───
  "theme:calibration": [
    "engineer_zero_calibration_protocol",
    "architect_witness_protocol",
    "architect_calibration_lineage",
    "engineer_zero_succession_stamp",
  ],
  "theme:cadre": [
    "iron_lion_succession_protocol",
    "jericho_jones_cadre_formation",
    "iron_lion_prefall_relief_words",
  ],
  "theme:ceremony": [
    "necromancer_name_list_protocol",
    "necromancer_succession_protocol",
    "daily_names_ceremony_protocol",
  ],
  "theme:performance": [
    "coda_reveal_cadence_protocol",
    "vex_solene_maestro_lineage",
    "coda_off_cadence_insertions",
  ],
  "theme:infiltration": [
    "syndicate_quiet_door_protocol",
    "syndicate_resurrection_protocols_echo",
  ],
  "theme:negotiation": [
    "drael_mon_acquisition_clause",
    "antiquarian_self_citation_paradox",
  ],
  "theme:extraction": [
    "syndicate_resurrection_protocols_echo",
    "coda_recording_recovery_log",
  ],
  "theme:glory": [
    "syndicate_inner_sanctum_doctrine",
    "iron_lion_succession_protocol",
  ],

  // ─── Era pools ───
  "era:pre_fall": [
    "iron_lion_prefall_relief_words",
    "iron_lion_three_lost_brothers",
    "architect_witness_protocol",
    "necromancer_name_list_protocol",
  ],
  "era:post_reveal": [
    "coda_reveal_cadence_protocol",
    "coda_off_cadence_insertions",
  ],
  "era:post_fall": [
    "syndicate_quiet_door_protocol",
    "drael_mon_tracking_sheet_protocol",
  ],
  "era:current_cycle": [
    "antiquarian_marginalia_protocol",
    "engineer_zero_calibration_protocol",
  ],

  // ─── Danger pools ───
  "danger:routine": ["seer_scripted_loss_pedagogy"],
  "danger:challenging": ["antiquarian_marginalia_protocol"],
  "danger:dangerous": ["hierarchy_acquisitions_takeover_protocol"],
  "danger:suicidal": ["resurrectionist_neyon_canon", "syndicate_inner_sanctum_doctrine"],
};

/** Sample 1-3 loredex entry ids for a mission carrying the given tags.
 *  Deduplicates across tag pools; deterministic by `seed` for replay
 *  stability. Returns at most `count` ids; may return fewer if the
 *  composed pool is smaller. */
export function sampleLoredexForTags(
  tags: readonly string[],
  seed: number,
  count: number = 2,
): string[] {
  const pool: string[] = [];
  for (const tag of tags) {
    const list = LOREDEX_TAG_POOL[tag];
    if (!list) continue;
    for (const id of list) if (!pool.includes(id)) pool.push(id);
  }
  if (pool.length === 0) return [];
  // Deterministic shuffle (xorshift32) keyed on seed.
  let s = seed | 0;
  if (s === 0) s = 1;
  const out: string[] = [];
  const taken = new Set<number>();
  const want = Math.min(count, pool.length);
  while (out.length < want) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    const idx = ((s | 0) >>> 0) % pool.length;
    if (taken.has(idx)) continue;
    taken.add(idx);
    out.push(pool[idx]!);
  }
  return out;
}
