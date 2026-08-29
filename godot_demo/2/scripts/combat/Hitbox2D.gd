extends Area2D
class_name Hitbox2D

@export var damage: float = 20.0
@export var knockback_force: Vector2 = Vector2(300, -100)
@export var is_player_hitbox: bool = true

func _ready() -> void:
	collision_layer = 2 if is_player_hitbox else 4
	collision_mask = 4 if is_player_hitbox else 2
