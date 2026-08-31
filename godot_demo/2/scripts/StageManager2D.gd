extends Node2D

@onready var player = $Player2D
@onready var enemy = $Enemy2D
@onready var hud: CanvasLayer = $HUD

# HUD Nodes
@onready var player_hp_bar: ProgressBar = $HUD/PlayerHUD/VBox/HPBar
@onready var player_hp_label: Label = $HUD/PlayerHUD/VBox/HPLabel
@onready var boss_hud: Control = $HUD/BossHUD
@onready var boss_hp_bar: ProgressBar = $HUD/BossHUD/VBox/BossHPBar
@onready var boss_name_label: Label = $HUD/BossHUD/VBox/BossNameLabel
@onready var combo_label: Label = $HUD/ComboHUD/ComboLabel
@onready var mind_freeze_banner: PanelContainer = $HUD/MindFreezeBanner
@onready var game_over_panel: PanelContainer = $HUD/GameOverPanel
@onready var victory_panel: PanelContainer = $HUD/VictoryPanel

var current_combo: int = 0
var combo_timer: float = 0.0
var is_mind_frozen: bool = false
var freeze_duration: float = 0.35

func _ready() -> void:
	Engine.time_scale = 1.0
	
	if mind_freeze_banner: mind_freeze_banner.visible = false
	if game_over_panel: game_over_panel.visible = false
	if victory_panel: victory_panel.visible = false

	if player:
		if player.has_signal("hp_changed"):
			player.hp_changed.connect(_on_player_hp_changed)
		if player.has_signal("combo_scored"):
			player.combo_scored.connect(_on_player_combo)
		if player.has_signal("pogo_landed"):
			player.pogo_landed.connect(_on_pogo_landed)
		if player.has_signal("player_died"):
			player.player_died.connect(_on_player_died)

	if enemy:
		if enemy.has_method("set_target_player"):
			enemy.set_target_player(player)
		if enemy.has_signal("boss_hp_changed"):
			enemy.boss_hp_changed.connect(_on_boss_hp_changed)
		if enemy.has_signal("boss_defeated"):
			enemy.boss_defeated.connect(_on_boss_defeated)
		if enemy.has_signal("attack_telegraphed"):
			enemy.attack_telegraphed.connect(_on_enemy_attack_telegraphed)

func _process(delta: float) -> void:
	if combo_timer > 0.0:
		combo_timer -= delta
		if combo_timer <= 0.0:
			current_combo = 0
			if combo_label: combo_label.text = ""

	if Input.is_key_pressed(KEY_R):
		get_tree().reload_current_scene()

func _on_player_hp_changed(cur: float, max_h: float) -> void:
	if player_hp_bar:
		player_hp_bar.max_value = max_h
		player_hp_bar.value = cur
	if player_hp_label:
		player_hp_label.text = "MÀO MÁU GALLUS: %d / %d" % [int(cur), int(max_h)]

	if cur <= max_h * 0.25 and cur > 0.0:
		player_hp_bar.modulate = Color(1.0, 0.2, 0.2, 1.0)
	else:
		player_hp_bar.modulate = Color(0.0, 0.9, 0.4, 1.0)

func _on_boss_hp_changed(cur: float, max_h: float) -> void:
	if boss_hp_bar:
		boss_hp_bar.max_value = max_h
		boss_hp_bar.value = cur
	if boss_name_label:
		var pct = int((cur / max_h) * 100) if max_h > 0 else 0
		boss_name_label.text = "⚔️ CÀO CÀO KIẾM SĨ SONG ĐAO (MANTIS BLADE) — %d%%" % pct

func _on_player_combo(amount: int) -> void:
	current_combo += amount
	combo_timer = 2.0
	if combo_label:
		combo_label.text = "COMBO x%d 🔥" % current_combo
		var tween = create_tween()
		combo_label.scale = Vector2(1.3, 1.3)
		tween.tween_property(combo_label, "scale", Vector2(1.0, 1.0), 0.15)

func _on_pogo_landed() -> void:
	if combo_label:
		combo_label.text = "🎯 POGO BOUNCE! +%d" % current_combo

func _on_enemy_attack_telegraphed(_atk_type: String) -> void:
	if player and "current_hp" in player and "max_hp" in player:
		if player.current_hp <= player.max_hp * 0.25 and player.current_hp > 0.0 and not is_mind_frozen:
			_trigger_mind_freeze()

func _trigger_mind_freeze() -> void:
	is_mind_frozen = true
	Engine.time_scale = 0.12

	if mind_freeze_banner:
		mind_freeze_banner.visible = true
		var tween = create_tween().set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
		mind_freeze_banner.modulate.a = 0.0
		tween.tween_property(mind_freeze_banner, "modulate:a", 1.0, 0.05 * Engine.time_scale)

	await get_tree().create_timer(freeze_duration * Engine.time_scale).timeout

	Engine.time_scale = 1.0
	is_mind_frozen = false
	if mind_freeze_banner:
		mind_freeze_banner.visible = false

func _on_player_died() -> void:
	await get_tree().create_timer(1.2).timeout
	if game_over_panel:
		game_over_panel.visible = true

func _on_boss_defeated() -> void:
	await get_tree().create_timer(1.5).timeout
	if victory_panel:
		victory_panel.visible = true
