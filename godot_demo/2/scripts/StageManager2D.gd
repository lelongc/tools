extends Node2D
class_name StageManager2D

@export var current_wave: int = 1

var score: int = 0
var enemies_left: int = 0
var is_stage_active: bool = true

@onready var player: Player2D = $Player2D
@onready var hp_bar: ProgressBar = $HUD/InGameHUD/TopMargin/VBox/TopBar/HPPill/HPBar
@onready var wave_label: Label = $HUD/InGameHUD/TopMargin/VBox/TopBar/WavePill/WaveLabel
@onready var score_label: Label = $HUD/InGameHUD/TopMargin/VBox/TopBar/ScorePill/ScoreLabel
@onready var combo_label: Label = $HUD/InGameHUD/ComboLabel
@onready var start_panel: Control = $HUD/StartPanel
@onready var ingame_hud: Control = $HUD/InGameHUD
@onready var win_panel: Control = $HUD/WinPanel

func _ready() -> void:
	if start_panel: start_panel.visible = true
	if ingame_hud: ingame_hud.visible = false
	if win_panel: win_panel.visible = false
	
	connect_signals()
	PlatformBridge.notify_game_ready()

func connect_signals() -> void:
	var start_btn = $HUD/StartPanel.find_child("StartButton", true, false)
	if start_btn: start_btn.pressed.connect(start_gameplay)
	
	var retry_btn = $HUD.find_child("NextButton", true, false)
	if retry_btn: retry_btn.pressed.connect(func(): get_tree().reload_current_scene())
	
	if player:
		player.hp_changed.connect(_on_player_hp_changed)

func start_gameplay() -> void:
	is_stage_active = true
	if start_panel: start_panel.visible = false
	if ingame_hud: ingame_hud.visible = true
	
	current_wave = 1
	_spawn_wave()

func _spawn_wave() -> void:
	var count = 3 + current_wave * 2
	enemies_left = count
	if wave_label: wave_label.text = "WAVE %d" % current_wave
	
	var enemy_scn = load("res://scenes/Enemy2D.tscn")
	for i in range(count):
		var e: Enemy2D = enemy_scn.instantiate()
		add_child(e)
		var spawn_x = randf_range(200.0, 700.0) if i % 2 == 0 else randf_range(-700.0, -200.0)
		e.position = Vector2(spawn_x, randf_range(-150.0, 150.0))
		e.enemy_defeated.connect(_on_enemy_defeated)

func _on_enemy_defeated(pts: int) -> void:
	score += pts
	if score_label: score_label.text = "ĐIỂM: %d" % score
	
	enemies_left -= 1
	if enemies_left <= 0:
		current_wave += 1
		if current_wave > 3:
			_victory()
		else:
			await get_tree().create_timer(1.5).timeout
			_spawn_wave()

func _on_player_hp_changed(curr: float, max_hp: float) -> void:
	if hp_bar:
		hp_bar.max_value = max_hp
		hp_bar.value = curr

func _victory() -> void:
	is_stage_active = false
	SoundManager.play_victory()
	if ingame_hud: ingame_hud.visible = false
	if win_panel: win_panel.visible = true
