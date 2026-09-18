extends Control

## SumoVictory3D.gd
## Bảng vinh danh Vua Sumo Ragdoll khi trận đấu kết thúc: Trophy vàng, Avatar đấu thủ, phím tắt và nút bấm texture mượt mà

@onready var winner_label: Label = $Center/Panel/VBox/WinnerLabel
@onready var stats_vbox: VBoxContainer = $Center/Panel/VBox/StatsVBox
@onready var rematch_btn: BaseButton = $Center/Panel/VBox/ButtonsHBox/RematchBtn
@onready var menu_btn: BaseButton = $Center/Panel/VBox/ButtonsHBox/MenuBtn

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	visible = false
	if SumoGameManager.has_signal("round_ended"):
		SumoGameManager.round_ended.connect(_on_round_ended)
	rematch_btn.pressed.connect(_on_rematch)
	menu_btn.pressed.connect(_on_menu)

func _unhandled_input(event: InputEvent) -> void:
	if not visible:
		return
	if event.is_action_pressed("ui_accept") or (event is InputEventKey and event.pressed and (event.keycode == KEY_SPACE or event.keycode == KEY_ENTER)):
		get_viewport().set_input_as_handled()
		_on_rematch()
	elif event.is_action_pressed("ui_cancel") or (event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE):
		get_viewport().set_input_as_handled()
		_on_menu()

func _on_round_ended(winner_id: int, summary: Dictionary) -> void:
	visible = true
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	
	var win_name = SumoGameManager.TEAM_NAMES[winner_id - 1]
	var win_color = SumoGameManager.TEAM_COLORS[winner_id - 1]
	
	# Kiểm tra nếu ở chế độ 1 người và người chơi 1 bị loại
	if SumoGameManager.current_mode == 0 and summary["lives"][0] <= 0:
		winner_label.text = "💀 BẠN ĐÃ BỊ HẤT VĂNG KHỎI SÀN ĐẤU! 💀"
		winner_label.modulate = Color(1.0, 0.35, 0.45)
	else:
		winner_label.text = "👑 %s CHIẾN THẮNG VÕ ĐÀI! 👑" % win_name
		winner_label.modulate = win_color
	
	for c in stats_vbox.get_children():
		c.queue_free()
		
	for i in range(4):
		if SumoGameManager.player_configs[i] != "off":
			var row = HBoxContainer.new()
			row.alignment = BoxContainer.ALIGNMENT_CENTER
			row.add_theme_constant_override("separation", 12)
			
			# Avatar icon
			var avatar = TextureRect.new()
			avatar.custom_minimum_size = Vector2(36, 36)
			avatar.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			avatar.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			var ava_path = "res://assets/textures/ui/avatar_p%d.png" % (i + 1)
			if ResourceLoader.exists(ava_path):
				avatar.texture = load(ava_path)
			row.add_child(avatar)
			
			var l = Label.new()
			var p_lives = summary["lives"][i]
			var p_outs = summary["ring_outs"][i]
			var p_downs = summary["knockdowns"][i]
			var status = "SỐNG SÓT" if p_lives > 0 else "BỊ LOẠI"
			l.text = "%s: %s | Hất văng: %d | Cú đấm: %d" % [SumoGameManager.TEAM_NAMES[i], status, p_outs, p_downs]
			l.modulate = SumoGameManager.TEAM_COLORS[i]
			l.add_theme_font_size_override("font_size", 16)
			row.add_child(l)
			
			stats_vbox.add_child(row)

func _on_rematch() -> void:
	SumoSoundManager.play_sfx("punch_heavy", 1.2)
	visible = false
	if SumoGameManager.current_mode == 0:
		SumoGameManager.start_solo_mode()
	else:
		SumoGameManager.start_party_mode(SumoGameManager.player_configs)
	get_tree().reload_current_scene()

func _on_menu() -> void:
	SumoSoundManager.play_sfx("punch_heavy", 0.9)
	visible = false
	SumoGameManager.change_scene("res://scenes/ui/SumoMenu3D.tscn")
