extends Node

# SoundManager - Procedural Retro Synth Sound Engine for Godot 4

var audio_player: AudioStreamPlayer
var is_muted: bool = false
var ambient_timer: Timer

func _ready():
	process_mode = PROCESS_MODE_ALWAYS
	audio_player = AudioStreamPlayer.new()
	add_child(audio_player)
	
	# Create background ambient pulse timer
	ambient_timer = Timer.new()
	ambient_timer.wait_time = 2.0
	ambient_timer.autostart = true
	ambient_timer.timeout.connect(_on_ambient_pulse)
	add_child(ambient_timer)

func toggle_mute() -> bool:
	is_muted = !is_muted
	AudioServer.set_bus_mute(0, is_muted)
	return is_muted

func _on_ambient_pulse():
	if is_muted: return
	# Play a subtle low ambient synth pad chord
	play_synth_tone(110.0, 110.0, 0.4, -26.0, "sine")

func play_synth_tone(freq_start: float, freq_end: float, duration: float, volume_db: float = -10.0, type: String = "square"):
	if is_muted: return
	var sample_rate = 44100
	var num_samples = int(sample_rate * duration)
	var pcm_data = PackedByteArray()
	pcm_data.resize(num_samples * 2) # 16-bit PCM Mono
	
	var phase = 0.0
	for i in range(num_samples):
		var t = float(i) / num_samples
		var current_freq = lerp(freq_start, freq_end, t)
		var phase_increment = (current_freq * TAU) / sample_rate
		phase += phase_increment
		
		# Envelope (fade out)
		var envelope = 1.0 - t
		
		var sample = 0.0
		if type == "square":
			sample = 1.0 if sin(phase) >= 0.0 else -1.0
		elif type == "saw":
			sample = (fmod(phase, TAU) / PI) - 1.0
		elif type == "sine":
			sample = sin(phase)
		elif type == "noise":
			sample = randf_range(-1.0, 1.0)
			
		sample *= envelope
		var val16 = int(clamp(sample * 32767.0, -32768.0, 32767.0))
		pcm_data.encode_s16(i * 2, val16)
		
	var stream = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = sample_rate
	stream.stereo = false
	stream.data = pcm_data
	
	var p = AudioStreamPlayer.new()
	p.stream = stream
	p.volume_db = volume_db
	add_child(p)
	p.play()
	p.finished.connect(p.queue_free)

func play_jump():
	play_synth_tone(150.0, 600.0, 0.15, -12.0, "square")

func play_shuffle():
	play_synth_tone(800.0, 200.0, 0.25, -8.0, "saw")

func play_bounce():
	play_synth_tone(200.0, 800.0, 0.2, -10.0, "sine")

func play_explosion():
	play_synth_tone(200.0, 40.0, 0.4, -6.0, "noise")

func play_win():
	play_synth_tone(440.0, 440.0, 0.1, -10.0, "square")
	await get_tree().create_timer(0.1).timeout
	play_synth_tone(554.37, 554.37, 0.1, -10.0, "square")
	await get_tree().create_timer(0.1).timeout
	play_synth_tone(659.25, 659.25, 0.2, -8.0, "square")

func play_click():
	play_synth_tone(600.0, 800.0, 0.05, -15.0, "sine")
