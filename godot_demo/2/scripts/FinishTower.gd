extends Area3D
class_name FinishTower

var is_triggered: bool = false

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node3D) -> void:
	if is_triggered:
		return
		
	var player = null
	if body is CharacterBody3D and body.name == "Player":
		player = body
	elif body.get_parent() is CharacterBody3D and body.get_parent().name == "Player":
		player = body.get_parent()
		
	if is_instance_valid(player) and player.has_method("trigger_finish"):
		is_triggered = true
		
		# Tinh toan he so nhan thuong theo chieu cao co dat duoc
		var current_h = player.get("current_max_height")
		var multiplier = 2.0
		if current_h >= 10.0:
			multiplier = 100.0
		elif current_h >= 8.0:
			multiplier = 50.0
		elif current_h >= 6.0:
			multiplier = 20.0
		elif current_h >= 4.0:
			multiplier = 10.0
		elif current_h >= 2.5:
			multiplier = 5.0
			
		player.trigger_finish(multiplier)
		
		var gm = get_tree().root.find_child("GameManager", true, false)
		if gm and gm.has_method("on_reach_finish_tower"):
			gm.on_reach_finish_tower(multiplier, current_h)
