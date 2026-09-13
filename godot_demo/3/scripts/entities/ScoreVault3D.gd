extends Area3D
class_name ScoreVault3D

## ScoreVault3D.gd
## Đài nạp điểm trung tâm 3D: Hút đoàn hình nhân nạp điểm combo và bắn pháo hoa

var anim_rot: float = 0.0

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	_build_3d_vault_visuals()

func _build_3d_vault_visuals() -> void:
	var col = CollisionShape3D.new()
	var cshape = CylinderShape3D.new()
	cshape.radius = 2.4
	cshape.height = 1.0
	col.shape = cshape
	col.position.y = 0.5
	add_child(col)
	
	# Bục tròn vàng phát sáng
	var pad = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.top_radius = 2.4
	cyl.bottom_radius = 2.4
	cyl.height = 0.3
	pad.mesh = cyl
	pad.position.y = 0.15
	
	var mat = StandardMaterial3D.new()
	mat.albedo_color = Color(1.0, 0.85, 0.15)
	mat.emission_enabled = true
	mat.emission = Color(1.0, 0.8, 0.1)
	mat.emission_energy_multiplier = 0.9
	pad.material_override = mat
	add_child(pad)

func _process(delta: float) -> void:
	anim_rot += delta * 2.0
	rotation.y = anim_rot

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("players") and body.has_method("clear_chain_for_banking"):
		var p = body
		if p.my_chain.size() > 0:
			var count = p.clear_chain_for_banking()
			CongaGameManager3D.bank_mannequins(p.player_id, count)
			
			# Nhún nảy bục
			scale = Vector3(1.3, 0.7, 1.3)
			var tw = create_tween()
			tw.tween_property(self, "scale", Vector3.ONE, 0.3)
