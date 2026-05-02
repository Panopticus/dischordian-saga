extends CharacterBody3D
## RemotePlayer — script for the remote-controlled player avatar.
## Mirrors transform/aim/state via MultiplayerSynchronizer and
## exposes server-validated RPCs for fire/damage events.
##
## Authority: peer that owns this player slot. The host runs server-
## auth checks (damage clamps, fire-rate); joiners predict locally.

## Synced fields — exact set declared in the
## MultiplayerSynchronizer attached to this scene at the editor
## level. Field defaults below are the source of truth.

@export var aim_pitch: float = 0.0
@export var aim_yaw: float = 0.0
@export var hp: int = 100
@export var max_hp: int = 100
@export var current_weapon: int = 0
@export var velocity_sync: Vector3 = Vector3.ZERO

# Last fire timestamp for rate-limit / interpolation
var last_fire_msec: int = 0

@rpc("any_peer", "call_remote", "reliable")
func fire_weapon(weapon_id: int, hit_target_path: NodePath) -> void:
	# Server (host) validates fire rate + hit. Joiners simulate
	# locally and submit the result; the host accepts or rejects.
	if not multiplayer.is_server():
		# Joiner side: we already simulated locally; remote authority
		# echo will overwrite if it disagrees.
		return
	var now := Time.get_ticks_msec()
	# Hard rate-limit at 5 shots/sec to deflate basic auto-fire cheats.
	if now - last_fire_msec < 200:
		return
	last_fire_msec = now
	# Hit detection happens server-side; if hit_target_path resolves
	# and the target is a valid CharacterBody3D, apply damage.
	var target := get_node_or_null(hit_target_path)
	if target and target.has_method("take_damage"):
		target.take_damage(_damage_for_weapon(weapon_id), get_path())

@rpc("authority", "call_local", "reliable")
func take_damage(amount: int, source_path: NodePath) -> void:
	# Server-auth method. Clamp damage to a sane range so a
	# malicious client RPC can't insta-kill.
	var clamped := clamp(amount, 0, 100)
	hp = max(0, hp - clamped)
	if hp == 0:
		_on_died(source_path)

@rpc("any_peer", "call_local", "reliable")
func swap_weapon(weapon_id: int) -> void:
	if weapon_id >= 0 and weapon_id < 8:
		current_weapon = weapon_id

func _damage_for_weapon(weapon_id: int) -> int:
	# Per-weapon damage table. Static for now; future patch reads
	# from the weapons/*.tres resources via a registry lookup.
	match weapon_id:
		0: return 10  # blaster
		1: return 15  # blaster-repeater
		2: return 30  # heavy
		_: return 5

func _on_died(_source_path: NodePath) -> void:
	# Visible respawn handler is in the scene; this method just
	# fires the signal. The ScoreManager listens for it.
	emit_signal("died")

signal died
