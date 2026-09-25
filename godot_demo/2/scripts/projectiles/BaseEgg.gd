extends RigidBody2D
class_name BaseEgg

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")
const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

@export var egg_name: String = "Normal Egg"
@export var base_damage: float = 120.0
@export var min_impact_speed: float = 50.0
@export var max_bounces_before_break: int = 4
@export var post_impact_lifespan: float = 2.2
@export var settle_still_threshold: float = 25.0
@export var settle_still_duration: float = 0.7

var bounces: int = 0
var has_first_impact: bool = false
var is_breaking: bool = false
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

	var pmat = PhysicsMaterial.new()
	pmat.bounce = 0.36
	pmat.friction = 0.42
	physics_material_override = pmat

	if trail_particles:
		ParticleHelper.apply_circle_fx(trail_particles, 0.25, 0.5)
	if break_particles:
		ParticleHelper.apply_shard_fx(break_particles, 0.3, 0.6)

	_load_fx_textures()

static func _load_fx_textures() -> void:
	if tex_cartoon_smoke == null:
		tex_cartoon_smoke = ParticleHelper._safe_load("res://assets/sprites/vfx/smoke_puff_cartoon.svg")
		tex_shell_shard = ParticleHelper._safe_load("res://assets/sprites/vfx/particle_shard_chip.svg")
		tex_yolk_dot = ParticleHelper._safe_load("res://assets/sprites/vfx/particle_circle_smooth.svg")

static func is_valid_airborne_tap(event: InputEvent) -> bool:
	if not ((event is InputEventMouseButton or event is InputEventScreenTouch) and event.is_pressed()):
		return false
	var pos: Vector2 = event.position
	# Bỏ qua khi người chơi chạm vùng TopBar (pause/cài đặt/điểm y < 110)
	# hoặc chạm khay Booster ở góc dưới màn hình (y > 870 và x > 350)
	if pos.y < 110.0 or (pos.y > 870.0 and pos.x > 350.0):
		return false
	return true

const MIN_DESPAWN_Y = -600.0
const MAX_DESPAWN_Y = 1400.0
const MAX_DESPAWN_X = 2000.0
const MAX_AIRBORNE_LIFETIME = 8.0

var total_airborne_timer: float = 0.0

func _physics_process(delta: float) -> void:
	if is_breaking: return

	total_airborne_timer += delta
	var pos = global_position
	if pos.y > MAX_DESPAWN_Y or pos.y < MIN_DESPAWN_Y or abs(pos.x) > MAX_DESPAWN_X or total_airborne_timer > MAX_AIRBORNE_LIFETIME:
		_crack_and_destroy()
		return

	if linear_velocity.length() > 30.0:
		pre_impact_velocity = linear_velocity

	if not has_first_impact:
		if linear_velocity.length() > 30.0:
			var target_rot = linear_velocity.angle() + PI * 0.5
			rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

		if visual_root:
			var spd = max(linear_velocity.length(), pre_impact_velocity.length())
			var stretch = clamp(spd / 650.0, 0.0, 0.35)
			visual_root.scale = Vector2(1.0 - stretch * 0.5, 1.0 + stretch)
	else:
		if visual_root:
			visual_root.scale = visual_root.scale.lerp(Vector2.ONE, 8.0 * delta)

		life_timer -= delta
		if life_timer <= 0.0:
			_crack_and_destroy()
			return

		if linear_velocity.length() < settle_still_threshold:
			still_timer += delta
			if still_timer >= settle_still_duration:
				_crack_and_destroy()
				return
		else:
			still_timer = 0.0

func _on_body_entered(body: Node) -> void:
	if is_breaking: return
	if has_node("/root/GameManager"):
		get_node("/root/GameManager").register_first_impact()

	var current_spd = linear_velocity.length()
	var pre_spd = pre_impact_velocity.length()
	var impact_speed = max(current_spd, pre_spd)

	if impact_speed < min_impact_speed: return

	if body.has_method("wake_up"):
		body.wake_up()

	var damage_dealt: float = 0.0
	if not has_first_impact:
		var damage_mult = clamp(impact_speed / 240.0, 1.0, 4.0)
		damage_dealt = base_damage * damage_mult
		has_first_impact = true
		life_timer = post_impact_lifespan
		still_timer = 0.0

		if impact_speed > 220.0:
			CameraShake.add_trauma(0.18 if impact_speed > 500.0 else 0.10)
		if has_node("/root/SoundManager"):
			get_node("/root/SoundManager").play_egg_bounce()
	else:
		damage_dealt = base_damage * 0.45 * clamp(impact_speed / 180.0, 0.35, 1.8)
		if has_node("/root/SoundManager") and impact_speed > 120.0:
			get_node("/root/SoundManager").play_egg_bounce()

	# Hiệu ứng biến dạng nảy tưng tưng cao su hoạt hình (Cartoon Elastic Bounce Squash)
	if visual_root and impact_speed > 80.0:
		var sq_amt = clamp(impact_speed / 550.0, 0.20, 0.45)
		visual_root.scale = Vector2(1.0 + sq_amt, 1.0 - sq_amt * 0.7)
		var bt = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
		bt.tween_property(visual_root, "scale", Vector2.ONE, 0.24)

	if body.has_method("take_damage"):
		body.take_damage(damage_dealt, global_position)

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

	set_deferred("freeze", true)
	var col = get_node_or_null("CollisionShape2D")
	if col: col.set_deferred("disabled", true)

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_egg_crack()

	if visual_root:
		var wobble = create_tween()
		wobble.tween_property(visual_root, "scale", Vector2(1.25, 0.75), 0.06)
		wobble.tween_property(visual_root, "scale", Vector2(0.85, 1.2), 0.06)
		wobble.tween_property(visual_root, "scale", Vector2(1.35, 1.35), 0.08)
		wobble.parallel().tween_property(visual_root, "modulate:a", 0.0, 0.12)
		wobble.finished.connect(func(): visual_root.visible = false)

	ParticleHelper.spawn_egg_break_fx(get_parent(), global_position, "normal", false)

	if break_particles:
		break_particles.restart()
		break_particles.emitting = true

	if not is_inside_tree() or not get_tree():
		queue_free()
		return

	await get_tree().create_timer(0.4).timeout
	if is_inside_tree():
		queue_free()


