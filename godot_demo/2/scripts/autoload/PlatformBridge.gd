extends Node

# PlatformBridge: Quản lý đa nền tảng (CH Play, YouTube Playables, PC Desktop)

enum PlatformType {
	CH_PLAY,            # Android Google Play
	YOUTUBE_PLAYABLE,   # Web HTML5 / WASM YouTube Playables
	DESKTOP_DEBUG       # Windows / macOS / Linux Editor & PC
}

var current_platform: PlatformType = PlatformType.DESKTOP_DEBUG
var is_game_started: bool = false
var is_paused_by_platform: bool = false

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	detect_platform()
	setup_lifecycle_listeners()

func detect_platform() -> void:
	if OS.has_feature("web"):
		current_platform = PlatformType.YOUTUBE_PLAYABLE
		init_youtube_playables_sdk()
	elif OS.has_feature("android"):
		current_platform = PlatformType.CH_PLAY
		init_ch_play_android()
	else:
		current_platform = PlatformType.DESKTOP_DEBUG
		print("[PlatformBridge] 💻 Đang chạy trên môi trường PC Desktop / Debug")

func setup_lifecycle_listeners() -> void:
	# Bắt sự kiện người dùng chuyển tab hoặc mất focus
	get_tree().root.focus_exited.connect(_on_focus_lost)
	get_tree().root.focus_entered.connect(_on_focus_gained)

func _on_focus_lost() -> void:
	if current_platform == PlatformType.YOUTUBE_PLAYABLE:
		# Tạm dừng game & ngắt âm thanh theo yêu cầu nghiêm ngặt của YouTube
		SoundManager.mute_all(true)
		get_tree().paused = true
		is_paused_by_platform = true
		JavaScriptBridge.eval("if (window.ytgame && ytgame.onPause) { ytgame.onPause(); }")

func _on_focus_gained() -> void:
	if is_paused_by_platform:
		SoundManager.mute_all(false)
		get_tree().paused = false
		is_paused_by_platform = false
		if current_platform == PlatformType.YOUTUBE_PLAYABLE:
			JavaScriptBridge.eval("if (window.ytgame && ytgame.onResume) { ytgame.onResume(); }")

# =========================================================================
# YOUTUBE PLAYABLES SDK INTEGRATION
# =========================================================================
func init_youtube_playables_sdk() -> void:
	print("[PlatformBridge] 🔴 Đang khởi tạo YouTube Playables SDK...")
	if OS.has_feature("web"):
		# Thông báo YouTube SDK game đã tải xong
		JavaScriptBridge.eval("""
			if (window.ytgame) {
				console.log('[YouTube Playables] SDK Connected!');
				ytgame.gameLoading && ytgame.gameLoading();
			}
		""")

func notify_game_ready() -> void:
	if current_platform == PlatformType.YOUTUBE_PLAYABLE and OS.has_feature("web"):
		JavaScriptBridge.eval("""
			if (window.ytgame) {
				ytgame.gameReady && ytgame.gameReady();
				ytgame.firstFrameReady && ytgame.firstFrameReady();
				console.log('[YouTube Playables] Game Ready & First Frame Rendered!');
			}
		""")

func save_cloud_data(data_json: String) -> void:
	if current_platform == PlatformType.YOUTUBE_PLAYABLE and OS.has_feature("web"):
		var js_code = "if (window.ytgame && ytgame.saveData) { ytgame.saveData(%s); }" % JSON.stringify(data_json)
		JavaScriptBridge.eval(js_code)

func request_rewarded_ad(callback_callable: Callable) -> void:
	# Xem quảng cáo nhận thưởng x2 / hồi sinh
	if current_platform == PlatformType.YOUTUBE_PLAYABLE:
		# YouTube Playables gọi qua SDK hoặc tự thưởng
		callback_callable.call(true)
	elif current_platform == PlatformType.CH_PLAY:
		# Gọi plugin AdMob Android
		callback_callable.call(true)
	else:
		# PC Debug: Cho nhận thưởng luôn
		callback_callable.call(true)

# =========================================================================
# CH PLAY ANDROID HOOKS
# =========================================================================
func init_ch_play_android() -> void:
	print("[PlatformBridge] 📱 Khởi động Android Google Play Services...")
