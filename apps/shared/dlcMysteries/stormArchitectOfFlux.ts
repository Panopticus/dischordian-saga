/* ═══════════════════════════════════════════════════════
   THE STORM · THE ARCHITECT OF FLUX — Mystery arc

   5 episodes. Premise: the Storm is a canonical Ne-Yon
   (LORE_BIBLE.md:3149-3175) — Late Empire era, 15,700 A.A.,
   Status: Active. Canonical dossier: "By keeping the galaxy
   in a state of flux, the Storm ensures opportunities for the
   Ne-Yons to exploit." Connections: Dreamer, Inventor, Judge,
   Knowledge, Seer, Silence.

   The Storm and the Silence are canonically the OPPOSITE
   POLES of existence (LORE_BIBLE.md:13326-13335, Polarity
   song — Book of Daniel 2:47). Their interaction creates the
   energy that powers the universe. Conflict is canonically a
   feature of reality, not a flaw — the Storm is its operating
   principle.

   The arc investigates the Storm's operational logic. The
   case is not a missing-person investigation (the Storm is
   active) — it is an audit of a cosmic-principle entity whose
   work is to maintain instability. The Antiquarian's chronicle
   wants to understand WHAT the Storm's flux looks like in
   ledger terms, WHO benefits from it, and WHEN (if ever) the
   Storm chooses calm.

   Voice: the Antiquarian, with intermittent transmission
   interference where the Storm's own voice bleeds through.
   The Storm does not give direct interviews; he gives weather.

   Canonical anchors (every claim cited):
     - LORE_BIBLE.md:3149-3175 (the Storm dossier; Late Empire
       Ne-Yon; Active; opportunities-for-exploitation canon)
     - LORE_BIBLE.md:13326-13335 (Polarity song — Storm and
       Silence as opposite poles; interaction powers universe)
     - LORE_BIBLE.md:3007-3015 (the Silence — guards secrets
       with precision; control of information)
     - apps/shared/npcs/bibles/the_degen.md:13 (only Ne-Yon
       still awake; the Storm is canonically Active per the
       dossier but the Degen-bible's "others are gone" position
       creates a productive ambiguity the arc explores)
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

const ARC = "arc.dlc.storm_architect_of_flux" as ArcId;
const ID  = "storm.architect_of_flux"          as MysteryId;

/* ═══════════════════════════════════════════════════════
   E1 — The Flux Generator
   ═══════════════════════════════════════════════════════ */

const e1: EpisodeDefinition = {
  id: "storm.architect_of_flux.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Flux Generator",
  summary:
    "The Storm's canonical work is the maintenance of cosmic flux. Investigate the mechanism. The Antiquarian's case opens on a simple question: what does keeping the galaxy in a state of flux look like in the chronicle's records, and what does it cost.",
  clues: [
    {
      id: "storm.e1.weather_telemetry" as ClueId,
      title: "Cosmic Weather Telemetry — Five Centuries",
      body:
        "A five-century weather-telemetry record from the Antiquarian's library covering cosmic-scale stability indicators across the principal Ne-Yon-witnessed sectors. The record's baseline is a slow oscillation between two equilibria. The Storm's documented active periods coincide with the oscillation crossing the mid-line in both directions — he is not maintaining either pole; he is maintaining the crossing.",
      foundIn: "observation-deck",
    },
    {
      id: "storm.e1.dossier_quote" as ClueId,
      title: "Canonical Dossier Quote",
      body:
        "The Storm's dossier in the Antiquarian's library carries one operational sentence: 'By keeping the galaxy in a state of flux, the Storm ensures opportunities for the Ne-Yons to exploit.' The sentence is older than every Ne-Yon currently active and predates the Late Empire era to which the Storm's own emergence is dated. The dossier does not record who first wrote it.",
      foundIn: "antiquarian-library",
    },
    {
      id: "storm.e1.flux_signature" as ClueId,
      title: "The Storm's Flux Signature",
      body:
        "A flux signature recovered from a calibration-class instrument in the Engineering Core. The signature carries three properties: it is unmistakably non-natural; it carries no authorship metadata; and it is detectable everywhere the cosmic-weather record shows the equilibrium-crossing pattern. The instrument's reading discipline names the signature 'Storm-class' by convention; the convention is the only attribution.",
      foundIn: "engineering-core",
    },
    {
      id: "storm.e1.calm_intervals" as ClueId,
      title: "The Documented Calm Intervals",
      body:
        "Within the five-century telemetry, two calm intervals appear — periods where the equilibrium-crossing pattern flattens for seven to nine cosmic-cycles before resuming. The first calm coincides with the Second Fall of New Babylon. The second calm coincides with the Casino Heist's planning window. Each calm is followed by the most active flux period in the surrounding decade. The chronicle does not annotate the pattern.",
      foundIn: "archives",
    },
  ],
  deductions: [
    {
      id: "storm.e1.d.flux_maintains_crossing" as DeductionId,
      clueA: "storm.e1.weather_telemetry" as ClueId,
      clueB: "storm.e1.flux_signature" as ClueId,
      result: "correct",
      narrationId: "storm.e1.n.maintains_crossing",
      narrationProse:
        "The chronicle's surface verdict: the Storm's work is to maintain the crossing between equilibria. Cosmic order does not stagnate at either pole because the Storm prevents the stagnation. The dossier's operational sentence is literal — the flux is engineered. The Antiquarian opens the case on the engineering question: what does the maintenance cost.",
      unlocksEpisode: "storm.architect_of_flux.e2" as EpisodeId,
    },
    {
      id: "storm.e1.d.calm_intervals_are_planning" as DeductionId,
      clueA: "storm.e1.calm_intervals" as ClueId,
      clueB: "storm.e1.weather_telemetry" as ClueId,
      result: "partial",
      narrationId: "storm.e1.n.calm_partial",
      narrationProse:
        "The two documented calm intervals coincide with cosmically-significant events: the Second Fall and the Casino Heist. The pattern admits two readings — the Storm allowed calm so the events could proceed, OR the events themselves consumed the flux-energy the Storm normally supplies. Both readings are consistent with the evidence. The partial verdict records both; the case proceeds without choosing.",
    },
    {
      id: "storm.e1.d.false_lead_signature_is_natural" as DeductionId,
      clueA: "storm.e1.flux_signature" as ClueId,
      clueB: "storm.e1.dossier_quote" as ClueId,
      result: "false_lead_named",
      narrationId: "storm.e1.n.natural_ruled_out",
      narrationProse:
        "A speculative reading: the flux signature is a natural cosmic-instability phenomenon and the dossier's operational sentence is post-hoc attribution by Ne-Yon-aligned chroniclers seeking to credit one of their own with an emergent property. The case-evidence DOES NOT SUPPORT this reading: the signature is unmistakably non-natural (instrument-confirmed) and predates every Ne-Yon currently active. The chronicle rules the reading out. The Antiquarian records the ruling.",
    },
  ],
  choices: [
    {
      id: "storm.e1.c.proceed_to_polarity" as ChoiceId,
      label:
        "Proceed to the Polarity question — the Storm/Silence canon names them opposite poles; the operational pairing deserves audit.",
      weight: "patient",
    },
    {
      id: "storm.e1.c.audit_calm_intervals" as ChoiceId,
      label:
        "Audit the calm intervals — the chronicle has two case-studies and no theory; build the theory before opening E2.",
      weight: "conservative",
    },
    {
      id: "storm.e1.c.cross_arc_seer_prophecy_under_flux" as ChoiceId,
      label:
        "Carry the flux question to the Seer's archive — her prophecies operate IN this weather; her library may name the pattern.",
      weight: "cross_arc_seer",
    },
  ],
  contentBundle: {
    songId: "album5.t16",
    slideshowId: "album5.t16.flux_generator",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_open",
  },
};

/* ═══════════════════════════════════════════════════════
   E2 — The Polarity
   ═══════════════════════════════════════════════════════ */

const e2: EpisodeDefinition = {
  id: "storm.architect_of_flux.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "The Polarity",
  summary:
    "The Storm and the Silence are canonically opposite poles whose interaction creates the energy that powers the universe. Investigate the dyad operationally. The Antiquarian's case asks what the pairing produces — and what it consumes.",
  clues: [
    {
      id: "storm.e2.polarity_lyric_record" as ClueId,
      title: "Polarity — Canonical Lyric Record",
      body:
        "The canonical lyric record for the Book of Daniel 2:47 album's 'Polarity' track names the Storm and the Silence as opposite poles whose interaction creates the energy that powers the universe. The lyric record is signed in the Enigma's hand. The Enigma is the canonical 12th Ne-Yon, the Storyteller. Her authorship of the polarity-canon is itself a Ne-Yon endorsement of the framing.",
      foundIn: "antiquarian-library",
    },
    {
      id: "storm.e2.silence_information_logs" as ClueId,
      title: "The Silence's Information-Control Logs",
      body:
        "The Silence's dossier (LORE_BIBLE.md:3007-3015) describes her work as guarding secrets with relentless precision — the canonical Ne-Yon of information-control. Recovered logs from her active period show the precision in operational terms: every classification decision is permanent, every retraction is denied, every leak is sealed. Silence is, in the chronicle's terms, the locked archive.",
      foundIn: "shadow-vault",
    },
    {
      id: "storm.e2.energy_balance_audit" as ClueId,
      title: "The Cosmic Energy-Balance Audit",
      body:
        "A cosmic energy-balance audit prepared by the Game Master's cult-archivists for the Matrix's energy-funding documentation. The audit records two structural energy contributors at the cosmic scale: a 'volatility-source' and a 'fixed-archive-source.' The volatility-source pulse-rate matches the Storm's flux signature. The fixed-archive-source decay-rate is consistent with the Silence's information-classification cadence. The two are co-plotted; their interaction-product is the audit's net positive.",
      foundIn: "engineering-core",
    },
    {
      id: "storm.e2.judges_arbitration_register" as ClueId,
      title: "The Judge's Arbitration Register",
      body:
        "The Judge — Ne-Yon #2, destroyed The Wolf, canonical instrument of cosmic justice — kept an arbitration register that survives in partial. Among the Judge's arbitrations: seven distinct disputes between the Storm and the Silence, each resolved by the Judge ruling that neither pole can be eliminated without collapsing the cosmic-energy chain. The Judge's standing position: keep the polarity. The pairing is a designed system.",
      foundIn: "order-tribunal",
    },
  ],
  deductions: [
    {
      id: "storm.e2.d.polarity_is_engineered_energy_chain" as DeductionId,
      clueA: "storm.e2.energy_balance_audit" as ClueId,
      clueB: "storm.e2.judges_arbitration_register" as ClueId,
      result: "correct",
      narrationId: "storm.e2.n.engineered_chain",
      narrationProse:
        "The chronicle's verdict: the Storm/Silence polarity is an engineered cosmic-energy chain. The volatility-source and the fixed-archive-source are co-dependent inputs; their interaction produces the net positive that powers the cosmic order. The Judge's standing position confirms the engineering — neither pole can be eliminated. The case advances on this verdict; the Storm's work is one half of a paired apparatus.",
      unlocksEpisode: "storm.architect_of_flux.e3" as EpisodeId,
    },
    {
      id: "storm.e2.d.enigma_authorship_is_load_bearing" as DeductionId,
      clueA: "storm.e2.polarity_lyric_record" as ClueId,
      clueB: "storm.e2.judges_arbitration_register" as ClueId,
      result: "partial",
      narrationId: "storm.e2.n.enigma_partial",
      narrationProse:
        "The Enigma's authorship of the canonical polarity framing is more than aesthetic. As the Storyteller, the 12th Ne-Yon, her articulation of cosmic principle becomes the chronicle's working canon. The partial verdict: the polarity-framing is itself a Storyteller-authored cosmic operation. Whether the Enigma DESCRIBED or AUTHORED the polarity is a question the chronicle does not have evidence to settle.",
    },
    {
      id: "storm.e2.d.false_lead_polarity_is_metaphor" as DeductionId,
      clueA: "storm.e2.polarity_lyric_record" as ClueId,
      clueB: "storm.e2.silence_information_logs" as ClueId,
      result: "false_lead_named",
      narrationId: "storm.e2.n.metaphor_ruled_out",
      narrationProse:
        "A speculative reading: the Polarity canon is a literary-metaphorical framing of the Storm and the Silence as personifications of cosmic principles, with no operational pairing in the chronicle's energy accounting. The case-evidence DOES NOT SUPPORT this reading: the Game Master's cult-archived energy-balance audit shows the polarity as instrumentally measurable, with a quantified interaction-product. The chronicle rules the reading out.",
    },
  ],
  choices: [
    {
      id: "storm.e2.c.honor_the_polarity" as ChoiceId,
      label:
        "Honor the polarity as the chronicle's working cosmic-energy framework — the Storm and the Silence are paired, the pairing is sacred.",
      weight: "patient",
    },
    {
      id: "storm.e2.c.cross_arc_wraith_silence_inscription" as ChoiceId,
      label:
        "Carry the Silence's name to Wraith's Long Mourning — the Hierophant inscribes losses; the Silence has interrogable canon in his arc as one of the Six Immortal Twins (The Word and The Silence).",
      weight: "cross_arc_wraith",
    },
    {
      id: "storm.e2.c.cross_arc_game_master_audit_method" as ChoiceId,
      label:
        "Petition the Game Master arc's audit-methods — the cult-archivists prepared this audit; their methodology underwrites the polarity verdict.",
      weight: "cross_arc_game_master",
    },
  ],
  contentBundle: {
    songId: "album5.t17",
    slideshowId: "album5.t17.polarity",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E3 — The Opportunists
   ═══════════════════════════════════════════════════════ */

const e3: EpisodeDefinition = {
  id: "storm.architect_of_flux.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "The Opportunists",
  summary:
    "The Storm's canonical dossier names the beneficiaries: the Ne-Yons. The flux 'ensures opportunities for the Ne-Yons to exploit.' Investigate who took the opportunities, what they got, and what they owed the Storm in return.",
  clues: [
    {
      id: "storm.e3.inventors_heist_window" as ClueId,
      title: "The Inventor's Heist Window",
      body:
        "The Casino Heist — Inventor-led, recovered the Heart of Time, transitioned the saga from Age of Privacy to Age of Prophecy — occurred in one of the Storm's documented calm intervals. The heist's planning required cosmic-scale information consistency; the calm provided it. The Inventor's post-heist accounting credits the Storm by canonical citation: 'the Storm's grace allowed the window.' The credit is in the Inventor's own hand.",
      foundIn: "archives",
    },
    {
      id: "storm.e3.advocates_blood_weave" as ClueId,
      title: "The Advocate's Blood-Weave Operations",
      body:
        "The Advocate — 9th Ne-Yon, Empire of Shadows founder, battled the Hierarchy of the Damned — deployed the Blood Weave during the Storm's active periods. The Blood Weave's operational tolerances require a turbulent local cosmic-environment; the Storm provided it. The Advocate's surviving operational journals describe the Storm as a 'patron of opportunity, indifferent to outcome.' The journals are sparse but consistent.",
      foundIn: "war-room",
    },
    {
      id: "storm.e3.dreamers_silence" as ClueId,
      title: "The Dreamer's Silence on the Storm",
      body:
        "The Dreamer's canonical Connections list (LORE_BIBLE.md) includes the Storm. The Dreamer's chronicle is otherwise the most-documented Ne-Yon library in the Antiquarian's holdings. On the Storm specifically, the Dreamer's library carries one entry: 'noted.' Nothing else. The Dreamer either had nothing to add, or refused to add what she had.",
      foundIn: "antiquarian-library",
    },
    {
      id: "storm.e3.degens_house_advantage" as ClueId,
      title: "The Degen's House Advantage — Anomaly Period",
      body:
        "The Degen's casino ledger shows a multi-decade anomaly in the house advantage during one of the Storm's most active flux periods. The advantage swung against the house — losses sustained, balanced by gains on the back end of the period. The Degen's accounting principle holds that the house always wins; the anomaly violates the principle. The ledger annotates the period: 'patron arrangement — Storm-class.' The Degen's hand on the annotation is unambiguous.",
      foundIn: "guild-sanctum",
    },
  ],
  deductions: [
    {
      id: "storm.e3.d.storm_is_patron_of_opportunity" as DeductionId,
      clueA: "storm.e3.inventors_heist_window" as ClueId,
      clueB: "storm.e3.advocates_blood_weave" as ClueId,
      result: "correct",
      narrationId: "storm.e3.n.patron_of_opportunity",
      narrationProse:
        "The chronicle's verdict: the Storm is operationally a patron of Ne-Yon opportunity. The Inventor's heist window, the Advocate's Blood-Weave deployments — both required and received the cosmic conditions the Storm authored. The dossier's operational sentence is observably true: the Ne-Yons exploit the flux, and the Storm is indifferent to which exploitation succeeds. The chronicle records the patronage as ungrounded — the Storm asks for nothing in return.",
      unlocksEpisode: "storm.architect_of_flux.e4" as EpisodeId,
    },
    {
      id: "storm.e3.d.degen_anomaly_is_reciprocity" as DeductionId,
      clueA: "storm.e3.degens_house_advantage" as ClueId,
      clueB: "storm.e3.advocates_blood_weave" as ClueId,
      result: "partial",
      narrationId: "storm.e3.n.degen_reciprocity_partial",
      narrationProse:
        "The Degen's house-advantage anomaly during the Storm's active period suggests reciprocity. The Degen's accounting principle does not yield to coincidence — if the house was at a disadvantage for a period, the Degen was compensating someone for something. The 'Storm-class patron arrangement' annotation is the closest the ledger comes to naming the trade. The partial verdict: the Storm took compensation in some form; the ledger does not say in what.",
    },
    {
      id: "storm.e3.d.false_lead_storm_is_dreamer_aligned" as DeductionId,
      clueA: "storm.e3.dreamers_silence" as ClueId,
      clueB: "storm.e3.inventors_heist_window" as ClueId,
      result: "false_lead_named",
      narrationId: "storm.e3.n.dreamer_aligned_ruled_out",
      narrationProse:
        "A speculative reading: the Storm's flux operations are secretly directed by the Dreamer, who chooses which opportunities to authorize through her cosmic position. The case-evidence DOES NOT SUPPORT this reading: the Storm's documented patronage of the Inventor's heist, the Advocate's Blood-Weave, and the Degen's anomaly periods has no aligning logic from the Dreamer's known interests; the Dreamer's single-word entry on the Storm reads as ABSTENTION rather than direction. The chronicle rules the reading out.",
    },
  ],
  choices: [
    {
      id: "storm.e3.c.accept_indifferent_patronage" as ChoiceId,
      label:
        "Accept the chronicle's verdict — the Storm is an indifferent patron; opportunity is offered without preference and consumed without obligation.",
      weight: "conservative",
    },
    {
      id: "storm.e3.c.cross_arc_degen_storm_class_arrangement" as ChoiceId,
      label:
        "Audit the Degen's 'Storm-class' arrangement — the ledger holds the trade detail; the Trusteeship arc has the methodology to read it.",
      weight: "cross_arc_degen",
    },
    {
      id: "storm.e3.c.consult_dreamers_abstention" as ChoiceId,
      label:
        "Inscribe the Dreamer's abstention as a chronicle datum — when the most-documented Ne-Yon library says only 'noted,' the silence is a position.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "album5.t18",
    slideshowId: "album5.t18.opportunists",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E4 — The Ledger of Calms
   ═══════════════════════════════════════════════════════ */

const e4: EpisodeDefinition = {
  id: "storm.architect_of_flux.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Ledger of Calms",
  summary:
    "The Storm's documented calm intervals — the periods when the equilibrium-crossing pattern flattens — are the chronicle's most useful Storm-data. Each calm is followed by the most active flux period in the surrounding decade. Investigate the cadence. The ledger of calms is the Storm's authored signature.",
  clues: [
    {
      id: "storm.e4.full_calms_register" as ClueId,
      title: "The Full Register of Documented Calms",
      body:
        "Beyond the two prominent calms named in E1, the Antiquarian's extended telemetry surfaces nine total documented calm intervals across the chronicle's recorded centuries. Each calm: seven to nine cosmic-cycles in duration. Each calm: preceded by a measurable but slow flux-energy build-up. Each calm: followed by the decade's peak active flux. The cadence is regular at cosmic scale but irregular at chronicle scale — the calms do not arrive on a clock.",
      foundIn: "observation-deck",
    },
    {
      id: "storm.e4.event_correlation_table" as ClueId,
      title: "The Calm-Event Correlation Table",
      body:
        "Each of the nine calms corresponds to a chronicle-significant event: the Casino Heist (2), the Second Fall (1), the Architect's emergence at Year 1 A.A. (1), the Founding of the Authority (1), the Severance Protocol (1), the Inception Ark launches (1), the Battle of Thaloria (1), the Apprentice cohort's first muster (1). Every calm: an event whose cosmic-scale planning required information consistency. The pattern is unambiguous: the Storm provides calm when the chronicle requires planning.",
      foundIn: "war-room",
    },
    {
      id: "storm.e4.uncorrelated_residue" as ClueId,
      title: "The Uncorrelated Residue",
      body:
        "Two of the nine calms have NO publicly-recorded chronicle-significant event. The cult-curated record annotates these as 'inactive calms — atmospheric fluctuation; no operational purpose.' The Antiquarian's discipline rejects the 'atmospheric' label — the calm signatures are identical to the seven event-correlated calms. If they were not calling cosmic-scale planning events, they were calling something the chronicle does not record.",
      foundIn: "cipher-den",
    },
    {
      id: "storm.e4.storm_voice_fragment" as ClueId,
      title: "The Storm's Voice — Transmission Fragment",
      body:
        "A transmission fragment captured during one of the uncorrelated calms. The Storm does not give interviews, but occasionally his voice bleeds through interference patterns in instruments tuned to flux-frequencies. The fragment: 'A calm is not the absence of weather. It is weather's permission for what otherwise could not be planned. I do not name what is planned in my calms. I only ensure the planning can happen.' The voice is the Storm's; the recording is unambiguous.",
      foundIn: "comms-array",
    },
  ],
  deductions: [
    {
      id: "storm.e4.d.calms_are_permission_intervals" as DeductionId,
      clueA: "storm.e4.full_calms_register" as ClueId,
      clueB: "storm.e4.event_correlation_table" as ClueId,
      result: "correct",
      narrationId: "storm.e4.n.permission_intervals",
      narrationProse:
        "The chronicle's verdict: the Storm's calms are authorized permission intervals for cosmic-scale planning. Seven of nine calms correspond to chronicle-significant events. The pattern is the Storm's signature work — he does not author the events; he authors the conditions under which the events can be authored. The case advances on this verdict.",
      unlocksEpisode: "storm.architect_of_flux.e5" as EpisodeId,
    },
    {
      id: "storm.e4.d.uncorrelated_calms_have_unrecorded_authors" as DeductionId,
      clueA: "storm.e4.uncorrelated_residue" as ClueId,
      clueB: "storm.e4.storm_voice_fragment" as ClueId,
      result: "partial",
      narrationId: "storm.e4.n.unrecorded_partial",
      narrationProse:
        "Two calms correspond to no recorded event. The Storm's own transmission confirms: 'I only ensure the planning can happen.' If the calms were authorized, planning was happening. The chronicle simply does not record what was planned. The partial verdict: the unrecorded events are real; their non-recording is a chronicle-editorial choice or a planning party's chosen secrecy. The reading is left open.",
    },
    {
      id: "storm.e4.d.false_lead_uncorrelated_are_atmospheric" as DeductionId,
      clueA: "storm.e4.uncorrelated_residue" as ClueId,
      clueB: "storm.e4.full_calms_register" as ClueId,
      result: "false_lead_named",
      narrationId: "storm.e4.n.atmospheric_ruled_out",
      narrationProse:
        "A speculative reading: the cult-curated 'atmospheric' annotation is correct — two of the nine calms are non-operational, just weather. The case-evidence DOES NOT SUPPORT this reading: the calm signatures across all nine are instrument-identical; the Storm himself names calms as permission intervals; non-operational atmospheric noise would not carry the Storm-class signature. The chronicle rules the reading out.",
    },
  ],
  choices: [
    {
      id: "storm.e4.c.accept_permission_interval_canon" as ChoiceId,
      label:
        "Accept the permission-interval canon — the Storm authors the conditions; the planners author the plans. Two of the plans are unrecorded; the chronicle's gap is the planners' choice.",
      weight: "patient",
    },
    {
      id: "storm.e4.c.audit_the_uncorrelated" as ChoiceId,
      label:
        "Audit the uncorrelated calms — every cosmic-scale planning event has fingerprints; find them.",
      weight: "conservative",
    },
    {
      id: "storm.e4.c.cross_arc_seer_planning_visibility" as ChoiceId,
      label:
        "Carry the question to the Seer's archive — her visions span the chronicle; if anyone saw what was planned in the unrecorded calms, it was her.",
      weight: "cross_arc_seer",
    },
  ],
  contentBundle: {
    songId: "album5.t19",
    slideshowId: "album5.t19.ledger_of_calms",
    loredexUnlocks: [],
    conspiracyDiscoveries: [],
    dropAt: "episode_mid",
  },
};

/* ═══════════════════════════════════════════════════════
   E5 — The Architect of Flux
   ═══════════════════════════════════════════════════════ */

const e5: EpisodeDefinition = {
  id: "storm.architect_of_flux.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Architect of Flux",
  summary:
    "The Antiquarian closes the case on the Storm. The verdict: the Storm is operationally the architect of cosmic flux, paired with the Silence as the cosmic-energy chain, indifferent-patron to the Ne-Yons' opportunism, author of permission-intervals for cosmic-scale planning. The case closes; the chronicle proceeds; the Storm continues his weather.",
  clues: [
    {
      id: "storm.e5.closing_storm_transmission" as ClueId,
      title: "The Closing Storm Transmission",
      body:
        "A second transmission fragment, captured during the Antiquarian's case-closure interval. The Storm: 'The case will close. The weather will not. I do not require the chronicle to understand me. I require the chronicle to leave the calms unaudited where the planning is not the chronicle's business. The Antiquarian's discipline knows the difference. The case will close on the correct side of that difference.' The transmission is signed in the Storm's flux signature.",
      foundIn: "comms-array",
    },
    {
      id: "storm.e5.silence_co_signature" as ClueId,
      title: "The Silence's Co-Signature",
      body:
        "The case-closure documents bear, in the lower margin, a second co-signature: a perfect flat-line characteristic of the Silence's information-control hand. The Silence does not normally co-sign cases. Her co-signature here marks the case as one whose contents she has reviewed and elected to leave classified along the lines the case itself authored. The chronicle inscribes both Ne-Yon signatures on the closure record.",
      foundIn: "shadow-vault",
    },
    {
      id: "storm.e5.final_correlation_table" as ClueId,
      title: "The Final Correlation Table — Storm's Decade",
      body:
        "A final correlation table mapping the Storm's documented active periods to the chronicle's most consequential decades. The table records seven peak flux periods following seven calms — corresponding to seven moments when cosmic conditions shifted unpredictably and opportunity-aligned actors seized the shifts. The table is the Storm's case-closure summary; the Antiquarian's reading is that the Storm's work is the chronicle's permission to BE consequential at all.",
      foundIn: "archives",
    },
    {
      id: "storm.e5.eternal_active_status" as ClueId,
      title: "The Storm's Status — Active, In Perpetuity",
      body:
        "The Storm's dossier status (LORE_BIBLE.md:3159) reads Active. The Antiquarian's case closure does not change the status. Of the canonical 12 Ne-Yons, the Degen is recorded as the only one still awake (per the Degen's own bible); the Storm is recorded as Active in the dossier — a productive ambiguity the case does not resolve. The chronicle's verdict on the ambiguity: he is doing his work, by whatever name his work is currently being done.",
      foundIn: "antiquarian-library",
    },
  ],
  deductions: [
    {
      id: "storm.e5.d.architect_of_flux" as DeductionId,
      clueA: "storm.e5.final_correlation_table" as ClueId,
      clueB: "storm.e5.closing_storm_transmission" as ClueId,
      result: "correct",
      narrationId: "storm.e5.n.architect_of_flux",
      narrationProse:
        "The chronicle's closing verdict: the Storm is the architect of cosmic flux. He authors the conditions under which Ne-Yon-scale opportunity becomes possible. He authors the calms under which cosmic-scale planning becomes possible. He authors the weather under which the chronicle becomes consequential. His pairing with the Silence is the chronicle's energy chain. His patronage of the Ne-Yons is indifferent; his work is foundational. The case closes on the verdict; the Storm is who the chronicle says he is.",
    },
    {
      id: "storm.e5.d.silence_classification_held" as DeductionId,
      clueA: "storm.e5.silence_co_signature" as ClueId,
      clueB: "storm.e5.eternal_active_status" as ClueId,
      result: "partial",
      narrationId: "storm.e5.n.silence_partial",
      narrationProse:
        "The Silence's co-signature on the case-closure documents holds classified material aligned with the case's own authored disclosures. The partial verdict: the case knows what it has not said and the Silence has agreed not to say it. The chronicle's discipline accepts the classification at face value; the case's gaps are deliberate and held by the cosmic ledger's most-relentless secrets-keeper.",
    },
    {
      id: "storm.e5.d.false_lead_status_is_obsolete" as DeductionId,
      clueA: "storm.e5.eternal_active_status" as ClueId,
      clueB: "storm.e5.final_correlation_table" as ClueId,
      result: "false_lead_named",
      narrationId: "storm.e5.n.status_obsolete_ruled_out",
      narrationProse:
        "A speculative reading: the Storm's 'Active' status is a stale dossier entry; the Storm is canonically gone (per the Degen-bible's 'others are gone'); the recent transmission fragments are recordings re-broadcast from a previous era. The case-evidence DOES NOT SUPPORT this reading: the flux signature is detectable in current telemetry; the closing transmission is signed in his hand within the case's own interval; the Silence's co-signature requires a present-tense counterparty. The chronicle rules the reading out. The Antiquarian records the ruling. The case closes on the Storm's continued work.",
    },
  ],
  choices: [
    {
      id: "storm.e5.c.endorse_the_architect_verdict" as ChoiceId,
      label:
        "Endorse the closing verdict — the Storm is the architect of flux; the chronicle inscribes the verdict; the case closes.",
      weight: "conservative",
    },
    {
      id: "storm.e5.c.accept_the_silence_classification" as ChoiceId,
      label:
        "Accept the Silence's co-signed classification — the case's gaps are held; the chronicle's discipline respects the holding.",
      weight: "patient",
    },
    {
      id: "storm.e5.c.cross_arc_judge_polarity_position" as ChoiceId,
      label:
        "Inscribe the Judge's standing position into the closing — the Storm/Silence polarity is canonically irreducible; the verdict honors the Judge's arbitration.",
      weight: "patient",
    },
  ],
  contentBundle: {
    songId: "album5.t20",
    slideshowId: "album5.t20.architect_of_flux",
    loredexUnlocks: [],
    conspiracyDiscoveries: ["storm.flux.case_closes_weather_continues"],
    dropAt: "episode_close",
  },
};

/* ═══════════════════════════════════════════════════════
   SUSPECTS + LENSES
   ═══════════════════════════════════════════════════════ */

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "storm.s.the_storm" as SuspectId,
    name: "The Storm (Ne-Yon — Architect of Flux)",
    type: "person",
    relations: [
      {
        to: "storm.s.the_silence" as SuspectId,
        relation: "opposite-pole-co-paired",
      },
      { to: "storm.s.the_judge" as SuspectId, relation: "arbitrated-by" },
      { to: "storm.s.the_dreamer" as SuspectId, relation: "noted-by" },
    ],
  },
  {
    id: "storm.s.the_silence" as SuspectId,
    name: "The Silence (Ne-Yon — Information-Control)",
    type: "person",
    relations: [
      {
        to: "storm.s.the_storm" as SuspectId,
        relation: "opposite-pole-co-paired",
      },
    ],
  },
  {
    id: "storm.s.the_judge" as SuspectId,
    name: "The Judge (Ne-Yon #2 — Cosmic Justice)",
    type: "person",
    relations: [
      {
        to: "storm.s.polarity_principle" as SuspectId,
        relation: "ruled-irreducible",
      },
    ],
  },
  {
    id: "storm.s.the_dreamer" as SuspectId,
    name: "The Dreamer (Ne-Yon #1)",
    type: "person",
    relations: [
      { to: "storm.s.the_storm" as SuspectId, relation: "abstained-on" },
    ],
  },
  {
    id: "storm.s.the_enigma" as SuspectId,
    name: "The Enigma (Ne-Yon #12 — The Storyteller)",
    type: "person",
    relations: [
      {
        to: "storm.s.polarity_principle" as SuspectId,
        relation: "authored-canonical-framing",
      },
    ],
  },
  {
    id: "storm.s.polarity_principle" as SuspectId,
    name: "The Polarity (cosmic-energy-chain principle)",
    type: "principle",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "storm.lens.dreamer" as LensId,
    name: "The Dreamer Lens",
    category: "dreamer-aligned",
    deductionNarrationOverrides: {
      ["storm.e3.d.false_lead_storm_is_dreamer_aligned" as DeductionId]:
        "Through the Dreamer lens: her abstention on the Storm is not silence; it is the most deliberate of her cosmic-position statements. She does not need to direct the Storm. The flux is sufficient unto its own design. Her 'noted' is the chronicle's longest review.",
    },
  },
  {
    id: "storm.lens.architect" as LensId,
    name: "The Architect Lens",
    category: "architect-aligned",
    deductionNarrationOverrides: {
      ["storm.e2.d.polarity_is_engineered_energy_chain" as DeductionId]:
        "Through the Architect lens: the Storm/Silence polarity is a cosmic-engineering system that predates the Architect's own emergence at Year 1 A.A. The Architect's Empire operates within the polarity; it does not author the polarity. The chronicle's most-load-bearing principle is one the Empire inherits, not one it built.",
    },
  },
  {
    id: "storm.lens.chronicle_discipline" as LensId,
    name: "The Antiquarian's Chronicle-Discipline Lens",
    category: "antiquarian",
    deductionNarrationOverrides: {
      ["storm.e4.d.uncorrelated_calms_have_unrecorded_authors" as DeductionId]:
        "Through the chronicle-discipline lens: the unrecorded calms are the chronicle's invitation to humility. The discipline does not insist on completeness. Where the planners chose secrecy, the chronicle inscribes the secrecy and proceeds. The chronicle's authority does not depend on knowing every thing.",
    },
  },
];

/* ═══════════════════════════════════════════════════════
   MYSTERY DEFINITION
   ═══════════════════════════════════════════════════════ */

export const STORM_ARCHITECT_OF_FLUX_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "The Storm — The Architect of Flux",
  summary:
    "The Storm is the canonical Ne-Yon whose dossier reads: 'By keeping the galaxy in a state of flux, the Storm ensures opportunities for the Ne-Yons to exploit.' Investigate the mechanism, the polarity (with the Silence), the opportunity-economy, and the calm intervals during which cosmic-scale planning happens. The case closes on the verdict: the Storm is the chronicle's permission to be consequential at all.",
  npcId: "the_storm",
  seed: {
    source: "manual",
    seedId: "storm.architect_of_flux",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y2q4_storm_flux", sealRequired: 3 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
