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

const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

@onready var bg_sky: Polygon2D = $Background/Sky
@onready var bg_sky_clouds: Sprite2D = get_node_or_null("Background/SkyClouds")
@onready var bg_dirt: Polygon2D = $Background/UndergroundDirt
@onready var bg_cavern: Polygon2D = $Background/CavernInterior
@onready var bg_cavern_backdrop: Sprite2D = get_node_or_null("Background/CavernBackdrop")
@onready var bg_dirt_wall_l: Sprite2D = get_node_or_null("Background/DirtWallL")
@onready var bg_dirt_wall_r: Sprite2D = get_node_or_null("Background/DirtWallR")
@onready var bg_grass_cliff_l: Sprite2D = get_node_or_null("Background/GrassCliffL")
@onready var bg_grass_cliff_r: Sprite2D = get_node_or_null("Background/GrassCliffR")
@onready var bunker_structure: Node2D = $BunkerStructure

func _safe_load(path: String) -> Texture2D:
	return ParticleHelper._safe_load(path)

func _ready() -> void:
	if GameManager.current_level > 0:
		level_id = GameManager.current_level

	if bg_sky_clouds:
		var ts = _safe_load("res://assets/sprites/environment/sky_clouds_panorama.svg")
		if ts: bg_sky_clouds.texture = ts
	if bg_cavern_backdrop:
		var tc = _safe_load("res://assets/sprites/environment/cavern_backdrop_dungeon.svg")
		if tc: bg_cavern_backdrop.texture = tc
	if bg_dirt_wall_l:
		var td = _safe_load("res://assets/sprites/environment/dirt_wall_strata.svg")
		if td:
			bg_dirt_wall_l.texture = td
			if bg_dirt_wall_r: bg_dirt_wall_r.texture = td
	if bg_grass_cliff_l:
		var tgr = _safe_load("res://assets/sprites/environment/surface_grass_cliff.svg")
		if tgr:
			bg_grass_cliff_l.texture = tgr
			if bg_grass_cliff_r: bg_grass_cliff_r.texture = tgr

	_setup_level()

func _setup_level() -> void:
	var world_id = int((level_id - 1) / 15) + 1
	var egg_loadout: Array[String] = []

	# 1. Bảng màu mỹ thuật theo từng Thế Giới
	match world_id:
		1: # World 1: Farm Cavern (Nông trại đất đá)
			bg_sky.color = Color(0.48, 0.78, 0.96)
			bg_dirt.color = Color(0.32, 0.22, 0.15)
			bg_cavern.color = Color(0.16, 0.10, 0.07)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(1.0, 0.96, 0.92)
		2: # World 2: Stone Quarry (Mỏ đá hoàng hôn)
			bg_sky.color = Color(0.85, 0.62, 0.42)
			bg_dirt.color = Color(0.24, 0.2, 0.24)
			bg_cavern.color = Color(0.13, 0.11, 0.15)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(0.88, 0.78, 0.95)
		3: # World 3: Steampunk Industrial (Nhà máy khói độc)
			bg_sky.color = Color(0.65, 0.52, 0.35)
			bg_dirt.color = Color(0.2, 0.18, 0.22)
			bg_cavern.color = Color(0.09, 0.12, 0.14)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(0.82, 0.88, 0.82)
		4: # World 4: Lava Core Imperial (Hoàng cung nham thạch)
			bg_sky.color = Color(0.25, 0.1, 0.2)
			bg_dirt.color = Color(0.18, 0.06, 0.08)
			bg_cavern.color = Color(0.08, 0.03, 0.05)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(0.95, 0.70, 0.65)

	# 2. Quy mô công trình CỰC ĐẠI TOÀN CẢNH (Mở rộng toàn màn hình từ x=15 đến x=525)
	var cavern_half_width = 255.0
	var cavern_top_y = clamp(390.0 - (level_id * 2.0), 240.0, 390.0)
	var cavern_bottom_y = 840.0
	var floor_y = 840.0
	intro_target_y = (cavern_bottom_y - 20.0 + cavern_top_y) * 0.5

	var cx = 270.0
	var left_edge_x = cx - cavern_half_width
	var right_edge_x = cx + cavern_half_width

	var cav_mid_y = (cavern_top_y + cavern_bottom_y) * 0.5
	var cav_height = cavern_bottom_y - cavern_top_y
	var cav_width = right_edge_x - left_edge_x

	# Cập nhật hình ảnh bối cảnh phong phú
	if bg_cavern_backdrop:
		bg_cavern_backdrop.position = Vector2(cx, cav_mid_y)
		bg_cavern_backdrop.scale = Vector2(cav_width / 540.0, cav_height / 700.0)

	if bg_dirt_wall_l:
		bg_dirt_wall_l.position = Vector2(left_edge_x * 0.5, cav_mid_y)
		bg_dirt_wall_l.scale = Vector2(max(left_edge_x, 15.0) / 120.0, cav_height / 700.0)

	if bg_dirt_wall_r:
		bg_dirt_wall_r.position = Vector2(cx + cavern_half_width + (540.0 - right_edge_x) * 0.5, cav_mid_y)
		bg_dirt_wall_r.scale = Vector2(max(540.0 - right_edge_x, 15.0) / 120.0, cav_height / 700.0)

	if bg_grass_cliff_l:
		bg_grass_cliff_l.position = Vector2(left_edge_x * 0.5, cavern_top_y + 8.0)
		bg_grass_cliff_l.scale = Vector2(max(left_edge_x, 20.0) / 120.0, 1.0)

	if bg_grass_cliff_r:
		bg_grass_cliff_r.position = Vector2(cx + cavern_half_width + (540.0 - right_edge_x) * 0.5, cavern_top_y + 8.0)
		bg_grass_cliff_r.scale = Vector2(max(540.0 - right_edge_x, 20.0) / 120.0, 1.0)

	if bg_sky_clouds:
		bg_sky_clouds.position = Vector2(cx, cavern_top_y * 0.5)
		bg_sky_clouds.scale = Vector2(1.0, cavern_top_y / 400.0)

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
			Vector2(right_edge_x, cavern_bottom_y),
			Vector2(left_edge_x, cavern_bottom_y)
		])

	# Cập nhật ranh giới vật lý (Hoàn toàn thông suốt không bị vướng miệng hang)
	var col_wall_l = get_node_or_null("BunkerBoundaries/ColWallL")
	var col_wall_r = get_node_or_null("BunkerBoundaries/ColWallR")
	var col_floor = get_node_or_null("BunkerBoundaries/ColFloor")
	var col_ledge_l = get_node_or_null("BunkerBoundaries/ColLedgeL")
	var col_ledge_r = get_node_or_null("BunkerBoundaries/ColLedgeR")

	var wall_h = cavern_bottom_y - cavern_top_y + 40.0
	var wall_mid_y = (cavern_top_y + cavern_bottom_y) * 0.5

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
		col_floor.position = Vector2(cx, floor_y + 20.0)
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

	# 6. Đánh thức toàn bộ khối kiến trúc & quái vật sau 0.15s (tránh tuyệt đối khối lơ lửng)
	get_tree().create_timer(0.15).timeout.connect(func():
		if is_instance_valid(bunker_structure):
			for child in bunker_structure.get_children():
				if child.has_method("wake_up"):
					child.wake_up()
	)

func _generate_grand_bunker(lvl: int, world: int, _half_w: float, mat1: String, mat2: String, mat_heavy: String, e_grunt: String, e_elite: String) -> Array[String]:
	var floor_y = 840.0
	var cx = 270.0
	var loadout: Array[String] = []
	var is_boss_level = (lvl % 15 == 0)

	# =========================================================================
	# CỤM 1: THÁP TIỀN ĐỒN TÂY (WEST OUTPOST TOWER) - X: 24 -> 152 (Tâm: 88)
	# =========================================================================
	var tw_cx = 88.0
	var tw_p1_h = 120.0
	var tw_p1_y = floor_y - tw_p1_h * 0.5
	# 2 Cột trụ Tháp Tây
	_spawn_block(Vector2(34, tw_p1_y), Vector2(20, tw_p1_h), mat_heavy if lvl > 6 else mat1)
	_spawn_block(Vector2(142, tw_p1_y), Vector2(20, tw_p1_h), mat1)
	# Dầm trần Tầng 1 Tháp Tây
	var tw_b1_h = 24.0
	var tw_b1_y = floor_y - tw_p1_h - tw_b1_h * 0.5
	_spawn_block(Vector2(tw_cx, tw_b1_y), Vector2(128, tw_b1_h), mat1)
	# Quái Tầng 1 Tháp Tây
	_spawn_enemy(Vector2(tw_cx, floor_y - 24), e_grunt)

	# Tầng 2 Tháp Tây (Vọng lâu trên cao)
	var tw_p2_h = 88.0
	var tw_p2_y = tw_b1_y - tw_b1_h * 0.5 - tw_p2_h * 0.5
	var tw_col_mat = "glass" if (lvl >= 5 and lvl % 3 == 1) else (mat2 if lvl >= 3 else mat1)
	_spawn_block(Vector2(46, tw_p2_y), Vector2(18, tw_p2_h), tw_col_mat)
	_spawn_block(Vector2(130, tw_p2_y), Vector2(18, tw_p2_h), tw_col_mat)
	var tw_b2_h = 20.0
	var tw_b2_y = tw_p2_y - tw_p2_h * 0.5 - tw_b2_h * 0.5
	_spawn_block(Vector2(tw_cx, tw_b2_y), Vector2(104, tw_b2_h), mat1)
	if lvl >= 3:
		_spawn_enemy(Vector2(tw_cx, tw_b1_y - tw_b1_h * 0.5 - 24), e_grunt)

	# =========================================================================
	# CỤM 2: ĐẠI PHÁO ĐÀI HOÀNG GIA TRUNG TÂM (ROYAL CITADEL) - X: 186 -> 354 (Tâm: 270)
	# =========================================================================
	var tc_cx = cx
	var tc_p1_h = 120.0
	var tc_p1_y = floor_y - tc_p1_h * 0.5
	# Cột trụ đại sảnh trung tâm
	_spawn_block(Vector2(198, tc_p1_y), Vector2(24, tc_p1_h), mat_heavy if lvl > 4 else mat1)
	_spawn_block(Vector2(342, tc_p1_y), Vector2(24, tc_p1_h), mat_heavy if lvl > 4 else mat1)
	# Cột chống tâm chịu lực bổ trợ cho đại sảnh
	_spawn_block(Vector2(tc_cx, floor_y - 45.0), Vector2(18, 90.0), mat1)

	# Dầm trần Tầng 1 Trung Tâm (Cùng cao độ [696, 720] với 2 tháp)
	var tc_b1_h = 24.0
	var tc_b1_y = floor_y - tc_p1_h - tc_b1_h * 0.5
	_spawn_block(Vector2(tc_cx, tc_b1_y), Vector2(168, tc_b1_h), mat_heavy)

	# Quái vật & TNT Đại Sảnh
	if is_boss_level:
		var boss_name = "boss_baron_pig" if world == 4 else ("imperial_boar" if world == 3 else ("mine_wolf" if world == 2 else "fox_guard"))
		_spawn_enemy(Vector2(tc_cx - 35, floor_y - 36), boss_name)
		_spawn_tnt(Vector2(tc_cx + 45, floor_y - 18), world == 4)
	else:
		_spawn_enemy(Vector2(tc_cx - 40, floor_y - 24), e_elite if lvl >= 2 else e_grunt)
		if lvl >= 2:
			_spawn_tnt(Vector2(tc_cx + 42, floor_y - 18), world == 4)

	# Tầng 2 Đại Pháo Đài (Kho Vũ Khí)
	var tc_p2_h = 96.0
	var tc_p2_y = tc_b1_y - tc_b1_h * 0.5 - tc_p2_h * 0.5
	_spawn_block(Vector2(212, tc_p2_y), Vector2(22, tc_p2_h), mat1)
	_spawn_block(Vector2(328, tc_p2_y), Vector2(22, tc_p2_h), mat1)
	var tc_b2_h = 24.0
	var tc_b2_y = tc_p2_y - tc_p2_h * 0.5 - tc_b2_h * 0.5
	_spawn_block(Vector2(tc_cx, tc_b2_y), Vector2(140, tc_b2_h), mat_heavy if lvl > 8 else mat1)
	_spawn_enemy(Vector2(tc_cx, tc_b1_y - tc_b1_h * 0.5 - 24), e_elite if lvl >= 4 else e_grunt)

	# Tầng 3 Tháp Vua (Level 6+)
	var cur_citadel_top = tc_b2_y - tc_b2_h * 0.5
	if lvl >= 6:
		var tc_p3_h = 80.0
		var tc_p3_y = cur_citadel_top - tc_p3_h * 0.5
		_spawn_block(Vector2(230, tc_p3_y), Vector2(20, tc_p3_h), mat_heavy)
		_spawn_block(Vector2(310, tc_p3_y), Vector2(20, tc_p3_h), mat_heavy)
		var tc_b3_h = 20.0
		var tc_b3_y = tc_p3_y - tc_p3_h * 0.5 - tc_b3_h * 0.5
		_spawn_block(Vector2(tc_cx, tc_b3_y), Vector2(100, tc_b3_h), mat_heavy)
		_spawn_enemy(Vector2(tc_cx, cur_citadel_top - 24), e_elite)
		cur_citadel_top = tc_b3_y - tc_b3_h * 0.5

	# =========================================================================
	# CỤM 3: THÁP PHÒNG NGỰ ĐÔNG (EAST BASTION) - X: 388 -> 516 (Tâm: 452)
	# =========================================================================
	var te_cx = 452.0
	var te_p1_h = 120.0
	var te_p1_y = floor_y - te_p1_h * 0.5
	# Cột trụ Tháp Đông
	_spawn_block(Vector2(398, te_p1_y), Vector2(20, te_p1_h), mat1)
	_spawn_block(Vector2(506, te_p1_y), Vector2(20, te_p1_h), mat_heavy if lvl > 6 else mat1)
	# Dầm trần Tầng 1 Tháp Đông
	var te_b1_h = 24.0
	var te_b1_y = floor_y - te_p1_h - te_b1_h * 0.5
	_spawn_block(Vector2(te_cx, te_b1_y), Vector2(128, te_b1_h), mat1)
	# Quái Tầng 1 Tháp Đông
	_spawn_enemy(Vector2(te_cx, floor_y - 24), e_grunt)

	# Tầng 2 Tháp Đông (Kho đạn / Lồng cứu gà con)
	var te_p2_h = 88.0
	var te_p2_y = te_b1_y - te_b1_h * 0.5 - te_p2_h * 0.5
	var te_col_mat = "glass" if (lvl >= 6 and lvl % 3 == 2) else (mat2 if lvl >= 3 else mat1)
	_spawn_block(Vector2(410, te_p2_y), Vector2(18, te_p2_h), te_col_mat)
	_spawn_block(Vector2(494, te_p2_y), Vector2(18, te_p2_h), te_col_mat)
	var te_b2_h = 20.0
	var te_b2_y = te_p2_y - te_p2_h * 0.5 - te_b2_h * 0.5
	_spawn_block(Vector2(te_cx, te_b2_y), Vector2(104, te_b2_h), mat1)
	if lvl % 4 == 1 and lvl >= 5:
		_spawn_rescue_cage(Vector2(te_cx, te_b1_y - te_b1_h * 0.5 - 26))
	else:
		if lvl >= 2:
			_spawn_enemy(Vector2(te_cx, te_b1_y - te_b1_h * 0.5 - 24), e_grunt)

	# =========================================================================
	# HỆ THỐNG CẦU ĐÁ TREO NỐI 3 THÁP (HIGH SUSPENSION BRIDGES)
	# Bắc ngang khoảng hở giữa các tháp, đặt êm ả trên mép dầm trần tầng 1!
	# =========================================================================
	# Cầu Nối Tây: Bắc qua khoảng hở x in [152, 186], đặt trên mép trần y = 696.0
	var br_h = 16.0
	var br_y = 696.0 - br_h * 0.5
	_spawn_block(Vector2(169.0, br_y), Vector2(58.0, br_h), mat1)

	# Cầu Nối Đông: Bắc qua khoảng hở x in [354, 388], đặt trên mép trần y = 696.0
	_spawn_block(Vector2(371.0, br_y), Vector2(58.0, br_h), mat1)

	# ==========================================
	# BẪY TẢNG ĐÁ LĂN & QUẠT GIÓ TRÊN NÓC
	# ==========================================
	if lvl >= 4:
		if lvl % 4 == 2:
			_spawn_boulder(Vector2(cx, cur_citadel_top - 28))
		elif lvl % 4 == 0 and lvl >= 8:
			_spawn_boulder(Vector2(cx - 65, cur_citadel_top - 28))
			_spawn_boulder(Vector2(cx + 65, cur_citadel_top - 28))

	if world >= 2 and lvl % 3 == 2:
		_spawn_updraft(Vector2(cx - 140.0, floor_y))

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
