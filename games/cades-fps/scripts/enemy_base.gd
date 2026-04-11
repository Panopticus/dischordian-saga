extends "res://objects/enemy.gd"

@export var enemy_name: String = "Enemy"
@export var attack_damage: int = 5
@export var bob_amplitude: float = 1.0

func _process(delta):
	self.look_at(player.position + Vector3(0, 0.5, 0), Vector3.UP, true)
	target_position.y += (cos(time * 5) * bob_amplitude) * delta
	time += delta
	position = target_position

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
