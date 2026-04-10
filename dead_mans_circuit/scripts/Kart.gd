class_name Kart
extends Node2D
## Base kart — handles physics, track following, collisions.

signal crossed_finish_line(kart: Kart)
signal destroyed(kart: Kart)

@export var is_player: bool = false
@export var kart_color: Color = Color("#f97316")
@export var designation: String = "WIRED-0000-UNKNOWN"

# Stats (0-100 scale mapped to gameplay values)
var neural_sync: float = 80.0
var velocity_ceiling: float = 100.0
var surface_grip: float = 65.0
var integrity: float = 100.0

# Physics state
var velocity: float = 0.0
var angular_velocity: float = 0.0
var heading: float = 0.0
var max_speed: float = 450.0
var acceleration: float = 300.0
var brake_force: float = 500.0
var drag: float = 0.97
var turn_speed: float = 2.8
var grip: float = 0.92

# Track awareness
var current_segment_index: int = 0
var lap_count: int = 0
var total_distance: float = 0.0
var checkpoint_progress: float = 0.0  # 0..1 within current segment
var finished: bool = false
var alive: bool = true

# Ability cooldowns
var ability_cooldowns: Dictionary = {}

# Visual
var _body_size := Vector2(24, 40)
var _trail_points: PackedVector2Array = PackedVector2Array()
const TRAIL_LENGTH := 20

func _ready() -> void:
	# Apply stats to physics
	max_speed = remap(velocity_ceiling, 0, 120, 300, 600)
	turn_speed = remap(neural_sync, 0, 100, 1.8, 3.5)
	grip = remap(surface_grip, 0, 100, 0.82, 0.98)

func _draw() -> void:
	# Trail
	if _trail_points.size() > 1:
		for i in range(1, _trail_points.size()):
			var alpha := float(i) / float(_trail_points.size()) * 0.3
			var local_from := to_local(_trail_points[i - 1])
			var local_to := to_local(_trail_points[i])
			draw_line(local_from, local_to, Color(kart_color, alpha), 3.0)

	# Kart body
	var body_rect := Rect2(-_body_size / 2.0, _body_size)
	draw_rect(body_rect, kart_color)

	# Darker cockpit
	var cockpit := Rect2(-_body_size.x * 0.3, -_body_size.y * 0.15, _body_size.x * 0.6, _body_size.y * 0.35)
	draw_rect(cockpit, kart_color.darkened(0.4))

	# Front indicator
	var front := Vector2(0, -_body_size.y / 2.0)
	draw_circle(front, 4.0, Color.WHITE if alive else Color.RED)

	# Neural splice antenna
	draw_line(Vector2(-6, -_body_size.y * 0.4), Vector2(-6, -_body_size.y * 0.6), Color("#f9731680"), 1.5)
	draw_line(Vector2(6, -_body_size.y * 0.4), Vector2(6, -_body_size.y * 0.6), Color("#f9731680"), 1.5)

	# Designation text (small)
	if is_player:
		var shield_rect := Rect2(-_body_size.x * 0.8, _body_size.y * 0.5, _body_size.x * 1.6, 12)
		draw_rect(shield_rect, Color(0, 0, 0, 0.6))

func apply_segment_modifiers(speed_mod: float, grip_mod: float) -> void:
	max_speed = remap(velocity_ceiling, 0, 120, 300, 600) * speed_mod
	grip = remap(surface_grip, 0, 100, 0.82, 0.98) * grip_mod

func steer(input: float, delta: float) -> void:
	if not alive:
		return
	var speed_factor := clampf(velocity / max_speed, 0.0, 1.0)
	angular_velocity = input * turn_speed * speed_factor * delta
	heading += angular_velocity
	rotation = heading

func accelerate_kart(delta: float) -> void:
	if not alive:
		velocity *= 0.95
		return
	velocity = minf(velocity + acceleration * delta, max_speed)

func brake_kart(delta: float) -> void:
	if not alive:
		return
	velocity = maxf(velocity - brake_force * delta, -max_speed * 0.3)

func coast(delta: float) -> void:
	velocity *= drag

func apply_movement(delta: float) -> void:
	var dir := Vector2(cos(heading - PI / 2.0), sin(heading - PI / 2.0))
	# Lateral grip — blend between heading direction and velocity direction
	position += dir * velocity * delta

	# Drift effect when grip is low
	if abs(angular_velocity) > 0.01:
		var lateral_slip := (1.0 - grip) * angular_velocity * velocity * 0.3
		var perp := Vector2(-dir.y, dir.x)
		position += perp * lateral_slip * delta

	# Trail
	_trail_points.append(global_position)
	if _trail_points.size() > TRAIL_LENGTH:
		_trail_points.remove_at(0)

	queue_redraw()

func take_damage(amount: float) -> void:
	if not alive:
		return
	integrity -= amount
	if integrity <= 0:
		integrity = 0
		alive = false
		velocity *= 0.3
		emit_signal("destroyed", self)

func use_ability(ability_key: String) -> bool:
	if not alive:
		return false
	var now := Time.get_ticks_msec()
	var cooldown_end: int = ability_cooldowns.get(ability_key, 0)
	if now < cooldown_end:
		return false
	# Set cooldown
	var cooldown_ms := 12000
	match ability_key:
		"emp_pulse": cooldown_ms = 12000
		"thought_spike": cooldown_ms = 10000
		"neural_flood": cooldown_ms = 15000
		"overclock": cooldown_ms = 18000
		"phase_step": cooldown_ms = 20000
		"dead_weight": cooldown_ms = 25000
	ability_cooldowns[ability_key] = now + cooldown_ms
	return true
