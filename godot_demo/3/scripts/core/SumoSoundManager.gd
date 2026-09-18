extends Node

## SumoSoundManager.gd
## Hệ thống âm thanh Đấu Trường Sumo Ragdoll: Tiếng đấm bóp, búa tạ kêu chít chít, hất văng lộn mèo, reo hò

var sound_cache: Dictionary = {}
var bgm_player: AudioStreamPlayer
var sfx_pool: Array[AudioStreamPlayer] = []
const POOL_SIZE = 16

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
		
	play_arena_bgm()

func play_sfx(sound_name: String, pitch_scale: float = 1.0) -> void:
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
	var duration = 0.18
	
	match type:
		"punch_heavy": # Cú đấm bóp nổ vang dội
			duration = 0.16
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(480.0, 75.0, t / duration)
				var noise = (randf() * 0.7 - 0.35)
				var env = exp(-t * 18.0)
				var s = (sin(t * freq * TAU) * 0.6 + noise) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"hammer_bonk": # Tiếng búa tạ cao su đồ chơi chít chít + cộp
			duration = 0.22
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var squeak = sin(t * 1400.0 * TAU) * exp(-t * 30.0)
				var thud = sin(t * 120.0 * TAU) * exp(-t * 10.0)
				var s = squeak * 0.5 + thud * 0.5
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"yeet_throw": # Tiếng nhấc bổng quẳng đối thủ đi xa (YEET!)
			duration = 0.2
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(180.0, 800.0, t / duration)
				var env = sin((t / duration) * PI)
				var s = sin(t * freq * TAU) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"ring_out": # Rơi khỏi võ đài tấu hài
			duration = 0.35
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var slide = lerp(700.0, 90.0, t / duration)
				var env = (1.0 - t / duration)
				var s = sin(t * slide * TAU) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"stun_dizzy": # Tiếng choáng sao bay quanh đầu
			duration = 0.25
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var wob = sin(t * 30.0 * TAU) * 150.0
				var s = sin(t * (600.0 + wob) * TAU) * exp(-t * 8.0)
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"trampoline_bounce": # Tiếng bục nhún tưng tưng
			duration = 0.22
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var freq = lerp(120.0, 480.0, t / duration)
				var env = exp(-t * 9.0)
				var s = sin(t * freq * TAU) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		"cheer": # Tiếng reo hò vang dội
			duration = 0.5
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var chord = sin(t * 440.0 * TAU) + sin(t * 554.37 * TAU) + sin(t * 659.25 * TAU)
				var env = exp(-t * 3.0)
				var s = (chord / 3.0) * env
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))
				
		_:
			duration = 0.12
			for i in range(int(22050 * duration)):
				var t = float(i) / 22050.0
				var s = sin(t * 500.0 * TAU) * (1.0 - t/duration)
				data.append(int(clamp((s * 0.5 + 0.5) * 255.0, 0, 255)))

	stream.data = data
	sound_cache[type] = stream
	return stream

func play_arena_bgm() -> void:
	var user_bgm = "res://assets/audio/bgm.wav"
	if not ResourceLoader.exists(user_bgm):
		user_bgm = "res://assets/audio/bgm.ogg"
	if ResourceLoader.exists(user_bgm):
		var s = load(user_bgm)
		if s is AudioStreamWAV:
			s.loop_mode = AudioStreamWAV.LOOP_FORWARD
			s.loop_begin = 0
		bgm_player.stream = s
		bgm_player.volume_db = -5.0
		bgm_player.play()
		return
		
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = 22050
	stream.stereo = false
	stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	stream.loop_begin = 0
	
	var duration = 4.0
	var total_samples = int(22050 * duration)
	stream.loop_end = total_samples
	var data = PackedByteArray()
	
	# Nhạc tiệc tùng tấu hài rộn ràng (Brass & Punchy Bass)
	var notes = [110.0, 130.81, 146.83, 164.81, 196.0, 164.81, 146.83, 123.47]
	for i in range(total_samples):
		var t = float(i) / 22050.0
		var n_idx = int(t * 2.0) % notes.size()
		var n_time = fmod(t, 0.5)
		var bass = sin(n_time * notes[n_idx] * TAU) * exp(-n_time * 6.0)
		var clap = (randf() * 0.2 - 0.1) if fmod(t, 0.5) > 0.23 and fmod(t, 0.5) < 0.28 else 0.0
		var sig = bass * 0.3 + clap
		data.append(int(clamp((sig + 0.5) * 255.0, 0, 255)))
		
	stream.data = data
	bgm_player.stream = stream
	bgm_player.volume_db = -10.0
	bgm_player.play()
