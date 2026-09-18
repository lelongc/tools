extends CharacterBody3D

## SumoPlayer3D.gd
## Đấu Thủ Sumo Ragdoll: Đấm Lò Xo Bẹp Dúm, Húc Đầu Lộn Cổ, Nhấc Bổng Đối Thủ Ném Xuống Vực (YEET!)
## Tích hợp Texture 3D (Da nhân vật, Găng đấm da, Dù sọc), Hiệu ứng hạt tóe sao & Khói bụi tung bay

@export var player_id: int = 1
@export var is_ai: bool = false

var team_color: Color = Color(1.0, 0.28, 0.38)
var base_speed: float = 9.5
var current_speed: float = 9.5

enum State {
	NORMAL,
	STUNNED,
	HELD,
	FALLING_RESPAWN
}
var state: State = State.NORMAL

var stun_timer: float = 0.0
var punch_cooldown: float = 0.0
var dash_cooldown: float = 0.0
var is_dashing: bool = false
var dash_timer: float = 0.0
var is_eliminated: bool = false

# Cơ chế Nhấc Bổng & Ném (Grab & Yeet)
var grabbed_target: Node3D = null
var held_by_player: Node3D = null
var last_attacker_id: int = 0

# 3D Mesh Nodes
var body_root: Node3D
var bean_mesh: MeshInstance3D
var eye_left: MeshInstance3D
var eye_right: MeshInstance3D
var glove_left: Node3D
var glove_right: Node3D
var stars_root: Node3D
var parachute_mesh: MeshInstance3D
var col_shape: CollisionShape3D

# Particles
var hit_sparks: CPUParticles3D
var dust_particles: CPUParticles3D

var walk_time: float = 0.0
var ai_decision_timer: float = 0.0
var ai_target: Node3D = null

# Mobile touch buffers
var mobile_move_vec: Vector2 = Vector2.ZERO
var mobile_punch_req: bool = false
var mobile_yeet_req: bool = false

const GRAVITY = 24.0

func _ready() -> void:
	add_to_group("sumo_players")
	add_to_group("players")
	team_color = SumoGameManager.TEAM_COLORS[player_id - 1]
	_build_wobbly_bean_model()
	_setup_particles()
	
	col_shape = CollisionShape3D.new()
	var cap = CapsuleShape3D.new()
	cap.radius = 0.55
	cap.height = 1.35
	col_shape.shape = cap
	col_shape.position.y = 0.65
	add_child(col_shape)
	
	if SumoGameManager.has_signal("wave_advanced"):
		SumoGameManager.wave_advanced.connect(_on_wave_advanced)

func _on_wave_advanced(_wave: int) -> void:
	if is_ai and is_eliminated and SumoGameManager.lives[player_id - 1] > 0:
		respawn_for_wave()

func respawn_for_wave() -> void:
	is_eliminated = false
	visible = true
	if col_shape:
		col_shape.disabled = false
	collision_layer = 1
	collision_mask = 1
	set_physics_process(true)
	state = State.FALLING_RESPAWN
	parachute_mesh.visible = true
	global_position = Vector3(randf_range(-4, 4), 16.0, randf_range(-4, 4))
	velocity = Vector3(0, -5.0, 0)
	stars_root.visible = false
	body_root.rotation = Vector3.ZERO

func _build_wobbly_bean_model() -> void:
	body_root = Node3D.new()
	body_root.name = "Model"
	add_child(body_root)
	
	var mat = StandardMaterial3D.new()
	var skin_tex = "res://assets/textures/characters/bean_skin_p%d.png" % player_id
	if ResourceLoader.exists(skin_tex):
		mat.albedo_texture = load(skin_tex)
	else:
		mat.albedo_color = team_color
	mat.roughness = 0.35
	mat.emission_enabled = true
	mat.emission = team_color
	mat.emission_energy_multiplier = 0.2
	
	# Thân hạt đậu mập mạp (Bean Body)
	bean_mesh = MeshInstance3D.new()
	var cap_m = CapsuleMesh.new()
	cap_m.radius = 0.5
	cap_m.height = 1.25
	bean_mesh.mesh = cap_m
	bean_mesh.position.y = 0.65
	bean_mesh.material_override = mat
	body_root.add_child(bean_mesh)
	
	# Mắt to tròn Googly Eyes
	var eye_mat = StandardMaterial3D.new()
	eye_mat.albedo_color = Color.WHITE
	
	var pupil_mat = StandardMaterial3D.new()
	pupil_mat.albedo_color = Color.BLACK
	
	eye_left = MeshInstance3D.new()
	var esph = SphereMesh.new()
	esph.radius = 0.14
	esph.height = 0.28
	eye_left.mesh = esph
	eye_left.position = Vector3(-0.2, 0.95, 0.42)
	eye_left.material_override = eye_mat
	body_root.add_child(eye_left)
	
	var pupil_l = MeshInstance3D.new()
	var psph = SphereMesh.new()
	psph.radius = 0.07
	psph.height = 0.14
	pupil_l.mesh = psph
	pupil_l.position = Vector3(-0.2, 0.95, 0.54)
	pupil_l.material_override = pupil_mat
	body_root.add_child(pupil_l)
	
	eye_right = MeshInstance3D.new()
	eye_right.mesh = esph
	eye_right.position = Vector3(0.2, 0.95, 0.42)
	eye_right.material_override = eye_mat
	body_root.add_child(eye_right)
	
	var pupil_r = MeshInstance3D.new()
	pupil_r.mesh = psph
	pupil_r.position = Vector3(0.2, 0.95, 0.54)
	pupil_r.material_override = pupil_mat
	body_root.add_child(pupil_r)
	
	# Găng tay đấm boxing lò xo khổng lồ (Oversized Boxing Gloves)
	var glove_mat = StandardMaterial3D.new()
	var glove_tex = "res://assets/textures/characters/glove_leather.png"
	if ResourceLoader.exists(glove_tex):
		glove_mat.albedo_texture = load(glove_tex)
	else:
		glove_mat.albedo_color = Color(1.0, 0.15, 0.2)
	glove_mat.roughness = 0.3
	glove_mat.emission_enabled = true
	glove_mat.emission = Color(0.9, 0.15, 0.2)
	glove_mat.emission_energy_multiplier = 0.25
	
	var g_mesh = SphereMesh.new()
	g_mesh.radius = 0.24
	g_mesh.height = 0.48
	
	glove_left = Node3D.new()
	glove_left.position = Vector3(-0.55, 0.65, 0.2)
	var gm_l = MeshInstance3D.new()
	gm_l.mesh = g_mesh
	gm_l.material_override = glove_mat
	glove_left.add_child(gm_l)
	body_root.add_child(glove_left)
	
	glove_right = Node3D.new()
	glove_right.position = Vector3(0.55, 0.65, 0.2)
	var gm_r = MeshInstance3D.new()
	gm_r.mesh = g_mesh
	gm_r.material_override = glove_mat
	glove_right.add_child(gm_r)
	body_root.add_child(glove_right)
	
	# Ngôi sao quay quanh đầu khi bị choáng
	stars_root = Node3D.new()
	stars_root.position = Vector3(0, 1.45, 0)
	stars_root.visible = false
	for i in range(3):
		var star = MeshInstance3D.new()
		var s_box = BoxMesh.new()
		s_box.size = Vector3(0.12, 0.12, 0.12)
		star.mesh = s_box
		var s_mat = StandardMaterial3D.new()
		s_mat.albedo_color = Color(1.0, 0.9, 0.1)
		s_mat.emission_enabled = true
		s_mat.emission = Color(1.0, 0.8, 0.1)
		star.material_override = s_mat
		star.position = Vector3(cos(i * TAU / 3.0) * 0.4, 0, sin(i * TAU / 3.0) * 0.4)
		stars_root.add_child(star)
	body_root.add_child(stars_root)
	
	# Dù hạ cánh khi hồi sinh
	parachute_mesh = MeshInstance3D.new()
	var para = CylinderMesh.new()
	para.top_radius = 1.3
	para.bottom_radius = 0.3
	para.height = 0.45
	parachute_mesh.mesh = para
	parachute_mesh.position = Vector3(0, 2.3, 0)
	var para_mat = StandardMaterial3D.new()
	var para_tex = "res://assets/textures/characters/parachute_pattern.png"
	if ResourceLoader.exists(para_tex):
		para_mat.albedo_texture = load(para_tex)
	else:
		para_mat.albedo_color = Color(1.0, 0.8, 0.2)
	parachute_mesh.material_override = para_mat
	parachute_mesh.visible = false
	add_child(parachute_mesh)

func _setup_particles() -> void:
	# 1. Hit Spark Particles (Tia lửa sao tóe ra khi trúng đòn)
	hit_sparks = CPUParticles3D.new()
	hit_sparks.emitting = false
	hit_sparks.one_shot = true
	hit_sparks.explosiveness = 0.95
	hit_sparks.amount = 14
	hit_sparks.lifetime = 0.35
	hit_sparks.emission_shape = CPUParticles3D.EMISSION_SHAPE_SPHERE
	hit_sparks.emission_sphere_radius = 0.25
	hit_sparks.direction = Vector3.UP
	hit_sparks.spread = 180.0
	hit_sparks.initial_velocity_min = 4.0
	hit_sparks.initial_velocity_max = 9.0
	hit_sparks.scale_amount_min = 0.35
	hit_sparks.scale_amount_max = 0.7
	var h_quad = QuadMesh.new()
	h_quad.size = Vector2(0.5, 0.5)
	var h_mat = StandardMaterial3D.new()
	h_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	h_mat.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	h_mat.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	var star_tex = "res://assets/textures/particles/hit_star.png"
	if ResourceLoader.exists(star_tex):
		h_mat.albedo_texture = load(star_tex)
	h_quad.material = h_mat
	hit_sparks.mesh = h_quad
	hit_sparks.position.y = 0.75
	add_child(hit_sparks)
	
	# 2. Dust Trail Particles (Khói bụi tung bay dưới chân khi chạy & húc)
	dust_particles = CPUParticles3D.new()
	dust_particles.emitting = false
	dust_particles.amount = 8
	dust_particles.lifetime = 0.3
	dust_particles.emission_shape = CPUParticles3D.EMISSION_SHAPE_SPHERE
	dust_particles.emission_sphere_radius = 0.2
	dust_particles.direction = Vector3(0, 0.4, 1.0)
	dust_particles.initial_velocity_min = 0.8
	dust_particles.initial_velocity_max = 2.2
	var d_quad = QuadMesh.new()
	d_quad.size = Vector2(0.45, 0.45)
	var d_mat = StandardMaterial3D.new()
	d_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	d_mat.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	var dust_tex = "res://assets/textures/particles/dust_puff.png"
	if ResourceLoader.exists(dust_tex):
		d_mat.albedo_texture = load(dust_tex)
	d_quad.material = d_mat
	dust_particles.mesh = d_quad
	dust_particles.position.y = 0.05
	add_child(dust_particles)

func _physics_process(delta: float) -> void:
	if is_eliminated:
		return
		
	if punch_cooldown > 0.0: punch_cooldown -= delta
	if dash_cooldown > 0.0: dash_cooldown -= delta
	
	# Kiểm tra rơi khỏi sàn đấu (Ring Out)
	if global_position.y < -4.0 and state != State.FALLING_RESPAWN:
		_trigger_ring_out()
		return
		
	match state:
		State.NORMAL:
			_process_normal_state(delta)
		State.STUNNED:
			_process_stunned_state(delta)
		State.HELD:
			_process_held_state(delta)
		State.FALLING_RESPAWN:
			_process_respawn_state(delta)
			
	move_and_slide()
	
	if dust_particles:
		dust_particles.emitting = (velocity.length() > 2.0 and is_on_floor() and state == State.NORMAL)

func _process_normal_state(delta: float) -> void:
	if not is_on_floor():
		velocity.y -= GRAVITY * delta
	else:
		velocity.y = 0.0
		
	if is_dashing:
		dash_timer -= delta
		if dash_timer <= 0.0:
			is_dashing = false
			current_speed = base_speed
			
	# Di chuyển & Điều khiển
	var input_vec = Vector2.ZERO
	if is_ai:
		input_vec = _calculate_ai_behavior(delta)
	else:
		if mobile_move_vec.length() > 0.1:
			input_vec = mobile_move_vec
		else:
			var prefix = "p%d_" % player_id
			if Input.is_action_pressed(prefix + "left"): input_vec.x -= 1.0
			if Input.is_action_pressed(prefix + "right"): input_vec.x += 1.0
			if Input.is_action_pressed(prefix + "up"): input_vec.y -= 1.0
			if Input.is_action_pressed(prefix + "down"): input_vec.y += 1.0
			
		# Bấm nút ĐẤM (Space / Enter / Mobile)
		var prefix_act = "p%d_dash" % player_id
		if Input.is_action_just_pressed(prefix_act) or mobile_punch_req:
			mobile_punch_req = false
			trigger_spring_punch()
			
		# Bấm nút NÉM / HÚC ĐẦU (F / Shift / Mobile)
		if Input.is_key_pressed(KEY_F) or Input.is_key_pressed(KEY_SHIFT) or mobile_yeet_req:
			mobile_yeet_req = false
			trigger_yeet_or_headbutt()
			
	if input_vec.length() > 1.0:
		input_vec = input_vec.normalized()
		
	var move_dir = Vector3(input_vec.x, 0, input_vec.y)
	if move_dir.length() > 0.1:
		velocity.x = move_dir.x * current_speed
		velocity.z = move_dir.z * current_speed
		
		var target_ang = atan2(move_dir.x, move_dir.z)
		rotation.y = lerp_angle(rotation.y, target_ang, 14.0 * delta)
		
		walk_time += delta * 14.0
		body_root.position.y = abs(sin(walk_time)) * 0.12
		body_root.rotation.z = sin(walk_time) * 0.1
	else:
		velocity.x = move_toward(velocity.x, 0.0, 22.0 * delta)
		velocity.z = move_toward(velocity.z, 0.0, 22.0 * delta)
		body_root.position.y = move_toward(body_root.position.y, 0.0, 5.0 * delta)
		body_root.rotation.z = move_toward(body_root.rotation.z, 0.0, 5.0 * delta)

func trigger_spring_punch() -> void:
	if punch_cooldown > 0.0:
		return
	punch_cooldown = 0.32
	
	# Vung găng đấm lò xo vươn dài ra trước
	var forward_dir = -transform.basis.z.normalized()
	glove_left.position.z = 0.95
	glove_right.position.z = 0.95
	var tw = create_tween()
	tw.tween_property(glove_left, "position:z", 0.2, 0.18)
	tw.parallel().tween_property(glove_right, "position:z", 0.2, 0.18)
	
	# Kiểm tra va chạm với đối thủ trong tầm 2.0m
	var targets = get_tree().get_nodes_in_group("sumo_players")
	for opp in targets:
		if opp != self and opp is Node3D and opp.visible:
			var diff = opp.global_position - global_position
			if diff.length() < 2.0 and diff.dot(forward_dir) > 0.3:
				_land_punch_on(opp, forward_dir)

func _land_punch_on(opp: Node3D, dir: Vector3) -> void:
	SumoSoundManager.play_sfx("punch_heavy", randf_range(1.0, 1.25))
	SumoGameManager.register_knockdown(player_id)
	
	if hit_sparks:
		hit_sparks.restart()
		hit_sparks.emitting = true
		
	var impulse = dir.normalized() * 22.0 + Vector3.UP * 8.0
	if opp.has_method("take_hit_and_stun"):
		opp.take_hit_and_stun(impulse, player_id)

func trigger_yeet_or_headbutt() -> void:
	# 1. Nếu đang vác đối thủ trên đầu -> NÉM BAY RA XA (YEET!)
	if grabbed_target and is_instance_valid(grabbed_target):
		_execute_yeet_throw()
		return
		
	# 2. Nếu đứng cạnh một đối thủ đang bị choáng -> NHẤC BỔNG LÊN ĐẦU
	var nearby_stunned = _find_nearby_stunned_opponent()
	if nearby_stunned:
		_grab_opponent(nearby_stunned)
		return
		
	# 3. Nếu không gần ai -> HÚC ĐẦU PHẢN LỰC (HEADBUTT DASH)
	if dash_cooldown <= 0.0:
		dash_cooldown = 1.2
		is_dashing = true
		dash_timer = 0.28
		current_speed = base_speed * 2.2
		SumoSoundManager.play_sfx("dash", 1.2)
		
		# Nhào người ra phía trước
		body_root.rotation.x = -0.4
		var tw = create_tween()
		tw.tween_property(body_root, "rotation:x", 0.0, 0.3)
		if dust_particles:
			dust_particles.restart()
			dust_particles.emitting = true

func _grab_opponent(opp: Node3D) -> void:
	grabbed_target = opp
	if opp.has_method("get_grabbed_by"):
		opp.get_grabbed_by(self)
	SumoSoundManager.play_sfx("yeet_throw", 0.9)

func _execute_yeet_throw() -> void:
	var throw_dir = -transform.basis.z.normalized() + Vector3.UP * 0.4
	SumoSoundManager.play_sfx("yeet_throw", 1.25)
	
	if grabbed_target and is_instance_valid(grabbed_target):
		if grabbed_target.has_method("get_thrown"):
			grabbed_target.get_thrown(throw_dir.normalized() * 28.0, player_id)
			
	grabbed_target = null

func get_grabbed_by(holder: Node3D) -> void:
	state = State.HELD
	held_by_player = holder

func get_thrown(impulse: Vector3, thrower_id: int) -> void:
	state = State.STUNNED
	held_by_player = null
	last_attacker_id = thrower_id
	velocity = impulse
	stun_timer = 1.8

func take_hit_and_stun(impulse: Vector3, attacker_id: int) -> void:
	last_attacker_id = attacker_id
	velocity = impulse
	state = State.STUNNED
	stun_timer = 1.6
	stars_root.visible = true
	if hit_sparks:
		hit_sparks.restart()
		hit_sparks.emitting = true
	SumoSoundManager.play_sfx("stun_dizzy", randf_range(0.9, 1.2))
	
	# Lộn mèo ngã nghiêng (Ragdoll tilt)
	body_root.rotation.x = PI * 0.5
	body_root.rotation.z = randf_range(-0.5, 0.5)

func _process_stunned_state(delta: float) -> void:
	stun_timer -= delta
	stars_root.rotation.y += delta * 12.0
	
	if not is_on_floor():
		velocity.y -= GRAVITY * delta
	else:
		velocity.y = 0.0
		velocity.x = move_toward(velocity.x, 0.0, 12.0 * delta)
		velocity.z = move_toward(velocity.z, 0.0, 12.0 * delta)
		
	# Hồi phục đứng dậy
	if stun_timer <= 0.0:
		state = State.NORMAL
		stars_root.visible = false
		body_root.rotation.x = 0.0
		body_root.rotation.z = 0.0

func _process_held_state(delta: float) -> void:
	if held_by_player and is_instance_valid(held_by_player):
		global_position = held_by_player.global_position + Vector3.UP * 1.65
		rotation = held_by_player.rotation
		velocity = Vector3.ZERO
	else:
		state = State.STUNNED
		stun_timer = 0.5

func _trigger_ring_out() -> void:
	if is_eliminated:
		return
		
	# Clean up any grab relationships
	if grabbed_target and is_instance_valid(grabbed_target):
		if grabbed_target.has_method("get_thrown"):
			grabbed_target.get_thrown(Vector3.UP * 4.0, player_id)
		grabbed_target = null
	if held_by_player and is_instance_valid(held_by_player):
		held_by_player.grabbed_target = null
		held_by_player = null
		
	SumoGameManager.register_ring_out(player_id, last_attacker_id)
	
	# Kiểm tra xem còn mạng không
	if SumoGameManager.lives[player_id - 1] <= 0:
		is_eliminated = true
		visible = false
		set_physics_process(false)
		if col_shape:
			col_shape.disabled = true
		collision_layer = 0
		collision_mask = 0
		global_position = Vector3(0, -999.0, 0)
		return
		
	# Hồi sinh bay dù từ trên trời rơi xuống
	state = State.FALLING_RESPAWN
	parachute_mesh.visible = true
	global_position = Vector3(randf_range(-4, 4), 16.0, randf_range(-4, 4))
	velocity = Vector3(0, -5.0, 0)
	stars_root.visible = false
	body_root.rotation = Vector3.ZERO

func _process_respawn_state(delta: float) -> void:
	velocity.y = -6.0
	if is_on_floor() or global_position.y <= 0.6:
		global_position.y = 0.65
		state = State.NORMAL
		parachute_mesh.visible = false
		velocity = Vector3.ZERO

func _find_nearby_stunned_opponent() -> Node3D:
	var targets = get_tree().get_nodes_in_group("sumo_players")
	for opp in targets:
		if opp != self and opp is Node3D and opp.visible:
			if "state" in opp and opp.state == State.STUNNED:
				if global_position.distance_to(opp.global_position) < 1.8:
					return opp
	return null

func _calculate_ai_behavior(delta: float) -> Vector2:
	ai_decision_timer -= delta
	if ai_decision_timer <= 0.0:
		ai_decision_timer = randf_range(0.25, 0.5)
		ai_target = _find_nearest_alive_opponent()
		
	# Nếu đang giữ người -> Đi ra mép sàn rồi NÉM!
	if grabbed_target:
		var edge_dir = (global_position - Vector3.ZERO).normalized()
		if global_position.length() > 6.5:
			trigger_yeet_or_headbutt()
		return Vector2(edge_dir.x, edge_dir.z).normalized()
		
	# Nếu có đối thủ bị choáng gần đây -> Chạy tới nhặt!
	var stunned_near = _find_nearby_stunned_opponent()
	if stunned_near:
		var s_diff = stunned_near.global_position - global_position
		if s_diff.length() < 1.6:
			trigger_yeet_or_headbutt()
		return Vector2(s_diff.x, s_diff.z).normalized()
		
	if not ai_target or not is_instance_valid(ai_target):
		return Vector2.ZERO
		
	var diff = ai_target.global_position - global_position
	var dist = diff.length()
	
	if dist < 2.0:
		trigger_spring_punch()
	elif dist < 4.0 and randf() < 0.2:
		trigger_yeet_or_headbutt() # Húc đầu
		
	# Né không đi quá sát mép đài
	if global_position.length() > 8.5:
		var to_center = -global_position.normalized()
		return Vector2(to_center.x, to_center.z).normalized()
		
	return Vector2(diff.x, diff.z).normalized()

func _find_nearest_alive_opponent() -> Node3D:
	var targets = get_tree().get_nodes_in_group("sumo_players")
	var best: Node3D = null
	var min_d = 999.0
	for opp in targets:
		if opp != self and opp is Node3D and opp.visible and not ("is_eliminated" in opp and opp.is_eliminated):
			var d = global_position.distance_to(opp.global_position)
			if d < min_d:
				min_d = d
				best = opp
	return best
