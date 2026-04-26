/**
 * Card art prompts — CLASS faction (6 sets × 5 cards = 30 cards).
 *
 * Class cards are NOT tier-up variants of a single identity — they
 * are 5 discrete cards per class (assassin / engineer / neyon /
 * oracle / soldier / spy), numbered `s1_class_<name>_01` through
 * `_05`, with mixed card types (unit + spell). The progression
 * across the 5 cards is mechanical (cost + power escalates) but the
 * CARDS represent distinct entities (e.g. assassin_01 = "Glass
 * Blade Initiate", assassin_05 = "Akai Shi's First Apprentice").
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 *
 * Faction-affiliation per class (varies by card within a class):
 *   - assassin: insurgency-affiliated mostly, top-tier architect
 *   - engineer: antiquarian-affiliated mostly
 *   - neyon: thought_virus-aligned (the post-Source neyonic
 *     transformation pattern)
 *   - oracle: dreamer-affiliated
 *   - soldier: insurgency / new_babylon mix
 *   - spy: architect / insurgency mix (loyalty in either direction)
 */

import type { CardArtPrompt } from "./types";

const CLASS_PROMPTS_LIST: readonly CardArtPrompt[] = [
  // ─── ASSASSIN CLASS — backstab + celerity discipline ───
  {
    cardId: "s1_class_assassin_01",
    sceneDelta:
      "Mid-shot. A Glass Blade Initiate at an Insurgency training-yard at dusk — late teens, tied-back hair, plain training-leathers, holding a clear glass training-blade across both palms in inspection-stance. The blade catches the warm amber yard-light at one edge; the rest of the blade is half-translucent. Behind them, a row of similar Initiates stands at attention in mid-distance, each holding their own glass blade. The instructor stands off-frame; we infer their presence from the Initiate's focused-attentive posture. Backstab visualized as the geometry of the blade-presentation: the Initiate is showing the blade to the off-frame teacher AS the back-of-its-edge is what they will be using.",
    moodKeywords: [
      "the glass blade in inspection-stance",
      "training-yard dusk",
      "the blades that shatter on impact",
      "instructor implied off-frame",
    ],
    palette:
      "Insurgency slate-blue dusk + signal-green telltale at training-yard perimeter + warm amber yard-lamps + clear glass + a single saturated red on the Initiate's training-leather strap",
    composition:
      "Mid-shot front three-quarter, Initiate at frame-centre with blade in palms, line of fellow Initiates at lower-third, training-yard perimeter behind",
    notes:
      "T1-equivalent assassin card. Generic-young face. Glass blade is canonical lore (instructors hand them out anyway because students who learn this are the ones who stop needing the second strike).",
  },
  {
    cardId: "s1_class_assassin_02",
    sceneDelta:
      "Action mid-shot. A figure in dark Insurgency tactical gear is mid-strike on a target's back — three-quarter from camera-right, the strike is 80% complete, the target (anonymous Panopticon-armored figure) is just beginning to turn. The strike is a curved short-blade penetrating the target's armor at the gap between collar and shoulder. The first half of the move was SILENT — visualized as the scene's deliberate hush, no sound-impact lines, no kinetic-burst graphics, just the geometry of the strike. The second half is an APOLOGY — visualized as a faint warm-amber haze rising from the strike-point, but the apology is not directed at the target; it drifts AWAY from them, off-frame. Spell card visualization: deal 4 damage to enemy general, rendered as the silent-strike beat.",
    moodKeywords: [
      "the first half silent, the second half an apology",
      "the apology not to you",
      "mid-strike, target just turning",
      "warm-amber haze drifting away from impact",
    ],
    palette:
      "Insurgency slate + signal-green telltale on the strike-figure's belt + cool grey Panopticon armor + a single warm amber apology-haze + saturated red blade-edge",
    composition:
      "Mid-action, strike-figure at upper-right third mid-strike, target at lower-left third just turning, blade at frame mid-axis",
    notes:
      "Spell card. The 'apology not to you' beat is canonical lore — visualized as the apology-haze drifting AWAY from the target rather than toward them. Strike-figure face is in shadow under hood.",
  },
  {
    cardId: "s1_class_assassin_03",
    sceneDelta:
      "Mid-shot. A Witness Remover stands centred in a small Babylonian audit-chamber-aftermath — three other anonymous figures (witnesses) are visible at the chamber's edges, each in mid-collapse-into-silence posture, the Witness Remover already pivoting to the next angle. Twin curved knives extended at low-third. Their face is partially shadowed under a dark hood; the small slice of visible expression is calmly mathematical. Backstab + celerity visualized as the trinity of motion-ghost residues: faintly visible behind the Witness Remover, two pale-blue chromatic-aberration ghosts trace the path between previous strike-positions. They do not know any other kind of math: the math is 'how many witnesses, how many strikes, complete in one breath.'",
    moodKeywords: [
      "a second strike is what you spend",
      "cannot afford to leave a witness",
      "calmly mathematical",
      "trinity of motion-ghost residues",
    ],
    palette:
      "Insurgency slate audit-chamber + signal-green telltales + cool grey witnesses + chromatic-aberration cyan-magenta ghosts + saturated red on the twin blade-edges",
    composition:
      "Mid-shot, Witness Remover at frame-centre pivoting, three anonymous witness-silhouettes at chamber edges in mid-collapse, motion-ghosts behind",
    notes:
      "Unit card. Backstab + celerity. Three witness-silhouettes are anonymous — no recognizable named characters. Faction-distinct from Akai Shi t3 (his celerity = lateral parallel-strike on one target; Witness Remover's celerity = serial-strike across multiple targets in one breath).",
  },
  {
    cardId: "s1_class_assassin_04",
    sceneDelta:
      "Tight composition. A single assassin in three-quarter from BEHIND, mid-stride into a doorway opening on a brilliantly-lit Babylonian council-room. Their hood is up; we see only the back of their coat and the very edge of their right cheek (the Protocol-sentence is mid-syllable on their lips, but no sound emerges from the frame). The room beyond the doorway is FULL — six anonymous council-figures around an obsidian table. The viewer perceives that the assassin is already SAYING the single sentence — visible as a faint warm-amber thread of light extending from the assassin's lips across the room toward an unseen point. NO OTHER BODY IN THE FRAME has heard the sentence yet, because in a moment they will all become part of it. Spell card: deal 7 damage to enemy general.",
    moodKeywords: [
      "a single sentence said out loud",
      "nobody has ever reported hearing the sentence",
      "everyone who would have heard it is part of the sentence",
      "the warm-amber thread mid-utterance",
    ],
    palette:
      "Insurgency slate doorway + brilliant Babylon-gold council-room beyond + warm amber sentence-thread + cool grey council-silhouettes + a single saturated red on the assassin's right-cheek edge",
    composition:
      "Tight three-quarter from behind, assassin at frame-centre at doorway, council-room six-silhouette table at upper-third through doorway",
    notes:
      "Spell card. The Protocol-sentence-as-warm-amber-thread is the visual translation of the canonical 'the sentence has already begun' beat. Council-silhouettes anonymous. NO recognizable named character at the council-table.",
  },
  {
    cardId: "s1_class_assassin_05",
    sceneDelta:
      "Hero composition. Akai Shi's First Apprentice — late-twenties, in a dark coat that is almost-but-not-quite the Akai Shi red (it is a deeper crimson-brown, the colour of someone who survived the training the master insisted she could not survive). She stands in three-quarter on a Panopticon high-rooftop at dusk, twin curved blades at her hips. Her face is fully visible: composed, weathered, the small scar at the corner of one eye that is the visible record of nine years ago. Her mouth is closed; she has not spoken in nine years and will not explain why. Backstab + celerity + pierce + rush-on-deploy visualized as the geometry of her stillness — ALL motion is implied, none active. She is the ANTI-version of Akai Shi t5 (Akai Shi t5 = mid-leap mid-strike at maximum saturation; First Apprentice = stillness, almost-not-the-red, the survivor's restraint).",
    moodKeywords: [
      "Red Death does not train apprentices because apprentices survive the training",
      "this one did",
      "has not spoken in nine years and will not explain",
      "the survivor's restraint",
    ],
    palette:
      "Architect deep crimson-brown (DEEPER than Akai Shi's saturated red) + black steel + chrome + slate-blue Panopticon dusk + a single chrome glint on the twin blade-pommels",
    composition:
      "Hero composition on rooftop, Apprentice at frame-centre in three-quarter standing still, twin sheathed blades at her hips, dusk skyline behind",
    notes:
      "Unit card. Faction shift to architect at this tier (canonical: she became Akai Shi's apprentice). Face fully visible — generic-handsome scarred-young-woman; specifically NOT Agent Zero, NOT Elara, NOT any other named female character. Coat colour is deliberately ALMOST-BUT-NOT-QUITE Akai Shi red — visual translation of 'survived the training'.",
  },
] as const;

/**
 * Class faction's prompt registry, keyed by card id.
 *
 * Currently populated: 1 / 6 sets (Assassin).
 * TODO: engineer, neyon, oracle, soldier, spy.
 */
export const CLASS_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(CLASS_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
