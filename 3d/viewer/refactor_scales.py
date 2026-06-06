import re

with open('psx.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update Room / Cell sizes
code = code.replace('const roomHeight = 4.5;', 'const roomHeight = 3.0;')
code = code.replace('const cellSize = 4.0;', 'const cellSize = 3.0;')

# 2. Update Cat Scale
code = code.replace('new THREE.BoxGeometry(0.3, 0.25, 0.6)', 'new THREE.BoxGeometry(0.15, 0.125, 0.3)')
code = code.replace('body.position.set(0, 0.35, 0)', 'body.position.set(0, 0.175, 0)')
code = code.replace('headGroup.position.set(0, 0.45, -0.35)', 'headGroup.position.set(0, 0.225, -0.175)')
code = code.replace('new THREE.BoxGeometry(0.25, 0.25, 0.25)', 'new THREE.BoxGeometry(0.125, 0.125, 0.125)')
code = code.replace('head.position.set(0, 0.1, -0.1)', 'head.position.set(0, 0.05, -0.05)')
code = code.replace('const legGeo = new THREE.BoxGeometry(0.08, 0.2, 0.08)', 'const legGeo = new THREE.BoxGeometry(0.04, 0.1, 0.04)')
code = code.replace('const lowerLegGeo = new THREE.BoxGeometry(0.06, 0.2, 0.06)', 'const lowerLegGeo = new THREE.BoxGeometry(0.03, 0.1, 0.03)')
code = code.replace('lowerLeg.position.y = -0.1', 'lowerLeg.position.y = -0.05')
code = code.replace('const tailGeo = new THREE.BoxGeometry(0.05, 0.4, 0.05)', 'const tailGeo = new THREE.BoxGeometry(0.025, 0.2, 0.025)')
code = code.replace('tail.position.y = 0.2', 'tail.position.y = 0.1')
code = code.replace('tailGroup.position.set(0, 0.4, 0.3)', 'tailGroup.position.set(0, 0.2, 0.15)')
code = code.replace('cat.userData.body.position.y = 0.35 + Math.sin(time * 0.02 * animSpeed) * 0.01 + limpDip + landDip;', 'cat.userData.body.position.y = 0.175 + Math.sin(time * 0.02 * animSpeed) * 0.005 + limpDip + landDip;')
code = code.replace('cat.userData.head.position.y = 0.45 + Math.sin(time * 0.02 * animSpeed + 1) * 0.005 + limpDip + landDip;', 'cat.userData.head.position.y = 0.225 + Math.sin(time * 0.02 * animSpeed + 1) * 0.0025 + limpDip + landDip;')
code = code.replace('cat.userData.body.position.y = 0.35 + landDip;', 'cat.userData.body.position.y = 0.175 + landDip;')
code = code.replace('cat.userData.head.position.y = 0.45 + landDip;', 'cat.userData.head.position.y = 0.225 + landDip;')
code = code.replace('leg.position.set(-0.1, 0.2, -0.2)', 'leg.position.set(-0.05, 0.1, -0.1)')
code = code.replace('leg.position.set(0.1, 0.2, -0.2)', 'leg.position.set(0.05, 0.1, -0.1)')
code = code.replace('leg.position.set(-0.1, 0.2, 0.2)', 'leg.position.set(-0.05, 0.1, 0.1)')
code = code.replace('leg.position.set(0.1, 0.2, 0.2)', 'leg.position.set(0.05, 0.1, 0.1)')

# 3. Update Camera and Hitbox
code = code.replace('camera.position.set(0, 0.4, 2);', 'camera.position.set(0, 0.25, 2);')
code = code.replace('new THREE.Vector3(0, 0.4, 2);', 'new THREE.Vector3(0, 0.25, 2);')
code = code.replace('const radius = 0.2;', 'const radius = 0.1;')
code = code.replace('const height = 0.4;', 'const height = 0.2;')
code = code.replace('const stepH = 0.4;', 'const stepH = 0.2;')
code = code.replace('targetY = isFPSView ? (window.fpsCamPos.y - 0.1) : (window.defaultCamPos.y - 0.2);', 'targetY = isFPSView ? (window.fpsCamPos.y - 0.05) : (window.defaultCamPos.y - 0.1);')

# 4. Update Furniture Placements (Scaling down coords by 0.75, keeping logic)
def repl_addF(m):
    obj = m.group(1)
    args = m.group(2)
    parts = args.split(',')
    x = float(parts[0].strip()) * 0.75
    z = float(parts[1].strip()) * 0.75
    rest = ",".join(parts[2:]) if len(parts) > 2 else ""
    return f"addF({obj}, {x}, {z}{',' + rest if rest else ''});"

code = re.sub(r'addF\(([^,]+),\s*(-?[\d\.]+)\s*,\s*(-?[\d\.]+)[^\)]*\);', repl_addF, code)

# 5. Fix Furniture Scale Functions
code = code.replace('new THREE.BoxGeometry(2.0, 0.1, 2.0)', 'new THREE.BoxGeometry(1.2, 0.05, 0.8)') # Table
code = code.replace('top.position.y = 1.2', 'top.position.y = 0.75')
code = code.replace('new THREE.BoxGeometry(0.1, 1.2, 0.1)', 'new THREE.BoxGeometry(0.05, 0.75, 0.05)') # Table Legs
code = code.replace('leg.position.y = 0.6', 'leg.position.y = 0.375')
code = code.replace('pos[0], 0.6, pos[1]', 'pos[0], 0.375, pos[1]')
# Chair
code = code.replace('new THREE.BoxGeometry(0.8, 0.1, 0.8)', 'new THREE.BoxGeometry(0.4, 0.05, 0.4)')
code = code.replace('seat.position.y = 0.6', 'seat.position.y = 0.45')
code = code.replace('new THREE.BoxGeometry(0.1, 0.6, 0.1)', 'new THREE.BoxGeometry(0.05, 0.45, 0.05)')
code = code.replace('leg.position.set(pos[0], 0.3, pos[1])', 'leg.position.set(pos[0], 0.225, pos[1])')
code = code.replace('new THREE.BoxGeometry(0.8, 0.6, 0.1)', 'new THREE.BoxGeometry(0.4, 0.4, 0.05)')
code = code.replace('back.position.set(0, 0.9, -0.35)', 'back.position.set(0, 0.65, -0.175)')
# Bed
code = code.replace('new THREE.BoxGeometry(2, 0.5, 3)', 'new THREE.BoxGeometry(1.6, 0.4, 2.0)')
code = code.replace('base.position.y = 0.25', 'base.position.y = 0.2')
# Door
code = code.replace('new THREE.BoxGeometry(1.5, 3.0, 0.2)', 'new THREE.BoxGeometry(0.9, 2.0, 0.1)')
code = code.replace('mesh.position.y = 1.5', 'mesh.position.y = 1.0')
# Fridge
code = code.replace('new THREE.BoxGeometry(1.2, 2.5, 1.2)', 'new THREE.BoxGeometry(0.8, 1.8, 0.7)')
code = code.replace('mesh.position.y = 1.25', 'mesh.position.y = 0.9')
# TV
code = code.replace('new THREE.BoxGeometry(1.5, 1.0, 0.2)', 'new THREE.BoxGeometry(1.0, 0.6, 0.1)')
code = code.replace('mesh.position.y = 1.0', 'mesh.position.y = 0.6')
# Sofa
code = code.replace('new THREE.BoxGeometry(2.5, 0.4, 1.0)', 'new THREE.BoxGeometry(2.0, 0.4, 0.8)')
code = code.replace('seat.position.y = 0.4', 'seat.position.y = 0.2')
code = code.replace('new THREE.BoxGeometry(2.5, 1.0, 0.3)', 'new THREE.BoxGeometry(2.0, 0.8, 0.2)')
code = code.replace('back.position.set(0, 0.9, -0.35)', 'back.position.set(0, 0.6, -0.3)')
# Wardrobe
code = code.replace('new THREE.BoxGeometry(1.5, 3.0, 1.0)', 'new THREE.BoxGeometry(1.0, 2.0, 0.6)')
code = code.replace('mesh.position.y = 1.5', 'mesh.position.y = 1.0')
# Dresser
code = code.replace('new THREE.BoxGeometry(1.5, 1.5, 0.8)', 'new THREE.BoxGeometry(1.0, 0.9, 0.4)')
code = code.replace('mesh.position.y = 0.75', 'mesh.position.y = 0.45')

with open('psx.js', 'w', encoding='utf-8') as f:
    f.write(code)
print('Done!')
