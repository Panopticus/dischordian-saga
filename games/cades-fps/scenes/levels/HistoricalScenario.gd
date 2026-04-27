extends Node3D

# Per-scenario historical incursion. Reads GameMode.current_scenario and
# procedurally decorates the level with unique geometry, lighting, and
# enemy choice. Each scenario is a short arena defense: kill N enemies
# then return to the Matrix Hub.
#
# All five non-`last_stand` Matrix pillars route here; HistoricalManager
# owns the scenario → .tscn mapping.

const SCENARIO_DATA = {
	"first_breath": {
		"enemy_scene":   "res://objects/enemies/ArchitectConstruct.tscn",
		"ambient":       Color(0.937, 0.267, 0.267),
		"fog":           Color(0.23, 0.05, 0.05),
		"enter_line":    "pillar_first_breath",
		"kills_required": 5,
		"spawn_interval": 1.5,
		# Geometry flavor: gridded wireframe arena — the Architect's
		# prototyping sandbox before he turned.
		"layout":        "grid",
		"pillar_count":  6,
	},
	"the_severance": {
		"enemy_scene":   "res://objects/enemies/HierarchyAssassin.tscn",
		"ambient":       Color(0.231, 0.510, 0.965),
		"fog":           Color(0.04, 0.06, 0.2),
		"enter_line":    "pillar_severance",
		"kills_required": 6,
		"spawn_interval": 1.8,
		# Geometry flavor: Kael's safehouse corridor — long, narrow, sparse.
		"layout":        "corridor",
		"pillar_count":  4,
	},
	"thaloria_burns": {
		"enemy_scene":   "res://objects/enemies/CollectorDrone.tscn",
		"ambient":       Color(0.659, 0.333, 0.969),
		"fog":           Color(0.2, 0.08, 0.22),
		"enter_line":    "pillar_thaloria",
		"kills_required": 7,
		"spawn_interval": 1.4,
		# Geometry flavor: debris field — cracked pillars like a burned city.
		"layout":        "debris",
		"pillar_count":  8,
	},
	"the_fall": {
		"enemy_scene":   "res://objects/enemies/RealityShard.tscn",
		"ambient":       Color(0.545, 0.361, 0.965),
		"fog":           Color(0.1, 0.06, 0.2),
		"enter_line":    "pillar_fall",
		"kills_required": 5,
		"spawn_interval": 1.2,
		# Geometry flavor: fractured reality — pillars at broken angles.
		"layout":        "fractured",
		"pillar_count":  7,
	},
	"agent_zero_silence": {
		"enemy_scene":   "res://objects/enemies/HierarchyStrike.tscn",
		"ambient":       Color(0.392, 0.455, 0.557),
		"fog":           Color(0.08, 0.08, 0.1),
		"enter_line":    "pillar_agent_zero",
		"kills_required": 8,
		"spawn_interval": 1.0,
		# Geometry flavor: cold storage vault — rectangular bays.
		"layout":        "vault",
		"pillar_count":  10,
	},
}

@export var scenario_id: String = "first_breath"
var kills: int = 0
var kills_required: int = 5
var enemy_scene_path: String = ""
var exit_line: String = "scenario_exit"

func _ready() -> void:
	if GameMode.current_scenario != "":
		scenario_id = GameMode.current_scenario
	var data = SCENARIO_DATA.get(scenario_id, SCENARIO_DATA["first_breath"])
	enemy_scene_path = data["enemy_scene"]
	kills_required = data["kills_required"]
	# Decorate the environment.
	_tint_environment(data["ambient"], data["fog"])
	_build_layout(data["layout"], data["ambient"], data["pillar_count"])
	# Configure player.
	$Player.weapons = [
		load("res://weapons/resonance_disruptor.tres"),
		load("res://weapons/arc_caster.tres"),
		load("res://weapons/severance_blade.tres"),
	]
	$Player.weapon = $Player.weapons[0]
	$Player.initiate_change_weapon(0)
	$HUD.set_mode_ui("historical_incursions")
	$Player.health_updated.connect($HUD._on_health_updated)
	$Player.weapon_changed.connect($HUD.update_weapon_name)
	Elara.speak(data["enter_line"])
	# Spawn loop.
	await get_tree().create_timer(3.0).timeout
	for i in kills_required:
		_spawn_enemy()
		await get_tree().create_timer(data["spawn_interval"]).timeout

func _tint_environment(ambient: Color, fog: Color) -> void:
	var env_node = get_node_or_null("WorldEnvironment")
	if env_node == null or env_node.environment == null:
		return
	var env = env_node.environment
	env.ambient_light_color = ambient
	env.fog_enabled = true
	env.fog_density = 0.02
	env.fog_light_color = fog

func _build_layout(layout: String, pillar_color: Color, pillar_count: int) -> void:
	var root = Node3D.new()
	root.name = "ProceduralGeometry"
	add_child(root)
	match layout:
		"grid":
			_layout_grid(root, pillar_color, pillar_count)
		"corridor":
			_layout_corridor(root, pillar_color, pillar_count)
		"debris":
			_layout_debris(root, pillar_color, pillar_count)
		"fractured":
			_layout_fractured(root, pillar_color, pillar_count)
		"vault":
			_layout_vault(root, pillar_color, pillar_count)
	# Add a small center marker light so the player can tell they're in the
	# middle of a distinct scenario.
	var center_light = OmniLight3D.new()
	center_light.position = Vector3(0, 4, 15)
	center_light.light_color = pillar_color
	center_light.light_energy = 1.2
	center_light.omni_range = 14.0
	root.add_child(center_light)

func _spawn_pillar(parent: Node3D, pos: Vector3, color: Color, height: float = 4.0) -> void:
	var pillar = MeshInstance3D.new()
	var mesh = BoxMesh.new()
	mesh.size = Vector3(0.8, height, 0.8)
	pillar.mesh = mesh
	pillar.position = pos + Vector3(0, height * 0.5, 0)
	var mat = StandardMaterial3D.new()
	mat.albedo_color = color
	mat.emission_enabled = true
	mat.emission = color
	mat.emission_energy_multiplier = 0.7
	pillar.material_override = mat
	parent.add_child(pillar)

func _layout_grid(parent: Node3D, color: Color, count: int) -> void:
	# Regular 3x3 grid of short pillars around the player.
	var grid_size = 3
	var spacing = 6.0
	var offset = (grid_size - 1) * spacing * 0.5
	var placed = 0
	for x in grid_size:
		for z in grid_size:
			if x == 1 and z == 1: continue # leave center open
			if placed >= count: return
			_spawn_pillar(parent, Vector3(-offset + x * spacing, 0, -offset + z * spacing + 15), color, 3.5)
			placed += 1

func _layout_corridor(parent: Node3D, color: Color, count: int) -> void:
	# Two parallel rows of tall pillars forming a corridor.
	var pairs = max(2, count / 2)
	var spacing = 5.0
	for i in pairs:
		var z = 6.0 + i * spacing
		_spawn_pillar(parent, Vector3(-4, 0, z), color, 5.0)
		_spawn_pillar(parent, Vector3(4, 0, z), color, 5.0)

func _layout_debris(parent: Node3D, color: Color, count: int) -> void:
	# Scattered short debris pillars at random angles.
	var rng = RandomNumberGenerator.new()
	rng.seed = 94821
	for i in count:
		var x = rng.randf_range(-10, 10)
		var z = rng.randf_range(4, 22)
		var h = rng.randf_range(1.2, 3.0)
		var pillar = MeshInstance3D.new()
		var mesh = BoxMesh.new()
		mesh.size = Vector3(rng.randf_range(0.6, 1.4), h, rng.randf_range(0.6, 1.4))
		pillar.mesh = mesh
		pillar.position = Vector3(x, h * 0.5, z)
		pillar.rotation = Vector3(rng.randf_range(-0.3, 0.3), rng.randf_range(0, TAU), rng.randf_range(-0.3, 0.3))
		var mat = StandardMaterial3D.new()
		mat.albedo_color = color
		mat.emission_enabled = true
		mat.emission = color
		mat.emission_energy_multiplier = 0.5
		pillar.material_override = mat
		parent.add_child(pillar)

func _layout_fractured(parent: Node3D, color: Color, count: int) -> void:
	# Tilted pillars suggesting broken spacetime.
	var rng = RandomNumberGenerator.new()
	rng.seed = 71115
	for i in count:
		var angle = (float(i) / count) * TAU
		var r = rng.randf_range(5, 10)
		var pos = Vector3(cos(angle) * r, 0, sin(angle) * r + 14)
		var pillar = MeshInstance3D.new()
		var mesh = BoxMesh.new()
		mesh.size = Vector3(0.5, 4.5, 0.5)
		pillar.mesh = mesh
		pillar.position = pos + Vector3(0, 2.2, 0)
		pillar.rotation = Vector3(rng.randf_range(-0.5, 0.5), angle, rng.randf_range(-0.5, 0.5))
		var mat = StandardMaterial3D.new()
		mat.albedo_color = color
		mat.emission_enabled = true
		mat.emission = color
		mat.emission_energy_multiplier = 1.2
		pillar.material_override = mat
		parent.add_child(pillar)

func _layout_vault(parent: Node3D, color: Color, count: int) -> void:
	# Rectangular vault bays — walls forming a narrow corridor with side bays.
	var rows = max(2, count / 2)
	for i in rows:
		var z = 4.0 + i * 4.5
		# Left wall
		var left = MeshInstance3D.new()
		var lm = BoxMesh.new()
		lm.size = Vector3(0.3, 3.5, 3.0)
		left.mesh = lm
		left.position = Vector3(-6, 1.75, z)
		var lmat = StandardMaterial3D.new()
		lmat.albedo_color = color
		lmat.emission_enabled = true
		lmat.emission = color
		lmat.emission_energy_multiplier = 0.4
		left.material_override = lmat
		parent.add_child(left)
		# Right wall
		var right = MeshInstance3D.new()
		right.mesh = lm
		right.position = Vector3(6, 1.75, z)
		right.material_override = lmat
		parent.add_child(right)

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
