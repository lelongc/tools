extends CharacterBody3D

const SPEED = 6.0
const JUMP_VELOCITY = 6.5

# Gravity
var gravity = ProjectSettings.get_setting("physics/3d/default_gravity")
var gravity_direction = Vector3.DOWN

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

var knockback_velocity = Vector3.ZERO
var is_bot = false
var bot_change_target_timer = 0.0
var bot_target_dir = Vector3.FORWARD
var bot_wants_jump = false
var custom_color: Color = Color(0, 0, 0, 0)

func apply_knockback(force: Vector3):
	knockback_velocity += force

@rpc("any_peer", "call_local")
func apply_knockback_rpc(force: Vector3):
	if is_multiplayer_authority():
		knockback_velocity += force

func apply_bounce(force: float):
	velocity.y = force * (-1.0 if gravity_direction.y > 0 else 1.0)

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
	
	var colors = [Color(0,1,1), Color(1,0,1), Color(1,1,0), Color(0,1,0), Color(1,0.5,0)]
	var color = custom_color if custom_color != Color(0, 0, 0, 0) else colors[name.to_int() % colors.size()]
	var mat = StandardMaterial3D.new()
	mat.albedo_color = color
	mat.emission_enabled = true
	mat.emission = color
	mat.emission_energy_multiplier = 0.8
	visual_mesh.material_override = mat
	
	if has_node("TrailParticles"):
		var trail_mat = $TrailParticles.draw_pass_1.material.duplicate()
		trail_mat.albedo_color = color
		trail_mat.albedo_color.a = 0.5
		$TrailParticles.draw_pass_1.material = trail_mat
	
	if shuffle_label:
		shuffle_label.visible = false
		
	var sync = MultiplayerSynchronizer.new()
	var config = SceneReplicationConfig.new()
	config.add_property(NodePath(".:position"))
	config.add_property(NodePath("MeshInstance3D:rotation"))
	config.property_set_replication_mode(NodePath(".:position"), SceneReplicationConfig.REPLICATION_MODE_ALWAYS)
	config.property_set_replication_mode(NodePath("MeshInstance3D:rotation"), SceneReplicationConfig.REPLICATION_MODE_ALWAYS)
	sync.replication_config = config
	add_child(sync)
	
	if not is_multiplayer_authority() or is_bot:
		$SpringArm3D/Camera3D.current = false
	else:
		$SpringArm3D/Camera3D.current = true

var is_dead = false

@rpc("any_peer", "call_local")
func die():
	if is_dead: return
	is_dead = true
	hide()
	$CollisionShape3D.set_deferred("disabled", true)
	
	# Death explosion particle effect
	var dp = preload("res://death_particles.tscn").instantiate()
	get_parent().add_child(dp)
	dp.global_position = global_position
	if SoundManager:
		SoundManager.play_explosion()

func _physics_process(delta):
	if is_dead:
		return
	if not is_multiplayer_authority():
		return

	# Handle Shuffle Timer
	shuffle_timer += delta
	if shuffle_timer >= SHUFFLE_INTERVAL:
		shuffle_timer = 0.0
		shuffle_controls()

	# Add gravity
	if not is_on_floor():
		velocity += gravity_direction * gravity * delta

	var input_dir = Vector2.ZERO
	var wants_jump = false

	if is_bot:
		# AI Bot Decision Logic
		bot_change_target_timer += delta
		if bot_change_target_timer >= 0.8:
			bot_change_target_timer = 0.0
			bot_target_dir = Vector3(randf_range(-1, 1), 0, randf_range(-1, 1)).normalized()
			bot_wants_jump = (randf() > 0.5)
			
		# AI Bot moves towards goal in RACE mode or target in others
		if GameManager.current_mode == GameManager.GameMode.RACE or GameManager.current_mode == GameManager.GameMode.COPYCAT:
			bot_target_dir = Vector3(0, 0, -1) # Move towards finish line
			
		input_dir = Vector2(bot_target_dir.x, bot_target_dir.z)
		wants_jump = bot_wants_jump and is_on_floor()
	else:
		# Player Input Reading (with remapped actions)
		var left = action_map["move_left"]
		var right = action_map["move_right"]
		var fwd = action_map["move_forward"]
		var back = action_map["move_backward"]
		
		input_dir = Input.get_vector(left, right, fwd, back)
		wants_jump = Input.is_action_just_pressed(action_map["jump"])
		
		# COPYCAT input tracking
		if GameManager.current_mode == GameManager.GameMode.COPYCAT:
			if Input.is_action_just_pressed("move_left"): GameManager.check_copycat_input("A", name.to_int())
			if Input.is_action_just_pressed("move_right"): GameManager.check_copycat_input("D", name.to_int())
			if Input.is_action_just_pressed("move_forward"): GameManager.check_copycat_input("W", name.to_int())
			if Input.is_action_just_pressed("move_backward"): GameManager.check_copycat_input("S", name.to_int())
			if Input.is_action_just_pressed("jump"): GameManager.check_copycat_input("SPACE", name.to_int())

	# Handle Jump
	if wants_jump and is_on_floor():
		velocity.y = JUMP_VELOCITY if gravity_direction.y < 0 else -JUMP_VELOCITY
		# Spawn jump particles
		var particles = preload("res://jump_particles.tscn").instantiate()
		get_parent().add_child(particles)
		particles.global_position = global_position
		if SoundManager and is_multiplayer_authority() and not is_bot:
			SoundManager.play_jump()

	# Movement calculation
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
		knockback_velocity = knockback_velocity.lerp(Vector3.ZERO, 5.0 * delta)

	move_and_slide()
	
	# Pushing other players & Tag Pass
	for i in get_slide_collision_count():
		var col = get_slide_collision(i)
		var collider = col.get_collider()
		if collider and collider.is_in_group("player"):
			var push_dir = (collider.global_position - global_position)
			push_dir.y = 0
			push_dir = push_dir.normalized()
			var push_force = velocity.length() * 0.5
			
			var target_auth = collider.get_multiplayer_authority()
			if target_auth == multiplayer.get_unique_id() or collider.is_bot:
				collider.apply_knockback(push_dir * push_force)
			elif collider.has_method("apply_knockback_rpc") and multiplayer.get_peers().has(target_auth):
				collider.rpc_id(target_auth, "apply_knockback_rpc", push_dir * push_force)
			
			if is_bomb and is_multiplayer_authority():
				if multiplayer.is_server():
					GameManager.request_pass_bomb(collider.name.to_int())
				else:
					GameManager.rpc_id(1, "request_pass_bomb", collider.name.to_int())

	# Fall death check
	if position.y < -15 or position.y > 35:
		if GameManager.current_mode == GameManager.GameMode.RACE or GameManager.current_mode == GameManager.GameMode.COPYCAT:
			position = Vector3(randf_range(-2, 2), 5, randf_range(-2, 2))
			velocity = Vector3.ZERO
			knockback_velocity = Vector3.ZERO
			shuffle_timer = 0.0
		else:
			if not is_dead:
				if multiplayer.is_server():
					GameManager.report_death(name.to_int())
				else:
					GameManager.rpc_id(1, "report_death", name.to_int())
				rpc("die")

func shuffle_controls():
	var keys = action_map.keys()
	var values = action_map.values()
	values.shuffle()
	
	for i in range(keys.size()):
		action_map[keys[i]] = values[i]
		
	print("Controls Shuffled for Player ", name)
	if SoundManager and is_multiplayer_authority() and not is_bot:
		SoundManager.play_shuffle()
	
	# Visual feedback
	if visual_mesh:
		var tween = create_tween()
		visual_mesh.scale = Vector3(1.5, 0.5, 1.5)
		tween.tween_property(visual_mesh, "scale", Vector3.ONE, 0.3).set_trans(Tween.TRANS_BOUNCE)
		
	# Screen Shake
	if $SpringArm3D/Camera3D.current:
		var shake_tween = create_tween()
		shake_tween.tween_method(func(v): $SpringArm3D/Camera3D.h_offset = randf_range(-v, v); $SpringArm3D/Camera3D.v_offset = randf_range(-v, v), 0.5, 0.0, 0.5)
		
	if shuffle_label and is_multiplayer_authority() and not is_bot:
		shuffle_label.text = "XÁO PHÍM!"
		shuffle_label.visible = true
		shuffle_label.modulate.a = 1.0
		var tween_label = create_tween()
		tween_label.tween_property(shuffle_label, "modulate:a", 0.0, 1.5)
		tween_label.tween_callback(func(): shuffle_label.visible = false)

var is_bomb = false
func check_it(id):
	if name.to_int() == id:
		is_bomb = true
		visual_mesh.material_override.albedo_color = Color(1, 0, 0)
		visual_mesh.material_override.emission = Color(1, 0, 0)
	else:
		is_bomb = false
		var colors = [Color(0,1,1), Color(1,0,1), Color(1,1,0), Color(0,1,0), Color(1,0.5,0)]
		var color = custom_color if custom_color != Color(0, 0, 0, 0) else colors[name.to_int() % colors.size()]
		visual_mesh.material_override.albedo_color = color
		visual_mesh.material_override.emission = color
