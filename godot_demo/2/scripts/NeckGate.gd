extends Area3D
class_name NeckGate

enum GateType {
	ADD,   # + mét cổ
	MULT,  # x lần cổ
	SUB    # - mét cổ
}

@export var gate_type: GateType = GateType.ADD
@export var value: float = 2.0
@export var is_moving: bool = false
@export var move_speed: float = 2.5
@export var move_distance: float = 2.2

var is_activated: bool = false
var initial_x: float = 0.0
var move_dir: float = 1.0

@onready var label: Label3D = $Label3D
@onready var glass_mesh: MeshInstance3D = $GlassMesh

func _ready() -> void:
	initial_x = position.x
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)
	update_visuals()

func _physics_process(delta: float) -> void:
	if is_moving and not is_activated:
		position.x += move_dir * move_speed * delta
		if abs(position.x - initial_x) >= move_distance:
			move_dir *= -1.0

func is_positive() -> bool:
	return gate_type != GateType.SUB and value >= 0

func update_visuals() -> void:
	var text_content = ""
	var color = Color(0.1, 0.9, 0.4)
	
	match gate_type:
		GateType.ADD:
			text_content = "+%.1fm CỔ DÀI" % value
		GateType.MULT:
			text_content = "x%.1f CỔ DÀI" % value
		GateType.SUB:
			text_content = "-%.1fm CỔ NGẮN" % abs(value)
			color = Color(1.0, 0.2, 0.2)
			
	if label:
		label.text = text_content
		
	if glass_mesh:
		var mat = StandardMaterial3D.new()
		if is_positive() and ResourceLoader.exists("res://textures/gate_bonus.png"):
			mat.albedo_texture = load("res://textures/gate_bonus.png")
			mat.albedo_color = Color(1.0, 1.0, 1.0, 0.9)
			mat.emission_enabled = true
			mat.emission_texture = load("res://textures/gate_bonus.png")
			mat.emission_energy_multiplier = 1.8
		else:
			mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
			mat.albedo_color = Color(color.r, color.g, color.b, 0.6)
			mat.emission_enabled = true
			mat.emission = color
			mat.emission_energy_multiplier = 2.5
		mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		glass_mesh.material_override = mat

func _on_body_entered(body: Node3D) -> void:
	trigger_gate(body)

func _on_area_entered(area: Area3D) -> void:
	trigger_gate(area)

func trigger_gate(node: Node) -> void:
	if is_activated:
		return
		
	var player = null
	if node is CharacterBody3D and node.name == "Player":
		player = node
	elif node.get_parent() is CharacterBody3D and node.get_parent().name == "Player":
		player = node.get_parent()
	elif node.owner and node.owner.name == "Player":
		player = node.owner
		
	if is_instance_valid(player) and player.has_method("apply_neck_gate"):
		is_activated = true
		var val = value
		if gate_type == GateType.SUB:
			val = -abs(value)
		elif gate_type == GateType.MULT:
			var curr = player.get("current_max_height")
			val = (curr * value) - curr
			
		player.apply_neck_gate(val)
		
		var tw = create_tween()
		tw.tween_property(self, "scale", Vector3.ZERO, 0.12)
		tw.tween_callback(queue_free)
