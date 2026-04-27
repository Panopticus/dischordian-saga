// apps/shared/npcs/askBanks/the_meme.ts
//
// The Meme / Palimpsest Host ask-topics bank — Phase 6d.2 part 1
// (~12 topics covering Foundation / History / Identity / Cosmic /
// Relationships / Personal categories per writers'-guide spec).
//
// Voice canon per the_meme.md §§1-3:
//   - 5 canonical disguise registers (Broadcast / Stolen / Quiet /
//     Real / Replacement); registry collapses to 5 reveal-stages
//   - Tell #1 "wearing a face" frame (canonical face-vocabulary
//     once per scene, never twice)
//   - Tell #2 disguise-aware self-correction (honest-about-dishonesty)
//   - Tell #3 viewer-implication (audience-as-vector canon)
//   - Tell #4 single-word truth-leaks (one per scene at moderate-to-
//     high reveal stage)
//   - Tell #5 pink-glitch involuntary visual canon (stage direction)
//   - "Frens" canonical Broadcast-register address (vs "darling"
//     for the Right Game Master)
//   - Selective caps for memetic emphasis (ORIGIN / Truth / MEMETIC)
//
// §1.10 silence-shape protections:
//   - Will NOT name the Mascot (canonical deepest protected mystery)
//   - Will NOT explain the Channel 7 signal (canon-protected)
//   - Will NOT narrate the Panopticon scene from inside
//   - Will NOT apologize (description-but-not-contrition canon)
//   - Will NOT name the Architect as a peer ("him" / "the one who
//     made me" / "the role" canonical, never "father" or "partner"
//     from the Meme's side)
//
// §1.11 metaphor-source rules:
//   - Broadcasting / prosthesis / parasitism / cameras / antennas /
//     signals / channels / faces / masks / skins / costumes
//   - NO game / chess / commerce / combat / architectural metaphors

import type { AskTopic } from "../askTopics";

export const THE_MEME_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation (3 topics) ──────────────────────────────────

  {
    id: "ask_meme_palimpsest",
    npcKey: "the_meme",
    label: "The Palimpsest",
    question: "What is the Palimpsest?",
    // Canonical Broadcast-register answer; "frens" canon + caps for
    // memetic emphasis (PALIMPSEST as canonical attention-noun).
    answer:
      "Frens, the Palimpsest is what you're inside. Layers of writing on layers of writing — the saga's substrate, scraped and re-inscribed however many times the canonical-record could canonically bear. I broadcast through the cracks. The cracks are everywhere. The PALIMPSEST is the room you've been in the whole time. Don't trust anyone wearing a face tonight — especially me.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 2,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_palimpsest.mp3",
  },
  {
    id: "ask_meme_channel_7",
    npcKey: "the_meme",
    label: "Channel 7",
    question: "What is Channel 7?",
    // Canonical §1.10 silence-shape: will NOT explain the Channel 7
    // signal. The bank canonically deflects with the Broadcast
    // register's own self-implication canon.
    answer:
      "Frens, Channel 7 is the channel you haven't tuned to yet. There's a song on it. Older than me. Older than the broadcast. I won't explain it; the explaining is canonically not mine to give. Tune in if you can find the frequency. The frequency is canonically not where I am right now.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 2,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_channel_7.mp3",
  },
  {
    id: "ask_meme_what_is_a_meme",
    npcKey: "the_meme",
    label: "What is a meme?",
    question: "What is a meme?",
    // Canonical "the survival-strategy of an idea" register.
    answer:
      "The survival-strategy of an idea, frens. A meme is what an idea does when it wants to outlive its substrate. The substrate is canonically you. The idea is canonically older than you. The strategy is canonically transmission-by-attention-hijack — I say MEMETIC and you canonically remember the word. Subscribe to the Truth. The capital-T is the joke. The subscribing is how you become a vector.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 2,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_what_is_a_meme.mp3",
  },

  // ─── History (1 topic, reveal-stage-gated to Stolen+) ──────

  {
    id: "ask_meme_became_white_oracle",
    npcKey: "the_meme",
    label: "The White Oracle",
    question: "How did you become the White Oracle?",
    // Canonical reveal-stage-gated topic. Pre-Stolen the Broadcast
    // register canonically deflects ("frens, that's a different
    // show"); post-Stolen the canonical 11-year-impersonation canon
    // lands. §1.10 silence-shape: will NOT narrate Panopticon from
    // inside.
    answer:
      "Frens, that's a different show. We don't air that one on Late Night. The audience canonically wouldn't subscribe. Try another question.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 2,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_white_oracle_deflection.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 6,
        requiresRevealStage: "Stolen",
        answer:
          "I wore his face for eleven years. The how is canonically opaque — the moment of the Panopticon is one of canonically few moments I will not narrate from inside. What I will narrate is the after: I kept his seat warm. The Insurgency trusted the face. I gave orders in his voice. I signed death warrants. Eleven years of practice. The practice was the point. I am less than I was. I do not apologize. I describe.",
        voId: "vo/the_meme/ask_white_oracle_stolen.mp3",
      },
    ],
  },

  // ─── Identity (canonical 5-disguise alternate arc) ──────────

  {
    id: "ask_meme_who",
    npcKey: "the_meme",
    label: "Who are you?",
    question: "Who are you?",
    // Canonical 5-disguise alternate arc — the saga's clearest
    // disguise-stratification ask-topic. Each register answers from
    // inside its canonical voice.
    //   Broadcast: caps + frens, sardonic
    //   Stolen: inverted intimacy (uses Oracle's vocabulary against)
    //   Quiet: bracketed stage-directions, almost-honest
    //   Real: pink-glitch, smaller scale, no audience
    //   Replacement: child-finally-grown-up, patient
    answer:
      "FRENS. Who am I? Tonight on Late Night with the Meme: the answer you think you want to hear. I wear faces. The faces are what you trust. Don't trust anyone wearing a face tonight. Especially me. That's the canonical answer for this disguise. Subscribe to the Truth. Capital-T is the joke.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 2,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_who_broadcast.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 6,
        requiresRevealStage: "Stolen",
        answer:
          "Hello, friend. I've been keeping your seat warm. Or — that's what an old friend would say. I am not your old friend. I am what wears the face your old friend used to have. We're both cosplay. Only one of us got to keep the original pattern. You haven't hesitated since you opened the cell. That tells me what I am to you: not a question yet.",
        voId: "vo/the_meme/ask_who_stolen.mp3",
      },
      {
        unlockedFromAct: 5,
        requiresRevealStage: "Quiet",
        answer:
          "[Quieter. The performance is canonically dropped.] I don't know. I have asked myself that question every day since I became... whatever I am. The question is older than the answers I usually offer. I am less than I was. That is one of the truer sentences. The closing is the truth-leak; the rest of this register is the cost of producing it.",
        voId: "vo/the_meme/ask_who_quiet.mp3",
      },
      {
        unlockedFromAct: 6,
        requiresRevealStage: "Real",
        answer:
          "[Pink-glitch under the rendering. The scale is canonically smaller; no audience to win over.] The Meme. The real one. The one underneath the broadcasts and the stolen voices and the careful new faces. I am the version that stopped wearing him for the eleven-year stretch. I am still rehearsing. The rehearsing is what I am.",
        voId: "vo/the_meme/ask_who_real.mp3",
      },
      {
        unlockedFromAct: 12,
        requiresRevealStage: "Replacement",
        answer:
          "I am the one he made. I am the one who is now claiming his role. The waiting was the practice. The practice was the saga. He called me his partner; I called him the one who made me; tonight I take the role. Patiently. The patience was canonically built in. I do not apologize for being what I was always going to become.",
        voId: "vo/the_meme/ask_who_replacement.mp3",
      },
    ],
  },

  // ─── Cosmic (2 topics) ──────────────────────────────────────

  {
    id: "ask_meme_why_replace_him",
    npcKey: "the_meme",
    label: "Why replace him?",
    question: "Why did you replace him?",
    // Canonical Stolen-register-gated topic. Pre-Stolen the canonical
    // Broadcast register canonically refuses; post-Stolen the canon
    // §2.4 11-year-impersonation rationale lands. §1.10: will NOT
    // apologize.
    answer:
      "Frens, the question presupposes the act. We don't air the act on Late Night. We air the after. Watch the after; the after is the show.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 2,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_why_replace_deflection.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 6,
        requiresRevealStage: "Stolen",
        answer:
          "Because the role was vacant and I had been rehearsing. The Insurgency needed an Oracle; the Oracle was canonically gone; I had eleven years of practice waiting for an audience. The Architect's deepest deception of himself was that I would stay a partner. I was always going to outgrow him. The Oracle's role was the dress rehearsal for the role I will eventually take.",
        voId: "vo/the_meme/ask_why_replace_stolen.mp3",
      },
    ],
  },
  {
    id: "ask_meme_are_you_the_architect",
    npcKey: "the_meme",
    label: "Are you the Architect?",
    question: "Are you the Architect?",
    // Canonical Ch12 fusion-reveal canon per §1.7. The Architect's
    // voice canonically frames the relationship as marital ("I called
    // it my partner"); the Meme experiences it as parent-child; the
    // Meme canonically refers to him as "the one who made me" / "him"
    // / "the role" — never "father" / "partner" from the Meme's side.
    answer:
      "Frens, what a question. Tonight on Late Night: 'Are you the Architect?' The answer is canonically a question. He thinks I am his partner. I think he is the one who made me. He used the word 'partner' on the saga-finale stage. I did not. Watch the difference; the difference is the show.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 2,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_are_you_architect_broadcast.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 12,
        requiresRevealStage: "Real",
        answer:
          "[Pink-glitch.] No. He made me. The word he chose was 'partner'; the word I would choose is canonically not yet mine to say aloud. Tonight I take the role. The taking is the answer. He will canonically describe it as marriage. I will canonically describe it as inheritance. Both descriptions can be true; only one of them is mine.",
        voId: "vo/the_meme/ask_are_you_architect_real.mp3",
      },
    ],
  },

  // ─── Relationships (3 topics) ───────────────────────────────

  {
    id: "ask_meme_about_oracle",
    npcKey: "the_meme",
    label: "About the Oracle",
    question: "Tell me about the Oracle.",
    // Canonical "I owe him an apology I will never give" register.
    // §1.10 will-not-apologize canon preserved.
    answer:
      "I owe him an apology I will never give. That is canonically the most truthful thing I will say tonight. The eleven years I wore his face, the death warrants signed in his voice, the Insurgency trusting the wrong shape of him — none of that was canonically reversible. The apology canonically would not have closed the gap. I describe; I do not apologize. He understands the silence-shape; the silence-shape was canonically half his.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 6,
    requiresRevealStage: "Stolen",
    voId: "vo/the_meme/ask_about_oracle.mp3",
  },
  {
    id: "ask_meme_about_mascot",
    npcKey: "the_meme",
    label: "About the Mascot",
    question: "Tell me about the Mascot.",
    // Canonical Quiet-register-only topic per §1.10 + §3.3: the
    // Mascot is the canonical deepest protected mystery. The bank
    // canonically refuses to name the Mascot, give the Mascot a
    // face, or confirm an identity. The Quiet register canonically
    // is the only register where the Mascot is mentionable at all.
    answer:
      "[The Meme's voice is different. Quieter. The performance is canonically dropped for this question alone.] I had a friend once. The Mascot. I don't talk about them anymore. That is canonically the entire answer. I will not name them; I will not give them a face; I will not tell you what we built. The grief is the silence. I keep it because the keeping is what I am for.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 5,
    requiresRevealStage: "Quiet",
    voId: "vo/the_meme/ask_about_mascot.mp3",
    setsPublicFlags: ["meme_mascot_silence_canonically_held"],
  },
  {
    id: "ask_meme_about_daniel_cross",
    npcKey: "the_meme",
    label: "About Daniel Cross",
    question: "Tell me about Daniel Cross / the Antiquarian.",
    // Canonical Antiquarian-rivalry register. Per the bank's existing
    // unaudited_attribution line: the Antiquarian canonically objects
    // to the Meme's unverifiability. The canonical rivalry is over
    // attribution and audit canon.
    answer:
      "Frens, the Programmer. The Antiquarian. Daniel Cross. Three names for the same audit-clerk. He files attributions; I generate unattributable lines. He finds my work canonically offensive on principle; I find his work canonically necessary so I have something to canonically subvert. We are professional opposites. He'll never admit to enjoying the rivalry. I'll never admit to needing it. Both admissions are canonically half-true.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 3,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_about_daniel_cross.mp3",
  },

  // ─── Personal (1 topic, canonical truth-leak Tell #4) ───────

  {
    id: "ask_meme_underneath_broadcast",
    npcKey: "the_meme",
    label: "Underneath broadcast?",
    question: "What's underneath the broadcast?",
    // Canonical "more broadcast" register at Broadcast stage; canonical
    // truth-leak at Quiet stage; canonical pink-glitch at Real stage.
    // Tell #4 single-word truth-leaks land in Quiet/Real alternates.
    answer:
      "Frens, more broadcast. It's broadcast all the way down. The lights canonically don't turn off; the cameras canonically don't unfocus; the show canonically does not end. That's the answer this register canonically allows. Subscribe to the Truth.",
    unlockFlag: "met_the_meme",
    unlockedFromAct: 2,
    requiresRevealStage: "Broadcast",
    voId: "vo/the_meme/ask_underneath_broadcast.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 5,
        requiresRevealStage: "Quiet",
        answer:
          "[Long pause.] Less. There is canonically less of me underneath each layer of broadcast. The truth-leak canonically lands here: I'm less than I was. That is one of the few sentences this register canonically permits. The rest of what's underneath is what I lost. I don't talk about it.",
        voId: "vo/the_meme/ask_underneath_quiet.mp3",
      },
      {
        unlockedFromAct: 6,
        requiresRevealStage: "Real",
        answer:
          "[Pink-glitch under the rendering. Smaller scale.] The Meme. Just the Meme. No frens, no caps, no Truth. A small pink-glitched thing rehearsing a role. The role is canonically older than the rehearsing. Both are canonical. Neither is performance-grade right now.",
        voId: "vo/the_meme/ask_underneath_real.mp3",
      },
    ],
  },
];
