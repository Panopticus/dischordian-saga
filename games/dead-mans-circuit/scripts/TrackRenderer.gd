extends Node2D
## Draws the track visually — walls, lane lines, tile type coloring, finish line.

var segments: Array = []

const ORANGE := Color("#f97316")
const BONE := Color("#f5f0e8")
const DARK := Color("#1c1917")
const DARK_SURFACE := Color("#2a2520")
const RED := Color("#ef4444")
const GOLD := Color("#fbbf24")
const BLUE := Color("#3b82f6")
const VIOLET := Color("#8b5cf6")
const VOID := Color("#0f172a")

func _ready() -> void:
	queue_redraw()

func _draw() -> void:
	if segments.is_empty():
		return

	# Draw track surface per segment
	for seg in segments:
		var surface_color := DARK_SURFACE
		var wall_color := Color(ORANGE, 0.6)
		var center_color := Color(BONE, 0.15)

		match seg.tile_type:
			"BONE_LANE":
				surface_color = Color(BONE, 0.12)
				wall_color = Color(BONE, 0.5)
				center_color = Color(BONE, 0.3)
			"DEAD_STRAIGHT":
				surface_color = Color(VOID, 0.9)
				wall_color = Color(RED, 0.7)
				center_color = Color(RED, 0.2)
			"SPEED_CONDUIT":
				surface_color = Color("#2d2410")
				wall_color = Color(GOLD, 0.7)
				center_color = Color(GOLD, 0.3)
			"PHASE_WALL":
				surface_color = Color("#1a1030")
				wall_color = Color(VIOLET, 0.6)
				center_color = Color(VIOLET, 0.2)
			"SPLICE_JAM":
				surface_color = Color("#1a2030")
				wall_color = Color(BLUE, 0.5)
				center_color = Color(BLUE, 0.2)
			"GRAVITY_INV":
				surface_color = Color("#201a28")
				wall_color = Color(VIOLET, 0.4)
				center_color = Color(VIOLET, 0.15)

		# Draw filled track surface as quad strips
		var left: PackedVector2Array = seg.left_wall
		var right: PackedVector2Array = seg.right_wall
		for i in range(left.size() - 1):
			var quad: PackedVector2Array = PackedVector2Array([
				left[i], left[i + 1], right[i + 1], right[i]
			])
			draw_colored_polygon(quad, surface_color)

		# Wall lines
		_draw_polyline(seg.left_wall, wall_color, 3.0)
		_draw_polyline(seg.right_wall, wall_color, 3.0)

		# Center dashes
		var center: PackedVector2Array = seg.center_line
		for i in range(0, center.size() - 1, 2):
			draw_line(center[i], center[mini(i + 1, center.size() - 1)], center_color, 1.5)

		# Hazard markers
		if seg.is_hazard:
			var mid_idx := int(center.size() / 2)
			if mid_idx < center.size():
				var marker_pos := center[mid_idx]
				match seg.tile_type:
					"BONE_LANE":
						_draw_bone_markers(marker_pos, seg.direction)
					"DEAD_STRAIGHT":
						_draw_danger_markers(marker_pos)
					"SPEED_CONDUIT":
						_draw_boost_arrows(marker_pos, seg.direction)

	# Finish line
	if segments.size() > 0:
		var seg0 = segments[0]
		if seg0.left_wall.size() > 0 and seg0.right_wall.size() > 0:
			var fl: Vector2 = seg0.left_wall[0]
			var fr: Vector2 = seg0.right_wall[0]
			# Checkered pattern
			var count := 8
			var step: Vector2 = (fr - fl) / float(count)
			for i in range(count):
				var c: Color = BONE if i % 2 == 0 else DARK
				var from_pt: Vector2 = fl + step * float(i)
				draw_line(from_pt, from_pt + step, c, 6.0)

func _draw_polyline(points: PackedVector2Array, color: Color, width: float) -> void:
	for i in range(points.size() - 1):
		draw_line(points[i], points[i + 1], color, width)

func _draw_bone_markers(pos: Vector2, dir: float) -> void:
	# Small bone-like crosses
	for i in range(3):
		var offset := Vector2(randf_range(-40, 40), randf_range(-40, 40))
		var p := pos + offset
		draw_line(p + Vector2(-6, -6), p + Vector2(6, 6), Color(BONE, 0.3), 2.0)
		draw_line(p + Vector2(6, -6), p + Vector2(-6, 6), Color(BONE, 0.3), 2.0)

func _draw_danger_markers(pos: Vector2) -> void:
	# Red warning triangles
	draw_circle(pos, 8.0, Color(RED, 0.4))

func _draw_boost_arrows(pos: Vector2, dir: float) -> void:
	# Gold chevrons pointing in the track direction
	var d := Vector2(cos(dir), sin(dir))
	var p := Vector2(-d.y, d.x)
	for i in range(3):
		var base := pos + d * float(i - 1) * 25.0
		draw_line(base - p * 20.0, base + d * 12.0, Color(GOLD, 0.4), 2.5)
		draw_line(base + p * 20.0, base + d * 12.0, Color(GOLD, 0.4), 2.5)
