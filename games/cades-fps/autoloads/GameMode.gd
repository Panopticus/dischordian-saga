extends Node

var current_mode: String = "last_stand"

# Mode 1 — The Last Stand
var current_wave: int = 0
var time_held: float = 0.0
var total_time_held: float = 0.0
var reinforcement_tokens: int = 30
var loop_count: int = 0
var awareness_level: int = 0
var canon_achieved: bool = false
var open_channel_used: bool = false
const CANONICAL_TIME: float = 13620.0

# Mode 2 — Ship Defense
var shields_progress: float = 0.0
var shields_remaining: float = 1500.0
var breach_points_held: int = 3
var thoughtborn_contacted: bool = false
var thoughtborn_killed: int = 0

# Mode 3 — Historical Incursions
var scenarios_completed: Array[String] = []
var game_masters_contact_level: int = 0
var current_scenario: String = ""

# Shared
var game_active: bool = false

func reset_for_mode(mode: String) -> void:
	current_mode = mode
	game_active = true
	match mode:
		"last_stand":
			current_wave = 0
			time_held = 0.0
			reinforcement_tokens = 30
		"ship_defense":
			shields_progress = 0.0
			shields_remaining = 1500.0
			breach_points_held = 3
			thoughtborn_contacted = false
			thoughtborn_killed = 0
		"historical_incursions":
			game_masters_contact_level = 0

func on_scenario_completed(scenario_id: String) -> void:
	if scenario_id not in scenarios_completed:
		scenarios_completed.append(scenario_id)
	var completed = scenarios_completed.size()
	# Thresholds escalate: 1 → level 1, 2 → level 2, 4 → level 3, 6 → level 4.
	# Using >= avoids skipping levels if the player reaches a higher count
	# without passing through the exact value (e.g. if the counter ever
	# jumps by more than one).
	if completed >= 6 and game_masters_contact_level < 4:
		game_masters_contact_level = 4
		HistoricalManager.trigger_gm_contact(4)
	elif completed >= 4 and game_masters_contact_level < 3:
		game_masters_contact_level = 3
		HistoricalManager.trigger_gm_contact(3)
	elif completed >= 2 and game_masters_contact_level < 2:
		game_masters_contact_level = 2
		HistoricalManager.trigger_gm_contact(2)
	elif completed >= 1 and game_masters_contact_level < 1:
		game_masters_contact_level = 1
		HistoricalManager.trigger_gm_contact(1)
