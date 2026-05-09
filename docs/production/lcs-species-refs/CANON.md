# Living Character Sheet — species canon references

Canon visual references provided 2026-05-09 by the project lead.
These are the locked-in source of truth for the four starter species
(`demagi`, `quarchon`, `neyon`, `human` per
`apps/shared/starterLoadout.ts:STARTER_SPECIES_LIST`). All Living
Character Sheet base-body prompts in §18 of
`docs/production/NANO_BANANA_VEO_FULL_PROMPT_BOOK.md` cite back to
this file by ref-id (`ref-demagi-m-warrior`, etc.).

When authoring a body prompt:
1. Pin the species silhouette + body language to the matching ref.
2. Carry the palette from the ref (red+gold for warrior DeMagi, silver+ivory for sage DeMagi, etc.).
3. The skin / chitin / shell tone slider varies WITHIN the ref's canon — don't change species identity.
4. Female + non-binary derivations use the same species silhouette logic, sex-swapped where noted.

---

## DeMagi (the magical warrior species)

DeMagi present as humanoid with strong eye-glow tells (irises lit from
within), ornate plate armor that integrates organic motifs, and a
"devotion" archetype — every DeMagi is bound to a discipline (war,
contemplation, song). Their hair grows in the same hue as their inner
energy and is the most reliable visual species cue.

### `ref-demagi-m-warrior` — DeMagi male, warrior archetype
- **Hair**: short layered cut, spiky upward fringe, deep violet-black with cool blue highlight at the tips.
- **Eyes**: glowing red-orange irises (active state); pupil visible as a darker dot inside the glow.
- **Skin**: pale-warm human, faint cool undertone at neck/cheeks (suggesting magical flush).
- **Build**: lean-athletic, broad shoulders, tapered waist, mid-twenties read.
- **Armor canon**: blood-crimson lacquered plate with brass-gold scrollwork edges, asymmetric pauldron with upswept fin, fitted gorget, side-skirt of ribbon-like layered tassets in matching crimson, black underweave at joints. Glowing yellow-orange sigil-vents at chest and shoulder.
- **Weapon**: single-handed straight sword, gold cruciform hilt with serpentine guard, blade lit ember-orange along the fuller (live-fire enchantment).
- **Backdrop the ref shows**: blood-red full moon over a charred tower-spire silhouette plain with smoldering crevasses — the DeMagi war-god's domain (matches the Nexon/Zenon battle aesthetic in `act1Step` 9–10).
- **Voice canon**: low-mid baritone, controlled breath, clipped consonants. Magic-cast lines are spoken (never shouted) at a half-step lower register with a subtle reverb tail (250ms, 18% wet). Reference timbre: a younger Hugh Jackman / Henry Cavill blend with a slight resonant chest. ElevenLabs profile to-be-cast: "demagi_warrior_m_v1".

### `ref-demagi-m-sage` — DeMagi male, sage archetype
- **Hair**: long silver-white, pulled into a half-up warrior's knot, loose strands at the temples; full silver beard, trimmed flat at the chin.
- **Eyes**: glowing pale-amber, soft (not fierce); deep crow's-feet, late-fifties read.
- **Skin**: warm tan, weathered, sun-aged.
- **Build**: powerful upper-body, broad chest, slightly stooped at the shoulders from carrying weight (literal and ceremonial), commanding stance.
- **Armor canon**: brushed-silver plate over an ivory underrobe, brass-gold edge filigree at the gorget, vambraces, and pauldrons; trailing white-cream cape draped from the right shoulder; a black sash at the waist. The silver shows hand-polishing wear at the high points (knees, elbows, shoulder ridges).
- **Weapon**: golden curved scimitar held low, blade lit warm-amber along the spine.
- **Backdrop the ref shows**: ochre desert plain at sundown, an enormous rust-orange sun behind black tower-spire silhouettes — the DeMagi monastic frontier (Thaloria-adjacent).
- **Voice canon**: warm low baritone with a slight grain, slow cadence, long unhurried pauses. Reference timbre: Mads Mikkelsen / Liam Neeson register. ElevenLabs profile: "demagi_sage_m_v1".

### `ref-demagi-f` — DeMagi female (derived; no canon image yet)
- Female DeMagi share **eye-glow + magical-hue hair** species cues. Render with: long flowing hair (any inner-energy color depending on discipline), iris glow same hue as hair, fitted articulated plate identical in silhouette logic to the male warrior — pauldrons asymmetric, side-skirt tassets, brass-gold scrollwork edges. Body proportions: athletic, mid-shoulder hair, no exaggerated bust (the DeMagi don't sex-stylize armor — armor is functional first, ceremonial second). When variant on the warrior archetype, hair color matches the chosen weapon-element (red/orange = fire, blue/cyan = ice, violet/magenta = arcane, green = nature). Voice canon: alto, controlled breath, magic-cast lines drop register and gain a half-second reverb tail. ElevenLabs profile: "demagi_warrior_f_v1".

### `ref-demagi-nb` — DeMagi non-binary (derived)
- Derive from the warrior archetype; render the body silhouette as **lean-androgynous** (lower shoulder slope than the male, lower hip slope than the female, even chest), hair shoulder-length asymmetric (one side shaved or short, one side long), eye-glow + hair color matched. Armor identical to warrior plate; no chest-shaping in the breastplate. Voice canon: tenor / contralto blend, cast in a register the player's voice-profile slider chooses at character creation.

---

## Quarchon (the alien constructed-form species)

Quarchon are humanoid in silhouette but **inorganic-presenting** — their
"flesh" is a polymer-ceramic shell over a substrate of micro-actuators
and circuit-traces. They do not have a fixed sex; they choose a
presentation when they bond to a discipline (the same way DeMagi choose
hair color when they bond to magic). The ref pairs below show two
distinct color+shape morphs to anchor the 6–8 morph slider in §18.

### `ref-quarchon-morph-pearl-violet` — Quarchon, pearl + violet morph
- **Head**: smooth high-domed helm-skull (no hair, no facial features beyond a faceplate); pearl-white shell with violet inset panels at the cheek and crown; single asymmetric green ocular point lit lime-bright on one side, faint on the other (a "wink" by design — Quarchon vision is monocular-active).
- **Build**: tall, broad-shouldered, narrow waist, hyper-athletic — the Quarchon "athletic" morph (one of two main shape phenotypes).
- **Body shell**: pearl-white over a violet-trim base, segmented at the chest with hexagonal crystal inset (red-orange, glowing), articulated at the joints with bronze-gold rings exposing dark-grey actuator bundles underneath; layered pauldrons in pearl with violet edge.
- **Weapon / staff**: ornate violet-and-bronze double-headed staff held vertical, the ends styled like blooming geometric spear-tips.
- **Backdrop the ref shows**: violet-foliage canopy, lavender mist — the Quarchon homeworld biosphere (oxidizing-but-poison-to-humans).
- **Voice canon**: synthesized-bright tenor with a 20Hz vocoder ring at the consonants; emotional inflection rendered through pitch-bend (not breath, since the Quarchon don't breathe). Reference timbre: Daft Punk's "Robot Rock" vocal register, but warmer. ElevenLabs profile: "quarchon_morph_pearl_v1".

### `ref-quarchon-morph-gold-noir` — Quarchon, gold + noir morph
- **Head**: faceted gold-bronze helm with a single eye-pip lit warm-amber (single ocular, centered, not asymmetric like the pearl morph); long indigo silk drape from the back of the helm to the mid-back, fluttering.
- **Build**: tall, slim-elegant; slighter shoulders than the pearl morph but longer-limbed (the Quarchon "ascetic" morph — second main shape phenotype).
- **Body shell**: gold-bronze segmented chest plates over an indigo-black underweave; chest cluster yellow-amber sigil; gauntlet articulation in gold over black; trailing indigo robe-skirt that wraps from the waist around the hips.
- **Weapon**: floating gold sickle-blade hovering above one open palm (the Quarchon's bond-symbol — a token, not a wielded weapon, that hovers via the actuator-substrate's micro-magnetic field).
- **Backdrop the ref shows**: pink-violet evening sky, dusty desert below, a vast pink moon — the Quarchon's diplomatic-era staging-world (Sector 4 trade-empire entry-point).
- **Voice canon**: synthesized-warm baritone, slower cadence, fewer vocoder rings, more harmonic depth (4-voice phase-stacked harmony at the long vowels). ElevenLabs profile: "quarchon_morph_gold_v1".

### Additional Quarchon morphs (derived for the 6-morph slider)
The player picks one of 6 Quarchon morphs at character creation. They
are presented as colors only in the UI (no labels). The 6 are:
1. **Pearl + violet** (athletic build, asymmetric green eye) — `ref-quarchon-morph-pearl-violet` above.
2. **Gold + noir** (ascetic build, single warm-amber eye, indigo drape) — `ref-quarchon-morph-gold-noir` above.
3. **Obsidian + cyan** (athletic build, twin cyan eye-strip, glossy black shell with cyan vent-glow at the joints).
4. **Bone + crimson** (ascetic build, single deep-red eye, weathered cream shell with arterial-crimson sigil-channels).
5. **Jade + copper** (athletic build, asymmetric copper eye + faint jade eye, jade shell with copper rivet-trim).
6. **Storm + silver** (ascetic build, single white-blue eye, smoke-grey shell with silver-cyan lightning-trace etching).
7. (Optional 7) **Rose + platinum** (athletic build, twin rose eye-pips, platinum shell with rose-gold edge and pale-pink core glow).
8. (Optional 8) **Char + gold** (ascetic build, single gold eye, deep-charcoal shell with gold-leaf cracking — the "old veteran" morph).

All 6–8 share the **single or twin ocular** species cue and the **shell-over-actuator** body language. Player skin-slider analogue is replaced for Quarchon by a 6–8 stage **shell-color-and-build morph**.

---

## Neyon (the colony-class warrior species)

Neyons are humanoid-mechanized symbiotes — born organic, fitted to
combat-shell at adolescence. The shell is permanent. They are the
species the Insurgency recruits most heavily; the Iron Lion's faction
is majority-Neyon. Color signals lineage (the orange tracery in the
ref is the color of the Iron Lion's bloodline; other lineages render
in cyan, magenta, gold).

### `ref-neyon-f-warrior` — Neyon female warrior, Iron-Lion lineage
- **Head**: smooth black faceplate with a downturned orange-glowing visor in a wide V-bracket from temple to cheek; no exposed face. Helmet flares slightly at the sides into a pointed silhouette.
- **Build**: clearly female silhouette (curved hip-to-waist, a defined-but-armored chest contour), but the armor is **first-and-foremost armor** — chest segments are angled-protective plates, not breast-cups; the female read comes from the underlying body shape, not from costume choice.
- **Body shell**: glossy obsidian-black plate over an orange-trace circuitry base, segmented at the chest, abdomen, hips, thighs, calves; orange chevron-glow runs along the inner thigh, side-of-torso, gauntlet, and helmet visor.
- **Weapon**: long single-edged blade held low in the right hand, blade lit yellow-amber along the cutting edge.
- **Backdrop the ref shows**: pure neutral grey (this is a character-sheet reference frame; in-world she stands in front of a dark-cyan corridor).
- **Voice canon**: alto, vocoder-lined (light flange, 8% wet, no pitch shift), clipped soldier-cadence; off-duty register loses the vocoder. Reference timbre: a Janelle Monáe "Suite II" register but a half-step lower. ElevenLabs profile: "neyon_warrior_f_orange_v1".

### `ref-neyon-m` — Neyon male (derived)
- Same shell architecture; male silhouette = wider shoulders, narrower hip-curve, flatter chest plating. The orange-trace lineage glow stays. Voice: baritone with the same vocoder treatment. ElevenLabs profile: "neyon_warrior_m_orange_v1".

### `ref-neyon-nb` — Neyon non-binary (derived)
- Same shell; neutral-balanced silhouette (shoulder/hip 1:1). Same vocoder treatment, voice register chosen by player slider. ElevenLabs profile: "neyon_warrior_nb_orange_v1".

### Lineage color variants (analog to the human skin slider)
The Neyon have an 8-stage lineage-color slider (replaces skin slider):
1. **Iron Lion orange** (above) — Insurgency commander lineage.
2. **Architect cyan** — pre-fall sovereign lineage.
3. **Watcher amber** — Panopticon enforcer lineage.
4. **Necromancer green** — Castle of Death lineage (rare; carries a faint foxfire-glow).
5. **Authority crimson** — New Babylon ceremonial lineage.
6. **Engineer brass** — Mechronis-academy lineage (warm gold, not cool gold).
7. **Source violet** — Terminus-corrupted lineage (rare, carries faint void-static at the joints).
8. **Witnessing white** — Bridge of Kael post-credits lineage (very rare, ceremonial; the only lineage with no hostile faction). 

---

## Human (the baseline species)

Use existing Loredex canon at `apps/shared/lore/loredex-data.json` for the
human visual baseline. The 8-stage skin slider is documented in §18.x of
the prompt book. No additional ref images required — render as the
pre-Awakening crewmember archetype already established in the Prelude
beat A art (Engineer / Patch / Elara silhouettes).

---

## Notes for the prompt-book authors

- For every body prompt that uses a ref above, **carry the ref-id verbatim** into the prompt's `Reference:` line, e.g., `Reference: ref-demagi-m-warrior (see docs/production/lcs-species-refs/CANON.md)`.
- Quarchon do **not** get a skin-tone slider — they get a **morph slider** (6–8 entries above). The UI presents both as the same control "Body" with no labels.
- DeMagi + Neyon + Human all use the **8-stage continuous skin slider** described in §18.x.
- All voice profiles get rendered against ElevenLabs Studio Projects (per VOICE_OVER_BIBLE.md), with the per-species processing chain baked in (DeMagi: cathedral-tail reverb on cast lines; Quarchon: vocoder ring; Neyon: light flange).
- "Energy chooses a form" awakening cinematic plays under Elara's existing line at character-creation. It follows §5 awakening-video cadence (15s, four shots, frame-chained). The four shots are: (1) drift-of-formless-light; (2) all four species silhouettes ghost-overlap; (3) the chosen form solidifies; (4) eyes / ocular open. Per-species closing-shot variant is a swap of shot 4 only — Shots 1–3 are universal.

## LCS rig + inventory layering rules (added 2026-05-09)

Every base-body render must be authored as the **un-armored inventory base**: the
character sheet displays the base body and **layers equipped inventory on top**
(helmet → chestplate → pauldrons → vambraces → tassets/skirt → greaves → boots →
weapon-slot → accessory-slots). To make the layering work without clipping:

1. **Pose**: relaxed three-quarter standing pose facing camera (5° from front), arms slightly out from sides (15° abduction at shoulder), palms angled inward. Legs slightly apart (shoulder-width). Weight evenly distributed. **No weapon held** in the base render. **No clothing or armor** in the base render — the body is the canvas; inventory is the overlay.
2. **Frame**: 1024×2048 portrait (full-body). Character occupies center column, ~75% of vertical. Head crown at 12% from top. Foot-soles at 92% from top.
3. **Background**: pure transparent (alpha) for the base render. The location-background pack (see §17.B) supplies the world behind.
4. **Standard underlay**: render with a neutral skin-tight underlayer — DeMagi/Human get a charcoal compression sleeveless top + leggings (does not occlude skin tone slider); Neyon/Quarchon shells are themselves the underlayer, so render straight to shell. This underlayer prevents inventory items from showing through to skin in a non-canonical way.
5. **Joint pins**: render must keep these areas un-occluded by hair/cape/silk so inventory items have a clean place to layer onto:
   - Crown (helmet pivot)
   - Both shoulder caps (pauldron pivot)
   - Sternum (chest-plate medallion)
   - Both wrists (vambrace pivot)
   - Hips left + right (tasset pivot)
   - Both knees (greave pivot)
   - Both ankles (boot pivot)
6. **Sex/morph silhouette guarantee**: The female DeMagi / Human / Neyon get a defined-but-modest hip-to-waist curve and a chest contour that does not exceed B-cup so universal armor pieces fit. The male variants get standard mesomorphic male silhouette. Non-binary uses a 1:1 shoulder/hip ratio. Quarchon morphs follow the two phenotypes (athletic / ascetic) described in §Quarchon above.

## Craftable armor series (added 2026-05-09)

In addition to the per-game-mode mastery armor (next section), the game ships
**8 craftable armor series** — sets earned by gathering crafting materials
through ordinary play. Each series has 7 pieces (helmet, chestplate, pauldrons,
vambraces, tassets, greaves, boots) and renders cleanly over the base bodies
above.

The 8 series:
1. **Salvaged Plate** (rusted-grey + brass — entry crafting tier)
2. **Mechronis Adept** (indigo + bronze, academy livery)
3. **Insurgency Field** (tactical-black + orange, Iron Lion lineage)
4. **Authority Ceremonial** (crimson + gold, New Babylon court)
5. **Castle of Death Carapace** (obsidian + foxfire-green, Necromancer guild)
6. **Watcher Sentinel** (charcoal + amber, Panopticon enforcer)
7. **Coda Operative** (gunmetal + violet, Vex Solène's faction)
8. **Reclamation Vestments** (ivory + cyan, post-Bridge of Kael endgame, ceremonial)

Each series gets a Nano Banana 2 prompt **per piece per species variant** in
§17.C of the prompt book (see PR-G3 scope).

## Per-game-mode mastery armor (added 2026-05-09)

Master a game mode → unlock a unique 7-piece armor set bound to that mode's
visual language. These are **prestige sets** — visually showy, narrative-tied,
and the only way to express mode-mastery in the LCS to other players.

The 12 mastery armors:
1. **Card-Game Mastery — "Dischordia Champion"**: gold-leaf trim over cardstock-textured plate, suit-symbols (clubs, hearts, diamonds, spades reinterpreted as faction sigils) etched into the pauldrons; helmet has a single floating tarot-card halo above the crown.
2. **Fighter-Game Mastery — "Crucible Forged"**: scorched-bronze plate with cracked-lava core glow at the chest, gauntlets ending in raptor-claw articulation, helmet a half-mask exposing the right eye.
3. **Chess Mastery — "Zephyr-9 Initiate"**: ivory-and-onyx checkered overlay (a literal 8×8 grid pattern flowing across the chest), brass king-crown helmet, queen's-collar pauldrons, a bishop's-stole hanging from one shoulder.
4. **Trade Empire Mastery — "Vox Magnate"**: indigo silk over brushed-platinum plate, a sigil-coin chain across the chest (each link a different sector's seal), the helmet a circlet not a full helm (signal of authority, not protection).
5. **Casino (Degen's) Mastery — "House Always Folds"**: midnight-blue lacquer with hand-cut amber inset shaped like falling chips, the helmet a low-brim formal hat with a glowing card-suit at the band, gauntlets in white evening-glove silhouette.
6. **Casino (Christmas in July) Mastery — "Tinsel Tyrant"**: candy-cane-striped pauldrons (red-white spiral) over obsidian plate, a wreath-circlet helmet, sleigh-bell wrist accents that chime audibly when the player moves on the LCS sheet.
7. **Dead Man's Circuit Mastery — "Throttlebound"**: leather-over-carbon-fiber racing plate, asymmetric pauldron with checkered-flag inlay, the helmet a full racing visor with HUD-glyph etching, exhaust-pipe tassets.
8. **Vortex Incursion Mastery — "Riftwalker"**: void-black plate that visibly distorts the air around the wearer (faint warp-haze VFX baked into the still), single starlight-pip on the chest, the helmet a smooth ovoid with no eye-slit (vision happens through the whole shell).
9. **Tower Defense Mastery — "Wallstanding"**: heavy slab-brick plate (looks like stacked masonry wrapped in steel banding), shoulder-mounted miniature trebuchet decorations, the helmet a battlement-crown.
10. **Loredex / Lore-Hunter Mastery — "Antiquarian's Apprentice"**: brown-leather scholar-coat over a brass-buckled chest harness, a bandolier of empty-but-glowing data-slates across the chest, helmet replaced by a high-collared cowl with a single brass monocle.
11. **Witnessing Mastery — "First Witness"**: pure-white silk under thin brass mesh, no face-helm (just a forehead-circlet with a single cyan eye-pip), wings of layered cyan light arcing from the back of the shoulders, the only set with no greaves (player-character is barefoot — this set is reverence-coded).
12. **PvP Mastery — "Tournament Crowned"**: tournament-banner-cape over a polished obsidian plate, laurel-wreath helmet circlet, asymmetric pauldron with an etched roster of every player the wearer has defeated (procedurally rendered as in-image text — the only set with rendered text by design).

Each is authored in §17.D of the prompt book (PR-G3 scope), with prompts per
species variant.

## LCS location backgrounds (added 2026-05-09)

The LCS displays the player's character on the **location background of their
choice** — like a Pokémon card art-back or a fighter character-select frame.
These backgrounds are also packaged as **cosmetic packs** and granted as
**prizes** in various game systems (deck-mastery, faction-war milestones, lore-
journal completion percentages, holiday-event clears, prestige-cycle resets).

The set covers every location-of-significance in the game (per the rooms
inventory in §12–§14 of this prompt book): all Ark interiors, all Celebration
campus rooms, all Mechronis academy rooms, all 12 guild common rooms, all 7
casino sub-rooms, all game-mode arenas (8 fighter stages, the chess classroom,
the Dead Man's Circuit track, the void-bingo hall, etc.), every Trade Empire
sector (×5 prosperity states), the prestige Reclamation Loop bridge console,
plus narrative landmarks (the Bridge of Kael, the Sacrum of Severed Silk, the
Coda Sanctum). **Total: ~120 LCS backgrounds.**

Authoring rules for an LCS background:
- **Frame**: 1024×2048 portrait, **NOT 1920×1080** — the LCS is a vertical sheet.
- **Character zone**: pure-zero foreground action in a centered vertical band 600px wide × 1400px tall, starting at 200px from top. Anything in this zone gets occluded by the rendered character. The background's **composition must lead the eye to that zone** — strong background symmetry around the centerline, focal-light pulled to the centerline-bottom (so the character appears to stand in the spotlight of the room).
- **Depth-of-field**: characters render sharp; the background renders with a 4-stop bokeh fall-off at the back of the room. Render the background with a slight 1.2x DOF blur baked in so when the character composites in front, the eye doesn't fight the wall texture.
- **No on-image text**: anywhere. (Tournament-Crowned mastery armor is the only design-mandated text exception in the whole LCS system, and that text is on the armor, not the background.)
- **Lighting register**: each background carries the room's canonical lighting register from §12–§14 — no override. The character render lighting (rim-light, hair-light, fill) is composited on top in the LCS engine, not baked into the background.

Pack groupings (cosmetic-shop / prize bundling):
- **Pack: Ark Interior** (12 backgrounds — every Ark room across both states where the room has a meaningful state-difference, max 2 per room).
- **Pack: Mechronis Academy** (3 backgrounds).
- **Pack: Celebration Campus** (6 classroom backgrounds + 1 grand-orientation).
- **Pack: Guild Commons** (12 — one per Archon Guild).
- **Pack: Casino Floors** (7).
- **Pack: Game-Mode Arenas** (~12 fighter / chess / DMC / void-bingo / dream-roulette / tower-defense / vortex-incursion / etc.).
- **Pack: Trade Empire Sectors** (~10 — one per sector type, in 2 of the 5 prosperity states each).
- **Pack: Narrative Landmarks** (~8 — Bridge of Kael, Sacrum, Coda Sanctum, Witnessing Hub, Castle of Death, Bridge primary, Cryo Bay primary, Archives primary).

Pack-grant triggers:
- Master a game mode → grant the matching arena pack background.
- Hit a faction-war milestone → grant a guild common-room background from that faction.
- Reach a Loredex completion threshold (25%, 50%, 75%, 100%) → grant the narrative-landmark pack at progressively-rarer tiers.
- Holiday event clears → grant the Christmas-in-July casino-floor variant + Christmas-overlaid versions of common rooms.
- Prestige-cycle reset → grant the Reclamation Loop bridge-console background.

These are authored in §17.B of the prompt book (PR-G2 scope), one prompt per
background, frame-pinned to the matching room state in §12–§14 so the
player-character composites into a consistent in-world location.
