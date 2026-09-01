extends Node2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

const BlockScene = preload("res://scenes/prefabs/DestructibleBlock.tscn")
const TNTScene = preload("res://scenes/prefabs/TNTBarrel.tscn")
const NukeScene = preload("res://scenes/prefabs/NukeBarrel.tscn")
const EnemyScene = preload("res://scenes/prefabs/BunkerMonster.tscn")
const BoulderScene = preload("res://scenes/prefabs/RollingBoulder.tscn")
const RescueCageScene = preload("res://scenes/prefabs/RescueCage.tscn")
const UpdraftVentScene = preload("res://scenes/prefabs/UpdraftVent.tscn")

enum Archetype {
	HIGHRISE_TOWER,       # 0: Tháp cao 3-4 tầng chân kính
	PYRAMID_DEFLECTOR,    # 1: Mái dốc tam giác chống bom
	DUAL_FORTRESS,        # 2: Hai lô cốt độc lập Trái - Phải
	SEESAW_CATAPULT,      # 3: Đòn bẩy bập bênh tảng đá
	ROLLING_RAMP_MAZE,    # 4: Mê cung dốc đá lăn kích nổ chuỗi
	WIND_UPDRAFT_CHAOS,   # 5: Quạt gió lốc xoáy uốn cong quỹ đạo
	BARRICADED_VAULT,     # 6: Két sắt bọc thép/obsidian chống bom
	SUSPENSION_BRIDGE,    # 7: Cầu treo sập hầm
	HOSTAGE_DILEMMA,      # 8: Lồng cứu gà con treo hiểm hóc
	ZIGZAG_CATACOMBS,     # 9: Hầm ngoằn ngoèo ziczac 3 tầng
	NARROW_DRILL_SHAFT,   # 10: Khe hẹp đục mũi khoan
	GRAND_BOSS_CITADEL    # 11: Đại pháo đài Boss 4 tầng
}

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

	# 1. Bảng màu mỹ thuật theo từng Thế Giới
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

	# 2. Xác định Kiến Trúc Màn Chơi (Archetype)
	var arch_type: int = (level_id - 1) % 11
	if level_id % 15 == 0:
		arch_type = Archetype.GRAND_BOSS_CITADEL

	# 3. Tạo vật liệu & quái phù hợp theo World
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

	# 4. Xây dựng hầm theo từng Archetype cụ thể
	egg_loadout = _build_archetype_level(arch_type, world_id, primary_mat, secondary_mat, heavy_mat, enemy_grunt, enemy_elite)

	# 5. Khởi chạy màn chơi và đếm quái
	var enemies = get_tree().get_nodes_in_group("Enemies")
	var enemy_count = enemies.size()
	GameManager.start_level(level_id, enemy_count, egg_loadout)

	if CameraShake.instance:
		CameraShake.instance.play_intro_pan(intro_target_y)

func _build_archetype_level(arch: int, world: int, mat1: String, mat2: String, mat_heavy: String, e_grunt: String, e_elite: String) -> Array[String]:
	var floor_y = 870.0
	var loadout: Array[String] = []

	match arch:
		Archetype.HIGHRISE_TOWER:
			# === THÁP CHỌC TRỜI 4 TẦNG: Chân kính giòn nâng đỡ 3 tầng nặng ===
			var p_h = 80.0
			var cur_y = floor_y - p_h * 0.5
			# Tầng 1: Kính giòn
			_spawn_block(Vector2(180, cur_y), Vector2(20, p_h), "glass")
			_spawn_block(Vector2(360, cur_y), Vector2(20, p_h), "glass")
			_spawn_enemy(Vector2(270, floor_y - 18), e_grunt)
			_spawn_tnt(Vector2(215, floor_y - 20), world == 4)
			_spawn_tnt(Vector2(325, floor_y - 20), world == 4)

			# Tầng 2: Sàn & Cột Gỗ/Đá
			var beam1_y = floor_y - p_h - 10
			_spawn_block(Vector2(270, beam1_y), Vector2(240, 20), mat1)
			var y2 = beam1_y - 10 - p_h * 0.5
			_spawn_block(Vector2(190, y2), Vector2(22, p_h), mat1)
			_spawn_block(Vector2(350, y2), Vector2(22, p_h), mat1)
			_spawn_enemy(Vector2(270, beam1_y - 28), e_elite)

			# Tầng 3: Sàn & Cột Nặng
			var beam2_y = beam1_y - 20 - p_h
			_spawn_block(Vector2(270, beam2_y), Vector2(200, 20), mat_heavy)
			var y3 = beam2_y - 10 - p_h * 0.5
			_spawn_block(Vector2(205, y3), Vector2(24, p_h), mat_heavy)
			_spawn_block(Vector2(335, y3), Vector2(24, p_h), mat_heavy)
			_spawn_enemy(Vector2(270, beam2_y - 28), e_grunt)

			# Mái: Tảng đá lăn trên nóc tháp
			var roof_y = beam2_y - 20 - p_h
			_spawn_block(Vector2(270, roof_y), Vector2(180, 20), mat_heavy)
			_spawn_boulder(Vector2(270, roof_y - 30))

			loadout = ["normal", "bomb", "drill"]

		Archetype.PYRAMID_DEFLECTOR:
			# === MÁI CHỮ A TAM GIÁC CHỐNG BOM ===
			var p_h = 130.0
			var p_y = floor_y - p_h * 0.5
			_spawn_block(Vector2(160, p_y), Vector2(28, p_h), mat_heavy)
			_spawn_block(Vector2(380, p_y), Vector2(28, p_h), mat_heavy)
			_spawn_enemy(Vector2(220, floor_y - 18), e_grunt)
			_spawn_enemy(Vector2(320, floor_y - 18), e_grunt)
			_spawn_tnt(Vector2(270, floor_y - 20), world == 4)

			var beam_y = floor_y - p_h - 12
			_spawn_block(Vector2(270, beam_y), Vector2(280, 24), mat_heavy)

			# 2 dầm xiên 45 độ tạo mái chữ A
			var roof_left = _spawn_block(Vector2(205, beam_y - 65), Vector2(24, 150), mat_heavy)
			roof_left.rotation = deg_to_rad(35)
			var roof_right = _spawn_block(Vector2(335, beam_y - 65), Vector2(24, 150), mat_heavy)
			roof_right.rotation = deg_to_rad(-35)

			_spawn_enemy(Vector2(270, beam_y - 30), e_elite)
			loadout = ["drill", "frost", "bomb"]

		Archetype.DUAL_FORTRESS:
			# === HAI LÔ CỐT ĐỘC LẬP TÁCH BIỆT (Trái X:180, Phải X:360) ===
			var p_h = 120.0
			var p_y = floor_y - p_h * 0.5

			# Lô cốt Trái (West Tower)
			_spawn_block(Vector2(135, p_y), Vector2(22, p_h), mat1)
			_spawn_block(Vector2(225, p_y), Vector2(22, p_h), "glass")
			_spawn_block(Vector2(180, floor_y - p_h - 10), Vector2(120, 20), mat1)
			_spawn_enemy(Vector2(180, floor_y - 18), e_grunt)
			_spawn_tnt(Vector2(180, floor_y - p_h - 30), world == 4)

			# Lô cốt Phải (East Tower)
			_spawn_block(Vector2(315, p_y), Vector2(22, p_h), "glass")
			_spawn_block(Vector2(405, p_y), Vector2(22, p_h), mat1)
			_spawn_block(Vector2(360, floor_y - p_h - 10), Vector2(120, 20), mat1)
			_spawn_enemy(Vector2(360, floor_y - 18), e_elite)
			_spawn_boulder(Vector2(360, floor_y - p_h - 35))

			loadout = ["cluster", "bomb", "drill", "normal"]

		Archetype.SEESAW_CATAPULT:
			# === BẬP BÊNH ĐÒN BẨY: Đè 1 đầu phóng đầu kia ===
			var pivot_y = floor_y - 35
			_spawn_block(Vector2(270, pivot_y), Vector2(30, 70), "stone")
			
			# Thanh đòn bẩy ngang
			var plank = _spawn_block(Vector2(270, floor_y - 75), Vector2(260, 20), mat1)
			plank.rotation = deg_to_rad(-8)
			
			# Tảng đá nặng bên trái, quái vật và TNT bên phải
			_spawn_boulder(Vector2(170, floor_y - 110))
			_spawn_enemy(Vector2(360, floor_y - 100), e_elite)
			_spawn_tnt(Vector2(340, floor_y - 20), world == 4)

			# Chân vách kính bảo vệ
			_spawn_block(Vector2(380, floor_y - 45), Vector2(18, 90), "glass")

			loadout = ["normal", "drill", "bomb"]

		Archetype.ROLLING_RAMP_MAZE:
			# === DỐC ĐÁ LĂN ZICZAC DOMINO ===
			var p_h = 100.0
			# Tầng đáy chứa quái & thùng TNT
			_spawn_block(Vector2(150, floor_y - p_h * 0.5), Vector2(24, p_h), mat1)
			_spawn_block(Vector2(390, floor_y - p_h * 0.5), Vector2(24, p_h), mat1)
			_spawn_enemy(Vector2(220, floor_y - 18), e_grunt)
			_spawn_enemy(Vector2(330, floor_y - 18), e_grunt)
			_spawn_tnt(Vector2(270, floor_y - 20), world == 4)

			# Sàn giữa
			var mid_y = floor_y - p_h - 12
			_spawn_block(Vector2(270, mid_y), Vector2(280, 24), mat1)

			# Dốc nghiêng tầng trên
			var ramp = _spawn_block(Vector2(250, mid_y - 75), Vector2(200, 20), mat_heavy)
			ramp.rotation = deg_to_rad(22)

			# Khối chặn kính giữ tảng đá trên đỉnh dốc
			_spawn_block(Vector2(165, mid_y - 115), Vector2(16, 45), "glass")
			_spawn_boulder(Vector2(195, mid_y - 130))
			_spawn_enemy(Vector2(360, mid_y - 30), e_elite)

			loadout = ["normal", "bomb", "cluster"]

		Archetype.WIND_UPDRAFT_CHAOS:
			# === HẦM QUẠT GIÓ LỐC XOÁY UỐN CONG QUỸ ĐẠO ===
			_spawn_updraft(Vector2(200, floor_y))
			
			var p_h = 120.0
			_spawn_block(Vector2(310, floor_y - p_h * 0.5), Vector2(24, p_h), mat1)
			_spawn_block(Vector2(410, floor_y - p_h * 0.5), Vector2(24, p_h), mat1)
			_spawn_block(Vector2(360, floor_y - p_h - 10), Vector2(130, 20), mat_heavy)

			_spawn_enemy(Vector2(360, floor_y - 18), e_elite)
			_spawn_enemy(Vector2(360, floor_y - p_h - 30), e_grunt)
			_spawn_tnt(Vector2(140, floor_y - 20), world == 4)

			loadout = ["drill", "acid", "bomb"]

		Archetype.BARRICADED_VAULT:
			# === KÉT SẮT BỌC THÉP / OBSIDIAN KHÁNG ĐẠN ===
			var p_h = 120.0
			_spawn_block(Vector2(160, floor_y - p_h * 0.5), Vector2(32, p_h), "obsidian" if world >= 3 else "steel")
			_spawn_block(Vector2(380, floor_y - p_h * 0.5), Vector2(32, p_h), "obsidian" if world >= 3 else "steel")
			_spawn_block(Vector2(270, floor_y - p_h - 14), Vector2(270, 28), "obsidian" if world >= 3 else "steel")

			_spawn_enemy(Vector2(220, floor_y - 18), e_elite)
			_spawn_enemy(Vector2(320, floor_y - 18), e_elite)
			_spawn_tnt(Vector2(270, floor_y - 20), true)

			loadout = ["acid", "blackhole", "drill"]

		Archetype.SUSPENSION_BRIDGE:
			# === CẦU TREO SẬP HẦM ===
			var span_y = floor_y - 140
			_spawn_block(Vector2(150, span_y), Vector2(90, 18), mat1)
			_spawn_block(Vector2(270, span_y), Vector2(100, 18), "glass")
			_spawn_block(Vector2(390, span_y), Vector2(90, 18), mat1)

			# Quái đứng trên cầu
			_spawn_enemy(Vector2(220, span_y - 20), e_grunt)
			_spawn_enemy(Vector2(320, span_y - 20), e_grunt)

			# Đáy hầm chứa đầy thùng TNT
			_spawn_tnt(Vector2(210, floor_y - 20), world == 4)
			_spawn_tnt(Vector2(270, floor_y - 20), world == 4)
			_spawn_tnt(Vector2(330, floor_y - 20), world == 4)
			_spawn_enemy(Vector2(270, floor_y - 50), e_elite)

			loadout = ["normal", "bomb", "cluster"]

		Archetype.HOSTAGE_DILEMMA:
			# === LỒNG CỨU GÀ CON TREO HIỂM HÓC ===
			var p_h = 110.0
			_spawn_block(Vector2(170, floor_y - p_h * 0.5), Vector2(24, p_h), mat1)
			_spawn_block(Vector2(370, floor_y - p_h * 0.5), Vector2(24, p_h), mat1)
			_spawn_block(Vector2(270, floor_y - p_h - 10), Vector2(230, 20), mat1)

			_spawn_enemy(Vector2(215, floor_y - 18), e_elite)
			_spawn_enemy(Vector2(325, floor_y - 18), e_elite)

			# Lồng gà con lơ lửng trên nóc
			_spawn_rescue_cage(Vector2(270, floor_y - p_h - 32))
			_spawn_tnt(Vector2(270, floor_y - 20), world == 4)

			loadout = ["frost", "normal", "bomb"]

		Archetype.ZIGZAG_CATACOMBS:
			# === HẦM ZICZAC TRỤC LỆCH 3 TẦNG ===
			var p_h = 75.0
			# Tầng 1 (Lệch phải)
			_spawn_block(Vector2(240, floor_y - p_h * 0.5), Vector2(22, p_h), mat1)
			_spawn_block(Vector2(400, floor_y - p_h * 0.5), Vector2(22, p_h), mat1)
			_spawn_block(Vector2(320, floor_y - p_h - 8), Vector2(190, 18), mat1)
			_spawn_enemy(Vector2(320, floor_y - 18), e_grunt)

			# Tầng 2 (Lệch trái)
			var y2_beam = floor_y - p_h - 8
			_spawn_block(Vector2(140, y2_beam - 8 - p_h * 0.5), Vector2(22, p_h), mat1)
			_spawn_block(Vector2(300, y2_beam - 8 - p_h * 0.5), Vector2(22, p_h), "glass")
			_spawn_block(Vector2(220, y2_beam - 16 - p_h), Vector2(190, 18), mat_heavy)
			_spawn_enemy(Vector2(220, y2_beam - 26), e_elite)

			# Tầng 3 (Nóc)
			var top_y = y2_beam - 16 - p_h
			_spawn_boulder(Vector2(220, top_y - 28))
			_spawn_tnt(Vector2(320, floor_y - p_h - 26), world == 4)

			loadout = ["bomb", "drill", "cluster"]

		Archetype.NARROW_DRILL_SHAFT:
			# === KHE HẸP MŨI KHOAN XUYÊN 3 TẦNG TẤM ĐÁ ===
			var plate1_y = floor_y - 60
			var plate2_y = floor_y - 130
			var plate3_y = floor_y - 200

			_spawn_block(Vector2(180, plate1_y), Vector2(100, 20), mat_heavy)
			_spawn_block(Vector2(360, plate1_y), Vector2(100, 20), mat_heavy)

			_spawn_block(Vector2(180, plate2_y), Vector2(100, 20), mat_heavy)
			_spawn_block(Vector2(360, plate2_y), Vector2(100, 20), mat_heavy)

			_spawn_block(Vector2(180, plate3_y), Vector2(100, 20), mat_heavy)
			_spawn_block(Vector2(360, plate3_y), Vector2(100, 20), mat_heavy)

			# Khe hở 80px ở giữa trục X: 270
			_spawn_tnt(Vector2(270, floor_y - 20), true)
			_spawn_enemy(Vector2(180, floor_y - 18), e_elite)
			_spawn_enemy(Vector2(360, floor_y - 18), e_elite)

			loadout = ["drill", "drill", "blackhole"]

		Archetype.GRAND_BOSS_CITADEL:
			# === ĐẠI PHÁO ĐÀI BOSS HOÀNG GIA 4 TẦNG (MÀN 15, 30, 45, 60) ===
			# Tầng 1: Ngai vàng Boss Hoàng Gia
			var p1_h = 140.0
			_spawn_block(Vector2(150, floor_y - p1_h * 0.5), Vector2(30, p1_h), mat_heavy)
			_spawn_block(Vector2(390, floor_y - p1_h * 0.5), Vector2(30, p1_h), mat_heavy)
			
			var boss_type = "boss_baron_pig" if world == 4 else ("imperial_boar" if world == 3 else ("mine_wolf" if world == 2 else "fox_guard"))
			_spawn_enemy(Vector2(270, floor_y - 32), boss_type)
			_spawn_tnt(Vector2(195, floor_y - 20), true)
			_spawn_tnt(Vector2(345, floor_y - 20), true)

			# Sàn Tầng 2
			var b1_y = floor_y - p1_h - 12
			_spawn_block(Vector2(270, b1_y), Vector2(280, 24), mat_heavy)

			# Tầng 2: Cận vệ bảo vệ
			var p2_h = 100.0
			var p2_y = b1_y - 12 - p2_h * 0.5
			_spawn_block(Vector2(175, p2_y), Vector2(24, p2_h), mat1)
			_spawn_block(Vector2(365, p2_y), Vector2(24, p2_h), mat1)
			_spawn_enemy(Vector2(220, b1_y - 28), e_elite)
			_spawn_enemy(Vector2(320, b1_y - 28), e_elite)

			# Sàn Tầng 3
			var b2_y = b1_y - 24 - p2_h
			_spawn_block(Vector2(270, b2_y), Vector2(250, 22), mat1)

			# Tầng 3: Bẫy 2 Tảng Đá Lăn trên tháp canh
			_spawn_boulder(Vector2(190, b2_y - 32))
			_spawn_boulder(Vector2(350, b2_y - 32))
			_spawn_rescue_cage(Vector2(270, b2_y - 28))

			loadout = ["blackhole", "acid", "drill", "bomb", "bomb"]

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
