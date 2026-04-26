/**
 * Card art prompts — RACE faction (5 races × 3 cards = 15 cards).
 *
 * Race cards are NOT tier-up variants — they are 3 discrete cards
 * per race (uncommon → rare → legendary), numbered
 * `s1_race_<name>_01` / `_02` / `_03`. Each race has its own visual
 * language tied to its faction-affiliation:
 *
 *   - human:     baseline pre-Fall stock (faction-neutral)
 *   - demagi:    Hierarchy of the Damned demon-stock (thought_virus)
 *   - quarchon:  Architect's crystalline silicon-based race (architect)
 *   - synthetic: Architect's built-from-scratch entities (architect)
 *   - neyon:     Dischordian successor-humans (faction-neutral)
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const RACE_PROMPTS_LIST: readonly CardArtPrompt[] = [
  // ─── HUMAN RACE — Ark survivor stock, rebirth + provoke ───
  {
    cardId: "s1_race_human_01",
    sceneDelta:
      "Mid-shot. An Ark Survivor in mid-fifties — visibly aged, weather-beaten skin, generic-civilian features, in worn but clean Ark-issue maintenance coveralls (slate-and-cream, with a single small Insurgency-aligned name-patch over the left chest). They stand at a small shop-bench inside an Ark maintenance bay, mid-action of repairing a piece of cryotube life-support equipment. Behind them, a row of Ark cryotubes recedes into mid-distance — the tubes glow with low cool-cyan suspension-light. The Survivor's hands are calm, careful, methodical. A faint cool-cream rebirth-glow surrounds them at body-edge (rebirth visualized — they have already woken up once and they have stopped being surprised by it). Their face is unhurried, focused, slightly weary; on the bench beside them is an open work-log with the day of the week underlined.",
    moodKeywords: [
      "asleep through Atarion burning",
      "woke up eleven years late",
      "working every Wednesday since",
      "unhurried, methodical, slightly weary",
    ],
    palette:
      "Ark slate-and-cream coverall + cool cyan cryotube-glow + warm shop-bench amber + dirty-yellow Ark deck + faint cool cream rebirth-glow",
    composition:
      "Mid-shot front three-quarter, Survivor at frame-centre at workbench, row of cryotubes receding into mid-distance behind",
    notes:
      "Uncommon unit. Generic-civilian face must NOT match any named character (not Locke, not Iron Lion). The 'every Wednesday' detail from flavor is rendered as the open work-log on the bench. Cool-cyan cryotube-glow is the canonical Ark-environment visual idiom established in the Locke Imprint set (post-Fall Ark continuity).",
  },
  {
    cardId: "s1_race_human_02",
    sceneDelta:
      "Mid-shot. A Senate Legionary in mid-thirties, in archaic pre-Fall Atarion Senate-guard armor — bronze-and-leather scale over a deep crimson under-tunic, a tall ceremonial pike-shaft held vertical in their right hand, a small round shield in their left. They stand alone in a wide marble Senate-corridor at the moment BEFORE the Hierarchy's shock troops arrive — the corridor is empty behind them, but the hush of the scene communicates that the moment is held: doors at the far end of the corridor are visibly being hammered from outside, light spilling between the seams. They face the doors squarely. A faint warm provoke-glow rims their pike-shaft (provoke visualized). Their face is composed, knowing — they have already decided how this ends.",
    moodKeywords: [
      "the last physical guard between Elara Voss and the shock troops",
      "did not survive the meeting — the vote did",
      "doors being hammered from outside",
      "already decided how this ends",
    ],
    palette:
      "Atarion Senate marble cool-cream + bronze-and-leather Legionary armor + deep crimson under-tunic + warm pike-shaft provoke-rim + cool corridor depth-haze + warm spill-light through doors",
    composition:
      "Mid-shot front three-quarter, Legionary at frame-centre alone in corridor, doors being hammered at upper-third deep background",
    notes:
      "Rare unit. Canon: the day Atarion voted for the war (Genesis-era event, fully revealed by end of Epoch 2). Generic-Legionary face must NOT match any named character. Senate-corridor is direct lore-tie to Elara Voss's Atarion. The deliberate doors-being-hammered framing makes the 'they did not survive but the vote did' flavor visible without showing the actual death.",
  },
  {
    cardId: "s1_race_human_03",
    sceneDelta:
      "Wider mid-shot. A single cryotube at the far end of a long Ark cryo-vault hallway — the tube is the Final Potential's, the LAST one in the row, faintly different from all the others (slightly brighter cool-cyan suspension-light, a faint warm-amber rebirth-glow already pulsing UNDERNEATH the cryo-frost on the glass, the indicator-light at top reading the SECOND-TO-LAST stage of cryo-readiness — almost ready to wake, but not yet). Inside the tube, the silhouette of a sleeping human is just barely visible through the frost — gender, ethnicity, age all DELIBERATELY indeterminate and unreadable. Around the tube, a faint warm provoke-glow rim and faint cool rebirth-cream underfoot. Behind, the hallway extends back toward the camera with NINE thousand more identical tubes receding into deep distance, each holding their own indeterminate silhouette. Above the Final Potential's tube, a single warm heal-glow halo (heal-5 on deploy visualized as the saga's wake-up-call already arriving).",
    moodKeywords: [
      "ten thousand humans asleep in the cryo vaults",
      "the Saga has elected to wake them last",
      "the saga already knows which one — and it is not yet time",
      "indeterminate silhouette through frost",
    ],
    palette:
      "Ark deep cool-cyan cryotube + warm amber rebirth-glow underneath + cool corridor depth + warm provoke-rim + warm heal-halo + dirty-yellow Ark deck-plates",
    composition:
      "Wider mid-shot, Final Potential's tube at frame-centre at hallway end, nine-thousand identical tubes receding into deep distance",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: the Final Potential's identity is DELIBERATELY UNREADABLE — gender, ethnicity, age must NOT be visually determined. This card represents the un-arrived-at savior figure; the Saga has not yet elected to wake them. The single-cryotube-among-many composition echoes the 'the one the Saga already knows' framing from flavor. The cool-cyan cryo-vault visual continuity ties to Locke Imprint set.",
  },
] as const;

/**
 * Race faction's prompt registry, keyed by card id.
 *
 * Currently populated: 1 / 5 races (Human).
 * TODO: demagi, neyon, quarchon, synthetic.
 */
export const RACE_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(RACE_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
