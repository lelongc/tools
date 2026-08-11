def videoscribe_escape(s):
    """Escape for VideoScribe XML attributes. Only escape < and " and &, keep > raw."""
    s = s.replace('&', '&amp;')
    s = s.replace('<', '&lt;')
    s = s.replace('"', '&quot;')
    # DO NOT escape > - VideoScribe requires raw >
    return s

def generate_scribe_project():
    import random
    import shutil
    import re
    import os
    import json
    import glob
    
    if not os.path.exists("scene_metadata.json"): return
    with open("scene_metadata.json", "r", encoding="utf-8") as f:
        meta_data = json.load(f)

    BUILD_DIR = "scribe_build"
    os.makedirs(BUILD_DIR, exist_ok=True)
    
    for item in os.listdir(BUILD_DIR):
        item_path = os.path.join(BUILD_DIR, item)
        if os.path.isfile(item_path): os.remove(item_path)
            
    # CHUYỂN ĐỔI CHUẨN ĐỊNH DẠNG MP3 (CBR 44.1kHz) BẰNG FFMPEG ĐỂ TRÁNH LỖI ĐƠ SPINNER VIDEOSCRIBE
    has_audio = False
    mp3_files = glob.glob("*.mp3")
    if mp3_files:
        preferred = next((f for f in mp3_files if "voice" in f.lower()), mp3_files[0])
        target_audio = os.path.join(BUILD_DIR, "voiceover.mp3")
        
        # Dùng ffmpeg chuẩn hóa MP3 về CBR 128kbps 44100Hz (VideoScribe bắt buộc chuẩn này để không treo)
        cmd = f'ffmpeg -y -i "{preferred}" -ar 44100 -ac 1 -b:a 128k "{target_audio}" >/dev/null 2>&1'
        ret = os.system(cmd)
        
        if ret == 0 and os.path.exists(target_audio) and os.path.getsize(target_audio) > 0:
            has_audio = True
            print("🔊 Đã chuẩn hóa MP3 sang chuẩn VideoScribe (CBR 44.1kHz) thành công!")
        else:
            shutil.copy(preferred, target_audio)
            has_audio = True
            print("⚠️ Copy trực tiếp file MP3.")
        
    xml_path = os.path.join(BUILD_DIR, "drawing.xml")
    
    with open(xml_path, "w", encoding="utf-8") as f:
        audio_attr = 'voiceOver="voiceover.mp3" voiceOverVolume="1"' if has_audio else ''
        options_val = '&lt;drawingOptions paperStyle=&quot;1&quot; paperColour=&quot;16777215&quot; threeDMode=&quot;no&quot; loopSound=&quot;no&quot; zoomAtEnd=&quot;no&quot; vignette=&quot;0&quot; xPerspective=&quot;0&quot; yPerspective=&quot;0&quot; zPerspective=&quot;0&quot;/>'
        f.write(f'<drawing app="VideoScribe" ver="3.7.3103" filever="5" name="Auto Project" desc="" tags="" uniqueID="1048856588" isDescendedFromTemplate="not_desc" defaultHandMD5="default_right" options="{options_val}" backingTrack="" lastRenderDateTime="Invalid Date" {audio_attr}>\n')
        
        scene_spacing = 1500
        element_counter = 1095000000
        
        # 1 CÂU THOẠI = 1 CẢNH CAMERA (MÁY QUAY KHÓA CỐ ĐỊNH TRONG SUỐT CÂU THOẠI)
        xml_elements = []
        visual_timeline_ms = 0
        for sentence_idx, sentence in enumerate(meta_data):
            scene_x = scene_spacing * (sentence_idx % 4)
            scene_y = scene_spacing * int(sentence_idx / 4)
            
            raw_images = sentence.get('images', [])
            if not raw_images: continue
            
            cam_scale = 0.82
            cam_x = 448.5 - scene_x * cam_scale
            cam_y = 252.5 - scene_y * cam_scale
            
            # --- TIMING SYNC LOGIC ---
            start_ms = int(sentence['start'] * 1000)
            if visual_timeline_ms < start_ms and len(xml_elements) > 0:
                gap_ms = start_ms - visual_timeline_ms
                # Find pauseTime in the last element and add gap_ms to it
                import re as regex
                last_elem = xml_elements[-1]
                match = regex.search(r'pauseTime="(\d+)"', last_elem)
                if match:
                    old_pause = int(match.group(1))
                    new_pause = old_pause + gap_ms
                    xml_elements[-1] = last_elem[:match.start(1)] + str(new_pause) + last_elem[match.end(1):]
                visual_timeline_ms += gap_ms
            
            sentence_duration = sentence['end'] - sentence['start']
            n = len(raw_images)
            duration_per_img = sentence_duration / n

            # --- TIMING SYNC LOGIC ---
            start_ms = int(sentence['start'] * 1000)
            if visual_timeline_ms < start_ms and len(xml_elements) > 0:
                gap_ms = start_ms - visual_timeline_ms
                import re as regex
                last_elem = xml_elements[-1]
                match = regex.search(r'pauseTime="(\d+)"', last_elem)
                if match:
                    old_pause = int(match.group(1))
                    new_pause = old_pause + gap_ms
                    xml_elements[-1] = last_elem[:match.start(1)] + str(new_pause) + last_elem[match.end(1):]
                visual_timeline_ms += gap_ms

            
            for i, img_meta in enumerate(raw_images):
                file_path = os.path.join(ASSETS_DIR, img_meta['file_name'])
                alt_svg = os.path.join(ASSETS_DIR, img_meta['file_name'].split('.')[0] + '.svg')
                alt_png = os.path.join(ASSETS_DIR, img_meta['file_name'].split('.')[0] + '.png')
                
                if os.path.exists(alt_svg): file_path = alt_svg
                elif os.path.exists(alt_png): file_path = alt_png
                elif not os.path.exists(file_path): continue
                
                is_svg = file_path.endswith('.svg')
                actual_filename = os.path.basename(file_path)
                
                if is_svg:
                    with open(file_path, "r", encoding="utf-8") as f2:
                        raw_svg = f2.read(); raw_svg = re.sub(r'<\?xml[^>]*\?>', '', raw_svg); raw_svg = re.sub(r'<!DOCTYPE[^>]*>', '', raw_svg); raw_svg = re.sub(r'<!--.*?-->', '', raw_svg, flags=re.DOTALL); content = raw_svg.replace('\n', ' ').replace('\r', '')
                else:
                    import base64
                    with open(file_path, "rb") as f2:
                        b64_data = base64.b64encode(f2.read()).decode('ascii')
                    content = f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><image href="data:image/png;base64,{b64_data}" width="800" height="800"/></svg>'
                    
                element_counter += random.randint(1000, 5000)
                
                if n == 1:
                    pos_x, pos_y = scene_x, scene_y
                    scale_val = "0.8"
                elif n == 2:
                    pos_x = scene_x + (-250 if i == 0 else 250)
                    pos_y = scene_y
                    scale_val = "0.55"
                else:
                    if i == 0: pos_x, pos_y = scene_x, scene_y - 120
                    elif i == 1: pos_x, pos_y = scene_x - 220, scene_y + 120
                    else: pos_x, pos_y = scene_x + 220, scene_y + 120
                    scale_val = "0.45"

                    
                elem_type = 'drawing'
                ai_style = img_meta.get('animation_style', 'draw')
                ai_pace = img_meta.get('pace', 'normal')
                ai_color = img_meta.get('color_filter', 'normal')
                
                if ai_style == 'draw': draw_style = 'draw_style_normal'
                elif ai_style in ['movein_hand', 'movein_nohand']: draw_style = 'draw_style_movein'
                elif ai_style == 'fadein': draw_style = 'draw_style_fadein'
                else: draw_style = 'draw_style_normal'
                
                if not is_svg and ai_style == 'draw': draw_style = 'draw_style_movein'
                
                movin_compass = str(random.randint(1, 8))
                draw_detail = 'yes' if draw_style == 'draw_style_normal' else 'no'
                movin_arc = random.choice(['0', '1']) if draw_style == 'draw_style_movein' else '0'
                
                total_time_ms = int(duration_per_img * 1000)
                trans_time_ms = min(400, int(total_time_ms * 0.2))
                target_time_ms = min(3000, int(total_time_ms * 0.6))
                pause_time_ms = max(0, total_time_ms - trans_time_ms - target_time_ms)
                
                color_effect = '2' if ai_color == 'greyscale' else '0'
                drawing_xml_attr = f'drawingXML="{videoscribe_escape(content)}"'
                
                element_xml = (
                    f'  <element elementType="{elem_type}" descName="" elementID="{element_counter}" '
                    f'splitTextField="no" drawingText="" fontName="null" {drawing_xml_attr} '
                    f'customHandMD5="" colourEffect="{color_effect}" targetTime="{target_time_ms}" '
                    f'pauseTime="{pause_time_ms}" transitionTime="{trans_time_ms}" '
                    f'drawStyle="{draw_style}" rotation="0" visible="true" '
                    f'currentPosX="{pos_x}" currentPosY="{pos_y}" offsetX="{pos_x}" offsetY="{pos_y}" '
                    f'scalesX="{scale_val}" scalesY="{scale_val}" theScale="{scale_val}" targetHeight="800" '
                    f'movinCompass="{movin_compass}" movinFlow="0" movinArc="{movin_arc}" movinAllowRotate="yes" '
                    f'drawDetail="{draw_detail}" sketchStyle="no" brush="0" brushOptions="0" opacity="1" '
                    f'textColour="-1" textAlign="left" textBackwards="no" rtlLanguage="no" textSpacing="0" '
                    f'flipHoriz="no" flipVert="no" locked="no" calligraphy_angle="45" keepRunning="no" '
                    f'loopOptions="Fit to Time" blendMode="normal" filters="&lt;filters/>" morphFromID="0" '
                    f'morphCamera="no" morphRemoveOld="yes" cameraPositionX="{cam_x}" cameraPositionY="{cam_y}" '
                    f'cameraScale="{cam_scale}" cameraCanvasWid="897.7777777777778" cameraCanvasHei="505" '
                    f'availableRecolours="&lt;availableRecolours/>" recolouringSchemes="&lt;recolouringSchemes/>" '
                    f'skinTone="-1" hairColour="-1" highlightColour="-1" customColour1="-1" customColour2="-1" '
                    f'originalOutlineColour="0" greyscaleContrast="70" />\n'
                )
                xml_elements.append(element_xml)
            
        f.write('\n'.join(xml_elements) + '\n')
        f.write('</drawing>')

    output_filename = "Auto_Project.scribe"
    import zipfile
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(BUILD_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, BUILD_DIR)
                zipf.write(file_path, arcname)
                    
    print(f"\n🎉 ĐÃ HOÀN TẤT! File dự án: {output_filename} (Fixed Audio Spinner Hang!)")

    # === CRITICAL POST-PROCESSING: Fix &gt; -> > for VideoScribe ===
    # VideoScribe CANNOT parse &gt; entities - it freezes/hangs!
    # Python's xml/html libraries always escape > to &gt; which breaks VS.
    import tempfile
    tmp_path = output_filename + '.tmp'
    with zipfile.ZipFile(output_filename, 'r') as zin:
        with zipfile.ZipFile(tmp_path, 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                if item.filename == 'drawing.xml':
                    xml_text = data.decode('utf-8')
                    count_before = xml_text.count('&gt;')
                    xml_text = xml_text.replace('&gt;', '>')
                    data = xml_text.encode('utf-8')
                    if count_before > 0:
                        print(f'Post-fix: replaced {count_before} &gt; entities with raw >')
                zout.writestr(item, data)
    os.replace(tmp_path, output_filename)

generate_scribe_project()
