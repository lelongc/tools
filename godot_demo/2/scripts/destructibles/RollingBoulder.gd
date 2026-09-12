extends RigidBody2D
class_name RollingBoulder

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var crush_damage: float = 400.0

var is_awake: bool = false


@onready var visual_sprite: Sprite2D = get_node_or_null("VisualSprite")
@onready var dust_fx: CPUParticles2D = get_node_or_null("DustFX")

func _ready() -> void:
	var current_lvl = GameManager.current_level if has_node("/root/GameManager") else 1
	var world_id = clamp(int(float(current_lvl - 1) / 20.0) + 1, 1, 5)

	if visual_sprite:
		var tex_path = "res://assets/sprites/obstacles/rolling_boulder_stone.svg"
		match world_id:
			4:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_magma.svg"
			5:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_crystal.svg"
			_:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_stone.svg"

		var tex = _load_svg(tex_path)
		if tex: visual_sprite.texture = tex

	if dust_fx:
		ParticleHelper.apply_smoke_fx(dust_fx, 0.25, 0.5)
		if world_id == 4:
			dust_fx.color = Color(1.0, 0.55, 0.2, 0.7)
		elif world_id == 5:
			dust_fx.color = Color(0.75, 0.45, 1.0, 0.7)

	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	mass = 8.0
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	var pmat = PhysicsMaterial.new()
	pmat.friction = 0.95
	pmat.bounce = 0.05
	physics_material_override = pmat
	angular_damp = 4.0
	linear_damp = 1.2

func _physics_process(_delta: float) -> void:
	if dust_fx:
		dust_fx.emitting = (is_awake and linear_velocity.length() > 65.0)

func _load_svg(path: String) -> Texture2D:
	return ParticleHelper._safe_load(path)

func wake_up() -> void:
	if is_awake: return
	is_awake = true
	set_deferred("freeze", false)

func _on_impact(body: Node) -> void:
	if not is_awake:
		wake_up()

	if body.has_method("wake_up"):
		body.wake_up()

	var speed = linear_velocity.length()
	if speed > 100.0 and body.has_method("take_damage"):
		body.take_damage(crush_damage * (speed / 200.0), global_position)
		CameraShake.add_trauma(0.2)

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if not is_awake: wake_up()
