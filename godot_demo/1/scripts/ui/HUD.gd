class_name HUD
extends CanvasLayer

@onready var wave_label: Label = $TopBar/WaveLabel
@onready var timer_label: Label = $TopBar/TimerLabel
@onready var hp_bar: ProgressBar = $TopBar/HpContainer/HpBar
@onready var shards_label: Label = $TopBar/ShardsContainer/ShardsLabel
@onready var kills_label: Label = $TopBar/KillsLabel

@onready var joystick_base: Control = $MobileControls/JoystickBase
@onready var joystick_knob: TextureRect = $MobileControls/JoystickBase/JoystickKnob
@onready var dash_btn: TouchScreenButton = $MobileControls/DashBtn
@onready var pause_btn: Button = $TopBar/PauseBtn

var joystick_active: bool = false
var joystick_touch_index: int = -1
var joystick_radius: float = 60.0

func _ready() -> void:
	GameManager.player_hp_changed.connect(_on_hp_changed)
	GameManager.shards_changed.connect(_on_shards_changed)
	pause_btn.pressed.connect(_on_pause_pressed)
	
	_update_hud()
	joystick_base.visible = false
	
	# Chỉ hiển thị nút điều khiển ảo nếu trên mobile hoặc bật cảm ứng
	if not OS.has_feature("mobile") and not DisplayServer.is_touchscreen_available():
		# Vẫn để joystick cho phép kéo chuột test
		pass

func _update_hud() -> void:
	wave_label.text = "WAVE %d" % GameManager.current_wave
	hp_bar.max_value = GameManager.player_max_hp
	hp_bar.value = GameManager.player_hp
	shards_label.text = str(GameManager.runic_shards)
	kills_label.text = "💀 %d" % GameManager.enemies_killed

func update_wave_timer(time_left: float) -> void:
	var mins = int(time_left) / 60
	var secs = int(time_left) % 60
	timer_label.text = "%02d:%02d" % [mins, secs]
	kills_label.text = "💀 %d" % GameManager.enemies_killed

func _on_hp_changed(curr: float, max_v: float) -> void:
	hp_bar.max_value = max_v
	hp_bar.value = curr

func _on_shards_changed(new_amount: int) -> void:
	shards_label.text = str(new_amount)

func _on_pause_pressed() -> void:
	get_tree().paused = not get_tree().paused

# --- XỬ LÝ VIRTUAL JOYSTICK TRÊN MÀN HÌNH ---
func _input(event: InputEvent) -> void:
	var screen_width = get_viewport().get_visible_rect().size.x
	
	if event is InputEventScreenTouch:
		if event.pressed and event.position.x < screen_width * 0.5:
			# Chạm nửa trái màn hình -> kích hoạt cần gạt
			joystick_active = true
			joystick_touch_index = event.index
			joystick_base.global_position = event.position - Vector2(joystick_radius, joystick_radius)
			joystick_knob.position = Vector2(joystick_radius - 20, joystick_radius - 20)
			joystick_base.visible = true
		elif not event.pressed and event.index == joystick_touch_index:
			_release_joystick()
			
	elif event is InputEventScreenDrag and event.index == joystick_touch_index and joystick_active:
		var center = joystick_base.global_position + Vector2(joystick_radius, joystick_radius)
		var offset = event.position - center
		var clamped_offset = offset.limit_length(joystick_radius)
		joystick_knob.position = Vector2(joystick_radius - 20, joystick_radius - 20) + clamped_offset
		InputManager.virtual_joystick_vector = clamped_offset / joystick_radius
		
	# Cho phép dùng chuột trái giả lập touch ở nửa trái màn hình
	elif event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed and event.position.x < screen_width * 0.4 and not joystick_active:
				joystick_active = true
				joystick_touch_index = 99
				joystick_base.global_position = event.position - Vector2(joystick_radius, joystick_radius)
				joystick_knob.position = Vector2(joystick_radius - 20, joystick_radius - 20)
				joystick_base.visible = true
			elif not event.pressed and joystick_touch_index == 99:
				_release_joystick()
	elif event is InputEventMouseMotion and joystick_active and joystick_touch_index == 99:
		var center = joystick_base.global_position + Vector2(joystick_radius, joystick_radius)
		var offset = event.position - center
		var clamped_offset = offset.limit_length(joystick_radius)
		joystick_knob.position = Vector2(joystick_radius - 20, joystick_radius - 20) + clamped_offset
		InputManager.virtual_joystick_vector = clamped_offset / joystick_radius

func _release_joystick() -> void:
	joystick_active = false
	joystick_touch_index = -1
	joystick_base.visible = false
	InputManager.virtual_joystick_vector = Vector2.ZERO
