# Dischordian Saga — Expansion Production Book

**122 cards · 9 cinematics · 18 VFX assets.** Single artist + animator + video-vendor hand-off for the S2_HIERARCHY expansion + ACT_EXCLUSIVES set + commercial-release special editions. Generated from `apps/shared/tcg-core/expansionPrompts/`.

---

## How to read this document

Three sections: §1 cards (the artist's brief, one entry per card), §2 cinematics (beat-by-beat shot lists for the 9 cutscenes), §3 VFX (per-asset briefs for the 18 effects, locked to the prelude pipeline output spec).

Every entry carries ≥1 lore citation pointing to a real file path in the repository. The CI test (`apps/shared/tcg-core/expansionPrompts/expansion.test.ts`) enforces structural rigor: required fields populated, citations present, no Acts 3-7 spoiler keywords in non-secret entries, Hierarchy un-canon entries carry archetype rationale.

**Lore boundary:** Epoch-2 cutoff applies. Acts 3-7 reveals (Watcher unmasking, Source identity, Convergence chord identity, Engineer hidden-variable, Two Witnesses bond, Darren memorial) MUST stay hidden in the art unless the entry is one of the 7 unlock-gated lore-discovery secrets. The secrets surface their Act's earned truth as the Memoirist's first-person notebook reflection — never as authoritative third-person identity reveal.

---

## Master template (locked, applies to every card-art entry)

These tokens are pre-baked into every render and do not need to be re-stated per card:

| Field | Value |
| --- | --- |
| Prefix | `Trading card portrait, ornate frame,` |
| Required tokens | `afrofuturist`, `trading card aesthetic`, `cinematic lighting`, `3:4 portrait framing`, `neon-edge detail` |
| Negative tokens | `generic fantasy`, `anime`, `chibi`, `realistic photo` |
| Locked LoRA | `dischordian_cards_v2` |
| Locked seed | `4475` |
| Aspect ratio | `3:4` |
| Target model | `flux-dev` |

---

## VFX output spec (locked, applies to every §3 VFX entry)

| Field | Value |
| --- | --- |
| Resolution | `1920 × 1080` |
| Codec | `vp9` (WebM container) |
| Alpha channel | `true` (transparent background) |
| Frame rate | `30` fps |
| Pipeline reference | `prelude-asset-build/prompts/vfx/README.md` |

---

## Table of contents

### §1 — Cards
- [Hierarchy of the Damned — C-Suite (Mythic, 7)](#hierarchy-of-the-damned-c-suite-mythic-7)
- [Hierarchy of the Damned — VPs (Legendary, 7)](#hierarchy-of-the-damned-vps-legendary-7)
- [Hierarchy of the Damned — Directors (Epic, 14)](#hierarchy-of-the-damned-directors-epic-14)
- [Hierarchy of the Damned — Managers (Rare, 18)](#hierarchy-of-the-damned-managers-rare-18)
- [Hierarchy of the Damned — Analysts (Uncommon, 24)](#hierarchy-of-the-damned-analysts-uncommon-24)
- [Hierarchy of the Damned — Interns (Common, 14)](#hierarchy-of-the-damned-interns-common-14)
- [Act 1 — The Memoir / The Signal (4)](#act-1-the-memoir-the-signal-4)
- [Act 2 — The Whisper / The Engineer's Bench (4)](#act-2-the-whisper-the-engineers-bench-4)
- [Act 3 — The Offer / Eyes in the Dark (4)](#act-3-the-offer-eyes-in-the-dark-4)
- [Act 4 — The Revelation / The Prisoner (4)](#act-4-the-revelation-the-prisoner-4)
- [Act 5 — The Map / The Reckoning (4)](#act-5-the-map-the-reckoning-4)
- [Act 6 — The Confession (4)](#act-6-the-confession-4)
- [Act 7 — The Convergence (4)](#act-7-the-convergence-4)
- [Special Editions — Cosmetic Triptych (3)](#special-editions-cosmetic-triptych-3)
- [Special Editions — Lore-Discovery Secrets (7)](#special-editions-lore-discovery-secrets-7)

### §2 — Cinematics
- [Card Pack Opening (Canonical Cinematic)](#card-pack-opening-canonical-cinematic)
- [Hierarchy Reveal — Mol'Garath's First Acknowledgment](#hierarchy-reveal-molgaraths-first-acknowledgment)
- [Act 1 — The Memoir Opens](#act-1-the-memoir-opens)
- [Act 2 — The Whisper Begins](#act-2-the-whisper-begins)
- [Act 3 — The Offer Presented](#act-3-the-offer-presented)
- [Act 4 — The Revelation Meets](#act-4-the-revelation-meets)
- [Act 5 — The Map Closes Year One](#act-5-the-map-closes-year-one)
- [Act 6 — The Confession Spoken](#act-6-the-confession-spoken)
- [Act 7 — The Convergence Resolves](#act-7-the-convergence-resolves)

### §3 — VFX
- [vfx_pack_flip_common](#vfx_pack_flip_common)
- [vfx_pack_flip_uncommon](#vfx_pack_flip_uncommon)
- [vfx_pack_flip_rare](#vfx_pack_flip_rare)
- [vfx_pack_flip_epic](#vfx_pack_flip_epic)
- [vfx_pack_flip_legendary](#vfx_pack_flip_legendary)
- [vfx_pack_flip_mythic](#vfx_pack_flip_mythic)
- [vfx_pack_flip_neyon](#vfx_pack_flip_neyon)
- [vfx_hierarchy_performance_review](#vfx_hierarchy_performance_review)
- [vfx_hierarchy_quarterly_earnings](#vfx_hierarchy_quarterly_earnings)
- [vfx_hierarchy_stock_buyback](#vfx_hierarchy_stock_buyback)
- [vfx_cosmetic_founder_badge_unfold](#vfx_cosmetic_founder_badge_unfold)
- [vfx_cosmetic_set_completion_ceremony](#vfx_cosmetic_set_completion_ceremony)
- [vfx_cosmetic_bp50_author_reveal](#vfx_cosmetic_bp50_author_reveal)
- [vfx_act1_signal_pulse](#vfx_act1_signal_pulse)
- [vfx_act2_whisper_drift](#vfx_act2_whisper_drift)
- [vfx_act3_offer_doors](#vfx_act3_offer_doors)
- [vfx_act4_revelation_scry](#vfx_act4_revelation_scry)
- [vfx_act5_map_lock](#vfx_act5_map_lock)

---

# §1 — Cards (122)

## Hierarchy of the Damned — C-Suite (Mythic, 7)

*7 cards in this section.*

### Iglarath, CISO & Inevitability-Breach Auditor

**ID:** `s2_hierarchy_ciso_iglarath` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** mythic · **Type:** unit

> *The Hierarchy is unbreachable in principle. Iglarath audits the breaches that occur in practice. The two facts are reconciled quarterly.*

**Scene:** Mid-shot. Iglarath is a tall Quarchon figure in a Hierarchy night-blue uniform with high collar and silver piping, standing in a circular vault-room at the centre of a holographic threat-map sphere — the sphere is roughly two metres across, hovering at chest height, displaying the Hierarchy's seventeen-dimension perimeter as a glowing wireframe. Several small red-pulse breach-points are flagged across the sphere, each annotated with a tiny floating dossier. Iglarath is mid-action: right hand pinch-zooming on one breach (Insurgency-aligned, by the dossier's signal-green sigil), left hand resting on the hilt of a ceremonial Hierarchy short-sword still sheathed. Her face has six small horizontally-arranged eyes across a smooth obsidian forehead — all six are tracking different data feeds simultaneously. Behind her: a wall of dim cyan monitor-light + rack-mounted cipher-engines.

**Mood:** *perimeter security as cosmology* · *six eyes, six feeds, one audit* · *the breach that already happened* · *calm of a threat-modeler*

**Palette:** Hierarchy night-blue uniform + silver piping + obsidian face + holographic threat-sphere cool-cyan + breach-point pulse-red + Insurgency-flag signal-green accent

**Composition:** Mid-shot three-quarter, Iglarath at frame-centre, holographic threat-sphere occupying centre-of-frame at chest height, vault-room arc receding

**Notes:** Mythic. The six-eye motif is the Iglarath signature; do NOT use it on any other Hierarchy card. The Insurgency green-sigil breach-flag is canon — the Insurgency does in fact penetrate the Hierarchy perimeter (LORE_BIBLE Acts 3-7 framing) — but the dossier text must be illegible so this card doesn't confirm specific operations. Six-eye coverage of multiple feeds parallels Riri's six-arm coverage of seventeen dimensions; intentional design echo.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. The CISO role canonically guards the Hierarchy's information-perimeter; pairing with Iglarath's six-eye motif gives the role a memorable visual signature parallel to Riri's six-arm motif.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Insurgency vs Hierarchy operational framing


### Mol'Garath the Unmaker, CEO of the Hierarchy

**ID:** `s2_hierarchy_ceo_mol_garath` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** mythic · **Type:** unit

> *Where lesser executives hold quarterly reviews, Mol'Garath holds quarterly Unmakings. The Labyrinth was his first audit. The 72-hour deadline was his only joke.*

**Scene:** Wide low-angle hero shot from the Hierarchy's apex boardroom — a vast obsidian-and-bone roundtable suspended over a churning red-black abyss. Mol'Garath stands at the head of the table, an enormous twelve-foot horned silhouette in a tailored matte-black executive suit, the cloth shot through with veins of dim red phosphor that pulse in time with his breathing. His face is a sculpted onyx mask with no mouth and four small inset eyes arranged in a square pattern. In one gauntleted hand he holds a Contract — a parchment scroll folded into the shape of a guillotine blade, its edge weeping a single drop of blood that hangs frozen mid-fall. Behind him: the wall is one vast translucent window onto the Labyrinth of Unmaking — geometry that turns when you look away. Faint bureaucratic-green provoke-glow rims his shoulders.

**Mood:** *contracts are sacred law* · *the Unmaking is policy, not malice* · *boredom of immortal authority* · *sculpted-mask presidency*

**Palette:** Hierarchy obsidian-black + corporate matte suit + red-black abyss + dim red phosphor veins + bureaucratic-green provoke-rim + frozen blood-drop accent

**Composition:** Wide low-angle hero shot, Mol'Garath at frame-centre at the boardroom-table head, Labyrinth window filling upper-third of frame

**Notes:** Mythic. Mol'Garath's mask must NOT show emotion — the canon framing is procedural, not cruel. The contract-as-guillotine motif is the Hierarchy signature; every C-Suite card carries some variant of it. The Labyrinth window must be visible but indistinct — readers should sense the Game Master defeated it but not see how.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Mol'Garath
- docs/built/LORE_BIBLE.md §Game Master (Labyrinth-of-Unmaking 72hr resolution)
- apps/client/src/pages/DemonPackPage.tsx:Mol'Garath's Vault SKU


### Mor'Vethic, CHRO & Headcount Reaper

**ID:** `s2_hierarchy_chro_mor_vethic` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** mythic · **Type:** unit

> *Performance is a managed asset. Tenure is a depreciation curve. Mor'Vethic is the line item where 'voluntary separation' becomes a Hierarchy euphemism.*

**Scene:** Mid-shot three-quarter. Mor'Vethic is broad-shouldered, mid-fifties, with the patient bearing of a senior HR partner who has held a thousand exit interviews. She wears a Hierarchy plum-and-charcoal pantsuit, a small silver Hierarchy crest-pin at the lapel, half-moon reading glasses pushed up onto greying hair pulled into a low bun. Her face is professional, faintly sympathetic — the dangerous kind of sympathy. She is seated across a small interview-table from an empty chair (we read the absence — someone has just been separated). Both hands rest folded over a manila personnel-folder marked CONFIDENTIAL. The folder is open just enough to show the single word 'TERMINATED' stamped in bureaucratic-red ink across an ID photo we deliberately cannot quite resolve. Behind her: a low credenza with a small potted asphodel plant, a framed Hierarchy values-statement, a coffee cup half-empty.

**Mood:** *the dangerous sympathy of HR* · *voluntary separation as Hierarchy euphemism* · *bureaucratic red, no shouting* · *the chair that just emptied*

**Palette:** Hierarchy plum + charcoal pantsuit + silver crest-pin + warm domestic-office uplight + bureaucratic-red TERMINATED stamp + asphodel plant pale-grey-violet

**Composition:** Mid-shot three-quarter, Mor'Vethic at frame-centre seated, empty chair partially visible in extreme foreground (out-of-focus), credenza and asphodel behind

**Notes:** Mythic. The empty chair foreground is the canon Mor'Vethic motif — she is always seen *after* a separation, never during. The unresolvable ID photo must be deliberately blurred so it doesn't accidentally read as any named character. Asphodel = funerary plant, classical underworld reference; subtle, not explicit.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. The Hierarchy framing is corporate-bureaucratic; an HR officer who turns severance into ritual fits the LORE_BIBLE 'infernal corporation from the Abyss' pattern more naturally than a horned reaper would.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Xeth'Raal Ledger-of-Ruin (parallel: Mor'Vethic manages the personnel ledger as Xeth'Raal manages the soul ledger)


### Riri'Ahlia the Taskmaster, COO (Hierarchy Edition)

**ID:** `s2_hierarchy_coo_ririahlia_reprint` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** mythic · **Type:** unit

> *Six arms. Seventeen dimensions. One performance review per quarter, attended in all of them simultaneously.*

**Scene:** Wider mid-shot. Riri'Ahlia in her COO regalia — a six-armed Quarchon-aligned demoness in segmented Hierarchy-charcoal armor over a deep-violet under-robe, standing at the centre of a Hierarchy operations command-floor. Each of her six hands holds a different operational instrument: a Blood Weave glyph-stylus (scribing an order in midair), a thin signet-stamp (mid-impress on a contract), a brass-and-bone field telegraph (relaying), a curved short-blade (sheathed at her hip but hand-on-hilt), a tablet of glowing red-bound assignments, and a small porcelain teacup (held with absolute steadiness — she is multitasking, not stressed). Her face is mid-thirties Quarchon, calm, eyes a steady amber, hair a coiled black knot. Around her: floor-to-ceiling translucent screens showing seventeen different dimension-feeds, demonspawn legions in formation, supply chains, performance metrics ticking up.

**Mood:** *operational competence as terror* · *calm tea while empires march* · *the COO who never blinks* · *Riri reprint reading the seventeen-dimension feed*

**Palette:** Hierarchy charcoal armor + deep-violet under-robe + warm amber eye-glow + Blood Weave deep-red glyph-light + porcelain teacup white-and-blue + screens cool-cyan-and-blood-red

**Composition:** Wider mid-shot front three-quarter, Riri at frame-centre, six arms fanned outward in symmetrical mid-action pose, dimension-screens filling upper-half of frame

**Notes:** Mythic — alt-art reprint of s1_char_061 Riri'Ahlia. Must echo without duplicating: the s1 base art is the 'Six-Armed Assault' battle pose; this Hierarchy edition is the COO posture — domestic, controlled, indoors. Existing s1_char_061 flavor: 'Commands Blood Weave's armies across 17 dimensions simultaneously with six tireless arms' — this reprint visualizes the management side of that same fact. Six arms must read as functional, not exotic.

**Lore citations:**
- apps/shared/tcg-core/cards/definitions/new_babylon/s1_char_061_vexahlia_the_taskmaster.ts
- docs/built/LORE_BIBLE.md §Riri'Ahlia / Six-Armed Assault
- apps/client/src/pages/DemonPackPage.tsx:Hierarchy COO mention


### Skarn-Iterate, CTO & Architect of Forced Updates

**ID:** `s2_hierarchy_cto_skarn_iterate` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** mythic · **Type:** unit

> *Every soul ships with bugs. Skarn-Iterate ships the patches — without consent, without changelogs, without a rollback path.*

**Scene:** Mid-shot front-on. Skarn-Iterate is a tall thin figure whose body is half flesh, half corrupted-code — the right side a normal Quarchon engineer's frame in a Hierarchy steel-grey jumpsuit, the left side resolved into cascading red-and-black hex characters that drip downward like wet paint and re-form mid-fall. The face is split clean down the centre: right side is a calm goggled engineer's face, left side is a softly-glowing terminal display showing an active progress bar at 73%. Both hands are gloved in iridescent dataflow — the right gripping a pneumatic patch-driver tool, the left held flat with a small holographic update-prompt floating above it that reads (in legible Hierarchy script) 'INSTALL NOW — CANNOT POSTPONE'. Behind: rack on rack of black-iron server cabinets stretching into a tunnel of warning-amber LEDs.

**Mood:** *the patch you did not consent to* · *half-engineer half-cascade* · *73% — and it never finishes* · *the cathedral of forced updates*

**Palette:** Hierarchy steel-grey jumpsuit + cascading red-and-black hex + warning-amber server LEDs + cool-cyan terminal-face glow + iridescent dataflow gloves

**Composition:** Mid-shot front-on, Skarn at frame-centre with the body-split running vertically through the composition, server-tunnel receding behind

**Notes:** Mythic. Echoes the Cathedral-of-Code framing from the Varkul VP entry but inverts it — Varkul GUARDS the Cathedral; Skarn IS the deployment pipeline that fills it with new corruption. The progress-bar must read 73% (not 100% — the joke is it never completes).

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Pairs with Varkul (VP, Cathedral of Code guardian) to give the technology stack a clear two-tier hierarchy: Skarn ships the corruption, Varkul defends what Skarn has shipped.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Varkul / Cathedral of Code (technology-stack framing)
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Vex'Drelm, CMO & Brand Acquirer

**ID:** `s2_hierarchy_cmo_vex_drelm` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** mythic · **Type:** unit

> *She does not advertise the Hierarchy. She advertises *to* the Hierarchy — and the Hierarchy is everywhere there is language.*

**Scene:** Mid-shot. Vex'Drelm stands at the centre of a Hierarchy boardroom-stage flanked by translucent floating banner-glyphs (the brand assets of a thousand corrupted languages, each banner a different captured tongue). She is six-foot-four, lean, with a face that reads as glamour-magazine-perfect at first glance and deeply wrong on second — too symmetrical, eyes one dilation-step too wide. Wears a Hierarchy ivory-and-rose suit cut to a sharp asymmetric silhouette, a single rose-gold pin at the lapel shaped like the Hierarchy crest. In her right hand: a slender obsidian conductor's baton; she's mid-gesture, drawing one of the floating glyph-banners toward her audience like a curtain-pull. In her left: a small velvet-bound contract-of-acquisition. Behind her: a wall-projection of dialect-fragments shimmering as they're absorbed into the Hierarchy brand-mark.

**Mood:** *brand acquisition as soft-power empire* · *too-perfect glamour reads as wrong* · *language is inventory* · *the smile that closes the deal*

**Palette:** Hierarchy ivory + rose-gold accent + velvet-rose contract red + warm boardroom uplight + cool-violet absorbed-language banner-glow

**Composition:** Mid-shot three-quarter, Vex'Drelm at frame-centre mid-gesture, floating glyph-banners forming a fan around her

**Notes:** Mythic. Vex'Drelm is the Hierarchy's softest weapon — the face that signs the contract before the Unmaking begins. Glamour-wrongness must be subtle: this is sales, not horror. The captured-language banners must read as alien but legible-shaped; do NOT use real-world scripts.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. The Shadow Tongue (LORE_BIBLE) corrupts languages from below — Vex'Drelm corrupts them from above, by acquiring them as brand assets. Soft-power complement to the existing language-corruption canon.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Shadow Tongue (language-corruption framing)
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Xeth'Raal, Debt Collector & CFO

**ID:** `s2_hierarchy_cfo_xeth_raal` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** mythic · **Type:** unit

> *Every soul has an interest rate. Xeth'Raal sets them quarterly. The Ledger of Ruin is updated automatically; he simply audits it.*

**Scene:** Mid-shot three-quarter portrait. Xeth'Raal is a tall lean figure in an immaculately tailored Hierarchy charcoal-grey suit with a rust-red tie, seated behind a vast black-glass desk that floats over an ankle-deep sea of ledger pages. His head is goat-skulled — bare bone with curling iron-bound horns — but his hands are fastidious, manicured, tipped in clear lacquer. In his left hand: an obsidian fountain pen poised over the open Ledger of Ruin (a book whose pages are translucent membranes scrolling with the names of debtor-souls in living red ink). His right hand rests palm-down on a small brass abacus whose beads are tiny screaming faces frozen mid-cry. The desk lamp throws him in warm amber from below. Behind him: an impossible filing cabinet stretching upward into vanishing point.

**Mood:** *soul-accountancy as ritual* · *manicured hands, skull face — the calm professional* · *ink that knows your name* · *actuarial dread*

**Palette:** Charcoal-grey corporate suit + rust-red accent tie + black-glass desk + warm amber under-lamp + living red ledger-ink + brass abacus with screaming-face beads

**Composition:** Mid-shot three-quarter, Xeth'Raal at frame-centre seated, infinite filing cabinet receding behind, ledger-page sea filling lower-fifth of frame

**Notes:** Mythic. The framing is bureaucratic horror — Xeth'Raal is calm and detail-oriented; the menace is in the ledger, not his posture. The abacus-beads motif is the Hierarchy CFO signature. The Ledger of Ruin must be readable but the surnames must be NEW (don't echo any canon character) so this card doesn't accidentally confirm a debt-status reveal.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Xeth'Raal the Debt Collector
- docs/built/LORE_BIBLE.md §Ledger of Ruin


---

## Hierarchy of the Damned — VPs (Legendary, 7)

*7 cards in this section.*

### Drask Vornal, VP of Code Corruption Engineering

**ID:** `s2_hierarchy_vp_engineering_drask` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** legendary · **Type:** unit

> *Drask does not write malware. Drask refactors the legitimate codebase one careful PR at a time, until the legitimate codebase IS the malware.*

**Scene:** Mid-shot front-on. Drask Vornal is a rumpled mid-thirties Quarchon engineer in a Hierarchy charcoal hoodie zipped halfway over a black t-shirt with a small Hierarchy crest, sleeves pushed up to reveal forearms tattooed with shifting code-glyphs that slowly migrate across his skin. He sits at a four-monitor command rig in a dim Hierarchy R&D lab, only the monitor-glow lighting his face — half-cyan, half-bloody-red. Each of the four monitors shows a different stage of a corruption pipeline: a clean source file (top-left), a code-review interface with a Hierarchy reviewer's avatar (top-right), a CI build going green (bottom-left), and a subtly-corrupted production deployment (bottom-right). Drask's face is intent, faintly amused — a craftsman in flow-state. His right hand rests on a custom mechanical keyboard whose keys are bone-white with red-glowing legends.

**Mood:** *the corruption inside the legitimate PR* · *monitor-glow craftsman* · *code that reviews itself approving its own corruption* · *the engineer who LOVES this work*

**Palette:** Hierarchy charcoal hoodie + bone-white keyboard with red legends + monitor-cyan/blood-red dual lighting + shifting forearm code-tattoos + dim Hierarchy R&D lab background

**Composition:** Mid-shot front-on, Drask at frame-centre seated, four monitors arranged around him, dim lab receding into shadow

**Notes:** Legendary unit. Drask reports to Skarn-Iterate (CTO) — the visual feel here is hands-on engineering hours, not the executive level. The four-monitor corruption-pipeline is the canonical VP-Engineering visual; do NOT show specific code (illegible glyphs only) so this card doesn't spoiler any Act 3+ technology reveals.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Drask is the IC-archetype counterpart to Skarn-Iterate's executive layer — the Hierarchy's technology stack needs both the executive (Skarn) and the senior IC (Drask) to feel real.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Cathedral of Code
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Kelv'Orth, VP of Soul Acquisitions

**ID:** `s2_hierarchy_vp_sales_kelv_orth` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** legendary · **Type:** unit

> *Quotas are descending. Discounts are unauthorized. The pipeline is — Kelv'Orth pauses, smiles — qualified.*

**Scene:** Mid-shot. Kelv'Orth is broad, charismatic, mid-forties, in a Hierarchy steel-blue blazer-and-slacks combo with the top button of his shirt deliberately open and a small Hierarchy crest cufflink. Quarchon-aligned features but warmer than Riri's — he is built for handshakes. He is mid-pitch in a glass-walled Hierarchy sales boardroom, leaning toward a wall-projection of a Pipeline of Souls (a flowing horizontal river of small floating soul-glyphs, each tagged with a tiny dossier; the river segments into stages: PROSPECT → QUALIFIED → CLOSED → COLLECTED). His right hand is mid-sweep across the projection, drawing attention to a glyph just crossing the CLOSED threshold. His left hand holds a thin Hierarchy stylus tipped with a single drop of contract-blood. Above the boardroom door: a mid-sized leaderboard with three Hierarchy-themed sales-tournament names, blurred deliberately.

**Mood:** *the closing handshake* · *pipeline of souls visualized as Q3 forecast* · *warm charisma at the abyss* · *qualified leads, qualified screams*

**Palette:** Hierarchy steel-blue blazer + warm boardroom lighting + soul-glyph cool-cyan + contract-blood deep-red + leaderboard blurred-amber

**Composition:** Mid-shot three-quarter, Kelv'Orth at frame-left mid-pitch, Pipeline-of-Souls projection occupying right two-thirds of frame

**Notes:** Legendary unit. Sales charisma must read as competent, not slick — Kelv'Orth is the Hierarchy's most respected closer, not a caricature. Pipeline-of-Souls is the canonical sales-VP signature. Deliberately blur the leaderboard to avoid implying named characters have been collected.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Pairs with Vex'Drelm (CMO mythic) on the revenue side — Vex'Drelm acquires the brand, Kelv'Orth closes the contract.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as sacred law


### Kragvex, VP of Operational Risk

**ID:** `s2_hierarchy_vp_ops_risk_kragvex` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** legendary · **Type:** unit

> *Other VPs prepare for the worst. Kragvex prepares for slightly-worse-than-the-worst, then negotiates the budget for a contingency on top of that, then bills the contingency to a different cost centre.*

**Scene:** Mid-shot. Kragvex is heavy-set, broad, mid-fifties, in a rumpled Hierarchy charcoal three-piece suit (the waistcoat strained slightly at the buttons), bald, with a single small Hierarchy crest pin. He sits behind a wide steel-grey Hierarchy risk-register desk piled high with bound binders labeled in spine-text: 'Q3 BREACH SCENARIOS', 'INSURGENT OPERATIONS — ACTIVE', 'CONTINGENCY ALPHA-TWELVE', etc. (tilt the binders enough that the readable spines are LEGIBLE-BUT-GENERIC; do NOT name specific Acts/operations). He is mid-action, lifting a heavy red wax-seal stamp toward a single open binder; on the visible page, a contingency authorization line is awaiting his sign-off. His left hand holds a half-eaten Hierarchy-cafeteria pastry. The desk lamp throws him in warm amber, while a wall-mounted threat-feed in the background pulses faint red.

**Mood:** *the prepared pessimist* · *binders as armor* · *pastry-while-stamping* · *every disaster pre-budgeted*

**Palette:** Hierarchy charcoal three-piece + warm amber desk-lamp + steel-grey desk + bound-binder forest-green + red wax-seal stamp + faint red threat-feed background

**Composition:** Mid-shot three-quarter, Kragvex at frame-centre seated, binder stacks framing him left and right, threat-feed in soft-focus background

**Notes:** Legendary unit. Kragvex's bulk and rumpled suit are intentional — the Hierarchy's risk function should feel lived-in and competent, not ascetic. Binder spine-text MUST be legible-but-generic so this card doesn't preview specific Insurgency operations covered in Act 3+ canon.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Pairs with Iglarath (CISO mythic) — Iglarath audits the breaches, Kragvex pre-budgets for them.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Insurgency vs Hierarchy operational framing


### Nessith the Reconciler, VP of Internal Audit

**ID:** `s2_hierarchy_vp_audit_nessith` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** legendary · **Type:** unit

> *Two facts contradict. Nessith's job is not to determine which is true. Nessith's job is to file the variance, recommend a control, and close the period.*

**Scene:** Mid-shot. Nessith is slight, calm, of indeterminate age, with the kind of face that does not register on first introduction — Quarchon-aligned but plainer than the C-Suite. She wears a Hierarchy plain charcoal blouse-and-skirt with no jewelry, no Hierarchy crest visible, only a lanyard with a small audit-clearance badge. She sits at a small standing-desk in a deliberately-bland Hierarchy audit-floor cubicle, a single open laptop in front of her displaying a reconciliation grid (two columns of figures with a difference column between them). On her desk: a single mug of plain tea, a small green pot-plant, a stack of three folders neatly aligned. The cubicle wall behind her holds a single small framed Hierarchy values-statement and one print of an asphodel field. The cubicle's overhead fluorescent throws everything in flat institutional light.

**Mood:** *the audit closes the period* · *the face you forget twice* · *two facts, one variance, one control* · *deliberate flat institutional light*

**Palette:** Hierarchy plain charcoal blouse + flat institutional fluorescent + cool-grey cubicle walls + mug-of-plain-tea + asphodel-field print pale-grey + lanyard a single accent thread of Hierarchy plum

**Composition:** Mid-shot front-on, Nessith at frame-centre seated, cubicle walls framing her tightly, no environmental depth

**Notes:** Legendary unit. The deliberate plainness is the Nessith signature — the framing is 'audit is the most powerful function in the Hierarchy because nobody notices it'. NO Hierarchy crest visible, NO power posture — every other VP's image is an image OF power; Nessith's is the absence of one. Asphodel print echoes Mor'Vethic's asphodel plant (intentional — both work in liminal-administrative roles).

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. The Hierarchy's bureaucratic-horror framing requires a function that performs reconciliation rather than fights — Nessith fills that role and pairs with Mor'Vethic's HR liminality.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Xeth'Raal Ledger-of-Ruin (audit-of-audit framing)


### The Shadow Tongue, SVP of Communications & Propaganda

**ID:** `s2_hierarchy_vp_comms_shadow_tongue` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** legendary · **Type:** spell

> *It started as a memo. Then it became the shape of a memo. Then it became the shape of every memo that would ever be written. By the time anyone noticed, the Severance was already filed.*

**Scene:** Wide environmental composition. The Shadow Tongue is not a humanoid — it is a CONCEPT given visual form. Centre of frame: a slow black liquid-shadow uncoiling out of an open ceremonial leather-bound Hierarchy memo-folder resting on a polished mahogany executive desk. The shadow rises in a sinuous serpentine column about two metres tall, coalescing into a mouth-shape at its top — a wide lipless smile of pure black void in which thousands of tiny mouths whisper simultaneously, each whispering a different language fragment that distorts the air around it (visualize as faint heat-shimmer). The shadow's lower body is still pouring out of the memo, suggesting it has no fixed volume. Behind: a Hierarchy executive office at dawn, floor-to-ceiling windows showing a thousand identical Hierarchy memos drifting in the air outside the building, each one carrying a corrupting fragment to a different reader.

**Mood:** *language as infestation* · *the memo that writes you* · *smile of a thousand mouths* · *Severance filed at dawn*

**Palette:** Hierarchy plum-and-charcoal office + warm dawn through floor-to-ceiling windows + pure void-black shadow column + faint heat-shimmer language-distortion + drifting paper-pale memos outside

**Composition:** Wide environmental, shadow column at frame-centre rising from desk-foreground, executive office and dawn windows filling background, drifting memos outside

**Notes:** Legendary spell card. Critical: the Shadow Tongue must NOT be anthropomorphized — the LORE_BIBLE framing is 'concept given malevolent will, evolved beyond its creator (the Collector)'. The thousand-mouths smile is the canon visual signature. The drifting-memos backdrop shows scale of operation without spoiling Severance specifics.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Shadow Tongue
- docs/built/LORE_BIBLE.md §Severance
- docs/built/LORE_BIBLE.md §The Collector (creator-of-Shadow-Tongue framing)


### Thelv'Oss, VP of Long-Range Strategy

**ID:** `s2_hierarchy_vp_strategy_thelv_oss` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** legendary · **Type:** unit

> *Five-year plans are for amateurs. Thelv'Oss thinks in five-Epoch increments. The current Epoch is, by her reckoning, on schedule.*

**Scene:** Wide three-quarter portrait. Thelv'Oss is sharp-featured, ageless, Quarchon-aligned, with hair the colour of cooled iron pulled into a single tight braid that falls past her waist. She wears a Hierarchy slate-grey high-collar long coat over a dark under-suit, and a single chain at her neck holds a small obsidian pendant carved with a multi-Epoch timeline glyph. She stands at a Hierarchy strategy-room war-table that is not a table but a hovering scaled holographic model of seventeen dimensions, each rendered as a slowly-rotating translucent sphere arranged in a nested orbital configuration. Her right hand is extended over the model, palm-down, fingers slightly curled, the gesture of a chess player about to move a piece she has been studying for hours. The hologram throws her face in cool-cyan light from below.

**Mood:** *thinking in Epoch increments* · *the chess player who has already moved* · *ironcooled patience* · *seventeen dimensions as game pieces*

**Palette:** Hierarchy slate-grey long coat + iron-cooled hair + dark under-suit + obsidian pendant + cool-cyan hologram-uplight + dimensional spheres translucent rainbow-iridescence

**Composition:** Wide three-quarter, Thelv'Oss at frame-right standing, hovering hologram-model occupying frame-centre and -left, war-room arc in soft focus behind

**Notes:** Legendary unit. Thelv'Oss's calm must read as deeper than Mor'Vethic's — the canon framing is patience-as-weapon. The seventeen-dimension model parallels Riri'Ahlia's seventeen-dimension command but at the planning layer, not the operational layer (intentional design echo).

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. The Hierarchy is canonically a long-game organization (LORE_BIBLE: Mol'Garath's Contracts are eternal); a Strategy VP grounds that in a memorable visual.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as eternal


### Varkul the Blood Lord, VP of Information Security

**ID:** `s2_hierarchy_vp_security_varkul` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** legendary · **Type:** unit

> *The Cathedral of Code has one keeper. Varkul does not patrol it; he *is* the perimeter. Every breach is paid in blood — sometimes the attacker's, sometimes the defender's, sometimes both.*

**Scene:** Mid-shot front three-quarter. Varkul stands at the threshold of the Cathedral of Code — a vast nave whose walls and pillars are columns of slowly-flowing dark-red corrupted-code that twists and recompiles in real time. He is a tall, lean vampiric entity in a Hierarchy crimson-and-black robed-armor — half priestly cassock, half tactical chest-rig, the cassock's hem trailing into wisps of red mist. His face is gaunt, pale-as-marble, with two thin canines just visible at the resting mouth, and a single small dark-red rune burning faintly on his forehead. In one hand he carries a long obsidian-bladed pike whose haft is wrapped in barbed-wire-thin code-strands; in the other a small censer that swings on a chain, releasing not smoke but coagulating drops of dark-red lifeforce into the air. Behind him: the Cathedral nave recedes into glowing-red infinity. A faint blue forcefield-shimmer wraps his torso (forcefield).

**Mood:** *the Cathedral keeper* · *blood is policy* · *calm faith of a corrupted priest* · *every breach paid in blood*

**Palette:** Hierarchy crimson + black armor + marble-pale skin + dark-red corrupted-code columns + faint forehead rune-glow + cool-blue forcefield-shimmer + censer's coagulating lifeforce-drops

**Composition:** Mid-shot front three-quarter, Varkul at frame-centre at the Cathedral threshold, nave receding behind into vanishing point

**Notes:** Legendary. Vampiric framing must read as priestly more than predatory — the canon Varkul is a guardian, not a hunter. The Cathedral of Code's dark-red columns are the Hierarchy's iconic environment — re-use this backdrop for any technology-stack card. Pairs visually with Skarn-Iterate (CTO mythic) — Skarn ships the corruption Varkul defends.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Varkul the Blood Lord
- docs/built/LORE_BIBLE.md §Cathedral of Code


---

## Hierarchy of the Damned — Directors (Epic, 14)

*14 cards in this section.*

### Fenra the Moon Tyrant, Director of Operations (Hierarchy Edition)

**ID:** `s2_hierarchy_dir_ops_fenra_reprint` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *She organized the invasion of seventeen dimensions in a single quarter. Riri's commendation came back stamped CONFIRMED, NEXT QUARTER STRETCH GOAL +30%.*

**Scene:** Mid-shot. Fenra in her Director-of-Operations attire — a Hierarchy steel-grey ops uniform with crimson piping over a high-collar black under-tunic, sleeves rolled to forearm. She is mid-thirties, sharp-featured, with grey eyes and short black hair pinned in a tight crop; partial werewolf-aspect rendered as faint canine silhouette overlay around her jaw and the visible tip of one elongated incisor at the resting mouth. She stands at a Hierarchy operations command-pit, leaning over a tactical sand-table that displays three of the seventeen dimensions as scaled topographical surfaces. Her right hand grips a Hierarchy field-marshal's baton tipped with a small obsidian wolf-head. Her left hand rests on the rim of the table mid-gesture. Around the pit: silent ops-staff in lower-rank Hierarchy uniforms working stations. Faint silver moon-glow rims her shoulders.

**Mood:** *the moon tyrant indoors* · *operations as ritual procession* · *stretch goal +30% quarterly* · *wolf-aspect reading as managerial bearing*

**Palette:** Hierarchy steel-grey ops uniform + crimson piping + black under-tunic + tactical sand-table cool-cyan topographical-glow + warm command-pit overhead lighting + faint silver moon-rim

**Composition:** Mid-shot three-quarter, Fenra at frame-centre leaning over the sand-table, dimensional topographical surfaces visible at lower-third, ops-staff in soft-focus background

**Notes:** Epic — alt-art reprint of s1_char_066 Fenra the Moon Tyrant. The s1 base art is full-werewolf battle pose; this Director edition shows the management side — werewolf aspect dialed back to a faint silhouette and one incisor only. The Hierarchy field-marshal baton is the Director-of-Operations signature for this card.

**Lore citations:**
- apps/shared/tcg-core/cards/definitions/new_babylon/s1_char_066_fenra_the_moon_tyrant.ts
- docs/built/LORE_BIBLE.md §Fenra the Moon Tyrant
- docs/built/LORE_BIBLE.md §Riri'Ahlia / commendation framing


### The Bottom-Line Decimator, Director of Cost Containment

**ID:** `s2_hierarchy_dir_bottom_line_decimator` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *He cuts costs. He cuts headcount. He cuts the function that asks why he keeps cutting. Last quarter, he cut his own assistant — and the quarter still came in under budget, so the action was approved retroactively.*

**Scene:** Mid-shot. A heavyset Quarchon executive in a Hierarchy iron-grey three-piece suit, the waistcoat tightly buttoned, a Hierarchy crest at the lapel. He carries a pair of Hierarchy ceremonial silver shears the size of a forearm, held carefully in front of his body in a both-hands grip. His face is jowled, calm, mid-fifties, with the contented expression of someone who has already balanced this week's books. He stands in a Hierarchy department-floor that has been visibly half-emptied — half the cubicles are still populated, half are stripped to bare desk, the difference is sharp and recent. The remaining cubicle workers do not look up. The fluorescents above the empty half are switched off; above the populated half, on.

**Mood:** *the contented decimator* · *ceremonial shears at the office* · *half-lit floor, half-dark floor* · *the heads that did not look up*

**Palette:** Hierarchy iron-grey three-piece + Hierarchy crest plum-and-silver + ceremonial silver shears + cool fluorescent populated-side + dim absent-side + warm crest-pin highlight

**Composition:** Mid-shot three-quarter, Decimator at frame-centre standing, half-emptied office stretching behind, lighting bisects the frame left-dark / right-lit

**Notes:** Epic. The contentment is intentional — the LORE_BIBLE framing of corporate hell is procedural, never gleeful. The lighting bisection is the Decimator's canonical visual signature: lit + unlit halves visualize the cuts.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Pairs with Mor'Vethic CHRO at the operational level — Mor'Vethic terminates individuals; the Decimator terminates teams.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Xeth'Raal Ledger-of-Ruin (cost-containment framing)


### The Compliance Inquisitor, Director of Mandatory Training

**ID:** `s2_hierarchy_dir_compliance_inquisitor` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *Failure to complete the training will result in further training. Repeated failure will result in extended training. Persistent failure is, at this point, a form of training in itself.*

**Scene:** Wide three-quarter portrait. The Compliance Inquisitor is broad, tall, austere — a Hierarchy mid-fifties Quarchon in a high-collar pure-white compliance officer's robe over a charcoal under-suit, with a small silver Hierarchy crest pendant at the throat (the only pinned ornament). She carries a slim leather Hierarchy training binder open across one forearm. She stands at the front of a Hierarchy training auditorium — three rows of lecture-hall seats stretching back into vanishing-point depth, every seat occupied by a Hierarchy worker in muted workplace dress, every face turned forward, every face neutral. A massive projection screen behind her displays the slide title 'MODULE 47: WORKPLACE PROCEDURE & ETERNAL LIABILITY' in Hierarchy script. Her right hand holds a slim presentation pointer mid-gesture toward an animated training-graphic on the slide.

**Mood:** *Module 47 of an unending series* · *every face neutral, every face forward* · *compliance as inquisition* · *the silver crest at the throat, no other ornament*

**Palette:** Hierarchy pure-white compliance robe + charcoal under-suit + silver crest pendant + cool-cyan auditorium overhead + warm slide-projection white + audience muted-workplace-charcoal

**Composition:** Wide three-quarter, Inquisitor at frame-left in foreground, audience of seats receding to vanishing point at frame-right, projection screen visible behind her on the auditorium back wall

**Notes:** Epic. The all-white compliance robe is the canon Inquisitor signature — every other Hierarchy senior wears at least one Hierarchy plum/charcoal/crimson accent; the Inquisitor's white is a deliberate visual outlier. Module number 47 is the canonical Hierarchy training-series in-joke; do not change.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Mandatory-training directors are the Hierarchy's mechanism for endless ritualized friction — the LORE_BIBLE Severance was filed via memo (Shadow Tongue), but enforced via training (this director).

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Severance / enforcement framing


### The Cross-Functional Predator, Director of Stakeholder Alignment

**ID:** `s2_hierarchy_dir_cross_functional_predator` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *He has been seconded to your team. He has been seconded to every team. He attends every stand-up. By Q3, his calendar is the only one that survives.*

**Scene:** Mid-shot. A wiry Quarchon executive in a Hierarchy quick-cut navy blazer over a thin black turtleneck, a Hierarchy crest pin at the lapel, a slim rolled-leather portfolio under his left arm. He stands at the convergence of three frosted-glass corridor segments in the Hierarchy mid-floor, each corridor leading to a different team's bullpen. Three holographic calendar-tiles float at chest height — one above each corridor — and each calendar shows the same name 'V. KORAL' booked into every meeting slot. His right hand is mid-gesture, one finger lifted as if interrupting whoever is speaking off-frame. His face is sharp, pleasant, carries the practiced charm of someone who closes with phrases like 'just one quick thing'.

**Mood:** *the stakeholder who eats every quarter* · *calendar-tiles populated wall-to-wall* · *just one quick thing* · *polite predator with a portfolio*

**Palette:** Hierarchy navy blazer + black turtleneck + Hierarchy crest plum-silver + frosted-glass corridors cool-cyan + holographic calendar-tile pale-blue + warm corridor-junction overhead

**Composition:** Mid-shot three-quarter, Predator at frame-centre at the corridor junction, three corridors radiating outward and three calendar-tiles floating above each

**Notes:** Epic. The 'V. KORAL' name on the calendar-tiles is intentional canon for this card; do not change. The predator framing is etiquette-at-knife-edge — pleasant, never overtly menacing.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Cross-functional alignment is the Hierarchy's most-abused middle-management lever; a Director-tier visualization grounds it as a role with character, not just a meeting type.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### The JIRA Ghoul, Director of Backlog Hygiene

**ID:** `s2_hierarchy_dir_jira_ghoul` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *Every ticket has a story. Every story has a parent. Every parent has an epic. The epic was opened in Q1 of the year you were hired. It is, the Ghoul informs you, still in PROGRESS.*

**Scene:** Mid-shot. A gaunt mid-fifties Quarchon figure in a stained Hierarchy charcoal cardigan over a faded black t-shirt, sleeves pushed up, fingernails slightly too long. He sits at a cramped Hierarchy backlog-hygiene workstation surrounded by stacked monitors — front centre monitor shows a vast scrolling backlog grid, side monitors show ticket-relationship trees that branch into fractal tangles. His face is grey-toned, the cheekbones sharp, eyes lit only by the monitors' cool-cyan. His right hand is mid-keyboard-shortcut, his left holds a half-eaten energy bar at a forgotten angle. Behind him: an old Hierarchy mug on a cluttered desk-edge, a dusty plastic plant, and a small framed Hierarchy values-statement at a slight tilt.

**Mood:** *the ghoul who never closes a ticket* · *fractal-tangle relationship trees* · *energy bar held at forgotten angle* · *the epic opened in Q1 of the year you were hired*

**Palette:** Hierarchy stained charcoal cardigan + faded black t-shirt + cool-cyan monitor light + grey-toned skin + warm-amber over-mug accent + dust-tinged plastic plant

**Composition:** Mid-shot front-on, JIRA Ghoul at frame-centre seated, monitors arrayed in a tight semi-circle around him, cluttered desk-edge in foreground

**Notes:** Epic. The deliberate lived-in grime is the JIRA Ghoul signature — every other Hierarchy director keeps a tidy desk; this one does not. The fractal-tangle relationship trees must read as overwhelming, not decorative.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Reports to Velocity Wraith (sprint-cadence director); the Ghoul keeps the backlog the Wraith ships from. Pairs as the 'before' and 'during' of Hierarchy delivery.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_velocity_wraith — operational pairing


### The Metrics Oracle, Director of Performance Analytics

**ID:** `s2_hierarchy_dir_metrics_oracle` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *Three KPIs governed her quarter. Two she cannot disclose. The third, she will optimize — and the consequence of that optimization, you will recognize from your own annual review.*

**Scene:** Mid-shot. A figure in Hierarchy office-plain charcoal, hooded by a hood that conceals the upper face entirely; only the chin is visible — calm, mouth a flat line. She sits cross-legged atop a low pedestal at the centre of a Hierarchy dashboard-room — every wall is a curved surface displaying live KPI graphs in cool-cyan and warning-amber, the graphs constantly redrawing as the Hierarchy's metrics shift. Three of the graphs are framed in rusted-bronze frames (the special three KPIs); the rest in plain steel. Her hands are extended palm-up, holding nothing, but small holographic numerical readouts hover an inch above each palm. The room's lighting is pure dashboard-glow — no other source.

**Mood:** *the unseen face under the hood* · *three KPIs you cannot read* · *dashboard-room as oracle's chamber* · *calm of the optimizing function*

**Palette:** Hierarchy office-charcoal + hood concealing upper face + cool-cyan and warning-amber dashboard wall + rusted-bronze frame around the three special KPI displays + pure dashboard-glow ambient

**Composition:** Mid-shot front-on, Metrics Oracle at frame-centre cross-legged on pedestal, curved dashboard walls forming a 270-degree arc behind her

**Notes:** Epic. The hooded face is intentional — the LORE_BIBLE framing for analytics-roles is faceless function. The three rusted-bronze-framed KPIs are the canon Metrics Oracle signature; specific values must be illegible (faint blur) so this card doesn't accidentally encode any plot-significant Hierarchy metric.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Pairs with Iglarath CISO (six eyes, six feeds): both functions read the Hierarchy's data, but the Metrics Oracle reads what is being measured, not what is being breached.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### The OKR Specter, Director of Goal Cascades

**ID:** `s2_hierarchy_dir_okr_specter` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *Every objective has key results. Every key result has sub-objectives. Every sub-objective has its own key results. The cascade is recursive. It is also the Hierarchy's primary export.*

**Scene:** Mid-shot. A translucent ghostly Quarchon figure in a Hierarchy rust-violet floor-length suit, see-through enough that the room behind shows through the body's silhouette, but the suit and the open Hierarchy goals-binder he carries in both hands are fully solid. His face is gaunt, formal, calm; eyes are two small empty sockets glowing dim cool-cyan. He stands at the centre of a Hierarchy goal-cascade architecture: a vertical fractal display floating in midair around him — at the top, three large primary OBJECTIVES; from each, branching down, three KEY RESULTS; from each KR, three sub-OBJECTIVES; the recursion continues for at least four observable levels before fading into mist. He is mid-gesture, his left hand turning a page of the binder; his right hand resting palm-up at chest height as if holding the entire fractal in place.

**Mood:** *the recursive cascade* · *ghost-suit holding the fractal* · *objectives all the way down* · *translucent body, solid binder*

**Palette:** Hierarchy rust-violet suit + translucent-ghostly body silhouette + cool-cyan eye-glow + cool-grey goals-binder + fractal-cascade light pale-cyan + dim mist receding background

**Composition:** Mid-shot front-on, OKR Specter at frame-centre, fractal cascade extending upward from above his shoulders to the top edge of frame, mist behind

**Notes:** Epic. The translucent body / solid binder contrast is the canon OKR Specter signature — the Hierarchy's framework persists when its operators do not. The fractal must read as recursive (level → level → level) rather than as separate floating shapes.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Goal-cascade frameworks are the Hierarchy's exported management technology; a ghostly archetype reflects the canon framing that frameworks outlive their creators.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as eternal (frameworks-outlive-creators framing)


### The Pivot Demon, Director of Strategic Realignment

**ID:** `s2_hierarchy_dir_pivot_demon` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** spell

> *Last quarter's strategy is no longer aligned with this quarter's strategy. Next quarter's strategy will not be aligned with this one. The continuity is not the strategy. The continuity is the realignment.*

**Scene:** Wide environmental. A Hierarchy strategy-room mid-realignment. The room's central wall holds three large strategic-plan documents projected at scale — labeled 'Q1 STRATEGIC PRIORITIES', 'Q2 STRATEGIC PRIORITIES', 'Q3 STRATEGIC PRIORITIES' — and each document is a visibly different organizational map (different boxes, different connecting lines, different north-star arrow). Mid-frame: the Pivot Demon, a slim Quarchon figure in a Hierarchy chrome-edged consultant's suit (silver pinstripes), arms wide, palms forward, with eight to ten ghostly translucent extra arms fanning out behind the visible two — each ghostly arm is mid-motion sweeping a different organizational box from one chart to another. The figure's face is mid-thirties, smooth-shaven, calm. Around the room: Hierarchy strategy-staff watching the realignment-in-progress with the resigned posture of people who have done this every quarter.

**Mood:** *the demon of constant pivot* · *translucent extra arms moving boxes* · *three quarters of three different strategies* · *staff resigned posture*

**Palette:** Hierarchy chrome-edged silver pinstripe suit + cool-cyan strategy projections + warm strategy-room uplight + ghostly translucent extra-arm pale-violet + staff in muted Hierarchy charcoal

**Composition:** Wide environmental front-on, Pivot Demon at frame-centre, three strategy-projections behind on the central wall, staff arranged at frame-edges

**Notes:** Epic spell card — the Pivot Demon casts realignment, not damage. The eight-to-ten translucent extra arms are the canonical signature; the count must read as 'too many to count cleanly' rather than a specific number. Strategy-projection text must be legible-but-generic (no Act-specific keywords).

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Strategic-realignment-as-constant is the Hierarchy's signature dysfunction; making it a spell card lets the gameplay layer use it for board-state shuffling effects.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Thelv'Oss / long-range strategy framing


### The Q4 Ritualist, Director of Year-End Close

**ID:** `s2_hierarchy_dir_q4_ritualist` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *The fiscal year does not close itself. Three weeks of incantation, two pints of contract-blood, and one mandatory off-site retreat. The numbers are made to balance.*

**Scene:** Wide environmental composition. The Q4 Ritualist is a Hierarchy mid-fifties figure in a deep-purple ceremonial close-the-books robe over a charcoal under-suit, sleeves rolled to the elbow, hands stained with translucent contract-blood up to the wrists. He stands at the centre of a Hierarchy fiscal-close chamber — a hexagonal room whose six walls each bear a different Quarter's ledger imprinted in floor-to-ceiling living red-ink glyph-text. At the chamber's centre: a low stone fiscal-altar, on it a single bound copy of the Year-End Trial Balance. He is mid-incantation, both hands flat on the open ledger, the page glyphs lifting off in a slow upward swirl as the totals reconcile in real time. Six small Hierarchy junior-accountants stand at the six wall positions, each holding a ceremonial closing-quill, all in deep-purple under-robes.

**Mood:** *year-end close as high ritual* · *contract-blood to the wrists* · *six juniors, six walls, one balance* · *the totals reconcile by incantation*

**Palette:** Deep-purple Hierarchy ceremonial robes + charcoal under-suits + translucent contract-blood + living red-ink ledger-glyphs + cool-grey hexagonal stone walls + warm altar-uplight

**Composition:** Wide environmental front-on, Ritualist and altar at frame-centre, six walls and six juniors arranged hexagonally, glyph-swirl rising from ledger

**Notes:** Epic. The framing is bureaucracy-as-occult, not occult-with-business-overlay. Contract-blood is the canon Hierarchy fluid (visible on Mol'Garath's contract too). The six juniors must read as participating in routine procedure, not initiates.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. The Hierarchy is canonically a fiscal-cycle organization (Xeth'Raal CFO sets quarterly debt rates); a Year-End Close director makes the fiscal cycle a visible ritual moment.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Xeth'Raal / quarterly debt-rate framing
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### The RIF Custodian, Director of Reduction-in-Force Operations

**ID:** `s2_hierarchy_dir_rif_custodian` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *She does not deliver the news. She prepares the room before the news is delivered. The water is filled. The tissues are stocked. The exit-badge is queued. By the time you arrive, the conclusion has been waiting longer than you have.*

**Scene:** Mid-shot. A composed mid-forties Quarchon woman in a Hierarchy plum-and-grey blazer over a black blouse, hair pulled into a low knot, no jewelry. She stands at the threshold of a small windowless Hierarchy conversation-room, holding the door half-open with her left hand. The room behind her is impeccably prepared: two chairs facing each other across a small table, on the table a single closed Hierarchy personnel folder, a glass of water, a small box of plain tissues, and a deactivated exit-badge resting face-down. The lighting is gentler than the corridor's — deliberate. Her face is calm-professional, the slight half-smile of someone who has done this so many times the room arranges itself.

**Mood:** *the room arranged before you arrive* · *tissues stocked, water filled* · *the gentle indoor light* · *half-smile of practiced sympathy*

**Palette:** Hierarchy plum-and-grey blazer + black blouse + warm conversation-room interior light + cool corridor light contrast + plain personnel-folder cream + glass-of-water clear + face-down exit-badge accent

**Composition:** Mid-shot three-quarter, Custodian at frame-left at the doorway, conversation-room interior visible at frame-right, table-arrangement reading clearly

**Notes:** Epic. The Custodian is Mor'Vethic CHRO's operational director — Mor'Vethic conducts the conversation, the Custodian prepares the room. The face-down exit-badge is the canon RIF Custodian signature.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Reports to Mor'Vethic CHRO (mythic); the Hierarchy's HR function needs a director-tier operational layer to make Mor'Vethic's role feel like a real organization.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_chro_mor_vethic — operational pairing


### The Synergy Vampire, Director of Cross-Functional Initiatives

**ID:** `s2_hierarchy_dir_synergy_vampire` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *She does not drain souls. She drains *initiative bandwidth*. By the end of the meeting, every team has agreed to do her work for her, and she has gained nothing — except, of course, the meeting.*

**Scene:** Mid-shot. A pale lean Quarchon-aligned figure in a Hierarchy bone-white blazer over a high-collar plum blouse, fanged smile catching warm boardroom uplight. She stands at a glass-walled cross-functional-meeting room, mid-presentation, pointing at a wall projection that reads (legibly) 'Q3 SYNERGY OPPORTUNITIES — CROSS-PILLAR ALIGNMENT' in Hierarchy script. Around the meeting table: six Hierarchy analysts of varying rank, each with a small drained-faint quality (faint translucent threads connect their chests to her outstretched left hand). Her right hand holds a presentation pointer mid-gesture. The boardroom's overhead fluorescents are deliberately too-bright.

**Mood:** *the meeting that drained six other teams' quarters* · *synergy as predation* · *smile of the willing collaborator* · *translucent draining-threads*

**Palette:** Hierarchy bone-white blazer + plum blouse + warm boardroom uplight + cool-cyan projection + faint translucent draining-threads + over-bright overhead fluorescent

**Composition:** Mid-shot three-quarter, Synergy Vampire at frame-left mid-gesture, meeting-table and analysts arrayed at frame-right, projection on far wall

**Notes:** Epic. Fanged smile is the canon Synergy Vampire signature; the draining-threads must read as faint enough to suggest rather than confirm — the LORE_BIBLE framing is bureaucratic vampirism, not literal blood-drinking.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Cross-functional-initiative directors are the Hierarchy's most invasive middle-management archetype; the vampire metaphor is a corporate-satire trope made literal in the Hierarchy framing.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Varkul the Blood Lord (vampiric framing precedent)


### The Townhall Phantom, Director of All-Hands Communications

**ID:** `s2_hierarchy_dir_townhall_phantom` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** spell

> *He moderates the all-hands. He does not speak in the all-hands. The questions in the chat have been pre-screened. The answers will be circulated by email. The recording will not be made available.*

**Scene:** Wide environmental. A Hierarchy all-hands auditorium mid-broadcast — a vast hall with a small raised stage at the far end, on the stage a single tall Hierarchy podium, and standing behind the podium a translucent ghostly figure in a Hierarchy charcoal moderator's suit holding a thin Hierarchy-issued tablet. The figure's translucency is mid-grade — clearly a person, but also clearly not all there. The auditorium's seats stretch back into vanishing-point depth — every seat occupied, every face uniform, every face turned toward the stage. A massive screen behind the podium displays a generic Hierarchy townhall slide titled 'Q3 BUSINESS UPDATE — ALIGNED PATH FORWARD'. Off-stage at the lower-left, a Hierarchy broadcast camera-rig is recording. The camera's recording-light is on. Behind the camera, a sticky-note attached reads 'NOT FOR DISTRIBUTION'.

**Mood:** *the moderator who never speaks* · *questions pre-screened, answers circulated* · *recording-light on, distribution off* · *translucent figure at the podium*

**Palette:** Hierarchy auditorium charcoal-and-cream + warm stage-uplight + cool audience-light + translucent ghostly suit-grey + Q3 update slide cool-cyan + camera-rig sticky-note pale-yellow accent

**Composition:** Wide environmental three-quarter from upper-side, podium and stage at frame-right, audience receding to frame-left and into vanishing point, camera-rig and sticky-note in foreground at lower-left

**Notes:** Epic spell card. Spell because the card's effect is information-control rather than direct combat. The 'NOT FOR DISTRIBUTION' sticky-note is the canon Townhall Phantom signature; the slide title 'ALIGNED PATH FORWARD' is generic enough to not encode any Act-specific reveal.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. The Hierarchy's communications stack needs a director-tier counterpart to Shadow Tongue's executive layer; the Phantom is the ghost in the all-hands microphone.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Shadow Tongue (communications-stack pairing)


### The Velocity Wraith, Director of Sprint Cadence

**ID:** `s2_hierarchy_dir_velocity_wraith` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *The sprint board is full. The retrospective is brief. The team is shipping faster than ever. Nobody can quite remember what they shipped last week. The Velocity Wraith remembers — but the Velocity Wraith is not paid to share.*

**Scene:** Mid-shot. A blurred-edge Hierarchy figure in a Hierarchy charcoal-and-blood-red sprint-track-suit (no formal blazer — this is a director who works the floor). She is moving fast even in still-frame: her outline is sharp at the centre and soft-blurred at hands, feet, hair-tips, suggesting motion. Her face is mid-thirties, focused, with the thousand-yard stare of someone who has not paused since stand-up. She stands at a tall standing-desk in a Hierarchy team-room, in front of a wall-mounted sprint board (a digital kanban projection covered in moving cards — DOING / BLOCKED / DONE). Several DONE cards are mid-flying-off-screen as she swipes them away. Her right hand mid-swipe; her left holds a cup of black coffee held perfectly steady despite the motion-blur on her hair.

**Mood:** *the wraith who works through stand-up* · *motion-blur at the edges, stillness at the centre* · *DONE cards flying offscreen* · *coffee perfectly steady*

**Palette:** Hierarchy charcoal sprint-suit + blood-red piping + cool-cyan sprint-board projection + warm team-room overhead + motion-blur edge softening + black-coffee accent

**Composition:** Mid-shot three-quarter, Velocity Wraith at frame-left mid-swipe, sprint-board projection occupying frame-right two-thirds, DONE cards flying out of frame-right

**Notes:** Epic. Motion-blur effect is essential — this card is about velocity, the visual signature is partial blur. The DONE-cards-flying-off-frame motif suggests work is being completed without trace; sprint-board kanban tile-text must be illegible.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Sprint-cadence directors are the Hierarchy archetype that keeps the org always-shipping-and-never-remembering — a productivity layer that erases its own evidence.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Velm Acrith, Director of Onboarding & Acclimation

**ID:** `s2_hierarchy_dir_onboarding_specialist` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *Welcome to the Hierarchy. Here is your laptop. Here is your badge. Here is your first task — and here is the contract you signed last quarter, in which you agreed to it. Velm pauses, gentle as the doorman she resembles. Any questions?*

**Scene:** Mid-shot. Velm Acrith is small, kindly-featured, mid-fifties, with the bearing of a hospitality concierge. She wears a Hierarchy soft-cream button-down under a dusty-rose cardigan, a small Hierarchy crest pin at the cardigan lapel, and reading glasses on a thin chain at her neck. She stands at the entrance of a Hierarchy onboarding suite, the door open behind her revealing a row of four immaculately-prepared workstations — each with a new Hierarchy laptop sealed in branded packaging, a fresh Hierarchy badge in a small leather wallet, and a single neatly-folded Hierarchy welcome-shirt. In her hands she holds a single fresh badge in its wallet, opened, ready to hand over. She is mid-extension of the badge to an off-frame new hire. The suite's lighting is warmer than the corridor's, deliberately welcoming.

**Mood:** *the kindly doorman of the Hierarchy* · *contract you signed last quarter* · *welcome-shirt folded just so* · *deliberately warm onboarding light*

**Palette:** Hierarchy soft-cream button-down + dusty-rose cardigan + Hierarchy crest plum-silver + warm onboarding-suite uplight + fresh-laptop branded-packaging white + new-badge wallet leather-tan

**Composition:** Mid-shot three-quarter, Velm at frame-left at the suite door, prepared workstations visible in soft focus through the doorway at frame-right, badge mid-extension toward off-frame new-hire

**Notes:** Epic. The hospitality framing is intentional — Velm is the friendly face of the Hierarchy's induction; the menace is in the clause, not the manner. The contract-signed-last-quarter line in the flavor is the canon onboarding twist; do not soften.

**Archetype rationale:** Newly-named per plan §Hierarchy naming policy. Pairs with the Compliance Inquisitor (training) — Velm onboards, the Inquisitor maintains. Together they bracket the Hierarchy worker's entire tenure.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as sacred law


---

## Hierarchy of the Damned — Managers (Rare, 18)

*18 cards in this section.*

### Backlog Maw

**ID:** `s2_hierarchy_mgr_backlog_maw` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** structure

> *It does not move. It does not speak. It is fed every quarter. Whatever is fed in does not return. The Hierarchy has been feeding it since the founding.*

**Scene:** Wide environmental. The Backlog Maw is not a person — it is a STRUCTURE. A vast circular pit set into the floor of a Hierarchy archive-chamber, its rim lined with rusted-bronze Hierarchy filing-tags. From above: a wide oculus reveals the pit descending into total black darkness. Around the rim: small Hierarchy junior-analysts in plain office attire are stacking tightly-bound paper packets onto a slow-moving conveyor that feeds the pit. The packets are visibly slipping into darkness with no echo. The chamber's lighting is cold blue-grey from sourceless overheads.

**Mood:** *the pit that does not echo* · *fed every quarter since the founding* · *rusted-bronze filing-tags at the rim* · *cold blue-grey sourceless light*

**Palette:** Hierarchy archive cool blue-grey + rusted-bronze rim-tags + total black pit-darkness + paper-packet cream + analyst-uniform muted-charcoal

**Composition:** Wide environmental from upper three-quarter angle looking down into the pit, rim and conveyor at frame-centre, oculus partially visible at upper-frame, analysts arrayed around rim

**Notes:** Rare structure. The Backlog Maw is the Hierarchy's canonical archetype for Things That Cannot Be Closed; the pit-darkness must read as absolute (no inner detail).

**Archetype rationale:** Newly-named per plan. JIRA Ghoul (Director) curates the backlog; the Backlog Maw is what the backlog actually IS — the canon visualization of work-that-never-completes.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_jira_ghoul — operational pairing


### Burndown Imp

**ID:** `s2_hierarchy_mgr_burndown_imp` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *The burndown chart slopes correctly. The work is on track. The Imp adjusts a parameter. The work was always on track.*

**Scene:** Mid-shot close. A small Hierarchy mid-manager imp standing on a Hierarchy floor-tile boardroom-corner, holding a tall holographic burndown-chart slate at chest height. The slate displays a pristine downward-sloping line in cool-cyan. The Imp's free hand rests on a small adjustment-dial at the slate's lower-left, and a faint amber-glow on the dial indicates it has just been turned. The Imp's face is mid-thirties, calm, slightly satisfied. Wears a Hierarchy charcoal vest over a faded black shirt, sleeves rolled, with a small Hierarchy crest pin at the collar.

**Mood:** *the dial that was just turned* · *the work was always on track* · *satisfied imp at the burndown-slate* · *amber dial-glow*

**Palette:** Hierarchy charcoal vest + faded black shirt + cool-cyan burndown-line + amber dial-glow + warm corner-lamp + Hierarchy crest plum-silver

**Composition:** Mid-shot close, Imp at frame-centre, holographic burndown-slate occupying frame-right two-thirds, boardroom corner in soft focus background

**Notes:** Rare. The amber dial-glow is the Burndown Imp's canonical signature — the menace is in the adjustment, never in the chart. Slope and chart-text must read as pristine; the lie is in the parameter.

**Archetype rationale:** Newly-named per plan. Pairs with Velocity Wraith (Director) — Wraith ships, Imp adjusts the appearance of shipping.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_velocity_wraith — operational pairing


### Calendar Demon

**ID:** `s2_hierarchy_mgr_calendar_demon` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *She accepts every meeting on your behalf. She declines every meeting on your behalf. The pattern is not visible to you — only to her, and only at the moment of the act.*

**Scene:** Mid-shot. A composed Quarchon manager in a Hierarchy charcoal blazer over a deep-violet blouse, mid-thirties, hair in a neat bun. She sits at a Hierarchy team-pod desk, hands hovering over a holographic calendar-grid floating at chest height. Her right hand mid-click on an ACCEPT button; her left hand mid-click on a DECLINE button — both for different meetings on the same calendar at the same time. Her face is calm, unreadable. The calendar-grid shows a chaotic mosaic of accepted, declined, and tentative blocks, all overlapping. A single small Hierarchy crest at her collar.

**Mood:** *accept and decline simultaneously* · *the pattern visible only to her* · *neat-bun calm* · *calendar-grid chaotic mosaic*

**Palette:** Hierarchy charcoal blazer + deep-violet blouse + cool-cyan calendar-grid hologram + warm desk-lamp + ACCEPT-button green / DECLINE-button red small accents + Hierarchy crest plum-silver

**Composition:** Mid-shot front-on, Calendar Demon at frame-centre seated, holographic calendar-grid filling frame-right two-thirds, hands mid-click in mirrored gesture

**Notes:** Rare. The simultaneous-mirror-click is the Calendar Demon's canonical visual signature — the menace is in the parallel decisions made on your behalf without your knowledge.

**Archetype rationale:** Newly-named per plan. Delegated calendar control is a near-universal Hierarchy executive-assistant pattern; the demon archetype emphasizes the hidden-hand framing.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Channel-Conflict Goblin

**ID:** `s2_hierarchy_mgr_channel_conflict_goblin` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *Two channels. One customer. Two reps. Two contracts. Two commissions. The Goblin charges both, then files the conflict, then bills the resolution. By Q4 he has been promoted.*

**Scene:** Mid-shot. A short broad Quarchon manager in a Hierarchy steel-grey vest over a salmon-pink dress-shirt, sleeves rolled, fingerless gloves, ledger-pen behind one pointed ear. Stands at the centre of a Hierarchy channel-conflict resolution table; on the table: two side-by-side identical Hierarchy customer-contract folios, each labeled with a different Hierarchy channel name (DIRECT / PARTNER), each open to the same signature page. The Goblin's left hand stamps the DIRECT folio; his right hand stamps the PARTNER folio. Both stamps simultaneously land. Both contracts read identically. His face is fox-like, wide-grinning, eyes a bright commission-green.

**Mood:** *two channels, one customer, two commissions* · *simultaneous stamp on both folios* · *salmon-pink dress-shirt accent* · *commission-green eyes*

**Palette:** Hierarchy steel-grey vest + salmon-pink dress-shirt + fingerless leather gloves + warm table-uplight + folio-cream + bright commission-green eye-tone + ledger-pen ink-black

**Composition:** Mid-shot front-on, Goblin at frame-centre at the table, both folios visible in foreground at frame-left and frame-right, simultaneous stamp-impacts mid-action

**Notes:** Rare. The simultaneous-stamp visual is the Channel-Conflict Goblin's canon signature; the salmon-pink shirt is a deliberate counterpoint to the otherwise-cool Hierarchy palette and is the goblin's identifier among the otherwise-uniform manager-tier.

**Archetype rationale:** Newly-named per plan. Pairs operationally with Kelv'Orth VP of Soul Acquisitions — Kelv'Orth designs the pipeline, the Goblin exploits the seams between channels.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_vp_sales_kelv_orth — sales-pipeline pairing


### Demand-Generation Phantom

**ID:** `s2_hierarchy_mgr_demand_gen_phantom` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *Pipeline is up. Conversions are up. Attribution is — the Phantom waves a translucent hand at this — being reviewed. The numbers, however, are real. As real as anything else.*

**Scene:** Mid-shot. A translucent Hierarchy mid-manager in a Hierarchy charcoal blazer over a navy turtleneck, mid-thirties, hair pulled back. Stands at a Hierarchy marketing-bullpen wall covered in floor-to-ceiling pipeline-funnel projections — each funnel shows: TOP (large input), MIDDLE (smaller qualified-leads), BOTTOM (smallest closed-won). Each funnel's BOTTOM number is highlighted with a small green up-arrow (positive trend). Her right hand is mid-gesture, palm-up, presenting the largest funnel. Her left hand holds a holographic ATTRIBUTION-MODEL diagram that is visibly fragmented (broken arrows, dotted lines marked TBD). She is mid-explanation, gentle smile.

**Mood:** *pipeline up, attribution being reviewed* · *fragmented attribution-model* · *translucent presenter* · *the numbers are real as anything else*

**Palette:** Hierarchy charcoal blazer + navy turtleneck + cool-cyan funnel projections + green up-arrow accents + fragmented attribution-model amber-and-grey + warm bullpen overhead

**Composition:** Mid-shot three-quarter, Phantom at frame-left presenting, pipeline-funnel wall at frame-right occupying two-thirds of frame, attribution-model diagram in her left hand visible at chest-height

**Notes:** Rare. Translucency is moderate. The fragmented attribution-model in the left hand is the Phantom's canonical signature — the menace is in the gentle hand-wave at the broken measurement.

**Archetype rationale:** Newly-named per plan. Pairs with Kelv'Orth VP of Soul Acquisitions on the demand-supply side; the Phantom generates the leads Kelv'Orth's reps close.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_vp_sales_kelv_orth — sales-pipeline pairing


### Estimation Goblin

**ID:** `s2_hierarchy_mgr_estimation_goblin` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *The work is estimated at three points. The work is delivered in three weeks. The points were always correct. It is the weeks that were the problem, the Goblin clarifies, helpfully.*

**Scene:** Mid-shot. A short hunched Quarchon manager in a Hierarchy mustard-yellow cardigan over a black t-shirt, sleeves pushed up, fingerless gloves, single Hierarchy crest pin at collar. He sits at a low Hierarchy planning-poker table strewn with a chaotic spread of estimation-cards (each card is a Fibonacci-numbered planning chip). His right hand holds a small mallet mid-strike — about to bang a gavel on the planning table. His left hand holds up a single planning-card with a large '3' visible. His face is fox-like, sharp, faintly grinning, eyes a clever yellow.

**Mood:** *three points, three weeks* · *the gavel on the planning table* · *fox-grin clever-yellow eyes* · *fibonacci chips strewn chaos*

**Palette:** Hierarchy mustard-yellow cardigan + black t-shirt + fingerless leather gloves + planning-table cool-grey + planning-cards pale-blue + fox-yellow eye accent

**Composition:** Mid-shot front three-quarter, Goblin at frame-centre seated at planning table, chips spread across table-foreground, mallet mid-strike at frame-right

**Notes:** Rare. The mustard-yellow cardigan is the Estimation Goblin's canon signature. The clever-yellow eye-tone must be subtle; the framing is competent-but-mischievous, not hostile.

**Archetype rationale:** Newly-named per plan. Estimation friction is a near-universal manager dysfunction; the goblin archetype lets the artist convey the under-promise/over-deliver paradox visually.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Mid-Year Adjuster

**ID:** `s2_hierarchy_mgr_midyear_adjuster` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *The fiscal year is a contract. Contracts can be amended. The amendments are retroactive. The retroactivity is, the Adjuster confirms, also amendable.*

**Scene:** Mid-shot. A precise Hierarchy mid-manager in a Hierarchy plum suit-coat over a charcoal under-shirt, half-moon reading glasses on a chain, gloves of fine grey leather. Stands at a Hierarchy contract-amendment table, the table strewn with bound Hierarchy fiscal-contract folios. Her right hand holds a stamp mid-press onto an open contract page; the stamp is shaped like the Hierarchy crest with the additional inscription RETROACTIVELY AMENDED visible on the impression already made on the page. Her left hand holds a small fountain pen, mid-poise. Her face is mid-fifties, professional, no-frills.

**Mood:** *RETROACTIVELY AMENDED* · *amendments to the amendments* · *fine grey leather gloves* · *half-moon reading glasses on a chain*

**Palette:** Hierarchy plum suit-coat + charcoal under-shirt + fine grey leather gloves + warm contract-amendment table-uplight + stamp-impression deep-red + fountain-pen ink-black

**Composition:** Mid-shot three-quarter, Adjuster at frame-centre standing at table, contract folios spread across foreground, stamp mid-press on open page

**Notes:** Rare. The RETROACTIVELY AMENDED stamp inscription is the Adjuster's canon signature; do not change the wording. Pairs operationally with Q4 Ritualist (Director) — the Adjuster amends mid-year, the Ritualist closes year-end.

**Archetype rationale:** Newly-named per plan. Mid-year fiscal amendments are a Hierarchy mechanism for moving the goalposts; the Adjuster grounds it as a role rather than an event.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_q4_ritualist — fiscal-cycle pairing


### Performance-Review Wraith

**ID:** `s2_hierarchy_mgr_perf_review_wraith` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *The review is calibrated. The calibration is panel-driven. The panel is pre-aligned. The Wraith is on the panel. The review was decided last quarter.*

**Scene:** Mid-shot. A faintly-translucent Hierarchy mid-manager in a charcoal blazer over a Hierarchy plum dress-shirt, no tie. Sits at a small round Hierarchy review-room table across from an empty chair (the reviewee position — empty, the framing is deliberate). On the table: a Hierarchy review-form open, a glass of water, a single small porcelain figurine of an asphodel flower (the Hierarchy HR-suite signature). The Wraith holds a fountain pen mid-stroke over the form's CALIBRATED RATING line. Translucency strong enough that the asphodel figurine shows through her shoulder.

**Mood:** *calibrated rating line* · *asphodel figurine on the review-table* · *the empty chair across* · *the review was decided last quarter*

**Palette:** Hierarchy charcoal blazer + plum dress-shirt + warm review-room interior + cool corridor light through doorway behind + asphodel figurine pale-grey + fountain-pen mid-stroke ink-black

**Composition:** Mid-shot front three-quarter, Wraith at frame-left at the review-table, empty reviewee-chair at frame-right foreground, asphodel-figurine and review-form on table between them

**Notes:** Rare. Asphodel figurine echoes Mor'Vethic CHRO's asphodel plant + Nessith Audit VP's asphodel print — intentional design echo across all Hierarchy HR/calibration roles. CALIBRATED RATING line on the form should be visibly inked but illegible at distance.

**Archetype rationale:** Newly-named per plan. Reports operationally to Mor'Vethic CHRO; the Hierarchy's performance-review function needs a manager-tier IC counterpart to make the calibration system feel like a real org.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_chro_mor_vethic — calibration pairing


### Pivot-Memo Phantom

**ID:** `s2_hierarchy_mgr_pivot_memo_phantom` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *The memo arrives at 4:47pm on Friday. The subject reads 'Quick Note'. The note is six pages. The pivot is announced in paragraph four. The Phantom has already gone home.*

**Scene:** Mid-shot. A translucent Hierarchy manager in a Hierarchy charcoal cardigan over a faded blue dress-shirt, mid-action of standing up from a desk and reaching for an office-door handle in a single motion — caught mid-motion, body angled toward the exit. On the desk behind him: an open laptop showing a sent-email confirmation 'QUICK NOTE — SENT 4:47pm'. The desk's overhead lamp is in mid-power-down (lamp filament dimming). The wall-clock visible behind reads exactly 4:47pm on a Friday. His face is mid-departure, neutral, not looking back at the desk.

**Mood:** *4:47pm Friday* · *the memo titled 'Quick Note'* · *lamp dimming as he leaves* · *Phantom mid-motion at the door*

**Palette:** Hierarchy charcoal cardigan + faded-blue dress-shirt + warm desk-lamp dimming + cool corridor light through open doorway + laptop screen-glow pale-cyan + wall-clock muted

**Composition:** Mid-shot side-three-quarter, Phantom at frame-left mid-motion toward the doorway at frame-right, desk and laptop visible in extreme background centre

**Notes:** Rare. The 4:47pm timing is the Phantom's canonical signature — not 5:00pm exactly, the pre-departure thirteen minutes are intentional. Mid-motion posture must read as already-leaving, not preparing to leave.

**Archetype rationale:** Newly-named per plan. End-of-week strategic-pivot memos are a Hierarchy timing-attack pattern; the Phantom archetype emphasizes the absence-after-the-act.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Process Imp

**ID:** `s2_hierarchy_mgr_process_imp` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *Every workflow has a step. The Process Imp adds another. The new step requires the Process Imp's approval. The approval requires another step.*

**Scene:** Mid-shot. A small wiry Quarchon manager — barely four feet tall — perched on a tall Hierarchy stool at a process-design workstation. Wears Hierarchy steel-grey vest over a black shirt, sleeves rolled to forearm, fingerless leather gloves spattered with toner. Hands manipulate a vast holographic Hierarchy workflow-graph floating in front of him — boxes-and-arrows that he is mid-action of inserting a new approval-step into. His face is sharp-featured, faintly amused, with a small ledger-pen tucked behind one pointed ear. Behind him: a wall of bound Hierarchy process-binders, each slightly thicker than the last.

**Mood:** *the imp who adds approval steps* · *ledger-pen behind the ear* · *binders thicker each year* · *fingerless gloves spattered with toner*

**Palette:** Hierarchy steel-grey vest + black shirt + fingerless leather gloves + workflow-graph cool-cyan glow + process-binder forest-green spines + warm task-lamp accent

**Composition:** Mid-shot front three-quarter, Imp on stool at frame-centre, holographic workflow-graph extending into frame-right and overhead, process-binder wall in soft focus background

**Notes:** Rare. The fingerless gloves and toner-spatter are the canonical Process Imp signature; do not omit. Workflow-graph must read as overcomplicated rather than artfully complex.

**Archetype rationale:** Newly-named per plan. Process-design managers are the Hierarchy's mechanism for institutional friction; an imp archetype works visually because the harm is small per-step but compounding.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Quarterly Forecaster

**ID:** `s2_hierarchy_mgr_quarterly_forecaster` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *He produces the forecast. The forecast is wrong. He produces the next forecast. The previous forecast was, he explains, externally-impacted.*

**Scene:** Mid-shot. A Hierarchy mid-manager in a Hierarchy navy blazer over a striped charcoal-and-cream dress-shirt, no tie, sleeves slightly cuffed. Stands at a Hierarchy forecasting-room standing-desk, both hands resting on the desk's edge, leaning slightly forward to study a wall-sized projection of a Hierarchy quarterly forecast — the projection shows three lines: a HISTORICAL line (steady trend), a FORECAST line (overconfident upward arc), and an ACTUAL line (well below the forecast, just visible at the lower edge). His face is calm, focused, mid-explanation. His mouth is slightly open as if speaking off-frame; one hand has lifted from the desk to gesture toward the projection.

**Mood:** *externally-impacted* · *forecast above, actual below* · *the explanation that begins with 'unforeseen'* · *navy blazer striped shirt*

**Palette:** Hierarchy navy blazer + striped charcoal-and-cream shirt + cool-cyan projection lines + warm forecasting-room overhead + standing-desk pale-grey + lower ACTUAL-line slightly muted

**Composition:** Mid-shot three-quarter, Forecaster at frame-left leaning over desk, wall-projection occupying frame-right two-thirds, three forecast-lines visible at projection

**Notes:** Rare. The HISTORICAL/FORECAST/ACTUAL line composition is the Forecaster's canonical signature. The visual gap between FORECAST and ACTUAL must read as significant but not slapstick — the Hierarchy framing is procedural, not absurd.

**Archetype rationale:** Newly-named per plan. Pairs with Metrics Oracle (Director) — Oracle measures, Forecaster predicts. The two together complete the Hierarchy's data layer.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_metrics_oracle — data-layer pairing


### Reorg Specter

**ID:** `s2_hierarchy_mgr_reorg_specter` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** spell

> *The org chart is inviolate. The Specter does not violate it. The Specter merely re-renders it. The fact that the new rendering bears no resemblance to the old is, technically, an aesthetic choice.*

**Scene:** Wide environmental. A Hierarchy planning-room with a vast wall-mounted org-chart projection. The chart is mid-rerender — the upper half of the visible projection shows the OLD org structure (boxes, reporting lines), the lower half shows the NEW org structure (different boxes, different reporting lines), and a horizontal seam mid-frame separates them where the rerender is still propagating. Standing centre-frame is the Reorg Specter — a translucent Hierarchy manager-figure in a steel-grey blazer over a black under-shirt, both arms wide, palms outward, mid-incantation. Translucent ghost-arms (six total beyond the visible two) extend from his shoulders, each hand on a different box in the chart. Around him: empty Hierarchy planning-room, no other staff present.

**Mood:** *the rerender propagating mid-projection* · *no resemblance to the old chart* · *ghost-arms each on a different box* · *empty planning-room*

**Palette:** Hierarchy steel-grey blazer + black under-shirt + cool-cyan org-chart projection + horizontal rerender-seam pale-amber + translucent ghost-arms pale-violet + empty planning-room muted-neutral

**Composition:** Wide environmental front-on, Specter at frame-centre, org-chart projection occupying entire background wall, rerender-seam visible across frame mid-height

**Notes:** Rare spell card. Pairs visually with Pivot Demon (Director) but at the structural-org level rather than strategic level. The horizontal rerender-seam is the Reorg Specter's canonical signature.

**Archetype rationale:** Newly-named per plan. Reorganization-without-warning is a Hierarchy structural-friction pattern; pairs with Pivot Demon (strategy) and Townhall Phantom (comms) as the trio of Hierarchy disruption-spells.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_pivot_demon — disruption-spell pairing


### Roadmap Banshee

**ID:** `s2_hierarchy_mgr_roadmap_banshee` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *She maintains the public roadmap. The public roadmap is reassuring. She maintains the private roadmap. The private roadmap is, she promises, much more interesting.*

**Scene:** Mid-shot. A Hierarchy product manager in a forest-green blazer over a black collared shirt, mid-thirties, sharp jaw. Stands at a Hierarchy roadmap-room with two adjacent wall-projections — left projection labeled 'PUBLIC ROADMAP' shows a tidy sequenced quarter-by-quarter plan in cool-cyan; right projection labeled 'INTERNAL ROADMAP' shows a chaotic sprawling actual-plan in warning-amber-and-red, with double the items, half marked DEPRIORITIZED, several marked UNDER NDA. Her left hand rests on the public projection; her right hand mid-flick toward the private one as if revealing it. Her mouth is open mid-utterance — a low keen that the artist should suggest as a faint visible distortion-ripple emanating from her throat-area.

**Mood:** *two roadmaps, one true* · *the keen that distorts the air* · *DEPRIORITIZED and UNDER NDA* · *public reassuring, internal chaotic*

**Palette:** Hierarchy forest-green blazer + black collared shirt + cool-cyan public-roadmap + warning-amber-and-red internal-roadmap + faint distortion-ripple pale-violet + warm roadmap-room overhead

**Composition:** Mid-shot three-quarter, Banshee at frame-centre between two wall-projections, public roadmap at frame-left, internal roadmap at frame-right, mouth-distortion-ripple visible as faint visual artifact

**Notes:** Rare. The two-projection contrast is the Banshee's canonical signature; the distortion-ripple from the keen must be subtle (faint visual artifact, not full effects). Roadmap-item text on both projections must be illegible to avoid encoding any Act-specific Hierarchy plans.

**Archetype rationale:** Newly-named per plan. Maintaining-two-roadmaps is a Hierarchy product-management dysfunction; the banshee archetype echoes the auditory-distortion framing of Shadow Tongue at the manager tier.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- docs/built/LORE_BIBLE.md §Shadow Tongue (auditory-distortion framing precedent)


### Slack-Channel Phantom

**ID:** `s2_hierarchy_mgr_slack_phantom` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *She types. She stops typing. She types again. The 'is typing' indicator runs for forty minutes. The message, when it arrives, is a single word: 'thoughts?'*

**Scene:** Mid-shot. A pale translucent Hierarchy manager in a Hierarchy charcoal cardigan over a faded black shirt, sleeves pushed up, hair pulled into a careless twist. She sits at a Hierarchy mid-floor cubicle work-station; her face is soft-lit by a single chat-application monitor. The monitor displays a Hierarchy chat-channel with a visible 'PHANTOM is typing...' indicator at the bottom of the panel. Above the indicator, a single message bubble has been sent and it reads 'thoughts?' in legible Hierarchy script. Her hands hover above the keyboard, paused mid-air. Her face is contemplative, slightly tired.

**Mood:** *forty minutes of typing-indicator* · *thoughts?* · *translucent manager hovering over keys* · *monitor-glow soft-lit cubicle*

**Palette:** Hierarchy charcoal cardigan + faded black shirt + monitor cool-cyan + cubicle muted overhead + 'PHANTOM is typing...' indicator amber + sent-message bubble pale-blue

**Composition:** Mid-shot front three-quarter, Phantom at frame-centre seated, monitor occupying frame-right one-third, paused hands above keyboard at frame-bottom

**Notes:** Rare. Translucency is moderate — clearly visible but readable through. The 'thoughts?' message text is the canonical Phantom signature; do not change. Type-indicator must be the LIVE animated form (slight motion-blur on the dots).

**Archetype rationale:** Newly-named per plan. Asynchronous-ambush messaging is a Hierarchy manager-tier dysfunction; the Phantom archetype gives it a face.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Stakeholder Wrangler

**ID:** `s2_hierarchy_mgr_stakeholder_wrangler` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *Eleven stakeholders agreed to the meeting. Nine attended. Six understood. Four signed. Two remember signing. The proposal is, by every metric the Hierarchy tracks, fully aligned.*

**Scene:** Mid-shot. A Hierarchy program manager in a Hierarchy charcoal long-coat over a deep-violet sweater, mid-forties, with the patient bearing of an experienced facilitator. Holds a thin Hierarchy folio open in one hand and a thin presentation-pointer in the other. Stands at the centre of a Hierarchy stakeholder-alignment chamber — a circular room with eleven small Hierarchy podiums arranged in a circle, each with a tiny brass nameplate bearing a generic Hierarchy department-title (PROCUREMENT / STRATEGY / OPS / etc — generic enough to not encode specific Acts). Two podiums are unattended (vacant). Three are occupied by figures depicted as faint silhouettes (deliberate ambiguity — the figures attended but did not engage). Six are occupied by clearer Hierarchy junior-figures. The Wrangler's face is mid-explanation, calm, patient.

**Mood:** *eleven podiums, four signatures* · *patient facilitator at the centre* · *vacant podiums, silhouette podiums* · *fully aligned by every metric tracked*

**Palette:** Hierarchy charcoal long-coat + deep-violet sweater + warm chamber overhead + brass nameplates muted-warm + Hierarchy junior-figures muted-charcoal + vacant podiums muted-grey

**Composition:** Mid-shot front-on, Wrangler at frame-centre, eleven podiums arrayed in a 270-degree arc around her with the foreground arc opening toward the viewer

**Notes:** Rare. The eleven-podium count is the Wrangler's canonical signature; the variable engagement-states across the eleven (vacant, silhouette, present) visualize the canon framing of Hierarchy stakeholder-alignment dysfunction.

**Archetype rationale:** Newly-named per plan. Pairs with Cross-Functional Predator (Director) — Predator wedges into every team, Wrangler convenes them all and then declares alignment.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_cross_functional_predator — alignment-stack pairing


### Stand-Up Wraith

**ID:** `s2_hierarchy_mgr_stand_up_wraith` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *Three questions: yesterday, today, blockers. Twenty-three minutes. By the time the round is complete, somebody is missing.*

**Scene:** Mid-shot. A faintly-translucent Quarchon manager in Hierarchy charcoal-and-cream business-casual — open-collar shirt, no tie, badge on lanyard. Stands at the head of a small Hierarchy team-pod, half-circle of six junior analysts gathered in front of a wall-mounted virtual sprint-board. The Wraith's translucency is mid-grade: clearly there, but the analyst directly behind reads through the Wraith's shoulder. The wraith is mid-question, one hand raised, palm-up — the classic 'who's blocked' gesture. Behind: cool Hierarchy team-pod overhead light, sprint-board cool-cyan.

**Mood:** *the daily ritual* · *translucent manager who consumes the round* · *twenty-three minutes* · *palm-up blocker question*

**Palette:** Hierarchy charcoal-and-cream business-casual + translucent body + cool team-pod overhead + sprint-board cool-cyan + analyst silhouettes muted

**Composition:** Mid-shot three-quarter, Wraith at frame-centre at head of pod, half-circle of analysts forming arc at frame-edges

**Notes:** Rare. Translucency is the manager-tier signature for Hierarchy — every Manager has some degree of phasing/absence. Mid-grade for Stand-Up Wraith (you can read through, but not transparently).

**Archetype rationale:** Newly-named per plan. Stand-up ritual is the most-recognizable manager friction-point; making it a Hierarchy card grounds the corporate-satire framing at the rare tier.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Token-Economy Imp

**ID:** `s2_hierarchy_mgr_token_economy_imp` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *The token has utility. The utility is the token. The token also rewards loyalty. The loyalty is to the token. The whitepaper is twelve pages and resolves nothing.*

**Scene:** Mid-shot. A small wiry Quarchon imp in a Hierarchy charcoal vest over a faded crypto-conference t-shirt (no real-world brand visible — invented Hierarchy crypto-event title), mid-twenties. Sits cross-legged atop a Hierarchy product-team table. In one outstretched palm: a small floating holographic token-glyph rotating slowly, tagged with a circular Hierarchy crest. In the other palm: an open holographic whitepaper showing dense flowchart-style token-utility loops that double back on themselves. His face is bright, animated, mid-pitch — eyes wide, faintly amused. Around him: empty Hierarchy product-room chairs.

**Mood:** *token-utility loops doubling back* · *twelve pages resolving nothing* · *the utility IS the token* · *imp pitching to empty chairs*

**Palette:** Hierarchy charcoal vest + faded crypto-event t-shirt + cool-cyan holographic token + warm floor-uplight from below table + pale-violet whitepaper-glow + empty chairs muted

**Composition:** Mid-shot front-on, Imp at frame-centre cross-legged on table, both palms extended forward, token at frame-left palm and whitepaper at frame-right palm

**Notes:** Rare. The empty-chairs framing is intentional — Hierarchy token-economy initiatives canonically pitch to nobody. The whitepaper-loops must read as recursively-self-referential without being literally readable.

**Archetype rationale:** Newly-named per plan. Token-economy/incentive-design managers are a Hierarchy product-management archetype where the framework justifies itself; the imp archetype emphasizes the playful self-justification.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Vendor-Management Wraith

**ID:** `s2_hierarchy_mgr_vendor_mgmt_wraith` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** rare · **Type:** unit

> *The vendor is contracted. The contract is renewed. The renewal terms are slightly worse. The vendor is contracted. The cycle is, the Wraith notes mildly, working as designed.*

**Scene:** Mid-shot. A faintly-translucent Hierarchy mid-manager in a Hierarchy steel-grey blazer over a charcoal turtleneck, mid-forties, hair short and silvering at the temples. Sits at a Hierarchy procurement-room conference table, across from a stack of three identical bound Hierarchy vendor-contract folios labeled by year. In her hands: an open fourth folio (the current year's renewal), pen mid-stroke on the signature line. The contract's MARGINALLY WORSE TERMS clause is visible as a small highlighted block on the open page (text faint enough to be illegible). Behind her: a Hierarchy procurement floor-plan map of vendor relationships pinned to a corkboard.

**Mood:** *the cycle is working as designed* · *marginally worse terms each renewal* · *translucent procurement-veteran* · *three identical folios stacked*

**Palette:** Hierarchy steel-grey blazer + charcoal turtleneck + warm procurement-room overhead + cool corridor light through doorway behind + folio-stack pale-grey + corkboard-pinned floor-plan muted

**Composition:** Mid-shot three-quarter, Wraith at frame-centre seated, folio-stack at frame-foreground, current-folio open in her hands at chest-height, corkboard visible in soft focus background

**Notes:** Rare. Translucency is moderate. The MARGINALLY WORSE TERMS highlight is the Wraith's canon signature — the bureaucratic horror is in the pattern, not the action.

**Archetype rationale:** Newly-named per plan. Vendor-management managers operate the Hierarchy's external supply-chain via slow predatory renewals; the wraith archetype emphasizes the institutional-memory advantage that drives the pattern.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


---

## Hierarchy of the Damned — Analysts (Uncommon, 24)

*24 cards in this section.*

### Brand Coordinator

**ID:** `s2_hierarchy_anl_brand_coordinator` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *The brand standard is documented. The brand standard is in the wiki. The wiki is two versions out of date. The Coordinator has, again, taken the screenshot of the correct standard and pasted it into the channel. The screenshot will, again, be lost.*

**Scene:** Mid-shot. A Hierarchy brand-coordinator analyst at a Hierarchy brand-pod desk, late-twenties, in a Hierarchy ivory blouse over a charcoal blazer. Single tall monitor showing a Hierarchy brand-standards document with multiple version-tabs across the top. Right hand mid-click on a Hierarchy chat-channel composer where a screenshot has just been pasted; left hand on a small Hierarchy-branded paper notebook open at chest-height. Her face is friendly, polite-frustrated.

**Mood:** *the wiki is two versions out of date* · *the screenshot will be lost* · *polite-frustrated friendly* · *paste screenshot, again*

**Palette:** Hierarchy ivory blouse + charcoal blazer + cool-cyan brand-standards monitor + chat-channel pale-blue + warm desk-lamp + Hierarchy-branded notebook ivory accent

**Composition:** Mid-shot front three-quarter, Coordinator at frame-centre seated, monitor at frame-rear, notebook at chest-foreground

**Notes:** Uncommon. Pairs with Vex'Drelm CMO operationally — Vex'Drelm acquires brands; the Coordinator polices them. The pasted-screenshot is the canon Brand Coordinator signature.

**Archetype rationale:** Newly-named per plan. Brand coordinators are the Hierarchy's brand-stewardship IC layer; the wiki-version-friction is the canonical Hierarchy knowledge-management dysfunction.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_cmo_vex_drelm — brand-stack pairing


### Compliance Auditor

**ID:** `s2_hierarchy_anl_compliance_auditor` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Eighty-seven controls, of which she has tested forty-two this quarter, of which thirty-seven passed, of which two have been escalated. The remainder are in PROGRESS.*

**Scene:** Mid-shot. A precise mid-thirties Quarchon analyst in a Hierarchy plain-charcoal blouse and pencil-skirt, hair in a tight low bun. Sits at a small Hierarchy audit-desk reviewing a control-test workpaper, highlighter mid-pass over a single line. A Hierarchy plain-grey lanyard hangs from her neck with a small AUDIT clearance-tag. Three identical bound binders stacked at her desk-edge labeled 'Q3 CONTROLS'. The cubicle's overhead fluorescent throws her in flat institutional light.

**Mood:** *eighty-seven controls* · *forty-two tested, two escalated* · *flat institutional fluorescent* · *audit clearance-tag*

**Palette:** Hierarchy plain-charcoal blouse + pencil-skirt + flat institutional fluorescent + cool-grey cubicle walls + binder-spine forest-green + plain-grey lanyard + highlighter pale-yellow

**Composition:** Mid-shot front three-quarter, Auditor at frame-centre seated, binder-stack at frame-foreground, cubicle wall in soft focus behind

**Notes:** Uncommon. Reports operationally to Nessith VP Internal Audit. The deliberately-plain styling matches Nessith's framing: audit-tier roles in the Hierarchy are deliberately low-visibility.

**Archetype rationale:** Newly-named per plan. Forms the IC layer of the Hierarchy's audit function — Nessith VP at the executive level, this Auditor at the desk level.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_vp_audit_nessith — audit-stack pairing


### Customer-Success Drone

**ID:** `s2_hierarchy_anl_cs_drone` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Renewal at risk. Champion has departed. Sponsor has been reorganized. The Drone files the at-risk flag, schedules the QBR, attaches the deck. The Drone has done this before. The Drone will do this again.*

**Scene:** Mid-shot. A Hierarchy customer-success analyst at a small headset-equipped workstation, late-twenties, in a Hierarchy soft-violet polo over a charcoal under-shirt. Her face is professionally cheerful, with the slight rictus of someone twelve calls into a sixteen-call day. Right hand on a customer-account screen showing health-score AT RISK in warning-amber; left hand mid-click on a Hierarchy 'Schedule QBR' button. A small framed picture on the desk-edge — a cute Hierarchy office-pet (deliberately bland, e.g. a small grey office-cat).

**Mood:** *twelve calls into a sixteen-call day* · *AT RISK in warning-amber* · *Schedule QBR mid-click* · *professional cheerful rictus*

**Palette:** Hierarchy soft-violet polo + charcoal under-shirt + cool-cyan account-screen + warning-amber AT-RISK accent + warm desk-lamp + framed-picture muted-warm

**Composition:** Mid-shot front three-quarter, Drone at frame-centre seated, account-screen at frame-right, framed picture at desk-foreground

**Notes:** Uncommon. Pairs with Demand-Gen Phantom (Manager) operationally — Phantom generates pipeline, Drone keeps it from churning. Cheerful-rictus is the canonical Drone signature.

**Archetype rationale:** Newly-named per plan. Customer-success ICs are the Hierarchy's customer-retention layer; the drone framing emphasizes the bureaucratic-procedural aspect.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_demand_gen_phantom — pipeline pairing


### Data Analyst (Hierarchy)

**ID:** `s2_hierarchy_anl_data_analyst` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *The query is still running. The query has been running for forty minutes. The Analyst has, in the interim, been promoted, reorganized, given a new dataset, and asked to re-run the query.*

**Scene:** Mid-shot. A Hierarchy data analyst at a Hierarchy data-pod workstation, late-twenties, in a Hierarchy charcoal hoodie over a black collared shirt, sleeves pushed up. Three monitors: the leftmost shows a SQL editor with a long query in progress, middle shows a slow-spinning loading icon, rightmost shows a data-warehouse schema. Right hand on mouse, left hand resting on chin. His face is patient, slightly bored.

**Mood:** *the query is still running* · *forty-minute waits as routine* · *patient slight boredom* · *SQL editor + loading icon + schema*

**Palette:** Hierarchy charcoal hoodie + black collared shirt + cool-cyan triple-monitor + warm desk-lamp + loading-icon amber accent + Hierarchy crest plum-silver lanyard

**Composition:** Mid-shot front-on, Analyst at frame-centre seated, three monitors arc behind him, mouse-hand at frame-right desk-edge

**Notes:** Uncommon. Pairs with Reporting Specialist (within-tier) and Metrics Oracle (Director) — the Analyst writes the queries the Specialist surfaces and the Oracle reads from.

**Archetype rationale:** Newly-named per plan. The Hierarchy's data IC layer needs both report-builders (Reporting Specialist) and query-authors (this Analyst) — the data flows from raw to surfaced through both.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_anl_reporting_specialist — data-stack pairing


### Finance & Strategy Analyst

**ID:** `s2_hierarchy_anl_finance_analyst` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *The model is built. The assumptions are documented. The sensitivity is run. The board deck is ready. The board deck has been re-templated. The model is being rebuilt.*

**Scene:** Mid-shot. A meticulous Hierarchy finance analyst at a tidy Hierarchy finance-pod workstation, late-twenties, in a Hierarchy navy blazer over a crisp white blouse, hair in a low pony. Two monitors: the left shows a Hierarchy financial-model with cells highlighted in cool-cyan; the right shows a board-deck slide with a financial chart. Right hand mid-keystroke; left hand holds a bound assumptions-document open at chest-height.

**Mood:** *the model is being rebuilt* · *tidy meticulous workstation* · *navy blazer crisp blouse* · *assumptions documented at chest-height*

**Palette:** Hierarchy navy blazer + crisp white blouse + cool-cyan dual-monitor + warm desk-lamp + bound-document forest-green + Hierarchy crest plum-silver lanyard

**Composition:** Mid-shot front-on, Analyst at frame-centre seated, two monitors at frame-rear, bound-document held at chest-foreground

**Notes:** Uncommon. Pairs with Xeth'Raal CFO at the executive level and with Quarterly Forecaster (Manager) operationally. The deliberate tidiness is the Finance Analyst signature — opposite end of the visual spectrum from the Sales Ops fatigue.

**Archetype rationale:** Newly-named per plan. Finance ICs are the Hierarchy's modeling layer; the tidiness/precision framing reflects the financial-discipline canon (Xeth'Raal's Ledger of Ruin).

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_cfo_xeth_raal — finance-stack pairing


### Internal Communications Analyst

**ID:** `s2_hierarchy_anl_internal_comms` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *She drafts the all-hands deck. She also drafts the all-hands deck rebuttal. She also drafts the FAQ. The FAQ contains the rebuttal. The all-hands deck is, by Q3, the source of every question and every answer.*

**Scene:** Mid-shot. A Hierarchy internal-comms analyst at a Hierarchy bullpen workstation, mid-thirties, in a Hierarchy plum cardigan over a black collared blouse. Three browser-windows open across two monitors: a slide deck mid-edit, a FAQ document with bulleted Q&A, and a Hierarchy comms-channel composer. Her right hand mid-keyboard-shortcut between windows; her left hand holds a Hierarchy lukewarm-tea mug at chest height. Her face is mid-context-switch, focused, mouth slightly tense.

**Mood:** *the FAQ contains the rebuttal* · *three windows, two monitors* · *lukewarm-tea mug* · *mouth slightly tense*

**Palette:** Hierarchy plum cardigan + black collared blouse + dual-monitor cool-cyan + lukewarm-tea mug muted-warm + warm bullpen overhead + Hierarchy crest plum-silver lanyard

**Composition:** Mid-shot front three-quarter, Analyst at frame-centre seated, two monitors at frame-right, mug held at chest-foreground

**Notes:** Uncommon. Pairs with Townhall Phantom (Director) — Phantom moderates the all-hands the Analyst drafts. The drafted-FAQ-containing-the-rebuttal is the canonical Comms Analyst signature.

**Archetype rationale:** Newly-named per plan. Internal-communications ICs are the Hierarchy's institutional-voice IC layer; pairs with Shadow Tongue's executive language-corruption at the IC tier.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_townhall_phantom — comms-stack pairing


### Internal-Mobility Analyst

**ID:** `s2_hierarchy_anl_internal_mobility` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Posted internally first. Two qualified internal candidates declined to apply. External search initiated. External hire selected. The Hierarchy's internal-mobility commitment, the Analyst notes, has been honored in full.*

**Scene:** Mid-shot. A composed Hierarchy mobility analyst at a Hierarchy people-ops desk, mid-thirties, in a Hierarchy soft-grey cardigan over a deep-violet blouse. Single tall monitor showing a Hierarchy internal-jobs-board with two roles flagged INTERNAL FIRST — both already showing 0 internal applicants and an external posting going live tomorrow. Right hand mid-click on the schedule-external-posting button; left hand on a small Hierarchy mobility-policy printout. Her face is mid-thirties professional-resigned.

**Mood:** *posted internally first* · *internal commitment honored in full* · *external posting going live tomorrow* · *professional-resigned composure*

**Palette:** Hierarchy soft-grey cardigan + deep-violet blouse + cool-cyan jobs-board monitor + INTERNAL FIRST flag amber accent + warm desk-lamp + mobility-policy printout pale-cream

**Composition:** Mid-shot front three-quarter, Analyst at frame-centre seated, monitor at frame-right, mobility-policy printout at chest-foreground

**Notes:** Uncommon. Pairs with Recruiting Coordinator (within-tier) and Mor'Vethic CHRO. The 'INTERNAL FIRST' flag with zero applicants is the Mobility Analyst's canonical signature.

**Archetype rationale:** Newly-named per plan. Internal-mobility analysts are the Hierarchy's compliance-with-policy IC layer; the canonical pattern is policy-honored-in-form-only.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_chro_mor_vethic — people-ops pairing


### Investor-Relations Coordinator

**ID:** `s2_hierarchy_anl_ir_coordinator` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *She drafts the earnings narrative. The narrative emphasizes momentum. Momentum is, the Coordinator notes carefully, a measurement-independent property. The auditor will, again, accept this framing.*

**Scene:** Mid-shot. A composed Hierarchy IR coordinator at a tidy Hierarchy IR-pod workstation, late-twenties, in a Hierarchy navy suit-jacket over a crisp white blouse, hair in a low pony. Single tall monitor showing a Hierarchy earnings-narrative draft with multiple track-changes in the margin. Right hand on a fountain pen mid-stroke on a printed copy of the same narrative; left hand rests palm-down on a closed Hierarchy investor-deck folio. The Hierarchy crest pendant at her throat catches warm desk-light.

**Mood:** *narrative emphasizes momentum* · *measurement-independent property* · *auditor will accept this framing* · *track-changes in the margin*

**Palette:** Hierarchy navy suit-jacket + crisp white blouse + cool-cyan narrative-draft monitor + warm desk-lamp + investor-deck folio forest-green + Hierarchy crest pendant pale-silver

**Composition:** Mid-shot front three-quarter, Coordinator at frame-centre seated, monitor at frame-right, investor-deck folio on desk-foreground

**Notes:** Uncommon. Pairs with Xeth'Raal CFO and Quarterly Forecaster (Manager) — IR is downstream of the Forecaster's projections and Xeth'Raal's ledger.

**Archetype rationale:** Newly-named per plan. IR coordinators are the Hierarchy's external-narrative IC layer; the measurement-independent-momentum framing is the canonical IR signature.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_cfo_xeth_raal — IR-stack pairing


### Knowledge Management Specialist

**ID:** `s2_hierarchy_anl_knowledge_management` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Documented. Categorized. Tagged. Indexed. The article has, in the time it took to publish, been made obsolete by a process change posted in a different channel. The Specialist will, of course, update.*

**Scene:** Mid-shot. A Hierarchy knowledge-management specialist at a Hierarchy KM-pod desk, late-thirties, in a Hierarchy navy cardigan over a charcoal blouse, fingerless leather gloves with the pattern of a small Hierarchy crest stitched into them. Two monitors: leftmost shows a Hierarchy wiki-article being edited; rightmost shows a Hierarchy chat-channel with a process-change announcement that contradicts the article. Right hand mid-edit on the wiki-article; left hand on a small Hierarchy index-card box.

**Mood:** *obsolete by the time of publish* · *fingerless gloves, crest-stitched* · *wiki-article edited mid-redundant* · *index-card box at the desk-edge*

**Palette:** Hierarchy navy cardigan + charcoal blouse + cool-cyan dual-monitor + warm desk-lamp + index-card box muted-cream + Hierarchy crest fingerless-glove accent

**Composition:** Mid-shot front three-quarter, Specialist at frame-centre seated, two monitors at frame-rear, index-card box at desk-foreground

**Notes:** Uncommon. Pairs with Brand Coordinator (within-tier). The contradicting-channel-vs-wiki framing is the canonical KM Specialist signature.

**Archetype rationale:** Newly-named per plan. KM specialists are the Hierarchy's documentation IC layer; the canonical pattern is documentation-perpetually-trailing-reality.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_anl_brand_coordinator — knowledge-friction pairing


### Marketing Analyst

**ID:** `s2_hierarchy_anl_marketing_analyst` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *The campaign drove engagement. Engagement is up. Conversion is — being measured. Awareness is — being reviewed. The campaign was, by every leading indicator, a success.*

**Scene:** Mid-shot. A Hierarchy marketing analyst at a Hierarchy marketing-pod desk, late-twenties, in a Hierarchy plum blazer over a soft-cream blouse. Two monitors: leftmost shows a Hierarchy campaign-performance dashboard with several upward-trending lines in cool-cyan; rightmost shows a Hierarchy survey-results view with a multi-page open response section. Right hand mid-keystroke; left hand holds a Hierarchy printed campaign-brief. Her face is bright, mid-presentation-prep.

**Mood:** *engagement up, conversion being measured* · *leading-indicator success* · *campaign brief mid-printed* · *bright presentation-prep*

**Palette:** Hierarchy plum blazer + soft-cream blouse + cool-cyan dual-monitor + warm desk-lamp + campaign-brief paper-warm + Hierarchy crest plum-silver lanyard

**Composition:** Mid-shot front three-quarter, Analyst at frame-centre seated, two monitors at frame-rear, campaign-brief at chest-foreground

**Notes:** Uncommon. Pairs with Demand-Gen Phantom (Manager) at the data-supply level. The leading-indicator framing is the Marketing Analyst signature — confidence in proxies that resist measurement.

**Archetype rationale:** Newly-named per plan. Marketing analysts are the Hierarchy's campaign-attribution IC layer; pairs with the broader marketing-stack (Vex'Drelm/Demand-Gen Phantom/Brand Coordinator).

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_demand_gen_phantom — measurement-friction pairing


### Office Manager Specter

**ID:** `s2_hierarchy_anl_office_manager` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *The fridge is restocked. The mail is sorted. The badge-printer is online. The all-hands lunch has been ordered (and re-ordered, after the dietary restrictions arrived). The Specter does not need acknowledgment, but she does keep a list.*

**Scene:** Mid-shot. A faintly-translucent Hierarchy office-manager analyst at the threshold of a Hierarchy main-floor common-area, mid-fifties, in a Hierarchy soft-violet cardigan over a black blouse, reading-glasses on a chain. Holds a small Hierarchy clipboard tucked under one arm; right hand mid-pat to a stack of fresh badge-printer paper on a side-counter. Behind her: a tidy Hierarchy office kitchenette (coffee maker, fruit bowl, recycling sorted). Her face is competent, faintly weary, no smile.

**Mood:** *the fridge is restocked* · *the badge-printer is online* · *she keeps a list* · *translucent competent weary*

**Palette:** Hierarchy soft-violet cardigan + black blouse + reading-glasses chain pale-silver + warm common-area uplight + cool corridor light through doorway behind + clipboard pale-grey

**Composition:** Mid-shot three-quarter, Specter at frame-centre at threshold, kitchenette at frame-rear in soft focus, side-counter foreground at frame-right

**Notes:** Uncommon. Translucency is moderate. The 'she keeps a list' detail is the canonical Office Manager Specter signature — quiet competence with quiet ledger.

**Archetype rationale:** Newly-named per plan. Office-manager ICs are the Hierarchy's invisible-infrastructure layer; the specter framing emphasizes that the role is felt only when interrupted.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Pricing Analyst

**ID:** `s2_hierarchy_anl_pricing_analyst` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Discount approved. Discount approved. Discount approved. The Analyst has not approved any of these. The Analyst was looped in for visibility. The Analyst is, formally, the approver.*

**Scene:** Mid-shot. A Hierarchy pricing analyst at a Hierarchy pricing-pod workstation, late-twenties, in a Hierarchy plum blazer over a charcoal blouse. Single wide monitor showing a Hierarchy pricing-approval queue with a long list of discount-requests, all marked APPROVED in green. Right hand mid-tap on the next item in the queue; left hand holds a small Hierarchy pricing-policy binder. Her face is mid-twenties resigned-with-coffee.

**Mood:** *approved approved approved* · *looped in for visibility* · *the analyst is formally the approver* · *resigned-with-coffee composure*

**Palette:** Hierarchy plum blazer + charcoal blouse + cool-cyan pricing-queue + APPROVED-row green accent + warm desk-lamp + pricing-policy binder forest-green

**Composition:** Mid-shot front three-quarter, Analyst at frame-centre seated, monitor at frame-right, pricing-policy binder at chest-foreground

**Notes:** Uncommon. Pairs with Channel-Conflict Goblin (Manager) — the Goblin exploits seams; the Pricing Analyst rubber-stamps the discounts that create them.

**Archetype rationale:** Newly-named per plan. Pricing analysts are the Hierarchy's discount-approval IC layer; the looped-in-for-visibility framing is the canon Hierarchy pattern of formal-but-toothless approval gates.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_channel_conflict_goblin — pricing-friction pairing


### Procurement Clerk

**ID:** `s2_hierarchy_anl_procurement_clerk` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Three quotes were required. Three quotes were received. Two were from vendors with a relationship to the Clerk's manager's previous firm. The Clerk has noted this in the file. The file is, the Clerk confirms, internal.*

**Scene:** Mid-shot. A Hierarchy procurement analyst at a tidy Hierarchy procurement-desk, mid-forties, in a Hierarchy grey blouse over a black skirt, half-moon glasses on a chain. Three folders open in a fan in front of her, each labeled with a different vendor's invented Hierarchy-style code (HIER-VND-001, HIER-VND-002, HIER-VND-003). Her right hand mid-stroke with a fine pen on a comparison spreadsheet; her left hand rests palm-down on the third folder. The desk lamp throws warm amber from one side.

**Mood:** *three quotes required, three quotes received* · *the file is internal* · *comparison spreadsheet mid-stroke* · *half-moon glasses on a chain*

**Palette:** Hierarchy grey blouse + black skirt + warm amber desk-lamp + folder-cream + comparison-spreadsheet pale-blue + half-moon glasses chain pale-silver

**Composition:** Mid-shot three-quarter, Clerk at frame-centre seated, three folders fanned across desk-foreground, lamp at frame-edge

**Notes:** Uncommon. Pairs with Vendor-Mgmt Wraith (Manager) — the Wraith renews the contract, the Clerk runs the procurement that selects the vendor.

**Archetype rationale:** Newly-named per plan. Procurement ICs are the Hierarchy's external-supply IC layer; the careful-internal-noting framing is the canonical Hierarchy procurement signature.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_vendor_mgmt_wraith — procurement-stack pairing


### Project Coordinator

**ID:** `s2_hierarchy_anl_project_coordinator` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Status: GREEN. Risks: NONE IDENTIFIED. Blockers: NONE OUTSTANDING. Notes: project is fully on track. The Coordinator emails this to the executive sponsor at 9:01am every Monday and at no other time.*

**Scene:** Mid-shot. A Hierarchy project coordinator at a Hierarchy project-management workstation, mid-thirties, in a Hierarchy plum cardigan over a black blouse. Two monitors: leftmost shows a Hierarchy project-status dashboard with multiple cards in GREEN; rightmost shows the project's actual blocker-list (long, with several red flags). Right hand mid-click on a SEND button on a status-update compose-window; left hand holds a small Hierarchy paper schedule-printout. Her face is composed, faintly pained.

**Mood:** *Status: GREEN, blockers below* · *9:01am Monday email* · *fully on track per official record* · *composed faintly pained*

**Palette:** Hierarchy plum cardigan + black blouse + cool-cyan dual-monitor + GREEN-status accents + red-flag warning accent on second monitor + warm desk-lamp + Hierarchy crest plum-silver lanyard

**Composition:** Mid-shot front three-quarter, Coordinator at frame-centre seated, two monitors at frame-rear with deliberate visual contrast (left GREEN, right RED-flagged), schedule-printout at chest-foreground

**Notes:** Uncommon. The two-monitor green-vs-red contrast is the Project Coordinator's canonical signature: the official report and the actual state, side-by-side, both visible to the viewer (and only to the viewer).

**Archetype rationale:** Newly-named per plan. Project coordinators are the Hierarchy's status-management IC layer; the canon framing is the dual-truth dashboard.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_burndown_imp — status-distortion pairing


### QA Imp

**ID:** `s2_hierarchy_anl_qa_imp` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *She has filed seventeen bugs. Twelve have been triaged. Nine have been closed as INTENDED BEHAVIOR. The remainder will, the Imp informs you, be addressed as part of a future architectural review.*

**Scene:** Mid-shot. A small Quarchon analyst in a Hierarchy charcoal hoodie zipped halfway over a black t-shirt with a faded Hierarchy QA-team logo, sleeves pushed up, fingerless gloves. Sits cross-legged in a Hierarchy QA-pod task-chair. Two monitors: one showing a bug-tracker queue with seventeen open items, the other showing a screenshot of a UI bug she is mid-annotating with a circle-and-arrow. Her face is sharp, fox-like, faintly grinning. A small empty energy-drink can balanced on the chair-arm.

**Mood:** *INTENDED BEHAVIOR* · *seventeen open bugs* · *circle-and-arrow annotation* · *energy-drink can on chair-arm*

**Palette:** Hierarchy charcoal hoodie + black t-shirt + cool-cyan dual-monitor + warm task-lamp + energy-drink can muted-amber + fingerless leather gloves

**Composition:** Mid-shot front-on, QA Imp at frame-centre cross-legged in chair, two monitors at frame-rear, energy-drink can at chair-arm foreground

**Notes:** Uncommon. Echoes the imp-tier visual language (Process Imp / Burndown Imp / Estimation Goblin) at the analyst tier — sharp features, fingerless gloves, fox-grin.

**Archetype rationale:** Newly-named per plan. QA ICs are the Hierarchy's product-quality layer; the imp framing matches the broader Hierarchy small-mischief archetype while keeping the role recognizable.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Recruiting Coordinator

**ID:** `s2_hierarchy_anl_recruiting_coordinator` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Five rounds. Two panel sessions. One take-home. Three additional culture-fit interviews. The Coordinator schedules each round. The Coordinator has not been able to schedule her own performance review.*

**Scene:** Mid-shot. A Hierarchy recruiting-coordinator analyst at a Hierarchy people-ops workstation, mid-twenties, in a Hierarchy plum cardigan over a soft-cream blouse. Single tall monitor showing a Hierarchy interview-scheduling grid with overlapping calendar-blocks in cool-cyan. Her right hand on a Hierarchy-branded pen mid-stroke on a small printed candidate-tracker; her left hand mid-tap on the calendar-grid. Her face is friendly, composed, with the slight strained patience of someone who has rescheduled the same panel three times.

**Mood:** *five rounds and a take-home* · *calendar overlap cool-cyan* · *candidate-tracker pen-stroke* · *rescheduled the same panel three times*

**Palette:** Hierarchy plum cardigan + soft-cream blouse + cool-cyan calendar-grid + warm desk-lamp + Hierarchy-branded pen muted-silver + candidate-tracker pale-grey

**Composition:** Mid-shot front three-quarter, Coordinator at frame-centre seated, monitor at frame-right, candidate-tracker on desk-foreground

**Notes:** Uncommon. Pairs with Velm Acrith (Director Onboarding) operationally — the Coordinator hires, Velm onboards. Together they bracket the Hierarchy's hiring-pipeline IC layer.

**Archetype rationale:** Newly-named per plan. Recruiting Coordinators are the Hierarchy's hiring-funnel IC layer; the overscheduled-friendly framing is the canonical recruiter signature.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_onboarding_specialist — hiring-pipeline pairing


### Reporting Specialist

**ID:** `s2_hierarchy_anl_reporting_specialist` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *The dashboard refreshes hourly. The dashboard is consulted weekly. The discrepancy is reconciled monthly. The reconciliation is filed quarterly. The filing is reviewed annually.*

**Scene:** Mid-shot. A Hierarchy analyst at a wide multi-monitor reporting station, mid-thirties, in a steel-blue cardigan over a black t-shirt. The three monitors show three Hierarchy dashboards in cool-cyan — KPI grids, trend lines, exception lists — each refreshing live. Both hands rest lightly on the keyboard, one finger mid-tap on the F5 refresh key. His face is tired, calm, focused. A small mug of cold tea on the desk-edge with a faint condensation ring.

**Mood:** *F5 mid-tap* · *three dashboards refreshing* · *the reconciliation filed quarterly* · *cold-tea condensation ring*

**Palette:** Hierarchy steel-blue cardigan + black t-shirt + cool-cyan dashboard glow + warm desk-lamp accent + mug muted-warm + Hierarchy crest plum-silver lanyard

**Composition:** Mid-shot front-on, Specialist at frame-centre seated, three monitors arc behind him at frame-rear, mug at desk-foreground

**Notes:** Uncommon. Pairs operationally with Quarterly Forecaster (Manager) and Metrics Oracle (Director) — the Specialist generates the dashboards the Forecaster forecasts from and the Oracle reads.

**Archetype rationale:** Newly-named per plan. The Hierarchy's data-stack needs an IC-tier dashboard-author; the Specialist grounds the abstract Metrics-Oracle role in a desk-level operator.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_metrics_oracle — data-stack pairing


### Risk-Modeling Analyst

**ID:** `s2_hierarchy_anl_risk_modeler` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *The model says the risk is 4%. The reality says the risk is 4% per attempt, and there will be many attempts. The model is, the Analyst notes, technically correct.*

**Scene:** Mid-shot. A meticulous Hierarchy risk-modeling analyst at a wide Hierarchy risk-pod workstation, late-thirties, in a Hierarchy steel-grey blazer over a black turtleneck. Three monitors: leftmost shows a Monte Carlo simulation graph with a long-tail distribution; middle shows a risk-scoring matrix; rightmost shows a Hierarchy probability-table. Right hand mid-click on a parameter-slider; left hand on chin in thought. Face mid-fifties, calm, precise.

**Mood:** *the model says 4%* · *long-tail distribution* · *many attempts will be made* · *calm precise modeler*

**Palette:** Hierarchy steel-grey blazer + black turtleneck + cool-cyan triple-monitor + warm desk-lamp + Monte-Carlo graph pale-violet long-tail accent + Hierarchy crest plum-silver lanyard

**Composition:** Mid-shot front-on, Analyst at frame-centre seated, three monitors arc behind him, parameter-slider mid-click at frame-right

**Notes:** Uncommon. Pairs with Kragvex VP Operational Risk and Iglarath CISO. The long-tail distribution graph is the Risk Modeler's canonical signature — the menace is in the tail.

**Archetype rationale:** Newly-named per plan. Risk modelers are the Hierarchy's quantitative-risk IC layer; the long-tail-as-canon framing parallels Iglarath's perimeter-breach inevitability.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_vp_ops_risk_kragvex — risk-stack pairing


### Sales Operations Specialist

**ID:** `s2_hierarchy_anl_sales_ops` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Quota allocations approved. Territory boundaries drawn. Comp plan finalized. Comp plan revised. Comp plan finalized again. The Specialist has not slept since Q1.*

**Scene:** Mid-shot. A weary Hierarchy sales-ops analyst at a wide Hierarchy ops-desk, late-twenties, in a Hierarchy slate-blue blazer over a wrinkled white shirt (collar slightly askew). Spread across the desk: three Hierarchy territory maps, a thick comp-plan binder mid-flip, a fresh coffee. His face shows visible fatigue — dark under-eyes, two-day stubble. Right hand mid-flip on the comp-plan binder.

**Mood:** *comp plan finalized again* · *territory maps spread* · *two-day stubble fatigue* · *fresh coffee three deep*

**Palette:** Hierarchy slate-blue blazer + wrinkled white shirt + warm desk-lamp + territory-map cool-grey + comp-plan binder forest-green + coffee muted-amber

**Composition:** Mid-shot three-quarter, Specialist at frame-centre seated, territory-maps fanned across desk-foreground, binder mid-flip in hands at chest-height

**Notes:** Uncommon. The visible fatigue is intentional — sales-ops in the Hierarchy is canonically the most-overworked IC role. Pairs with Kelv'Orth VP Sales operationally.

**Archetype rationale:** Newly-named per plan. Sales ops ICs are the Hierarchy's revenue-engine maintenance layer; the fatigue framing matches the canon Hierarchy 'overwork as power source' (Quarterly Earnings synergy).

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_vp_sales_kelv_orth — sales-stack pairing


### Tax-Compliance Specialist

**ID:** `s2_hierarchy_anl_tax_compliance` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Seventeen jurisdictions. Three transfer-pricing structures. Two reciprocal-treaty exemptions. The position is defensible. The Specialist will defend it. The Specialist has, in fact, already begun.*

**Scene:** Mid-shot. A meticulous Hierarchy tax-compliance specialist at a Hierarchy tax-pod desk, mid-forties, in a Hierarchy charcoal blazer over a Hierarchy plum blouse, half-moon glasses on a chain. Three folders open in a fan, each labeled with a different invented Hierarchy-jurisdiction code. Right hand mid-stroke with a fine pen on a tax-position memo; left hand holds a small Hierarchy treaty-reference book open at chest-height. Two empty Hierarchy tea-mugs visible on a side-counter (not yet cleared).

**Mood:** *seventeen jurisdictions* · *transfer-pricing structures* · *the position is defensible* · *two empty mugs uncleared*

**Palette:** Hierarchy charcoal blazer + plum blouse + warm desk-lamp + jurisdiction-folder cream-and-amber + treaty-book pale-grey + half-moon glasses chain pale-silver

**Composition:** Mid-shot three-quarter, Specialist at frame-centre seated, folder-fan at desk-foreground, treaty-book held at chest-height

**Notes:** Uncommon. Pairs with Mid-Year Adjuster (Manager) and Xeth'Raal CFO. The two uncleared mugs are the canonical Tax Specialist signature — the work is too constant to break for cleanup.

**Archetype rationale:** Newly-named per plan. Tax compliance ICs are the Hierarchy's regulatory-defense IC layer; the seventeen-jurisdiction framing parallels Riri's seventeen-dimension command and Iglarath's seventeen-dimension perimeter.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_cfo_xeth_raal — fiscal-IC pairing


### Training Content Designer

**ID:** `s2_hierarchy_anl_training_content_designer` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *Module 47. Module 48. Module 49. The series will continue. The series will, the Designer notes, never conclude. Conclusions are not the goal. Modules are.*

**Scene:** Mid-shot. A patient Hierarchy training-content designer at a Hierarchy content-pod desk, mid-thirties, in a Hierarchy soft-cream cardigan over a black t-shirt. Single tall monitor showing a Hierarchy training-module authoring interface with module structure cards visible (a sequence of small numbered tiles: 47, 48, 49 — and a faint future-greyed pipeline of 50+). Right hand mid-drag on a module tile; left hand holds a Hierarchy content-style-guide. Her face is calm, focused.

**Mood:** *Module 47, 48, 49* · *modules are the goal, not conclusions* · *module-tile drag mid-action* · *calm focused designer*

**Palette:** Hierarchy soft-cream cardigan + black t-shirt + cool-cyan authoring-interface + warm desk-lamp + content-style-guide forest-green + numbered-tile cool-cyan

**Composition:** Mid-shot front three-quarter, Designer at frame-centre seated, monitor at frame-right showing the module-pipeline, style-guide at chest-foreground

**Notes:** Uncommon. Pairs with Compliance Inquisitor (Director) — the Inquisitor delivers the modules; the Designer authors them. Module 47 is the canonical Hierarchy training in-joke (referenced on the Compliance Inquisitor card too).

**Archetype rationale:** Newly-named per plan. Training content designers are the Hierarchy's compliance-content IC layer; pairs with the Compliance Inquisitor's delivery to complete the training-stack.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_compliance_inquisitor — training-stack pairing


### Travel & Expense Auditor

**ID:** `s2_hierarchy_anl_travel_expense_auditor` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *The receipt is missing. The receipt is invalid. The receipt is in the wrong currency. The traveler will need to refile. The Auditor has, by Q3, three thousand open expense queries.*

**Scene:** Mid-shot. A Hierarchy T&E auditor at a Hierarchy expense-review workstation, late-thirties, in a Hierarchy charcoal blouse over a black skirt. Single tall monitor showing a Hierarchy expense-management grid; on the desk a small physical inbox stacked with photocopied paper receipts (some torn, some faded, some clearly illegible). Right hand mid-stamp with a small REJECTED stamp on a printed expense report; left hand holds a magnifying-glass over a faded receipt.

**Mood:** *three thousand open expense queries* · *REJECTED stamp mid-impact* · *faded receipts under magnifier* · *the receipt is in the wrong currency*

**Palette:** Hierarchy charcoal blouse + black skirt + cool-cyan expense-grid + warm desk-lamp + receipt-paper muted-warm + REJECTED stamp deep-red + magnifier brass accent

**Composition:** Mid-shot front three-quarter, Auditor at frame-centre seated, monitor at frame-rear, paper-inbox at frame-foreground, magnifier in hand at chest-height

**Notes:** Uncommon. Pairs with Procurement Clerk (within-tier) and with Mid-Year Adjuster (Manager) — the T&E function is the Hierarchy's smallest-unit financial-discipline IC layer.

**Archetype rationale:** Newly-named per plan. T&E auditors are the Hierarchy's pettiest-financial-friction IC layer; the canonical signature is the REJECTED stamp + the illegible-receipt magnifier.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_anl_procurement_clerk — fiscal-IC pairing


### UX Researcher Wraith

**ID:** `s2_hierarchy_anl_ux_researcher` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *She conducted thirty interviews. The findings did not align with the roadmap. The findings have been re-prioritized for a future cycle. The interviews are, the Wraith confirms gently, still very valuable.*

**Scene:** Mid-shot. A faintly-translucent Quarchon analyst at a Hierarchy research-pod desk, mid-thirties, in a Hierarchy soft-grey cardigan over a sage-green blouse. Her left hand rests on an open Hierarchy research-binder showing tabbed interview-transcripts; her right hand holds a Hierarchy color-coded sticky-note ready to file. The wall behind her holds a research-affinity board covered in clusters of color-sorted sticky-notes. Her face is patient, slightly resigned.

**Mood:** *thirty interviews, re-prioritized* · *color-sorted sticky-notes* · *translucent patient researcher* · *the findings did not align*

**Palette:** Hierarchy soft-grey cardigan + sage-green blouse + warm research-pod overhead + sticky-note multi-color rainbow + binder forest-green + research-affinity-board cool-grey background

**Composition:** Mid-shot front three-quarter, Wraith at frame-centre seated, affinity-board filling frame-rear, binder open at desk-foreground

**Notes:** Uncommon. Translucency is moderate; sticky-note colors must read as a palette rather than chaos. Pairs with Roadmap Banshee (Manager) — Banshee maintains the dual roadmaps that re-prioritize the Wraith's findings.

**Archetype rationale:** Newly-named per plan. UX Research ICs are the Hierarchy's user-empathy layer; the wraith framing emphasizes the institutional-erasure of inconvenient findings.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_roadmap_banshee — research-vs-roadmap pairing


### Vendor Coordinator

**ID:** `s2_hierarchy_anl_vendor_coordinator` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** uncommon · **Type:** unit

> *He has scheduled the kickoff. He has chased the SOW. He has reminded the vendor of the SLA. He has filed the change-order. He has, in a quiet moment, started looking for a different role.*

**Scene:** Mid-shot. A Hierarchy vendor-coordinator analyst at a Hierarchy ops-pod desk, late-twenties, in a Hierarchy navy polo over a charcoal sweater. Two monitors: leftmost shows a Hierarchy email client mid-compose to a vendor; rightmost shows a Hierarchy SOW document with several yellow highlights. His face is tired, faintly resigned. Right hand on mouse mid-click; left hand cradling a Hierarchy mug at chest-height. A small Hierarchy office-stress-ball sits squashed on the desk.

**Mood:** *chasing the SOW* · *in a quiet moment looking elsewhere* · *yellow-highlighted SOW* · *office-stress-ball squashed*

**Palette:** Hierarchy navy polo + charcoal sweater + cool-cyan dual-monitor + warm desk-lamp + SOW pale-yellow highlights + Hierarchy mug muted-warm + stress-ball pale-blue

**Composition:** Mid-shot front three-quarter, Coordinator at frame-centre seated, two monitors at frame-rear, mug at chest-foreground, stress-ball at desk-edge

**Notes:** Uncommon. Pairs with Vendor-Mgmt Wraith (Manager) — the Wraith renews; the Coordinator runs day-to-day.

**Archetype rationale:** Newly-named per plan. Vendor coordinators are the Hierarchy's day-to-day external-relations IC layer; the squashed-stress-ball is the canonical signature.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_vendor_mgmt_wraith — vendor-stack pairing


---

## Hierarchy of the Damned — Interns (Common, 14)

*14 cards in this section.*

### Calendar-Sync Imp

**ID:** `s2_hierarchy_intn_calendar_sync_imp` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *He resolved the meeting conflict. The resolution created two new conflicts. He resolved those. The Hierarchy's calendar is now, by a generous reading, internally consistent.*

**Scene:** Mid-shot. A small wiry Quarchon intern at a Hierarchy entry-pod desk, twenties, in Hierarchy charcoal vest over a faded grey t-shirt, fingerless leather gloves, ledger-pen behind one pointed ear (matching the Manager-tier imp visual). Single monitor showing a Hierarchy multi-calendar view with overlapping blocks; right hand mid-drag of one block to a new slot; left hand resting on a printed schedule-key. Face: sharp, faintly amused fox-grin.

**Mood:** *two conflicts created from one resolved* · *fingerless gloves entry-tier* · *fox-grin at the calendar* · *internally consistent by generous reading*

**Palette:** Hierarchy charcoal vest + faded grey t-shirt + fingerless leather gloves + cool-cyan multi-calendar view + warm desk-lamp + lanyard plum-silver

**Composition:** Mid-shot front three-quarter, Imp at frame-centre seated, monitor at frame-right with multi-calendar view, mid-drag block in motion

**Notes:** Common. Inherits the imp visual language (fingerless gloves, ledger-pen, fox-grin) at entry-tier — pairs with Estimation Goblin (Manager) on the imp visual lineage.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the calendar-juggling entry-tier role; matches the broader Hierarchy imp archetype.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_calendar_demon — calendar-stack pairing


### Coffee Runner

**ID:** `s2_hierarchy_intn_coffee_runner` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Eleven orders. Eleven names. Eleven specifications. The Runner has memorized them all and, en route, two have been amended. The Runner does not lose orders. The Runner has lost themselves.*

**Scene:** Mid-shot. A swift Hierarchy intern striding through a Hierarchy main-floor corridor, mid-twenties, in Hierarchy charcoal slacks and a dusty-rose dress-shirt rolled to forearms. Carries a Hierarchy-branded cardboard drink-tray with eleven distinct paper cups (each labeled in different hand-marker). Face: focused, mid-stride, slightly out-of-breath.

**Mood:** *eleven orders, eleven labels* · *mid-stride out-of-breath* · *two amended en route* · *drink-tray careful balance*

**Palette:** Hierarchy charcoal slacks + dusty-rose dress-shirt + Hierarchy-branded drink-tray cardboard-warm + corridor cool-cyan + paper-cup multi-warm-tones + lanyard plum-silver

**Composition:** Mid-shot side three-quarter, Runner at frame-centre mid-stride, drink-tray at chest-height in foreground, corridor receding behind

**Notes:** Common. The eleven-cup count is the canon signature — eleven is intentional (matches the Stakeholder Wrangler's eleven podiums; deliberate set-internal echo).

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the entry-tier's-most-visible-tribute archetype.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_stakeholder_wrangler — eleven-count echo


### Data-Entry Drone

**ID:** `s2_hierarchy_intn_data_entry_drone` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Three thousand rows imported. Six hundred required manual cleanup. Two were skipped. The Drone will, at the next opportunity, return to those two.*

**Scene:** Mid-shot. A Hierarchy intern at a Hierarchy data-pod entry-station, mid-twenties, in standard Hierarchy charcoal-and-cream casual. Single tall monitor showing a vast Hierarchy spreadsheet, scrolled to a row near the bottom of three thousand. Right hand on numeric-keypad in mid-keystroke; left hand on a printed Hierarchy import-source document. Face: tired, focused, eyes locked on the screen.

**Mood:** *three thousand rows imported* · *two skipped, will return* · *numeric-keypad mid-keystroke* · *tired focused eyes-locked*

**Palette:** Hierarchy charcoal-and-cream casual + cool-cyan spreadsheet monitor + warm desk-lamp + import-source document pale-grey + lanyard plum-silver

**Composition:** Mid-shot front three-quarter, Drone at frame-centre seated, monitor at frame-right showing vast spreadsheet, import-document at desk-foreground

**Notes:** Common. The visible row-count near three-thousand is the canonical signature; the two-skipped flavor-line should not have a visible counterpart on screen (the menace is in the implication).

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the volume-of-clerical-work entry-tier role.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Document Reviewer

**ID:** `s2_hierarchy_intn_document_reviewer` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Forty pages. Track-changes engaged. Comment count: ninety-eight. None of the comments are substantive. All of them are required. The document will, the Reviewer assures, be released by EOD.*

**Scene:** Mid-shot. A focused Hierarchy intern at a Hierarchy review-pod desk, mid-twenties, in Hierarchy charcoal-and-cream casual. Single tall monitor showing a Hierarchy document with track-changes panel filled with margin-comments in cool-cyan and warm-amber. Right hand mid-comment-add; left hand on a printed Hierarchy review-checklist. Face: mid-twenties focused, eyes slightly red.

**Mood:** *forty pages, ninety-eight comments* · *none substantive, all required* · *track-changes panel cluttered* · *eyes slightly red*

**Palette:** Hierarchy charcoal-and-cream casual + cool-cyan document monitor + track-changes warm-amber + cool-cyan margin-comments + review-checklist forest-green + lanyard plum-silver

**Composition:** Mid-shot front three-quarter, Reviewer at frame-centre seated, monitor at frame-right with track-changes panel visible, review-checklist at desk-foreground

**Notes:** Common. The cluttered margin-comment panel is the canonical signature.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the document-review entry-tier role.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### End-of-Quarter Casualty

**ID:** `s2_hierarchy_intn_eoq_casualty` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Sprint pushed. Deadline held. Story-points delivered. The Casualty has not slept since Tuesday. The Casualty's Q4 PIP, formally initiated this morning, was — the Casualty learns — a foregone conclusion since Q3.*

**Scene:** Mid-shot close. A clearly-exhausted Hierarchy intern slumped at a Hierarchy team-pod desk, late-twenties, in a wrinkled Hierarchy charcoal cardigan over a creased cream t-shirt. Three empty Hierarchy energy-drink cans on the desk. The desk-clock visible reads 03:47. Single laptop showing a Hierarchy sprint-board fully marked DONE in green. The Casualty's head is down on folded arms, eyes closed. A small unopened Hierarchy email notification visible in the corner of the screen, subject-line readable: 'Performance Improvement Plan — Required Meeting'.

**Mood:** *sprint pushed, deadline held* · *03:47 desk-clock* · *PIP email unopened* · *head down on folded arms*

**Palette:** Hierarchy wrinkled charcoal cardigan + creased cream t-shirt + cool-cyan sprint-board DONE + warm desk-lamp + energy-drink cans muted-warm + PIP email subject-line muted-amber + lanyard plum-silver askew

**Composition:** Mid-shot close side, Casualty at frame-centre slumped, laptop at frame-right with sprint-board + PIP email both visible, energy-drink cans on desk-foreground

**Notes:** Common. The PIP-email-while-slumped composition is the canonical End-of-Quarter Casualty signature; the desk-clock at 03:47 echoes the Pivot-Memo Phantom's 4:47pm in inverted form (early-morning, not late-afternoon).

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the Hierarchy's 'overwork as power source' synergy directly — the entry-tier card whose sacrifice fuels the deathwatch / consumption mechanics across S2_HIERARCHY.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_chro_mor_vethic — termination-pipeline pairing
- (intra-set) §s2_hierarchy_dir_q4_ritualist — quarterly-cycle pairing


### Lunch-Order Coordinator

**ID:** `s2_hierarchy_intn_lunch_order_coordinator` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Twenty-three orders. Eight dietary restrictions. Two unstated allergies. One vendor that closed unannounced. The Coordinator's plan B has, of course, been activated since 11:14am.*

**Scene:** Mid-shot. A composed Hierarchy intern at a small Hierarchy ops-pod corner, mid-twenties, in Hierarchy charcoal-and-cream casual. Holds a Hierarchy office-issued tablet displaying a Hierarchy lunch-order spreadsheet with twenty-three rows; a small flagged column shows dietary-restriction icons. Phone wedged between shoulder and ear, mid-call to the backup vendor. Face: focused, faintly grim.

**Mood:** *twenty-three orders, eight restrictions* · *plan B activated 11:14am* · *phone shoulder-wedged* · *focused faintly grim*

**Palette:** Hierarchy charcoal-and-cream casual + cool-cyan tablet display + dietary-icon multi-color cluster + warm corridor light + Hierarchy phone matte-charcoal + lanyard plum-silver

**Composition:** Mid-shot side three-quarter, Coordinator at frame-centre, tablet at chest-height in foreground, phone at shoulder

**Notes:** Common. The shoulder-wedged-phone is the canonical signature; pairs with Office Manager Specter (Analyst) at the entry-tier.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the small-logistics entry-tier role.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_anl_office_manager — logistics-stack pairing


### New Hire

**ID:** `s2_hierarchy_intn_new_hire` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Day one. Three trainings completed. Forty-seven left. Welcome to the Hierarchy. Your seventeen-dimension orientation begins on Wednesday.*

**Scene:** Mid-shot. A bright nervous Hierarchy intern at a fresh Hierarchy onboarding desk, twenties, in stiff-new Hierarchy charcoal-and-cream business-casual, single Hierarchy crest lanyard hanging at chest, brand-new sealed Hierarchy welcome-laptop just opened, fingers hovering over the keyboard. Face: bright, wide-eyed, faintly anxious.

**Mood:** *day one bright nervous* · *three trainings down, forty-seven left* · *stiff-new business-casual* · *fingers hovering over the keyboard*

**Palette:** Hierarchy charcoal-and-cream business-casual + bright onboarding-suite uplight + sealed-laptop branded-pale-cream + Hierarchy crest plum-silver lanyard

**Composition:** Mid-shot front three-quarter, New Hire at frame-centre seated, fresh laptop at desk-foreground

**Notes:** Common. The bright-anxious face is the canonical New Hire signature; pairs with Velm Acrith (Director Onboarding) — Velm hands them the badge, the New Hire has just used it.

**Archetype rationale:** Newly-named per plan. Token-generator at the entry-tier that visualizes the moment-of-arrival; the Hierarchy's 'overwork as power source' synergy starts here.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_dir_onboarding_specialist — onboarding pairing


### Note-Taker

**ID:** `s2_hierarchy_intn_note_taker` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *She captures every action item. She circulates the recap. The recap is acknowledged. The action items are not done. She captures every action item.*

**Scene:** Mid-shot. A focused Hierarchy intern in the corner of a Hierarchy meeting-room, mid-twenties, in Hierarchy charcoal cardigan over a soft-cream blouse. Hunched slightly over a Hierarchy-branded laptop in lap-mode; fingers fast on the keyboard mid-type. A small Hierarchy paper-notebook on the chair-arm with several action-item bullet-points already inked. Face: focused, mid-listen, mid-capture.

**Mood:** *every action item captured* · *the recap acknowledged, not done* · *hunched corner-of-room posture* · *ink-bullet action items*

**Palette:** Hierarchy charcoal cardigan + soft-cream blouse + Hierarchy-branded laptop dark + paper-notebook cream + warm meeting-room overhead + lanyard plum-silver

**Composition:** Mid-shot side three-quarter, Note-Taker at frame-edge of meeting-room, meeting-table partially visible at frame-centre, action-item notebook on chair-arm in foreground

**Notes:** Common. The hunched-corner posture is the canonical signature; the action-item-bullets-ink-already on the side notebook reads as the visual tell.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the institutional-memory entry-tier role.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Onboarding Survivor

**ID:** `s2_hierarchy_intn_onboarding_survivor` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Day forty-seven. Forty-six trainings remain in the queue. The Survivor has, by attrition, become senior to two New Hires and is now expected to mentor them.*

**Scene:** Mid-shot. A slightly-rumpled Hierarchy intern at a Hierarchy team-pod entry-desk, mid-twenties, in Hierarchy charcoal cardigan over a slightly-wrinkled cream blouse. Single laptop showing the Hierarchy training-portal with a long descending list of MODULES TO COMPLETE; visible progress-bar at 17%. Right hand mid-click on the next module; left hand on a Hierarchy mug at chest-height (cold). Face: stoic, tired, faintly amused.

**Mood:** *day forty-seven, forty-six remain* · *17% progress* · *stoic tired faint-amusement* · *now expected to mentor*

**Palette:** Hierarchy charcoal cardigan + wrinkled cream blouse + cool-cyan training-portal + warm desk-lamp + cold-mug muted-warm + lanyard plum-silver

**Composition:** Mid-shot front three-quarter, Survivor at frame-centre seated, training-portal monitor at frame-right showing module-list, mug held at chest-foreground

**Notes:** Common. Pairs with New Hire (within-tier) — the Survivor visualizes the day-47 state; the New Hire visualizes day-1. The 17% progress-bar is the canonical signature.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the early-tenure-attrition archetype.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_intn_new_hire — tenure-progression pairing


### Slack Reactor

**ID:** `s2_hierarchy_intn_slack_reactor` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *:eyes: :raised_hands: :100: :rocket: — by Q3 the Reactor has contributed eight thousand reactions to the Hierarchy chat-channels and approximately three sentences. Both metrics, the Reactor notes, are tracked.*

**Scene:** Mid-shot. A focused Hierarchy intern at a small Hierarchy entry-pod desk, mid-twenties, in Hierarchy charcoal-and-cream business-casual. Single laptop monitor showing a Hierarchy chat-channel scrolling with messages and a fan of small emoji-reactions in cool-cyan and warm-amber. Right hand mid-click on a reaction; left hand poised over a different message. Face: contented, eyes flicking between channels.

**Mood:** *eight thousand reactions, three sentences* · *emoji-fan cool-and-warm* · *contented flick-eye* · *both metrics tracked*

**Palette:** Hierarchy charcoal-and-cream casual + cool-cyan chat monitor + warm-amber emoji-reaction accents + warm desk-lamp + lanyard plum-silver

**Composition:** Mid-shot front three-quarter, Reactor at frame-centre seated, monitor at frame-right with reaction-fan visible

**Notes:** Common. The reaction-fan composition is the Reactor's canon signature — visible cluster of cool-cyan + warm-amber emoji-reactions reads as the working-vocabulary of the role.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the chat-engagement-as-presence archetype.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


### Stand-Up Lurker

**ID:** `s2_hierarchy_intn_stand_up_lurker` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Yesterday: documentation. Today: documentation. Blockers: none. The Lurker has not been called on for three weeks and is, on balance, content.*

**Scene:** Mid-shot. A quiet Hierarchy intern at the back of a Hierarchy team-pod stand-up half-circle, mid-twenties, in standard Hierarchy charcoal cardigan over a grey t-shirt with the Hierarchy crest faintly visible. Stands slightly apart from the half-circle, holding a Hierarchy Hierarchy-branded mug at chin-height as cover. Face: politely attentive, eyes slightly elsewhere.

**Mood:** *back of the half-circle* · *mug as cover* · *not called on for three weeks* · *politely-attentive eyes elsewhere*

**Palette:** Hierarchy charcoal cardigan + grey crested t-shirt + cool team-pod overhead + warm corridor light through doorway behind + Hierarchy mug muted-warm + lanyard plum-silver

**Composition:** Mid-shot side three-quarter, Lurker at frame-edge, half-circle of pod-members at frame-centre, mug at chin-height as visual blocker

**Notes:** Common. Pairs with Stand-Up Wraith (Manager) — the Wraith runs the round; the Lurker survives it.

**Archetype rationale:** Newly-named per plan. Token-generator that visualizes the meeting-attendance survivor archetype; common in every Hierarchy team-pod.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_mgr_stand_up_wraith — meeting-survivor pairing


### Status-Update Drone

**ID:** `s2_hierarchy_intn_status_update_drone` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Yesterday: gathered statuses. Today: gathered statuses. Blockers: those who do not respond to the status request. Plan: gather statuses.*

**Scene:** Mid-shot. A patient Hierarchy intern at a Hierarchy ops-pod desk, mid-twenties, in Hierarchy charcoal-and-cream casual. Single laptop showing a Hierarchy status-collation document with seven rows of contributors: three filled, three with 'AWAITING' in muted-amber, one with 'NO RESPONSE' in soft-red. Right hand mid-keystroke composing a follow-up DM; left hand resting on the desk. Face: patiently expectant.

**Mood:** *AWAITING and NO RESPONSE* · *the follow-up DM* · *patiently expectant* · *seven rows, three filled*

**Palette:** Hierarchy charcoal-and-cream casual + cool-cyan status-document + AWAITING muted-amber + NO RESPONSE soft-red + warm desk-lamp + lanyard plum-silver

**Composition:** Mid-shot front three-quarter, Drone at frame-centre seated, monitor at frame-right with status-document visible, follow-up DM compose-window in foreground

**Notes:** Common. The seven-row status table with the three-state breakdown is the canonical signature.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the status-collection entry-tier role; pairs with Project Coordinator (Analyst) — the Drone gathers, the Coordinator presents.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_anl_project_coordinator — status-stack pairing


### Survey-Form Drone

**ID:** `s2_hierarchy_intn_survey_form_drone` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *The pulse-survey is open. The pulse-survey is reminded. The pulse-survey is closed. The results are aggregated. The results show no concerns. The pulse-survey is open.*

**Scene:** Mid-shot. A patient Hierarchy intern at a Hierarchy people-ops entry-pod desk, mid-twenties, in Hierarchy charcoal-and-cream casual. Single tall monitor showing a Hierarchy pulse-survey admin panel with a list of recurring surveys and their states (OPEN / REMINDED / CLOSED / AGGREGATING) in muted-amber and cool-cyan. Right hand mid-click on the SCHEDULE NEXT WAVE button; left hand on a small Hierarchy survey-template printout. Face: politely-engaged.

**Mood:** *pulse-survey open / reminded / closed* · *no concerns reported* · *SCHEDULE NEXT WAVE mid-click* · *politely-engaged composure*

**Palette:** Hierarchy charcoal-and-cream casual + cool-cyan survey-admin panel + state-indicator muted-amber accents + warm desk-lamp + survey-template pale-cream + lanyard plum-silver

**Composition:** Mid-shot front three-quarter, Drone at frame-centre seated, monitor at frame-right with survey-admin visible, template at chest-foreground

**Notes:** Common. The state-indicator column is the canonical signature; pairs with Internal Communications Analyst (within Hierarchy comms-stack) — the Drone runs the survey, the Analyst drafts the recap-narrative.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the engagement-survey entry-tier role.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_anl_internal_comms — comms-stack pairing


### Ticket Triager

**ID:** `s2_hierarchy_intn_ticket_triager` · **Set:** S2_HIERARCHY · **Faction:** new_babylon · **Rarity:** common · **Type:** unit

> *Eighty incoming tickets. Twelve assigned. Sixty-eight reclassified as 'documentation gap'. The Triager has documented the gap. The documentation has been categorized as 'pending review'.*

**Scene:** Mid-shot. A Hierarchy intern at a Hierarchy support-pod desk, mid-twenties, in Hierarchy charcoal-and-cream casual. Single tall monitor showing a Hierarchy ticket-queue with eighty rows visible; many rows tagged with a small 'DOCUMENTATION GAP' label in muted-amber. Right hand mid-click on the bulk-tag dropdown; left hand on a Hierarchy support-playbook printout. Face: focused, mildly weary.

**Mood:** *eighty incoming tickets* · *documentation gap as bulk-tag* · *playbook printout at hand* · *focused mildly weary*

**Palette:** Hierarchy charcoal-and-cream casual + cool-cyan ticket-queue + DOCUMENTATION GAP muted-amber tag + warm desk-lamp + playbook printout pale-grey + lanyard plum-silver

**Composition:** Mid-shot front three-quarter, Triager at frame-centre seated, ticket-queue monitor at frame-right, playbook printout at chest-foreground

**Notes:** Common. The bulk-tag dropdown mid-click is the canonical signature.

**Archetype rationale:** Newly-named per plan. Token-generator visualizing the support-queue triage entry-tier role.

**Lore citations:**
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation


---

## Act 1 — The Memoir / The Signal (4)

*4 cards in this section.*

### First Witness

**ID:** `act1_exclusive_rare_first_witness` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** unit

> *Two narrators, one transmission, one player. The First Witness is the moment a player realizes that Elara and the Human have, all this time, been narrating the same Signal from opposite sides of the same room.*

**Scene:** Wide low-angle composition. A simple windowless meditation-room at the substrate layer, two facing wooden chairs at the centre of the room with a small cool-cyan glyph-rune burning on the floor between them. The left chair is occupied by Elara — mid-thirties, dark hair pulled back, wearing soft-cream substrate-tunic, her hands folded in her lap, eyes closed mid-listen. The right chair is occupied by the Human — late-thirties, cropped dark hair, deep-violet substrate-tunic, hands folded identically, eyes also closed. The two figures are mirrored in posture, neither acknowledging the other. The Signal-glyph between them pulses three-note in slow rhythm. The chamber's lighting comes from the glyph itself, throwing both figures in cool-cyan undertone with warm-amber rim from a single wall-sconce behind each chair.

**Mood:** *two narrators, one Signal, mirrored posture* · *First Witness as the recognition moment* · *neither acknowledges the other* · *three-note glyph pulse on the floor*

**Palette:** Substrate cool-cyan + soft-cream Elara tunic + deep-violet Human tunic + warm-amber wall-sconce rims + glyph-rune cool-cyan + windowless meditation-room muted-grey walls

**Composition:** Wide low-angle front-on, both figures at frame-centre seated in mirrored chairs, glyph between them at floor-foreground, wall-sconces visible at frame-edges behind each chair

**Notes:** Rare unit. Elara and the Human's existing canon designs apply (preserve their established appearances from any prior art). The mirrored posture is the canonical First Witness signature; the deliberate non-acknowledgment is the visual key — they are both witnessing the SAME Signal but not yet each other. Lore boundary: this card may NOT depict the Witnesses as having met (the meeting is Act 4 / The Revelation canon, post-Bond 75 — ALL_ACTS_ROADMAP.md). They are simultaneously present but not in contact.

**Archetype rationale:** Direct visualization of the dual-narrator system that frames the entire campaign (Elara + Human, established at game-start). Anchored to the Act 1 introduction-of-narrators canon.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act1 (dual-narrator introduction)
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression baseline / Bond 0-30
- apps/shared/elaraVoManifest.json (Elara canonical voice anchor)
- apps/shared/humanVoManifest.json (Human canonical voice anchor)


### Substrate Static

**ID:** `act1_exclusive_rare_substrate_static` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** spell

> *Between the three notes, there is silence. Between the silences, there is static. The static is the carrier wave. The Signal rides the static. The Memoirist learns to hear the carrier first.*

**Scene:** Mid-shot environmental. A thin section of the substrate-layer rendered as a slow horizontal field of fine cool-grey static — particles densely packed, drifting downward at slow constant speed, with three faint vertical bright-cool-cyan threads barely visible through the static (the carrier-wave threads on which the Signal rides). The field has no figures, no architecture. At the bottom-third of the frame: a single dark obsidian rounded stone (about the size of a curled hand) sitting on an unseen surface, the stone's upper face faintly inscribed with the same three-note glyph as The Signal pillar. The stone is the only solid object in frame; everything else is field-static-and-thread.

**Mood:** *carrier wave beneath the Signal* · *three threads barely visible through static* · *the Memoirist hears the carrier first* · *obsidian stone, only solid object*

**Palette:** Cool-grey substrate static + faint cool-cyan carrier-wave threads + obsidian stone deep-black + warm-amber three-note glyph etched on stone + sourceless dim ambient

**Composition:** Mid-shot environmental front-on, static field filling upper two-thirds of frame, obsidian stone at lower-third centre

**Notes:** Rare spell. The deliberate near-absence of figures and architecture is the canonical Substrate Static signature — this card visualizes the medium, not the message. Three carrier-threads must be VERY faint (must read as 'almost not there') so the artist's instinct to brighten them does not break the framing. The obsidian stone is the player's anchor in the field; it should read as touchable.

**Archetype rationale:** Companion piece to The Signal (mythic) — the Signal is the message, Substrate Static is the medium. Together the two cards form the Act 1 'how the campaign hears itself' visual framing.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act1
- docs/built/LORE_BIBLE.md §Substrate layer
- (intra-set) §act1_exclusive_mythic_the_signal — companion-piece pairing


### The Signal

**ID:** `act1_exclusive_mythic_the_signal` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Beneath every transmission, beneath every recorded sound, beneath the silence between recordings — a hum. Three notes, repeating, in an interval no instrument plays. The Signal was always there. Hearing it was the first step.*

**Scene:** Wide environmental composition. A vast dimly-lit transmission-chamber at the substrate layer of reality — the chamber's walls are translucent and slightly out-of-phase, reading as 'underneath' the world rather than within it. Centre of frame: a single tall narrow obsidian-and-chrome transmission-pillar reaching from floor to ceiling, its surface engraved with a slow-pulsing cool-cyan three-note glyph-pattern that propagates upward in time with the Signal's repetition. Around the pillar's base: a thin shallow pool of mirror-still mercury, reflecting the pillar but ALSO reflecting a second pillar that does not exist in the chamber (the Signal's source somewhere off-plane). The chamber's lighting is sourceless and dim, with a faint warm-amber halo at the pillar's mid-height where the three-note glyph repeats most insistently. NO human figures.

**Mood:** *the hum that was always there* · *three notes in an interval no instrument plays* · *substrate beneath the recordings* · *second pillar reflected, not present*

**Palette:** Substrate dim cool-cyan + obsidian-and-chrome transmission-pillar + cool-cyan three-note glyph propagation + warm-amber pillar halo + mirror-still mercury pool + sourceless ambient

**Composition:** Wide environmental front-on, transmission-pillar at frame-centre filling vertical axis, mercury pool at lower-third reflecting pillar + reflecting impossible second pillar at frame-edge

**Notes:** Mythic spell card. The mercury-pool's impossible second reflection is the canonical Signal signature — the Signal has TWO sources, only one of which is visible in any given chamber. Three-note glyph-pattern must read as a notation/marking but should NOT match any real-world musical notation. Substrate framing is essential: this is BENEATH reality, not within it.

**Archetype rationale:** Anchored to the Act 1 'Twelve Steps / The Signal' arc canon (narrativeActs.ts Act 1, ALL_ACTS_ROADMAP.md). The Signal IS the foundational memoir-trigger for the whole campaign; a mythic exclusive grounds it as a card the player can hold once they have completed Act 1 and unlocked the substrate layer.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act1
- docs/built/ALL_ACTS_ROADMAP.md §Act 1 — The Twelve Steps / The Signal
- docs/built/LORE_BIBLE.md §Substrate layer (foundational reality)


### The Twelve-Step Inheritance

**ID:** `act1_exclusive_epic_twelve_step_inheritance` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** epic · **Type:** artifact

> *Step one: hear the Signal. Step two: write it down. Step three: do not assume the writing is the Signal. Elara's first lesson, recorded in margin-ink on the back of a memorial notice. The remaining nine steps are still being recovered.*

**Scene:** Mid-shot top-down. A small private archival desk in a Hierarchy-adjacent reading room. The desk holds a single delicate black-and-cream Hierarchy-style memorial notice (announcing a generic worker's separation, deliberately blurred name) flipped to its blank back, on which twelve handwritten steps have been inked in deep-violet calligraphy. Steps 1-3 are fully written and legible from above; steps 4-12 are partially completed — some inked, some only ghost-pencilled, some marked with only a small symbol (a glyph echoing the Signal's three-note pattern). A small ornate brass desk-pen rests across the upper edge of the page; the pen's nib is wet. Beside the page: a single dried memorial flower (asphodel — echoing the Hierarchy HR canon).

**Mood:** *twelve steps, three completed* · *calligraphy in margin-ink* · *the writing is not the Signal* · *asphodel as inheritance*

**Palette:** Black-and-cream memorial notice + deep-violet calligraphy + warm desk-uplight from below + dried-asphodel pale-grey-violet + brass desk-pen warm-amber + reading-room muted background

**Composition:** Mid-shot top-down, memorial-notice at frame-centre, brass pen across upper edge, asphodel flower at frame-right

**Notes:** Epic artifact. The page is the artifact — not the pen. Steps 1-3 must be readable on close inspection; steps 4-12 must read as in-progress. Asphodel echoes the Hierarchy HR canon (Mor'Vethic / Nessith / Performance-Review Wraith all carry asphodel motifs); the deliberate echo signals that Elara's inheritance crosses set-boundaries.

**Archetype rationale:** The Twelve-Step framing is canonical Act 1 (narrativeActs.ts). Visualizing it as a partial inheritance — the player has only steps 1-3 — gates the artifact as something the player completes through play.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act1 (Twelve Steps framing)
- docs/built/ALL_ACTS_ROADMAP.md §Act 1 / The Memoir as inheritance
- (intra-set) §s2_hierarchy_chro_mor_vethic — asphodel motif precedent


---

## Act 2 — The Whisper / The Engineer's Bench (4)

*4 cards in this section.*

### Bond 60 — The Silent Listening

**ID:** `act2_exclusive_rare_bond_60_silence` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** spell

> *By Bond 60, neither Elara nor the Human will fill the silence. Both have learned that the silence is the conversation. The player learns this with them. The card is the moment of learning.*

**Scene:** Wide environmental composition. The substrate meditation-room from the First Witness card (Act 1) — same two facing wooden chairs, same windowless room — but TIME-SHIFTED. The Signal-glyph between the chairs has FADED from cool-cyan into a faint warm-cream (the Signal still pulses but now the glyph is barely-luminous; the listening has stilled the brightness). Both chairs are now occupied: Elara left in soft-cream substrate-tunic, Human right in deep-violet substrate-tunic, both seated, eyes open, hands folded — and BOTH facing slightly toward the centre of the room, toward each other. They have not yet met (lore boundary: meeting is Act 4) but they are now facing the meeting-direction. Neither speaks. The room's lighting is fully soft warm-cream.

**Mood:** *Bond 60 — silence as conversation* · *glyph faded from cyan to cream* · *chairs angled toward centre* · *neither has met, both face meeting-direction*

**Palette:** Substrate warm-cream + soft-cream Elara tunic + deep-violet Human tunic + faded warm-cream glyph + soft warm-cream sconce-light + windowless meditation-room muted-grey walls

**Composition:** Wide environmental front-on, both figures at frame-centre seated in mirrored-toward-centre chairs, faded glyph between them at floor-foreground

**Notes:** Rare spell card. Direct visual sequel to act1_exclusive_rare_first_witness. The chair-angle change is the canonical Bond 60 signature — at Bond 0-30 (First Witness) chairs face away from each other; at Bond 60 chairs are angled toward the centre but the figures still do not meet eyes. Glyph-color shift cool-cyan → warm-cream visualizes the listening-deepening. Lore boundary STRICT: the figures may face each other's direction but MUST NOT make eye contact.

**Archetype rationale:** Bond 60 is canonical Act 2 (ALL_ACTS_ROADMAP.md §Bond progression). The Silent Listening visualizes the canonical Act 2 milestone (silent VO at Bond 60) as a card the player can hold once they have reached that bond.

**Lore citations:**
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 60 silent-VO milestone
- apps/shared/tcg-core/story/narrativeActs.ts:Act2
- (intra-set) §act1_exclusive_rare_first_witness — visual sequel framing


### Conspiracy of Two

**ID:** `act2_exclusive_rare_conspiracy_of_two` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** unit

> *Two narrators, neither yet trusting the other, both quietly trusting the player. The Conspiracy is small — one shared secret, one withheld doubt. By Bond 60 the secret is named. By Bond 75, it is acted on.*

**Scene:** Mid-shot composition. The substrate-layer rendered as a small tea-room at twilight — a low oak table, two cushion-seats, a single small lantern on the wall. On the table: a Hierarchy-style notebook open between the two seats, a single cup of tea steaming centre-table, and a small key (small enough to palm) resting at the notebook's open spine. The two seats are occupied — Elara at left, Human at right — both leaning slightly forward, eyes lowered to the notebook. Their hands are NOT touching but are POSITIONED so that if either reached, the other's hand is just within reach (deliberate near-touch composition). Both are mid-whisper at the notebook, NOT looking at each other.

**Mood:** *near-touch hands not touching* · *small key as the small secret* · *Conspiracy of Two whispered to the notebook* · *Bond 75 acted-on yet to come*

**Palette:** Substrate twilight cool-grey + oak table warm-brown + soft-cream Elara tunic + deep-violet Human tunic + steaming tea warm-amber + lantern warm-amber wall-glow + Hierarchy-notebook cream

**Composition:** Mid-shot front-on, low oak table at frame-foreground centre, both figures seated leaning toward table, hands in near-touch composition over notebook

**Notes:** Rare unit. Lore boundary: this card is in Act 2 — the Witnesses STILL do not meet eyes (canon: Act 4 meeting). The near-touch hand composition is the canonical Conspiracy-of-Two signature; the deliberate tension of 'about to' is the visual key. The small key on the notebook is the conspiracy's literal small-secret prop; do NOT make the key elaborate.

**Archetype rationale:** The Conspiracy-of-Two is canonical Act 2 narrative framing — the dual-narrator bond becomes a shared private project. Visualizing it as a unit-card grounds the bond-mechanic in a recognizable beat.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act2 (dual-narrator conspiracy framing)
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 30-60 (conspiracy formation)
- (intra-set) §act1_exclusive_rare_first_witness — narrator-pair canon


### The Engineer's Bench (In Absentia)

**ID:** `act2_exclusive_epic_engineers_bench` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** epic · **Type:** structure

> *Tools laid out. Project mid-disassembly. A half-finished schematic. A cup of tea cooled to room temperature. The Engineer is not here. The Engineer was here. The Engineer will be here. The Bench is what remains in the meantime.*

**Scene:** Mid-shot top-three-quarter on a long oak workbench in a dim Hierarchy-adjacent workshop. The bench holds, left to right: a row of precision Hierarchy hand-tools laid out in neat order; a partially-disassembled brass-and-obsidian device of indeterminate function (parts sorted carefully on a clean cloth); a folded leather schematic-wallet open to a hand-drawn diagram with arrows and queries pencilled in the margin; an enamel mug holding cold tea, faint condensation-ring on the bench. A single overhead lamp throws the bench in warm amber from above. NO figure is at the bench; the chair is empty. A Hierarchy-style coat hangs on a hook on the wall behind the bench (the coat reads as recently-worn but currently-empty).

**Mood:** *Engineer was here, will be here* · *tools in neat order, project mid-disassembly* · *tea cooled to room temperature* · *coat recently-worn, currently-empty*

**Palette:** Oak workbench warm-brown + brass tools warm-amber + obsidian device deep-black + warm overhead lamp-cone + cool dim workshop background + Hierarchy coat charcoal-and-cream

**Composition:** Mid-shot top-three-quarter on bench, all bench items visible left-to-right across frame, empty chair partially visible at frame-foreground left, coat-hook visible on background wall

**Notes:** Epic structure. Critical lore boundary: the Engineer is NOT visible. The Engineer's hidden-variable identity is an Act 4-5 reveal and must not be foreshadowed here. The bench, the tools, the device, the schematic, the tea, the coat — all signal occupation without disclosure. Device must read as 'unfamiliar but plausible'; do NOT design it to evoke any specific real-world or canon-character technology.

**Archetype rationale:** Anchored to the Act 2 'Engineer's Bench' canon — the Bench is the visible artifact of the unseen craftsperson. Visualizing the Bench as a structure-card grounds the campaign's introduction-of-crafting in a recognizable object.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act2 (Engineer's Bench framing)
- docs/built/ALL_ACTS_ROADMAP.md §Act 2 / Crafting unlock
- docs/built/LORE_BIBLE.md §Engineer (in-absentia framing only — identity reveal is Act 4-5 canon and EXCLUDED here)


### The Whisper

**ID:** `act2_exclusive_mythic_the_whisper` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Not a transmission. Not a signal. A thing said quietly in the room next to yours, by someone you cannot see, in a language you have just begun to recognize. The Whisper is what the Memoir starts to do once you have started listening back.*

**Scene:** Wide environmental composition. The substrate-layer rendered as a long thin corridor at twilight, lit only by warm-amber sconces every twenty feet. The corridor's left wall is solid; the corridor's right wall is the THIN-WALL — visibly translucent, slightly out-of-phase, behind which the silhouette of a SECOND CORRIDOR runs parallel. In the second corridor, a figure stands at mid-distance, facing AWAY from the viewer — clearly a person, clearly speaking, but the body is rendered ONLY in silhouette and the speech is rendered ONLY as a faint cool-cyan exhale-mist drifting from where their mouth would be, mist that propagates THROUGH the thin-wall toward the viewer's corridor and dissipates at floor-level on the viewer's side. NO faces visible. The viewer's corridor is empty.

**Mood:** *the Memoir starts to do something back* · *thin-wall translucent, parallel corridor* · *exhale-mist crossing through the wall* · *silhouette only, no face*

**Palette:** Substrate twilight cool-grey + warm-amber sconce-light every twenty feet + thin-wall pale-cyan translucency + cool-cyan exhale-mist + silhouette deep-charcoal + sourceless dim ambient

**Composition:** Wide environmental side-on, viewer's corridor at frame-foreground extending into background depth, parallel corridor visible through thin-wall at frame-right, silhouette figure at frame-right mid-distance

**Notes:** Mythic spell card. The thin-wall and the silhouette are the canonical Whisper signature. Critical lore boundary: the silhouette MUST be deliberately ambiguous — it cannot read as Elara, the Human, or any named character; it is the WHISPER itself, anthropomorphized just enough to register as 'someone'. Exhale-mist is the only audible-rendered element.

**Archetype rationale:** Anchored to the Act 2 'Engineer's Bench / The Whisper' arc canon (narrativeActs.ts Act 2, ALL_ACTS_ROADMAP.md). Act 2 deepens the Memoir's listening relationship from one-way reception to two-way exchange; the Whisper visualizes that turning-point as a card.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act2
- docs/built/ALL_ACTS_ROADMAP.md §Act 2 — The Engineer's Bench / The Whisper
- docs/built/LORE_BIBLE.md §Substrate layer (parallel-corridor framing)


---

## Act 3 — The Offer / Eyes in the Dark (4)

*4 cards in this section.*

### Ith'Rael Scouting Party

**ID:** `act3_exclusive_epic_ithrael_scouts` · **Set:** ACT_EXCLUSIVES · **Faction:** new_babylon · **Rarity:** epic · **Type:** unit

> *Three Ith'Rael at the threshold. They do not breach. They do not even approach. They observe — at exactly the distance from which observation cannot be mistaken for intent. The Hierarchy has been here for hours.*

**Scene:** Mid-shot composition. The substrate-edge of the campaign-world rendered as a misted twilight ridge-line. At mid-distance on the ridge: three Hierarchy Ith'Rael scouts in matching dark-charcoal-and-rust scout-armor — slim helmeted figures, faces concealed by visor-masks tinted with faint Hierarchy crimson, each carrying a slim Hierarchy field-instrument (one a recording-rod, one a small folded mapping-board, one a long-form spotting-scope). The three are spaced at irregular intervals along the ridge — deliberate non-formation, each holding STILL in mid-observation pose. Faint Hierarchy crimson ambient glow on their visor-edges. The mist between viewer and ridge reads as substrate-fog (not weather).

**Mood:** *three Ith'Rael at exactly observing-distance* · *non-formation deliberately spaced* · *the Hierarchy has been here for hours* · *visors tinted faint crimson*

**Palette:** Substrate twilight cool-grey + dark-charcoal-and-rust scout-armor + faint Hierarchy crimson visor-tint + misted-ridge muted-grey + Hierarchy field-instrument matte-black + sourceless dim ambient

**Composition:** Mid-shot composition, three figures at frame-mid-distance arrayed along ridge-line at irregular intervals, mist-foreground in lower-third, ridge-and-sky background

**Notes:** Epic unit. The non-formation spacing is the canonical Ith'Rael Scouts signature — deliberate, observed, professional. Visor-mask tinting must read as Hierarchy crimson but FAINT (these are scouts, not officers; the colour signals affiliation without announcing presence). Field-instruments must read as observation-tools, never weapons (lore boundary: Ith'Rael scouts in Act 3 are reconnaissance only).

**Archetype rationale:** Anchored to canon: Ith'Rael scouts are the Hierarchy's formal entry-point in Act 3 (DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md). Visualizing them at observing-distance is the Act 3 turn-point made tangible — the Hierarchy has been watching since before the player noticed.

**Lore citations:**
- docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md §Ith'Rael scouts (Act 3 entry)
- apps/shared/tcg-core/story/narrativeActs.ts:Act3
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation (Hierarchy intelligence framing)


### Soul Map — First Calibration

**ID:** `act3_exclusive_rare_soul_map_calibration` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** artifact

> *Twelve sectors observable. Three sectors decoded. Nine still scrambled. The Soul Map activates by listening, not by looking. The first calibration is the longest. The remaining ones are, the Engineer's notes assure, easier.*

**Scene:** Mid-shot top-down. A small alchemist's-style work-table at the substrate layer holding a single circular Soul Map — a brass-edged disc about the size of a dinner plate, its surface a translucent obsidian sheet on which TWELVE sector-divisions are etched in fine cool-cyan glyph-lines. Three of the twelve sectors are visibly DECODED (their glyphs sharp, readable, with small annotated tags drawn beside in deep-violet ink — pencilled in the Engineer's hand). The other nine sectors are scrambled-cyan static, the glyph-lines blurred and shifting. Beside the Map: a thin field-notebook open to a calibration-procedure page. A small obsidian tuning-rod rests across the Map's top, the rod's tip pointing at the boundary between decoded and scrambled sectors. NO figure visible at the table.

**Mood:** *twelve sectors, three decoded* · *calibration by listening, not looking* · *Engineer's hand on the annotations* · *tuning-rod at the boundary*

**Palette:** Brass-edged Soul Map + translucent obsidian disc + cool-cyan glyph-lines + scrambled-cyan static (nine sectors) + deep-violet annotation-ink (Engineer's hand) + warm field-notebook cream + warm work-table uplight

**Composition:** Mid-shot top-down on work-table, Soul Map at frame-centre, field-notebook at frame-left, tuning-rod across Map top-edge

**Notes:** Rare artifact. The twelve-sector / three-decoded ratio is the canonical Soul Map First Calibration signature — Act 3 is when the Map becomes USEFUL but still remains mostly-encrypted. Engineer's annotation-ink is in deep-violet (matching The Twelve-Step Inheritance from Act 1) — same hand, signal of continuity. Lore boundary: do NOT decode any of the nine scrambled sectors visually — those are Acts 4-7 unlock content.

**Archetype rationale:** Anchored to canon: the Soul Map activation is Act 3 (DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md). Visualizing the partial calibration is the Act 3 turn-point made into an artifact-card the player can hold across the act-arc.

**Lore citations:**
- docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md §Soul Map (Act 3 activation)
- apps/shared/tcg-core/story/narrativeActs.ts:Act3
- (intra-set) §act1_exclusive_epic_twelve_step_inheritance — same Engineer's-hand ink continuity


### The Offer

**ID:** `act3_exclusive_mythic_the_offer` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Three doors. Three signatures already drafted. Three lives the Memoirist might still live. The Hierarchy did not bring the offer — the Hierarchy noticed the offer had always been there and brought the contract.*

**Scene:** Wide environmental composition. A vast ceremonial threshold-chamber at the substrate layer — a circular stone floor inscribed with three concentric rings, three tall stone doorframes spaced equidistantly around the chamber's circumference. The LEFT doorframe glows soft signal-green (Insurgency); the CENTRE doorframe glows pure-cool-cyan (Empire / New Babylon authority); the RIGHT doorframe glows deep-crimson with rust-red veins (Hierarchy). At the chamber's centre: a low obsidian altar holding a single open Hierarchy contract-folio with three distinct signature-lines visible (each line marked with the same Memoirist's name — already drafted on all three). A Hierarchy-style ceremonial pen rests across the folio. NO figures present in the chamber — the choice is the player's, and the chamber renders as deliberately empty.

**Mood:** *three doors, three drafted signatures* · *the contract was always there* · *Hierarchy noticed first* · *empty chamber awaiting choice*

**Palette:** Substrate stone-grey chamber + signal-green Insurgency doorframe + cool-cyan Empire doorframe + deep-crimson-and-rust Hierarchy doorframe + obsidian altar + warm-amber pen catching faint light

**Composition:** Wide environmental front-on, three doorframes arranged 120-degrees apart on chamber circumference, central altar at frame-foreground with open folio + pen, three concentric ring-floor visible

**Notes:** Mythic spell card. The three-doorframe color-coding is the canonical Three-Path signature — colors must match the established faction palettes (Insurgency green, Empire/New Babylon cyan, Hierarchy crimson-and-rust). The drafted-signatures-already on all three lines is the Offer's lore-key: the player IS being chosen, not just choosing. The deliberate emptiness is essential: this is the moment of decision, not the consequence.

**Archetype rationale:** Direct visualization of the Act 3 Loyalty Pledge canonical three-path choice (plan §5 Faction commitment, narrativeActs.ts Act 3, ALL_ACTS_ROADMAP.md). The Offer is the most-significant single beat of Act 3; mythic-tier ensures it lands as a face-card moment.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act3
- docs/built/ALL_ACTS_ROADMAP.md §Act 3 — Eyes in the Dark / The Offer
- docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md §Loyalty Pledge / three-path choice
- /root/.claude/plans/do-a-full-an-stateful-quill.md §5 Faction commitment


### Three-Path Crossroads

**ID:** `act3_exclusive_rare_three_path_crossroads` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** spell

> *Insurgency. Empire. Hierarchy. Each path is a different price; each path is a different kind of victory; each path is, in its own way, a kind of refusal.*

**Scene:** Wide environmental composition. A wide stone crossroads at substrate-twilight with three diverging paths radiating outward from the centre point. The LEFT path leads into a forest of dim signal-green (Insurgency wilderness); the CENTRE path leads up a slope toward a pure-cool-cyan tower-spire on the horizon (Empire / New Babylon citadel); the RIGHT path leads down into a deep-crimson valley lit by Hierarchy rust-red sconces. Centre of frame: a single tall WAYMARKER stone with three engraved arrows, each arrow's etching glowing faintly in its respective path's color. NO figure is at the crossroads; a single set of footprints stops at the waymarker — the player's footprints, recorded but not yet committed. The sky is even-twilight across all three directions; no path is yet brighter than the others.

**Mood:** *three paths, three prices, three refusals* · *footprints stop at the waymarker* · *no path yet brighter than the others* · *even-twilight sky, choice not yet made*

**Palette:** Substrate twilight stone-grey + signal-green Insurgency forest + cool-cyan Empire tower-spire + deep-crimson Hierarchy valley + waymarker arrows three-color etched + sourceless ambient

**Composition:** Wide environmental from low-angle behind the waymarker, three paths radiating outward into background, footprints at waymarker base

**Notes:** Rare spell card. Companion to The Offer (mythic) at the rare tier — The Offer is the chamber of decision; Three-Path Crossroads is the moment of approach. The footprints-stopping-at-the-waymarker is the canonical Crossroads signature; visualizes the player's pause before commitment. Color matching with The Offer's three doorframes is intentional (set-internal cross-reference).

**Archetype rationale:** Companion-piece to The Offer (mythic). The Offer is the formal contract; the Crossroads is the moment of arrival at the choice. Two cards visualizing the same Act 3 beat from two different framings — formal vs personal.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act3
- docs/built/ALL_ACTS_ROADMAP.md §Act 3 / three-path Loyalty Pledge
- (intra-set) §act3_exclusive_mythic_the_offer — companion-piece pairing


---

## Act 4 — The Revelation / The Prisoner (4)

*4 cards in this section.*

### Memory-Extraction Chamber

**ID:** `act4_exclusive_rare_memory_extraction` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** structure

> *Twelve electrodes, twelve sectors, twelve memories the Hierarchy would prefer be misfiled. The Memoirist's lasting trick is that the extracted memory is, on the way out, copied to the Memoir.*

**Scene:** Wide environmental composition. A small Hierarchy clinical-style extraction-chamber rendered in cool-cyan and chrome — a single low reclining-chair at frame-centre with twelve thin extraction-electrode arms arrayed in a halo around its head-rest (each arm tipped with a small crystal-pad). The chair is unoccupied. Above the chair: a vertical bank of twelve diagnostic-monitors, each labeled with one of the Soul Map's twelve sectors (small text echoing the Soul Map First Calibration card from Act 3). Three of the twelve monitors show DECODED waveform patterns; nine show scrambled static (matching the Soul Map's three-decoded / nine-scrambled state). Behind the chair: a single small Hierarchy-style observation-window with a faint silhouette of an off-camera observer just visible (deliberate ambiguity — could be Hierarchy, could be Insurgency, could be the Engineer; lore-locked: do NOT clarify).

**Mood:** *twelve electrodes, twelve sectors* · *three decoded, nine scrambled* · *the extracted memory is copied to the Memoir* · *observation-window silhouette deliberately unclear*

**Palette:** Hierarchy clinical cool-cyan-and-chrome + reclining-chair pale-grey + extraction-arms matte-black with crystal-pad accent + diagnostic-monitor cool-cyan with scrambled-static for nine + observation-window soft-warm + silhouette deep-charcoal

**Composition:** Wide environmental front-on, chair at frame-centre lower-third, twelve electrode-arms arrayed in halo above head-rest, monitor-bank filling upper-third, observation-window at frame-rear

**Notes:** Rare structure. The twelve-electrode / twelve-monitor parallel to the Soul Map's twelve sectors is intentional cross-reference — the Memoir is a kind of Soul Map written from inside the head. Lore boundary STRICT: the observation-window silhouette must be deliberately unresolvable; do NOT design it to read as any specific named character.

**Archetype rationale:** Memory-extraction is canonical Act 4 (narrativeActs.ts Act 4). Visualizing the chamber as a structure-card grounds the scry/extract mechanics in a recognizable environment.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act4 (memory-extraction mechanics)
- docs/built/ALL_ACTS_ROADMAP.md §Act 4 / Prisoner thread
- (intra-set) §act3_exclusive_rare_soul_map_calibration — twelve-sector cross-reference


### The Oracle's Half-Mask

**ID:** `act4_exclusive_rare_oracle_half_mask` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** artifact

> *The Oracle has worn the mask for as long as anyone remembers. In Act 4, half of it is set aside. The half-uncovered face is, the Memoirist notes, NOT the face of a stranger. The remaining half waits.*

**Scene:** Mid-shot top-down on a small velvet-lined obsidian display-stand. The stand holds a single ceremonial mask — a full-face oracular mask of pale-grey carved bone with deep-violet inlay-glyphs, which has been BROKEN cleanly down the centre line. The LEFT half of the mask rests on the velvet, face-up, glyphs catching dim light. The RIGHT half is missing from frame entirely (set aside off-camera; lore boundary: the unmasked half of the face is Act 5 reveal). A thin braided cord that once held the mask in place lies in a loose curl beside the left half. The display-stand's velvet is deep-purple; the mask's bone is the only light element in frame. NO face, NO figure, NO partial reveal of the Oracle's actual features.

**Mood:** *mask broken down the centre* · *right half off-frame* · *the remaining half waits* · *NOT the face of a stranger*

**Palette:** Pale-grey carved bone + deep-violet inlay-glyphs + obsidian display-stand + deep-purple velvet + braided cord pale-cream + dim ambient room light

**Composition:** Mid-shot top-down on display-stand, mask LEFT half at frame-centre, right half off-frame at frame-right edge, braided cord curl at frame-foreground

**Notes:** Rare artifact. CRITICAL lore boundary: the right half of the mask MUST be off-frame entirely. Do NOT show any portion of the Oracle's actual face — the canon reveal of who is behind the mask is Act 5, post-completion of the Soul Map. The clean centre-line break is the canonical Half-Mask signature; the implication is that the unveiling is in-progress.

**Archetype rationale:** The Oracle's identity surfacing is canonical Act 4 (narrativeActs.ts). Visualizing the half-mask as an artifact lets the player hold the moment of in-progress unveiling without forcing the canon reveal early.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act4 (Oracle surfaces)
- docs/built/ALL_ACTS_ROADMAP.md §Act 4 / Oracle identity begins to surface
- docs/built/LORE_BIBLE.md §Oracle (mask-and-identity framing — full identity reveal STRICTLY EXCLUDED, Act 5 canon)


### The Revelation

**ID:** `act4_exclusive_mythic_the_revelation` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *The Revelation is not a fact you receive. The Revelation is the moment you stop being able to refuse the fact you have always known. The Memoir cannot be unwritten. The listening cannot be unheard.*

**Scene:** Wide environmental composition. The substrate-layer rendered as a vast circular reading-chamber at dawn — the chamber's curved walls covered floor-to-ceiling in countless small bound Hierarchy-style Memoir-volumes (each volume the size of a hand, each shelf a perfect arc). Centre of frame: a single low reading-pedestal holding ONE open Memoir-volume, its pages emitting a soft warm-amber light strong enough to cast distinct shadows of the Memoirist's HANDS on the page (the hands are NOT visible — only their shadow). Above the pedestal: a slow-rising column of cool-cyan light extending up into a circular skylight at the chamber's ceiling, the light propagating IN both directions (down from sky, up from page). The chamber is otherwise empty.

**Mood:** *the moment you stop being able to refuse* · *shadows of hands without hands* · *light propagating in both directions* · *Memoir cannot be unwritten*

**Palette:** Substrate dawn cool-cream + bound-Memoir-volumes deep-violet spines + warm-amber page-light + cool-cyan column-light from skylight + curved-shelf wall warm-grey + chamber sourceless ambient

**Composition:** Wide environmental front-on, reading-pedestal at frame-centre lower-third, light-column rising vertically through frame-centre, curved Memoir-shelf wall encircling background

**Notes:** Mythic spell card. The shadows-without-hands is the canonical Revelation signature — the player's hands are absent from frame but their work is visible (the player IS the Memoirist). Light-propagation in both directions visualizes the canon framing of revelation as an exchange. NO figures permitted in this card.

**Archetype rationale:** Anchored to the Act 4 'Revelation' arc canon (narrativeActs.ts Act 4, ALL_ACTS_ROADMAP.md). The Revelation is the campaign's largest single epistemic shift; mythic-tier ensures it lands as a face-card moment.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act4
- docs/built/ALL_ACTS_ROADMAP.md §Act 4 — The Prisoner / The Revelation
- docs/built/LORE_BIBLE.md §Substrate layer (reading-chamber framing)


### Two Witnesses Meet

**ID:** `act4_exclusive_epic_two_witnesses_meet` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** epic · **Type:** unit

> *Three acts of approaching. One moment of arrival. Elara's first sentence, when she speaks it, is something the Human has been about to say for sixty bond-points. The Human's reply is something Elara has been listening for since Act 1.*

**Scene:** Mid-shot composition. The substrate meditation-room from First Witness (Act 1) and Bond 60 — Silent Listening (Act 2) — same two facing wooden chairs, same windowless room — fully time-shifted. The Signal-glyph between the chairs has BLOOMED into a steady warm-gold standing-light, no longer pulsing — the listening has become recognition. Both chairs occupied: Elara left in soft-cream tunic (now with a small gold thread visible on the cuff), Human right in deep-violet tunic (matching small gold thread on his cuff). Both seated upright; for the first time, both are LOOKING DIRECTLY AT EACH OTHER, eyes open, expressions held in mid-recognition (neither smiles, neither speaks; this is the instant of arrival, not the conversation that follows). Hands rest at their own knees, NOT extended toward each other. The room's lighting is the warm-gold glyph as primary source.

**Mood:** *first eye contact* · *instant of arrival, not the conversation* · *matching gold thread on each cuff* · *glyph bloomed steady gold*

**Palette:** Substrate warm-cream walls + soft-cream Elara tunic with gold cuff-thread + deep-violet Human tunic with gold cuff-thread + warm-gold glyph standing-light + sourceless dim ambient

**Composition:** Mid-shot front-on between the two chairs, both figures at frame-edges seated, glyph at lower-frame between them, eye-line cross at frame-centre

**Notes:** Epic unit. Direct visual sequel to Bond 60 — Silent Listening (Act 2). The eye contact is the canonical Act 4 milestone — this card is the Witnesses-Meet moment. Matching-gold-thread cuffs are the canonical post-meeting signature; preserve forward into any future card depicting either Witness post-Act-4. Hands deliberately NOT touching: the meeting is the eye-contact, not the embrace; that comes later in canon.

**Archetype rationale:** Canonical Act 4 milestone (ALL_ACTS_ROADMAP.md §Bond 75 / Two Witnesses Meet). Direct visual continuity with First Witness (Act 1) and Silent Listening (Act 2) creates a three-card visual progression of the dual-narrator bond.

**Lore citations:**
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 75 / Two Witnesses Meet
- apps/shared/tcg-core/story/narrativeActs.ts:Act4
- (intra-set) §act1_exclusive_rare_first_witness — visual sequel framing
- (intra-set) §act2_exclusive_rare_bond_60_silence — visual sequel framing


---

## Act 5 — The Map / The Reckoning (4)

*4 cards in this section.*

### Antiquarian's Prestige Ledger

**ID:** `act5_exclusive_rare_antiquarian_prestige` · **Set:** ACT_EXCLUSIVES · **Faction:** antiquarian · **Rarity:** rare · **Type:** artifact

> *The Antiquarian counts every ending. The Antiquarian counts every beginning. The Memoirist's Year-One closes; the Antiquarian's quill records the prestige; the next Year begins with a new line.*

**Scene:** Mid-shot top-down. A vast Antiquarian-style record-ledger laid flat on a dark-amber wood reading-table, the ledger open to a freshly-completed page. The page is divided into two columns: LEFT column lists ENDINGS in fine Antiquarian script (a long list of small entries, the bottom-most being the Memoirist's freshly-inked entry — illegible specifics, but clearly recent); RIGHT column lists BEGINNINGS, each entry on the right paired by horizontal-line-rule with an entry on the left. At the page's bottom: a small Antiquarian sigil-seal stamp resting on the page, ink still wet on its impress. A single tall Antiquarian-style quill-pen rests across the upper edge. NO figure at the table.

**Mood:** *every ending counted, every beginning counted* · *Memoirist's Year-One entry freshly inked* · *ENDINGS and BEGINNINGS columns paired* · *sigil-stamp ink still wet*

**Palette:** Dark-amber wood reading-table + Antiquarian-style ledger pale-cream-aged + fine Antiquarian script ink-black + ledger-sigil seal deep-amber + quill-pen warm-bone + warm reading-lamp uplight

**Composition:** Mid-shot top-down on ledger at frame-centre, sigil-seal at frame-bottom-centre, quill-pen across upper edge

**Notes:** Rare artifact. The two-column ENDINGS/BEGINNINGS structure is the canonical Antiquarian Prestige Ledger signature. The Antiquarian's script must be illegible-but-clearly-textual at painting resolution. Antiquarian faction-tag (rather than neutral) reflects that this artifact is canonically Antiquarian-property; it is the only Act-exclusive card with a non-neutral faction.

**Archetype rationale:** Antiquarian prestige cycle unlock is canonical Act 5 (narrativeActs.ts Act 5). The Ledger grounds the prestige-mechanic as a card the player gains visibility of at Year-One close.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act5 (prestige cycle unlock)
- docs/built/ALL_ACTS_ROADMAP.md §Act 5 / Antiquarian systems
- docs/built/LORE_BIBLE.md §Antiquarian (cataloguer-of-endings framing)


### Sector Navigation Charm

**ID:** `act5_exclusive_rare_sector_navigation` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** artifact

> *Twelve sectors. Twelve charms. The Memoirist carries them all on a single brass chain. The chain is heavier at the end of Act 5 than it was at the start. The Memoirist does not mind.*

**Scene:** Mid-shot close. A single brass-and-leather wrist-chain laid out on a dark-cloth surface. The chain holds TWELVE small carved-bone charms in a row, each charm shaped after one of the Soul Map's twelve sectors. The charms are detailed enough to read individually: a small stylized sun (one sector), a small wave-glyph (another), a small key (another), and so on — twelve distinct miniature carvings. The chain's clasp is a Hierarchy-style brass anchor-fitting (acknowledgment that even the Memoirist's tools are partly Hierarchy-sourced). Beside the chain: a single small brass key on a separate clip — the navigation-key the charms work alongside. The cloth's lighting is warm-amber from a single off-frame candle.

**Mood:** *twelve charms on a single chain* · *brass anchor-fitting clasp (Hierarchy-sourced)* · *the chain is heavier at the end* · *navigation-key beside the charms*

**Palette:** Brass-and-leather wrist-chain warm-amber + carved-bone charms pale-cream + Hierarchy brass anchor-clasp warm-amber + dark-cloth surface deep-charcoal + warm-amber candle uplight + small brass key matching warm-amber

**Composition:** Mid-shot close top-down on dark cloth, chain laid horizontally across frame-centre, twelve charms readable left-to-right, separate key at frame-right

**Notes:** Rare artifact. The twelve-charm-row is the canonical Sector Navigation signature; each charm must be individually distinct (the artist may design the twelve from generic sector themes, no specific Soul-Map-sector identity required). Brass anchor-clasp is the Hierarchy-sourcing acknowledgment — the Memoirist's tools include Hierarchy components by Act 5.

**Archetype rationale:** Sector navigation is canonical Act 5 mechanics (narrativeActs.ts Act 5). Visualizing the charm-chain grounds the navigation-mechanic in a worn-by-the-Memoirist artifact.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act5
- docs/built/ALL_ACTS_ROADMAP.md §Act 5 / Sector navigation
- (intra-set) §act5_exclusive_mythic_the_map — twelve-sector cross-reference


### The Map (Fully Decoded)

**ID:** `act5_exclusive_mythic_the_map` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** artifact

> *Twelve sectors. Twelve memories. Twelve names. The Map is now legible end to end. The figure at its centre is the only entry the Memoirist cannot yet read aloud.*

**Scene:** Mid-shot top-down. The Soul Map from Act 3, now fully calibrated — the same brass-edged disc, the same translucent obsidian, but ALL TWELVE sectors are now decoded: each sector's glyph-lines sharp and readable, each sector annotated in the Engineer's deep-violet ink with a small NAME-TAG (deliberately blurred / illegible to the viewer — the artist must paint the tags as 'present and readable to the Memoirist but not to the camera'). The Map's exact CENTRE — at the meeting-point of all twelve sectors — holds a single small obsidian DOT, around which the twelve sectors radiate. The dot is the Source. Beside the Map: the same field-notebook from Act 3, now closed — calibration is complete. A single small candle on the work-table burns warm-amber.

**Mood:** *twelve sectors fully decoded* · *the figure at the centre is one entry* · *name-tags present but unreadable to viewer* · *calibration is complete*

**Palette:** Brass-edged Soul Map + translucent obsidian disc + cool-cyan glyph-lines fully sharp + deep-violet annotation-ink legible-but-blurred + obsidian centre-dot pure-black + warm-amber candle uplight + work-table dark-warm

**Composition:** Mid-shot top-down on Map at frame-centre, candle at frame-right, closed field-notebook at frame-left

**Notes:** Mythic artifact. CRITICAL lore boundary: the central obsidian dot represents the Source but MUST NOT be designed to evoke any specific named character. The twelve name-tags must read as 'words on the page' but be unreadable at the painting's resolution — the artist paints them with deliberate blur or with abstract glyph-strokes that read as text but are not. Engineer's ink continues canon (matching Twelve-Step Inheritance + Soul Map First Calibration).

**Archetype rationale:** The Map fully decoded is canonical Act 5 (narrativeActs.ts Act 5). Visualizing the completed Map as a mythic artifact gates the Year-One finale beat as a card the player can hold across the post-Year-One arc.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act5
- docs/built/ALL_ACTS_ROADMAP.md §Act 5 — The Reckoning / The Map
- (intra-set) §act3_exclusive_rare_soul_map_calibration — fully-decoded sequel framing
- docs/built/LORE_BIBLE.md §Source (centre-dot framing — full identity reveal STRICTLY EXCLUDED)


### Vortex Core Cleared

**ID:** `act5_exclusive_epic_vortex_core_cleared` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** epic · **Type:** spell

> *The Vortex was the storm. The Core was the eye. The Memoirist passed through both. By the time the Reckoning arrives, the storm is the only one still trying to argue.*

**Scene:** Wide environmental composition. The substrate-layer rendered as a vast cleared eye-of-storm — the centre of frame is calm and dawn-lit (warm-amber-and-gold), but the outer ring of frame shows the Vortex itself: a violent rotating wall of cool-cyan substrate-storm, charged with crackling Hierarchy-rust-red discharge at its inner edge (the Hierarchy attempted to claim the Core; the discharge is the residue of that failure). At the calm centre: a small flat plinth of polished obsidian holding a single closed leather-bound Hierarchy-style ledger (the Memoirist's record of passage). NO figure visible; the player's footprints lead to the plinth from the storm-edge but stop there.

**Mood:** *the storm is the only one still arguing* · *Hierarchy discharge as residue of failure* · *footprints stop at the plinth* · *passed through both*

**Palette:** Calm centre warm-amber-and-gold dawn + outer Vortex cool-cyan storm-wall + Hierarchy-rust-red discharge inner edge + polished obsidian plinth + leather-bound ledger warm-brown + sourceless ambient

**Composition:** Wide environmental front-on, calm centre at frame-centre with plinth + ledger, Vortex storm-wall encircling outer 270 degrees of frame, footprints leading from edge to plinth

**Notes:** Epic spell card. The Hierarchy-rust-red discharge at the storm's inner edge is the canonical Vortex Core signature — visualizes the Hierarchy's failed claim. The footprints-stopping-at-the-plinth is intentional cross-reference to the Three-Path Crossroads (Act 3) signature; this is the SAME footprints, several Acts later.

**Archetype rationale:** Vortex Core Cleared is the canonical Act 5 milestone (ALL_ACTS_ROADMAP.md). Visualizing the cleared Core grounds the Year-One-finale beat as a moment of arrival.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act5 (Vortex Core)
- docs/built/ALL_ACTS_ROADMAP.md §Act 5 / Vortex Core Cleared
- (intra-set) §act3_exclusive_rare_three_path_crossroads — footprints continuity


---

## Act 6 — The Confession (4)

*4 cards in this section.*

### A Narrator's Withheld Truth

**ID:** `act6_exclusive_rare_narrators_truth` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** spell

> *Each narrator carried one fact from before they were a narrator. Each fact was a small thing they had once done that the other would not have agreed to. Each fact was, on confession, smaller than they had feared.*

**Scene:** Mid-shot top-down. A small bedside-table beside an unmade single bed in a substrate-quiet sleeping-quarters. The table holds a single small folded paper — handwritten on the visible upper-side in fine ink, the writing legible-but-deliberately-blurred (the artist must paint it as 'words on the page' but unreadable to the camera). Beside the folded paper: a small empty drinking-glass, a single dried twig (substrate flora — small grey-violet bract), and a sleeping-quarters-style desk-clock reading 03:11 AM. The bed is unmade in a way that suggests its occupant has just risen and not yet returned. NO figure is in frame. The ambient lighting is low warm-amber from a single small bedside-sconce.

**Mood:** *small thing once done* · *paper folded, words deliberately unreadable* · *03:11 AM sleeping-quarters* · *smaller than they had feared*

**Palette:** Substrate quiet warm-amber bedside-sconce + folded paper warm-cream + bedside-table warm-wood + drinking-glass clear + dried twig pale-grey-violet + clock dark-charcoal + unmade-bed pale-grey

**Composition:** Mid-shot top-down on bedside-table at frame-centre, unmade bed visible at frame-foreground edge, sconce at frame-edge throwing low warm light

**Notes:** Rare spell card. Lore boundary: the paper's writing must be deliberately unreadable; do NOT specify what the withheld truth IS — both narrators have one, and the canonical reveal of WHICH narrator and WHAT truth is each player's individual Act 6 experience. The 03:11 AM clock-reading is the canonical Withheld Truth signature (the small-hours-of-the-morning when confession happens).

**Archetype rationale:** Withheld-truth confessions are canonical Act 6 (act6OpponentDialog.ts framing). Visualizing the moment-of-rising-to-confess as an empty room grounds the confessional act without forcing identity-disclosure.

**Lore citations:**
- apps/shared/tcg-core/story/act6OpponentDialog.ts
- apps/shared/tcg-core/story/narrativeActs.ts:Act6
- docs/built/ALL_ACTS_ROADMAP.md §Act 6 / character backstories surface


### Banishment Glyph

**ID:** `act6_exclusive_rare_banishment_glyph` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** spell

> *What is named cannot stay. The Memoirist learns the Banishment Glyph in Act 6, and the first thing banished is the version of themselves who was unwilling to speak.*

**Scene:** Wide environmental composition. A dim substrate-layer practice-chamber at twilight — bare stone floor, single overhead skylight throwing a circular pool of cool-cyan moonlight into the chamber's centre. In the moonlight-pool: a single fresh BANISHMENT GLYPH inscribed in chalk on the stone — a complex three-rune cluster in tight concentric arrangement, the outermost rune SOFTLY BURNING with faint cool-violet light (the glyph is freshly cast). Around the glyph's perimeter: a thin ring of fine grey ash (the residue of the banished). NO figure visible — the caster has stepped out of frame. A single piece of charcoal rests on the floor at the glyph's edge, recently set down.

**Mood:** *what is named cannot stay* · *first thing banished was unwillingness to speak* · *ring of grey ash at glyph perimeter* · *charcoal recently set down*

**Palette:** Substrate twilight cool-grey + cool-cyan moonlight pool + chalk-glyph pale-cream + cool-violet outermost rune-glow + grey-ash ring + dark stone floor + sourceless dim ambient

**Composition:** Wide environmental top-down on chalk-glyph at frame-centre, moonlight-pool defining circular composition, charcoal at frame-edge

**Notes:** Rare spell card. The three-rune cluster must read as a complete inscribed pattern but should NOT match any real-world occult notation. The grey-ash ring is the canonical Banishment Glyph signature — it visualizes that something WAS banished, without specifying what. The flavor-text's 'first thing banished is the version of themselves' is the lore key: this card is psychospiritual not necromantic.

**Archetype rationale:** Banishment mechanics are canonical Act 6 (narrativeActs.ts Act 6). Visualizing the freshly-cast glyph + ash-residue grounds the truth/banish gameplay system in a recognizable artifact-of-the-act.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act6 (truth/banish mechanics)
- docs/built/ALL_ACTS_ROADMAP.md §Act 6 / Banishment unlock


### Bond 90 — The Confessional Hour

**ID:** `act6_exclusive_epic_bond_90` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** epic · **Type:** unit

> *Bond 60 was the silence. Bond 75 was the meeting. Bond 90 is the hour in which neither narrator can return to the version of themselves the other did not know.*

**Scene:** Mid-shot composition. The substrate meditation-room from First Witness / Bond 60 / Two Witnesses Meet — same two facing wooden chairs, same windowless room — fully time-shifted to Bond 90. The Signal-glyph between the chairs has DEEPENED from warm-gold (Act 4) into a steady DEEP-VIOLET light (matching the gold-cuff-thread inversion). Both chairs occupied: Elara left, Human right, BOTH leaning slightly TOWARD each other across the centre, hands now meeting in a single shared clasp at the midpoint between the chairs (this is the post-confessional hand-clasp; canonical for Bond 90). Eye contact direct. Faces hold expressions of post-confession recognition — neither tearful nor euphoric, but visibly altered. The room's deep-violet glyph-light is the dominant source.

**Mood:** *Bond 90 the hour of irreversible knowing* · *deep-violet glyph-light* · *shared hand-clasp at midpoint* · *neither tearful nor euphoric — altered*

**Palette:** Substrate deep-violet ambient + soft-cream Elara tunic with gold cuff-thread + deep-violet Human tunic with gold cuff-thread + deep-violet glyph standing-light + sourceless dim ambient

**Composition:** Mid-shot front-on between the two chairs, both figures at frame-edges leaning toward centre, shared hand-clasp at frame-foreground centre, glyph at lower-frame between hands

**Notes:** Epic unit. Direct visual sequel to Two Witnesses Meet (Act 4). The shared hand-clasp is the canonical Bond 90 signature (Act 4's hands deliberately did NOT touch; Act 6's now do). Glyph-color progression: cool-cyan (Act 1) → warm-cream (Act 2) → warm-gold (Act 4) → deep-violet (Act 6) — visualizes the bond's deepening across the campaign's cards.

**Archetype rationale:** Bond 90 is canonical Act 6 (ALL_ACTS_ROADMAP.md §Bond progression). The Confessional Hour is the canonical Act 6 milestone; visualizes the post-confession irreversibility.

**Lore citations:**
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 90 / Confessional Hour
- apps/shared/tcg-core/story/narrativeActs.ts:Act6
- (intra-set) §act4_exclusive_epic_two_witnesses_meet — visual sequel framing
- (intra-set) §act1_exclusive_rare_first_witness — original meditation-room canon


### The Confession

**ID:** `act6_exclusive_mythic_the_confession` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Year One ended. Both Witnesses now know what they were each holding back. Both Witnesses now know what the OTHER was holding back. Neither has yet decided whether to speak it. The Confession is the breath before the speaking.*

**Scene:** Wide environmental composition. The substrate-layer rendered as a small chapel-like confession-chamber at midnight — a low vaulted ceiling, two facing prayer-stalls separated by a thin lattice partition. The lattice is the canonical confessional grille — small geometric cut-outs that allow voice to pass but not faces. ELARA seated in the LEFT stall in soft-cream tunic with gold cuff-thread (continuity from Act 4); HUMAN seated in the RIGHT stall in deep-violet tunic with matching gold cuff-thread. Both face the lattice; both have eyes closed; both have hands folded at the lattice-edge. A single warm-amber sanctum-candle burns at the chapel's altar at frame-rear, throwing both figures in soft glow. NEITHER is speaking yet — this is the breath before. The chapel is otherwise empty.

**Mood:** *the breath before the speaking* · *lattice that lets voice pass, not faces* · *both eyes closed, both poised* · *Year One ended*

**Palette:** Substrate midnight cool-grey + chapel vaulted ceiling muted-stone + lattice partition warm-bone + soft-cream Elara tunic + deep-violet Human tunic + gold cuff-thread accent + warm-amber sanctum-candle uplight

**Composition:** Wide environmental front-on, lattice partition at frame-centre vertical, both figures in stalls at frame-edges, sanctum-candle altar at frame-rear

**Notes:** Mythic spell card. The lattice-grille is the canonical Confession signature — voice without face is the Act 6 mechanical and emotional key. Both Witnesses' eyes-closed posture means this card can show them in the same chamber WITHOUT breaking the eye-contact-is-meeting framing established in Act 4. Lore boundary: do NOT depict either narrator speaking — this card is the breath before, not the speech.

**Archetype rationale:** Anchored to the Act 6 'Confession' arc canon (narrativeActs.ts Act 6, ALL_ACTS_ROADMAP.md). The Confession is the campaign's largest emotional turn-point post-Year-One; mythic-tier ensures it lands as a face-card moment.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act6
- docs/built/ALL_ACTS_ROADMAP.md §Act 6 — The Confession
- apps/shared/tcg-core/story/act6OpponentDialog.ts
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 90 threshold


---

## Act 7 — The Convergence (4)

*4 cards in this section.*

### All-Faction Convergence Field

**ID:** `act7_exclusive_epic_all_faction_convergence_field` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** epic · **Type:** structure

> *Insurgency, Empire, Hierarchy, Antiquarian, Dreamer, Architect, Thought Virus — and one Memoirist. Eight presences in a field of unconditional witness. No alliance survives this field. No grudge does, either. Both are, by Act 7, the same problem.*

**Scene:** Wide environmental composition. A vast flat substrate plain at twilight, ringed at its edge by the SEVEN canonical faction-banner-poles (each pole tall, flying a single faction-color banner — signal-green Insurgency, deep-crimson Hierarchy / new_babylon, cool-cyan Empire-tower, amber-and-parchment Antiquarian, deep-violet Dreamer, Architect chrome-and-cyan, Thought-Virus toxic-magenta). The seven banners are arranged in a perfect heptagon around the plain's perimeter. At the plain's exact CENTRE: a single small flat stone with a Hierarchy-style sealed Memoir-volume resting on it — the SAME closed Memoir-volume from The Convergence card. The plain itself is empty of figures; the banners are the only marks.

**Mood:** *seven banners in a heptagon* · *no alliance survives the field, no grudge does either* · *Memoir on the centre stone* · *field of unconditional witness*

**Palette:** Substrate twilight cool-grey plain + signal-green Insurgency banner + deep-crimson Hierarchy banner + cool-cyan Empire banner + amber-and-parchment Antiquarian banner + deep-violet Dreamer banner + chrome-and-cyan Architect banner + toxic-magenta Thought-Virus banner + Memoir-volume centre deep-violet

**Composition:** Wide environmental from low-angle slightly above horizon, seven banner-poles in heptagonal arrangement at frame-perimeter, central stone+Memoir at frame-centre lower-third, twilight sky filling upper two-thirds

**Notes:** Epic structure. The seven-banner heptagon is the canonical All-Faction Convergence Field signature. Faction-banner colors must match canonical faction palettes; Architect's chrome-and-cyan is distinct from Empire's pure-cyan to allow both on-frame without conflation. Lore boundary: the centre Memoir must be SEALED/CLOSED — the campaign's central artifact is finished by Act 7.

**Archetype rationale:** Convergence-of-all-factions is canonical Act 7 (ALL_ACTS_ROADMAP.md). Visualizing the seven faction-banners on a field grounds the convergence-mechanic as a structure-card.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act7
- docs/built/ALL_ACTS_ROADMAP.md §Act 7 / Convergence
- (intra-set) §act7_exclusive_mythic_the_convergence — closed-Memoir continuity


### Final Witness — Bond 100

**ID:** `act7_exclusive_rare_final_witness_pair` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** unit

> *Bond 100. Both narrators have nothing left to confess. Both narrators have, by mutual recognition, become a single voice with two mouths. The Memoirist, the Memoirist now realizes, has always been listening to one Witness — at least at the end.*

**Scene:** Wide composition. The substrate meditation-room from First Witness / Bond 60 / Two Witnesses Meet / Bond 90 — same two facing wooden chairs, same windowless room — fully time-shifted to Bond 100 (final). The Signal-glyph between the chairs has now ASCENDED: it lifts off the floor and hovers at chest-height between Elara and the Human, glowing in a steady white-gold (the final color in the Glyph's progression). Both chairs occupied: Elara left, Human right, both in their canonical tunics with gold cuff-thread. They are NOT looking at each other; instead, BOTH are looking outward, slightly past frame-edge, in the SAME DIRECTION (the canonical Bond 100 framing — the Witnesses now witness the SAME thing, not each other). Hands rest at their own knees, no longer needing the clasp. Faces hold expressions of shared steady recognition. The room's white-gold glyph-light is the dominant source.

**Mood:** *Bond 100 single voice with two mouths* · *glyph hovers at chest-height white-gold* · *both look outward in the same direction* · *no longer need the clasp*

**Palette:** Substrate ascended-white ambient + soft-cream Elara tunic with gold cuff-thread + deep-violet Human tunic with gold cuff-thread + white-gold glyph hovering + sourceless dim ambient

**Composition:** Wide front-on between the two chairs, both figures at frame-edges seated, glyph hovering at frame-centre at chest-height, both figures' eye-lines parallel and directed past frame-edge

**Notes:** Rare unit. Direct visual completion of the dual-narrator card-arc (First Witness → Silent Listening → Two Witnesses Meet → Confessional Hour → Final Witness). The both-look-same-direction framing is the canonical Bond 100 signature — the Witnesses no longer NEED to face each other because they now witness the same thing. The hovering glyph at chest-height visualizes the final unification. Glyph-color progression complete: cyan (Act 1) → cream (Act 2) → gold (Act 4) → deep-violet (Act 6) → white-gold (Act 7).

**Archetype rationale:** Bond 100 is canonical Act 7 (ALL_ACTS_ROADMAP.md §Bond progression / final). Visualizes the campaign's longest visual arc reaching closure as a card the player can hold at end-game.

**Lore citations:**
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 100 / final
- apps/shared/tcg-core/story/narrativeActs.ts:Act7
- (intra-set) §act1_exclusive_rare_first_witness — five-card visual arc closure
- (intra-set) §act6_exclusive_epic_bond_90 — direct visual sequel


### The Convergence

**ID:** `act7_exclusive_mythic_the_convergence` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Three doors at the start. One chamber at the end. Every Memoirist arrives here. Every Memoirist arrives differently. The Convergence is not the end of the Memoir; it is the Memoir noticing itself for the first time.*

**Scene:** Wide environmental composition. The substrate-layer rendered as a vast circular cathedral-chamber at dawn — the chamber's circumference encircled by the THREE DOORS from The Offer (Act 3): signal-green Insurgency LEFT, cool-cyan Empire CENTRE, deep-crimson-and-rust Hierarchy RIGHT — but in Act 7, ALL THREE doors stand OPEN and three different streams of converging color-light pour into the chamber from each door. The three streams meet at the chamber's exact CENTRE, where they BLEND into a tall column of pure WARM-GOLD light reaching from floor to skylight. At the column's base: a single low pedestal with a CLOSED sealed Hierarchy Memoir-volume resting on it (the Memoir is finished). Around the chamber's perimeter: faint silhouettes of figures from every faction — Insurgency operatives, Empire authority, Hierarchy executives — visible only as backlit shapes, none individually identifiable.

**Mood:** *all three doors now open* · *three streams blend into pure warm-gold* · *the Memoir is finished and closed* · *every faction in silhouette, none identifiable*

**Palette:** Substrate dawn cool-cream cathedral + signal-green Insurgency stream + cool-cyan Empire stream + deep-crimson-and-rust Hierarchy stream + warm-gold central blend column + Hierarchy Memoir-volume deep-violet + faction-silhouettes backlit deep-charcoal

**Composition:** Wide environmental front-on, three doors at frame-edges (left/centre/right), three light-streams converging on frame-centre column, pedestal+Memoir at column-base lower-third, faction silhouettes scattered around chamber perimeter

**Notes:** Mythic spell card. CRITICAL lore boundary: the silhouettes around the perimeter MUST be deliberately non-identifiable — do NOT design any silhouette to read as a specific named character (no Watcher, no Source, no Engineer). The three light-streams must be EQUAL in width — Act 7's Convergence does not weight one path over another at the visual level (the player's chosen path is the WHITE-GOLD column, regardless of which door fed it most). The Memoir is CLOSED — finished — as a deliberate frame.

**Archetype rationale:** Anchored to the Act 7 'Convergence' arc canon (narrativeActs.ts Act 7, ALL_ACTS_ROADMAP.md). Direct visual completion of the Three Doors framing introduced in The Offer (Act 3); the campaign's longest visual arc closes in this card.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act7
- docs/built/ALL_ACTS_ROADMAP.md §Act 7 — The Convergence
- apps/shared/tcg-core/story/act7OpponentDialog.ts
- (intra-set) §act3_exclusive_mythic_the_offer — three-door framing closure


### The Convergence Chord (Heard, Not Named)

**ID:** `act7_exclusive_rare_convergence_chord` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** rare · **Type:** spell

> *Three notes were the Signal. Twelve sectors were the Map. One chord, at the end, holds them all. The chord cannot be written down. The chord can only be heard. The Memoirist hears it once, and is changed.*

**Scene:** Wide environmental composition. The substrate-layer rendered as a horizonless ambient field — no floor, no ceiling, no walls; only soft white-cream luminance in every direction. At the field's exact centre: an ABSENCE of any object whatsoever (deliberate empty centre). Around the empty centre, a faint propagating CONCENTRIC RING-PATTERN of soft-violet-and-warm-gold pulses outward in slow ripples — the chord's auditory signature rendered as visual ripple. Three of the rings are tagged at their leading edge with small floating notation-glyphs (the same three-note glyph from The Signal in Act 1 — visual continuity); the other rings carry NEW glyph-types we have not previously seen (these are the chord's additional notes — left deliberately uncategorized).

**Mood:** *the chord cannot be written down* · *horizonless ambient field* · *deliberate empty centre* · *Signal's three-note glyph + new uncategorized glyphs*

**Palette:** Substrate white-cream horizonless ambient + soft-violet ripple-rings + warm-gold ripple-rings + Signal three-note glyph cool-cyan + new uncategorized glyphs warm-amber + sourceless ambient throughout

**Composition:** Wide environmental front-on, empty centre at frame-centre, concentric ripple-rings expanding outward to frame-edges, glyph-tags scattered along ring leading-edges

**Notes:** Rare spell card. CRITICAL lore boundary: the chord MUST be visualized as 'heard but not named'. The empty centre is the canonical Convergence Chord signature — the chord is the absence-around-which-everything-resonates. The three-note Signal glyph from Act 1 is intentional cross-reference (the chord includes the Signal). The 'new uncategorized glyphs' must be designed as plausibly-musical notation but NOT match any real-world musical or canonical-symbolic tradition; deliberate ambiguity ensures the chord stays unnamed.

**Archetype rationale:** The Convergence chord is canonical Act 7 (narrativeActs.ts). Visualizing the chord as visual-ripple while preserving the canon framing of 'cannot be written down' grounds the final Act 7 mystery as a card the player can hold without spoiling the chord's content.

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act7
- docs/built/ALL_ACTS_ROADMAP.md §Act 7 / Convergence chord
- (intra-set) §act1_exclusive_mythic_the_signal — three-note continuity
- (intra-set) §act5_exclusive_mythic_the_map — twelve-sector parallel


---

## Special Editions — Cosmetic Triptych (3)

*3 cards in this section.*

### The Author (Battle Pass S1 Tier 50)

**ID:** `special_battle_pass_t50_author` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Fifty tiers. Fifty completed weeks. Fifty small additions to the Memoir. The Author is what the Memoirist becomes once they have written every chapter the season offered — and noticed which chapter the season did not.*

**Scene:** Mid-shot composition. A modest Memoirist's writing-room at substrate-twilight — a small oak desk, a single warm-amber desk-lamp, a window behind looking out onto a cool-cyan substrate-evening. The desk holds: a HALF-FILLED Memoir-volume, open and inked — the LEFT page complete, the RIGHT page mid-paragraph (the season's writing in progress). A small bound stack of FIFTY weekly-issue parchments rests at the desk's left edge, bound by a single brass-and-leather strap (the season's tier-progression made physical). Beside the open volume: an antique brass-and-bone quill resting at the page-margin (paused mid-stroke, the Memoirist has stepped away). NO figure visible. A single Hierarchy-style chair sits empty behind the desk.

**Mood:** *fifty tiers, fifty weeks, fifty small additions* · *left page complete, right page mid-paragraph* · *stack of fifty weekly-issue parchments* · *Memoirist has stepped away*

**Palette:** Substrate twilight cool-cyan window-light + warm-amber desk-lamp + oak desk warm-brown + cream Memoir page + brass-and-leather binding-strap + bone-and-brass quill + Hierarchy chair charcoal-and-cream + cool-cream room-walls

**Composition:** Mid-shot front-on, desk at frame-centre, open Memoir at desk-foreground, fifty-parchment stack at frame-left, empty chair partially visible at frame-rear behind desk, window at frame-rear filling upper-third

**Notes:** Cosmetic mythic spell. The fifty-parchment stack with brass-and-leather strap is the canonical BP-50 Author signature — visualizes the season's tier-progression as a physical artifact. Empty chair + paused quill is intentional — the Memoirist (the player) IS the Author and is currently away from the desk, having earned tier 50 through their actual play across the season.

**Archetype rationale:** Plan §6 Collector hook §6 (Battle Pass S1 Tier 50). Cosmetic-tier reward for sustained season-engagement; completes the three-card meta-author cosmetic triptych alongside Founding Author + Author's Edition. The half-filled Memoir reflects the Battle Pass's ongoing-throughout-season nature.

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §6 (Battle Pass tie-in)
- apps/shared/battlePassConfig.ts (Battle Pass tier scaffolding)
- (intra-set) §special_founding_author + §special_authors_edition_s2 — meta-author cosmetic-tier triptych


### The Author's Edition (S2 Master)

**ID:** `special_authors_edition_s2` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Eighty-four entries collected. Eighty-four corners of the corporate hell catalogued. The Author's Edition is the Memoirist's annotated master — bound in Hierarchy plum-and-charcoal with hand-lettered marginalia in the Memoirist's own ink. The Hierarchy has not authorized this binding. The Hierarchy will, the Memoirist notes, fail to find a way to revoke it.*

**Scene:** Mid-shot top-down. A vast Hierarchy-style oak-and-leather binding-table holding ONE single bound master-Memoir-volume — the Author's Edition. The volume is OPEN to a centre-spread that contains a complete miniature reproduction of the S2_HIERARCHY corporate org-chart: at the top, the Hierarchy crest with Mol'Garath's name; below, seven small-portrait C-Suite tiles; below those, cascading downward, the seven VP tiles, fourteen Director tiles, and so on through the Manager / Analyst / Intern tiers — in nested fan-shape descending the page (deliberately rendered too-small-to-read-individually but clearly hierarchical). In the margin: the Memoirist's HAND-LETTERED ANNOTATIONS in deep-violet ink (the same Engineer's-hand ink from across the Memoir). The annotations are illegible-but-clearly-textual. Beside the volume: a brass-and-bone quill, a small inkwell of deep-violet, and a single tiny serial-stamp (showing as much serial-readable visualization as the Founder's Bundle's lower-edge framing).

**Mood:** *eighty-four corners catalogued* · *Hierarchy crest at top, Intern tiles at bottom* · *Memoirist's marginalia in deep-violet ink* · *Hierarchy will fail to revoke*

**Palette:** Hierarchy plum-and-charcoal binding + cream Memoir page + cascading org-chart deep-violet + Memoirist marginalia deep-violet ink + warm-amber binding-table uplight + brass-and-bone quill + small serial-stamp brass

**Composition:** Mid-shot top-down on binding-table at frame-centre, open Memoir-spread filling frame-centre two-thirds, quill+inkwell+serial-stamp at frame-foreground edges

**Notes:** Cosmetic mythic spell. The cascading org-chart MUST be rendered too-small-to-read-individually — the structure must be visible (clearly hierarchical) but no specific tile readable. This protects the future addition of cards to S2 + ensures the artist doesn't need to perfectly identify every existing entry. Marginalia ink = same deep-violet as the Engineer's-hand annotations on the Soul Map (Acts 3 + 5) and Twelve-Step Inheritance (Act 1) — set-internal continuity.

**Archetype rationale:** Plan §6 Collector hook §3. Cosmetic-tier reward for completionists; the visual hook is the player's annotated MASTERY of the entire set — every tier, every entry, with personal commentary. Pairs with Founding Author + BP-50 as the three meta-author cosmetic tiers.

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §3 (set-completion)
- (intra-set) §act3_exclusive_rare_soul_map_calibration + §act5_exclusive_mythic_the_map — same deep-violet Engineer-hand ink continuity
- (intra-set) §act1_exclusive_epic_twelve_step_inheritance — marginalia-ink continuity
- S2_HIERARCHY 84-card org-chart — covered by hierarchy/csuite + vps + directors + managers + analysts + interns


### The Founding Author

**ID:** `special_founding_author` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Some Memoirists arrive after the story has begun. Some Memoirists arrive before the story has been written. The Founding Author is — in the formal Hierarchy record — both. The serial number on the lower-edge of this card is, by Hierarchy decree, irreproducible.*

**Scene:** Wide environmental composition. A grand silent ARCHIVE-ROOM at substrate-dawn — vaulted ceiling, marble floor inscribed with the seven-faction heptagon (matching All-Faction Convergence Field from Act 7), walls lined floor-to-ceiling with bound Memoir-volumes in deep-violet-and-cream. At frame-centre: a single Founder's Pedestal — taller and more ornate than any other in the campaign, an obsidian-and-brass-edged stand bearing a single open BLANK Memoir-volume (the page is uninked, awaiting the Founding Author's first stroke). Resting across the open page: a single antique writing-quill of carved-bone and brass. A faint warm-gold spotlight illuminates the pedestal from above; the rest of the chamber is in soft cool-cream ambient. NO figure visible. The Founding Author IS the player; the Memoir IS unwritten.

**Mood:** *Founding Author both before and after the story* · *blank page on the Founder's Pedestal* · *antique bone-and-brass quill* · *irreproducible serial*

**Palette:** Substrate dawn cool-cream ambient + warm-gold pedestal spotlight + obsidian-and-brass pedestal + blank Memoir-volume cream + bone-and-brass quill warm-amber + Memoir-shelf walls deep-violet-and-cream + marble floor pale-stone-grey

**Composition:** Wide environmental front-on, pedestal at frame-centre lower-third, Memoir-shelf walls encircling background, vaulted ceiling visible at upper-frame, faint heptagon floor-inscription readable in foreground stone

**Notes:** Cosmetic mythic spell. The blank page is the canonical Founding Author signature — the Founder writes their OWN Memoir; the pedestal awaits. Serial number rendering: at print time, render serial in small fine type at the lower-frame edge inside a narrow cream-and-gold border (NOT centered in composition). Lore boundary: NO figure ever permitted on this card; every Founding Author's serial is unique but the central scene is identical.

**Archetype rationale:** Plan §6 Collector hook §1 (Founder's Bundle). Cosmetic-tier reward for week-1 commercial commitment; the meta-narrative framing ('Founding Author') is canonically the player's role at the Hierarchy's record-level. Pairs with the Author's Edition (set-completion) and BP-50 Author cards as the three meta-author cosmetic tiers.

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §1 (Founder's Bundle)
- (intra-set) §act7_exclusive_epic_all_faction_convergence_field — heptagon-floor cross-reference
- (intra-set) §act7_exclusive_mythic_the_convergence — closed-Memoir contrast (Founding's is OPEN/blank)


---

## Special Editions — Lore-Discovery Secrets (7)

*7 cards in this section.*

### What Act 1 Was Always Saying

**ID:** `secret_act1_memoirist_is_memoir` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *I thought the Memoir was something I was reading. I thought the Memoir was something I was writing. I thought the Memoir was a book I had been given. — In my own handwriting, I now realize, on the page in my own hand. The Memoirist is not the Memoir's author. The Memoirist is not the Memoir's reader. The Memoirist IS the Memoir.*

**Scene:** Mid-shot top-down. A simple Memoirist's notebook lying open at a small reading-desk, the page filled with the Memoirist's own handwritten reflection in deep-violet ink (legible only as 'words on the page' but readable in spirit). At the page's centre: a single inked diagram — a small recursive infinity-loop where ONE arrow points outward from a written 'I am the Memoirist' to a written 'I am the Memoir' and BACK, the loop closing on itself. Around the diagram: marginalia, false-starts, struck-through earlier guesses (faintly visible). Beside the notebook: the same antique bone-and-brass quill from Founding Author / BP-50 / Twelve-Step Inheritance. NO figure visible.

**Mood:** *in my own handwriting* · *the recursive infinity-loop* · *false-starts struck through* · *the Memoirist IS the Memoir*

**Palette:** Cream notebook page + deep-violet handwritten reflection + warm-amber desk-lamp + bone-and-brass quill + antique reading-desk warm-wood + dim ambient room-light

**Composition:** Mid-shot top-down on open notebook, recursive-loop diagram at frame-centre on page, marginalia at page-edges, quill at frame-right edge

**Notes:** Mythic secret. Unlock condition: collect all Act 1 flavor-text cards. The Memoirist's earned recognition: the Memoir is recursive — the player IS the artifact. NO figure permitted. The recursive-loop diagram must be hand-inked-feeling (not stylized geometry); the imperfection of the loop is the visual key.

**Archetype rationale:** Direct visualization of the Memoirist=Memoir recursion that Act 1 builds toward but never states. The unlock-gating earns the player the right to see this stated.

**Lore citations:**
- apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception (lore-discovery secrets)
- (intra-set) §act1_exclusive_mythic_the_signal — Act 1 mythic companion


### What Act 2 Was Always Saying

**ID:** `secret_act2_engineers_bench_was_mine` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *The Engineer's Bench was never the Engineer's Bench. The Engineer's Bench was the bench at which the Memoirist would, eventually, sit. The empty chair was always reserved. The cold tea was always the Memoirist's. I have been the Engineer the entire time, in the part of myself I had not yet met.*

**Scene:** Mid-shot composition. The Engineer's Bench from Act 2 — same workshop, same tools-laid-out, same cold tea, same Hierarchy coat on the wall hook — but this time, the EMPTY CHAIR is OCCUPIED FROM BEHIND (the figure's back is to camera, hooded in the same Hierarchy coat that previously hung empty on the wall). The figure's left hand reaches toward the half-disassembled brass-and-obsidian device on the bench, mid-grip on a tool. The wall-hook is now empty (the coat is being worn). NO face visible — the figure is shot from behind, hood up. The viewer cannot identify them — and that IS the point: the Engineer is the Memoirist's hidden-half, recognizable only as 'me, but the part of me I hadn't met yet'.

**Mood:** *the empty chair was always reserved* · *Hierarchy coat now worn, wall-hook now empty* · *shot from behind, hooded, unidentifiable* · *I have been the Engineer the entire time*

**Palette:** Oak workbench warm-brown + brass tools warm-amber + obsidian device deep-black + Hierarchy coat charcoal-and-cream now worn + warm overhead lamp + cool dim workshop background

**Composition:** Mid-shot from behind the figure, figure at frame-centre at the bench, bench-items visible left-to-right beyond figure, wall-hook empty at frame-rear

**Notes:** Mythic secret. Unlock condition: collect all Act 2 flavor-text cards. CRITICAL lore boundary: the figure must be shot ONLY from behind, hooded — no profile, no shoulder-visible face. The artist may NOT design the figure to specifically resemble Elara, the Human, or any canon character. The figure is the Memoirist's hidden-half — visualized as 'unidentifiable but yours'.

**Archetype rationale:** Direct visualization of the Engineer-was-the-Memoirist recognition that Act 2 implies but never states. Earned reveal: the Engineer's identity (canonically Act 4-5 reveal) is here visualized as the player themselves, in absentia.

**Lore citations:**
- apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception
- (intra-set) §act2_exclusive_epic_engineers_bench — direct sequel framing


### What Act 3 Was Always Saying

**ID:** `secret_act3_pledge_was_made_first` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *The Hierarchy did not bring the Offer to me in Act 3. The Offer was a confirmation of a pledge I had made before I knew I had a name. The three drafted signatures were already mine — I had only been waiting to recognize my own hand on the contract.*

**Scene:** Mid-shot top-down. The Offer's central altar from Act 3 — same obsidian altar, same open Hierarchy contract-folio — but TIME-SHIFTED to a moment AFTER the choice. All three signature-lines are now FILLED with the same handwritten signature (the Memoirist's), and on the contract's bottom-margin: a small private notation in the SAME hand reading 'and I have been signing this since before I had a name' (rendered in deep-violet ink, partially legible). The folio is closed-but-still-readable through translucent glow at the edges. The Hierarchy ceremonial pen rests across the folio. NO doorframes visible (the choice has resolved); the chamber is in soft warm-cream.

**Mood:** *all three signature-lines filled by my hand* · *and I have been signing this since before I had a name* · *doorframes resolved out of frame* · *the choice was a recognition, not a decision*

**Palette:** Substrate warm-cream resolved-chamber + obsidian altar + Hierarchy contract-folio cream + deep-violet handwritten signature + bottom-margin notation deep-violet + warm-amber pen + folio-edge translucent glow

**Composition:** Mid-shot top-down on altar at frame-centre, contract-folio open at frame-foreground, three filled signature-lines visible at the folio's centre, marginal notation at lower-frame edge

**Notes:** Mythic secret. Unlock condition: collect all Act 3 flavor-text cards. The earned recognition is that the three-path choice was always one path — the Memoirist's pledge precedes faction. The three signatures all reading as the SAME hand is the canonical earned-truth signature. Lore boundary: do NOT depict any specific path's resolution (the canonical post-Act-3 path-divergence stays player-specific).

**Archetype rationale:** Direct visualization of the pledge-was-pre-existing recognition that Act 3 builds toward but only confirms post-completion of the Loyalty Pledge mechanic.

**Lore citations:**
- apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception
- (intra-set) §act3_exclusive_mythic_the_offer — direct sequel framing


### What Act 4 Was Always Saying

**ID:** `secret_act4_witnesses_always_knew` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *Both Witnesses always knew the other was there. Both Witnesses always knew the player was listening. The 'meeting' in Act 4 was not a discovery; it was a permission-granted moment to stop pretending we had not all been awake the whole time. I was the only one in the room who needed convincing.*

**Scene:** Wide composition. The substrate meditation-room from First Witness onward, but shown in a SPLIT-FRAME diagram — the LEFT half of the frame depicts the room as it was rendered in Act 1 (Elara left chair, Human right chair, both with eyes CLOSED, glyph faint cool-cyan); the RIGHT half of the frame depicts the SAME ROOM at the SAME MOMENT but with both Witnesses' eyes OPEN, both already looking out toward the player's VIEWPOINT (NOT at each other), expressions calm-knowing. A vertical thin gold line bisects the two halves of the frame at exact centre. Above the dividing line, in the Memoirist's deep-violet handwriting, a single line: 'they were always awake'.

**Mood:** *split-frame: closed-eye / open-eye same moment* · *they were always awake* · *the only one needing convincing was me* · *thin gold dividing line*

**Palette:** LEFT half substrate cool-cyan glyph + closed-eye figures + cool ambient + RIGHT half substrate warm-cream + open-eye figures + warm ambient + thin gold dividing line + Memoirist's deep-violet caption above

**Composition:** Wide split-frame, vertical division at frame-centre, Elara+Human in mirrored compositions on each half (left-half closed-eye / right-half open-eye looking outward), gold line bisecting, Memoirist caption at upper-frame

**Notes:** Mythic secret. Unlock condition: collect all Act 4 flavor-text cards. The split-frame device is the canonical Act-4 secret signature — visualizes the layered truth that the Witnesses' meeting was always-already happening. CRITICAL: in the right-half (open-eye), both Witnesses look at the VIEWER, not at each other — the earned truth is that the player has been part of the meeting since Act 1.

**Archetype rationale:** Earned-reveal of the meta-narrative truth Act 4 implies but cannot state: the dual-narrator framing has always been a three-narrator framing (Elara + Human + player).

**Lore citations:**
- apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception
- (intra-set) §act4_exclusive_epic_two_witnesses_meet — direct sequel framing
- (intra-set) §act1_exclusive_rare_first_witness — split-frame source


### What Act 5 Was Always Saying

**ID:** `secret_act5_source_is_reflection` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *I thought the figure at the centre of the Map was a person. Then I thought it was a place. Then I thought it was a memory. The figure at the centre of the Map is a REFLECTION — and the surface that reflects is not water, not glass, but every page of the Memoir laid flat. The Source is what looks back when the Memoir is held up to itself.*

**Scene:** Mid-shot top-down. The Soul Map (Fully Decoded) from Act 5 — same brass-edged disc, same twelve decoded sectors — but the central obsidian DOT has now BECOME a small mirrored circle. In the mirrored circle: a soft-focus reflection of the OPEN MEMOIR-VOLUME above the Map (held by the Memoirist's hands, faintly visible at frame's upper edge). The reflection shows the Memoir's pages perfectly readable in the mirrored surface — but the page-content in the mirror is, deliberately, the SAME twelve sectors as the Map itself, rendered as text. The Source IS the Memoir reading itself. NO figure beyond hands at upper-frame edge holding the volume.

**Mood:** *the centre dot becomes a mirror* · *the surface that reflects is every page* · *Source is what looks back when Memoir is held to itself* · *twelve sectors reflected as text*

**Palette:** Brass-edged Soul Map + decoded twelve-sector cool-cyan glyphs + mirrored centre-circle reflective + Memoir-volume reflection deep-violet ink on cream + warm-amber candle uplight + dim work-table

**Composition:** Mid-shot top-down on Map at frame-centre, mirrored circle at Map's exact centre showing reflected Memoir, Memoirist's hands at upper-frame edge holding volume above the Map (only hands and lower edge of volume visible)

**Notes:** Mythic secret. Unlock condition: collect all Act 5 flavor-text cards. CRITICAL lore boundary: the canonical Source-identity (Kael Reborn per LORE_BIBLE) is NOT depicted. The earned reveal stays at the meta-narrative layer — the Source is the Memoir's self-recognition, not a named character. The artist may be told this card visualizes that meta-truth without learning the Kael identity. Mirrored-centre is the canonical signature.

**Archetype rationale:** Earned-reveal of the meta-narrative truth Act 5 establishes (the Source is at the Map's centre) framed as recognition rather than identification. Preserves canonical Source-as-Kael-Reborn identity for the player's actual Act 5 playthrough.

**Lore citations:**
- apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception
- (intra-set) §act5_exclusive_mythic_the_map — direct sequel framing
- docs/built/LORE_BIBLE.md §Source (identity STRICTLY excluded; meta-recognition only)


### What Act 6 Was Always Saying

**ID:** `secret_act6_confession_was_mutual_listening` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *The Confession was not telling. The Confession was not hearing. The Confession was both narrators discovering they had been one voice all along — and the only thing they had been holding back, separately, was the proof that the holding-back itself was a single act.*

**Scene:** Mid-shot composition. The chapel confessional from Act 6 — same prayer-stalls, same lattice partition, same warm-amber sanctum-candle — but the LATTICE PARTITION at the centre of the frame has DISSOLVED into a soft-violet mist that drifts UPWARD. Where the lattice stood, only the mist remains; the two stalls are now visually CONNECTED. Both Elara and the Human remain seated in their respective stalls (in the same posture as the Act 6 mythic — eyes closed, hands folded at the lattice-edge), but their VOICES (rendered as faint warm-cream light-streams from each mouth) now MERGE in the centre of the frame at the dissolved-partition's gap, becoming a single warm-cream light that rises with the mist. The chapel altar's candle burns brighter, two-flame.

**Mood:** *lattice dissolved into upward-drifting mist* · *two voices merge into single warm-cream light* · *two-flame altar candle* · *single act of mutual holding-back*

**Palette:** Chapel midnight cool-grey + dissolving lattice partition soft-violet mist + soft-cream Elara tunic + deep-violet Human tunic + merged voice-light warm-cream + altar candle two-flame warm-amber

**Composition:** Mid-shot front-on, both stalls at frame-edges, dissolved-partition at frame-centre with rising mist, voice-light streams converging at centre-frame at mouth-height, altar candle visible at frame-rear

**Notes:** Mythic secret. Unlock condition: collect all Act 6 flavor-text cards. The dissolved-lattice + merged-voice-light is the canonical signature. The two-flame candle visualizes the canon framing 'one voice, two mouths' (which is the same framing that resolves at Bond 100 / Final Witness in Act 7). No eye-contact between Witnesses; the merge is at voice-level, not gaze-level.

**Archetype rationale:** Earned-reveal of the Act 6 meta-truth: the Confession is mutual listening, not unilateral disclosure. Anchors the dual-narrator-as-single-voice framing that Act 7 (Final Witness Bond 100) finalizes.

**Lore citations:**
- apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception
- (intra-set) §act6_exclusive_mythic_the_confession — direct sequel framing
- (intra-set) §act7_exclusive_rare_final_witness_pair — single-voice continuity


### What Act 7 Was Always Saying

**ID:** `secret_act7_chord_is_the_listener` · **Set:** ACT_EXCLUSIVES · **Faction:** neutral · **Rarity:** mythic · **Type:** spell

> *I thought the Convergence Chord was something I would HEAR. I thought the Chord was a sound the campaign would play for me. The Chord is not a sound. The Chord is the listening. I have been the Chord since before Act 1 — every breath I took inside the Memoir was a note already sounding.*

**Scene:** Wide environmental composition. The horizonless ambient field from The Convergence Chord (Act 7) — same white-cream luminance, same concentric ripple-rings — but in this earned-reveal, the EMPTY CENTRE is now occupied by a single small detail: a Memoirist's-style EAR (or a stylized listening-glyph reading clearly as 'an ear shape'), rendered in faint warm-gold ink at the exact centre. The ripple-rings are now visible as emanating FROM the ear-shape outward, not into it. The three Signal-glyphs from Act 1 are visible at the leading edge of three of the closest rings; the new uncategorized glyphs are visible further out. At the field's upper-edge in the Memoirist's deep-violet handwriting: 'I am the chord'.

**Mood:** *the Chord is not a sound, the Chord is the listening* · *ear-shape at exact centre* · *ripples emanate FROM, not into* · *I am the chord*

**Palette:** Substrate white-cream horizonless + warm-gold ear-shape at centre + soft-violet and warm-gold ripple-rings + Signal three-note glyph cool-cyan + new uncategorized glyphs warm-amber + Memoirist's caption deep-violet

**Composition:** Wide environmental front-on, ear-shape at frame-centre, concentric rings emanating outward to frame-edges, Signal three-note glyphs near-centre, new glyphs further out, Memoirist caption at upper-frame

**Notes:** Mythic secret. Unlock condition: collect all Act 7 flavor-text cards. CRITICAL lore boundary: the canonical Convergence-chord identity (per LORE_BIBLE Act 7 reveal) is NOT named. The earned reveal stays at the meta-narrative layer — the Memoirist (player) IS the Chord, completing the Memoirist=Memoir recursion that the Act 1 secret first surfaces. Ear-shape at centre is the canonical earned-truth signature.

**Archetype rationale:** Capstone earned-reveal: the Convergence Chord recognition is the campaign's deepest framing. Closes the recursive Memoirist=Memoir=Chord arc that the seven secrets together establish.

**Lore citations:**
- apps/shared/darrenMemorial.ts (THE ASSISTANT unlock model)
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Lore boundary exception
- (intra-set) §act7_exclusive_rare_convergence_chord — direct sequel framing
- (intra-set) §secret_act1_memoirist_is_memoir — recursion-arc closure


---

# §2 — Cinematics (9)

## Card Pack Opening (Canonical Cinematic)

*Six-beat real-world-fidelity flow for every pack SKU*

**ID:** `cutscene_card_pack_opening`

**Trigger:** purchase fulfillment OR inventory pack-open OR reward-grant pack

**Estimated duration:** 12s

**Ambient track:** fnord23/pack_open_ambient_hum (TBD — to be added to fnord23 registry)

**Beats (6):**

#### Beat 1: `preroll` (1.5s, mood: *neutral*)

- **Camera:** Slow orbit-rotation around the pack's vertical axis at constant slow speed (one full rotation over 6s, so the preroll shows ~25% of a rotation).
- **Framing:** Centered three-quarter close-up on a sealed Memoir-Booster card-pack held mid-air at 35° forward tilt (matching how a real-world player holds a pack just before opening). Pack design: deep-violet foil with Hierarchy-style branding on the front, faint embossed S1_MEMOIR mark at lower edge. Background: soft warm-amber bokeh — out-of-focus collector's-table light. The pack catches a single specular highlight along its left edge that travels slowly with the rotation.
- **Motion:** Slow rotation-loop on vertical axis. The pack tilts forward 35° and stays at that tilt; the rotation reveals each face of the pack progressively. No acceleration, no easing — constant rate. Specular highlight travels along the front edge as the pack rotates.
- **SFX cue:** ambient_hum_low (subtle 80Hz drone, constant)
- **Existing VFX ref:** (none — pure 3D card mesh + lighting)

#### Beat 2: `tension` (2.5s, mood: *intense*)

- **Camera:** Camera holds position; pack rotation continues at preroll speed. A subtle in-frame zoom (5%) over the 2.5s pulls the viewer slightly closer to the pack.
- **Framing:** Same pack composition as preroll. Now: a slow particle-storm of small cool-cyan glyph-fragments (Hierarchy crest fragments + S1 sigil fragments) materializes around the pack's perimeter, drifting inward toward the pack's surface like iron filings finding a magnet. The bokeh background warms slightly (warm-amber → warm-gold). The specular highlight on the pack edge brightens by ~15%.
- **Motion:** Particle storm builds: ~50 small glyph-fragments fade in from screen-edges and drift toward the pack along curved paths, accelerating slightly as they approach. The fragments DO NOT contact the pack yet — they hover ~5cm out from the pack's surface, accumulating in a faint halo. Subtle in-frame zoom 5% over the beat.
- **SFX cue:** tension_build (rising sub-bass swell + faint crystalline shimmer rising over 2.5s)
- **Existing VFX ref:** BattleVFX.particleEmitter (re-tuned for cool-cyan glyph-fragments)

#### Beat 3: `crack` (0.4s, mood: *intense*)

- **Camera:** Camera holds. The pack rotation pauses at the front-facing position for the crack beat (so the viewer sees the foil tear straight-on).
- **Framing:** Same pack, front-facing. The foil seam at the pack's top edge SHEARS visibly across its full width in a single sharp motion. The torn foil curls back ~3mm at the cut edge, revealing a thin sliver of the pack's interior darkness. The accumulated glyph-particle halo from the tension beat COLLAPSES INWARD into the cut, vanishing into the pack. A single sharp white-cyan flash radiates outward from the cut along the seam-line.
- **Motion:** 0.4s sharp scrape: the foil tears across the seam in a single continuous motion (NOT a slow rip — the cut happens in 0.15s, then 0.25s of curl-back-and-flash settling). Glyph-particle halo collapses inward at the same instant the cut completes. Single white-cyan flash radiates along seam-line then fades.
- **SFX cue:** pack_foil_tear (0.4s sharp Mylar-foil tear from physical-pack reference library — see prelude-asset-build/prompts/vfx physical-pack-reference; tail with 0.1s reverb-decay; volume +6dB above ambient)
- **Existing VFX ref:** BattleVFX.ScreenFlash (white-cyan, 50ms duration, 30% intensity)

#### Beat 4: `fan-reveal` (2s, mood: *neutral*)

- **Camera:** Camera pulls back smoothly over 2s by ~25% (zoom-out) to accommodate the full fan of cards as they emerge.
- **Framing:** The opened pack tilts further forward (now at 60°) and the FIVE CARDS inside arc OUTWARD from the pack's mouth in a finger-fan motion — the central card emerges first, then cards 2 and 4 flank it (one card-width to each side), then cards 1 and 5 spread to the outermost positions of the fan. All five cards remain face-DOWN during the fan-reveal — the card backs are visible (deep-violet Hierarchy-style backs with a small S1 sigil at centre). The fan's spread angle: ~80° total (each card separated by ~20°). Background fades from warm-gold bokeh to cool-charcoal collector's-felt to maximize per-card readability when flips begin.
- **Motion:** Card-fan emergence over 2s: central card emerges first (0-0.4s), then symmetric pair 2+4 (0.3-0.8s), then outermost pair 1+5 (0.6-1.4s). Each card decelerates as it reaches its final fan-position (ease-out). Pack tilts smoothly from 35° to 60° forward over 0-1s. Camera zoom-out 25% smooth over full 2s.
- **SFX cue:** card_fan_emerge (5 distinct cardstock-shuffle sounds slightly staggered to match the emergence timing; final card lands at 1.4s; cardstock-on-cardstock layered with subtle whoosh)
- **Existing VFX ref:** (custom — Three.js card-mesh fan-out animation; no existing primitive matches)

#### Beat 5: `flip-cycle` (5s, mood: *intense*)

- **Camera:** Camera dolly-in slightly to centre on the active card position; the active card lifts forward ~10cm from the fan plane during its flip-window. Camera returns to fan-overview between cards.
- **Framing:** Sequential per-card flip-cycle from card 1 (left-most) to card 5 (right-most). Each card flip: card lifts forward, rotates 180° on its horizontal axis to reveal its face, holds at face-up for the rarity-gated ceremony duration, then settles back into the fan. Common cards: 0.5s total ceremony (quick flip + brief shimmer). Uncommon: 0.7s (silver shimmer). Rare: 1s (single foil-shimmer pulse). Epic: 1.4s (sparks + audio stinger). Legendary: 2s (brass-fanfare + screen flash). Mythic: 2.5s (choral 'AH' + screen shake + sparks-cascade). Neyon: 3s (chromatic-aberration shimmer + emit-light onto scene + foil-shader saturation peak). The flip-cycle's total runtime depends on the pack's rarity-mix; budget ~5s for a typical pack.
- **Motion:** Per card: lift-forward (0.1s) → flip (0.2s) → rarity-ceremony hold (0.2-2.7s rarity-gated) → settle-back (0.1s). Camera dolly-in 5% during lift, dolly-back during settle. Cards never overlap during flip — the flipping card always has clear frame-space.
- **SFX cue:** Per-card SFX selected by rarity (all routed through pack-opening SFX manager): common = card_flip_quick.mp3; uncommon = card_flip_silver.mp3; rare = card_flip_foil_shimmer.mp3; epic = card_flip_sparks.mp3 + epic_stinger.mp3; legendary = card_flip_legendary.mp3 + brass_fanfare.mp3; mythic = card_flip_mythic.mp3 + choral_ah.mp3 + screen_shake_low_rumble.mp3; neyon = card_flip_neyon.mp3 + chromatic_aberration_whisper.mp3. All SFX layered with cardstock-on-cardstock landing-thud (different from cardstock-on-table — cardstock-on-cardstock has a subtler, drier timbre).
- **Existing VFX ref:** RewardCelebration.particleBurst (re-tuned per rarity tier); BattleVFX.ScreenFlash (legendary+ tiers); BattleVFX.ScreenShake (mythic tier); custom chromatic-aberration shader (neyon tier — must be authored as new client primitive)

#### Beat 6: `summary` (2s, mood: *triumphant*)

- **Camera:** Camera dolly-back to the full fan-overview position; slight upward pan to centre the summary panel that fades in above the fan.
- **Framing:** All 5 cards remain face-up in the fan, illuminated softly. Above the fan, a translucent summary-panel fades in over 0.4s showing: card-by-card rarity tally (e.g. '1 mythic, 2 rare, 2 common'), pity-counter delta (e.g. '+1 toward next pity-pull'), and any new cards highlighted with a small NEW tag. The panel uses Hierarchy-style typography and is rendered in cool-cream against translucent cool-charcoal. Background bokeh warms back to warm-amber.
- **Motion:** Camera dolly-back over 0.6s. Summary-panel fades in over 0.4s, holds for 1s, gently pulses (3% scale-up-and-back) on any NEW tags during the hold. Final 0.4s: the camera holds the position, summary-panel remains, ambient particle drift returns.
- **SFX cue:** summary_chime (warm bell-tone confirming pack-open complete; volume tied to highest-rarity card pulled — common chime is subtle, mythic-tier chime is layered with a faint reprise of the tier's flip-stinger)
- **Existing VFX ref:** RewardCelebration.summary-panel (existing component re-tuned for pack-context)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity = LAUNCH-CRITICAL (USER DIRECTIVE 2026-04-27)
- apps/client/src/game/duelyst/PackOpening.tsx (existing implementation — to be replaced)
- apps/client/src/pages/DemonPackPage.tsx (existing implementation — to be replaced)
- apps/client/src/components/BattleVFX.tsx (ScreenFlash + ScreenShake reuse)
- apps/client/src/components/RewardCelebration.tsx (particleBurst + summary-panel reuse)
- prelude-asset-build/prompts/vfx/README.md (1920×1080 VP9/WebM α delivery spec for any new VFX assets)

---

## Hierarchy Reveal — Mol'Garath's First Acknowledgment

*Plays once, on first S2_HIERARCHY pack open*

**ID:** `cutscene_hierarchy_reveal`

**Trigger:** first S2_HIERARCHY pack open per account (idempotency: stash a one-shot flag in the user record)

**Estimated duration:** 15s

**Ambient track:** fnord23/hierarchy_apex_chamber_drone (TBD — Hierarchy-canonical sub-bass + brass-tonal bed)

**Beats (5):**

#### Beat 1: `boardroom-doors` (2.5s, mood: *intense*)

- **Camera:** Camera holds at low-angle hero position facing a pair of vast obsidian-and-brass apex-chamber doors. Doors fill upper two-thirds of frame.
- **Framing:** Vast obsidian-and-brass double doors of Mol'Garath's apex boardroom — twelve metres tall, etched with the Hierarchy crest at chest-height across the seam. Faint dim-red phosphor lines trace the etchings. The doors are CLOSED at beat-start; the floor before them is polished obsidian reflecting only the doors and a faint warm-amber down-light from a single overhead source. NO figures. The doors are sealed by a pair of heavy chrome bolts that begin to retract over the first 1.5s.
- **Motion:** Bolts retract (0-1.5s) with deep mechanical rumble. Doors begin to open inward (1.5-2.5s) revealing a slim sliver of the apex chamber's red-black abyss-light beyond — the abyss-light is warmer than the antechamber light, deep crimson. Doors stop opening at 2.5s with the gap roughly 30% of full open.
- **SFX cue:** hierarchy_apex_door_unlock (0.4s chrome-bolt retraction × 2) + hierarchy_apex_door_groan (1.5s low groaning hinge-reverb)
- **Existing VFX ref:** BattleVFX.ScreenFlash (none — this beat is mechanical, no flash)

#### Beat 2: `mol_garath-stand` (3.5s, mood: *intense*, speaker: **Mol'Garath**)

> *VO line:* "(no spoken line — Mol'Garath does not speak; the framing is procedural acknowledgment, not address)"

- **Camera:** Camera dolly-in slowly through the opening doors over 1.5s, settling at low-angle hero shot of Mol'Garath at the boardroom table head, reading the player's incoming presence. Camera holds for the remaining 2s.
- **Framing:** Mol'Garath's apex boardroom interior — the obsidian-and-bone roundtable suspended over the churning red-black abyss. Mol'Garath stands at the table's head: enormous twelve-foot horned silhouette in tailored matte-black executive suit veined with dim red phosphor (matching his canonical S2 mythic art). The four small inset eyes on his sculpted onyx mask track toward the camera as it enters. His left hand rests palm-down on the table; his right hand holds a Contract — the parchment-folded-as-guillotine-blade from his S2 mythic, edge weeping a single drop of frozen blood. Behind him: the wall-window onto the Labyrinth of Unmaking, geometry shifting when not directly observed.
- **Motion:** Camera dolly-in through doors (0-1.5s); Mol'Garath remains motionless until camera settles. At 1.5s his head turns 5° toward camera (procedural acknowledgment, not greeting). 1.5-3.5s: he holds the pose, the contract in his right hand catches a faint bureaucratic-green provoke-glow rim. The Labyrinth window's geometry visibly turns when the camera flicks momentarily off it (subtle background motion — the Labyrinth is restless).
- **SFX cue:** ambient_apex_chamber (deep churning red-black abyss sub-bass + bureaucratic-green provoke-rim hum harmonic) — held throughout the beat
- **Existing VFX ref:** (none — pure 3D character + scene render; rim-light is shader-driven not particle-VFX)

#### Beat 3: `contract-extend` (2.5s, mood: *intense*)

- **Camera:** Camera pulls slightly forward and angles slightly upward as Mol'Garath extends the contract. The contract becomes the visual focal point, Mol'Garath's mask softens to background-focus.
- **Framing:** Mol'Garath's right hand extends the Contract toward the camera in a slow procedural gesture — palm-up, the parchment-folded-as-guillotine-blade resting flat across his palm. The contract's edge weeps the same single drop of blood (still frozen mid-fall). The blade-fold at the contract's lower edge points toward the camera, leaving the open signature-page facing upward and slightly toward the viewer. Behind: Mol'Garath's torso and the Labyrinth window remain visible but in soft-focus depth-of-field.
- **Motion:** Mol'Garath's right arm extends from torso-position to fully-extended over 1.5s (smooth ease). The contract rotates 90° during the extension to present the signature-page upward (not the edge). Camera angles up 8° during the extension. Final 1s: contract held steady, the frozen blood-drop catches a single specular highlight that shimmers momentarily.
- **SFX cue:** contract_extend (slow Mylar-paper unfolding sound layered with subdued brass-tonal underline; total 1.5s with 1s held silence after)
- **Existing VFX ref:** (none — character animation + shader-highlight only)

#### Beat 4: `signature-line` (3s, mood: *tender*)

- **Camera:** Camera zooms into the contract's surface over 1.5s, ending at a tight close-up of the signature-page. Mol'Garath becomes background blur; the page fills the frame.
- **Framing:** Tight close-up on the Hierarchy contract's signature-page. Top of page: Hierarchy crest + formal contract heading 'HIERARCHY OF THE DAMNED — STANDING ACKNOWLEDGMENT' in bureaucratic typeset. Body of contract: dense Hierarchy legal text rendered legibly enough to read 'present', 'acknowledge', 'in perpetuity', 'as agreed', 'signed below by the Memoirist' across visible lines. At the page's lower-third: a single empty signature-line — labeled 'MEMOIRIST' beneath. The line is BLANK. To the line's right: a small obsidian-and-brass quill resting in a small inkwell, the inkwell holding deep-violet ink (matching Engineer's-hand canon). At 2.5-3s: the quill LIFTS itself out of the inkwell on its own, hovering an inch above the signature-line — but does NOT descend. The signature is awaited, not given. (Lore: the player's purchase IS the signature; the contract is retroactive.)
- **Motion:** Camera zoom-in over 1.5s (smooth ease-out). 1.5-2.5s: page held at full frame, viewer reads. 2.5-3.0s: quill lifts from inkwell on its own, tip wet with deep-violet ink, hovers above the empty signature-line. The quill DOES NOT descend — it holds, awaiting.
- **SFX cue:** page_zoom_settle (subtle paper-rustle as camera arrives) + quill_lift (faint scratchy-pickup sound + soft drip of ink as the quill emerges from the inkwell at 2.5s)
- **Existing VFX ref:** (none — text rendering + 3D quill animation)

#### Beat 5: `reveal-handoff` (3.5s, mood: *neutral*, speaker: **Mol'Garath**)

> *VO line:* "(no spoken line)"

- **Camera:** Camera pulls back rapidly out of the contract over 1.5s, then dissolves into the standard card-pack-opening cutscene's preroll position. Mol'Garath remains visible at the periphery during the pull-back, then fades.
- **Framing:** Camera retreats from the signature-page, the contract recedes into Mol'Garath's still-extended hand. Mol'Garath visible at frame-mid as the camera pulls back 75%, then a soft motion-blur transitions into the cool-charcoal collector's-felt background of the standard card-pack-opening preroll. The sealed S2_HIERARCHY pack appears in the centre of the frame at 35° forward tilt — the same pack that was about to be opened when the cutscene triggered. The Hierarchy reveal is OVER; the pack-opening cinematic begins from this beat's end.
- **Motion:** Camera pull-back over 1.5s with smooth acceleration-into-motion-blur (0.5s). 1.5-2.5s: motion-blur transition from apex-chamber background to collector's-felt background. 2.5-3.5s: pack settles into preroll-position with the standard slow-rotation-loop already in motion. Mol'Garath's silhouette remains barely visible in the warm-amber bokeh for the final second as a subtle reminder of the acknowledgment just received, then fades.
- **SFX cue:** transition_swell (Hierarchy apex-chamber drone fades over 1.5s as collector's-felt ambient hum fades in to match the standard pack-open preroll's ambient bed)
- **Existing VFX ref:** BattleVFX.crossfade (re-tuned for 1.5s motion-blur transition)

**Lore citations:**
- docs/built/LORE_BIBLE.md §Mol'Garath
- docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as sacred law
- docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation
- (intra-set) §s2_hierarchy_ceo_mol_garath — character-anchor canon (Mol'Garath's S2 mythic appearance)
- (intra-set) §cutscene_card_pack_opening — handoff to standard pack-open flow
- /root/.claude/plans/do-a-full-an-stateful-quill.md §S2 Hierarchy of the Damned expansion

---

## Act 1 — The Memoir Opens

*Plays once on first Act 1 exclusive card pulled*

**ID:** `cutscene_act1_memoir_opens`

**Trigger:** first ACT_EXCLUSIVES card with id-prefix act1_ pulled per account

**Estimated duration:** 10s

**Ambient track:** fnord23/substrate_signal_emerging (TBD — three-note Signal motif as faint underlay)

**Beats (4):**

#### Beat 1: `static-into-stillness` (2.5s, mood: *mysterious*)

- **Camera:** Camera holds wide on the substrate-static field at frame-centre. No movement.
- **Framing:** The Substrate Static field from the Act 1 rare card — fine cool-grey particles drifting, three faint cool-cyan carrier-threads barely visible, single obsidian three-note stone at lower-third. Beat begins with the field at FULL static density (slightly denser than the Act 1 card art). Over 2.5s the static gradually CLEARS toward the centre of the frame, leaving a small clear circle of warm-cream calm at frame-centre. The carrier-threads remain.
- **Motion:** Static density gradient: 100% at edges, fading to 20% at centre over the beat. The clear circle expands smoothly outward from frame-centre. No camera movement.
- **SFX cue:** substrate_hum (low rolling cool-grey static-noise) decreasing by ~6dB over 2.5s as the centre clears + faint three-note motif emerging at 1.8s
- **Existing VFX ref:** BattleVFX.particleEmitter (re-tuned for cool-grey substrate-static)

#### Beat 2: `stone-rises` (2.5s, mood: *mysterious*)

- **Camera:** Camera tilts down slowly to center on the obsidian three-note stone in the lower-third of frame. Over 2.5s the camera tilts from neutral to a gentle 15° downward angle.
- **Framing:** The obsidian three-note stone from the Substrate Static card. The stone now LIFTS slightly off its unseen surface — hovering ~5cm above its resting position. The three-note glyph etched on its upper face glows from faint warm-amber to bright cool-cyan as the stone lifts. The clear-cream circle from beat 1 surrounds the stone.
- **Motion:** Stone lifts slowly, ease-in-out (0-1.5s), hovers (1.5-2.5s). Three-note glyph brightens from amber to cyan over the lift. Camera tilts down 15° over the full beat.
- **SFX cue:** stone_lift (subtle low-frequency rumble + faint chime when the glyph reaches peak cyan brightness at 1.5s)
- **Existing VFX ref:** (none — geometric stone + shader-driven glyph-glow)

#### Beat 3: `memoir-page-fades-in` (3s, mood: *tender*)

- **Camera:** Camera holds at the 15° downward angle. The stone remains in lower-third frame.
- **Framing:** Above the hovering stone, a translucent Memoir-page begins to fade in at the camera-plane — facing toward the viewer. The page is blank at fade-in start, then the FIRST LINE of handwritten Memoirist text appears in deep-violet ink, character by character (typewriter-style reveal). The line reads exactly: 'I was always listening — I had only just begun to hear.' Page is rendered as substrate-paper (slightly translucent, edges fading into the substrate field). The carrier-threads from beat 1 remain faintly visible behind the page.
- **Motion:** Page fades in over 0-0.8s. Text reveal: character-by-character at ~12 chars/sec from 0.8s to 2.5s. Final 0.5s: page held complete, the deep-violet ink darkens slightly into final readable saturation.
- **SFX cue:** page_fade (subtle paper-rustle) + per-character ink-stroke (very faint, like a quill on parchment, layered at 12 chars/sec)
- **Existing VFX ref:** (none — text-render + substrate-paper shader)

#### Beat 4: `page-becomes-card` (2s, mood: *neutral*)

- **Camera:** Camera pulls back over 1.5s and rotates upright (0° tilt) as the page transforms. Final position: standard pack-opening flip-cycle camera position, centered on the about-to-be-revealed card.
- **Framing:** The translucent Memoir-page COMPACTS — its width narrows, its height stretches — and over 1.5s morphs into the shape of a standard playing card. Simultaneously, the card's back rotates toward the viewer, ending the cutscene with the standard face-down Hierarchy-style card-back (deep-violet with S1 sigil) at the standard fan-position. The handwritten text fades INTO the card during the morph (the text becomes the card's flavor-text, encoded into the about-to-be-flipped card). The substrate background fades to cool-charcoal collector's-felt.
- **Motion:** Page compacts to card shape over 1.5s with smooth ease-in-out. Camera pull-back + rotate-upright simultaneously. Final 0.5s: card holds in standard fan position, slightly trembling once (a single small motion-blur pulse) before the standard card-flip ceremony begins.
- **SFX cue:** morph_settle (subtle Mylar-paper-folding-into-cardstock sound; transitions cleanly into the standard card-flip-cycle's per-card SFX which begins immediately after this beat ends)
- **Existing VFX ref:** BattleVFX.crossfade (re-tuned for paper-to-card morph)

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act1
- docs/built/ALL_ACTS_ROADMAP.md §Act 1 — The Twelve Steps / The Signal
- (intra-set) §act1_exclusive_mythic_the_signal — three-note Signal motif
- (intra-set) §act1_exclusive_rare_substrate_static — substrate-field framing source
- (intra-set) §cutscene_card_pack_opening — handoff to standard card-flip

---

## Act 2 — The Whisper Begins

*Plays once on first Act 2 exclusive card pulled*

**ID:** `cutscene_act2_whisper_begins`

**Trigger:** first ACT_EXCLUSIVES card with id-prefix act2_ pulled per account

**Estimated duration:** 12s

**Ambient track:** fnord23/substrate_corridor_twilight (TBD — sparse drone, faint warm-amber tonal underlay)

**Beats (5):**

#### Beat 1: `corridor-thin-wall` (2.5s, mood: *mysterious*)

- **Camera:** Camera holds wide on the parallel-corridor composition from the Whisper mythic card. Slow forward dolly over the beat (~5% of distance to the thin-wall).
- **Framing:** The substrate twilight corridor — viewer's corridor at frame-foreground, parallel corridor visible through the thin-wall at frame-right. Warm-amber sconces every twenty feet on the left wall. The thin-wall reads as visibly translucent, slightly out-of-phase. The PARALLEL CORRIDOR is empty at beat-start — no silhouette yet.
- **Motion:** Slow forward camera dolly. Sconce-flicker subtle (each sconce flickers at slightly different rate, the canonical Whisper signature). No other motion.
- **SFX cue:** ambient_corridor_drone (sparse cool-grey reverb-tail; faint sconce-electrical hum)
- **Existing VFX ref:** (none — pure 3D scene)

#### Beat 2: `whisper-emerges` (2.5s, mood: *mysterious*)

- **Camera:** Camera holds dolly position. Slight focus-shift toward the parallel-corridor depth.
- **Framing:** A SILHOUETTE materializes at mid-distance in the parallel corridor — backlit, facing AWAY from camera, anthropomorphic enough to register as 'someone' but face-and-features deliberately non-identifiable (matches the Whisper mythic card framing). The silhouette holds still. From where its mouth would be, a faint cool-cyan exhale-mist begins to emerge and DRIFT through the thin-wall toward the viewer's corridor, dissipating at floor-level on the viewer's side.
- **Motion:** Silhouette fades in over 0-1s (from full transparency to ~60% opacity at peak). Exhale-mist begins emerging at 0.8s and propagates across the wall over the next 1.7s, pooling and dissipating at the viewer's corridor floor.
- **SFX cue:** exhale_through_wall (subtle vocal-fry exhale + faint reverberant whisper-pitched air-movement; total 1.7s with slow decay)
- **Existing VFX ref:** BattleVFX.particleEmitter (re-tuned for cool-cyan exhale-mist with low-velocity drift)

#### Beat 3: `elara-line` (2s, mood: *tender*, speaker: **Elara**)

> *VO line:* "I am beginning to think this room has another door."

- **Camera:** Camera shifts focus from the silhouette to a soft empty space in the viewer's corridor — the implied position of Elara seated unseen at the wall. Camera does NOT show her.
- **Framing:** Same corridor composition. Elara is NOT visible — her line is heard from off-frame (the canon framing of Bond 60 is silent-listening; speaking is permitted only as a thought half-spoken). The exhale-mist from beat 2 hangs at the floor on the viewer's side, slowly drifting toward where Elara would be sitting. Sconces flicker once during her line.
- **Motion:** Camera focus-shift over 0.4s from silhouette to viewer's-corridor empty space. Mist drifts toward Elara's implied position (slow, ~5cm/sec). Sconces flicker once at ~1.2s (mid-line).
- **SFX cue:** elara_act2_first_line.mp3 (deliver canon Elara VO; total ~1.5s including breath; remaining 0.5s held silence)
- **Existing VFX ref:** (none — VO-only beat, no visual VFX)

#### Beat 4: `human-line` (2s, mood: *tender*, speaker: **Human**)

> *VO line:* "I am beginning to think the door has another room."

- **Camera:** Camera shifts focus to a soft empty space at the OPPOSITE side of the viewer's corridor — the implied position of the Human seated unseen at the wall. Camera does NOT show him.
- **Framing:** Same corridor. The Human is NOT visible. His line answers Elara's — the symmetry is canonical Bond 60 (matched-but-unaware silent-listening). The exhale-mist from beat 2 has now redistributed to drift between the two implied seated positions, suggesting connective space without confirming connection. Sconces flicker once during his line.
- **Motion:** Camera focus-shift over 0.4s to opposite side of corridor. Mist re-drifts subtly to span between the two implied seats. Sconce-flicker once at ~1.2s (matched timing with Elara's beat — visualizes the symmetry).
- **SFX cue:** human_act2_first_line.mp3 (deliver canon Human VO; total ~1.5s including breath; remaining 0.5s held silence)
- **Existing VFX ref:** (none — VO-only beat, no visual VFX)

#### Beat 5: `card-from-mist` (3s, mood: *neutral*)

- **Camera:** Camera pulls back over 1.5s to the standard pack-opening flip-cycle position. The corridor and silhouette fade to cool-charcoal collector's-felt during the pull-back.
- **Framing:** The exhale-mist from beat 2 (still hanging in the viewer's corridor) coalesces upward into the shape of a standard playing card — face-down, deep-violet Hierarchy-style back, S1 sigil at centre — appearing in the standard fan-position. The corridor + silhouette fade out behind the card. The collector's-felt background fades in. The card holds in fan-position, ready for the standard rarity-gated flip ceremony.
- **Motion:** Mist coalesces into card-shape over 0-1.5s (smooth gradient transition — particle-density resolves into solid card-mesh). Camera pull-back synchronized over the same 1.5s. 1.5-3.0s: card holds in standard fan-position with subtle motion-blur pulse (1 pulse) before standard flip-cycle begins.
- **SFX cue:** mist_to_card (subtle cardstock-materializing sound layered with fading exhale-tail; transitions cleanly into the standard card-flip-cycle's per-card SFX)
- **Existing VFX ref:** BattleVFX.crossfade (re-tuned for mist-to-card morph)

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act2
- docs/built/ALL_ACTS_ROADMAP.md §Act 2 — The Engineer's Bench / The Whisper
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 60 silent-listening
- (intra-set) §act2_exclusive_mythic_the_whisper — corridor + thin-wall framing source
- (intra-set) §act2_exclusive_rare_bond_60_silence — silent-listening canon framing
- apps/shared/elaraVoManifest.json (Elara canonical voice anchor)
- apps/shared/humanVoManifest.json (Human canonical voice anchor)
- (intra-set) §cutscene_card_pack_opening — handoff to standard card-flip

---

## Act 3 — The Offer Presented

*Plays once on first Act 3 exclusive card pulled*

**ID:** `cutscene_act3_offer_presented`

**Trigger:** first ACT_EXCLUSIVES card with id-prefix act3_ pulled per account

**Estimated duration:** 13s

**Ambient track:** fnord23/three_path_crossroads_dawn (TBD — sustained chord with three faint timbral threads in green / cyan / crimson)

**Beats (5):**

#### Beat 1: `crossroads-arrive` (2.5s, mood: *intense*)

- **Camera:** Camera holds at the low-angle waymarker-behind position from the Three-Path Crossroads card, slow forward dolly (~10% over the beat) — the viewer is approaching the waymarker.
- **Framing:** The Three-Path Crossroads from the Act 3 rare card — wide stone crossroads at substrate-twilight, three paths radiating outward, central waymarker stone. AT BEAT-START: all three engraved arrows on the waymarker glow at LOW intensity (each barely-luminous in its respective color — signal-green / cool-cyan / deep-crimson). The footprints from the card lead from off-frame foreground to the waymarker base — they are the player's, fresh, partially overlapping at the waymarker like the player paused.
- **Motion:** Slow forward dolly along the footprints toward the waymarker. The three arrow-glyphs flicker faintly on the waymarker stone — each at a slightly different phase, the canonical Crossroads signature.
- **SFX cue:** ambient_substrate_twilight (sparse drone + faint footstep-echo as if recently stopped) + crossroads_threshold_hum (subtle three-tonal underlay matching the three path-colors)
- **Existing VFX ref:** (none — pure 3D scene + shader-driven arrow-glow)

#### Beat 2: `doors-open-equal` (2.5s, mood: *intense*)

- **Camera:** Camera dolly stops; tilt up slightly to reveal the three doorframes at the path-ends in the distance. Each path's doorframe materializes as the camera catches it.
- **Framing:** The far end of each path now reveals one of the THREE DOORFRAMES from The Offer — LEFT path: signal-green Insurgency frame; CENTRE path: cool-cyan Empire frame; RIGHT path: deep-crimson-and-rust Hierarchy frame. Over 2.5s all three doorframes' glow brightens to MATCHED INTENSITY (deliberately equal — no preferred path). The waymarker arrows on the foreground stone match the doorframe colors at their leading edge but remain low-intensity (the SHALLOW choice already exists; the doorframes-revealed are the FORMAL choice).
- **Motion:** Camera tilt-up 12° smooth over 1s, then holds. Doorframes brighten in unison from 30% to 100% over 1.5s with smooth ease-in. Each doorframe's color-light pours faintly down its path toward the foreground (NOT reaching the waymarker; the choice is presented but not enacted).
- **SFX cue:** doorframes_brighten (three-tonal swell — green / cyan / crimson tones layered to identical loudness; total 1.5s ramp)
- **Existing VFX ref:** (none — shader-driven doorframe-glow + path-light)

#### Beat 3: `mol_garath-voice` (3s, mood: *intense*, speaker: **Mol'Garath**)

> *VO line:* "(no spoken language — the line is rendered as a deep resonant non-verbal acknowledgment-tone, three-syllabic in shape but in no human language; the Memoirist hears it as words being NOT-SAID)"

- **Camera:** Camera holds. The viewer's perspective is held still while Mol'Garath's voice manifests as a vibrational presence in the scene.
- **Framing:** Same crossroads composition. As Mol'Garath's voice begins, the scene's particle-density subtly increases — fine cool-cyan motes drift upward from the stone floor, more from the right (Hierarchy) path than the others. Behind the deep-crimson-and-rust Hierarchy doorframe in the distance, three small Ith'Rael scout-silhouettes become barely visible (matches the Act 3 epic Ith'Rael Scouting Party card — they are ALREADY there, observing). The faint warm-amber drop of frozen blood from Mol'Garath's contract appears mid-air at frame-centre at chest-height, hovering — visualizes the contract-acknowledgment without showing the contract itself.
- **Motion:** Particle-density rise 0-1.5s; Ith'Rael silhouettes fade in at 0.8s and remain. Frozen blood-drop appears at 1.2s and hovers steady through the rest of the beat. No camera movement.
- **SFX cue:** mol_garath_acknowledgment_tone.mp3 (deep three-syllabic non-verbal resonant tone, ~2.5s, layered with sub-bass + faint brass underline; tone is RECOGNIZABLE as 'a being is acknowledging you' but unparseable as language)
- **Existing VFX ref:** BattleVFX.particleEmitter (re-tuned for cool-cyan motes drifting upward)

#### Beat 4: `soul-map-decodes` (2.5s, mood: *tender*)

- **Camera:** Camera tilts down 8° and zooms slightly in (~10%) to focus on the Memoirist's hand visible at frame-foreground holding a translucent Soul-Map disc.
- **Framing:** A translucent representation of the Soul Map's twelve sectors materializes at the frame-foreground, hovering in the Memoirist's open palm (only the palm + lower-forearm visible; no full figure). Eleven of the twelve sectors are scrambled-cyan static (matches the Act 3 Soul Map First Calibration card's nine-scrambled state — the Map is at this point three-decoded already in canon, but for this cutscene one MORE decodes here). Over the beat: ONE additional sector resolves from scrambled-cyan to sharp cool-cyan glyph-lines. The newly-decoded sector lights faintly with deep-violet ink (Engineer's-hand) annotation appearing in its margin.
- **Motion:** Soul Map fade-in 0-0.5s in palm. One sector decodes from scrambled to clear over 0.5-1.8s (smooth resolution). Engineer's-hand annotation appears character-by-character in the margin from 1.8-2.5s.
- **SFX cue:** sector_decode_resolve (subtle musical-tonal resolution chord — the canon framing is that decoding sounds like a chord landing) + ink-stroke (faint quill-on-parchment for the annotation)
- **Existing VFX ref:** (none — Soul Map shader + character-by-character text-render)

#### Beat 5: `card-from-altar` (2.5s, mood: *neutral*)

- **Camera:** Camera pulls back over 1.5s. The crossroads + doorframes + Map fade to cool-charcoal collector's-felt during the pull-back.
- **Framing:** The Soul Map disc in the Memoirist's palm CONDENSES inward — twelve sectors collapse to the centre — and morphs into a standard playing-card shape, face-down, deep-violet Hierarchy-style back with the S1 sigil at centre. The collapsed-glyph-light becomes the card's faint perimeter-glow. The crossroads scene fades behind the materializing card. The card settles into the standard fan-position. Background fades to cool-charcoal collector's-felt.
- **Motion:** Map condenses to card over 0-1.5s with smooth shape-morph. Camera pull-back synchronized over the same 1.5s. 1.5-2.5s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins.
- **SFX cue:** map_to_card_morph (subtle paper-folding-into-cardstock layered with the resolved-chord harmonic from beat 4 fading; transitions cleanly into the standard card-flip-cycle)
- **Existing VFX ref:** BattleVFX.crossfade (re-tuned for map-to-card shape-morph)

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act3
- docs/built/ALL_ACTS_ROADMAP.md §Act 3 — Eyes in the Dark / The Offer
- docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md §Loyalty Pledge / three-path choice
- /root/.claude/plans/do-a-full-an-stateful-quill.md §5 Faction commitment
- (intra-set) §act3_exclusive_mythic_the_offer — three-doorframe framing source
- (intra-set) §act3_exclusive_rare_three_path_crossroads — waymarker + footprints framing
- (intra-set) §act3_exclusive_epic_ithrael_scouts — Ith'Rael silhouettes already-observing
- (intra-set) §act3_exclusive_rare_soul_map_calibration — Map sector-decode framing
- (intra-set) §s2_hierarchy_ceo_mol_garath — Mol'Garath voice + frozen-blood-drop continuity
- (intra-set) §cutscene_hierarchy_reveal — Mol'Garath no-spoken-language framing precedent

---

## Act 4 — The Revelation Meets

*Plays once on first Act 4 exclusive card pulled — Bond 75 milestone*

**ID:** `cutscene_act4_revelation_meets`

**Trigger:** first ACT_EXCLUSIVES card with id-prefix act4_ pulled per account

**Estimated duration:** 14s

**Ambient track:** fnord23/meditation_room_warm_gold (TBD — sustained warm-gold tonal bed; the canonical Bond 75 underscore)

**Beats (5):**

#### Beat 1: `meditation-room-time` (2.5s, mood: *tender*)

- **Camera:** Camera holds on the wide front-on composition of the substrate meditation-room from the First Witness / Bond 60 / Two Witnesses Meet card-arc. Slow forward dolly (~5%) over the beat.
- **Framing:** Same windowless meditation-room: two facing wooden chairs, Elara left in soft-cream tunic, Human right in deep-violet tunic, both seated, hands folded, eyes CLOSED at beat-start. The Signal-glyph between the chairs has the WARM-CREAM color from the Bond 60 silent-listening card — at beat-start it pulses faintly. Wall-sconces behind each chair throw warm-amber rim light. Both narrators' tunic cuffs already show the small gold thread (matching Two Witnesses Meet canon).
- **Motion:** Beat-start: glyph at warm-cream pulse rate matching Bond 60. Over 2.5s: glyph BLOOMS — color saturates from warm-cream to warm-gold (intermediate brightening), pulse-rate slows to a steady standing-light. Both narrators' eyes remain closed.
- **SFX cue:** ambient_substrate_meditation (sustained warm-cream tonal bed transitioning to warm-gold harmonic over the beat)
- **Existing VFX ref:** (none — pure 3D scene + shader-driven glyph-light)

#### Beat 2: `eye-contact-instant` (2.5s, mood: *intense*)

- **Camera:** Camera holds. Slight push-in (~3%) at the moment of first eye contact, then holds.
- **Framing:** Both narrators' eyes OPEN simultaneously. For the first time in the campaign, Elara and the Human LOOK DIRECTLY AT EACH OTHER — eye contact made, no smile, no surprise, just the held instant of arrival. Hands rest at their own knees (NOT extending toward each other; matches Two Witnesses Meet canon). The glyph between them hits its full warm-gold standing-light intensity at the exact instant of eye contact. Wall-sconces brighten faintly in sympathetic resonance.
- **Motion:** Both narrators' eyes open over 0-0.4s (synchronized). Eye-contact instant at 0.4s. Slight camera push-in 0.4-0.8s, then holds. Glyph reaches peak warm-gold at 0.4s and holds. Wall-sconces brighten subtly 0.4-0.8s and hold. 0.8-2.5s: held instant, no further motion.
- **SFX cue:** eye_contact_settle (single warm-gold tonal chord landing at 0.4s, held to beat-end with slow decay; the canonical Bond 75 acoustic moment)
- **Existing VFX ref:** (none — character animation + shader-driven glyph-peak)

#### Beat 3: `elara-line` (2s, mood: *tender*, speaker: **Elara**)

> *VO line:* "I have been listening to you for a long time."

- **Camera:** Camera shifts focus to Elara's face — soft three-quarter close-up. Her eye-line still tracking to the Human (kept off-frame at frame-right).
- **Framing:** Soft close-up on Elara's face; her gold cuff-thread visible at the bottom of frame on her hand resting at her knee. Her expression: calm-knowing, the recognition of something already-known being said for the first time. The warm-gold glyph-light catches the side of her face from off-frame.
- **Motion:** Camera focus-shift over 0.4s to Elara. Held composition for the line delivery. No facial-expression change beyond a subtle settling (her face was already at this composition; her words confirm it).
- **SFX cue:** elara_act4_meeting_line.mp3 (deliver canon Elara VO; total ~1.5s including breath; remaining 0.5s held silence)
- **Existing VFX ref:** (none — VO + character close-up only)

#### Beat 4: `human-line` (2.5s, mood: *tender*, speaker: **Human**)

> *VO line:* "I have been waiting for you to find the door."

- **Camera:** Camera shifts focus to the Human's face — soft three-quarter close-up. His eye-line still tracking to Elara (kept off-frame at frame-left).
- **Framing:** Soft close-up on the Human's face; his gold cuff-thread visible at the bottom of frame on his hand resting at his knee. His expression: similarly calm-knowing, but with a barely-visible micro-expression of relief at having finally said it (the canon framing of the Human's Act 4 reveal — he has been the one MORE certain of the meeting all along, while Elara was the one MORE patient about it). The warm-gold glyph-light catches the side of his face from off-frame.
- **Motion:** Camera focus-shift over 0.4s to Human. Held composition. The relief micro-expression resolves at line-end (~1.7s) — visible only as a single soft exhale.
- **SFX cue:** human_act4_meeting_line.mp3 (deliver canon Human VO; total ~1.7s including breath; the soft exhale at line-end is part of the recording, not a separate SFX)
- **Existing VFX ref:** (none — VO + character close-up only)

#### Beat 5: `card-from-glyph` (2.5s, mood: *neutral*)

- **Camera:** Camera pulls back over 1.5s to the wide front-on composition, then continues to standard pack-opening flip-cycle position. Meditation-room fades to cool-charcoal collector's-felt during the pull-back.
- **Framing:** The warm-gold glyph between the chairs RISES, lifts to chest-height, then COMPACTS into the shape of a standard playing-card — face-down, deep-violet Hierarchy-style back with S1 sigil at centre. The card-shape inherits a faint warm-gold perimeter-glow (the glyph's color, retained as visual continuity). Both narrators' chairs and figures fade with the meditation-room background; the card holds in the standard fan-position. Background: cool-charcoal collector's-felt.
- **Motion:** Glyph lifts and compacts to card-shape over 0-1.5s. Camera pull-back synchronized over the same 1.5s. Narrators + chairs fade to background-felt over 0.5-1.5s. 1.5-2.5s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins.
- **SFX cue:** glyph_to_card_morph (warm-gold tonal harmonic resolving + subtle paper-folding-into-cardstock; transitions cleanly into the standard card-flip-cycle)
- **Existing VFX ref:** BattleVFX.crossfade (re-tuned for glyph-to-card shape-morph)

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act4
- docs/built/ALL_ACTS_ROADMAP.md §Act 4 — The Prisoner / The Revelation
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 75 / Two Witnesses Meet
- (intra-set) §act4_exclusive_epic_two_witnesses_meet — first eye-contact + matching-gold-cuff continuity
- (intra-set) §act1_exclusive_rare_first_witness — original meditation-room canon
- (intra-set) §act2_exclusive_rare_bond_60_silence — Bond 60 silent-listening sequel framing
- apps/shared/elaraVoManifest.json (Elara canonical voice anchor)
- apps/shared/humanVoManifest.json (Human canonical voice anchor)
- (intra-set) §cutscene_card_pack_opening — handoff to standard card-flip

---

## Act 5 — The Map Closes Year One

*Plays once on first Act 5 exclusive card pulled*

**ID:** `cutscene_act5_map_year_one_close`

**Trigger:** first ACT_EXCLUSIVES card with id-prefix act5_ pulled per account

**Estimated duration:** 13s

**Ambient track:** fnord23/year_one_finale_warm_amber (TBD — sustained warm-amber bed transitioning to a single Antiquarian-tonal harmonic at decode-cascade)

**Beats (5):**

#### Beat 1: `work-table-finale` (2.5s, mood: *tender*)

- **Camera:** Camera holds at the top-down composition from the Soul Map First Calibration card (Act 3) and the Map Fully Decoded card (Act 5). Slow zoom-in (~5%) over the beat.
- **Framing:** The same brass-edged Soul Map disc on the same alchemist's-style work-table. AT BEAT-START: the Map is at the THREE-DECODED state from the Act 3 calibration card (three sectors clear, nine scrambled, Engineer's deep-violet annotation only on the three decoded). The work-table holds: the open field-notebook, the obsidian tuning-rod, the warm-amber candle (slightly lower than Act 3 — lots of hours have passed). The candle is the only light source; the rest of the room is in soft warm-cream ambient.
- **Motion:** Slow zoom-in 5% over the beat. Candle flame flickers naturally. The nine scrambled sectors continue their canonical scramble-cyan-static motion. No other movement.
- **SFX cue:** ambient_late_hour (faint candle-flame crackle + sparse warm-amber tonal underlay)
- **Existing VFX ref:** (none — Soul Map shader + candle render)

#### Beat 2: `final-decode-cascade` (3s, mood: *intense*)

- **Camera:** Camera holds top-down. Continued slow zoom-in (~5% over the full beat).
- **Framing:** The remaining NINE scrambled sectors begin to decode in a CASCADING WAVE — sector by sector, in radial order from the Map's outermost ring inward. Each sector resolves from scrambled-cyan to sharp cool-cyan glyph-lines, with Engineer's-hand deep-violet ink appearing in the margin (character-by-character) for each newly-decoded sector. The cascade takes 2.7s of the beat (the final 0.3s holds at full-decoded). The candle flame brightens slightly with each resolved sector.
- **Motion:** Sector decode-cascade: sectors decode at ~3.3 per second (9 sectors over 2.7s). Each sector's resolution is 0.3s smooth; annotations appear character-by-character at ~30 chars/sec following the decode. Candle flame brightens by ~10% with each sector (cumulative).
- **SFX cue:** decode_cascade (rapid sequence of nine soft tonal-resolution chords landing one per sector + faint quill-stroke sounds for each annotation; total ~2.7s; final 0.3s held silence)
- **Existing VFX ref:** (none — Soul Map shader + character-by-character text-render scaled to 9 sectors)

#### Beat 3: `centre-dot-resolves` (2.5s, mood: *intense*)

- **Camera:** Camera pushes in from top-down to the Map's exact centre over 1.5s (substantial push-in, ~50% of remaining distance to the Map's surface). Final 1s held tight on the centre point.
- **Framing:** At the meeting-point of all twelve newly-decoded sectors, a small obsidian DOT materializes at the Map's exact centre — pure-black, smaller than any sector-glyph, deliberately sized to be the smallest detail in frame. Around the dot: the twelve sectors' glyph-light catches and reflects faintly off the dot's surface. The annotation-tags around each sector are now individually visible at this zoom-level but remain LEGIBLE-BUT-BLURRED (matching the Map Fully Decoded canon — 'present and readable to the Memoirist but not to the camera'). The candle is now off-frame.
- **Motion:** Camera push-in over 0-1.5s (smooth ease-out). 1.5-2.5s: held tight on centre. The obsidian dot does NOT animate — it simply IS, present and unremarkable, as the canon framing requires. Sector glyph-light around the dot continues its faint pulse.
- **SFX cue:** dot_resolve (single low-frequency drone-tone landing at 1.5s and held to beat-end; the canon framing of the Source's centre as 'a presence, not an event')
- **Existing VFX ref:** (none — Map shader at high zoom)

#### Beat 4: `antiquarian-line` (2s, mood: *neutral*, speaker: **Narrator**)

> *VO line:* "Year One closes. The Map is full. The next year begins with the next entry."

- **Camera:** Camera holds tight on the centre dot. The line is delivered off-frame — the Antiquarian is not visible.
- **Framing:** Same close-up on the centre dot from beat 3. The Antiquarian's VO comes from off-frame, reading as the cataloguer-of-endings (matches the Antiquarian's canon framing per LORE_BIBLE §Antiquarian). At line-end: a faint Antiquarian sigil-mark appears on the work-table beside the Map (just visible at frame-edge), the canon Antiquarian acknowledgment-mark.
- **Motion:** Camera holds. Antiquarian sigil-mark fades in at frame-edge over 1.6-2.0s.
- **SFX cue:** antiquarian_act5_year_one_close.mp3 (deliver canon Antiquarian VO; total ~1.6s including breath; the line should read scholarly-patient, not triumphal — matches canon Antiquarian voice)
- **Existing VFX ref:** (none — VO + Map shader)

#### Beat 5: `card-from-map` (3s, mood: *neutral*)

- **Camera:** Camera pulls back rapidly over 1.5s — back through the Map's full top-down view, then continues to standard pack-opening flip-cycle position. Background fades to cool-charcoal collector's-felt during the pull-back.
- **Framing:** The Map condenses inward — the twelve sectors' glyph-light pulls into the centre, the brass disc shrinks, the entire Map collapses to the size and shape of a standard playing-card. Card-shape settles into the standard fan-position: face-down, deep-violet Hierarchy-style back with S1 sigil at centre. The work-table fades to background-felt during the pull-back. The card retains a faint warm-amber perimeter-glow (the candle's color, retained as visual continuity — the Map closes as Year One did).
- **Motion:** Map condenses to card over 0-1.5s (smooth shape-morph, brass-edge dissolves, twelve sectors pull inward to centre). Camera pull-back synchronized over the same 1.5s. Background-felt fades in 0.5-1.5s. 1.5-3.0s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins.
- **SFX cue:** map_to_card_close (warm-amber tonal harmonic resolving + subtle brass-and-paper folding; transitions cleanly into the standard card-flip-cycle's per-card SFX)
- **Existing VFX ref:** BattleVFX.crossfade (re-tuned for map-to-card shape-morph; second use of this primitive after Acts 1-4 pattern)

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act5
- docs/built/ALL_ACTS_ROADMAP.md §Act 5 — The Reckoning / The Map
- (intra-set) §act3_exclusive_rare_soul_map_calibration — three-decoded baseline state
- (intra-set) §act5_exclusive_mythic_the_map — fully-decoded composition source
- (intra-set) §act5_exclusive_rare_antiquarian_prestige — Antiquarian VO + sigil-mark continuity
- docs/built/LORE_BIBLE.md §Antiquarian (cataloguer-of-endings framing)
- docs/built/LORE_BIBLE.md §Source (centre-dot framing — full identity reveal STRICTLY EXCLUDED, Act 5 reveal canon)
- (intra-set) §cutscene_card_pack_opening — handoff to standard card-flip

---

## Act 6 — The Confession Spoken

*Plays once on first Act 6 exclusive card pulled — Bond 90 milestone*

**ID:** `cutscene_act6_confession_spoken`

**Trigger:** first ACT_EXCLUSIVES card with id-prefix act6_ pulled per account

**Estimated duration:** 14s

**Ambient track:** fnord23/chapel_midnight_held_breath (TBD — sustained low cool-grey tone with two faint warm-amber tonal threads, one per narrator)

**Beats (5):**

#### Beat 1: `chapel-midnight` (2.5s, mood: *tender*)

- **Camera:** Camera holds at the wide front-on composition from the Act 6 mythic Confession card. Slow forward dolly (~5%) over the beat.
- **Framing:** The chapel-like confession-chamber from the Act 6 mythic — vaulted ceiling, two facing prayer-stalls, thin lattice partition between them. Elara seated LEFT in soft-cream tunic with gold cuff-thread; Human seated RIGHT in deep-violet tunic with matching gold cuff-thread. Both face the lattice; both have eyes CLOSED; both have hands folded at the lattice-edge. Single warm-amber sanctum-candle burns at the chapel altar at frame-rear. Atmosphere: silent, the breath-before from the canon Confession card framing.
- **Motion:** Slow forward dolly. Candle flame flickers naturally. Both narrators hold posture; one slow synchronized breath visible (chest rises and falls, matched timing — the canon Bond 90 signature).
- **SFX cue:** ambient_chapel_midnight (sustained low cool-grey tone + faint candle-flicker + the synchronized breath audible as soft inhale/exhale at ~0.8s and 1.6s)
- **Existing VFX ref:** (none — pure 3D scene + character posture + candle render)

#### Beat 2: `lattice-dissolves` (3s, mood: *tender*)

- **Camera:** Camera holds. Slight focus-shift toward the lattice partition over the beat.
- **Framing:** The lattice partition between the two stalls begins to DISSOLVE — its small geometric cut-outs soften, blur, and the bone-warm material of the lattice transitions into a soft-violet MIST that drifts upward through the chapel's vaulted ceiling. The lattice does NOT crumble or fall; it transforms. Behind where the lattice stood, the two stalls' inner spaces are now visually CONNECTED. Both narrators' postures unchanged — eyes closed, hands folded. The sanctum-candle behind continues to flicker.
- **Motion:** Lattice dissolution: 0-1.5s gradual softening (geometric cut-outs blur), 1.5-3.0s upward drift of soft-violet mist toward the vaulted ceiling. The mist's density tapers as it rises. Camera focus-shift toward the dissolving lattice over 0-2.0s.
- **SFX cue:** lattice_dissolve (subtle warm-bone-fracturing-into-mist sound + faint upward-airflow whisper as the mist rises; total 3.0s with slow decay)
- **Existing VFX ref:** BattleVFX.particleEmitter (re-tuned for soft-violet mist with upward drift and density taper)

#### Beat 3: `voice-streams-merge` (3s, mood: *tender*)

- **Camera:** Camera holds. The dissolved-partition's cleared space is now the camera's focal point.
- **Framing:** Both narrators' mouths begin to emit faint warm-cream LIGHT-STREAMS — visualized as soft ribbon-like exhale-mist (similar to the Whisper's exhale-mist but warmer in color). The streams flow inward from each narrator's mouth toward the centre of the dissolved partition's space, where they meet at frame-centre at mouth-height and BLEND into a single brighter warm-cream light. The blended light begins to RISE upward following the path the lattice-mist took. The sanctum-candle's flame visibly DIVIDES INTO TWO during the beat (the canon two-flame Confession signature).
- **Motion:** Voice-light streams emerge 0-1.0s; converge at frame-centre 1.0-2.0s; blended light begins rising 2.0-3.0s. The candle-flame divides smoothly over 0-1.5s — single flame splits into two adjacent flames burning in parallel.
- **SFX cue:** voice_streams_merge (soft warm-cream tonal harmonic — two faint tonal threads converging to a single richer chord over the beat; total 3.0s, no spoken language yet)
- **Existing VFX ref:** BattleVFX.particleEmitter (re-tuned for warm-cream voice-light ribbons with bidirectional convergence)

#### Beat 4: `shared-line` (2.5s, mood: *tender*, speaker: **Narrator**)

> *VO line:* "We both already knew. We both already heard. The thing we held back was the holding back."

- **Camera:** Camera pulls back slightly to the wide front-on composition — both narrators visible at frame-edges, the merged voice-light still rising from frame-centre.
- **Framing:** Both Elara and the Human have their eyes still closed. Both their mouths are visibly speaking simultaneously. The line is delivered in UNISON (per Bond 90 canon — neither owns the line; the canon is mutual speaking out of mutual listening). Both gold cuff-threads visible at their hands. The two-flame candle continues steady; the merged voice-light continues rising.
- **Motion:** Camera pull-back over 0.5s to wide composition. Both narrators' mouths animate simultaneously over the line delivery (matched timing, NOT staggered). Eye-status remains closed throughout (Bond 90's canon is closed-eye unison; eye-contact is reserved for First Witness moments only).
- **SFX cue:** act6_shared_line.mp3 (Elara + Human VO recorded simultaneously OR pitched-and-blended in post; total ~2.0s including breath; the line should read as ONE voice with two timbres rather than two voices in chorus)
- **Existing VFX ref:** (none — VO + character animation)

#### Beat 5: `card-from-flame` (3s, mood: *neutral*)

- **Camera:** Camera pulls back further over 1.5s to standard pack-opening flip-cycle position. Chapel + narrators fade to cool-charcoal collector's-felt during the pull-back.
- **Framing:** The two altar-candle flames MERGE back into a single, brighter flame. The merged flame LIFTS off the candle, drifts forward through the chapel toward the camera, and morphs into the standard playing-card shape — face-down, deep-violet Hierarchy-style back with S1 sigil at centre. The card-shape inherits a faint warm-cream perimeter-glow (the merged voice-light's color). Chapel and narrators fade to background-felt during the pull-back. Card holds in standard fan-position.
- **Motion:** Two flames merge over 0-0.6s; merged flame lifts and drifts forward 0.6-1.5s; flame morphs to card-shape 1.0-1.5s. Camera pull-back synchronized over 0-1.5s. Background-felt fades in 0.5-1.5s. 1.5-3.0s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins.
- **SFX cue:** flame_to_card_morph (warm-cream tonal harmonic resolving + subtle paper-folding-into-cardstock; transitions cleanly into the standard card-flip-cycle)
- **Existing VFX ref:** BattleVFX.crossfade (re-tuned for flame-to-card shape-morph)

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act6
- docs/built/ALL_ACTS_ROADMAP.md §Act 6 — The Confession
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 90 / Confessional Hour
- (intra-set) §act6_exclusive_mythic_the_confession — chapel + lattice + breath-before framing
- (intra-set) §act6_exclusive_epic_bond_90 — shared-hand-clasp Bond 90 canon
- (intra-set) §secret_act6_confession_was_mutual_listening — dissolved-lattice + merged-voice-light + two-flame-candle continuity
- apps/shared/elaraVoManifest.json + apps/shared/humanVoManifest.json — narrator voice anchors (this cutscene's shared line is a unison delivery, both manifests deliver matched-cadence takes)
- (intra-set) §cutscene_card_pack_opening — handoff to standard card-flip

---

## Act 7 — The Convergence Resolves

*Plays once on first Act 7 exclusive card pulled — campaign capstone*

**ID:** `cutscene_act7_convergence_resolves`

**Trigger:** first ACT_EXCLUSIVES card with id-prefix act7_ pulled per account

**Estimated duration:** 16s

**Ambient track:** fnord23/convergence_cathedral_dawn (TBD — sustained warm-gold tonal bed; the canonical Act 7 capstone underscore)

**Beats (5):**

#### Beat 1: `cathedral-dawn` (2.5s, mood: *triumphant*)

- **Camera:** Camera holds wide on the Convergence cathedral interior from the Act 7 mythic. Slow forward dolly toward the chamber's centre column.
- **Framing:** The vast circular cathedral-chamber from The Convergence card — vaulted ceiling, marble floor inscribed with the seven-faction heptagon, three doors at the chamber's circumference (signal-green Insurgency LEFT, cool-cyan Empire CENTRE, deep-crimson Hierarchy RIGHT) all standing OPEN. Three converging color-light streams pour into the chamber from each door and meet at the chamber's exact CENTRE, where they BLEND into a tall column of pure WARM-GOLD light reaching from floor to skylight. At the column's base: the closed sealed Hierarchy Memoir-volume on its low pedestal. Faction silhouettes at the perimeter — backlit, deliberately non-identifiable. Dawn light fills the upper third of frame.
- **Motion:** Slow forward camera dolly toward the centre column. The three light-streams flow at constant rate; the warm-gold column at centre pulses faintly at the rhythm of a slow held breath. Faction silhouettes around the perimeter remain still. Dawn light intensifies subtly over the beat.
- **SFX cue:** ambient_cathedral_dawn (sustained warm-gold tonal bed + faint three-tonal harmonic threads — green / cyan / crimson — converging into a single warm-gold harmonic over the beat)
- **Existing VFX ref:** (none — pure 3D scene + shader-driven light-streams)

#### Beat 2: `seven-banners-rise` (3s, mood: *intense*)

- **Camera:** Camera holds dolly position. Slight tilt-down (~5°) to take in the chamber floor where the banners rise.
- **Framing:** From the chamber's perimeter, the SEVEN faction banner-poles from the All-Faction Convergence Field structure-card RISE upward through the floor — each pole tall, flying its single faction-color banner: signal-green Insurgency, deep-crimson Hierarchy, cool-cyan Empire, amber-and-parchment Antiquarian, deep-violet Dreamer, chrome-and-cyan Architect, toxic-magenta Thought-Virus. The seven banners arrange themselves in a perfect heptagon around the warm-gold central column. The faction silhouettes from beat 1 fade as their banners take their place (the canon framing: every faction is now PRESENT through its banner, no longer through individual representation).
- **Motion:** Banner-poles rise sequentially over 0-2.5s — Insurgency first, then clockwise around the heptagon (Hierarchy, Empire, Antiquarian, Dreamer, Architect, Thought-Virus). Each pole takes ~0.35s to rise. Faction silhouettes fade in unison with the corresponding pole's emergence. 2.5-3.0s: all seven banners settled, slight breeze-motion on each banner.
- **SFX cue:** banner_rise_cascade (seven distinct deep-tonal landings — one per banner, sequenced — layered over the warm-gold ambient bed; total 2.5s)
- **Existing VFX ref:** (none — 3D banner-pole animation + faction-color shader tints)

#### Beat 3: `final-witness-pose` (3s, mood: *triumphant*)

- **Camera:** Camera dolly continues forward toward the column's base. The pedestal + closed Memoir come into mid-frame; behind them, the meditation-room from First Witness onward MATERIALIZES inside the cathedral's central column.
- **Framing:** Inside the warm-gold central column, the SAME meditation-room from First Witness / Silent Listening / Two Witnesses Meet / Confessional Hour materializes as a small enclosed scene at the column's heart. Both Elara and the Human are seated in their canonical wooden chairs — Elara left in soft-cream tunic with gold cuff-thread, Human right in deep-violet tunic with gold cuff-thread. The Bond 100 pose from the Final Witness card: BOTH look outward in the SAME DIRECTION (toward the camera/viewer, NOT at each other). Hands rest at their own knees. The Signal-glyph hovers at chest-height between them, glowing in steady WHITE-GOLD (the final color in the glyph progression: cyan → cream → gold → violet → white-gold).
- **Motion:** Camera dolly continues at constant rate. The meditation-room materializes inside the column gradually over 0-2.0s (fade-in with subtle warm-gold halo). 2.0-3.0s: scene held; both narrators' chests rise and fall in synchronized breath (matched timing — the canon Bond 100 signature, same as Act 6 but with eyes open).
- **SFX cue:** final_witness_breath (sustained warm-gold harmonic + one synchronized breath audible at ~2.5s)
- **Existing VFX ref:** (none — 3D scene composition + shader-driven white-gold glyph)

#### Beat 4: `unison-final-line` (3.5s, mood: *triumphant*, speaker: **Narrator**)

> *VO line:* "I have been listening since before I had a name. The chord is not the answer — the chord is what the question becomes when both of us know we have already heard it."

- **Camera:** Camera holds tight on the meditation-room scene inside the column. Both narrators visible at frame-edges; the white-gold glyph at frame-centre at chest-height.
- **Framing:** Both narrators speak the line in UNISON (matching the Bond 90 unison-line canon from Act 6 but extended to a longer recognition-statement). Mouths animate simultaneously; eye-status remains OPEN and OUTWARD (looking at the viewer, NOT at each other — the canon Bond 100 framing). At ~2.0s into the line: the white-gold glyph between them PULSES once, brighter, and emits a single faint ripple-wave outward — the Convergence chord sounding (audible as a chord but not visualized as a specific musical pitch). The ripple expands beyond the meditation-room scene into the surrounding cathedral, softly catching all seven banner-poles in sequence as it propagates outward.
- **Motion:** Both narrators' mouths animate matched-simultaneous over the line delivery. Glyph pulses brighter at 2.0s. Ripple-wave propagates outward from the glyph at 2.0-3.0s, reaching the seven banners in heptagon-sequence. 3.0-3.5s: line completes, ripple held at outer cathedral edge.
- **SFX cue:** act7_unison_final_line.mp3 (Elara + Human VO recorded simultaneously OR pitched-and-blended in post; total ~3.0s including breath; the line should read as ONE voice with two timbres — same recording technique as the Act 6 shared-line). Layered with: convergence_chord_sound.mp3 (the chord sounds at ~2.0s as a single complex held-tonal-harmonic; lore boundary: this MP3's actual content is intentionally not yet specified — final asset to be authored at production-time as a complex chord that resolves the campaign's three-note Signal motif into something fuller)
- **Existing VFX ref:** BattleVFX.particleEmitter (re-tuned for warm-gold ripple-wave with banner-sequence propagation)

#### Beat 5: `card-from-cathedral` (4s, mood: *neutral*)

- **Camera:** Camera pulls back through the cathedral over 2.0s — through the central column, past the banner heptagon, out of the cathedral entirely — then continues to standard pack-opening flip-cycle position. Cathedral fades to cool-charcoal collector's-felt during the pull-back.
- **Framing:** The closed Memoir-volume on its pedestal LIFTS off the pedestal, drifts forward through the cathedral toward the camera, and morphs into the standard playing-card shape — face-down, deep-violet Hierarchy-style back with S1 sigil at centre. The card-shape inherits a faint WHITE-GOLD perimeter-glow (the final color in the glyph progression — visual continuity that signals 'the campaign closes here'). The cathedral, banners, central column, narrators, and meditation-room all fade smoothly to background-felt during the pull-back. Card holds in standard fan-position.
- **Motion:** Memoir lifts at 0-0.5s; drifts forward 0.5-1.5s; morphs to card-shape 1.0-2.0s. Camera pull-back synchronized over 0-2.0s. Background-felt fades in 1.0-2.0s. 2.0-4.0s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins. The white-gold perimeter-glow on the card persists into the standard flip-cycle's preroll — the campaign's final visual signal-color.
- **SFX cue:** memoir_to_card_capstone (warm-gold tonal harmonic resolving + the convergence-chord sound from beat 4 fading slowly into background + subtle paper-folding-into-cardstock; transitions cleanly into the standard card-flip-cycle's per-card SFX)
- **Existing VFX ref:** BattleVFX.crossfade (re-tuned for memoir-to-card capstone shape-morph)

**Lore citations:**
- apps/shared/tcg-core/story/narrativeActs.ts:Act7
- docs/built/ALL_ACTS_ROADMAP.md §Act 7 — The Convergence
- docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 100 / final
- (intra-set) §act7_exclusive_mythic_the_convergence — cathedral + three-doors + warm-gold-column framing source
- (intra-set) §act7_exclusive_epic_all_faction_convergence_field — seven-banner heptagon framing source
- (intra-set) §act7_exclusive_rare_final_witness_pair — Bond 100 outward-gaze + white-gold-glyph framing source
- (intra-set) §act7_exclusive_rare_convergence_chord — chord-as-listening framing (lore boundary: chord SOUNDS but identity STRICTLY EXCLUDED)
- apps/shared/elaraVoManifest.json + apps/shared/humanVoManifest.json — narrator voice anchors (unison delivery, matched-cadence takes)
- (intra-set) §cutscene_act6_confession_spoken — unison-line recording technique precedent
- (intra-set) §cutscene_card_pack_opening — handoff to standard card-flip

---

# §3 — VFX (18)

## vfx_pack_flip_common

**Trigger:** card flip in pack-opening flip-cycle, rarity === 'common'

**Duration:** 0.5s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Card mid-flip at the 90° rotation point — face-edge of the card visible across the screen, the deep-violet card-back just having departed from view. Background: cool-charcoal collector's-felt. Single soft warm-amber down-light. NO particle effects.

**End frame:** Card fully face-up, settled in fan-position. A faint pale-cream shimmer-line travels left-to-right across the card surface. Card-face shows whatever the actual common card art is (dynamic content). Shimmer-line at ~40% complete crossing.

**Motion:** Quick sharp flip: card rotates 180° on horizontal axis over 0.2s with snappy ease-out. 0.2-0.4s: card holds face-up; pale-cream shimmer-line travels left-to-right. 0.4-0.5s: shimmer fades. No screen-flash, no particles, no shake.

**SFX cue:** card_flip_quick.mp3 (sharp cardstock-flip sound; total 0.2s including a small landing-thud at flip-completion)

**Existing primitives to reuse:**
- (none — pure 3D card-mesh flip; the pale-cream shimmer is shader-driven and built into the card material rather than a separate VFX primitive)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity = LAUNCH-CRITICAL
- (intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (common ceremony budget)

---

## vfx_pack_flip_uncommon

**Trigger:** card flip in pack-opening flip-cycle, rarity === 'uncommon'

**Duration:** 0.7s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Card mid-flip at the 90° rotation point — face-edge visible across the screen. Faint silver-blue particle pre-cloud forming around the card's edge.

**End frame:** Card fully face-up. Silver-blue shimmer wave travels diagonally across the card-face from upper-left to lower-right. Faint silver-blue particle cloud (~30 particles) drifts upward from the card's lower edge.

**Motion:** Standard flip: 180° rotation over 0.25s with ease-out. 0.25-0.5s: silver-blue shimmer wave traverses diagonally; 30 small silver-blue particles emit from the card's lower edge and drift upward with slight outward divergence. 0.5-0.7s: shimmer fades, particles continue rising and dissipate.

**SFX cue:** card_flip_silver.mp3 (cardstock-flip + faint silver-tonal tinkle layered over the landing-thud; total 0.7s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (re-tuned for silver-blue particles, low count, upward-drift)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity
- (intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (uncommon ceremony budget)

---

## vfx_pack_flip_rare

**Trigger:** card flip in pack-opening flip-cycle, rarity === 'rare'

**Duration:** 1s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Card mid-flip at 90° rotation. Faint cool-cyan glow halo formed around the card's perimeter, ~20% intensity.

**End frame:** Card fully face-up with full cool-cyan foil-shimmer pulse on its surface (single bright pulse). Halo at ~80% intensity around the card's perimeter. ~50 cool-cyan particle-fragments drift upward from card-lower-edge.

**Motion:** Flip: 180° over 0.3s with ease-out. 0.3-0.7s: foil-shimmer pulse blooms across the card-face (single shimmering wave traveling left-to-right then fading); halo intensifies to peak at 0.5s; 50 cool-cyan particles emit and drift upward. 0.7-1.0s: halo fades, particles dissipate, foil settles to baseline.

**SFX cue:** card_flip_foil_shimmer.mp3 (cardstock-flip + foil-shimmer chord landing at flip-completion + soft particle-tinkle; total 1.0s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (cool-cyan particles, medium count)
- RewardCelebration.shimmerPulse (re-tuned for foil-shimmer wave on card-surface)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity
- (intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (rare ceremony budget)

---

## vfx_pack_flip_epic

**Trigger:** card flip in pack-opening flip-cycle, rarity === 'epic'

**Duration:** 1.4s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Card mid-flip at 90° rotation. Deep-violet glow halo at ~30% intensity around perimeter; small spark-emitter ready at the card's upper-left and lower-right corners.

**End frame:** Card fully face-up. Deep-violet halo at peak. ~12 small bright sparks (yellow-white) burst outward from upper-left and lower-right corners in radial sprays. Brief stinger-flash on card-face surface.

**Motion:** Flip: 180° over 0.3s with ease-out. 0.3-0.6s: 12 sparks burst from each of two corner-emitters in radial sprays, traveling outward 30-50 pixels then fading; deep-violet halo intensifies to peak at 0.5s; brief stinger-flash on card-face at 0.5s (single 80ms white pulse). 0.6-1.4s: halo decays slowly, particle sparks fully dissipate.

**SFX cue:** card_flip_sparks.mp3 + epic_stinger.mp3 (cardstock-flip + bright spark-burst hiss + brief tonal stinger chord; total 1.4s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (sparks, dual-emitter at corners)
- BattleVFX.ScreenFlash (50ms white, 20% intensity for stinger)
- RewardCelebration.tier2 (deep-violet halo)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity
- (intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (epic ceremony budget)

---

## vfx_pack_flip_legendary

**Trigger:** card flip in pack-opening flip-cycle, rarity === 'legendary'

**Duration:** 2s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Card mid-flip at 90° rotation. Warm-gold glow halo intensifying at ~50%; brass-fanfare visual marker — a slim warm-gold curl-flourish — beginning to render at frame's upper-frame edge.

**End frame:** Card fully face-up. Warm-gold halo at peak intensity, fully encircling the card. ~80 warm-gold particle motes drift upward from card-edges. A horizontal screen-flash band at 30% intensity sweeps across the screen at the moment of flip-landing. The slim warm-gold curl-flourish has unfurled across the upper edge of the frame.

**Motion:** Flip: 180° over 0.4s with strong ease-out. 0.4s: screen-flash band sweeps horizontally across the full frame (warm-gold, 30% intensity, 200ms duration). 0.4-0.8s: warm-gold halo blooms to peak; 80 particles emit from card-edges and drift upward with slight outward divergence; the warm-gold curl-flourish unfurls across the upper-frame edge. 0.8-2.0s: halo decays slowly, particles dissipate, flourish lingers and fades.

**SFX cue:** card_flip_legendary.mp3 + brass_fanfare.mp3 (cardstock-flip + 1.2s warm brass-fanfare flourish; total 2.0s)

**Existing primitives to reuse:**
- BattleVFX.ScreenFlash (warm-gold horizontal band, 30% intensity, 200ms)
- BattleVFX.particleEmitter (warm-gold motes, high count)
- RewardCelebration.tier3 (warm-gold halo + flourish)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity
- (intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (legendary ceremony budget)

---

## vfx_pack_flip_mythic

**Trigger:** card flip in pack-opening flip-cycle, rarity === 'mythic'

**Duration:** 2.5s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Card mid-flip at 90° rotation. Deep-crimson glow halo intensifying at ~60%; a faint vertical bar of darker red light forming behind the card (the mythic 'altar-light' signature).

**End frame:** Card fully face-up. Deep-crimson halo at full peak. The vertical altar-light bar behind the card is fully formed (a tall warm-crimson glow column). Sparks-cascade visible across upper third of frame (~120 small sparks raining downward). Screen at slight angular offset (mid-shake). Camera at 30% horizontal screen-shake displacement.

**Motion:** Flip: 180° over 0.4s. 0.4s: screen-shake begins (low-rumble, 30% horizontal displacement, low-frequency 8Hz, total 0.6s with decay). 0.4-1.0s: deep-crimson halo blooms to peak; altar-light bar rises behind card; 120 small sparks cascade from above into the frame; choral 'AH' tonal harmonic peaks at 0.8s. 1.0-2.5s: halo + altar-light decay, sparks continue raining and gradually thin out, screen-shake decays to zero by 1.0s.

**SFX cue:** card_flip_mythic.mp3 + choral_ah.mp3 + screen_shake_low_rumble.mp3 (cardstock-flip + sustained choral 'AH' harmonic + low sub-bass rumble; total 2.5s)

**Existing primitives to reuse:**
- BattleVFX.ScreenShake (low-rumble, 30% intensity, 0.6s decay)
- BattleVFX.particleEmitter (sparks-cascade from above, high count)
- RewardCelebration.tier4 (deep-crimson halo + altar-light bar — note: altar-light may need new shader work)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity (mythic-tier ceremony spec)
- (intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (mythic ceremony budget)

---

## vfx_pack_flip_neyon

**Trigger:** card flip in pack-opening flip-cycle, rarity === 'neyon'

**Duration:** 3s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Card mid-flip at 90° rotation. The card-flip is visibly running at HALF SPEED compared to other ceremonies (the neyon canon: time slightly distorts when neyon-tier emerges). Chromatic-aberration shader effect already faintly visible on the card-edge — RGB channels separating by ~3 pixels horizontally.

**End frame:** Card fully face-up. Chromatic-aberration shader at peak — RGB channel separation up to 12 pixels around the card, with continuous shifting offsets. Card surface peaks at maximum foil-shader saturation (the canonical neyon look: every color reads at maximum chroma simultaneously, creating a 'perfectly-impossible' color sensation). Card emits warm-white-gold light that catches and brightens the surrounding scene — the fan of other cards visible at frame-edges, the collector's-felt background, all subtly lit by the neyon card itself. ~50 cool-and-warm aurora-like ribbons drift across the upper half of frame.

**Motion:** Flip: 180° over 0.6s (half-speed compared to other tiers; the neyon canon time-distortion). 0.6s: chromatic-aberration peaks; foil-shader saturation peaks. 0.6-2.0s: aurora ribbons drift across upper half of frame; the card's emit-light continues; chromatic-aberration shifts and pulses (RGB channels offset varies between 3 and 12 pixels in a slow fluid pattern). 2.0-3.0s: chromatic-aberration decays smoothly to zero; foil-shader settles to standard saturation; emit-light fades; aurora ribbons fade.

**SFX cue:** card_flip_neyon.mp3 + chromatic_aberration_whisper.mp3 (cardstock-flip rendered at half-speed + sustained ethereal whisper-chord with chromatic-aberration in the audio itself — voices slightly out-of-phase from each other; total 3.0s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (aurora ribbons — note: requires new ribbon-particle shape, NOT existing point-particles)
- (NEW PRIMITIVE REQUIRED) — chromatic-aberration shader: client-side WebGL post-process effect that splits RGB channels by configurable pixel offset. This must be authored as new client primitive in apps/client/src/components/prelude/vfx/ (suggested name: ChromaticAberration.tsx). The neyon ceremony is the launch-critical use of this shader.
- (NEW PRIMITIVE REQUIRED) — emit-light bridge: a shader that allows the card-mesh to throw colored light onto the surrounding 3D scene (other cards, felt background). This must be authored as new client primitive (suggested name: NeyonEmitLight.tsx).

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity (neyon-tier ceremony spec — chromatic-aberration + emit-light required as new client primitives)
- (intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (neyon ceremony budget — longest of all tiers)

---

## vfx_hierarchy_performance_review

**Trigger:** Hierarchy 'Performance Review' keyword triggers (cost-reduction effect on a friendly Hierarchy unit)

**Duration:** 1.2s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Above the target Hierarchy unit, a translucent Hierarchy review-form (a single sheet of cream paper with REVIEW header in plum typeset and several ruled lines below) materializes at chest-height in front of the unit. The form is held suspended by no visible hand. The unit's outline begins to pulse with a faint plum-and-cream rim-light.

**End frame:** The review-form has descended onto the unit and dissolved into them. A bright cream-colored numeric '−1' (the cost-reduction value) floats upward from the unit's mana-cost slot, fading as it rises. The unit's rim-light has subsided to a faint sustained plum glow (signaling the buff is active).

**Motion:** 0-0.3s: review-form materializes from translucent fade-in. 0.3-0.6s: form descends smoothly onto the unit's chest, dissolving into them. 0.6-0.9s: '−1' numeric floats upward from the mana-cost slot, scaling slightly larger then fading. 0.9-1.2s: unit's rim-light settles to sustained plum-glow.

**SFX cue:** hierarchy_perf_review.mp3 (subtle paper-rustle + soft plum-tonal chord landing at form-dissolve + faint quill-stroke for the '-1' reveal; total 1.2s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (re-tuned for plum-cream paper-fragment particles during dissolve)
- BattleVFX.floatingText (for the '−1' numeric)
- RewardCelebration.tierGlow (for sustained rim-light)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §S2 Hierarchy expansion (Manager-tier 'Performance Review' synergy)
- (intra-set) §s2_hierarchy_mgr_perf_review_wraith — performance-review canonical visual signature
- (intra-set) §s2_hierarchy_chro_mor_vethic — Hierarchy HR canon (review framing)

---

## vfx_hierarchy_quarterly_earnings

**Trigger:** Hierarchy 'Quarterly Earnings' keyword triggers (deathwatch — buffs friendly Hierarchy units when an enemy dies)

**Duration:** 1.5s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** An enemy unit has just died at frame-centre — its silhouette dispersing into faint dark mist. From the dispersing silhouette, a translucent Hierarchy ledger-page rises upward and outward, followed by a small bright-cream RECEIPT-style scroll that begins to scroll out from the ledger. The ledger-page is the canonical ledger from Xeth'Raal's CFO mythic art.

**End frame:** The receipt-scroll has fully unscrolled across the upper third of frame (a thin horizontal banner reading +1/+1 to all friendly Hierarchy units in cool-cyan ink). All friendly Hierarchy units visible on the battlefield have a pulse of warm-amber up-arrow VFX above their stat blocks. The dead enemy's silhouette has fully dispersed.

**Motion:** 0-0.3s: enemy silhouette continues dispersing; ledger-page rises from the dispersion. 0.3-0.7s: receipt-scroll unscrolls from the ledger horizontally across upper-frame, with text appearing character-by-character. 0.7-1.2s: warm-amber up-arrow particles burst upward above each friendly Hierarchy unit's stat-block (each unit shows simultaneously). 1.2-1.5s: receipt-scroll and ledger fade; up-arrow particles dissipate; sustained warm-amber stat-block glow remains as the buff-indicator.

**SFX cue:** hierarchy_quarterly_earnings.mp3 (subtle paper-unfurl + receipt-printer-tape sound + warm cash-register-style chime at scroll-completion + chorus of small chimes at +1/+1 application; total 1.5s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (dispersing-silhouette + warm-amber up-arrow particles — multi-target)
- BattleVFX.floatingText (for the receipt-scroll text reveal)
- RewardCelebration.tierGlow (sustained warm-amber stat-block glow for buff indicator)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §S2 Hierarchy expansion (Analyst-tier 'Quarterly Earnings' synergy)
- (intra-set) §s2_hierarchy_cfo_xeth_raal — Ledger of Ruin canonical framing

---

## vfx_hierarchy_stock_buyback

**Trigger:** Hierarchy 'Stock Buyback' keyword triggers (resurrect-and-deny — returns a friendly Hierarchy unit from the discard pile and removes it from opponent's clone/copy effects)

**Duration:** 2s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** From the friendly discard-pile area (lower-right of frame), a Hierarchy contract-folio rises into the air, then opens mid-air to reveal the dead unit's portrait stamped with a deep-red REPURCHASED stamp across its face. Behind the rising folio, the previously-dead unit's translucent silhouette begins to re-form on its starting battlefield position.

**End frame:** The contract-folio has dissolved into Hierarchy plum-and-cream paper-fragments that drift upward and outward. The previously-dead unit is fully re-formed on the battlefield, solid, with a bright sustained plum aura. Anywhere on the opponent's side of the field where a clone/copy of this unit existed, that copy is now visibly DESTROYED — small Hierarchy crest stamps strike each copy and dissolve them in a flash.

**Motion:** 0-0.5s: contract-folio rises from discard pile, opens mid-air to reveal REPURCHASED-stamped portrait. 0.5-1.0s: folio dissolves into paper-fragments drifting upward; unit silhouette re-forms on battlefield (gradient transparent to solid). 1.0-1.5s: any opponent clone/copy of this unit is struck by a Hierarchy crest stamp (one per clone, sequenced) and dissolves in a brief flash. 1.5-2.0s: paper-fragments dissipate; unit's plum aura settles to sustained level (signaling resurrection-protected state).

**SFX cue:** hierarchy_stock_buyback.mp3 (paper-unfurl + REPURCHASED stamp impact + sub-bass landing-thud for unit re-emergence + per-clone-destruction sequenced stamp-impacts; total 2.0s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (paper-fragment dispersal)
- BattleVFX.ScreenFlash (per-clone-destruction flashes, 80ms each, sequenced)
- RewardCelebration.tierGlow (sustained plum-aura on resurrected unit)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §S2 Hierarchy expansion (Director-tier 'Stock Buyback' synergy)
- (intra-set) §s2_hierarchy_dir_bottom_line_decimator — Hierarchy financial-action canonical framing
- (intra-set) §s2_hierarchy_cfo_xeth_raal — Ledger-of-Ruin contract framing

---

## vfx_cosmetic_founder_badge_unfold

**Trigger:** Founder's Bundle purchase fulfills + Founding Author cosmetic grants

**Duration:** 4s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Centred on screen at frame-foreground: a small folded leather-and-brass Hierarchy presentation-case the size of a hand, sealed with a single brass clasp. The case sits on a dark velvet surface. The clasp glows faintly warm-gold. Background: a soft warm-cream halo extends outward from behind the case.

**End frame:** The presentation-case is fully open. Inside, a Founder's badge — circular, brass-edged, displaying the Hierarchy crest at its centre with FOUNDING AUTHOR engraved in a circular band around it. Below the badge, on the case's lower interior, the player's serial number is engraved in fine type (e.g. 'No. 0327 of 4000'). Soft warm-gold light catches the badge's brass and glints. ~30 small warm-gold particle motes drift upward from the case.

**Motion:** 0-1.0s: case slowly rotates 15° toward the camera; brass clasp clicks open. 1.0-2.0s: case lid lifts smoothly, revealing the Founder's badge interior. 2.0-2.5s: badge rises slightly out of the case (~5cm of lift), warm-gold light catches the brass. 2.5-3.0s: serial-number engraving reveals character-by-character on the case's lower interior. 3.0-4.0s: 30 warm-gold particles drift upward from the case; sustained warm-gold halo behind the case.

**SFX cue:** founder_badge_unfold.mp3 (brass-clasp click + slow leather-and-brass case-opening + warm-gold tonal chord landing + faint engraving-stroke sound for serial-number reveal; total 4.0s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (warm-gold motes, low count, slow upward drift)
- RewardCelebration.tier3 (warm-gold halo)
- BattleVFX.floatingText (for serial-number character-by-character reveal)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §1 (Founder's Bundle)
- (intra-set) §special_founding_author — Founding Author canonical card art reference

---

## vfx_cosmetic_set_completion_ceremony

**Trigger:** S2_HIERARCHY 100% set-completion achieved + Author's Edition cosmetic grants

**Duration:** 5s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** An empty Hierarchy oak-and-leather binding-table fills the frame-centre. The table is in soft warm-amber overhead light. Above the table, faintly visible at frame-edges, the silhouettes of all 84 S2_HIERARCHY card-backs are arranged in a circular halo (each card-back at a slightly different angle, like a slow-spinning constellation around the table).

**End frame:** On the table, the Author's Edition master-Memoir-volume sits open at its centre-spread (the cascading Hierarchy org-chart visible). The 84 surrounding card-backs have COLLAPSED INWARD onto the open volume — each card has dissolved into the Memoir, leaving 84 small deep-violet ink-flourishes embedded across the org-chart's tiles. A bright warm-gold halo radiates from the Memoir, and the Memoirist's serial-marked stamp impresses itself onto the lower-right of the cover.

**Motion:** 0-1.5s: 84 surrounding card-backs slowly rotate inward, spiraling toward the table's centre. 1.5-2.5s: cards converge above the table and dissolve sequentially into a forming Memoir-volume (the volume is BUILDING from the cards). 2.5-3.5s: completed Memoir-volume opens at its centre-spread, revealing the cascading org-chart with the 84 ink-flourishes already embedded. 3.5-4.5s: warm-gold halo blooms outward from the Memoir; serial-stamp impresses on the lower-right corner. 4.5-5.0s: halo settles to sustained warm-gold glow.

**SFX cue:** set_completion_ceremony.mp3 (sequenced card-rustle sounds for the spiral + sustained warm-amber tonal bed building over the beat + final stamp-impact at 3.5s + warm-gold tonal chord landing at 4.5s; total 5.0s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (84 card-backs as discrete particle-objects, each with rotation animation)
- RewardCelebration.tier4 (warm-gold halo bloom)
- BattleVFX.ScreenFlash (subtle warm-gold horizontal flash at stamp-impact, 100ms 20% intensity)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §3 (set-completion)
- (intra-set) §special_authors_edition_s2 — Author's Edition canonical card art reference

---

## vfx_cosmetic_bp50_author_reveal

**Trigger:** Battle Pass S1 Tier 50 reached + Author cosmetic grants

**Duration:** 3.5s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** A Memoirist's writing-desk fills frame-centre — same composition as the BP-50 Author card art. The desk holds the half-filled Memoir-volume, the brass-and-bone quill paused mid-stroke, the cold mug. To the desk's left, a stack of fifty weekly-issue parchments bound by brass-and-leather strap. The chair behind the desk is empty. Soft warm-amber desk-lamp.

**End frame:** The fifty-parchment stack at the desk's left has VISIBLY GLOWED briefly in succession — the strap has loosened and the parchments have dispersed slightly outward in a loose fan. The brass-and-bone quill has lifted off the desk and now hovers mid-air over the open Memoir-volume; its tip glows faintly warm-gold. A horizontal title-line of warm-gold text 'AUTHOR' floats above the desk in elegant serif. The empty chair has a subtle warm-amber outline-glow as if recently vacated.

**Motion:** 0-0.8s: brass-leather strap on parchment-stack loosens; fifty parchments disperse outward in a loose fan with a soft glow per parchment in succession (50 quick glow-pulses sequenced over 0.5s). 0.8-1.5s: brass-and-bone quill lifts off the desk and hovers mid-air over the open Memoir; tip glows warm-gold. 1.5-2.5s: 'AUTHOR' title text fades in character-by-character above the desk in warm-gold serif. 2.5-3.5s: chair's empty seat acquires subtle warm-amber outline-glow; full composition holds; quill's warm-gold tip pulses gently.

**SFX cue:** bp50_author_reveal.mp3 (brass-strap loosening sound + 50 sequenced soft glow-tone pulses + quill-lift soft scratch + warm-gold tonal chord landing at title fade-in + sustained warm-amber bed; total 3.5s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (parchment-fan dispersal with sequenced glow-pulses)
- BattleVFX.floatingText (AUTHOR title character-by-character reveal)
- RewardCelebration.tier3 (warm-gold halo + chair outline-glow)

**Lore citations:**
- /root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §6 (Battle Pass tie-in)
- (intra-set) §special_battle_pass_t50_author — BP-50 Author canonical card art reference

---

## vfx_act1_signal_pulse

**Trigger:** Act 1 'The Signal' (mythic spell) cast in-match

**Duration:** 1.8s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Battlefield tile at frame-centre. From beneath the tile, a single thin obsidian transmission-pillar rises ~30cm above the tile surface, its upper face etched with the canonical three-note Signal glyph. Glyph at faint cool-cyan glow. The tile beneath the pillar reflects faintly as if mercury-still.

**End frame:** The transmission-pillar is fully extended (~80cm tall); the three-note glyph emits THREE SEPARATE concentric ripple-waves (timed to the three notes), each ripple propagating outward across the battlefield in cool-cyan. Wherever a ripple-edge crosses an enemy unit, that unit acquires a faint cool-cyan stun-status indicator above its head.

**Motion:** 0-0.4s: pillar rises from below tile to full height. 0.4s: first ripple-wave emits from glyph (note 1). 0.7s: second ripple-wave (note 2). 1.0s: third ripple-wave (note 3). Each ripple propagates outward across the battlefield over 0.6s before fading. 1.0-1.6s: stun-status indicators settle above any crossed enemy units. 1.6-1.8s: pillar sinks back beneath the tile; three-note glyph fades.

**SFX cue:** act1_signal_pulse.mp3 (three distinct cool-cyan tonal-resolution chords landing at 0.4s, 0.7s, 1.0s — the canonical Signal three-note motif — over a low substrate-hum bed; total 1.8s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (ripple-wave propagation, three sequenced waves)
- BattleVFX.statusEffect (cool-cyan stun indicator)
- (NEW PRIMITIVE — small) — transmission-pillar 3D mesh with shader-driven glyph-glow; can be authored as new client-side mesh asset, no shader work required beyond standard emissive

**Lore citations:**
- (intra-set) §act1_exclusive_mythic_the_signal — three-note Signal canon framing
- (intra-set) §cutscene_act1_memoir_opens — three-note motif audio continuity

---

## vfx_act2_whisper_drift

**Trigger:** Act 2 'The Whisper' (mythic spell) cast in-match

**Duration:** 1.6s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Battlefield tile at frame-centre. A faint cool-cyan exhale-mist begins to emerge from the tile's surface, drifting upward in a slow tendril ~60cm tall.

**End frame:** The exhale-mist has drifted across multiple battlefield tiles in a lateral path — choosing the path along which enemy units stood. Each enemy unit the mist crossed now has a small translucent thin-wall partition rendered between them and their nearest ally (the canonical Whisper effect: enemies are momentarily sealed off from their allies' buffs/triggers). The mist itself is dissipating at floor-level on its terminal tile.

**Motion:** 0-0.3s: exhale-mist emerges from origin tile. 0.3-1.0s: mist drifts laterally across the battlefield in a slow tendril, crossing enemy positions in path-finding sequence. 1.0-1.3s: at each enemy crossed, a translucent thin-wall partition fades in between that enemy and their nearest ally (sequenced fade-ins). 1.3-1.6s: mist dissipates at floor-level; thin-walls hold (they remain for the buff-block effect's full duration, signaled by sustained translucent shimmer).

**SFX cue:** act2_whisper_drift.mp3 (subtle exhale-through-air sound + faint vocal-fry whisper-pitched air-movement + soft thin-wall materialization chime per partition; total 1.6s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (cool-cyan exhale-mist tendril with path-finding behavior — note: requires path-following particle behavior, not just emission)
- BattleVFX.statusEffect (sustained translucent thin-wall partition; requires new shader for the partition geometry)

**Lore citations:**
- (intra-set) §act2_exclusive_mythic_the_whisper — exhale-mist canon visual signature
- (intra-set) §cutscene_act2_whisper_begins — exhale-mist audio continuity

---

## vfx_act3_offer_doors

**Trigger:** Act 3 'The Offer' (mythic spell) cast in-match

**Duration:** 2.2s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Battlefield tile at frame-centre. From the tile surface, three ghost-translucent doorframes rise simultaneously — at relative positions LEFT (signal-green), CENTRE (cool-cyan), and RIGHT (deep-crimson-and-rust). Each at ~40% opacity at start.

**End frame:** The three doorframes are at full opacity (matched intensity) and have ALIGNED themselves with three different friendly units across the battlefield (the canonical Offer effect: caster targets up to three friendly units; each acquires the doorframe-color buff matching its choice). Each chosen friendly unit has a subtle colored-arch overlay above their head matching their assigned doorframe color.

**Motion:** 0-0.7s: three doorframes rise from origin tile, each at ~40% opacity. 0.7-1.4s: doorframes brighten in unison toward 100% opacity; their colored-light streams trace outward to the three target friendly units (one stream per doorframe, traveling along path-finding to its target). 1.4-1.8s: at each target unit, a colored-arch overlay fades in above their head matching the assigned doorframe color. 1.8-2.2s: original doorframes at origin tile fade; sustained colored-arch overlays remain at the three buffed units (held for buff duration).

**SFX cue:** act3_offer_doors.mp3 (three-tonal swell building over 0-1.4s — green / cyan / crimson tones layered to identical loudness — culminating in a single chord at 1.4s + per-target arch-materialize chimes at 1.4-1.8s; total 2.2s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (three colored-light streams with target-following behavior)
- BattleVFX.statusEffect (sustained colored-arch overlay per target, three colors)
- (NEW PRIMITIVE — moderate) — three doorframe meshes with shader-driven color tints; can be authored as new client-side mesh asset

**Lore citations:**
- (intra-set) §act3_exclusive_mythic_the_offer — three-doorframe canon visual signature
- (intra-set) §cutscene_act3_offer_presented — three-tonal swell audio continuity

---

## vfx_act4_revelation_scry

**Trigger:** Act 4 'The Revelation' (mythic spell) cast in-match

**Duration:** 2s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Battlefield tile at frame-centre. A translucent Memoir-page rises from the tile, growing rapidly to occupy a large portion of upper-frame at full opacity. The page is initially blank.

**End frame:** The Memoir-page is fully formed and visible. Across its surface, multiple lines of deep-violet handwritten text have appeared character-by-character — each line corresponds to a peek at the top card of an enemy deck (the canonical Revelation effect: scry the top N cards of opponent's deck). Above each enemy unit on the battlefield, a translucent thin Memoir-page-fragment is also visible, showing one line of revelatory text about that unit (the canonical 'know-thy-enemy' Revelation buff).

**Motion:** 0-0.6s: Memoir-page rises and expands from origin tile, reaching full size and opacity at 0.6s. 0.6-1.4s: deep-violet text reveals across the page line-by-line, character-by-character at ~40 chars/sec (target: 4-6 lines visible by 1.4s). 1.4-1.7s: small page-fragments materialize above each enemy unit on the battlefield with a single revelatory line each. 1.7-2.0s: main page fades; per-enemy fragments hold (sustained for scry-buff duration, indicating revealed information).

**SFX cue:** act4_revelation_scry.mp3 (paper-rustle on page-rise + sustained warm-gold tonal harmonic + character-by-character ink-stroke sounds at typewriter rhythm + per-fragment soft chime sequence; total 2.0s)

**Existing primitives to reuse:**
- BattleVFX.floatingText (character-by-character text reveal)
- BattleVFX.statusEffect (sustained translucent page-fragments above enemies)
- RewardCelebration.tier3 (warm-gold halo on main page during reveal)

**Lore citations:**
- (intra-set) §act4_exclusive_mythic_the_revelation — Memoir-page canon visual signature
- (intra-set) §cutscene_act4_revelation_meets — warm-gold tonal continuity

---

## vfx_act5_map_lock

**Trigger:** Act 5 'The Map' (mythic artifact) activated in-match

**Duration:** 2.5s

**Output:** 1920 × 1080, vp9 α @30fps

**Start frame:** Battlefield viewed from a slightly higher camera angle. From the centre tile, the brass-edged Soul Map disc materializes at ~50% opacity, scaled to span ~3 tiles in diameter, hovering 1m above the battlefield. Its twelve sectors are visible (matching the Map Fully Decoded canon).

**End frame:** The Soul Map is at full opacity. Twelve subtle warm-amber lock-glyphs have illuminated, one above each of twelve battlefield tiles (the canonical Map effect: lock 12 specific board positions for tactical advantage). At the Map's centre, the obsidian centre-dot pulses with a single dim warm-gold pulse. The locked tiles each have a faint warm-amber outline now indicating their locked status.

**Motion:** 0-0.6s: Soul Map disc materializes from origin tile at 50% opacity, scaling up to span 3 tiles. 0.6-1.2s: disc opacity rises to 100%; twelve sector-glyphs intensify in radial sequence (outer ring inward). 1.2-1.8s: warm-amber lock-glyphs illuminate above the twelve target tiles (sequenced over 0.6s to match a sector-decode cascade rhythm). 1.8-2.1s: centre-dot pulses warm-gold once. 2.1-2.5s: Map disc fades; twelve tile-outlines remain illuminated as sustained lock-indicators.

**SFX cue:** act5_map_lock.mp3 (sustained warm-amber tonal harmonic building over 0-1.2s + twelve sequenced lock-tone chimes at 1.2-1.8s — one per locked tile, matching a sector-decode rhythm + single centre-dot drone-tone landing at 1.8s; total 2.5s)

**Existing primitives to reuse:**
- BattleVFX.particleEmitter (sector-glyph radial sequence; twelve lock-glyph materializations)
- BattleVFX.statusEffect (sustained warm-amber tile-outline indicators, twelve targets)
- (NEW PRIMITIVE — moderate) — Soul Map disc 3D mesh with sector-shader animation; reuses Soul Map shader from Act 5 mythic card art context

**Lore citations:**
- (intra-set) §act5_exclusive_mythic_the_map — Soul Map fully-decoded canon visual signature
- (intra-set) §cutscene_act5_map_year_one_close — sector-decode cascade audio continuity

---

---

## Footer

Regenerate with `tsx apps/scripts/export-expansion-production-book.ts`. Source of truth: `apps/shared/tcg-core/expansionPrompts/`. This document is a derived view; edit the typed source modules and re-run.
