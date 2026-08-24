extends Node

var score: int = 0

@onready var player: Node3D = get_tree().root.find_child("Player", true, false)
@onready var hud: CanvasLayer = get_tree().root.find_child("HUD", true, false)

@onready var score_label: Label = get_tree().root.find_child("ScoreLabel", true, false)
@onready var neck_label: Label = get_tree().root.find_child("NeckLabelHUD", true, false)
@onready var win_panel: Control = get_tree().root.find_child("WinPanel", true, false)
@onready var win_score_text: Label = get_tree().root.find_child("WinSub", true, false)
@onready var fail_panel: Control = get_tree().root.find_child("FailPanel", true, false)
@onready var fail_reason_label: Label = get_tree().root.find_child("FailRageText", true, false)
@onready var retry_button: Button = get_tree().root.find_child("RetryButton", true, false)
@onready var next_button: Button = get_tree().root.find_child("NextButton", true, false)
@onready var revive_button: Button = get_tree().root.find_child("ReviveButton", true, false)

func _ready() -> void:
	if win_panel:
		win_panel.visible = false
	if fail_panel:
		fail_panel.visible = false
		
	if retry_button:
		retry_button.pressed.connect(restart_game)
	if next_button:
		next_button.pressed.connect(restart_game)
	if revive_button:
		revive_button.pressed.connect(revive_player)
		
	if player:
		if player.has_signal("player_died"):
			player.connect("player_died", on_player_died)
		if player.has_signal("neck_height_changed"):
			player.connect("neck_height_changed", _on_neck_height_changed)
		if player.has_signal("reached_finish"):
			player.connect("reached_finish", on_game_win)

func add_score(amount: int) -> void:
	score += amount
	if score_label:
		score_label.text = "🍎 ĐIỂM: %d" % score

func _on_neck_height_changed(current_h: float, max_h: float) -> void:
	if neck_label:
		neck_label.text = "📏 CỔ: %.1fm / %.1fm" % [current_h, max_h]

func on_reach_finish_tower(multiplier: float, height: float) -> void:
	var total_score = int(score * multiplier)
	if win_score_text:
		win_score_text.text = "CHIỀU CAO ĐẠT ĐƯỢC: %.1fm\n🏆 NHÂN %.0fx ĐIỂM THƯỞNG!\nTỔNG ĐIỂM: %d" % [height, multiplier, total_score]
	if win_panel:
		win_panel.visible = true

func on_game_win(final_points: float) -> void:
	if win_panel:
		win_panel.visible = true

func on_player_died(reason: String) -> void:
	if fail_reason_label:
		fail_reason_label.text = reason
	if fail_panel:
		fail_panel.visible = true

func restart_game() -> void:
	get_tree().reload_current_scene()

func revive_player() -> void:
	# Hồi sinh và kéo dài cổ thêm
	if fail_panel:
		fail_panel.visible = false
	if player:
		player.set("is_active", true)
		player.set("current_max_height", player.get("current_max_height") + 3.0)
		player.rotation = Vector3.ZERO
		if player.has_node("HeadRoot"):
			player.get_node("HeadRoot").rotation = Vector3.ZERO
