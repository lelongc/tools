extends Node3D
class_name ConfettiCannon

@onready var particles_left: GPUParticles3D = get_node_or_null("ParticlesLeft")
@onready var particles_right: GPUParticles3D = get_node_or_null("ParticlesRight")

func fire() -> void:
	if particles_left:
		particles_left.emitting = true
	if particles_right:
		particles_right.emitting = true
