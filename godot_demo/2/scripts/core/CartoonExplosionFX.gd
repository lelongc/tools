extends Node
class_name CartoonExplosionFX

static var tex_ring: Texture2D = null
static var tex_smoke: Texture2D = null
static var tex_flash: Texture2D = null

static func _init_textures() -> void:
	if tex_ring == null:
		tex_ring = _safe_load("res://assets/sprites/vfx/explosion_comic_ring.svg")
		tex_smoke = _safe_load("res://assets/sprites/vfx/smoke_puff_cartoon.svg")
		tex_flash = _safe_load("res://assets/sprites/vfx/explosion_flash_star.svg")

static func _safe_load(path: String) -> Texture2D:
	var global_path = ProjectSettings.globalize_path(path)
	if FileAccess.file_exists(global_path):
		var img = Image.load_from_file(global_path)
		if img:
			var tex = ImageTexture.create_from_image(img)
			tex.resource_path = path
			return tex
	if ResourceLoader.exists(path):
		return load(path)
	return null

static func spawn_comic_explosion(parent: Node, pos: Vector2, radius: float = 160.0) -> void:
	if not parent: return
	_init_textures()

	# 1. Comic Flash Star
	if tex_flash:
		var flash = Sprite2D.new()
		flash.texture = tex_flash
		flash.global_position = pos
		flash.scale = Vector2(0.3, 0.3)
		flash.rotation = randf() * TAU
		parent.add_child(flash)

		var tw_f = flash.create_tween()
		tw_f.parallel().tween_property(flash, "scale", Vector2(1.5, 1.5) * (radius / 160.0), 0.12).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tw_f.parallel().tween_property(flash, "rotation", flash.rotation + 0.5, 0.14)
		tw_f.parallel().tween_property(flash, "modulate:a", 0.0, 0.14).set_delay(0.04)
		tw_f.tween_callback(flash.queue_free)

	# 2. Comic Shockwave Ring
	if tex_ring:
		var ring = Sprite2D.new()
		ring.texture = tex_ring
		ring.global_position = pos
		ring.scale = Vector2(0.15, 0.15)
		parent.add_child(ring)

		var target_scale = (radius / 75.0) * Vector2.ONE
		var tw_r = ring.create_tween()
		tw_r.parallel().tween_property(ring, "scale", target_scale, 0.24).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tw_r.parallel().tween_property(ring, "modulate:a", 0.0, 0.24).set_trans(Tween.TRANS_SINE)
		tw_r.tween_callback(ring.queue_free)

	# 3. Fluffy Cartoon Smoke Puffs (Radiating outwards)
	if tex_smoke:
		var num_puffs = 7
		for i in range(num_puffs):
			var angle = (float(i) / float(num_puffs)) * TAU + randf_range(-0.3, 0.3)
			var dir = Vector2(cos(angle), sin(angle))
			var dist = randf_range(radius * 0.45, radius * 0.85)

			var puff = Sprite2D.new()
			puff.texture = tex_smoke
			puff.global_position = pos + dir * 12.0
			puff.scale = Vector2(0.25, 0.25)
			puff.rotation = randf() * TAU
			puff.modulate = Color(1, 1, 1, 0.95)
			parent.add_child(puff)

			var tw_p = puff.create_tween()
			var travel_time = randf_range(0.32, 0.45)
			var target_p_scale = randf_range(0.75, 1.15) * Vector2.ONE
			tw_p.parallel().tween_property(puff, "global_position", pos + dir * dist, travel_time).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
			tw_p.parallel().tween_property(puff, "scale", target_p_scale, travel_time)
			tw_p.parallel().tween_property(puff, "rotation", puff.rotation + randf_range(-1.5, 1.5), travel_time)
			tw_p.parallel().tween_property(puff, "modulate:a", 0.0, 0.2).set_delay(travel_time - 0.2)
			tw_p.tween_callback(puff.queue_free)
