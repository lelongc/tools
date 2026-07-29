import re

with open('anime_short.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update PROMPT_TEMPLATE
content = re.sub(
    r'"""You are an expert anime content creator(.*?)Return EXACTLY 30 scenes with 30 UNIQUE search queries\."""',
    '"""You are an expert anime content creator who makes viral YouTube Shorts about hidden anime lore. Write an engaging narration script about: "{topic}"\n\n'
    'RULES:\n'
    '- ACCURATE anime lore only. 150-165 words. Short punchy sentences.\n'
    '- Opening Hook ~25w, Body ~110w, Closing ~25w.\n'
    '- EXACTLY 30 scenes, each ~2s.\n'
    '- CRITICAL: Every scene MUST have a DIFFERENT, SPECIFIC visual search query (3-5 words).\n'
    '- DO NOT repeat search queries! Include specific forms, actions, skills, or secondary characters.\n'
    '- Anime context: {anime_name}. Examples of characters/queries to include: {example_chars}.\n\n'
    'OUTPUT (valid JSON only):\n'
    '{{\n'
    '  "word_count": 160, "anime_title": "Name",\n'
    '  "script": "Full narration.",\n'
    '  "tts_script": "TTS version.",\n'
    '  "scenes": [{{"text": "scene text", "search_query": "Specific Scene Search Query"}}]\n'
    '}}\n'
    'Return EXACTLY 30 scenes with 30 UNIQUE search queries."""',
    content,
    flags=re.DOTALL
)

# 2. Update generate_script definition
content = content.replace(
    'def generate_script(topic, api_key):',
    'def generate_script(topic, api_key, anime_name, char_dict):'
)
content = content.replace(
    'PROMPT_TEMPLATE.format(topic=topic)',
    'PROMPT_TEMPLATE.format(topic=topic, anime_name=anime_name, example_chars=", ".join(list(char_dict.keys())[:10]) if char_dict else "Goku, Naruto")'
)

# 3. Update download_single_scene_media signature
content = content.replace(
    'def download_single_scene_media(idx: int, scene: dict, images_dir: Path, used_urls: set, used_hashes: set) -> tuple:',
    'def download_single_scene_media(idx: int, scene: dict, images_dir: Path, used_urls: set, used_hashes: set, anime_name: str, char_dict: dict) -> tuple:'
)
content = content.replace(
    'def download_scene(idx, scene, img_dir, used_urls, used_hashes):',
    'def download_scene(idx, scene, img_dir, used_urls, used_hashes, anime_name, char_dict):'
)

# 4. Replace char_map
old_char_logic = '''    # Phase 0: Ưu tiên lấy từ Drive /content/drive/MyDrive/anime_library/Tensei_Slime/<Character>/
    drive_lib_ts = Path("/content/drive/MyDrive/anime_library/Tensei_Slime")
    drive_lib_root = Path("/content/drive/MyDrive/anime_library")
    local_lib_ts = Path(__file__).parent / "anime_library" / "Tensei_Slime"
    local_lib_root = Path(__file__).parent / "anime_library"
    lib_bases = [drive_lib_ts, drive_lib_root, local_lib_ts, local_lib_root]

    q_low = query.lower()
    matched_folder = None
    char_map = {
        "rimuru": "Rimuru_Tempest", "veldora": "Veldora_Tempest", "milim": "Milim_Nava",
        "sage": "Great_Sage_Raphael", "raphael": "Great_Sage_Raphael", "ciel": "Great_Sage_Raphael",
        "benimaru": "Benimaru", "shion": "Shion", "shuna": "Shuna", "souei": "Souei",
        "hakurou": "Hakurou", "kurobei": "Kurobei", "diablo": "Diablo", "testarossa": "Testarossa",
        "carrera": "Carrera", "ultima": "Ultima", "guy": "Guy_Crimson", "velgrynd": "Velgrynd",
        "velzard": "Velzard", "chloe": "Chloe_Aubert", "shizue": "Shizue_Izawa", "shizu": "Shizue_Izawa",
        "gobta": "Gobta", "ranga": "Ranga", "luminous": "Luminous_Valentine", "tempest": "Tempest_City",
        "city": "Tempest_City", "capital": "Tempest_City"
    }
    for key, folder in char_map.items():
        if key in q_low: matched_folder = folder; break'''

new_char_logic = '''    # Phase 0: Ưu tiên lấy từ Drive
    drive_lib = Path(f"/content/drive/MyDrive/anime_library/{anime_name}")
    local_lib = Path(__file__).parent / "anime_library" / anime_name
    lib_bases = [drive_lib, local_lib]

    q_low = query.lower()
    matched_folder = None
    for key in char_dict.keys():
        fw = key.lower().replace("_", " ").split()[0]
        if fw in q_low: matched_folder = key; break'''

content = content.replace(old_char_logic, new_char_logic)

# Replace the other version of char_map if present
old_char_logic2 = '''    # Phase 0: Ưu tiên lấy ảnh từ Thư mục Google Drive do bạn quản lý (anime_library/Tensei_Slime/)
    drive_lib_ts = Path("/content/drive/MyDrive/anime_library/Tensei_Slime")
    drive_lib_root = Path("/content/drive/MyDrive/anime_library")
    local_lib_ts = Path(__file__).parent / "anime_library" / "Tensei_Slime"
    local_lib_root = Path(__file__).parent / "anime_library"

    lib_bases = [drive_lib_ts, drive_lib_root, local_lib_ts, local_lib_root]

    q_low = query.lower()
    matched_folder = None
    char_map = {
        "rimuru": "Rimuru_Tempest",
        "veldora": "Veldora_Tempest",
        "milim": "Milim_Nava",
        "sage": "Great_Sage_Raphael",
        "raphael": "Great_Sage_Raphael",
        "ciel": "Great_Sage_Raphael",
        "benimaru": "Benimaru",
        "shion": "Shion",
        "shuna": "Shuna",
        "souei": "Souei",
        "hakurou": "Hakurou",
        "kurobei": "Kurobei",
        "diablo": "Diablo",
        "testarossa": "Testarossa",
        "carrera": "Carrera",
        "ultima": "Ultima",
        "guy": "Guy_Crimson",
        "velgrynd": "Velgrynd",
        "velzard": "Velzard",
        "chloe": "Chloe_Aubert",
        "shizue": "Shizue_Izawa",
        "shizu": "Shizue_Izawa",
        "gobta": "Gobta",
        "ranga": "Ranga",
        "luminous": "Luminous_Valentine",
        "tempest": "Tempest_City",
        "city": "Tempest_City",
        "capital": "Tempest_City"
    }
    for key, folder in char_map.items():
        if key in q_low:
            matched_folder = folder
            break'''
            
new_char_logic2 = '''    # Phase 0: Ưu tiên lấy từ Drive
    drive_lib = Path(f"/content/drive/MyDrive/anime_library/{anime_name}")
    local_lib = Path(__file__).parent / "anime_library" / anime_name
    lib_bases = [drive_lib, local_lib]

    q_low = query.lower()
    matched_folder = None
    for key in char_dict.keys():
        fw = key.lower().replace("_", " ").split()[0]
        if fw in q_low: matched_folder = key; break'''
        
content = content.replace(old_char_logic2, new_char_logic2)

# 5. fetch_images and fetch_scene_images_parallel
content = content.replace(
    'def fetch_images(scenes, img_dir):',
    'def fetch_images(scenes, img_dir, anime_name, char_dict):'
)
content = content.replace(
    'def fetch_scene_images_parallel(scenes: list, images_dir: Path) -> list:',
    'def fetch_scene_images_parallel(scenes: list, images_dir: Path, anime_name: str, char_dict: dict) -> list:'
)
content = content.replace(
    'ex.submit(download_scene, i, sc, img_dir, used_urls, used_hashes)',
    'ex.submit(download_scene, i, sc, img_dir, used_urls, used_hashes, anime_name, char_dict)'
)
content = content.replace(
    'executor.submit(download_single_scene_media, i, sc, images_dir, used_urls, used_hashes)',
    'executor.submit(download_single_scene_media, i, sc, images_dir, used_urls, used_hashes, anime_name, char_dict)'
)

# 6. main args
content = content.replace(
    'parser.add_argument("--topic","-t",required=True)',
    'parser.add_argument("--topic","-t",required=True)\n    parser.add_argument("--anime","-a",required=True)'
)
content = content.replace(
    'parser.add_argument("--topic", "-t", required=True)',
    'parser.add_argument("--topic", "-t", required=True)\n    parser.add_argument("--anime", "-a", required=True)'
)

# 7. main body logic
main_logic_old = '''    data = generate_script(args.topic, args.api_key)
    script = data.get('script','')'''
main_logic_new = '''    config_path = Path("/content/drive/MyDrive/anime_library/anime_characters_config.json")
    if not config_path.exists(): config_path = Path(__file__).parent / "anime_characters_config.json"
    try:
        import json
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except:
        config = {args.anime: {}}
    char_dict = config.get(args.anime, {})
    data = generate_script(args.topic, args.api_key, args.anime, char_dict)
    script = data.get('script','')'''
content = content.replace(main_logic_old, main_logic_new)

main_logic_old2 = '''    data = generate_script(args.topic, args.api_key)
    script, scenes = data.get('script', ''), data.get('scenes', [])'''
main_logic_new2 = '''    config_path = Path("/content/drive/MyDrive/anime_library/anime_characters_config.json")
    if not config_path.exists(): config_path = Path(__file__).parent / "anime_characters_config.json"
    try:
        import json
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except:
        config = {args.anime: {}}
    char_dict = config.get(args.anime, {})
    data = generate_script(args.topic, args.api_key, args.anime, char_dict)
    script, scenes = data.get('script', ''), data.get('scenes', [])'''
content = content.replace(main_logic_old2, main_logic_new2)

content = content.replace(
    'fetch_images(scenes, img_dir)',
    'fetch_images(scenes, img_dir, args.anime, char_dict)'
)
content = content.replace(
    'fetch_scene_images_parallel(scenes, img_dir)',
    'fetch_scene_images_parallel(scenes, img_dir, args.anime, char_dict)'
)

with open('anime_short.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated anime_short.py")
