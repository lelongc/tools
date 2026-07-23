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
	
	load_blender_character_model()
	
	if has_node("TrailParticles"):
		$TrailParticles.emitting = true
		
	if is_multiplayer_authority() and not is_bot:
		camera.current = true

func load_blender_character_model():
	# 1. ALWAYS remove default capsule pill mesh & override material
	visual_mesh.mesh = null
	visual_mesh.material_override = null
	
	for child in visual_mesh.get_children():
		child.queue_free()
		
	var model_names = ["pinky_bear", "froggo", "bunny", "neko_cat"]
	var model_name = model_names[character_variant % model_names.size()]
	var glb_res_path = "res://assets/" + model_name + ".glb"
	var glb_abs_path = ProjectSettings.globalize_path(glb_res_path)
	
	var model_inst: Node3D = null
	
	# Option A: Runtime direct loading via GLTFDocument (Guaranteed 100% no import needed)
	var doc = GLTFDocument.new()
	var state = GLTFState.new()
	var err = doc.append_from_file(glb_abs_path, state)
	if err == OK:
		model_inst = doc.generate_scene(state)
		
	# Option B: Fallback to ResourceLoader PackedScene if GLTFDocument is unavailable
	if not model_inst and ResourceLoader.exists(glb_res_path):
		var scn = load(glb_res_path)
		if scn and scn is PackedScene:
			model_inst = scn.instantiate()
			
	if model_inst:
		model_inst.scale = Vector3(0.7, 0.7, 0.7)
		model_inst.position = Vector3(0, -0.7, 0)
		visual_mesh.add_child(model_inst)

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
		if input_dir.length() > 0.1:
			var target_angle = atan2(input_dir.x, input_dir.z)
			visual_mesh.rotation.y = lerp_angle(visual_mesh.rotation.y, target_angle, 15.0 * delta)
			
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
