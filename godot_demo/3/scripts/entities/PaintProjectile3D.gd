extends Area3D
class_name PaintProjectile3D

## PaintProjectile3D.gd
## Viên đạn sơn 3D bay theo đường đạn và phát nổ khi va chạm hình nhân

@export var speed: float = 24.0
@export var projectile_gravity: float = 9.8
@export var color_team: String = "red" # "red" hoặc "blue"
@export var shooter_id: int = 1

var velocity_3d: Vector3 = Vector3.ZERO
var lifetime: float = 1.6

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)
	
	# Tạo hình cầu 3D hiển thị đạn sơn
	var mesh_inst = MeshInstance3D.new()
	var sphere = SphereMesh.new()
	sphere.radius = 0.22
	sphere.height = 0.44
	mesh_inst.mesh = sphere
	
	var mat = StandardMaterial3D.new()
	if color_team == "red":
		mat.albedo_color = Color(1.0, 0.25, 0.35)
		mat.emission_enabled = true
		mat.emission = Color(1.0, 0.2, 0.2)
		mat.emission_energy_multiplier = 1.2
	else:
		mat.albedo_color = Color(0.15, 0.75, 1.0)
		mat.emission_enabled = true
		mat.emission = Color(0.1, 0.6, 1.0)
		mat.emission_energy_multiplier = 1.2
	mesh_inst.material_override = mat
	add_child(mesh_inst)

func setup(dir: Vector3, team: String, shooter: int) -> void:
	velocity_3d = dir.normalized() * speed + Vector3.UP * 2.0
	color_team = team
	shooter_id = shooter

func _physics_process(delta: float) -> void:
	velocity_3d.y -= projectile_gravity * delta
	global_position += velocity_3d * delta
	
	lifetime -= delta
	if lifetime <= 0.0:
		queue_free()

func _on_body_entered(body: Node) -> void:
	if body.has_method("apply_paint"):
		body.apply_paint(color_team, 25.0, shooter_id)
		_explode_splat()
	elif body.has_method("take_paint_slap") and body.get("player_id") != shooter_id:
		body.take_paint_slap(color_team, velocity_3d.normalized() * 5.0, shooter_id)
		_explode_splat()
	elif not body is SplatPlayer3D:
		_explode_splat()

func _on_area_entered(area: Node) -> void:
	if area.has_method("apply_paint"):
		area.apply_paint(color_team, 25.0, shooter_id)
		_explode_splat()

func _explode_splat() -> void:
	SoundManager3D.play_sfx("splat", randf_range(0.9, 1.3))
	# Tự hủy sau khi trúng mục tiêu
	queue_free()
