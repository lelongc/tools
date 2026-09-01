extends AnimatableBody2D

@export var max_angle_deg: float = 24.0
@export var tilt_speed: float = 4.0
@export var return_speed: float = 2.5

var current_tilt_target: float = 0.0
var overlapping_bodies: Array[CharacterBody2D] = []

@onready var detect_area: Area2D = $DetectArea

func _ready() -> void:
	if detect_area:
		detect_area.body_entered.connect(_on_body_entered)
		detect_area.body_exited.connect(_on_body_exited)

func _physics_process(delta: float) -> void:
	var torque = 0.0
	for body in overlapping_bodies:
		if is_instance_valid(body):
			var local_x = to_local(body.global_position).x
			torque += local_x * 0.005

	if overlapping_bodies.size() > 0:
		current_tilt_target = clamp(torque, deg_to_rad(-max_angle_deg), deg_to_rad(max_angle_deg))
		rotation = lerp_angle(rotation, current_tilt_target, tilt_speed * delta)
	else:
		rotation = lerp_angle(rotation, 0.0, return_speed * delta)

func _on_body_entered(body: Node2D) -> void:
	if body is CharacterBody2D and body not in overlapping_bodies:
		overlapping_bodies.append(body)

func _on_body_exited(body: Node2D) -> void:
	if body in overlapping_bodies:
		overlapping_bodies.erase(body)
