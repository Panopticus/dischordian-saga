extends Node3D

func _ready() -> void:
	$Player.weapons = [
		load("res://weapons/resonance_disruptor.tres"),
		load("res://weapons/arc_caster.tres"),
		load("res://weapons/severance_blade.tres"),
	]
	$Player.weapon = $Player.weapons[0]
	$Player.initiate_change_weapon(0)
	$HUD.set_mode_ui("historical_incursions")
	$Player.health_updated.connect($HUD._on_health_updated)
	Elara.speak("matrix_hub_enter")
