from PIL import Image
import glob
import os

folder = 'd:/folder/tools/money/magic-clip/docs/'
screenshots = glob.glob(folder + 'screenshot-*.png')

target_w = 1280
target_h = 800
target_ratio = target_w / target_h

for file in screenshots:
    try:
        img = Image.open(file)
        
        # Original dimensions
        w, h = img.size
        ratio = w / h
        
        # Calculate cropping box to maintain aspect ratio without stretching
        if ratio > target_ratio:
            # Image is wider than target ratio
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            right = left + new_w
            top = 0
            bottom = h
        else:
            # Image is taller than target ratio
            new_h = int(w / target_ratio)
            top = (h - new_h) // 2
            bottom = top + new_h
            left = 0
            right = w
            
        img_cropped = img.crop((left, top, right, bottom))
        img_resized = img_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Convert to RGB to remove alpha channel (transparency) as required by Chrome Web Store
        img_final = img_resized.convert('RGB')
        
        base_name = os.path.basename(file)
        new_name = 'cws_' + base_name
        
        # Save as high quality JPEG to strictly meet "No Alpha" requirement easily
        img_final.save(os.path.join(folder, new_name.replace('.png', '.jpg')), 'JPEG', quality=95)
        print(f"Processed: {base_name} -> {new_name.replace('.png', '.jpg')}")
    except Exception as e:
        print(f"Error processing {file}: {e}")

print("All screenshots processed successfully!")
