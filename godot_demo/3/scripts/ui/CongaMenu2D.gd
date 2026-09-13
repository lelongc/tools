extends Control

## CongaMenu2D.gd
## Menu thiết lập số người chơi (1-4 Người hoặc Bot AI)

@onready var p1_btn: Button = $Root/SlotBox/P1Btn
@onready var p2_btn: Button = $Root/SlotBox/P2Btn
@onready var p3_btn: Button = $Root/SlotBox/P3Btn
@onready var p4_btn: Button = $Root/SlotBox/P4Btn
@onready var start_btn: Button = $Root/StartBtn
@onready var quit_btn: Button = $Root/QuitBtn

# Options for slot: ["human", "ai", "off"]
var slots: Array[String] = ["human", "ai", "ai", "ai"]

func _ready() -> void:
	p1_btn.pressed.connect(func(): _cycle_slot(0, false))
	p2_btn.pressed.connect(func(): _cycle_slot(1, true))
	p3_btn.pressed.connect(func(): _cycle_slot(2, true))
	p4_btn.pressed.connect(func(): _cycle_slot(3, true))
	
	start_btn.pressed.connect(_on_start_pressed)
	quit_btn.pressed.connect(func(): get_tree().quit())
	
	_update_slot_labels()

func _cycle_slot(idx: int, can_turn_off: bool) -> void:
	CongaSoundManager.play_sfx("attach", 1.2)
	var current = slots[idx]
	if current == "human":
		slots[idx] = "ai"
	elif current == "ai":
		slots[idx] = "off" if can_turn_off else "human"
	else:
		slots[idx] = "human"
	_update_slot_labels()

func _update_slot_labels() -> void:
	p1_btn.text = "🔴 P1 (ĐỎ): " + _get_status_text(slots[0], "WASD + Space")
	p2_btn.text = "🔵 P2 (XANH): " + _get_status_text(slots[1], "Mũi Tên + Enter")
	p3_btn.text = "🟡 P3 (VÀNG): " + _get_status_text(slots[2], "IJKL + O")
	p4_btn.text = "🟢 P4 (LÁ): " + _get_status_text(slots[3], "Numpad 8456 + Num 0")

func _get_status_text(status: String, control_hint: String) -> String:
	match status:
		"human": return "🎮 NGƯỜI CHƠI (" + control_hint + ")"
		"ai": return "🤖 BOT AI (Tự động)"
		_: return "❌ [TẮT]"

func _on_start_pressed() -> void:
	CongaSoundManager.play_sfx("dash", 1.0)
	CongaGameManager.setup_and_start(slots)
	CongaGameManager.change_scene("res://scenes/main/CongaArena2D.tscn")
