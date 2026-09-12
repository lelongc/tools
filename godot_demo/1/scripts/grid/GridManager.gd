class_name GridManager
extends RefCounted

const ItemData = preload("res://scripts/resources/ItemData.gd")

# Quản lý bản đồ ô lưới Balo và động cơ tính toán Adjacency Synergies

# Ma trận ô: Dictionary Vector2i -> ItemData
var grid_cells: Dictionary = {}

func clear_grid() -> void:
	grid_cells.clear()

func rebuild_from_items(items: Array) -> void:
	grid_cells.clear()
	for item in items:
		if item.grid_x >= 0 and item.grid_y >= 0:
			place_item(item, Vector2i(item.grid_x, item.grid_y))

func can_place_item(item: ItemData, top_left: Vector2i, ignore_item: ItemData = null) -> bool:
	var rows = item.grid_shape.size()
	var cols = item.grid_shape[0].size() if rows > 0 else 0
	
	for r in range(rows):
		for c in range(cols):
			if item.grid_shape[r][c] == 1:
				var cell = top_left + Vector2i(c, r)
				# 1. Kiểm tra trong phạm vi 8x8
				if cell.x < 0 or cell.x >= GameManager.grid_cols or cell.y < 0 or cell.y >= GameManager.grid_rows:
					return false
				# 2. Kiểm tra ô đã được mở khóa chưa
				if not GameManager.unlocked_cells.has(cell):
					return false
				# 3. Kiểm tra ô có bị đè bởi món đồ khác không
				if grid_cells.has(cell) and grid_cells[cell] != ignore_item:
					return false
	return true

func place_item(item: ItemData, top_left: Vector2i) -> bool:
	if not can_place_item(item, top_left, item):
		return false
		
	# Xóa vị trí cũ nếu đã có
	remove_item(item)
	
	item.grid_x = top_left.x
	item.grid_y = top_left.y
	
	var rows = item.grid_shape.size()
	var cols = item.grid_shape[0].size() if rows > 0 else 0
	for r in range(rows):
		for c in range(cols):
			if item.grid_shape[r][c] == 1:
				var cell = top_left + Vector2i(c, r)
				grid_cells[cell] = item
	return true

func remove_item(item: ItemData) -> void:
	var to_erase: Array[Vector2i] = []
	for cell in grid_cells.keys():
		if grid_cells[cell] == item:
			to_erase.append(cell)
	for cell in to_erase:
		grid_cells.erase(cell)
	item.grid_x = -1
	item.grid_y = -1

func get_item_occupied_cells(item: ItemData) -> Array[Vector2i]:
	var result: Array[Vector2i] = []
	if item.grid_x < 0 or item.grid_y < 0:
		return result
	var rows = item.grid_shape.size()
	var cols = item.grid_shape[0].size() if rows > 0 else 0
	for r in range(rows):
		for c in range(cols):
			if item.grid_shape[r][c] == 1:
				result.append(Vector2i(item.grid_x + c, item.grid_y + r))
	return result

func get_adjacent_items(target_item: ItemData) -> Array:
	var neighbors: Array = []
	var target_cells = get_item_occupied_cells(target_item)
	var dirs = [Vector2i(0, 1), Vector2i(0, -1), Vector2i(1, 0), Vector2i(-1, 0)]
	
	for cell in target_cells:
		for d in dirs:
			var check_cell = cell + d
			if grid_cells.has(check_cell):
				var neighbor_item = grid_cells[check_cell]
				if neighbor_item != target_item and not neighbors.has(neighbor_item):
					neighbors.append(neighbor_item)
	return neighbors

# Động cơ đánh giá kích hoạt combo lân cận (Adjacency Engine)
func evaluate_all_synergies(items: Array) -> Dictionary:
	rebuild_from_items(items)
	
	for item in items:
		item.reset_calculated_stats()
		
	var active_elements: Dictionary = {}
	var total_dps: float = 0.0
	var synergy_count: int = 0
	
	# 1. Truyền dẫn hiệu ứng nguyên tố từ Runes qua Dây Dẫn Đồng (BFS Conduction)
	_propagate_elements(items)
	
	# 2. Áp dụng các hiệu ứng cơ khí và tương hỗ kề cạnh
	for item in items:
		if item.grid_x < 0 or item.grid_y < 0:
			continue
			
		var adjacents = get_adjacent_items(item)
		
		for adj in adjacents:
			synergy_count += 1
			
			# A. Ngọc Lửa/Băng/Sét tiếp giáp trực tiếp vũ khí
			if adj.item_type == "rune" and item.item_type == "weapon":
				_apply_element_bonus(item, adj.element)
				active_elements[adj.element] = true
				
			# B. Bánh Răng Gia Tốc (Chrono Gear) giảm cooldown
			if adj.id == "relic_chrono_gear" and item.item_type == "weapon":
				item.current_cooldown = max(item.current_cooldown * 0.75, 0.08)
				
			# C. Lõi Phản Vật Chất (Antimatter Core)
			if adj.id == "relic_antimatter_core" and item.item_type == "weapon":
				item.current_crit_rate = min(item.current_crit_rate + 0.40, 1.0)
				item.current_crit_mult = 3.5
				
			# D. Gương Phản Chiếu (Prism Mirror)
			if adj.id == "relic_prism_mirror" and item.item_type == "weapon":
				item.bonus_projectiles += 1
				
			# E. Trái Tim Ma Cà Rồng (Vampiric Heart)
			if adj.id == "relic_vampiric_heart" and item.item_type == "weapon":
				item.lifesteal_pct += 0.025
				
			# F. Khiên Gai kề vũ khí tăng chỉ số
			if adj.id == "weapon_spiked_buckler" and item.item_type == "weapon":
				item.current_damage += 5.0
				
		if item.item_type == "weapon":
			var dps = (item.current_damage / max(item.current_cooldown, 0.08)) * (1.0 + item.current_crit_rate * (item.current_crit_mult - 1.0))
			total_dps += dps
			
	return {
		"total_dps": total_dps,
		"synergy_count": synergy_count,
		"active_elements": active_elements.keys()
	}

func _propagate_elements(items: Array) -> void:
	# Tìm các dây đồng tiếp xúc với ngọc nguyên tố
	for item in items:
		if item.id == "relic_copper_conductor":
			var adjacents = get_adjacent_items(item)
			var carried_element = "none"
			for adj in adjacents:
				if adj.item_type == "rune":
					carried_element = adj.element
					break
			if carried_element != "none":
				# Truyền nguyên tố này cho tất cả vũ khí chạm vào dây dẫn
				for adj in adjacents:
					if adj.item_type == "weapon":
						_apply_element_bonus(adj, carried_element)

func _apply_element_bonus(weapon: ItemData, elem: String) -> void:
	weapon.current_element = elem
	match elem:
		"fire":
			weapon.current_damage *= 1.35
		"frost":
			weapon.current_damage *= 1.15
		"lightning":
			weapon.current_damage *= 1.25
			weapon.bonus_projectiles += 1
