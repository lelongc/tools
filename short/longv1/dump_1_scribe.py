import zipfile
import xml.etree.ElementTree as ET

path = r'd:\folder\tools\short\longv1\proj\1.scribe'
with zipfile.ZipFile(path, 'r') as z:
    xml_data = z.read('drawing.xml').decode('utf-8')
    root = ET.fromstring(xml_data)
    
    print("=== ROOT ATTRIBUTES ===")
    for k, v in root.attrib.items():
        print(f"{k} = {v!r}")
        
    elements = root.findall('element')
    print(f"\n=== TOTAL ELEMENTS: {len(elements)} ===")
    
    # Print statistics of elements
    types = {}
    draw_styles = {}
    scales = []
    cam_scales = []
    target_times = []
    pause_times = []
    trans_times = []
    
    for el in elements:
        t = el.get("elementType")
        types[t] = types.get(t, 0) + 1
        ds = el.get("drawStyle")
        draw_styles[ds] = draw_styles.get(ds, 0) + 1
        scales.append(float(el.get("theScale", 1.0)))
        cam_scales.append(float(el.get("cameraScale", 1.0)))
        target_times.append(int(el.get("targetTime", 0)))
        pause_times.append(int(el.get("pauseTime", 0)))
        trans_times.append(int(el.get("transitionTime", 0)))
        
    print("Element Types:", types)
    print("Draw Styles:", draw_styles)
    print(f"theScale range: min={min(scales):.3f}, max={max(scales):.3f}, avg={sum(scales)/len(scales):.3f}")
    print(f"cameraScale range: min={min(cam_scales):.3f}, max={max(cam_scales):.3f}, avg={sum(cam_scales)/len(cam_scales):.3f}")
    print(f"targetTime range: min={min(target_times)}, max={max(target_times)}, avg={sum(target_times)/len(target_times):.1f}")
    print(f"pauseTime range: min={min(pause_times)}, max={max(pause_times)}, avg={sum(pause_times)/len(pause_times):.1f}")
    print(f"transitionTime range: min={min(trans_times)}, max={max(trans_times)}, avg={sum(trans_times)/len(trans_times):.1f}")
