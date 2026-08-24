extends Area3D
class_name Bullet

var speed: float = 50.0
var damage: float = 10.0
var direction: Vector3 = Vector3.FORWARD
var lifetime: float = 1.8

func _ready() -> void:
	var timer = get_tree().create_timer(lifetime)
	timer.timeout.connect(func(): if is_instance_valid(self): queue_free())
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)

func _physics_process(delta: float) -> void:
	global_position += direction * speed * delta

func _on_area_entered(area: Area3D) -> void:
	if area.has_method("take_hit"):
		area.take_hit(damage)
		create_hit_effect()
		queue_free()

func _on_body_entered(body: Node3D) -> void:
	if body.has_method("take_hit"):
		body.take_hit(damage)
		create_hit_effect()
		queue_free()

func create_hit_effect() -> void:
	var spark = MeshInstance3D.new()
	var mesh = SphereMesh.new()
	mesh.radius = 0.2
	mesh.height = 0.4
	spark.mesh = mesh
	
	var mat = StandardMaterial3D.new()
	mat.albedo_color = Color(1.0, 0.9, 0.2)
	mat.emission_enabled = true
	mat.emission = Color(1.0, 0.8, 0.1)
	mat.emission_energy_multiplier = 5.0
	spark.material_override = mat
	
	if get_parent():
		get_parent().add_child(spark)
		spark.global_position = global_position
		var tw = spark.create_tween()
		tw.tween_property(spark, "scale", Vector3.ZERO, 0.12)
		tw.tween_callback(spark.queue_free)
