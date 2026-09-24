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

const WORLD_ENV_ASSETS: Dictionary = {
	1: {
		"sky": "res://assets/sprites/environment/worlds/sky_w01_farm.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w01_farm.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w01_farm.svg"
	},
	2: {
		"sky": "res://assets/sprites/environment/worlds/sky_w02_quarry.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w02_quarry.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w02_quarry.svg"
	},
	3: {
		"sky": "res://assets/sprites/environment/worlds/sky_w03_industrial.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w03_industrial.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w03_industrial.svg"
	},
	4: {
		"sky": "res://assets/sprites/environment/worlds/sky_w04_lava.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w04_lava.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w04_lava.svg"
	},
	5: {
		"sky": "res://assets/sprites/environment/worlds/sky_w05_crystal.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w05_crystal.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w05_crystal.svg"
	},
	6: {
		"sky": "res://assets/sprites/environment/worlds/sky_w06_cyber.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w06_cyber.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w06_cyber.svg"
	},
	7: {
		"sky": "res://assets/sprites/environment/worlds/sky_w07_toxic.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w07_toxic.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w07_toxic.svg"
	},
	8: {
		"sky": "res://assets/sprites/environment/worlds/sky_w08_glacier.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w08_glacier.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w08_glacier.svg"
	},
	9: {
		"sky": "res://assets/sprites/environment/worlds/sky_w09_dragon.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w09_dragon.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w09_dragon.svg"
	},
	10: {
		"sky": "res://assets/sprites/environment/worlds/sky_w10_celestial.svg",
		"cavern": "res://assets/sprites/environment/worlds/cavern_w10_celestial.svg",
		"cliff": "res://assets/sprites/environment/worlds/cliff_w10_celestial.svg"
	}
}

var default_cam_pos: Vector2 = Vector2.ZERO
var default_cam_zoom: Vector2 = Vector2.ONE
var active_tracking_egg: Node2D = null

func _safe_load(path: String) -> Texture2D:
	return ParticleHelper._safe_load(path)

func _ready() -> void:
	if GameManager.current_level > 0:
		level_id = GameManager.current_level
	_setup_level()

func _setup_level() -> void:
	var world_id = clamp(int(float(level_id - 1) / 20.0) + 1, 1, 10)
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
		5: # World 5: Crystal Void Citadel (Thánh địa pha lê tím huyền bí)
			bg_sky.color = Color(0.14, 0.04, 0.24)
			bg_dirt.color = Color(0.18, 0.10, 0.28)
			bg_cavern.color = Color(0.08, 0.02, 0.14)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(0.85, 0.70, 0.98)
		6: # World 6: Cyber Tech Bunker (Hầm công nghệ cao neon xanh)
			bg_sky.color = Color(0.12, 0.18, 0.28)
			bg_dirt.color = Color(0.15, 0.20, 0.25)
			bg_cavern.color = Color(0.06, 0.08, 0.12)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(0.75, 0.88, 1.0)
		7: # World 7: Toxic Jungle Cavern (Rừng độc ngầm đầm lầy)
			bg_sky.color = Color(0.20, 0.35, 0.22)
			bg_dirt.color = Color(0.14, 0.24, 0.12)
			bg_cavern.color = Color(0.05, 0.12, 0.06)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(0.70, 0.95, 0.75)
		8: # World 8: Sub-Zero Glacier Vault (Hầm kho băng vĩnh cửu)
			bg_sky.color = Color(0.40, 0.65, 0.85)
			bg_dirt.color = Color(0.20, 0.35, 0.45)
			bg_cavern.color = Color(0.08, 0.16, 0.25)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(0.85, 0.95, 1.0)
		9: # World 9: Ancient Dragon Abyss (Vực thẳm rồng lửa cổ đại)
			bg_sky.color = Color(0.35, 0.12, 0.08)
			bg_dirt.color = Color(0.22, 0.08, 0.05)
			bg_cavern.color = Color(0.10, 0.02, 0.02)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(1.0, 0.70, 0.60)
		10: # World 10: Celestial Singularity Nexus (Thần điện vũ trụ tối thượng)
			bg_sky.color = Color(0.08, 0.02, 0.18)
			bg_dirt.color = Color(0.12, 0.04, 0.22)
			bg_cavern.color = Color(0.04, 0.01, 0.08)
			if bg_cavern_backdrop: bg_cavern_backdrop.modulate = Color(0.90, 0.60, 1.0)

	# 2. Quy mô công trình CỰC ĐẠI THEO THẾ GIỚI & GIAI ĐOẠN
	var world_stage = (level_id - 1) % 20 + 1
	var cavern_half_width = 260.0
	match world_id:
		1: cavern_half_width = 260.0 + (world_stage - 1) * 3.0 # 260 -> 317
		2: cavern_half_width = 330.0 + (world_stage - 1) * 4.0 # 330 -> 406
		3: cavern_half_width = 400.0 + (world_stage - 1) * 4.0 # 400 -> 476
		4: cavern_half_width = 470.0 + (world_stage - 1) * 4.0 # 470 -> 546
		5: cavern_half_width = 520.0 + (world_stage - 1) * 5.0 # 520 -> 615
		6: cavern_half_width = 540.0 + (world_stage - 1) * 4.0 # 540 -> 616
		7: cavern_half_width = 560.0 + (world_stage - 1) * 4.0 # 560 -> 636
		8: cavern_half_width = 580.0 + (world_stage - 1) * 4.0 # 580 -> 656
		9: cavern_half_width = 600.0 + (world_stage - 1) * 4.0 # 600 -> 676
		10: cavern_half_width = 620.0 + (world_stage - 1) * 5.0 # 620 -> 715

	var left_edge_x = 30.0
	var cx = left_edge_x + cavern_half_width
	var right_edge_x = left_edge_x + cavern_half_width * 2.0
	var total_w = right_edge_x + 30.0

	var floor_y = 840.0 + min((world_id - 1) * 12.0, 92.0)
	if has_node("/root/GameManager"):
		get_node("/root/GameManager").current_floor_y = floor_y
	var cavern_top_y = clamp(380.0 - (min(world_id, 6) * 18.0) - (world_stage * 2.0), 200.0, 380.0)
	var cavern_bottom_y = floor_y
	intro_target_y = (cavern_bottom_y - 20.0 + cavern_top_y) * 0.5

	var cav_mid_y = (cavern_top_y + cavern_bottom_y) * 0.5
	var cav_height = cavern_bottom_y - cavern_top_y
	var cav_width = right_edge_x - left_edge_x

	# Cập nhật hình ảnh bối cảnh phong phú theo từng Thế Giới
	_apply_world_environment(world_id, left_edge_x, right_edge_x, cx, total_w, cavern_top_y, floor_y, cav_mid_y, cav_width, cav_height)

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

	_spawn_environment_decorations(world_id, left_edge_x, right_edge_x, cx, cavern_top_y, floor_y)
	_setup_ambient_atmosphere(world_id, total_w, cavern_top_y, floor_y)

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
	var target_zoom_val = clamp(540.0 / (cav_width + 60.0), 0.38, 1.0)
	var cam_y = (cavern_top_y - 120.0 + floor_y + 60.0) * 0.5
	default_cam_pos = Vector2(cx, cam_y)
	default_cam_zoom = Vector2(target_zoom_val, target_zoom_val)
	var cam = get_node_or_null("CameraShake2D") as Camera2D
	if cam:
		cam.global_position = default_cam_pos
		cam.zoom = default_cam_zoom

	# Gà oanh tạc lượn theo sải cánh bầu trời tương ứng
	var chicken = get_node_or_null("ChickenBomber")
	if chicken:
		chicken.min_x = left_edge_x + 35.0
		chicken.max_x = right_edge_x - 35.0
		chicken.default_y = cavern_top_y - 120.0
		chicken.position = Vector2(cx, chicken.default_y)
		chicken.move_speed = 160.0 + min((world_id - 1) * 16.0, 120.0)
		if not chicken.egg_spawned.is_connected(_on_egg_spawned):
			chicken.egg_spawned.connect(_on_egg_spawned)

	# 3. Phân bổ quái vật & vật liệu theo 10 Thế Giới
	var primary_mat = "wood"
	var secondary_mat = "stone"
	var heavy_mat = "stone"
	var enemy_grunt = "sly_fox"
	var enemy_elite = "fox_guard"

	match world_id:
		2:
			primary_mat = "stone"
			secondary_mat = "wood"
			heavy_mat = "steel"
			enemy_grunt = "armored_raccoon"
			enemy_elite = "mine_wolf"
		3:
			primary_mat = "steel"
			secondary_mat = "stone"
			heavy_mat = "obsidian"
			enemy_grunt = "spike_hound"
			enemy_elite = "toxic_fox"
		4:
			primary_mat = "obsidian"
			secondary_mat = "steel"
			heavy_mat = "obsidian"
			enemy_grunt = "imperial_boar"
			enemy_elite = "lava_golem"
		5:
			primary_mat = "crystal"
			secondary_mat = "glass"
			heavy_mat = "obsidian"
			enemy_grunt = "crystal_badger"
			enemy_elite = "celestial_sentinel"
		6: # World 6: Cyber Bunker (Neon Cyan Titanium Alloy)
			primary_mat = "cyber_alloy"
			secondary_mat = "steel"
			heavy_mat = "cyber_alloy"
			enemy_grunt = "cyber_hound"
			enemy_elite = "cyborg_fox"
		7: # World 7: Toxic Jungle (Ancient Mossy Swamp Wood)
			primary_mat = "swamp_wood"
			secondary_mat = "stone"
			heavy_mat = "swamp_wood"
			enemy_grunt = "swamp_mutant"
			enemy_elite = "spore_badger"
		8: # World 8: Glacier Vault (Glacial Permafrost & Crystal)
			primary_mat = "permafrost"
			secondary_mat = "crystal"
			heavy_mat = "permafrost"
			enemy_grunt = "frost_yeti"
			enemy_elite = "blizzard_wolf"
		9: # World 9: Dragon Abyss (Basalt Magma Brick & Obsidian)
			primary_mat = "magma_brick"
			secondary_mat = "obsidian"
			heavy_mat = "magma_brick"
			enemy_grunt = "magma_drake"
			enemy_elite = "lava_golem"
		10: # World 10: Celestial Nexus (Astral Marble & Gold Inlays)
			primary_mat = "celestial_stone"
			secondary_mat = "crystal"
			heavy_mat = "celestial_stone"
			enemy_grunt = "void_wraith"
			enemy_elite = "celestial_sentinel"

	# 4. Xây dựng công trình đại hầm & kho đạn
	egg_loadout = _generate_grand_bunker(level_id, world_id, cx, floor_y, primary_mat, secondary_mat, heavy_mat, enemy_grunt, enemy_elite)

	# 5. Khởi chạy màn chơi
	var enemies = get_tree().get_nodes_in_group("Enemies")
	var enemy_count = enemies.size()
	GameManager.start_level(level_id, enemy_count, egg_loadout)
	var destructibles = get_tree().get_nodes_in_group("Destructibles")
	GameManager.total_level_blocks = destructibles.size()


func _spawn_bastion_tier(center_x: float, base_y: float, span: float, pillar_h: float, mat: String, enemy_type: String = "", tnt_mode: int = 0) -> float:
	# tnt_mode: 0 = none, 1 = TNT, 2 = Nuke
	# Trụ chịu lực 28px tạo kết cấu vững chãi, triệt tiêu rung lắc
	var pillar_w = 28.0
	var p_y = base_y - pillar_h * 0.5
	_spawn_block(Vector2(center_x - span * 0.5, p_y), Vector2(pillar_w, pillar_h), mat)
	_spawn_block(Vector2(center_x + span * 0.5, p_y), Vector2(pillar_w, pillar_h), mat)

	# Dầm ngang kết cấu nhô đều 2 bên 24px tạo gờ chịu lực
	var beam_h = 24.0
	var beam_w = span + 48.0
	var beam_y = base_y - pillar_h - beam_h * 0.5
	_spawn_block(Vector2(center_x, beam_y), Vector2(beam_w, beam_h), mat)

	# Bố trí an toàn bên trong tầng: không chạm trụ, không đè nhau
	if enemy_type != "":
		var e_y_offset = 20.0
		if enemy_type.begins_with("boss_"):
			e_y_offset = 27.0
		elif enemy_type in ["imperial_boar", "mine_wolf", "spike_hound", "crystal_badger", "cyber_hound", "cyborg_fox", "swamp_mutant", "spore_badger", "frost_yeti", "blizzard_wolf", "magma_drake", "lava_golem", "void_wraith", "celestial_sentinel"]:
			e_y_offset = 23.0

		if tnt_mode > 0:
			var is_nuke = (tnt_mode == 2)
			var t_y_offset = 26.0 if is_nuke else 23.0
			var half_clearance = (span * 0.5 - 16.0)
			var offset_x = clamp(half_clearance * 0.45, 20.0, 36.0)
			_spawn_enemy(Vector2(center_x - offset_x, base_y - e_y_offset), enemy_type)
			_spawn_tnt(Vector2(center_x + offset_x, base_y - t_y_offset), is_nuke)
		else:
			_spawn_enemy(Vector2(center_x, base_y - e_y_offset), enemy_type)
	elif tnt_mode > 0:
		var is_nuke = (tnt_mode == 2)
		_spawn_tnt(Vector2(center_x, base_y - (26.0 if is_nuke else 23.0)), is_nuke)

	return base_y - pillar_h - beam_h

func _spawn_connecting_bridge(x_from: float, x_to: float, y_level: float, span_from: float, span_to: float, mat: String, floor_y_ref: float, _has_t2_from: bool = false, _has_t2_to: bool = false, _t2_span_from: float = 0.0, _t2_span_to: float = 0.0) -> void:
	if x_from > x_to:
		var tx = x_from; x_from = x_to; x_to = tx
		var ts = span_from; span_from = span_to; span_to = ts

	# Mép trong của 2 tháp
	var inner_from = x_from + span_from * 0.5
	var inner_to = x_to - span_to * 0.5

	# Cầu bắc ngang gối trực tiếp lên dầm của 2 tháp mỗi bên 16px (triệt tiêu hoàn toàn khe hở lơ lửng)
	var start_x = inner_from - 16.0
	var end_x = inner_to + 16.0
	var bridge_w = end_x - start_x
	if bridge_w < 20.0: return

	var bridge_cx = (start_x + end_x) * 0.5
	var bridge_h = 20.0
	var bridge_y = y_level - bridge_h * 0.5

	# Dầm cầu chính kiên cố
	_spawn_block(Vector2(bridge_cx, bridge_y), Vector2(bridge_w, bridge_h), mat)

	# Trụ đá chống võng ở giữa cầu nối chạm nền đất
	if bridge_w > 60.0:
		var pier_h = floor_y_ref - y_level
		if pier_h > 24.0:
			_spawn_block(Vector2(bridge_cx, floor_y_ref - pier_h * 0.5), Vector2(28.0, pier_h), mat)

func _spawn_watchtower(pos_x: float, floor_y: float, tower_h: float, mat: String, enemy_type: String = "") -> void:
	var col_w = 24.0
	var col_dist = 22.0
	var p_y = floor_y - tower_h * 0.5

	# Móng đế vọng lâu tiếp đất vững vàng
	_spawn_block(Vector2(pos_x, floor_y - 12.0), Vector2(76.0, 24.0), mat)
	# 2 cột trụ chịu lực song song kiên cố
	_spawn_block(Vector2(pos_x - col_dist, p_y - 12.0), Vector2(col_w, tower_h - 24.0), mat)
	_spawn_block(Vector2(pos_x + col_dist, p_y - 12.0), Vector2(col_w, tower_h - 24.0), mat)
	# Sàn quan sát trên đỉnh
	var roof_y = floor_y - tower_h
	_spawn_block(Vector2(pos_x, roof_y - 10.0), Vector2(88.0, 20.0), mat)
	# Hai gờ tường chắn đạn bảo vệ xạ thủ 2 bên
	_spawn_block(Vector2(pos_x - 34.0, roof_y - 24.0), Vector2(16.0, 16.0), mat)
	_spawn_block(Vector2(pos_x + 34.0, roof_y - 24.0), Vector2(16.0, 16.0), mat)

	if enemy_type != "":
		_spawn_enemy(Vector2(pos_x, roof_y - 36.0), enemy_type)

func _spawn_boulder(pos: Vector2, _span: float = 80.0, mat: String = "stone") -> void:
	# Bệ nôi đá 24x24 hai bên giữ tảng đá nằm yên 100% trong nôi
	var curb_w = 24.0
	var curb_h = 24.0
	var curb_dist = 38.0
	var curb_y = pos.y + 16.0
	_spawn_block(Vector2(pos.x - curb_dist, curb_y), Vector2(curb_w, curb_h), mat)
	_spawn_block(Vector2(pos.x + curb_dist, curb_y), Vector2(curb_w, curb_h), mat)

	var b = BoulderScene.instantiate()
	b.position = pos
	bunker_structure.add_child(b)

func _generate_grand_bunker(lvl: int, world: int, cx: float, floor_y: float, mat1: String, mat2: String, mat_heavy: String, e_grunt: String, e_elite: String) -> Array[String]:
	var loadout: Array[String] = []
	var is_boss_level = (lvl % 20 == 0)
	var world_stage = (lvl - 1) % 20 + 1

	match world:
		1:
			# =========================================================================
			# WORLD 1: FARM CAVERN (Tháp Gỗ & Nông Trại Đá) - Quy Mô Tăng Dần 1 đến 10 Quái
			# =========================================================================
			var tw_cx = cx - 180.0
			var te_cx = cx + 180.0
			var tx_sniper_w = cx - 290.0
			var tx_sniper_e = cx + 290.0

			# 1. Pháo Đài Trung Tâm (Center Citadel)
			var c_tnt = 0 if world_stage == 1 else 1
			var c_enemy = "boss_baron_pig" if is_boss_level else e_grunt
			var r1 = _spawn_bastion_tier(cx, floor_y, 144.0, 120.0, mat1, c_enemy, c_tnt)

			var r2 = r1
			if world_stage >= 2:
				var e2 = e_elite if (world_stage >= 6 and not is_boss_level) else e_grunt
				if is_boss_level: e2 = e_elite
				r2 = _spawn_bastion_tier(cx, r1, 116.0, 96.0, mat1, e2, 0)

			var r3 = r2
			if world_stage >= 6:
				var e3 = e_elite if (world_stage >= 10 and not is_boss_level) else (e_grunt if world_stage >= 7 else "")
				r3 = _spawn_bastion_tier(cx, r2, 84.0, 80.0, mat_heavy, e3, 0)

			# 2. Tháp Tiền Đồn Tây (West Outpost, Stage 3+)
			var rw1 = floor_y
			var rw2 = rw1
			if world_stage >= 3:
				rw1 = _spawn_bastion_tier(tw_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 0)
				rw2 = rw1
				if world_stage >= 5:
					var ew2 = e_grunt if world_stage >= 5 else ""
					rw2 = _spawn_bastion_tier(tw_cx, rw1, 84.0, 88.0, mat2, ew2, 0)
				_spawn_connecting_bridge(tw_cx, cx, r1, 116.0, 144.0, mat1, floor_y, world_stage >= 5, world_stage >= 2, 84.0, 116.0)

			# 3. Tháp Phòng Ngự Đông (East Bastion, Stage 4+)
			var re1 = floor_y
			var re2 = re1
			if world_stage >= 4:
				re1 = _spawn_bastion_tier(te_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 0)
				re2 = re1
				if world_stage >= 8:
					var ee2 = e_grunt if world_stage >= 8 else ""
					re2 = _spawn_bastion_tier(te_cx, re1, 84.0, 88.0, mat2, ee2, 0)
					if world_stage % 4 == 1:
						_spawn_rescue_cage(Vector2(te_cx, re2 - 20.0))
				_spawn_connecting_bridge(cx, te_cx, r1, 144.0, 116.0, mat1, floor_y, world_stage >= 2, world_stage >= 8, 116.0, 84.0)

			# 4. Vọng Lâu Bắn Tỉa Tây (Stage 11+)
			if world_stage >= 11:
				_spawn_watchtower(tx_sniper_w, floor_y, 160.0, mat1, e_grunt)

			# 5. Tiền Tiêu Viễn Đông (Stage 15+)
			if world_stage >= 15:
				_spawn_watchtower(tx_sniper_e, floor_y, 160.0, mat1, e_elite if world_stage >= 17 else e_grunt)

			# Boulders
			if world_stage >= 6:
				_spawn_boulder(Vector2(cx, r3 - 28.0), 84.0, mat_heavy)
			if world_stage >= 9 and rw1 < floor_y:
				_spawn_boulder(Vector2(tw_cx, rw2 - 28.0), 84.0, mat1)
			if world_stage >= 13 and re1 < floor_y:
				_spawn_boulder(Vector2(te_cx, re2 - 28.0), 84.0, mat1)

			# Loadout World 1
			if world_stage == 1:
				loadout = ["normal", "normal", "bomb"]
			elif world_stage == 2:
				loadout = ["normal", "bomb", "normal", "drill"]
			elif world_stage <= 5:
				loadout = ["normal", "bomb", "normal", "drill", "bomb"]
			elif world_stage <= 9:
				loadout = ["normal", "bomb", "drill", "normal", "drill", "bomb"]
			elif world_stage <= 14:
				loadout = ["normal", "bomb", "drill", "normal", "drill", "bomb", "bomb"]
			elif world_stage < 20:
				loadout = ["normal", "bomb", "drill", "cluster", "drill", "bomb", "bomb", "bomb"]
			else: # Boss Level 20
				loadout = ["bomb", "drill", "cluster", "drill", "bomb", "bomb", "bomb", "bomb"]

		2:
			# =========================================================================
			# WORLD 2: STONE QUARRY (Mỏ Đá Hoàng Hôn) - 3 đến 10 Quái Vật Tăng Dần
			# =========================================================================
			var tw_cx = cx - 210.0
			var te_cx = cx + 210.0
			var tx_sniper = cx - 315.0
			var tx_sniper_e = cx + 315.0

			# 1. Đại Pháo Đài Trung Tâm (3 tầng đá & thép kiên cố)
			var r1 = _spawn_bastion_tier(cx, floor_y, 144.0, 120.0, mat1, "boss_iron_crusher" if is_boss_level else e_elite, 1)
			var r2 = _spawn_bastion_tier(cx, r1, 116.0, 96.0, mat_heavy, e_grunt, 0)
			var r3 = r2
			if world_stage >= 4:
				r3 = _spawn_bastion_tier(cx, r2, 84.0, 80.0, mat_heavy, e_elite, 0)

			# 2. Tháp Cần Cẩu Tây (West Quarry Crane)
			var rw1 = _spawn_bastion_tier(tw_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 1)
			var rw2 = rw1
			if world_stage >= 3:
				rw2 = _spawn_bastion_tier(tw_cx, rw1, 84.0, 92.0, mat2, e_grunt if world_stage >= 8 else "", 0)
			_spawn_connecting_bridge(tw_cx, cx, r1, 116.0, 144.0, mat1, floor_y, world_stage >= 3, world_stage >= 4, 84.0, 116.0)
			_spawn_boulder(Vector2(tw_cx, rw2 - 28.0), 84.0, mat1)

			# 3. Tháp Quặng Đông (East Ore Bastion)
			var re1 = floor_y
			var re2 = re1
			if world_stage >= 2:
				re1 = _spawn_bastion_tier(te_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 0)
				re2 = re1
				if world_stage >= 5:
					re2 = _spawn_bastion_tier(te_cx, re1, 84.0, 92.0, mat_heavy, e_elite, 0)
				_spawn_connecting_bridge(cx, te_cx, r1, 144.0, 116.0, mat1, floor_y, world_stage >= 4, world_stage >= 5, 116.0, 84.0)
				_spawn_boulder(Vector2(te_cx, re2 - 28.0), 84.0, mat_heavy)

			# 4. Vọng Lâu Bắn Tỉa Trên Vách Đá (Sniper Overlook, Stage 6+)
			if world_stage >= 6:
				_spawn_watchtower(tx_sniper, floor_y, 160.0, mat1, e_grunt)

			# 5. Tiền Tiêu Quặng Viễn Đông (Far East Mining Post, Stage 12+)
			if world_stage >= 12:
				_spawn_watchtower(tx_sniper_e, floor_y, 160.0, mat1, e_elite if world_stage >= 16 else e_grunt)

			if world_stage % 3 == 0:
				_spawn_updraft(Vector2(cx - 105.0, floor_y))

			# Loadout World 2
			if world_stage <= 4:
				loadout = ["drill", "frost", "bomb", "normal", "drill"]
			elif world_stage <= 9:
				loadout = ["drill", "frost", "bomb", "drill", "frost", "bomb"]
			elif world_stage < 20:
				loadout = ["drill", "frost", "bomb", "bomb", "drill", "frost", "bomb"]
			else: # Boss Level 40
				loadout = ["drill", "frost", "bomb", "bomb", "drill", "frost", "bomb", "bomb"]

		3:
			# =========================================================================
			# WORLD 3: STEAMPUNK CHEMICAL (Khu Công Nghiệp Hóa Chất) - 4 đến 10 Quái Vật Tăng Dần
			# =========================================================================
			var s1_cx = cx - 280.0
			var s3_cx = cx + 240.0
			var s4_cx = cx + 360.0
			var s_far_w = cx - 390.0

			# 1. Bể Axit Hóa Chất Tây (West Chemical Vat & Vent)
			_spawn_updraft(Vector2(s1_cx - 50.0, floor_y))
			var rs1_1 = _spawn_bastion_tier(s1_cx, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
			var rs1_2 = rs1_1
			if world_stage >= 4:
				rs1_2 = _spawn_bastion_tier(s1_cx, rs1_1, 90.0, 90.0, mat2, e_elite, 0)

			# 2. Đại Lò Luyện Trung Tâm (Central Smelting Bastion)
			var rc1 = _spawn_bastion_tier(cx, floor_y, 150.0, 120.0, mat_heavy, "boss_toxic_alchemist" if is_boss_level else e_elite, 2)
			var rc2 = _spawn_bastion_tier(cx, rc1, 120.0, 96.0, mat1, e_grunt, 0)
			var rc3 = rc2
			if world_stage >= 3:
				rc3 = _spawn_bastion_tier(cx, rc2, 88.0, 84.0, mat_heavy, e_elite, 0)
				_spawn_boulder(Vector2(cx, rc3 - 28.0), 88.0, mat_heavy)

			_spawn_connecting_bridge(s1_cx, cx, rs1_1, 120.0, 150.0, mat1, floor_y, world_stage >= 4, world_stage >= 3, 90.0, 120.0)

			# 3. Tháp Nồi Hơi Đông (East Boiler Tower)
			var rs3_1 = floor_y
			var rs3_2 = rs3_1
			if world_stage >= 2:
				rs3_1 = _spawn_bastion_tier(s3_cx, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
				rs3_2 = rs3_1
				if world_stage >= 5:
					rs3_2 = _spawn_bastion_tier(s3_cx, rs3_1, 90.0, 90.0, mat_heavy, e_elite, 0)
				_spawn_connecting_bridge(cx, s3_cx, rc1, 150.0, 120.0, mat1, floor_y, world_stage >= 3, world_stage >= 5, 120.0, 90.0)

			# 4. Giàn Giáo Treo Trên Không (High Conveyor Watchtower, Stage 7+)
			if world_stage >= 7:
				_spawn_watchtower(s4_cx, floor_y, 180.0, mat1, e_grunt)

			# 5. Tiền Tiêu Bể Thải Viễn Tây (Far West Toxic Sump, Stage 13+)
			if world_stage >= 13:
				_spawn_watchtower(s_far_w, floor_y, 170.0, mat1, e_elite if world_stage >= 17 else e_grunt)

			# Loadout World 3
			if world_stage <= 4:
				loadout = ["acid", "cluster", "drill", "bomb", "acid", "cluster"]
			elif world_stage <= 9:
				loadout = ["acid", "cluster", "drill", "bomb", "cluster", "acid", "bomb"]
			elif world_stage < 20:
				loadout = ["acid", "drill", "bomb", "cluster", "acid", "drill", "bomb", "bomb"]
			else: # Boss Level 60
				loadout = ["acid", "drill", "bomb", "cluster", "acid", "drill", "blackhole", "bomb"]

		4:
			# =========================================================================
			# WORLD 4: LAVA CORE IMPERIAL CITADEL (Đại Hoàng Cung Nham Thạch) - 5 đến 11 Quái Vật Tăng Dần
			# =========================================================================
			var b1_cx = cx - 380.0
			var b2_cx = cx - 190.0
			var b4_cx = cx + 190.0
			var b5_cx = cx + 380.0

			# Bastion 2: Kho Vũ Khí Hoàng Gia Tây
			var rb2_1 = _spawn_bastion_tier(b2_cx, floor_y, 126.0, 120.0, mat_heavy, e_grunt, 0)
			var rb2_2 = rb2_1
			if world_stage >= 3:
				rb2_2 = _spawn_bastion_tier(b2_cx, rb2_1, 92.0, 92.0, mat1, e_grunt if world_stage >= 8 else "", 0)
			_spawn_boulder(Vector2(b2_cx, rb2_2 - 28.0), 92.0, mat_heavy)

			# Bastion 3: Cung Điện Ngai Vàng Hoàng Gia Trung Tâm (Imperial High Palace)
			var e_boss = "boss_magma_emperor" if is_boss_level else e_elite
			var rc1 = _spawn_bastion_tier(cx, floor_y, 156.0, 120.0, mat_heavy, e_boss, 2)
			var rc2 = _spawn_bastion_tier(cx, rc1, 120.0, 96.0, mat_heavy, e_grunt, 0)
			var rc3 = rc2
			if world_stage >= 4:
				rc3 = _spawn_bastion_tier(cx, rc2, 88.0, 84.0, mat_heavy, e_elite, 0)
			_spawn_boulder(Vector2(cx, rc3 - 28.0), 88.0, mat_heavy)

			_spawn_connecting_bridge(b2_cx, cx, rb2_1, 126.0, 156.0, mat1, floor_y, world_stage >= 3, world_stage >= 4, 92.0, 120.0)

			# Bastion 4: Hầm Silo Hạt Nhân Đông
			var rb4_1 = _spawn_bastion_tier(b4_cx, floor_y, 126.0, 120.0, mat_heavy, e_grunt, 2)
			var rb4_2 = rb4_1
			if world_stage >= 5:
				rb4_2 = _spawn_bastion_tier(b4_cx, rb4_1, 92.0, 92.0, mat1, e_grunt, 0)
			_spawn_connecting_bridge(cx, b4_cx, rc1, 156.0, 126.0, mat1, floor_y, world_stage >= 4, world_stage >= 5, 120.0, 92.0)
			_spawn_boulder(Vector2(b4_cx, rb4_2 - 28.0), 92.0, mat_heavy)

			# Bastion 1: Tiền Đồn Cửa Ải Tây (Stage 2+)
			var rb1 = floor_y
			if world_stage >= 2:
				rb1 = _spawn_bastion_tier(b1_cx, floor_y, 116.0, 120.0, mat1, e_grunt, 1)
				_spawn_connecting_bridge(b1_cx, b2_cx, rb1, 116.0, 126.0, mat1, floor_y, false, world_stage >= 3, 0.0, 92.0)

			# Bastion 5: Tháp Can Rồng Viễn Đông (Outer East Dragon Watchtower, Stage 6+)
			if world_stage >= 6:
				var rb5 = _spawn_bastion_tier(b5_cx, floor_y, 116.0, 120.0, mat1, e_elite, 0)
				_spawn_connecting_bridge(b4_cx, b5_cx, rb4_1, 126.0, 116.0, mat1, floor_y, world_stage >= 5, false, 92.0, 0.0)

			# Bastion 6: Vọng Lâu Hoàng Gia Bầu Trời (Imperial Sky Perch, Stage 14+)
			if world_stage >= 14:
				_spawn_watchtower(cx - 285.0, floor_y, 190.0, mat_heavy, e_elite)

			# Loadout World 4
			if world_stage <= 4:
				loadout = ["blackhole", "acid", "drill", "bomb", "drill", "blackhole", "bomb"]
			elif world_stage <= 9:
				loadout = ["blackhole", "acid", "drill", "bomb", "blackhole", "acid", "bomb"]
			elif world_stage < 20:
				loadout = ["blackhole", "acid", "drill", "bomb", "blackhole", "drill", "acid", "bomb"]
			else: # Boss Level 80
				loadout = ["blackhole", "bomb", "drill", "acid", "blackhole", "drill", "acid", "bomb"]

		5:
			# =========================================================================
			# WORLD 5: CRYSTAL VOID CITADEL (Thánh Địa Pha Lê Tối Cao) - Màn 81 đến 100
			# =========================================================================
			var c5_w2 = cx - 410.0
			var c5_w1 = cx - 210.0
			var c5_e1 = cx + 210.0
			var c5_e2 = cx + 410.0

			# 1. Hầm Updraft Khí Lưu Tinh Thể
			_spawn_updraft(Vector2(c5_w2 - 50.0, floor_y))
			if world_stage >= 5:
				_spawn_updraft(Vector2(c5_e2 + 50.0, floor_y))

			# 2. Tháp Tiền Tiêu Thạch Anh Tây
			var rw_1 = _spawn_bastion_tier(c5_w2, floor_y, 116.0, 120.0, mat1, e_grunt, 1)
			var rw_2 = rw_1
			if world_stage >= 4:
				rw_2 = _spawn_bastion_tier(c5_w2, rw_1, 88.0, 88.0, mat2, e_elite, 0)
				_spawn_boulder(Vector2(c5_w2, rw_2 - 28.0), 88.0, mat_heavy)

			# 3. Pháo Đài Cánh Trái
			var r_wl1 = _spawn_bastion_tier(c5_w1, floor_y, 120.0, 110.0, mat1, e_grunt, 0)
			_spawn_connecting_bridge(c5_w2, c5_w1, rw_1, 116.0, 120.0, mat1, floor_y, world_stage >= 4, false, 88.0, 0.0)

			# 4. ĐẠI ĐIỆN VỰC THẲM TRUNG TÂM (Grand Void Sanctum - 3 Tầng Kiên Cố)
			var final_boss = "boss_crystal_overlord" if is_boss_level else (e_elite if world_stage >= 10 else e_grunt)
			var rc_1 = _spawn_bastion_tier(cx, floor_y, 160.0, 120.0, mat_heavy, final_boss, 2)
			var rc_2 = _spawn_bastion_tier(cx, rc_1, 126.0, 96.0, mat1, e_elite if (world_stage >= 6 and not is_boss_level) else e_grunt, 1)
			var rc_3 = _spawn_bastion_tier(cx, rc_2, 92.0, 84.0, mat2, e_grunt if world_stage >= 12 else "", 0)
			_spawn_boulder(Vector2(cx, rc_3 - 28.0), 92.0, mat_heavy)

			_spawn_connecting_bridge(c5_w1, cx, r_wl1, 120.0, 160.0, mat1, floor_y, false, true, 0.0, 126.0)

			# 5. Pháo Đài Cánh Phải
			var r_el1 = _spawn_bastion_tier(c5_e1, floor_y, 120.0, 110.0, mat1, e_grunt, 0)
			_spawn_connecting_bridge(cx, c5_e1, rc_1, 160.0, 120.0, mat1, floor_y, true, false, 126.0, 0.0)

			# 6. Tháp Vũ Khí Pha Lê Đông
			var re_1 = _spawn_bastion_tier(c5_e2, floor_y, 116.0, 120.0, mat1, e_elite, 2)
			var re_2 = re_1
			if world_stage >= 6:
				re_2 = _spawn_bastion_tier(c5_e2, re_1, 88.0, 88.0, mat_heavy, e_grunt, 0)
				_spawn_boulder(Vector2(c5_e2, re_2 - 28.0), 88.0, mat_heavy)
			_spawn_connecting_bridge(c5_e1, c5_e2, r_el1, 120.0, 116.0, mat1, floor_y, false, world_stage >= 6, 0.0, 88.0)

			# 7. Lồng Gà Giải Cứu
			if world_stage % 4 == 1 and r_wl1 < floor_y:
				_spawn_rescue_cage(Vector2(c5_w1, r_wl1 - 22.0))

			# 8. Kho Đạn Trứng World 5
			if world_stage <= 5:
				loadout = ["blackhole", "acid", "drill", "cluster", "bomb", "blackhole"]
			elif world_stage <= 12:
				loadout = ["blackhole", "acid", "drill", "cluster", "bomb", "acid", "blackhole"]
			elif world_stage < 20:
				loadout = ["blackhole", "drill", "acid", "cluster", "bomb", "drill", "acid", "blackhole"]
			else: # Level 100
				loadout = ["blackhole", "drill", "acid", "cluster", "bomb", "blackhole", "drill", "blackhole"]

		6:
			# =========================================================================
			# WORLD 6: CYBER TECH BUNKER (Hầm Công Nghệ Cao) - Màn 101 đến 120
			# =========================================================================
			var c6_w = cx - 280.0
			var c6_e = cx + 280.0
			var c6_catwalk = cx + 380.0

			# 1. Tháp Máy Chủ Trung Tâm (Central Server Vault)
			var r_boss6 = "boss_cyber_mech" if is_boss_level else e_elite
			var rc6_1 = _spawn_bastion_tier(cx, floor_y, 150.0, 120.0, mat_heavy, r_boss6, 2)
			var rc6_2 = _spawn_bastion_tier(cx, rc6_1, 120.0, 96.0, mat1, e_grunt, 1)
			var rc6_3 = rc6_2
			if world_stage >= 4:
				rc6_3 = _spawn_bastion_tier(cx, rc6_2, 88.0, 84.0, mat2, e_elite, 0)
				_spawn_boulder(Vector2(cx, rc6_3 - 28.0), 88.0, mat1)

			# 2. Silo Năng Lượng Tây (West Quantum Reactor)
			var rw6_1 = _spawn_bastion_tier(c6_w, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
			var rw6_2 = rw6_1
			if world_stage >= 5:
				rw6_2 = _spawn_bastion_tier(c6_w, rw6_1, 90.0, 90.0, mat2, e_elite, 0)
			_spawn_connecting_bridge(c6_w, cx, rw6_1, 120.0, 150.0, mat1, floor_y, world_stage >= 5, true, 90.0, 120.0)

			# 3. Trạm Laser Đông (East Laser Station)
			var re6_1 = _spawn_bastion_tier(c6_e, floor_y, 120.0, 120.0, mat1, e_grunt, 0)
			var re6_2 = re6_1
			if world_stage >= 3:
				re6_2 = _spawn_bastion_tier(c6_e, re6_1, 90.0, 90.0, mat_heavy, e_elite, 0)
				_spawn_boulder(Vector2(c6_e, re6_2 - 28.0), 90.0, mat_heavy)
			_spawn_connecting_bridge(cx, c6_e, rc6_1, 150.0, 120.0, mat1, floor_y, true, world_stage >= 3, 120.0, 90.0)

			# 4. Giàn Giáo Treo Bắn Tỉa (High Cyber Watchtower, Stage 6+)
			if world_stage >= 6:
				_spawn_watchtower(c6_catwalk, floor_y, 200.0, mat1, e_grunt)

			if world_stage % 4 == 2:
				_spawn_rescue_cage(Vector2(c6_w, rw6_2 - 20.0))

			# Loadout World 6
			if world_stage <= 5:
				loadout = ["drill", "acid", "cluster", "bomb", "drill", "bomb"]
			elif world_stage <= 12:
				loadout = ["drill", "acid", "cluster", "bomb", "blackhole", "drill", "bomb"]
			elif world_stage < 20:
				loadout = ["drill", "acid", "blackhole", "cluster", "bomb", "drill", "acid", "bomb"]
			else: # Boss Level 120
				loadout = ["drill", "acid", "blackhole", "drill", "acid", "cluster", "bomb", "bomb"]

		7:
			# =========================================================================
			# WORLD 7: TOXIC JUNGLE CAVERN (Rừng Độc Hầm Ngầm) - Màn 121 đến 140
			# =========================================================================
			var c7_w2 = cx - 360.0
			var c7_w1 = cx - 180.0
			var c7_e1 = cx + 180.0
			var c7_e2 = cx + 360.0

			# 1. Hầm Khí Thở Rừng Độc
			_spawn_updraft(Vector2(c7_w1 - 40.0, floor_y))
			if world_stage >= 6:
				_spawn_updraft(Vector2(c7_e1 + 40.0, floor_y))

			# 2. Pháo Đài Rễ Cây Tây (West Root Bastion)
			var rw7_1 = _spawn_bastion_tier(c7_w1, floor_y, 126.0, 120.0, mat1, e_grunt, 1)
			var rw7_2 = rw7_1
			if world_stage >= 4:
				rw7_2 = _spawn_bastion_tier(c7_w1, rw7_1, 92.0, 92.0, mat2, e_elite, 0)
				_spawn_boulder(Vector2(c7_w1, rw7_2 - 28.0), 92.0, mat_heavy)

			# 3. ĐẠI ĐIỆN ĐẦM LẦY TRUNG TÂM (Central Toxic Sanctuary)
			var r_boss7 = "boss_swamp_hydra" if is_boss_level else e_elite
			var rc7_1 = _spawn_bastion_tier(cx, floor_y, 156.0, 120.0, mat_heavy, r_boss7, 2)
			var rc7_2 = _spawn_bastion_tier(cx, rc7_1, 120.0, 96.0, mat1, e_grunt, 0)
			var rc7_3 = rc7_2
			if world_stage >= 3:
				rc7_3 = _spawn_bastion_tier(cx, rc7_2, 88.0, 84.0, mat2, e_grunt, 0)
			_spawn_connecting_bridge(c7_w1, cx, rw7_1, 126.0, 156.0, mat1, floor_y, world_stage >= 4, true, 92.0, 120.0)

			# 4. Pháo Đài Gai Rừng Đông (East Thorn Bastion)
			var re7_1 = _spawn_bastion_tier(c7_e1, floor_y, 126.0, 120.0, mat1, e_grunt, 1)
			var re7_2 = re7_1
			if world_stage >= 5:
				re7_2 = _spawn_bastion_tier(c7_e1, re7_1, 92.0, 92.0, mat_heavy, e_elite, 0)
				_spawn_boulder(Vector2(c7_e1, re7_2 - 28.0), 92.0, mat_heavy)
			_spawn_connecting_bridge(cx, c7_e1, rc7_1, 156.0, 126.0, mat1, floor_y, true, world_stage >= 5, 120.0, 92.0)

			# 5. Tiền Tiêu Tháp Cây Viễn Tây & Viễn Đông
			if world_stage >= 8:
				_spawn_bastion_tier(c7_w2, floor_y, 110.0, 110.0, mat1, e_grunt, 0)
				_spawn_connecting_bridge(c7_w2, c7_w1, rw7_1, 110.0, 126.0, mat1, floor_y, false, world_stage >= 4, 0.0, 92.0)
			if world_stage >= 10:
				_spawn_bastion_tier(c7_e2, floor_y, 110.0, 110.0, mat1, e_elite, 0)
				_spawn_connecting_bridge(c7_e1, c7_e2, re7_1, 126.0, 110.0, mat1, floor_y, world_stage >= 5, false, 92.0, 0.0)

			if world_stage % 4 == 3 and rw7_2 < floor_y:
				_spawn_rescue_cage(Vector2(c7_w1, rw7_2 - 20.0))

			# Loadout World 7
			if world_stage <= 5:
				loadout = ["acid", "cluster", "frost", "bomb", "acid", "cluster"]
			elif world_stage <= 12:
				loadout = ["acid", "cluster", "frost", "drill", "bomb", "acid", "cluster"]
			elif world_stage < 20:
				loadout = ["acid", "cluster", "frost", "drill", "bomb", "acid", "blackhole", "bomb"]
			else: # Boss Level 140
				loadout = ["acid", "cluster", "frost", "drill", "blackhole", "acid", "cluster", "bomb"]

		8:
			# =========================================================================
			# WORLD 8: SUB-ZERO GLACIER VAULT (Kho Băng Vĩnh Cửu) - Màn 141 đến 160
			# =========================================================================
			var c8_w2 = cx - 380.0
			var c8_w1 = cx - 190.0
			var c8_e1 = cx + 190.0
			var c8_e2 = cx + 380.0

			# 1. Hầm Khí Gió Buốt Vĩnh Cửu
			_spawn_updraft(Vector2(c8_w2, floor_y))
			if world_stage >= 5:
				_spawn_updraft(Vector2(c8_e2, floor_y))

			# 2. Tháp Băng Cực Tây (West Permafrost Tower)
			var rw8_1 = _spawn_bastion_tier(c8_w1, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
			var rw8_2 = rw8_1
			if world_stage >= 4:
				rw8_2 = _spawn_bastion_tier(c8_w1, rw8_1, 90.0, 90.0, mat2, e_elite, 0)
				_spawn_boulder(Vector2(c8_w1, rw8_2 - 28.0), 90.0, mat_heavy)

			# 3. ĐẠI ĐIỆN BĂNG CỰC TRUNG TÂM (Glacier High Sanctum - 3 Tầng Pha Lê)
			var r_boss8 = "boss_frost_colossus" if is_boss_level else e_elite
			var rc8_1 = _spawn_bastion_tier(cx, floor_y, 156.0, 120.0, mat_heavy, r_boss8, 2)
			var rc8_2 = _spawn_bastion_tier(cx, rc8_1, 120.0, 96.0, mat1, e_grunt, 0)
			var rc8_3 = rc8_2
			if world_stage >= 3:
				rc8_3 = _spawn_bastion_tier(cx, rc8_2, 88.0, 84.0, mat2, e_elite, 0)
				_spawn_boulder(Vector2(cx, rc8_3 - 28.0), 88.0, mat_heavy)
			_spawn_connecting_bridge(c8_w1, cx, rw8_1, 120.0, 156.0, mat1, floor_y, world_stage >= 4, true, 90.0, 120.0)

			# 4. Tháp Thạch Nhũ Băng Đông (East Icicle Bastion)
			var re8_1 = _spawn_bastion_tier(c8_e1, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
			var re8_2 = re8_1
			if world_stage >= 5:
				re8_2 = _spawn_bastion_tier(c8_e1, re8_1, 90.0, 90.0, mat1, e_elite, 0)
				_spawn_boulder(Vector2(c8_e1, re8_2 - 28.0), 90.0, mat_heavy)
			_spawn_connecting_bridge(cx, c8_e1, rc8_1, 156.0, 120.0, mat1, floor_y, true, world_stage >= 5, 120.0, 90.0)

			# 5. Tiền Tiêu Băng Cực Viễn Đông
			if world_stage >= 7:
				var re8_far = _spawn_bastion_tier(c8_e2, floor_y, 110.0, 110.0, mat2, e_elite, 0)
				_spawn_connecting_bridge(c8_e1, c8_e2, re8_1, 120.0, 110.0, mat1, floor_y, world_stage >= 5, false, 90.0, 0.0)

			if world_stage % 4 == 0:
				_spawn_rescue_cage(Vector2(c8_w1, rw8_2 - 20.0))

			# Loadout World 8
			if world_stage <= 5:
				loadout = ["frost", "drill", "bomb", "frost", "drill", "cluster"]
			elif world_stage <= 12:
				loadout = ["frost", "drill", "bomb", "frost", "drill", "cluster", "bomb"]
			elif world_stage < 20:
				loadout = ["frost", "drill", "bomb", "frost", "drill", "cluster", "blackhole", "bomb"]
			else: # Boss Level 160
				loadout = ["frost", "drill", "blackhole", "frost", "drill", "cluster", "acid", "bomb"]

		9:
			# =========================================================================
			# WORLD 9: ANCIENT DRAGON ABYSS (Vực Thẳm Rồng Lửa) - Màn 161 đến 180
			# =========================================================================
			var c9_w2 = cx - 400.0
			var c9_w1 = cx - 200.0
			var c9_e1 = cx + 200.0
			var c9_e2 = cx + 400.0

			# 1. Tháp Cổng Tiền Tiêu Rồng Tây (West Dragon Gate)
			var rw9_1 = _spawn_bastion_tier(c9_w2, floor_y, 120.0, 120.0, mat1, e_grunt, 1)

			# 2. Pháo Đài Luyện Kim Obsidian Tây
			var rw9_2_1 = _spawn_bastion_tier(c9_w1, floor_y, 130.0, 120.0, mat_heavy, e_elite, 2)
			var rw9_2_2 = rw9_2_1
			if world_stage >= 3:
				rw9_2_2 = _spawn_bastion_tier(c9_w1, rw9_2_1, 96.0, 92.0, mat1, e_grunt, 0)
				_spawn_boulder(Vector2(c9_w1, rw9_2_2 - 28.0), 96.0, mat_heavy)
			_spawn_connecting_bridge(c9_w2, c9_w1, rw9_1, 120.0, 130.0, mat1, floor_y, false, world_stage >= 3, 0.0, 96.0)

			# 3. ĐẠI ĐIỆN NGAI VÀNG RỒNG TRUNG TÂM (Dragon Core Throne - 3 Tầng Obsidian)
			var r_boss9 = "boss_dragon_warlord" if is_boss_level else e_elite
			var rc9_1 = _spawn_bastion_tier(cx, floor_y, 160.0, 120.0, mat_heavy, r_boss9, 2)
			var rc9_2 = _spawn_bastion_tier(cx, rc9_1, 126.0, 96.0, mat_heavy, e_grunt, 0)
			var rc9_3 = _spawn_bastion_tier(cx, rc9_2, 92.0, 84.0, mat1, e_elite, 0)
			_spawn_boulder(Vector2(cx, rc9_3 - 28.0), 92.0, mat_heavy)
			_spawn_connecting_bridge(c9_w1, cx, rw9_2_1, 130.0, 160.0, mat1, floor_y, world_stage >= 3, true, 96.0, 126.0)

			# 4. Hầm Silo Hạt Nhân Núi Lửa Đông
			var re9_1 = _spawn_bastion_tier(c9_e1, floor_y, 130.0, 120.0, mat_heavy, e_grunt, 2)
			var re9_2 = re9_1
			if world_stage >= 4:
				re9_2 = _spawn_bastion_tier(c9_e1, re9_1, 96.0, 92.0, mat1, e_elite, 0)
				_spawn_boulder(Vector2(c9_e1, re9_2 - 28.0), 96.0, mat_heavy)
			_spawn_connecting_bridge(cx, c9_e1, rc9_1, 160.0, 130.0, mat1, floor_y, true, world_stage >= 4, 126.0, 96.0)

			# 5. Tháp Can Lửa Viễn Đông (Far East Magma Lookout)
			var re9_far = _spawn_bastion_tier(c9_e2, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
			_spawn_connecting_bridge(c9_e1, c9_e2, re9_1, 130.0, 120.0, mat1, floor_y, world_stage >= 4, false, 96.0, 0.0)

			if world_stage % 4 == 1 and rw9_2_1 < floor_y:
				_spawn_rescue_cage(Vector2(c9_w1, rw9_2_1 - 20.0))

			# Loadout World 9
			if world_stage <= 5:
				loadout = ["drill", "acid", "blackhole", "bomb", "drill", "acid", "bomb"]
			elif world_stage <= 12:
				loadout = ["drill", "acid", "blackhole", "drill", "acid", "cluster", "bomb", "bomb"]
			elif world_stage < 20:
				loadout = ["drill", "acid", "blackhole", "drill", "acid", "frost", "blackhole", "bomb"]
			else: # Boss Level 180
				loadout = ["drill", "acid", "blackhole", "drill", "acid", "blackhole", "cluster", "bomb"]

		10:
			# =========================================================================
			# WORLD 10: CELESTIAL SINGULARITY NEXUS (Thần Điện Vũ Trụ Tối Thượng) [181 - 200]
			# =========================================================================
			var c10_w2 = cx - 440.0
			var c10_w1 = cx - 220.0
			var c10_e1 = cx + 220.0
			var c10_e2 = cx + 440.0

			# 1. Giếng Trọng Lực Kép (Dual Anti-Gravity Updrafts)
			_spawn_updraft(Vector2(c10_w2 - 40.0, floor_y))
			_spawn_updraft(Vector2(c10_e2 + 40.0, floor_y))

			# 2. Tháp Hư Không Viễn Tây (West Singularity Spire)
			var rw10_1 = _spawn_bastion_tier(c10_w2, floor_y, 120.0, 120.0, mat1, e_grunt, 1)
			var rw10_2 = rw10_1
			if world_stage >= 3:
				rw10_2 = _spawn_bastion_tier(c10_w2, rw10_1, 92.0, 92.0, mat2, e_elite, 0)
				_spawn_boulder(Vector2(c10_w2, rw10_2 - 28.0), 92.0, mat_heavy)

			# 3. Pháo Đài Cánh Trái (West Celestial Bastion)
			var r_wl10 = _spawn_bastion_tier(c10_w1, floor_y, 130.0, 115.0, mat_heavy, e_elite, 0)
			_spawn_connecting_bridge(c10_w2, c10_w1, rw10_1, 120.0, 130.0, mat1, floor_y, world_stage >= 3, false, 92.0, 0.0)

			# 4. ĐẠI THẦN ĐIỆN VŨ TRỤ TỐI THƯỢNG (Celestial Supreme Citadel - 4 Tầng Siêu Cường)
			var ultimate_boss = "boss_singularity_prime" if is_boss_level else e_elite
			var rc10_1 = _spawn_bastion_tier(cx, floor_y, 168.0, 120.0, mat_heavy, ultimate_boss, 2)
			var rc10_2 = _spawn_bastion_tier(cx, rc10_1, 132.0, 100.0, mat1, e_elite, 1)
			var rc10_3 = _spawn_bastion_tier(cx, rc10_2, 98.0, 88.0, mat_heavy, e_grunt, 0)
			var rc10_4 = rc10_3
			if world_stage >= 5:
				rc10_4 = _spawn_bastion_tier(cx, rc10_3, 72.0, 76.0, mat2, e_elite, 0)
			_spawn_boulder(Vector2(cx, rc10_4 - 28.0), 72.0 if world_stage >= 5 else 98.0, mat_heavy)

			_spawn_connecting_bridge(c10_w1, cx, r_wl10, 130.0, 168.0, mat1, floor_y, false, true, 0.0, 132.0)

			# 5. Pháo Đài Cánh Phải (East Celestial Bastion)
			var r_el10 = _spawn_bastion_tier(c10_e1, floor_y, 130.0, 115.0, mat_heavy, e_grunt, 0)
			_spawn_connecting_bridge(cx, c10_e1, rc10_1, 168.0, 130.0, mat1, floor_y, true, false, 132.0, 0.0)

			# 6. Tháp Hư Không Viễn Đông (East Singularity Spire)
			var re10_1 = _spawn_bastion_tier(c10_e2, floor_y, 120.0, 120.0, mat1, e_elite, 2)
			var re10_2 = re10_1
			if world_stage >= 4:
				re10_2 = _spawn_bastion_tier(c10_e2, re10_1, 92.0, 92.0, mat_heavy, e_grunt, 0)
				_spawn_boulder(Vector2(c10_e2, re10_2 - 28.0), 92.0, mat_heavy)
			_spawn_connecting_bridge(c10_e1, c10_e2, r_el10, 130.0, 120.0, mat1, floor_y, false, world_stage >= 4, 0.0, 92.0)

			# 7. Lồng Gà Giải Cứu Thần Thánh
			if world_stage % 4 == 2 and r_wl10 < floor_y:
				_spawn_rescue_cage(Vector2(c10_w1, r_wl10 - 22.0))

			# 8. Kho Đạn Tối Thượng (Tập Hợp Cả 7 Loại Trứng Dị Biến)
			if world_stage <= 5:
				loadout = ["blackhole", "acid", "drill", "frost", "cluster", "bomb", "blackhole", "bomb"]
			elif world_stage <= 12:
				loadout = ["blackhole", "acid", "drill", "frost", "cluster", "bomb", "blackhole", "drill", "bomb"]
			elif world_stage < 20:
				loadout = ["blackhole", "acid", "drill", "frost", "cluster", "bomb", "blackhole", "acid", "drill", "bomb"]
			else: # Final Level 200: ĐẠI CHIẾN HUYỀN THOẠI TOÀN NĂNG (Grand Finale 200)
				loadout = ["blackhole", "acid", "drill", "frost", "cluster", "bomb", "blackhole", "acid", "drill", "blackhole", "bomb"]

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

func _spawn_environment_decorations(world_id: int, left_x: float, right_x: float, cx: float, top_y: float, floor_y: float) -> void:
	var bg = get_node_or_null("Background")
	if not bg: return

	var decor_node = bg.get_node_or_null("Decorations")
	if decor_node:
		decor_node.queue_free()
	decor_node = Node2D.new()
	decor_node.name = "Decorations"
	decor_node.z_index = 2
	bg.add_child(decor_node)

	var cav_w = right_x - left_x

	# 1. Chiseled Bedrock Shelf along Floor
	var tex_bedrock = _safe_load("res://assets/sprites/environment/cavern_ground_platform.svg")
	if tex_bedrock:
		var shelf = Sprite2D.new()
		shelf.texture = tex_bedrock
		shelf.position = Vector2(cx, floor_y + 12.0)
		shelf.scale = Vector2((cav_w + 40.0) / 540.0, 1.0)
		match world_id:
			1: shelf.modulate = Color(0.85, 0.75, 0.65)
			2: shelf.modulate = Color(0.80, 0.85, 0.80)
			3: shelf.modulate = Color(0.70, 0.80, 0.70)
			4: shelf.modulate = Color(0.95, 0.60, 0.50)
			5: shelf.modulate = Color(0.75, 0.55, 0.95)
			6: shelf.modulate = Color(0.60, 0.75, 0.90)
			7: shelf.modulate = Color(0.50, 0.85, 0.50)
			8: shelf.modulate = Color(0.70, 0.90, 1.00)
			9: shelf.modulate = Color(0.95, 0.45, 0.30)
			10: shelf.modulate = Color(0.80, 0.45, 0.95)
		decor_node.add_child(shelf)

	# 2. Hanging Stalactites on Ceiling
	var tex_stalactites = _safe_load("res://assets/sprites/environment/hanging_stalactites_decor.svg")
	if tex_stalactites:
		var st_left = Sprite2D.new()
		st_left.texture = tex_stalactites
		st_left.position = Vector2(left_x + 90.0, top_y + 24.0)
		st_left.scale = Vector2(0.9, 0.9)
		decor_node.add_child(st_left)

		var st_right = Sprite2D.new()
		st_right.texture = tex_stalactites
		st_right.position = Vector2(right_x - 90.0, top_y + 24.0)
		st_right.scale = Vector2(-0.9, 0.9)
		decor_node.add_child(st_right)

	# 3. Wall Torches
	var tex_torch = _safe_load("res://assets/sprites/environment/cavern_torch_sconce.svg")
	if tex_torch:
		var torch_l = Sprite2D.new()
		torch_l.texture = tex_torch
		torch_l.position = Vector2(left_x + 16.0, top_y + 110.0)
		decor_node.add_child(torch_l)

		var torch_r = Sprite2D.new()
		torch_r.texture = tex_torch
		torch_r.position = Vector2(right_x - 16.0, top_y + 110.0)
		torch_r.scale = Vector2(-1.0, 1.0)
		decor_node.add_child(torch_r)

		# Fire flickering animation
		var tw = decor_node.create_tween().set_loops()
		tw.tween_property(torch_l, "modulate:a", 0.85, 0.12).set_trans(Tween.TRANS_SINE)
		tw.tween_property(torch_l, "modulate:a", 1.0, 0.14).set_trans(Tween.TRANS_SINE)

	# 4. Crystal / Energy Clusters for Worlds 2, 5, 6, 8, 9, 10
	if world_id in [2, 5, 6, 8, 9, 10]:
		var tex_crystals = _safe_load("res://assets/sprites/environment/crystal_cluster_decor.svg")
		if tex_crystals:
			var cr_l = Sprite2D.new()
			cr_l.texture = tex_crystals
			cr_l.position = Vector2(left_x + 28.0, floor_y - 24.0)
			cr_l.scale = Vector2(0.75, 0.75)
			if world_id == 2:
				cr_l.modulate = Color(0.4, 0.9, 0.7, 0.85) # Emerald for World 2
			elif world_id == 5:
				cr_l.modulate = Color(0.85, 0.5, 1.0, 0.95) # Amethyst for World 5
			elif world_id == 6:
				cr_l.modulate = Color(0.2, 0.9, 1.0, 0.9) # Cyber neon cyan for World 6
			elif world_id == 8:
				cr_l.modulate = Color(0.5, 0.85, 1.0, 0.9) # Glacial cyan for World 8
			elif world_id == 9:
				cr_l.modulate = Color(1.0, 0.35, 0.1, 0.95) # Magma fiery amber for World 9
			elif world_id == 10:
				cr_l.modulate = Color(0.95, 0.75, 1.0, 0.95) # Celestial violet for World 10
			decor_node.add_child(cr_l)

			var cr_r = Sprite2D.new()
			cr_r.texture = tex_crystals
			cr_r.position = Vector2(right_x - 28.0, floor_y - 24.0)
			cr_r.scale = Vector2(-0.75, 0.75)
			if world_id == 2:
				cr_r.modulate = Color(0.4, 0.9, 0.7, 0.85)
			elif world_id == 5:
				cr_r.modulate = Color(0.85, 0.5, 1.0, 0.95)
			elif world_id == 6:
				cr_r.modulate = Color(0.2, 0.9, 1.0, 0.9)
			elif world_id == 8:
				cr_r.modulate = Color(0.5, 0.85, 1.0, 0.9)
			elif world_id == 9:
				cr_r.modulate = Color(1.0, 0.35, 0.1, 0.95)
			elif world_id == 10:
				cr_r.modulate = Color(0.95, 0.75, 1.0, 0.95)
			decor_node.add_child(cr_r)

func _apply_world_environment(world_id: int, left_edge_x: float, right_edge_x: float, cx: float, total_w: float, cavern_top_y: float, _floor_y: float, cav_mid_y: float, cav_width: float, cav_height: float) -> void:
	var assets = WORLD_ENV_ASSETS.get(world_id, {})
	var tex_sky = _safe_load(assets.get("sky", ""))
	var tex_cavern = _safe_load(assets.get("cavern", ""))
	var tex_cliff = _safe_load(assets.get("cliff", ""))

	# 1. Sky & Clouds
	if bg_sky_clouds:
		if tex_sky:
			bg_sky_clouds.texture = tex_sky
		bg_sky_clouds.position = Vector2(cx, cavern_top_y * 0.5)
		bg_sky_clouds.scale = Vector2(total_w / 540.0, cavern_top_y / 400.0)

	# 2. Cliffs & Dirt Walls
	if bg_grass_cliff_l:
		if tex_cliff:
			bg_grass_cliff_l.texture = tex_cliff
		bg_grass_cliff_l.position = Vector2(left_edge_x * 0.5, cavern_top_y + 8.0)
		bg_grass_cliff_l.scale = Vector2(max(left_edge_x, 20.0) / 120.0, 1.0)

	if bg_grass_cliff_r:
		if tex_cliff:
			bg_grass_cliff_r.texture = tex_cliff
		bg_grass_cliff_r.position = Vector2(right_edge_x + (total_w - right_edge_x) * 0.5, cavern_top_y + 8.0)
		bg_grass_cliff_r.scale = Vector2(max(total_w - right_edge_x, 20.0) / 120.0, 1.0)

	if bg_dirt_wall_l:
		bg_dirt_wall_l.position = Vector2(left_edge_x * 0.5, cav_mid_y)
		bg_dirt_wall_l.scale = Vector2(max(left_edge_x, 15.0) / 120.0, cav_height / 700.0)

	if bg_dirt_wall_r:
		bg_dirt_wall_r.position = Vector2(right_edge_x + (total_w - right_edge_x) * 0.5, cav_mid_y)
		bg_dirt_wall_r.scale = Vector2(max(total_w - right_edge_x, 15.0) / 120.0, cav_height / 700.0)

	# 3. Modular Cavern Backdrop Panels (Zero Stretching!)
	var bg_container = get_node_or_null("Background")
	if bg_container:
		var panels_group = bg_container.get_node_or_null("CavernPanels")
		if not panels_group:
			panels_group = Node2D.new()
			panels_group.name = "CavernPanels"
			panels_group.z_index = -6
			bg_container.add_child(panels_group)
		else:
			for ch in panels_group.get_children():
				ch.queue_free()

		# Determine number of panels based on cavern width
		var num_panels = max(1, int(ceil(cav_width / 540.0)))
		var seg_w = cav_width / float(num_panels)
		var backdrop_tex = tex_cavern if tex_cavern else (bg_cavern_backdrop.texture if bg_cavern_backdrop else null)

		for i in range(num_panels):
			var panel = Sprite2D.new()
			panel.texture = backdrop_tex
			panel.position = Vector2(left_edge_x + (float(i) + 0.5) * seg_w, cav_mid_y)
			var flip_sign = -1.0 if (i % 2 == 1) else 1.0
			panel.scale = Vector2(flip_sign * (seg_w / 540.0), cav_height / 700.0)
			if bg_cavern_backdrop:
				panel.modulate = bg_cavern_backdrop.modulate
			panels_group.add_child(panel)

		if bg_cavern_backdrop:
			bg_cavern_backdrop.visible = false

func _on_egg_spawned(egg_node: Node2D) -> void:
	active_tracking_egg = egg_node

func _process(delta: float) -> void:
	_update_dynamic_camera(delta)

func _update_dynamic_camera(delta: float) -> void:
	var cam = get_node_or_null("CameraShake2D") as Camera2D
	if not cam:
		return

	var target_pos = default_cam_pos
	var target_zoom = default_cam_zoom
	var chicken = get_node_or_null("ChickenBomber")

	if is_instance_valid(active_tracking_egg):
		if ("is_breaking" in active_tracking_egg and active_tracking_egg.is_breaking) or ("linear_velocity" in active_tracking_egg and active_tracking_egg.linear_velocity.length() < 15.0 and active_tracking_egg.has_first_impact):
			active_tracking_egg = null
		else:
			var egg_pos = active_tracking_egg.global_position
			var bounded_x = clamp(egg_pos.x, default_cam_pos.x - 180.0, default_cam_pos.x + 180.0)
			var bounded_y = clamp(egg_pos.y, default_cam_pos.y - 100.0, default_cam_pos.y + 120.0)
			target_pos = Vector2(bounded_x, bounded_y)
			target_zoom = default_cam_zoom * 1.12
			cam.global_position = cam.global_position.lerp(target_pos, clamp(6.0 * delta, 0.0, 1.0))
			cam.zoom = cam.zoom.lerp(target_zoom, clamp(5.0 * delta, 0.0, 1.0))
			return

	if chicken and chicken.is_aiming:
		var aim_x = lerp(default_cam_pos.x, chicken.global_position.x, 0.35)
		target_pos = Vector2(aim_x, default_cam_pos.y - 20.0)
		target_zoom = default_cam_zoom * 1.05
		cam.global_position = cam.global_position.lerp(target_pos, clamp(4.0 * delta, 0.0, 1.0))
		cam.zoom = cam.zoom.lerp(target_zoom, clamp(4.0 * delta, 0.0, 1.0))
	else:
		cam.global_position = cam.global_position.lerp(default_cam_pos, clamp(3.5 * delta, 0.0, 1.0))
		cam.zoom = cam.zoom.lerp(default_cam_zoom, clamp(3.5 * delta, 0.0, 1.0))

func _setup_ambient_atmosphere(world_id: int, total_w: float, cavern_top_y: float, floor_y: float) -> void:
	var bg = get_node_or_null("Background")
	if not bg: return

	var old_atmo = bg.get_node_or_null("AmbientAtmosphere")
	if old_atmo:
		old_atmo.queue_free()

	var particles = CPUParticles2D.new()
	particles.name = "AmbientAtmosphere"
	particles.z_index = 1
	particles.position = Vector2(total_w * 0.5, (cavern_top_y + floor_y) * 0.5)
	particles.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	particles.emission_rect_extents = Vector2(total_w * 0.5, (floor_y - cavern_top_y) * 0.5)
	particles.amount = 24
	particles.lifetime = 4.5
	particles.preprocess = 2.0
	particles.local_coords = false

	var base_col = Color.WHITE
	match world_id:
		1: # Farm: Dandelion seeds & pollen drift
			ParticleHelper.apply_feather_fx(particles, 0.18, 0.35)
			base_col = Color(1.0, 0.96, 0.82, 0.65)
			particles.gravity = Vector2(8.0, 6.0)
			particles.initial_velocity_min = 10.0
			particles.initial_velocity_max = 22.0
		2: # Quarry: Sparkling mineral dust
			ParticleHelper.apply_spark_fx(particles, 0.15, 0.32)
			base_col = Color(0.92, 0.88, 0.72, 0.6)
			particles.gravity = Vector2(0.0, 5.0)
			particles.initial_velocity_min = 8.0
			particles.initial_velocity_max = 18.0
		3: # Steampunk Factory: Industrial rising soot & steam
			ParticleHelper.apply_smoke_fx(particles, 0.16, 0.35)
			base_col = Color(0.38, 0.40, 0.35, 0.55)
			particles.gravity = Vector2(10.0, -14.0)
			particles.initial_velocity_min = 12.0
			particles.initial_velocity_max = 26.0
		4: # Lava Citadel: Fiery embers drifting up
			ParticleHelper.apply_spark_fx(particles, 0.2, 0.42)
			base_col = Color(1.0, 0.55, 0.15, 0.8)
			particles.gravity = Vector2(0.0, -26.0)
			particles.initial_velocity_min = 15.0
			particles.initial_velocity_max = 35.0
		5: # Crystal Void: Astral stardust
			ParticleHelper.apply_star_fx(particles, 0.2, 0.45)
			base_col = Color(0.85, 0.60, 1.0, 0.75)
			particles.gravity = Vector2(0.0, -6.0)
			particles.initial_velocity_min = 10.0
			particles.initial_velocity_max = 24.0
		6: # Cyber Bunker: Neon cyan data motes
			ParticleHelper.apply_circle_fx(particles, 0.14, 0.3)
			base_col = Color(0.12, 0.95, 1.0, 0.8)
			particles.gravity = Vector2(0.0, -12.0)
			particles.initial_velocity_min = 14.0
			particles.initial_velocity_max = 28.0
		7: # Toxic Jungle: Luminescent spores
			ParticleHelper.apply_acid_fx(particles, 0.18, 0.38)
			base_col = Color(0.48, 0.96, 0.28, 0.7)
			particles.gravity = Vector2(-6.0, 8.0)
			particles.initial_velocity_min = 8.0
			particles.initial_velocity_max = 22.0
		8: # Glacier Vault: Drifting snowflakes
			ParticleHelper.apply_frost_fx(particles, 0.2, 0.42)
			base_col = Color(0.88, 0.96, 1.0, 0.8)
			particles.gravity = Vector2(14.0, 20.0)
			particles.initial_velocity_min = 15.0
			particles.initial_velocity_max = 32.0
		9: # Dragon Abyss: Cinder sparks in thermal updrafts
			ParticleHelper.apply_drill_spark_fx(particles, 0.2, 0.4)
			base_col = Color(1.0, 0.38, 0.12, 0.85)
			particles.gravity = Vector2(0.0, -30.0)
			particles.initial_velocity_min = 18.0
			particles.initial_velocity_max = 40.0
		10: # Celestial Nexus: Divine cosmic stardust
			ParticleHelper.apply_star_fx(particles, 0.24, 0.48)
			base_col = Color(0.96, 0.88, 1.0, 0.85)
			particles.gravity = Vector2(0.0, -8.0)
			particles.initial_velocity_min = 12.0
			particles.initial_velocity_max = 28.0

	var grad = Gradient.new()
	grad.set_color(0, Color(base_col.r, base_col.g, base_col.b, 0.0))
	grad.add_point(0.2, base_col)
	grad.add_point(0.8, base_col)
	grad.set_color(1, Color(base_col.r, base_col.g, base_col.b, 0.0))
	particles.color_ramp = grad

	bg.add_child(particles)

