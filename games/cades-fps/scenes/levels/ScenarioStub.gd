extends Node3D

# Maps each Historical Incursion scenario to the enemy scene that defines it,
# plus the atmosphere color, Elara enter/exit lines, and kill count required.
const SCENARIO_DATA = {
	"first_breath": {
		"enemy_scene": "res://objects/enemies/ArchitectConstruct.tscn",
		"ambient": Color(0.937, 0.267, 0.267),
		"enter_line": "pillar_first_breath",
		"exit_line": "scenario_exit",
		"kills_required": 5,
		"spawn_interval": 1.5,
	},
	"the_severance": {
		"enemy_scene": "res://objects/enemies/HierarchyAssassin.tscn",
		"ambient": Color(0.231, 0.510, 0.965),
		"enter_line": "pillar_severance",
		"exit_line": "scenario_exit",
		"kills_required": 6,
		"spawn_interval": 1.8,
	},
	"thaloria_burns": {
		"enemy_scene": "res://objects/enemies/CollectorDrone.tscn",
		"ambient": Color(0.659, 0.333, 0.969),
		"enter_line": "pillar_thaloria",
		"exit_line": "scenario_exit",
		"kills_required": 7,
		"spawn_interval": 1.4,
	},
	"the_fall": {
		"enemy_scene": "res://objects/enemies/RealityShard.tscn",
		"ambient": Color(0.545, 0.361, 0.965),
		"enter_line": "pillar_fall",
		"exit_line": "scenario_exit",
		"kills_required": 5,
		"spawn_interval": 1.2,
	},
	"agent_zero_silence": {
		"enemy_scene": "res://objects/enemies/HierarchyStrike.tscn",
		"ambient": Color(0.392, 0.455, 0.557),
		"enter_line": "pillar_agent_zero",
		"exit_line": "scenario_exit",
		"kills_required": 8,
		"spawn_interval": 1.0,
	},
}

@export var scenario_id: String = "first_breath"
var kills: int = 0
var kills_required: int = 5
var enemy_scene_path: String = ""
var exit_line: String = "scenario_exit"

func _ready() -> void:
	# Prefer the runtime-selected scenario if one was set by the Matrix Hub.
	if GameMode.current_scenario != "":
		scenario_id = GameMode.current_scenario
	var data = SCENARIO_DATA.get(scenario_id, SCENARIO_DATA["first_breath"])
	enemy_scene_path = data["enemy_scene"]
	kills_required = data["kills_required"]
	exit_line = data["exit_line"]
	# Color the ambient light to match the scenario palette.
	var env_node = get_node_or_null("WorldEnvironment")
	if env_node and env_node.environment:
		env_node.environment.ambient_light_color = data["ambient"]
	# Configure player weapons + HUD.
	$Player.weapons = [
		load("res://weapons/resonance_disruptor.tres"),
		load("res://weapons/arc_caster.tres"),
		load("res://weapons/severance_blade.tres"),
	]
	$Player.weapon = $Player.weapons[0]
	$Player.initiate_change_weapon(0)
	$HUD.set_mode_ui("historical_incursions")
	$Player.health_updated.connect($HUD._on_health_updated)
	Elara.speak(data["enter_line"])
	# Spawn loop.
	await get_tree().create_timer(3.0).timeout
	for i in kills_required:
		_spawn_enemy()
		await get_tree().create_timer(data["spawn_interval"]).timeout

func _spawn_enemy() -> void:
	var scene = load(enemy_scene_path)
	if scene == null: return
	var enemy = scene.instantiate()
	enemy.player = $Player
	enemy.position = Vector3(randf_range(-8, 8), 2, randf_range(10, 20))
	enemy.tree_exited.connect(_on_enemy_killed)
	add_child(enemy)

func _on_enemy_killed() -> void:
	kills += 1
	if kills >= kills_required:
		Elara.speak(exit_line)
		GameMode.on_scenario_completed(scenario_id)
		GameMode.current_scenario = ""
		await get_tree().create_timer(3.0).timeout
		get_tree().change_scene_to_file("res://scenes/levels/MatrixHub.tscn")
