/* Year One Community Votes (spec §12) — uses existing communityVotes schema */

export interface YearOneVoteDefinition {
  voteId: string;
  title: string;
  description: string;
  category: "lore";
  options: { optionNumber: number; text: string; description: string }[];
  dependsOn?: string;
}

export const YEAR_ONE_VOTES: YearOneVoteDefinition[] = [
  {
    voteId: "y1_who_are_potentials",
    title: "WHO ARE THE POTENTIALS?",
    description: "The community decides how to define themselves.",
    category: "lore",
    options: [
      { optionNumber: 1, text: "The new dominant species — DeMagi, Quarchon, Ne-Yon", description: "Potentials are the galaxy's next chapter. Other survivors are valued but the future belongs to the Collector's work." },
      { optionNumber: 2, text: "A new civilization including all post-Fall survivors", description: "Potentials, humans, clones — everyone who survived the Fall builds together." },
      { optionNumber: 3, text: "A transitional species — existing to open the door to the Dreamer", description: "The purpose is the Dreamer. The identity is secondary to the mission." },
      { optionNumber: 4, text: "Whatever we choose to be — no definition required", description: "The act of defining limits. Refuse the frame. Be what emerges." },
    ],
  },
  {
    voteId: "y1_who_gets_a_seat",
    title: "WHO GETS A SEAT?",
    description: "If the civilization includes more than Potentials — who qualifies?",
    category: "lore",
    dependsOn: "y1_who_are_potentials",
    options: [
      { optionNumber: 1, text: "All post-Fall survivors who declare allegiance", description: "Open door. Anyone who survived and wants in." },
      { optionNumber: 2, text: "Those who can navigate the DeMagi/Quarchon tension without breaking it", description: "A competency test: can you hold both sides without choosing?" },
      { optionNumber: 3, text: "Those whose governance philosophy aligns with ours", description: "Ideological alignment. Shared principles, not shared biology." },
      { optionNumber: 4, text: "Anyone the Voltari would vouch for", description: "Let the witnesses decide. They've been watching longer than anyone." },
    ],
  },
  {
    voteId: "y1_civilization_name",
    title: "WHAT IS THE NAME?",
    description: "The civilization needs a name. The Antiquarian will write the winner into the Chronicle.",
    category: "lore",
    dependsOn: "y1_who_are_potentials",
    options: [
      { optionNumber: 1, text: "[Community-submitted name 1]", description: "Top community submission." },
      { optionNumber: 2, text: "[Community-submitted name 2]", description: "Second community submission." },
      { optionNumber: 3, text: "[Community-submitted name 3]", description: "Third community submission." },
    ],
  },
];
