extends CharacterBody2D
class_name CongaPlayer2D

## CongaPlayer2D.gd
## Người chơi gà chiến 2D: Kéo đoàn hình nhân làm roi quất và tát bay đối thủ

@export var player_id: int = 1 # 1: Đỏ, 2: Xanh, 3: Vàng, 4: Xanh Lá
@export var is_ai: bool = false
@export var custom_texture: Texture2D = null

var team_color: Color = Color.RED
var base_speed: float = 230.0
var dash_speed: float = 580.0
var is_dashing: bool = false
var dash_timer: float = 0.0
var dash_cooldown: float = 0.0
var stun_timer: float = 0.0

var facing_dir: Vector2 = Vector2.RIGHT
var walk_anim: float = 0.0
var my_chain: Array[CongaMannequin2D] = []

func _ready() -> void:
	add_to_group("players")
	team_color = CongaGameManager.TEAM_COLORS[player_id - 1]
	
	var col = CollisionShape2D.new()
	var shape = CircleShape2D.new()
	shape.radius = 20.0
	col.shape = shape
	add_child(col)

func _physics_process(delta: float) -> void:
	if dash_cooldown > 0: dash_cooldown -= delta
	
	# Xử lý choáng khi bị roi quất trúng
	if stun_timer > 0:
		stun_timer -= delta
		rotation += delta * 20.0
		velocity = velocity.move_toward(Vector2.ZERO, 500.0 * delta)
		move_and_slide()
		queue_redraw()
		return

	# Xử lý lướt
	if is_dashing:
		dash_timer -= delta
		velocity = facing_dir * dash_speed
		if dash_timer <= 0:
			is_dashing = false
	else:
		var input_vec = Vector2.ZERO
		if is_ai:
			input_vec = _get_ai_input()
		else:
			input_vec = _get_human_input()
			
		if input_vec.length() > 0.1:
			facing_dir = input_vec.normalized()
			walk_anim += delta * 14.0
			# Tốc độ giảm nhẹ khi kéo đoàn tàu quá dài
			var current_speed = max(140.0, base_speed - my_chain.size() * 3.5)
			velocity = facing_dir * current_speed
		else:
			velocity = velocity.move_toward(Vector2.ZERO, 800.0 * delta)
			walk_anim = 0.0

	move_and_slide()
	
	# Giới hạn trong sàn đấu
	global_position.x = clamp(global_position.x, -580, 580)
	global_position.y = clamp(global_position.y, -320, 320)
	
	# Kiểm tra va chạm với hình nhân và người chơi khác
	_check_collisions()
	
	queue_redraw()

func _get_human_input() -> Vector2:
	var prefix = "p%d_" % player_id
	var vec = Vector2.ZERO
	if Input.is_action_pressed(prefix + "right"): vec.x += 1
	if Input.is_action_pressed(prefix + "left"): vec.x -= 1
	if Input.is_action_pressed(prefix + "down"): vec.y += 1
	if Input.is_action_pressed(prefix + "up"): vec.y -= 1
	
	if Input.is_action_just_pressed(prefix + "dash"):
		trigger_dash()
		
	return vec

func _get_ai_input() -> Vector2:
	# Bot AI: Tìm hình nhân tự do gần nhất
	var target = _find_nearest_free_mannequin()
	if target:
		var diff = target.global_position - global_position
		if diff.length() < 120.0 and dash_cooldown <= 0:
			trigger_dash()
		return diff.normalized()
	return Vector2.ZERO

func _find_nearest_free_mannequin() -> Node2D:
	var dummies = get_tree().get_nodes_in_group("mannequins")
	var nearest: Node2D = null
	var min_d = 9999.0
	for d in dummies:
		if d is CongaMannequin2D and d.state == CongaMannequin2D.MannequinState.FREE:
			var dist = global_position.distance_to(d.global_position)
			if dist < min_d:
				min_d = dist
				nearest = d
	return nearest

func trigger_dash() -> void:
	if dash_cooldown > 0 or is_dashing: return
	is_dashing = true
	dash_timer = 0.25
	dash_cooldown = 1.0
	CongaSoundManager.play_sfx("dash", randf_range(1.0, 1.2))
	
	# Quất mạnh toàn bộ mắt xích
	for m in my_chain:
		if is_instance_valid(m):
			m.scale = Vector2(1.4, 0.7)
			var tw = create_tween()
			tw.tween_property(m, "scale", Vector2.ONE, 0.25)

func _check_collisions() -> void:
	var dummies = get_tree().get_nodes_in_group("mannequins")
	for d in dummies:
		if d is CongaMannequin2D:
			var dist = global_position.distance_to(d.global_position)
			# Chạm hình nhân tự do -> Nối đuôi!
			if dist < 38.0 and d.state == CongaMannequin2D.MannequinState.FREE:
				attach_mannequin(d)
			# Nếu đang DASH và cắt qua chuỗi của đối thủ -> Cắt đứt và cướp hình nhân!
			elif is_dashing and dist < 42.0 and d.state == CongaMannequin2D.MannequinState.LINKED and d.owner_player != self:
				_cut_opponent_chain(d)

func attach_mannequin(dummy: CongaMannequin2D) -> void:
	var target_node: Node2D = self
	if not my_chain.is_empty():
		target_node = my_chain.back()
		
	my_chain.append(dummy)
	dummy.link_to(self, target_node, team_color, player_id)
	CongaGameManager.update_chain_length(player_id, my_chain.size())

func _cut_opponent_chain(hit_dummy: CongaMannequin2D) -> void:
	var opp = hit_dummy.owner_player as CongaPlayer2D
	if not opp: return
	
	CongaSoundManager.play_sfx("steal", 1.2)
	CongaGameManager.register_whip_hit(player_id)
	
	# Tìm vị trí mắt xích bị cắt
	var cut_idx = opp.my_chain.find(hit_dummy)
	if cut_idx != -1:
		var detached = opp.my_chain.slice(cut_idx)
		opp.my_chain = opp.my_chain.slice(0, cut_idx)
		CongaGameManager.update_chain_length(opp.player_id, opp.my_chain.size())
		
		# Quất văng các hình nhân bị đứt
		for m in detached:
			if is_instance_valid(m):
				var throw_dir = (m.global_position - global_position).normalized()
				m.take_whip_scatter(throw_dir * 380.0)

func take_whip_stun(impulse: Vector2) -> void:
	stun_timer = 0.7
	velocity = impulse
	CongaSoundManager.play_sfx("bonk", 1.0)
	
	# Rơi một nửa số hình nhân
	if my_chain.size() > 2:
		var drop_count = my_chain.size() / 2
		for i in range(drop_count):
			var m = my_chain.pop_back()
			if is_instance_valid(m):
				m.take_whip_scatter(Vector2.RIGHT.rotated(randf() * TAU) * 250.0)
		CongaGameManager.update_chain_length(player_id, my_chain.size())

func clear_chain_for_banking() -> int:
	var count = my_chain.size()
	for m in my_chain:
		if is_instance_valid(m):
			# Hiệu ứng nổ pháo hoa và tái sinh vị trí mới
			m.detach()
			m.global_position = Vector2(randf_range(-500, 500), randf_range(-280, 280))
	my_chain.clear()
	CongaGameManager.update_chain_length(player_id, 0)
	return count

func _draw() -> void:
	var flip = -1.0 if facing_dir.x < 0 else 1.0
	var bob = sin(walk_anim) * 3.0

	if custom_texture:
		var size = custom_texture.get_size()
		draw_texture_rect(custom_texture, Rect2(-size.x * 0.5 * flip, -size.y * 0.5, size.x * flip, size.y), false)
		return

	# Bóng
	draw_circle(Vector2(0, 6), 18.0, Color(0, 0, 0, 0.25))

	# Vệt sơn lướt khi Dash
	if is_dashing:
		draw_circle(-facing_dir * 18.0, 16.0, team_color * Color(1, 1, 1, 0.4))
		draw_circle(-facing_dir * 32.0, 10.0, team_color * Color(1, 1, 1, 0.2))

	# Thân chú gà tròn mập màu trắng ngà
	draw_circle(Vector2(0, bob), 20.0, Color(0.96, 0.96, 0.98))
	draw_arc(Vector2(0, bob), 20.0, 0, TAU, 32, Color(0.2, 0.2, 0.25), 2.5)

	# Băng đô đội màu (Team Headband)
	draw_arc(Vector2(0, -6 + bob), 19.0, -2.5, -0.6, 16, team_color, 7.0)

	# Mào gà đỏ
	draw_circle(Vector2(2 * flip, -22 + bob), 6.0, Color(0.95, 0.2, 0.2))

	# Mỏ vàng nhọn
	var beak_pts = PackedVector2Array([
		Vector2(16 * flip, -4 + bob),
		Vector2(28 * flip, 0 + bob),
		Vector2(16 * flip, 6 + bob)
	])
	draw_colored_polygon(beak_pts, Color(1.0, 0.8, 0.1))

	# Mắt to tròn nhìn theo hướng di chuyển
	var eye_offset = facing_dir * 4.0
	draw_circle(Vector2(8 * flip, -6 + bob), 5.5, Color.WHITE)
	draw_circle(Vector2(8 * flip + eye_offset.x, -6 + bob + eye_offset.y), 2.8, Color.BLACK)
