extends Area2D
class_name CongaMannequin2D

## CongaMannequin2D.gd
## Hình nhân ma-nơ-canh 2D: Tự do đứng hoặc nối đuôi tạo thành cây roi khổng lồ

enum MannequinState {
	FREE,
	LINKED,
	SCATTERED
}

@export var custom_texture: Texture2D = null

var state: MannequinState = MannequinState.FREE
var owner_player: Node2D = null
var follow_target: Node2D = null
var team_color: Color = Color(0.95, 0.95, 0.95) # Trắng khi tự do

var current_team_id: int = 0
var wander_dir: Vector2 = Vector2.ZERO
var wander_timer: float = 0.0
var jiggle_anim: float = 0.0
var scatter_velocity: Vector2 = Vector2.ZERO

const FOLLOW_DISTANCE = 32.0

func _ready() -> void:
	add_to_group("mannequins")
	var col = CollisionShape2D.new()
	var shape = CircleShape2D.new()
	shape.radius = 18.0
	col.shape = shape
	add_child(col)
	
	wander_dir = Vector2.RIGHT.rotated(randf() * TAU)
	wander_timer = randf_range(1.0, 3.0)

func _physics_process(delta: float) -> void:
	jiggle_anim += delta * 12.0
	
	match state:
		MannequinState.FREE:
			# Đi lang thang ngơ ngác trong sân
			wander_timer -= delta
			if wander_timer <= 0:
				wander_dir = Vector2.RIGHT.rotated(randf() * TAU)
				wander_timer = randf_range(1.5, 3.5)
			global_position += wander_dir * 35.0 * delta
			# Giới hạn trong sân
			global_position.x = clamp(global_position.x, -580, 580)
			global_position.y = clamp(global_position.y, -320, 320)
			
		MannequinState.LINKED:
			# Bám theo mắt xích phía trước (Verlet constraint)
			if follow_target and is_instance_valid(follow_target):
				var diff = follow_target.global_position - global_position
				var dist = diff.length()
				if dist > FOLLOW_DISTANCE:
					var target_pos = follow_target.global_position - diff.normalized() * FOLLOW_DISTANCE
					global_position = global_position.lerp(target_pos, 18.0 * delta)
					rotation = lerp_angle(rotation, diff.angle(), 14.0 * delta)
			else:
				# Mất mục tiêu thì thành tự do
				detach()
				
		MannequinState.SCATTERED:
			# Bị quất văng ra
			global_position += scatter_velocity * delta
			scatter_velocity = scatter_velocity.move_toward(Vector2.ZERO, 400.0 * delta)
			if scatter_velocity.length() < 10.0:
				state = MannequinState.FREE

	queue_redraw()

func link_to(player: Node2D, target: Node2D, color: Color, team_id: int) -> void:
	state = MannequinState.LINKED
	owner_player = player
	follow_target = target
	team_color = color
	current_team_id = team_id
	CongaSoundManager.play_sfx("attach", randf_range(1.0, 1.3))
	scale = Vector2(1.3, 0.7)
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2.ONE, 0.2)

func detach() -> void:
	state = MannequinState.FREE
	owner_player = null
	follow_target = null
	team_color = Color(0.95, 0.95, 0.95)
	current_team_id = 0

func take_whip_scatter(impulse: Vector2) -> void:
	detach()
	state = MannequinState.SCATTERED
	scatter_velocity = impulse
	CongaSoundManager.play_sfx("whip_hit", randf_range(1.1, 1.4))

func _draw() -> void:
	if custom_texture:
		var size = custom_texture.get_size()
		draw_texture_rect(custom_texture, Rect2(-size.x * 0.5, -size.y * 0.5, size.x, size.y), false)
		return

	# Bóng mờ
	draw_circle(Vector2(0, 4), 14.0, Color(0, 0, 0, 0.25))

	# Dây nối sang mắt xích trước nếu đang LINKED
	if state == MannequinState.LINKED and follow_target and is_instance_valid(follow_target):
		var local_target = to_local(follow_target.global_position)
		draw_line(Vector2.ZERO, local_target, team_color, 4.0)

	# Thân hình nhân tròn xoe
	var body_color = team_color
	draw_circle(Vector2.ZERO, 16.0, body_color)
	draw_arc(Vector2.ZERO, 16.0, 0, TAU, 32, Color.BLACK, 2.0)

	# Khuôn mặt ngộ nghĩnh
	if state == MannequinState.LINKED:
		# Mắt híp vui vẻ vì được kéo đi chơi
		draw_line(Vector2(-7, -4), Vector2(-2, -4), Color.BLACK, 2.5)
		draw_line(Vector2(2, -4), Vector2(7, -4), Color.BLACK, 2.5)
		# Miệng cười
		draw_arc(Vector2(0, 2), 5.0, 0.2, PI - 0.2, 16, Color.BLACK, 2.0)
	else:
		# Mắt tròn ngơ ngác
		draw_circle(Vector2(-5, -4), 3.0, Color.BLACK)
		draw_circle(Vector2(5, -4), 3.0, Color.BLACK)
		draw_circle(Vector2(0, 4), 2.5, Color.BLACK) # Miệng chữ O ngơ ngác
