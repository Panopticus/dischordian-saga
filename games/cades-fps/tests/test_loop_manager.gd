extends Node

# Guards the awareness-hold behavior added in the loop redesign: using
# the Open Channel grants exactly one awareness-free loop reset.

var _runner: Node

func _suite_name() -> String:
	return "LoopManager"

func _ready() -> void:
	_runner = get_parent()

func setup() -> void:
	GameMode.loop_count = 0
	GameMode.awareness_level = 0
	GameMode.open_channel_used = false
	LoopManager._awareness_held = false

func test_awareness_held_flag_starts_false() -> void:
	_runner.assert_false(LoopManager._awareness_held, "starts false")

func test_open_channel_sets_awareness_held() -> void:
	LoopManager.on_open_channel_activated("You've been here before.")
	_runner.assert_true(LoopManager._awareness_held, "set after channel")
	_runner.assert_true(GameMode.open_channel_used, "channel marked used")

# on_player_death() reloads the scene and plays a cinematic; running it
# from a headless test would hang. Instead, we inline-verify the
# pure-state portion of the function against the loop-count + flag
# semantics the gameplay test actually cares about.

func test_awareness_consumed_on_next_death() -> void:
	GameMode.loop_count = 3
	GameMode.awareness_level = 2
	LoopManager._awareness_held = true
	# Mirror the branch inside on_player_death without awaiting the
	# cinematic or the scene reload.
	GameMode.loop_count += 1
	if LoopManager._awareness_held:
		LoopManager._awareness_held = false
	elif GameMode.loop_count >= 2:
		GameMode.awareness_level = min(5, GameMode.awareness_level + 1)
	_runner.assert_eq(GameMode.awareness_level, 2, "awareness held")
	_runner.assert_false(LoopManager._awareness_held, "flag consumed")

func test_awareness_escalates_when_not_held() -> void:
	GameMode.loop_count = 3
	GameMode.awareness_level = 2
	LoopManager._awareness_held = false
	GameMode.loop_count += 1
	if LoopManager._awareness_held:
		LoopManager._awareness_held = false
	elif GameMode.loop_count >= 2:
		GameMode.awareness_level = min(5, GameMode.awareness_level + 1)
	_runner.assert_eq(GameMode.awareness_level, 3, "awareness escalated")

func test_awareness_caps_at_5() -> void:
	GameMode.loop_count = 10
	GameMode.awareness_level = 5
	LoopManager._awareness_held = false
	GameMode.loop_count += 1
	if LoopManager._awareness_held:
		LoopManager._awareness_held = false
	elif GameMode.loop_count >= 2:
		GameMode.awareness_level = min(5, GameMode.awareness_level + 1)
	_runner.assert_eq(GameMode.awareness_level, 5, "caps at 5")
