/* ═══════════════════════════════════════════════════════
   ACT 1 ART PROMPTS — canonical prompt catalog

   Nano Banana 2 prompts for the Act 1 asset delivery queue
   per docs/production/ACT_1_SHIP_READY_BIBLE.md §22.

   This module defines the canonical, canonical-id-keyed prompt
   set. apps/scripts/generate-act1-art-csv.ts consumes it to
   emit production-queue CSVs.

   Style anchor (Act 1 Bible §0.3): every prompt inherits the
   warm-gold / institutional-steel / film-grain biographical
   aesthetic. The shared anchor ships as ACT1_GLOBAL_STYLE_ANCHOR
   below so per-prompt entries can compose rather than re-quote.

   Categories:
     - opponent_portrait   (§2.2-2.13, 12 prompts)
     - battlefield         (§22.1, 10 prompts — future chunk)
     - card_art            (§22.3, 14 prompts — future chunk)

   This first chunk ships the 12 opponent portraits.
   ═══════════════════════════════════════════════════════ */

export type Act1ArtCategory =
  | "opponent_portrait"
  | "battlefield"
  | "card_art"
  | "slideshow_frame";

export type Priority = "P0" | "P1" | "P2";

export interface Act1ArtPrompt {
  /** Canonical asset id matching §22 manifest. */
  assetId: string;
  /** Human-readable display label. */
  name: string;
  /** Asset category. */
  category: Act1ArtCategory;
  /** Which Cycle / §X.Y this asset belongs to. */
  cycle: "A" | "B" | "C" | "finale" | "trial";
  /** Act 1 Bible section anchoring the canonical spec. */
  bibleSection: string;
  /** The Nano Banana 2 prompt text (without the global style anchor). */
  prompt: string;
  /** Target resolution, following §22 manifests. */
  resolution: string;
  /** Delivery priority. */
  priority: Priority;
  /** Optional dependencies (e.g., "global_style_anchor", "continuity_ref_B3"). */
  dependencies?: readonly string[];
}

/**
 * Act 1 Global Style Anchor — per §0.3. Producers must prepend
 * this to every prompt's `prompt` field before submission to
 * Nano Banana 2. The CSV generator composes it automatically.
 */
export const ACT1_GLOBAL_STYLE_ANCHOR =
  "Hyper-realistic cinematic composition with a strong biographical quality — every frame should feel like it's been pulled from a recovered personal archive. Palette: warmer and more nostalgic than the Prelude's cold cyan; dominant warm gold #fbbf24, institutional steel grey, deep wood panelling, faint film-grain sepia undertone. Subjects rendered with the specificity of photographic portraiture. Film grain. Anamorphic lens flares where warm light meets composition edges. 1920×1080 / 16:9 / 4K. No rendered text unless explicitly flagged.";

/* ─── CYCLE A opponent portraits (§§2.2–2.4) ─── */

const CYCLE_A_PORTRAITS: readonly Act1ArtPrompt[] = [
  {
    assetId: "portrait_minnie_meme",
    name: "Minnie the Meme",
    category: "opponent_portrait",
    cycle: "A",
    bibleSection: "§2.2",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seven-year-old girl in three-quarter profile, seated at a Celebration schoolyard card table, holding one card face-down in her right hand. She wears a black plastic headband with two round felt-covered Minnie Mouse ears — Disney-theme-park-souvenir style, worn earnestly not ironically. Warm gold Celebration afternoon lighting, ~2:00 PM sun-angle, faint parade-float bokeh in background. Expression: earnest, attentive, the specific attention of a child who is absolutely certain she is about to see something. She is a cosmic Archon in a child's body — her voice is ancient, viral, amused, but her face is a seven-year-old's face; production must render only the seven-year-old. Short dark-brown hair under the headband. Plain pastel sundress. Bare knees, small scuff on the left knee. The ears are the visual signifier of her Archon-of-the-Meme identity: a corporate-nostalgic artifact worn as crown jewelry.",
  },
  {
    assetId: "portrait_corey_collector",
    name: "Corey the Collector",
    category: "opponent_portrait",
    cycle: "A",
    bibleSection: "§2.3",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seven-year-old boy in three-quarter profile, seated at the same Celebration schoolyard card table, holding an amber glass jar in both hands at chest height. The jar contains approximately a dozen small translucent coins with faint, out-of-focus imagery visible on their faces. His expression is grateful — he is thanking the person across the table for playing. Warm 4:30 PM gold lighting (later, lower angle than the Minnie portrait), longer shadows, Day 20 Celebration parade banners in background (different palette than Day 10). Short brown hair, round face, small hands carefully cradling the jar. Plain earth-tone sweater. The jar catches the warm light deliberately — the amber-coin glow is the portrait's visual hinge. He is an Archon of the Collector; render as the seven-year-old only.",
  },
  {
    assetId: "portrait_kanshi_sha_watcher",
    name: "Kanshi Sha the Watcher",
    category: "opponent_portrait",
    cycle: "A",
    bibleSection: "§2.4",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seven-year-old girl in three-quarter profile, seated on the graduation-pavilion stage at Celebration, wearing a half-finished white Ocularum mask. The mask covers the upper-left quadrant of her face — forehead and left eye — in smooth matte bone-white with no visible seams; the right half of her face (right cheek, right eye, mouth, chin) is the child's own, visible and unmasked. Expression: calm, attentive, non-blinking in the way the cosmic Watcher canonically does not blink. Long straight dark-brown hair, neatly combed. Formal pale-grey graduation robe over a white shift. Low-angle evening 6:30 PM sun through the pavilion pillars, warm-gold rim-lit, parents and Mascoteers visible as soft-focus silhouettes at the frame edges (Day 28 is the only Cycle A battle with witnesses). The mask catches the warm light as a single flat white surface against the warm-gold environment.",
  },
];

/* ─── CYCLE B opponent portraits (§§2.5–2.9) ─── */

const CYCLE_B_PORTRAITS: readonly Act1ArtPrompt[] = [
  {
    assetId: "portrait_young_iron_lion",
    name: "Young Iron Lion",
    category: "opponent_portrait",
    cycle: "B",
    bibleSection: "§2.5",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor", "mechronis_uniform_reference"],
    prompt:
      "Seventeen-year-old male in three-quarter profile, seated at a Mechronis Academy first-year classroom card table, one year past his canonical expulsion date. Mechronis blue uniform worn with the rebellion tell: top button undone, left sleeve rolled to the elbow (right sleeve still regulation length). Jaw set, eyes forward, not aggressive — coiled. Dark hair, short and unkempt. Broad shoulders for his age. A small braided-fiber bracelet on the right wrist (not the left). No personal insignia on the uniform; he has not replaced the regulation marks with anything. Warm-gold institutional Mechronis lighting from tall windows left of frame, afternoon shadows falling across a blackboard with first-year mathematics still chalked. Expression: guarded, with the single warm degree of §2.5 reserved for the word 'gate' — render as resting-guarded, not smiling. A 17-year-old who has already decided that surviving is the point.",
  },
  {
    assetId: "portrait_young_kael",
    name: "Young Recruiter / Kael",
    category: "opponent_portrait",
    cycle: "B",
    bibleSection: "§2.6",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor", "mechronis_uniform_reference"],
    prompt:
      "Seventeen-year-old male in three-quarter profile, Mechronis Academy second-year classroom setting. Warm expression, genuine smile about to land — the specific smile of someone who has just asked a question and is waiting for the answer to arrive. Mechronis blue uniform, neatly worn, small braided-fiber bracelet visible on the LEFT wrist (canonical Kael tell per §2.6; contrast with Iron Lion's right-wrist bracelet). Medium-brown skin, close-cropped black hair, slightly older-looking than his age. Broad open face. Hands folded on the card table, fingers relaxed, palms down. Warm-gold afternoon Mechronis lighting, faint chalkboard in background with second-year civics diagrams softly defocused. Expression carries charisma without performance — he is not trying to charm the viewer, he is inviting them to speak. No warmth directed at the cards between them; all warmth goes to the person opposite.",
  },
  {
    assetId: "portrait_young_agent_zero",
    name: "Young Agent Zero",
    category: "opponent_portrait",
    cycle: "B",
    bibleSection: "§2.7",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor", "mechronis_uniform_reference"],
    prompt:
      "Seventeen-year-old, ethnically ambiguous (medium-light brown, deliberately un-placeable), medium height, slender-but-not-frail build, in three-quarter profile at a Mechronis Academy third-year classroom card table. CRITICAL: her signature is absence of signature — render as forgettable on first viewing. Mechronis blue uniform worn TOO PERFECTLY: blazer buttoned to the top, every button in place, light-blue tie at regulation length, knot dead-center, white oxford pressed immaculate, sleeves at full length (she never rolls them), blue trousers with hospital-grade creases, polished black shoes. NO personal touches — no pin, no bracelet, no scuff, no stain. Straight dark-brown hair, mid-back length, parted off-center so the left side falls forward across her left eye in a curtain (surveillance-countermeasure habit); LEFT EYE NEVER VISIBLE IN THIS PRE-C3 PORTRAIT. Right eye dark brown, calm, watchful, resting. Hands flat on the table, palms down, economical posture. Warm-gold lighting through the classroom window, covert-operations chalkboard diagrams defocused in background. She is invisible inside perfection — the player who notices the over-perfect uniform has solved half the puzzle, but most will not notice.",
  },
  {
    assetId: "portrait_young_eyes",
    name: "Young Eyes",
    category: "opponent_portrait",
    cycle: "B",
    bibleSection: "§2.8",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor", "mechronis_uniform_reference"],
    prompt:
      "Seventeen-year-old female in three-quarter profile, seated at a Mechronis Academy fourth-year advanced-theory classroom card table. Slight frame, pale skin, dark hair worn in a simple low ponytail. She holds a small book in her hands, just closed — a finger still marking the page. Eyes do not track the viewer's face; her gaze is fixed on the playing surface between them (she reads decks, not people). Mechronis blue uniform worn cleanly. CANONICAL DETAIL: faint circular Watcher sigil mark on the LEFT wrist, approximately 1cm diameter, visible in any close-up of the hands — render subtle, low-opacity, easy to miss on first viewing; identical in composition to the Ocularum Trio masks in the Kanshi Sha portrait. Lighting: darker than B1/B2/B3 — single desk-lamp pool of warm-yellow light, classroom recedes into institutional shadow, algorithmic diagrams on the chalkboard deliberately unreadable. Expression: soft, precise, the Watcher's synthetic cadence rendered through a seventeen-year-old face. NOT an Archon; rendered as a canonical human-presenting synthetic.",
  },
  {
    assetId: "portrait_young_human_seeker",
    name: "The Seeker / Young Human",
    category: "opponent_portrait",
    cycle: "B",
    bibleSection: "§2.9",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor", "mechronis_uniform_reference"],
    prompt:
      "Seventeen-year-old male in three-quarter profile, seated in an armchair in the Mechronis Academy senior common room (NOT a classroom — this is the only Cycle B battlefield that is comfortable). Warm-gold evening lighting from a fireplace off-frame-left, softer than the institutional blue-gold of the classroom portraits. NO trench coat (he acquires that years later). Mechronis blue uniform, slightly rumpled at the shoulders, oxford collar open at the throat. Glasses — thin steel frames, canonical detail. Kind eyes behind the lenses, not smiling but on the verge of. Red hair, slightly messy, longer than regulation would prefer. Fair skin with a faint smattering of freckles across the nose. A small coffee-table card table between two armchairs; his deck in his hands, not yet played. His expression is the specific attention of a person listening as hard as he is looking — the visual hinge of §2.9 is that every match with him is a conversation, and the portrait must communicate that he is already in it.",
  },
];

/* ─── CYCLE C opponent portraits (§§2.10–2.13) ─── */

const CYCLE_C_PORTRAITS: readonly Act1ArtPrompt[] = [
  {
    assetId: "portrait_vernon_vortex",
    name: "Vernon Vortex (First Form)",
    category: "opponent_portrait",
    cycle: "C",
    bibleSection: "§2.10",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seven-year-old boy in three-quarter profile, seated at a Nexon command-bunker card table (not a schoolyard — institutional green-grey military walls, pre-war banners visible). He is spinning a brass-rimmed wooden toy top on the table with his right hand; the top blurs in motion. CANONICAL DETAIL: the top is visually IDENTICAL to the one Young Iron Lion played with in his pre-expulsion flashback — production must match the top prop across both assets. Expression: delighted, innocent, genuine child-wonder. He is the canonical exception in Cycle C — a cosmic Archon still in child form, the only non-adult in cycles C. Warm-eyed, brown hair, plain beige tunic. Surrounding him at the edges of the frame: faint rust-orange (#e06a1a) vortex-particle motion, subtle, low-opacity — the cosmic Vortex is present but not yet dominant; render as a soft halo of rust-orange drift that does NOT obscure the child. Lighting: a large central bunker window behind him shows the Nexon battlefield outside with rust-orange vortex clouds in the sky; the warm gold of the sky catches his face in rim-light. The toy top is the visual metronome of the match; render it with a soft motion-blur ring.",
  },
  {
    assetId: "portrait_wanda_wyrlord",
    name: "Wanda Wyrlord (fragmented)",
    category: "opponent_portrait",
    cycle: "C",
    bibleSection: "§2.11",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seventeen-year-old cyborg young woman in three-quarter profile, seated at a Zenon forward-command canvas-tent card table, single camp lantern casting warm-gold pool-light. CRITICAL canon hygiene: render as CYBORG, never as swarm. No silver-liquid motion, no dispersal particles, no cloud-form transitions — plate and circuitry only. Platinum-to-gold blonde hair, cropped short at sides and back, medium on top, swept back from forehead, slightly wavy, catching the lantern light like almost-metal. Fair skin, lightly sun-weathered, freckle-constellation across nose and cheekbones. LIGHT-ENHANCED EYES: base iris glacial blue-grey #9cb4c1 with a thin electric-blue inner ring #3b82f6 glowing faintly; pupils dark-charcoal, not black, with tiny pinpoint lights dead center. The glow rim-lights her upper cheekbones cool-blue against the lantern's warm gold. VISIBLE METAL (limited): a flush-mounted brushed-titanium plate ~4cm × 3cm on the LEFT temple and cheekbone, a smaller ~3cm × 2cm plate along the RIGHT jawline — no plating elsewhere; nose, mouth, forehead, chin, right cheek all unmodified skin. Plates read as medical augmentation, not aesthetic. Yellow hooded jacket (mustard-yellow #eab308 military-spec canvas), unzipped, hood back, small faded Insurgency field-medic patch sewn on the LEFT shoulder — render the patch visible but worn. Black military undershirt beneath. Hands: unmodified human, nails bitten, small cross-shaped scar on the back of the right hand between thumb and forefinger. Posture: forward, braced on the card table, military-alert but not aggressive — she is waiting. The yellow jacket is her hinge; the plates are her wound; the patch is her grief.",
  },
  {
    assetId: "portrait_warlord_swarm_env",
    name: "Warlord's Nano-Swarm (environmental phenomenon + Agent Zero host)",
    category: "opponent_portrait",
    cycle: "C",
    bibleSection: "§2.12",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor", "agent_zero_continuity_ref"],
    prompt:
      "TWO SIMULTANEOUS VISUAL SURFACES required in one composition: (1) Agent Zero's host body at eighteen — same person as Young Agent Zero from §2.7 portrait (same height, build, ethnic features, dark-brown hair) but one year later. Hair now pulled back into a tight functional field braid; left-side curtain habit GONE, both eyes visible. Left eye shows a single silver pinpoint at pupil-center (mid-match progression — approximately turn 7/11). Faint silver undertone visible in the capillaries on the insides of her wrists and at her temples. Field-deployment loadout (NOT the Mechronis uniform): charcoal-grey tactical jacket fitted and hip-length, high collar buttoned to the throat, a small unreadable black-on-charcoal sigil on the right shoulder (the Warlord's deployment mark — player will recognize it retroactively in Act 3). Black tactical trousers no creases. Memorial cord on right wrist: plain black braided fiber, three knots. (2) THE SWARM above and around her shoulders: a coherent silver-liquid cloud of nano-particles, brushed-mercury #a8aab2 with cool-blue specular highlights #3b82f6 flickering on a 4Hz pulse. Volume is roughly the mass of a large predator, coiled like armor that breathes. NOT a face, NOT a creature, NOT glittery. Motion grammar: mercury that decided to fight. The swarm absorbs the warm-gold Vortex-bay lighting and re-emits it cool-blue — the composition's signature palette inversion. Setting: the Vortex bay pressurized equipment compartment, single overhead work-lamp, hard down-shadow, a matte-black palm-sized cube (Resurrection Protocols device) on a hexagonal equipment crate, six explosive charges with red countdown LEDs visible on the back wall. The Engineer is off-frame (player POV).",
  },
  {
    assetId: "portrait_wayne_warden",
    name: "Wayne Warden",
    category: "opponent_portrait",
    cycle: "C",
    bibleSection: "§2.13",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Sixty-three-year-old male presiding judge in three-quarter profile, seated centrally at a 1.2m-raised dark-walnut bench in the New Babylon Tribunal chamber. CANONICAL FRAMING: he is NOT cruel and NOT corrupt in the cinematic sense — render as a competent technician of judgment who genuinely believes his institution is correct. Iron-grey hair at the temples, kept short, neatly groomed. High lined forehead — concentration lines, not anger lines. Pale papery skin with a waxy sheen (four decades of indoor Authority-spec lighting). Faint liver-spots on the backs of the hands. A small shaving nick on the left jaw, two days old, healing. Pale grey-blue eyes #9aa6b1. CRITICAL: his gaze is on the CARDS / the bench surface — NOT on the viewer. In this portrait his eyes track a folded evidence card on the bench in front of him. Authority robes: deep burgundy #6b1d2c wool outer robe, high 4cm collar, floor-length, non-decorative weave (Authority robes are deliberately non-theatrical). Black undertunic beneath, plain, full-length sleeves. Single silver scale-sigil pin ~2cm tall on the left breast — the ONLY metallic element in his entire wardrobe, rendered with faint specular highlight. Flat black four-cornered biretta cap, worn squarely. Hands folded on the bench, fingers long and well-kept, a thin silver band on the LEFT ring finger (widowed — Atarion-related; player does not know yet). Warm-amber lighting from the six crystal coffins mounted on the rear wall above him (soft out-of-focus, 0.3Hz pulse visible as a gentle amber glow behind his shoulders). The single brass scale of justice on the bench at his right hand. Verdict scroll on his left hand, blank. He is the single face the institution puts forward; render him tired, composed, and terrifying exactly because he is competent.",
  },
];

/* ─── BATTLEFIELDS — Cycle A (§22.1) ─── */

const CYCLE_A_BATTLEFIELDS: readonly Act1ArtPrompt[] = [
  {
    assetId: "bf_celebration_schoolyard_day10",
    name: "Celebration Schoolyard — Day 10 (A1)",
    category: "battlefield",
    cycle: "A",
    bibleSection: "§22.1.1 / §3.3",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing shot of the Celebration Trial schoolyard at approximately 2:00 PM, Day 10 of the Trial. Outdoor wooden card table center-foreground, two low matching benches on either side. Warm-gold afternoon sunlight, long-but-not-yet-evening shadows. Background: Celebration parade banners hanging limp in still air, the colors muted and nostalgic — pinks and golds. The schoolyard's ground is packed earth with a few patches of soft grass. NO PEOPLE in this base still — figures are rendered as separate cutscene layers. The composition leaves the upper third of the frame open for parade-banner ambiance and the lower third clean for UI overlay. Architectural framing: a low pavilion roof at the back of the frame casting a long horizontal shadow line. The lighting must read as memory, not present-tense — slightly more saturated than literal sunlight, with a faint sepia film-grain undertone. This is the Engineer's child memory of his own schoolyard; render as a recovered photograph.",
  },
  {
    assetId: "bf_celebration_schoolyard_day20",
    name: "Celebration Schoolyard — Day 20 (A2)",
    category: "battlefield",
    cycle: "A",
    bibleSection: "§22.1.1 / §4.3",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "bf_celebration_schoolyard_day10"],
    prompt:
      "SAME schoolyard composition as Day 10 (A1) — must read as the same physical space, same camera angle, same architectural framing — but with three deliberate shifts: (1) lighting moved to approximately 4:30 PM; warmer, lower sun-angle, longer shadows raking across the wooden card table from the right of frame; (2) parade banners in the background are different colors than Day 10 — Day 20 of the Celebration Trial is a different parade phase; render in deeper amber and muted-red tones (Day 10 was pink-gold); (3) a single thin curl of incense smoke rising from the right edge of the frame, suggesting a Mascoteer ceremony just out of frame. NO PEOPLE in the base still. Same packed-earth ground, same low pavilion roof at back. The shift in light from A1 to A2 is canonical — the player should subliminally register that time is passing across the Celebration Trial. Production must hold the camera-angle continuity exactly with bf_celebration_schoolyard_day10.",
  },
  {
    assetId: "bf_celebration_pavilion_day28",
    name: "Celebration Graduation Pavilion — Day 28 (A3)",
    category: "battlefield",
    cycle: "A",
    bibleSection: "§22.1.1 / §5.3",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing shot of the Celebration Trial GRADUATION PAVILION (NOT the schoolyard — this is a distinct location). A raised wooden platform approximately 1m above the ground, set with two card tables in symmetrical opposition center-stage. Warm-gold evening light at approximately 6:30 PM, low-angle, raking from frame-right. Background: Celebration GRADUATION banners (specific to Day 28 — gold-on-white with stylized parade-mark ornaments, no rendered text), a soft-focus crowd of parents and Mascoteers visible at the edges of the frame as silhouettes. This is the ONLY Cycle A battlefield with witnesses — graduation is a public event. The pavilion has stylized white pillars at the back corners, slightly more architectural than the schoolyard's rough wood. The two tables are identical, professional brass-edged, contrast with the schoolyard's casual wood. Composition centers the empty stage; the upper third holds the pavilion roof and banners, the lower third is the empty platform floor. NO PEOPLE in the base still — the witnesses are rendered as separate layers. Faint film-grain sepia, warmer saturation than literal evening light.",
  },
];

/* ─── BATTLEFIELDS — Cycle B (§22.1) ─── */

const CYCLE_B_BATTLEFIELDS: readonly Act1ArtPrompt[] = [
  {
    assetId: "bf_mechronis_classroom_standard",
    name: "Mechronis Academy Classroom (B1-B4 shared)",
    category: "battlefield",
    cycle: "B",
    bibleSection: "§22.1.2 / §§7.3-10.3",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing shot of a Mechronis Academy classroom — institutional, warm-gold light through tall arched windows on the LEFT side of the frame. Rows of empty blue Mechronis student desks recede toward the back of the room. A single card table at center-foreground (two desks shoved together, regulation Mechronis blue surface). Tall wooden blackboard at the back wall, content variant per battle (B1: first-year mathematics; B2: second-year civics; B3: covert-operations diagrams kept unreadable; B4: algorithmic diagrams kept unreadable — for the base still, render as PARTIALLY-ERASED chalk with no specific subject so producers can composite the per-battle variant in post). The blue uniform color #4ba3b5 on the desks anchors the institutional palette; warm-gold #b8752d on the desk-edge brass and the classroom door fittings provides the intentional cross-color tension. Late-afternoon shadows from the windows fall across the central card table. NO PEOPLE in the base still. The architectural framing is identical for B1-B4 — production composites the chalkboard variant + lighting subtle shift (B4 should be slightly dimmer per §10.3 desk-lamp emphasis) on top of this base.",
  },
  {
    assetId: "bf_mechronis_common_room",
    name: "Mechronis Senior Common Room (B5)",
    category: "battlefield",
    cycle: "B",
    bibleSection: "§22.1.3 / §11.3",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing shot of the Mechronis Academy senior common room — distinct from and SOFTER than the standard classroom (the only comfortable Cycle B battlefield). A working stone fireplace at frame-left, low warm-gold flame light spilling onto a pair of leather armchairs angled toward each other across a low coffee-table card table. Wooden bookshelves line the back wall, leather-bound spines warm and worn. A tall arched window at frame-right shows late evening sky going dusk-blue. The institutional Mechronis blue palette is muted here — the dominant tone is wood-brown and warm-gold firelight rather than the classroom's blue-grey. A small Mechronis crest carved into the fireplace mantel, tasteful, unreadable at this scale. Two small reading lamps on side tables beside the armchairs, both lit, casting their own warm pools. The composition centers the empty coffee-table-card-table; the upper two-thirds hold the wood-paneled wall and bookshelves, the lower third is the rug. NO PEOPLE in the base still. This is the only Cycle B space where the player should feel that someone might invite them to stay for tea after the match.",
  },
];

/* ─── BATTLEFIELDS — Cycle C (§22.1) ─── */

const CYCLE_C_BATTLEFIELDS: readonly Act1ArtPrompt[] = [
  {
    assetId: "bf_nexon_command_bunker",
    name: "Battle of Nexon — Command Bunker (C1)",
    category: "battlefield",
    cycle: "C",
    bibleSection: "§22.1.4 / §13.3",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing shot of a Battle-of-Nexon forward command bunker — the first non-schoolyard, non-academy battlefield in Act 1. Institutional green-grey military lighting from low-mounted overhead bulbs casting cool-grey wash. Reinforced concrete walls. A large central viewing window at the back of the frame shows the Nexon battlefield outside: rust-orange #e06a1a vortex clouds in a sky going to evening, distant muzzle-flashes (low-opacity, far below the horizon line), columns of black smoke rising. Pre-war Warlord propaganda banners hang on the side walls — institutional, not theatrical, deliberately worn. Center-foreground: a single sturdy regulation card table, military issue, no benches (combatants stand). A few stacked ammunition crates pushed against the side walls. NO PEOPLE in the base still. The cool-grey interior + warm rust-orange exterior through the window is the canonical palette tension; the warm gold of vortex-sky should rim-light the bunker walls subtly. Faint smoke ambient inside the bunker. The composition should feel like a place where a child should not be, even though canonically Vernon Vortex is a child here.",
  },
  {
    assetId: "bf_zenon_field_tent",
    name: "Zenon Forward Command — Canvas Tent (C2)",
    category: "battlefield",
    cycle: "C",
    bibleSection: "§22.1.5 / §14.3",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing shot of a Zenon warzone forward command tent — canvas walls (faded olive-drab military issue), a single low table at center-foreground lit by a hanging brass camp lantern that pools warm-gold light only across the center of the composition; the canvas walls and corners recede into deep shadow. The lantern's pool catches the table edges and a few inches of the floor; everything else is implied. AMBIENT SOUND CUE rendered visually: faint dust hanging in the lantern's beam, suggestive of distant artillery vibration. The canvas flap at frame-right is partially open, showing a sliver of the Zenon battlefield beyond — rust-orange smoke, a single distant muzzle-flash low in the frame. NO PEOPLE in the base still. The composition is much TIGHTER than the Cycle A/B battlefields — the lantern pool is the only light and it constrains the playable space to the central table. This is the first battlefield where active combat is an environmental ambient.",
  },
  {
    assetId: "bf_vortex_pressurized_bay",
    name: "The Vortex — Pressurized Equipment Bay (C3)",
    category: "battlefield",
    cycle: "C",
    bibleSection: "§22.1 / §2.12 / §15.6",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing shot of the Engineer's transference room aboard the Collector's flagship VORTEX — a small pressurized equipment bay off the main cargo deck. Approximate 6m × 5m, low ceiling. Metal walls, bolted seams, industrial pipework along the upper edges. A single overhead work-lamp at center-ceiling casts hard down-shadow on a hexagonal equipment crate the Engineer has cleared and aligned to use as a card table. NO chair on the player POV side; the Engineer plays standing. Opposite side of the table: a single steel utility chair (Agent Zero's seat, currently empty in the base still). On the table beside the play surface: a matte-black palm-sized cube — the Resurrection Protocols device — with a single recessed stud and a dark LED. Beside it, a thin steel water flask. CANONICAL DETAIL on the back wall: SIX explosive charges, evenly spaced, each with a small red countdown LED — the LEDs are the only red light in the frame. The charges must be visible in the wide shot; the player should understand the room is going to detonate regardless. Cool-grey industrial palette overall, single warm-gold work-lamp pool, six red countdown pinpoints. NO PEOPLE in the base still. The composition is intentionally claustrophobic — the room is small, the timer is visible, and the only warmth is the overhead lamp.",
  },
  {
    assetId: "bf_newbabylon_tribunal",
    name: "New Babylon Tribunal Chamber (C4)",
    category: "battlefield",
    cycle: "C",
    bibleSection: "§22.1 / §2.13 / §16.6",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing shot of the New Babylon Tribunal chamber — a vertically-proportioned space, approximately 24m × 18m, ceiling 12m high. The composition is COURTROOM-AS-LITURGY. Center-foreground: a single plain wooden chair on a polished black-stone floor (faintly grey-veined), the defendant's chair, illuminated from above by a clinical 4500K down-light shaft (forensic, not theatrical — production must resist making it beautiful). Center-rear: a raised dark-walnut bench 1.2m above the trial floor, approximately 6m wide, currently empty in the base still. On the right end of the bench: a single brass scale of justice (small, ceremonial). At Wayne's-left position on the bench: a face-down evidence stack. At Wayne's-right position: a blank parchment verdict scroll, unsealed. ON THE REAR WALL ABOVE THE BENCH: SIX crystal coffins mounted in a horizontal row, each ~2.4m tall × 1m wide × 0.8m deep, equally spaced, glowing faintly warm-amber from within with a slow 0.3 Hz pulse — the institutional heartbeat. Each coffin's interior is faintly visible: an Authority elder in stasis, robed in burgundy, eyes closed, hands folded; render the elders as soft-focus presence rather than sharp portraits. The 200-seat gallery on the side walls is EMPTY (canonical — Authority deemed the case too sensitive for public witnessing). Tall iron-bound chamber doors at frame-back-right, closed. Two soft-silhouette burgundy-uniformed Authority guards at parade rest in front of the doors (visible only at this widest framing). Palette: deep burgundy #6b1d2c on the bench undertone and guards' uniforms, warm-amber #d9a66a from the coffins, clinical 4500K white from the chair down-light, polished black-stone reflectivity on the floor. NO PEOPLE on the bench or in the chair in the base still — these are rendered as separate cutscene layers. The composition's emotional weight is the EMPTY gallery — the player who notices the empty seats has read the canonical hygiene rule.",
  },
];

/* ─── BATTLEFIELDS — Finale (§§18, 22.1) ─── */

const FINALE_BATTLEFIELDS: readonly Act1ArtPrompt[] = [
  {
    assetId: "bf_ark_archives_dimmed",
    name: "Ark Archives — Dimmed (§18 Finale)",
    category: "battlefield",
    cycle: "finale",
    bibleSection: "§22.1 / §18.2",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "prelude_archives_reference"],
    prompt:
      "Wide establishing shot of the Ark Archives central chamber — same architectural space as the Prelude Bible §4.2 establishing reference (production must match the obsidian-black plinth, the chamber dimensions, the sweep of the surrounding archive shelves), but lighting dimmed to approximately 40% of Prelude-standard Archives illumination to match the post-Last-Words tonal register. The chamber recedes into soft darkness on all sides; only the central pedestal is fully lit. The pedestal: a short obsidian-black stone plinth, waist-height, flat top, with a faint inscribed geometric pattern on the upper surface (registers only on close-up). On top of the plinth: a single blank Dischordia card, glowing faintly warm-gold from within (subtle bloom, 0.2Hz pulse, just enough to draw the eye from the chamber threshold ~15m away). Player POV is from the entrance threshold facing the pedestal. Footstep echo implied by polished obsidian floor reflectivity. NO PEOPLE in the base still — the player avatar is rendered as a separate cutscene layer per the §18 interaction flow. The composition's emotional register is RITUAL, not puzzle: the chamber is asking the player to walk to the pedestal and place a name. Faint warm-gold ambient particles drift slowly upward from the pedestal — the canonical Witnessing-chorus visual cue planted in §17 frame 14 returns subtly here.",
  },
];

/* ─── CARD ARTS — Cycle A unlocks (§22.3.13) ─── */

const CYCLE_A_CARD_ARTS: readonly Act1ArtPrompt[] = [
  {
    assetId: "card_art_countermelody",
    name: "The Countermelody (A1 unlock)",
    category: "card_art",
    cycle: "A",
    bibleSection: "§22.3.13 / §3 A1 unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A single tuning fork in the center of the frame, struck and vibrating — the vibration rendered as a faint soft halo of sound-wave concentric rings emanating outward. Brass body with warm-gold reflectivity, sitting upright on a worn dark-wood surface (the Celebration schoolyard card table). Background: out-of-focus warm-gold afternoon Day-10 schoolyard light, faint pink-gold parade banner bokeh. The fork's tone is canonically the OPPOSITE of Minnie's viral chant — render the sound rings as a quiet, organized, single-frequency wave (contrast with chaotic). NO PEOPLE. Lower-third of the frame is the worn wood surface, leaving room for the card's name banner. Faint film-grain sepia. The card is a Common Neutral; the composition should feel modest and earnest.",
  },
  {
    assetId: "card_art_jar_wouldnt_close",
    name: "The Jar That Wouldn't Close (A2 unlock)",
    category: "card_art",
    cycle: "A",
    bibleSection: "§22.3.13 / §4 A2 unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). An amber glass jar — Corey's jar from §2.3 — center-frame, lid askew (NOT closed), a single warm-gold light beam escaping upward through the gap between lid and rim. The light beam carries a few small translucent coin-shapes drifting upward and out, each with a faint defocused face on its surface. The jar itself is half-full of similar coins, nestled at the bottom and giving off their own subdued amber inner-glow. The lid hovers approximately 1cm above the rim, frozen in the act of failing to seal. Background: out-of-focus 4:30 PM Day-20 schoolyard light, deeper amber than A1. The jar sits on the same worn dark-wood surface. Lower third clean for the card-name banner. The card is Rare Light; the visual hinge is the LID FAILING — Corey's jar canonically wouldn't close, and the spilled-light is the player's attention escaping back to them.",
  },
  {
    assetId: "card_art_first_card",
    name: "The First Card (A3 unlock)",
    category: "card_art",
    cycle: "A",
    bibleSection: "§22.3.13 / §5 A3 unlock + §5.5",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A single small folded paper card, blank on both sides, held in the warm-lit palm of a child's hand at center-frame (the Engineer's seven-year-old hand from the §5.4 graduation handoff). The paper has a faint warm-gold inner glow seeping through its fibers — the canonical 'three random effects on play' rendered as latent potential rather than literal symbols. Around the card: faint film-grain sepia bokeh of the graduation pavilion at 6:30 PM evening light, soft-focus pillars in the background. The hand is small but steady, fingers slightly curled to cradle the paper. NO faces. NO rendered text on the paper. The card is Epic Light; the composition's emotional register is GIFT, not reward — Kanshi Sha gives this card whether the player wins or loses, and the prompt should communicate that giving rather than that earning.",
  },
];

/* ─── CARD ARTS — Cycle B unlocks (§22.3.13) ─── */

const CYCLE_B_CARD_ARTS: readonly Act1ArtPrompt[] = [
  {
    assetId: "card_art_iron_stance",
    name: "The Iron Stance (B1 unlock)",
    category: "card_art",
    cycle: "B",
    bibleSection: "§22.3.13 / §7 B1 unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A single weathered iron tower-shield planted upright in the center of the frame, dug slightly into a packed-earth surface. Brushed steel surface, dented from prior impacts, with a faint warm-gold rim-light catching the upper edge from the right of frame. NO heraldry, NO insignia — the shield is functional, not ceremonial (canonical Iron Lion: he refuses institutional symbols). Background: out-of-focus warm-gold afternoon light, suggestion of a Mechronis Academy gate (deep wood-and-iron archway) defocused at the back of the frame. The shield casts a long shadow toward the viewer. Lower third clean for the card-name banner. The card is Rare Light; the visual register is HOLD THE LINE — render the shield as if it has been here a long time and intends to stay.",
  },
  {
    assetId: "card_art_recruiters_gift",
    name: "The Recruiter's Gift (B2 unlock)",
    category: "card_art",
    cycle: "B",
    bibleSection: "§22.3.13 / §8 B2 unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A single thin braided-fiber bracelet center-frame, laid loosely on a worn dark-wood surface (the Mechronis classroom card table). The braid is in three colors: deep insurgency-yellow #eab308, warm gold, and a dark gray-blue that picks up the Mechronis uniform palette. The bracelet is canonically Kael's gift — render it as worn but cared for, slightly frayed at the closure but still intact. Behind it on the table: a half-finished Dischordia card face-down, its back showing faint warm-gold trim. Background: out-of-focus warm-gold afternoon Mechronis classroom light, soft window-shaft from the left. NO HANDS in this composition — the bracelet is offered, awaiting acceptance. Lower third clean for the card-name banner. The card is Epic Neutral; the visual register is THE OFFER — quiet, without ceremony.",
  },
  {
    assetId: "card_art_weapon_i_didnt_build",
    name: "The Weapon I Didn't Build (B3 unlock)",
    category: "card_art",
    cycle: "B",
    bibleSection: "§22.3.13 / §9 B3 unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A pair of EMPTY hands at center-frame, palms turned up and slightly cupped, as if recently holding something that is no longer there. The hands are the Engineer's adult hands (worn, calloused, faint scar between the thumb and forefinger of the right hand — canonical match to §2.1.2 reference). NO weapon visible. The faint silhouette of an absent shape — vague, sword-like or stance-like — hovers in the empty palm-space, rendered as a thin outline of cool-grey light, almost a memory. Background: out-of-focus institutional Mechronis blue-gray, single warm-gold shaft cutting diagonally across the upper frame from off-frame-right. Lower third clean for the card-name banner. The card is Legendary Dark; the visual register is the CANONICAL ABSENCE — what the Engineer is holding is the choice he didn't make about Agent Zero. Render the absence with weight, not with melancholy.",
  },
  {
    assetId: "card_art_memorized_page",
    name: "The Memorized Page (B4 unlock)",
    category: "card_art",
    cycle: "B",
    bibleSection: "§22.3.13 / §10 B4 unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A single torn page from a textbook, center-frame, lying flat on a dark wooden desk. The page's surface is BLANK — the canonical 'memorized page' is what's been removed, not what's printed. Faint impressions of erased text remain (graphite shadow, illegible). A single fingerprint smudge in the upper-left corner of the page. Beside the page: a small circular pale-blue Watcher sigil ~1cm, drawn in pencil, visually identical to the sigil on Young Eyes's wrist (§2.8 portrait cross-reference). Background: out-of-focus dark Mechronis fourth-year classroom under desk-lamp pool, single warm-yellow glow at the edge of the frame. Lower third clean for the card-name banner. The card is Epic Dark; the visual register is SURVEILLANCE-AS-INHERITANCE — the player gets this card because Young Eyes left it for them.",
  },
  {
    assetId: "card_art_classmates_compass",
    name: "The Classmate's Compass (B5 win unlock)",
    category: "card_art",
    cycle: "B",
    bibleSection: "§22.3.13 / §11 B5 win unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A small brass pocket compass center-frame, open and resting on a worn dark-wood surface (the senior common room coffee table). The compass face is canonical: the needle is NOT pointing north — it points slightly off-axis, toward the upper-right of the composition. The brass case has a single small engraved mark (no rendered text — abstract geometric, suggesting a younger Human's monogram). The needle catches a thin warm-gold reflection from off-frame-right (firelight). Background: out-of-focus fireplace warmth, leather armchair leg in soft focus at the back of the frame. Lower third clean for the card-name banner. The card is Legendary Light; the visual register is DIRECTION-AS-GIFT — the Human gave the Engineer this compass and the Engineer never asked why; render the brass with care, the needle's slight off-true as the canonical detail.",
  },
  {
    assetId: "card_art_only_reason_i_stayed",
    name: '"The only reason I stayed" (B5 loss unlock)',
    category: "card_art",
    cycle: "B",
    bibleSection: "§22.3.13 / §11 B5 loss unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). The same Mechronis senior common-room setting as the Compass card, but EMPTY — a single leather armchair angled toward the fireplace, a low coffee-table-card-table in front of it with a Dischordia deck face-down on the surface. NO compass on this table; NO second armchair partner. The fireplace burns down to embers — warmer red-orange tones, softer light pool than the Compass card. Faint sepia film-grain heavier than other Cycle B cards. Background: bookshelves softly out-of-focus, a window at frame-right showing dusk-blue night beyond. Lower third clean for the card-name banner. The card is Legendary Dark; the visual register is the CANONICAL ABSENCE of the Human — the Engineer stayed for the conversation that didn't happen. Render the empty chair as the subject, not the table; the player should feel the seat is canonically the Human's seat.",
  },
];

/* ─── CARD ARTS — Cycle C unlocks + Memory Card (§22.3.13) ─── */

const CYCLE_C_CARD_ARTS: readonly Act1ArtPrompt[] = [
  {
    assetId: "card_art_standstill",
    name: "The Standstill (C1 unlock)",
    category: "card_art",
    cycle: "C",
    bibleSection: "§22.3.13 / §13 C1 unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A single hourglass center-frame, but the sand is FROZEN MID-FALL — a thin column of grain suspended between the upper and lower bulbs, neither falling nor settling. The brass frame shows wear. Behind the hourglass: out-of-focus rust-orange #e06a1a Vortex sky from the Nexon battlefield, low muzzle-flash light at the bottom of the frame, but the immediate space around the hourglass holds a small bubble of warm-gold neutral light — the canonical 'one turn delay' rendered as physics-paused-locally. Lower third clean for the card-name banner. The card is Epic Light; the visual register is the WORLD HOLDING ITS BREATH. Render the suspended sand grain with crisp clarity; the war beyond it should be soft-focused so the viewer's eye lands on the frozen pause.",
  },
  {
    assetId: "card_art_converter",
    name: "The Converter (C2 unlock)",
    category: "card_art",
    cycle: "C",
    bibleSection: "§22.3.13 / §14 C2 unlock",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A single soldier's helmet center-frame, lying on its side on a dusty Zenon battlefield surface. The helmet is HALF Insurgency mustard-yellow #eab308 (the side facing the viewer, with a faded Insurgency medic patch visible on the shell), and HALF Warlord black-gunmetal #1a1410 (the side facing away). The helmet's interior shows the canonical seam between the two — a thin line of cool-blue #3b82f6 light tracing the conversion edge (intentional rhyme with Wanda's optic-rings, plants the swarm-and-cyborg connection). Background: out-of-focus Zenon battlefield smoke, distant rust-orange muzzle-flash low in the frame. Lower third clean for the card-name banner. The card is Legendary Dark; the visual register is the CANONICAL CONVERSION — render with care, not with menace. Wanda's canonical loss is that she IS what she converted.",
  },
  {
    assetId: "card_art_friend_i_saved",
    name: "The Friend I Saved (C3 Mythic Light unlock)",
    category: "card_art",
    cycle: "C",
    bibleSection: "§22.3.13 / §2.12 / §15.4 / Mythic Light",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). The Engineer's right hand center-frame, palm-up, fingers slightly curled. A single silver-mercury droplet rests in the center of his palm, perfectly spherical, catching the warm-gold work-lamp light from above. The droplet is canonically a small piece of the Warlord's nano-swarm — render as brushed-mercury #a8aab2 with a faint cool-blue #3b82f6 specular highlight on its surface (the swarm's signature palette inversion: warm light enters silver, leaves cool-blue). Background: out-of-focus warm-gold light from the Vortex bay's overhead work-lamp, with the bokeh of the Resurrection Protocols' status LED visible as a soft small blue point in the upper-right of the frame. NO faces. The hand is the entire image. Lower third clean for the card-name banner — but reserve a small space for the procedural N-score flavor text (per §2.12, the flavor text varies by C3 N-value). The card is MYTHIC LIGHT — only the second Mythic in Act 1; the visual register is GIFT-AT-COST. Render the droplet as the entire emotional weight of the composition; the hand is offering, not holding.",
  },
  {
    assetId: "card_art_last_word",
    name: "The Last Word (C4 Mythic Light unlock)",
    category: "card_art",
    cycle: "C",
    bibleSection: "§22.3.13 / §2.13 / §17 / Mythic Light",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Square card-art composition (1024×1024). A single vintage broadcast microphone center-frame, mounted on a small polished black-stone surface — the canonical Tribunal-chamber-or-cell recording setup. The microphone is brass-bodied with a fine wire-mesh diaphragm; it shows a faint condensation halo around the mesh (the Engineer is breathing into it, right now). Warm-yellow Authority-spec spotlighting from above, hard down-shadow on the stone surface. Visible in soft focus behind the microphone: the unrolled Tribunal verdict scroll — partially or fully filled with ink lines depending on win/loss path; for the base still, render at half-fill so producers can composite the win/loss epigraph variant. NO faces. NO hands. The microphone is the entire subject. Lower third clean for the card-name banner. The card is MYTHIC LIGHT — the second of two Mythics in Act 1, alongside The Friend I Saved. The visual register is THE MOMENT BEFORE THE WORDS — render the breath-condensation as the canonical detail; the player should feel that the recording is about to begin and that everything in the universe will hear it.",
  },
  {
    assetId: "card_art_memory_card_procedural",
    name: "Memory Card (apprentice permadeath, procedural)",
    category: "card_art",
    cycle: "trial",
    bibleSection: "§22.3.13 / §20.4",
    resolution: "1024x1024",
    priority: "P0",
    dependencies: ["global_style_anchor", "apprentice_portrait_reference"],
    prompt:
      "Square card-art composition (1024×1024) — PROCEDURAL TEMPLATE. The base composition is a generic apprentice portrait slot at center-frame, framed by a soft warm-gold memorial overlay (faint candle-light glow rim, fine particulate dust drifting upward, the canonical Witnessing-chorus visual cue). Producers composite the deceased apprentice's canonical portrait (from `apps/shared/apprentices.ts` generated identity) into the slot at runtime. The frame around the portrait: a thin brushed-brass border with three small notch marks at the bottom — one notch per trait that survived the player's choices (Resilience / Trust / Clarity). For the base still, render the portrait slot as a soft-focus silhouette of an apprentice-aged figure (no face details), the brass frame complete, the three notches present. Background: out-of-focus warm-gold candle-light, deep shadow at the corners. Lower third clean for the procedurally-generated apprentice name banner ('[Name] — In Memory'). The card is Epic Light; the visual register is MEMORIAL not reward. The §20.4 procedural flavor text branch (Resilience/Trust/Clarity-tanked variant) appears in the lower frame, not on the art itself.",
  },
];

/* ─── SLIDESHOW FRAMES — §6 Welcome to Celebration (8 base + 2 branch = 10) ─── */

const WELCOME_TO_CELEBRATION_FRAMES: readonly Act1ArtPrompt[] = [
  {
    assetId: "slide_wtc_frame_01",
    name: "WTC Frame 1 — Celebration school gate at sunrise",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.2 frame 1",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing composition of the Celebration school gate at sunrise, Day 1 of the Celebration Trial. Empty packed-earth path leading through a wrought-iron gate under a wide wooden arch carved with stylized parade-mark ornaments (no rendered text). Warm-gold sunrise light raking low across the composition from frame-right, long shadows pulling toward the viewer. Above the gate: strings of Celebration parade banners hanging perfectly still in the pre-morning air. No people. The gate is slightly ajar. Distant parade drums implied by morning quiet. Slight film-grain sepia, warmer saturation than literal sunrise — this is the Engineer's memory of arriving, not the literal moment.",
  },
  {
    assetId: "slide_wtc_frame_02",
    name: "WTC Frame 2 — The Engineer as a child, walking through the gate alone",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.2 frame 2",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Same gate as Frame 1, camera now placed inside the schoolyard looking back out. A seven-year-old boy (the Engineer) walks through the open gate, back to camera, small in the frame. He wears plain earth-tone clothes — no Mascoteer regalia yet. His posture: small, not hesitant, determined. One hand at his side, one hand in a pocket. The Celebration banners overhead catch the still-rising sun. Warm-gold rim-light on his shoulders. Distant off-camera: a single child's laugh suggested by a faint bokeh figure way back in the deep frame. Film-grain sepia slightly heavier than Frame 1. The composition's emotional register: the Engineer arriving alone at the place that will make him into the Prince.",
  },
  {
    assetId: "slide_wtc_frame_03",
    name: "WTC Frame 3 — Close-up of the card table with Minnie Mouse ears",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.2 frame 3",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Close-up, shallow depth of field. A wooden Celebration schoolyard card table, empty, polished with use. On the nearest chair to camera: a black plastic Minnie Mouse ear headband resting where a child has left it — small, theme-park-souvenir style. The chair opposite is empty. No Dischordia deck yet — this is before the first match. Light is soft midday schoolyard, warm-gold pools across the table's grain. No people. No audio cue — silence is the frame. The film grain feels like a still photograph someone paused to take before anyone noticed.",
  },
  {
    assetId: "slide_wtc_frame_04",
    name: "WTC Frame 4 — Mascoteer bond montage (apprentice-alive base)",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.2 frame 4 (base)",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Montage composition — six soft-focused portraits of the six Celebration Mascoteers (Minnie, Little Corey, Mr. Unblink, plus three non-boss — Conni the Conductor, Vernon the Door-Finder, Gary the Ninth) arranged in a 3×2 grid with gentle warm-gold bokeh between them. Each portrait is a single small square, ~10% of frame area, with the Mascoteer's signature prop visible (mouse ears / amber jar / half-mask / conductor coat / many-doorknobs / red goggles). The grid is held in the center of the frame; edges fade into warm Celebration afternoon light. Parade brass uptempo cue implied visually as gentle warm particulate drift between the portraits. Intentional composition echo of §19 Celebration Trial UI.",
  },
  {
    assetId: "slide_wtc_frame_04b_apprentice_dead",
    name: "WTC Frame 4 variant — Memory Card substitute (apprentice-dead branch)",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.3 apprentice-dead branch / §20.4",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "card_art_memory_card_procedural"],
    prompt:
      "Branch-variant composition replacing Frame 4's Mascoteer grid when the apprentice died during the Celebration Trial. A single close-up of the procedural Memory Card (the §20 apprentice permadeath unlock) held in a warm-gold candle-light, the apprentice's procedurally-composited portrait visible in the card's slot, the brass-frame's three notches (Resilience / Trust / Clarity) visible. The rest of the frame is deep warm-gold shadow with faint Witnessing-chorus particles drifting upward — the same visual cue as §17 frame 14. No montage, no other Mascoteers — the single card carries the frame. Producers composite the canonical apprentice portrait at runtime per §20.4.",
  },
  {
    assetId: "slide_wtc_frame_05",
    name: "WTC Frame 5 — Graduation pavilion at Day 28, empty, evening light",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.2 frame 5",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "bf_celebration_pavilion_day28"],
    prompt:
      "Wide shot of the Day-28 graduation pavilion, empty of people. Two card tables still set on the raised wooden platform; the Kanshi Sha chair is empty. Low-angle 6:30 PM evening light raking across the composition from frame-right; long shadows. The pavilion's white pillars catch warm rim-light; the surrounding soft-focus witnesses (from bf_celebration_pavilion_day28) are NOT present here — the pavilion is deliberately empty, the ceremony over, the witnesses gone home. Faint distant crowd murmur implied by a single parade banner still fluttering on the back wall. Film-grain sepia heavier than earlier frames — this is how the Engineer remembers the pavilion after he left it.",
  },
  {
    assetId: "slide_wtc_frame_06",
    name: "WTC Frame 6 — Kanshi Sha's white mask, close-up, mid-air",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.2 frame 6",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Close-up, centered composition. The half-finished white Ocularum mask from Kanshi Sha's §2.4 portrait, but DETACHED from any face — the mask floats mid-air at center-frame, suspended by nothing, catching a single warm-gold sustained light from frame-right. The mask rotates with a faint 0.5Hz drift (render a single frame of that motion, mask tilted ~3° off-vertical). Background: deep warm-gold void, no setting — this is stylized memory composition, not literal place. A single sustained warm-gold tone is the canonical audio cue (visual equivalent: a faint ring of light haloing the mask). No eyes, no hollow cavities where the mask was worn — the mask reads as a pure object, weightless and precise. Faint sepia film-grain.",
  },
  {
    assetId: "slide_wtc_frame_07",
    name: "WTC Frame 7 — The Engineer walking out with The First Card",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.2 frame 7",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seven-year-old Engineer walking out of the graduation pavilion, back to camera again (callback to Frame 2). A single folded paper card visible in his right hand at his side — The First Card (§5.5 unlock), the faint warm-gold inner glow catching from within the paper. Evening light 6:30 PM-ish, long shadows. Parade drums implied at full tempo (he is walking away TO the next part of his biography, not away from something). The pavilion recedes into soft focus behind him. Apprentice-alive variant: a second small figure walks beside the Engineer, slightly behind, carrying their own folded paper — visible only as warm-gold silhouette at full body scale, face unreadable. For the base still, render the apprentice's position with soft-focus silhouette ready for producer-side inclusion or removal by branch.",
  },
  {
    assetId: "slide_wtc_frame_08",
    name: "WTC Frame 8 — Celebration at night, distant shot",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.2 frame 8",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Distant wide shot, the Celebration school lit warm-gold at night. Parade banners drift in a gentle evening breeze above the rooftops; small points of warm-yellow light in every window. A single silhouette walks toward the exit gate in the middle-distance — the Engineer, now departing, small in the composition. The gate is open. Beyond the school: deep evening-purple sky transitioning to dusk-blue at the horizon; a few faint stars beginning to show. Parade drums FADE to silence at this frame canonically — render as visual hush, the ambient particulate motion slowing. The composition's emotional register: the welcome ends. This is the canonical sign-off frame of the slideshow; the narration's closing line 'Welcome to Celebration' lands on this image.",
  },
  {
    assetId: "slide_wtc_frame_03_loss_variant",
    name: "WTC Frame 3 variant — the graduation the Engineer missed (A3 loss branch)",
    category: "slideshow_frame",
    cycle: "A",
    bibleSection: "§6.3 A3-loss branch",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Branch-variant composition replacing Frame 3 when the player lost A3 to Kanshi Sha. The graduation pavilion seen from BELOW (low angle, looking up toward the empty stage from an audience-seat perspective), the Engineer's wooden chair visibly empty on stage. The two card tables are set but unattended. Evening 6:30 PM light, but cooler than the other Cycle A frames — the warm-gold saturation is pulled back 25% here; this is the frame the Engineer didn't want to remember. A single folded program on an empty chair in the foreground (no rendered text). The pavilion's white pillars catch cooler rim-light. Narration lands on this frame ('They called my name. I did not come up.') — the canonical audio hush is the only soundtrack. Sepia film-grain heavy.",
  },
];

/* ─── SLIDESHOW FRAMES — §12 To Be the Human (10 base + 3 branch = 13) ─── */

const TO_BE_THE_HUMAN_FRAMES: readonly Act1ArtPrompt[] = [
  {
    assetId: "slide_tbth_frame_01",
    name: "TBtH Frame 1 — Mechronis Academy at dawn",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 1",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide establishing composition of Mechronis Academy at dawn. The institutional blue-grey main building rises in the center-back of the frame, tall arched windows catching the rising sun's warm-gold reflection. Streams of blue-uniformed students flowing into the front doors from several directions — rendered as soft-focus silhouettes at medium scale, unidentifiable individually. Morning bell sound implied by a single bronze bell hanging above the main doors. A single long warm shadow from the building cuts across the stone courtyard in the foreground. Palette pulled 15% desaturated from §6 Cycle A frames — Cycle B is cooler, more institutional. Faint film-grain sepia. The composition's register: the Engineer arriving at the place he will spend five years of his biography.",
  },
  {
    assetId: "slide_tbth_frame_02",
    name: "TBtH Frame 2 — Young Iron Lion at the academy gate, day of expulsion",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 2",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "portrait_young_iron_lion"],
    prompt:
      "Medium-wide composition, Young Iron Lion walking through the academy gate outward (back to camera), on the day of his canonical expulsion. Mechronis blue uniform, top button undone, left sleeve rolled (same visual tell as his §2.5 portrait). A single duffel bag hanging from his right hand. His shoulders squared, head level, not looking back. The gate itself is open — and canonically stays open after he passes through. A single wind gust visible in the way his jacket moves; no other sound. Warm midday light from directly above. Behind him in soft focus: the academy's blue-grey facade. One door closing behind him — rendered with the gate's shadow falling on a closed academy side-door in the middle distance, the canonical audio cue 'a single door closing' realized visually as the shadow's hard edge.",
  },
  {
    assetId: "slide_tbth_frame_03",
    name: "TBtH Frame 3 — Young Kael's tutoring card table (Wanda canonically excised)",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 3 / §0.4 rule 4",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Warm-sepia memory composition — a card table in a palace tutoring room, older wood, softer light. Two figures at the table in soft-focus: a young Kael (black hair, warm expression) on the LEFT, a young Engineer (slightly smaller, more attentive) on the RIGHT. Both rendered from a three-quarter angle, hands on cards. CRITICAL canon hygiene: NO THIRD FIGURE. Wanda Wyrlord is canonically excised from this frame per §0.4 rule 4 (her tutoring-table presence belongs to Act 2+ content). The table's third chair is EMPTY. The empty chair should be composed so the viewer subliminally notices the vacancy without being told — angle it away, catch it in shadow, but include it. A single card in mid-motion between Kael and the Engineer. Warm classroom ambient, slight bokeh on the walls. Faint sepia film-grain heavy.",
  },
  {
    assetId: "slide_tbth_frame_04",
    name: "TBtH Frame 4 — Young Agent Zero alone at lunch, hair curtain",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 4",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "portrait_young_agent_zero"],
    prompt:
      "Medium composition — Young Agent Zero (the §2.7 portrait continuity) seated alone at a Mechronis Academy cafeteria table. The cafeteria around her is softly out-of-focus but populated — suggestions of other blue-uniformed students at other tables, unfocused, active. She is the ONE SHARP FIGURE in the composition. Hair curtain falling across her left eye per canon, right eye visible and downcast at her food tray. Hands flat on the table exactly as in §2.7. Her tray holds regulation academy food, half-eaten. The seats on either side of her are empty, and the empty seats are the visual hinge — render the space around her as slightly larger than the other students' spacing (she sat alone on purpose). Warm-gold cafeteria ambient lighting, low hubbub. Sepia film-grain moderate.",
  },
  {
    assetId: "slide_tbth_frame_05",
    name: "TBtH Frame 5 — Young Eyes's wrist, close-up, Watcher sigil visible",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 5 / §10.7 / §2.8",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Extreme close-up composition, shallow depth of field. Young Eyes's left wrist visible in the lower two-thirds of the frame, a book (spine-up, cloth binding) held just above the wrist at her chest — the book fills the top of the frame in soft focus. The CANONICAL DETAIL: a faint circular pale-blue Watcher sigil (~1cm) visible on her wrist where the cuff of her Mechronis blue uniform sleeve has ridden slightly up. The sigil has a soft 0.3Hz pulse (render a single frame mid-pulse, ~50% opacity). Skin tone fair, canonical light fall-off of a library setting. Quiet page-turning implied by the slight motion blur on one of the book's pages. No face visible. The sigil is the subject of the frame but must not feel foregrounded — the player should find it second, not first.",
  },
  {
    assetId: "slide_tbth_frame_06",
    name: "TBtH Frame 6 — The young Human reading by firelight",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 6",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "bf_mechronis_common_room"],
    prompt:
      "Medium composition in the Mechronis Academy senior common room (continuity with bf_mechronis_common_room). Young Human (seventeen, red hair, steel-frame glasses, rumpled blue uniform per §2.9 portrait) seated in the leather armchair angled toward a working fireplace at frame-left. He holds an open leather-bound book, reading with his head tilted slightly down, the firelight casting warm-gold orange on his face and hands. A half-empty coffee cup on the side table beside him. His expression: composed, concentrated, the specific attention of someone who is reading a room they cannot see directly. One armchair opposite is empty — the seat where the Engineer sat in B5. Fireplace crackle is the only ambient audio; render as visual warmth rather than literal sparks.",
  },
  {
    assetId: "slide_tbth_frame_07",
    name: "TBtH Frame 7 — Mechronis main hall, empty, long shadows",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 7",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Wide composition, Mechronis Academy's vaulted central hall, completely empty of people. Tall arched windows along both side walls throw long diagonal shadows from late-afternoon sun across the marble floor. Institutional blue-grey walls with academy crests carved at intervals (no rendered text, abstract geometric only). The hall recedes into the deep distance, emphasizing scale. A single pair of forgotten blue student shoes on a bench at frame-right — small, easy to miss, canonical. Hall echo implied by the vastness of the empty space. Film-grain sepia, desaturated 15% vs. Cycle A palette. The composition's register: the Engineer passed through this hall a thousand times but remembers it most clearly as empty.",
  },
  {
    assetId: "slide_tbth_frame_08_win_compass",
    name: "TBtH Frame 8 variant — Engineer holds the compass (B5 win)",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 8 (win branch)",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "card_art_classmates_compass"],
    prompt:
      "Close-up composition, the Engineer's hand holding the brass pocket compass — the same compass as card_art_classmates_compass, but now in the Engineer's grown palm, not the Human's child gift. The compass is open, needle visible, pointing slightly off-axis. His hand is steady, fingers closed loosely around the case. Warm-gold common-room firelight rim catches the brass. The compass is held up, not down — he is checking it, trusting it. Background: deep warm-gold bokeh of the common room fireplace, soft-focus bookshelf. Narration 'He gave me a compass. I did not ask for directions.' lands on this frame.",
  },
  {
    assetId: "slide_tbth_frame_08_loss_empty_room",
    name: "TBtH Frame 8 variant — Empty common room (B5 loss)",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 8 (loss branch)",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "card_art_only_reason_i_stayed"],
    prompt:
      "Medium composition, the Mechronis senior common room AFTER the B5 loss. Fireplace burnt down to red-orange embers — darker than the frame-6 warmth. Both leather armchairs empty. The coffee-table card table still holds a Dischordia deck face-down, untouched. A single glass on the side table, half-empty, amber liquid inside. Windows at frame-right show dusk-blue night beyond. Faint sepia film-grain heavy. The Engineer is sitting in the composition but OFF-FRAME — the viewer is placed where the Human's chair was. The empty room is the subject; the narration 'I stayed too long. I learned what the room was.' lands on this image. Continuity tie to card_art_only_reason_i_stayed.",
  },
  {
    assetId: "slide_tbth_frame_09",
    name: "TBtH Frame 9 — Engineer walking out of Mechronis for the last time",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 9",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "The Engineer, now aged to his late teens (~18), walking out of Mechronis Academy for the last time. Back to camera (composition callback to §6 Frame 2 and §6 Frame 7 — the back-to-camera departure motif). The Mechronis blue uniform REPLACED with civilian dress — a simple dark coat over plain under-clothes. He carries a single small satchel. Warm-gold late-afternoon light from above, his shadow falling ahead of him. The academy's blue-grey facade recedes to his right; the open gate in the middle distance ahead of him. He is not looking back. The composition's outdoor ambient rises as he walks toward the horizon — render the horizon as a soft warm band of light.",
  },
  {
    assetId: "slide_tbth_frame_09_loss_variant",
    name: "TBtH Frame 9 variant — B5 loss narration-shifted",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.3 B5-loss narration shift",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor", "slide_tbth_frame_09"],
    prompt:
      "Same subject as slide_tbth_frame_09 but compositionally tightened: the Engineer walking out, back to camera, civilian dress. Palette pulled 20% cooler — slightly more dusk-blue than the win branch, less warm-gold. His shadow ahead of him is longer. The horizon band is narrower. Same walk, same direction, same departure, but the image weighs heavier. Narration on this frame shifts to 'When I left I did not know if I was someone.' per §12.3 — the visual counterpart is the cooler palette and the tighter framing. Sepia film-grain slightly heavier than the win-branch variant.",
  },
  {
    assetId: "slide_tbth_frame_10",
    name: "TBtH Frame 10 — Mechronis fading behind, warm-to-cool palette shift",
    category: "slideshow_frame",
    cycle: "B",
    bibleSection: "§12.2 frame 10 / §12.6 load-bearing audio",
    resolution: "1920x1080",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Distant wide composition. Mechronis Academy as a small blue-grey silhouette in the middle distance at frame-left, the Engineer's back-of-head and shoulder in sharp focus in the lower-right of the frame (over-the-shoulder perspective, his direction of gaze is the frame's wide space). The horizon at center: the canonical warm-to-cool palette transition — warm-gold #fbbf24 on the left-third of the frame (toward Mechronis) linearly transitioning to cool-grey on the right-third (toward the war he does not know is coming). Production must hold the transition strictly linear across the 18-second frame duration — this frame's composition must be designed so producers can render the palette shift as a smooth gradient. Canonical audio: silence into distant thunder. Render the distant thunder as a single faint dark cloud bank on the far-right horizon, visual foreshadow of Cycle C.",
  },
];

/** Full Act 1 art prompt catalog (built up over subsequent chunks). */
export const ACT1_ART_PROMPTS: readonly Act1ArtPrompt[] = [
  ...CYCLE_A_PORTRAITS,
  ...CYCLE_B_PORTRAITS,
  ...CYCLE_C_PORTRAITS,
  ...CYCLE_A_BATTLEFIELDS,
  ...CYCLE_B_BATTLEFIELDS,
  ...CYCLE_C_BATTLEFIELDS,
  ...FINALE_BATTLEFIELDS,
  ...CYCLE_A_CARD_ARTS,
  ...CYCLE_B_CARD_ARTS,
  ...CYCLE_C_CARD_ARTS,
  ...WELCOME_TO_CELEBRATION_FRAMES,
  ...TO_BE_THE_HUMAN_FRAMES,
];

/** Look up a single prompt by asset id. */
export function getAct1ArtPrompt(assetId: string): Act1ArtPrompt | undefined {
  return ACT1_ART_PROMPTS.find((p) => p.assetId === assetId);
}

/** Return every prompt in a category. */
export function getAct1ArtPromptsByCategory(
  category: Act1ArtCategory,
): readonly Act1ArtPrompt[] {
  return ACT1_ART_PROMPTS.filter((p) => p.category === category);
}
