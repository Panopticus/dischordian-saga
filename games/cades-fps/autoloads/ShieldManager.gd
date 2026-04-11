extends Node

signal shields_restored
signal shields_failed
signal shield_progress_updated(progress: float, time_remaining: float)

var active: bool = false
var progress: float = 0.0
var time_remaining: float = 1500.0
var breach_states: Dictionary = {"engineering": true, "cargo": true, "observation": true}
var _milestone_25: bool = false
var _milestone_50: bool = false
var _milestone_75: bool = false

func start() -> void:
	active = true
	progress = 0.0
	time_remaining = 1500.0
	_milestone_25 = false
	_milestone_50 = false
	_milestone_75 = false
	Elara.speak("game_start")

func _process(delta: float) -> void:
	if not active: return
	var held_count = breach_states.values().count(true)
	var rate = 0.4 + (held_count * 0.2)
	progress += (delta / 1500.0) * rate
	time_remaining -= delta * rate
	progress = min(progress, 1.0)
	emit_signal("shield_progress_updated", progress, time_remaining)
	if progress >= 0.25 and not _milestone_25:
		_milestone_25 = true
		Elara.speak("shields_25")
	elif progress >= 0.50 and not _milestone_50:
		_milestone_50 = true
		Elara.speak("shields_50")
	elif progress >= 0.75 and not _milestone_75:
		_milestone_75 = true
		Elara.speak("shields_75")
	if progress >= 1.0:
		active = false
		Elara.speak("shields_done")
		emit_signal("shields_restored")
	elif time_remaining <= 0:
		active = false
		Elara.speak("shields_fail")
		emit_signal("shields_failed")

func breach_lost(location: String) -> void:
	if breach_states.get(location, false):
		breach_states[location] = false
		GameMode.breach_points_held -= 1
		Elara.speak("breach_lost_" + location)

func breach_regained(location: String) -> void:
	if not breach_states.get(location, true):
		breach_states[location] = true
		GameMode.breach_points_held += 1
		Elara.speak("breach_regained_" + location)
