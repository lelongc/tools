extends CharacterBody3D
class_name Mannequin3D

## Mannequin3D.gd
## Hình nhân ma-nơ-canh 3D: Chạy trốn tấu hài, tạo dáng và đổi màu da khi bị bắn sơn

enum MannequinType {
	STAND_POSE,
	PANIC_RUN,
	DANCING
}

@export var mannequin_type: MannequinType = MannequinType.PANIC_RUN
@export var custom_mesh: Mesh = null

var paint_color: String = "white" # "white", "red", "blue"
var paint_percent: float = 0.0 # 0.0 -> 100.0
var is_fully_painted: bool = false
var is_carried: bool = false

var anim_timer: float = 0.0
var panic_velocity: Vector3 = Vector3.ZERO
var body_mesh_instance: MeshInstance3D
var mannequin_mat: StandardMaterial3D

func _ready() -> void:
	_create_mannequin_visuals()
	
	var col = CollisionShape3D.new()
	var cap = CapsuleShape3D.new()
	cap.radius = 0.4
	cap.height = 1.6
	col.shape = cap
	col.position.y = 0.8
	add_child(col)

func _create_mannequin_visuals() -> void:
	mannequin_mat = StandardMaterial3D.new()
	mannequin_mat.albedo_color = Color(0.95, 0.95, 0.95)
	mannequin_mat.roughness = 0.35
	
	var root_node = Node3D.new()
	root_node.name = "MannequinModel"
	add_child(root_node)
	
	# Thân hình nhân (Cylinder)
	var torso = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.top_radius = 0.28
	cyl.bottom_radius = 0.22
	cyl.height = 0.7
	torso.mesh = cyl
	torso.position.y = 0.75
	torso.material_override = mannequin_mat
	root_node.add_child(torso)
	body_mesh_instance = torso
	
	# Đầu hình nhân (Sphere)
	var head = MeshInstance3D.new()
	var sph = SphereMesh.new()
	sph.radius = 0.24
	sph.height = 0.48
	head.mesh = sph
	head.position.y = 1.3
	head.material_override = mannequin_mat
	root_node.add_child(head)
	
	# Hai tay giang rộng tạo dáng T-pose
	var arm_l = MeshInstance3D.new()
	var arm_mesh = CapsuleMesh.new()
	arm_mesh.radius = 0.08
	arm_mesh.height = 0.55
	arm_l.mesh = arm_mesh
	arm_l.position = Vector3(-0.42, 0.95, 0)
	arm_l.rotation_degrees.z = 70
	arm_l.material_override = mannequin_mat
	root_node.add_child(arm_l)
	
	var arm_r = MeshInstance3D.new()
	arm_r.mesh = arm_mesh
	arm_r.position = Vector3(0.42, 0.95, 0)
	arm_r.rotation_degrees.z = -70
	arm_r.material_override = mannequin_mat
	root_node.add_child(arm_r)
	
	# Hai chân
	var leg_mesh = CapsuleMesh.new()
	leg_mesh.radius = 0.09
	leg_mesh.height = 0.6
	
	var leg_l = MeshInstance3D.new()
	leg_l.mesh = leg_mesh
	leg_l.position = Vector3(-0.16, 0.3, 0)
	leg_l.material_override = mannequin_mat
	root_node.add_child(leg_l)
	
	var leg_r = MeshInstance3D.new()
	leg_r.mesh = leg_mesh
	leg_r.position = Vector3(0.16, 0.3, 0)
	leg_r.material_override = mannequin_mat
	root_node.add_child(leg_r)

func _physics_process(delta: float) -> void:
	if is_carried:
		return
		
	anim_timer += delta * 6.0
	
	# Áp dụng trọng lực
	if not is_on_floor():
		velocity.y -= 14.0 * delta
	else:
		velocity.y = 0.0
		
	match mannequin_type:
		MannequinType.STAND_POSE:
			# Xoay nhẹ tạo dáng
			rotation.y += delta * 0.8
			velocity.x = move_toward(velocity.x, 0, 8.0 * delta)
			velocity.z = move_toward(velocity.z, 0, 8.0 * delta)
			
		MannequinType.PANIC_RUN:
			# Tìm người chơi gần nhất để co giò bỏ chạy
			var nearest_player = _find_nearest_player()
			if nearest_player:
				var diff = global_position - nearest_player.global_position
				diff.y = 0
				var dist = diff.length()
				if dist < 7.0: # Thấy người chơi lại gần là hoảng loạn chạy
					var run_dir = diff.normalized()
					velocity.x = run_dir.x * 5.5
					velocity.z = run_dir.z * 5.5
					# Nghiêng người lắc lư khi chạy
					rotation.y = atan2(run_dir.x, run_dir.z)
					rotation.z = sin(anim_timer * 2.0) * 0.25
				else:
					velocity.x = move_toward(velocity.x, 0, 5.0 * delta)
					velocity.z = move_toward(velocity.z, 0, 5.0 * delta)
					rotation.z = 0
					
		MannequinType.DANCING:
			rotation.y += delta * 2.5
			var bob = sin(anim_timer) * 0.15
			position.y += bob * delta * 5.0

	move_and_slide()

func _find_nearest_player() -> Node3D:
	var players = get_tree().get_nodes_in_group("players")
	var nearest: Node3D = null
	var min_d: float = 999.0
	for p in players:
		if p is Node3D:
			var d = global_position.distance_to(p.global_position)
			if d < min_d:
				min_d = d
				nearest = p
	return nearest

func apply_paint(team: String, amount: float, _by_player_id: int) -> void:
	if paint_color != team:
		# Giảm màu cũ trước rồi đổi màu mới
		paint_percent -= amount
		if paint_percent <= 0.0:
			paint_color = team
			paint_percent = abs(paint_percent)
	else:
		paint_percent += amount
		
	paint_percent = clamp(paint_percent, 0.0, 100.0)
	
	# Cập nhật màu vật liệu 3D
	_update_material_color()
	
	# Nhún nảy khi bị bắn trúng
	scale = Vector3(1.2, 0.8, 1.2)
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector3.ONE, 0.25)
	
	if paint_percent >= 100.0 and not is_fully_painted:
		is_fully_painted = true
		SoundManager3D.play_sfx("order_success", 1.3)
		# Tăng điểm thưởng khi hoàn thiện 100%
		if team == "red":
			GameManager3D.p1_score += 100
		else:
			GameManager3D.p2_score += 100

func _update_material_color() -> void:
	var target_col = Color(0.95, 0.95, 0.95)
	if paint_color == "red":
		target_col = Color(1.0, 0.25, 0.35)
	elif paint_color == "blue":
		target_col = Color(0.15, 0.75, 1.0)
		
	var ratio = paint_percent / 100.0
	var final_col = Color(0.95, 0.95, 0.95).lerp(target_col, ratio)
	mannequin_mat.albedo_color = final_col
	
	if is_fully_painted:
		mannequin_mat.emission_enabled = true
		mannequin_mat.emission = target_col
		mannequin_mat.emission_energy_multiplier = 0.8
	else:
		mannequin_mat.emission_enabled = false

func take_slap(impulse: Vector3) -> void:
	velocity += impulse
	SoundManager3D.play_sfx("bonk", randf_range(1.0, 1.3))
	# Xoay tròn lộn cổ
	var tween = create_tween()
	tween.tween_property(self, "rotation_degrees:x", rotation_degrees.x + 360.0, 0.4)
