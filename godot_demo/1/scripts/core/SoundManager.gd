extends Node

# Bộ tổng hợp âm thanh thủ tục (Procedural Sound Synthesizer)
# Tự động tạo sóng âm PCM 16-bit trực tiếp trong bộ nhớ, không phụ thuộc file ngoài

var sfx_players: Array[AudioStreamPlayer] = []
var max_players: int = 12
var current_player_idx: int = 0

var sound_cache: Dictionary = {}
var sample_rate: int = 22050

var is_sfx_muted: bool = false
var is_music_muted: bool = false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_create_player_pool()
	_pregenerate_sounds()

func _create_player_pool() -> void:
	for i in range(max_players):
		var player = AudioStreamPlayer.new()
		player.bus = "Master"
		add_child(player)
		sfx_players.append(player)

func _play_stream(stream: AudioStreamWAV, volume_db: float = 0.0, pitch_scale: float = 1.0) -> void:
	if is_sfx_muted or not stream:
		return
	var p = sfx_players[current_player_idx]
	current_player_idx = (current_player_idx + 1) % max_players
	p.stream = stream
	p.volume_db = volume_db
	p.pitch_scale = pitch_scale
	p.play()

func _pregenerate_sounds() -> void:
	sound_cache["snap"] = _synth_click(1200.0, 400.0, 0.04)
	sound_cache["slash"] = _synth_slash(0.12)
	sound_cache["shoot"] = _synth_twang(440.0, 180.0, 0.09)
	sound_cache["lightning"] = _synth_buzz(320.0, 0.15)
	sound_cache["explosion"] = _synth_boom(75.0, 0.25)
	sound_cache["shard"] = _synth_tone(880.0, 0.08)
	sound_cache["dash"] = _synth_dash(0.14)
	sound_cache["hit"] = _synth_thud(160.0, 0.06)
	sound_cache["buy"] = _synth_tone(1046.5, 0.1)

# Các hàm gọi tiện ích toàn cục
func play_snap() -> void:
	_play_stream(sound_cache.get("snap"), -2.0, randf_range(0.95, 1.05))

func play_slash() -> void:
	_play_stream(sound_cache.get("slash"), 0.0, randf_range(0.9, 1.1))

func play_shoot() -> void:
	_play_stream(sound_cache.get("shoot"), -1.0, randf_range(0.95, 1.05))

func play_lightning() -> void:
	_play_stream(sound_cache.get("lightning"), 0.0, randf_range(0.9, 1.1))

func play_explosion() -> void:
	_play_stream(sound_cache.get("explosion"), 2.0, randf_range(0.85, 1.0))

func play_shard() -> void:
	_play_stream(sound_cache.get("shard"), -3.0, randf_range(1.0, 1.3))

func play_dash() -> void:
	_play_stream(sound_cache.get("dash"), -2.0, randf_range(0.9, 1.1))

func play_hit() -> void:
	_play_stream(sound_cache.get("hit"), 1.0, randf_range(0.9, 1.1))

func play_buy() -> void:
	_play_stream(sound_cache.get("buy"), 0.0, 1.2)

# --- THUẬT TOÁN TỔNG HỢP SÓNG ÂM (WAVE SYNTHESIZERS) ---

func _synth_click(start_freq: float, end_freq: float, duration: float) -> AudioStreamWAV:
	var total_samples = int(sample_rate * duration)
	var byte_array = PackedByteArray()
	byte_array.resize(total_samples * 2)
	for i in range(total_samples):
		var t = float(i) / float(sample_rate)
		var progress = float(i) / float(total_samples)
		var freq = lerp(start_freq, end_freq, progress)
		var env = (1.0 - progress)
		var val = sin(2.0 * PI * freq * t) * env
		var sample_16 = int(clamp(val * 24000.0, -32767.0, 32767.0))
		byte_array.encode_s16(i * 2, sample_16)
	return _build_wav(byte_array)

func _synth_slash(duration: float) -> AudioStreamWAV:
	var total_samples = int(sample_rate * duration)
	var byte_array = PackedByteArray()
	byte_array.resize(total_samples * 2)
	for i in range(total_samples):
		var progress = float(i) / float(total_samples)
		var env = sin(progress * PI)
		# Filtered white noise with sine modulation
		var noise = randf_range(-1.0, 1.0)
		var val = noise * env
		var sample_16 = int(clamp(val * 22000.0, -32767.0, 32767.0))
		byte_array.encode_s16(i * 2, sample_16)
	return _build_wav(byte_array)

func _synth_twang(start_freq: float, end_freq: float, duration: float) -> AudioStreamWAV:
	var total_samples = int(sample_rate * duration)
	var byte_array = PackedByteArray()
	byte_array.resize(total_samples * 2)
	for i in range(total_samples):
		var t = float(i) / float(sample_rate)
		var progress = float(i) / float(total_samples)
		var freq = lerp(start_freq, end_freq, progress)
		var env = exp(-progress * 5.0)
		var val = sin(2.0 * PI * freq * t) * env
		var sample_16 = int(clamp(val * 26000.0, -32767.0, 32767.0))
		byte_array.encode_s16(i * 2, sample_16)
	return _build_wav(byte_array)

func _synth_buzz(freq: float, duration: float) -> AudioStreamWAV:
	var total_samples = int(sample_rate * duration)
	var byte_array = PackedByteArray()
	byte_array.resize(total_samples * 2)
	for i in range(total_samples):
		var t = float(i) / float(sample_rate)
		var progress = float(i) / float(total_samples)
		var env = (1.0 - progress)
		# Square wave combined with noise
		var square = 1.0 if sin(2.0 * PI * freq * t) > 0 else -1.0
		var noise = randf_range(-0.3, 0.3)
		var val = (square * 0.7 + noise) * env
		var sample_16 = int(clamp(val * 20000.0, -32767.0, 32767.0))
		byte_array.encode_s16(i * 2, sample_16)
	return _build_wav(byte_array)

func _synth_boom(freq: float, duration: float) -> AudioStreamWAV:
	var total_samples = int(sample_rate * duration)
	var byte_array = PackedByteArray()
	byte_array.resize(total_samples * 2)
	for i in range(total_samples):
		var t = float(i) / float(sample_rate)
		var progress = float(i) / float(total_samples)
		var current_freq = max(freq * (1.0 - progress * 0.7), 20.0)
		var env = exp(-progress * 4.0)
		var val = sin(2.0 * PI * current_freq * t) * env + randf_range(-0.15, 0.15) * env
		var sample_16 = int(clamp(val * 28000.0, -32767.0, 32767.0))
		byte_array.encode_s16(i * 2, sample_16)
	return _build_wav(byte_array)

func _synth_thud(freq: float, duration: float) -> AudioStreamWAV:
	var total_samples = int(sample_rate * duration)
	var byte_array = PackedByteArray()
	byte_array.resize(total_samples * 2)
	for i in range(total_samples):
		var t = float(i) / float(sample_rate)
		var progress = float(i) / float(total_samples)
		var env = (1.0 - progress) * (1.0 - progress)
		var val = sin(2.0 * PI * freq * t) * env
		var sample_16 = int(clamp(val * 26000.0, -32767.0, 32767.0))
		byte_array.encode_s16(i * 2, sample_16)
	return _build_wav(byte_array)

func _synth_tone(freq: float, duration: float) -> AudioStreamWAV:
	var total_samples = int(sample_rate * duration)
	var byte_array = PackedByteArray()
	byte_array.resize(total_samples * 2)
	for i in range(total_samples):
		var t = float(i) / float(sample_rate)
		var progress = float(i) / float(total_samples)
		var env = 1.0 - progress
		var val = sin(2.0 * PI * freq * t) * env
		var sample_16 = int(clamp(val * 20000.0, -32767.0, 32767.0))
		byte_array.encode_s16(i * 2, sample_16)
	return _build_wav(byte_array)

func _synth_dash(duration: float) -> AudioStreamWAV:
	var total_samples = int(sample_rate * duration)
	var byte_array = PackedByteArray()
	byte_array.resize(total_samples * 2)
	for i in range(total_samples):
		var progress = float(i) / float(total_samples)
		var env = sin(progress * PI)
		var val = randf_range(-0.7, 0.7) * env
		var sample_16 = int(clamp(val * 24000.0, -32767.0, 32767.0))
		byte_array.encode_s16(i * 2, sample_16)
	return _build_wav(byte_array)

func _build_wav(data: PackedByteArray) -> AudioStreamWAV:
	var wav = AudioStreamWAV.new()
	wav.format = AudioStreamWAV.FORMAT_16_BITS
	wav.mix_rate = sample_rate
	wav.stereo = false
	wav.data = data
	return wav
