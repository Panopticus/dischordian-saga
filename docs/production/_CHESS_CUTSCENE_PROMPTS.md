# _CHESS_CUTSCENE_PROMPTS.md — chess roster cutscene producer brief

Generated 2026-05-12. Companion to `_MISSING_ART_PROMPTS.md`. Covers
every chess opponent + tutorial gate + Climb tier as a producer-ready
Veo 3.1 prompt (8s clip per cutscene) plus the matching NB2 poster
still (1280×720). All canon descriptions sourced verbatim from:

- `apps/server/routers/chess.ts` → `CHESS_CHARACTERS` (12 opponents)
- `apps/shared/tcg-core/story/chessTutorial*.ts` (9 gates)
- `apps/shared/chessClimbTiers.ts` (4 Climb tiers)

Every prompt uses the canonical NB2 / Veo 3.1 schema from
`_PRODUCTION_FINAL.md` §0.2–§0.5 (FPV trait-lock, seed namespace,
negative-prompt strings).

## Summary

| § | Category | Count | Deliverable |
|---|---|---|---|
| A | Tutorial-gate intros (Celebration GM) | 9 | Veo 3.1 8s + NB2 poster |
| B | Story-ladder first-encounters | 12 | Veo 3.1 8s + NB2 poster |
| C | Chess Climb tier wager beats | 4 | Veo 3.1 8s + NB2 poster |

**Total: 25 cutscene mp4s + 25 poster stills.**

CDN layout:
```
cdn/client-public/art/cutscenes/chess_tutorial/<id>.mp4
cdn/client-public/art/cutscenes/chess_tutorial/<id>_start.png
cdn/client-public/art/cutscenes/chess_ladder/<id>.mp4
cdn/client-public/art/cutscenes/chess_ladder/<id>_start.png
cdn/client-public/art/cutscenes/chess_climb/<id>.mp4
cdn/client-public/art/cutscenes/chess_climb/<id>_start.png
```

Seed namespace reservation (per `_PRODUCTION_FINAL.md` §0.5):
- **200000–209999** — chess tutorial intros (9 entries)
- **210000–219999** — chess ladder first-encounters (12 entries)
- **220000–229999** — chess Climb tier beats (4 entries)

Universal style anchors:
- **CHESS_ROOM_AESTHETIC**: oak chess table; brass-and-glass standing lamp;
  velvet-backed analyst chair; bronze-trimmed clock; bone-white-and-ebony
  Staunton set; warm tungsten-and-amber accent lighting; deep mahogany
  panelling; subtle dust motes; library hush.
- **CORRUPTED_ARENA_AESTHETIC**: reality-show-broadcast palette; cold
  white spotlights on the table; black void beyond; floating production
  drones; corrupted Game Master grin; clipboard in hand; mood: "host
  reading the next stakes off the card."
- **FPV_LOCK_PHRASE_VEO**: see `_PRODUCTION_FINAL.md` §0.4 canonical
  string — apply verbatim to every entry below.
- **VEO_NEGATIVE_PROMPT**: see `_PRODUCTION_FINAL.md` §0.4.

---

## §A — Tutorial-gate intros (9; Celebration Game Master)

In-universe: the Celebration-era Game Master — gentle, patient,
professorial — teaches the player chess across 7 main gates + 2 side
gates. He never plays to win; he plays to make the student capable
of winning against anybody else. Setting: Chamber C-7 of the
Inception Ark, dressed as a 1920s academy classroom with a single
oak chess table, a credenza of memory-resin notebooks, and afternoon
light through tall windows.

Each intro is the **opening beat** before instruction begins — player
takes the student's chair, GM appears across the table, sets the
position for the gate, says the line that opens the lesson. The
voice line itself comes from chessTutorial_g<N>.ts `vo_gm_chess_g<N>_intro_*`;
the cutscene visual covers the opening beat in 8s.

### A.1 `cs_chess_tut_g1_intro` — Gate 1: The Board and the Pieces

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200001

1. CINEMATOGRAPHY: FPV from the student's chair; static lockoff 0–2s; slow push-in toward the empty board 2–6s; settle on opening position 6–8s; 35mm equivalent.
2. SUBJECT + ACTION: The Celebration Game Master enters frame from the right, sets a wooden board piece by piece — pawns to the second rank, rooks to the corners, knights inside them, bishops, queen on her colour, king to her left. Each placement clean, unhurried, with a faint percussive tap. The board fills as the camera pushes in.
3. ENVIRONMENT: CHESS_ROOM_AESTHETIC; oak table at centre; brass-and-glass standing lamp casting warm tungsten pool on the board; afternoon-amber backlight through tall arched windows; the chamber smells of old paper.
4. STYLE: warm professorial tone; bone-white-and-ebony Staunton set; void-energy compliant; preserve aesthetic_tier solar_punk_cathedral_pedagogy.
5. CONSTRAINTS: FPV_LOCK_PHRASE_VEO; GM is always seen across the table — never the player; subject-reference = NB2 poster cs_chess_tut_g1_intro_start.png.
AUDIO: room-ambient bed; soft tap of pieces on wood; distant Ark hum.
TIMESTAMPS: [00:00–00:02] hold on closed-board lid; [00:02–00:06] GM places pieces from white queen to black king; [00:06–00:08] settle on completed setup; GM's hand withdraws.
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT.
```

**NB2 poster** (`cs_chess_tut_g1_intro_start.png`):

```
NB2_MODEL: gemini-3-pro-image-preview
ASPECT: 16:9   RESOLUTION: 1280x720   SEED: 200002
1. SUBJECT + ACTION: FPV across an empty oak chess table; the Celebration Game Master's gloved hand just lifting a white pawn toward the board's second rank; pieces partially arranged.
2. CAMERA + LENS: FPV at student eye-height; 35mm; shallow DOF on the board.
3. ENVIRONMENT + LIGHTING: warm tungsten pool from the brass-and-glass lamp; afternoon amber rim-light; CHESS_ROOM_AESTHETIC.
4. STYLE: classical chess-academy still; void-energy compliant.
5. CONSTRAINTS: FPV_LOCK_PHRASE_NB2.
```

### A.2 `cs_chess_tut_g2_intro` — Gate 2: Check, Checkmate, Stalemate

```
VEO seed: 200003   NB2 seed: 200004
ACTION: Camera pushes in on a board mid-game; GM places a black king in the centre and walks four white pieces around it — rook, queen, knight, bishop — building a checkmate net. He taps the king once at the apex. The lighting tightens. Mood: "I am about to teach you how the game actually ends."
```

### A.3 `cs_chess_tut_g3_intro` — Gate 3: Special Moves

```
VEO seed: 200005   NB2 seed: 200006
ACTION: GM demonstrates the three special moves in 8s — castling (king + rook swap), en passant (pawn-slide-and-capture), and pawn promotion (a pawn lifted from the eighth rank and replaced with a queen). Each move is its own micro-beat. Mood: "the rules within the rules."
```

### A.4 `cs_chess_tut_g4_intro` — Gate 4: Opening Principles

```
VEO seed: 200007   NB2 seed: 200008
ACTION: GM plays the first four moves of an Italian Game — e4, e5, Nf3, Nc6, Bc4 — narrating with each move which principle it serves (centre, development, king safety). The board fills with the classical opening shape. Mood: "the first four moves are a toolkit, not a script."
```

### A.5 `cs_chess_tut_g4_5_intro` — Gate 4.5: The Prince's Game (side gate)

```
VEO seed: 200009   NB2 seed: 200010
ACTION: GM lifts a leather-bound notebook off the credenza, flips it open to a creased page, sets a worn wooden set on the table. The set is older than the rest of the room. A name is embossed faintly into the inside cover — "PRINCE / ENGINEER." Mood: "today you play his side." The Prince became the Engineer became the Galaxy's last great inventor; he was the only student who ever beat the GM. The cutscene's job is to make you feel the weight of who he was.
```

### A.6 `cs_chess_tut_g5_intro` — Gate 5: Basic Tactics

```
VEO seed: 200011   NB2 seed: 200012
ACTION: GM sets up four micro-positions in quick succession across the board — a fork (knight forks king and queen), a pin (bishop pinning knight to king), a skewer (rook skewering queen behind king), a discovered attack (bishop moves to reveal a queen line). Each position lights up briefly. Mood: "you learn these four, you stop hanging pieces."
```

### A.7 `cs_chess_tut_g5_5_intro` — Gate 5.5: The Engineer's Notebook (Opera Game)

```
VEO seed: 200013   NB2 seed: 200014
ACTION: GM opens the same notebook from G4.5, deeper into the pages. He sets up the famous Paris Opera Game position (Morphy vs Duke of Brunswick + Count Isouard, 1858). Stage curtain drapes are faintly visible through the back wall — the room itself is remembering the opera box. Mood: "the Prince annotated this one twice — it was his favourite. Today we walk through it together."
```

### A.8 `cs_chess_tut_g6_intro` — Gate 6: Basic Endgames

```
VEO seed: 200015   NB2 seed: 200016
ACTION: Most pieces are off the board. GM places a king + pawn vs king position; demonstrates the opposition by stepping the white king forward; the camera holds on the simple geometry. Mood: "the longest tutorials are about the endings. They are also the only ones that matter at high level."
```

### A.9 `cs_chess_tut_g7_intro` — Gate 7: Strategic Thinking

```
VEO seed: 200017   NB2 seed: 200018
ACTION: GM does NOT set up a position. He stands beside the table looking out the tall window. The board is empty. He turns, sets a single piece in the centre — a white queen — and lets it stand there alone. Mood: "I told you the tutorial was about chess. I was lying — politely — for six gates. The seventh gate is about reading any position. Reality is a position. The Architect is going to hate you."
```

---

## §B — Story-ladder first-encounters (12; canonical `storyOrder` + 1 hidden)

In-universe: after the tutorial, the player climbs the story ladder
in canonical order. Each opponent has a single first-encounter
cutscene — the moment the player sits down at the board across from
them for the first time. Canon descriptions and openings sourced
**verbatim** from `CHESS_CHARACTERS` in `apps/server/routers/chess.ts`.

Visual grammar (applies to every entry below unless overridden):

1. CINEMATOGRAPHY: FPV from the player's chair; the camera approaches
   the table from a few steps back 0–2s; settle into the player's seat
   2–4s; opponent's silhouette resolves across the table 4–6s; final
   8s frame is the opening-position board with the opponent's eyes
   meeting the camera.
2. The board is always in opening position; the opponent's piece
   colour and signature opening are determined by their
   `openingPreference` (see canon block per entry).
3. Lighting per opponent's personality — see each entry.
4. Constraint: FPV_LOCK_PHRASE_VEO; subject-reference = the NB2 poster.

### B.1 `cs_chess_ladder_the_human_first_seated`

**Canon (CHESS_CHARACTERS["the_human"]):**
- name: "The Human"
- loreTitle: "The Balanced"
- style: "universal" — Italian Game openings
- description: *"Adapts to any position. No weaknesses, no extreme strengths. Pure chess fundamentals."*

```
VEO seed: 210001   NB2 seed: 210002
ACTION: The Human sits across the table in a worn detective's overcoat, sleeves rolled. The board between you is set for the Italian Game (e4, e5, Nf3, Nc6, Bc4 already played by him as white). The lighting is the warmest of the ladder — old-fashioned tungsten, a single lamp, very little theatre. He nods once and says nothing. Mood: "this is the only honest game on the ladder. Everyone after him is performing something. He is just playing chess."
```

### B.2 `cs_chess_ladder_the_collector_first_seated`

**Canon:** "The Collector" / Material Hunter / defensive / caro_kann.
*"Hoards material advantage. Trades down to winning endgames. Patient and methodical."*

```
VEO seed: 210003   NB2 seed: 210004
ACTION: The Collector sits surrounded by velvet-lined cases of captured pieces — from previous games, displayed like trophies. The board is set for Caro-Kann (e4, c6 by him as black). He runs a gloved fingertip slowly down the edge of a captured queen in its case. The camera frames him through the trophy display. Cold display-case white-lighting + warm desk tungsten on the board. Mood: "everything you let me touch, I keep."
```

### B.3 `cs_chess_ladder_iron_lion_first_seated`

**Canon:** "Iron Lion" / The Fortress / defensive / london_system.
*"Impenetrable defense. Builds a fortress and waits for opponent mistakes."*

```
VEO seed: 210005   NB2 seed: 210006
ACTION: Iron Lion sits behind a board already set in the London System pawn structure — solid, geometric, unassailable. He is broad-shouldered, motionless, in a high-collared coat of iron-grey. Behind him the wall is built of mortared stone blocks. Cold blue-grey lighting; the brass lamp is unlit. Mood: "I am the wall. You will run out of moves before I run out of patience."
```

### B.4 `cs_chess_ladder_the_enigma_first_seated`

**Canon:** "The Enigma" / The Unpredictable / tactical / sicilian.
*"Wild sacrifices and brilliant combinations. Thrives in chaos and complex positions."*

```
VEO seed: 210007   NB2 seed: 210008
ACTION: The Enigma's face is half-covered by a porcelain harlequin mask. Pieces are already off the board — they have ALREADY sacrificed something to get to this position (a Sicilian Najdorf middlegame, not the opening). The lighting is unstable — flickering coloured spots: red, then violet, then green. Mood: "you walked in halfway through a game I have already been winning."
```

### B.5 `cs_chess_ladder_the_warlord_first_seated`

**Canon:** "The Warlord" / Blitz Commander / aggressive / kings_gambit.
*"Attacks relentlessly from move 1. Sacrifices pawns for initiative. Lives for checkmate."*

```
VEO seed: 210009   NB2 seed: 210010
ACTION: The Warlord sits with armoured forearms on the table, wearing a battle-scarred command tunic. The board is set for King's Gambit (e4, e5, f4 — pawn already sacrificed). He grins, slaps the clock. The room is lit by torchlight + red command HUD; banners of conquered houses hang behind him. Mood: "I gave you a pawn. You did not earn it. Now I take everything."
```

### B.6 `cs_chess_ladder_the_oracle_first_seated`

**Canon:** "The Oracle" / Seer of Moves / endgame / ruy_lopez.
*"Sees 10 moves ahead. Simplifies into winning endgames with surgical precision."*

```
VEO seed: 210011   NB2 seed: 210012
ACTION: The Oracle is veiled in fine pale silk; the room around her is mirrored. The board is set for Ruy Lopez (e4, e5, Nf3, Nc6, Bb5). She is not looking at the board — she is looking ten moves into the future, eyes unfocused. The mirrors show her playing the same game at every age she has ever been. Cold silver lighting; faint Oracle-of-Delphi smoke. Mood: "I have already won. We are merely confirming the position."
```

### B.7 `cs_chess_ladder_the_necromancer_first_seated`

**Canon:** "The Necromancer" / Piece Resurrector / tactical / french_defense.
Unlock: Win 10 ranked games.
*"Sacrifices pieces only to bring devastating counterattacks from the dead position."*

```
VEO seed: 210013   NB2 seed: 210014
ACTION: The Necromancer sits in a high-collared funereal robe; captured pieces lie in a stack beside the board like bones. The board is set for French Winawer (e4, e6, d4, d5, Nc3, Bb4). As you watch, a captured black knight — already off the board — rises in faint blue spirit-light, returns to the board, and re-positions itself. Mood: "death is just a tempo for me."
```

### B.8 `cs_chess_ladder_the_programmer_first_seated`

**Canon:** "The Programmer" / Pattern Matcher / positional / english_opening.
Unlock: Reach Silver tier.
*"Recognizes patterns from millions of games. Plays the statistically optimal move."*

```
VEO seed: 210015   NB2 seed: 210016
ACTION: The Programmer sits behind a wall of translucent data-glass; the chess position is mirrored in floating-text PGN beside their head, scrolling slowly. Board is set for English Opening Symmetrical (c4, c5, Nc3, Nc6, g3, g6). The glass tints faintly cyan with each variation that ticks past. The Programmer never blinks. Mood: "every move you make, I have seen four million times. Statistically, you lose."
```

### B.9 `cs_chess_ladder_agent_zero_first_seated`

**Canon:** "Agent Zero" / The Calculator / tactical / najdorf.
Unlock: Reach Gold tier.
*"Calculates every variation. Finds computer-like moves in complex positions."*

```
VEO seed: 210017   NB2 seed: 210018
ACTION: Agent Zero sits in a featureless black coat under cold white interrogation light. The board is set for Najdorf Poisoned Pawn (e4, c5, Nf3, d6, d4, cxd4, Nxd4, Nf6, Nc3, a6, Bg5, e6, f4, Qb6 — the sharpest line in chess). Pure white background; no ornament; no warmth. Mood: "I am the moves I find. There is no me behind the moves."
```

### B.10 `cs_chess_ladder_the_source_first_seated`

**Canon:** "The Source" / Reality Bender / universal / kings_indian.
Unlock: Reach Diamond tier.
*"Transcends normal chess. Creates positions that shouldn't exist. The ultimate challenge before the Game Master."*

```
VEO seed: 210019   NB2 seed: 210020
ACTION: The Source sits at a chess table that is not a chess table — the squares lift and rotate; pieces stand on impossible Escher tiers. The board is set for King's Indian Classical, but the position EXISTS at three time-stages simultaneously (move 1, move 12, move 30). The Source's form is indistinct: a silhouette that bends light. Mood: "what you are seeing is not a position. It is every position this game could be. Pick one."
```

### B.11 `cs_chess_ladder_game_master_first_seated`

**Canon:** "The Game Master" / Magnus Carlsen Level / universal / any.
Unlock: Reach Grandmaster tier (2400+ ELO).
*"The final boss. Plays at 2800+ ELO. Only the greatest can challenge the Game Master."*

```
VEO seed: 210021   NB2 seed: 210022
ACTION: The corrupted Game Master sits in a black brocade jacket; the analyst chair behind him is the same one from the tutorial room, but the room has changed — the warm tungsten has been replaced by hard television lighting. A producer drone hovers behind his left shoulder. The board between you is empty; he is letting you choose the opening. He picks up the clipboard, glances at it, sets it down. Mood: "I taught you to play chess. Now I find out whether I taught you well enough to beat me."
```

### B.12 `cs_chess_ladder_the_architect_first_seated` (hidden roster)

**Canon:** "The Architect" / Grand Strategist / positional / queen_gambit.
Unlock: hidden (not in `storyOrder`; currently `default` in CHESS_CHARACTERS).
*"Plays deep positional chess. Controls the center, builds slow crushing pressure. Never rushes."*

```
VEO seed: 210023   NB2 seed: 210024
ACTION: The Architect's chair is empty when the player sits. The board is already set for Queen's Gambit (d4, d5, c4 — already played by white). A bishop on the edge of the board moves itself one square. Then another piece. The Architect plays through proxies. The room is the Architect's chamber from the production bible — dark wood, brass instruments, geometric ceiling. Mood: "I do not need to be at the table to play. I have already moved. Your turn."
```

---

## §C — Chess Climb tier wager beats (4; corrupted GM)

In-universe: after defeating the canonical story ladder, the player
unlocks the **Chess Climb** — an escalating-stakes wager ladder run
by the corrupted Game Master as a reality-show host. Each tier opens
with the GM reading the next stake off a clipboard. Source:
`apps/shared/chessClimbTiers.ts`.

Visual grammar:

- Setting: CORRUPTED_ARENA_AESTHETIC — black void; cold white spot on
  the table; floating production drones; audience hush.
- GM always holds a clipboard. He reads from it like a reality-show
  host announcing the next round's twist. He is grinning, but the
  smile is hosting-grin, not warmth.
- The cutscene is the **moment of offer** — what's at stake, what
  you win. The wager line is in the cutscene; the match begins
  immediately after.

### C.1 `cs_chess_climb_tier_0_exhibition` — Tier 0 (Exhibition)

```
VEO seed: 220001   NB2 seed: 220002
ACTION: GM stands beside the table, taps the clipboard once. The lighting is the softest of the Climb — almost warm. Behind him the audience is invisible but you can feel it. He says (subtitled diegetic, no VO required for cutscene): "Tier Zero. Exhibition. No stakes. Just to see if you still know how to sit at a table." He gestures the player to sit. Mood: "this is the free one. The rest are not."
```

### C.2 `cs_chess_climb_tier_1_wagered` — Tier 1 (Wagered ELO)

```
VEO seed: 220003   NB2 seed: 220004
ACTION: GM raises the clipboard. The studio lights tighten on the table. A line of small ELO-bar HUD widgets float between him and the player; his bar is full, yours is full. He says: "Tier One. Wagered. You lose, I take a hundred ELO. You win, you take mine. Best of three." He sets the clipboard down. The audience makes a single low murmur. Mood: "from here on the loss is real."
```

### C.3 `cs_chess_climb_tier_2_hierarchy_table` — Tier 2 (Hierarchy Table)

```
VEO seed: 220005   NB2 seed: 220006
ACTION: GM lifts the clipboard high; the studio lights flare cold white. The table itself rises slightly on hidden hydraulics — it is now The Hierarchy Table, a slab of obsidian inlaid with brass squares. Two iron shackles wait on either side; the GM ignores them. He says: "Tier Two. Hierarchy Table. You lose, you're locked out of chess for twenty-four hours. You win, an Annotated-Knight consumable mints to your inventory. Sit." Mood: "now you bleed time."
```

### C.4 `cs_chess_climb_tier_3_labyrinth_wager` — Tier 3 (Labyrinth Wager / Mol'Garath)

```
VEO seed: 220007   NB2 seed: 220008
ACTION: The studio lights go BLACK except for the table. GM does NOT pick up the clipboard. From the back of the void steps Mol'Garath — present only as a shape, eyes that catch light, the air thickening around him. The GM speaks softly: "Tier Three. Labyrinth Wager. Mol'Garath at the audience. You lose — your streak resets to zero. You win — the labyrinth opens its last door. He came to watch this one. Sit." Mood: "the room is no longer a room; this is the moment the Climb stops being a game."
NB2 NOTE: per _PRODUCTION_FINAL.md §AC.22.2.5, FPV trait-lock is RELAXED for the Mol'Garath beat (static lockoff at audience-head dais level); honour that here — Mol'Garath occupies the upper-left frame; player POV remains seated.
```

---

## Delivery checklist

- Bundle all 25 mp4s + 25 posters into one zip (e.g.
  `CHESS_CUTSCENES_25.zip`), preserving the
  `art/cutscenes/<category>/<id>.mp4` + `.._start.png` layout.
- Upload via the existing wrapper:

  ```bash
  ./apps/scripts/upload_cutscenes.sh --zip ~/Downloads/CHESS_CUTSCENES_25.zip
  ```

  The wrapper auto-detects the layout (see PR #620), syncs into
  `apps/client/public/art/cutscenes/`, and runs the idempotent
  `upload-public-to-s3.ts`.

- Verify with `pnpm tsx scripts/_check-art-coverage.mjs` — the new 25
  entries are already declared in
  `apps/shared/expansionArt/chessCutscenes.data.ts` and will appear
  in the HEAD-probe count.

- Runtime: every cutscene is already wired via
  `apps/shared/roomCutscenes/roomCutsceneTriggers.ts` (25 new
  triggers) and `apps/shared/flags/chessCutsceneFlagProducers.ts`
  (25 `fire*()` helpers). The chess router / tutorial gate-enter
  handler / Climb-tier-accept handler just needs to call the right
  helper on the matching event for the cutscene to surface via
  `<CinematicGate>`.
