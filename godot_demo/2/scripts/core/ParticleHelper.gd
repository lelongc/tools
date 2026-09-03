extends Node
class_name ParticleHelper

static var tex_spark: Texture2D = null
static var tex_circle: Texture2D = null
static var tex_smoke: Texture2D = null
static var tex_shard: Texture2D = null

static func _init_textures() -> void:
	if tex_spark == null:
		tex_spark = _safe_load("res://assets/sprites/vfx/particle_spark_star.svg")
		tex_circle = _safe_load("res://assets/sprites/vfx/particle_circle_smooth.svg")
		tex_smoke = _safe_load("res://assets/sprites/vfx/particle_smoke_puff.svg")
		tex_shard = _safe_load("res://assets/sprites/vfx/particle_shard_chip.svg")

static var _tex_cache: Dictionary = {}

static func _safe_load(path: String) -> Texture2D:
	if _tex_cache.has(path):
		return _tex_cache[path]
	var global_path = ProjectSettings.globalize_path(path)
	if FileAccess.file_exists(global_path):
		var img = Image.load_from_file(global_path)
		if img:
			var tex = ImageTexture.create_from_image(img)
			tex.resource_path = path
			_tex_cache[path] = tex
			return tex
	if ResourceLoader.exists(path):
		var res = load(path)
		_tex_cache[path] = res
		return res
	return null

static func apply_spark_fx(p: CPUParticles2D, scale_min: float = 0.3, scale_max: float = 0.65) -> void:
	if not p: return
	_init_textures()
	if tex_spark: p.texture = tex_spark
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_circle_fx(p: CPUParticles2D, scale_min: float = 0.35, scale_max: float = 0.75) -> void:
	if not p: return
	_init_textures()
	if tex_circle: p.texture = tex_circle
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_smoke_fx(p: CPUParticles2D, scale_min: float = 0.35, scale_max: float = 0.75) -> void:
	if not p: return
	_init_textures()
	if tex_smoke: p.texture = tex_smoke
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func apply_shard_fx(p: CPUParticles2D, scale_min: float = 0.35, scale_max: float = 0.7) -> void:
	if not p: return
	_init_textures()
	if tex_shard: p.texture = tex_shard
	p.scale_amount_min = scale_min
	p.scale_amount_max = scale_max

static func setup_egg_visual(visual_root: Node, texture_path: String, scale_val: float = 0.75) -> void:
	if not visual_root: return
	var body = visual_root.get_node_or_null("EggBody")
	if body and body is Sprite2D:
		var tex = _safe_load(texture_path)
		if tex: body.texture = tex
		body.scale = Vector2(scale_val, scale_val)
