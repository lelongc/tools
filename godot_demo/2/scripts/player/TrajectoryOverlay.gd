extends Node2D
class_name TrajectoryOverlay

var sim_points: Array[Vector2] = []
var has_impact: bool = false
var impact_pos: Vector2 = Vector2.ZERO
var impact_normal: Vector2 = Vector2.UP
var impact_is_monster_or_tnt: bool = false
var active_color: Color = Color(1.0, 0.85, 0.20, 0.95)
var pull_tension: float = 0.0

func _draw() -> void:
	if not visible or sim_points.size() < 2: return

	var local_points: PackedVector2Array = []
	for p in sim_points:
		local_points.append(to_local(p))

	if local_points.size() < 2: return

	# 0. Thước đo lực kéo ná (Slingshot Tension Gauge Arc)
	if pull_tension > 0.05:
		var origin_p = local_points[0]
		var gauge_r = 26.0
		var gauge_span = clamp(pull_tension, 0.05, 1.0) * (PI * 0.75)
		var center_a = (local_points[1] - local_points[0]).angle() if local_points.size() >= 2 else (PI * 0.5)
		var start_a = center_a - gauge_span
		var end_a = center_a + gauge_span

		# Vòng cung nền mờ 180 độ
		draw_arc(origin_p, gauge_r, center_a - PI * 0.75, center_a + PI * 0.75, 24, Color(1, 1, 1, 0.15), 2.5, true)

		# Vòng cung năng lượng đổi màu theo lực
		var gauge_col = Color(0.25, 0.92, 0.65, 0.95)
		if pull_tension > 0.75:
			gauge_col = Color(1.0, 0.28, 0.32, 1.0)
		elif pull_tension > 0.40:
			gauge_col = Color(1.0, 0.82, 0.18, 0.95)

		draw_arc(origin_p, gauge_r, start_a, end_a, 24, gauge_col, 3.5, true)

		# Hai đầu hạt ngọc báo giới hạn lực
		var p_left = origin_p + Vector2(cos(start_a), sin(start_a)) * gauge_r
		var p_right = origin_p + Vector2(cos(end_a), sin(end_a)) * gauge_r
		draw_circle(p_left, 3.0, Color.WHITE)
		draw_circle(p_right, 3.0, Color.WHITE)

	# 1. Đường vệt phát sáng mờ dẫn đường (Soft Glow Polyline)
	var glow_col = Color(active_color.r, active_color.g, active_color.b, 0.24)
	draw_polyline(local_points, glow_col, 3.2, true)

	# 2. Hạt ngọc năng lượng chuyển động dòng chảy (Flowing Energy Beads)
	var spacing = 22.0
	var phase = fmod(Time.get_ticks_msec() * 0.045, spacing)

	var seg_lengths: Array[float] = []
	var total_len = 0.0
	for i in range(local_points.size() - 1):
		var l = (local_points[i + 1] - local_points[i]).length()
		seg_lengths.append(l)
		total_len += l

	if total_len > 12.0:
		var d = phase
		while d < total_len - 6.0:
			var pt = _get_point_at_distance(local_points, seg_lengths, d)
			var ratio = d / total_len
			var bead_rad = lerp(3.2, 5.2, ratio)
			var alpha = clamp(ratio * 2.2, 0.35, 1.0)

			# Quầng sáng ngoài
			var halo_col = Color(active_color.r, active_color.g, active_color.b, 0.35 * alpha)
			draw_circle(pt, bead_rad + 2.0, halo_col)
			# Hạt màu chủ đạo
			var dot_col = Color(active_color.r, active_color.g, active_color.b, 0.95 * alpha)
			draw_circle(pt, bead_rad, dot_col)
			# Điểm sáng lõi trắng
			draw_circle(pt + Vector2(-0.7, -0.7), bead_rad * 0.42, Color(1.0, 1.0, 1.0, 0.90 * alpha))
			d += spacing

	# 3. Tâm ngắm tiếp đất động (Animated Ground / Target Reticle)
	if has_impact:
		var lp = to_local(impact_pos)
		var time_sec = Time.get_ticks_msec() * 0.001
		var pulse = sin(time_sec * 8.0)
		var reticle_r = 15.0 + pulse * 2.0

		# Vùng bóng tiếp đất
		var ground_shadow_col = Color(active_color.r, active_color.g, active_color.b, 0.28)
		draw_circle(lp, reticle_r + 2.0, ground_shadow_col)

		# Vòng tròn tâm ngắm
		draw_arc(lp, reticle_r, 0, TAU, 32, active_color, 2.5, true)

		# Điểm hồng tâm trắng
		draw_circle(lp, 3.5, Color.WHITE)
		draw_circle(lp, 1.8, active_color)

		# 4 vạch ngắm chữ thập (Crosshair Ticks)
		var tick_dist = reticle_r + 3.0
		var tick_len = 6.0
		draw_line(lp + Vector2(0, -tick_dist), lp + Vector2(0, -tick_dist - tick_len), active_color, 2.0, true)
		draw_line(lp + Vector2(0, tick_dist), lp + Vector2(0, tick_dist + tick_len), active_color, 2.0, true)
		draw_line(lp + Vector2(-tick_dist, 0), lp + Vector2(-tick_dist - tick_len, 0), active_color, 2.0, true)
		draw_line(lp + Vector2(tick_dist, 0), lp + Vector2(tick_dist + tick_len, 0), active_color, 2.0, true)

		# Nếu đang ngắm trúng Quái vật hoặc Thùng thuốc nổ -> Thêm viền cảnh báo nguy hiểm (Hazard Diamond)
		if impact_is_monster_or_tnt:
			var d_size = 9.0 + pulse * 1.5
			var warn_col = Color(1.0, 0.2, 0.2, 0.85)
			var d_pts = PackedVector2Array([
				lp + Vector2(0, -d_size),
				lp + Vector2(d_size, 0),
				lp + Vector2(0, d_size),
				lp + Vector2(-d_size, 0),
				lp + Vector2(0, -d_size)
			])
			draw_polyline(d_pts, warn_col, 2.0, true)

func _get_point_at_distance(pts: PackedVector2Array, lengths: Array[float], target_d: float) -> Vector2:
	var accum = 0.0
	for i in range(lengths.size()):
		var l = lengths[i]
		if accum + l >= target_d:
			var seg_t = (target_d - accum) / max(l, 0.001)
			return pts[i].lerp(pts[i + 1], seg_t)
		accum += l
	return pts[-1]
