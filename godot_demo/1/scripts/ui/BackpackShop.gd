class_name BackpackShop
extends Control

@onready var inv_grid: InventoryGrid = $HBoxContainer/BackpackPanel/InventoryGrid
@onready var shards_label: Label = $TopBar/ShardsContainer/ShardsLabel
@onready var wave_label: Label = $TopBar/WaveLabel
@onready var hp_bar: ProgressBar = $TopBar/HpContainer/HpBar
@onready var dps_label: Label = $HBoxContainer/RightPanel/StatsBox/VBox/DpsLabel
@onready var synergies_label: Label = $HBoxContainer/RightPanel/StatsBox/VBox/SynergiesLabel
@onready var shop_items_container: VBoxContainer = $HBoxContainer/RightPanel/ShopScroll/ShopItemsContainer
@onready var reroll_btn: Button = $HBoxContainer/RightPanel/ShopButtons/RerollBtn
@onready var buy_tile_btn: Button = $HBoxContainer/RightPanel/ShopButtons/BuyTileBtn
@onready var start_wave_btn: Button = $HBoxContainer/RightPanel/StartWaveBtn

var current_shop_items: Array[ItemData] = []

func _ready() -> void:
	GameManager.shards_changed.connect(_on_shards_changed)
	GameManager.player_hp_changed.connect(_on_hp_changed)
	inv_grid.grid_updated.connect(_on_grid_updated)
	
	reroll_btn.pressed.connect(_on_reroll_pressed)
	buy_tile_btn.pressed.connect(_on_buy_tile_pressed)
	start_wave_btn.pressed.connect(_on_start_wave_pressed)
	
	_update_top_bar()
	_generate_shop_inventory()

func _update_top_bar() -> void:
	shards_label.text = str(GameManager.runic_shards)
	wave_label.text = "WAVE %d / %d" % [GameManager.current_wave, GameManager.max_waves]
	hp_bar.max_value = GameManager.player_max_hp
	hp_bar.value = GameManager.player_hp

func _on_shards_changed(new_amount: int) -> void:
	shards_label.text = str(new_amount)

func _on_hp_changed(curr: float, max_v: float) -> void:
	hp_bar.max_value = max_v
	hp_bar.value = curr

func _on_grid_updated(stats: Dictionary) -> void:
	dps_label.text = "ƯỚC TÍNH DPS: %.1f" % stats.get("total_dps", 0.0)
	var elements = stats.get("active_elements", [])
	var elem_str = "Không" if elements.is_empty() else ", ".join(elements)
	var syn_count = stats.get("synergy_count", 0)
	synergies_label.text = "NGUYÊN TỐ: %s\nCOMBO KỀ CẠNH: %d kích hoạt" % [elem_str, syn_count]

func _generate_shop_inventory() -> void:
	for child in shop_items_container.get_children():
		child.queue_free()
	current_shop_items = ItemDatabase.get_random_shop_items(3)
	
	for item_data in current_shop_items:
		var card = _create_shop_card(item_data)
		shop_items_container.add_child(card)

func _create_shop_card(item_data: ItemData) -> PanelContainer:
	var panel = PanelContainer.new()
	var hbox = HBoxContainer.new()
	panel.add_child(hbox)
	
	var icon = TextureRect.new()
	icon.custom_minimum_size = Vector2(48, 48)
	icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	if ResourceLoader.exists(item_data.icon_path):
		icon.texture = load(item_data.icon_path)
	hbox.add_child(icon)
	
	var vbox = VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var name_lbl = Label.new()
	name_lbl.text = item_data.display_name
	name_lbl.add_theme_font_size_override("font_size", 12)
	vbox.add_child(name_lbl)
	
	var desc_lbl = Label.new()
	desc_lbl.text = item_data.description
	desc_lbl.add_theme_font_size_override("font_size", 9)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	vbox.add_child(desc_lbl)
	hbox.add_child(vbox)
	
	var buy_btn = Button.new()
	buy_btn.text = "%d 💎" % item_data.price
	buy_btn.custom_minimum_size = Vector2(65, 36)
	buy_btn.pressed.connect(_on_buy_item_pressed.bind(item_data, panel))
	hbox.add_child(buy_btn)
	
	return panel

func _on_buy_item_pressed(item_data: ItemData, card_panel: PanelContainer) -> void:
	if GameManager.spend_shards(item_data.price):
		# Thử tìm ô trống để đặt
		var placed = false
		for r in range(GameManager.grid_rows):
			for c in range(GameManager.grid_cols):
				var cell = Vector2i(c, r)
				if inv_grid.grid_manager.can_place_item(item_data, cell):
					inv_grid.grid_manager.place_item(item_data, cell)
					GameManager.backpack_items.append(item_data)
					inv_grid.spawn_item_ui(item_data)
					inv_grid.evaluate_and_update()
					placed = true
					break
			if placed:
				break
				
		if placed:
			SoundManager.play_buy()
			card_panel.queue_free()
		else:
			# Hoàn tiền nếu Balo hết chỗ trống
			GameManager.add_shards(item_data.price)
			SoundManager.play_hit()
	else:
		SoundManager.play_hit()

func _on_reroll_pressed() -> void:
	if GameManager.spend_shards(2):
		SoundManager.play_buy()
		_generate_shop_inventory()
	else:
		SoundManager.play_hit()

func _on_buy_tile_pressed() -> void:
	# Tìm 1 ô bị khóa gần trung tâm nhất để mở khóa
	var center = Vector2(3.5, 3.5)
	var best_cell = Vector2i(-1, -1)
	var best_dist = 999.0
	
	for r in range(GameManager.grid_rows):
		for c in range(GameManager.grid_cols):
			var cell = Vector2i(c, r)
			if not GameManager.unlocked_cells.has(cell):
				var dist = center.distance_to(Vector2(c, r))
				if dist < best_dist:
					best_dist = dist
					best_cell = cell
					
	if best_cell.x >= 0:
		if GameManager.spend_shards(8):
			inv_grid.unlock_cell(best_cell)
		else:
			SoundManager.play_hit()

func _on_start_wave_pressed() -> void:
	SoundManager.play_snap()
	GameManager.enter_arena()
