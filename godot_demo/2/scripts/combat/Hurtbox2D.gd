extends Area2D
class_name Hurtbox2D

signal damage_taken(amount: float, knockback: Vector2)

@export var is_player_hurtbox: bool = true

func _ready() -> void:
	collision_layer = 4 if is_player_hurtbox else 2
	collision_mask = 2 if is_player_hurtbox else 4
	area_entered.connect(_on_area_entered)

func _on_area_entered(area: Area2D) -> void:
	if area is Hitbox2D:
		damage_taken.emit(area.damage, area.knockback_force)
		area.notify_hit(owner)
