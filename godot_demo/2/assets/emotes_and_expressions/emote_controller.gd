# emote_controller.gd
extends Node2D
# class_name EmoteController (duplicate of assets/enemies/modular_expressions/emote_controller.gd)

@onready var emote_sprite: Sprite2D = $EmoteSprite

func show_emote(texture: Texture2D, duration: float = 1.5):
	if not emote_sprite:
		return
	emote_sprite.texture = texture
	emote_sprite.visible = true
	emote_sprite.scale = Vector2.ZERO
	emote_sprite.modulate.a = 1.0
	
	# Pop-up animation with bounce
	var tween = create_tween().set_parallel(true)
	tween.tween_property(emote_sprite, "scale", Vector2.ONE, 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	
	# Floating upward
	var float_tween = create_tween()
	float_tween.tween_property(emote_sprite, "position:y", emote_sprite.position.y - 20, duration)
	
	# Fade out
	await get_tree().create_timer(duration - 0.3).timeout
	var fade_tween = create_tween()
	fade_tween.tween_property(emote_sprite, "modulate:a", 0.0, 0.3)
	await fade_tween.finished
	emote_sprite.visible = false
