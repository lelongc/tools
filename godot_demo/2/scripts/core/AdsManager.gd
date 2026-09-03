extends Node

signal ad_offered(placement: String)
signal ad_started(placement: String)
signal ad_completed(placement: String, reward_type: String, amount: int)
signal ad_skipped(placement: String)

const PLACEMENT_LAST_STAND = "last_stand"
const PLACEMENT_TRIPLE_COINS = "triple_coins"
const PLACEMENT_VIP_TRIAL = "vip_trial"
const PLACEMENT_DAILY_SPIN = "daily_spin"

# Trạng thái tải trước (Pre-load cache)
var is_ad_cached: bool = true
var is_ad_showing: bool = false

# Lớp giao diện hiển thị video mô phỏng
var ad_overlay_layer: CanvasLayer = null
var active_callback: Callable = Callable()
var active_failed_callback: Callable = Callable()
var current_placement: String = ""
var current_reward_type: String = ""
var current_amount: int = 0

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_create_mock_ad_overlay()

# Quy tắc Vùng An Toàn (Grace Period: Màn 1 đến 5 không có quảng cáo)
func is_ad_allowed_for_level(level_id: int) -> bool:
	return level_id > 5

func is_rewarded_ready() -> bool:
	return is_ad_cached and not is_ad_showing

# Điểm gọi chính để hiển thị Rewarded Ad
func show_rewarded_ad(placement: String, reward_type: String, amount: int, on_success: Callable, on_failed: Callable = Callable()) -> void:
	if is_ad_showing: return

	ad_offered.emit(placement)

	# Kiểm tra kết nối / cache
	if not is_rewarded_ready():
		if on_failed.is_valid(): on_failed.call()
		return

	is_ad_showing = true
	active_callback = on_success
	active_failed_callback = on_failed
	current_placement = placement
	current_reward_type = reward_type
	current_amount = amount

	ad_started.emit(placement)
	_play_mock_video_overlay()

func _create_mock_ad_overlay() -> void:
	ad_overlay_layer = CanvasLayer.new()
	ad_overlay_layer.layer = 120
	ad_overlay_layer.visible = false
	add_child(ad_overlay_layer)

	var bg = ColorRect.new()
	bg.name = "Background"
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.color = Color(0.04, 0.04, 0.08, 0.92)
	ad_overlay_layer.add_child(bg)

	var center = CenterContainer.new()
	center.name = "Center"
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	ad_overlay_layer.add_child(center)

	var card = PanelContainer.new()
	card.name = "Card"
	card.custom_minimum_size = Vector2(440, 540)
	center.add_child(card)

	var vbox = VBoxContainer.new()
	vbox.name = "VBox"
	vbox.add_theme_constant_override("separation", 18)
	card.add_child(vbox)

	# Header
	var title = Label.new()
	title.name = "AdTitle"
	title.text = "🎬 QUẢNG CÁO NHẬN THƯỞNG"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 22)
	title.add_theme_color_override("font_color", Color(0.95, 0.8, 0.2))
	vbox.add_child(title)

	# Countdown Label
	var timer_label = Label.new()
	timer_label.name = "TimerLabel"
	timer_label.text = "Phần thưởng sẽ mở sau: 3s"
	timer_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	timer_label.add_theme_font_size_override("font_size", 16)
	timer_label.add_theme_color_override("font_color", Color(0.7, 0.8, 0.9))
	vbox.add_child(timer_label)

	# Progress Bar
	var pbar = ProgressBar.new()
	pbar.name = "ProgressBar"
	pbar.custom_minimum_size = Vector2(0, 16)
	pbar.max_value = 3.0
	pbar.value = 0.0
	pbar.show_percentage = false
	vbox.add_child(pbar)

	# Simulated Video Screen / Sponsor Frame
	var screen_rect = ColorRect.new()
	screen_rect.name = "ScreenRect"
	screen_rect.custom_minimum_size = Vector2(400, 240)
	screen_rect.color = Color(0.12, 0.16, 0.24)
	vbox.add_child(screen_rect)

	var screen_vbox = VBoxContainer.new()
	screen_vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	screen_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	screen_rect.add_child(screen_vbox)

	var icon_label = Label.new()
	icon_label.name = "RewardIcon"
	icon_label.text = "🎁"
	icon_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	icon_label.add_theme_font_size_override("font_size", 48)
	screen_vbox.add_child(icon_label)

	var desc_label = Label.new()
	desc_label.name = "RewardDesc"
	desc_label.text = "Đang xem quảng cáo tài trợ..."
	desc_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc_label.add_theme_font_size_override("font_size", 18)
	screen_vbox.add_child(desc_label)

	# Bottom Action Buttons
	var hbox = HBoxContainer.new()
	hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	hbox.add_theme_constant_override("separation", 16)
	vbox.add_child(hbox)

	var btn_skip = Button.new()
	btn_skip.name = "BtnSkip"
	btn_skip.text = "✕ Bỏ qua"
	btn_skip.custom_minimum_size = Vector2(130, 48)
	hbox.add_child(btn_skip)

	var btn_claim = Button.new()
	btn_claim.name = "BtnClaim"
	btn_claim.text = "✔ Nhận Thưởng"
	btn_claim.disabled = true
	btn_claim.custom_minimum_size = Vector2(180, 48)
	hbox.add_child(btn_claim)

	btn_skip.pressed.connect(_on_ad_skipped)
	btn_claim.pressed.connect(_on_ad_claimed)

func _play_mock_video_overlay() -> void:
	if not ad_overlay_layer: return
	ad_overlay_layer.visible = true

	var timer_label = ad_overlay_layer.get_node_or_null("Center/Card/VBox/TimerLabel") as Label
	var pbar = ad_overlay_layer.get_node_or_null("Center/Card/VBox/ProgressBar") as ProgressBar
	var btn_claim = ad_overlay_layer.get_node_or_null("Center/Card/VBox/HBox/BtnClaim") as Button
	var btn_skip = ad_overlay_layer.get_node_or_null("Center/Card/VBox/HBox/BtnSkip") as Button
	var icon_label = ad_overlay_layer.get_node_or_null("Center/Card/VBox/ScreenRect/VBoxContainer/RewardIcon") as Label
	var desc_label = ad_overlay_layer.get_node_or_null("Center/Card/VBox/ScreenRect/VBoxContainer/RewardDesc") as Label

	if btn_claim: btn_claim.disabled = true
	if btn_skip: btn_skip.disabled = false
	if pbar: pbar.value = 0.0

	match current_placement:
		PLACEMENT_LAST_STAND:
			if icon_label: icon_label.text = "💣"
			if desc_label: desc_label.text = "Cứu thua: Tặng +1 Quả Trứng Nổ!"
		PLACEMENT_TRIPLE_COINS:
			if icon_label: icon_label.text = "🪙🪙🪙"
			if desc_label: desc_label.text = "Nhân ba phần thưởng: Nhận ngay %d Vàng!" % current_amount
		PLACEMENT_VIP_TRIAL:
			if icon_label: icon_label.text = "🧪"
			if desc_label: desc_label.text = "Dùng thử đạn VIP: Tặng 1 Trứng Axit!"
		PLACEMENT_DAILY_SPIN:
			if icon_label: icon_label.text = "🎡"
			if desc_label: desc_label.text = "Quay thêm 1 lượt may mắn!"

	# Chạy đếm ngược 3 giây
	var duration = 3.0
	var tween = create_tween()
	tween.tween_method(func(val: float):
		if pbar: pbar.value = val
		var remaining = max(0.0, duration - val)
		if timer_label:
			timer_label.text = "Phần thưởng sẵn sàng sau: %d giây" % int(ceil(remaining))
	, 0.0, duration, duration)

	await tween.finished

	if timer_label:
		timer_label.text = "🎉 Đã đủ điều kiện nhận thưởng!"
		timer_label.add_theme_color_override("font_color", Color(0.2, 0.9, 0.4))
	if btn_claim:
		btn_claim.disabled = false
		btn_claim.grab_focus()

func _on_ad_claimed() -> void:
	if not is_ad_showing: return
	is_ad_showing = false
	ad_overlay_layer.visible = false

	# Kích hoạt phần thưởng
	match current_placement:
		PLACEMENT_LAST_STAND:
			GameManager.available_eggs.append("bomb")
			GameManager.is_level_active = true
			GameManager.is_settling = false
		PLACEMENT_TRIPLE_COINS:
			if has_node("/root/SaveManager"):
				get_node("/root/SaveManager").add_coins(current_amount)
		PLACEMENT_VIP_TRIAL:
			GameManager.available_eggs.insert(GameManager.current_egg_index, "acid")
		PLACEMENT_DAILY_SPIN:
			pass

	ad_completed.emit(current_placement, current_reward_type, current_amount)

	if active_callback.is_valid():
		active_callback.call()

func _on_ad_skipped() -> void:
	if not is_ad_showing: return
	is_ad_showing = false
	ad_overlay_layer.visible = false

	ad_skipped.emit(current_placement)

	if active_failed_callback.is_valid():
		active_failed_callback.call()
