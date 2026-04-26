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
  {
    cardId: "s1_char_026",
    sceneDelta:
      "Wider mid-shot. The Engineer at battle-scale — figure at frame-centre with face FULLY OBSCURED by oversized brass-and-glass goggles + a leather workshop-mask covering nose and lower-face. Body deliberately gender-ambiguous: in dark Antiquarian-amber engineer's apron over warm-leather under-clothes (visual continuity with Imprint set). She holds in her right hand a brass-and-glass Insurgency weapon-prototype mid-construction (a small chrome-and-cool-cyan emitter device with internal cool-cyan filigree). Behind her in the deep distance, a vast Inception Ark hull-section is visible (the Ark she built to save humanity) — recognizable as the canonical Inception Ark form (chrome-and-cool-cyan, vast scale). She stands at a workbench at lower-third. A translucent green-tinted forcefield-shimmer wraps her work-area. NO face visible.",
    moodKeywords: [
      "she built the Inception Arks to save humanity",
      "now she builds weapons to defend the dream",
      "she does not choose sides — she chooses survival",
      "face fully obscured by oversized goggles + workshop-mask",
    ],
    palette:
      "Dark Antiquarian-amber engineer's apron + warm-leather under-clothes + oversized brass-and-glass goggles + leather workshop-mask + chrome-and-cool-cyan weapon-prototype + cool-cyan internal filigree + vast Inception Ark hull-section in deep-distance + translucent green-tinted forcefield + warm workbench-light",
    composition:
      "Wider mid-shot front three-quarter, Engineer at frame-centre at workbench, Inception Ark in deep background",
    notes:
      "Epic unit. CRITICAL spoiler-discipline: face FULLY OBSCURED (oversized goggles + workshop-mask covering nose+mouth) — same [CLASSIFIED] discipline as Imprint set + Engineer Class set + Master Engineer reward. Gender deliberately ambiguous in posture (the canonical 'she' pronoun in flavor is NOT confirmed visually — could be misdirection). The Inception Ark in deep-distance is canon-direct from flavor.",
  },
  {
    cardId: "s1_char_028",
    sceneDelta:
      "Mid-shot. The Eyes — female-presenting figure in mid-twenties, generic-watchful features (sharp deep eyes, alert posture), in dark Insurgency-slate infiltration-leathers (deeper than standard Insurgency-slate, optimized for low-light) with a single chrome-and-Watcher-cyan optical earpiece at her left ear. She stands at the centre of a Panopticon corridor at frame-centre, mid-action of OBSERVATION — both hands at her sides, head turned slightly to one side, eyes intent on something off-frame. Faint signal-cyan stealth-shimmer at her body-edge (Watcher-modified Insurgency variant). Her eyes are her defining feature — DEEPER than ordinary, more attentive — the canonical 'unparalleled infiltration' rendering. NO surveillance-camera visible (she IS the surveillance).",
    moodKeywords: [
      "elite agent created by the Watcher for the AI Empire",
      "renowned for her unparalleled infiltration",
      "deeper-than-ordinary eyes",
      "she IS the surveillance",
    ],
    palette:
      "Dark Insurgency-slate infiltration-leathers + chrome-and-Watcher-cyan optical earpiece + signal-cyan stealth-shimmer + deep eye-detail + Panopticon corridor + warm fluorescent ceiling-strip + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Eyes at frame-centre in observation-pose, corridor extending behind",
    notes:
      "Rare unit. CRITICAL spoiler-discipline: 'created by the Watcher' is canon at end of Epoch 2 (the Watcher is established but his TRUE IDENTITY is the Act 6 reveal — NOT visualized here). The Eyes herself can be rendered; the Watcher who created her is referenced only by the cool-cyan optical earpiece tint (Watcher-cyan is a signature shade). Generic-watchful features must NOT match any named character.",
  },
  {
    cardId: "s1_char_031",
    sceneDelta:
      "Wider mid-shot. The Hierophant — male-presenting figure in mid-sixties, generic-spiritual-leader features (full grey beard, deep wise eyes, calm radiant face), in formal Thalorian high-priest's robes (deep cream-and-warm-violet ceremonial fabric with deep-bronze religious-symbols embroidered along the hem and chest). He stands at the centre of a Thalorian high-temple sanctum at frame-centre. Both hands are extended outward in a wide blessing-gesture, palms-up. Around him, faint translucent warm-cream spiritual-energy radiates outward. A translucent green-tinted forcefield-shimmer wraps his body. Behind him, the Thalorian sanctum extends — tall warm-stone columns, deep bronze-and-cream ceremonial banners, a high arched window onto a Thalorian dawn sky. Faint warm-cream blessing-haze around the chamber.",
    moodKeywords: [
      "esteemed spiritual leader of Thaloria",
      "rich history and deep-rooted traditions",
      "wide blessing-gesture, palms-up",
      "calm radiant face, full grey beard",
    ],
    palette:
      "Thalorian deep cream-and-warm-violet ceremonial fabric + deep-bronze religious-symbols + warm-cream spiritual-energy + translucent green-tinted forcefield + warm-stone Thalorian sanctum columns + deep bronze-and-cream ceremonial banners + warm Thalorian dawn",
    composition:
      "Wider mid-shot front three-quarter, Hierophant at frame-centre with arms extended in blessing, Thalorian sanctum extending behind",
    notes:
      "Epic unit. Generic-spiritual-leader features must NOT match any named character (specifically NOT The Source, NOT The Antiquarian — different visual signature). Thalorian sanctum is a NEW environment for the Insurgency-faction visual language (warm-cream-and-bronze religious aesthetic vs the typical Insurgency-slate-and-signal-green field-aesthetic).",
  },
  {
    cardId: "s1_char_040",
    sceneDelta:
      "Mid-shot. The Nomad — figure of indeterminate gender at frame-centre, ENTIRELY CONCEALED beneath a deep-hooded dark-grey traveling cloak with a wide cool-grey face-mask covering the entire face beneath the hood. Only the eyes are barely visible through narrow slit-eye-holes in the mask. Body-shape concealed by cloak's drape. Stands at a desert-edge with a long traveling-staff in their right hand and a small Insurgency-aligned signal-green talisman barely visible at the cloak's collar. Behind them, a wide unmarked horizon (no specific landscape — they are nowhere in particular). The figure is clearly an Insurgency-aligned operative but their identity is mystery. Faint warm wind-whip at the cloak's edges.",
    moodKeywords: [
      "always concealed beneath a hood and a mask",
      "his true identity remains a mystery",
      "his past entirely classified",
      "barely-visible eyes through mask slits",
    ],
    palette:
      "Deep-hooded dark-grey traveling cloak + wide cool-grey face-mask + narrow eye-slits + Insurgency-signal-green talisman at collar + long traveling-staff + warm desert-edge horizon + warm wind-whip",
    composition:
      "Mid-shot front three-quarter, Nomad at frame-centre fully concealed, unmarked horizon behind",
    notes:
      "Rare unit. CRITICAL spoiler-discipline: face FULLY OBSCURED (canon-direct from flavor). Indeterminate gender. Generic-traveler must NOT match any named character. The 'past entirely classified' is rendered as the unmarked horizon and full concealment.",
  },
  {
    cardId: "s1_char_041",
    sceneDelta:
      "Mid-shot. The Oracle (Insurgency-aligned, the male prophet) — male-presenting figure in late-sixties, generic-prophet features (silver-streaked dark beard, deep knowing eyes, calm slightly-amused face), in plain Insurgency-aligned warm-cream prophet's robes with a single small Insurgency-aligned signal-green talisman at the throat (NOT Architect-cyan, NOT Dreamer-aurora-violet — Insurgency-affiliated). He stands at the centre of an Insurgency-cell underground briefing-chamber at frame-centre, both hands extended outward in a wide prophetic-gesture, palms-up. Around his hands, faint translucent warm-amber prophecy-script (NOT cool-cyan Architect-glyphs, NOT aurora-violet Dreamer-script — distinct WARM-amber Insurgency-prophet visual idiom). A translucent green-tinted forcefield-shimmer wraps his body. Anonymous Insurgency-cell members visible at lower-third (back-shots only) listening with rapt attention.",
    moodKeywords: [
      "revered figure within the Insurgency",
      "wisdom and prophetic insights that inspired resistance",
      "warm-amber prophecy-script (not Architect, not Dreamer)",
      "calm slightly-amused face, silver-streaked beard",
    ],
    palette:
      "Insurgency-aligned warm-cream prophet's robes + signal-green throat-talisman + warm-amber prophecy-script + translucent green-tinted forcefield + Insurgency-cell underground briefing-chamber + warm low briefing-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Oracle at frame-centre with arms extended, Insurgency-cell members at lower-third listening",
    notes:
      "Epic unit. CRITICAL: this is the INSURGENCY-ALIGNED MALE Oracle (canonically distinct from the captive White Oracle whose face is FACELESS cream-mist oval). This Oracle is rendered as a SEPARATE prophet figure: silver-streaked beard, calm-amused face, warm-amber Insurgency-prophet script (vs Architect cool-cyan or Dreamer aurora-violet). Per The Jailer's lore (s1_char_035 — 'began as the Oracle'), an earlier male Oracle existed; this card may depict that lineage. Generic-prophet features must NOT match The Jailer (s1_char_035) or any other named character.",
  },
  {
    cardId: "s1_char_044",
    sceneDelta:
      "Mid-shot. The Recruiter — male-presenting figure in mid-forties, generic-charming-features (slight smile, warm eyes, well-groomed but not flashy), in formal Architect-cyan-and-cool-cream Academy-grad's coat (the canonical 'enrolled at the Academy' visual). He stands at the centre of a quiet Architect-academy garden, mid-conversation with an anonymous prospect (only the prospect's back-shoulders visible at frame-right edge, generic-young-figure listening). The Recruiter's right hand is extended in a small open-palm welcoming-gesture; his left hand holds a small chrome-and-cool-cyan recruitment-card. His face is composed, reasonable-seeming. Critically, faint translucent COOL-VIOLET INSURGENCY-AFFILIATION traces around his shoulders (he turned — but the original Architect-affiliation is still visually present, layered with the new). Background: Architect-academy garden architecture.",
    moodKeywords: [
      "initially applied his powers to benefit the Empire",
      "enrolling at the Academy and swiftly rising in influence",
      "yet — original affiliation layered with new",
      "warm eyes, well-groomed but not flashy",
    ],
    palette:
      "Architect-cyan-and-cool-cream Academy-grad's coat + chrome-and-cool-cyan recruitment-card + translucent cool-violet Insurgency-affiliation traces + Architect-academy garden + warm sunlight + cool-cream architecture + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Recruiter at frame-centre with welcoming-gesture, anonymous prospect at frame-right edge",
    notes:
      "Rare unit. The TWO affiliation-layers (Architect-cyan dominant + cool-violet Insurgency traces) is the canonical 'turned' visualization — he carries both histories. Anonymous prospect preserves no-character-conflation. Generic-charming-features must NOT match any named character.",
  },
] as const;

/**
 * Insurgency faction's prompt registry, keyed by card id.
 *
 * Currently populated: 11 / 51 cards
 * (gen_insurgency, s1_char_002, s1_char_010, s1_char_011,
 *  s1_char_012, s1_char_026, s1_char_028, s1_char_031,
 *  s1_char_040, s1_char_041, s1_char_044).
 */
export const INSURGENCY_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(INSURGENCY_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
