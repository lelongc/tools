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
	var world_id = int(float(level_id - 1) / 15.0) + 1
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

	# 2. Quy mô công trình CỰC ĐẠI THEO THẾ GIỚI & GIAI ĐOẠN
	var world_stage = (level_id - 1) % 15 + 1
	var cavern_half_width = 260.0
	match world_id:
		1: cavern_half_width = 260.0 + (world_stage - 1) * 4.0 # 260 -> 316 (Rộng 520 -> 632)
		2: cavern_half_width = 340.0 + (world_stage - 1) * 5.0 # 340 -> 410 (Rộng 680 -> 820)
		3: cavern_half_width = 410.0 + (world_stage - 1) * 5.0 # 410 -> 480 (Rộng 820 -> 960)
		4: cavern_half_width = 480.0 + (world_stage - 1) * 5.0 # 480 -> 550 (Rộng 960 -> 1100)

	var left_edge_x = 30.0
	var cx = left_edge_x + cavern_half_width
	var right_edge_x = left_edge_x + cavern_half_width * 2.0
	var total_w = right_edge_x + 30.0

	var floor_y = 840.0 + (world_id - 1) * 20.0 # W1: 840, W2: 860, W3: 880, W4: 900
	var cavern_top_y = clamp(380.0 - (world_id * 25.0) - (world_stage * 3.0), 210.0, 380.0)
	var cavern_bottom_y = floor_y
	intro_target_y = (cavern_bottom_y - 20.0 + cavern_top_y) * 0.5

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
		bg_dirt_wall_r.position = Vector2(right_edge_x + (total_w - right_edge_x) * 0.5, cav_mid_y)
		bg_dirt_wall_r.scale = Vector2(max(total_w - right_edge_x, 15.0) / 120.0, cav_height / 700.0)

	if bg_grass_cliff_l:
		bg_grass_cliff_l.position = Vector2(left_edge_x * 0.5, cavern_top_y + 8.0)
		bg_grass_cliff_l.scale = Vector2(max(left_edge_x, 20.0) / 120.0, 1.0)

	if bg_grass_cliff_r:
		bg_grass_cliff_r.position = Vector2(right_edge_x + (total_w - right_edge_x) * 0.5, cavern_top_y + 8.0)
		bg_grass_cliff_r.scale = Vector2(max(total_w - right_edge_x, 20.0) / 120.0, 1.0)

	if bg_sky_clouds:
		bg_sky_clouds.position = Vector2(cx, cavern_top_y * 0.5)
		bg_sky_clouds.scale = Vector2(total_w / 540.0, cavern_top_y / 400.0)

	# Cập nhật hình ảnh nền mở rộng toàn cảnh
	var bg_margin_x = 1200.0
	var bg_min_x = -bg_margin_x
	var bg_max_x = total_w + bg_margin_x

	if bg_sky:
		bg_sky.polygon = PackedVector2Array([
			Vector2(bg_min_x, -800.0), Vector2(bg_max_x, -800.0),
			Vector2(bg_max_x, cavern_top_y), Vector2(bg_min_x, cavern_top_y)
		])
	if bg_dirt:
		bg_dirt.polygon = PackedVector2Array([
			Vector2(bg_min_x, cavern_top_y), Vector2(bg_max_x, cavern_top_y),
			Vector2(bg_max_x, floor_y + 800.0), Vector2(bg_min_x, floor_y + 800.0)
		])
	if bg_cavern:
		bg_cavern.polygon = PackedVector2Array([
			Vector2(left_edge_x, cavern_top_y),
			Vector2(right_edge_x, cavern_top_y),
			Vector2(right_edge_x, floor_y),
			Vector2(left_edge_x, floor_y)
		])

	# Cập nhật ranh giới vật lý
	var col_wall_l = get_node_or_null("BunkerBoundaries/ColWallL")
	var col_wall_r = get_node_or_null("BunkerBoundaries/ColWallR")
	var col_floor = get_node_or_null("BunkerBoundaries/ColFloor")
	var col_ledge_l = get_node_or_null("BunkerBoundaries/ColLedgeL")
	var col_ledge_r = get_node_or_null("BunkerBoundaries/ColLedgeR")

	var wall_h = cav_height + 40.0

	if col_wall_l:
		col_wall_l.position = Vector2(left_edge_x - 15.0, cav_mid_y)
		var shape_l = RectangleShape2D.new()
		shape_l.size = Vector2(30.0, wall_h)
		col_wall_l.shape = shape_l

	if col_wall_r:
		col_wall_r.position = Vector2(right_edge_x + 15.0, cav_mid_y)
		var shape_r = RectangleShape2D.new()
		shape_r.size = Vector2(30.0, wall_h)
		col_wall_r.shape = shape_r

	if col_floor:
		col_floor.position = Vector2(cx, floor_y + 20.0)
		var floor_shape = RectangleShape2D.new()
		floor_shape.size = Vector2(cav_width + 80.0, 40.0)
		col_floor.shape = floor_shape

	if col_ledge_l:
		col_ledge_l.position = Vector2(left_edge_x - 300.0, cavern_top_y + 20.0)
		var shape_ledge_l = RectangleShape2D.new()
		shape_ledge_l.size = Vector2(600.0, 40.0)
		col_ledge_l.shape = shape_ledge_l

	if col_ledge_r:
		col_ledge_r.position = Vector2(right_edge_x + 300.0, cavern_top_y + 20.0)
		var shape_ledge_r = RectangleShape2D.new()
		shape_ledge_r.size = Vector2(600.0, 40.0)
		col_ledge_r.shape = shape_ledge_r

	# Camera thu phóng góc nhìn theo độ rộng thế giới
	var target_zoom_val = clamp(540.0 / (cav_width + 40.0), 0.45, 1.0)
	var cam = get_node_or_null("CameraShake2D") as Camera2D
	if cam:
		var cam_y = (cavern_top_y - 120.0 + floor_y + 60.0) * 0.5
		cam.global_position = Vector2(cx, cam_y)
		cam.zoom = Vector2(target_zoom_val, target_zoom_val)

	# Gà oanh tạc lượn theo sải cánh bầu trời tương ứng
	var chicken = get_node_or_null("ChickenBomber")
	if chicken:
		chicken.min_x = left_edge_x + 35.0
		chicken.max_x = right_edge_x - 35.0
		chicken.default_y = cavern_top_y - 120.0
		chicken.position = Vector2(cx, chicken.default_y)
		chicken.move_speed = 160.0 + (world_id - 1) * 32.0

	# 3. Phân bổ quái vật & vật liệu theo Thế Giới
	var primary_mat = "wood"
	var secondary_mat = "stone"
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
	egg_loadout = _generate_grand_bunker(level_id, world_id, cx, floor_y, primary_mat, secondary_mat, heavy_mat, enemy_grunt, enemy_elite)

	# 5. Khởi chạy màn chơi
	var enemies = get_tree().get_nodes_in_group("Enemies")
	var enemy_count = enemies.size()
	GameManager.start_level(level_id, enemy_count, egg_loadout)


func _spawn_bastion_tier(center_x: float, base_y: float, span: float, pillar_h: float, mat: String, enemy_type: String = "", tnt_mode: int = 0) -> float:
	# tnt_mode: 0 = none, 1 = TNT, 2 = Nuke
	# Trụ chịu lực 24px tạo chân đế rộng vững vàng, triệt tiêu nguy cơ rung lắc
	var pillar_w = 24.0
	var p_y = base_y - pillar_h * 0.5
	_spawn_block(Vector2(center_x - span * 0.5, p_y), Vector2(pillar_w, pillar_h), mat)
	_spawn_block(Vector2(center_x + span * 0.5, p_y), Vector2(pillar_w, pillar_h), mat)

	# Dầm ngang nhô ra ngoài mỗi trụ 6px
	var beam_h = 24.0
	var beam_w = span + 36.0
	var beam_y = base_y - pillar_h - beam_h * 0.5
	_spawn_block(Vector2(center_x, beam_y), Vector2(beam_w, beam_h), mat)

	# Bố trí thông thủy an toàn bên trong tầng: không chạm trụ, không đè nhau
	if enemy_type != "":
		var e_y_offset = 20.0
		if enemy_type == "boss_baron_pig":
			e_y_offset = 27.0
		elif enemy_type in ["imperial_boar", "mine_wolf", "spike_hound"]:
			e_y_offset = 23.0

		if tnt_mode > 0:
			var is_nuke = (tnt_mode == 2)
			var t_y_offset = 26.0 if is_nuke else 23.0
			var half_clearance = (span * 0.5 - 12.0)
			var e_offset = clamp(half_clearance * 0.45, 18.0, 32.0)
			var t_offset = clamp(half_clearance * 0.45, 18.0, 32.0)
			_spawn_enemy(Vector2(center_x - e_offset, base_y - e_y_offset), enemy_type)
			_spawn_tnt(Vector2(center_x + t_offset, base_y - t_y_offset), is_nuke)
		else:
			_spawn_enemy(Vector2(center_x, base_y - e_y_offset), enemy_type)
	elif tnt_mode > 0:
		var is_nuke = (tnt_mode == 2)
		_spawn_tnt(Vector2(center_x, base_y - (26.0 if is_nuke else 23.0)), is_nuke)

	return base_y - pillar_h - beam_h

func _spawn_connecting_bridge(x_from: float, x_to: float, y_level: float, span_from: float, span_to: float, mat: String, floor_y_ref: float, has_tier2_from: bool = false, has_tier2_to: bool = false, t2_span_from: float = 0.0, t2_span_to: float = 0.0) -> void:
	if x_from > x_to:
		var tx = x_from; x_from = x_to; x_to = tx
		var ts = span_from; span_from = span_to; span_to = ts
		var tt = has_tier2_from; has_tier2_from = has_tier2_to; has_tier2_to = tt
		var t2s = t2_span_from; t2_span_from = t2_span_to; t2_span_to = t2s

	var s_from = t2_span_from if (has_tier2_from and t2_span_from > 0.0) else span_from
	var s_to = t2_span_to if (has_tier2_to and t2_span_to > 0.0) else span_to

	# Vị trí an toàn tuyệt đối bên ngoài trụ của 2 tháp (cách trụ tối thiểu 4px)
	var start_x = x_from + s_from * 0.5 + 16.0
	var end_x = x_to - s_to * 0.5 - 16.0

	var bridge_w = end_x - start_x
	if bridge_w < 16.0: return

	var bridge_cx = (start_x + end_x) * 0.5
	var bridge_h = 16.0
	var bridge_y = y_level - bridge_h * 0.5

	# Nếu cầu dài (> 80px), xây trụ đỡ trung tâm chạm đất chống võng
	if bridge_w > 80.0:
		var pier_h = floor_y_ref - y_level
		if pier_h > 24.0:
			_spawn_block(Vector2(bridge_cx, floor_y_ref - pier_h * 0.5), Vector2(24.0, pier_h), mat)

	_spawn_block(Vector2(bridge_cx, bridge_y), Vector2(bridge_w, bridge_h), mat)

func _spawn_boulder(pos: Vector2, span: float = 80.0, mat: String = "stone") -> void:
	# Bệ đỡ nôi đá (Curbs): Hai khối đá nhỏ hai bên giữ tảng đá nằm yên tuyệt đối
	# Khoảng cách curb_dist = 34px đảm bảo không bị bán kính đá (28px) chèn ép đẩy ngang
	var curb_w = 20.0
	var curb_h = 16.0
	var curb_dist = clamp(span * 0.46, 40.0, 46.0)
	var curb_y = pos.y + 20.0
	_spawn_block(Vector2(pos.x - curb_dist, curb_y), Vector2(curb_w, curb_h), mat)
	_spawn_block(Vector2(pos.x + curb_dist, curb_y), Vector2(curb_w, curb_h), mat)

	var b = BoulderScene.instantiate()
	b.position = pos
	bunker_structure.add_child(b)

func _generate_grand_bunker(lvl: int, world: int, cx: float, floor_y: float, mat1: String, mat2: String, mat_heavy: String, e_grunt: String, e_elite: String) -> Array[String]:
	var loadout: Array[String] = []
	var is_boss_level = (lvl % 15 == 0)
	var world_stage = (lvl - 1) % 15 + 1

	match world:
		1:
			# =========================================================================
			# WORLD 1: FARM CAVERN (Tháp Gỗ & Nông Trại Đá) - 1 đến 5 Quái Vật
			# =========================================================================
			var tw_cx = cx - 180.0
			var te_cx = cx + 180.0

			# 1. Pháo Đài Trung Tâm (Center Citadel)
			var c_tnt = 0 if world_stage == 1 else 1
			var c_enemy = "boss_baron_pig" if is_boss_level else e_grunt
			var r1 = _spawn_bastion_tier(cx, floor_y, 144.0, 120.0, mat1, c_enemy, c_tnt)

			var r2 = r1
			if world_stage >= 2:
				var e2 = e_elite if (world_stage >= 4 and not is_boss_level) else e_grunt
				if is_boss_level: e2 = e_elite
				r2 = _spawn_bastion_tier(cx, r1, 116.0, 96.0, mat1, e2, 0)

			var r3 = r2
			if world_stage >= 6:
				var e3 = e_elite if (world_stage >= 10 and not is_boss_level) else ""
				r3 = _spawn_bastion_tier(cx, r2, 84.0, 80.0, mat_heavy, e3, 0)

			# 2. Tháp Tiền Đồn Tây (West Outpost, Stage 3+)
			var rw1 = floor_y
			var rw2 = rw1
			if world_stage >= 3:
				rw1 = _spawn_bastion_tier(tw_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 0)
				rw2 = rw1
				if world_stage >= 5:
					rw2 = _spawn_bastion_tier(tw_cx, rw1, 84.0, 88.0, mat2, "", 0)
				_spawn_connecting_bridge(tw_cx, cx, r1, 116.0, 144.0, mat1, floor_y, world_stage >= 5, world_stage >= 2, 84.0, 116.0)

			# 3. Tháp Phòng Ngự Đông (East Bastion, Stage 6+)
			var re1 = floor_y
			var re2 = re1
			if world_stage >= 6:
				re1 = _spawn_bastion_tier(te_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 0)
				re2 = re1
				if world_stage >= 8:
					re2 = _spawn_bastion_tier(te_cx, re1, 84.0, 88.0, mat2, "", 0)
					if world_stage % 4 == 1:
						_spawn_rescue_cage(Vector2(te_cx, re2 - 20.0))
				_spawn_connecting_bridge(cx, te_cx, r1, 144.0, 116.0, mat1, floor_y, world_stage >= 2, world_stage >= 8, 116.0, 84.0)

			# Boulders
			if world_stage >= 6:
				_spawn_boulder(Vector2(cx, r3 - 28.0), 84.0, mat_heavy)
			if world_stage >= 10 and rw1 < floor_y:
				_spawn_boulder(Vector2(tw_cx, rw2 - 28.0), 84.0, mat1)

			# Loadout World 1
			if world_stage == 1:
				loadout = ["normal", "normal", "bomb"]
			elif world_stage == 2:
				loadout = ["normal", "bomb", "normal", "drill"]
			elif world_stage <= 5:
				loadout = ["normal", "bomb", "normal", "drill", "bomb"]
			elif world_stage <= 9:
				loadout = ["normal", "bomb", "drill", "normal", "drill", "bomb"]
			elif world_stage < 15:
				loadout = ["normal", "bomb", "drill", "normal", "drill", "bomb", "bomb"]
			else:
				loadout = ["bomb", "drill", "normal", "drill", "bomb", "bomb", "bomb"]

		2:
			# =========================================================================
			# WORLD 2: STONE QUARRY (Mỏ Đá Hoàng Hôn) - 4 đến 8 Quái Vật
			# =========================================================================
			var tw_cx = cx - 210.0
			var te_cx = cx + 210.0
			var tx_sniper = cx - 315.0

			# 1. Đại Pháo Đài Trung Tâm (3 tầng đá & thép kiên cố)
			var r1 = _spawn_bastion_tier(cx, floor_y, 144.0, 120.0, mat1, "mine_wolf" if is_boss_level else e_elite, 1)
			var r2 = _spawn_bastion_tier(cx, r1, 116.0, 96.0, mat_heavy, e_grunt, 0)
			var r3 = _spawn_bastion_tier(cx, r2, 84.0, 80.0, mat_heavy, e_elite if world_stage >= 4 else "", 0)

			# 2. Tháp Cần Cẩu Tây (West Quarry Crane)
			var rw1 = _spawn_bastion_tier(tw_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 1)
			var rw2 = rw1
			if world_stage >= 3:
				rw2 = _spawn_bastion_tier(tw_cx, rw1, 84.0, 92.0, mat2, e_grunt if world_stage >= 10 else "", 0)
			_spawn_connecting_bridge(tw_cx, cx, r1, 116.0, 144.0, mat1, floor_y, world_stage >= 3, true, 84.0, 116.0)
			_spawn_boulder(Vector2(tw_cx, rw2 - 28.0), 84.0, mat1)

			# 3. Tháp Quặng Đông (East Ore Bastion)
			var re1 = _spawn_bastion_tier(te_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 0)
			var re2 = re1
			if world_stage >= 2:
				re2 = _spawn_bastion_tier(te_cx, re1, 84.0, 92.0, mat_heavy, e_elite, 0)
			_spawn_connecting_bridge(cx, te_cx, r1, 144.0, 116.0, mat1, floor_y, true, world_stage >= 2, 116.0, 84.0)
			_spawn_boulder(Vector2(te_cx, re2 - 28.0), 84.0, mat_heavy)

			# 4. Vọng Lâu Bắn Tỉa Trên Vách Đá (Sniper Overlook, Stage 6+)
			if world_stage >= 6:
				var p_y = floor_y - 180.0
				var p_h = floor_y - p_y - 9.0
				_spawn_block(Vector2(tx_sniper, floor_y - p_h * 0.5), Vector2(24.0, p_h), mat1)
				_spawn_block(Vector2(tx_sniper, p_y), Vector2(80.0, 18.0), mat_heavy)
				_spawn_enemy(Vector2(tx_sniper, p_y - 29.0), e_grunt)

			if world_stage % 3 == 0:
				_spawn_updraft(Vector2(cx - 105.0, floor_y))

			# Loadout World 2
			if world_stage <= 4:
				loadout = ["drill", "frost", "bomb", "normal", "drill"]
			elif world_stage <= 9:
				loadout = ["drill", "frost", "bomb", "drill", "frost", "bomb"]
			elif world_stage < 15:
				loadout = ["drill", "frost", "bomb", "bomb", "drill", "frost", "bomb"]
			else:
				loadout = ["drill", "frost", "bomb", "bomb", "drill", "frost", "bomb", "bomb"]

		3:
			# =========================================================================
			# WORLD 3: STEAMPUNK CHEMICAL (Khu Công Nghiệp Hóa Chất) - 6 đến 8 Quái Vật
			# =========================================================================
			var s1_cx = cx - 280.0
			var s3_cx = cx + 240.0
			var s4_cx = cx + 360.0

			# 1. Bể Axit Hóa Chất Tây (West Chemical Vat & Vent)
			_spawn_updraft(Vector2(s1_cx - 50.0, floor_y))
			var rs1_1 = _spawn_bastion_tier(s1_cx, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
			var rs1_2 = rs1_1
			if world_stage >= 4:
				rs1_2 = _spawn_bastion_tier(s1_cx, rs1_1, 90.0, 90.0, mat2, e_elite, 0)

			# 2. Đại Lò Luyện Trung Tâm (Central Smelting Bastion)
			var rc1 = _spawn_bastion_tier(cx, floor_y, 150.0, 120.0, mat_heavy, e_elite if is_boss_level else e_elite, 2)
			var rc2 = _spawn_bastion_tier(cx, rc1, 120.0, 96.0, mat1, e_grunt, 0)
			var rc3 = _spawn_bastion_tier(cx, rc2, 88.0, 84.0, mat_heavy, e_elite, 0)
			_spawn_boulder(Vector2(cx, rc3 - 28.0), 88.0, mat_heavy)

			_spawn_connecting_bridge(s1_cx, cx, rs1_1, 120.0, 150.0, mat1, floor_y, world_stage >= 4, true, 90.0, 120.0)

			# 3. Tháp Nồi Hơi Đông (East Boiler Tower)
			var rs3_1 = _spawn_bastion_tier(s3_cx, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
			var rs3_2 = _spawn_bastion_tier(s3_cx, rs3_1, 90.0, 90.0, mat_heavy, e_elite, 0)
			_spawn_connecting_bridge(cx, s3_cx, rc1, 150.0, 120.0, mat1, floor_y, true, true, 120.0, 90.0)

			# 4. Giàn Giáo Treo Trên Không (High Conveyor Catwalk, Stage 5+)
			if world_stage >= 5:
				var p_y = floor_y - 200.0
				var p_h = floor_y - p_y - 9.0
				_spawn_block(Vector2(s4_cx - 28.0, floor_y - p_h * 0.5), Vector2(20.0, p_h), mat1)
				_spawn_block(Vector2(s4_cx + 28.0, floor_y - p_h * 0.5), Vector2(20.0, p_h), mat1)
				_spawn_block(Vector2(s4_cx, p_y), Vector2(88.0, 18.0), mat_heavy)
				_spawn_enemy(Vector2(s4_cx, p_y - 29.0), e_grunt)

			# Loadout World 3
			if world_stage <= 4:
				loadout = ["acid", "cluster", "drill", "bomb", "acid", "cluster"]
			elif world_stage <= 9:
				loadout = ["acid", "cluster", "drill", "bomb", "cluster", "acid", "bomb"]
			elif world_stage < 15:
				loadout = ["acid", "drill", "bomb", "cluster", "acid", "drill", "bomb", "bomb"]
			else:
				loadout = ["acid", "drill", "bomb", "cluster", "acid", "drill", "blackhole", "bomb"]

		4:
			# =========================================================================
			# WORLD 4: LAVA CORE IMPERIAL CITADEL (Đại Hoàng Cung Nham Thạch) - 6 đến 9 Quái
			# =========================================================================
			var b1_cx = cx - 380.0
			var b2_cx = cx - 190.0
			var b4_cx = cx + 190.0
			var b5_cx = cx + 380.0

			# Bastion 1: Tiền Đồn Cửa Ải Tây
			var rb1 = _spawn_bastion_tier(b1_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 1)

			# Bastion 2: Kho Vũ Khí Hoàng Gia Tây
			var rb2_1 = _spawn_bastion_tier(b2_cx, floor_y, 126.0, 120.0, mat_heavy, e_grunt, 0)
			var rb2_2 = rb2_1
			if world_stage >= 3:
				rb2_2 = _spawn_bastion_tier(b2_cx, rb2_1, 92.0, 92.0, mat1, e_grunt if world_stage >= 10 else "", 0)
			_spawn_connecting_bridge(b1_cx, b2_cx, rb1, 116.0, 126.0, mat1, floor_y, false, world_stage >= 3, 0.0, 92.0)
			_spawn_boulder(Vector2(b2_cx, rb2_2 - 28.0), 92.0, mat_heavy)

			# Bastion 3: Cung Điện Ngai Vàng Hoàng Gia Trung Tâm (Imperial High Palace)
			var e_boss = "boss_baron_pig" if is_boss_level else e_elite
			var rc1 = _spawn_bastion_tier(cx, floor_y, 156.0, 120.0, mat_heavy, e_boss, 2)
			var rc2 = _spawn_bastion_tier(cx, rc1, 120.0, 96.0, mat_heavy, e_grunt, 0)
			var rc3 = _spawn_bastion_tier(cx, rc2, 88.0, 84.0, mat_heavy, e_elite if world_stage >= 4 else "", 0)
			_spawn_boulder(Vector2(cx, rc3 - 28.0), 88.0, mat_heavy)

			_spawn_connecting_bridge(b2_cx, cx, rb2_1, 126.0, 156.0, mat1, floor_y, world_stage >= 3, true, 92.0, 120.0)

			# Bastion 4: Hầm Silo Hạt Nhân Đông
			var rb4_1 = _spawn_bastion_tier(b4_cx, floor_y, 126.0, 120.0, mat_heavy, e_grunt, 2)
			var rb4_2 = rb4_1
			if world_stage >= 6:
				rb4_2 = _spawn_bastion_tier(b4_cx, rb4_1, 92.0, 92.0, mat1, e_grunt, 0)
			_spawn_connecting_bridge(cx, b4_cx, rc1, 156.0, 126.0, mat1, floor_y, true, world_stage >= 6, 120.0, 92.0)
			_spawn_boulder(Vector2(b4_cx, rb4_2 - 28.0), 92.0, mat_heavy)

			# Bastion 5: Tháp Can Rồng Viễn Đông (Outer East Dragon Watchtower)
			var rb5 = _spawn_bastion_tier(b5_cx, floor_y, 116.0, 120.0, mat1, e_elite, 0)
			_spawn_connecting_bridge(b4_cx, b5_cx, rb4_1, 126.0, 116.0, mat1, floor_y, world_stage >= 6, false, 92.0, 0.0)

			# Loadout World 4
			if world_stage <= 4:
				loadout = ["blackhole", "acid", "drill", "bomb", "blackhole", "bomb"]
			elif world_stage <= 9:
				loadout = ["blackhole", "acid", "drill", "bomb", "blackhole", "acid", "bomb"]
			elif world_stage < 15:
				loadout = ["blackhole", "acid", "drill", "bomb", "blackhole", "drill", "acid", "bomb"]
			else: # Final Level 60
				loadout = ["blackhole", "bomb", "drill", "acid", "blackhole", "drill", "acid", "bomb"]

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

func _spawn_rescue_cage(pos: Vector2) -> void:
	var c = RescueCageScene.instantiate()
	c.position = pos
	bunker_structure.add_child(c)

func _spawn_updraft(pos: Vector2) -> void:
	var u = UpdraftVentScene.instantiate()
	u.position = pos
	bunker_structure.add_child(u)
