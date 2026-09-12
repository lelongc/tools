class_name InventoryItemUI
extends Control

signal item_drag_started(item_ui: InventoryItemUI)
signal item_drag_ended(item_ui: InventoryItemUI, drop_pos: Vector2)
signal item_rotated(item_ui: InventoryItemUI)

var item_data: ItemData
var cell_size: float = 54.0

var is_dragging: bool = false
var drag_offset: Vector2 = Vector2.ZERO
var original_grid_pos: Vector2 = Vector2.ZERO
var original_local_pos: Vector2 = Vector2.ZERO

@onready var texture_rect: TextureRect = $TextureRect
@onready var glow_border: ReferenceRect = $GlowBorder
@onready var name_label: Label = $NameLabel
@onready var rotate_btn: Button = $RotateBtn

func setup(data: ItemData, cell_dim: float = 54.0) -> void:
	item_data = data
	cell_size = cell_dim
	_update_size_and_visuals()

func _ready() -> void:
	if item_data:
		_update_size_and_visuals()
	if rotate_btn:
		rotate_btn.pressed.connect(_on_rotate_pressed)

func _update_size_and_visuals() -> void:
	if not item_data:
		return
	var w = item_data.grid_width * cell_size
	var h = item_data.grid_height * cell_size
	custom_minimum_size = Vector2(w, h)
	size = custom_minimum_size
	
	if texture_rect and not item_data.icon_path.is_empty():
		if ResourceLoader.exists(item_data.icon_path):
			texture_rect.texture = load(item_data.icon_path)
			
	if name_label:
		name_label.text = item_data.display_name
		
	# Đổi màu viền theo phẩm cấp
	if glow_border:
		match item_data.rarity:
			"legendary":
				glow_border.border_color = Color(1.0, 0.84, 0.0, 0.9)
			"epic":
				glow_border.border_color = Color(0.83, 0.0, 0.97, 0.9)
			"rare":
				glow_border.border_color = Color(0.0, 0.94, 1.0, 0.8)
			_:
				glow_border.border_color = Color(0.5, 0.6, 0.7, 0.5)

func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				_start_drag(event.global_position)
			else:
				_end_drag(event.global_position)
		elif event.button_index == MOUSE_BUTTON_RIGHT and event.pressed:
			_rotate()
	elif event is InputEventScreenTouch:
		if event.pressed:
			_start_drag(event.position)
		else:
			_end_drag(event.position)
	elif event is InputEventMouseMotion or event is InputEventScreenDrag:
		if is_dragging:
			global_position = event.global_position - drag_offset

func _start_drag(global_mouse: Vector2) -> void:
	is_dragging = true
	z_index = 100
	drag_offset = global_mouse - global_position
	original_local_pos = position
	SoundManager.play_snap()
	
	# Hiệu ứng nảy nhẹ khi nhấc lên
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2(1.08, 1.08), 0.1)
	emit_signal("item_drag_started", self)

func _end_drag(global_mouse: Vector2) -> void:
	if not is_dragging:
		return
	is_dragging = false
	z_index = 1
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.1)
	emit_signal("item_drag_ended", self, global_mouse)

func _rotate() -> void:
	item_data.rotate_90_clockwise()
	_update_size_and_visuals()
	SoundManager.play_snap()
	emit_signal("item_rotated", self)

func _on_rotate_pressed() -> void:
	_rotate()

func snap_to_pixel_pos(target_pos: Vector2) -> void:
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "position", target_pos, 0.15)

func return_to_original_pos() -> void:
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "position", original_local_pos, 0.18)
