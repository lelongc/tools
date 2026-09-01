extends CanvasLayer

@onready var score_label: Label = $TopBar/ScoreBox/Margin/ScoreLabel
@onready var level_label: Label = $TopBar/LevelBox/Margin/LevelLabel
@onready var egg_container: HBoxContainer = $EggShelf/Margin/EggIcons
@onready var restart_btn: Button = $TopBar/BtnRestart

# Modals
@onready var victory_modal: PanelContainer = $VictoryModal
@onready var victory_title: Label = $VictoryModal/VBox/Title
@onready var victory_score: Label = $VictoryModal/VBox/ScoreLabel
@onready var stars_label: Label = $VictoryModal/VBox/StarsLabel
@onready var next_level_btn: Button = $VictoryModal/VBox/BtnNext

@onready var fail_modal: PanelContainer = $FailModal
@onready var retry_btn: Button = $FailModal/VBox/BtnRetry
@onready var nuke_ad_btn: Button = $FailModal/VBox/BtnNukeAd

func _ready() -> void:
	if victory_modal: victory_modal.visible = false
	if fail_modal: fail_modal.visible = false

	GameManager.score_updated.connect(_on_score_updated)
	GameManager.egg_dropped.connect(_on_egg_dropped)
	GameManager.level_completed.connect(_on_level_completed)
	GameManager.level_failed.connect(_on_level_failed)

	if restart_btn: restart_btn.pressed.connect(_on_restart_pressed)
	if next_level_btn: next_level_btn.pressed.connect(_on_next_level_pressed)
	if retry_btn: retry_btn.pressed.connect(_on_restart_pressed)
	if nuke_ad_btn: nuke_ad_btn.pressed.connect(_on_nuke_ad_pressed)

	_update_ui()

func _update_ui() -> void:
	if level_label:
		level_label.text = "🏰 HẦM NGỤC %d" % GameManager.current_level
	if score_label:
		score_label.text = "ĐIỂM: %d" % GameManager.current_score
	_refresh_egg_icons()

func _refresh_egg_icons() -> void:
	if not egg_container: return
	for child in egg_container.get_children():
		child.queue_free()

	for i in range(GameManager.available_eggs.size()):
		var egg_type = GameManager.available_eggs[i]
		var icon = Label.new()
		match egg_type:
			"normal": icon.text = "🥚"
			"bomb": icon.text = "💣"
			"drill": icon.text = "🔩"
			_: icon.text = "🥚"
		icon.add_theme_font_size_override("font_size", 28)
		if i < GameManager.current_egg_index:
			icon.modulate = Color(0.3, 0.3, 0.3, 0.5) # Used egg
		egg_container.add_child(icon)

func _on_score_updated(new_score: int) -> void:
	if score_label:
		score_label.text = "ĐIỂM: %d" % new_score

func _on_egg_dropped(_egg_type: String) -> void:
	_refresh_egg_icons()

func _on_level_completed(stars: int, final_score: int) -> void:
	if victory_modal:
		victory_modal.visible = true
		if victory_title: victory_title.text = "🎉 SẬP HẦM THÀNH CÔNG! 🎉"
		if victory_score: victory_score.text = "Tổng điểm: %d" % final_score
		if stars_label:
			var stars_str = "⭐⭐⭐" if stars == 3 else ("⭐⭐" if stars == 2 else "⭐")
			stars_label.text = stars_str

		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		victory_modal.scale = Vector2(0.5, 0.5)
		tween.tween_property(victory_modal, "scale", Vector2.ONE, 0.3)

func _on_level_failed() -> void:
	if fail_modal:
		fail_modal.visible = true
		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		fail_modal.scale = Vector2(0.5, 0.5)
		tween.tween_property(fail_modal, "scale", Vector2.ONE, 0.3)

func _on_restart_pressed() -> void:
	GameManager.restart_current_level()

func _on_next_level_pressed() -> void:
	GameManager.load_level(GameManager.current_level + 1)

func _on_nuke_ad_pressed() -> void:
	# Rewarded Ad Hook: Cấp ngay 1 quả bom Nuke hạt nhân dọn sạch màn chơi!
	if fail_modal: fail_modal.visible = false
	GameManager.available_eggs.append("bomb")
	GameManager.is_level_active = true
	GameManager.is_settling = false
	_refresh_egg_icons()
