class_name PuffyGameOverModal
extends CanvasLayer

@onready var retry_btn: Button = $Panel/VBox/Buttons/RetryBtn
@onready var select_btn: Button = $Panel/VBox/Buttons/SelectBtn

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	retry_btn.pressed.connect(_on_retry_pressed)
	select_btn.pressed.connect(_on_select_pressed)

func _on_retry_pressed() -> void:
	PuffyGameManager.start_campaign_level(PuffyGameManager.current_level)

func _on_select_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/ui/PuffyLevelSelect.tscn")
