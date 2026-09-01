extends Node2D

@export var level_number: int = 1
@export var max_corn_in_level: int = 5

@onready var player_1: CharacterBody2D = get_node_or_null("Player1")
@onready var player_2: CharacterBody2D = get_node_or_null("Player2")
@onready var tether_rope: Node2D = get_node_or_null("TetherRope")
@onready var camera: Camera2D = get_node_or_null("CoopCamera2D")
@onready var finish_gate: Area2D = get_node_or_null("Environment/FinishGate")

# HUD
@onready var level_label: Label = get_node_or_null("HUD/TopBar/LevelBadge/Margin/Label")
@onready var corn_label: Label = get_node_or_null("HUD/TopBar/CornContainer/Margin/CornLabel")
@onready var victory_modal: PanelContainer = get_node_or_null("HUD/VictoryModal")
@onready var victory_title: Label = get_node_or_null("HUD/VictoryModal/VBox/Title")
@onready var victory_stats: Label = get_node_or_null("HUD/VictoryModal/VBox/Sub")
@onready var next_btn: Button = get_node_or_null("HUD/VictoryModal/VBox/BtnNext")
@onready var slingshot_hint: PanelContainer = get_node_or_null("HUD/SlingshotHint")

var corn_collected: int = 0
var level_time: float = 0.0
var is_level_ended: bool = false

func _ready() -> void:
	if victory_modal: victory_modal.visible = false
	if slingshot_hint: slingshot_hint.visible = false

	if tether_rope and player_1 and player_2:
		tether_rope.setup(player_1, player_2)

	if camera and player_1 and player_2:
		camera.setup(player_1, player_2)

	if player_1 and player_1.has_signal("corn_collected"):
		player_1.corn_collected.connect(_on_corn_collected)
	if player_2 and player_2.has_signal("corn_collected"):
		player_2.corn_collected.connect(_on_corn_collected)

	if finish_gate and finish_gate.has_signal("team_victory"):
		finish_gate.team_victory.connect(_on_team_victory)

	if next_btn:
		next_btn.pressed.connect(_on_next_level_pressed)

	if has_node("Environment/CornGroup"):
		for child in $Environment/CornGroup.get_children():
			if child.has_signal("collected"):
				child.collected.connect(_on_corn_collected)

	_update_hud()

func _process(delta: float) -> void:
	if not is_level_ended:
		level_time += delta

	# Quick Restart with R
	if Input.is_key_pressed(KEY_R):
		get_tree().reload_current_scene()

	# Solo / AI Switch with Tab
	if Input.is_action_just_pressed("ui_focus_next") or Input.is_key_pressed(KEY_TAB):
		_toggle_solo_ai_mode()

	# Next level shortcut with Space/Enter on victory
	if is_level_ended and (Input.is_action_just_pressed("ui_accept") or Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_ENTER)):
		_on_next_level_pressed()

	# Slingshot Tension HUD Feedback
	if player_1 and player_2 and slingshot_hint and not is_level_ended:
		var dist = player_1.global_position.distance_to(player_2.global_position)
		var p1_anchored = "is_anchored" in player_1 and player_1.is_anchored
		var p2_anchored = "is_anchored" in player_2 and player_2.is_anchored
		if (p1_anchored or p2_anchored) and dist > 240.0:
			slingshot_hint.visible = true
		else:
			slingshot_hint.visible = false

func _toggle_solo_ai_mode() -> void:
	if not player_2: return
	player_2.is_ai_controlled = not player_2.is_ai_controlled

func _on_corn_collected() -> void:
	corn_collected += 1
	_update_hud()

func _update_hud() -> void:
	if level_label:
		level_label.text = "🏆 MÀN %d / 5" % level_number
	if corn_label:
		corn_label.text = "🌽 BẮP: %d / %d" % [corn_collected, max_corn_in_level]

func _on_team_victory() -> void:
	if is_level_ended: return
	is_level_ended = true

	if has_node("/root/GameData"):
		get_node("/root/GameData").complete_level(level_number, corn_collected, level_time)

	await get_tree().create_timer(0.6).timeout
	if victory_modal:
		victory_modal.visible = true
		if victory_title:
			if level_number < 5:
				victory_title.text = "🎉 MÀN %d HOÀN THÀNH! 🎉" % level_number
			else:
				victory_title.text = "👑 ĐẠI CHIẾN THẮNG TRỌN VẸN! 👑"
		if victory_stats:
			victory_stats.text = "Thời gian: %.1fs | Bắp thu thập: %d/%d\nNhấn [PHÍM CÁCH] hoặc nút dưới để tiếp tục!" % [level_time, corn_collected, max_corn_in_level]
		if next_btn:
			next_btn.text = "MÀN TIẾP THEO ➔" if level_number < 5 else "CHƠI LẠI TỪ ĐẦU 🔄"

		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		victory_modal.scale = Vector2(0.5, 0.5)
		tween.tween_property(victory_modal, "scale", Vector2.ONE, 0.35)

func _on_next_level_pressed() -> void:
	if level_number < 5:
		var next_scene = "res://scenes/levels/Level_%d.tscn" % (level_number + 1)
		get_tree().change_scene_to_file(next_scene)
	else:
		get_tree().change_scene_to_file("res://scenes/levels/Level_1.tscn")
