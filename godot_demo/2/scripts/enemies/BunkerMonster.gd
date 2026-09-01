extends RigidBody2D
class_name BunkerMonster

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

enum State {
	IDLE,
	ALERT_AIMING,
	PANIC_FALLING,
	HURT_DIZZY,
	VICTORY_TAUNT,
	DEFEATED
}

@export_enum("sly_fox", "fox_guard", "armored_raccoon", "mine_wolf", "spike_hound", "toxic_fox", "imperial_boar", "boss_baron_pig") var monster_type: String = "sly_fox"
@export var max_health: float = 50.0
@export var score_value: int = 600

var current_health: float = 50.0
var is_defeated: bool = false
var is_awake: bool = false
var has_armor: bool = false
var base_scale_val: float = 0.22

# State management
var current_state: State = State.IDLE
var anim_time: float = 0.0
var spawn_settle_timer: float = 0.5
var eye_look_offset: Vector2 = Vector2.ZERO
var eye_idle_timer: float = 1.5
var is_blinking: bool = false
var blink_timer: float = 3.0

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
@onready var emote_pivot: Node2D = $EmotePivot
@onready var emote_sprite: Sprite2D = $EmotePivot/EmoteSprite
@onready var poof_fx: CPUParticles2D = $PoofFX

# Modular Textures
var tex_eyes_normal: Texture2D = null
var tex_eyes_panic: Texture2D = null
var tex_eyes_dizzy: Texture2D = null
var tex_snout_normal: Texture2D = null
var tex_snout_scream: Texture2D = null
var tex_helmet_normal: Texture2D = null
var tex_helmet_damaged: Texture2D = null

# Base eye position
var base_eye_pos: Vector2 = Vector2(0, -22)

func _ready() -> void:
	add_to_group("Enemies")
	_setup_monster_attributes()
	_load_monster_cutouts()

	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	if dizzy_stars: dizzy_stars.visible = false
	if emote_sprite: emote_sprite.visible = false

	GameManager.level_failed.connect(_on_player_failed_taunt)

	blink_timer = randf_range(2.0, 4.5)
	eye_idle_timer = randf_range(1.0, 2.5)

	_play_spawn_bounce()

func _setup_monster_attributes() -> void:
	match monster_type:
		"sly_fox":
			max_health = 40.0
			mass = 1.4
			score_value = 500
			base_scale_val = 0.22
		"fox_guard":
			max_health = 80.0
			mass = 2.0
			score_value = 800
			has_armor = true
			base_scale_val = 0.22
		"armored_raccoon":
			max_health = 120.0
			mass = 3.0
			score_value = 1100
			has_armor = true
			base_scale_val = 0.23
		"mine_wolf":
			max_health = 220.0
			mass = 4.5
			score_value = 1800
			has_armor = true
			base_scale_val = 0.25
		"spike_hound":
			max_health = 200.0
			mass = 4.0
			score_value = 1600
			has_armor = true
			base_scale_val = 0.24
		"toxic_fox":
			max_health = 160.0
			mass = 2.8
			score_value = 1400
			base_scale_val = 0.23
		"imperial_boar":
			max_health = 350.0
			mass = 7.0
			score_value = 3000
			has_armor = true
			base_scale_val = 0.27
		"boss_baron_pig":
			max_health = 1200.0
			mass = 18.0
			score_value = 8000
			has_armor = true
			base_scale_val = 0.35
			if col_shape and col_shape.shape is CircleShape2D:
				var big_circle = CircleShape2D.new()
				big_circle.radius = 32.0
				col_shape.shape = big_circle

	current_health = max_health
	if visual_root:
		visual_root.scale = Vector2(base_scale_val, base_scale_val)

func _load_monster_cutouts() -> void:
	# Reset slots
	acc_back.texture = null
	acc_back.position = Vector2.ZERO
	acc_back.z_index = -1

	body_sprite.texture = null
	body_sprite.position = Vector2.ZERO
	body_sprite.z_index = 0

	head_part.texture = null
	head_part.position = Vector2.ZERO
	head_part.z_index = 1

	helmet_sprite.texture = null
	helmet_sprite.position = Vector2.ZERO
	helmet_sprite.z_index = 3

	acc_front.texture = null
	acc_front.position = Vector2.ZERO
	acc_front.z_index = 4

	eyes_sprite.texture = null
	pupils_sprite.texture = null
	snout_sprite.texture = null

	match monster_type:
		"sly_fox":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/1_body_sly_fox.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -90)
			head_part.z_index = -1

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			pupils_sprite.visible = true

			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")

			tex_snout_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/7_snout_smug_smile.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")

			base_eye_pos = Vector2(0, -22)
			snout_sprite.position = Vector2(0, 24)

		"fox_guard":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/02_fox_guard/1_body_fox_guard.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -90)
			head_part.z_index = -1

			tex_helmet_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/2_helmet_wooden_pot.svg")
			tex_helmet_damaged = _load_tex("res://assets/enemies/modular/02_fox_guard/3_helmet_wood_cracked.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -70)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/4_eyes_confident.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/02_fox_guard/5_eyes_panic.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			pupils_sprite.visible = false

			tex_snout_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/6_snout_guard_grinning.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")

			acc_front.texture = _load_tex("res://assets/enemies/modular/02_fox_guard/7_accessories_bandaid.svg")
			acc_front.position = Vector2(-42, 10)

			base_eye_pos = Vector2(0, -20)
			snout_sprite.position = Vector2(0, 24)

		"armored_raccoon":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/03_armored_raccoon/1_body_raccoon_mask.svg")
			tex_helmet_normal = _load_tex("res://assets/enemies/modular/03_armored_raccoon/2_helmet_miner_yellow.svg")
			tex_helmet_damaged = _load_tex("res://assets/enemies/modular/03_armored_raccoon/3_helmet_miner_cracked.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -70)

			acc_back.texture = _load_tex("res://assets/enemies/modular/03_armored_raccoon/4_tail_striped.svg")
			acc_back.position = Vector2(-70, 28)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			pupils_sprite.visible = true

			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")

			tex_snout_normal = _load_tex("res://assets/enemies/modular/03_armored_raccoon/5_snout_sneaky_teeth.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")

			base_eye_pos = Vector2(0, -18)
			snout_sprite.position = Vector2(0, 24)

		"mine_wolf":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/1_body_mine_wolf.svg")
			acc_back.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/2_armor_spiked_shoulder.svg")
			acc_back.position = Vector2(60, -5)

			acc_front.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/3_armor_jaw_plate.svg")
			acc_front.position = Vector2(0, 48)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/04_mine_wolf/4_eyes_wolf_glowing_yellow.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			pupils_sprite.visible = false

			tex_snout_normal = _load_tex("res://assets/enemies/modular/04_mine_wolf/5_snout_snarling_fangs.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")

			base_eye_pos = Vector2(0, -22)
			snout_sprite.position = Vector2(0, 18)

		"spike_hound":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/05_spike_hound/1_body_bulldog.svg")
			acc_front.texture = _load_tex("res://assets/enemies/modular/05_spike_hound/2_collar_spiked_red.svg")
			acc_front.position = Vector2(0, 58)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/05_spike_hound/3_eyes_mismatched.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")
			pupils_sprite.visible = false

			tex_snout_normal = _load_tex("res://assets/enemies/modular/05_spike_hound/4_jaw_underbite_drool.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")

			base_eye_pos = Vector2(0, -22)
			snout_sprite.position = Vector2(0, 26)

		"toxic_fox":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/1_body_toxic_fox.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -90)
			head_part.z_index = -1

			helmet_sprite.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/2_goggles_steampunk_brass.svg")
			helmet_sprite.position = Vector2(0, -20)

			acc_back.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/3_backpack_acid_canister.svg")
			acc_back.position = Vector2(60, -10)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			pupils_sprite.visible = true

			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")

			tex_snout_normal = _load_tex("res://assets/enemies/modular/06_toxic_fox/4_mouth_manic_acid_drip.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")

			base_eye_pos = Vector2(0, -20)
			snout_sprite.position = Vector2(0, 28)

		"imperial_boar":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/1_body_imperial_boar.svg")
			tex_helmet_normal = _load_tex("res://assets/enemies/modular/07_imperial_boar/2_helmet_roman_centurion.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -75)

			head_part.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/3_tusks_golden_pair.svg")
			head_part.position = Vector2(0, 20)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			pupils_sprite.visible = true

			tex_eyes_panic = _load_tex("res://assets/enemies/modular/01_sly_fox/5_eyes_terrified.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")

			tex_snout_normal = _load_tex("res://assets/enemies/modular/07_imperial_boar/4_snout_royal_boar.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")

			acc_front.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/5_badge_egg_medal.svg")
			acc_front.position = Vector2(0, 64)

			base_eye_pos = Vector2(0, -20)
			snout_sprite.position = Vector2(0, 22)

		"boss_baron_pig":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/1_body_emperor_pig.svg")
			helmet_sprite.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/2_crown_royal_gold_jewels.svg")
			helmet_sprite.position = Vector2(0, -95)

			acc_back.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/3_cape_red_ermine_fur.svg")
			acc_back.position = Vector2(0, 68)

			acc_front.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/4_monocle_gold_chain.svg")
			acc_front.position = Vector2(32, -22)

			tex_eyes_normal = _load_tex("res://assets/enemies/modular/08_baron_pig/5_eyes_smug_arrogant.svg")
			tex_eyes_panic = _load_tex("res://assets/enemies/modular/08_baron_pig/6_eyes_ultra_shocked.svg")
			tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/08_baron_pig/8_face_defeated_bruised.svg")
			pupils_sprite.visible = false

			tex_snout_normal = _load_tex("res://assets/enemies/modular/08_baron_pig/7_snout_baron_mustache.svg")
			tex_snout_scream = _load_tex("res://assets/enemies/modular/01_sly_fox/8_mouth_screaming.svg")

			base_eye_pos = Vector2(0, -24)
			snout_sprite.position = Vector2(0, 24)

	eyes_sprite.position = base_eye_pos
	pupils_sprite.position = base_eye_pos
	if eyes_sprite and tex_eyes_normal: eyes_sprite.texture = tex_eyes_normal
	if snout_sprite and tex_snout_normal: snout_sprite.texture = tex_snout_normal

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

	anim_time += delta

	_evaluate_threats(delta)
	_animate_character(delta)

func _evaluate_threats(delta: float) -> void:
	if current_state == State.HURT_DIZZY or current_state == State.VICTORY_TAUNT or current_state == State.DEFEATED:
		return

	var eggs = get_tree().get_nodes_in_group("Eggs")
	var chicken = get_tree().get_first_node_in_group("Player") as ChickenBomber

	var falling_egg: Node = null
	if eggs.size() > 0:
		for egg in eggs:
			if is_instance_valid(egg) and egg is RigidBody2D:
				if egg.global_position.y < global_position.y and egg.linear_velocity.y > 50.0:
					falling_egg = egg
					break

	# 1. Trứng đang rơi trên đầu -> PANIC
	if falling_egg != null:
		if current_state != State.PANIC_FALLING:
			_set_state(State.PANIC_FALLING)
		var dir = (falling_egg.global_position - global_position).normalized()
		eye_look_offset = dir * 6.0
		return

	# 2. Gà đang kéo dây ngắm bắn -> ALERT
	if is_instance_valid(chicken) and chicken.is_aiming:
		if current_state != State.ALERT_AIMING:
			_set_state(State.ALERT_AIMING)
		var dir = (chicken.global_position - global_position).normalized()
		eye_look_offset = dir * 5.0
		return

	# 3. Bình thường -> IDLE
	if current_state != State.IDLE:
		_set_state(State.IDLE)

	# Đảo mắt ngẫu nhiên trong trạng thái Idle
	eye_idle_timer -= delta
	if eye_idle_timer <= 0.0:
		eye_idle_timer = randf_range(1.5, 3.5)
		var r = randi() % 4
		match r:
			0: eye_look_offset = Vector2.ZERO
			1: eye_look_offset = Vector2(-3.0, -1.0)
			2: eye_look_offset = Vector2(3.0, -1.0)
			3: eye_look_offset = Vector2(0.0, -4.0)

	# Chớp mắt tự nhiên
	blink_timer -= delta
	if blink_timer <= 0.0:
		blink_timer = randf_range(3.0, 5.5)
		_trigger_blink()

func _set_state(new_state: State) -> void:
	current_state = new_state

	match current_state:
		State.IDLE:
			if eyes_sprite and tex_eyes_normal: eyes_sprite.texture = tex_eyes_normal
			if snout_sprite and tex_snout_normal: snout_sprite.texture = tex_snout_normal
			if pupils_sprite: pupils_sprite.visible = (monster_type in ["sly_fox", "toxic_fox", "armored_raccoon", "imperial_boar"])

		State.ALERT_AIMING:
			if eyes_sprite and tex_eyes_normal: eyes_sprite.texture = tex_eyes_normal
			if snout_sprite and tex_snout_normal: snout_sprite.texture = tex_snout_normal

		State.PANIC_FALLING:
			if eyes_sprite and tex_eyes_panic: eyes_sprite.texture = tex_eyes_panic
			if snout_sprite and tex_snout_scream: snout_sprite.texture = tex_snout_scream
			if pupils_sprite: pupils_sprite.visible = false

		State.HURT_DIZZY:
			if eyes_sprite and tex_eyes_dizzy: eyes_sprite.texture = tex_eyes_dizzy
			if snout_sprite and tex_snout_normal: snout_sprite.texture = tex_snout_normal
			if pupils_sprite: pupils_sprite.visible = false
			if dizzy_stars: dizzy_stars.visible = true

		State.VICTORY_TAUNT:
			if eyes_sprite and tex_eyes_normal: eyes_sprite.texture = tex_eyes_normal
			if snout_sprite and tex_snout_normal: snout_sprite.texture = tex_snout_normal

func _animate_character(delta: float) -> void:
	if not visual_root: return

	# 1. Di chuyển con ngươi mắt
	if pupils_sprite and pupils_sprite.visible:
		var target_pos = base_eye_pos + eye_look_offset
		pupils_sprite.position = pupils_sprite.position.lerp(target_pos, 9.0 * delta)

	# 2. Hoạt họa cơ thể
	match current_state:
		State.IDLE:
			# Nhịp thở tự nhiên mềm mại
			var breath = sin(anim_time * 2.5) * 0.02
			visual_root.scale = Vector2(base_scale_val * (1.0 + breath), base_scale_val * (1.0 - breath))
			visual_root.position.x = 0.0

		State.ALERT_AIMING:
			# Nhổm người lên căng thẳng nhìn gà
			var tense = sin(anim_time * 6.0) * 0.015
			visual_root.scale = Vector2(base_scale_val * 0.96, base_scale_val * 1.04 + tense)
			visual_root.position.x = 0.0

		State.PANIC_FALLING:
			# Rung lắc sợ hãi vì trứng đang rơi!
			visual_root.position.x = sin(anim_time * 42.0) * 2.2
			visual_root.scale = Vector2(base_scale_val * 0.92, base_scale_val * 1.08)

		State.HURT_DIZZY:
			# Choáng váng lảo đảo
			visual_root.rotation = sin(anim_time * 3.5) * 0.08
			if dizzy_stars: dizzy_stars.rotation += delta * 4.0

		State.VICTORY_TAUNT:
			# Cười nhảy tưng tưng ăn mừng
			visual_root.position.y = -abs(sin(anim_time * 8.0)) * 8.0

func _trigger_blink() -> void:
	if not eyes_sprite or is_blinking or current_state == State.PANIC_FALLING: return
	is_blinking = true
	var blink = create_tween()
	blink.tween_property(eyes_sprite, "scale:y", 0.08, 0.07)
	blink.tween_property(eyes_sprite, "scale:y", 1.0, 0.08)
	await blink.finished
	is_blinking = false

func _on_impact(body: Node) -> void:
	if is_defeated or spawn_settle_timer > 0.0: return
	if not is_awake: wake_up()

	if body is RigidBody2D:
		var rel_vel = (linear_velocity - body.linear_velocity).length()
		if rel_vel > 110.0:
			var crush_dmg = (rel_vel - 110.0) * (body.mass * 0.6) + 25.0
			take_damage(crush_dmg, body.global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_defeated: return
	if not is_awake: wake_up()

	if has_armor:
		amount *= 0.55
		if current_health <= max_health * 0.6:
			has_armor = false
			if tex_helmet_damaged and helmet_sprite:
				helmet_sprite.texture = tex_helmet_damaged
			elif helmet_sprite:
				_pop_off_helmet()

	current_health -= amount

	if current_health > 0.0 and current_health <= max_health * 0.45:
		_set_state(State.HURT_DIZZY)

	# Hiệu ứng nảy đàn hồi khi trúng đòn
	if visual_root:
		var tween = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
		visual_root.scale = Vector2(base_scale_val * 1.35, base_scale_val * 0.65)
		tween.tween_property(visual_root, "scale", Vector2(base_scale_val, base_scale_val), 0.28)

	var flash_tween = create_tween()
	flash_tween.tween_property(visual_root, "modulate", Color(1.0, 0.35, 0.35), 0.05)
	flash_tween.tween_property(visual_root, "modulate", Color.WHITE, 0.08)

	CameraShake.add_trauma(0.35 if monster_type == "boss_baron_pig" else 0.15)

	if current_health <= 0.0:
		_defeat_monster()

func _pop_off_helmet() -> void:
	if not helmet_sprite: return
	var h = helmet_sprite
	helmet_sprite = null
	var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(h, "position:y", h.position.y - 45.0, 0.3)
	tween.tween_property(h, "rotation", 1.8, 0.3)
	tween.tween_property(h, "modulate:a", 0.0, 0.3)
	await tween.finished
	h.queue_free()

func _on_player_failed_taunt() -> void:
	if is_defeated: return
	_set_state(State.VICTORY_TAUNT)

func _defeat_monster() -> void:
	if is_defeated: return
	is_defeated = true
	current_state = State.DEFEATED

	GameManager.register_enemy_defeat(self, score_value)
	CameraShake.add_trauma(0.5 if monster_type == "boss_baron_pig" else 0.2)

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	if eyes_sprite and tex_eyes_dizzy:
		eyes_sprite.texture = tex_eyes_dizzy
	if pupils_sprite:
		pupils_sprite.visible = false

	if dizzy_stars:
		dizzy_stars.visible = true
		var star_tween = create_tween().set_loops(2)
		star_tween.tween_property(dizzy_stars, "rotation", TAU, 0.3)

	# Ép dẹp thành hoạt hình vui nhộn
	if visual_root:
		var flat_tween = create_tween().set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
		flat_tween.tween_property(visual_root, "scale", Vector2(base_scale_val * 1.5, base_scale_val * 0.15), 0.15)

	await get_tree().create_timer(0.4).timeout

	if poof_fx:
		poof_fx.restart()
		poof_fx.emitting = true

	if visual_root: visual_root.visible = false
	await get_tree().create_timer(0.35).timeout
	queue_free()
