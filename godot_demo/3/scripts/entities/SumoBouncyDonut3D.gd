extends Area3D

## SumoBouncyDonut3D.gd
## Bánh Donut Bumper nảy bật tưng tưng quanh võ đài Sumo

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	_build_visuals()

func _build_visuals() -> void:
	var col = CollisionShape3D.new()
	var sph = SphereShape3D.new()
	sph.radius = 1.2
	col.shape = sph
	col.position.y = 0.6
	add_child(col)
	
	var mesh_inst = MeshInstance3D.new()
	var torus = TorusMesh.new()
	torus.inner_radius = 0.4
	torus.outer_radius = 1.2
	mesh_inst.mesh = torus
	mesh_inst.position.y = 0.6
	
	var mat = StandardMaterial3D.new()
	var tex_path = "res://assets/textures/arena/donut_albedo.png"
	if ResourceLoader.exists(tex_path):
		mat.albedo_texture = load(tex_path)
		mat.uv1_scale = Vector3(3.0, 3.0, 3.0)
		mat.uv1_triplanar = true
	else:
		mat.albedo_color = Color(1.0, 0.35, 0.75)
	mat.roughness = 0.25
	mat.emission_enabled = true
	mat.emission = Color(1.0, 0.4, 0.7)
	mat.emission_energy_multiplier = 0.25
	mesh_inst.material_override = mat
	add_child(mesh_inst)

func _on_body_entered(body: Node) -> void:
	if body is CharacterBody3D:
		var cb = body as CharacterBody3D
		var bounce_dir = (cb.global_position - global_position).normalized()
		bounce_dir.y = 0.45
		cb.velocity = bounce_dir.normalized() * 26.0
		
		SumoSoundManager.play_sfx("trampoline_bounce", randf_range(0.95, 1.2))
		
		scale = Vector3(1.3, 0.6, 1.3)
		var tw = create_tween()
		tw.tween_property(self, "scale", Vector3.ONE, 0.25)
