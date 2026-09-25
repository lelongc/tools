extends CanvasLayer

const JuicyButton = preload("res://scripts/ui/JuicyButton.gd")

signal settings_closed()

@onready var panel: PanelContainer = $CenterContainer/Panel
@onready var title_label: Label = $CenterContainer/Panel/Margin/VBox/Title
@onready var lbl_bgm: Label = $CenterContainer/Panel/Margin/VBox/AudioGrid/LblBGM
@onready var slider_bgm: HSlider = $CenterContainer/Panel/Margin/VBox/AudioGrid/SliderBGM
@onready var lbl_bgm_val: Label = $CenterContainer/Panel/Margin/VBox/AudioGrid/LblBGMVal

@onready var lbl_sfx: Label = $CenterContainer/Panel/Margin/VBox/AudioGrid/LblSFX
@onready var slider_sfx: HSlider = $CenterContainer/Panel/Margin/VBox/AudioGrid/SliderSFX
@onready var lbl_sfx_val: Label = $CenterContainer/Panel/Margin/VBox/AudioGrid/LblSFXVal

@onready var lbl_vib: Label = $CenterContainer/Panel/Margin/VBox/HapticsBox/LblVib
@onready var btn_vib: Button = $CenterContainer/Panel/Margin/VBox/HapticsBox/BtnVib

@onready var lbl_lang: Label = $CenterContainer/Panel/Margin/VBox/LangBox/LblLang
@onready var btn_lang: Button = $CenterContainer/Panel/Margin/VBox/LangBox/BtnLang

@onready var btn_reset_progress: Button = $CenterContainer/Panel/Margin/VBox/DangerZone/BtnResetProgress
@onready var confirm_box: VBoxContainer = $CenterContainer/Panel/Margin/VBox/ConfirmBox
@onready var lbl_confirm_warn: Label = $CenterContainer/Panel/Margin/VBox/ConfirmBox/LblConfirmWarn
@onready var btn_confirm_yes: Button = $CenterContainer/Panel/Margin/VBox/ConfirmBox/HBox/BtnConfirmYes
@onready var btn_confirm_no: Button = $CenterContainer/Panel/Margin/VBox/ConfirmBox/HBox/BtnConfirmNo

@onready var btn_close: Button = $CenterContainer/Panel/Margin/VBox/BtnClose

var bgm_bus_idx: int = 1
var sfx_bus_idx: int = 2

func _ready() -> void:
	bgm_bus_idx = AudioServer.get_bus_index("BGM")
	sfx_bus_idx = AudioServer.get_bus_index("SFX")
	if bgm_bus_idx == -1: bgm_bus_idx = 0
	if sfx_bus_idx == -1: sfx_bus_idx = 0

	# Nạp giá trị âm lượng hiện hành
	var bgm_vol = db_to_linear(AudioServer.get_bus_volume_db(bgm_bus_idx))
	var sfx_vol = db_to_linear(AudioServer.get_bus_volume_db(sfx_bus_idx))
	if AudioServer.is_bus_mute(bgm_bus_idx): bgm_vol = 0.0
	if AudioServer.is_bus_mute(sfx_bus_idx): sfx_vol = 0.0

	if slider_bgm:
		slider_bgm.value = bgm_vol * 100.0
		slider_bgm.value_changed.connect(_on_bgm_slider_changed)
	if slider_sfx:
		slider_sfx.value = sfx_vol * 100.0
		slider_sfx.value_changed.connect(_on_sfx_slider_changed)

	_update_slider_labels()

	if btn_vib:
		btn_vib.pressed.connect(_on_vib_pressed)
	_update_vib_button()

	if btn_lang:
		btn_lang.pressed.connect(_on_lang_pressed)

	if btn_reset_progress:
		btn_reset_progress.pressed.connect(_on_reset_clicked)

	if btn_confirm_yes:
		btn_confirm_yes.pressed.connect(_on_confirm_reset)
	if btn_confirm_no:
		btn_confirm_no.pressed.connect(_on_cancel_reset)

	if confirm_box:
		confirm_box.visible = false

	if btn_close:
		btn_close.pressed.connect(_on_close_pressed)

	var backdrop = get_node_or_null("Backdrop")
	if backdrop:
		backdrop.gui_input.connect(func(event: InputEvent):
			if (event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed()) or (event is InputEventScreenTouch and event.is_pressed()):
				_on_close_pressed()
		)

	_apply_cartoon_ui_theme()
	_update_text_localization()

	# Hoạt ảnh mở modal đàn hồi
	if panel:
		panel.pivot_offset = panel.size * 0.5
		panel.scale = Vector2(0.5, 0.5)
		var tw = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw.tween_property(panel, "scale", Vector2.ONE, 0.28)

func _apply_cartoon_ui_theme() -> void:
	if panel:
		var sbt_modal = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_modal_wood_frame.svg", 36, 36, 36, 44)
		if sbt_modal: panel.add_theme_stylebox_override("panel", sbt_modal)
	if title_label:
		var sbt_ribbon = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/banner_ribbon_wood.svg", 36, 12, 36, 18)
		if sbt_ribbon:
			title_label.add_theme_stylebox_override("normal", sbt_ribbon)
			title_label.add_theme_color_override("font_color", Color(1.0, 0.96, 0.90))
			title_label.add_theme_color_override("font_outline_color", Color(0.18, 0.08, 0.02))
			title_label.add_theme_constant_override("outline_size", 6)
	if btn_close:
		if btn_close is JuicyButton or btn_close.has_method("set_button_style"):
			btn_close.set_button_style("red")
	if btn_reset_progress:
		if btn_reset_progress is JuicyButton or btn_reset_progress.has_method("set_button_style"):
			btn_reset_progress.set_button_style("red")
	if btn_confirm_yes:
		if btn_confirm_yes is JuicyButton or btn_confirm_yes.has_method("set_button_style"):
			btn_confirm_yes.set_button_style("red")
	if btn_confirm_no:
		if btn_confirm_no is JuicyButton or btn_confirm_no.has_method("set_button_style"):
			btn_confirm_no.set_button_style("green")
	if btn_vib:
		if btn_vib is JuicyButton or btn_vib.has_method("set_button_style"):
			btn_vib.set_button_style("gold")
	if btn_lang:
		if btn_lang is JuicyButton or btn_lang.has_method("set_button_style"):
			btn_lang.set_button_style("wood")

func _update_slider_labels() -> void:
	if lbl_bgm_val and slider_bgm:
		lbl_bgm_val.text = "%d%%" % int(slider_bgm.value)
	if lbl_sfx_val and slider_sfx:
		lbl_sfx_val.text = "%d%%" % int(slider_sfx.value)

func _on_bgm_slider_changed(val: float) -> void:
	if val <= 0.5:
		AudioServer.set_bus_mute(bgm_bus_idx, true)
	else:
		AudioServer.set_bus_mute(bgm_bus_idx, false)
		AudioServer.set_bus_volume_db(bgm_bus_idx, linear_to_db(val / 100.0))
	_update_slider_labels()

func _on_sfx_slider_changed(val: float) -> void:
	if val <= 0.5:
		AudioServer.set_bus_mute(sfx_bus_idx, true)
	else:
		AudioServer.set_bus_mute(sfx_bus_idx, false)
		AudioServer.set_bus_volume_db(sfx_bus_idx, linear_to_db(val / 100.0))
	_update_slider_labels()

func _on_vib_pressed() -> void:
	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		var is_enabled = sm.is_vibration_enabled()
		sm.set_vibration_enabled(not is_enabled)
		if not is_enabled:
			sm.vibrate(45) # Test rung ngay khi bật
	_update_vib_button()

func _update_vib_button() -> void:
	if not btn_vib: return
	var is_on = true
	if has_node("/root/SaveManager"):
		is_on = get_node("/root/SaveManager").is_vibration_enabled()
	var lm = get_node_or_null("/root/LocalizationManager")
	var on_txt = lm.t("KEY_SOUND_ON") if lm else "BẬT"
	var off_txt = lm.t("KEY_SOUND_OFF") if lm else "TẮT"
	btn_vib.text = "  %s  " % (on_txt if is_on else off_txt)
	btn_vib.modulate = Color(0.3, 1.0, 0.4) if is_on else Color(0.7, 0.7, 0.7)

func _on_lang_pressed() -> void:
	if has_node("/root/LocalizationManager"):
		get_node("/root/LocalizationManager").cycle_language()
		_update_text_localization()
		_update_vib_button()

func _on_reset_clicked() -> void:
	if confirm_box:
		confirm_box.visible = true
	if btn_reset_progress:
		btn_reset_progress.visible = false

func _on_cancel_reset() -> void:
	if confirm_box:
		confirm_box.visible = false
	if btn_reset_progress:
		btn_reset_progress.visible = true

func _on_confirm_reset() -> void:
	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").reset_save()
	if confirm_box:
		confirm_box.visible = false
	if btn_reset_progress:
		btn_reset_progress.visible = true
		btn_reset_progress.text = "✓ Đã xóa tiến trình!"
		btn_reset_progress.disabled = true

func _update_text_localization() -> void:
	var lm = get_node_or_null("/root/LocalizationManager")
	if not lm: return
	if title_label: title_label.text = lm.t("KEY_SETTINGS")
	if lbl_bgm: lbl_bgm.text = "🎵 " + lm.t("KEY_BGM_VOLUME")
	if lbl_sfx: lbl_sfx.text = "🔊 " + lm.t("KEY_SFX_VOLUME")
	if lbl_vib: lbl_vib.text = "📳 " + lm.t("KEY_VIBRATION")
	if lbl_lang: lbl_lang.text = "🌐 Ngôn ngữ"
	if btn_lang: btn_lang.text = lm.get_current_language_display()
	if btn_reset_progress and not btn_reset_progress.disabled:
		btn_reset_progress.text = "⚠️ " + lm.t("KEY_RESET_PROGRESS")
	if lbl_confirm_warn:
		lbl_confirm_warn.text = lm.t("KEY_RESET_CONFIRM_DESC")
	if btn_confirm_yes:
		btn_confirm_yes.text = lm.t("KEY_CONFIRM")
	if btn_confirm_no:
		btn_confirm_no.text = lm.t("KEY_CANCEL")
	if btn_close:
		btn_close.text = lm.t("KEY_CLOSE")

func _on_close_pressed() -> void:
	if panel:
		var tw = create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
		tw.tween_property(panel, "scale", Vector2(0.3, 0.3), 0.18)
		await tw.finished
	settings_closed.emit()
	queue_free()

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		_on_close_pressed()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		_on_close_pressed()
