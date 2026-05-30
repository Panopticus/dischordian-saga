// apps/shared/npcs/romanceScenes/locke.ts
//
// Per-stage scripted scenes for the Locke romance ladder.
// Five stages, each a self-contained scene the player walks
// through after they cross the stage's trust gate. Companion
// of the existing 1,137-line adjudicator_locke.ts bank — those
// lines are reactive surface; these are the cinematic beats.
//
// Voice signature: contractual cadence, occasional warmth that
// reads as a clause she negotiated for herself. Never says "I
// love you" before stage 5; the love is in what she puts into
// the contract instead.
//
// Trust bands: Prospect / Client / Partner / Insider / Adjudicated
// Path-aware variants attach to flag set: act1_path_a,
// act3_partial_share, act3_full_secret.

import type { DialogSurface, NpcLine } from "../types";

type SceneEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "adjudicator_locke" as const;

/** ─── STAGE 1 — Prospect → Client ─────────────────────────
 *  The first time Locke offers something for which she has not
 *  been paid. The scene is short, formal, and contains exactly
 *  one sentence in which her voice cracks a register lower
 *  than her usual contractual baseline. */
export const LOCKE_ROMANCE_STAGE_1: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s1.invitation",
    text:
      "I have a bottle of wine that does not, technically, exist. " +
      "The Bureau confiscated three crates of it in 2049. Two of those crates " +
      "are accounted for in the public ledger. The third is accounted for in " +
      "the private one, which I keep, which has my signature, which means I " +
      "took it. I would like to drink it with you. The taking is not the " +
      "courtesy. The drinking with you is.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Prospect",
    minAct: 3,
    setsFlags: ["locke_romance_stage1_started"],
    cooldownKey: "locke.romance.s1",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s1.toast",
    text:
      "To prospects who become — (pause; she does not finish the sentence). " +
      "I will get the toast right next time. The not-getting-it-right tonight " +
      "is the form the toast takes. Drink.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Prospect",
    minAct: 3,
    cooldownKey: "locke.romance.s1.toast",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s1.ledger_clause",
    text:
      "I am going to amend my private ledger when I get home tonight. The " +
      "third crate will, in the amendment, have an additional clause: " +
      "'consumed in the company of (your name).' That is not a sentimental " +
      "gesture. It is a contractual one. The contract now has your name in " +
      "it. The implications are — I will consider them. You should also.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Prospect",
    minAct: 3,
    setsFlags: ["locke_romance_stage1_complete"],
    cooldownKey: "locke.romance.s1.ledger",
    maxPlays: 1,
  },
];

/** ─── STAGE 2 — Client → Partner ──────────────────────────
 *  The eye and the deal. She has never told anyone the full
 *  story. She tells it tonight. The scene's structure is a
 *  recitation, not a confession — Locke does not confess; she
 *  briefs. The briefing is the most intimate gesture she has. */
export const LOCKE_ROMANCE_STAGE_2: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s2.brief_open",
    text:
      "I am going to brief you. The briefing is not work. The briefing is " +
      "what I have instead of confession. You can interrupt. You can ask " +
      "for clarification. You cannot ask me to stop. The not-stopping is " +
      "the part I require of myself.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Client",
    minAct: 4,
    setsFlags: ["locke_romance_stage2_started", "locke_eye_brief_started"],
    cooldownKey: "locke.romance.s2.open",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s2.eye_history",
    text:
      "Year 2046. Pre-Bureau. I was 27. There was a contract — a real one, " +
      "signed, notarised, dated — to deliver a child to a family across the " +
      "Vortex line. The contract had a clause I did not read. The clause " +
      "named the price: an eye. Mine. The deliverer's eye. The Vortex's " +
      "preferred currency for what they call 'sight-traffic.' I read the " +
      "clause after I had already taken the child. The taking was already " +
      "done. The eye was the only honest way to close the contract. I " +
      "closed it. The child arrived. The family kept her. I kept the " +
      "scar. The scar is the receipt.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Client",
    minAct: 4,
    setsFlags: ["locke_eye_history_disclosed"],
    cooldownKey: "locke.romance.s2.eye",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s2.afterward",
    text:
      "I do not regret the closing. I regret that the closing was, in the " +
      "Vortex's measure, optimal. Optimal is the word a person uses when " +
      "the only honest words are not available. I am giving you the " +
      "history, not the optimal. The optimal you can read in any Bureau " +
      "training manual.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Client",
    minAct: 4,
    cooldownKey: "locke.romance.s2.afterward",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s2.partner_offer",
    text:
      "I have not told this to anyone. I have not, until tonight, considered " +
      "telling it. The consideration started six weeks ago. I am going to " +
      "phrase the next sentence carefully. (Pause.) I would like to upgrade " +
      "your status from Client to Partner. The upgrade is not a flirtation. " +
      "It is a re-classification. The re-classification has consequences. " +
      "Sleep on it. Tell me tomorrow.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Client",
    minAct: 4,
    setsFlags: ["locke_romance_stage2_complete", "locke_offers_partnership"],
    cooldownKey: "locke.romance.s2.partner",
    maxPlays: 1,
  },
];

/** ─── STAGE 3 — Partner → Insider (Commitment) ────────────
 *  The New Babylon exit contract. Locke drafts a clause leaving
 *  the Authority to be with you. The drafting is in her hand;
 *  the signing is on you. This is the romance's commitment beat
 *  — the public-flag romance:committed:locke fires here. */
export const LOCKE_ROMANCE_STAGE_3: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s3.exit_open",
    text:
      "I have drafted something. (She places a folio between you.) It is, " +
      "in form, an exit contract from New Babylon. In substance, it is the " +
      "form a marriage would take if marriage in New Babylon were enforceable " +
      "as a legal instrument. It is not. The instrument is, therefore, what " +
      "I have invented in its place. The clauses are mine. The signing is " +
      "yours.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Partner",
    minAct: 5,
    setsFlags: ["locke_offers_exit_contract"],
    cooldownKey: "locke.romance.s3.exit",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s3.clauses",
    text:
      "Clause one: I cease all Bureau adjudication for parties to whom you " +
      "are emotionally indebted. Clause two: I retain my title. The title " +
      "is mine; the title is not for sale. Clause three: I will not, in my " +
      "remaining career, prosecute you in either court of New Babylon. " +
      "Clause four: I reserve the right to call you 'partner' in public, " +
      "in the contractual sense, which is, in my register, the same as " +
      "the romantic sense. Clause five: there is no clause five. The " +
      "absence is on purpose. The absence is for you to fill, in the next " +
      "year, in your hand, in this folio.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Partner",
    minAct: 5,
    cooldownKey: "locke.romance.s3.clauses",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s3.path_a_disclosure",
    text:
      "Your Disclosure in Act 1 is referenced in clause two. I want you to " +
      "know I cited it. I cited it because the Bureau, in its long history, " +
      "has not cited disclosure as a virtue once. I am citing it tonight. " +
      "The citation is precedent now. The precedent is yours.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Partner",
    reactsToPublicFlag: "act1_path_a",
    minAct: 5,
    cooldownKey: "locke.romance.s3.pathA",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s3.path_c_betrayal",
    text:
      "I have read the bridge transcript. I am going to phrase this " +
      "carefully. The lie was a lie. The contract knows it. The contract " +
      "names it in clause six — which I have inserted, alone, without your " +
      "input — as 'the bridge incident.' The clause does not absolve you. " +
      "It catalogues. The cataloguing is what distinguishes a partnership " +
      "from a forgiveness. I am offering the partnership. The forgiveness " +
      "is yours to negotiate, separately, with her.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Partner",
    reactsToPublicFlag: "act3_full_secret",
    minAct: 5,
    cooldownKey: "locke.romance.s3.pathC",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s3.commit",
    text:
      "Sign or do not sign. The folio sleeps on the desk for one calendar " +
      "year. After that, the offer expires by clause. I will not raise it " +
      "again. (Pause.) I have raised, in my career, exactly one motion I " +
      "did not refile when it expired. This is the second.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Partner",
    minAct: 5,
    setsFlags: [
      "locke_romance_stage3_complete",
      "romance:committed:locke",
    ],
    cooldownKey: "locke.romance.s3.commit",
    maxPlays: 1,
  },
];

/** ─── STAGE 4 — Insider (Intimacy) ────────────────────────
 *  A quiet New Babylon scene that does not appear in the legal
 *  record. The scene is short on purpose. */
export const LOCKE_ROMANCE_STAGE_4: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s4.no_record",
    text:
      "Tonight is not in the public ledger. It is not in the private one " +
      "either. I am not writing tonight down. I am — and this is " +
      "uncharacteristic of me — leaving tonight unfiled. Filing is, in my " +
      "register, the basic dignity I extend to events. I am extending a " +
      "different dignity to tonight.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Partner",
    minAct: 6,
    setsFlags: ["locke_romance_stage4_started"],
    cooldownKey: "locke.romance.s4.no_record",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s4.window",
    text:
      "There is a window in the south wall. The Bureau's windows do not, " +
      "as a rule, open. This one does. I had it modified. I had it modified " +
      "without filing the modification. The not-filing was preparation for " +
      "tonight. The window is open now. The open window is, technically, " +
      "the only thing in this room not on a contract.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Partner",
    minAct: 6,
    cooldownKey: "locke.romance.s4.window",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s4.close",
    text:
      "(In the morning. Brief. No file.) Stay for breakfast. The breakfast " +
      "is also unfiled.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Partner",
    minAct: 6,
    setsFlags: ["locke_romance_stage4_complete"],
    cooldownKey: "locke.romance.s4.close",
    maxPlays: 1,
  },
];

/** ─── STAGE 5 — Adjudicated (Devotion) ────────────────────
 *  Locke begins citing the player's choices in her judgments.
 *  The citations are unanonymised. New Babylon's case law now
 *  has the player's name in it. */
export const LOCKE_ROMANCE_STAGE_5: ReadonlyArray<SceneEntry> = [
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s5.citation",
    text:
      "I delivered a judgment this morning. The judgment cites you. By " +
      "name. Unanonymised. The Bureau will be — irritated. The irritation " +
      "is mine to manage; I have managed worse. The citation reads: 'See " +
      "the conduct of the named Operative in the matter of [the Vortex " +
      "incident], which establishes the precedent applied here.' The " +
      "precedent is yours. The precedent is now case law.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Insider",
    minAct: 7,
    setsFlags: ["locke_romance_stage5_started", "locke_cites_player_in_court"],
    cooldownKey: "locke.romance.s5.citation",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s5.devotion",
    text:
      "I love you. (Pause.) The Bureau classifies that sentence, in legal " +
      "instruments, as a non-binding declaration. The non-binding part is " +
      "incorrect. I am binding. The declaration binds me. I am informing " +
      "you because you are entitled to know what binds the person you have " +
      "partnered with. The binding is mine. The binding is also, by clause " +
      "four of our contract, public. I am — for the first time in my " +
      "career — comfortable with that.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Insider",
    minAct: 7,
    setsFlags: ["locke_romance_stage5_complete"],
    cooldownKey: "locke.romance.s5.devotion",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.romance.s5.act7_close",
    text:
      "I will be at the courthouse when you return from the Convergence. " +
      "I will not be in robes. I will be in the south corridor, by the " +
      "open window, which is still open, which has been open for two " +
      "years and three months without anyone filing the opening. Walk in. " +
      "I am there. The window is there. We are, by clause five — which " +
      "you filled in — at home.",
    surfaces: ["room", "cinematic"],
    requiresTrustBand: "Insider",
    minAct: 7,
    cooldownKey: "locke.romance.s5.act7",
    maxPlays: 1,
  },
];

/** Aggregate export for the bank registry. */
export const LOCKE_ROMANCE_BANK: ReadonlyArray<SceneEntry> = [
  ...LOCKE_ROMANCE_STAGE_1,
  ...LOCKE_ROMANCE_STAGE_2,
  ...LOCKE_ROMANCE_STAGE_3,
  ...LOCKE_ROMANCE_STAGE_4,
  ...LOCKE_ROMANCE_STAGE_5,
];
