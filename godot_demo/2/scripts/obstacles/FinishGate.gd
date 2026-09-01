extends Area2D

signal team_victory()

var p1_in: bool = false
var p2_in: bool = false
var is_cleared: bool = false

@onready var confetti_left: CPUParticles2D = get_node_or_null("ConfettiLeft")
@onready var confetti_right: CPUParticles2D = get_node_or_null("ConfettiRight")
@onready var banner: Node2D = get_node_or_null("Banner")

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node2D) -> void:
	if is_cleared: return
	if body is CharacterBody2D:
		if "player_id" in body:
			if body.player_id == 1: p1_in = true
			elif body.player_id == 2: p2_in = true

		_check_victory()

func _on_body_exited(body: Node2D) -> void:
	if is_cleared: return
	if body is CharacterBody2D:
		if "player_id" in body:
			if body.player_id == 1: p1_in = false
			elif body.player_id == 2: p2_in = false

func _check_victory() -> void:
	if p1_in and p2_in and not is_cleared:
		is_cleared = true
		team_victory.emit()

		if confetti_left: confetti_left.emitting = true
		if confetti_right: confetti_right.emitting = true

		if banner:
			var tween = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
			tween.tween_property(banner, "scale", Vector2(1.25, 1.25), 0.3)
