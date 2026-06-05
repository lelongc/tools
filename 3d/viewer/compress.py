import json
import base64
import io
from PIL import Image
import gc

SAVE_FILE = "save.json"

def compress_save():
    print("Đang đọc file save.json (có thể mất chút thời gian vì file lớn)...")
    with open(SAVE_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Nếu đã convert rồi thì bỏ qua
    if data.get("schema_version") == 2:
        print("File đã được tối ưu hóa từ trước!")
        return

    print("Đã tải xong, đang xử lý nén...")
    
    new_data = {
        "schema_version": 2,
        "texture_dict": {},
        "objects": {}
    }
    
    reverse_dict = {}
    tex_counter = 0

    for obj_id, obj_data in data.items():
        new_obj = {
            "position": obj_data.get("position"),
            "rotation": obj_data.get("rotation"),
            "textures": {}
        }
        
        textures = obj_data.get("textures", {})
        for path_str, path_data in textures.items():
            new_path_data = {
                "faces": {},
                "uvs": path_data.get("uvs", {})
            }
            
            faces = path_data.get("faces", {})
            for face_idx, b64_url in faces.items():
                if not b64_url.startswith("data:image"):
                    continue
                
                header, encoded = b64_url.split(",", 1)
                
                # Deduplicate and compress
                try:
                    img_data = base64.b64decode(encoded)
                    img = Image.open(io.BytesIO(img_data))
                    
                    # Resize if too large
                    if img.width > 256 or img.height > 256:
                        img.thumbnail((256, 256))
                    
                    # Compress to JPEG if no alpha, else WebP
                    buffer = io.BytesIO()
                    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                        img.save(buffer, format="WEBP", quality=80)
                        new_header = "data:image/webp;base64"
                    else:
                        img = img.convert("RGB")
                        img.save(buffer, format="JPEG", quality=80)
                        new_header = "data:image/jpeg;base64"
                        
                    compressed_b64 = base64.b64encode(buffer.getvalue()).decode('ascii')
                    final_url = new_header + "," + compressed_b64
                    
                except Exception as e:
                    print(f"Lỗi khi xử lý ảnh, dùng ảnh gốc: {e}")
                    final_url = b64_url
                
                # Check dictionary
                if final_url in reverse_dict:
                    tex_id = reverse_dict[final_url]
                else:
                    tex_id = f"tex_{tex_counter}"
                    tex_counter += 1
                    reverse_dict[final_url] = tex_id
                    new_data["texture_dict"][tex_id] = final_url
                
                new_path_data["faces"][face_idx] = tex_id
            
            new_obj["textures"][path_str] = new_path_data
        
        new_data["objects"][obj_id] = new_obj

    print("Đang lưu lại file...")
    with open(SAVE_FILE, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False)
        
    print(f"Thành công! Số lượng texture duy nhất: {tex_counter}")

if __name__ == '__main__':
    compress_save()
