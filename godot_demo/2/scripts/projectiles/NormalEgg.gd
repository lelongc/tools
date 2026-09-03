extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")
const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

@export var egg_name: String = "Heavy Normal Egg"
@export var base_damage: float = 130.0
@export var min_impact_speed: float = 80.0
@export var max_bounces_before_break: int = 2

var bounces: int = 0
var is_broken: bool = false
var has_boosted: bool = false
var pre_impact_velocity: Vector2 = Vector2.ZERO

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var trail_particles: CPUParticles2D = get_node_or_null("Trail")
@onready var break_particles: CPUParticles2D = get_node_or_null("BreakFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	ParticleHelper.setup_egg_visual(visual_root, "res://assets/sprites/projectiles/egg_normal.svg")
	if trail_particles: ParticleHelper.apply_circle_fx(trail_particles, 0.25, 0.5)
	if break_particles: ParticleHelper.apply_shard_fx(break_particles, 0.3, 0.6)

func _unhandled_input(event: InputEvent) -> void:
	# Tap-in-Flight: Chạm màn hình khi đang bay để hóa Trứng Kim Cương Siêu Nặng
	if not is_broken and not has_boosted and (event is InputEventMouseButton or event is InputEventScreenTouch) and event.is_pressed():
		_activate_special_ability()

func _activate_special_ability() -> void:
	has_boosted = true
	mass = 7.0
	base_damage = 260.0
	linear_velocity = Vector2(0, max(linear_velocity.y * 1.4, 700.0))
	pre_impact_velocity = linear_velocity
	CameraShake.add_trauma(0.25)

	if visual_root:
		var tween = create_tween()
		tween.tween_property(visual_root, "scale", Vector2(1.6, 1.6), 0.1)
		var body = visual_root.get_node_or_null("EggBody")
		if body: body.modulate = Color(0.3, 0.85, 1.0) # Hóa kim cương xanh óng ánh

func _physics_process(delta: float) -> void:
	if is_broken: return

	# Lưu lại vận tốc thực tế của quả trứng trước khi tiếp đất (tránh bị solver zero vận tốc khi va chạm trực diện)
	if linear_velocity.length() > 30.0:
		pre_impact_velocity = linear_velocity

	if linear_velocity.length() > 30.0:
		var target_rot = linear_velocity.angle() + PI * 0.5
		rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

	if visual_root:
		var spd = max(linear_velocity.length(), pre_impact_velocity.length())
		var stretch = clamp(spd / 600.0, 0.0, 0.4)
		visual_root.scale = Vector2(1.0 - stretch * 0.5, 1.0 + stretch)

func _on_body_entered(body: Node) -> void:
	if is_broken: return

	# Vận tốc va đập chuẩn xác: Lấy max giữa vận tốc tức thời và vận tốc ngay trước va chạm
	var current_spd = linear_velocity.length()
	var pre_spd = pre_impact_velocity.length()
	var impact_speed = max(current_spd, pre_spd)

	if impact_speed < min_impact_speed:
		return

	# Đánh thức khối ngay lập tức
	if body.has_method("wake_up"):
		body.wake_up()

	# Gây sát thương vật lý mạnh mẽ lên khối trực diện
	if body.has_method("take_damage"):
		var damage_mult = clamp(impact_speed / 260.0, 1.0, 4.0)
		var damage_dealt = base_damage * damage_mult
		body.take_damage(damage_dealt, global_position)

	# Truyền xung lực vật lý (Impulse) trực diện xô vỡ công trình
	if body is RigidBody2D and not body.freeze:
		var push_dir = pre_impact_velocity.normalized() if pre_impact_velocity != Vector2.ZERO else Vector2.DOWN
		var impulse_mag = min(impact_speed * mass * 0.35, 1400.0)
		body.apply_impulse(push_dir * impulse_mag, global_position - body.global_position)

	# Rung màn hình và âm thanh va chạm chắc nịch
	if impact_speed > 220.0:
		CameraShake.add_trauma(0.18 if impact_speed > 500.0 else 0.12)
		if has_node("/root/SoundManager"):
			get_node("/root/SoundManager").play_synth_tone(240.0, 0.10, "pop", 0.9)

	# Đòn lao dốc vận tốc cao (> 480 px/s) nổ vỡ ngay, va chạm nhẹ nảy tiếp
	if impact_speed > 480.0:
		bounces += 2
	else:
		bounces += 1

	if bounces >= max_bounces_before_break:
		_crack_and_destroy()

func _crack_and_destroy() -> void:
	if is_broken: return
	is_broken = true
	
	set_deferred("freeze", true)

	if break_particles:
		break_particles.restart()
		break_particles.emitting = true

	if visual_root:
		var tween = create_tween()
		tween.tween_property(visual_root, "scale", Vector2(1.4, 0.4), 0.08)
		tween.tween_property(visual_root, "modulate:a", 0.0, 0.12)
		await tween.finished

	await get_tree().create_timer(0.4).timeout
	queue_free()
