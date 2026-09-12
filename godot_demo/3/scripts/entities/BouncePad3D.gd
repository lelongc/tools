extends Area3D
class_name BouncePad3D

## BouncePad3D.gd
## Bục nhún lò xo 3D: Bật tung người chơi và hình nhân lên trời cao tấu hài

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	_build_visuals()

func _build_visuals() -> void:
	var mesh_inst = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.top_radius = 1.4
	cyl.bottom_radius = 1.4
	cyl.height = 0.25
	mesh_inst.mesh = cyl
	
	var mat = StandardMaterial3D.new()
	mat.albedo_color = Color(1.0, 0.85, 0.1)
	mat.emission_enabled = true
	mat.emission = Color(1.0, 0.7, 0.0)
	mat.emission_energy_multiplier = 0.8
	mesh_inst.material_override = mat
	add_child(mesh_inst)
	
	var col = CollisionShape3D.new()
	var cshape = CylinderShape3D.new()
	cshape.radius = 1.4
	cshape.height = 0.8
	col.shape = cshape
	col.position.y = 0.4
	add_child(col)

func _on_body_entered(body: Node) -> void:
	if body is CharacterBody3D:
		var cb = body as CharacterBody3D
		cb.velocity.y = 17.0
		SoundManager3D.play_sfx("boing", randf_range(0.9, 1.2))
		
		# Nhún nảy bục
		scale = Vector3(1.3, 0.4, 1.3)
		var tween = create_tween()
		tween.tween_property(self, "scale", Vector3.ONE, 0.25)
