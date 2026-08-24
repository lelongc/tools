extends Area3D
class_name Boss

signal boss_defeated
signal boss_won

@export var max_hp: float = 350.0
@export var boss_name: String = "CYBER TITAN BOSS"

var current_hp: float = 350.0
var is_dead: bool = false
var is_fighting: bool = false

@onready var label: Label3D = $Label3D
@onready var boss_body: MeshInstance3D = $BossBody
@onready var boss_head: MeshInstance3D = $BossBody/BossHead

func _ready() -> void:
	current_hp = max_hp
	update_hp_display()

func update_hp_display() -> void:
	if label:
		label.text = "BOSS HP: %d / %d" % [int(max(0, current_hp)), int(max_hp)]

func start_boss_fight() -> void:
	is_fighting = true
	# Animation gầm thét khi bắt đầu đánh nhau
	var tw = create_tween()
	tw.tween_property(self, "scale", Vector3(1.3, 1.3, 1.3), 0.3)
	tw.tween_property(self, "scale", Vector3.ONE, 0.2)

func take_hit(damage: float) -> void:
	if is_dead:
		return
	
	current_hp -= damage
	update_hp_display()
	
	# Hiệu ứng rung lắc khi bị bắn
	var tw = create_tween()
	var offset_x = randf_range(-0.15, 0.15)
	tw.tween_property(boss_body, "position:x", offset_x, 0.03)
	tw.tween_property(boss_body, "position:x", 0.0, 0.03)
	
	if current_hp <= 0:
		die()

func die() -> void:
	is_dead = true
	label.text = "💥 VICTORY! 💥"
	label.modulate = Color(1.0, 0.85, 0.1)
	
	# Hiệu ứng nổ tung hoành tráng
	var tw = create_tween()
	tw.set_parallel(true)
	tw.tween_property(boss_body, "position:y", boss_body.position.y - 2.0, 0.6)
	tw.tween_property(boss_body, "scale", Vector3.ZERO, 0.6)
	tw.tween_property(self, "rotation_degrees:y", 360.0, 0.6)
	tw.chain().tween_callback(func():
		boss_defeated.emit()
		queue_free()
	)

func attack_player() -> void:
	# Đòn đánh dập nát người chơi khi người chơi không đủ sát thương (Rage Bait Fail)
	var tw = create_tween()
	tw.tween_property(self, "position:y", position.y + 2.0, 0.2)
	tw.tween_property(self, "position:y", position.y - 1.0, 0.15)
	tw.tween_callback(func():
		boss_won.emit()
	)
