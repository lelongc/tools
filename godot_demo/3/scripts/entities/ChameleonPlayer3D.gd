extends CharacterBody3D

## ChameleonPlayer3D.gd
## Chú Tắc Kè 3D: Mắt lồi xoay 360 độ, Lưỡi dính đàn hồi lò xo, Nuốt hình nhân phồng bụng & Khạc đại bác pháo sơn

@export var player_id: int = 1
@export var is_ai: bool = false

var team_color: Color = Color(1.0, 0.25, 0.4)
var base_speed: float = 9.0
var current_speed: float = 9.0

# Trạng thái Lưỡi Tắc Kè
enum TongueState {
	IDLE,
	EXTENDING,
	RETRACTING,
	GRAPPLING
}
var tongue_state: TongueState = TongueState.IDLE
var tongue_dir: Vector3 = Vector3.FORWARD
var tongue_dist: float = 0.0
var max_tongue_dist: float = 9.5
var tongue_speed: float = 38.0
var grapple_target: Vector3 = Vector3.ZERO

# Bụng và hình nhân đã nuốt
var swallowed_mannequins: Array[Node3D] = []
var max_belly_capacity: int = 10

# Bộ phận 3D Procedural
var body_root: Node3D
var belly_mesh: MeshInstance3D
var eye_left: Node3D
var eye_right: Node3D
var tongue_line: MeshInstance3D
var tongue_tip: MeshInstance3D
var mouth_node: Node3D

# Bộ đệm điều khiển di động (Mobile Touch)
var mobile_move_vector: Vector2 = Vector2.ZERO
var mobile_tongue_trigger: bool = false
var mobile_spit_trigger: bool = false

# Buff siêu năng lực tạm thời
var active_buff: int = -1
var buff_timer: float = 0.0

# Biến animation & AI
var walk_time: float = 0.0
var ai_decision_timer: float = 0.0
var ai_target_node: Node3D = null
var double_tap_timer: float = 0.0

const GRAVITY = 22.0

func _ready() -> void:
	add_to_group("chameleons")
	team_color = ChameleonGameManager.TEAM_COLORS[player_id - 1]
	_build_chameleon_model()
	
	var col = CollisionShape3D.new()
	var cap = CapsuleShape3D.new()
	cap.radius = 0.55
	cap.height = 1.3
	col.shape = cap
	col.position.y = 0.65
	add_child(col)

func _build_chameleon_model() -> void:
	body_root = Node3D.new()
	body_root.name = "Model"
	add_child(body_root)
	
	var skin_mat = StandardMaterial3D.new()
	skin_mat.albedo_color = team_color
	skin_mat.roughness = 0.35
	skin_mat.emission_enabled = true
	skin_mat.emission = team_color
	skin_mat.emission_energy_multiplier = 0.35
	
	# 1. Thân tắc kè mập mạp (Belly)
	belly_mesh = MeshInstance3D.new()
	var sph = SphereMesh.new()
	sph.radius = 0.55
	sph.height = 1.0
	belly_mesh.mesh = sph
	belly_mesh.position = Vector3(0, 0.6, 0)
	belly_mesh.material_override = skin_mat
	body_root.add_child(belly_mesh)
	
	# 2. Đầu tắc kè
	var head = MeshInstance3D.new()
	var head_sph = SphereMesh.new()
	head_sph.radius = 0.42
	head_sph.height = 0.75
	head.mesh = head_sph
	head.position = Vector3(0, 0.75, 0.5)
	head.material_override = skin_mat
	body_root.add_child(head)
	
	mouth_node = Node3D.new()
	mouth_node.position = Vector3(0, 0.65, 0.85)
	body_root.add_child(mouth_node)
	
	# 3. Hai mắt lồi xoay 360 độ độc lập đặc trưng của Tắc Kè
	var eye_mat = StandardMaterial3D.new()
	eye_mat.albedo_color = Color.WHITE
	
	var pupil_mat = StandardMaterial3D.new()
	pupil_mat.albedo_color = Color.BLACK
	
	# Mắt trái
	eye_left = Node3D.new()
	eye_left.position = Vector3(-0.35, 0.95, 0.5)
	var e_l_mesh = MeshInstance3D.new()
	var eye_sph = SphereMesh.new()
	eye_sph.radius = 0.16
	eye_sph.height = 0.32
	e_l_mesh.mesh = eye_sph
	e_l_mesh.material_override = eye_mat
	eye_left.add_child(e_l_mesh)
	
	var pupil_l = MeshInstance3D.new()
	var p_sph = SphereMesh.new()
	p_sph.radius = 0.07
	p_sph.height = 0.14
	pupil_l.mesh = p_sph
	pupil_l.position = Vector3(0, 0, 0.12)
	pupil_l.material_override = pupil_mat
	eye_left.add_child(pupil_l)
	body_root.add_child(eye_left)
	
	# Mắt phải
	eye_right = Node3D.new()
	eye_right.position = Vector3(0.35, 0.95, 0.5)
	var e_r_mesh = MeshInstance3D.new()
	e_r_mesh.mesh = eye_sph
	e_r_mesh.material_override = eye_mat
	eye_right.add_child(e_r_mesh)
	
	var pupil_r = MeshInstance3D.new()
	pupil_r.mesh = p_sph
	pupil_r.position = Vector3(0, 0, 0.12)
	pupil_r.material_override = pupil_mat
	eye_right.add_child(pupil_r)
	body_root.add_child(eye_right)
	
	# 4. Đuôi xoắn ốc ngộ nghĩnh
	var tail = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.top_radius = 0.05
	cyl.bottom_radius = 0.18
	cyl.height = 0.6
	tail.mesh = cyl
	tail.position = Vector3(0, 0.55, -0.65)
	tail.rotation_degrees.x = -60
	tail.material_override = skin_mat
	body_root.add_child(tail)
	
	# 5. Hệ thống Lưỡi Dính 3D (Tongue Visuals)
	tongue_line = MeshInstance3D.new()
	var t_cyl = CylinderMesh.new()
	t_cyl.top_radius = 0.08
	t_cyl.bottom_radius = 0.08
	t_cyl.height = 1.0
	tongue_line.mesh = t_cyl
	tongue_line.visible = false
	
	var tongue_mat = StandardMaterial3D.new()
	tongue_mat.albedo_color = Color(1.0, 0.35, 0.55)
	tongue_mat.emission_enabled = true
	tongue_mat.emission = Color(1.0, 0.25, 0.45)
	tongue_mat.emission_energy_multiplier = 0.8
	tongue_line.material_override = tongue_mat
	add_child(tongue_line)
	
	tongue_tip = MeshInstance3D.new()
	var tip_sph = SphereMesh.new()
	tip_sph.radius = 0.22
	tip_sph.height = 0.44
	tongue_tip.mesh = tip_sph
	tongue_tip.material_override = tongue_mat
	tongue_tip.visible = false
	add_child(tongue_tip)

func _physics_process(delta: float) -> void:
	if not is_on_floor():
		velocity.y -= GRAVITY * delta
	else:
		velocity.y = 0.0
		
	_handle_buffs(delta)
	_handle_tongue_state(delta)
	
	if tongue_state != TongueState.GRAPPLING:
		_handle_movement(delta)
		
	_animate_chameleon_eyes(delta)
	_update_belly_scale(delta)
	
	move_and_slide()
	
	# Giữ nhân vật trong sàn đấu
	global_position.x = clamp(global_position.x, -16.0, 16.0)
	global_position.z = clamp(global_position.z, -16.0, 16.0)

func _handle_movement(delta: float) -> void:
	var input_vec = Vector2.ZERO
	
	if is_ai:
		input_vec = _calculate_ai_input(delta)
	else:
		# 1. Nhận từ Mobile Virtual Controls (nếu có)
		if mobile_move_vector.length() > 0.1:
			input_vec = mobile_move_vector
		else:
			# 2. Nhận từ Bàn phím / Gamepad theo player_id
			var prefix = "p%d_" % player_id
			if Input.is_action_pressed(prefix + "left"): input_vec.x -= 1.0
			if Input.is_action_pressed(prefix + "right"): input_vec.x += 1.0
			if Input.is_action_pressed(prefix + "up"): input_vec.y -= 1.0
			if Input.is_action_pressed(prefix + "down"): input_vec.y += 1.0
			
		# Xử lý nút bấm Lưỡi & Khạc đạn
		var prefix_act = "p%d_dash" % player_id
		if Input.is_action_just_pressed(prefix_act) or mobile_tongue_trigger:
			mobile_tongue_trigger = false
			trigger_tongue_shot()
			
		# Nút khạc đạn: Phím F, Shift, hoặc double tap
		if Input.is_key_pressed(KEY_F) or Input.is_key_pressed(KEY_SHIFT) or mobile_spit_trigger:
			mobile_spit_trigger = false
			trigger_spit_cannon()
			
	if input_vec.length() > 1.0:
		input_vec = input_vec.normalized()
		
	var move_dir = Vector3(input_vec.x, 0, input_vec.y)
	if move_dir.length() > 0.1:
		velocity.x = move_dir.x * current_speed
		velocity.z = move_dir.z * current_speed
		
		var target_angle = atan2(move_dir.x, move_dir.z)
		rotation.y = lerp_angle(rotation.y, target_angle, 14.0 * delta)
		
		walk_time += delta * 12.0
		body_root.position.y = abs(sin(walk_time)) * 0.12
		body_root.rotation.z = sin(walk_time) * 0.08
	else:
		velocity.x = move_toward(velocity.x, 0.0, 20.0 * delta)
		velocity.z = move_toward(velocity.z, 0.0, 20.0 * delta)
		body_root.position.y = move_toward(body_root.position.y, 0.0, 5.0 * delta)

func trigger_tongue_shot() -> void:
	if tongue_state != TongueState.IDLE:
		return
		
	tongue_state = TongueState.EXTENDING
	tongue_dist = 0.0
	tongue_dir = -transform.basis.z.normalized()
	
	tongue_line.visible = true
	tongue_tip.visible = true
	ChameleonSoundManager.play_sfx("tongue_shoot", randf_range(0.95, 1.25))

func trigger_spit_cannon() -> void:
	if swallowed_mannequins.is_empty() or tongue_state != TongueState.IDLE:
		return
		
	var spit_count = mini(3, swallowed_mannequins.size())
	ChameleonSoundManager.play_sfx("spit_cannon", randf_range(1.0, 1.25))
	
	# Giật lùi phản lực
	velocity += transform.basis.z * 10.0
	scale = Vector3(1.3, 0.7, 1.3)
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3.ONE, 0.25)
	
	var base_shoot_dir = -transform.basis.z.normalized()
	var speed = 30.0 if ChameleonGameManager.active_mutations.has("giga_cannon") else 24.0
	
	for i in range(spit_count):
		var dummy = swallowed_mannequins.pop_back()
		if is_instance_valid(dummy):
			var spread_ang = (float(i) - (spit_count - 1) * 0.5) * 0.25
			var shoot_dir = base_shoot_dir.rotated(Vector3.UP, spread_ang)
			dummy.global_position = mouth_node.global_position + shoot_dir * 1.0
			dummy.launch_as_projectile(shoot_dir, speed)
			
	ChameleonGameManager.register_spit(player_id, spit_count)
	_realign_orbiting_mannequins()

func _handle_tongue_state(delta: float) -> void:
	var start_pos = mouth_node.global_position
	
	match tongue_state:
		TongueState.IDLE:
			tongue_line.visible = false
			tongue_tip.visible = false
			
		TongueState.EXTENDING:
			tongue_dist += tongue_speed * delta
			var tip_pos = start_pos + tongue_dir * tongue_dist
			_update_tongue_visuals(start_pos, tip_pos)
			
			# Kiểm tra va chạm lưỡi với đối tượng
			var hit_obj = _check_tongue_collision(start_pos, tip_pos)
			if hit_obj:
				_on_tongue_hit_object(hit_obj, tip_pos)
			elif tongue_dist >= max_tongue_dist:
				tongue_state = TongueState.RETRACTING
				
		TongueState.RETRACTING:
			tongue_dist -= tongue_speed * delta * 1.5
			if tongue_dist <= 0.2:
				tongue_state = TongueState.IDLE
				tongue_dist = 0.0
			var tip_pos = start_pos + tongue_dir * tongue_dist
			_update_tongue_visuals(start_pos, tip_pos)
			
		TongueState.GRAPPLING:
			# Kéo tắc kè lao vút tới điểm bám
			var pull_dir = (grapple_target - global_position)
			pull_dir.y = 0
			var dist_to_target = pull_dir.length()
			
			if dist_to_target > 1.2:
				velocity = pull_dir.normalized() * (tongue_speed * 0.85)
				_update_tongue_visuals(start_pos, grapple_target)
			else:
				tongue_state = TongueState.IDLE
				velocity = Vector3.ZERO

func _update_tongue_visuals(p_start: Vector3, p_end: Vector3) -> void:
	tongue_line.visible = true
	tongue_tip.visible = true
	
	var mid = (p_start + p_end) * 0.5
	tongue_line.global_position = mid
	tongue_tip.global_position = p_end
	
	var dist = p_start.distance_to(p_end)
	tongue_line.scale.y = maxi(dist, 0.01)
	
	if dist > 0.05:
		tongue_line.look_at(p_end, Vector3.UP)
		tongue_line.rotate_object_local(Vector3.RIGHT, PI * 0.5)

func _check_tongue_collision(p_start: Vector3, p_end: Vector3) -> Node:
	var space = get_world_3d().direct_space_state
	var query = PhysicsRayQueryParameters3D.create(p_start, p_end)
	query.exclude = [self.get_rid()]
	var res = space.intersect_ray(query)
	
	if res.has("collider"):
		return res["collider"]
	return null

func _on_tongue_hit_object(obj: Node, hit_pos: Vector3) -> void:
	ChameleonSoundManager.play_sfx("tongue_hit", 1.1)
	
	# 1. Trúng hình nhân ma-nơ-canh -> Nuốt chửng!
	if obj.is_in_group("mannequins") and obj.has_method("start_orbiting"):
		if obj.state == 0: # FREE
			_slurp_mannequin(obj)
			tongue_state = TongueState.RETRACTING
			return
			
	# 2. Trúng bọ siêu năng lực -> Kích hoạt buff
	if obj.is_in_group("power_bugs") and obj.has_method("_on_body_entered"):
		obj._on_body_entered(self)
		tongue_state = TongueState.RETRACTING
		return
		
	# 3. Trúng đối thủ tắc kè khác -> Tát văng và cướp 1 hình nhân
	if obj.is_in_group("chameleons") and obj != self:
		_slap_opponent(obj)
		tongue_state = TongueState.RETRACTING
		return
		
	# 4. Trúng tường hoặc chướng ngại vật -> Đu dây kéo người (Grapple)
	if obj is StaticBody3D:
		grapple_target = hit_pos
		tongue_state = TongueState.GRAPPLING
		ChameleonSoundManager.play_sfx("grapple_pull", 1.2)

func _slurp_mannequin(dummy: Node3D) -> void:
	if swallowed_mannequins.size() >= max_belly_capacity:
		return
		
	swallowed_mannequins.append(dummy)
	dummy.start_orbiting(self, team_color, player_id, swallowed_mannequins.size() - 1, swallowed_mannequins.size())
	ChameleonSoundManager.play_sfx("swallow", randf_range(0.95, 1.2))
	ChameleonGameManager.register_slurp(player_id, 1)
	
	# Nhún nảy bụng khi nuốt
	belly_mesh.scale = Vector3(1.4, 0.7, 1.4)
	var tw = create_tween()
	tw.tween_property(belly_mesh, "scale", Vector3.ONE, 0.2)

func _slap_opponent(opp: Node) -> void:
	ChameleonSoundManager.play_sfx("tongue_hit", 1.4)
	var slap_dir = (opp.global_position - global_position).normalized()
	opp.velocity = slap_dir * 18.0 + Vector3.UP * 4.0
	
	# Cướp 1 hình nhân của đối thủ nếu họ có
	if opp.has_method("steal_one_mannequin"):
		var stolen = opp.steal_one_mannequin()
		if stolen:
			_slurp_mannequin(stolen)

func steal_one_mannequin() -> Node3D:
	if swallowed_mannequins.is_empty():
		return null
	var m = swallowed_mannequins.pop_back()
	ChameleonGameManager.register_spit(player_id, 1)
	_realign_orbiting_mannequins()
	return m

func _realign_orbiting_mannequins() -> void:
	for i in range(swallowed_mannequins.size()):
		var dummy = swallowed_mannequins[i]
		if is_instance_valid(dummy) and dummy.has_method("start_orbiting"):
			dummy.start_orbiting(self, team_color, player_id, i, swallowed_mannequins.size())

func _animate_chameleon_eyes(delta: float) -> void:
	# Mắt trái nhìn về phía hình nhân gần nhất
	var nearest_m = _find_nearest_mannequin()
	if nearest_m:
		eye_left.look_at(nearest_m.global_position, Vector3.UP)
	else:
		eye_left.rotation.y += delta * 1.5
		
	# Mắt phải nhìn về đối thủ gần nhất hoặc ngẫu nhiên
	var nearest_p = _find_nearest_opponent()
	if nearest_p:
		eye_right.look_at(nearest_p.global_position, Vector3.UP)
	else:
		eye_right.rotation.y -= delta * 1.8

func _update_belly_scale(delta: float) -> void:
	# Càng nuốt nhiều, bụng càng phình to lắc lư
	var target_belly = 1.0 + (swallowed_mannequins.size() * 0.065)
	belly_mesh.scale = belly_mesh.scale.lerp(Vector3(target_belly, target_belly * 0.95, target_belly), 8.0 * delta)

func _handle_buffs(delta: float) -> void:
	if buff_timer > 0.0:
		buff_timer -= delta
		if buff_timer <= 0.0:
			active_buff = -1
			current_speed = base_speed

func grant_bug_power(type: int) -> void:
	active_buff = type
	buff_timer = 10.0
	match type:
		3: # SPEED
			current_speed = base_speed * 1.5
		_:
			current_speed = base_speed

func _calculate_ai_input(delta: float) -> Vector2:
	ai_decision_timer -= delta
	if ai_decision_timer <= 0.0:
		ai_decision_timer = randf_range(0.2, 0.5)
		ai_target_node = _find_nearest_mannequin()
		
	if not ai_target_node or not is_instance_valid(ai_target_node):
		return Vector2(randf_range(-1, 1), randf_range(-1, 1)).normalized()
		
	var diff = ai_target_node.global_position - global_position
	var dist = diff.length()
	
	# Khi ở tầm 3m - 8m, thè lưỡi quất!
	if dist > 2.5 and dist < 8.0 and tongue_state == TongueState.IDLE:
		rotation.y = atan2(diff.x, diff.z)
		trigger_tongue_shot()
		
	# Khi bụng đầy, khạc đại bác!
	if swallowed_mannequins.size() >= 3 and randf() < 0.3:
		trigger_spit_cannon()
		
	return Vector2(diff.x, diff.z).normalized()

func _find_nearest_mannequin() -> Node3D:
	var list = get_tree().get_nodes_in_group("mannequins")
	var best: Node3D = null
	var min_d = 999.0
	for m in list:
		if m is Node3D and ("state" in m) and m.state == 0:
			var d = global_position.distance_to(m.global_position)
			if d < min_d:
				min_d = d
				best = m
	return best

func _find_nearest_opponent() -> Node3D:
	var list = get_tree().get_nodes_in_group("chameleons")
	var best: Node3D = null
	var min_d = 999.0
	for c in list:
		if c != self and c is Node3D:
			var d = global_position.distance_to(c.global_position)
			if d < min_d:
				min_d = d
				best = c
	return best
