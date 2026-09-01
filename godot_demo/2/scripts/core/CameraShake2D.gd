extends Camera2D
class_name CameraShake2D

static var instance: CameraShake2D = null

@export var max_offset: Vector2 = Vector2(18.0, 18.0)
@export var max_roll: float = 0.05
@export var decay: float = 2.8

var trauma: float = 0.0
var trauma_power: int = 2
var noise_y: float = 0.0
var is_intro_playing: bool = false
var intro_tween: Tween = null

func _ready() -> void:
	instance = self

func play_intro_pan(target_bunker_y: float = 700.0, on_finished_callback: Callable = Callable()) -> void:
	is_intro_playing = true
	
	# Bắt đầu tại cận cảnh hầm quái vật (Zoom in 1.25x)
	global_position = Vector2(270.0, target_bunker_y)
	zoom = Vector2(1.25, 1.25)

	# Giữ lại 0.4s cho người chơi quan sát căn hầm
	await get_tree().create_timer(0.4).timeout
	if not is_intro_playing: return

	# Lướt êm ái về toàn cảnh (Zoom out 1.0x, vị trí trung tâm 270, 480)
	intro_tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN_OUT)
	intro_tween.tween_property(self, "global_position", Vector2(270.0, 480.0), 0.5)
	intro_tween.tween_property(self, "zoom", Vector2.ONE, 0.5)
	
	await intro_tween.finished
	is_intro_playing = false
	if on_finished_callback.is_valid():
		on_finished_callback.call()

func skip_intro_pan() -> void:
	if not is_intro_playing: return
	is_intro_playing = false
	if intro_tween and intro_tween.is_valid():
		intro_tween.kill()
	global_position = Vector2(270.0, 480.0)
	zoom = Vector2.ONE

func _process(delta: float) -> void:
	if is_intro_playing: return

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
	if instance and not instance.is_intro_playing:
		instance.trauma = clamp(instance.trauma + amount, 0.0, 1.0)

static func hit_stop(duration_sec: float = 0.06) -> void:
	if instance and instance.is_inside_tree():
		Engine.time_scale = 0.05
		await instance.get_tree().create_timer(duration_sec * 0.05).timeout
		Engine.time_scale = 1.0
