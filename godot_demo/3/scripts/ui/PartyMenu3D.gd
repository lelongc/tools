extends Control

## PartyMenu3D.gd
## Màn hình Menu chính của game 3D Co-op Tô Màu Hình Nhân

@onready var coop_btn: Button = $Root/MenuBox/CoopBtn
@onready var versus_btn: Button = $Root/MenuBox/VersusBtn
@onready var player_toggle_btn: Button = $Root/MenuBox/PlayerToggleBtn
@onready var quit_btn: Button = $Root/MenuBox/QuitBtn

var is_two_player_mode: bool = true

func _ready() -> void:
	coop_btn.pressed.connect(func(): _start_game(GameManager3D.GameMode.COOP_ORDER))
	versus_btn.pressed.connect(func(): _start_game(GameManager3D.GameMode.PARTY_VERSUS))
	player_toggle_btn.pressed.connect(_toggle_player_mode)
	quit_btn.pressed.connect(func(): get_tree().quit())
	_update_toggle_text()

func _toggle_player_mode() -> void:
	is_two_player_mode = !is_two_player_mode
	SoundManager3D.play_sfx("bonk", 1.2)
	_update_toggle_text()

func _update_toggle_text() -> void:
	if is_two_player_mode:
		player_toggle_btn.text = "👥 CHẾ ĐỘ: 2 NGƯỜI CHƠI (LOCAL CO-OP)"
	else:
		player_toggle_btn.text = "🤖 CHẾ ĐỘ: 1 NGƯỜI + ĐỒNG ĐỘI AI BOT"

func _start_game(mode: GameManager3D.GameMode) -> void:
	SoundManager3D.play_sfx("boing", 1.0)
	GameManager3D.start_match(mode, is_two_player_mode)
	GameManager3D.change_scene("res://scenes/main/MainPartyArena.tscn")
