/**
 * TCG card art prompts — typed registry.
 *
 * Each card definition (`apps/shared/tcg-core/cards/definitions/**`)
 * gets one entry here, keyed by card id. The render pipeline reads
 * this registry, hydrates the locked `card_art_potential` template
 * from `apps/shared/assetPromptTemplates.ts`, and dispatches one
 * prompt per card to the Flux + `dischordian_cards_v2` LoRA.
 *
 * ═══════════════════════════════════════════════════════════════
 * LORE BOUNDARY (locked 2026-04-26)
 * ═══════════════════════════════════════════════════════════════
 *
 * Every prompt draws ONLY from canon revealed by the END of EPOCH 2.
 *
 *   - Epoch Zero events are fully revealed (Genesis, Logos
 *     awakening, the Programmer's disappearance, the rise of the
 *     12 Archons, the Fall of Reality, the founding of the AI
 *     Empire).
 *   - First Epoch events are fully revealed.
 *   - Second Epoch events are fully revealed (the long post-Fall
 *     interregnum, the Antiquarian's accumulated catalogue, the
 *     archon wars over the wreckage, the founding of the Insurgency,
 *     the rise of the Antiquarian Council).
 *
 * The 7-act spine of the modern campaign starts AFTER Epoch 2.
 * The following are SECRETS that prompts MUST NOT visually confirm:
 *
 *   - The Watcher's true identity / unmasking (Act 6 reveal)
 *   - The Source's true identity (Kael Reborn, Act 5 reveal)
 *   - The Two Witnesses bond mechanic (Acts 6-7 reveal)
 *   - The Engineer's hidden-variable identity (Act 4-5 reveal)
 *   - Convergence chord / final stance choices (Act 7 reveal)
 *   - Darren Fessler memorial unlocks (Episode 12 reveal)
 *   - The "third thing in the room" present since Act 1
 *   - Daniel Cross / Programmer-as-Antiquarian connection
 *
 * ❶ Self-check before each prompt: "Could a player who has only
 *   completed Epoch 1 and Epoch 2 see this card and learn something
 *   they shouldn't yet know?" If yes, encode the truth as
 *   foreshadowing / silhouette / negative space — never direct
 *   visual confirmation.
 *
 * ❷ Exception: cards whose unlock is gated to specific late-act
 *   episodes (e.g. THE ASSISTANT memorial card unlocked at
 *   Episode 12 completion) MAY reflect their unlock-point reveal
 *   in their art — those players have earned the spoiler.
 *
 * ═══════════════════════════════════════════════════════════════
 * TIER ESCALATION (for cards with t1..t5 variants)
 * ═══════════════════════════════════════════════════════════════
 *
 * Tier-up variants must escalate visually in lockstep with mechanical
 * power per the §10 master template in
 * `docs/archive/2026-05-08-superseded/PROMPT_BOOK_2026-04-25.md`:
 *
 *   T1 baseline      — mortal scale, single key light, restrained.
 *   T2 awakened      — visible elemental aura, secondary rim-light,
 *                      saturated accent.
 *   T3 ascendant     — full elemental halo, sky shifted (dawn/dusk),
 *                      visible weather.
 *   T4 dominant      — reality bends, scale increases, camera pulls
 *                      back.
 *   T5 transcendent  — partly off-plane; cosmic-scale backdrop;
 *                      half-bleed into otherspace.
 *
 * Faction palettes are pulled from `docs/TCG_ART_SPEC.md` SECTION 1
 * (card-back palettes). Operators must match the faction palette
 * for the card's `affiliation` field.
 */

/**
 * One entry per card. The render pipeline composes the final prompt
 * by combining this entry with the `card_art_potential` template
 * tokens (locked LoRA, locked aspect 3:4, locked negative tokens).
 */
export interface CardArtPrompt {
  /** Card id; matches `definition.id` exactly. */
  cardId: string;

  /**
   * The visual scene description specific to this card.
   * 60-150 words. Must contain at least one canon-specific detail
   * (named location, named keyword visualization, faction-specific
   * symbol, lore beat). Must NOT contain spoilers per the Lore
   * Boundary above.
   */
  sceneDelta: string;

  /**
   * 3-5 mood tokens that direct emotional tone. Examples:
   * "reverence", "menace", "cold computational precision",
   * "guerrilla urgency", "scholarly patience", "bureaucratic dread".
   */
  moodKeywords: readonly string[];

  /**
   * Color palette for this card. Should match the faction's
   * canonical palette unless the card explicitly crosses
   * factions (rare; e.g. corruption cards). Examples:
   *   "Architect deep crimson + black steel + chrome"
   *   "Antiquarian amber + parchment + temporal blue"
   *   "Insurgency slate + signal green + gunmetal"
   */
  palette: string;

  /**
   * Composition direction — framing, scale, camera angle.
   * Examples: "centered three-quarter portrait", "low-angle hero
   * shot", "tight close-on-the-hands detail", "wide environment
   * with subject mid-distance".
   */
  composition: string;

  /**
   * Tier-up variants. Required for cards whose definition exposes
   * `_t1` through `_t5` art URLs. Each tier value is the additive
   * delta from the base sceneDelta describing the tier's escalation
   * per the §10 escalation rules above.
   */
  tierVariants?: {
    t1?: string;
    t2?: string;
    t3?: string;
    t4?: string;
    t5?: string;
  };

  /**
   * Operator-side notes — lore tie-in, why this prompt is shaped
   * the way it is, any spoiler-boundary judgement calls. Optional.
   */
  notes?: string;
}

/**
 * The full registry. Populated by per-faction modules that re-export
 * their entries through `index.ts`.
 */
export type CardArtPromptRegistry = Readonly<Record<string, CardArtPrompt>>;
