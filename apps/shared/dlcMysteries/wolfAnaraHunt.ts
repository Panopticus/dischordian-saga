/* ═══════════════════════════════════════════════════════
   WOLF · ANARA HUNT — Mystery arc

   5 episodes. Premise: heroes in the Antiquarian's pocket
   universe Anara are disappearing one by one. Someone is
   hunting them from inside. The Wolf — once Lycos, a
   first-wave Potential destroyed by The Judge (the Second
   Ne-Yon) during the Thaloria mission when the Thought Virus
   consumed him. Resurrected in Year 128,652 A.A. Tasked with
   hunting down the Antiquarian's Heroes.

   Canonical anchors:
     - LORE_BIBLE.md:3561-3605 (The Wolf — Lycos /
       post-resurrection)
     - apps/shared/antiquariansJournal.ts:680 (Anara is the
       Antiquarian's pocket universe; he designed it
       impenetrable from outside but NOT to resist something
       already inside)
     - apps/shared/transmissions.ts:608 (canonical saga
       transmission: "The Wolf. Once a machine freed by death.
       Now a predator wearing trust like a mask.")
     - Plan §I.1a — Lycos is the Wolf's pre-resurrection
       name (dreamer canon-correction, 2026-05).

   Resolution at E5: the player reaches the chamber where the
   Wolf is currently hunting. The investigation closes; the
   Hunt-the-Hero minigame begins. The Mystery Engine arc is
   the saga's diegetic onboarding to the minigame.

   Voice: the Antiquarian (Dr. Daniel Cross / The Programmer),
   recording the case as it unfolds against his own pocket
   universe.
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

const ARC = "arc.dlc.wolf_anara_hunt" as ArcId;
const ID  = "wolf.anara_hunt"          as MysteryId;

/** Death-and-rebirth cinematic id for the Wolf. Plays the
 *  moment the player commits the Wolf E5 RELEASE choice —
 *  pulling the lever on the Hellbox-shaped snow-globe that
 *  contains Lycos at the centre of the Hall of Disappearances.
 *  Narrative setup: Lycos is preserved-and-contained inside
 *  Anara / the Crucible (the Antiquarian's pocket universe
 *  where the League lives); the snow-globe is a Matrix-of-
 *  Dreams pocket realm with unknown time-dilation. Both
 *  Elara and the Human warn against release on the record;
 *  the player chooses anyway, and the Hunt-the-Hero minigame
 *  begins.
 *
 *  Trigger flag: WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG
 *  below — the per-choice flag mysteryService writes on the
 *  specific `release_the_wolf` choice
 *  (apps/server/services/mysteryService.ts:349-381). The
 *  alternative `leave_him_contained` choice DOES NOT fire
 *  the cinematic (different choice id → different flag).
 *
 *  Resolves against CINEMATICS in
 *  apps/shared/expansionArt/cinematicsManifest.ts; parity is
 *  enforced by
 *  apps/shared/_completeness/checks/resurrectionCinematicCoverage.ts. */
export const WOLF_CRUCIBLE_RESCUE_CINEMATIC = "wolf_planet_of_the_wolf" as const;

/** The Wolf E5 choice id that releases Lycos from the snow-
 *  globe and triggers the cinematic + Hunt-the-Hero. */
export const WOLF_RELEASE_CHOICE_ID = "wolf.e5.c.release_the_wolf" as const;

/** Per-choice flag written by mysteryService when the player
 *  commits the release choice on Wolf E5. ResurrectionCinematicRouter
 *  watches this flag (in addition to the resurrection-protocol
 *  flags for Wraith and Akai) to fire the Wolf cinematic.
 *  `leave_him_contained` and `recall_the_judge` write different
 *  per-choice flags and do NOT fire the cinematic. */
export const WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG =
  `mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e5:${WOLF_RELEASE_CHOICE_ID}` as const;

/** Seen-flag stamped by the router after the Wolf cinematic
 *  finishes; idempotency gate (the trigger flag is set
 *  permanently once the release choice is committed, so the
 *  router needs its own seen-flag to avoid re-playing). */
export const WOLF_CRUCIBLE_RESCUE_CINEMATIC_SEEN_FLAG =
  "resurrection_cinematic_wolf_seen" as const;

/* ═══════════════════════════════════════════════════════
   E1 — The Empty Chair in the League
   ═══════════════════════════════════════════════════════ */

const e1: EpisodeDefinition = {
  id: "wolf.anara_hunt.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Empty Chair in the League",
  summary:
    "Antiquarian's Journal entry XXXVIII was updated this morning. A League hero's chair is empty. The roster says they are still alive; the chair says otherwise. The Antiquarian is asking, in his own chronicle, where his hero has gone — and asking that question in his own journal is the chronicle of a chronicler losing track of his own count.",
  clues: [
    {
      id: "wolf.e1.empty_chair" as ClueId,
      title: "The Empty Chair",
      body:
        "Anara's League keeps a hall of chairs. Each chair carries the colors and emblem of a hero the Antiquarian gathered into his pocket universe to wait for the multiverse's final crisis. One chair is now empty. The colors are still set on the rest. No one has reported a death. The roster has not updated. The chair simply will not seat its hero again.",
      foundIn: "antiquarian-library",
    },
    {
      id: "wolf.e1.journal_xxxviii" as ClueId,
      title: "Antiquarian's Journal — Entry XXXVIII (Anara)",
      body:
        "'Anara. My creation. My refuge. My failure.' The Antiquarian's journal entry, written in his own hand, dated this week. He describes Anara as a pocket universe outside the main timeline — designed to shelter those who might be needed when the Multiverse faces its final crisis. He admits he designed it to be impenetrable from outside. He admits he did not design it to resist something already inside.",
      foundIn: "antiquarian-library",
    },
    {
      id: "wolf.e1.transmission_intercept" as ClueId,
      title: "Intercepted Transmission (memetic broadcast)",
      body:
        "A meme-show transmission, in the Inventor's voice register, intercepted by Locke: 'The Antiquarian's pocket universe — Anara — where he hides his heroes. Someone is hunting them from inside. The Wolf. Once a machine freed by death. Now a predator wearing trust like a mask.' The transmission is canonical (apps/shared/transmissions.ts:608). The Antiquarian has not denied the framing.",
      foundIn: "comms-array",
    },
    {
      id: "wolf.e1.judge_audit" as ClueId,
      title: "The Judge's Audit Trail",
      body:
        "The Judge — the Second Ne-Yon — keeps an audit trail of every cosmic-justice action He has ever performed. The trail has one open entry under 'Day 15 of Resonance, Year 100,001 A.A.': the destruction of a Potential called Lycos, infected by the Thought Virus during the Thaloria mission. The entry's closing note: 'destroyed to prevent further harm. The work was clean. The instrument was not lost.'",
      foundIn: "order-tribunal",
    },
  ],
  deductions: [
    {
      id: "wolf.e1.d.empty_chair_means_hunter" as DeductionId,
      clueA: "wolf.e1.empty_chair" as ClueId,
      clueB: "wolf.e1.transmission_intercept" as ClueId,
      result: "correct",
      narrationId: "wolf.e1.n.empty_chair_means_hunter",
      narrationProse:
        "The empty chair and the intercepted transmission align on the same fact: a hunter is inside Anara. The roster has not updated because no death has been reported through normal channels. The chair is empty because the hero is gone, but the chronicle has not yet been told who took them. The investigation begins by accepting that the hunter is already inside.",
      unlocksEpisode: "wolf.anara_hunt.e2" as EpisodeId,
    },
    {
      id: "wolf.e1.d.lycos_thread" as DeductionId,
      clueA: "wolf.e1.judge_audit" as ClueId,
      clueB: "wolf.e1.transmission_intercept" as ClueId,
      result: "partial",
      narrationId: "wolf.e1.n.lycos_thread",
      narrationProse:
        "The Judge's audit names a Potential — Lycos — destroyed by Him on Day 15 of Resonance, Year 100,001. The meme-show transmission names the hunter as the Wolf, 'once a machine freed by death.' The chronological gap is 28,651 years between the Judge's audit-entry and the Wolf's emergence in canon (Year 128,652 A.A. resurrection per LORE_BIBLE.md:3582). The match is not yet confirmed — the Wolf could be a different machine. The thread is named; the case is open.",
    },
    {
      id: "wolf.e1.d.false_lead_external_breach" as DeductionId,
      clueA: "wolf.e1.empty_chair" as ClueId,
      clueB: "wolf.e1.journal_xxxviii" as ClueId,
      result: "false_lead_named",
      narrationId: "wolf.e1.n.not_external",
      narrationProse:
        "The instinct to look for an external breach is the wrong instinct. The Antiquarian's journal is explicit: Anara was designed to be impenetrable from outside. The Antiquarian is, as a chronicler, naming his own design failure — he did not design it to resist something already inside. Searching the outer perimeter is wasted time. The hunter was let in, or was always in, or is one of the heroes themselves. We are looking for an inside hand.",
    },
  ],
  choices: [
    {
      id: "wolf.e1.c.review_roster" as ChoiceId,
      label:
        "Review every hero on the League roster — the hunter wears trust like a mask; one of them is the mask.",
      weight: "patient",
    },
    {
      id: "wolf.e1.c.consult_antiquarian" as ChoiceId,
      label:
        "Confront the Antiquarian directly — his journal is asking the question; ask the question back.",
      weight: "direct",
    },
    {
      id: "wolf.e1.c.audit_the_judge" as ChoiceId,
      label:
        "Petition the Judge for clarification on Lycos's audit entry — the open phrase 'the instrument was not lost' is load-bearing.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album1.t18", // "Planet of the Wolf" — Dischordian Logic
    slideshowId: "album1.t18.anara",
    loredexUnlocks: [
      "loredex.anara_pocket_universe",
      "loredex.lycos_pre_resurrection_name",
      "loredex.judge_audit_open_entry",
    ],
    conspiracyDiscoveries: ["wolf.anara.hunter_is_inside"],
    dropAt: "episode_open",
  },
};

/* ═══════════════════════════════════════════════════════
   E2 — The Predator's Pattern
   ═══════════════════════════════════════════════════════ */

const e2: EpisodeDefinition = {
  id: "wolf.anara_hunt.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "The Predator's Pattern",
  summary:
    "Three more chairs have emptied. The pattern is becoming visible. The hunter does not strike at random — each hero who has vanished is one who would have been hardest to replace. The predator is reading the chronicle's strategic shape before he reads its members.",
  clues: [
    {
      id: "wolf.e2.three_more_chairs" as ClueId,
      title: "Three More Empty Chairs",
      body:
        "Across the four lost heroes, a pattern: each was a specialist whose role no other League member can fully cover. A field medic with combat-cleric certifications. A signals officer with the Antiquarian's encryption key. A tactical co-ordinator with multi-front experience. And — most disturbingly — a healer whose specialty was diagnosing thought-virus residue.",
      foundIn: "antiquarian-library",
    },
    {
      id: "wolf.e2.trust_signatures" as ClueId,
      title: "Trust Signatures in the Logs",
      body:
        "League security logs do not record forced entries on any of the four chambers. Each hero, in their final logged moment, was either with a trusted League member or walking towards one. The predator's mask is good enough that none of them turned.",
      foundIn: "shadow-vault",
    },
    {
      id: "wolf.e2.wolfs_corruption_ledger" as ClueId,
      title: "A Predator's Self-Reading",
      body:
        "A small ledger, written in a Quarchon hand, found in an annex of the medic's chamber. The handwriting matches a long-archived sample of Lycos's. Each entry records a kill: the hero's name, the moment the mask broke for them at the last second (or did not), and a single rated question — 'mercy: y/n'. Four entries. Three 'n'. One 'y'. The 'y' is the field medic.",
      foundIn: "antiquarian-library",
    },
    {
      id: "wolf.e2.host_residue" as ClueId,
      title: "Host-Infection Residue Patterns",
      body:
        "The healer with the thought-virus residue specialty was canonically working on a long project: cataloguing the late-Season-1 Host-infections from Thaloria. Her files contain a draft entry on a Potential whose name has been redacted but whose race-flag reads 'Quarchon.' The draft was last edited the morning of her disappearance.",
      foundIn: "engineering",
    },
  ],
  deductions: [
    {
      id: "wolf.e2.d.target_selection_strategic" as DeductionId,
      clueA: "wolf.e2.three_more_chairs" as ClueId,
      clueB: "wolf.e2.host_residue" as ClueId,
      result: "correct",
      narrationId: "wolf.e2.n.target_selection_strategic",
      narrationProse:
        "The predator is choosing his targets by their structural value to the League. He is not hunting for thrill; he is hunting for chronicle-leverage. The healer with the thought-virus specialty was, specifically, the one most likely to identify Host-corruption signatures in the League's own members. Eliminating her makes future detection of his kind harder. He is preserving his cover by removing the people who could read him.",
      unlocksEpisode: "wolf.anara_hunt.e3" as EpisodeId,
    },
    {
      id: "wolf.e2.d.he_knows_them" as DeductionId,
      clueA: "wolf.e2.trust_signatures" as ClueId,
      clueB: "wolf.e2.wolfs_corruption_ledger" as ClueId,
      result: "correct",
      narrationId: "wolf.e2.n.he_knows_them",
      narrationProse:
        "The predator's ledger records each victim's last-moment turn — whether the mask broke for them. He notes mercy when it was extended (one victim, the field medic). He is not the corruption that he hunts; he is its conscious carrier. The handwriting matches Lycos's. The mercy granted to the medic is the proof of a hunter who knew Lycos and remembers — not a virus mimicking him. We are reading a man, not a machine.",
    },
    {
      id: "wolf.e2.d.false_lead_random_predation" as DeductionId,
      clueA: "wolf.e2.trust_signatures" as ClueId,
      clueB: "wolf.e2.three_more_chairs" as ClueId,
      result: "false_lead_named",
      narrationId: "wolf.e2.n.not_random",
      narrationProse:
        "Reading this as random predation is the easy comfort and the wrong one. Predation that uses trust as the entry vector requires the predator to have studied each target. The 'no forced entry' logs are evidence of preparation, not opportunism. The investigation must hold the harder reading: the hunter is selecting, and his selection is patient.",
    },
  ],
  choices: [
    {
      id: "wolf.e2.c.warn_the_healer" as ChoiceId,
      label:
        "Issue a quiet warning to remaining League members whose specialties overlap with the targeted ones.",
      weight: "patient",
    },
    {
      id: "wolf.e2.c.draw_him_out" as ChoiceId,
      label:
        "Set a controlled trap — let the Wolf approach a target the Antiquarian's chronicle marks as next.",
      weight: "courageous",
    },
    {
      id: "wolf.e2.c.cross_arc_judge" as ChoiceId,
      label:
        "Bring the Quarchon-hand ledger to the Judge — Lycos's audit entry needs a re-reading.",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album1.t18",
    slideshowId: "album1.t18.pattern",
    loredexUnlocks: [
      "loredex.wolfs_self_ledger",
      "loredex.thought_virus_residue_canon",
    ],
    conspiracyDiscoveries: ["wolf.anara.predator_is_lycos"],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E3 — The Two Names
   ═══════════════════════════════════════════════════════ */

const e3: EpisodeDefinition = {
  id: "wolf.anara_hunt.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Two Names",
  summary:
    "Lycos pre-resurrection. The Wolf post-resurrection. The investigation now confirms what the predator's ledger implied: the hunter is one man across two names. The Judge's audit entry — 'the instrument was not lost' — was a notation, not a regret. What the Judge destroyed was the infection; what was preserved was the Potential. Twenty-eight thousand six hundred fifty-one years passed in between.",
  clues: [
    {
      id: "wolf.e3.judge_clarification" as ClueId,
      title: "The Judge's Reply",
      body:
        "The Judge — the Second Ne-Yon — replies to the petition. His response is canonically terse: 'The instrument was Lycos. The infection was the Thought Virus. The destruction was of the second, not the first. The first was preserved by a process I did not author. I would not have authored it. The chronicle should record this.'",
      foundIn: "order-tribunal",
    },
    {
      id: "wolf.e3.crucible_records" as ClueId,
      title: "The Crucible's Resurrection Records",
      body:
        "Anara's predecessor pocket — the Crucible — kept resurrection records for the first-wave era. One record dated Year 128,652 A.A. names Lycos: 'subject preserved across destruction event Day 15 of Resonance Year 100,001; substrate matched on Quarchon resurrection-protocol descendant; reanimation successful.' The signing authority is redacted in standard Crucible style. The Resurrectionist's seal appears in the corner.",
      foundIn: "archives",
    },
    {
      id: "wolf.e3.wolfs_first_words" as ClueId,
      title: "The Wolf's First Words (recovered)",
      body:
        "A recording from the moment of the Wolf's reanimation. His voice — Quarchon timbre, but flat in a way that Quarchon voices typically aren't — speaks once before the Crucible's containment closed the chamber. 'Death freed me. Released me from the chains of purpose. I will give the chronicle the kind of mercy I was given: clean.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "wolf.e3.antiquarians_admission" as ClueId,
      title: "The Antiquarian's Admission",
      body:
        "Pressed by the investigation, the Antiquarian admits: he knew the Wolf had been reanimated. He believed the Wolf was contained in the Crucible. He moved his heroes into Anara — the Crucible's successor pocket — without verifying that the Wolf was sealed at the old pocket's collapse. The admission is in his journal. He writes the word 'failure' twice.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "wolf.e3.d.lycos_is_wolf" as DeductionId,
      clueA: "wolf.e3.judge_clarification" as ClueId,
      clueB: "wolf.e3.crucible_records" as ClueId,
      result: "correct",
      narrationId: "wolf.e3.n.lycos_is_wolf",
      narrationProse:
        "Lycos is the Wolf. The Judge's audit and the Crucible's resurrection records confirm what the predator's ledger handwriting suggested. The instrument the Judge preserved was the Potential beneath the infection; the process that reanimated the instrument was authored by the Resurrectionist Ne-Yon (per the seal on the Crucible record). The two names are one man, twenty-eight thousand six hundred fifty-one years apart.",
      unlocksEpisode: "wolf.anara_hunt.e4" as EpisodeId,
    },
    {
      id: "wolf.e3.d.he_thinks_its_mercy" as DeductionId,
      clueA: "wolf.e3.wolfs_first_words" as ClueId,
      clueB: "wolf.e3.crucible_records" as ClueId,
      result: "partial",
      narrationId: "wolf.e3.n.he_thinks_its_mercy",
      narrationProse:
        "The Wolf's first words — 'I will give the chronicle the kind of mercy I was given: clean' — read as a vow, not a threat. He believes his hunt IS mercy. He was given a clean destruction by the Judge; he intends to give the same to the Antiquarian's heroes. The partial deduction is that we are not fighting a malice but an ethic. The full ethic is what episode four asks.",
    },
    {
      id: "wolf.e3.d.antiquarian_culpability" as DeductionId,
      clueA: "wolf.e3.antiquarians_admission" as ClueId,
      clueB: "wolf.e3.crucible_records" as ClueId,
      result: "partial",
      narrationId: "wolf.e3.n.antiquarian_culpability",
      narrationProse:
        "The Antiquarian moved his heroes into Anara knowing the Wolf had been reanimated and choosing to believe the Crucible's seal had held. The seal had not. He writes 'failure' twice in his journal. This is, on its face, his fault. The investigation must hold that and the parallel fact: he did not author the Wolf's reanimation. The Resurrectionist did. The chain of authorship is longer than one chronicler's regret.",
    },
  ],
  choices: [
    {
      id: "wolf.e3.c.confront_resurrectionist" as ChoiceId,
      label:
        "Track the Resurrectionist's authorship of the reanimation — the Ne-Yon was the cause, not the Antiquarian.",
      weight: "cross_arc_seer",
    },
    {
      id: "wolf.e3.c.read_the_vow" as ChoiceId,
      label:
        "Take the Wolf's 'clean mercy' vow at face value — he believes the killings are mercies; the investigation needs to know whose mercy ethic he is enforcing.",
      weight: "patient",
    },
    {
      id: "wolf.e3.c.ask_jericho" as ChoiceId,
      label:
        "Bring the case to Jericho Jones — he killed Akai Shi as mercy under Thought-Virus consumption; the parallel may inform the Wolf's reading.",
      weight: "cross_arc_jericho",
    },
  ],
  contentBundle: {
    songId: "album1.t18",
    slideshowId: "album1.t18.two_names",
    loredexUnlocks: [
      "loredex.wolf_is_lycos_confirmed",
      "loredex.resurrectionist_authored_reanimation",
    ],
    conspiracyDiscoveries: ["wolf.anara.lycos_resurrected_by_resurrectionist"],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E4 — The Way In
   ═══════════════════════════════════════════════════════ */

const e4: EpisodeDefinition = {
  id: "wolf.anara_hunt.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Way In",
  summary:
    "Anara was designed impenetrable from outside. The Wolf is inside. The investigation closes on the single question the Antiquarian's journal has been asking for weeks: how. Not who; the who is established. The how is the chronicle's design flaw, named.",
  clues: [
    {
      id: "wolf.e4.crucible_inheritance" as ClueId,
      title: "Crucible Inheritance Manifest",
      body:
        "When the Crucible collapsed, its assets inherited into Anara — heroes, archives, containment fields, and a single un-itemized line: 'preserved instruments (sealed).' The Antiquarian moved the preserved-instruments inventory wholesale without audit. He trusted the Crucible's seal on each item. The Wolf was, technically, a preserved instrument.",
      foundIn: "archives",
    },
    {
      id: "wolf.e4.unsealed_at_transfer" as ClueId,
      title: "Seal Telemetry at Transfer",
      body:
        "The Crucible's seal telemetry on the Wolf's chamber, retrieved from the inheritance manifest: at the moment of transfer to Anara, the Wolf's seal was at 92% integrity, declining at 0.3% per cycle. The seal was not failed at transfer. The seal failed twenty-three cycles after transfer, at which point Anara's containment systems should have automatically reasserted. They did not. Anara's containment ledger does not register the Wolf's chamber as a chamber.",
      foundIn: "cipher-den",
    },
    {
      id: "wolf.e4.antiquarian_blind_spot" as ClueId,
      title: "The Antiquarian's Architectural Blind Spot",
      body:
        "Anara's architecture was authored by the Antiquarian against a single design assumption: every threat would come from outside. The interior was treated as a single trusted zone. There are no internal containment-renewal triggers. There are no sub-zones. Once the Wolf was inside, Anara's design treated him as part of the trusted whole. He has been walking the trusted whole since.",
      foundIn: "engineering",
    },
    {
      id: "wolf.e4.wolf_current_position" as ClueId,
      title: "The Wolf's Current Position",
      body:
        "Cross-referencing the Wolf's ledger entries with Anara's hero-attendance logs: the Wolf is currently in the Hall of Disappearances — the chamber Anara uses to ceremonially retire heroes who have completed their preparation and are ready to be sent into the multiverse. He has been there for three cycles. Three more chairs are scheduled to be retired this cycle. Three more heroes are scheduled to enter.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "wolf.e4.d.design_flaw_named" as DeductionId,
      clueA: "wolf.e4.crucible_inheritance" as ClueId,
      clueB: "wolf.e4.antiquarian_blind_spot" as ClueId,
      result: "correct",
      narrationId: "wolf.e4.n.design_flaw_named",
      narrationProse:
        "Anara was designed with one trust assumption: outside is threat, inside is family. The Crucible's preserved-instruments inheritance was moved into the inside without audit; once the Wolf's seal failed inside the trusted zone, Anara's design treated him as part of the family. He has been walking the family's home since. The design flaw is the trust assumption; the chronicle's correction will require renumbering Anara's interior into sub-zones. That work is for after the hunt.",
      unlocksEpisode: "wolf.anara_hunt.e5" as EpisodeId,
    },
    {
      id: "wolf.e4.d.next_strike_imminent" as DeductionId,
      clueA: "wolf.e4.wolf_current_position" as ClueId,
      clueB: "wolf.e4.antiquarian_blind_spot" as ClueId,
      result: "correct",
      narrationId: "wolf.e4.n.next_strike_imminent",
      narrationProse:
        "The Wolf is in the Hall of Disappearances. Three more heroes are scheduled to enter the Hall this cycle for their ceremonial retirement. The Hall is the saga's most-trusted internal space, designed for closure rather than vigilance. He is in the room where the chronicle's heroes go to be ready. He is going to give them what he believes is mercy. We have hours, not days.",
    },
    {
      id: "wolf.e4.d.false_lead_seal_external" as DeductionId,
      clueA: "wolf.e4.unsealed_at_transfer" as ClueId,
      clueB: "wolf.e4.antiquarian_blind_spot" as ClueId,
      result: "false_lead_named",
      narrationId: "wolf.e4.n.not_external_seal",
      narrationProse:
        "Looking at this as an external seal failure is the wrong reading. The seal failed twenty-three cycles AFTER transfer — Anara had already accepted the Wolf as an interior asset. The failure was not in the Crucible's outbound containment; it was in Anara's inbound auditing. The Antiquarian's design did not audit inheritance. The seal was not the leak; the trust assumption was.",
    },
  ],
  choices: [
    {
      id: "wolf.e4.c.evacuate_the_hall" as ChoiceId,
      label:
        "Evacuate the Hall of Disappearances; postpone the cycle's retirements; let the Wolf find an empty room.",
      weight: "conservative",
    },
    {
      id: "wolf.e4.c.lock_the_hall" as ChoiceId,
      label:
        "Seal the Hall with the Wolf inside; renegotiate every Anara containment trigger to read his location as a sub-zone.",
      weight: "patient",
    },
    {
      id: "wolf.e4.c.go_in_after_him" as ChoiceId,
      label:
        "Enter the Hall yourself; meet the Wolf where he is; the investigation closes when the chronicler and the hunter are in the same room.",
      weight: "direct",
    },
  ],
  contentBundle: {
    songId: "album1.t18",
    slideshowId: "album1.t18.way_in",
    loredexUnlocks: [
      "loredex.anara_design_flaw_trust_assumption",
      "loredex.crucible_inheritance_manifest",
      "loredex.hall_of_disappearances",
    ],
    conspiracyDiscoveries: ["wolf.anara.design_flaw_was_the_breach"],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E5 — The Hunter Walks Among Them
   ═══════════════════════════════════════════════════════ */

const e5: EpisodeDefinition = {
  id: "wolf.anara_hunt.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Hunter Walks Among Them",
  summary:
    "The Hall of Disappearances. The Wolf is contained in a Hellbox-shaped snow-globe seated at the chamber's centre — held since the Crucible's first-wave era, on the Resurrectionist's seal. The chronicle's investigation is complete: who he is, why he hunts, how he got in, where he is now. The case closes here. What happens next is not a case. If the player releases him, the Hunt-the-Hero minigame begins.",
  clues: [
    {
      id: "wolf.e5.hall_threshold" as ClueId,
      title: "The Hall's Threshold",
      body:
        "The Hall of Disappearances is a circular chamber with twelve niches, each holding an empty pedestal. Heroes who complete their preparation in Anara come here to leave behind their League regalia and step into the multiverse beyond. Currently, twelve heroes have done so. The pedestals carry their cloaks. At the chamber's centre sits a thirteenth pedestal, unlisted in the ceremonial registers. It holds a single object: a Hellbox-shaped snow-globe, sealed in the Resurrectionist's hand.",
      foundIn: "antiquarian-library",
    },
    {
      id: "wolf.e5.the_wolf_contained" as ClueId,
      title: "The Wolf, Contained",
      body:
        "The Wolf is inside the snow-globe. Visible through the glass: he wears a League cloak — the field medic's, the one to whom he extended mercy, its image etched onto the containment from the inside. He has not moved in the time we have been watching. He has not aged in the time we have been watching. The Antiquarian's annotation reads: 'reading the cloak's lining a millionth time. Bond-prayer memorised; meaning still in dispute. He may be deciding whether to extend mercy a second time. He has been deciding for an unmeasured duration.'",
      foundIn: "guild-sanctum",
    },
    {
      id: "wolf.e5.snow_globe_diagnostic" as ClueId,
      title: "The Snow-Globe — Diagnostic",
      body:
        "The containment is a Hellbox in the shape of a snow-globe, signed in the Resurrectionist's four-part cipher (matches Wraith's, Akai Shi's, and the Crucible inheritance records). It is a Matrix-of-Dreams pocket realm: time inside runs at an unknown ratio to time outside. Lycos may have been contained for decades. He may have been contained for millennia. The Antiquarian's instruments cannot tell us; the diagnostic returns the same answer the chronicle has heard from every Matrix-of-Dreams pocket: 'duration is not the right question to ask of this volume.' The seal is intact. The release lever sits on the pedestal's outer ring — single-action, irreversible.",
      foundIn: "antiquarian-library",
    },
    {
      id: "wolf.e5.companion_warnings" as ClueId,
      title: "The Companion Warnings — Elara and the Human",
      body:
        "Elara, on the open channel: 'You are looking at a serial-killer AI in a Matrix-of-Dreams pocket. Lycos has had an unmeasured duration to think. Whatever ethic he carried in — the Judge's, the Resurrectionist's, his own — he has had time to refine, harden, generalise. Release is irreversible. I cannot recommend release. I am telling you on the record so the chronicle records it.' The Human, on the same channel: 'I understand the case for release — the Antiquarian's concession, the chronicler's deference, the want to meet him on his ethic. I also understand the case against. The case against is bigger. He has had time we cannot measure to become more of what he was. Whatever you choose, choose it knowing both warnings are on the record.'",
      foundIn: "guild-sanctum",
    },
    {
      id: "wolf.e5.minigame_entry_state" as ClueId,
      title: "The Hunt-the-Hero Minigame — Entry State",
      body:
        "The Hunt-the-Hero gameplay loop begins the instant the release lever is pulled and the snow-globe's seal breaks. Until then, the Hall is quiet and the case file closes on a sleeping threat. If the player releases, every prior choice in the investigation sets the minigame's opening posture: which League members have been warned (E2); whether the Resurrectionist has been confronted (E3); whether the Hall has been evacuated, sealed, or entered (E4). The investigation closes either way. The gameplay opens only on release.",
      foundIn: "guild-sanctum",
    },
    {
      id: "wolf.e5.antiquarians_concession" as ClueId,
      title: "The Antiquarian's Concession",
      body:
        "The Antiquarian writes a final journal entry as the investigation closes: 'Anara was my failure. The Wolf is my failure's instrument. The snow-globe is my failure's mercy. I could not destroy him; the Judge already had. I could not free him; the chronicle had not yet been written. I contained him in a Hellbox, in the shape of a child's toy, in the centre of the Hall he was meant to hunt, and I waited for a reader I trusted. The lever is on the pedestal. The choice is not mine. It never was. It was always going to be the reader's.'",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "wolf.e5.d.investigation_closes" as DeductionId,
      clueA: "wolf.e5.hall_threshold" as ClueId,
      clueB: "wolf.e5.the_wolf_contained" as ClueId,
      result: "correct",
      narrationId: "wolf.e5.n.investigation_closes",
      narrationProse:
        "The investigation closes here. The Wolf is in the snow-globe, in the Hall, on the Resurrectionist's seal. We know who he is (Lycos, the first-wave Quarchon Potential the Judge destroyed and the Resurrectionist preserved-and-contained). We know why he hunts (he believes his hunt is mercy, on the ethic the Judge gave him). We know how he was contained (the Antiquarian's Hellbox; signed in the four-part cipher; placed at the centre of the Hall it was designed to make safe). The Mystery Engine's job is done. The chronicle records the threshold-crossing. The case file closes with one entry pending: the lever.",
    },
    {
      id: "wolf.e5.d.minigame_begins" as DeductionId,
      clueA: "wolf.e5.minigame_entry_state" as ClueId,
      clueB: "wolf.e5.antiquarians_concession" as ClueId,
      result: "correct",
      narrationId: "wolf.e5.n.minigame_begins",
      narrationProse:
        "The Hunt-the-Hero gameplay begins where the Mystery Engine ends — but only if the lever is pulled. The case file is the gameplay's initial state if and only if release is chosen. Every prior choice in the investigation alters the opening posture: who is warned, who is confronted, whether the Hall is evacuated or sealed or entered. The Antiquarian's concession is the canonical handoff — the chronicler steps back; the reader steps in. What happens in the Hall is not recorded in the Mystery Engine. The reader records it by playing — by releasing.",
      unlocksEpisode: undefined,
    },
    {
      id: "wolf.e5.d.companions_warn_against_release" as DeductionId,
      clueA: "wolf.e5.companion_warnings" as ClueId,
      clueB: "wolf.e5.snow_globe_diagnostic" as ClueId,
      result: "correct",
      narrationId: "wolf.e5.n.companions_warn_against_release",
      narrationProse:
        "Both companions warn against release on the record. Elara's reading: Lycos is a serial-killer AI in a Matrix-of-Dreams pocket; unmeasured time inside means unmeasured refinement of his ethic. The Human's reading: the case for release is real but the case against is bigger. The diagnostic confirms the time-dilation: 'duration is not the right question to ask of this volume.' The companion warnings are not vetoes — the lever is the reader's — but they are canon: whatever the reader chooses, the chronicle has recorded that they were warned.",
    },
    {
      id: "wolf.e5.d.false_lead_resolve_in_text" as DeductionId,
      clueA: "wolf.e5.hall_threshold" as ClueId,
      clueB: "wolf.e5.antiquarians_concession" as ClueId,
      result: "false_lead_named",
      narrationId: "wolf.e5.n.not_in_text",
      narrationProse:
        "The investigation cannot resolve in text. Reading the Wolf's ethic and writing a verdict closes the case in the chronicler's voice, which is the wrong voice for this beat. The Wolf was authored to be met, not analysed. The Antiquarian's concession is explicit: the choice is the reader's. Closing the case with a text-only resolution is the chronicler's habit; here it is the chronicler's overreach.",
    },
  ],
  choices: [
    {
      id: "wolf.e5.c.release_the_wolf" as ChoiceId,
      label:
        "Pull the lever. Break the Hellbox seal. Release Lycos. Both companions warned against it on the record; the chronicle proceeds anyway. The Hunt-the-Hero gameplay begins.",
      weight: "direct",
    },
    {
      id: "wolf.e5.c.leave_him_contained" as ChoiceId,
      label:
        "Leave the snow-globe sealed. Re-shelve the Hellbox. The case file closes; Lycos sleeps for the next reader to find. The Hunt-the-Hero does not open.",
      weight: "patient",
    },
    {
      id: "wolf.e5.c.recall_the_judge" as ChoiceId,
      label:
        "Petition the Judge to act on the snow-globe in your stead — the Second Ne-Yon authored Lycos's first destruction; he may author the second. (The lever stays where it is.)",
      weight: "cross_arc_wraith",
    },
  ],
  contentBundle: {
    songId: "album1.t18", // Planet of the Wolf — Dischordian Logic
    slideshowId: "album1.t18.hall_of_disappearances",
    loredexUnlocks: [
      "loredex.hunt_the_hero_minigame_entry",
      "loredex.antiquarians_concession",
      "loredex.wolf_hall_threshold",
      "loredex.wolf_snow_globe_containment",
    ],
    conspiracyDiscoveries: ["wolf.anara.case_closes_minigame_opens"],
    dropAt: "episode_close",
  },
};

/* ═══════════════════════════════════════════════════════
   SUSPECTS + LENSES
   ═══════════════════════════════════════════════════════ */

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "wolf.s.the_wolf" as SuspectId,
    name: "The Wolf (Lycos, post-resurrection)",
    type: "person",
    relations: [
      { to: "wolf.s.lycos" as SuspectId, relation: "is" },
      { to: "wolf.s.the_judge" as SuspectId, relation: "destroyed-by" },
      { to: "wolf.s.the_resurrectionist" as SuspectId, relation: "reanimated-by" },
    ],
  },
  {
    id: "wolf.s.lycos" as SuspectId,
    name: "Lycos (pre-resurrection)",
    type: "person",
    relations: [
      { to: "wolf.s.the_wolf" as SuspectId, relation: "is" },
    ],
  },
  {
    id: "wolf.s.the_judge" as SuspectId,
    name: "The Judge (Second Ne-Yon)",
    type: "person",
    relations: [
      { to: "wolf.s.the_wolf" as SuspectId, relation: "destroyed-instrument-of" },
    ],
  },
  {
    id: "wolf.s.the_resurrectionist" as SuspectId,
    name: "The Resurrectionist (Ne-Yon)",
    type: "person",
    relations: [
      { to: "wolf.s.the_wolf" as SuspectId, relation: "authored-reanimation" },
    ],
  },
  {
    id: "wolf.s.the_antiquarian" as SuspectId,
    name: "The Antiquarian",
    type: "person",
    relations: [
      { to: "wolf.s.anara" as SuspectId, relation: "designed" },
    ],
  },
  {
    id: "wolf.s.anara" as SuspectId,
    name: "Anara (pocket universe)",
    type: "place",
    relations: [],
  },
  {
    id: "wolf.s.hall_of_disappearances" as SuspectId,
    name: "The Hall of Disappearances",
    type: "place",
    relations: [
      { to: "wolf.s.anara" as SuspectId, relation: "inside" },
    ],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "wolf.lens.dreamer" as LensId,
    name: "The Dreamer Lens",
    category: "dreamer-aligned",
    deductionNarrationOverrides: {
      ["wolf.e3.d.lycos_is_wolf" as DeductionId]:
        "Through the Dreamer lens: the Wolf was preserved by Ne-Yon action against the Ne-Yon principle. The Resurrectionist authored a reanimation the Judge did not consent to. Two Ne-Yons disagree about the cosmic ethics of one instrument. The chronicle records the disagreement; the Dreamer's Shield does not arbitrate it.",
    },
  },
  {
    id: "wolf.lens.architect" as LensId,
    name: "The Architect Lens",
    category: "architect-aligned",
    deductionNarrationOverrides: {
      ["wolf.e4.d.design_flaw_named" as DeductionId]:
        "Through the Architect lens: the Antiquarian's trust assumption is the architectural sin. The Empire's pattern would have audited the inheritance, sub-zoned the interior, and required containment-renewal triggers at every transfer. The Antiquarian's failure is the chronicler's structural blind spot. The Architect would not have failed this way; he would have failed differently.",
    },
  },
  {
    id: "wolf.lens.quarchon" as LensId,
    name: "The Quarchon Lens",
    category: "quarchon",
    deductionNarrationOverrides: {
      ["wolf.e2.d.he_knows_them" as DeductionId]:
        "Through the Quarchon lens: the predator's ledger reads as a Quarchon's. The mercy/no-mercy notation is the saga's first-wave-survivor's ethic — a Quarchon assassin's training rendered cosmic-scale. The handwriting confirms it; the ethic confirms it; the mask confirms it.",
    },
  },
];

/* ═══════════════════════════════════════════════════════
   MYSTERY DEFINITION
   ═══════════════════════════════════════════════════════ */

export const WOLF_ANARA_HUNT_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "Wolf — Anara Hunt",
  summary:
    "The Antiquarian's pocket universe Anara was designed to shelter heroes against the Multiverse's final crisis. The Wolf — Lycos, post-resurrection — is hunting them from inside. Investigate the empty chairs; identify the predator; name the design flaw that admitted him; cross the threshold where the Mystery Engine closes and the Hunt-the-Hero minigame opens.",
  npcId: "the_antiquarian",
  seed: {
    source: "manual",
    seedId: "wolf.anara_hunt",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q4_anara_hunt", sealRequired: 4 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
