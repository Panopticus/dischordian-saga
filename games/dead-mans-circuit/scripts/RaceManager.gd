extends Node2D
## Main race controller. Manages track, karts, laps, positions, and race flow.

const NILMORG_LINES := {
	"start": [
		"Welcome to the Dead Man's Circuit! I am Nilmorg, your host, your judge, your undertaker!",
		"The bones are fresh, the clones are twitching, and the track is HUNGRY. Let us begin!",
	],
	"final_lap": [
		"FINAL LAP! The bone-lane WRITHES!",
		"Last lap, racers! Nilmorg can TASTE the desperation!",
	],
	"player_died": [
		"SPLENDID! Another clone returns to the bone-lane!",
		"Oh, that crunch! That beautiful crunch! Rest in pieces!",
	],
	"ai_died": [
		"The bones accumulate! The track grows! The track HUNGERS!",
		"Another one for the bone pile! Nilmorg is PLEASED!",
	],
}

# Track
var track_segments: Array = []
var track_node: Node2D

# Karts
var player_kart: Kart
var ai_karts: Array[Kart] = []
var ai_drivers: Array[AIDriver] = []
var all_karts: Array[Kart] = []

# Race flow
var countdown_active: bool = true
var countdown_value: int = 3
var race_active: bool = false
var race_over: bool = false

# HUD
var hud: RaceHUD

# Camera
var camera: Camera2D

# Finish line area
var finish_line_start: Vector2
var finish_line_end: Vector2

# Positions tracking
var _position_update_timer: float = 0.0

# Bone obstacles (visual)
var _bone_obstacles: Array = []

func _ready() -> void:
	WebBridge.config_received.connect(_on_config)

func _on_config(cfg: Dictionary) -> void:
	GameState.load_config(cfg)
	GameState.reset_race()
	_build_race()

func _build_race() -> void:
	# Generate track
	track_segments = TrackGenerator.generate(GameState.track_sequence, GameState.bone_obstacles)
	_draw_track()
	_place_bone_obstacles()

	# Finish line
	if track_segments.size() > 0:
		var seg0 = track_segments[0]
		finish_line_start = seg0.left_wall[0]
		finish_line_end = seg0.right_wall[0]

	# Create karts
	var start_positions := TrackGenerator.get_start_positions(track_segments, 1 + GameState.ai_count)

	# Player kart
	player_kart = Kart.new()
	player_kart.is_player = true
	player_kart.kart_color = Color("#f97316")
	player_kart.designation = GameState.player_designation
	player_kart.neural_sync = GameState.neural_sync
	player_kart.velocity_ceiling = GameState.velocity_ceiling
	player_kart.surface_grip = GameState.surface_grip
	player_kart.integrity = GameState.physical_integrity
	if start_positions.size() > 0:
		player_kart.position = start_positions[0]["position"]
		player_kart.heading = start_positions[0]["angle"]
		player_kart.rotation = player_kart.heading
	player_kart.crossed_finish_line.connect(_on_kart_finish)
	player_kart.destroyed.connect(_on_kart_destroyed)
	add_child(player_kart)
	all_karts.append(player_kart)

	# AI karts
	var ai_colors := [Color("#7f1d1d"), Color("#991b1b"), Color("#6b2121"), Color("#8b3030"),
					   Color("#5c1a1a"), Color("#a03030"), Color("#4a1515")]
	for i in range(GameState.ai_count):
		var ai_kart := Kart.new()
		ai_kart.is_player = false
		ai_kart.kart_color = ai_colors[i % ai_colors.size()]
		ai_kart.designation = "WIRED-%04d-%s" % [randi_range(1000, 9999), ["ALPHA", "BETA", "GAMMA", "DELTA", "EPSILON", "ZETA", "ETA"][i % 7]]
		if start_positions.size() > i + 1:
			ai_kart.position = start_positions[i + 1]["position"]
			ai_kart.heading = start_positions[i + 1]["angle"]
			ai_kart.rotation = ai_kart.heading
		ai_kart.crossed_finish_line.connect(_on_kart_finish)
		ai_kart.destroyed.connect(_on_kart_destroyed)
		add_child(ai_kart)
		ai_karts.append(ai_kart)
		all_karts.append(ai_kart)

		var driver := AIDriver.new()
		driver.setup(ai_kart, track_segments, GameState.ai_difficulty + randf_range(-0.15, 0.15))
		ai_drivers.append(driver)

	# Camera follows player
	camera = Camera2D.new()
	camera.zoom = Vector2(0.9, 0.9)
	camera.position_smoothing_enabled = true
	camera.position_smoothing_speed = 8.0
	camera.rotation_smoothing_enabled = true
	camera.rotation_smoothing_speed = 4.0
	player_kart.add_child(camera)
	camera.make_current()

	# HUD
	hud = RaceHUD.new()
	add_child(hud)
	hud.update_designation(GameState.player_designation)
	hud.update_lap(0, GameState.total_laps)
	hud.setup_abilities(GameState.abilities)

	# Show Nilmorg intro
	var lines: Array = NILMORG_LINES["start"]
	hud.show_nilmorg(lines[randi() % lines.size()])

	# Start countdown
	countdown_active = true
	countdown_value = 3
	_run_countdown()

func _run_countdown() -> void:
	hud.show_countdown(str(countdown_value))
	await get_tree().create_timer(1.0).timeout
	countdown_value -= 1
	if countdown_value > 0:
		hud.show_countdown(str(countdown_value))
		await get_tree().create_timer(1.0).timeout
		countdown_value -= 1
	if countdown_value > 0:
		hud.show_countdown(str(countdown_value))
		await get_tree().create_timer(1.0).timeout
	hud.show_countdown("GO!")
	countdown_active = false
	race_active = true
	GameState.race_started = true
	await get_tree().create_timer(0.8).timeout
	hud.show_countdown("")

func _process(delta: float) -> void:
	if not race_active or race_over:
		return

	# Update race time
	GameState.race_time_ms += delta * 1000.0
	hud.update_time(GameState.race_time_ms)

	# Player input
	_handle_player_input(delta)

	# AI
	for driver in ai_drivers:
		driver.update(delta)

	# Update segment tracking for all karts
	for kart in all_karts:
		_update_kart_segment(kart)

	# Update positions periodically
	_position_update_timer -= delta
	if _position_update_timer <= 0:
		_position_update_timer = 0.2
		_update_positions()

	# Hazard damage
	_check_hazards(delta)

	# Kart collisions
	_check_collisions()

	# Update HUD
	hud.update_integrity(player_kart.integrity)
	hud.update_speed(player_kart.velocity)

	# Ability cooldown display
	for ability_key in GameState.abilities:
		var now := Time.get_ticks_msec()
		var cd_end: int = player_kart.ability_cooldowns.get(ability_key, 0)
		hud.update_ability_cooldown(ability_key, now >= cd_end)

func _handle_player_input(delta: float) -> void:
	if not player_kart.alive:
		player_kart.coast(delta)
		player_kart.apply_movement(delta)
		return

	# Steering
	var steer_input := 0.0
	if Input.is_action_pressed("steer_left"):
		steer_input -= 1.0
	if Input.is_action_pressed("steer_right"):
		steer_input += 1.0
	player_kart.steer(steer_input, delta)

	# Acceleration / Brake
	if Input.is_action_pressed("accelerate"):
		player_kart.accelerate_kart(delta)
	elif Input.is_action_pressed("brake"):
		player_kart.brake_kart(delta)

	player_kart.coast(delta)
	player_kart.apply_movement(delta)

	# Abilities
	if Input.is_action_just_pressed("ability_1") and GameState.abilities.size() > 0:
		_activate_ability(GameState.abilities[0])
	if Input.is_action_just_pressed("ability_2") and GameState.abilities.size() > 1:
		_activate_ability(GameState.abilities[1])

func _activate_ability(key: String) -> void:
	if not player_kart.use_ability(key):
		return
	if key not in GameState.abilities_used:
		GameState.abilities_used.append(key)

	match key:
		"emp_pulse":
			# Disable nearby AI for 1.5s
			for ai_kart in ai_karts:
				if ai_kart.alive and ai_kart.global_position.distance_to(player_kart.global_position) < 200:
					ai_kart.velocity *= 0.2
					ai_kart.take_damage(5)
		"thought_spike":
			# Nearest AI swerves
			var nearest: Kart = null
			var nearest_dist := 400.0
			for ai_kart in ai_karts:
				if ai_kart.alive:
					var d := ai_kart.global_position.distance_to(player_kart.global_position)
					if d < nearest_dist:
						nearest_dist = d
						nearest = ai_kart
			if nearest:
				nearest.heading += randf_range(-0.5, 0.5)
				nearest.take_damage(3)
		"neural_flood":
			# Boost grip, risk integrity
			player_kart.grip = minf(player_kart.grip + 0.3, 1.0)
			player_kart.take_damage(8)
		"overclock":
			# Speed boost, integrity cost
			player_kart.velocity = minf(player_kart.velocity * 1.4, player_kart.max_speed * 1.4)
			player_kart.take_damage(10)
		"phase_step":
			# Teleport forward, risky
			var dir := Vector2(cos(player_kart.heading - PI / 2.0), sin(player_kart.heading - PI / 2.0))
			player_kart.position += dir * 150.0
			if randf() < 0.15:
				player_kart.take_damage(100)  # Mistimed — instant death
		"dead_weight":
			# Drop obstacle behind
			var dir := Vector2(cos(player_kart.heading - PI / 2.0), sin(player_kart.heading - PI / 2.0))
			_spawn_temp_obstacle(player_kart.position - dir * 60.0)

func _spawn_temp_obstacle(pos: Vector2) -> void:
	var obs := Node2D.new()
	obs.position = pos
	obs.set_script(preload("res://scripts/BoneObstacle.gd"))
	add_child(obs)

func _update_kart_segment(kart: Kart) -> void:
	if track_segments.is_empty():
		return
	# Find which segment the kart is closest to
	var best_idx := kart.current_segment_index
	var best_dist := INF

	# Check nearby segments (not all — performance)
	var check_range := 3
	var total := track_segments.size()
	for offset in range(-check_range, check_range + 1):
		var idx := (kart.current_segment_index + offset + total) % total
		var seg = track_segments[idx]
		var center: PackedVector2Array = seg.center_line
		if center.size() > 0:
			var mid := center[int(center.size() / 2)]
			var d := kart.global_position.distance_squared_to(mid)
			if d < best_dist:
				best_dist = d
				best_idx = idx

	var prev_seg := kart.current_segment_index
	kart.current_segment_index = best_idx

	# Apply segment modifiers
	var seg = track_segments[best_idx]
	kart.apply_segment_modifiers(seg.speed_modifier, seg.grip_modifier)

	# Check lap crossing — when going from last segment to first
	if prev_seg >= track_segments.size() - 2 and best_idx <= 1:
		kart.lap_count += 1
		if kart == player_kart:
			# Record lap time
			var lap_time := GameState.race_time_ms
			if GameState.lap_times.size() > 0:
				lap_time -= GameState.lap_times.reduce(func(a, b): return a + b, 0.0)
			GameState.lap_times.append(lap_time)
			if lap_time < GameState.best_lap_ms:
				GameState.best_lap_ms = lap_time

			GameState.current_lap = kart.lap_count
			hud.update_lap(kart.lap_count, GameState.total_laps)

			# Final lap warning
			if kart.lap_count == GameState.total_laps - 1:
				var lines: Array = NILMORG_LINES["final_lap"]
				hud.show_nilmorg(lines[randi() % lines.size()])

			# Race complete
			if kart.lap_count >= GameState.total_laps:
				kart.finished = true
				_check_race_end()
		else:
			if kart.lap_count >= GameState.total_laps:
				kart.finished = true
				_check_race_end()

func _update_positions() -> void:
	# Sort all karts by lap count (desc), then segment index (desc), then distance along segment
	var scored: Array = []
	for kart in all_karts:
		var score := kart.lap_count * 100000 + kart.current_segment_index * 100.0
		scored.append({"kart": kart, "score": score})
	scored.sort_custom(func(a, b): return a["score"] > b["score"])

	for i in range(scored.size()):
		var kart: Kart = scored[i]["kart"]
		if kart == player_kart:
			GameState.finish_position = i + 1
			hud.update_position(i + 1)
			break

func _check_hazards(delta: float) -> void:
	for kart in all_karts:
		if not kart.alive:
			continue
		if kart.current_segment_index >= track_segments.size():
			continue
		var seg = track_segments[kart.current_segment_index]

		# Wall collision — check distance from center line
		if seg.center_line.size() > 0:
			var center_mid: Vector2 = seg.center_line[int(seg.center_line.size() / 2)]
			var dist_from_center := kart.global_position.distance_to(center_mid)
			if dist_from_center > TrackGenerator.HALF_WIDTH * 1.1:
				# Wall scrape
				kart.velocity *= 0.7
				kart.take_damage(5.0 * delta)
			if dist_from_center > TrackGenerator.HALF_WIDTH * 1.4:
				# Off track — heavy penalty
				kart.velocity *= 0.4
				kart.take_damage(20.0 * delta)

		# Hazard tile damage
		if seg.is_hazard:
			match seg.tile_type:
				"BONE_LANE":
					kart.take_damage(2.0 * delta * GameState.phase)
				"DEAD_STRAIGHT":
					# Chance of instant death if off center
					if seg.center_line.size() > 0:
						var cmid: Vector2 = seg.center_line[int(seg.center_line.size() / 2)]
						if kart.global_position.distance_to(cmid) > TrackGenerator.HALF_WIDTH * 0.8:
							kart.take_damage(50.0 * delta)
				"PHASE_WALL":
					kart.take_damage(3.0 * delta)
				"SPLICE_JAM":
					kart.take_damage(1.5 * delta)
					kart.velocity *= (1.0 - 0.5 * delta)
				"GRAVITY_INV":
					kart.take_damage(1.0 * delta)

func _check_collisions() -> void:
	for i in range(all_karts.size()):
		for j in range(i + 1, all_karts.size()):
			var a := all_karts[i]
			var b := all_karts[j]
			if not a.alive or not b.alive:
				continue
			var dist := a.global_position.distance_to(b.global_position)
			if dist < 35.0:
				# Bump
				var push_dir := (b.global_position - a.global_position).normalized()
				a.position -= push_dir * 5.0
				b.position += push_dir * 5.0
				a.take_damage(2.0)
				b.take_damage(2.0)
				a.velocity *= 0.9
				b.velocity *= 0.9

func _on_kart_destroyed(kart: Kart) -> void:
	if kart == player_kart:
		GameState.clone_survived = false
		var lines: Array = NILMORG_LINES["player_died"]
		hud.show_nilmorg(lines[randi() % lines.size()])
		# End race shortly after death
		await get_tree().create_timer(2.0).timeout
		_finish_race()
	else:
		GameState.rival_kills += 1
		var lines: Array = NILMORG_LINES["ai_died"]
		hud.show_nilmorg(lines[randi() % lines.size()])

func _on_kart_finish(kart: Kart) -> void:
	pass  # Handled by _update_kart_segment lap tracking

func _check_race_end() -> void:
	if player_kart.finished and not race_over:
		_finish_race()
		return
	# Also end if all AI finished
	var all_done := true
	for kart in all_karts:
		if not kart.finished and kart.alive:
			all_done = false
			break
	if all_done and not race_over:
		_finish_race()

func _finish_race() -> void:
	if race_over:
		return
	race_over = true
	race_active = false
	GameState.race_finished = true

	# Final position update
	_update_positions()

	# Show finish
	if player_kart.alive and player_kart.finished:
		hud.show_countdown("FINISH!")
	else:
		hud.show_countdown("SIGNAL LOST")

	await get_tree().create_timer(2.5).timeout

	# Send result to host
	WebBridge.send_result(GameState.get_result())

func _draw_track() -> void:
	track_node = Node2D.new()
	track_node.z_index = -1
	add_child(track_node)
	track_node.set_script(preload("res://scripts/TrackRenderer.gd"))
	track_node.segments = track_segments

func _place_bone_obstacles() -> void:
	for obs_data in GameState.bone_obstacles:
		var obs := Node2D.new()
		obs.position = Vector2(obs_data.get("x", 0), obs_data.get("z", 0))
		obs.set_script(preload("res://scripts/BoneObstacle.gd"))
		obs.permanent = true
		add_child(obs)
		_bone_obstacles.append(obs)
