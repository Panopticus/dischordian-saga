/* Epoch Archetypes — 6 permanent roles earned through voting */
export interface EpochArchetypeDef { id: string; name: string; earnedThrough: string; loreFragment: string; description: string; }
export const EPOCH_ARCHETYPES: EpochArchetypeDef[] = [
  { id: "the_inventor", name: "The Inventor", earnedThrough: "Age of Privacy (creating/building focus)", loreFragment: "Driven by the Dreamer's visions. Builder of tools. Agent of change.", description: "You built things. You asked how. You kept building." },
  { id: "the_watcher", name: "The Watcher", earnedThrough: "Age of Privacy (observation/intelligence focus)", loreFragment: "The all-seeing eye sees itself being seen. Watch that too.", description: "You observed. You gathered. You understood before anyone else." },
  { id: "the_advocate", name: "The Advocate", earnedThrough: "Age of Prophecy (speaking/testimony focus)", loreFragment: "She wielded the Blood Weave to reshape reality. At great personal cost.", description: "You spoke for those who couldn't. You carried the message." },
  { id: "the_seer", name: "The Seer", earnedThrough: "Age of Prophecy (vision/pattern focus)", loreFragment: "She perceived beyond mortal sight. The sixth sense that revealed the code beneath reality.", description: "You saw the patterns before anyone named them." },
  { id: "the_programmer", name: "The Programmer", earnedThrough: "Age of Insurgency (building/resisting focus)", loreFragment: "You built things. You asked why. You kept going.", description: "You built the backdoor. You broadcast the truth. You changed your name." },
  { id: "the_politician", name: "The Politician", earnedThrough: "Age of Revelation (governance/strategy focus)", loreFragment: "She engineered compliance so skillfully that people thanked her for it.", description: "You navigated the system. You understood power. You chose how to use it." },
  { id: "the_witness", name: "The Witness", earnedThrough: "All five epochs completed", loreFragment: "Two points of light in the silence. Still ascending.", description: "You saw everything. You documented everything. You carry it all." },
];
