extends Node2D

## CongaArena2D.gd
## Võ đài 2D đại chiến roi hình nhân: Quản lý 4 người chơi, đàn ma-nơ-canh và vòng nộp điểm

@onready var p1: CongaPlayer2D = $Players/Player1
@onready var p2: CongaPlayer2D = $Players/Player2
@onready var p3: CongaPlayer2D = $Players/Player3
@onready var p4: CongaPlayer2D = $Players/Player4
@onready var mannequins_container: Node2D = $Mannequins

func _ready() -> void:
	var players = [p1, p2, p3, p4]
	var cfgs = CongaGameManager.player_configs
	
	for i in range(4):
		var p = players[i]
		var cfg = cfgs[i]
		if cfg == "off":
			p.visible = false
			p.set_physics_process(false)
			p.remove_from_group("players")
		elif cfg == "ai":
			p.is_ai = true
		else:
			p.is_ai = false
			
	# Tự động sinh thêm hình nhân rải đều trong sân nếu thiếu
	_spawn_initial_mannequins()

func _spawn_initial_mannequins() -> void:
	var current_count = mannequins_container.get_child_count()
	for i in range(16 - current_count):
		var m = CongaMannequin2D.new()
		m.global_position = Vector2(randf_range(-480, 480), randf_range(-260, 260))
		mannequins_container.add_child(m)

func _draw() -> void:
	# Nền sân đấu neon phong cách Arcade rực rỡ
	draw_rect(Rect2(-620, -340, 1240, 680), Color(0.1, 0.12, 0.18))
	
	# Lưới kẻ ô tinh tế
	for x in range(-600, 601, 80):
		draw_line(Vector2(x, -340), Vector2(x, 340), Color(0.16, 0.2, 0.28), 1.5)
	for y in range(-320, 321, 80):
		draw_line(Vector2(-620, y), Vector2(620, y), Color(0.16, 0.2, 0.28), 1.5)
		
	# Khung viền đệm tường cao su phát sáng
	draw_rect(Rect2(-620, -340, 1240, 680), Color(0.3, 0.5, 0.9), false, 5.0)
