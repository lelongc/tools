extends Area3D

@export var score_value: int = 100
@export var neck_bonus: float = 0.5
@export var item_name: String = "GOLDEN_APPLE"

var is_collected: bool = false

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)

func _process(delta: float) -> void:
	if not is_collected:
		rotation.y += 3.0 * delta

func _on_body_entered(body: Node3D) -> void:
	trigger_collect(body)

func _on_area_entered(area: Area3D) -> void:
	trigger_collect(area)

func trigger_collect(collector: Node) -> void:
	if is_collected:
		return
		
	var player = null
	if collector is CharacterBody3D and collector.name == "Player":
		player = collector
	elif collector.get_parent() is CharacterBody3D and collector.get_parent().name == "Player":
		player = collector.get_parent()
	elif collector.owner and collector.owner.name == "Player":
		player = collector.owner

	if is_instance_valid(player) and player.has_method("eat_fruit"):
		is_collected = true
		player.eat_fruit(neck_bonus, score_value)
		
		var tw = create_tween()
		tw.set_parallel(true)
		tw.tween_property(self, "scale", Vector3(1.6, 1.6, 1.6), 0.1)
		tw.tween_property(self, "position:y", position.y + 0.8, 0.1)
		tw.chain().tween_callback(queue_free)
