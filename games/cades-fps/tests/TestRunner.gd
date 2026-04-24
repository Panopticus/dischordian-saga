extends Node

# Minimal test runner. Each test file in the scene tree is a Node script
# with methods named test_xxx() that call assert_eq / assert_true / etc.
# The runner walks its children, invokes every test method, prints a
# one-line PASS/FAIL per test, and quits with 0 (all green) or 1 (any
# red) so CI can gate on the exit code.
#
# Launch headlessly with:
#   godot --headless --path games/cades-fps res://tests/Tests.tscn
#
# Tests use the real autoloads (GameMode, WaveManager, HistoricalManager,
# WebBridge, …) — assertion failures print the offending value so a
# failed CI log is actionable without opening the editor.

var _passed: int = 0
var _failed: int = 0
var _current_suite: String = ""
var _current_test: String = ""

func _ready() -> void:
	print("--- CADES FPS test runner ---")
	for child in get_children():
		if not child.has_method("_suite_name"):
			continue
		_current_suite = child._suite_name()
		for method in child.get_method_list():
			var mname: String = method["name"]
			if not mname.begins_with("test_"):
				continue
			_current_test = mname
			if child.has_method("setup"):
				child.setup()
			var before_failed: int = _failed
			child.call(mname)
			if _failed == before_failed:
				print("  PASS  %s :: %s" % [_current_suite, _current_test])
				_passed += 1
			if child.has_method("teardown"):
				child.teardown()
	print("--- %d passed, %d failed ---" % [_passed, _failed])
	get_tree().quit(0 if _failed == 0 else 1)

func assert_eq(actual, expected, label: String = "") -> void:
	if actual == expected:
		return
	_failed += 1
	var where: String = "%s :: %s" % [_current_suite, _current_test]
	if label != "":
		where += " (" + label + ")"
	push_error("  FAIL  %s — expected %s, got %s" % [where, expected, actual])
	print("  FAIL  %s — expected %s, got %s" % [where, expected, actual])

func assert_true(cond: bool, label: String = "") -> void:
	assert_eq(cond, true, label)

func assert_false(cond: bool, label: String = "") -> void:
	assert_eq(cond, false, label)

func assert_near(actual: float, expected: float, tolerance: float = 0.001, label: String = "") -> void:
	if abs(actual - expected) <= tolerance:
		return
	_failed += 1
	var where: String = "%s :: %s" % [_current_suite, _current_test]
	if label != "":
		where += " (" + label + ")"
	push_error("  FAIL  %s — expected %f ± %f, got %f" % [where, expected, tolerance, actual])
	print("  FAIL  %s — expected %f ± %f, got %f" % [where, expected, tolerance, actual])
