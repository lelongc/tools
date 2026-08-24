extends Node
class_name GameManager

var score: int = 0
var current_level: int = 1

@onready var player: Player = get_tree().root.find_child("Player", true, false)
@onready var hud: CanvasLayer = get_tree().root.find_child("HUD", true, false)

@onready var score_label: Label = get_tree().root.find_child("ScoreLabel", true, false)
@onready var level_label: Label = get_tree().root.find_child("LevelLabelHUD", true, false)
@onready var win_panel: Control = get_tree().root.find_child("WinPanel", true, false)
@onready var fail_panel: Control = get_tree().root.find_child("FailPanel", true, false)
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
		player.player_died.connect(on_player_died)
		player.stats_changed.connect(_on_player_stats_changed)

func add_score(amount: int) -> void:
	score += amount
	if score_label:
		score_label.text = "💰 VÀNG: %d" % score

func _on_player_stats_changed(rate: float, count: int, dmg: float, lvl: int) -> void:
	if level_label:
		level_label.text = "⭐ SÚNG LV.%d | %.1f VIÊN/G" % [lvl, rate]

func on_boss_defeated() -> void:
	add_score(2000)
	if win_panel:
		win_panel.visible = true

func on_player_died() -> void:
	if fail_panel:
		fail_panel.visible = true

func restart_game() -> void:
	get_tree().reload_current_scene()

func revive_player() -> void:
	# Cơ chế Hồi sinh (Mô phỏng Xem quảng cáo nhận thưởng Rewarded Ads)
	if fail_panel:
		fail_panel.visible = false
	if player:
		player.is_active = true
		player.fire_rate += 10.0
		player.bullet_count = 3
		player.bullet_damage += 20.0
		player.update_gun_evolution()
