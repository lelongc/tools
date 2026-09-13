extends CharacterBody3D
class_name CongaPlayer3D

## CongaPlayer3D.gd
## Chú gà chiến 3D: Nối đuôi đàn hình nhân thành cây roi khổng lồ và quất bay bạn bè

@export var player_id: int = 1 # 1: Đỏ, 2: Xanh, 3: Vàng, 4: Xanh Lá
@export var is_ai: bool = false
@export var custom_mesh: Mesh = null

var team_color: Color = Color.RED
var base_speed: float = 9.5
var dash_speed: float = 24.0
var is_dashing: bool = false
var dash_timer: float = 0.0
var dash_cooldown: float = 0.0
var stun_timer: float = 0.0

var walk_anim: float = 0.0
var my_chain: Array = []

var body_mesh: MeshInstance3D
var eye_left: MeshInstance3D
var eye_right: MeshInstance3D
var stars_container: Node3D

const GRAVITY = 22.0

func _ready() -> void:
	add_to_group("players")
	team_color = CongaGameManager3D.TEAM_COLORS[player_id - 1]
	_build_chubby_chicken_model()
	
	var col = CollisionShape3D.new()
	var cap = CapsuleShape3D.new()
	cap.radius = 0.45
	cap.height = 1.2
	col.shape = cap
	col.position.y = 0.6
	add_child(col)

func _build_chubby_chicken_model() -> void:
	var root_vis = Node3D.new()
	root_vis.name = "Visuals"
	add_child(root_vis)
	
	var body_mat = StandardMaterial3D.new()
	body_mat.albedo_color = team_color
	body_mat.roughness = 0.3
	body_mat.emission_enabled = true
	body_mat.emission = team_color
	body_mat.emission_energy_multiplier = 0.4
	
	# Thân gà hình cầu mập mạp
	body_mesh = MeshInstance3D.new()
	var sph = SphereMesh.new()
	sph.radius = 0.48
	sph.height = 0.96
	body_mesh.mesh = sph
	body_mesh.position.y = 0.6
	body_mesh.material_override = body_mat
	root_vis.add_child(body_mesh)
	
	# Mào gà đỏ rực
	var comb = MeshInstance3D.new()
	var box = BoxMesh.new()
	box.size = Vector3(0.1, 0.25, 0.35)
	comb.mesh = box
	comb.position = Vector3(0, 1.15, 0.05)
	var comb_mat = StandardMaterial3D.new()
	comb_mat.albedo_color = Color(0.95, 0.15, 0.15)
	comb.material_override = comb_mat
	root_vis.add_child(comb)
	
	# Mỏ vàng nhọn
	var beak = MeshInstance3D.new()
	var cone = CylinderMesh.new()
	cone.top_radius = 0.0
	cone.bottom_radius = 0.12
	cone.height = 0.25
	beak.mesh = cone
	beak.position = Vector3(0, 0.7, 0.5)
	beak.rotation_degrees.x = 90
	var beak_mat = StandardMaterial3D.new()
	beak_mat.albedo_color = Color(1.0, 0.8, 0.1)
	beak.material_override = beak_mat
	root_vis.add_child(beak)
	
	# Cặp mắt to tròn Googly Eyes
	var eye_mat = StandardMaterial3D.new()
	eye_mat.albedo_color = Color.WHITE
	var eye_mesh = SphereMesh.new()
	eye_mesh.radius = 0.12
	eye_mesh.height = 0.24
	
	eye_left = MeshInstance3D.new()
	eye_left.mesh = eye_mesh
	eye_left.position = Vector3(-0.2, 0.85, 0.36)
	eye_left.material_override = eye_mat
	root_vis.add_child(eye_left)
	
	eye_right = MeshInstance3D.new()
	eye_right.mesh = eye_mesh
	eye_right.position = Vector3(0.2, 0.85, 0.36)
	eye_right.material_override = eye_mat
	root_vis.add_child(eye_right)
	
	# Ngôi sao quay quanh đầu khi bị choáng
	stars_container = Node3D.new()
	stars_container.position.y = 1.35
	stars_container.visible = false
	root_vis.add_child(stars_container)
	for i in range(3):
		var star = MeshInstance3D.new()
		var ssph = SphereMesh.new()
		ssph.radius = 0.07
		ssph.height = 0.14
		star.mesh = ssph
		var smat = StandardMaterial3D.new()
		smat.albedo_color = Color(1.0, 0.9, 0.1)
		smat.emission_enabled = true
		smat.emission = Color(1.0, 0.9, 0.1)
		star.material_override = smat
		star.position = Vector3(cos(i * 2.09) * 0.35, 0, sin(i * 2.09) * 0.35)
		stars_container.add_child(star)

func _physics_process(delta: float) -> void:
	if dash_cooldown > 0: dash_cooldown -= delta
	
	# Xử lý choáng
	if stun_timer > 0:
		stun_timer -= delta
		stars_container.visible = true
		stars_container.rotation.y += delta * 15.0
		rotation.y += delta * 18.0
		velocity.x = move_toward(velocity.x, 0, 10.0 * delta)
		velocity.z = move_toward(velocity.z, 0, 10.0 * delta)
		if not is_on_floor():
			velocity.y -= GRAVITY * delta
		move_and_slide()
		return
	else:
		stars_container.visible = false

	if not is_on_floor():
		velocity.y -= GRAVITY * delta

	# Xử lý lướt quất roi
	if is_dashing:
		dash_timer -= delta
		var forward = Vector3.FORWARD.rotated(Vector3.UP, rotation.y)
		velocity.x = forward.x * dash_speed
		velocity.z = forward.z * dash_speed
		if dash_timer <= 0:
			is_dashing = false
	else:
		var input_vec = Vector3.ZERO
		if is_ai:
			input_vec = _get_ai_input()
		else:
			input_vec = _get_human_input()
			
		if input_vec.length() > 0.1:
			walk_anim += delta * 16.0
			var current_speed = max(6.0, base_speed - my_chain.size() * 0.12)
			velocity.x = input_vec.x * current_speed
			velocity.z = input_vec.z * current_speed
			
			var target_rot = atan2(input_vec.x, input_vec.z)
			rotation.y = lerp_angle(rotation.y, target_rot, 14.0 * delta)
			body_mesh.scale = Vector3(1.0 + sin(walk_anim) * 0.1, 1.0 - sin(walk_anim) * 0.1, 1.0)
		else:
			velocity.x = move_toward(velocity.x, 0, base_speed * 6.0 * delta)
			velocity.z = move_toward(velocity.z, 0, base_speed * 6.0 * delta)
			body_mesh.scale = body_mesh.scale.lerp(Vector3.ONE, 10.0 * delta)

	move_and_slide()
	
	# Giới hạn trong võ đài
	global_position.x = clamp(global_position.x, -14.5, 14.5)
	global_position.z = clamp(global_position.z, -14.5, 14.5)

	# Kiểm tra va chạm với hình nhân
	_check_mannequin_collisions()

func _get_human_input() -> Vector3:
	var prefix = "p%d_" % player_id
	var dir = Vector3.ZERO
	if Input.is_action_pressed(prefix + "right"): dir.x += 1
	if Input.is_action_pressed(prefix + "left"): dir.x -= 1
	if Input.is_action_pressed(prefix + "down"): dir.z += 1
	if Input.is_action_pressed(prefix + "up"): dir.z -= 1
	dir = dir.normalized()
	
	if Input.is_action_just_pressed(prefix + "dash"):
		trigger_dash()
		
	return dir

func _get_ai_input() -> Vector3:
	var target = _find_nearest_free_mannequin()
	if target:
		var diff = target.global_position - global_position
		diff.y = 0
		var dist = diff.length()
		if dist < 4.0 and dash_cooldown <= 0:
			trigger_dash()
		return diff.normalized()
	return Vector3.ZERO

func _find_nearest_free_mannequin() -> Node3D:
	var dummies = get_tree().get_nodes_in_group("mannequins")
	var nearest: Node3D = null
	var min_d: float = 999.0
	for d in dummies:
		if d.is_in_group("mannequins") and ("state" in d) and d.state == 0:
			var dist = global_position.distance_to(d.global_position)
			if dist < min_d:
				min_d = dist
				nearest = d
	return nearest

func trigger_dash() -> void:
	if dash_cooldown > 0 or is_dashing: return
	is_dashing = true
	dash_timer = 0.25
	dash_cooldown = 1.0
	CongaSoundManager3D.play_sfx("dash", randf_range(1.0, 1.2))
	
	# Quất mạnh các khớp nối
	for m in my_chain:
		if is_instance_valid(m):
			m.scale = Vector3(1.4, 0.7, 1.4)
			var tw = create_tween()
			tw.tween_property(m, "scale", Vector3.ONE, 0.25)

func _check_mannequin_collisions() -> void:
	var dummies = get_tree().get_nodes_in_group("mannequins")
	for d in dummies:
		if d.is_in_group("mannequins") and ("state" in d):
			var dist = global_position.distance_to(d.global_position)
			# Chạm hình nhân tự do (state 0 == FREE) -> Nối đuôi!
			if dist < 1.6 and d.state == 0:
				attach_mannequin(d)
			# Cắt ngang đuôi đối thủ khi lướt (state 1 == LINKED) -> Cướp đuôi!
			elif is_dashing and dist < 2.0 and d.state == 1 and d.owner_player != self:
				_cut_opponent_chain(d)

func attach_mannequin(dummy: Node3D) -> void:
	var target_node: Node3D = self
	if not my_chain.is_empty():
		target_node = my_chain.back()
		
	my_chain.append(dummy)
	dummy.link_to(self, target_node, team_color, player_id)
	CongaGameManager3D.update_chain_length(player_id, my_chain.size())

func _cut_opponent_chain(hit_dummy: Node3D) -> void:
	var opp = hit_dummy.owner_player
	if not opp: return
	
	CongaSoundManager3D.play_sfx("steal", 1.2)
	CongaGameManager3D.register_whip_hit(player_id)
	
	var cut_idx = opp.my_chain.find(hit_dummy)
	if cut_idx != -1:
		var detached = opp.my_chain.slice(cut_idx)
		opp.my_chain = opp.my_chain.slice(0, cut_idx)
		CongaGameManager3D.update_chain_length(opp.player_id, opp.my_chain.size())
		
		for m in detached:
			if is_instance_valid(m):
				var throw_dir = (m.global_position - global_position).normalized()
				m.take_whip_scatter(throw_dir * 14.0)

func take_whip_stun(impulse: Vector3) -> void:
	stun_timer = 0.8
	velocity = impulse
	CongaSoundManager3D.play_sfx("bonk", 1.0)
	
	# Rơi một nửa đuôi hình nhân
	if my_chain.size() > 2:
		var drop_count = my_chain.size() / 2
		for i in range(drop_count):
			var m = my_chain.pop_back()
			if is_instance_valid(m):
				var rdir = Vector3(randf_range(-1, 1), 0, randf_range(-1, 1)).normalized()
				m.take_whip_scatter(rdir * 10.0)
		CongaGameManager3D.update_chain_length(player_id, my_chain.size())

func clear_chain_for_banking() -> int:
	var count = my_chain.size()
	for m in my_chain:
		if is_instance_valid(m):
			m.detach()
			m.global_position = Vector3(randf_range(-12, 12), 1.0, randf_range(-12, 12))
	my_chain.clear()
	CongaGameManager3D.update_chain_length(player_id, 0)
	return count
