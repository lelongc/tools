extends Camera2D
class_name CameraShake2D

static var instance: Camera2D = null

@export var max_offset: Vector2 = Vector2(16.0, 16.0)
@export var max_roll: float = 0.05
@export var decay: float = 2.8

var trauma: float = 0.0
var trauma_power: int = 2
var noise_y: float = 0.0

func _ready() -> void:
	instance = self

func _process(delta: float) -> void:
	if trauma > 0.0:
		trauma = max(trauma - decay * delta, 0.0)
		_apply_shake()
	else:
		offset = Vector2.ZERO
		rotation = 0.0

func _apply_shake() -> void:
	var amount = pow(trauma, trauma_power)
	noise_y += 1.0
	rotation = max_roll * amount * sin(noise_y * 0.8)
	offset.x = max_offset.x * amount * cos(noise_y * 0.9)
	offset.y = max_offset.y * amount * sin(noise_y * 1.1)

static func add_trauma(amount: float) -> void:
	if instance:
		instance.trauma = clamp(instance.trauma + amount, 0.0, 1.0)

static func hit_stop(duration_sec: float = 0.06) -> void:
	if instance and instance.is_inside_tree():
		Engine.time_scale = 0.05
		await instance.get_tree().create_timer(duration_sec * 0.05).timeout
		Engine.time_scale = 1.0
