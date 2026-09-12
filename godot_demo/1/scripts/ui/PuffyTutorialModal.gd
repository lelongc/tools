class_name PuffyTutorialModal
extends CanvasLayer

@onready var title_label: Label = $Panel/VBox/Title
@onready var step1_label: Label = $Panel/VBox/Step1/Label
@onready var step2_label: Label = $Panel/VBox/Step2/Label
@onready var step3_label: Label = $Panel/VBox/Step3/Label
@onready var close_btn: Button = $Panel/VBox/CloseBtn

func _ready() -> void:
	add_to_group("tutorial_modal")
	process_mode = Node.PROCESS_MODE_ALWAYS
	close_btn.pressed.connect(_on_close_pressed)
	PuffyLocaleManager.locale_changed.connect(_on_locale_changed)
	_update_localized_texts()

func _on_locale_changed(_new_locale: String) -> void:
	_update_localized_texts()

func _update_localized_texts() -> void:
	title_label.text = PuffyLocaleManager.tr_key("TUTO_TITLE")
	step1_label.text = PuffyLocaleManager.tr_key("TUTO_STEP1")
	step2_label.text = PuffyLocaleManager.tr_key("TUTO_STEP2")
	step3_label.text = PuffyLocaleManager.tr_key("TUTO_STEP3")
	close_btn.text = PuffyLocaleManager.tr_key("TUTO_CLOSE")

func _on_close_pressed() -> void:
	PuffySoundManager.play_ui_click()
	queue_free()
