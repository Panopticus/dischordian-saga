extends Node3D

@export var scenario_id: String = "first_breath"

func _ready() -> void:
	$Player.weapons = [
		load("res://weapons/resonance_disruptor.tres"),
		load("res://weapons/arc_caster.tres"),
		load("res://weapons/severance_blade.tres"),
	]
	$Player.weapon = $Player.weapons[0]
	$Player.initiate_change_weapon(0)
	$HUD.set_mode_ui("historical_incursions")
	$Player.health_updated.connect($HUD._on_health_updated)
	Elara.speak("scenario_enter")
	# Spawn a few enemies
	await get_tree().create_timer(3.0).timeout
	for i in 5:
		_spawn_enemy()
		await get_tree().create_timer(1.5).timeout

func _spawn_enemy() -> void:
	var scene = load("res://objects/enemies/ArchitectConstruct.tscn")
	if scene == null: return
	var enemy = scene.instantiate()
	enemy.player = $Player
	enemy.position = Vector3(randf_range(-8, 8), 2, randf_range(10, 20))
	enemy.tree_exited.connect(_on_enemy_killed)
	add_child(enemy)

var kills: int = 0
func _on_enemy_killed() -> void:
	kills += 1
	if kills >= 5:
		Elara.speak("scenario_exit")
		GameMode.on_scenario_completed(scenario_id)
		await get_tree().create_timer(3.0).timeout
		get_tree().change_scene_to_file("res://scenes/levels/MatrixHub.tscn")
