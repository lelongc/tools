extends Node

# Hệ sinh thái Object Pool 0-Allocation chống giật lag
var projectile_scene: PackedScene
var damage_number_scene: PackedScene
var enemy_scene: PackedScene

var projectile_pool: Array[Node2D] = []
var active_projectiles: Array[Node2D] = []

var damage_number_pool: Array[Node2D] = []
var active_damage_numbers: Array[Node2D] = []

var enemy_pool: Array[CharacterBody2D] = []
var active_enemies: Array[CharacterBody2D] = []

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

func init_scenes(proj_scene: PackedScene, dmg_scene: PackedScene, enm_scene: PackedScene) -> void:
	projectile_scene = proj_scene
	damage_number_scene = dmg_scene
	enemy_scene = enm_scene

# --- PROJECTILES POOL ---
func spawn_projectile(parent: Node2D, pos: Vector2, dir: Vector2, dmg: float, elem: String, pierce: int = 1, is_crit: bool = false, crit_mult: float = 2.0) -> Node2D:
	var proj: Node2D
	if projectile_pool.is_empty():
		if projectile_scene:
			proj = projectile_scene.instantiate()
		else:
			return null
	else:
		proj = projectile_pool.pop_back()
		
	if proj.get_parent() != parent:
		if proj.get_parent():
			proj.get_parent().remove_child(proj)
		parent.add_child(proj)
		
	proj.position = pos
	proj.show()
	proj.set_process(true)
	if proj.has_method("setup"):
		proj.setup(dir, dmg, elem, pierce, is_crit, crit_mult)
	active_projectiles.append(proj)
	return proj

func recycle_projectile(proj: Node2D) -> void:
	if not active_projectiles.has(proj):
		return
	active_projectiles.erase(proj)
	proj.hide()
	proj.set_process(false)
	projectile_pool.append(proj)

# --- DAMAGE NUMBERS POOL ---
func spawn_damage_number(parent: Node2D, pos: Vector2, amount: float, is_crit: bool = false, element: String = "none") -> Node2D:
	var dmg_node: Node2D
	if damage_number_pool.is_empty():
		if damage_number_scene:
			dmg_node = damage_number_scene.instantiate()
		else:
			return null
	else:
		dmg_node = damage_number_pool.pop_back()
		
	if dmg_node.get_parent() != parent:
		if dmg_node.get_parent():
			dmg_node.get_parent().remove_child(dmg_node)
		parent.add_child(dmg_node)
		
	dmg_node.position = pos
	dmg_node.show()
	dmg_node.set_process(true)
	if dmg_node.has_method("display"):
		dmg_node.display(amount, is_crit, element)
	active_damage_numbers.append(dmg_node)
	return dmg_node

func recycle_damage_number(dmg_node: Node2D) -> void:
	if not active_damage_numbers.has(dmg_node):
		return
	active_damage_numbers.erase(dmg_node)
	dmg_node.hide()
	dmg_node.set_process(false)
	damage_number_pool.append(dmg_node)

# --- ENEMIES POOL ---
func spawn_enemy(parent: Node2D, pos: Vector2, enemy_type: String, wave: int) -> CharacterBody2D:
	var enemy: CharacterBody2D
	if enemy_pool.is_empty():
		if enemy_scene:
			enemy = enemy_scene.instantiate()
		else:
			return null
	else:
		enemy = enemy_pool.pop_back()
		
	if enemy.get_parent() != parent:
		if enemy.get_parent():
			enemy.get_parent().remove_child(enemy)
		parent.add_child(enemy)
		
	enemy.position = pos
	enemy.show()
	enemy.set_physics_process(true)
	if enemy.has_method("setup"):
		enemy.setup(enemy_type, wave)
	active_enemies.append(enemy)
	return enemy

func recycle_enemy(enemy: CharacterBody2D) -> void:
	if not active_enemies.has(enemy):
		return
	active_enemies.erase(enemy)
	enemy.hide()
	enemy.set_physics_process(false)
	enemy_pool.append(enemy)

func clear_all() -> void:
	for p in active_projectiles.duplicate():
		recycle_projectile(p)
	for d in active_damage_numbers.duplicate():
		recycle_damage_number(d)
	for e in active_enemies.duplicate():
		recycle_enemy(e)
