extends CharacterBody3D

signal neck_height_changed(current_height: float, max_height: float)
signal player_died(reason: String)
signal reached_finish(final_height: float)

@export var forward_speed: float = 12.0
@export var swerve_speed: float = 16.0
@export var stretch_speed: float = 14.0
@export var max_x_limit: float = 3.6

var min_neck_height: float = 0.7       # Chiều cao khi thụt đầu xuống (né xà ngang)
var current_max_height: float = 4.5    # Chiều cao tối đa hiện tại (tăng khi ăn táo)
var current_neck_height: float = 1.5   # Chiều cao cổ thời gian thực

var is_active: bool = true
var is_holding: bool = false
var is_dragging: bool = false
var target_x: float = 0.0
var is_at_finish: bool = false

@onready var body_mesh: MeshInstance3D = $BodyMesh
@onready var neck_mesh: MeshInstance3D = $NeckMesh
@onready var head_root: Node3D = $HeadRoot
@onready var head_mesh: MeshInstance3D = $HeadRoot/HeadMesh
@onready var eye_left: MeshInstance3D = $HeadRoot/EyeLeft
@onready var eye_right: MeshInstance3D = $HeadRoot/EyeRight
@onready var height_label: Label3D = $HeadRoot/HeightLabel

func _ready() -> void:
	target_x = position.x
	update_neck_visuals()

func _input(event: InputEvent) -> void:
	if not is_active or is_at_finish:
		return
		
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			is_holding = event.pressed
			is_dragging = event.pressed
			
	elif event is InputEventMouseMotion and is_dragging:
		var viewport_width = get_viewport().get_visible_rect().size.x
		var delta_x = (event.relative.x / viewport_width) * 11.0
		target_x = clamp(target_x + delta_x, -max_x_limit, max_x_limit)
		
	elif event is InputEventScreenTouch:
		is_holding = event.pressed
		is_dragging = event.pressed
		
	elif event is InputEventScreenDrag and is_dragging:
		var viewport_width = get_viewport().get_visible_rect().size.x
		var delta_x = (event.relative.x / viewport_width) * 11.0
		target_x = clamp(target_x + delta_x, -max_x_limit, max_x_limit)

func _physics_process(delta: float) -> void:
	if not is_active:
		return
		
	# 1. Di chuyển ngang (Swerve)
	position.x = lerp(position.x, target_x, swerve_speed * delta)
	
	# Nghiêng người ngộ nghĩnh khi quẹt
	var move_diff = target_x - position.x
	rotation.z = lerp_angle(rotation.z, -move_diff * 0.25, 12.0 * delta)
	
	# 2. Cơ chế vươn cổ / thụt đầu (Stretchy Neck)
	var target_h = current_max_height if is_holding else min_neck_height
	if is_at_finish:
		target_h = current_max_height
		
	current_neck_height = lerp(current_neck_height, target_h, stretch_speed * delta)
	update_neck_visuals()
	
	# 3. Tiến về phía trước
	if not is_at_finish:
		position.z -= forward_speed * delta

func update_neck_visuals() -> void:
	if head_root:
		head_root.position.y = current_neck_height
	if neck_mesh:
		neck_mesh.position.y = current_neck_height / 2.0
		neck_mesh.scale.y = max(0.1, current_neck_height)
	if height_label:
		height_label.text = "%.1fm" % current_neck_height
		
	if eye_left and eye_right:
		var eye_shake = sin(Time.get_ticks_msec() * 0.02) * 0.04
		eye_left.position.y = 0.35 + eye_shake
		eye_right.position.y = 0.35 - eye_shake
		
	neck_height_changed.emit(current_neck_height, current_max_height)

func eat_fruit(bonus_height: float, score: int) -> void:
	current_max_height = clamp(current_max_height + bonus_height, 2.0, 15.0)
	
	var tw = create_tween()
	tw.tween_property(head_mesh, "scale", Vector3(1.4, 0.7, 1.4), 0.06)
	tw.tween_property(head_mesh, "scale", Vector3.ONE, 0.08)
	
	var gm = get_tree().root.find_child("GameManager", true, false)
	if gm and gm.has_method("add_score"):
		gm.add_score(score)

func apply_neck_gate(val: float) -> void:
	current_max_height = clamp(current_max_height + val, 1.5, 18.0)
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3(1.2, 1.0, 1.2), 0.08)
	tw.tween_property(self, "scale", Vector3.ONE, 0.08)

func bonk_overhead() -> void:
	if not is_active:
		return
	is_active = false
	
	var tw = create_tween()
	tw.tween_property(head_root, "rotation_degrees:x", -85.0, 0.1)
	tw.tween_property(self, "rotation_degrees:z", 90.0, 0.2)
	tw.tween_callback(func():
		player_died.emit("💥 BONK! ĐẬP ĐẦU VÀO XÀ NGANG VÌ CỔ QUÁ CAO!")
	)

func poke_bottom() -> void:
	if not is_active:
		return
	is_active = false
	
	var tw = create_tween()
	tw.tween_property(self, "position:y", position.y + 2.5, 0.15)
	tw.tween_property(self, "position:y", -0.5, 0.2)
	tw.tween_callback(func():
		player_died.emit("😭 Á ĐAU! BỊ CHÔNG ĐÂM VÌ KHÔNG CHỊU VƯƠN CỔ!")
	)

func trigger_finish(tower_bonus: float) -> void:
	is_at_finish = true
	is_holding = true
	var tw = create_tween()
	tw.tween_interval(1.2)
	tw.tween_callback(func():
		reached_finish.emit(current_neck_height * tower_bonus)
	)
