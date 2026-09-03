extends Node

func _ready() -> void:
	print("=== TESTING EGG DIRECT DROP ONTO BLOCK ===")

	var block_scene = load("res://scenes/prefabs/DestructibleBlock.tscn")
	var block = block_scene.instantiate()
	block.position = Vector2(200, 300)
	block.material_type = "wood"
	block.block_size = Vector2(160, 24)
	add_child(block)
	block.wake_up()
	block.spawn_settle_timer = 0.0

	var egg_scene = load("res://scenes/prefabs/NormalEgg.tscn")
	var egg = egg_scene.instantiate()
	egg.position = Vector2(200, 100)
	egg.linear_velocity = Vector2(0, 500)
	add_child(egg)

	print("Block initial HP: ", block.current_health)

	# Simulate physics frames until collision
	for f in range(60):
		await get_tree().physics_frame
		if egg.bounces > 0:
			print("Frame ", f, " -> Collision occurred!")
			print("Egg linear_velocity at bounce: ", egg.linear_velocity, " length=", egg.linear_velocity.length())
			print("Block HP after impact: ", block.current_health)
			break

	get_tree().quit(0)
