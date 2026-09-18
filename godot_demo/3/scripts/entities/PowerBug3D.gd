extends Area3D

## PowerBug3D.gd
## Bọ phát sáng siêu năng lực: Lượn lờ trong đấu trường, khi bị tắc kè nuốt sẽ ban buff khủng

enum BugType {
	FIRE,      # Lưỡi rồng lửa
	DIAMOND,   # Đại bác khổng lồ
	RAINBOW,   # Lưỡi quét 360 độ
	SPEED      # Siêu tốc độ
}

var bug_type: BugType = BugType.FIRE
var hover_time: float = 0.0
var base_y: float = 1.2
var bug_mesh: MeshInstance3D
var bug_mat: StandardMaterial3D

func _ready() -> void:
	add_to_group("power_bugs")
	body_entered.connect(_on_body_entered)
	
	bug_type = BugType.values().pick_random()
	_build_visuals()

func _build_visuals() -> void:
	var col = CollisionShape3D.new()
	var sph = SphereShape3D.new()
	sph.radius = 0.6
	col.shape = sph
	add_child(col)
	
	bug_mat = StandardMaterial3D.new()
	bug_mat.emission_enabled = true
	bug_mat.emission_energy_multiplier = 1.5
	
	match bug_type:
		BugType.FIRE:
			bug_mat.albedo_color = Color(1.0, 0.3, 0.1)
			bug_mat.emission = Color(1.0, 0.4, 0.1)
		BugType.DIAMOND:
			bug_mat.albedo_color = Color(0.2, 0.8, 1.0)
			bug_mat.emission = Color(0.1, 0.9, 1.0)
		BugType.RAINBOW:
			bug_mat.albedo_color = Color(1.0, 0.2, 0.9)
			bug_mat.emission = Color(1.0, 0.3, 0.8)
		BugType.SPEED:
			bug_mat.albedo_color = Color(1.0, 0.9, 0.1)
			bug_mat.emission = Color(1.0, 0.9, 0.2)

	bug_mesh = MeshInstance3D.new()
	var msph = SphereMesh.new()
	msph.radius = 0.3
	msph.height = 0.45
	bug_mesh.mesh = msph
	bug_mesh.material_override = bug_mat
	add_child(bug_mesh)
	
	# Đôi cánh phát sáng vẫy liên tục
	var wings = MeshInstance3D.new()
	var wbox = BoxMesh.new()
	wbox.size = Vector3(0.65, 0.05, 0.25)
	wings.mesh = wbox
	wings.position.y = 0.15
	wings.material_override = bug_mat
	add_child(wings)

func _process(delta: float) -> void:
	hover_time += delta * 4.0
	position.y = base_y + sin(hover_time) * 0.35
	rotation.y += delta * 2.5
	
	# Nhấp nháy độ sáng
	if bug_mat:
		bug_mat.emission_energy_multiplier = 1.2 + sin(hover_time * 2.0) * 0.6

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("chameleons") and body.has_method("grant_bug_power"):
		body.grant_bug_power(bug_type)
		ChameleonSoundManager.play_sfx("powerup", 1.2)
		queue_free()
