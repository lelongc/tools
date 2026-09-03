extends RigidBody2D

const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

var lifetime: float = 3.2
var peck_damage: float = 50.0
var is_poofed: bool = false

@onready var visual: Node2D = $Visual
@onready var chick_sprite: Sprite2D = get_node_or_null("Visual/ChickSprite")
@onready var poof_fx: CPUParticles2D = get_node_or_null("PoofFX")

func _ready() -> void:
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	if chick_sprite:
		var tc = ParticleHelper._safe_load("res://assets/sprites/projectiles/chick_cute_cartoon.svg")
		if tc: chick_sprite.texture = tc

	if poof_fx:
		ParticleHelper.apply_smoke_fx(poof_fx, 0.25, 0.5)

func _process(delta: float) -> void:
	if is_poofed: return

	lifetime -= delta
	if lifetime <= 0.0:
		_pop_out()
		return

	if visual and linear_velocity.length() > 20.0:
		visual.rotation = sin(Time.get_ticks_msec() * 0.02) * 0.35

func _pop_out() -> void:
	if is_poofed: return
	is_poofed = true
	set_deferred("freeze", true)
	$CollisionShape2D.set_deferred("disabled", true)

	if poof_fx:
		poof_fx.restart()
		poof_fx.emitting = true

	if visual:
		var tween = create_tween()
		tween.tween_property(visual, "scale", Vector2.ZERO, 0.15).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)

	await get_tree().create_timer(0.35).timeout
	queue_free()

func _on_impact(body: Node) -> void:
	if is_poofed: return

	if body.has_method("wake_up"):
		body.wake_up()

	if body.has_method("take_damage"):
		body.take_damage(peck_damage, global_position)
		peck_damage = max(peck_damage - 15.0, 10.0)

	# Nhún nảy Squash & Stretch khi đập vào vật thể
	if visual:
		var tween = create_tween()
		visual.scale = Vector2(1.3, 0.7)
		tween.tween_property(visual, "scale", Vector2.ONE, 0.2).set_trans(Tween.TRANS_BOUNCE)

	# Bật nảy ngẫu nhiên
	apply_central_impulse(Vector2(randf_range(-150.0, 150.0), -200.0))
