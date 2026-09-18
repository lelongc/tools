extends Control

## SumoMenu3D.gd
## Menu sảnh chờ Đấu Trường Sumo Ragdoll 3D

@onready var solo_btn: BaseButton = $Center/VBox/ModesHBox/SoloCard/VBox/SoloBtn
@onready var party_btn: BaseButton = $Center/VBox/ModesHBox/PartyCard/VBox/PartyBtn

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
	SumoSoundManager.play_sfx("punch_heavy", 1.1)
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
	SumoSoundManager.play_sfx("cheer", 1.1)
	SumoGameManager.start_solo_mode()
	SumoGameManager.change_scene("res://scenes/main/SumoArena3D.tscn")

func _on_start_party() -> void:
	SumoSoundManager.play_sfx("cheer", 1.1)
	SumoGameManager.start_party_mode(party_configs)
	SumoGameManager.change_scene("res://scenes/main/SumoArena3D.tscn")
