extends Node

# SoundManager: Tự động tổng hợp Nhạc nền (BGM) và đầy đủ Hiệu ứng âm thanh (SFX) chuyên nghiệp

var sfx_players: Array[AudioStreamPlayer] = []
var bgm_player: AudioStreamPlayer
var bgm_stream: AudioStreamWAV
var is_muted: bool = false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	
	# Tạo pool phát SFX
	for i in range(12):
		var p = AudioStreamPlayer.new()
		add_child(p)
		sfx_players.append(p)
		
	# Tạo player phát BGM
	bgm_player = AudioStreamPlayer.new()
	bgm_player.volume_db = -8.0
	add_child(bgm_player)
	
	# Tổng hợp bản nhạc nền vui nhộn dạng Looping Arcade
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
# 🎶 BẢN NHẠC NỀN BGM PROCEDURAL VUI TƯƠI, BẮT TAI (UPBEAT ARCADE RUNNER)
# =========================================================================
func generate_arcade_bgm() -> void:
	var sample_rate = 22050
	var bpm = 135.0
	var beat_duration = 60.0 / bpm
	var total_beats = 32 # 8 measures (4/4 time)
	var total_seconds = total_beats * (beat_duration / 2.0)
	var total_frames = int(sample_rate * total_seconds)
	
	var data = PackedByteArray()
	data.resize(total_frames)
	
	# Giai điệu tươi vui điệp khúc hươu cao cổ (C Major pentatonic arpeggios: C4, E4, G4, A4, C5, D5, E5, G5)
	var melody_notes = [
		523.25, 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33,
		523.25, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25,
		587.33, 659.25, 783.99, 587.33, 523.25, 659.25, 587.33, 440.00,
		523.25, 523.25, 659.25, 783.99, 1046.50, 1046.50, 783.99, 523.25
	]
	
	# Bassline nảy bật (C3, G2, A2, F2)
	var bass_notes = [
		130.81, 130.81, 196.00, 196.00, 220.00, 220.00, 174.61, 174.61,
		130.81, 130.81, 196.00, 196.00, 220.00, 220.00, 174.61, 174.61,
		146.83, 146.83, 196.00, 196.00, 130.81, 130.81, 110.00, 110.00,
		130.81, 130.81, 164.81, 196.00, 261.63, 196.00, 164.81, 130.81
	]
	
	var frames_per_note = total_frames / melody_notes.size()
	var phase_lead = 0.0
	var phase_bass = 0.0
	
	for i in range(total_frames):
		var note_idx = int(i / frames_per_note) % melody_notes.size()
		var freq_lead = melody_notes[note_idx]
		var freq_bass = bass_notes[note_idx]
		
		phase_lead += 2.0 * PI * freq_lead / sample_rate
		phase_bass += 2.0 * PI * freq_bass / sample_rate
		
		# Sóng Triangle cho Lead & Square lọc nhẹ cho Bass
		var lead_wave = asin(sin(phase_lead)) * (2.0 / PI)
		var bass_wave = 1.0 if sin(phase_bass) > 0.0 else -1.0
		
		# Envelope nốt nhạc (Staccato vui nhộn)
		var note_pos = float(i % frames_per_note) / float(frames_per_note)
		var env_lead = max(0.0, 1.0 - note_pos * 1.5)
		var env_bass = max(0.0, 1.0 - note_pos * 1.1)
		
		# Trống Hi-hat nhấp nháy trên mỗi nửa nhịp
		var hat_pos = float(i % (frames_per_note / 2)) / float(frames_per_note / 2)
		var noise = randf_range(-1.0, 1.0) * max(0.0, 1.0 - hat_pos * 4.0) * 0.15
		
		var mix_sample = (lead_wave * env_lead * 0.35) + (bass_wave * env_bass * 0.22) + noise
		var byte_val = int(clamp((mix_sample + 1.0) * 127.5, 0, 255))
		data[i] = byte_val
		
	bgm_stream = AudioStreamWAV.new()
	bgm_stream.format = AudioStreamWAV.FORMAT_8_BITS
	bgm_stream.mix_rate = sample_rate
	bgm_stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	bgm_stream.loop_begin = 0
	bgm_stream.loop_end = total_frames
	bgm_stream.data = data
	bgm_player.stream = bgm_stream

func start_bgm() -> void:
	if bgm_player and bgm_stream and not bgm_player.playing:
		bgm_player.play()

func stop_bgm() -> void:
	if bgm_player and bgm_player.playing:
		bgm_player.stop()

# =========================================================================
# 🔊 BỘ TỔNG HỢP HIỆU ỨNG ÂM THANH (SFX PROCEDURAL SUITE)
# =========================================================================
func create_tone_stream(freq_start: float, freq_end: float, duration: float, type: String = "sine") -> AudioStreamWAV:
	var sample_rate = 22050
	var total_frames = int(sample_rate * duration)
	var data = PackedByteArray()
	data.resize(total_frames)
	
	var phase = 0.0
	for i in range(total_frames):
		var t = float(i) / float(total_frames)
		var freq = lerp(freq_start, freq_end, t)
		phase += 2.0 * PI * freq / sample_rate
		
		var sample_val = 0.0
		if type == "sine":
			sample_val = sin(phase)
		elif type == "square":
			sample_val = 1.0 if sin(phase) > 0.0 else -1.0
		elif type == "triangle":
			sample_val = asin(sin(phase)) * (2.0 / PI)
			
		var env = (1.0 - t) * (1.0 - t)
		var byte_val = int(clamp((sample_val * env * 0.7 + 1.0) * 127.5, 0, 255))
		data[i] = byte_val
		
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = sample_rate
	stream.data = data
	return stream

# 1. Vươn Cổ Co Giãn (Elastic Boing!)
func play_stretch(pitch: float = 1.0) -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(180.0 * pitch, 560.0 * pitch, 0.12, "sine")
	p.volume_db = -3.0
	p.play()

# 2. Thụt Cổ Xuống (Whoosh Duck!)
func play_duck() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(480.0, 160.0, 0.1, "sine")
	p.volume_db = -5.0
	p.play()

# 3. Ăn Quả (Juicy Pop Chime!)
func play_collect(pitch: float = 1.0) -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(520.0 * pitch, 1050.0 * pitch, 0.14, "triangle")
	p.volume_db = -1.0
	p.play()

# 4. Cổng Tăng Cổ (Cyber Gate Boost!)
func play_gate_bonus() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(440.0, 920.0, 0.25, "square")
	p.volume_db = -5.0
	p.play()

# 5. Đập Đầu Xà Ngang (Comical Bonk!)
func play_bonk() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(320.0, 75.0, 0.24, "sine")
	p.volume_db = 2.0
	p.play()

# 6. Gai Đâm (Spike Poke!)
func play_spike() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(420.0, 110.0, 0.18, "square")
	p.volume_db = 0.0
	p.play()

# 7. Lưỡi Cưa Cắt (Saw Blade Buzz!)
func play_saw_hit() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(600.0, 120.0, 0.22, "square")
	p.volume_db = 1.0
	p.play()

# 8. Va Chạm Đá (Rock Smash!)
func play_rock_hit() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(220.0, 60.0, 0.3, "sine")
	p.volume_db = 2.0
	p.play()

# 9. Búa Tử Thần (Axe Chop!)
func play_axe_hit() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(350.0, 70.0, 0.28, "square")
	p.volume_db = 2.0
	p.play()

# 10. Chiến Thắng Đỉnh Tháp (Victory Fanfare!)
func play_win() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(440.0, 1250.0, 0.65, "triangle")
	p.volume_db = 3.0
	p.play()

# 11. Bấm Nút UI (Button Blip)
func play_click() -> void:
	if not SaveSystem.sound_enabled: return
	var p = get_available_player()
	p.stream = create_tone_stream(650.0, 420.0, 0.05, "sine")
	p.volume_db = -4.0
	p.play()
