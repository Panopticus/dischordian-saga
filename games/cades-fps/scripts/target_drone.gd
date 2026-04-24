extends Area3D

# Non-hostile target drone used exclusively by the Boot Diagnostic
# tutorial. Unlike the main enemy chassis this one has no Timer, no
# raycast, and no attack — it just exposes damage() and queue_free()s
# when its small HP pool runs out. The point is calibration, not a
# fight.

@export var max_health: int = 30
@export var bob_amplitude: float = 0.5

var health: int = 30
var destroyed: bool = false
var _time: float = 0.0
var _origin: Vector3

func _ready() -> void:
	health = max_health
	_origin = position

func _process(delta: float) -> void:
	if destroyed:
		return
	_time += delta
	# Gentle idle bob so it reads as "active drone" rather than prop.
	position = _origin + Vector3(0.0, cos(_time * 3.0) * bob_amplitude, 0.0)

func damage(amount) -> void:
	if destroyed:
		return
	Audio.play("sounds/enemy_hurt.ogg")
	health -= int(amount)
	if health <= 0:
		destroyed = true
		Audio.play("sounds/enemy_destroy.ogg")
		queue_free()
