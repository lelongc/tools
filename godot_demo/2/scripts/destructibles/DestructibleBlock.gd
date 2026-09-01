extends RigidBody2D
class_name DestructibleBlock

@export_enum("wood", "stone", "glass") var material_type: String = "wood"
@export var max_health: float = 100.0
@export var block_size: Vector2 = Vector2(120.0, 24.0)

var current_health: float = 100.0
var is_destroyed: bool = false

@onready var visual_mesh: Polygon2D = get_node_or_null("Visual")
@onready var crack_overlay: Line2D = get_node_or_null("CrackOverlay")
@onready var fracture_particles: CPUParticles2D = get_node_or_null("FractureFX")

func _ready() -> void:
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_impact)

	# Thiết lập chỉ số vật lý theo loại vật liệu
	match material_type:
		"wood":
			max_health = 80.0
			mass = 2.5
			if visual_mesh: visual_mesh.color = Color(0.76, 0.52, 0.28, 1.0)
		"stone":
			max_health = 220.0
			mass = 7.0
			if visual_mesh: visual_mesh.color = Color(0.55, 0.58, 0.62, 1.0)
		"glass":
			max_health = 25.0
			mass = 1.0
			if visual_mesh: visual_mesh.color = Color(0.65, 0.88, 0.95, 0.75)

	current_health = max_health

func _on_body_impact(body: Node) -> void:
	if is_destroyed: return

	# Tính sát thương chấn động khi bị vật nặng đè hoặc rơi từ trên cao
	if body is RigidBody2D:
		var rel_vel = (linear_velocity - body.linear_velocity).length()
		if rel_vel > 140.0:
			var impact_dmg = (rel_vel - 140.0) * (body.mass * 0.4)
			take_damage(impact_dmg, global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_destroyed: return
	current_health -= amount

	# Hiệu ứng nứt vỡ
	if current_health <= max_health * 0.5 and crack_overlay:
		crack_overlay.visible = true

	# Nháy trắng khi nhận đòn
	if visual_mesh:
		var prev_c = visual_mesh.color
		visual_mesh.color = Color(1.0, 1.0, 1.0, 1.0)
		get_tree().create_timer(0.04).timeout.connect(func(): if is_instance_valid(visual_mesh): visual_mesh.color = prev_c)

	if current_health <= 0.0:
		_fracture_block()

func _fracture_block() -> void:
	if is_destroyed: return
	is_destroyed = true

	GameManager.add_score(150 if material_type == "stone" else 75)

	if fracture_particles:
		fracture_particles.restart()
		fracture_particles.emitting = true

	if visual_mesh:
		visual_mesh.visible = false
	if crack_overlay:
		crack_overlay.visible = false

	# Vô hiệu hóa va chạm
	$CollisionShape2D.set_deferred("disabled", true)
	freeze = true

	CameraShake2D.add_trauma(0.08)

	await get_tree().create_timer(0.4).timeout
	queue_free()
