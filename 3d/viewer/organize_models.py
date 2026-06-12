import os
import shutil
import re

SOURCE_DIR = r"d:\folder\tools\3d\all"
TARGET_DIR = r"d:\folder\tools\3d\viewer\assets\models"
MD_FILE = r"d:\folder\tools\3d\viewer\model_list.md"

# Format: (Search term, Target category, Target filename standard)
mapping = [
    ("cat.fbx", "characters", "cat_player.fbx"),
    ("catskin.png", "characters", "catskin.png"),
    ("chair.glb", "furniture", "chair_wooden.glb"),
    ("couch.glb", "furniture", "sofa_old.glb"),
    ("fridge.glb", "kitchen", "fridge.glb"),
    ("shelf.glb", "furniture", "bookshelf.glb"),
    ("Single Bed.fbx_Scene.fbx", "bedroom", "bed_single.fbx"),
    ("Bed_Double.fbx.fbx", "bedroom", "bed_double.fbx"),
    ("Dresser.fbx_Scene.fbx", "furniture", "dresser.fbx"),
    ("Cupboard.fbx_Scene.fbx", "furniture", "wardrobe.fbx"),
    ("Stove.fbx_Scene.fbx", "kitchen", "stove.fbx"),
    ("Kitchen_Sink.fbx_Scene.fbx", "kitchen", "kitchen_sink.fbx"),
    ("Microwave.fbx_Scene.fbx", "kitchen", "microwave.fbx"),
    ("Bathtub.fbx_Scene.fbx", "bathroom", "bathtub.fbx"),
    ("Toilet.fbx_Scene.fbx", "bathroom", "toilet.fbx"),
    ("BathroomSink.fbx_Scene.fbx", "bathroom", "sink.fbx"),
    ("TV.fbx_Scene.fbx", "props", "tv_crt.fbx"),
    ("Small_Tablefbx.fbx_Scene.fbx", "furniture", "table_old.fbx"),
    ("FloorLamp.fbx_Scene.fbx", "lighting", "floor_lamp.fbx"),
]

# Ensure target directories exist
categories = ["furniture", "props", "doors", "lighting", "kitchen", "bathroom", "bedroom", "horror", "characters", "environment", "interactive"]
for cat in categories:
    os.makedirs(os.path.join(TARGET_DIR, cat), exist_ok=True)

copied_models = []

def find_file_recursive(root_dir, filename):
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            if f.lower() == filename.lower():
                return os.path.join(dirpath, f)
    return None

for src, cat, target in mapping:
    # Try with .fbx, if not found, try .glb
    search_names = [src]
    if src.endswith('.fbx'):
        search_names.append(src.replace('.fbx', '.glb'))
        
    src_path = None
    for name in search_names:
        found = find_file_recursive(SOURCE_DIR, name)
        if found:
            src_path = found
            if name.endswith('.glb'):
                target = target.replace('.fbx', '.glb')
            break
            
    if src_path:
        target_path = os.path.join(TARGET_DIR, cat, target)
        
        # Also copy texture folder if it exists next to source
        src_dir = os.path.dirname(src_path)
        for item in os.listdir(src_dir):
            if item.endswith('.fbm') or item == 'textures':
                tex_dir = os.path.join(src_dir, item)
                if os.path.isdir(tex_dir):
                    target_tex = os.path.join(TARGET_DIR, cat, item)
                    if not os.path.exists(target_tex):
                        shutil.copytree(tex_dir, target_tex)
            # Copy texture files in the same dir
            elif item.endswith('.png') or item.endswith('.jpg'):
                src_img = os.path.join(src_dir, item)
                dest_img = os.path.join(TARGET_DIR, cat, item)
                if not os.path.exists(dest_img):
                    shutil.copy2(src_img, dest_img)
        
        shutil.copy2(src_path, target_path)
        print(f"Copied {os.path.basename(src_path)} to {cat}/{target}")
        
        # Strip extension for matching in markdown
        base_name = os.path.splitext(target)[0]
        copied_models.append(base_name)
    else:
        print(f"File not found: {src_path}")

# Update markdown file
with open(MD_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

for model_base in copied_models:
    # Look for the row with this model name
    # e.g. | 1 | Bàn gỗ cũ | `table_old.glb` | ...
    pattern = re.compile(r'(\|.*?\|\s*)([^|]+?)(\s*\|\s*)`' + re.escape(model_base) + r'\.(glb|fbx)`(\s*\|)')
    
    def repl(m):
        # Add a checkmark to the name column
        name_col = m.group(2)
        if "✅" not in name_col:
            name_col = name_col.strip() + " ✅"
        return f"{m.group(1)}{name_col}{m.group(3)}`{model_base}.{m.group(4)}`{m.group(5)}"
        
    content = pattern.sub(repl, content)

with open(MD_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("Markdown file updated.")
