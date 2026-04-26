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
] as const;

/**
 * Dimensional faction's prompt registry, keyed by card id.
 *
 * Currently populated: 1 / 4 dimensions (Time).
 * TODO: space, probability, reality.
 */
export const DIMENSIONAL_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(DIMENSIONAL_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
