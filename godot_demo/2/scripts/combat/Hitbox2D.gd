extends Area2D

signal hit_landed(target: Node2D, is_down_slash: bool)

@export var damage: float = 20.0
@export var knockback_force: Vector2 = Vector2(300, -100)
@export var is_player_hitbox: bool = true
@export var is_down_slash: bool = false

func _ready() -> void:
	collision_layer = 2 if is_player_hitbox else 4
	collision_mask = 4 if is_player_hitbox else 2

func notify_hit(target: Node2D) -> void:
	hit_landed.emit(target, is_down_slash)
