extends CanvasLayer
class_name DailyLoginModal

const JuicyButton = preload("res://scripts/ui/JuicyButton.gd")
const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

signal login_modal_closed()

@onready var modal_panel: PanelContainer = $CenterContainer/Panel
@onready var title_label: Label = $CenterContainer/Panel/Margin/VBox/Title
@onready var subtitle_label: Label = $CenterContainer/Panel/Margin/VBox/Subtitle
@onready var cards_container: HFlowContainer = $CenterContainer/Panel/Margin/VBox/CardsContainer
@onready var btn_claim: Button = $CenterContainer/Panel/Margin/VBox/BtnClaim
@onready var status_label: Label = $CenterContainer/Panel/Margin/VBox/StatusLabel
@onready var btn_close: Button = $CenterContainer/Panel/Margin/VBox/BtnClose

var day_cards: Array[PanelContainer] = []
var is_closing: bool = false

const REWARDS_CONFIG = [
	{"day": 1, "type": "coins", "desc": "150 Vàng", "icon": "res://assets/ui/icons/icon_coin_gold.svg"},
	{"day": 2, "type": "egg", "desc": "1x Trứng Bom", "icon": "res://assets/ui/icons/icon_egg_bomb.svg"},
	{"day": 3, "type": "egg", "desc": "1x Mũi Khoan", "icon": "res://assets/ui/icons/icon_egg_drill.svg"},
	{"day": 4, "type": "coins", "desc": "350 Vàng", "icon": "res://assets/ui/icons/icon_coin_gold.svg"},
	{"day": 5, "type": "combo", "desc": "Băng + Axit", "icon": "res://assets/ui/icons/icon_egg_frost.svg"},
	{"day": 6, "type": "egg", "desc": "1x Gà Con", "icon": "res://assets/ui/icons/icon_egg_cluster.svg"},
	{"day": 7, "type": "jackpot", "desc": "HỐ ĐEN + 1000", "icon": "res://assets/ui/icons/icon_egg_blackhole.svg"}
]

func _ready() -> void:
	if btn_close: btn_close.pressed.connect(close_modal)
	if btn_claim: btn_claim.pressed.connect(_on_claim_pressed)

	var backdrop = get_node_or_null("Backdrop")
	if backdrop:
		backdrop.gui_input.connect(func(event: InputEvent):
			if not is_closing and ((event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed()) or (event is InputEventScreenTouch and event.is_pressed())):
				close_modal()
		)

	_apply_cartoon_ui_theme()
	_render_cards()
	_update_claim_status()

	# Hoạt ảnh mở đàn hồi
	if modal_panel:
		modal_panel.pivot_offset = modal_panel.size * 0.5
		modal_panel.scale = Vector2(0.5, 0.5)
		var tw = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw.tween_property(modal_panel, "scale", Vector2.ONE, 0.28)

func _apply_cartoon_ui_theme() -> void:
	if modal_panel:
		var sbt_modal = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_modal_wood_frame.svg", 36, 36, 36, 44)
		if sbt_modal: modal_panel.add_theme_stylebox_override("panel", sbt_modal)

	if title_label:
		var sbt_ribbon = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/banner_ribbon_gold.svg", 36, 12, 36, 18)
		if sbt_ribbon:
			title_label.add_theme_stylebox_override("normal", sbt_ribbon)
			title_label.add_theme_color_override("font_color", Color(0.24, 0.11, 0.0))
			title_label.add_theme_color_override("font_outline_color", Color(1.0, 0.96, 0.75))
			title_label.add_theme_constant_override("outline_size", 4)

	if btn_claim and btn_claim.has_method("set_button_style"):
		btn_claim.set_button_style("gold")
	if btn_close and btn_close.has_method("set_button_style"):
		btn_close.set_button_style("red")

func _render_cards() -> void:
	if not cards_container: return
	for c in cards_container.get_children():
		c.queue_free()
	day_cards.clear()

	var sm = get_node_or_null("/root/SaveManager")
	var streak = sm.get_daily_login_streak() if sm else 0
	var can_claim = sm.can_claim_daily_login() if sm else false
	var next_day = (streak % 7) + 1 if can_claim else (streak if streak > 0 else 1)

	var lm = get_node_or_null("/root/LocalizationManager")

	for cfg in REWARDS_CONFIG:
		var day_num = int(cfg["day"])
		var card = PanelContainer.new()
		card.custom_minimum_size = Vector2(98, 120)

		var sbox = StyleBoxFlat.new()
		sbox.corner_radius_top_left = 12
		sbox.corner_radius_top_right = 12
		sbox.corner_radius_bottom_right = 12
		sbox.corner_radius_bottom_left = 12

		var is_past = false
		var is_current = false

		if can_claim:
			if day_num < next_day:
				is_past = true
			elif day_num == next_day:
				is_current = true
		else:
			if day_num <= streak:
				is_past = true

		if is_current:
			sbox.bg_color = Color(0.32, 0.18, 0.08, 0.98)
			sbox.border_width_left = 3
			sbox.border_width_top = 3
			sbox.border_width_right = 3
			sbox.border_width_bottom = 5
			sbox.border_color = Color(0.85, 0.65, 0.25)
		elif is_past:
			sbox.bg_color = Color(0.14, 0.20, 0.12, 0.92)
			sbox.border_width_left = 2
			sbox.border_width_top = 2
			sbox.border_width_right = 2
			sbox.border_width_bottom = 2
			sbox.border_color = Color(0.28, 0.70, 0.32)
		else:
			sbox.bg_color = Color(0.16, 0.10, 0.06, 0.88)
			sbox.border_width_left = 2
			sbox.border_width_top = 2
			sbox.border_width_right = 2
			sbox.border_width_bottom = 2
			sbox.border_color = Color(0.38, 0.24, 0.14)

		card.add_theme_stylebox_override("panel", sbox)

		var vbox = VBoxContainer.new()
		vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		vbox.add_theme_constant_override("separation", 4)
		card.add_child(vbox)

		# Header ngày
		var lbl_day = Label.new()
		var day_tpl = lm.t("KEY_DAY_N") if lm else "Day %d"
		lbl_day.text = day_tpl % day_num
		lbl_day.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl_day.add_theme_font_size_override("font_size", 12)
		lbl_day.add_theme_color_override("font_color", Color(1.0, 0.9, 0.4) if is_current else Color(0.85, 0.85, 0.85))
		vbox.add_child(lbl_day)

		# Icon phần quà
		var ico_rect = TextureRect.new()
		ico_rect.custom_minimum_size = Vector2(40, 40)
		ico_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		ico_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		var tex = ParticleHelper._safe_load(cfg["icon"])
		if tex: ico_rect.texture = tex
		vbox.add_child(ico_rect)

		# Mô tả phần quà
		var lbl_desc = Label.new()
		lbl_desc.text = cfg["desc"]
		lbl_desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl_desc.add_theme_font_size_override("font_size", 10)
		lbl_desc.add_theme_color_override("font_color", Color(1.0, 0.95, 0.8))
		vbox.add_child(lbl_desc)

		# Nhãn trạng thái
		var lbl_st = Label.new()
		lbl_st.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl_st.add_theme_font_size_override("font_size", 11)
		if is_past:
			lbl_st.text = "✓ ĐÃ NHẬN"
			lbl_st.add_theme_color_override("font_color", Color(0.4, 1.0, 0.4))
		elif is_current:
			lbl_st.text = "★ HÔM NAY"
			lbl_st.add_theme_color_override("font_color", Color(1.0, 0.9, 0.1))
		else:
			lbl_st.text = "🔒 KHÓA"
			lbl_st.add_theme_color_override("font_color", Color(0.65, 0.65, 0.65))
		vbox.add_child(lbl_st)

		cards_container.add_child(card)
		day_cards.append(card)

func _update_claim_status() -> void:
	var sm = get_node_or_null("/root/SaveManager")
	var lm = get_node_or_null("/root/LocalizationManager")
	if not sm: return

	var can_claim = sm.can_claim_daily_login()
	if btn_claim:
		btn_claim.visible = can_claim
		if lm: btn_claim.text = lm.t("KEY_CLAIM")
	if status_label:
		status_label.visible = not can_claim
		if not can_claim:
			status_label.text = "✓ Bạn đã nhận quà hôm nay! Hãy quay lại vào ngày mai nhé."

func _on_claim_pressed() -> void:
	var sm = get_node_or_null("/root/SaveManager")
	if not sm: return
	var reward = sm.claim_daily_login_reward()
	if not reward.get("success", false):
		return

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_victory()

	ParticleHelper.spawn_confetti_burst(self, Vector2(270.0, 360.0), 32)
	ParticleHelper.spawn_star_pop(self, Vector2(270.0, 340.0))

	_render_cards()
	_update_claim_status()

func close_modal() -> void:
	if is_closing: return
	is_closing = true
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_button_click()
	if modal_panel:
		var tw = create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
		tw.tween_property(modal_panel, "scale", Vector2(0.2, 0.2), 0.16)
		await tw.finished
	login_modal_closed.emit()
	queue_free()

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		close_modal()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		close_modal()
