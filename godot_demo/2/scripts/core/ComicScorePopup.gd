extends Node
class_name ComicScorePopup

static func spawn_score_popup(parent: Node, pos: Vector2, pts: int) -> void:
	if not parent or pts <= 0: return

	var label = Label.new()
	label.text = "+" + str(pts)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER

	# Styling Comic Arcade
	label.add_theme_font_size_override("font_size", 22 if pts >= 1000 else 18)
	label.add_theme_color_override("font_color", Color(1.0, 0.88, 0.2, 1.0) if pts >= 1000 else Color(1.0, 1.0, 1.0, 1.0))
	label.add_theme_color_override("font_outline_color", Color(0.18, 0.06, 0.02, 1.0))
	label.add_theme_constant_override("outline_size", 6)

	label.pivot_offset = Vector2(40, 15)
	label.position = pos - Vector2(40, 20)
	label.scale = Vector2(0.2, 0.2)
	label.z_index = 20

	parent.add_child(label)

	var tween = label.create_tween().set_parallel(true)
	# Pop scale
	tween.tween_property(label, "scale", Vector2(1.2, 1.2), 0.15).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(label, "scale", Vector2.ONE, 0.15).set_delay(0.15)
	# Float upward
	tween.tween_property(label, "position:y", label.position.y - 50.0, 0.75).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	# Fade out
	tween.tween_property(label, "modulate:a", 0.0, 0.25).set_delay(0.50)
	
	tween.chain().tween_callback(label.queue_free)
