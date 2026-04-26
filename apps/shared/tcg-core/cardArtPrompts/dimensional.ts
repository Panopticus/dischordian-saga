/**
 * Card art prompts — DIMENSIONAL faction (4 dimensions × 3 cards = 12 cards).
 *
 * Dimension cards are NOT tier-up variants — they are 3 discrete
 * cards per dimension (uncommon → rare → legendary), numbered
 * `s1_dim_<dimension>_01` / `_02` / `_03`. Each dimension has its
 * own faction-affiliation:
 *
 *   - time:        Antiquarian (grow + rebirth + on_turn_start)
 *   - space:       Neutral (airdrop + celerity + rush)
 *   - probability: Dreamer (card draw + mana refund + flicker)
 *   - reality:     Architect (silence + dispel + control)
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const DIMENSIONAL_PROMPTS_LIST: readonly CardArtPrompt[] = [
  // ─── TIME DIMENSION — Antiquarian, grow + rebirth ───
  {
    cardId: "s1_dim_time_01",
    sceneDelta:
      "Mid-shot. A Moment Keeper — a woman in her sixties, slightly stooped, in Antiquarian-amber filing-clerk's apron and reading-glasses on a chain, generic-Antiquarian-staff features. She works at a tall Antiquarian filing-cabinet wall, mid-action of placing a single small folded paper-slip (a 'moment' rendered as a discrete physical object — a square of warm cream paper with faint script on it) into a labeled drawer. The drawer is slightly half-open, revealing dozens of similar slips already filed. Around her, a faint warm cream-amber grow-pulse propagates outward (grow visualized — she gets larger the longer anybody forgets she is there). The room is quiet, half-lit; a single low desk-lamp at lower-right. Her face is calm, slightly tired, methodical.",
    moodKeywords: [
      "takes the moment the opponent was not using and files it",
      "gets larger the longer anybody forgets she is there",
      "Antiquarian filing-cabinet wall",
      "calm, slightly tired, methodical",
    ],
    palette:
      "Antiquarian amber + warm cream paper-slips + warm reading-light desk-lamp + cool deep-shadow + faint warm grow-pulse + Antiquarian-staff-apron leather-brown",
    composition:
      "Mid-shot front three-quarter, Moment Keeper at frame-centre at filing-cabinet, drawer half-open, desk-lamp at lower-right",
    notes:
      "Uncommon unit. Antiquarian-amber palette ties to the broader Antiquarian Allegiance set — same archive-environment visual language. Generic-Antiquarian-staff face must NOT match The Antiquarian himself (he is the master of the institution, this is one of his clerical staff). The 'moment as a folded paper-slip' is the canonical visualization of moments-as-filed-objects.",
  },
  {
    cardId: "s1_dim_time_02",
    sceneDelta:
      "Wider mid-shot. A Loop Walker — a man in his forties, generic-Antiquarian-scholar features, standing in a long Antiquarian corridor with a single arched doorway visible at frame-centre mid-distance. He is mid-stride, walking AWAY from the doorway (toward camera), but the visual composition shows the SAME doorway with the SAME man simultaneously walking THROUGH the doorway from the other side (a faint translucent doubled-image — the rebirth visualized as the same person crossing the same threshold in TWO temporal positions at once). One image is solid, the other slightly translucent. A faint warm cream-amber grow-pulse propagates outward from the solid image. The corridor itself is plain Antiquarian-amber stone. The man's face is calm, almost amused — this is routine for him.",
    moodKeywords: [
      "dies and walks out of the same door he walked in",
      "the one over there that you are looking at right now",
      "calm, almost amused — routine",
      "doubled-image of the same person at the same threshold",
    ],
    palette:
      "Antiquarian amber stone corridor + warm cream-amber grow-pulse + faint translucent doubled-image + cool deep-corridor depth + warm doorway-light",
    composition:
      "Wider mid-shot front three-quarter on solid Walker, doorway at frame-centre mid-distance, translucent doubled-image at doorway",
    notes:
      "Rare unit. The doubled-image at the threshold is the canonical visualization of rebirth-as-temporal-loop (consistent with the Antiquarian-faction's relationship to time). Generic-scholar face must NOT match The Antiquarian himself or any specific named character. Antiquarian corridor visual continuity.",
  },
  {
    cardId: "s1_dim_time_03",
    sceneDelta:
      "Wider mid-shot. The Hour-Unmaker — a tall figure in Antiquarian senior-archivist robes (the deepest Antiquarian-amber, with multiple time-related symbols embroidered along the hem in dark thread). He stands at the centre of a vast circular Antiquarian time-vault — a chamber whose walls are entirely lined with HOURS rendered as discrete brass-and-glass hour-canisters, each canister labeled, each containing visible warm-cream temporal substance. He holds one such canister in his hand and is mid-action of UNCAPPING it; from the open canister, a slow visible warm-cream pulse drifts outward, becoming the very air of the chamber. A translucent green-tinted forcefield-shimmer wraps him (forcefield); a faint warm grow-pulse propagates outward from his body; a faint translucent rebirth-doubled-edge runs along his outline (rebirth). His face is composed, ancient, slightly mischievous — he is enjoying himself. The chamber's lighting is warm cream-amber from the canister-substance itself, no other light source.",
    moodKeywords: [
      "a list of hours that nobody has yet agreed to spend",
      "spending them on the match you are playing",
      "the match is taking longer on his side than yours",
      "ancient, slightly mischievous",
    ],
    palette:
      "Antiquarian deep-amber senior-archivist robes + warm cream-amber temporal-substance + brass-and-glass hour-canisters + translucent green-tinted forcefield + warm grow-pulse + Antiquarian-amber chamber-light",
    composition:
      "Wider mid-shot front three-quarter, Hour-Unmaker at frame-centre uncapping canister, circular vault wall of canisters extending outward",
    notes:
      "Legendary unit. The 'hours as brass-and-glass canisters' is the canonical Antiquarian time-archive visualization — extending the Antiquarian-faction's catalog-of-everything visual language to time itself. Generic-ancient face must NOT match The Antiquarian himself — this is a senior-archivist, not the master. Three keywords (grow + rebirth + forcefield) rendered as three distinct visual elements simultaneously.",
  },

  // ─── SPACE DIMENSION — Neutral, airdrop + celerity + rush ───
  {
    cardId: "s1_dim_space_01",
    sceneDelta:
      "Mid-shot. A Parallax Walker — a young female-presenting figure, generic-mixed features, mid-arrival on a low rocky plateau. Her body is fully present but the SURROUNDING air immediately around her shows faint translucent ghost-trails of where she WAS — her silhouette doubled and tripled in fading translucent layers extending behind her, but the layers are not motion-trails (she did not walk this distance) — they are SPATIAL DISPLACEMENT. The distance closed itself, not her crossing of it. She wears practical traveling-clothes in cool-cream-and-dark-leather. A faint translucent airdrop-shimmer (cool-cream ripple) wraps her at body-edge — she has just dropped IN. Her face is composed; her boots are dust-free (she did not walk here). Behind her, the rocky plateau shows no footprint trail.",
    moodKeywords: [
      "she does not walk to where she needs to be",
      "the distance agreed to close itself",
      "ghost-trails are spatial displacement, not motion",
      "boots dust-free, no footprint trail",
    ],
    palette:
      "Cool-cream-and-dark-leather traveling-clothes + faint translucent ghost-trail layers + cool airdrop-shimmer + warm rocky plateau + cool deep-distance",
    composition:
      "Mid-shot front three-quarter, Walker at frame-centre with translucent ghost-trail layers extending behind, plateau ground unmarked",
    notes:
      "Uncommon unit. The 'distance agreed to close itself' is rendered as ghost-trail layers (NOT motion-trails) and the dust-free boots / unmarked ground. Generic-mixed-young features must NOT match any named character. Cool-cream-translucent airdrop-shimmer is the canonical airdrop visual idiom.",
  },
  {
    cardId: "s1_dim_space_02",
    sceneDelta:
      "Mid-shot. A Folded Distance — a humanoid figure (anonymous, in cool-cream-and-dark-leather practical wear, generic-mixed features) caught at the moment of a SIMULTANEOUS attack from two locations. The figure's body is at frame-centre mid-strike (long sword in mid-arc). At frame-LEFT, a faint translucent SECOND copy of the figure is visible at the same moment of strike, attacking the same target from a different angle. At frame-RIGHT, a faint translucent THIRD copy of the figure is shown in a different posture entirely — APOLOGIZING (one hand raised palm-out, head slightly bowed) — the third place where the apology happens while the attack happens in two. Faint cool airdrop-shimmer rings around all three copies; faint cool celerity after-image trails behind each strike. The implied target is anonymous and at lower-frame-right. NO faces visible on any copy (back-three-quarter or partial-profile only).",
    moodKeywords: [
      "the same attack delivered in two places",
      "while the attacker apologizes in the third",
      "three copies, no faces",
      "spatial folding rendered as simultaneous-presence",
    ],
    palette:
      "Cool-cream-and-dark-leather traveling-wear + cool airdrop-shimmer rings + cool celerity after-images + warm anonymous target at lower-right + cool deep-shadow",
    composition:
      "Mid-shot, three copies of figure across the frame (centre solid, left translucent, right translucent), implied target at lower-right",
    notes:
      "Rare unit. The three simultaneous copies (two attacking, one apologizing) is canon-direct from flavor. Anonymous figures (no faces) preserve no-character-conflation. Airdrop visualized as ring-shimmer around each copy.",
  },
  {
    cardId: "s1_dim_space_03",
    sceneDelta:
      "Wider mid-shot. The Cartographer of Elsewhere — a man in his fifties at a desk at a rooftop terrace open to the sky. He sits at the desk, mid-action of WRITING a letter (quill in hand, an open warm-cream parchment in front of him). Above the desk, faint translucent paper-letters drift in MID-AIR as if mid-conversation — letters arriving from all directions. Each arriving letter has on it a small visible MAP-FRAGMENT (a hand-drawn topographical sketch). The sky above the terrace is open dawn-rose at golden-hour. Around him, faint cool airdrop-shimmer + cool celerity after-images on his writing hand + faint cool wind-trails behind his shoulders (flying) + faint warm cream rush-trails at the base of the chair (rush-on-deploy). His face is generic-scholar, attentive, listening to the letters as much as writing them. His desk is plain Antiquarian-amber wood; the warm reading-lamp at lower-right.",
    moodKeywords: [
      "he writes letters to places, and the places answer",
      "the answers are the maps",
      "letters arriving from all directions with map-fragments",
      "listening to the letters as much as writing",
    ],
    palette:
      "Antiquarian-amber desk + warm cream parchment + warm dawn-rose sky + cool airdrop-shimmer + cool celerity after-images + warm rush-trails + warm lamp + cool wind-trails",
    composition:
      "Wider mid-shot front three-quarter, Cartographer at frame-centre at desk on rooftop terrace, drifting letters above desk",
    notes:
      "Legendary unit. The 'letters that answer with maps' is canon-direct from flavor — rendered as the drifting map-fragmented arrival-letters. Four keywords/effects (airdrop + celerity + flying + rush) rendered as four distinct visual elements simultaneously. Generic-scholar face must NOT match any named character.",
  },

  // ─── PROBABILITY DIMENSION — Dreamer, draw + mana refund + flicker ───
  {
    cardId: "s1_dim_prob_01",
    sceneDelta:
      "Mid-shot. An Outcome Gambler — a Dreamer-school woman in mid-thirties at a low Dreamer-divination table, generic-mixed features, in cream-and-violet Dreamer-apprentice robes. Spread across the table in front of her are FACE-DOWN cards (a tarot-like Dreamer-divination spread), but a faint translucent ghost-image of EACH CARD already shows its face above the physical card (the prediction-already-made, before the draw). She has just turned over ONE card; the warm slip of paper drifting up from above her shoulder (draw-1 visualized) MATCHES the ghost-image she had already predicted. Her face is calm, slightly satisfied — every card she draws is one she had already bet on. Faint Dreamer aurora-violet ambient light from the table's surface; Dreamer-sanctum behind in mid-distance.",
    moodKeywords: [
      "every card she draws is one she had already bet on",
      "before the match started",
      "translucent ghost-image of each card above the physical card",
      "calm, slightly satisfied",
    ],
    palette:
      "Dreamer cream-and-violet apprentice-robes + aurora-violet table ambient + warm cream tarot-cards + faint translucent ghost-images + warm amber paper-drift + Dreamer-sanctum depth",
    composition:
      "Mid-shot front three-quarter, Gambler at frame-centre at low table, card-spread visible at lower-third with ghost-images above each card",
    notes:
      "Uncommon unit. Dreamer-sanctum visual continuity with Dreamer Allegiance set. The 'prediction-already-made before the draw' framing is rendered as the ghost-images above face-down cards. Generic-Dreamer-apprentice face must NOT match any named character.",
  },
  {
    cardId: "s1_dim_prob_02",
    sceneDelta:
      "Mid-shot. A Bayes Adept — a Dreamer-school woman in mid-forties, generic-thoughtful features, in fuller Dreamer-scholar robes, standing at a tall Dreamer-sanctum lectern. Open before her on the lectern is a thick PROBABILITY-LEDGER — the pages visibly UPDATING in real time (translucent text fragments fading away as new translucent text fragments fade in over them). The viewer can SEE her priors updating: a previous probability-graph at left of the page is fading; a new updated graph at right is materializing. Her hand is mid-gesture above the page, palm-down, as if conducting the update. Three warm slips of paper drift up from above her shoulder (draw-3 visualized). Her face is composed but the visible REAL-TIME update of her ledger gives the scene its terror — watchers know they are witnessing the model getting smarter while they watch. Behind her, Dreamer-sanctum architecture in cool aurora-violet.",
    moodKeywords: [
      "updates her priors in public",
      "you can watch the update happen in real time",
      "which is terrifying",
      "fading old graph, materializing new graph",
    ],
    palette:
      "Dreamer fuller-scholar cream-and-violet robes + warm cream parchment + cool aurora-violet sanctum-lectern + faint translucent fading-text + warm amber paper-drifts + Dreamer-sanctum depth",
    composition:
      "Mid-shot front three-quarter, Adept at frame-centre at lectern, ledger-page mid-update at lower-third",
    notes:
      "Rare spell. The 'real-time prior update visible on the page' is the canonical visualization of the Bayes-update mechanic. Generic-Dreamer-scholar face must NOT match any named character. Dreamer-sanctum visual continuity preserved.",
  },
  {
    cardId: "s1_dim_prob_03",
    sceneDelta:
      "Wider mid-shot. The Sum Over Histories — a Dreamer-school figure of indeterminate gender at the centre of a vast Dreamer cosmology-chamber. Around the figure, dozens of faint translucent versions of THE CURRENT MATCH play out simultaneously in mid-air — each version is a small floating ghost-board with different unit-positions, different remaining-life counts, different damage-dealt patterns. The figure stands at the chamber-centre, both arms slightly raised in a wide observational gesture. Their face is calm, open, KIND — they have seen every version, and they know it doesn't help to share which version is real. Faint cool wing-shape projection-echoes (flying as Dreamer projection-echo, NOT literal wings) trail behind their shoulders. Faint translucent dispel-ripples around their hands. Three warm slips of paper drift up from above (draw-3); a faint warm-amber mana-pulse propagates downward into the chamber-floor (gain-2-mana-this-turn visualized). The chamber is cool aurora-violet with deep-distance silver-mist haze.",
    moodKeywords: [
      "the only entity who has seen every possible version",
      "she is kind about it",
      "she does not tell you which version you are in",
      "calm, open, kind",
    ],
    palette:
      "Dreamer cream-and-violet full robes + cool aurora-violet cosmology-chamber + dozens of translucent ghost-board versions + cool wing-shape projection-echoes + translucent dispel-ripples + warm amber paper-drifts + warm-amber mana-pulse + silver-mist deep-distance",
    composition:
      "Wider mid-shot front three-quarter, figure at frame-centre with arms raised, dozens of small ghost-boards floating in mid-air around them",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: this figure is NOT The Oracle (the Dreamer-faction's master is in suspended processing-loop and cannot be directly rendered). The Sum Over Histories is a separate Dreamer-cosmology entity — generic-indeterminate features, kind expression. Three keywords (flying-as-projection + dispel + draw + mana) rendered as four distinct visual elements. The 'she does not tell you which version' is rendered as the kindness — the gift is the silence.",
  },
] as const;

/**
 * Dimensional faction's prompt registry, keyed by card id.
 *
 * Currently populated: 3 / 4 dimensions (Time, Space, Probability).
 * TODO: reality.
 */
export const DIMENSIONAL_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(DIMENSIONAL_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
