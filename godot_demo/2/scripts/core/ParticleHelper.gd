extends Node
class_name ParticleHelper

static var tex_spark: Texture2D = null
static var tex_circle: Texture2D = null
static var tex_smoke: Texture2D = null
static var tex_shard: Texture2D = null
static var tex_comic_smoke: Texture2D = null
static var tex_feather: Texture2D = null
static var tex_frost: Texture2D = null
static var tex_acid: Texture2D = null
static var tex_void: Texture2D = null
static var tex_wind: Texture2D = null
static var tex_confetti: Texture2D = null

static func _init_textures() -> void:
	if tex_spark == null:
		tex_spark = _safe_load("res://assets/sprites/vfx/particle_spark_star.svg")
		tex_circle = _safe_load("res://assets/sprites/vfx/particle_circle_smooth.svg")
		tex_smoke = _safe_load("res://assets/sprites/vfx/particle_smoke_puff.svg")
		tex_shard = _safe_load("res://assets/sprites/vfx/particle_shard_chip.svg")
		tex_comic_smoke = _safe_load("res://assets/sprites/vfx/smoke_puff_cartoon.svg")
		tex_feather = _safe_load("res://assets/sprites/vfx/particle_feather.svg")
		tex_frost = _safe_load("res://assets/sprites/vfx/particle_frost_crystal.svg")
		tex_acid = _safe_load("res://assets/sprites/vfx/particle_acid_drop.svg")
		tex_void = _safe_load("res://assets/sprites/vfx/particle_void_spiral.svg")
		tex_wind = _safe_load("res://assets/sprites/vfx/particle_wind_streak.svg")
		tex_confetti = _safe_load("res://assets/sprites/vfx/particle_confetti_ribbon.svg")

static var _tex_cache: Dictionary = {}

static func _safe_load(path: String) -> Texture2D:
	if _tex_cache.has(path):
		return _tex_cache[path]
	if ResourceLoader.exists(path):
		var res = load(path)
		if res:
			_tex_cache[path] = res
			return res
	var global_path = ProjectSettings.globalize_path(path)
	if FileAccess.file_exists(global_path):
		var img = Image.load_from_file(global_path)
		if img:
			var tex = ImageTexture.create_from_image(img)
			tex.resource_path = path
			_tex_cache[path] = tex
			return tex
	return null

static func apply_spark_fx(p: CPUParticles2D, scale_min: float = 0.25, scale_max: float = 0.55) -> void:
	if not p: return
	_init_textures()
	if tex_spark: p.texture = tex_spark
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_circle_fx(p: CPUParticles2D, scale_min: float = 0.25, scale_max: float = 0.55) -> void:
	if not p: return
	_init_textures()
	if tex_circle: p.texture = tex_circle
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_smoke_fx(p: CPUParticles2D, scale_min: float = 0.3, scale_max: float = 0.65) -> void:
	if not p: return
	_init_textures()
	var s = tex_comic_smoke if tex_comic_smoke else tex_smoke
	if s: p.texture = s
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_shard_fx(p: CPUParticles2D, scale_min: float = 0.25, scale_max: float = 0.55) -> void:
	if not p: return
	_init_textures()
	if tex_shard: p.texture = tex_shard
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_feather_fx(p: CPUParticles2D, scale_min: float = 0.3, scale_max: float = 0.6) -> void:
	if not p: return
	_init_textures()
	if tex_feather: p.texture = tex_feather
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_frost_fx(p: CPUParticles2D, scale_min: float = 0.3, scale_max: float = 0.65) -> void:
	if not p: return
	_init_textures()
	if tex_frost: p.texture = tex_frost
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_acid_fx(p: CPUParticles2D, scale_min: float = 0.3, scale_max: float = 0.6) -> void:
	if not p: return
	_init_textures()
	if tex_acid: p.texture = tex_acid
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_void_fx(p: CPUParticles2D, scale_min: float = 0.35, scale_max: float = 0.7) -> void:
	if not p: return
	_init_textures()
	if tex_void: p.texture = tex_void
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_wind_fx(p: CPUParticles2D, scale_min: float = 0.3, scale_max: float = 0.6) -> void:
	if not p: return
	_init_textures()
	if tex_wind: p.texture = tex_wind
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_confetti_fx(p: CPUParticles2D, scale_min: float = 0.3, scale_max: float = 0.65) -> void:
	if not p: return
	_init_textures()
	if tex_confetti: p.texture = tex_confetti
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func setup_egg_visual(visual_root: Node, texture_path: String, scale_val: float = 0.75) -> void:
	if not visual_root: return
	var body = visual_root.get_node_or_null("EggBody")
	if body and body is Sprite2D:
		var tex = _safe_load(texture_path)
		if tex: body.texture = tex
		body.scale = Vector2(scale_val, scale_val)

# =============================================================================
# 1. HỆ THỐNG PARTICLE VỠ TRỨNG RIÊNG BIỆT THEO TỪNG LOẠI TRỨNG
# =============================================================================
static func spawn_egg_break_fx(parent: Node, pos: Vector2, egg_type: String, is_boosted: bool = false) -> void:
	if not parent: return
	_init_textures()

	var smoke_col = Color(1.0, 0.98, 0.92, 0.88)
	var shard_col = Color(0.98, 0.94, 0.86, 1.0)
	var accent_col = Color(1.0, 0.78, 0.12, 0.95)
	var accent_is_star = false

	match egg_type:
		"normal":
			if is_boosted:
				smoke_col = Color(0.4, 0.85, 1.0, 0.85)
				shard_col = Color(0.35, 0.9, 1.0, 1.0) # Mảnh kim cương xanh
				accent_col = Color(0.85, 1.0, 1.0, 0.95) # Sao lấp lánh
				accent_is_star = true
			else:
				smoke_col = Color(1.0, 0.98, 0.92, 0.88) # Khói trắng sữa
				shard_col = Color(0.98, 0.94, 0.86, 1.0) # Vỏ trứng trắng
				accent_col = Color(1.0, 0.78, 0.12, 0.95) # Lòng đỏ vàng tươi
				accent_is_star = false
		"bomb":
			smoke_col = Color(0.24, 0.22, 0.24, 0.92) # Bồ hóng núi lửa đen
			shard_col = Color(0.38, 0.38, 0.42, 1.0)   # Mảnh gang thép vỏ bom
			accent_col = Color(1.0, 0.55, 0.12, 0.95)  # Tia lửa cam rực
			accent_is_star = true
		"drill":
			smoke_col = Color(0.45, 0.48, 0.52, 0.85) # Khói cơ khí xám
			shard_col = Color(0.72, 0.78, 0.86, 1.0)   # Mảnh thép mũi khoan
			accent_col = Color(1.0, 0.88, 0.25, 0.95)  # Tia lửa hàn vàng kim
			accent_is_star = true
		"frost":
			smoke_col = Color(0.65, 0.88, 1.0, 0.85)  # Hơi sương lạnh giá
			shard_col = Color(0.75, 0.95, 1.0, 1.0)   # Tinh thể băng sắc nhọn
			accent_col = Color(0.92, 0.98, 1.0, 0.95)  # Hoa tuyết sáng lóa
			accent_is_star = true
		"acid":
			smoke_col = Color(0.32, 0.85, 0.22, 0.85) # Hơi độc xanh chuối
			shard_col = Color(0.55, 0.95, 0.2, 1.0)    # Vảy axit ăn mòn
			accent_col = Color(0.45, 1.0, 0.15, 0.95)  # Giọt chất độc neon
			accent_is_star = false
		"cluster":
			smoke_col = Color(1.0, 0.95, 0.85, 0.85)  # Khói ổ rơm ấm
			shard_col = Color(0.98, 0.92, 0.85, 1.0)   # Vỏ trứng gà con
			accent_col = Color(1.0, 0.88, 0.25, 0.95)  # Lông tơ gà vàng
			accent_is_star = true
		"blackhole":
			smoke_col = Color(0.2, 0.12, 0.28, 0.92)  # Tinh vân tím không gian
			shard_col = Color(0.65, 0.2, 0.95, 1.0)    # Mảnh vỡ hố đen
			accent_col = Color(0.92, 0.35, 1.0, 0.95)  # Sao hấp dẫn neon
			accent_is_star = true

	# 1. Khói Cartoon Puff đặc trưng từng loại trứng
	var tex_s = tex_comic_smoke if tex_comic_smoke else tex_smoke
	if tex_s:
		for i in range(3):
			var puff = Sprite2D.new()
			puff.texture = tex_s
			var offset = Vector2(randf_range(-10, 10), randf_range(-10, 10))
			puff.global_position = pos + offset
			puff.scale = Vector2(0.2, 0.2)
			puff.modulate = smoke_col
			parent.add_child(puff)

			var tween = puff.create_tween()
			var target_scale = randf_range(0.65, 0.95)
			var target_offset = offset * 2.0 + Vector2(randf_range(-12, 12), randf_range(-18, -4))
			tween.parallel().tween_property(puff, "scale", Vector2(target_scale, target_scale), 0.32).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
			tween.parallel().tween_property(puff, "position", puff.position + target_offset, 0.32)
			tween.parallel().tween_property(puff, "modulate:a", 0.0, 0.32).set_trans(Tween.TRANS_SINE)
			tween.parallel().tween_property(puff, "rotation", randf_range(-1.0, 1.0), 0.32)
			tween.tween_callback(puff.queue_free)

	# 2. Mảnh vỏ / mảnh tinh thể / giọt độc / lông tơ văng theo loại trứng
	var chosen_shard_tex = tex_shard
	match egg_type:
		"frost": chosen_shard_tex = tex_frost if tex_frost else tex_shard
		"acid": chosen_shard_tex = tex_acid if tex_acid else tex_circle
		"cluster": chosen_shard_tex = tex_feather if tex_feather else tex_shard
		"blackhole": chosen_shard_tex = tex_void if tex_void else tex_spark

	if chosen_shard_tex:
		for i in range(5):
			var shard = Sprite2D.new()
			shard.texture = chosen_shard_tex
			shard.global_position = pos
			shard.scale = Vector2(0.45, 0.45)
			shard.modulate = shard_col
			parent.add_child(shard)

			var angle = randf_range(0, TAU)
			var dist = randf_range(25.0, 55.0)
			var dest = pos + Vector2(cos(angle), sin(angle)) * dist

			var tween = shard.create_tween()
			tween.parallel().tween_property(shard, "position", dest, 0.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
			tween.parallel().tween_property(shard, "rotation", randf_range(-3.0, 3.0), 0.35)
			tween.parallel().tween_property(shard, "scale", Vector2(0.18, 0.18), 0.35)
			tween.parallel().tween_property(shard, "modulate:a", 0.0, 0.35).set_delay(0.12)
			tween.tween_callback(shard.queue_free)

	# 3. Điểm nhấn Accent: Lòng đỏ, giọt độc, đốm sao, hoặc xoáy hư không
	var tex_acc = tex_spark if accent_is_star else tex_circle
	if egg_type == "acid" and tex_acid:
		tex_acc = tex_acid
	elif egg_type == "blackhole" and tex_void:
		tex_acc = tex_void
	elif egg_type == "cluster" and tex_feather:
		tex_acc = tex_feather

	if tex_acc:
		for i in range(3):
			var acc = Sprite2D.new()
			acc.texture = tex_acc
			acc.global_position = pos
			acc.scale = Vector2(0.35, 0.35) if not accent_is_star else Vector2(0.4, 0.4)
			acc.modulate = accent_col
			parent.add_child(acc)

			var angle = randf_range(-PI * 0.85, -PI * 0.15)
			var dist = randf_range(20.0, 45.0)
			var dest = pos + Vector2(cos(angle), sin(angle)) * dist

			var tween = acc.create_tween()
			tween.parallel().tween_property(acc, "position", dest, 0.32).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
			tween.parallel().tween_property(acc, "scale", Vector2(0.15, 0.15), 0.32)
			tween.parallel().tween_property(acc, "modulate:a", 0.0, 0.32).set_delay(0.1)
			tween.tween_callback(acc.queue_free)

# =============================================================================
# 2. HỆ THỐNG PARTICLE KHI QUÁI VẬT BỊ TIÊU DIỆT (CARTOON KNOCKOUT POOF)
# Hoàn toàn khác biệt so với trứng vỡ: Bụi đất nhân vật + Sao váng đầu + Lông thú
# =============================================================================
static func spawn_monster_defeat_fx(parent: Node, pos: Vector2, monster_type: String) -> void:
	if not parent: return
	_init_textures()

	var dust_col = Color(0.82, 0.72, 0.60, 0.85) # Bụi đất hoạt hình
	var fur_col = Color(0.95, 0.50, 0.20)         # Lông thú
	var star_col = Color(1.0, 0.88, 0.18, 0.95)   # Sao vàng váng đầu
	var is_boss = (monster_type == "boss_baron_pig")

	match monster_type:
		"sly_fox":
			dust_col = Color(0.85, 0.60, 0.38, 0.85) # Bụi cam đất
			fur_col = Color(0.96, 0.52, 0.20)        # Lông cáo cam
			star_col = Color(1.0, 0.90, 0.20, 0.95)
		"fox_guard":
			dust_col = Color(0.65, 0.62, 0.68, 0.85) # Bụi giáp sắt
			fur_col = Color(0.88, 0.44, 0.18)        # Lông cáo bảo vệ
			star_col = Color(0.80, 0.90, 1.0, 0.95)  # Mảnh giáp thép bạc
		"armored_raccoon":
			dust_col = Color(0.48, 0.42, 0.52, 0.85) # Bụi tím gấu mèo
			fur_col = Color(0.36, 0.32, 0.44)        # Lông sọc tím than
			star_col = Color(1.0, 0.85, 0.22, 0.95)
		"mine_wolf":
			dust_col = Color(0.42, 0.46, 0.54, 0.85) # Bụi đá sói hầm mỏ
			fur_col = Color(0.28, 0.32, 0.42)        # Lông sói xám sắt
			star_col = Color(1.0, 0.45, 0.25, 0.95)  # Đốm đỏ giận dữ
		"spike_hound":
			dust_col = Color(0.70, 0.56, 0.42, 0.85) # Bụi đất chó săn
			fur_col = Color(0.64, 0.46, 0.32)        # Lông nâu bulldog
			star_col = Color(0.95, 0.30, 0.25, 0.95) # Vòng gai đỏ
		"toxic_fox":
			dust_col = Color(0.45, 0.78, 0.35, 0.85) # Bụi độc xanh lá
			fur_col = Color(0.40, 0.82, 0.28)        # Lông cáo nhiễm xạ
			star_col = Color(0.80, 0.30, 0.95, 0.95) # Đốm tím hóa chất
		"imperial_boar":
			dust_col = Color(0.58, 0.44, 0.36, 0.85) # Bụi heo rừng hoàng gia
			fur_col = Color(0.54, 0.34, 0.26)        # Lông heo rừng
			star_col = Color(0.98, 0.78, 0.20, 0.95)
		"boss_baron_pig":
			dust_col = Color(0.52, 0.82, 0.40, 0.85) # Bụi xanh heo trùm
			fur_col = Color(0.48, 0.86, 0.35)        # Da xanh heo mập
			star_col = Color(1.0, 0.85, 0.15, 0.98)  # Vàng vương miện chói lóa

	# 1. Bụi đất nhân vật Comic Dust Puffs (KHÔNG DÙNG MÀU TRỨNG TRẮNG SỮA!)
	var tex_s = tex_comic_smoke if tex_comic_smoke else tex_smoke
	if tex_s:
		var count = 5 if is_boss else 4
		for i in range(count):
			var puff = Sprite2D.new()
			puff.texture = tex_s
			var offset = Vector2(randf_range(-14, 14), randf_range(-14, 14))
			puff.global_position = pos + offset
			puff.scale = Vector2(0.22, 0.22)
			puff.modulate = dust_col
			parent.add_child(puff)

			var tween = puff.create_tween()
			var target_scale = randf_range(0.85, 1.25) if is_boss else randf_range(0.75, 1.1)
			var target_offset = offset * 2.4 + Vector2(randf_range(-16, 16), randf_range(-22, -6))
			tween.parallel().tween_property(puff, "scale", Vector2(target_scale, target_scale), 0.36).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
			tween.parallel().tween_property(puff, "position", puff.position + target_offset, 0.36)
			tween.parallel().tween_property(puff, "modulate:a", 0.0, 0.36).set_trans(Tween.TRANS_SINE)
			tween.parallel().tween_property(puff, "rotation", randf_range(-1.2, 1.2), 0.36)
			tween.tween_callback(puff.queue_free)

	# 2. Chùm sao hoạt hình váng đầu (Cartoon Knockout Stars) bay xoay tròn
	if tex_spark:
		var star_count = 7 if is_boss else 5
		for i in range(star_count):
			var star = Sprite2D.new()
			star.texture = tex_spark
			star.global_position = pos + Vector2(randf_range(-10, 10), randf_range(-15, 5))
			star.scale = Vector2(0.45, 0.45) if is_boss else Vector2(0.35, 0.35)
			star.modulate = star_col
			parent.add_child(star)

			var angle = (float(i) / float(star_count)) * TAU + randf_range(-0.3, 0.3)
			var dist = randf_range(30.0, 65.0) if is_boss else randf_range(25.0, 50.0)
			var dest = star.global_position + Vector2(cos(angle), sin(angle)) * dist

			var tween = star.create_tween()
			tween.parallel().tween_property(star, "position", dest, 0.4).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
			tween.parallel().tween_property(star, "rotation", randf_range(-4.0, 4.0), 0.4)
			tween.parallel().tween_property(star, "scale", Vector2(0.15, 0.15), 0.4)
			tween.parallel().tween_property(star, "modulate:a", 0.0, 0.4).set_delay(0.12)
			tween.tween_callback(star.queue_free)

	# 3. Mảnh vụn lông thú / trang bị (Fur / Armor Tufts)
	var tex_fur_tuft = tex_feather if tex_feather else tex_shard
	if tex_fur_tuft:
		for i in range(5):
			var tuft = Sprite2D.new()
			tuft.texture = tex_fur_tuft
			tuft.global_position = pos
			tuft.scale = Vector2(0.4, 0.4)
			tuft.modulate = fur_col
			parent.add_child(tuft)

			var angle = randf_range(0, TAU)
			var dist = randf_range(22.0, 48.0)
			var dest = pos + Vector2(cos(angle), sin(angle)) * dist

			var tween = tuft.create_tween()
			tween.parallel().tween_property(tuft, "position", dest, 0.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
			tween.parallel().tween_property(tuft, "rotation", randf_range(-2.5, 2.5), 0.35)
			tween.parallel().tween_property(tuft, "scale", Vector2(0.15, 0.15), 0.35)
			tween.parallel().tween_property(tuft, "modulate:a", 0.0, 0.35).set_delay(0.1)
			tween.tween_callback(tuft.queue_free)

	# 4. Giọt mồ hôi hoảng hốt (Cartoon Shock Sweat / Tears)
	if tex_circle:
		for i in range(3):
			var drop = Sprite2D.new()
			drop.texture = tex_circle
			drop.global_position = pos + Vector2(randf_range(-8, 8), -15.0)
			drop.scale = Vector2(0.25, 0.35)
			drop.modulate = Color(0.35, 0.78, 1.0, 0.95) # Giọt nước mắt/mồ hôi xanh lơ
			parent.add_child(drop)

			var jump_dest = drop.global_position + Vector2(randf_range(-22, 22), randf_range(-35, -18))
			var tween = drop.create_tween()
			tween.parallel().tween_property(drop, "position", jump_dest, 0.32).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
			tween.parallel().tween_property(drop, "scale", Vector2(0.1, 0.1), 0.32)
			tween.parallel().tween_property(drop, "modulate:a", 0.0, 0.32).set_delay(0.08)
			tween.tween_callback(drop.queue_free)

