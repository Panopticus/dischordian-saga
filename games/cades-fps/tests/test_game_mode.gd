extends Node

# Guards the per-mode state reset contract. The levels trust
# GameMode.reset_for_mode() to zero only the fields they own, and ship
# values they depend on (kill targets, token counts). Regressing this
# silently corrupts cross-mode runs.

var _runner: Node

func _suite_name() -> String:
	return "GameMode"

func _ready() -> void:
	_runner = get_parent()

func setup() -> void:
	# Cross-mode pollution: seed every field that a reset might own.
	GameMode.current_wave = 99
	GameMode.time_held = 123.4
	GameMode.reinforcement_tokens = 0
	GameMode.shields_progress = 0.5
	GameMode.shields_remaining = 10.0
	GameMode.breach_points_held = 0
	GameMode.thoughtborn_contacted = true
	GameMode.thoughtborn_killed = 3
	GameMode.game_masters_contact_level = 99
	GameMode.mission_kills = 42
	GameMode.mission_kills_required = 0
	GameMode.mission_completed = true
	GameMode.game_active = false

func test_reset_last_stand_zeros_wave_state() -> void:
	GameMode.reset_for_mode("last_stand")
	_runner.assert_eq(GameMode.current_mode, "last_stand", "current_mode")
	_runner.assert_eq(GameMode.current_wave, 0, "current_wave")
	_runner.assert_near(GameMode.time_held, 0.0, 0.0001, "time_held")
	_runner.assert_eq(GameMode.reinforcement_tokens, 30, "tokens")
	_runner.assert_true(GameMode.game_active, "game_active")

func test_reset_ship_defense_zeros_shield_state() -> void:
	GameMode.reset_for_mode("ship_defense")
	_runner.assert_near(GameMode.shields_progress, 0.0, 0.0001, "progress")
	_runner.assert_near(GameMode.shields_remaining, 1500.0, 0.0001, "remaining")
	_runner.assert_eq(GameMode.breach_points_held, 3, "breach_held")
	_runner.assert_false(GameMode.thoughtborn_contacted, "pilgrim_contacted")
	_runner.assert_eq(GameMode.thoughtborn_killed, 0, "pilgrim_killed")

func test_reset_mission_sets_kills_required() -> void:
	GameMode.reset_for_mode("void_corridor")
	_runner.assert_eq(GameMode.mission_kills, 0, "kills zero")
	_runner.assert_eq(GameMode.mission_kills_required, 6, "void_corridor kills_required")
	_runner.assert_false(GameMode.mission_completed, "not completed")
	GameMode.reset_for_mode("kaels_own")
	_runner.assert_eq(GameMode.mission_kills_required, 4, "kaels_own kills_required")
	GameMode.reset_for_mode("vex_recruit")
	_runner.assert_eq(GameMode.mission_kills_required, 5, "vex_recruit kills_required")

func test_scenario_completion_escalates_gm_contact() -> void:
	GameMode.scenarios_completed = []
	GameMode.game_masters_contact_level = 0
	GameMode.on_scenario_completed("first_breath")
	_runner.assert_eq(GameMode.game_masters_contact_level, 1, "after 1 scenario")
	GameMode.on_scenario_completed("the_severance")
	_runner.assert_eq(GameMode.game_masters_contact_level, 2, "after 2 scenarios")
	GameMode.on_scenario_completed("thaloria_burns")
	GameMode.on_scenario_completed("the_fall")
	_runner.assert_eq(GameMode.game_masters_contact_level, 3, "after 4 scenarios")
	# Completing the same scenario twice should not re-add or re-trigger.
	GameMode.on_scenario_completed("first_breath")
	_runner.assert_eq(GameMode.scenarios_completed.size(), 4, "idempotent")

func test_scenario_completion_caps_gm_contact_at_4() -> void:
	GameMode.scenarios_completed = []
	GameMode.game_masters_contact_level = 0
	for s in ["first_breath", "the_severance", "thaloria_burns", "the_fall", "agent_zero_silence", "bonus_one", "bonus_two"]:
		GameMode.on_scenario_completed(s)
	_runner.assert_eq(GameMode.game_masters_contact_level, 4, "cap at 4")
