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
  {
    cardId: "s1_char_047",
    sceneDelta:
      "Wider mid-shot. The Shadow Tongue — a vast non-human entity, approximately 3.5m tall, body composed of writhing deep-cool-violet shadow-substance with flickering deep-crimson interior glow. The figure's silhouette suggests humanoid but the form continuously SHIFTS at the edges (the entity is not bound to one shape). Where its mouth would be, a wide open MAW of deep-crimson light extends — and from the maw, a long translucent SHADOW-TONGUE extends forward into the air, this tongue covered in tiny writhing whisper-glyphs (the canonical name made literal). Around the entity, the air shows reality-distortion ripples. Behind it, the broken edge of an Empire-of-Shadows containment-rift (the rift it escaped through) is visible at deep distance — ragged-edged dark portal in the cool-cyan ground.",
    moodKeywords: [
      "Year 16,200 A.A. — escaped the infernal dominion of the Empire of Shadows",
      "one of the few horrors to slip its leash",
      "wide open maw with shadow-tongue extending",
      "writhing whisper-glyphs along the tongue",
    ],
    palette:
      "Deep-cool-violet shadow-substance body + flickering deep-crimson interior + open maw of deep-crimson light + translucent shadow-tongue + tiny writhing whisper-glyphs + reality-distortion ripples + broken Empire-of-Shadows containment-rift + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Shadow Tongue at frame-centre, broken containment-rift in deep-distance behind",
    notes:
      "Legendary unit. Empire of Shadows is canon at end of Epoch 2 (established in Advocate s1_char_017 lore). The Shadow Tongue is a NON-HUMAN entity — face is alien-monstrous (open maw, writhing form). NO human-character-conflation possible. The escape from containment is canon-direct.",
  },
  {
    cardId: "s1_char_105",
    sceneDelta:
      "Action mid-shot. Iron Lion in mid-action — same canonical features as s1_char_010 (late-fifties grizzled-warrior, full grey-streaked beard, weathered face, deep grave eyes), in heavier Insurgency battle-armor with signal-green chest-plate, mid-stride forward at the front of an Insurgency battle-line. He is not behind his soldiers; he is AHEAD of them — leading-foot already past the soldier-line at lower-third (anonymous Insurgency-soldier silhouettes visible behind him in mid-stride following). His weapon: a tall iron-and-gunmetal longsword, raised diagonally across the body in a ready-position. Faint warm rush-trails at his heels (rush keyword). Faint warm provoke-glow rims his shoulders. His face is set, focused, ahead of the line.",
    moodKeywords: [
      "he does not ask his soldiers to hold the line",
      "he stands in front of it",
      "leading-foot past the soldier-line",
      "rush-trails at his heels",
    ],
    palette:
      "Heavier Insurgency battle-armor + signal-green chest-plate + iron-and-gunmetal longsword + warm rush-trails + warm provoke-rim + Insurgency battle-line at lower-third + cool battlefield ambient",
    composition:
      "Action mid-shot front three-quarter, Iron Lion mid-stride at frame-centre, soldier-line behind",
    notes:
      "Epic unit. CRITICAL: this Iron Lion (s1_char_105) is rendered in MID-CHARGE (rush keyword) vs s1_char_010's PLANTED stance. Same character, two operational states (s1_char_010 = sentinel-pose, s1_char_105 = charge-pose). Visual continuity preserved (same face, same beard, same archetypal weathered-warrior).",
  },
  {
    cardId: "s1_char_106",
    sceneDelta:
      "Mid-shot. Wraith Calder — male-presenting figure in mid-forties, generic-spectral features (deeply tired eyes, hollowed cheekbones, faint translucent skin-tone — visibly TIRED of dying), in worn Insurgency-slate field-armor with seven small chrome-and-cool-grey GRAVE-MARKER pins lined across the chest (each pin a small etched headstone-shape — seven graves marked). He stands at frame-centre at a small Insurgency cemetery-rise, looking down at a SEVENTH grave-mound at his feet (the seventh, freshly visited). His expression is composed-deliberate. Faint translucent rebirth-doubled-edge runs along his outline (rebirth keyword). Behind him, six other smaller grave-mounds visible at lower-third in the cemetery, each with a small marker. The setting is somber dawn.",
    moodKeywords: [
      "seven graves bear his name across seven battlefields",
      "he has visited each one, and left them all",
      "seven grave-marker pins on chest",
      "deeply tired eyes — tired of dying",
    ],
    palette:
      "Worn Insurgency-slate field-armor + seven chrome-and-cool-grey grave-marker pins + faint translucent skin-tone + translucent rebirth-doubled-edge + Insurgency cemetery-rise + six small grave-mounds + somber dawn-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Calder at frame-centre at seventh grave, six smaller grave-mounds at lower-third",
    notes:
      "Rare unit. The seven grave-pins on chest is the canonical 'seven graves bear his name' visualization. Visible six grave-mounds + one at his feet = seven total (canon-direct). Generic-spectral features must NOT match any named character.",
  },
  {
    cardId: "s1_char_107",
    sceneDelta:
      "Mid-shot. A Signal Operative — male-presenting figure in mid-twenties, generic-anonymous-courier features (plain face, lightly built), in plain Insurgency-aligned messenger-coat with a single small chrome shoulder-comm. He stands at the moment of HAVING ALREADY SENT THE MESSAGE — his right hand is just lowering from his shoulder-comm (the transmission complete), his head is turned slightly toward an off-frame approaching threat (frame-right). On the ground beneath him, a faint translucent transmission-pulse-trail (the message already on its way). His expression is composed-resigned. Faint warm-amber transmission-glow at the comm. The setting is a corner of an Insurgency-aligned alleyway.",
    moodKeywords: [
      "kill the messenger",
      "the message was sent three seconds before you arrived",
      "hand lowering from shoulder-comm — transmission complete",
      "composed-resigned",
    ],
    palette:
      "Insurgency-aligned messenger-coat + chrome shoulder-comm + faint translucent transmission-pulse-trail + warm-amber transmission-glow + Insurgency alleyway + cool low-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Operative at frame-centre, hand lowering from comm, alleyway behind",
    notes:
      "Common unit. Generic-anonymous-courier face must NOT match any named character. The 'message already sent' is the canonical visualization — the threat arrives too late, the sacrifice is forewarned. Approaching off-frame threat preserves no-character-conflation.",
  },
  {
    cardId: "s1_char_108",
    sceneDelta:
      "Wider mid-shot. A Guerrilla Cell — three Insurgency-aligned figures (anonymous, all back-three-quarter, generic-mixed gear in Insurgency-slate field-armor with signal-green chest-rigs) crouched in concealment at frame-centre. They are positioned in the ONE BLIND-SPOT of a vast Panopticon surveillance-grid: the lower-third of the frame shows the cell hidden BEHIND a chrome support-pillar; above and to either side, multiple chrome-and-cool-cyan surveillance-cameras are arrayed in scanning-positions, but their cones-of-view (faint translucent cool-cyan visible-arcs) all sweep AROUND the pillar's blind-side without overlapping into it. Each cell-member holds a weapon. Faint warm backstab-glow rims their leading hands. NO faces visible.",
    moodKeywords: [
      "the panopticon sees all directions but one",
      "that is where they wait",
      "three figures crouched in pillar's blind-side",
      "multiple cameras with sweeping cones not overlapping into blind-spot",
    ],
    palette:
      "Insurgency-slate field-armor + signal-green chest-rigs + chrome support-pillar + multiple chrome-and-cool-cyan surveillance-cameras + faint translucent cool-cyan visible-arcs + warm backstab-glow + cool surveillance-corridor ambient",
    composition:
      "Wider mid-shot, three-figure cell at frame-centre lower-third behind pillar, surveillance-cameras above with sweeping cones",
    notes:
      "Common unit. CRITICAL: anonymous figures (back-three-quarter, generic-mixed) preserve no-character-conflation. The 'one direction the Panopticon doesn't see' is rendered as the visible blind-spot architecture — making the panopticon's failure-state visible.",
  },
  {
    cardId: "s1_char_202",
    sceneDelta:
      "Action mid-shot. A Saboteur — female-presenting figure in late-twenties, generic-quick-features (focused eyes, slight smirk, hair tied back), in Insurgency-slate light infiltration-leathers with signal-green wrist-cuffs. She is mid-EXIT from a sabotaged Architect facility: leading foot already across an open exit-doorway at frame-right, trailing foot just leaving the facility-floor at frame-left. Behind her in the facility-interior, a small visible FIRE has just begun (faint warm flames at frame-left mid-distance — the bonus). She is visibly LEAVING before the alarm — her face shows no urgency, just steady deliberate motion. Faint warm rush-trails at her heels. The exit beyond is dark Insurgency-territory.",
    moodKeywords: [
      "she was in and out before the alarm sounded",
      "the fire was just a bonus",
      "mid-exit through doorway",
      "no urgency, steady deliberate motion",
    ],
    palette:
      "Insurgency-slate light infiltration-leathers + signal-green wrist-cuffs + warm rush-trails + faint warm flame-glow inside facility + dark exit-doorway + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Saboteur at frame-centre mid-exit, beginning fire at frame-left mid-distance",
    notes:
      "Common unit. Generic-quick-features must NOT match any named character (specifically NOT Agent Zero — different visual signature). The 'fire as bonus' framing is rendered as the small fire just-beginning behind her — she didn't need it to succeed.",
  },
  {
    cardId: "s1_pack_008",
    sceneDelta:
      "Wider mid-shot. A Dead Signal Burst — at frame-centre, an old broadcast-tower antenna at the top of a long-abandoned Insurgency communications-station. The antenna is BROADCASTING despite its dead-frequency: faint translucent signal-green burst-rays extend outward in all directions, but the rays are SCREAMING-pattern (jagged-edged, distorted, the canonical 'came back screaming' rendering). Around the antenna, faint cool-violet decay-substance still drifts (the frequency was supposed to be extinct). The station-floor is dust-covered (no human there in years). NO human figure. The deep-distance sky is dark cool-violet at twilight.",
    moodKeywords: [
      "the frequency was supposed to be extinct",
      "it came back screaming",
      "translucent signal-green burst-rays in screaming-pattern",
      "no human figure — long abandoned",
    ],
    palette:
      "Old broadcast-tower antenna + translucent signal-green screaming burst-rays + faint cool-violet decay-substance + dust-covered station-floor + dark cool-violet twilight + cool deep-shadow",
    composition:
      "Wider mid-shot, antenna at frame-centre upper-third, station-floor at lower-third, twilight sky behind",
    notes:
      "Rare spell. NO human figure (the spell IS the broadcast). The 'screaming-pattern' jagged-rays differentiate from normal smooth signal-green. Dust + abandoned station preserve the 'extinct frequency' framing.",
  },
  {
    cardId: "s1_pack_009",
    sceneDelta:
      "Mid-shot. A Covert Operative — anonymous female-presenting figure (back-three-quarter, generic-mixed Insurgency-slate light infiltration-leathers), mid-action of HAVING ALREADY DEPARTED. The frame shows her partially-translucent (already three-quarters-vanished from the current sector) at frame-centre, with a faint translucent silver-mist DEPARTURE-TRAIL extending behind her toward a frame-left position where a faint sound-emission marker (a small chrome shot-pulse-icon) shows where the shot was just FIRED. She is moving fast — she was at the firing-position only a moment ago. NO face visible. The setting is a multi-corridor Insurgency-aligned sector-junction.",
    moodKeywords: [
      "by the time you hear the shot",
      "she is already three sectors away",
      "three-quarters-vanished from current sector",
      "shot-pulse-icon at firing-position behind",
    ],
    palette:
      "Insurgency-slate light infiltration-leathers + faint translucent body (three-quarters-vanished) + faint translucent silver-mist departure-trail + chrome shot-pulse-icon + multi-corridor Insurgency-aligned sector-junction + cool deep-shadow + warm fluorescent ceiling-strip",
    composition:
      "Mid-shot back-three-quarter on Operative, departure-trail extending to frame-left, shot-pulse-icon at trail's origin",
    notes:
      "Common unit. Anonymous figure (back-three-quarter, vanishing) preserves no-character-conflation. The 'three sectors away by the time you hear it' is rendered through the partially-vanished body + departure-trail.",
  },
  {
    cardId: "s1_pack_010",
    sceneDelta:
      "Wider mid-shot. A Signal Repeater — at frame-centre, an Insurgency-aligned broadcast-tower (chrome-and-signal-green, mid-sized, mounted on a low rooftop). The tower is mid-action of TRANSMITTING simultaneously to multiple receivers: faint translucent signal-green ARC-LINES extend outward from the tower in many directions, each arc-line ending at a distant receiver (small chrome receiver-icons faintly visible at varying depths in the deep distance). Approximately a thousand arcs visible (suggesting count without requiring literal thousand). Below the tower, a small cell of anonymous Insurgency-aligned operatives (back-shots only) work at the tower's base maintaining transmission. NO faces visible.",
    moodKeywords: [
      "destroy the tower",
      "the broadcast has already been copied to a thousand receivers",
      "many translucent signal-green arc-lines to distant receivers",
      "anonymous cell at tower-base",
    ],
    palette:
      "Chrome-and-signal-green Insurgency broadcast-tower + translucent signal-green arc-lines + small chrome receiver-icons in deep-distance + Insurgency-slate cell-figures (back-shots) + cool low-rooftop ambient + cool deep-shadow",
    composition:
      "Wider mid-shot, tower at frame-centre, arc-lines extending to many distant receivers, cell at tower-base lower-third",
    notes:
      "Uncommon unit. Anonymous cell (back-shots only) preserves no-character-conflation. The 'thousand receivers' is canon-direct from flavor — rendered as many arc-lines to many receivers without requiring literal count.",
  },
  {
    cardId: "s1_pack_011",
    sceneDelta:
      "Wider mid-shot. An Insurgent Commander — male-presenting figure in mid-fifties, generic-decisive features (composed eyes, deep-furrowed brow, weathered-but-firm jaw), in formal Insurgency-slate-and-warm-leather command-coat with a single signal-green commander-pin. He stands at frame-centre on a low Insurgency-aligned rallying-platform, both hands at his sides, head slightly raised. His face is mid-expression of having JUST GIVEN PERMISSION (not an order — permission). Below him in mid-distance, an Insurgency formation of dozens of soldiers ROARS UPWARD (mouths open, fists raised, the canonical 'has been waiting a long time' release). Faint warm rush-trails at the soldiers' bases (rush keyword granted to formation). His own face is composed-grave; the moment is theirs.",
    moodKeywords: [
      "he does not give orders",
      "he gives permission",
      "the Insurgency has been waiting a long time to hear it",
      "the moment is theirs, not his",
    ],
    palette:
      "Insurgency-slate-and-warm-leather command-coat + signal-green commander-pin + warm rush-trails at soldier-bases + roaring Insurgency formation + warm rallying-platform light + cool deep-shadow + warm dawn-sky behind",
    composition:
      "Wider mid-shot front three-quarter, Commander at frame-centre on platform, formation roaring at lower-third",
    notes:
      "Rare unit. The 'permission not orders' framing is rendered through the Commander's composed-grave expression + the formation's release. Generic-decisive features must NOT match Iron Lion (different specific archetype). Anonymous formation preserves no-character-conflation.",
  },
  {
    cardId: "s1_pack_012",
    sceneDelta:
      "Wider mid-shot. A Rebel Arsenal — a quiet underground Insurgency cache-room at frame-centre. Wooden crates stacked at varying heights fill the lower-half of the frame; the crates are UNMARKED on the outside (no labels, no insignia). One crate at frame-centre is OPEN — revealing INSIDE: chrome-and-signal-green Insurgency-aligned weapons (rifles, energy-blades, signal-emitters) carefully arranged within. The weapons themselves bear small chrome-and-signal-green Insurgency-faction marks (the contents are marked even when the containers aren't). Faint warm low cache-light. NO human figure (the cache is hidden, nobody currently present).",
    moodKeywords: [
      "the crates were unmarked",
      "the weapons inside were not",
      "open crate revealing chrome-and-signal-green weapons",
      "no human figure — hidden cache",
    ],
    palette:
      "Wooden unmarked crates + chrome-and-signal-green Insurgency-aligned weapons + small chrome-and-signal-green faction-marks + warm low cache-light + cool deep-shadow + dim underground ambient",
    composition:
      "Wider mid-shot, cache-room with stacked crates at lower-half, one open crate at frame-centre revealing weapons",
    notes:
      "Common spell. NO human figure (the cache IS the subject). The 'unmarked outside, marked inside' is the visual key — rendered as the open crate's contrast.",
  },
  {
    cardId: "s1_pack_013",
    sceneDelta:
      "Wider mid-shot. A Liberation Protocol — at frame-centre, the moment of a vast Insurgency-aligned ESCAPE-OPERATION: an Architect detention-facility's outer wall is mid-COLLAPSE (visible cool-cyan structural-failure with cool-grey debris falling), and through the breach, dozens of FREED PRISONERS (anonymous, generic-mixed civilians, all in worn Architect detention-uniforms) STREAM OUT into Insurgency-aligned safety. The prisoners are mid-flight, no specific named individual. Behind the breach, the detention-facility interior shows EMPTIED CELLS (cool-cyan light from now-vacant detention-rooms). At the breach-top, a faint translucent signal-green VANISHING-GLYPH propagates outward (the canonical 'vanishing act' visualization — both the prisoners and the IDENTIFICATION-of-them-as-prisoners disappear).",
    moodKeywords: [
      "they called it liberation",
      "the enemy called it a vanishing act",
      "both were correct",
      "dozens of anonymous freed prisoners streaming through breach",
    ],
    palette:
      "Architect detention-facility cool-cyan structural-failure + cool-grey falling debris + worn Architect detention-uniforms + cool-cyan emptied-cell light + translucent signal-green vanishing-glyph + cool deep-shadow + warm Insurgency safety beyond breach",
    composition:
      "Wider mid-shot, detention-wall breach at frame-centre with prisoners streaming through, emptied cells visible behind, vanishing-glyph at breach-top",
    notes:
      "Epic spell. Anonymous prisoners (generic-mixed) preserve no-character-conflation. The 'both correct' framing is rendered through the dual visualization — physical liberation (the breach) + identity-vanishing (the vanishing-glyph above the breach).",
  },
  {
    cardId: "s1_pack_014",
    sceneDelta:
      "Wider mid-shot. Agent Zero, Reborn — same canonical Agent Zero features (mid-thirties, dark cropped hair, scar on left cheek) but rendered with REBIRTH-AURA: faint translucent silver-mist surrounding her body, brighter intensity than her standard renderings (gen_insurgency, s1_char_002 — both above), eyes more luminous deeper-warm-amber (visible signal-survival glow). She stands at the centre of an abandoned Insurgency-radio station — the ROOM where the signal was buried, the frequency burned, the name erased. She is THERE despite all of it. Around her, faint translucent broadcast-script (the new signal she carries forward) emanates outward. Faint warm rush-trails at her heels (rush keyword). Faint translucent rebirth-doubled-edge runs along her outline.",
    moodKeywords: [
      "they buried the signal",
      "they burned the frequency",
      "they erased the name",
      "none of it mattered",
    ],
    palette:
      "Insurgency-slate field-armor + signal-green chest-rig + dark cropped hair + scar on left cheek + faint translucent silver-mist rebirth-aura + luminous deeper-warm-amber eyes + faint translucent broadcast-script + warm rush-trails + translucent rebirth-doubled-edge + abandoned Insurgency-radio station",
    composition:
      "Wider mid-shot front three-quarter, Agent Zero Reborn at frame-centre with rebirth-aura, abandoned radio-station behind",
    notes:
      "Legendary unit. CRITICAL: visual continuity with gen_insurgency + s1_char_002 (same archetypal features) but rendered with REBIRTH-INTENSITY (brighter aura, more luminous eyes, broadcast-script emanation). The 'buried/burned/erased — none of it mattered' framing is rendered through her presence in the room where it all happened to her.",
  },
  {
    cardId: "s1_pack_cosm_trail_fire",
    sceneDelta:
      "Action mid-shot. A Void Flame Runner — female-presenting figure in early-thirties, generic-fierce features (sharp eyes, visible smile of someone who has accepted the price), in dark Insurgency-aligned light-leathers with deep-violet-and-warm-amber Void-marks at the wrists. She is mid-RUN across an Insurgency-aligned terrain, leading-foot landed, trailing-foot mid-arc. From her trailing path, faint translucent VOID-FLAME extends backward — flickering deep-violet-and-warm-amber flames that visibly EAT the ground behind her (the Void taught her). Faint warm rush-trails at her heels. Her face is forward-focused.",
    moodKeywords: [
      "she leaves fire in her wake",
      "the Void taught her that",
      "translucent void-flame eating the ground behind her",
      "deep-violet-and-warm-amber Void-marks at wrists",
    ],
    palette:
      "Dark Insurgency-aligned light-leathers + deep-violet-and-warm-amber Void-marks + translucent void-flame trail + flickering deep-violet flames + warm-amber flame-tint + warm rush-trails + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Runner mid-stride at frame-centre, void-flame trail extending backward",
    notes:
      "Rare unit. Generic-fierce features must NOT match any named character. The deep-violet-and-warm-amber Void-flame distinguishes from common warm-amber/orange fire (Void-touched fire is canonically marked).",
  },
  {
    cardId: "s1_pack_id_kael_recruiter",
    sceneDelta:
      "Mid-shot. Kael, the Recruiter — same canonical contemporary Kael features (mid-thirties dark-hair-greying-at-temples male strategist, sharp dark eyes), but rendered at an EARLIER stage of his career — BEFORE the canonical 'infection': his expression is more IDEALISTIC, more open-faced (less calculating, more believing). He wears worn Insurgency-aligned recruiter's coat (warm-leather over slate, more humble than his s1_char_012 command-coat). He stands at the centre of an Insurgency-aligned recruitment-tent at frame-centre, mid-action of EXTENDING A WELCOME-HAND toward an anonymous prospect at frame-right (only the prospect's hand visible at edge). Behind him, a small Insurgency-aligned banner with 'something worth believing in' framing visible. NO infection-marks visible (the 'before' state per flavor).",
    moodKeywords: [
      "before the infection, Kael built something worth believing in",
      "his soldiers would die for him — many did",
      "more idealistic, more open-faced",
      "extending welcome-hand toward anonymous prospect",
    ],
    palette:
      "Worn Insurgency-aligned recruiter's coat + warm-leather over slate + dark-hair-greying-at-temples + sharp dark eyes + warm recruitment-tent ambient + Insurgency-aligned banner + warm low tent-light",
    composition:
      "Mid-shot front three-quarter, Kael at frame-centre extending welcome-hand, anonymous prospect's hand at frame-right edge",
    notes:
      "Rare unit. CRITICAL spoiler-discipline: same canonical Kael features as s1_char_012 (visual continuity preserved) but rendered at EARLIER career stage — pre-infection, more idealistic. NO infection-marks visible. Continuing spoiler-discipline: no brilliant-white-dominance, no toxic-green outer ring (Source-Reborn Act 5 reveal preserved).",
  },
  {
    cardId: "s1_pack_pet_flicker_imp_1",
    sceneDelta:
      "Tight composition. A Spark Imp — a small humanoid creature, approximately 18cm tall, mid-EXPLOSION at frame-centre. Its body is composed of warm-orange-and-warm-amber spark-substance with internal cool-cyan core-pulse (instable, about to detonate). Its face shows TWO BRIGHT cool-cyan eye-points wide with feral focus and a small chrome-and-cyan jaw. Its body is mid-action of DETONATION — visible bright explosion-tendrils erupting outward from its center. Faint warm rush-trails at its base. The creature exists for one second; this is the second. Background: dark Insurgency-aligned underground.",
    moodKeywords: [
      "exists for exactly one brilliant, violent second",
      "mid-detonation explosion-tendrils erupting",
      "feral cool-cyan eye-points wide",
      "this is the second",
    ],
    palette:
      "Warm-orange-and-warm-amber spark-substance + internal cool-cyan core-pulse + cool-cyan eye-points + chrome-and-cyan jaw + warm explosion-tendrils + warm rush-trails + dark Insurgency-aligned underground",
    composition:
      "Tight composition, Spark Imp at frame-centre mid-detonation",
    notes:
      "Common unit. NO human figure. The 'one violent second' is rendered as the mid-detonation moment — captured in the instant of expense. First stage of flicker-imp lineage.",
  },
  {
    cardId: "s1_pack_pet_flicker_imp_2",
    sceneDelta:
      "Action mid-shot. A Flicker Fiend — adult-stage spark-creature, approximately 50cm tall, body more substantial than the Spark Imp (denser warm-orange-and-warm-amber substance with internal deeper-cool-cyan core-pulse). Mid-action of FLICKERING-STRIKE: visible at TWO POSITIONS at frame-centre simultaneously — one position striking forward, one position striking from a different angle (the canonical 'doesn't flicker to escape — flickers to strike twice'). Both strike-positions show dual cool-cyan eye-points and warm-amber claws. Faint warm celerity-trails between the two positions. NO human figure. Dark Insurgency-aligned underground setting.",
    moodKeywords: [
      "doesn't flicker to escape",
      "flickers to strike twice",
      "two positions simultaneously, dual strikes",
      "warm celerity-trails between positions",
    ],
    palette:
      "Denser warm-orange-and-warm-amber spark-substance + deeper cool-cyan core-pulse + dual cool-cyan eye-points + warm-amber claws + warm celerity-trails + dark Insurgency-aligned underground",
    composition:
      "Action mid-shot, Fiend at TWO frame-centre positions, celerity-trails connecting",
    notes:
      "Rare unit. NO human figure. Second stage of flicker-imp lineage. The 'two positions' is the canonical flicker-strike visualization.",
  },
  {
    cardId: "s1_pack_pet_flicker_imp_3",
    sceneDelta:
      "Wider mid-shot. An Inferno Djinn — vast adult-stage spark-creature, approximately 1.8m tall, body composed of dense warm-orange-and-warm-amber spark-substance fully solidified into a humanoid djinn-form. Its body shows broad-shouldered, powerful proportions with internal cool-cyan core-furnace-glow visible at chest. Where its face would be, three cool-cyan eye-points (escalation: 1→2→3 across lineage). It stands at the centre of a moment of DETONATION — faint warm explosion-tendrils erupting outward from its body in all directions, the explosion mid-flow (the Insurgency's detonation made flesh). Faint warm rush-trails at its base. Behind it, a vast dark Insurgency-aligned underground tunnel showing the demolition-pattern.",
    moodKeywords: [
      "the Insurgency doesn't knock",
      "it detonates",
      "humanoid djinn-form with internal furnace-glow",
      "three cool-cyan eye-points",
    ],
    palette:
      "Dense warm-orange-and-warm-amber spark-substance + internal cool-cyan core-furnace-glow + three cool-cyan eye-points + warm explosion-tendrils + warm rush-trails + dark Insurgency-aligned underground tunnel + warm demolition-light",
    composition:
      "Wider mid-shot front three-quarter, Inferno Djinn at frame-centre with detonation-aura, tunnel behind",
    notes:
      "Epic unit. NO human figure. Third stage of flicker-imp lineage with eye-escalation: 2 → dual → 3. The 'Insurgency detonates' is the canonical visualization.",
  },
  {
    cardId: "s1_pack_pet_spore_fungus_1",
    sceneDelta:
      "Tight composition. A Spore Seedling — a small mushroom-like fungal organism, approximately 8cm tall, growing from a small Insurgency-aligned forest-floor patch at frame-centre. The seedling has a deep-violet-and-cool-cream cap with faint translucent spore-cloud emanating gently upward from beneath the cap (the spore-spread is constant, gentle, ongoing — kill OR ignore both spread it). Tiny faint warm-amber root-fibers visible at the base. The forest-floor around the seedling shows visible earlier-spread (small fungal-patches at varying depths). NO human figure.",
    moodKeywords: [
      "kill it and it spreads",
      "ignore it and it spreads",
      "no good option",
      "translucent spore-cloud emanating gently upward",
    ],
    palette:
      "Deep-violet-and-cool-cream mushroom-cap + translucent spore-cloud + warm-amber root-fibers + Insurgency-aligned forest-floor + earlier-spread fungal-patches + cool ambient + warm low forest-light",
    composition:
      "Tight composition, Seedling at frame-centre, forest-floor with earlier-spread visible",
    notes:
      "Common unit. NO human figure. The 'kill or ignore both spread' is rendered as the constant translucent spore-cloud — the spread is independent of action. First stage of spore-fungus lineage.",
  },
  {
    cardId: "s1_pack_pet_spore_fungus_2",
    sceneDelta:
      "Mid-shot. A Mycelial Bloom — adult-stage fungal organism, approximately 60cm tall, with a wide elaborate BEAUTIFUL bloom-cap (deep-violet-and-cool-cream petals arranged in radial-symmetry, visibly luminous). The bloom is at frame-centre on an Insurgency-aligned forest-floor. From beneath the bloom-cap, dense translucent SPORE-CLOUDS emanate downward — the canonical 'bloom is beautiful, spores are not' contrast: the upper-cap is luminous and lovely; the spore-cloud below is faintly toxic-tinted, drifting outward in a wider pattern. Around the bloom, smaller translucent infected-particles drift upward into the air. NO human figure.",
    moodKeywords: [
      "the bloom is beautiful",
      "the spores are not",
      "luminous radial-symmetry cap above",
      "toxic-tinted spore-cloud drifting outward below",
    ],
    palette:
      "Deep-violet-and-cool-cream luminous bloom-cap + radial-symmetry petals + dense translucent spore-clouds + toxic-tinted spore-tint + Insurgency-aligned forest-floor + warm cap-glow + cool deep-shadow",
    composition:
      "Mid-shot, Bloom at frame-centre, spore-cloud drifting outward beneath",
    notes:
      "Rare unit. NO human figure. Second stage of spore-fungus lineage. The 'bloom beautiful, spores not' is rendered through the visual contrast — luminous cap above, toxic cloud below.",
  },
  {
    cardId: "s1_pack_pet_spore_fungus_3",
    sceneDelta:
      "Wider mid-shot. A Fungal Colossus — vast adult-stage fungal organism, approximately 2.4m tall, with a massive dark-violet-and-deep-cream cap that fills the upper-half of the frame. The Colossus's roots/base extend into a battlefield-floor at lower-third, where ANONYMOUS FALLEN BODIES (back-shots only, generic-mixed combatants from various factions) are partially visible — the Colossus has fed on them. From the Colossus's body, faint translucent deathwatch-script (cool-violet, distinct from Hierarchy phosphor-green and Architect cool-cyan) propagates outward (deathwatch keyword visualized). Around the base, additional smaller fungal-blooms grow from the fallen — the garden grows. NO human face visible.",
    moodKeywords: [
      "it feeds on the fallen",
      "every battlefield is a garden",
      "fallen bodies partially visible at base",
      "deathwatch-script propagating outward",
    ],
    palette:
      "Dark-violet-and-deep-cream massive cap + cool-violet deathwatch-script + battlefield-floor + anonymous fallen bodies + smaller fungal-blooms growing from fallen + cool battlefield ambient + cool deep-shadow",
    composition:
      "Wider mid-shot, Colossus at frame-centre with cap dominating upper-half, fallen bodies + smaller blooms at lower-third",
    notes:
      "Epic unit. NO human face (fallen bodies are back-shots/anonymous). Third stage of spore-fungus lineage. The cool-violet deathwatch-script is a NEW faction-colored variant (distinct from Hierarchy phosphor-green and Architect cool-cyan deathwatch idioms).",
  },
  {
    cardId: "s1_reward_campaign_defiance",
    sceneDelta:
      "Action mid-shot. A Rebel's Conviction — female-presenting figure in mid-twenties, generic-determined features (sharp eyes, set jaw, hair tied back), in standard Insurgency-slate field-armor mid-stride forward at frame-centre. She has just BROKEN FROM FORMATION — anonymous Insurgency-soldier silhouettes visible at frame-left in their original waiting-position, while she has stepped forward alone. Her weapon (a chrome-and-signal-green Insurgency rifle) is forward-aimed. Faint warm rush-trails at her heels (rush keyword). Her face shows decisive defiance — the canonical 'Architect doesn't wait, so neither will I' rendering. Behind her, an Architect target visible at deep-distance.",
    moodKeywords: [
      "they told her to wait for orders",
      "she told them the Architect doesn't wait, so neither will she",
      "broken from formation, stepped forward alone",
      "decisive defiance",
    ],
    palette:
      "Insurgency-slate field-armor + chrome-and-signal-green rifle + warm rush-trails + Insurgency-soldier silhouettes at frame-left + warm dawn-light + cool deep-shadow",
    composition:
      "Action mid-shot front three-quarter, Rebel at frame-centre mid-stride, formation behind at frame-left",
    notes:
      "Rare unit. Generic-determined features must NOT match any named character. The 'broke from formation' is rendered as the visible distance between her current position and the formation behind.",
  },
  {
    cardId: "s1_reward_class_spy",
    sceneDelta:
      "Mid-shot. A Master Spy — female-presenting figure in late-thirties (NOT The Eyes, NOT Agent Zero — distinct generic-cool-precise features), in dark Insurgency-slate spy-leathers with deeper-than-standard chrome-and-signal-green wrist-cuffs (Master-rank tier indicator). She stands at the centre of a quiet Insurgency safe-house briefing-room. In her right hand, a small CHROME EXTRACTED-SECRET-DEVICE (a fingertip-sized signal-storage chip glowing faintly cool-cyan). In her left hand, multiple SIMILAR DEVICES are clipped at her belt (visible cluster — every secret extracted is in the arsenal). Faint signal-green stealth-shimmer at her body-edge. Her face is composed, slightly tired (Master-rank veterans carry the cost).",
    moodKeywords: [
      "every secret extracted is another weapon in the arsenal",
      "Master-rank tier with belt-cluster of extracted-secret devices",
      "composed, slightly tired",
      "deeper-rank chrome-and-signal-green wrist-cuffs",
    ],
    palette:
      "Dark Insurgency-slate spy-leathers + chrome-and-signal-green wrist-cuffs + chrome extracted-secret-device + belt-cluster of similar devices + signal-green stealth-shimmer + warm low briefing-room light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Master Spy at frame-centre with extracted-device, briefing-room behind",
    notes:
      "Rare unit. CRITICAL: this is a class-rank reward Master Spy (NOT Agent Zero, NOT The Eyes — distinct character). Generic-cool-precise features. Echoes Master Engineer (s1_reward_class_engineer) and Master Oracle (s1_reward_class_oracle) class-rank-reward pattern.",
  },
  {
    cardId: "s1_reward_companion_zero",
    sceneDelta:
      "Mid-shot. Zero's Parting Gift — at frame-centre, a small chrome-and-signal-green INSURGENCY DATA-CYLINDER on a low surface, approximately 15cm tall, faintly luminous with internal cool-cyan signal-storage. The cylinder bears Agent Zero's small etched personal-mark (a tiny chrome scarred-zero glyph, recognizable from her body's left-cheek-scar motif). Around the cylinder, faint translucent signal-green broadcast-pulse propagates outward (the gift is still active). An anonymous figure (only their hands visible at frame-bottom-edge) holds the cylinder up — discovering it. The setting is an Insurgency-aligned room — perhaps a safe-house. NO Agent Zero present (the GIFT is what remains).",
    moodKeywords: [
      "Agent Zero always left something behind",
      "a frequency, a signal, a reason to keep fighting",
      "chrome-and-signal-green data-cylinder with personal-mark",
      "anonymous hands discovering the gift",
    ],
    palette:
      "Chrome-and-signal-green data-cylinder + cool-cyan internal signal-storage + chrome scarred-zero personal-mark + translucent signal-green broadcast-pulse + anonymous hands + Insurgency-aligned safe-house + warm low light + cool deep-shadow",
    composition:
      "Mid-shot, data-cylinder at frame-centre on surface, anonymous discovering-hands at frame-bottom-edge",
    notes:
      "Rare unit. Anonymous discovering-figure (hands only) preserves no-character-conflation. The personal-mark scarred-zero glyph references Agent Zero's left-cheek-scar without requiring her render.",
  },
  {
    cardId: "s1_reward_crew_mission",
    sceneDelta:
      "Wider mid-shot. A Mission Briefing — at the centre of an Insurgency-aligned safe-house briefing-room, a low chrome-and-signal-green briefing-table holds an open mission-folder (warm-cream parchment with cool-cyan target-glyph visible on the page). Around the table, FIVE SILHOUETTES of Insurgency-aligned operatives stand in semicircle (anonymous, generic-mixed back-three-quarter, all in Insurgency-slate field-gear). They are mid-action of NOT NEEDING TO READ the briefing — they have done this twenty-five times before; they now stand looking at each other rather than the page (eyes on each other, attentive, ready for targets). NO faces visible. Faint warm low briefing-light.",
    moodKeywords: [
      "twenty-five missions deep",
      "the crew doesn't need orders anymore",
      "they need targets",
      "five silhouettes looking at each other rather than the page",
    ],
    palette:
      "Chrome-and-signal-green briefing-table + warm-cream mission-folder parchment + cool-cyan target-glyph + Insurgency-slate field-gear silhouettes + warm low briefing-light + cool deep-shadow",
    composition:
      "Wider mid-shot, briefing-table at frame-centre, five anonymous silhouettes in semicircle around",
    notes:
      "Rare spell. Anonymous crew (all back-three-quarter) preserves no-character-conflation. The 'looking at each other not the page' is the canonical visualization of crew-cohesion past the need for instruction.",
  },
  {
    cardId: "s1_reward_eidolon_echo",
    sceneDelta:
      "Mid-shot. Echo, the Resonance — female-presenting figure in late-twenties, generic-poised features (calm eyes, slight smile, hair pulled back), in Insurgency-aligned cool-cream-and-signal-green resonance-mage's robes with a single small chrome-and-signal-green tuning-fork pendant at the throat. She stands at frame-centre at an Insurgency-aligned mid-battle position, mid-action of HAVING JUST STRUCK. From the strike, faint translucent silver-mist RESONANCE-RINGS extend outward in concentric waves, and as the rings reach allied figures (anonymous Insurgency-aligned silhouettes at frame-left and frame-right edges), the rings MEND visible damage on those allies — small wounds visibly healing in real-time as the resonance washes over them.",
    moodKeywords: [
      "every blow she strikes rings outward",
      "mending what was broken",
      "translucent silver-mist resonance-rings extending in concentric waves",
      "wounds healing as resonance reaches allies",
    ],
    palette:
      "Insurgency-aligned cool-cream-and-signal-green resonance-mage's robes + chrome-and-signal-green tuning-fork pendant + translucent silver-mist resonance-rings + warm-cream healing-pulses on allies + Insurgency-aligned mid-battle background + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Echo at frame-centre post-strike, resonance-rings extending outward, allies at frame-edges",
    notes:
      "Rare unit. Anonymous allies preserve no-character-conflation. The 'every blow rings outward and mends' is the canonical resonance-cycle visualization.",
  },
  {
    cardId: "s1_reward_guild_recruit",
    sceneDelta:
      "Mid-shot. A Fresh Recruit — male-presenting figure in late-teens, generic-untrained features (visible anger in the eyes, slight tremble in the body, no calm — pure willingness), in plain civilian clothes (no Insurgency-issue gear, just a worn jacket and trousers — they have no training, no equipment yet). He stands at frame-centre at the threshold of an Insurgency-aligned recruitment-tent, mid-step forward. In his right hand, a small chrome blade (clearly civilian, repurposed). Faint warm rush-trails at his heels (rush keyword — he is moving forward despite having nothing). His face is determined, scared, MOVING.",
    moodKeywords: [
      "no training. no gear",
      "just anger and a willingness to die for the cause",
      "civilian clothes, civilian blade",
      "determined, scared, moving",
    ],
    palette:
      "Worn civilian jacket and trousers + chrome civilian blade + warm rush-trails + Insurgency-aligned recruitment-tent threshold + warm low recruitment-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Recruit at frame-centre at tent-threshold, mid-step forward",
    notes:
      "Common unit. Generic-untrained features must NOT match any named character. The 'no gear, no training' is rendered as the civilian clothes + repurposed civilian blade — visible amateur-state.",
  },
  {
    cardId: "s1_reward_trade_insurgency",
    sceneDelta:
      "Wider mid-shot. A Smuggler's Cache — at frame-centre, a stack of WOODEN CRATES at an Insurgency-aligned underground waypoint. The TOP CRATE is open, revealing its FALSE BOTTOM lifted — beneath the false bottom, a small chrome-and-signal-green INSURGENCY DATA-DEVICE (similar to Zero's data-cylinder s1_reward_companion_zero) is revealed. From the device, faint translucent signal-green frequency-pulse extends upward — the canonical 'every frequency led to Agent Zero's ghost.' The frequency-pulse extends to the deep-distance where it forms into a faint translucent SHAPE OF AGENT ZERO (only suggestion — silver-mist outline, no specific facial detail, recognizable by silhouette only).",
    moodKeywords: [
      "every crate had a false bottom",
      "every false bottom had a frequency",
      "every frequency led to Agent Zero's ghost",
      "translucent silver-mist Agent Zero outline at frequency's destination",
    ],
    palette:
      "Wooden Insurgency-aligned crates + chrome-and-signal-green data-device + cool-cyan internal storage + translucent signal-green frequency-pulse + faint translucent silver-mist Agent Zero outline + cool underground ambient + warm low waypoint-light",
    composition:
      "Wider mid-shot, crates at frame-centre with open false-bottom, frequency-pulse extending toward Agent Zero outline at deep-distance",
    notes:
      "Rare spell. CRITICAL: Agent Zero's outline is SILHOUETTE ONLY (no facial detail) — preserves Agent Zero's iconic features without rendering her literally. The 'ghost' framing is rendered through the translucent silver-mist outline.",
  },
  {
    cardId: "s1_reward_vote_t1_defiance",
    sceneDelta:
      "Mid-shot. A Signal Booster — anonymous Insurgency-aligned figure (back-three-quarter, generic-mixed Insurgency-slate field-gear), at the centre of an Insurgency-aligned communications-room. They tend to a chrome-and-signal-green BOOSTER-DEVICE on a wall-mounted rack at frame-right (the device pulses faintly signal-green). From the device, faint translucent signal-green AMPLIFICATION-RIPPLES extend outward through the room and beyond. The amplification carries Agent Zero's last frequency — visualized as faint translucent silver-mist transmission-script (illegible suggestion of her signal). NO face visible (back-three-quarter only).",
    moodKeywords: [
      "Agent Zero's last frequency still carries",
      "the Booster makes sure everyone hears it",
      "anonymous tender at chrome-and-signal-green device",
      "amplification-ripples extending outward",
    ],
    palette:
      "Insurgency-slate field-gear + chrome-and-signal-green booster-device + faint translucent signal-green amplification-ripples + faint translucent silver-mist transmission-script + Insurgency communications-room + warm low room-light",
    composition:
      "Mid-shot back-three-quarter, anonymous tender at frame-centre at booster-device, amplification-ripples extending outward",
    notes:
      "Common unit. Anonymous tender (back-three-quarter) preserves no-character-conflation. The 'last frequency still carries' is rendered as the visible amplification-ripples + transmission-script.",
  },
  {
    cardId: "s1_song_091",
    sceneDelta:
      "Wider mid-shot. I Love War — at frame-centre, a tall figure WEARING DR. LYRA VOX'S SKIN as a weapon (the canonical 'Warlord wore Vox's skin like a weapon' visualization): the figure has Vox's external body-form (consistent with s1_char_006's neural-engineer features — chrome temple-band, white coat) but the eyes are NOT VOX'S — they are deep-violet WARLORD eyes, alien beneath the borrowed face. The skin shows visible CHROME-AND-COOL-CYAN NANOBOT-PATTERNS at the seams (hair-thin chrome circuits running along the jawline, the wrists, the neck — the nanobots that delivered the conquest). The Warlord's mouth is mid-words ('war IS love'). At lower-third, an anonymous SILVER-MIST AGENT ZERO outline (silhouette only, no facial detail) is mid-DISCOVERY of what is happening. Faint warm pierce-glow rims the Warlord's hands; faint warm overcharge-glow at the body's seams.",
    moodKeywords: [
      "the Warlord wore Vox's skin like a weapon",
      "Agent Zero never saw the nanobots coming",
      "war IS love to the Warlord",
      "this was an act of intimate conquest",
    ],
    palette:
      "Vox's chrome temple-band + white coat + deep-violet WARLORD eyes (NOT Vox's) + chrome-and-cool-cyan nanobot-patterns at seams + warm pierce-glow + warm overcharge-glow + silver-mist Agent Zero outline + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Warlord-in-Vox's-skin at frame-centre, Agent Zero silver-mist outline at lower-third",
    notes:
      "Epic spell. CRITICAL spoiler-discipline: the canonical Warlord-using-Vox is established lore. Agent Zero rendered as silver-mist outline (no facial detail) consistent with her ghost-iconography in this set. The deep-violet WARLORD eyes are the visual key to 'borrowed skin' — different from Vox's natural eye-color rendering in s1_char_006.",
  },
  {
    cardId: "s1_spell_104",
    sceneDelta:
      "Mid-shot. A Signal Intercept — at frame-centre, a small Insurgency-aligned RECEIVER-DEVICE on a low table in a quiet rebel-cell room. The device's chrome-and-signal-green frequency-display reads 'MIDNIGHT' in cool-cyan numerals. From the device, faint translucent silver-mist transmission-script propagates upward — Agent Zero's frequency, still alive. Around the table, FIVE anonymous rebel-cell members (back-three-quarter, Insurgency-slate gear) are gathered listening — heads slightly inclined toward the device, eyes intent. Faint warm low cell-light. The setting is intimate, sacred. NO faces visible.",
    moodKeywords: [
      "the signal died with Agent Zero, but the frequency lives on",
      "every rebel cell still tunes in at midnight",
      "MIDNIGHT on chrome-and-signal-green frequency-display",
      "five anonymous listeners gathered, intimate sacred",
    ],
    palette:
      "Chrome-and-signal-green receiver-device + cool-cyan MIDNIGHT display + translucent silver-mist transmission-script + Insurgency-slate cell-gear + warm low cell-light + cool deep-shadow",
    composition:
      "Mid-shot, receiver-device at frame-centre on table, five anonymous listeners arrayed around",
    notes:
      "Common spell. Anonymous listeners (back-three-quarter) preserve no-character-conflation. The MIDNIGHT display + tuning-in framing is canon-direct from flavor. NO Agent Zero render — only her transmission.",
  },
  {
    cardId: "s1_spell_105",
    sceneDelta:
      "Action mid-shot. A Guerrilla Strike — at frame-centre, the moment of INSURGENCY STRIKE on an Architect-aligned target: an anonymous Architect-combat unit (chrome-and-cool-cyan plating, generic-architect features per the broader faction set) at frame-right is mid-fall (struck), with multiple translucent ATTACK-VECTOR LINES converging on it from MULTIPLE OFF-FRAME DIRECTIONS (each line representing a different rebel attacking from a different angle, none of them visible — they have already gone). The vectors visibly DISSIPATE at the impact-point. Faint warm-amber strike-flares at the impact-point. NO Insurgency-aligned figure visible — the rebels were here and have already gone.",
    moodKeywords: [
      "they never see us coming",
      "by the time they've calculated our trajectory, we've already gone",
      "multiple attack-vectors converging from off-frame directions",
      "vectors dissipating after impact",
    ],
    palette:
      "Chrome-and-cool-cyan Architect-combat unit + multiple translucent attack-vector lines + warm-amber strike-flares + cool battlefield ambient + cool deep-shadow",
    composition:
      "Action mid-shot, Architect target at frame-right mid-fall, attack-vectors converging from multiple off-frame directions",
    notes:
      "Common spell. NO Insurgency-aligned figure visible (the rebels are gone — canon-direct from flavor). Anonymous Architect target preserves no-character-conflation.",
  },
  {
    cardId: "s1_spell_106",
    sceneDelta:
      "Mid-shot. An Encrypted Broadcast — at frame-centre, a chrome-and-signal-green Insurgency BROADCAST-DEVICE displaying a complex AGENT-ZERO ENCRYPTION-PATTERN (a dense interweaving cool-cyan-and-signal-green geometric pattern visibly indecipherable). Around the device, faint translucent silver-mist transmission-script extends outward (the broadcast in flight). Critically, at the deep-distance frame-edges, faint translucent ARCHITECT FIREWALL barriers visible BEING-PUNCHED-THROUGH by the encrypted signal — the broadcast passes the firewall WITHOUT BREAKING IT (the firewall doesn't know it has been crossed; the dead woman's handshake is invisible to it). NO human figure (the broadcast IS the spell).",
    moodKeywords: [
      "Agent Zero's encryption keys were never recovered",
      "a dead woman's handshake that no firewall can parse",
      "AGENT-ZERO ENCRYPTION-PATTERN displayed on device",
      "broadcast crossing firewall without breaking it",
    ],
    palette:
      "Chrome-and-signal-green broadcast-device + dense cool-cyan-and-signal-green encryption-pattern + translucent silver-mist transmission-script + faint translucent Architect firewall barriers + cool deep-shadow",
    composition:
      "Mid-shot, broadcast-device at frame-centre, transmission-script extending to firewalls at deep-distance frame-edges",
    notes:
      "Uncommon spell. NO human figure. The 'dead woman's handshake' framing is rendered through the indecipherable encryption-pattern + the firewalls being passed without trigger.",
  },
  {
    cardId: "s1_spell_107",
    sceneDelta:
      "Wider mid-shot. A Dead Frequency Jam — at frame-centre, a vast Architect-aligned communications-grid being JAMMED by a deep-distance Insurgency broadcast. The broadcast's source is implied off-frame at deep-distance (faint translucent silver-mist arrival-rays converging toward the grid from one direction). The Architect-grid (multiple chrome-and-cool-cyan transmission-towers visible in mid-distance) is mid-failure: cool-cyan transmission-arcs are visibly INTERRUPTED at multiple points, the towers are mid-flicker. Around them, anonymous Architect-faction operators (back-shots only, generic chrome-and-cool-cyan uniforms) scramble in the foreground at lower-third trying to repair. The broadcast that did this was meant for the operators NOT for the Insurgency-allies (canonical 'meant for everyone else'). NO Insurgency figure visible.",
    moodKeywords: [
      "the broadcast that killed Agent Zero was never meant for her allies",
      "it was meant for everyone else",
      "Architect-grid mid-failure with interrupted transmission-arcs",
      "anonymous operators scrambling to repair",
    ],
    palette:
      "Architect chrome-and-cool-cyan transmission-towers + interrupted cool-cyan transmission-arcs + faint translucent silver-mist arrival-rays + anonymous Architect-operator silhouettes + cool deep-shadow + warm low communications-room light",
    composition:
      "Wider mid-shot, Architect-grid at frame-centre with interrupted arcs, operators scrambling at lower-third",
    notes:
      "Rare spell. Anonymous Architect operators (back-shots) preserve no-character-conflation. NO Insurgency-aligned figure visible (the spell is being delivered remotely). The 'meant for everyone else' is the canonical tactical-context made visible.",
  },
  {
    cardId: "s1_spell_206",
    sceneDelta:
      "Wider mid-shot. A Supply Drop — at frame-centre, an Insurgency-aligned chrome-and-signal-green SUPPLY-CRATE descending through the air via translucent silver-mist parachute (visible canopy at upper-third). The crate is approximately 1m cube, mid-descent. Below the crate at lower-third, anonymous Insurgency-aligned figures (back-three-quarter, generic-mixed Insurgency-slate gear) gather in a small semicircle waiting to receive — hands raised in welcome-gesture, hopeful posture. Faint warm-amber HOPE-AURA visible around the figures (the canonical 'hope and ammunition' rendering); inside the crate (faintly visible through translucent panel), chrome-and-signal-green ammunition-cartridges glint. Cool sky above, Insurgency-aligned terrain below.",
    moodKeywords: [
      "the resistance runs on hope and ammunition",
      "this crate has both",
      "supply-crate mid-descent via silver-mist parachute",
      "warm-amber hope-aura around waiting receivers",
    ],
    palette:
      "Chrome-and-signal-green supply-crate + translucent silver-mist parachute-canopy + Insurgency-slate gear + warm-amber hope-aura + chrome-and-signal-green ammunition-cartridges + cool sky + Insurgency-aligned terrain",
    composition:
      "Wider mid-shot, parachute at upper-third, crate mid-descent at frame-centre, anonymous receivers at lower-third",
    notes:
      "Common spell. Anonymous receivers (back-three-quarter) preserve no-character-conflation. The hope-aura + visible-ammunition combination renders 'both' from flavor.",
  },
  {
    cardId: "s1_spell_207",
    sceneDelta:
      "Action mid-shot. An Ambush Protocol — at frame-centre, an Architect patrol unit (anonymous chrome-and-cool-cyan combat-figures, three of them, all back-three-quarter walking AWAY from camera into a cool-cyan corridor) is mid-action of being ambushed: from off-frame at frame-edges, multiple ATTACK-VECTOR LINES converge on the patrol from FOUR DIFFERENT DIRECTIONS (the rebels are positioned around the patrol, none yet visible). The vectors are mid-flight (the strike has just begun). Faint warm-amber strike-flares at multiple impact-points on the patrol. NO Insurgency figure visible — they are still hidden in their positions. The corridor is dim, narrow, exit-blocked.",
    moodKeywords: [
      "they never see us coming",
      "that is the point",
      "Architect patrol mid-ambush from four directions",
      "rebels still hidden",
    ],
    palette:
      "Anonymous chrome-and-cool-cyan Architect-combat figures + multiple attack-vector lines from four directions + warm-amber strike-flares + dim narrow cool-cyan corridor + cool deep-shadow",
    composition:
      "Action mid-shot, Architect patrol at frame-centre walking away, attack-vectors converging from frame-edges",
    notes:
      "Uncommon spell. Anonymous Architect patrol (back-three-quarter) preserves no-character-conflation. NO visible Insurgency figures (canon-direct: 'never see us coming'). Echoes Guerrilla Strike (s1_spell_105) but with patrol-context vs single-target-context.",
  },
  {
    cardId: "s1_spell_208",
    sceneDelta:
      "Wider mid-shot. A Rebel Yell — at frame-centre, a small Insurgency-aligned battle-line (approximately 100 anonymous Insurgency-slate-and-signal-green figures arrayed across mid-distance) at the moment of MASS-OUTBURST: the canonical 'starts in one throat and ends in a hundred fists.' At the frame-CENTRE of the line, a SINGLE figure (anonymous, back-three-quarter, forward of the line) is mid-shout (head thrown back, mouth open, fist raised). Around her, faint translucent warm-cream sound-waves emanate outward across the line. Following her shout, the rest of the line is RESPONDING: 99 raised fists in semicircular wave moving outward from the originator. NO faces visible (all back-three-quarter). The setting is open battlefield-terrain at dawn.",
    moodKeywords: [
      "the cry starts in one throat",
      "and ends in a hundred fists",
      "single originator at line-centre, hundred responders behind",
      "warm-cream sound-waves emanating outward",
    ],
    palette:
      "Insurgency-slate-and-signal-green battle-line + warm-cream sound-waves + raised fists in semicircular wave + cool battlefield-terrain + warm dawn-light + cool deep-shadow",
    composition:
      "Wider mid-shot back-three-quarter, originator at frame-centre forward, line of 100 responders behind in semicircular wave",
    notes:
      "Common spell. Anonymous all (back-three-quarter) preserves no-character-conflation. The 'one throat, hundred fists' is rendered through the visible originator + responder-wave geometry.",
  },
  {
    cardId: "s1_spell_209",
    sceneDelta:
      "Mid-shot. A Safe House — at frame-centre, a quiet Insurgency-aligned doorway in a worn warm-leather door, faintly luminous WARM CANDLE-LIGHT visible through the door's small window (the canonical 'wait for the candle' signal). Below the door, three faint scuff-marks on the threshold (where multiple visitors have knocked three times). An anonymous figure (back-three-quarter, generic Insurgency-aligned traveler's-clothes, hood pulled up) stands at the door, hand mid-knock — third knock just delivered. Around the figure, faint warm protective-aura (the safe-house's magic of welcome). NO face visible. The setting is a quiet alleyway at dusk; cool deep-shadow.",
    moodKeywords: [
      "knock three times. wait for the candle",
      "say the name they gave you when you first resisted",
      "candle-light visible through door window",
      "three scuff-marks on threshold from previous visitors",
    ],
    palette:
      "Worn warm-leather door + warm candle-light through window + three scuff-marks at threshold + Insurgency-aligned traveler's-clothes + warm protective-aura + cool dusk alleyway + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter, anonymous visitor at door at frame-centre, candle-window above hand",
    notes:
      "Common spell. Anonymous visitor (back-three-quarter, hooded) preserves no-character-conflation. The 'three knocks + candle' is the canonical safe-house ritual — rendered through the scuff-marks + the lit candle.",
  },
  {
    cardId: "s1_spell_210",
    sceneDelta:
      "Mid-shot. An Intel Leak — at frame-centre, an Architect-aligned chrome-and-cool-cyan VAULT-WALL with a SMALL CRACK (canon-direct from flavor: 'every wall has cracks'). Through the crack, faint translucent silver-mist DATA-RIBBONS extend outward — chrome-and-signal-green DATA-FRAGMENTS visibly leaking from the vault interior to the Insurgency-aligned recipient's hands at frame-right edge (only the recipient's hand visible, generic Insurgency-slate sleeve). On the recipient's palm, a small CHROME-AND-SIGNAL-GREEN KEY (the canonical 'every code has a key' rendering — the resistance has it). NO recipient face visible. Around the crack, faint warm-amber leak-glow.",
    moodKeywords: [
      "every wall has cracks",
      "every code has a key",
      "the resistance finds both",
      "translucent data-ribbons leaking through wall-crack to recipient's palm",
    ],
    palette:
      "Architect chrome-and-cool-cyan vault-wall + small wall-crack + translucent silver-mist data-ribbons + chrome-and-signal-green data-fragments + chrome-and-signal-green key on palm + warm-amber leak-glow + cool deep-shadow",
    composition:
      "Mid-shot, vault-wall at frame-centre, data-ribbons leaking to anonymous palm at frame-right edge",
    notes:
      "Uncommon spell. Anonymous recipient (hand only) preserves no-character-conflation. The wall-crack + key-on-palm is the canonical 'wall and code, both broken' visualization.",
  },
  {
    cardId: "s1_spell_211",
    sceneDelta:
      "Wider mid-shot. A Scorched Earth — at frame-centre, a vast Insurgency-aligned terrain in flames: warm orange-and-amber fire spreading across the lower-half of the frame, the fire visibly ENGULFING BOTH FRIENDLY AND ENEMY POSITIONS without distinction. At frame-left, anonymous Insurgency-slate figures (back-three-quarter) are partially in the fire's path; at frame-right, anonymous Architect-cyan figures are also in the path. The fire moves indiscriminately. In the deep-distance, an Insurgency-aligned commander-silhouette (back-three-quarter, anonymous) watches from a high vantage — the desperate decision-maker who set the fire. Above, a cool-violet desperate sky.",
    moodKeywords: [
      "the fire does not distinguish between friend and foe",
      "neither does desperation",
      "fire engulfing both Insurgency and Architect positions indiscriminately",
      "anonymous Insurgency-commander watching from high vantage",
    ],
    palette:
      "Vast warm orange-and-amber fire + Insurgency-slate figures in path + Architect-cyan figures in path + Insurgency-commander silhouette at high vantage + cool-violet desperate sky + cool deep-shadow",
    composition:
      "Wider mid-shot, fire at lower-half spreading both ways, friend/foe figures both in path, commander silhouette at deep-distance high vantage",
    notes:
      "Rare spell. Anonymous figures across both factions (all back-three-quarter) preserve no-character-conflation. The 'no distinction' is the canonical desperate-tactical visualization — both sides equally consumed.",
  },
] as const;

/**
 * Insurgency faction's prompt registry, keyed by card id.
 *
 * Currently populated: 51 / 51 cards — COMPLETE
 * (gen_insurgency, s1_char_002, s1_char_010, s1_char_011,
 *  s1_char_012, s1_char_026, s1_char_028, s1_char_031,
 *  s1_char_040, s1_char_041, s1_char_044, s1_char_047,
 *  s1_char_105, s1_char_106, s1_char_107, s1_char_108,
 *  s1_char_202, s1_pack_008-014, s1_pack_cosm_trail_fire,
 *  s1_pack_id_kael_recruiter, s1_pack_pet_flicker_imp_1-3,
 *  s1_pack_pet_spore_fungus_1-3,
 *  s1_reward_campaign_defiance, s1_reward_class_spy,
 *  s1_reward_companion_zero, s1_reward_crew_mission,
 *  s1_reward_eidolon_echo, s1_reward_guild_recruit,
 *  s1_reward_trade_insurgency, s1_reward_vote_t1_defiance,
 *  s1_song_091, s1_spell_104-107, s1_spell_206-211).
 */
export const INSURGENCY_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(INSURGENCY_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
