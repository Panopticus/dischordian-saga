extends Node

# Guards the scenario registry and the AVAILABLE / LOCKED / COMPLETED
# gate used by MatrixHub. The unknown-id guard was a real robustness
# fix; this test locks it in.

var _runner: Node

func _suite_name() -> String:
	return "HistoricalManager"

func _ready() -> void:
	_runner = get_parent()

func setup() -> void:
	GameMode.scenarios_completed = []

func test_unknown_scenario_id_is_not_unlocked() -> void:
	# Regression guard: SCENARIOS[id] direct access used to crash on an
	# unknown id; the fix was a has()-check.
	_runner.assert_false(HistoricalManager.is_scenario_unlocked("not_a_real_id"), "unknown id")

func test_first_breath_is_always_unlocked() -> void:
	_runner.assert_true(HistoricalManager.is_scenario_unlocked("first_breath"), "first_breath")
	_runner.assert_true(HistoricalManager.is_scenario_unlocked("the_severance"), "the_severance")
	_runner.assert_true(HistoricalManager.is_scenario_unlocked("thaloria_burns"), "thaloria_burns")
	_runner.assert_true(HistoricalManager.is_scenario_unlocked("the_fall"), "the_fall")
	_runner.assert_true(HistoricalManager.is_scenario_unlocked("last_stand"), "last_stand")

func test_agent_zero_silence_locked_until_five_done() -> void:
	GameMode.scenarios_completed = []
	_runner.assert_false(HistoricalManager.is_scenario_unlocked("agent_zero_silence"), "0 done")
	GameMode.scenarios_completed = ["first_breath", "the_severance", "thaloria_burns", "the_fall"]
	_runner.assert_false(HistoricalManager.is_scenario_unlocked("agent_zero_silence"), "4 done")
	GameMode.scenarios_completed = ["first_breath", "the_severance", "thaloria_burns", "the_fall", "last_stand"]
	_runner.assert_true(HistoricalManager.is_scenario_unlocked("agent_zero_silence"), "5 done unlocks")

func test_status_returns_tri_state() -> void:
	GameMode.scenarios_completed = ["first_breath"]
	_runner.assert_eq(HistoricalManager.get_scenario_status("first_breath"), "COMPLETED", "completed")
	_runner.assert_eq(HistoricalManager.get_scenario_status("the_severance"), "AVAILABLE", "available")
	_runner.assert_eq(HistoricalManager.get_scenario_status("agent_zero_silence"), "LOCKED", "locked")

func test_scenario_registry_shape() -> void:
	# Any entry added to SCENARIOS must carry the keys MatrixHub reads.
	for id in HistoricalManager.SCENARIOS.keys():
		var entry = HistoricalManager.SCENARIOS[id]
		_runner.assert_true(entry.has("title"), "%s.title" % id)
		_runner.assert_true(entry.has("subtitle"), "%s.subtitle" % id)
		_runner.assert_true(entry.has("unlock_condition"), "%s.unlock_condition" % id)
		_runner.assert_true(entry.has("level_scene"), "%s.level_scene" % id)
		_runner.assert_true(entry.has("elara_approach"), "%s.elara_approach" % id)
		_runner.assert_true(entry.has("color"), "%s.color" % id)
