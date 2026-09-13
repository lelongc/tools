extends CanvasLayer
class_name CongaVictory2D

## CongaVictory2D.gd
## Bảng vinh danh chiến thắng cuối trận đấu 4 người chơi

@onready var winner_label: Label = $Root/Panel/VBox/WinnerLabel
@onready var rank_label: Label = $Root/Panel/VBox/RankLabel
@onready var replay_btn: Button = $Root/Panel/VBox/HBox/ReplayBtn
@onready var menu_btn: Button = $Root/Panel/VBox/HBox/MenuBtn

const COLOR_NAMES = ["ĐỎ", "XANH DƯƠNG", "VÀNG", "XANH LÁ"]

func _ready() -> void:
	visible = false
	CongaGameManager.match_ended.connect(_on_match_ended)
	replay_btn.pressed.connect(_on_replay_pressed)
	menu_btn.pressed.connect(_on_menu_pressed)

func _on_match_ended(winner_id: int, final_scores: Array) -> void:
	visible = true
	var team_name = COLOR_NAMES[winner_id - 1]
	winner_label.text = "🏆 VUA QUẤT ROI: NGƯỜI CHƠI %d (%s)! 🏆" % [winner_id, team_name]
	winner_label.modulate = CongaGameManager.TEAM_COLORS[winner_id - 1]
	
	var summary = "BẢNG TỔNG KẾT ĐIỂM SỐ:\n"
	for i in range(4):
		if CongaGameManager.player_configs[i] != "off":
			summary += "• P%d (%s): %d ĐIỂM - Quất trúng %d lần\n" % [
				i + 1,
				COLOR_NAMES[i],
				final_scores[i],
				CongaGameManager.total_whips_landed[i]
			]
	rank_label.text = summary

func _on_replay_pressed() -> void:
	CongaGameManager.setup_and_start(CongaGameManager.player_configs)
	CongaGameManager.change_scene("res://scenes/main/CongaArena2D.tscn")

func _on_menu_pressed() -> void:
	CongaGameManager.change_scene("res://scenes/ui/CongaMenu2D.tscn")
