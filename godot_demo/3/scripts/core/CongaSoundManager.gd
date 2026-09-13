extends Node

## CongaSoundManager.gd
## Hệ thống âm thanh 2D Party: Nối đuôi hình nhân, quất roi, lướt và nạp điểm pháo hoa

var sound_cache: Dictionary = {}
var bgm_player: AudioStreamPlayer
var sfx_pool: Array[AudioStreamPlayer] = []
const SFX_COUNT = 10

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	
	bgm_player = AudioStreamPlayer.new()
	bgm_player.bus = "Master"
	add_child(bgm_player)
	
	for i in range(SFX_COUNT):
		var p = AudioStreamPlayer.new()
		p.bus = "Master"
		add_child(p)
		sfx_pool.append(p)
		
	play_party_bgm()

func play_sfx(sfx_name: String, pitch: float = 1.0) -> void:
	var user_files = [
		"res://assets/audio/" + sfx_name + ".wav",
		"res://assets/audio/" + sfx_name + ".mp3",
		"res://assets/audio/" + sfx_name + ".ogg"
	]
	var stream: AudioStream = null
	for path in user_files:
		if ResourceLoader.exists(path):
			stream = load(path)
			break
			
	if not stream:
		stream = _get_or_create_synth(sfx_name)
		
	if not stream:
		return
		
	for p in sfx_pool:
		if not p.playing:
			p.stream = stream
			p.pitch_scale = pitch
			p.play()
			return
			
	sfx_pool[0].stream = stream
	sfx_pool[0].pitch_scale = pitch
	sfx_pool[0].play()

func _get_or_create_synth(type: String) -> AudioStreamWAV:
	if sound_cache.has(type):
		return sound_cache[type]
		
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = 22050
	stream.stereo = false
	var data = PackedByteArray()
	var duration = 0.15
	
	match type:
		"attach":
			# Tiếng hít nam châm phập khi nối hình nhân
			duration = 0.12
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = (1.0 - t / duration)
				var f = lerp(400.0, 950.0, t / duration)
				var val = sin(t * f * TAU) * env
				data.append(int(clamp((val * 0.7 + 0.5) * 255.0, 0, 255)))
		"dash":
			# Tiếng vút gió lướt nhanh
			duration = 0.22
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = sin(PI * (t / duration))
				var noise = (randf() * 2.0 - 1.0) * 0.5
				var whoosh = sin(t * 180.0 * TAU) * 0.5
				var val = (noise + whoosh) * env
				data.append(int(clamp((val * 0.6 + 0.5) * 255.0, 0, 255)))
		"whip_hit":
			# Tiếng roi quất đôm đốp
			duration = 0.18
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = 1.0 - (t / duration)
				var slap = sin(t * (700.0 - t * 2500.0) * TAU)
				var val = slap * env
				data.append(int(clamp((val * 0.8 + 0.5) * 255.0, 0, 255)))
		"bank_score":
			# Tiếng pháo hoa nạp điểm keng keng
			duration = 0.28
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = (1.0 - t / duration)
				var f = 880.0 if t < 0.1 else 1320.0
				var val = sin(t * f * TAU) * env
				data.append(int(clamp((val * 0.6 + 0.5) * 255.0, 0, 255)))
		"steal":
			# Tiếng cướp hình nhân của đối thủ
			duration = 0.2
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = (1.0 - t / duration)
				var f = lerp(800.0, 400.0, t / duration)
				var val = sin(t * f * TAU) * env
				data.append(int(clamp((val * 0.7 + 0.5) * 255.0, 0, 255)))
		"bonk":
			duration = 0.16
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = (1.0 - t / duration)
				var val = sin(t * 160.0 * TAU) * env
				data.append(int(clamp((val * 0.8 + 0.5) * 255.0, 0, 255)))
		_:
			duration = 0.1
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = (1.0 - t / duration)
				var val = sin(t * 440.0 * TAU) * env
				data.append(int(clamp((val * 0.5 + 0.5) * 255.0, 0, 255)))

	stream.data = data
	sound_cache[type] = stream
	return stream

func play_party_bgm() -> void:
	var custom_bgm = "res://assets/audio/bgm_conga.ogg"
	if ResourceLoader.exists(custom_bgm):
		bgm_player.stream = load(custom_bgm)
		bgm_player.play()
		return
		
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = 11025
	stream.stereo = false
	stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	stream.loop_end = 11025 * 4
	
	var data = PackedByteArray()
	var notes = [261.63, 329.63, 392.0, 523.25, 440.0, 349.23, 392.0, 493.88] # Vui nhộn tiệc tùng
	for i in range(11025 * 4):
		var t = float(i) / 11025.0
		var note_idx = int(t * 4.0) % 8
		var f = notes[note_idx]
		var env = 0.25 * (1.0 - fmod(t * 4.0, 1.0) * 0.6)
		var val = sin(t * f * TAU) * env
		data.append(int(clamp((val * 0.3 + 0.5) * 255.0, 0, 255)))
		
	stream.data = data
	bgm_player.stream = stream
	bgm_player.volume_db = -8.0
	bgm_player.play()
