extends Node

## GameManager3D.gd
## Điều phối các chế độ chơi Co-op đơn hàng, đấu đối kháng và trùm hình nhân khổng lồ

signal score_updated(p1_score: int, p2_score: int, deliveries: int)
signal order_updated(orders_list: Array)
signal match_timer_updated(seconds_left: float)
signal match_ended(result_title: String, stars: int, p1_slaps: int, p2_slaps: int)

enum GameMode {
	COOP_ORDER,
	PARTY_VERSUS,
	TITAN_BOSS
}

var current_mode: GameMode = GameMode.COOP_ORDER
var is_two_player: bool = true # true: 2 người chơi thật, false: 1 người chơi + AI bot

var match_time: float = 120.0
var is_match_active: bool = false

var p1_score: int = 0
var p2_score: int = 0
var total_deliveries: int = 0
var p1_friendly_slaps: int = 0
var p2_friendly_slaps: int = 0

var current_orders: Array = []

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

func start_match(mode: GameMode, two_players: bool = true) -> void:
	current_mode = mode
	is_two_player = two_players
	p1_score = 0
	p2_score = 0
	total_deliveries = 0
	p1_friendly_slaps = 0
	p2_friendly_slaps = 0
	
	match mode:
		GameMode.COOP_ORDER:
			match_time = 120.0
			_generate_new_order()
		GameMode.PARTY_VERSUS:
			match_time = 90.0
		GameMode.TITAN_BOSS:
			match_time = 150.0
			
	is_match_active = true
	get_tree().paused = false

func _process(delta: float) -> void:
	if not is_match_active:
		return
		
	match_time -= delta
	if match_time < 0.0:
		match_time = 0.0
		_end_match()
		
	match_timer_updated.emit(match_time)

func register_delivery(color: String, points: int, delivered_by: int) -> void:
	if not is_match_active:
		return
		
	total_deliveries += 1
	if delivered_by == 1:
		p1_score += points
	else:
		p2_score += points
		
	SoundManager3D.play_sfx("order_success", 1.0)
	
	# Kiểm tra đơn hàng co-op
	if current_mode == GameMode.COOP_ORDER:
		var order_completed = false
		for o in current_orders:
			if o["color"] == color and o["current"] < o["needed"]:
				o["current"] += 1
				order_completed = true
				break
				
		# Kiểm tra hoàn thành toàn bộ đơn hiện tại
		var all_done = true
		for o in current_orders:
			if o["current"] < o["needed"]:
				all_done = false
				break
				
		if all_done:
			p1_score += 500
			p2_score += 500
			match_time += 15.0 # Thưởng thêm 15 giây
			SoundManager3D.play_sfx("victory", 1.2)
			_generate_new_order()
		else:
			order_updated.emit(current_orders)
			
	score_updated.emit(p1_score, p2_score, total_deliveries)

func register_friendly_slap(slapper: int) -> void:
	if slapper == 1:
		p1_friendly_slaps += 1
	else:
		p2_friendly_slaps += 1

func _generate_new_order() -> void:
	current_orders.clear()
	var possible_colors = ["red", "blue"]
	var count1 = randi_range(1, 3)
	current_orders.append({"color": possible_colors[randi() % possible_colors.size()], "needed": count1, "current": 0})
	
	var count2 = randi_range(1, 2)
	var second_color = "blue" if current_orders[0]["color"] == "red" else "red"
	current_orders.append({"color": second_color, "needed": count2, "current": 0})
	
	order_updated.emit(current_orders)

func _end_match() -> void:
	is_match_active = false
	SoundManager3D.play_sfx("victory", 1.0)
	
	var title = ""
	var stars = 1
	
	match current_mode:
		GameMode.COOP_ORDER:
			if total_deliveries >= 12:
				stars = 3
				title = "🏆 SIÊU ĐỘI CO-OP GIAO HÀNG ĐẠI TÀI!"
			elif total_deliveries >= 6:
				stars = 2
				title = "🎉 HỢP TÁC TỐT! ĐƠN HÀNG HOÀN THÀNH!"
			else:
				stars = 1
				title = "😅 CẦN PHỐI HỢP TỐT HƠN NỮA!"
		GameMode.PARTY_VERSUS:
			if p1_score > p2_score:
				title = "🔴 NGƯỜI CHƠI 1 (ĐỎ) CHIẾN THẮNG!"
			elif p2_score > p1_score:
				title = "🔵 NGƯỜI CHƠI 2 (XANH) CHIẾN THẮNG!"
			else:
				title = "🤝 HÒA NHAU! CẢ HAI ĐỀU NHIỄM SƠN!"
		GameMode.TITAN_BOSS:
			title = "🎉 ĐÃ NHUỘM MÀU TRÙM KHỔNG LỒ THÀNH CÔNG!"
			stars = 3
			
	match_ended.emit(title, stars, p1_friendly_slaps, p2_friendly_slaps)

func change_scene(scene_path: String) -> void:
	get_tree().change_scene_to_file.call_deferred(scene_path)
