extends "res://objects/enemy.gd"

@export var enemy_name: String = "Enemy"
@export var attack_damage: int = 5
@export var bob_amplitude: float = 1.0

# Behaviour hook for role differentiation. Supported values:
#   "hover_shoot" (default) — float in place and fire on Timer.
#   "strafer"               — orbit the player at strafer_radius.
#   "charger"                — close distance; deal charger_detonate_damage
#                               and self-destruct inside charger_detonate_range.
#   "shielded"               — hover_shoot, but periodically invulnerable
#                               (shielded_window_on s on, shielded_window_off s off).
@export var attack_pattern: StringName = &"hover_shoot"
@export var strafer_radius: float = 5.0
@export var strafer_speed: float = 1.3
@export var charger_speed: float = 3.2
@export var charger_detonate_range: float = 2.5
@export var charger_detonate_damage: int = 25
@export var shielded_window_on: float = 1.5
@export var shielded_window_off: float = 4.0

var _shield_active: bool = false

func _process(delta):
	if not is_instance_valid(player):
		return
	time += delta
	match attack_pattern:
		&"strafer":
			_tick_strafer(delta)
		&"charger":
			_tick_charger(delta)
		&"shielded":
			_tick_shielded(delta)
		_:
			_tick_hover_shoot(delta)
	look_at(player.position + Vector3(0, 0.5, 0), Vector3.UP, true)
	position = target_position

func _tick_hover_shoot(delta: float) -> void:
	target_position.y += (cos(time * 5) * bob_amplitude) * delta

func _tick_strafer(delta: float) -> void:
	# Orbit the player on the XZ plane at strafer_radius while still bobbing.
	var angle: float = time * strafer_speed
	var target_xz: Vector3 = player.global_position + Vector3(
		cos(angle) * strafer_radius,
		0.0,
		sin(angle) * strafer_radius
	)
	var lerp_t: float = clamp(delta * 2.5, 0.0, 1.0)
	target_position.x = lerp(target_position.x, target_xz.x, lerp_t)
	target_position.z = lerp(target_position.z, target_xz.z, lerp_t)
	target_position.y = player.global_position.y + 1.2 + cos(time * 5) * bob_amplitude * 0.3

func _tick_charger(delta: float) -> void:
	# March toward the player; detonate on arrival.
	var to_player: Vector3 = player.global_position - target_position
	var dist: float = to_player.length()
	if dist <= charger_detonate_range and not destroyed:
		if player.has_method("damage"):
			player.damage(charger_detonate_damage)
		Audio.play("sounds/enemy_destroy.ogg")
		destroyed = true
		queue_free()
		return
	if dist > 0.001:
		target_position += to_player.normalized() * charger_speed * delta
	target_position.y = player.global_position.y + 1.0 + cos(time * 3.0) * bob_amplitude * 0.4

func _tick_shielded(delta: float) -> void:
	var cycle: float = shielded_window_on + shielded_window_off
	_shield_active = fmod(time, cycle) < shielded_window_on
	_tick_hover_shoot(delta)

func damage(amount):
	if attack_pattern == &"shielded" and _shield_active:
		# Telegraph the block — play the hurt SFX softer without damage.
		Audio.play("sounds/enemy_hurt.ogg")
		return
	super(amount)

func _on_timer_timeout():
	raycast.force_raycast_update()
	if raycast.is_colliding():
		var collider = raycast.get_collider()
		if collider.has_method("damage"):
			muzzle_a.frame = 0
			muzzle_a.play("default")
			muzzle_a.rotation_degrees.z = randf_range(-45, 45)
			muzzle_b.frame = 0
			muzzle_b.play("default")
			muzzle_b.rotation_degrees.z = randf_range(-45, 45)
			Audio.play("sounds/enemy_attack.ogg")
			collider.damage(attack_damage)
