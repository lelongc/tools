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

	_apply_cartoon_ui_theme()
	_build_world_ribbon()
	_update_total_stars()
	_render_world_levels()

func _apply_cartoon_ui_theme() -> void:
	var top_bar = get_node_or_null("TopBar")
	if top_bar:
		var sbt = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_top_bar_hud.svg", 20, 8, 20, 16)
		if sbt: top_bar.add_theme_stylebox_override("panel", sbt)

	var star_badge = get_node_or_null("TopBar/Margin/HBox/StarBadge")
	if star_badge:
		var sbt = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_badge_capsule.svg", 16, 12, 16, 16)
		if sbt: star_badge.add_theme_stylebox_override("panel", sbt)

	if world_title:
		var sbt_ribbon = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/banner_ribbon_wood.svg", 36, 12, 36, 18)
		if sbt_ribbon:
			world_title.add_theme_stylebox_override("normal", sbt_ribbon)
			world_title.add_theme_color_override("font_color", Color(1.0, 0.96, 0.90))
			world_title.add_theme_color_override("font_outline_color", Color(0.18, 0.08, 0.02))
			world_title.add_theme_constant_override("outline_size", 6)

	var world_frame = get_node_or_null("WorldFrame")
	if world_frame:
		var sbt_frame = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_top_bar_hud.svg", 20, 8, 20, 16)
		if sbt_frame: world_frame.add_theme_stylebox_override("panel", sbt_frame)

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
		if has_node("/root/SoundManager"):
			get_node("/root/SoundManager").play_button_click()
		current_world -= 1
		_render_world_levels()

func _next_world() -> void:
	if current_world < 10:
		if has_node("/root/SoundManager"):
			get_node("/root/SoundManager").play_button_click()
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
		if is_active:
			var sbt = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_badge_capsule.svg", 16, 16, 16, 16)
			r_btn.add_theme_stylebox_override("normal", sbt)
			r_btn.add_theme_stylebox_override("hover", sbt)
			r_btn.add_theme_color_override("font_color", Color(1.0, 0.95, 0.6, 1.0))
		else:
			var sbt = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/btn_wood_brown_normal.svg", 12, 12, 12, 16)
			r_btn.add_theme_stylebox_override("normal", sbt)
			r_btn.add_theme_stylebox_override("hover", sbt)
			r_btn.add_theme_color_override("font_color", Color(0.85, 0.8, 0.9, 0.9))

	if world_ribbon_scroll and ribbon_buttons.size() >= current_world:
		var active_btn = ribbon_buttons[current_world - 1]
		world_ribbon_scroll.ensure_control_visible(active_btn)

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
			boss_badge.add_theme_color_override("font_color", Color(1.0, 0.45, 0.45))
			boss_badge.add_theme_constant_override("shadow_offset_y", 1)
			boss_badge.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.9))
			card_vbox.add_child(boss_badge)

		var lvl_lbl = Label.new()
		lvl_lbl.text = str(lvl)
		lvl_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lvl_lbl.add_theme_font_size_override("font_size", 20 if is_boss_level else 24)
		lvl_lbl.add_theme_constant_override("shadow_offset_y", 2)
		lvl_lbl.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.85))
		card_vbox.add_child(lvl_lbl)

		var sbt_card: StyleBoxTexture = null
		if not is_unlocked:
			sbt_card = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/card_level_locked.svg", 16, 16, 16, 20)
			lvl_lbl.add_theme_color_override("font_color", Color(0.5, 0.45, 0.6))
			var lock_lbl = Label.new()
			var lm = get_node_or_null("/root/LocalizationManager")
			lock_lbl.text = lm.t("KEY_LOCKED") if lm else "LOCKED"
			lock_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			lock_lbl.add_theme_font_size_override("font_size", 11)
			lock_lbl.add_theme_color_override("font_color", Color(0.55, 0.50, 0.65))
			card_vbox.add_child(lock_lbl)

			btn.pivot_offset = Vector2(53, 44)
			btn.pressed.connect(func():
				if has_node("/root/SoundManager"):
					get_node("/root/SoundManager").play_button_click()
				var tw = btn.create_tween()
				tw.tween_property(btn, "rotation", -0.07, 0.04)
				tw.tween_property(btn, "rotation", 0.07, 0.04)
				tw.tween_property(btn, "rotation", -0.04, 0.04)
				tw.tween_property(btn, "rotation", 0.0, 0.04)
				var lm_inst = get_node_or_null("/root/LocalizationManager")
				var lock_msg = lm_inst.t("KEY_LOCKED") if lm_inst else "LOCKED"
				ParticleHelper.spawn_comic_popup(self, btn.global_position + Vector2(53, 20), "🔒 " + lock_msg, Color(1.0, 0.4, 0.4))
			)
		elif is_boss_level:
			sbt_card = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/card_level_boss.svg", 16, 16, 16, 20)
			lvl_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.85))
		else:
			sbt_card = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/card_level_unlocked.svg", 16, 16, 16, 20)
			lvl_lbl.add_theme_color_override("font_color", Color(1.0, 0.92, 0.35) if stars == 3 else Color(1.0, 0.98, 0.90))

		if sbt_card:
			btn.add_theme_stylebox_override("normal", sbt_card)
			btn.add_theme_stylebox_override("hover", sbt_card)
			btn.add_theme_stylebox_override("pressed", sbt_card)
			btn.add_theme_stylebox_override("disabled", sbt_card)

		if is_unlocked:
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
		top_bar.offset_bottom = target_top + 56.0
