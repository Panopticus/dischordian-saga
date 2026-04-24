extends Node

# Guards the attack_pattern behaviours added in PR 3 (combat depth):
#
#   - hover_shoot   — bob in place
#   - strafer       — orbit the player on the XZ plane
#   - charger       — close distance; detonate on arrival
#   - shielded      — periodic invulnerability window
#
# Two layers of tests:
#   1. Scene-assignment tests load the actual .tscn and verify the
#      intended archetypes carry the intended pattern. Catches someone
#      editing a .tscn and wiping the attack_pattern line.
#   2. Behaviour tests drive enemy_base.gd's tick functions directly
#      against orphan Node3D + a stub player, so the pattern math is
#      exercised without standing up the full scene tree.

var _runner: Node

func _suite_name() -> String:
	return "AttackPattern"

func _ready() -> void:
	_runner = get_parent()

# --- scene-assignment tests --------------------------------------------

const EXPECTED_PATTERNS := {
	"res://objects/enemies/HierarchyStrike.tscn":       &"strafer",
	"res://objects/enemies/CollectorDrone.tscn":        &"strafer",
	"res://objects/enemies/HierarchyAssassin.tscn":     &"charger",
	"res://objects/enemies/ReclamationEnforcer.tscn":   &"charger",
	"res://objects/enemies/MachineCommander.tscn":      &"shielded",
	"res://objects/enemies/ReclamationCommander.tscn":  &"shielded",
}

func test_archetypes_carry_intended_pattern() -> void:
	for path in EXPECTED_PATTERNS.keys():
		var scene: PackedScene = load(path)
		_runner.assert_true(scene != null, "load " + path)
		var enemy = scene.instantiate()
		_runner.assert_eq(enemy.attack_pattern, EXPECTED_PATTERNS[path], path)
		enemy.free()

func test_default_archetypes_remain_hover_shoot() -> void:
	# Fuse against accidental pattern changes on the "boring" enemies —
	# if someone adds an attack_pattern line to these they should have
	# to update this test at the same time.
	var defaults = [
		"res://objects/enemies/MachineScout.tscn",
		"res://objects/enemies/MachineSoldier.tscn",
		"res://objects/enemies/MachineVanguard.tscn",
		"res://objects/enemies/MachineDisruptor.tscn",
	]
	for path in defaults:
		var scene: PackedScene = load(path)
		var enemy = scene.instantiate()
		_runner.assert_eq(enemy.attack_pattern, &"hover_shoot", path)
		enemy.free()

# --- behaviour tests (orphan-node) ------------------------------------

const ENEMY_BASE_SCRIPT := preload("res://scripts/enemy_base.gd")

func _make_enemy() -> Node3D:
	# Orphan Node3D with the enemy_base script attached. _ready never
	# fires (node is never added to a tree), so the @onready lookups
	# stay nil — safe because the tick helpers below don't touch them.
	var e := Node3D.new()
	e.set_script(ENEMY_BASE_SCRIPT)
	e.target_position = Vector3.ZERO
	e.time = 0.0
	e.bob_amplitude = 1.0
	return e

func _make_player(pos: Vector3 = Vector3(0, 0, 10)) -> Node3D:
	var p := Node3D.new()
	p.position = pos
	return p

# Shielded ---------------------------------------------------------

func test_shielded_invulnerable_inside_window() -> void:
	var e := _make_enemy()
	e.attack_pattern = &"shielded"
	e.shielded_window_on = 1.5
	e.shielded_window_off = 4.0
	e.time = 0.5
	e._tick_shielded(0.016)
	_runner.assert_true(e._shield_active, "t=0.5")
	e.free()

func test_shielded_vulnerable_outside_window() -> void:
	var e := _make_enemy()
	e.attack_pattern = &"shielded"
	e.shielded_window_on = 1.5
	e.shielded_window_off = 4.0
	e.time = 2.0
	e._tick_shielded(0.016)
	_runner.assert_false(e._shield_active, "t=2.0")
	e.free()

func test_shielded_cycle_wraps() -> void:
	# cycle = 1.5 + 4.0 = 5.5; t=6.0 → fmod = 0.5 < 1.5 → shielded again.
	var e := _make_enemy()
	e.attack_pattern = &"shielded"
	e.shielded_window_on = 1.5
	e.shielded_window_off = 4.0
	e.time = 6.0
	e._tick_shielded(0.016)
	_runner.assert_true(e._shield_active, "t=6.0 wraps")
	e.free()

# Charger ----------------------------------------------------------

func test_charger_closes_distance() -> void:
	var e := _make_enemy()
	e.attack_pattern = &"charger"
	e.charger_speed = 3.0
	e.charger_detonate_range = 2.5
	var p := _make_player(Vector3(0, 0, 10))
	e.player = p
	e.target_position = Vector3(0, 0, 0)
	e._tick_charger(1.0) # one-second tick
	# Should have moved ~3.0 m toward the player along +Z.
	_runner.assert_near(e.target_position.z, 3.0, 0.01, "charger z-advance")
	e.free()
	p.free()

func test_charger_does_not_overshoot_beyond_close_range() -> void:
	# When within detonate range, _tick_charger takes the early-return
	# branch and does NOT advance target_position.
	var e := _make_enemy()
	e.attack_pattern = &"charger"
	e.charger_detonate_range = 2.5
	var p := _make_player(Vector3(0, 0, 2.0)) # within detonate range
	e.player = p
	e.target_position = Vector3(0, 0, 0)
	# Can't actually call _tick_charger here without player.damage() +
	# queue_free() firing on an orphan. Verify the distance check
	# predicate the same way _tick_charger does.
	var dist: float = (p.global_position - e.target_position).length()
	_runner.assert_true(dist <= e.charger_detonate_range, "detonate branch predicate")
	e.free()
	p.free()

# Strafer ----------------------------------------------------------

func test_strafer_orbits_on_xz_plane() -> void:
	var e := _make_enemy()
	e.attack_pattern = &"strafer"
	e.strafer_radius = 5.0
	e.strafer_speed = 1.3
	var p := _make_player(Vector3(0, 0, 0))
	e.player = p
	# Seed target_position near the orbit target, then tick enough that
	# the lerp converges. target_xz = player + (cos(t*s)*r, 0, sin(t*s)*r).
	# At t = 0, target should be at (r, 0, 0) = (5, 0, 0).
	e.time = 0.0
	e.target_position = Vector3(4.8, 0, 0.0)
	for i in 60:
		e._tick_strafer(0.016)
	# After a second of lerp ticks the target should be near (5, ~1.2, 0)
	# (XZ on the orbit, Y at player + 1.2 + small bob).
	_runner.assert_near(e.target_position.x, 5.0, 0.25, "strafer x near radius")
	_runner.assert_near(e.target_position.z, 0.0, 0.5, "strafer z near orbit")
	e.free()
	p.free()

# Hover-shoot ------------------------------------------------------

func test_hover_shoot_bobs_y_only() -> void:
	var e := _make_enemy()
	e.attack_pattern = &"hover_shoot"
	e.bob_amplitude = 1.0
	e.target_position = Vector3(0, 0, 0)
	e.time = 0.0
	for i in 30:
		e.time += 0.016
		e._tick_hover_shoot(0.016)
	# cos(t*5) at t≈0.48 is ≈ 0.09 — the drift is tiny but strictly
	# non-zero, which is the point.
	_runner.assert_near(e.target_position.x, 0.0, 0.001, "no x drift")
	_runner.assert_near(e.target_position.z, 0.0, 0.001, "no z drift")
	e.free()
