try:
    import bpy
    import bmesh
except ImportError:
    bpy = None
    bmesh = None
import math
import os

OUTPUT_DIR = r"d:\folder\tools\godot_demo\2\models"
TEXTURES_DIR = r"d:\folder\tools\godot_demo\2\textures"
os.makedirs(OUTPUT_DIR, exist_ok=True)

skin_tex = os.path.join(TEXTURES_DIR, "giraffe_skin.png")
danger_tex = os.path.join(TEXTURES_DIR, "danger_stripes.png")
gate_tex = os.path.join(TEXTURES_DIR, "gate_bonus.png")

def clear_all():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for block in bpy.data.meshes: bpy.data.meshes.remove(block)
    for block in bpy.data.materials: bpy.data.materials.remove(block)

def create_pbr_material(name, color=(1,1,1,1), metallic=0.0, roughness=0.4, emission=None, tex_path=None):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    
    if emission:
        try:
            bsdf.inputs["Emission Color"].default_value = emission
            bsdf.inputs["Emission Strength"].default_value = 2.5
        except:
            pass
            
    if tex_path and os.path.exists(tex_path):
        tex_node = nodes.new(type="ShaderNodeTexImage")
        tex_node.image = bpy.data.images.load(tex_path)
        links.new(tex_node.outputs["Color"], bsdf.inputs["Base Color"])
        
    return mat

def export_glb(filename):
    filepath = os.path.join(OUTPUT_DIR, filename)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"✅ EXPORTED: {filename} ({os.path.getsize(filepath)} bytes)")

# =========================================================================
# 1. GIRAFFE BODY (giraffe_body.glb)
# =========================================================================
def build_giraffe_body():
    clear_all()
    mat_skin = create_pbr_material("GiraffeSkin", color=(1.0, 0.75, 0.1, 1.0), roughness=0.35, tex_path=skin_tex)
    mat_hoof = create_pbr_material("GiraffeHoof", color=(0.35, 0.18, 0.08, 1.0), roughness=0.4)
    
    # Body
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.4))
    body = bpy.context.active_object
    body.name = "BodyMesh"
    body.scale = (0.95, 1.35, 0.75)
    bpy.ops.object.transform_apply(scale=True)
    
    bev = body.modifiers.new(name="Bevel", type="BEVEL")
    bev.width = 0.12
    bev.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    body.data.materials.append(mat_skin)
    
    # 4 Legs
    leg_coords = [(-0.35, -0.42), (0.35, -0.42), (-0.35, 0.42), (0.35, 0.42)]
    for i, (lx, ly) in enumerate(leg_coords):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.5, location=(lx, ly, 0.15))
        leg = bpy.context.active_object
        leg.data.materials.append(mat_skin)
        
        bpy.ops.mesh.primitive_cylinder_add(radius=0.135, depth=0.14, location=(lx, ly, -0.12))
        hoof = bpy.context.active_object
        hoof.data.materials.append(mat_hoof)
        
    # Tail
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.35, location=(0, 0.7, 0.35), rotation=(0.6, 0, 0))
    tail = bpy.context.active_object
    tail.data.materials.append(mat_skin)
    
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, location=(0, 0.82, 0.22))
    tail_tip = bpy.context.active_object
    tail_tip.data.materials.append(mat_hoof)
    
    # Join & UV
    bpy.ops.object.select_all(action='SELECT')
    bpy.context.view_layer.objects.active = body
    bpy.ops.object.join()
    
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66.0, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    export_glb("giraffe_body.glb")

# =========================================================================
# 2. GIRAFFE HEAD (giraffe_head.glb)
# =========================================================================
def build_giraffe_head():
    clear_all()
    mat_skin = create_pbr_material("GiraffeSkin", color=(1.0, 0.75, 0.1, 1.0), roughness=0.35, tex_path=skin_tex)
    mat_brown = create_pbr_material("GiraffeBrown", color=(0.4, 0.2, 0.08, 1.0), roughness=0.4)
    mat_eye = create_pbr_material("EyeWhite", color=(1.0, 1.0, 1.0, 1.0), roughness=0.1)
    mat_pupil = create_pbr_material("EyePupil", color=(0.04, 0.04, 0.04, 1.0), roughness=0.1)
    
    # Head block
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
    head = bpy.context.active_object
    head.name = "HeadMesh"
    head.scale = (0.75, 0.95, 0.65)
    bpy.ops.object.transform_apply(scale=True)
    
    bev = head.modifiers.new(name="Bevel", type="BEVEL")
    bev.width = 0.1
    bev.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    head.data.materials.append(mat_skin)
    
    # Snout
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.55, -0.1))
    snout = bpy.context.active_object
    snout.scale = (0.55, 0.5, 0.45)
    bpy.ops.object.transform_apply(scale=True)
    bev2 = snout.modifiers.new(name="Bevel", type="BEVEL")
    bev2.width = 0.08
    bev2.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    snout.data.materials.append(mat_brown)
    
    # Horns (Ossicones)
    for side in [-1, 1]:
        hx = side * 0.22
        bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.35, location=(hx, 0.1, 0.45), rotation=(0, side * 0.2, 0))
        horn = bpy.context.active_object
        horn.data.materials.append(mat_skin)
        
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, location=(hx + side * 0.04, 0.1, 0.64))
        tip = bpy.context.active_object
        tip.data.materials.append(mat_brown)
        
        # Ears
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(side * 0.42, 0.2, 0.28))
        ear = bpy.context.active_object
        ear.scale = (0.08, 0.15, 0.25)
        ear.rotation_euler = (0, side * 0.4, 0)
        bpy.ops.object.transform_apply(scale=True, rotation=True)
        ear.data.materials.append(mat_skin)
        
        # Googly Eyes
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(side * 0.36, -0.25, 0.35))
        eye = bpy.context.active_object
        eye.data.materials.append(mat_eye)
        
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, location=(side * 0.42, -0.37, 0.35))
        pupil = bpy.context.active_object
        pupil.data.materials.append(mat_pupil)
        
    bpy.ops.object.select_all(action='SELECT')
    bpy.context.view_layer.objects.active = head
    bpy.ops.object.join()
    
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66.0, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    export_glb("giraffe_head.glb")

# =========================================================================
# 3. GOLDEN APPLE (golden_apple.glb)
# =========================================================================
def build_golden_apple():
    clear_all()
    mat_gold = create_pbr_material("GoldenPBR", color=(1.0, 0.82, 0.05, 1.0), metallic=0.9, roughness=0.15, emission=(1.0, 0.7, 0.0, 1.0))
    mat_stem = create_pbr_material("StemBrown", color=(0.4, 0.2, 0.1, 1.0), roughness=0.5)
    mat_leaf = create_pbr_material("LeafGreen", color=(0.1, 0.9, 0.2, 1.0), roughness=0.2, emission=(0.1, 0.8, 0.2, 1.0))
    
    # Apple Body (Smooth deformed sphere)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.45, location=(0, 0, 0), segments=24, ring_count=16)
    apple = bpy.context.active_object
    apple.name = "AppleBody"
    apple.scale = (1.0, 1.0, 0.95)
    bpy.ops.object.transform_apply(scale=True)
    apple.data.materials.append(mat_gold)
    
    # Stem
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.35, location=(0, 0, 0.5), rotation=(0.15, -0.15, 0))
    stem = bpy.context.active_object
    stem.data.materials.append(mat_stem)
    
    # Leaf
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.16, 0, 0.58))
    leaf = bpy.context.active_object
    leaf.scale = (0.35, 0.18, 0.05)
    leaf.rotation_euler = (0.3, 0.4, 0.5)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    leaf.data.materials.append(mat_leaf)
    
    bpy.ops.object.select_all(action='SELECT')
    bpy.context.view_layer.objects.active = apple
    bpy.ops.object.join()
    
    export_glb("golden_apple.glb")

# =========================================================================
# 4. SPIKE TRAP (spike_trap.glb)
# =========================================================================
def build_spike_trap():
    clear_all()
    mat_hazard = create_pbr_material("HazardStripes", color=(0.95, 0.8, 0.1, 1.0), roughness=0.3, tex_path=danger_tex)
    mat_spike = create_pbr_material("SpikeMetal", color=(0.95, 0.15, 0.15, 1.0), metallic=0.9, roughness=0.15, emission=(0.9, 0.1, 0.1, 1.0))
    
    # Base
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.12))
    base = bpy.context.active_object
    base.name = "SpikeBase"
    base.scale = (7.5, 2.5, 0.24)
    bpy.ops.object.transform_apply(scale=True)
    base.data.materials.append(mat_hazard)
    
    # 5 Spikes
    for i, sx in enumerate([-2.4, -1.2, 0.0, 1.2, 2.4]):
        bpy.ops.mesh.primitive_cone_add(radius1=0.35, radius2=0.0, depth=0.95, location=(sx, 0, 0.6))
        cone = bpy.context.active_object
        cone.data.materials.append(mat_spike)
        
    bpy.ops.object.select_all(action='SELECT')
    bpy.context.view_layer.objects.active = base
    bpy.ops.object.join()
    
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66.0, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    export_glb("spike_trap.glb")

# =========================================================================
# 5. OVERHEAD GATE (overhead_gate.glb)
# =========================================================================
def build_overhead_gate():
    clear_all()
    mat_hazard = create_pbr_material("HazardStripes", color=(0.95, 0.8, 0.1, 1.0), roughness=0.3, tex_path=danger_tex)
    mat_steel = create_pbr_material("SteelPillar", color=(0.2, 0.25, 0.35, 1.0), metallic=0.85, roughness=0.2)
    
    # Crossbar
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 2.8))
    bar = bpy.context.active_object
    bar.name = "Crossbar"
    bar.scale = (8.0, 0.7, 0.9)
    bpy.ops.object.transform_apply(scale=True)
    bar.data.materials.append(mat_hazard)
    
    # Sign
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 3.8))
    sign = bpy.context.active_object
    sign.scale = (4.5, 0.2, 0.7)
    bpy.ops.object.transform_apply(scale=True)
    sign.data.materials.append(mat_hazard)
    
    # 2 Pillars
    for px in [-3.8, 3.8]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=5.5, location=(px, 0, 2.75))
        pillar = bpy.context.active_object
        pillar.data.materials.append(mat_steel)
        
    bpy.ops.object.select_all(action='SELECT')
    bpy.context.view_layer.objects.active = bar
    bpy.ops.object.join()
    
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66.0, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    export_glb("overhead_gate.glb")

# =========================================================================
# 6. FINISH TOWER (finish_tower.glb)
# =========================================================================
def build_finish_tower():
    clear_all()
    mat_base = create_pbr_material("TowerGlass", color=(0.15, 0.35, 0.85, 1.0), metallic=0.6, roughness=0.2)
    mat_gold = create_pbr_material("TrophyGold", color=(1.0, 0.85, 0.1, 1.0), metallic=0.9, roughness=0.15, emission=(1.0, 0.8, 0.0, 1.0))
    
    # 5 Tier Cylinders
    tiers = [(2.2, 1.8, 2.5), (1.8, 1.5, 5.0), (1.5, 1.3, 7.5), (1.3, 1.1, 10.0), (1.1, 0.9, 12.5)]
    for r_bot, r_top, z_center in tiers:
        bpy.ops.mesh.primitive_cylinder_add(radius=r_bot, depth=2.5, location=(0, 0, z_center))
        cyl = bpy.context.active_object
        cyl.data.materials.append(mat_base)
        
    # Trophy on top
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.7, location=(0, 0, 14.5))
    trophy = bpy.context.active_object
    trophy.data.materials.append(mat_gold)
    
    bpy.ops.object.select_all(action='SELECT')
    bpy.context.view_layer.objects.active = trophy
    bpy.ops.object.join()
    
    export_glb("finish_tower.glb")

print("🚀 BẮT ĐẦU TẠO TOÀN BỘ 3D MODELS TRONG BLENDER...")
build_giraffe_body()
build_giraffe_head()
build_golden_apple()
build_spike_trap()
build_overhead_gate()
build_finish_tower()
print("🎉 HOÀN TẤT TẠO TOÀN BỘ 3D ASSETS TRONG BLENDER!")
