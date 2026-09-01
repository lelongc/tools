extends RigidBody2D
class_name BunkerMonster

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export_enum("sly_fox", "fox_guard", "armored_raccoon", "mine_wolf", "spike_hound", "toxic_fox", "imperial_boar", "boss_baron_pig") var monster_type: String = "sly_fox"
@export var max_health: float = 60.0
@export var score_value: int = 800

var current_health: float = 60.0
var is_defeated: bool = false
var is_awake: bool = false
var is_panicking: bool = false
var is_doing_micro_action: bool = false
var has_armor: bool = false
var spawn_settle_timer: float = 0.5
var idle_anim_time: float = 0.0
var micro_action_timer: float = 2.0
var base_scale_val: float = 0.22

# Node References
@onready var col_shape: CollisionShape2D = $CollisionShape2D
@onready var visual_root: Node2D = $VisualRoot

@onready var acc_back: Sprite2D = $VisualRoot/AccBack
@onready var body_sprite: Sprite2D = $VisualRoot/BaseBody
@onready var head_part: Sprite2D = $VisualRoot/HeadPart
@onready var helmet_sprite: Sprite2D = $VisualRoot/Helmet
@onready var face_root: Node2D = $VisualRoot/Face
@onready var eyes_sprite: Sprite2D = $VisualRoot/Face/Eyes
@onready var pupils_sprite: Sprite2D = $VisualRoot/Face/Pupils
@onready var snout_sprite: Sprite2D = $VisualRoot/Face/SnoutMouth
@onready var acc_front: Sprite2D = $VisualRoot/AccFront
@onready var dizzy_stars: Node2D = $VisualRoot/DizzyStars
@onready var poof_fx: CPUParticles2D = $PoofFX

# Textures
var tex_eyes_normal: Texture2D = null
var tex_eyes_panic: Texture2D = null
var tex_eyes_dizzy: Texture2D = null
var tex_snout_normal: Texture2D = null
var tex_snout_scream: Texture2D = null
var tex_helmet_normal: Texture2D = null
var tex_helmet_damaged: Texture2D = null

func _ready() -> void:
	_setup_monster_stats()
	_load_modular_cutouts()

	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)
	if dizzy_stars: dizzy_stars.visible = false

	micro_action_timer = randf_range(1.0, 3.0)
	_play_spawn_bounce()

func _setup_monster_stats() -> void:
	match monster_type:
		"sly_fox":
			max_health = 40.0
			mass = 1.5
			score_value = 500
			base_scale_val = 0.22
		"fox_guard":
			max_health = 80.0
			mass = 2.2
			score_value = 800
			has_armor = true
			base_scale_val = 0.22
		"armored_raccoon":
			max_health = 130.0
			mass = 3.5
			score_value = 1200
			has_armor = true
			base_scale_val = 0.23
		"mine_wolf":
			max_health = 250.0
			mass = 5.0
			score_value = 2000
			has_armor = true
			base_scale_val = 0.25
		"spike_hound":
			max_health = 220.0
			mass = 4.5
			score_value = 1800
			has_armor = true
			base_scale_val = 0.24
		"toxic_fox":
			max_health = 190.0
			mass = 3.2
			score_value = 1600
			base_scale_val = 0.23
		"imperial_boar":
			max_health = 400.0
			mass = 8.0
			score_value = 3500
			has_armor = true
			base_scale_val = 0.27
		"boss_baron_pig":
			max_health = 1500.0
			mass = 22.0
			score_value = 10000
			has_armor = true
			base_scale_val = 0.36
			if col_shape and col_shape.shape is CircleShape2D:
				var big_circle = CircleShape2D.new()
				big_circle.radius = 34.0
				col_shape.shape = big_circle

	current_health = max_health
	if visual_root:
		visual_root.scale = Vector2(base_scale_val, base_scale_val)

func _load_modular_cutouts() -> void:
	acc_back.position = Vector2.ZERO
	acc_back.z_index = -1
	body_sprite.position = Vector2.ZERO
	body_sprite.z_index = 0
	head_part.position = Vector2.ZERO
	head_part.z_index = 1
	face_root.position = Vector2.ZERO
	face_root.z_index = 2
	helmet_sprite.position = Vector2.ZERO
	helmet_sprite.z_index = 3
	acc_front.position = Vector2.ZERO
	acc_front.z_index = 4

	match monster_type:
		"sly_fox":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/1_body_sly_fox.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -95)
			head_part.z_index = -1

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			
			eyes_sprite.position = Vector2(0, -25)
			pupils_sprite.position = Vector2(0, -25)

			tex_snout_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/7_snout_smug_smile.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")
			snout_sprite.position = Vector2(0, 26)

		"fox_guard":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/02_fox_guard/1_body_fox_guard.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -95)
			head_part.z_index = -1

			tex_helmet_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/2_helmet_wooden_pot.svg")
			tex_helmet_damaged = _load_tex("res://assets/enemies/modular/02_fox_guard/3_helmet_wood_cracked.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -75)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/4_eyes_confident.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/02_fox_guard/5_eyes_panic.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			eyes_sprite.position = Vector2(0, -20)
			pupils_sprite.visible = false

			tex_snout_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/6_snout_guard_grinning.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")
			snout_sprite.position = Vector2(0, 28)

			acc_front.texture = _load_tex("res://assets/enemies/modular/02_fox_guard/7_accessories_bandaid.svg")
			acc_front.position = Vector2(-46, 12)

		"armored_raccoon":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/03_armored_raccoon/1_body_raccoon_mask.svg")
			tex_helmet_normal = _load_tex("res://assets/enemies/modular/03_armored_raccoon/2_helmet_miner_yellow.svg")
			tex_helmet_damaged = _load_tex("res://assets/enemies/modular/03_armored_raccoon/3_helmet_miner_cracked.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -75)

			acc_back.texture = _load_tex("res://assets/enemies/modular/03_armored_raccoon/4_tail_striped.svg")
			acc_back.position = Vector2(-75, 30)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			eyes_sprite.position = Vector2(0, -18)
			pupils_sprite.position = Vector2(0, -18)

			tex_snout_normal = _load_tex("res://assets/enemies/modular/03_armored_raccoon/5_snout_sneaky_teeth.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")
			snout_sprite.position = Vector2(0, 28)

		"mine_wolf":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/1_body_mine_wolf.svg")
			acc_back.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/2_armor_spiked_shoulder.svg")
			acc_back.position = Vector2(65, -5)

			acc_front.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/3_armor_jaw_plate.svg")
			acc_front.position = Vector2(0, 52)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/04_mine_wolf/4_eyes_wolf_glowing_yellow.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			eyes_sprite.position = Vector2(0, -25)
			pupils_sprite.visible = false

			tex_snout_normal = _load_tex("res://assets/enemies/modular/04_mine_wolf/5_snout_snarling_fangs.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")
			snout_sprite.position = Vector2(0, 20)

		"spike_hound":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/05_spike_hound/1_body_bulldog.svg")
			acc_front.texture = _load_tex("res://assets/enemies/modular/05_spike_hound/2_collar_spiked_red.svg")
			acc_front.position = Vector2(0, 62)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/05_spike_hound/3_eyes_mismatched.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			eyes_sprite.position = Vector2(0, -25)
			pupils_sprite.visible = false

			tex_snout_normal = _load_tex("res://assets/enemies/modular/05_spike_hound/4_jaw_underbite_drool.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")
			snout_sprite.position = Vector2(0, 30)

		"toxic_fox":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/1_body_toxic_fox.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -95)
			head_part.z_index = -1

			helmet_sprite.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/2_goggles_steampunk_brass.svg")
			helmet_sprite.position = Vector2(0, -20)

			acc_back.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/3_backpack_acid_canister.svg")
			acc_back.position = Vector2(65, -10)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			eyes_sprite.position = Vector2(0, -20)
			pupils_sprite.position = Vector2(0, -20)

			tex_snout_normal = _load_tex("res://assets/enemies/modular/06_toxic_fox/4_mouth_manic_acid_drip.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")
			snout_sprite.position = Vector2(0, 32)

		"imperial_boar":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/1_body_imperial_boar.svg")
			tex_helmet_normal = _load_tex("res://assets/enemies/modular/07_imperial_boar/2_helmet_roman_centurion.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -85)

			head_part.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/3_tusks_golden_pair.svg")
			head_part.position = Vector2(0, 22)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			eyes_sprite.position = Vector2(0, -20)
			pupils_sprite.position = Vector2(0, -20)

			tex_snout_normal = _load_tex("res://assets/enemies/modular/07_imperial_boar/4_snout_royal_boar.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")
			snout_sprite.position = Vector2(0, 25)

			acc_front.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/5_badge_egg_medal.svg")
			acc_front.position = Vector2(0, 68)

		"boss_baron_pig":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/1_body_emperor_pig.svg")
			helmet_sprite.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/2_crown_royal_gold_jewels.svg")
			helmet_sprite.position = Vector2(0, -110)

			acc_back.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/3_cape_red_ermine_fur.svg")
			acc_back.position = Vector2(0, 75)

			acc_front.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/4_monocle_gold_chain.svg")
			acc_front.position = Vector2(35, -22)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/08_baron_pig/5_eyes_smug_arrogant.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/08_baron_pig/6_eyes_ultra_shocked.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/08_baron_pig/8_face_defeated_bruised.svg")
			eyes_sprite.position = Vector2(0, -28)
			pupils_sprite.visible = false

			tex_snout_normal = _load_tex("res://assets/enemies/modular/08_baron_pig/7_snout_baron_mustache.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")
			snout_sprite.position = Vector2(0, 28)

	if eyes_sprite and tex_eyes_normal:
		eyes_sprite.texture = tex_eyes_normal
	if snout_sprite and tex_snout_normal:
		snout_sprite.texture = tex_snout_normal

func _load_tex(path: String) -> Texture2D:
	if ResourceLoader.exists(path):
		return load(path)
	return null

func _play_spawn_bounce() -> void:
	if not visual_root: return
	var target_s = Vector2(base_scale_val, base_scale_val)
	visual_root.scale = target_s * 0.7
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(visual_root, "scale", target_s, 0.3)

func wake_up() -> void:
	if is_awake or is_defeated: return
	is_awake = true
	set_deferred("freeze", false)

func _process(delta: float) -> void:
	if spawn_settle_timer > 0.0:
		spawn_settle_timer -= delta

	if is_defeated: return

	# 1. Nhịp Thở Phập Phồng Tự Nhiên (Idle Breathing)
	idle_anim_time += delta * 3.5
	if not is_panicking and not is_doing_micro_action and visual_root:
		var breath = sin(idle_anim_time) * 0.02
		visual_root.scale = Vector2(base_scale_val * (1.0 + breath), base_scale_val * (1.0 - breath))

	# 2. Ngẫu nhiên thực hiện các biểu cảm sống động Angry Birds (Chớp mắt, cười khẩy, nghiêng đầu, vểnh tai)
	if not is_panicking and not is_doing_micro_action:
		micro_action_timer -= delta
		if micro_action_timer <= 0.0:
			micro_action_timer = randf_range(2.0, 4.5)
			_trigger_random_angrybirds_action()

	# 3. Theo dõi mục tiêu & Phản ứng đe dọa (Threat Tracking)
	_track_threats_and_eggs()

func _trigger_random_angrybirds_action() -> void:
	is_doing_micro_action = true
	var action = randi() % 4

	match action:
		0: # Chớp mắt tự nhiên (Blink)
			if eyes_sprite:
				var blink_tween = create_tween()
				blink_tween.tween_property(eyes_sprite, "scale:y", 0.08, 0.07)
				blink_tween.tween_property(eyes_sprite, "scale:y", 1.0, 0.09)
				await blink_tween.finished
		1: # Cười đểu rung bụng nhún nhảy (Snicker / Chuckle)
			if visual_root:
				var chuckle_tween = create_tween().set_trans(Tween.TRANS_QUAD)
				chuckle_tween.tween_property(visual_root, "scale", Vector2(base_scale_val * 1.12, base_scale_val * 0.88), 0.08)
				chuckle_tween.tween_property(visual_root, "scale", Vector2(base_scale_val * 0.92, base_scale_val * 1.08), 0.08)
				chuckle_tween.tween_property(visual_root, "scale", Vector2(base_scale_val, base_scale_val), 0.1)
				if head_part:
					var ear_tween = create_tween()
					ear_tween.tween_property(head_part, "rotation_degrees", 8.0, 0.08)
					ear_tween.tween_property(head_part, "rotation_degrees", -8.0, 0.08)
					ear_tween.tween_property(head_part, "rotation_degrees", 0.0, 0.08)
				await chuckle_tween.finished
		2: # Nghiêng đầu tò mò nhìn ngó (Head Tilt)
			if visual_root:
				var tilt_tween = create_tween().set_trans(Tween.TRANS_SINE)
				var tilt_ang = 10.0 if randf() > 0.5 else -10.0
				tilt_tween.tween_property(visual_root, "rotation_degrees", tilt_ang, 0.25)
				tilt_tween.tween_interval(0.4)
				tilt_tween.tween_property(visual_root, "rotation_degrees", 0.0, 0.2)
				await tilt_tween.finished
		3: # Liếc mắt sang hai bên thăm dò (Look Left / Right)
			if pupils_sprite and pupils_sprite.visible:
				var look_tween = create_tween().set_trans(Tween.TRANS_SINE)
				look_tween.tween_property(pupils_sprite, "position:x", pupils_sprite.position.x - 5.0, 0.2)
				look_tween.tween_interval(0.3)
				look_tween.tween_property(pupils_sprite, "position:x", pupils_sprite.position.x + 5.0, 0.3)
				look_tween.tween_interval(0.3)
				look_tween.tween_property(pupils_sprite, "position:x", 0.0, 0.2)
				await look_tween.finished

	is_doing_micro_action = false

func _track_threats_and_eggs() -> void:
	var eggs = get_tree().get_nodes_in_group("Eggs")
	var chicken = get_tree().get_first_node_in_group("Player")
	var target_pos = Vector2.ZERO
	var has_threat = false

	# 1. Ưu tiên theo dõi quả trứng đang rơi
	if eggs.size() > 0:
		var closest_dist = 9999.0
		for egg in eggs:
			if is_instance_valid(egg) and egg.global_position.y < global_position.y:
				var dist = (egg.global_position - global_position).length()
				if dist < closest_dist:
					closest_dist = dist
					target_pos = egg.global_position
					if dist < 290.0 and egg.linear_velocity.y > 50.0:
						has_threat = true

	# 2. Nếu không có trứng rơi, ngước nhìn theo con gà đang bay tuần tra trên trời!
	if target_pos == Vector2.ZERO and is_instance_valid(chicken):
		target_pos = chicken.global_position

	# 3. Quét tảng đá/khối gỗ rơi từ trần xuống
	var space_state = get_world_2d().direct_space_state
	var query = PhysicsRayQueryParameters2D.create(global_position, global_position + Vector2(0, -280.0))
	query.collide_with_bodies = true
	var res = space_state.intersect_ray(query)
	if res and res.collider is RigidBody2D and res.collider.linear_velocity.y > 80.0:
		has_threat = true
		target_pos = res.collider.global_position

	# 4. Cập nhật góc nhìn của mắt (Eye-Tracking)
	if pupils_sprite and pupils_sprite.visible and target_pos != Vector2.ZERO:
		var dir = (target_pos - global_position).normalized()
		pupils_sprite.position = Vector2(0, -25) + dir * 6.0

	_set_panic_state(has_threat)

func _set_panic_state(panic: bool) -> void:
	if is_panicking == panic: return
	is_panicking = panic

	if panic:
		if eyes_sprite and tex_eyes_panic:
			eyes_sprite.texture = tex_eyes_panic
		if snout_sprite and tex_snout_scream:
			snout_sprite.texture = tex_snout_scream
		if visual_root:
			var shake_tween = create_tween().set_loops(4)
			shake_tween.tween_property(visual_root, "position:x", 3.5, 0.035)
			shake_tween.tween_property(visual_root, "position:x", -3.5, 0.035)
			shake_tween.finished.connect(func(): if is_instance_valid(visual_root): visual_root.position.x = 0.0)
	else:
		if eyes_sprite and tex_eyes_normal:
			eyes_sprite.texture = tex_eyes_normal
		if snout_sprite and tex_snout_normal:
			snout_sprite.texture = tex_snout_normal
		if visual_root:
			visual_root.position.x = 0.0

func _on_impact(body: Node) -> void:
	if is_defeated or spawn_settle_timer > 0.0: return
	if not is_awake: wake_up()

	if body is RigidBody2D:
		var rel_vel = (linear_velocity - body.linear_velocity).length()
		if rel_vel > 120.0:
			var crush_dmg = (rel_vel - 120.0) * (body.mass * 0.6) + 30.0
			take_damage(crush_dmg, body.global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_defeated: return
	if not is_awake: wake_up()

	if has_armor:
		amount *= 0.5
		if current_health <= max_health * 0.6:
			has_armor = false
			if tex_helmet_damaged and helmet_sprite:
				helmet_sprite.texture = tex_helmet_damaged
			elif helmet_sprite:
				_pop_off_helmet()

	current_health -= amount

	if visual_root:
		var tween = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
		visual_root.scale = Vector2(base_scale_val * 1.35, base_scale_val * 0.65)
		tween.tween_property(visual_root, "scale", Vector2(base_scale_val, base_scale_val), 0.3)

	var flash_tween = create_tween()
	flash_tween.tween_property(visual_root, "modulate", Color(1.0, 0.3, 0.3), 0.05)
	flash_tween.tween_property(visual_root, "modulate", Color.WHITE, 0.08)

	CameraShake.add_trauma(0.4 if monster_type == "boss_baron_pig" else 0.15)

	if current_health <= 0.0:
		_defeat_monster()

func _pop_off_helmet() -> void:
	if not helmet_sprite: return
	var h = helmet_sprite
	helmet_sprite = null
	var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(h, "position:y", h.position.y - 45.0, 0.3)
	tween.tween_property(h, "rotation", 1.8, 0.3)
	tween.tween_property(h, "modulate:a", 0.0, 0.35)
	await tween.finished
	h.queue_free()

func _defeat_monster() -> void:
	if is_defeated: return
	is_defeated = true

	GameManager.register_enemy_defeat(self, score_value)
	CameraShake.add_trauma(0.6 if monster_type == "boss_baron_pig" else 0.25)

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	if eyes_sprite and tex_eyes_dizzy:
		eyes_sprite.texture = tex_eyes_dizzy
	if pupils_sprite:
		pupils_sprite.visible = false

	if dizzy_stars:
		dizzy_stars.visible = true
		var star_tween = create_tween().set_loops(2)
		star_tween.tween_property(dizzy_stars, "rotation", TAU, 0.35)

	if visual_root:
		var flat_tween = create_tween().set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
		flat_tween.tween_property(visual_root, "scale", Vector2(base_scale_val * 1.6, base_scale_val * 0.18), 0.15)

	await get_tree().create_timer(0.45).timeout

	if poof_fx:
		poof_fx.restart()
		poof_fx.emitting = true

	if visual_root: visual_root.visible = false
	await get_tree().create_timer(0.4).timeout
	queue_free()
