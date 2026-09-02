extends Node2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

const BlockScene = preload("res://scenes/prefabs/DestructibleBlock.tscn")
const TNTScene = preload("res://scenes/prefabs/TNTBarrel.tscn")
const NukeScene = preload("res://scenes/prefabs/NukeBarrel.tscn")
const EnemyScene = preload("res://scenes/prefabs/BunkerMonster.tscn")
const BoulderScene = preload("res://scenes/prefabs/RollingBoulder.tscn")
const RescueCageScene = preload("res://scenes/prefabs/RescueCage.tscn")
const UpdraftVentScene = preload("res://scenes/prefabs/UpdraftVent.tscn")

@export var level_id: int = 1
@export var intro_target_y: float = 640.0

@onready var bg_sky: Polygon2D = $Background/Sky
@onready var bg_dirt: Polygon2D = $Background/UndergroundDirt
@onready var bg_cavern: Polygon2D = $Background/CavernInterior
@onready var bunker_structure: Node2D = $BunkerStructure

func _ready() -> void:
	if GameManager.current_level > 0:
		level_id = GameManager.current_level

	_setup_level()

func _setup_level() -> void:
	var world_id = int((level_id - 1) / 15) + 1
	var egg_loadout: Array[String] = []

	# 1. Bảng màu mỹ thuật theo từng Thế Giới
	match world_id:
		1: # World 1: Farm Cavern (Nông trại đất đá)
			bg_sky.color = Color(0.48, 0.78, 0.96)
			bg_dirt.color = Color(0.32, 0.22, 0.15)
			bg_cavern.color = Color(0.18, 0.13, 0.09)
		2: # World 2: Stone Quarry (Mỏ đá hoàng hôn)
			bg_sky.color = Color(0.85, 0.62, 0.42)
			bg_dirt.color = Color(0.24, 0.2, 0.24)
			bg_cavern.color = Color(0.13, 0.11, 0.15)
		3: # World 3: Steampunk Industrial (Nhà máy khói độc)
			bg_sky.color = Color(0.65, 0.52, 0.35)
			bg_dirt.color = Color(0.2, 0.18, 0.22)
			bg_cavern.color = Color(0.09, 0.12, 0.14)
		4: # World 4: Lava Core Imperial (Hoàng cung nham thạch)
			bg_sky.color = Color(0.25, 0.1, 0.2)
			bg_dirt.color = Color(0.18, 0.06, 0.08)
			bg_cavern.color = Color(0.08, 0.03, 0.05)

	# 2. Quy mô công trình RỘNG LỚN & HOÀNH TRÁNG (440px -> 510px)
	var cavern_half_width = clamp(220.0 + (level_id * 0.6), 220.0, 255.0)
	var cavern_top_y = clamp(460.0 - (level_id * 2.8), 280.0, 460.0)
	intro_target_y = (885.0 + cavern_top_y) * 0.5

	var cx = 270.0
	var left_edge_x = cx - cavern_half_width
	var right_edge_x = cx + cavern_half_width

	# Cập nhật hình ảnh nền đồng bộ
	if bg_sky:
		bg_sky.polygon = PackedVector2Array([
			Vector2(0, 0), Vector2(540, 0),
			Vector2(540, cavern_top_y), Vector2(0, cavern_top_y)
		])
	if bg_dirt:
		bg_dirt.polygon = PackedVector2Array([
			Vector2(0, cavern_top_y), Vector2(540, cavern_top_y),
			Vector2(540, 960), Vector2(0, 960)
		])
	if bg_cavern:
		bg_cavern.polygon = PackedVector2Array([
			Vector2(left_edge_x, cavern_top_y),
			Vector2(right_edge_x, cavern_top_y),
			Vector2(right_edge_x, 895),
			Vector2(left_edge_x, 895)
		])

	# Cập nhật ranh giới vật lý (Hoàn toàn thông suốt không bị vướng miệng hang)
	var col_wall_l = get_node_or_null("BunkerBoundaries/ColWallL")
	var col_wall_r = get_node_or_null("BunkerBoundaries/ColWallR")
	var col_floor = get_node_or_null("BunkerBoundaries/ColFloor")
	var col_ledge_l = get_node_or_null("BunkerBoundaries/ColLedgeL")
	var col_ledge_r = get_node_or_null("BunkerBoundaries/ColLedgeR")

	var wall_h = 895.0 - cavern_top_y + 40.0
	var wall_mid_y = (cavern_top_y + 895.0) * 0.5

	if col_wall_l:
		col_wall_l.position = Vector2(left_edge_x - 15.0, wall_mid_y)
		var shape_l = RectangleShape2D.new()
		shape_l.size = Vector2(30.0, wall_h)
		col_wall_l.shape = shape_l

	if col_wall_r:
		col_wall_r.position = Vector2(right_edge_x + 15.0, wall_mid_y)
		var shape_r = RectangleShape2D.new()
		shape_r.size = Vector2(30.0, wall_h)
		col_wall_r.shape = shape_r

	if col_floor:
		col_floor.position = Vector2(cx, 895.0)
		var floor_shape = RectangleShape2D.new()
		floor_shape.size = Vector2(cavern_half_width * 2.0 + 80.0, 40.0)
		col_floor.shape = floor_shape

	# Cập nhật Mép Đất 2 Bên (Đảm bảo hoàn toàn nằm ngoài miệng hang!)
	if col_ledge_l:
		var ledge_l_width = max(left_edge_x + 50.0, 10.0)
		col_ledge_l.position = Vector2(left_edge_x - ledge_l_width * 0.5, cavern_top_y + 20.0)
		var shape_ledge_l = RectangleShape2D.new()
		shape_ledge_l.size = Vector2(ledge_l_width, 40.0)
		col_ledge_l.shape = shape_ledge_l

	if col_ledge_r:
		var ledge_r_width = max((540.0 - right_edge_x) + 50.0, 10.0)
		col_ledge_r.position = Vector2(right_edge_x + ledge_r_width * 0.5, cavern_top_y + 20.0)
		var shape_ledge_r = RectangleShape2D.new()
		shape_ledge_r.size = Vector2(ledge_r_width, 40.0)
		col_ledge_r.shape = shape_ledge_r

	# 3. Phân bổ quái vật & vật liệu theo Thế Giới
	var primary_mat = "wood"
	var secondary_mat = "glass"
	var heavy_mat = "stone"
	var enemy_grunt = "sly_fox"
	var enemy_elite = "fox_guard"

	if world_id == 2:
		primary_mat = "stone"
		secondary_mat = "wood"
		heavy_mat = "steel"
		enemy_grunt = "armored_raccoon"
		enemy_elite = "mine_wolf"
	elif world_id == 3:
		primary_mat = "steel"
		secondary_mat = "stone"
		heavy_mat = "obsidian"
		enemy_grunt = "spike_hound"
		enemy_elite = "toxic_fox"
	elif world_id == 4:
		primary_mat = "obsidian"
		secondary_mat = "steel"
		heavy_mat = "obsidian"
		enemy_grunt = "imperial_boar"
		enemy_elite = "imperial_boar"

	# 4. Xây dựng công trình đại hầm & kho đạn
	egg_loadout = _generate_grand_bunker(level_id, world_id, cavern_half_width, primary_mat, secondary_mat, heavy_mat, enemy_grunt, enemy_elite)

	# 5. Khởi chạy màn chơi
	var enemies = get_tree().get_nodes_in_group("Enemies")
	var enemy_count = enemies.size()
	GameManager.start_level(level_id, enemy_count, egg_loadout)

func _generate_grand_bunker(lvl: int, world: int, half_w: float, mat1: String, mat2: String, mat_heavy: String, e_grunt: String, e_elite: String) -> Array[String]:
	var floor_y = 885.0
	var cx = 270.0
	var loadout: Array[String] = []

	var num_stories = 1
	if lvl >= 3: num_stories = 2
	if lvl >= 8: num_stories = 3
	if lvl >= 21: num_stories = 4

	var is_boss_level = (lvl % 15 == 0)

	# ==========================================
	# TẦNG 1 (ĐẠI SẢNH ĐÁY HẦM): Rộng 360px -> 480px, Cao 120px - 140px
	# ==========================================
	var span_1 = clamp(half_w * 1.84, 360.0, 480.0)
	var p1_h = 120.0 + min(lvl * 0.35, 20.0)
	var p1_y = floor_y - p1_h * 0.5

	var p1_left_x = cx - span_1 * 0.5 + 14.0
	var p1_right_x = cx + span_1 * 0.5 - 14.0

	# 2 Cột trụ biên bên ngoài
	_spawn_block(Vector2(p1_left_x, p1_y), Vector2(24, p1_h), mat_heavy if lvl > 8 else mat1)
	_spawn_block(Vector2(p1_right_x, p1_y), Vector2(24, p1_h), mat_heavy if lvl > 8 else mat1)

	# 2 Cột trung gian chia 3 gian phòng rộng rãi
	var mid_l_x = cx - span_1 * 0.28
	var mid_r_x = cx + span_1 * 0.28

	_spawn_block(Vector2(mid_l_x, p1_y), Vector2(22, p1_h), mat1)
	_spawn_block(Vector2(mid_r_x, p1_y), Vector2(22, p1_h), mat1)

	# Bố trí Quái vật & TNT Tầng 1 (ĐẢM BẢO 100% ZERO-OVERLAP TOÁN HỌC)
	var room_l_center = (p1_left_x + mid_l_x) * 0.5
	var room_r_center = (p1_right_x + mid_r_x) * 0.5

	if is_boss_level:
		var boss_name = "boss_baron_pig" if world == 4 else ("imperial_boar" if world == 3 else ("mine_wolf" if world == 2 else "fox_guard"))
		_spawn_enemy(Vector2(cx, floor_y - 32), boss_name)
		_spawn_enemy(Vector2(room_l_center, floor_y - 18), e_elite)
		_spawn_enemy(Vector2(room_r_center, floor_y - 18), e_elite)
		_spawn_tnt(Vector2(cx - 55.0, floor_y - 18), world == 4)
		_spawn_tnt(Vector2(cx + 55.0, floor_y - 18), world == 4)
	else:
		# Gian Trái: Quái nằm chính giữa gian
		_spawn_enemy(Vector2(room_l_center, floor_y - 18), e_grunt)

		# Gian Giữa Rộng: Quái ở giữa (cx), TNT ở 2 bên cách cột 40px
		_spawn_enemy(Vector2(cx, floor_y - 18), e_grunt)
		_spawn_tnt(Vector2(cx - 48.0, floor_y - 18), world == 4)
		if lvl >= 2:
			_spawn_tnt(Vector2(cx + 48.0, floor_y - 18), world == 4)

		# Gian Phải: Quái nằm chính giữa gian
		_spawn_enemy(Vector2(room_r_center, floor_y - 18), e_grunt)

	# Trần Tầng 1 (Dầm chịu lực chính đặt tiếp xúc 0px flush)
	var beam1_y = floor_y - p1_h - 12.0
	_spawn_block(Vector2(cx, beam1_y), Vector2(span_1 + 10, 24), mat_heavy if lvl > 5 else mat1)
	var cur_top_y = beam1_y - 12.0

	# ==========================================
	# TẦNG 2 (TỪ LEVEL 3 TRỞ ĐI): Rộng 310px - 410px, Cao 105px
	# ==========================================
	if num_stories >= 2:
		var span_2 = span_1 * (0.86 if lvl >= 5 else 0.80)
		var p2_h = 105.0
		var p2_y = cur_top_y - p2_h * 0.5
		var p2_left_x = cx - span_2 * 0.5 + 12.0
		var p2_right_x = cx + span_2 * 0.5 - 12.0

		var col_mat2 = "glass" if (lvl % 3 == 0) else (mat2 if lvl < 18 else mat1)
		_spawn_block(Vector2(p2_left_x, p2_y), Vector2(20, p2_h), col_mat2)
		_spawn_block(Vector2(p2_right_x, p2_y), Vector2(20, p2_h), col_mat2)

		if span_2 > 330.0 or lvl >= 5:
			_spawn_block(Vector2(cx, p2_y), Vector2(20, p2_h), mat1)

		# Quái & TNT Tầng 2
		var r2_l_center = (p2_left_x + cx) * 0.5
		var r2_r_center = (p2_right_x + cx) * 0.5

		_spawn_enemy(Vector2(r2_l_center, cur_top_y - 18), e_elite if lvl >= 4 else e_grunt)
		_spawn_enemy(Vector2(r2_r_center, cur_top_y - 18), e_elite if lvl >= 4 else e_grunt)

		if lvl >= 6:
			_spawn_tnt(Vector2((r2_l_center + cx) * 0.5, cur_top_y - 18), world == 4)

		var beam2_y = cur_top_y - p2_h - 11.0
		_spawn_block(Vector2(cx, beam2_y), Vector2(span_2 + 8, 22), mat_heavy if lvl > 12 else mat1)
		cur_top_y = beam2_y - 11.0

	# ==========================================
	# TẦNG 3 (TỪ LEVEL 8 TRỞ ĐI): Tháp Canh Cao 95px
	# ==========================================
	if num_stories >= 3:
		var span_3 = span_1 * (0.72 if lvl >= 14 else 0.62)
		var p3_h = 95.0
		var p3_y = cur_top_y - p3_h * 0.5
		var p3_left_x = cx - span_3 * 0.5 + 10.0
		var p3_right_x = cx + span_3 * 0.5 - 10.0

		_spawn_block(Vector2(p3_left_x, p3_y), Vector2(18, p3_h), "glass" if (lvl % 4 == 1) else mat1)
		_spawn_block(Vector2(p3_right_x, p3_y), Vector2(18, p3_h), "glass" if (lvl % 4 == 1) else mat1)

		if lvl % 4 == 1 and lvl >= 9:
			_spawn_rescue_cage(Vector2(cx, cur_top_y - 26))
		else:
			_spawn_enemy(Vector2(cx, cur_top_y - 18), e_elite)
			if lvl >= 10:
				_spawn_enemy(Vector2((p3_left_x + cx) * 0.5, cur_top_y - 18), e_grunt)

		var beam3_y = cur_top_y - p3_h - 10.0
		_spawn_block(Vector2(cx, beam3_y), Vector2(span_3 + 8, 20), mat_heavy)
		cur_top_y = beam3_y - 10.0

	# ==========================================
	# TẦNG 4 (TỪ LEVEL 21 TRỞ ĐI - ĐẠI PHÁO ĐÀI CẤP CAO):
	# ==========================================
	if num_stories >= 4:
		var span_4 = span_1 * 0.50
		var p4_h = 88.0
		var p4_y = cur_top_y - p4_h * 0.5
		var p4_l_x = cx - span_4 * 0.5 + 8.0
		var p4_r_x = cx + span_4 * 0.5 - 8.0
		_spawn_block(Vector2(p4_l_x, p4_y), Vector2(16, p4_h), mat_heavy)
		_spawn_block(Vector2(p4_r_x, p4_y), Vector2(16, p4_h), mat_heavy)
		_spawn_enemy(Vector2(cx, cur_top_y - 18), e_elite)
		if lvl >= 32:
			_spawn_tnt(Vector2((p4_l_x + cx) * 0.5, cur_top_y - 18), world == 4)

		var beam4_y = cur_top_y - p4_h - 10.0
		_spawn_block(Vector2(cx, beam4_y), Vector2(span_4 + 8, 20), mat_heavy)
		cur_top_y = beam4_y - 10.0

	# ==========================================
	# BẪY TẢNG ĐÁ LĂN & QUẠT GIÓ TRÊN NÓC
	# ==========================================
	if lvl >= 4:
		if lvl % 4 == 2:
			_spawn_boulder(Vector2(cx, cur_top_y - 28))
		elif lvl % 4 == 0 and lvl >= 8:
			_spawn_boulder(Vector2(cx - 65, cur_top_y - 28))
			_spawn_boulder(Vector2(cx + 65, cur_top_y - 28))

	if world >= 2 and lvl % 3 == 2:
		_spawn_updraft(Vector2(cx - half_w * 0.55, floor_y))

	# ==========================================
	# KHO ĐẠN CHIẾN THUẬT ANGRY BIRDS
	# ==========================================
	match world:
		1:
			loadout = ["normal", "bomb"]
			if lvl >= 2: loadout.append("normal")
			if lvl >= 6: loadout.append("drill")
			if lvl >= 10: loadout.append("bomb")
			if is_boss_level: loadout.append("drill")
		2:
			loadout = ["drill", "frost", "bomb"]
			if lvl >= 18: loadout.append("normal")
			if lvl >= 23: loadout.append("drill")
			if is_boss_level: loadout.append("bomb")
		3:
			loadout = ["acid", "cluster", "drill", "bomb"]
			if lvl >= 33: loadout.append("frost")
			if lvl >= 38: loadout.append("acid")
			if is_boss_level: loadout.append("acid")
		4:
			loadout = ["blackhole", "acid", "drill", "bomb", "bomb"]
			if lvl >= 48: loadout.append("blackhole")
			if is_boss_level: loadout.append("blackhole")

	return loadout

func _spawn_block(pos: Vector2, size: Vector2, mat: String) -> RigidBody2D:
	var b = BlockScene.instantiate()
	b.position = pos
	b.block_size = size
	b.material_type = mat
	bunker_structure.add_child(b)
	return b

func _spawn_tnt(pos: Vector2, is_nuke: bool = false) -> void:
	var t = (NukeScene if is_nuke else TNTScene).instantiate()
	t.position = pos
	bunker_structure.add_child(t)

func _spawn_enemy(pos: Vector2, type: String) -> void:
	var e = EnemyScene.instantiate()
	e.position = pos
	e.monster_type = type
	e.add_to_group("Enemies")
	bunker_structure.add_child(e)

func _spawn_boulder(pos: Vector2) -> void:
	var b = BoulderScene.instantiate()
	b.position = pos
	bunker_structure.add_child(b)

func _spawn_rescue_cage(pos: Vector2) -> void:
	var c = RescueCageScene.instantiate()
	c.position = pos
	bunker_structure.add_child(c)

func _spawn_updraft(pos: Vector2) -> void:
	var u = UpdraftVentScene.instantiate()
	u.position = pos
	bunker_structure.add_child(u)
