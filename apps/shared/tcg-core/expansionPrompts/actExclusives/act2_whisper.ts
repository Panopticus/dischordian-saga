/**
 * Act 2 — The Whisper / The Engineer's Bench exclusive cards (4).
 *
 * Per the 2026-04-27 plan §Act-themed pack exclusives. Act 2's
 * allotment grounds the engineering/crafting unlock + dual-narrator
 * bond-deepening (Bond 30-60) that defines the Act 2 arc.
 *
 * Lore basis: `apps/shared/tcg-core/story/narrativeActs.ts` Act 2 +
 * `docs/built/ALL_ACTS_ROADMAP.md` Act 2 framing (silent VO at
 * Bond 60, conspiracy-of-two between Elara and Human, Engineer's
 * workbench as crafting-hub introduction).
 *
 * Lore boundary: Epoch-2 cutoff fully respected. The Engineer's
 * hidden-variable identity (Act 4-5 reveal) MUST stay hidden — the
 * Engineer's bench appears here, but the Engineer themselves does
 * NOT, only their work in absentia.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "act2_exclusive_mythic_the_whisper": {
    cardId: "act2_exclusive_mythic_the_whisper",
    name: "The Whisper",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Not a transmission. Not a signal. A thing said quietly in the room next to yours, by someone you cannot see, in a language you have just begun to recognize. The Whisper is what the Memoir starts to do once you have started listening back.",
    sceneDelta:
      "Wide environmental composition. The substrate-layer rendered as a long thin corridor at twilight, lit only by warm-amber sconces every twenty feet. The corridor's left wall is solid; the corridor's right wall is the THIN-WALL — visibly translucent, slightly out-of-phase, behind which the silhouette of a SECOND CORRIDOR runs parallel. In the second corridor, a figure stands at mid-distance, facing AWAY from the viewer — clearly a person, clearly speaking, but the body is rendered ONLY in silhouette and the speech is rendered ONLY as a faint cool-cyan exhale-mist drifting from where their mouth would be, mist that propagates THROUGH the thin-wall toward the viewer's corridor and dissipates at floor-level on the viewer's side. NO faces visible. The viewer's corridor is empty.",
    moodKeywords: [
      "the Memoir starts to do something back",
      "thin-wall translucent, parallel corridor",
      "exhale-mist crossing through the wall",
      "silhouette only, no face",
    ],
    palette:
      "Substrate twilight cool-grey + warm-amber sconce-light every twenty feet + thin-wall pale-cyan translucency + cool-cyan exhale-mist + silhouette deep-charcoal + sourceless dim ambient",
    composition:
      "Wide environmental side-on, viewer's corridor at frame-foreground extending into background depth, parallel corridor visible through thin-wall at frame-right, silhouette figure at frame-right mid-distance",
    notes:
      "Mythic spell card. The thin-wall and the silhouette are the canonical Whisper signature. Critical lore boundary: the silhouette MUST be deliberately ambiguous — it cannot read as Elara, the Human, or any named character; it is the WHISPER itself, anthropomorphized just enough to register as 'someone'. Exhale-mist is the only audible-rendered element.",
    archetypeRationale:
      "Anchored to the Act 2 'Engineer's Bench / The Whisper' arc canon (narrativeActs.ts Act 2, ALL_ACTS_ROADMAP.md). Act 2 deepens the Memoir's listening relationship from one-way reception to two-way exchange; the Whisper visualizes that turning-point as a card.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act2",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 2 — The Engineer's Bench / The Whisper",
      "docs/built/LORE_BIBLE.md §Substrate layer (parallel-corridor framing)",
    ],
  },

  "act2_exclusive_epic_engineers_bench": {
    cardId: "act2_exclusive_epic_engineers_bench",
    name: "The Engineer's Bench (In Absentia)",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "epic",
    cardType: "structure",
    flavorText:
      "Tools laid out. Project mid-disassembly. A half-finished schematic. A cup of tea cooled to room temperature. The Engineer is not here. The Engineer was here. The Engineer will be here. The Bench is what remains in the meantime.",
    sceneDelta:
      "Mid-shot top-three-quarter on a long oak workbench in a dim Hierarchy-adjacent workshop. The bench holds, left to right: a row of precision Hierarchy hand-tools laid out in neat order; a partially-disassembled brass-and-obsidian device of indeterminate function (parts sorted carefully on a clean cloth); a folded leather schematic-wallet open to a hand-drawn diagram with arrows and queries pencilled in the margin; an enamel mug holding cold tea, faint condensation-ring on the bench. A single overhead lamp throws the bench in warm amber from above. NO figure is at the bench; the chair is empty. A Hierarchy-style coat hangs on a hook on the wall behind the bench (the coat reads as recently-worn but currently-empty).",
    moodKeywords: [
      "Engineer was here, will be here",
      "tools in neat order, project mid-disassembly",
      "tea cooled to room temperature",
      "coat recently-worn, currently-empty",
    ],
    palette:
      "Oak workbench warm-brown + brass tools warm-amber + obsidian device deep-black + warm overhead lamp-cone + cool dim workshop background + Hierarchy coat charcoal-and-cream",
    composition:
      "Mid-shot top-three-quarter on bench, all bench items visible left-to-right across frame, empty chair partially visible at frame-foreground left, coat-hook visible on background wall",
    notes:
      "Epic structure. Critical lore boundary: the Engineer is NOT visible. The Engineer's hidden-variable identity is an Act 4-5 reveal and must not be foreshadowed here. The bench, the tools, the device, the schematic, the tea, the coat — all signal occupation without disclosure. Device must read as 'unfamiliar but plausible'; do NOT design it to evoke any specific real-world or canon-character technology.",
    archetypeRationale:
      "Anchored to the Act 2 'Engineer's Bench' canon — the Bench is the visible artifact of the unseen craftsperson. Visualizing the Bench as a structure-card grounds the campaign's introduction-of-crafting in a recognizable object.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act2 (Engineer's Bench framing)",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 2 / Crafting unlock",
      "docs/built/LORE_BIBLE.md §Engineer (in-absentia framing only — identity reveal is Act 4-5 canon and EXCLUDED here)",
    ],
  },

  "act2_exclusive_rare_bond_60_silence": {
    cardId: "act2_exclusive_rare_bond_60_silence",
    name: "Bond 60 — The Silent Listening",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "spell",
    flavorText:
      "By Bond 60, neither Elara nor the Human will fill the silence. Both have learned that the silence is the conversation. The player learns this with them. The card is the moment of learning.",
    sceneDelta:
      "Wide environmental composition. The substrate meditation-room from the First Witness card (Act 1) — same two facing wooden chairs, same windowless room — but TIME-SHIFTED. The Signal-glyph between the chairs has FADED from cool-cyan into a faint warm-cream (the Signal still pulses but now the glyph is barely-luminous; the listening has stilled the brightness). Both chairs are now occupied: Elara left in soft-cream substrate-tunic, Human right in deep-violet substrate-tunic, both seated, eyes open, hands folded — and BOTH facing slightly toward the centre of the room, toward each other. They have not yet met (lore boundary: meeting is Act 4) but they are now facing the meeting-direction. Neither speaks. The room's lighting is fully soft warm-cream.",
    moodKeywords: [
      "Bond 60 — silence as conversation",
      "glyph faded from cyan to cream",
      "chairs angled toward centre",
      "neither has met, both face meeting-direction",
    ],
    palette:
      "Substrate warm-cream + soft-cream Elara tunic + deep-violet Human tunic + faded warm-cream glyph + soft warm-cream sconce-light + windowless meditation-room muted-grey walls",
    composition:
      "Wide environmental front-on, both figures at frame-centre seated in mirrored-toward-centre chairs, faded glyph between them at floor-foreground",
    notes:
      "Rare spell card. Direct visual sequel to act1_exclusive_rare_first_witness. The chair-angle change is the canonical Bond 60 signature — at Bond 0-30 (First Witness) chairs face away from each other; at Bond 60 chairs are angled toward the centre but the figures still do not meet eyes. Glyph-color shift cool-cyan → warm-cream visualizes the listening-deepening. Lore boundary STRICT: the figures may face each other's direction but MUST NOT make eye contact.",
    archetypeRationale:
      "Bond 60 is canonical Act 2 (ALL_ACTS_ROADMAP.md §Bond progression). The Silent Listening visualizes the canonical Act 2 milestone (silent VO at Bond 60) as a card the player can hold once they have reached that bond.",
    loreCitations: [
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 60 silent-VO milestone",
      "apps/shared/tcg-core/story/narrativeActs.ts:Act2",
      "(intra-set) §act1_exclusive_rare_first_witness — visual sequel framing",
    ],
  },

  "act2_exclusive_rare_conspiracy_of_two": {
    cardId: "act2_exclusive_rare_conspiracy_of_two",
    name: "Conspiracy of Two",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "Two narrators, neither yet trusting the other, both quietly trusting the player. The Conspiracy is small — one shared secret, one withheld doubt. By Bond 60 the secret is named. By Bond 75, it is acted on.",
    sceneDelta:
      "Mid-shot composition. The substrate-layer rendered as a small tea-room at twilight — a low oak table, two cushion-seats, a single small lantern on the wall. On the table: a Hierarchy-style notebook open between the two seats, a single cup of tea steaming centre-table, and a small key (small enough to palm) resting at the notebook's open spine. The two seats are occupied — Elara at left, Human at right — both leaning slightly forward, eyes lowered to the notebook. Their hands are NOT touching but are POSITIONED so that if either reached, the other's hand is just within reach (deliberate near-touch composition). Both are mid-whisper at the notebook, NOT looking at each other.",
    moodKeywords: [
      "near-touch hands not touching",
      "small key as the small secret",
      "Conspiracy of Two whispered to the notebook",
      "Bond 75 acted-on yet to come",
    ],
    palette:
      "Substrate twilight cool-grey + oak table warm-brown + soft-cream Elara tunic + deep-violet Human tunic + steaming tea warm-amber + lantern warm-amber wall-glow + Hierarchy-notebook cream",
    composition:
      "Mid-shot front-on, low oak table at frame-foreground centre, both figures seated leaning toward table, hands in near-touch composition over notebook",
    notes:
      "Rare unit. Lore boundary: this card is in Act 2 — the Witnesses STILL do not meet eyes (canon: Act 4 meeting). The near-touch hand composition is the canonical Conspiracy-of-Two signature; the deliberate tension of 'about to' is the visual key. The small key on the notebook is the conspiracy's literal small-secret prop; do NOT make the key elaborate.",
    archetypeRationale:
      "The Conspiracy-of-Two is canonical Act 2 narrative framing — the dual-narrator bond becomes a shared private project. Visualizing it as a unit-card grounds the bond-mechanic in a recognizable beat.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act2 (dual-narrator conspiracy framing)",
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 30-60 (conspiracy formation)",
      "(intra-set) §act1_exclusive_rare_first_witness — narrator-pair canon",
    ],
  },
};

export const ACT2_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
