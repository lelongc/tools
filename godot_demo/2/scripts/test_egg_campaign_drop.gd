extends Node

func _ready() -> void:
	print("=== SIMULATING EGG DROP IN CAMPAIGN LEVEL ===")

	var level_scene = load("res://scenes/levels/CampaignLevel.tscn")
	var level = level_scene.instantiate()
	add_child(level)

	# Wait for level to initialize and settle
	for f in range(20):
		await get_tree().physics_frame

	var chicken = level.get_node("ChickenBomber")
	chicken.position = Vector2(270, 110)

	print("Dropping egg straight down at x=270...")
	# Simulate dropping an egg straight down
	chicken._drop_egg(Vector2(0, 480.0))

	# Find the spawned egg
	var egg = null
	for child in level.get_children():
		if child is RigidBody2D and child != chicken and child.name.contains("Egg"):
			egg = child
			break

	if not egg:
		# Maybe egg was added to parent or level
		for child in get_children():
			if child is RigidBody2D and child != chicken and child != level:
				egg = child
				break

	print("Spawned egg: ", egg)
	if egg:
		print("Egg pos: ", egg.global_position, " vel: ", egg.linear_velocity)

	# Monitor for 120 frames
	var impact_count = 0
	for f in range(120):
		await get_tree().physics_frame
		if egg and is_instance_valid(egg):
			if f % 10 == 0:
				print("Frame ", f, " -> Egg at y=", egg.global_position.y, " vel_y=", egg.linear_velocity.y, " freeze=", egg.freeze)
			if egg.bounces > impact_count:
				impact_count = egg.bounces
				print("Frame ", f, " -> Egg BOUNCE #", impact_count, " at pos=", egg.global_position, " vel=", egg.linear_velocity)

	print("Finished simulation. Total bounces: ", impact_count)
	get_tree().quit(0)
