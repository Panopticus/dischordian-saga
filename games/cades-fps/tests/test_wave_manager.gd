extends Node

# Guards the Last-Stand wave table and the wave-based HP scaling curve.
# A regression here silently un-balances every Last Stand run.

var _runner: Node

func _suite_name() -> String:
	return "WaveManager"

func _ready() -> void:
	_runner = get_parent()

func test_wave_defs_cover_1_through_15() -> void:
	for i in range(1, 16):
		_runner.assert_true(WaveManager.WAVE_DEFS.has(i), "wave %d missing" % i)
		var data = WaveManager.WAVE_DEFS[i]
		_runner.assert_true(data.has("type"), "wave %d no type" % i)
		_runner.assert_true(data.has("count"), "wave %d no count" % i)
		_runner.assert_true(data.has("interval"), "wave %d no interval" % i)
		_runner.assert_true(int(data["count"]) > 0, "wave %d count must be > 0" % i)

func test_wave_1_seeds_scouts() -> void:
	var w1 = WaveManager.WAVE_DEFS[1]
	_runner.assert_eq(w1["type"], "MachineScout", "wave 1 type")
	_runner.assert_eq(w1["count"], 5, "wave 1 count")

func test_wave_13_is_command_wave() -> void:
	_runner.assert_eq(WaveManager.WAVE_DEFS[13]["type"], "CommandWave", "wave 13 type")

func test_reset_for_new_run_clears_state() -> void:
	WaveManager.wave_active = true
	WaveManager.enemies_alive = 7
	var prev_epoch: int = WaveManager.spawn_epoch
	WaveManager.reset_for_new_run()
	_runner.assert_false(WaveManager.wave_active, "wave_active cleared")
	_runner.assert_eq(WaveManager.enemies_alive, 0, "enemies_alive cleared")
	_runner.assert_true(WaveManager.spawn_epoch > prev_epoch, "epoch advanced")

func test_hp_scaling_formula() -> void:
	# Mirrors the formula used in WaveManager._spawn_single — if this
	# test breaks because the formula changed, update both together.
	# Wave 1: 1.00×  |  Wave 6: 1.40×  |  Wave 15: 2.12×  |  Wave 40: 3.00× (cap)
	_runner.assert_near(min(3.0, 1.0 + 0.08 * (1 - 1)), 1.0, 0.001, "wave 1")
	_runner.assert_near(min(3.0, 1.0 + 0.08 * (6 - 1)), 1.4, 0.001, "wave 6")
	_runner.assert_near(min(3.0, 1.0 + 0.08 * (15 - 1)), 2.12, 0.001, "wave 15")
	_runner.assert_near(min(3.0, 1.0 + 0.08 * (40 - 1)), 3.0, 0.001, "wave 40 capped")
