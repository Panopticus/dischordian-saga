extends "res://objects/enemy.gd"

@export var cades_target: Node3D
var has_triggered_first_elara: bool = false
var has_reached_target: bool = false
const WALK_SPEED: float = 1.2

func _ready() -> void:
	target_position = position
	add_to_group("thoughtborn")

func _process(delta: float) -> void:
	if not is_instance_valid(cades_target): return
	if has_reached_target: return
	var to_target = cades_target.global_position - global_position
	var dist = to_target.length()
	if dist < 1.5:
		_on_reach_cades()
		return
	look_at(cades_target.global_position, Vector3.UP, true)
	target_position += to_target.normalized() * WALK_SPEED * delta
	position = target_position

func _on_timer_timeout() -> void:
	pass # Thoughtborn do NOT attack

func damage(amount):
	health -= amount
	Audio.play("sounds/enemy_hurt.ogg")
	if health < 36 and not has_triggered_first_elara:
		has_triggered_first_elara = true
		Elara.speak("breach_lost_observation")
	if health <= 0 and not destroyed:
		GameMode.thoughtborn_killed += 1
		destroyed = true
		queue_free()

func _on_reach_cades() -> void:
	has_reached_target = true
	GameMode.thoughtborn_contacted = true
	Elara.speak("thoughtborn_contact")
	await get_tree().create_timer(8.0).timeout
	Elara.speak("thoughtborn_rev")
	queue_free()
