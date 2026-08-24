extends Area3D
class_name HighObstacle

@export var obstacle_name: String = "OVERHEAD_BEAM"

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)

func _on_area_entered(area: Area3D) -> void:
	check_hit(area)

func _on_body_entered(body: Node3D) -> void:
	check_hit(body)

func check_hit(node: Node) -> void:
	# Kiểm tra nếu đầu của người chơi đập vào xà ngang
	if node.name == "HeadHitbox" or node.name == "HeadRoot":
		var player = node.get_parent()
		if not player is CharacterBody3D and node.get_parent().get_parent():
			player = node.get_parent().get_parent()
		if is_instance_valid(player) and player.has_method("bonk_overhead"):
			player.bonk_overhead()
	elif node is CharacterBody3D and node.has_method("bonk_overhead"):
		# Nếu là Player trực tiếp
		if node.get("current_neck_height") > 1.2:
			node.bonk_overhead()
