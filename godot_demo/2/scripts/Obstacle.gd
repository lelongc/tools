extends Area3D
class_name Obstacle

@export var max_hp: float = 20.0
@export var score_reward: int = 50
@export var obstacle_name: String = "BARREL"

var current_hp: float = 20.0
var is_destroyed: bool = false

@onready var label: Label3D = $Label3D
@onready var mesh: MeshInstance3D = $MeshInstance3D

func _ready() -> void:
	current_hp = max_hp
	body_entered.connect(_on_body_entered)
	update_label()

func update_label() -> void:
	if label:
		label.text = "%d" % int(ceil(current_hp))
		if current_hp <= max_hp * 0.3:
			label.modulate = Color(1.0, 0.3, 0.3)
		else:
			label.modulate = Color.WHITE

func take_hit(damage: float) -> void:
	if is_destroyed:
		return
	
	current_hp -= damage
	update_label()
	
	# Hieu ung nhap nhay khi bi ban
	var tw = create_tween()
	tw.tween_property(mesh, "scale", Vector3(1.15, 0.9, 1.15), 0.04)
	tw.tween_property(mesh, "scale", Vector3.ONE, 0.06)
	
	if current_hp <= 0:
		destroy_obstacle()

func destroy_obstacle() -> void:
	is_destroyed = true
	
	# Cong diem cho Player
	var game_manager = get_tree().root.find_child("GameManager", true, false)
	if game_manager and game_manager.has_method("add_score"):
		game_manager.add_score(score_reward)
	
	# Hieu ung vo vun
	var tw = create_tween()
	tw.set_parallel(true)
	tw.tween_property(self, "scale", Vector3(0.01, 0.01, 0.01), 0.12)
	tw.tween_property(self, "position:y", position.y + 0.8, 0.12)
	tw.chain().tween_callback(queue_free)

func _on_body_entered(body: Node3D) -> void:
	if is_destroyed:
		return
	
	if body.has_method("take_obstacle_damage"):
		body.take_obstacle_damage(current_hp)
		destroy_obstacle()
