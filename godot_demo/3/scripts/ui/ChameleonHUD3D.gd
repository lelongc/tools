extends Control

## ChameleonHUD3D.gd
## Giao diện điều khiển trong trận đấu: Hiển thị điểm số, dung lượng bụng, thời gian, đợt quái và Bảng Chọn Đột Biến

@onready var timer_label: Label = $TopCenter/Panel/VBox/TimerLabel
@onready var mode_label: Label = $TopCenter/Panel/VBox/ModeLabel

# 4 Khung điểm số
@onready var p1_panel: PanelContainer = $Corners/P1Panel
@onready var p2_panel: PanelContainer = $Corners/P2Panel
@onready var p3_panel: PanelContainer = $Corners/P3Panel
@onready var p4_panel: PanelContainer = $Corners/P4Panel

@onready var p1_score: Label = $Corners/P1Panel/VBox/ScoreLabel
@onready var p1_belly: Label = $Corners/P1Panel/VBox/BellyLabel

@onready var p2_score: Label = $Corners/P2Panel/VBox/ScoreLabel
@onready var p2_belly: Label = $Corners/P2Panel/VBox/BellyLabel

@onready var p3_score: Label = $Corners/P3Panel/VBox/ScoreLabel
@onready var p3_belly: Label = $Corners/P3Panel/VBox/BellyLabel

@onready var p4_score: Label = $Corners/P4Panel/VBox/ScoreLabel
@onready var p4_belly: Label = $Corners/P4Panel/VBox/BellyLabel

# Bảng chọn Đột biến Solo Roguelite
@onready var mutation_modal: Control = $MutationModal
@onready var card_container: HBoxContainer = $MutationModal/Center/Panel/VBox/CardsHBox

var panels: Array[PanelContainer] = []
var score_labels: Array[Label] = []
var belly_labels: Array[Label] = []

func _ready() -> void:
	panels = [p1_panel, p2_panel, p3_panel, p4_panel]
	score_labels = [p1_score, p2_score, p3_score, p4_score]
	belly_labels = [p1_belly, p2_belly, p3_belly, p4_belly]
	
	mutation_modal.visible = false
	
	ChameleonGameManager.scores_updated.connect(_on_scores_updated)
	ChameleonGameManager.timer_updated.connect(_on_timer_updated)
	ChameleonGameManager.wave_started.connect(_on_wave_started)
	ChameleonGameManager.mutation_prompt.connect(_on_mutation_prompt)
	
	_setup_mode_layout()

func _setup_mode_layout() -> void:
	if ChameleonGameManager.current_mode == 0: # SOLO_ROGUELITE
		mode_label.text = "🏆 SINH TỒN ĐỢT 1"
		p2_panel.visible = false
		p3_panel.visible = false
		p4_panel.visible = false
	else:
		mode_label.text = "🎭 ĐẠI CHIẾN TIỆC TÙNG"
		for i in range(4):
			panels[i].visible = (ChameleonGameManager.player_configs[i] != "off")

func _on_scores_updated(scores: Array, bellies: Array) -> void:
	for i in range(4):
		if i < scores.size() and i < score_labels.size():
			score_labels[i].text = "%d ĐIỂM" % scores[i]
		if i < bellies.size() and i < belly_labels.size():
			belly_labels[i].text = "🍔 Bụng: %d hình nhân" % bellies[i]

func _on_timer_updated(time_left: float) -> void:
	var mins = int(time_left) / 60
	var secs = int(time_left) % 60
	timer_label.text = "%02d:%02d" % [mins, secs]
	if time_left <= 8.0:
		timer_label.modulate = Color(1.0, 0.2, 0.2)
	else:
		timer_label.modulate = Color(1.0, 0.9, 0.25)

func _on_wave_started(wave_idx: int) -> void:
	mode_label.text = "🏆 SINH TỒN ĐỢT %d" % wave_idx
	mutation_modal.visible = false

func _on_mutation_prompt(options: Array[Dictionary]) -> void:
	mutation_modal.visible = true
	
	# Xóa các thẻ bài cũ
	for c in card_container.get_children():
		c.queue_free()
		
	# Tạo 3 thẻ bài đột biến ngẫu nhiên
	for opt in options:
		var card = PanelContainer.new()
		card.custom_minimum_size = Vector2(200, 240)
		
		var sbox = StyleBoxFlat.new()
		sbox.bg_color = Color(0.12, 0.15, 0.22, 0.95)
		sbox.border_width_left = 3
		sbox.border_width_top = 3
		sbox.border_width_right = 3
		sbox.border_width_bottom = 3
		sbox.border_color = Color(1.0, 0.85, 0.2, 1.0)
		sbox.corner_radius_top_left = 12
		sbox.corner_radius_top_right = 12
		sbox.corner_radius_bottom_right = 12
		sbox.corner_radius_bottom_left = 12
		sbox.content_margin_left = 14
		sbox.content_margin_top = 14
		sbox.content_margin_right = 14
		sbox.content_margin_bottom = 14
		card.add_theme_stylebox_override("panel", sbox)
		
		var vbox = VBoxContainer.new()
		vbox.add_theme_constant_override("separation", 10)
		card.add_child(vbox)
		
		var icon_lbl = Label.new()
		icon_lbl.text = opt["icon"]
		icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		icon_lbl.add_theme_font_size_override("font_size", 42)
		vbox.add_child(icon_lbl)
		
		var title_lbl = Label.new()
		title_lbl.text = opt["name"]
		title_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		title_lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3))
		title_lbl.add_theme_font_size_override("font_size", 16)
		vbox.add_child(title_lbl)
		
		var desc_lbl = Label.new()
		desc_lbl.text = opt["desc"]
		desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		desc_lbl.add_theme_font_size_override("font_size", 12)
		vbox.add_child(desc_lbl)
		
		var spacer = Control.new()
		spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
		vbox.add_child(spacer)
		
		var btn = Button.new()
		btn.text = "CHỌN NÂNG CẤP"
		btn.pressed.connect(func():
			ChameleonSoundManager.play_sfx("powerup", 1.3)
			ChameleonGameManager.apply_mutation(opt["id"])
		)
		vbox.add_child(btn)
		
		card_container.add_child(card)
