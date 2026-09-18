extends Control

## SumoMobileControls.gd
## Cần điều khiển cảm ứng ảo & Phím Đấm / Ném bổng dành cho Mobile

@onready var joystick_base: Control = $LeftZone/JoystickBase
@onready var joystick_knob: Control = $LeftZone/JoystickBase/Knob
@onready var punch_btn: BaseButton = $RightZone/PunchBtn
@onready var yeet_btn: BaseButton = $RightZone/YeetBtn

var joystick_active: bool = false
var joystick_center: Vector2 = Vector2.ZERO
var max_radius: float = 65.0
var output_vector: Vector2 = Vector2.ZERO

var target_player: Node3D = null

func _ready() -> void:
	punch_btn.pressed.connect(_on_punch_pressed)
	yeet_btn.pressed.connect(_on_yeet_pressed)
	if SumoGameManager.has_signal("round_ended"):
		SumoGameManager.round_ended.connect(_on_round_ended)
	_find_player_1()

func _on_round_ended(_winner_id: int, _summary: Dictionary) -> void:
	visible = false
	set_process_input(false)
	_reset_joystick()

func _find_player_1() -> void:
	var players = get_tree().get_nodes_in_group("sumo_players")
	for p in players:
		if "player_id" in p and p.player_id == 1:
			target_player = p
			break

func _input(event: InputEvent) -> void:
	if not visible:
		return
	if event is InputEventScreenTouch or (event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT):
		var pos = event.position
		if pos.x < get_viewport_rect().size.x * 0.5:
			if event.pressed:
				joystick_active = true
				joystick_center = pos
				joystick_base.global_position = pos - joystick_base.size * 0.5
				joystick_base.visible = true
				joystick_knob.position = joystick_base.size * 0.5 - joystick_knob.size * 0.5
			else:
				_reset_joystick()
				
	elif event is InputEventScreenDrag or (event is InputEventMouseMotion and joystick_active):
		if joystick_active:
			var diff = event.position - joystick_center
			if diff.length() > max_radius:
				diff = diff.normalized() * max_radius
			joystick_knob.position = (joystick_base.size * 0.5 - joystick_knob.size * 0.5) + diff
			output_vector = diff / max_radius
			_send_vector_to_player()

func _reset_joystick() -> void:
	joystick_active = false
	output_vector = Vector2.ZERO
	joystick_knob.position = joystick_base.size * 0.5 - joystick_knob.size * 0.5
	_send_vector_to_player()

func _send_vector_to_player() -> void:
	if not target_player or not is_instance_valid(target_player):
		_find_player_1()
	if target_player and "mobile_move_vec" in target_player:
		target_player.mobile_move_vec = output_vector

func _on_punch_pressed() -> void:
	if not target_player or not is_instance_valid(target_player):
		_find_player_1()
	if target_player and "mobile_punch_req" in target_player:
		target_player.mobile_punch_req = true

func _on_yeet_pressed() -> void:
	if not target_player or not is_instance_valid(target_player):
		_find_player_1()
	if target_player and "mobile_yeet_req" in target_player:
		target_player.mobile_yeet_req = true
