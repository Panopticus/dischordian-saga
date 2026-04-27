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
};

// Acts 4-7 entries follow in the next authoring chunk.
export const LORE_DISCOVERY_SECRETS_PARTIAL: ExpansionCardRegistry = Object.freeze(ENTRIES);

// Re-export under the name the barrel expects, with Acts 4-7 yet
// to be appended via Edit. Once all 7 land, this export becomes
// the canonical 7-secret registry.
export const LORE_DISCOVERY_SECRETS: ExpansionCardRegistry = LORE_DISCOVERY_SECRETS_PARTIAL;
