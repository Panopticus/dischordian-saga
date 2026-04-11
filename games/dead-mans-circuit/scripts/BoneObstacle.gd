extends Node2D
## A bone obstacle on the track — either permanent (from previous deaths)
## or temporary (from dead_weight ability).

var permanent: bool = false
var lifetime: float = 10.0
var _timer: float = 0.0
var _radius: float = 18.0

func _ready() -> void:
	z_index = 0

func _process(delta: float) -> void:
	if not permanent:
		_timer += delta
		if _timer >= lifetime:
			queue_free()
			return

	# Check collisions with karts
	var karts := get_tree().get_nodes_in_group("karts") if get_tree().has_group("karts") else []
	# Simpler: check parent's children
	var parent := get_parent()
	if parent:
		for child in parent.get_children():
			if child is Kart and child.alive:
				if child.global_position.distance_to(global_position) < _radius + 15.0:
					child.take_damage(15.0)
					child.velocity *= 0.5
					if not permanent:
						queue_free()
						return

func _draw() -> void:
	# Bone pile visual
	var color := Color("#f5f0e8", 0.6 if permanent else 0.4)
	draw_circle(Vector2.ZERO, _radius, Color(color, 0.3))
	# Cross bones
	draw_line(Vector2(-10, -10), Vector2(10, 10), color, 2.5)
	draw_line(Vector2(10, -10), Vector2(-10, 10), color, 2.5)
	# Skull circle
	draw_circle(Vector2(0, -3), 5.0, color)
