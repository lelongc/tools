extends CharacterBody3D

signal neck_height_changed(current_height: float, max_height: float)
signal player_died(reason_key: String)
signal reached_finish(final_height: float)
signal combo_changed(combo: int, is_fever: bool)

# === BASE MOVEMENT ===
@export var base_forward_speed: float = 9.0
@export var speed_per_neck_meter: float = 0.8
@export var swerve_speed: float = 18.0
@export var max_x_limit: float = 3.6

# === NECK MECHANICS (Core Redesign) ===
@export var neck_grow_speed: float = 3.5     # Tốc độ cổ dài ra khi giữ (m/s)
@export var neck_shrink_speed: float = 2.8   # Tốc độ cổ co lại khi thả (m/s)
@export var neck_decay_rate: float = 0.3     # Cổ tự giảm bao nhiêu m/s (luôn luôn)
@export var min_neck_height: float = 0.7
@export var max_neck_cap: float = 12.0       # Giới hạn cổ tối đa tuyệt đối

var current_max_height: float = 4.5          # Giới hạn cổ hiện tại (tăng khi ăn quả)
var current_neck_height: float = 1.5         # Chiều cao cổ hiện tại (analog)

# === COMBO & FEVER ===
var combo_count: int = 0
var fever_active: bool = false
var fever_timer: float = 0.0
const FEVER_DURATION: float = 5.0
const FEVER_COMBO_THRESHOLD: int = 5
var fever_magnet_radius: float = 12.0

# === STATE ===
var is_active: bool = true
var is_holding: bool = false
var is_dragging: bool = false
var target_x: float = 0.0
var is_at_finish: bool = false
var magnet_time_left: float = 0.0

# === FORWARD SPEED (computed) ===
var forward_speed: float = 9.0

# Nút ảo 2D trên màn hình
var touch_steer_dir: float = 0.0
var touch_stretch_held: bool = false

# === VISUAL REFERENCES ===
@onready var body_mesh: MeshInstance3D = $BodyMesh
@onready var neck_mesh: MeshInstance3D = $NeckMesh
@onready var head_root: Node3D = $HeadRoot
@onready var head_mesh: MeshInstance3D = $HeadRoot/HeadMesh
@onready var eye_left: MeshInstance3D = $HeadRoot/EyeLeft
@onready var eye_right: MeshInstance3D = $HeadRoot/EyeRight
@onready var height_label: Label3D = $HeadRoot/HeightLabel

# Fever glow material cache
var _original_neck_mat: Material = null
var _fever_glow_hue: float = 0.0

func _ready() -> void:
	target_x = position.x
	apply_current_skin()
	update_neck_visuals()

func apply_current_skin() -> void:
	if SkinManager:
		SkinManager.apply_skin_to_node(self, SaveSystem.equipped_skin_id)
	# Cache original neck material for fever toggle
	if neck_mesh and neck_mesh.material_override:
		_original_neck_mat = neck_mesh.material_override.duplicate()

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
		
	# === 1. STEERING (Keyboard + Touch) ===
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
	
	# === 2. ANALOG NECK CONTROL (Core Redesign) ===
	# Cổ tự động giảm (decay) liên tục — buộc phải ăn quả để duy trì
	var decay = neck_decay_rate * delta
	current_max_height = max(min_neck_height + 0.5, current_max_height - decay)
	
	if is_at_finish:
		# Ở finish line, tự vươn lên max
		current_neck_height = lerp(current_neck_height, current_max_height, 4.0 * delta)
	elif holding_now:
		# GIỮA NÚT: Cổ DẦN DẦN dài ra (analog, không nhảy lên max)
		current_neck_height += neck_grow_speed * delta
		current_neck_height = min(current_neck_height, current_max_height)
	else:
		# THẢ NÚT: Cổ DẦN DẦN co lại (analog, không nhảy về min)
		current_neck_height -= neck_shrink_speed * delta
		current_neck_height = max(current_neck_height, min_neck_height)
	
	# Clamp cổ trong giới hạn
	current_neck_height = clamp(current_neck_height, min_neck_height, max_neck_cap)
	current_max_height = clamp(current_max_height, min_neck_height + 0.5, max_neck_cap)
	
	# === 3. SPEED SCALING — Cổ dài = Chạy nhanh hơn (Risk/Reward) ===
	forward_speed = base_forward_speed + (current_neck_height * speed_per_neck_meter)
	
	# Khi vươn cổ cao, nhấc nhẹ thân để sải bước qua chông
	var target_body_y = 0.35 + (0.4 if current_neck_height >= 2.0 else 0.0)
	position.y = lerp(position.y, target_body_y, 10.0 * delta)
	
	update_neck_visuals()
	
	if not is_at_finish:
		position.z -= forward_speed * delta
	
	# === 4. FEVER MODE ===
	if fever_active:
		fever_timer -= delta
		if fever_timer <= 0.0:
			end_fever()
		else:
			# Fever = auto magnet
			attract_nearby_items(delta)
			# Fever rainbow glow
			update_fever_glow(delta)
		
	# === 5. MAGNET AURA (from powerup) ===
	if magnet_time_left > 0.0:
		magnet_time_left -= delta
		attract_nearby_items(delta)

func attract_nearby_items(delta: float) -> void:
	var radius = fever_magnet_radius if fever_active else 9.0
	var items = get_tree().get_nodes_in_group("collectables")
	for item in items:
		if is_instance_valid(item) and item is Area3D and not item.get("is_collected"):
			var dist = global_position.distance_to(item.global_position)
			if dist < radius:
				var head_pos = head_root.global_position if head_root else global_position
				item.global_position = item.global_position.lerp(head_pos, 8.0 * delta)

func update_neck_visuals() -> void:
	if head_root:
		head_root.position.y = current_neck_height
	if neck_mesh:
		neck_mesh.position.y = current_neck_height / 2.0
		neck_mesh.scale.y = max(0.1, current_neck_height)
		
		# Khử kéo dãn texture khi cổ dài
		if neck_mesh.material_override and neck_mesh.material_override is StandardMaterial3D:
			var n_mat = neck_mesh.material_override as StandardMaterial3D
			n_mat.uv1_scale = Vector3(2.0, max(0.1, current_neck_height) * 2.0, 2.0)
			
	if height_label:
		height_label.text = "%.1fm" % current_neck_height
		
	if eye_left and eye_right:
		var eye_shake = sin(Time.get_ticks_msec() * 0.02) * 0.04
		eye_left.position.y = 0.35 + eye_shake
		eye_right.position.y = 0.35 - eye_shake
		
	neck_height_changed.emit(current_neck_height, current_max_height)

func update_fever_glow(delta: float) -> void:
	_fever_glow_hue = fmod(_fever_glow_hue + delta * 1.5, 1.0)
	if neck_mesh and neck_mesh.material_override and neck_mesh.material_override is StandardMaterial3D:
		var mat = neck_mesh.material_override as StandardMaterial3D
		var rainbow = Color.from_hsv(_fever_glow_hue, 0.9, 1.0)
		mat.emission_enabled = true
		mat.emission = rainbow
		mat.emission_energy_multiplier = 4.0
	if body_mesh and body_mesh.material_override and body_mesh.material_override is StandardMaterial3D:
		var bmat = body_mesh.material_override as StandardMaterial3D
		var rainbow2 = Color.from_hsv(fmod(_fever_glow_hue + 0.3, 1.0), 0.8, 1.0)
		bmat.emission_enabled = true
		bmat.emission = rainbow2
		bmat.emission_energy_multiplier = 3.0

func end_fever() -> void:
	fever_active = false
	fever_timer = 0.0
	# Restore original materials
	if neck_mesh and neck_mesh.material_override and neck_mesh.material_override is StandardMaterial3D:
		var mat = neck_mesh.material_override as StandardMaterial3D
		mat.emission_energy_multiplier = 0.0
		mat.emission_enabled = false
	if body_mesh and body_mesh.material_override and body_mesh.material_override is StandardMaterial3D:
		var bmat = body_mesh.material_override as StandardMaterial3D
		bmat.emission_energy_multiplier = 0.0
		bmat.emission_enabled = false
	combo_changed.emit(combo_count, false)

# === COLLECTABLES ===
func eat_fruit(bonus_height: float, score: int) -> void:
	# Fever doubles the neck bonus
	var actual_bonus = bonus_height * (2.0 if fever_active else 1.0)
	current_max_height = clamp(current_max_height + actual_bonus, 2.0, max_neck_cap)
	SoundManager.play_collect(1.0 + (current_neck_height * 0.03))
	
	# COMBO ++
	combo_count += 1
	
	# Check Fever activation
	if not fever_active and combo_count >= FEVER_COMBO_THRESHOLD:
		start_fever()
	
	combo_changed.emit(combo_count, fever_active)
	
	# Squash & stretch animation on head
	var tw = create_tween()
	tw.tween_property(head_mesh, "scale", Vector3(1.35, 0.7, 1.35), 0.06)
	tw.tween_property(head_mesh, "scale", Vector3.ONE, 0.08)
	
	var gm = get_tree().root.find_child("GameManager", true, false)
	if gm and gm.has_method("add_score"):
		var score_mult = 3 if fever_active else 1
		gm.add_score(score * score_mult)

func start_fever() -> void:
	fever_active = true
	fever_timer = FEVER_DURATION
	_fever_glow_hue = 0.0
	SoundManager.play_gate_bonus()
	SoundManager.play_win()  # Extra fanfare for fever
	combo_changed.emit(combo_count, true)

func activate_magnet(duration: float = 6.0) -> void:
	magnet_time_left = duration
	SoundManager.play_gate_bonus()

func apply_neck_gate(val: float) -> void:
	current_max_height = clamp(current_max_height + val, 1.5, max_neck_cap)
	SoundManager.play_gate_bonus()
	
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3(1.2, 1.0, 1.2), 0.08)
	tw.tween_property(self, "scale", Vector3.ONE, 0.08)

# === DEATH CALLBACKS ===
func bonk_overhead() -> void:
	if not is_active:
		return
	is_active = false
	reset_combo()
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
	reset_combo()
	SoundManager.play_spike()
	
	var tw = create_tween()
	tw.tween_property(self, "position:y", position.y + 2.8, 0.15)
	tw.tween_property(self, "position:y", -0.5, 0.2)
	tw.tween_callback(func():
		player_died.emit("SPIKE_FAIL")
	)

func hit_tunnel_wall(reason: String) -> void:
	if not is_active:
		return
	is_active = false
	reset_combo()
	SoundManager.play_bonk()
	
	var tw = create_tween()
	tw.tween_property(head_root, "rotation_degrees:x", -60.0, 0.1)
	tw.tween_property(self, "rotation_degrees:z", 45.0, 0.15)
	tw.tween_callback(func():
		player_died.emit(reason)
	)

func reset_combo() -> void:
	combo_count = 0
	if fever_active:
		end_fever()
	combo_changed.emit(0, false)

func trigger_finish(tower_bonus: float) -> void:
	is_at_finish = true
	is_holding = true
	SoundManager.play_win()
	
	var tw = create_tween()
	tw.tween_interval(1.2)
	tw.tween_callback(func():
		reached_finish.emit(current_neck_height * tower_bonus)
	)
