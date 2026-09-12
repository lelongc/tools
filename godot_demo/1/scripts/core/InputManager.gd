extends Node

# Quản lý đầu vào thống nhất cho cả Touch Mobile, Bàn phím/Chuột PC và Gamepad
var virtual_joystick_vector: Vector2 = Vector2.ZERO
var is_mobile: bool = false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	is_mobile = OS.has_feature("mobile") or OS.has_feature("android") or OS.has_feature("ios")

func get_movement_vector() -> Vector2:
	var move = Input.get_vector("move_left", "move_right", "move_up", "move_down")
	if virtual_joystick_vector != Vector2.ZERO:
		move = virtual_joystick_vector
	if move.length() > 1.0:
		move = move.normalized()
	return move

func is_dash_just_pressed() -> bool:
	return Input.is_action_just_pressed("dash")
