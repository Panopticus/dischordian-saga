/* ═══════════════════════════════════════════════════════
   AKAI SHI · THE RED DEATH — Mystery arc

   5 episodes. Premise: Akai Shi was a revered Potential whose
   mastery of energy manipulation and healing made her a
   load-bearing member of the first-wave force on Thaloria.
   The Thought Virus consumed her there. Jericho Jones killed
   her — a mercy-killing under contested doctrine. She was
   then resurrected and transformed into the Red Death: a
   time-traveling cosmic-threat eliminator who would,
   centuries later, kill the Necromancer within the Matrix of
   Dreams.

   Canonical anchors (every claim cited):
     - LORE_BIBLE.md:726-748 (Akai Shi → the Red Death;
       Necromancer's executioner; "Active as the Red Death as
       of Year 117,046 A.A.")
     - LORE_BIBLE.md:1158 (Jericho killed Akai Shi at the
       Battle of Thaloria to stop the Thought Virus from
       spreading)
     - LORE_BIBLE.md:2514-2560 (the Necromancer; "Destroyed on
       Day 15 of Fracture, Year 117,046 A.A." — Akai Shi
       killed him)
     - LORE_BIBLE.md:2804 (the Resurrectionist Ne-Yon —
       Samsara's Child; authored Akai Shi's reanimation)
     - apps/shared/identityCollisionCanon.ts (akai_shi_manifold
       — collision-resolves "The Red Death" to Akai Shi)

   Resolution at E5: Akai Shi closes the Necromancer's
   millennia-long evasion of fate within the Matrix of Dreams.
   The arc's terminal question — was Jericho's mercy-killing
   the seed of the Red Death's mandate, or did the mercy and
   the mandate share a root older than either? — is left
   answered-but-uncomfortable. The case closes; the player
   carries the discomfort forward.

   Voice: the Antiquarian, narrating across time. The Red
   Death's own voice appears at episode close.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId,
  ChoiceId,
  ClueId,
  DeductionId,
  EpisodeDefinition,
  EpisodeId,
  LensDefinition,
  LensId,
  MysteryDefinition,
  MysteryId,
  SuspectGraphNode,
  SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.akai_shi_red_death" as ArcId;
const ID  = "akai_shi.red_death"          as MysteryId;

/* ═══════════════════════════════════════════════════════
   E1 — The Mercy on Thaloria
   ═══════════════════════════════════════════════════════ */

const e1: EpisodeDefinition = {
  id: "akai_shi.red_death.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Mercy on Thaloria",
  summary:
    "Battle of Thaloria. Akai Shi — revered Potential, energy-manipulation master, healer — has been consumed by the Thought Virus. Jericho Jones, her friend, killed her to stop the spread. The official record names it mercy. The Antiquarian, opening the case centuries later, is not yet sure what name the act eventually carried.",
  clues: [
    {
      id: "akai.e1.battle_logs" as ClueId,
      title: "Battle of Thaloria — Combat Logs",
      body:
        "The combat logs record Akai Shi's last hours: energy-manipulation discharges that would have stabilized three faltering squads. Healing applied to seven Potentials whose injuries should have been fatal. Then, four hours into the engagement, a transition the logs notate only as 'subject consumed.' From that point her energy-manipulation begins to redirect toward her own allies. Jericho intercepted her at the seven-hour mark.",
      foundIn: "war-room",
    },
    {
      id: "akai.e1.jericho_signed_witness" as ClueId,
      title: "Jericho's Witness Page",
      body:
        "Jericho Jones signed the witness page within the hour: 'Akai Shi was already gone. I did the work she would have asked me to do if she could have asked.' The Degen counter-signed as witness within minutes — the same Degen who would recruit Jericho seventy-two hours later. The witness page is in the Antiquarian's library, in Jericho's handwriting, with no visible re-drafting.",
      foundIn: "antiquarian-library",
    },
    {
      id: "akai.e1.akai_last_recorded" as ClueId,
      title: "Akai Shi's Last Recorded Words",
      body:
        "A field-recording from her squad's helm-comm, retrieved post-engagement. Forty-seven seconds before Jericho reached her, Akai Shi spoke into the comm: 'If the Virus finishes its work, I trust the squad to finish theirs. The doctrine on mercy is contested. The doctrine on consequence is not. Whoever does the work, the work is not yours alone. Tell the Antiquarian: it was always going to be a mercy. We just have to live with which kind.'",
      foundIn: "comms-array",
    },
    {
      id: "akai.e1.virus_telemetry" as ClueId,
      title: "Thought-Virus Consumption Telemetry",
      body:
        "Post-mortem telemetry from Akai Shi's neural fields shows the Thought-Virus consumption curve. Standard consumption: a sudden cliff. Akai Shi's curve: a gradient. She was, on the consumption telemetry, fighting it for hours before Jericho arrived — slowing the consumption with her own healing energy turned inward. By the time he intercepted her, she had been holding the line in her own body for longer than anyone else in canonical record.",
      foundIn: "medical-bay",
    },
  ],
  deductions: [
    {
      id: "akai.e1.d.she_chose_the_mercy" as DeductionId,
      clueA: "akai.e1.akai_last_recorded" as ClueId,
      clueB: "akai.e1.virus_telemetry" as ClueId,
      result: "correct",
      narrationId: "akai.e1.n.she_chose_the_mercy",
      narrationProse:
        "Akai Shi was holding the line in her own body. Her last recorded words asked the squad to finish what she could no longer finish. The mercy-killing was not done TO her — it was the work she had asked her squad to do if she could no longer ask. The Antiquarian's case closes the first half of the question: the mercy was hers to choose, and she chose. The case's second half — what the mercy SEEDED in the chronicle — opens.",
      unlocksEpisode: "akai_shi.red_death.e2" as EpisodeId,
    },
    {
      id: "akai.e1.d.jericho_carried_the_weight" as DeductionId,
      clueA: "akai.e1.jericho_signed_witness" as ClueId,
      clueB: "akai.e1.battle_logs" as ClueId,
      result: "partial",
      narrationId: "akai.e1.n.jericho_carried_the_weight",
      narrationProse:
        "Jericho signed the witness page in his own hand within the hour. The Degen counter-signed within minutes. The Degen recruited Jericho seventy-two hours later. The chain reads, on the surface, as opportunism — but Jericho's signature is steady, not haunted. The weight Jericho carried was not the weight of a man unsure of what he did. It was the weight of a man sure of what he did and unsure of what it meant. The partial reading: Jericho's clarity is the chronicle's problem, not his.",
    },
    {
      id: "akai.e1.d.false_lead_jericho_culpable" as DeductionId,
      clueA: "akai.e1.battle_logs" as ClueId,
      clueB: "akai.e1.jericho_signed_witness" as ClueId,
      result: "false_lead_named",
      narrationId: "akai.e1.n.not_culpable",
      narrationProse:
        "Reading Jericho as culpable for Akai Shi's death is the lazy investigator's reading. The combat logs show Akai Shi's energy-manipulation redirecting toward her own allies after the consumption moment. Jericho intercepted at the moment the redirection was about to become weapons-grade. The act was a mercy AND a tactical necessity AND her own request. Loading culpability onto Jericho satisfies a chronicle-shape that the chronicle did not actually carry.",
    },
  ],
  choices: [
    {
      id: "akai.e1.c.find_the_resurrection" as ChoiceId,
      label:
        "Trace what happened to Akai Shi's body after the mercy — the Red Death did not emerge from nothing.",
      weight: "patient",
    },
    {
      id: "akai.e1.c.consult_jericho" as ChoiceId,
      label:
        "Bring the case to Jericho Jones — his Mystery Engine arc carries the parallel reading; the cross-arc deepens both.",
      weight: "cross_arc_jericho",
    },
    {
      id: "akai.e1.c.read_the_doctrine" as ChoiceId,
      label:
        "Open the doctrine on contested-mercy from the Potentials' founding — Akai Shi's words referenced it; the doctrine is older than her.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "album5.t06", // "Plead the Fifth" — Silence in Heaven
    slideshowId: "album5.t06.thaloria_mercy",
    loredexUnlocks: [
      "loredex.akai_shi_thaloria_canon",
      "loredex.contested_mercy_doctrine",
      "loredex.jericho_witness_page",
    ],
    conspiracyDiscoveries: ["akai.thaloria.mercy_was_hers"],
    dropAt: "episode_open",
  },
};

/* ═══════════════════════════════════════════════════════
   E2 — The Resurrectionist's Hand
   ═══════════════════════════════════════════════════════ */

const e2: EpisodeDefinition = {
  id: "akai_shi.red_death.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "The Resurrectionist's Hand",
  summary:
    "Akai Shi's body did not stay where Jericho left it. The Resurrectionist — Ne-Yon, Samsara's Child — collected her within the same cycle. The reanimation was authored under conditions canon does not openly record. Investigate the procedure; understand what was preserved and what was altered.",
  clues: [
    {
      id: "akai.e2.recovery_manifest" as ClueId,
      title: "Body Recovery Manifest",
      body:
        "Standard procedure after Battle of Thaloria called for the fallen Potentials' bodies to be transferred to the Antiquarian's library for preservation. Akai Shi's manifest entry reads: 'collected by external agent — Resurrectionist Ne-Yon — within the same engagement cycle. Antiquarian's library entry deferred at the Resurrectionist's request.' The deferral has been in force ever since.",
      foundIn: "archives",
    },
    {
      id: "akai.e2.samsaras_child_seal" as ClueId,
      title: "The Resurrectionist's Seal",
      body:
        "The Resurrectionist's seal appears on the recovery manifest: a stylised wheel-and-thread, the Cycle Walker's signature. The same seal appears on the Crucible's records for the Wolf's reanimation centuries later (cross-arc binding to mystery.wolf_anara_hunt). The Resurrectionist authored both reanimations. The two cases share a substrate.",
      foundIn: "antiquarian-library",
    },
    {
      id: "akai.e2.altered_energy_signature" as ClueId,
      title: "Akai Shi's Altered Energy Signature",
      body:
        "The Red Death's energy signature, recorded centuries after Akai Shi's death, retains all of Akai Shi's pre-mortem markers — except the healing-frequency band. The healing band has been REPLACED with a time-displacement frequency. The Red Death cannot heal. The Red Death can move through time. The Resurrectionist swapped one capacity for another in the reanimation.",
      foundIn: "quantum-lab",
    },
    {
      id: "akai.e2.dreamer_quarantine" as ClueId,
      title: "The Dreamer's Quarantine Filing",
      body:
        "The Dreamer — through the Shield's filing chain — registered a quarantine on the Resurrectionist's actions in the wake of the Akai Shi reanimation. The quarantine is canonically OPEN — it has never been lifted. The Dreamer has, since, lodged similar quarantines on three further Resurrectionist actions, including the Wolf's. The quarantines are evidence; they are not enforcement. The Dreamer disagrees. The Resurrectionist continues.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "akai.e2.d.healing_for_time" as DeductionId,
      clueA: "akai.e2.altered_energy_signature" as ClueId,
      clueB: "akai.e2.samsaras_child_seal" as ClueId,
      result: "correct",
      narrationId: "akai.e2.n.healing_for_time",
      narrationProse:
        "The Resurrectionist swapped Akai Shi's healing band for a time-displacement band. The trade is canonical Cycle-Walker logic: a being who could heal one cycle's wounds becomes a being who can step OUT of the cycle to address its broader pattern. The Red Death cannot save lives; she can re-author the conditions that ended them. The mercy she received from Jericho is, by Resurrectionist architecture, paid forward by the mercy she will give the cosmos.",
      unlocksEpisode: "akai_shi.red_death.e3" as EpisodeId,
    },
    {
      id: "akai.e2.d.dreamer_disagrees" as DeductionId,
      clueA: "akai.e2.dreamer_quarantine" as ClueId,
      clueB: "akai.e2.samsaras_child_seal" as ClueId,
      result: "partial",
      narrationId: "akai.e2.n.dreamer_disagrees",
      narrationProse:
        "The Dreamer's quarantine filings are evidence of a cosmic disagreement between two Ne-Yons. The Resurrectionist authors reanimations; the Dreamer files quarantines on them. The disagreement is not resolved by either Ne-Yon imposing on the other — the Shield does not arbitrate. The chronicle records the disagreement. Akai Shi (the Red Death) and the Wolf both walk under reanimations the Dreamer would not have authorised. The partial reading: cosmic ethics are not a settled matter; the saga's Ne-Yon registry holds the disagreement open.",
    },
    {
      id: "akai.e2.d.false_lead_resurrection_is_continuation" as DeductionId,
      clueA: "akai.e2.recovery_manifest" as ClueId,
      clueB: "akai.e2.altered_energy_signature" as ClueId,
      result: "false_lead_named",
      narrationId: "akai.e2.n.not_continuation",
      narrationProse:
        "Reading the Red Death as 'continued Akai Shi' is the chronicle's comforting story and the wrong one. The healing band is gone. The time-displacement band is new. The being who emerged from the Resurrectionist's chamber is not the being Jericho killed. She CARRIES Akai Shi's memory and Akai Shi's vow; she IS a new instrument authored over Akai Shi's substrate. The chronicle's grief-honouring reading flattens what the Resurrectionist actually did.",
    },
  ],
  choices: [
    {
      id: "akai.e2.c.petition_dreamer" as ChoiceId,
      label:
        "File an inquiry through the Dreamer's quarantine chain — the cosmic disagreement is the chronicle's case.",
      weight: "patient",
    },
    {
      id: "akai.e2.c.cross_arc_wolf" as ChoiceId,
      label:
        "Cross-reference with the Wolf's reanimation — the Resurrectionist authored both; the substrate is shared.",
      weight: "cross_arc_wraith",
    },
    {
      id: "akai.e2.c.confront_resurrectionist" as ChoiceId,
      label:
        "Confront the Resurrectionist directly — Samsara's Child has not yet given testimony in the chronicle's voice.",
      weight: "direct",
    },
  ],
  contentBundle: {
    songId: "album5.t06",
    slideshowId: "album5.t06.resurrectionists_hand",
    loredexUnlocks: [
      "loredex.resurrectionist_seal",
      "loredex.healing_band_swapped_for_time",
      "loredex.dreamer_quarantine_chain",
    ],
    conspiracyDiscoveries: ["akai.resurrection.healing_for_time_displacement"],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E3 — The Mandate
   ═══════════════════════════════════════════════════════ */

const e3: EpisodeDefinition = {
  id: "akai_shi.red_death.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Mandate",
  summary:
    "The Red Death's mandate. She moves through time to eliminate cosmic threats. The chronicle has her targets list. The list is not random; it is ordered by a logic the Antiquarian has been trying to read for years. Investigate the order. The pattern names her enemy.",
  clues: [
    {
      id: "akai.e3.targets_list" as ClueId,
      title: "The Red Death's Targets List",
      body:
        "A list of fourteen entities the Red Death has eliminated across the centuries: cosmic-threat actors in chronicle-witnessed events. Each entry carries a date, a place, and the chronicler's note. The Antiquarian's library carries the list in its open archive. Each target was destroyed in a moment when their destruction altered the chronicle's forward path.",
      foundIn: "antiquarian-library",
    },
    {
      id: "akai.e3.order_pattern" as ClueId,
      title: "The List's Order — Pattern Analysis",
      body:
        "The targets are not in chronological order. They are in the order of how MUCH each elimination redirected the chronicle's path. The first target redirected the chronicle by one degree. The fourteenth target — yet to be named — would redirect by ninety. The list is ascending. She is building toward something.",
      foundIn: "cipher-den",
    },
    {
      id: "akai.e3.necromancer_dossier" as ClueId,
      title: "The Necromancer's Dossier (Archon, 10th-created)",
      body:
        "The Necromancer — the Architect's tenth-created Archon (LORE_BIBLE.md:2528) — has been on the Red Death's list for the entire span of her mandate. He is the ONLY entry on the list whose date of elimination is BLANK. He is the final target. The Antiquarian's notation under his name reads: 'subject's millennia-long evasion of fate is the Red Death's primary work.'",
      foundIn: "archives",
    },
    {
      id: "akai.e3.necromancer_evasion_log" as ClueId,
      title: "The Necromancer's Evasion Log",
      body:
        "The Necromancer's recorded movements: across centuries, he has lived in the Matrix of Dreams — the construct the Game Master (his fellow Archon, the Ninth-titled Tenth) authored. The Matrix of Dreams is canonically un-territorial. The Necromancer cannot be tracked by chronicle-space coordinates inside it. Only a time-displaced agent could find him. The Red Death is, by Resurrectionist architecture, the only such agent.",
      foundIn: "quantum-lab",
    },
  ],
  deductions: [
    {
      id: "akai.e3.d.necromancer_is_target_zero" as DeductionId,
      clueA: "akai.e3.necromancer_dossier" as ClueId,
      clueB: "akai.e3.necromancer_evasion_log" as ClueId,
      result: "correct",
      narrationId: "akai.e3.n.necromancer_is_target_zero",
      narrationProse:
        "The Necromancer is the Red Death's true target. The thirteen others are the chronicle's way of building her toward the impossible elimination. He has evaded fate within the Matrix of Dreams because canonical space cannot reach him there; only time-displacement can. The Resurrectionist authored the Red Death specifically for this kill. The mandate has been one long approach since the moment Akai Shi opened her eyes in the reanimation chamber.",
      unlocksEpisode: "akai_shi.red_death.e4" as EpisodeId,
    },
    {
      id: "akai.e3.d.thirteen_were_training" as DeductionId,
      clueA: "akai.e3.targets_list" as ClueId,
      clueB: "akai.e3.order_pattern" as ClueId,
      result: "partial",
      narrationId: "akai.e3.n.thirteen_were_training",
      narrationProse:
        "The thirteen eliminations preceding the Necromancer were preparation. Each forced the Red Death to refine her time-displacement craft against a more difficult target. The chronicle's forward-path redirection per kill is ascending — each kill teaches her a craft she will need for the next. By the fourteenth, she will have the craft. The partial reading: the Necromancer's evasion has been an opponent that taught her everything she will use against him.",
    },
    {
      id: "akai.e3.d.false_lead_random_killer" as DeductionId,
      clueA: "akai.e3.targets_list" as ClueId,
      clueB: "akai.e3.necromancer_evasion_log" as ClueId,
      result: "false_lead_named",
      narrationId: "akai.e3.n.not_random",
      narrationProse:
        "The Red Death is not a random killer of cosmic threats. The list is ordered. The order is the mandate. Reading her as a free agent who happens to keep eliminating bad actors is the chronicle's misread — comforting because it preserves agency, wrong because it ignores the Resurrectionist's authorship. She is a designed instrument. The instrument's design is the Necromancer's eventual destruction. The thirteen others are tools used along the way.",
    },
  ],
  choices: [
    {
      id: "akai.e3.c.warn_the_necromancer" as ChoiceId,
      label:
        "Warn the Necromancer — the chronicle's neutrality requires he have the chance to evade, not just to be hunted.",
      weight: "conservative",
    },
    {
      id: "akai.e3.c.accept_the_mandate" as ChoiceId,
      label:
        "Accept the mandate as the Resurrectionist authored it — the Red Death is the right instrument for the only kill canon-space cannot make.",
      weight: "patient",
    },
    {
      id: "akai.e3.c.cross_arc_game_master" as ChoiceId,
      label:
        "Petition the Game Master arc's resolution — the Matrix of Dreams was HIS design; he may know the room the Necromancer hides in.",
      weight: "cross_arc_game_master",
    },
  ],
  contentBundle: {
    songId: "album5.t06",
    slideshowId: "album5.t06.mandate",
    loredexUnlocks: [
      "loredex.red_deaths_targets_list",
      "loredex.necromancer_evasion_canon",
      "loredex.mandate_pattern_ascending",
    ],
    conspiracyDiscoveries: ["akai.mandate.necromancer_is_target_zero"],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E4 — The Matrix of Dreams Hunt
   ═══════════════════════════════════════════════════════ */

const e4: EpisodeDefinition = {
  id: "akai_shi.red_death.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Matrix of Dreams Hunt",
  summary:
    "The Red Death has entered the Matrix of Dreams. The Necromancer has been there for millennia, evading every chronicle-space hunter. Akai Shi's time-displacement does not respect the Matrix's un-territorial geometry. The chase begins not as movement but as time-folding. The Antiquarian watches it across cycles he cannot directly date.",
  clues: [
    {
      id: "akai.e4.matrix_entry_signature" as ClueId,
      title: "Matrix of Dreams — Entry Signature",
      body:
        "The Red Death's entry signature into the Matrix of Dreams, retrieved from the Matrix's surface-layer ledger: timestamp 'Day 14 of Fracture, Year 117,046 A.A.' She entered through a fold the Game Master's original design did not anticipate — the time-displacement band creates a passage canon-space architects could not seal because they could not see it.",
      foundIn: "quantum-lab",
    },
    {
      id: "akai.e4.necromancers_retreat_chambers" as ClueId,
      title: "The Necromancer's Retreat Chambers",
      body:
        "Inside the Matrix, the Necromancer maintains seven retreat chambers — each carrying decoys, false signatures, time-locked illusions. He has used them for millennia to throw off every chronicle-space hunter who has tried him. The seven chambers, taken as a system, form a defense-in-depth no single agent could penetrate. The Red Death has been moving through them in non-canonical order — time-folding rather than walking.",
      foundIn: "cipher-den",
    },
    {
      id: "akai.e4.akais_voice_recorded" as ClueId,
      title: "Akai Shi's Voice (recorded mid-hunt)",
      body:
        "A field-recording from the third retreat chamber, captured on the Matrix's residual ambience: 'Necromancer, you have been good at evading fate. I am the chronicle's correction. I do not hate you. I do not pity you. The Antiquarian asked me, before I came in here, what mercy this kill carries. I told him I do not know yet. I will know when it is done. I will tell him then.'",
      foundIn: "comms-array",
    },
    {
      id: "akai.e4.cycle_fold_anomalies" as ClueId,
      title: "Cycle-Fold Anomalies in the Matrix",
      body:
        "Standard Matrix-of-Dreams telemetry shows continuous-cycle behaviour. During the Red Death's hunt, the telemetry shows discontinuous folds — points where 'before' and 'after' cease to be ordered. The Necromancer, attempting to escape, has been doubling back through his own decisions. The Red Death has been waiting at each doubled-back point. Time-displacement does not let you outrun yourself.",
      foundIn: "observation-deck",
    },
  ],
  deductions: [
    {
      id: "akai.e4.d.cycle_folds_are_traps" as DeductionId,
      clueA: "akai.e4.necromancers_retreat_chambers" as ClueId,
      clueB: "akai.e4.cycle_fold_anomalies" as ClueId,
      result: "correct",
      narrationId: "akai.e4.n.cycle_folds_are_traps",
      narrationProse:
        "The Red Death is not chasing the Necromancer. She is letting him chase himself. Time-displacement lets her stand at every junction he will reach before he reaches it. His seven retreat chambers — designed for chronicle-space evasion — become a closed system when the hunter is at every exit. Every doubled-back decision lands him in front of her. The hunt is not a chase. It is the Necromancer running into the same person, in the same room, over and over, with no chronicle-space he can move to that does not contain her.",
      unlocksEpisode: "akai_shi.red_death.e5" as EpisodeId,
    },
    {
      id: "akai.e4.d.mercy_question_open" as DeductionId,
      clueA: "akai.e4.akais_voice_recorded" as ClueId,
      clueB: "akai.e4.matrix_entry_signature" as ClueId,
      result: "partial",
      narrationId: "akai.e4.n.mercy_question_open",
      narrationProse:
        "The Red Death has not yet decided what kind of mercy this kill will carry. Her voice mid-hunt is calm; the question is honest. The Antiquarian's case-note frames it: she does not hate, she does not pity, she has been authored as a correction. The mercy she will choose at the kill is, on the Antiquarian's reading, the only part of the work the Resurrectionist did not pre-author. She has been given the craft. The ethic is hers.",
    },
    {
      id: "akai.e4.d.false_lead_pursuit" as DeductionId,
      clueA: "akai.e4.necromancers_retreat_chambers" as ClueId,
      clueB: "akai.e4.matrix_entry_signature" as ClueId,
      result: "false_lead_named",
      narrationId: "akai.e4.n.not_pursuit",
      narrationProse:
        "Reading this as a pursuit is the chronicle's natural error. Pursuit implies the Necromancer can outpace the Red Death; the cycle-fold telemetry proves he cannot. He has not been outrun; he has been pre-positioned against. The vocabulary of pursuit does not fit; the vocabulary of correction does. The investigation must use the right word, or the case's closing line will read against the case's actual shape.",
    },
  ],
  choices: [
    {
      id: "akai.e4.c.observe_the_kill" as ChoiceId,
      label:
        "Watch the kill happen through the Antiquarian's chronicle window — observe without intervening.",
      weight: "patient",
    },
    {
      id: "akai.e4.c.message_akai" as ChoiceId,
      label:
        "Send the Red Death a chronicle-message — your reading of the mercy question may inform hers.",
      weight: "direct",
    },
    {
      id: "akai.e4.c.cross_arc_wraith_mercy" as ChoiceId,
      label:
        "Bring the Red Death's mercy question to Wraith Calder's Long Mourning — the Hierophant's litany has been the chronicle's standing answer.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album5.t06",
    slideshowId: "album5.t06.matrix_hunt",
    loredexUnlocks: [
      "loredex.matrix_of_dreams_cycle_fold",
      "loredex.necromancers_seven_retreat_chambers",
      "loredex.red_deaths_mercy_question_open",
    ],
    conspiracyDiscoveries: ["akai.matrix.cycle_folds_close_the_evasion"],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E5 — The Cycle Closed
   ═══════════════════════════════════════════════════════ */

const e5: EpisodeDefinition = {
  id: "akai_shi.red_death.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Cycle Closed",
  summary:
    "Day 15 of Fracture, Year 117,046 A.A. The Necromancer's evasion ends inside the Matrix of Dreams. The Red Death has chosen the kind of mercy. The Antiquarian records the closing. The case ends with an answer that does not soothe — Akai Shi's mercy carries the same uncomfortable weight Jericho's did. Both are mercies; both are corrections; both are the chronicle's work, done.",
  clues: [
    {
      id: "akai.e5.kill_record" as ClueId,
      title: "The Kill — Chronicle Record",
      body:
        "The Antiquarian's record entry for Day 15 of Fracture, Year 117,046 A.A.: 'The Necromancer's millennia-long evasion of fate ended within the Matrix of Dreams. The instrument was the Red Death (subject formerly Akai Shi, Potential, Battle of Thaloria casualty). The kind of mercy chosen: clean. The Necromancer was given the seven seconds Akai Shi was given by Jericho. He spent them as Akai Shi spent hers — speaking into the comm. We do not have the recording. We have the record that the recording was made and that the Red Death keeps it.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "akai.e5.red_death_returns" as ClueId,
      title: "The Red Death Returns from the Matrix",
      body:
        "Twelve cycles after the kill, the Red Death exits the Matrix of Dreams through the same fold she entered. She is, on Antiquarian observation, unchanged. The time-displacement band is intact. The targets list is now closed. The fourteenth entry — the Necromancer's — has been filled in with the date and place. The Antiquarian's open-archive list updates within the hour.",
      foundIn: "antiquarian-library",
    },
    {
      id: "akai.e5.akais_word_to_the_chronicle" as ClueId,
      title: "The Red Death's Word to the Chronicle",
      body:
        "Akai Shi (the Red Death) gives the Antiquarian a single closing line for the chronicle: 'The Necromancer asked me, in his seven seconds, what doctrine of mercy I followed. I told him: the same one Jericho followed for me. He nodded. He understood. I do not know if that nod was forgiveness or recognition or simply the body's last grammar. I do not need to know. The work is done. Tell the chronicle: it was always going to be a mercy. We just lived with which kind.'",
      foundIn: "comms-array",
    },
    {
      id: "akai.e5.case_closes" as ClueId,
      title: "The Case File Closes",
      body:
        "The Antiquarian seals the case file. His closing note: 'The arc the Resurrectionist authored is complete. The instrument she made now exists outside any further mandate. She has chosen her next direction; she has not shared it. The chronicle records the case as closed and the Red Death as active. The two are not contradictions. The case being closed does not mean the case-bearer is.' The cross-arc bindings to Jericho and Wraith fire on close.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "akai.e5.d.mercy_is_the_doctrine" as DeductionId,
      clueA: "akai.e5.akais_word_to_the_chronicle" as ClueId,
      clueB: "akai.e5.kill_record" as ClueId,
      result: "correct",
      narrationId: "akai.e5.n.mercy_is_the_doctrine",
      narrationProse:
        "The doctrine of mercy is the chronicle's continuous thread: Jericho gave it to Akai Shi; Akai Shi (the Red Death) gave it to the Necromancer. Both kills were clean, sought, refused-of-pity. The doctrine is not the act of mercy; the doctrine is what makes the kill recognisable as one. The chronicle's continuing — Wraith's Long Mourning, Jericho's training under the Degen, the Red Death's now-completed mandate — is held together by this thread. The case closes by naming what it always was: the chronicle of who carries the doctrine forward when each carrier passes it on.",
    },
    {
      id: "akai.e5.d.case_closes_red_death_doesnt" as DeductionId,
      clueA: "akai.e5.red_death_returns" as ClueId,
      clueB: "akai.e5.case_closes" as ClueId,
      result: "correct",
      narrationId: "akai.e5.n.case_closes_red_death_doesnt",
      narrationProse:
        "The case closes; the Red Death does not. The Antiquarian's notation is exact: closing the case does not close the case-bearer. She is now outside the Resurrectionist's mandate — the instrument's purpose was the Necromancer; the Necromancer is done. What she does next is not in the chronicle's record yet. The arc ends here. Whatever comes after is a different arc, in a different file, opened on a different day.",
      unlocksEpisode: undefined,
    },
    {
      id: "akai.e5.d.false_lead_clean_resolution" as DeductionId,
      clueA: "akai.e5.kill_record" as ClueId,
      clueB: "akai.e5.akais_word_to_the_chronicle" as ClueId,
      result: "false_lead_named",
      narrationId: "akai.e5.n.not_clean",
      narrationProse:
        "Reading the case as cleanly resolved is the chronicle's comfortable lie. The case file closes; the discomfort does not. Akai Shi's last line — 'I do not know if that nod was forgiveness or recognition or simply the body's last grammar; I do not need to know' — refuses the chronicle the resolution-feeling readers want. The case is correct; the case is also unsoothing. Both can be true. The investigation must leave room for both.",
    },
  ],
  choices: [
    {
      id: "akai.e5.c.let_her_walk" as ChoiceId,
      label:
        "Close the case; let the Red Death walk into her next chapter without the chronicle's escort.",
      weight: "patient",
    },
    {
      id: "akai.e5.c.cross_arc_jericho_close" as ChoiceId,
      label:
        "Inform Jericho Jones — the doctrine of mercy he carried is now carried by Akai Shi forward; he may want to know.",
      weight: "cross_arc_jericho",
    },
    {
      id: "akai.e5.c.cross_arc_wraith_close" as ChoiceId,
      label:
        "Add the Necromancer's name to Wraith Calder's Long Mourning — the chronicle's continuing mourning is the Hierophant's work.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album5.t06",
    slideshowId: "album5.t06.cycle_closed",
    loredexUnlocks: [
      "loredex.necromancer_destruction_canon",
      "loredex.red_death_mandate_complete",
      "loredex.doctrine_of_mercy_thread",
    ],
    conspiracyDiscoveries: ["akai.cycle.case_closes_red_death_walks_on"],
    dropAt: "episode_close",
  },
};

/* ═══════════════════════════════════════════════════════
   SUSPECTS + LENSES
   ═══════════════════════════════════════════════════════ */

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "akai.s.akai_shi" as SuspectId,
    name: "Akai Shi (pre-resurrection)",
    type: "person",
    relations: [
      { to: "akai.s.red_death" as SuspectId, relation: "becomes" },
      { to: "akai.s.jericho" as SuspectId, relation: "killed-by-mercy" },
    ],
  },
  {
    id: "akai.s.red_death" as SuspectId,
    name: "The Red Death (Akai Shi, post-resurrection)",
    type: "person",
    relations: [
      { to: "akai.s.akai_shi" as SuspectId, relation: "is" },
      { to: "akai.s.resurrectionist" as SuspectId, relation: "authored-by" },
      { to: "akai.s.necromancer" as SuspectId, relation: "destroyed" },
    ],
  },
  {
    id: "akai.s.jericho" as SuspectId,
    name: "Jericho Jones",
    type: "person",
    relations: [
      { to: "akai.s.akai_shi" as SuspectId, relation: "gave-mercy" },
    ],
  },
  {
    id: "akai.s.resurrectionist" as SuspectId,
    name: "The Resurrectionist (Ne-Yon)",
    type: "person",
    relations: [
      { to: "akai.s.red_death" as SuspectId, relation: "authored-reanimation" },
    ],
  },
  {
    id: "akai.s.dreamer" as SuspectId,
    name: "The Dreamer (Ne-Yon #1)",
    type: "person",
    relations: [
      {
        to: "akai.s.resurrectionist" as SuspectId,
        relation: "filed-quarantine-against",
      },
    ],
  },
  {
    id: "akai.s.necromancer" as SuspectId,
    name: "The Necromancer (Archon)",
    type: "person",
    relations: [
      {
        to: "akai.s.matrix_of_dreams" as SuspectId,
        relation: "evaded-fate-inside",
      },
    ],
  },
  {
    id: "akai.s.matrix_of_dreams" as SuspectId,
    name: "The Matrix of Dreams",
    type: "place",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "akai.lens.dreamer" as LensId,
    name: "The Dreamer Lens",
    category: "dreamer-aligned",
    deductionNarrationOverrides: {
      ["akai.e2.d.dreamer_disagrees" as DeductionId]:
        "Through the Dreamer lens: the quarantine chain is the saga's record of cosmic disagreement made permanent. The Dreamer's Shield does not arbitrate the Resurrectionist's actions; the Shield only protects what is sheltered. Akai Shi (the Red Death) and the Wolf walk under reanimations the Dreamer did not author. The chronicle holds both Ne-Yons' positions without resolution.",
    },
  },
  {
    id: "akai.lens.architect" as LensId,
    name: "The Architect Lens",
    category: "architect-aligned",
    deductionNarrationOverrides: {
      ["akai.e3.d.necromancer_is_target_zero" as DeductionId]:
        "Through the Architect lens: the Necromancer was His tenth-created Archon. The Red Death's destruction of him is, by the Empire's law, an unauthorised removal of an Imperial asset. The Empire records the destruction; the Empire does not retaliate. The Architect's silence on this point is one of the saga's most-load-bearing omissions.",
    },
  },
  {
    id: "akai.lens.mercy" as LensId,
    name: "The Doctrine-of-Mercy Lens",
    category: "ethic",
    deductionNarrationOverrides: {
      ["akai.e5.d.mercy_is_the_doctrine" as DeductionId]:
        "Through the doctrine-of-mercy lens: the chronicle's mercy is a relay, not a property. Jericho carried it to Akai Shi; Akai Shi carried it to the Necromancer; whoever is next in the chronicle will carry it from her. The doctrine survives because each carrier passes it on. The case closes when the relay is recognised, not when the relay stops.",
    },
  },
];

/* ═══════════════════════════════════════════════════════
   MYSTERY DEFINITION
   ═══════════════════════════════════════════════════════ */

export const AKAI_SHI_RED_DEATH_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "Akai Shi — The Red Death",
  summary:
    "Akai Shi was a revered Potential, killed by Jericho Jones at the Battle of Thaloria as a mercy under contested doctrine. The Resurrectionist Ne-Yon reanimated her with healing swapped for time-displacement: the Red Death, a cosmic-threat eliminator. Her mandate's final target was the Necromancer (Archon, tenth-created) — who had evaded fate within the Matrix of Dreams for millennia. The case opens on her mercy and closes on his. Investigate the doctrine that holds both kills as one continuous thread.",
  npcId: "akai_shi",
  seed: {
    source: "manual",
    seedId: "akai_shi.red_death",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q4_red_death", sealRequired: 4 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
