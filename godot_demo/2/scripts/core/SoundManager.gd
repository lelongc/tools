extends Node

# ==============================================================================
# SOUND MANAGER - Studio-Grade Cartoon Audio System for Godot 4
# ==============================================================================

var sfx_players: Array[AudioStreamPlayer] = []
var bgm_player: AudioStreamPlayer = null
const POOL_SIZE = 16

var wav_cache: Dictionary = {}
var is_bgm_active: bool = true
var _sfx_rr_index: int = 0

var fanfare_player: AudioStreamPlayer = null
var ui_player: AudioStreamPlayer = null

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

	# 1. Khởi tạo BGM Player riêng biệt
	bgm_player = AudioStreamPlayer.new()
	bgm_player.name = "BGMPlayer"
	bgm_player.bus = "BGM" if AudioServer.get_bus_index("BGM") != -1 else "Master"
	bgm_player.volume_db = -8.0 # Âm lượng êm ái làm nền cho SFX
	add_child(bgm_player)
	bgm_player.finished.connect(_on_bgm_finished)

	# 1b. Khởi tạo Fanfare Player & UI Player ưu tiên độc lập (P2-11)
	fanfare_player = AudioStreamPlayer.new()
	fanfare_player.name = "FanfarePlayer"
	fanfare_player.bus = "SFX" if AudioServer.get_bus_index("SFX") != -1 else "Master"
	add_child(fanfare_player)

	ui_player = AudioStreamPlayer.new()
	ui_player.name = "UIPlayer"
	ui_player.bus = "SFX" if AudioServer.get_bus_index("SFX") != -1 else "Master"
	add_child(ui_player)

	# 2. Khởi tạo Pool SFX Players cho đa âm thanh đồng thời
	for i in range(POOL_SIZE):
		var p = AudioStreamPlayer.new()
		p.name = "SFXPlayer_%d" % i
		p.bus = "SFX" if AudioServer.get_bus_index("SFX") != -1 else "Master"
		add_child(p)
		sfx_players.append(p)

	# 3. Nạp sẵn 24 tệp âm thanh WAV hoạt hình chuẩn phòng thu
	_load_all_sound_assets()

	# 4. Tự động kết nối các sự kiện toàn cục từ GameManager
	if is_inside_tree() and has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		gm.egg_dropped.connect(func(_type): play_egg_drop())
		gm.enemy_defeated.connect(func(_enemy, _pts): play_enemy_squash())
		# Khử âm thanh fanfare trước tiếng chuông sao theo yêu cầu người dùng
		gm.level_failed.connect(func(): play_level_fail())

	# 5. Khởi động nhạc nền hoạt hình
	play_bgm()

func _notification(what: int) -> void:
	match what:
		NOTIFICATION_APPLICATION_PAUSED, NOTIFICATION_APPLICATION_FOCUS_OUT:
			if bgm_player and bgm_player.playing:
				bgm_player.stream_paused = true
			for p in sfx_players:
				if is_instance_valid(p) and p.playing:
					p.stream_paused = true
		NOTIFICATION_APPLICATION_RESUMED, NOTIFICATION_APPLICATION_FOCUS_IN:
			if bgm_player and bgm_player.stream_paused:
				bgm_player.stream_paused = false
			for p in sfx_players:
				if is_instance_valid(p) and p.stream_paused:
					p.stream_paused = false

func _load_all_sound_assets() -> void:
	if not wav_cache.is_empty(): return
	var sound_map = {
		"chicken_cluck": "res://assets/audio/chicken_cluck.wav",
		"egg_crack": "res://assets/audio/egg_crack.wav",
		"egg_bounce": "res://assets/audio/egg_bounce.wav",
		"explosion_cartoon": "res://assets/audio/explosion_cartoon.wav",
		"wood_break": "res://assets/audio/wood_break.wav",
		"stone_break": "res://assets/audio/stone_break.wav",
		"glass_break": "res://assets/audio/glass_break.wav",
		"steel_clang": "res://assets/audio/steel_clang.wav",
		"crystal_shatter": "res://assets/audio/crystal_shatter.wav",
		"obsidian_crack": "res://assets/audio/obsidian_crack.wav",
		"monster_ouch": "res://assets/audio/monster_ouch.wav",
		"monster_defeat": "res://assets/audio/monster_defeat.wav",
		"drill_engine": "res://assets/audio/drill_engine.wav",
		"frost_freeze": "res://assets/audio/frost_freeze.wav",
		"acid_sizzle": "res://assets/audio/acid_sizzle.wav",
		"blackhole_vortex": "res://assets/audio/blackhole_vortex.wav",
		"chick_chirp": "res://assets/audio/chick_chirp.wav",
		"button_click": "res://assets/audio/button_click.wav",
		"wheel_tick": "res://assets/audio/wheel_tick.wav",
		"star_chime": "res://assets/audio/star_chime.wav",
		"victory_fanfare": "res://assets/audio/victory_fanfare.wav",
		"level_fail": "res://assets/audio/level_fail.wav",
		"coin_pickup": "res://assets/audio/coin_pickup.wav",
		"cartoon_bunker_bgm": "res://assets/audio/cartoon_bunker_bgm.wav"
	}

	for key in sound_map:
		var path = sound_map[key]
		if ResourceLoader.exists(path):
			var stream = load(path)
			if stream:
				wav_cache[key] = stream

func _get_available_player() -> AudioStreamPlayer:
	for p in sfx_players:
		if is_instance_valid(p) and not p.playing:
			return p
	if not sfx_players.is_empty():
		_sfx_rr_index = (_sfx_rr_index + 1) % sfx_players.size()
		var p = sfx_players[_sfx_rr_index]
		if is_instance_valid(p):
			return p
	var fallback = AudioStreamPlayer.new()
	fallback.name = "SFXPlayer_fallback"
	fallback.bus = "SFX" if AudioServer.get_bus_index("SFX") != -1 else "Master"
	add_child(fallback)
	sfx_players.append(fallback)
	return fallback

func is_sound_enabled() -> bool:
	if is_inside_tree() and has_node("/root/SaveManager"):
		return get_node("/root/SaveManager").save_data.get("sound_enabled", true)
	return true

# ==============================================================================
# NHẠC NỀN HOẠT HÌNH (BACKGROUND MUSIC)
# ==============================================================================

func play_bgm() -> void:
	if not is_inside_tree(): return
	if not bgm_player: return
	is_bgm_active = true
	if not is_sound_enabled(): return

	if wav_cache.has("cartoon_bunker_bgm"):
		var stream = wav_cache["cartoon_bunker_bgm"]
		if "loop_mode" in stream:
			stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
		bgm_player.stream = stream
		if not bgm_player.playing:
			bgm_player.play()

func stop_bgm() -> void:
	is_bgm_active = false
	if bgm_player and bgm_player.playing:
		bgm_player.stop()

func _on_bgm_finished() -> void:
	if is_bgm_active and is_sound_enabled() and bgm_player:
		bgm_player.play()

# ==============================================================================
# HIỆU ỨNG ÂM THANH HOẠT HÌNH (CARTOON SFX)
# ==============================================================================

func play_sfx(key: String, vol_db: float = 0.0, pitch_min: float = 0.94, pitch_max: float = 1.06) -> void:
	if not is_inside_tree(): return
	if not is_sound_enabled(): return
	if not wav_cache.has(key): return

	var stream = wav_cache[key]
	var p = _get_available_player()
	p.stream = stream
	p.volume_db = vol_db
	p.pitch_scale = randf_range(pitch_min, pitch_max)
	p.play()

# 1. GÀ ĐẺ TRỨNG & VẬT LÝ VỎ TRỨNG
func play_egg_drop() -> void:
	play_sfx("chicken_cluck", 1.5, 0.95, 1.05)

func play_egg_bounce() -> void:
	if not can_play_sfx("egg_bounce", 0.06): return
	play_sfx("egg_bounce", 0.0, 0.92, 1.08)

func play_egg_crack() -> void:
	if not can_play_sfx("egg_crack", 0.06): return
	play_sfx("egg_crack", 1.8, 0.95, 1.05)

# 2. BOM & VỤ NỔ COMIC PUNCHY
func play_explosion() -> void:
	if not can_play_sfx("explosion_cartoon", 0.08): return
	play_sfx("explosion_cartoon", 3.5, 0.92, 1.06)

# 3. PHÁ HỦY CÔNG TRÌNH VẬT LIỆU
func play_wood_break() -> void:
	if not can_play_sfx("wood_break", 0.05): return
	play_sfx("wood_break", 1.2, 0.93, 1.07)

func play_stone_break() -> void:
	if not can_play_sfx("stone_break", 0.05): return
	play_sfx("stone_break", 2.2, 0.92, 1.06)

func play_glass_break() -> void:
	if not can_play_sfx("glass_break", 0.05): return
	play_sfx("glass_break", 0.8, 0.94, 1.06)

func play_steel_clang() -> void:
	if not can_play_sfx("steel_clang", 0.05): return
	play_sfx("steel_clang", 1.8, 0.95, 1.05)

func play_crystal_shatter() -> void:
	if not can_play_sfx("crystal_shatter", 0.05): return
	play_sfx("crystal_shatter", 1.8, 0.95, 1.05)

func play_obsidian_crack() -> void:
	if not can_play_sfx("obsidian_crack", 0.05): return
	play_sfx("obsidian_crack", 2.5, 0.94, 1.06)

var sfx_cooldowns: Dictionary = {}

func can_play_sfx(key: String, min_interval: float = 0.08) -> bool:
	var now = Time.get_ticks_msec() / 1000.0
	if sfx_cooldowns.has(key) and (now - sfx_cooldowns[key]) < min_interval:
		return false
	sfx_cooldowns[key] = now
	return true

# 4. QUÁI VẬT BỊ ĐÁNH & TIÊU DIỆT
func play_monster_ouch() -> void:
	if not can_play_sfx("monster_ouch", 0.08): return
	play_sfx("monster_ouch", 1.2, 0.92, 1.08)

func play_enemy_squash() -> void:
	if not can_play_sfx("monster_defeat", 0.10): return
	play_sfx("monster_defeat", 2.5, 0.93, 1.07)

# 5. KỸ NĂNG CỦA 7 LOẠI ĐẠN TRỨNG
func play_drill_boost() -> void:
	play_sfx("drill_engine", 1.8, 0.95, 1.05)

func play_frost_freeze() -> void:
	play_sfx("frost_freeze", 1.5, 0.95, 1.05)

func play_acid_sizzle() -> void:
	play_sfx("acid_sizzle", 0.8, 0.95, 1.05)

func play_blackhole_vortex() -> void:
	play_sfx("blackhole_vortex", 2.5, 0.95, 1.05)

func play_chick_chirp() -> void:
	if not can_play_sfx("chick_chirp", 0.06): return
	play_sfx("chick_chirp", 0.5, 0.92, 1.10)

# 6. GIAO DIỆN & TƯƠNG TÁC
func play_button_click() -> void:
	play_sfx("button_click", 0.5, 0.96, 1.04)

func play_wheel_tick() -> void:
	play_sfx("wheel_tick", -1.0, 0.95, 1.05)

func play_star_chime(star_index: int = 1) -> void:
	if not is_inside_tree(): return
	if not is_sound_enabled(): return
	if not wav_cache.has("star_chime"): return
	var p = ui_player if is_instance_valid(ui_player) else _get_available_player()
	p.stream = wav_cache["star_chime"]
	p.volume_db = 1.8
	p.pitch_scale = 1.0 + float(star_index - 1) * 0.22 # C6 -> E6 -> G6
	p.play()

func play_victory() -> void:
	if not can_play_sfx("victory_fanfare", 1.5): return
	if not is_sound_enabled(): return
	# Dừng các âm va chạm, vụn vỡ để khúc khải hoàn vang lên trọn vẹn, không bị đè âm
	for p in sfx_players:
		if is_instance_valid(p) and p.playing:
			p.stop()
	if is_instance_valid(fanfare_player) and wav_cache.has("victory_fanfare"):
		fanfare_player.stream = wav_cache["victory_fanfare"]
		fanfare_player.volume_db = 3.0
		fanfare_player.pitch_scale = 1.0
		fanfare_player.play()
	else:
		play_sfx("victory_fanfare", 3.0, 1.0, 1.0)

func play_level_fail() -> void:
	if not can_play_sfx("level_fail", 1.5): return
	if not is_sound_enabled(): return
	for p in sfx_players:
		if is_instance_valid(p) and p.playing:
			p.stop()
	if is_instance_valid(fanfare_player) and wav_cache.has("level_fail"):
		fanfare_player.stream = wav_cache["level_fail"]
		fanfare_player.volume_db = 2.5
		fanfare_player.pitch_scale = 1.0
		fanfare_player.play()
	else:
		play_sfx("level_fail", 2.5, 1.0, 1.0)

func play_coin_pickup() -> void:
	if not is_sound_enabled(): return
	if is_instance_valid(ui_player) and wav_cache.has("coin_pickup"):
		ui_player.stream = wav_cache["coin_pickup"]
		ui_player.volume_db = 1.5
		ui_player.pitch_scale = randf_range(0.96, 1.04)
		ui_player.play()
	else:
		play_sfx("coin_pickup", 1.5, 0.96, 1.04)

# ==============================================================================
# BACKWARDS COMPATIBILITY ROUTER (Giữ tương thích tuyệt đối cho code cũ)
# ==============================================================================
var sound_cache: Dictionary = {}

func play_synth_tone(freq_or_type = 440.0, duration: float = 0.12, type: String = "sine", vol_db: float = 0.0) -> void:
	if not is_inside_tree(): return
	if not is_sound_enabled(): return

	# Tự động định tuyến các âm thanh gọi synth cũ sang âm thanh WAV chất lượng cao mới
	if typeof(freq_or_type) == TYPE_STRING:
		match freq_or_type:
			"pop": play_button_click(); return
			"boom": play_explosion(); return
			"noise": play_wood_break(); return
			"laser": play_egg_drop(); return

	if type == "pop" and freq_or_type > 400.0:
		play_button_click()
		return
	elif type == "boom":
		play_explosion()
		return

	# Bộ tổng hợp dự phòng (Fallback Synthesizer)
	var freq: float = 440.0
	if typeof(freq_or_type) in [TYPE_FLOAT, TYPE_INT]:
		freq = float(freq_or_type)

	var cache_key = "%s_%.1f_%.2f" % [type, freq, duration]
	var stream: AudioStreamWAV = null

	if sound_cache.has(cache_key):
		stream = sound_cache[cache_key]
	else:
		var sample_hz = 22050
		var total_samples = int(sample_hz * duration)
		var data = PackedByteArray()
		data.resize(total_samples)

		for i in range(total_samples):
			var t = float(i) / float(sample_hz)
			var progress = float(i) / float(total_samples)
			var env = 1.0 - progress
			var val = sin(TAU * freq * t)
			var sample_byte = int(clamp((val * env * 0.8 + 1.0) * 127.5, 0, 255))
			data[i] = sample_byte

		stream = AudioStreamWAV.new()
		stream.format = AudioStreamWAV.FORMAT_8_BITS
		stream.mix_rate = sample_hz
		stream.data = data
		sound_cache[cache_key] = stream

	var p = _get_available_player()
	p.stream = stream
	p.volume_db = vol_db
	p.pitch_scale = randf_range(0.92, 1.08)
	p.play()

func stop_all() -> void:
	if bgm_player:
		bgm_player.stop()
		bgm_player.stream = null
	if fanfare_player:
		fanfare_player.stop()
		fanfare_player.stream = null
	if ui_player:
		ui_player.stop()
		ui_player.stream = null
	for p in sfx_players:
		if p:
			p.stop()
			p.stream = null

