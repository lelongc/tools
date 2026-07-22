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
@export var character_variant: int = 0 # 0: Pinky Bear, 1: Froggo, 2: Bunny, 3: Neko Cat

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
	var color = custom_color if custom_color != Color(0, 0, 0, 0) else colors[character_variant % colors.size()]
	
	# Attempt loading exported 3D GLB model from Blender or build procedural 3D cute character
	var model_paths = [
		"res://assets/pinky_bear.glb",
		"res://assets/froggo.glb",
		"res://assets/bunny.glb",
		"res://assets/neko_cat.glb"
	]
	var selected_path = model_paths[character_variant % model_paths.size()]
	var glb_loaded = false
	
	if ResourceLoader.exists(selected_path):
		var glb_res = load(selected_path)
		if glb_res:
			var glb_scene = glb_res.instantiate()
			if glb_scene:
				visual_mesh.mesh = null
				visual_mesh.material_override = null
				glb_scene.scale = Vector3(1.3, 1.3, 1.3)
				glb_scene.position = Vector3(0, -0.8, 0)
				visual_mesh.add_child(glb_scene)
				glb_loaded = true
				
	if not glb_loaded:
		build_cute_3d_character(color, character_variant)
	
	if has_node("TrailParticles"):
		$TrailParticles.emitting = true
		
	if is_multiplayer_authority() and not is_bot:
		camera.current = true

func build_cute_3d_character(color: Color, variant: int):
	visual_mesh.material_override = null
	
	# Create Cute Round Blob Body Sphere
	var body_mesh = SphereMesh.new()
	body_mesh.radius = 0.75
	body_mesh.height = 1.4
	visual_mesh.mesh = body_mesh
	
	var mat_body = StandardMaterial3D.new()
	mat_body.albedo_color = color
	mat_body.roughness = 0.25
	visual_mesh.material_override = mat_body
	
	# Eye & Blush Materials
	var mat_eye = StandardMaterial3D.new()
	mat_eye.albedo_color = Color(0.02, 0.02, 0.05)
	mat_eye.roughness = 0.1
	
	var mat_blush = StandardMaterial3D.new()
	mat_blush.albedo_color = Color(1.0, 0.4, 0.65)
	mat_blush.roughness = 0.4
	
	# Add Cute Glossy Eyes & Rosy Blush
	for x in [0.28, -0.28]:
		var eye = MeshInstance3D.new()
		var eye_m = SphereMesh.new()
		eye_m.radius = 0.09
		eye_m.height = 0.18
		eye.mesh = eye_m
		eye.material_override = mat_eye
		eye.position = Vector3(x, 0.15, -0.68)
		visual_mesh.add_child(eye)
		
		var blush = MeshInstance3D.new()
		var blush_m = SphereMesh.new()
		blush_m.radius = 0.11
		blush_m.height = 0.08
		blush.mesh = blush_m
		blush.material_override = mat_blush
		blush.position = Vector3(x * 1.5, -0.05, -0.65)
		visual_mesh.add_child(blush)

	# Variant 0: Bear, Variant 1: Frog, Variant 2: Bunny, Variant 3: Cat
	match variant % 4:
		0: # Pinky Bear
			for x in [0.45, -0.45]:
				var ear = MeshInstance3D.new()
				var ear_m = SphereMesh.new()
				ear_m.radius = 0.28
				ear_m.height = 0.56
				ear.mesh = ear_m
				ear.material_override = mat_body
				ear.position = Vector3(x, 0.65, 0)
				visual_mesh.add_child(ear)
		1: # Froggo
			for x in [0.35, -0.35]:
				var f_eye = MeshInstance3D.new()
				var f_m = SphereMesh.new()
				f_m.radius = 0.25
				f_m.height = 0.5
				f_eye.mesh = f_m
				f_eye.material_override = mat_body
				f_eye.position = Vector3(x, 0.68, -0.2)
				visual_mesh.add_child(f_eye)
				
				var pupil = MeshInstance3D.new()
				var p_m = SphereMesh.new()
				p_m.radius = 0.1
				p_m.height = 0.2
				pupil.mesh = p_m
				pupil.material_override = mat_eye
				pupil.position = Vector3(x, 0.72, -0.38)
				visual_mesh.add_child(pupil)
		2: # Bunny
			for x in [0.3, -0.3]:
				var ear = MeshInstance3D.new()
				var ear_m = CapsuleMesh.new()
				ear_m.radius = 0.14
				ear_m.height = 0.8
				ear.mesh = ear_m
				ear.material_override = mat_body
				ear.position = Vector3(x, 0.95, 0)
				visual_mesh.add_child(ear)
		3: # Neko Cat
			for x in [0.45, -0.45]:
				var ear = MeshInstance3D.new()
				var ear_m = PrismMesh.new()
				ear_m.size = Vector3(0.4, 0.45, 0.3)
				ear.mesh = ear_m
				ear.material_override = mat_body
				ear.position = Vector3(x, 0.75, 0)
				ear.rotation_degrees = Vector3(0, 0, -15 if x > 0 else 15)
				visual_mesh.add_child(ear)

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
		var input_dir = Vector3.ZERO
		if is_bot:
			bot_change_target_timer -= delta
			if bot_change_target_timer <= 0:
				bot_change_target_timer = randf_range(1.0, 3.0)
				bot_target_dir = Vector3(randf_range(-1, 1), 0, randf_range(-1, 1)).normalized()
				bot_wants_jump = randf() < 0.3
			
			input_dir = bot_target_dir
			if bot_wants_jump and is_on_floor():
				velocity.y = JUMP_VELOCITY * (-1.0 if gravity_direction.y > 0 else 1.0)
				mesh_target_scale = Vector3(0.6, 1.5, 0.6)
				bot_wants_jump = false
		else:
			# Shuffle logic
			shuffle_timer += delta
			if shuffle_timer >= SHUFFLE_INTERVAL:
				shuffle_timer = 0.0
				shuffle_keys()
			
			var move_left = Input.is_action_pressed(action_map["move_left"])
			var move_right = Input.is_action_pressed(action_map["move_right"])
			var move_forward = Input.is_action_pressed(action_map["move_forward"])
			var move_backward = Input.is_action_pressed(action_map["move_backward"])
			
			if move_left: input_dir.x -= 1
			if move_right: input_dir.x += 1
			if move_forward: input_dir.z -= 1
			if move_backward: input_dir.z += 1
			
			if Input.is_action_just_pressed(action_map["jump"]) and is_on_floor():
				velocity.y = JUMP_VELOCITY * (-1.0 if gravity_direction.y > 0 else 1.0)
				mesh_target_scale = Vector3(0.6, 1.5, 0.6)
				if SoundManager: SoundManager.play_jump()

		input_dir = input_dir.normalized()
		var move_speed = SPEED * 1.3 if is_bomb else SPEED
		velocity.x = input_dir.x * move_speed + knockback_velocity.x
		velocity.z = input_dir.z * move_speed + knockback_velocity.z
		knockback_velocity = knockback_velocity.lerp(Vector3.ZERO, 10.0 * delta)

		move_and_slide()

func shuffle_keys():
	var actions = ["move_left", "move_right", "move_forward", "move_backward", "jump"]
	var shuffled = actions.duplicate()
	shuffled.shuffle()
	for i in range(actions.size()):
		action_map[actions[i]] = shuffled[i]
	show_shuffle_alert()
	if SoundManager: SoundManager.play_shuffle()

func show_shuffle_alert():
	var label = Label3D.new()
	label.text = "KEYS SHUFFLED!"
	label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	label.modulate = Color(1, 0.2, 0.2)
	label.position = Vector3(0, 2.2, 0)
	add_child(label)
	
	var tween = create_tween()
	tween.tween_property(label, "position", Vector3(0, 3.2, 0), 1.0)
	tween.parallel().tween_property(label, "modulate", Color(1, 0.2, 0.2, 0.0), 1.0)
	tween.tween_callback(label.queue_free)

func die():
	is_dead = true
	hide()
	if SoundManager: SoundManager.play_death()
