extends Area3D
class_name BounceTrampoline3D

## BounceTrampoline3D.gd
## Bục nhún lò xo 3D bật tung nhân vật và đàn hình nhân lên trời cao

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	_build_visuals()

func _build_visuals() -> void:
	var col = CollisionShape3D.new()
	var cshape = CylinderShape3D.new()
	cshape.radius = 1.6
	cshape.height = 0.8
	col.shape = cshape
	col.position.y = 0.4
	add_child(col)
	
	var mesh_inst = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.top_radius = 1.6
	cyl.bottom_radius = 1.6
	cyl.height = 0.25
	mesh_inst.mesh = cyl
	mesh_inst.position.y = 0.12
	
	var mat = StandardMaterial3D.new()
	mat.albedo_color = Color(0.2, 0.85, 1.0)
	mat.emission_enabled = true
	mat.emission = Color(0.1, 0.7, 1.0)
	mat.emission_energy_multiplier = 0.8
	mesh_inst.material_override = mat
	add_child(mesh_inst)

func _on_body_entered(body: Node) -> void:
	if body is CharacterBody3D:
		var cb = body as CharacterBody3D
		cb.velocity.y = 16.0
		CongaSoundManager3D.play_sfx("boing", randf_range(0.9, 1.2))
		
		scale = Vector3(1.3, 0.4, 1.3)
		var tw = create_tween()
		tw.tween_property(self, "scale", Vector3.ONE, 0.25)
