extends CharacterBody3D

## ChameleonMannequin3D.gd
## Hình nhân ma-nơ-canh 3D: Tự do -> Bị nuốt xoay quanh bụng tắc kè -> Bắn ra làm đạn pháo nổ dây chuyền Domino

enum State {
	FREE,
	ORBITING,
	PROJECTILE
}

var state: State = State.FREE
var owner_player: Node3D = null
var team_id: int = 0
var team_color: Color = Color(0.92, 0.92, 0.92)

var orbit_angle: float = 0.0
var orbit_radius: float = 1.3
var orbit_speed: float = 4.5

var projectile_velocity: Vector3 = Vector3.ZERO
var projectile_lifetime: float = 0.0

var mesh_inst: MeshInstance3D
var mannequin_mat: StandardMaterial3D
var body_root: Node3D

const GRAVITY = 20.0

func _ready() -> void:
	add_to_group("mannequins")
	_build_visuals()
	
	var col = CollisionShape3D.new()
	var cap = CapsuleShape3D.new()
	cap.radius = 0.38
	cap.height = 1.2
	col.shape = cap
	col.position.y = 0.6
	add_child(col)

func _build_visuals() -> void:
	body_root = Node3D.new()
	body_root.name = "Visuals"
	add_child(body_root)
	
	mannequin_mat = StandardMaterial3D.new()
	mannequin_mat.albedo_color = team_color
	mannequin_mat.roughness = 0.4
	
	# Kiểm tra model 3D custom của người dùng
	if ResourceLoader.exists("res://assets/models/mannequin.glb"):
		var scene = load("res://assets/models/mannequin.glb")
		if scene:
			var inst = scene.instantiate()
			inst.name = "CustomModel"
			body_root.add_child(inst)
			return

	# Dựng hình nhân ma-nơ-canh 3D Procedural chuẩn
	# Thân trên
	var torso = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.top_radius = 0.26
	cyl.bottom_radius = 0.18
	cyl.height = 0.65
	torso.mesh = cyl
	torso.position.y = 0.65
	torso.material_override = mannequin_mat
	body_root.add_child(torso)
	
	# Đầu tròn
	var head = MeshInstance3D.new()
	var sph = SphereMesh.new()
	sph.radius = 0.22
	sph.height = 0.44
	head.mesh = sph
	head.position.y = 1.15
	head.material_override = mannequin_mat
	body_root.add_child(head)
	
	# Khớp tay
	var shoulder = MeshInstance3D.new()
	var sbox = BoxMesh.new()
	sbox.size = Vector3(0.7, 0.14, 0.18)
	shoulder.mesh = sbox
	shoulder.position.y = 0.85
	shoulder.material_override = mannequin_mat
	body_root.add_child(shoulder)

func _physics_process(delta: float) -> void:
	match state:
		State.FREE:
			if not is_on_floor():
				velocity.y -= GRAVITY * delta
			else:
				velocity.y = 0.0
				velocity.x = move_toward(velocity.x, 0.0, 10.0 * delta)
				velocity.z = move_toward(velocity.z, 0.0, 10.0 * delta)
			move_and_slide()
			
		State.ORBITING:
			if not is_instance_valid(owner_player):
				release_to_free()
				return
				
			orbit_angle += orbit_speed * delta
			var center = owner_player.global_position + Vector3.UP * 0.7
			var offset = Vector3(cos(orbit_angle), sin(orbit_angle * 2.0) * 0.2, sin(orbit_angle)) * orbit_radius
			global_position = center + offset
			rotation.y = -orbit_angle
			rotation.z = sin(orbit_angle * 3.0) * 0.3
			
		State.PROJECTILE:
			projectile_lifetime += delta
			var collision = move_and_collide(projectile_velocity * delta)
			body_root.rotation.x += delta * 20.0
			body_root.rotation.y += delta * 15.0
			
			if collision:
				var collider = collision.get_collider()
				_handle_projectile_impact(collider, collision.get_normal())
				
			if projectile_lifetime > 3.0:
				release_to_free()

func start_orbiting(player: Node3D, p_color: Color, p_team: int, index: int, total: int) -> void:
	state = State.ORBITING
	owner_player = player
	team_id = p_team
	team_color = p_color
	orbit_angle = (float(index) / float(maxi(1, total))) * TAU
	orbit_radius = 1.3 + (total * 0.08)
	
	# Đổi màu neon phát sáng rực rỡ
	mannequin_mat.albedo_color = team_color
	mannequin_mat.emission_enabled = true
	mannequin_mat.emission = team_color
	mannequin_mat.emission_energy_multiplier = 1.0
	
	scale = Vector3(1.4, 0.6, 1.4)
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3(0.65, 0.65, 0.65), 0.2)

func launch_as_projectile(dir: Vector3, speed: float) -> void:
	state = State.PROJECTILE
	owner_player = null
	projectile_velocity = dir.normalized() * speed + Vector3.UP * 1.5
	projectile_lifetime = 0.0
	scale = Vector3.ONE * 0.85

func _handle_projectile_impact(collider: Node, normal: Vector3) -> void:
	ChameleonSoundManager.play_sfx("domino_hit", randf_range(1.0, 1.3))
	
	if collider and collider.is_in_group("mannequins") and collider != self:
		# Hiệu ứng nổ dây chuyền Domino!
		if collider.has_method("take_domino_hit"):
			collider.take_domino_hit(projectile_velocity * 0.75, team_color, team_id)
			ChameleonGameManager.register_domino_splat(team_id, 1)
			
	# Nảy bật nhẹ khi chạm tường rồi rơi xuống tự do
	projectile_velocity = projectile_velocity.bounce(normal) * 0.4
	state = State.FREE
	velocity = projectile_velocity
	scale = Vector3.ONE

func take_domino_hit(impact_velocity: Vector3, new_color: Color, new_team: int) -> void:
	team_color = new_color
	team_id = new_team
	mannequin_mat.albedo_color = team_color
	mannequin_mat.emission_enabled = true
	mannequin_mat.emission = team_color
	mannequin_mat.emission_energy_multiplier = 0.8
	
	velocity = impact_velocity + Vector3.UP * 3.5
	
	# Rung lắc nảy hình nhân
	scale = Vector3(1.3, 0.7, 1.3)
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3.ONE, 0.3)

func release_to_free() -> void:
	state = State.FREE
	owner_player = null
	scale = Vector3.ONE
	velocity = Vector3(randf_range(-2, 2), 2.0, randf_range(-2, 2))
