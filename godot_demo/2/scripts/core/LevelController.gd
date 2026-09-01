extends Node2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var level_id: int = 1
@export var available_eggs: Array[String] = ["normal", "bomb"]
@export var intro_target_y: float = 700.0

func _ready() -> void:
	var enemies = get_tree().get_nodes_in_group("Enemies")
	var enemy_count = enemies.size()
	if enemy_count == 0:
		var enemy_group = get_node_or_null("BunkerStructure/Enemies")
		if enemy_group:
			for child in enemy_group.get_children():
				if child.has_method("take_damage"):
					enemy_count += 1

	GameManager.start_level(level_id, enemy_count, available_eggs)

	# Bật hiệu ứng Cinematic Intro: Zoom cận cảnh hầm quái vật rồi lướt về Gà Mẹ
	if CameraShake.instance:
		CameraShake.instance.play_intro_pan(intro_target_y)
