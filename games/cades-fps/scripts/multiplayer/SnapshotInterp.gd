class_name SnapshotInterp
extends RefCounted
## ════════════════════════════════════════════════════════════════
## Snapshot interpolation primitive for the CADES PvP layer.
##
## Pattern: the host emits authoritative state snapshots at a fixed
## tick-rate (default 20 Hz). Joiners buffer them with a small delay
## (~100 ms) and interpolate between the two most-recent snapshots
## bracketing `render_time` to smooth out network jitter.
##
## Each snapshot is a Dictionary keyed by entity_id → Dictionary of
## interpolatable fields (Vector3 position, float aim_pitch, etc).
## Non-interpolatable fields (hp, current_weapon) snap to the most
## recent snapshot.
##
## Usage:
##
##     var interp := SnapshotInterp.new()
##     # On every host emission:
##     interp.push_snapshot(server_time_msec, snapshot_dict)
##     # Per render frame on the joiner:
##     var rendered = interp.sample(Time.get_ticks_msec() - 100)
##
## Pure / no I/O / GDScript only.
## ════════════════════════════════════════════════════════════════

const MAX_BUFFER_SIZE := 32  # ~1.6 sec at 20 Hz, plenty for jitter
const INTERPOLATABLE_FIELDS := ["position", "rotation", "velocity", "aim_pitch", "aim_yaw"]

var _buffer: Array = []  # Array[{ time: int, snapshot: Dictionary }]

func push_snapshot(server_time_msec: int, snapshot: Dictionary) -> void:
	_buffer.append({"time": server_time_msec, "snapshot": snapshot})
	# Insertion-sort tail in case snapshots arrive out of order.
	var i := _buffer.size() - 1
	while i > 0 and _buffer[i - 1].time > _buffer[i].time:
		var tmp = _buffer[i - 1]
		_buffer[i - 1] = _buffer[i]
		_buffer[i] = tmp
		i -= 1
	# Trim oldest beyond the buffer cap.
	while _buffer.size() > MAX_BUFFER_SIZE:
		_buffer.pop_front()

## Sample the interpolated state at `render_time_msec`. Returns the
## interpolated snapshot Dictionary, or `{}` if the buffer is empty.
##
## Behavior:
##   - render_time before earliest snapshot → return earliest as-is
##   - render_time after latest snapshot   → return latest as-is
##                                            (extrapolation NOT done)
##   - otherwise → lerp between bracketing snapshots
func sample(render_time_msec: int) -> Dictionary:
	if _buffer.is_empty():
		return {}
	if render_time_msec <= _buffer[0].time:
		return (_buffer[0].snapshot as Dictionary).duplicate(true)
	if render_time_msec >= _buffer[-1].time:
		return (_buffer[-1].snapshot as Dictionary).duplicate(true)

	# Find the two bracketing snapshots.
	for i in range(_buffer.size() - 1):
		var a = _buffer[i]
		var b = _buffer[i + 1]
		if a.time <= render_time_msec and render_time_msec <= b.time:
			var span = float(b.time - a.time)
			var t = 0.5 if span <= 0.0 else float(render_time_msec - a.time) / span
			return _interpolate(a.snapshot, b.snapshot, t)
	# Should be unreachable due to bracket checks above.
	return (_buffer[-1].snapshot as Dictionary).duplicate(true)

func _interpolate(a: Dictionary, b: Dictionary, t: float) -> Dictionary:
	var out := {}
	for entity_id in b.keys():
		var bv = b[entity_id]
		if not (bv is Dictionary):
			out[entity_id] = bv
			continue
		var av = a.get(entity_id, null)
		if not (av is Dictionary):
			# Spawned in b only — render at full b state.
			out[entity_id] = (bv as Dictionary).duplicate(true)
			continue
		var entity_out := {}
		for k in (bv as Dictionary).keys():
			var bval = bv[k]
			var aval = (av as Dictionary).get(k, bval)
			if k in INTERPOLATABLE_FIELDS:
				entity_out[k] = _lerp_value(aval, bval, t)
			else:
				# Non-interpolatable: snap to b.
				entity_out[k] = bval
		out[entity_id] = entity_out
	return out

func _lerp_value(a, b, t: float):
	if a is float and b is float:
		return lerp(a, b, t)
	if a is int and b is int:
		return roundi(lerp(float(a), float(b), t))
	if a is Vector3 and b is Vector3:
		return (a as Vector3).lerp(b, t)
	if a is Vector2 and b is Vector2:
		return (a as Vector2).lerp(b, t)
	if a is Quaternion and b is Quaternion:
		return (a as Quaternion).slerp(b, t)
	if a is Basis and b is Basis:
		return (a as Basis).slerp(b, t)
	# Unknown / non-interpolatable — return b.
	return b

func buffer_size() -> int:
	return _buffer.size()

func oldest_time() -> int:
	if _buffer.is_empty():
		return 0
	return _buffer[0].time

func newest_time() -> int:
	if _buffer.is_empty():
		return 0
	return _buffer[-1].time

func clear() -> void:
	_buffer.clear()
