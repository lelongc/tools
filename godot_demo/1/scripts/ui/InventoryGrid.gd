class_name InventoryGrid
extends Control

const ItemData = preload("res://scripts/resources/ItemData.gd")
const InventoryItemUI = preload("res://scripts/ui/InventoryItemUI.gd")

signal grid_updated(stats: Dictionary)
signal cell_unlocked(cell: Vector2i)

var cell_size: float = 54.0
var cols: int = 8
var rows: int = 8

var grid_manager: GridManager = GridManager.new()
var item_ui_scene: PackedScene = preload("res://scenes/ui/InventoryItemUI.tscn")

var cell_views: Dictionary = {} # Vector2i -> TextureRect
var item_views: Array = []

@onready var cells_container: Control = $CellsContainer
@onready var items_container: Control = $ItemsContainer
@onready var highlight_overlay: Control = $HighlightOverlay

var empty_tex = preload("res://textures/ui/grid_cell_empty.svg")
var locked_tex = preload("res://textures/ui/grid_cell_locked.svg")
var valid_tex = preload("res://textures/ui/grid_cell_valid.svg")
var invalid_tex = preload("res://textures/ui/grid_cell_invalid.svg")

func _ready() -> void:
	cols = GameManager.grid_cols
	rows = GameManager.grid_rows
	custom_minimum_size = Vector2(cols * cell_size, rows * cell_size)
	size = custom_minimum_size
	build_grid_cells()
	refresh_items_from_gamemanager()

func build_grid_cells() -> void:
	for child in cells_container.get_children():
		child.queue_free()
	cell_views.clear()
	
	for r in range(rows):
		for c in range(cols):
			var cell = Vector2i(c, r)
			var tr = TextureRect.new()
			tr.custom_minimum_size = Vector2(cell_size, cell_size)
			tr.size = tr.custom_minimum_size
			tr.position = Vector2(c * cell_size, r * cell_size)
			tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			tr.stretch_mode = TextureRect.STRETCH_SCALE
			
			if GameManager.unlocked_cells.has(cell):
				tr.texture = empty_tex
			else:
				tr.texture = locked_tex
				
			tr.gui_input.connect(_on_cell_gui_input.bind(cell))
			cells_container.add_child(tr)
			cell_views[cell] = tr

func refresh_items_from_gamemanager() -> void:
	for view in item_views:
		view.queue_free()
	item_views.clear()
	
	for item_data in GameManager.backpack_items:
		spawn_item_ui(item_data)
		
	evaluate_and_update()

func spawn_item_ui(item_data: ItemData) -> InventoryItemUI:
	var item_ui = item_ui_scene.instantiate() as InventoryItemUI
	items_container.add_child(item_ui)
	item_ui.setup(item_data, cell_size)
	
	if item_data.grid_x >= 0 and item_data.grid_y >= 0:
		item_ui.position = Vector2(item_data.grid_x * cell_size, item_data.grid_y * cell_size)
		item_ui.original_local_pos = item_ui.position
		
	item_ui.item_drag_started.connect(_on_item_drag_started)
	item_ui.item_drag_ended.connect(_on_item_drag_ended)
	item_ui.item_rotated.connect(_on_item_rotated)
	item_views.append(item_ui)
	return item_ui

func _on_item_drag_started(item_ui: InventoryItemUI) -> void:
	pass

func _on_item_drag_ended(item_ui: InventoryItemUI, global_drop_pos: Vector2) -> void:
	var local_pos = items_container.to_local(global_drop_pos)
	# Tính toán ô lưới mục tiêu gần nhất
	var target_col = int(round((local_pos.x - item_ui.size.x * 0.3) / cell_size))
	var target_row = int(round((local_pos.y - item_ui.size.y * 0.3) / cell_size))
	var target_cell = Vector2i(target_col, target_row)
	
	if grid_manager.can_place_item(item_ui.item_data, target_cell, item_ui.item_data):
		grid_manager.place_item(item_ui.item_data, target_cell)
		item_ui.original_local_pos = Vector2(target_col * cell_size, target_row * cell_size)
		item_ui.snap_to_pixel_pos(item_ui.original_local_pos)
		SoundManager.play_snap()
		evaluate_and_update()
	else:
		item_ui.return_to_original_pos()
		SoundManager.play_hit()

func _on_item_rotated(item_ui: InventoryItemUI) -> void:
	var current_cell = Vector2i(item_ui.item_data.grid_x, item_ui.item_data.grid_y)
	if current_cell.x >= 0 and current_cell.y >= 0:
		if grid_manager.can_place_item(item_ui.item_data, current_cell, item_ui.item_data):
			grid_manager.place_item(item_ui.item_data, current_cell)
			evaluate_and_update()
		else:
			# Nếu không xoay được tại chỗ -> xoay lại
			item_ui.item_data.rotate_90_clockwise()
			item_ui.item_data.rotate_90_clockwise()
			item_ui.item_data.rotate_90_clockwise()
			item_ui._update_size_and_visuals()

func evaluate_and_update() -> void:
	var stats = grid_manager.evaluate_all_synergies(GameManager.backpack_items)
	emit_signal("grid_updated", stats)

func unlock_cell(cell: Vector2i) -> bool:
	if GameManager.unlocked_cells.has(cell):
		return false
	GameManager.unlocked_cells[cell] = true
	if cell_views.has(cell):
		cell_views[cell].texture = empty_tex
	SoundManager.play_buy()
	emit_signal("cell_unlocked", cell)
	return true

func _on_cell_gui_input(event: InputEvent, cell: Vector2i) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		if not GameManager.unlocked_cells.has(cell):
			# Chi phí mở ô: 8 shards
			var cost = 8
			if GameManager.spend_shards(cost):
				unlock_cell(cell)
