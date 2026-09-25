extends Node
func _ready():
    var scn = load('res://scenes/prefabs/GameHUD.tscn')
    print('SCN LOADED:', scn)
    if scn:
        var inst = scn.instantiate()
        print('INST:', inst, 'HAS METHOD:', inst.has_method('handle_back_button'))
        inst.free()
    get_tree().quit()
