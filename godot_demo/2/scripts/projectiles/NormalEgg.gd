extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var egg_name: String = "Heavy Normal Egg"
@export var base_damage: float = 130.0
@export var min_impact_speed: float = 50.0
@export var max_bounces_before_break: int = 4
@export var post_impact_lifespan: float = 2.2 # Tồn tại 2.2s sau cú chạm đầu để lăn, nảy, xô đổ
@export var settle_still_threshold: float = 25.0 # Tốc độ tối thiểu xem như đứng yên
@export var settle_still_duration: float = 0.7 # Dừng lại 0.7s là vỡ

var bounces: int = 0
var has_first_impact: bool = false
var is_breaking: bool = false
var has_boosted: bool = false
var pre_impact_velocity: Vector2 = Vector2.ZERO
var life_timer: float = 0.0
var still_timer: float = 0.0

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var trail_particles: CPUParticles2D = get_node_or_null("Trail")
@onready var break_particles: CPUParticles2D = get_node_or_null("BreakFX")

static var tex_cartoon_smoke: Texture2D = null
static var tex_shell_shard: Texture2D = null
static var tex_yolk_dot: Texture2D = null

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 8
	body_entered.connect(_on_body_entered)

	# Vật lý nảy & lăn đàn hồi chuẩn Angry Birds
	var pmat = PhysicsMaterial.new()
	pmat.bounce = 0.36
	pmat.friction = 0.42
	physics_material_override = pmat

	ParticleHelper.setup_egg_visual(visual_root, "res://assets/sprites/projectiles/egg_normal.svg")
	if trail_particles: ParticleHelper.apply_circle_fx(trail_particles, 0.25, 0.5)
	if break_particles: ParticleHelper.apply_shard_fx(break_particles, 0.3, 0.6)

	_load_fx_textures()

static func _load_fx_textures() -> void:
	if tex_cartoon_smoke == null:
		tex_cartoon_smoke = ParticleHelper._safe_load("res://assets/sprites/vfx/smoke_puff_cartoon.svg")
		tex_shell_shard = ParticleHelper._safe_load("res://assets/sprites/vfx/particle_shard_chip.svg")
		tex_yolk_dot = ParticleHelper._safe_load("res://assets/sprites/vfx/particle_circle_smooth.svg")

func _unhandled_input(event: InputEvent) -> void:
	# Tap-in-Flight: Chạm màn hình khi đang bay để hóa Trứng Kim Cương Siêu Nặng
	if not is_breaking and not has_boosted and not has_first_impact and (event is InputEventMouseButton or event is InputEventScreenTouch) and event.is_pressed():
		_activate_special_ability()

func _activate_special_ability() -> void:
	has_boosted = true
	mass = 7.5
	base_damage = 280.0
	linear_velocity = Vector2(0, max(linear_velocity.y * 1.4, 720.0))
	pre_impact_velocity = linear_velocity
	CameraShake.add_trauma(0.25)

	if visual_root:
		var tween = create_tween()
		tween.tween_property(visual_root, "scale", Vector2(1.5, 1.5), 0.1)
		var body = visual_root.get_node_or_null("EggBody")
		if body: body.modulate = Color(0.3, 0.85, 1.0) # Hóa kim cương xanh óng ánh

func _physics_process(delta: float) -> void:
	if is_breaking: return

	# Lưu lại vận tốc thực tế của quả trứng trước khi solver can thiệp hãm vận tốc
	if linear_velocity.length() > 30.0:
		pre_impact_velocity = linear_velocity

	# Khi chưa chạm: squash & stretch và quay đầu theo hướng bay
	if not has_first_impact:
		if linear_velocity.length() > 30.0:
			var target_rot = linear_velocity.angle() + PI * 0.5
			rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

		if visual_root:
			var spd = max(linear_velocity.length(), pre_impact_velocity.length())
			var stretch = clamp(spd / 650.0, 0.0, 0.35)
			visual_root.scale = Vector2(1.0 - stretch * 0.5, 1.0 + stretch)
	else:
		# Sau cú chạm đầu: quả trứng lăn tự nhiên theo góc quay vật lý
		if visual_root:
			visual_root.scale = visual_root.scale.lerp(Vector2.ONE, 8.0 * delta)

		# Đếm lùi thời gian sống sau khi chạm
		life_timer -= delta
		if life_timer <= 0.0:
			_crack_and_destroy()
			return

		# Kiểm tra xem quả trứng đã dừng lăn / đứng yên chưa
		if linear_velocity.length() < settle_still_threshold:
			still_timer += delta
			if still_timer >= settle_still_duration:
				_crack_and_destroy()
				return
		else:
			still_timer = 0.0

func _on_body_entered(body: Node) -> void:
	if is_breaking: return

	# Vận tốc va đập chuẩn xác: Lấy max giữa vận tốc tức thời và vận tốc ngay trước va chạm
	var current_spd = linear_velocity.length()
	var pre_spd = pre_impact_velocity.length()
	var impact_speed = max(current_spd, pre_spd)

	if impact_speed < min_impact_speed:
		return

	# Đánh thức khối ngay lập tức
	if body.has_method("wake_up"):
		body.wake_up()

	# Tính toán sát thương động năng
	var damage_dealt: float = 0.0
	if not has_first_impact:
		# Cú đập đầu tiên: Toàn lực sát thương cực đại
		var damage_mult = clamp(impact_speed / 240.0, 1.0, 4.0)
		damage_dealt = base_damage * damage_mult
		has_first_impact = true
		life_timer = post_impact_lifespan # Bắt đầu đếm 2.2s để lăn, xô đổ
		still_timer = 0.0

		# Rung nhẹ camera và âm thanh va chạm chắc nịch
		if impact_speed > 220.0:
			CameraShake.add_trauma(0.18 if impact_speed > 500.0 else 0.10)
		if has_node("/root/SoundManager"):
			get_node("/root/SoundManager").play_synth_tone(240.0, 0.10, "pop", 0.9)
	else:
		# Các cú nảy / lăn tiếp theo: Sát thương phụ xô đẩy
		damage_dealt = base_damage * 0.45 * clamp(impact_speed / 180.0, 0.35, 1.8)
		if has_node("/root/SoundManager") and impact_speed > 120.0:
			get_node("/root/SoundManager").play_synth_tone(180.0, 0.06, "pop", 0.6)

	# Gây sát thương vật lý lên khối hoặc quái bị va chạm
	if body.has_method("take_damage"):
		body.take_damage(damage_dealt, global_position)

	# Truyền xung lực vật lý (Impulse) trực diện xô vỡ công trình
	if body is RigidBody2D and not body.freeze:
		var push_dir = pre_impact_velocity.normalized() if pre_impact_velocity != Vector2.ZERO else (linear_velocity.normalized() if linear_velocity != Vector2.ZERO else Vector2.DOWN)
		var impulse_mag = min(impact_speed * mass * 0.32, 1400.0)
		body.apply_impulse(push_dir * impulse_mag, global_position - body.global_position)

	bounces += 1
	if bounces >= max_bounces_before_break:
		_crack_and_destroy()

func _crack_and_destroy() -> void:
	if is_breaking: return
	is_breaking = true

	# Tắt va chạm vật lý để không bị kẹt hay giật
	set_deferred("freeze", true)
	var col = get_node_or_null("CollisionShape2D")
	if col: col.set_deferred("disabled", true)

	# Âm thanh nứt vỡ vui nhộn
	if has_node("/root/SoundManager"):
		var sm = get_node("/root/SoundManager")
		sm.play_synth_tone(420.0, 0.12, "pop", 0.95)
		sm.play_synth_tone(580.0, 0.14, "sine", 0.8)

	# 1. Hiệu ứng rung lắc nhẹ trước khi vỡ
	if visual_root:
		var wobble = create_tween()
		wobble.tween_property(visual_root, "scale", Vector2(1.25, 0.75), 0.06)
		wobble.tween_property(visual_root, "scale", Vector2(0.85, 1.2), 0.06)
		wobble.tween_property(visual_root, "scale", Vector2(1.35, 1.35), 0.08)
		wobble.parallel().tween_property(visual_root, "modulate:a", 0.0, 0.12)
		wobble.finished.connect(func(): visual_root.visible = false)

	# 2. Sinh chùm mây khói hoạt hình + mảnh vỏ trứng + tia lòng đỏ theo loại trứng
	ParticleHelper.spawn_egg_break_fx(get_parent(), global_position, "normal", has_boosted)

	# 3. Kích hoạt hạt vỡ BreakFX gốc nếu có
	if break_particles:
		break_particles.restart()
		break_particles.emitting = true

	await get_tree().create_timer(0.4).timeout
	queue_free()

