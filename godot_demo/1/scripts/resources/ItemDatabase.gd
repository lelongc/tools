class_name ItemDatabase
extends RefCounted

const ItemData = preload("res://scripts/resources/ItemData.gd")

static var _items: Dictionary = {}

static func initialize_database() -> void:
	if not _items.is_empty():
		return
	
	# 1. Rusty Blade (1x3)
	var blade = ItemData.new()
	blade.id = "weapon_rusty_blade"
	blade.display_name = "Kiếm Rỉ Sét"
	blade.description = "Chém vòng cung phía trước. Kề Ngọc Nguyên Tố để cường hóa nhát chém."
	blade.grid_width = 1
	blade.grid_height = 3
	blade.grid_shape = [[1], [1], [1]]
	blade.icon_path = "res://textures/items/rusty_blade.svg"
	blade.item_type = "weapon"
	blade.weapon_sub_type = "slash"
	blade.base_damage = 25.0
	blade.cooldown = 1.1
	blade.range_radius = 130.0
	blade.price = 5
	blade.rarity = "common"
	_items[blade.id] = blade

	# 2. Hunter Crossbow (2x2)
	var bow = ItemData.new()
	bow.id = "weapon_hunter_crossbow"
	bow.display_name = "Nỏ Thợ Săn Rừng"
	bow.description = "Bắn mũi tên xuyên thấu tầm xa. Đạn thừa hưởng nguyên tố từ Balo."
	bow.grid_width = 2
	bow.grid_height = 2
	bow.grid_shape = [[1, 1], [1, 1]]
	bow.icon_path = "res://textures/items/hunter_crossbow.svg"
	bow.item_type = "weapon"
	bow.weapon_sub_type = "projectile"
	bow.base_damage = 36.0
	bow.cooldown = 0.85
	bow.range_radius = 550.0
	bow.pierce_count = 2
	bow.price = 8
	bow.rarity = "rare"
	_items[bow.id] = bow

	# 3. Storm Staff (1x4)
	var staff = ItemData.new()
	staff.id = "weapon_storm_staff"
	staff.display_name = "Gậy Bão Tố Cổ Đại"
	staff.description = "Phóng sấm sét giật 4 mục tiêu ngẫu nhiên trong tầm nhìn."
	staff.grid_width = 1
	staff.grid_height = 4
	staff.grid_shape = [[1], [1], [1], [1]]
	staff.icon_path = "res://textures/items/storm_staff.svg"
	staff.item_type = "weapon"
	staff.weapon_sub_type = "lightning"
	staff.base_damage = 42.0
	staff.cooldown = 1.5
	staff.range_radius = 420.0
	staff.price = 12
	staff.rarity = "epic"
	_items[staff.id] = staff

	# 4. Poison Flask (1x1)
	var flask = ItemData.new()
	flask.id = "weapon_poison_flask"
	flask.display_name = "Lọ Độc Hư Không"
	flask.description = "Rải bãi độc theo bước chân, gây sát thương ăn mòn theo thời gian."
	flask.grid_width = 1
	flask.grid_height = 1
	flask.grid_shape = [[1]]
	flask.icon_path = "res://textures/items/poison_flask.svg"
	flask.item_type = "weapon"
	flask.weapon_sub_type = "poison"
	flask.base_damage = 8.0
	flask.cooldown = 1.8
	flask.range_radius = 100.0
	flask.price = 4
	flask.rarity = "common"
	_items[flask.id] = flask

	# 5. Spiked Buckler (2x2)
	var shield = ItemData.new()
	shield.id = "weapon_spiked_buckler"
	shield.display_name = "Khiên Gai Thép"
	shield.description = "Phản 120% sát thương và đẩy lùi quái vật khi chạm vào người chơi."
	shield.grid_width = 2
	shield.grid_height = 2
	shield.grid_shape = [[1, 1], [1, 1]]
	shield.icon_path = "res://textures/items/spiked_buckler.svg"
	shield.item_type = "weapon"
	shield.weapon_sub_type = "shield"
	shield.base_damage = 30.0
	shield.cooldown = 0.5
	shield.range_radius = 60.0
	shield.price = 7
	shield.rarity = "rare"
	_items[shield.id] = shield

	# 6. Fire Rune (1x1)
	var fire = ItemData.new()
	fire.id = "rune_fire"
	fire.display_name = "Ngọc Lửa Nham Thạch"
	fire.description = "Truyền thuộc tính Lửa (+35% sát thương thiêu đốt) cho vũ khí kề cạnh."
	fire.grid_width = 1
	fire.grid_height = 1
	fire.grid_shape = [[1]]
	fire.icon_path = "res://textures/items/fire_rune.svg"
	fire.item_type = "rune"
	fire.weapon_sub_type = "none"
	fire.element = "fire"
	fire.price = 6
	fire.rarity = "common"
	_items[fire.id] = fire

	# 7. Frost Rune (1x1)
	var frost = ItemData.new()
	frost.id = "rune_frost"
	frost.display_name = "Ngọc Băng Bắc Cực"
	frost.description = "Truyền thuộc tính Băng (Làm chậm 50%, nổ mảnh băng khi quái chết)."
	frost.grid_width = 1
	frost.grid_height = 1
	frost.grid_shape = [[1]]
	frost.icon_path = "res://textures/items/frost_rune.svg"
	frost.item_type = "rune"
	frost.weapon_sub_type = "none"
	frost.element = "frost"
	frost.price = 6
	frost.rarity = "common"
	_items[frost.id] = frost

	# 8. Lightning Core (1x1)
	var light = ItemData.new()
	light.id = "rune_lightning"
	light.display_name = "Lõi Sấm Sét Hư Không"
	light.description = "Truyền thuộc tính Sét: Đòn đánh giật lan sang 3 kẻ địch xung quanh."
	light.grid_width = 1
	light.grid_height = 1
	light.grid_shape = [[1]]
	light.icon_path = "res://textures/items/lightning_core.svg"
	light.item_type = "rune"
	light.weapon_sub_type = "none"
	light.element = "lightning"
	light.price = 7
	light.rarity = "rare"
	_items[light.id] = light

	# 9. Antimatter Core (2x2)
	var anti = ItemData.new()
	anti.id = "relic_antimatter_core"
	anti.display_name = "Lõi Phản Vật Chất"
	anti.description = "Tăng +40% Tỉ lệ Bạo Kích, sát thương Bạo Kích nâng lên x3.5 lần."
	anti.grid_width = 2
	anti.grid_height = 2
	anti.grid_shape = [[1, 1], [1, 1]]
	anti.icon_path = "res://textures/items/antimatter_core.svg"
	anti.item_type = "relic"
	anti.weapon_sub_type = "none"
	anti.price = 15
	anti.rarity = "legendary"
	_items[anti.id] = anti

	# 10. Copper Conductor (1x2)
	var cond = ItemData.new()
	cond.id = "relic_copper_conductor"
	cond.display_name = "Dây Đồng Dẫn Điện"
	cond.description = "Dẫn truyền nguyên tố và năng lượng giữa các vật phẩm ở 2 đầu dây."
	cond.grid_width = 1
	cond.grid_height = 2
	cond.grid_shape = [[1], [1]]
	cond.icon_path = "res://textures/items/copper_conductor.svg"
	cond.item_type = "relic"
	cond.weapon_sub_type = "none"
	cond.price = 4
	cond.rarity = "common"
	_items[cond.id] = cond

	# 11. Chrono Gear (2x1)
	var gear = ItemData.new()
	gear.id = "relic_chrono_gear"
	gear.display_name = "Bánh Răng Gia Tốc"
	gear.description = "Vũ khí kề bên bắn sẽ giảm 25% Cooldown cho vũ khí còn lại chạm vào nó."
	gear.grid_width = 2
	gear.grid_height = 1
	gear.grid_shape = [[1, 1]]
	gear.icon_path = "res://textures/items/chrono_gear.svg"
	gear.item_type = "relic"
	gear.weapon_sub_type = "none"
	gear.price = 9
	gear.rarity = "rare"
	_items[gear.id] = gear

	# 12. Prism Mirror (1x2)
	var mirror = ItemData.new()
	mirror.id = "relic_prism_mirror"
	mirror.display_name = "Gương Phản Chiếu"
	mirror.description = "Nhân bản đường đạn của vũ khí kề cạnh thành 2 tia chùm chữ V."
	mirror.grid_width = 1
	mirror.grid_height = 2
	mirror.grid_shape = [[1], [1]]
	mirror.icon_path = "res://textures/items/prism_mirror.svg"
	mirror.item_type = "relic"
	mirror.weapon_sub_type = "none"
	mirror.price = 10
	mirror.rarity = "epic"
	_items[mirror.id] = mirror

	# 13. Vampiric Heart (2x2)
	var heart = ItemData.new()
	heart.id = "relic_vampiric_heart"
	heart.display_name = "Trái Tim Ma Cà Rồng"
	heart.description = "Hút 2.5% lượng sát thương của các vũ khí xung quanh để hồi máu cho bạn."
	heart.grid_width = 2
	heart.grid_height = 2
	heart.grid_shape = [[1, 1], [1, 1]]
	heart.icon_path = "res://textures/items/vampiric_heart.svg"
	heart.item_type = "relic"
	heart.weapon_sub_type = "none"
	heart.price = 11
	heart.rarity = "epic"
	_items[heart.id] = heart

	# 14. Elixir of Life (1x1)
	var elixir = ItemData.new()
	elixir.id = "consumable_elixir"
	elixir.display_name = "Bình Thuốc Trường Sinh"
	elixir.description = "Hồi 3 HP/s liên tục. Vỡ hồi ngay 50 HP nếu máu tụt dưới 25%."
	elixir.grid_width = 1
	elixir.grid_height = 1
	elixir.grid_shape = [[1]]
	elixir.icon_path = "res://textures/items/elixir.svg"
	elixir.item_type = "consumable"
	elixir.weapon_sub_type = "none"
	elixir.price = 5
	elixir.rarity = "common"
	_items[elixir.id] = elixir

	# 15. Clockwork Bomb (2x2)
	var bomb = ItemData.new()
	bomb.id = "weapon_clockwork_bomb"
	bomb.display_name = "Bom Hẹn Giờ Runic"
	bomb.description = "Mỗi 5s lăn 1 quả bom nổ tung diện tích 220px, gây 180 sát thương cực lớn."
	bomb.grid_width = 2
	bomb.grid_height = 2
	bomb.grid_shape = [[1, 1], [1, 1]]
	bomb.icon_path = "res://textures/items/bomb.svg"
	bomb.item_type = "weapon"
	bomb.weapon_sub_type = "bomb"
	bomb.base_damage = 180.0
	bomb.cooldown = 5.0
	bomb.range_radius = 220.0
	bomb.price = 9
	bomb.rarity = "rare"
	_items[bomb.id] = bomb

static func get_item(id: String) -> ItemData:
	initialize_database()
	if _items.has(id):
		return (_items[id] as ItemData).clone_data()
	return null

static func get_random_shop_items(count: int = 3) -> Array[ItemData]:
	initialize_database()
	var keys = _items.keys()
	keys.shuffle()
	var result: Array[ItemData] = []
	for i in range(min(count, keys.size())):
		result.append(get_item(keys[i]))
	return result

static func get_all_item_ids() -> Array:
	initialize_database()
	return _items.keys()
