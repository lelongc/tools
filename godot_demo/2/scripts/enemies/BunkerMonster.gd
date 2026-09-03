extends RigidBody2D
class_name BunkerMonster

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

enum State {
	IDLE,
	ALERT_AIMING,
	PANIC_FALLING,
	SHOCKED_BY_NEIGHBOR,
	PINNED_UNDER_DEBRIS,
	CRITICAL_INJURED,
	FURIOUS_ARMOR_LOSS,
	VICTORY_TAUNT,
	DEFEATED
}

enum IdleAction {
	NORMAL,
	CHARACTER_SPECIAL,
	WHISTLING,
	TONGUE_RASPBERRY,
	SMUG_LAUGH,
	SLEEPY_NAP,
	SUSPICIOUS
}

@export_enum("sly_fox", "fox_guard", "armored_raccoon", "mine_wolf", "spike_hound", "toxic_fox", "imperial_boar", "boss_baron_pig") var monster_type: String = "sly_fox"
@export var max_health: float = 70.0
@export var score_value: int = 800

var current_health: float = 70.0
var is_defeated: bool = false
var is_awake: bool = false
var has_armor: bool = false
var base_scale_val: float = 0.22

# State and animation variables
var current_state: State = State.IDLE
var current_idle_action: IdleAction = IdleAction.NORMAL
var anim_time: float = 0.0
var spawn_settle_timer: float = 0.5
var shock_timer: float = 0.0
var furious_timer: float = 0.0
var pinned_check_timer: float = 0.2
var is_currently_pinned: bool = false
var pinned_cooldown: float = 0.0

# Eye tracking and micro-actions
var eye_look_offset: Vector2 = Vector2.ZERO
var eye_wander_timer: float = 1.5
var idle_action_timer: float = 2.5
var idle_action_duration: float = 0.0
var is_blinking: bool = false
var blink_timer: float = 3.0
var base_eye_pos: Vector2 = Vector2(0, -22)
var base_snout_pos: Vector2 = Vector2(0, 24)

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

# Character Specific Expression Palette
var char_tex_eyes_normal: Texture2D = null
var char_tex_eyes_aiming: Texture2D = null
var char_tex_eyes_panic: Texture2D = null
var char_tex_eyes_hurt: Texture2D = null
var char_tex_eyes_furious: Texture2D = null
var char_tex_eyes_special: Texture2D = null
var char_tex_eyes_dizzy: Texture2D = null

var char_tex_snout_normal: Texture2D = null
var char_tex_snout_aiming: Texture2D = null
var char_tex_snout_panic: Texture2D = null
var char_tex_snout_hurt: Texture2D = null
var char_tex_snout_furious: Texture2D = null
var char_tex_snout_special: Texture2D = null
var char_tex_snout_taunt: Texture2D = null

# Accessories
var tex_helmet_normal: Texture2D = null
var tex_helmet_damaged: Texture2D = null
var tex_monocle_normal: Texture2D = null
var tex_monocle_popping: Texture2D = null

# Universal Head Emotes
var tex_emote_sweat: Texture2D = null
var tex_emote_alert: Texture2D = null
var tex_emote_anger: Texture2D = null
var tex_emote_question: Texture2D = null
var tex_emote_zzz: Texture2D = null
var tex_emote_stars: Texture2D = null

var active_emote_tween: Tween = null

func _ready() -> void:
	add_to_group("Enemies")
	_setup_monster_attributes()
	_load_character_expression_palette()

	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	if dizzy_stars: dizzy_stars.visible = false
	if emote_sprite: emote_sprite.visible = false

	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		gm.level_failed.connect(_on_player_failed_taunt)
		gm.enemy_defeated.connect(_on_nearby_enemy_defeated)

	blink_timer = randf_range(2.0, 4.0)
	eye_wander_timer = randf_range(1.0, 2.0)
	idle_action_timer = randf_range(2.0, 4.0)

	_play_spawn_bounce()

func _setup_monster_attributes() -> void:
	match monster_type:
		"sly_fox":
			max_health = 70.0
			mass = 1.8
			score_value = 800
			base_scale_val = 0.22
		"fox_guard":
			max_health = 140.0
			mass = 2.4
			score_value = 1400
			has_armor = true
			base_scale_val = 0.22
		"armored_raccoon":
			max_health = 220.0
			mass = 3.5
			score_value = 2000
			has_armor = true
			base_scale_val = 0.23
		"mine_wolf":
			max_health = 360.0
			mass = 5.0
			score_value = 2800
			has_armor = true
			base_scale_val = 0.25
		"spike_hound":
			max_health = 320.0
			mass = 4.5
			score_value = 2500
			has_armor = true
			base_scale_val = 0.24
		"toxic_fox":
			max_health = 260.0
			mass = 3.2
			score_value = 2200
			base_scale_val = 0.23
		"imperial_boar":
			max_health = 600.0
			mass = 8.0
			score_value = 4500
			has_armor = true
			base_scale_val = 0.27
		"boss_baron_pig":
			max_health = 1800.0
			mass = 20.0
			score_value = 10000
			has_armor = true
			base_scale_val = 0.35
			if col_shape and col_shape.shape is CircleShape2D:
				var big_circle = CircleShape2D.new()
				big_circle.radius = 32.0
				col_shape.shape = big_circle

	current_health = max_health
	if visual_root:
		visual_root.scale = Vector2(base_scale_val, base_scale_val)

func _load_character_expression_palette() -> void:
	# 1. Tải icon emote dùng chung
	tex_emote_sweat = _load_tex("res://assets/enemies/modular_expressions/04_head_emotes_fx/emote_giant_sweat_drop.svg")
	tex_emote_alert = _load_tex("res://assets/enemies/modular_expressions/04_head_emotes_fx/emote_exclamation_alert_danger.svg")
	tex_emote_anger = _load_tex("res://assets/enemies/modular_expressions/04_head_emotes_fx/emote_anger_vein_cross.svg")
	tex_emote_question = _load_tex("res://assets/enemies/modular_expressions/04_head_emotes_fx/emote_question_mark_bounce.svg")
	tex_emote_zzz = _load_tex("res://assets/enemies/modular_expressions/04_head_emotes_fx/emote_sleep_zzz_bubbles.svg")
	tex_emote_stars = _load_tex("res://assets/enemies/modular_expressions/04_head_emotes_fx/emote_victory_celebration_stars.svg")

	# Reset nodes
	acc_back.texture = null
	acc_back.position = Vector2.ZERO
	body_sprite.texture = null
	body_sprite.position = Vector2.ZERO
	head_part.texture = null
	head_part.position = Vector2.ZERO
	helmet_sprite.texture = null
	helmet_sprite.position = Vector2.ZERO
	acc_front.texture = null
	acc_front.position = Vector2.ZERO
	eyes_sprite.texture = null
	pupils_sprite.texture = null
	snout_sprite.texture = null

	# 2. Xây dựng bảng biểu cảm CHUẨN TỪNG LOÀI
	match monster_type:
		"sly_fox":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/1_body_sly_fox.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -90)
			head_part.z_index = -1

			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			pupils_sprite.visible = true

			char_tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			char_tex_eyes_aiming = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_furious_v_brow.svg")
			char_tex_eyes_panic = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_shock_pinprick.svg")
			char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_tearful_pleading.svg")
			char_tex_eyes_furious = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_furious_v_brow.svg")
			char_tex_eyes_special = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_laughing_smug.svg")
			char_tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")

			char_tex_snout_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/7_snout_smug_smile.svg")
			char_tex_snout_aiming = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_gasp_shock_hole.svg")
			char_tex_snout_panic = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_wavy_panic_scream.svg")
			char_tex_snout_hurt = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_bruised_broken_tooth.svg")
			char_tex_snout_furious = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_wide_grin_fangs.svg")
			char_tex_snout_special = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_tongue_raspberry.svg")
			char_tex_snout_taunt = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_wide_grin_fangs.svg")

			base_eye_pos = Vector2(0, -22)
			base_snout_pos = Vector2(0, 24)

		"fox_guard":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/02_fox_guard/1_body_fox_guard.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -90)
			head_part.z_index = -1

			tex_helmet_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/2_helmet_wooden_pot.svg")
			tex_helmet_damaged = _load_tex("res://assets/enemies/modular/02_fox_guard/3_helmet_wood_cracked.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -70)

			acc_front.texture = _load_tex("res://assets/enemies/modular/02_fox_guard/7_accessories_bandaid.svg")
			acc_front.position = Vector2(-42, 10)

			pupils_sprite.visible = false

			char_tex_eyes_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/4_eyes_confident.svg")
			char_tex_eyes_aiming = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_furious_v_brow.svg")
			char_tex_eyes_panic = _load_tex("res://assets/enemies/modular/02_fox_guard/5_eyes_panic.svg")
			char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular/02_fox_guard/5_eyes_defeated_black_eye.svg")
			if not char_tex_eyes_hurt:
				char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_tearful_pleading.svg")
			char_tex_eyes_furious = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_furious_v_brow.svg")
			char_tex_eyes_special = _load_tex("res://assets/enemies/modular/02_fox_guard/4_eyes_confident.svg")
			char_tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")

			char_tex_snout_normal = _load_tex("res://assets/enemies/modular/02_fox_guard/6_snout_guard_grinning.svg")
			char_tex_snout_aiming = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_gasp_shock_hole.svg")
			char_tex_snout_panic = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_wavy_panic_scream.svg")
			char_tex_snout_hurt = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_bruised_broken_tooth.svg")
			char_tex_snout_furious = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_wide_grin_fangs.svg")
			char_tex_snout_special = _load_tex("res://assets/enemies/modular/02_fox_guard/6_snout_guard_grinning.svg")
			char_tex_snout_taunt = _load_tex("res://assets/enemies/modular/02_fox_guard/6_snout_guard_grinning.svg")

			base_eye_pos = Vector2(0, -20)
			base_snout_pos = Vector2(0, 24)

		"armored_raccoon":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/03_armored_raccoon/1_body_raccoon_mask.svg")
			tex_helmet_normal = _load_tex("res://assets/enemies/modular/03_armored_raccoon/2_helmet_miner_yellow.svg")
			tex_helmet_damaged = _load_tex("res://assets/enemies/modular/03_armored_raccoon/3_helmet_miner_cracked.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -70)

			acc_back.texture = _load_tex("res://assets/enemies/modular/03_armored_raccoon/4_tail_striped.svg")
			acc_back.position = Vector2(-70, 28)

			pupils_sprite.visible = false

			char_tex_eyes_normal = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_raccoon_bandit_normal.svg")
			char_tex_eyes_aiming = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_raccoon_shock_pinprick.svg")
			char_tex_eyes_panic = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_raccoon_shock_pinprick.svg")
			char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_raccoon_defeat_swollen.svg")
			char_tex_eyes_furious = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_raccoon_bandit_normal.svg")
			char_tex_eyes_special = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_raccoon_greedy_stars.svg")
			char_tex_eyes_dizzy = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_raccoon_defeat_swollen.svg")

			char_tex_snout_normal = _load_tex("res://assets/enemies/modular/03_armored_raccoon/5_snout_sneaky_teeth.svg")
			char_tex_snout_aiming = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/snout_raccoon_teeth_chattering.svg")
			char_tex_snout_panic = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/snout_raccoon_teeth_chattering.svg")
			char_tex_snout_hurt = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/snout_raccoon_teeth_chattering.svg")
			char_tex_snout_furious = _load_tex("res://assets/enemies/modular/03_armored_raccoon/5_snout_sneaky_teeth.svg")
			char_tex_snout_special = _load_tex("res://assets/enemies/modular/03_armored_raccoon/5_snout_sneaky_teeth.svg")
			char_tex_snout_taunt = _load_tex("res://assets/enemies/modular/03_armored_raccoon/5_snout_sneaky_teeth.svg")

			base_eye_pos = Vector2(0, -18)
			base_snout_pos = Vector2(0, 24)

		"mine_wolf":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/1_body_mine_wolf.svg")
			acc_back.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/2_armor_spiked_shoulder.svg")
			acc_back.position = Vector2(60, -5)

			acc_front.texture = _load_tex("res://assets/enemies/modular/04_mine_wolf/3_armor_jaw_plate.svg")
			acc_front.position = Vector2(0, 48)

			pupils_sprite.visible = false

			char_tex_eyes_normal = _load_tex("res://assets/enemies/modular/04_mine_wolf/4_eyes_wolf_glowing_yellow.svg")
			char_tex_eyes_aiming = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_wolf_glowing_red_rage.svg")
			char_tex_eyes_panic = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_wolf_terrified_shock.svg")
			char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_wolf_hurt_whimper.svg")
			char_tex_eyes_furious = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_wolf_glowing_red_rage.svg")
			char_tex_eyes_special = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_wolf_glowing_red_rage.svg")
			char_tex_eyes_dizzy = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_wolf_hurt_whimper.svg")

			char_tex_snout_normal = _load_tex("res://assets/enemies/modular/04_mine_wolf/5_snout_snarling_fangs.svg")
			char_tex_snout_aiming = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/snout_wolf_snarl_saliva.svg")
			char_tex_snout_panic = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/snout_wolf_snarl_saliva.svg")
			char_tex_snout_hurt = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/snout_wolf_whimper_pain.svg")
			char_tex_snout_furious = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/snout_wolf_snarl_saliva.svg")
			char_tex_snout_special = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/snout_wolf_snarl_saliva.svg")
			char_tex_snout_taunt = _load_tex("res://assets/enemies/modular/04_mine_wolf/5_snout_snarling_fangs.svg")

			base_eye_pos = Vector2(0, -22)
			base_snout_pos = Vector2(0, 18)

		"spike_hound":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/05_spike_hound/1_body_bulldog.svg")
			acc_front.texture = _load_tex("res://assets/enemies/modular/05_spike_hound/2_collar_spiked_red.svg")
			acc_front.position = Vector2(0, 58)

			pupils_sprite.visible = false

			char_tex_eyes_normal = _load_tex("res://assets/enemies/modular/05_spike_hound/3_eyes_mismatched.svg")
			char_tex_eyes_aiming = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_bulldog_shock_pop.svg")
			char_tex_eyes_panic = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_bulldog_shock_pop.svg")
			char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_bulldog_hurt_dizzy.svg")
			char_tex_eyes_furious = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_bulldog_shock_pop.svg")
			char_tex_eyes_special = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_bulldog_derpy_googly.svg")
			char_tex_eyes_dizzy = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/eyes_bulldog_hurt_dizzy.svg")

			char_tex_snout_normal = _load_tex("res://assets/enemies/modular/05_spike_hound/4_jaw_underbite_drool.svg")
			char_tex_snout_aiming = _load_tex("res://assets/enemies/modular/05_spike_hound/4_jaw_underbite_drool.svg")
			char_tex_snout_panic = _load_tex("res://assets/enemies/modular/05_spike_hound/4_jaw_underbite_drool.svg")
			char_tex_snout_hurt = _load_tex("res://assets/enemies/modular_expressions/02_raccoon_wolf_hound_expressions/jaw_bulldog_hurt_loose_tooth.svg")
			char_tex_snout_furious = _load_tex("res://assets/enemies/modular/05_spike_hound/4_jaw_underbite_drool.svg")
			char_tex_snout_special = _load_tex("res://assets/enemies/modular/05_spike_hound/4_jaw_underbite_drool.svg")
			char_tex_snout_taunt = _load_tex("res://assets/enemies/modular/05_spike_hound/4_jaw_underbite_drool.svg")

			base_eye_pos = Vector2(0, -22)
			base_snout_pos = Vector2(0, 26)

		"toxic_fox":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/1_body_toxic_fox.svg")
			head_part.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/2_ears_fluffy.svg")
			head_part.position = Vector2(0, -90)
			head_part.z_index = -1

			helmet_sprite.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/2_goggles_steampunk_brass.svg")
			helmet_sprite.position = Vector2(0, -20)

			acc_back.texture = _load_tex("res://assets/enemies/modular/06_toxic_fox/3_backpack_acid_canister.svg")
			acc_back.position = Vector2(60, -10)

			pupils_sprite.texture = _load_tex("res://assets/enemies/modular/01_sly_fox/4_pupils_separate.svg")
			pupils_sprite.visible = true

			char_tex_eyes_normal = _load_tex("res://assets/enemies/modular/01_sly_fox/3_eyes_normal.svg")
			char_tex_eyes_aiming = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_furious_v_brow.svg")
			char_tex_eyes_panic = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_shock_pinprick.svg")
			char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_tearful_pleading.svg")
			char_tex_eyes_furious = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_furious_v_brow.svg")
			char_tex_eyes_special = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_laughing_smug.svg")
			char_tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/01_sly_fox/6_eyes_dizzy_xx.svg")

			char_tex_snout_normal = _load_tex("res://assets/enemies/modular/06_toxic_fox/4_mouth_manic_acid_drip.svg")
			char_tex_snout_aiming = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_gasp_shock_hole.svg")
			char_tex_snout_panic = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_wavy_panic_scream.svg")
			char_tex_snout_hurt = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_bruised_broken_tooth.svg")
			char_tex_snout_furious = _load_tex("res://assets/enemies/modular/06_toxic_fox/4_mouth_manic_acid_drip.svg")
			char_tex_snout_special = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_tongue_raspberry.svg")
			char_tex_snout_taunt = _load_tex("res://assets/enemies/modular/06_toxic_fox/4_mouth_manic_acid_drip.svg")

			base_eye_pos = Vector2(0, -20)
			base_snout_pos = Vector2(0, 28)

		"imperial_boar":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/1_body_imperial_boar.svg")
			tex_helmet_normal = _load_tex("res://assets/enemies/modular/07_imperial_boar/2_helmet_roman_centurion.svg")
			helmet_sprite.texture = tex_helmet_normal
			helmet_sprite.position = Vector2(0, -75)

			head_part.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/3_tusks_golden_pair.svg")
			head_part.position = Vector2(0, 20)

			acc_front.texture = _load_tex("res://assets/enemies/modular/07_imperial_boar/5_badge_egg_medal.svg")
			acc_front.position = Vector2(0, 64)

			pupils_sprite.visible = false

			char_tex_eyes_normal = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/eyes_boar_roman_normal.svg")
			char_tex_eyes_aiming = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/eyes_boar_shock_bulging.svg")
			char_tex_eyes_panic = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/eyes_boar_shock_bulging.svg")
			char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/eyes_boar_defeat_black_eye.svg")
			char_tex_eyes_furious = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/eyes_boar_furious_war.svg")
			char_tex_eyes_special = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/eyes_boar_furious_war.svg")
			char_tex_eyes_dizzy = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/eyes_boar_defeat_black_eye.svg")

			char_tex_snout_normal = _load_tex("res://assets/enemies/modular/07_imperial_boar/4_snout_royal_boar.svg")
			char_tex_snout_aiming = _load_tex("res://assets/enemies/modular/07_imperial_boar/4_snout_royal_boar.svg")
			char_tex_snout_panic = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/snout_boar_screaming_oink.svg")
			char_tex_snout_hurt = _load_tex("res://assets/enemies/modular_expressions/05_boar_expressions/snout_boar_screaming_oink.svg")
			char_tex_snout_furious = _load_tex("res://assets/enemies/modular/07_imperial_boar/4_snout_royal_boar.svg")
			char_tex_snout_special = _load_tex("res://assets/enemies/modular/07_imperial_boar/4_snout_royal_boar.svg")
			char_tex_snout_taunt = _load_tex("res://assets/enemies/modular/07_imperial_boar/4_snout_royal_boar.svg")

			base_eye_pos = Vector2(0, -20)
			base_snout_pos = Vector2(0, 22)

		"boss_baron_pig":
			body_sprite.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/1_body_emperor_pig.svg")
			helmet_sprite.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/2_crown_royal_gold_jewels.svg")
			helmet_sprite.position = Vector2(0, -95)

			acc_back.texture = _load_tex("res://assets/enemies/modular/08_baron_pig/3_cape_red_ermine_fur.svg")
			acc_back.position = Vector2(0, 68)

			tex_monocle_normal = _load_tex("res://assets/enemies/modular/08_baron_pig/4_monocle_gold_chain.svg")
			tex_monocle_popping = _load_tex("res://assets/enemies/modular_expressions/03_baron_pig_special/monocle_popping_shock.svg")
			acc_front.texture = tex_monocle_normal
			acc_front.position = Vector2(32, -22)

			pupils_sprite.visible = false

			char_tex_eyes_normal = _load_tex("res://assets/enemies/modular/08_baron_pig/5_eyes_smug_arrogant.svg")
			char_tex_eyes_aiming = _load_tex("res://assets/enemies/modular/08_baron_pig/6_eyes_ultra_shocked.svg")
			char_tex_eyes_panic = _load_tex("res://assets/enemies/modular/08_baron_pig/6_eyes_ultra_shocked.svg")
			char_tex_eyes_hurt = _load_tex("res://assets/enemies/modular_expressions/03_baron_pig_special/eyes_baron_crying_fountains.svg")
			char_tex_eyes_furious = _load_tex("res://assets/enemies/modular/08_baron_pig/6_eyes_ultra_shocked.svg")
			char_tex_eyes_special = _load_tex("res://assets/enemies/modular/08_baron_pig/5_eyes_smug_arrogant.svg")
			char_tex_eyes_dizzy = _load_tex("res://assets/enemies/modular/08_baron_pig/8_face_defeated_bruised.svg")

			char_tex_snout_normal = _load_tex("res://assets/enemies/modular/08_baron_pig/7_snout_baron_mustache.svg")
			char_tex_snout_aiming = _load_tex("res://assets/enemies/modular/08_baron_pig/7_snout_baron_mustache.svg")
			char_tex_snout_panic = _load_tex("res://assets/enemies/modular/08_baron_pig/7_snout_baron_mustache.svg")
			char_tex_snout_hurt = _load_tex("res://assets/enemies/modular/08_baron_pig/7_snout_baron_mustache.svg")
			char_tex_snout_furious = _load_tex("res://assets/enemies/modular/08_baron_pig/7_snout_baron_mustache.svg")
			char_tex_snout_special = _load_tex("res://assets/enemies/modular_expressions/03_baron_pig_special/snout_baron_laughing_gold_tooth.svg")
			char_tex_snout_taunt = _load_tex("res://assets/enemies/modular_expressions/03_baron_pig_special/snout_baron_laughing_gold_tooth.svg")

			base_eye_pos = Vector2(0, -24)
			base_snout_pos = Vector2(0, 24)

	eyes_sprite.position = base_eye_pos
	pupils_sprite.position = base_eye_pos
	snout_sprite.position = base_snout_pos
	if eyes_sprite and char_tex_eyes_normal: eyes_sprite.texture = char_tex_eyes_normal
	if snout_sprite and char_tex_snout_normal: snout_sprite.texture = char_tex_snout_normal

func _load_tex(path: String) -> Texture2D:
	if ResourceLoader.exists(path):
		var res = load(path)
		if res: return res
	var global_path = ProjectSettings.globalize_path(path)
	if FileAccess.file_exists(global_path):
		var img = Image.load_from_file(global_path)
		if img:
			var tex = ImageTexture.create_from_image(img)
			tex.resource_path = path
			return tex
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

	_evaluate_situational_state(delta)
	_animate_character(delta)

func _evaluate_situational_state(delta: float) -> void:
	if current_state == State.DEFEATED or current_state == State.VICTORY_TAUNT:
		return

	# 1. Đang bị choáng sau khi chứng kiến quái bạn chết gần kề
	if shock_timer > 0.0:
		shock_timer -= delta
		if shock_timer <= 0.0:
			_evaluate_base_state(delta)
		return

	# 2. Đang tức giận sau khi văng mũ
	if furious_timer > 0.0:
		furious_timer -= delta
		if furious_timer <= 0.0:
			_evaluate_base_state(delta)
		return

	# 3. Kiểm tra xem có đang bị đè kẹt dưới đống đổ nát (Pinned under debris)
	pinned_check_timer -= delta
	if pinned_check_timer <= 0.0:
		pinned_check_timer = 0.2
		var currently_pinned = _check_is_pinned()
		if currently_pinned:
			is_currently_pinned = true
			pinned_cooldown = 0.8
			if current_state != State.PINNED_UNDER_DEBRIS:
				_set_state(State.PINNED_UNDER_DEBRIS)
			return

	if is_currently_pinned:
		pinned_cooldown -= delta
		if pinned_cooldown <= 0.0:
			is_currently_pinned = false
			_set_state(State.IDLE)
		else:
			return

	# 4. Kiểm tra sức khỏe nguy kịch (Critical Injured - HP < 45%)
	if current_health <= max_health * 0.45:
		if current_state != State.CRITICAL_INJURED and current_state != State.PANIC_FALLING:
			_set_state(State.CRITICAL_INJURED)
		if current_state == State.CRITICAL_INJURED:
			_update_injured_behaviors(delta)
			return

	_evaluate_base_state(delta)

func _evaluate_base_state(delta: float) -> void:
	# 1. Kiểm tra mối nguy hiểm từ trên cao (Trứng đang rơi hoặc Khối nhà đang sập đè)
	var eggs = get_tree().get_nodes_in_group("Eggs")
	var chicken = get_tree().get_first_node_in_group("Player") as ChickenBomber

	var threat_node: Node2D = null
	var min_threat_dist: float = 300.0

	# Trứng đang rơi
	for egg in eggs:
		if is_instance_valid(egg) and egg is RigidBody2D:
			if egg.global_position.y < global_position.y + 40.0 and egg.linear_velocity.y > 35.0:
				var dist = global_position.distance_to(egg.global_position)
				if dist < min_threat_dist:
					min_threat_dist = dist
					threat_node = egg

	# Khối nhà phía trên đang rơi sập
	if threat_node == null:
		var blocks = get_tree().get_nodes_in_group("Destructibles")
		for b in blocks:
			if is_instance_valid(b) and b is RigidBody2D:
				if b.global_position.y < global_position.y - 15.0 and b.global_position.y > global_position.y - 180.0:
					if abs(b.global_position.x - global_position.x) < 70.0 and b.linear_velocity.y > 55.0:
						threat_node = b
						break

	# Có mối nguy hiểm rơi trên đầu -> PANIC_FALLING (Mắt trợn tròng, la hét, toát mồ hôi)
	if threat_node != null:
		if current_state != State.PANIC_FALLING:
			_set_state(State.PANIC_FALLING)
		var dir = (threat_node.global_position - global_position).normalized()
		eye_look_offset = dir * 6.0
		return

	# Gà đang kéo ngắm bắn -> ALERT_AIMING (Dõi mắt theo ngắm bắn thời gian thực)
	if is_instance_valid(chicken) and chicken.is_aiming:
		if current_state != State.ALERT_AIMING:
			_set_state(State.ALERT_AIMING)
		var dir = (chicken.global_position - global_position).normalized()
		eye_look_offset = dir * 5.0
		return

	# Bình thường -> IDLE (nếu còn khỏe) hoặc CRITICAL_INJURED (nếu yếu)
	if current_health <= max_health * 0.45:
		if current_state != State.CRITICAL_INJURED:
			_set_state(State.CRITICAL_INJURED)
		_update_injured_behaviors(delta)
		return

	if current_state != State.IDLE:
		_set_state(State.IDLE)

	_update_idle_micro_actions(delta)

func _check_is_pinned() -> bool:
	if not is_awake: return false
	var space_state = get_world_2d().direct_space_state
	if not space_state: return false
	var query = PhysicsShapeQueryParameters2D.new()
	var ray = CircleShape2D.new()
	ray.radius = 18.0
	query.shape = ray
	query.transform = Transform2D(0, global_position + Vector2(0, -16.0))
	query.collide_with_bodies = true
	query.exclude = [get_rid()]

	var results = space_state.intersect_shape(query, 6)
	for res in results:
		var col = res.collider
		if is_instance_valid(col) and col != self and col is RigidBody2D:
			if col.global_position.y < global_position.y:
				return true
	return false

func _update_injured_behaviors(delta: float) -> void:
	eye_wander_timer -= delta
	if eye_wander_timer <= 0.0:
		eye_wander_timer = randf_range(1.5, 3.0)
		eye_look_offset = Vector2(randf_range(-2.0, 2.0), randf_range(-1.0, 2.0))
		if randf() < 0.35:
			_pop_emote(tex_emote_sweat, 0.8)

func _update_idle_micro_actions(delta: float) -> void:
	if idle_action_duration > 0.0:
		idle_action_duration -= delta
		if idle_action_duration <= 0.0:
			_reset_to_normal_idle()

	idle_action_timer -= delta
	if idle_action_timer <= 0.0:
		idle_action_timer = randf_range(2.2, 4.5)
		_trigger_random_idle_action()

	if current_idle_action == IdleAction.NORMAL or current_idle_action == IdleAction.WHISTLING:
		eye_wander_timer -= delta
		if eye_wander_timer <= 0.0:
			eye_wander_timer = randf_range(1.2, 2.5)
			var r = randi() % 5
			match r:
				0: eye_look_offset = Vector2.ZERO
				1: eye_look_offset = Vector2(-3.5, -1.0)
				2: eye_look_offset = Vector2(3.5, -1.0)
				3: eye_look_offset = Vector2(0.0, -4.5)
				4: eye_look_offset = Vector2(0.0, 2.0)

	blink_timer -= delta
	if blink_timer <= 0.0:
		blink_timer = randf_range(2.5, 4.5)
		_trigger_blink()

func _trigger_random_idle_action() -> void:
	if current_idle_action != IdleAction.NORMAL or current_health <= max_health * 0.45:
		return

	var roll = randi() % 5
	match roll:
		0:
			# Hành động đặc trưng riêng của từng loài
			current_idle_action = IdleAction.CHARACTER_SPECIAL
			idle_action_duration = randf_range(1.4, 2.0)
			if eyes_sprite and char_tex_eyes_special:
				eyes_sprite.texture = char_tex_eyes_special
			if snout_sprite and char_tex_snout_special:
				snout_sprite.texture = char_tex_snout_special
			if pupils_sprite and monster_type in ["mine_wolf", "spike_hound", "armored_raccoon"]:
				pupils_sprite.visible = false
		1:
			# Huýt sáo ngây thơ (chỉ dành cho cáo)
			if monster_type in ["sly_fox", "toxic_fox"]:
				current_idle_action = IdleAction.WHISTLING
				idle_action_duration = randf_range(1.4, 2.0)
				var whistling_tex = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_whistling_innocent.svg")
				if snout_sprite and whistling_tex:
					snout_sprite.texture = whistling_tex
			else:
				current_idle_action = IdleAction.NORMAL
		2:
			# Thè lưỡi trêu ngươi (chỉ dành cho cáo)
			if monster_type in ["sly_fox", "toxic_fox"]:
				current_idle_action = IdleAction.TONGUE_RASPBERRY
				idle_action_duration = randf_range(1.0, 1.6)
				var tongue_tex = _load_tex("res://assets/enemies/modular_expressions/01_fox_snouts/snout_fox_tongue_raspberry.svg")
				if snout_sprite and tongue_tex:
					snout_sprite.texture = tongue_tex
			else:
				current_idle_action = IdleAction.NORMAL
		3:
			# Ngủ gật + Zzz
			current_idle_action = IdleAction.SLEEPY_NAP
			idle_action_duration = randf_range(1.6, 2.2)
			var sleep_eyes = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_sleeping_peaceful.svg")
			if eyes_sprite and sleep_eyes and monster_type in ["sly_fox", "fox_guard", "toxic_fox", "imperial_boar"]:
				eyes_sprite.texture = sleep_eyes
			if pupils_sprite: pupils_sprite.visible = false
			_pop_emote(tex_emote_zzz, 1.0)
		4:
			# Nghi ngờ nghiêng đầu + ?
			current_idle_action = IdleAction.SUSPICIOUS
			idle_action_duration = randf_range(1.2, 1.8)
			var susp_eyes = _load_tex("res://assets/enemies/modular_expressions/01_fox_eyes/eyes_fox_suspicious.svg")
			if eyes_sprite and susp_eyes and monster_type in ["sly_fox", "fox_guard", "toxic_fox"]:
				eyes_sprite.texture = susp_eyes
			_pop_emote(tex_emote_question, 0.8)

func _reset_to_normal_idle() -> void:
	current_idle_action = IdleAction.NORMAL
	if eyes_sprite and char_tex_eyes_normal:
		eyes_sprite.texture = char_tex_eyes_normal
	if snout_sprite and char_tex_snout_normal:
		snout_sprite.texture = char_tex_snout_normal
	if pupils_sprite:
		pupils_sprite.visible = (monster_type in ["sly_fox", "toxic_fox", "armored_raccoon", "imperial_boar"])
	if visual_root:
		visual_root.rotation = 0.0
	if monster_type == "boss_baron_pig" and acc_front and tex_monocle_normal:
		acc_front.texture = tex_monocle_normal
		acc_front.position = Vector2(32, -22)
	if dizzy_stars:
		dizzy_stars.visible = false

func _clear_emote() -> void:
	if active_emote_tween and active_emote_tween.is_valid():
		active_emote_tween.kill()
	if emote_sprite:
		emote_sprite.visible = false
		emote_sprite.scale = Vector2.ZERO
		emote_sprite.modulate = Color(1, 1, 1, 0)

func _set_state(new_state: State) -> void:
	if current_state == new_state: return

	_clear_emote()

	current_state = new_state
	current_idle_action = IdleAction.NORMAL

	match current_state:
		State.IDLE:
			_reset_to_normal_idle()

		State.ALERT_AIMING:
			if eyes_sprite and char_tex_eyes_aiming:
				eyes_sprite.texture = char_tex_eyes_aiming
			if snout_sprite and char_tex_snout_aiming:
				snout_sprite.texture = char_tex_snout_aiming
			if pupils_sprite:
				pupils_sprite.visible = (monster_type in ["sly_fox", "toxic_fox", "armored_raccoon", "imperial_boar"])
			if monster_type == "boss_baron_pig" and acc_front and tex_monocle_popping:
				acc_front.texture = tex_monocle_popping
				acc_front.position = Vector2(45, -34)
			_pop_emote(tex_emote_alert, 0.7)

		State.PANIC_FALLING:
			if eyes_sprite and char_tex_eyes_panic:
				eyes_sprite.texture = char_tex_eyes_panic
			if snout_sprite and char_tex_snout_panic:
				snout_sprite.texture = char_tex_snout_panic
			if pupils_sprite:
				pupils_sprite.visible = false
			if monster_type == "boss_baron_pig" and acc_front and tex_monocle_popping:
				acc_front.texture = tex_monocle_popping
				acc_front.position = Vector2(45, -34)
			_pop_emote(tex_emote_sweat, 1.0)

		State.SHOCKED_BY_NEIGHBOR:
			if eyes_sprite and char_tex_eyes_panic:
				eyes_sprite.texture = char_tex_eyes_panic
			if snout_sprite and char_tex_snout_aiming:
				snout_sprite.texture = char_tex_snout_aiming
			if pupils_sprite:
				pupils_sprite.visible = false
			_pop_emote(tex_emote_alert, 0.9)

		State.PINNED_UNDER_DEBRIS:
			if eyes_sprite and char_tex_eyes_panic:
				eyes_sprite.texture = char_tex_eyes_panic
			if snout_sprite and char_tex_snout_hurt:
				snout_sprite.texture = char_tex_snout_hurt
			if pupils_sprite: pupils_sprite.visible = false
			if dizzy_stars: dizzy_stars.visible = true

		State.CRITICAL_INJURED:
			if eyes_sprite and char_tex_eyes_hurt:
				eyes_sprite.texture = char_tex_eyes_hurt
			if snout_sprite and char_tex_snout_hurt:
				snout_sprite.texture = char_tex_snout_hurt
			if pupils_sprite: pupils_sprite.visible = false
			if dizzy_stars: dizzy_stars.visible = true

		State.FURIOUS_ARMOR_LOSS:
			if eyes_sprite and char_tex_eyes_furious:
				eyes_sprite.texture = char_tex_eyes_furious
			if snout_sprite and char_tex_snout_furious:
				snout_sprite.texture = char_tex_snout_furious
			if pupils_sprite: pupils_sprite.visible = (monster_type in ["sly_fox", "toxic_fox", "armored_raccoon", "imperial_boar"])
			if dizzy_stars: dizzy_stars.visible = false
			_pop_emote(tex_emote_anger, 1.0)

		State.VICTORY_TAUNT:
			if eyes_sprite and char_tex_eyes_special:
				eyes_sprite.texture = char_tex_eyes_special
			if snout_sprite and char_tex_snout_taunt:
				snout_sprite.texture = char_tex_snout_taunt
			if pupils_sprite:
				pupils_sprite.visible = false
			_pop_emote(tex_emote_stars, 1.4)

func _animate_character(delta: float) -> void:
	if not visual_root: return

	# 1. Di chuyển con ngươi mắt mượt mà
	if pupils_sprite and pupils_sprite.visible:
		var target_pos = base_eye_pos + eye_look_offset
		pupils_sprite.position = pupils_sprite.position.lerp(target_pos, 10.0 * delta)

	# 2. Hoạt họa cơ thể sinh động theo trạng thái
	match current_state:
		State.IDLE:
			match current_idle_action:
				IdleAction.WHISTLING:
					visual_root.rotation = sin(anim_time * 4.0) * 0.05
					visual_root.scale = Vector2(base_scale_val * (1.0 + sin(anim_time * 8.0) * 0.02), base_scale_val)
				IdleAction.TONGUE_RASPBERRY:
					visual_root.rotation = sin(anim_time * 12.0) * 0.06
					visual_root.position.x = sin(anim_time * 12.0) * 2.0
				IdleAction.SMUG_LAUGH:
					visual_root.position.y = -abs(sin(anim_time * 10.0)) * 3.5
					visual_root.scale = Vector2(base_scale_val * 1.04, base_scale_val * 0.96)
				IdleAction.SLEEPY_NAP:
					var nap_breath = sin(anim_time * 1.5) * 0.03
					visual_root.scale = Vector2(base_scale_val * (1.0 - nap_breath), base_scale_val * (1.0 + nap_breath))
					visual_root.rotation = 0.06
				IdleAction.SUSPICIOUS:
					visual_root.rotation = -0.14
					visual_root.position.x = 0.0
				IdleAction.CHARACTER_SPECIAL:
					visual_root.rotation = sin(anim_time * 6.0) * 0.06
					visual_root.position.y = -abs(sin(anim_time * 6.0)) * 2.5
				_:
					var breath = sin(anim_time * 2.5) * 0.02
					visual_root.scale = Vector2(base_scale_val * (1.0 + breath), base_scale_val * (1.0 - breath))
					visual_root.rotation = 0.0
					visual_root.position = Vector2.ZERO

		State.ALERT_AIMING:
			var tense = sin(anim_time * 7.0) * 0.02
			visual_root.scale = Vector2(base_scale_val * 0.95, base_scale_val * 1.05 + tense)
			visual_root.position.x = 0.0

		State.PANIC_FALLING:
			visual_root.position.x = sin(anim_time * 48.0) * 2.5
			visual_root.position.y = cos(anim_time * 42.0) * 1.5
			visual_root.scale = Vector2(base_scale_val * 0.90, base_scale_val * 1.10)

		State.SHOCKED_BY_NEIGHBOR:
			visual_root.position.y = -abs(sin(anim_time * 16.0)) * 6.0
			visual_root.scale = Vector2(base_scale_val * 0.88, base_scale_val * 1.14)

		State.PINNED_UNDER_DEBRIS:
			var squish_pant = sin(anim_time * 4.0) * 0.025
			visual_root.scale = Vector2(base_scale_val * (1.28 + squish_pant), base_scale_val * (0.68 - squish_pant))
			visual_root.position.x = 0.0
			visual_root.rotation = 0.03

		State.CRITICAL_INJURED:
			var heavy_pant = sin(anim_time * 5.0) * 0.04
			visual_root.scale = Vector2(base_scale_val * (1.0 + heavy_pant), base_scale_val * (1.0 - heavy_pant))
			visual_root.rotation = sin(anim_time * 3.5) * 0.08
			if dizzy_stars: dizzy_stars.rotation += delta * 4.0

		State.FURIOUS_ARMOR_LOSS:
			visual_root.scale = Vector2(base_scale_val * 1.08, base_scale_val * 0.94)
			visual_root.position.x = sin(anim_time * 25.0) * 1.5

		State.VICTORY_TAUNT:
			visual_root.position.y = -abs(sin(anim_time * 9.0)) * 10.0
			visual_root.rotation = sin(anim_time * 6.0) * 0.08

func _trigger_blink() -> void:
	if not eyes_sprite or is_blinking or current_state == State.PANIC_FALLING or current_idle_action == IdleAction.SLEEPY_NAP or current_state == State.PINNED_UNDER_DEBRIS:
		return
	is_blinking = true
	var blink = create_tween()
	blink.tween_property(eyes_sprite, "scale:y", 0.05, 0.06)
	blink.tween_property(eyes_sprite, "scale:y", 1.0, 0.07)
	await blink.finished
	is_blinking = false

func _pop_emote(tex: Texture2D, duration: float = 0.8) -> void:
	if not emote_sprite or not tex or is_defeated: return

	_clear_emote()

	emote_sprite.texture = tex
	emote_sprite.visible = true
	emote_sprite.scale = Vector2.ZERO
	emote_sprite.modulate = Color(1, 1, 1, 1)
	emote_sprite.position = Vector2.ZERO

	active_emote_tween = create_tween()
	active_emote_tween.tween_property(emote_sprite, "scale", Vector2(0.24, 0.24), 0.15).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	active_emote_tween.parallel().tween_property(emote_sprite, "position:y", -10.0, duration)
	active_emote_tween.tween_property(emote_sprite, "modulate:a", 0.0, 0.18).set_delay(max(0.05, duration - 0.18))
	active_emote_tween.tween_callback(func(): emote_sprite.visible = false)

func _on_nearby_enemy_defeated(dead_enemy: Node, _pts: int) -> void:
	if is_defeated or dead_enemy == self: return
	if global_position.distance_to(dead_enemy.global_position) < 190.0:
		shock_timer = 1.2
		_set_state(State.SHOCKED_BY_NEIGHBOR)

func _on_impact(body: Node) -> void:
	if is_defeated or spawn_settle_timer > 0.0: return
	if not is_awake: wake_up()

	if body is RigidBody2D:
		var rel_vel = (linear_velocity - body.linear_velocity).length()
		if rel_vel > 95.0:
			var crush_dmg = (rel_vel - 95.0) * (body.mass * 0.65) + 25.0
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
			furious_timer = 1.5
			_set_state(State.FURIOUS_ARMOR_LOSS)

	current_health -= amount

	if current_health > 0.0 and current_health <= max_health * 0.45 and not is_currently_pinned:
		_set_state(State.CRITICAL_INJURED)

	if visual_root:
		var tween = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
		visual_root.scale = Vector2(base_scale_val * 1.4, base_scale_val * 0.6)
		tween.tween_property(visual_root, "scale", Vector2(base_scale_val, base_scale_val), 0.28)

	var flash_tween = create_tween()
	flash_tween.tween_property(visual_root, "modulate", Color(1.0, 0.35, 0.35), 0.05)
	flash_tween.tween_property(visual_root, "modulate", Color.WHITE, 0.08)

	CameraShake.add_trauma(0.35 if monster_type == "boss_baron_pig" else 0.16)

	if current_health <= 0.0:
		_defeat_monster()

func _pop_off_helmet() -> void:
	if not helmet_sprite: return
	var h = helmet_sprite
	helmet_sprite = null
	var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(h, "position:y", h.position.y - 50.0, 0.32)
	tween.tween_property(h, "rotation", 2.2, 0.32)
	tween.tween_property(h, "modulate:a", 0.0, 0.32)
	await tween.finished
	h.queue_free()

func _on_player_failed_taunt() -> void:
	if is_defeated: return
	_set_state(State.VICTORY_TAUNT)

func _defeat_monster() -> void:
	if is_defeated: return
	is_defeated = true
	current_state = State.DEFEATED
	_clear_emote()

	if has_node("/root/GameManager"):
		get_node("/root/GameManager").register_enemy_defeat(self, score_value)
	CameraShake.add_trauma(0.55 if monster_type == "boss_baron_pig" else 0.22)

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	if eyes_sprite and char_tex_eyes_dizzy:
		eyes_sprite.texture = char_tex_eyes_dizzy
	if pupils_sprite:
		pupils_sprite.visible = false

	if dizzy_stars:
		dizzy_stars.visible = true
		var star_tween = create_tween().set_loops(2)
		star_tween.tween_property(dizzy_stars, "rotation", TAU, 0.3)

	if visual_root:
		var flat_tween = create_tween().set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
		flat_tween.tween_property(visual_root, "scale", Vector2(base_scale_val * 1.55, base_scale_val * 0.12), 0.16)

	await get_tree().create_timer(0.38).timeout

	if poof_fx:
		poof_fx.restart()
		poof_fx.emitting = true

	if visual_root: visual_root.visible = false
	await get_tree().create_timer(0.35).timeout
	queue_free()
