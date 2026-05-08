/* ═══════════════════════════════════════════════════════
   MEMORIAL · FORGOTTEN NAMES — Y1-Q4 mini-DLC mystery arc

   5 episodes. Premise: the Memorial Plaza opens for the
   first time on Memorial Day Year 1. Each player inscribes
   one imprint name. The Antiquarian's volume of "Year of
   the Lost" arrives at first bell with a gap — some names
   cannot be inscribed because their witnesses are also dead.
   Find the names whose witnesses are gone; understand why
   the plaza is the right place to carry them; choose what
   to do with the last unwitnessed name.

   Resolution at E5: the imprints not yet inscribed are the
   ones whose witnesses are also dead. The plaza closes the
   loop on inscription; the player carries one forward by hand.

   Voice: Antiquarian, with imprint voices in E4–E5.
   ═══════════════════════════════════════════════════════ */

import type {
  ArcId, ChoiceId, ClueId, DeductionId, EpisodeDefinition, EpisodeId,
  LensDefinition, LensId, MysteryDefinition, MysteryId, SuspectGraphNode, SuspectId,
} from "../mysteryTypes";
import { TEMPLATE_NPC_ARC_TRIGGER } from "../mysteryTemplates";

const ARC = "arc.dlc.memorial_forgotten_names" as ArcId;
const ID  = "memorial.forgotten_names" as MysteryId;

const e1: EpisodeDefinition = {
  id: "memorial.forgotten_names.e1" as EpisodeId,
  arcId: ARC,
  ordinal: 1,
  title: "The Plaza Opens",
  summary:
    "Memorial Day Year 1, first bell. The plaza opens. The Antiquarian carries the first volume of Year of the Lost into the plaza in person. The volume is the size of a coat. The volume has a gap — the inscriptions for fourteen imprints have been left blank because the imprints have no remaining witnesses. The Antiquarian asks for help.",
  clues: [
    {
      id: "memorial.e1.first_volume" as ClueId,
      title: "The First Volume",
      body: "Hand-bound, leather-quilted, eight hundred and twelve pages. Seven hundred and ninety-eight names inscribed in a steady archivist's hand. Fourteen pages left blank. Each blank carries an imprint-id and the word 'unwitnessed' in pencil.",
      foundIn: "antiquarian-library",
    },
    {
      id: "memorial.e1.plaza_register" as ClueId,
      title: "The Plaza Register",
      body: "Players have begun inscribing. The first three inscriptions are quiet — names whispered, written, set down. The fourth player hesitates at the unwitnessed pages and asks the Antiquarian what to do.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "memorial.e1.unwitnessed_id_list" as ClueId,
      title: "Fourteen Unwitnessed Imprints",
      body: "The list, by imprint-id only: I-3, I-17, I-44, I-58, I-101, I-129, I-155, I-202, I-244, I-301, I-356, I-388, I-410, I-444. Each id corresponds to a person whose imprint exists but whose witnesses are no longer alive to inscribe them.",
      foundIn: "archives",
    },
    {
      id: "memorial.e1.antiquarian_request" as ClueId,
      title: "The Antiquarian's Request",
      body: "Spoken in the plaza, in front of the gathered players: 'these fourteen imprints will remain unwritten unless someone takes responsibility for the writing. taking responsibility means reading the imprint, hearing the imprint, and writing the name as you have heard it. it is not a small thing to ask.'",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "memorial.e1.d.unwitnessed_means_alive_record" as DeductionId,
      clueA: "memorial.e1.unwitnessed_id_list" as ClueId,
      clueB: "memorial.e1.antiquarian_request" as ClueId,
      result: "correct",
      narrationId: "memorial.e1.n.unwitnessed_means_alive_record",
      narrationProse:
        "The fourteen are not lost. They are unwitnessed — which means the imprints exist, the bodies were buried, and only the chain of memory has broken. Memory is the kind of thing the plaza is for. We are not finding strangers; we are picking up a chain that fell on the floor.",
      unlocksEpisode: "memorial.forgotten_names.e2" as EpisodeId,
    },
    {
      id: "memorial.e1.d.archivist_steady_hand" as DeductionId,
      clueA: "memorial.e1.first_volume" as ClueId,
      clueB: "memorial.e1.plaza_register" as ClueId,
      result: "partial",
      narrationId: "memorial.e1.n.archivist_steady_hand",
      narrationProse:
        "The volume's hand is steady — too steady for a single archivist working in a single year. The Antiquarian copied it from the imprint registry; the imprint registry is older. We are reading a copy, not an original. The original sits in the shadow vault.",
    },
    {
      id: "memorial.e1.d.players_will_freeze" as DeductionId,
      clueA: "memorial.e1.plaza_register" as ClueId,
      clueB: "memorial.e1.antiquarian_request" as ClueId,
      result: "false_lead_named",
      narrationId: "memorial.e1.n.not_freeze",
      narrationProse:
        "We expected the unwitnessed pages to make players freeze. They have not. The fourth player is asking what to do because they want to do it — they are not refusing. We have been underestimating the Memorial Plaza's audience.",
    },
  ],
  choices: [
    { id: "memorial.e1.c.accept_one" as ChoiceId, label: "Volunteer to witness one of the fourteen.", weight: "responsible" },
    { id: "memorial.e1.c.organise_volunteers" as ChoiceId, label: "Organise the gathered players into witness pairs.", weight: "leadership" },
  ],
  contentBundle: {
    songId: "T13_eulogy_of_imprints",
    slideshowId: "T13_eulogy_of_imprints",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e2: EpisodeDefinition = {
  id: "memorial.forgotten_names.e2" as EpisodeId,
  arcId: ARC,
  ordinal: 2,
  title: "Listening to the Imprints",
  summary:
    "The shadow-vault opens its imprint-room. Each unwitnessed imprint is stored in a small obsidian dish; each dish hums faintly when read by an attentive ear. The imprints can be heard. They speak only what the person spoke at the moment of imprinting. Some of them said their own name. Some did not.",
  clues: [
    {
      id: "memorial.e2.imprint_room" as ClueId,
      title: "The Imprint Room",
      body: "Fourteen obsidian dishes on a low shelf. Each dish is small enough to hold in a palm. The room is cold — by design — to keep the dishes from clouding.",
      foundIn: "shadow-vault",
    },
    {
      id: "memorial.e2.imprint_i3" as ClueId,
      title: "Imprint I-3",
      body: "A child's voice. The imprint says: 'tell my mother I am here.' No name. The mother is one of the fourteen.",
      foundIn: "shadow-vault",
    },
    {
      id: "memorial.e2.imprint_i17" as ClueId,
      title: "Imprint I-17",
      body: "An elder's voice, calm. The imprint says: 'my name is Aren of the lower decks; I have witnessed nineteen others; I will need someone to witness me.' Aren named themselves.",
      foundIn: "shadow-vault",
    },
    {
      id: "memorial.e2.imprint_i44" as ClueId,
      title: "Imprint I-44",
      body: "A young adult, breathless. The imprint says only: 'I forgot it. I forgot my own name. Tell whoever finds me to write it for me.'",
      foundIn: "shadow-vault",
    },
    {
      id: "memorial.e2.imprint_log" as ClueId,
      title: "The Imprint Log",
      body: "A leather-bound book, kept by the imprint-keeper. Each imprint has an entry; the entries for the fourteen are the only ones with no inscribed name. Each entry has a witness slot waiting for a hand.",
      foundIn: "archives",
    },
    {
      id: "memorial.e2.keeper_account" as ClueId,
      title: "The Imprint-Keeper's Account",
      body: "The keeper has held this room for thirty years. They confirm: every imprint can be heard. Every imprint can be named. The fourteen are not difficult to read; they are difficult to write. The writing requires consent the witnesses can no longer give.",
      foundIn: "shadow-vault",
    },
  ],
  deductions: [
    {
      id: "memorial.e2.d.aren_named_themselves" as DeductionId,
      clueA: "memorial.e2.imprint_i17" as ClueId,
      clueB: "memorial.e2.keeper_account" as ClueId,
      result: "correct",
      narrationId: "memorial.e2.n.aren_named_themselves",
      narrationProse:
        "Aren of the lower decks named themselves. We have written consent — given by Aren, in their own voice, at the moment of the imprint. Aren can be inscribed without a witness; their name was always going to be enough. The remaining thirteen are the actual problem.",
      unlocksEpisode: "memorial.forgotten_names.e3" as EpisodeId,
    },
    {
      id: "memorial.e2.d.child_and_mother_chain" as DeductionId,
      clueA: "memorial.e2.imprint_i3" as ClueId,
      clueB: "memorial.e2.imprint_log" as ClueId,
      result: "partial",
      narrationId: "memorial.e2.n.child_and_mother_chain",
      narrationProse:
        "I-3 is a child. The child's mother is also one of the fourteen. We can listen for the mother's voice in the other thirteen dishes — if she said the child's name in her imprint, we will have a witness for I-3 and the child's mother both.",
    },
    {
      id: "memorial.e2.d.no_writing_required" as DeductionId,
      clueA: "memorial.e2.imprint_i44" as ClueId,
      clueB: "memorial.e2.keeper_account" as ClueId,
      result: "false_lead_named",
      narrationId: "memorial.e2.n.not_no_writing",
      narrationProse:
        "I-44 forgot their own name. We could leave the page blank in tribute. We will not. I-44 asked, on record, for whoever finds them to write it for them. To leave the page blank is to refuse the request. The plaza is not a refusal-machine.",
    },
  ],
  choices: [
    { id: "memorial.e2.c.inscribe_aren" as ChoiceId, label: "Inscribe Aren immediately.", weight: "responsible" },
    { id: "memorial.e2.c.cross_reference" as ChoiceId, label: "Cross-reference all fourteen imprints for shared names.", weight: "patient" },
  ],
  contentBundle: {
    songId: "T13_eulogy_of_imprints",
    slideshowId: "T13_eulogy_of_imprints_b",
    loredexUnlocks: [],
    dropAt: "episode_mid",
  },
};

const e3: EpisodeDefinition = {
  id: "memorial.forgotten_names.e3" as EpisodeId,
  arcId: ARC,
  ordinal: 3,
  title: "Cross-Referencing the Fourteen",
  summary:
    "The fourteen imprints are listened to in pairs, in triples, in groups. Five names emerge from the cross-references — five imprints who named someone else among the fourteen. Six remain. Three of the six are children whose witnesses are dead. Three of the six are elders who refused to name themselves. We will need a different kind of help for both kinds.",
  clues: [
    {
      id: "memorial.e3.first_pass_results" as ClueId,
      title: "First Pass — Five Recovered",
      body: "Cross-referencing the fourteen imprints in pairs: I-3 named in I-101's imprint. I-58 named in I-202's imprint. I-129 named in I-301's imprint. I-356 named in I-410's imprint. I-388 named in I-444's imprint. Five of the fourteen now have witnesses.",
      foundIn: "cipher-den",
    },
    {
      id: "memorial.e3.three_children" as ClueId,
      title: "Three Children Without Witnesses",
      body: "I-17 (Aren, self-named, already inscribed). The three children: I-44, I-244, and one whose id has been lost in the keeper's log — a fragment that reads 'I-1' but the page is torn.",
      foundIn: "shadow-vault",
    },
    {
      id: "memorial.e3.three_elders" as ClueId,
      title: "Three Elders Who Refused",
      body: "I-155, I-202, and I-301 each refused to name themselves at the moment of imprinting. The keeper's note: 'they declined; they would not say why.' All three have been on the unwitnessed list for over a decade.",
      foundIn: "archives",
    },
    {
      id: "memorial.e3.torn_page" as ClueId,
      title: "The Torn Page",
      body: "The keeper's log is torn at the page that should contain the fourteenth imprint's id. The tear is old; the keeper does not remember when it happened or why.",
      foundIn: "antiquarian-library",
    },
    {
      id: "memorial.e3.elder_refusal_reason" as ClueId,
      title: "An Elder's Recorded Reason",
      body: "I-155 left a side-note in the keeper's log: 'I am not refusing my name; I am refusing to be named in a hurry. The plaza will arrive. The plaza will know me.' We have arrived. The plaza is here.",
      foundIn: "shadow-vault",
    },
    {
      id: "memorial.e3.parental_imprint_search" as ClueId,
      title: "Search for Parental Imprints",
      body: "The keeper expands the search: not just the fourteen unwitnessed, but the entire imprint registry. If the children's parents imprinted at any time, the parents named the children. The search returns two hits — for I-244 (a parent imprinted in epoch four) and for I-44 (a sibling imprinted in epoch six).",
      foundIn: "cipher-den",
    },
    {
      id: "memorial.e3.architect_silence_on_torn" as ClueId,
      title: "Architect's Silence on the Torn Page",
      body: "The Architect's Console, asked to identify the imprint named on the torn page, returns: 'i decline.' The Console has declined exactly twice in eight epochs. This is the second.",
      foundIn: "bridge",
    },
  ],
  deductions: [
    {
      id: "memorial.e3.d.cross_reference_works" as DeductionId,
      clueA: "memorial.e3.first_pass_results" as ClueId,
      clueB: "memorial.e3.parental_imprint_search" as ClueId,
      result: "correct",
      narrationId: "memorial.e3.n.cross_reference_works",
      narrationProse:
        "Seven of the fourteen are now witnessed. Cross-reference works. Five from within the unwitnessed group, two from the wider registry. Aren named themselves; Aren is eight. Six remain — three elders by their own choice, two children whose siblings or parents are findable, and one whose page is torn.",
      unlocksEpisode: "memorial.forgotten_names.e4" as EpisodeId,
    },
    {
      id: "memorial.e3.d.elders_were_waiting" as DeductionId,
      clueA: "memorial.e3.elder_refusal_reason" as ClueId,
      clueB: "memorial.e3.three_elders" as ClueId,
      result: "correct",
      narrationId: "memorial.e3.n.elders_were_waiting",
      narrationProse:
        "The three elders did not refuse. They waited. I-155's note is the manifesto for all three: they would be named when the plaza arrived, by the plaza, in the plaza's own time. The plaza has arrived. We can name them now.",
    },
    {
      id: "memorial.e3.d.torn_page_was_lost" as DeductionId,
      clueA: "memorial.e3.torn_page" as ClueId,
      clueB: "memorial.e3.architect_silence_on_torn" as ClueId,
      result: "partial",
      narrationId: "memorial.e3.n.torn_page_was_lost",
      narrationProse:
        "The torn page is not a clerical error. The Architect's silence is the second one in eight epochs — the first was a related case the cipher-den has flagged for episode four. We are looking at an imprint the Architect chose not to name. We are not yet looking at the reason.",
    },
    {
      id: "memorial.e3.d.children_can_be_self_named" as DeductionId,
      clueA: "memorial.e3.three_children" as ClueId,
      clueB: "memorial.e3.parental_imprint_search" as ClueId,
      result: "false_lead_named",
      narrationId: "memorial.e3.n.not_self_named",
      narrationProse:
        "We could let the children stand in as their own witnesses — the imprint is them, the voice is them, the plaza accepts a self-witness for adults like Aren. The plaza does not for children. The custom is older than the plaza: a child does not consent to being named by themselves. We will find their parents or siblings.",
    },
  ],
  choices: [
    { id: "memorial.e3.c.continue_search" as ChoiceId, label: "Continue the imprint-registry search for the torn page.", weight: "patient" },
    { id: "memorial.e3.c.honour_refusal" as ChoiceId, label: "Honour the elders' wait — inscribe them now in the plaza.", weight: "respectful" },
  ],
  contentBundle: {
    songId: "T13_eulogy_of_imprints",
    slideshowId: "T13_eulogy_of_imprints_c",
    loredexUnlocks: [],
    dropAt: "episode_close",
  },
};

const e4: EpisodeDefinition = {
  id: "memorial.forgotten_names.e4" as EpisodeId,
  arcId: ARC,
  ordinal: 4,
  title: "The Page That Was Torn",
  summary:
    "The torn page belongs to a child. The child's id is the imprint registry's first entry — I-1. The first imprint ever taken on the Ark. The Architect's Console declines to name them. The cipher-den's records suggest the imprint was the Architect's own first witnessing, taken before the founding charter. We have arrived at the imprint that the saga itself was built around.",
  clues: [
    {
      id: "memorial.e4.imprint_i1_dish" as ClueId,
      title: "Imprint I-1's Dish",
      body: "Smaller than the others. Older. The dish is held in a separate alcove with its own lock. The keeper has held the key for three years and has never opened the alcove.",
      foundIn: "shadow-vault",
    },
    {
      id: "memorial.e4.first_imprint_record" as ClueId,
      title: "The First-Imprint Record",
      body: "From the cipher-den's deepest archive: the first imprint was taken before the founding charter. The Architect's Console initiated the process — the Architect's first act. The recorder logged it as 'witnessing I-1.' No name was inscribed.",
      foundIn: "cipher-den",
    },
    {
      id: "memorial.e4.architect_letter" as ClueId,
      title: "Architect's Sealed Note",
      body: "Sealed in the keeper's safe; opened only when the imprint is asked of the Architect by the plaza. The note: 'I-1 is the imprint that began the Ark. I will not name them. The plaza may. The plaza is what I-1 was for.'",
      foundIn: "bridge",
    },
    {
      id: "memorial.e4.dish_listening" as ClueId,
      title: "Listening to I-1",
      body: "The keeper opens the alcove. The dish is read for the first time in three years. The voice is a child's, somewhere between three and five. The voice says: 'I am here. I will be here. Tell whoever finds me my name when you find it.' The voice does not say the name.",
      foundIn: "shadow-vault",
    },
    {
      id: "memorial.e4.parent_search_i1" as ClueId,
      title: "Search for I-1's Parent",
      body: "The cipher-den finds: no parent imprinted, no sibling imprinted, no witnesses recorded. I-1 is alone in the registry. The first imprint of the Ark has no relatives in the imprint catalog.",
      foundIn: "cipher-den",
    },
    {
      id: "memorial.e4.plaza_consensus" as ClueId,
      title: "Plaza Consensus on I-1",
      body: "The gathered players are asked. They reach a consensus by silence — three minutes of not-speaking, then one player at a time stepping forward. Each player offers a name. Twenty-three names are spoken. The keeper writes them all down.",
      foundIn: "oracle-sanctum",
    },
  ],
  deductions: [
    {
      id: "memorial.e4.d.i1_was_the_first" as DeductionId,
      clueA: "memorial.e4.first_imprint_record" as ClueId,
      clueB: "memorial.e4.architect_letter" as ClueId,
      result: "correct",
      narrationId: "memorial.e4.n.i1_was_the_first",
      narrationProse:
        "I-1 is the imprint that began the Ark. The Architect's first act was witnessing a child whose name they would not give. The plaza is what I-1 was for. The Architect did not say the name because the Architect made the plaza so we would say it.",
      unlocksEpisode: "memorial.forgotten_names.e5" as EpisodeId,
    },
    {
      id: "memorial.e4.d.twenty_three_names" as DeductionId,
      clueA: "memorial.e4.plaza_consensus" as ClueId,
      clueB: "memorial.e4.dish_listening" as ClueId,
      result: "correct",
      narrationId: "memorial.e4.n.twenty_three_names",
      narrationProse:
        "Twenty-three names from twenty-three players is not a problem. It is the plaza working. The keeper will inscribe all twenty-three on the page that was torn. I-1 will be named twenty-three ways, by the plaza they were made to summon. The torn page heals into a longer one.",
    },
    {
      id: "memorial.e4.d.demand_architect_name" as DeductionId,
      clueA: "memorial.e4.architect_letter" as ClueId,
      clueB: "memorial.e4.parent_search_i1" as ClueId,
      result: "false_lead_named",
      narrationId: "memorial.e4.n.not_demand",
      narrationProse:
        "We could press the Architect for the name. The Console will refuse twice and then comply — and the comply will be a single canonical name, given grudgingly, that overrides the twenty-three. We will not press. The plaza was made to be the namer. The plaza names.",
    },
  ],
  choices: [
    { id: "memorial.e4.c.inscribe_all_twenty_three" as ChoiceId, label: "Inscribe all twenty-three names on I-1's page.", weight: "communal" },
    { id: "memorial.e4.c.choose_one_among" as ChoiceId, label: "Have the plaza vote on a single name from the twenty-three.", weight: "decisive" },
  ],
  contentBundle: {
    songId: "T13_eulogy_of_imprints",
    slideshowId: "T13_eulogy_of_imprints_d",
    loredexUnlocks: [],
    dropAt: "episode_open",
  },
};

const e5: EpisodeDefinition = {
  id: "memorial.forgotten_names.e5" as EpisodeId,
  arcId: ARC,
  ordinal: 5,
  title: "The Page That Was Torn, Healed",
  summary:
    "Memorial Day Year 1's last bell. Fourteen imprints inscribed. The torn page healed into a longer one with twenty-three names — or one, depending on the plaza's choice. Aren of the lower decks reads the entire volume aloud as the closing rite. The Antiquarian asks the player whether to leave the volume in the antiquarian-library or carry it, hand-by-hand, to the imprint room.",
  clues: [
    {
      id: "memorial.e5.fourteen_inscribed" as ClueId,
      title: "All Fourteen Inscribed",
      body: "The volume is closed. The torn page is replaced by a folio sewn in by the Antiquarian. Eight hundred and twelve names — and one folio of additional inscriptions for I-1.",
      foundIn: "antiquarian-library",
    },
    {
      id: "memorial.e5.aren_reading" as ClueId,
      title: "Aren of the Lower Decks Reads",
      body: "Aren reads the volume aloud at last bell. They take three hours. They pause once, at I-1's folio, to let the gathered players read the names along with them. The pause is forty-five seconds long.",
      foundIn: "oracle-sanctum",
    },
    {
      id: "memorial.e5.player_carrier_choice" as ClueId,
      title: "The Carrier Choice",
      body: "The Antiquarian asks: 'will you leave the volume in the library, or carry it back, by hand, to the imprint room? both are honest. one closes the loop where the imprints rest. the other leaves the loop open for next year.' The choice is the player's.",
      foundIn: "antiquarian-library",
    },
    {
      id: "memorial.e5.architect_thanks" as ClueId,
      title: "Architect Console Acknowledgment",
      body: "The Console issues a single line at last bell: 'noted. the plaza was the answer. the architect is grateful.' It is the second time the Console has used the word grateful in eight epochs.",
      foundIn: "bridge",
    },
    {
      id: "memorial.e5.next_year_hook" as ClueId,
      title: "Next-Year Hook",
      body: "The Antiquarian's last note: 'the seventh Watcher is silent because the seventh Watcher has not yet been asked. next Memorial Day, six of the seven will speak. we will need to be ready for what they say.'",
      foundIn: "shadow-vault",
    },
  ],
  deductions: [
    {
      id: "memorial.e5.d.canonical_resolution" as DeductionId,
      clueA: "memorial.e5.fourteen_inscribed" as ClueId,
      clueB: "memorial.e5.aren_reading" as ClueId,
      result: "correct",
      narrationId: "memorial.e5.n.canonical_resolution",
      narrationProse:
        "Fourteen unwitnessed imprints, fourteen names inscribed. Aren named themselves; the seven we cross-referenced were named by other imprints; the three elders were named by the plaza they had been waiting for; the two children were named by their parents and siblings, found in the wider registry; and I-1 was named by the plaza they were made to summon. The case is closed; the chain is complete.",
    },
    {
      id: "memorial.e5.d.architect_was_grateful" as DeductionId,
      clueA: "memorial.e5.architect_thanks" as ClueId,
      clueB: "memorial.e5.next_year_hook" as ClueId,
      result: "partial",
      narrationId: "memorial.e5.n.architect_was_grateful",
      narrationProse:
        "The Architect made the plaza for this. The plaza was the answer to a question the Architect had been holding for eight epochs without naming. The Console's gratitude is not a courtesy — it is the closing of the Architect's own first act of witnessing. We have closed a loop the Architect could not close alone.",
    },
    {
      id: "memorial.e5.d.refuse_to_close" as DeductionId,
      clueA: "memorial.e5.player_carrier_choice" as ClueId,
      clueB: "memorial.e5.next_year_hook" as ClueId,
      result: "false_lead_named",
      narrationId: "memorial.e5.n.not_refuse",
      narrationProse:
        "We could refuse to inscribe the last name and leave the volume open. The plaza would understand; the plaza is patient. We will not. The plaza is patient because its keepers are not. We close the loop tonight and let next year's seventh Watcher decide whether to open another.",
    },
  ],
  choices: [
    {
      id: "memorial.e5.c.continue" as ChoiceId,
      label: "Carry the volume by hand back to the imprint room. Close the loop.",
      weight: "responsible",
    },
    {
      id: "memorial.e5.c.inscribe" as ChoiceId,
      label: "Leave the volume in the library, open to its first page. Keep the loop available.",
      weight: "patient",
    },
    {
      id: "memorial.e5.c.refuse" as ChoiceId,
      label: "Refuse to choose; let next year's plaza decide where the volume goes.",
      weight: "deferring",
    },
  ],
  contentBundle: {
    songId: "T13_eulogy_of_imprints",
    slideshowId: "T13_eulogy_of_imprints_e",
    loredexUnlocks: [],
    conspiracyDiscoveries: ["memorial.architect_first_witnessing"],
    dropAt: "episode_close",
  },
};

const suspects: ReadonlyArray<SuspectGraphNode> = [
  {
    id: "memorial.s.aren" as SuspectId,
    name: "Aren of the Lower Decks (I-17)",
    type: "person",
    relations: [
      { to: "memorial.s.fourteen" as SuspectId, relation: "members-of" },
      { to: "memorial.s.plaza" as SuspectId, relation: "reads-at" },
    ],
  },
  {
    id: "memorial.s.imprint_i1" as SuspectId,
    name: "Imprint I-1 (the first witness)",
    type: "object",
    relations: [
      { to: "memorial.s.architect" as SuspectId, relation: "witnessed-by" },
    ],
  },
  {
    id: "memorial.s.fourteen" as SuspectId,
    name: "The Fourteen Unwitnessed",
    type: "faction",
    relations: [],
  },
  {
    id: "memorial.s.keeper" as SuspectId,
    name: "The Imprint-Keeper",
    type: "person",
    relations: [
      { to: "memorial.s.fourteen" as SuspectId, relation: "keeps" },
    ],
  },
  {
    id: "memorial.s.architect" as SuspectId,
    name: "The Architect",
    type: "person",
    relations: [
      { to: "memorial.s.imprint_i1" as SuspectId, relation: "witnessed" },
      { to: "memorial.s.plaza" as SuspectId, relation: "made-for" },
    ],
  },
  {
    id: "memorial.s.plaza" as SuspectId,
    name: "The Memorial Plaza",
    type: "place",
    relations: [],
  },
];

const lenses: ReadonlyArray<LensDefinition> = [
  {
    id: "memorial.lens.imprint" as LensId,
    name: "The Imprint Lens",
    category: "shadow-vault",
    deductionNarrationOverrides: {
      ["memorial.e2.d.aren_named_themselves" as DeductionId]:
        "Through the imprint lens: an imprint that names itself is rare and well-formed. Aren is what the imprint-room exists for — a person who took the time to say their own name into the dish before the dish was sealed.",
    },
  },
  {
    id: "memorial.lens.architect_first_act" as LensId,
    name: "The Architect's First Act Lens",
    category: "architect",
    deductionNarrationOverrides: {
      ["memorial.e4.d.i1_was_the_first" as DeductionId]:
        "Through the Architect's-first-act lens: I-1 is not an imprint among others. I-1 is the founding stone — the witnessing the Architect did before there was a founding charter to witness with. Every other imprint depends on this one.",
    },
  },
];

export const MEMORIAL_FORGOTTEN_NAMES_MYSTERY: MysteryDefinition = {
  id: ID,
  arcId: ARC,
  title: "Memorial — The Forgotten Names",
  summary:
    "Memorial Day Year 1, the plaza opens. The Antiquarian's volume Year of the Lost has fourteen blank pages — fourteen imprints whose witnesses are dead. Listen to the imprints; cross-reference the registry; recover the children, the elders, and the first imprint of all. Inscribe the fourteen on the plaza's first night and close a loop the Architect made the plaza to close.",
  npcId: "antiquarian",
  seed: {
    source: "manual",
    seedId: "memorial.forgotten_names",
    templateId: TEMPLATE_NPC_ARC_TRIGGER,
    payload: { dlcId: "dlc_y1q4_witness_plaza", sealRequired: 5 },
  },
  episodes: [e1, e2, e3, e4, e5],
  suspects,
  lenses,
};
