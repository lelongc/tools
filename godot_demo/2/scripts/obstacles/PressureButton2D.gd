extends Area2D

@export var target_door_path: NodePath
@export var extra_door_paths: Array[NodePath] = []

var target_doors: Array[Node] = []
var bodies_on_button: int = 0

@onready var cap: Polygon2D = get_node_or_null("Cap")

func _ready() -> void:
	if target_door_path:
		var d = get_node_or_null(target_door_path)
		if d: target_doors.append(d)

	for p in extra_door_paths:
		var d = get_node_or_null(p)
		if d and d not in target_doors:
			target_doors.append(d)

	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node2D) -> void:
	if body is CharacterBody2D:
		bodies_on_button += 1
		if bodies_on_button == 1:
			_press_down()

func _on_body_exited(body: Node2D) -> void:
	if body is CharacterBody2D:
		bodies_on_button = max(0, bodies_on_button - 1)
		if bodies_on_button == 0:
			_release_up()

func _press_down() -> void:
	if cap:
		var tween = create_tween()
		tween.tween_property(cap, "position:y", 8.0, 0.1)
		tween.tween_property(cap, "color", Color(0.2, 0.95, 0.4), 0.1)

	for door in target_doors:
		if is_instance_valid(door) and door.has_method("open_door"):
			door.open_door()

func _release_up() -> void:
	if cap:
		var tween = create_tween()
		tween.tween_property(cap, "position:y", 0.0, 0.15)
		tween.tween_property(cap, "color", Color(1, 0.3, 0.4), 0.15)

	for door in target_doors:
		if is_instance_valid(door) and door.has_method("close_door"):
			door.close_door()
