extends Node3D

const OPEN_CHANNEL_SCENE := "res://scenes/ui/OpenChannelSequence.tscn"

var spoke_1h: bool = false
var spoke_2h: bool = false
var canon_done: bool = false
var open_channel_active: bool = false
var _open_channel_sequence: Node = null

func _ready() -> void:
	# BridgeOfKael is always "last_stand" combat, whether entered directly
	# from Mode Select or re-entered from the Matrix Hub as a historical replay.
	GameMode.current_mode = "last_stand"
	Elara.flush_run_start_queue()
	LoopManager.check_open_channel_unlock()
	# Reset the wave manager so any orphaned spawn loops from a previous
	# run (before a scene reload) abandon themselves instead of spawning
	# into our fresh scene tree.
	WaveManager.reset_for_new_run()
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
	# If the channel is already primed for this run, let Elara say so.
	if GameMode.awareness_level >= 5 and not GameMode.open_channel_used:
		Elara.queue_for_run_start("open_channel_ready")
		Elara.queue_for_run_start("iron_lion_channel")
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
		# Historical replays end at canonical time and return to the hub.
		# Direct Mode 1 runs continue the infinite hold.
		if GameMode.current_scenario == "last_stand":
			_finish_historical_replay()
	# Reinforcement input
	if Input.is_action_just_pressed("call_reinforcement"):
		_call_reinforcement()
	# Iron Lion — Open Channel interaction
	if Input.is_action_just_pressed("interact"):
		_try_open_channel()
	# Historical replay exit: Escape returns to the Matrix Hub.
	if GameMode.current_scenario == "last_stand" and Input.is_action_just_pressed("pause_game"):
		_finish_historical_replay()

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

func _try_open_channel() -> void:
	if open_channel_active: return
	if GameMode.awareness_level < 5: return
	if GameMode.open_channel_used: return
	open_channel_active = true
	GameMode.game_active = false
	# Hide the prompt — we're committing to the conversation now.
	var hud = $HUD
	if hud and hud.has_node("OpenChannelPrompt"):
		hud.get_node("OpenChannelPrompt").visible = false
	# Re-purposing the weapon-change SFX as the channel-open stinger —
	# short percussive hit reads cleanly as "something just toggled" and
	# the existing CC0 asset ships today.
	Audio.play("sounds/weapon_change.ogg")
	var scene: PackedScene = load(OPEN_CHANNEL_SCENE)
	if scene == null:
		_finish_open_channel()
		return
	_open_channel_sequence = scene.instantiate()
	add_child(_open_channel_sequence)
	if _open_channel_sequence.has_signal("conversation_complete"):
		_open_channel_sequence.conversation_complete.connect(_finish_open_channel)

func _finish_open_channel() -> void:
	var choice := ""
	if _open_channel_sequence != null and "player_choice" in _open_channel_sequence:
		choice = _open_channel_sequence.player_choice
	_open_channel_sequence = null
	LoopManager.on_open_channel_activated(choice)
	GameMode.game_active = true

func _finish_historical_replay() -> void:
	# Called when Bridge of Kael is being run as a Historical Incursion
	# pillar and the player has either hit canon or chosen to exit.
	GameMode.game_active = false
	GameMode.on_scenario_completed("last_stand")
	GameMode.current_scenario = ""
	Elara.speak("scenario_exit")
	await get_tree().create_timer(2.0).timeout
	get_tree().change_scene_to_file("res://scenes/levels/MatrixHub.tscn")
