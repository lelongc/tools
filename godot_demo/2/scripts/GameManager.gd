extends Node

var score: int = 0

@onready var player: Node3D = get_tree().root.find_child("Player", true, false)
@onready var hud: CanvasLayer = get_tree().root.find_child("HUD", true, false)

@onready var score_label: Label = get_tree().root.find_child("ScoreLabel", true, false)
@onready var neck_label: Label = get_tree().root.find_child("NeckLabelHUD", true, false)
@onready var hint_label: Label = get_tree().root.find_child("HintLabel", true, false)
@onready var win_panel: Control = get_tree().root.find_child("WinPanel", true, false)
@onready var win_title: Label = get_tree().root.find_child("WinTitle", true, false)
@onready var win_score_text: Label = get_tree().root.find_child("WinSub", true, false)
@onready var next_button: Button = get_tree().root.find_child("NextButton", true, false)
@onready var fail_panel: Control = get_tree().root.find_child("FailPanel", true, false)
@onready var fail_title: Label = get_tree().root.find_child("FailTitle", true, false)
@onready var fail_reason_label: Label = get_tree().root.find_child("FailRageText", true, false)
@onready var retry_button: Button = get_tree().root.find_child("RetryButton", true, false)
@onready var revive_button: Button = get_tree().root.find_child("ReviveButton", true, false)

func _ready() -> void:
	load_csv_translations()
	
	if win_panel:
		win_panel.visible = false
	if fail_panel:
		fail_panel.visible = false
		
	if hint_label:
		hint_label.text = tr("HINT_STRETCH")
	if next_button:
		next_button.text = tr("NEXT_BTN")
		next_button.pressed.connect(restart_game)
	if retry_button:
		retry_button.text = tr("RETRY_BTN")
		retry_button.pressed.connect(restart_game)
	if revive_button:
		revive_button.text = tr("REVIVE_BTN")
		revive_button.pressed.connect(revive_player)
	if win_title:
		win_title.text = tr("WIN_TITLE")
	if fail_title:
		fail_title.text = tr("FAIL_TITLE")
		
	update_ui_text(0, 1.5, 4.5)
		
	if player:
		if player.has_signal("player_died"):
			player.connect("player_died", on_player_died)
		if player.has_signal("neck_height_changed"):
			player.connect("neck_height_changed", _on_neck_height_changed)
		if player.has_signal("reached_finish"):
			player.connect("reached_finish", on_game_win)

func load_csv_translations() -> void:
	var file = FileAccess.open("res://translations/translations.csv", FileAccess.READ)
	if not file:
		return
		
	var header_line = file.get_line()
	var headers = header_line.split(",")
	if headers.size() < 2:
		return
		
	var trans_dict: Dictionary = {}
	for i in range(1, headers.size()):
		var loc = headers[i].strip_edges().replace("\"", "")
		var tr_obj = Translation.new()
		tr_obj.locale = loc
		trans_dict[i] = tr_obj
		
	while not file.eof_reached():
		var line = file.get_csv_line()
		if line.size() < headers.size() or line[0] == "":
			continue
		var key = line[0].strip_edges()
		for i in range(1, headers.size()):
			if i < line.size():
				trans_dict[i].add_message(key, line[i].strip_edges())
				
	for i in trans_dict:
		TranslationServer.add_translation(trans_dict[i])

func add_score(amount: int) -> void:
	score += amount
	if score_label:
		score_label.text = tr("SCORE_LABEL") % score

func update_ui_text(_s: int, current_h: float, max_h: float) -> void:
	if score_label:
		score_label.text = tr("SCORE_LABEL") % score
	if neck_label:
		neck_label.text = tr("NECK_LABEL") % [current_h, max_h]

func _on_neck_height_changed(current_h: float, max_h: float) -> void:
	if neck_label:
		neck_label.text = tr("NECK_LABEL") % [current_h, max_h]

func on_reach_finish_tower(multiplier: float, height: float) -> void:
	var total_score = int(score * multiplier)
	if win_score_text:
		win_score_text.text = tr("WIN_SUB") % [height, multiplier, total_score]
	if win_panel:
		win_panel.visible = true

func on_game_win(_final_points: float) -> void:
	if win_panel:
		win_panel.visible = true

func on_player_died(reason_key: String) -> void:
	if fail_reason_label:
		fail_reason_label.text = tr(reason_key) if tr(reason_key) != reason_key else reason_key
	if fail_panel:
		fail_panel.visible = true

func restart_game() -> void:
	get_tree().reload_current_scene()

func revive_player() -> void:
	if fail_panel:
		fail_panel.visible = false
	if player:
		player.set("is_active", true)
		player.set("current_max_height", player.get("current_max_height") + 3.0)
		player.rotation = Vector3.ZERO
		if player.has_node("HeadRoot"):
			player.get_node("HeadRoot").rotation = Vector3.ZERO
