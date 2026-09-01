extends CanvasLayer

@onready var score_label: Label = $TopBar/Margin/HBox/ScoreBox/Margin/ScoreLabel
@onready var level_label: Label = $TopBar/Margin/HBox/LevelBox/Margin/LevelLabel
@onready var egg_container: HBoxContainer = $EggShelf/Margin/EggIcons
@onready var btn_pause: Button = $TopBar/Margin/HBox/BtnPause
@onready var btn_restart: Button = $TopBar/Margin/HBox/BtnRestart

# Modals
@onready var victory_modal: PanelContainer = $VictoryModal
@onready var victory_title: Label = $VictoryModal/VBox/Title
@onready var victory_score: Label = $VictoryModal/VBox/ScoreLabel
@onready var stars_label: Label = $VictoryModal/VBox/StarsLabel
@onready var next_level_btn: Button = $VictoryModal/VBox/BtnNext
@onready var victory_levels_btn: Button = $VictoryModal/VBox/BtnLevels

@onready var fail_modal: PanelContainer = $FailModal
@onready var fail_title: Label = $FailModal/VBox/Title
@onready var retry_btn: Button = $FailModal/VBox/BtnRetry
@onready var nuke_ad_btn: Button = $FailModal/VBox/BtnNukeAd
@onready var fail_levels_btn: Button = $FailModal/VBox/BtnLevels

@onready var pause_modal: PanelContainer = $PauseModal
@onready var pause_title: Label = $PauseModal/VBox/Title
@onready var resume_btn: Button = $PauseModal/VBox/BtnResume
@onready var pause_retry_btn: Button = $PauseModal/VBox/BtnRestart
@onready var pause_levels_btn: Button = $PauseModal/VBox/BtnLevels

func _ready() -> void:
	if victory_modal: victory_modal.visible = false
	if fail_modal: fail_modal.visible = false
	if pause_modal: pause_modal.visible = false

	GameManager.score_updated.connect(_on_score_updated)
	GameManager.egg_dropped.connect(_on_egg_dropped)
	GameManager.level_completed.connect(_on_level_completed)
	GameManager.level_failed.connect(_on_level_failed)

	if btn_restart: btn_restart.pressed.connect(func(): GameManager.restart_current_level())
	if btn_pause: btn_pause.pressed.connect(_toggle_pause)

	if next_level_btn: next_level_btn.pressed.connect(func(): GameManager.next_level())
	if victory_levels_btn: victory_levels_btn.pressed.connect(func(): GameManager.go_to_level_select())
	
	if retry_btn: retry_btn.pressed.connect(func(): GameManager.restart_current_level())
	if nuke_ad_btn: nuke_ad_btn.pressed.connect(_on_nuke_ad_pressed)
	if fail_levels_btn: fail_levels_btn.pressed.connect(func(): GameManager.go_to_level_select())

	if resume_btn: resume_btn.pressed.connect(_toggle_pause)
	if pause_retry_btn: pause_retry_btn.pressed.connect(func():
		get_tree().paused = false
		GameManager.restart_current_level()
	)
	if pause_levels_btn: pause_levels_btn.pressed.connect(func():
		get_tree().paused = false
		GameManager.go_to_level_select()
	)

	_update_ui()

func _toggle_pause() -> void:
	var is_p = not get_tree().paused
	get_tree().paused = is_p
	if pause_modal:
		pause_modal.visible = is_p
		if is_p and has_node("/root/LocalizationManager"):
			var lm = get_node("/root/LocalizationManager")
			if pause_title: pause_title.text = lm.t("KEY_PAUSE")
			if resume_btn: resume_btn.text = lm.t("KEY_RESUME")
			if pause_retry_btn: pause_retry_btn.text = lm.t("KEY_RETRY")
			if pause_levels_btn: pause_levels_btn.text = lm.t("KEY_SELECT_LEVEL")

func _update_ui() -> void:
	var lm = get_node_or_null("/root/LocalizationManager")
	if level_label:
		if lm: level_label.text = lm.t("KEY_LEVEL") % GameManager.current_level
		else: level_label.text = "🏰 LEVEL %d" % GameManager.current_level
	if score_label:
		if lm: score_label.text = lm.t("KEY_SCORE") % GameManager.current_score
		else: score_label.text = "SCORE: %d" % GameManager.current_score
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
			"frost": icon.text = "❄️"
			"cluster": icon.text = "🐣"
			"acid": icon.text = "🧪"
			"blackhole": icon.text = "🌌"
			_: icon.text = "🥚"
		icon.add_theme_font_size_override("font_size", 28)
		if i < GameManager.current_egg_index:
			icon.modulate = Color(0.3, 0.3, 0.3, 0.4)
		elif i == GameManager.current_egg_index:
			icon.modulate = Color(1.0, 1.0, 1.0, 1.0)
		egg_container.add_child(icon)

func _on_score_updated(new_score: int) -> void:
	var lm = get_node_or_null("/root/LocalizationManager")
	if score_label:
		if lm: score_label.text = lm.t("KEY_SCORE") % new_score
		else: score_label.text = "SCORE: %d" % new_score

func _on_egg_dropped(_egg_type: String) -> void:
	_refresh_egg_icons()

func _on_level_completed(stars: int, final_score: int) -> void:
	if victory_modal:
		victory_modal.visible = true
		var lm = get_node_or_null("/root/LocalizationManager")
		if victory_title:
			victory_title.text = lm.t("KEY_VICTORY") if lm else "🎉 VICTORY! 🎉"
		if victory_score:
			victory_score.text = lm.t("KEY_FINAL_SCORE") % final_score if lm else "Score: %d" % final_score
		if next_level_btn and lm: next_level_btn.text = lm.t("KEY_NEXT_LEVEL")
		if victory_levels_btn and lm: victory_levels_btn.text = lm.t("KEY_SELECT_LEVEL")

		if stars_label:
			var stars_str = "⭐⭐⭐" if stars == 3 else ("⭐⭐" if stars == 2 else "⭐")
			stars_label.text = stars_str

		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		victory_modal.scale = Vector2(0.5, 0.5)
		tween.tween_property(victory_modal, "scale", Vector2.ONE, 0.3)

func _on_level_failed() -> void:
	if fail_modal:
		fail_modal.visible = true
		var lm = get_node_or_null("/root/LocalizationManager")
		if fail_title and lm: fail_title.text = lm.t("KEY_FAIL")
		if nuke_ad_btn and lm: nuke_ad_btn.text = lm.t("KEY_AD_NUKE")
		if retry_btn and lm: retry_btn.text = lm.t("KEY_RETRY")
		if fail_levels_btn and lm: fail_levels_btn.text = lm.t("KEY_SELECT_LEVEL")

		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		fail_modal.scale = Vector2(0.5, 0.5)
		tween.tween_property(fail_modal, "scale", Vector2.ONE, 0.3)

func _on_nuke_ad_pressed() -> void:
	if fail_modal: fail_modal.visible = false
	GameManager.available_eggs.append("blackhole")
	GameManager.is_level_active = true
	GameManager.is_settling = false
	_refresh_egg_icons()
