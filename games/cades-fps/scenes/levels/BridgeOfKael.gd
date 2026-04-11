extends Node3D

var spoke_1h: bool = false
var spoke_2h: bool = false
var canon_done: bool = false

func _ready() -> void:
	Elara.flush_run_start_queue()
	LoopManager.check_open_channel_unlock()
	# Set up wave manager
	var spawns: Array[Node3D] = []
	for child in $SpawnPoints.get_children():
		spawns.append(child)
	WaveManager.spawn_points = spawns
	WaveManager.player = $Player
	# Configure player for Mode 1 weapons
	$Player.weapons = [
		load("res://weapons/ironclad.tres"),
		load("res://weapons/resistance_rifle.tres"),
		load("res://weapons/bridge_anchor.tres"),
	]
	$Player.weapon = $Player.weapons[0]
	$Player.initiate_change_weapon(0)
	# Set HUD
	var hud = $HUD
	hud.set_mode_ui("last_stand")
	hud.update_tokens(GameMode.reinforcement_tokens)
	$Player.health_updated.connect(hud._on_health_updated)
	# Start first wave after countdown
	await get_tree().create_timer(3.0).timeout
	GameMode.game_active = true
	WaveManager.start_wave(1)
	hud.update_wave(1)

func _process(delta: float) -> void:
	if not GameMode.game_active: return
	GameMode.time_held += delta
	$HUD.update_time_held(GameMode.time_held)
	$HUD.update_wave(GameMode.current_wave)
	# Time milestones
	if GameMode.time_held >= 3600 and not spoke_1h:
		spoke_1h = true
		Elara.speak("time_1h")
	if GameMode.time_held >= 7200 and not spoke_2h:
		spoke_2h = true
		Elara.speak("time_2h")
	if GameMode.time_held >= GameMode.CANONICAL_TIME and not canon_done:
		canon_done = true
		GameMode.canon_achieved = true
		Elara.speak("time_canon")
	# Reinforcement input
	if Input.is_action_just_pressed("call_reinforcement"):
		_call_reinforcement()

func _call_reinforcement() -> void:
	if GameMode.reinforcement_tokens <= 0: return
	GameMode.reinforcement_tokens -= 1
	Elara.speak("token_used")
	$HUD.update_tokens(GameMode.reinforcement_tokens)
	if GameMode.reinforcement_tokens == 3:
		Elara.speak("tokens_3")
	elif GameMode.reinforcement_tokens == 0:
		Elara.speak("tokens_0")
	# Suppression: damage nearby enemies
	for enemy in get_tree().get_nodes_in_group("machine_army"):
		if enemy.global_position.distance_to($Player.global_position) < 18.0:
			enemy.damage(15)
