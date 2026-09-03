extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")
const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

@export var egg_name: String = "Frost Shatter Egg"
@export var freeze_radius: float = 190.0

var is_broken: bool = false
var has_boosted: bool = false

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var frost_particles: CPUParticles2D = get_node_or_null("FrostFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	ParticleHelper.setup_egg_visual(visual_root, "res://assets/sprites/projectiles/egg_frost.svg")

	if frost_particles:
		ParticleHelper.apply_spark_fx(frost_particles, 0.35, 0.7)

func _unhandled_input(event: InputEvent) -> void:
	if not is_broken and not has_boosted and event is InputEventMouseButton and event.pressed:
		has_boosted = true
		_freeze_blast()

func _physics_process(delta: float) -> void:
	if is_broken: return
	if linear_velocity.length() > 30.0:
		var target_rot = linear_velocity.angle() + PI * 0.5
		rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

func _on_body_entered(_body: Node) -> void:
	if is_broken: return
	_freeze_blast()

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

func _freeze_blast() -> void:
	if is_broken: return
	is_broken = true

	CameraShake.hit_stop(0.05)
	CameraShake.add_trauma(0.4)

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_glass_break()

	set_deferred("freeze", true)
	if visual_root: visual_root.visible = false

	# Tạo sóng chấn băng tuyết phát nổ
	var ring = Sprite2D.new()
	var tex_ring = _safe_load("res://assets/sprites/vfx/ice_shockwave_ring.svg")
	if tex_ring:
		ring.texture = tex_ring
		ring.global_position = global_position
		ring.scale = Vector2(0.1, 0.1)
		ring.modulate = Color(1.0, 1.0, 1.0, 0.95)
		var p = get_parent()
		if p: p.add_child(ring)

		var target_scale = Vector2.ONE * (freeze_radius / 48.0)
		var tw = ring.create_tween()
		tw.parallel().tween_property(ring, "scale", target_scale, 0.28).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tw.parallel().tween_property(ring, "rotation", 0.4, 0.28)
		tw.parallel().tween_property(ring, "modulate:a", 0.0, 0.28).set_delay(0.06)
		tw.chain().tween_callback(ring.queue_free)

	if frost_particles:
		frost_particles.restart()
		frost_particles.emitting = true

	var space_state = get_world_2d().direct_space_state
	var query = PhysicsShapeQueryParameters2D.new()
	var circle = CircleShape2D.new()
	circle.radius = freeze_radius
	query.shape = circle
	query.transform = global_transform
	query.collide_with_bodies = true

	for res in space_state.intersect_shape(query, 32):
		var col = res.collider
		if is_instance_valid(col) and col != self:
			if col.has_method("wake_up"):
				col.wake_up()

			# Biến các khối đá/gỗ thành băng giòn dễ vỡ
			if "material_type" in col:
				col.material_type = "glass"
				col.current_health = min(col.current_health, 25.0)
				var v = col.get_node_or_null("Visual")
				if v: v.color = Color(0.6, 0.9, 1.0, 0.8)

			if col.has_method("take_damage"):
				col.take_damage(80.0, global_position)

	await get_tree().create_timer(0.5).timeout
	queue_free()
