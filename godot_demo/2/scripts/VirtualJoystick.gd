extends Control

signal joystick_moved(dir: Vector2)

@export var max_radius: float = 60.0

var is_active: bool = false
var touch_index: int = -1
var stick_center: Vector2 = Vector2.ZERO
var current_vector: Vector2 = Vector2.ZERO

var base_circle: Control = null
var knob_circle: Control = null

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_PASS
	setup_draw()

func setup_draw() -> void:
	queue_redraw()

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed and touch_index == -1:
			var local_pos = get_local_mouse_position()
			if get_rect().has_point(event.position):
				touch_index = event.index
				is_active = true
				stick_center = local_pos
				_update_knob(local_pos)
		elif not event.pressed and event.index == touch_index:
			_reset_joystick()
			
	elif event is InputEventScreenDrag and event.index == touch_index:
		var local_pos = get_local_mouse_position()
		_update_knob(local_pos)
		
	# Hỗ trợ chuột trái trên Desktop
	elif event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				var local_pos = get_local_mouse_position()
				if get_rect().has_point(event.position):
					is_active = true
					stick_center = local_pos
					_update_knob(local_pos)
			else:
				_reset_joystick()
				
	elif event is InputEventMouseMotion and is_active:
		var local_pos = get_local_mouse_position()
		_update_knob(local_pos)

func _update_knob(pos: Vector2) -> void:
	var diff = pos - stick_center
	var dist = diff.length()
	if dist > max_radius:
		diff = diff.normalized() * max_radius
		
	current_vector = diff / max_radius
	joystick_moved.emit(current_vector)
	queue_redraw()

func _reset_joystick() -> void:
	is_active = false
	touch_index = -1
	current_vector = Vector2.ZERO
	joystick_moved.emit(Vector2.ZERO)
	queue_redraw()

func _draw() -> void:
	if not is_active:
		# Draw default subtle joystick at center of control
		var c = size / 2.0
		draw_circle(c, max_radius, Color(1, 1, 1, 0.15))
		draw_circle(c, max_radius, Color(1, 1, 1, 0.4), false, 2.5)
		draw_circle(c, max_radius * 0.4, Color(1, 1, 1, 0.35))
	else:
		# Draw dynamic base and knob
		draw_circle(stick_center, max_radius, Color(1, 1, 1, 0.2))
		draw_circle(stick_center, max_radius, Color(0.4, 0.8, 1.0, 0.6), false, 3.0)
		var knob_pos = stick_center + current_vector * max_radius
		draw_circle(knob_pos, max_radius * 0.45, Color(0.3, 0.85, 0.98, 0.85))
		draw_circle(knob_pos, max_radius * 0.45, Color(1, 1, 1, 0.9), false, 2.0)
