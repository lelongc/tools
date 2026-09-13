extends CanvasLayer
class_name CongaHUD2D

## CongaHUD2D.gd
## Bảng điểm 4 góc cho 4 người chơi và đồng hồ đếm ngược trận đấu

@onready var timer_label: Label = $Root/TopCenter/TimerLabel
@onready var p1_label: Label = $Root/P1Card/VBox/P1Score
@onready var p2_label: Label = $Root/P2Card/VBox/P2Score
@onready var p3_label: Label = $Root/P3Card/VBox/P3Score
@onready var p4_label: Label = $Root/P4Card/VBox/P4Score

@onready var p1_chain: Label = $Root/P1Card/VBox/P1Chain
@onready var p2_chain: Label = $Root/P2Card/VBox/P2Chain
@onready var p3_chain: Label = $Root/P3Card/VBox/P3Chain
@onready var p4_chain: Label = $Root/P4Card/VBox/P4Chain

func _ready() -> void:
	CongaGameManager.match_timer_updated.connect(_on_timer_updated)
	CongaGameManager.scores_updated.connect(_on_scores_updated)
	
	# Ẩn các thẻ người chơi bị tắt
	var cfgs = CongaGameManager.player_configs
	$Root/P1Card.visible = (cfgs[0] != "off")
	$Root/P2Card.visible = (cfgs[1] != "off")
	$Root/P3Card.visible = (cfgs[2] != "off")
	$Root/P4Card.visible = (cfgs[3] != "off")
	
	_on_scores_updated(CongaGameManager.scores, CongaGameManager.chain_lengths)

func _on_timer_updated(time_left: float) -> void:
	var mins = int(time_left) / 60
	var secs = int(time_left) % 60
	timer_label.text = "⏳ THỜI GIAN: %02d:%02d" % [mins, secs]
	if time_left <= 15.0:
		timer_label.modulate = Color(1.0, 0.2, 0.2)
	else:
		timer_label.modulate = Color(1.0, 0.9, 0.2)

func _on_scores_updated(scores: Array, chains: Array) -> void:
	p1_label.text = "P1 ĐỎ: %d ĐIỂM" % scores[0]
	p2_label.text = "P2 XANH: %d ĐIỂM" % scores[1]
	p3_label.text = "P3 VÀNG: %d ĐIỂM" % scores[2]
	p4_label.text = "P4 LÁ: %d ĐIỂM" % scores[3]
	
	p1_chain.text = "Đuôi: %d hình nhân" % chains[0]
	p2_chain.text = "Đuôi: %d hình nhân" % chains[1]
	p3_chain.text = "Đuôi: %d hình nhân" % chains[2]
	p4_chain.text = "Đuôi: %d hình nhân" % chains[3]
