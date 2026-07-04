from PIL import Image, ImageFilter, ImageDraw
import glob
import os

folder = 'd:/folder/tools/money/magic-clip/docs/'
screenshots = glob.glob(folder + 'screenshot-*.png')

target_w = 1280
target_h = 800
content_w = 1100
content_h = 680
content_ratio = content_w / content_h

for file in screenshots:
    try:
        if 'cws_pad' in file or 'edge_' in file: continue
        img = Image.open(file).convert('RGBA')
        w, h = img.size
        ratio = w / h
        
        if ratio > content_ratio:
            new_w = content_w
            new_h = int(new_w / ratio)
        else:
            new_h = content_h
            new_w = int(new_h * ratio)
            
        img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        bg = Image.new('RGB', (target_w, target_h))
        draw = ImageDraw.Draw(bg)
        for y in range(target_h):
            r = int(99 - (99 - 6) * (y / target_h))
            g = int(102 + (182 - 102) * (y / target_h))
            b = int(241 - (241 - 212) * (y / target_h))
            draw.line([(0, y), (target_w, y)], fill=(r, g, b))
            
        shadow_padding = 40
        shadow = Image.new('RGBA', (new_w + shadow_padding*2, new_h + shadow_padding*2), (0,0,0,0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.rectangle([shadow_padding, shadow_padding, new_w+shadow_padding, new_h+shadow_padding], fill=(0,0,0,100))
        shadow = shadow.filter(ImageFilter.GaussianBlur(15))
        
        shadow_x = (target_w - (new_w + shadow_padding*2)) // 2
        shadow_y = (target_h - (new_h + shadow_padding*2)) // 2 + 10
        bg.paste(shadow, (shadow_x, shadow_y), shadow)
        
        img_x = (target_w - new_w) // 2
        img_y = (target_h - new_h) // 2
        bg.paste(img_resized, (img_x, img_y), img_resized)
        
        img_final = bg.convert('RGB') # Strictly RGB, no Alpha
        
        base_name = os.path.basename(file)
        new_name = 'edge_' + base_name
        
        img_final.save(os.path.join(folder, new_name), 'PNG')
        print(f"Processed: {base_name} -> {new_name}")
    except Exception as e:
        print(f"Error processing {file}: {e}")

print("All screenshots saved as STRICT PNG for Edge!")
