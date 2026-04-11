extends Node3D

func _ready() -> void:
	$Player.weapons = [
		load("res://weapons/resonance_disruptor.tres"),
		load("res://weapons/arc_caster.tres"),
		load("res://weapons/severance_blade.tres"),
	]
	$Player.weapon = $Player.weapons[0]
	$Player.initiate_change_weapon(0)
	$HUD.set_mode_ui("ship_defense")
	$Player.health_updated.connect($HUD._on_health_updated)
	ShieldManager.shield_progress_updated.connect(_on_shield_update)
	ShieldManager.shields_restored.connect(_on_shields_restored)
	ShieldManager.shields_failed.connect(_on_shields_failed)
	ShieldManager.start()

func _on_shield_update(progress: float, remaining: float) -> void:
	$HUD.update_shield(progress, remaining)
	$HUD.update_breach_status(ShieldManager.breach_states)

func _on_shields_restored() -> void:
	WebBridge.send_result({
		"mode": "ship_defense",
		"success": true,
		"thoughtborn_contacted": GameMode.thoughtborn_contacted,
		"thoughtborn_killed": GameMode.thoughtborn_killed,
		"time_taken": 1500.0 - ShieldManager.time_remaining,
	})

func _on_shields_failed() -> void:
	WebBridge.send_result({
		"mode": "ship_defense",
		"success": false,
		"thoughtborn_contacted": GameMode.thoughtborn_contacted,
		"thoughtborn_killed": GameMode.thoughtborn_killed,
		"time_taken": 1500.0,
	})
