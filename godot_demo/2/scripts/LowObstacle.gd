extends Area3D
class_name LowObstacle

@export var obstacle_name: String = "SPIKE_TRAP"
@export var min_safe_height: float = 2.8

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)

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
	elif node.owner and node.owner.name == "Player":
		player = node.owner
		
	if is_instance_valid(player) and player.has_method("poke_bottom"):
		# Nếu người chơi không vươn cổ đủ cao để nhấc thân/chân qua bãi chông
		var current_h = player.get("current_neck_height")
		if current_h < min_safe_height:
			player.poke_bottom()
