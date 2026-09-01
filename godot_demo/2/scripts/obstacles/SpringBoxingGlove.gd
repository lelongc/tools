extends Node2D

@export var punch_interval: float = 2.4
@export var punch_force: float = 520.0
@export var punch_direction: Vector2 = Vector2.RIGHT

var punch_timer: float = 0.0
var rest_pos: Vector2 = Vector2.ZERO
var extended_pos: Vector2 = Vector2.ZERO

@onready var glove_head: Area2D = get_node_or_null("GloveHead")
@onready var spring_visual: Line2D = get_node_or_null("SpringLine")

func _ready() -> void:
	punch_timer = randf_range(0.5, punch_interval)
	if glove_head:
		rest_pos = glove_head.position
		extended_pos = rest_pos + punch_direction * 110.0
		glove_head.body_entered.connect(_on_glove_hit)

func _physics_process(delta: float) -> void:
	punch_timer += delta
	if punch_timer >= punch_interval:
		punch_timer = 0.0
		_execute_punch()

	# Update spring line
	if spring_visual and glove_head:
		spring_visual.points = PackedVector2Array([rest_pos, glove_head.position])

func _execute_punch() -> void:
	if not glove_head: return
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(glove_head, "position", extended_pos, 0.12)
	tween.tween_interval(0.2)
	tween.tween_property(glove_head, "position", rest_pos, 0.35)

func _on_glove_hit(body: Node2D) -> void:
	if body is CharacterBody2D and "velocity" in body:
		body.velocity = punch_direction * punch_force + Vector2.UP * 180.0
		if body.has_method("_trigger_squash"):
			body._trigger_squash(Vector2(0.6, 1.4))
