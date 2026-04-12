class_name TrackGenerator
extends RefCounted
## Generates a closed-loop racing track from a tile sequence.
## Each tile type has different geometry, hazards, and visual properties.

const TILE_LENGTH := 400.0
const TRACK_WIDTH := 160.0
const HALF_WIDTH := TRACK_WIDTH / 2.0

# Tile type → turn angle in degrees
const TILE_ANGLES := {
	"STRAIGHT": 0.0,
	"CURVE_LIGHT": 25.0,
	"CURVE_HARD": 50.0,
	"BONE_LANE": 0.0,
	"DEAD_STRAIGHT": 0.0,
	"PHASE_WALL": 0.0,
	"GRAVITY_INV": -15.0,
	"SPEED_CONDUIT": 0.0,
	"SPLICE_JAM": 10.0,
}

# Track segment data structure
class Segment:
	var index: int
	var tile_type: String
	var position: Vector2       # center of segment start
	var direction: float        # angle in radians
	var length: float
	var turn_angle: float       # radians
	var left_wall: PackedVector2Array
	var right_wall: PackedVector2Array
	var center_line: PackedVector2Array
	var is_hazard: bool
	var speed_modifier: float   # 1.0 = normal
	var grip_modifier: float    # 1.0 = normal

static func generate(sequence: Array, bone_obstacles: Array = []) -> Array[Segment]:
	var segments: Array[Segment] = []
	var pos := Vector2.ZERO
	var angle := -PI / 2.0  # Start heading up

	# First pass: generate raw segments
	for i in range(sequence.size()):
		var tile_type: String = sequence[i]
		var seg := Segment.new()
		seg.index = i
		seg.tile_type = tile_type
		seg.position = pos
		seg.direction = angle
		seg.length = TILE_LENGTH

		var turn_deg: float = TILE_ANGLES.get(tile_type, 0.0)
		# Alternate curve direction for variety
		if i % 2 == 1 and abs(turn_deg) > 0:
			turn_deg = -turn_deg
		seg.turn_angle = deg_to_rad(turn_deg)

		# Tile-specific properties
		match tile_type:
			"BONE_LANE":
				seg.is_hazard = true
				seg.speed_modifier = 0.85
				seg.grip_modifier = 0.7
			"DEAD_STRAIGHT":
				seg.is_hazard = true
				seg.speed_modifier = 1.0
				seg.grip_modifier = 0.5
			"SPEED_CONDUIT":
				seg.is_hazard = false
				seg.speed_modifier = 1.5
				seg.grip_modifier = 1.0
			"PHASE_WALL":
				seg.is_hazard = true
				seg.speed_modifier = 0.9
				seg.grip_modifier = 0.8
			"SPLICE_JAM":
				seg.is_hazard = true
				seg.speed_modifier = 0.75
				seg.grip_modifier = 0.6
			"GRAVITY_INV":
				seg.is_hazard = true
				seg.speed_modifier = 1.1
				seg.grip_modifier = 0.65
			_:
				seg.is_hazard = false
				seg.speed_modifier = 1.0
				seg.grip_modifier = 1.0

		# Build geometry
		var steps := 8
		seg.center_line = PackedVector2Array()
		seg.left_wall = PackedVector2Array()
		seg.right_wall = PackedVector2Array()

		var cur_pos := pos
		var cur_angle := angle
		var angle_step := seg.turn_angle / float(steps)
		var step_length := seg.length / float(steps)

		for s in range(steps + 1):
			var dir := Vector2(cos(cur_angle), sin(cur_angle))
			var perp := Vector2(-dir.y, dir.x)
			seg.center_line.append(cur_pos)
			seg.left_wall.append(cur_pos + perp * HALF_WIDTH)
			seg.right_wall.append(cur_pos - perp * HALF_WIDTH)
			if s < steps:
				cur_pos += dir * step_length
				cur_angle += angle_step

		pos = cur_pos
		angle = cur_angle
		segments.append(seg)

	# Close the loop: adjust angles so the last segment connects back to start
	_close_loop(segments)

	return segments

static func _close_loop(segments: Array[Segment]) -> void:
	if segments.is_empty():
		return
	# Calculate the gap between last segment end and first segment start
	var last_seg := segments[segments.size() - 1]
	var end_pos: Vector2 = last_seg.center_line[last_seg.center_line.size() - 1]
	var start_pos: Vector2 = segments[0].position
	var gap := start_pos - end_pos

	# Distribute the gap correction across all segments
	var total := segments.size()
	for i in range(total):
		var t := float(i + 1) / float(total)
		var offset := gap * t
		var seg := segments[i]
		for j in range(seg.center_line.size()):
			seg.center_line[j] += offset
			seg.left_wall[j] += offset
			seg.right_wall[j] += offset
		seg.position += offset

static func get_start_positions(segments: Array[Segment], count: int) -> Array[Dictionary]:
	## Returns start positions and angles for `count` racers in a 2-column grid.
	var positions: Array[Dictionary] = []
	if segments.is_empty():
		return positions
	var first := segments[0]
	var dir := Vector2(cos(first.direction), sin(first.direction))
	var perp := Vector2(-dir.y, dir.x)

	for i in range(count):
		var row := int(i / 2)
		var col := i % 2
		var lane_offset := (col * 2.0 - 1.0) * HALF_WIDTH * 0.4
		var row_offset := -dir * (row * 60.0 + 30.0)
		var pos := first.position + row_offset + perp * lane_offset
		positions.append({"position": pos, "angle": first.direction})

	return positions
