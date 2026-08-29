extends Node

# SkinManager: Quản lý danh mục Skin và hỗ trợ đa ngôn ngữ Tiếng Việt

signal skin_changed(skin_id: String)

var skins_catalog: Dictionary = {
	"classic_giraffe": {
		"id": "classic_giraffe",
		"name_key": "SKIN_1",
		"price": 0,
		"color_skin": Color(1.0, 0.75, 0.1),
		"color_spots": Color(0.4, 0.2, 0.08),
		"metallic": 0.0,
		"roughness": 0.35,
		"emission": Color(0, 0, 0),
		"tex_path": "res://textures/giraffe_skin.png"
	},
	"cyber_brachio": {
		"id": "cyber_brachio",
		"name_key": "SKIN_2",
		"price": 500,
		"color_skin": Color(0.1, 0.8, 0.9),
		"color_spots": Color(0.8, 0.1, 0.9),
		"metallic": 0.6,
		"roughness": 0.2,
		"emission": Color(0.05, 0.6, 0.8),
		"tex_path": "res://textures/cyber_skin.png"
	},
	"pink_flamingo": {
		"id": "pink_flamingo",
		"name_key": "SKIN_3",
		"price": 800,
		"color_skin": Color(1.0, 0.4, 0.7),
		"color_spots": Color(1.0, 0.2, 0.4),
		"metallic": 0.1,
		"roughness": 0.3,
		"emission": Color(0, 0, 0),
		"tex_path": "res://textures/flamingo_skin.png"
	},
	"king_gold": {
		"id": "king_gold",
		"name_key": "SKIN_4",
		"price": 1500,
		"color_skin": Color(1.0, 0.84, 0.1),
		"color_spots": Color(0.9, 0.7, 0.05),
		"metallic": 0.95,
		"roughness": 0.12,
		"emission": Color(0.4, 0.3, 0.0),
		"tex_path": "res://textures/gold_skin.png"
	}
}

func get_skin_data(skin_id: String) -> Dictionary:
	return skins_catalog.get(skin_id, skins_catalog["classic_giraffe"])

func load_texture(res_path: String) -> Texture2D:
	if res_path == "" or res_path == null:
		return null
	if ResourceLoader.exists(res_path):
		var tex = load(res_path)
		if tex and tex is Texture2D:
			return tex
	var abs_p = ProjectSettings.globalize_path(res_path)
	if FileAccess.file_exists(abs_p):
		var img = Image.load_from_file(abs_p)
		if img:
			return ImageTexture.create_from_image(img)
	return null

func apply_skin_to_node(target_node: Node3D, skin_id: String) -> void:
	var skin = get_skin_data(skin_id)
	var mat = StandardMaterial3D.new()
	mat.albedo_color = skin["color_skin"]
	mat.metallic = skin["metallic"]
	mat.roughness = skin["roughness"]
	
	if skin["emission"] != Color(0, 0, 0):
		mat.emission_enabled = true
		mat.emission = skin["emission"]
		mat.emission_energy_multiplier = 1.5
		
	if skin["tex_path"] != "":
		var tex = load_texture(skin["tex_path"])
		if tex:
			mat.albedo_texture = tex
			mat.uv1_scale = Vector3(2.0, 2.0, 2.0)
				
	var body_m = target_node.get_node_or_null("BodyMesh")
	var neck_m = target_node.get_node_or_null("NeckMesh")
	var head_m = target_node.get_node_or_null("HeadRoot/HeadMesh")
	
	if body_m: body_m.material_override = mat
	if head_m: head_m.material_override = mat
	
	# Neck dùng riêng một bản sao material để tự động co giãn UV theo chiều dài cổ (không kéo dãn đốm/texture)
	if neck_m:
		var neck_mat = mat.duplicate() as StandardMaterial3D
		var current_h = target_node.get("current_neck_height")
		if current_h == null: current_h = 1.5
		neck_mat.uv1_scale = Vector3(2.0, max(0.1, current_h) * 2.0, 2.0)
		neck_m.material_override = neck_mat
	
	skin_changed.emit(skin_id)
