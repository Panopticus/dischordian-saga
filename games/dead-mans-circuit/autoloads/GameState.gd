extends Node
## Global game state for Dead Man's Circuit

# Race config from host
var player_designation: String = "WIRED-0000-UNKNOWN"
var neural_sync: float = 80.0
var physical_integrity: float = 100.0
var velocity_ceiling: float = 100.0
var surface_grip: float = 65.0
var survival_instinct: float = 25.0

var total_laps: int = 3
var phase: int = 1
var ai_count: int = 7
var ai_difficulty: float = 0.5
var abilities: Array = []
var track_sequence: Array = []
var bone_obstacles: Array = []

# Race state
var race_started: bool = false
var race_finished: bool = false
var current_lap: int = 0
var race_time_ms: float = 0.0
var best_lap_ms: float = INF
var finish_position: int = 8
var clone_survived: bool = true
var rival_kills: int = 0
var abilities_used: Array = []
var lap_times: Array = []

func load_config(cfg: Dictionary) -> void:
	var clone = cfg.get("player_clone", {})
	player_designation = clone.get("designation", "WIRED-0000-UNKNOWN")
	neural_sync = float(clone.get("neural_sync", 80))
	physical_integrity = float(clone.get("physical_integrity", 100))
	velocity_ceiling = float(clone.get("velocity_ceiling", 100))
	surface_grip = float(clone.get("surface_grip", 65))
	survival_instinct = float(clone.get("survival_instinct", 25))

	total_laps = int(cfg.get("total_laps", 3))
	phase = int(cfg.get("phase", 1))
	ai_count = int(cfg.get("ai_count", 7))
	ai_difficulty = float(cfg.get("ai_difficulty", 0.5))
	abilities = cfg.get("abilities", [])
	track_sequence = cfg.get("track_sequence", [])
	bone_obstacles = cfg.get("bone_obstacles", [])

func reset_race() -> void:
	race_started = false
	race_finished = false
	current_lap = 0
	race_time_ms = 0.0
	best_lap_ms = INF
	finish_position = 8
	clone_survived = true
	rival_kills = 0
	abilities_used = []
	lap_times = []

func get_result() -> Dictionary:
	return {
		"designation": player_designation,
		"finish_position": finish_position,
		"total_ms": int(race_time_ms),
		"best_lap_ms": null if best_lap_ms == INF else int(best_lap_ms),
		"clone_survived": clone_survived,
		"rival_kills": rival_kills,
		"abilities_used": abilities_used,
	}
