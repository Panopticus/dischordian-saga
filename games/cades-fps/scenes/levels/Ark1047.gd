extends Node3D

# Inception Ark 1047 — Ship Defense.
# Three breach zones (Engineering / Cargo / Observation). The player holds
# them while ShieldManager counts down 25 minutes. Spawners cycle factions:
#   - engineering: Reclamation (legal-contract believers, aggressive)
#   - cargo:       Salvagers (desperate, fast)
#   - observation: mostly Reclamation with periodic Thoughtborn pilgrims
#                  who walk non-hostile toward the central CADES unit.

const RECLAMATION_ENFORCER  = "res://objects/enemies/ReclamationEnforcer.tscn"
const RECLAMATION_COMMANDER = "res://objects/enemies/ReclamationCommander.tscn"
const SALVAGER              = "res://objects/enemies/Salvager.tscn"
const SALVAGER_LEADER       = "res://objects/enemies/SalvagerLeader.tscn"
const THOUGHTBORN_PILGRIM   = "res://objects/enemies/ThoughtbornPilgrim.tscn"

const ZONES = ["engineering", "cargo", "observation"]

var _enemies_per_zone: Dictionary = {"engineering": 0, "cargo": 0, "observation": 0}
var _thoughtborn_sent: bool = false
var _zone_spawn_timer: float = 0.0
var _zone_spawn_interval: float = 6.0
var _next_spawn_zone_idx: int = 0

func _ready() -> void:
	GameMode.current_mode = "ship_defense"
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
	# Seed every zone with at least one enemy so the player has somewhere to go.
	await get_tree().create_timer(2.0).timeout
	for zone in ZONES:
		_spawn_at_zone(zone)
		await get_tree().create_timer(1.0).timeout

func _process(delta: float) -> void:
	if not ShieldManager.active:
		return
	_zone_spawn_timer += delta
	if _zone_spawn_timer >= _zone_spawn_interval:
		_zone_spawn_timer = 0.0
		_spawn_tick()
	# Ramp difficulty: interval shrinks as the shield charges.
	_zone_spawn_interval = max(3.0, 6.0 - ShieldManager.progress * 3.0)

func _spawn_tick() -> void:
	var zone = ZONES[_next_spawn_zone_idx]
	_next_spawn_zone_idx = (_next_spawn_zone_idx + 1) % ZONES.size()
	_spawn_at_zone(zone)
	# Dispatch a Thoughtborn pilgrim once, partway through the defense.
	if not _thoughtborn_sent and ShieldManager.progress >= 0.35:
		_thoughtborn_sent = true
		_spawn_thoughtborn()

func _spawn_at_zone(zone: String) -> void:
	var zone_node = get_node_or_null("BreachZones/" + zone)
	if zone_node == null: return
	var marker = zone_node.get_node_or_null("SpawnMarker")
	if marker == null: return
	var scene_path = _pick_enemy_for_zone(zone)
	var scene = load(scene_path)
	if scene == null: return
	var enemy = scene.instantiate()
	enemy.player = $Player
	enemy.position = marker.global_position + Vector3(randf_range(-1.5, 1.5), 0, randf_range(-1.5, 1.5))
	_register_enemy_for_zone(enemy, zone)
	add_child(enemy)

func _pick_enemy_for_zone(zone: String) -> String:
	match zone:
		"engineering":
			return RECLAMATION_ENFORCER if randf() > 0.25 else RECLAMATION_COMMANDER
		"cargo":
			return SALVAGER if randf() > 0.2 else SALVAGER_LEADER
		"observation":
			return RECLAMATION_ENFORCER
	return RECLAMATION_ENFORCER

func _register_enemy_for_zone(enemy: Node, zone: String) -> void:
	var prev = _enemies_per_zone.get(zone, 0)
	_enemies_per_zone[zone] = prev + 1
	if prev == 0:
		# Zone just went hot.
		ShieldManager.breach_lost(zone)
	enemy.tree_exited.connect(func(): _on_zone_enemy_died(zone))

func _on_zone_enemy_died(zone: String) -> void:
	var remaining = _enemies_per_zone.get(zone, 0) - 1
	if remaining < 0: remaining = 0
	_enemies_per_zone[zone] = remaining
	if remaining == 0:
		ShieldManager.breach_regained(zone)

func _spawn_thoughtborn() -> void:
	var obs = get_node_or_null("BreachZones/observation/SpawnMarker")
	if obs == null: return
	var scene = load(THOUGHTBORN_PILGRIM)
	if scene == null: return
	var pilgrim = scene.instantiate()
	pilgrim.player = $Player
	pilgrim.cades_target = $CadesUnit
	pilgrim.position = obs.global_position + Vector3(randf_range(-2, 2), 0, 2)
	Elara.speak("thoughtborn_first")
	add_child(pilgrim)

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
