extends Node3D

# Shared mission-arena runner for CADES_FPS_MISSIONS M3 / M4 / M6.
# Each mission is a short narrative beat — the player kills N enemies
# in a themed arena, then the scene posts a CADES_RESULT with the
# canonical `mode` string the React side maps to the mission's flag.
#
# Concrete scenes (VoidCorridor.tscn / KaelsOwn.tscn / VexRecruit.tscn)
# instance this script and set `@export var mode_id: String` to the
# matching GameMode.current_mode value. Kills-required + optional tint
# come from GameMode.reset_for_mode() so the two sides stay in sync.
#
# Geometry/lighting is intentionally minimal — these missions carry
# their narrative weight through voice-over (act5-vo-lines.json). The
# arena exists to give the player something tangible to do while the
# Iron Lion / Kael / Vex Solène brief+mid+debrief lines play through.

@export var mode_id: String = "void_corridor"
@export var ambient_color: Color = Color(0.10, 0.10, 0.16)
@export var fog_color: Color = Color(0.04, 0.04, 0.08)
# Legacy single-scene path kept for backwards compat. If enemy_scene_paths
# is non-empty it wins; otherwise we fall back to enemy_scene_path.
@export var enemy_scene_path: String = "res://objects/enemy.tscn"
@export var enemy_scene_paths: Array[String] = []
@export var spawn_interval: float = 1.2

var kills: int = 0
var start_time_ms: int = 0
var result_sent: bool = false
var _enemy_scenes: Array[PackedScene] = []

@onready var _player: Node3D = $Player
@onready var _spawn_points: Node = $SpawnPoints

func _ready() -> void:
	GameMode.current_mode = mode_id
	start_time_ms = Time.get_ticks_msec()
	WaveManager.reset_for_new_run()
	# Player death → mission-failure result. health_updated emits
	# synchronously from player.damage() before its own scene reload,
	# so the CADES_RESULT reaches the React side before the arena
	# unmounts.
	_player.health_updated.connect(_on_player_health_updated)
	# HUD readouts for integrity + weapon name, matching the other
	# combat-mode levels.
	var hud := get_node_or_null("HUD")
	if hud:
		_player.health_updated.connect(hud._on_health_updated)
		_player.weapon_changed.connect(hud.update_weapon_name)
	# The ambient/fog lean on the main environment defaults — scenes
	# can override by replacing WorldEnvironment in their .tscn, but
	# the script won't force-replace a scene-provided Environment.
	if $WorldEnvironment and $WorldEnvironment.environment:
		var env: Environment = $WorldEnvironment.environment
		env.ambient_light_color = ambient_color
		env.fog_light_color = fog_color
	# Cache the enemy scene(s) once rather than load()-ing per spawn tick —
	# web builds especially don't want an asset-cache round-trip every
	# 1.2 s. enemy_scene_paths wins if set; otherwise fall back to the
	# legacy single enemy_scene_path.
	var paths: Array = enemy_scene_paths if not enemy_scene_paths.is_empty() else [enemy_scene_path]
	for p in paths:
		var s: PackedScene = load(p)
		if s == null:
			push_warning("MissionArena: failed to load enemy scene %s" % p)
		else:
			_enemy_scenes.append(s)
	# Start the spawn loop. Tight intervals so the 45-second mid-line
	# timer (wired on the React side) lands during a fight.
	var spawn_timer := Timer.new()
	spawn_timer.wait_time = spawn_interval
	spawn_timer.timeout.connect(_on_spawn_tick)
	add_child(spawn_timer)
	spawn_timer.start()

func _process(delta: float) -> void:
	GameMode.mission_time_elapsed += delta

func _on_spawn_tick() -> void:
	if result_sent: return
	if _enemy_scenes.is_empty(): return
	var spawns := _spawn_points.get_children()
	if spawns.is_empty(): return
	var spawn: Node3D = spawns.pick_random()
	var scene: PackedScene = _enemy_scenes.pick_random()
	var enemy: Node3D = scene.instantiate()
	if "player" in enemy:
		enemy.player = _player
	enemy.position = spawn.position
	enemy.tree_exited.connect(_on_enemy_killed)
	add_child(enemy)

func _on_enemy_killed() -> void:
	if result_sent: return
	kills += 1
	GameMode.mission_kills = kills
	if kills >= GameMode.mission_kills_required:
		_send_success()

func _send_success() -> void:
	if result_sent: return
	result_sent = true
	GameMode.mission_completed = true
	var elapsed_s: float = float(Time.get_ticks_msec() - start_time_ms) / 1000.0
	WebBridge.send_result({
		"mode": mode_id,
		"success": true,
		"kills": kills,
		"time_taken": elapsed_s,
	})

func _on_player_health_updated(new_health: int) -> void:
	if new_health <= 0:
		_on_player_died()

func _on_player_died() -> void:
	# Mission "loss" still reports — React side only raises the M-flag
	# on success, but plays the authored debrief line regardless, and
	# the Living Universe layer may react to the death separately.
	if result_sent: return
	result_sent = true
	var elapsed_s: float = float(Time.get_ticks_msec() - start_time_ms) / 1000.0
	WebBridge.send_result({
		"mode": mode_id,
		"success": false,
		"kills": kills,
		"time_taken": elapsed_s,
	})
