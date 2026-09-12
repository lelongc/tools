class_name PuffyVictoryModal
extends CanvasLayer

@onready var title_label: Label = $Panel/VBox/Title
@onready var stars_container: HBoxContainer = $Panel/VBox/StarsContainer
@onready var score_label: Label = $Panel/VBox/ScoreLabel
@onready var next_btn: Button = $Panel/VBox/Buttons/NextBtn
@onready var replay_btn: Button = $Panel/VBox/Buttons/SecondaryRow/ReplayBtn
@onready var select_btn: Button = $Panel/VBox/Buttons/SecondaryRow/SelectBtn

var star_gold = preload("res://textures/ui/ui_star_gold.svg")
var star_empty = preload("res://textures/ui/ui_star_empty.svg")
var saved_stars: int = 0
var saved_score: int = 0

func setup(stars: int, final_score: int = 0) -> void:
	saved_stars = stars
	saved_score = final_score
	
	for child in stars_container.get_children():
		child.queue_free()
		
	for i in range(3):
		var tr = TextureRect.new()
		tr.texture = star_gold if i < stars else star_empty
		tr.custom_minimum_size = Vector2(64, 64)
		tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		stars_container.add_child(tr)
		
		tr.pivot_offset = Vector2(32, 32)
		tr.scale = Vector2.ZERO
		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_interval(i * 0.18)
		tween.tween_property(tr, "scale", Vector2.ONE, 0.28)
		
	_update_localized_texts()

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	next_btn.pressed.connect(_on_next_pressed)
	replay_btn.pressed.connect(_on_replay_pressed)
	select_btn.pressed.connect(_on_select_pressed)
	PuffyLocaleManager.locale_changed.connect(_on_locale_changed)
	_update_localized_texts()

func _on_locale_changed(_new_locale: String) -> void:
	_update_localized_texts()

func _update_localized_texts() -> void:
	if title_label:
		title_label.text = PuffyLocaleManager.tr_key("VIC_TITLE")
	if score_label:
		score_label.text = PuffyLocaleManager.tr_key("VIC_SCORE", [saved_score])
	if replay_btn:
		replay_btn.text = " " + PuffyLocaleManager.tr_key("VIC_REPLAY")
	if select_btn:
		select_btn.text = " " + PuffyLocaleManager.tr_key("VIC_MAP")
		
	if next_btn:
		if PuffyGameManager.current_level >= PuffyGameManager.max_levels:
			next_btn.text = "🏆 " + PuffyLocaleManager.tr_key("LVL_SELECT_TITLE")
		else:
			next_btn.text = PuffyLocaleManager.tr_key("VIC_NEXT")

func _on_next_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	if PuffyGameManager.current_level < PuffyGameManager.max_levels:
		PuffyGameManager.start_campaign_level(PuffyGameManager.current_level + 1)
	else:
		get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")

func _on_replay_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	PuffyGameManager.start_campaign_level(PuffyGameManager.current_level)

func _on_select_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyLevelSelect.tscn")
