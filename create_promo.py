from PIL import Image, ImageDraw, ImageFont
import os

font_path = 'C:/Windows/Fonts/segoeuib.ttf'
if not os.path.exists(font_path):
    font_path = 'C:/Windows/Fonts/arialbd.ttf'

# 1. Create Small Promo Tile (440x280)
w, h = 440, 280
img_small = Image.new('RGB', (w, h))
draw = ImageDraw.Draw(img_small)
# Gradient background
for y in range(h):
    r = int(99 - (99 - 6) * (y / h))
    g = int(102 + (182 - 102) * (y / h))
    b = int(241 - (241 - 212) * (y / h))
    draw.line([(0, y), (w, y)], fill=(r, g, b))

# Paste Icon
icon = Image.open('d:/folder/tools/money/magic-clip/icons/icon-128.png').convert('RGBA')
icon_w, icon_h = icon.size
img_small.paste(icon, ((w - icon_w) // 2, 40), icon)

# Draw Text
try:
    font = ImageFont.truetype(font_path, 32)
    text = "NeoClip"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    draw.text(((w - text_w) // 2, 190), text, font=font, fill=(255, 255, 255))
except Exception as e:
    print(e)

img_small.save('d:/folder/tools/money/magic-clip/small_promo.png')

# 2. Create Marquee Promo Tile (1400x560)
w, h = 1400, 560
img_large = Image.new('RGB', (w, h))
draw = ImageDraw.Draw(img_large)
# Gradient background
for y in range(h):
    r = int(99 - (99 - 6) * (y / h))
    g = int(102 + (182 - 102) * (y / h))
    b = int(241 - (241 - 212) * (y / h))
    draw.line([(0, y), (w, y)], fill=(r, g, b))

# Paste Icon (Upscaled)
icon_large = icon.resize((256, 256), Image.Resampling.LANCZOS)
icon_w, icon_h = icon_large.size
img_large.paste(icon_large, ((w - icon_w) // 2, 80), icon_large)

# Draw Text
try:
    font = ImageFont.truetype(font_path, 72)
    text = "NeoClip"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    draw.text(((w - text_w) // 2, 370), text, font=font, fill=(255, 255, 255))
    
    font_sub = ImageFont.truetype(font_path, 36)
    subtext = "Smart Clipboard Manager"
    bbox_sub = draw.textbbox((0, 0), subtext, font=font_sub)
    sub_w = bbox_sub[2] - bbox_sub[0]
    draw.text(((w - sub_w) // 2, 460), subtext, font=font_sub, fill=(255, 255, 255, 200))
except Exception as e:
    print(e)

img_large.save('d:/folder/tools/money/magic-clip/marquee_promo.png')
print("Promo images created successfully!")
