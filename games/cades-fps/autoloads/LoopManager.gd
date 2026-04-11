extends Node

signal loop_reset_complete

func on_player_death() -> void:
	GameMode.game_active = false
	GameMode.loop_count += 1
	if GameMode.loop_count >= 2:
		GameMode.awareness_level = min(5, GameMode.awareness_level + 1)
	_queue_awareness_dialogue()
	await _play_loop_cinematic()
	GameMode.time_held = 0.0
	GameMode.reinforcement_tokens = 30
	get_tree().reload_current_scene()

func _queue_awareness_dialogue() -> void:
	match GameMode.awareness_level:
		2: Elara.queue_for_run_start("iron_lion_pause")
		3: Elara.queue_for_run_start("iron_lion_memory")
		4: Elara.queue_for_run_start("iron_lion_suspects")
		5: Elara.queue_for_run_start("iron_lion_waiting")

func _play_loop_cinematic() -> void:
	var ui = get_tree().get_first_node_in_group("loop_ui")
	if ui and ui.has_method("show_signal_lost"):
		ui.show_signal_lost()
	await get_tree().create_timer(1.5, true).timeout
	if ui and ui.has_method("show_dawn_text"):
		ui.show_dawn_text()
	Audio.play("sounds/loop_reset_dawn.ogg")
	await get_tree().create_timer(2.5, true).timeout

func check_open_channel_unlock() -> void:
	if GameMode.awareness_level >= 5 and not GameMode.open_channel_used:
		var hud = get_tree().get_first_node_in_group("hud")
		if hud and hud.has_method("show_open_channel"):
			hud.show_open_channel()

func on_open_channel_activated(player_choice: String = "") -> void:
	GameMode.open_channel_used = true
	WebBridge.send_event("IRON_LION_CHANNEL_OPEN", {
		"loop_count": GameMode.loop_count,
		"awareness_level": GameMode.awareness_level,
		"player_choice": player_choice,
	})
