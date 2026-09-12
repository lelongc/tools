extends Node

## SoundManager3D.gd
## Bộ phát âm thanh 3D Party: Tiếng bắn sơn, tiếng tát bonk lộn cổ và nhạc tiệc tùng tấu hài

var sound_cache: Dictionary = {}
var bgm_player: AudioStreamPlayer
var sfx_pool: Array[AudioStreamPlayer] = []
const POOL_SIZE = 10

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
		
	play_party_bgm()

func play_sfx(sfx_name: String, pitch_scale: float = 1.0) -> void:
	var user_file_paths = [
		"res://assets/audio/" + sfx_name + ".wav",
		"res://assets/audio/" + sfx_name + ".mp3",
		"res://assets/audio/" + sfx_name + ".ogg"
	]
	var stream: AudioStream = null
	for p in user_file_paths:
		if ResourceLoader.exists(p):
			stream = load(p)
			break
			
	if not stream:
		stream = _get_or_create_synth_sfx(sfx_name)
		
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
	var duration = 0.15
	
	match type:
		"splat":
			duration = 0.14
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = 1.0 - (t / duration)
				var squish = sin(t * (300.0 - t * 1200.0) * TAU)
				var noise = (randf() * 2.0 - 1.0) * 0.4
				var val = (squish * 0.6 + noise) * env
				data.append(int(clamp((val * 0.7 + 0.5) * 255.0, 0, 255)))
		"bonk":
			# Tiếng tát chảo / tát bóng bay boing cực bựa
			duration = 0.2
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = (1.0 - t / duration)
				var f = lerp(600.0, 150.0, t / duration)
				var val = sin(t * f * TAU) * env
				data.append(int(clamp((val * 0.8 + 0.5) * 255.0, 0, 255)))
		"boing":
			# Bục nhún lò xo
			duration = 0.35
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = sin(PI * (t / duration))
				var f = 180.0 + sin(t * 30.0) * 120.0
				var val = sin(t * f * TAU) * env
				data.append(int(clamp((val * 0.7 + 0.5) * 255.0, 0, 255)))
		"order_success":
			duration = 0.3
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = 1.0 - (t / duration)
				var f = 880.0 if t < 0.15 else 1320.0
				var val = sin(t * f * TAU) * env
				data.append(int(clamp((val * 0.6 + 0.5) * 255.0, 0, 255)))
		"slip":
			duration = 0.25
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = (1.0 - t / duration)
				var f = lerp(400.0, 800.0, t / duration)
				var val = sin(t * f * TAU) * env
				data.append(int(clamp((val * 0.6 + 0.5) * 255.0, 0, 255)))
		"victory":
			duration = 0.8
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = 1.0 - (t / duration)
				var f = 523.25
				if t > 0.2: f = 659.25
				if t > 0.4: f = 783.99
				if t > 0.6: f = 1046.50
				var val = sin(t * f * TAU) * env
				data.append(int(clamp((val * 0.6 + 0.5) * 255.0, 0, 255)))
		_:
			duration = 0.1
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var env = 1.0 - (t / duration)
				var val = sin(t * 440.0 * TAU) * env
				data.append(int(clamp((val * 0.5 + 0.5) * 255.0, 0, 255)))

	stream.data = data
	sound_cache[type] = stream
	return stream

func play_party_bgm() -> void:
	var custom_bgm = "res://assets/audio/bgm_party.ogg"
	if ResourceLoader.exists(custom_bgm):
		bgm_player.stream = load(custom_bgm)
		bgm_player.play()
		return
		
	# Nhạc tiệc tùng vui nhộn lặp đi lặp lại
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = 11025
	stream.stereo = false
	stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	stream.loop_end = 11025 * 4
	
	var data = PackedByteArray()
	# Giai điệu tiệc tùng tươi vui vui vẻ
	var notes = [261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 329.63, 293.66]
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
