extends Control
class_name CongaHUD3D

## CongaHUD3D.gd
## Giao diện hiển thị thời gian thi đấu, điểm số 4 người chơi và độ dài dây roi

@onready var timer_label: Label = $TopCenter/Panel/TimerLabel
@onready var p1_panel: PanelContainer = $Corners/P1Panel
@onready var p2_panel: PanelContainer = $Corners/P2Panel
@onready var p3_panel: PanelContainer = $Corners/P3Panel
@onready var p4_panel: PanelContainer = $Corners/P4Panel

@onready var p1_score: Label = $Corners/P1Panel/VBox/ScoreLabel
@onready var p2_score: Label = $Corners/P2Panel/VBox/ScoreLabel
@onready var p3_score: Label = $Corners/P3Panel/VBox/ScoreLabel
@onready var p4_score: Label = $Corners/P4Panel/VBox/ScoreLabel

@onready var p1_chain: Label = $Corners/P1Panel/VBox/ChainLabel
@onready var p2_chain: Label = $Corners/P2Panel/VBox/ChainLabel
@onready var p3_chain: Label = $Corners/P3Panel/VBox/ChainLabel
@onready var p4_chain: Label = $Corners/P4Panel/VBox/ChainLabel

@onready var p1_type: Label = $Corners/P1Panel/VBox/TypeLabel
@onready var p2_type: Label = $Corners/P2Panel/VBox/TypeLabel
@onready var p3_type: Label = $Corners/P3Panel/VBox/TypeLabel
@onready var p4_type: Label = $Corners/P4Panel/VBox/TypeLabel

var score_labels: Array[Label] = []
var chain_labels: Array[Label] = []
var type_labels: Array[Label] = []
var player_panels: Array[PanelContainer] = []

func _ready() -> void:
	score_labels = [p1_score, p2_score, p3_score, p4_score]
	chain_labels = [p1_chain, p2_chain, p3_chain, p4_chain]
	type_labels = [p1_type, p2_type, p3_type, p4_type]
	player_panels = [p1_panel, p2_panel, p3_panel, p4_panel]
	
	CongaGameManager3D.match_timer_updated.connect(_on_timer_updated)
	CongaGameManager3D.scores_updated.connect(_on_scores_updated)
	
	_setup_initial_panels()

func _setup_initial_panels() -> void:
	for i in range(4):
		var cfg = CongaGameManager3D.player_configs[i]
		if cfg == "off":
			player_panels[i].visible = false
		else:
			player_panels[i].visible = true
			if cfg == "ai":
				type_labels[i].text = "BOT (AI)"
			else:
				type_labels[i].text = "HUMAN"
		score_labels[i].text = "0 PTS"
		chain_labels[i].text = "🔗 ROI: 0"

func _on_timer_updated(time_left: float) -> void:
	var mins = int(time_left) / 60
	var secs = int(time_left) % 60
	timer_label.text = "%02d:%02d" % [mins, secs]
	if time_left <= 10.0:
		timer_label.modulate = Color(1.0, 0.2, 0.2)
	else:
		timer_label.modulate = Color.WHITE

func _on_scores_updated(scores: Array, chain_lengths: Array) -> void:
	for i in range(4):
		if i < scores.size() and i < score_labels.size():
			score_labels[i].text = "%d PTS" % scores[i]
		if i < chain_lengths.size() and i < chain_labels.size():
			var len_val = chain_lengths[i]
			chain_labels[i].text = "🔗 ROI: %d" % len_val
			if len_val >= 5:
				chain_labels[i].modulate = Color(1.0, 0.9, 0.2)
			else:
				chain_labels[i].modulate = Color(0.9, 0.9, 0.9)
