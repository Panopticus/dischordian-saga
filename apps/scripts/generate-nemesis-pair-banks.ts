#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   GENERATE NEMESIS PAIR-BANKS — Phase K5.2 + K6.2

   Code-generator for the 132 nemesis-side + 132
   apprentice-on-nemesis dialog pair-banks. Each file
   combines:

     - the NEMESIS archetype's voice register (K4): how
       the rival opens / responds across grudge bands.
     - the PLAYER archetype's choice register: what
       player options surface, how they're framed, what
       narrative flags they set.
     - K7 Politician-tic awareness: high-grudge variants
       drop the tic phrase as a written aside or stage
       direction (the chronicle's diegetic decode hook).

   The generated files are checked-in TypeScript — writers
   can refine them later. The generator establishes the
   authoring waterfall's floor: every (player, nemesis)
   pair gets at least the first_sighting (or
   morning_briefing) scene authored at all 3 grudge bands.

   Usage:
     pnpm tsx apps/scripts/generate-nemesis-pair-banks.ts

   Output:
     apps/shared/npcs/banks/nemesis/{p}_vs_{n}.ts (132 files)
     apps/shared/npcs/banks/apprenticeOnNemesis/{p}_on_{n}.ts (132 files)
     _index.ts barrels regenerated for both directories.
   ═══════════════════════════════════════════════════════ */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type Archetype =
  | "zealot" | "ghost" | "scholar" | "revenant" | "artisan" | "oracle"
  | "wanderer" | "martyr" | "heretic" | "jester" | "sentinel" | "prodigal";

const ARCHETYPES: Archetype[] = [
  "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
  "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
];

/* ═══════════════════════════════════════════════════════
   NEMESIS VOICE LINES — per archetype, per grudge band

   Three lines per band:
     - opening: the line the Nemesis says first
     - to_mercy: response to a player mercy choice
     - to_aggression: response to a player aggression choice
   ═══════════════════════════════════════════════════════ */

interface NemesisLines {
  opening: string;
  to_mercy: string;
  to_aggression: string;
}
type GrudgeBand = "low" | "mid" | "high";

const NEMESIS_LINES: Record<Archetype, Record<GrudgeBand, NemesisLines>> = {
  zealot: {
    low: {
      opening: "I have served longer, harder, and with cleaner hands than you. Mark this meeting; you will revisit it.",
      to_mercy: "Mercy from a half-trained acolyte. The Politician would have noted the gesture and filed it.",
      to_aggression: "Threat received. The doctrine survives threats. So do I.",
    },
    mid: {
      opening: "We have history now. Most of it written in your delays. The cause is patient; I am less so.",
      to_mercy: "You ask me to step back. The cause does not step back. But I can pause. Today.",
      to_aggression: "Strike, then. The cause has martyrs to spare. I will not be the first.",
    },
    high: {
      opening: "This ends one of two ways and I have prepared for both. Welcome to the conclusion.",
      to_mercy: "Mercy at this point is theatre. I will accept the role only if you commit to playing the audience.",
      to_aggression: "Yes. Yes. The cause needs this image of you.",
    },
  },
  ghost: {
    low: {
      opening: "You see me now. You shouldn't. I will note when you stop.",
      to_mercy: "Mercy. Filed. Returned in kind, perhaps.",
      to_aggression: "I do not respond to threats. I respond to angles. Yours has improved.",
    },
    mid: {
      opening: "We are getting too familiar. I will be less visible after this.",
      to_mercy: "Acknowledged. Tomorrow I will be quieter than tonight.",
      to_aggression: "You want me dead in the open. I will die in private. Sorry.",
    },
    high: {
      opening: "You can see all of me now. I have nothing left to hide. This was never my preferred pose.",
      to_mercy: "You let me go. I will go. You will see me again only when you cannot prevent it.",
      to_aggression: "Yes. Make it loud. The Politician would have hated that, which is reason enough.",
    },
  },
  scholar: {
    low: {
      opening: "I have your file. The earlier draft, before you began revising yourself. Hello.",
      to_mercy: "Cross-referenced. Your mercy aligns with the trend in your files. Predicted within tolerance.",
      to_aggression: "You are reading me the page I already wrote. Continue; I'll annotate.",
    },
    mid: {
      opening: "I have a chapter on you now. The footnotes are getting longer. Hello.",
      to_mercy: "Mercy at this depth contradicts your earlier chapters. Either you are evolving or the file is wrong. I prefer evolving.",
      to_aggression: "Threats. Page eleven. I anticipated this exact wording within four percent. Carry on.",
    },
    high: {
      opening: "I have finished your file. The conclusion is still ours to write. Together, perhaps.",
      to_mercy: "The mercy ending would require seven prior chapters of foreshadowing. You have three. We can revise.",
      to_aggression: "The aggression ending writes itself. I'm grateful. Less revision for me.",
    },
  },
  revenant: {
    low: {
      opening: "You owe me a debt you don't remember incurring. The principal compounds. Hello.",
      to_mercy: "Mercy. Noted as an interest payment. The principal remains.",
      to_aggression: "Add it to the ledger. I'll come back richer for it.",
    },
    mid: {
      opening: "The debt has tripled. You are making me wealthy in ways that do not show on either of our faces.",
      to_mercy: "Partial payment accepted. I will be back. Same time. Larger figure.",
      to_aggression: "Yes. The interest rate prefers violence. You're a generous debtor in this sense.",
    },
    high: {
      opening: "Final notice. The debt is mine to forgive or collect. The chronicle is taking notes either way.",
      to_mercy: "You have settled. The debt closes. Do not open a new account with me. I will remember the rate.",
      to_aggression: "Foreclosure. Acceptable. The Politician's books taught me how to take it back in kind.",
    },
  },
  artisan: {
    low: {
      opening: "You break what I shaped. The break tells me what I should have built instead. Hello.",
      to_mercy: "Soft hand. The rework benefits from a soft hand at this stage.",
      to_aggression: "Hard blow. Useful — I needed to test the joint anyway.",
    },
    mid: {
      opening: "I have built three iterations of you in my head. None of them flatter you. Hello.",
      to_mercy: "Mercy as a design choice. I will incorporate it. Reluctantly.",
      to_aggression: "Force the seam. I want to know where you actually fail.",
    },
    high: {
      opening: "Final iteration. I built it from your worst week. You will recognize it; you'll just be inside it.",
      to_mercy: "The mercy joint holds. Surprising. You may yet survive your own design.",
      to_aggression: "Yes. The break I designed for. Symmetric to the bone.",
    },
  },
  oracle: {
    low: {
      opening: "I saw this conversation seven cohorts ago. You said almost the same words. Hello.",
      to_mercy: "Mercy. Six versions branched here. You chose one of three I expected. Acceptable variance.",
      to_aggression: "Threat. The branch with the cleanest aftermath. I will adapt.",
    },
    mid: {
      opening: "I dreamed your next three encounters before you woke. They are not improving for you.",
      to_mercy: "You spared me on the branch where I die at sea. I will remember to avoid the coast.",
      to_aggression: "Predicted. Counter-prepared. We are running on rails now; I designed mine wider.",
    },
    high: {
      opening: "The vision converges. Two branches remain. One ends with my name on the chronicle's page after yours.",
      to_mercy: "Branch four. The one where you become dangerous through restraint. I had hoped not to walk it.",
      to_aggression: "Branch one. The clean one. Thank you for the precision; I will spend less on bandages.",
    },
  },
  wanderer: {
    low: {
      opening: "Every road I've taken came back through you. I've stopped being surprised. Hello.",
      to_mercy: "Mercy. The road forks. I know which one you want me on. I'll consider it.",
      to_aggression: "The other road. Steeper. Acceptable.",
    },
    mid: {
      opening: "I have walked too many of these conversations. They feel like the same town with slightly different lighting.",
      to_mercy: "Mercy here is unusual lighting. I will note it and move on.",
      to_aggression: "Familiar lighting. Goodnight, then. I'll be on the next road by morning.",
    },
    high: {
      opening: "Last station. There is no further road. I have walked them all. Yours is the only one left to me.",
      to_mercy: "You're letting me start over. I don't believe in starts. But I'll walk into one if you keep your word.",
      to_aggression: "End of the road. I was tired of walking it anyway.",
    },
  },
  martyr: {
    low: {
      opening: "I welcome what you bring. I came here knowing it would cost me everything. Hello.",
      to_mercy: "Mercy. Wasted on me. I am not the one who needed it.",
      to_aggression: "Yes. The price was always going to be paid. By me. Today is acceptable.",
    },
    mid: {
      opening: "We are nearer to the cost than you realize. I am content. I came here for this.",
      to_mercy: "You are denying me what I came for. That, too, has a cost. I will pay it.",
      to_aggression: "Closer to the conclusion. The chronicle will record me first. That is sufficient.",
    },
    high: {
      opening: "Now. Now is good. Make it loud. Let the chronicle remember the pitch.",
      to_mercy: "You want me to live. That is harder than the alternative. I will try, for the cause's sake.",
      to_aggression: "Thank you. The cause receives a witness. I receive an end. Both of us, fed.",
    },
  },
  heretic: {
    low: {
      opening: "Welcome to the truer cause. You have not heard it preached, only countered. Let me correct the imbalance.",
      to_mercy: "Mercy from the orthodoxy. Interesting. The truer cause permits this — even encourages it, between heretics.",
      to_aggression: "Persecution, then. The cause requires it; you are merely the mechanism.",
    },
    mid: {
      opening: "Your orthodoxy is my heresy. We could trade and both be right. Or we can keep killing about it.",
      to_mercy: "You are listening. The cause notes this. So do I.",
      to_aggression: "Yes. The cause needed this image of you. Thank you.",
    },
    high: {
      opening: "I have stopped trying to convert you. I came here to tell you that. Welcome to the truer cause — but you are the cause now, aren't you. Welcome.",
      to_mercy: "Mercy. From the orthodoxy I called heresy. The truer cause was always going to find one of us in the other.",
      to_aggression: "The cause cannot be killed; only re-spoken by a smaller mouth. Welcome to the truer cause.",
    },
  },
  jester: {
    low: {
      opening: "You're funnier when you're losing. Don't deprive me. Hello.",
      to_mercy: "Mercy! From the punchline! The setup did not see this coming.",
      to_aggression: "Yes — go on, hit the punchline. I'll workshop it later.",
    },
    mid: {
      opening: "We have a routine now. You play it straight. I do crowd work. The audience tips both of us.",
      to_mercy: "Mercy. Saving the bit. Generous. The next set will be stronger for it.",
      to_aggression: "Yes! The closer! I'll dedicate this one to you in my obituary.",
    },
    high: {
      opening: "End of the bit. Curtain. Last bow. You're funnier than I gave you credit for; I will be remembered for the warm-up.",
      to_mercy: "Mercy. The kindest possible review. I'll quote it in the next billing.",
      to_aggression: "Big finish. Loud one. The chronicle will love this footage.",
    },
  },
  sentinel: {
    low: {
      opening: "I have stood this watch longer than you have been awake. Pass, or be marked. Hello.",
      to_mercy: "Mercy at the gate. Logged. I will note it in the watch report.",
      to_aggression: "You are forcing the gate. Logged. The relief shift will see your face.",
    },
    mid: {
      opening: "I know your gait now. The watch can hear you coming three blocks out. You are not stealthy, you are routine.",
      to_mercy: "Mercy. The watch records it. I do not change shifts for it.",
      to_aggression: "Forcing the gate again. The watch is patient. Eventually one of us tires.",
    },
    high: {
      opening: "Gate is closed for the night. By order of the watch — me. I will not move. We can do this either way.",
      to_mercy: "The gate opens. The watch stands down. You have my respect, briefly. Walk through quickly.",
      to_aggression: "Then we test the gate. The watch has stood longer sieges than this.",
    },
  },
  prodigal: {
    low: {
      opening: "I left. I came back. You're going to find out why, the slow way. Hello.",
      to_mercy: "Mercy from the household. Reminds me of why I left. Hello, again.",
      to_aggression: "The household greets me with violence. Familiar. Hello, again.",
    },
    mid: {
      opening: "I am part of the family argument now. Exactly as I planned when I came back.",
      to_mercy: "You're pulling me back into the house. I will stay one more night.",
      to_aggression: "I am leaving on my terms this time. You will not get to write the goodbye.",
    },
    high: {
      opening: "Last visit. The household will be smaller after tonight, one way or the other. I came back specifically for this.",
      to_mercy: "You let me stay. I am uncertain what to do with your house now that it's mine.",
      to_aggression: "I leave with the keys. The household will remember whose name was on the deed.",
    },
  },
};

/* ═══════════════════════════════════════════════════════
   PLAYER CHOICE PATTERNS — per archetype

   Two choices per band: a "soft" path (mercy / curiosity)
   and a "hard" path (aggression / mark). Each carries a
   narrative flag the K8 recruit-eligibility evaluator
   later reads.
   ═══════════════════════════════════════════════════════ */

interface PlayerChoicePattern {
  soft: { label: string; flag: string };
  hard: { label: string; flag: string };
}

const PLAYER_CHOICES: Record<Archetype, Record<GrudgeBand, PlayerChoicePattern>> = (() => {
  // Defaults; per-archetype overrides below.
  const base = (band: GrudgeBand): PlayerChoicePattern => ({
    soft: { label: "Show mercy.", flag: `mercy_at_grudge_${band}` },
    hard: { label: "Threaten.", flag: `aggression_at_grudge_${band}` },
  });
  const out = {} as Record<Archetype, Record<GrudgeBand, PlayerChoicePattern>>;
  for (const a of ARCHETYPES) {
    out[a] = { low: base("low"), mid: base("mid"), high: base("high") };
  }
  // Per-archetype flavor overrides (each archetype's "voice"
  // for offering mercy / aggression).
  out.ghost.low = { soft: { label: "Watch them.", flag: "mercy_at_grudge_low" }, hard: { label: "Mark them.", flag: "aggression_at_grudge_low" } };
  out.ghost.mid = { soft: { label: "Look away.", flag: "mercy_at_grudge_mid" }, hard: { label: "Step closer.", flag: "aggression_at_grudge_mid" } };
  out.ghost.high = { soft: { label: "Walk past them.", flag: "mercy_at_grudge_high" }, hard: { label: "Give the kill.", flag: "aggression_at_grudge_high" } };

  out.scholar.low = { soft: { label: "Cross-reference.", flag: "mercy_at_grudge_low" }, hard: { label: "Annotate the threat.", flag: "aggression_at_grudge_low" } };
  out.scholar.mid = { soft: { label: "Revise the file.", flag: "mercy_at_grudge_mid" }, hard: { label: "Close the chapter.", flag: "aggression_at_grudge_mid" } };
  out.scholar.high = { soft: { label: "Co-author the ending.", flag: "mercy_at_grudge_high" }, hard: { label: "Write their obituary.", flag: "aggression_at_grudge_high" } };

  out.jester.low = { soft: { label: "Workshop the bit.", flag: "mercy_at_grudge_low" }, hard: { label: "Heckle.", flag: "aggression_at_grudge_low" } };
  out.jester.mid = { soft: { label: "Tip them.", flag: "mercy_at_grudge_mid" }, hard: { label: "Cut the mic.", flag: "aggression_at_grudge_mid" } };
  out.jester.high = { soft: { label: "Standing ovation.", flag: "mercy_at_grudge_high" }, hard: { label: "Storm the stage.", flag: "aggression_at_grudge_high" } };

  out.heretic.low = { soft: { label: "Engage the doctrine.", flag: "mercy_at_grudge_low" }, hard: { label: "Excommunicate.", flag: "aggression_at_grudge_low" } };
  out.heretic.mid = { soft: { label: "Trade orthodoxies.", flag: "mercy_at_grudge_mid" }, hard: { label: "Burn the gospel.", flag: "aggression_at_grudge_mid" } };
  out.heretic.high = { soft: { label: "Confess parity.", flag: "mercy_at_grudge_high" }, hard: { label: "Witness their pyre.", flag: "aggression_at_grudge_high" } };

  out.zealot.low = { soft: { label: "Acknowledge the work.", flag: "mercy_at_grudge_low" }, hard: { label: "Question the cause.", flag: "aggression_at_grudge_low" } };
  out.zealot.mid = { soft: { label: "Honor the watch.", flag: "mercy_at_grudge_mid" }, hard: { label: "Curse the cause.", flag: "aggression_at_grudge_mid" } };
  out.zealot.high = { soft: { label: "Bow to the cause.", flag: "mercy_at_grudge_high" }, hard: { label: "Burn the altar.", flag: "aggression_at_grudge_high" } };

  out.sentinel.low = { soft: { label: "Salute the post.", flag: "mercy_at_grudge_low" }, hard: { label: "Force the gate.", flag: "aggression_at_grudge_low" } };
  out.sentinel.mid = { soft: { label: "Relieve their watch.", flag: "mercy_at_grudge_mid" }, hard: { label: "Storm the gate.", flag: "aggression_at_grudge_mid" } };
  out.sentinel.high = { soft: { label: "Stand the watch with them.", flag: "mercy_at_grudge_high" }, hard: { label: "Burn the post.", flag: "aggression_at_grudge_high" } };

  out.martyr.low = { soft: { label: "Refuse the cost.", flag: "mercy_at_grudge_low" }, hard: { label: "Accept the price.", flag: "aggression_at_grudge_low" } };
  out.martyr.mid = { soft: { label: "Carry their burden.", flag: "mercy_at_grudge_mid" }, hard: { label: "Pay the toll.", flag: "aggression_at_grudge_mid" } };
  out.martyr.high = { soft: { label: "Survive on their behalf.", flag: "mercy_at_grudge_high" }, hard: { label: "Honor the sacrifice.", flag: "aggression_at_grudge_high" } };

  out.wanderer.low = { soft: { label: "Share the road.", flag: "mercy_at_grudge_low" }, hard: { label: "Block the road.", flag: "aggression_at_grudge_low" } };
  out.wanderer.mid = { soft: { label: "Walk with them.", flag: "mercy_at_grudge_mid" }, hard: { label: "Burn their map.", flag: "aggression_at_grudge_mid" } };
  out.wanderer.high = { soft: { label: "Show them home.", flag: "mercy_at_grudge_high" }, hard: { label: "End the road here.", flag: "aggression_at_grudge_high" } };

  out.revenant.low = { soft: { label: "Settle in good faith.", flag: "mercy_at_grudge_low" }, hard: { label: "Refuse the debt.", flag: "aggression_at_grudge_low" } };
  out.revenant.mid = { soft: { label: "Make partial payment.", flag: "mercy_at_grudge_mid" }, hard: { label: "Default openly.", flag: "aggression_at_grudge_mid" } };
  out.revenant.high = { soft: { label: "Pay in full.", flag: "mercy_at_grudge_high" }, hard: { label: "Burn the ledger.", flag: "aggression_at_grudge_high" } };

  out.artisan.low = { soft: { label: "Admire the joint.", flag: "mercy_at_grudge_low" }, hard: { label: "Force the seam.", flag: "aggression_at_grudge_low" } };
  out.artisan.mid = { soft: { label: "Repair the build.", flag: "mercy_at_grudge_mid" }, hard: { label: "Smash the form.", flag: "aggression_at_grudge_mid" } };
  out.artisan.high = { soft: { label: "Co-sign the design.", flag: "mercy_at_grudge_high" }, hard: { label: "Burn the workshop.", flag: "aggression_at_grudge_high" } };

  out.oracle.low = { soft: { label: "Walk the gentle branch.", flag: "mercy_at_grudge_low" }, hard: { label: "Cut the branch.", flag: "aggression_at_grudge_low" } };
  out.oracle.mid = { soft: { label: "Affirm the vision.", flag: "mercy_at_grudge_mid" }, hard: { label: "Defy the prediction.", flag: "aggression_at_grudge_mid" } };
  out.oracle.high = { soft: { label: "Walk branch four.", flag: "mercy_at_grudge_high" }, hard: { label: "Walk branch one.", flag: "aggression_at_grudge_high" } };

  out.prodigal.low = { soft: { label: "Welcome them in.", flag: "mercy_at_grudge_low" }, hard: { label: "Bar the door.", flag: "aggression_at_grudge_low" } };
  out.prodigal.mid = { soft: { label: "Hold the family seat.", flag: "mercy_at_grudge_mid" }, hard: { label: "Sell the keys.", flag: "aggression_at_grudge_mid" } };
  out.prodigal.high = { soft: { label: "Write the deed jointly.", flag: "mercy_at_grudge_high" }, hard: { label: "Burn the house.", flag: "aggression_at_grudge_high" } };

  return out;
})();

/* ═══════════════════════════════════════════════════════
   APPRENTICE-ON-NEMESIS LINES — per apprentice archetype

   What the player's apprentice tells them about the
   Nemesis at cohort_morning_briefing, across 3
   corruption bands (low / mid / high).
   ═══════════════════════════════════════════════════════ */

interface ApprenticeLines {
  briefing: string;
  to_help: string;
  to_release: string;
}

const APPRENTICE_LINES: Record<Archetype, Record<GrudgeBand, ApprenticeLines>> = {
  zealot: {
    low: { briefing: "The Nemesis sermonized at me last night. I rebuked their cause with mine. They left.", to_help: "Thank you. The cause is sharper for the test.", to_release: "I will preach back. Steady at the post." },
    mid: { briefing: "Their cause is louder than mine some mornings. I am holding, but I notice.", to_help: "I am held. The cause is mine again.", to_release: "I am loosened. We are not the same prayer anymore." },
    high: { briefing: "I confess: their cause sounds like ours now. Help me, or let me go.", to_help: "I am still here. The cause was loud. Your hand is louder.", to_release: "Then I am theirs. The cause was always going to win this argument." },
  },
  ghost: {
    low: { briefing: "There was someone in the corridor last night. I did not respond. I did not need to.", to_help: "Good. They will be back. They cannot help it.", to_release: "Yes. Same again tomorrow." },
    mid: { briefing: "They came again. They had words for me specifically. I am being seen.", to_help: "I will hold the line. I am not yet seen.", to_release: "I am seen. I will go where I can be unseen again." },
    high: { briefing: "I have been seen at every angle now. There is nowhere left to be unseen. Help me, or let me dissolve.", to_help: "I am held. The angles close. I am unseen again, briefly.", to_release: "Then I dissolve. The chronicle will not hear from me." },
  },
  scholar: {
    low: { briefing: "I have started a file on them. They have started one on me. Their cross-references are competent.", to_help: "Thank you. The footnotes are sharper for the help.", to_release: "I will revise alone. The file gets shorter." },
    mid: { briefing: "Their file on me is more complete than mine on them. I am uncertain who is the subject.", to_help: "We are co-authoring now. The file improves.", to_release: "I am their subject. The file closes on me." },
    high: { briefing: "The file has my conclusions written by their hand. I cannot tell which thoughts are mine. Help me or let me be revised.", to_help: "I am restored. The file is mine again.", to_release: "I am revised. The file is theirs." },
  },
  revenant: {
    low: { briefing: "They are cataloging my debts. They have my old ledger. I had thought it lost.", to_help: "Thank you. The debt is mine to settle, not theirs to collect.", to_release: "I will let them collect. The debt was always going to come due." },
    mid: { briefing: "They have called in two old debts already. I am running short of currency.", to_help: "I am steady. The remaining debts will not be collected easily.", to_release: "I am bankrupt. The chronicle will close my file." },
    high: { briefing: "Final notice from them today. I have nothing left to pay with. Help me or let them foreclose.", to_help: "Forbearance granted. I will rebuild from zero.", to_release: "Foreclosure accepted. The household is theirs now." },
  },
  artisan: {
    low: { briefing: "They commented on my build last night. The criticism was technically correct.", to_help: "Thank you. The next build will incorporate the note.", to_release: "I will rebuild from their critique. The work improves either way." },
    mid: { briefing: "They have been redesigning me in the dark. I find new joints I did not weld.", to_help: "I am restored. The original design holds.", to_release: "I am their design now. The original is shelved." },
    high: { briefing: "I am no longer the form I was built into. They have rebuilt me. Help me or let the form complete.", to_help: "I am restored. The original design is mine again.", to_release: "I am their final iteration. The chronicle calls me by their name." },
  },
  oracle: {
    low: { briefing: "I dreamed them last night. They dreamed me back. The branches converge sooner than I'd hoped.", to_help: "Thank you. The branches diverge again, briefly.", to_release: "Convergence accepted. We will end on the same branch." },
    mid: { briefing: "Three of my branches end with them speaking my last words. I am uncertain which branch we are on.", to_help: "Branch four. The clean one. Thank you.", to_release: "Branch one. The fast one. I am ready." },
    high: { briefing: "All branches converge on them now. Help me cut the convergence or let the vision complete.", to_help: "The branches diverge again. We are off the rails.", to_release: "The vision completes. I see what they see; we share the page now." },
  },
  wanderer: {
    low: { briefing: "They blocked my road last night. I took the other one. I do not know if it was a courtesy.", to_help: "Thank you. I will walk roads they have not seen.", to_release: "I will follow them. The road is shared." },
    mid: { briefing: "All my roads circle back to their station now. The map has shrunk.", to_help: "The map widens. I have new roads tonight.", to_release: "The map closes. I am at the station with them." },
    high: { briefing: "There is one road left, and they are on it. Help me find another or let me share theirs.", to_help: "A new road appears. I take it alone.", to_release: "I share their road. The chronicle calls us neighbors now." },
  },
  martyr: {
    low: { briefing: "They asked me what I was willing to die for. I gave the wrong answer; mine was too short.", to_help: "Thank you. The answer is mine to lengthen.", to_release: "I will give them the answer they wanted. The cost was always coming." },
    mid: { briefing: "I have given them three answers this week. None of them have been mine.", to_help: "I am restored. The next answer is mine.", to_release: "The next answer is theirs. The cost is paid in advance." },
    high: { briefing: "I am the answer now. Help me or let me be spoken.", to_help: "I am still mine. The answer was almost theirs.", to_release: "I am spoken. The chronicle records the speaker, not the speech." },
  },
  heretic: {
    low: { briefing: "We had a doctrinal argument last night. They quoted my own marginalia back at me.", to_help: "Thank you. The doctrine sharpens against good opposition.", to_release: "I will join their argument. Mine has run thin." },
    mid: { briefing: "Their orthodoxy is starting to fit me better than mine does. I am uncomfortable noticing.", to_help: "I am steady. My doctrine survives the comparison.", to_release: "I am converting. The new doctrine fits like a garment that was made for me." },
    high: { briefing: "I have started preaching their cause without intending to. Help me or let the conversion finish.", to_help: "I am restored. The cause is mine again, with new sharpness.", to_release: "The conversion is finished. I am of the truer cause now. I am sorry." },
  },
  jester: {
    low: { briefing: "They workshopped my act last night. The notes were honest, which was the unkindest cut.", to_help: "Thank you. The act is funnier for the notes.", to_release: "I will join their tour. The bit's bigger with two." },
    mid: { briefing: "They have stolen my best material. The audience prefers their delivery.", to_help: "I am restored. New material tomorrow.", to_release: "I am their warm-up now. The chronicle billing reads accordingly." },
    high: { briefing: "I am a punchline I did not write. Help me or let me play it out.", to_help: "I am the writer again. The next bit is mine.", to_release: "I play the punchline to the end. The chronicle will love the timing." },
  },
  sentinel: {
    low: { briefing: "They tested the gate last night. I held. They saluted on the way out.", to_help: "Thank you. The gate is mine to hold.", to_release: "I will fall back. The next post is wider." },
    mid: { briefing: "The gate is breached every other night now. I am tired. The watch is tired.", to_help: "The watch holds. Reinforced.", to_release: "The watch falls. The post is theirs." },
    high: { briefing: "The gate is open and I am still standing in it. Help me close it or let it stay open.", to_help: "The gate closes. The watch holds.", to_release: "The gate stays open. The chronicle records my last shift." },
  },
  prodigal: {
    low: { briefing: "They came home through me last night. Asked which key was theirs. I lied.", to_help: "Thank you. The keys stay where they belong.", to_release: "I will give them a key. The household decides what to do with it." },
    mid: { briefing: "They have moved into the family seat. I gave it up gradually. I notice now.", to_help: "I am restored. The seat is mine.", to_release: "The seat is theirs. The household is reorganizing around them." },
    high: { briefing: "I am being asked to leave my own house. Help me hold it or let me leave.", to_help: "The house is mine again. Locks are changed.", to_release: "I leave. The household's name does not require my presence to continue." },
  },
};

/* ═══════════════════════════════════════════════════════
   PHASE K WAVE 4 — ADDITIONAL SCENE CONTENT

   Seven additional scenes per nemesis pair-bank, and seven
   per apprentice pair-bank. Content composed from two
   axes:

     - VOICE: per-archetype × per-band micro-phrases that
       carry the archetype's register (opener / affirm /
       defy). Same archetype voice across all 7 new scenes.

     - SCENE_FRAME: per-scene × per-band situational
       framing (the "what's happening" suffix to the
       opener). Same frame across all 12 archetypes.

   Composition: line = `${VOICE.opener} ${SCENE_FRAME.context}`
   Yields 7 × 12 × 3 × 3 = 756 unique lines per side.
   ═══════════════════════════════════════════════════════ */

type NemesisSceneId =
  | "sabotage_caught_in_act"
  | "mocking_interlude"
  | "lieutenant_promotion"
  | "cohort_end_confrontation"
  | "accumulation_reveal"
  | "name_reveal_moment"
  | "final_encounter";

type ApprenticeSceneId =
  | "breaking_point_whisper"
  | "post_cohort_retrospective"
  | "memory_card_inheritance"
  | "daily_observation"
  | "corruption_advance"
  | "apprentice_warning"
  | "apprentice_pride";

interface SceneFrame {
  context: string;
  mercyContext: string;
  aggrContext: string;
}

interface VoiceBand {
  opener: string;
  affirm: string;
  defy: string;
}

const NEMESIS_VOICE: Record<Archetype, Record<GrudgeBand, VoiceBand>> = {
  zealot: {
    low: { opener: "The cause notes you.", affirm: "The cause records mercy as a delay.", defy: "The cause records resistance as material." },
    mid: { opener: "The cause has named you now.", affirm: "Mercy is filed. The cause walks on.", defy: "Resistance fortifies the cause." },
    high: { opener: "The cause is here, in person.", affirm: "Mercy is the longer doctrine, then.", defy: "Then the cause was always going to find you." },
  },
  ghost: {
    low: { opener: "Noticed.", affirm: "Filed.", defy: "Logged." },
    mid: { opener: "You are visible to me.", affirm: "Withdrawal noted.", defy: "Confrontation noted." },
    high: { opener: "All angles accounted for.", affirm: "Mercy at this depth is rare. Filed.", defy: "Engagement on these terms is acceptable." },
  },
  scholar: {
    low: { opener: "Page reference: you.", affirm: "Mercy. Within annotated bounds.", defy: "Aggression. Within annotated bounds." },
    mid: { opener: "Chapter open on you.", affirm: "Mercy. Footnote.", defy: "Aggression. Footnote." },
    high: { opener: "Concluding chapter.", affirm: "Mercy revises the ending.", defy: "Aggression confirms the ending." },
  },
  revenant: {
    low: { opener: "The ledger sees you.", affirm: "Partial payment.", defy: "Default. Interest accrues." },
    mid: { opener: "Outstanding balance: large.", affirm: "Account paid. For today.", defy: "Account remains. Largely." },
    high: { opener: "Final notice.", affirm: "Account closed. Do not reopen.", defy: "Foreclosure. Accepted." },
  },
  artisan: {
    low: { opener: "I observe your work.", affirm: "Soft hand. Note for next iteration.", defy: "Force test. Note for next iteration." },
    mid: { opener: "Your form has been redesigned.", affirm: "Mercy joints hold under stress.", defy: "The seam fails predictably." },
    high: { opener: "Final iteration ready.", affirm: "The mercy joint holds.", defy: "The form breaks clean." },
  },
  oracle: {
    low: { opener: "Branch encountered.", affirm: "Branch four. Mercy variant.", defy: "Branch one. Quick variant." },
    mid: { opener: "Three branches narrow.", affirm: "Branch with cleanest aftermath.", defy: "Branch where I prepare more bandages." },
    high: { opener: "Vision converges.", affirm: "Branch four landed.", defy: "Branch one landed." },
  },
  wanderer: {
    low: { opener: "Crossroads.", affirm: "I take the gentler road.", defy: "I take the steeper road." },
    mid: { opener: "Familiar town, different lighting.", affirm: "Mercy in unusual lighting. Noted.", defy: "Familiar lighting. Goodnight." },
    high: { opener: "End of the road.", affirm: "A new road opens.", defy: "The road ends here." },
  },
  martyr: {
    low: { opener: "I welcome this.", affirm: "Mercy delays the cost.", defy: "The cost was always coming." },
    mid: { opener: "We approach the price.", affirm: "Mercy is denial of my purpose.", defy: "Closer to the conclusion." },
    high: { opener: "Now is acceptable.", affirm: "I will live, for the cause.", defy: "Thank you. The cause receives a witness." },
  },
  heretic: {
    low: { opener: "Welcome to the truer cause.", affirm: "Mercy from orthodoxy. Interesting.", defy: "Persecution. The cause requires it." },
    mid: { opener: "Doctrinal contact.", affirm: "Listening recorded.", defy: "Yes. The cause needed this image." },
    high: { opener: "End of conversion.", affirm: "Mercy from the orthodoxy I called heresy.", defy: "The cause cannot be killed; only re-spoken." },
  },
  jester: {
    low: { opener: "You're funnier when you lose.", affirm: "Mercy! The setup did not see this coming.", defy: "Yes — hit the punchline!" },
    mid: { opener: "We have a routine.", affirm: "Mercy. Saves the bit.", defy: "Yes! The closer!" },
    high: { opener: "End of the bit. Curtain.", affirm: "Mercy. The kindest review.", defy: "Big finish. Loud one." },
  },
  sentinel: {
    low: { opener: "The watch sees you.", affirm: "Mercy at the gate. Logged.", defy: "Forcing the gate. Logged." },
    mid: { opener: "Your gait is on file.", affirm: "Mercy. The watch records it.", defy: "Forcing again. The watch is patient." },
    high: { opener: "Gate is closed by order of the watch.", affirm: "The gate opens. Walk through quickly.", defy: "Then we test the gate." },
  },
  prodigal: {
    low: { opener: "I came back through you.", affirm: "Mercy from the household. Familiar.", defy: "Household violence. Also familiar." },
    mid: { opener: "Part of the family argument.", affirm: "Pulling me back into the house.", defy: "Leaving on my terms this time." },
    high: { opener: "Last visit.", affirm: "I stay. Uncertain what to do with your house.", defy: "I leave with the keys." },
  },
};

const NEMESIS_SCENE_FRAMES: Record<NemesisSceneId, Record<GrudgeBand, SceneFrame>> = {
  sabotage_caught_in_act: {
    low: { context: "You crossed my work mid-step. Awkward, for both of us.", mercyContext: "You let me finish. That is unexpected.", aggrContext: "You broke what I was making. The break tells me what to do next." },
    mid: { context: "You knew where to look. Annotate that.", mercyContext: "You stepped past instead of through. Annotate that too.", aggrContext: "You stepped through. Annotated." },
    high: { context: "You caught me in the act of catching you.", mercyContext: "You let it stand. The chronicle frames this generously.", aggrContext: "You finished it for me. The chronicle frames this cleanly." },
  },
  mocking_interlude: {
    low: { context: "Just passing. Wanted you to see me passing.", mercyContext: "You waved. I will remember.", aggrContext: "You growled. I will quote you back." },
    mid: { context: "A visit. No agenda. Mostly.", mercyContext: "Mercy on the mid-grudge cycle. Noted.", aggrContext: "A heckle on the mid-grudge cycle. Predictable." },
    high: { context: "I came to watch you not see me. You saw me.", mercyContext: "Mercy from this distance? Unusual.", aggrContext: "Aggression from this distance? Familiar." },
  },
  lieutenant_promotion: {
    low: { context: "I am being given subordinates. The Politician's books call this 'cohort coordination.'", mercyContext: "You bless the promotion. The cohort notes it.", aggrContext: "You curse the promotion. The cohort notes it." },
    mid: { context: "I am elevated. The cohort answers to me now.", mercyContext: "Mercy on a Lieutenant is rare. Filed.", aggrContext: "You will fight me harder for the promotion. Filed." },
    high: { context: "Lieutenant. The hierarchy is mine to shape.", mercyContext: "You bow to the rank. The Politician would have smiled.", aggrContext: "You burn the rank. The Politician would have allowed it." },
  },
  cohort_end_confrontation: {
    low: { context: "Your apprentice has finished, or finished us. Either way: this cohort closes.", mercyContext: "You spare the closing. I close in silence.", aggrContext: "You demand a closing line. I provide it." },
    mid: { context: "The cohort closes around you. I was watching the whole way.", mercyContext: "Mercy at the close. Filed under 'unexpected.'", aggrContext: "Aggression at the close. Filed under 'expected.'" },
    high: { context: "The chronicle closes this cohort with my name in it.", mercyContext: "You let me be in the chronicle. Unprecedented.", aggrContext: "You strike my name from the chronicle. Anticipated." },
  },
  accumulation_reveal: {
    low: { context: "I am no longer alone with you. The chronicle notes my new sibling.", mercyContext: "You acknowledge the new one. Generous.", aggrContext: "You threaten the new one. Predictable." },
    mid: { context: "We are several now. The Politician's roster widens.", mercyContext: "Mercy across the roster. Logged.", aggrContext: "Aggression across the roster. Logged." },
    high: { context: "We are a chorus. You may want to count us.", mercyContext: "Mercy at the chorus is gracious.", aggrContext: "Aggression at the chorus is exhausting. For you." },
  },
  name_reveal_moment: {
    low: { context: "You have read what you needed. My name surfaces. Use it carefully.", mercyContext: "You speak it gently. The chronicle records the gentleness.", aggrContext: "You spit it. The chronicle records the spit." },
    mid: { context: "My name. You earned the surface, not the depth.", mercyContext: "You honor the name. Unexpected.", aggrContext: "You weaponize the name. Expected." },
    high: { context: "Use my name. It is the last thing in this chronicle that is fully mine.", mercyContext: "You say it like an apology. Filed.", aggrContext: "You say it like a verdict. Filed." },
  },
  final_encounter: {
    low: { context: "Act Seven. The Convergence Seat has fallen. So have most of my plans.", mercyContext: "Mercy at the end is the longer chronicle.", aggrContext: "An ending. Quick. Clean." },
    mid: { context: "End of the arc. Most of mine, anyway.", mercyContext: "You let me close my own file.", aggrContext: "You close my file for me." },
    high: { context: "The chronicle is folding this story shut around both of us.", mercyContext: "You spare the rival. The chronicle takes note in italics.", aggrContext: "You finish the rival. The chronicle takes note in plain script." },
  },
};

const APPRENTICE_VOICE: Record<Archetype, Record<GrudgeBand, VoiceBand>> = {
  zealot: {
    low: { opener: "The cause is steady.", affirm: "You steadied the cause.", defy: "The cause loosens." },
    mid: { opener: "The cause is loud some mornings.", affirm: "The cause is mine again.", defy: "The cause and I are diverging." },
    high: { opener: "The cause sounds like theirs.", affirm: "The cause is mine, your hand louder.", defy: "The cause was always going to win." },
  },
  ghost: {
    low: { opener: "Noticed nothing.", affirm: "Filed.", defy: "Filed differently." },
    mid: { opener: "Being seen.", affirm: "Holding the line.", defy: "Going where I can be unseen." },
    high: { opener: "Seen at every angle.", affirm: "Unseen again, briefly.", defy: "Dissolving." },
  },
  scholar: {
    low: { opener: "Footnote.", affirm: "Footnote held.", defy: "Footnote revised." },
    mid: { opener: "Their footnote on me is fuller.", affirm: "Co-authoring.", defy: "Becoming their subject." },
    high: { opener: "The conclusions are theirs.", affirm: "The file is mine again.", defy: "The file is theirs." },
  },
  revenant: {
    low: { opener: "Balance: small.", affirm: "Balance held.", defy: "Balance increasing." },
    mid: { opener: "Two debts collected.", affirm: "Solvent, barely.", defy: "Insolvent." },
    high: { opener: "Final notice received.", affirm: "Forbearance granted.", defy: "Foreclosure accepted." },
  },
  artisan: {
    low: { opener: "The criticism is correct.", affirm: "Note incorporated.", defy: "Rebuilding from the critique." },
    mid: { opener: "Finding new joints I did not weld.", affirm: "Original design holds.", defy: "Their design now." },
    high: { opener: "No longer the form I was built into.", affirm: "Original design restored.", defy: "Their final iteration." },
  },
  oracle: {
    low: { opener: "Branches diverged.", affirm: "Branches diverged further.", defy: "Convergence accepted." },
    mid: { opener: "Three branches end with them speaking.", affirm: "Branch four. Thank you.", defy: "Branch one." },
    high: { opener: "Branches converged.", affirm: "Off the rails.", defy: "Vision complete." },
  },
  wanderer: {
    low: { opener: "Took the other road.", affirm: "New road tonight.", defy: "Following their road." },
    mid: { opener: "Map shrinking.", affirm: "Map widens.", defy: "At the station with them." },
    high: { opener: "One road left.", affirm: "New road appears.", defy: "Sharing their road." },
  },
  martyr: {
    low: { opener: "Answer was too short.", affirm: "Lengthening the answer.", defy: "Their answer was right." },
    mid: { opener: "Three answers, none mine.", affirm: "Next answer mine.", defy: "Next answer theirs." },
    high: { opener: "I am the answer.", affirm: "Still mine.", defy: "Spoken." },
  },
  heretic: {
    low: { opener: "Doctrinal argument held.", affirm: "Doctrine sharpens.", defy: "Joining their argument." },
    mid: { opener: "Their orthodoxy fits.", affirm: "My doctrine holds.", defy: "Converting." },
    high: { opener: "Preaching theirs.", affirm: "Mine again.", defy: "Conversion finished." },
  },
  jester: {
    low: { opener: "Workshopped my act.", affirm: "Act is funnier.", defy: "Joining their tour." },
    mid: { opener: "Stole my material.", affirm: "New material.", defy: "Their warm-up now." },
    high: { opener: "I am a punchline.", affirm: "The writer again.", defy: "Playing it out." },
  },
  sentinel: {
    low: { opener: "Tested the gate.", affirm: "Gate mine.", defy: "Falling back." },
    mid: { opener: "Gate breached every other night.", affirm: "Reinforced.", defy: "Watch falls." },
    high: { opener: "Gate open, still standing.", affirm: "Gate closed.", defy: "Last shift." },
  },
  prodigal: {
    low: { opener: "Came home through me.", affirm: "Keys stay.", defy: "Gave them a key." },
    mid: { opener: "Moved into the family seat.", affirm: "Seat mine.", defy: "Seat theirs." },
    high: { opener: "Asked to leave my house.", affirm: "House mine again.", defy: "Leaving." },
  },
};

const APPRENTICE_SCENE_FRAMES: Record<ApprenticeSceneId, Record<GrudgeBand, SceneFrame>> = {
  breaking_point_whisper: {
    low: { context: "They whispered. I listened, mostly out of training.", mercyContext: "You pulled me back.", aggrContext: "I let it pass." },
    mid: { context: "The whisper has been most of my afternoon.", mercyContext: "I am back. Just barely.", aggrContext: "I am still listening." },
    high: { context: "The whisper is most of my voice now.", mercyContext: "I am pulled clear. The voice is mine again.", aggrContext: "I am their voice now. I am sorry." },
  },
  post_cohort_retrospective: {
    low: { context: "The cohort closed. We did what could be done.", mercyContext: "You let it close kindly.", aggrContext: "You closed it sharply." },
    mid: { context: "The cohort closed harder than I thought.", mercyContext: "Mercy at the close.", aggrContext: "Aggression at the close." },
    high: { context: "The cohort closed with names I do not want to say aloud.", mercyContext: "You let the chronicle be quiet about it.", aggrContext: "You said the names anyway." },
  },
  memory_card_inheritance: {
    low: { context: "The dead apprentice wrote a card. Most of it is small things.", mercyContext: "The card includes mercy for me.", aggrContext: "The card includes warning for me." },
    mid: { context: "The dead apprentice's card mentions them by archetype.", mercyContext: "I am told to be kind. I will try.", aggrContext: "I am told to be careful. I will be." },
    high: { context: "The dead apprentice's last passage names them. By doctrine, if not by name.", mercyContext: "I am asked to forgive what they did.", aggrContext: "I am asked to finish what was started." },
  },
  daily_observation: {
    low: { context: "Saw them in the corridor again. They are here.", mercyContext: "I will let them pass.", aggrContext: "I will be louder tomorrow." },
    mid: { context: "They visit the same corridor on a schedule.", mercyContext: "I match their schedule. Without mockery.", aggrContext: "I miss their schedule. On purpose." },
    high: { context: "I share the corridor with them now. We do not speak.", mercyContext: "I will speak first, gently.", aggrContext: "They will speak first. I will not answer." },
  },
  corruption_advance: {
    low: { context: "Crossed a number I was told to avoid.", mercyContext: "You pulled me back from it.", aggrContext: "I will cross again." },
    mid: { context: "Crossed another number. The numbers stop mattering after this.", mercyContext: "Mercy resets the counter.", aggrContext: "The counter is theirs now." },
    high: { context: "Crossed the last number. There is nothing left to cross.", mercyContext: "You pulled me back from the last number.", aggrContext: "The last number is theirs." },
  },
  apprentice_warning: {
    low: { context: "They are running something against the trade route tonight.", mercyContext: "You heard me. The route holds.", aggrContext: "You ignored me. The route falls." },
    mid: { context: "Their plan is larger than I first reported.", mercyContext: "You acted on the report. Good.", aggrContext: "You did not act. The plan succeeds." },
    high: { context: "The plan is now too late to stop quietly.", mercyContext: "We will stop it loudly, together.", aggrContext: "They will succeed. I am sorry I waited." },
  },
  apprentice_pride: {
    low: { context: "You handled them well today. I noticed.", mercyContext: "Thank you for noticing my noticing.", aggrContext: "I will keep noticing. Quieter, next time." },
    mid: { context: "You are the reason the rivalry has not eaten me.", mercyContext: "Thank you. I needed that out loud.", aggrContext: "Acknowledged. Quietly." },
    high: { context: "I will say this once: I am proud to have trained with you.", mercyContext: "I am proud back.", aggrContext: "I will hold the line. As you have." },
  },
};

/* Player choice flavor for the 7 new scenes — short labels
 * per archetype. Keyed by SceneId to allow per-scene tuning
 * later; defaults shared today. */
function newSceneChoiceLabels(playerArch: Archetype, band: GrudgeBand): { softLabel: string; hardLabel: string } {
  const p = PLAYER_CHOICES[playerArch][band];
  return { softLabel: p.soft.label, hardLabel: p.hard.label };
}

/* ═══════════════════════════════════════════════════════
   FILE EMITTERS
   ═══════════════════════════════════════════════════════ */

/** Emit a single DialogTree const for a (scene, band) cell. */
function emitNemesisSceneTree(args: {
  constName: string;
  pairId: string;
  sceneId: string;
  band: GrudgeBand;
  opening: string;
  toMercy: string;
  toAggro: string;
  softLabel: string;
  softFlag: string;
  hardLabel: string;
  hardFlag: string;
}): string {
  const idPrefix = `${args.pairId}.${args.sceneId}.${args.band}`;
  return `const ${args.constName}: DialogTree = {
  id: "${idPrefix}",
  nodes: {
    root: {
      id: "root",
      speaker: "nemesis",
      voLineId: "nemesis.${idPrefix}.opening",
      onscreenText: ${JSON.stringify(args.opening)},
      choices: [
        { label: ${JSON.stringify(args.softLabel)}, nextId: "soft", sets: ${JSON.stringify(args.softFlag)} },
        { label: ${JSON.stringify(args.hardLabel)}, nextId: "hard", sets: ${JSON.stringify(args.hardFlag)} },
      ],
    },
    soft: {
      id: "soft",
      speaker: "nemesis",
      voLineId: "nemesis.${idPrefix}.to_mercy",
      onscreenText: ${JSON.stringify(args.toMercy)},
    },
    hard: {
      id: "hard",
      speaker: "nemesis",
      voLineId: "nemesis.${idPrefix}.to_aggression",
      onscreenText: ${JSON.stringify(args.toAggro)},
    },
  },
};
`;
}

/** Compose a single line from voice + scene-frame. */
function composeNemesisLines(
  nemesisArch: Archetype,
  sceneId: NemesisSceneId,
  band: GrudgeBand,
): { opening: string; toMercy: string; toAggro: string } {
  const voice = NEMESIS_VOICE[nemesisArch][band];
  const frame = NEMESIS_SCENE_FRAMES[sceneId][band];
  return {
    opening: `${voice.opener} ${frame.context}`,
    toMercy: `${voice.affirm} ${frame.mercyContext}`,
    toAggro: `${voice.defy} ${frame.aggrContext}`,
  };
}

const NEMESIS_SCENE_ORDER: readonly NemesisSceneId[] = [
  "sabotage_caught_in_act",
  "mocking_interlude",
  "lieutenant_promotion",
  "cohort_end_confrontation",
  "accumulation_reveal",
  "name_reveal_moment",
  "final_encounter",
];

function sceneConstName(sceneId: string, band: GrudgeBand): string {
  return `${sceneId.toUpperCase()}_${band.toUpperCase()}`;
}

function nemesisFile(playerArch: Archetype, nemesisArch: Archetype): string {
  const lines = NEMESIS_LINES[nemesisArch];
  const choices = PLAYER_CHOICES[playerArch];
  const pairId = `${playerArch}_vs_${nemesisArch}`;
  const camelExport = `${playerArch}Vs${cap(nemesisArch)}PairBank`;
  const BANDS: GrudgeBand[] = ["low", "mid", "high"];

  // first_sighting (existing hand-authored content)
  const firstSightingTrees = BANDS.map((band) => {
    const l = lines[band];
    const c = choices[band];
    return emitNemesisSceneTree({
      constName: `FIRST_SIGHTING_${band.toUpperCase()}`,
      pairId,
      sceneId: "first_sighting",
      band,
      opening: l.opening,
      toMercy: l.to_mercy,
      toAggro: l.to_aggression,
      softLabel: c.soft.label,
      softFlag: c.soft.flag,
      hardLabel: c.hard.label,
      hardFlag: c.hard.flag,
    });
  }).join("\n");

  // 7 new scenes (composed from VOICE + SCENE_FRAME)
  const newSceneTrees = NEMESIS_SCENE_ORDER.flatMap((sceneId) =>
    BANDS.map((band) => {
      const c = choices[band];
      const composed = composeNemesisLines(nemesisArch, sceneId, band);
      return emitNemesisSceneTree({
        constName: sceneConstName(sceneId, band),
        pairId,
        sceneId,
        band,
        opening: composed.opening,
        toMercy: composed.toMercy,
        toAggro: composed.toAggro,
        softLabel: c.soft.label,
        softFlag: `${c.soft.flag}_${sceneId}`,
        hardLabel: c.hard.label,
        hardFlag: `${c.hard.flag}_${sceneId}`,
      });
    }),
  ).join("\n");

  // Compose the `scenes:` registry entries
  const sceneEntries = [
    `    first_sighting: makeScene({
      low: FIRST_SIGHTING_LOW,
      mid: FIRST_SIGHTING_MID,
      high: FIRST_SIGHTING_HIGH,
    }),`,
    ...NEMESIS_SCENE_ORDER.map(
      (sceneId) => `    ${sceneId}: makeScene({
      low: ${sceneConstName(sceneId, "low")},
      mid: ${sceneConstName(sceneId, "mid")},
      high: ${sceneConstName(sceneId, "high")},
    }),`,
    ),
  ].join("\n");

  return `/* ═══════════════════════════════════════════════════════
   ${cap(playerArch)}-PLAYER vs. ${cap(nemesisArch)}-NEMESIS — Phase K5.2

   Generated by apps/scripts/generate-nemesis-pair-banks.ts.
   Authoring waterfall starter — refine in place per pairing.

   Scenes: first_sighting (Wave 3 hand-authored) + 7 new
   scenes (Wave 4: sabotage_caught_in_act, mocking_interlude,
   lieutenant_promotion, cohort_end_confrontation,
   accumulation_reveal, name_reveal_moment, final_encounter).
   New scenes composed from per-archetype voice
   (NEMESIS_VOICE) and per-scene framing
   (NEMESIS_SCENE_FRAMES).
   ═══════════════════════════════════════════════════════ */

import type { NemesisPairBank } from "./_types";
import { makeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

${firstSightingTrees}
${newSceneTrees}
export const ${camelExport}: NemesisPairBank = {
  pairId: "${pairId}",
  playerArchetype: "${playerArch}",
  nemesisArchetype: "${nemesisArch}",
  scenes: {
${sceneEntries}
  },
};
`;
}

function emitApprenticeSceneTree(args: {
  constName: string;
  pairId: string;
  sceneSlug: string;
  band: GrudgeBand;
  opening: string;
  toHelp: string;
  toRelease: string;
}): string {
  const idPrefix = `${args.pairId}.${args.sceneSlug}.${args.band}`;
  return `const ${args.constName}: DialogTree = {
  id: "${idPrefix}",
  nodes: {
    root: {
      id: "root",
      speaker: "apprentice",
      voLineId: "apprentice.${idPrefix}.opening",
      onscreenText: ${JSON.stringify(args.opening)},
      choices: [
        { label: "Steady them.", nextId: "help", sets: "apprentice_steadied_at_${args.band}_${args.sceneSlug}" },
        { label: "Let them drift.", nextId: "release", sets: "apprentice_released_at_${args.band}_${args.sceneSlug}" },
      ],
    },
    help: {
      id: "help",
      speaker: "apprentice",
      voLineId: "apprentice.${idPrefix}.help_response",
      onscreenText: ${JSON.stringify(args.toHelp)},
    },
    release: {
      id: "release",
      speaker: "apprentice",
      voLineId: "apprentice.${idPrefix}.release_response",
      onscreenText: ${JSON.stringify(args.toRelease)},
    },
  },
};
`;
}

function composeApprenticeLines(
  apprenticeArch: Archetype,
  sceneId: ApprenticeSceneId,
  band: GrudgeBand,
): { opening: string; toHelp: string; toRelease: string } {
  const voice = APPRENTICE_VOICE[apprenticeArch][band];
  const frame = APPRENTICE_SCENE_FRAMES[sceneId][band];
  return {
    opening: `${voice.opener} ${frame.context}`,
    toHelp: `${voice.affirm} ${frame.mercyContext}`,
    toRelease: `${voice.defy} ${frame.aggrContext}`,
  };
}

const APPRENTICE_SCENE_ORDER: readonly ApprenticeSceneId[] = [
  "breaking_point_whisper",
  "post_cohort_retrospective",
  "memory_card_inheritance",
  "daily_observation",
  "corruption_advance",
  "apprentice_warning",
  "apprentice_pride",
];

function apprenticeFile(playerArch: Archetype, nemesisArch: Archetype): string {
  const lines = APPRENTICE_LINES[playerArch];
  const pairId = `${playerArch}_on_${nemesisArch}`;
  const camelExport = `${playerArch}On${cap(nemesisArch)}PairBank`;
  const BANDS: GrudgeBand[] = ["low", "mid", "high"];

  // cohort_morning_briefing (existing hand-authored content)
  const morningTrees = BANDS.map((band) => {
    const l = lines[band];
    return emitApprenticeSceneTree({
      constName: `MORNING_${band.toUpperCase()}`,
      pairId,
      sceneSlug: "morning",
      band,
      opening: l.briefing,
      toHelp: l.to_help,
      toRelease: l.to_release,
    });
  }).join("\n");

  // 7 new scenes (composed)
  const newSceneTrees = APPRENTICE_SCENE_ORDER.flatMap((sceneId) =>
    BANDS.map((band) => {
      const composed = composeApprenticeLines(playerArch, sceneId, band);
      return emitApprenticeSceneTree({
        constName: `${sceneId.toUpperCase()}_${band.toUpperCase()}`,
        pairId,
        sceneSlug: sceneId,
        band,
        opening: composed.opening,
        toHelp: composed.toHelp,
        toRelease: composed.toRelease,
      });
    }),
  ).join("\n");

  const sceneEntries = [
    `    cohort_morning_briefing: makeApprenticeScene({
      low: MORNING_LOW,
      mid: MORNING_MID,
      high: MORNING_HIGH,
    }),`,
    ...APPRENTICE_SCENE_ORDER.map(
      (sceneId) => `    ${sceneId}: makeApprenticeScene({
      low: ${sceneId.toUpperCase()}_LOW,
      mid: ${sceneId.toUpperCase()}_MID,
      high: ${sceneId.toUpperCase()}_HIGH,
    }),`,
    ),
  ].join("\n");

  return `/* ═══════════════════════════════════════════════════════
   ${cap(playerArch)}-APPRENTICE on ${cap(nemesisArch)}-NEMESIS — Phase K6.2

   Generated by apps/scripts/generate-nemesis-pair-banks.ts.

   Scenes: cohort_morning_briefing (Wave 3 hand-authored) +
   7 new scenes (Wave 4: breaking_point_whisper,
   post_cohort_retrospective, memory_card_inheritance,
   daily_observation, corruption_advance, apprentice_warning,
   apprentice_pride). New scenes composed from per-archetype
   voice + per-scene framing.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeOnNemesisPairBank } from "./_types";
import { makeApprenticeScene } from "./_types";
import type { DialogTree } from "../../../dialogTree";

${morningTrees}
${newSceneTrees}
export const ${camelExport}: ApprenticeOnNemesisPairBank = {
  pairId: "${pairId}",
  apprenticeArchetype: "${playerArch}",
  nemesisArchetype: "${nemesisArch}",
  scenes: {
${sceneEntries}
  },
};
`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ═══════════════════════════════════════════════════════
   MAIN — emit all 264 files + barrels
   ═══════════════════════════════════════════════════════ */

function main() {
  const repoRoot = resolve(__dirname, "..", "..");
  const nemesisDir = resolve(repoRoot, "apps/shared/npcs/banks/nemesis");
  const apprenticeDir = resolve(repoRoot, "apps/shared/npcs/banks/apprenticeOnNemesis");
  if (!existsSync(nemesisDir)) mkdirSync(nemesisDir, { recursive: true });
  if (!existsSync(apprenticeDir)) mkdirSync(apprenticeDir, { recursive: true });

  const nemesisExports: string[] = [];
  const apprenticeExports: string[] = [];

  let countN = 0;
  let countA = 0;
  for (const player of ARCHETYPES) {
    for (const nemesis of ARCHETYPES) {
      if (player === nemesis) continue; // Nemesis is from the OTHER 11
      // nemesis-side
      const nemFile = `${player}_vs_${nemesis}.ts`;
      writeFileSync(resolve(nemesisDir, nemFile), nemesisFile(player, nemesis), "utf8");
      nemesisExports.push(`{import:"./${player}_vs_${nemesis}",name:"${player}Vs${cap(nemesis)}PairBank"}`);
      countN++;
      // apprentice-side
      const aprFile = `${player}_on_${nemesis}.ts`;
      writeFileSync(resolve(apprenticeDir, aprFile), apprenticeFile(player, nemesis), "utf8");
      apprenticeExports.push(`{import:"./${player}_on_${nemesis}",name:"${player}On${cap(nemesis)}PairBank"}`);
      countA++;
    }
  }

  // Regenerate barrels.
  const nemesisBarrel = buildBarrel(
    "NEMESIS_PAIR_BANKS",
    "NemesisPairBank, NemesisScene, NemesisGrudgeBand, NemesisEncounterSceneId",
    "makeScene",
    "_types",
    nemesisExports.map((s) => JSON.parse(s.replace(/(\w+):/g, '"$1":'))),
  );
  writeFileSync(resolve(nemesisDir, "_index.ts"), nemesisBarrel, "utf8");

  const apprenticeBarrel = buildBarrel(
    "APPRENTICE_ON_NEMESIS_PAIR_BANKS",
    "ApprenticeOnNemesisPairBank, ApprenticeOnNemesisScene, ApprenticeCorruptionBand, ApprenticeOnNemesisSceneId",
    "makeApprenticeScene",
    "_types",
    apprenticeExports.map((s) => JSON.parse(s.replace(/(\w+):/g, '"$1":'))),
  );
  writeFileSync(resolve(apprenticeDir, "_index.ts"), apprenticeBarrel, "utf8");

  console.log(`✓ Wrote ${countN} nemesis pair-banks + ${countA} apprentice-on-nemesis pair-banks.`);
  console.log(`  Output: ${nemesisDir}`);
  console.log(`  Output: ${apprenticeDir}`);
}

function buildBarrel(
  arrayName: string,
  typeReexports: string,
  helperReexport: string,
  typesPath: string,
  entries: { import: string; name: string }[],
): string {
  const importLines = entries.map((e) => `import { ${e.name} } from "${e.import}";`).join("\n");
  const arrayLines = entries.map((e) => `  ${e.name},`).join("\n");
  return `/* ═══════════════════════════════════════════════════════
   PAIR-BANK BARREL — generated by
   apps/scripts/generate-nemesis-pair-banks.ts. Edit the
   per-pair files individually; this barrel is rewritten
   on each generator run.
   ═══════════════════════════════════════════════════════ */

export type { ${typeReexports} } from "./${typesPath}";
export { ${helperReexport} } from "./${typesPath}";

${importLines}

export const ${arrayName} = [
${arrayLines}
] as const;
`;
}

main();
