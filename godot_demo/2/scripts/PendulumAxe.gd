extends Area3D
class_name PendulumAxe

@export var obstacle_name: String = "PENDULUM_AXE"
@export var swing_speed: float = 2.5
@export var max_angle: float = 55.0

var time_passed: float = 0.0
@onready var pivot_arm: Node3D = $PivotArm

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	# Random offset để các búa không lắc trùng nhau
	time_passed = randf_range(0.0, 3.0)

func _process(delta: float) -> void:
	time_passed += delta * swing_speed
	var current_rot = sin(time_passed) * deg_to_rad(max_angle)
	if pivot_arm:
		pivot_arm.rotation.z = current_rot

func _on_area_entered(area: Area3D) -> void:
	check_hit(area)

func _on_body_entered(body: Node3D) -> void:
	check_hit(body)

func check_hit(node: Node) -> void:
	var player = null
	if node is CharacterBody3D and node.name == "Player":
		player = node
	elif node.get_parent() is CharacterBody3D and node.get_parent().name == "Player":
		player = node.get_parent()
	elif node.owner and node.owner is CharacterBody3D:
		player = node.owner

	if is_instance_valid(player) and player.has_method("bonk_overhead"):
		player.bonk_overhead()
