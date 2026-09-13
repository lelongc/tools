extends Area2D
class_name ScoreBank2D

## ScoreBank2D.gd
## Vòng nạp điểm trung tâm: Nạp đoàn hình nhân để lấy điểm combo và bắn pháo hoa

var anim_angle: float = 0.0
var floating_text: String = ""
var text_alpha: float = 0.0
var text_y_offset: float = 0.0

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	var col = CollisionShape2D.new()
	var shape = CircleShape2D.new()
	shape.radius = 55.0
	col.shape = shape
	add_child(col)

func _process(delta: float) -> void:
	anim_angle += delta * 2.0
	if text_alpha > 0.0:
		text_alpha -= delta * 1.5
		text_y_offset -= delta * 40.0
	queue_redraw()

func _on_body_entered(body: Node2D) -> void:
	if body is CongaPlayer2D:
		var p = body as CongaPlayer2D
		if p.my_chain.size() > 0:
			var count = p.clear_chain_for_banking()
			var earned_pts = CongaGameManager.bank_mannequins(p.player_id, count)
			
			floating_text = "+%d ĐIỂM!" % earned_pts
			text_alpha = 1.0
			text_y_offset = 0.0
			
			# Nhún nảy bục nạp điểm
			scale = Vector2(1.25, 1.25)
			var tw = create_tween()
			tw.tween_property(self, "scale", Vector2.ONE, 0.3)

func _draw() -> void:
	# Vòng tròn ánh sáng vàng kim
	draw_circle(Vector2.ZERO, 54.0, Color(1.0, 0.85, 0.2, 0.25))
	draw_arc(Vector2.ZERO, 52.0, 0, TAU, 32, Color(1.0, 0.85, 0.2), 3.5)
	
	# Biểu tượng chiếc két/ngôi sao xoay tròn
	draw_circle(Vector2.ZERO, 28.0, Color(1.0, 0.75, 0.1))
	draw_arc(Vector2.ZERO, 28.0, anim_angle, anim_angle + TAU * 0.75, 16, Color(1.0, 0.95, 0.5), 3.0)
	
	draw_string(ThemeDB.fallback_font, Vector2(-28, 6), "NẠP ĐIỂM", HORIZONTAL_ALIGNMENT_CENTER, -1, 14, Color.BLACK)

	# Chữ bay cộng điểm
	if text_alpha > 0.0:
		var text_color = Color(1.0, 0.9, 0.1, text_alpha)
		draw_string(ThemeDB.fallback_font, Vector2(-40, -40 + text_y_offset), floating_text, HORIZONTAL_ALIGNMENT_CENTER, -1, 20, text_color)
