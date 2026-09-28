extends Node2D

const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

# Nodes
var bg_sky: Sprite2D
var bg_cavern: Sprite2D
var camera: Camera2D
var chicken_node: Node2D
var chicken_body: Sprite2D
var chicken_basket: Sprite2D
var chicken_left_wing: Sprite2D
var chicken_right_wing: Sprite2D
var loaded_egg_sprite: Sprite2D
var aim_line: Line2D

# Bunker Blocks
var bunker_container: Node2D
var monster_sprite: Sprite2D
var monster_label: Label

# UI / Overlay
var top_banner_panel: PanelContainer
var top_headline: Label
var subtitle_badge: Label
var stamp_label: Label
var victory_modal_node: PanelContainer
var cta_button: Button
var stars_container: HBoxContainer
var star_nodes: Array[TextureRect] = []

# Audio Players
var bgm_player: AudioStreamPlayer
var sfx_player1: AudioStreamPlayer
var sfx_player2: AudioStreamPlayer
var sfx_player3: AudioStreamPlayer

# Cache WAV streams
var wavs: Dictionary = {}

var elapsed_time: float = 0.0
var camera_shake_trauma: float = 0.0

# State flags
var fired_attempt_1: bool = false
var hit_attempt_1: bool = false
var fail_stamp_shown: bool = false
var transition_to_p2: bool = false
var fired_attempt_2: bool = false
var hit_attempt_2: bool = false
var supernova_exploded: bool = false
var victory_shown: bool = false
var star1_shown: bool = false
var star2_shown: bool = false
var star3_shown: bool = false
var cta_shown: bool = false

var active_projectile: Sprite2D = null
var projectile_vel: Vector2 = Vector2.ZERO
var projectile_target: Vector2 = Vector2.ZERO
var vortex_active: bool = false
var vortex_center: Vector2 = Vector2(270, 680)

func _ready() -> void:
	_init_audio()
	_build_scene_hierarchy()
	_start_bgm()

func _init_audio() -> void:
	bgm_player = AudioStreamPlayer.new()
	add_child(bgm_player)
	sfx_player1 = AudioStreamPlayer.new()
	add_child(sfx_player1)
	sfx_player2 = AudioStreamPlayer.new()
	add_child(sfx_player2)
	sfx_player3 = AudioStreamPlayer.new()
	add_child(sfx_player3)

	var sound_files = {
		"bgm": "res://assets/audio/cartoon_bunker_bgm.wav",
		"cluck": "res://assets/audio/chicken_cluck.wav",
		"whoosh": "res://assets/audio/whoosh.wav",
		"bounce": "res://assets/audio/egg_bounce.wav",
		"crack": "res://assets/audio/egg_crack.wav",
		"ouch": "res://assets/audio/monster_ouch.wav",
		"vortex": "res://assets/audio/blackhole_vortex.wav",
		"explosion": "res://assets/audio/explosion_cartoon.wav",
		"victory": "res://assets/audio/victory_fanfare.wav",
		"chime": "res://assets/audio/star_chime.wav",
		"coin": "res://assets/audio/coin_pickup.wav"
	}
	for k in sound_files:
		var p = sound_files[k]
		if ResourceLoader.exists(p):
			wavs[k] = load(p)

func _play_sfx(sound_key: String, pitch: float = 1.0, vol: float = 0.0) -> void:
	if not wavs.has(sound_key): return
	var stream = wavs[sound_key]
	var player = sfx_player1
	if not player.playing:
		pass
	elif not sfx_player2.playing:
		player = sfx_player2
	else:
		player = sfx_player3
	player.stream = stream
	player.pitch_scale = pitch
	player.volume_db = vol
	player.play()

func _start_bgm() -> void:
	if wavs.has("bgm"):
		bgm_player.stream = wavs["bgm"]
		bgm_player.volume_db = -6.0
		bgm_player.play()

func _build_scene_hierarchy() -> void:
	# Camera
	camera = Camera2D.new()
	camera.position = Vector2(270, 480)
	add_child(camera)

	# Background Sky & Cavern
	var bg_root = Node2D.new()
	add_child(bg_root)

	var color_bg = ColorRect.new()
	color_bg.size = Vector2(540, 960)
	color_bg.color = Color(0.12, 0.06, 0.22)
	bg_root.add_child(color_bg)

	bg_sky = Sprite2D.new()
	var t_sky = ParticleHelper._safe_load("res://assets/sprites/environment/sky_clouds_panorama.svg")
	if t_sky:
		bg_sky.texture = t_sky
		bg_sky.position = Vector2(270, 200)
		bg_sky.modulate = Color(0.85, 0.75, 0.95, 0.8)
		bg_root.add_child(bg_sky)

	bg_cavern = Sprite2D.new()
	var t_cav = ParticleHelper._safe_load("res://assets/sprites/environment/cavern_backdrop_dungeon.svg")
	if t_cav:
		bg_cavern.texture = t_cav
		bg_cavern.position = Vector2(270, 640)
		bg_cavern.modulate = Color(0.9, 0.85, 1.0, 0.9)
		bg_root.add_child(bg_cavern)

	# Bunker Structure Container
	bunker_container = Node2D.new()
	add_child(bunker_container)
	_build_bunker_blocks()

	# Chicken Bomber
	_build_chicken()

	# Trajectory Aim Line
	aim_line = Line2D.new()
	aim_line.width = 4.0
	aim_line.default_color = Color(1.0, 0.85, 0.2, 0.8)
	aim_line.visible = false
	add_child(aim_line)

	# UI Overlay
	_build_ui_overlay()

func _build_bunker_blocks() -> void:
	var t_stone = ParticleHelper._safe_load("res://assets/sprites/destructibles/block_stone.svg")
	var t_wood = ParticleHelper._safe_load("res://assets/sprites/destructibles/block_wood.svg")

	# Base Bedrock slab
	var base_slab = Sprite2D.new()
	base_slab.texture = t_stone
	base_slab.scale = Vector2(6.5, 0.8)
	base_slab.position = Vector2(270, 830)
	bunker_container.add_child(base_slab)

	# Left Pillar
	var p_left = Sprite2D.new()
	p_left.texture = t_stone
	p_left.scale = Vector2(1.0, 3.2)
	p_left.position = Vector2(185, 720)
	bunker_container.add_child(p_left)

	# Right Pillar
	var p_right = Sprite2D.new()
	p_right.texture = t_stone
	p_right.scale = Vector2(1.0, 3.2)
	p_right.position = Vector2(355, 720)
	bunker_container.add_child(p_right)

	# Heavy Stone Lintel Beam across top
	var lintel = Sprite2D.new()
	lintel.texture = t_stone
	lintel.scale = Vector2(4.8, 0.9)
	lintel.position = Vector2(270, 615)
	bunker_container.add_child(lintel)

	# Upper Wooden Roof Trusses
	var r_left = Sprite2D.new()
	r_left.texture = t_wood
	r_left.scale = Vector2(2.4, 0.6)
	r_left.position = Vector2(220, 575)
	r_left.rotation = -0.22
	bunker_container.add_child(r_left)

	var r_right = Sprite2D.new()
	r_right.texture = t_wood
	r_right.scale = Vector2(2.4, 0.6)
	r_right.position = Vector2(320, 575)
	r_right.rotation = 0.22
	bunker_container.add_child(r_right)

	# Monster Sly Fox inside cage
	monster_sprite = Sprite2D.new()
	var t_monster = ParticleHelper._safe_load("res://assets/sprites/enemies/bunker_monster_sly_fox.svg")
	if t_monster:
		monster_sprite.texture = t_monster
		monster_sprite.scale = Vector2(0.9, 0.9)
		monster_sprite.position = Vector2(270, 745)
		bunker_container.add_child(monster_sprite)

	# Monster dialogue bubble
	monster_label = Label.new()
	monster_label.text = "HAHAHA! 😈"
	monster_label.add_theme_font_size_override("font_size", 14)
	monster_label.add_theme_color_override("font_color", Color(1.0, 0.95, 0.2))
	monster_label.add_theme_color_override("font_outline_color", Color.BLACK)
	monster_label.add_theme_constant_override("outline_size", 4)
	monster_label.position = Vector2(225, 680)
	monster_label.visible = false
	bunker_container.add_child(monster_label)

func _build_chicken() -> void:
	chicken_node = Node2D.new()
	chicken_node.position = Vector2(270, 140)
	add_child(chicken_node)

	chicken_body = Sprite2D.new()
	var tb = ParticleHelper._safe_load("res://assets/sprites/player/chicken_aviator_body.svg")
	if tb: chicken_body.texture = tb
	chicken_node.add_child(chicken_body)

	chicken_left_wing = Sprite2D.new()
	var tw = ParticleHelper._safe_load("res://assets/sprites/player/chicken_wing_flap.svg")
	if tw:
		chicken_left_wing.texture = tw
		chicken_left_wing.position = Vector2(-28, -2)
		chicken_node.add_child(chicken_left_wing)

	chicken_right_wing = Sprite2D.new()
	if tw:
		chicken_right_wing.texture = tw
		chicken_right_wing.position = Vector2(28, -2)
		chicken_right_wing.scale.x = -1.0
		chicken_node.add_child(chicken_right_wing)

	chicken_basket = Sprite2D.new()
	var tk = ParticleHelper._safe_load("res://assets/sprites/player/chicken_basket_wicker.svg")
	if tk:
		chicken_basket.texture = tk
		chicken_basket.position = Vector2(0, 16)
		chicken_node.add_child(chicken_basket)

	loaded_egg_sprite = Sprite2D.new()
	var te = ParticleHelper._safe_load("res://assets/sprites/projectiles/egg_normal.svg")
	if te:
		loaded_egg_sprite.texture = te
		loaded_egg_sprite.position = Vector2(0, -6)
		loaded_egg_sprite.scale = Vector2(0.85, 0.85)
		chicken_basket.add_child(loaded_egg_sprite)

func _build_ui_overlay() -> void:
	var canvas = CanvasLayer.new()
	add_child(canvas)

	# 1. Top Bar Frame
	top_banner_panel = PanelContainer.new()
	top_banner_panel.set_anchors_preset(Control.PRESET_TOP_WIDE)
	top_banner_panel.offset_left = 16.0
	top_banner_panel.offset_top = 18.0
	top_banner_panel.offset_right = -16.0
	top_banner_panel.offset_bottom = 84.0
	var sb_top = StyleBoxFlat.new()
	sb_top.bg_color = Color(0.24, 0.14, 0.08, 0.95)
	sb_top.border_width_bottom = 4
	sb_top.border_width_left = 2
	sb_top.border_width_right = 2
	sb_top.border_width_top = 2
	sb_top.border_color = Color(0.65, 0.45, 0.20, 1.0)
	sb_top.corner_radius_top_left = 14
	sb_top.corner_radius_top_right = 14
	sb_top.corner_radius_bottom_right = 14
	sb_top.corner_radius_bottom_left = 14
	top_banner_panel.add_theme_stylebox_override("panel", sb_top)
	canvas.add_child(top_banner_panel)

	var vb_top = VBoxContainer.new()
	vb_top.alignment = BoxContainer.ALIGNMENT_CENTER
	top_banner_panel.add_child(vb_top)

	top_headline = Label.new()
	top_headline.text = "CAN YOU BEAT LEVEL 20? 😱"
	top_headline.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	top_headline.add_theme_font_size_override("font_size", 18)
	top_headline.add_theme_color_override("font_color", Color(1.0, 0.92, 0.35))
	top_headline.add_theme_color_override("font_outline_color", Color(0.18, 0.08, 0.02))
	top_headline.add_theme_constant_override("outline_size", 5)
	vb_top.add_child(top_headline)

	subtitle_badge = Label.new()
	subtitle_badge.text = "ATTEMPT 1: NORMAL EGG 🥚"
	subtitle_badge.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	subtitle_badge.add_theme_font_size_override("font_size", 13)
	subtitle_badge.add_theme_color_override("font_color", Color(1.0, 0.95, 0.85))
	subtitle_badge.add_theme_color_override("font_outline_color", Color.BLACK)
	subtitle_badge.add_theme_constant_override("outline_size", 4)
	vb_top.add_child(subtitle_badge)

	# 2. Big FAIL Stamp Label
	stamp_label = Label.new()
	stamp_label.text = "FAIL! ❌"
	stamp_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	stamp_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	stamp_label.add_theme_font_size_override("font_size", 64)
	stamp_label.add_theme_color_override("font_color", Color(1.0, 0.2, 0.2))
	stamp_label.add_theme_color_override("font_outline_color", Color(0.2, 0.0, 0.0))
	stamp_label.add_theme_constant_override("outline_size", 10)
	stamp_label.position = Vector2(130, 420)
	stamp_label.scale = Vector2(0.1, 0.1)
	stamp_label.pivot_offset = Vector2(140, 45)
	stamp_label.visible = false
	canvas.add_child(stamp_label)

	# 3. Victory Modal
	victory_modal_node = PanelContainer.new()
	victory_modal_node.custom_minimum_size = Vector2(440, 240)
	victory_modal_node.position = Vector2(50, 360)
	var sb_vic = StyleBoxFlat.new()
	sb_vic.bg_color = Color(0.22, 0.12, 0.06, 0.98)
	sb_vic.border_width_bottom = 5
	sb_vic.border_width_left = 3
	sb_vic.border_width_right = 3
	sb_vic.border_width_top = 3
	sb_vic.border_color = Color(1.0, 0.85, 0.3)
	sb_vic.corner_radius_top_left = 18
	sb_vic.corner_radius_top_right = 18
	sb_vic.corner_radius_bottom_right = 18
	sb_vic.corner_radius_bottom_left = 18
	victory_modal_node.add_theme_stylebox_override("panel", sb_vic)
	victory_modal_node.visible = false
	canvas.add_child(victory_modal_node)

	var vb_vic = VBoxContainer.new()
	vb_vic.alignment = BoxContainer.ALIGNMENT_CENTER
	vb_vic.add_theme_constant_override("separation", 14)
	victory_modal_node.add_child(vb_vic)

	var vic_title = Label.new()
	vic_title.text = "🏆 BUNKER DESTROYED! 🏆"
	vic_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vic_title.add_theme_font_size_override("font_size", 22)
	vic_title.add_theme_color_override("font_color", Color(1.0, 0.95, 0.4))
	vic_title.add_theme_color_override("font_outline_color", Color(0.2, 0.08, 0.02))
	vic_title.add_theme_constant_override("outline_size", 6)
	vb_vic.add_child(vic_title)

	stars_container = HBoxContainer.new()
	stars_container.alignment = BoxContainer.ALIGNMENT_CENTER
	stars_container.add_theme_constant_override("separation", 24)
	vb_vic.add_child(stars_container)

	var t_star = ParticleHelper._safe_load("res://assets/ui/icons/icon_star.svg")
	for i in range(3):
		var star_rect = TextureRect.new()
		star_rect.custom_minimum_size = Vector2(54, 54)
		star_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		star_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		star_rect.texture = t_star
		star_rect.scale = Vector2(0.1, 0.1)
		star_rect.pivot_offset = Vector2(27, 27)
		star_rect.visible = false
		stars_container.add_child(star_rect)
		star_nodes.append(star_rect)

	# 4. CTA Button
	cta_button = Button.new()
	cta_button.custom_minimum_size = Vector2(360, 68)
	cta_button.position = Vector2(90, 840)
	cta_button.text = "▶ PLAY FREE NOW 📲"
	cta_button.add_theme_font_size_override("font_size", 20)
	var sb_cta = StyleBoxFlat.new()
	sb_cta.bg_color = Color(0.15, 0.72, 0.35, 1.0)
	sb_cta.border_width_bottom = 5
	sb_cta.border_width_left = 2
	sb_cta.border_width_right = 2
	sb_cta.border_width_top = 2
	sb_cta.border_color = Color(0.5, 1.0, 0.6)
	sb_cta.corner_radius_top_left = 16
	sb_cta.corner_radius_top_right = 16
	sb_cta.corner_radius_bottom_right = 16
	sb_cta.corner_radius_bottom_left = 16
	cta_button.add_theme_stylebox_override("normal", sb_cta)
	cta_button.add_theme_color_override("font_color", Color.WHITE)
	cta_button.add_theme_color_override("font_outline_color", Color(0.05, 0.3, 0.1))
	cta_button.add_theme_constant_override("outline_size", 6)
	cta_button.pivot_offset = Vector2(180, 34)
	cta_button.visible = false
	canvas.add_child(cta_button)

func _process(delta: float) -> void:
	elapsed_time += delta

	# Camera Shake
	if camera_shake_trauma > 0.0:
		camera_shake_trauma = max(0.0, camera_shake_trauma - delta * 1.5)
		camera.offset = Vector2(
			randf_range(-1.0, 1.0) * camera_shake_trauma * 24.0,
			randf_range(-1.0, 1.0) * camera_shake_trauma * 24.0
		)
	else:
		camera.offset = Vector2.ZERO

	# Chicken Wing Flap & Float
	if chicken_left_wing and chicken_right_wing:
		var flap = sin(elapsed_time * 10.0) * 0.35
		chicken_left_wing.rotation = flap
		chicken_right_wing.rotation = -flap
		chicken_node.position.y = 140.0 + sin(elapsed_time * 4.0) * 6.0

	# Headline pulsing
	if top_headline:
		top_headline.scale = Vector2.ONE * (1.0 + sin(elapsed_time * 5.0) * 0.04)

	# Projectile Movement
	if active_projectile and active_projectile.visible:
		active_projectile.position += projectile_vel * delta
		active_projectile.rotation += 12.0 * delta

	# Black Hole Vortex suction
	if vortex_active:
		for child in bunker_container.get_children():
			if is_instance_valid(child) and child != monster_label:
				var dir = (vortex_center - child.position).normalized()
				var dist = child.position.distance_to(vortex_center)
				child.position = child.position.lerp(vortex_center, delta * 3.5)
				child.rotation += delta * 14.0
				child.scale = child.scale.lerp(Vector2.ZERO, delta * 2.2)

	_run_cinematic_timeline(delta)

func _run_cinematic_timeline(_delta: float) -> void:
	# =========================================================================
	# TIMELINE STAGE 1: Attempt 1 with Normal Egg (t = 0.0s -> 5.0s)
	# =========================================================================
	if elapsed_time >= 0.8 and not fired_attempt_1:
		fired_attempt_1 = true
		_play_sfx("cluck")
		# Aim line appears
		aim_line.visible = true
		aim_line.points = PackedVector2Array([Vector2(270, 150), Vector2(240, 600)])

	if elapsed_time >= 1.6 and active_projectile == null and not hit_attempt_1:
		aim_line.visible = false
		_play_sfx("whoosh")
		if loaded_egg_sprite: loaded_egg_sprite.visible = false

		active_projectile = Sprite2D.new()
		active_projectile.texture = ParticleHelper._safe_load("res://assets/sprites/projectiles/egg_normal.svg")
		active_projectile.position = Vector2(270, 160)
		active_projectile.scale = Vector2(1.0, 1.0)
		add_child(active_projectile)
		projectile_vel = Vector2(-25.0, 580.0)

	if elapsed_time >= 2.4 and not hit_attempt_1 and active_projectile:
		hit_attempt_1 = true
		_play_sfx("bounce")
		_play_sfx("crack")
		camera_shake_trauma = 0.25

		# Egg bounces away and breaks
		projectile_vel = Vector2(180.0, -160.0)
		ParticleHelper.spawn_egg_break_fx(self, active_projectile.position, "normal", false)
		ParticleHelper.spawn_comic_popup(self, Vector2(240, 580), "NO DAMAGE! 🚫", Color(1.0, 0.3, 0.3))

		# Monster laughs
		if monster_label:
			monster_label.visible = true
			_play_sfx("ouch", 1.2)

	if elapsed_time >= 3.6 and not fail_stamp_shown:
		fail_stamp_shown = true
		if active_projectile:
			active_projectile.queue_free()
			active_projectile = null

		# Slam FAIL Stamp
		stamp_label.visible = true
		var tw = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw.tween_property(stamp_label, "scale", Vector2.ONE, 0.25)
		_play_sfx("ouch", 0.7)

	# =========================================================================
	# TIMELINE STAGE 2: Secret Weapon - Black Hole Egg (t = 5.0s -> 10.0s)
	# =========================================================================
	if elapsed_time >= 5.0 and not transition_to_p2:
		transition_to_p2 = true
		stamp_label.visible = false
		if monster_label: monster_label.visible = false

		# Update Headline & Badge
		subtitle_badge.text = "ATTEMPT 2: BLACK HOLE EGG! 🌀🔥"
		subtitle_badge.add_theme_color_override("font_color", Color(0.9, 0.4, 1.0))
		_play_sfx("chime", 1.2)

		# Reload Chicken with glowing Black Hole Egg
		if loaded_egg_sprite:
			loaded_egg_sprite.texture = ParticleHelper._safe_load("res://assets/sprites/projectiles/egg_blackhole.svg")
			loaded_egg_sprite.visible = true
			loaded_egg_sprite.scale = Vector2(1.2, 1.2)

	if elapsed_time >= 6.2 and not fired_attempt_2:
		fired_attempt_2 = true
		if loaded_egg_sprite: loaded_egg_sprite.visible = false
		_play_sfx("whoosh", 1.1)

		active_projectile = Sprite2D.new()
		active_projectile.texture = ParticleHelper._safe_load("res://assets/sprites/projectiles/egg_blackhole.svg")
		active_projectile.position = Vector2(270, 160)
		active_projectile.scale = Vector2(1.3, 1.3)
		active_projectile.modulate = Color(1.2, 0.7, 1.4)
		add_child(active_projectile)
		projectile_vel = Vector2(0.0, 720.0)

	if elapsed_time >= 7.0 and not hit_attempt_2:
		hit_attempt_2 = true
		_play_sfx("vortex")
		camera_shake_trauma = 0.65
		vortex_active = true
		vortex_center = Vector2(270, 680)

		if active_projectile:
			active_projectile.queue_free()
			active_projectile = null

		# Spawn vortex expanding ring
		var ring = Sprite2D.new()
		ring.texture = ParticleHelper._safe_load("res://assets/sprites/vfx/ice_shockwave_ring.svg")
		ring.position = vortex_center
		ring.modulate = Color(0.85, 0.35, 1.0, 0.95)
		ring.scale = Vector2(0.2, 0.2)
		add_child(ring)

		var tw_ring = create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tw_ring.tween_property(ring, "scale", Vector2(4.5, 4.5), 1.8)
		tw_ring.parallel().tween_property(ring, "rotation", 6.28, 1.8)
		tw_ring.tween_callback(ring.queue_free)

		ParticleHelper.spawn_comic_popup(self, Vector2(270, 560), "SINGULARITY! 🌀", Color(0.85, 0.4, 1.0))

	if elapsed_time >= 8.8 and not supernova_exploded:
		supernova_exploded = true
		vortex_active = false
		_play_sfx("explosion", 0.95, 3.0)
		camera_shake_trauma = 1.0

		# Obliterate bunker blocks completely
		for child in bunker_container.get_children():
			child.queue_free()

		# Spawn massive cartoon explosion FX
		ParticleHelper.spawn_egg_break_fx(self, vortex_center, "bomb", false)
		ParticleHelper.spawn_comic_popup(self, Vector2(270, 620), "💥 OBLITERATED! +10,000", Color(1.0, 0.85, 0.2))

	# =========================================================================
	# TIMELINE STAGE 3: Victory & Call to Action (t = 10.0s -> 15.0s)
	# =========================================================================
	if elapsed_time >= 10.2 and not victory_shown:
		victory_shown = true
		_play_sfx("victory")

		# Confetti left and right
		ParticleHelper.spawn_confetti_burst(self, Vector2(60, 480), 36)
		ParticleHelper.spawn_confetti_burst(self, Vector2(480, 480), 36)

		# Victory modal bounce in
		victory_modal_node.visible = true
		victory_modal_node.scale = Vector2(0.2, 0.2)
		victory_modal_node.pivot_offset = victory_modal_node.size * 0.5
		var tw_v = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw_v.tween_property(victory_modal_node, "scale", Vector2.ONE, 0.35)

	# Staggered 3 Stars Pop
	if elapsed_time >= 11.0 and not star1_shown:
		star1_shown = true
		_pop_star(0, 1)

	if elapsed_time >= 11.6 and not star2_shown:
		star2_shown = true
		_pop_star(1, 2)

	if elapsed_time >= 12.2 and not star3_shown:
		star3_shown = true
		_pop_star(2, 3)
		ParticleHelper.spawn_confetti_burst(self, Vector2(270, 360), 40)

	# CTA Button
	if elapsed_time >= 12.8 and not cta_shown:
		cta_shown = true
		cta_button.visible = true
		cta_button.scale = Vector2(0.2, 0.2)
		var tw_c = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
		tw_c.tween_property(cta_button, "scale", Vector2.ONE, 0.45)
		_play_sfx("coin")

	# CTA Button Pulsing
	if cta_shown and is_instance_valid(cta_button):
		cta_button.scale = Vector2.ONE * (1.0 + sin(elapsed_time * 8.0) * 0.05)

	# Finish at 15.0s
	if elapsed_time >= 15.2:
		get_tree().quit(0)

func _pop_star(index: int, star_num: int) -> void:
	if index < star_nodes.size():
		var s = star_nodes[index]
		s.visible = true
		s.scale = Vector2(0.1, 0.1)
		var tw = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw.tween_property(s, "scale", Vector2.ONE, 0.28)
		_play_sfx("chime", 1.0 + float(star_num - 1) * 0.25, 2.0)
		ParticleHelper.spawn_star_pop(self, s.global_position + Vector2(27, 27))
