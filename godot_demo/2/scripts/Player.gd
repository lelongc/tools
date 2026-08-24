extends CharacterBody3D
class_name Player

signal stats_changed(fire_rate, bullet_count, damage, level)
signal player_died

@export var forward_speed: float = 13.0
@export var swerve_speed: float = 18.0
@export var max_x_limit: float = 3.8

var fire_rate: float = 3.5          # Số phát bắn mỗi giây
var bullet_count: int = 1           # Số tia đạn bắn cùng lúc
var bullet_damage: float = 10.0     # Sát thương mỗi viên
var gun_level: int = 1              # Cấp độ tiến hóa súng

var is_active: bool = true
var is_dragging: bool = false
var touch_start_pos: Vector2 = Vector2.ZERO
var target_x: float = 0.0

var fire_timer: float = 0.0
var is_at_boss: bool = false
var boss_target: Boss = null
var boss_timer: float = 6.0

@onready var gun_model_root: Node3D = $GunModelRoot
@onready var barrel_center: Marker3D = $GunModelRoot/BarrelCenter
@onready var barrel_left: Marker3D = $GunModelRoot/BarrelLeft
@onready var barrel_right: Marker3D = $GunModelRoot/BarrelRight
@onready var level_label: Label3D = $LevelLabel

# Resource đạn nạp sẵn
var bullet_scene = preload("res://scenes/Bullet.tscn")

func _ready() -> void:
	target_x = position.x
	update_gun_evolution()

func _input(event: InputEvent) -> void:
	if not is_active:
		return
	
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			is_dragging = event.pressed
			touch_start_pos = event.position
			
	elif event is InputEventMouseMotion and is_dragging:
		var viewport_width = get_viewport().get_visible_rect().size.x
		var delta_x = (event.relative.x / viewport_width) * 12.0
		target_x = clamp(target_x + delta_x, -max_x_limit, max_x_limit)
		
	elif event is InputEventScreenTouch:
		is_dragging = event.pressed
		touch_start_pos = event.position
		
	elif event is InputEventScreenDrag and is_dragging:
		var viewport_width = get_viewport().get_visible_rect().size.x
		var delta_x = (event.relative.x / viewport_width) * 12.0
		target_x = clamp(target_x + delta_x, -max_x_limit, max_x_limit)

func _physics_process(delta: float) -> void:
	if not is_active:
		return
	
	# 1. Di chuyển ngang mượt mà (Swerve Lerp)
	position.x = lerp(position.x, target_x, swerve_speed * delta)
	
	# Hiệu ứng nghiêng súng khi quẹt trái/phải (Banking tilt)
	var move_diff = target_x - position.x
	gun_model_root.rotation.z = lerp_angle(gun_model_root.rotation.z, -move_diff * 0.4, 15.0 * delta)
	
	# 2. Di chuyển tiến về phía trước (nếu chưa đến Boss)
	if not is_at_boss:
		position.z -= forward_speed * delta
	else:
		# Trong trận đánh Boss
		boss_timer -= delta
		if boss_timer <= 0.0 and is_instance_valid(boss_target) and not boss_target.is_dead:
			# Hết thời gian mà chưa hạ được Boss -> Boss đè bẹp (Rage Fail)
			is_active = false
			boss_target.attack_player()
			smash_death()
	
	# 3. Tự động bắn đạn
	fire_timer += delta
	var fire_interval = 1.0 / max(0.5, fire_rate)
	if fire_timer >= fire_interval:
		fire_timer = 0.0
		shoot_bullets()

func shoot_bullets() -> void:
	var spawn_points = []
	match bullet_count:
		1:
			spawn_points = [barrel_center]
		2:
			spawn_points = [barrel_left, barrel_right]
		3:
			spawn_points = [barrel_left, barrel_center, barrel_right]
		_:
			spawn_points = [barrel_left, barrel_center, barrel_right]
	
	for marker in spawn_points:
		if is_instance_valid(marker):
			var b = bullet_scene.instantiate()
			get_parent().add_child(b)
			b.global_position = marker.global_position
			b.damage = bullet_damage
	
	# Hiệu ứng giật súng (Recoil Tween)
	var tw = create_tween()
	tw.tween_property(gun_model_root, "position:z", 0.25, 0.03)
	tw.tween_property(gun_model_root, "position:z", 0.0, 0.06)

func apply_gate_modifier(type: int, val: float) -> void:
	match type:
		0: # FIRE_RATE_ADD
			fire_rate += val
		1: # FIRE_RATE_MULT
			fire_rate *= val
		2: # FIRE_RATE_SUB
			fire_rate = max(1.0, fire_rate - abs(val))
		3: # BULLET_COUNT_ADD
			bullet_count = clamp(bullet_count + int(val), 1, 5)
		4: # BULLET_COUNT_MULT
			bullet_count = clamp(bullet_count * int(val), 1, 5)
		5: # POWER_ADD
			bullet_damage += val
	
	update_gun_evolution()

func take_obstacle_damage(dmg: float) -> void:
	# Bị phạt tụt cấp độ khi đâm phải chướng ngại vật
	fire_rate = max(1.0, fire_rate - 2.0)
	bullet_damage = max(5.0, bullet_damage - 2.0)
	update_gun_evolution()
	
	# Hiệu ứng rung đỏ súng
	var tw = create_tween()
	tw.tween_property(gun_model_root, "scale", Vector3(1.3, 0.8, 1.3), 0.06)
	tw.tween_property(gun_model_root, "scale", Vector3.ONE, 0.1)

func update_gun_evolution() -> void:
	gun_level = int(1 + (fire_rate - 3.0) / 2.0 + (bullet_count - 1) * 3 + (bullet_damage - 10.0) / 5.0)
	gun_level = max(1, gun_level)
	
	if level_label:
		level_label.text = "SÚNG LV.%d\nTỐC ĐỘ: %.1f/s" % [gun_level, fire_rate]
	
	stats_changed.emit(fire_rate, bullet_count, bullet_damage, gun_level)
	
	# Đổi màu sắc theo cấp độ súng
	var mat = StandardMaterial3D.new()
	if gun_level < 5:
		mat.albedo_color = Color(0.2, 0.7, 1.0) # Xanh dương
		mat.metallic = 0.6
	elif gun_level < 15:
		mat.albedo_color = Color(1.0, 0.8, 0.1) # Vàng kim
		mat.metallic = 0.9
		mat.emission_enabled = true
		mat.emission = Color(0.8, 0.5, 0.0)
		mat.emission_energy_multiplier = 1.0
	else:
		mat.albedo_color = Color(1.0, 0.1, 0.3) # Đỏ Cyber / Laser
		mat.metallic = 1.0
		mat.emission_enabled = true
		mat.emission = Color(1.0, 0.0, 0.2)
		mat.emission_energy_multiplier = 2.5
		
	var gun_mesh = $GunModelRoot/PistolBody
	if is_instance_valid(gun_mesh):
		gun_mesh.material_override = mat

func reach_boss_arena(boss: Boss) -> void:
	is_at_boss = true
	boss_target = boss
	# Tăng tốc độ xả đạn cực đại ở trận Boss
	fire_rate = max(12.0, fire_rate * 1.5)
	boss.start_boss_fight()

func smash_death() -> void:
	is_active = false
	var tw = create_tween()
	tw.tween_property(gun_model_root, "scale", Vector3(1.8, 0.05, 1.8), 0.1)
	tw.tween_property(gun_model_root, "position:y", -0.4, 0.1)
	tw.tween_callback(func(): player_died.emit())
