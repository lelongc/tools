extends Area3D
class_name FinishTower

@export var max_multiplier: float = 100.0
var is_triggered: bool = false

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)

func _on_body_entered(body: Node3D) -> void:
	trigger_finish(body)

func _on_area_entered(area: Area3D) -> void:
	trigger_finish(area)

func trigger_finish(node: Node) -> void:
	if is_triggered:
		return
		
	var player = null
	if node is CharacterBody3D and node.name == "Player":
		player = node
	elif node.get_parent() is CharacterBody3D and node.get_parent().name == "Player":
		player = node.get_parent()
	elif node.owner and node.owner is CharacterBody3D:
		player = node.owner

	if is_instance_valid(player) and player.has_method("trigger_finish"):
		is_triggered = true
		
		# Tính multiplier dựa theo chiều cao cổ
		var neck_h = player.get("current_neck_height")
		var mult = 1.2
		if neck_h >= 14.0:
			mult = 100.0
		elif neck_h >= 10.0:
			mult = 50.0
		elif neck_h >= 7.0:
			mult = 20.0
		elif neck_h >= 5.0:
			mult = 10.0
		elif neck_h >= 3.5:
			mult = 5.0
		elif neck_h >= 2.5:
			mult = 2.5
		elif neck_h >= 1.8:
			mult = 1.5
			
		player.trigger_finish(mult)
