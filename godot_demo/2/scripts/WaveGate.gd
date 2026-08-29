extends Area3D
class_name WaveGate

## Thanh chắn di chuyển lên/xuống theo sóng sin — phải timing đúng lúc chui qua

@export var wave_amplitude: float = 2.5      # Biên độ dao động (m)
@export var wave_center: float = 3.0          # Tâm dao động (m)
@export var wave_speed: float = 2.0           # Tốc độ dao động (rad/s)
@export var bar_thickness: float = 0.4        # Độ dày thanh chắn
@export var gap_height: float = 2.0           # Khe hở an toàn (m) — phải có cổ trong khe này

var _wave_time: float = 0.0
var _current_bar_y: float = 3.0
var _is_triggered: bool = false

@onready var bar_mesh: MeshInstance3D = null
@onready var gap_label: Label3D = null

func _ready() -> void:
	# Randomize phase để mỗi WaveGate khác nhau
	_wave_time = randf() * TAU
	
	build_visuals()
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)

func _physics_process(delta: float) -> void:
	if _is_triggered:
		return
	
	_wave_time += wave_speed * delta
	_current_bar_y = wave_center + sin(_wave_time) * wave_amplitude
	
	if bar_mesh:
		bar_mesh.position.y = _current_bar_y
	
	# Update gap indicator label
	if gap_label:
		var safe_bottom = _current_bar_y - gap_height / 2.0
		var safe_top = _current_bar_y + gap_height / 2.0
		gap_label.text = "%.1f–%.1fm" % [safe_bottom, safe_top]
		gap_label.position.y = _current_bar_y + gap_height / 2.0 + 0.8

func _on_body_entered(body: Node3D) -> void:
	check_collision(body)

func _on_area_entered(area: Area3D) -> void:
	check_collision(area)

func check_collision(node: Node) -> void:
	if _is_triggered:
		return
	
	var player = _find_player(node)
	if not is_instance_valid(player):
		return
	
	var neck_h = player.get("current_neck_height")
	if neck_h == null:
		return
	
	# Khe an toàn: bar_y ± gap_height/2
	var safe_bottom = _current_bar_y - gap_height / 2.0
	var safe_top = _current_bar_y + gap_height / 2.0
	
	_is_triggered = true
	
	if neck_h >= safe_bottom and neck_h <= safe_top:
		# SAFE! Chui qua thành công
		SoundManager.play_gate_bonus()
		# Bonus score cho timing tốt
		var gm = get_tree().root.find_child("GameManager", true, false)
		if gm and gm.has_method("add_score"):
			gm.add_score(200)  # Bonus cho timing tốt
		
		# Shrink & disappear
		var tw = create_tween()
		tw.tween_property(self, "scale", Vector3(0.01, 0.01, 0.01), 0.15)
		tw.tween_callback(queue_free)
	else:
		# HIT! Cổ ngoài khe an toàn
		if neck_h < safe_bottom:
			if player.has_method("poke_bottom"):
				player.poke_bottom()
		else:
			if player.has_method("bonk_overhead"):
				player.bonk_overhead()

func _find_player(node: Node) -> Node:
	if node is CharacterBody3D and node.name == "Player":
		return node
	if node.get_parent() is CharacterBody3D and node.get_parent().name == "Player":
		return node.get_parent()
	if node.owner and node.owner is CharacterBody3D and node.owner.name == "Player":
		return node.owner
	return null

func build_visuals() -> void:
	# === THANH CHẮN CHÍNH (Moving bar) ===
	bar_mesh = MeshInstance3D.new()
	bar_mesh.name = "WaveBar"
	var b_mesh = BoxMesh.new()
	b_mesh.size = Vector3(7.5, bar_thickness, 0.6)
	bar_mesh.mesh = b_mesh
	bar_mesh.position.y = wave_center
	
	var bar_mat = StandardMaterial3D.new()
	bar_mat.albedo_color = Color(0.9, 0.2, 0.9, 0.85)
	bar_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	bar_mat.emission_enabled = true
	bar_mat.emission = Color(1.0, 0.3, 1.0)
	bar_mat.emission_energy_multiplier = 4.0
	bar_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	bar_mesh.material_override = bar_mat
	add_child(bar_mesh)
	
	# === TRAIL EFFECT (2 thanh mờ phía sau) ===
	for i in range(2):
		var trail = MeshInstance3D.new()
		var t_mesh = BoxMesh.new()
		t_mesh.size = Vector3(7.5, bar_thickness * 0.5, 0.3)
		trail.mesh = t_mesh
		var t_mat = StandardMaterial3D.new()
		t_mat.albedo_color = Color(0.9, 0.3, 0.9, 0.15 - i * 0.05)
		t_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		t_mat.emission_enabled = true
		t_mat.emission = Color(0.8, 0.2, 0.8)
		t_mat.emission_energy_multiplier = 1.5
		t_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		trail.material_override = t_mat
		trail.position.z = (i + 1) * 0.5
		bar_mesh.add_child(trail)
	
	# === KHE AN TOÀN (Safe zone indicator) ===
	var safe_zone = MeshInstance3D.new()
	var sz_mesh = BoxMesh.new()
	sz_mesh.size = Vector3(7.5, gap_height, 0.05)
	safe_zone.mesh = sz_mesh
	safe_zone.position.y = wave_center
	var sz_mat = StandardMaterial3D.new()
	sz_mat.albedo_color = Color(0.1, 1.0, 0.3, 0.12)
	sz_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	sz_mat.emission_enabled = true
	sz_mat.emission = Color(0.2, 1.0, 0.4)
	sz_mat.emission_energy_multiplier = 1.0
	sz_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	safe_zone.material_override = sz_mat
	bar_mesh.add_child(safe_zone)
	
	# === GAP LABEL ===
	gap_label = Label3D.new()
	gap_label.name = "GapLabel"
	gap_label.font_size = 48
	gap_label.modulate = Color(0.3, 1.0, 0.5)
	gap_label.outline_modulate = Color(0, 0, 0)
	gap_label.outline_size = 6
	gap_label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	gap_label.position = Vector3(0, wave_center + gap_height + 1.0, 0)
	add_child(gap_label)
	
	# === CỘT HAI BÊN ===
	for side in [-1.0, 1.0]:
		var pillar = MeshInstance3D.new()
		var p_mesh = CylinderMesh.new()
		p_mesh.top_radius = 0.2
		p_mesh.bottom_radius = 0.3
		p_mesh.height = 7.0
		pillar.mesh = p_mesh
		pillar.position = Vector3(side * 3.9, 3.5, 0)
		var p_mat = StandardMaterial3D.new()
		p_mat.albedo_color = Color(0.4, 0.1, 0.5)
		p_mat.emission_enabled = true
		p_mat.emission = Color(0.6, 0.1, 0.8)
		p_mat.emission_energy_multiplier = 1.5
		pillar.material_override = p_mat
		add_child(pillar)
