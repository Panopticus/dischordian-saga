/* ═══════════════════════════════════════════════════════
   DR. LYRA VOX INVESTIGATIVE QUESTLINE

   Item 11 of the choice-impact follow-up. Dr. Lyra Vox was
   named in the audit as a never-started questline (her Ark
   1047 history is referenced in lore but the playable arc was
   absent). This module ships the five-step investigation:

     1. THE FILE — the player finds Lyra Vox's redacted
        personnel file. Three clue tokens surface, each
        pointing toward a different theory.
     2. THE LAB — the player visits her sealed laboratory.
        One of three doors corresponds to the correct theory.
        Picking wrong locks out the convict-ending branch.
     3. THE TESTIMONY — the player interviews three witnesses
        from her cohort. Each has a distinct story; the
        player picks which to believe (or to disbelieve all).
     4. THE CONFRONTATION — the player faces Lyra Vox's
        substrate echo. The player presents one of three
        verdicts: vindicated, complicit, or both.
     5. THE INSCRIPTION — the Antiquarian writes the
        canonical record based on the player's verdict.

   Each step writes a flag under the namespace `lyra_vox:*`.
   The verdict at step 4 is sticky and shapes the Antiquarian's
   step-5 inscription.
   ═══════════════════════════════════════════════════════ */

export type LyraVoxStepId =
  | "file"
  | "lab"
  | "testimony"
  | "confrontation"
  | "inscription";

export type LyraVoxTheory = "weapon" | "rescue" | "betrayal";
export type LyraVoxWitnessId = "petrov" | "sarai" | "nilus";
export type LyraVoxVerdict = "vindicated" | "complicit" | "both";

export interface LyraVoxStep {
  id: LyraVoxStepId;
  title: string;
  /** Narrative description shown when the step opens. */
  description: string;
  /** What the player can do at this step. */
  prompts: ReadonlyArray<{
    id: string;
    label: string;
    body: string;
    /** Flag set when the player picks this option. */
    setsFlag: string;
  }>;
  /** Earliest act this step is available. */
  earliestAct: number;
  /** Flag prerequisite for this step (typically the prior step's
   *  completion flag). */
  requiresFlag?: string;
}

export const LYRA_VOX_STEPS: readonly LyraVoxStep[] = [
  {
    id: "file",
    title: "The File",
    description:
      "Dr. Lyra Vox's personnel file was redacted in 2049 by an unidentified hand. The Antiquarian's index notes that the redactions cover one of three possibilities. You read the file. Three tokens surface — fragments the redactor missed. Each points toward a different theory.",
    prompts: [
      {
        id: "weapon",
        label: "Theory: Vox built a weapon",
        body: "A reactor schematic with annotations in her handwriting. The annotations specify yield ranges. The yields scale with population density.",
        setsFlag: "lyra_vox:theory:weapon",
      },
      {
        id: "rescue",
        label: "Theory: Vox built an evacuation",
        body: "A passenger manifest in her handwriting. The manifest's seat count exceeds any known cargo bay capacity. There are children's names on it.",
        setsFlag: "lyra_vox:theory:rescue",
      },
      {
        id: "betrayal",
        label: "Theory: Vox sold the Ark out",
        body: "A signed contract on Hierarchy letterhead. The signature is hers. The clause she initialed is illegible — but the date matches the night the Vortex first scanned Ark 1047.",
        setsFlag: "lyra_vox:theory:betrayal",
      },
    ],
    earliestAct: 4,
  },
  {
    id: "lab",
    title: "The Lab",
    description:
      "Lyra Vox's sealed laboratory has three doors. Above each is a sigil — the same three sigils that marked the file's three theories. The doors are physical; the lab is real; one of them is correct.",
    prompts: [
      {
        id: "door_weapon",
        label: "Open the weapon-sigil door",
        body: "Inside: a partial reactor casing. Cold for fifteen thousand years. Annotated panels with corrected yields — reduced, not amplified. The corrections are the actual record.",
        setsFlag: "lyra_vox:lab:weapon_door",
      },
      {
        id: "door_rescue",
        label: "Open the rescue-sigil door",
        body: "Inside: the manifest you saw, finalized, with names crossed out where each evacuee was successfully off-loaded. The cross-outs run to the bottom of the page. None of the names is hers.",
        setsFlag: "lyra_vox:lab:rescue_door",
      },
      {
        id: "door_betrayal",
        label: "Open the betrayal-sigil door",
        body: "Inside: the unsigned half of the Hierarchy contract. The clause she did NOT initial is the one that would have damaged the Ark. The signed half is a decoy. She was the source's other counter-signer.",
        setsFlag: "lyra_vox:lab:betrayal_door",
      },
    ],
    earliestAct: 5,
    requiresFlag: "lyra_vox:theory_chosen",
  },
  {
    id: "testimony",
    title: "The Testimony",
    description:
      "Three of Vox's Ark cohort survived to the present. Each has a story. They contradict each other on which door was the truth — or none of them have full information.",
    prompts: [
      {
        id: "believe_petrov",
        label: "Believe Petrov (the engineer)",
        body: "Petrov says the weapon was real and Vox built it under duress. He has the contract Vox refused to sign as proof. He is, in his bearing, exhausted but truthful.",
        setsFlag: "lyra_vox:witness:petrov",
      },
      {
        id: "believe_sarai",
        label: "Believe Sarai (the medic)",
        body: "Sarai says the evacuation was real and Vox died on the manifest's last unfilled line. She has the manifest. The bottom three rows are empty; one of them is, by Sarai's testimony, where Vox was supposed to be.",
        setsFlag: "lyra_vox:witness:sarai",
      },
      {
        id: "believe_nilus",
        label: "Believe Nilus (the archivist)",
        body: "Nilus says all three doors are accurate — Vox was the weapon's designer, the evacuation's organizer, and the Hierarchy contract's saboteur, simultaneously. The redactions covered all three because the truth was, in his phrasing, 'irreducibly multiple.'",
        setsFlag: "lyra_vox:witness:nilus",
      },
      {
        id: "disbelieve_all",
        label: "Disbelieve all three",
        body: "You leave each interview without committing to their account. Witnesses are unreliable. The lab and the file are physical artifacts; you trust them more.",
        setsFlag: "lyra_vox:witness:disbelieve_all",
      },
    ],
    earliestAct: 5,
    requiresFlag: "lyra_vox:lab_door_opened",
  },
  {
    id: "confrontation",
    title: "The Confrontation",
    description:
      "A substrate echo of Lyra Vox surfaces in the Ark's deepest archive room. She does not look at you directly. She is recorded, not present — but the recording responds to questions in real time. You may issue one verdict.",
    prompts: [
      {
        id: "vindicated",
        label: "Verdict: Vindicated",
        body: "You name her as the rescuer. The substrate echo bows once. 'Thank you. The bowing is what survives. The rest of me is, by now, dispersed.'",
        setsFlag: "lyra_vox:verdict:vindicated",
      },
      {
        id: "complicit",
        label: "Verdict: Complicit",
        body: "You name her as the betrayer. The echo straightens. 'Acknowledged. I will not contest the verdict — I designed the contract; the contract speaks for itself. I lived and died with the design.'",
        setsFlag: "lyra_vox:verdict:complicit",
      },
      {
        id: "both",
        label: "Verdict: Both — irreducibly multiple",
        body: "You name her as all three. The echo holds your gaze for the first time. 'Yes. The verdict you have just issued is the only one the cycle's records can hold without distortion. You read the witnesses correctly. You read the lab correctly. You read me correctly.'",
        setsFlag: "lyra_vox:verdict:both",
      },
    ],
    earliestAct: 6,
    requiresFlag: "lyra_vox:testimony_chosen",
  },
  {
    id: "inscription",
    title: "The Antiquarian's Inscription",
    description:
      "The Antiquarian opens his Tome. The verdict you issued is the heading; the body is his. He writes one of three inscriptions depending on which verdict you reached.",
    prompts: [
      {
        id: "close",
        label: "Witness the inscription",
        body: "(The Antiquarian writes. The body of the inscription is recorded in the Tome panel.) The questline closes. Lyra Vox's record, in this cycle, is whatever you decided it was.",
        setsFlag: "lyra_vox:questline_complete",
      },
    ],
    earliestAct: 6,
    requiresFlag: "lyra_vox:verdict_issued",
  },
];

export function getStep(id: LyraVoxStepId): LyraVoxStep | undefined {
  return LYRA_VOX_STEPS.find((s) => s.id === id);
}

export const LYRA_VOX_INSCRIPTIONS: Readonly<Record<LyraVoxVerdict, string>> = {
  vindicated:
    "Lyra Vox is recorded, in our cycle, as the rescuer. The manifest carries her hand. The names she crossed out are alive in their descendants. The reader who issued this verdict is recorded next to her name; their hand has, by inscription, joined hers.",
  complicit:
    "Lyra Vox is recorded, in our cycle, as the betrayer. The contract carries her signature. The Vortex's first scan of Ark 1047 was, by the contract's clauses, paid for in advance. The reader who issued this verdict is recorded next to her name; the next reader of this Tome will know they are reading two names that are, on this cycle's accounting, equally responsible.",
  both:
    "Lyra Vox is recorded, in our cycle, as irreducibly multiple. She built the weapon, organized the rescue, sabotaged the contract — and did all three simultaneously. The reader who issued this verdict is recorded next to her name with the same multiplicity. Two readers, both partial, both whole. The Tome accommodates the contradiction. So does the cycle.",
};
