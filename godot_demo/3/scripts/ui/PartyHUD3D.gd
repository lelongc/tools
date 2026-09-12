extends CanvasLayer
class_name PartyHUD3D

## PartyHUD3D.gd
## Giao diện hiển thị thời gian, đơn hàng Co-op và điểm số 2 người chơi

@onready var timer_label: Label = $Root/TopBar/TimerLabel
@onready var orders_label: Label = $Root/TopBar/OrdersBox/OrdersLabel
@onready var p1_score_label: Label = $Root/P1Card/VBox/P1Score
@onready var p2_score_label: Label = $Root/P2Card/VBox/P2Score
@onready var p1_slap_label: Label = $Root/P1Card/VBox/P1Slaps
@onready var p2_slap_label: Label = $Root/P2Card/VBox/P2Slaps
@onready var hint_label: Label = $Root/BottomHint

func _ready() -> void:
	GameManager3D.score_updated.connect(_on_score_updated)
	GameManager3D.order_updated.connect(_on_order_updated)
	GameManager3D.match_timer_updated.connect(_on_timer_updated)
	
	_on_score_updated(GameManager3D.p1_score, GameManager3D.p2_score, GameManager3D.total_deliveries)
	_on_order_updated(GameManager3D.current_orders)

func _on_timer_updated(seconds_left: float) -> void:
	var mins = int(seconds_left) / 60
	var secs = int(seconds_left) % 60
	timer_label.text = "⏳ THỜI GIAN: %02d:%02d" % [mins, secs]
	if seconds_left <= 15.0:
		timer_label.modulate = Color(1.0, 0.2, 0.2)
	else:
		timer_label.modulate = Color(1.0, 0.9, 0.2)

func _on_score_updated(p1: int, p2: int, deliveries: int) -> void:
	p1_score_label.text = "ĐỎ: %d ĐIỂM" % p1
	p2_score_label.text = "XANH: %d ĐIỂM" % p2
	p1_slap_label.text = "Tát bạn: %d lần" % GameManager3D.p1_friendly_slaps
	p2_slap_label.text = "Tát bạn: %d lần" % GameManager3D.p2_friendly_slaps

func _on_order_updated(orders: Array) -> void:
	if orders.is_empty():
		orders_label.text = "📦 ĐÃ HOÀN THÀNH TẤT CẢ ĐƠN HÀNG!"
		return
		
	var text = "📦 ĐƠN HÀNG HIỆN TẠI: "
	for o in orders:
		var cname = "ĐỎ" if o["color"] == "red" else "XANH"
		text += "[%s: %d/%d]  " % [cname, o["current"], o["needed"]]
	orders_label.text = text
