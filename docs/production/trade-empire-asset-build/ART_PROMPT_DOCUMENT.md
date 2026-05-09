# Trade Empire — Consolidated Art & Video Prompt Document

This is the single source-of-truth handoff for everything the Trade Empire merge needs from art and video production. It collapses every art ask into one document, organised by feature, with concrete prompts the team can paste into their tools.

The repo's existing CSV manifests in `docs/production/trade-empire-asset-build/manifests/` already contain the canonical prompts for the asset categories that ship in bulk (sector matte paintings, civic icons, fleet silhouettes, etc.); this document references them by name rather than duplicating. **New** asset prompts (P1/P2/P3) live inline below — those are the deliverables that aren't already in a CSV.

## House style — apply to every prompt

> Dischordian Saga house style. Painterly digital illustration with visible brushwork at 1:1 and clean read at thumbnail scale. High-contrast low-saturation palette anchored on **one** hot accent colour per piece, never two. Cinematic lighting — single dominant key source, soft volumetric haze gradient across at least three depth planes, rim light only on hero silhouettes. Materials skew bio-mechanical / crystalline / wet-chrome / weathered ceramcrete; surface detail at the level of paint chips, water-staining, and honest wear. Subtle eldritch geometry suggested in negative space (rings-within-rings, recursive spirals, impossible angles) — never explicit. No on-image text, no UI chrome, no lens flares, no modern logos, no readable signage.
>
> Reference: `docs/ART_DEPARTMENT_PRODUCTION.md`.

When a prompt below contradicts the house style, the prompt wins for that asset.

---

## Priority key

- **P1** — blocks the merge; produce first
- **P2** — required for §8 features that have already been wired
- **P3** — nice-to-have polish, can wait

---

## Section A — Hub UI assets (P1)

The 3-tab hub at `/trade-empire/hub` (`apps/client/src/pages/TradeEmpireHubPage.tsx`) renders pure components today. Adding the following lifts it from functional to finished.

### A.1 Doom-clock corona overlay (P1)

The Convergence tab renders a pure-SVG doom clock (`TradeConvergencePanel.tsx`). Wrap it in a painted corona that shifts between three phase states.

**Asset:** 320×320px transparent PNG, three variants (`dormant`, `open`, `resolved`).

> 1:1 transparent overlay corona for a 160px central numeral readout. Variant 1 (dormant): cool cobalt 6500K outer halo, faint recursive ring-pattern in the bezel, no text, no figures, the centre transparent so the SVG numeral reads through. Variant 2 (open): the same bezel, now flickering with a hot oxblood 1500K inner halo, recursive rings deeper, faint condensation suggested at the lower edge — the clock has woken up. Variant 3 (resolved): bruise-violet 4500K halo, candle-soot smudge across the bezel, the recursive rings frozen mid-collapse — the climax has passed. House-style painterly; no on-image text.

### A.2 Saturation gauge background (P1)

The saturation HUD renders horizontal bars per anchor sector. A painted backdrop card per sector lifts the visual weight of the Convergence tab.

**Asset:** 1024×96px painted strips × 8 anchor sectors (trade_nexus, the_trench, antiquarian_archive, degens_casino, thaloria, free_port_alpha, ark_debris_field, terminus_approach).

For each sector, the strip should be a horizontal slice of that sector's matte painting (already in `trade_empire_art_prompts__sector_painting.csv`). The strip should desaturate from full-colour at left to spore-black at right so the saturation bar overlay reads at every fill level.

### A.3 Tab chrome triptych (P1)

Three tab headers for Map / Court / Convergence.

**Asset:** 800×80px, three icons with house-style chrome.

> Three companion tab headers, painted as a triptych. **Map**: a hand-drawn star chart fragment with three sector glyphs and route-lines in port-bronze on dark sea-glass; one sector pulsing soft amber. **Court**: a low-angle ceremonial table with a gavel and three folded scrolls in oxblood + gilt; one scroll partially unrolled to suggest active session. **Convergence**: a slim cobalt-to-oxblood gradient bar with the doom-clock numeral silhouetted, a single candle in foreground at lower-left. Triptych shares a unified key direction (frame-left). No text on any of the three.

### A.4 Season banner backdrop (P1)

The hub's `SeasonBanner` shows the active declaration headline. A painted slim backdrop frames it.

**Asset:** 1920×80px painted strip with a centre vignette suitable for text overlay.

> Long horizontal painted strip. Left third: a deep funeral-violet swatch with candle-soot pattern (Thaloria). Centre third: oxblood with gilt seal motif (Authority). Right third: spore-black with a single bruise-red filament (Hierarchy). The three swatches blend at boundaries so any of them can land at the centre vignette where the declaration headline overlays. Mood: the season's political weather.

---

## Section B — §8 feature art

For §8 features that already have a manifest (sub-house identity, pirate portraits, fleet silhouettes, sector paintings), the existing CSVs are the brief. This section adds **new** prompts for the §8 deliverables that don't have a manifest yet.

### B.1 §8.10 Frontier Rotation — banner + splash (P2)

**Frontier banner overlay (1 generic).**

> 1024×128px painted strip, transparent edges. A weathered Free Ports-port-bronze banner stencilled with the single word "FRONTIER" in a hand-built letterform — only enough of the letterform that a viewer recognises the word at the centre but cannot quite read the edges. Background dock-water reflection. No on-image text other than the stencil. Mood: this is being decided right now.

**Per-sector frontier splash (8 sectors).** One painted splash card per FRONTIER_CANDIDATE sector (`apps/shared/tradeEmpire/frontier.ts`). Each is the establishing shot when the rotation moves that sector to frontier status.

For each of free_port_alpha / free_port_beta / outer_rim_holdouts / thaloria_marches / drift_corridor_north / drift_corridor_south / old_panopticon_ruins / broken_archive_world:

> 16:9 cinematic key art at 1920×1080. The sector's matte painting at near-distance, with a Coalition-era frontier banner half-visible in foreground (port-bronze + sea-glass palette). Atmospheric particulate increasing across frame. A small recon vessel at lower-third, lights on. Mood: the frontier just opened here. No on-image text.

### B.2 §8.9 Edicts — scroll + icon set (P2)

**Edict scroll backdrops (8 factions × 1).**

For each of new_babylon / hierarchy / antiquarian / thaloria / independent / insurgency / artificial_empire / thought_virus:

> 1200×800px painted vertical scroll. The scroll material matches the faction's identity palette (e.g. New Babylon = oxblood paper with gilt edges; Thaloria = funeral-violet vellum with candle-soot wax seal). A single ceremonial sigil in the upper centre. The body of the scroll is empty parchment so edict text can overlay. No on-image text. Three painted creases suggest the scroll has been opened and refolded. Mood: the order has been written; only the binding seal remains.

**Edict icon set (10 icons matching EDICT_REGISTRY entries).** 64×64 transparent sprites.

For each of: industrial_levy, recognition_of_revival, ledger_compliance, casino_partnership, fortified_stance, severance_alignment, acquisitions_proxy, shelfmate_priority, freeport_charter, silent_year, archivist_audit, frontier_conscription, sovereigns_quietude, architects_petition:

> 64×64 painted sprite, transparent background. A single visual metaphor for the edict — e.g. industrial_levy = a hammer crossed with a stamped tax-mark; silent_year = a single candle behind a closed lip; sovereigns_quietude = a viral-tendril holding a contract scroll. House-style; the colour matches the issuing faction's palette. No text.

### B.3 §8.6 Sector Memory + Gossip — bulletin frame + 12 event icons (P2)

**Bulletin board frame (1 asset).**

> 800×600px painted UI frame, four-sided. A weathered cork-and-brass bulletin board, the kind that lives at the dock-master's desk, with three pin marks and one half-torn corner. Centre transparent for content overlay. No on-image text. Mood: a place where current rumours pin themselves.

**12 gossip-event icons.** 48×48 transparent sprites for the 13 PublicKnowledgeEventKinds (one per kind) — `contract_signed`, `contract_breached`, `demand_paid`, `demand_refused`, `tribute_paid`, `cover_blown`, `agenda_step`, `season_declaration`, `sector_flipped`, `house_oath_sworn`, `house_oath_broken`, `anomaly_discovered`, `ruin_uncovered`.

> 48×48 painted sprite, transparent background. A single icon glyph per event kind. Examples: `contract_signed` = a quill pressing into wax; `cover_blown` = a torn dossier badge; `demand_refused` = a closed door with a hand-mark; `season_declaration` = a stencilled seal mid-stamp. House-style; muted colour with one accent per glyph. No text.

### B.4 §8.5 Trade Fleets as Companions — companion fleet silhouettes (P2)

The 3 companion silhouettes were already added to `trade_empire_art_prompts__fleet_silhouette.csv` (Patch / Zephyr-9 / Little One) in commit `deaaefa`. **Plus** one cinematic-moment splash per companion taking command:

For each of patch / zephyr_9 / little_one:

> 16:9 cinematic, 1920×1080. The companion centred on the bridge of their fleet's lead ship, hand on the helm, a single signature trait visible (Patch's service-arm extending into frame; Zephyr-9's antenna-array filling the upper third; Little One's stealth-coat blending into the bridge shadows). Lighting matches the companion's palette (engineer-yellow / intelligence-cyan / stealth-violet). Mood: the moment they accept command.

### B.5 §8.3 Infiltration Paths — cover identity dossiers (P2)

Per `apps/shared/tradeEmpire/infiltrationPaths.ts` COVER_IDENTITY_GRAPH (8 covers): a dossier-style headshot per cover. These are **distinct** from the sub-house portrait packs — the covers are the *aliases* the Spy wears, not the underlying NPC.

For each of cover_nb_civic_engineer / cover_hierarchy_acquisitions_clerk / cover_antiquarian_shelfmate / cover_thaloria_quietworker / cover_freeport_quartermaster / cover_insurgent_courier / cover_substrate_dissident / cover_sovereigns_observer:

> 4:5 portrait at 768×960. A passport-style headshot of a fictional person in the cover's faction uniform — Civic Engineers union jacket, Acquisitions field clerk badge, Shelf-mate provenance pin, etc. Slight blur at the edges (this is a dossier scan, not a glamour shot). Lighting: cool 6500K key, no warm fill, deep void background. The face is generic enough to be plausibly any operative's; the uniform sells it. Mood: this person does not exist; you do.

**Plus** an infiltration-graph dossier UI backdrop (1 asset, 1600×1200):

> Painted dossier folder open on a table, the kind a handler would slide across to a Spy at the start of a multi-hop op. Two portraits visible top-edge (corner-clipped); a hand-drawn graph linking eight covers in lower half, with red threads marking active routes. Brass paperweight at corner. Mood: the route map is ready.

### B.6 §8.8 Piracy — already covered

`trade_empire_art_prompts__pirate_portrait.csv` was extended in commit `deaaefa` with 6 captain portraits, 3 fleet silhouettes, 1 raid encounter key art. **No new prompts needed**; production can pick that manifest up directly.

### B.7 §8.7 Dreamer's Shield mystery — clue cards + breach cinematic (P2)

**3 mystery-clue cards** (one per investigation step 2-4 of the chain — see `apps/shared/tradeEmpire/dreamerShieldMystery.ts`).

> 800×1200px painted card, vertical. Each card is a mystery-clue artefact corresponding to its step:
>
> - **Step 2 (verify_the_math):** A page from Daniel Cross's working journal, three citations annotated in margin, a faint refraction caustic visible in the cross-references — the math is right.
> - **Step 3 (find_the_artifact):** The artifact itself, recovered from Panopticon Ruins. A device whose function is, today, opaque; the casing has been opened once and resealed wrong. Wraith Calder has touched it; the touch left a faint candle-wax residue.
> - **Step 4 (tribute_the_artifact):** Daniel Cross's filed margin note: "the proof is in the artefact's silence." The artifact at the bottom of the frame, the proof at the top.
>
> House-style; muted palettes per step. No on-image text other than the implied margin notes (illegible at viewer distance).

**Breach cinematic** (the Step 5 crossing) — strong candidate for **Kling-Omni production**:

> 30-second cinematic. Wide on the Dreamer Barrier from low orbit (use the existing `sector_dreamer_shield_alt` matte painting as start frame). The player's vessel at frame centre, lights on. The Shield does not move. The vessel approaches; the Shield does not refuse. At the moment of contact, the Shield's refractive caustic *bends around* the vessel without resisting. The vessel passes. The Shield closes seamlessly behind. Cut to black. Hold for 2 beats. Cut back: the player's vessel is on the other side, in a space that does not visibly differ but feels different. The cinematic ends before any dialog.
>
> 8K, cel-shaded cosmic style matching `10_trade_empire.md`. Single cool 8000K shield-pearl key. Audio: silence after the contact moment.

### B.8 §8.2 Table Diplomacy minigame — full art set (P2)

This is the largest §8 art ask. The minigame is the Court tab's signature interactive moment.

**B.8.1 Faction table backdrops (9 backdrops × 1 each = 9).**

For each of new_babylon / hierarchy / antiquarian / thaloria / independent / insurgency / artificial_empire / thought_virus / potentials:

> 1920×1080 painted establishing shot. A formal negotiation chamber styled to that faction. Examples:
>
> - **new_babylon:** Authority's ceremonial chamber — the six red-crystal coffins in soft focus across the upper third, a long oxblood table at the centre, gilt chairs on opposite sides.
> - **hierarchy:** Trench acquisitions boardroom — black-iron table, blood-weave threads woven into the chair upholstery, schematic ritual instruments on the side wall.
> - **antiquarian:** Archive antechamber — long reading-room table, citation ribbons hanging between bookcases, a single candle for warmth.
> - **thaloria:** Council chamber on Thaloria — funeral-violet drapes, candle-warm key, six unlit candles arranged on a low ceremonial table.
> - **independent:** Free Ports market hall — barrels and crates serving as table and chairs, rope-bridge in background.
> - **insurgency:** Old Network safehouse — rust-streaked walls, a folding table with a single hand-radio, no chairs (everyone stands).
> - **artificial_empire:** Architect's lattice chamber — surveillance-cyan ambient, geometrically-impossible table, no human-scale chairs.
> - **thought_virus:** Sovereign's parlour — spore-black walls with bioluminescent accents, an organic-grown table, two reluctantly-sat captives in mid-frame.
> - **potentials:** Old Senate antechamber — Restoration-era marble, two empty chairs, a Reformer banner half-hung over a Restorationist mosaic.
>
> Painterly cinematic; one warm key per chamber; mood = "the negotiation has not yet begun." No figures at the table (figures rendered separately as overlays).

**B.8.2 Card backs per faction (9 designs).**

> 600×800px painted card back, one per faction. Each card back is a single ornate sigil at centre, the faction's identity palette throughout, a thin border decoration. Should read clearly when face-down on a table backdrop. No on-image text. Hand-painted, slightly worn (the deck has been used).

**B.8.3 Demand card faces (representative slice — 27 cards).**

The full deck is 81 cards (9 factions × 3 archetypes × 3 tiers). For Phase D, produce one card-face per faction × archetype (9 × 3 = 27 hero cards); the tier variants can reuse a card face with a modified frame colour (P3 polish).

For each faction × archetype:

> 600×800px painted card face. A single visual metaphor for the demand archetype rendered in the faction's palette:
>
> - **territorial:** a hand or seal pressing onto a map fragment
> - **economic:** a balance scale with one side heavier
> - **ideological:** a banner unfurled, mid-furl
>
> Above the metaphor: a thin ribbon area (top 15% of card) for the demand text overlay (no on-image text — overlaid by client). Below: 5 ornamental dots that the tier indicator overlays. House style. Mood: the asking face of a faction.

**B.8.4 Counter card faces (6 cards).**

For each of cite_precedent / recharacterize / invoke_neutrality / amplify_concession / split_concession / reflect_demand:

> 600×800px painted card face, neutral palette (broker is neutral). A single visual metaphor for the counter:
>
> - **cite_precedent:** an open law-volume with a finger pinning a passage
> - **recharacterize:** a single object casting two different shadows
> - **invoke_neutrality:** a hand raised palm-out between two opposed banners
> - **amplify_concession:** a balance scale with one side weighed by an additional weight
> - **split_concession:** a single coin halved cleanly
> - **reflect_demand:** a mirror at 45° refracting two opposite arrows back toward each other
>
> Card frame in port-bronze (the broker's neutral colour). House style. No on-image text.

**B.8.5 Treaty scroll resolution art (1 final-state asset).**

> 1600×1200px. The signed treaty scroll lying on a chamber table after the session resolves. The scroll's text is implied (illegible at viewer distance). A single Council seal at the centre. Two faction sigils at top-left and top-right corners. A small candle burning in foreground (regardless of faction — every signed treaty gets a candle, by Court convention). Mood: it is done.

---

## Section C — Existing manifests (reference)

These manifests already contain canonical prompts. Production can pick them up as-is:

| Manifest | Path | Asset count |
|---|---|---|
| Sub-house identity (crest + banner + portrait) | `manifests/sub_house_identity.csv` | 52 prompts |
| Sector matte paintings | `manifests/trade_empire_art_prompts__sector_painting.csv` | 38 prompts |
| Pirate portraits + fleet silhouettes + raid art | `manifests/trade_empire_art_prompts__pirate_portrait.csv` | 11 prompts |
| Fleet silhouettes (incl. companion fleets) | `manifests/trade_empire_art_prompts__fleet_silhouette.csv` | 45 prompts |
| Wonder cards | `manifests/trade_empire_art_prompts__wonder.csv` | 56 prompts |
| Era banners | `manifests/trade_empire_art_prompts__era_banner.csv` | 35 prompts |
| Civic icons | `manifests/trade_empire_art_prompts__civic_icon.csv` | 63 prompts |
| Doctrine banners | `manifests/trade_empire_art_prompts__doctrine_banner.csv` | 28 prompts |
| Encounter key art | `manifests/trade_empire_art_prompts__encounter_key_art.csv` | 28 prompts |
| Gates A/B/C/D (story-gate art per Act) | `manifests/trade_empire_art_prompts__gate_{A,B,C,D}.csv` | 490 prompts |

---

## Section D — Video

### D.1 Kling-Omni harbor cinematic (P1) — production-ready

The full 3-minute (12 × 15s) script for the Trade Empire intro lives at `docs/production/prompts/kling-omni-mechanic-intros/10_trade_empire.md`. **No additional prompt work needed** — the script is shot-by-shot complete with start-frame, end-frame, motion, and continuity notes. Hand directly to the Kling-Omni renderer.

Triggers `mech_trade_empire_intro_seen` flag on completion; unlocks Veska's `cc_mech_trade_empire_first` reactive line.

### D.2 §8.7 Dreamer's Shield breach cinematic (P2)

See B.7 above. 30-second cinematic; matte painting + cel-shaded cosmic style; production-ready prompt embedded in section B.7.

### D.3 §8.2 Table Diplomacy session cinematics (P3)

For each of the 36 faction-pair matchups (9 factions × 8 partners; symmetric so 36 unique pairs), a 5-second cinematic of the negotiators sitting down at the table:

> 5-second cinematic. Two figures (one per faction) walking into the chamber, each from their own door, meeting at the table. They sit. The candle (or chamber-equivalent) lights itself. Cinematic ends. No dialog. Lighting: dual-key — each figure lit in their own faction's palette as they enter, blending at centre when they sit.

This is **P3 polish**; the minigame works without these cinematics in the MVP (the chamber backdrop alone carries the moment).

### D.4 Convergence climax resolution cinematics (P2)

3 cinematics, one per resolution. The narrative + cinematic-summary briefs are already in `apps/shared/tradeEmpire/convergenceClimax.ts` under each resolution's `cinematicSummary` field — production-ready briefs:

- **`climax.trade_sector`** — 12-second hold on the Authority's ceremonial chamber (full brief in the file)
- **`climax.withdraw_fleet`** — establishing shot of fleet warping out of Free Ports anchorage (full brief in the file)
- **`climax.negotiate_armistice`** — long single-take of the player walking down the Council corridor alone (full brief in the file)

Per resolution: 30 seconds. Cel-shaded cosmic style for `withdraw_fleet`; painted-cinematic style for `trade_sector` and `negotiate_armistice`.

---

## Section E — Voice-over (already complete)

VO is **not** an art ask — it's a recording session. The full 233-line pack with all 10 speakers cast and pinned to ElevenLabs voice IDs lives at `apps/shared/tradeEmpireVoLinePacks.json`. Production runs `python3 apps/scripts/generate_trade_empire_vo.py` to render the full pack. Drael'Mon's casting brief is embedded inline at `casting_briefs.drael_mon`.

Flagged here only so the art lead knows the audio side is unblocked.

---

## Section F — Production checklist

To ship the full Trade Empire merge content-complete, the art team needs to produce, in priority order:

**Wave 1 — P1 (unblocks the merge surface):**
1. Hub UI assets (A.1, A.2, A.3, A.4) — 4 painted assets
2. Sub-house identity packs (52 prompts in `sub_house_identity.csv`)
3. 5 missing sector matte paintings (already authored in `sector_painting.csv` extension)
4. Kling-Omni 3-min harbor render (D.1)

**Wave 2 — P2 (unblocks §8 features):**
5. Frontier banner + 8 splash variants (B.1)
6. Edict scrolls × 8 + edict icons × 14 (B.2)
7. Bulletin board frame + 12 gossip event icons (B.3)
8. Companion fleet command splashes × 3 (B.4)
9. Cover identity dossiers × 8 + dossier backdrop (B.5)
10. Pirate captains × 6 + fleet silhouettes × 3 + raid encounter art (already in `pirate_portrait.csv`)
11. Mystery clue cards × 3 + breach cinematic (B.7, D.2)
12. Table Diplomacy art set: 9 backdrops + 9 card backs + 27 demand cards + 6 counter cards + 1 treaty scroll (B.8)
13. Convergence climax cinematics × 3 (D.4)

**Wave 3 — P3 (polish):**
14. Per-tier demand card variants (54 additional faces)
15. Diplomacy faction-pair sit-down cinematics × 36 (D.3)
16. Edict-issued herald micro-cinematics × 8 (one per faction, 5s each)

---

## Section G — How to read this document

For each prompt in sections A–B–D:

- **Asset:** dimensions and quantity
- **Prompt:** the description to feed your tool of choice (Midjourney, Stable Diffusion, Nano Banana 2, etc.)
- **House style:** prepend the house-style block at the top of this document to every prompt unless the prompt explicitly contradicts.
- **File output:** save to a path under `apps/client/public/art/trade_empire/<feature>/<asset_id>.<ext>` so the existing `assetUrl()` helper in `apps/client/src/lib/assetUrl.ts` resolves correctly.

For prompts already in CSV manifests: feed the CSV row's `composed_prompt` column directly to your tool. The `asset_id` column is the canonical filename for the rendered output.

Questions during production should be filed in the same `docs/production/trade-empire-asset-build/` directory.
