extends StaticBody2D

@export var is_open_by_default: bool = false

var is_open: bool = false
var closed_pos: Vector2 = Vector2.ZERO
var open_pos: Vector2 = Vector2.ZERO

@onready var col_shape: CollisionShape2D = get_node_or_null("CollisionShape2D")
@onready var visual = get_node_or_null("Visual")

func _ready() -> void:
	closed_pos = position
	open_pos = position + Vector2(0, -120)
	if is_open_by_default:
		open_door()

func open_door() -> void:
	if is_open: return
	is_open = true
	var tween = create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "position", open_pos, 0.4)
	if col_shape:
		col_shape.set_deferred("disabled", true)

func close_door() -> void:
	if not is_open: return
	is_open = false
	var tween = create_tween().set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "position", closed_pos, 0.35)
	if col_shape:
		col_shape.set_deferred("disabled", false)
