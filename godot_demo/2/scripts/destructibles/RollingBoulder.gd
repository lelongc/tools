extends RigidBody2D
class_name RollingBoulder

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var crush_damage: float = 400.0

var is_awake: bool = false

@onready var visual_sprite: Sprite2D = get_node_or_null("VisualSprite")

func _ready() -> void:
	if visual_sprite:
		var tex = _load_svg("res://assets/sprites/obstacles/rolling_boulder_stone.svg")
		if tex: visual_sprite.texture = tex

	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	mass = 25.0
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

func _load_svg(path: String) -> Texture2D:
	var global_path = ProjectSettings.globalize_path(path)
	if FileAccess.file_exists(global_path):
		var img = Image.load_from_file(global_path)
		if img:
			var tex = ImageTexture.create_from_image(img)
			tex.resource_path = path
			return tex
	if ResourceLoader.exists(path):
		return load(path)
	return null

func wake_up() -> void:
	if is_awake: return
	is_awake = true
	set_deferred("freeze", false)

func _on_impact(body: Node) -> void:
	if not is_awake: wake_up()

	if body.has_method("wake_up"):
		body.wake_up()

	var speed = linear_velocity.length()
	if speed > 100.0 and body.has_method("take_damage"):
		body.take_damage(crush_damage * (speed / 200.0), global_position)
		CameraShake.add_trauma(0.2)

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if not is_awake: wake_up()
