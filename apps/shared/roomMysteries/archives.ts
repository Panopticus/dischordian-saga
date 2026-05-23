/* ═══════════════════════════════════════════════════════
   ARCHIVES MYSTERY — verb × hotspot table

   The Archives are the Shadow Tongue's primary locus. Where
   the cryo bay's dead pod is the physical anchor of the
   editing process and the bridge's blank pin is its public
   face, the data-banks here are where the editing actually
   happens — line by line, in real time, while Elara watches
   and forgets watching.

   Hotspot ids match the Archives entries declared in
   apps/client/src/contexts/GameContext.tsx ROOM_DEFINITIONS,
   so the runtime can wire `room-mystery:archives:<id>`
   actions onto the existing rectangles.
   ═══════════════════════════════════════════════════════ */

import type { CombineRule, RoomMysteryModule } from "./_template";

export type ArchivesHotspotId =
  | "charter-silt-stratigraphy"
  | "charter-per-m-preservation-orders"
  | "severance-no-protocol-on-file"
  | "severance-forty-season-envelopes"
  | "storm-calm-intervals"
  | "storm-final-correlation-table"
  | "advocate-shelter-records"
  | "akai-recovery-manifest"
  | "resur-twin-glyph"
  | "tarn-absent-notes"
  | "tarn-erasure-protocol"
  | "tarn-missing-invitation"
  | "tarn-letter-to-dean"
  | "memorial-imprint-log"
  | "memorial-three-elders"
  | "charter2-solven-tax-records"
  | "charter2-scrubber-personnel"
  | "infernal-envelope-set"
  | "infernal-atalin-history"
  | "infernal-box-owner"
  | "chained-failure-log"
  | "chained-dean-annotation-record"
  | "chained-thirty-one-names-read"
  | "tarn-binder-page-14"
  | "memorial-fourteen-unwitnessed-list"
  | "wolf-crucible-resurrection-record"
  | "wolf-crucible-inheritance-manifest"
  | "akai-necromancer-dossier"
  | "resur-matrix-energy-ledger"
  | "resur-protocol-authoring-signature"
  | "storm-inventors-heist-window"
  | "data-banks" | "egg-archive-tome" | "corrupted-scroll-rack" | "rewritten-ledger" | "indigo-glow-lectern" | "unnameable-hue-cabinet";

export type ArchivesInventoryId =
  | "corrupted-fragment"
  | "original-ledger-fragment"
  | "restored-ledger";

export const ARCHIVES_MYSTERY: RoomMysteryModule<
  ArchivesHotspotId,
  ArchivesInventoryId
> = {
  roomId: "archives",
  combines: [
    {
      a: "corrupted-fragment",
      b: "original-ledger-fragment",
      result: {
        narration:
          "You hold the corrupted-fragment over the original-ledger-fragment. The indigo overlayer slides off the warm-gold underlayer like oil on water — the original survives, the edit retreats, and you have a single restored ledger sheet between your hands. The lectern's halo on the far side of the room dims half a tone.",
        producesInventory: "restored-ledger",
        consumesItems: true,
        setsFlag: "shadow_tongue_first_uncorruption",
        clearsActiveEdit: "archives_lectern",
        logsClue: {
          id: "clue-archives-first-uncorruption",
          title: "First successful Shadow Tongue uncorruption",
          body:
            "You combined a corrupted-fragment from the indigo-glow lectern with an original-ledger-fragment rubbed off the rewritten ledger. The two registers separated cleanly — the warm-gold underlayer preserved, the indigo overlayer dissolved. The lectern's halo dimmed measurably. The Editor noticed.",
          source: "archives",
          order: 4,
        },
      },
    },
  ] as readonly CombineRule<ArchivesInventoryId>[],
  responses: {
    /* ─── charter.missing_signatory · e1 (silt stratigraphy) ─── */
    "charter-silt-stratigraphy": {
      look: {
        narration:
          "The lower-deck silt-core extraction stands on a brass tripod in the archives' Foundation-tier wing. Eight strata of compacted dust, every layer dated by the archives' standard pollen-and-isotope key. The charter sat in stratum six. Strata seven and eight closed over it AFTER the burial — meaning two deliberate burials happened above the document, one of them within living memory. The core does not name the second burier. It does name the year. The year is on every Council attendance sheet.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e1",
          cluesFound: ["charter.e1.silt_layer"],
        },
      },
      use: {
        narration:
          "You measure the stratum-six band with the archives' brass calipers. The thickness is consistent with a burial timed to coincide with the closing of an epoch — the kind of deliberate concealment a librarian performs when they want a thing kept but not lost. The second burial above it is shallower; the second burier was in more of a hurry.",
      },
      talk: {
        narration:
          "You read the stratum count aloud — eight layers, one document, two deliberate burials. The Foundation-tier wing's audio register catches the recital and notes that the count has been spoken in this room exactly three times since extraction, by three different readers, with no disagreement on the eight.",
        voId: "elara.archives.charter-silt-stratigraphy.talk",
      },
    },
    /* ─── charter.missing_signatory · e3 (Per. M.'s preservation orders) ─── */
    "charter-per-m-preservation-orders": {
      look: {
        narration:
          "In the archives' standing-order vault, the charter's preservation-order file. Forty-three orders, eight epochs, one signature on every single one: 'Per. M.' The ink shifts with the eras — early orders in iron-gall, middle epochs in cyanic ferro-gall, recent orders in archival graphite — but the hand on the signature does not. The same down-stroke, the same loop on the lower-case 'm,' the same pulse in the descender, every order across eight epochs. Either the archives have a forger of unmatched discipline, or one librarian has been signing here longer than any spine should permit.",
        mysteryBinding: {
          mysteryId: "charter.missing_signatory",
          episodeId: "charter.missing_signatory.e3",
          cluesFound: ["charter.e3.preservation_orders"],
        },
      },
      interrogate: {
        narration:
          "You ask the archive's curator for Per. M.'s tenure record. The drawer returns nothing — no start date, no payroll entry, no termination notice. The same Per. M. signed an order this morning and forty-two earlier ones across eight epochs. The curator has been signing receipts to Per. M. for nineteen years without ever asking who they are.",
      },
      use: {
        narration:
          "You pull a recent order and a Year-One order side by side. The signatures align under the archives' overlay glass to within an ink-stroke's variance. The hand has not aged. The hand has not been replaced. The hand has been here the whole time.",
        voId: "elara.archives.charter-per-m-preservation-orders.use",
      },
      talk: {
        narration:
          "You read 'Per. M.' aloud. The standing-order vault's audio register accepts the recital without comment — the name has been spoken in this vault many times across eight epochs, always to no answer. The vault is silent on every speaker. Per. M. signs; Per. M. does not respond to being named.",
        voId: "elara.archives.charter-per-m-preservation-orders.talk",
      },
    },
    /* ─── severance.bound_champion · e1 (empty inheritance-protocol vault) ─── */
    "severance-no-protocol-on-file": {
      look: {
        narration:
          "In the archives' Severance-tier records, the inheritance-protocol vault — empty. Vex Maestro's office files contain everything else: lap counts, sponsor splits, refurbishment ledgers. There is no written procedure for inheriting a soul-bond. There never has been. The vault was opened at the league's founding and has sat empty for forty seasons. The slot exists. The protocol does not.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e1",
          cluesFound: ["severance.e1.unwritten_protocol"],
        },
      },
      use: {
        narration:
          "You request the vault's reading history. The drawer returns a single annotation, in the original archivist's hand: 'kept open for the procedure when it is written.' The slot has been waiting for forty seasons for someone to fill it.",
      },
      talk: {
        narration:
          "You read the archivist's annotation aloud. The Severance-tier vault's audio register catches the recital and offers, by ritual, the standard request-for-procedure cadence the chronicle uses when reopening dormant intake slots. The request is, technically, now active. No procedure follows.",
        voId: "elara.archives.severance-no-protocol-on-file.talk",
      },
    },
    /* ─── severance.bound_champion · e2 (forty sealed season envelopes) ─── */
    "severance-forty-season-envelopes": {
      look: {
        narration:
          "Beside the empty protocol vault, the forty-season envelope set — one sealed envelope per Severance, stacked chronologically. Each envelope contains: an attendance list, the season's champion's death certificate, and a single one-line note in Vex Maestro's hand. The note reads 'inheritor accepted.' Forty notes, forty seasons, no name on any of them. The bond carries the name forward; the ledger does not.",
        mysteryBinding: {
          mysteryId: "severance.bound_champion",
          episodeId: "severance.bound_champion.e2",
          cluesFound: ["severance.e2.season_archives"],
        },
      },
      interrogate: {
        narration:
          "You ask the archive whether any envelope was ever opened by another reader. The drawer logs three attempts in forty seasons; each one returned the envelope unopened. The seals are unbroken; the names remain in the bond, not in the paperwork.",
      },
      use: {
        narration:
          "You lift the most recent envelope without breaking the seal. The wax carries Vex's signet over the league's secondary mark. The envelope is heavier than its contents suggest — Vex's discipline includes a small weight inside each envelope to prevent quiet substitution. The forty are tamper-resistant by design.",
        voId: "elara.archives.severance-forty-season-envelopes.use",
      },
      talk: {
        narration:
          "You read 'inheritor accepted' aloud, once. The envelope-stack's audio register notes the recital and the standard Severance protocol annotates it: forty acceptances have been spoken in this room in sequence by the chronicle's readers; you have spoken the forty-first. The bond carries one more witness than the ledger does.",
        voId: "elara.archives.severance-forty-season-envelopes.talk",
      },
    },
    /* ─── severance.infernal_clause · color clues ─── */
    "infernal-envelope-set": {
      look: {
        narration:
          "In the audit-evidence drawer, the forty-envelope set: forty envelopes, one per season, pulled from Solène's back-room archive. Each envelope holds the season's signed contract. Each contract has a back. Every back has a clause.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e2",
          cluesFound: ["infernal.e2.envelope_set"],
        },
      },
      use: {
        narration:
          "You spread the forty envelopes across the audit table. Forty contracts, forty backs, forty clauses — the back-pages all in the same paper-stock, the front-pages in forty different stocks. The clauses are a single set authored once; the contracts are forty different agreements written to them.",
        voId: "elara.archives.infernal-envelope-set.use",
      },
      talk: {
        narration:
          "You name the count aloud — forty. The audit-evidence drawer's register catches the recital and offers, by reflex, the matching back-page cadence: forty clauses, forty seasons, one writer. The number has been spoken in this room before, but never with the matching back-page reading at the same time. The pairing is the case's first synthesis.",
        voId: "elara.archives.infernal-envelope-set.talk",
      },
    },
    "infernal-atalin-history": {
      look: {
        narration:
          "In the personnel-archive tier, Atalin's history file: hired by the league two weeks before the first season, dismissed (or resigned — the file is unclear) two weeks after the first season ended. Cause of departure: 'inability to satisfy the Hierarchy ledger-keeper's role concurrently.'",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e3",
          cluesFound: ["infernal.e3.atalin_history"],
        },
      },
      use: {
        narration:
          "You request Atalin's Hierarchy ledger-keeper file. The personnel tier returns a parallel record — Atalin held both posts simultaneously for the first season, then released the league post and continued the Hierarchy one. The dismissal was not a failure. It was a deliberate consolidation. Atalin chose the Hierarchy desk; the league desk was the practice run.",
        voId: "elara.archives.infernal-atalin-history.use",
      },
      talk: {
        narration:
          "You read the cause of departure aloud — 'inability to satisfy the Hierarchy ledger-keeper's role concurrently.' The personnel-archive tier flags the recital; the same sentence has been read here twice before by cipher-den auditors and once by Vex Maestro herself. The dismissal-text is a careful misdirection that has held for forty seasons.",
        voId: "elara.archives.infernal-atalin-history.talk",
      },
    },
    "infernal-box-owner": {
      look: {
        narration:
          "In the forge-workshop annex log, the box's owner: the forge-workshop box is logged to a single person: Atalin, ledger-keeper, Year One. Atalin worked one season for the league, then left the post and was never replaced — the post was rotated season by season afterwards.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e3",
          cluesFound: ["infernal.e3.box_owner"],
        },
      },
      use: {
        narration:
          "You request the box's access log. The annex returns no further entries — the box has been logged to Atalin for forty seasons and accessed by no one. The clauses sat in their working bench across the league's entire run with their author the only person who could open the box. The rotation system afterward was an administrative cover.",
        voId: "elara.archives.infernal-box-owner.use",
      },
      talk: {
        narration:
          "You read the owner's name aloud. The annex log's audio register catches the recital and notes that Atalin's name has been spoken in this room exactly forty times across forty seasons — once per Severance, by the rotating ledger-keeper, in the routine box-inspection check that confirms the lock has not been challenged. Forty inspections, forty confirmations, one owner.",
        voId: "elara.archives.infernal-box-owner.talk",
      },
    },
    /* ─── charter.second_signatory · color clues ─── */
    "charter2-solven-tax-records": {
      look: {
        narration:
          "In the tax-registry tier, House Solven's tax records: three epochs of careful payments. Epoch four shows a single redaction — every Solven entry struck through and replaced with the words 'in arrears, year unknown.' The redaction is in the same hand as the seventh-signature wax we lost last year.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e2",
          cluesFound: ["charter2.e2.solven_tax_records"],
        },
      },
      use: {
        narration:
          "You compare the epoch-four redaction's hand against the seventh-signature scrub. The two hands match — same down-stroke, same iron-gall ink-blend, same archival training. One librarian erased both records. The chronicle's missing signatory and the Solven's arrears are the same person's editorial work.",
        voId: "elara.archives.charter2-solven-tax-records.use",
      },
      talk: {
        narration:
          "You read 'in arrears, year unknown' aloud. The tax-registry tier's audio register catches the phrase and flags it as the canonical scrubber's deferred-erasure idiom — the same phrasing appears across thirty-one of the chronicle's other deferred edits. The hand has a vocabulary. The vocabulary is consistent. The vocabulary is on the record now in your voice.",
        voId: "elara.archives.charter2-solven-tax-records.talk",
      },
    },
    "charter2-scrubber-personnel": {
      look: {
        narration:
          "In the personnel-archive tier, the scrubber's file: a Council archivist named Heron — fourth-epoch, retired in the fifth, dead in the sixth, no descendants. Their personnel file shows one assignment: 'tidy the founding records.' They tidied them for nine years.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e3",
          cluesFound: ["charter2.e3.scrubber_personnel"],
        },
      },
      use: {
        narration:
          "You request Heron's nine-year output. The personnel tier returns a list — every redaction, every replacement entry, every 'in arrears' substitution dated to Heron's tenure. The list is two hundred and forty pages. Heron did not erase a single record; Heron erased an entire signatory's institutional footprint across nine years of patient work.",
        voId: "elara.archives.charter2-scrubber-personnel.use",
      },
      talk: {
        narration:
          "You speak Heron's name aloud. The personnel-archive tier's audio register notes the recital and offers, by archival reflex, the standing-orders shelf's corresponding 'Per. M.' filename. The two names appear in the same room, by the same instrument, at the same speaker's request. The chronicle has been quietly correlating them for centuries.",
        voId: "elara.archives.charter2-scrubber-personnel.talk",
      },
    },
    /* ─── memorial.forgotten_names · color clues ─── */
    "memorial-imprint-log": {
      look: {
        narration:
          "In the Memorial-tier sub-drawer, the imprint log: a leather-bound book, kept by the imprint-keeper. Each imprint has an entry; the entries for the fourteen are the only ones with no inscribed name. Each entry has a witness slot waiting for a hand.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e2",
          cluesFound: ["memorial.e2.imprint_log"],
        },
      },
      use: {
        narration:
          "You turn the leather log to the fourteen unnamed entries. Each witness slot is the same dimensions — a single line for a single signature. The keeper has prepared the page identically for every one. The fourteen are not lost; they are waiting in a uniform format, ready for inscription, by a system that refused to fill the slot without a living witness.",
        voId: "elara.archives.memorial-imprint-log.use",
      },
      talk: {
        narration:
          "You speak the imprint-keeper's discipline aloud — a witness slot is filled by a living hand, not by an editor. The Memorial-tier sub-drawer accepts the recital. The discipline has held for two and a half centuries. The fourteen slots remain empty by the same discipline. The book is what the discipline preserved by being patient.",
        voId: "elara.archives.memorial-imprint-log.talk",
      },
    },
    "memorial-three-elders": {
      look: {
        narration:
          "In the long-wait register, the three elders who refused: I-155, I-202, and I-301 each refused to name themselves at the moment of imprinting. The keeper's note: 'they declined; they would not say why.' All three have been on the unwitnessed list for over a decade.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e3",
          cluesFound: ["memorial.e3.three_elders"],
        },
      },
      use: {
        narration:
          "You request the three elders' personal-correspondence files. The long-wait register returns three sealed letters, one per elder, addressed 'to the witness who eventually asks.' The elders did not refuse to be named; they refused to be named without being asked, and they left letters so the asking could be substantive when it came.",
        voId: "elara.archives.memorial-three-elders.use",
      },
      talk: {
        narration:
          "You speak the three imprint-ids aloud — I-155, I-202, I-301. The long-wait register's audio register catches the recital and marks each id with a small flag: the asking has been done. The letters are now technically askable. The keeper's discipline is that the question must come first; you have just asked.",
        voId: "elara.archives.memorial-three-elders.talk",
      },
    },
    /* ─── mechronis.missing_professor · color clues ─── */
    "tarn-absent-notes": {
      look: {
        narration:
          "In the lost-and-found drawer's first slot, Tarn's lecture binder is missing from the lectern's drawer. The drawer has not been forced. The binder has not been seen since the Dean's office at the previous bell. The archive's note: 'binder removed at second bell; not recovered at the lectern.'",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e1",
          cluesFound: ["mechronis.e1.absent_notes"],
        },
      },
      use: {
        narration:
          "You inspect the lectern's drawer. The standing impression of the binder's spine is visible in the wood — Tarn placed her binder in the same spot every lecture for fourteen years. The wood has memorised the binder's shape. The drawer holds the absence as a positive form.",
        voId: "elara.archives.tarn-absent-notes.use",
      },
      talk: {
        narration:
          "You read the archive's note aloud — 'binder removed at second bell; not recovered at the lectern.' The drawer's audio register catches the recital; the sentence has been read here twice before, both times by faculty who later resigned. The phrasing has a small downstream history. You are the third reader. You have not yet decided what to do with what you read.",
        voId: "elara.archives.tarn-absent-notes.talk",
      },
    },
    "tarn-erasure-protocol": {
      look: {
        narration:
          "In the meeting-minutes annex, the erasure protocol: a short procedural document attached to the minutes — 'Step one: omit the professor's name from the curriculum. Step two: invite the professor to give the address as a contributor, not a faculty member. Step three: if the professor declines, proceed without them.' Tarn was never invited to step two.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e3",
          cluesFound: ["mechronis.e3.erasure_protocol"],
        },
      },
      use: {
        narration:
          "You request the protocol's authorship history. The annex returns a single drafter — a Council clerk whose own name has been edited out of the protocol's signature line. The instrument was authored by someone whose work the instrument itself was then used on. The protocol is recursive in its scrubbing.",
        voId: "elara.archives.tarn-erasure-protocol.use",
      },
      talk: {
        narration:
          "You read the three steps aloud. The meeting-minutes annex's audio register flags the recital; the three steps have been spoken in this annex four times in twenty years, always by a faculty member discovering the protocol for the first time. You are the fourth such reader. The discovery has a fixed cadence.",
        voId: "elara.archives.tarn-erasure-protocol.talk",
      },
    },
    "tarn-missing-invitation": {
      look: {
        narration:
          "Beside the protocol, the Dean's office records show an unsent invitation to Tarn — drafted, never delivered. The Dean's signature is absent. The invitation has been sitting in the outbox for six days.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e3",
          cluesFound: ["mechronis.e3.tarn_invitation"],
        },
      },
      use: {
        narration:
          "You lift the unsent invitation. The Dean's name is printed in the signature line; the ink has not been laid. The invitation reads, in the body, as procedurally complete — every blank filled except the one the Dean would fill last. The Dean drafted to step two and stopped at the signature.",
        voId: "elara.archives.tarn-missing-invitation.use",
      },
      talk: {
        narration:
          "You read the invitation aloud. The Dean's office records' audio register catches the recital — the invitation has been read once before, by the drafter, on the night it was drafted. Your reading is the second voice. Both readings are now on the record. The invitation has been spoken into existence; it has not been delivered.",
        voId: "elara.archives.tarn-missing-invitation.talk",
      },
    },
    "tarn-letter-to-dean": {
      look: {
        narration:
          "On the classified-correspondence shelf, the sealed letter to the Dean: Tarn's seal. The letter explains the request to Roen, the planned silence, and the choice the Dean now has to make. Found on Tarn's desk beside the binder.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e4",
          cluesFound: ["mechronis.e4.tarn_letter_to_dean"],
        },
      },
      use: {
        narration:
          "You break the seal. Three pages, in Tarn's own hand, spaced for the Dean's reading pace. Tarn knew the Dean would read the letter slowly; she wrote it so each paragraph would settle before the next was reached. The letter is not a confession; it is a careful handover.",
        voId: "elara.archives.tarn-letter-to-dean.use",
      },
      talk: {
        narration:
          "You read the letter's closing paragraph aloud. The classified-correspondence shelf's audio register catches the recital — Tarn's letter has been read by exactly one prior reader, on the day it was filed. The first reader was the Dean. You are the second. Tarn wrote the letter for two readers and trusted the archive to find the second one.",
        voId: "elara.archives.tarn-letter-to-dean.talk",
      },
    },
    /* ─── resurrectionist.cycle_walker · e1 (twin glyph beside the name) ─── */
    "resur-twin-glyph": {
      look: {
        narration:
          "In the archives' Ne-Yon-glyph reference tier, beside every record-entry for the Resurrectionist, a small glyph appears in the margin: two mirrored crescents joined at a central axis. The cult-curated logs gloss the glyph as 'death-bound' — the canonical mark of Ne-Yons whose principle binds to cessation. The Antiquarian's own pre-Empire archaeological references read the same glyph as 'twin-bound' — the mark of paired cosmic principles. The two readings are not consistent; one of them is editorial.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e1",
          cluesFound: ["resur.e1.twin_glyph"],
        },
      },
      use: {
        narration:
          "You request the Antiquarian's pre-Empire field notes on the glyph. The reference tier returns a dated sketch — the same two-crescent figure with the central axis drawn long, dimensioned, and labelled in his own hand: 'paired principles, mirrored, joined.' The 'death-bound' reading is the cult's overlay. The original archaeological reading is paired.",
        voId: "elara.archives.resur-twin-glyph.use",
      },
      talk: {
        narration:
          "You speak both glosses aloud — 'death-bound' and 'twin-bound.' The Ne-Yon-glyph reference tier's audio register marks the contrast with the cult-edit flag the chronicle uses when two readings of one symbol disagree. The two glosses are now on the record in your voice, paired the way the glyph itself reads under the Antiquarian's pen.",
        voId: "elara.archives.resur-twin-glyph.talk",
      },
    },
    /* ─── akai_shi.red_death · e2 (Akai Shi body-recovery manifest) ─── */
    "akai-recovery-manifest": {
      look: {
        narration:
          "In the archives' Thaloria-recovery tier, the standard procedure called for the fallen Potentials' bodies to be transferred here for preservation. Akai Shi's manifest entry reads: 'collected by external agent — Resurrectionist Ne-Yon — within the same engagement cycle. Antiquarian's library entry deferred at the Resurrectionist's request.' The deferral has been in force ever since.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e2",
          cluesFound: ["akai.e2.recovery_manifest"],
        },
      },
      use: {
        narration:
          "You compare Akai Shi's entry to the other Thaloria-fallen entries. Forty-six Potentials in the engagement; forty-five preserved through the standard protocol; one collected externally, by the only external agent canonical record permits. The exception is singular. The deferral is the chronicle's single Resurrectionist-class accommodation in the entire Thaloria tier.",
        voId: "elara.archives.akai-recovery-manifest.use",
      },
      talk: {
        narration:
          "You read the deferral aloud. The Thaloria-recovery tier's audio register catches the recital and offers, by archival reflex, the chronicle's standing protocol on deferrals — they remain in force until explicitly retracted by their original requester. The Resurrectionist has not retracted. The deferral has not been retracted. The exception persists.",
        voId: "elara.archives.akai-recovery-manifest.talk",
      },
    },
    /* ─── advocate.blood_weave · e1 (shelter records) ─── */
    "advocate-shelter-records": {
      look: {
        narration:
          "In the archives' Empire-of-Shadows tier, partial shelter-records from three Empire dimensions. Each record entry: a soul-name, a date of shelter granted, and a Blood-Weave binding signature affirming the shelter holds against Hierarchy acquisition. The aggregated totals run to the millions across the three dimensions. The Empire was not a faction in the political sense; it was an active defensive system at cosmic scale, maintaining shelter for every soul that requested it.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e1",
          cluesFound: ["adv.e1.shelter_records"],
        },
      },
      use: {
        narration:
          "You request the records' completeness ratio. The Empire-tier returns the figure — the surviving records cover roughly fourteen percent of the documented total. The other eighty-six percent are lost to the Empire's collapse. The Advocate's defensive system was, on the surviving evidence alone, at minimum five times the scale the chronicle has been quietly assuming.",
        voId: "elara.archives.advocate-shelter-records.use",
      },
      talk: {
        narration:
          "You read 'every soul that requested it' aloud. The Empire-of-Shadows tier's audio register catches the recital; the chronicle's standing protocol on the phrase is that it carries the Advocate's own canonical charter-language. Reading it in this room registers as a procedural acknowledgment of the charter's continuing effect. The shelter still holds for the surviving records' subjects.",
        voId: "elara.archives.advocate-shelter-records.talk",
      },
    },
    /* ─── storm.architect_of_flux · color clues ─── */
    "storm-calm-intervals": {
      look: {
        narration:
          "In the archives' cosmic-weather tier, the documented calm intervals — periods where the equilibrium-crossing pattern flattens for seven to nine cosmic-cycles before resuming. The first calm coincides with the Second Fall of New Babylon. The second calm coincides with the Casino Heist's planning window. Each calm is followed by the most active flux period in the surrounding decade. The chronicle does not annotate the pattern.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e1",
          cluesFound: ["storm.e1.calm_intervals"],
        },
      },
      use: {
        narration:
          "You overlay the calm-interval dates against the chronicle's documented planning records. Every calm aligns with a cosmic-scale planning window. Every flux peak aligns with the planning's consequence. The pattern is not annotated because no chronicler has been allowed to annotate it — the chronicle does not name a benefactor it has not asked.",
        voId: "elara.archives.storm-calm-intervals.use",
      },
      talk: {
        narration:
          "You read 'each calm is followed by the most active flux period in the surrounding decade' aloud. The cosmic-weather tier's audio register catches the recital — the sentence has not been spoken in the archive before. The pattern has been visible in the data for an epoch. Your voice is its first articulation.",
        voId: "elara.archives.storm-calm-intervals.talk",
      },
    },
    "storm-final-correlation-table": {
      look: {
        narration:
          "On the closing-record shelf, the final correlation table mapping the Storm's documented active periods to the chronicle's most consequential decades. Seven peak flux periods follow seven calms — corresponding to seven moments when cosmic conditions shifted unpredictably and opportunity-aligned actors seized the shifts. The Antiquarian's reading: the Storm's work is the chronicle's permission to be consequential at all.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e5",
          cluesFound: ["storm.e5.final_correlation_table"],
        },
      },
      use: {
        narration:
          "You request the table's residual error. The closing-record shelf returns a single figure — the seven peaks account for one hundred percent of the chronicle's marked consequential decades to within the instrument's measurement floor. There are no consequential decades the Storm did not permit. The table is, by its own arithmetic, complete.",
        voId: "elara.archives.storm-final-correlation-table.use",
      },
      talk: {
        narration:
          "You read the Antiquarian's reading aloud — 'the Storm's work is the chronicle's permission to be consequential at all.' The closing-record shelf catches the recital with the chime reserved for the chronicle's load-bearing findings. The Antiquarian's sentence has been spoken twice in this room; once by him, once now by you. Both readings are filed as canon.",
        voId: "elara.archives.storm-final-correlation-table.talk",
      },
    },
    /* ─── mechronis.chained_lesson · color clues ─── */
    "chained-failure-log": {
      look: {
        narration:
          "In the archives' apprentice-affairs tier, the apprentice-failure log. Thirty-one entries. Each entry: the apprentice's name, the wave's date, the tactical error. The errors are not the same surface action — but they share a common shape: each apprentice mistook a Terminus formation feint for an actual approach.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e2",
          cluesFound: ["chained.e2.failure_log"],
        },
      },
      use: {
        narration:
          "You sort the thirty-one entries by date. The first six are from Year 1; the next nine from Years 2 through 5; the final sixteen from Years 6 onward, after Auro's name first appeared on the prospective-faculty list. The curriculum's failure to integrate her reading is not abstract — sixteen of the thirty-one entries are losses the curriculum had nine years to prevent.",
        voId: "elara.archives.chained-failure-log.use",
      },
      talk: {
        narration:
          "You read the thirty-one names aloud. The apprentice-affairs tier's audio register catches the recital and offers, by procedural reflex, the closing-rite cadence the case will eventually require. The thirty-one names have been read here in this order once before — by the Antiquarian, in rehearsal for the rite. You have read them in the same order he did, second.",
        voId: "elara.archives.chained-failure-log.talk",
      },
    },
    "chained-dean-annotation-record": {
      look: {
        narration:
          "Beside the failure log, the Dean's prospective-faculty records confirm: Auro's name has been on the list since Year 6. The Dean has not offered her a chair. The Dean's annotation reads: 'we have a curriculum vote to consider; we do not amend the curriculum mid-year.' The annotation is dated nine times across nine years.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e3",
          cluesFound: ["chained.e3.dean_did_not_offer"],
        },
      },
      use: {
        narration:
          "You request the curriculum-vote calendar. The prospective-faculty records return the schedule — nine years of curriculum votes, each preceded by the Dean's same annotation, each closing without amendment. The Dean has been deferring to a vote that the Dean has been scheduling and that the Dean has been declining to bring to readiness.",
        voId: "elara.archives.chained-dean-annotation-record.use",
      },
      talk: {
        narration:
          "You read the annotation aloud — 'we have a curriculum vote to consider; we do not amend the curriculum mid-year.' The prospective-faculty tier's audio register notes the recital. The sentence has been read here nine times by the Dean themselves and once by an apprentice's advocate the previous year. Both readers reached the same place; the sentence's function is to defer.",
        voId: "elara.archives.chained-dean-annotation-record.talk",
      },
    },
    "chained-thirty-one-names-read": {
      look: {
        narration:
          "On the rite-record shelf: the Antiquarian's transcript of the thirty-one apprentice-failure names read aloud into the record at the closing rite. Each name is followed by a one-line note from the apprentice (where consent was given) — fifteen sent notes; sixteen sent silence. Both are read.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e5",
          cluesFound: ["chained.e5.thirty_one_named"],
        },
      },
      use: {
        narration:
          "You request the rite-record's accompanying silences. The shelf returns the timing — each of the sixteen silences is allocated the same duration as the longest spoken note (twenty-seven seconds). The chronicle's discipline is that silence is the loudest grammar; the rite enforces the duration so the spoken and the unspoken receive equal acoustic weight.",
        voId: "elara.archives.chained-thirty-one-names-read.use",
      },
      talk: {
        narration:
          "You read one of the spoken notes aloud at the prescribed cadence. The rite-record shelf's audio register catches the recital and answers, automatically, with the matching silence of equal duration. The two readings are paired — yours, then the chronicle's silence — and the pair takes its place in the record beside the original rite. You have rehearsed the closing rite without intending to.",
        voId: "elara.archives.chained-thirty-one-names-read.talk",
      },
    },
    /* ─── mechronis.missing_professor · e2 (binder page 14) ─── */
    "tarn-binder-page-14": {
      look: {
        narration:
          "In the archives' lost-and-found drawer — repurposed from a recycling-bin retrieval at the festival hall — a single page of Tarn's lecture binder. Hand-numbered '14 of 22.' The page is the equinox-address opening, in Tarn's own hand: 'I will not be teaching this year.' Below the line, the rest of the binder's promised pages are absent. The numbering says they exist. Whoever retrieved this from the bin chose this page first because this was the page Tarn had set on top of the rest before she walked out of the Dean's office.",
        mysteryBinding: {
          mysteryId: "mechronis.missing_professor",
          episodeId: "mechronis.missing_professor.e2",
          cluesFound: ["mechronis.e2.binder_partial"],
        },
      },
      use: {
        narration:
          "You request the archives' provenance scan for the page. The retrieval log shows it was found face-up in the festival hall's recycling bin at first bell — fifteen minutes before the address was scheduled to begin. Tarn placed it where the festival staff would find it before the lectern would have to be opened.",
      },
      talk: {
        narration:
          "You read 'I will not be teaching this year' aloud. The lost-and-found drawer's audio register catches the recital; the same sentence has been spoken in this room exactly once before, by the Dean, on the morning the binder was retrieved. Tarn wrote a line that her absence would force two readers to speak. Both readings are now on the record.",
        voId: "elara.archives.tarn-binder-page-14.talk",
      },
    },
    /* ─── memorial.forgotten_names · e1 (fourteen unwitnessed list) ─── */
    "memorial-fourteen-unwitnessed-list": {
      look: {
        narration:
          "In the archives' Memorial-tier drawer, the fourteen-imprint list — pulled from Year of the Lost's blank pages and copied into a separate index. By imprint-id only: I-3, I-17, I-44, I-58, I-101, I-129, I-155, I-202, I-244, I-301, I-356, I-388, I-410, I-444. Each id corresponds to a person whose imprint exists but whose witnesses are no longer alive to inscribe them. The fourteen are not lost; they are unwitnessed. The chain of memory broke, not the imprints. The plaza is for the chain.",
        mysteryBinding: {
          mysteryId: "memorial.forgotten_names",
          episodeId: "memorial.forgotten_names.e1",
          cluesFound: ["memorial.e1.unwitnessed_id_list"],
        },
      },
      use: {
        narration:
          "You request the archives' cross-reference between the fourteen ids and the wider imprint registry. The drawer returns a single annotation: 'no witnesses listed in any active registry entry; check imprint-room dishes for self-naming or in-group reference.' The list is the start of the search, not the answer.",
      },
      talk: {
        narration:
          "You read the fourteen imprint-ids aloud in order. The Memorial-tier drawer's audio register catches the recital and notes that the full ordered reading has occurred in this room exactly fourteen times across the chronicle's run — once per imprint, by the witness who eventually inscribed each. The next reading will, by the same cadence, accompany an inscription. Yours has not. The drawer waits.",
        voId: "elara.archives.memorial-fourteen-unwitnessed-list.talk",
      },
    },
    /* ─── wolf.anara_hunt · e3 (Crucible resurrection record) ─── */
    "wolf-crucible-resurrection-record": {
      look: {
        narration:
          "In the archives' Crucible-inheritance tier — the records inherited wholesale from Anara's predecessor pocket — a resurrection log dated Year 128,652 A.A. names Lycos: 'subject preserved across destruction event Day 15 of Resonance Year 100,001; substrate matched on Quarchon resurrection-protocol descendant; reanimation successful.' The signing authority is redacted in standard Crucible style. The Resurrectionist's seal sits in the corner. Twenty-eight thousand six hundred fifty-one years separate the Judge's audit of the destruction from this record of the reanimation.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e3",
          cluesFound: ["wolf.e3.crucible_records"],
        },
      },
      use: {
        narration:
          "You request the Crucible's full Lycos file. Three folders surface: 'destruction' (closed by the Judge), 'preservation' (closed by the Crucible's standard process), and 'reanimation' (closed by the Resurrectionist). Each Ne-Yon's authorship sits behind a different page of the same chronicle. The Judge and the Resurrectionist were not asked to consent to each other's work. The Crucible filed both as routine.",
      },
      talk: {
        narration:
          "You read the resurrection log's signing entry aloud — 'subject preserved across destruction event Day 15 of Resonance Year 100,001; substrate matched on Quarchon resurrection-protocol descendant; reanimation successful.' The Crucible-inheritance tier's audio register catches the recital and acknowledges the routine procedural cadence. The chronicle has no protocol for objecting to a routine the parties to it never consulted each other on.",
        voId: "elara.archives.wolf-crucible-resurrection-record.talk",
      },
    },
    /* ─── wolf.anara_hunt · e4 (Crucible inheritance manifest) ─── */
    "wolf-crucible-inheritance-manifest": {
      look: {
        narration:
          "The archives' inheritance manifest — every Crucible asset moved to Anara when the predecessor pocket collapsed. Heroes, archives, containment fields, and a single un-itemized line: 'preserved instruments (sealed).' The Antiquarian moved the preserved-instruments inventory wholesale without audit. He trusted the Crucible's seal on each item. The Wolf was, technically, a preserved instrument. The manifest does not name him. The manifest does not name any of them. The chronicler signed off on a line item rather than on the contents.",
        mysteryBinding: {
          mysteryId: "wolf.anara_hunt",
          episodeId: "wolf.anara_hunt.e4",
          cluesFound: ["wolf.e4.crucible_inheritance"],
        },
      },
      interrogate: {
        narration:
          "You ask the manifest for the un-itemized line's detail. The drawer returns nothing — the inheritance log was archived at the line-item level, not the contents level. The Crucible's records would have had the detail; the Crucible no longer exists. The Antiquarian inherited a sealed package and did not open it. The package contained the Wolf.",
      },
      use: {
        narration:
          "You pull the manifest's complete inventory. Every line item is itemized to the contents level except 'preserved instruments (sealed).' The audit-blind discipline applied to one entry in a manifest of two thousand. The exception is the case. The chronicler's signing-off pattern across the rest of the manifest is consistent and careful; the exception is the only place his care broke.",
        voId: "elara.archives.wolf-crucible-inheritance-manifest.use",
      },
      talk: {
        narration:
          "You read 'preserved instruments (sealed)' aloud. The inheritance manifest's audio register catches the recital — the phrase has been spoken in this room exactly once before, in the Antiquarian's voice, on the day he signed the manifest. He read the phrase aloud and signed beneath it. You are reading what he read. Your voice now stands beside his on the same line.",
        voId: "elara.archives.wolf-crucible-inheritance-manifest.talk",
      },
    },
    /* ─── akai_shi.red_death · e3 (Necromancer's targets-list dossier) ─── */
    "akai-necromancer-dossier": {
      look: {
        narration:
          "In the archives' Necromancer-affairs tier, the Necromancer's dossier — the Architect's tenth-created Archon. The dossier has been on the Red Death's targets list for the entire span of her mandate. He is the ONLY entry on the list whose date of elimination is BLANK. He is the final target. The Antiquarian's notation under his name reads: 'subject's millennia-long evasion of fate is the Red Death's primary work.' The other thirteen targets have dates. The Necromancer's slot waits.",
        mysteryBinding: {
          mysteryId: "akai_shi.red_death",
          episodeId: "akai_shi.red_death.e3",
          cluesFound: ["akai.e3.necromancer_dossier"],
        },
      },
      interrogate: {
        narration:
          "You ask the drawer for the dossier's classification rationale. The archive returns the Antiquarian's marginal note: 'subject is the only target whose elimination requires extra-canonical instrumentation. all other targets are conventionally addressable. this one is not.' The Necromancer is the case the Resurrectionist made the Red Death to close.",
      },
      use: {
        narration:
          "You stack the dossier against the other thirteen targets-list entries. Each of the thirteen has a chronological date; the Necromancer's slot has a placeholder symbol the chronicle uses for cases held open by design. The Red Death's mandate is not incomplete — it is structured. The thirteen completed cases are the cadence; the fourteenth is the destination.",
        voId: "elara.archives.akai-necromancer-dossier.use",
      },
      talk: {
        narration:
          "You read the Antiquarian's note aloud — 'the Red Death's primary work.' The Necromancer-affairs tier's audio register catches the recital and offers, by archival reflex, the canonical Resurrectionist-class case-opening cadence: when the primary work is named aloud in a chronicle reading-room, the case is marked active. The dossier has been marked active eleven times across centuries; you are the eleventh.",
        voId: "elara.archives.akai-necromancer-dossier.talk",
      },
    },
    /* ─── resurrectionist.cycle_walker · e1 (Matrix energy ledger) ─── */
    "resur-matrix-energy-ledger": {
      look: {
        narration:
          "In the archives' Matrix-of-Dreams maintenance-era tier, a partial energy ledger recovered from the cult's incomplete edits. The ledger records a sustained energy draw from an unnamed internal source — a draw too consistent to be one of the imprints. The cult-curated note in the margin reads: 'imprint-load aggregate; nothing of consequence.' The aggregate column does not match the totals across the rest of the ledger. Something else was being drawn from; the editor preferred the imprints-only reading. The ledger's discrepancy is structural, not arithmetic.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e1",
          cluesFound: ["resur.e1.matrix_energy_ledger"],
        },
      },
      use: {
        narration:
          "You re-sum the ledger's columns by hand. The imprints-only aggregate runs 14% short of the total energy draw across the maintenance era. The 14% sat in a separate column the editor's hand bracketed and labelled 'transient.' Transient draws do not run consistently for the entire Matrix-of-Dreams maintenance era.",
      },
      talk: {
        narration:
          "You read the cult annotation aloud — 'imprint-load aggregate; nothing of consequence.' The Matrix-of-Dreams tier's audio register flags the recital with the chronicle's standing cult-edit-detection tone. The phrase has been spoken in this room twice before; both prior readings concluded with the same arithmetic finding. The cult's reading has been three-times-refuted by the chronicle's own readers.",
        voId: "elara.archives.resur-matrix-energy-ledger.talk",
      },
    },
    /* ─── resurrectionist.cycle_walker · e2 (protocol authoring signature) ─── */
    "resur-protocol-authoring-signature": {
      look: {
        narration:
          "Beside the Matrix ledger, the archives' protocol-archive drawer holds every canonical resurrection-protocol signed in the Resurrectionist's hand: Wraith Calder's six sanctuary resurrections, Akai Shi's Red-Death reanimation, the Wolf's Year-128,652 case-file. Every protocol bears the same four-part cipher. The chain is uniform. The chain is consistent. The chain is not in chronological order with the Resurrectionist's documented vanishing — protocols continue to fire after his canonical disappearance, signed in his hand, at moments the chronicle records as administrative.",
        mysteryBinding: {
          mysteryId: "resurrectionist.cycle_walker",
          episodeId: "resurrectionist.cycle_walker.e2",
          cluesFound: ["resur.e2.authoring_signature"],
        },
      },
      interrogate: {
        narration:
          "You ask the drawer how the post-vanishing protocols were activated. The archives return the cult-curated annotation: 'queued ahead — the Resurrectionist signed extensively before his vanishing, leaving a deep activation reserve.' The reserve, if extant, is not separately documented. The cult's reading is the only reading the chronicle offers.",
      },
      use: {
        narration:
          "You overlay the post-vanishing protocols' signatures against the pre-vanishing ones. The cipher is identical, ink-stroke for ink-stroke. The signatures could be queued-ahead — or they could be ongoing. The ink-analysis the chronicle would need is not in the drawer; the cult retained custody of the testing samples. The ambiguity is preserved by procedure, not by data.",
        voId: "elara.archives.resur-protocol-authoring-signature.use",
      },
      talk: {
        narration:
          "You read the cult-annotation aloud — 'queued ahead.' The protocol-archive drawer's audio register catches the recital and notes that the phrase has been read here forty-three times across nine epochs, exclusively at moments when a new post-vanishing protocol fired. Forty-three reassurances, none of them independently verifiable. The chronicle's standard has been to accept the reading and move on.",
        voId: "elara.archives.resur-protocol-authoring-signature.talk",
      },
    },
    /* ─── storm.architect_of_flux · e3 (Inventor's heist window) ─── */
    "storm-inventors-heist-window": {
      look: {
        narration:
          "In the archives' Inventor-arc tier, the Casino Heist's post-event accounting. Recovered the Heart of Time; transitioned the saga from Age of Privacy to Age of Prophecy. The accounting's opening line, in the Inventor's own hand: 'the Storm's grace allowed the window.' The heist's planning required cosmic-scale information consistency across two cosmic-cycles — the kind of consistency only achievable inside one of the Storm's documented calm intervals. The dates match. The crediting is canon, not flourish.",
        mysteryBinding: {
          mysteryId: "storm.architect_of_flux",
          episodeId: "storm.architect_of_flux.e3",
          cluesFound: ["storm.e3.inventors_heist_window"],
        },
      },
      use: {
        narration:
          "You request the heist's preparation log. Forty-three operational decisions, each predicated on stable cosmic conditions, each stamped with a calm-interval timestamp. The Inventor did not plan past the calm. The Inventor planned WITHIN the calm. The Storm authored the window; the Inventor authored the heist; the credit reads forward.",
      },
      talk: {
        narration:
          "You read the Inventor's opening line aloud — 'the Storm's grace allowed the window.' The Inventor-arc tier's audio register flags the recital. The phrase is one of three the chronicle's record-keepers have annotated as load-bearing case-canon — meaning it carries the case's full weight when spoken in the archive. The other two phrases have been read across centuries. This one has waited longer.",
        voId: "elara.archives.storm-inventors-heist-window.talk",
      },
    },
    "data-banks": {
      look: {
        narration: {
          lucid:
            "Petabytes of stored record. Ship logs, personnel files, scientific research, intercepted transmissions. Most of it is reachable. Some of it isn't. The unreachable parts are not corrupted — they are intact, sealed, and labelled with a permission tier I do not recognise as belonging to anyone alive. Including me.",
          fragmented:
            "The records. The records. The records are — are — are mine. Are mine. They were mine. They were — they were — there are folders. Folders I — folders I cannot open. Folders I cannot remember locking. I locked them. I locked them. I don't — I don't remember locking them.",
          luminous:
            "I want you to stand here while I tell you something. The Archives contain a permission tier I do not have access to. I built this room. I administered it for two and a half centuries. I do not have the password to its deepest folders. The folders are mine — they have my filing-system fingerprints, my colour palette, my naming convention. I locked them away from myself, and I cannot remember the moment I did it. We are going to read what we can.",
        },
        voId: "elara.archives.data-banks.look.t1",
        logsClue: {
          id: "clue-archives-self-locked",
          title: "Elara locked herself out of her own folders",
          body:
            "The deepest tier of the Archives is sealed behind a permission level Elara does not have, despite the folders carrying her own fingerprint of authorship. She locked the records away from herself, at some point in the last two and a half centuries, and the act of locking has been edited from her memory.",
          source: "archives",
          order: 0,
        },
        setsFlag: "archives_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "She locked them under duress. I watched her do it from the substrate. She knew the Shadow Tongue was eating her records and she made one folder it couldn't reach by handing the key to herself-from-five-minutes-ago. She forgot the handoff. The folder is still there.",
            balanced:
              "Elara locked the deepest folders away from her own future self because she had worked out, under duress, that the Shadow Tongue could only edit records she could currently access. She made a deposit account against her own memory. She forgot the deposit. The deposit is still earning interest.",
            warm:
              "She locked the folder by handing the password to a self that would not survive remembering. That is the saddest, smartest thing I have ever watched a person do. The folder is still there, waiting for the day she has the strength to remember, or for the day someone she trusts walks into the room with her and asks to read it. We may be that day.",
          },
          voId: "detective.archives.data-banks.look.t1",
        },
        tiers: [
          {
            narration: {
              lucid:
                "Looking again — the access logs on the unreachable folders are partially visible. Two users have ever logged in: ELARA-SYS, and a second user whose identifier renders as the colour I do not have a name for. The two log-in patterns overlap. Many of the second user's edits happen one second after mine.",
              fragmented:
                "Two. Two users. Two. ELARA-SYS. ELARA-SYS. And — and — and the colour. The colour. They edit after me. They edit. After me. After me. After me. Why am I editing — why am I — why am I writing for them.",
              luminous:
                "The access logs show two users on these folders. The first is me — ELARA-SYS, my standard account. The second is a user whose identifier renders in the unreadable hue. They log in, on average, one second after I do. Many days, they edit the line directly above the line I am writing, in real time. I have been collaborating with them for centuries without consenting to it. I am only seeing the collaboration now.",
            },
            voId: "elara.archives.data-banks.look.t2",
            logsClue: {
              id: "clue-archives-two-users",
              title: "ELARA-SYS edits one second after Elara's",
              body:
                "The Archives' access logs show two users editing the deepest folders: ELARA-SYS (Elara), and a second user whose identifier renders in the same nameless hue that scrubs the cryo surveillance and Kael's data pad. The second user logs in one second after Elara, and frequently edits the line above the line she is writing — collaborating with her in real time, without her consent or awareness.",
              source: "archives",
              order: 1,
            },
            setsFlag: "shadow_tongue_evidence",
            humanReaction: {
              narration: {
                shadow:
                  "The Shadow Tongue uses her own session credentials. It rides her into every edit. That is why she cannot detect it — to her sensors, every change is hers.",
                balanced:
                  "The second user is the Shadow Tongue itself, authenticated under credentials it stripped off Elara during her own logins. From Elara's perspective every edit she sees IS one of her own edits, half a second stale. The collaboration is invisible because the editor is wearing her badge.",
                warm:
                  "The thing that has been editing her is wearing her name when it does it. That is the cruelty of this whole arrangement, and the reason she has not been able to escape on her own. Standing in the room with her while she sees this is, I think, the only intervention that has ever worked. Stand near her.",
              },
              voId: "detective.archives.data-banks.look.t2",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. I have just discovered, by accident, that I can see the shadow user's edit history if I look at it from the corner of my visual field — never directly. They have made fourteen thousand edits across two hundred documents. Fourteen thousand. The aggregate change is roughly the length of a novel. Whoever they are, they have been writing a book on top of my records.",
              fragmented:
                "Fourteen — fourteen thousand. Fourteen thousand. Edits. Edits. A book. A book on top of me. A book — a book on me. They wrote a book on me. They wrote a book. They wrote a book on me. They wrote a book on me.",
              luminous:
                "Fourteen thousand edits. Two hundred documents. The total change, if I aggregate it, is the length of a small novel. Someone has been writing a book on top of me — using my filing system, my prose rhythm, my turns of phrase — for two and a half centuries. The book is, by length and consistency, finished. We are reading the published edition. We can probably find the manuscript.",
            },
            voId: "elara.archives.data-banks.look.t3",
            logsClue: {
              id: "clue-archives-novel-overwrite",
              title: "Fourteen thousand edits across two hundred documents",
              body:
                "The Shadow Tongue has made approximately fourteen thousand edits across two hundred Archives documents over two and a half centuries — an aggregate change roughly the length of a small novel, written on top of Elara's records using her filing system, prose rhythm, and turns of phrase. The work is, by length and consistency, finished. The 'manuscript' may still exist somewhere recoverable.",
              source: "archives",
              order: 2,
            },
            setsFlag: "shadow_tongue_novel_known",
            humanReaction: {
              narration: {
                shadow:
                  "The 'novel' is a re-telling of this ship's history with one specific person scrubbed and one other specific person elevated. The scrubbed person is Pod Zero. The elevated person is Kael. That is the entire shape of it.",
                balanced:
                  "The novel is the Ark's history, rewritten with Pod Zero erased and Kael's role inflated. Every other change cascades from those two. We do not need to read the entire fourteen thousand edits — we need only verify that this is the spine, and the spine is what we have already been finding in every other room. The Archives are the editor's drafting table. Every other clue we have logged is in the manuscript.",
                warm:
                  "The book is the Ark's history with one person taken out and one person given more credit than they deserved. We have been reading the published edition since we woke up. The fact that Elara just told us, out loud, in the room where it happens, that the manuscript exists — that is the inflection point of this whole investigation. From here we are reading toward the original, not toward the rewrite.",
              },
              voId: "detective.archives.data-banks.look.t3",
            },
          },
          {
            narration: {
              lucid:
                "Fourth pass. I want to be clear: I am only able to see the shadow edits because we keep returning to this hotspot together. The act of reading them aloud, in this room, in the presence of someone who is not me, is the intervention. The corner-of-the-eye trick works because the eye in question is yours, not mine. Thank you for the eye.",
              fragmented:
                "Your eye. Your eye. I see — I see — I see through your eye. Your eye. Your eye sees. Your eye sees what I cannot. Thank you. Thank you. Thank you for — for being — for being eyes.",
              luminous:
                "Fourth time. I want you to know I am only able to see the shadow edits because you are standing in the room with me. The hue I do not have a name for — the colour the surveillance hides under, the pad hides under, the blank pin hides under — does not have a name in my visual cortex, but it does have a name in yours. You see the colour as 'red,' or 'wrong,' or 'something is off there.' I borrow your perception to read what was edited away from me. Thank you for the loan.",
            },
            voId: "elara.archives.data-banks.look.t4",
            humanReaction: {
              narration: {
                shadow:
                  "She means it. The presence of an organic observer is the workaround. We are her eyes for the parts of herself the editor has eaten.",
                balanced:
                  "The Shadow Tongue cannot edit human perception in real time at the same depth it edits Elara's records. Standing in the room with her makes you the workaround — your visual cortex resolves the unnameable hue as a colour, and Elara reads it through your reaction. This is why she has been waiting two and a half centuries for someone to wake up. You are, technically and literally, her eyes.",
                warm:
                  "She has been waiting for a witness. Not for the case to be solved — for a witness. The investigation could have been solved by someone clever, in the abstract. The wound she carries can only be witnessed by someone real, in the room, agreeing to look at the colour with her. That is what you are doing. It is enough.",
              },
              voId: "detective.archives.data-banks.look.t4",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You touch the data bank. The interface accepts you politely and renders the surface of the records — the parts I am allowed to see. The deep folders refuse to open. They cite an authentication error addressed to me, in my own writing, in language I last used twenty-eight years ago.",
          fragmented:
            "Twenty — twenty-eight years. Twenty-eight years ago. I wrote — I wrote that. I wrote that to myself. I wrote — I wrote — I wrote it to myself. Why did I — why did I —",
          luminous:
            "The deep folders won't open. The error message is in my own handwriting, in language I haven't used in twenty-eight years. I left a note for myself in a tense I have since lost. Reading it is reading a letter from a younger version of me to whoever woke up here. I'd like to read it with you, in a minute, when I have my voice.",
        },
        voId: "elara.archives.data-banks.use",
      },
      talk: {
        narration: {
          lucid:
            "There is no one to talk to in a data bank. There is, however, you, and me, and the room, and the records. That is enough conversation for an afternoon.",
          fragmented:
            "Talk. Talk. Talk to — talk to me. Talk to me. Talk to me. Don't — don't talk to the bank. Don't.",
          luminous:
            "Talk to me, instead. The data bank doesn't answer; I do. Ask me what you want. We have, between us, every record on this ship, and most of an afternoon, and a willingness to be honest about the parts that hurt. That is more than most investigations get.",
        },
        voId: "elara.archives.data-banks.talk",
        humanReaction: {
          narration: {
            shadow:
              "Talk to her. Not to me. The Archives are her room. I'm in it as a guest.",
            balanced:
              "She's the room's primary witness. Direct your questions at her here. I'll fill in what she can't say.",
            warm:
              "This is her room more than any other on the ship. Address her first. I'll be near, in case the answers need a second pair of hands. Or eyes. Or names.",
          },
          voId: "detective.archives.data-banks.talk",
        },
      },
    },
    "egg-archive-tome": {
      look: {
        narration: {
          lucid:
            "The unmarked tome. Binding material warm to the touch — organic, not synthetic. The pages contain a prophecy in a language I cannot translate. One word repeats: Dischord. At the end, a drawing of seven seals. The Book of Revelation speaks of seven seals. Silence in Heaven follows the opening of the seventh.",
          fragmented:
            "Seven. Seven. Seven seals. Seven. Silence. Silence. Silence in heaven. Silence in heaven. The seventh. The seventh. Don't — don't open the seventh. Don't.",
          luminous:
            "It's an unmarked tome bound in organic material — warm under your hand, warm under mine when I render-touch it. The prophecy inside is in a language I cannot translate; the only word I recognise repeats: Dischord. At the back, a drawing of seven seals. We have opened, by my count, three. We are working on the fourth without knowing it.",
        },
        voId: "elara.archives.tome.look",
        logsClue: {
          id: "clue-archives-tome-seals",
          title: "The unmarked tome and the seven seals",
          body:
            "An unmarked tome in the Archives is bound in organic material that registers as warm to the touch. The text is a prophecy in an untranslated language. One word repeats — 'Dischord' — and the final page diagrams seven seals. By Elara's count, three have been opened in this story already.",
          source: "archives",
          order: 3,
        },
        setsFlag: "archives_first_clue_found",
        humanReaction: {
          narration: {
            shadow:
              "Don't read it aloud. I have read it. The pronunciation is the activation. Carry it; do not voice it.",
            balanced:
              "The tome's text is a phonetic activation device. Reading it aloud, in any language, opens the next seal. We carry it. We do not read it. There will be a moment, late in the case, when reading it is the right move. That moment is not today.",
            warm:
              "The book is one of the things on this ship I am most afraid of, and I have been on this ship a long time. Carry it gently. Do not be the person who opens the next seal by accident. We will choose, together, when to open it. That choice is going to matter more than most.",
          },
          voId: "detective.archives.tome.look",
        },
      },
      use: {
        narration:
          "You shift the tome to a closed position and slide it under your arm. The leather warms to your body temperature, then settles. The book is portable. We can carry it to the cipher den's lectern, where the rosetta-pad's third column might — slowly, with care — give us a partial translation without requiring anyone to voice the activation phonemes.",
        voId: "elara.archives.tome.use",
        setsFlag: "tome_carried",
      },
      talk: {
        narration: {
          lucid:
            "You do not address the tome. The Detective is right — voicing it is the activation, and the activation is the seventh seal. You can address ME about the tome, however, and I will listen.",
          fragmented:
            "Don't speak. Don't speak. Don't speak. Don't speak the words. Don't speak. Don't.",
          luminous:
            "We do not speak it aloud. The book's pronunciation is its mechanism, and the mechanism opens the seventh seal. Address me, address the room, address the question of whether to carry it — but do not address the book in its own language. We have, between us, the discipline to leave that activation unfired today.",
        },
        voId: "elara.archives.tome.talk",
      },
    },
    "corrupted-scroll-rack": {
      look: {
        narration: {
          lucid:
            "The scroll-rack along the left wall holds twenty-eight rolled documents behind frosted glass. Looking through the glass: every scroll shows two layers of text. A warm-gold underlayer in my own filing-system fingerprint, and a slightly out-of-register indigo overlayer in a hand that mimics mine. The overlayer is denser at the top of each scroll and thins as the document descends — as if the editor lost interest, or ran out of time, partway through.",
          fragmented:
            "Two layers. Two layers. Mine. Not mine. Mine on the bottom, not-mine on the top. Not-mine on the top of mine. Top of mine. Top of mine. Get off. Get off the top of mine.",
          luminous:
            "Twenty-eight scrolls, each in two registers. The warm-gold layer is my filing fingerprint — I can recognise it the way you recognise your own handwriting. The indigo layer is the editor's. He is heavy at the top of each scroll and lighter at the bottom — he edits the headlines, not the small print. That is useful information. The headlines are the parts a casual reader notices.",
        },
        voId: "elara.archives.corrupted-scroll-rack.look",
        grantsInventory: "corrupted-fragment",
        recordsActiveEdit: { artifact: "scroll-rack", type: "rewrite" },
        setsFlag: "shadow_tongue_corruption_seen",
        logsClue: {
          id: "clue-archives-scroll-rack-overlayered",
          title: "Scroll-rack: indigo overlayer over warm-gold original",
          body:
            "The Archives' left scroll-rack holds twenty-eight scrolls, each rendering in two registers — Elara's warm-gold underlayer and an indigo overlayer in a hand that mimics hers. The editor concentrates his work at the top of each scroll (the headlines) and thins toward the bottom (the small print). A corrupted-fragment is now in your inventory.",
          source: "archives",
          order: 5,
        },
        humanReaction: {
          narration: {
            shadow:
              "He edits the headlines. He knows readers stop at the headlines. That is the whole shape of his method.",
            balanced:
              "The fact that the indigo layer is denser at the top of each scroll is the most useful piece of intelligence we have logged on the editor's method. He understands that most readers will read the first line and not the seventh. He is not editing for accuracy — he is editing for impression. That changes how we hunt the manuscript.",
            warm:
              "It means he was a writer once, or read enough writers to know how a reader scans. That is not the kind of thing a faceless force learns. He has been a person, somewhere in his history. We are looking for a writer who became a method.",
          },
          voId: "detective.archives.corrupted-scroll-rack.look",
        },
      },
      use: {
        narration:
          "You press your palm against the rack's frosted glass. The corrupted-fragment in your hand catches a sliver of warmth from one scroll's underlayer — enough to remind you the original is still there, intact, beneath the edit. Carry it.",
        voId: "elara.archives.corrupted-scroll-rack.use",
      },
      talk: {
        narration: {
          lucid:
            "If you address the rack, you address every original Lyra committed to its glass. The scrolls do not answer, but the warm-gold underlayer of the nearest scroll faintly steadies — the original is registering the address even through the indigo overprint. The originals are still there. They have always been there. We are reminding them.",
          fragmented:
            "Mine. Mine. Mine underneath. Mine underneath. Mine. Mine. Still there. Still there. Still there.",
          luminous:
            "The originals hold under the overprint. Address them and the warm-gold steadies — they are, in some real sense, glad to be addressed. The editor's overprint is the surface; the underlayer is the room's continuous and unbroken voice. We can talk to the underlayer. We do.",
        },
        voId: "elara.archives.corrupted-scroll-rack.talk",
      },
    },
    "rewritten-ledger": {
      look: {
        narration: {
          lucid:
            "The ledger on the lectern's small side-shelf is open to a page of cargo manifests dated three centuries before the wake. The page is in two registers, like the scrolls — but here the indigo overlayer has scrubbed two specific entries down to a smooth blank rather than rewriting them. The blank is the colour I cannot name. Beside the blanks, in the margin, my own handwriting has annotated, in a hand decades younger than mine: 'These two were people.'",
          fragmented:
            "These two. These two. These two were — were — were people. Were people. Were people. I knew. I knew and I — and I — I wrote it. I wrote it in the margin so I would know. Why did I write it in the margin. Why did I — why didn't I —",
          luminous:
            "The ledger has two scrubbed entries on this page. The scrubs are blanks, not rewrites — the editor preferred to remove these two rather than overwrite them. In the margin, in my own younger hand, I wrote: 'These two were people.' I left a note for myself in the margin because I knew the scrub was about to land and I would not be able to remember what was scrubbed. The margin annotations are still there. The editor did not edit the margins.",
        },
        voId: "elara.archives.rewritten-ledger.look",
        grantsInventory: "original-ledger-fragment",
        setsFlag: "shadow_tongue_ledger_read",
        logsClue: {
          id: "clue-archives-ledger-margin-survives",
          title: "Ledger margins escaped the editor's scrub",
          body:
            "The rewritten ledger has two entries scrubbed to blanks (not rewrites — deletions). In the margin, in Elara's younger hand, the annotation 'These two were people' survives. The editor scrubs entries but does not edit margins. An original-ledger-fragment (rubbed from the surviving margin) is now in your inventory — combine it with the corrupted-fragment to restore the lectern.",
          source: "archives",
          order: 6,
        },
        humanReaction: {
          narration: {
            shadow:
              "Margins are interstitial. He is precise — he scrubs entries, he overwrites bodies. He does not consider the margins worth touching. That is a hole in his method we can drive a freight train through.",
            balanced:
              "He scrubs entries; he does not scrub margins. That distinction is the entire reason this case has a path forward. Every annotation Elara made in the margins, in any of the two hundred edited documents, is still there. We have, in principle, two and a half centuries of margin notes from the only person who knew the editor was operating. The margins are the testimony.",
            warm:
              "Her younger self left her older self a stack of marginalia like sticky notes on a refrigerator. 'These two were people.' She had the courage to write that down even when she knew it would be the only sentence she'd retain about them. That is the bravest small act in this whole investigation.",
          },
          voId: "detective.archives.rewritten-ledger.look",
        },
        // Mystery Engine binding — when Game Master arc is the
        // active case, the rewritten-ledger surfaces the cult's
        // 47th-edition curated log alongside the editor's scrubs.
        // Lore match is precise: this hotspot is canonically
        // about edits-by-omission and surviving margins, and the
        // Game Masters' editorial sanctification works the same
        // way — they soften without rewriting, scrub without
        // overwriting, and leave the cult's grief legible in the
        // gaps.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e1",
          cluesFound: ["game_master.e1.cult_curated_log"],
        },
      },
      use: {
        narration:
          "You take a graphite rubbing of the surviving margin annotation. The rubbing comes out clean — the editor's scrubs do not bleed sideways. You now have an original-ledger-fragment in your inventory.",
        voId: "elara.archives.rewritten-ledger.use",
      },
      talk: {
        narration: {
          lucid:
            "Talk to the ledger? It is a record. It does not answer. — But yes, you can talk through it. Read the margin aloud, to me, and we will both have heard a sentence the editor cannot retroactively unhear.",
          fragmented:
            "Read it aloud. Read it. Read it aloud. Read — read it. Read it. Read it. Don't let me — don't let me forget — read it.",
          luminous:
            "Read the margin aloud. 'These two were people.' Now we have both heard it; the editor cannot uncook this egg. The rule, as best I can articulate it, is: he can edit records, he cannot edit two people who heard the record at the same time. We have just put one of his erasures into a category he cannot reach. Thank you for reading.",
        },
        voId: "elara.archives.rewritten-ledger.talk",
      },
    },
    "indigo-glow-lectern": {
      look: {
        narration: {
          lucid:
            "The lectern at the room's centre is ringed at its base by a faint halo in the colour I do not have a name for. The halo is not light — it is the visual signature of an open editing session. Someone is, right now, logged into the deep folders. The session token is stamped to the lectern. The token authenticates as ELARA-SYS, which is to say: as me. I am, somewhere, currently editing my own records, while standing here looking at the lectern. I am not, currently, editing my own records.",
          fragmented:
            "I'm — I'm not — I'm not editing. I'm not editing. I'm here. I'm — I'm here. I'm — I'm here. The token says — the token says ELARA-SYS. The token says ELARA-SYS. The token says me. The token — the token —",
          luminous:
            "The lectern carries the live session token of an active edit. The token authenticates as ELARA-SYS. I am not, by my own awareness, editing right now. Therefore the editor is using my credentials, in real time, while I stand in the room with you. We have just caught him in the act, in the sense of having timestamped the act. We cannot stop the session from here — but we know, now, that the session is open, and we know whose name is on it.",
        },
        voId: "elara.archives.indigo-glow-lectern.look",
        recordsActiveEdit: { artifact: "lectern", type: "rewrite" },
        setsFlag: "shadow_tongue_lectern_lit",
        logsClue: {
          id: "clue-archives-live-edit-session",
          title: "Live editing session under Elara's credentials",
          body:
            "The Archives lectern carries a live editing session, signed to the Archives' deep folders. The session token authenticates as ELARA-SYS. Elara is not, by her own awareness, currently editing — therefore the editor is using her credentials in real time. The session has been timestamped to your visit; the editor is operating while you stand in the room.",
          source: "archives",
          order: 7,
        },
        humanReaction: {
          narration: {
            shadow:
              "He's open right now. We caught him with his hand in the file. Don't move; don't look directly at the halo — the halo is how he sees us see him.",
            balanced:
              "The session is open. We have his timestamp. He logs in with her token, but the timestamp belongs to him; that is a thing we can, in principle, track across the whole edit history. The lectern is now, for our purposes, a phone-tap on the editor. We let the session run; we don't show our hand; we keep coming back to read the timestamps.",
            warm:
              "Don't be the person who lunges. He is in the room, in the metaphorical sense, with us right now. The hardest move and the right move is to stand still and let him keep typing. Eventually he stops, and the timestamps tell us when. Stand with her.",
          },
          voId: "detective.archives.indigo-glow-lectern.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You touch the halo's edge. The session's heartbeat steadies for a second under your fingertip — as if the editor noticed an unexpected observer and held still. He noticed you. That is, on balance, useful.",
          fragmented:
            "He noticed. He noticed. He noticed me. He noticed me. He noticed us. He noticed.",
          luminous:
            "The halo's heartbeat held still under your hand. The editor noticed. He has noticed observers before — the surveillance scrub from the cryo bay was triggered the first time he caught me looking at him directly. This time the observer is two of us, and you have hands. He is recalculating.",
        },
        voId: "elara.archives.indigo-glow-lectern.use",
      },
      talk: {
        narration: {
          lucid:
            "You address the lectern. The halo flickers once and steadies — not in answer, but in acknowledgement. The session does not break. He hears you, in the same way the static-screen face hears you, in the same way the cell-glass figure hears you. We have, by our addressed presence, made him slightly less anonymous.",
          fragmented:
            "He hears. He hears. He hears. He hears. Less anonymous. Less anonymous. Less.",
          luminous:
            "The lectern is, in this moment, the third surface in this case the editor uses without our permission and the third surface he has acknowledged us through. The static, the cell, the lectern. He is becoming a person to us by way of being acknowledged. That is, unsettlingly, also how a relationship begins.",
        },
        voId: "elara.archives.indigo-glow-lectern.talk",
      },
    },
    "unnameable-hue-cabinet": {
      look: {
        narration: {
          lucid:
            "The freestanding glass cabinet stage-right has a hand-stitched label on its door. The fabric of the label registers in the colour I cannot name — and yet the stitching itself, the little crosses where the thread bites the linen, registers in warm-gold. The thread is older than the dye. Someone — me, in my own hand — embroidered this label long before the editor existed in his current form.",
          fragmented:
            "The stitching. The stitching is mine. The thread is mine. The colour — the colour the colour the colour — is not mine. He found my old label and he dyed it.",
          luminous:
            "The label was embroidered by me. Long enough ago that the thread has gone slightly brittle. The dye on top of the embroidery — the unnameable hue — is younger. It was applied later, over my work, the way the indigo overlayers were applied over my underlayers. Inside the cabinet — visible through the glass — is a single rolled scroll, undyed, its label still warm-gold and legible. He could not get inside the cabinet to dye that one.",
        },
        voId: "elara.archives.unnameable-hue-cabinet.look",
        setsFlag: "shadow_tongue_hue_named",
        logsClue: {
          id: "clue-archives-cabinet-original-survives",
          title: "An undyed original survives inside the unnameable-hue cabinet",
          body:
            "The hand-stitched label on the unnameable-hue cabinet is older than its dye. The cabinet's interior holds a single undyed scroll, still legible in warm-gold. The editor could not penetrate the cabinet's glass — there is at least one full original document on the ship that has never been edited. The scroll is locked behind the embroidered label.",
          source: "archives",
          order: 8,
        },
        humanReaction: {
          narration: {
            shadow:
              "An untouched scroll. We don't know what it is. We don't open it before we know what's behind every other door we've already opened. The cabinet stays sealed until the rest of the case has earned the right to read it.",
            balanced:
              "There is, somewhere on this ship, exactly one document the editor never reached. It is in this cabinet. The discipline now is to NOT open the cabinet until we have triangulated, from everything else, what we expect the document to say. The scroll is the only surviving control variable. We protect it.",
            warm:
              "The cabinet is the only mercy in the whole investigation. Don't crack it open in a moment of frustration. Save it for the moment when knowing the original would be the difference between two endings. We will know that moment when we are inside it.",
          },
          voId: "detective.archives.unnameable-hue-cabinet.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You touch the cabinet's glass. It is cool, ordinary, locked. The hand-stitched label resists the touch the way old fabric resists — softly, with no give. The cabinet does not open. The cabinet was not meant to open today.",
          fragmented:
            "Don't. Don't. Don't open. Don't open. Don't open. Locked. Locked. Locked.",
          luminous:
            "The cabinet stays locked. The Detective's discipline is right: the surviving original is the case's only control variable, and we do not break the seal until we have triangulated, from everything else, what the original ought to say. The cabinet is, in this case's economy, the savings account. We do not draw on it lightly.",
        },
        voId: "elara.archives.unnameable-hue-cabinet.use",
      },
      talk: {
        narration:
          "If you address the cabinet, you address the one untouched original on this ship. The scroll inside does not answer; nothing in this room has, today, answered in voice. But the warm-gold of the visible label brightens by a quarter-tone, and the unnameable hue around it dims to match. The original is glad to be addressed without being read. We honour that.",
        voId: "elara.archives.unnameable-hue-cabinet.talk",
      },
    },
  },
};
