extends Control
class_name CongaMenu3D

## CongaMenu3D.gd
## Menu phòng chờ tiệc tùng 3D: Cấu hình 1-4 người chơi (Người / Bot AI / Tắt) và bắt đầu đại chiến

@onready var p1_btn: Button = $VBox/SlotsHBox/P1Card/VBox/P1ToggleBtn
@onready var p2_btn: Button = $VBox/SlotsHBox/P2Card/VBox/P2ToggleBtn
@onready var p3_btn: Button = $VBox/SlotsHBox/P3Card/VBox/P3ToggleBtn
@onready var p4_btn: Button = $VBox/SlotsHBox/P4Card/VBox/P4ToggleBtn

@onready var start_btn: Button = $VBox/StartBtn
@onready var duration_btn: Button = $VBox/DurationHBox/DurationBtn
@onready var warning_label: Label = $VBox/WarningLabel

var configs: Array[String] = ["human", "ai", "ai", "ai"]
var slot_buttons: Array[Button] = []
var durations: Array[float] = [60.0, 90.0, 120.0]
var duration_idx: int = 1

func _ready() -> void:
	slot_buttons = [p1_btn, p2_btn, p3_btn, p4_btn]
	
	p1_btn.pressed.connect(func(): _cycle_slot(0, ["human", "ai"]))
	p2_btn.pressed.connect(func(): _cycle_slot(1, ["ai", "human", "off"]))
	p3_btn.pressed.connect(func(): _cycle_slot(2, ["ai", "human", "off"]))
	p4_btn.pressed.connect(func(): _cycle_slot(3, ["ai", "human", "off"]))
	
	duration_btn.pressed.connect(_cycle_duration)
	start_btn.pressed.connect(_start_game)
	
	_update_slot_displays()
	_update_duration_display()

func _cycle_slot(slot_idx: int, allowed: Array[String]) -> void:
	CongaSoundManager3D.play_sfx("dash", 1.1)
	var current = configs[slot_idx]
	var cur_idx = allowed.find(current)
	if cur_idx == -1:
		cur_idx = 0
	var next_idx = (cur_idx + 1) % allowed.size()
	configs[slot_idx] = allowed[next_idx]
	_update_slot_displays()

func _update_slot_displays() -> void:
	for i in range(4):
		var val = configs[i]
		var btn = slot_buttons[i]
		match val:
			"human":
				btn.text = "👤 NGƯỜI CHƠI (HUMAN)"
				btn.modulate = Color(1.0, 1.0, 1.0)
			"ai":
				btn.text = "🤖 MÁY TỰ ĐỘNG (BOT AI)"
				btn.modulate = Color(0.85, 0.95, 1.0)
			"off":
				btn.text = "❌ TẮT (OFF)"
				btn.modulate = Color(0.6, 0.6, 0.6)

func _cycle_duration() -> void:
	CongaSoundManager3D.play_sfx("dash", 1.0)
	duration_idx = (duration_idx + 1) % durations.size()
	_update_duration_display()

func _update_duration_display() -> void:
	var secs = int(durations[duration_idx])
	duration_btn.text = "⏱️ THỜI GIAN: %d GIÂY" % secs

func _start_game() -> void:
	var active_count = 0
	for c in configs:
		if c != "off":
			active_count += 1
			
	if active_count < 2:
		warning_label.text = "⚠️ Cần ít nhất 2 đấu thủ (Người hoặc Bot AI) để bắt đầu!"
		CongaSoundManager3D.play_sfx("bonk", 0.9)
		return
		
	CongaSoundManager3D.play_sfx("cheer", 1.1)
	CongaGameManager3D.setup_and_start(configs)
	CongaGameManager3D.match_timer = durations[duration_idx]
	CongaGameManager3D.change_scene("res://scenes/main/CongaArena3D.tscn")
