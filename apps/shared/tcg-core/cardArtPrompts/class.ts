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
 *   - neyon: meta-class — hybrid practitioner who has mastered
 *     three or more of the other five classes; visual language
 *     is layered class-markers (spy + oracle, soldier + assassin,
 *     etc.) NOT neyonic mutation. Faction-neutral.
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

  // ─── ENGINEER CLASS — draw + mana-refund discipline ───
  {
    cardId: "s1_class_engineer_01",
    sceneDelta:
      "Mid-shot. A small Workshop Drone (the Engineer's smaller version of himself) at the Engineer's workbench from his Imprint t1 — but the camera is now lower, and the drone is the SUBJECT. The drone is approximately knee-high to a human, brass-and-glass clockwork, wearing a tiny leather apron in deliberate echo of the Engineer's own. Two articulating arms with gripper-pincers; a single brass-and-glass goggle-eye on the front of its body (oversized for its head, exactly the way the Engineer's own goggles are oversized). It is mid-task, holding a small clockwork sub-component up to the warm amber workbench-light for inspection. Behind it, slightly out-of-focus, the Engineer's larger workbench legs and the bottom of his apron. Draw-1 visualized as a fresh slip of paper drifting up from the drone's gripper toward the camera.",
    moodKeywords: [
      "the smaller version of himself",
      "knee-high brass-and-glass",
      "oversized goggle-eye echoing the master",
      "the drifting slip of paper",
    ],
    palette:
      "Antiquarian amber workbench + brass clockwork drone + warm leather apron + a single saturated bright accent on the inspection-component + cool blue depth-haze",
    composition:
      "Mid-shot at workbench, drone at frame-centre at low height, Engineer's legs at upper-third out-of-focus",
    notes:
      "Unit card. Faction-rhyme with The Engineer Imprint t1 — the workbench is the SAME workbench, the apron-language is consistent, the goggle-too-large is preserved at smaller scale. Engineer himself only seen as out-of-focus legs to keep the drone as subject.",
  },
  {
    cardId: "s1_class_engineer_02",
    sceneDelta:
      "Mid-shot. An Insurgency-issue field-emplaced-radio in the foreground at lower-third, mid-modification — the chassis half-open, multiple internal components exposed. A pair of hands extended INTO the frame from camera-right is mid-action of swapping one component for another (slightly different colour, slightly different shape — clearly a custom Engineer-built replacement). The hands wear leather field-gloves with the sleeves of an Engineer-style apron just visible at the wrists. We do not see the Engineer's face — only the hands and the field-emplaced equipment. Above the modification, two faint warm-amber drifts of paper rise (draw-2 visualized) and a single faint cyan-cream pulse propagates outward from the swap-point (gain-1-mana-this-turn visualized as the modification PAYING ITSELF FORWARD in usable energy).",
    moodKeywords: [
      "every invention pays for itself or it is just a mistake with enthusiasm",
      "the hands at the chassis",
      "two paper-drifts and a mana-pulse",
      "Engineer-apron sleeves visible at the wrists",
    ],
    palette:
      "Insurgency slate field-equipment + Engineer-apron leather + warm amber paper-drifts + cool cyan-cream mana-pulse + a single saturated bright accent on the swapped component",
    composition:
      "Mid-shot front close-on hands and equipment, hands extended from camera-right, equipment at lower-third filling visual weight, drifts at upper-third",
    notes:
      "Spell card. Anonymous hands — preserves the Engineer's [CLASSIFIED] identity (only ever seen as legs/hands/back, never face). Faction shift to insurgency-equipment but Engineer-apron sleeves preserve faction-affiliation continuity.",
  },
  {
    cardId: "s1_class_engineer_03",
    sceneDelta:
      "Wider mid-shot. A Kinetic Containment Sink — a brass-and-pipework structure approximately 2 meters tall standing in an Antiquarian workshop annex. The Sink looks like a cross between a small steam-engine and a piece of architectural sculpture: cylindrical brass core with copper pipes spiraling around it in a controlled-chaos pattern, three small glass-windowed pressure-gauges at human-eye height on the camera-side, and a single large copper exhaust-vent at the top emitting a slow steady plume of warm-amber haze. Behind it, three lab walls visibly PATCHED (different masonry colours, different brick-coursing) — the canonical 'patched the walls by telling the kinetic overflow where to go.' Provoke visualized as the Sink's geometric weight: anything entering this room will be channelled through it.",
    moodKeywords: [
      "the week he accidentally invented Rush",
      "lost three lab walls",
      "patched by telling the kinetic overflow where to go",
      "controlled-chaos pipework",
    ],
    palette:
      "Antiquarian amber workshop + brass core + copper pipework + warm amber exhaust-haze + a single saturated rust accent on the three patched-wall sections",
    composition:
      "Wider mid-shot at workshop annex, Sink at frame-centre filling vertical extent, three patched walls behind in mid-distance",
    notes:
      "Unit card. The patched walls are canon-direct from flavor text. NO Engineer in this frame (the structure is the subject, not the builder). Antiquarian workshop visual continuity with Engineer Imprint t3-t5.",
  },
  {
    cardId: "s1_class_engineer_04",
    sceneDelta:
      "Tight composition. A single large Engineer-style blueprint spread flat across an Antiquarian drafting-table — the blueprint itself is the subject, filling 75% of the frame. The blueprint's surface shows precise schematic linework in cool cyan ink on cream paper, depicting a complex unrealized device (deliberately illegible at any zoom — the device is the player's imagination, not the artist's specification). The blueprint's edges curl up slightly from the drafting-table; the corners are weighted by small brass instruments. A single warm pencil rests across one corner mid-margin-note. Draw-3 visualized as three faint amber paper-drifts rising from three different annotation-points on the blueprint. NO human figure in the frame; no hands; no face.",
    moodKeywords: [
      "a design not yet talked out of itself by physics",
      "cool cyan ink on cream paper",
      "deliberately illegible specification",
      "three drifts from three annotation-points",
    ],
    palette:
      "Antiquarian amber drafting-table + cream blueprint paper + cool cyan schematic-ink + brass instrument-weights + warm amber paper-drifts",
    composition:
      "Tight overhead composition on blueprint, blueprint filling 75% of frame, brass instruments at corners, pencil mid-margin",
    notes:
      "Spell card. Specification is INTENTIONALLY illegible at any zoom — the device is the IDEA, not a buildable thing yet. NO Engineer's face / body / hands; the blueprint is the entire subject. Echoes Engineer Imprint t4 sketch-pages-fanning at simpler scale.",
  },
  {
    cardId: "s1_class_engineer_05",
    sceneDelta:
      "Mid-shot. The Engineer's Apprentice — a young figure (mid-twenties, indeterminate gender, generic-young features) at a smaller workbench parallel to the Engineer's. They are mid-construction of an instrument that is RECOGNIZABLY the same instrument the Engineer built (compositionally similar, same brass-and-glass aesthetic) — but built in an entirely DIFFERENT way (different internal architecture, different component sequence, visibly novel). Their face is intent. They have rolled up their sleeves. Two papers float at chest height (draw-2). A faint cyan-cream pulse propagates from the new instrument back toward the workbench (gain-2-mana). The Engineer himself is implied across the room (a faint distant brass-and-glass goggles glint in the deep background, but no face) — observing without intervening. The apprentice has built the same instrument in a different way because the different way is the only thing that will teach them anything the master's way could not already say.",
    moodKeywords: [
      "the same instrument built in a different way",
      "the different way is the only thing that will teach",
      "Engineer observing from across the room without intervening",
      "rolled-up sleeves, intent face",
    ],
    palette:
      "Antiquarian amber workshop + brass apprentice-workbench + cream papers + cool cyan-cream mana-pulse + a single distant warm gold glint (the Engineer's goggles in deep background)",
    composition:
      "Mid-shot at apprentice's workbench, Apprentice in three-quarter centred, the Engineer implied at distant background as a single goggle-glint",
    notes:
      "Unit card. Apprentice face is generic-young — must NOT match any named character (no Programmer, no Elara, no Iron Lion). The Engineer himself is rendered as a single distant background glint to maintain his [CLASSIFIED] identity discipline. Echoes the Engineer Imprint set's workshop-architecture without revealing him directly.",
  },

  // ─── NE-YON CLASS — hybrid discipline (the meta-class) ───
  {
    cardId: "s1_class_neyon_01",
    sceneDelta:
      "Mid-shot. A Hybrid Initiate at the centre of a neutral-grey training-floor — a young figure in mid-twenties, indeterminate gender, generic-mixed features, in plain practice-wear. They wear TWO visibly different class-tokens at once: a cracked-glass shard pendant on a leather cord around their neck (assassin-school) AND a small scrying-mirror tied at their belt (oracle-school) — the two disciplines literally hung side-by-side on the same body. They stand mid-stance — left foot back, right hand half-raised — caught between an oracle's stillness-pose and an assassin's pre-strike crouch. Behind them, two faint chalked floor-circles overlap in a Venn-diagram pattern. A single warm slip of paper drifts up from their open right hand (draw-1 visualized). Their face is calm, attentive, listening to the room.",
    moodKeywords: [
      "the first hybrid move is always spy + oracle",
      "two disciplines on the same body",
      "Venn-diagram floor-circles",
      "calm attentive listening",
    ],
    palette:
      "Neutral cool slate training-floor + warm cream practice-wear + cracked-glass shard at neck (assassin) + cool silver scrying-mirror at belt (oracle) + a single warm paper-drift accent",
    composition:
      "Mid-shot front three-quarter, Initiate at frame-centre, two overlapping floor-circles at lower-third",
    notes:
      "Unit card. Faction-neutral palette is intentional — Ne-Yons belong to NO faction. Two distinct class-tokens (glass shard + scrying mirror) MUST be both visible to communicate the hybrid identity. Generic-mixed features prevent character-conflation.",
  },
  {
    cardId: "s1_class_neyon_02",
    sceneDelta:
      "Mid-shot. A Dual Discipline practitioner mid-leap, captured at the apex of a low arc — feet 30cm off the ground, arms extended in oracle's wide-sight gesture, but the LEFT hand carries a curved short-blade in reverse-grip (assassin's backstab posture). The figure wears a layered light-grey robe-over-tactical — the robe is oracle-school, the under-armor is assassin-school, both visibly worn together. Their eyes are open, focused on a target slightly behind and to camera-left — they have already seen where the target will be (oracle) and they are already past where the target is now (assassin). Faint cool-cream wind-trails behind them suggest the leap; faint warm-amber sight-lines emanate from their eyes toward the off-frame target.",
    moodKeywords: [
      "oracle's sight plus assassin's angle",
      "you know where they will be AND you are already behind them",
      "robe-over-tactical layering",
      "two trails — wind and sight",
    ],
    palette:
      "Neutral cool slate + warm oracle-cream robe + dark assassin-tactical under-layer + cool cream wind-trails + warm amber sight-lines",
    composition:
      "Mid-shot side three-quarter, figure mid-leap at frame-centre, target implied off-frame to camera-left",
    notes:
      "Unit card. The robe-over-tactical layered garment is the visual key to communicating two disciplines worn simultaneously. Sight-lines and wind-trails are deliberately different colours so the viewer parses the two disciplines as two distinct things sitting on the same body.",
  },
  {
    cardId: "s1_class_neyon_03",
    sceneDelta:
      "Mid-shot. A Three-Schools Master in standing-sentinel pose at the centre of a neutral-grey practice-yard. Their stance is a soldier's grounded provoke — feet shoulder-width, weight forward, both hands forward in a wide-block guard. But their LEFT hand carries a curved assassin's short-blade and their RIGHT hand holds a small Engineer-style brass-and-glass instrument (a lateral-motion gauge). They wear a soldier's chest-rig WITH an assassin's hood pushed back AND an Engineer-apron strap visibly tied across the rig. Three faint amber paper-drifts rise from above the brass instrument (draw-1 visualized — the engineer's discipline paying out). Behind them, three faint chalked floor-circles overlap in a triple-Venn pattern. Their face is centred, deliberate, slightly amused — the room is going to wait on them and they know it.",
    moodKeywords: [
      "soldier's formation, assassin's celerity, engineer's draw",
      "the room is going to wait on them",
      "triple-Venn floor-circles",
      "slightly amused, very deliberate",
    ],
    palette:
      "Neutral cool slate practice-yard + warm soldier chest-rig leather + dark assassin hood + Antiquarian amber engineer-apron strap + brass-and-glass instrument + warm paper-drifts",
    composition:
      "Mid-shot front three-quarter sentinel-stance, Master at frame-centre with two visible weapons/instruments, three overlapping floor-circles at lower-third",
    notes:
      "Unit card. THREE distinct class-tokens (chest-rig, hood, apron-strap) plus TWO instruments (blade, brass-gauge) communicate three disciplines simultaneously. The triple-Venn echoes t1's Venn-pattern but expands to three.",
  },
  {
    cardId: "s1_class_neyon_04",
    sceneDelta:
      "Mid-shot. A Syncretic Adept seated cross-legged on a low neutral-grey platform — but the platform floats 40cm above the ground (flying visualized as the platform itself, not the figure). Their hands are open in a wide gesture that reads simultaneously as oracle-blessing and engineer-presentation. They wear a single garment that is no longer parseable as any one school — it is woven from cream, slate, leather, and brass thread all at once, forming patterns that ALMOST resolve into known class-symbols but never quite settle. Two papers float at chest height (draw-2). A faint translucent ring around their head (dispel visualized) ripples outward. Their eyes are half-lidded, in the middle distance — they are not looking at any one thing. Behind them, the chalked floor-circles have multiplied to four, overlapping into a flower-pattern.",
    moodKeywords: [
      "four disciplines in the same body",
      "sentences in a language the rest of the army does not speak",
      "the disciplines have stopped being separate",
      "flower-pattern floor-circles",
    ],
    palette:
      "Neutral cool slate platform + woven-everything garment (cream + slate + leather + brass) + cool translucent dispel-ring + warm amber paper-drifts + cool half-lidded depth-haze",
    composition:
      "Mid-shot front three-quarter seated-cross-legged, platform floating at lower-third, four overlapping floor-circles in flower-pattern below platform",
    notes:
      "Unit card. The garment-pattern that ALMOST resolves but doesn't is the visual key to 'disciplines have stopped being separate things' — they're now one fabric. Floating platform = flying keyword without giving the figure literal wings.",
  },
  {
    cardId: "s1_class_neyon_05",
    sceneDelta:
      "Wider mid-shot. The Five-Schools Avatar standing in a posture that is deliberately, almost suspiciously, RELAXED — leaning slightly against a stone pillar at the edge of a neutral-grey courtyard, one hand in pocket, the other holding a steaming cup of something. They wear a plain dark-grey traveling cloak that obscures all class-markers. Around them, FIVE faint floor-circles glow in a pentagram pattern at their feet — but the circles are subtle, almost hidden by the courtyard's natural texture. Three papers float around their shoulder (draw-3). A faint translucent dispel-ring around them. A single soft cream-coloured rush-glow under their feet (rush visualized as quiet readiness). Above their head, the air is faintly distorted — five overlapping subtle disciplines that the viewer can ALMOST count if they look carefully. Their face is open, friendly, completely casual — they are very good at playing it off.",
    moodKeywords: [
      "they are very good at playing it off",
      "the discipline of not admitting it",
      "five floor-circles hidden in courtyard texture",
      "open, friendly, completely casual",
    ],
    palette:
      "Neutral cool slate courtyard + plain dark traveling cloak + warm steaming-cup accent + faint cream rush-glow underfoot + cool translucent dispel-ring + warm amber paper-drifts",
    composition:
      "Wider mid-shot, Avatar leaning against pillar at frame-right, courtyard extending to frame-left, five subtle floor-circles in pentagram at lower-third",
    notes:
      "Unit card. Class restriction: only players who reached rank 3+ in three other classes unlock this card. The 'playing it off' visual posture is canon-direct from flavor — the cloak HIDES class-markers because the Avatar would never be caught wearing them visibly. This is the inverse of t1 (which displays both tokens openly). Generic-relaxed face must NOT match any named character.",
  },

  // ─── ORACLE CLASS — prophecy + draw + dispel (Dreamer-faction) ───
  {
    cardId: "s1_class_oracle_01",
    sceneDelta:
      "Mid-shot. An Auspex bird — a small Dreamer-aligned divination-bird the size of a kestrel, with luminous silver-mist plumage and eyes that read as small mirror-discs catching aurora-violet light. The bird perches on a Dreamer-apprentice's outstretched wrist (the apprentice is in lower-left of frame, in three-quarter back, in plain Dreamer-cream robe — no face visible). The bird's head is turned to look slightly OFF-frame, intent on something the viewer cannot see. A faint warm slip of paper drifts up from where the bird's wing meets the apprentice's wrist (draw-1 visualized). Behind, a Dreamer training-loft at dawn — wide silver-violet windows, distant shelves of small cages, a single low oil-lamp at lower-right.",
    moodKeywords: [
      "a bird that already knows where the body is",
      "first divination tool the apprentices learn",
      "Dreamer training-loft at dawn",
      "the bird looking off-frame at the future",
    ],
    palette:
      "Dreamer aurora-violet + dawn-rose + silver-mist plumage + warm cream Dreamer-robe + faint warm paper-drift accent + low warm oil-lamp at lower-right",
    composition:
      "Mid-shot, bird at frame-centre on apprentice's wrist (apprentice in lower-left back-three-quarter), training-loft windows behind",
    notes:
      "Unit card. Apprentice's face deliberately hidden (back-three-quarter only) — the bird is the subject, the apprentice is just the perch. Generic-young apprentice posture must NOT match any named character. The Dreamer training-loft echoes the Dreamer Imprint set's environment without revealing The Oracle directly.",
  },
  {
    cardId: "s1_class_oracle_02",
    sceneDelta:
      "Tight composition. A single Prescient Glyph carved into a Dreamer-stone tablet at the centre of the frame — the glyph itself is a circular silver-mist sigil with three nested rings, the outermost faintly catching aurora-violet light, the middle catching dawn-rose, the inner catching pure cream-white. The tablet is laid flat on a low Dreamer-altar; one corner of the tablet has freshly-flaking carved-stone-dust around the glyph's edge (the carving is recent — yesterday). Two faint warm slips of paper drift up from above the glyph, separating slightly as they rise (draw-2 visualized). NO human figure in the frame. The altar's deep background is intentionally out-of-focus — a hint of Dreamer-sanctum architecture but no specific identifying detail.",
    moodKeywords: [
      "a glyph you carved yesterday for today's version of you",
      "fresh stone-dust at the carving's edge",
      "three nested rings of light",
      "spell — no human in frame",
    ],
    palette:
      "Dreamer cream-white altar + silver-mist + aurora-violet outer ring + dawn-rose middle ring + cream-white inner ring + warm amber paper-drifts",
    composition:
      "Tight overhead composition on glyph and tablet, glyph filling 60% of frame, two paper-drifts rising from above",
    notes:
      "Spell card. Echoes Engineer t4 blueprint's no-human framing — the carved object is the entire subject. The 'yesterday's carving for today's need' temporal-loop is the canonical Oracle-school flavour without invoking The Oracle herself. Three nested rings are the Dreamer divination motif.",
  },
  {
    cardId: "s1_class_oracle_03",
    sceneDelta:
      "Mid-shot. A Reader of Tomorrows — a Dreamer-school woman in mid-thirties, indeterminate ethnicity, generic-thoughtful features, in layered Dreamer cream-and-violet robes. She stands at a high arched window of a Dreamer sanctum-tower, the wind catching the outer layer of her robe. Her hands are extended in a wide untangling-gesture — fingers half-spread, palms angled toward each other, as if pulling apart two threads. Between her hands, two faint translucent ribbon-like patterns hover — one cool silver (the enemy's plan), one warm dawn-rose (the enemy's belief in the plan). The ribbons are visibly DIFFERENT from each other and her hands are mid-separating them. Faint silver-mist wing-shapes (flying visualized as projection-echoes around her shoulders, not literal wings) trail behind her. Her face is calm, focused, slightly amused.",
    moodKeywords: [
      "your enemy's plan and your enemy's belief in your enemy's plan are two different things",
      "she can untangle both at once",
      "two ribbons in her hands — silver and dawn-rose",
      "wing-shape projection-echoes",
    ],
    palette:
      "Dreamer cream-violet layered robes + cool silver plan-ribbon + warm dawn-rose belief-ribbon + aurora-violet sanctum-tower depth + silver-mist wing-shapes",
    composition:
      "Mid-shot front three-quarter, Reader at frame-centre with hands extended, sanctum window framing her at upper-third",
    notes:
      "Unit card. The two ribbons in different colours visualize the dispel keyword as 'untangling enemy belief from enemy plan' per flavor text. Wing-shape echoes (not literal wings) preserve the Dreamer flying-as-projection visual language used in the Dreamer Allegiance set. Generic-thoughtful face must NOT match any named character.",
  },
  {
    cardId: "s1_class_oracle_04",
    sceneDelta:
      "Mid-shot. A Dreamer-school practitioner seen FROM THE BACK, seated at a low Dreamer-altar facing a broad mirror that fills the upper-half of the frame. The practitioner is in plain cream Dreamer-robes; their head is tilted slightly forward in concentration. In the mirror's surface, the reflected room is visible — but the reflection is subtly DIFFERENT from the room behind them: in the mirror, the room contains additional figures (silhouettes only — the room's 'opinion' of the practitioner taking visible shape). Three warm slips of paper drift up from above the mirror toward the upper-third of the frame (draw-3 visualized). NO faces visible — practitioner is back-only, mirror-figures are silhouettes only.",
    moodKeywords: [
      "what you see with first sight is the room",
      "what you see with second sight is the room's opinion of you",
      "back-only practitioner facing mirror",
      "mirror-figures as silhouettes",
    ],
    palette:
      "Dreamer cream practitioner-robe + dark Dreamer-altar + cool silver-violet mirror-light + warm dawn-rose silhouette-tinting + warm amber paper-drifts",
    composition:
      "Mid-shot back-three-quarter on practitioner, mirror filling upper-half of frame, paper-drifts rising at upper-third",
    notes:
      "Spell card. Practitioner shown back-only — preserves spoiler-discipline (no face = no character-conflation). The mirror-room-with-extra-figures is the canonical visualization of 'second sight = the room's opinion of you' from flavor. Echoes the Antiquarian's hidden-room motif from the Antiquarian Imprint set without invoking him directly.",
  },
  {
    cardId: "s1_class_oracle_05",
    sceneDelta:
      "Wider mid-shot. The Oracle's Unbroken Signal — a luminous human-shape figure standing on the deck-side of a Dreamer-sanctum (NOT the figure of The Oracle herself, but a SHAPE THE LEAK TAKES — a projected echo of her broadcast given temporary form). The figure is roughly woman-sized, but its outline is partially translucent and its surface ripples with cream-white-and-aurora-violet signal-pattern light. Where a human face would be, there is a broad smooth oval of pure cream-mist with no features — the signal hasn't bothered to render a face because nobody asked it for one. The figure's posture is open-armed, a wide divinatory gesture — caught mid-broadcast. A faint translucent forcefield-ring (forcefield visualized) surrounds the figure at chest height. Two warm slips of paper drift up from above the figure (draw-2 visualized). Faint silver-mist wing-shapes (flying as projection-echo) trail behind. Around the figure, faint translucent ribbons (dispel visualized) untangle in the air. In the deep background, behind a silver-mist wall, a SUGGESTION of suspended silhouette in a processing-loop chamber — never sharp, never identifiable, just the SHAPE of a contained presence.",
    moodKeywords: [
      "the loop is supposed to contain her",
      "it has been leaking since the day it closed",
      "these cards are some of the shapes the leak takes",
      "no face — the signal hasn't bothered",
    ],
    palette:
      "Dreamer cream-mist + aurora-violet signal-pattern + silver-mist wing-echoes + translucent forcefield-ring + warm amber paper-drifts + cool deep-background silhouette",
    composition:
      "Wider mid-shot, signal-figure at frame-centre with arms open, suggested suspension-chamber in deep background through silver-mist wall",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: the figure is a PROJECTED ECHO OF THE LEAK, NOT The Oracle herself. The faceless cream-oval is the canonical visualization of 'shapes the leak takes' — the signal is rendering a body but not a face. The deep-background suspension-chamber is canon-revealed by end of Epoch 2 (the Insurgency knows where she is). Echoes The Oracle Imprint set's signal-pattern visual language while being explicitly NOT her.",
  },

  // ─── SOLDIER CLASS — formation + provoke + rush (Insurgency-faction) ───
  {
    cardId: "s1_class_soldier_01",
    sceneDelta:
      "Mid-shot. A Line Recruit standing at parade-rest at the edge of an Insurgency drill-yard at midmorning — late twenties, scarred jaw, generic-soldier features, in standard Insurgency-issue slate-and-gunmetal field-armor with the chest-rig buckled and a long-rifle slung across the back. They hold the standard Insurgency rifle in front of them with both hands at low-ready, weapon clean and freshly-oiled. Their face is composed, unremarkable, ready. Behind them, three more identical Recruits stand at parade-rest in mid-distance — the formation is the point, not any individual. No special gear, no insignia of rank, no glow, no aura — just the geometry of a 3/3 unit doing 3/3 work.",
    moodKeywords: [
      "no ability — that is the ability",
      "three power, three health, two cost",
      "the geometry of doing the job",
      "unremarkable, ready",
    ],
    palette:
      "Insurgency slate + gunmetal + signal-green chest-rig accent + dirty-yellow drill-yard ground + warm late-morning sun",
    composition:
      "Mid-shot front three-quarter, Recruit at frame-centre, three identical Recruits at lower-third behind",
    notes:
      "Unit card. Generic-soldier face must NOT match any named character (no Iron Lion, no Agent Zero, no specific Insurgency commander). The deliberate visual-flatness IS the design — this is a 'no ability is the ability' card and the art reinforces it.",
  },
  {
    cardId: "s1_class_soldier_02",
    sceneDelta:
      "Wider mid-shot. A Shieldwall soldier in heavy Insurgency front-line armor — a thicker chest-plate, full helmet with face-grille, an oversized riot-shield held forward in left hand. The soldier stands at the front of an Insurgency formation in mid-stride forward, the shield filling the lower-right quadrant of the frame as a near-solid wall. Behind the Shieldwall (visible past the shield's edge at upper-left) are three or four other Insurgency soldiers in lighter gear — the protected formation. A faint warm provoke-glow rims the shield's leading edge (provoke visualized — enemies must engage this unit before reaching the formation behind). The Shieldwall's face is invisible behind the helmet's face-grille.",
    moodKeywords: [
      "stands in front on purpose, every time",
      "the rest of the formation knows the deal",
      "shield as a wall",
      "face hidden behind face-grille",
    ],
    palette:
      "Insurgency heavy slate armor + signal-green helmet stripe + gunmetal shield + warm amber provoke-glow rim + dirty-yellow ground + cool slate background",
    composition:
      "Wider mid-shot, Shieldwall at frame-centre with shield filling lower-right quadrant, formation visible past shield-edge at upper-left",
    notes:
      "Unit card. Helmet/face-grille keeps the soldier anonymous (any Insurgency front-liner could be this person). Provoke is rendered as the rim-light on the shield — an Insurgency-specific visual idiom established for the Insurgency Allegiance set.",
  },
  {
    cardId: "s1_class_soldier_03",
    sceneDelta:
      "Wide-frame action mid-shot. An Insurgency commander mid-rally on a low hill at dawn — they stand back-to-camera at frame-centre, one arm raised in a clenched-fist exhortation, the other holding an open command-baton. Stretching out below them, an Insurgency formation of 8-10 figures (in lower-third) is mid-roar, fists raised in response. The commander wears Insurgency officer-leathers — slate coat with a single signal-green sash. NO face visible (back-to-camera only). The dawn sky behind them is warm dirty-rose with low cool-slate clouds. Two faint warm permanent-buff glows (one for power, one for health) emanate downward from the commander's raised baton toward the formation below — the rally as visible energy.",
    moodKeywords: [
      "a rally is the sentence a commander gives to the room they cannot leave",
      "back-to-camera commander with raised fist",
      "formation roaring below",
      "two buff-glows from the baton",
    ],
    palette:
      "Insurgency slate officer-coat + signal-green sash + warm dirty-rose dawn + cool slate clouds + dirty-yellow hill + warm twin buff-glows",
    composition:
      "Wide-frame mid-shot, commander back-to-camera at upper-third hilltop, formation at lower-third below",
    notes:
      "Spell card. Commander is back-to-camera throughout — preserves anonymity (no specific named commander). The two buff-glows visually communicate the +2/+2 effect on the friendly general. Echoes the rally-imagery already established in Insurgency Allegiance t6 without using the same composition.",
  },
  {
    cardId: "s1_class_soldier_04",
    sceneDelta:
      "Mid-shot. An Iron Vanguard soldier mid-stride forward across a fortified Insurgency line at mid-day — heavy slate armored chest-plate, full visored helmet, a long-handled war-pike in both hands held diagonally across the body. They are visibly mid-FORWARD-CHARGE — leading foot already past the trench-line, trailing foot still on the home-side parapet. Behind them, three more Iron Vanguard soldiers are visible in the same forward stride. Faint warm-amber provoke-glow rims their armor's leading edge; faint cool-cream rush-trails leak from the heels of the leading boot (rush-on-deploy visualized as the soldier ALREADY arriving). Their face is invisible behind the visor.",
    moodKeywords: [
      "the word is 'forward'",
      "the same word repeated four times in the same sentence",
      "mid-stride past the trench-line",
      "three more Vanguard behind",
    ],
    palette:
      "Insurgency heavy slate + signal-green visor accent + gunmetal pike-shaft + warm amber provoke-glow rim + cool cream rush-trails + dirty-yellow trench ground",
    composition:
      "Mid-shot front three-quarter, Vanguard mid-stride forward at frame-centre, trench-line at lower-third, three additional Vanguard at mid-distance",
    notes:
      "Unit card. Visor keeps Vanguard anonymous. Provoke + rush dual-keyword rendering: provoke = leading-edge rim-glow (consistent with t2 Shieldwall); rush = heel-trails. This visual continuity reinforces the Insurgency Allegiance / Soldier-class shared keyword vocabulary.",
  },
  {
    cardId: "s1_class_soldier_05",
    sceneDelta:
      "Wider mid-shot. The Last Regiment Standing — a single Insurgency soldier in heavily-weathered slate front-line armor stands at the centre of an Insurgency battlefield where the war is supposed to be over. Their armor is scuffed, scorched, patched in a half-dozen places; a tattered Insurgency banner hangs from a broken pike-shaft slung across their back. Around them, the battlefield is empty — no enemies, no allies, just the still-smoking remains of the line they held. The soldier's stance is forward, weapon at low-ready (provoke visualized). Faint warm-amber frenzy-rim flickers along their armor's leading edge (frenzy visualized — the more damage they take the harder they swing). A single faint cream-coloured rebirth-glow at their feet (rebirth visualized — they will get up again). Their face is set, weather-beaten, unsurprised. Above them, a low overcast sky with no sun visible — the time of day is ambiguous, has been for a while.",
    moodKeywords: [
      "the regiment that did not know the war was officially over",
      "by the time anyone told them, the war unofficially was not",
      "tattered banner on a broken pike",
      "weather-beaten, unsurprised",
    ],
    palette:
      "Insurgency battered slate armor + scorched signal-green banner + gunmetal weapons + warm amber frenzy-rim + cream rebirth-glow + dirty-yellow scorched ground + cool overcast sky",
    composition:
      "Wider mid-shot, Last Regiment soldier at frame-centre on cleared battlefield, broken pike with banner across back, smoking remains in mid-distance",
    notes:
      "Legendary unit. The 'war is officially over' framing is canon — this represents an Insurgency holdout regiment from one of the early Epoch-2 archon-war fronts who never received the cease-fire-or-defeat signal. Generic weather-beaten face must NOT match any named character (specifically NOT Iron Lion's countenance). Three keywords visualized as three distinct visual elements (forward stance, frenzy-rim, rebirth-glow underfoot).",
  },
] as const;

/**
 * Class faction's prompt registry, keyed by card id.
 *
 * Currently populated: 5 / 6 sets (Assassin, Engineer, Ne-Yon, Oracle, Soldier).
 * TODO: spy.
 */
export const CLASS_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(CLASS_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
