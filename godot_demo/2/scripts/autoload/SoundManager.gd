extends Node

# SoundManager: Tự động tổng hợp âm thanh Slurp, Pop, Gulp, Level Up, Combo và Nhạc nền Arcade vui nhộn

var sfx_players: Array[AudioStreamPlayer] = []
var bgm_player: AudioStreamPlayer
var is_muted: bool = false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	
	for i in range(16):
		var p = AudioStreamPlayer.new()
		add_child(p)
		sfx_players.append(p)
		
	bgm_player = AudioStreamPlayer.new()
	bgm_player.volume_db = -10.0
	add_child(bgm_player)
	
	generate_arcade_bgm()
	
	if SaveSystem.sound_enabled and SaveSystem.music_enabled:
		start_bgm()

func mute_all(mute: bool) -> void:
	is_muted = mute
	AudioServer.set_bus_mute(0, mute)

func toggle_sound() -> bool:
	SaveSystem.sound_enabled = not SaveSystem.sound_enabled
	mute_all(not SaveSystem.sound_enabled)
	SaveSystem.save_game()
	if SaveSystem.sound_enabled and SaveSystem.music_enabled:
		start_bgm()
	else:
		stop_bgm()
	return SaveSystem.sound_enabled

func get_available_player() -> AudioStreamPlayer:
	for p in sfx_players:
		if not p.playing:
			return p
	return sfx_players[0]

# =========================================================================
# SFX: BỘ HIỆU ỨNG ÂM THANH NUỐT ĐỒ VẬT (ASMR POP / GULP)
# =========================================================================
func play_pop(pitch: float = 1.0) -> void:
	if not SaveSystem.sound_enabled or is_muted: return
	var stream = _generate_tone(450, 180, 0.08, "pop")
	var p = get_available_player()
	p.stream = stream
	p.pitch_scale = pitch * randf_range(0.92, 1.12)
	p.volume_db = -4.0
	p.play()

func play_gulp() -> void:
	if not SaveSystem.sound_enabled or is_muted: return
	var stream = _generate_tone(220, 80, 0.18, "gulp")
	var p = get_available_player()
	p.stream = stream
	p.pitch_scale = randf_range(0.95, 1.08)
	p.volume_db = 0.0
	p.play()

func play_grow() -> void:
	if not SaveSystem.sound_enabled or is_muted: return
	var stream = _generate_melody([330, 440, 554, 659, 880], 0.06, "sine")
	var p = get_available_player()
	p.stream = stream
	p.volume_db = 2.0
	p.play()

func play_swallow_rival() -> void:
	if not SaveSystem.sound_enabled or is_muted: return
	var stream = _generate_melody([440, 554, 659, 880, 1108, 1318], 0.05, "triangle")
	var p = get_available_player()
	p.stream = stream
	p.volume_db = 3.0
	p.play()

func play_booster() -> void:
	if not SaveSystem.sound_enabled or is_muted: return
	var stream = _generate_melody([523, 659, 783, 1046], 0.06, "triangle")
	var p = get_available_player()
	p.stream = stream
	p.volume_db = -1.0
	p.play()

func play_coin() -> void:
	if not SaveSystem.sound_enabled or is_muted: return
	var stream = _generate_tone(987, 1318, 0.09, "triangle")
	var p = get_available_player()
	p.stream = stream
	p.pitch_scale = randf_range(0.95, 1.05)
	p.volume_db = -5.0
	p.play()

func play_victory() -> void:
	if not SaveSystem.sound_enabled or is_muted: return
	var stream = _generate_melody([523, 659, 783, 1046, 1318], 0.12, "sine")
	var p = get_available_player()
	p.stream = stream
	p.volume_db = 1.0
	p.play()

func play_game_over() -> void:
	if not SaveSystem.sound_enabled or is_muted: return
	var stream = _generate_melody([392, 370, 349, 311], 0.22, "saw")
	var p = get_available_player()
	p.stream = stream
	p.volume_db = -1.0
	p.play()

# =========================================================================
# SYNTHESIS GENERATOR
# =========================================================================
func _generate_tone(start_freq: float, end_freq: float, duration: float, type: String) -> AudioStreamWAV:
	var sample_rate = 22050
	var total_frames = int(sample_rate * duration)
	var data = PackedByteArray()
	data.resize(total_frames * 2)
	
	var phase = 0.0
	for i in range(total_frames):
		var t = float(i) / float(total_frames)
		var freq = lerp(start_freq, end_freq, t)
		var env = pow(1.0 - t, 2.0)
		var val = 0.0
		if type == "pop":
			val = sin(phase) * (1.0 - t * 0.5)
		elif type == "gulp":
			val = sin(phase) * 0.8 + sin(phase * 0.5) * 0.4
		elif type == "triangle":
			val = abs(fmod(phase / PI, 2.0) - 1.0) * 2.0 - 1.0
		else:
			val = sin(phase)
			
		var sample_int = int(clamp(val * env * 0.75, -1.0, 1.0) * 32767.0)
		data.encode_s16(i * 2, sample_int)
		phase += 2.0 * PI * freq / sample_rate
		if phase > 2.0 * PI: phase -= 2.0 * PI
			
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = sample_rate
	stream.data = data
	return stream

func _generate_melody(notes: Array, note_duration: float, type: String) -> AudioStreamWAV:
	var sample_rate = 22050
	var total_frames = int(sample_rate * note_duration * notes.size())
	var data = PackedByteArray()
	data.resize(total_frames * 2)
	
	var frames_per_note = int(sample_rate * note_duration)
	for n_idx in range(notes.size()):
		var freq = notes[n_idx]
		var phase = 0.0
		for i in range(frames_per_note):
			var frame_idx = n_idx * frames_per_note + i
			var t = float(i) / float(frames_per_note)
			var env = 1.0 - t * 0.5
			var val = sin(phase)
			if type == "triangle":
				val = abs(fmod(phase / PI, 2.0) - 1.0) * 2.0 - 1.0
			elif type == "saw":
				val = fmod(phase / PI, 2.0) - 1.0
				
			var sample_int = int(clamp(val * env * 0.6, -1.0, 1.0) * 32767.0)
			data.encode_s16(frame_idx * 2, sample_int)
			phase += 2.0 * PI * freq / sample_rate
			if phase > 2.0 * PI: phase -= 2.0 * PI
			
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = sample_rate
	stream.data = data
	return stream

func generate_arcade_bgm() -> void:
	var sample_rate = 22050
	var bpm = 132.0
	var beat_sec = 60.0 / bpm
	var total_frames = int(sample_rate * beat_sec * 16)
	var data = PackedByteArray()
	data.resize(total_frames * 2)
	
	var notes = [329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 349.23, 440.0]
	var frames_per_beat = int(sample_rate * beat_sec * 0.5)
	
	var phase = 0.0
	for i in range(total_frames):
		var beat_idx = int(float(i) / float(frames_per_beat)) % notes.size()
		var freq = notes[beat_idx]
		var sub_t = float(i % frames_per_beat) / float(frames_per_beat)
		var env = pow(1.0 - sub_t, 1.4)
		var val = sin(phase) * 0.35
		var sample_int = int(clamp(val * env * 0.3, -1.0, 1.0) * 32767.0)
		data.encode_s16(i * 2, sample_int)
		phase += 2.0 * PI * freq / sample_rate
		if phase > 2.0 * PI: phase -= 2.0 * PI
		
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = sample_rate
	stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	stream.loop_begin = 0
	stream.loop_end = total_frames
	stream.data = data
	bgm_player.stream = stream

func start_bgm() -> void:
	if bgm_player and not bgm_player.playing:
		bgm_player.play()

func stop_bgm() -> void:
	if bgm_player and bgm_player.playing:
		bgm_player.stop()
