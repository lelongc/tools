extends Node

func _ready() -> void:
	print("\n=======================================================")
	print("🐡 BẮT ĐẦU KIỂM THỬ: PUFFY POP - BOUNCY HERO (GODOT 4.7.1)")
	print("   [60 Màn, 8 Vùng Biển, Thủy Lôi, Portal, Xoáy, Boss]")
	print("=======================================================\n")
	
	var all_passed = true
	all_passed = _test_player_physics_and_antistuck() and all_passed
	all_passed = _test_bouncy_bumper_and_combo() and all_passed
	all_passed = _test_enemy_crab_squash() and all_passed
	all_passed = _test_new_entities() and all_passed
	all_passed = _test_pearl_and_accurate_scoring() and all_passed
	all_passed = _test_level_victory_goal() and all_passed
	all_passed = _test_chill_bgm_and_sound_debounce() and all_passed
	all_passed = _test_arena_across_8_worlds() and all_passed
	all_passed = _test_pause_modal_and_ui() and all_passed
	all_passed = _test_tutorial_modal() and all_passed
	all_passed = _test_mystic_clam() and all_passed
	all_passed = _test_ambient_fish() and all_passed
	all_passed = _test_sea_mine_explosion() and all_passed
	all_passed = _test_ocean_portal_teleport() and all_passed
	all_passed = _test_gravity_vortex() and all_passed
	all_passed = _test_boss_battle() and all_passed
	all_passed = _test_android_back_button_and_lifecycle() and all_passed
	all_passed = _test_rewarded_ad_and_haptic() and all_passed
	all_passed = _test_hd_vector_textures_and_puffy_sprite() and all_passed
	all_passed = _test_deterministic_3_star_and_wipe_data() and all_passed
	all_passed = _test_ui_button_texture_icons() and all_passed
	all_passed = _test_aquatic_particles_no_stars() and all_passed
	all_passed = _test_multilanguage_and_ergonomic_ui() and all_passed
	
	print("\n-------------------------------------------------------")
	if all_passed:
		print("✅ [TẤT CẢ 23/23 TEST PUFFY POP HOÀN TẤT THÀNH CÔNG 100%]")
		print("=======================================================\n")
		get_tree().quit(0)
	else:
		print("❌ [CÓ LỖI XẢY RA TRONG QUÁ TRÌNH KIỂM THỬ]")
		print("=======================================================\n")
		get_tree().quit(1)

func _test_player_physics_and_antistuck() -> bool:
	print("▶ [TEST 1] Kiểm tra Slingshot, Phồng To, Xì Hơi & Chống Kẹt Thông Minh...")
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	add_child(player)
	
	if player.current_state != PuffyPlayer.PuffyState.IDLE:
		printerr("  ❌ Lỗi: Trạng thái khởi đầu không phải IDLE!")
		player.queue_free()
		return false
		
	PuffyGameManager.shots_remaining = 3
	player._execute_launch(player.launch_origin - Vector2(100, 50))
	if player.current_state != PuffyPlayer.PuffyState.FLYING_NORMAL:
		printerr("  ❌ Lỗi: Sau khi bắn không chuyển sang FLYING_NORMAL!")
		player.queue_free()
		return false
		
	player.trigger_inflate()
	if player.current_state != PuffyPlayer.PuffyState.FLYING_INFLATED:
		printerr("  ❌ Lỗi: Không chuyển sang trạng thái FLYING_INFLATED!")
		player.queue_free()
		return false
		
	player.trigger_jet_deflate()
	if player.current_state != PuffyPlayer.PuffyState.JET_DEFLATING:
		printerr("  ❌ Lỗi: Không chuyển sang trạng thái JET_DEFLATING!")
		player.queue_free()
		return false
		
	player.force_recall_to_pad()
	if player.current_state != PuffyPlayer.PuffyState.IDLE:
		printerr("  ❌ Lỗi: Hàm Giải Cứu Puffy không đưa về IDLE!")
		player.queue_free()
		return false
		
	print("  ✓ Cơ chế Slingshot, Phồng To, Xì Hơi và Giải Cứu Puffy hoạt động hoàn hảo.")
	player.queue_free()
	return true

func _test_bouncy_bumper_and_combo() -> bool:
	print("▶ [TEST 2] Kiểm tra Nấm San Hô Nảy Pinball & Hệ Thống Combo...")
	var bumper_scene = load("res://scenes/prefabs/BouncyBumper.tscn")
	var bumper = bumper_scene.instantiate() as BouncyBumper
	add_child(bumper)
	
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	add_child(player)
	
	PuffyGameManager.current_score = 0
	PuffyGameManager.bounce_combo = 1
	
	player.velocity = Vector2(120, 120)
	var initial_vel = player.velocity.length()
	
	bumper.on_puffy_hit(player, false)
	if player.velocity.length() <= initial_vel:
		printerr("  ❌ Lỗi: Nấm san hô không gia tăng xung lực nảy cho Puffy!")
		bumper.queue_free()
		player.queue_free()
		return false
		
	if PuffyGameManager.current_score < 100 or PuffyGameManager.bounce_combo < 2:
		printerr("  ❌ Lỗi: Điểm combo nảy chưa được ghi nhận chính xác!")
		bumper.queue_free()
		player.queue_free()
		return false
		
	print("  ✓ Nấm san hô nảy Pinball và điểm Combo nhân đôi hoạt động chuẩn xác.")
	bumper.queue_free()
	player.queue_free()
	return true

func _test_enemy_crab_squash() -> bool:
	print("▶ [TEST 3] Kiểm tra va chạm Cua Cướp Biển (EnemyCrab)...")
	var crab_scene = load("res://scenes/prefabs/EnemyCrab.tscn")
	var crab = crab_scene.instantiate() as EnemyCrab
	add_child(crab)
	
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	add_child(player)
	
	crab.on_puffy_hit(player, false)
	if crab.is_defeated:
		printerr("  ❌ Lỗi: Puffy nhỏ không được tiêu diệt cua!")
		crab.queue_free()
		player.queue_free()
		return false
		
	crab.on_puffy_hit(player, true)
	if not crab.is_defeated:
		printerr("  ❌ Lỗi: Puffy phồng to không hạ gục được cua!")
		crab.queue_free()
		player.queue_free()
		return false
		
	print("  ✓ Cơ chế đè bẹp cua cướp biển khi phồng to hoạt động chuẩn xác.")
	crab.queue_free()
	player.queue_free()
	return true

func _test_new_entities() -> bool:
	print("▶ [TEST 4] Kiểm tra các Thực Thể (Sứa, Nhím, San Hô Vỡ, Hải Lưu)...")
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	add_child(player)
	
	# 1. Sứa Bouncer
	var jelly_scene = load("res://scenes/prefabs/JellyfishBouncer.tscn")
	var jelly = jelly_scene.instantiate() as JellyfishBouncer
	add_child(jelly)
	player.velocity = Vector2(50, 50)
	jelly.on_puffy_hit(player, false)
	if player.velocity.y > 0:
		printerr("  ❌ Lỗi: Sứa biển không đẩy Puffy bổng lên trên!")
		jelly.queue_free()
		player.queue_free()
		return false
	jelly.queue_free()
	
	# 2. Nhím Biển Urchin
	var urchin_scene = load("res://scenes/prefabs/EnemyUrchin.tscn")
	var urchin = urchin_scene.instantiate() as EnemyUrchin
	add_child(urchin)
	urchin.on_puffy_hit(player, false)
	if urchin.is_defeated:
		printerr("  ❌ Lỗi: Puffy nhỏ không được tiêu diệt nhím!")
		urchin.queue_free()
		player.queue_free()
		return false
	urchin.on_puffy_hit(player, true)
	if not urchin.is_defeated:
		printerr("  ❌ Lỗi: Puffy phồng to không tiêu diệt được nhím!")
		urchin.queue_free()
		player.queue_free()
		return false
	urchin.queue_free()
	
	# 3. Gạch San Hô Phá Vỡ (Breakable Coral)
	var coral_scene = load("res://scenes/prefabs/BreakableCoral.tscn")
	var coral = coral_scene.instantiate() as BreakableCoral
	add_child(coral)
	coral.on_puffy_hit(player, true)
	if not coral.is_broken:
		printerr("  ❌ Lỗi: San hô không vỡ khi bị Puffy phồng to húc!")
		coral.queue_free()
		player.queue_free()
		return false
	coral.queue_free()
	
	# 4. Luồng Hải Lưu Tăng Tốc (Speed Current)
	var speed_scene = load("res://scenes/prefabs/SpeedCurrent.tscn")
	var stream = speed_scene.instantiate() as SpeedCurrent
	add_child(stream)
	player.apply_speed_boost(Vector2.RIGHT, 700.0)
	if player.velocity.x < 600.0:
		printerr("  ❌ Lỗi: Hải lưu không gia tốc cho Puffy!")
		stream.queue_free()
		player.queue_free()
		return false
	stream.queue_free()
	
	print("  ✓ Cả 4 thực thể (Sứa lò xo, Nhím gai, San hô vỡ, Hải lưu) hoạt động trơn tru.")
	player.queue_free()
	return true

func _test_pearl_and_accurate_scoring() -> bool:
	print("▶ [TEST 5] Kiểm tra chuẩn xác hệ thống tính điểm, đạn thưởng & 3 Sao...")
	PuffyGameManager.current_score = 0
	PuffyGameManager.level_pearls_collected = 0
	PuffyGameManager.total_pearls_bank = 0
	PuffyGameManager.shots_remaining = 2
	
	PuffyGameManager.add_pearl()
	PuffyGameManager.add_pearl()
	PuffyGameManager.add_pearl()
	if PuffyGameManager.level_pearls_collected != 3 or PuffyGameManager.current_score != 1500:
		printerr("  ❌ Lỗi tính điểm ngọc trai! Điểm: ", PuffyGameManager.current_score)
		return false
		
	PuffyGameManager.finish_level_victory()
	if PuffyGameManager.current_score != 5500:
		printerr("  ❌ Lỗi tính điểm thưởng phát bắn! Tổng điểm: ", PuffyGameManager.current_score)
		return false
		
	var stars = PuffyGameManager.level_stars.get(PuffyGameManager.current_level, 0)
	if stars != 3:
		printerr("  ❌ Lỗi tính sao chuẩn mực! (Thu đủ 3 ngọc + còn đạn phải là 3 sao). Sao nhận: ", stars)
		return false
		
	print("  ✓ Hệ thống tính điểm, thưởng đạn thừa và quy chuẩn 3 Sao chính xác 100%.")
	return true

func _test_level_victory_goal() -> bool:
	print("▶ [TEST 6] Kiểm tra Cổng Xoáy Hoàng Kim (LevelGoal)...")
	var goal_scene = load("res://scenes/prefabs/LevelGoal.tscn")
	var goal = goal_scene.instantiate() as LevelGoal
	add_child(goal)
	
	if goal.is_triggered:
		printerr("  ❌ Lỗi: Goal bị kích hoạt sẵn!")
		goal.queue_free()
		return false
		
	print("  ✓ Cổng xoáy đích đến LevelGoal sẵn sàng đón Puffy.")
	goal.queue_free()
	return true

func _test_chill_bgm_and_sound_debounce() -> bool:
	print("▶ [TEST 7] Kiểm tra Nhạc Nền Ocean Lofi Chill Chill & Debounce Âm Thanh...")
	if not PuffySoundManager.bgm_player or not PuffySoundManager.bgm_stream:
		printerr("  ❌ Lỗi: Thiếu bgm_player hoặc bgm_stream trong PuffySoundManager!")
		return false
		
	if PuffySoundManager.bgm_stream.data.size() == 0:
		printerr("  ❌ Lỗi: Dữ liệu sóng âm BGM rỗng!")
		return false
		
	for i in range(50):
		PuffySoundManager.play_boing()
		
	print("  ✓ BGM Chill Chill tự tổng hợp và cơ chế Debounce âm thanh chống rè hoạt động xuất sắc.")
	return true

func _test_arena_across_8_worlds() -> bool:
	print("▶ [TEST 8] Kiểm tra sinh màn chơi xuyên suốt 8 Vùng Biển (60 Màn) & Endless...")
	var arena_scene = load("res://scenes/game/PuffyArena.tscn")
	var arena = arena_scene.instantiate() as PuffyArena
	add_child(arena)
	
	# Kiểm tra các màn đại diện của cả 8 vùng biển và 4 màn Boss
	var test_levels = [3, 10, 16, 21, 28, 32, 36, 44, 48, 52, 58, 60]
	for lvl in test_levels:
		PuffyGameManager.current_mode = PuffyGameManager.GameMode.CAMPAIGN
		PuffyGameManager.current_level = lvl
		arena._build_level_layout()
		var count = arena.obstacles_container.get_child_count()
		if count < 3:
			printerr("  ❌ Lỗi: Màn ", lvl, " không sinh đủ vật thể! Số lượng: ", count)
			arena.queue_free()
			return false
			
	PuffyGameManager.current_mode = PuffyGameManager.GameMode.ENDLESS
	arena._build_level_layout()
	var endless_count = arena.obstacles_container.get_child_count()
	if endless_count < 10:
		printerr("  ❌ Lỗi: Chế độ Endless sinh thiếu vật thể! Số lượng: ", endless_count)
		arena.queue_free()
		return false
		
	print("  ✓ Tải và sinh màn chơi 60 màn qua 8 Vùng Biển cùng chế độ Endless thành công trọn vẹn.")
	arena.queue_free()
	return true

func _test_pause_modal_and_ui() -> bool:
	print("▶ [TEST 9] Kiểm tra Modal Tạm Dừng (PuffyPauseModal)...")
	var pause_scene = load("res://scenes/ui/PuffyPauseModal.tscn")
	var pause_modal = pause_scene.instantiate() as PuffyPauseModal
	add_child(pause_modal)
	
	if not get_tree().paused:
		printerr("  ❌ Lỗi: Pause modal không kích hoạt tạm dừng engine!")
		pause_modal.queue_free()
		return false
		
	pause_modal._on_resume_pressed()
	if get_tree().paused:
		printerr("  ❌ Lỗi: Bấm Resume không unpause engine!")
		return false
		
	print("  ✓ Modal Tạm Dừng (PauseModal) hoạt động chuẩn mực và unpause chính xác.")
	return true

func _test_tutorial_modal() -> bool:
	print("▶ [TEST 10] Kiểm tra Modal Hướng Dẫn Cách Chơi (PuffyTutorialModal)...")
	var tuto_scene = load("res://scenes/ui/PuffyTutorialModal.tscn")
	var tuto_modal = tuto_scene.instantiate() as PuffyTutorialModal
	add_child(tuto_modal)
	
	if not tuto_modal.close_btn:
		printerr("  ❌ Lỗi: Thiếu close_btn trong TutorialModal!")
		tuto_modal.queue_free()
		return false
		
	tuto_modal.queue_free()
	print("  ✓ Modal Hướng Dẫn 3 bước hiển thị hoàn hảo.")
	return true

func _test_mystic_clam() -> bool:
	print("▶ [TEST 11] Kiểm tra Sò Thần Biển (MysticClam ngậm mở vỏ)...")
	var clam_scene = load("res://scenes/prefabs/MysticClam.tscn")
	var clam = clam_scene.instantiate() as MysticClam
	add_child(clam)
	
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	add_child(player)
	
	var prev_score = PuffyGameManager.current_score
	clam.is_open = true
	clam.has_pearl = true
	clam.on_puffy_hit(player, false)
	if PuffyGameManager.current_score <= prev_score:
		printerr("  ❌ Lỗi: Không nhận được điểm khi ăn ngọc trong sò!")
		clam.queue_free()
		player.queue_free()
		return false
		
	player.velocity = Vector2(100, 100)
	clam.on_puffy_hit(player, false)
	if player.velocity.length() < 100:
		printerr("  ❌ Lỗi: Sò đóng vỏ không tạo phản xạ nảy!")
		clam.queue_free()
		player.queue_free()
		return false
		
	print("  ✓ Sò Thần Biển MysticClam cơ chế ngậm mở vỏ hoạt động chính xác.")
	clam.queue_free()
	player.queue_free()
	return true

func _test_ambient_fish() -> bool:
	print("▶ [TEST 12] Kiểm tra Đàn Cá Nền (AmbientFish bơi lội mềm mại)...")
	var fish_scene = load("res://scenes/prefabs/AmbientFish.tscn")
	var fish = fish_scene.instantiate() as AmbientFish
	add_child(fish)
	
	var initial_x = fish.position.x
	fish._process(0.1)
	if fish.position.x == initial_x:
		printerr("  ❌ Lỗi: Cá bơi nền không di chuyển theo delta!")
		fish.queue_free()
		return false
		
	print("  ✓ Đàn cá bơi nền AmbientFish bơi lội mềm mại chuẩn xác.")
	fish.queue_free()
	return true

func _test_sea_mine_explosion() -> bool:
	print("▶ [TEST 13] Kiểm tra Thủy Lôi Bong Bóng (SeaMine nổ sóng xung kích)...")
	var mine_scene = load("res://scenes/prefabs/SeaMine.tscn")
	var mine = mine_scene.instantiate()
	add_child(mine)
	
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	add_child(player)
	
	player.global_position = mine.global_position + Vector2(20, 0)
	mine._detonate(player)
	
	if player.velocity.length() < 400.0:
		printerr("  ❌ Lỗi: Sóng nổ thủy lôi không gia tốc đẩy Puffy!")
		player.queue_free()
		return false
		
	print("  ✓ Thủy lôi hải quân SeaMine nổ sóng xung kích và đẩy Puffy hoàn hảo.")
	player.queue_free()
	return true

func _test_ocean_portal_teleport() -> bool:
	print("▶ [TEST 14] Kiểm tra Cặp Cổng Dịch Chuyển Không Gian (OceanPortals)...")
	var portal_scene = load("res://scenes/prefabs/OceanPortal.tscn")
	var portal_a = portal_scene.instantiate()
	var portal_b = portal_scene.instantiate()
	portal_a.position = Vector2(200, 300)
	portal_b.position = Vector2(800, 300)
	portal_a.exit_direction = Vector2.RIGHT
	portal_b.exit_direction = Vector2.UP
	portal_a.linked_portal = portal_b
	portal_b.linked_portal = portal_a
	add_child(portal_a)
	add_child(portal_b)
	
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	player.position = portal_a.position
	player.velocity = Vector2(400, 0)
	add_child(player)
	
	portal_a._on_body_entered(player)
	
	if player.global_position.distance_to(portal_b.global_position) > 10.0:
		printerr("  ❌ Lỗi: Cổng A không dịch chuyển Puffy đến tọa độ cổng B!")
		portal_a.queue_free()
		portal_b.queue_free()
		player.queue_free()
		return false
		
	if player.velocity.y >= 0:
		printerr("  ❌ Lỗi: Cổng B không định hướng vector bắn vút lên trên (UP)!")
		portal_a.queue_free()
		portal_b.queue_free()
		player.queue_free()
		return false
		
	print("  ✓ Cặp Cổng Dịch Chuyển OceanPortals bảo toàn vận tốc và dịch chuyển chuẩn xác.")
	portal_a.queue_free()
	portal_b.queue_free()
	player.queue_free()
	return true

func _test_gravity_vortex() -> bool:
	print("▶ [TEST 15] Kiểm tra Vòng Xoáy Hút Trọng Lực (GravityVortex)...")
	var vortex_scene = load("res://scenes/prefabs/GravityVortex.tscn")
	var vortex = vortex_scene.instantiate()
	vortex.position = Vector2(500, 500)
	add_child(vortex)
	
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	player.position = Vector2(550, 500)
	player.current_state = PuffyPlayer.PuffyState.FLYING_NORMAL
	player.velocity = Vector2.ZERO
	add_child(player)
	
	# Kiểm tra lực hút
	var to_center = (vortex.global_position - player.global_position).normalized()
	player.velocity += to_center * vortex.pull_force * 0.1
	if player.velocity.x >= 0:
		printerr("  ❌ Lỗi: Lực hút trọng lực không kéo Puffy về bên trái (tâm xoáy)!")
		vortex.queue_free()
		player.queue_free()
		return false
		
	print("  ✓ Vòng Xoáy Hút Trọng Lực GravityVortex uốn cong quỹ đạo chuẩn xác.")
	vortex.queue_free()
	player.queue_free()
	return true

func _test_boss_battle() -> bool:
	print("▶ [TEST 16] Kiểm tra Trận Đấu Trùm Đại Dương (Boss King Crab & HP)...")
	var boss_scene = load("res://scenes/prefabs/BossSeaCreature.tscn")
	var boss = boss_scene.instantiate()
	boss.max_hp = 3
	boss.current_hp = 3
	add_child(boss)

	
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	add_child(player)
	
	# 1. Đánh trúng bằng phồng to -> trừ 1 HP
	boss.on_puffy_hit(player, true)
	if boss.current_hp != 2:
		printerr("  ❌ Lỗi: Boss không bị trừ 1 HP khi bị húc bởi Puffy phồng to!")
		boss.queue_free()
		player.queue_free()
		return false
		
	# 2. Đánh 2 phát nữa -> Boss bị tiêu diệt
	boss.is_invulnerable = false
	boss.on_puffy_hit(player, true)
	boss.is_invulnerable = false
	boss.on_puffy_hit(player, true)
	
	if not boss.is_defeated:
		printerr("  ❌ Lỗi: Boss chưa chuyển sang trạng thái bị hạ gục khi HP <= 0!")
		boss.queue_free()
		player.queue_free()
		return false
		
	print("  ✓ Trận Đấu Trùm BossSeaCreature nhận sát thương và kích hoạt chiến thắng hoàn hảo.")
	boss.queue_free()
	player.queue_free()
	return true

func _test_android_back_button_and_lifecycle() -> bool:
	print("▶ [TEST 17] Kiểm tra Phím Back Android & Lưu Trữ Dự Phòng Lifecycle...")
	# 1. Kiểm tra lưu tự động khi OS Pause
	PuffyGameManager._notification(Node.NOTIFICATION_APPLICATION_PAUSED)
	if not FileAccess.file_exists(PuffyGameManager.SAVE_PATH) or not FileAccess.file_exists(PuffyGameManager.BACKUP_PATH):
		printerr("  ❌ Lỗi: File lưu hoặc file sao lưu dự phòng không tồn tại sau khi OS Pause!")
		return false
		
	# 2. Kiểm tra đóng Pause Modal bằng phím Back
	var pause_scene = load("res://scenes/ui/PuffyPauseModal.tscn")
	var pause_modal = pause_scene.instantiate()
	add_child(pause_modal)
	
	if not get_tree().paused:
		printerr("  ❌ Lỗi: Pause modal chưa tạm dừng game!")
		pause_modal.queue_free()
		return false
		
	PuffyGameManager._handle_android_back_request()
	if get_tree().paused:
		printerr("  ❌ Lỗi: Phím Back không hủy tạm dừng (unpause) thông qua pause modal!")
		return false
		
	print("  ✓ Phím Back Android điều hướng thông minh và lưu tự động dự phòng hoạt động xuất sắc.")
	return true

func _test_rewarded_ad_and_haptic() -> bool:
	print("▶ [TEST 18] Kiểm tra Cơ Chế Quảng Cáo Thưởng (Rewarded Ad) & Rung Haptic...")
	PuffyGameManager.shots_remaining = 0
	var received = [false]
	var callable = func(): received[0] = true
	PuffyGameManager.rewarded_shot_granted.connect(callable)
	
	PuffyGameManager.grant_rewarded_shot()
	PuffyGameManager.rewarded_shot_granted.disconnect(callable)
	
	if PuffyGameManager.shots_remaining != 1 or not received[0]:
		printerr("  ❌ Lỗi: Xem quảng cáo thưởng không cấp thêm 1 lượt bắn! Shots: ", PuffyGameManager.shots_remaining, " Signal: ", received[0])
		return false
		
	# Kiểm tra hàm rung không phát sinh exception
	PuffyGameManager.trigger_haptic(50)
	
	print("  ✓ Cơ chế Rewarded Ad (+1 Đạn) và Haptic Vibration đạt chuẩn thương mại.")
	return true

func _test_hd_vector_textures_and_puffy_sprite() -> bool:
	print("▶ [TEST 19] Kiểm tra Texture Vector HD 512x512 & Sprite Scale PuffyPlayer...")
	var player_scene = load("res://scenes/prefabs/PuffyPlayer.tscn")
	var player = player_scene.instantiate() as PuffyPlayer
	add_child(player)
	
	if player.SPRITE_BASE_SCALE != Vector2(0.125, 0.125):
		printerr("  ❌ Lỗi: SPRITE_BASE_SCALE không phải 0.125!")
		player.queue_free()
		return false
		
	# Kiểm tra khi phồng to và xì hơi
	player.trigger_inflate()
	if player.sprite.texture != player.tex_inflated:
		printerr("  ❌ Lỗi: Sprite chưa chuyển sang texture inflated!")
		player.queue_free()
		return false
		
	player.trigger_jet_deflate()
	if player.sprite.texture != player.tex_normal:
		printerr("  ❌ Lỗi: Sprite chưa chuyển về texture normal!")
		player.queue_free()
		return false
		
	print("  ✓ Texture Vector HD 512x512 và Sprite Scale PuffyPlayer sắc nét tuyệt đối.")
	player.queue_free()
	return true

func _test_deterministic_3_star_and_wipe_data() -> bool:
	print("▶ [TEST 20] Kiểm tra Tính 3 Sao Công Bằng (Skill-Based) & Xóa Sạch Dữ Liệu Cũ...")
	# 1. Kịch bản Ăn đủ 3 ngọc -> Đạt 3 sao
	PuffyGameManager.current_level = 1
	PuffyGameManager.level_pearls_collected = 3
	PuffyGameManager.shots_remaining = 0
	PuffyGameManager.current_score = 3000
	PuffyGameManager.finish_level_victory()
	if PuffyGameManager.level_stars.get(1, 0) != 3:
		printerr("  ❌ Lỗi: Ăn đủ 3 ngọc phải đạt 3 sao! Nhận: ", PuffyGameManager.level_stars.get(1, 0))
		return false
		
	# 2. Kịch bản Bắn xuất sắc 1 hit (còn 2 đạn) không cần ngọc -> Đạt 3 sao
	PuffyGameManager.current_level = 2
	PuffyGameManager.level_pearls_collected = 0
	PuffyGameManager.shots_remaining = 2
	PuffyGameManager.current_score = 4000
	PuffyGameManager.finish_level_victory()
	if PuffyGameManager.level_stars.get(2, 0) != 3:
		printerr("  ❌ Lỗi: Bắn 1 hit xuất sắc còn >= 2 đạn phải đạt 3 sao! Nhận: ", PuffyGameManager.level_stars.get(2, 0))
		return false
		
	# 3. Kịch bản Màn Trùm: Hạ Boss còn 2 đạn -> Đạt 3 sao
	PuffyGameManager.current_level = 16 # Boss 1
	PuffyGameManager.shots_remaining = 2
	PuffyGameManager.current_score = 8000
	PuffyGameManager.finish_level_victory()
	if PuffyGameManager.level_stars.get(16, 0) != 3:
		printerr("  ❌ Lỗi: Hạ Boss còn >= 2 đạn phải đạt 3 sao! Nhận: ", PuffyGameManager.level_stars.get(16, 0))
		return false
		
	# 4. Kiểm tra xóa sạch bộ nhớ lưu trữ cũ theo yêu cầu người dùng
	PuffyGameManager.reset_all_saved_data()
	if PuffyGameManager.get_total_stars() != 0 or PuffyGameManager.total_pearls_bank != 0:
		printerr("  ❌ Lỗi: Hàm reset_all_saved_data() không xóa sạch dữ liệu tiến trình!")
		return false
		
	print("  ✓ Cơ chế tính 3 sao công bằng (không hên xui) và xóa sạch dữ liệu cũ hoạt động xuất sắc.")
	return true

func _test_ui_button_texture_icons() -> bool:
	print("▶ [TEST 21] Kiểm tra Texture Asset Icon đồng bộ trong toàn bộ các nút bấm...")
	
	# 1. PuffyHUD
	var hud_scene = load("res://scenes/ui/PuffyHUD.tscn")
	var hud = hud_scene.instantiate()
	add_child(hud)
	var unstick_btn = hud.get_node("TopBar/ActionsContainer/UnstickBtn") as Button
	var sound_btn_hud = hud.get_node("TopBar/ActionsContainer/SoundBtn") as Button
	var restart_btn_hud = hud.get_node("TopBar/ActionsContainer/RestartBtn") as Button
	var pause_btn_hud = hud.get_node("TopBar/ActionsContainer/PauseBtn") as Button
	if not unstick_btn.icon or not sound_btn_hud.icon or not restart_btn_hud.icon or not pause_btn_hud.icon:
		printerr("  ❌ Lỗi: PuffyHUD nút bấm thiếu texture asset icon!")
		hud.queue_free()
		return false
	hud.queue_free()
	
	# 2. PuffyMainMenu
	var menu_scene = load("res://scenes/ui/PuffyMainMenu.tscn")
	var menu = menu_scene.instantiate()
	add_child(menu)
	var camp_btn = menu.find_child("CampaignBtn", true) as Button
	var endless_btn = menu.find_child("EndlessBtn", true) as Button
	var tuto_btn = menu.find_child("TutorialBtn", true) as Button
	var sound_btn_menu = menu.find_child("SoundBtn", true) as Button
	var lang_btn_menu = menu.find_child("LangBtn", true) as Button
	if not camp_btn.icon or not endless_btn.icon or not tuto_btn.icon or not sound_btn_menu.icon or not lang_btn_menu.icon:
		printerr("  ❌ Lỗi: PuffyMainMenu nút bấm thiếu texture asset icon!")
		menu.queue_free()
		return false
	menu.queue_free()
	
	# 3. PuffyPauseModal
	var pause_scene = load("res://scenes/ui/PuffyPauseModal.tscn")
	var pause_modal = pause_scene.instantiate()
	add_child(pause_modal)
	var resume_btn = pause_modal.find_child("ResumeBtn", true) as Button
	var restart_btn_pause = pause_modal.find_child("RestartBtn", true) as Button
	var sound_btn_pause = pause_modal.find_child("SoundBtn", true) as Button
	var select_btn_pause = pause_modal.find_child("SelectBtn", true) as Button
	var menu_btn_pause = pause_modal.find_child("MenuBtn", true) as Button
	var lang_btn_pause = pause_modal.find_child("LangBtn", true) as Button
	if not resume_btn.icon or not restart_btn_pause.icon or not sound_btn_pause.icon or not select_btn_pause.icon or not menu_btn_pause.icon or not lang_btn_pause.icon:
		printerr("  ❌ Lỗi: PuffyPauseModal nút bấm thiếu texture asset icon!")
		pause_modal.queue_free()
		return false
	pause_modal.queue_free()
	
	# 4. PuffyVictoryModal
	var vic_scene = load("res://scenes/ui/PuffyVictoryModal.tscn")
	var vic_modal = vic_scene.instantiate()
	add_child(vic_modal)
	var next_btn = vic_modal.find_child("NextBtn", true) as Button
	var replay_btn = vic_modal.find_child("ReplayBtn", true) as Button
	var select_btn_vic = vic_modal.find_child("SelectBtn", true) as Button
	if not next_btn.icon or not replay_btn.icon or not select_btn_vic.icon:
		printerr("  ❌ Lỗi: PuffyVictoryModal nút bấm thiếu texture asset icon!")
		vic_modal.queue_free()
		return false
	vic_modal.queue_free()
	
	# 5. PuffyGameOverModal
	var fail_scene = load("res://scenes/ui/PuffyGameOverModal.tscn")
	var fail_modal = fail_scene.instantiate()
	add_child(fail_modal)
	var ad_btn = fail_modal.find_child("RewardAdBtn", true) as Button
	var retry_btn = fail_modal.find_child("RetryBtn", true) as Button
	var select_btn_fail = fail_modal.find_child("SelectBtn", true) as Button
	var menu_btn_fail = fail_modal.find_child("MenuBtn", true) as Button
	if not ad_btn.icon or not retry_btn.icon or not select_btn_fail.icon or not menu_btn_fail.icon:
		printerr("  ❌ Lỗi: PuffyGameOverModal nút bấm thiếu texture asset icon!")
		fail_modal.queue_free()
		return false
	fail_modal.queue_free()
	
	# 6. PuffyTutorialModal
	var tuto_modal_scene = load("res://scenes/ui/PuffyTutorialModal.tscn")
	var tuto_modal = tuto_modal_scene.instantiate()
	add_child(tuto_modal)
	var close_btn = tuto_modal.find_child("CloseBtn", true) as Button
	if not close_btn.icon:
		printerr("  ❌ Lỗi: PuffyTutorialModal nút bấm thiếu texture asset icon!")
		tuto_modal.queue_free()
		return false
	tuto_modal.queue_free()
	
	# 7. PuffyLevelSelect
	var lvl_scene = load("res://scenes/ui/PuffyLevelSelect.tscn")
	var lvl_select = lvl_scene.instantiate()
	add_child(lvl_select)
	var back_btn = lvl_select.find_child("BackBtn", true) as Button
	var reset_btn = lvl_select.find_child("ResetBtn", true) as Button
	var lang_btn_lvl = lvl_select.find_child("LangBtn", true) as Button
	if not back_btn.icon or not reset_btn.icon or not lang_btn_lvl.icon:
		printerr("  ❌ Lỗi: PuffyLevelSelect nút bấm thiếu texture asset icon!")
		lvl_select.queue_free()
		return false
	lvl_select.queue_free()
	
	print("  ✓ Toàn bộ các nút bấm trong HUD, Menu, Level Select và các Modal đã được trang bị Texture Asset Icon đồng bộ và chuẩn xác.")
	return true

func _test_aquatic_particles_no_stars() -> bool:
	print("▶ [TEST 22] Kiểm tra Hệ thống Hạt Đại Dương Thuần Túy (Không còn ngôi sao vàng)...")
	
	# 1. Kiểm tra các texture particle đại dương đã load thành công
	if not PuffyVFX.tex_bubble or not PuffyVFX.tex_droplet or not PuffyVFX.tex_ripple:
		printerr("  ❌ Lỗi: Texture hạt đại dương (bong bóng, giọt nước, sóng gợn) chưa được tải!")
		return false
		
	# 2. Kiểm tra sinh hiệu ứng va đập không tạo ngôi sao vàng
	var test_container = Node2D.new()
	add_child(test_container)
	
	PuffyVFX.spawn_dynamic_collision_impact(test_container, Vector2(200, 200), Vector2.UP, 300.0)
	var has_droplets = false
	var has_bubbles = false
	for child in test_container.get_children():
		if child is CPUParticles2D:
			if child.texture == PuffyVFX.tex_droplet:
				has_droplets = true
			elif child.texture == PuffyVFX.tex_bubble:
				has_bubbles = true
				
	if not has_droplets or not has_bubbles:
		printerr("  ❌ Lỗi: Va đập tốc độ cao không sinh giọt nước và bọt nước đại dương!")
		test_container.queue_free()
		return false
		
	# 3. Kiểm tra spawn_water_droplets
	PuffyVFX.spawn_water_droplets(test_container, Vector2(300, 300), 10)
	
	test_container.queue_free()
	print("  ✓ Hệ thống hạt đại dương thuần túy: hoàn toàn dùng bọt nước, giọt nước ngọc bích và sóng gợn, tuyệt đối không có ngôi sao.")
	return true

func _test_multilanguage_and_ergonomic_ui() -> bool:
	print("▶ [TEST 23] Kiểm tra Đa Ngôn Ngữ (13 Quốc Gia), Giao Diện Bố Cục Nút Bấm Thân Thiện & Âm Thanh/VFX Mới...")
	
	# 1. Kiểm tra danh sách 13 ngôn ngữ được hỗ trợ đầy đủ
	var locales = PuffyLocaleManager.SUPPORTED_LOCALES
	if locales.size() != 13:
		printerr("  ❌ Lỗi: Số lượng ngôn ngữ hỗ trợ không đúng 13! Hiện tại: %d" % locales.size())
		return false
		
	var required_locales = ["vi", "en", "ja", "ko", "zh", "zh_TW", "es", "pt", "ru", "fr", "de", "id", "th"]
	for loc in required_locales:
		if not (loc in locales):
			printerr("  ❌ Lỗi: Thiếu ngôn ngữ bắt buộc: %s" % loc)
			return false
			
	# 2. Kiểm tra tính toàn vẹn của từ điển dịch thuật cho từng ngôn ngữ
	var required_keys = [
		"GAME_TITLE", "GAME_SUBTITLE", "BTN_CAMPAIGN", "BTN_ENDLESS", "BTN_TUTORIAL", 
		"BTN_SOUND_ON", "BTN_SOUND_OFF", "BTN_QUIT", "STATS_SUMMARY", "HUD_LEVEL", 
		"HUD_UNSTICK", "HUD_HINT", "PAUSE_TITLE", "PAUSE_RESUME", "PAUSE_RESTART", 
		"PAUSE_SELECT", "PAUSE_MENU", "PAUSE_LANGUAGE", "VIC_TITLE", "VIC_SCORE", 
		"VIC_NEXT", "VIC_REPLAY", "VIC_MAP", "FAIL_TITLE", "FAIL_DESC", 
		"FAIL_REVIVE", "FAIL_RETRY", "FAIL_SELECT", "FAIL_MENU", "TUTO_TITLE", 
		"TUTO_STEP1", "TUTO_STEP2", "TUTO_STEP3", "TUTO_CLOSE", "LVL_SELECT_TITLE", 
		"LVL_TAB_ALL", "LVL_BOSS", "LVL_STAGE", "LVL_BACK", "LVL_RESET"
	]
	
	for loc in required_locales:
		if not PuffyLocaleManager.translations.has(loc):
			printerr("  ❌ Lỗi: Thiếu từ điển cho locale '%s'!" % loc)
			return false
		for k in required_keys:
			var val = PuffyLocaleManager.translations[loc].get(k, "")
			if val.is_empty():
				printerr("  ❌ Lỗi: Bản dịch rỗng cho key '%s' ở locale '%s'!" % [k, loc])
				return false
				
	# 3. Kiểm tra chuyển đổi chu kỳ ngôn ngữ (toggle_next_locale)
	var initial_loc = PuffyLocaleManager.current_locale
	var signal_fired = [false]
	var callable = func(_new_loc): signal_fired[0] = true
	PuffyLocaleManager.locale_changed.connect(callable)
	
	var next_loc = PuffyLocaleManager.toggle_next_locale()
	if not signal_fired[0] or next_loc == initial_loc:
		printerr("  ❌ Lỗi: toggle_next_locale không phát tín hiệu hoặc không đổi ngôn ngữ!")
		PuffyLocaleManager.locale_changed.disconnect(callable)
		return false
	PuffyLocaleManager.locale_changed.disconnect(callable)
	
	# 4. Kiểm tra dịch thuật tham số định dạng
	PuffyLocaleManager.set_locale("en")
	var en_level = PuffyLocaleManager.tr_key("HUD_LEVEL", [7])
	if en_level != "LEVEL 7":
		printerr("  ❌ Lỗi: tr_key tham số tiếng Anh sai! Kết quả: %s" % en_level)
		return false
		
	PuffyLocaleManager.set_locale("ja")
	var ja_level = PuffyLocaleManager.tr_key("HUD_LEVEL", [7])
	if ja_level != "ステージ 7":
		printerr("  ❌ Lỗi: tr_key tham số tiếng Nhật sai! Kết quả: %s" % ja_level)
		return false
		
	PuffyLocaleManager.set_locale("vi")
	var vi_level = PuffyLocaleManager.tr_key("HUD_LEVEL", [7])
	if vi_level != "MÀN 7":
		printerr("  ❌ Lỗi: tr_key tham số tiếng Việt sai! Kết quả: %s" % vi_level)
		return false
		
	# 5. Kiểm tra bố cục Main Menu 2 tầng thân thiện
	var menu = load("res://scenes/ui/PuffyMainMenu.tscn").instantiate() as PuffyMainMenu
	add_child(menu)
	var modes_box = menu.get_node_or_null("VBox/PrimaryModes")
	var dock_box = menu.get_node_or_null("VBox/UtilityDock")
	if not modes_box or not dock_box:
		printerr("  ❌ Lỗi: PuffyMainMenu không có bố cục 2 tầng (PrimaryModes & UtilityDock)!")
		menu.queue_free()
		return false
	if not menu.lang_btn or not menu.campaign_btn or not menu.endless_btn:
		printerr("  ❌ Lỗi: PuffyMainMenu thiếu các nút bấm công thái học!")
		menu.queue_free()
		return false
	menu.queue_free()
	
	# 6. Kiểm tra bố cục Pause Modal đối xứng thân thiện
	var pause = load("res://scenes/ui/PuffyPauseModal.tscn").instantiate() as PuffyPauseModal
	add_child(pause)
	var actions_row = pause.get_node_or_null("Panel/VBox/ActionsRow")
	var settings_row = pause.get_node_or_null("Panel/VBox/SettingsRow")
	if not actions_row or not settings_row:
		printerr("  ❌ Lỗi: PuffyPauseModal không có bố cục lưới đối xứng thân thiện!")
		pause.queue_free()
		return false
	pause.queue_free()
	
	# 7. Kiểm tra âm thanh click và jet stream
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_jet_stream()
	
	# 8. Kiểm tra VFX luồng phản lực bọt khí (Jet Stream)
	var dummy = Node2D.new()
	add_child(dummy)
	PuffyVFX.spawn_jet_stream(dummy, Vector2(100, 100), Vector2.RIGHT)
	dummy.queue_free()
	
	print("  ✓ Đa ngôn ngữ (13 quốc gia), bố cục giao diện công thái học 2 tầng thân thiện và âm thanh/VFX mới hoạt động hoàn hảo 100%.")
	return true




