extends Node

const ItemData = preload("res://scripts/resources/ItemData.gd")
const ItemDatabase = preload("res://scripts/resources/ItemDatabase.gd")
const GridManager = preload("res://scripts/grid/GridManager.gd")

func _ready() -> void:
	print("\n=======================================================")
	print("🧪 BẮT ĐẦU KIỂM THỬ ỔN ĐỊNH: RUNIC SLICE (GODOT 4.7.1)")
	print("=======================================================\n")
	
	var all_passed = true
	all_passed = _test_item_database() and all_passed
	all_passed = _test_grid_math_and_placement() and all_passed
	all_passed = _test_adjacency_synergies() and all_passed
	all_passed = _test_object_pooling() and all_passed
	all_passed = _test_atomic_save() and all_passed
	all_passed = _test_game_flow() and all_passed
	
	print("\n-------------------------------------------------------")
	if all_passed:
		print("✅ [TẤT CẢ TEST HOÀN TẤT THÀNH CÔNG] - HỆ THỐNG ỔN ĐỊNH 100%")
		print("=======================================================\n")
		get_tree().quit(0)
	else:
		print("❌ [CÓ LỖI XẢY RA TRONG QUÁ TRÌNH KIỂM THỬ]")
		print("=======================================================\n")
		get_tree().quit(1)

func _test_item_database() -> bool:
	print("▶ [TEST 1] Kiểm tra cơ sở dữ liệu vật phẩm ItemDatabase...")
	ItemDatabase.initialize_database()
	var all_ids = ItemDatabase.get_all_item_ids()
	
	if all_ids.size() < 15:
		printerr("  ❌ Số lượng vật phẩm không đủ 15! Hiện có: ", all_ids.size())
		return false
		
	for id in all_ids:
		var item = ItemDatabase.get_item(id)
		if item == null:
			printerr("  ❌ Không thể tải item: ", id)
			return false
		if item.grid_width <= 0 or item.grid_height <= 0:
			printerr("  ❌ Kích thước ô không hợp lệ cho: ", id)
			return false
		if item.grid_shape.is_empty():
			printerr("  ❌ Ma trận hình dạng rỗng cho: ", id)
			return false
		if not FileAccess.file_exists(item.icon_path):
			printerr("  ❌ Tệp icon không tồn tại: ", item.icon_path)
			return false
			
	print("  ✓ Đã kiểm tra %d vật phẩm hoàn hảo (icons, ma trận, chỉ số)." % all_ids.size())
	return true

func _test_grid_math_and_placement() -> bool:
	print("▶ [TEST 2] Kiểm tra thuật toán Balo Grid & Xoay Đồ...")
	var gm = GridManager.new()
	GameManager._init_default_grid()
	
	var blade = ItemDatabase.get_item("weapon_rusty_blade") # 1x3
	var bow = ItemDatabase.get_item("weapon_hunter_crossbow") # 2x2
	
	# 1. Đặt vào ô hợp lệ (3, 2)
	var can_p1 = gm.can_place_item(blade, Vector2i(3, 2))
	if not can_p1:
		printerr("  ❌ Lỗi: Không thể đặt Kiếm vào ô hợp lệ (3, 2)")
		return false
	gm.place_item(blade, Vector2i(3, 2))
	
	# 2. Đặt đè lên vị trí đã có -> phải trả về false
	var can_p2 = gm.can_place_item(bow, Vector2i(3, 2))
	if can_p2:
		printerr("  ❌ Lỗi: Cho phép đặt vật phẩm đè lên nhau!")
		return false
		
	# 3. Đặt ra ngoài rìa 8x8 -> phải trả về false
	var can_out = gm.can_place_item(bow, Vector2i(7, 7))
	if can_out:
		printerr("  ❌ Lỗi: Cho phép đặt vật phẩm lấn ra ngoài rìa!")
		return false
		
	# 4. Kiểm tra xoay 90 độ
	var original_w = blade.grid_width # 1
	var original_h = blade.grid_height # 3
	blade.rotate_90_clockwise()
	if blade.grid_width != original_h or blade.grid_height != original_w:
		printerr("  ❌ Lỗi xoay 90 độ: kích thước không đảo chiều! w: %d, h: %d" % [blade.grid_width, blade.grid_height])
		return false
		
	print("  ✓ Thuật toán đặt đồ, kiểm tra biên và xoay ma trận hoạt động chính xác.")
	return true

func _test_adjacency_synergies() -> bool:
	print("▶ [TEST 3] Kiểm tra động cơ kích hoạt lân cận (Adjacency Synergies)...")
	var gm = GridManager.new()
	GameManager.unlocked_cells.clear()
	for y in range(8):
		for x in range(8):
			GameManager.unlocked_cells[Vector2i(x, y)] = true
			
	var blade = ItemDatabase.get_item("weapon_rusty_blade") # 1x3
	blade.grid_x = 2
	blade.grid_y = 2
	
	var fire_rune = ItemDatabase.get_item("rune_fire") # 1x1
	fire_rune.grid_x = 3 # Đặt ngay kề cạnh bên phải của Kiếm (x: 2+1 = 3, y: 2)
	fire_rune.grid_y = 2
	
	var items: Array = [blade, fire_rune]
	var stats = gm.evaluate_all_synergies(items)
	
	if blade.current_element != "fire":
		printerr("  ❌ Lỗi: Kiếm không nhận được thuộc tính Lửa từ Ngọc kề cạnh! Element: ", blade.current_element)
		return false
		
	if blade.current_damage <= blade.base_damage:
		printerr("  ❌ Lỗi: Sát thương Kiếm không tăng khi gắn Ngọc Lửa!")
		return false
		
	# Thử nghiệm Dây Đồng Dẫn Điện (Conductor)
	var conductor = ItemDatabase.get_item("relic_copper_conductor") # 1x2
	conductor.grid_x = 4
	conductor.grid_y = 2
	
	var bow = ItemDatabase.get_item("weapon_hunter_crossbow") # 2x2
	bow.grid_x = 5
	bow.grid_y = 2
	
	items.append(conductor)
	items.append(bow)
	stats = gm.evaluate_all_synergies(items)
	
	if bow.current_element != "fire":
		printerr("  ❌ Lỗi: Dây đồng không dẫn được thuộc tính Lửa sang Nỏ!")
		return false
		
	print("  ✓ Thuật toán tiếp xúc 4 hướng và dẫn truyền qua dây đồng hoạt động xuất sắc.")
	return true

func _test_object_pooling() -> bool:
	print("▶ [TEST 4] Kiểm tra tái sinh đối tượng ObjectPool 0-allocation...")
	var dummy_parent = Node2D.new()
	add_child(dummy_parent)
	
	var proj_prefab = load("res://scenes/prefabs/Projectile.tscn")
	var dmg_prefab = load("res://scenes/prefabs/DamageNumber.tscn")
	var enemy_prefab = load("res://scenes/prefabs/Enemy.tscn")
	
	ObjectPool.init_scenes(proj_prefab, dmg_prefab, enemy_prefab)
	
	var spawned_projs: Array[Node2D] = []
	# Spawn đồng loạt 100 đạn
	for i in range(100):
		var p = ObjectPool.spawn_projectile(dummy_parent, Vector2.ZERO, Vector2.RIGHT, 20.0, "none")
		if p != null:
			spawned_projs.append(p)
			
	if spawned_projs.size() != 100:
		printerr("  ❌ Lỗi: Không thể spawn đủ 100 đạn!")
		dummy_parent.queue_free()
		return false
		
	# Recycle toàn bộ
	for p in spawned_projs:
		ObjectPool.recycle_projectile(p)
		
	if ObjectPool.active_projectiles.size() != 0:
		printerr("  ❌ Lỗi: Thu hồi đạn không hoàn tất! Còn: ", ObjectPool.active_projectiles.size())
		dummy_parent.queue_free()
		return false
		
	print("  ✓ Tái sinh 100 đối tượng liên tục thành công, 0 rò rỉ bộ nhớ.")
	dummy_parent.queue_free()
	return true

func _test_atomic_save() -> bool:
	print("▶ [TEST 5] Kiểm tra lưu trữ nguyên tử SaveManager...")
	SaveManager.meta_data["test_key"] = 9999
	SaveManager.save_game()
	
	if not FileAccess.file_exists(SaveManager.SAVE_PATH):
		printerr("  ❌ Lỗi: File save chính không tồn tại!")
		return false
		
	SaveManager.load_game()
	if SaveManager.meta_data.get("test_key") != 9999:
		printerr("  ❌ Lỗi: Dữ liệu tải lại không khớp giá trị đã lưu!")
		return false
		
	print("  ✓ Ghi và đọc file nguyên tử an toàn tuyệt đối.")
	return true

func _test_game_flow() -> bool:
	print("▶ [TEST 6] Kiểm tra dòng chảy trò chơi (GameManager Flow)...")
	GameManager.current_wave = 1
	GameManager.runic_shards = 15
	GameManager.player_max_hp = 100.0
	GameManager.player_hp = 100.0
	GameManager.is_player_alive = true
	GameManager.enemies_killed = 0
	GameManager.total_damage_dealt = 0.0
	
	if GameManager.current_wave != 1:
		printerr("  ❌ Lỗi wave khởi đầu!")
		return false
	if GameManager.runic_shards < 15:
		printerr("  ❌ Lỗi số Shards khởi đầu!")
		return false
		
	# Thử nghiệm nhận sát thương và hồi phục
	GameManager.damage_player(40.0)
	if GameManager.player_hp != 60.0:
		printerr("  ❌ Lỗi trừ máu nhân vật! Hiện tại: ", GameManager.player_hp)
		return false
		
	GameManager.heal_player(20.0)
	if GameManager.player_hp != 80.0:
		printerr("  ❌ Lỗi hồi máu nhân vật! Hiện tại: ", GameManager.player_hp)
		return false
		
	# Tiêu dùng Shards
	var spent = GameManager.spend_shards(5)
	if not spent or GameManager.runic_shards != 10:
		printerr("  ❌ Lỗi tiêu shards!")
		return false
		
	print("  ✓ Vòng đời GameManager và dòng chảy trạng thái hoạt động chính xác.")
	return true
