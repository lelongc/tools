extends Control

## ChameleonMenu3D.gd
## Menu sảnh chính: Lựa chọn Chế Độ Solo Sinh Tồn Đột Biến hoặc Tiệc Tùng 1-4 Người

@onready var solo_btn: Button = $Center/VBox/ModesHBox/SoloCard/VBox/SoloBtn
@onready var party_btn: Button = $Center/VBox/ModesHBox/PartyCard/VBox/PartyBtn

# 4 nút cấu hình Slot Tiệc tùng
@onready var p1_toggle: Button = $Center/VBox/ModesHBox/PartyCard/VBox/SlotsGrid/P1Toggle
@onready var p2_toggle: Button = $Center/VBox/ModesHBox/PartyCard/VBox/SlotsGrid/P2Toggle
@onready var p3_toggle: Button = $Center/VBox/ModesHBox/PartyCard/VBox/SlotsGrid/P3Toggle
@onready var p4_toggle: Button = $Center/VBox/ModesHBox/PartyCard/VBox/SlotsGrid/P4Toggle

var party_configs: Array[String] = ["human", "ai", "ai", "ai"]
var toggle_buttons: Array[Button] = []

func _ready() -> void:
	toggle_buttons = [p1_toggle, p2_toggle, p3_toggle, p4_toggle]
	
	solo_btn.pressed.connect(_on_start_solo)
	party_btn.pressed.connect(_on_start_party)
	
	p1_toggle.pressed.connect(func(): _cycle_slot(0, ["human", "ai"]))
	p2_toggle.pressed.connect(func(): _cycle_slot(1, ["ai", "human", "off"]))
	p3_toggle.pressed.connect(func(): _cycle_slot(2, ["ai", "human", "off"]))
	p4_toggle.pressed.connect(func(): _cycle_slot(3, ["ai", "human", "off"]))
	
	_update_slot_labels()

func _cycle_slot(idx: int, allowed: Array[String]) -> void:
	ChameleonSoundManager.play_sfx("tongue_shoot", 1.1)
	var cur = party_configs[idx]
	var c_idx = allowed.find(cur)
	var n_idx = (c_idx + 1) % allowed.size()
	party_configs[idx] = allowed[n_idx]
	_update_slot_labels()

func _update_slot_labels() -> void:
	for i in range(4):
		var btn = toggle_buttons[i]
		var val = party_configs[i]
		match val:
			"human":
				btn.text = "P%d: NGƯỜI" % (i + 1)
				btn.modulate = Color(1.0, 1.0, 1.0)
			"ai":
				btn.text = "P%d: BOT AI" % (i + 1)
				btn.modulate = Color(0.85, 0.95, 1.0)
			"off":
				btn.text = "P%d: TẮT" % (i + 1)
				btn.modulate = Color(0.5, 0.5, 0.5)

func _on_start_solo() -> void:
	ChameleonSoundManager.play_sfx("cheer", 1.1)
	ChameleonGameManager.start_solo_mode()
	ChameleonGameManager.change_scene("res://scenes/main/ChameleonArena3D.tscn")

func _on_start_party() -> void:
	ChameleonSoundManager.play_sfx("cheer", 1.1)
	ChameleonGameManager.start_party_mode(party_configs, 90.0)
	ChameleonGameManager.change_scene("res://scenes/main/ChameleonArena3D.tscn")
