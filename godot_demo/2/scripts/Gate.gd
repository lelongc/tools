extends Area3D
class_name Gate

enum GateType {
	FIRE_RATE_ADD,      # + Tốc độ bắn
	FIRE_RATE_MULT,     # x Tốc độ bắn
	FIRE_RATE_SUB,      # - Tốc độ bắn
	BULLET_COUNT_ADD,   # + Số nòng/tia đạn
	BULLET_COUNT_MULT,  # x Số tia đạn
	POWER_ADD           # + Sát thương đạn
}

@export var gate_type: GateType = GateType.FIRE_RATE_ADD
@export var value: float = 3.0
@export var is_moving: bool = false
@export var move_speed: float = 2.5
@export var move_distance: float = 2.2

var is_activated: bool = false
var initial_x: float = 0.0
var move_dir: float = 1.0

@onready var label: Label3D = $Label3D
@onready var glass_mesh: MeshInstance3D = $GlassMesh
@onready var frame_mesh: MeshInstance3D = $FrameMesh

func _ready() -> void:
	initial_x = position.x
	body_entered.connect(_on_body_entered)
	update_visuals()

func _physics_process(delta: float) -> void:
	if is_moving and not is_activated:
		position.x += move_dir * move_speed * delta
		if abs(position.x - initial_x) >= move_distance:
			move_dir *= -1.0
			position.x = initial_x + sign(position.x - initial_x) * move_distance

func is_positive() -> bool:
	return gate_type != GateType.FIRE_RATE_SUB and value >= 0

func update_visuals() -> void:
	var text_content = ""
	var color = Color(0.1, 0.9, 0.4) # Xanh lá / Positive
	
	match gate_type:
		GateType.FIRE_RATE_ADD:
			text_content = "+%d TỐC BẮN" % int(value)
		GateType.FIRE_RATE_MULT:
			text_content = "x%.1f TỐC BẮN" % value
		GateType.FIRE_RATE_SUB:
			text_content = "-%d TỐC BẮN" % int(abs(value))
			color = Color(1.0, 0.2, 0.2) # Đỏ / Negative
		GateType.BULLET_COUNT_ADD:
			text_content = "+%d ĐẠN" % int(value)
		GateType.BULLET_COUNT_MULT:
			text_content = "x%d ĐẠN" % int(value)
		GateType.POWER_ADD:
			text_content = "+%d SỨC MẠNH" % int(value)
	
	if not is_positive():
		color = Color(1.0, 0.2, 0.2)
	
	if label:
		label.text = text_content
		label.modulate = Color.WHITE
		label.outline_modulate = Color.BLACK
	
	if glass_mesh:
		var mat = StandardMaterial3D.new()
		mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		mat.albedo_color = Color(color.r, color.g, color.b, 0.45)
		mat.emission_enabled = true
		mat.emission = color
		mat.emission_energy_multiplier = 2.0
		mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		glass_mesh.material_override = mat

func take_hit(_damage: float) -> void:
	if is_activated:
		return
	
	# Cơ chế Rage-Bait: Bắn vào cổng để tăng giá trị (được giới hạn hợp lý tránh tràn số)
	match gate_type:
		GateType.FIRE_RATE_ADD:
			value = clamp(value + 0.25, 1.0, 25.0)
		GateType.FIRE_RATE_MULT:
			value = clamp(value + 0.05, 1.1, 2.5)
		GateType.FIRE_RATE_SUB:
			value += 0.5
			if value >= 0:
				gate_type = GateType.FIRE_RATE_ADD
				value = max(1.0, value)
		GateType.BULLET_COUNT_ADD:
			value = clamp(value + 0.1, 1.0, 4.0)
		GateType.BULLET_COUNT_MULT:
			value = clamp(value + 0.05, 1.0, 2.0)
		GateType.POWER_ADD:
			value = clamp(value + 0.5, 5.0, 40.0)
			
	update_visuals()
	
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3(1.15, 1.15, 1.15), 0.04)
	tw.tween_property(self, "scale", Vector3.ONE, 0.06)

func _on_body_entered(body: Node3D) -> void:
	if is_activated:
		return
	
	if body.has_method("apply_gate_modifier"):
		is_activated = true
		body.apply_gate_modifier(int(gate_type), value)
		
		var tw = create_tween()
		tw.tween_property(self, "scale", Vector3.ZERO, 0.12)
		tw.tween_callback(queue_free)
