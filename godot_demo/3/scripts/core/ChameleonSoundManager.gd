extends Node

## ChameleonSoundManager.gd
## Hệ thống âm thanh tổng hợp 3D cho Tắc Kè Thè Lưỡi, Nuốt Hình Nhân, Bắn Đại Bác Pháo Sơn

var sound_cache: Dictionary = {}
var bgm_player: AudioStreamPlayer
var sfx_pool: Array[AudioStreamPlayer] = []
const POOL_SIZE = 14

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	
	bgm_player = AudioStreamPlayer.new()
	bgm_player.bus = "Master"
	add_child(bgm_player)
	
	for i in range(POOL_SIZE):
		var p = AudioStreamPlayer.new()
		p.bus = "Master"
		add_child(p)
		sfx_pool.append(p)
		
	play_groovy_bgm()

func play_sfx(sound_name: String, pitch_scale: float = 1.0) -> void:
	# 1. Kiểm tra file âm thanh tùy chọn do người dùng thả vào assets/audio/
	var user_file = "res://assets/audio/%s.wav" % sound_name
	if not ResourceLoader.exists(user_file):
		user_file = "res://assets/audio/%s.ogg" % sound_name
		
	var stream: AudioStream = null
	if ResourceLoader.exists(user_file):
		stream = load(user_file)
	else:
		stream = _get_or_create_synth_sfx(sound_name)
		
	if not stream:
		return
		
	for p in sfx_pool:
		if not p.playing:
			p.stream = stream
			p.pitch_scale = pitch_scale
			p.play()
			return
			
	sfx_pool[0].stream = stream
	sfx_pool[0].pitch_scale = pitch_scale
	sfx_pool[0].play()

func _get_or_create_synth_sfx(type: String) -> AudioStreamWAV:
	if sound_cache.has(type):
		return sound_cache[type]
		
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = 22050
	stream.stereo = false
	var data = PackedByteArray()
	var duration = 0.16
	
	match type:
		"tongue_shoot": # Tiếng thè lưỡi vút gió đàn hồi
			duration = 0.12
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(200.0, 950.0, t / duration)
				var env = (1.0 - (t / duration))
				var s = sin(t * freq * TAU) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"tongue_hit": # Tiếng dính phập vào hình nhân
			duration = 0.14
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(450.0, 120.0, t / duration)
				var env = exp(-t * 22.0)
				var s = (sin(t * freq * TAU) + (randf() * 0.4 - 0.2)) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"swallow": # Tiếng ực nuốt hình nhân phồng bụng
			duration = 0.18
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(160.0, 320.0, t / duration)
				var env = sin((t / duration) * PI)
				var s = sin(t * freq * TAU) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"spit_cannon": # Tiếng khạc đại bác pháo sơn nổ to
			duration = 0.25
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(380.0, 60.0, t / duration)
				var noise = randf() * 0.6 - 0.3
				var env = exp(-t * 12.0)
				var s = (sin(t * freq * TAU) * 0.6 + noise) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"grapple_pull": # Tiếng vút kéo đu người tới tường
			duration = 0.22
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(250.0, 700.0, t / duration)
				var env = sin((t / duration) * PI)
				var s = sin(t * freq * TAU) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"powerup": # Tiếng nhặt bọ cánh cứng siêu năng lực
			duration = 0.28
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(400.0, 1200.0, t / duration)
				var env = 1.0 - (t / duration)
				var s = sin(t * freq * TAU) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"domino_hit": # Tiếng đạn sơn va đập làm đổ rạp hàng loạt hình nhân
			duration = 0.15
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(550.0, 180.0, t / duration)
				var env = exp(-t * 28.0)
				var s = (sin(t * freq * TAU) + (randf() * 0.5 - 0.25)) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"cheer": # Tiếng reo hò chiến thắng
			duration = 0.45
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var chord = sin(t * 523.25 * TAU) + sin(t * 659.25 * TAU) + sin(t * 783.99 * TAU)
				var env = exp(-t * 3.5)
				var s = (chord / 3.0) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		_: # Mặc định
			duration = 0.1
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var s = sin(t * 440.0 * TAU) * (1.0 - t/duration)
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))

	stream.data = data
	sound_cache[type] = stream
	return stream

func play_groovy_bgm() -> void:
	# Nhạc nền tiệc tùng arcade funky 120BPM
	var user_bgm = "res://assets/audio/bgm.ogg"
	if ResourceLoader.exists(user_bgm):
		bgm_player.stream = load(user_bgm)
		bgm_player.volume_db = -8.0
		bgm_player.play()
		return
		
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = 22050
	stream.stereo = false
	stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	stream.loop_begin = 0
	
	var duration = 4.0 # 4 giây loop 8 nốt bass groovy
	var total_samples = int(22050 * duration)
	stream.loop_end = total_samples
	var data = PackedByteArray()
	
	var bass_notes = [130.81, 146.83, 164.81, 174.61, 196.00, 164.81, 146.83, 130.81]
	
	for i in range(total_samples):
		var t = float(i) / 22050.0
		var note_idx = int(t * 2.0) % bass_notes.size()
		var note_freq = bass_notes[note_idx]
		var note_time = fmod(t, 0.5)
		var env = exp(-note_time * 5.0)
		var bass = sin(note_time * note_freq * TAU) * env
		var hat = (randf() * 0.15 - 0.075) if fmod(t, 0.25) < 0.05 else 0.0
		var sig = (bass * 0.35 + hat) * 0.25
		data.append(int(clamp((sig + 0.5) * 255.0, 0, 255)))
		
	stream.data = data
	bgm_player.stream = stream
	bgm_player.volume_db = -10.0
	bgm_player.play()
