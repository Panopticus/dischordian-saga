extends Node3D

# Boot Diagnostic — the CADES Unit's first-run calibration protocol.
# A diegetic tutorial: Elara walks the player through optics, locomotion,
# and weapons checks as part of a "post-reboot diagnostic". No
# fourth-wall UI prompts. All guidance comes through the HUD subtitle
# line the player has seen since their first second in the game.
#
# Sequence:
#   1. Optics    — mouse-look detection (cumulative pixel distance)
#   2. Locomotion — walk to a glowing calibration mark (Area3D probe)
#   3. Weapons   — destroy a non-hostile target drone with the primary
#   4. Loadout   — swap to the secondary, destroy a second drone
#   5. Complete  — scene change back to ModeSelect
#
# Escape aborts the sequence and returns to ModeSelect as well.

const TARGET_DRONE_SCENE := preload("res://scenes/levels/TargetDrone.tscn")
const MODE_SELECT_PATH := "res://scenes/menus/ModeSelect.tscn"

@onready var _player: Node3D = $Player
@onready var _hud: CanvasLayer = $HUD
@onready var _mark: Node3D = $CalibrationMark
@onready var _mark_probe: Area3D = $CalibrationMark/Probe
@onready var _drone_spawn: Node3D = $DroneSpawn

var _mouse_motion_accum: float = 0.0
var _on_mark: bool = false
var _aborted: bool = false
var _weapon_swapped: bool = false

func _ready() -> void:
	GameMode.current_mode = "boot_diagnostic"
	WaveManager.reset_for_new_run()
	# Tutorial loadout — two distinct weapons so the "cycle" step is
	# obvious (primary kills the first drone, secondary the second).
	_player.weapons = [
		load("res://weapons/resistance_rifle.tres"),
		load("res://weapons/ironclad.tres"),
	]
	_player.weapon = _player.weapons[0]
	_player.initiate_change_weapon(0)
	# Reuse the last_stand HUD chrome; tutorial only really needs the
	# subtitle line and the weapon-name readout.
	_hud.set_mode_ui("last_stand")
	_player.health_updated.connect(_hud._on_health_updated)
	_player.weapon_changed.connect(_hud.update_weapon_name)
	_player.weapon_changed.connect(_on_weapon_cycled)
	_mark.visible = false
	_mark_probe.body_entered.connect(_on_mark_entered)
	_mark_probe.body_exited.connect(_on_mark_exited)
	_run_diagnostic()

func _input(event: InputEvent) -> void:
	if event is InputEventMouseMotion:
		_mouse_motion_accum += event.relative.length()
	if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		_abort()

# Diagnostic sequence is written as one linear async func so the
# ordering reads top-to-bottom. Each _say() yields for its own pause,
# each _wait_for_* yields until its predicate trips. _aborted short-
# circuits every yield point so Escape genuinely cancels.

func _run_diagnostic() -> void:
	await _wait(1.2)
	if _aborted: return
	await _say("boot_power_cycle", 4.0)
	if _aborted: return
	await _say("boot_optics", 1.0)
	await _wait_for_mouse_motion(320.0)
	if _aborted: return
	await _say("boot_optics_ok", 2.0)
	if _aborted: return
	await _say("boot_locomotion", 0.5)
	_mark.visible = true
	await _wait_for_mark()
	_mark.visible = false
	if _aborted: return
	await _say("boot_locomotion_ok", 2.5)
	if _aborted: return
	await _say("boot_weapons", 1.0)
	await _spawn_and_wait_for_kill()
	if _aborted: return
	await _say("boot_weapons_ok", 2.0)
	if _aborted: return
	await _say("boot_loadout", 0.5)
	_weapon_swapped = false
	await _wait_for_weapon_swap()
	if _aborted: return
	await _spawn_and_wait_for_kill()
	if _aborted: return
	await _say("boot_loadout_ok", 2.0)
	if _aborted: return
	await _say("boot_complete", 3.2)
	_finish()

# --- sequence helpers -------------------------------------------------

func _say(key: String, hold_s: float) -> void:
	var text: String = Elara.LINES.get(key, "")
	if text != "":
		_hud.show_elara("ELARA: " + text)
	await _wait(hold_s)

func _wait(seconds: float) -> void:
	if seconds <= 0.0: return
	await get_tree().create_timer(seconds).timeout

func _wait_for_mouse_motion(required_px: float) -> void:
	_mouse_motion_accum = 0.0
	while not _aborted and _mouse_motion_accum < required_px:
		await get_tree().process_frame

func _wait_for_mark() -> void:
	while not _aborted and not _on_mark:
		await get_tree().process_frame

func _wait_for_weapon_swap() -> void:
	while not _aborted and not _weapon_swapped:
		await get_tree().process_frame

func _spawn_and_wait_for_kill() -> void:
	var drone: Node = TARGET_DRONE_SCENE.instantiate()
	drone.position = _drone_spawn.position
	add_child(drone)
	while not _aborted and is_instance_valid(drone) and not drone.is_queued_for_deletion():
		await get_tree().process_frame

# --- event handlers ---------------------------------------------------

func _on_mark_entered(body: Node) -> void:
	if body == _player:
		_on_mark = true

func _on_mark_exited(body: Node) -> void:
	if body == _player:
		_on_mark = false

func _on_weapon_cycled(_display_name: String) -> void:
	# The very first emission fires during the initial initiate_change_weapon
	# in _ready; we only want the player's deliberate E-press later.
	if _player == null: return
	if _player.weapon_index != 0:
		_weapon_swapped = true

# --- exits ------------------------------------------------------------

func _finish() -> void:
	get_tree().change_scene_to_file(MODE_SELECT_PATH)

func _abort() -> void:
	if _aborted: return
	_aborted = true
	_hud.show_elara("ELARA: " + Elara.LINES.get("boot_abort", "Protocol aborted."))
	await _wait(1.4)
	_finish()
