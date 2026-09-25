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

static var tex_egg_splat: Texture2D = null
static var tex_fireball: Texture2D = null
static var tex_drill_spark: Texture2D = null
static var tex_metal_chip: Texture2D = null
static var tex_kinetic_wave: Texture2D = null
static var tex_freezing_fog: Texture2D = null
static var tex_toxic_fume: Texture2D = null
static var tex_gravity_ring: Texture2D = null
static var tex_cosmic_star: Texture2D = null
static var tex_eggshell_chip: Texture2D = null

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

		tex_egg_splat = _safe_load("res://assets/sprites/vfx/vfx_egg_splat_yolk.svg")
		tex_fireball = _safe_load("res://assets/sprites/vfx/vfx_fireball_cartoon.svg")
		tex_drill_spark = _safe_load("res://assets/sprites/vfx/particle_drill_spark.svg")
		tex_metal_chip = _safe_load("res://assets/sprites/vfx/vfx_metal_cutting_chip.svg")
		tex_kinetic_wave = _safe_load("res://assets/sprites/vfx/vfx_kinetic_impact_wave.svg")
		tex_freezing_fog = _safe_load("res://assets/sprites/vfx/vfx_freezing_fog_cloud.svg")
		tex_toxic_fume = _safe_load("res://assets/sprites/vfx/vfx_toxic_fume_smoke.svg")
		tex_gravity_ring = _safe_load("res://assets/sprites/vfx/vfx_gravity_distortion_ring.svg")
		tex_cosmic_star = _safe_load("res://assets/sprites/vfx/vfx_cosmic_star_dust.svg")
		tex_eggshell_chip = _safe_load("res://assets/sprites/vfx/vfx_eggshell_shard_chip.svg")

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

static func apply_drill_spark_fx(p: CPUParticles2D, scale_min: float = 0.25, scale_max: float = 0.55) -> void:
	if not p: return
	_init_textures()
	if tex_drill_spark: p.texture = tex_drill_spark
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_metal_chip_fx(p: CPUParticles2D, scale_min: float = 0.25, scale_max: float = 0.5) -> void:
	if not p: return
	_init_textures()
	if tex_metal_chip: p.texture = tex_metal_chip
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

static func apply_star_fx(p: CPUParticles2D, scale_min: float = 0.25, scale_max: float = 0.55) -> void:
	if not p: return
	_init_textures()
	var s = tex_cosmic_star if tex_cosmic_star else tex_spark
	if s: p.texture = s
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
# 1. HỆ THỐNG PARTICLE VÀ HERO VFX NỔ RIÊNG BIỆT THEO TỪNG LOẠI TRỨNG
# =============================================================================
static var _last_fx_time: float = 0.0
static var _fx_count_window: int = 0

static func spawn_egg_break_fx(parent: Node, pos: Vector2, egg_type: String, is_boosted: bool = false) -> void:
	if not parent: return
	_init_textures()

	# Throttling & Dynamic Budgeting khi xảy ra nổ chuỗi đồng thời (P1-13)
	var now = Time.get_ticks_msec() / 1000.0
	if now - _last_fx_time < 0.12:
		_fx_count_window += 1
	else:
		_last_fx_time = now
		_fx_count_window = 1

	var is_dense = _fx_count_window > 1
	var smoke_count = 1 if is_dense else 2
	var shard_count = 2 if is_dense else 3
	var accent_count = 1 if is_dense else 2

	var smoke_col = Color(1.0, 0.98, 0.92, 0.88)
	var shard_col = Color(0.98, 0.94, 0.86, 1.0)
	var accent_col = Color(1.0, 0.78, 0.12, 0.95)
	var accent_is_star = false

	# 0. Hero Impact Flash & Signature VFX Overlay
	var hero_tex: Texture2D = null
	var hero_scale_max = 1.0
	var hero_color = Color.WHITE

	match egg_type:
		"normal":
			hero_tex = tex_egg_splat
			hero_scale_max = 0.75
			hero_color = Color(1.0, 0.95, 0.8)
			if is_boosted:
				smoke_col = Color(0.4, 0.85, 1.0, 0.85)
				shard_col = Color(0.35, 0.9, 1.0, 1.0)
				accent_col = Color(0.85, 1.0, 1.0, 0.95)
				accent_is_star = true
			else:
				smoke_col = Color(1.0, 0.98, 0.92, 0.88)
				shard_col = Color(0.98, 0.94, 0.86, 1.0)
				accent_col = Color(1.0, 0.78, 0.12, 0.95)
				accent_is_star = false
		"bomb":
			hero_tex = tex_fireball
			hero_scale_max = 1.25
			hero_color = Color(1.0, 0.8, 0.6)
			smoke_col = Color(0.24, 0.22, 0.24, 0.92)
			shard_col = Color(0.38, 0.38, 0.42, 1.0)
			accent_col = Color(1.0, 0.55, 0.12, 0.95)
			accent_is_star = true
		"drill":
			hero_tex = tex_kinetic_wave
			hero_scale_max = 1.15
			hero_color = Color(1.0, 0.9, 0.4)
			smoke_col = Color(0.45, 0.48, 0.52, 0.85)
			shard_col = Color(0.72, 0.78, 0.86, 1.0)
			accent_col = Color(1.0, 0.88, 0.25, 0.95)
			accent_is_star = true
		"frost":
			hero_tex = tex_freezing_fog
			hero_scale_max = 1.1
			hero_color = Color(0.85, 0.95, 1.0, 0.95)
			smoke_col = Color(0.65, 0.88, 1.0, 0.85)
			shard_col = Color(0.75, 0.95, 1.0, 1.0)
			accent_col = Color(0.92, 0.98, 1.0, 0.95)
			accent_is_star = true
		"acid":
			hero_tex = tex_toxic_fume
			hero_scale_max = 1.15
			hero_color = Color(0.8, 1.0, 0.4, 0.95)
			smoke_col = Color(0.32, 0.85, 0.22, 0.85)
			shard_col = Color(0.55, 0.95, 0.2, 1.0)
			accent_col = Color(0.45, 1.0, 0.15, 0.95)
			accent_is_star = false
		"cluster":
			hero_tex = tex_eggshell_chip
			hero_scale_max = 0.85
			hero_color = Color(1.0, 0.95, 0.85)
			smoke_col = Color(1.0, 0.95, 0.85, 0.85)
			shard_col = Color(0.98, 0.92, 0.85, 1.0)
			accent_col = Color(1.0, 0.88, 0.25, 0.95)
			accent_is_star = true
		"blackhole":
			hero_tex = tex_gravity_ring
			hero_scale_max = 1.2
			hero_color = Color(0.9, 0.6, 1.0, 0.95)
			smoke_col = Color(0.2, 0.12, 0.28, 0.92)
			shard_col = Color(0.65, 0.2, 0.95, 1.0)
			accent_col = Color(0.92, 0.35, 1.0, 0.95)
			accent_is_star = true

	if hero_tex:
		var hero_spr = Sprite2D.new()
		hero_spr.texture = hero_tex
		hero_spr.global_position = pos
		hero_spr.scale = Vector2(0.25, 0.25)
		hero_spr.modulate = hero_color
		parent.add_child(hero_spr)

		var h_tw = hero_spr.create_tween()
		h_tw.parallel().tween_property(hero_spr, "scale", Vector2(hero_scale_max, hero_scale_max), 0.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		h_tw.parallel().tween_property(hero_spr, "modulate:a", 0.0, 0.35).set_delay(0.08)
		h_tw.tween_callback(hero_spr.queue_free)

	# 1. Khói Cartoon Puff đặc trưng từng loại trứng
	var tex_s = tex_comic_smoke if tex_comic_smoke else tex_smoke
	if tex_s:
		for i in range(smoke_count):
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
		"drill": chosen_shard_tex = tex_metal_chip if tex_metal_chip else tex_shard
		"frost": chosen_shard_tex = tex_frost if tex_frost else tex_shard
		"acid": chosen_shard_tex = tex_acid if tex_acid else tex_circle
		"cluster": chosen_shard_tex = tex_eggshell_chip if tex_eggshell_chip else tex_feather
		"blackhole": chosen_shard_tex = tex_void if tex_void else tex_spark

	if chosen_shard_tex:
		for i in range(shard_count):
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
	if egg_type == "drill" and tex_drill_spark:
		tex_acc = tex_drill_spark
	elif egg_type == "acid" and tex_acid:
		tex_acc = tex_acid
	elif egg_type == "blackhole" and tex_cosmic_star:
		tex_acc = tex_cosmic_star
	elif egg_type == "cluster" and tex_confetti:
		tex_acc = tex_confetti

	if tex_acc:
		for i in range(accent_count):
			var acc = Sprite2D.new()
			acc.texture = tex_acc
			acc.global_position = pos
			acc.scale = Vector2(0.35, 0.35) if not accent_is_star else Vector2(0.4, 0.4)
			acc.modulate = accent_col
			parent.add_child(acc)

			var angle = randf_range(-PI * 0.85, -PI * 0.15)
			var dist = randf_range(20.0, 50.0)
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
static var _last_monster_defeat_time: float = 0.0
static var _defeat_burst_count: int = 0

static func spawn_monster_defeat_fx(parent: Node, pos: Vector2, monster_type: String) -> void:
	if not parent: return
	_init_textures()

	# Throttling & Dynamic Budgeting khi nhiều quái vật bị diệt cùng lúc trong chuỗi nổ
	var now = Time.get_ticks_msec() / 1000.0
	if now - _last_monster_defeat_time < 0.15:
		_defeat_burst_count += 1
	else:
		_last_monster_defeat_time = now
		_defeat_burst_count = 1

	var is_dense = _defeat_burst_count > 1

	var dust_col = Color(0.82, 0.72, 0.60, 0.85) # Bụi đất hoạt hình
	var fur_col = Color(0.95, 0.50, 0.20)         # Lông thú
	var star_col = Color(1.0, 0.88, 0.18, 0.95)   # Sao vàng váng đầu
	var is_boss = monster_type.begins_with("boss_")

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
		"crystal_badger":
			dust_col = Color(0.60, 0.45, 0.75, 0.85) # Bụi thạch anh tím
			fur_col = Color(0.45, 0.35, 0.60)        # Lông lửng tím thạch anh
			star_col = Color(0.50, 0.90, 1.0, 0.98)  # Tinh thể ngọc phát sáng
		"cyber_hound":
			dust_col = Color(0.20, 0.40, 0.55, 0.85) # Bụi titan xanh
			fur_col = Color(0.15, 0.65, 0.85)        # Mảnh giáp cyber cyan
			star_col = Color(0.0, 0.95, 1.0, 0.98)   # Tia lửa điện neon
		"cyborg_fox":
			dust_col = Color(0.35, 0.45, 0.60, 0.85)
			fur_col = Color(0.85, 0.45, 0.20)
			star_col = Color(0.0, 0.90, 1.0, 0.98)
		"swamp_mutant":
			dust_col = Color(0.25, 0.45, 0.20, 0.85) # Bụi đầm lầy rêu
			fur_col = Color(0.20, 0.55, 0.18)        # Rêu ẩm ướt
			star_col = Color(0.95, 0.85, 0.15, 0.98) # Đốm vàng đầm lầy
		"spore_badger":
			dust_col = Color(0.40, 0.55, 0.30, 0.85) # Bụi bào tử nấm
			fur_col = Color(0.30, 0.60, 0.25)
			star_col = Color(0.65, 1.0, 0.25, 0.98)  # Bào tử nấm phát sáng
		"frost_yeti":
			dust_col = Color(0.75, 0.88, 1.0, 0.90) # Bụi tuyết băng tuyết
			fur_col = Color(0.90, 0.95, 1.0)         # Lông quái tuyết trắng
			star_col = Color(0.45, 0.90, 1.0, 0.98)  # Tinh thể tuyết lam
		"blizzard_wolf":
			dust_col = Color(0.65, 0.80, 0.95, 0.85)
			fur_col = Color(0.40, 0.65, 0.85)
			star_col = Color(0.50, 0.88, 1.0, 0.98)
		"magma_drake":
			dust_col = Color(0.60, 0.25, 0.15, 0.85) # Bụi dung nham bazan
			fur_col = Color(0.85, 0.35, 0.10)        # Vảy rồng đỏ rực
			star_col = Color(1.0, 0.55, 0.15, 0.98)  # Tia lửa than hồng
		"lava_golem":
			dust_col = Color(0.40, 0.20, 0.15, 0.85)
			fur_col = Color(0.90, 0.30, 0.10)
			star_col = Color(1.0, 0.60, 0.10, 0.98)
		"void_wraith":
			dust_col = Color(0.30, 0.15, 0.45, 0.90) # Bụi điểm kỳ dị tím
			fur_col = Color(0.20, 0.10, 0.35)
			star_col = Color(0.85, 0.45, 1.0, 0.98)  # Ánh sao tinh tú
		"celestial_sentinel":
			dust_col = Color(0.50, 0.35, 0.60, 0.85)
			fur_col = Color(0.95, 0.80, 0.30)        # Mảnh giáp vàng kim
			star_col = Color(1.0, 0.90, 0.35, 0.98)
		_:
			if is_boss:
				dust_col = Color(0.52, 0.82, 0.40, 0.85)
				fur_col = Color(0.95, 0.65, 0.20)
				star_col = Color(1.0, 0.88, 0.15, 1.0)

	# 1. Bụi đất nhân vật Comic Dust Puffs (KHÔNG DÙNG MÀU TRỨNG TRẮNG SỮA!)
	var tex_s = tex_comic_smoke if tex_comic_smoke else tex_smoke
	if tex_s:
		var count = (3 if is_boss else 2) if is_dense else (5 if is_boss else 4)
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
		var star_count = (4 if is_boss else 3) if is_dense else (7 if is_boss else 5)
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
		var tuft_count = 2 if is_dense else 5
		for i in range(tuft_count):
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
		var drop_count = 1 if is_dense else 3
		for i in range(drop_count):
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

## Hiển thị chữ hành động truyện tranh (Comic Action Text Popup: "BOOM!", "DRILL!", "SUPERNOVA!")
static func spawn_comic_popup(parent: Node, pos: Vector2, text: String, color: Color = Color(1.0, 0.9, 0.2)) -> void:
	if not parent or not is_instance_valid(parent): return

	var label = Label.new()
	label.text = text
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.add_theme_font_size_override("font_size", 22)
	label.add_theme_color_override("font_color", color)
	label.add_theme_color_override("font_outline_color", Color(0.06, 0.04, 0.1, 1.0))
	label.add_theme_constant_override("outline_size", 7)
	label.add_theme_constant_override("shadow_offset_y", 3)
	label.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.85))

	label.custom_minimum_size = Vector2(160, 40)
	label.pivot_offset = Vector2(80, 20)
	label.position = pos - Vector2(80, 20)
	label.scale = Vector2(0.3, 0.3)
	label.rotation = randf_range(-0.15, 0.15)
	label.z_index = 60
	label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(label)

	var tw = label.create_tween()
	tw.set_parallel(true)
	# Punchy cartoon pop
	tw.tween_property(label, "scale", Vector2(1.35, 1.35), 0.15).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.chain().tween_property(label, "scale", Vector2(1.0, 1.0), 0.1).set_trans(Tween.TRANS_QUAD)
	# Float upwards
	tw.parallel().tween_property(label, "position:y", label.position.y - 48.0, 0.55).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	# Fade out
	tw.parallel().tween_property(label, "modulate:a", 0.0, 0.25).set_delay(0.32)
	tw.chain().tween_callback(label.queue_free)

## Bắn pháo hoa giấy rực rỡ ăn mừng chiến thắng 3 sao (Confetti Cannon Burst)
static func spawn_confetti_burst(parent: Node, pos: Vector2, count: int = 24) -> void:
	if not parent or not is_instance_valid(parent): return
	_init_textures()

	var colors = [
		Color(1.0, 0.85, 0.20), # Vàng kim
		Color(1.0, 0.28, 0.40), # Hồng ngọc
		Color(0.20, 0.85, 1.00), # Xanh ngọc cyan
		Color(0.35, 0.90, 0.45), # Xanh lá tươi
		Color(0.85, 0.40, 1.00), # Tím hoa cà
		Color(1.0, 0.55, 0.20)  # Cam san hô
	]

	for i in range(count):
		var ribbon = Sprite2D.new()
		ribbon.texture = tex_confetti if tex_confetti else tex_shard
		ribbon.global_position = pos + Vector2(randf_range(-12, 12), randf_range(-8, 8))
		ribbon.scale = Vector2(randf_range(0.35, 0.65), randf_range(0.35, 0.65))
		ribbon.modulate = colors[randi() % colors.size()]
		ribbon.z_index = 80
		parent.add_child(ribbon)

		# Quỹ đạo bung nở pháo hoa hình quạt hướng lên
		var angle = randf_range(-PI * 0.85, -PI * 0.15)
		var speed = randf_range(160.0, 340.0)
		var vel = Vector2(cos(angle), sin(angle)) * speed
		var end_pos = ribbon.global_position + vel * 0.45 + Vector2(randf_range(-30, 30), randf_range(80, 160))

		var tw = ribbon.create_tween()
		tw.set_parallel(true)
		tw.tween_property(ribbon, "global_position:x", end_pos.x, randf_range(0.8, 1.2)).set_trans(Tween.TRANS_SINE)
		# Lượn parabol lên đỉnh rồi rơi chậm
		var apex_y = ribbon.global_position.y + vel.y * 0.25
		tw.chain().tween_property(ribbon, "global_position:y", apex_y, 0.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tw.chain().tween_property(ribbon, "global_position:y", end_pos.y, 0.75).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
		# Xoay ruy băng liên tục
		tw.parallel().tween_property(ribbon, "rotation", randf_range(-8.0, 8.0), 1.1)
		# Mờ dần
		tw.parallel().tween_property(ribbon, "modulate:a", 0.0, 0.35).set_delay(0.75)
		tw.chain().tween_callback(ribbon.queue_free)


