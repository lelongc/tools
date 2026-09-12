extends Area3D
class_name DeliveryZone3D

## DeliveryZone3D.gd
## Khu vực giao hình nhân hoàn thiện (Delivery Zone)

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	_build_visuals()

func _build_visuals() -> void:
	var pad = MeshInstance3D.new()
	var cyl = CylinderMesh.new()
	cyl.top_radius = 2.4
	cyl.bottom_radius = 2.4
	cyl.height = 0.2
	pad.mesh = cyl
	
	var mat = StandardMaterial3D.new()
	mat.albedo_color = Color(0.2, 0.9, 0.4, 0.8)
	mat.emission_enabled = true
	mat.emission = Color(0.1, 0.8, 0.3)
	mat.emission_energy_multiplier = 1.0
	pad.material_override = mat
	add_child(pad)
	
	var col = CollisionShape3D.new()
	var cshape = CylinderShape3D.new()
	cshape.radius = 2.4
	cshape.height = 1.2
	col.shape = cshape
	col.position.y = 0.6
	add_child(col)

func _on_body_entered(body: Node) -> void:
	if body is Mannequin3D:
		var dummy = body as Mannequin3D
		if dummy.paint_percent > 30.0: # Có màu sơn
			var color = dummy.paint_color
			var pts = int(dummy.paint_percent * 5)
			var delivered_by = 1 if color == "red" else 2
			
			GameManager3D.register_delivery(color, pts, delivered_by)
			
			# Hiệu ứng hút vào cổng và tái sinh hình nhân mới
			var tween = create_tween()
			tween.tween_property(dummy, "scale", Vector3.ZERO, 0.25)
			await tween.finished
			dummy.global_position = Vector3(randf_range(-8, 8), 2.0, randf_range(-8, 8))
			dummy.paint_color = "white"
			dummy.paint_percent = 0.0
			dummy.is_fully_painted = false
			dummy._update_material_color()
			dummy.scale = Vector3.ONE
