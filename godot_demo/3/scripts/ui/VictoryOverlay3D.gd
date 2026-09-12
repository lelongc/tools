extends CanvasLayer
class_name VictoryOverlay3D

## VictoryOverlay3D.gd
## Màn hình tổng kết kết quả trận đấu tiệc tùng tấu hài

@onready var title_label: Label = $Root/Panel/VBox/TitleLabel
@onready var stars_label: Label = $Root/Panel/VBox/StarsLabel
@onready var stats_label: Label = $Root/Panel/VBox/StatsLabel
@onready var slap_king_label: Label = $Root/Panel/VBox/SlapKingLabel
@onready var replay_btn: Button = $Root/Panel/VBox/HBox/ReplayBtn
@onready var menu_btn: Button = $Root/Panel/VBox/HBox/MenuBtn

func _ready() -> void:
	visible = false
	GameManager3D.match_ended.connect(_on_match_ended)
	replay_btn.pressed.connect(_on_replay_pressed)
	menu_btn.pressed.connect(_on_menu_pressed)

func _on_match_ended(result_title: String, stars: int, p1_slaps: int, p2_slaps: int) -> void:
	visible = true
	title_label.text = result_title
	
	var star_str = ""
	for i in range(stars):
		star_str += "⭐ "
	stars_label.text = star_str
	
	stats_label.text = "Tổng số hình nhân đã giao thành công: %d" % GameManager3D.total_deliveries
	
	if p1_slaps > p2_slaps:
		slap_king_label.text = "👑 DANH HIỆU 'VUA TÁT BẠN BÈ': NGƯỜI CHƠI 1 (ĐỎ) - %d cú tát lộn cổ!" % p1_slaps
	elif p2_slaps > p1_slaps:
		slap_king_label.text = "👑 DANH HIỆU 'VUA TÁT BẠN BÈ': NGƯỜI CHƠI 2 (XANH) - %d cú tát lộn cổ!" % p2_slaps
	else:
		slap_king_label.text = "🤝 TÁT NHAU HÒA NHAU (%d đều) - TÌNH BẠN DIỆU KỲ!" % p1_slaps

func _on_replay_pressed() -> void:
	GameManager3D.start_match(GameManager3D.current_mode, GameManager3D.is_two_player)
	GameManager3D.change_scene("res://scenes/main/MainPartyArena.tscn")

func _on_menu_pressed() -> void:
	GameManager3D.change_scene("res://scenes/ui/PartyMenu3D.tscn")
