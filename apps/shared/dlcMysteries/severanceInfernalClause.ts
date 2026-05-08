/* ═══════════════════════════════════════════════════════
   SEVERANCE · INFERNAL CLAUSE — Y2-Q2 mini-DLC mystery arc

   5 episodes. Premise: Severance Year 2. Zyr'Koth, of the
   Hierarchy of the Damned, appears in person at the Nilmorg
   ceremony to claim a bound companion under a clause hidden
   in past DMC contracts. The Advocate takes the Council's
   brief. Solène (last year's resolution) confirms the clause
   exists. The investigation walks every contract for forty
   seasons and finds the same insertion in every one.

   Resolution at E5: every infernal clause on a DMC contract
   was inserted in the same 7-day window in epoch one — by a
   single ledger-keeper whose name is recovered. The Advocate
   cites the case to win the audit.

   Voice: Vex Maestro and the Advocate.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId, ChoiceId, ClueId, DeductionId, EpisodeDefinition, EpisodeId,
  LensDefinition, LensId, MysteryDefinition, MysteryId, SuspectGraphNode, SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.severance_infernal_clause" as ArcId;
const ID  = "severance.infernal_clause" as MysteryId;

const e1: EpisodeDefinition = {
  id: "severance.infernal_clause.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "Zyr'Koth at the Door",
  summary:
    "Severance Year 2, finals night. Zyr'Koth steps into Nilmorg's ceremony hall in person. The Hierarchy does not usually do this. Zyr'Koth produces a contract from the season finale of epoch one — yellowed, but readable — and points to a single line on the back. The line is an infernal clause, and the clause is real.",
  clues: [
    {
      id: "infernal.e1.zyrkoth_arrival" as ClueId,
      title: "Zyr'Koth's Arrival",
      body: "The hall does not go silent. The hall goes quieter — the kind of quiet a room makes when it remembers a story it would rather not tell.",
      foundIn: "war-room",
    },
    {
      id: "infernal.e1.epoch_one_contract" as ClueId,
      title: "The Epoch-One Contract",
      body: "A standard DMC season contract from epoch one. Front: lap counts, sponsor splits, refurbishment ledgers. Back: a paragraph in the same hand as the front, signed by the champion, signed by the Hierarchy ledger-keeper.",
      foundIn: "antiquarian-library",
    },
    {
      id: "infernal.e1.infernal_clause" as ClueId,
      title: "The Infernal Clause",
      body: "Reads: 'in the event of the champion's death, the soul-bond may be claimed by the Hierarchy in lieu of the second-cycle prize, at the Hierarchy's option.' Initialled by the champion. Initialled by the ledger-keeper. Witnessed by Vex Maestro's predecessor.",
      foundIn: "antiquarian-library",
    },
    {
      id: "infernal.e1.advocate_engaged" as ClueId,
      title: "The Advocate Is Engaged",
      body: "The Council retains the Advocate within minutes. The Advocate's first question: 'how many other contracts carry this clause?' Vex Maestro does not yet know.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "infernal.e1.d.clause_is_real" as DeductionId,
      clueA: "infernal.e1.infernal_clause" as ClueId,
      clueB: "infernal.e1.epoch_one_contract" as ClueId,
      result: "correct",
      narrationId: "infernal.e1.n.clause_is_real",
      narrationProse:
        "The clause is real. The signatures are real. The contract is from epoch one — long before the league's modern record-keeping — and the clause has been quietly enforceable for the league's entire history. Zyr'Koth is not asking for a favour. They are exercising a right we did not know we had given.",
      unlocksEpisode: "severance.infernal_clause.e2" as EpisodeId,
    },
    {
      id: "infernal.e1.d.scope_unknown" as DeductionId,
      clueA: "infernal.e1.advocate_engaged" as ClueId,
      clueB: "infernal.e1.zyrkoth_arrival" as ClueId,
      result: "partial",
      narrationId: "infernal.e1.n.scope_unknown",
      narrationProse:
        "We do not know how many contracts carry the clause. We have to know before we can answer Zyr'Koth. The Advocate is right to ask first; the audit is the case.",
    },
    {
      id: "infernal.e1.d.zyrkoth_bluffing" as DeductionId,
      clueA: "infernal.e1.zyrkoth_arrival" as ClueId,
      clueB: "infernal.e1.infernal_clause" as ClueId,
      result: "false_lead_named",
      narrationId: "infernal.e1.n.not_bluffing",
      narrationProse:
        "Zyr'Koth is not bluffing. The contract is genuine. The Hierarchy's signature is genuine. The ledger-keeper's signature is genuine. We are not facing a manufactured claim; we are facing an old one we never noticed.",
    },
  ],
  choices: [
    { id: "infernal.e1.c.audit_immediately" as ChoiceId, label: "Begin the contract audit immediately.", weight: "thorough" },
    { id: "infernal.e1.c.delay_zyrkoth" as ChoiceId, label: "Ask Zyr'Koth for a delay while the audit runs.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T15_the_audit",
    slideshowId: "T15_the_audit",
    loredexUnlocks: ["loredex.zyrkoth_at_the_court", "loredex.epoch_one_dmc_contract"],
    dropAt: "episode_close",
  },
};

const e2: EpisodeDefinition = {
  id: "severance.infernal_clause.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "Forty Seasons of Contracts",
  summary:
    "The Advocate's audit begins. Solène pulls every season's contract envelope. The Antiquarian's team scans the backs. The clause is on every contract. The handwriting is the same on every contract. The handwriting is not the same as any of the season-by-season ledger-keepers we know about.",
  clues: [
    {
      id: "infernal.e2.envelope_set" as ClueId,
      title: "The Envelope Set",
      body: "Forty envelopes, one per season, pulled from Solène's back-room archive. Each envelope holds the season's signed contract. Each contract has a back. Every back has a clause.",
      foundIn: "archives",
    },
    {
      id: "infernal.e2.handwriting_consistency" as ClueId,
      title: "Handwriting Consistency",
      body: "The cipher-den's analysis: forty contracts, forty clauses, one writer. The hand is steady, slightly slanted, and consistent through forty seasons. No ledger-keeper of forty seasons exists in any registry the league keeps.",
      foundIn: "cipher-den",
    },
    {
      id: "infernal.e2.season_ledger_keepers" as ClueId,
      title: "The Forty Ledger-Keepers",
      body: "The league has had forty ledger-keepers — one per season — and they have all been different people. The clause-writer is not among them. The clause was written separately from the contract by a hand that was never the official ledger-keeper.",
      foundIn: "war-room",
    },
    {
      id: "infernal.e2.first_clause_date" as ClueId,
      title: "The First Clause's Date",
      body: "The earliest clause, on epoch one's contract, is dated the same week as the contract itself — within a seven-day window. So is the second-season clause. So is every clause.",
      foundIn: "antiquarian-library",
    },
    {
      id: "infernal.e2.advocate_observation" as ClueId,
      title: "The Advocate's Observation",
      body: "The Advocate notes: 'each clause is dated to the contract's signing week. but the dates are forged. the writer wanted us to think the clauses were signed contemporaneously. they were not.'",
      foundIn: "oracle-sanctum",
    },
    {
      id: "infernal.e2.solene_recollection" as ClueId,
      title: "Solène's Recollection",
      body: "Solène: 'the contracts came back from the season-end audit with the clauses already on them. I never saw the clauses being written. I assumed the ledger-keepers had handled it. I should have asked.'",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "infernal.e2.d.single_writer" as DeductionId,
      clueA: "infernal.e2.handwriting_consistency" as ClueId,
      clueB: "infernal.e2.season_ledger_keepers" as ClueId,
      result: "correct",
      narrationId: "infernal.e2.n.single_writer",
      narrationProse:
        "One writer wrote every clause across forty seasons. The writer is not on any ledger-keeper roster. The Hierarchy did not write the clauses; the Hierarchy only signed them. We are looking for a third party — someone who has been inserting infernal clauses into DMC contracts for forty seasons, behind both the league's and the Hierarchy's backs.",
      unlocksEpisode: "severance.infernal_clause.e3" as EpisodeId,
    },
    {
      id: "infernal.e2.d.dates_forged" as DeductionId,
      clueA: "infernal.e2.first_clause_date" as ClueId,
      clueB: "infernal.e2.advocate_observation" as ClueId,
      result: "correct",
      narrationId: "infernal.e2.n.dates_forged",
      narrationProse:
        "The clauses were not added contemporaneously. Each clause is dated to look as though it were signed in the same week as the contract — but the writing-style consistency across forty seasons proves all clauses were written by the same hand, which is impossible if the dates are real. The writer did them all in one push.",
    },
    {
      id: "infernal.e2.d.solene_complicit" as DeductionId,
      clueA: "infernal.e2.solene_recollection" as ClueId,
      clueB: "infernal.e2.envelope_set" as ClueId,
      result: "false_lead_named",
      narrationId: "infernal.e2.n.not_solene",
      narrationProse:
        "Solène is not complicit. She handled the bonds; she did not handle the contract paperwork. The clause-writer worked in the audit pass — after Solène had signed off — and Solène's failure is a failure of attention, not of conspiracy. We will not punish attention.",
    },
  ],
  choices: [
    { id: "infernal.e2.c.dating_test" as ChoiceId, label: "Run a quantum-dating test on the clause ink.", weight: "thorough" },
    { id: "infernal.e2.c.consult_hierarchy_records" as ChoiceId, label: "Consult the Hierarchy's own records on the ledger-keeper.", weight: "diplomatic" },
  ],
  contentBundle: {
    songId: "T15_the_audit",
    slideshowId: "T15_the_audit_b",
    loredexUnlocks: ["loredex.forty_envelope_audit", "loredex.handwriting_consistency"],
    dropAt: "episode_mid",
  },
};

const e3: EpisodeDefinition = {
  id: "severance.infernal_clause.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Quantum-Dating Test",
  summary:
    "The cipher-den's quantum-dating test runs across all forty contracts. The result: every infernal clause was written within the same seven-day window in epoch one. The forty clauses pre-date thirty-nine of the contracts they appear on. The writer was working ahead — anticipating contracts that had not yet been signed.",
  clues: [
    {
      id: "infernal.e3.dating_results" as ClueId,
      title: "The Dating Test Results",
      body: "Quantum dating shows every clause's ink was applied within a seven-day window in epoch one. The contracts they appear on span forty seasons. Thirty-nine of the forty clauses pre-date their host contract by anywhere from one to thirty-nine seasons.",
      foundIn: "quantum-lab",
    },
    {
      id: "infernal.e3.seven_day_window" as ClueId,
      title: "The Seven-Day Window",
      body: "The window's exact dates: epoch one, week thirty-three, days four through ten. The first DMC season's contracts had been signed three weeks earlier; the writer worked retroactively for the first contract, prospectively for the others.",
      foundIn: "cipher-den",
    },
    {
      id: "infernal.e3.blank_pages_archive" as ClueId,
      title: "Blank-Backed Pages",
      body: "Forty unsigned blank-backed contract pages, found in a forge-workshop sub-corridor box labelled 'PRELIMINARIES.' The clauses were written on the blank-backed pages first, then the contract fronts were filled in season by season. The fronts and backs are different paper-stock.",
      foundIn: "forge-workshop",
    },
    {
      id: "infernal.e3.box_owner" as ClueId,
      title: "The Box's Owner",
      body: "The forge-workshop box is logged to a single person: Atalin, ledger-keeper, Year One. Atalin worked one season for the league, then left the post and was never replaced — the post was rotated season by season afterwards.",
      foundIn: "archives",
    },
    {
      id: "infernal.e3.atalin_history" as ClueId,
      title: "Atalin's History",
      body: "Atalin's personnel file: hired by the league two weeks before the first season, dismissed (or resigned — the file is unclear) two weeks after the first season ended. Cause of departure: 'inability to satisfy the Hierarchy ledger-keeper's role concurrently.'",
      foundIn: "archives",
    },
    {
      id: "infernal.e3.atalin_handwriting" as ClueId,
      title: "Atalin's Handwriting Sample",
      body: "Recovered from a routine receipt in Atalin's personnel file. The handwriting matches the clause-writing exactly. Atalin wrote every infernal clause across forty seasons in one seven-day window.",
      foundIn: "cipher-den",
    },
    {
      id: "infernal.e3.atalin_status" as ClueId,
      title: "Atalin's Current Status",
      body: "Atalin is alive. They are eighty-six years old. They live in a single room in the lower decks, sector eleven. They have not spoken to anyone from the league in forty seasons.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "infernal.e3.d.atalin_is_writer" as DeductionId,
      clueA: "infernal.e3.atalin_handwriting" as ClueId,
      clueB: "infernal.e3.dating_results" as ClueId,
      result: "correct",
      narrationId: "infernal.e3.n.atalin_is_writer",
      narrationProse:
        "Atalin wrote every clause. They wrote them in seven days, in epoch one, two weeks before they were dismissed. They have been the source of every infernal claim the Hierarchy has made on the league's bonds for forty seasons. They have been alive the whole time. We can ask them why.",
      unlocksEpisode: "severance.infernal_clause.e4" as EpisodeId,
    },
    {
      id: "infernal.e3.d.role_was_dual" as DeductionId,
      clueA: "infernal.e3.atalin_history" as ClueId,
      clueB: "infernal.e3.box_owner" as ClueId,
      result: "partial",
      narrationId: "infernal.e3.n.role_was_dual",
      narrationProse:
        "Atalin held two roles in their one season: league ledger-keeper AND Hierarchy ledger-keeper. The dismissal note suggests the dual role was untenable. The clauses are the artefact of that dual loyalty — written by a person standing on both sides of a counter.",
    },
    {
      id: "infernal.e3.d.hierarchy_ordered_atalin" as DeductionId,
      clueA: "infernal.e3.atalin_status" as ClueId,
      clueB: "infernal.e3.atalin_history" as ClueId,
      result: "false_lead_named",
      narrationId: "infernal.e3.n.not_ordered",
      narrationProse:
        "The Hierarchy did not order Atalin to write the clauses. The Hierarchy signed them once Atalin had drafted them — that we already know from Zyr'Koth's evidence. But the Hierarchy did not commission them. Atalin acted alone, in seven days, in epoch one. The episode-four conversation is with Atalin only.",
    },
    {
      id: "infernal.e3.d.dismissal_was_punishment" as DeductionId,
      clueA: "infernal.e3.atalin_history" as ClueId,
      clueB: "infernal.e3.dating_results" as ClueId,
      result: "partial",
      narrationId: "infernal.e3.n.dismissal_was_punishment",
      narrationProse:
        "Atalin was dismissed two weeks after the first season ended — the same time-frame as the clause-writing window. The dismissal may have been the league discovering the clauses, or the Hierarchy discovering them, or Atalin themselves resigning rather than continue. We will know in episode four.",
    },
  ],
  choices: [
    { id: "infernal.e3.c.visit_atalin" as ChoiceId, label: "Visit Atalin in the lower decks.", weight: "respectful" },
    { id: "infernal.e3.c.advocate_writes_first" as ChoiceId, label: "Have the Advocate write a formal request before visiting.", weight: "procedural" },
  ],
  contentBundle: {
    songId: "T15_the_audit",
    slideshowId: "T15_the_audit_c",
    loredexUnlocks: ["loredex.atalin_year_one", "loredex.seven_day_window_clauses"],
    dropAt: "episode_close",
  },
};

const e4: EpisodeDefinition = {
  id: "severance.infernal_clause.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "Atalin's Single Room",
  summary:
    "Atalin agrees to speak. They are eighty-six. They have been waiting forty seasons to be asked. Their account: in epoch one, the Hierarchy approached them privately about adding the clauses. They refused. The Hierarchy threatened. They wrote the forty clauses in seven days as a TRAP — every clause is voidable on a technicality the Hierarchy never noticed, but only if the league or the Advocate finds it.",
  clues: [
    {
      id: "infernal.e4.atalin_account" as ClueId,
      title: "Atalin's Forty-Year Account",
      body: "'I wrote them because the Hierarchy would have written them if I refused. I wrote them with a flaw. I left the flaw to be found. The Advocate is the first person to come asking. I have been making myself easy to find for forty seasons.'",
      foundIn: "antiquarian-library",
    },
    {
      id: "infernal.e4.the_flaw" as ClueId,
      title: "The Flaw",
      body: "Atalin shows the Advocate the flaw: every clause uses the phrase 'in lieu of the second-cycle prize.' But the league did not institute second-cycle prizes until season eleven. Every clause is voidable for naming a prize that did not exist when the clause was written. The Hierarchy missed it because the Hierarchy did not read the league's prize-structure history.",
      foundIn: "cipher-den",
    },
    {
      id: "infernal.e4.advocate_brief" as ClueId,
      title: "The Advocate's Brief",
      body: "The Advocate drafts the brief. Six pages. Every infernal clause cites a non-existent prize from the date of writing. Every clause is voidable as a matter of contract law. The brief includes Atalin's witness statement, signed.",
      foundIn: "war-room",
    },
    {
      id: "infernal.e4.zyrkoth_response" as ClueId,
      title: "Zyr'Koth's Response",
      body: "Zyr'Koth reads the brief in the Council chamber. Zyr'Koth pauses for a long minute. Zyr'Koth says: 'we did not check the prize-history. we should have checked the prize-history. the clause is voidable.'",
      foundIn: "oracle-sanctum",
    },
    {
      id: "infernal.e4.atalin_apology" as ClueId,
      title: "Atalin's Apology",
      body: "Atalin asks to be brought to the Council chamber. They apologise to the league for forty seasons of unease. They apologise to the Hierarchy for the trap. The Hierarchy accepts the apology in writing. The league does not need to.",
      foundIn: "war-room",
    },
    {
      id: "infernal.e4.architect_acknowledges" as ClueId,
      title: "Architect's Acknowledgment",
      body: "The Console issues: 'noted. the clauses are void. the trap was an honest one. the architect thanks the writer.' Fourth use of 'thanks' in eight epochs.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "infernal.e4.d.trap_works" as DeductionId,
      clueA: "infernal.e4.the_flaw" as ClueId,
      clueB: "infernal.e4.zyrkoth_response" as ClueId,
      result: "correct",
      narrationId: "infernal.e4.n.trap_works",
      narrationProse:
        "Atalin's trap holds. Every clause cites a prize that did not exist. Zyr'Koth concedes. The Advocate has won the audit on a technicality the writer planted forty seasons before the auditor was hired. We are not winning by force; we are winning by honest paperwork laid down by a frightened person in seven days.",
      unlocksEpisode: "severance.infernal_clause.e5" as EpisodeId,
    },
    {
      id: "infernal.e4.d.hierarchy_concedes" as DeductionId,
      clueA: "infernal.e4.zyrkoth_response" as ClueId,
      clueB: "infernal.e4.atalin_apology" as ClueId,
      result: "partial",
      narrationId: "infernal.e4.n.hierarchy_concedes",
      narrationProse:
        "Zyr'Koth concedes the audit because the Hierarchy is, for once, in the position where conceding costs less than fighting. The Hierarchy will not concede again easily; we will treat this resolution as a single victory in a long run, not a precedent.",
    },
    {
      id: "infernal.e4.d.atalin_was_villain" as DeductionId,
      clueA: "infernal.e4.atalin_account" as ClueId,
      clueB: "infernal.e4.advocate_brief" as ClueId,
      result: "false_lead_named",
      narrationId: "infernal.e4.n.not_villain",
      narrationProse:
        "Atalin is not a villain. They are a person who refused the Hierarchy and made the refusal as load-bearing as they could. They have lived alone for forty seasons because they could not safely live anywhere else. The narrative we want — a wrongdoer, exposed — is not the narrative we have. We will read theirs at the closing rite.",
    },
  ],
  choices: [
    { id: "infernal.e4.c.bring_to_council" as ChoiceId, label: "Bring Atalin to the Council chamber to apologise.", weight: "honourable" },
    { id: "infernal.e4.c.honour_silence" as ChoiceId, label: "Honour Atalin's forty-year silence; let the Advocate speak for them.", weight: "respectful" },
  ],
  contentBundle: {
    songId: "T15_the_audit",
    slideshowId: "T15_the_audit_d",
    loredexUnlocks: ["loredex.atalin_account", "loredex.the_flaw_in_the_clauses"],
    dropAt: "episode_open",
  },
};

const e5: EpisodeDefinition = {
  id: "severance.infernal_clause.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Audit, Closed",
  summary:
    "Severance Year 2 closing rite. The Council ratifies the infernal-amnesty motion: every clause across forty seasons is declared void. Zyr'Koth withdraws the claim and pays a small ceremonial fee for the league's audit costs. Atalin attends the rite. Solène pours the bond into the empty jar. The chair is sat in. The Advocate reads the closing line.",
  clues: [
    {
      id: "infernal.e5.amnesty_passed" as ClueId,
      title: "The Amnesty Passes",
      body: "Twelve votes to two, with three abstentions (the three Council members who attended the original epoch-one negotiation are excused from voting). The amnesty is passed. Every infernal clause across forty seasons is declared void by the Council in session.",
      foundIn: "war-room",
    },
    {
      id: "infernal.e5.zyrkoth_withdraws" as ClueId,
      title: "Zyr'Koth's Withdrawal",
      body: "Formal letter from the Hierarchy, signed by Zyr'Koth: 'the claim is withdrawn. the audit was honest. the league owes the Hierarchy nothing further on this point.' Pays a ceremonial fee of one hundred dream tokens for the audit's costs.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "infernal.e5.atalin_at_rite" as ClueId,
      title: "Atalin at the Closing Rite",
      body: "Atalin sits beside Solène in the front row. They have not been in a public room in forty seasons. They cry once, briefly, when the Advocate names them in the closing speech. They do not cry again.",
      foundIn: "antiquarian-library",
    },
    {
      id: "infernal.e5.advocate_speech" as ClueId,
      title: "The Advocate's Closing Speech",
      body: "Eleven minutes. The Advocate reads the audit, the flaw, Atalin's account, and the Council's vote. The speech ends: 'we have been winning by honest paperwork. we will keep winning that way. it is not a glamorous habit, but it is a survivable one.'",
      foundIn: "war-room",
    },
    {
      id: "infernal.e5.bond_poured" as ClueId,
      title: "The Bond Poured (Year Two)",
      body: "Solène pours the season's bond into the empty jar. The chair is sat in by the apprentice (or by Solène alone, if the player declined the apprenticeship in Year One). The bond is calm. The chair holds.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "infernal.e5.d.canonical_resolution" as DeductionId,
      clueA: "infernal.e5.amnesty_passed" as ClueId,
      clueB: "infernal.e5.zyrkoth_withdraws" as ClueId,
      result: "correct",
      narrationId: "infernal.e5.n.canonical_resolution",
      narrationProse:
        "Every infernal clause across forty seasons was inserted in the same seven-day window in epoch one by Atalin, ledger-keeper, in defiance of the Hierarchy and at the cost of their own forty-season exile. The Advocate found the trap. The league passed the amnesty. The Hierarchy withdrew the claim. The case is closed by honest paperwork, which is the only kind that holds.",
    },
    {
      id: "infernal.e5.d.advocate_won_by_record" as DeductionId,
      clueA: "infernal.e5.advocate_speech" as ClueId,
      clueB: "infernal.e5.zyrkoth_withdraws" as ClueId,
      result: "partial",
      narrationId: "infernal.e5.n.advocate_won_by_record",
      narrationProse:
        "The Advocate won not by argument but by record. The brief was unanswerable because the record was unimpeachable. We will keep this in mind for the next Hierarchy negotiation: the Council's strongest weapon is the league's own honest accounting.",
    },
    {
      id: "infernal.e5.d.atalin_should_be_compensated" as DeductionId,
      clueA: "infernal.e5.atalin_at_rite" as ClueId,
      clueB: "infernal.e5.advocate_speech" as ClueId,
      result: "false_lead_named",
      narrationId: "infernal.e5.n.not_compensate",
      narrationProse:
        "We could vote a compensation package for Atalin's forty seasons of exile. Atalin will refuse. They have been clear: they did the work because the work needed doing, and they do not want to be paid for refusing the Hierarchy. The Council will pay them a small ceremonial fee — the same fee Zyr'Koth paid the league — and Atalin will accept that, on the strength of its symmetry.",
    },
  ],
  choices: [
    {
      id: "infernal.e5.c.continue" as ChoiceId,
      label: "Pass the amnesty, void all clauses, accept Atalin's apology.",
      weight: "honest",
    },
    {
      id: "infernal.e5.c.inscribe" as ChoiceId,
      label: "Pass the amnesty AND inscribe Atalin's name on the league's founding plaque.",
      weight: "honourable",
    },
    {
      id: "infernal.e5.c.refuse" as ChoiceId,
      label: "Refuse the amnesty until each champion's family is consulted individually.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "T15_the_audit",
    slideshowId: "T15_the_audit_e",
    loredexUnlocks: ["loredex.severance_amnesty_year_2", "loredex.atalin_named_aloud", "loredex.advocate_first_audit_won"],
    conspiracyDiscoveries: ["severance.infernal_audit_cleared"],
    dropAt: "episode_close",
  },
};

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "infernal.s.atalin" as SuspectId,
    name: "Atalin, Year-One Ledger-Keeper",
    type: "person",
    relations: [
      { to: "infernal.s.hierarchy" as SuspectId, relation: "refused" },
      { to: "infernal.s.clauses" as SuspectId, relation: "wrote" },
    ],
  },
  {
    id: "infernal.s.zyrkoth" as SuspectId,
    name: "Zyr'Koth, of the Hierarchy",
    type: "person",
    relations: [
      { to: "infernal.s.clauses" as SuspectId, relation: "claimed-under" },
    ],
  },
  {
    id: "infernal.s.advocate" as SuspectId,
    name: "The Advocate",
    type: "person",
    relations: [
      { to: "infernal.s.atalin" as SuspectId, relation: "represented" },
    ],
  },
  {
    id: "infernal.s.solene" as SuspectId,
    name: "Solène, the Broker",
    type: "person",
    relations: [
      { to: "infernal.s.atalin" as SuspectId, relation: "knew-but-did-not-know" },
    ],
  },
  {
    id: "infernal.s.hierarchy" as SuspectId,
    name: "The Hierarchy of the Damned",
    type: "faction",
    relations: [
      { to: "infernal.s.zyrkoth" as SuspectId, relation: "represented-by" },
    ],
  },
  {
    id: "infernal.s.clauses" as SuspectId,
    name: "Forty Infernal Clauses",
    type: "object",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "infernal.lens.advocate" as LensId,
    name: "The Advocate's Lens",
    category: "trade-court",
    deductionNarrationOverrides: {
      ["infernal.e4.d.trap_works" as DeductionId]:
        "Through the Advocate's lens: the trap is the kind of paperwork the Trade Court is built to find. Atalin wrote a contract that was technically wrong on purpose. Forty seasons later, a court that reads contracts technically arrived. The two halves of the trap met.",
    },
  },
  {
    id: "infernal.lens.hierarchy" as LensId,
    name: "The Hierarchy Lens",
    category: "demonic",
    deductionNarrationOverrides: {
      ["infernal.e4.d.hierarchy_concedes" as DeductionId]:
        "Through the Hierarchy lens: Zyr'Koth conceded because the Hierarchy reads contracts the way courts do — strictly. To dispute the audit would have been to claim immunity from contract law, and the Hierarchy does not survive that claim with the rest of the Ark watching.",
    },
  },
];

export const SEVERANCE_INFERNAL_CLAUSE_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "Severance — The Hierarchy Audit",
  summary:
    "Severance Year 2: Zyr'Koth claims a bound companion under an infernal clause hidden in a forty-season-old DMC contract. The Advocate audits every contract. Every clause is in the same hand, written in a single seven-day window in epoch one — by Atalin, the league's first and only dual ledger-keeper, who left a flaw in every clause as a forty-season trap. The Council passes the amnesty; the Hierarchy withdraws.",
  npcId: "advocate",
  seed: {
    source: "manual",
    seedId: "severance.infernal_clause",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q2_hierarchy_audit", sealRequired: 4 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
