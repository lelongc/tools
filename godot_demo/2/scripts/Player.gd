extends CharacterBody3D

signal neck_height_changed(current_height: float, max_height: float)
signal player_died(reason_key: String)
signal reached_finish(final_height: float)

@export var forward_speed: float = 11.5
@export var swerve_speed: float = 18.0
@export var stretch_speed: float = 16.0
@export var max_x_limit: float = 3.6

var min_neck_height: float = 0.7
var current_max_height: float = 4.5
var current_neck_height: float = 1.5

var is_active: bool = true
var is_holding: bool = false
var is_dragging: bool = false
var target_x: float = 0.0
var is_at_finish: bool = false
var magnet_time_left: float = 0.0

# Nút ảo 2D trên màn hình
var touch_steer_dir: float = 0.0
var touch_stretch_held: bool = false

@onready var body_mesh: MeshInstance3D = $BodyMesh
@onready var neck_mesh: MeshInstance3D = $NeckMesh
@onready var head_root: Node3D = $HeadRoot
@onready var head_mesh: MeshInstance3D = $HeadRoot/HeadMesh
@onready var eye_left: MeshInstance3D = $HeadRoot/EyeLeft
@onready var eye_right: MeshInstance3D = $HeadRoot/EyeRight
@onready var height_label: Label3D = $HeadRoot/HeightLabel

func _ready() -> void:
	target_x = position.x
	apply_current_skin()
	update_neck_visuals()

func apply_current_skin() -> void:
	if SkinManager:
		SkinManager.apply_skin_to_node(self, SaveSystem.equipped_skin_id)

func _input(event: InputEvent) -> void:
	if not is_active or is_at_finish:
		return
		
	# 1. Mouse Input
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			is_holding = event.pressed
			is_dragging = event.pressed
			if event.pressed:
				SoundManager.play_stretch(1.1)
			
	elif event is InputEventMouseMotion and is_dragging:
		var viewport_width = get_viewport().get_visible_rect().size.x
		var delta_x = (event.relative.x / viewport_width) * 12.0
		target_x = clamp(target_x + delta_x, -max_x_limit, max_x_limit)
		
	# 2. Touch Input
	elif event is InputEventScreenTouch:
		is_holding = event.pressed
		is_dragging = event.pressed
		if event.pressed:
			SoundManager.play_stretch(1.1)
		
	elif event is InputEventScreenDrag and is_dragging:
		var viewport_width = get_viewport().get_visible_rect().size.x
		var delta_x = (event.relative.x / viewport_width) * 12.0
		target_x = clamp(target_x + delta_x, -max_x_limit, max_x_limit)

func _physics_process(delta: float) -> void:
	if not is_active:
		return
		
	# 3. Keyboard & On-Screen 2D Touch Steer Input
	var kb_x = touch_steer_dir
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		kb_x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		kb_x += 1.0
		
	if kb_x != 0.0:
		target_x = clamp(target_x + kb_x * 8.5 * delta, -max_x_limit, max_x_limit)
		
	var kb_hold = Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP)
	var holding_now = is_holding or kb_hold or touch_stretch_held
	
	position.x = lerp(position.x, target_x, swerve_speed * delta)
	var move_diff = target_x - position.x
	rotation.z = lerp_angle(rotation.z, -move_diff * 0.25, 12.0 * delta)
	
	var target_h = current_max_height if holding_now else min_neck_height
	if is_at_finish:
		target_h = current_max_height
		
	current_neck_height = lerp(current_neck_height, target_h, stretch_speed * delta)
	
	# Khi vươn cổ cao, nhấc nhẹ thân người để sải bước qua bãi chông
	var target_body_y = 0.35 + (0.4 if current_neck_height >= 2.0 else 0.0)
	position.y = lerp(position.y, target_body_y, 10.0 * delta)
	
	update_neck_visuals()
	
	if not is_at_finish:
		position.z -= forward_speed * delta
		
	# Xử lý Hút đồ (Magnet Aura)
	if magnet_time_left > 0.0:
		magnet_time_left -= delta
		attract_nearby_items(delta)

func attract_nearby_items(delta: float) -> void:
	var items = get_tree().get_nodes_in_group("collectables")
	for item in items:
		if is_instance_valid(item) and item is Area3D and not item.get("is_collected"):
			var dist = global_position.distance_to(item.global_position)
			if dist < 9.0:
				var head_pos = head_root.global_position if head_root else global_position
				item.global_position = item.global_position.lerp(head_pos, 8.0 * delta)

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
	current_max_height = clamp(current_max_height + bonus_height, 2.0, 20.0)
	SoundManager.play_collect(1.0 + (current_max_height * 0.05))
	
	var tw = create_tween()
	tw.tween_property(head_mesh, "scale", Vector3(1.35, 0.7, 1.35), 0.06)
	tw.tween_property(head_mesh, "scale", Vector3.ONE, 0.08)
	
	var gm = get_tree().root.find_child("GameManager", true, false)
	if gm and gm.has_method("add_score"):
		gm.add_score(score)

func activate_magnet(duration: float = 6.0) -> void:
	magnet_time_left = duration
	SoundManager.play_gate_bonus()

func apply_neck_gate(val: float) -> void:
	current_max_height = clamp(current_max_height + val, 1.5, 25.0)
	SoundManager.play_gate_bonus()
	
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3(1.2, 1.0, 1.2), 0.08)
	tw.tween_property(self, "scale", Vector3.ONE, 0.08)

func bonk_overhead() -> void:
	if not is_active:
		return
	is_active = false
	SoundManager.play_bonk()
	
	var tw = create_tween()
	tw.tween_property(head_root, "rotation_degrees:x", -85.0, 0.1)
	tw.tween_property(self, "rotation_degrees:z", 90.0, 0.2)
	tw.tween_callback(func():
		player_died.emit("BONK_FAIL")
	)

func poke_bottom() -> void:
	if not is_active:
		return
	is_active = false
	SoundManager.play_spike()
	
	var tw = create_tween()
	tw.tween_property(self, "position:y", position.y + 2.8, 0.15)
	tw.tween_property(self, "position:y", -0.5, 0.2)
	tw.tween_callback(func():
		player_died.emit("SPIKE_FAIL")
	)

func trigger_finish(tower_bonus: float) -> void:
	is_at_finish = true
	is_holding = true
	SoundManager.play_win()
	
	var tw = create_tween()
	tw.tween_interval(1.2)
	tw.tween_callback(func():
		reached_finish.emit(current_neck_height * tower_bonus)
	)
