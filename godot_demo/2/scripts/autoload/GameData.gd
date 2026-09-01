extends Node

var current_level_index: int = 1
var max_levels: int = 5
var total_corn_collected: int = 0
var level_scores: Dictionary = {} # level_idx -> {"corn": int, "time": float, "cleared": bool}

var is_single_player_ai_mode: bool = false # Toggle single player with AI partner

func complete_level(level_idx: int, corn: int, time_spent: float) -> void:
	level_scores[level_idx] = {
		"corn": corn,
		"time": time_spent,
		"cleared": true
	}
	total_corn_collected += corn
	if level_idx >= current_level_index and current_level_index < max_levels:
		current_level_index = level_idx + 1

func get_level_scene_path(level_idx: int) -> String:
	return "res://scenes/levels/Level_%d.tscn" % level_idx
