extends Node

signal wave_started(wave_num: int)
signal wave_completed(wave_num: int)
signal shards_changed(new_amount: int)
signal player_hp_changed(current: float, max_val: float)
signal game_over_triggered(stats: Dictionary)
signal victory_triggered(stats: Dictionary)

enum GameState {
	MAIN_MENU,
	ARENA_COMBAT,
	RUNIC_FORGE,
	PAUSED,
	GAME_OVER,
	VICTORY
}

const ItemData = preload("res://scripts/resources/ItemData.gd")
const ItemDatabase = preload("res://scripts/resources/ItemDatabase.gd")

var current_state: GameState = GameState.MAIN_MENU

# Thống kê ván chơi
var current_wave: int = 1
var max_waves: int = 20
var runic_shards: int = 15
var meta_dust: int = 0
var enemies_killed: int = 0
var total_damage_dealt: float = 0.0
var run_seed: String = ""

# Chỉ số nhân vật
var player_hp: float = 100.0
var player_max_hp: float = 100.0
var player_shield: float = 0.0
var player_base_speed: float = 240.0
var is_player_alive: bool = true
var has_revived_this_run: bool = false

# Danh sách vật phẩm đang mang trong Balo (ItemData instances)
var backpack_items: Array = []
# Kích thước lưới Balo
var grid_cols: int = 8
var grid_rows: int = 8
# Các ô đã mở khóa: Dictionary Vector2i -> bool
var unlocked_cells: Dictionary = {}

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_init_default_grid()

func _init_default_grid() -> void:
	unlocked_cells.clear()
	# Khởi tạo vùng trung tâm 4x4 mở khóa sẵn (tọa độ từ x: 2..5, y: 2..5)
	for y in range(2, 6):
		for x in range(2, 6):
			unlocked_cells[Vector2i(x, y)] = true

func start_new_run() -> void:
	current_wave = 1
	runic_shards = 15
	enemies_killed = 0
	total_damage_dealt = 0.0
	player_max_hp = 100.0
	player_hp = player_max_hp
	player_shield = 0.0
	is_player_alive = true
	has_revived_this_run = false
	_init_default_grid()
	
	# Tạo seed ngẫu nhiên
	run_seed = "RUNIC-%04d-%04d" % [randi() % 9999, randi() % 9999]
	
	# Khởi đầu với 1 Kiếm Rỉ Sét
	backpack_items.clear()
	var starter_sword = ItemDatabase.get_item("weapon_rusty_blade")
	if starter_sword:
		starter_sword.grid_x = 3
		starter_sword.grid_y = 2
		backpack_items.append(starter_sword)
		
	enter_forge()

func enter_arena() -> void:
	current_state = GameState.ARENA_COMBAT
	get_tree().paused = false
	emit_signal("wave_started", current_wave)
	get_tree().change_scene_to_file("res://scenes/game/GameArena.tscn")

func enter_forge() -> void:
	current_state = GameState.RUNIC_FORGE
	get_tree().paused = false
	get_tree().change_scene_to_file("res://scenes/ui/BackpackShop.tscn")

func complete_wave() -> void:
	emit_signal("wave_completed", current_wave)
	# Thưởng vàng sau wave
	var wave_bonus = 8 + current_wave * 3
	add_shards(wave_bonus)
	
	# Hồi máu nhẹ giữa các wave
	heal_player(20.0)
	
	if current_wave >= max_waves:
		trigger_victory()
	else:
		current_wave += 1
		enter_forge()

func add_shards(amt: int) -> void:
	runic_shards += amt
	emit_signal("shards_changed", runic_shards)

func spend_shards(amt: int) -> bool:
	if runic_shards >= amt:
		runic_shards -= amt
		emit_signal("shards_changed", runic_shards)
		return true
	return false

func damage_player(amount: float) -> void:
	if not is_player_alive:
		return
		
	# Giảm vào khiên trước
	if player_shield > 0:
		var absorbed = min(player_shield, amount)
		player_shield -= absorbed
		amount -= absorbed
		
	player_hp = max(player_hp - amount, 0.0)
	emit_signal("player_hp_changed", player_hp, player_max_hp)
	
	if player_hp <= 0:
		is_player_alive = false
		trigger_game_over()

func heal_player(amount: float) -> void:
	player_hp = min(player_hp + amount, player_max_hp)
	emit_signal("player_hp_changed", player_hp, player_max_hp)

func record_damage(amount: float) -> void:
	total_damage_dealt += amount

func trigger_game_over() -> void:
	current_state = GameState.GAME_OVER
	var stats = get_run_summary()
	emit_signal("game_over_triggered", stats)

func trigger_victory() -> void:
	current_state = GameState.VICTORY
	var stats = get_run_summary()
	emit_signal("victory_triggered", stats)

func get_run_summary() -> Dictionary:
	return {
		"wave": current_wave,
		"max_waves": max_waves,
		"shards": runic_shards,
		"enemies_killed": enemies_killed,
		"total_damage": total_damage_dealt,
		"seed": run_seed,
		"backpack_items_count": backpack_items.size()
	}

func revive_player() -> void:
	if has_revived_this_run:
		return
	has_revived_this_run = true
	is_player_alive = true
	player_hp = player_max_hp * 0.6
	emit_signal("player_hp_changed", player_hp, player_max_hp)
	current_state = GameState.ARENA_COMBAT
