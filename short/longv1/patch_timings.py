import json
import re

def patch():
    with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
        nb = json.load(f)
        
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            new_source = []
            for line in cell['source']:
                if "target_time_ms = max(500, min(1800, int(duration_per_img * 500)))" in line:
                    new_line = line.replace(
                        "target_time_ms = max(500, min(1800, int(duration_per_img * 500)))",
                        "total_time_ms = int(duration_per_img * 1000)\n                trans_time_ms = min(400, int(total_time_ms * 0.2))\n                target_time_ms = min(3000, int(total_time_ms * 0.6))\n                pause_time_ms = max(0, total_time_ms - trans_time_ms - target_time_ms)"
                    )
                    new_source.append(new_line)
                    print("Patched target_time_ms line!")
                elif "pause_time_ms = 400" in line:
                    # Remove this line, it's already defined above
                    pass
                elif "trans_time_ms = 400" in line:
                    # Remove this line, it's already defined above
                    pass
                else:
                    new_source.append(line)
            cell['source'] = new_source
            
    with open('auto_scribe.ipynb', 'w', encoding='utf-8') as f:
        json.dump(nb, f, indent=2)
        print("Notebook saved with better timings.")

if __name__ == '__main__':
    patch()
