extends Control

## ChameleonVictory3D.gd
## Bảng tổng kết vòng đấu Solo & Tiệc tùng

@onready var title_label: Label = $Center/Panel/VBox/TitleLabel
@onready var stats_container: VBoxContainer = $Center/Panel/VBox/StatsContainer
@onready var rematch_btn: Button = $Center/Panel/VBox/HBox/RematchBtn
@onready var menu_btn: Button = $Center/Panel/VBox/HBox/MenuBtn

func _ready() -> void:
	visible = false
	ChameleonGameManager.match_ended.connect(_on_match_ended)
	rematch_btn.pressed.connect(_on_rematch)
	menu_btn.pressed.connect(_on_menu)

func _on_match_ended(winner_id: int, summary: Dictionary) -> void:
	visible = true
	for c in stats_container.get_children():
		c.queue_free()
		
	if ChameleonGameManager.current_mode == 0: # SOLO
		title_label.text = "🏆 TỔNG KẾT VÒNG SINH TỒN 🏆"
		title_label.modulate = Color(1.0, 0.85, 0.2)
		
		var l1 = Label.new()
		l1.text = "ĐỢT QUÁI CAO NHẤT: ĐỢT %d" % ChameleonGameManager.current_wave
		l1.add_theme_font_size_override("font_size", 18)
		l1.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		stats_container.add_child(l1)
		
		var l2 = Label.new()
		l2.text = "TỔNG ĐIỂM: %d ĐIỂM" % ChameleonGameManager.scores[0]
		l2.add_theme_font_size_override("font_size", 22)
		l2.add_theme_color_override("font_color", Color(0.3, 0.9, 1.0))
		l2.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		stats_container.add_child(l2)
		
		var l3 = Label.new()
		l3.text = "Đã nuốt: %d hình nhân | Nổ pháo sơn Domino: %d lần" % [ChameleonGameManager.mannequins_slurped[0], ChameleonGameManager.domino_splats[0]]
		l3.add_theme_font_size_override("font_size", 14)
		l3.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		stats_container.add_child(l3)
	else:
		var win_name = ChameleonGameManager.TEAM_NAMES[winner_id - 1]
		var win_color = ChameleonGameManager.TEAM_COLORS[winner_id - 1]
		title_label.text = "👑 %s CHIẾN THẮNG! 👑" % win_name
		title_label.modulate = win_color
		
		for i in range(4):
			if ChameleonGameManager.player_configs[i] != "off":
				var entry = Label.new()
				entry.text = "%s: %d Điểm (Nuốt %d | Domino %d)" % [ChameleonGameManager.TEAM_NAMES[i], ChameleonGameManager.scores[i], ChameleonGameManager.mannequins_slurped[i], ChameleonGameManager.domino_splats[i]]
				entry.modulate = ChameleonGameManager.TEAM_COLORS[i]
				entry.add_theme_font_size_override("font_size", 16)
				entry.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				stats_container.add_child(entry)

func _on_rematch() -> void:
	ChameleonSoundManager.play_sfx("tongue_shoot", 1.2)
	if ChameleonGameManager.current_mode == 0:
		ChameleonGameManager.start_solo_mode()
	else:
		ChameleonGameManager.start_party_mode(ChameleonGameManager.player_configs, 90.0)
	get_tree().reload_current_scene()

func _on_menu() -> void:
	ChameleonSoundManager.play_sfx("tongue_shoot", 0.9)
	ChameleonGameManager.change_scene("res://scenes/ui/ChameleonMenu3D.tscn")
