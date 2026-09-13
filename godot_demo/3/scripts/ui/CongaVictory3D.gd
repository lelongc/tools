extends Control
class_name CongaVictory3D

## CongaVictory3D.gd
## Bảng vinh danh Vua Quất Roi và tổng kết điểm số khi hết giờ đấu 3D

@onready var winner_title: Label = $CenterContainer/Panel/VBox/WinnerTitle
@onready var ranks_container: VBoxContainer = $CenterContainer/Panel/VBox/RanksContainer
@onready var rematch_btn: Button = $CenterContainer/Panel/VBox/ButtonsHBox/RematchBtn
@onready var menu_btn: Button = $CenterContainer/Panel/VBox/ButtonsHBox/MenuBtn

const PLAYER_NAMES = ["PLAYER 1 (ĐỎ)", "PLAYER 2 (XANH)", "PLAYER 3 (VÀNG)", "PLAYER 4 (XANH LÁ)"]

func _ready() -> void:
	visible = false
	CongaGameManager3D.match_ended.connect(_on_match_ended)
	rematch_btn.pressed.connect(_on_rematch_pressed)
	menu_btn.pressed.connect(_on_menu_pressed)

func _on_match_ended(winner_id: int, final_scores: Array) -> void:
	visible = true
	var win_idx = winner_id - 1
	var win_color = CongaGameManager3D.TEAM_COLORS[win_idx]
	
	winner_title.text = "👑 %s THẮNG CUỘC!" % PLAYER_NAMES[win_idx]
	winner_title.modulate = win_color
	
	# Xoá bảng cũ
	for c in ranks_container.get_children():
		c.queue_free()
		
	# Sắp xếp thứ hạng
	var rank_list: Array[Dictionary] = []
	for i in range(4):
		if CongaGameManager3D.player_configs[i] != "off":
			rank_list.append({
				"id": i,
				"name": PLAYER_NAMES[i],
				"score": final_scores[i],
				"whips": CongaGameManager3D.total_whips_landed[i],
				"color": CongaGameManager3D.TEAM_COLORS[i]
			})
			
	rank_list.sort_custom(func(a, b): return a["score"] > b["score"])
	
	for r in range(rank_list.size()):
		var entry = rank_list[r]
		var lbl = Label.new()
		var medal = "🥇 " if r == 0 else ("🥈 " if r == 1 else ("🥉 " if r == 2 else "   "))
		lbl.text = "%s#%d: %s  —  %d Điểm (Quất trúng %d lần)" % [medal, r + 1, entry["name"], entry["score"], entry["whips"]]
		lbl.modulate = entry["color"]
		lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl.add_theme_font_size_override("font_size", 16)
		ranks_container.add_child(lbl)

func _on_rematch_pressed() -> void:
	CongaSoundManager3D.play_sfx("dash", 1.2)
	CongaGameManager3D.setup_and_start(CongaGameManager3D.player_configs)
	get_tree().reload_current_scene()

func _on_menu_pressed() -> void:
	CongaSoundManager3D.play_sfx("dash", 0.9)
	CongaGameManager3D.change_scene("res://scenes/ui/CongaMenu3D.tscn")
