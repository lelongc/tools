extends Node3D

## SumoArena3D.gd
## Đấu trường Sumo Ragdoll 3D: Sàn đấu tròn lơ lửng, thanh gạt xoay tròn tử thần và 4 bục donut nảy bật
## Quản lý hiệu ứng hạt: Mưa pháo hoa Confetti chiến thắng & Vụ nổ hất văng (Ring Out Splash)

@onready var players_node: Node3D = $Players
@onready var sweeper: Node3D = $SweeperBeam3D

var confetti_particles: CPUParticles3D

func _ready() -> void:
	_configure_players()
	_setup_confetti()
	if SumoGameManager.has_signal("round_ended"):
		SumoGameManager.round_ended.connect(_on_round_ended)

func _setup_confetti() -> void:
	confetti_particles = CPUParticles3D.new()
	confetti_particles.name = "VictoryConfetti"
	confetti_particles.emitting = false
	confetti_particles.amount = 80
	confetti_particles.lifetime = 3.5
	confetti_particles.emission_shape = CPUParticles3D.EMISSION_SHAPE_BOX
	confetti_particles.emission_box_extents = Vector3(12.0, 1.0, 12.0)
	confetti_particles.direction = Vector3(0, -1, 0)
	confetti_particles.spread = 20.0
	confetti_particles.initial_velocity_min = 2.0
	confetti_particles.initial_velocity_max = 5.0
	confetti_particles.angular_velocity_min = -180.0
	confetti_particles.angular_velocity_max = 180.0
	confetti_particles.scale_amount_min = 0.4
	confetti_particles.scale_amount_max = 0.8
	
	var c_quad = QuadMesh.new()
	c_quad.size = Vector2(0.35, 0.35)
	var c_mat = StandardMaterial3D.new()
	c_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	c_mat.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	var c_tex = "res://assets/textures/particles/confetti.png"
	if ResourceLoader.exists(c_tex):
		c_mat.albedo_texture = load(c_tex)
	c_mat.vertex_color_use_as_albedo = true
	c_quad.material = c_mat
	confetti_particles.mesh = c_quad
	
	# Gradient màu sắc rực rỡ cho pháo hoa confetti
	var grad = Gradient.new()
	grad.colors = PackedColorArray([
		Color(1.0, 0.2, 0.4, 1.0),
		Color(0.2, 0.8, 1.0, 1.0),
		Color(1.0, 0.85, 0.1, 1.0),
		Color(0.3, 0.95, 0.4, 1.0),
		Color(0.9, 0.3, 0.9, 1.0)
	])
	confetti_particles.color_initial_ramp = grad
	confetti_particles.position = Vector3(0, 15.0, 0)
	add_child(confetti_particles)

func _on_round_ended(_winner_id: int, _summary: Dictionary) -> void:
	if confetti_particles:
		confetti_particles.restart()
		confetti_particles.emitting = true

func _configure_players() -> void:
	if SumoGameManager.current_mode == 0: # SOLO_SURVIVAL
		for i in range(4):
			var p = players_node.get_node_or_null("Player%d" % (i + 1))
			if p:
				p.visible = true
				p.set_physics_process(true)
				if i == 0:
					p.is_ai = false
				else:
					p.is_ai = true
	else: # PARTY_SUMO
		for i in range(4):
			var p = players_node.get_node_or_null("Player%d" % (i + 1))
			if p:
				var cfg = SumoGameManager.player_configs[i]
				if cfg == "off":
					p.visible = false
					p.set_physics_process(false)
					p.remove_from_group("sumo_players")
					p.remove_from_group("players")
				elif cfg == "ai":
					p.visible = true
					p.is_ai = true
					p.set_physics_process(true)
				else:
					p.visible = true
					p.is_ai = false
					p.set_physics_process(true)
