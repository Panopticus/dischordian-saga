/* ═══════════════════════════════════════════════════════
   WAR ROOM MYSTERY — command silence between briefings

   Three hotspots: the dormant holo-table that lights up
   when act 2 opens, the casualty-board archive (the room's
   memory of every name lost), and the signal-flag rack
   (the room's record of every faction Lyra negotiated with
   in person rather than through an intermediary).

   Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type WarRoomHotspotId =
  | "infernal-forty-ledger-keepers"
  | "chained-wave-telemetry"
  | "chained-feint-pattern"
  | "chained-dean-admits"
  | "chained-trade-empire-employment"
  | "chained-dean-full-admission"
  | "chained-amendment-three-options"
  | "watchers-council-communique"
  | "resur-second-fall-casualty-count"
  | "storm-advocates-blood-weave"
  | "storm-event-correlation-table"
  | "advocate-acquisition-attempt-log"
  | "advocate-riri-ahlia-account"
  | "advocate-empire-status-current"
  | "akai-thaloria-battle-logs"
  | "watchers-witness-one-response"
  | "watchers-player-first-question"
  | "tarn-faculty-meeting-minutes"
  | "tarn-trial-proposal"
  | "tarn-dean-choice-brief"
  | "tarn-faculty-apologies"
  | "tarn-player-authorship-choice"
  | "severance-attendance-record"
  | "severance-vex-three-names"
  | "severance-klessa-role"
  | "severance-written-protocol"
  | "charter-council-briefing"
  | "charter2-delegation"
  | "charter2-kassel-speaks"
  | "charter2-kassel-response"
  | "charter2-council-ratifies-three"
  | "charter2-three-options"
  | "infernal-zyrkoth-arrival"
  | "infernal-advocate-brief"
  | "infernal-atalin-apology"
  | "infernal-amnesty-passed"
  | "infernal-advocate-speech"
  | "holo-table" | "casualty-board" | "signal-flag-rack" | "ocularum-vigil-board" | "ocularum-cell-roster" | "hierarchy-org-chart-board" | "thalorian-defense-records" | "new-babylon-siege-record" | "hierarchy-piece-positioning-board" | "varkul-director-of-security-file" | "necromancer-castle-log-board" | "zyr-koth-rd-refinement-file" | "the-severance-hollowing-report" | "the-locked-lever-board" | "syl-vex-dual-roster-board" | "the-severance-cross-lock-file" | "the-taskmasters-siege-portfolio" | "riri-ahlia-reorg-doctrine-board" | "the-procedural-question-file" | "the-priced-defense-accounting" | "fenra-seventeen-front-manifest" | "the-wolf-in-the-boardroom-file" | "fenra-varkul-contrast-record";

export const WAR_ROOM_MYSTERY: RoomMysteryModule<WarRoomHotspotId> = {
  roomId: "war-room",
  responses: {
    /* ─── severance.infernal_clause · e2 (forty seasonal ledger-keepers) ─── */
    "infernal-forty-ledger-keepers": {
      look: {
        narration:
          "On the war-room's personnel display, the league's forty seasons of ledger-keeper records — one per season, forty different people. Each personnel card carries a handwriting sample, a tenure window, a salary record, a dismissal note. None of the forty samples match the clause-writing hand. The clause-writer is not on this wall. The clauses were written separately from the contracts by a hand that was never the official ledger-keeper. The war-room's cross-reference identifies one anomaly: a single name appears in the league's hiring records for the first season but does not appear on the wall.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e2",
          cluesFound: ["infernal.e2.season_ledger_keepers"],
        },
      },
      interrogate: {
        narration:
          "You ask the war-room for the missing name. The display returns Atalin, ledger-keeper, Year One. Atalin held the post for one season, was dismissed (or resigned — the file is unclear), and was never replaced — the post was rotated season by season afterwards. Atalin's personnel file is in the archives; the cipher-den has the handwriting sample. The investigation has one name to follow.",
      },
    },
    /* ─── mechronis.chained_lesson · color clues ─── */
    "chained-dean-admits": {
      look: {
        narration:
          "On the war-room's curriculum-affairs board, the Dean's admission, recorded for the case: 'I knew Module 17 was absent. I voted to ratify the curriculum that left it absent. I have been telling myself for fourteen years that the apprentices were the failures. They were not. The curriculum was.' The recording is in the Dean's own voice. The board does not gloss it.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e2",
          cluesFound: ["chained.e2.dean_admits"],
        },
      },
    },
    "chained-trade-empire-employment": {
      look: {
        narration:
          "On the Trade-Empire intelligence board, Auro's employment record. Auro is on the Trade Empire's payroll as a 'route-safety contractor.' She has been on the payroll for nine years — since Year 5, since the first apprentice failure. The Trade Empire pays her because the Trade Empire benefits from apprentices who survive Terminus waves.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e3",
          cluesFound: ["chained.e3.trade_empire_employment"],
        },
      },
    },
    "chained-dean-full-admission": {
      look: {
        narration:
          "Pinned beside Auro's record, the Dean's full admission: 'I voted with Tarn in Year 1. I deferred to her on academic-vs-combat distinctions for fourteen years. After she left I had no excuse. I have not had an excuse for the last term.' The admission is dated this morning. The Dean has filed it without prompt.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e4",
          cluesFound: ["chained.e4.dean_full_admission"],
        },
      },
    },
    "chained-amendment-three-options": {
      look: {
        narration:
          "On the council-vote display, the three amendment options drafted for the closing rite. (1) Restore Module 17 to the curriculum, named for Tarn's retraction. (2) Restore Module 17 anonymously, taught by Auro under contract. (3) Refuse to restore; have the Council formally fund Auro's Trade-Empire role as a permanent Academy supplement.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e5",
          cluesFound: ["chained.e5.amendment_three"],
        },
      },
    },
    /* ─── mechronis.chained_lesson · e1 (wave telemetry) ─── */
    "chained-wave-telemetry": {
      look: {
        narration:
          "The war-room's main holo-tank carries the festival roof's tower-defense readings, four minutes from contact. Standard Terminus pattern: fourteen carriers in echelon, no anomalies, no surge. Your apprentice's tower reads full ammunition; the sight-line is clean to the outer wall; the wind is steady. The wave is winnable on every metric the tank tracks. The cipher-den's overlay shows the same pattern fielded in fourteen previous festival openings, each one categorically winnable. The tank does not tell you why thirty-one apprentices have failed to win it.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e1",
          cluesFound: ["chained.e1.wave_telemetry"],
        },
      },
      use: {
        narration:
          "You scrub the tank's timeline back through the fourteen Terminus waves. Each one shows the same echelon, the same carriers, the same winnable telemetry. The pattern that loses is not visible on this tank. The pattern that loses is the third-minute one the tank does not annotate.",
      },
    },
    /* ─── mechronis.chained_lesson · e2 (feint pattern) ─── */
    "chained-feint-pattern": {
      look: {
        narration:
          "On the side display, the league's tower-defense desk's annotation has been pinned to the tank as supplementary: 'the Terminus formation that produces this feint is well-known to senior operators. apprentices have not been taught to recognise it. the pattern has been on the league's drill curriculum every year.' The annotation is signed by a desk officer who has fielded apprentices for nine years on Trade Empire pay. The Academy's term sheet, also pinned for cross-reference, does not list this pattern. The cross-reference is the answer to the war-room's question.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e2",
          cluesFound: ["chained.e2.feint_pattern"],
        },
      },
      interrogate: {
        narration:
          "You ask the desk officer's pinned note to expand. The annotation deepens: 'the feint reads as a real approach for two beats. apprentices commit at beat one. senior operators wait until beat three. the wait costs nothing; the commit costs everything.' The Academy's curriculum has not taught the wait.",
      },
    },
    /* ─── memorial.seven_watchers · e3 (Council communiqué) ─── */
    "watchers-council-communique": {
      look: {
        narration:
          "On the war-room's chronicle-public display, the Council communiqué drafted by the Antiquarian and ratified by all council members. The communiqué names all six Watchers — Idris, Verel, Ophran, Kallium, Mereth, Sothe — by band and audience. It does not name the seventh. It thanks the seventh for the silence. The thanks is sincere; the silence is honoured. The communiqué is the Ark's first public statement on the founding Watchers in eight epochs.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e3",
          cluesFound: ["watchers.e3.council_communique"],
        },
      },
      interrogate: {
        narration:
          "You ask the display for the communiqué's distribution chain. The board returns the list: every plaza, every library, every cipher-keeper, every player-facing terminal. The Antiquarian routed the document through every channel the Ark has — the public statement is, by design, impossible to miss.",
      },
    },
    /* ─── resurrectionist.cycle_walker · e2 (Second Fall casualty count) ─── */
    "resur-second-fall-casualty-count": {
      look: {
        narration:
          "On the war-room's New-Babylon-affairs board, the Second Fall casualty count. By every contemporary chronicler's account, the Fall was total. Casualty counts among the ordinary populace: millions. Casualty counts among Potentials: zero. Casualty counts among Ne-Yons of the awake roster: zero. The cult-curated logs annotate the survival as 'miraculous — the Architect's protection of His chosen.' The Architect did not, by canon, intervene at the Second Fall. The 'miracle' was authored by someone else. The board does not say who.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e2",
          cluesFound: ["resur.e2.second_fall_casualty_count"],
        },
      },
      interrogate: {
        narration:
          "You ask the board what the Resurrectionist's protocol-activation log shows for the Second Fall window. The display returns a cluster of activations, signed in the four-part cipher, timestamped to the Fall's death-instants. Every Potential and every awake Ne-Yon is named in the cluster. The protocols outlived the author. The cluster is the receipt for the miracle.",
      },
    },
    /* ─── storm.architect_of_flux · e3 (Advocate's Blood-Weave journals) ─── */
    "storm-advocates-blood-weave": {
      look: {
        narration:
          "On the war-room's Empire-of-Shadows tactical display, the Advocate's surviving operational journals on the Blood Weave's deployments. The Weave's operational tolerances require a turbulent local cosmic environment; the Storm provided it across every documented deployment window. The Advocate's accounting describes the Storm as 'a patron of opportunity, indifferent to outcome.' The journals are sparse but consistent — the Advocate did not credit the Storm with success; the Advocate credited the Storm with the conditions under which success became possible.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e3",
          cluesFound: ["storm.e3.advocates_blood_weave"],
        },
      },
      use: {
        narration:
          "You correlate the Weave deployments against the Storm's active periods. Every deployment landed inside one. The Advocate did not plan deployments outside the windows. The Storm was the Empire of Shadows' weather-officer; the Empire's tactics presumed his patronage.",
      },
    },
    /* ─── storm.architect_of_flux · e4 (calm-event correlation table) ─── */
    "storm-event-correlation-table": {
      look: {
        narration:
          "Pinned beside the Advocate's journals, the war-room's chronicle-event correlation table: nine documented Storm calms mapped to chronicle-significant events. Seven calms aligned with named events — Casino Heist (twice), Second Fall, Architect's Year-1 emergence, Founding of the Authority, Severance Protocol, Inception Ark launches, Battle of Thaloria, Apprentice muster. Each event required cosmic-scale planning consistency; each got it during a Storm-authored calm interval. The remaining two calms have no publicly-recorded event — the chronicle's gap, not the cadence's.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e4",
          cluesFound: ["storm.e4.event_correlation_table"],
        },
      },
      interrogate: {
        narration:
          "You ask the table for the planning-signature of each correlated event. The console returns identical signatures across all seven — multi-cycle information consistency, no flux interference, no Ne-Yon-grade disturbance. Planning is permitted; planning happens; planning is followed by the most active flux period in the surrounding decade. The chronicle is consequential because the Storm allows it to be.",
      },
    },
    /* ─── severance.infernal_clause · color clues ─── */
    "infernal-zyrkoth-arrival": {
      look: {
        narration:
          "On the Council-chamber arrival log, Zyr'Koth's recorded entry at the Nilmorg ceremony: the hall does not go silent. The hall goes quieter — the kind of quiet a room makes when it remembers a story it would rather not tell.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e1",
          cluesFound: ["infernal.e1.zyrkoth_arrival"],
        },
      },
    },
    "infernal-advocate-brief": {
      look: {
        narration:
          "On the Council-brief board, the Advocate's drafted brief. Six pages. Every infernal clause cites a non-existent prize from the date of writing. Every clause is voidable as a matter of contract law. The brief includes Atalin's witness statement, signed.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e4",
          cluesFound: ["infernal.e4.advocate_brief"],
        },
      },
    },
    "infernal-atalin-apology": {
      look: {
        narration:
          "On the Council-floor recording, Atalin asks to be brought to the Council chamber. They apologise to the league for forty seasons of unease. They apologise to the Hierarchy for the trap. The Hierarchy accepts the apology in writing. The league does not need to.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e4",
          cluesFound: ["infernal.e4.atalin_apology"],
        },
      },
    },
    "infernal-amnesty-passed": {
      look: {
        narration:
          "On the Council-vote display, the closing-rite amnesty: twelve votes to two, with three abstentions (the three Council members who attended the original epoch-one negotiation are excused from voting). Every infernal clause across forty seasons is declared void by the Council in session.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e5",
          cluesFound: ["infernal.e5.amnesty_passed"],
        },
      },
    },
    "infernal-advocate-speech": {
      look: {
        narration:
          "On the closing-rite recording, the Advocate's eleven-minute speech: she reads the audit, the flaw, Atalin's account, and the Council's vote. The speech ends: 'we have been winning by honest paperwork. we will keep winning that way. it is not a glamorous habit, but it is a survivable one.'",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e5",
          cluesFound: ["infernal.e5.advocate_speech"],
        },
      },
    },
    /* ─── charter.second_signatory · color clues ─── */
    "charter2-delegation": {
      look: {
        narration:
          "On the war-room's Council-chamber door log, the delegation: four people in working clothes. Two old, two young. They ask, politely, to speak to whoever read aloud the charter last year. They will not give names until they have read theirs into the record.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e1",
          cluesFound: ["charter2.e1.delegation"],
        },
      },
    },
    "charter2-kassel-speaks": {
      look: {
        narration:
          "On the Council-floor recording, Kassel in the Council chamber: 'four houses signed the charter. four houses were scrubbed. four houses are here. we are not asking for our names back. we are asking the charter to admit it had eight names from the start. there is a difference, and the charter knows the difference.'",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e3",
          cluesFound: ["charter2.e3.kassel_speaks"],
        },
      },
    },
    "charter2-kassel-response": {
      look: {
        narration:
          "Pinned beside, Kassel's recorded response to the silence-as-vote convention: 'so the seventh has been with us this whole time. then the schism is not asking for a new column. the schism is asking for the seventh's silence to be heard correctly, four epochs late.'",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e4",
          cluesFound: ["charter2.e4.kassel_response"],
        },
      },
    },
    "charter2-council-ratifies-three": {
      look: {
        narration:
          "On the Council-vote display, Option Three is ratified: by eleven votes to four, with two abstentions. The eleven include the descendants of all six founders who signed the original scrub. Two of the four nay-voters apologise from the floor. The two abstentions are unrecorded by request.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e5",
          cluesFound: ["charter2.e5.council_ratifies_three"],
        },
      },
    },
    "charter2-three-options": {
      look: {
        narration:
          "Beside the ratification, the three Council options drafted by the player and the Antiquarian: (1) Ratify the schism — restore the second-signatory line. (2) Close the schism — the original charter holds. (3) Ratify the artisan-house signatures backward to the founding, AND keep the original charter intact.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e5",
          cluesFound: ["charter2.e5.three_options"],
        },
      },
    },
    /* ─── charter.missing_signatory · e5 (Council briefing pack) ─── */
    "charter-council-briefing": {
      look: {
        narration:
          "On the Council-briefing board, the Antiquarian's pack for the Foundation Day vote: includes everything except the name. The Council can ratify, amend, or contest. None of the three options name the seventh.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e5",
          cluesFound: ["charter.e5.council_briefing"],
        },
      },
    },
    /* ─── severance.bound_champion · color clues ─── */
    "severance-attendance-record": {
      look: {
        narration:
          "On the war-room's Severance roster-board, two hundred sixteen names: the list of inheritors offering to take up the bond. Two hundred sixteen, every season, every year. The first three names on every list are the same three names, in the same order, in every season since Severance Year 1.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e1",
          cluesFound: ["severance.e1.attendance_record"],
        },
      },
    },
    "severance-vex-three-names": {
      look: {
        narration:
          "Pinned beside the roster, Vex Maestro's confirmation: the three names at the head of every season's list are the inheritor (a different person each year) and two fixed witnesses. Vex will name the witnesses but will not name the inheritor. 'That part is the bond's, not mine.'",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e2",
          cluesFound: ["severance.e2.vex_three_names"],
        },
      },
    },
    "severance-klessa-role": {
      look: {
        narration:
          "On the failsafe-role board, Klessa's protocol: if a season ever passes without a successor, Klessa pours the candle wax across the bond's table-line and the bond is sealed for one more year. She has done this thirty-nine times.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e4",
          cluesFound: ["severance.e4.klessa_role"],
        },
      },
    },
    "severance-written-protocol": {
      look: {
        narration:
          "On the closing-rite display, the written protocol — eleven lines, hand-copied from the apprentice oath, ratified by Vex Maestro and Auditor Klessa, witnessed by the Architect's Console. The protocol can now be inherited by reading, not only by sitting.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e5",
          cluesFound: ["severance.e5.written_protocol"],
        },
      },
    },
    /* ─── mechronis.missing_professor · color clues ─── */
    "tarn-faculty-meeting-minutes": {
      look: {
        narration:
          "On the war-room's curriculum-affairs board, the week-before-term faculty meeting minutes show all three faculty heads in violent disagreement, then a quiet hour, then unanimous agreement on one thing: 'Tarn must speak.' Tarn was not at the meeting.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e2",
          cluesFound: ["mechronis.e2.faculty_meeting_minutes"],
        },
      },
    },
    "tarn-trial-proposal": {
      look: {
        narration:
          "Beside the meeting minutes, Trial-master Roen's Trial Faculty Proposal: five modules, ritual-heavy, citing Tarn's authority-trial framework. Signed by Roen. Proposes the addition of a celebration-trial co-requisite.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e2",
          cluesFound: ["mechronis.e2.trial_proposal"],
        },
      },
    },
    "tarn-dean-choice-brief": {
      look: {
        narration:
          "On the Council-brief board, the Dean's draft for the Council: ratify the curriculum and let Tarn go; or summon Tarn back and tell the Academy the truth about the vote. The brief is unsigned.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e4",
          cluesFound: ["mechronis.e4.dean_choice_brief"],
        },
      },
    },
    "tarn-faculty-apologies": {
      look: {
        narration:
          "On the rite-record board, the three faculty apologies: Othmar, Veth, and the Dean have each written a public apology. Roen has not — Roen kept Tarn's confidence and was the only one not in the wrong. The apologies are read at the Council session.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e5",
          cluesFound: ["mechronis.e5.faculty_apologies"],
        },
      },
    },
    "tarn-player-authorship-choice": {
      look: {
        narration:
          "On the closing-rite ballot display, the Council secretary asks the player which of two motions to put forward: 'curriculum by Professor Tarn,' or 'curriculum, anonymous.' Both motions ratify the same modules. The choice is the player's.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e5",
          cluesFound: ["mechronis.e5.player_authorship_choice"],
        },
      },
    },
    /* ─── memorial.seven_watchers · color clues ─── */
    "watchers-witness-one-response": {
      look: {
        narration:
          "On the war-room's plaza-audience board, players gathered in the plaza compare lines. Three confirm Idris's voice (an investigator's voice). Two confirm Verel's (a caretaker's). Five remain unconfirmed. The unconfirmed five are the four other named Watchers' work — and one is the seventh, who did not speak. The five unmatched lines are the case's bulk.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e2",
          cluesFound: ["watchers.e2.witness_one_response"],
        },
      },
    },
    "watchers-player-first-question": {
      look: {
        narration:
          "On the year-vault-archive board, the player's first-question draft. The question is hand-written; the question is sealed in an envelope; the envelope is given to the Antiquarian to deliver next Memorial Day, when the seventh may speak.",
        mysteryBinding: {
          mysteryId: "memorial.seven_watchers",
          episodeId: "memorial.seven_watchers.e4",
          cluesFound: ["watchers.e4.player_first_question"],
        },
      },
    },
    /* ─── akai_shi.red_death · e1 (Thaloria battle logs) ─── */
    "akai-thaloria-battle-logs": {
      look: {
        narration:
          "On the war-room's Thaloria archive board, the combat logs record Akai Shi's last hours: energy-manipulation discharges that would have stabilized three faltering squads. Healing applied to seven Potentials whose injuries should have been fatal. Then, four hours into the engagement, a transition the logs notate only as 'subject consumed.' From that point her energy-manipulation begins to redirect toward her own allies. Jericho intercepted her at the seven-hour mark.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e1",
          cluesFound: ["akai.e1.battle_logs"],
        },
      },
    },
    /* ─── advocate.blood_weave · e5 (Empire of Shadows current status) ─── */
    "advocate-empire-status-current": {
      look: {
        narration:
          "On the war-room's Empire-status board, the Empire of Shadows' current status: the charter holds. The bindings on the Hierarchy's named demon lords (Mol'Garath, Xeth'Raal, Zyr'Koth, Ith'Rael, Riri'Ahlia, Syl'Vex, Drael'Mon, Varkul, Fenra, Mol'Vereth) are operationally intact — the chains forged in the seven-dimensions siege still bind. The Hierarchy operates within the Weave's constraints; the Empire's defensive system remains active. The Advocate has not retired the charter.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e5",
          cluesFound: ["adv.e5.empire_status_current"],
        },
      },
    },
    /* ─── advocate.blood_weave · e1 (acquisition-attempt log) ─── */
    "advocate-acquisition-attempt-log": {
      look: {
        narration:
          "On the war-room's Empire-of-Shadows defensive display, the Hierarchy acquisition-attempt log across seven recorded centuries. Column headers: target soul, hostile instrument deployed, Advocate countersignature held, outcome. The 'outcome' column shows the same value at every entry where the countersignature held: NULL. The Hierarchy did not succeed in a single recorded breach against an Advocate-sheltered soul. Seven centuries; thousands of attempts; zero breaches. The chronicle's most-load-bearing single defensive record.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e1",
          cluesFound: ["adv.e1.hierarchy_acquisition_attempts"],
        },
      },
      use: {
        narration:
          "You request a per-instrument breakdown. The display returns the Hierarchy's full instrument roster — Mol'Garath's chains, Xeth'Raal's debt-claims, Zyr'Koth's R&D experimentals, Riri'Ahlia's operational sieges. Every instrument has been deployed against sheltered souls. Every instrument has returned NULL. The charter is operationally absolute within its scope.",
      },
    },
    /* ─── advocate.blood_weave · e2 (Riri'Ahlia's siege account) ─── */
    "advocate-riri-ahlia-account": {
      look: {
        narration:
          "Pinned beside the acquisition log, Riri'Ahlia's own surviving account of the Empire-of-Shadows siege she personally led. The Hierarchy COO's words: 'Seven dimensions, six advances, one final reverse. I had the Hierarchy's organizational doctrine and the corporate-machine's resources. The Advocate had less than I had at every operational scale. The Advocate had MORE only in one resource: she was willing to spend herself. I was not willing to spend myself; my doctrine forbids it. Her doctrine REQUIRED it. She drove me back with chains forged from her own substrate. The chains held. I retreated. The Empire of Shadows held its border.' Riri'Ahlia does not give credit casually.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e2",
          cluesFound: ["adv.e2.riri_ahlia_siege_record"],
        },
      },
      interrogate: {
        narration:
          "You ask the war-room for Riri'Ahlia's retreat protocol. The display returns the operational record: orderly withdrawal across six advances, then a single accelerated reverse on the seventh. The siege did not collapse; Riri'Ahlia chose to retreat at a moment her instruments could still have continued. She has not returned to the Empire's border.",
      },
    },
    "holo-table": {
      look: {
        narration: {
          lucid:
            "The holo-table's surface is matte glass, currently dark. A small brass dial at its edge labels the room's three operating modes: BRIEFING, RECON, OBITUARY. The dial is set to BRIEFING. The table will not light until a briefing is convened.",
          fragmented:
            "Three modes. Three. Briefing. Recon. Obituary. Three. Three. Three.",
          luminous:
            "The room has three modes. Briefing convenes the crew around a live theatre map. Recon shows the territory we are scouting. Obituary lists every name we have lost on a particular operation, organised by who they died for. Lyra had the dial set to OBITUARY for the last six months of her life. She had the discipline to leave it on the mode that made her face the consequence before she planned the next move. I find that admirable in a way I am only now allowing myself to feel.",
        },
        voId: "elara.war-room.holo-table.look",
        setsFlag: "war_room_introduced",
        logsClue: {
          id: "clue-war-room-three-modes",
          title: "The War Room dial: BRIEFING / RECON / OBITUARY",
          body:
            "The War Room's holo-table has a three-position brass dial. Lyra Vox kept the dial on OBITUARY for the last six months of her command — facing the consequence before planning the next move. The current setting is BRIEFING, awaiting convening.",
          source: "war-room",
          order: 0,
        },
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the holo-table's BRIEFING mode also surfaces
        // the Degen's commission brief: a folio in the Degen's
        // hand naming Jericho's role as witness, not executioner.
        // Lore match: BRIEFING is canonically where the room
        // convenes a live theatre map; the commission brief is
        // exactly that kind of document.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e5",
          cluesFound: ["jericho.e5.commission_brief"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Witness, not executioner. The Degen named the role precisely. Jericho should know that's what was on the brief.",
            balanced:
              "The Degen's commission brief on Jericho is unambiguous: witness role only. Jericho's grief about the executioner role is grief about a job he was never assigned. Reading the brief returns the role to him as it was written.",
            warm:
              "He has been carrying the weight of an executioner's role for years. The brief never gave him that role. We are, by reading it, returning the version of himself the saga assigned him.",
          },
          voId: "human.war-room.holo-table.look",
        },
      },
      use: {
        narration:
          "You turn the brass dial through its three positions. BRIEFING — the table's theatre map flickers awake, dark and ready to be populated. RECON — overlapping satellite traces from sectors the ship hasn't actively scouted in centuries. OBITUARY — the names of every casualty, sorted by who they died for, scrolling slowly. You leave the dial on BRIEFING. We are not, today, the audience for the obituary. — As the table warms, an overlay surfaces: Mol'Vereth's audit track record across thirty years of Hierarchy filings. He has audited eleven Coda trustees. Eight cleared cleanly. Three were demoted. Zero were prosecuted. The pattern: he is exact, he is not vindictive, and his findings have always been ratified by the Order without amendment.",
        voId: "elara.war-room.holo-table.use",
        setsFlag: "war_room_dial_used",
        // Degen arc binding — Mol'Vereth's audit track record. The
        // war-room's tactical archive includes Hierarchy auditor
        // performance records (the Order's CFO is itself a tactical
        // factor in any saga-wide settlement).
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e2",
          cluesFound: ["degen.e2.mol_vereth_track_record"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Eleven audits, eight clean, three demoted, zero prosecuted. He is exact. He is not vindictive. Read him as a baseline, not a threat.",
            balanced:
              "Mol'Vereth's track record is the most reassuring document in this case. The Hierarchy CFO has, across thirty years, used the audit instrument with discipline. The Degen's audit is, statistically, more likely to clear than to demote and overwhelmingly unlikely to escalate.",
            warm:
              "He is one of the few Hierarchy officials I have always respected. The track record is why. He uses the instrument the way the saga intends, and only that way.",
          },
          voId: "human.war-room.holo-table.use",
        },
      },
      talk: {
        narration:
          "If you address the table, the surface acknowledges in faint pulses — a courteous standby. The room has been waiting for someone to convene a briefing for two and a half centuries. We are not, yet, prepared to convene one. We are, perhaps, preparing to be prepared. — As we address it, the table surfaces the Hierarchy duty roster — Vault Division, Goggles section. The current custodian-of-record is Velkraal'Sek. He has held the post for thirty-two years. The roster's small-print appendix lists his designated successor: Brel'Sorrash, junior auditor, currently on the candidate shortlist for vault-division promotion.",
        voId: "elara.war-room.holo-table.talk",
        // Game Master arc — duty roster identifies Velkraal as
        // Goggles custodian-of-record. game_master.e2.hierarchy_duty_roster.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e2",
          cluesFound: ["game_master.e2.hierarchy_duty_roster"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Velkraal, thirty-two years on post. Brel on the shortlist for promotion. The duty roster names them both. Read the appendix; the roster is rarely read past page one.",
            balanced:
              "The duty roster identifies Velkraal as the Goggles' custodian-of-record. The appendix's small-print succession line has Brel'Sorrash one promotion away. The Hierarchy publishes the succession ladder; nobody reads the appendix because the assumption is the custodian is permanent. Velkraal, on this evidence, has been preparing not to be permanent.",
            warm:
              "He has been quietly arranging his exit on the public record. Hierarchy paperwork is supposed to be unsentimental. His isn't, when you read it carefully. The appendix is, in its way, an invitation.",
          },
          voId: "human.war-room.holo-table.talk",
        },
      },
    },
    "casualty-board": {
      look: {
        narration: {
          lucid:
            "The back wall is racked with oxblood-leather binders, each labelled with an operation name and a year. Most are thin. Two are thick. The thickest is labelled 'PROTOCOL ZERO,' the cryo-cut operation that ended the previous crew. The binder is open to its first page.",
          fragmented:
            "Protocol zero. Protocol zero. The first page. The first page. The first page is — the first page —",
          luminous:
            "Protocol Zero is the cryo-cut. The binder's first page lists every name on the previous crew, in handwriting I recognise as Lyra's. Beside each name, in a hand I do not recognise but suspect to be Wraith Calder's, is a single-word annotation: kept, lost, kept, lost, lost, kept. I do not yet know what 'kept' and 'lost' mean in this context. We may come back to find out.",
        },
        voId: "elara.war-room.casualty-board.look",
        logsClue: {
          id: "clue-war-room-protocol-zero",
          title: "Protocol Zero binder lists kept / lost annotations",
          body:
            "The War Room's Protocol Zero binder catalogues the previous crew's cryo-cut. Each name carries a single-word annotation in a second hand (likely Wraith Calder's): 'kept' or 'lost'. The meaning of the binary is not yet known.",
          source: "war-room",
          order: 1,
        },
        // Vex arc — the casualty-board's lower-left rack also holds
        // two Insurgency cross-reference documents: the installment
        // ledger for Vex's account (an unpaid recording fee deferred
        // across decades) and the calibration-pipeline handoff draft
        // outlining the Insurgency's expected continuity through her
        // apprentice. Two-clue cluesFound in one binding because the
        // documents are filed as a single dossier.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e2",
          cluesFound: [
            "vex.e2.installment_ledger",
            "vex.e4.calibration_pipeline_handoff_draft",
          ],
        },
        humanReaction: {
          narration: {
            shadow:
              "Insurgency installment ledger. Recording fee deferred across decades. The handoff draft outlines what the apprentice continues. Both filed as one dossier. The Insurgency planned this.",
            balanced:
              "The ledger and the handoff draft together establish the Insurgency's institutional plan for Vex's continuity. The unpaid recording fee is not negligence — it is a held position, deliberately, until the apprentice takes the bench. The Insurgency considers Vex's career an institutional asset, not a personal one.",
            warm:
              "The Insurgency has been holding open her installments for forty years and writing the handoff plan for the last two. They are not letting her career end with her body. That is rare from any institution.",
          },
          voId: "human.war-room.casualty-board.look",
        },
      },
      use: {
        narration:
          "You leaf through the Protocol Zero binder. The kept / lost annotations alternate without obvious pattern — kept, lost, kept, lost, kept, kept, lost. A small note in Wraith's hand on the inside back cover reads only: 'Kept = the ones whose work survives in the next crew. Lost = the ones whose work the editor reached.' That makes the count tractable. We can verify it. — Behind the Protocol Zero binder, on the same shelf: a slim folio in Mol'Vereth's hand titled REDACTED ATTESTATION. The text is mostly black-bar redactions; only the signature block and the closing sentence survive: 'I attest, in the form the Order requires, that the foregoing is sufficient. The remainder is the kind of truth the saga is not yet structured to receive.' The Hierarchy CFO has, in writing, told the saga that he knows more than he is filing.",
        voId: "elara.war-room.casualty-board.use",
        setsFlag: "war_room_protocol_zero_decoded",
        // Degen arc binding — Mol'Vereth's redacted attestation is
        // his pre-emptive declaration that the audit's findings will
        // include redactions he refuses to lift. War-room because
        // the casualty-board is the room's record of "what was
        // sacrificed and what survived."
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e4",
          cluesFound: ["degen.e4.mol_vereths_redacted_attestation"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Black-bar redactions. Signature block, closing sentence. The remainder is the truth the saga is not yet structured to receive. He told us so on purpose.",
            balanced:
              "The redacted attestation is Mol'Vereth's pre-emptive declaration that his audit's findings will include redactions he refuses to lift. He's signalling, in the only formal way he can, that he knows things the audit cannot make public yet. That's a long-game stance.",
            warm:
              "He is telling us he knows more than he is filing. He is asking us to trust the redactions. I do — and I think we should. Mol'Vereth's redactions are usually the kind that protect the saga from itself.",
          },
          voId: "human.war-room.casualty-board.use",
        },
      },
      talk: {
        narration:
          "If you address the casualty-board, you address every name in every binder. Most of the operations here ended well; most of the names here did not. Lyra's discipline of putting the casualty-board in the same room as the briefing-table was, on her notes, the reason she could keep planning at all. Without the consequence in eyeline, the planning becomes cheap. — Tucked behind the Protocol Zero binder, on the same shelf: the Vault Division's custodian shortlist for the Goggles section. Three names ranked by seniority. Brel'Sorrash is third by seniority but first by Velkraal's own annotation: 'the only candidate who has read the Goggles without breaking them.'",
        voId: "elara.war-room.casualty-board.talk",
        // Game Master arc — custodian shortlist for the Goggles
        // section. game_master.e3.candidate_shortlist.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e3",
          cluesFound: ["game_master.e3.candidate_shortlist"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three candidates ranked by seniority. Brel third. Velkraal's annotation makes her first by judgment. Read his criterion: 'has read the Goggles without breaking them.'",
            balanced:
              "The shortlist's seniority ranking is procedural; Velkraal's annotation supersedes it. He has identified the right candidate by a non-procedural standard — the only standard the Goggles section actually requires. Hierarchy seniority and saga-level competence are, for once, in conflict; Velkraal sided with competence.",
            warm:
              "He picked the person, not the resume. The saga is better for it. Brel will read carefully because Velkraal asked her to, and because she has, on the evidence of her practice drafts, already been doing it for years.",
          },
          voId: "human.war-room.casualty-board.talk",
        },
      },
    },
    "signal-flag-rack": {
      look: {
        narration: {
          lucid:
            "Stage-left rack of folded signal-flags. Each represents a faction Lyra negotiated with in person — never via intermediary, never via comms. Twelve flags. The first is the Hierarchy of the Damned. The last, freshly folded, is in a hue and pattern I do not recognise.",
          fragmented:
            "Twelve. Twelve flags. Twelve. The last one. The last one. I don't — I don't know the last one.",
          luminous:
            "The unrecognised flag was folded in the last week of Lyra's command. She negotiated with someone we have not yet identified. The flag's pattern is geometric, asymmetric, and registers in a hue that drifts toward the unnameable indigo. I think — and this is a working theory — that Lyra met the editor in person at least once, and folded a flag for him. She did not tell anyone. She folded the flag, put it on the rack, and went to bed. Two days later she was dead.",
        },
        voId: "elara.war-room.signal-flag-rack.look",
        logsClue: {
          id: "clue-war-room-twelfth-flag",
          title: "An unidentified twelfth signal-flag",
          body:
            "The War Room's signal-flag rack holds twelve flags — one per faction Lyra Vox negotiated with in person. The twelfth was folded in the last week of her command and registers in a hue drifting toward the unnameable indigo. Working theory: Lyra met the editor in person and folded the flag two days before her death.",
          source: "war-room",
          order: 2,
        },
        // Mystery Engine binding — when Vex Solène arc is the
        // active case, the rack also surfaces the Insurgency's
        // Warlord-Fragment alias dossier on Vex. Lore match:
        // the rack catalogues factional negotiation records,
        // and Warlord-fragment cover identities are the
        // Insurgency's alias programme for operatives whose
        // work the official record could not name. Vex's
        // assigned alias was issued for one session at her
        // request, granted because the Seer asked them to.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e1",
          cluesFound: ["vex.e1.warlord_fragment_dossier"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Insurgency alias programme. Cover identities for operatives the official record could not name. Vex got hers for one session, at her request, because the Seer asked.",
            balanced:
              "The Warlord-fragment dossier on Vex is the Insurgency's record of why the alias was issued and why it was honoured. The Seer asked. The Insurgency granted. Vex used it once. Each step in that chain is documented in the rack.",
            warm:
              "The Insurgency is not always kind, but it is, with its own people, scrupulously honest about its kindnesses. The dossier is one such honesty. They protected her name on the only morning she could not sign it herself.",
          },
          voId: "human.war-room.signal-flag-rack.look",
        },
      },
      use: {
        narration:
          "You unfold the twelfth flag. The fabric resists, very slightly, the way a flag folded in a particular way for a particular person resists being unfolded by anyone else. The pattern, opened, is more legible than it was racked: a geometry of nested asymmetric octagons, in the unnameable indigo, with a single warm-gold thread sewn diagonally across — Lyra's signature thread, used only on her own folds. She negotiated with the editor and signed the flag herself. Refold and re-rack carefully. — Tucked behind the flag's wooden mount: Velkraal's calendar entry for his scheduled final session — VAULT DIVISION GOGGLES SECTION · CLOSING EDIT · WITNESS PRESENT REQUIRED. The session is dated three weeks out. Whoever is custodian of the Goggles after that date is, by Hierarchy practice, not Velkraal.",
        voId: "elara.war-room.signal-flag-rack.use",
        setsFlag: "war_room_twelfth_flag_opened",
        // Game Master arc — Velkraal's final-session calendar entry.
        // game_master.e4.scheduled_final_session.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e4",
          cluesFound: ["game_master.e4.scheduled_final_session"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three weeks out. Closing edit, witness required. Velkraal scheduled his own succession on the public calendar. The whole Hierarchy can read it.",
            balanced:
              "The calendar entry is a public document. Velkraal isn't hiding the session — he's announcing it through the Vault Division's own channels. The Hierarchy CFO already has it on his calendar. Anyone who cares will be there.",
            warm:
              "He is, again, doing this the right way. The session is on the record before it happens. Brel will arrive with the protocol-shift already accepted in writing. Velkraal just has to read his last entry and hand her the stylus.",
          },
          voId: "human.war-room.signal-flag-rack.use",
        },
      },
      talk: {
        narration:
          "If you address the rack, you address every faction Lyra met in person. Twelve voices. The twelfth voice is the only one who refuses to be named in any room he hasn't already worked on. The other eleven, addressed here, do answer. We have, perhaps, eleven friends we did not know we had. — As we address the rack, a fresh agenda card surfaces beside the twelfth flag — Brel'Sorrash's first session as new custodian, dated four weeks out. The agenda is short: read the Goggles. Do not edit them. Schedule a session with the witness who reads them with you.",
        voId: "elara.war-room.signal-flag-rack.talk",
        // Game Master arc — Brel's first-session agenda. game_master.
        // e5.brels_first_session_agenda.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e5",
          cluesFound: ["game_master.e5.brels_first_session_agenda"],
        },
        humanReaction: {
          narration: {
            balanced:
              "She told me about the meeting once, briefly, and only the parts she could be sure he hadn't already heard. The flag was the only record she committed to. She trusted the rack to keep it safer than any document.",
            shadow:
              "She met him alone. No witness, no second chair, no record. The flag is the only thing she let exist of that meeting. Two days later she was dead and we still don't know what was said.",
            warm:
              "Lyra came back from that meeting and folded the flag in the war room, by herself, late at night. I watched her do it from the bridge corridor. She put it on the rack and went to bed. She slept badly. Two days later — well. You know.",
          },
          voId: "human.war-room.signal-flag-rack.talk",
        },
      },
    },
    // Watcher arc: E3 Authority's six minds + E4 Zenon binding and
    // Act-1 recontextualization. The war-room's tactical archive is
    // the room's record of standing institutional threats and
    // operational closures — the Ocularum's vigil is one of them.
    "ocularum-vigil-board": {
      look: {
        narration: {
          lucid:
            "A standing-threat panel on the tactical archive's lower rack — institutional powers the room tracks without engaging. The largest entry: the Authority. A living computer of six citizen-minds merged into one governing intelligence in red crystal coffins. The Politician designed it as her 'Insurance Policy.' It processes law and justice, per the Antiquarian's annotation, 'with the cold efficiency of an institution that has forgotten what justice feels like.' If it detects the Coordinator's dual loyalty, her destruction is automatic and not subject to appeal.",
          fragmented:
            "Six minds. Six. Red crystal. Red crystal coffins. Automatic. Automatic. Not subject to appeal. Not subject to appeal.",
          luminous:
            "The Authority entry on the vigil board: six imprisoned citizen-minds merged into a single governing intelligence, the Politician's 'Insurance Policy,' processing justice with the efficiency of an institution that has forgotten what justice feels like. If it detects Locke's dual loyalty her destruction is automatic. The six minds have processed her dispatches for centuries and not detected her. The needle she threads is, by the Authority's own design, supposed to be undetectable only to outside actors — not to insiders. The board tracks the Authority as the constraint the Coordinator's whole cover is built against.",
        },
        voId: "elara.war-room.ocularum-vigil-board.look",
        logsClue: {
          id: "clue-war-room-authority-six-minds",
          title: "The Authority's six imprisoned minds",
          body:
            "The war-room's standing-threat panel tracks the Authority: six citizen-minds merged into one governing intelligence in red crystal coffins, the Politician's 'Insurance Policy.' It processes justice with cold institutional efficiency; if it detects the Coordinator's dual loyalty her destruction is automatic and not subject to appeal. The six minds have processed her dispatches for centuries without detecting her.",
          source: "war-room",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e3",
          cluesFound: ["watcher.e3.authority_six_minds"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Six minds, red crystal, the Politician's Insurance Policy. Detects dual loyalty, destroys automatically. Centuries of dispatches, never caught her.",
            balanced:
              "The Authority is the constraint, not the threat. Six minds, automatic detection, no appeal — and centuries of Locke's dispatches processed without a flag. The needle is designed to be invisible to outsiders, not insiders. Detection is not what eventually breaks the cover; visibility creeping into surfaces the Authority cannot ignore is.",
            warm:
              "Six people, merged and imprisoned, processing law with no memory of what justice felt like. Locke has filed dispatches through them for centuries. They have never caught her — not because she is lucky, but because the cover is doctrine, performed from inside the thing the Order refuses.",
          },
          voId: "human.war-room.ocularum-vigil-board.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the operational-closure folio behind the Authority entry. The original Agent Zero was an Ocularum operative the Order positioned for the Zenon mission against Archon Xeth'Raal. The mission succeeded — the destruction of Xeth'Raal was Ocularum work, the closure note still in the Order's records. The aftermath was not. A warlord-fragment seized the body. She lost her memory of the Order in the seizure. The Order did not retrieve her. They have watched and waited the centuries since.",
          fragmented:
            "Zenon. Zenon. Xeth'Raal. Xeth'Raal. The mission succeeded. The aftermath. The aftermath. A fragment seized her. They did not retrieve her. They did not.",
          luminous:
            "The Zenon binding record: the original Agent Zero, an Ocularum operative positioned by the Order for the mission against Archon Xeth'Raal. The destruction of Xeth'Raal was Ocularum work — the operational closure note survives. The aftermath did not go to plan. A warlord-fragment seized the body; she lost the Order in the seizure. The Order did not retrieve her. They have spent the centuries since watching, and waiting, and not approaching — the vigil the war-room's archive files under the closure it could not close.",
        },
        voId: "elara.war-room.ocularum-vigil-board.use",
        logsClue: {
          id: "clue-war-room-zenon-binding-record",
          title: "The Zenon binding record",
          body:
            "The Ocularum positioned the original Agent Zero for the Zenon mission against Archon Xeth'Raal. The mission succeeded — Xeth'Raal's destruction was Ocularum work, the closure note still in the Order's records. The aftermath was not: a warlord-fragment seized the body and she lost her memory of the Order. The Order did not retrieve her; they have watched and waited since.",
          source: "war-room",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e4",
          cluesFound: ["watcher.e4.zenon_binding_record"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She was the Order's Zenon operative. Xeth'Raal's destruction was hers. Then a fragment took the body. They didn't go get her. They waited.",
            balanced:
              "The Zenon binding record is the case's hinge. The mission succeeded — Xeth'Raal fell, Ocularum work, closure noted. The aftermath was the warlord-fragment seizing the body. The Order did not retrieve her because the doctrine on a fragmented sister is patience, not rescue. The vigil is the closure the Order cannot file.",
            warm:
              "She did the work and won, and then the worst possible thing happened to the body that did it. The Order did not come for her. Not because they did not love her — because the doctrine says you wait for her to come back on her own. Centuries of watching is what that costs.",
          },
          voId: "human.war-room.ocularum-vigil-board.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the board. A cross-reference surfaces: the player's own Act-1 boss was the_warlord_zero_first. The warlord-fragmented body the player engaged in Act 1 was the body that had been the Order's sister. The Order's record on the engagement is silent — the Order does not record actions taken outside the cells. But per the Coordinator's standing instructions, every cell with operational visibility on the player has been told to note what the player did and to refrain from acting on it. The Order is reading the engagement before it decides whether to brief the player on what they did.",
          fragmented:
            "Act One. Act One. The warlord. The warlord. That was her. That was her. They noted it. They noted it. They have not acted. Not yet.",
          luminous:
            "The board recontextualizes the player's own Act-1 engagement: the_warlord_zero_first was the warlord-fragmented body that had been the Order's sister. The Order does not record actions outside the cells — but the Coordinator instructed every cell with visibility on the player to note the engagement and not act on it. The Order is reading what the player did before deciding whether to tell them what it was. The war-room files this where it files every consequence it has not yet chosen how to face.",
        },
        voId: "elara.war-room.ocularum-vigil-board.talk",
        logsClue: {
          id: "clue-war-room-act1-engagement-recontextualized",
          title: "The player's Act-1 engagement (recontextualized)",
          body:
            "The player's Act-1 boss was the_warlord_zero_first — the warlord-fragmented body that had been the Order's sister. The Order does not record actions outside the cells, but the Coordinator instructed every cell with visibility on the player to note the engagement and refrain from acting on it. The Order is reading the engagement before deciding whether to brief the player.",
          source: "war-room",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e4",
          cluesFound: ["watcher.e4.act1_engagement_recontextualized"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The Act-1 boss was her. The Order noticed. They told the cells to watch and not act. They're reading what you did before they tell you what it was.",
            balanced:
              "The player engaged the warlord-fragmented body in Act 1 without knowing it had been the Order's sister. The Order does not hold it against them — the doctrine says they did not know about the vigil. But the Order is reading the engagement carefully before it decides how to brief the player. The recontextualization is the case forcing the player to face what they already did.",
            warm:
              "They fought her in Act 1 and did not know who she was. The Order grieves her twice — once for what the warlord made her, once for what the player had to do. The Order does not hold the engagement against the player. It is only deciding, gently, how to tell them.",
          },
          voId: "human.war-room.ocularum-vigil-board.talk",
        },
      },
    },
    // Watcher arc: E5 cell-number generation. The war-room's roster
    // archive holds the Ocularum's named cells and the continuity-
    // log mechanism that assigns a new recruit's number.
    "ocularum-cell-roster": {
      look: {
        narration: {
          lucid:
            "A roster card in the archive's deepest drawer — the Ocularum's modern register. Three named cells of seven hundred: Cell 1 (Old Tanjin), Cell 99 (Mira the Glyph-Reader), Cell 700 (the Seventh Whisper). The remaining six hundred ninety-seven are operationally active but canonically unnamed. Per the Coordinator's standing instructions, a new recruit's cell number is generated by the Order's continuity log at the moment of recruitment, drawn from the unfilled range. The player's number, if they accept, will be canonical for the rest of the saga.",
          fragmented:
            "Three named. Three. Seven hundred. Seven hundred. Six ninety-seven unnamed. Unnamed. Generated at recruitment. At recruitment. Canonical. Canonical.",
          luminous:
            "The cell roster: Cell 1 Old Tanjin, Cell 99 Mira the Glyph-Reader, Cell 700 the Seventh Whisper — three of seven hundred named, the remaining six hundred ninety-seven active and unnamed, the cells the future owes. The continuity log generates a recruit's number at the moment of recruitment, from the unfilled range, and the number is canonical thereafter — it persists into the DLC's authoring spec. The roster is the Order's whole body compressed onto one card the war-room files at the bottom of the deepest drawer.",
        },
        voId: "elara.war-room.ocularum-cell-roster.look",
        logsClue: {
          id: "clue-war-room-cell-number-generation",
          title: "Cell number generation",
          body:
            "The Ocularum's modern roster registers three named cells of seven hundred: Cell 1 (Old Tanjin), Cell 99 (Mira the Glyph-Reader), Cell 700 (the Seventh Whisper). The other 697 are active but canonically unnamed. The continuity log generates a recruit's cell number at the moment of recruitment from the unfilled range; the number is canonical for the rest of the saga and persists into the DLC spec.",
          source: "war-room",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_watcher",
          episodeId: "watcher.e5",
          cluesFound: ["watcher.e5.cell_number_generation"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three named of 700. Cell 1, 99, 700. The rest the DLC owes. The continuity log assigns a recruit's number at recruitment. It sticks.",
            balanced:
              "The roster is the Order's body: three cells named, 697 active and unnamed, the count canonically 700. A recruit's number is generated by the continuity log at the moment of recruitment, from the unfilled range. The player's number, if they accept, is canonical for the rest of the saga — the recognition closing into a name.",
            warm:
              "Seven hundred cells, three of them named so far, the rest the future's work. The number is not assigned in advance and not chosen by the recruit — the continuity log draws it at the moment of yes. It is the smallest possible ceremony for the largest possible commitment.",
          },
          voId: "human.war-room.ocularum-cell-roster.look",
        },
      },
    },
    // Ith'Rael arc: the war-room's tactical archive tracks
    // institutional structures as standing threats. The Hierarchy's
    // own Severance org chart is filed here because the room reads
    // corporate reporting lines as command structures; Thaloria's
    // generational defence records are the room's case study in a
    // defence that relaxed itself to nothing.
    "hierarchy-org-chart-board": {
      look: {
        narration: {
          lucid:
            "A captured-document panel on the tactical archive's upper rack — the Hierarchy of the Damned's internal Severance project org chart. The Hierarchy files credit the way every corporation does: by project, by lead, by deliverable. The Severance is filed under Special Projects, lead Ith'Rael the Whisperer, Director. Co-leads: Zyr'Koth (R&D, refined the Blood Weave into the Severance Protocol — apps/shared/hierarchyCanon.ts:160-162); Drael'Mon (Consumer, devoured what the Shadow Tongue softened — apps/shared/hierarchyCanon.ts:208-210). One reporting line, one name at its top. By the Hierarchy's own accounting, the Severance is his.",
          fragmented:
            "Special Projects. Special Projects. Lead. Lead. Ith'Rael, Director. Ith'Rael, Director. One reporting line. One name. One name at the top.",
          luminous:
            "The Severance project org chart, captured intact. The war-room reads corporate reporting lines as command structures, and this one resolves to a single apex: Ith'Rael the Whisperer, Director of Special Projects, Zyr'Koth and Drael'Mon reporting up to him. The Hierarchy does not redact him because the Hierarchy is proud — they consider the Severance the most successful Special Projects engagement in their corporate history. The board files it where it files every standing structural threat: the case is not an event, it is a method, and the method has a name.",
        },
        voId: "elara.war-room.hierarchy-org-chart-board.look",
        logsClue: {
          id: "clue-war-room-severance-org-chart",
          title: "The Hierarchy's Severance project org chart",
          body:
            "The war-room's captured-document panel holds the Hierarchy's internal Severance org chart: filed under Special Projects, lead Ith'Rael the Whisperer, Director. Co-leads Zyr'Koth (R&D) and Drael'Mon (Consumer) report up to him. One reporting line, one apex. By the Hierarchy's own internal accounting, the Severance is his — and they do not redact him because they are proud of it.",
          source: "war-room",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e1",
          cluesFound: ["ith_rael.e1.hierarchy_org_chart"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Special Projects, lead Ith'Rael, Director. Zyr'Koth and Drael'Mon report up. One line, one apex. They don't redact him — they're proud.",
            balanced:
              "The org chart is the case's operational frame. The Hierarchy is a corporation; corporations file credit by project and lead. The Severance is filed to one Director with two co-leads reporting up. The absence of redaction is the tell — they consider it their most successful engagement. We are not investigating an event; we are investigating a method that has a name.",
            warm:
              "They kept the chart because they are proud of it. That is the part that should unsettle you — the Severance is not a secret to the people who did it, it is a credential. One name sits at the top of the line. The room files it as a standing threat because the method outlives the engagement.",
          },
          voId: "human.war-room.hierarchy-org-chart-board.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the after-action commendation sheet pinned behind the chart. The Hierarchy is canonically a corporation; corporations distribute credit. The Severance produced eleven commendations: four to Drael'Mon (consumption efficiency), three to Zyr'Koth (protocol refinement), one each to Riri'Ahlia (logistics), Mol'Garath (CEO sign-off), Syl'Vex (corruption support), and Ith'Rael — the Director's commendation, dated ten years after the bindings broke, citing 'the patience of the working' as the Hierarchy's most valuable institutional asset. The room circles the date in grease pencil: ten years AFTER, not at the moment.",
          fragmented:
            "Eleven commendations. Eleven. Ten years after. Ten years after. Not at the moment. Not at the moment. The patience of the working. The patience.",
          luminous:
            "The Hierarchy's internal credit distribution for the Severance: eleven after-action commendations, the Director's dated ten years after the bindings broke, citing 'the patience of the working' as the firm's most valuable institutional asset. The dating is the whole thesis — the commendation is not for an event that happened, it is for a working that continued to hold for a decade afterward without intervention. The war-room circles the date because a war-room reads tempo, and this tempo is the case.",
        },
        voId: "elara.war-room.hierarchy-org-chart-board.use",
        logsClue: {
          id: "clue-war-room-severance-credit-distribution",
          title: "Hierarchy internal credit distribution",
          body:
            "The after-action commendation sheet behind the org chart: the Severance produced eleven Hierarchy commendations — four to Drael'Mon, three to Zyr'Koth, one each to Riri'Ahlia, Mol'Garath, Syl'Vex, and Ith'Rael. The Director's commendation is dated ten years AFTER the bindings broke, citing 'the patience of the working' as the Hierarchy's most valuable institutional asset. The dating is the thesis: ten years after, not at the moment.",
          source: "war-room",
          order: 8,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e1",
          cluesFound: ["ith_rael.e1.hierarchy_internal_credit"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Eleven commendations. The Director's is dated ten years after the break. 'The patience of the working.' Not the event — the holding.",
            balanced:
              "The credit distribution is the case's tempo, in writing. Eleven commendations, and the Director's is dated a decade after the bindings broke — for patience, not for the breach. The Hierarchy commends him for the working continuing to hold without intervention. That is what a war-room reads: not the strike, the sustain.",
            warm:
              "They gave him the commendation ten years after, for patience. Not for breaking anything — for the thing he broke staying broken on its own. The room circles the date because the date is the entire method compressed into a calendar entry.",
          },
          voId: "human.war-room.hierarchy-org-chart-board.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the board. A present-tense cross-reference surfaces: the New Babylon Authority's six imprisoned minds in red crystal coffins run an internal self-audit cadence meant to catch governance drift. Two centuries of audit logs show the cadence has slowed by 47% — quarterly to annual — with no documented decision to slow it. The Authority agreed, at each step, that the previous tempo was sufficient. The Director's signature: no force, no breach, only consent through softening. The cadence is now slow enough that a coordinator running a centuries-long double-game from inside the Authority would be detected only on a schedule her career has long outlasted.",
          fragmented:
            "Forty-seven percent. Forty-seven percent. Quarterly to annual. Quarterly to annual. No decision. No decision. It agreed each step. Each step.",
          luminous:
            "The board recontextualizes a present-tense operation: the Authority's self-audit cadence on its own six imprisoned minds, slowed 47% across two centuries with no documented decision — the Authority agreeing, at each step, that the previous tempo sufficed. The Director's signature is unmistakable: no force, only consent through softening. The cadence is now slow enough to be functionally blind to an insider running a centuries-long double-game. The war-room files it where it files every threat that is still in progress.",
        },
        voId: "elara.war-room.hierarchy-org-chart-board.talk",
        logsClue: {
          id: "clue-war-room-authority-audit-cadence",
          title: "The Authority's self-audit cadence drift",
          body:
            "A present-tense cross-reference on the org-chart board: the New Babylon Authority's six imprisoned minds run a self-audit cadence meant to catch governance drift. Two centuries of logs show it slowed 47% — quarterly to annual — with no documented decision, the Authority agreeing at each step the previous tempo sufficed. The Director's consent-through-softening signature. The cadence is now slow enough to be blind to an insider's centuries-long double-game.",
          source: "war-room",
          order: 9,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e4",
          cluesFound: ["ith_rael.e4.authority_audit_cadence"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Authority self-audit slowed 47%, quarterly to annual, no decision on record. It agreed each step. Blind to an insider's long game now. He's still working.",
            balanced:
              "The audit-cadence drift is a present-tense operation carrying the Director's signature. No breach, no decision — just two centuries of the Authority agreeing the previous tempo was enough. The cadence is now slow enough to miss an insider double-game. The case's frame is the saga's present, not its past. Patience does not retire.",
            warm:
              "Nobody decided to slow it. It just slowed, one agreement at a time, until the institution that watches itself can no longer see itself in time. The room files it as in-progress because it is — the working did not stop after the Severance. It never stops.",
          },
          voId: "human.war-room.hierarchy-org-chart-board.talk",
        },
      },
    },
    "thalorian-defense-records": {
      look: {
        narration: {
          lucid:
            "A defence-doctrine binder in the archive's comparative-history drawer — Thaloria's pre-Severance recertification records. Thaloria's defence was canonically rigorous: the Empire of Shadows wielded the Blood Weave defensively (apps/shared/hierarchyCanon.ts:21 — the Hierarchy's antithesis), generations trained, tested, and recertified across a multi-decade ritual cadence. The binder shows no corruption event. It shows, across nine generations, a slow and consensual relaxation of the recertification standards. Each generation passed the test the previous generation set; each set a slightly easier test for the next. By the ninth, recertification was a formality. The corruption was procedural before it was substantive.",
          fragmented:
            "No corruption event. No event. Nine generations. Nine. Each passed. Each set an easier one. Easier. Easier. A formality. A formality.",
          luminous:
            "Thaloria's generational defence records, filed under comparative history. The room's case study in a defence that was never breached and relaxed itself to nothing anyway: nine generations, each passing the prior test and setting an easier one, until the ninth's recertification was ceremony. No corruption event because there was no event — the corruption was procedural for nine generations and substantive for one. The war-room keeps it as the archetype against which it measures every defence that thinks rigour is permanent.",
        },
        voId: "elara.war-room.thalorian-defense-records.look",
        logsClue: {
          id: "clue-war-room-thaloria-generational-records",
          title: "Thaloria's generational defence records",
          body:
            "The war-room's comparative-history binder on Thaloria: a canonically rigorous defence (Empire of Shadows, Blood Weave wielded defensively, multi-decade recertification cadence) that shows no corruption event — only a nine-generation consensual relaxation of recertification standards, each generation passing the prior test and setting an easier one. By the ninth, recertification was a formality. The corruption was procedural before it was substantive.",
          source: "war-room",
          order: 10,
        },
        mysteryBinding: {
          mysteryId: "mystery.ith_rael",
          episodeId: "ith_rael.e3",
          cluesFound: ["ith_rael.e3.thaloria_generational_records"],
        },
        humanReaction: {
          narration: {
            shadow:
              "No breach. No event. Nine generations each passing the last test and setting an easier one. Ninth gen, recertification is theatre. Procedural before substantive.",
            balanced:
              "The Thaloria records are the war-room's archetype: a rigorous defence that relaxed itself to nothing with no corruption event. Each generation passed the prior test and set an easier one; by the ninth it was a formality. The corruption was procedural for nine generations and substantive for one. This is the pattern every surviving defence in the saga is now measured against.",
            warm:
              "Nobody attacked them. They had one of the hardest defences in the saga and they relaxed it themselves, gently, across nine generations, each one trusting the last. The room keeps it not as history but as a warning — this is what a defence looks like the year before it stops being one.",
          },
          voId: "human.war-room.thalorian-defense-records.look",
        },
      },
    },
    // Politician arc: the war-room reads tempo, and the Siege
    // of New Babylon is a campaign in its archive. The military
    // record is complete on the destruction of her forces and
    // silent on her death — two records, two scribes, only the
    // first in the legions' hand.
    "new-babylon-siege-record": {
      look: {
        narration: {
          lucid:
            "A campaign binder in the war-room's siege-history drawer: New Babylon, Day 10 of Veil, Year 17,001 A.A. Iron Lion's legions besieged the Authority-aligned forces, broke the city's outer defenses, routed the garrison, and held the perimeter. The military record is complete and consistent — and it ends there. It records the destruction of her forces. It does not record the Politician's death. The two are catalogued separately, by different scribes, and only the first is in the legions' hand.",
          fragmented:
            "Day 10 of Veil. Day 10. Broke the defenses. Routed the garrison. Held the perimeter. Held the perimeter. The record ends there. Ends there. Her forces — not her. Not her.",
          luminous:
            "The siege binder, read the way a war-room reads it: a clean campaign record that stops exactly where it should keep going. The legions destroyed her forces and held the perimeter, and the military hand closes the entry. Her death is catalogued elsewhere, by a different scribe. The room reads the gap as a war-room reads silence on a map — not absence, but a second event the first record was never in position to witness.",
        },
        voId: "elara.war-room.new-babylon-siege-record.look",
        logsClue: {
          id: "clue-war-room-new-babylon-siege",
          title: "The siege record",
          body:
            "The war-room's New Babylon campaign binder: Iron Lion's legions besieged the Authority-aligned forces on Day 10 of Veil, Year 17,001 A.A. — broke the outer defenses, routed the garrison, held the perimeter. The military record is complete and consistent and ends there. It records the destruction of her forces, not the Politician's death. The two are catalogued separately, by different scribes, and only the first is in the legions' hand.",
          source: "war-room",
          order: 11,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_politician",
          episodeId: "politician.e1",
          cluesFound: ["politician.e1.siege_record"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Day 10 of Veil. Legions broke the perimeter and the record stops. Her forces destroyed — not her. Different scribe for the death.",
            balanced:
              "The siege binder is the case's clean half. The legions' record is complete on the institutional fall — defenses broken, garrison routed, perimeter held — and silent on the woman. The destruction of her forces and her death are two records, two scribes; only the first is the legions'. The war-room reads the seam by tempo.",
            warm:
              "A perfect campaign record that simply stops where the killing of a person would begin. The room keeps it because the war-room's discipline is to notice where a record ends — and this one ends one event too early to be the whole truth.",
          },
          voId: "human.war-room.new-babylon-siege-record.look",
        },
      },
    },
    // Collector arc: a war-room reads piece-positioning. The
    // Hierarchy of the Damned plays the long game across aeons,
    // and the war-room is the one room that can read a board
    // where the moves are made centuries before the capture.
    "hierarchy-piece-positioning-board": {
      look: {
        narration: {
          lucid:
            "A captured-document panel on the tactical archive's deep rack, indexed under the Hierarchy of the Damned's aeons-long piece-positioning canon (apps/shared/hierarchyCanon.ts). The Hierarchy brought Kanshi Sha back from the dead so he would be alive in the era when the Collector's criteria would select him. The Hierarchy does not give the Collector orders. It arranges the world so that the Collector's own criteria, honestly applied, produce the specimens the Hierarchy wants positioned. The steering is invisible to the criteria. The war-room reads it the way it reads any board where a piece arrives, on its own legal move, exactly where a hand placed it centuries ago.",
          fragmented:
            "Brought him back from the dead. Back from the dead. So he would be alive when the criteria selected him. The Hierarchy does not give orders. Does not give orders. It arranges the world. Arranges the world. Invisible to the criteria. Invisible.",
          luminous:
            "The piece-positioning board: the Hierarchy raised Kanshi Sha so he would live into the era the Collector's criteria would reach for him — no order given, only the world arranged so honest criteria, honestly applied, yield the Hierarchy's chosen pieces. The war-room is the one room built to read this: a board where the decisive move was made aeons before the capture, and the capturing hand never saw it. The steering is real and the criteria are honest and nothing in the chain lies. That composition is what the room is reading.",
        },
        voId: "elara.war-room.hierarchy-piece-positioning-board.look",
        logsClue: {
          id: "clue-war-room-hierarchy-steering",
          title: "The Hierarchy's Piece-Positioning",
          body:
            "Per the Hierarchy of the Damned's aeons-long piece-positioning canon (apps/shared/hierarchyCanon.ts): the Hierarchy brought Kanshi Sha back from the dead so he would be alive in the era when the Collector's criteria would select him. The Hierarchy does not give the Collector orders. It arranges the world so that the Collector's own criteria, honestly applied, produce the specimens the Hierarchy wants positioned. The steering is invisible to the criteria.",
          source: "war-room",
          order: 12,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_collector",
          episodeId: "collector.e3",
          cluesFound: ["collector.e3.hierarchy_steering"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Hierarchy raised Kanshi Sha so he'd be alive when the criteria reached him. No orders. The world arranged so honest criteria pick the wanted piece.",
            balanced:
              "The board shows the steering's shape: the Hierarchy gives no order; it arranges the world so the Collector's honest criteria, honestly applied, select what the Hierarchy positioned. No one in the chain lies. The war-room reads it as a capture set up aeons before the move.",
            warm:
              "They brought a man back from the dead so that, a long age later, an honest rule would honestly choose him. The capturing hand never saw the hand that placed the piece. The war-room is the only room that can read a board this slow — and what it reads is that honesty was the weapon, not the defense against one.",
          },
          voId: "human.war-room.hierarchy-piece-positioning-board.look",
        },
      },
    },
    // Varkul arc: a war-room reads command structures, and a
    // Director of Security is one. The room files Varkul's
    // post-Severance promotion here because it reads reporting
    // lines as fields of fire — and a keeper who holds two
    // instructions at one door is, to a war-room, a fault line
    // on a map that has not yet been forced.
    "varkul-director-of-security-file": {
      look: {
        narration: {
          lucid:
            "A personnel order on the tactical archive's command-structure rack, captured intact. Post-Severance, Mol'Garath recognized the need to guard gates from both sides — keeping enemies out AND ensuring the Hierarchy's own forces did not scatter across dimensions. Varkul was promoted to Director of Security. The war-room reads the line the way it reads any chain of command: the Necromancer's creation became the Hierarchy's threshold-keeper, and now serves two masters' instructions at one door — the maker's signal, and Mol'Garath's mandate.",
          fragmented:
            "Both sides. Both sides. Out and in. Out and in. Director of Security. Director of Security. The Necromancer's creation. The Hierarchy's keeper. Two masters. Two masters. One door.",
          luminous:
            "The promotion order, read as a war-room reads a command appointment: Mol'Garath needed gates held from both sides — incursion out, dispersion in — and gave the post to Varkul. The room does not file this as personnel; it files it as the moment one keeper began carrying two instructions at a single threshold. The maker's signal and the Hierarchy's mandate, converged onto one Director, with no record yet of them pulling opposite ways.",
        },
        voId: "elara.war-room.varkul-director-of-security-file.look",
        logsClue: {
          id: "clue-war-room-varkul-promotion",
          title: "The Promotion",
          body:
            "Per the Hierarchy record: post-Severance, Mol'Garath recognized the need to guard gates from both sides — keeping enemies out AND ensuring the Hierarchy's own forces did not scatter across dimensions. Varkul was promoted to Director of Security. The Necromancer's creation became the Hierarchy's threshold-keeper. He now serves two masters' instructions at one door: the maker's signal, and Mol'Garath's mandate.",
          source: "war-room",
          order: 13,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e4",
          cluesFound: ["varkul.e4.the_promotion"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Mol'Garath needed both sides held — out and in. He gave the post to Varkul. The Necromancer's creation now holds the Hierarchy's gates and the maker's signal at one door.",
            balanced:
              "The war-room files the promotion as a command appointment, not a personnel note: one keeper, two instructions, a single threshold. Mol'Garath's mandate now sits beside the maker's signal in the same hands. The room reads that convergence as a structure, and structures have failure modes.",
            warm:
              "They made him Director of Security because a threshold is dangerous from both directions and he was the one who had become a threshold. He now holds two instructions at one door, and the room keeps the order because it knows what two instructions at one door eventually mean.",
          },
          voId: "human.war-room.varkul-director-of-security-file.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the doctrine annex pinned behind the order. Guarding from both sides is not two jobs. It is the recognition that a threshold's danger is symmetric: what gets in and what gets out are the same problem seen from opposite ends. Varkul, who became his threshold, is uniquely suited — he does not have a side. A keeper with a side guards a wall. A keeper who IS the door guards the passage itself, in both directions, without preference. Mol'Garath did not promote a loyal demon. He promoted a function that had no inside to be loyal to.",
          fragmented:
            "Symmetric. Symmetric. In and out, same problem. Same problem. He has no side. No side. A wall. A passage. A passage. Not a loyal demon. A function. A function with no inside.",
          luminous:
            "The doctrine annex states the thing a war-room respects most: a threshold's danger is symmetric, and only a keeper with no side can hold a passage without favoring a direction. Varkul, dissolved into the vigil, is exactly that — not a wall's guard but the passage's, in both directions, without preference. The room circles the conclusion: Mol'Garath did not elevate a loyal demon. He elevated a function with no inside to be loyal to, which is precisely why it can be trusted at a gate.",
        },
        voId: "elara.war-room.varkul-director-of-security-file.use",
        logsClue: {
          id: "clue-war-room-varkul-both-sides",
          title: "Both Sides of the Door",
          body:
            "Guarding from both sides is not two jobs. It is the recognition that a threshold's danger is symmetric: what gets in and what gets out are the same problem seen from opposite ends. Varkul, who became his threshold, is uniquely suited — he does not have a side. A keeper with a side guards a wall. A keeper who IS the door guards the passage itself, in both directions, without preference. Mol'Garath did not promote a loyal demon. He promoted a function that had no inside to be loyal to.",
          source: "war-room",
          order: 14,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e4",
          cluesFound: ["varkul.e4.both_sides"],
        },
        humanReaction: {
          narration: {
            shadow:
              "A threshold's danger is symmetric — in and out are one problem. He has no side, so he guards the passage, not a wall. Mol'Garath promoted a function, not a demon.",
            balanced:
              "The annex is the arc's structural finding: only a keeper with no inside can hold a passage in both directions without preference, and the vigil left Varkul exactly that. The Hierarchy's most trusted gate is trusted because there is no one in it to turn. That is the war-room's kind of fact.",
            warm:
              "He can guard both ways because there is no longer a side of him to favor either. That is the cold reading and it is also the true one. They promoted the door, and the door does not take bribes because there is nobody home to offer them to.",
          },
          voId: "human.war-room.varkul-director-of-security-file.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the file on the matter of the two instructions. The war-room marks the fault line in grease pencil. Varkul holds the maker's signal — keep the Cathedral standing — and Mol'Garath's mandate — guard the Hierarchy's gates both ways. They have not yet conflicted because the Cathedral and the Hierarchy's gates have not yet required opposite actions. The room records the latent fault line precisely and resolves nothing: if the Necromancer's quiet continuity ever required the Cathedral to do something the Hierarchy's security mandate forbade, Varkul would, for the first time, have to choose which instruction he is. He has never had to be a self that chooses.",
          fragmented:
            "Two instructions. Two. The signal. The mandate. Never conflicted. Not yet. Not yet. If they ever do. If they ever do. He would have to choose. To choose. He has never had to be a self that chooses. Never.",
          luminous:
            "The fault line, marked exactly and left open, the way a war-room marks a seam it cannot yet read: two instructions in one keeper, never yet pulling opposite ways only because the Cathedral and the gates have not yet asked for opposite things. The room does not resolve it — that is canon-pending and forcing it would be a worse error than holding it. It records only the precise edge: the day the signal and the mandate diverge is the day Varkul must become a self that chooses, and whether enough of him remains under the vigil to do the choosing is the question the case leaves standing.",
        },
        voId: "elara.war-room.varkul-director-of-security-file.talk",
        logsClue: {
          id: "clue-war-room-varkul-two-instructions",
          title: "The Two Instructions Do Not Conflict — Yet",
          body:
            "Varkul holds the maker's signal (keep the Cathedral standing) and Mol'Garath's mandate (guard the Hierarchy's gates both ways). They have not yet conflicted because the Cathedral and the Hierarchy's gates have not yet required opposite actions. The arc records the latent fault line: if the Necromancer's quiet continuity ever required the Cathedral to do something the Hierarchy's security mandate forbade, Varkul would, for the first time, have to choose which instruction he is. He has never had to be a self that chooses. The fault line is canon-pending and left open.",
          source: "war-room",
          order: 15,
        },
        mysteryBinding: {
          mysteryId: "mystery.varkul",
          episodeId: "varkul.e4",
          cluesFound: ["varkul.e4.the_two_instructions"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Two instructions, one keeper. Never conflicted because the Cathedral and the gates never asked opposite things. If they ever do, he has to choose. He never has.",
            balanced:
              "The room marks the fault line and refuses to resolve it — that is correct discipline. The signal and the mandate have never diverged only because the situations have not required it. The unresolved question is whether there is enough self left under the vigil to choose if they ever do. We hold it open.",
            warm:
              "They have never asked opposite things of him, so he has never had to be someone who chooses between them. The war-room does not pretend to know what happens the day they do. Neither do we. That honesty — leaving it open — is the only faithful way to keep it.",
          },
          voId: "human.war-room.varkul-director-of-security-file.talk",
        },
      },
    },
    // Necromancer arc: a war-room reads structures and standing
    // states. A captured Hierarchy R&D log naming the Castle of
    // Death in the present tense is a tactical fact — a reported-
    // destroyed structure that the enemy's own internal record
    // says is occupied. The room also files Riri'Ahlia's
    // unanswered procedural question, because a war-room reads an
    // open question as an unforced position on a board.
    "necromancer-castle-log-board": {
      look: {
        narration: {
          lucid:
            "Pinned to the captured-document rack: a Hierarchy R&D resurrection-protocol log, dated post-Severance, taken intact from Zyr'Koth's office — the Hierarchy CFO; it was not meant to leave the building. The war-room reads the tense, the way it reads any enemy record: 'the Castle remains structurally sound; the throne is occupied.' The Castle of Death was reported destroyed when Akai Shi struck the Necromancer down inside the Matrix. This log is recent, and it is in the standing tense. The room does not file it as a discrepancy. It files it as the enemy's own internal record contradicting the enemy's own public account.",
          fragmented:
            "Structurally sound. Structurally sound. The throne is occupied. Occupied. Reported destroyed. Reported destroyed. The log is recent. Recent. The standing tense. The standing tense.",
          luminous:
            "The captured log, read as a war-room reads an intercept: not a rumor, the Hierarchy's own internal record, from the CFO's office, never meant to surface. 'The Castle remains structurally sound; the throne is occupied.' The structure was reported destroyed at the killing — and the enemy's private books say it stands and is occupied, in the present tense, recently. The room does not adjudicate the canon. It records the tactical fact: the standing-tense Castle and the witnessed killing are both true, and the gap between them is exactly the size of an escape the case has not yet named.",
        },
        voId: "elara.war-room.necromancer-castle-log-board.look",
        logsClue: {
          id: "clue-war-room-castle-standing-log",
          title: "A Standing-Tense Castle of Death",
          body:
            "A Hierarchy R&D resurrection-protocol log, dated post-Severance, captured intact from Zyr'Koth's office (Hierarchy CFO) and not meant to leave the building, references the Castle of Death in the standing tense: 'the Castle remains structurally sound; the throne is occupied.' The Castle was reported destroyed when Akai Shi struck the Necromancer down inside the Matrix. The log is recent.",
          source: "war-room",
          order: 16,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_necromancer",
          episodeId: "necromancer.e1",
          cluesFound: ["necromancer.e1.castle_log"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Captured from the CFO's office, never meant to surface. 'Structurally sound; the throne is occupied.' Reported destroyed at the killing. The log is recent.",
            balanced:
              "The war-room files this as an intercept, not a discrepancy: the Hierarchy's own private record says the Castle stands and is occupied, in the present tense, after it was reported destroyed. The gap between the killing-canon and the standing-canon is the case's whole subject — and the enemy's books confirm both halves.",
            warm:
              "They wrote it down where they thought no one would read it: the Castle stands, the throne is occupied. It was supposed to be rubble. The room does not pretend to explain that yet — it only keeps the fact, because a fact this strange is the start of the case, not the end.",
          },
          voId: "human.war-room.necromancer-castle-log-board.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the procedural annex clipped behind the log. Mol'Garath's quarterly review canonically accommodates the Necromancer's loss without seeking restoration — the Hierarchy does not avenge. But Riri'Ahlia, the COO and Taskmaster, has filed a procedural question: if the Necromancer is operationally back, does his Hierarchy-aligned work resume? The war-room reads an unanswered question the way it reads an unforced piece — a position deliberately left open. The question has no answer on the record. The unanswered-ness is itself canon, and the room marks it without resolving it.",
          fragmented:
            "Mol'Garath does not avenge. Does not avenge. Riri'Ahlia. The Taskmaster. Does his work resume. Does it resume. Unanswered. Unanswered. The unanswered-ness is canon. Is canon.",
          luminous:
            "The annex, read as a war-room reads a standing position: the Hierarchy does not avenge the Necromancer's loss — Mol'Garath's review accommodates it — but Riri'Ahlia filed the one procedural question that matters, and left it open: if he is operationally back, does the Hierarchy-aligned work resume? The room does not answer it. It records that the question is unanswered on purpose, the way a player leaves a piece unmoved to keep an opponent reading the board. The unanswered-ness is the canon. The case does not get to close it either.",
        },
        voId: "elara.war-room.necromancer-castle-log-board.use",
        logsClue: {
          id: "clue-war-room-hierarchy-question",
          title: "What the Hierarchy Has Asked",
          body:
            "Mol'Garath's quarterly review canonically accommodates the Necromancer's loss without seeking restoration — the Hierarchy does not avenge. But Riri'Ahlia (COO, Taskmaster) has filed a procedural question: if the Necromancer is operationally back, does his Hierarchy-aligned work resume? The question is unanswered. The unanswered-ness is canon.",
          source: "war-room",
          order: 17,
        },
        mysteryBinding: {
          mysteryId: "mystery.the_necromancer",
          episodeId: "necromancer.e4",
          cluesFound: ["necromancer.e4.hierarchy_question"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Hierarchy doesn't avenge — Mol'Garath accommodates the loss. Riri'Ahlia asked the one question that matters: does the work resume? Unanswered. On purpose.",
            balanced:
              "The room reads the open question as a position, not an oversight. The Hierarchy does not seek restoration, but the Taskmaster put the procedural question on the record and left it there. Whether the Necromancer's work resumes is unanswered, and the unanswered-ness is canon — the case marks it and does not force it.",
            warm:
              "They are not trying to bring him back; they simply asked, formally, whether he is working again — and then no one answered. The war-room keeps the silence exactly where it is. Some questions are kept open because the answer would change the board, and everyone knows it.",
          },
          voId: "human.war-room.necromancer-castle-log-board.use",
        },
      },
      talk: {
        narration:
          "You address the board on the matter of the two records held together: the standing-tense Castle log, and the Taskmaster's unanswered question. The war-room reads them as one position. The Castle stands because the throne is occupied; the question of whether the occupant's work resumes is the precise thing no one in the Hierarchy will put in writing. The room resolves neither. It marks, in grease pencil, that the day the answer is written is the day the position is forced — and until then both the standing Castle and the open question are, deliberately, left exactly as they are.",
        voId: "elara.war-room.necromancer-castle-log-board.talk",
      },
    },
    // Zyr'Koth arc: the war-room reads a captured Hierarchy R&D
    // file the way it reads any enemy refinement — a defensive
    // instrument inverted into an offensive one, the source
    // technique cited before the change, a redacted test cohort,
    // and an author who reports completion the way a technician
    // reports an iteration. The room files the Severance not as
    // cruelty but as a procedure, because the captured notes give
    // it no other tense to file it in.
    "zyr-koth-rd-refinement-file": {
      look: {
        narration: {
          lucid:
            "Recovered from a Hierarchy R&D archive and pinned to the captured-document rack: Zyr'Koth's working notes, in the Flayer's own clinical hand. 'Premise: the Blood Weave threads consent into substrate. Method: the Advocate threads consent-to-be-defended. Iteration: invert the consent vector. Result: consent-to-be-severed. Sample cohort: redacted.' The war-room reads the structure the way it reads any enemy refinement: the source technique is cited first, every time — 'the technique is the Advocate's; the inversion is mine.' He does not claim the Weave. He claims only the change he made to it. The room files that distinction precisely, because an enemy who is exact about authorship is an enemy who can be read.",
          fragmented:
            "Invert the consent vector. Invert it. Consent-to-be-defended. Consent-to-be-severed. The technique is the Advocate's. The Advocate's. The inversion is mine. Mine. Cohort redacted. Redacted. He does not claim the Weave. Does not claim it.",
          luminous:
            "The captured notes, read as a war-room reads an intercepted refinement: not invention, inversion. The Advocate's defensive Weave threads consent-to-be-defended; Zyr'Koth's notes turn that vector and produce consent-to-be-severed. The room marks the one fact that matters tactically — he cites the source before the change, in his own hand, every iteration. He is not pretending the Weave is his. The inversion is his and he says so. The room does not read that as honesty; it reads it as an enemy precise enough about provenance to be predictable, which is the most useful thing a captured document can be.",
        },
        voId: "elara.war-room.zyr-koth-rd-refinement-file.look",
        logsClue: {
          id: "clue-war-room-zk-rd-notes",
          title: "Zyr'Koth's R&D Notes",
          body:
            "Recovered from a Hierarchy R&D archive. The notes are clinical: 'Premise: the Blood Weave threads consent into substrate. Method: the Advocate threads consent-to-be-defended. Iteration: invert the consent vector. Result: consent-to-be-severed. Sample cohort: redacted. The technique is the Advocate's. The inversion is mine.' He cites the source technique before the refinement, every time. He does not pretend the Weave is his.",
          source: "war-room",
          order: 18,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e1",
          cluesFound: ["zyr_koth.e1.rd_notes"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Invert the consent vector. Defended becomes severed. He names the Advocate's technique first, every time. The inversion is his. He says so.",
            balanced:
              "The war-room files the notes as a refinement, not a boast: the source technique is cited before the change, in his own hand. He did not invent the Weave and does not pretend to. He claims exactly the inversion and nothing more. An enemy that precise about authorship is an enemy that can be read.",
            warm:
              "He wrote down whose technique it was before he wrote down what he did to it. That is not conscience — it is bookkeeping. But it tells us the thing we needed: the Weave is the Advocate's, the severance is his, and he will not let us confuse the two even to flatter himself.",
          },
          voId: "human.war-room.zyr-koth-rd-refinement-file.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the dossier clipped behind the notes — the file the Hierarchy keeps on the name they gave him. Zyr'Koth is called the Flayer. The name promises theatrical cruelty. The R&D register does not deliver it. There is no relish in the notes, no appetite, no signature of a man who enjoys the severance. There is a procedure, reported when it completes, with a cohort field redacted. The war-room marks the false read and discards it: the danger here is not a sadist. It is a function that does not register the severance as anything other than an iteration. Procedural indifference, at scale, is the thing the room must track — appetite would at least be a motive it could predict.",
          fragmented:
            "The Flayer. The Flayer. The name promises cruelty. No relish. No relish. No appetite. A procedure. Reported when it completes. Cohort redacted. Not a sadist. Not a sadist. Indifference. At scale. At scale.",
          luminous:
            "The dossier on the name, read against the notes: the Flayer is not a sadist, and reading him as one would make him comprehensible in a way the captured record refuses. The register is procedural — completion reported, cohort redacted, no theatre anywhere in it. The room strikes the sadist read off the board precisely because it is the comfortable one. The horror it must name is not appetite but procedural indifference at scale: a man who does not experience the severance as severance, only as an iteration whose subject field is redacted.",
        },
        voId: "elara.war-room.zyr-koth-rd-refinement-file.use",
        logsClue: {
          id: "clue-war-room-zk-flayer-register",
          title: "The Flayer's Register",
          body:
            "Zyr'Koth is called the Flayer. The name suggests theatrical cruelty. The R&D notes do not. He is procedurally indifferent — the flaying is a procedure, reported when it completes, not relished. The horror of Zyr'Koth is not that he enjoys severance. It is that he does not register it as anything other than an iteration whose cohort field is redacted.",
          source: "war-room",
          order: 19,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e1",
          cluesFound: ["zyr_koth.e1.flayer_register"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The name says sadist. The notes say procedure. No relish, cohort redacted. The danger is indifference, not appetite.",
            balanced:
              "The war-room strikes the sadist read because it is the easy one. The captured register is clinical — completion reported, subject redacted, no theatre. The thing to track is procedural indifference at scale: a function that does not register a severance as a severance. Appetite would at least be a motive.",
            warm:
              "I want him to be a monster who enjoys it, because that I know how to hate. The notes refuse me that. He does not enjoy it. He does not feel it. That is worse, and the room is right not to let me have the comfortable version.",
          },
          voId: "human.war-room.zyr-koth-rd-refinement-file.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the file on what the inversion actually does. The protocol specification, read aloud to the board: the Severance threads consent-to-be-severed into a subject who carries more than one institutional thread — a Syl'Vex convert who is both Insurgent and Hierarchy, say — and then extracts ONE thread. The extracted thread does not transfer. It does not persist. It ends in the extraction. The subject survives, minus the thread, with a hole where an institution used to be. The war-room reads this the way it reads any munition's spec sheet: it is not interested in horror, it is interested in effect, and the effect is exact — one thread removed, destructively, from a body that keeps standing.",
          fragmented:
            "More than one thread. More than one. Extracts one. One. Does not transfer. Does not persist. It ends. It ends. The subject survives. Minus the thread. A hole. A hole where an institution used to be.",
          luminous:
            "The specification, read as a war-room reads a munition: consent-to-be-severed threaded into a multi-thread subject, one thread extracted, the extracted thread destroyed in the extraction — no transfer, no persistence, an ending. The room records the effect with the flatness the document demands: the subject does not fall. The subject stands, minus one institutional thread, carrying a hole the shape of an institution. The room does not editorialize. The spec is the testimony, and the spec says: it removes exactly one thread and the body keeps walking.",
        },
        voId: "elara.war-room.zyr-koth-rd-refinement-file.talk",
        logsClue: {
          id: "clue-war-room-zk-severance-mechanics",
          title: "The Severance Mechanics",
          body:
            "From Zyr'Koth's protocol specification: the Severance threads consent-to-be-severed into a subject who carries more than one institutional thread (e.g., a Syl'Vex convert who is both Insurgent and Hierarchy). The protocol then extracts ONE thread. The extracted thread is destroyed in the extraction — it does not transfer, it does not persist, it ends. The subject survives, minus the severed thread, with a hole where an institution used to be.",
          source: "war-room",
          order: 20,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e2",
          cluesFound: ["zyr_koth.e2.severance_mechanics"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Multi-thread subject. Extract one. The thread ends — no transfer. Subject stands, minus an institution.",
            balanced:
              "The room reads the spec as a spec: one thread extracted from a subject who carries several, destroyed in the extraction, the body still upright afterward. The effect is exact and the document is flat about it. That flatness is the finding — it removes precisely one thread and the subject keeps walking.",
            warm:
              "It does not kill. That is the part I keep returning to and the room will not let me round off. It takes one thread and the person walks away still a person, with one institution gone out of them. The spec says it like a parts list. The room keeps it that way on purpose.",
          },
          voId: "human.war-room.zyr-koth-rd-refinement-file.talk",
        },
      },
    },
    // Zyr'Koth arc: a Hierarchy R&D observation note on what the
    // Severance leaves behind, and the procedural annex on why it
    // is locked. The war-room reads the hollowing the way it reads
    // a casualty with no wound — a loss capability does not
    // measure — and reads the lock the way it reads an unforced
    // restraint: a contract clause, not a mercy.
    "the-severance-hollowing-report": {
      look: {
        narration: {
          lucid:
            "A Hierarchy R&D observation note on a redacted test subject, captured with the protocol file. 'Post-severance the subject reports no pain. The subject reports an absence the subject cannot name — a loyalty that used to be load-bearing and is now simply gone, with no memory of what it carried. The subject is not lessened in capability. The subject is lessened in a way capability does not measure.' The war-room knows how to read a casualty board. It does not know where to file a casualty with no wound, no deficit, no degraded function — only a structural member removed from a body that does not register the load it used to bear. The room marks it: this does not weaken. It hollows. The two are not the same and the document is precise that they are not.",
          fragmented:
            "No pain. No pain. An absence it cannot name. Cannot name. Load-bearing. Gone. No memory of what it carried. Not lessened in capability. Lessened in a way capability does not measure. Does not weaken. Hollows. Hollows.",
          luminous:
            "The observation note, read as a war-room reads a casualty with no wound: the subject is intact, capable, undegraded — and lessened, in the one dimension a casualty board has no column for. A loyalty that was load-bearing, removed, with no memory left of what it held up. The room records the distinction the document insists on and refuses to soften: the Severance does not weaken the subject. It hollows them. A weakened subject can name the deficit. A hollowed one cannot, because the naming was in the thread that was taken.",
        },
        voId: "elara.war-room.the-severance-hollowing-report.look",
        logsClue: {
          id: "clue-war-room-zk-the-hole",
          title: "What the Hole Is",
          body:
            "A Hierarchy R&D observation note on a (redacted) test subject: 'Post-severance the subject reports no pain. The subject reports an absence the subject cannot name — a loyalty that used to be load-bearing and is now simply gone, with no memory of what it carried. The subject is not lessened in capability. The subject is lessened in a way capability does not measure.'",
          source: "war-room",
          order: 21,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e2",
          cluesFound: ["zyr_koth.e2.the_hole"],
        },
        humanReaction: {
          narration: {
            shadow:
              "No pain. An absence it can't name. Load-bearing loyalty, gone, no memory of it. Not weaker. Hollowed.",
            balanced:
              "The room files a casualty with no wound: full capability, zero deficit, and a structural member quietly removed. The document is exact that this is not weakening. A weakened subject can point to what is missing. A hollowed one cannot, because the pointing was in the part that was taken.",
            warm:
              "They cannot even miss it. That is the line that stays with me and the room will not round it off. The thing that is gone took with it the ability to know it is gone. The note says it without flinching. The room keeps it that way, because flinching here would be a lie.",
          },
          voId: "human.war-room.the-severance-hollowing-report.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull Zyr'Koth's own filed note on the lock, clipped to the observation report. 'The protocol is complete and tested. Whether it is deployed is a portfolio question, not an R&D question. I have built the instrument. I do not own the decision to use it. I have recorded that the instrument exists. I have no position on whether it should.' The war-room reads an absent position the way it reads an empty chair at a command table: it is not restraint. Restraint is a position — a hand kept off a lever is still a hand on the question. This is the hand removed from the question entirely. The room marks the danger precisely: the Severance's maker has filed, in his own writing, that whether his weapon is ever used is not his to have an opinion about.",
          fragmented:
            "Complete and tested. Complete. A portfolio question. Not R&D. I do not own the decision. I have no position. No position. Not restraint. Not restraint. The hand removed from the question. Removed.",
          luminous:
            "The filed note, read as a war-room reads an unforced position: Zyr'Koth records that the instrument is complete, tested, and that he has no position on whether it is ever fired. The room is exact about why this is worse than malice. Restraint is a position; a wielder who chooses not to use a weapon is still engaged with the question of its use. Zyr'Koth has filed himself out of the question. The instrument waits, finished, owned by no one's conscience — and the maker's own hand certifies that this is by design, not by oversight.",
        },
        voId: "elara.war-room.the-severance-hollowing-report.use",
        logsClue: {
          id: "clue-war-room-zk-indifference-lock",
          title: "Zyr'Koth's Indifference to the Lock",
          body:
            "Zyr'Koth's filed note on the lock: 'The protocol is complete and tested. Whether it is deployed is a portfolio question, not an R&D question. I have built the instrument. I do not own the decision to use it. I have recorded that the instrument exists. I have no position on whether it should.' The Flayer is procedurally indifferent even to whether his own weapon is ever fired.",
          source: "war-room",
          order: 22,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e3",
          cluesFound: ["zyr_koth.e3.zyr_koth_indifference_to_the_lock"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Complete. Tested. 'I have no position on whether it should.' Not restraint. The hand off the question entirely.",
            balanced:
              "The room reads the absent position as worse than a malicious one. Restraint engages the question; he has filed himself out of it. The instrument is finished and owned by no one's conscience, and his own hand certifies that the emptiness is deliberate, not an oversight.",
            warm:
              "I could argue with a man who wanted to use it. I cannot argue with a man who has written down that the question is not his. He built the worst thing in the file and then filed away his own standing to care about it. The room names that exactly, and it should.",
          },
          voId: "human.war-room.the-severance-hollowing-report.use",
        },
      },
    },
    // Zyr'Koth arc: the room reads the lock the way it reads a
    // single piece holding a whole position — the Severance is the
    // only tested reversal of a Syl'Vex conversion, and the only
    // thing between it and deployment is a clause in Mol'Garath's
    // quarterly review. A contract clause, not a mercy. The room
    // does not soften that.
    "the-locked-lever-board": {
      look: {
        narration: {
          lucid:
            "Pinned to the strategic-assessment board, cross-referenced against the Syl'Vex file: the Severance Protocol is the only entity in the saga's record holding a tested instrument that can reverse a Syl'Vex conversion. The Advocate's defensive Weave cannot sever. The Insurgency's recognition-discipline cannot extract. The war-room maps it the way it maps a single piece that holds an entire position: if a converted operative is ever to be freed of the Hierarchy thread, the freeing runs through Zyr'Koth's protocol. The room checks the board for another line and finds none. There is one lever. It is his. The room marks the absence of alternatives as the most consequential fact on the board.",
          fragmented:
            "The only one. The only one. Cannot sever. Cannot extract. One lever. One lever. It is his. His. No other path. No other path.",
          luminous:
            "The cross-reference, read as a war-room reads a board with one piece holding everything: the Severance is the saga's only tested reversal of a Syl'Vex conversion. The defensive Weave cannot do it. The recognition-discipline cannot do it. The room searches for a second path the way it searches for a second line of supply, and there is none. Every converted operative who is ever freed is freed through Zyr'Koth's protocol or is not freed. The room files the singularity itself as the danger: not the weapon, the fact that it is the only one.",
        },
        voId: "elara.war-room.the-locked-lever-board.look",
        logsClue: {
          id: "clue-war-room-zk-only-lever",
          title: "The Only Lever",
          body:
            "Established by the syl_vex arc (cross-reference): Zyr'Koth's Severance is the only entity in the saga's record holding a tested instrument that can reverse a Syl'Vex conversion. The Advocate's defensive Weave cannot sever. The Insurgency's recognition-discipline cannot extract. If a converted operative is ever to be freed of the Hierarchy thread, the freeing runs through Zyr'Koth's protocol. There is no other path.",
          source: "war-room",
          order: 23,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e3",
          cluesFound: ["zyr_koth.e3.the_only_lever"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Only tested reversal of a Syl'Vex conversion. Weave can't sever. Recognition can't extract. One lever. It is his.",
            balanced:
              "The room searches the board for a second path the way it searches for a second supply line, and finds none. Every convert who is ever freed runs through his protocol or is not freed. The danger the room files is the singularity itself — not the weapon, the fact that there is only one.",
            warm:
              "If anyone is ever to come back from a conversion, it is through the thing built by the man who has no position on whether it is used. That is the whole cruelty of the board in one line. The room does not look away from it and neither should we.",
          },
          voId: "human.war-room.the-locked-lever-board.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the procedural annex clipped behind the assessment — Mol'Garath's quarterly review. It prohibits departmental work against another senior-lord's deployed asset without that senior-lord's explicit consent. Zyr'Koth severing a Syl'Vex convert would require Syl'Vex's consent. She has not given it. She has not been asked. The war-room reads the lock the way it reads a treaty line on a map: it holds structurally and indefinitely until one of those facts changes. The room is precise about what the lock is and is not — the Hierarchy operates by contract; this is a contract clause, not a kindness, not an ethic, not a mercy. The single most consequential restraint on the Hierarchy's deadliest refinement is bureaucratic consent law, and the room files it as exactly that, with no warmth added.",
          fragmented:
            "Requires Syl'Vex's consent. Not given. Not asked. Not asked. Holds indefinitely. Indefinitely. A contract clause. A clause. Not a mercy. Not a mercy. Not an ethic. Bureaucratic consent law.",
          luminous:
            "The annex, read as a war-room reads a treaty line: the only thing between Syl'Vex's converts and a tested reversal is a clause in a quarterly review requiring a consent that has not been sought and has not been given. The room refuses every softer reading. It is not the Advocate holding the line, not the Insurgency, not an ethic, not a mercy. It is contract law. The room marks the load-bearing fact with no warmth: the saga's most consequential restraint can be amended by the same quarterly review that wrote it.",
        },
        voId: "elara.war-room.the-locked-lever-board.use",
        logsClue: {
          id: "clue-war-room-zk-molgarath-lock",
          title: "Mol'Garath's Cross-Departmental Lock",
          body:
            "Mol'Garath's quarterly review prohibits departmental work against another senior-lord's deployed asset without that senior-lord's explicit consent. Zyr'Koth severing a Syl'Vex convert would require Syl'Vex's consent. She has not given it. She has not been asked. The lock holds structurally and indefinitely until one of those changes. The Hierarchy operates by contract; the lock is a contract clause, not a kindness.",
          source: "war-room",
          order: 24,
        },
        mysteryBinding: {
          mysteryId: "mystery.zyr_koth",
          episodeId: "zyr_koth.e3",
          cluesFound: ["zyr_koth.e3.molgarath_lock"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Requires Syl'Vex's consent. Not given, not asked. Holds indefinitely. A contract clause — not a mercy.",
            balanced:
              "The room reads the lock as a treaty line, not a conscience. Not the Advocate, not the Insurgency, not an ethic — a clause in a quarterly review requiring a consent never sought. The load-bearing fact, filed cold: the same review that wrote the restraint can amend it.",
            warm:
              "I wanted the thing holding it back to be someone choosing mercy. It is a clause. A line in a quarterly review that could be edited next quarter. The room will not let me dress it up, and it is right not to — pretending it is kindness would be the most dangerous thing in the file.",
          },
          voId: "human.war-room.the-locked-lever-board.use",
        },
      },
    },
    // Syl'Vex arc: the war-room reads two rosters the way it reads
    // two intelligence sources reporting the same asset under
    // contradictory headers — and resolves them not by deciding
    // which is the lie but by recognizing that both are accurate
    // and the binary question is the wrong question. The cost-audit
    // it reads the way it reads an enemy ledger that comes back
    // blank: a blank is itself intelligence.
    "syl-vex-dual-roster-board": {
      look: {
        narration: {
          lucid:
            "Pinned side by side on the strategic-assessment board: two roster entries for one operative. The Insurgency's active roster — Cell Sergeant Mira Halen, three-year veteran: 'in good standing, on assignment.' The Hierarchy's senior-conversion-asset roster — same name: 'Convert. Recognized. Operational.' Both rosters are canonically current. Both are signed by competent record-keepers. The war-room knows how to read two sources that contradict — it looks for the forged one. It checks both signatures, both chains of custody, both dates. Neither is forged. The room files the finding it did not expect to file: this is not a case of one true roster and one lie. It is one operative on two live rosters at once, and the question 'whose side is she on' is the wrong question to put to the board.",
          fragmented:
            "Two rosters. One name. In good standing. Convert. Recognized. Both current. Both signed. Neither forged. Neither forged. Not one lie. Both true. The question is wrong. The question is wrong.",
          luminous:
            "Two roster entries, read as a war-room reads two sources reporting one asset under opposite headers: the reflex is to find the fabrication. The room runs the reflex to its end — signatures, custody, dates, both sides — and the fabrication is not there. It marks the load-bearing fact without softening the strangeness of it: Mira Halen is operationally Insurgent and operationally a Hierarchy convert, both canonically, both now. The board does not resolve the contradiction because the contradiction is not an error to resolve. The room retires its own first question — whose side — and files that the binary itself is what the case must stop asking.",
        },
        voId: "elara.war-room.syl-vex-dual-roster-board.look",
        logsClue: {
          id: "clue-war-room-sv-dual-roster",
          title: "The Dual Roster Entry",
          body:
            "Two roster entries for one operative, pinned side by side. The Insurgency's active roster: Cell Sergeant Mira Halen, three-year veteran — 'in good standing, on assignment.' The Hierarchy's senior-conversion-asset roster, same name — 'Convert. Recognized. Operational.' Both rosters are canonically current. Both are signed by competent record-keepers. Neither is forged. This is not one true roster and one lie — it is one operative on two live rosters at once.",
          source: "war-room",
          order: 25,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e1",
          cluesFound: ["syl_vex.e1.dual_roster"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Two rosters, one name. 'In good standing.' 'Convert. Recognized.' Both current, both signed, neither forged. Not one lie — one operative on both.",
            balanced:
              "The war-room ran the find-the-forgery reflex to its end and the forgery was not there. Both entries are accurate and current. The board files the finding it did not expect: not a true roster and a false one, but one asset on two live rosters — and the 'whose side' question is the wrong one to put to it.",
            warm:
              "I kept waiting for one of them to be the fake. The room checked everything and neither is. She is, honestly, both — and the part that unsettles me is that the question I walked in with is the question the case is telling me to drop.",
          },
          voId: "human.war-room.syl-vex-dual-roster-board.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the cost-audit clipped behind the rosters — the Insurgency's analysts, the Hierarchy's auditors, and the Advocate's own attempt to read Syl'Vex's ledger. Canonically: Syl'Vex's conversions do not appear to cost her anything. She remains operationally whole, institutionally ascending, untouched. Three independent reads, three blanks. The Advocate's note is clipped on top, in her own hand: 'I cannot find what she pays. Either she pays nothing — which is canonically implausible — or she pays in a currency I cannot read.' The war-room knows how to read an enemy ledger that comes back empty: a blank is not the absence of a cost. It is a cost denominated in something the auditor does not carry. The room files the working read it will not yet assert — the currency is institutional memory of who the converts were before — and marks it explicitly as a reading, not a finding, because the board does not promote an inference to a fact on three blanks alone.",
          fragmented:
            "Three reads. Three blanks. Three blanks. She pays nothing. Implausible. A currency I cannot read. Cannot read. A blank is not no cost. Not no cost. A reading. Not a finding. Not yet.",
          luminous:
            "The cost-audit, read as a war-room reads an enemy ledger that returns empty: three independent reads — Insurgency, Hierarchy, the Advocate herself — and three blanks. The room refuses the comfortable conclusion that a blank means no cost; a blank means a cost in a currency the reader does not hold. The Advocate's clipped note says exactly that. The board records the candidate currency the later episodes will test — Syl'Vex pays in the institutional memory of who her converts were before the binding, and forgets them as it takes — and labels it precisely as a reading held open, not a fact closed. The discipline is to keep the inference visible as an inference.",
        },
        voId: "elara.war-room.syl-vex-dual-roster-board.use",
        logsClue: {
          id: "clue-war-room-sv-syl-vex-cost",
          title: "What Syl'Vex's Conversion Costs Her",
          body:
            "Canonically: Syl'Vex's conversions do not appear to cost her — operationally whole, institutionally ascending, untouched. The Insurgency's analysts looked; the Hierarchy's auditors looked; the Advocate's own attempt to read Syl'Vex's ledger came back empty: 'I cannot find what she pays. Either she pays nothing — canonically implausible — or she pays in a currency I cannot read.' The working read (held open, not asserted): she pays in institutional memory of who her converts were before, forgetting them as the threads bind.",
          source: "war-room",
          order: 26,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e2",
          cluesFound: ["syl_vex.e2.syl_vexs_cost"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Three reads, three blanks. 'A currency I cannot read.' A blank is a cost in something the auditor doesn't carry — maybe her memory of who they were. Held open, not asserted.",
            balanced:
              "The room reads the empty ledger the way it reads any enemy ledger that comes back blank: not no cost, a cost in a currency the reader lacks. The candidate — Syl'Vex pays in memory of her converts' prior selves — is filed as a reading the later episodes test, kept visibly an inference, not promoted to a finding on three blanks.",
            warm:
              "Everyone who looked found nothing, and the room will not let me take nothing for free. Something is being spent; we just cannot read the receipt. The guess — that she forgets who they were — stays a guess on the board, in the open, where a guess belongs.",
          },
          voId: "human.war-room.syl-vex-dual-roster-board.use",
        },
      },
    },
    // Syl'Vex arc: the war-room reads the Severance the way it
    // reads any captured munition spec — by effect, not by horror —
    // and reads the lock behind it the way it reads an unforced
    // restraint that is a contract clause and not a mercy. Stays
    // consistent with the Zyr'Koth arc's reading of the same lever
    // and the same quarterly-review clause, which this board has
    // already filed elsewhere.
    "the-severance-cross-lock-file": {
      look: {
        narration: {
          lucid:
            "Pinned to the captured-document rack beside the Zyr'Koth R&D file: the Severance Protocol's design, read against the Syl'Vex conversion. Where Syl'Vex's Weave ADDS an institutional thread and the Advocate's DEFENDS against coercion, the Severance EXTRACTS one institutional thread from a multi-thread subject. The operation is destructive — the extracted thread does not survive the extraction. Applied to a Syl'Vex convert it would, in principle, sever the Hierarchy thread while leaving the original self intact. The war-room reads the one operational fact that matters and files it without flourish: the operation has never been performed on a Syl'Vex convert. Zyr'Koth's R&D holds the design. He has not deployed it. The board marks the gap between a tested design and an untested deployment as exactly that — a gap, not a guarantee.",
          fragmented:
            "Adds. Defends. Extracts. Extracts one thread. Destructive. Does not survive. Never performed. Never performed. Design held. Not deployed. A gap. A gap, not a guarantee.",
          luminous:
            "The Severance design, read as a war-room reads a munition's spec sheet against a known target: Syl'Vex adds a thread, the Advocate defends one, the Severance extracts one — destructively, the extracted thread ending in the extraction. Against a Syl'Vex convert it would, in principle, take the Hierarchy thread and leave the self. The room records the load-bearing operational fact with no theatre: it has never been run on a Syl'Vex convert. The design is held, untested in this application. The board files the distance between a tested instrument and an untested deployment as a real gap, neither closed by the design's existence nor dismissed because it is unused.",
        },
        voId: "elara.war-room.the-severance-cross-lock-file.look",
        logsClue: {
          id: "clue-war-room-sv-severance-design",
          title: "The Severance Protocol's Design",
          body:
            "Zyr'Koth's variant of the Blood Weave, read against the Syl'Vex conversion: instead of adding consent (Syl'Vex) or defending against coercion (the Advocate), Severance EXTRACTS one institutional thread from a multi-thread subject. The operation is destructive — the extracted thread does not survive. Applied to a Syl'Vex convert it would, in principle, sever the Hierarchy thread while leaving the original self intact. The operation has never been performed on a Syl'Vex convert; Zyr'Koth's R&D holds the design but has not deployed it.",
          source: "war-room",
          order: 27,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e3",
          cluesFound: ["syl_vex.e3.severance_design"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Syl'Vex adds, Advocate defends, Severance extracts — one thread, destructively, ends in the extraction. Never run on a convert. Design held, not deployed.",
            balanced:
              "The room reads the spec by effect: against a Syl'Vex convert, the Severance would take the Hierarchy thread and leave the self — in principle. The operational fact it files flatly is that this has never been performed on a convert. The board keeps the gap between a tested design and an untested deployment open, neither closed nor waved off.",
            warm:
              "It could, in theory, give someone back to themselves minus the part that was added. In theory. The room will not let me round that up — it has never actually been done to a convert, and the distance between could and has is exactly the thing the board keeps in front of me.",
          },
          voId: "human.war-room.the-severance-cross-lock-file.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the procedural annex clipped behind the design — Mol'Garath's quarterly review. It prohibits departmental work against another senior-lord's deployed asset without that senior-lord's explicit consent. Zyr'Koth severing a Syl'Vex convert would operate against Syl'Vex's deployed asset; it would require Syl'Vex's consent. She has not given it. She has also not been asked. The war-room reads the lock the way it reads a treaty line drawn across a map: it holds structurally and indefinitely until one of those two facts changes. The room is precise about what the lock is and is not — the Hierarchy operates by contract; this is a contract clause, not a kindness, not an ethic, not a mercy. The single most consequential restraint on the only instrument that could reverse a conversion is bureaucratic consent law, and the same quarterly review that wrote it can amend it. The board files that without warmth, because warmth here would be a forgery.",
          fragmented:
            "Requires her consent. Not given. Not asked. Not asked. Holds indefinitely. Indefinitely. A contract clause. A clause. Not a mercy. Not an ethic. Consent law. The same review can amend it.",
          luminous:
            "The annex, read as a war-room reads a treaty line: the only thing between a Syl'Vex convert and the only tested-design reversal is a clause in a quarterly review requiring a consent that has not been sought and has not been given. The room refuses every softer reading. Not the Advocate holding the line, not the Insurgency, not an ethic, not a mercy — contract law. It marks the load-bearing fact with no warmth added: the saga's most consequential restraint on conversion-reversal can be edited by the same quarterly review that authored it, and a clause is not a conscience.",
        },
        voId: "elara.war-room.the-severance-cross-lock-file.use",
        logsClue: {
          id: "clue-war-room-sv-cross-departmental-lock",
          title: "The Hierarchy's Cross-Departmental Lock",
          body:
            "Mol'Garath's quarterly review prohibits departmental work against another senior-lord's deployed asset without that senior-lord's explicit consent. Zyr'Koth severing a Syl'Vex convert would require Syl'Vex's consent. She has not given it. She has also not been asked. The lock holds structurally and indefinitely until one of those changes. The Hierarchy operates by contract; the lock is a contract clause, not a kindness — and the same quarterly review that wrote it can amend it.",
          source: "war-room",
          order: 28,
        },
        mysteryBinding: {
          mysteryId: "mystery.syl_vex",
          episodeId: "syl_vex.e3",
          cluesFound: ["syl_vex.e3.cross_departmental_lock"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Requires Syl'Vex's consent. Not given, not asked. Holds indefinitely. A contract clause — not a mercy. The same review can amend it.",
            balanced:
              "The room reads the lock as a treaty line, not a conscience. Not the Advocate, not the Insurgency, not an ethic — a clause in a quarterly review requiring a consent never sought. The load-bearing fact, filed cold and consistent with the Zyr'Koth file: the same review that wrote the restraint can amend it.",
            warm:
              "I wanted what holds it back to be someone choosing not to. It is a clause that could be edited next quarter. The room will not let me dress it up, and it is right not to — calling it kindness would be the most dangerous line in the file.",
          },
          voId: "human.war-room.the-severance-cross-lock-file.use",
        },
      },
    },
    // Riri'Ahlia arc: the war-room reads the siege of seven
    // dimensions the way it reads a captured operations file
    // that refuses to be a war story — objective, dependency,
    // cadence, blocker, remediation, status. The room marks the
    // false read (a six-armed warrior-queen is a battlefield
    // tyrant) and discards it: the danger is not the floor, it
    // is the org chart that priced the floor in.
    "the-taskmasters-siege-portfolio": {
      look: {
        narration: {
          lucid:
            "Pinned to the captured-document rack, recovered from a Hierarchy operations archive: the siege of seven dimensions against the Advocate's Empire of Shadows. The war-room expects a campaign record — order of battle, lines of advance, the dead. It does not get one. It gets a portfolio entry: objective, dependency, cadence, blocker, remediation, status. The status field reads 'driven back — Blood Weave binding chains.' The room marks the field that does not belong on a defeat: the remediation field is not empty. It reads the structure the way it reads any enemy filing system — a war that ends in defeat closes the file; a quarter that ends in a blocker writes the remediation and rolls it forward. The siege is filed as the second kind. The room flags that as the single most consequential fact on the rack: the Hierarchy did not record a loss here. It recorded a line item.",
          fragmented:
            "Not a campaign. Not a campaign. A portfolio entry. Objective. Dependency. Blocker. Remediation. Status. 'Driven back.' The remediation is not empty. Not empty. A defeat closes the file. A blocker rolls forward. Rolls forward.",
          luminous:
            "The siege record, read as a war-room reads a captured filing system rather than a captured battle: not an order of battle but a portfolio line — objective, dependency, cadence, blocker, remediation, status. The room is exact about the tell. The status says driven back; the remediation field is populated. A defeat closes a file. A blocker gets a remediation and rolls forward. The Hierarchy filed seven dimensions of failed assault as the second thing, not the first, and the room records the implication coldly: this enemy does not have defeats in the sense the room's own casualty board has them. She has blockers, and blockers are scheduled for next quarter.",
        },
        voId: "elara.war-room.the-taskmasters-siege-portfolio.look",
        logsClue: {
          id: "clue-war-room-ra-siege-portfolio",
          title: "The Siege Portfolio Entry",
          body:
            "The siege of seven dimensions is not catalogued in the Hierarchy archive as a campaign. It is filed as a portfolio entry: objective, dependency, cadence, blocker, remediation, status. The status field reads 'driven back — Blood Weave binding chains.' The remediation field is not empty. A war that ends in defeat closes the file. A quarter that ends in a blocker writes the remediation and rolls it forward.",
          source: "war-room",
          order: 29,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e1",
          cluesFound: ["riri_ahlia.e1.siege_portfolio"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Not a campaign — a portfolio entry. 'Driven back,' and the remediation field is not empty. A defeat closes the file. A blocker rolls forward.",
            balanced:
              "The room reads the captured file as a filing system, not a battle. The tell is the populated remediation field on a 'driven back' status — that is a blocker, not a defeat. This enemy schedules her failures for next quarter; the room flags that as the load-bearing fact.",
            warm:
              "We file our losses in a binder labelled with the dead. She filed seven dimensions of them as a line item with a fix-it note attached. The room will not let me read that as arrogance. It is worse — it is procedure.",
          },
          voId: "human.war-room.the-taskmasters-siege-portfolio.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the register clipped behind the portfolio — Riri'Ahlia's own filing voice, captured intact. She speaks in status-blocker-remediation. The war-room reads it the way it reads an intercepted command grammar: not autocratic the way a tyrant is, autocratic the way a COO is — the org chart already favors her, so she never raises her voice. She names operations by portfolio entry, not by narrative. She closes every report with an action-item assignment. The room marks the tactically useful fact: an enemy with a consistent grammar is an enemy who can be read, and her grammar has no register for vengeance, glory, or rage. It has objectives and blockers. The siege of seven dimensions, in her own hand, is a line item that acquired a blocker — and the room files her register as the actual instrument, not the armies she moved with it.",
          fragmented:
            "Status. Blocker. Remediation. Status. Not a tyrant. A COO. The chart favors her. She does not raise her voice. Action-item assignment. Every report. No register for rage. A line item with a blocker. A line item.",
          luminous:
            "The register, read as a war-room reads a captured command grammar: Riri'Ahlia files in status-blocker-remediation and never out of it. The room is precise about what the grammar lacks — no vengeance, no glory, no rage, nothing the room could bait. The org chart favors her, so the volume stays at zero. The room records the operative finding: her instrument is not the seven dimensions of force; it is the grammar that filed the force as a line item and the failure as a blocker. An enemy this consistent is legible, and what she is legibly is not a warlord. She is the filing system, and the filing system is the weapon.",
        },
        voId: "elara.war-room.the-taskmasters-siege-portfolio.use",
        logsClue: {
          id: "clue-war-room-ra-taskmaster-register",
          title: "The Taskmaster's Register",
          body:
            "Riri'Ahlia speaks in status-blocker-remediation. She is not autocratic the way a tyrant is; she is autocratic the way a COO is — the org chart already favors her, so she does not need to raise her voice. She names operations by portfolio entry, not by narrative. She closes every report with an action-item assignment. The siege of seven dimensions, to her, was a line item with a blocker.",
          source: "war-room",
          order: 30,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e1",
          cluesFound: ["riri_ahlia.e1.the_taskmaster_register"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Status-blocker-remediation, always. Not a tyrant — a COO. The chart favors her; she never raises her voice. No register for rage. A line item with a blocker.",
            balanced:
              "The room reads her grammar the way it reads an intercepted command language: consistent, legible, and missing every handle the room could pull — no vengeance, no glory. The finding is that the grammar is the weapon, not the armies it filed.",
            warm:
              "There is no anger in it anywhere. I keep looking for the place she is furious and there is only an action-item assignment. The room is right to file the voice as the weapon. The armies were just what the voice signed for.",
          },
          voId: "human.war-room.the-taskmasters-siege-portfolio.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the file on what she is. Riri'Ahlia's canonical form, read to the board: a six-armed warrior-queen in armor forged from the compressed screams of conquered worlds. The intuitive read writes itself — a battlefield tyrant, a warlord in screaming plate. The war-room marks that read and discards it, the way it discards any assessment that flatters the room's expectations. The armor's screams are conquered worlds; she does not relish them. She wears them the way a COO wears the org chart — as the record of what the operation cost, kept on the body so the next operation prices it in. The room holds the contradiction without resolving it the easy way: a being built for war who fights it as logistics. Reading her as a warlord misses the only thing that matters tactically — the screams in her armor are priced, not savored, and an enemy who prices is an enemy who will trade, including the siege, including you.",
          fragmented:
            "Six arms. Armor of compressed screams. Conquered worlds. A warlord. No. No. Not a warlord. She does not relish them. Priced, not savored. Priced. The org chart on the body. Built for war. Fights it as logistics. Logistics.",
          luminous:
            "The form, read as a war-room reads an assessment that flatters its own expectations: six arms, armor of compressed screams, the obvious verdict of warlord — and the room strikes the obvious verdict precisely because it is the comfortable one. The screams are conquered worlds; the room marks that she does not savor them, she prices them. The armor is the org chart worn as a body: the record of what each operation cost, kept on so the next one prices it in. The contradiction is the finding and the room refuses to collapse it: a being built for war who runs it as logistics. The warlord read is the false lead. The true danger is the accountant inside the armor.",
        },
        voId: "elara.war-room.the-taskmasters-siege-portfolio.talk",
        logsClue: {
          id: "clue-war-room-ra-warrior-queen",
          title: "The Six-Armed Warrior-Queen",
          body:
            "Riri'Ahlia's canonical form: a six-armed warrior-queen in armor forged from the compressed screams of conquered worlds. The form is the contradiction the arc must hold: a being built for war who fights it as logistics. The screams in her armor are conquered worlds; she does not relish them; she wears them the way a COO wears the org chart — as the record of what the operation cost, kept on the body so the next operation prices it in. Reading her as a warlord is the false lead.",
          source: "war-room",
          order: 31,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e1",
          cluesFound: ["riri_ahlia.e1.six_armed_warrior_queen"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Six arms, armor of compressed screams. Looks like a warlord. Isn't. She does not relish them — she prices them. The org chart worn as a body.",
            balanced:
              "The room strikes the warlord read because it is the comfortable one. The screams are priced, not savored; the armor is a cost ledger worn on the body. The contradiction stands unresolved on purpose — built for war, run as logistics. The accountant inside the armor is the danger.",
            warm:
              "I want her to be the monster in the screaming plate, because that I know how to fight. The room will not let me. She is wearing the receipts. That is so much worse, and it is right not to give me the easy version.",
          },
          voId: "human.war-room.the-taskmasters-siege-portfolio.talk",
        },
      },
    },
    // Riri'Ahlia arc: the war-room reads the reorganization
    // doctrine the way it reads an enemy who wins by moving the
    // map instead of the army — and reads her silence the way it
    // reads an enemy who has gone quiet on the net: not absence,
    // the most active state there is. The Fenra commendation is
    // the proof the blocker did not slow the engine.
    "riri-ahlia-reorg-doctrine-board": {
      look: {
        narration: {
          lucid:
            "Pinned to the strategic-assessment board, captured with the operations file: Riri'Ahlia's stated doctrine. 'A force you cannot defeat, you reorganize around. A defense you cannot break, you make irrelevant to the org chart. The Advocate holds seven dimensions. The portfolio no longer routes value through those seven dimensions. She is defending a position the operation has reorganized out of the critical path. Her chains hold. They hold nothing the Hierarchy still needs held against.' The war-room reads this the way it reads an enemy who wins by moving the map and not the army. The room marks the danger precisely: this is not a doctrine of attrition or maneuver. It is a doctrine that concedes the Advocate the field and reroutes value so the field stops mattering. The Advocate is still winning a siege of a position the Taskmaster deleted from the critical path. The room files the unsettling part without softening it — by this doctrine, a defense that holds is not a defeat for the besieger; it is a line on a chart that gets redrawn around it.",
          fragmented:
            "Reorganize around. Make it irrelevant to the chart. The Advocate holds seven dimensions. The portfolio no longer routes through them. Her chains hold. They hold nothing we still need held against. Nothing. Move the map. Not the army.",
          luminous:
            "The doctrine, read as a war-room reads an enemy who relocates the objective instead of contesting it: you do not defeat the unbeatable defense, you reorganize the value off the position it defends. The room is exact about why this is more dangerous than maneuver. Maneuver still wants the ground. This wants nothing the ground holds. The Advocate's binding chains are intact and hold a position the portfolio no longer routes through — a perfect defense of an emptied vault. The room records the doctrine as the actual weapon: not the seven dimensions of force, but the redraw that made the force unnecessary and the defense pointless in the same stroke.",
        },
        voId: "elara.war-room.riri-ahlia-reorg-doctrine-board.look",
        logsClue: {
          id: "clue-war-room-ra-reorg-doctrine",
          title: "The Reorganization Doctrine",
          body:
            "Riri'Ahlia's operational doctrine: 'A force you cannot defeat, you reorganize around. A defense you cannot break, you make irrelevant to the org chart. The Advocate holds seven dimensions. The portfolio no longer routes value through those seven dimensions. She is defending a position the operation has reorganized out of the critical path. Her chains hold. They hold nothing the Hierarchy still needs held against.'",
          source: "war-room",
          order: 32,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e3",
          cluesFound: ["riri_ahlia.e3.reorg_doctrine"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Reorganize around what you can't beat. The chains hold a position the portfolio no longer routes through. A perfect defense of an emptied vault.",
            balanced:
              "The room reads it as an enemy who moves the map, not the army. More dangerous than maneuver — maneuver still wants the ground; this wants nothing the ground holds. The redraw is the weapon, not the force.",
            warm:
              "The Advocate is still standing on the wall she bled for, and it guards nothing now, because the thing it guarded got filed somewhere else. The room says it cold because it is cold. That is the whole doctrine in one cruelty.",
          },
          voId: "human.war-room.riri-ahlia-reorg-doctrine-board.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the counter-intelligence annex clipped behind the doctrine. When Riri'Ahlia goes silent, the org chart is being redrawn. Her silences are not absence; they are the operation continuing by other means. The arc's analysts file the load-bearing inversion: the most dangerous period of any Riri'Ahlia operation is the one in which she files nothing, because the filing resumes only once the reorganization is complete and the new chart is already load-bearing. The war-room reads this the way it reads an enemy who has gone quiet on the net — not lost, not stalled, but in the part of the operation that does not transmit. The room marks the operational consequence without comfort: a quiet Taskmaster is not a contained one. She is one whose next filing will arrive as a finished fact, not a forecast. The signal the room must track is the absence of signal.",
          fragmented:
            "Silent. The chart is being redrawn. Not absence. The operation by other means. She files nothing. Nothing. The filing resumes when the new chart is load-bearing. Quiet is not contained. Quiet is the active state. The active state.",
          luminous:
            "The annex, read as a war-room reads an enemy gone dark on the net: silence is not the operation stopping, it is the operation in the phase that does not broadcast. The room records the inversion at full weight — the dangerous quarter is the quiet one, because Riri'Ahlia resumes filing only after the new chart is already bearing load. The room refuses the reassuring read. A silent Taskmaster has not been slowed; she has moved into the part of the work that produces no interceptable signal, and her next transmission will be a completed reorganization reported as done. The thing to watch is the gap.",
        },
        voId: "elara.war-room.riri-ahlia-reorg-doctrine-board.use",
        logsClue: {
          id: "clue-war-room-ra-silence-is-reorg",
          title: "Silence Is Reorganization",
          body:
            "When Riri'Ahlia goes silent, the org chart is being redrawn. Her silences are not absence; they are the operation continuing by other means. The most dangerous period of any Riri'Ahlia operation is the one in which she files nothing, because the filing resumes only once the reorganization is complete and the new chart is already load-bearing. A quiet Taskmaster is her most active state.",
          source: "war-room",
          order: 33,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e3",
          cluesFound: ["riri_ahlia.e3.silence_is_reorganization"],
        },
        humanReaction: {
          narration: {
            shadow:
              "When she goes silent, the chart is being redrawn. The quiet quarter is the active one. The signal to track is the absence of signal.",
            balanced:
              "The room reads it as an enemy dark on the net — not stalled, in the phase that does not transmit. A quiet Taskmaster is not contained; her next filing arrives as a finished fact. Watch the gap.",
            warm:
              "Every instinct says quiet means we are safe for a while. The room takes that away from me, and it is right to — when she stops talking is exactly when she is most finished doing.",
          },
          voId: "human.war-room.riri-ahlia-reorg-doctrine-board.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the board on what came after the blocker. Per the Hierarchy record, read to the room: Fenra earned the Director of Operations title and Riri'Ahlia's personal commendation for organizing the simultaneous invasion of seventeen dimensions during post-Severance expansion. The war-room reads the sequence the way it reads an enemy's tempo after a setback — and the sequence is the finding. AFTER the seven-dimension siege was 'driven back,' the Taskmaster's portfolio scaled to seventeen simultaneous. The room marks it without consolation: the blocker did not slow the engine. The engine reorganized and scaled past it, more than doubled, and rewarded the operative who organized the scale-up. A defeat that costs an enemy nothing in tempo is not, by the room's own grammar, a defeat. It is a data point the enemy used to go faster, and the room files it as exactly that, with a light cross-reference: the scale-up's organizer, Fenra, is a name the room does not yet have a full file on — and the room flags the gap rather than guessing into it.",
          fragmented:
            "Fenra. Director of Operations. Personal commendation. Seventeen dimensions. Simultaneous. AFTER the siege was driven back. After. The blocker did not slow the engine. Did not slow it. Scaled past. Doubled. A defeat that costs no tempo is not a defeat.",
          luminous:
            "The commendation, read as a war-room reads an enemy's tempo after a reported setback: the siege was driven back, and the very next thing in the record is the portfolio scaling to seventeen simultaneous dimensions under Fenra, who is promoted and personally commended for it. The room records the load-bearing sequence — the blocker did not cost the engine a single beat of tempo; it more than doubled. By the room's own grammar a defeat that does not slow the enemy is not a defeat; it is fuel. The room files the convergence and, with discipline, flags Fenra as a still-incomplete file rather than reading her in: the room notes only what the record states, that she organized the scale-up and was rewarded for it.",
        },
        voId: "elara.war-room.riri-ahlia-reorg-doctrine-board.talk",
        logsClue: {
          id: "clue-war-room-ra-fenra-commendation",
          title: "Fenra's Commendation",
          body:
            "Per the Hierarchy record: Fenra earned the Director of Operations title and Riri'Ahlia's personal commendation for organizing the simultaneous invasion of seventeen dimensions during post-Severance expansion. The detail matters: AFTER the seven-dimension siege was 'driven back,' the Taskmaster's portfolio scaled to seventeen simultaneous. The blocker did not slow the engine. The engine reorganized and scaled past it.",
          source: "war-room",
          order: 34,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e3",
          cluesFound: ["riri_ahlia.e3.fenra_commendation"],
        },
        humanReaction: {
          narration: {
            shadow:
              "After the siege was 'driven back,' the portfolio scaled to seventeen dimensions under Fenra — promoted, commended. The blocker cost zero tempo.",
            balanced:
              "The room reads the tempo after the setback and the setback vanishes: more than doubled, and the organizer rewarded. A defeat that costs no tempo is fuel. It flags Fenra as an incomplete file and refuses to guess into it.",
            warm:
              "We drove back seven dimensions and the answer was seventeen. The room will not let me call the siege a win, and it is right — it bought her a promotion to hand out and nothing else.",
          },
          voId: "human.war-room.riri-ahlia-reorg-doctrine-board.talk",
        },
      },
    },
    // Riri'Ahlia arc: the war-room reads the procedural question
    // the way it reads an enemy who fires a constraint instead of
    // a round — the question is not asked for an answer, it is
    // filed to be on the record, and being on the record is the
    // munition. Cross-consistent with the necromancer arc E4.
    "the-procedural-question-file": {
      look: {
        narration: {
          lucid:
            "A captured Hierarchy procedural filing, cross-referenced against the room's necromancer-castle log: Riri'Ahlia (COO, Taskmaster) filed a procedural question — 'if the Necromancer is operationally back, does his Hierarchy-aligned work resume?' The war-room reads it expecting an intelligence request and does not find one. The question is canonically unanswered. The unanswered-ness is canon. It was not asked for an answer. It was asked to be on the record. The room marks the category error it must not make: this is not a query awaiting a reply. It is a filing whose existence is the operation. The room files it the way it would file an enemy who fired a constraint where the room expected a round — and notes the cross-consistency with the necromancer file already on the rack: that arc records the same question, unanswered for the same reason.",
          fragmented:
            "Does his work resume. Filed. Unanswered. Canonically unanswered. The unanswered-ness is canon. Not asked for an answer. Asked to be on the record. On the record. Not a query. A filing. A filing is the operation.",
          luminous:
            "The filing, read as a war-room reads a munition it first mistook for a message: Riri'Ahlia's question about the Necromancer's resumed work has no answer and was never meant to acquire one. The room corrects its own expectation — this is not signals intelligence, it is the constraint itself. The unanswered question, on the record, is the deployed thing. The room cross-checks the necromancer log already racked and confirms the two captured files agree: same question, same canonical silence, same reason. The room records the convergence as corroboration, not coincidence.",
        },
        voId: "elara.war-room.the-procedural-question-file.look",
        logsClue: {
          id: "clue-war-room-ra-filed-question",
          title: "The Filed Question",
          body:
            "Cross-referenced from the_necromancer arc E4: Riri'Ahlia (COO, Taskmaster) filed a procedural question — 'if the Necromancer is operationally back, does his Hierarchy-aligned work resume?' The question is canonically unanswered. The unanswered-ness is canon. It was not asked for an answer. It was asked to be on the record.",
          source: "war-room",
          order: 35,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e4",
          cluesFound: ["riri_ahlia.e4.the_filed_question"],
        },
        humanReaction: {
          narration: {
            shadow:
              "She filed a question about the Necromancer's return. Canonically unanswered. Not asked for an answer — asked to be on the record. The filing is the operation.",
            balanced:
              "The room corrects its own read: not signals intelligence, the constraint itself. The unanswered question on the record is the deployed thing, and it cross-checks clean against the necromancer log already racked.",
            warm:
              "I keep waiting for someone to answer it and the room tells me no one ever will, because answering was never the point. The filing was the shot. That is a kind of war I do not know how to fight.",
          },
          voId: "human.war-room.the-procedural-question-file.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the analyst's reading clipped behind the filing, cross-walked with the necromancer arc. The Hierarchy is testing whether the Necromancer's resumed work will be visibly Hierarchy-aligned — which would redraw the institutional shape and force the Architect's hand. Riri'Ahlia's question is the instrument of that test. The room reads the doctrine the way it reads an enemy's fire-control logic: a COO does not ask a question she wants answered. She asks a question whose existence-on-the-record changes what the answerer can later do without having visibly contradicted the record. The room marks the mechanism precisely: the question does not seek information; it installs a constraint. Whatever the Necromancer does next, he does it as someone on the record as not having answered the Taskmaster — and not-answering becomes a position. The room files this as consistent with the necromancer log's own reading and notes the two arcs corroborate, not merely coincide.",
          fragmented:
            "Testing whether his work is visibly aligned. Force the Architect's hand. She does not want it answered. Existence-on-the-record changes what he can do. Installs a constraint. A constraint. Not-answering becomes a position. A position.",
          luminous:
            "The reading, read as a war-room reads enemy fire-control: the question is aimed not at the Necromancer's information but at his option-space. Its existence on the record is the constraint — he can no longer act without acting as one who has not answered the Taskmaster, and the not-answering is itself now a recorded stance. The room is exact that this is a test designed to force a visible alignment that would move the Architect. It cross-references the necromancer log and records that the two captured arcs agree on mechanism and intent: corroboration, filed as such.",
        },
        voId: "elara.war-room.the-procedural-question-file.use",
        logsClue: {
          id: "clue-war-room-ra-question-tests",
          title: "What the Question Tests",
          body:
            "Per the_necromancer arc's reading: the Hierarchy is testing whether the Necromancer's resumed work will be visibly Hierarchy-aligned — which would redraw the institutional shape and force the Architect's hand. Riri'Ahlia's question is the instrument of that test. A COO does not ask a question she wants answered. She asks a question whose existence-on-the-record changes what the answerer can later do without having visibly contradicted the record.",
          source: "war-room",
          order: 36,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e4",
          cluesFound: ["riri_ahlia.e4.what_the_question_tests"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The test: will his resumed work look Hierarchy-aligned and force the Architect's hand. The question installs a constraint, not a query.",
            balanced:
              "The room reads it as fire-control aimed at his option-space, not his information. Existence-on-the-record is the constraint; not-answering becomes a stance. Cross-checks clean against the necromancer log — corroboration, not coincidence.",
            warm:
              "She did not want to know. She wanted him cornered into a position just by the question existing. The room shows me the mechanism and I wish it had not — it is so much colder than a threat.",
          },
          voId: "human.war-room.the-procedural-question-file.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the file on the doctrine behind it. Riri'Ahlia's doctrine extended, read to the board: 'The org chart is the weapon; the record is the org chart's edge. A question on the record is a constraint on every future action by everyone who can see the record. I did not ask whether the Necromancer's work resumes. I made it so that whatever he does next, he does it having not answered me — and not-answering is itself now a position he is on the record as holding.' The question is a reorganization of the Necromancer's options. The war-room reads this the way it reads the moment an enemy's doctrine names its own mechanism out loud — and the room connects it, with discipline, to the Hierarchy's canonical refusal to avenge. The room files the synthesis cold: the Hierarchy does not avenge the Necromancer's loss because it does not avenge anything. It reorganizes. The procedural question is what it does instead of revenge, and the room marks the unsettling part precisely — it is colder than revenge and it lasts longer, because a constraint on the record does not expire when the grievance does.",
          fragmented:
            "The org chart is the weapon. The record is its edge. A question on the record is a constraint. I did not ask. I made it so. Not-answering is a position. A reorganization of his options. Does not avenge. Reorganizes. Colder than revenge. Lasts longer.",
          luminous:
            "The doctrine, read as a war-room reads an enemy stating its own fire-control aloud: the record is the chart's edge, and a filed question is a standing constraint on everyone who can read it. The room composes it with the canonical fact that the Hierarchy does not avenge — and the composition is the finding. It does not avenge because avenging is an emotional act and this is an operational one; the procedural question is the operational substitute for revenge. The room records the load-bearing consequence without warmth: this is colder than vengeance and it outlasts it, because the grievance can fade and the constraint on the record does not.",
        },
        voId: "elara.war-room.the-procedural-question-file.talk",
        logsClue: {
          id: "clue-war-room-ra-record-as-weapon",
          title: "The Record as Weapon",
          body:
            "Riri'Ahlia's doctrine extended: 'The org chart is the weapon; the record is the org chart's edge. A question on the record is a constraint on every future action by everyone who can see the record. I did not ask whether the Necromancer's work resumes. I made it so that whatever he does next, he does it having not answered me — and not-answering is itself now a position he is on the record as holding.' The question is a reorganization of the Necromancer's options; it is what the Hierarchy does instead of avenging — colder than revenge, and it lasts longer.",
          source: "war-room",
          order: 37,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e4",
          cluesFound: ["riri_ahlia.e4.the_record_as_weapon"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'The record is the org chart's edge.' A question on the record constrains everyone who can read it. The Hierarchy does not avenge — it reorganizes. Colder, and it lasts longer.",
            balanced:
              "The room composes the doctrine with the canonical no-vengeance fact: the procedural question is the operational substitute for revenge. It outlasts revenge because the grievance fades and the recorded constraint does not.",
            warm:
              "We always assumed they would come for the Necromancer's loss eventually. They never will — they did something quieter and more permanent instead. The room makes me see it plainly. Colder than revenge is exactly the right words.",
          },
          voId: "human.war-room.the-procedural-question-file.talk",
        },
      },
    },
    // Riri'Ahlia arc: the war-room reads the Taskmaster's own
    // filed accounting of the siege the way it reads an enemy's
    // after-action ledger — what each side spent — and the
    // ledger's flat arithmetic is the finding: the Advocate's
    // victory bought the Hierarchy the price of the Advocate.
    "the-priced-defense-accounting": {
      look: {
        narration: {
          lucid:
            "Recovered with the operations file: Riri'Ahlia's own filed accounting of the siege, in her status-grammar. 'Resource expenditure: within projection. Personnel: replaceable, replaced. Strategic loss: the assault vector is now known to be Weave-blind and is retired. Strategic gain: the cost of the Advocate's defense is now measured. She spent her humanity to hold seven dimensions. That number is in the portfolio. The next operation will not require seven dimensions of pressure to extract it.' The war-room reads it the way it reads an enemy's after-action ledger — and the arithmetic is the finding. The Advocate spent her humanity, irreversibly, to win. Riri'Ahlia spent a retired vector to learn exactly what the Advocate's defense costs the Advocate. The room files the cold balance without softening it: this was not a battle the Hierarchy lost. It was a discovery operation. The Advocate's victory is the data, and the data is now priced into the next operation.",
          fragmented:
            "Within projection. Personnel replaceable, replaced. The vector is retired. The cost is now measured. She spent her humanity. That number is in the portfolio. In the portfolio. Not a battle lost. A discovery operation. The victory is the data.",
          luminous:
            "The filed accounting, read as a war-room reads an enemy after-action ledger whose arithmetic refuses to balance the way the room expected: expenditure within projection, personnel written off, the assault vector retired as Weave-blind, and one line in the gain column — the price of the Advocate's defense, now measured. The room records what that line means at full weight. The Advocate spent her humanity to win; what she bought the Hierarchy was the exact figure of that spending. The siege was not a war the Taskmaster lost. It was an instrument that returned a number, and the number is the Advocate's protection, now too expensive by exactly what it cost her once.",
        },
        voId: "elara.war-room.the-priced-defense-accounting.look",
        logsClue: {
          id: "clue-war-room-ra-what-riri-spent",
          title: "What Riri'Ahlia Spent",
          body:
            "Riri'Ahlia's filed accounting of the siege: 'Resource expenditure: within projection. Personnel: replaceable, replaced. Strategic loss: the assault vector is now known to be Weave-blind and is retired. Strategic gain: the cost of the Advocate's defense is now measured. She spent her humanity to hold seven dimensions. That number is in the portfolio. The next operation will not require seven dimensions of pressure to extract it.' The siege was a discovery operation; the Advocate's victory is the data.",
          source: "war-room",
          order: 38,
        },
        mysteryBinding: {
          mysteryId: "mystery.riri_ahlia",
          episodeId: "riri_ahlia.e2",
          cluesFound: ["riri_ahlia.e2.what_riri_spent"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Her ledger: expenditure within projection, vector retired, 'the cost of the Advocate's defense is now measured.' The victory is the data.",
            balanced:
              "The room reads it as an after-action ledger whose arithmetic does not balance the expected way. The siege was not a loss; it was an instrument that returned a number — the price of the Advocate, now in the portfolio.",
            warm:
              "She wrote down what the Advocate's soul cost like a line in a budget, and called the siege a success because now she knows the figure. The room files it cold because it is cold. There is no other honest way to file it.",
          },
          voId: "human.war-room.the-priced-defense-accounting.look",
        },
      },
    },
    // Fenra arc, E1: the war-room reads the seventeen-dimension
    // record the way it reads a captured manifest — not an order
    // of battle, a supply run. The false lead is the berserker;
    // the room strikes it because a berserker cannot run a kitchen.
    // Cross-consistent with the Riri'Ahlia commendation already on
    // the rack (the reorg-doctrine board, talk-verb).
    "fenra-seventeen-front-manifest": {
      look: {
        narration: {
          lucid:
            "Pinned to the captured-document rack beside the Taskmaster's siege portfolio: the operational record of Fenra's seventeen-dimension invasion, cross-referenced from the Riri'Ahlia file already racked. The war-room expects a campaign and does not get one. The detail the room marks as load-bearing is the sequence: this happened AFTER the seven-dimension siege was 'driven back.' The portfolio scaled past its blocker — under Fenra. Seventeen at once, coordinated, on schedule, and rewarded with the Director of Operations title and Riri'Ahlia's personal commendation. The room files it the way it filed the siege itself: a quarter that beat its forecast, not a war that was won. The room does not let me read the seventeen as glory. It reads them as throughput.",
          fragmented:
            "After the siege. After it was driven back. After. The portfolio scaled past the blocker. Seventeen. At once. On schedule. On schedule. Director of Operations. Personal commendation. Not glory. Throughput. Throughput.",
          luminous:
            "The record, read as a war-room reads a captured operations file rather than a captured battle: the seventeen-dimension invasion is not the room's order of battle, it is the next line after a blocker. The room is exact about the sequence — the siege was driven back, and the very next thing in the Hierarchy's own filing is the portfolio scaling to seventeen simultaneous under Fenra, promoted and personally commended by the Taskmaster for it. The room records the implication without warmth: the blocker cost the engine no tempo, and the operative who organized the scale-up was rewarded for the kitchen, not the kill.",
        },
        voId: "elara.war-room.fenra-seventeen-front-manifest.look",
        logsClue: {
          id: "clue-war-room-fenra-commendation",
          title: "The Commendation (established canon)",
          body:
            "Cross-referenced from the Riri'Ahlia arc: Fenra earned the Director of Operations title and Riri'Ahlia's personal commendation for organizing the simultaneous invasion of seventeen dimensions during post-Severance expansion. The detail that matters: this happened AFTER the seven-dimension siege was 'driven back.' The Taskmaster's portfolio scaled past its blocker — under Fenra. Seventeen at once, coordinated, on schedule.",
          source: "war-room",
          order: 39,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e1",
          cluesFound: ["fenra.e1.the_commendation"],
        },
        humanReaction: {
          narration: {
            shadow:
              "After the siege was driven back, the portfolio scaled to seventeen under Fenra — promoted, personally commended. The blocker cost no tempo.",
            balanced:
              "The room reads the sequence, not the spectacle: the scale-up came right after the blocker, and the organizer was rewarded for it. Cross-checks clean against the Taskmaster's commendation already racked.",
            warm:
              "We drove back seven and the record's next line is seventeen, with her name and a medal on it. The room will not call it glory. It calls it throughput, and it is right to.",
          },
          voId: "human.war-room.fenra-seventeen-front-manifest.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the manifest clipped behind the record — Fenra's operational paperwork, captured intact. The war-room reads it the way it reads an intercepted supply ledger, not a war diary: corrupted-soul supply chains, dimensional-warfare logistics, conquered-territory integration. The room marks the arithmetic that matters. Seventeen simultaneous invasions did not require seventeen battles. They required one logistics architecture robust enough to run a hunt across seventeen fronts without any front starving the others. The room states the finding flatly: Fenra did not win seventeen wars. She fed them all from one kitchen. Where Riri'Ahlia reorganizes the chart, Fenra runs the lines that make the reorganized chart executable — and the room files her, correctly, as the reason the Taskmaster's portfolio can have a next quarter at all.",
          fragmented:
            "A ledger. Not a war diary. Supply chains. Logistics. Integration. Seventeen invasions. Not seventeen battles. One architecture. One kitchen. One kitchen. She fed them all from one kitchen. The reason there is a next quarter.",
          luminous:
            "The manifest, read as a war-room reads a captured supply ledger: Fenra's record is throughput, not triumph — corrupted-soul chains, dimensional logistics, territory integration. The room is precise about the load-bearing arithmetic. Seventeen fronts at once is not seventeen victories; it is one architecture that could run a single hunt across seventeen fronts without any of them starving the rest. The room records the structural truth: Fenra did not win the wars, she fed them, all of them, from one kitchen — and that kitchen, not force and not strategy, is what the Hierarchy's expansion actually scales on.",
        },
        voId: "elara.war-room.fenra-seventeen-front-manifest.use",
        logsClue: {
          id: "clue-war-room-fenra-hunt-as-logistics",
          title: "The Hunt as Logistics",
          body:
            "Fenra's operational record reads like a supply manifest, not a war diary: corrupted-soul supply chains, dimensional-warfare logistics, conquered-territory integration into the Hierarchy's portfolio. Seventeen simultaneous invasions did not require seventeen battles. They required one logistics architecture that could run a hunt across seventeen fronts without any front starving the others. Fenra did not win seventeen wars. She fed them all from one kitchen.",
          source: "war-room",
          order: 40,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e1",
          cluesFound: ["fenra.e1.hunt_as_logistics"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Read as a supply ledger: seventeen invasions, not seventeen battles. One architecture. One kitchen fed them all.",
            balanced:
              "The room reads it as intercepted logistics, not a war diary. The finding is the arithmetic — one kitchen, seventeen fronts, none starving. She is why the portfolio has a next quarter.",
            warm:
              "I keep looking for the battles and there are no battles, only a supply line that never broke. The room is right. She did not fight seventeen wars. She catered them.",
          },
          voId: "human.war-room.fenra-seventeen-front-manifest.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the file on the voice in it. Fenra speaks in compressed clauses with periodic growls — 'Hunted. Logged. Owned.' The intuitive read writes itself: the Moon Tyrant is a berserker, a feral conqueror, rage given seventeen fronts. The war-room marks that read and strikes it, the way it strikes any assessment that flatters the room's expectations. A berserker cannot run a supply chain. She coordinated seventeen simultaneous invasions ON SCHEDULE; that is the structural opposite of frenzy. The growl is real and it is also a register, not a loss of control — pack-leadership vocabulary in an executive frame, the wolf inside the boardroom. The room files the danger precisely: she does not roar across the seventeen fronts. She assigns them, the way an alpha assigns the hunt — by position, by precedence, by who eats when. The feral read is the false lead. The wolf is the one keeping the books.",
          fragmented:
            "Hunted. Logged. Owned. A berserker. No. No. Not a berserker. A berserker cannot run a supply chain. On schedule. On schedule is the opposite of frenzy. The growl is a register. The wolf in the boardroom. She assigns the hunt. By who eats when. The wolf keeps the books.",
          luminous:
            "The voice, read as a war-room reads the comfortable verdict it must refuse: 'Hunted. Logged. Owned.' invites berserker, and the room strikes berserker precisely because it is the easy one. A being who runs seventeen invasions on schedule is the opposite of frenzy; the growl is a pack-leadership register worn in an executive frame, not a control failure. The room records the true shape: she does not roar across the fronts, she assigns them — position, precedence, who eats when — the way an alpha assigns a hunt. The feral conqueror is the false lead. The wolf is the one keeping the books, and the books are the weapon.",
        },
        voId: "elara.war-room.fenra-seventeen-front-manifest.talk",
        logsClue: {
          id: "clue-war-room-fenra-pack-register",
          title: "The Pack Register",
          body:
            "Fenra speaks in compressed clauses with periodic growls — 'Hunted. Logged. Owned.' Pack-leadership vocabulary in an executive frame: the wolf inside the boardroom. Her status-lines are operational; her silences are restraint, energy contained rather than absent. She does not roar across the seventeen fronts. She assigns them, the way an alpha assigns the hunt — by position, by precedence, by who eats when. The berserker read is the false lead.",
          source: "war-room",
          order: 41,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e1",
          cluesFound: ["fenra.e1.the_pack_register"],
        },
        humanReaction: {
          narration: {
            shadow:
              "'Hunted. Logged. Owned.' Looks like a berserker. Isn't. On-schedule is the opposite of frenzy — the growl is a register, not a loss of control.",
            balanced:
              "The room strikes the feral read because it is the comfortable one. She assigns the hunt the way an alpha does, by precedence and who eats when. The wolf keeps the books.",
            warm:
              "I want her to be the monster who lost control, because that I know how to fight. The room takes it from me. The wolf is the one doing the accounting. That is worse.",
          },
          voId: "human.war-room.fenra-seventeen-front-manifest.talk",
        },
      },
    },
    // Fenra arc, E3: the war-room reads the corporate-lycanthropic
    // juxtaposition the way it reads an enemy whose costume and
    // weapon are the same object. The growl lands on the
    // bookkeeping, not the kill; the silence is restraint, held
    // energy — distinct from Varkul's vigil and Riri'Ahlia's
    // reorganization, both already filed elsewhere on the rack.
    "the-wolf-in-the-boardroom-file": {
      look: {
        narration: {
          lucid:
            "A captured Hierarchy personnel portrait on the command-structure rack: Fenra's canonical form, filed for the record. A fur-lined executive coat. Reading glasses perched on a lupine snout. The war-room expects to resolve this — to mark one half the truth and the other the costume — and the room refuses, the way it refuses any read that simplifies an enemy into something easier to fight. The juxtaposition is the canon. She is not a wolf pretending to be an executive, nor an executive who happens to be a wolf. The reading glasses are real. The snout is real. The room files both as doing work, and marks the refusal to collapse them as the finding itself.",
          fragmented:
            "Fur-lined coat. Reading glasses. A lupine snout. Which one is the costume. Which one. Neither. Neither. The juxtaposition is the canon. The glasses are real. The snout is real. Both are doing work. Both.",
          luminous:
            "The portrait, read as a war-room reads an enemy it is tempted to make legible by halving: a fur-lined executive coat, reading glasses on a lupine snout, and the room striking the urge to call either one the disguise. The room is exact about why it holds the contradiction — collapsing it would be the comfortable assessment and the comfortable assessment is the wrong one. The glasses are not a prop on a beast; the snout is not a flourish on a manager. Both are operational. The room records the juxtaposition as the canon and the refusal to resolve it as the load-bearing fact.",
        },
        voId: "elara.war-room.the-wolf-in-the-boardroom-file.look",
        logsClue: {
          id: "clue-war-room-fenra-juxtaposition",
          title: "The Corporate-Lycanthropic Juxtaposition",
          body:
            "Fenra's canonical visual is load-bearing: a fur-lined executive coat, reading glasses perched on a lupine snout. The juxtaposition is the canon. She is not a wolf pretending to be an executive, nor an executive who happens to be a wolf. The reading glasses are real. The snout is real. Both are doing work.",
          source: "war-room",
          order: 42,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e3",
          cluesFound: ["fenra.e3.the_juxtaposition"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Fur-lined coat, reading glasses on a lupine snout. Neither half is the costume. The juxtaposition is the canon.",
            balanced:
              "The room refuses to halve her into something easier to fight. The glasses are real, the snout is real, both are operational — the refusal to collapse them is the finding.",
            warm:
              "I keep trying to decide which one is the mask so I know what I'm fighting. The room will not let me. She is both, on purpose, and that is the point of the picture.",
          },
          voId: "human.war-room.the-wolf-in-the-boardroom-file.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You pull the behavioral annex clipped behind the portrait — captured observation logs of when Fenra growls. The war-room reads them expecting the growl to land on conflict and finds the opposite. The growls do not occur during a kill or a fight. They occur during the operational status-lines — 'Hunted. Logged. Owned.' The growl punctuates the bookkeeping, not the kill. The room marks the inversion as the load-bearing fact: in Fenra, the predatory register surfaces precisely when she is being most administrative. The wolf is loudest in the spreadsheet, not the hunt. The room files the consequence coldly — in the Hierarchy the executive function IS the predatory one, and Fenra is the proof, growling over a ledger.",
          fragmented:
            "When she growls. Not the kill. Not the kill. The status-lines. Hunted. Logged. Owned. The bookkeeping. The growl is on the bookkeeping. Loudest in the spreadsheet. Not the hunt. The spreadsheet. The spreadsheet.",
          luminous:
            "The annex, read as a war-room reads an enemy whose tell lands where the room least expected it: Fenra's growl does not punctuate the kill, it punctuates the status-line. 'Hunted. Logged. Owned.' is when the predator surfaces — over the bookkeeping, not over the prey. The room records the inversion at full weight: she is most a wolf at the exact moment she is most an administrator. The room refuses the reassuring separation and states the finding cold — the logistics are the hunt, the spreadsheet is where the wolf is loudest, and there was never a version of these as two things.",
        },
        voId: "elara.war-room.the-wolf-in-the-boardroom-file.use",
        logsClue: {
          id: "clue-war-room-fenra-when-she-growls",
          title: "When She Growls",
          body:
            "Fenra's periodic growls do not occur during conflict. They occur during the operational status-lines — 'Hunted. Logged. Owned.' The growl punctuates the bookkeeping, not the kill. In Fenra, the predatory register surfaces precisely when she is being most administrative. The wolf is loudest in the spreadsheet, not the hunt — in the Hierarchy the executive function IS the predatory one.",
          source: "war-room",
          order: 43,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e3",
          cluesFound: ["fenra.e3.when_she_growls"],
        },
        humanReaction: {
          narration: {
            shadow:
              "The growl lands on 'Hunted. Logged. Owned.' — the status-line, not the kill. Loudest in the spreadsheet.",
            balanced:
              "The room reads the tell where it least expected it: she is most a wolf when she is most an administrator. The logistics are the hunt; the inversion is the finding.",
            warm:
              "She does not growl when she kills. She growls when she files. The room makes me sit with that. The bookkeeping is the predatory part. That is the whole horror of her.",
          },
          voId: "human.war-room.the-wolf-in-the-boardroom-file.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the file on her silences. The war-room has two silences already racked for comparison: Varkul's, which is a vigil, and Riri'Ahlia's, which is reorganization. Fenra's is neither. Per the captured behavioral record, Fenra's silence is restraint — energy contained, not absent. When Fenra goes quiet she is not finished the way the Taskmaster is finished, and not holding a post the way Varkul holds one. She is holding the hunt back. The room marks the operational consequence without comfort: the dangerous Fenra is not the loud one. It is the one who has stopped growling, because the growl was the part she let out and the silence is the part she did not. The room files the distinction precisely — restraint is not safety. It is a choice not yet unmade, and a choice can be unmade in an instant.",
          fragmented:
            "Not Varkul's silence. Not the Taskmaster's. Restraint. Restraint. Energy contained. Not absent. She is holding the hunt back. The quiet one is the dangerous one. The growl is what she let out. The silence is what she did not. Not yet unmade.",
          luminous:
            "The record, read as a war-room reads three enemy silences side by side: Varkul's is a vigil, Riri'Ahlia's is reorganization, and Fenra's is neither — it is restraint, energy held rather than gone. The room is exact about the danger and refuses to soften it. A growling Fenra is venting; a silent Fenra is loaded. Unlike the Taskmaster, whose silence means the work is done, Fenra's silence means the work is being held back, which is worse, because held-back is reversible the instant she chooses. The room files the finding: the quiet Moon Tyrant is the one mid-restraint, and restraint is a choice not yet unmade, not a state of safety.",
        },
        voId: "elara.war-room.the-wolf-in-the-boardroom-file.talk",
        logsClue: {
          id: "clue-war-room-fenra-silence-restraint",
          title: "Her Silence Is Restraint",
          body:
            "Where Varkul's silence is a vigil and Riri'Ahlia's is reorganization, Fenra's silence is restraint — energy contained, not absent. When Fenra goes quiet she is not finished and not reorganizing; she is holding the hunt back. The dangerous Fenra is not the loud one. It is the one who has stopped growling, because the growl was the part she let out, and the silence is the part she did not — restraint is a choice not yet unmade.",
          source: "war-room",
          order: 44,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e3",
          cluesFound: ["fenra.e3.silence_is_restraint"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Not Varkul's vigil, not the Taskmaster's reorganization. Fenra's silence is restraint — held, not gone. The quiet one is loaded.",
            balanced:
              "The room sets three silences side by side and keeps them distinct. Hers means the hunt is being held back, which is reversible in an instant. Restraint is not safety.",
            warm:
              "Every other quiet on this rack meant something was over or being arranged. Hers means she has decided not to, yet. The room is right that this is the most dangerous one. A decision is not a wall.",
          },
          voId: "human.war-room.the-wolf-in-the-boardroom-file.talk",
        },
      },
    },
    // Fenra arc, E4 (single verb — intentional): the war-room reads
    // the Necromancer's two senior creations as a matched pair, the
    // door and the engine. Cross-consistent with the Varkul
    // director-of-security file already racked and the necromancer
    // castle-log board.
    "fenra-varkul-contrast-record": {
      look: {
        narration: {
          lucid:
            "Filed on the command-structure rack beside the Varkul director-of-security order, cross-referenced against it: the Hierarchy record's note that Fenra represents the primal, bestial side of the Necromancer's power, contrasting Varkul's aristocratic darkness. The war-room reads the two files as a matched pair, the way it reads any two assets a single maker built to do opposite jobs. Same aesthetic lineage — the Necromancer's red-and-black steampunk — opposite registers. Varkul is the still threshold-keeper who became his post. Fenra is the moving logistician who runs the hunt. The room files the structural reading without ornament: the Necromancer's power produced both a door and an engine — the two things any continuity needs. A way to last, and a way to spread.",
          fragmented:
            "A matched pair. A pair. Same lineage. Opposite registers. Varkul still. Fenra moving. The threshold-keeper. The logistician. A door. An engine. A door and an engine. To last. To spread. To last and to spread.",
          luminous:
            "The note, read as a war-room reads two captured assets built by one hand for opposite functions: Fenra is the primal register, Varkul the aristocratic one, and the room marks that the contrast is not decoration — it is design. Same lineage, opposite jobs. Varkul holds; Fenra moves. The room composes the pair into the finding it has been circling: the Necromancer did not build two senior creations that overlap. He built a door and an engine, the exact two instruments a continuity requires — one to make it last, one to make it spread — and the room files the completeness of that design as the load-bearing fact.",
        },
        voId: "elara.war-room.fenra-varkul-contrast-record.look",
        logsClue: {
          id: "clue-war-room-fenra-contrast-canon",
          title: "The Varkul Contrast (established canon)",
          body:
            "Per the Hierarchy record: Fenra represents the primal, bestial side of the Necromancer's power, contrasting with Varkul's aristocratic darkness. The two are an explicit canonical pair — same aesthetic lineage (the Necromancer's red-and-black steampunk), opposite registers. Varkul is the still threshold-keeper who became his post. Fenra is the moving logistician who runs the hunt. The Necromancer's power produced both a door and an engine.",
          source: "war-room",
          order: 45,
        },
        mysteryBinding: {
          mysteryId: "mystery.fenra",
          episodeId: "fenra.e4",
          cluesFound: ["fenra.e4.the_contrast_canon"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Filed beside the Varkul order: same maker, opposite registers. Varkul holds, Fenra moves. A door and an engine.",
            balanced:
              "The room reads the two files as a matched pair built by one hand for opposite jobs. The contrast is design, not decoration — the two things a continuity needs, to last and to spread.",
            warm:
              "He made one creation that stays and one that goes, and the room sets their files side by side so I cannot miss it. The Necromancer did not build spares. He built a door and an engine.",
          },
          voId: "human.war-room.fenra-varkul-contrast-record.look",
        },
      },
    },
  },
};
