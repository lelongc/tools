extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")
const ChickScene = preload("res://scenes/prefabs/ClusterChick.tscn")
const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

@export var egg_name: String = "Cluster Chicks Egg"
@export var chick_count: int = 4

var is_broken: bool = false
var has_boosted: bool = false

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var hatch_particles: CPUParticles2D = get_node_or_null("HatchFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	ParticleHelper.setup_egg_visual(visual_root, "res://assets/sprites/projectiles/egg_cluster.svg")
	if hatch_particles:
		ParticleHelper.apply_smoke_fx(hatch_particles, 0.35, 0.7)

func _unhandled_input(event: InputEvent) -> void:
	if not is_broken and not has_boosted and event is InputEventMouseButton and event.pressed:
		has_boosted = true
		_hatch_chicks()

func _physics_process(delta: float) -> void:
	if is_broken: return
	if linear_velocity.length() > 30.0:
		var target_rot = linear_velocity.angle() + PI * 0.5
		rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

func _on_body_entered(_body: Node) -> void:
	if is_broken: return
	_hatch_chicks()

func _hatch_chicks() -> void:
	if is_broken: return
	is_broken = true

	CameraShake.add_trauma(0.3)
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_egg_drop()

	set_deferred("freeze", true)
	if visual_root: visual_root.visible = false

	if hatch_particles:
		hatch_particles.restart()
		hatch_particles.emitting = true

	# Bắn tỏa 4 chú gà con nảy tưng bừng
	for i in range(chick_count):
		var chick = ChickScene.instantiate()
		chick.global_position = global_position + Vector2(randf_range(-12.0, 12.0), randf_range(-12.0, 12.0))
		var angle = (float(i) / float(chick_count)) * TAU + randf_range(-0.3, 0.3)
		var spd = randf_range(280.0, 480.0)
		chick.linear_velocity = Vector2(cos(angle), sin(angle)) * spd
		get_parent().add_child(chick)

	await get_tree().create_timer(0.4).timeout
	queue_free()
