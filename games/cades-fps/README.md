# CADES Unit — Cades FPS

Godot 4.6 FPS sub-game embedded in the wider **dischordian-saga** React app.
The player controls the CADES Unit — a recovered military chassis inherited
by the Agent-Zero archive — across five gameplay modes that each correspond
to a narrative beat in the main game.

This project started as Kenney's CC0 starter kit and has since grown custom
autoloads, enemy rosters, weapon resources, levels, a React bridge, and
mode-specific UX. Kenney's 3D models and sound effects remain CC0; new code
and scene content is project-licensed.

## Modes

| Mode              | Canonical `current_mode`  | Shape of play                                                                                                                                                                          |
| ----------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The Last Stand    | `last_stand`              | Infinite-hold wave survival on the Bridge of Kael. Awareness climbs with loop count; at awareness 5 the Iron Lion's Open Channel conversation unlocks.                                 |
| Ship Defense      | `ship_defense`            | 25-minute timer on Inception Ark 1047. Hold three breach zones (Engineering / Cargo / Observation) while Elara charges the shields. A Thoughtborn pilgrim walks toward CADES mid-run.  |
| Historical Incursions | `historical_incursions` | Pillar-pick hub for archived consciousness-scenarios. Five scenarios unlock from the start; Agent Zero's Silence gates on completing the other five.                                    |
| Mission M3 — Void Corridor | `void_corridor`  | Short (~90 s) narrative combat beat wired to the `cades-m3-{brief,mid,debrief}` VO lines.                                                                                              |
| Mission M4 — Kael's Own    | `kaels_own`      | Short narrative combat beat wired to the `cades-m4-*` VO lines.                                                                                                                        |
| Mission M6 — Vex Solène    | `vex_recruit`    | Short narrative combat beat wired to the `cades-m6-*` VO lines.                                                                                                                        |

## Controls

| Key                               | Action              |
| --------------------------------- | ------------------- |
| `W` `A` `S` `D`                   | Movement            |
| Spacebar                          | Jump (2× air jumps) |
| Mouse                             | Look                |
| Left mouse button                 | Shoot               |
| `E`                               | Cycle weapon        |
| `R`                               | Call reinforcement (Last Stand) |
| `F`                               | Interact / Open Channel (Bridge of Kael) |
| `Esc`                             | Release mouse (Last Stand mode exits historical replay) |
| Click on canvas                   | Re-capture mouse    |

## React bridge contract

All cross-iframe traffic goes through `autoloads/WebBridge.gd` using
`postMessage` to `window.parent`.

**React → Godot (`CADES_CONFIG`, at load time):**

```json
{
  "mode": "last_stand",
  "loop_count": 0,
  "awareness_level": 0,
  "scenarios_completed": [],
  "suit_bonuses": {
    "weapon_damage_mult": 1.0,
    "weapon_cooldown_mult": 1.0,
    "player_speed_mult": 1.0,
    "damage_resist_mult": 1.0,
    "shield_rate_mult": 1.0
  }
}
```

`suit_bonuses` is additive-only — missing keys fall back to `1.0`, so the
React side can introduce new multipliers without coordinating a Godot
release.

**Godot → React (`CADES_RESULT`, per-run):** payload shape varies by mode,
but always includes `mode` and `success`. Missions also emit
`CADES_GM_CONTACT` when the Game-Masters escalation fires.

## Layout

```
autoloads/             # singletons registered in project.godot
  Audio.gd             # pooled AudioStreamPlayer with pitch jitter
  GameMode.gd          # current-mode state machine + run stats
  Elara.gd             # VO/subtitle dispatcher, LINES + VO_URLS dicts
  WebBridge.gd         # postMessage bridge; latches CADES_CONFIG
  WaveManager.gd       # Last-Stand wave table + HP scaling
  LoopManager.gd       # loop count / awareness / Open Channel gate
  ShieldManager.gd     # Ship-Defense 25-min timer + breach state
  HistoricalManager.gd # scenario registry + GM contact escalation
objects/               # in-world actors (player, enemy base, props)
  enemies/*.tscn       # per-archetype scenes that extend scripts/enemy_base.gd
scenes/
  menus/ModeSelect     # boot scene
  levels/              # BridgeOfKael, Ark1047, MatrixHub, mission arenas, HistoricalScenario
  ui/                  # HUD, GMMessageUI, LoopResetUI, OpenChannelSequence
scripts/               # non-autoload scripts (HUD, enemy_base, weapon, …)
weapons/               # .tres weapon resources (8 weapons)
models/ sprites/ sounds/ fonts/ vector/  # assets
```

## Adding a weapon

1. Duplicate an existing `weapons/*.tres`.
2. Adjust `cooldown`, `damage`, `spread`, `shot_count`, `knockback`, etc.
3. Reference the new resource from whichever level `.gd` assigns
   `$Player.weapons`.

Weapons are balanced in the **~50–90 DPS band** with role differentiation
by spread / shot count / knockback. Please keep new entries inside that
band — the previous "one dominant weapon" era is something we outgrew.

## Adding an enemy archetype

1. Duplicate an existing `objects/enemies/*.tscn`.
2. Set `enemy_name`, `max_health`, `attack_damage`, `bob_amplitude`, and the
   Timer `wait_time` (attack interval) on the root node.
3. Reference the new scene from `WaveManager._spawn_single` or a level's own
   spawn table.

Wave-based HP scaling is applied at spawn time by `WaveManager`
(`max_health * (1 + 0.08·(wave-1))`, capped at 3×), so per-archetype
`max_health` is your *wave-1* value.

## Tests

A minimal headless test runner lives under `tests/`. It uses the real
autoloads (no mocks) and covers the state-machine pieces where a silent
regression would be hardest to notice: `GameMode.reset_for_mode`, the
`WaveManager` wave table and HP-scaling formula, `HistoricalManager`
scenario gating, and the `LoopManager` awareness-hold semantics.

Run from Godot 4.6:

```bash
godot --headless --path games/cades-fps res://tests/Tests.tscn
```

Exit code is `0` when every test passes, `1` otherwise — wire into CI
directly. `tests/TestRunner.gd` is ~60 lines; add new suites by creating
a `test_xxx.gd` script with a `_suite_name()` method and `test_*`
methods, then attaching it as a child of `Tests.tscn`'s `TestRunner`
root.

## Branding

`splash-screen.png` and `icon.png` are procedurally generated from
`scripts/gen_branding.py` — a pure-stdlib Python renderer that draws a
hand-coded 5×7 bitmap wordmark ("CADES" + "INCEPTION ARK - 1047"
tagline) on a black canvas in the Iron Lion accent orange. The generator
is deterministic, so re-running it produces bit-identical output. To
tweak or re-render:

```bash
python3 games/cades-fps/scripts/gen_branding.py
```

This is placeholder-quality — intentional, legible, on-palette — not
final brand art. Replace whenever a designer takes a pass; the
`.png.import` files next to each PNG will be regenerated by Godot on
the next editor open.

## License

Original Kenney starter assets remain CC0. Project-added code, scenes, and
resources are covered by the root repo license.
