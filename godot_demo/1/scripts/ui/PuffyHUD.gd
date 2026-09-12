class_name PuffyHUD
extends CanvasLayer

@onready var title_label: Label = $TopBar/TitleLabel
@onready var shots_label: Label = $TopBar/ShotsContainer/ShotsLabel
@onready var pearls_label: Label = $TopBar/PearlsContainer/PearlsLabel
@onready var hint_label: Label = $HintContainer/HintLabel
@onready var pause_btn: Button = $TopBar/PauseBtn

func _ready() -> void:
	PuffyGameManager.shots_changed.connect(_on_shots_changed)
	PuffyGameManager.pearls_changed.connect(_on_pearls_changed)
	PuffyGameManager.score_changed.connect(_on_score_changed)
	pause_btn.pressed.connect(_on_pause_pressed)
	
	_update_hud()

func _update_hud() -> void:
	var world_name = PuffyGameManager.get_world_name(PuffyGameManager.current_level)
	if PuffyGameManager.current_mode == PuffyGameManager.GameMode.CAMPAIGN:
		title_label.text = "MÀN %d: %s | ĐIỂM: %d (x%d)" % [
			PuffyGameManager.current_level,
			world_name,
			PuffyGameManager.current_score,
			PuffyGameManager.bounce_combo
		]
		shots_label.text = "🐡 x %d" % PuffyGameManager.shots_remaining
		pearls_label.text = "💎 %d / %d" % [PuffyGameManager.level_pearls_collected, PuffyGameManager.level_pearls_total]
		hint_label.text = "👆 KÉO LÙI ĐỂ BẮN - CHẠM 1: PHỒNG TO - CHẠM 2: XÌ HƠI PHẢN LỰC!"
	else:
		title_label.text = "ARCADE: %d (x%d)" % [PuffyGameManager.current_score, PuffyGameManager.bounce_combo]
		shots_label.text = "🐡 x %d" % PuffyGameManager.shots_remaining
		pearls_label.text = "KỶ LỤC: %d" % PuffyGameManager.endless_best_score
		hint_label.text = "💥 NẢY LIÊN TỤC VÀO NẤM & SỨA ĐỂ TĂNG ĐIỂM COMBO!"

func update_hint(hint_text: String) -> void:
	if hint_label:
		hint_label.text = hint_text

func _on_shots_changed(remaining: int) -> void:
	shots_label.text = "🐡 x %d" % remaining

func _on_pearls_changed(collected: int, total: int) -> void:
	pearls_label.text = "💎 %d / %d" % [collected, total]

func _on_score_changed(score: int, combo: int) -> void:
	if PuffyGameManager.current_mode == PuffyGameManager.GameMode.CAMPAIGN:
		var world_name = PuffyGameManager.get_world_name(PuffyGameManager.current_level)
		title_label.text = "MÀN %d: %s | ĐIỂM: %d (x%d)" % [
			PuffyGameManager.current_level,
			world_name,
			score,
			combo
		]
	else:
		title_label.text = "ARCADE: %d (x%d)" % [score, combo]

func _on_pause_pressed() -> void:
	get_tree().paused = not get_tree().paused
