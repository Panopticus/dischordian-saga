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

  // ─── DEMAGI RACE — Hierarchy demon-stock, drain + deathwatch + provoke ───
  {
    cardId: "s1_race_demagi_01",
    sceneDelta:
      "Mid-shot. A Demagi Footsoldier — humanoid build but visibly NOT human: charcoal-grey hide, a low-set ridge of dark keratinous spines along the shoulders, eyes that read as small gold-flecked black voids, a jaw with two small downward-curving lower tusks. They wear Hierarchy-issue dark-iron field-armor with a single dirty-bronze sigil over the chest. They stand at a Hierarchy-of-the-Damned holding-yard, mid-action of accepting payment from an unseen paymaster — a small clay-cup is held in their hand, half-full of a luminous black ichor (the 'feeling' the engagement generated, made literal). Faint cool drain-glow rims their armor's leading edge (drain visualized — they feed on what they take). Their face is matter-of-fact, professional, the kind of expression a worker has when payday arrived on schedule. Behind them, two more Demagi footsoldiers wait their turn at the paymaster's window.",
    moodKeywords: [
      "paid in whatever feeling the engagement generates",
      "the payroll is always on time",
      "matter-of-fact, professional",
      "luminous black ichor in a clay cup",
    ],
    palette:
      "Thought Virus phosphor-green and black + Hierarchy dirty-bronze + dark-iron armor + cool drain-glow rim + warm holding-yard sodium-light + charcoal-grey demagi hide",
    composition:
      "Mid-shot front three-quarter, Footsoldier at frame-centre with cup, two more Demagi at lower-third behind",
    notes:
      "Uncommon unit. Generic-Demagi face — must communicate 'demon-stock' without leaning on cliché horns/red-skin tropes. The black-ichor-in-clay-cup is the canonical visualization of the 'paid in feelings' mechanic. Faction is thought_virus per definition; palette uses Thought Virus phosphor-green as accent.",
  },
  {
    cardId: "s1_race_demagi_02",
    sceneDelta:
      "Mid-shot. A Demagi Corpse-Reader — older female-presenting Demagi with lined charcoal hide, sharper jawline and longer lower tusks than a footsoldier. She wears the dark-iron forensic-accountant's robe of the Hierarchy — hooded but the hood is back, revealing greying spine-ridges. She kneels at a battlefield's edge over a freshly-fallen body (the body deliberately rendered as anonymous and partly off-frame at lower-right — only the body's leg and the edge of its armor visible). One of her hands rests palm-down on the body's chest; the other holds a bound ledger half-open. Across the page, her writing in dark Hierarchy-script glows faintly cool-green where the deathwatch ledger registers a new line-item. A faint cool drain-glow rims her hand on the body. Her eyes are sharp, professional, attentive — every death is data.",
    moodKeywords: [
      "the Hierarchy's forensic accountants",
      "every death on the board is a line item",
      "a ledger only she knows how to audit",
      "every death is data",
    ],
    palette:
      "Thought Virus phosphor-green ledger-glow + dark Hierarchy iron-robe + charcoal-grey demagi hide + cool drain-rim + dirty-bronze accent + warm battlefield-dusk hue + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Corpse-Reader kneeling at frame-centre with ledger, anonymous fallen body partially in lower-right",
    notes:
      "Rare unit. Anonymous body preserves spoiler-discipline (no specific named character is being audited). The phosphor-green ledger-script is the Thought Virus / Hierarchy textual visual idiom. Generic-female-Demagi features — must NOT match any named character.",
  },
  {
    cardId: "s1_race_demagi_03",
    sceneDelta:
      "Wider mid-shot. Xeth'Raal, Demagi Archlord — a tall, broad-shouldered male Demagi with deep-charcoal hide, an elaborate crown-of-spines along the brow, two long curved lower tusks, eyes the colour of dirty-bronze with a single luminous gold pupil-line down each. He wears full Hierarchy archlord ceremonial-iron armor — heavy plate over his chest with the Hierarchy's full sigil engraved, a long dark-iron cape. He stands in his private war-room, one gauntleted hand resting casually on the corner of an open strategic playbook on a low table — the playbook is the SAME ONE he sent to Agent Zero that arranged the Game Master's death (kept for sentimental reasons). His other hand holds nothing; his posture is relaxed-confident, the posture of someone who has planned thirty-three of the last forty wars and won twenty-nine of them. A faint cool drain-glow rims his armor; faint cool deathwatch-script (phosphor-green) drifts up from the playbook; a faint warm provoke-glow rims his foreground gauntlet. His face is half-amused.",
    moodKeywords: [
      "arranged the Game Master's death by sending Agent Zero his playbook",
      "kept a copy for sentimental reasons",
      "half-amused, relaxed-confident",
      "thirty-three of the last forty wars",
    ],
    palette:
      "Thought Virus phosphor-green + Hierarchy ceremonial-iron + deep-charcoal hide + dirty-bronze pupil-line + cool drain-rim + warm war-room sodium-light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Xeth'Raal at frame-centre with hand on playbook, war-room map-table at lower-third",
    notes:
      "Legendary unit. Canon: Xeth'Raal arranged Game Master's death by leaking strategic playbook to Agent Zero (Epoch 2 reveal in Agent Zero Imprint set lore). The retained playbook is the canonical 'sentimental reasons' detail. Three keywords (drain + deathwatch + provoke) rendered as three distinct visual elements. Generic-Archlord face must NOT match any named playable Hierarchy character.",
  },
] as const;

/**
 * Race faction's prompt registry, keyed by card id.
 *
 * Currently populated: 2 / 5 races (Human, Demagi).
 * TODO: neyon, quarchon, synthetic.
 */
export const RACE_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(RACE_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
