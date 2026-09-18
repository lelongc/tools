extends Control

## SumoHUD3D.gd
## Giao diện hiển thị Mạng Sống bằng Graphic Heart Textures, Avatar đấu thủ, Vương miện Hất Văng và Banner giải đấu

@onready var timer_label: Label = $TopCenter/BannerTexture/VBox/TimerLabel
@onready var mode_label: Label = $TopCenter/BannerTexture/VBox/ModeLabel

@onready var p1_panel: Control = $Corners/P1Panel
@onready var p2_panel: Control = $Corners/P2Panel
@onready var p3_panel: Control = $Corners/P3Panel
@onready var p4_panel: Control = $Corners/P4Panel

@onready var p1_hearts: HBoxContainer = $Corners/P1Panel/ContentHBox/VBox/HeartsHBox
@onready var p2_hearts: HBoxContainer = $Corners/P2Panel/ContentHBox/VBox/HeartsHBox
@onready var p3_hearts: HBoxContainer = $Corners/P3Panel/ContentHBox/VBox/HeartsHBox
@onready var p4_hearts: HBoxContainer = $Corners/P4Panel/ContentHBox/VBox/HeartsHBox

@onready var p1_score: Label = $Corners/P1Panel/ContentHBox/VBox/ScoreHBox/ScoreLabel
@onready var p2_score: Label = $Corners/P2Panel/ContentHBox/VBox/ScoreHBox/ScoreLabel
@onready var p3_score: Label = $Corners/P3Panel/ContentHBox/VBox/ScoreHBox/ScoreLabel
@onready var p4_score: Label = $Corners/P4Panel/ContentHBox/VBox/ScoreHBox/ScoreLabel

var panels: Array[Control] = []
var hearts_boxes: Array[HBoxContainer] = []
var score_labels: Array[Label] = []

var heart_full_tex: Texture2D
var heart_empty_tex: Texture2D
var skull_tex: Texture2D

func _ready() -> void:
	panels = [p1_panel, p2_panel, p3_panel, p4_panel]
	hearts_boxes = [p1_hearts, p2_hearts, p3_hearts, p4_hearts]
	score_labels = [p1_score, p2_score, p3_score, p4_score]
	
	heart_full_tex = load("res://assets/textures/ui/heart_full.png")
	heart_empty_tex = load("res://assets/textures/ui/heart_empty.png")
	skull_tex = load("res://assets/textures/ui/skull.png")
	
	SumoGameManager.lives_updated.connect(_on_lives_updated)
	SumoGameManager.timer_updated.connect(_on_timer_updated)
	if SumoGameManager.has_signal("wave_advanced"):
		SumoGameManager.wave_advanced.connect(_on_wave_advanced)
		
	_setup_layout()

func _setup_layout() -> void:
	if SumoGameManager.current_mode == 0: # SOLO_SURVIVAL
		mode_label.text = "🏆 SINH TỒN SUMO ĐỢT %d" % SumoGameManager.solo_wave
		p2_panel.visible = false
		p3_panel.visible = false
		p4_panel.visible = false
	else:
		mode_label.text = "🥊 ĐẠI CHIẾN SUMO TIỆC TÙNG"
		for i in range(4):
			panels[i].visible = (SumoGameManager.player_configs[i] != "off")
			
	_on_lives_updated(SumoGameManager.lives, SumoGameManager.ring_outs)

func _on_wave_advanced(wave: int) -> void:
	mode_label.text = "🏆 SINH TỒN SUMO ĐỢT %d" % wave
	var tw = create_tween()
	tw.tween_property(mode_label, "scale", Vector2(1.25, 1.25), 0.2)
	tw.tween_property(mode_label, "scale", Vector2.ONE, 0.2)

func _on_lives_updated(lives: Array, ring_outs: Array) -> void:
	for i in range(4):
		if i < lives.size() and i < hearts_boxes.size():
			var hbox = hearts_boxes[i]
			for c in hbox.get_children():
				c.queue_free()
				
			var cur_lives = lives[i]
			if cur_lives <= 0:
				var sk = TextureRect.new()
				sk.custom_minimum_size = Vector2(22, 22)
				sk.texture = skull_tex
				sk.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				sk.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				hbox.add_child(sk)
				
				var l = Label.new()
				l.text = "BỊ LOẠI"
				l.add_theme_font_size_override("font_size", 12)
				l.modulate = Color(0.85, 0.4, 0.4)
				hbox.add_child(l)
			else:
				var max_hearts = 3
				for h in range(max_hearts):
					var tr = TextureRect.new()
					tr.custom_minimum_size = Vector2(22, 22)
					tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
					tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
					tr.texture = heart_full_tex if h < cur_lives else heart_empty_tex
					hbox.add_child(tr)
					
		if i < ring_outs.size() and i < score_labels.size():
			score_labels[i].text = "%d Đối thủ" % ring_outs[i]

func _on_timer_updated(time_left: float) -> void:
	var mins = int(time_left) / 60
	var secs = int(time_left) % 60
	timer_label.text = "%02d:%02d" % [mins, secs]
	if time_left <= 10.0:
		timer_label.modulate = Color(1.0, 0.25, 0.25)
	else:
		timer_label.modulate = Color(1.0, 0.92, 0.35)
