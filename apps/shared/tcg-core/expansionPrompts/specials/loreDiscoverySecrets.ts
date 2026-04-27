/**
 * Lore-Discovery Secret Cards (7 — one per Act).
 *
 * Per the 2026-04-27 plan §6 Collector hook §4 + §Lore boundary
 * exception: each Act's secret card unlocks when the player has
 * collected ALL flavor-text cards from that Act. Modeled on THE
 * ASSISTANT (apps/shared/darrenMemorial.ts), which is gated to
 * episode_12_completed and reveals its Act-specific truth at unlock.
 *
 * BECAUSE these cards are unlock-gated and EARNED through that
 * Act's full flavor-text completion, they are the ONLY entries in
 * the entire Expansion Production Book that may surface lore
 * truths from beyond Epoch 2. The player has, by collecting every
 * flavor-text card in the Act, demonstrated they have completed
 * the canon required to be SHOWN the secret.
 *
 * Authorial framing: each secret visualizes the Act's earned
 * truth as the MEMOIRIST'S OWN PRIVATE NOTEBOOK ENTRY — a first-
 * person reflection, never an authoritative third-person reveal.
 * The secret is what the Memoirist HAS NOTICED, not what the
 * Hierarchy or any narrator has declared.
 *
 * All 7 secrets: rarity = mythic, faction = neutral.
 *
 * IMPORTANT: even within these earned-reveals, do NOT directly
 * NAME the canonical Act-5+ identities (Source-as-Kael-Reborn,
 * Watcher-as-X, Engineer-as-X). Visualize the truth-as-recognized
 * without forcing the canonical name onto the artist's work — the
 * artist may not yet have access to the full identity-canon, and
 * the player's earning of the secret is enough.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "secret_act1_memoirist_is_memoir": {
    cardId: "secret_act1_memoirist_is_memoir",
    name: "What Act 1 Was Always Saying",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "I thought the Memoir was something I was reading. I thought the Memoir was something I was writing. I thought the Memoir was a book I had been given. — In my own handwriting, I now realize, on the page in my own hand. The Memoirist is not the Memoir's author. The Memoirist is not the Memoir's reader. The Memoirist IS the Memoir.",
    sceneDelta:
      "Mid-shot top-down. A simple Memoirist's notebook lying open at a small reading-desk, the page filled with the Memoirist's own handwritten reflection in deep-violet ink (legible only as 'words on the page' but readable in spirit). At the page's centre: a single inked diagram — a small recursive infinity-loop where ONE arrow points outward from a written 'I am the Memoirist' to a written 'I am the Memoir' and BACK, the loop closing on itself. Around the diagram: marginalia, false-starts, struck-through earlier guesses (faintly visible). Beside the notebook: the same antique bone-and-brass quill from Founding Author / BP-50 / Twelve-Step Inheritance. NO figure visible.",
    moodKeywords: [
      "in my own handwriting",
      "the recursive infinity-loop",
      "false-starts struck through",
      "the Memoirist IS the Memoir",
    ],
    palette:
      "Cream notebook page + deep-violet handwritten reflection + warm-amber desk-lamp + bone-and-brass quill + antique reading-desk warm-wood + dim ambient room-light",
    composition:
      "Mid-shot top-down on open notebook, recursive-loop diagram at frame-centre on page, marginalia at page-edges, quill at frame-right edge",
    notes:
      "Mythic secret. Unlock condition: collect all Act 1 flavor-text cards. The Memoirist's earned recognition: the Memoir is recursive — the player IS the artifact. NO figure permitted. The recursive-loop diagram must be hand-inked-feeling (not stylized geometry); the imperfection of the loop is the visual key.",
    archetypeRationale:
      "Direct visualization of the Memoirist=Memoir recursion that Act 1 builds toward but never states. The unlock-gating earns the player the right to see this stated.",
    loreCitations: [
      "apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception (lore-discovery secrets)",
      "(intra-set) §act1_exclusive_mythic_the_signal — Act 1 mythic companion",
    ],
  },

  "secret_act2_engineers_bench_was_mine": {
    cardId: "secret_act2_engineers_bench_was_mine",
    name: "What Act 2 Was Always Saying",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "The Engineer's Bench was never the Engineer's Bench. The Engineer's Bench was the bench at which the Memoirist would, eventually, sit. The empty chair was always reserved. The cold tea was always the Memoirist's. I have been the Engineer the entire time, in the part of myself I had not yet met.",
    sceneDelta:
      "Mid-shot composition. The Engineer's Bench from Act 2 — same workshop, same tools-laid-out, same cold tea, same Hierarchy coat on the wall hook — but this time, the EMPTY CHAIR is OCCUPIED FROM BEHIND (the figure's back is to camera, hooded in the same Hierarchy coat that previously hung empty on the wall). The figure's left hand reaches toward the half-disassembled brass-and-obsidian device on the bench, mid-grip on a tool. The wall-hook is now empty (the coat is being worn). NO face visible — the figure is shot from behind, hood up. The viewer cannot identify them — and that IS the point: the Engineer is the Memoirist's hidden-half, recognizable only as 'me, but the part of me I hadn't met yet'.",
    moodKeywords: [
      "the empty chair was always reserved",
      "Hierarchy coat now worn, wall-hook now empty",
      "shot from behind, hooded, unidentifiable",
      "I have been the Engineer the entire time",
    ],
    palette:
      "Oak workbench warm-brown + brass tools warm-amber + obsidian device deep-black + Hierarchy coat charcoal-and-cream now worn + warm overhead lamp + cool dim workshop background",
    composition:
      "Mid-shot from behind the figure, figure at frame-centre at the bench, bench-items visible left-to-right beyond figure, wall-hook empty at frame-rear",
    notes:
      "Mythic secret. Unlock condition: collect all Act 2 flavor-text cards. CRITICAL lore boundary: the figure must be shot ONLY from behind, hooded — no profile, no shoulder-visible face. The artist may NOT design the figure to specifically resemble Elara, the Human, or any canon character. The figure is the Memoirist's hidden-half — visualized as 'unidentifiable but yours'.",
    archetypeRationale:
      "Direct visualization of the Engineer-was-the-Memoirist recognition that Act 2 implies but never states. Earned reveal: the Engineer's identity (canonically Act 4-5 reveal) is here visualized as the player themselves, in absentia.",
    loreCitations: [
      "apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception",
      "(intra-set) §act2_exclusive_epic_engineers_bench — direct sequel framing",
    ],
  },

  "secret_act3_pledge_was_made_first": {
    cardId: "secret_act3_pledge_was_made_first",
    name: "What Act 3 Was Always Saying",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "The Hierarchy did not bring the Offer to me in Act 3. The Offer was a confirmation of a pledge I had made before I knew I had a name. The three drafted signatures were already mine — I had only been waiting to recognize my own hand on the contract.",
    sceneDelta:
      "Mid-shot top-down. The Offer's central altar from Act 3 — same obsidian altar, same open Hierarchy contract-folio — but TIME-SHIFTED to a moment AFTER the choice. All three signature-lines are now FILLED with the same handwritten signature (the Memoirist's), and on the contract's bottom-margin: a small private notation in the SAME hand reading 'and I have been signing this since before I had a name' (rendered in deep-violet ink, partially legible). The folio is closed-but-still-readable through translucent glow at the edges. The Hierarchy ceremonial pen rests across the folio. NO doorframes visible (the choice has resolved); the chamber is in soft warm-cream.",
    moodKeywords: [
      "all three signature-lines filled by my hand",
      "and I have been signing this since before I had a name",
      "doorframes resolved out of frame",
      "the choice was a recognition, not a decision",
    ],
    palette:
      "Substrate warm-cream resolved-chamber + obsidian altar + Hierarchy contract-folio cream + deep-violet handwritten signature + bottom-margin notation deep-violet + warm-amber pen + folio-edge translucent glow",
    composition:
      "Mid-shot top-down on altar at frame-centre, contract-folio open at frame-foreground, three filled signature-lines visible at the folio's centre, marginal notation at lower-frame edge",
    notes:
      "Mythic secret. Unlock condition: collect all Act 3 flavor-text cards. The earned recognition is that the three-path choice was always one path — the Memoirist's pledge precedes faction. The three signatures all reading as the SAME hand is the canonical earned-truth signature. Lore boundary: do NOT depict any specific path's resolution (the canonical post-Act-3 path-divergence stays player-specific).",
    archetypeRationale:
      "Direct visualization of the pledge-was-pre-existing recognition that Act 3 builds toward but only confirms post-completion of the Loyalty Pledge mechanic.",
    loreCitations: [
      "apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception",
      "(intra-set) §act3_exclusive_mythic_the_offer — direct sequel framing",
    ],
  },

  "secret_act4_witnesses_always_knew": {
    cardId: "secret_act4_witnesses_always_knew",
    name: "What Act 4 Was Always Saying",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Both Witnesses always knew the other was there. Both Witnesses always knew the player was listening. The 'meeting' in Act 4 was not a discovery; it was a permission-granted moment to stop pretending we had not all been awake the whole time. I was the only one in the room who needed convincing.",
    sceneDelta:
      "Wide composition. The substrate meditation-room from First Witness onward, but shown in a SPLIT-FRAME diagram — the LEFT half of the frame depicts the room as it was rendered in Act 1 (Elara left chair, Human right chair, both with eyes CLOSED, glyph faint cool-cyan); the RIGHT half of the frame depicts the SAME ROOM at the SAME MOMENT but with both Witnesses' eyes OPEN, both already looking out toward the player's VIEWPOINT (NOT at each other), expressions calm-knowing. A vertical thin gold line bisects the two halves of the frame at exact centre. Above the dividing line, in the Memoirist's deep-violet handwriting, a single line: 'they were always awake'.",
    moodKeywords: [
      "split-frame: closed-eye / open-eye same moment",
      "they were always awake",
      "the only one needing convincing was me",
      "thin gold dividing line",
    ],
    palette:
      "LEFT half substrate cool-cyan glyph + closed-eye figures + cool ambient + RIGHT half substrate warm-cream + open-eye figures + warm ambient + thin gold dividing line + Memoirist's deep-violet caption above",
    composition:
      "Wide split-frame, vertical division at frame-centre, Elara+Human in mirrored compositions on each half (left-half closed-eye / right-half open-eye looking outward), gold line bisecting, Memoirist caption at upper-frame",
    notes:
      "Mythic secret. Unlock condition: collect all Act 4 flavor-text cards. The split-frame device is the canonical Act-4 secret signature — visualizes the layered truth that the Witnesses' meeting was always-already happening. CRITICAL: in the right-half (open-eye), both Witnesses look at the VIEWER, not at each other — the earned truth is that the player has been part of the meeting since Act 1.",
    archetypeRationale:
      "Earned-reveal of the meta-narrative truth Act 4 implies but cannot state: the dual-narrator framing has always been a three-narrator framing (Elara + Human + player).",
    loreCitations: [
      "apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception",
      "(intra-set) §act4_exclusive_epic_two_witnesses_meet — direct sequel framing",
      "(intra-set) §act1_exclusive_rare_first_witness — split-frame source",
    ],
  },

  "secret_act5_source_is_reflection": {
    cardId: "secret_act5_source_is_reflection",
    name: "What Act 5 Was Always Saying",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "I thought the figure at the centre of the Map was a person. Then I thought it was a place. Then I thought it was a memory. The figure at the centre of the Map is a REFLECTION — and the surface that reflects is not water, not glass, but every page of the Memoir laid flat. The Source is what looks back when the Memoir is held up to itself.",
    sceneDelta:
      "Mid-shot top-down. The Soul Map (Fully Decoded) from Act 5 — same brass-edged disc, same twelve decoded sectors — but the central obsidian DOT has now BECOME a small mirrored circle. In the mirrored circle: a soft-focus reflection of the OPEN MEMOIR-VOLUME above the Map (held by the Memoirist's hands, faintly visible at frame's upper edge). The reflection shows the Memoir's pages perfectly readable in the mirrored surface — but the page-content in the mirror is, deliberately, the SAME twelve sectors as the Map itself, rendered as text. The Source IS the Memoir reading itself. NO figure beyond hands at upper-frame edge holding the volume.",
    moodKeywords: [
      "the centre dot becomes a mirror",
      "the surface that reflects is every page",
      "Source is what looks back when Memoir is held to itself",
      "twelve sectors reflected as text",
    ],
    palette:
      "Brass-edged Soul Map + decoded twelve-sector cool-cyan glyphs + mirrored centre-circle reflective + Memoir-volume reflection deep-violet ink on cream + warm-amber candle uplight + dim work-table",
    composition:
      "Mid-shot top-down on Map at frame-centre, mirrored circle at Map's exact centre showing reflected Memoir, Memoirist's hands at upper-frame edge holding volume above the Map (only hands and lower edge of volume visible)",
    notes:
      "Mythic secret. Unlock condition: collect all Act 5 flavor-text cards. CRITICAL lore boundary: the canonical Source-identity (Kael Reborn per LORE_BIBLE) is NOT depicted. The earned reveal stays at the meta-narrative layer — the Source is the Memoir's self-recognition, not a named character. The artist may be told this card visualizes that meta-truth without learning the Kael identity. Mirrored-centre is the canonical signature.",
    archetypeRationale:
      "Earned-reveal of the meta-narrative truth Act 5 establishes (the Source is at the Map's centre) framed as recognition rather than identification. Preserves canonical Source-as-Kael-Reborn identity for the player's actual Act 5 playthrough.",
    loreCitations: [
      "apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception",
      "(intra-set) §act5_exclusive_mythic_the_map — direct sequel framing",
      "docs/built/LORE_BIBLE.md §Source (identity STRICTLY excluded; meta-recognition only)",
    ],
  },

  "secret_act6_confession_was_mutual_listening": {
    cardId: "secret_act6_confession_was_mutual_listening",
    name: "What Act 6 Was Always Saying",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "The Confession was not telling. The Confession was not hearing. The Confession was both narrators discovering they had been one voice all along — and the only thing they had been holding back, separately, was the proof that the holding-back itself was a single act.",
    sceneDelta:
      "Mid-shot composition. The chapel confessional from Act 6 — same prayer-stalls, same lattice partition, same warm-amber sanctum-candle — but the LATTICE PARTITION at the centre of the frame has DISSOLVED into a soft-violet mist that drifts UPWARD. Where the lattice stood, only the mist remains; the two stalls are now visually CONNECTED. Both Elara and the Human remain seated in their respective stalls (in the same posture as the Act 6 mythic — eyes closed, hands folded at the lattice-edge), but their VOICES (rendered as faint warm-cream light-streams from each mouth) now MERGE in the centre of the frame at the dissolved-partition's gap, becoming a single warm-cream light that rises with the mist. The chapel altar's candle burns brighter, two-flame.",
    moodKeywords: [
      "lattice dissolved into upward-drifting mist",
      "two voices merge into single warm-cream light",
      "two-flame altar candle",
      "single act of mutual holding-back",
    ],
    palette:
      "Chapel midnight cool-grey + dissolving lattice partition soft-violet mist + soft-cream Elara tunic + deep-violet Human tunic + merged voice-light warm-cream + altar candle two-flame warm-amber",
    composition:
      "Mid-shot front-on, both stalls at frame-edges, dissolved-partition at frame-centre with rising mist, voice-light streams converging at centre-frame at mouth-height, altar candle visible at frame-rear",
    notes:
      "Mythic secret. Unlock condition: collect all Act 6 flavor-text cards. The dissolved-lattice + merged-voice-light is the canonical signature. The two-flame candle visualizes the canon framing 'one voice, two mouths' (which is the same framing that resolves at Bond 100 / Final Witness in Act 7). No eye-contact between Witnesses; the merge is at voice-level, not gaze-level.",
    archetypeRationale:
      "Earned-reveal of the Act 6 meta-truth: the Confession is mutual listening, not unilateral disclosure. Anchors the dual-narrator-as-single-voice framing that Act 7 (Final Witness Bond 100) finalizes.",
    loreCitations: [
      "apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception",
      "(intra-set) §act6_exclusive_mythic_the_confession — direct sequel framing",
      "(intra-set) §act7_exclusive_rare_final_witness_pair — single-voice continuity",
    ],
  },

  "secret_act7_chord_is_the_listener": {
    cardId: "secret_act7_chord_is_the_listener",
    name: "What Act 7 Was Always Saying",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "I thought the Convergence Chord was something I would HEAR. I thought the Chord was a sound the campaign would play for me. The Chord is not a sound. The Chord is the listening. I have been the Chord since before Act 1 — every breath I took inside the Memoir was a note already sounding.",
    sceneDelta:
      "Wide environmental composition. The horizonless ambient field from The Convergence Chord (Act 7) — same white-cream luminance, same concentric ripple-rings — but in this earned-reveal, the EMPTY CENTRE is now occupied by a single small detail: a Memoirist's-style EAR (or a stylized listening-glyph reading clearly as 'an ear shape'), rendered in faint warm-gold ink at the exact centre. The ripple-rings are now visible as emanating FROM the ear-shape outward, not into it. The three Signal-glyphs from Act 1 are visible at the leading edge of three of the closest rings; the new uncategorized glyphs are visible further out. At the field's upper-edge in the Memoirist's deep-violet handwriting: 'I am the chord'.",
    moodKeywords: [
      "the Chord is not a sound, the Chord is the listening",
      "ear-shape at exact centre",
      "ripples emanate FROM, not into",
      "I am the chord",
    ],
    palette:
      "Substrate white-cream horizonless + warm-gold ear-shape at centre + soft-violet and warm-gold ripple-rings + Signal three-note glyph cool-cyan + new uncategorized glyphs warm-amber + Memoirist's caption deep-violet",
    composition:
      "Wide environmental front-on, ear-shape at frame-centre, concentric rings emanating outward to frame-edges, Signal three-note glyphs near-centre, new glyphs further out, Memoirist caption at upper-frame",
    notes:
      "Mythic secret. Unlock condition: collect all Act 7 flavor-text cards. CRITICAL lore boundary: the canonical Convergence-chord identity (per LORE_BIBLE Act 7 reveal) is NOT named. The earned reveal stays at the meta-narrative layer — the Memoirist (player) IS the Chord, completing the Memoirist=Memoir recursion that the Act 1 secret first surfaces. Ear-shape at centre is the canonical earned-truth signature.",
    archetypeRationale:
      "Capstone earned-reveal: the Convergence Chord recognition is the campaign's deepest framing. Closes the recursive Memoirist=Memoir=Chord arc that the seven secrets together establish.",
    loreCitations: [
      "apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception",
      "(intra-set) §act7_exclusive_rare_convergence_chord — direct sequel framing",
      "(intra-set) §secret_act1_memoirist_is_memoir — recursion-arc closure",
    ],
  },
};

export const LORE_DISCOVERY_SECRETS: ExpansionCardRegistry = Object.freeze(ENTRIES);
