extends Node

# Procedural Retro & Cartoon Audio Synthesizer for instant game audio
var sfx_players: Array[AudioStreamPlayer] = []
const POOL_SIZE = 12

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	for i in range(POOL_SIZE):
		var p = AudioStreamPlayer.new()
		add_child(p)
		sfx_players.append(p)

	# Tự động kết nối các tín hiệu toàn cục từ GameManager
	GameManager.egg_dropped.connect(func(_type): play_egg_drop())
	GameManager.enemy_defeated.connect(func(_enemy, _pts): play_enemy_squash())
	GameManager.level_completed.connect(func(_stars, _score, _coins = 0): play_victory())

func _get_available_player() -> AudioStreamPlayer:
	for p in sfx_players:
		if not p.playing:
			return p
	return sfx_players[0]

func play_synth_tone(freq_or_type = 440.0, duration: float = 0.12, type: String = "sine", vol_db: float = 0.0) -> void:
	var freq: float = 440.0
	if typeof(freq_or_type) == TYPE_STRING:
		type = freq_or_type
		match type:
			"pop": freq = 520.0
			"boom": freq = 90.0
			"laser": freq = 600.0
			"noise": freq = 240.0
			_: freq = 440.0
	elif typeof(freq_or_type) in [TYPE_FLOAT, TYPE_INT]:
		freq = float(freq_or_type)

	var sample_hz = 22050
	var total_samples = int(sample_hz * duration)
	var data = PackedByteArray()
	
	for i in range(total_samples):
		var t = float(i) / float(sample_hz)
		var progress = float(i) / float(total_samples)
		var env = 1.0 - progress # Decay envelope
		var val = 0.0
		
		match type:
			"sine":
				val = sin(TAU * freq * t)
			"noise":
				val = randf_range(-1.0, 1.0)
			"square":
				val = 1.0 if sin(TAU * freq * t) > 0.0 else -1.0
			"laser":
				var cur_f = freq * (1.0 - progress * 0.8)
				val = sin(TAU * cur_f * t)
			"boom":
				var cur_f = freq * (1.0 - progress * 0.9)
				val = sin(TAU * cur_f * t) * 0.7 + randf_range(-0.3, 0.3)
			"pop":
				var cur_f = freq * (1.0 + (1.0 - progress) * 0.4)
				val = sin(TAU * cur_f * t)

		var sample_byte = int(clamp((val * env * 0.8 + 1.0) * 127.5, 0, 255))
		data.append(sample_byte)

	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = sample_hz
	stream.data = data

	var p = _get_available_player()
	p.stream = stream
	p.volume_db = vol_db
	p.pitch_scale = randf_range(0.92, 1.08)
	p.play()

# Các hàm gọi hiệu ứng âm thanh cụ thể
func play_egg_drop() -> void:
	play_synth_tone(600.0, 0.12, "laser", -3.0)

func play_explosion() -> void:
	play_synth_tone(90.0, 0.45, "boom", 3.0)

func play_wood_break() -> void:
	play_synth_tone(240.0, 0.15, "noise", -1.0)

func play_stone_break() -> void:
	play_synth_tone(110.0, 0.25, "boom", 1.0)

func play_glass_break() -> void:
	play_synth_tone(1800.0, 0.18, "sine", 0.0)

func play_enemy_squash() -> void:
	play_synth_tone(750.0, 0.22, "laser", 2.0)

func play_victory() -> void:
	play_synth_tone(523.25, 0.2, "sine", 2.0) # C5
	await get_tree().create_timer(0.15).timeout
	play_synth_tone(659.25, 0.2, "sine", 2.0) # E5
	await get_tree().create_timer(0.15).timeout
	play_synth_tone(783.99, 0.4, "sine", 3.0) # G5
