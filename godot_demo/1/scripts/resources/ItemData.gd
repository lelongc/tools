class_name ItemData
extends Resource

@export var id: String = ""
@export var display_name: String = ""
@export var description: String = ""
@export var grid_width: int = 1
@export var grid_height: int = 1
# Ma trận nhị phân đại diện cho hình dạng ô (VD: [[1, 1], [1, 1]] cho ô 2x2)
@export var grid_shape: Array = [[1]]
@export var icon_path: String = ""
@export var item_type: String = "weapon" # "weapon", "rune", "relic", "consumable"
@export var weapon_sub_type: String = "projectile" # "projectile", "slash", "lightning", "poison", "shield", "bomb", "none"
@export var base_damage: float = 10.0
@export var cooldown: float = 1.0
@export var range_radius: float = 300.0
@export var element: String = "none" # "none", "fire", "frost", "lightning", "poison"
@export var pierce_count: int = 1
@export var price: int = 5
@export var rarity: String = "common" # "common", "rare", "epic", "legendary"

# Chỉ số động sau khi tính toán Adjacency Synergies
var current_damage: float = 10.0
var current_cooldown: float = 1.0
var current_element: String = "none"
var current_pierce: int = 1
var current_crit_rate: float = 0.05
var current_crit_mult: float = 2.0
var bonus_projectiles: int = 0
var lifesteal_pct: float = 0.0

# Vị trí đặt trên lưới Balo (tọa độ góc trên trái)
var grid_x: int = -1
var grid_y: int = -1
var rotation_step: int = 0 # 0, 1, 2, 3 (0, 90, 180, 270 độ)

func reset_calculated_stats() -> void:
	current_damage = base_damage
	current_cooldown = max(cooldown, 0.08)
	current_element = element
	current_pierce = pierce_count
	current_crit_rate = 0.05
	current_crit_mult = 2.0
	bonus_projectiles = 0
	lifesteal_pct = 0.0

func rotate_90_clockwise() -> void:
	rotation_step = (rotation_step + 1) % 4
	var old_rows = grid_shape.size()
	var old_cols = grid_shape[0].size() if old_rows > 0 else 0
	var new_shape: Array = []
	for c in range(old_cols):
		var new_row: Array = []
		for r in range(old_rows - 1, -1, -1):
			new_row.append(grid_shape[r][c])
		new_shape.append(new_row)
	grid_shape = new_shape
	grid_width = grid_shape[0].size() if grid_shape.size() > 0 else 1
	grid_height = grid_shape.size()

func clone_data() -> ItemData:
	var copy = duplicate(true) as ItemData
	copy.reset_calculated_stats()
	return copy
