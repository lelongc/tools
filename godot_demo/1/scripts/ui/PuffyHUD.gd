class_name PuffyHUD
extends CanvasLayer

@onready var title_label: Label = $TopBar/TitleLabel
@onready var shots_label: Label = $TopBar/ShotsContainer/ShotsLabel
@onready var pearls_label: Label = $TopBar/PearlsContainer/PearlsLabel
@onready var hint_label: Label = $HintContainer/HintLabel

@onready var unstick_btn: Button = $TopBar/ActionsContainer/UnstickBtn
@onready var sound_btn: Button = $TopBar/ActionsContainer/SoundBtn
@onready var restart_btn: Button = $TopBar/ActionsContainer/RestartBtn
@onready var pause_btn: Button = $TopBar/ActionsContainer/PauseBtn

var pause_modal_scene = preload("res://scenes/ui/PuffyPauseModal.tscn")

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	PuffyGameManager.shots_changed.connect(_on_shots_changed)
	PuffyGameManager.pearls_changed.connect(_on_pearls_changed)
	PuffyGameManager.score_changed.connect(_on_score_changed)
	
	pause_btn.pressed.connect(_on_pause_pressed)
	restart_btn.pressed.connect(_on_restart_pressed)
	sound_btn.pressed.connect(_on_sound_pressed)
	unstick_btn.pressed.connect(_on_unstick_pressed)
	
	_update_sound_icon()
	_update_hud()

var icon_sound_on = preload("res://textures/icons/icon_sound_on.svg")
var icon_sound_off = preload("res://textures/icons/icon_sound_off.svg")

func _update_sound_icon() -> void:
	sound_btn.icon = icon_sound_off if PuffySoundManager.is_muted else icon_sound_on
	sound_btn.text = ""

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
	PuffySoundManager.play_stretch()
	var modal = pause_modal_scene.instantiate()
	add_child(modal)

func _on_restart_pressed() -> void:
	PuffySoundManager.play_stretch()
	if PuffyGameManager.current_mode == PuffyGameManager.GameMode.CAMPAIGN:
		PuffyGameManager.start_campaign_level(PuffyGameManager.current_level)
	else:
		PuffyGameManager.start_endless_mode()

func _on_sound_pressed() -> void:
	PuffySoundManager.is_muted = not PuffySoundManager.is_muted
	PuffySoundManager.toggle_bgm()
	_update_sound_icon()

func _on_unstick_pressed() -> void:
	var arena = get_parent()
	if arena and "player" in arena and arena.player:
		arena.player.force_recall_to_pad()
		update_hint("🛟 ĐÃ GIẢI CỨU PUFFY VỀ BỆ PHÓNG AN TOÀN!")
