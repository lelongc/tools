@tool
extends SceneTree

func _init() -> void:
	print("🎨 BẮT ĐẦU TẠO TOÀN BỘ 3D MODELS GLB CHO LONG NECK RUSH 3D...")
	build_giraffe_body()
	build_giraffe_head()
	build_golden_apple()
	build_spike_trap()
	build_overhead_gate()
	build_finish_tower()
	print("🎉 HOÀN TẤT TẠO TOÀN BỘ 3D MODELS!")
	quit()

func load_tex(res_path: String) -> Texture2D:
	var abs_path = ProjectSettings.globalize_path(res_path)
	if FileAccess.file_exists(abs_path):
		var img = Image.load_from_file(abs_path)
		if img:
			return ImageTexture.create_from_image(img)
	return null

func export_to_glb(node: Node3D, path: String) -> void:
	var gltf = GLTFDocument.new()
	var state = GLTFState.new()
	gltf.append_from_scene(node, state)
	var err = gltf.write_to_filesystem(state, path)
	if err == OK:
		print("✅ Đã xuất GLB thành công:", path)
	else:
		print("❌ Lỗi xuất GLB:", path, err)

# 1. GIRAFFE BODY
func build_giraffe_body() -> void:
	var root = Node3D.new()
	root.name = "GiraffeBody"
	
	var mat_skin = StandardMaterial3D.new()
	var tex = load_tex("res://textures/giraffe_skin.png")
	if tex: mat_skin.albedo_texture = tex
	mat_skin.albedo_color = Color(1.0, 0.75, 0.1)
	mat_skin.uv1_scale = Vector3(2.0, 2.0, 2.0)
	mat_skin.roughness = 0.35
	
	var mat_hoof = StandardMaterial3D.new()
	mat_hoof.albedo_color = Color(0.35, 0.18, 0.08)
	mat_hoof.roughness = 0.4
	
	# Body
	var body = MeshInstance3D.new()
	var box = BoxMesh.new()
	box.size = Vector3(0.95, 0.75, 1.35)
	box.material = mat_skin
	body.mesh = box
	body.position = Vector3(0, 0.4, 0)
	root.add_child(body)
	body.owner = root
	
	# 4 Legs
	var leg_coords = [Vector2(-0.35, -0.42), Vector2(0.35, -0.42), Vector2(-0.35, 0.42), Vector2(0.35, 0.42)]
	for c in leg_coords:
		var leg = MeshInstance3D.new()
		var cyl = CylinderMesh.new()
		cyl.top_radius = 0.12
		cyl.bottom_radius = 0.12
		cyl.height = 0.5
		cyl.material = mat_skin
		leg.mesh = cyl
		leg.position = Vector3(c.x, 0.15, c.y)
		root.add_child(leg)
		leg.owner = root
		
		var hoof = MeshInstance3D.new()
		var h_cyl = CylinderMesh.new()
		h_cyl.top_radius = 0.135
		h_cyl.bottom_radius = 0.135
		h_cyl.height = 0.14
		h_cyl.material = mat_hoof
		hoof.mesh = h_cyl
		hoof.position = Vector3(c.x, -0.12, c.y)
		root.add_child(hoof)
		hoof.owner = root
		
	# Tail
	var tail = MeshInstance3D.new()
	var t_cyl = CylinderMesh.new()
	t_cyl.top_radius = 0.04
	t_cyl.bottom_radius = 0.04
	t_cyl.height = 0.35
	t_cyl.material = mat_skin
	tail.mesh = t_cyl
	tail.position = Vector3(0, 0.35, 0.7)
	tail.rotation_degrees = Vector3(35, 0, 0)
	root.add_child(tail)
	tail.owner = root
	
	var tail_tip = MeshInstance3D.new()
	var s_mesh = SphereMesh.new()
	s_mesh.radius = 0.08
	s_mesh.height = 0.16
	s_mesh.material = mat_hoof
	tail_tip.mesh = s_mesh
	tail_tip.position = Vector3(0, 0.22, 0.82)
	root.add_child(tail_tip)
	tail_tip.owner = root
	
	export_to_glb(root, "res://models/giraffe_body.glb")

# 2. GIRAFFE HEAD
func build_giraffe_head() -> void:
	var root = Node3D.new()
	root.name = "GiraffeHead"
	
	var mat_skin = StandardMaterial3D.new()
	var tex = load_tex("res://textures/giraffe_skin.png")
	if tex: mat_skin.albedo_texture = tex
	mat_skin.albedo_color = Color(1.0, 0.75, 0.1)
	mat_skin.roughness = 0.35
	
	var mat_brown = StandardMaterial3D.new()
	mat_brown.albedo_color = Color(0.4, 0.2, 0.08)
	mat_brown.roughness = 0.4
	
	var mat_eye = StandardMaterial3D.new()
	mat_eye.albedo_color = Color(1.0, 1.0, 1.0)
	mat_eye.roughness = 0.1
	
	var mat_pupil = StandardMaterial3D.new()
	mat_pupil.albedo_color = Color(0.04, 0.04, 0.04)
	mat_pupil.roughness = 0.1
	
	# Head
	var head = MeshInstance3D.new()
	var box = BoxMesh.new()
	box.size = Vector3(0.75, 0.65, 0.95)
	box.material = mat_skin
	head.mesh = box
	root.add_child(head)
	head.owner = root
	
	# Snout
	var snout = MeshInstance3D.new()
	var sn_box = BoxMesh.new()
	sn_box.size = Vector3(0.55, 0.45, 0.5)
	sn_box.material = mat_brown
	snout.mesh = sn_box
	snout.position = Vector3(0, -0.1, -0.55)
	root.add_child(snout)
	snout.owner = root
	
	# Horns & Ears & Eyes
	for side in [-1.0, 1.0]:
		var hx = side * 0.22
		var horn = MeshInstance3D.new()
		var h_cyl = CylinderMesh.new()
		h_cyl.top_radius = 0.06
		h_cyl.bottom_radius = 0.06
		h_cyl.height = 0.35
		h_cyl.material = mat_skin
		horn.mesh = h_cyl
		horn.position = Vector3(hx, 0.45, 0.1)
		horn.rotation_degrees = Vector3(0, 0, -side * 15)
		root.add_child(horn)
		horn.owner = root
		
		var tip = MeshInstance3D.new()
		var tip_s = SphereMesh.new()
		tip_s.radius = 0.09
		tip_s.height = 0.18
		tip_s.material = mat_brown
		tip.mesh = tip_s
		tip.position = Vector3(hx + side * 0.05, 0.65, 0.1)
		root.add_child(tip)
		tip.owner = root
		
		var ear = MeshInstance3D.new()
		var e_box = BoxMesh.new()
		e_box.size = Vector3(0.08, 0.25, 0.15)
		e_box.material = mat_skin
		ear.mesh = e_box
		ear.position = Vector3(side * 0.42, 0.28, 0.2)
		ear.rotation_degrees = Vector3(0, 0, -side * 30)
		root.add_child(ear)
		ear.owner = root
		
		var eye = MeshInstance3D.new()
		var eye_s = SphereMesh.new()
		eye_s.radius = 0.18
		eye_s.height = 0.36
		eye_s.material = mat_eye
		eye.mesh = eye_s
		eye.position = Vector3(side * 0.38, 0.35, -0.25)
		root.add_child(eye)
		eye.owner = root
		
		var pupil = MeshInstance3D.new()
		var pup_s = SphereMesh.new()
		pup_s.radius = 0.09
		pup_s.height = 0.18
		pup_s.material = mat_pupil
		pupil.mesh = pup_s
		pupil.position = Vector3(side * 0.44, 0.35, -0.37)
		root.add_child(pupil)
		pupil.owner = root
		
	export_to_glb(root, "res://models/giraffe_head.glb")

# 3. GOLDEN APPLE
func build_golden_apple() -> void:
	var root = Node3D.new()
	root.name = "GoldenApple"
	
	var mat_gold = StandardMaterial3D.new()
	mat_gold.albedo_color = Color(1.0, 0.82, 0.05)
	mat_gold.metallic = 0.9
	mat_gold.roughness = 0.15
	mat_gold.emission_enabled = true
	mat_gold.emission = Color(1.0, 0.7, 0.0)
	mat_gold.emission_energy_multiplier = 1.5
	
	var mat_stem = StandardMaterial3D.new()
	mat_stem.albedo_color = Color(0.4, 0.2, 0.1)
	
	var mat_leaf = StandardMaterial3D.new()
	mat_leaf.albedo_color = Color(0.1, 0.9, 0.2)
	mat_leaf.emission_enabled = true
	mat_leaf.emission = Color(0.1, 0.8, 0.2)
	mat_leaf.emission_energy_multiplier = 0.6
	
	var apple = MeshInstance3D.new()
	var a_sph = SphereMesh.new()
	a_sph.radius = 0.45
	a_sph.height = 0.9
	a_sph.material = mat_gold
	apple.mesh = a_sph
	root.add_child(apple)
	apple.owner = root
	
	var stem = MeshInstance3D.new()
	var s_cyl = CylinderMesh.new()
	s_cyl.top_radius = 0.04
	s_cyl.bottom_radius = 0.04
	s_cyl.height = 0.35
	s_cyl.material = mat_stem
	stem.mesh = s_cyl
	stem.position = Vector3(0, 0.5, 0)
	stem.rotation_degrees = Vector3(10, 0, -10)
	root.add_child(stem)
	stem.owner = root
	
	var leaf = MeshInstance3D.new()
	var l_box = BoxMesh.new()
	l_box.size = Vector3(0.35, 0.06, 0.18)
	l_box.material = mat_leaf
	leaf.mesh = l_box
	leaf.position = Vector3(0.16, 0.58, 0)
	leaf.rotation_degrees = Vector3(15, 20, 25)
	root.add_child(leaf)
	leaf.owner = root
	
	export_to_glb(root, "res://models/golden_apple.glb")

# 4. SPIKE TRAP
func build_spike_trap() -> void:
	var root = Node3D.new()
	root.name = "SpikeTrap"
	
	var mat_hazard = StandardMaterial3D.new()
	var tex = load_tex("res://textures/danger_stripes.png")
	if tex: mat_hazard.albedo_texture = tex
	mat_hazard.albedo_color = Color(0.95, 0.8, 0.1)
	mat_hazard.uv1_scale = Vector3(3.0, 1.0, 1.0)
	mat_hazard.roughness = 0.3
	
	var mat_spike = StandardMaterial3D.new()
	mat_spike.albedo_color = Color(0.95, 0.15, 0.15)
	mat_spike.metallic = 0.9
	mat_spike.roughness = 0.15
	mat_spike.emission_enabled = true
	mat_spike.emission = Color(0.9, 0.1, 0.1)
	mat_spike.emission_energy_multiplier = 2.0
	
	var base = MeshInstance3D.new()
	var b_box = BoxMesh.new()
	b_box.size = Vector3(7.5, 0.24, 2.5)
	b_box.material = mat_hazard
	base.mesh = b_box
	base.position = Vector3(0, 0.12, 0)
	root.add_child(base)
	base.owner = root
	
	for sx in [-2.4, -1.2, 0.0, 1.2, 2.4]:
		var spike = MeshInstance3D.new()
		var cyl = CylinderMesh.new()
		cyl.top_radius = 0.0
		cyl.bottom_radius = 0.35
		cyl.height = 0.95
		cyl.material = mat_spike
		spike.mesh = cyl
		spike.position = Vector3(sx, 0.6, 0)
		root.add_child(spike)
		spike.owner = root
		
	export_to_glb(root, "res://models/spike_trap.glb")

# 5. OVERHEAD GATE
func build_overhead_gate() -> void:
	var root = Node3D.new()
	root.name = "OverheadGate"
	
	var mat_hazard = StandardMaterial3D.new()
	var tex = load_tex("res://textures/danger_stripes.png")
	if tex: mat_hazard.albedo_texture = tex
	mat_hazard.albedo_color = Color(0.95, 0.8, 0.1)
	mat_hazard.uv1_scale = Vector3(4.0, 1.0, 1.0)
	mat_hazard.roughness = 0.3
	
	var mat_steel = StandardMaterial3D.new()
	mat_steel.albedo_color = Color(0.2, 0.25, 0.35)
	mat_steel.metallic = 0.85
	mat_steel.roughness = 0.2
	
	var bar = MeshInstance3D.new()
	var b_box = BoxMesh.new()
	b_box.size = Vector3(8.0, 0.9, 0.7)
	b_box.material = mat_hazard
	bar.mesh = b_box
	bar.position = Vector3(0, 2.8, 0)
	root.add_child(bar)
	bar.owner = root
	
	var sign_mesh = MeshInstance3D.new()
	var s_box = BoxMesh.new()
	s_box.size = Vector3(4.5, 0.7, 0.2)
	s_box.material = mat_hazard
	sign_mesh.mesh = s_box
	sign_mesh.position = Vector3(0, 3.8, 0)
	root.add_child(sign_mesh)
	sign_mesh.owner = root
	
	for px in [-3.8, 3.8]:
		var pillar = MeshInstance3D.new()
		var p_cyl = CylinderMesh.new()
		p_cyl.top_radius = 0.25
		p_cyl.bottom_radius = 0.25
		p_cyl.height = 5.5
		p_cyl.material = mat_steel
		pillar.mesh = p_cyl
		pillar.position = Vector3(px, 2.75, 0)
		root.add_child(pillar)
		pillar.owner = root
		
	export_to_glb(root, "res://models/overhead_gate.glb")

# 6. FINISH TOWER
func build_finish_tower() -> void:
	var root = Node3D.new()
	root.name = "FinishTower"
	
	var mat_glass = StandardMaterial3D.new()
	mat_glass.albedo_color = Color(0.15, 0.35, 0.85)
	mat_glass.metallic = 0.6
	mat_glass.roughness = 0.2
	
	var mat_gold = StandardMaterial3D.new()
	mat_gold.albedo_color = Color(1.0, 0.85, 0.1)
	mat_gold.metallic = 0.9
	mat_gold.roughness = 0.15
	mat_gold.emission_enabled = true
	mat_gold.emission = Color(1.0, 0.8, 0.0)
	mat_gold.emission_energy_multiplier = 2.0
	
	var tiers = [
		Vector3(2.2, 1.8, 2.5),
		Vector3(1.8, 1.5, 5.0),
		Vector3(1.5, 1.3, 7.5),
		Vector3(1.3, 1.1, 10.0),
		Vector3(1.1, 0.9, 12.5)
	]
	for t in tiers:
		var tier = MeshInstance3D.new()
		var cyl = CylinderMesh.new()
		cyl.bottom_radius = t.x
		cyl.top_radius = t.y
		cyl.height = 2.5
		cyl.material = mat_glass
		tier.mesh = cyl
		tier.position = Vector3(0, t.z, 0)
		root.add_child(tier)
		tier.owner = root
		
	var trophy = MeshInstance3D.new()
	var t_sph = SphereMesh.new()
	t_sph.radius = 0.7
	t_sph.height = 1.4
	t_sph.material = mat_gold
	trophy.mesh = t_sph
	trophy.position = Vector3(0, 14.5, 0)
	root.add_child(trophy)
	trophy.owner = root
	
	export_to_glb(root, "res://models/finish_tower.glb")
