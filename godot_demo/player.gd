extends CharacterBody3D

const SPEED = 6.0
const JUMP_VELOCITY = 6.0

# Gravity
var gravity = ProjectSettings.get_setting("physics/3d/default_gravity")

# Control Shuffle Mechanic
var action_map = {
	"move_left": "move_left",
	"move_right": "move_right",
	"move_forward": "move_forward",
	"move_backward": "move_backward",
	"jump": "jump"
}

const SHUFFLE_INTERVAL = 10.0
var shuffle_timer = 0.0

@onready var visual_mesh = $MeshInstance3D
@onready var shuffle_label = $CanvasLayer/Control/ShuffleLabel

func _ready():
	randomize()
	if shuffle_label:
		shuffle_label.visible = false

func _physics_process(delta):
	# Handle Shuffle Timer
	shuffle_timer += delta
	if shuffle_timer >= SHUFFLE_INTERVAL:
		shuffle_timer = 0.0
		shuffle_controls()

	# Add gravity
	if not is_on_floor():
		velocity.y -= gravity * delta

	# Get remapped actions
	var left = action_map["move_left"]
	var right = action_map["move_right"]
	var fwd = action_map["move_forward"]
	var back = action_map["move_backward"]
	var jmp = action_map["jump"]

	# Handle jump
	if Input.is_action_just_pressed(jmp) and is_on_floor():
		velocity.y = JUMP_VELOCITY

	# Get input direction
	var input_dir = Input.get_vector(left, right, fwd, back)
	var direction = (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	
	if direction:
		velocity.x = direction.x * SPEED
		velocity.z = direction.z * SPEED
		
		# Rotate mesh towards movement direction (smoothly)
		var target_rotation = atan2(-direction.x, -direction.z)
		visual_mesh.rotation.y = lerp_angle(visual_mesh.rotation.y, target_rotation, 15.0 * delta)
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		velocity.z = move_toward(velocity.z, 0, SPEED)

	move_and_slide()

func shuffle_controls():
	var keys = action_map.keys()
	var values = action_map.values()
	values.shuffle()
	
	for i in range(keys.size()):
		action_map[keys[i]] = values[i]
		
	print("Controls Shuffled!")
	
	# Visual feedback
	if visual_mesh:
		var tween = create_tween()
		visual_mesh.scale = Vector3(1.5, 0.5, 1.5)
		tween.tween_property(visual_mesh, "scale", Vector3.ONE, 0.3).set_trans(Tween.TRANS_BOUNCE)
		
	if shuffle_label:
		shuffle_label.visible = true
		shuffle_label.modulate.a = 1.0
		var tween_label = create_tween()
		tween_label.tween_property(shuffle_label, "modulate:a", 0.0, 1.5)
		tween_label.tween_callback(func(): shuffle_label.visible = false)
