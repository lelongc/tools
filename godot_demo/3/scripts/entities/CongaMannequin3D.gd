extends CharacterBody3D
class_name CongaMannequin3D

## CongaMannequin3D.gd
## Hình nhân ma-nơ-canh 3D: Nối đuôi uốn éo tạo thành cây roi khổng lồ và quất bay đối thủ

enum MannequinState {
	FREE,
	LINKED,
	SCATTERED
}

@export var custom_mesh: Mesh = null

var state: MannequinState = MannequinState.FREE
var owner_player: Node3D = null
var follow_target: Node3D = null
var team_color: Color = Color(0.95, 0.95, 0.95)
var current_team_id: int = 0

var wander_dir: Vector3 = Vector3.ZERO
var wander_timer: float = 0.0
var scatter_velocity: Vector3 = Vector3.ZERO
var jiggle_timer: float = 0.0

var mannequin_mat: StandardMaterial3D
var body_root: Node3D

const FOLLOW_DISTANCE = 1.45
const GRAVITY = 18.0

func _ready() -> void:
	add_to_group("mannequins")
	_build_3d_mannequin_model()
	
	var col = CollisionShape3D.new()
	var cap = CapsuleShape3D.new()
	cap.radius = 0.35
	cap.height = 1.3
	col.shape = cap
	col.position.y = 0.65
	add_child(col)
	
	wander_dir = Vector3(randf_range(-1, 1), 0, randf_range(-1, 1)).normalized()
	wander_timer = randf_range(1.0, 3.0)

func _build_3d_mannequin_model() -> void:
	body_root = Node3D.new()
	body_root.name = "Model"
	add_child(body_root)
	
	mannequin_mat = StandardMaterial3D.new()
	mannequin_mat.albedo_color = team_color
	mannequin_mat.roughness = 0.35
	
	# Thân (Cylinder)
	var torso = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.top_radius = 0.24
	cyl.bottom_radius = 0.18
	cyl.height = 0.55
	torso.mesh = cyl
	torso.position.y = 0.6
	torso.material_override = mannequin_mat
	body_root.add_child(torso)
	
	# Đầu (Sphere)
	var head = MeshInstance3D.new()
	var sph = SphereMesh.new()
	sph.radius = 0.2
	sph.height = 0.4
	head.mesh = sph
	head.position.y = 1.05
	head.material_override = mannequin_mat
	body_root.add_child(head)
	
	# Hai tay giang rộng T-pose
	var arm_mesh = CapsuleMesh.new()
	arm_mesh.radius = 0.06
	arm_mesh.height = 0.45
	
	var arm_l = MeshInstance3D.new()
	arm_l.mesh = arm_mesh
	arm_l.position = Vector3(-0.35, 0.75, 0)
	arm_l.rotation_degrees.z = 70
	arm_l.material_override = mannequin_mat
	body_root.add_child(arm_l)
	
	var arm_r = MeshInstance3D.new()
	arm_r.mesh = arm_mesh
	arm_r.position = Vector3(0.35, 0.75, 0)
	arm_r.rotation_degrees.z = -70
	arm_r.material_override = mannequin_mat
	body_root.add_child(arm_r)

func _physics_process(delta: float) -> void:
	jiggle_timer += delta * 12.0
	
	if not is_on_floor():
		velocity.y -= GRAVITY * delta
	else:
		velocity.y = 0.0
		
	match state:
		MannequinState.FREE:
			wander_timer -= delta
			if wander_timer <= 0:
				wander_dir = Vector3(randf_range(-1, 1), 0, randf_range(-1, 1)).normalized()
				wander_timer = randf_range(1.5, 3.5)
			velocity.x = wander_dir.x * 1.8
			velocity.z = wander_dir.z * 1.8
			if wander_dir.length() > 0.1:
				rotation.y = lerp_angle(rotation.y, atan2(wander_dir.x, wander_dir.z), 6.0 * delta)
				
		MannequinState.LINKED:
			if follow_target and is_instance_valid(follow_target):
				var diff = follow_target.global_position - global_position
				diff.y = 0
				var dist = diff.length()
				if dist > FOLLOW_DISTANCE:
					var target_pos = follow_target.global_position - diff.normalized() * FOLLOW_DISTANCE
					global_position.x = lerp(global_position.x, target_pos.x, 20.0 * delta)
					global_position.z = lerp(global_position.z, target_pos.z, 20.0 * delta)
					rotation.y = lerp_angle(rotation.y, atan2(diff.x, diff.z), 18.0 * delta)
					# Nghiêng người lắc lư tấu hài
					body_root.rotation.z = sin(jiggle_timer) * 0.25
			else:
				detach()
				
		MannequinState.SCATTERED:
			velocity.x = scatter_velocity.x
			velocity.z = scatter_velocity.z
			scatter_velocity = scatter_velocity.move_toward(Vector3.ZERO, 15.0 * delta)
			rotation.y += delta * 15.0
			if scatter_velocity.length() < 0.5:
				state = MannequinState.FREE

	move_and_slide()
	
	# Giới hạn trong sàn đấu
	global_position.x = clamp(global_position.x, -14.0, 14.0)
	global_position.z = clamp(global_position.z, -14.0, 14.0)

func link_to(player: Node3D, target: Node3D, color: Color, team_id: int) -> void:
	state = MannequinState.LINKED
	owner_player = player
	follow_target = target
	team_color = color
	current_team_id = team_id
	
	# Cập nhật màu neon phát sáng
	mannequin_mat.albedo_color = color
	mannequin_mat.emission_enabled = true
	mannequin_mat.emission = color
	mannequin_mat.emission_energy_multiplier = 0.8
	
	CongaSoundManager3D.play_sfx("attach", randf_range(1.0, 1.3))
	
	# Nhún nảy 3D
	scale = Vector3(1.3, 0.7, 1.3)
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3.ONE, 0.2)

func detach() -> void:
	state = MannequinState.FREE
	owner_player = null
	follow_target = null
	team_color = Color(0.95, 0.95, 0.95)
	current_team_id = 0
	mannequin_mat.albedo_color = team_color
	mannequin_mat.emission_enabled = false

func take_whip_scatter(impulse: Vector3) -> void:
	detach()
	state = MannequinState.SCATTERED
	scatter_velocity = impulse + Vector3.UP * 4.0
	CongaSoundManager3D.play_sfx("whip_hit", randf_range(1.1, 1.4))
