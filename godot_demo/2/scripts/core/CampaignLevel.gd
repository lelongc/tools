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
@export var intro_target_y: float = 680.0

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

	# 1. Bảng màu mỹ thuật phong phú theo từng Thế Giới
	match world_id:
		1: # World 1: Farm Cavern (Xanh trời / Nâu đất nông trại)
			bg_sky.color = Color(0.48, 0.78, 0.96)
			bg_dirt.color = Color(0.32, 0.22, 0.15)
			bg_cavern.color = Color(0.18, 0.13, 0.09)
		2: # World 2: Stone Quarry (Cam hoàng hôn / Xám mỏ đá)
			bg_sky.color = Color(0.85, 0.62, 0.42)
			bg_dirt.color = Color(0.24, 0.2, 0.24)
			bg_cavern.color = Color(0.13, 0.11, 0.15)
		3: # World 3: Steampunk Industrial (Vàng khói độc / Nâu đồng rỉ)
			bg_sky.color = Color(0.65, 0.52, 0.35)
			bg_dirt.color = Color(0.2, 0.18, 0.22)
			bg_cavern.color = Color(0.09, 0.12, 0.14)
		4: # World 4: Lava Core Imperial (Tím đen vũ trụ / Đỏ nham thạch)
			bg_sky.color = Color(0.25, 0.1, 0.2)
			bg_dirt.color = Color(0.18, 0.06, 0.08)
			bg_cavern.color = Color(0.08, 0.03, 0.05)

	# 2. Tính toán Độ Rộng (Width) và Quy Mô theo Cấp Độ (Progression Scaling)
	var cavern_half_width = clamp(130.0 + (level_id * 2.2), 130.0, 245.0)
	var cavern_top_y = clamp(520.0 - (level_id * 3.5), 320.0, 520.0)
	intro_target_y = (880.0 + cavern_top_y) * 0.5

	# Cập nhật kích thước hang động theo độ to rộng của hầm
	var cx = 270.0
	if bg_cavern:
		bg_cavern.polygon = PackedVector2Array([
			Vector2(cx - cavern_half_width, cavern_top_y),
			Vector2(cx + cavern_half_width, cavern_top_y),
			Vector2(cx + cavern_half_width, 890),
			Vector2(cx - cavern_half_width, 890)
		])

	# Cập nhật tường biên vật lý theo độ rộng của hầm
	var col_wall_l = get_node_or_null("BunkerBoundaries/ColWallL")
	var col_wall_r = get_node_or_null("BunkerBoundaries/ColWallR")
	var col_floor = get_node_or_null("BunkerBoundaries/ColFloor")

	if col_wall_l:
		col_wall_l.position.x = cx - cavern_half_width - 15.0
	if col_wall_r:
		col_wall_r.position.x = cx + cavern_half_width + 15.0
	if col_floor and col_floor.shape is RectangleShape2D:
		var floor_shape = RectangleShape2D.new()
		floor_shape.size = Vector2(cavern_half_width * 2.0 + 80.0, 40.0)
		col_floor.shape = floor_shape

	# 3. Phân bổ vật liệu & quái theo Thế Giới
	var primary_mat = "wood"
	var secondary_mat = "glass"
	var heavy_mat = "stone"
	var enemy_grunt = "sly_fox"
	var enemy_elite = "fox_guard"

	if world_id == 2:
		primary_mat = "stone"
		secondary_mat = "wood"
		heavy_mat = "stone"
		enemy_grunt = "armored_raccoon"
		enemy_elite = "mine_wolf"
	elif world_id == 3:
		primary_mat = "steel"
		secondary_mat = "stone"
		heavy_mat = "steel"
		enemy_grunt = "spike_hound"
		enemy_elite = "toxic_fox"
	elif world_id == 4:
		primary_mat = "obsidian"
		secondary_mat = "steel"
		heavy_mat = "obsidian"
		enemy_grunt = "imperial_boar"
		enemy_elite = "imperial_boar"

	# 4. Xây dựng hầm theo thuật toán quy mô tiến hóa
	egg_loadout = _generate_progressive_bunker(level_id, world_id, cavern_half_width, primary_mat, secondary_mat, heavy_mat, enemy_grunt, enemy_elite)

	# 5. Khởi chạy màn chơi và đếm quái
	var enemies = get_tree().get_nodes_in_group("Enemies")
	var enemy_count = enemies.size()
	GameManager.start_level(level_id, enemy_count, egg_loadout)

	if CameraShake.instance:
		CameraShake.instance.play_intro_pan(intro_target_y)

func _generate_progressive_bunker(lvl: int, world: int, half_w: float, mat1: String, mat2: String, mat_heavy: String, e_grunt: String, e_elite: String) -> Array[String]:
	var floor_y = 880.0
	var cx = 270.0
	var loadout: Array[String] = []

	# Xác định số tầng theo độ khó (1 tầng -> 2 tầng -> 3 tầng -> 4 tầng)
	var num_stories = 1
	if lvl >= 6: num_stories = 2
	if lvl >= 16: num_stories = 3
	if lvl >= 36: num_stories = 4

	var is_boss_level = (lvl % 15 == 0)

	# ==========================================
	# TẦNG 1 (ĐÁY HẦM): Rộng từ 220px -> 450px
	# ==========================================
	var span_1 = half_w * 1.8
	var p1_h = 100.0 + min(lvl * 0.8, 40.0)
	var p1_y = floor_y - p1_h * 0.5
	var p1_left_x = cx - span_1 * 0.5 + 16.0
	var p1_right_x = cx + span_1 * 0.5 - 16.0

	_spawn_block(Vector2(p1_left_x, p1_y), Vector2(26, p1_h), mat_heavy if lvl > 15 else mat1)
	_spawn_block(Vector2(p1_right_x, p1_y), Vector2(26, p1_h), mat_heavy if lvl > 15 else mat1)

	# Nếu hầm rộng trên 300px, thêm cột trụ phụ ở giữa
	if span_1 > 300.0:
		_spawn_block(Vector2(cx, p1_y), Vector2(20, p1_h), mat2)

	# Bố trí quái & TNT Tầng 1
	if is_boss_level:
		var boss_name = "boss_baron_pig" if world == 4 else ("imperial_boar" if world == 3 else ("mine_wolf" if world == 2 else "fox_guard"))
		_spawn_enemy(Vector2(cx, floor_y - 32), boss_name)
		_spawn_tnt(Vector2(cx - 80, floor_y - 20), world == 4)
		_spawn_tnt(Vector2(cx + 80, floor_y - 20), world == 4)
	else:
		_spawn_tnt(Vector2(cx, floor_y - 20), world == 4)
		_spawn_enemy(Vector2(p1_left_x + 45, floor_y - 18), e_grunt)
		if lvl >= 4:
			_spawn_enemy(Vector2(p1_right_x - 45, floor_y - 18), e_grunt)

	# Sàn Tầng 1 (Trần ngăn cách Tầng 1 và 2)
	var beam1_y = floor_y - p1_h - 11.0
	_spawn_block(Vector2(cx, beam1_y), Vector2(span_1 + 10, 22), mat1)
	var cur_top_y = beam1_y - 11.0

	# ==========================================
	# TẦNG 2 (NẾU CÓ): Thu hẹp 15-20%
	# ==========================================
	if num_stories >= 2:
		var span_2 = span_1 * 0.82
		var p2_h = 90.0
		var p2_y = cur_top_y - p2_h * 0.5
		var p2_left_x = cx - span_2 * 0.5 + 14.0
		var p2_right_x = cx + span_2 * 0.5 - 14.0

		_spawn_block(Vector2(p2_left_x, p2_y), Vector2(22, p2_h), mat2 if lvl < 30 else mat1)
		_spawn_block(Vector2(p2_right_x, p2_y), Vector2(22, p2_h), mat2 if lvl < 30 else mat1)

		_spawn_enemy(Vector2(cx, cur_top_y - 18), e_elite)
		if lvl % 2 == 0:
			_spawn_tnt(Vector2(cx - 50, cur_top_y - 20), world == 4)

		var beam2_y = cur_top_y - p2_h - 10.0
		_spawn_block(Vector2(cx, beam2_y), Vector2(span_2 + 8, 20), mat1)
		cur_top_y = beam2_y - 10.0

	# ==========================================
	# TẦNG 3 (NẾU CÓ): Tháp canh / Cầu treo
	# ==========================================
	if num_stories >= 3:
		var span_3 = span_1 * 0.65
		var p3_h = 80.0
		var p3_y = cur_top_y - p3_h * 0.5
		var p3_left_x = cx - span_3 * 0.5 + 12.0
		var p3_right_x = cx + span_3 * 0.5 - 12.0

		_spawn_block(Vector2(p3_left_x, p3_y), Vector2(20, p3_h), "glass" if lvl % 3 == 0 else mat1)
		_spawn_block(Vector2(p3_right_x, p3_y), Vector2(20, p3_h), "glass" if lvl % 3 == 0 else mat1)

		if lvl % 3 == 0:
			_spawn_rescue_cage(Vector2(cx, cur_top_y - 26))
		else:
			_spawn_enemy(Vector2(cx, cur_top_y - 18), e_elite)

		var beam3_y = cur_top_y - p3_h - 10.0
		_spawn_block(Vector2(cx, beam3_y), Vector2(span_3 + 8, 20), mat_heavy)
		cur_top_y = beam3_y - 10.0

	# ==========================================
	# TẦNG 4 (NẾU CÓ - ĐẠI PHÁO ĐÀI CẤP CAO):
	# ==========================================
	if num_stories >= 4:
		var span_4 = span_1 * 0.48
		var p4_h = 75.0
		var p4_y = cur_top_y - p4_h * 0.5
		_spawn_block(Vector2(cx - span_4 * 0.5 + 10, p4_y), Vector2(18, p4_h), mat_heavy)
		_spawn_block(Vector2(cx + span_4 * 0.5 - 10, p4_y), Vector2(18, p4_h), mat_heavy)
		_spawn_enemy(Vector2(cx, cur_top_y - 18), e_grunt)

		var beam4_y = cur_top_y - p4_h - 10.0
		_spawn_block(Vector2(cx, beam4_y), Vector2(span_4 + 8, 20), mat_heavy)
		cur_top_y = beam4_y - 10.0

	# ==========================================
	# NÓC HẦM: Bẫy Tảng Đá Lăn / Mái Nghiêng / Quạt Gió
	# ==========================================
	if lvl >= 8:
		if lvl % 4 == 0:
			_spawn_boulder(Vector2(cx, cur_top_y - 28))
		elif lvl % 4 == 2 and lvl >= 15:
			# Hai tảng đá lăn ở hai cánh
			_spawn_boulder(Vector2(cx - 60, cur_top_y - 28))
			_spawn_boulder(Vector2(cx + 60, cur_top_y - 28))

	if world == 3 and lvl % 3 == 1:
		_spawn_updraft(Vector2(cx - half_w * 0.5, floor_y))

	# ==========================================
	# TÍNH TOÁN KHO ĐẠN TRỨNG TỐI ƯU CHO MÀN
	# ==========================================
	match world:
		1:
			loadout = ["normal", "bomb"]
			if lvl > 5: loadout.append("normal")
			if lvl > 10: loadout.append("bomb")
			if is_boss_level: loadout.append("drill")
		2:
			loadout = ["drill", "frost", "bomb"]
			if lvl > 20: loadout.append("normal")
			if is_boss_level: loadout.append("bomb")
		3:
			loadout = ["acid", "cluster", "drill", "bomb"]
			if lvl > 35: loadout.append("frost")
			if is_boss_level: loadout.append("acid")
		4:
			loadout = ["blackhole", "acid", "drill", "bomb", "bomb"]
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
