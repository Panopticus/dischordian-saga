/**
 * Card art prompts — INSURGENCY faction character cards.
 *
 * The Insurgency-faction cards extend the Insurgency Allegiance set's
 * visual language to the broader Insurgency-aligned cast: Agent Zero,
 * Iron Lion, Jericho Jones, Kael (contemporary leader), the Engineer,
 * the Eyes, the Hierophant, and the broader resistance apparatus.
 *
 * Visual language (consistent with Insurgency Allegiance set + Spy
 * class set + Soldier class set):
 *   - palette: Insurgency slate + signal-green + gunmetal +
 *     dirty-yellow + warm sodium-light + cool battlefield ambient
 *   - environments: Insurgency holding-yards, training-grounds,
 *     safe-houses, abandoned tunnels, surveillance corridors,
 *     tactical-ops rooms, supply caches, broadcast-towers
 *   - signature visual idioms: signal-green stealth-shimmer,
 *     warm provoke rim-glow, cool celerity after-images,
 *     surveillance-camera dormant-state, broken architecture,
 *     glass training-blades
 *   - faces: when visible, weathered, deliberate, scarred —
 *     the Insurgency carries the cost of resistance visibly
 *
 * Spoiler-discipline (CRITICAL):
 *   - Kael (s1_char_012, contemporary Insurgency leader) is
 *     rendered as a SEPARATE figure from Kael (s1_race_neyon_03,
 *     pre-Fall First-of-the-Ne-Yon). His identity-as-Source-Reborn
 *     is an Act 5 reveal and MUST NOT be visually confirmed —
 *     no brilliant-white-dominance, no toxic-green outer ring.
 *   - The Engineer (s1_char_026) maintains [CLASSIFIED] face-
 *     discipline — never face-on, only legs/hands/distant glint
 *     per Imprint set + Engineer Class set + Master Engineer reward.
 *   - The Oracle (s1_char_041 if present) maintains the FACELESS
 *     cream-mist oval per spoiler-discipline.
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const INSURGENCY_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "gen_insurgency",
    sceneDelta:
      "Wider mid-shot. Agent Zero as the player's general — female-presenting figure in mid-thirties at a Panopticon corridor-corner mid-action of timing surveillance: her left hand holds a small chrome timer reading 31 seconds, her right hand is poised mid-motion at the pommel of a sheathed combat-blade. She wears Insurgency-slate field-armor with signal-green chest-rig, hood pulled back, dark hair cropped short. Her face is composed-deliberate, weathered (visible scar on the left cheek), eyes alert and intelligent. Behind her, a Panopticon corridor extends with a wall-mounted SURVEILLANCE CAMERA visible at upper-distance — the camera is at the END of its 43-second cycle, beginning to ROTATE AWAY from her position. She is timing her crossing.",
    moodKeywords: [
      "cameras cycle every 43 seconds — I have 31",
      "the Collector wiped your memory — but not your instincts",
      "timing the crossing as the camera rotates away",
      "composed-deliberate, weathered, scar on left cheek",
    ],
    palette:
      "Insurgency slate field-armor + signal-green chest-rig + chrome 31-second timer + gunmetal sheathed blade + dark cropped hair + Panopticon cool-cyan corridor + warm fluorescent ceiling-strip + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Agent Zero at frame-centre at corridor-corner, surveillance-camera at upper-distance mid-rotation",
    notes:
      "General card. Visual continuity with Agent Zero Imprint set (same character at battle-scale) — same archetypal scarred-determined-female features. The 31-second timer + 43-second cycle is canon-direct from flavor — rendered as the visible chrome timer + camera mid-rotation.",
  },
  {
    cardId: "s1_char_002",
    sceneDelta:
      "Action mid-shot. Agent Zero — same archetypal features as gen_insurgency (mid-thirties, dark cropped hair, scar on left cheek), in dark Insurgency-slate combat-leathers with signal-green chest-rig, mid-strike with a curved short-blade in reverse-grip. The strike is delivered against an off-frame Architect-cyan target (only the target's chrome-and-cool-cyan armor edge visible at frame-right). Her body is mid-action of having JUST delivered the silent strike — the second-half-apology not yet rendered (the strike is still in its first-half-silent state). Faint signal-green stealth-shimmer at her body-edge (residual from approach). Faint warm strike-glow at the blade-tip. Her face is set, focused. Behind her, a dim Architect-corridor.",
    moodKeywords: [
      "exceptional combat abilities, strategic acumen, mastery of espionage",
      "pivotal roles in the Insurgency's most decisive strikes",
      "mid-strike against off-frame Architect target",
      "first-half-silent state — apology not yet rendered",
    ],
    palette:
      "Insurgency-slate combat-leathers + signal-green chest-rig + curved short-blade reverse-grip + signal-green stealth-shimmer + warm strike-glow + dim Architect-corridor + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Agent Zero at frame-centre mid-strike, Architect target at frame-right edge",
    notes:
      "Epic unit. Visual continuity with Imprint set + gen_insurgency. Anonymous off-frame Architect target preserves no-character-conflation. The 'first-half silent' framing is canon-direct from Assassin class spy-discipline (s1_class_assassin_02 echo) — same stylization at character-scale.",
  },
  {
    cardId: "s1_char_010",
    sceneDelta:
      "Wider mid-shot. Iron Lion at battle-scale — male-presenting figure in late-fifties, generic-grizzled-warrior features (deeply weathered face, full grey-streaked beard, calm grave eyes), in heavy Insurgency-slate-and-warm-leather command-armor with signal-green sash across the chest and a single weathered Insurgency commander-pin at the collar. He stands at the front of an Insurgency battle-line at frame-centre, both hands resting on the pommel of a tall planted IRON-AND-GUNMETAL longsword (the canonical weapon — heavy, weathered, legendary). His pose is grounded, both feet planted shoulder-width. Faint warm provoke-glow rims his shoulders. Behind him, a wide Insurgency battlefield extends with anonymous Insurgency soldiers in formation behind him (back-shots only).",
    moodKeywords: [
      "legendary warrior and pivotal leader within the Insurgency",
      "against the AI Empire",
      "deeply weathered, full grey-streaked beard, calm grave eyes",
      "tall planted iron-and-gunmetal longsword",
    ],
    palette:
      "Insurgency-slate-and-warm-leather command-armor + signal-green sash + weathered commander-pin + iron-and-gunmetal longsword + warm provoke-rim + Insurgency battlefield + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Iron Lion at frame-centre with planted longsword, soldier-formation behind",
    notes:
      "Epic unit. Visual continuity with Iron Lion Imprint set. Generic-grizzled-warrior features must NOT specifically conflict with the Imprint rendering. Anonymous soldier-formation preserves no-character-conflation.",
  },
  {
    cardId: "s1_char_011",
    sceneDelta:
      "Mid-shot. Jericho Jones — male-presenting figure in mid-thirties, generic-tactical-deliberate features (focused eyes, slight smile, scarred jawline), in standard Insurgency-slate field-armor with signal-green chest-rig and a single chrome shoulder-comm. He stands at frame-centre at a tactical-position with both hands forward in a wide guard-stance, mid-action of providing cover for an off-frame ally. Faint warm provoke-glow rims his leading shoulder. His expression is alert-loyal — the canonical 'deep sense of loyalty' rendering. Behind him, a small Insurgency-aligned tactical environment (broken urban architecture, signal-green cover-flag visible at upper-third).",
    moodKeywords: [
      "exceptional combat skills, tactical genius",
      "deep sense of loyalty",
      "providing cover for off-frame ally",
      "alert-loyal, scarred jawline",
    ],
    palette:
      "Insurgency-slate field-armor + signal-green chest-rig + chrome shoulder-comm + warm provoke-rim + signal-green cover-flag + broken urban architecture + warm sodium-light",
    composition:
      "Mid-shot front three-quarter, Jericho at frame-centre in guard-stance, tactical environment behind",
    notes:
      "Uncommon unit. Generic-tactical-deliberate features must NOT match any other named character (specifically NOT Iron Lion, NOT Agent Zero). Loyalty-stance rendered through the cover-providing posture.",
  },
  {
    cardId: "s1_char_012",
    sceneDelta:
      "Mid-shot. Kael (the contemporary Insurgency leader) — male-presenting figure in late-thirties, generic-strategist-features (clean-shaven, sharp dark eyes, slight smile of someone planning multiple moves ahead), short dark hair beginning to grey at the temples, in formal Insurgency-slate command-coat over warm-leather under-tunic with signal-green collar accents. He stands at frame-centre at an Insurgency strategy-table, mid-action of pointing at a tactical map with his right index finger; his left hand holds a small chrome strategist-baton. Faint cool drain-rim wraps him at body-edge (drain visualized as the energy he absorbs from successful operations). Behind him, the strategy-table at lower-third with map and tokens; an Insurgency tactical-ops room receding in mid-distance.",
    moodKeywords: [
      "prominent leader within the Insurgency",
      "celebrated for his strategic genius",
      "alliances with figures like Agent Zero and The Iron Lion",
      "planning multiple moves ahead",
    ],
    palette:
      "Insurgency-slate command-coat + warm-leather under-tunic + signal-green collar accents + chrome strategist-baton + cool drain-rim + warm tactical-ops room sodium-light + cool deep-shadow + warm tactical map",
    composition:
      "Mid-shot front three-quarter, Kael at frame-centre at strategy-table, pointing at map, tactical-ops room behind",
    notes:
      "Rare unit. CRITICAL spoiler-discipline: this Kael is a CONTEMPORARY Insurgency leader (mid-thirties, modern command-coat, dark hair). Visually distinct from s1_race_neyon_03 'Kael, First of the Ne-Yon' (who was warm-amber pre-Fall historical with brown hair). His Act-5+ identity as Kael Reborn / The Source is NOT confirmed — NO brilliant-white-dominance, NO toxic-green outer ring (those are The Source's visual signatures). Generic-strategist features must NOT match any other named character.",
  },
] as const;

/**
 * Insurgency faction's prompt registry, keyed by card id.
 *
 * Currently populated: 5 / 51 cards
 * (gen_insurgency, s1_char_002, s1_char_010, s1_char_011,
 *  s1_char_012).
 */
export const INSURGENCY_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(INSURGENCY_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
