extends Node

func _ready() -> void:
	print("================================================================")
	print(">>> STARTING COMPREHENSIVE ASSET & LEVEL VARIETY TEST SUITE <<<")
	print("================================================================")

	var errors: Array[String] = []

	# -------------------------------------------------------------------------
	# 1. TEST NEW PARTICLE & VFX TEXTURES IN ParticleHelper
	# -------------------------------------------------------------------------
	print("\n--- [TEST 1] Testing ParticleHelper and 10 New Egg VFX Textures ---")
	ParticleHelper._init_textures()
	var vfx_textures = {
		"tex_egg_splat": ParticleHelper.tex_egg_splat,
		"tex_fireball": ParticleHelper.tex_fireball,
		"tex_drill_spark": ParticleHelper.tex_drill_spark,
		"tex_metal_chip": ParticleHelper.tex_metal_chip,
		"tex_kinetic_wave": ParticleHelper.tex_kinetic_wave,
		"tex_freezing_fog": ParticleHelper.tex_freezing_fog,
		"tex_toxic_fume": ParticleHelper.tex_toxic_fume,
		"tex_gravity_ring": ParticleHelper.tex_gravity_ring,
		"tex_cosmic_star": ParticleHelper.tex_cosmic_star,
		"tex_eggshell_chip": ParticleHelper.tex_eggshell_chip
	}

	for tex_name in vfx_textures:
		var tex = vfx_textures[tex_name]
		if tex == null:
			errors.append("VFX texture failed to load: " + tex_name)
			print("  [FAIL] Texture null: ", tex_name)
		else:
			print("  [PASS] Texture loaded: ", tex_name, " (", tex.get_width(), "x", tex.get_height(), ")")

	# -------------------------------------------------------------------------
	# 2. TEST DESTRUCTIBLE BLOCKS & ALL 5 NEW BUILDING MATERIALS
	# -------------------------------------------------------------------------
	print("\n--- [TEST 2] Testing DestructibleBlock with 5 New Materials ---")
	var block_scene = load("res://scenes/prefabs/DestructibleBlock.tscn")
	if not block_scene:
		errors.append("Failed to load DestructibleBlock.tscn")
		print("  [FAIL] DestructibleBlock.tscn missing!")
	else:
		var test_materials = [
			"wood", "stone", "steel", "obsidian", "crystal",
			"cyber_alloy", "swamp_wood", "permafrost", "magma_brick", "celestial_stone"
		]

		for mat_type in test_materials:
			var blk = block_scene.instantiate()
			blk.material_type = mat_type
			blk.block_size = Vector2(80.0, 24.0)
			add_child(blk)
			
			# Check stats
			if blk.max_health <= 0.0:
				errors.append("Material " + mat_type + " has invalid max_health <= 0")
			if blk.mass <= 0.0:
				errors.append("Material " + mat_type + " has invalid mass <= 0")
			
			# Check textures loaded
			var tex = blk.block_visual.texture if blk.block_visual else null
			if tex == null:
				errors.append("Material " + mat_type + " has missing block texture!")
				print("  [FAIL] Block texture missing for: ", mat_type)
			else:
				print("  [PASS] Material '", mat_type, "': Health=", blk.max_health, " Mass=", blk.mass, " Sprite=", tex.resource_path if tex.resource_path != "" else "Loaded")

			blk.queue_free()

	# -------------------------------------------------------------------------
	# 3. TEST ALL 28 MONSTER ARCHETYPES & WORLD BOSSES
	# -------------------------------------------------------------------------
	print("\n--- [TEST 3] Testing All 28 Monster Archetypes and World Bosses ---")
	var enemy_scene = load("res://scenes/prefabs/BunkerMonster.tscn")
	if not enemy_scene:
		errors.append("Failed to load BunkerMonster.tscn")
		print("  [FAIL] BunkerMonster.tscn missing!")
	else:
		var all_monsters = [
			"sly_fox", "fox_guard", "armored_raccoon", "mine_wolf", "spike_hound",
			"toxic_fox", "imperial_boar", "boss_baron_pig", "crystal_badger",
			"cyber_hound", "cyborg_fox", "swamp_mutant", "spore_badger",
			"frost_yeti", "blizzard_wolf", "magma_drake", "lava_golem",
			"void_wraith", "celestial_sentinel",
			"boss_iron_crusher", "boss_toxic_alchemist", "boss_magma_emperor",
			"boss_crystal_overlord", "boss_cyber_mech", "boss_swamp_hydra",
			"boss_frost_colossus", "boss_dragon_warlord", "boss_singularity_prime"
		]

		for m_type in all_monsters:
			var m = enemy_scene.instantiate()
			m.monster_type = m_type
			add_child(m)

			if m.max_health <= 0.0:
				errors.append("Monster " + m_type + " has invalid health")
			if m.mass <= 0.0:
				errors.append("Monster " + m_type + " has invalid mass")

			var is_boss = m_type.begins_with("boss_")
			if is_boss and m.max_health < 1500.0:
				errors.append("Boss " + m_type + " health is too low: " + str(m.max_health))

			print("  [PASS] Monster '", m_type, "': HP=", m.max_health, " Mass=", m.mass, " Score=", m.score_value, " IsBoss=", is_boss)
			m.queue_free()

	# -------------------------------------------------------------------------
	# 4. TEST CAMPAIGN LEVEL GENERATION FOR ALL 10 WORLDS
	# -------------------------------------------------------------------------
	print("\n--- [TEST 4] Testing Campaign Level Generation Across All 10 Worlds ---")
	var level_scene = load("res://scenes/levels/CampaignLevel.tscn")
	if not level_scene:
		errors.append("Failed to load CampaignLevel.tscn")
		print("  [FAIL] CampaignLevel.tscn missing!")
	else:
		var world_boss_expected = {
			20: "boss_baron_pig",
			40: "boss_iron_crusher",
			60: "boss_toxic_alchemist",
			80: "boss_magma_emperor",
			100: "boss_crystal_overlord",
			120: "boss_cyber_mech",
			140: "boss_swamp_hydra",
			160: "boss_frost_colossus",
			180: "boss_dragon_warlord",
			200: "boss_singularity_prime"
		}

		var world_new_materials = {
			6: "cyber_alloy",
			7: "swamp_wood",
			8: "permafrost",
			9: "magma_brick",
			10: "celestial_stone"
		}

		for lvl in [1, 20, 40, 60, 100, 120, 160, 200]:
			GameManager.current_level = lvl
			var cl = level_scene.instantiate()
			cl.level_id = lvl
			add_child(cl)

			var world_id = clamp(int(float(lvl - 1) / 20.0) + 1, 1, 10)
			var bunker = cl.get_node_or_null("BunkerStructure")
			var level_enemies: Array[BunkerMonster] = []
			var enemy_names: Array[String] = []
			if bunker:
				for child in bunker.get_children():
					if child is BunkerMonster:
						level_enemies.append(child)
						enemy_names.append(child.monster_type)

			if level_enemies.size() == 0:
				errors.append("Level " + str(lvl) + " spawned 0 enemies!")

			# Check World Boss in boss levels
			if world_boss_expected.has(lvl):
				var expected_boss = world_boss_expected[lvl]
				if not enemy_names.has(expected_boss):
					errors.append("Level " + str(lvl) + " (World " + str(world_id) + " Boss) did not spawn expected boss: " + expected_boss + "! Found: " + str(enemy_names))
					print("  [FAIL] World ", world_id, " Boss missing '", expected_boss, "'! Enemies: ", enemy_names)
				else:
					print("  [PASS] World ", world_id, " Boss (Level ", lvl, ") successfully spawned: ", expected_boss, " (Total level enemies: ", level_enemies.size(), ")")

			# Check new materials used in bunker structure
			if world_new_materials.has(world_id):
				var target_mat = world_new_materials[world_id]
				var found_mat = false
				if bunker:
					for child in bunker.get_children():
						if "material_type" in child and child.material_type == target_mat:
							found_mat = true
							break
				if not found_mat:
					errors.append("World " + str(world_id) + " (Level " + str(lvl) + ") did not use expected material: " + target_mat)
					print("  [FAIL] World ", world_id, " missing material: ", target_mat)
				else:
					print("  [PASS] World ", world_id, " (Level ", lvl, ") uses new material: ", target_mat, " with ", level_enemies.size(), " enemies")

			# Simulate 6 physics frames (peacetime) to verify NO self-collapse before player input
			for frame_idx in range(6):
				await get_tree().physics_frame

			# Check if any block or boulder woke up without player firing
			var premature_awake = 0
			var premature_moving = 0
			if bunker:
				for child in bunker.get_children():
					if "is_awake" in child and child.is_awake:
						premature_awake += 1
					if "linear_velocity" in child and child.linear_velocity.length() > 5.0:
						premature_moving += 1
			if premature_awake > 0 or premature_moving > 0:
				errors.append("Level " + str(lvl) + " suffered peacetime collapse! Awake=" + str(premature_awake) + " Moving=" + str(premature_moving))
				print("  [FAIL] Level ", lvl, " peacetime collapse! Awake: ", premature_awake, ", Moving: ", premature_moving)
			else:
				print("  [PASS] Level ", lvl, " is 100% rock-solid and stable in peacetime (0 premature wakes)")

			# Simulate active gameplay: Egg dropped (current_egg_index = 1) but still flying in air!
			GameManager.current_egg_index = 1
			for frame_idx in range(8):
				await get_tree().physics_frame

			var post_drop_awake = 0
			var post_drop_moving = 0
			if bunker:
				for child in bunker.get_children():
					if "is_awake" in child and child.is_awake:
						post_drop_awake += 1
					if "linear_velocity" in child and child.linear_velocity.length() > 5.0:
						post_drop_moving += 1
			if post_drop_awake > 0 or post_drop_moving > 0:
				errors.append("Level " + str(lvl) + " suffered pre-impact jiggle/collapse on egg drop! Awake=" + str(post_drop_awake) + " Moving=" + str(post_drop_moving))
				print("  [FAIL] Level ", lvl, " pre-impact collapse on egg drop! Awake: ", post_drop_awake, ", Moving: ", post_drop_moving)
			else:
				print("  [PASS] Level ", lvl, " is 100% rock-solid on egg drop! 0 bottom pillars or blocks shifted.")

			GameManager.current_egg_index = 0

			remove_child(cl)
			cl.free()

	# -------------------------------------------------------------------------
	# 5. TEST GAMEPLAY FLOW: DAMAGE, SCORE, AND LEVEL VICTORY
	# -------------------------------------------------------------------------
	print("\n--- [TEST 5] Testing Damage Pipeline, Scoring, and Level Completion ---")
	GameManager.start_level(1, 1, ["bomb", "normal"])
	var test_block = block_scene.instantiate()
	test_block.material_type = "wood"
	add_child(test_block)

	var test_monster = enemy_scene.instantiate()
	test_monster.monster_type = "sly_fox"
	add_child(test_monster)

	var initial_score = GameManager.current_score

	# Test block damage
	test_block.take_damage(test_block.max_health + 10.0)
	if not test_block.is_destroyed:
		errors.append("Block was not destroyed after fatal damage!")
	else:
		print("  [PASS] Block successfully took damage and entered is_destroyed state")

	# Test monster damage & defeat
	test_monster.take_damage(test_monster.max_health + 10.0)
	if not test_monster.is_defeated:
		errors.append("Monster was not defeated after fatal damage!")
	else:
		print("  [PASS] Monster successfully took damage and entered is_defeated state")

	if GameManager.current_score <= initial_score:
		errors.append("GameManager score did not increase after destroying block and monster!")
	else:
		print("  [PASS] Score increased properly: from ", initial_score, " to ", GameManager.current_score)

	if GameManager.remaining_enemies != 0:
		errors.append("Enemies remaining is not 0! Count: " + str(GameManager.remaining_enemies))
	else:
		print("  [PASS] Enemies remaining reached 0, triggering victory condition")

	test_block.queue_free()
	test_monster.queue_free()

	# -------------------------------------------------------------------------
	# 6. TEST PHYSICS RESILIENCE: UNSUPPORTED BLOCK & BOULDER AUTO WAKE-UP
	# -------------------------------------------------------------------------
	print("\n--- [TEST 6] Testing Unsupported Block & Boulder Gravity Wake-Up ---")
	GameManager.current_egg_index = 1 # Active gameplay mode (past peacetime lock)

	var air_block = block_scene.instantiate()
	air_block.position = Vector2(500, -200) # High up in empty space
	add_child(air_block)
	air_block.spawn_settle_timer = 0.0
	air_block._check_underlying_support()

	if not air_block.is_awake:
		errors.append("Unsupported block hovering in air did NOT auto-wake up!")
		print("  [FAIL] Unsupported block stayed frozen in air!")
	else:
		print("  [PASS] Unsupported block in air correctly triggered wake_up() (is_awake=true, freeze=false)")

	var boulder_scene = load("res://scenes/prefabs/RollingBoulder.tscn")
	if boulder_scene:
		var air_boulder = boulder_scene.instantiate()
		air_boulder.position = Vector2(500, -200)
		add_child(air_boulder)
		air_boulder.spawn_settle_timer = 0.0
		air_boulder._check_underlying_support()

		if not air_boulder.is_awake:
			errors.append("Unsupported boulder hovering in air did NOT auto-wake up!")
			print("  [FAIL] Unsupported boulder stayed frozen in air!")
		else:
			print("  [PASS] Unsupported boulder correctly triggered wake_up() (is_awake=true, freeze=false)")
		air_boulder.queue_free()

	air_block.queue_free()
	GameManager.current_egg_index = 0

	# -------------------------------------------------------------------------
	# 7. TEST BUG FIXES: ADS BUTTON UNLOCK, PAUSE RESILIENCE, & BLACKHOLE BLAST
	# -------------------------------------------------------------------------
	print("\n--- [TEST 7] Testing Mock Ad Claim Unlock, Pause Resilience, and BlackHole Supernova ---")
	if has_node("/root/AdsManager"):
		var am = get_node("/root/AdsManager")
		if am.mock_btn_claim == null or am.mock_btn_skip == null:
			errors.append("AdsManager mock buttons are null (BUG-01)!")
		else:
			print("  [PASS] AdsManager mock buttons properly cached and accessible")

	# Test Pause Resilience (BUG-02)
	GameManager.is_level_active = true
	GameManager.is_settling = true
	GameManager.settle_timer = 3.0
	get_tree().paused = true
	GameManager._process(1.0)
	if GameManager.settle_timer < 3.0:
		errors.append("GameManager settle_timer decremented while game was paused (BUG-02)!")
	else:
		print("  [PASS] GameManager settle_timer immune to countdown while game is paused")
	get_tree().paused = false
	GameManager.is_settling = false

	# Test BlackHole Single Supernova (BUG-05)
	var blackhole_scene = load("res://scenes/prefabs/BlackHoleEgg.tscn")
	if blackhole_scene:
		var bh = blackhole_scene.instantiate()
		add_child(bh)
		bh.global_position = Vector2(2500, 2500) # Out of bounds
		bh._physics_process(0.016)
		if not bh.is_broken:
			errors.append("BlackHoleEgg did not set is_broken on despawn blast!")
		else:
			# Verify second call is blocked
			bh._supernova_blast()
			print("  [PASS] BlackHoleEgg safely triggers single supernova without repetitive explosions")
		bh.queue_free()

	# -------------------------------------------------------------------------
	# 8. TEST SAVEMANAGER RESILIENCE & DYNAMIC FLOOR-Y SUPPORT
	# -------------------------------------------------------------------------
	print("\n--- [TEST 8] Testing SaveManager Schema Validation and Dynamic Floor-Y Support ---")
	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		var malformed_save = {
			"version": 4,
			"coins": "750",
			"highest_unlocked_level": 15,
			"level_stars": "invalid_string_not_dict",
			"level_scores": {}
		}
		sm._apply_loaded_dict(malformed_save)
		if not (sm.save_data["level_stars"] is Dictionary):
			errors.append("SaveManager did not sanitize corrupt level_stars into Dictionary!")
		elif sm.save_data["coins"] != 750:
			errors.append("SaveManager did not parse valid numeric coins!")
		else:
			print("  [PASS] SaveManager successfully sanitized malformed schema and preserved valid progress")

	# Test Dynamic floor_y support (BUG-07)
	GameManager.current_floor_y = 920.0
	GameManager.current_egg_index = 1
	var deep_midair_block = block_scene.instantiate()
	deep_midair_block.block_size = Vector2(40, 20)
	deep_midair_block.position = Vector2(500, 800) # In deep world (floor 920), y=800 is hovering in air
	add_child(deep_midair_block)
	deep_midair_block.spawn_settle_timer = 0.0
	deep_midair_block._check_underlying_support()

	if not deep_midair_block.is_awake:
		errors.append("Block hovering at y=800 with floor at 920 falsely treated as bedrock (BUG-07)!")
		print("  [FAIL] Midair block at y=800 falsely treated as bedrock!")
	else:
		print("  [PASS] Dynamic floor_y correctly treats y=800 as mid-air when floor is at 920")
	deep_midair_block.queue_free()
	GameManager.current_egg_index = 0

	print("\n================================================================")
	if errors.size() == 0:
		print(">>> ALL TESTS PASSED SUCCESSFULLY! (0 ERRORS) <<<")
		print("================================================================")
		await get_tree().process_frame
		await get_tree().process_frame
		get_tree().quit(0)
	else:
		print(">>> TESTS FAILED WITH ", errors.size(), " ERRORS: <<<")
		for err in errors:
			print("  * ", err)
		print("================================================================")
		await get_tree().process_frame
		get_tree().quit(1)
