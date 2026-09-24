extends Control

@export var current_world: int = 1

const WORLD_ICONS: Array[String] = ["🌾", "⛏", "⚙", "🌋", "💎", "⚡", "🧪", "❄", "🐉", "🌌"]

@onready var grid: GridContainer = $ScrollContainer/GridContainer
@onready var world_title: Label = $WorldFrame/WorldNav/WorldTitle
@onready var total_stars_label: Label = $TopBar/Margin/HBox/StarBadge/TotalStars
@onready var btn_back: Button = $TopBar/Margin/HBox/BtnBack
@onready var btn_prev_world: Button = $WorldFrame/WorldNav/BtnPrevWorld
@onready var btn_next_world: Button = $WorldFrame/WorldNav/BtnNextWorld
@onready var world_ribbon_scroll: ScrollContainer = get_node_or_null("WorldRibbonScroll")
@onready var world_ribbon_box: HBoxContainer = get_node_or_null("WorldRibbonScroll/WorldRibbonHBox")

var ribbon_buttons: Array[Button] = []

func _ready() -> void:
	btn_back.pressed.connect(func(): GameManager.go_to_main_menu())
	btn_prev_world.pressed.connect(_prev_world)
	btn_next_world.pressed.connect(_next_world)

	var sky_rect = get_node_or_null("Background/SkyPanorama")
	if sky_rect:
		var t_sky = ParticleHelper._safe_load("res://assets/sprites/environment/sky_clouds_panorama.svg")
		if t_sky:
			sky_rect.texture = t_sky
			sky_rect.modulate = Color(0.35, 0.2, 0.5, 0.45)

	var cav_rect = get_node_or_null("Background/CavernBackdrop")
	if cav_rect:
		var t_cav = ParticleHelper._safe_load("res://assets/sprites/environment/cavern_backdrop_dungeon.svg")
		if t_cav:
			cav_rect.texture = t_cav
			cav_rect.modulate = Color(0.5, 0.35, 0.7, 0.55)

	if has_node("/root/LocalizationManager"):
		get_node("/root/LocalizationManager").language_changed.connect(func(_c): _render_world_levels())

	# Tự động mở trang Thế Giới tương ứng với màn chơi gần nhất của người chơi
	var cur_lvl = GameManager.current_level if has_node("/root/GameManager") else 1
	current_world = clamp(int(float(cur_lvl - 1) / 20.0) + 1, 1, 10)

	_apply_safe_area()
	get_viewport().size_changed.connect(_apply_safe_area)

	_build_world_ribbon()
	_update_total_stars()
	_render_world_levels()

func _build_world_ribbon() -> void:
	if not world_ribbon_box: return
	for child in world_ribbon_box.get_children():
		child.queue_free()
	ribbon_buttons.clear()

	for i in range(10):
		var w_idx = i + 1
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(56, 34)
		btn.text = "%s W%d" % [WORLD_ICONS[i], w_idx]
		btn.add_theme_font_size_override("font_size", 12)
		btn.focus_mode = Control.FOCUS_NONE

		var norm = StyleBoxFlat.new()
		norm.corner_radius_top_left = 10
		norm.corner_radius_top_right = 10
		norm.corner_radius_bottom_right = 10
		norm.corner_radius_bottom_left = 10
		norm.bg_color = Color(0.18, 0.10, 0.28, 0.9)
		norm.border_width_bottom = 2
		norm.border_width_top = 1
		norm.border_width_left = 1
		norm.border_width_right = 1
		norm.border_color = Color(0.4, 0.3, 0.55, 0.6)
		btn.add_theme_stylebox_override("normal", norm)

		btn.pressed.connect(func():
			if current_world != w_idx:
				current_world = w_idx
				_render_world_levels()
				if has_node("/root/SoundManager"):
					get_node("/root/SoundManager").play_button_click()
		)
		world_ribbon_box.add_child(btn)
		ribbon_buttons.append(btn)

func _update_total_stars() -> void:
	if has_node("/root/SaveManager") and total_stars_label:
		var stars = get_node("/root/SaveManager").save_data.get("total_stars", 0)
		total_stars_label.text = "%d / 600" % stars

func _prev_world() -> void:
	if current_world > 1:
		current_world -= 1
		_render_world_levels()

func _next_world() -> void:
	if current_world < 10:
		current_world += 1
		_render_world_levels()

func _render_world_levels() -> void:
	if has_node("/root/LocalizationManager"):
		var lm = get_node("/root/LocalizationManager")
		world_title.text = lm.t("KEY_WORLD_%d" % current_world)
		btn_back.text = " " + lm.t("KEY_MENU")

	# Cập nhật trạng thái dải ruy băng Thế Giới (World Quick Jump Ribbon)
	for i in range(ribbon_buttons.size()):
		var r_btn = ribbon_buttons[i]
		var is_active = (i + 1 == current_world)
		var style = StyleBoxFlat.new()
		style.corner_radius_top_left = 10
		style.corner_radius_top_right = 10
		style.corner_radius_bottom_right = 10
		style.corner_radius_bottom_left = 10
		if is_active:
			style.bg_color = Color(0.85, 0.62, 0.12, 0.95)
			style.border_width_bottom = 3
			style.border_width_top = 1
			style.border_width_left = 1
			style.border_width_right = 1
			style.border_color = Color(1.0, 0.95, 0.6, 1.0)
			r_btn.add_theme_color_override("font_color", Color(0.12, 0.05, 0.02, 1.0))
		else:
			style.bg_color = Color(0.18, 0.10, 0.28, 0.9)
			style.border_width_bottom = 2
			style.border_width_top = 1
			style.border_width_left = 1
			style.border_width_right = 1
			style.border_color = Color(0.4, 0.3, 0.55, 0.6)
			r_btn.add_theme_color_override("font_color", Color(0.85, 0.8, 0.9, 0.9))
		r_btn.add_theme_stylebox_override("normal", style)
		r_btn.add_theme_stylebox_override("hover", style)

	# Đồng bộ bối cảnh bầu trời & hang ngầm chân thực theo từng Thế Giới
	var world_names = ["farm", "quarry", "industrial", "lava", "crystal", "cyber", "toxic", "glacier", "dragon", "celestial"]
	var w_name = world_names[current_world - 1]
	var num_str = "%02d" % current_world
	var sky_path = "res://assets/sprites/environment/worlds/sky_w%s_%s.svg" % [num_str, w_name]
	var cav_path = "res://assets/sprites/environment/worlds/cavern_w%s_%s.svg" % [num_str, w_name]

	var sky_rect = get_node_or_null("Background/SkyPanorama") as TextureRect
	if sky_rect:
		var t_sky = ParticleHelper._safe_load(sky_path)
		if t_sky:
			sky_rect.texture = t_sky
			sky_rect.modulate = Color(1.0, 1.0, 1.0, 0.65)

	var cav_rect = get_node_or_null("Background/CavernBackdrop") as TextureRect
	if cav_rect:
		var t_cav = ParticleHelper._safe_load(cav_path)
		if t_cav:
			cav_rect.texture = t_cav
			cav_rect.modulate = Color(1.0, 1.0, 1.0, 0.8)

	btn_prev_world.disabled = (current_world <= 1)
	btn_next_world.disabled = (current_world >= 10)

	# Xóa các nút cũ
	for child in grid.get_children():
		child.queue_free()

	var start_lvl = (current_world - 1) * 20 + 1
	var end_lvl = start_lvl + 19

	var tex_star_full = preload("res://assets/ui/icons/icon_star.svg")

	for lvl in range(start_lvl, end_lvl + 1):
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(106, 88)
		btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		btn.text = "" # Không dùng text thô với emoji!

		var is_unlocked = true
		var stars = 0
		if has_node("/root/SaveManager"):
			is_unlocked = get_node("/root/SaveManager").is_level_unlocked(lvl)
			stars = get_node("/root/SaveManager").get_level_stars(lvl)

		var is_boss_level = (lvl % 20 == 0)

		var style_norm = StyleBoxFlat.new()
		var style_press = StyleBoxFlat.new()
		style_norm.corner_radius_top_left = 14
		style_norm.corner_radius_top_right = 14
		style_norm.corner_radius_bottom_right = 14
		style_norm.corner_radius_bottom_left = 14
		style_press.corner_radius_top_left = 14
		style_press.corner_radius_top_right = 14
		style_press.corner_radius_bottom_right = 14
		style_press.corner_radius_bottom_left = 14

		# Khung hiển thị nội dung thẻ màn chơi (VBoxContainer)
		var card_vbox = VBoxContainer.new()
		card_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		card_vbox.mouse_filter = Control.MOUSE_FILTER_IGNORE
		card_vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
		card_vbox.add_theme_constant_override("separation", 2 if is_boss_level else 4)
		btn.add_child(card_vbox)

		if is_boss_level:
			var boss_badge = Label.new()
			boss_badge.text = "👑 BOSS"
			boss_badge.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			boss_badge.add_theme_font_size_override("font_size", 10)
			boss_badge.add_theme_color_override("font_color", Color(1.0, 0.35, 0.35))
			boss_badge.add_theme_constant_override("shadow_offset_y", 1)
			boss_badge.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.9))
			card_vbox.add_child(boss_badge)

		var lvl_lbl = Label.new()
		lvl_lbl.text = str(lvl)
		lvl_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lvl_lbl.add_theme_font_size_override("font_size", 20 if is_boss_level else 24)
		lvl_lbl.add_theme_constant_override("shadow_offset_y", 2)
		lvl_lbl.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
		card_vbox.add_child(lvl_lbl)

		if is_unlocked:
			if is_boss_level:
				lvl_lbl.add_theme_color_override("font_color", Color(1.0, 0.45, 0.45))
				style_norm.bg_color = Color(0.32, 0.08, 0.18, 0.95)
				style_norm.border_color = Color(1.0, 0.28, 0.35, 0.95)
				style_norm.border_width_bottom = 5
				style_norm.border_width_top = 2
				style_norm.border_width_left = 2
				style_norm.border_width_right = 2
				style_press.bg_color = Color(0.24, 0.05, 0.12, 0.95)
				style_press.border_color = Color(0.8, 0.2, 0.25)
				style_press.border_width_bottom = 2
				style_press.border_width_top = 2
				style_press.border_width_left = 2
				style_press.border_width_right = 2
			elif stars == 3:
				lvl_lbl.add_theme_color_override("font_color", Color(1.0, 0.95, 0.4))
				style_norm.bg_color = Color(0.26, 0.14, 0.42, 0.95)
				style_norm.border_color = Color(1.0, 0.88, 0.22, 1.0) # Gold Shimmer border
				style_norm.border_width_bottom = 5
				style_norm.border_width_top = 2
				style_norm.border_width_left = 2
				style_norm.border_width_right = 2
				style_press.bg_color = Color(0.20, 0.10, 0.32, 0.95)
				style_press.border_color = Color(0.9, 0.75, 0.15)
				style_press.border_width_bottom = 2
				style_press.border_width_top = 2
				style_press.border_width_left = 2
				style_press.border_width_right = 2
			else:
				lvl_lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.25))
				style_norm.bg_color = Color(0.24, 0.12, 0.38, 0.95)
				style_norm.border_color = Color(1.0, 0.84, 0.0, 0.85)
				style_norm.border_width_bottom = 5
				style_norm.border_width_top = 2
				style_norm.border_width_left = 2
				style_norm.border_width_right = 2
				style_press.bg_color = Color(0.18, 0.08, 0.28, 0.95)
				style_press.border_color = Color(0.8, 0.65, 0.0)
				style_press.border_width_bottom = 2
				style_press.border_width_top = 2
				style_press.border_width_left = 2
				style_press.border_width_right = 2

			var stars_hbox = HBoxContainer.new()
			stars_hbox.alignment = BoxContainer.ALIGNMENT_CENTER
			stars_hbox.add_theme_constant_override("separation", 6)
			card_vbox.add_child(stars_hbox)

			# 3 Ngôi sao Vector cao cấp chuẩn Angry Birds
			for s_idx in range(3):
				var s_rect = TextureRect.new()
				s_rect.custom_minimum_size = Vector2(20, 20)
				s_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				s_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				s_rect.texture = tex_star_full
				s_rect.modulate = Color.WHITE if (s_idx < stars) else Color(0.25, 0.18, 0.35, 0.65)
				stars_hbox.add_child(s_rect)

			btn.pivot_offset = Vector2(53, 44)
			btn.add_theme_stylebox_override("normal", style_norm)
			btn.add_theme_stylebox_override("hover", style_norm)
			btn.add_theme_stylebox_override("pressed", style_press)

			btn.button_down.connect(func():
				var tw = btn.create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
				tw.tween_property(btn, "scale", Vector2(0.93, 0.93), 0.08)
			)
			btn.button_up.connect(func():
				var tw = btn.create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
				tw.tween_property(btn, "scale", Vector2.ONE, 0.15)
			)

			var target_lvl = lvl
			btn.pressed.connect(func():
				if has_node("/root/SoundManager"):
					get_node("/root/SoundManager").play_button_click()
				GameManager.load_level(target_lvl)
			)
		else:
			lvl_lbl.add_theme_color_override("font_color", Color(0.5, 0.45, 0.6))

			var lock_lbl = Label.new()
			var lm = get_node_or_null("/root/LocalizationManager")
			lock_lbl.text = lm.t("KEY_LOCKED") if lm else "LOCKED"
			lock_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			lock_lbl.add_theme_font_size_override("font_size", 12)
			lock_lbl.add_theme_color_override("font_color", Color(0.45, 0.4, 0.55))
			card_vbox.add_child(lock_lbl)

			style_norm.bg_color = Color(0.13, 0.08, 0.18, 0.9)
			style_norm.border_width_bottom = 3
			style_norm.border_width_top = 1
			style_norm.border_width_left = 1
			style_norm.border_width_right = 1
			style_norm.border_color = Color(0.32, 0.22, 0.4, 0.5)

			btn.disabled = true
			btn.add_theme_stylebox_override("disabled", style_norm)

		grid.add_child(btn)

func _exit_tree() -> void:
	if get_viewport() and get_viewport().size_changed.is_connected(_apply_safe_area):
		get_viewport().size_changed.disconnect(_apply_safe_area)
	ribbon_buttons.clear()

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		GameManager.go_to_main_menu()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		GameManager.go_to_main_menu()

func _apply_safe_area() -> void:
	if not is_inside_tree(): return
	var safe_rect = DisplayServer.get_display_safe_area()
	var win_size = DisplayServer.window_get_size()
	if win_size.y <= 0: return

	var vp_size = get_viewport().get_visible_rect().size
	var scale_y = vp_size.y / float(win_size.y)
	var top_inset = float(safe_rect.position.y) * scale_y

	var top_bar = get_node_or_null("TopBar") as Control
	if top_bar:
		var target_top = max(10.0, top_inset + 6.0)
		top_bar.offset_top = target_top
