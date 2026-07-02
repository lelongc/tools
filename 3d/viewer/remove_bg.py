from PIL import Image
import numpy as np

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    r, g, b, a = data.T
    
    # Calculate brightness / luminosity
    # We use the max value of the RGB channels as the alpha, or a weighted average
    # Since it's a glowing cyan image, the blue/green channels will be high.
    # The higher the brightness, the more opaque it is.
    # To keep the cyan color solid, we need to map black (0,0,0) to alpha=0,
    # and anything bright to alpha=255.
    
    # Let's use max(r,g,b) as a base alpha, but amplify it so it doesn't look semi-transparent.
    max_rgb = np.maximum(np.maximum(r, g), b)
    
    # Create a smooth alpha mask: 0-50 maps to 0-255 (to keep it crisp but anti-aliased)
    alpha = np.clip(max_rgb.astype(int) * 3, 0, 255).astype(np.uint8)
    
    data[..., 3] = alpha.T
    
    # Optional: we can boost the RGB values slightly to compensate for the blend
    
    img_out = Image.fromarray(data)
    img_out.save(output_path)
    print("Saved transparent sprite to", output_path)

remove_black_background("assets/spritesheet.png", "assets/spritesheet_alpha.png")
