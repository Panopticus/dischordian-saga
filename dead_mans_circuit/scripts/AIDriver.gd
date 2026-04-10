class_name AIDriver
extends RefCounted
## AI controller for NPC karts. Follows the track center line with
## some randomized error, avoids obstacles, occasionally uses abilities.

var kart: Kart
var track_segments: Array = []
var difficulty: float = 0.5  # 0..1
var target_point: Vector2 = Vector2.ZERO
var wander_offset: float = 0.0
var reaction_time: float = 0.3
var _reaction_timer: float = 0.0
var _desired_steer: float = 0.0
var aggression: float = 0.0  # likelihood of attacking

func setup(k: Kart, segments: Array, diff: float) -> void:
	kart = k
	track_segments = segments
	difficulty = clampf(diff, 0.0, 1.0)
	reaction_time = lerpf(0.5, 0.1, difficulty)
	wander_offset = lerpf(60.0, 15.0, difficulty)
	aggression = lerpf(0.1, 0.6, difficulty)

	# Vary AI stats slightly
	kart.velocity_ceiling = lerpf(75, 110, difficulty + randf_range(-0.1, 0.1))
	kart.neural_sync = lerpf(60, 95, difficulty + randf_range(-0.1, 0.1))
	kart.surface_grip = lerpf(50, 80, difficulty + randf_range(-0.1, 0.1))
	kart.max_speed = remap(kart.velocity_ceiling, 0, 120, 300, 600)
	kart.turn_speed = remap(kart.neural_sync, 0, 100, 1.8, 3.5)
	kart.grip = remap(kart.surface_grip, 0, 100, 0.82, 0.98)

func update(delta: float) -> void:
	if not kart.alive or kart.finished:
		kart.coast(delta)
		kart.apply_movement(delta)
		return

	_reaction_timer -= delta
	if _reaction_timer <= 0:
		_reaction_timer = reaction_time
		_update_target()
		_calculate_steering()

	# Apply steering
	kart.steer(_desired_steer, delta)

	# Always accelerate unless a hazard ahead requires braking
	var ahead_seg_idx := (kart.current_segment_index + 1) % track_segments.size()
	if ahead_seg_idx < track_segments.size():
		var ahead_seg = track_segments[ahead_seg_idx]
		if ahead_seg.is_hazard and kart.velocity > kart.max_speed * 0.7:
			kart.brake_kart(delta)
		else:
			kart.accelerate_kart(delta)
	else:
		kart.accelerate_kart(delta)

	kart.coast(delta)
	kart.apply_movement(delta)

func _update_target() -> void:
	if track_segments.is_empty():
		return
	# Aim for a point ahead on the center line
	var look_ahead := int(lerpf(2, 5, difficulty))
	var seg_idx := (kart.current_segment_index + look_ahead) % track_segments.size()
	var seg = track_segments[seg_idx]
	var center: PackedVector2Array = seg.center_line
	if center.size() > 0:
		var mid_idx := int(center.size() / 2)
		target_point = center[mid_idx]
		# Add wander
		var perp := Vector2(cos(seg.direction + PI / 2.0), sin(seg.direction + PI / 2.0))
		target_point += perp * randf_range(-wander_offset, wander_offset)

func _calculate_steering() -> void:
	var to_target := target_point - kart.global_position
	var target_angle := to_target.angle() + PI / 2.0
	var angle_diff := wrapf(target_angle - kart.heading, -PI, PI)
	_desired_steer = clampf(angle_diff / (PI * 0.25), -1.0, 1.0)
