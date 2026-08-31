extends Area2D
class_name BouncyMushroom

@export var bounce_force: float = -620.0

@onready var cap_visual: Polygon2D = $Cap
@onready var hurtbox: Hurtbox2D = $Hurtbox2D

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	if hurtbox:
		hurtbox.damage_taken.connect(_on_pogo_attack)

func _on_body_entered(body: Node2D) -> void:
	if body is CharacterBody2D and "velocity" in body:
		_bounce_body(body)

func _on_pogo_attack(_amount: float, _kb: Vector2) -> void:
	pass

func _bounce_body(body: CharacterBody2D) -> void:
	body.velocity.y = bounce_force
	if "can_double_jump" in body:
		body.can_double_jump = true
	if body.has_signal("pogo_landed"):
		body.pogo_landed.emit()

	if cap_visual:
		var tween = create_tween()
		tween.tween_property(cap_visual, "scale", Vector2(1.35, 0.55), 0.08)
		tween.tween_property(cap_visual, "scale", Vector2(0.85, 1.25), 0.12)
		tween.tween_property(cap_visual, "scale", Vector2(1.0, 1.0), 0.1)
