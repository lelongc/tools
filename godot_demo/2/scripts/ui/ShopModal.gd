extends CanvasLayer

const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")
const JuicyButton = preload("res://scripts/ui/JuicyButton.gd")

@onready var panel: PanelContainer = $CenterContainer/Panel
@onready var title_label: Label = $CenterContainer/Panel/Margin/VBox/Title
@onready var coins_label: Label = $CenterContainer/Panel/Margin/VBox/CoinBadge/HBox/CoinsLabel
@onready var items_container: VBoxContainer = $CenterContainer/Panel/Margin/VBox/Scroll/ItemsContainer
@onready var btn_close: Button = $CenterContainer/Panel/Margin/VBox/BtnClose
@onready var feedback_label: Label = $CenterContainer/Panel/Margin/VBox/FeedbackLabel

var shop_items = [
	{
		"id": "bomb",
		"type": "single",
		"egg_type": "bomb",
		"amount": 1,
		"price": 300,
		"title_key": "KEY_BOMB_BOOSTER",
		"desc_key": "KEY_SHOP_BOMB_DESC",
		"icon_path": "res://assets/sprites/projectiles/egg_bomb.svg"
	},
	{
		"id": "drill",
		"type": "single",
		"egg_type": "drill",
		"amount": 1,
		"price": 250,
		"title_key": "KEY_DRILL_BOOSTER",
		"desc_key": "KEY_SHOP_DRILL_DESC",
		"icon_path": "res://assets/sprites/projectiles/egg_drill.svg"
	},
	{
		"id": "acid",
		"type": "single",
		"egg_type": "acid",
		"amount": 1,
		"price": 250,
		"title_key": "KEY_ACID_BOOSTER",
		"desc_key": "KEY_SHOP_ACID_DESC",
		"icon_path": "res://assets/sprites/projectiles/egg_acid.svg"
	},
	{
		"id": "combo",
		"type": "combo",
		"price": 650,
		"title_key": "KEY_COMBO_BOOSTER",
		"desc_key": "KEY_SHOP_COMBO_DESC",
		"icon_path": "res://assets/sprites/projectiles/egg_bomb.svg"
	}
]

var item_cards: Array[Dictionary] = []

func _ready() -> void:
	if btn_close:
		btn_close.pressed.connect(_on_close_pressed)

	var backdrop = get_node_or_null("Backdrop")
	if backdrop:
		backdrop.gui_input.connect(func(event: InputEvent):
			if (event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed()) or (event is InputEventScreenTouch and event.is_pressed()):
				_on_close_pressed()
		)

	_apply_cartoon_ui_theme()
	_update_coins_display()
	_build_shop_items()
	_update_language()

	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").coins_updated.connect(func(_c): _update_coins_display())
		get_node("/root/SaveManager").consumables_updated.connect(_refresh_inventory_counts)

	# Hiệu ứng nảy mở Modal
	if panel:
		panel.scale = Vector2(0.7, 0.7)
		panel.modulate.a = 0.0
		var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(panel, "scale", Vector2.ONE, 0.28)
		tween.tween_property(panel, "modulate:a", 1.0, 0.20)

func _apply_cartoon_ui_theme() -> void:
	if panel:
		var sbt_modal = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_modal_wood_frame.svg", 36, 36, 36, 44)
		if sbt_modal: panel.add_theme_stylebox_override("panel", sbt_modal)
	if title_label:
		var sbt_ribbon = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/banner_ribbon_gold.svg", 36, 12, 36, 18)
		if sbt_ribbon:
			title_label.add_theme_stylebox_override("normal", sbt_ribbon)
			title_label.add_theme_color_override("font_color", Color(0.24, 0.11, 0.0))
			title_label.add_theme_color_override("font_outline_color", Color(1.0, 0.96, 0.75))
			title_label.add_theme_constant_override("outline_size", 4)
	var coin_badge = get_node_or_null("CenterContainer/Panel/Margin/VBox/CoinBadge")
	if coin_badge:
		var sbt_badge = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_badge_capsule.svg", 16, 12, 16, 16)
		if sbt_badge: coin_badge.add_theme_stylebox_override("panel", sbt_badge)
	if btn_close:
		if btn_close is JuicyButton or btn_close.has_method("set_button_style"):
			btn_close.set_button_style("red")

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		_on_close_pressed()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		_on_close_pressed()
		get_viewport().set_input_as_handled()

func _update_coins_display() -> void:
	if not coins_label: return
	var c = 0
	if has_node("/root/SaveManager"):
		c = get_node("/root/SaveManager").get_coins()
	coins_label.text = "%d" % c
	_refresh_affordability()

func _update_language() -> void:
	if not has_node("/root/LocalizationManager"): return
	var lm = get_node("/root/LocalizationManager")
	if title_label:
		title_label.text = lm.t("KEY_SHOP_TITLE")
	if btn_close:
		btn_close.text = lm.t("KEY_CLOSE")

	for card in item_cards:
		var item_data = card["data"]
		if card.has("title_lbl") and is_instance_valid(card["title_lbl"]):
			card["title_lbl"].text = lm.t(item_data["title_key"])
		if card.has("desc_lbl") and is_instance_valid(card["desc_lbl"]):
			card["desc_lbl"].text = lm.t(item_data["desc_key"])

func _build_shop_items() -> void:
	if not items_container: return

	for child in items_container.get_children():
		child.queue_free()
	item_cards.clear()

	var lm = get_node_or_null("/root/LocalizationManager")
	var sm = get_node_or_null("/root/SaveManager")

	for item in shop_items:
		var panel_card = PanelContainer.new()
		var sbt_card = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/card_level_unlocked.svg", 16, 16, 16, 20)
		if sbt_card:
			panel_card.add_theme_stylebox_override("panel", sbt_card)
		else:
			var sb = StyleBoxFlat.new()
			sb.bg_color = Color(0.18, 0.10, 0.28, 0.95)
			sb.set_border_width_all(2)
			sb.border_color = Color(1.0, 0.85, 0.3, 0.6)
			sb.set_corner_radius_all(14)
			panel_card.add_theme_stylebox_override("panel", sb)

		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 12)
		margin.add_theme_constant_override("margin_top", 10)
		margin.add_theme_constant_override("margin_right", 12)
		margin.add_theme_constant_override("margin_bottom", 10)
		panel_card.add_child(margin)

		var hbox = HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 12)
		margin.add_child(hbox)

		# Icon
		var icon_rect = TextureRect.new()
		icon_rect.custom_minimum_size = Vector2(48, 48)
		icon_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		var tex = ParticleHelper._safe_load(item["icon_path"])
		if tex: icon_rect.texture = tex
		hbox.add_child(icon_rect)

		# Text info
		var vbox = VBoxContainer.new()
		vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		hbox.add_child(vbox)

		var t_lbl = Label.new()
		t_lbl.add_theme_font_size_override("font_size", 16)
		t_lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3))
		t_lbl.text = lm.t(item["title_key"]) if lm else item["id"].to_upper()
		vbox.add_child(t_lbl)

		var d_lbl = Label.new()
		d_lbl.add_theme_font_size_override("font_size", 11)
		d_lbl.add_theme_color_override("font_color", Color(0.85, 0.85, 0.92))
		d_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		d_lbl.text = lm.t(item["desc_key"]) if lm else ""
		vbox.add_child(d_lbl)

		var count_lbl = Label.new()
		count_lbl.add_theme_font_size_override("font_size", 11)
		count_lbl.add_theme_color_override("font_color", Color(0.6, 1.0, 0.6))
		if item["type"] == "single" and sm:
			count_lbl.text = (lm.t("KEY_INVENTORY") % sm.get_consumable(item["egg_type"])) if lm else "x%d" % sm.get_consumable(item["egg_type"])
		else:
			count_lbl.text = "COMBO 3-IN-1"
		vbox.add_child(count_lbl)

		# Buy button
		var btn_buy = Button.new()
		btn_buy.set_script(JuicyButton)
		btn_buy.custom_minimum_size = Vector2(90, 42)
		btn_buy.text = "🪙 %d" % item["price"]
		if btn_buy.has_method("set_button_style"):
			btn_buy.set_button_style("gold")
		btn_buy.pressed.connect(func(): _on_buy_item_pressed(item, panel_card))
		hbox.add_child(btn_buy)

		items_container.add_child(panel_card)

		item_cards.append({
			"panel": panel_card,
			"data": item,
			"btn": btn_buy,
			"count_lbl": count_lbl,
			"title_lbl": t_lbl,
			"desc_lbl": d_lbl
		})

	_refresh_affordability()

func _refresh_inventory_counts() -> void:
	var lm = get_node_or_null("/root/LocalizationManager")
	var sm = get_node_or_null("/root/SaveManager")
	if not sm: return

	for card in item_cards:
		var item = card["data"]
		if item["type"] == "single" and card.has("count_lbl") and is_instance_valid(card["count_lbl"]):
			var cnt = sm.get_consumable(item["egg_type"])
			card["count_lbl"].text = (lm.t("KEY_INVENTORY") % cnt) if lm else "x%d" % cnt

func _refresh_affordability() -> void:
	var cur_coins = 0
	if has_node("/root/SaveManager"):
		cur_coins = get_node("/root/SaveManager").get_coins()

	for card in item_cards:
		var item = card["data"]
		var btn: Button = card["btn"]
		if is_instance_valid(btn):
			if cur_coins < item["price"]:
				btn.modulate = Color(0.7, 0.7, 0.7, 0.6)
			else:
				btn.modulate = Color.WHITE

func _on_buy_item_pressed(item: Dictionary, card_node: PanelContainer) -> void:
	if not has_node("/root/SaveManager"): return
	var sm = get_node("/root/SaveManager")
	var lm = get_node_or_null("/root/LocalizationManager")

	if sm.spend_coins(item["price"]):
		if item["type"] == "single":
			sm.add_consumable(item["egg_type"], item["amount"])
		elif item["type"] == "combo":
			sm.add_consumable("bomb", 1)
			sm.add_consumable("drill", 1)
			sm.add_consumable("acid", 1)

		if has_node("/root/SoundManager"):
			get_node("/root/SoundManager").play_coin_pickup()

		if is_instance_valid(card_node):
			var tw = card_node.create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
			tw.tween_property(card_node, "scale", Vector2(1.05, 1.05), 0.1)
			tw.tween_property(card_node, "scale", Vector2.ONE, 0.15)

		_show_feedback(lm.t("KEY_PURCHASED") if lm else "PURCHASED!", Color(0.3, 1.0, 0.4))
	else:
		if has_node("/root/SoundManager"):
			get_node("/root/SoundManager").play_button_click()

		if is_instance_valid(card_node):
			var tw = card_node.create_tween()
			tw.tween_property(card_node, "position:x", card_node.position.x + 8.0, 0.05)
			tw.tween_property(card_node, "position:x", card_node.position.x - 8.0, 0.05)
			tw.tween_property(card_node, "position:x", card_node.position.x, 0.05)

		_show_feedback(lm.t("KEY_SHOP_NOT_ENOUGH") if lm else "NOT ENOUGH COINS!", Color(1.0, 0.35, 0.35))

func _show_feedback(text: String, color: Color) -> void:
	if not feedback_label: return
	feedback_label.text = text
	feedback_label.modulate = color
	feedback_label.visible = true

	var tw = feedback_label.create_tween()
	tw.tween_property(feedback_label, "modulate:a", 1.0, 0.1)
	tw.tween_interval(1.2)
	tw.tween_property(feedback_label, "modulate:a", 0.0, 0.3)
	tw.tween_callback(func(): feedback_label.visible = false)

var is_closing: bool = false

func _on_close_pressed() -> void:
	if is_closing: return
	is_closing = true

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_button_click()

	if panel:
		var tw = create_tween().set_parallel(true).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)
		tw.tween_property(panel, "scale", Vector2(0.65, 0.65), 0.18)
		tw.tween_property(panel, "modulate:a", 0.0, 0.18)
		await tw.finished

	queue_free()
