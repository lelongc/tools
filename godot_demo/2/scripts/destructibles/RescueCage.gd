extends RigidBody2D
class_name RescueCage

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")
const ComicScorePopup = preload("res://scripts/core/ComicScorePopup.gd")
const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

var is_broken: bool = false
var is_awake: bool = false

@onready var visual_cage: Node2D = $Visual
@onready var cage_bars: Sprite2D = get_node_or_null("Visual/CageBars")
@onready var chick: Sprite2D = get_node_or_null("Visual/Chick")
@onready var confetti_fx: CPUParticles2D = $ConfettiFX

func _ready() -> void:
	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	if cage_bars:
		var tc = ParticleHelper._safe_load("res://assets/sprites/obstacles/rescue_cage_cartoon.svg")
		if tc: cage_bars.texture = tc

	if chick:
		var tk = ParticleHelper._safe_load("res://assets/sprites/projectiles/chick_cute_cartoon.svg")
		if tk: chick.texture = tk

	if confetti_fx:
		var tf = ParticleHelper._safe_load("res://assets/sprites/vfx/particle_confetti_ribbon.svg")
		if tf: confetti_fx.texture = tf

func wake_up() -> void:
	if is_awake: return
	is_awake = true
	set_deferred("freeze", false)

func _on_impact(body: Node) -> void:
	if is_broken: return
	if not is_awake: wake_up()

	if body is RigidBody2D:
		var speed = (linear_velocity - body.linear_velocity).length()
		if speed > 140.0:
			take_damage(50.0, global_position)

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_broken: return
	_break_open()

func _break_open() -> void:
	if is_broken: return
	is_broken = true

	CameraShake.add_trauma(0.2)
	GameManager.add_score(1000) # Thưởng lớn khi cứu gà con
	ComicScorePopup.spawn_score_popup(get_parent(), global_position, 1000)

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_victory()

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	if confetti_fx:
		confetti_fx.restart()
		confetti_fx.emitting = true

	# Bé gà con vui sướng bay vút lên trời
	if chick:
		var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(chick, "position:y", -180.0, 0.8)
		tween.tween_property(chick, "scale", Vector2(1.5, 1.5), 0.4)
		tween.tween_property(chick, "modulate:a", 0.0, 0.8)

	if cage_bars:
		var tween = create_tween()
		tween.tween_property(cage_bars, "modulate:a", 0.0, 0.25)

	await get_tree().create_timer(1.0).timeout
	queue_free()
