extends CharacterBody3D
class_name SplatPlayer3D

## SplatPlayer3D.gd
## Nhân vật 3D chú gà bắn sơn tấu hài: Bắn đạn sơn, vác hình nhân và tát bay bạn bè

@export var player_id: int = 1 # 1: P1 (Đỏ), 2: P2 (Xanh)
@export var is_ai_bot: bool = false
@export var custom_mesh: Mesh = null

const SPEED = 9.0
const JUMP_VELOCITY = 10.0
const GRAVITY = 22.0

var carried_mannequin: Mannequin3D = null
var shoot_cooldown: float = 0.0
var slap_cooldown: float = 0.0
var stun_timer: float = 0.0
var walk_anim: float = 0.0

var body_mesh: MeshInstance3D
var eye_left: MeshInstance3D
var eye_right: MeshInstance3D
var paint_backpack: MeshInstance3D
var stars_container: Node3D

func _ready() -> void:
	add_to_group("players")
	_build_procedural_chubby_chicken()
	
	var col = CollisionShape3D.new()
	var cap = CapsuleShape3D.new()
	cap.radius = 0.45
	cap.height = 1.3
	col.shape = cap
	col.position.y = 0.65
	add_child(col)

func _build_procedural_chubby_chicken() -> void:
	var root_vis = Node3D.new()
	root_vis.name = "Visuals"
	add_child(root_vis)
	
	# Vật liệu màu đội
	var team_color = Color(1.0, 0.28, 0.38) if player_id == 1 else Color(0.18, 0.78, 1.0)
	var body_mat = StandardMaterial3D.new()
	body_mat.albedo_color = team_color
	body_mat.roughness = 0.3
	
	# Thân hình cầu mập mạp
	body_mesh = MeshInstance3D.new()
	var sph = SphereMesh.new()
	sph.radius = 0.48
	sph.height = 1.0
	body_mesh.mesh = sph
	body_mesh.position.y = 0.6
	body_mesh.material_override = body_mat
	root_vis.add_child(body_mesh)
	
	# Mào gà đỏ
	var comb = MeshInstance3D.new()
	var box = BoxMesh.new()
	box.size = Vector3(0.1, 0.25, 0.35)
	comb.mesh = box
	comb.position = Vector3(0, 1.15, 0.05)
	var comb_mat = StandardMaterial3D.new()
	comb_mat.albedo_color = Color(0.95, 0.15, 0.15)
	comb.material_override = comb_mat
	root_vis.add_child(comb)
	
	# Mỏ gà vàng nhọn
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
	
	# Mắt to tròn Googly Eyes
	var eye_mat = StandardMaterial3D.new()
	eye_mat.albedo_color = Color.WHITE
	var pupil_mat = StandardMaterial3D.new()
	pupil_mat.albedo_color = Color.BLACK
	
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
	
	# Ba lô bình sơn sau lưng
	paint_backpack = MeshInstance3D.new()
	var pack_cyl = CylinderMesh.new()
	pack_cyl.top_radius = 0.16
	pack_cyl.bottom_radius = 0.16
	pack_cyl.height = 0.45
	paint_backpack.mesh = pack_cyl
	paint_backpack.position = Vector3(0, 0.65, -0.42)
	paint_backpack.material_override = body_mat
	root_vis.add_child(paint_backpack)
	
	# Ngôi sao quay quanh đầu khi bị tát
	stars_container = Node3D.new()
	stars_container.position.y = 1.4
	stars_container.visible = false
	root_vis.add_child(stars_container)
	for i in range(3):
		var star = MeshInstance3D.new()
		var star_sph = SphereMesh.new()
		star_sph.radius = 0.07
		star_sph.height = 0.14
		star.mesh = star_sph
		var smat = StandardMaterial3D.new()
		smat.albedo_color = Color(1.0, 0.9, 0.1)
		smat.emission_enabled = true
		smat.emission = Color(1.0, 0.9, 0.1)
		star.material_override = smat
		star.position = Vector3(cos(i * 2.09) * 0.35, 0, sin(i * 2.09) * 0.35)
		stars_container.add_child(star)

func _physics_process(delta: float) -> void:
	if shoot_cooldown > 0: shoot_cooldown -= delta
	if slap_cooldown > 0: slap_cooldown -= delta
	
	# Choáng khi bị tát
	if stun_timer > 0:
		stun_timer -= delta
		stars_container.visible = true
		stars_container.rotation.y += delta * 15.0
		velocity.x = move_toward(velocity.x, 0, 10.0 * delta)
		velocity.z = move_toward(velocity.z, 0, 10.0 * delta)
		if not is_on_floor():
			velocity.y -= GRAVITY * delta
		move_and_slide()
		return
	else:
		stars_container.visible = false

	# Trọng lực
	if not is_on_floor():
		velocity.y -= GRAVITY * delta

	# Xử lý input hoặc AI Bot
	var input_dir = Vector3.ZERO
	if is_ai_bot or (player_id == 2 and not GameManager3D.is_two_player):
		input_dir = _process_ai_bot(delta)
	else:
		input_dir = _get_player_input()

	if input_dir.length() > 0.1:
		walk_anim += delta * 16.0
		velocity.x = input_dir.x * SPEED
		velocity.z = input_dir.z * SPEED
		
		# Hướng mặt theo chuyển động
		var target_rot = atan2(input_dir.x, input_dir.z)
		rotation.y = lerp_angle(rotation.y, target_rot, 14.0 * delta)
		
		# Hoạt ảnh nhún lò xo
		body_mesh.scale = Vector3(1.0 + sin(walk_anim) * 0.1, 1.0 - sin(walk_anim) * 0.1, 1.0)
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED * 8.0 * delta)
		velocity.z = move_toward(velocity.z, 0, SPEED * 8.0 * delta)
		body_mesh.scale = body_mesh.scale.lerp(Vector3.ONE, 10.0 * delta)

	move_and_slide()
	
	# Cập nhật vị trí hình nhân đang vác trên đầu
	if carried_mannequin and is_instance_valid(carried_mannequin):
		carried_mannequin.global_position = global_position + Vector3.UP * 1.6 + Vector3.FORWARD.rotated(Vector3.UP, rotation.y) * 0.3

func _get_player_input() -> Vector3:
	var prefix = "p1_" if player_id == 1 else "p2_"
	var dir = Vector3.ZERO
	if Input.is_action_pressed(prefix + "right"): dir.x += 1
	if Input.is_action_pressed(prefix + "left"): dir.x -= 1
	if Input.is_action_pressed(prefix + "down"): dir.z += 1
	if Input.is_action_pressed(prefix + "up"): dir.z -= 1
	dir = dir.normalized()
	
	if Input.is_action_just_pressed(prefix + "shoot"):
		shoot_paint()
	if Input.is_action_just_pressed(prefix + "slap"):
		slap_bonk()
	if Input.is_action_just_pressed(prefix + "grab"):
		toggle_grab()
		
	return dir

func _process_ai_bot(delta: float) -> Vector3:
	# AI Bot: Tự tìm hình nhân chưa đủ màu để bắn và vác
	var target = _find_ai_target()
	if not target:
		return Vector3.ZERO
		
	var diff = target.global_position - global_position
	diff.y = 0
	var dist = diff.length()
	var dir = diff.normalized()
	
	if dist > 3.5:
		return dir
	else:
		# Đủ gần: Bắn sơn liên tục
		rotation.y = atan2(dir.x, dir.z)
		if shoot_cooldown <= 0:
			shoot_paint()
		if target is Mannequin3D and target.is_fully_painted and not carried_mannequin:
			toggle_grab()
		return Vector3.ZERO

func _find_ai_target() -> Node3D:
	var dummies = get_tree().get_nodes_in_group("mannequins")
	for d in dummies:
		if d is Mannequin3D and not d.is_carried:
			return d
	return null

func shoot_paint() -> void:
	if shoot_cooldown > 0: return
	shoot_cooldown = 0.18
	
	SoundManager3D.play_sfx("splat", randf_range(1.1, 1.4))
	
	var bullet = PaintProjectile3D.new()
	get_parent().add_child(bullet)
	var forward = Vector3.FORWARD.rotated(Vector3.UP, rotation.y)
	bullet.global_position = global_position + Vector3.UP * 0.7 + forward * 0.7
	var team = "red" if player_id == 1 else "blue"
	bullet.setup(forward, team, player_id)

func slap_bonk() -> void:
	if slap_cooldown > 0: return
	slap_cooldown = 0.45
	
	SoundManager3D.play_sfx("bonk", 1.0)
	
	# Animation tát vung người
	var tween = create_tween()
	tween.tween_property(self, "rotation_degrees:y", rotation_degrees.y + 45.0, 0.1)
	tween.tween_property(self, "rotation_degrees:y", rotation_degrees.y - 45.0, 0.15)
	
	# Kiểm tra mục tiêu trong tầm tát phía trước
	var forward = Vector3.FORWARD.rotated(Vector3.UP, rotation.y)
	var slap_pos = global_position + forward * 1.8 + Vector3.UP * 0.7
	
	# Tát hình nhân
	var dummies = get_tree().get_nodes_in_group("mannequins")
	for d in dummies:
		if d is Mannequin3D and d.global_position.distance_to(slap_pos) < 2.2:
			d.apply_paint("red" if player_id == 1 else "blue", 40.0, player_id)
			d.take_slap(forward * 12.0 + Vector3.UP * 4.0)
			
	# TÁT LỘN CỔ BẠN BÈ (Viral co-op / versus feature)
	var players = get_tree().get_nodes_in_group("players")
	for p in players:
		if p is SplatPlayer3D and p != self and p.global_position.distance_to(slap_pos) < 2.4:
			GameManager3D.register_friendly_slap(player_id)
			p.take_paint_slap("red" if player_id == 1 else "blue", forward * 16.0 + Vector3.UP * 9.0, player_id)

func take_paint_slap(team: String, impulse: Vector3, from_player: int) -> void:
	SoundManager3D.play_sfx("bonk", 0.8)
	stun_timer = 0.8
	velocity = impulse
	
	# Làm rơi hình nhân đang vác
	if carried_mannequin:
		carried_mannequin.is_carried = false
		carried_mannequin.velocity = impulse * 0.5
		carried_mannequin = null

func toggle_grab() -> void:
	if carried_mannequin:
		# NÉM HÌNH NHÂN VỀ PHÍA TRƯỚC VÀO CỔNG GIAO HÀNG
		var forward = Vector3.FORWARD.rotated(Vector3.UP, rotation.y)
		carried_mannequin.is_carried = false
		carried_mannequin.velocity = forward * 16.0 + Vector3.UP * 7.0
		SoundManager3D.play_sfx("bonk", 1.2)
		carried_mannequin = null
	else:
		# TÌM HÌNH NHÂN GẦN NHẤT ĐỂ VÁC LÊN ĐẦU
		var dummies = get_tree().get_nodes_in_group("mannequins")
		for d in dummies:
			if d is Mannequin3D and not d.is_carried and d.global_position.distance_to(global_position) < 2.4:
				carried_mannequin = d
				d.is_carried = true
				SoundManager3D.play_sfx("order_success", 1.4)
				break
