extends Node3D
class_name TunnelObstacle

## Đường hầm Precision Zone — phải giữ cổ trong khoảng ceiling/floor
## Cổ chạm trần → bonk, Cổ thấp hơn sàn → spike

@export var tunnel_length: float = 15.0       # Chiều dài đường hầm (m)
@export var ceiling_height: float = 4.0       # Trần (cổ > ceiling → bonk)
@export var floor_height: float = 2.0         # Sàn gai (cổ < floor → spike)
@export var safe_zone_label: String = ""      # Hiển thị khoảng an toàn

var _player_inside: bool = false
var _check_timer: float = 0.0

func _ready() -> void:
	build_tunnel_visuals()
	
	# Tạo 2 Area3D: entry trigger và exit trigger
	var entry_area = Area3D.new()
	entry_area.name = "EntryZone"
	var entry_shape = CollisionShape3D.new()
	var entry_box = BoxShape3D.new()
	entry_box.size = Vector3(8.0, 8.0, 1.0)
	entry_shape.shape = entry_box
	entry_area.add_child(entry_shape)
	entry_area.position = Vector3(0, 3.0, 0)  # Front of tunnel
	add_child(entry_area)
	entry_area.body_entered.connect(_on_entry)
	entry_area.area_entered.connect(func(a): _on_entry(a))
	
	var exit_area = Area3D.new()
	exit_area.name = "ExitZone"
	var exit_shape = CollisionShape3D.new()
	var exit_box = BoxShape3D.new()
	exit_box.size = Vector3(8.0, 8.0, 1.0)
	exit_shape.shape = exit_box
	exit_area.add_child(exit_shape)
	exit_area.position = Vector3(0, 3.0, -tunnel_length)  # Back of tunnel
	add_child(exit_area)
	exit_area.body_entered.connect(_on_exit)
	exit_area.area_entered.connect(func(a): _on_exit(a))

func _physics_process(delta: float) -> void:
	if not _player_inside:
		return
	
	_check_timer += delta
	if _check_timer < 0.08:  # Check mỗi 80ms (performance)
		return
	_check_timer = 0.0
	
	var player = get_tree().root.find_child("Player", true, false)
	if not is_instance_valid(player) or not player.get("is_active"):
		return
	
	# Chỉ kiểm tra khi player đang nằm trong phạm vi tunnel
	var pz = player.global_position.z
	var tz = global_position.z
	if pz > tz + 1.0 or pz < tz - tunnel_length - 1.0:
		_player_inside = false
		return
	
	var neck_h = player.get("current_neck_height")
	if neck_h == null:
		return
	
	if neck_h > ceiling_height:
		# Đập trần!
		if player.has_method("hit_tunnel_wall"):
			player.hit_tunnel_wall("TUNNEL_CEILING")
		elif player.has_method("bonk_overhead"):
			player.bonk_overhead()
		_player_inside = false
	elif neck_h < floor_height:
		# Đạp chông sàn!
		if player.has_method("hit_tunnel_wall"):
			player.hit_tunnel_wall("TUNNEL_FLOOR")
		elif player.has_method("poke_bottom"):
			player.poke_bottom()
		_player_inside = false

func _on_entry(node: Node) -> void:
	var player = _find_player(node)
	if player:
		_player_inside = true

func _on_exit(node: Node) -> void:
	var player = _find_player(node)
	if player:
		_player_inside = false

func _find_player(node: Node) -> Node:
	if node is CharacterBody3D and node.name == "Player":
		return node
	if node.get_parent() is CharacterBody3D and node.get_parent().name == "Player":
		return node.get_parent()
	if node.owner and node.owner is CharacterBody3D and node.owner.name == "Player":
		return node.owner
	return null

func build_tunnel_visuals() -> void:
	# === TRẦN (Ceiling) — Neon xanh dương ===
	var ceiling = MeshInstance3D.new()
	var c_mesh = BoxMesh.new()
	c_mesh.size = Vector3(7.5, 0.3, tunnel_length)
	ceiling.mesh = c_mesh
	ceiling.position = Vector3(0, ceiling_height + 0.15, -tunnel_length / 2.0)
	var c_mat = StandardMaterial3D.new()
	c_mat.albedo_color = Color(0.1, 0.3, 0.8, 0.7)
	c_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	c_mat.emission_enabled = true
	c_mat.emission = Color(0.2, 0.5, 1.0)
	c_mat.emission_energy_multiplier = 3.5
	c_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	ceiling.material_override = c_mat
	add_child(ceiling)
	
	# === SÀN GAI (Floor) — Neon đỏ ===
	var floor_mesh = MeshInstance3D.new()
	var f_mesh = BoxMesh.new()
	f_mesh.size = Vector3(7.5, 0.3, tunnel_length)
	floor_mesh.mesh = f_mesh
	floor_mesh.position = Vector3(0, floor_height - 0.15, -tunnel_length / 2.0)
	var f_mat = StandardMaterial3D.new()
	f_mat.albedo_color = Color(0.8, 0.1, 0.1, 0.7)
	f_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	f_mat.emission_enabled = true
	f_mat.emission = Color(1.0, 0.2, 0.2)
	f_mat.emission_energy_multiplier = 3.5
	f_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	floor_mesh.material_override = f_mat
	add_child(floor_mesh)
	
	# === TƯỜNG HAI BÊN (Semi-transparent) ===
	for side in [-1.0, 1.0]:
		var wall = MeshInstance3D.new()
		var w_mesh = BoxMesh.new()
		var h = ceiling_height - floor_height + 0.3
		w_mesh.size = Vector3(0.15, h, tunnel_length)
		wall.mesh = w_mesh
		wall.position = Vector3(side * 3.75, (ceiling_height + floor_height) / 2.0, -tunnel_length / 2.0)
		var w_mat = StandardMaterial3D.new()
		w_mat.albedo_color = Color(0.6, 0.6, 0.8, 0.25)
		w_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		w_mat.emission_enabled = true
		w_mat.emission = Color(0.5, 0.5, 1.0)
		w_mat.emission_energy_multiplier = 1.5
		w_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		wall.material_override = w_mat
		add_child(wall)
	
	# === NHÃN HIỂN THỊ "Safe Zone" ===
	var lbl = Label3D.new()
	lbl.text = "⚠️ %.1fm — %.1fm ⚠️" % [floor_height, ceiling_height]
	lbl.font_size = 72
	lbl.modulate = Color(1.0, 1.0, 0.3)
	lbl.outline_modulate = Color(0, 0, 0)
	lbl.outline_size = 8
	lbl.position = Vector3(0, ceiling_height + 1.0, 1.5)
	lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	add_child(lbl)
	
	# === CỘT CẢNH BÁO (Warning Pillars) ===
	for side in [-1.0, 1.0]:
		var pillar = MeshInstance3D.new()
		var p_mesh = CylinderMesh.new()
		p_mesh.top_radius = 0.25
		p_mesh.bottom_radius = 0.25
		p_mesh.height = ceiling_height + 1.0
		pillar.mesh = p_mesh
		pillar.position = Vector3(side * 3.9, (ceiling_height + 1.0) / 2.0, 0.5)
		var p_mat = StandardMaterial3D.new()
		p_mat.albedo_color = Color(1.0, 0.8, 0.0)
		p_mat.emission_enabled = true
		p_mat.emission = Color(1.0, 0.6, 0.0)
		p_mat.emission_energy_multiplier = 2.0
		pillar.material_override = p_mat
		add_child(pillar)
