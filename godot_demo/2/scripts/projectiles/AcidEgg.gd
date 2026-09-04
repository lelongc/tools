extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var egg_name: String = "Acid Lava Egg"
@export var puddle_radius: float = 135.0
@export var acid_duration: float = 1.8
@export var damage_per_sec: float = 220.0

var is_broken: bool = false
var is_melting: bool = false
var has_boosted: bool = false
var melt_timer: float = 0.0

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var acid_particles: CPUParticles2D = get_node_or_null("AcidFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	ParticleHelper.setup_egg_visual(visual_root, "res://assets/sprites/projectiles/egg_acid.svg")

	if acid_particles:
		ParticleHelper.apply_acid_fx(acid_particles, 0.28, 0.58)

func _unhandled_input(event: InputEvent) -> void:
	if not is_broken and not has_boosted and (event is InputEventMouseButton or event is InputEventScreenTouch) and event.is_pressed():
		has_boosted = true
		_start_acid_melting()

func _on_body_entered(_body: Node) -> void:
	if is_broken: return
	_start_acid_melting()

static var _tex_cache: Dictionary = {}

func _safe_load(path: String) -> Texture2D:
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

func _start_acid_melting() -> void:
	if is_broken: return
	is_broken = true
	is_melting = true
	melt_timer = acid_duration

	CameraShake.add_trauma(0.35)
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_egg_drop()

	set_deferred("freeze", true)
	if visual_root: visual_root.visible = false

	# Tạo vũng hóa chất sủi bọt chân thực trên bề mặt
	var puddle = Sprite2D.new()
	var tex_puddle = _safe_load("res://assets/sprites/vfx/puddle_acid_bubble.svg")
	if tex_puddle:
		puddle.texture = tex_puddle
		puddle.global_position = global_position + Vector2(0, 10)
		puddle.scale = Vector2(0.1, 0.1)
		puddle.modulate.a = 0.95
		var p = get_parent()
		if p: p.add_child(puddle)

		var target_scale = Vector2(puddle_radius / 48.0, puddle_radius / 96.0 * 0.9)
		var tw = puddle.create_tween()
		tw.tween_property(puddle, "scale", target_scale, 0.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tw.chain().tween_property(puddle, "modulate:a", 0.0, 0.45).set_delay(acid_duration - 0.45)
		tw.tween_callback(puddle.queue_free)

	if acid_particles:
		acid_particles.restart()
		acid_particles.emitting = true

	# Bắn hạt axit: Hơi độc xanh chuối + Vảy ăn mòn + Giọt chất độc neon
	ParticleHelper.spawn_egg_break_fx(get_parent(), global_position, "acid", false)

func _physics_process(delta: float) -> void:
	if not is_melting:
		if linear_velocity.length() > 30.0:
			var target_rot = linear_velocity.angle() + PI * 0.5
			rotation = lerp_angle(rotation, target_rot, 12.0 * delta)
	else:
		melt_timer -= delta
		
		# Quét và ăn mòn toàn bộ dầm sắt / kết cấu trong vũng axit
		var space_state = get_world_2d().direct_space_state
		var query = PhysicsShapeQueryParameters2D.new()
		var circle = CircleShape2D.new()
		circle.radius = puddle_radius
		query.shape = circle
		query.transform = global_transform
		query.collide_with_bodies = true

		for res in space_state.intersect_shape(query, 16):
			var col = res.collider
			if is_instance_valid(col) and col != self:
				if col.has_method("wake_up"):
					col.wake_up()
				if col.has_method("take_damage"):
					col.take_damage(damage_per_sec * delta, global_position)

		if melt_timer <= 0.0:
			is_melting = false
			queue_free()
