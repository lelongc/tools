class_name PuffyTutorialModal
extends CanvasLayer

@onready var close_btn: Button = $Panel/VBox/CloseBtn

func _ready() -> void:
	add_to_group("tutorial_modal")
	process_mode = Node.PROCESS_MODE_ALWAYS
	close_btn.pressed.connect(queue_free)
