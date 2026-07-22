extends CharacterBody3D

const SPEED = 7.0
const JUMP_VELOCITY = 7.0
const SHUFFLE_INTERVAL = 10.0

@onready var visual_mesh = $MeshInstance3D
@onready var camera = $SpringArm3D/Camera3D

var gravity = ProjectSettings.get_setting("physics/3d/default_gravity")
var gravity_direction = Vector3.DOWN

var shuffle_timer = 0.0
var action_map = {
	"move_left": "move_left",
	"move_right": "move_right",
	"move_forward": "move_forward",
	"move_backward": "move_backward",
	"jump": "jump"
}

var is_dead = false
var is_bomb = false
var knockback_velocity = Vector3.ZERO
var is_bot = false
var bot_change_target_timer = 0.0
var bot_target_dir = Vector3.FORWARD
var bot_wants_jump = false
var custom_color: Color = Color(0, 0, 0, 0)

# Squishy Cute Mochi Physics
var mesh_target_scale = Vector3.ONE
var was_on_floor = true

func apply_knockback(force: Vector3):
	knockback_velocity += force

@rpc("any_peer", "call_local")
func apply_knockback_rpc(force: Vector3):
	if is_multiplayer_authority():
		knockback_velocity += force

func apply_bounce(force: float):
	velocity.y = force * (-1.0 if gravity_direction.y > 0 else 1.0)
	mesh_target_scale = Vector3(0.7, 1.4, 0.7)

func _enter_tree():
	if is_bot:
		set_multiplayer_authority(1)
	else:
		set_multiplayer_authority(name.to_int())
	add_to_group("player")

func is_player():
	return true

func _ready():
	randomize()
	
	# Hand-crafted Cute Pastel Palette
	var colors = [
		Color(0.98, 0.55, 0.75), # Pastel Pink
		Color(0.4, 0.85, 0.95),  # Sky Blue
		Color(1.0, 0.88, 0.4),   # Butter Yellow
		Color(0.45, 0.95, 0.65), # Mint Green
		Color(1.0, 0.6, 0.35)    # Sorbet Orange
	]
	var color = custom_color if custom_color != Color(0, 0, 0, 0) else colors[name.to_int() % colors.size()]
	var mat = StandardMaterial3D.new()
	mat.albedo_color = color
	mat.emission_enabled = true
	mat.emission = color
	mat.emission_energy_multiplier = 0.4
	mat.roughness = 0.2
	visual_mesh.material_override = mat
	
	if has_node("TrailParticles"):
		$TrailParticles.emitting = true
		
	if is_multiplayer_authority() and not is_bot:
		camera.current = true

func _physics_process(delta):
	if is_dead:
		return

	if not is_on_floor():
		velocity += gravity_direction * gravity * delta
	else:
		if not was_on_floor:
			# Land Squash Effect (Mochi Bounce)
			mesh_target_scale = Vector3(1.3, 0.7, 1.3)
	
	was_on_floor = is_on_floor()

	# Lerp squishy mesh scale towards target, and target towards Vector3.ONE
	visual_mesh.scale = visual_mesh.scale.lerp(mesh_target_scale, 14.0 * delta)
	mesh_target_scale = mesh_target_scale.lerp(Vector3.ONE, 8.0 * delta)

	if is_multiplayer_authority():
		# Key Shuffle logic
		shuffle_timer += delta
		if shuffle_timer >= SHUFFLE_INTERVAL:
			shuffle_timer = 0.0
			shuffle_keys()

	if is_bot and is_multiplayer_authority():
		_process_bot_ai(delta)

	var input_dir = Vector2.ZERO
	var wants_jump = false

	if is_bot:
		input_dir = Vector2(bot_target_dir.x, bot_target_dir.z)
		wants_jump = bot_wants_jump
	elif is_multiplayer_authority():
		var left = action_map["move_left"]
		var right = action_map["move_right"]
		var fwd = action_map["move_forward"]
		var back = action_map["move_backward"]
		
		input_dir = Input.get_vector(left, right, fwd, back)
		wants_jump = Input.is_action_just_pressed(action_map["jump"])
		
		if GameManager.current_mode == GameManager.GameMode.COPYCAT:
			if Input.is_action_just_pressed("move_left"): GameManager.check_copycat_input("A", name.to_int())
			if Input.is_action_just_pressed("move_right"): GameManager.check_copycat_input("D", name.to_int())
			if Input.is_action_just_pressed("move_forward"): GameManager.check_copycat_input("W", name.to_int())
			if Input.is_action_just_pressed("move_backward"): GameManager.check_copycat_input("S", name.to_int())
			if Input.is_action_just_pressed("jump"): GameManager.check_copycat_input("SPACE", name.to_int())

	# Handle Jump with Stretch Animation
	if wants_jump and is_on_floor():
		velocity.y = JUMP_VELOCITY if gravity_direction.y < 0 else -JUMP_VELOCITY
		mesh_target_scale = Vector3(0.7, 1.4, 0.7) # Jump Stretch!
		
		var particles = preload("res://scenes/jump_particles.tscn").instantiate()
		get_parent().add_child(particles)
		particles.global_position = global_position
		if SoundManager and is_multiplayer_authority() and not is_bot:
			SoundManager.play_jump()

	var direction = (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	
	if direction:
		velocity.x = direction.x * SPEED
		velocity.z = direction.z * SPEED
		
		var target_rotation = atan2(-direction.x, -direction.z)
		visual_mesh.rotation.y = lerp_angle(visual_mesh.rotation.y, target_rotation, 15.0 * delta)
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		velocity.z = move_toward(velocity.z, 0, SPEED)

	if knockback_velocity.length() > 0.1:
		velocity.x += knockback_velocity.x
		velocity.z += knockback_velocity.z
		knockback_velocity = knockback_velocity.move_toward(Vector3.ZERO, SPEED * 2.0 * delta)
	else:
		knockback_velocity = Vector3.ZERO

	move_and_slide()

	if global_position.y < -15.0 or global_position.y > 40.0:
		die()

func _process_bot_ai(delta):
	bot_change_target_timer -= delta
	if bot_change_target_timer <= 0:
		bot_change_target_timer = randf_range(1.0, 2.5)
		
		if GameManager.current_mode == GameManager.GameMode.RACE or GameManager.current_mode == GameManager.GameMode.COPYCAT:
			bot_target_dir = Vector3(randf_range(-0.3, 0.3), 0, -1).normalized()
		elif GameManager.current_mode == GameManager.GameMode.SUMO:
			bot_target_dir = (Vector3.ZERO - global_position).normalized()
			bot_target_dir.y = 0
		else:
			bot_target_dir = Vector3(randf_range(-1, 1), 0, randf_range(-1, 1)).normalized()
			
		bot_wants_jump = randf() > 0.7

func shuffle_keys():
	if SoundManager and is_multiplayer_authority() and not is_bot:
		SoundManager.play_shuffle()
		
	mesh_target_scale = Vector3(1.3, 0.6, 1.3) # Dizzy Wobbly Wiggle
	
	var actions = ["move_left", "move_right", "move_forward", "move_backward", "jump"]
	var keys = actions.duplicate()
	keys.shuffle()
	
	for i in range(actions.size()):
		action_map[actions[i]] = keys[i]
		
	if is_multiplayer_authority() and not is_bot:
		show_shuffle_alert()

func show_shuffle_alert():
	var label = $CanvasLayer/Control/ShuffleLabel
	label.text = tr("SHUFFLE_ALERT")
	label.show()
	var tween = create_tween()
	tween.tween_property(label, "scale", Vector2(1.2, 1.2), 0.1)
	tween.tween_property(label, "scale", Vector2(1.0, 1.0), 0.2)
	tween.tween_interval(0.5)
	tween.tween_callback(label.hide)

func die():
	if is_dead:
		return
	is_dead = true
	
	# Spawn cute explosion particles
	var death_fx = preload("res://scenes/death_particles.tscn").instantiate()
	get_parent().add_child(death_fx)
	death_fx.global_position = global_position
	
	if SoundManager:
		SoundManager.play_explosion()
		
	hide()
	$CollisionShape3D.set_deferred("disabled", true)
	if multiplayer.is_server():
		GameManager.player_died(name.to_int())

func check_it(it_id: int):
	if is_dead: return
	if name.to_int() == it_id:
		is_bomb = true
		visual_mesh.material_override.albedo_color = Color(1, 0.2, 0.3)
		visual_mesh.material_override.emission = Color(1, 0.2, 0.3)
	else:
		is_bomb = false
		var colors = [
			Color(0.98, 0.55, 0.75),
			Color(0.4, 0.85, 0.95),
			Color(1.0, 0.88, 0.4),
			Color(0.45, 0.95, 0.65),
			Color(1.0, 0.6, 0.35)
		]
		var color = custom_color if custom_color != Color(0, 0, 0, 0) else colors[name.to_int() % colors.size()]
		visual_mesh.material_override.albedo_color = color
		visual_mesh.material_override.emission = color
