extends Node

var player: Node3D
var spawn_points: Array[Node3D] = []
var enemies_alive: int = 0
var wave_active: bool = false
# Incremented every time the BridgeOfKael scene is torn down (player death,
# historical replay exit, etc.). Any in-flight spawn loops that notice a
# mismatch between their captured epoch and the current one bail out.
var spawn_epoch: int = 0

func reset_for_new_run() -> void:
	wave_active = false
	enemies_alive = 0
	spawn_points.clear()
	player = null
	spawn_epoch += 1

const WAVE_DEFS = {
	1: {"type": "MachineScout", "count": 5, "interval": 2.0},
	2: {"type": "MachineScout", "count": 8, "interval": 1.5},
	3: {"type": "MachineScout", "count": 10, "interval": 1.5},
	4: {"type": "MachineSoldier", "count": 6, "interval": 2.0},
	5: {"type": "MachineSoldier", "count": 8, "interval": 1.8},
	6: {"type": "MachineSoldier", "count": 10, "interval": 1.5},
	7: {"type": "MachineVanguard", "count": 4, "interval": 3.0},
	8: {"type": "MachineVanguard", "count": 6, "interval": 2.5},
	9: {"type": "MachineVanguard", "count": 8, "interval": 2.0},
	10: {"type": "MachineDisruptor", "count": 6, "interval": 2.0},
	11: {"type": "MachineDisruptor", "count": 8, "interval": 1.8},
	12: {"type": "MixedDV", "count": 8, "interval": 1.5},
	13: {"type": "CommandWave", "count": 10, "interval": 1.0},
	14: {"type": "CommandWave", "count": 12, "interval": 0.8},
	15: {"type": "CommandWave", "count": 15, "interval": 0.6},
}

func start_wave(wave_num: int) -> void:
	GameMode.current_wave = wave_num
	wave_active = true
	var wave_data: Dictionary
	if WAVE_DEFS.has(wave_num):
		wave_data = WAVE_DEFS[wave_num]
	else:
		var n = wave_num - 15
		wave_data = {"type": "CommandWave", "count": 10 + (n * 3), "interval": max(0.3, 1.0 - (n * 0.05))}
	match wave_num:
		1: Elara.speak("wave_1")
		4: Elara.speak("wave_4_soldiers")
		7: Elara.speak("wave_7")
		10: Elara.speak("wave_10_disruptors")
		13: Elara.speak("wave_13")
	enemies_alive = wave_data["count"]
	_spawn_wave(wave_data)

func _spawn_wave(data: Dictionary) -> void:
	var count: int = data["count"]
	var interval: float = data["interval"]
	var my_epoch: int = spawn_epoch
	for i in count:
		await get_tree().create_timer(interval * i).timeout
		# Bail out if the scene has been reset while we were awaiting — the
		# old level's spawn loop must not bleed enemies into a fresh run.
		if not wave_active: return
		if my_epoch != spawn_epoch: return
		if not is_instance_valid(player): return
		_spawn_single(data["type"])

func _spawn_single(type: String) -> void:
	var actual_type = type
	match type:
		"MixedDV":
			actual_type = ["MachineDisruptor", "MachineVanguard"][randi() % 2]
		"CommandWave":
			actual_type = ["MachineDisruptor", "MachineVanguard", "MachineSoldier"][randi() % 3]
	if type == "CommandWave" and GameMode.current_wave == 13 and enemies_alive == WAVE_DEFS[13]["count"]:
		actual_type = "MachineCommander"
	if spawn_points.is_empty(): return
	var sp = spawn_points[randi() % spawn_points.size()]
	var scene_path = "res://objects/enemies/" + actual_type + ".tscn"
	var scene = load(scene_path)
	if scene == null: return
	var enemy = scene.instantiate()
	enemy.player = player
	enemy.position = sp.global_position
	enemy.add_to_group("machine_army")
	enemy.tree_exited.connect(_on_enemy_died)
	get_tree().current_scene.add_child(enemy)

func _on_enemy_died() -> void:
	enemies_alive -= 1
	if enemies_alive <= 0:
		wave_active = false
		await get_tree().create_timer(3.0).timeout
		start_wave(GameMode.current_wave + 1)
