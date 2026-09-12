extends Node

var sfx_players: Array[AudioStreamPlayer] = []
var max_players: int = 12
var current_player_idx: int = 0

var sound_cache: Dictionary = {}
var sfx_last_time: Dictionary = {} # Lưu msec phát gần nhất để debounce chống rè
var sample_rate: int = 22050
var is_muted: bool = false

# Nhạc nền BGM chill chill
var bgm_player: AudioStreamPlayer = null
var bgm_stream: AudioStreamWAV = null
var is_bgm_muted: bool = false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_create_player_pool()
	_pregenerate_sounds()
	_setup_chill_bgm()

func _create_player_pool() -> void:
	for i in range(max_players):
		var p = AudioStreamPlayer.new()
		p.bus = "Master"
		add_child(p)
		sfx_players.append(p)

	# BGM player riêng biệt
	bgm_player = AudioStreamPlayer.new()
	bgm_player.bus = "Master"
	add_child(bgm_player)

func _play_named(sfx_name: String, stream: AudioStreamWAV, volume_db: float = 0.0, pitch: float = 1.0, min_interval: float = 0.08) -> void:
	if is_muted or not stream:
		return
		
	var now = Time.get_ticks_msec()
	var last = sfx_last_time.get(sfx_name, 0)
	if (now - last) < int(min_interval * 1000.0):
		return # Bỏ qua để chống dồn dập, chồng âm gây rè khi kẹt vật lý
	sfx_last_time[sfx_name] = now
	
	var p = sfx_players[current_player_idx]
	current_player_idx = (current_player_idx + 1) % max_players
	p.stream = stream
	p.volume_db = volume_db - 3.0 # Giảm nhẹ để có headroom âm thanh không bị clipping
	p.pitch_scale = pitch
	p.play()

func _pregenerate_sounds() -> void:
	sound_cache["stretch"] = _synth_stretch(0.08)
	sound_cache["launch"] = _synth_whoosh(0.12)
	sound_cache["inflate"] = _synth_fwoomp(0.18)
	sound_cache["deflate"] = _synth_pfffrt(0.22)
	sound_cache["boing"] = _synth_boing(0.22)
	sound_cache["pearl"] = _synth_pearl(0.14)
	sound_cache["bonk"] = _synth_bonk(0.10)
	sound_cache["victory"] = _synth_fanfare(0.4)
	sound_cache["fail"] = _synth_fail(0.35)
	
	# Âm thanh các vật thể mới
	sound_cache["jellyfish"] = _synth_jellyfish(0.28)
	sound_cache["coral_break"] = _synth_coral_break(0.16)
	sound_cache["speed_current"] = _synth_speed_current(0.25)
	sound_cache["urchin"] = _synth_urchin(0.15)
	sound_cache["explosion"] = _synth_explosion(0.35)
	sound_cache["portal"] = _synth_portal(0.28)
	sound_cache["boss_hit"] = _synth_boss_hit(0.22)
	sound_cache["boss_defeat"] = _synth_boss_defeat(0.65)
	sound_cache["powerup"] = _synth_powerup(0.32)
	sound_cache["ui_click"] = _synth_ui_click(0.05)
	sound_cache["jet_stream"] = _synth_jet_stream(0.32)

func play_stretch() -> void:
	_play_named("stretch", sound_cache.get("stretch"), -4.0, randf_range(0.9, 1.1), 0.06)

func play_launch() -> void:
	_play_named("launch", sound_cache.get("launch"), 0.0, randf_range(0.95, 1.05), 0.1)

func play_inflate() -> void:
	_play_named("inflate", sound_cache.get("inflate"), 1.0, randf_range(0.95, 1.05), 0.15)

func play_deflate() -> void:
	_play_named("deflate", sound_cache.get("deflate"), 0.0, randf_range(0.95, 1.08), 0.15)

func play_boing() -> void:
	# Cooldown 80ms ngăn cản triệt để hiện tượng va chạm kẹt kêu rè rè
	_play_named("boing", sound_cache.get("boing"), -1.0, randf_range(0.92, 1.12), 0.08)

func play_pearl() -> void:
	_play_named("pearl", sound_cache.get("pearl"), -2.0, randf_range(1.0, 1.25), 0.05)

func play_bonk() -> void:
	_play_named("bonk", sound_cache.get("bonk"), -1.5, randf_range(0.88, 1.08), 0.08)

func play_victory() -> void:
	_play_named("victory", sound_cache.get("victory"), 2.0, 1.0, 0.5)

func play_fail() -> void:
	_play_named("fail", sound_cache.get("fail"), 1.0, 1.0, 0.5)

func play_jellyfish() -> void:
	_play_named("jellyfish", sound_cache.get("jellyfish"), 0.0, randf_range(0.95, 1.15), 0.1)

func play_coral_break() -> void:
	_play_named("coral_break", sound_cache.get("coral_break"), 1.0, randf_range(0.9, 1.1), 0.06)

func play_speed_current() -> void:
	_play_named("speed_current", sound_cache.get("speed_current"), 0.5, randf_range(0.95, 1.1), 0.15)

func play_urchin() -> void:
	_play_named("urchin", sound_cache.get("urchin"), 0.5, randf_range(0.9, 1.1), 0.1)

func play_explosion() -> void:
	_play_named("explosion", sound_cache.get("explosion"), 2.0, randf_range(0.9, 1.1), 0.1)

func play_portal() -> void:
	_play_named("portal", sound_cache.get("portal"), 0.5, randf_range(0.95, 1.15), 0.12)

func play_boss_hit() -> void:
	_play_named("boss_hit", sound_cache.get("boss_hit"), 2.5, randf_range(0.85, 1.05), 0.1)

func play_boss_defeat() -> void:
	_play_named("boss_defeat", sound_cache.get("boss_defeat"), 3.0, 1.0, 0.4)

func play_powerup() -> void:
	_play_named("powerup", sound_cache.get("powerup"), 1.0, randf_range(0.98, 1.08), 0.15)

func play_ui_click() -> void:
	_play_named("ui_click", sound_cache.get("ui_click"), 0.0, randf_range(0.96, 1.04), 0.04)

func play_jet_stream() -> void:
	_play_named("jet_stream", sound_cache.get("jet_stream"), 1.0, randf_range(0.95, 1.05), 0.15)

# --- HỆ THỐNG NHẠC NỀN ĐẠI DƯƠNG CHILL CHILL (OCEAN LOFI BGM) ---

func _setup_chill_bgm() -> void:
	bgm_stream = _synth_chill_ocean_bgm(12.0)
	bgm_player.stream = bgm_stream
	bgm_player.volume_db = -11.0 # Âm lượng dịu nhẹ, thư giãn
	if not is_bgm_muted:
		bgm_player.play()

func toggle_bgm() -> void:
	is_bgm_muted = not is_bgm_muted
	if is_bgm_muted:
		bgm_player.stop()
	else:
		bgm_player.play()

func set_bgm_volume(vol_db: float) -> void:
	bgm_player.volume_db = vol_db

func _synth_chill_ocean_bgm(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	
	# Chu kỳ 4 hợp âm lofi biển: Cmaj7 -> Am7 -> Fmaj7 -> G7
	# Mỗi hợp âm kéo dài 3 giây
	var chord_roots = [
		[261.63, 329.63, 392.00, 493.88], # C4, E4, G4, B4 (Cmaj7)
		[220.00, 261.63, 329.63, 392.00], # A3, C4, E4, G4 (Am7)
		[174.61, 220.00, 261.63, 329.63], # F3, A3, C4, E4 (Fmaj7)
		[196.00, 246.94, 293.66, 349.23]  # G3, B3, D4, F4 (G7)
	]
	
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var chord_idx = int(t / 3.0) % 4
		var chord_time = fmod(t, 3.0)
		var chord = chord_roots[chord_idx]
		
		# Kalimba / Marimba ngọc bích nước: rải hợp âm 4 nốt arpeggio
		var note_sub_idx = int(chord_time / 0.75) % 4
		var note_time = fmod(chord_time, 0.75)
		var freq = chord[note_sub_idx]
		
		# Sóng Sine ấm mượt mà với decay êm dịu
		var note_env = exp(-note_time * 4.2)
		var kalimba_tone = sin(2.0 * PI * freq * t) * 0.7 + sin(4.0 * PI * freq * t) * 0.25
		var kalimba_val = kalimba_tone * note_env
		
		# Sóng nền đệm Pad trầm ấm (Sine mượt mà)
		var pad_val = (sin(2.0 * PI * chord[0] * 0.5 * t) + sin(2.0 * PI * chord[1] * 0.5 * t)) * 0.18
		
		# Tiếng sóng biển rì rào dịu nhẹ (Filtered Ocean Breeze)
		var ocean_noise = randf_range(-0.06, 0.06) * (0.5 + 0.5 * sin(t * 0.8))
		
		var sample_mix = (kalimba_val * 0.55 + pad_val * 0.35 + ocean_noise * 0.1)
		
		# Làm dịu điểm nối ở đầu và cuối để lặp mượt mà không bị giật
		var crossfade_samples = int(sample_rate * 0.1)
		if i < crossfade_samples:
			sample_mix *= float(i) / float(crossfade_samples)
		elif i > total - crossfade_samples:
			sample_mix *= float(total - i) / float(crossfade_samples)
			
		var s16 = int(clamp(sample_mix * 18000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
		
	var wav = AudioStreamWAV.new()
	wav.format = AudioStreamWAV.FORMAT_16_BITS
	wav.mix_rate = sample_rate
	wav.stereo = false
	wav.loop_mode = AudioStreamWAV.LOOP_FORWARD
	wav.loop_begin = 0
	wav.loop_end = total
	wav.data = bytes
	return wav

# --- SÓNG ÂM HOẠT HÌNH THỦ TỤC (PROCEDURAL SYNTHESIZERS) ---

func _apply_envelope(raw_bytes: PackedByteArray, attack_samples: int, decay_samples: int) -> void:
	var total_samples = raw_bytes.size() / 2
	for i in range(attack_samples):
		if i < total_samples:
			var s16 = raw_bytes.decode_s16(i * 2)
			var factor = float(i) / float(attack_samples)
			raw_bytes.encode_s16(i * 2, int(s16 * factor))
	for i in range(decay_samples):
		var idx = total_samples - 1 - i
		if idx >= 0:
			var s16 = raw_bytes.decode_s16(idx * 2)
			var factor = float(i) / float(decay_samples)
			raw_bytes.encode_s16(idx * 2, int(s16 * factor))

func _synth_fwoomp(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(80.0, 300.0, sin(prog * PI))
		var env = sin(prog * PI)
		var val = sin(2.0 * PI * freq * t) * env
		var s16 = int(clamp(val * 20000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 40, 60)
	return _build_wav(bytes)

func _synth_pfffrt(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(200.0, 60.0, prog)
		var square = 1.0 if sin(2.0 * PI * freq * t) > 0 else -1.0
		var noise = randf_range(-0.35, 0.35)
		var env = (1.0 - prog)
		var val = (square * 0.55 + noise) * env
		var s16 = int(clamp(val * 18000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 40, 60)
	return _build_wav(bytes)

func _synth_boing(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(180.0, 460.0, pow(prog, 0.45))
		var env = exp(-prog * 4.5)
		var val = sin(2.0 * PI * freq * t) * env
		var s16 = int(clamp(val * 20000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 30, 60)
	return _build_wav(bytes)

func _synth_pearl(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = 1318.5
		var env = exp(-prog * 7.5)
		var val = (sin(2.0 * PI * freq * t) + 0.3 * sin(4.0 * PI * freq * t)) * env
		var s16 = int(clamp(val * 18000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 20, 50)
	return _build_wav(bytes)

func _synth_bonk(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(320.0, 110.0, prog)
		var env = exp(-prog * 8.0)
		var val = (sin(2.0 * PI * freq * t) + randf_range(-0.15, 0.15)) * env
		var s16 = int(clamp(val * 20000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 30, 50)
	return _build_wav(bytes)

func _synth_stretch(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(180.0, 520.0, prog)
		var val = sin(2.0 * PI * freq * t) * (0.8 + 0.2 * randf())
		var s16 = int(clamp(val * 14000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 30, 50)
	return _build_wav(bytes)

func _synth_whoosh(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var prog = float(i) / float(total)
		var env = sin(prog * PI)
		var val = randf_range(-0.7, 0.7) * env
		var s16 = int(clamp(val * 16000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 40, 50)
	return _build_wav(bytes)

func _synth_jellyfish(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		# Âm thanh nảy bồng bềnh êm ái
		var freq = lerp(350.0, 680.0, sin(prog * PI))
		var env = exp(-prog * 3.5)
		var val = sin(2.0 * PI * freq * t) * env
		var s16 = int(clamp(val * 18000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 30, 60)
	return _build_wav(bytes)

func _synth_coral_break(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		# Âm thanh đá vỡ giòn tan: noise + xung lực thấp
		var crack = randf_range(-0.8, 0.8) * exp(-prog * 12.0)
		var thud = sin(2.0 * PI * 90.0 * t) * exp(-prog * 6.0)
		var val = crack * 0.7 + thud * 0.3
		var s16 = int(clamp(val * 22000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 10, 40)
	return _build_wav(bytes)

func _synth_speed_current(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(200.0, 750.0, prog)
		var env = sin(prog * PI)
		var val = (sin(2.0 * PI * freq * t) * 0.6 + randf_range(-0.3, 0.3)) * env
		var s16 = int(clamp(val * 17000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 40, 50)
	return _build_wav(bytes)

func _synth_urchin(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(800.0, 250.0, prog)
		var env = exp(-prog * 10.0)
		var val = sin(2.0 * PI * freq * t) * env
		var s16 = int(clamp(val * 20000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 20, 40)
	return _build_wav(bytes)

func _synth_fanfare(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var note_idx = int(prog * 4.0)
		var freqs = [523.25, 659.25, 783.99, 1046.5]
		var freq = freqs[clamp(note_idx, 0, 3)]
		var env = 1.0 - (prog * 4.0 - float(note_idx))
		var val = sin(2.0 * PI * freq * t) * env
		var s16 = int(clamp(val * 20000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 30, 60)
	return _build_wav(bytes)

func _synth_fail(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(420.0, 160.0, prog)
		var env = 1.0 - prog
		var val = sin(2.0 * PI * freq * t) * env
		var s16 = int(clamp(val * 20000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 30, 60)
	return _build_wav(bytes)

func _synth_explosion(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var boom = sin(2.0 * PI * lerp(90.0, 30.0, prog) * t) * exp(-prog * 4.0)
		var noise = randf_range(-0.8, 0.8) * exp(-prog * 8.0)
		var val = boom * 0.65 + noise * 0.35
		var s16 = int(clamp(val * 24000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 15, 60)
	return _build_wav(bytes)

func _synth_portal(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(550.0, 1150.0, sin(prog * PI))
		var val = sin(2.0 * PI * freq * t) * sin(prog * PI)
		var s16 = int(clamp(val * 18000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 30, 40)
	return _build_wav(bytes)

func _synth_boss_hit(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(260.0, 70.0, prog)
		var val = (sin(2.0 * PI * freq * t) * 0.7 + randf_range(-0.3, 0.3)) * exp(-prog * 7.0)
		var s16 = int(clamp(val * 22000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 10, 40)
	return _build_wav(bytes)

func _synth_boss_defeat(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	var chords = [523.25, 659.25, 783.99, 1046.50, 1318.5]
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var chord_idx = clamp(int(prog * 5.0), 0, 4)
		var f = chords[chord_idx]
		var env = 1.0 - (prog * 5.0 - float(chord_idx)) * 0.85
		var val = (sin(2.0 * PI * f * t) + 0.4 * sin(4.0 * PI * f * t)) * env * 0.5
		var s16 = int(clamp(val * 21000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 20, 60)
	return _build_wav(bytes)

func _synth_powerup(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	var notes = [440.0, 554.37, 659.25, 880.0, 1108.7]
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var note_idx = clamp(int(prog * 5.0), 0, 4)
		var f = notes[note_idx]
		var env = sin((prog * 5.0 - float(note_idx)) * PI)
		var val = sin(2.0 * PI * f * t) * env
		var s16 = int(clamp(val * 19000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 20, 40)
	return _build_wav(bytes)

func _synth_ui_click(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var freq = lerp(950.0, 480.0, prog)
		var val = sin(2.0 * PI * freq * t) * (1.0 - prog) * (1.0 - prog)
		var s16 = int(clamp(val * 24000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 10, 30)
	return _build_wav(bytes)

func _synth_jet_stream(duration: float) -> AudioStreamWAV:
	var total = int(sample_rate * duration)
	var bytes = PackedByteArray()
	bytes.resize(total * 2)
	for i in range(total):
		var t = float(i) / float(sample_rate)
		var prog = float(i) / float(total)
		var noise = randf_range(-0.55, 0.55)
		var f1 = lerp(380.0, 180.0, prog)
		var wave = sin(2.0 * PI * f1 * t) * 0.4
		var env = sin(prog * PI) * (1.0 - prog * 0.5)
		var val = (noise * 0.6 + wave) * env
		var s16 = int(clamp(val * 22000.0, -32767.0, 32767.0))
		bytes.encode_s16(i * 2, s16)
	_apply_envelope(bytes, 25, 60)
	return _build_wav(bytes)

func _build_wav(data: PackedByteArray) -> AudioStreamWAV:
	var wav = AudioStreamWAV.new()
	wav.format = AudioStreamWAV.FORMAT_16_BITS
	wav.mix_rate = sample_rate
	wav.stereo = false
	wav.data = data
	return wav
