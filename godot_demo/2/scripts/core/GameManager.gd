extends Node

signal enemy_defeated(enemy_node, points)
signal egg_dropped(egg_type)
signal level_started(level_id, egg_list)
signal level_completed(stars, score, coins)
signal level_failed()
signal last_stand_offered(enemies_left)
signal score_updated(new_score)

var current_level: int = 1
var total_levels: int = 200

var current_score: int = 0
var remaining_enemies: int = 0
var total_enemies: int = 0
var available_eggs: Array[String] = []
var current_egg_index: int = 0
var has_first_impact_occurred: bool = false

var is_level_active: bool = false
var is_level_finishing: bool = false
var is_settling: bool = false
var settle_timer: float = 0.0
var max_settle_fallback_timer: float = 0.0
var current_floor_y: float = 840.0

var total_level_blocks: int = 0
var destroyed_blocks_count: int = 0

var last_stand_used_in_level: bool = false
var vip_trial_used_in_level: bool = false
var current_session_id: int = 0

var last_back_press_time: float = 0.0

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_setup_youtube_bridge()

func _notification(what: int) -> void:
	match what:
		NOTIFICATION_WM_GO_BACK_REQUEST:
			_handle_mobile_back()
		NOTIFICATION_APPLICATION_PAUSED, NOTIFICATION_APPLICATION_FOCUS_OUT:
			_handle_app_paused()

func _handle_app_paused() -> void:
	# Tự động bật tạm dừng (Auto-Pause) để bảo vệ ván đấu khi có cuộc gọi hoặc chuyển app
	if is_level_active and not get_tree().paused:
		var scene = get_tree().current_scene
		if scene and scene.name == "CampaignLevel":
			var hud = scene.get_node_or_null("GameHUD")
			if hud and hud.has_method("toggle_pause"):
				hud.toggle_pause()

func _handle_mobile_back() -> void:
	# 1. Nếu đang hiển thị lớp quảng cáo mô phỏng thì bỏ qua quảng cáo
	if has_node("/root/AdsManager") and get_node("/root/AdsManager").is_ad_showing:
		get_node("/root/AdsManager")._on_ad_skipped()
		return

	var scene = get_tree().current_scene
	if not scene: return

	# 2. Điều hướng theo scene hiện hành
	if scene.name == "CampaignLevel":
		var hud = scene.get_node_or_null("GameHUD")
		if hud and hud.has_method("handle_back_button"):
			hud.handle_back_button()
		elif hud and hud.has_method("toggle_pause"):
			hud.toggle_pause()
		else:
			go_to_level_select()
	elif scene.name == "LevelSelect":
		go_to_main_menu()
	elif scene.name == "MainMenu":
		if scene.has_method("_handle_back_button") and scene._handle_back_button():
			return

		# Cơ chế nhấn 2 lần trong 2 giây để thoát (Double-tap back debounce)
		var now = Time.get_ticks_msec() / 1000.0
		if now - last_back_press_time < 2.0:
			get_tree().quit(0)
		else:
			last_back_press_time = now
			if has_node("/root/SoundManager"):
				get_node("/root/SoundManager").play_button_click()

func start_level(level_id: int, enemy_count: int, egg_list: Array[String]) -> void:
	current_session_id += 1
	current_level = level_id
	total_enemies = enemy_count
	remaining_enemies = enemy_count
	available_eggs = egg_list.duplicate()
	current_egg_index = 0
	has_first_impact_occurred = false
	current_score = 0
	total_level_blocks = 0
	destroyed_blocks_count = 0
	is_level_active = true
	is_level_finishing = false
	is_settling = false
	settle_timer = 0.0
	max_settle_fallback_timer = 0.0
	last_stand_used_in_level = false
	vip_trial_used_in_level = false
	score_updated.emit(current_score)
	level_started.emit(current_level, available_eggs)
	report_youtube_game_ready()

func register_first_impact() -> void:
	has_first_impact_occurred = true

func register_block_destroyed() -> void:
	if not is_level_active and not is_level_finishing: return
	destroyed_blocks_count += 1

func add_score(points: int) -> void:
	if not is_level_active and not is_level_finishing: return
	current_score += points
	score_updated.emit(current_score)

func register_enemy_defeat(enemy: Node, points: int = 800) -> void:
	if not is_level_active: return
	remaining_enemies = max(0, remaining_enemies - 1)
	add_score(points)
	enemy_defeated.emit(enemy, points)

	if remaining_enemies == 0:
		_trigger_victory_delay()

func get_next_egg() -> String:
	if current_egg_index < available_eggs.size():
		var egg = available_eggs[current_egg_index]
		current_egg_index += 1
		egg_dropped.emit(egg)
		return egg
	return ""

func add_active_booster_egg(egg_type: String) -> bool:
	if not is_level_active: return false
	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		if sm.use_consumable(egg_type):
			available_eggs.insert(current_egg_index, egg_type)
			is_settling = false
			settle_timer = 2.0
			max_settle_fallback_timer = 9.0
			level_started.emit(current_level, available_eggs)
			var chicken = get_tree().get_first_node_in_group("Player")
			if chicken and chicken.has_method("_prepare_next_egg"):
				chicken._prepare_next_egg()
			return true
	return false

func check_out_of_eggs() -> void:
	if remaining_enemies > 0 and current_egg_index >= available_eggs.size():
		is_settling = true
		settle_timer = 2.0
		max_settle_fallback_timer = 9.0

func has_active_gameplay_elements() -> bool:
	var tree = get_tree()
	if not tree: return false

	# 1. Kiểm tra xem còn quả trứng nào còn sống trên không
	var projectiles = tree.get_nodes_in_group("Projectiles")
	for p in projectiles:
		if is_instance_valid(p) and not p.is_queued_for_deletion():
			if "is_breaking" in p and not p.is_breaking:
				return true
			elif "is_broken" in p and not p.is_broken:
				return true
			elif not ("is_breaking" in p or "is_broken" in p):
				return true

	# 2. Kiểm tra thuốc nổ đang cháy kíp nổ chuẩn bị nổ
	var explosives = tree.get_nodes_in_group("Explosives")
	for exp_obj in explosives:
		if is_instance_valid(exp_obj) and not exp_obj.is_queued_for_deletion():
			if "is_ignited" in exp_obj and exp_obj.is_ignited:
				return true

	# 3. Kiểm tra các khối / tảng đá đang rơi với vận tốc lớn (có thể đè trúng quái)
	var destructibles = tree.get_nodes_in_group("Destructibles")
	for d in destructibles:
		if is_instance_valid(d) and not d.is_queued_for_deletion() and d is RigidBody2D:
			if not d.freeze and d.linear_velocity.length() > 60.0:
				return true

	return false

func _process(delta: float) -> void:
	# BUG-02: Không chạy đếm ngược gameplay khi SceneTree đang tạm dừng (Pause)
	if get_tree().paused:
		return

	if is_settling and is_level_active:
		max_settle_fallback_timer -= delta
		# BUG-04: Nếu còn trứng đang bay, thuốc nổ đang cháy, hoặc khối đang rơi thì kiên nhẫn đợi
		if has_active_gameplay_elements() and max_settle_fallback_timer > 0.0:
			settle_timer = 1.5
		else:
			settle_timer -= delta

		if remaining_enemies == 0:
			is_settling = false
			_trigger_victory_delay()
		elif settle_timer <= 0.0 or max_settle_fallback_timer <= 0.0:
			is_settling = false
			if remaining_enemies > 0:
				# Điểm chạm 1: Cứu thua "Suýt thắng" (Last Stand)
				# Grace Period: chỉ xuất hiện từ Màn 6 trở đi
				# Điều kiện: quái còn <= 2 con và chưa dùng cứu thua ở màn này
				if current_level > 5 and remaining_enemies <= 2 and not last_stand_used_in_level:
					last_stand_used_in_level = true
					last_stand_offered.emit(remaining_enemies)
				else:
					fail_level()

func fail_level() -> void:
	if not is_level_active: return
	if remaining_enemies == 0: return
	is_level_active = false
	level_failed.emit()

func _trigger_victory_delay(skip_delay: bool = false) -> Variant:
	if not is_level_active: return 0
	is_level_active = false
	is_level_finishing = true

	if not skip_delay:
		var session = current_session_id
		await get_tree().create_timer(1.2).timeout
		if session != current_session_id:
			is_level_finishing = false
			return 0 # Bỏ qua nếu người chơi đã thoát hoặc đổi màn trong lúc đợi

	is_level_finishing = false

	var unused_eggs = max(0, available_eggs.size() - current_egg_index)
	# Cộng điểm thưởng trứng dư trực tiếp vào snapshot sau khi các khối kết thúc sập đổ
	var bonus_points = unused_eggs * 1200
	current_score += bonus_points
	score_updated.emit(current_score)

	# BUG-06: Chụp snapshot điểm chính xác tại thời điểm đóng màn
	var snapshot_final_score = current_score

	var base_target = (total_enemies * 800) + 400
	var star3_target = base_target + 1400
	var star2_target = base_target + 600

	var destruction_ratio = float(destroyed_blocks_count) / float(max(1, total_level_blocks))

	# Hệ thống chấm sao Hybrid 3-Star: Phá vỡ bế tắc 3 sao
	# Đạt 3 sao nếu (Dư trứng VÀ đạt mốc điểm) HOẶC (Tỉ lệ tàn phá cấu trúc >= 88%)
	var stars = 1
	if (snapshot_final_score >= star3_target and unused_eggs >= 1) or destruction_ratio >= 0.88:
		stars = 3
	elif snapshot_final_score >= star2_target or unused_eggs >= 1 or destruction_ratio >= 0.50:
		stars = 2

	var base_coins = 50
	if stars == 2: base_coins = 80
	elif stars == 3: base_coins = 120

	# Lưu kết quả vào SaveManager bằng đúng điểm snapshot
	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		sm.record_level_result(current_level, stars, snapshot_final_score)

	# Báo cáo điểm số lên YouTube Playables nếu chạy trên nền tảng Web
	send_youtube_score(snapshot_final_score)

	level_completed.emit(stars, snapshot_final_score, base_coins)
	return stars

func trigger_dramatic_slowmo(target_scale: float = 0.35, real_duration: float = 0.35) -> void:
	if not is_level_active: return
	Engine.time_scale = clampf(target_scale, 0.1, 1.0)
	var timer = get_tree().create_timer(real_duration, false, false, true)
	timer.timeout.connect(func():
		if is_level_active or not get_tree().paused:
			Engine.time_scale = 1.0
	)

func _setup_youtube_bridge() -> void:
	if OS.has_feature("web"):
		var js_bridge = Engine.get_singleton("JavaScriptBridge")
		if js_bridge:
			var pause_cb = JavaScriptBridge.create_callback(func(_args): _handle_app_paused())
			var audio_cb = JavaScriptBridge.create_callback(func(args):
				if args.size() > 0:
					var enabled = bool(args[0])
					AudioServer.set_bus_mute(0, not enabled)
			)
			var win = JavaScriptBridge.get_interface("window")
			if win:
				win.godot_on_pause = pause_cb
				win.godot_on_audio_change = audio_cb

func report_youtube_game_ready() -> void:
	if OS.has_feature("web"):
		var js_bridge = Engine.get_singleton("JavaScriptBridge")
		if js_bridge:
			js_bridge.eval("""
				if (window.YT && window.YT.playables) {
					window.YT.playables.firstFrameReady();
					window.YT.playables.gameReady();
					
					window.YT.playables.onPause(function() {
						if (window.godot_on_pause) window.godot_on_pause();
					});
					window.YT.playables.onResume(function() {
						if (window.godot_on_resume) window.godot_on_resume();
					});
					window.YT.playables.onAudioEnabledChange(function(enabled) {
						if (window.godot_on_audio_change) window.godot_on_audio_change(enabled);
					});
				}
			""")

func send_youtube_score(score: int) -> void:
	if OS.has_feature("web"):
		var js_bridge = Engine.get_singleton("JavaScriptBridge")
		if js_bridge:
			js_bridge.eval("if (window.YT && window.YT.playables) { window.YT.playables.sendScore({value: %d}); }" % score)

func load_level(level_id: int) -> void:
	Engine.time_scale = 1.0
	get_tree().paused = false
	current_session_id += 1
	current_level = clamp(level_id, 1, total_levels)
	get_tree().change_scene_to_file("res://scenes/levels/CampaignLevel.tscn")

func next_level() -> void:
	if current_level < total_levels:
		load_level(current_level + 1)
	else:
		go_to_level_select()

func restart_current_level() -> void:
	Engine.time_scale = 1.0
	get_tree().paused = false
	current_session_id += 1
	get_tree().reload_current_scene()

func go_to_level_select() -> void:
	Engine.time_scale = 1.0
	get_tree().paused = false
	current_session_id += 1
	get_tree().change_scene_to_file("res://scenes/ui/LevelSelect.tscn")

func go_to_main_menu() -> void:
	Engine.time_scale = 1.0
	get_tree().paused = false
	current_session_id += 1
	get_tree().change_scene_to_file("res://scenes/ui/MainMenu.tscn")
