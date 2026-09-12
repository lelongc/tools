extends Node3D

## MainPartyArena.gd
## Đấu trường 3D Co-op Party: Quản lý tái sinh hình nhân và thiết lập chế độ chơi

@onready var p1: SplatPlayer3D = $Players/Player1
@onready var p2: SplatPlayer3D = $Players/Player2
@onready var mannequins_container: Node3D = $Mannequins

func _ready() -> void:
	# Cấu hình P2 là bot AI nếu người chơi chọn 1 player
	if not GameManager3D.is_two_player:
		p2.is_ai_bot = true
	else:
		p2.is_ai_bot = false
		
	# Đảm bảo các hình nhân thuộc nhóm mannequins
	for m in mannequins_container.get_children():
		if m is Mannequin3D:
			m.add_to_group("mannequins")
